import { getPostById } from "@/app/services/posts";
import EditPostForm from "@/app/ui/post/edit-post";
import { auth } from "@/auth";
import { forbidden, notFound, redirect } from "next/navigation";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    notFound();
  }

  if (post.users.username !== session.user.email) {
    forbidden();
  }

  return <EditPostForm post={post} />;
}
