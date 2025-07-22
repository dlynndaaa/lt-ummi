import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// GET all semesters
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM semesters ORDER BY id ASC");
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET semesters error:", error);
    return NextResponse.json({ error: "Failed to fetch semesters" }, { status: 500 });
  }
}

// POST create semester
export async function POST(req: Request) {
  try {
    const { year, type, semester_no, is_active } = await req.json();

    const client = await pool.connect();
    await client.query(
      "INSERT INTO semesters (year, type, semester_no, is_active) VALUES ($1, $2, $3, $4)",
      [year, type, semester_no, is_active]
    );
    client.release();

    return NextResponse.json({ message: "Semester berhasil ditambahkan" });
  } catch (error) {
    console.error("POST semester error:", error);
    return NextResponse.json({ error: "Gagal menambahkan semester" }, { status: 500 });
  }
}
