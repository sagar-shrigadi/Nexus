import { cn } from "@/lib/utils";

export default function EmptyListTemplate({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <article className={cn("h-full flex", className)}>
      <div className="grow flex justify-center items-center text-lg">
        <em className="my-auto">No {content} yet!</em>
      </div>
    </article>
  );
}
