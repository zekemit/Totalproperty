"use client";

import { useEffect } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const STORAGE_KEY = "tpm_attribution";

/**
 * Remembers the first-touch UTM parameters for this browser session so a visitor who
 * lands on /?utm_source=google and later submits the form on /owners is still
 * attributed correctly. Storage can be unavailable (private mode), so every access
 * is guarded and the site works identically without it.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      const params = new URLSearchParams(window.location.search);
      const found: Record<string, string> = {};
      for (const key of KEYS) {
        const value = params.get(key);
        if (value) found[key] = value.slice(0, 100);
      }
      if (Object.keys(found).length > 0) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {
      /* storage unavailable: attribution is optional */
    }
  }, []);
  return null;
}

/** Current attribution: stored first touch, else this page's own query string. */
export function readAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) Object.assign(out, JSON.parse(stored) as Record<string, string>);
  } catch {
    /* ignore */
  }
  const params = new URLSearchParams(window.location.search);
  for (const key of KEYS) {
    const value = params.get(key);
    if (value && !out[key]) out[key] = value.slice(0, 100);
  }
  return out;
}
