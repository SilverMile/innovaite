import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Get all hazards
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        h.*,
        u1.username as created_by_username,
        u2.username as claimed_by_username,
        u3.username as completed_by_username
      FROM hazards h
      LEFT JOIN users u1 ON h.user_id = u1.id
      LEFT JOIN users u2 ON h.claimed_by = u2.id
      LEFT JOIN users u3 ON h.completed_by = u3.id
      ORDER BY h.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching hazards:", error);
    res.status(500).json({ error: "Failed to fetch hazards" });
  }
});

// Get a single hazard by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        h.*,
        u1.username as created_by_username,
        u2.username as claimed_by_username,
        u3.username as completed_by_username
      FROM hazards h
      LEFT JOIN users u1 ON h.user_id = u1.id
      LEFT JOIN users u2 ON h.claimed_by = u2.id
      LEFT JOIN users u3 ON h.completed_by = u3.id
      WHERE h.id = $1
    `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hazard not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching hazard:", error);
    res.status(500).json({ error: "Failed to fetch hazard" });
  }
});

// Create a new hazard
router.post("/", async (req, res) => {
  try {
    const { lat, lng, description, userId } = req.body;

    if (!lat || !lng || !description) {
      return res.status(400).json({ error: "lat, lng, and description are required" });
    }

    const result = await pool.query(
      `
      INSERT INTO hazards (lat, lng, description, user_id, status)
      VALUES ($1, $2, $3, $4, 'open')
      RETURNING *
    `,
      [lat, lng, description, userId || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating hazard:", error);
    res.status(500).json({ error: "Failed to create hazard" });
  }
});

// Claim a hazard
router.patch("/:id/claim", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Check if hazard exists and is open
    const checkResult = await pool.query(
      "SELECT status FROM hazards WHERE id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Hazard not found" });
    }

    if (checkResult.rows[0].status !== "open") {
      return res.status(400).json({ error: "Hazard is not available to claim" });
    }

    const result = await pool.query(
      `
      UPDATE hazards 
      SET status = 'claimed', claimed_by = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [userId, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error claiming hazard:", error);
    res.status(500).json({ error: "Failed to claim hazard" });
  }
});

// Complete a hazard
router.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Check if hazard exists and is claimed by this user
    const checkResult = await pool.query(
      "SELECT status, claimed_by FROM hazards WHERE id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Hazard not found" });
    }

    const hazard = checkResult.rows[0];
    if (hazard.status === "completed") {
      return res.status(400).json({ error: "Hazard is already completed" });
    }

    if (hazard.status === "claimed" && hazard.claimed_by !== userId) {
      return res.status(403).json({ error: "You can only complete hazards you claimed" });
    }

    const result = await pool.query(
      `
      UPDATE hazards 
      SET status = 'completed', completed_by = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [userId, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error completing hazard:", error);
    res.status(500).json({ error: "Failed to complete hazard" });
  }
});

// Delete a hazard
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM hazards WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hazard not found" });
    }

    res.json({ message: "Hazard deleted successfully" });
  } catch (error) {
    console.error("Error deleting hazard:", error);
    res.status(500).json({ error: "Failed to delete hazard" });
  }
});

export default router;

