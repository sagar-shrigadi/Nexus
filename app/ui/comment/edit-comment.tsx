"use client";

import { usePathname } from "next/navigation";
import { updateComment } from "@/lib/actions/comments";
import { useActionState, useEffect } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function EditCommentForm({
  comment,
  closeEditForm,
}: {
  comment: {
    id: number;
    content: string;
    userId: number;
    mediaId: number | null;
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  };
  closeEditForm: () => void;
}) {
  const pathname = usePathname();
  const updateCommentById = updateComment.bind(
    null,
    { id: comment.id, userId: comment.userId },
    pathname,
  );
  const [result, formAction, isPending] = useActionState(
    updateCommentById,
    undefined,
  );

  useEffect(() => {
    if (!result) return;
    if (result.status === "error") {
      closeEditForm();
      toast.add({
        type: "error",
        description: result.message,
      });
    } else {
      closeEditForm();
      toast.add({
        type: "success",
        description: result.message,
      });
    }
  }, [result, closeEditForm]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="comment">
            <Textarea
              name="comment"
              id="comment"
              defaultValue={comment.content}
              placeholder="Add a comment"
              required
            />
          </FieldLabel>
          {result?.errors?.comment && (
            <FieldError>{result.errors.comment}</FieldError>
          )}
        </Field>
        {comment.media && (
          <Image
            src={comment.media.publicUrl}
            alt={comment.content}
            width={250}
            height={150}
            className={cn(
              comment.mediaId ? "block" : "hidden",
              "mx-auto object-cover w-auto h-[200]",
            )}
            unoptimized
            loading="eager"
          />
        )}
        <Field className="w-fit ml-auto" orientation="horizontal">
          <Button type="button" variant="outline" onClick={closeEditForm}>
            Cancel
          </Button>
          <Button type="submit" aria-disabled={isPending} disabled={isPending}>
            Update
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
