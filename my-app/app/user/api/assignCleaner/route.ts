import { db } from '@/utils/db/dbConfig';
import { ResidentialServices } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { serviceId, cleanerId, cleanerName } = await req.json();

    if (!serviceId || !cleanerId || !cleanerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update the Residential Service with the cleaner's details
    await db
      .update(ResidentialServices)
      .set({
        cleanerId,
        status: `Assigned to ${cleanerName}`,
        updatedAt: new Date(),
      })
      .where(eq(ResidentialServices.id, serviceId))
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning cleaner:', error);
    return NextResponse.json({ error: 'Failed to assign cleaner' }, { status: 500 });
  }
};
