"use client";

import { useActionState, useEffect } from "react";
import { deletePost } from "@/lib/actions/posts";
import DeleteForm from "@/app/ui/delete-form";
import { toast } from "@/components/ui/toast";

export default function DeletePost({
  post,
}: {
  post: {
    id: number;
    userId: number;
    user: {
      username: string;
    };
  };
}) {
  const deletePostWithId = deletePost.bind(null, { ...post });
  const [result, formAction, isPending] = useActionState(
    deletePostWithId,
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
