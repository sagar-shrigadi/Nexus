"use client";

import { useActionState, useEffect } from "react";
import { createPost } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";

export default function CreatePost({ session }: { session: Session | null }) {
  const [result, formAction, isPending] = useActionState(createPost, undefined);

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
    <article className="mt-4 px-2">
      <form action={formAction}>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={session?.user?.image ?? "/images/defaultProfile.png"}
              alt={session?.user?.image ? "User Avatar" : "Default User Avatar"}
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  required
                />
              </FieldLabel>
              {result?.errors?.title && (
                <FieldError>{result.errors.title}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="content">
                <Textarea
                  name="content"
                  id="content"
                  placeholder="What's Happening?"
                  required
                />
              </FieldLabel>
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
                Post
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </form>
    </article>
  );
}
