import PostContent from "@/app/ui/post/post-content";
import PostHeader from "@/app/ui/post/post-header";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    userId: number;
    mediaId: number | null;
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
    media: {
      fileName: string;
      publicUrl: string;
    } | null;
  };
  shouldClamp?: boolean;
}
export default function PostCard({ post, shouldClamp = true }: PostCardProps) {
  return (
    <div className="flex flex-col gap-1 py-2.5">
      <PostHeader
        post={{
          id: post.id,
          userId: post.userId,
          users: {
            ...post.users,
          },
          media: post.media,
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
          mediaId: post.mediaId,
          users: {
            username: post.users.username,
          },
          media: post.media,
        }}
        shouldClamp={shouldClamp}
      />
    </div>
  );
}
