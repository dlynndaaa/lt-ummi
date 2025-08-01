import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(`SELECT * FROM plps WHERE id = $1`, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, nip } = await req.json();

    const result = await pool.query(
      `UPDATE plps SET name = $1, nip = $2 WHERE id = $3 RETURNING *`,
      [name, nip, params.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui data." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query(`DELETE FROM plps WHERE id = $1`, [params.id]);
    return NextResponse.json({ message: "Data berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data." }, { status: 500 });
  }
}
