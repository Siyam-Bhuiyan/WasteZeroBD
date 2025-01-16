import { NextResponse } from "next/server";
import { db } from "@/utils/db/dbConfig"; // Adjust path as per your structure
import { Users } from "@/utils/db/schema";

export async function GET() {
  try {
    const users = await db.select().from(Users);
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
