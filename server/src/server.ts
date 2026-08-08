import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "http";
import orderRoutes from "./routes/orderRoutes";
import archiveRoutes from "./routes/archiveRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
const frontendUrl = process.env.FRONTEND_URL;

import { initializeSocket } from "./socket";

const app = express();
const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    // origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
});

connectDB();
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/archive-old-orders", archiveRoutes);
app.use("/analytics", analyticsRoutes);

// health api
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
initializeSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
