import prisma from "../lib/prismaClient.js";
import express from "express";
import multer from "multer";
import supabase from "../services/supabaseClient.js";
import { decode } from "base64-arraybuffer";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

storeRouter.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const store = await prisma.store.findUnique({
      where: { userId: userId },
      select: { id: true },
    });

    res.json(store);
  } catch (error) {
    res.status(500).json({ error: "Error finding user's store" });
  }
});

storeRouter.get("/:id", optionalAuthMiddleware, async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      include: {
        products: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            storeId: true,
            imageUrl: true,
            isActive: true,
          },
        },
      },
    });

    const publicData = {
      id: store.id,
      userId: store.userId,
      name: store.name,
      description: store.description,
      products: store.products,
    };

    if (req.user && store.userId === req.user.user.id) {
      const fullStoreData = await prisma.store.findFirst({
        where: {
          id: storeId,
        },
        include: {
          products: true,
        },
      });
      return res.json(fullStoreData);
    }
    res.json(publicData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching store" });
  }
});

storeRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const { userId, name, description, categoryId, bannerUrl, userEmail } =
      req.body;

    let store;

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

        store = await prisma.store.create({
          data: {
            userId,
            name,
            description,
            categoryId,
            profileUrl: image.publicUrl,
            bannerUrl,
          },
        });
      } else {
        store = await prisma.store.create({
          data: {
            userId,
            name,
            description,
            categoryId,
            bannerUrl,
          },
        });
      }
      if (store) {
        const stripeAccount = await stripe.accounts.create({
          type: "express",
          country: "FI",
          email: userEmail,
          business_type: "individual",
          business_profile: {
            url: "https://digitra.com",
            product_description: "Seller on DIGITRA",
          },
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { stripeAccountId: stripeAccount.id, seller: true },
        });

        const stripeLink = await stripe.accountLinks.create({
          account: stripeAccount.id,
          type: "account_onboarding",
          refresh_url: `${process.env.CLIENT_URL}/stripe-onboarding-error`,
          return_url: `${process.env.CLIENT_URL}/stores/${store.id}`,
        });
        return res.status(201).json({ onboardingUrl: stripeLink.url });
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
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
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
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "productFile", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Files received:", req.files);
    const storeId = req.params.storeId;
    const userIdFromToken = req.user.user.id;

    let { name, description, price, categories, userId } = req.body;

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

      if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: "Invalid price" });
      }

      if (!req.files.file?.[0]) {
        return res
          .status(400)
          .json({ error: "Thumbnail picture is required!" });
      }

      const file = req.files.file[0];
      if (!file || !file.originalname) {
        return res.status(400).json({ error: "File not uploaded properly." });
      }
      const uniqueFileName = `${Date.now()}-${file.originalname}`;

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

      if (!req.files.productFile?.[0]) {
        return res
          .status(400)
          .json({ error: "Digital product file is required!" });
      }

      const productFile = req.files.productFile[0];
      const uniqueProductFileName = `${Date.now()}-${productFile.originalname}`;

      const { data: productData, error: productError } = await supabase.storage
        .from("digital-products")
        .upload(uniqueProductFileName, productFile.buffer, {
          contentType: productFile.mimetype,
        });

      if (productError) throw productError;

      const { data: productFileUrl } = supabase.storage
        .from("digital-products")
        .getPublicUrl(productData.path);

      const product = await prisma.product.create({
        data: {
          storeId: storeId,
          userId,
          name,
          description,
          price: parsedPrice,
          imageUrl: image.publicUrl,
          productUrl: productFileUrl.publicUrl,
          categories: {
            create:
              categories?.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })) || [],
          },
        },
      });
      res.json(product);
    } catch (error) {
      console.error("Error listing product", error);
      res
        .status(500)
        .json({ error: "Error listing product", details: error.message });
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
        store: {
          select: {
            name: true,
          },
        },
        reviews: true,
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
        include: { orders: true },
      });

      if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (productToDelete.userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      if (productToDelete.orders.length > 0) {
        return res.status(400).json({
          message: "Failed to delete product, it is part of an order.",
        });
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
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "productFile", maxCount: 1 },
  ]),
  async (req, res) => {
    const productId = req.params.id;
    const storeId = req.params.storeId;
    const userIdFromToken = req.user.user.id;

    let { name, description, price, categories, imageUrl, productUrl, userId } =
      req.body;

    const parsedPrice = parseFloat(price);

    categories = JSON.parse(categories);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Invalid price" });
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

      if (req.files.file?.[0]) {
        const imageFile = req.files.file[0];
        const uniqueFileName = `${Date.now()}-${imageFile.name}`;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(uniqueFileName, imageFile.buffer, {
            contentType: imageFile.mimetype,
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

      if (req.files.productFile?.[0]) {
        const productFile = req.files.productFile[0];
        const uniqueProductFileName = `${Date.now()}-${productFile.name}`;

        const { data: productData, error: productError } =
          await supabase.storage
            .from("digital-products")
            .upload(uniqueProductFileName, productFile.buffer, {
              contentType: productFile.mimetype,
            });

        if (productError) {
          throw productError;
        }

        const { data: productFileUrl } = supabase.storage
          .from("digital-products")
          .getPublicUrl(productData.path);

        if (!productFileUrl) {
          throw new Error(
            "Failed to generate public URL for uploaded product."
          );
        }

        productUrl = productFileUrl.publicUrl;
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price: parsedPrice,
          imageUrl: imageUrl,
          productUrl: productUrl,
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

storeRouter.put(
  "/:storeId/products/:id/status",
  authMiddleware,
  async (req, res) => {
    const productId = req.params.id;
    const userIdFromToken = req.user.user.id;

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

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { isActive: !productToEdit.isActive },
      });

      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product status:", error);

      res.status(500).json({ message: "Error changing activity status" });
    }
  }
);

export default storeRouter;
