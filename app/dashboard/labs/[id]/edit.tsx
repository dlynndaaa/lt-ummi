// File: app/api/labs/[id]/photos/route.ts

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/db/connection";
import { writeFile, unlink } from "fs/promises";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const labId = params.id;

  const formData = await req.formData();
  const files = formData.getAll("photos");

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Tidak ada file yang dikirim." }, { status: 400 });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "labs");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const ext = path.extname(file.name);
      const filename = `${uuidv4()}${ext}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(filePath, buffer);

      const photoUrl = `/uploads/labs/${filename}`;
      await pool.query(
        `INSERT INTO laboratory_photos (lab_id, photo_url) VALUES ($1, $2)`,
        [labId, photoUrl]
      );
    }

    return NextResponse.json({ message: "Foto berhasil diunggah." });
  } catch (error) {
    console.error("Upload gagal:", error);
    return NextResponse.json({ error: "Gagal menyimpan file." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const labId = params.id;
  const body = await req.json();
  const { photoUrl } = body;

  if (!photoUrl) {
    return NextResponse.json({ error: "URL foto tidak diberikan." }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", photoUrl);
    if (fs.existsSync(filePath)) {
      await unlink(filePath);
    }

    await pool.query(
      `DELETE FROM laboratory_photos WHERE lab_id = $1 AND photo_url = $2`,
      [labId, photoUrl]
    );

    return NextResponse.json({ message: "Foto berhasil dihapus." });
  } catch (error) {
    console.error("Hapus gagal:", error);
    return NextResponse.json({ error: "Gagal menghapus file." }, { status: 500 });
  }
}