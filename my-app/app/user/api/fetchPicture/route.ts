import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload?context=true&folder=residential_waste_management`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
          )}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch images from Cloudinary");
    }

    const data = await response.json();

    // Log the retrieved resources for debugging
    console.log("Retrieved Resources:", data.resources);

    const userImages = data.resources.filter(
      (image: any) => {
        const customContext = image.context?.custom?.custom;
        return customContext && customContext === `userId=${userId}`;
      }
    );

    return NextResponse.json({ success: true, images: userImages });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images. Please try again." },
      { status: 500 }
    );
  }
}
