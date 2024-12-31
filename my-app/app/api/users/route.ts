// /api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { Users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Check if the user exists
    const existingUser = await db.select().from(Users).where(eq(Users.email, email)).execute();

    if (existingUser.length > 0) {
      // Return existing userId
      return NextResponse.json({ userId: existingUser[0].id });
    }

    // Create a new user
    const [newUser] = await db
      .insert(Users)
      .values({ email, name })
      .returning()
      .execute();

    return NextResponse.json({ userId: newUser.id });
  } catch (error) {
    console.error("Error in /api/users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
