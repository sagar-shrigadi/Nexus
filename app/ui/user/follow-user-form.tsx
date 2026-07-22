"use client";
import { Session } from "next-auth";
import { userFollows } from "../../lib/actions/users";
import { useActionState } from "react";
import { usePathname } from "next/navigation";

export default function FollowUserForm({
  session,
  userToFollow,
  usersFollowed,
}: {
  session: Session | null;
  userToFollow: {
    id: number;
    username: string;
  };
  usersFollowed: {
    follows: number;
  }[];
}) {
  const pathaname = usePathname();
  const userFollowsWithId = userFollows.bind(
    null,
    { id: Number(session?.user?.id), username: session!.user!.email! },
    {
      id: userToFollow.id,
      username: userToFollow.username,
    },
    pathaname,
  );
  const [errorMessage, formAction, isPending] = useActionState(
    userFollowsWithId,
    undefined,
  );
  return (
    <form action={formAction}>
      {usersFollowed.some((item) => item.follows === userToFollow.id) ? (
        <button
          aria-disabled={isPending}
          disabled={isPending}
          className="px-4 py-1 rounded cursor-pointer text-center max-w-25 bg-gray-200 hover:bg-gray-300 text-black transition-colors"
        >
          Unfollow
        </button>
      ) : (
        <button
          aria-disabled={isPending}
          disabled={isPending}
          className="px-4 py-1 rounded cursor-pointer text-center max-w-25 bg-(--hover) hover:bg-[hsl(210_7%_22%)] transition-colors"
        >
          Follow
        </button>
      )}
    </form>
  );
}
