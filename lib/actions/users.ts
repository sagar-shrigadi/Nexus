"use server";

import {
  deleteUserAvatar,
  followUserTransaction,
  getUserAvatarIdByUserId,
  updateAvatarTransaction,
  updateUserBio,
} from "@/app/services/users";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import type {
  ActionResult,
  DeleteAvatar,
  UploadAvatar,
  UserBio,
} from "@/lib/definitations";
import z from "zod";
import { requireAuth } from "@/lib/actions/auth";

export async function userFollows(
  userToFollow: { id: number; username: string },
  pathname: string,
): Promise<ActionResult | undefined> {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  try {
    await followUserTransaction(Number(sessionUser.id), userToFollow.id);
    revalidatePath(`${pathname}`);
    revalidatePath(`/${sessionUser.email}`);
    revalidatePath(`/${userToFollow.username}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "A Problem has occured! Please try again!",
    };
  }
}
const AvatarUploadSchema = z.object({
  file: z.file().optional(),
});
export async function avatarUpload(formData: FormData): Promise<UploadAvatar> {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  const validatedAvatar = AvatarUploadSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedAvatar.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedAvatar.error).fieldErrors,
    };
  }

  const { file } = validatedAvatar.data;
  if (!file || file.size === 0) {
    return { status: "error", errors: { file: ["No file selected!"] } };
  }
  // 1. Enforce strict server-side file safety limits (Crucial for resume pieces)
  const MAX_SIZE = 3 * 1024 * 1024; // 3MB limit
  if (file.size > MAX_SIZE) {
    return {
      status: "error",
      errors: { file: ["File size too large. (MAX 3MB)"] },
      message: "File is too large. (Max 3MB)",
    };
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      status: "error",
      errors: { file: ["Invalid File format!"] },
      message: "Invalid format. Only JPEG, PNG, WEBP, and GIFs are allowed.",
    };
  }

  // 2. Parse binary stream and build unique name to avoid system overrides
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const field = crypto.randomUUID();
  const filePath = `${field}-${file.name}`;

  // 3. Admin bypass upload into your public storage container
  const { data, error } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false, // Prevent file overwriting
    });

  if (error) return { status: "error", message: error.message };

  // 4. Synchronously retrieve CDN link string
  const { data: urlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(data.path);

  try {
    // update the user in db
    await updateAvatarTransaction(
      Number(sessionUser.id),
      filePath,
      urlData.publicUrl,
    );

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${sessionUser.email}`);
    revalidatePath(`/${sessionUser.email}/status`);
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
}): Promise<DeleteAvatar> {
  if (!user.avatarId || !user.avatar) {
    return { status: "error", errors: { file: ["Avatar doesn't exist!"] } };
  }

  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  const userAvatarToDelete = await getUserAvatarIdByUserId(
    Number(sessionUser.id),
  );
  if (userAvatarToDelete && userAvatarToDelete.avatarId !== user.avatarId) {
    return {
      status: "error",
      message: "You are not authorized to update this avatar!",
    };
  }
  // delete the avatar file from supabase storage
  const { error } = await supabaseAdmin.storage
    .from("avatars")
    .remove([user.avatar.fileName]);
  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
  try {
    // delete the db record
    await deleteUserAvatar(user.avatarId);

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${sessionUser.email}`);
    revalidatePath(`/${sessionUser.email}/status`);
    return {
      status: "success",
      message: "Profile successfully updated!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Unable to delete avatar! Please try again!",
    };
  }
}

const UserBioSchema = z.object({
  bio: z.string().trim().min(1, "Bio is required"),
});
export async function updateBio(
  user: { id: number },
  formData: FormData,
): Promise<UserBio> {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  if (user.id !== Number(sessionUser.id)) {
    return {
      status: "error",
      message: "You are not authorized to update this bio!",
    };
  }

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
    await updateUserBio(Number(sessionUser.id), newUserBio);
    revalidatePath(`/${sessionUser.email}`);
    return {
      status: "success",
      message: "Profile successfully updated!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to updated profile! Please try again!",
    };
  }
}
