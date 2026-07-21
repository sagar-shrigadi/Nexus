import { EllipsisIcon } from "lucide-react";
import DeleteComment from "@/app/ui/delete-comment";
import { Dispatch, SetStateAction } from "react";
import PopoverButton from "@/app/ui/button/popover-button";

export default function CommentOptions({
  commentId,
  setIsEditing,
}: {
  commentId: number;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <PopoverButton
        popoverTarget={`${commentId}'sAction`}
        style={{ anchorName: `${commentId}Pos` }}
      >
        <EllipsisIcon className="size-6" />
      </PopoverButton>
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
