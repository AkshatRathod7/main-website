import { cn } from "@/lib/cn";

/**
 * Brand elements from the DreamSVin Brand Book (page 6): rounded line icons stroked with a coral → gold gradient.
 * Redrawn as SVG so they stay crisp and themeable. <BrandDefs /> is rendered once in the root layout and holds
 * the shared gradient; every icon references it with url(#dsv-grad).
 */
export function BrandDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <linearGradient id="dsv-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF705C" />
          <stop offset="1" stopColor="#EFBC6F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export type BrandIconName = "grid" | "eye" | "play" | "chat" | "connect" | "loop" | "flower" | "stack" | "spark";

const paths: Record<BrandIconName, React.ReactNode> = {
  grid: (
    <>
      <rect x="5" y="5" width="10" height="10" rx="3" />
      <rect x="17" y="5" width="10" height="10" rx="3" />
      <rect x="5" y="17" width="10" height="10" rx="3" />
      <rect x="17" y="17" width="10" height="10" rx="3" />
    </>
  ),
  eye: (
    <>
      <path d="M3 16c3.5-6 8-9 13-9s9.5 3 13 9c-3.5 6-8 9-13 9S6.5 22 3 16Z" />
      <circle cx="16" cy="16" r="4.5" />
    </>
  ),
  play: <path d="M10 6.5v19c0 1 1.1 1.6 1.9 1l14-9.5c.7-.5.7-1.5 0-2l-14-9.5c-.8-.6-1.9 0-1.9 1Z" />,
  chat: (
    <>
      <path d="M5 7.5c0-1.4 1.1-2.5 2.5-2.5h11c1.4 0 2.5 1.1 2.5 2.5v6c0 1.4-1.1 2.5-2.5 2.5H11l-4 3.5V16h0.5" />
      <path d="M21 11h3.5c1.4 0 2.5 1.1 2.5 2.5v6c0 1.4-1.1 2.5-2.5 2.5H24v3.5L20 22h-5.5c-1.4 0-2.5-1.1-2.5-2.5V19" />
    </>
  ),
  connect: (
    <>
      <circle cx="8" cy="24" r="3" />
      <circle cx="24" cy="8" r="3" />
      <circle cx="25" cy="22" r="3" />
      <path d="M10.3 22 21.7 10M11 24h10.5l1.2-.5" />
    </>
  ),
  loop: (
    <>
      <path d="M16 4a12 12 0 0 1 11.5 8.5" />
      <path d="M28 18a12 12 0 0 1-8.5 9.5" />
      <path d="M13 27.6A12 12 0 0 1 4.3 19" />
      <path d="M4.5 12.5A12 12 0 0 1 10 5.6" />
    </>
  ),
  flower: (
    <>
      <path d="M16 16c-1-5-6-9-9-6s1 8 9 6Z" />
      <path d="M16 16c5-1 9-6 6-9s-8 1-6 9Z" />
      <path d="M16 16c1 5 6 9 9 6s-1-8-9-6Z" />
      <path d="M16 16c-5 1-9 6-6 9s8-1 6-9Z" />
    </>
  ),
  stack: (
    <>
      <rect x="10" y="4" width="17" height="17" rx="3" />
      <path d="M7 8v15c0 1.7 1.3 3 3 3h15" />
      <path d="M4 11v15c0 1.7 1.3 3 3 3h15" opacity=".55" />
    </>
  ),
  spark: (
    <>
      <path d="M16 5v6M16 21v6M5 16h6M21 16h6" />
      <path d="M8.5 8.5l3.5 3.5M20 20l3.5 3.5M23.5 8.5 20 12M12 20l-3.5 3.5" opacity=".6" />
    </>
  ),
};

export function BrandIcon({ name, size = 40, className }: { name: BrandIconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="url(#dsv-grad)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {paths[name]}
    </svg>
  );
}
