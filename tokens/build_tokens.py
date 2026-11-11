"""DreamSVin — Dark Precision. Single source of truth for colour + scale tokens.
Run:  python3 tokens/build_tokens.py
Writes: tokens/design-tokens.json, tokens/contrast-matrix.md
Change a value here, re-run, then mirror it in app/globals.css (the only other place values live).
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))


def lum(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    A, B = sorted((lum(a), lum(b)), reverse=True)
    return (A + 0.05) / (B + 0.05)


def grade(r):
    return 'text-safe' if r >= 4.5 else ('border-only' if r >= 3 else 'decorative')


PRIMITIVES = {
    # 60% — dark canvas, depth by tone
    'canvas': '#080808', 'surface-1': '#0E0E0F', 'surface-2': '#141416', 'surface-3': '#1C1C1F',
    # 30% — warm ivory
    'ivory': '#F2EFE8', 'ivory-muted': '#CFCBC2', 'ivory-subtle': '#9A968D', 'ivory-faint': '#5E5B55', 'white': '#FFFFFF',
    # 10% — champagne brass (jewellery)
    'brass': '#C8A96A', 'brass-hover': '#D6BA80', 'brass-press': '#B39558', 'brass-ink': '#0E0C08', 'brass-deep': '#7A5F2C',
    # Lines
    'line': '#232326', 'line-strong': '#3A3A3F', 'line-control': '#706D66',
    # Paper mode (editorial moments)
    'paper': '#F2EFE8', 'paper-2': '#E7E2D7', 'ink': '#0E0E0F', 'ink-muted': '#45423C', 'ink-subtle': '#625E56',
    'line-paper': '#D6D0C3', 'line-paper-strong': '#BDB6A7', 'line-paper-control': '#7D786D',
    # Status (kept desaturated; never decorative)
    'danger': '#E8907F', 'success': '#9CC2A0', 'danger-deep': '#A1392A', 'success-deep': '#3B6A44',
}

# Semantic roles. Components ONLY use these; data-tone="paper" swaps the whole set.
SEMANTIC = {
    'dark': {
        'bg': 'canvas', 'bg-raised': 'surface-1', 'bg-elevated': 'surface-2', 'bg-overlay': 'surface-3',
        'fg': 'ivory', 'fg-muted': 'ivory-muted', 'fg-subtle': 'ivory-subtle', 'fg-faint': 'ivory-faint', 'fg-emphasis': 'white',
        'accent': 'brass', 'accent-hover': 'brass-hover', 'accent-press': 'brass-press', 'on-accent': 'brass-ink',
        'accent-text': 'brass', 'line': 'line', 'line-strong': 'line-strong', 'line-control': 'line-control',
        'focus': 'brass', 'danger': 'danger', 'success': 'success',
    },
    'paper': {
        'bg': 'paper', 'bg-raised': 'paper-2', 'bg-elevated': 'paper', 'bg-overlay': 'paper-2',
        'fg': 'ink', 'fg-muted': 'ink-muted', 'fg-subtle': 'ink-subtle', 'fg-faint': 'line-paper-control', 'fg-emphasis': 'ink',
        'accent': 'brass', 'accent-hover': 'brass-hover', 'accent-press': 'brass-press', 'on-accent': 'brass-ink',
        'accent-text': 'brass-deep', 'line': 'line-paper', 'line-strong': 'line-paper-strong', 'line-control': 'line-paper-control',
        'focus': 'ink', 'danger': 'danger-deep', 'success': 'success-deep',
    },
}

DARK_BGS = ['canvas', 'surface-1', 'surface-2', 'surface-3']
PAPER_BGS = ['paper', 'paper-2']
DARK_FGS = ['ivory', 'ivory-muted', 'ivory-subtle', 'ivory-faint', 'white', 'brass', 'brass-hover', 'brass-deep',
            'danger', 'success', 'line', 'line-strong', 'line-control']
PAPER_FGS = ['ink', 'ink-muted', 'ink-subtle', 'brass-deep', 'brass', 'danger-deep', 'success-deep',
             'line-paper', 'line-paper-strong', 'line-paper-control']
FILLS = [('brass-ink', 'brass'), ('brass-ink', 'brass-hover'), ('brass-ink', 'brass-press'),
         ('ivory', 'brass-deep'), ('canvas', 'ivory'), ('ivory', 'ink'), ('brass', 'paper'), ('brass', 'ink')]


def pair(f, b):
    r = ratio(PRIMITIVES[f], PRIMITIVES[b])
    return {'fg': f, 'bg': b, 'ratio': round(r, 2), 'grade': grade(r)}


matrix = {
    'dark': [pair(f, b) for f in DARK_FGS for b in DARK_BGS],
    'paper': [pair(f, b) for f in PAPER_FGS for b in PAPER_BGS],
    'fills': [pair(f, b) for f, b in FILLS],
}


def clamp(mn, mx, a=375, b=1440):
    s = (mx - mn) / (b - a)
    i = mn - s * a
    return f"clamp({mn / 16:.4g}rem, {i / 16:.4g}rem + {s * 100:.4g}vw, {mx / 16:.4g}rem)"


TYPE = {  # name: (px @375, px @1440, line-height, tracking, family, weight)
    'display-2xl': (56, 128, 0.92, '-0.045em', 'display', 500),
    'display-xl': (48, 96, 0.95, '-0.04em', 'display', 500),
    'display-lg': (40, 72, 1.0, '-0.035em', 'display', 500),
    'display-md': (34, 56, 1.04, '-0.03em', 'display', 500),
    'heading-lg': (28, 40, 1.1, '-0.025em', 'display', 500),
    'heading-md': (22, 28, 1.2, '-0.018em', 'display', 500),
    'heading-sm': (19, 22, 1.3, '-0.01em', 'display', 500),
    'body-lg': (18, 20, 1.5, '-0.006em', 'sans', 400),
    'body': (16, 17, 1.5, '0em', 'sans', 400),
    'body-sm': (14, 15, 1.5, '0em', 'sans', 400),
    'caption': (12, 13, 1.4, '0.005em', 'sans', 400),
    'label': (11, 12, 1.2, '0.14em', 'mono', 500),
}
SPACE = {'0': 0, 'px': 1, '0.5': 2, '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32, '10': 40, '11': 44,
         '12': 48, '14': 56, '16': 64, '20': 80, '24': 96, '32': 128, '40': 160, '48': 192, '60': 240}

tokens = {
    '$description': 'DreamSVin — Dark Precision. LOCKED at Stage 03. Edit via build_tokens.py only.',
    'color': {
        'primitive': PRIMITIVES,
        'semantic': {t: {k: PRIMITIVES[v] for k, v in m.items()} for t, m in SEMANTIC.items()},
        'semanticRef': SEMANTIC,
    },
    'contrast': matrix,
    'font': {'display': 'Geist', 'sans': 'Geist', 'serif': 'Instrument Serif (italic only)', 'mono': 'Geist Mono'},
    'type': {k: {'size': clamp(a, b), 'minPx': a, 'maxPx': b, 'lineHeight': lh, 'tracking': t, 'family': fam, 'weight': w}
             for k, (a, b, lh, t, fam, w) in TYPE.items()},
    'space': {k: f'{v}px' for k, v in SPACE.items()},
    'layout': {'section-sm': clamp(64, 128), 'section': clamp(96, 176), 'section-lg': clamp(120, 240),
               'gutter': clamp(20, 48), 'container': '1360px', 'measure': '66ch', 'measure-narrow': '44ch',
               'nav-height': '72px'},
    'radius': {'none': '0', 'xs': '2px', 'sm': '4px', 'md': '6px', 'lg': '8px', 'xl': '12px', 'full': '9999px'},
    'elevation': {
        'e0': 'none',
        'e1': 'inset 0 1px 0 0 rgb(255 255 255 / 0.04)',
        'e2': 'inset 0 1px 0 0 rgb(255 255 255 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.5), 0 12px 32px -16px rgb(0 0 0 / 0.7)',
        'e3': 'inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 2px 4px 0 rgb(0 0 0 / 0.5), 0 32px 64px -24px rgb(0 0 0 / 0.8)',
        'rule': 'Depth = surface step first, shadow second. e1 on surface-1 (cards), e2 on surface-2 (menus, toasts), e3 on surface-3 (sheet).',
    },
    'motion': {
        'duration': {'instant': '100ms', 'fast': '150ms', 'base': '200ms', 'moderate': '250ms',
                     'slow': '400ms', 'slower': '550ms', 'story': '700ms'},
        'easing': {'out': 'cubic-bezier(0.22, 1, 0.36, 1)', 'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
                   'in': 'cubic-bezier(0.55, 0, 1, 0.45)', 'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)'},
        'stagger': {'line': '90ms', 'item': '60ms'},
        'distance': {'reveal-y': '0.6em', 'enter-y': '12px', 'blur': '6px'},
    },
    'breakpoint': {'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '1280px', '2xl': '1440px'},
    'z': {'base': 0, 'raised': 10, 'sticky': 100, 'header': 200, 'overlay': 300, 'sheet': 310, 'toast': 400, 'skip': 500},
}

with open(os.path.join(HERE, 'design-tokens.json'), 'w') as fh:
    json.dump(tokens, fh, indent=2, ensure_ascii=False)


def table(rows, bgs, title):
    fgs = list(dict.fromkeys(r['fg'] for r in rows))
    lk = {(r['fg'], r['bg']): r for r in rows}
    s = f"### {title}\n\n| fg \\ bg | " + ' | '.join(f"`{b}` {PRIMITIVES[b]}" for b in bgs) + " |\n|---|" + "---|" * len(bgs) + "\n"
    for f in fgs:
        s += f"| `{f}` {PRIMITIVES[f]} | " + ' | '.join(f"{lk[(f, b)]['ratio']:.2f} · {lk[(f, b)]['grade']}" for b in bgs) + " |\n"
    return s


md = ("# Contrast matrix\n\nGenerated by `build_tokens.py` — do not hand-edit.\n\n"
      "Grades: **text-safe** ≥ 4.5:1 (WCAG 2.2 AA body text) · **border-only** 3–4.49:1 (UI boundaries, icons, focus rings, "
      "or display text ≥ 24px / 19px bold) · **decorative** < 3:1 (hairlines, ornament, disabled — never the only carrier of meaning).\n\n")
md += table(matrix['dark'], DARK_BGS, 'Dark tone') + "\n" + table(matrix['paper'], PAPER_BGS, 'Paper tone')
md += "\n### Fills (text or mark on a filled control)\n\n| fg | fill | ratio | grade |\n|---|---|---|---|\n"
md += ''.join(f"| `{r['fg']}` | `{r['bg']}` | {r['ratio']:.2f} | {r['grade']} |\n" for r in matrix['fills'])

with open(os.path.join(HERE, 'contrast-matrix.md'), 'w') as fh:
    fh.write(md)
print(md)
