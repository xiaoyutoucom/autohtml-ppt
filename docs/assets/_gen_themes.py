# -*- coding: utf-8 -*-
"""Generate docs/assets/themes.css — run once, then delete if desired."""
from __future__ import annotations

import json
from pathlib import Path

themes = [
    dict(id=1, name="深空青光", mode="dark", ink="#e8f4ff", ink_soft="#c8dced", muted="#9eb8d0", paper="#060a10", paper2="#0a1018", panel="rgba(10,18,30,0.82)", line="rgba(34,211,238,0.2)", teal="#2dd4bf", teal_deep="#14b8a6", neon="#22d3ee", signal="#fb923c", ok="#4ade80", warn="#fbbf24", danger="#f87171", bg_top="#080d14", ga="rgba(34,211,238,0.16)", gb="rgba(251,146,60,0.12)", gc="rgba(45,212,191,0.06)", radius="18px", scan="0.045", hud="1", grid="0.06"),
    dict(id=2, name="墨玉翠绿", mode="dark", ink="#e6fff4", ink_soft="#b8e0cc", muted="#86b59e", paper="#06140f", paper2="#0a1c14", panel="rgba(8,28,20,0.86)", line="rgba(52,211,153,0.22)", teal="#34d399", teal_deep="#059669", neon="#6ee7b7", signal="#f59e0b", ok="#4ade80", warn="#fbbf24", danger="#f87171", bg_top="#071a12", ga="rgba(52,211,153,0.18)", gb="rgba(245,158,11,0.10)", gc="rgba(16,185,129,0.08)", radius="16px", scan="0.03", hud="1", grid="0.05"),
    dict(id=3, name="曜石琥珀", mode="dark", ink="#fff7ed", ink_soft="#e6d0b0", muted="#b89a78", paper="#120c08", paper2="#1a120c", panel="rgba(28,18,10,0.88)", line="rgba(251,191,36,0.22)", teal="#fbbf24", teal_deep="#d97706", neon="#fcd34d", signal="#fb7185", ok="#86efac", warn="#fbbf24", danger="#f87171", bg_top="#1a1008", ga="rgba(251,191,36,0.16)", gb="rgba(251,113,133,0.10)", gc="rgba(217,119,6,0.08)", radius="14px", scan="0.035", hud="1", grid="0.05"),
    dict(id=4, name="工业板岩", mode="dark", ink="#e8eef5", ink_soft="#c5cfdb", muted="#96a3b3", paper="#0f141a", paper2="#151c24", panel="rgba(20,28,36,0.9)", line="rgba(148,163,184,0.28)", teal="#94a3b8", teal_deep="#64748b", neon="#cbd5e1", signal="#38bdf8", ok="#4ade80", warn="#fbbf24", danger="#f87171", bg_top="#121820", ga="rgba(148,163,184,0.12)", gb="rgba(56,189,248,0.10)", gc="rgba(100,116,139,0.08)", radius="10px", scan="0.02", hud="0.7", grid="0.04"),
    dict(id=5, name="极地冰原", mode="light", ink="#0f2744", ink_soft="#3d5a73", muted="#5c738a", paper="#eef6fb", paper2="#e2eef7", panel="rgba(255,255,255,0.82)", line="rgba(14,116,144,0.18)", teal="#0e7490", teal_deep="#155e75", neon="#0284c7", signal="#c2410c", ok="#15803d", warn="#b45309", danger="#b91c1c", bg_top="#f5fafc", ga="rgba(2,132,199,0.12)", gb="rgba(194,65,12,0.08)", gc="rgba(14,116,144,0.06)", radius="20px", scan="0", hud="0.35", grid="0.04"),
    dict(id=6, name="雨林夜色", mode="dark", ink="#ecfdf5", ink_soft="#c0dbcc", muted="#8fb5a0", paper="#0a1610", paper2="#102018", panel="rgba(12,32,22,0.88)", line="rgba(74,222,128,0.2)", teal="#4ade80", teal_deep="#16a34a", neon="#86efac", signal="#f97316", ok="#4ade80", warn="#fbbf24", danger="#f87171", bg_top="#0c1a12", ga="rgba(74,222,128,0.14)", gb="rgba(249,115,22,0.10)", gc="rgba(22,163,74,0.07)", radius="22px", scan="0.04", hud="1", grid="0.045"),
    dict(id=7, name="珊瑚暗礁", mode="dark", ink="#fff1f2", ink_soft="#e8c4cb", muted="#b89098", paper="#140a0e", paper2="#1c1014", panel="rgba(32,14,20,0.88)", line="rgba(244,114,182,0.22)", teal="#fb7185", teal_deep="#e11d48", neon="#fda4af", signal="#22d3ee", ok="#4ade80", warn="#fbbf24", danger="#fb7185", bg_top="#1a0c12", ga="rgba(251,113,133,0.16)", gb="rgba(34,211,238,0.10)", gc="rgba(244,114,182,0.08)", radius="18px", scan="0.04", hud="1", grid="0.05"),
    dict(id=8, name="蓝图草稿", mode="light", ink="#0b1f3a", ink_soft="#35506e", muted="#5a7190", paper="#e8f0fa", paper2="#dce7f5", panel="rgba(255,255,255,0.78)", line="rgba(37,99,235,0.2)", teal="#2563eb", teal_deep="#1d4ed8", neon="#3b82f6", signal="#ea580c", ok="#16a34a", warn="#ca8a04", danger="#dc2626", bg_top="#f0f5fc", ga="rgba(37,99,235,0.10)", gb="rgba(234,88,12,0.07)", gc="rgba(59,130,246,0.06)", radius="8px", scan="0", hud="0.4", grid="0.07"),
    dict(id=9, name="碳纤维红", mode="dark", ink="#f5f5f5", ink_soft="#d0d0d0", muted="#a8a8a8", paper="#0a0a0a", paper2="#121212", panel="rgba(18,18,18,0.92)", line="rgba(239,68,68,0.28)", teal="#ef4444", teal_deep="#b91c1c", neon="#f87171", signal="#fbbf24", ok="#4ade80", warn="#fbbf24", danger="#ef4444", bg_top="#0e0e0e", ga="rgba(239,68,68,0.14)", gb="rgba(251,191,36,0.08)", gc="rgba(120,120,120,0.06)", radius="6px", scan="0.05", hud="1", grid="0.035"),
    dict(id=10, name="暖砂工坊", mode="light", ink="#2a2118", ink_soft="#5c4e3d", muted="#7a6a56", paper="#f3ebe1", paper2="#ebe0d2", panel="rgba(255,252,247,0.86)", line="rgba(180,83,9,0.18)", teal="#b45309", teal_deep="#92400e", neon="#c2410c", signal="#0f766e", ok="#166534", warn="#b45309", danger="#b91c1c", bg_top="#f7f1e8", ga="rgba(194,65,12,0.10)", gb="rgba(15,118,110,0.08)", gc="rgba(180,83,9,0.06)", radius="16px", scan="0", hud="0.3", grid="0.035"),
    dict(id=11, name="终端酸绿", mode="dark", ink="#d1fae5", ink_soft="#a7f3c4", muted="#7aba96", paper="#020805", paper2="#06140c", panel="rgba(0,20,10,0.9)", line="rgba(74,222,128,0.35)", teal="#4ade80", teal_deep="#22c55e", neon="#4ade80", signal="#a3e635", ok="#4ade80", warn="#eab308", danger="#f87171", bg_top="#03100a", ga="rgba(74,222,128,0.14)", gb="rgba(163,230,53,0.08)", gc="rgba(34,197,94,0.06)", radius="4px", scan="0.08", hud="1", grid="0.08"),
    dict(id=12, name="深海蓝渊", mode="dark", ink="#e0f2fe", ink_soft="#a5e3ff", muted="#7ab4d4", paper="#020617", paper2="#0a1628", panel="rgba(8,20,40,0.9)", line="rgba(56,189,248,0.22)", teal="#38bdf8", teal_deep="#0284c7", neon="#7dd3fc", signal="#f472b6", ok="#4ade80", warn="#fbbf24", danger="#f87171", bg_top="#04101f", ga="rgba(56,189,248,0.16)", gb="rgba(244,114,182,0.08)", gc="rgba(2,132,199,0.08)", radius="18px", scan="0.04", hud="1", grid="0.05"),
    dict(id=13, name="铜作车间", mode="dark", ink="#f5e6d3", ink_soft="#dbc098", muted="#b8966e", paper="#1a120c", paper2="#241810", panel="rgba(36,24,14,0.9)", line="rgba(217,119,6,0.28)", teal="#d97706", teal_deep="#b45309", neon="#f59e0b", signal="#14b8a6", ok="#86efac", warn="#fbbf24", danger="#f87171", bg_top="#20160e", ga="rgba(217,119,6,0.16)", gb="rgba(20,184,166,0.08)", gc="rgba(180,83,9,0.08)", radius="12px", scan="0.03", hud="0.8", grid="0.04"),
    dict(id=14, name="瓷白墨线", mode="light", ink="#111827", ink_soft="#4b5563", muted="#6b7280", paper="#f8fafc", paper2="#f1f5f9", panel="rgba(255,255,255,0.92)", line="rgba(15,23,42,0.12)", teal="#0f172a", teal_deep="#1e293b", neon="#334155", signal="#dc2626", ok="#15803d", warn="#b45309", danger="#b91c1c", bg_top="#ffffff", ga="rgba(15,23,42,0.04)", gb="rgba(220,38,38,0.05)", gc="rgba(51,65,85,0.04)", radius="12px", scan="0", hud="0.25", grid="0.03"),
    dict(id=15, name="岩浆余烬", mode="dark", ink="#fff1f0", ink_soft="#f0ccc4", muted="#c49286", paper="#140808", paper2="#1c0c0c", panel="rgba(36,12,12,0.9)", line="rgba(249,115,22,0.28)", teal="#f97316", teal_deep="#c2410c", neon="#fb923c", signal="#facc15", ok="#4ade80", warn="#fbbf24", danger="#ef4444", bg_top="#1a0a08", ga="rgba(249,115,22,0.18)", gb="rgba(250,204,21,0.08)", gc="rgba(194,65,12,0.10)", radius="16px", scan="0.04", hud="1", grid="0.045"),
    dict(id=16, name="冰川雾霭", mode="light", ink="#1e3a4c", ink_soft="#4a6a7c", muted="#6b8696", paper="#edf4f7", paper2="#e2ecf1", panel="rgba(255,255,255,0.8)", line="rgba(100,116,139,0.2)", teal="#475569", teal_deep="#334155", neon="#0ea5e9", signal="#db2777", ok="#059669", warn="#d97706", danger="#e11d48", bg_top="#f4f8fa", ga="rgba(14,165,233,0.10)", gb="rgba(219,39,119,0.06)", gc="rgba(71,85,105,0.05)", radius="24px", scan="0", hud="0.3", grid="0.03"),
    dict(id=17, name="石墨信号", mode="dark", ink="#f4f4f5", ink_soft="#c4c4cc", muted="#9a9aa4", paper="#18181b", paper2="#27272a", panel="rgba(39,39,42,0.92)", line="rgba(250,204,21,0.25)", teal="#facc15", teal_deep="#ca8a04", neon="#fde047", signal="#f97316", ok="#4ade80", warn="#facc15", danger="#f87171", bg_top="#1c1c1f", ga="rgba(250,204,21,0.12)", gb="rgba(249,115,22,0.08)", gc="rgba(161,161,170,0.06)", radius="8px", scan="0.025", hud="0.6", grid="0.04"),
    dict(id=18, name="青玉金阙", mode="dark", ink="#ecfdf5", ink_soft="#c4f8e0", muted="#88b8a4", paper="#052e26", paper2="#064e3b", panel="rgba(6,50,40,0.9)", line="rgba(212,175,55,0.28)", teal="#d4af37", teal_deep="#b8860b", neon="#f0d78c", signal="#34d399", ok="#6ee7b7", warn="#fbbf24", danger="#f87171", bg_top="#06352c", ga="rgba(212,175,55,0.14)", gb="rgba(52,211,153,0.10)", gc="rgba(184,134,11,0.08)", radius="14px", scan="0.03", hud="1", grid="0.04"),
    dict(id=19, name="落日线路", mode="dark", ink="#fff7ed", ink_soft="#ffd0a0", muted="#c4946e", paper="#1c0a14", paper2="#2a1020", panel="rgba(40,16,28,0.9)", line="rgba(251,146,60,0.28)", teal="#fb923c", teal_deep="#ea580c", neon="#fdba74", signal="#f43f5e", ok="#4ade80", warn="#fbbf24", danger="#f43f5e", bg_top="#220c18", ga="rgba(251,146,60,0.16)", gb="rgba(244,63,94,0.10)", gc="rgba(234,88,12,0.08)", radius="18px", scan="0.04", hud="1", grid="0.05"),
    dict(id=20, name="摄影棚黑白", mode="light", ink="#0a0a0a", ink_soft="#404040", muted="#666666", paper="#f0f0f0", paper2="#e6e6e6", panel="rgba(255,255,255,0.95)", line="rgba(0,0,0,0.14)", teal="#111111", teal_deep="#000000", neon="#222222", signal="#000000", ok="#166534", warn="#854d0e", danger="#991b1b", bg_top="#fafafa", ga="rgba(0,0,0,0.04)", gb="rgba(0,0,0,0.03)", gc="rgba(0,0,0,0.02)", radius="2px", scan="0", hud="0.2", grid="0.05"),
]

