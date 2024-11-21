import express from "express";
import supabase from "../services/supabaseClient.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, userId } = req.body;
  if (!firstName || !lastName || !email || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase.from("User").insert({
      id: userId,
      firstName,
      lastName,
      email,
      seller: false,
    });

    if (error) {
      console.log("error database insertion", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "User registered", data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res
        .status(401)
        .json({ loggedIn: false, message: "No token found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
