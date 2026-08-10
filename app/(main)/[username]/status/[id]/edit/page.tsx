import { getPostById } from "@/app/services/posts";
import EditPostForm from "@/app/ui/post/edit-post";
import { notFound } from "next/navigation";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    notFound();
  }

  return <EditPostForm post={post} />;
}
