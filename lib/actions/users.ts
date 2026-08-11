"use server";

import {
  deleteUserAvatar,
  followUserTransaction,
  updateAvatarTransaction,
  updateUserBio,
} from "@/app/services/users";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { ActionResult, UploadAvatar, UserBio } from "@/lib/definitations";
import z from "zod";
import { auth } from "@/auth";

export async function userFollows(
  user: { id: number; username: string },
  userToFollow: { id: number; username: string },
  pathname: string,
): Promise<ActionResult | undefined> {
  try {
    await followUserTransaction(user.id, userToFollow.id);
    revalidatePath(`${pathname}`);
    revalidatePath(`/${user.username}`);
    revalidatePath(`/${userToFollow.username}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "A Problem has occured! Please try again!",
    };
  }
}
export async function avatarUpload(
  user: { id: number; username: string },
  formData: FormData,
): Promise<UploadAvatar> {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      return { status: "error", message: "No file Selected." };
    }
    // 1. Enforce strict server-side file safety limits (Crucial for resume pieces)
    const MAX_SIZE = 3 * 1024 * 1024; // 3MB limit
    if (file.size > MAX_SIZE) {
      return {
        status: "error",
        message: "File is too large. (Max 3MB)",
      };
    }

    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        status: "error",
        message: "Invalid format. Only JPEG, PNG, WEBP, and GIFs are allowed.",
      };
    }

    // 2. Parse binary stream and build unique name to avoid system overrides
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const field = crypto.randomUUID();
    const filePath = `${field}-${file.name}`;

    // 3. Admin bypass upload into your public storage container
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false, // Prevent file overwriting
      });

    if (error) return { status: "error", message: error.message };

    // 4. Synchronously retrieve CDN link string
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(data.path);

    // update the user in db
    await updateAvatarTransaction(user.id, filePath, urlData.publicUrl);

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${user.username}`);
    revalidatePath(`/${user.username}/status`);
    // 5. Success return (Ready to save directly inside your postgres posts table)
    return {
      status: "success",
      message: "Profile successfully updated!",
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Storage error context:", error);
    return {
      status: "error",
      message: "Error updating profile! Please try again!",
    };
  }
}
export async function deleteAvatar(user: {
  id: number;
  username: string;
  avatarId: number | null;
  avatar: {
    fileName: string;
    publicUrl: string;
  } | null;
}): Promise<ActionResult> {
  if (!user.avatarId) {
    return { status: "error", message: "Avatar doesn't exist!" };
  }
  // delete the avatar file from supabase storage
  const { error } = await supabase.storage
    .from("avatars")
    .remove([user.avatar!.fileName]);
  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
  try {
    // delete the db record
    await deleteUserAvatar(user.avatarId);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Unable to delete avatar! Please try again!",
    };
  }
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/${user.username}`);
  revalidatePath(`/${user.username}/status`);
  return {
    status: "success",
    message: "Profile successfully updated!",
  };
}

const UserBioSchema = z.object({
  bio: z.string().trim().min(1, "Bio is required"),
});
export async function updateBio(formData: FormData): Promise<UserBio> {
  const session = await auth();
  const validatedBio = UserBioSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedBio.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedBio.error).fieldErrors,
    };
  }
  const { bio: newUserBio } = validatedBio.data;

  try {
    await updateUserBio(Number(session?.user?.id), newUserBio);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to updated profile! Please try again!",
    };
  }
  revalidatePath(`/${session?.user?.email}`);
  return {
    status: "success",
    message: "Profile successfully updated!",
  };
}
