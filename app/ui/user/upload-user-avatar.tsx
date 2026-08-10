"use client";

import { useState, useRef } from "react";
import { avatarUpload, deleteAvatar } from "@/lib/actions/users";
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
    avatarId: number | null;
    avatar: {
      fileName: string;
      publicUrl: string;
    } | null;
  };
}) {
  const { update } = useSession();
  const [openDialog, setOpenDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [disableDelete, setDisableDelete] = useState(
    user.avatarId ? false : true,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsUploading(true);

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
      setIsUploading(false);
      return;
    }

    // Dispatch directly to the Server Action
    const result = await avatarUpload(user, formData);

    setIsUploading(false);

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

      // enable the delete avatar button
      setDisableDelete(false);
      // update the session object with profile avatar
      await update({
        image: result.url,
      });

      toast.add({
        type: "success",
        description: result.message,
      });
    }
  };
  const handleDelete = async () => {
    setErrorMessage(null);
    setDisableDelete(true);
    setIsDeleting(true);

    // call the server action to initiate the user avatar deletion
    const result = await deleteAvatar(user);

    if (result.status === "error") {
      setErrorMessage(result.message!);
      setDisableDelete(false);
      setIsDeleting(false);
      toast.add({
        type: "error",
        description: result.message,
      });
    } else {
      setErrorMessage(null);

      // disable the delete avatar button
      setDisableDelete(true);

      setIsDeleting(false);
      setOpenDialog(false);

      // update the session object with profile avatar
      await update({
        image: null,
      });
      toast.add({
        type: "success",
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
                disabled={isUploading}
                aria-disabled={isUploading}
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
              <Button
                onClick={handleDelete}
                type="button"
                variant="destructive"
                disabled={disableDelete}
                aria-disabled={disableDelete}
                className="mr-auto"
              >
                {isDeleting ? "Deleting" : "Delete"}
                {isDeleting && <Spinner data-icon="inline-end" />}
              </Button>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                type="submit"
                disabled={isUploading}
                aria-disabled={isUploading}
              >
                {isUploading ? "Updating" : "Update"}
                {isUploading && <Spinner data-icon="inline-end" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
