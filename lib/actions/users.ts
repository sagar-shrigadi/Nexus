"use server";

import { followUserTransaction } from "@/app/services/users";
import { revalidatePath } from "next/cache";

interface ActionResult {
  status: "error";
  message: string;
}
export async function userFollows(
  user: { id: number; username: string },
  userToFollow: { id: number; username: string },
  pathname: string,
): Promise<ActionResult | undefined> {
  try {
    await followUserTransaction(user.id, userToFollow.id);
    revalidatePath(`${pathname}`);
    revalidatePath(`/${user.username}`);
    revalidatePath(`/${userToFollow.username}`);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "A Problem has occured! Please try again!",
    };
  }
}
