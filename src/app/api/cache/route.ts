import { NextRequest, NextResponse } from 'next/server';

// API route for cache management
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'clear') {
    // Clear cache headers
    return NextResponse.json(
      { message: 'Cache cleared' },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
  
  return NextResponse.json({ message: 'Cache management endpoint' });
}

// Set cache headers for this route
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json(
    { message: 'Cache updated', data: body },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min client, 10 min CDN
        'ETag': `"${Date.now()}"`,
        'Last-Modified': new Date().toUTCString(),
      },
    }
  );
}

