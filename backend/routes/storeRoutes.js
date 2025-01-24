import prisma from "../lib/prismaClient.js";
import express from "express";
import multer from "multer";
import supabase from "../services/supabaseClient.js";
import { decode } from "base64-arraybuffer";
import { authMiddleware } from "../middleware/auth.js";

const storeRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

storeRouter.get("/", async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        products: true,
      },
    });
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
      include: {
        products: true,
      },
    });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: "Error fetching store" });
  }
});

storeRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const { userId, name, description, categoryId, bannerUrl } = req.body;

    try {
      if (req.file) {
        const file = req.file;
        const fileBase64 = decode(file.buffer.toString("base64"));

        const { data, error } = await supabase.storage
          .from("store-images")
          .upload(file.originalname, fileBase64, {
            contentType: "image/png",
          });

        if (error) {
          throw error;
        }

        const { data: image } = supabase.storage
          .from("store-images")
          .getPublicUrl(data.path);

        const store = await prisma.store.create({
          data: {
            userId,
            name,
            description,
            categoryId,
            profileUrl: image.publicUrl,
            bannerUrl,
          },
        });
        res.status(201).json(store);
      } else {
        const store = await prisma.store.create({
          data: {
            userId,
            name,
            description,
            categoryId,
            bannerUrl,
          },
        });
        res.status(201).json(store);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);

storeRouter.put(
  "/:storeId",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const { storeId } = req.params;
    const userIdFromToken = req.user.user.id;

    let { userId, name, description, categoryId, profileUrl, bannerUrl } =
      req.body;

    try {
      const storeToEdit = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!storeToEdit) {
        return res.status(404).json({ message: "Store not found" });
      }

      if (storeToEdit.userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      if (req.file) {
        const file = req.file;
        //TODO: Edit so that if image exists, use that, don't upload new
        const uniqueFileName = `${Date.now()}-${file.name}`;
        const fileBase64 = decode(file.buffer.toString("base64"));

        const { data, error } = await supabase.storage
          .from("store-images")
          .upload(uniqueFileName, fileBase64, {
            contentType: "image/png",
          });

        if (error) {
          return res
            .status(500)
            .json({ message: "Image upload failed", error });
        }

        const { data: image } = supabase.storage
          .from("store-images")
          .getPublicUrl(data.path);

        if (!image) {
          throw new Error("Failed to generate URL for uploaded image.");
        }

        profileUrl = image.publicUrl;
      }

      const store = await prisma.store.update({
        where: { id: storeId },
        data: {
          userId,
          name,
          description,
          categoryId,
          profileUrl,
          bannerUrl,
        },
      });

      res.status(200).json(store);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

storeRouter.post(
  "/:storeId/products",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const storeId = req.params.storeId;
    const userIdFromToken = req.user.user.id;

    let { name, description, price, quantity, categories, userId } = req.body;

    try {
      const storeToEdit = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!storeToEdit) {
        return res.status(404).json({ message: "Store not found" });
      }

      if (storeToEdit.userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      categories = JSON.parse(categories);
      const parsedPrice = parseFloat(price);
      const parsedQuantity = parseInt(quantity, 10);

      if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
        return res.status(400).json({ error: "Invalid price or quantity" });
      }
      if (req.file) {
        const file = req.file;
        const uniqueFileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(uniqueFileName, file.buffer, {
            contentType: file.mimetype,
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
            categories: {
              create:
                categories?.map((categoryId) => ({
                  category: { connect: { id: categoryId } },
                })) || [],
            },
          },
        });
        res.json(product);
      } else {
        const product = await prisma.product.create({
          data: {
            storeId: storeId,
            userId,
            name,
            description,
            price: parsedPrice,
            quantity: parsedQuantity,
            categories: {
              create:
                categories?.map((categoryId) => ({
                  category: { connect: { id: categoryId } },
                })) || [],
            },
          },
        });
        res.json(product);
      }
    } catch (error) {
      console.log("errorrr", error);
      res.status(500).json({ error: "Error listing product" });
    }
  }
);

storeRouter.get("/:storeId/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

storeRouter.delete(
  "/:storeId/products/:id",
  authMiddleware,
  async (req, res) => {
    const productId = req.params.id;
    const userIdFromToken = req.user.user.id;

    try {
      const productToDelete = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (productToDelete.userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      await prisma.categoriesOnProducts.deleteMany({
        where: {
          productId: productId,
        },
      });

      const deleteProduct = await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      res.json(deleteProduct);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error deleting product" });
    }
  }
);

storeRouter.put(
  "/:storeId/products/:id",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const productId = req.params.id;
    const storeId = req.params.storeId;
    const userIdFromToken = req.user.user.id;

    let { name, description, price, quantity, categories, imageUrl, userId } =
      req.body;

    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity, 10);

    categories = JSON.parse(categories);

    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      return res.status(400).json({ error: "Invalid price or quantity" });
    }

    try {
      const productToEdit = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!productToEdit) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (productToEdit.userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      if (req.file) {
        const file = req.file;
        const uniqueFileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(uniqueFileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) {
          throw error;
        }

        const { data: image } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);

        if (!image) {
          throw new Error("Failed to generate public URL for uploaded image.");
        }

        imageUrl = image.publicUrl;
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          imageUrl: imageUrl,
          storeId,
          userId,

          categories: {
            deleteMany: {},
            create:
              categories?.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })) || [],
          },
        },
      });

      res.status(200).json(product);
    } catch (error) {
      console.log(error.message);
    }
  }
);

export default storeRouter;
