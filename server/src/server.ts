import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "http";
import orderRoutes from "./routes/orderRoutes";
import archiveRoutes from "./routes/archiveRoutes";
import { initializeSocket } from "./socket";

const app = express();
const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
});

connectDB();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/archive-old-orders", archiveRoutes);
// health api
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
initializeSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
