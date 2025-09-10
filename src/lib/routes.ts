// Centralized route protection config

export const protectedRoutes = ['/dashboard'] as const
export const publicRoutes = ['/', '/login', '/signup', '/explore', '/learn'] as const

export function isProtectedPath(pathname: string) {
  // Special cases for public access
  if (pathname.startsWith('/explore')) {
    return false
  }
  if (pathname.startsWith('/learn/')) {
    return false
  }
  // Dashboard routes are protected except for some explore/learn paths
  if (pathname.startsWith('/dashboard/explore') || pathname.match(/^\/dashboard\/capsule\/[^\/]+\/learn/)) {
    return false // These were made public in the previous implementation
  }
  return protectedRoutes.some((r) => pathname.startsWith(r))
}

export function isPublicPath(pathname: string) {
  // Check exact matches
  if (publicRoutes.some((r) => pathname === r)) {
    return true
  }
  // Check pattern matches for public paths
  if (pathname.startsWith('/explore')) {
    return true
  }
  if (pathname.startsWith('/learn/')) {
    return true
  }
  // Keep the old dashboard explore/learn paths public for backward compatibility
  if (pathname.startsWith('/dashboard/explore')) {
    return true
  }
  if (pathname.match(/^\/dashboard\/capsule\/[^\/]+\/learn/)) {
    return true
  }
  return false
}
