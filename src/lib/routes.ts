// Centralized route protection config

export const protectedRoutes = ['/dashboard'] as const
export const publicRoutes = ['/', '/login', '/signup', '/dashboard/explore'] as const

export function isProtectedPath(pathname: string) {
  // Special cases for public access
  if (pathname.startsWith('/dashboard/explore')) {
    return false
  }
  if (pathname.match(/^\/dashboard\/capsule\/[^\/]+\/learn/)) {
    return false
  }
  return protectedRoutes.some((r) => pathname.startsWith(r))
}

export function isPublicPath(pathname: string) {
  // Check exact matches
  if (publicRoutes.some((r) => pathname === r)) {
    return true
  }
  // Check pattern matches
  if (pathname.startsWith('/dashboard/explore')) {
    return true
  }
  if (pathname.match(/^\/dashboard\/capsule\/[^\/]+\/learn/)) {
    return true
  }
  return false
}
