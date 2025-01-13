import prisma from "../lib/prismaClient.js";
import express from "express";

const orderRouter = express.Router();

orderRouter.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

orderRouter.get("/", async (req, res) => {
  const userId = req.body.userId;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        user: true,
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orders) {
      res.json(orders);
    } else {
      res.status(404).json({ message: "Orders not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default orderRouter;
