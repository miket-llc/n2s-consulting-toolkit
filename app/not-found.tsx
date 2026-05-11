// Static 404 fallback. The v2 surface is a single SPA at "/" with hash
// routing; this page is only reached if someone hits an unknown server path.

export default function NotFound() {
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
          maxWidth: 480,
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
            color: "var(--text-ghost)",
          }}
        >
          404 · not found
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
          That path is not part of the toolkit
        </h1>
        <p style={{ margin: 0, lineHeight: 1.5, color: "var(--text-secondary)" }}>
          The toolkit is a single-page app — every route lives behind <code>/#</code>.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            border: 0,
            borderRadius: 6,
            background: "var(--accent)",
            color: "#fff",
            textDecoration: "none",
            marginTop: 6,
            width: "fit-content",
          }}
        >
          Back to portfolio
        </a>
      </div>
    </div>
  );
}