# 暗色主题：灰字→白；原白字→亮黄（适配主体黄/琥珀，导出 PPT 可读）
# 亮色主题：正文/软字用深色，muted 略浅但仍可读（禁止浅底配白字）
for _t in themes:
    if _t["mode"] == "dark":
        _t["ink"] = "#fde047"
        _t["ink_soft"] = "#ffffff"
        _t["muted"] = "#ffffff"
    else:
        # ink 保持色板深色；软字略浅一级，仍远高于灰白对比度
        _t["ink_soft"] = _t["ink"]
        # muted 用原色板 muted（比 ink 稍淡），勿改成白
        pass

lines: list[str] = []
lines.append("/* 20 套培训页主题：html[data-theme=\"N\"] */")
lines.append(":root {")
lines.append('  --theme-name: "深空青光";')
lines.append("  --bg-top: #080d14;")
lines.append("  --glow-a: rgba(34,211,238,0.16);")
lines.append("  --glow-b: rgba(251,146,60,0.12);")
lines.append("  --glow-c: rgba(45,212,191,0.06);")
lines.append("  --grid-alpha: 0.06;")
lines.append("  --scan-opacity: 0.045;")
lines.append("  --hud-opacity: 1;")
lines.append("}")
lines.append("")

meta = []
for t in themes:
    sel = f'html[data-theme="{t["id"]}"]'
    lines.append(f"{sel} {{")
    lines.append(f'  --theme-name: "{t["name"]}";')
    lines.append(f'  --theme-mode: {t["mode"]};')
    for key, css in [
        ("ink", "--ink"),
        ("ink_soft", "--ink-soft"),
        ("muted", "--muted"),
        ("paper", "--paper"),
        ("paper2", "--paper-2"),
        ("panel", "--panel"),
        ("line", "--line"),
        ("teal", "--teal"),
        ("teal_deep", "--teal-deep"),
        ("neon", "--neon"),
        ("signal", "--signal"),
        ("ok", "--ok"),
        ("warn", "--warn"),
        ("danger", "--danger"),
        ("bg_top", "--bg-top"),
        ("ga", "--glow-a"),
        ("gb", "--glow-b"),
        ("gc", "--glow-c"),
        ("radius", "--radius"),
        ("scan", "--scan-opacity"),
        ("hud", "--hud-opacity"),
        ("grid", "--grid-alpha"),
    ]:
        lines.append(f"  {css}: {t[key]};")
    if t["mode"] == "light":
        lines.append("  --shadow: 0 14px 36px rgba(15, 23, 42, 0.1);")
        lines.append("  --glow: none;")
        lines.append(f'  --neon-soft: color-mix(in srgb, {t["neon"]} 28%, transparent);')
    else:
        lines.append("  --shadow: 0 18px 50px rgba(0, 0, 0, 0.45);")
        lines.append(f'  --glow: 0 0 24px color-mix(in srgb, {t["neon"]} 28%, transparent);')
        lines.append(f'  --neon-soft: color-mix(in srgb, {t["neon"]} 35%, transparent);')
    lines.append("}")
    lines.append("")
    meta.append(
        {
            "id": t["id"],
            "name": t["name"],
            "mode": t["mode"],
            "swatch": t["neon"],
            "paper": t["paper"],
            "ink": t["ink"],
        }
    )

