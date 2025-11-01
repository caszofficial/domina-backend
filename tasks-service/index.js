import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import tasksRouter from "./routes/tasks.routes.js";

const app = express();
const PORT = process.env.PORT || 4001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", tasksRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB conectado (tasks-service)");
    app.listen(PORT, () => {
      console.log(`🚀 Tasks Service corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando Mongo (tasks-service):", err.message);
    process.exit(1);
  });
