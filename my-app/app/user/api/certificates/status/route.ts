// /api/certificates/status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { CertificateReviews } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const userId = req.headers.get("userId"); // Assume userId is sent in the request header

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const [review] = await db
      .select()
      .from(CertificateReviews)
      .where(eq(CertificateReviews.userId, Number(userId)))
      .execute();

    if (!review) {
      return NextResponse.json({ message: "No review found for the user" }, { status: 404 });
    }

    if (review.status === "approved") {
      return NextResponse.json({ approved: true, review });
    }

    return NextResponse.json({ approved: false, review });
  } catch (error) {
    console.error("Error fetching certificate status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
