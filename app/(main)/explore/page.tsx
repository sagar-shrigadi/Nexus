import { getLatestPosts } from "@/app/services/posts";
import PostCard from "@/app/ui/post/post-card";
import { Suspense } from "react";
import ExploreSidebar from "@/app/ui/sidebar/explore-sidebar";

export default async function Explore() {
  const posts = await getLatestPosts();
  return (
    <main className="flex flex-1 w-full mx-auto flex-col sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
      <section className="grow w-full max-w-3xl flex flex-col gap-5 h-[85dvh] sm:h-dvh overflow-y-scroll border-x rounded">
        <h1 className="text-2xl lg:text-3xl font-bold mt-2 mb-3 ml-4">
          Explore Latest Tweets
        </h1>
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
      <Suspense>
        <ExploreSidebar />
      </Suspense>
    </main>
  );
}
