import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { CertificateReviews } from "@/utils/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    // Fetch the certificate review for the given user ID with status 'approved'
    const [review] = await db
      .select()
      .from(CertificateReviews)
      .where(and(eq(CertificateReviews.userId, userId), eq(CertificateReviews.status, "approved")))
      .execute();

    if (!review) {
      // If no review exists or it's not approved
      return NextResponse.json({ approved: false }, { status: 200 });
    }

    // If an approved review exists, return approved: true
    return NextResponse.json({ approved: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking approval status:", error);
    return NextResponse.json({ approved: false, message: "Internal Server Error" }, { status: 500 });
  }
}
