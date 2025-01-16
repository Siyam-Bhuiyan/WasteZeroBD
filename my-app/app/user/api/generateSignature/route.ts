import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export async function POST(request: Request) {
  try {
    const { folder = "images", userId, uploadPreset } = await request.json();

    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("CLOUDINARY_API_SECRET is not defined in the environment.");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate the string to sign
    const paramsToSign = {
      context: `custom=userId=${userId}`, // Metadata with userId
      folder, // Target folder for uploads
      source: "uw", // Indicates upload widget
      timestamp,
      upload_preset: uploadPreset,
    };

    // Create string to sign
    const stringToSign = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json({ error: "Failed to generate signature." }, { status: 500 });
  }
}
