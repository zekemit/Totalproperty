"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIn, useDoc } from "./doc";

/**
 * An editable, reorderable list of cards. Reordering uses real buttons (keyboard and screen-reader
 * friendly); removing needs a second click so a stray click can't delete someone's work.
 */
export function ListEditor<T extends object>({
  path,
  noun,
  addLabel,
  make,
  titleOf,
  max,
  empty,
  children,
}: {
  path: string;
  noun: string;
  addLabel?: string;
  make: () => T;
  titleOf: (item: T) => string;
  max?: number;
  empty?: string;
  children: (basePath: string, index: number, item: T) => ReactNode;
}) {
  const { doc, update } = useDoc();
  const items = (getIn(doc, path) as T[] | undefined) ?? [];
  const [confirming, setConfirming] = useState<string | null>(null);

  const move = (from: number, to: number) =>
    update(path, (old: T[]) => {
      const next = [...old];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item as T);
      return next;
    });

  return (
    <div>
      {items.length === 0 ? <p className="border border-dashed border-[var(--hairline)] p-6 text-muted">{empty ?? `No ${noun}s yet.`}</p> : null}
      <ol className="space-y-5">
        {items.map((item, i) => {
          const name = titleOf(item).trim() || `${noun} ${i + 1}`;
          const key = (item as { id?: string }).id ?? String(i);
          return (
            <li key={key} className="border border-[var(--hairline)] bg-paper">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] bg-limestone px-4 py-2">
                <h4 className="font-sans font-semibold text-ink-900">
                  <span className="mr-2 tabular-nums text-brass-700">{i + 1}.</span>
                  {name}
                </h4>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${name} up`} className="inline-flex size-11 items-center justify-center border border-transparent hover:border-ink-900 disabled:opacity-30">
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${name} down`} className="inline-flex size-11 items-center justify-center border border-transparent hover:border-ink-900 disabled:opacity-30">
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </button>
                  {confirming === key ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          update(path, (old: T[]) => old.filter((_, j) => j !== i));
                          setConfirming(null);
                        }}
                        className="min-h-11 bg-danger px-3 text-sm font-semibold text-paper"
                      >
                        Yes, remove {name}
                      </button>
                      <button type="button" onClick={() => setConfirming(null)} className="min-h-11 px-3 text-sm font-semibold underline">
                        Keep it
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirming(key)} aria-label={`Remove ${name}`} className="inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-semibold text-danger hover:underline">
                      <Trash2 aria-hidden="true" className="size-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-5 p-4 sm:p-6">{children(`${path}.${i}`, i, item)}</div>
            </li>
          );
        })}
      </ol>
      {max === undefined || items.length < max ? (
        <Button type="button" variant="outline" className="mt-5" onClick={() => update(path, (old: T[]) => [...(old ?? []), make()])}>
          <Plus aria-hidden="true" />
          {addLabel ?? `Add ${noun}`}
        </Button>
      ) : (
        <p className="mt-4 text-sm text-muted">That&rsquo;s the most {noun}s you can add.</p>
      )}
    </div>
  );
}
