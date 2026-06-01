#!/usr/bin/env python3
"""
Unified design system for IELTS Writing Task 1 HTML files.
Idempotent: strips old injection before adding new one.
Uses body class tagging to avoid selector conflicts between masterclass/cheatsheet.
"""
import re, os

BASE = os.path.dirname(os.path.abspath(__file__))

# Marker so we can strip on re-run
MARKER_START = "/* ===IELTS-UNIFIED-START=== */"
MARKER_END   = "/* ===IELTS-UNIFIED-END=== */"

# ─── MASTERCLASS CSS ──────────────────────────────────────────────────────────
# All selectors prefixed with body.mc to avoid conflicts with cheatsheet pages
MASTERCLASS_CSS = f"""
    {MARKER_START}
    /* IELTS Unified — MASTERCLASS (navy/blue) */

    /* Hide noise */
    body.mc .intro-box,
    body.mc .intro,
    body.mc .intro-text   {{ display: none !important; }}
    body.mc .hero-subtitle {{ display: none !important; }}
    body.mc .hero-badge,
    body.mc .header-badge,
    body.mc .badge,
    body.mc .hero-stats,
    body.mc .header-stats  {{ display: none !important; }}
    body.mc .footer-motivation,
    body.mc .footer-cta    {{ display: none !important; }}
    body.mc .subtitle      {{ display: none !important; }}
    body.mc .header > p,
    body.mc header > p,
    body.mc .hero > p      {{ display: none !important; }}
    body.mc .toc           {{ display: none !important; }}

    /* Base */
    body.mc {{
        background: #f8fafc !important;
        font-family: "Inter", Arial, sans-serif !important;
        color: #0f172a !important;
        line-height: 1.65 !important;
        padding: 24px !important;
    }}

    /* Hero — unified navy gradient (covers all variants) */
    body.mc .hero,
    body.mc .hero-block,
    body.mc .page-header,
    body.mc header,
    body.mc .header {{
        background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%) !important;
        padding: 52px 40px 44px !important;
        text-align: center !important;
        color: white !important;
    }}
    body.mc .hero::before {{ display: none !important; }}
    body.mc .hero h1,
    body.mc .hero-content h1,
    body.mc header h1,
    body.mc .header h1 {{
        font-family: "Inter", Arial, sans-serif !important;
        font-size: 2.2rem !important;
        font-weight: 700 !important;
        letter-spacing: -0.3px !important;
        text-shadow: none !important;
        margin-bottom: 0 !important;
        color: white !important;
    }}
    body.mc header h1 span {{ color: #93c5fd !important; }}

    /* Typography */
    body.mc h1, body.mc h2, body.mc h3,
    body.mc h4, body.mc h5 {{
        font-family: "Inter", Arial, sans-serif !important;
    }}
    body.mc .section-title {{
        font-size: 1.4rem !important;
        font-weight: 700 !important;
    }}

    /* Section number */
    body.mc .section-number,
    body.mc .section-num {{
        background: #2563eb !important;
        box-shadow: none !important;
        font-size: 0.9rem !important;
        font-family: "Inter", Arial, sans-serif !important;
    }}

    /* Band badges */
    body.mc .band-indicator.band-6,
    body.mc .band-label.band-6,
    body.mc .band-box.b6 {{
        background: #fef3c7 !important; color: #92400e !important; border: none !important;
    }}
    body.mc .band-indicator.band-7,
    body.mc .band-label.band-7 {{
        background: #ede9fe !important; color: #5b21b6 !important; border: none !important;
    }}
    body.mc .band-indicator.band-8,
    body.mc .band-label.band-8,
    body.mc .band-box.b8 {{
        background: #dcfce7 !important; color: #166534 !important; border: none !important;
    }}

    /* Model sentences */
    body.mc .model-sentence {{
        border-left: 3px solid #2563eb !important;
        box-shadow: none !important;
        background: #f8fafc !important;
    }}
    body.mc .model-sentence:hover {{
        transform: none !important;
        box-shadow: none !important;
    }}

    /* Boxes */
    body.mc .template-box {{
        background: #f0fdf4 !important;
        border-color: #22c55e !important;
    }}
    body.mc .tip-box {{
        background: #f0f9ff !important;
        border-left-color: #2563eb !important;
    }}
    body.mc .warning-box {{ background: #fef2f2 !important; }}

    /* Dark collocation block (bar chart) */
    body.mc .colloc-section {{ background: #1e3a5f !important; }}

    /* Nav */
    body.mc .nav {{ background: #1e3a5f !important; }}

    /* Container */
    body.mc .container {{
        border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
    }}

    /* Footer */
    body.mc footer {{
        background: #1e3a5f !important;
        font-family: "Inter", Arial, sans-serif !important;
        font-size: 0.82rem !important;
    }}

    @media (max-width: 768px) {{
        body.mc {{ padding: 12px !important; }}
        body.mc .hero,
        body.mc header,
        body.mc .header {{ padding: 36px 20px 30px !important; }}
        body.mc .hero h1,
        body.mc header h1,
        body.mc .header h1 {{ font-size: 1.7rem !important; }}
    }}
    {MARKER_END}
"""

