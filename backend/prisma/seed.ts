import "dotenv/config";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma";

const DEMO_PASSWORD = "Password123!";
const SALT_ROUNDS = 12;

async function main() {
  const passwordHash = await bcrypt.hash(
    DEMO_PASSWORD,
    SALT_ROUNDS
  );

  const users = [
    {
      name: "Ryan Employee",
      email: "ryan@example.com",
      role: Role.EMPLOYEE,
    },
    {
      name: "Samantha Staff",
      email: "staff@example.com",
      role: Role.STAFF,
    },
    {
      name: "Morgan Manager",
      email: "manager@example.com",
      role: Role.MANAGER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        ...user,
        passwordHash,
      },
    });

    console.log(`Seeded ${user.role}: ${user.email}`);
  }

  console.log("Demo users seeded successfully.");
  console.log(`Demo password: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Unable to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });