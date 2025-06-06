import prisma from "../lib/prismaClient.js";
import express from "express";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    let category = req.query.category || "";

    if (category === "1") {
      category = "";
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        AND: [
          { name: { contains: search, mode: "insensitive" } },
          ...(category.length > 0
            ? [
                {
                  categories: {
                    some: {
                      category: {
                        id: category,
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

productRouter.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.productCategory.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});

productRouter.post("/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, userId } = req.body;

    const newRating = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
      },
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.log(error.message);
  }
});

export default productRouter;
