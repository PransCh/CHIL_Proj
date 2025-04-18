import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function handler(request, res) {
    try {
        const { userId } = await request.body; // Extract userId from request body
        if (!userId) {
            return res.status(400).json({})
        }
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(`SELECT i.Id, i.IdeaTitle, i.IdeaDesc, i.IdeaReason, i.IdeaImpact, i.IdeaStatus, i.CreatedAt,
               u1.UserName as createdUserName, u1.UserEmail as createdUserEmail,
               u2.UserName as submittedUserName, u2.UserEmail as submittedUserEmail
        FROM CHIL_TblIdeas i
        JOIN CHIL_TblUser u1 ON i.CreatedUserID = u1.id
        LEFT JOIN CHIL_TblUser u2 ON i.SubmittedId = u2.id
        JOIN CHIL_assignee a ON i.Id = a.IdeaId
        WHERE a.UserId = ${userId} AND i.IdeaStatus != 'Completed'`);
        return res.status(200).json(result.recordset)
    } catch (error) {
        console.error("Error fetching notifications:", error);

        return res.status(500).json({ message: "Internal server error" })
    }
}