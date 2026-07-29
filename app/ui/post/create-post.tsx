"use client";
import { useActionState } from "react";
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

export default function CreatePost({ session }: { session: Session | null }) {
  const [errorMessage, formAction, isPending] = useActionState(
    createPost,
    undefined,
  );
  return (
    <section className="mt-4 px-2">
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
              {errorMessage?.errors.title && (
                <FieldError>{errorMessage.errors.title}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="content">
                <Textarea
                  name="content"
                  id="content"
                  placeholder="What's Happening?"
                  required
                ></Textarea>
              </FieldLabel>
              {errorMessage?.errors.content && (
                <FieldError>{errorMessage.errors.content}</FieldError>
              )}
            </Field>
            <Field className="w-fit ml-auto">
              <Button
                type="submit"
                aria-disabled={isPending}
                disabled={isPending}
                className="px-4 text-base"
              >
                Post
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </form>
    </section>
  );
}
