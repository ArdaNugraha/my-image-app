// scripts/seed.ts
import bcrypt from "bcryptjs";
// import { db } from "../lib/db";
import { db } from "@/lib/src";
// import { users, categories } from "../lib/schema";
import { users, categories } from "@/lib/src/db/schema";

async function main() {
  const pwd = "admin123"; // change this after install!
  const hash = bcrypt.hashSync(pwd, 10);
  await db.insert(users).values({
    email: "admin@example.com",
    name: "Admin",
    password_hash: hash,
    role: "admin",
  });

  await db.insert(categories).values({ name: "General" });

  console.log("Seed done. admin@example.com / admin123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
