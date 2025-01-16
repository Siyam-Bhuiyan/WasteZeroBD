import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { Users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // Extract email from query params

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Debugging: Log the email being queried
    console.log("Fetching user with email:", email);

    // Query the database for the user with the given email
    const user = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1)
      .execute();

    // Debugging: Log the fetched user
    console.log("Fetched user:", user);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, userId: user[0].id });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return NextResponse.json(
      { error: "Failed to fetch user. Please try again." },
      { status: 500 }
    );
  }
}
