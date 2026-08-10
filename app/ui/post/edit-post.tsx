"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updatePost } from "@/lib/actions/posts";
import { useActionState, useEffect } from "react";
import BackButton from "../button/back-button";
import { Separator } from "@/components/ui/separator";

export default function EditPostForm({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    userId: number;
    users: {
      username: string;
    };
  };
}) {
  const updatePostWithId = updatePost.bind(null, {
    id: post.id,
    userId: post.userId,
    user: post.users,
  });
  const [result, formAction, isPending] = useActionState(
    updatePostWithId,
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

  return (
    <article className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col border rounded">
      <header className="flex items-center gap-4 px-2 py-4">
        <BackButton />
        <h2 className="text-2xl">Edit Post</h2>
      </header>
      <Separator />
      <form action={formAction} className="px-4 my-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              defaultValue={post.title}
              required
            />
            {result?.errors?.title && (
              <FieldError>{result.errors.title}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Textarea
              name="content"
              id="content"
              placeholder="What's Happening?"
              defaultValue={post.content}
              required
            />
            {result?.errors?.content && (
              <FieldError>{result.errors.content}</FieldError>
            )}
          </Field>
          <Field className="w-fit ml-auto">
            <Button
              type="submit"
              aria-disabled={isPending}
              disabled={isPending}
            >
              Update
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </article>
  );
}
