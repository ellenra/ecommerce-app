import prisma from "../lib/prismaClient.js";
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.imageUrl],
          description: item.description,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.count,
    };
  });

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/checkout-error`,
  });

  res.send({ url: session.url });
});

const endpointSecret = process.env.STRIPE_WEBHOOK;

router.post("/webhook", (request, response) => {
  let event = request.body;
  let data;
  if (endpointSecret) {
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
      data = event.data.object;
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  if (event.type === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        const items = JSON.parse(customer.metadata.cart);
        const totalPrice = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        const order = await prisma.order.create({
          data: {
            userId: customer.metadata.userId,
            total: totalPrice,
            status: "PENDING",
            paymentStatus: "COMPLETED",
            customerId: customer.id,
            orderItems: {
              create: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            },
          },
        });
        console.log("Order created:", order);

        console.log(customer);
        console.log(data);
      })
      .catch((error) => console.log(error.message));
  }

  response.send();
});

export default router;
