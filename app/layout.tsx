import type { Metadata, Viewport } from "next";
import { Playfair_Display, Roboto_Slab, Oswald, Archivo_Black } from "next/font/google";
import "./styles/v2.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const archivoblack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ellucian · Consulting Toolkit",
  description:
    "Internal toolkit for Ellucian consultants running ERP migration and modernization engagements.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Inline pre-paint script: reads v2.theme from localStorage and flips the
// theme class on <html> to theme-dark BEFORE React hydrates if the user's
// stored preference is dark. SSR baseline is theme-light so the rendered
// HTML always carries it (smoke gate relies on this); the script only does
// extra work for dark-mode users, preventing the light→dark flash.
const themePrePaintScript = `(function(){try{if(localStorage.getItem('v2.theme')==='dark'){var r=document.documentElement;r.classList.remove('theme-light');r.classList.add('theme-dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`theme-light ${playfair.variable} ${robotoSlab.variable} ${oswald.variable} ${archivoblack.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themePrePaintScript }}/>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
