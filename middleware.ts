import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, })
  console.log("token:", token)
  console.log("cookies:", req.cookies.getAll())
  
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/home/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)(:path*)",
  ],
}