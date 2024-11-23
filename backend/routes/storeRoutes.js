import prisma from "../lib/prismaClient.js";
import express from "express";

const storeRouter = express.Router();

storeRouter.get("/", async (req, res) => {
  try {
    const stores = await prisma.store.findMany();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stores" });
  }
});

storeRouter.get("/:id", async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: "Error fetching store" });
  }
});

storeRouter.post("/", async (req, res) => {
  const { userId, name, description, category, profileUrl, bannerUrl } =
    req.body;

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

export default storeRouter;
