"use client";

import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field } from "@/components/ui/field";

export default function GuestLoginForm({
  formAction,
  isPending,
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  return (
    <>
      <form action={formAction} className="w-full flex">
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
    </>
  );
}
