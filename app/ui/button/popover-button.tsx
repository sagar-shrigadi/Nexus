import { cn } from "@/app/lib/utils";

interface PopoverButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
export default function PopoverButton({
  children,
  className,
  ...rest
}: PopoverButton) {
  return (
    <button
      {...rest}
      className={cn(
        "cursor-pointer hover:bg-(--hover) p-1 rounded-full transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
