import { getAllLikedCommentsByUserOnPost } from "@/app/services/comments";
import { getPostByIdWithComments } from "@/app/services/posts";
import BackButton from "@/app/ui/button/back-button";
import CommentCard from "@/app/ui/comment/comment-card";
import CreateComment from "@/app/ui/comment/create-comment";
import PostCard from "@/app/ui/post/post-card";
import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const post = await getPostByIdWithComments(Number(id));
  const likedComments = await getAllLikedCommentsByUserOnPost(
    Number(session?.user?.id),
    Number(id),
  );
  // a set for fast lookups of each commentId for each comment card
  // instead of using some() method on likedComments to check if a commentId exists in it or not
  const likedCommentsIds = new Set(likedComments.map((c) => c.commentId));

  if (!post) {
    notFound();
  }

  return (
    <div className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col">
      <header className="flex items-center gap-4 px-2 py-4">
        <BackButton />
        <h2 className="text-2xl">Post</h2>
      </header>
      <ScrollArea className="grow min-h-0 border rounded">
        <section>
          <PostCard
            post={{
              id: post.id,
              title: post.title,
              content: post.content,
              userId: post.userId,
              likes: post.likes,
              commentCount: post.commentCount,
              user: {
                ...post.users,
              },
            }}
          />
        </section>
        <Separator />
        <section>
          <CreateComment postId={Number(id)} />
          <Separator />
          <section>
            <header className="px-6 py-2">
              <h2 className="font-bold text-2xl">Comments</h2>
            </header>
            <Separator />
            <section className="grow">
              {post.comments.map((comment, i) => (
                <article key={comment.id}>
                  {i > 0 && <Separator />}
                  <CommentCard
                    session={session}
                    comment={{
                      ...comment,
                      isLiked: likedCommentsIds.has(comment.id),
                    }}
                  />
                </article>
              ))}
            </section>
          </section>
        </section>
      </ScrollArea>
    </div>
  );
}
