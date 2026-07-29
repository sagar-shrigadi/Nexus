"use client";
import { Session } from "next-auth";
import { userFollows } from "@/lib/actions/users";
import { useActionState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

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
  const [result, formAction, isPending] = useActionState(
    userFollowsWithId,
    undefined,
  );

  useEffect(() => {
    if (!result) return;
    if (result.status === "error") {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
  }, [result]);
  return (
    <form action={formAction}>
      <Field>
        {usersFollowed.some((item) => item.follows === userToFollow.id) ? (
          <Button
            type="submit"
            variant="secondary"
            aria-disabled={isPending}
            disabled={isPending}
            className="px-4"
          >
            Unfollow
          </Button>
        ) : (
          <Button
            type="submit"
            variant="default"
            aria-disabled={isPending}
            disabled={isPending}
            className="px-4"
          >
            Follow
          </Button>
        )}
      </Field>
    </form>
  );
}
