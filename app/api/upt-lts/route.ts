import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all
export async function GET() {
  const result = await pool.query("SELECT * FROM upt_lts ORDER BY id");
  return NextResponse.json(result.rows);
}

// POST new
export async function POST(req: Request) {
  const { name, department, jabatan } = await req.json();

  if (!name || !department || !jabatan) {
    return NextResponse.json({ error: "Field tidak lengkap." }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO upt_lts (name, department, jabatan)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, department, jabatan]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
