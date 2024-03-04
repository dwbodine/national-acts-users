import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./src/router/routes";
import { clearUser } from "@/lib/userSlice";

export function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get("currentUser");
  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    (!currentUserCookie || !currentUserCookie.value)
  ) {
    request.cookies.delete("currentUser");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("currentUser");
    clearUser();
    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && currentUserCookie && currentUserCookie.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}