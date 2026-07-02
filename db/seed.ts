import { faker } from "@faker-js/faker";
import { db } from "@/db/index";
import { users, posts } from "@/db/schema";
import bcrypt from "bcryptjs";

interface User {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  bio: string | null;
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
  for (let i = 0; i <= 20; i++) {
    const user = await createRandomUser();
    await db.insert(users).values({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      bio: user.bio,
    });
  }
}
async function seed() {
  await seedUsers();
  const seededUsers = await db.select().from(users);

  for (const user of seededUsers) {
    await db.insert(posts).values({
      title: `from ${user.username}`,
      content: `Hello, I am ${user.firstName} ${user.lastName}.`,
      userId: user.id,
    });
  }
}

seed();
