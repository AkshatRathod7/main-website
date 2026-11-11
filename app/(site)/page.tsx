// Home. Copy: DreamSVin Website Copy (24 Oct 2026), Homepage, block by block.
// Order: hero → logos → results → stages → services → growth engine → 90-day sprint → work by industry
//        → why us → founder → team → insights → questions → final CTA. Chapters marked `fit` fill the screen.
import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/brand/motion";
import { HeroBlueprint } from "@/components/brand/blueprint";
import { HeroProof } from "@/components/brand/living";
import { Sprint } from "@/components/brand/sprint";
import { SpyMark, SpyRail } from "@/components/brand/spy";
import { HomeFaq, HomeInsights, HomeServices } from "@/components/home/merged";
import { CaseRow, SectorIndex } from "@/components/brand/sector-index";
import { getAllInsights } from "@/lib/insights";
import {
  CccSection,
  ExtendedTeam,
  FinalCta,
  FounderStrip,
  Head,
  Results,
  StageStack,
  TrustStrip,
  WhyGrid,
  quotesFrom,
} from "@/components/brand/sections";
import { FINAL_CTA, HERO, HOW_TEASER, PRIMARY_CTA, WHAT_TEASER } from "@/content/site";
import { CASES } from "@/content/cases";
import { JsonLd, homeGraph } from "@/lib/seo";
import { FAQ_SCHEMA } from "@/components/home/faq-schema";

export const metadata: Metadata = {
  title: { absolute: "DreamSVin: Your Business Architects. Your Growth Partners." },
  description: "We find what's holding your business back, build a 90-day plan, and help you execute it. Book a free consultation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DreamSVin: Your Business Architects. Your Growth Partners.",
    description: "We find what's holding your business back, build a 90-day plan, and help you execute it.",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

const [G0, G1] = HERO.lines[1].split("Growth");

export default async function HomePage() {
  const insights = (await getAllInsights()).filter((a) => !a.draft);
  return (
    <>
      <JsonLd data={homeGraph(FAQ_SCHEMA)} />

      {/* Hero */}
      <SpyMark label="Start" id="top" />
      <section aria-labelledby="hero-h" className="hero pb-section-sm pt-[calc(var(--nav-height)+clamp(2rem,5vw,4.5rem))]">
        <div className="container-ds">
          <Headline as="h1" id="hero-h" size="display-2xl" reveal="load" lines={[HERO.lines[0], <Fragment key="growth">{G0}<span className="hero-grad">Growth</span>{G1}</Fragment>]} className="hero-h1" />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="hero-sub max-w-[46ch] text-body-lg text-fg-muted">{HERO.sub}</p>
              <div className="hero-ctas mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={PRIMARY_CTA.href} size="lg" arrow data-event="Hero CTA">
                  {PRIMARY_CTA.label}
                </ButtonLink>
                <Link href={HERO.secondary.href} data-event="Hero See Work" className="group inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-body font-semibold text-fg hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                  {HERO.secondary.label}
                  <span aria-hidden="true" className="nudge">›</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <HeroProof />
            </div>
          </div>
          <div className="mt-12 md:mt-16">
            <HeroBlueprint />
          </div>
          <p className="mt-5 text-body-sm text-fg-subtle">{HERO.micro}</p>
        </div>
      </section>

      <TrustStrip />
      <SpyMark label="Results" fit />
      <Results quotes={quotesFrom(CASES)} />

      {/* What we do: the stages, the five ways in, and the engine that drives growth */}
      <SpyMark label="What we do" id="what-we-do" nav />
      <section aria-labelledby="what-h" className="py-section">
        <div className="container-ds">
          <Head id="what-h" kicker="What we do" index="02" lines={[WHAT_TEASER.title]} intro={WHAT_TEASER.intro} />
          <div className="mt-14">
            <StageStack />
          </div>
        </div>
      </section>
      <SpyMark label="Services" fit />
      <HomeServices />
      <SpyMark label="Growth engine" fit />
      <CccSection />

      {/* How we work: the pinned 90-day sprint */}
      <SpyMark label="How we work" id="how-we-work" nav />
      <Sprint title={HOW_TEASER.title} intro={HOW_TEASER.intro} />

      {/* Our work, by industry */}
      <SpyMark label="Our work" id="work" nav />
      <section aria-labelledby="work-h" className="py-section">
        <div className="container-ds">
          <Head
            id="work-h"
            kicker="Our work"
            index="03"
            lines={["Eight industries.", "One way of growing."]}
            intro="Pick an industry to see who we grew there, and what changed."
          />
          <div className="mt-14">
            <SectorIndex />
          </div>
          <CaseRow />
        </div>
      </section>

      {/* About: why us, who you work with, the team around her */}
      <SpyMark label="About" id="about" nav fit />
      <WhyGrid />
      <SpyMark label="Founder" fit />
      <FounderStrip />
      <SpyMark label="One team" fit />
      <ExtendedTeam />

      <SpyMark label="Insights" id="insights" nav fit />
      <HomeInsights items={insights} />

      {/* the questions people ask, last, just before the ask */}
      <SpyMark label="Questions" fit />
      <HomeFaq />

      <SpyMark label="Talk to us" fit />
      <FinalCta title={FINAL_CTA.home.title} copy={FINAL_CTA.home.copy} secondary={FINAL_CTA.home.secondary} />
      <SpyRail />
    </>
  );
}
