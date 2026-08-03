import { UserNameCardSkeleton } from "@/app/ui/user/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
  return (
    <div className="flex justify-between px-4 py-1 gap-4">
      <UserNameCardSkeleton />
      <Skeleton className="w-8 h-8 rounded" />
    </div>
  );
}
export function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-1 py-2.5">
      <HeaderSkeleton />
      <div className="flex flex-col gap-4 px-4 py-1">
        <div className="flex justify-center flex-col gap-1 px-6 py-2 cursor-pointer hover:bg-sidebar-accent rounded transition-colors">
          <Skeleton className="sm:text-lg font-bold" />
          <Skeleton className="line-clamp-4 max-w-[65ch]" />
        </div>
        <div>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="flex items-center gap-6 px-6">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 aspect-square rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 aspect-square rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function CreatePostSkeleton() {
  return (
    <div className="grow flex gap-4 p-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex grow flex-col gap-7">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-24 ml-auto" />
      </div>
    </div>
  );
}
