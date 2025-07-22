import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/connection";
import path from "path";
import { writeFile } from "fs/promises";
import { mkdirSync, existsSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET: Ambil semua dosen
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM lecturers");
    return NextResponse.json({ lecturers: result.rows });
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return NextResponse.json({ error: "Failed to fetch lecturers" }, { status: 500 });
  }
}

// POST: Tambah dosen baru
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString() ?? "";
    const nidn = formData.get("nidn")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const phone = formData.get("phone")?.toString() ?? "";
    const department = formData.get("department")?.toString() ?? "";
    const file = formData.get("photo") as File | null;

    if (!name || !nidn || !email || !department) {
      return NextResponse.json({ error: "Field wajib diisi" }, { status: 400 });
    }

    let photoPath: string | null = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "photo-dosen");

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      photoPath = `/photo-dosen/${fileName}`;
    }

    const insertQuery = `
      INSERT INTO lecturers (name, nidn, email, phone, department, photo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, nidn, email, phone, department, photoPath];

    const result = await pool.query(insertQuery, values);
    const newLecturer = result.rows[0];

    return NextResponse.json({ lecturer: newLecturer }, { status: 201 });
  } catch (error) {
    console.error("Error inserting lecturer:", error);
    return NextResponse.json({ error: "Gagal menyimpan data dosen" }, { status: 500 });
  }
}

// PUT: Edit dosen
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id")?.toString() ?? "";
    const name = formData.get("name")?.toString() ?? "";
    const nidn = formData.get("nidn")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const phone = formData.get("phone")?.toString() ?? "";
    const department = formData.get("department")?.toString() ?? "";
    const file = formData.get("photo") as File | null;

    if (!id || !name || !nidn || !email || !department) {
      return NextResponse.json({ error: "Field wajib diisi" }, { status: 400 });
    }

    let photoPath: string | null = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "photo-dosen");

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      photoPath = `/photo-dosen/${fileName}`;
    }

    let updateQuery: string;
    let values: any[];

    if (photoPath) {
      updateQuery = `
        UPDATE lecturers
        SET name = $1, nidn = $2, email = $3, phone = $4, department = $5, photo = $6
        WHERE id = $7
        RETURNING *;
      `;
      values = [name, nidn, email, phone, department, photoPath, id];
    } else {
      updateQuery = `
        UPDATE lecturers
        SET name = $1, nidn = $2, email = $3, phone = $4, department = $5
        WHERE id = $6
        RETURNING *;
      `;
      values = [name, nidn, email, phone, department, id];
    }

    const result = await pool.query(updateQuery, values);
    const updatedLecturer = result.rows[0];

    return NextResponse.json({ lecturer: updatedLecturer }, { status: 200 });
  } catch (error) {
    console.error("Error updating lecturer:", error);
    return NextResponse.json({ error: "Gagal memperbarui data dosen" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID dosen wajib diisi" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM lecturers WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Dosen tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dosen berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    return NextResponse.json({ error: "Gagal menghapus dosen" }, { status: 500 });
  }
}