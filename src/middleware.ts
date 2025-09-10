import { NextRequest, NextResponse } from 'next/server';
import { adminRoutes, authRoutes, protectedRoutes, publicRoutes } from './router/routes';
import { JwtPayload } from './types/user';
import { jwtDecode } from 'jwt-decode';

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const authToken = req.cookies.get('authToken')?.value;

  // Read role from authToken claims
  let isAdmin = false;
  if (authToken) {
    const decodedToken = jwtDecode<JwtPayload>(authToken);
    isAdmin = decodedToken.role === 'admin';
  }

  if (authToken && !isAdmin && adminRoutes.find((x) => path.startsWith(x))) {
    const errUrl = '/logout?err=1';
    return NextResponse.redirect(new URL(errUrl, req.url));
  } else if (
    !authToken &&
    protectedRoutes.find((x) => path.startsWith(x)) &&
    !authRoutes.find((x) => path.startsWith(x)) &&
    !publicRoutes.find((x) => path.startsWith(x))
  ) {
    let loginUrl = '/login';
    if (path !== '/') {
      loginUrl += `?returnPath=${encodeURIComponent(path)}`;
    }
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }
  return NextResponse.next();
}
