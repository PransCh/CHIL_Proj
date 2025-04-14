import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * from CHIL_TblIdeas ");
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}