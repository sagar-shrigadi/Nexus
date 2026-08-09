"use client";

import { useState, useRef } from "react";
import { avatarUpload } from "@/lib/actions/users";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/toast";

export default function UploadAvatar({
  user,
}: {
  user: {
    id: number;
    username: string;
  };
}) {
  const { update } = useSession();
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsPending(true);

    if (!formRef.current) return;
    // Wrap file into standard browser FormData
    const formData = new FormData(formRef.current);
    const fileToUpload = formData.get("file");

    if (!fileToUpload) {
      toast.add({
        type: "error",
        description: "No file selected!",
      });
      setErrorMessage("Please select a file to upload.");
      setIsPending(false);
      return;
    }

    // Dispatch directly to the Server Action
    const result = await avatarUpload(user, formData);

    setIsPending(false);

    if (result.status === "error") {
      toast.add({
        type: "error",
        description: result.message,
      });
      setErrorMessage(result.message!);
      return;
    }

    if (result.status === "success") {
      // Clear form input fields after successful submission
      formRef.current.reset();

      // close the modal
      setOpenDialog(false);

      // update the session object with profile avatar
      await update({
        image: result.url,
      });

      toast.add({
        type: "sucess",
        description: result.message,
      });
    }
  };

  return (
    <div className="-translate-x-full h-fit">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger
          render={
            <Button variant="secondary" size="icon-sm">
              <Edit />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Profile picture</DialogTitle>
            <DialogDescription>
              Select a new Profile picture. Click update when your done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} ref={formRef}>
            <Field className="mb-4">
              <FieldLabel htmlFor="file" />
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/jpeg, image/png, image/webp, image/gif"
                disabled={isPending}
                aria-disabled={isPending}
              />
              {errorMessage ? (
                <FieldError aria-atomic="true">{errorMessage}</FieldError>
              ) : (
                <FieldDescription>
                  Select a picture to upload. (jpeg, png, webp, gifs only)
                </FieldDescription>
              )}
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                type="submit"
                disabled={isPending}
                aria-disabled={isPending}
              >
                {isPending ? "Updating" : "Update"}
                {isPending && <Spinner data-icon="inline-end" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
