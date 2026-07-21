import { EllipsisIcon } from "lucide-react";
import DeletePost from "@/app/ui/delete-post";
import Link from "next/link";
import { Session } from "next-auth";
import PopoverButton from "@/app/ui/button/popover-button";

export default function PostOptions({
  session,
  post,
}: {
  session: Session | null;
  post: {
    userId: number;
    id: number;
    title: string;
    content: string;
    users?: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
}) {
  return (
    <>
      <PopoverButton
        popoverTarget={`${post.userId}PostActions`}
        style={{ anchorName: `${post.userId}Pos` }}
      >
        <EllipsisIcon className="size-6" />
      </PopoverButton>
      <div
        id={`${post.userId}PostActions`}
        aria-atomic="true"
        popover="auto"
        style={{ positionAnchor: `${post.userId}Pos` }}
        className="absolute [position-area:bottom_left] rounded shadow-md"
      >
        <div className="flex flex-col gap-2 p-2">
          <DeletePost postId={post.id} />
          <Link
            href={`/${session?.user?.email}/status/${post.id}/edit`}
            className="px-6 py-1.5 hover:bg-gray-200 rounded cursor-pointer transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
    </>
  );
}
