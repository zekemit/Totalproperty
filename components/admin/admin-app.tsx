"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveContent, type SaveResult } from "@/app/admin/(panel)/actions";
import type { StorageMode } from "@/lib/cms-storage";
import { normalizeDoc } from "@/lib/cms/normalize";
import type { FullCmsDoc } from "@/lib/cms/schema";
import { cn } from "@/lib/utils";
import { DocCtx, setIn, type DocContext } from "./doc";
import { AnnouncementTab, CareersTab, CompanyTab, HomeTab, ListingsTab, SeoTab, ServicesTab } from "./tabs";

const TABS = [
  { id: "announcement", label: "Announcement", short: "Announcement", Panel: AnnouncementTab, sections: ["announcement"] },
  { id: "home", label: "Homepage & hero", short: "Homepage", Panel: HomeTab, sections: ["home"] },
  { id: "services", label: "Services", short: "Services", Panel: ServicesTab, sections: ["services", "propertyTypes"] },
  { id: "listings", label: "Featured properties", short: "Properties", Panel: ListingsTab, sections: ["listings"] },
  { id: "company", label: "Company, reviews & portals", short: "Company", Panel: CompanyTab, sections: ["company"] },
  { id: "seo", label: "SEO & page titles", short: "SEO", Panel: SeoTab, sections: ["seo"] },
  { id: "careers", label: "Careers", short: "Careers", Panel: CareersTab, sections: ["careers"] },
] as const;

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

const tabOfPath = (path: string) => TABS.find((t) => (t.sections as readonly string[]).includes(path.split(".")[0] ?? ""));

export function AdminApp({ initial, defaults, rev: initialRev, mode }: { initial: FullCmsDoc; defaults: FullCmsDoc; rev: number; mode: StorageMode }) {
  const [doc, setDoc] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(normalizeDoc(initial)));
  const [rev, setRev] = useState(initialRev);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [issues, setIssues] = useState<{ path: string; message: string }[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("announcement");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const readonly = mode === "readonly";

  const dirty = useMemo(() => JSON.stringify(normalizeDoc(doc)) !== saved, [doc, saved]);

  const ctx = useMemo<DocContext>(
    () => ({
      doc,
      defaults,
      errors,
      set: (path, value) => {
        setDoc((d) => setIn(d, path, value));
        setErrors((e) => {
          if (!(path in e)) return e;
          const { [path]: _gone, ...rest } = e;
          void _gone;
          return rest;
        });
        setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s));
      },
      update: (path, fn) => {
        setDoc((d) => {
          const keys = path.split(".");
          let cur: unknown = d;
          for (const k of keys) cur = (cur as Record<string, unknown>)?.[k];
          return setIn(d, path, fn(cur));
        });
        setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s));
      },
    }),
    [doc, defaults, errors],
  );

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const save = useCallback(async () => {
    setStatus({ kind: "saving" });
    setErrors({});
    setIssues([]);
    let result: SaveResult;
    try {
      result = await saveContent({ rev, doc: normalizeDoc(doc) });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
      return;
    }
    if (result.ok) {
      setDoc(result.doc);
      setSaved(JSON.stringify(normalizeDoc(result.doc)));
      setRev(result.rev);
      setStatus({ kind: "saved", message: "Saved. Your changes are live; refresh the site to see them." });
      return;
    }
    if (result.issues) {
      setErrors(Object.fromEntries(result.issues.map((i) => [i.path, i.message])));
      setIssues(result.issues);
      const first = result.issues[0] && tabOfPath(result.issues[0].path);
      if (first) setActive(first.id);
    }
    setStatus({ kind: "error", message: result.message });
  }, [doc, rev]);

  function discard() {
    if (!window.confirm("Throw away your unsaved changes?")) return;
    setDoc(JSON.parse(saved) as FullCmsDoc);
    setErrors({});
    setIssues([]);
    setStatus({ kind: "idle" });
  }

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const i = TABS.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next >= 0) {
      e.preventDefault();
      const t = TABS[next] as (typeof TABS)[number];
      setActive(t.id);
      tabRefs.current[t.id]?.focus();
    }
  }

  const ActivePanel = (TABS.find((t) => t.id === active) ?? TABS[0]).Panel;

  return (
    <DocCtx.Provider value={ctx}>
      <div className="container-page pb-40 pt-8">
        {readonly ? (
          <div role="alert" className="mb-6 flex gap-3 border-l-4 border-danger bg-paper p-5">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-danger" />
            <div>
              <p className="font-semibold text-danger">Saving is switched off: no database is connected yet.</p>
              <p className="mt-1">
                You can look around, but changes can&rsquo;t be kept. To turn saving on, connect <strong>Upstash Redis</strong> to this project in Vercel (Storage tab, then Create Database, then Upstash Redis) and redeploy. The steps are in the README under &ldquo;Connect Upstash&rdquo;.
              </p>
            </div>
          </div>
        ) : null}

        {issues.length > 0 ? (
          <div role="alert" tabIndex={-1} className="mb-6 border-l-4 border-danger bg-paper p-5">
            <p className="font-semibold text-danger">Please fix these before saving:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {issues.slice(0, 8).map((i) => {
                const tab = tabOfPath(i.path);
                return (
                  <li key={i.path}>
                    {tab ? (
                      <button type="button" className="font-semibold underline" onClick={() => tab && setActive(tab.id)}>
                        {tab.short}
                      </button>
                    ) : null}
                    : {i.message}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div role="tablist" aria-label="Sections of the site" onKeyDown={onTabKey} className="flex gap-1 overflow-x-auto border-b border-ink-900/30">
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                "min-h-12 shrink-0 border border-b-0 px-4 text-[0.9375rem] font-semibold transition-colors",
                active === t.id ? "border-ink-900 bg-paper text-ink-900" : "border-transparent text-muted hover:text-ink-900",
              )}
            >
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.short}</span>
            </button>
          ))}
        </div>

        <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} tabIndex={0} className="border border-t-0 border-ink-900/30 bg-paper p-5 sm:p-8">
          <ActivePanel />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-900 bg-limestone shadow-[0_-12px_30px_-20px_rgb(11_17_26/0.5)]">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <p aria-live="polite" role="status" className="flex min-h-11 items-center gap-2 text-[0.9375rem]">
            {status.kind === "saving" ? (
              "Saving…"
            ) : status.kind === "saved" ? (
              <>
                <CheckCircle2 aria-hidden="true" className="size-5 text-success" />
                <span className="font-semibold text-success">{status.message}</span>
                <a href="/" target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-1 font-semibold">
                  View the site<ExternalLink aria-hidden="true" className="size-4" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </>
            ) : status.kind === "error" ? (
              <span className="font-semibold text-danger">{status.message}</span>
            ) : dirty ? (
              <span className="font-semibold">You have unsaved changes.</span>
            ) : (
              <span className="text-muted">All changes are saved.</span>
            )}
          </p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={discard} disabled={!dirty || status.kind === "saving"}>
              Discard changes
            </Button>
            <Button type="button" variant="primary" size="md" onClick={save} disabled={!dirty || status.kind === "saving" || readonly} aria-disabled={!dirty || status.kind === "saving" || readonly}>
              {status.kind === "saving" ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </DocCtx.Provider>
  );
}
