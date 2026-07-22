import DeletePost from "@/app/ui/post/delete-post";
import Link from "next/link";
import { Session } from "next-auth";
import PopoverButton from "@/app/ui/button/popover-button";

export default function PostOptions({
  session,
  post,
}: {
  session: Session | null;
  post: {
    id: number;
    userId: number;
  };
}) {
  return (
    <>
      <PopoverButton
        popoverTarget={`${post.userId}PostActions`}
        style={{ anchorName: `${post.userId}Pos` }}
      />
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
