# Tech Training Deck · autohtml-ppt

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-xiaoyutoucom-181717?logo=github)](https://github.com/xiaoyutoucom/autohtml-ppt)
[![Gitee](https://img.shields.io/badge/Gitee-xiaoyutou__647-C71D23?logo=gitee)](https://gitee.com/xiaoyutou_647/autohtml-ppt)
[![Offline](https://img.shields.io/badge/offline-file%3A%2F%2F%20ready-success)](#quick-start)
[![Sponsors](https://img.shields.io/badge/Sponsors-welcome-ea4aaa?logo=githubsponsors)](./SPONSORS.md)

**English** | [简体中文](./README.zh-CN.md)

> Beautiful, flipable **single-file HTML slide decks** for technical training — a modern PowerPoint alternative that runs offline, exports PPTX, and is authored as modular pages **any mainstream AI coding agent** can maintain — not Cursor-only.

**Author:** [xiaoyutoucom](https://github.com/xiaoyutoucom) · © 2026 xiaoyutoucom · Contact: [xiaoyutoucom@gmail.com](mailto:xiaoyutoucom@gmail.com)

**Sponsors / paid help:** [SPONSORS.md](./SPONSORS.md) · [SERVICES.md](./SERVICES.md) (themes, custom decks, white-label)

<p align="center">
  <img src="docs/assets/screenshots/preview.gif" alt="Tech Training Deck preview — flipable HTML slides" width="900" />
  <br />
  <em>Hero preview — cover → TOC → story → contrast layout → Stage row pulse</em>
</p>

### Works with Cursor · Claude Code · Codex · and more

The authoring spec lives as plain Markdown under [`docs/skills/tech-training-deck/`](docs/skills/tech-training-deck/SKILL.md).  
Point your agent at that folder (or paste / `@` the `SKILL.md`) — **no Cursor-proprietary runtime required**.

| Tool | How to use this project |
|------|-------------------------|
| **Cursor** | Project skill path or personal skill bridge → read `SKILL.md` |
| **Claude Code (CC)** | `claude` in repo; ask it to follow `docs/skills/tech-training-deck/SKILL.md` |
| **OpenAI Codex / ChatGPT coding** | Open the repo; instruct: follow `docs/skills/tech-training-deck/` |
| **GitHub Copilot / Windsurf / Continue / Aider / Cline** | Same: load the skill docs + edit `docs/deck/` |
| **Any LLM chat** | Attach `SKILL.md` + `layouts.md` + the slide you want changed |

Deck source is ordinary HTML/CSS/JS + a Python build — every agent that can edit files can ship slides.

---

## Why this project?

Most “HTML PPT” tools are either too bare (Markdown → static slides) or too heavy (full React apps + CDN).  
**Tech Training Deck** sits in the sweet spot for **internal tech talks, Harness/Agent workshops, and reusable training templates**:

| Pain with classic PPT | What you get here |
|----------------------|-------------------|
| Ugly defaults, hard to brand | 20 built-in themes (dark & light), neon HUD aesthetic |
| No motion / weak demo feel | Per-slide particles, AI ambient chips, row-pulse tables |
| Offline training rooms fail on CDN | All vendors vendored under `docs/assets/vendor/` |
| Hard for AI to edit a 4000-line HTML | Modular `docs/deck/` + portable skill (Cursor / CC / Codex / …) |
| Need a real PPT file afterward | One-click browser export or Playwright CLI → PPTX |

This repository ships a **complete demo deck** (Harness Engineering training, 33 slides) so you can open and feel the product immediately — then replace content with your own course.

---

## Screenshots & GIFs — full highlight tour

### Animated demos

| | |
|--|--|
| <img src="docs/assets/screenshots/preview-flip.gif" width="440" alt="Page flip" /><br />**Page flip** — cover → TOC → cards → story → media → quote → overlay → contrast → Stage → live command | <img src="docs/assets/screenshots/preview-layouts.gif" width="440" alt="Layouts" /><br />**Layout pack** — Cards / Contrast / Steps / Quote / Overlay / Media-top / Story / Table |
| <img src="docs/assets/screenshots/preview-stage.gif" width="440" alt="Stage pulse" /><br />**Stage row pulse** — S0–S9 table lights up row-by-row for live teaching | <img src="docs/assets/screenshots/preview-themes.gif" width="440" alt="Themes" /><br />**20 themes** — dark + light cycling in the style picker (`T`) |
| <img src="docs/assets/screenshots/preview-chrome.gif" width="440" alt="Chrome tools" /><br />**Presenter chrome** — thumbnail rail (`S`) → grid (`G`) → pen (`A`) → present mode (`F`) | <img src="docs/assets/screenshots/preview.gif" width="440" alt="Hero" /><br />**Hero loop** — narrative highlights in one short clip |

### 1) Cover, TOC & narrative

<p align="center"><img src="docs/assets/screenshots/01-cover.png" width="900" alt="Cover" /><br /><em>Cover — hero brand, particle/Vanta mesh, chapter preview cards, speaker + live talk time, provenance badge (top-right)</em></p>
<p align="center"><img src="docs/assets/screenshots/02-toc.png" width="900" alt="TOC" /><br /><em>Dedicated TOC board — jumpable chapter cards</em></p>
<p align="center"><img src="docs/assets/screenshots/16-section-break.png" width="900" alt="Section" /><br /><em>Section break slides — big outlined chapter numbers</em></p>
<p align="center"><img src="docs/assets/screenshots/03-story-figure.png" width="900" alt="Story" /><br /><em>Story layout — large figure + talking points (copyright-safe stick-figure art)</em></p>

### 2) Layout system (no more left-right fatigue)

| | |
|--|--|
| <img src="docs/assets/screenshots/04-layout-cards.png" width="440" alt="Cards" /><br />Cards | <img src="docs/assets/screenshots/05-layout-contrast.png" width="440" alt="Contrast" /><br />Contrast (Before / After) |
| <img src="docs/assets/screenshots/06-layout-steps.png" width="440" alt="Steps" /><br />Steps | <img src="docs/assets/screenshots/07-layout-quote.png" width="440" alt="Quote" /><br />Quote / formula center |
| <img src="docs/assets/screenshots/08-layout-overlay.png" width="440" alt="Overlay" /><br />Overlay (full-bleed figure) | <img src="docs/assets/screenshots/09-layout-media-top.png" width="440" alt="Media-top" /><br />Media-top |
| <img src="docs/assets/screenshots/10-layout-nested.png" width="440" alt="Nested" /><br />Nested / story reverse | <img src="docs/assets/screenshots/12-practice-framework.png" width="440" alt="Practice" /><br />Practice framework |

Also included in the engine (see skill `layouts.md`): **BigNumber · Split · Comparison · Icon-row · Hero**.

### 3) Teaching interactions

<p align="center"><img src="docs/assets/screenshots/11-stage-table.png" width="900" alt="Stage" /><br /><em>Stage table — `table.fw-table` + row-by-row `.is-lit` pulse (`data-row-pulse`)</em></p>
<p align="center"><img src="docs/assets/screenshots/15-case-cards.png" width="900" alt="Cases" /><br /><em>Success cases — summary + hover/focus detail (projectable orally)</em></p>
<p align="center"><img src="docs/assets/screenshots/13-demo-video.png" width="900" alt="Demo" /><br /><em>Demo video page — Space play/pause, pause on leave</em></p>
<p align="center"><img src="docs/assets/screenshots/14-live-cmd.png" width="900" alt="Commands" /><br /><em>Live command page — one-click copy for classroom runs</em></p>

### 4) Presenter chrome

| | |
|--|--|
| <img src="docs/assets/screenshots/20-chrome-rail.png" width="440" alt="Rail" /><br />Thumbnail rail (`S`) | <img src="docs/assets/screenshots/21-chrome-grid.png" width="440" alt="Grid" /><br />Grid overview (`G`) |
| <img src="docs/assets/screenshots/22-chrome-annotate.png" width="440" alt="Annotate" /><br />Pen / highlighter / eraser (`A`) | <img src="docs/assets/screenshots/23-present-mode.png" width="440" alt="Present" /><br />Present mode (`F`) + footer hot-zone |
| <img src="docs/assets/screenshots/24-theme-picker.png" width="440" alt="Picker" /><br />Theme picker (`T`) — 20 styles remembered | |

**Also in the product (see GIFs / shortcuts):** particles toggle (`P`), BGM (`M`), Export PPT, fullscreen, glossary hover tips, AI page chips, hover-grow cards/figures, provenance fingerprint, offline vendors, modular `docs/deck/` authoring, portable multi-agent skill, dual license.

### 5) Multi-theme gallery (dark + light)

| Dark | Light |
|------|-------|
| <img src="docs/assets/screenshots/30-theme-01-deep-space.png" width="420" alt="Theme 1" /><br />#1 深空青光 | <img src="docs/assets/screenshots/36-theme-05-polar-ice.png" width="420" alt="Theme 5" /><br />#5 极地冰原 |
| <img src="docs/assets/screenshots/31-theme-03-obsidian-amber.png" width="420" alt="Theme 3" /><br />#3 曜石琥珀 | <img src="docs/assets/screenshots/37-theme-08-blueprint.png" width="420" alt="Theme 8" /><br />#8 蓝图草稿 |
| <img src="docs/assets/screenshots/32-theme-07-coral-reef.png" width="420" alt="Theme 7" /><br />#7 珊瑚暗礁 | <img src="docs/assets/screenshots/38-theme-14-porcelain.png" width="420" alt="Theme 14" /><br />#14 瓷白墨线 |
| <img src="docs/assets/screenshots/33-theme-11-terminal-green.png" width="420" alt="Theme 11" /><br />#11 终端酸绿 | <img src="docs/assets/screenshots/39-theme-20-studio-bw.png" width="420" alt="Theme 20" /><br />#20 摄影棚黑白 |
| <img src="docs/assets/screenshots/34-theme-12-deep-ocean.png" width="420" alt="Theme 12" /><br />#12 深海蓝渊 | |
| <img src="docs/assets/screenshots/35-theme-17-graphite.png" width="420" alt="Theme 17" /><br />#17 石墨信号 | |

All **20** themes live in `docs/assets/themes.css` (`T` to switch; remembered in `localStorage`; `config.json` sets the default).

Regenerate media after visual changes:

```powershell
python tools/capture_readme_shots.py   # PNG stills (features + themes)
python tools/capture_readme_gifs.py    # animated GIFs
```

---

## Key features (complete checklist)

| Area | Highlights |
|------|------------|
| **Navigation** | ←→ / Space / PgUp·PgDn, Home/End, page jump, `#sN`, click zones, first/last |
| **Present** | `F` larger type; footer hidden; bottom hot-zone peek; fullscreen separate |
| **Chrome** | `S` rail · `G` grid · `A` pen/highlighter/eraser (per-slide memory) |
| **Themes** | 20 dark/light styles · picker · config default · localStorage |
| **Particles** | One flavor per slide · `P` toggle · cover Vanta.NET + cursor glow |
| **AI ambient** | Page-aware floating chips / rails / nodes / token stream |
| **Motion** | anime.js + Animate.css entrances · flow/table/code `.is-lit` sequences |
| **Stage pulse** | Auto for Stage / practice tables · or `data-row-pulse="1"` |
| **Hover grow** | Cards / panels / formulas / story·media·hero figures |
| **Layouts** | Cards · Contrast · Steps · Quote · Overlay · Media-top · Story · BigNumber · Split · Comparison · Icon-row · Hero |
| **Demo & cmd** | Video pages · copyable live commands |
| **Glossary / cases** | Term hover tips · case-card expand details |
| **Export** | Browser PPT (tab capture preferred) · Playwright CLI high-fidelity |
| **Config** | `config.json` runtime load (HTTP) · speaker · BGM · particles · theme |
| **Provenance** | Public fingerprint badge · `TTD-2026-XIAOYUTOUCOM` |
| **Offline** | Vendored libs under `docs/assets/vendor/` · `file://` OK |
| **Authoring** | Modular `docs/deck/` · `build_deck.py` · portable skill for Cursor/CC/Codex/… |
| **License** | MIT · sponsors & paid services welcome (`SPONSORS.md` / `SERVICES.md`) |

---

## Quick start

### 1) Open the demo

```powershell
# From repo root
start docs\harness_training.html
```

Or serve `docs/` with Live Server / `npx serve docs` (recommended for hot-reload of `config.json`).

### 2) Keyboard cheatsheet

| Key | Action |
|-----|--------|
| ← → / Space / PgUp PgDn | Navigate |
| `T` | Theme picker |
| `P` | Particles on/off |
| `M` | Background music |
| `F` | Present mode |
| `S` / `G` / `A` | Rail / grid / annotate |
| Esc | Close overlays |

### 3) Edit a slide

1. Edit `docs/deck/slides/XX-*.html` (and optional `.css`)  
2. Register new pages in `docs/deck/manifest.json` + particle/chip maps in `docs/deck/js/deck.js`  
3. Build:

```powershell
python tools/build_deck.py
```

### 4) Export PPTX (CLI, high fidelity)

```powershell
pip install -r requirements.txt
playwright install chromium
python -m tools.export_training_ppt
```

---

## Project structure

```text
autohtml-ppt/
├── README.md / README.zh-CN.md
├── SPONSORS.md / SERVICES.md  # Sponsorship & paid customization
├── requirements.txt
├── docs/
│   ├── harness_training.html  # Built demo (open this)
│   ├── deck/                  # ★ Authoritative source
│   │   ├── config.json        # theme / particles / speaker / bgm
│   │   ├── provenance.json    # public fingerprint & attribution
│   │   ├── styles/base.css
│   │   ├── js/deck.js
│   │   ├── slides/            # one html(+css) per page
│   │   └── manifest.json
│   ├── assets/
│   │   ├── screenshots/       # README images
│   │   ├── themes.css
│   │   └── vendor/            # offline libs
│   └── skills/tech-training-deck/
└── tools/
    ├── build_deck.py
    ├── capture_readme_shots.py
    └── export_training_ppt.py
```

---

## Advantages vs alternatives

| | PowerPoint / Keynote | Reveal.js / Slidev | **Tech Training Deck** |
|--|---------------------|--------------------|-------------------------|
| Offline classroom | ✅ | ⚠️ often CDN | ✅ vendored |
| Cinematic training look | manual | theme-dependent | ✅ built-in HUD + particles |
| Export real PPTX | native | limited | ✅ browser + Playwright |
| AI-friendly page edits | poor | medium | ✅ modular deck + multi-agent skill |
| Annotate / overview / present hot-zone | add-ins | plugins | ✅ built-in |
| MIT + AI-agent authoring skill | N/A | varies | ✅ portable skill docs |

---

## Sponsors

Voluntary support keeps the project moving — **not required to use the software**.

See **[SPONSORS.md](./SPONSORS.md)** for GitHub Sponsors, 爱发电 (Afdian), and WeChat tip options.

Need custom work? **[SERVICES.md](./SERVICES.md)** — paid themes, full training decks, white-label (remove attribution fingerprint).

---

## License

Released under the **[MIT License](./LICENSE)**. Personal and company use (including commercial) is allowed.

Please keep copyright notices when you redistribute. The public provenance badge (`TTD-2026-XIAOYUTOUCOM` in `docs/deck/provenance.json`) helps attribution and discovery; removing it for a client deliverable can be arranged as a paid white-label service.

**Mirrors:** [GitHub](https://github.com/xiaoyutoucom/autohtml-ppt) · [Gitee](https://gitee.com/xiaoyutou_647/autohtml-ppt)

---

## Roadmap ideas

- Blank “starter deck” template without Harness-specific narrative  
- English sample course pack  
- Theme packs / white-label packaging as a service  

---

## Support

- Issues: GitHub / Gitee  
- Email: [xiaoyutoucom@gmail.com](mailto:xiaoyutoucom@gmail.com)  
- Sponsors: [SPONSORS.md](./SPONSORS.md) · Paid services: [SERVICES.md](./SERVICES.md)

---

© 2026 xiaoyutoucom · Fingerprint `TTD-2026-XIAOYUTOUCOM`
