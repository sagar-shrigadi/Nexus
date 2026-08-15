"use server";

import { z } from "zod";
import { auth } from "@/auth";
import {
  deleteMediaPostByFileNameTransaction,
  deletePostByIdTransaction,
  editPostById,
  likePostTransaction,
  newPost,
} from "@/app/services/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostAction } from "@/lib/definitations";
import { supabase } from "@/lib/supabase";

const PostSchema = z.object({
  title: z.string().trim().min(1, "Post Title is required."),
  content: z.string().trim().min(1, "Post Content is required."),
  file: z.file().optional(),
});

export async function createPost(
  prevState: PostAction | undefined,
  formData: FormData,
): Promise<PostAction> {
  const session = await auth();
  const validatedPost = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedPost.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedPost.error).fieldErrors,
    };
  }
  const { title, content, file } = validatedPost.data;
  // if file doesnt exist, file size is 0 in that case
  if (!file || file.size === 0) {
    try {
      await newPost(Number(session?.user?.id), title, content, null);
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath(`/${session?.user?.email}`);
      return {
        status: "success",
        message: "Post successfully created!",
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Post could not be created! Please try again!",
      };
    }
  } else {
    // file exists here
    if (file.size > 3 * 1024 * 1024) {
      return {
        status: "error",
        message: "File size too large! (MAX 3MB).",
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
        message: "Invalid format. Only JPEG, PNG, WEBP and GIFs are allowed.",
      };
    }
    // 2. Parse binary stream and build unique name to avoid system overrides
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const field = crypto.randomUUID();
    const filePath = `${field}-${file.name}`;
    // 3. Admin bypass upload into your public storage container
    const { data, error } = await supabase.storage
      .from("media")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false, // Prevent file overwriting
      });

    if (error) return { status: "error", message: error.message };
    // 4. Synchronously retrieve CDN link string
    const { data: urlData } = supabase.storage
      .from("media")
      .getPublicUrl(data.path);
    try {
      await newPost(Number(session?.user?.id), title, content, {
        fileName: data.path,
        publicUrl: urlData.publicUrl,
      });
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath(`/${session?.user?.email}`);
      return {
        status: "success",
        message: "Post successfully created!",
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Post could not be created! Please try again!",
      };
    }
  }
}
export async function updatePost(
  post: { id: number; userId: number; user: { username: string } },
  prevState: PostAction | undefined,
  formData: FormData,
): Promise<PostAction> {
  const session = await auth();
  if (post.userId !== Number(session?.user?.id)) {
    return {
      status: "error",
      message: "You are not authorized to edit this post!",
    };
  }
  const validatedPost = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedPost.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedPost.error).fieldErrors,
    };
  }
  const { title, content } = validatedPost.data;

  try {
    await editPostById(post.id, title, content);
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${post.user.username}`);
    revalidatePath(`/${post.user.username}/status/${post.id}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Post could not be updated! Please try again!",
    };
  }
  redirect(`/${post.user.username}/status/${post.id}`, "replace");
}
export async function deletePost(
  post: {
    id: number;
    userId: number;
    users: {
      username: string;
    };
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  },
  shouldRedirect: boolean,
): Promise<PostAction | undefined> {
  const session = await auth();
  if (post.userId !== Number(session?.user?.id)) {
    return {
      status: "error",
      message: "You are not authorized to delete this post!",
    };
  }

  if (post.media != null) {
    const { error } = await supabase.storage
      .from("media")
      .remove([post.media.fileName]);

    if (error) return { status: "error", message: error.message };
    try {
      await deleteMediaPostByFileNameTransaction({
        id: post.id,
        media: { fileName: post.media.fileName },
      });
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath(`/${post.users.username}`);
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Post could not be deleted! Please try again!",
      };
    }
  } else {
    try {
      await deletePostByIdTransaction(post.id);
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath(`/${post.users.username}`);
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Post could not be deleted! Please try again!",
      };
    }
  }
  if (shouldRedirect) {
    redirect("/", "replace");
  }
}
export async function likePost(
  userId: number,
  postId: number,
  pathname: string,
): Promise<PostAction | undefined> {
  try {
    await likePostTransaction(userId, postId);
    revalidatePath(`${pathname}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error liking the post! Please try again!",
    };
  }
}