# ─── CHEATSHEET CSS ───────────────────────────────────────────────────────────
CHEATSHEET_CSS = f"""
    {MARKER_START}
    /* IELTS Unified — CHEATSHEET (teal/cyan) */

    body.cs {{
        background: #f0fdf4 !important;
        font-family: "Inter", Arial, sans-serif !important;
        color: #0f172a !important;
    }}

    /* Header strip — teal gradient */
    body.cs .cheat-sheet .header,
    body.cs .sheet .header,
    body.cs .page .header,
    body.cs div.header {{
        background: linear-gradient(135deg, #065f46 0%, #0891b2 100%) !important;
        border-bottom: none !important;
        padding: 18px 20px 14px !important;
        border-radius: 6px 6px 0 0 !important;
    }}
    body.cs .header h1 {{
        color: white !important;
        font-family: "Inter", Arial, sans-serif !important;
        text-transform: none !important;
        letter-spacing: 0 !important;
        font-weight: 700 !important;
        font-size: 1.25rem !important;
    }}
    body.cs .header .subtitle,
    body.cs .header p.subtitle {{
        color: rgba(255,255,255,0.78) !important;
        font-size: 0.78rem !important;
    }}

    /* Typography */
    body.cs h1, body.cs h2, body.cs h3,
    body.cs h4, body.cs h5 {{
        font-family: "Inter", Arial, sans-serif !important;
    }}
    body.cs .section-title {{
        font-family: "Inter", Arial, sans-serif !important;
        color: #065f46 !important;
    }}
    body.cs .section-title::before {{ color: #0d9488 !important; }}

    /* Accent elements */
    body.cs .section {{ border-left-color: #0d9488 !important; }}
    body.cs .structure-item {{ border-left-color: #0d9488 !important; }}
    body.cs .collocation,
    body.cs .colloc-item {{ border-left-color: #0d9488 !important; }}
    body.cs .structure-item .label {{
        background: #d1fae5 !important;
        color: #065f46 !important;
    }}

    /* Print button */
    body.cs .print-button,
    body.cs .print-btn {{
        background: #0d9488 !important;
        font-family: "Inter", Arial, sans-serif !important;
    }}
    body.cs .print-button:hover,
    body.cs .print-btn:hover {{ background: #065f46 !important; }}

    /* Footer */
    body.cs .footer {{ border-top-color: #0d9488 !important; }}
    body.cs .footer strong {{ color: #065f46 !important; }}

    /* Band badges */
    body.cs .band-indicator.band-6,
    body.cs .bp.b6, body.cs .band-seg.b6 {{
        background: #fef3c7 !important; color: #92400e !important;
    }}
    body.cs .band-indicator.band-7,
    body.cs .bp.b7, body.cs .band-seg.b7 {{
        background: #ede9fe !important; color: #5b21b6 !important;
    }}
    body.cs .band-indicator.band-8,
    body.cs .bp.b8, body.cs .band-seg.b8 {{
        background: #dcfce7 !important; color: #166534 !important;
    }}

    /* Card styling */
    body.cs .cheat-sheet,
    body.cs .sheet,
    body.cs .page {{
        border-radius: 10px !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        overflow: hidden !important;
    }}

    @media (max-width: 768px) {{
        body.cs .header h1 {{ font-size: 1rem !important; }}
    }}
    {MARKER_END}
"""

INTER = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">'

EMOJI_RE = re.compile(
    r"[\U0001F300-\U0001F64F\U0001F680-\U0001FAFF☀-➿️‍]+",
    flags=re.UNICODE
)


