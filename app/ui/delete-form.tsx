import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Trash } from "lucide-react";

export default function DeleteForm({
  action,
  isPending,
}: {
  action: () => void;
  isPending: boolean;
}) {
  return (
    <form action={action}>
      <Field>
        <Button
          type="submit"
          variant="destructive"
          aria-disabled={isPending}
          disabled={isPending}
          className="flex justify-start"
        >
          <Trash />
          {isPending ? "Deleting" : "Delete"}
          {isPending ? <Spinner data-icon="inline-end" /> : ""}
        </Button>
      </Field>
    </form>
  );
}
