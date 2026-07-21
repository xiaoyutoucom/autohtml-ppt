# -*- coding: utf-8 -*-
"""Capture animated GIF previews for README (features + multi-theme).

Examples:
  python tools/capture_readme_gifs.py
  python tools/capture_readme_gifs.py --lang en --out docs/assets/screenshots-en
"""
from __future__ import annotations

import argparse
import asyncio
import io
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

REPO = Path(__file__).resolve().parents[1]
HTML = REPO / "docs" / "harness_training.html"
DEFAULT_OUT = REPO / "docs" / "assets" / "screenshots"

GIF_SIZE = (960, 540)
MAX_COLORS = 56
OUT = DEFAULT_OUT


def png_bytes_to_p(png: bytes) -> Image.Image:
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    im = im.resize(GIF_SIZE, Image.Resampling.LANCZOS)
    bg = Image.new("RGBA", im.size, (6, 10, 16, 255))
    bg.alpha_composite(im)
    return bg.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=MAX_COLORS)


def save_gif(frames: list[Image.Image], path: Path, duration_ms: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        path,
        save_all=True,
        append_images=frames[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(f"wrote {path.name} ({path.stat().st_size/1024:.0f} KB, {len(frames)} frames)")


async def shot(page) -> Image.Image:
    return png_bytes_to_p(await page.screenshot(type="png", full_page=False))


async def go(page, index: int, settle_ms: int = 500) -> None:
    await page.evaluate(f"() => window.deckGoTo && window.deckGoTo({index})")
    await page.wait_for_timeout(settle_ms)


async def ensure_lang(page, lang: str) -> None:
    lang = "en" if str(lang).lower().startswith("en") else "zh"
    await page.evaluate(
        """(lang) => {
          try {
            localStorage.setItem('harness_training_lang', lang);
            localStorage.setItem('harness_training_lang_cfg', lang);
            localStorage.setItem('harness_training_more_expanded', '1');
          } catch (e) {}
          if (window.DECK_I18N && typeof window.DECK_I18N.setLang === 'function') {
            window.DECK_I18N.setLang(lang, true);
          }
          const more = document.getElementById('moreWrap');
          if (more) {
            more.classList.add('is-expanded');
            more.classList.remove('is-collapsed');
          }
          const tools = document.getElementById('moreTools');
          if (tools) tools.removeAttribute('hidden');
        }""",
        lang,
    )
    await page.wait_for_timeout(200)


async def set_theme(page, tid: int) -> None:
    await page.evaluate(
        f"""() => {{
          const btn = document.querySelector('.theme-swatch[data-theme="{tid}"]');
          if (btn) btn.click();
          const wrap = document.getElementById('themeWrap');
          if (wrap) wrap.classList.remove('open');
        }}"""
    )
    await page.wait_for_timeout(380)


async def capture_hero(page) -> None:
    frames: list[Image.Image] = []
    await set_theme(page, 3)
    await go(page, 0, 600)
    for _ in range(2):
        frames.append(await shot(page))
        await page.wait_for_timeout(350)
    for idx, settle in ((1, 650), (9, 750), (18, 700), (26, 850), (0, 650)):
        await go(page, idx, settle)
        frames.append(await shot(page))
    save_gif(frames, OUT / "preview.gif", 520)


async def capture_flip(page) -> None:
    frames: list[Image.Image] = []
    await set_theme(page, 3)
    for idx, settle in (
        (0, 700), (1, 600), (7, 600), (9, 700), (12, 650),
        (15, 650), (16, 700), (18, 650), (26, 800), (5, 650), (0, 600),
    ):
        await go(page, idx, settle)
        frames.append(await shot(page))
    save_gif(frames, OUT / "preview-flip.gif", 750)


async def capture_stage(page) -> None:
    await set_theme(page, 12)
    await go(page, 26, 320)
    frames = []
    for _ in range(16):
        frames.append(await shot(page))
        await page.wait_for_timeout(260)
    save_gif(frames, OUT / "preview-stage.gif", 260)


async def capture_themes(page) -> None:
    await go(page, 0, 500)
    await page.evaluate(
        """() => {
          const wrap = document.getElementById('themeWrap');
          if (wrap) wrap.classList.add('open');
        }"""
    )
    await page.wait_for_timeout(300)
    frames = []
    for tid in (1, 3, 5, 7, 8, 11, 12, 14, 17, 20, 3):
        await page.evaluate(
            f"""() => {{
              const btn = document.querySelector('.theme-swatch[data-theme="{tid}"]');
              if (btn) btn.click();
              const wrap = document.getElementById('themeWrap');
              if (wrap) wrap.classList.add('open');
            }}"""
        )
        await page.wait_for_timeout(420)
        frames.append(await shot(page))
    await page.evaluate(
        """() => {
          const wrap = document.getElementById('themeWrap');
          if (wrap) wrap.classList.remove('open');
        }"""
    )
    save_gif(frames, OUT / "preview-themes.gif", 650)


async def capture_layouts(page) -> None:
    frames = []
    await set_theme(page, 3)
    for idx, settle in (
        (7, 650),
        (18, 650),
        (13, 650),
        (15, 650),
        (16, 700),
        (12, 650),
        (9, 700),
        (26, 750),
    ):
        await go(page, idx, settle)
        frames.append(await shot(page))
    save_gif(frames, OUT / "preview-layouts.gif", 800)


async def capture_chrome(page) -> None:
    frames = []
    await set_theme(page, 3)
    await go(page, 0, 500)
    frames.append(await shot(page))

    await page.evaluate(
        """() => {
          const more = document.getElementById('moreWrap');
          if (more) { more.classList.add('is-expanded'); more.classList.remove('is-collapsed'); }
          const tools = document.getElementById('moreTools');
          if (tools) tools.removeAttribute('hidden');
        }"""
    )
    await page.click("#railBtn", force=True)
    await page.wait_for_timeout(600)
    frames.append(await shot(page))
    await page.click("#railCloseBtn", force=True)
    await page.wait_for_timeout(300)

    await page.click("#gridBtn", force=True)
    await page.wait_for_timeout(800)
    frames.append(await shot(page))
    await page.click("#gridCloseBtn", force=True)
    await page.wait_for_timeout(300)

    await go(page, 9, 500)
    await page.click("#annotateBtn", force=True)
    await page.wait_for_timeout(450)
    frames.append(await shot(page))
    await page.keyboard.press("Escape")
    await page.wait_for_timeout(250)

    await go(page, 0, 400)
    await page.click("#presentBtn", force=True)
    await page.wait_for_timeout(500)
    frames.append(await shot(page))
    await page.click("#presentBtn", force=True)
    await page.wait_for_timeout(300)

    save_gif(frames, OUT / "preview-chrome.gif", 900)


async def main() -> None:
    global OUT
    ap = argparse.ArgumentParser(description="Capture README GIF previews")
    ap.add_argument("--lang", default="zh", choices=["zh", "en"])
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()
    out = args.out
    if out is None:
        out = (
            REPO / "docs" / "assets" / "screenshots-en"
            if args.lang == "en"
            else DEFAULT_OUT
        )
    if not out.is_absolute():
        out = (REPO / out).resolve()
    OUT = out
    OUT.mkdir(parents=True, exist_ok=True)

    uri = HTML.resolve().as_uri()
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(
            viewport={"width": 1280, "height": 720},
            device_scale_factor=1.0,
        )
        await page.goto(uri, wait_until="domcontentloaded")
        await page.wait_for_timeout(800)
        await page.evaluate(
            """() => {
              try {
                ['harness_training_theme','harness_training_theme_cfg',
                 'harness_training_particles','harness_training_bgm',
                 'harness_training_lang','harness_training_lang_cfg'].forEach(k => localStorage.removeItem(k));
              } catch (e) {}
              if (window.deckGoTo) window.deckGoTo(0);
            }"""
        )
        await ensure_lang(page, args.lang)
        await page.wait_for_timeout(400)

        await capture_hero(page)
        await ensure_lang(page, args.lang)
        await capture_flip(page)
        await ensure_lang(page, args.lang)
        await capture_layouts(page)
        await ensure_lang(page, args.lang)
        await capture_stage(page)
        await ensure_lang(page, args.lang)
        await capture_themes(page)
        await ensure_lang(page, args.lang)
        await capture_chrome(page)

        await browser.close()
    print(f"done lang={args.lang} out={OUT}")


if __name__ == "__main__":
    asyncio.run(main())
