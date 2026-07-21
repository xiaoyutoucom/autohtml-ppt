/*!
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
  var FALLBACK = {
  "particles": true,
  "slideParticles": {
    "封面": "cover_mesh",
    "目录": "toc_constellation",
    "01 演示": "sec_demo_rise",
    "自动化演示": "demo_web_rain",
    "客户端演示": "demo_client_slash",
    "现场跑全量": "cmd_pulse",
    "02 认识": "sec_know_drift",
    "三大痛点": "pain_chaos",
    "更隐蔽的坑": "pit_scatter",
    "Harness 是什么": "harness_web",
    "为什么火了": "cases_bubbles",
    "提示词工程": "prompt_stars",
    "上下文工程": "context_mesh",
    "Harness 工程": "harness_eng_grid",
    "层层包含": "nest_layers",
    "公式": "formula_lift",
    "公式总览": "formula_ring",
    "03 架构": "sec_arch_beam",
    "模块一": "mod1_tri",
    "模块二": "mod2_stars",
    "模块三": "mod3_matrix",
    "模块四": "mod4_foam",
    "模块五": "mod5_spark",
    "本质收束": "essence_soft",
    "04 实践": "sec_practice_up",
    "实践框架": "practice_lattice",
    "Stage": "stage_codefall",
    "Progress": "progress_orbit",
    "Progress 实战": "progress_live",
    "Runner": "runner_burst",
    "Skill Rules Lint": "srl_glyphs",
    "闭环": "loop_flow",
    "思考与行动": "takeaway_snow",
    "开源与赞助": "sponsor_glow"
  },
  "theme": 3,
  "speaker": "y",
  "bgm": false,
  "bgmSrc": "dylanf - 卡农 (经典钢琴版).mp3"
};

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
