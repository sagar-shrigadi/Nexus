"use server";

import { newComment } from "@/app/services/comments";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
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
