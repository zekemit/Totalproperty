"use client";

import { createContext, useContext } from "react";
import type { FullCmsDoc } from "@/lib/cms/schema";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Read a value at a dotted path such as "services.2.title". */
export function getIn(obj: unknown, path: string): any {
  let cur: any = obj;
  for (const key of path.split(".")) {
    if (cur == null) return undefined;
    cur = cur[key];
  }
  return cur;
}

/** Immutable set at a dotted path; numeric segments index arrays. */
export function setIn<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const walk = (node: any, i: number): any => {
    const key = keys[i] as string;
    const isLast = i === keys.length - 1;
    const copy = Array.isArray(node) ? [...node] : { ...(node ?? {}) };
    copy[Array.isArray(copy) ? Number(key) : key] = isLast ? value : walk(node?.[key], i + 1);
    return copy;
  };
  return walk(obj, 0);
}

export type DocContext = {
  doc: FullCmsDoc;
  /** The standard content, for placeholders and "reset" buttons. */
  defaults: FullCmsDoc;
  /** Validation messages from the last failed save, keyed by dotted path. */
  errors: Record<string, string>;
  /** False when no database is connected: fields still work, saving is disabled. */
  set: (path: string, value: unknown) => void;
  /** Replace the value at `path` using a function of the old value. */
  update: (path: string, fn: (old: any) => any) => void;
};

export const DocCtx = createContext<DocContext | null>(null);

export function useDoc(): DocContext {
  const ctx = useContext(DocCtx);
  if (!ctx) throw new Error("useDoc must be used inside <DocCtx.Provider>");
  return ctx;
}

export const newId = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 8)}`;
