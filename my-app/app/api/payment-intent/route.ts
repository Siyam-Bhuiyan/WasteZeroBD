import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51PMqS2GhvT5slJMQNAszBQF17cNHYnzWv1mmUWyVAQ2dEGlj7R541NWX27QiIwHuhLPNan0lGMdI9qwfN6jSKVw900OdOYnKDC', {
  apiVersion: "2022-11-15" as any,
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Certificate Fee" },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/certificate/status?success=true`,
      cancel_url: `http://localhost:3000/certificate/status?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    let errorMessage = "Unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error creating payment intent:", errorMessage);
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}
