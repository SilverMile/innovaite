import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import hazardsRouter from "./routes/hazards.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/hazards", hazardsRouter);
app.use("/api/users", usersRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

