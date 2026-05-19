import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL('/?denied=1', req.url))
    }

    const role = token.role as string | undefined

    // CS: only /admin/orders routes
    if (role === 'cs') {
      const isAllowed = pathname === '/admin/orders' || pathname.startsWith('/admin/orders/')
      if (!isAllowed) return NextResponse.redirect(new URL('/admin/orders', req.url))
    }

    // admin: no access to /admin/pengaturan
    if (role === 'admin') {
      const isDenied = pathname === '/admin/pengaturan' || pathname.startsWith('/admin/pengaturan/')
      if (isDenied) return NextResponse.redirect(new URL('/admin', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
