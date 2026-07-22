"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import AuthFormErrors from "@/app/ui/auth/form-errors";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <form action={formAction} className="w-full mt-5 flex flex-col gap-5">
      <div className="flex-1 flex flex-col ">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          autoComplete="username"
          className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
        />
      </div>
      <div className="flex-1 flex flex-col ">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          autoComplete="current-password"
          className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
        />
      </div>
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign Up
        </Link>
      </p>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button
        aria-disabled={isPending}
        className="cursor-pointer py-2 px-6 rounded text-black bg-slate-200 hover:bg-slate-50 transition-colors"
      >
        Log in
      </button>
      <AuthFormErrors errorMessage={errorMessage} />
    </form>
  );
}
