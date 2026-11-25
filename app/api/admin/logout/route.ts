import { NextResponse } from "next/server";
import { SESSION_COOKIE, isSameOrigin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new NextResponse("Forbidden", { status: 403 });
  const res = new NextResponse(null, { status: 303, headers: { Location: "/admin/login?e=out", "Cache-Control": "no-store" } });
  res.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", maxAge: 0, httpOnly: true, sameSite: "lax" });
  return res;
}
