import { auth } from "@/auth";
import PostOptions from "@/app/ui/post/post-options";
import UserNameCard from "@/app/ui/user/name-card";

export default async function PostHeader({
  post,
}: {
  post: {
    id: number;
    userId: number;
    user: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
}) {
  const session = await auth();
  return (
    <div className="flex justify-between px-4 py-1 gap-4">
      <UserNameCard
        className="flex"
        to={`/${post.user.username}`}
        fullname={`${post.user.firstName} ${post.user.lastName}`}
      />
      {post.userId === Number(session?.user?.id) && (
        <PostOptions
          session={session}
          post={{ userId: post.userId, id: post.id }}
        />
      )}
    </div>
  );
}
