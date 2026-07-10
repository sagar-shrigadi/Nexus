"use client";
import { updatePost } from "@/app/lib/actions/posts";
import { CircleAlert } from "lucide-react";
import { useActionState } from "react";

export default function EditPostForm({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    userId: number;
    users: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
}) {
  const updatePostWithId = updatePost.bind(null, post.id);
  const [errorMessage, formAction, isPending] = useActionState(
    updatePostWithId,
    undefined,
  );
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-center">Edit Post</h1>
      <form action={formAction} className="w-full flex flex-col gap-4">
        <label htmlFor="title" className="flex flex-col gap-2">
          <span className="text-xl">Title</span>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            defaultValue={post.title}
            className="w-full rounded-sm py-1.5 px-2 bg-dark-200 text-lg border"
          />
        </label>
        <label htmlFor="content" className="flex flex-col gap-2">
          <span className="text-xl">Content</span>
          <textarea
            name="content"
            id="content"
            rows={6}
            placeholder="What's Happening?"
            defaultValue={post.content}
            className="w-full border p-2 rounded text-lg"
          ></textarea>
        </label>
        <button
          aria-disabled={isPending}
          className="mt-4 self-center cursor-pointer rounded px-4 py-2 bg-mist-700 hover:bg-(--hover) transition-colors"
        >
          Update
        </button>
      </form>
      <div
        className={`${errorMessage ? "flex" : "hidden"} flex flex-col gap-2`}
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
