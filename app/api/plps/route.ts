import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM plps ORDER BY id");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, nip } = await req.json();

    const result = await pool.query(
      `INSERT INTO plps (name, nip) VALUES ($1, $2) RETURNING *`,
      [name, nip]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Gagal menambahkan." }, { status: 500 });
  }
}
