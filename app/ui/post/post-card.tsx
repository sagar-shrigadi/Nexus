import PostContent from "@/app/ui/post/post-content";
import PostHeader from "@/app/ui/post/post-header";

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
    user: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
}) {
  return (
    <article className="flex flex-col gap-4 py-4 border-y">
      <PostHeader
        post={{
          id: post.id,
          userId: post.userId,
          user: {
            ...post.user,
          },
        }}
      />
      <PostContent
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          commentCount: post.commentCount,
          user: {
            username: post.user.username,
          },
        }}
      />
    </article>
  );
}
