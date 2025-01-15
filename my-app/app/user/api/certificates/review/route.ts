import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { CertificateReviews } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action, score, feedback } = body;

    if (!id || !action) {
      return NextResponse.json({ message: "Review ID and action are required." }, { status: 400 });
    }

    const updateValues: Record<string, any> = { status: action };

    if (action === "approved" && score !== undefined) {
      updateValues.score = score;
    }

    if (feedback) {
      updateValues.adminFeedback = feedback;
    }

    const [updatedReview] = await db
      .update(CertificateReviews)
      .set(updateValues)
      .where(eq(CertificateReviews.id, id))
      .returning()
      .execute();

    if (!updatedReview) {
      return NextResponse.json({ message: "Review not found." }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
