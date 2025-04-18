import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT i.IdeaTitle,i.IdeaDesc,i.IdeaReason,i.IdeaImpact,i.IdeaStatus,i.CreatedAt,i.IdeaAnswer,u.UserName as createdUserName,u.UserEmail as createdUserEmail from CHIL_TblIdeas i join CHIL_TblUser u on i.CreatedUserID=u.id");
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// where CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE)