import dotenv from "dotenv";
import supabase from "../services/supabaseClient.js";

dotenv.config();

const jwt_secret = process.env.SUPABASE_JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }

  if (!jwt_secret) {
    return res.status(500).json({ error: "JWT Secret not configured" });
  }

  const token = authHeader.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  req.user = user;
  next();
};

//For endpoints where different data is fetched for unauthorized and authorized users
const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !jwt_secret) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(token);

  if (!error && user) {
    req.user = user;
  }
  next();
};

export { authMiddleware, optionalAuthMiddleware };
