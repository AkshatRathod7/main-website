// About DreamSVin and the founder. Copy: content/about.ts. This replaces the old /about → /#about redirect,
// so the founder has a page of her own for search engines and assistants to cite.
import Image from "next/image";
import Link from "next/link";
import { JsonLd, ORG_DESCRIPTION, breadcrumbNode, graph, organizationNode, pageMetadata, personNode, personRef, SITE } from "@/lib/seo";
import { FOUNDER_SOCIAL, SOCIAL } from "@/lib/site";
import { Headline } from "@/components/ui/headline";
import { FinalCta, Head, Kicker } from "@/components/brand/sections";
import { ABOUT_PAGE as A } from "@/content/about";
import { ABOUT, CCC, SPRINT, STAGES } from "@/content/site";

export const metadata = pageMetadata({ title: A.seoTitle, description: A.seoDescription, path: "/about" });

const linkCls =
  "inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-semibold text-fg underline decoration-line-strong underline-offset-[0.22em] hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export default function AboutPage() {
  const photo = ABOUT.founder.photo;
  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "AboutPage",
            "@id": `${SITE}/about#page`,
            url: `${SITE}/about`,
            name: A.seoTitle,
            description: ORG_DESCRIPTION,
            mainEntity: { "@id": `${SITE}/#organization` },
            about: personRef,
          },
          organizationNode(),
          personNode(),
          breadcrumbNode([{ name: "About", path: "/about" }]),
        )}
      />

      <section aria-labelledby="page-h" className="hero pb-section-sm pt-[calc(var(--nav-height)+clamp(3rem,8vw,7rem))]">
        <div className="container-ds grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Kicker>{A.kicker}</Kicker>
            <Headline as="h1" id="page-h" size="display-lg" reveal="load" lines={[A.h1]} className="mt-6" />
          </div>
          <div className="grid gap-5 md:col-span-8">
            {A.intro.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-measure text-body-lg text-fg-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-h" data-tone="paper" className="py-section">
        <div className="container-ds grid gap-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={576}
              height={1024}
              sizes="(min-width: 768px) 30vw, 100vw"
              className="h-auto w-full rounded-[24px] object-cover"
            />
          </div>
          <div className="grid gap-6 md:col-span-7 md:col-start-6">
            <h2 id="founder-h" className="text-display-md">
              {A.founder.h2}
            </h2>
            <blockquote className="border-l-2 border-coral pl-6 font-display text-heading-lg font-bold">
              <p>
                &ldquo;{A.founder.quote[0]} {A.founder.quote[1]}&rdquo;
              </p>
            </blockquote>
            {A.founder.bio.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-measure text-body-lg text-fg-muted">
                {p}
              </p>
            ))}
            <ul className="grid gap-2">
              {A.founder.facts.map((f) => (
                <li key={f} className="flex gap-3 text-body-lg">
                  <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-coral" />
                  {f}
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-8">
              <li>
                <a href={FOUNDER_SOCIAL.linkedin} target="_blank" rel="noopener noreferrer me" className={linkCls} data-event="About Isha LinkedIn">
                  Isha on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={FOUNDER_SOCIAL.instagram} target="_blank" rel="noopener noreferrer me" className={linkCls} data-event="About Isha Instagram">
                  Isha on Instagram<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The model */}
      <section aria-labelledby="model-h" className="py-section">
        <div className="container-ds">
          <Head id="model-h" kicker={A.model.title} lines={["Foundation, Growth, Scale."]} intro={A.model.stagesIntro} />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STAGES.map((s) => (
              <li key={s.key} className="rounded-3xl bg-bg-raised p-6">
                <span className="label-mono text-accent-text">
                  {s.n} · {s.tag}
                </span>
                <h3 className="mt-4 text-heading-lg">{s.name}</h3>
                <p className="mt-3 text-body text-fg-muted">{s.summary}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-heading-lg">The 90-day Growth Sprint</h3>
              <p className="mt-3 max-w-measure text-body-lg text-fg-muted">{A.model.sprintIntro}</p>
              <ol className="mt-5 grid gap-2">
                {SPRINT.map((p) => (
                  <li key={p.title} className="text-body">
                    <b>{p.days}: {p.title}.</b> <span className="text-fg-muted">{p.short}</span>
                  </li>
                ))}
              </ol>
              <Link href="/90-day-growth-sprint" className={`${linkCls} mt-4`}>
                How the sprint works <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div>
              <h3 className="text-heading-lg">The CCC growth engine</h3>
              <p className="mt-3 max-w-measure text-body-lg text-fg-muted">{A.model.cccIntro}</p>
              <ul className="mt-5 grid gap-2">
                {CCC.parts.map((p) => (
                  <li key={p.k} className="text-body">
                    <b>{p.k}.</b> <span className="text-fg-muted">{p.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="where-h" className="py-section-sm">
        <div className="container-ds grid gap-8 md:grid-cols-12">
          <h2 id="where-h" className="text-display-md md:col-span-4">
            {A.where.title}
          </h2>
          <div className="grid gap-4 md:col-span-7 md:col-start-6">
            <p className="max-w-measure text-body-lg text-fg-muted">{A.where.copy}</p>
            <ul className="flex flex-wrap gap-x-8">
              <li><Link href="/business-growth-consultant-mumbai" className={linkCls}>Mumbai</Link></li>
              <li><Link href="/business-growth-consultant-pune" className={linkCls}>Pune</Link></li>
              <li><a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>DreamSVin on LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
              <li><a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>DreamSVin on Instagram<span className="sr-only"> (opens in a new tab)</span></a></li>
            </ul>
          </div>
        </div>
      </section>

      <FinalCta title="Let's build something worth growing." copy="Book a free consultation. We'll look at where you are and what a focused 90 days could change." />
    </>
  );
}
