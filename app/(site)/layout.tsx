import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";

/**
 * Marketing shell: one nav, one <main id="main"> (skip-link target), one footer.
 * /health-check sits outside this group and renders its own instrument chrome (Stage 07, D-8).
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
