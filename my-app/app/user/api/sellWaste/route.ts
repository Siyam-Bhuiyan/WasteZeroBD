import { NextRequest, NextResponse } from "next/server";
import { createReport } from "@/utils/db/actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, location, wasteType, amount, imageUrl } = body;

    if (!userId || !location || !wasteType || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const report = await createReport({ userId, wasteType, amount, imageUrl });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
