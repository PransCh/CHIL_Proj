"use client";
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;
    console.log(req.body);

    try {
      // Get MSSQL connection
      const pool = await getConnection();
      console.log('Database connection established');

      // Check if the email exists in another table
      const emailCheckResult = await pool.request()
        .input('UserEmail', email)
        .query(`
          SELECT COUNT(*) as count FROM CHIL_TblCelaneseUsers WHERE UserEmail = @UserEmail
        `);

      if (emailCheckResult.recordset[0].count === 0) {
        return res.status(400).json({ error: 'Invalid email' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(username, email, hashedPassword);

      // Insert user into the database
      await pool.request()
        .input('UserName', username)
        .input('UserEmail', email)
        .input('UserPassword', hashedPassword)
        .query(`
          INSERT INTO CHIL_TblUser (UserName, UserEmail, UserPassword)
          VALUES (@UserName, @UserEmail, @UserPassword)
        `);

      console.log('User inserted into DB');

      // Send a response back to the client
      return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.originalError && error.originalError.info && error.originalError.info.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      return res.status(500).json({ error: 'An error occurred during registration' });
    }
  } else {
    // Only allow POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
