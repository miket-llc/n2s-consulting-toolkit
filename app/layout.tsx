import type { Metadata, Viewport } from "next";
import "./styles/styles.css";

export const metadata: Metadata = {
  title: "Ellucian · Consulting Toolkit",
  description:
    "Internal toolkit for Ellucian consultants running ERP migration and modernization engagements.",
};

export const viewport: Viewport = {
  width: 1440,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"/>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
