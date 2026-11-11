/**
 * Local save of progress. Per-browser convenience only: if storage is blocked
 * (private mode, strict settings) the check still works, it just won't resume.
 */
import type { Answers } from "./scoring";
import type { LeadInput } from "./schema";

const KEY = "dsv.health-check.v2"; // v2: re-voiced question bank (new ids)
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // forget after 30 days

export type Stage = "intro" | "questions" | "lead" | "results";

export type SavedState = {
  v: 1;
  stage: Stage;
  index: number;
  answers: Answers;
  lead: Partial<LeadInput>;
  startedAt?: string;
  completedAt?: string;
  savedAt: number;
};

export function loadState(): SavedState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SavedState;
    if (s?.v !== 1 || Date.now() - s.savedAt > MAX_AGE_MS) return null;
    return s;
  } catch {
    return null;
  }
}

export function saveState(s: Omit<SavedState, "v" | "savedAt">) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...s, v: 1, savedAt: Date.now() }));
  } catch {
    /* storage unavailable: ignore */
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
