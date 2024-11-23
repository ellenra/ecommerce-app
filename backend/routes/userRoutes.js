import prisma from "../lib/prismaClient.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        store: true,
        favorites: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

export default userRouter;
