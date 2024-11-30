import prisma from "../lib/prismaClient.js";
import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, userId } = req.body;
  if (!firstName || !lastName || !email || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await prisma.user.create({
      data: {
        id: userId,
        firstName,
        lastName,
        email,
        seller: false,
      },
    });
    res.status(200).json({ message: "User registered", data });
  } catch (error) {
    console.error("server error", error);
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
