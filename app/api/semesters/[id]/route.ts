import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// GET detail by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM semesters WHERE id = $1", [params.id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Semester tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET semester by ID error:", error);
    return NextResponse.json({ error: "Gagal mengambil data semester" }, { status: 500 });
  }
}

// PUT update by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { year, type, semester_no, is_active } = await req.json();

    const client = await pool.connect();
    await client.query(
      "UPDATE semesters SET year = $1, type = $2, semester_no = $3, is_active = $4 WHERE id = $5",
      [year, type, semester_no, is_active, params.id]
    );
    client.release();

    return NextResponse.json({ message: "Semester berhasil diperbarui" });
  } catch (error) {
    console.error("PUT semester error:", error);
    return NextResponse.json({ error: "Gagal memperbarui semester" }, { status: 500 });
  }
}

// DELETE semester by ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    await client.query("DELETE FROM semesters WHERE id = $1", [params.id]);
    client.release();

    return NextResponse.json({ message: "Semester berhasil dihapus" });
  } catch (error) {
    console.error("DELETE semester error:", error);
    return NextResponse.json({ error: "Gagal menghapus semester" }, { status: 500 });
  }
}
