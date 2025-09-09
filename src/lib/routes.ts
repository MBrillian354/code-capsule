// Centralized route protection config

export const protectedRoutes = ['/dashboard'] as const
export const publicRoutes = ['/', '/login', '/signup'] as const

export function isProtectedPath(pathname: string) {
  return protectedRoutes.some((r) => pathname.startsWith(r))
}

export function isPublicPath(pathname: string) {
  return publicRoutes.includes(pathname as (typeof publicRoutes)[number])
}
