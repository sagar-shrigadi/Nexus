"use client";

import CommentOptions from "@/app/ui/comment/comment-options";
import { useState } from "react";
import EditCommentForm from "@/app/ui/comment/edit-comment";
import { User } from "next-auth";
import UserNameCard from "@/app/ui/user/name-card";
import CommentLikeForm from "@/app/ui/comment/comment-like-form";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CommentCard({
  sessionUser,
  comment,
}: {
  sessionUser: User;
  comment: {
    id: number;
    content: string;
    postId: number;
    userId: number;
    createdAt: Date;
    likes: number;
    isLiked: boolean;
    mediaId: number | null;
    users: {
      username: string;
      firstName: string;
      lastName: string;
      avatar: {
        publicUrl: string;
      } | null;
    };
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-6 py-4 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <UserNameCard
            className="flex"
            to={`/${comment.users.username}`}
            fullname={`${comment.users.firstName} ${comment.users.lastName}`}
            userAvatar={comment.users.avatar?.publicUrl}
          />
          <span className="text-sidebar-ring text-sm">
            {comment.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {comment.userId === Number(sessionUser.id) && (
          <CommentOptions
            comment={{
              id: comment.id,
              userId: comment.userId,
              media: comment.media,
            }}
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
            mediaId: comment.mediaId,
            media: comment.media,
          }}
          closeEditForm={() => setIsEditing(false)}
        />
      ) : (
        <div className="px-2">
          <p className="text-lg max-w-[55ch]">{comment.content}</p>
          {comment.media && (
            <Image
              src={comment.media.publicUrl}
              alt={comment.content}
              width={250}
              height={150}
              className={cn(
                comment.mediaId ? "block" : "hidden",
                "mx-auto object-cover w-auto h-auto max-h-[200]",
              )}
              unoptimized
              loading="eager"
            />
          )}
        </div>
      )}
      <CommentLikeForm
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
