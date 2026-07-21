import { auth } from "@/auth";
import PostOptions from "@/app/ui/post-options";
import UserNameCard from "@/app/ui/user/name-card";

export default async function PostNameCard({
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
  const session = await auth();
  return (
    <div className="flex justify-between px-4 py-1">
      <UserNameCard
        className="flex"
        to={`/${post.users.username}`}
        username={`${post.users.firstName} ${post.users.lastName}`}
      />
      {post.userId === Number(session?.user?.id) && (
        <PostOptions session={session} post={post} />
      )}
    </div>
  );
}
