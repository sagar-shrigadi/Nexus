import { MessageSquare } from "lucide-react";
import Link from "next/link";
import PostLikeForm from "@/app/ui/post/post-like-form";
import { auth } from "@/auth";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function PostContent({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    likes: number;
    commentsCount: number;
    isLiked: boolean;
    mediaId: number | null;
    users: {
      username: string;
    };
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  };
}) {
  const session = await auth();
  return (
    <div className="flex flex-col gap-4 px-4 py-1">
      <Link
        href={`/${post.users.username}/status/${post.id}`}
        className="flex justify-center flex-col gap-1 px-6 py-2 cursor-pointer hover:bg-sidebar-accent rounded transition-colors"
      >
        <h3 className="sm:text-lg font-bold">{post.title}</h3>
        <p className="line-clamp-4 max-w-[65ch] mb-2">{post.content}</p>
        {post.media && (
          <Image
            src={post.media.publicUrl}
            alt={post.content}
            width={250}
            height={150}
            className={cn(
              post.mediaId ? "block" : "hidden",
              "mx-auto object-cover w-auto h-auto max-h-[400]",
            )}
            unoptimized
            loading="eager"
          />
        )}
      </Link>
      <div className="flex items-center gap-6 px-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5.5" />
          <span>{post.commentsCount > 0 ? `${post.commentsCount}` : ""}</span>
        </div>
        <PostLikeForm
          session={session}
          post={{ id: post.id, likes: post.likes, isLiked: post.isLiked }}
        />
      </div>
    </div>
  );
}
