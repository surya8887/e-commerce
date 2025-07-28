import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.SECRET_KEY });
  const url = req.nextUrl;

  const isAuth = !!token;
  const isLoginPage = url.pathname === "/login";
  const isRegisterPage = url.pathname === "/register";

  // If user is NOT authenticated and tries to access protected pages
  if (!isAuth && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user IS authenticated and tries to access auth pages
  if (isAuth && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/home",        // protected route
    "/dashboard",   // optional: add more protected routes
    "/profile/:path*"
  ],
};