def strip_old_injection(html):
    """Remove previously injected block (idempotent)."""
    return re.sub(
        re.escape(MARKER_START) + r"[\s\S]*?" + re.escape(MARKER_END),
        "",
        html
    )


def update_fonts(html):
    """Replace all Google Fonts links with Inter-only."""
    html = re.sub(
        r"<link[^>]+fonts\.googleapis\.com[^>]*?/?>",
        INTER, html, count=1, flags=re.IGNORECASE
    )
    html = re.sub(
        r"<link[^>]+fonts\.googleapis\.com[^>]*?/?>",
        "", html, flags=re.IGNORECASE
    )
    html = re.sub(
        r"@import\s+url\([\"']https://fonts\.googleapis\.com[^\"']*[\"']\);?\s*\n?",
        "", html, flags=re.IGNORECASE
    )
    return html


def tag_body(html, body_class):
    """Add class to <body> tag."""
    # Remove any previous mc/cs class
    html = re.sub(r'<body([^>]*)\s+class="(?:mc|cs)"', r"<body\1", html)
    html = re.sub(r"<body([^>]*)>", rf'<body\1 class="{body_class}">', html, count=1)
    return html


def inject_css(html, css):
    """Inject unified CSS just before the closing </style> in <head>."""
    head_end = html.lower().find("</head>")
    if head_end == -1:
        return html
    style_end = html.rfind("</style>", 0, head_end)
    if style_end == -1:
        # No style block — append before </head>
        return html[:head_end] + f"<style>{css}</style>\n" + html[head_end:]
    return (
        html[:style_end]
        + css
        + "\n    </style>"
        + html[style_end + len("</style>"):]
    )


def strip_h3_emoji(html):
    """Strip leading emoji from <h3> content (preserve h1 chart icons)."""
    def rep(m):
        tag, content = m.group(1), m.group(2)
        cleaned = EMOJI_RE.sub("", content, count=1).lstrip(" \t\n-–—:")
        return f"{tag}{cleaned}</h3>"
    return re.sub(r"(<h3[^>]*>)([\s\S]*?)</h3>", rep, html)


def clean_title(html):
    """Remove marketing suffixes from <title>."""
    def rep(m):
        t = m.group(1)
        for p in [
            r"\s*[-—]\s*Your Secret Weapon.*",
            r"\s*[-—]\s*Exam Day Toolkit.*",
            r"\s*[-—]\s*Band \d\+.*",
            r"\s*\|\s*Band \d\+.*",
        ]:
            t = re.sub(p, "", t, flags=re.IGNORECASE)
        return f"<title>{t.strip()}</title>"
    return re.sub(r"<title>(.*?)</title>", rep, html, flags=re.IGNORECASE)


def process(fp, ftype):
    with open(fp, "r", encoding="utf-8") as f:
        html = f.read()
    before = len(html)

    html = strip_old_injection(html)          # idempotent
    html = update_fonts(html)
    body_class = "mc" if ftype == "masterclass" else "cs"
    html = tag_body(html, body_class)
    css = MASTERCLASS_CSS if ftype == "masterclass" else CHEATSHEET_CSS
    html = inject_css(html, css)
    html = strip_h3_emoji(html)
    html = clean_title(html)

    with open(fp, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  OK  {os.path.basename(fp)}  ({before} -> {len(html)} bytes)")


FILES = {
    "masterclass": [
        "ielts-line-graph-masterclass.html",
        "ielts-bar-chart-masterclass.html",
        "ielts-piechart-masterclass.html",
        "ielts-map-masterclass.html",
        "ielts-process-diagram-masterclass.html",
        "ielts-task1-table-masterclass.html",
    ],
    "cheatsheet": [
        "ielts-line-graph-cheat-sheet.html",
        "ielts-barchart-cheatsheet.html",
        "ielts-piechart-cheatsheet.html",
        "ielts-map-cheat-sheet.html",
        "ielts-process-cheat-sheet.html",
        "ielts-table-cheatsheet.html",
    ],
}

for ftype, names in FILES.items():
    print(f"\n{'='*50}\n  {ftype.upper()}S\n{'='*50}")
    for name in names:
        fp = os.path.join(BASE, name)
        if os.path.exists(fp):
            process(fp, ftype)
        else:
            print(f"  MISS  {name}")

print("\nDone.")
