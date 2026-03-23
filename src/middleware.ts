import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

const PROTECTED_PATHS = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  const sessionUpdate = updateSession(request);
  if ("status" in sessionUpdate) {
    return sessionUpdate;
  }

  const { supabase, response } = sessionUpdate;
  const { data } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(data.user);

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
