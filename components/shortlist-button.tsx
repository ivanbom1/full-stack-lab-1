"use client"; // State and a click handler: this component must run in the browser

import { useState } from "react";

// A Client Component inside a prerendered page. Only this file is sent to
// the browser as JavaScript; the rest of the movie page is plain HTML.
// Its prop is a string: props from the server must be serializable.
export function ShortlistButton({ movieTitle }: { movieTitle: string }) {
  const [shortlisted, setShortlisted] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={shortlisted}
      onClick={() => setShortlisted(!shortlisted)}
      className="mt-6 rounded border px-4 py-2 font-semibold aria-pressed:bg-zinc-900 aria-pressed:text-white dark:aria-pressed:bg-zinc-100 dark:aria-pressed:text-zinc-900"
    >
      {/* The label stays the same: aria-pressed tells screen readers the state */}
      Shortlist<span className="sr-only"> {movieTitle}</span>
      {shortlisted && <span aria-hidden="true"> ✓</span>}
    </button>
  );
}