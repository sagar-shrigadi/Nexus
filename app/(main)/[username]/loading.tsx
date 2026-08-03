import { FeedSkeleton } from "@/app/ui/feed/skeleton";
import { FollowUserFormSkeleton } from "@/app/ui/user/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default async function UserPageSkeleton() {
  return (
    <div className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col overflow-hidden">
      <header className="flex items-center gap-4 px-2 py-4">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-1/2 h-8" />
      </header>
      <div className="border rounded">
        <section className="flex flex-col pb-4">
          <div className="relative mb-15">
            <Skeleton className="w-full h-55 md:h-60" />
            <div className="px-4 absolute z-2 bottom-0 translate-y-1/2 flex justify-between w-full">
              <Skeleton className="w-30 h-30 rounded" />

              <FollowUserFormSkeleton className="self-end" />
            </div>
          </div>
          <div className="px-4 pt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <Skeleton className="w-1/3 h-8" />
              <Skeleton className="w-1/4 h-6" />
            </div>
            <div className="flex w-full max-w-xs flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="w-25 h-6" />
              <Skeleton className="w-25 h-6" />
            </div>
          </div>
        </section>
        <section className="grow min-h-0">
          <FeedSkeleton count={2} />
        </section>
      </div>
    </div>
  );
}
