import { getConnection, sql } from "@/lib/db";


export default async function handler(req, res) {
    const { AssignedTeam, Status} = req.body;
    try {
        const poolUserDb = await getConnection();

        // Retrieve user from the user database
        const result = await poolUserDb.request()
            .input('AssignedTeam', AssignedTeam)
            .input('IdeaStatus', Status)
            .query('SELECT * FROM CHIL_TblIdeas where AssignedTeam=@AssignedTeam');
        console.log(result)

        res.status(200).json({ posts: result.recordset});;
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query error');
    }
}