"use client";
import { Heart } from "lucide-react";
import { useActionState } from "react";
import { likePost } from "@/app/lib/actions/posts";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

export default function PostLikeForm({
  session,
  post,
  likedPosts,
}: {
  session: Session | null;
  post: {
    id: number;
    title: string;
    content: string;
    userId: number;
    likes: number;
    commentCount: number;
    users: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
  likedPosts: {
    id: number;
    userId: number;
    postId: number;
  }[];
}) {
  const pathname = usePathname();
  const likePostWithId = likePost.bind(
    null,
    Number(session?.user?.id),
    post.id,
    pathname,
  );
  const [errorMessage, formAction, isPending] = useActionState(
    likePostWithId,
    undefined,
  );
  return (
    <div className="flex items-center gap-2.5 hover:text-pink-500 transition-colors">
      <form action={formAction} className="flex items-center">
        <button aria-disabled={isPending} disabled={isPending}>
          <Heart
            className={`size-6.5 ${likedPosts.some((item) => item.postId === post.id) ? "fill-pink-500 stroke-pink-500" : ""} transition-colors cursor-pointer`}
          />
        </button>
      </form>
      <span className="transition-all">
        {post.likes > 0 ? `${post.likes}` : ""}
      </span>
    </div>
  );
}
