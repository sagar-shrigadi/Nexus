"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { authenticate } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GuestLoginForm from "@/app/ui/auth/guest-login-form";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loginError, loginFormAction, loginPending] = useActionState(
    authenticate,
    undefined,
  );
  const [guestLoginError, guestLoginFormAction, guestLoginPending] =
    useActionState(authenticate, undefined);
  return (
    <>
      <form action={loginFormAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              type="text"
              name="username"
              id="username"
              required
              autoComplete="username"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              type="password"
              name="password"
              id="password"
              required
              autoComplete="current-password"
            />
          </Field>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Field>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
            </FieldDescription>
            {loginError ? <FieldError>{loginError}</FieldError> : ""}
            {guestLoginError ? <FieldError>{guestLoginError}</FieldError> : ""}
            <Button
              type="submit"
              disabled={loginPending}
              aria-disabled={loginPending}
            >
              <span>Login</span>
              {loginPending ? <Spinner data-icon="inline-end" /> : ""}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <Suspense>
        <GuestLoginForm
          formAction={guestLoginFormAction}
          isPending={guestLoginPending}
        />
      </Suspense>
    </>
  );
}
