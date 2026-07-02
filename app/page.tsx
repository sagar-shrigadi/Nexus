import { getAllPosts } from "@/app/services/posts";
import Image from "next/image";

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <main className="flex flex-1 w-full max-w-3xl mx-auto py-6 flex-col bg-white dark:bg-black sm:items-start">
      <section className="w-full px-6 flex flex-col gap-5 h-[94dvh] overflow-y-scroll">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-3 py-2 px-4 min-w-150"
          >
            <div className="flex items-center gap-4.5 cursor-pointer">
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-10 aspect-square"
              />
              <h2 className="text-xl">@{post.users.username}</h2>
            </div>
            <div className="flex flex-col gap-1 pl-15 cursor-pointer">
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p>{post.content}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
