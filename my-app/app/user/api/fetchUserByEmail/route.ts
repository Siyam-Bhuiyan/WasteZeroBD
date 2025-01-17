import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig";
import { Users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
export async function GET(request: Request) {
  try {
      const { searchParams } = new URL(request.url);
      const email = searchParams.get("email");

      if (!email) {
          console.error("No email provided in request.");
          return NextResponse.json({ error: "Email is required." }, { status: 400 });
      }

      console.log("Fetching user with email:", email);

      const user = await db
          .select({ id: Users.id })
          .from(Users)
          .where(eq(Users.email, email))
          .limit(1)
          .execute();

      console.log("Fetched user from DB:", user);

      if (!user || user.length === 0) {
          console.error("No user found with this email.");
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
