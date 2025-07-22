import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(`SELECT id, name FROM faculties ORDER BY id`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
