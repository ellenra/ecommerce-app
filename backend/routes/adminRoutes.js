import prisma from "../lib/prismaClient.js";
import express from "express";

const adminRouter = express.Router();

adminRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const admin = await prisma.admin.findUnique({
      where: {
        id: userId,
      },
    });

    if (!admin) {
      return res.json({ isAdmin: false });
    }

    res.json({ isAdmin: true });
  } catch (error) {
    console.error("Error checking admin", error);
    res.status(500).json({ error: "Error checking admin" });
  }
});

export default adminRouter;
