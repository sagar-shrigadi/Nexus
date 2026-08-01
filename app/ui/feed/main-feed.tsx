import { ScrollArea } from "@/components/ui/scroll-area";
import CreatePost from "@/app/ui/post/create-post";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/app/ui/post/post-card";
import { auth } from "@/auth";
import {
  getAllLikedPostsByUser,
  getAllPostsByUserAndUsersFollowedByUser,
} from "@/app/services/posts";

export default async function MainFeed() {
  const session = await auth();
  const posts = await getAllPostsByUserAndUsersFollowedByUser(
    Number(session?.user?.id),
  );
  const likedPosts = await getAllLikedPostsByUser(Number(session?.user?.id));
  const likedPostsId = new Set(likedPosts.map((p) => p.postId));

  return (
    <article className="grow flex flex-col gap-4 w-full max-w-3xl h-[85svh] sm:h-svh">
      <CreatePost session={session} />
      <section className="grow min-h-0">
        <ScrollArea className="h-full border rounded">
          {posts.map((post, i) => (
            <article key={post.id}>
              {i > 0 && <Separator />}
              <PostCard
                post={{
                  ...post,
                  isLiked: likedPostsId.has(post.id),
                }}
              />
            </article>
          ))}
        </ScrollArea>
      </section>
    </article>
  );
}
