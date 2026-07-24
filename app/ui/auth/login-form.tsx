"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import AuthFormErrors from "@/app/ui/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <>
      <form action={formAction}>
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
          <Field className="flex flex-col gap-4">
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-4 hover:text-primary text-muted-foreground transition-colors"
              >
                Sign Up
              </Link>
            </FieldDescription>
            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
            >
              <span>Login</span>
              {isPending ? <Spinner data-icon="inline-end" /> : ""}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <AuthFormErrors errorMessage={errorMessage} />
    </>
  );
}
