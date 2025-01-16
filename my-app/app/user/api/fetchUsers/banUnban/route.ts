import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig"; // Adjust path as per your structure
import { Users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId, banned } = await req.json();

    // Update the `banned` status of the user
    await db
      .update(Users)
      .set({ banned })
      .where(eq(Users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}
