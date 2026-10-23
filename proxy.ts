import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirects in next.config match case-insensitively, so "/ADMIN" -> "/admin"
// there loops forever. Handle the casing here instead.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/admin" && pathname.toLowerCase() === "/admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|uploads).*)"],
};
