"use client";
import Image from "next/image";
import Link from "next/link";
import CommentOptions from "./comment-options";
import { useActionState, useState } from "react";
import EditCommentForm from "./edit-comment";
import { Session } from "next-auth";
import { Heart } from "lucide-react";
import { likeComment } from "../lib/actions/comments";
import { usePathname } from "next/navigation";

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
          <Link
            href={`/${comment.users.username}`}
            className="grow flex items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:underline transition-all"
          >
            <Image
              src="/images/defaultProfile.png"
              width={180}
              height={180}
              alt="default image avatar for user"
              className="rounded-full w-7.5 md:w-8.5 aspect-square block"
            />
            <span>{`${comment.users.firstName} ${comment.users.lastName}`}</span>
          </Link>
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
