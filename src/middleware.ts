import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Apply middleware to specific routes
export default withAuth(
  function middleware(req: NextRequest) {
    // Optional: Add logging or role-based handling here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only allow if token exists (user is authenticated)
        return !!token
      },
    },
  }
)

// Specify routes that require authentication
export const config = {
  matcher: [
    "/dashboard/:path*",   // secure dashboard
    "/profile/:path*",     // secure profile
    "/settings/:path*",    // secure settings
  ],
}
