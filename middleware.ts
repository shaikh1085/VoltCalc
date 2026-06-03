import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Let explicit country path requests pass through
  if (
    pathname.startsWith('/us') ||
    pathname.startsWith('/uk') ||
    pathname.startsWith('/au')
  ) {
    return NextResponse.next();
  }

  // Intercept the root path '/' exactly for geo-redirection
  if (pathname === '/') {
    const country = request.geo?.country?.toUpperCase();

    if (country === 'GB' || country === 'UK') {
      url.pathname = '/uk';
      return NextResponse.redirect(url);
    } else if (country === 'AU') {
      url.pathname = '/au';
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/us';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
