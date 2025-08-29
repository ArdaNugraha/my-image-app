import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/src";
import { images } from "@/lib/src/db/schema";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  data: z.string().min(1, "Image data is required."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = uploadSchema.parse(body);

    const match = parsed.data.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { ok: false, error: "Invalid Base64 string." },
        { status: 400 }
      );
    }
    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");
    const ext = mime.split("/")[1] ?? "bin";

    const filename = `${uuidv4()}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const [result] = await db
      .insert(images)
      .values({
        title: parsed.title,
        filename,
        description: parsed.description ?? null,
      })
      .returning();

    return NextResponse.json({ ok: true, image: result }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
