"use client";

import { CircleUserRound } from "lucide-react";
import { authenticate } from "@/lib/actions/auth";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import AuthFormErrors from "@/app/ui/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field } from "@/components/ui/field";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <>
      <AuthFormErrors errorMessage={errorMessage} />
      <form action={formAction} className="w-full flex">
        <input
          type="hidden"
          name="username"
          value={process.env.GUEST_USERNAME}
        />
        <input
          type="hidden"
          name="password"
          value={process.env.GUEST_PASSWORD}
        />
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Field>
          <Button
            type="submit"
            variant="outline"
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
