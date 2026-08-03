import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FollowUserCardSkeletion() {
  return (
    <li className="flex justify-between items-center gap-4 px-4 py-1.5 border rounded">
      <UserNameCardSkeleton />
      <FollowUserFormSkeleton />
    </li>
  );
}

export function UserNameCardSkeleton() {
  return (
    <div className="flex w-fit items-center gap-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-37.5" />
        <Skeleton className="h-4 w-25" />
      </div>
    </div>
  );
}
export function FollowUserFormSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("w-25 h-7 rounded", className)} />;
}
