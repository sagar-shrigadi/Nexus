import { ScrollArea } from "@/components/ui/scroll-area";
import CreatePost from "@/app/ui/post/create-post";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/app/ui/post/post-card";
import {
  getAllLikedPostsByUser,
  getAllPostsByUserAndUsersFollowedByUser,
} from "@/app/services/posts";
import EmptyListTemplate from "@/app/ui/empty-list-template";
import { User } from "next-auth";

export default async function MainFeed({ sessionUser }: { sessionUser: User }) {
  const posts = await getAllPostsByUserAndUsersFollowedByUser(
    Number(sessionUser.id),
  );
  const likedPosts = await getAllLikedPostsByUser(Number(sessionUser.id));
  const likedPostsId = new Set(likedPosts.map((p) => p.postId));

  return (
    <article className="grow flex flex-col gap-4 w-full max-w-3xl h-[85svh] sm:h-svh">
      <CreatePost />
      <section className="grow min-h-0">
        <ScrollArea className="h-full border rounded">
          {posts.length > 0 ? (
            posts.map((post, i) => (
              <article key={post.id}>
                {i > 0 && <Separator />}
                <PostCard
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
