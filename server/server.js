import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/pdfs", express.static("pdfs"));

app.get("/", (req, res) => {
  res.send("LeanFit Backend Running");
});

app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", progressRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});