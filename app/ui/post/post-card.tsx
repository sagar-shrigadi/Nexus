import PostContent from "@/app/ui/post/post-content";
import PostHeader from "@/app/ui/post/post-header";

export default function PostCard({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    userId: number;
    likes: number;
    commentsCount: number;
    isLiked: boolean;
    users: {
      username: string;
      firstName: string;
      lastName: string;
      avatar: {
        publicUrl: string;
      } | null;
    };
  };
}) {
  return (
    <div className="flex flex-col gap-1 py-2.5">
      <PostHeader
        post={{
          id: post.id,
          userId: post.userId,
          users: {
            ...post.users,
          },
        }}
      />
      <PostContent
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          commentsCount: post.commentsCount,
          isLiked: post.isLiked,
          createdAt: post.createdAt,
          users: {
            username: post.users.username,
          },
        }}
      />
    </div>
  );
}
