"use server";

import { followUserTransaction } from "@/app/services/users";
import { revalidatePath } from "next/cache";

export async function userFollows(
  user: { id: number; username: string },
  userToFollow: { id: number; username: string },
  pathname: string,
) {
  try {
    await followUserTransaction(user.id, userToFollow.id);
    revalidatePath(`${pathname}`);
    revalidatePath(`/${user.username}`);
    revalidatePath(`/${userToFollow.username}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
