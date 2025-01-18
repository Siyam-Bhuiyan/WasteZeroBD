import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { Payment } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let type = searchParams.get("type"); // Default to "certificates"

  // Ensure `type` is a string; provide a fallback if necessary
  if (!type) {
    type = "certificates"; // Replace with your desired default value
  }

  try {
    const transactions = await db
      .select()
      .from(Payment)
      .where(eq(Payment.type, type)) // Pass the ensured `string` type here
      .orderBy(desc(Payment.date)); // Sort by most recent first

    console.log("Fetched Transactions:", transactions); // Debug log
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
