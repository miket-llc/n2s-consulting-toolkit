import type { Metadata, Viewport } from "next";
import "./styles/v2.css";

export const metadata: Metadata = {
  title: "Ellucian · Consulting Toolkit",
  description:
    "Internal toolkit for Ellucian consultants running ERP migration and modernization engagements.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-light" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
