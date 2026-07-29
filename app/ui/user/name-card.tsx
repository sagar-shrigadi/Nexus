import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";

interface UserNameCardProps {
  className?: string;
  to: LinkProps["href"];
  fullname: string;
  username?: string;
}

export default function UserNameCard({
  className,
  to,
  fullname,
  username,
}: UserNameCardProps) {
  return (
    <Link
      href={to}
      className={cn("grow items-center gap-3.5 cursor-pointer", className)}
    >
      <Avatar>
        <AvatarImage
          src="/images/defaultProfile.png"
          alt="Default User Avatar"
        />
        <AvatarFallback>{"U"}</AvatarFallback>
      </Avatar>
      {username ? (
        <div className="flex flex-col">
          <span className="lg:text-base hover:underline transition-all">
            {fullname}
          </span>
          <span className="text-(--lightText) text-sm">@{username}</span>
        </div>
      ) : (
        <span className="text-lg hover:underline transition-all">
          {fullname}
        </span>
      )}
    </Link>
  );
}
