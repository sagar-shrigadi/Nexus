import { EllipsisIcon } from "lucide-react";
import DeleteComment from "@/app/ui/delete-comment";
import { Dispatch, SetStateAction } from "react";

export default function CommentOptions({
  commentId,
  setIsEditing,
}: {
  commentId: number;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <button
        popoverTarget={`${commentId}'sAction`}
        style={{ anchorName: `${commentId}Pos` }}
        className="cursor-pointer hover:bg-(--hover) px-1 rounded-full transition-colors"
      >
        <EllipsisIcon className="size-6" />
      </button>
      <div
        id={`${commentId}'sAction`}
        aria-atomic="true"
        popover="auto"
        style={{ positionAnchor: `${commentId}Pos` }}
        className="absolute [position-area:top_left] rounded shadow-md"
      >
        <div className="flex flex-col gap-2 p-2">
          <DeleteComment commentId={commentId} />
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-1.5 hover:bg-gray-200 rounded cursor-pointer transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
