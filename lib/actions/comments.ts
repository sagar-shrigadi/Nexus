"use server";

import {
  deleteCommentById,
  editCommentById,
  likeCommentTransaction,
  newComment,
} from "@/app/services/comments";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CommentAction } from "@/lib/definitations";

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment is required."),
});
export async function createComment(
  postId: number,
  prevState: CommentAction | undefined,
  formData: FormData,
): Promise<CommentAction | undefined> {
  const session = await auth();
  const validatedComment = CommentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedComment.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedComment.error).fieldErrors,
    };
  }

  const { comment } = validatedComment.data;

  try {
    await newComment(Number(session?.user?.id), postId, comment);
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/${session?.user?.email}`);
    revalidatePath(`/${session?.user?.email}/status/${postId}`);
    return {
      status: "success",
      message: "Comment successfully posted!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Comment could not posted! Please try again!",
    };
  }
}
export async function updateComment(
  comment: { id: number; userId: number },
  pathname: string,
  prevState: CommentAction | undefined,
  formData: FormData,
): Promise<CommentAction> {
  const session = await auth();
  if (comment.userId !== Number(session?.user?.id)) {
    return {
      status: "error",
      message: "You are not authorized to edit this comment!",
    };
  }
  const validatedComment = CommentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedComment.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedComment.error).fieldErrors,
    };
  }
  try {
    await editCommentById(comment.id, validatedComment.data.comment);
    revalidatePath(`${pathname}`);
    return {
      status: "success",
      message: "Comment successfully updated!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Comment could not be updated! Please try again!",
    };
  }
}
export async function deleteComment(
  comment: { id: number; userId: number },
  pathname: string,
): Promise<CommentAction | undefined> {
  const session = await auth();
  if (comment.userId !== Number(session?.user?.id)) {
    return {
      status: "error",
      message: "You are not authorized to delete this comment!",
    };
  }
  try {
    await deleteCommentById(comment.id);
    revalidatePath(`${pathname}`);
    return {
      status: "success",
      message: "Comment successfully deleted!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Comment could not be deleted! Please try again!",
    };
  }
}
export async function likeComment(
  userId: number,
  comment: { id: number; postId: number },
  pathname: string,
): Promise<CommentAction | undefined> {
  try {
    await likeCommentTransaction(userId, comment.id, comment.postId);
    revalidatePath(`${pathname}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error liking the comment! Please try again!",
    };
  }
}
