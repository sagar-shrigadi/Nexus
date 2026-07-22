"use client";

import { useActionState } from "react";
import { createComment } from "@/app/lib/actions/comments";
import { CircleAlert } from "lucide-react";

export default function CreateComment({ postId }: { postId: number }) {
  const createCommentToPost = createComment.bind(null, postId);
  const [errorMessage, formAction, isPending] = useActionState(
    createCommentToPost,
    undefined,
  );
  return (
    <section className="flex flex-col gap-4">
      <form
        action={formAction}
        className="flex justify-between items-center gap-8 px-6 py-4 border-y"
      >
        <div className="grow">
          <label htmlFor="comment">
            <textarea
              name="comment"
              id="comment"
              required
              rows={1}
              placeholder="Add a comment"
              className="w-full rounded px-4 py-2 bg-dark-200 text-lg border"
            ></textarea>
          </label>
        </div>
        <button
          aria-disabled={isPending}
          disabled={isPending}
          className="cursor-pointer rounded px-6 py-2 bg-(--hover) hover:bg-[hsl(210_7%_22%)] transition-colors"
        >
          Post
        </button>
      </form>
      <div
        className={`${errorMessage ? "flex" : "hidden"} px-6 flex flex-col gap-2`}
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage &&
          errorMessage.map((err, index) => (
            <div key={index} className="flex gap-2">
              <CircleAlert className="size-5 text-red-500" />
              <p className="text-red-500">{err.message}</p>
            </div>
          ))}
      </div>
    </section>
  );
}
