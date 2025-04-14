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
      // Get MSSQL connection
      const pool = await getConnection();

      // Retrieve user from the database
      const result = await pool.request()
        .input('Email', email)
        .query('SELECT * FROM CHIL_TblUser WHERE UserEmail = @Email');

      const user = result.recordset[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.UserPassword);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'prans', { expiresIn: '1h' });

      // Handle successful login
      return res.status(200).json({ success: true, token, user: {name: user.UserName, email: user.UserEmail } });
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