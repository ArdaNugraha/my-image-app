import { NextResponse } from "next/server";
import { db } from "@/lib/src";
import { images } from "@/lib/src/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(images).orderBy(desc(images.created_at));

  const mapped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    url: `/uploads/${r.filename}`,
    created_at: r.created_at,
  }));

  return NextResponse.json(mapped);
}
