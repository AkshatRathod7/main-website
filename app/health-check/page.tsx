import { JsonLd, breadcrumbNode, graph, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { HealthCheck } from "@/components/health-check/HealthCheck";

export const metadata: Metadata = pageMetadata({
    ownImage: true,
  title: "Business Health Check",
  description:
    "What's holding your business back? Fourteen questions, about three minutes: a score out of 100, your stage, and the first three moves we would make.",
  path: "/health-check",
});

export default function HealthCheckPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbNode([{ name: "Business Health Check", path: "/health-check" }]))} />
      <HealthCheck />
    </>
  );
}
