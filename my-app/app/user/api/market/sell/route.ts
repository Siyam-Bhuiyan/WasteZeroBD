import { NextResponse } from "next/server";
import { handleSell } from "@/utils/db/actions"; // Adjust the path as per your project structure

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { userId, title, description, location, wasteType, quantity, price, imageUrl } = body;

    // Validate required fields
    if (!userId || !title || !location || !wasteType || !quantity || !price) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const listing = await handleSell(
      userId,
      title,
      description,
      location,
      wasteType,
      quantity,
      price,
      // Allow null imageUrl if not provided
    );

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ message: "Failed to create listing" }, { status: 500 });
  }
}
