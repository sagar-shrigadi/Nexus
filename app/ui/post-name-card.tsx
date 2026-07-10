import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import PostOptions from "@/app/ui/post-options";

export default async function PostNameCard({
  post,
}: {
  post: {
    userId: number;
    id: number;
    title: string;
    content: string;
    users: {
      username: string;
      firstName: string;
      lastName: string;
    };
  };
}) {
  const session = await auth();
  return (
    <div className="flex justify-between px-4 py-1">
      <Link
        href={`/${post.users.username}`}
        className="grow flex items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:text-gray-400 transition-colors"
      >
        <Image
          src="/images/defaultProfile.png"
          width={180}
          height={180}
          alt="default image avatar for user"
          className="rounded-full w-7.5 md:w-8.5 aspect-square block"
        />
        <span>{`${post.users.firstName} ${post.users.lastName}`}</span>
      </Link>
      {post.userId === Number(session?.user?.id) && (
        <PostOptions session={session} post={post} />
      )}
    </div>
  );
}
