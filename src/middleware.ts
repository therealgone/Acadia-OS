import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "./utils/getCookieServer";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  const cookie = await getCookie();
  if (!cookie.token)
    return NextResponse.redirect(new URL("/auth/login", request.url));
  if (!cookie.user)
    return NextResponse.redirect(new URL("/auth/logout", request.url));

  
  return NextResponse.next();
}

export const config = {
  matcher: "/app/(.*)",
};