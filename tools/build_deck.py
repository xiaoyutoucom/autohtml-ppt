# -*- coding: utf-8 -*-
"""Assemble docs/deck/* into docs/harness_training.html (offline single file for demo)."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DECK = ROOT / "docs" / "deck"
DEFAULT_OUT = ROOT / "docs" / "harness_training.html"


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


_JSONC_BLOCK = re.compile(r"/\*.*?\*/", re.DOTALL)


def _strip_jsonc_line_comment(line: str) -> str:
    """Strip // comments; do not touch // inside strings (e.g. https://)."""
    in_str = False
    escape = False
    i = 0
    while i < len(line):
        ch = line[i]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_str = False
        else:
            if ch == '"':
                in_str = True
            elif ch == "/" and i + 1 < len(line) and line[i + 1] == "/":
                return line[:i].rstrip()
        i += 1
    return line


def loads_jsonc(text: str):
    """Parse JSON with // or /* */ comments (and trailing commas)."""
    text = _JSONC_BLOCK.sub("", text)
    lines = [_strip_jsonc_line_comment(line) for line in text.splitlines()]
    text = "\n".join(lines)
    text = re.sub(r",\s*([}\]])", r"\1", text)
    return json.loads(text)


_CONFIG_JS_TEMPLATE = r"""/*!
 * 运行时配置加载（无需 python）
 * 优先读取同目录 config.json；失败则用下方 FALLBACK。
 *
 * 推荐：用本地 HTTP 打开 docs/（VS Code Live Server / npx serve docs），
 * 只改 config.json → 普通刷新即可生效。
 * file:// 双击打开时，多数浏览器读不到 json，请改 FALLBACK 后刷新，或改用 HTTP。
 */
(function (w) {
  function parseJsonc(text) {
    text = String(text || "").replace(/\/\*[\s\S]*?\*\//g, "");
    text = text
      .split("\n")
      .map(function (line) {
        var inStr = false, escape = false, out = line;
        for (var i = 0; i < line.length; i++) {
          var ch = line.charAt(i);
          if (inStr) {
            if (escape) escape = false;
            else if (ch === "\\") escape = true;
            else if (ch === '"') inStr = false;
          } else if (ch === '"') {
            inStr = true;
          } else if (ch === "/" && line.charAt(i + 1) === "/") {
            out = line.slice(0, i).replace(/\s+$/, "");
            break;
          }
        }
        return out;
      })
      .join("\n");
    text = text.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(text);
  }

  // build_deck.py 会同步更新 FALLBACK；也可手改后直接刷新（file:// 时靠它）
  var FALLBACK = __FALLBACK__;

  var cfg = null;
  var base =
    (document.currentScript && document.currentScript.src) ||
    w.location.href;
  var isFile = false;
  try {
    isFile = String(w.location.protocol) === "file:";
  } catch (e0) {}

  // file:// 下 XHR 读本地 json 会被 CORS 拦截，直接用 FALLBACK
  if (!isFile) {
    try {
      var url = new URL("config.json", base).href;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.overrideMimeType("application/json");
      xhr.send(null);
      var ok = xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300);
      if (ok && xhr.responseText && /^\s*\{/.test(xhr.responseText)) {
        cfg = parseJsonc(xhr.responseText);
      }
    } catch (e) {}
  }

  if (!cfg) {
    cfg = FALLBACK;
    if (isFile) {
      try {
        console.info(
          "[deck] file:// 使用 config.js FALLBACK（无法热读 config.json）。改配置请编辑 config.json 后执行 python tools/build_deck.py，或用本地 HTTP 打开 docs/。"
        );
      } catch (e2) {}
    }
  }

  w.DECK_CONFIG = cfg;
})(window);
"""


def write_config_js(cfg_obj: dict) -> Path:
    """Sync docs/deck/config.js FALLBACK from config.json (runtime loader)."""
    path = DECK / "config.js"
    path.write_text(
        _CONFIG_JS_TEMPLATE.replace(
            "__FALLBACK__", json.dumps(cfg_obj, ensure_ascii=False, indent=2)
        ),
        encoding="utf-8",
    )
    return path


