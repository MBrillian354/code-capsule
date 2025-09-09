import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

// Define route patterns
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  console.log('Middleware session:', session)

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // Handle unknown routes (routes not in protectedRoutes or publicRoutes)
  if (!isProtectedRoute && !isPublicRoute) {
    if (session?.userId) {
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    } else {
      // User is not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
