import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'];

/** Slugs under `/dashboard/moderation/*` that are real routes, not legacy report IDs. */
const MODERATION_ROUTE_SLUGS = new Set(['all', 'sessions', 'people', 'reviews']);

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname, search } = request.nextUrl;

  const legacyModeration = pathname.match(/^\/dashboard\/moderation\/([^/]+)$/);
  if (legacyModeration && !MODERATION_ROUTE_SLUGS.has(legacyModeration[1])) {
    return NextResponse.redirect(
      new URL(`/dashboard/moderation/all/${legacyModeration[1]}${search}`, request.url),
    );
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && isProtectedRoute) {
    const loginUrl = new URL(`/login`, request.url);
    loginUrl.searchParams.set('from', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
