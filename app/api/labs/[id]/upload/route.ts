import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import fs from "fs/promises";
import path from "path";
import Busboy from "busboy";
import pool from "@/lib/db/connection";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Fungsi bantu menyimpan file dari FormData
function saveFile(
  labId: number,
  headers: any,
  body: Readable
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const savedPaths: string[] = [];
    const filePromises: Promise<void>[] = [];
    const busboy = Busboy({ headers });

    busboy.on(
      "file",
      (
        fieldname: string,
        file: NodeJS.ReadableStream,
        info: {
          filename: string;
          encoding: string;
          mimeType: string;
        }
      ) => {
        const { filename } = info;
        if (!filename) return;

        const ext = path.extname(filename);
        const uniqueName = `${randomUUID()}${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "labs");
        const fullPath = path.join(uploadDir, uniqueName);
        const photoUrl = `/uploads/labs/${uniqueName}`;

        const stream = createWriteStream(fullPath);
        file.pipe(stream);

        const promise = new Promise<void>((res, rej) => {
          stream.on("finish", async () => {
            try {
              await pool.query(
                `INSERT INTO laboratory_photos (lab_id, photo_url) VALUES ($1, $2)`,
                [labId, photoUrl]
              );
              savedPaths.push(photoUrl);
              res();
            } catch (err) {
              console.error("DB error:", err);
              rej(err);
            }
          });

          stream.on("error", (err) => {
            console.error("Stream error:", err);
            rej(err);
          });
        });

        filePromises.push(promise);
      }
    );

    busboy.on("finish", () => {
      Promise.all(filePromises)
        .then(() => resolve(savedPaths))
        .catch(reject);
    });

    busboy.on("error", reject);

    body.pipe(busboy);
  });
}

// POST /api/labs/[id]/upload
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const labId = Number(params.id);

  try {
    const body = req.body;
    const headers = Object.fromEntries(req.headers.entries());

    if (!body) {
      return new NextResponse("No request body", { status: 400 });
    }

    const uploadedPaths = await saveFile(
      labId,
      headers,
      Readable.from(body as any)
    );
    return NextResponse.json({ uploadedPaths });
  } catch (err) {
    console.error("Upload gagal:", err instanceof Error ? err.stack : err);
    return new NextResponse("Gagal mengunggah foto", { status: 500 });
  }
}

// DELETE /api/labs/[id]/upload
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const labId = Number(params.id);
  const body = await req.json();
  const photoUrl = body.photoUrl;

  try {
    const filePath = path.join(process.cwd(), "public", photoUrl);
    await fs.unlink(filePath).catch(() => null);

    await pool.query(
      `DELETE FROM laboratory_photos WHERE lab_id = $1 AND photo_url = $2`,
      [labId, photoUrl]
    );

    return NextResponse.json({ message: "Foto berhasil dihapus" });
  } catch (err) {
    console.error("Delete photo error:", err);
    return new NextResponse("Gagal hapus foto", { status: 500 });
  }
}
