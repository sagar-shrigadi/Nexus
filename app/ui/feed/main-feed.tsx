import { ScrollArea } from "@/components/ui/scroll-area";
import CreatePost from "@/app/ui/post/create-post";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/app/ui/post/post-card";
import { auth } from "@/auth";
import { getAllPostsByUserAndUsersFollowedByUser } from "@/app/services/posts";

export default async function MainFeed() {
  const session = await auth();
  const posts = await getAllPostsByUserAndUsersFollowedByUser(
    Number(session?.user?.id),
  );
  return (
    <article className="grow flex flex-col gap-4 w-full max-w-3xl h-[85dvh] sm:h-dvh">
      <CreatePost session={session} />
      <section className="grow min-h-0">
        <ScrollArea className="h-full border rounded">
          {posts.map((post, i) => (
            <article key={post.id}>
              {i > 0 && <Separator />}
              <PostCard
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
            </article>
          ))}
        </ScrollArea>
      </section>
    </article>
  );
}
