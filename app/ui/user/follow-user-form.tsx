"use client";
import { userFollows } from "@/lib/actions/users";
import { useActionState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function FollowUserForm({
  userToFollow,
  className,
}: {
  userToFollow: {
    id: number;
    username: string;
    isFollowed: boolean;
  };
  className?: string;
}) {
  const pathaname = usePathname();
  const userFollowsWithId = userFollows.bind(
    null,
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
    <form action={formAction} className={cn(className)}>
      <Field>
        <Button
          type="submit"
          variant={userToFollow.isFollowed ? "secondary" : "default"}
          aria-disabled={isPending}
          disabled={isPending}
        >
          {userToFollow.isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </Field>
    </form>
  );
}
