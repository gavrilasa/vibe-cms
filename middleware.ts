import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Track visitor for all pages except API routes and static files
  if (
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.includes('.')
  ) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Add visitor data to response headers for tracking
    response.headers.set('x-visitor-ip', ip);
    response.headers.set('x-visitor-user-agent', userAgent);
    response.headers.set('x-visitor-page', request.nextUrl.pathname);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};