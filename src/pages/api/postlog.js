import { getConnection } from "@/lib/db";


export default async function handler(request, res) {
    try {
        const { id, notes, userId } = await request.body;
        if (!id || !notes || !userId) {
            return res.status(400).json({ error: "Missing required fields: id or notes or userId" })
        }
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("notes", notes)
            .input("id", id)
            .input("userId", userId)
            .query(`UPDATE CHIL_TblIdeas SET IdeaStatus = 'Completed',IdeaAnswer = @notes ,SubmittedId=@userId WHERE id = @id`);
        if (result.rowsAffected[0] === 0) {
            return res.status(400).json({ error: "No idea found with the provided id" })
        }
        return res.status(200).json({ message: "Idea answer updated successfully" })
    } catch (error) {
        console.error("Error updating idea answer:", error);
        return res.status(500).json({ error: "Internal server error" })
    }
}