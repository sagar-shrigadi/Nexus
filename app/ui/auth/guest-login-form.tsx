"use client";

import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field } from "@/components/ui/field";
import { useSearchParams } from "next/navigation";

export default function GuestLoginForm({
  formAction,
  isPending,
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return (
    <form action={formAction} className="w-full flex">
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <input type="hidden" name="isGuestLogin" value="true" />
      <Field>
        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          aria-disabled={isPending}
        >
          <CircleUserRound className="size-6" />
          <span>Try a Guest Account</span>
          {isPending ? <Spinner data-icon="inline-end" /> : ""}
        </Button>
      </Field>
    </form>
  );
}
