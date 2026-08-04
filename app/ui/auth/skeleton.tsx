import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonForm({ count }: { count: number }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-7">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
      <Skeleton className="h-8 w-full rounded" />
    </div>
  );
}
