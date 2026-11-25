import { redirect } from "next/navigation";
import { LogoMark } from "@/components/site/logo";
import { adminStatus, isAdmin, MIN_PASSWORD_LENGTH } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const MESSAGES: Record<string, { text: string; tone: "error" | "info" }> = {
  bad: { text: "That password wasn't right. Please try again.", tone: "error" },
  rate: { text: "Too many tries. Please wait 15 minutes, then try again.", tone: "error" },
  off: { text: "The editor isn't set up yet. See the steps below.", tone: "error" },
  out: { text: "You're signed out.", tone: "info" },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { e } = await searchParams;
  const status = adminStatus();
  const message = e ? MESSAGES[e] : undefined;
  return (
    <main id="main" className="container-page flex min-h-dvh items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center gap-4">
          <LogoMark className="h-14" />
          <h1 className="font-display text-4xl leading-none">Site editor</h1>
        </div>

        {status !== "ready" ? (
          <div role="alert" className="mb-6 border-l-4 border-danger bg-paper p-5">
            <p className="font-semibold text-danger">{status === "missing" ? "The editor password isn't set." : `The editor password is too short (use at least ${MIN_PASSWORD_LENGTH} characters).`}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>In Vercel, open this project, then Settings, then Environment Variables.</li>
              <li>Add <code className="bg-limestone px-1">ADMIN_PASSWORD</code> with a long password only you know (at least {MIN_PASSWORD_LENGTH} characters).</li>
              <li>Redeploy the project, then come back here.</li>
            </ol>
          </div>
        ) : null}

        {message && status === "ready" ? (
          <p role={message.tone === "error" ? "alert" : "status"} className={`mb-6 border-l-4 bg-paper p-4 font-semibold ${message.tone === "error" ? "border-danger text-danger" : "border-ink-900"}`}>
            {message.text}
          </p>
        ) : null}

        <form method="post" action="/api/admin/login" className="sheet space-y-6 p-6 sm:p-8">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[0.9375rem] font-semibold text-ink-900">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              maxLength={256}
              disabled={status !== "ready"}
              className="block min-h-12 w-full rounded-[2px] border border-field bg-paper px-4 text-base text-text focus-visible:border-ink-900 disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={status !== "ready"}
            className="inline-flex min-h-14 w-full items-center justify-center bg-ink-900 px-8 font-semibold text-paper shadow-[inset_0_-3px_0_var(--color-brass-400)] hover:bg-ink-700 disabled:opacity-60"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">This page is private and isn&rsquo;t listed in search engines.</p>
      </div>
    </main>
  );
}
