# -*- coding: utf-8 -*-
"""Capture comprehensive README PNG screenshots (features + multi-theme)."""
from __future__ import annotations

import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

REPO = Path(__file__).resolve().parents[1]
HTML = REPO / "docs" / "harness_training.html"
OUT = REPO / "docs" / "assets" / "screenshots"

# (filename, slide_index, settle_ms, optional async setup name)
SHOTS = [
    # Narrative & layouts
    ("01-cover.png", 0, 1100, None),
    ("02-toc.png", 1, 800, None),
    ("03-story-figure.png", 9, 900, None),           # Harness 是什么
    ("04-layout-cards.png", 7, 800, None),          # 三大痛点
    ("05-layout-contrast.png", 18, 800, None),      # 模块一 Contrast
    ("06-layout-steps.png", 13, 800, None),         # Harness 工程 Steps
    ("07-layout-quote.png", 15, 800, None),         # 公式 Quote
    ("08-layout-overlay.png", 16, 900, None),       # 公式总览 Overlay
    ("09-layout-media-top.png", 12, 800, None),     # 上下文工程
    ("10-layout-nested.png", 14, 800, None),        # 层层包含
    ("11-stage-table.png", 26, 1400, None),         # Stage + row pulse settle
    ("12-practice-framework.png", 25, 900, None),   # 实践框架
    ("13-demo-video.png", 3, 900, None),            # 自动化演示
    ("14-live-cmd.png", 5, 800, None),              # 现场跑全量
    ("15-case-cards.png", 10, 800, None),           # 为什么火了
    ("16-section-break.png", 17, 700, None),        # 03 架构
    # Chrome / tools
    ("20-chrome-rail.png", 0, 600, "rail"),
    ("21-chrome-grid.png", 0, 900, "grid"),
    ("22-chrome-annotate.png", 9, 700, "annotate"),
    ("23-present-mode.png", 0, 700, "present"),
    ("24-theme-picker.png", 0, 600, "picker"),
    # Multi-theme cover gallery (dark + light)
    ("30-theme-01-deep-space.png", 0, 650, "theme:1"),
    ("31-theme-03-obsidian-amber.png", 0, 650, "theme:3"),
    ("32-theme-07-coral-reef.png", 0, 650, "theme:7"),
    ("33-theme-11-terminal-green.png", 0, 650, "theme:11"),
    ("34-theme-12-deep-ocean.png", 0, 650, "theme:12"),
    ("35-theme-17-graphite.png", 0, 650, "theme:17"),
    ("36-theme-05-polar-ice.png", 0, 650, "theme:5"),
    ("37-theme-08-blueprint.png", 0, 650, "theme:8"),
    ("38-theme-14-porcelain.png", 0, 650, "theme:14"),
    ("39-theme-20-studio-bw.png", 0, 650, "theme:20"),
]


async def reset_chrome(page) -> None:
    await page.evaluate(
        """() => {
          document.documentElement.classList.remove('rail-open', 'grid-open', 'present-mode', 'footer-peek');
          const wrap = document.getElementById('themeWrap');
          if (wrap) wrap.classList.remove('open');
          const bar = document.getElementById('annotateBar');
          if (bar) {
            bar.classList.remove('show');
            bar.style.display = 'none';
          }
          const layer = document.getElementById('annotateLayer');
          if (layer) {
            layer.setAttribute('aria-hidden', 'true');
            layer.style.opacity = '0';
            layer.style.pointerEvents = 'none';
          }
          const canvas = document.getElementById('annotateCanvas');
          if (canvas) canvas.style.pointerEvents = 'none';
        }"""
    )
    try:
        await page.keyboard.press("Escape")
    except Exception:
        pass
    await page.wait_for_timeout(120)


async def apply_setup(page, setup: str | None) -> None:
    if not setup:
        return
    await reset_chrome(page)
    if setup == "rail":
        await page.click("#railBtn", force=True)
        await page.wait_for_timeout(500)
    elif setup == "grid":
        await page.click("#gridBtn", force=True)
        await page.wait_for_timeout(700)
    elif setup == "annotate":
        await page.click("#annotateBtn", force=True)
        await page.wait_for_timeout(400)
        await page.evaluate(
            """() => {
              const layer = document.getElementById('annotateLayer');
              if (layer) layer.style.pointerEvents = 'auto';
              const bar = document.getElementById('annotateBar');
              if (bar) bar.style.display = '';
            }"""
        )
    elif setup == "present":
        await page.evaluate(
            """() => {
              document.documentElement.classList.add('present-mode');
              const btn = document.getElementById('presentBtn');
              if (btn) {
                btn.classList.add('primary');
                btn.innerHTML = '<i data-lucide=\"presentation\" class=\"icon\"></i>演示中';
              }
            }"""
        )
        await page.wait_for_timeout(450)
    elif setup == "picker":
        await page.evaluate(
            """() => {
              const wrap = document.getElementById('themeWrap');
              if (wrap) wrap.classList.add('open');
            }"""
        )
        await page.wait_for_timeout(350)
    elif setup.startswith("theme:"):
        tid = setup.split(":", 1)[1]
        await page.evaluate(
            f"""() => {{
              const btn = document.querySelector('.theme-swatch[data-theme="{tid}"]');
              if (btn) btn.click();
              const wrap = document.getElementById('themeWrap');
              if (wrap) wrap.classList.remove('open');
            }}"""
        )
        await page.wait_for_timeout(400)


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    uri = HTML.resolve().as_uri()
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(
            viewport={"width": 1600, "height": 900},
            device_scale_factor=1.15,
        )
        await page.goto(uri, wait_until="domcontentloaded")
        await page.wait_for_timeout(900)
        await page.evaluate(
            """() => {
              try {
                ['harness_training_theme','harness_training_theme_cfg',
                 'harness_training_particles','harness_training_bgm'].forEach(k => localStorage.removeItem(k));
              } catch (e) {}
              if (window.deckGoTo) window.deckGoTo(0);
            }"""
        )
        await page.wait_for_timeout(400)
        # baseline theme 3 (demo default look)
        await apply_setup(page, "theme:3")

        for name, idx, settle, setup in SHOTS:
            await reset_chrome(page)
            await page.evaluate(f"() => window.deckGoTo && window.deckGoTo({idx})")
            await page.wait_for_timeout(settle)
            await apply_setup(page, setup)
            path = OUT / name
            await page.screenshot(path=str(path), full_page=False)
            print(f"wrote {path.name}")

        await reset_chrome(page)
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
