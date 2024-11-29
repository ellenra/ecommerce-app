import prisma from "../lib/prismaClient.js";
import express from "express";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

export default productRouter;
