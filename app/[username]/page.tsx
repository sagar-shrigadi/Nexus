import { notFound } from "next/navigation";
import { getUserWithPostsByUsername } from "../services/users";

import Image from "next/image";
import BackButton from "@/app/ui/backButtton";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserWithPostsByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="flex flex-1 w-full max-w-3xl h-dvh mx-auto flex-col bg-white dark:bg-black">
      <section className="border-x border-gray-500 flex flex-col py-2">
        <div className="flex gap-3 px-4 pb-4">
          <BackButton />
          <h2 className="text-2xl lg:text-3xl">{`${user.firstName} ${user.lastName}`}</h2>
        </div>
        <div className="grid relative">
          <div className="w-full h-55 md:h-60 bg-gray-800"></div>
          <div className="px-4 absolute z-2 top-38.5 md:top-40 lg:top-35">
            <Image
              src="/images/defaultProfile.png"
              width={180}
              height={180}
              alt="default image avatar for user"
              className="rounded-[4%] size-30 md:size-36.5 lg:size-45 block border-4 border-gray-400"
            />
          </div>
        </div>
        <div className="px-4 mt-15 md:mt-18 lg:mt-22.5 flex flex-col gap-3">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl lg:text-3xl">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-gray-500 text-lg md:text-xl">@{user.username}</p>
          </div>
          <article className="text-lg md:text-xl">{user.bio}</article>
        </div>
      </section>
      <section className="border-x border-gray-500 grow">
        {user.posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col pt-2 pb-4 px-4 border-y border-gray-500"
          >
            <div className="flex items-center gap-3.5 cursor-pointer py-1">
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-7.5 md:w-8.5 aspect-square block"
              />
              <h2 className="text-lg sm:text-xl">{`${user.firstName} ${user.lastName}`}</h2>
            </div>
            <div className="flex flex-col gap-1 pl-12.5 cursor-pointer">
              <h3 className="sm:text-lg font-bold">{post.title}</h3>
              <p>{post.content}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
