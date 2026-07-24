import { cn } from "@/lib/utils";
import Image from "next/image";
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
      <Image
        src="/images/defaultProfile.png"
        width={180}
        height={180}
        alt="default image avatar for user"
        className="rounded-full w-7.5 md:w-8.5 aspect-square block"
      />
      {username ? (
        <div className="flex flex-col">
          <span className="hover:underline transition-all">{fullname}</span>
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
