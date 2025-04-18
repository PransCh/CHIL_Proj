import { getConnection } from "@/lib/db";

export default async function handler(req,res) {
    console.log(req.method)
    if (req.method === 'POST') {
        // const { username, email, password } = req.body;
        console.log(req.body);
    
        try {
        // console.log(req.body)
             res.status(200).json({message:'success'})
         } catch (error) {
        
    }
    }
}