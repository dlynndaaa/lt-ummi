import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const result = await pool.query("SELECT * FROM upt_lts WHERE id = $1", [params.id]);
  if (result.rows.length === 0)
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, department, jabatan } = await req.json();
  const result = await pool.query(
    `UPDATE upt_lts SET name = $1, department = $2, jabatan = $3 WHERE id = $4 RETURNING *`,
    [name, department, jabatan, params.id]
  );
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM upt_lts WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "Berhasil dihapus" });
}
