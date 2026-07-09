"use client";

import { useActionState } from "react";
import { deletePost } from "@/app/lib/actions/posts";

export default function DeleteForm({ postId }: { postId: number }) {
  const deletePostWithId = deletePost.bind(null, postId);
  const [errorMessage, formAction, isPending] = useActionState(
    deletePostWithId,
    undefined,
  );

  return (
    <>
      <form action={formAction}>
        <button
          aria-disabled={isPending}
          disabled={isPending}
          className="px-6 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors"
        >
          {isPending ? "Deleting" : "Delete"}
        </button>
      </form>
    </>
  );
}
