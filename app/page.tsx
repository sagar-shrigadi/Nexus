import { getAllPosts } from "@/app/services/posts";
import Image from "next/image";
import { getRandomUsers } from "@/app/services/users";

export default async function Home() {
  const posts = await getAllPosts();
  const users = await getRandomUsers(10);

  return (
    <main className="flex flex-1 w-full mx-auto flex-col sm:flex-row bg-white dark:bg-black sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
      <section className="grow w-full max-w-3xl flex flex-col gap-5 h-[85dvh] sm:h-dvh overflow-y-scroll border-x rounded">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col pt-2 pb-4 px-4 border-y"
          >
            <div className="flex items-center gap-3.5 cursor-pointer py-1">
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-7.5 md:w-8.5 aspect-square block"
              />
              <h2 className="text-lg sm:text-xl">{post.users.username}</h2>
            </div>
            <div className="flex flex-col gap-1 pl-12.5 cursor-pointer">
              <h3 className="sm:text-lg font-bold">{post.title}</h3>
              <p>{post.content}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="hidden min-w-80 max-w-100 sm:justify-self-end md:max-h-dvh md:flex md:overflow-y-scroll flex-col gap-4 border rounded">
        <h2 className="text-xl lg:text-2xl font-bold mt-2 mb-3 ml-4">
          Users to Follow
        </h2>
        {users.map((user) => (
          <article
            key={user.id}
            className="flex justify-between items-center gap-4 px-4 py-1.5 not-last:border-y last:border-t"
          >
            <div className="grow flex items-center gap-6">
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-7.5 sm:w-9 aspect-square block"
              />
              <div className="mr-6 cursor-pointer">
                <h3>{`${user.firstName} ${user.lastName}`}</h3>
                <p className="text-gray-600 text-sm">@{user.username}</p>
              </div>
            </div>
            <button className="border px-6 py-1 rounded cursor-pointer text-center max-w-25">
              Follow
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
