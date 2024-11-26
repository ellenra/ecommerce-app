import prisma from "../lib/prismaClient.js";
import express from "express";
import multer from "multer";
import supabase from "../services/supabaseClient.js";
import { decode } from "base64-arraybuffer";

const productRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

productRouter.post(
  "/:storeId/products",
  upload.single("file"),
  async (req, res) => {
    try {
      const storeId = req.params.storeId;
      const { name, description, price, quantity, categoryId, userId } =
        req.body;

      const parsedPrice = parseFloat(price);
      const parsedQuantity = parseInt(quantity, 10);

      if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
        return res.status(400).json({ error: "Invalid price or quantity" });
      }

      const file = req.file;
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const fileBase64 = decode(file.buffer.toString("base64"));

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(uniqueFileName, fileBase64, {
          contentType: "image/png",
        });

      if (error) {
        throw error;
      }

      const { data: image } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      const product = await prisma.product.create({
        data: {
          storeId: storeId,
          userId,
          name,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          imageUrl: image.publicUrl,
          categoryId,
        },
      });
      res.json(product);
    } catch (error) {
      console.log("errorrr", error);
      res.status(500).json({ error: "Error listing product" });
    }
  }
);

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

productRouter.delete("/:storeId/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    res.json(deleteProduct);
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

export default productRouter;
