"use client";

import { Heart } from "lucide-react";
import { useActionState, useEffect } from "react";
import { likePost } from "@/lib/actions/posts";
import { usePathname } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function PostLikeForm({
  post,
}: {
  post: {
    id: number;
    likes: number;
    isLiked: boolean;
  };
}) {
  const pathname = usePathname();
  const likePostWithId = likePost.bind(null, post.id, pathname);
  const [result, formAction, isPending] = useActionState(
    likePostWithId,
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
            aria-label={post.isLiked ? "Unlike post" : "Like post"}
          >
            <Heart
              className={`size-6.5 ${post.isLiked && "fill-pink-500 stroke-pink-500"} transition-colors`}
            />
          </Button>
        </Field>
      </form>
      <span className="transition-all">
        {post.likes > 0 ? `${post.likes}` : ""}
      </span>
    </div>
  );
}
