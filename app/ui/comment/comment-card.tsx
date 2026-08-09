"use client";

import CommentOptions from "@/app/ui/comment/comment-options";
import { useState } from "react";
import EditCommentForm from "@/app/ui/comment/edit-comment";
import { Session } from "next-auth";
import UserNameCard from "@/app/ui/user/name-card";
import CommentLikeForm from "./comment-like-form";

export default function CommentCard({
  session,
  comment,
}: {
  session: Session | null;
  comment: {
    id: number;
    content: string;
    postId: number;
    userId: number;
    createdAt: Date;
    likes: number;
    isLiked: boolean;
    users: {
      username: string;
      firstName: string;
      lastName: string;
      avatar: string | null;
    };
  };
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-8 py-4 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <UserNameCard
            className="flex"
            to={`/${comment.users.username}`}
            fullname={`${comment.users.firstName} ${comment.users.lastName}`}
            userAvatar={comment.users.avatar}
          />
          <span className="text-sidebar-ring">
            {comment.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {comment.userId === Number(session?.user?.id) && (
          <CommentOptions
            comment={{ id: comment.id, userId: comment.userId }}
            openEditForm={() => setIsEditing(true)}
          />
        )}
      </div>
      {isEditing ? (
        <EditCommentForm
          comment={{
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
          }}
          closeEditForm={() => setIsEditing(false)}
        />
      ) : (
        <div className="px-2 text-lg max-w-[55ch]">
          <p>{comment.content}</p>
        </div>
      )}
      <CommentLikeForm
        session={session}
        comment={{
          id: comment.id,
          postId: comment.postId,
          likes: comment.likes,
          isLiked: comment.isLiked,
        }}
      />
    </div>
  );
}
