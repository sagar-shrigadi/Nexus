"use server";

import { z } from "zod";
import { auth } from "@/auth";
import {
  deletePostById,
  editPostById,
  likePostTransaction,
  newPost,
} from "@/app/services/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostAction } from "@/lib/definitations";

const PostSchema = z.object({
  title: z.string().trim().min(1, "Post Title is required."),
  content: z.string().trim().min(1, "Post Content is required."),
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
  const { title, content } = validatedPost.data;

  try {
    await newPost(Number(session?.user?.id), title, content);
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
  try {
    await deletePostById(post.id);
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
