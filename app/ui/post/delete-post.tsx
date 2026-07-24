"use client";

import { useActionState } from "react";
import { deletePost } from "@/lib/actions/posts";
import DeleteForm from "@/app/ui/delete-form";

export default function DeletePost({ postId }: { postId: number }) {
  const deletePostWithId = deletePost.bind(null, postId);
  const [errorMessage, formAction, isPending] = useActionState(
    deletePostWithId,
    undefined,
  );

  return <DeleteForm action={formAction} isPending={isPending} />;
}
