import Stripe from 'stripe';
import prisma from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { dishId, scheduledDate, amount } = req.body;
    const userId = req.user.userId;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const purchase = await prisma.purchase.create({
      data: {
        userId: userId,
        stripeIntentId: paymentIntent.id,
        status: 'PENDING',
        tickets: {
          create: [{
            dishId: dishId,
            scheduledDate: new Date(scheduledDate),
            status: 'ACTIVE'
          }]
        }
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      purchaseId: purchase.id
    });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Failed to initialize payment." });
  }
};
