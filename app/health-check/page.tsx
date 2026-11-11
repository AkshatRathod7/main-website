import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { HealthCheck } from "@/components/health-check/HealthCheck";

export const metadata: Metadata = pageMetadata({
    ownImage: true,
  title: "Business Health Check",
  description:
    "What's holding your business back? Fourteen questions across foundation, growth, execution and scale. A score out of 100, your stage, and the first three moves we would make. About three minutes.",
  path: "/health-check",
});

export default function HealthCheckPage() {
  return <HealthCheck />;
}
