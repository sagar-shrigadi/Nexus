"use client";

import { CircleUserRound } from "lucide-react";
import { authenticate } from "@/app/lib/actions/auth";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import AuthFormErrors from "@/app/ui/auth-form-errors";

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

        <button
          aria-disabled={isPending}
          className="grow cursor-pointer border border-slate-50 hover:bg-slate-50 hover:text-black px-4 py-2 rounded transition-colors flex items-center justify-center gap-6"
        >
          <CircleUserRound className="size-6" />
          Try a Guest Account
        </button>
      </form>
    </>
  );
}
