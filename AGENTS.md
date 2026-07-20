# Agent instructions (all tools)

This repo is maintained with a **portable skill** — not Cursor-only.

1. Read [`docs/skills/tech-training-deck/SKILL.md`](docs/skills/tech-training-deck/SKILL.md) first.
2. Edit source under **`docs/deck/`** (never only the built `docs/harness_training.html`).
3. After edits: `python tools/build_deck.py`
4. Demo: open `docs/harness_training.html` (prefer serving `docs/` over HTTP).

Works with: **Cursor**, **Claude Code**, **OpenAI Codex**, **GitHub Copilot**, **Windsurf**, **Continue**, **Aider**, **Cline**, and any agent that can read Markdown + edit files.

Details: `layouts.md` · `reference.md` · `sources.md` · `glossary.md` in the same skill folder.
