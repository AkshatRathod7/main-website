import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@/components/site/analytics";
import { BrandDefs } from "@/components/brand/icons";
import { DEFAULT_DESCRIPTION, SITE, SITE_NAME } from "@/lib/seo";
import "./globals.css";

/* Fonts. One family: Host Grotesk (Element Type, OFL, variable 300-800), for headings at a medium weight and
   body text at regular. Replaced Bricolage 800 + Inter on 7 Nov 2026: the designer read that pair as
   "AI-made". Self-hosted as Latin variable subsets, so the page makes no third-party font request. */
const host = localFont({
  src: [
    { path: "./fonts/HostGrotesk-Variable-latin.woff2", weight: "300 800", style: "normal" },
    { path: "./fonts/HostGrotesk-Italic-Variable-latin.woff2", weight: "300 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-host",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  preload: true, // headings and body share it, so it is the LCP font
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${SITE_NAME}: Your Business Architects. Your Growth Partners.`, template: `%s - ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  robots:
    process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F9F5EF", // the default (light) theme; the page does not follow the device setting
  colorScheme: "light dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="light" className={host.variable} suppressHydrationWarning>
      <head>
        {/* Theme before first paint: the saved choice, else light. No flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("dsv-theme");if(t!=="light"&&t!=="dark")t="light";document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <BrandDefs />
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
