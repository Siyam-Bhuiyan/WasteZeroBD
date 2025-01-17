import { NextResponse } from "next/server";
import { getWasteListings } from "@/utils/db/actions";

export async function GET() {
  try {
    const listings = await getWasteListings(); // Fetch listings with images
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
  }
}
