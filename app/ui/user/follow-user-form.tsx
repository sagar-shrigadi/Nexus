"use client";
import { Session } from "next-auth";
import { userFollows } from "@/lib/actions/users";
import { useActionState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function FollowUserForm({
  session,
  user,
  isFollowed,
  className,
}: {
  session: Session | null;
  user: {
    id: number;
    username: string;
  };
  isFollowed: boolean;
  className?: string;
}) {
  const pathaname = usePathname();
  const userFollowsWithId = userFollows.bind(
    null,
    { id: Number(session?.user?.id), username: session!.user!.email! },
    {
      id: user.id,
      username: user.username,
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
          variant={isFollowed ? "secondary" : "default"}
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </Field>
    </form>
  );
}
