import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPageSkeleton() {
  return (
    <article className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col border rounded">
      <header className="flex items-center gap-4 px-2 py-4">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-1/2 h-8" />
      </header>
      <Separator />
      <div className="px-4 my-4">
        <div className="flex flex-col gap-4">
          <div className="grid gap-3">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-full h-25" />
          </div>
          <Skeleton className="w-35 h-10 ml-auto" />
        </div>
      </div>
    </article>
  );
}
