import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8000;
import orderRoutes from "./routes/orderRoutes";

connectDB();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);

// health api
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
