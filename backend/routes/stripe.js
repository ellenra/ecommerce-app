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
      cartItemsCount: req.body.cartItems.length,
      totalPrice: req.body.cartItems.reduce(
        (total, item) => total + item.price * item.count,
        0
      ),
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

  const order = await prisma.order.create({
    data: {
      userId: req.body.userId,
      total: req.body.cartItems.reduce(
        (total, item) => total + item.price * item.count,
        0
      ),
      status: "PENDING",
      paymentStatus: "PENDING",
      customerId: customer.id,
      orderItems: {
        create: req.body.cartItems.map((item) => ({
          productId: item.id,
          quantity: item.count,
        })),
      },
    },
  });
  console.log("Order created, payment pending:", order);

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
    },
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
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const shippingAddress = session.shipping_details?.address || null;

        let shippingAddressId = null;

        if (shippingAddress) {
          const address = await prisma.shippingAddress.create({
            data: {
              line1: shippingAddress.line1,
              line2: shippingAddress.line2 || null,
              city: shippingAddress.city,
              state: shippingAddress.state || null,
              postalCode: shippingAddress.postal_code,
              country: shippingAddress.country,
            },
          });
          shippingAddressId = address.id;
        }

        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "COMPLETED",
            shippingAddressId: shippingAddressId,
          },
        });

        console.log("Order updated, payment completed:", order);

        console.log(customer);
        console.log(data);
      })
      .catch((error) => console.log(error.message));
  }

  response.send();
});

export default router;
