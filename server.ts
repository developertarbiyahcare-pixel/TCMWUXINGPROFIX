import express from "express";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize SQLite database
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT,
      role TEXT,
      createdAt INTEGER
    );

    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      patientName TEXT,
      age TEXT,
      sex TEXT,
      address TEXT,
      complaint TEXT,
      symptoms TEXT,
      selectedSymptoms TEXT,
      tongue TEXT,
      pulse TEXT,
      diagnosis TEXT,
      timestamp INTEGER,
      medicalHistory TEXT,
      biomedicalDiagnosis TEXT,
      icd10 TEXT
    );
  `);

  // Seed default admin if not exists
  const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    await db.run('INSERT INTO users (username, password, role, createdAt) VALUES (?, ?, ?, ?)', ['admin', '', 'admin', Date.now()]);
  }

  // --- API Routes ---

  // Users API
  app.get("/api/users", async (req, res) => {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    const { username, password, role, createdAt } = req.body;
    try {
      await db.run('INSERT INTO users (username, password, role, createdAt) VALUES (?, ?, ?, ?)', [username, password, role, createdAt]);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'User already exists' });
    }
  });

  app.delete("/api/users/:username", async (req, res) => {
    await db.run('DELETE FROM users WHERE username = ?', [req.params.username]);
    res.json({ success: true });
  });

  // Patients API
  app.get("/api/patients", async (req, res) => {
    const patients = await db.all('SELECT * FROM patients ORDER BY timestamp DESC');
    // Parse JSON fields back to objects
    const parsedPatients = patients.map(p => ({
      ...p,
      selectedSymptoms: JSON.parse(p.selectedSymptoms || '[]'),
      tongue: JSON.parse(p.tongue || '{}'),
      pulse: JSON.parse(p.pulse || '{}'),
      diagnosis: JSON.parse(p.diagnosis || '{}')
    }));
    res.json(parsedPatients);
  });

  app.post("/api/patients", async (req, res) => {
    const p = req.body;
    try {
      await db.run(`
        INSERT INTO patients (id, patientName, age, sex, address, complaint, symptoms, selectedSymptoms, tongue, pulse, diagnosis, timestamp, medicalHistory, biomedicalDiagnosis, icd10)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.id, p.patientName, p.age, p.sex, p.address, p.complaint, p.symptoms,
        JSON.stringify(p.selectedSymptoms), JSON.stringify(p.tongue), JSON.stringify(p.pulse),
        JSON.stringify(p.diagnosis), p.timestamp, p.medicalHistory, p.biomedicalDiagnosis, p.icd10
      ]);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save patient' });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    await db.run('DELETE FROM patients WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
