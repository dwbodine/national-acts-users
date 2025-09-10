import { NextRequest, NextResponse } from 'next/server';
import { authRoutes, protectedRoutes, publicRoutes } from './router/routes';

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const authToken = req.cookies.get('authToken');

  if (!authToken && protectedRoutes.find(x => x === path) && !authRoutes.find(x => x === path) && !publicRoutes.find(x => x === path)) {
    let url = '/login';
    if (path !== "/") {
        url += `?returnPath=${encodeURIComponent(path)}`;
    }
    return NextResponse.redirect(new URL(url, req.url));
  }
  return NextResponse.next();
}
