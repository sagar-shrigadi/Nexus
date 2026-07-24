"use client";
import Image from "next/image";
import { useActionState } from "react";
import { createPost } from "@/lib/actions/posts";
import { CircleAlert } from "lucide-react";

export default function CreatePost() {
  const [errorMessage, formAction, isPending] = useActionState(
    createPost,
    undefined,
  );
  return (
    <section className="mt-2 sm:pl-4 flex flex-col gap-2">
      <form action={formAction} className="flex flex-col gap-4">
        <button
          aria-disabled={isPending}
          className="self-end cursor-pointer rounded px-6 py-2 bg-(--hover) hover:bg-[hsl(210_7%_22%)] transition-colors"
        >
          Post
        </button>
        <div className="flex gap-4">
          <Image
            src="/images/defaultProfile.png"
            width={180}
            height={180}
            alt="default image avatar for user"
            className="rounded-full w-8 md:w-10 aspect-square block self-start"
          />
          <div className="w-full flex flex-col gap-4">
            <label htmlFor="title">
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                className="w-full rounded-sm py-1.5 px-2 bg-dark-200 text-lg border"
              />
            </label>
            <label htmlFor="content">
              <textarea
                name="content"
                id="content"
                rows={4}
                placeholder="What's Happening?"
                className="w-full border p-2 rounded text-lg"
              ></textarea>
            </label>
          </div>
        </div>
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
