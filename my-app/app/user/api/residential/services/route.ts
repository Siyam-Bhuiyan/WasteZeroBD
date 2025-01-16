import { db } from '@/utils/db/dbConfig';
import { ResidentialServices } from '@/utils/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const services = await db.select().from(ResidentialServices).execute();

    // Add a formatted createdAt field for easier rendering
    const formattedServices = services.map((service) => ({
      ...service,
      createdAt: new Date(service.createdAt).toLocaleString(),
    }));

    return NextResponse.json({ success: true, services: formattedServices });
  } catch (error) {
    console.error('Error fetching residential services:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
