//api/postSubmit/route.js

import { getConnection, sql } from "@/lib/db";


export default async function POST(req, res) {

    try {
        //const pool = await poolPromise;
        const { title, description, reason, impact } = await req.body;

        if (!title || !description || !reason || !impact) {
            return res.status(400).json({ error: 'All Fields are required' });
        }

        console.log(req.body);

        await getConnection();
        const result = await sql.query`
      INSERT INTO CHIL_TblIdeas (
        Ideatitle, IdeaDesc, IdeaReason, IdeaImpact, IdeaStatus, CreatedUserID, LastModified, createdAt
      ) VALUES (${title}, ${description}, ${reason}, ${impact}, 'Pending', 2, GETDATE(), GETDATE())
    `;

    return res.status(200).json({ message: 'Details stored successfully', result});

    } catch (err) {

        console.error('Error storing details:', err);

        // Check if the error is related to the invalid column name
        const errorMessage = err.originalError && err.originalError.message.includes("Invalid column name 'reason'")
            ? "Invalid column name 'reason'"
            : 'Internal Server Error';

        return res.status(500).json({error: errorMessage})

    }
}