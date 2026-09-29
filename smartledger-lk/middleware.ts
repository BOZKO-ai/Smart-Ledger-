import { NextResponse, type NextRequest } from "next/server";
import { verifyTokenEdge, AUTH_COOKIE_NAME } from "@/lib/jwtEdge";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyTokenEdge(token) : null;

  const isAuthPage =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/onboarding");

  // If no valid token and accessing protected route → redirect to login
  if (!payload && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If valid token and on auth page → redirect to dashboard
  if (payload && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled by Node.js runtime)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
