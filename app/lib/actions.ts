"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { postUser } from "@/app/services/users";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const SignUpSchema = z.object({
  firstname: z.string().min(3, "First Name must be at least 3 characters."),
  lastname: z.string().min(3, "Last Name must be at least 3 characters."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return "Missing Fields. Failed to Register.";
  }
  const { firstname, lastname, username, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await postUser(firstname, lastname, username, hashedPassword);
  } catch (error) {
    throw error;
  }
  redirect("/login");
}
