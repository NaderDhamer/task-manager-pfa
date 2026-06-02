const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000 
});

// Initialize Database with retry
async function initDatabase(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Tasks table initialized successfully');
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i+1}/${retries} failed. Retrying in 3s...`, err.message);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  console.error('❌ Failed to initialize tasks database');
}

initDatabase();

app.get('/health', (req, res) => res.send('Task Service Healthy'));

// Create Task
app.post('/tasks', async (req, res) => {
  const { userId, title, description } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ error: "userId and title are required" });
  }

  // Check if user exists
  try {
    await axios.get(`http://user-service:3001/users/${userId}`);
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title, description, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks by user
app.get('/tasks/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3002, () => console.log('🚀 Task Service running on port 3002'));