def write_provenance_js() -> Path:
    """Sync FALLBACK inside docs/deck/js/provenance.js from provenance.json."""
    path = DECK / "js" / "provenance.js"
    prov_path = DECK / "provenance.json"
    if prov_path.exists():
        obj = loads_jsonc(read(prov_path))
    else:
        obj = {
            "projectId": "tech-training-deck",
            "fingerprint": "TTD-2026-XIAOYUTOUCOM",
            "productName": "Tech Training Deck",
            "version": "0.1.0",
            "copyright": "© 2026 xiaoyutoucom",
            "license": "AGPL-3.0-or-later OR Commercial",
            "homepage": "https://github.com/xiaoyutoucom",
            "contact": "xiaoyutoucom@gmail.com",
            "requireAttribution": True,
        }
    raw = json.dumps(obj, ensure_ascii=False, indent=2)
    parts = raw.splitlines()
    body = parts[0] + "\n" + "\n".join("  " + p for p in parts[1:])
    block = "  var FALLBACK = " + body + ";"
    text = read(path)
    text2, n = re.subn(r"  var FALLBACK = \{[\s\S]*?\n  \};", block, text, count=1)
    if n != 1:
        raise SystemExit(f"could not sync FALLBACK in {path}")
    path.write_text(text2, encoding="utf-8")
    return path


def build(out: Path) -> Path:
    if not (DECK / "manifest.json").exists():
        raise SystemExit(f"missing {DECK / 'manifest.json'} — see docs/deck/README.md")

    manifest = json.loads(read(DECK / "manifest.json"))
    slides = manifest["slides"]

    head = read(DECK / "partials" / "head.html")
    if "__PAGE_STYLES__" not in head:
        head = head.replace(
            'href="deck/styles/base.css" />',
            'href="deck/styles/base.css" />\n  __PAGE_STYLES__',
        )

    page_links = []
    slide_html = []
    for item in slides:
        css_path = DECK / "slides" / item["css"]
        if css_path.exists():
            page_links.append(
                f'  <link rel="stylesheet" href="deck/slides/{item["css"]}" '
                f'data-slide="{item["title"]}" />'
            )
        slide_html.append(read(DECK / "slides" / item["html"]).rstrip())

    head = head.replace("__PAGE_STYLES__", "\n".join(page_links))

    body_start = read(DECK / "partials" / "body-start.html").rstrip()
    body_end = read(DECK / "partials" / "body-end.html").rstrip()
    ext = read(DECK / "partials" / "scripts-external.html").rstrip()
    deck_js = read(DECK / "js" / "deck.js").rstrip()

    # strip decorative comment prefix from extracted JS
    deck_js = re.sub(r"^/\* ---- inline script \d+ ---- \*/\n?", "", deck_js)

    cfg_path = DECK / "config.json"
    if cfg_path.exists():
        cfg_obj = loads_jsonc(read(cfg_path))
    else:
        cfg_obj = {
            "particles": True,
            "theme": 1,
            "speaker": "y",
            "bgm": False,
            "bgmSrc": "dylanf - 卡农 (经典钢琴版).mp3",
        }
    # 运行时加载：provenance → config → deck.js
    write_config_js(cfg_obj)
    write_provenance_js()
    boot_scripts = "\n".join(
        [
            '<script src="deck/js/provenance.js"></script>',
            '<script src="deck/config.js"></script>',
        ]
    )

    parts = [
        head.rstrip(),
        "<body>",
        body_start,
        "",
        "\n\n".join(slide_html),
        "",
        body_end,
        "",
    ]
    if ext:
        parts.extend([ext, ""])
    parts.extend([boot_scripts, "", "<script>", deck_js, "</script>", "</body>", "</html>"])

    out_text = "\n".join(parts) + "\n"
    out_text = re.sub(r"<body>\s*<body>", "<body>", out_text)

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(out_text, encoding="utf-8")
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="Build training deck HTML from docs/deck/")
    ap.add_argument("-o", "--out", type=Path, default=DEFAULT_OUT)
    args = ap.parse_args()
    path = build(args.out.resolve())
    n = len(json.loads(read(DECK / "manifest.json"))["slides"])
    print(f"built {path} ({path.stat().st_size} bytes, {n} slides)")


if __name__ == "__main__":
    main()
