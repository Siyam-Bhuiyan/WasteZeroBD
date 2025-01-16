import { NextResponse } from 'next/server';
import { db } from '@/utils/db/dbConfig';
import { ResidentialServices } from '@/utils/db/schema';

export async function POST(request: Request) {
  try {
    const { location, fileUrls, userId } = await request.json();

    if (!location || !fileUrls || fileUrls.length === 0 || !userId) {
      return NextResponse.json(
        { error: 'Location, userId, and at least one file URL are required.' },
        { status: 400 }
      );
    }

    // Store in Neon database
    const [service] = await db
      .insert(ResidentialServices)
      .values({
        userId: parseInt(userId, 10),
        location,
        wasteType: 'residential',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log('Service Created:', service);

    return NextResponse.json({ message: 'Service created successfully!', service });
  } catch (error) {
    console.error('Error in service request:', error);
    return NextResponse.json(
      { error: 'Failed to process service request. Please try again.' },
      { status: 500 }
    );
  }
}
