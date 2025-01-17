import { createNotification } from '@/utils/db/actions';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    try {
      const { userId, message, type } = await req.json();
  
      if (!userId || !message || !type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      const notification = await createNotification(userId, message, type);
  
      if (!notification) {
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
      }
  
      return NextResponse.json({ success: true, notification });
    } catch (error) {
      console.error('Error creating notification:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };