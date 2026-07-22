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
    <div className="flex flex-col gap-6 px-6">
      <Link
        href={`/${post.user.username}/status/${post.id}`}
        className="flex flex-col gap-1 cursor-pointer max-w-[65ch] hover:underline transition-all"
      >
        <h3 className="sm:text-lg font-bold">{post.title}</h3>
        <p className="line-clamp-4">{post.content}</p>
      </Link>
      <div className="flex items-center gap-6">
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
