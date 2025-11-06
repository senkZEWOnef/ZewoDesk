import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and the root login page
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname === '/' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];
  
  // Allow /projects in visitor mode (with ?visitor=true parameter)
  if (pathname.startsWith('/projects')) {
    const url = new URL(request.url);
    const isVisitorMode = url.searchParams.get('visitor') === 'true';
    
    if (!isVisitorMode) {
      // Check for auth token if not in visitor mode
      const authToken = request.cookies.get('zewo_auth');
      
      if (!authToken || authToken.value !== 'authenticated') {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } else if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Check for auth token in cookies (for SSR)
    const authToken = request.cookies.get('zewo_auth');
    
    if (!authToken || authToken.value !== 'authenticated') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}