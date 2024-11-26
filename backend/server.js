import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/auth.js";
import userRouter from "./routes/userRoutes.js";
import storeRouter from "./routes/storeRoutes.js";
import productRouter from "./routes/productRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

const jwt_secret = process.env.SUPABASE_JWT_SECRET;

if (!jwt_secret) {
  console.error("No SUPABASE_JWT_SECRET set");
  process.exit(1);
}

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", router);
app.use("/api/users", userRouter);
app.use("/api/stores", storeRouter);
storeRouter.use("", productRouter);

app.get("/", (req, res) => res.send("Server running"));

app.post("/secret", authMiddleware, (req, res) => {
  const email = req.user.email;
  res.status(200).json({ email });
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
