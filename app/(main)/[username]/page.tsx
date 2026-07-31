import { notFound } from "next/navigation";
import {
  getUserWithPostsByUsername,
  isUserFollowedByUserWithId,
} from "@/app/services/users";
import BackButton from "@/app/ui/button/back-button";
import PostCard from "@/app/ui/post/post-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";
import FollowUserForm from "@/app/ui/user/follow-user-form";
import { getAllLikedPostsByUser } from "@/app/services/posts";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth();
  const { username } = await params;
  const user = await getUserWithPostsByUsername(username);
  if (!user) {
    notFound();
  }
  const isFollowed = await isUserFollowedByUserWithId(
    Number(session?.user?.id),
    user.id,
  );
  const likedPosts = await getAllLikedPostsByUser(Number(session?.user?.id));
  const likedPostsId = new Set(likedPosts.map((p) => p.postId));

  return (
    <div className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col">
      <header className="flex items-center gap-4 px-2 py-4">
        <BackButton />
        <h2 className="text-2xl">{`${user.firstName} ${user.lastName}`}</h2>
      </header>
      <ScrollArea className="grow min-h-0 border rounded">
        <section className="flex flex-col pb-4">
          <div className="relative mb-15">
            {/* keep the margin-bottom here exactly half of the Avatar size from below */}
            <div className="w-full h-55 md:h-60 bg-muted dark:bg-muted"></div>
            <div className="px-4 absolute z-2 bottom-0 translate-y-1/2 flex justify-between w-full">
              <Avatar className="size-30">
                <AvatarImage
                  src="/images/defaultProfile.png"
                  alt="Default User Avatar"
                  className="object-cover rounded-[4%]"
                />
                <AvatarFallback className="rounded-[4%]">{"U"}</AvatarFallback>
              </Avatar>
              {session?.user?.email === username || (
                <FollowUserForm
                  session={session}
                  user={{
                    id: user.id,
                    username: user.username,
                    isFollowed: !!isFollowed,
                  }}
                  className="self-end"
                />
              )}
            </div>
          </div>
          <div className="px-4 pt-2 flex flex-col gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-lg md:text-xl text-sidebar-ring">
                @{user.username}
              </p>
            </div>
            <div className="text-lg">{user.bio}</div>
            <div className="flex items-center gap-4">
              <span>{user.following} following</span>
              <span>{user.followers} followers</span>
            </div>
          </div>
        </section>
        <Separator />
        <section className="grow">
          {user.posts.map((post, i) => (
            <article key={post.id}>
              {i > 0 && <Separator />}
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  userId: post.userId,
                  likes: post.likes,
                  commentCount: post.commentsCount,
                  isLiked: likedPostsId.has(post.id),
                  user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                  },
                }}
              />
            </article>
          ))}
        </section>
      </ScrollArea>
    </div>
  );
}
