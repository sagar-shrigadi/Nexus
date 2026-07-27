"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { register } from "@/lib/actions/auth";
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

export default function SignupForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );
  return (
    <>
      <form action={formAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
            <Input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="John"
              required
            />
            {errorMessage?.errors?.firstname ? (
              <FieldError>{errorMessage.errors.firstname}</FieldError>
            ) : (
              ""
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
            <Input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Doe"
              required
            />
            {errorMessage?.errors?.lastname ? (
              <FieldError>{errorMessage.errors.lastname}</FieldError>
            ) : (
              ""
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              type="text"
              name="username"
              id="username"
              required
              autoComplete="username"
            />
            {errorMessage?.errors?.username ? (
              <FieldError>{errorMessage.errors.username}</FieldError>
            ) : (
              <FieldDescription>
                Must be at least 3 characters long.
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              type="password"
              name="password"
              id="password"
              required
              autoComplete="new-password"
              minLength={8}
            />
            {errorMessage?.errors?.password ? (
              <FieldError>{errorMessage.errors.password}</FieldError>
            ) : (
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            )}
          </Field>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Field>
            <FieldDescription>
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
            {errorMessage?.message ? (
              <FieldError>{errorMessage.message}</FieldError>
            ) : (
              ""
            )}

            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
            >
              <span>Sign up</span>
              {isPending ? <Spinner data-icon="inline-end" /> : ""}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
