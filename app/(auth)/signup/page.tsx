import SignupForm from "@/app/ui/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <SignupForm />
        </CardContent>
      </Card>
    </article>
  );
}
