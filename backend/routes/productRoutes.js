import prisma from "../lib/prismaClient.js";
import express from "express";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    let category = req.query.category || "";

    const categories = await prisma.productCategory.findMany();

    console.log(categories);

    const filterCategory = category ? category.split(",") : [];

    console.log("filcat", filterCategory);

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { name: { contains: search, mode: "insensitive" } },
          ...(filterCategory.length > 0
            ? [
                {
                  categories: {
                    some: {
                      category: {
                        id: {
                          in: filterCategory,
                        },
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
    });
    res.json({ products, categories });
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

export default productRouter;
