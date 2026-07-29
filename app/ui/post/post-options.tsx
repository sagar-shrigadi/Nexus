import DeletePost from "@/app/ui/post/delete-post";
import Link from "next/link";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { Ellipsis, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PostOptions({
  session,
  post,
}: {
  session: Session | null;
  post: {
    id: number;
    userId: number;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
              }),
            )}
          >
            <Ellipsis />
          </button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href={`/${session?.user?.email}/status/${post.id}/edit`}
              className="flex items-center gap-1.5"
            >
              <Pencil />
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<DeletePost post={post} />} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
