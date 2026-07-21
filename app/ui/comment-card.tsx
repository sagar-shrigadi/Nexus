"use client";
import CommentOptions from "@/app/ui/comment-options";
import { useActionState, useState } from "react";
import EditCommentForm from "@/app/ui/edit-comment";
import { Session } from "next-auth";
import { Heart } from "lucide-react";
import { likeComment } from "@/app/lib/actions/comments";
import { usePathname } from "next/navigation";
import UserNameCard from "@/app/ui/user/name-card";

export default function CommentCard({
  session,
  comment,
  postId,
  likedComments,
}: {
  session: Session | null;
  comment: {
    id: number;
    content: string;
    userId: number;
    createdAt: Date;
    postId: number;
    likes: number;
    users: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
  postId: number;
  likedComments: {
    commentId: number;
  }[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const pathname = usePathname();
  const likeCommentWithId = likeComment.bind(
    null,
    Number(session?.user?.id),
    comment.id,
    postId,
    pathname,
  );
  const [errorMessage, formAction, isPending] = useActionState(
    likeCommentWithId,
    undefined,
  );
  return (
    <div className="flex flex-col gap-8 py-4 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <UserNameCard
            className="flex"
            to={`/${comment.users.username}`}
            username={`${comment.users.firstName} ${comment.users.lastName}`}
          />
          <span className="text-gray-300">
            {comment.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {Number(session?.user?.id) === comment.userId ? (
          <CommentOptions commentId={comment.id} setIsEditing={setIsEditing} />
        ) : (
          ""
        )}
      </div>
      {isEditing ? (
        <EditCommentForm commentId={comment.id} content={comment.content} />
      ) : (
        <div className="px-2 text-lg max-w-[55ch]">{comment.content}</div>
      )}
      <div className="flex items-center gap-2.5 hover:text-pink-500 transition-colors">
        <form action={formAction} className="flex items-center">
          <button aria-disabled={isPending} disabled={isPending}>
            <Heart
              className={`size-6.5 ${likedComments.some((item) => item.commentId === comment.id) ? "fill-pink-500 stroke-pink-500" : ""} transition-colors cursor-pointer`}
            />
          </button>
        </form>
        <span className="transition-all">
          {comment.likes > 0 ? `${comment.likes}` : ""}
        </span>
      </div>
    </div>
  );
}
