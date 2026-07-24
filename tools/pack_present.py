# -*- coding: utf-8 -*-
"""Pack a present/demo deck for uploading to a server (no GitHub badge, no sponsor slide).

Usage:
  python tools/pack_present.py
  python tools/pack_present.py --zip

Output:
  dist/present-deck/           # upload this folder
  dist/present-deck.zip        # optional
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

DOCS = ROOT / "docs"
DIST = ROOT / "dist" / "present-deck"

def _sync_packed_provenance_js(deck_dir: Path) -> None:
    """Rewrite FALLBACK in packed provenance.js from packed provenance.json."""
    from tools.build_deck import loads_jsonc  # noqa: WPS433

    path = deck_dir / "js" / "provenance.js"
    prov_path = deck_dir / "provenance.json"
    if not path.exists() or not prov_path.exists():
        return
    obj = loads_jsonc(prov_path.read_text(encoding="utf-8"))
    obj["requireAttribution"] = False
    raw = json.dumps(obj, ensure_ascii=False, indent=2)
    parts = raw.splitlines()
    body = parts[0] + "\n" + "\n".join("  " + p for p in parts[1:])
    block = "  var FALLBACK = " + body + ";"
    text = path.read_text(encoding="utf-8")
    text2, n = re.subn(r"  var FALLBACK = \{[\s\S]*?\n  \};", block, text, count=1)
    if n == 1:
        path.write_text(text2, encoding="utf-8")


def pack(*, make_zip: bool, include_media: bool) -> Path:
    from tools.build_deck import (  # noqa: WPS433
        _CONFIG_JS_TEMPLATE,
        build,
        load_config,
        write_config_js,
    )

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    # 1) Build present HTML (no sponsor slide, present FALLBACK)
    html_out = DIST / "harness_training.html"
    build(html_out, present=True, sync_config_js=True)

    # 2) Copy runtime deps with present=true config
    shutil.copytree(DOCS / "deck", DIST / "deck")
    cfg = load_config()
    cfg["present"] = True
    cfg["hideAttribution"] = True
    cfg["forceMotion"] = True
    cfg["enterFx"] = "showcase"
    excl = list(cfg.get("excludeSlides") or [])
    if "开源与赞助" not in excl:
        excl.append("开源与赞助")
    cfg["excludeSlides"] = excl
    (DIST / "deck" / "config.json").write_text(
        json.dumps(cfg, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    # Restore repo config.js FALLBACK (build mutated it)
    write_config_js(load_config())
    # Pack's config.js must match packed config.json
    (DIST / "deck" / "config.js").write_text(
        _CONFIG_JS_TEMPLATE.replace(
            "__FALLBACK__", json.dumps(cfg, ensure_ascii=False, indent=2)
        ),
        encoding="utf-8",
    )

    # Remove sponsor slide sources from the pack
    for name in ("33-开源与赞助.html", "33-开源与赞助.css"):
        p = DIST / "deck" / "slides" / name
        if p.exists():
            p.unlink()
    man_path = DIST / "deck" / "manifest.json"
    if man_path.exists():
        man = json.loads(man_path.read_text(encoding="utf-8"))
        man["slides"] = [s for s in man["slides"] if s.get("title") != "开源与赞助"]
        man_path.write_text(json.dumps(man, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # provenance: hide badge in packed copy
    prov_path = DIST / "deck" / "provenance.json"
    if prov_path.exists():
        text = prov_path.read_text(encoding="utf-8")
        if '"requireAttribution"' in text:
            text = text.replace('"requireAttribution": true', '"requireAttribution": false')
            text = text.replace('"requireAttribution":true', '"requireAttribution":false')
            prov_path.write_text(text, encoding="utf-8")
    _sync_packed_provenance_js(DIST / "deck")

    assets_dst = DIST / "assets"
    assets_dst.mkdir(exist_ok=True)
    # vendor + themes + content png
    shutil.copytree(DOCS / "assets" / "vendor", assets_dst / "vendor")
    for name in ("themes.css",):
        src = DOCS / "assets" / name
        if src.exists():
            shutil.copy2(src, assets_dst / name)
    for png in (DOCS / "assets").glob("*.png"):
        shutil.copy2(png, assets_dst / png.name)

    if include_media:
        for pat in ("*.mp4", "*.mp3"):
            for f in DOCS.glob(pat):
                shutil.copy2(f, DIST / f.name)

    # Convenience entry
    (DIST / "index.html").write_text(
        "<!doctype html><meta charset=\"utf-8\" />"
        "<meta http-equiv=\"refresh\" content=\"0;url=harness_training.html\" />"
        "<title>Training Deck</title>"
        "<p><a href=\"harness_training.html\">Open deck</a></p>\n",
        encoding="utf-8",
    )
    (DIST / "README.txt").write_text(
        "\n".join(
            [
                "Present / demo pack (autohtml-ppt) — fully offline (no CDN)",
                "",
                "Upload this WHOLE folder (keep structure). Open:",
                "  harness_training.html   or   index.html",
                "",
                "Required layout on server:",
                "  harness_training.html",
                "  deck/                   (config + css + js)",
                "  assets/vendor/          (tsparticles / three / vanta / fonts …)",
                "  assets/themes.css",
                "  assets/*.png",
                "",
                "Motion / particles:",
                "  This pack sets forceMotion=true (ignores Windows Reduce Animations).",
                "  Or open with: harness_training.html?motion=1",
                "  Windows (optional): Settings → Accessibility → Visual effects → Animation effects ON",
                "",
                "If still blank:",
                "  1) Hard refresh (Ctrl+F5) after re-upload",
                "  2) Network: assets/vendor/anime.min.js + tsparticles… = 200",
                "  3) Upload the WHOLE folder, not only the HTML",
                "",
                "Not included: screenshots*, skills/, sponsors/",
                "",
            ]
        ),
        encoding="utf-8",
    )

    if make_zip:
        zip_path = DIST.with_suffix(".zip")
        if zip_path.exists():
            zip_path.unlink()
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in DIST.rglob("*"):
                if f.is_file():
                    zf.write(f, f.relative_to(DIST.parent))
        print(f"zip {zip_path} ({zip_path.stat().st_size} bytes)")

    print(f"packed {DIST}")
    return DIST


def main() -> None:
    ap = argparse.ArgumentParser(description="Pack present/demo deck for server upload")
    ap.add_argument("--zip", action="store_true", help="Also write dist/present-deck.zip")
    ap.add_argument(
        "--no-media",
        action="store_true",
        help="Skip copying mp4/mp3 (smaller pack)",
    )
    args = ap.parse_args()
    pack(make_zip=args.zip, include_media=not args.no_media)


if __name__ == "__main__":
    main()
