import prisma from "../lib/prismaClient.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.get("/:orderId", authMiddleware, async (req, res) => {
  const { orderId } = req.params;

  //TODO: Add check if user is owner of the products being ordered
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

orderRouter.get("/", authMiddleware, async (req, res) => {
  const { userId, storeId } = req.query;
  const userIdFromToken = req.user.user.id;

  try {
    let orders;

    if (userId) {
      if (userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      orders = await prisma.order.findMany({
        where: { userId: userId, paymentStatus: "COMPLETED" },
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
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      if (store.userId !== userIdFromToken) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      orders = await prisma.order.findMany({
        where: {
          orderItems: {
            some: {
              product: {
                storeId: storeId,
              },
            },
          },
        },
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

orderRouter.put("/:orderId", authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  //TODO: Add check if user is owner of the products being ordered

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

orderRouter.get("/order-item/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const userIdFromToken = req.user.user.id;

  try {
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: productId,
        order: {
          userId: userIdFromToken,
          paymentStatus: "COMPLETED",
        },
      },
    });

    res.json({ hasPurchased: !!hasPurchased });
  } catch (error) {
    res.status(500).json({ message: "Error checking if purchased" });
  }
});

export default orderRouter;
