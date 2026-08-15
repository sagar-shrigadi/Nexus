import { Skeleton } from "@/components/ui/skeleton";
import { UserNameCardSkeleton } from "@/app/ui/user/skeleton";

export function CreateCommentSkeleton() {
  return (
    <article className="px-4 my-4">
      <div>
        <div className="flex flex-col gap-4">
          <div>
            <Skeleton className="w-full h-25" />
          </div>
          <Skeleton className="w-8 h-8 rounded mr-auto" />
          <Skeleton className="w-35 h-10 ml-auto" />
        </div>
      </div>
    </article>
  );
}
export function CommentCardSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-4 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <UserNameCardSkeleton />
          <Skeleton className="w-30 h-6" />
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="w-8 h-8 rounded" />
    </div>
  );
}
