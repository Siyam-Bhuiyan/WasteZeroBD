import { NextResponse } from "next/server";
import { db} from "@/utils/db/dbConfig"; // Update this path to match your project
import { WasteListings } from "@/utils/db/schema"; // Import your schema
import {eq} from 'drizzle-orm'
export async function POST(request: Request) {
  try {
    const { listingId, imageUrl } = await request.json();

    if (!listingId || !imageUrl) {
      return NextResponse.json(
        { error: "Listing ID and Image URL are required" },
        { status: 400 }
      );
    }

    await db
      .update(WasteListings)
      .set({ imageUrl })
      .where(eq(WasteListings.id, listingId));

    return NextResponse.json({
      success: true,
      message: "Image URL saved successfully",
    });
  } catch (error) {
    console.error("Error saving image URL:", error);
    return NextResponse.json({ error: "Failed to save image URL" }, { status: 500 });
  }
}
