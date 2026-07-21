import { UserNameCardProps } from "@/app/lib/definitions/users";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function UserNameCard({
  className,
  to,
  username,
}: UserNameCardProps) {
  return (
    <Link
      href={to}
      className={cn(
        "grow items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:underline transition-all",
        className,
      )}
    >
      <Image
        src="/images/defaultProfile.png"
        width={180}
        height={180}
        alt="default image avatar for user"
        className="rounded-full w-7.5 md:w-8.5 aspect-square block"
      />
      <span className="hidden lg:block">{username}</span>
    </Link>
  );
}
