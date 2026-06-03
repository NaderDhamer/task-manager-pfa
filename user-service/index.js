const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const databaseUrl = process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER || process.env.POSTGRES_USER}:${process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST || 'postgres-users'}:5432/${process.env.DB_NAME || process.env.POSTGRES_DB}`;

const pool = new Pool({ 
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000
});

// Retry logic to initialize database
async function initDatabase(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Users table initialized successfully');
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i+1}/${retries} failed. Retrying in 3s...`, err.message);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  console.error('❌ Failed to initialize database after multiple attempts');
}

async function startServer() {
  await initDatabase();

  app.get('/health', (req, res) => res.send('User Service Healthy'));

  // Get all users
  app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by id
app.get('/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  app.listen(3001, () => console.log('🚀 User Service running on port 3001'));
}

startServer().catch(err => {
  console.error('Failed to start User Service', err);
  process.exit(1);
});