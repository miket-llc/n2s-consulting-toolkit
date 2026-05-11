"use client";

// Top-level error boundary for the v2 SPA. A single render exception
// elsewhere in the tree lands here instead of blanking the page mid-demo.

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[toolkit] render error", error);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: "var(--bg-page)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          background: "var(--bg-panel)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--rose)",
          }}
        >
          Toolkit · render error
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
          Something went wrong on this view
        </h1>
        <p style={{ margin: 0, lineHeight: 1.5, color: "var(--text-secondary)" }}>
          The toolkit hit an unexpected error rendering this page. Your other
          work is untouched. Try the page again, or jump back to the portfolio.
        </p>
        {error?.digest && (
          <code
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-ghost)",
              background: "var(--bg-elevated)",
              padding: "6px 8px",
              borderRadius: 6,
              wordBreak: "break-all",
            }}
          >
            ref: {error.digest}
          </code>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              appearance: "none",
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
              border: 0,
              borderRadius: 6,
              background: "var(--accent)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a
            href="#/"
            onClick={() => {
              if (typeof window !== "undefined") window.location.hash = "";
            }}
            style={{
              appearance: "none",
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
