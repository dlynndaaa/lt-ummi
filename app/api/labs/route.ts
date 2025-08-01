import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/connection";

// GET /api/labs
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, location
      FROM laboratories
      WHERE is_deleted = FALSE
      ORDER BY id ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/labs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, supervisor, capacity, description } = body;

    const parsedCapacity = capacity !== "" ? parseInt(capacity) : null;

    const result = await pool.query(
      `INSERT INTO laboratories 
        (name, location, supervisor_id, capacity, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        name,
        location,
        supervisor || null,       // ID dari plps
        parsedCapacity,
        description || null
      ]
    );

    return NextResponse.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("Gagal insert:", error);
    return new NextResponse("Gagal menyimpan data", { status: 500 });
  }
}
