import { getLatestPosts } from "@/app/services/posts";
import Image from "next/image";
import { getRandomUsers } from "@/app/services/users";
import Link from "next/link";
import { EllipsisIcon } from "lucide-react";
import { auth } from "@/auth";
import DeleteForm from "@/app/ui/delete-form";

export default async function Explore() {
  const session = await auth();
  const posts = await getLatestPosts();
  const users = await getRandomUsers(3);
  return (
    <main className="flex flex-1 w-full mx-auto flex-col sm:flex-row bg-white dark:bg-black sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
      <section className="grow w-full max-w-3xl flex flex-col gap-5 h-[85dvh] sm:h-dvh overflow-y-scroll border-x rounded">
        <h1 className="text-2xl lg:text-3xl font-bold mt-2 mb-3 ml-4">
          Explore Latest Tweets
        </h1>
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-2 pt-2 pb-4 border-y"
          >
            <div className="flex justify-between px-4 py-1">
              <Link
                href={`/${post.users.username}`}
                className="grow flex items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:text-gray-400 transition-colors"
              >
                <Image
                  src="/images/defaultProfile.png"
                  width={180}
                  height={180}
                  alt="default image avatar for user"
                  className="rounded-full w-7.5 md:w-8.5 aspect-square block"
                />
                <span>{`${post.users.firstName} ${post.users.lastName}`}</span>
              </Link>
              {post.userId === Number(session?.user?.id) && (
                <button
                  popoverTarget={`${post.userId}PostActions`}
                  style={{ anchorName: `${post.userId}Pos` }}
                  className="cursor-pointer hover:bg-(--hover) px-1 rounded-full transition-colors"
                >
                  <EllipsisIcon className="size-6" />
                </button>
              )}
              <div
                id={`${post.userId}PostActions`}
                aria-atomic="true"
                popover="auto"
                style={{ positionAnchor: `${post.userId}Pos` }}
                className="absolute [position-area:bottom_left] rounded shadow-md"
              >
                <div className="flex flex-col gap-2 p-2">
                  <DeleteForm postId={post.id} />
                  <Link
                    href={`/${session?.user?.email}/status/${post.id}/edit`}
                    className="px-6 py-1.5 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href={`/${post.users.username}/status/${post.id}`}
              className="hover:bg-(--hover) transition-colors py-2"
            >
              <div className="flex flex-col gap-1 pl-12.5 cursor-pointer">
                <h3 className="sm:text-lg font-bold">{post.title}</h3>
                <p>{post.content}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
      <section className="hidden min-w-80 xl:w-100 justify-self-end md:flex flex-col gap-8 md:h-dvh">
        <article className="flex flex-col gap-4 border-x border-b rounded">
          <h2 className="text-xl lg:text-2xl font-bold my-2 ml-4">
            Trending Users
          </h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center gap-8 px-4 py-1.5 not-last:border-y last:border-t"
            >
              <Link
                href={`/${user.username}`}
                className="grow flex items-center gap-6 cursor-pointer hover:text-gray-400 transition-colors"
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
              <button className="border px-6 py-1 rounded cursor-pointer text-center max-w-25">
                Follow
              </button>
            </div>
          ))}
        </article>
        <article className="flex flex-col gap-4 rounded border">
          <h2 className="text-xl lg:text-2xl font-bold mt-3 mb-2 px-4">
            Trends For You
          </h2>
          <div className="flex flex-col gap-6">
            <div className="p-4 border-y">
              <h3 className="text-lg cursor-pointer rounded">
                Lorem ipsum dolor
              </h3>
            </div>
            <div className="p-4 border-y">
              <h3 className="text-lg cursor-pointer rounded">
                Lorem ipsum dolor
              </h3>
            </div>
            <div className="p-4 border-y">
              <h3 className="text-lg cursor-pointer rounded">
                Lorem ipsum dolor
              </h3>
            </div>
            <div className="p-4 border-t">
              <h3 className="text-lg cursor-pointer rounded">
                Lorem ipsum dolor
              </h3>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
