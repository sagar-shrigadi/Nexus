"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError, User } from "next-auth";
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
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
const SignUpSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name is too long."),
  lastname: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name is too long."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username must not exceed 30 characters."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(72, "Password is too long."),
});
export type RegisterState = {
  errors?: {
    firstname?: string[];
    lastname?: string[];
    username?: string[];
    password?: string[];
  };
  message?: string | null;
};
export async function register(
  prevState: RegisterState | undefined,
  formData: FormData,
) {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "Missing or invalid fields. Failed to register.",
    };
  }
  const { firstname, lastname, username, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await postUser(firstname, lastname, username, hashedPassword);
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database error: Failed to create your account. Please Try again!",
    };
  }
  redirect("/login");
}
export async function requireAuth(): Promise<
  | {
      success: false;
      error: {
        status: "error";
        message: string;
      };
    }
  | {
      success: true;
      sessionUser: User;
    }
> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: {
        status: "error",
        message: "Unauthenticated!",
      },
    };
  }
  return { success: true, sessionUser: session.user };
}
