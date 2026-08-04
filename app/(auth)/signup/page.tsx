import SignupForm from "@/app/ui/auth/signup-form";
import { SkeletonForm } from "@/app/ui/auth/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";

export default function Page() {
  return (
    <article className="m-auto w-dvw max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          <Suspense fallback={<SkeletonForm count={4} />}>
            <SignupForm />
          </Suspense>
        </CardContent>
      </Card>
    </article>
  );
}
