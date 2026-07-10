"use server";

import { z } from "zod";
import { auth } from "@/auth";
import {
  deletePostById,
  editPostById,
  getPostById,
  newPost,
} from "@/app/services/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { $ZodIssue } from "zod/v4/core";

const PostSchema = z.object({
  title: z.string().nonempty("Post Title must not be empty!"),
  content: z.string().nonempty("Post Content must not be empty!"),
});
export async function createPost(
  prevState: $ZodIssue[] | undefined,
  formData: FormData,
) {
  const session = await auth();
  const validatedPost = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedPost.success) {
    return validatedPost.error.issues.map((issue) => issue);
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
export async function deletePost(id: number) {
  const session = await auth();

  try {
    await deletePostById(id);
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${session?.user?.email}`);
  } catch (error) {
    throw error;
  }
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
