import PostContentCard from "@/app/ui/post-content-card";
import PostNameCard from "@/app/ui/post-name-card";

export default function PostCard({
  post,
}: {
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
}) {
  return (
    <article className="flex flex-col gap-6 py-4 border-y">
      <PostNameCard post={post} />
      <PostContentCard post={post} />
    </article>
  );
}
