import { db } from '@/utils/db/dbConfig'; // Import your database configuration
import { Notifications } from '@/utils/db/schema'; // Import your database schema
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      console.error('Error: User ID is missing in the request.');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log(`Fetching notifications for userId: ${userId}`);

    // Fetch unread notifications from the database
    const notifications = await db
      .select()
      .from(Notifications)
      .where(
        and(
          eq(Notifications.userId, parseInt(userId, 10)), // Ensure userId is an integer
          eq(Notifications.isRead, false) // Only fetch unread notifications
        )
      )
      .execute();

    console.log('Fetched Notifications:', notifications);

    // Return the list of notifications
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
};
