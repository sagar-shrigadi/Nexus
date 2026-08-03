import { Separator } from "@/components/ui/separator";
import { CreatePostSkeleton, PostCardSkeleton } from "@/app/ui/post/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <section className="grow min-h-0 h-full border rounded overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <article key={i}>
          {i > 0 && <Separator />}
          <PostCardSkeleton />
        </article>
      ))}
    </section>
  );
}
export function MainFeedSkeleton() {
  return (
    <article className="grow flex flex-col gap-4 w-full max-w-3xl h-[85svh] sm:h-svh overflow-hidden">
      <CreatePostSkeleton />
      <FeedSkeleton />
    </article>
  );
}
export function ExploreFeedSkeleton() {
  return (
    <article className="grow flex flex-col gap-4 w-full max-w-3xl h-[85svh] sm:h-svh overflow-hidden">
      <div className="w-[80%] sm:w-1/2 p-4 mr-auto">
        <Skeleton className="h-10 text-2xl lg:text-3xl font-bold px-4 py-2" />
      </div>
      <FeedSkeleton />
    </article>
  );
}
