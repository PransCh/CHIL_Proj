import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Get MSSQL connection for user database
      const poolUserDb = await getConnection();

      // Retrieve user from the user database
      const userResult = await poolUserDb.request()
        .input('Email', email)
        .query('SELECT * FROM CHIL_TblUser WHERE UserEmail = @Email');

      const user = userResult.recordset[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.UserPassword);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Get MSSQL connection for role database
      const poolRoleDb = await getConnection(); // Assuming getConnection can connect to different databases

      // Retrieve role from the role database using the login email
      const roleResult = await poolRoleDb.request()
        .input('Email', email)
        .query('SELECT UserTeam FROM CHIL_TblCelaneseUsers WHERE UserEmail = @Email');
      console.log(roleResult);

      const UserTeam = roleResult.recordset[0]?.UserTeam;

      if (!UserTeam) {
        return res.status(404).json({ error: 'UserTeam not found' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id, email: user.email, UserTeam: UserTeam }, 'prans', { expiresIn: '1h' });

      // Handle successful login
      return res.status(200).json({ success: true, token, user: { name: user.UserName, email: user.UserEmail, UserTeam: UserTeam } });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'An error occurred during login' });
    }
  } else {
    // Only allow POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}