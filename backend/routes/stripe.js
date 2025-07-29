import prisma from "../lib/prismaClient.js";
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const sellers = {};

  req.body.cartItems.forEach((item) => {
    if (!sellers[item.userId]) {
      sellers[item.userId] = [];
    }
    sellers[item.userId].push(item);
  });

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cartItemsCount: req.body.cartItems.length,
      totalPrice: req.body.cartItems.reduce(
        (total, item) => total + item.price * item.count,
        0
      ),
    },
  });

  const checkoutSessions = [];

  for (const [sellerId, items] of Object.entries(sellers)) {
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { stripeAccountId: true },
    });

    if (!seller?.stripeAccountId) {
      return res.status(400).send("Seller doesn't have Stripe account!");
    }

    const order = await prisma.order.create({
      data: {
        userId: req.body.userId,
        total: items.reduce((total, item) => total + item.price, 0),
        paymentStatus: "PENDING",
        customerId: customer.id,
        sellerId: sellerId,
        orderItems: {
          create: items.map((item) => ({
            productId: item.id,
            sellerId: sellerId,
          })),
        },
      },
    });
    const line_items = items.map((item) => {
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
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "AL",
          "AD",
          "AM",
          "AT",
          "AZ",
          "BY",
          "BE",
          "BA",
          "BG",
          "HR",
          "CY",
          "CZ",
          "DK",
          "EE",
          "FI",
          "FR",
          "GE",
          "DE",
          "GR",
          "HU",
          "IS",
          "IE",
          "IT",
          "KZ",
          "LV",
          "LI",
          "LT",
          "LU",
          "MT",
          "MD",
          "MC",
          "ME",
          "NL",
          "MK",
          "NO",
          "PL",
          "PT",
          "RO",
          "RU",
          "SM",
          "RS",
          "SK",
          "SI",
          "ES",
          "SE",
          "CH",
          "TR",
          "UA",
          "GB",
          "VA",
        ],
      },
      success_url: `${process.env.CLIENT_URL}/checkout-success?orderId=${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-error`,
      metadata: {
        orderId: order.id,
        sellerId: sellerId,
      },
      payment_intent_data: {
        transfer_data: {
          destination: seller.stripeAccountId,
        },
      },
    });

    checkoutSessions.push(session.url);
  }

  console.log(checkoutSessions);

  res.send({ url: checkoutSessions[0] });
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
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "COMPLETED",
            shippingAddressId: shippingAddressId,
          },
        });

        console.log("Order updated, payment completed:", order);
      })
      .catch((error) => console.log(error.message));
  }

  response.send();
});

export default router;
