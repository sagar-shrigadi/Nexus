"use client";

import { useActionState, useEffect } from "react";
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

export default function CreateComment({ postId }: { postId: number }) {
  const createCommentToPost = createComment.bind(null, postId);
  const [result, formAction, isPending] = useActionState(
    createCommentToPost,
    undefined,
  );

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

          <Field className="w-fit ml-auto">
            <Button
              type="submit"
              aria-disabled={isPending}
              disabled={isPending}
            >
              Comment
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </article>
  );
}
