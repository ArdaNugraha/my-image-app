import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
import { db } from "@/lib/src";
// import { users } from "@/lib/schema";
import { users } from "@/lib/src/db/schema";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body;

  const password_hash = await hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({
      email,
      name,
      password_hash,
      role: "user",
    })
    .returning();

  return NextResponse.json(user);
}
