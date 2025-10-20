import { NextResponse, NextRequest } from "next/server";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  // Use request.cookies directly instead of server action
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (!user) {
    return NextResponse.redirect(new URL("/auth/logout", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/app/(.*)",
};