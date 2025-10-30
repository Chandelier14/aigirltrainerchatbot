import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const isPremium = request.cookies.get('isPremium')?.value === 'true';

  // If trying to access the login page while authenticated, redirect to billing
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/billing', request.url));
  }

  // If trying to access billing page while not authenticated, redirect to login
  if (request.nextUrl.pathname === '/billing' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access chat while not authenticated or not premium, redirect accordingly
  if (request.nextUrl.pathname === '/chat') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isPremium) {
      return NextResponse.redirect(new URL('/billing', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/billing', '/chat'],
};