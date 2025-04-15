//api/posts/route.js
import { getConnection, sql} from "@/lib/db";

 
export default async function handler(req, res) {
  try {
    const poolUserDb = await getConnection();
    const result = await poolUserDb.request().query('SELECT id, IdeaTitle, IdeaDesc, IdeaStatus, IdeaAnswer, createdAt, assignedTo, IdeaImpact FROM CHIL_TblIdeas');
    
    return res.status(200).json({posts: result.recordset})

  } catch (err) {
    console.error(err);

    return res.status(500).json({error: 'Internal Server Error'})
  }
}