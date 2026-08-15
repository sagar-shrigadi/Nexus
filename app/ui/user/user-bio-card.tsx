"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updateBio } from "@/lib/actions/users";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function UserBioCard({
  user,
}: {
  user: {
    id: number;
    bio: string | null;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsEditing(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateBio({ id: user.id }, formData);

    if (result.status === "error") {
      setIsEditing(false);
      setIsUpdating(false);
      setErrorMessage(result.message!);
      toast.add({
        type: "error",
        description: result.message,
      });
      return;
    }
    setIsEditing(false);
    setIsUpdating(false);
    setErrorMessage(null);
    toast.add({
      type: "success",
      description: result.message,
    });
  };
  return (
    <article>
      {isEditing ? (
        <form onSubmit={submitHandler} className="mb-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bio" />
              <Textarea
                name="bio"
                id="bio"
                placeholder="Enter Bio"
                defaultValue={user.bio ? user.bio : ""}
                required
              />
              {errorMessage && <FieldError>{errorMessage}</FieldError>}
            </Field>
            <Field orientation="horizontal" className="w-fit ml-auto">
              <Button
                onClick={() => setIsEditing(false)}
                type="button"
                variant="outline"
                disabled={isUpdating}
                aria-disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                aria-disabled={isUpdating}
              >
                {isUpdating ? "Updating" : "Update"}
                {isUpdating && <Spinner data-icon="inline-end" />}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <div className="text-lg flex items-center gap-2">
          {user.bio}
          <Button
            aria-label="Update bio"
            type="button"
            size="icon-xs"
            onClick={() => setIsEditing(true)}
          >
            <Pencil />
          </Button>
        </div>
      )}
    </article>
  );
}
