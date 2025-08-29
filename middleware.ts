// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Protect /dashboard and nested routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // redirect to sign in
      url.pathname = "/api/auth/signin";
      return NextResponse.redirect(url);
    }
    // optional: enforce admin role
    if (token?.role !== "admin") {
      url.pathname = "/"; // redirect non-admins to home
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
