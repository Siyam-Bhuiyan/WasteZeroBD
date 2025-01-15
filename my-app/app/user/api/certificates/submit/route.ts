import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { CertificateReviews, Users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, email } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ message: "Invalid answers submitted." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Lookup userId from Users schema
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();

    if (!user.length) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const userId = user[0].id;

    // Insert review into CertificateReviews schema
    const [review] = await db
      .insert(CertificateReviews)
      .values({
        userId,
        answers: JSON.stringify(answers),
        status: "pending",
      })
      .returning()
      .execute();

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error in submit API:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
