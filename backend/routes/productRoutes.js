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

productRouter.post("/:storeId/products", async (req, res) => {
  const storeId = req.params.storeId;
  const { name, description, price, quantity, imageUrl, categoryId, userId } =
    req.body;

  try {
    const product = await prisma.product.create({
      data: {
        storeId: storeId,
        userId,
        name,
        description,
        price,
        quantity,
        imageUrl,
        categoryId,
      },
    });
    res.json(product);
  } catch (error) {
    console.log("errorrr", error);
    res.status(500).json({ error: "Error listing product" });
  }
});

productRouter.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

export default productRouter;
