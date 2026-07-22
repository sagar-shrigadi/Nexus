import { cn } from "@/app/lib/utils";
import { EllipsisIcon } from "lucide-react";

interface PopoverButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export default function PopoverButton({ className, ...rest }: PopoverButton) {
  return (
    <button
      {...rest}
      className={cn(
        "cursor-pointer hover:bg-(--hover) p-1 rounded-full transition-colors",
        className,
      )}
    >
      <EllipsisIcon className="size-6" />
    </button>
  );
}
