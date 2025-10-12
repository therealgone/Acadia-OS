import { NextRequest, NextResponse } from 'next/server';

const etagStore = new Map<string, string>(); // Store ETags for each endpoint

// Simple hash function
function hashCode(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// Helper to generate ETag for data
function generateETag(data: unknown) {
  return `"${hashCode(JSON.stringify(data))}"`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const endpoint = url.pathname;

  if (action === 'clear') {
    etagStore.clear();
    return NextResponse.json({ message: 'Cache cleared' }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }

  // Example data fetch logic (replace with your actual API calls)
  let data: unknown;
  switch (endpoint) {
    case '/api/timetable':
      data = { timetable: "Your timetable data" }; break;
    case '/api/marks':
      data = { marks: "Your marks data" }; break;
    case '/api/userInfo':
      data = { user: "User info" }; break;
    case '/api/course':
      data = { courses: "Course data" }; break;
    case '/api/calendar':
      data = { calendar: "Calendar data" }; break;
    case '/api/attendance':
      data = { attendance: "Attendance data" }; break;
    case '/api/dayOrder':
      data = { dayOrder: "Day order data" }; break;
    default:
      data = { message: "Unknown endpoint" };
  }

  // ETag logic
  const etag = generateETag(data);
  const clientETag = request.headers.get('if-none-match');

  etagStore.set(endpoint, etag);

  if (clientETag === etag) {
    return new Response(null, { status: 304 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'ETag': etag,
      'Last-Modified': new Date().toUTCString(),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    { message: 'Cache updated', data: body },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'ETag': `"${Date.now()}"`,
        'Last-Modified': new Date().toUTCString(),
      },
    }
  );
}
