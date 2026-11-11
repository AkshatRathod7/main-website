// Home. Copy: DreamSVin Website Copy (24 Oct 2026), Homepage, block by block.
// Order: hero → logos → results → stages → services → growth engine → 90-day sprint → work by industry
//        → about (why us, founder, team) → insights and questions → final call. Chapters marked `fit` fill the screen.
import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Headline } from "@/components/ui/headline";
import { HeroBlueprint } from "@/components/brand/blueprint";
import { HeroProof } from "@/components/brand/living";
import { Sprint } from "@/components/brand/sprint";
import { SpyMark, SpyRail } from "@/components/brand/spy";
import { HomeResults } from "@/components/home/results";
import { HomeStageStack } from "@/components/home/stage-stack";
import { HomeServicesIndex } from "@/components/home/services";
import { OurWork } from "@/components/brand/sector-index";
import { GrowthEngine } from "@/components/home/growth-engine";
import { getAllInsights } from "@/lib/insights";
import { Head, TrustStrip, quotesFrom } from "@/components/brand/sections";
import { FINAL_CTA, HERO, HOW_TEASER, PRIMARY_CTA } from "@/content/site";
import { CASES } from "@/content/cases";
import { JsonLd, homeGraph } from "@/lib/seo";
import { FAQ_SCHEMA } from "@/components/home/faq-schema";
import { HomeAbout } from "@/components/home/about";
import { HomeInsightsFaq } from "@/components/home/insights-faq";
import { FinalCall } from "@/components/home/final-call";

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
      <HomeResults quotes={quotesFrom(CASES)} />

      {/* What we do: the stages (a pinned deck on desktop), the five ways in, and the engine that drives growth */}
      <SpyMark label="What we do" id="what-we-do" nav />
      <HomeStageStack />
      <SpyMark label="Services" fit />
      <HomeServicesIndex />
      <SpyMark label="Growth engine" fit />
      <GrowthEngine />

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
          <OurWork />
        </div>
      </section>

      {/* About: why us, told by the person you work with; her line, the four reasons and the team in one screen */}
      <SpyMark label="About" id="about" nav fit />
      <HomeAbout />

      {/* Insights and questions: the essays on the left, the questions people ask on the right */}
      <SpyMark label="Insights" id="insights" nav fit />
      <HomeInsightsFaq items={insights} />

      {/* the ask, and what happens after it */}
      <SpyMark label="Talk to us" fit />
      <FinalCall title={FINAL_CTA.home.title} copy={FINAL_CTA.home.copy} secondary={FINAL_CTA.home.secondary} />
      <SpyRail />
    </>
  );
}
