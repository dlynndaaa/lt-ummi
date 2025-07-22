import { type NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import pool from "@/lib/db/connection";

const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "public", "upload", "labs");

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const labId = params.id;
  const formData = await req.formData();
  const files = formData.getAll("photos") as File[];

  if (!existsSync(PUBLIC_UPLOAD_DIR)) {
    await mkdir(PUBLIC_UPLOAD_DIR, { recursive: true });
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(PUBLIC_UPLOAD_DIR, filename);
    await writeFile(filepath, bytes);

    const url = `/upload/labs/${filename}`;
    uploadedUrls.push(url);

    await pool.query(
      `INSERT INTO laboratory_photos (lab_id, photo_url) VALUES ($1, $2)`,
      [labId, url]
    );
  }

  return NextResponse.json({ uploaded: uploadedUrls });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const labId = params.id;
    const body = await req.json();
    const { photoUrl } = body;

    if (!photoUrl) {
      return NextResponse.json({ error: "Photo URL is required" }, { status: 400 });
    }

    console.log("🔍 Menghapus foto:", { labId, photoUrl });

    // Hapus dari database
    await pool.query(
      `DELETE FROM laboratory_photos WHERE lab_id = $1 AND photo_url = $2`,
      [labId, photoUrl]
    );

    // Hapus dari file system
    const fileName = path.basename(photoUrl);
    const filePath = path.join(PUBLIC_UPLOAD_DIR, fileName);

    try {
      await unlink(filePath);
    } catch (err) {
      console.warn("⚠️ Gagal hapus file dari sistem (mungkin sudah tidak ada):", filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Gagal hapus foto:", error);
    return NextResponse.json({ error: "Gagal hapus foto" }, { status: 500 });
  }
}
