import { NextResponse } from "next/server";
import { handleSell } from "@/utils/db/actions"; // Adjust the path as per your project structure

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body

    // Destructure required fields
    const { userId, title, description, location, wasteType, quantity, price } = body;

    // Validate required fields
    if (!userId || !title || !location || !wasteType || !quantity || !price) {
      return NextResponse.json(
        { message: "Missing required fields: userId, title, location, wasteType, quantity, price are required." },
        { status: 400 }
      );
    }

    // Call the database action to create the listing
    const listing = await handleSell(
      userId,
      title,
      description || "", // Allow null or empty descriptions
      location,
      wasteType,
      quantity,
      price,
      null // No image URL at the time of creation
    );

    return NextResponse.json(
      { success: true, listing },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating listing:", error);

    return NextResponse.json(
      { message: "Failed to create listing", error: error.message },
      { status: 500 }
    );
  }
}
