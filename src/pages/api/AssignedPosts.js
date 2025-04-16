import { getConnection, sql } from "@/lib/db";

 
export default async function handler(req, res) {
   
    console.log(req.query);
    const { AssignedTeam } = req.query;
    console.log(AssignedTeam);
  try {
   
 
    await getConnection();
 
    const result = await sql.query`SELECT * FROM CHIL_TblIdeas where AssignedTeam=${AssignedTeam} and IdeaStatus='Completed'`;
    console.log(result)
 
    res.status(200).json({ posts: result.recordset[0] });;
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Database query error');
  }
}