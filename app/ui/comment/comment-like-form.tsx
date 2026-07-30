"use client";

import { Heart } from "lucide-react";
import { useActionState, useEffect } from "react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { likeComment } from "@/lib/actions/comments";

export default function CommentLikeForm({
  session,
  comment,
}: {
  session: Session | null;
  comment: {
    id: number;
    postId: number;
    likes: number;
    isLiked: boolean;
  };
}) {
  const pathname = usePathname();
  const likeCommentWithId = likeComment.bind(
    null,
    Number(session?.user?.id),
    { id: comment.id, postId: comment.postId },
    pathname,
  );
  const [result, formAction, isPending] = useActionState(
    likeCommentWithId,
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
    <div className="flex items-center">
      <form action={formAction} className="flex items-center">
        <Field>
          <Button
            type="submit"
            variant="ghost"
            aria-disabled={isPending}
            disabled={isPending}
          >
            <Heart
              className={`size-6.5 ${comment.isLiked ? "fill-pink-500 stroke-pink-500" : ""} transition-colors`}
            />
          </Button>
        </Field>
      </form>
      <span className="transition-all">
        {comment.likes > 0 && `${comment.likes}`}
      </span>
    </div>
  );
}
