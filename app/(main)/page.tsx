import { getAllPostsByUserAndUsersFollowedByUser } from "@/app/services/posts";
import Image from "next/image";
import { allUsersFollowedByUser, getRandomUsers } from "@/app/services/users";
import Link from "next/link";
import CreatePost from "@/app/ui/post/create-post";
import PostCard from "@/app/ui/post/post-card";
import { auth } from "@/auth";
import FollowUserForm from "@/app/ui/follow-user-form";

export default async function Home() {
  const session = await auth();
  const posts = await getAllPostsByUserAndUsersFollowedByUser(
    Number(session?.user?.id),
  );
  const users = await getRandomUsers(10);
  const usersFollowed = await allUsersFollowedByUser(Number(session?.user?.id));
  return (
    <main className="flex flex-1 w-full mx-auto flex-col px-2 sm:flex-row bg-white dark:bg-black sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
      <div className="grow flex flex-col gap-4 w-full max-w-3xl h-[85dvh] sm:h-dvh">
        <CreatePost />
        <section className="grow flex flex-col gap-5 overflow-y-scroll border-x rounded">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                content: post.content,
                userId: post.userId,
                likes: post.likes,
                commentCount: post.commentsCount,
                user: {
                  ...post.users,
                },
              }}
            />
          ))}
        </section>
      </div>
      <section className="hidden min-w-80 max-w-100 sm:justify-self-end md:max-h-dvh md:flex md:overflow-y-scroll flex-col gap-4 border rounded">
        <h2 className="text-xl lg:text-2xl font-bold mt-2 mb-3 ml-4">
          Users to Follow
        </h2>
        {users.map((user) => (
          <article
            key={user.id}
            className="flex justify-between items-center gap-4 px-4 py-1.5 not-last:border-y last:border-t"
          >
            <Link
              href={`/${user.username}`}
              className="grow flex items-center gap-6 hover:text-gray-400 transition-colors cursor-pointer"
            >
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-7.5 sm:w-9 aspect-square block"
              />
              <div className="flex flex-col">
                <span>{`${user.firstName} ${user.lastName}`}</span>
                <span className="text-(--lightText) text-sm">
                  @{user.username}
                </span>
              </div>
            </Link>
            <FollowUserForm
              session={session!}
              userToFollow={user}
              usersFollowed={usersFollowed}
            />
          </article>
        ))}
      </section>
    </main>
  );
}
