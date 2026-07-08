import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";
import hirerRoutes from "./routes/hirerRoutes";
import complianceRoutes from "./routes/complianceRoutes";
import vendorRoutes from "./routes/vendorRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use("/", userRoutes);
app.use("/", hirerRoutes);
app.use("/", complianceRoutes);
app.use("/", vendorRoutes);
app.get("/", (req, res) => {
  res.send("Venue Vendors backend is running");
});

AppDataSource.initialize()

  .then(() => {

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  })

  .catch((error) => {
    console.error("Database connection failed:", error);
  });