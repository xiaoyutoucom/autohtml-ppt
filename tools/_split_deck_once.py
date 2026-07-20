# -*- coding: utf-8 -*-
"""One-shot ONLY: split a monolithic harness_training.html into docs/deck/.

Do NOT re-run after modular edits — it overwrites slides/*.css stubs and sources.
Day-to-day: edit docs/deck/ then python tools/build_deck.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "harness_training.html"
DECK = ROOT / "docs" / "deck"
SLIDES = DECK / "slides"
STYLES = DECK / "styles"
JS = DECK / "js"
PARTIALS = DECK / "partials"


def slugify(title: str, idx: int) -> str:
    # keep CJK; replace path-unfriendly chars
    s = re.sub(r'[\\/:*?"<>|\s]+', "-", title.strip())
    s = re.sub(r"-+", "-", s).strip("-")
    if not s:
        s = f"slide-{idx:02d}"
    return f"{idx:02d}-{s}"


def main() -> None:
    text = SRC.read_text(encoding="utf-8")

    # --- extract inline <style> (first big block in head) ---
    style_m = re.search(r"<style>\n(.*?)\n\s*</style>", text, re.S)
    if not style_m:
        raise SystemExit("no <style> block found")
    base_css = style_m.group(1)

    # --- extract body chrome before first slide + after last slide before script ---
    # Find all slide sections
    slide_pat = re.compile(
        r'(<section\b[^>]*\bclass="[^"]*\bslide\b[^"]*"[^>]*>.*?</section>)',
        re.S,
    )
    slides = slide_pat.findall(text)
    if len(slides) < 5:
        raise SystemExit(f"too few slides: {len(slides)}")

    titles = []
    for i, html in enumerate(slides):
        tm = re.search(r'data-title="([^"]+)"', html)
        titles.append(tm.group(1) if tm else f"slide-{i}")

    first = text.find(slides[0])
    last_end = text.find(slides[-1]) + len(slides[-1])

    head_end = text.find("<body")
    body_open_end = text.find(">", head_end) + 1
    # from after <body...> to first slide
    pre_slides = text[body_open_end:first]
    # after last slide until <script (deck logic) — keep progress/footer in partials
    post_slides = text[last_end:]

    # split post into: chrome (progress/footer/overlays) + scripts
    script_idx = post_slides.find("<script")
    if script_idx < 0:
        raise SystemExit("no script after slides")
    chrome_after = post_slides[:script_idx]
    scripts_blob = post_slides[script_idx:]

    # head without style — replace style with link
    head = text[: text.find("<body")]
    head = re.sub(
        r"<style>\n.*?\n\s*</style>\n?",
        '  <link rel="stylesheet" href="deck/styles/base.css" />\n'
        '  <!-- page CSS injected by build: deck/slides/*.css -->\n'
        "  __PAGE_STYLES__\n",
        head,
        count=1,
        flags=re.S,
    )
    # fix relative paths: from docs/harness_training.html assets/ stays assets/
    # built output still at docs/*.html so paths OK; source template at docs/deck/template.html
    # template will be assembled to docs/harness_training.html

    # Extract main IIFE script(s) — keep vendor scripts as external in head already
    # scripts_blob may include vendor? Usually only one big inline script at end
    inline_scripts = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", scripts_blob, re.S)
    external_scripts = re.findall(r"<script[^>]*\bsrc=\"[^\"]+\"[^>]*>\s*</script>", scripts_blob)

    DECK.mkdir(parents=True, exist_ok=True)
    SLIDES.mkdir(parents=True, exist_ok=True)
    STYLES.mkdir(parents=True, exist_ok=True)
    JS.mkdir(parents=True, exist_ok=True)
    PARTIALS.mkdir(parents=True, exist_ok=True)

    (STYLES / "base.css").write_text(base_css + "\n", encoding="utf-8")

    # page css stubs empty for each slide (optional overrides)
    manifest = []
    for i, (title, html) in enumerate(zip(titles, slides)):
        slug = slugify(title, i)
        slide_path = SLIDES / f"{slug}.html"
        css_path = SLIDES / f"{slug}.css"
        slide_path.write_text(html.strip() + "\n", encoding="utf-8")
        if not css_path.exists():
            css_path.write_text(
                f"/* 单页样式：仅作用于 data-title=\"{title}\" */\n"
                f'.slide[data-title="{title}"] {{\n'
                f"  /* 例：--ink: #fde047; */\n"
                f"}}\n",
                encoding="utf-8",
            )
        manifest.append({"index": i, "title": title, "slug": slug, "html": slide_path.name, "css": css_path.name})

    (PARTIALS / "body-start.html").write_text(pre_slides.strip() + "\n", encoding="utf-8")
    (PARTIALS / "body-end.html").write_text(chrome_after.strip() + "\n", encoding="utf-8")

    # JS: join inline scripts
    js_parts = []
    for i, body in enumerate(inline_scripts):
        js_parts.append(f"/* ---- inline script {i+1} ---- */\n{body.strip()}\n")
    (JS / "deck.js").write_text("\n".join(js_parts) + "\n", encoding="utf-8")

    # external script tags after slides (rare)
    (PARTIALS / "scripts-external.html").write_text(
        ("\n".join(external_scripts) + "\n") if external_scripts else "",
        encoding="utf-8",
    )

    # template head fragment (stored without __PAGE_STYLES__ resolved)
    # Fix asset paths in head: still assets/ relative to docs/
    (PARTIALS / "head.html").write_text(head.replace("__PAGE_STYLES__", "").rstrip() + "\n", encoding="utf-8")

    import json

    (DECK / "manifest.json").write_text(
        json.dumps({"slides": manifest}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"split {len(manifest)} slides -> {DECK}")
    for m in manifest:
        print(f"  {m['slug']}: {m['title']}")


if __name__ == "__main__":
    main()
