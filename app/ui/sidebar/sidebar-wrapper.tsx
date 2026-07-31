import { cn } from "@/lib/utils";

interface SidebarWrapper {
  className?: string;
  children: React.ReactNode;
}

export default async function SidebarWrapper({
  className,
  children,
}: SidebarWrapper) {
  return (
    <article
      className={cn(
        "my-auto hidden min-w-80 xl:w-100 sm:justify-self-end max-h-svh md:flex flex-col gap-4",
        className,
      )}
    >
      {children}
    </article>
  );
}
