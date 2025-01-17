import { NextResponse } from "next/server";
import { getWasteListings } from "@/utils/db/actions"; // Adjust the path to your `actions` file

export async function GET() {
  try {
    const sampleData = [
      {
        id: 1,
        title: "Sample Waste",
        description: "This is a test waste listing",
        location: "Test City",
        wasteType: "plastic",
        quantity: "10",
        price: 100,
        status: "available",
        createdAt: new Date(),
      },
    ];
    return NextResponse.json(sampleData, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
  }
}

