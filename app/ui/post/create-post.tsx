"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { Check, ImageIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function CreatePost({ sessionUser }: { sessionUser: User }) {
  const { data: session } = useSession();

  // on initial visit, bcoz the session is fetching async client side it results in it being undefined
  // which results in falling back to default avatar unless a hard refresh is done
  // to circumvent that, display the avatar on initial load via server session
  // and after avatar update by user, the client side session will be populated and all updates will be properly reflected
  const userAvatar = session?.user?.image ?? sessionUser.image;

  const [result, formAction, isPending] = useActionState(createPost, undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFileSelected, setIsFileSelected] = useState<string | null>(null);

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
              src={userAvatar ?? "/images/defaultProfile.png"}
              alt={userAvatar ? "User Avatar" : "Default User Avatar"}
            />
            <AvatarFallback>
              {sessionUser.email?.charAt(0).toUpperCase() ?? "U"}
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
            <Field className="w-fit">
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Upload image"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon />
                </Button>
                {isFileSelected && (
                  <div className="px-2 py-1 rounded bg-accent flex items-center justify-center gap-2">
                    {isFileSelected}
                    <Check />
                  </div>
                )}
              </div>
              <Input
                ref={fileInputRef}
                onChange={() =>
                  setIsFileSelected(
                    fileInputRef.current?.files
                      ? fileInputRef.current.files[0].name
                      : null,
                  )
                }
                type="file"
                id="file"
                name="file"
                accept="image/jpeg, image/png, image/webp, image/gif"
                className="hidden"
              />
              {result?.errors?.file && (
                <FieldError>{result.errors.file}</FieldError>
              )}
            </Field>
            <Field className="w-fit ml-auto">
              <Button
                onClick={() => setIsFileSelected(null)}
                type="submit"
                aria-disabled={isPending}
                disabled={isPending}
              >
                {isPending ? "Posting" : "Post"}
                {isPending ? <Spinner data-icon="inline-end" /> : ""}
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </form>
    </article>
  );
}
