import {
  CommentCardSkeleton,
  CreateCommentSkeleton,
} from "@/app/ui/comment/skeleton";
import { PostCardSkeleton } from "@/app/ui/post/skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostPageSkeleton() {
  return (
    <div className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col overflow-hidden">
      <header className="flex items-center gap-4 px-2 py-4">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-1/2 h-8" />
      </header>
      <div className="grow min-h-0 border rounded">
        <section>
          <PostCardSkeleton />
        </section>
        <Separator />
        <section>
          <CreateCommentSkeleton />
          <Separator />
          <section>
            <header className="p-4">
              <Skeleton className="w-1/2 h-6" />
            </header>
            <Separator />
            <section className="grow">
              {Array.from({ length: 2 }, (_, i) => (
                <article key={i}>
                  {i > 0 && <Separator />}
                  <CommentCardSkeleton />
                </article>
              ))}
            </section>
          </section>
        </section>
      </div>
    </div>
  );
}
