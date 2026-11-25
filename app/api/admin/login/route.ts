import { NextResponse } from "next/server";
import { createSessionToken, isSameOrigin, passwordMatches, sessionCookie, adminStatus } from "@/lib/admin/auth";
import { checkLoginRate } from "@/lib/admin/login-limit";
import { clientIp } from "@/lib/forms/runtime";

export const dynamic = "force-dynamic";

/** Redirect with 303 so the browser turns the POST into a GET. Relative Location works behind any proxy. */
function go(path: string, extra?: (res: NextResponse) => void) {
  const res = new NextResponse(null, { status: 303, headers: { Location: path, "Cache-Control": "no-store" } });
  extra?.(res);
  return res;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new NextResponse("Forbidden", { status: 403 });

  if (adminStatus() !== "ready") return go("/admin/login?e=off");

  const rate = await checkLoginRate(clientIp(request.headers));
  if (!rate.ok) return go("/admin/login?e=rate");

  let password = "";
  try {
    const form = await request.formData();
    const value = form.get("password");
    if (typeof value === "string") password = value.slice(0, 256);
  } catch {
    return go("/admin/login?e=bad");
  }

  if (!passwordMatches(password)) {
    // A short pause makes scripted guessing slower without hurting a person who mistyped.
    await new Promise((r) => setTimeout(r, 400));
    return go("/admin/login?e=bad");
  }

  return go("/admin", (res) => res.cookies.set(sessionCookie(createSessionToken(), request.headers.get("host"))));
}
