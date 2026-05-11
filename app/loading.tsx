// Loading skeleton for the static prerender / first navigation. Quiet on
// purpose — the actual SPA boots fast under Turbopack and this rarely shows.

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: "var(--bg-page)",
        color: "var(--text-ghost)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <span>Loading toolkit…</span>
    </div>
  );
}
