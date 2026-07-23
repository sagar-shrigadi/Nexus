import Image from "next/image";
import FollowUserForm from "@/app/ui/user/follow-user-form";
import Link from "next/link";
import { auth } from "@/auth";

export default async function FollowUserCard({
  user,
  usersFollowedByUser,
}: {
  user: {
    id: number;
    username: string;
    fullname: string;
  };
  usersFollowedByUser: {
    follows: number;
  }[];
}) {
  const session = await auth();
  return (
    <li className="flex justify-between items-center px-4 py-1.5">
      <Link
        href={`/${user.username}`}
        className="grow flex items-center gap-6 hover:text-gray-400 transition-colors cursor-pointer"
      >
        <Image
          src="/images/defaultProfile.png"
          width={180}
          height={180}
          alt="default image avatar for user"
          className="rounded-full w-7.5 sm:w-9 aspect-square block"
        />
        <div className="flex flex-col">
          <span>{user.fullname}</span>
          <span className="text-(--lightText) text-sm">@{user.username}</span>
        </div>
      </Link>
      <FollowUserForm
        session={session}
        userToFollow={{ id: user.id, username: user.username }}
        usersFollowed={usersFollowedByUser}
      />
    </li>
  );
}
