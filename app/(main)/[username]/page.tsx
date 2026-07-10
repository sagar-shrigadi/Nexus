import { notFound } from "next/navigation";
import { getUserWithPostsByUsername } from "@/app/services/users";

import Image from "next/image";
import BackButton from "@/app/ui/backButtton";
import Link from "next/link";
import { auth } from "@/auth";
import PostOptions from "@/app/ui/post-options";
import PostContentCard from "@/app/ui/post-content-card";

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

  return (
    <main className="flex flex-1 w-full max-w-3xl h-dvh mx-auto flex-col">
      <section className="border-x border-gray-500 flex flex-col py-2 pb-4">
        <div className="flex items-center gap-3 px-4 pb-2">
          <BackButton />
          <h2 className="text-2xl lg:text-[28px]">{`${user.firstName} ${user.lastName}`}</h2>
        </div>
        <div className="relative">
          <div className="w-full h-55 md:h-60 bg-gray-800"></div>
          <div className="px-4 absolute z-2 top-38.5 md:top-40 lg:top-36.5">
            <Image
              src="/images/defaultProfile.png"
              width={180}
              height={180}
              alt="default image avatar for user"
              className="rounded-[4%] size-30 md:size-36.5 lg:size-42.5 block border-4 border-gray-400"
              loading="eager"
            />
          </div>
        </div>
        <div className="px-4 mt-15 md:mt-18 lg:mt-20.5 flex flex-col gap-3">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl lg:text-[28px]">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-gray-500 text-lg md:text-xl">@{user.username}</p>
          </div>
          <article className="text-lg md:text-xl">{user.bio}</article>
        </div>
      </section>
      <section className="border-x border-gray-500 grow">
        {user.posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-2 pt-2 pb-4 border-y border-gray-500 "
          >
            <div className="flex justify-between px-4 py-1">
              <Link
                href={`/${user.username}`}
                className="grow flex items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:underline transition-all"
              >
                <Image
                  src="/images/defaultProfile.png"
                  width={180}
                  height={180}
                  alt="default image avatar for user"
                  className="rounded-full w-7.5 md:w-8.5 aspect-square block"
                />
                <span>{`${user.firstName} ${user.lastName}`}</span>
              </Link>
              {post.userId === Number(session?.user?.id) && (
                <PostOptions session={session} post={post} />
              )}
            </div>
            <Link
              href={`/${user.username}/status/${post.id}`}
              className="hover:bg-(--hover) transition-colors py-2"
            >
              <PostContentCard post={post} />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
