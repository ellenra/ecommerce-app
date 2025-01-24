import prisma from "../lib/prismaClient.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID missing" });
  }

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
    console.log(error);
  }
});

userRouter.post("/:id/favorites", authMiddleware, async (req, res) => {
  const userId = req.params.id;
  const { productId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favorites: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favorites.some((favorite) => favorite.id === productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          connect: { id: productId },
        },
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
  }
});

userRouter.delete(
  "/:id/favorites/:productId",
  authMiddleware,
  async (req, res) => {
    const { id: userId, productId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          favorites: {
            select: { id: true },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.favorites.some((favorite) => favorite.id === productId)) {
        return res.status(400).json({ message: "Product not in favorites" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: productId },
          },
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error deleting fav", error);
    }
  }
);

userRouter.put("/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, address, postalCode, city, country } =
    req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        address,
        postalCode,
        city,
        country,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
  }
});

export default userRouter;
