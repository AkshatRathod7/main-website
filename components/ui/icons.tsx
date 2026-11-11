import type { SVGProps } from "react";

/**
 * Thin-stroke icon set (1.25px on a 24 grid). Decorative by default (aria-hidden).
 * If an icon carries meaning on its own, pass `aria-label` and `role="img"`.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rest["aria-label"] ? undefined : true}
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </Base>
);
export const ArrowUpRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Base>
);
export const ChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
);
export const Check = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);
export const Close = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Base>
);
export const Alert = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.25v.01" />
  </Base>
);
export const Plus = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Base>
);

/** 1.25px ring spinner. Rotation is the one permitted spin (loading only). */
export const Spinner = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={["animate-spin [animation-duration:900ms] motion-reduce:animate-none", className].filter(Boolean).join(" ")}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
