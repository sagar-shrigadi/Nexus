"use client";

import { usePathname } from "next/navigation";
import { deleteComment } from "@/lib/actions/comments";
import { useActionState, useEffect } from "react";
import DeleteForm from "@/app/ui/delete-form";
import { toast } from "@/components/ui/toast";

export default function DeleteComment({
  comment,
}: {
  comment: {
    id: number;
    userId: number;
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  };
}) {
  const pathname = usePathname();
  const deleteCommentWithId = deleteComment.bind(null, comment, pathname);

  const [result, formAction, isPending] = useActionState(
    deleteCommentWithId,
    undefined,
  );

  useEffect(() => {
    if (!result) return;
    if (result.status === "error") {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
  }, [result]);

  return <DeleteForm action={formAction} isPending={isPending} />;
}
