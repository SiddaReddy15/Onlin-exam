import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./models/schema";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import studentRoutes from "./routes/studentRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import publicRoutes from "./routes/publicRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Initialize Database
const startServer = async () => {
  try {
    await initDB();
    
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/student", studentRoutes);
    app.use("/api/leaderboard", leaderboardRoutes);
    app.use("/api/public", publicRoutes);
    
    app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
        console.error(`💡 Tip: Run 'Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force' in PowerShell to clear it.\n`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
