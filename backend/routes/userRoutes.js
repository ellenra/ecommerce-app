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

userRouter.post("/:id/store", async (req, res) => {
  const { userId, name, description, category, profileUrl, bannerUrl } =
    req.body;
  console.log(userId, name, description, category, profileUrl, bannerUrl);

  try {
    const store = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        category,
        profileUrl,
        bannerUrl,
      },
    });

    res.status(201).json(store);
  } catch (error) {
    console.log(error.message);
  }
});

export default userRouter;