lines.append(
    """
body::before {
  background:
    radial-gradient(900px 520px at 0% 0%, var(--glow-a), transparent 55%),
    radial-gradient(800px 480px at 100% 100%, var(--glow-b), transparent 50%),
    radial-gradient(600px 400px at 50% 50%, var(--glow-c), transparent 60%),
    linear-gradient(180deg, var(--bg-top) 0%, var(--paper) 45%, var(--paper-2) 100%) !important;
}
body::after {
  background-image:
    linear-gradient(color-mix(in srgb, var(--neon) calc(var(--grid-alpha) * 100%), transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--neon) calc(var(--grid-alpha) * 100%), transparent) 1px, transparent 1px) !important;
}
.scanlines {
  opacity: var(--scan-opacity) !important;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    color-mix(in srgb, var(--neon) 50%, transparent) 2px,
    color-mix(in srgb, var(--neon) 50%, transparent) 3px
  ) !important;
}
.hud-frame {
  opacity: var(--hud-opacity);
  border-color: color-mix(in srgb, var(--neon) 18%, transparent) !important;
  box-shadow: inset 0 0 40px color-mix(in srgb, var(--neon) 8%, transparent) !important;
}
.hud-frame::before,
.hud-frame::after,
.hud-corner {
  border-color: color-mix(in srgb, var(--neon) 55%, transparent) !important;
}

.theme-wrap { position: relative; }
.theme-btn {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
}
.theme-panel {
  display: none;
  position: absolute;
  right: 0;
  bottom: calc(100% + .45rem);
  width: min(92vw, 28rem);
  max-height: min(70vh, 26rem);
  overflow: auto;
  padding: .75rem;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--panel);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
  z-index: 40;
}
.theme-wrap.open .theme-panel { display: block; }
.theme-panel h4 {
  font-family: var(--mono);
  font-size: .75rem;
  color: var(--muted);
  margin-bottom: .55rem;
  font-weight: 500;
}
.theme-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .45rem;
}
.theme-swatch {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px;
  padding: .45rem .4rem;
  cursor: pointer;
  text-align: left;
  min-height: 3.4rem;
  transition: transform .15s ease, outline-color .15s ease;
}
.theme-swatch:hover { transform: translateY(-1px); }
.theme-swatch.active {
  outline: 2px solid var(--neon);
  outline-offset: 1px;
}
.theme-swatch .n {
  display: block;
  font-family: var(--mono);
  font-size: .68rem;
  opacity: .75;
  margin-bottom: .15rem;
}
.theme-swatch .label {
  display: block;
  font-size: .72rem;
  font-weight: 600;
  line-height: 1.25;
}
"""
)

root = Path(__file__).resolve().parent
(root / "themes.css").write_text("\n".join(lines), encoding="utf-8")
(root / "themes.meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {len(themes)} themes -> themes.css")
