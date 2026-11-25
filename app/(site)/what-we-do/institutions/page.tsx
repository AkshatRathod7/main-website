// Copy lives in content/landing.ts; the template is components/pages/landing.tsx.
import { LandingPage, landingMetadata } from "@/components/pages/landing";

const PATH = "/what-we-do/institutions";

export const metadata = landingMetadata(PATH);

export default function Page() {
  return <LandingPage path={PATH} />;
}
