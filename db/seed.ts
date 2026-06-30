import { faker } from "@faker-js/faker";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

interface User {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  bio: string;
}

async function createRandomUser(): Promise<User> {
  const password = await bcrypt.hash(
    faker.string.alpha({ length: { min: 6, max: 12 } }),
    10,
  );
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.person.middleName(),
    password,
    bio: faker.person.bio(),
  };
}
async function seedUsers() {
  const users: User[] = [];
  for (let i = 0; i <= 20; i++) {
    const user = await createRandomUser();
    users.push(user);
  }
  return users;
}
async function seed() {
  const seededUsers = await seedUsers();

  for (const user of seededUsers) {
    await db.insert(users).values({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      bio: user.bio,
    });
  }
}

seed();
