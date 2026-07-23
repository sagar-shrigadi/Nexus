import { getAllPostsByUserAndUsersFollowedByUser } from "@/app/services/posts";
import CreatePost from "@/app/ui/post/create-post";
import PostCard from "@/app/ui/post/post-card";
import { auth } from "@/auth";
import MainSidebar from "@/app/ui/sidebar/main-sidebar";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();
  const posts = await getAllPostsByUserAndUsersFollowedByUser(
    Number(session?.user?.id),
  );
  return (
    <main className="flex flex-1 w-full mx-auto flex-col px-2 sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
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
      <Suspense>
        <MainSidebar />
      </Suspense>
    </main>
  );
}
