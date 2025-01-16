import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { Payment } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "certificate"; // Default to "certificates"

  try {
    const transactions = await db
      .select()
      .from(Payment)
      .where(eq(Payment.type, type)) // Use `eq` to filter by type
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
