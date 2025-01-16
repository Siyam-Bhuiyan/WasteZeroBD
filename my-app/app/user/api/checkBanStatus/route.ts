import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig"; // Import database configuration
import { Users } from "@/utils/db/schema"; // Import Users schema
import { eq } from "drizzle-orm"; // Import 'eq' helper

export async function POST(req: Request) {
  try {
    // Parse the email from the request body
    const { email } = await req.json();

    // Validate the input
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Query the database for the user with the given email
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();

    // If the user is not found, return an error
    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return the user's banned status
    return NextResponse.json({
      success: true,
      banned: user[0].banned || false, // Default to false if `banned` field is not set
    });
  } catch (error) {
    console.error("Error checking ban status:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
