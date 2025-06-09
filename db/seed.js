import { faker } from "@faker-js/faker";
import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createTask } from "#db/queries/tasks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // seed 2 users
  for (let i = 0; i < 2; i++) {
    const username = faker.internet.username();
    const password = faker.internet.password();

    await createUser(username, password);
  }

  const tasks = [
    "Get groceries",
    "Walk the dog",
    "Read a book",
    "Clean the kitchen",
    "Finish the report",
    "Call mom",
    "Pay bills",
    "Water the plants",
  ];

  // seed 3 tasks for user 1
  for (let i = 0; i < 3; i++) {
    const title = tasks[i];
    const userId = 1;

    await createTask(title, userId);
  }

  // seed 5 tasks for user 2
  for (let i = 3; i < 8; i++) {
    const title = tasks[i];
    const userId = 2;

    await createTask(title, userId);
  }
}
