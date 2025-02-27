import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function middleware(req: NextRequest) {
  const { data } = await supabase.auth.getUser();
  
  if (!data.user && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/events/:path*"], // Cek halaman yang butuh login
};
