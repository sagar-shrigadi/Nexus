"use client";

import { usePathname } from "next/navigation";
import { deleteComment } from "@/app/lib/actions/comments";
import { useActionState } from "react";
import DeleteForm from "@/app/ui/delete-form";

export default function DeleteComment({ commentId }: { commentId: number }) {
  const pathname = usePathname();
  const deleteCommentWithId = deleteComment.bind(null, commentId, pathname);

  const [errorMessage, formAction, isPending] = useActionState(
    deleteCommentWithId,
    undefined,
  );

  return <DeleteForm action={formAction} isPending={isPending} />;
}
