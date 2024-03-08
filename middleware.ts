import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./src/router/routes";

export function middleware(request: NextRequest) {
  const authTokenCookie = request.cookies.get("authToken");
  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    (!authTokenCookie || !authTokenCookie.value)
  ) {
    request.cookies.delete("authToken");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authToken");
    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && authTokenCookie && authTokenCookie.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}