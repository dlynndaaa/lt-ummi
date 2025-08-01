import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

// GET all days
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM days ORDER BY id");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching days:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
