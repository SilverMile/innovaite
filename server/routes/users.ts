import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, created_at FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create a new user (simple version - in production, add authentication)
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "username and email are required" });
    }

    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at",
      [username, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(409).json({ error: "Username or email already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;

