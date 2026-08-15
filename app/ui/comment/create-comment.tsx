"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createComment } from "@/lib/actions/comments";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Check, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function CreateComment({ postId }: { postId: number }) {
  const createCommentToPost = createComment.bind(null, postId);
  const [result, formAction, isPending] = useActionState(
    createCommentToPost,
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFileSelected, setIsFileSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!result) return;
    if (result.status === "error") {
      toast.add({
        type: "error",
        description: result.message,
      });
    } else {
      toast.add({
        type: "success",
        description: result.message,
      });
    }
  }, [result]);

  return (
    <article className="px-4 my-4">
      <form action={formAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="comment">
              <Textarea
                name="comment"
                id="comment"
                placeholder="Add a comment"
                required
              />
            </FieldLabel>
            {result?.errors?.comment && (
              <FieldError>{result.errors.comment}</FieldError>
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
              {isPending ? "Commenting" : "Comment"}
              {isPending ? <Spinner data-icon="inline-end" /> : ""}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </article>
  );
}
