import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const { location, fileUrls, userId } = await request.json();

    // Validation
    if (!location || !fileUrls || fileUrls.length === 0) {
      return NextResponse.json(
        { error: 'Location and at least one file URL are required.' },
        { status: 400 }
      );
    }

    // Process the data (e.g., store in database or log)
    console.log('Service Request Received:', {
      location,
      fileUrls,
      userId,
    });

    // Respond with success
    return NextResponse.json(
      { message: 'Service requested successfully!', data: { location, fileUrls, userId } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
