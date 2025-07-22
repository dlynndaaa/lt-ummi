import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import pool from "@/lib/db/connection";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const labId = params.id;

  const formData = await req.formData();
  const files = formData.getAll("photos") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Tidak ada file foto yang dikirim." }, { status: 400 });
  }

  const savedUrls: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${randomUUID()}_${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    savedUrls.push(url);

    await pool.query(
      "INSERT INTO laboratory_photos (lab_id, photo_url) VALUES ($1, $2)",
      [labId, url]
    );
  }

  return NextResponse.json({ message: "Foto berhasil diunggah", urls: savedUrls });
}
