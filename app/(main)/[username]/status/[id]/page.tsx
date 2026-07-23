import { getAllLikedCommentsByUserOnPost } from "@/app/services/comments";
import {
  getPostByIdWithComments,
  isPostLikedByUser,
} from "@/app/services/posts";
import BackButton from "@/app/ui/button/back-button";
import CommentCard from "@/app/ui/comment/comment-card";
import CreateComment from "@/app/ui/comment/create-comment";
import PostOptions from "@/app/ui/post/post-options";
import SinglePostLikeForm from "@/app/ui/post/single-post-like-form";
import UserNameCard from "@/app/ui/user/name-card";
import { auth } from "@/auth";
import { MessageSquare } from "lucide-react";
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
  const isLiked = await isPostLikedByUser(
    Number(session?.user?.id),
    Number(id),
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex flex-1 flex-col h-dvh w-full max-w-3xl">
      <section className="grow w-full max-w-3xl flex flex-col gap-5 border-x rounded">
        <div className="flex items-center gap-4 px-4 py-2 sticky border">
          <BackButton />
          <h2 className="text-2xl">Post</h2>
        </div>
        <div className="px-6 flex justify-between items-center">
          <UserNameCard
            className="flex gap-4"
            to={`/${post.users.username}`}
            fullname={`${post.users.firstName} ${post.users.lastName}`}
            username={post.users.username}
          />
          {Number(session?.user?.id) === post.userId ? (
            <PostOptions
              session={session}
              post={{ id: post.id, userId: post.userId }}
            />
          ) : (
            ""
          )}
        </div>
        <article className="px-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <div className="text-lg">{post.content}</div>
        </article>
        <div className="px-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5.5" />
            <span>{post.commentCount > 0 ? `${post.commentCount}` : ""}</span>
          </div>
          <SinglePostLikeForm
            session={session}
            post={{
              id: post.id,
              likes: post.likes,
            }}
            isLiked={{ postId: isLiked?.postId }}
          />
        </div>
        <div>
          <CreateComment postId={Number(id)} />
          <article className="flex flex-col gap-4 py-4">
            <h2 className="font-bold text-2xl px-6">
              <span>Comments</span>
            </h2>
            <div>
              {post.comments.map((comment) => (
                <div key={comment.id} className="w-full border-y">
                  <CommentCard
                    session={session}
                    comment={comment}
                    likedComments={likedComments}
                  />
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
