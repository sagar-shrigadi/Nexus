import { getPostByIdWithComments } from "@/app/services/posts";
import BackButton from "@/app/ui/backButtton";
import CommentCard from "@/app/ui/comment-card";
import CreateComment from "@/app/ui/create-comment";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdWithComments(Number(id));

  if (!post) {
    notFound();
  }

  return (
    <main className=" mx-auto flex flex-1 flex-col h-dvh w-full max-w-3xl">
      <section className="grow w-full max-w-3xl flex flex-col gap-5 border-x rounded">
        <div className="flex items-center gap-4 px-4 py-2 sticky border">
          <BackButton />
          <h2 className="text-2xl">Post</h2>
        </div>
        <div className="px-6">
          <Link
            href={`/${post.users.username}`}
            className="grow flex items-center gap-4 cursor-pointer"
          >
            <Image
              src="/images/defaultProfile.png"
              width={180}
              height={180}
              loading="eager"
              alt="default image avatar for user"
              className="rounded-full w-7.5 sm:w-9 aspect-square block"
            />
            <div className="flex flex-col">
              <span className="hover:underline transition-all text-lg font-bold">{`${post.users.firstName} ${post.users.lastName}`}</span>
              <span className="text-(--lightText)">@{post.users.username}</span>
            </div>
          </Link>
        </div>
        <article className="px-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <div className="text-lg">{post.content}</div>
        </article>
        <div>
          <CreateComment postId={Number(id)} />
          <article className="flex flex-col gap-4 py-4">
            <h2 className="font-bold text-2xl px-6 mb-2">
              {post.commentCount > 0 && post.commentCount} <span>Comments</span>
            </h2>
            <div>
              {post.comments.map((comment) => (
                <div key={comment.id} className="w-full border">
                  <CommentCard comment={comment} />
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
