"use server";

import {
  deleteCommentById,
  editCommentById,
  getCommentById,
  likeCommentTransaction,
  newComment,
} from "@/app/services/comments";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { $ZodIssue } from "zod/v4/core";

const CommentSchema = z.object({
  comment: z.string().nonempty("Comment must not be empty."),
});
export async function createComment(
  postId: number,
  prevState: $ZodIssue[] | undefined,
  formData: FormData,
) {
  const session = await auth();
  const validatedComment = CommentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedComment.success) {
    return validatedComment.error.issues.map((issue) => issue);
  }

  const { comment } = validatedComment.data;

  try {
    await newComment(Number(session?.user?.id), postId, comment);
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${session?.user?.email}`);
    revalidatePath(`/${session?.user?.email}/status/${postId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteComment(commentId: number, pathname: string) {
  const session = await auth();
  try {
    const commentToDelete = await getCommentById(commentId);
    if (Number(session?.user?.id) !== commentToDelete?.userId) {
      return [{ message: "You are not authorized to perform this action!" }];
    }
    await deleteCommentById(commentId);
    revalidatePath(`${pathname}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateComment(
  commentId: number,
  pathname: string,
  prevState: $ZodIssue[] | { message: string }[] | undefined,
  formData: FormData,
) {
  const session = await auth();
  const validatedComment = CommentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedComment.success) {
    return validatedComment.error.issues.map((issue) => issue);
  }

  const { comment } = validatedComment.data;
  try {
    const commentToUpdate = await getCommentById(commentId);

    if (
      !commentToUpdate ||
      commentToUpdate.userId !== Number(session?.user?.id)
    ) {
      return [{ message: "You are not authorized to perform this action!" }];
    }
    await editCommentById(commentId, comment);
    revalidatePath(`${pathname}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
  redirect(`${pathname}`);
}
export async function likeComment(
  userId: number,
  commentId: number,
  postId: number,
  pathname: string,
) {
  try {
    await likeCommentTransaction(userId, commentId, postId);
    revalidatePath(`${pathname}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
