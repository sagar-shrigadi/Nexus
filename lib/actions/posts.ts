"use server";

import { z } from "zod";
import { auth } from "@/auth";
import {
  deletePostById,
  editPostById,
  getPostById,
  likePostTransaction,
  newPost,
} from "@/app/services/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { $ZodIssue } from "zod/v4/core";

const PostSchema = z.object({
  title: z.string().trim().min(1, "Post Title is required."),
  content: z.string().trim().min(1, "Post Content is required."),
});
interface PostState {
  errors?: {
    title?: string[];
    content?: string[];
  };
}
export async function createPost(
  prevState: PostState | undefined,
  formData: FormData,
) {
  const session = await auth();
  const validatedPost = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedPost.success) {
    return {
      errors: z.flattenError(validatedPost.error).fieldErrors,
    };
  }
  const { title, content } = validatedPost.data;

  try {
    await newPost(Number(session?.user?.id), title, content);
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/${session?.user?.email}`);
  redirect("/");
}
export async function updatePost(
  postId: number,
  prevState: $ZodIssue[] | undefined,
  formData: FormData,
) {
  const post = await getPostById(postId);
  const validatedPost = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedPost.success) {
    return validatedPost.error.issues.map((issue) => issue);
  }
  const { title, content } = validatedPost.data;

  try {
    await editPostById(postId, title, content);
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${post?.users.username}/status/${post?.id}`);
    revalidatePath(`/${post?.users.username}`);
  } catch (error) {
    throw error;
  }
  redirect(`/${post?.users.username}/status/${post?.id}`);
}

interface ActionResult {
  status: "error";
  message: string;
}

export async function deletePost(post: {
  id: number;
  userId: number;
}): Promise<ActionResult | undefined> {
  const session = await auth();

  if (Number(session?.user?.id) !== post.userId) {
    return {
      status: "error",
      message: "You are not authorized to delete this post!",
    };
  }
  try {
    await deletePostById(post.id);
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${session?.user?.email}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Post could not be deleted! Please try again!",
    };
  }
}
export async function likePost(
  userId: number,
  postId: number,
  pathname: string,
): Promise<ActionResult | undefined> {
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
