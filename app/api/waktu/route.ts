import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

// GET All
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM time_slots ORDER BY id ASC");

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST Create
export async function POST(req: Request) {
  try {
    const { start_time, end_time } = await req.json();
    await pool.query(
      "INSERT INTO time_slots (start_time, end_time) VALUES ($1, $2)",
      [start_time, end_time]
    );
    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create data" }, { status: 500 });
  }
}
