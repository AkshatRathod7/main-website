import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { SectorKey } from "@/content/sectors";

/**
 * One fine-line motif per industry, each drawn as growth (styles/living.css, .sa):
 *   education   century rings: a dial of ten decades around an open book, 1928 → 2028
 *   realestate  a coastline skyline rising floor by floor over the sea (Diu, Daman)
 *   wellness    a breath that becomes a pulse that becomes a rising line
 *   creators    a phone, a voice, and an audience arriving along an arc
 *   finance     compounding: coin stacks 1·2·3·5·8 under a curve that bends upward
 *   tech        a network wiring itself around one bright node
 *   events      open water: waves, a buoy, a swimmer's line toward the sun
 *   consumer    a grain that sprouts, leafs, and buds
 * `play` starts the drawing; the loops (breath, waves, windows) then keep going.
 * Colours: currentColor for the line, --sa-acc for the accent.
 */
const d = (s: number): CSSProperties => ({ ["--d" as string]: `${s}s` });

function Draw({ path, delay = 0, acc, dash, w = 1.5 }: { path: string; delay?: number; acc?: boolean; dash?: boolean; w?: number }) {
  return (
    <path
      d={path}
      pathLength={1}
      className={cn("d", acc && "acc", dash && "dash")}
      style={d(delay)}
      fill="none"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

const arc = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;
const wave = (y: number, amp: number) => {
  let p = `M-160 ${y}`;
  for (let x = -160; x < 480; x += 40) p += ` q10 ${-amp} 20 0 t20 0`;
  return p;
};

const MOTIFS: Record<SectorKey, () => ReactNode> = {
  education: () => {
    const rings = [34, 58, 82, 106, 130];
    return (
      <>
        {rings.map((r, i) => (
          <Draw key={r} path={arc(160, 214, r)} delay={0.1 + i * 0.16} w={i === rings.length - 1 ? 1.75 : 1.25} />
        ))}
        <Draw path={arc(160, 214, 150)} delay={1} acc w={2} />
        {Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI - (i / 10) * Math.PI;
          const x1 = 160 + Math.cos(a) * 150, y1 = 214 - Math.sin(a) * 150;
          const x2 = 160 + Math.cos(a) * 160, y2 = 214 - Math.sin(a) * 160;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="fade" style={d(1.1 + i * 0.07)} strokeWidth={i % 5 === 0 ? 2 : 1.25} strokeLinecap="round" />;
        })}
        <Draw path="M134 214 Q147 203 160 211 Q173 203 186 214" delay={0} w={1.75} />
        <Draw path="M160 211 V196" delay={0.2} w={1.25} />
        <text x="10" y="232" className="fade sa-t" style={d(1.2)}>1928</text>
        <text x="282" y="232" className="fade sa-t" style={d(1.9)}>2028</text>
      </>
    );
  },
  realestate: () => {
    const hs = [58, 92, 128, 76, 150, 104, 66];
    return (
      <>
        <circle cx="268" cy="44" r="15" className="pop acc-fill" style={d(1.4)} />
        <Draw path="M8 196 H312" delay={0} w={1.25} />
        {hs.map((h, i) => {
          const x = 36 + i * 36;
          const tall = h === 150;
          return (
            <g key={i}>
              <rect x={x} y={196 - h} width="26" height={h} rx="2" className={cn("rise", tall && "acc")} style={d(0.15 + i * 0.12)} fill="none" strokeWidth={tall ? 1.75 : 1.25} />
              {Array.from({ length: Math.floor(h / 22) }, (_, k) => (
                <rect key={k} x={x + 6 + (k % 2) * 10} y={196 - h + 9 + Math.floor(k / 2) * 0 + k * 18} width="4" height="5" rx="1" className="win" style={d(1.2 + ((i * 3 + k) % 7) * 0.45)} />
              ))}
              {tall && <Draw path={`M${x + 13} ${196 - h} V${196 - h - 18}`} delay={1.2} acc w={1.5} />}
            </g>
          );
        })}
        <path d={wave(212, 4)} className="wave" fill="none" strokeWidth="1.25" strokeLinecap="round" />
        <path d={wave(226, 3)} className="wave wave-2" fill="none" strokeWidth="1" strokeLinecap="round" opacity=".6" />
      </>
    );
  },
  wellness: () => (
    <>
      <circle cx="160" cy="112" r="74" className="breathe" fill="none" strokeWidth="1.25" />
      <circle cx="160" cy="112" r="46" className="breathe breathe-2" fill="none" strokeWidth="1" opacity=".55" />
      <Draw path="M8 150 H92 L104 150 L114 118 L126 186 L140 92 L152 150 H186 C226 150 258 112 312 34" delay={0.2} acc w={2} />
      <circle cx="312" cy="34" r="5" className="pop acc-fill pulse" style={d(1.6)} />
    </>
  ),
  creators: () => (
    <>
      <rect x="108" y="26" width="96" height="182" rx="16" className="rise" style={d(0)} fill="none" strokeWidth="1.5" />
      <Draw path="M146 96 L176 116 L146 136 Z" delay={0.5} acc w={1.75} />
      <rect x="18" y="58" width="74" height="42" rx="12" className="pop" style={d(0.8)} fill="none" strokeWidth="1.25" />
      <Draw path="M32 74 H76 M32 86 H62" delay={1} w={1.25} />
      <Draw path="M212 180 C250 160 280 110 300 30" delay={0.9} dash w={1.25} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = i / 5;
        const x = 212 + (300 - 212) * t ** 0.9, y = 180 - 150 * t ** 1.4;
        return <circle key={i} cx={x} cy={y} r={2 + i * 0.7} className="pop acc-fill" style={d(1.1 + i * 0.14)} />;
      })}
    </>
  ),
  finance: () => {
    const stacks = [1, 2, 3, 5, 8];
    return (
      <>
        {[60, 100, 140, 180].map((y, i) => (
          <line key={y} x1="10" x2="310" y1={y} y2={y} className="fade grid" style={d(i * 0.05)} strokeWidth="1" />
        ))}
        {stacks.map((n, i) => (
          <g key={i}>
            {Array.from({ length: n }, (_, k) => (
              <ellipse key={k} cx={46 + i * 56} cy={206 - k * 9} rx="16" ry="4.5" className="pop" style={d(0.2 + i * 0.18 + k * 0.05)} fill="none" strokeWidth="1.25" />
            ))}
          </g>
        ))}
        <Draw path="M14 200 C110 196 180 176 222 124 S286 34 306 16" delay={0.6} acc w={2} />
      </>
    );
  },
  tech: () => {
    const n: [number, number][] = [[52, 64], [150, 34], [258, 62], [86, 156], [190, 128], [282, 172], [148, 206], [30, 214]];
    const e: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [2, 4], [4, 5], [4, 6], [3, 6], [6, 7], [5, 6]];
    return (
      <>
        {e.map(([a, b], i) => (
          <Draw key={i} path={`M${n[a][0]} ${n[a][1]} L${n[b][0]} ${n[b][1]}`} delay={0.1 + i * 0.09} w={i % 3 === 0 ? 1.5 : 1.1} acc={b === 4 || a === 4} />
        ))}
        {n.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 4 ? 9 : 5} className={cn("pop", i === 4 ? "acc-fill pulse" : "dot")} style={d(0.3 + i * 0.1)} />
        ))}
      </>
    );
  },
  events: () => (
    <>
      <circle cx="252" cy="58" r="24" className="pop acc-ring" style={d(0.2)} fill="none" strokeWidth="1.75" />
      <Draw path="M30 186 C110 150 190 120 252 92" delay={0.6} dash acc w={1.5} />
      <circle r="4.5" className="swimmer acc-fill" style={{ offsetPath: "path('M30 186 C110 150 190 120 252 92')" } as CSSProperties} />
      <g className="bob">
        <circle cx="92" cy="152" r="7" className="pop" style={d(0.4)} fill="none" strokeWidth="1.5" />
        <Draw path="M92 145 V128" delay={0.6} w={1.25} />
      </g>
      <path d={wave(170, 5)} className="wave" fill="none" strokeWidth="1.25" strokeLinecap="round" />
      <path d={wave(190, 4)} className="wave wave-2" fill="none" strokeWidth="1.1" strokeLinecap="round" opacity=".7" />
      <path d={wave(210, 3)} className="wave wave-3" fill="none" strokeWidth="1" strokeLinecap="round" opacity=".45" />
    </>
  ),
  consumer: () => (
    <>
      <Draw path="M40 204 H280" delay={0} w={1.25} />
      <Draw path="M70 214 H110 M150 216 H200 M228 213 H262" delay={0.15} w={1} />
      <ellipse cx="160" cy="203" rx="13" ry="7" className="pop" style={d(0.2)} fill="none" strokeWidth="1.5" />
      <Draw path="M160 198 C160 162 157 132 162 86" delay={0.5} acc w={2} />
      <Draw path="M160 156 C130 148 114 128 110 104 C134 108 152 126 160 156 Z" delay={1} w={1.5} />
      <Draw path="M161 124 C190 116 206 96 210 72 C186 78 168 96 161 124 Z" delay={1.25} w={1.5} />
      <circle cx="162" cy="82" r="6" className="pop acc-fill" style={d(1.6)} />
    </>
  ),
};

export function SectorArt({ sector, play = true, className }: { sector: SectorKey; play?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={cn("sa", className)} data-play={play ? "" : undefined} data-sector={sector} aria-hidden="true" focusable="false">
      <g stroke="currentColor" fill="currentColor">{MOTIFS[sector]()}</g>
    </svg>
  );
}
