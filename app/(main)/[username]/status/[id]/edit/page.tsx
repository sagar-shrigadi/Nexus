import { getPostById } from "@/app/services/posts";
import EditPostForm from "@/app/ui/edit-post";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  const session = await auth();

  if (!post) {
    notFound();
  }

  if (post.userId !== Number(session?.user?.id)) {
    return <h1>Not Authorised!</h1>;
  }

  return (
    <main className="grow w-full max-w-3xl mx-auto px-4 md:px-6 py-2">
      <EditPostForm post={post} />
    </main>
  );
}
