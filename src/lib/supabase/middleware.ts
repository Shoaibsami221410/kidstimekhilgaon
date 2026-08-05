import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not require auth for public routes (e.g., /, /about, /admissions, etc.)
  // We will enforce RBAC inside specific dashboards or protected routes.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // RBAC routing
  const path = request.nextUrl.pathname
  let role = user?.user_metadata?.role

  if (user && (!role || role === 'parent')) {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}&select=role`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (res.ok) {
          const json = await res.json()
          if (json && json.length > 0 && json[0].role) {
            role = json[0].role
          }
        }
      }
    } catch (err) {
      console.error("Middleware DB fetch error:", err)
    }
  }

  role = role || 'parent' // Default to parent if unknown

  // Admin route protection
  if (path.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    if (role === 'parent' || role === 'student') {
      const url = request.nextUrl.clone()
      url.pathname = '/parent' // Redirect parents away from admin dashboard
      return NextResponse.redirect(url)
    }
  }

  // Parent route protection
  if (path.startsWith('/parent')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    if (role === 'admin' || role === 'super_admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard' // Redirect admins away from parent dashboard
      return NextResponse.redirect(url)
    }
  }

  // General protected routes
  if (!user && (path.startsWith('/lms') || path.startsWith('/demo-classes') || path.startsWith('/admissions'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in but tries to access auth pages, redirect to their respective dashboard
  if (user && (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/signup'))) {
    const url = request.nextUrl.clone()
    if (role === 'parent' || role === 'student') {
      url.pathname = '/parent'
    } else {
      url.pathname = '/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
