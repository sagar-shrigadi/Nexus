import { MessageSquare } from "lucide-react";
import Link from "next/link";
import PostLikeForm from "@/app/ui/post/post-like-form";
import { auth } from "@/auth";
import { getAllLikedPostsByUser } from "@/app/services/posts";

export default async function PostContent({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    likes: number;
    commentCount: number;
    user: {
      username: string;
    };
  };
}) {
  const session = await auth();
  const likedPosts = await getAllLikedPostsByUser(Number(session?.user?.id));
  return (
    <div className="flex flex-col gap-4 px-4 py-1">
      <Link
        href={`/${post.user.username}/status/${post.id}`}
        className="flex justify-center flex-col gap-1 px-6 py-2 cursor-pointer hover:bg-sidebar-accent rounded transition-colors"
      >
        <h3 className="sm:text-lg font-bold">{post.title}</h3>
        <p className="line-clamp-4 max-w-[65ch]">{post.content}</p>
      </Link>
      <div className="flex items-center gap-6 px-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5.5" />
          <span>{post.commentCount > 0 ? `${post.commentCount}` : ""}</span>
        </div>
        <PostLikeForm
          session={session}
          post={{ id: post.id, likes: post.likes }}
          likedPosts={likedPosts}
        />
      </div>
    </div>
  );
}
