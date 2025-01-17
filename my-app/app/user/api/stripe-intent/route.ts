import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/utils/db/dbConfig";
import { Payment } from "@/utils/db/schema";

const stripe = new Stripe(
  'sk_test_51PMqS2GhvT5slJMQNAszBQF17cNHYnzWv1mmUWyVAQ2dEGlj7R541NWX27QiIwHuhLPNan0lGMdI9qwfN6jSKVw900OdOYnKDC',
  {
    apiVersion: "2022-11-15" as any,
  }
);

export async function POST(req: Request) {
  try {
    // Parse the request body to extract required details
    const body = await req.json();
    console.log(body)
    const { userEmail, userName, type, amount } = body;

    if (!userEmail || !userName || !amount) {
      return NextResponse.json(
        { message: "Missing required parameters." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Certificate Fee" },
            unit_amount: amount * 100, // Convert amount to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/user/certificate/status?success=true`,
      cancel_url: `http://localhost:3000/user/certificate/status?canceled=true`,
    });

    // Insert payment details into the database
    const transactionId = session.id;
    await db.insert(Payment).values({
      transactionId,
      userEmail,
      userName,
      type: type || "certificate",
      amount,
      date: new Date(),
    });

    return NextResponse.json(
      { success: true, url: session.url, sessionId: session.id },
      { status: 200 }
    );
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
