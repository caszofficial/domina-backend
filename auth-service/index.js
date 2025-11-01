import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/users", usersRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});
