import { getAllLikedPostsByUser, getLatestPosts } from "@/app/services/posts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/app/ui/post/post-card";
import { auth } from "@/auth";
import EmptyListTemplate from "@/app/ui/empty-list-template";

export default async function ExploreFeed() {
  const session = await auth();
  const posts = await getLatestPosts();
  const likedPosts = await getAllLikedPostsByUser(Number(session?.user?.id));
  const likedPostsId = new Set(likedPosts.map((p) => p.postId));

  return (
    <article className="grow flex flex-col gap-4 w-full max-w-3xl h-[85svh] sm:h-svh">
      <h1 className="text-2xl lg:text-3xl font-bold px-4 py-2">
        Explore Latest Tweets
      </h1>
      <section className="grow min-h-0">
        <ScrollArea className="h-full border rounded">
          {posts.length > 0 ? (
            posts.map((post, i) => (
              <article key={post.id}>
                {i > 0 && <Separator />}
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    isLiked: likedPostsId.has(post.id),
                  }}
                />
              </article>
            ))
          ) : (
            <EmptyListTemplate content="posts" />
          )}
        </ScrollArea>
      </section>
    </article>
  );
}
