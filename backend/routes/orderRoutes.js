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
  const { userId, storeId } = req.query;
  try {
    let orders;
    if (userId) {
      orders = await prisma.order.findMany({
        where: { userId: userId },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (storeId) {
      orders = await prisma.order.findMany({
        where: { storeId: storeId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
      });
    } else {
      return res.status(400).json({ message: "Missing userId or storeId" });
    }

    if (orders) {
      res.json(orders);
    } else {
      res.status(404).json({ message: "Orders not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

orderRouter.put("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error changing status" });
  }
});

export default orderRouter;
