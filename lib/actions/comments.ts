"use server";

import {
  deleteCommentById,
  deleteMediaCommentByFileName,
  editCommentById,
  likeCommentTransaction,
  newComment,
} from "@/app/services/comments";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CommentAction } from "@/lib/definitations";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/actions/auth";

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment is required."),
  file: z.file().optional(),
});
export async function createComment(
  postId: number,
  prevState: CommentAction | undefined,
  formData: FormData,
): Promise<CommentAction> {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  const validatedComment = CommentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedComment.success) {
    return {
      status: "error",
      errors: z.flattenError(validatedComment.error).fieldErrors,
    };
  }

  const { comment, file } = validatedComment.data;

  if (!file || file.size === 0) {
    try {
      await newComment(Number(sessionUser.id), postId, comment, null);
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath(`/${sessionUser.email}`);
      revalidatePath(`/${sessionUser.email}/status/${postId}`);
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
  } else {
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
    const { data, error } = await supabaseAdmin.storage
      .from("media")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false, // Prevent file overwriting
      });

    if (error) {
      return { status: "error", message: error.message };
    }
    // 4. Synchronously retrieve CDN link string
    const { data: urlData } = supabaseAdmin.storage
      .from("media")
      .getPublicUrl(data.path);

    try {
      await newComment(Number(sessionUser.id), postId, comment, {
        fileName: data.path,
        publicUrl: urlData.publicUrl,
      });
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath(`/${sessionUser.email}`);
      revalidatePath(`/${sessionUser.email}/status/${postId}`);
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
}
export async function updateComment(
  comment: { id: number; userId: number },
  pathname: string,
  prevState: CommentAction | undefined,
  formData: FormData,
): Promise<CommentAction> {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  if (comment.userId !== Number(sessionUser.id)) {
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
  comment: {
    id: number;
    userId: number;
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  },
  pathname: string,
) {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;

  if (comment.userId !== Number(sessionUser.id)) {
    return {
      status: "error",
      message: "You are not authorized to delete this comment!",
    };
  }
  if (comment.media != null) {
    const { error } = await supabaseAdmin.storage
      .from("media")
      .remove([comment.media.fileName]);

    if (error) return { status: "error", message: error.message };
    try {
      await deleteMediaCommentByFileName(comment.media.fileName);
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
  comment: { id: number; postId: number },
  pathname: string,
) {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.error;
  const { sessionUser } = authResult;
  try {
    await likeCommentTransaction(
      Number(sessionUser.id),
      comment.id,
      comment.postId,
    );
    revalidatePath(`${pathname}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error liking the comment! Please try again!",
    };
  }
}
