"use client";
import Image from "next/image";
import Link from "next/link";
import CommentOptions from "./comment-options";
import { useState } from "react";
import EditCommentForm from "./edit-comment";

export default function CommentCard({
  comment,
}: {
  comment: {
    createdAt: Date;
    id: number;
    content: string;
    userId: number;
    postId: number;
    users: {
      username: string;
      firstName: string;
      lastName: string;
    };
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex flex-col gap-6 py-2.5">
      <div className="flex justify-between px-4">
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
        <CommentOptions commentId={comment.id} setIsEditing={setIsEditing} />
      </div>
      {isEditing ? (
        <EditCommentForm commentId={comment.id} content={comment.content} />
      ) : (
        <div className="px-4 text-lg max-w-[55ch]">{comment.content}</div>
      )}
    </div>
  );
}
