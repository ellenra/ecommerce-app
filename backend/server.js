import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import storeRouter from "./routes/storeRoutes.js";
import productRouter from "./routes/productRoutes.js";
import stripe from "./routes/stripe.js";
import orderRouter from "./routes/orderRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

const jwt_secret = process.env.SUPABASE_JWT_SECRET;

if (!jwt_secret) {
  console.error("No SUPABASE_JWT_SECRET set");
  process.exit(1);
}

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommerce-5yqj6ztsd-ellenras-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", router);
app.use("/api/users", userRouter);
app.use("/api/stores", storeRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/stripe", stripe);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => res.send("Server running"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
