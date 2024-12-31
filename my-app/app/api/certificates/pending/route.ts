import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { CertificateReviews } from "@/utils/db/schema";
import { eq, sql } from "drizzle-orm";

// Removed the `SET enable_result_cache` query
export async function GET() {
  try {
    // Use raw SQL to fetch pending reviews
    const rawPendingReviews = await db.execute(
      sql`SELECT * FROM certificate_reviews WHERE status = 'pending';`
    );

    console.log("Raw SQL Pending Reviews:", rawPendingReviews.rows);

    return NextResponse.json(rawPendingReviews.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
