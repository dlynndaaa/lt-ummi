import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

export async function GET() {
  try {
    const result = await pool.query("SELECT penalty_per_day FROM settingpenalty WHERE key = 'default' LIMIT 1");
    return NextResponse.json({ penalty: result.rows[0]?.penalty_per_day ?? 5000 });
  } catch (error) {
    console.error("GET /api/penalty error:", error);
    return NextResponse.json({ penalty: 5000 });
  }
}

export async function PUT(req: Request) {
  try {
    const { penalty } = await req.json();

    const result = await pool.query("SELECT key FROM settingpenalty WHERE key = 'default'");

    if (result.rows.length > 0) {
      await pool.query(
        "UPDATE settingpenalty SET penalty_per_day = $1 WHERE key = 'default'",
        [penalty]
      );
    } else {
      await pool.query(
        "INSERT INTO settingpenalty (key, value, penalty_per_day) VALUES ('default', 'penalty', $1)",
        [penalty]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/penalty error:", error);
    return NextResponse.json({ success: false });
  }
}
