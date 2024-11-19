import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the auth cookie
  const authCookie = request.cookies.get("auth");

  // Get the current path
  const path = request.nextUrl.pathname;

  // Don't redirect for login page and api routes
  if (path === "/login" || path.startsWith("/api")) {
    return NextResponse.next();
  }

  // If no auth cookie is present, redirect to login
  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - login
     * - api routes
     * - static files (/_next/, /images/, /favicon.ico, etc.)
     */
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
