/*!
 * Deck i18n — zh / en
 * - UI chrome via data-i18n / data-i18n-title
 * - Slide body via data-en (Chinese remains default in HTML)
 * - Slide titles via TITLE_EN (data-title keys stay Chinese for particle maps)
 */
(function (w) {
  var LANG_KEY = "harness_training_lang";
  var LANG_CFG_KEY = "harness_training_lang_cfg";

  var TITLE_EN = {
    "封面": "Cover",
    "目录": "Contents",
    "01 演示": "01 Demo",
    "自动化演示": "Web automation demo",
    "客户端演示": "Client demo",
    "现场跑全量": "Live full run",
    "02 认识": "02 Understand",
    "三大痛点": "Three pain points",
    "更隐蔽的坑": "Hidden pitfalls",
    "Harness 是什么": "What is Harness",
    "为什么火了": "Why it took off",
    "提示词工程": "Prompt engineering",
    "上下文工程": "Context engineering",
    "Harness 工程": "Harness engineering",
    "层层包含": "Nested layers",
    "公式": "Formula",
    "公式总览": "Formula overview",
    "03 架构": "03 Architecture",
    "模块一": "Module 1",
    "模块二": "Module 2",
    "模块三": "Module 3",
    "模块四": "Module 4",
    "模块五": "Module 5",
    "本质收束": "Essence",
    "04 实践": "04 Practice",
    "实践框架": "Practice framework",
    "Stage": "Stage",
    "Progress": "Progress",
    "Progress 实战": "Progress in action",
    "Runner": "Runner",
    "Skill Rules Lint": "Skill Rules Lint",
    "闭环": "Closed loop",
    "思考与行动": "Takeaways",
    "开源与赞助": "Open source & sponsors",
    "效果库": "Effects gallery",
    "效果库总览": "Effects · catalog",
    "效果库·动画时间轴": "Effects · animation",
    "效果库·文字SVG": "Effects · text & SVG",
    "效果库·交互工具": "Effects · interaction"
  };

  var UI = {
    zh: {
      home: "首页",
      prev: "上一页",
      next: "下一页",
      end: "尾页",
      theme: "样式",
      themeN: "样式{n}",
      themePanel: "样式",
      themeHint: "悬停预览 · 点击应用",
      rail: "目录",
      grid: "总览",
      annotate: "画笔",
      particles: "粒子",
      particlesOff: "粒子·关",
      particlesPick: "选择粒子效果 (P)",
      particlePanel: "本页粒子",
      particleHint: "config.json → slideParticles",
      particleDefaultOff: "默认 · 关（全局）",
      particleDefault: "默认 · ",
      particlePageOff: "本页关闭",
      particleCopy: "复制配置",
      particleReset: "恢复配置文件",
      bgm: "音乐",
      bgmOn: "音乐开",
      bgmOff: "音乐关",
      bgmOpen: "打开背景音乐 (M)",
      bgmClose: "关闭背景音乐 (M)",
      bgmMissing: "未配置 bgmSrc",
      exportPpt: "导出PPT",
      present: "演示",
      presenting: "演示中",
      presentTitle: "演示模式 (F)",
      fs: "全屏",
      fsExit: "退出全屏",
      more: "更多",
      moreExpand: "展开工具",
      moreCollapse: "折叠工具",
      langTitle: "切换语言 / Language",
      homeTitle: "首页 (Home)",
      endTitle: "尾页 (End)",
      pageJump: "输入页码后回车跳转",
      pageAria: "页码",
      themeTitle: "切换样式 (T)",
      railTitle: "缩略图轨 (S)",
      gridTitle: "网格总览 (G)",
      annotateTitle: "画笔批注 (A)",
      exportTitle: "导出全部页：优先当前标签页截屏（含粒子），失败再 DOM 截图",
      toast:
        "S 缩略图 · G 总览 · A 画笔 · F 演示 · T 样式 · P 粒子 · L 语言 · M 音乐 · ← → 翻页",
      exportBusy: "正在导出 PPT…",
      railHead: "Slides · S",
      gridHead: "All slides · G",
      close: "关闭",
      annPen: "笔",
      annHigh: "荧光笔",
      annEraser: "橡皮",
      annUndo: "撤销",
      annClear: "清空",
      annDone: "完成",
      video: "视频",
      copied: "已复制",
      copy: "复制",
      speaker: "演讲人：",
      talkTime: "演讲时间：",
      talkTimer: "elapsed",
      talkTimerCurrent: "current time",
      fxReplay: "重播",
      light: "浅",
      dark: "深",
      off: "关闭",
      particleCurOff: "关闭",
      particleCurDefault: "默认 · ",
      particleCurCustom: "自选 · ",
      pageFallback: "第{n}页"
    },
    en: {
      home: "Home",
      prev: "Prev",
      next: "Next",
      end: "End",
      theme: "Theme",
      themeN: "Theme {n}",
      themePanel: "Themes",
      themeHint: "Hover preview · click apply",
      rail: "Slides",
      grid: "Grid",
      annotate: "Draw",
      particles: "FX",
      particlesOff: "FX·Off",
      particlesPick: "Particle FX (P)",
      particlePanel: "Particles",
      particleHint: "config.json → slideParticles",
      particleDefaultOff: "Default · Off (global)",
      particleDefault: "Default · ",
      particlePageOff: "Off on this slide",
      particleCopy: "Copy config",
      particleReset: "Reset to config",
      bgm: "Music",
      bgmOn: "Music on",
      bgmOff: "Music off",
      bgmOpen: "Play BGM (M)",
      bgmClose: "Mute BGM (M)",
      bgmMissing: "bgmSrc not set",
      exportPpt: "Export",
      present: "Present",
      presenting: "Live",
      presentTitle: "Present mode (F)",
      fs: "Fullscreen",
      fsExit: "Exit fullscreen",
      more: "More",
      moreExpand: "Expand tools",
      moreCollapse: "Collapse tools",
      langTitle: "Language / 切换语言",
      homeTitle: "First slide (Home)",
      endTitle: "Last slide (End)",
      pageJump: "Type a page number and press Enter",
      pageAria: "Page",
      themeTitle: "Theme (T)",
      railTitle: "Slide rail (S)",
      gridTitle: "Grid overview (G)",
      annotateTitle: "Annotate (A)",
      exportTitle: "Export all slides: prefer tab capture (with particles), else DOM screenshot",
      toast:
        "S rail · G grid · A draw · F present · T theme · P FX · L language · M music · ← → navigate",
      exportBusy: "Exporting PPT…",
      railHead: "Slides · S",
      gridHead: "All slides · G",
      close: "Close",
      annPen: "Pen",
      annHigh: "Marker",
      annEraser: "Eraser",
      annUndo: "Undo",
      annClear: "Clear",
      annDone: "Done",
      video: "Video",
      copied: "Copied",
      copy: "Copy",
      speaker: "Speaker: ",
      talkTime: "Talk time: ",
      talkTimer: "elapsed",
      talkTimerCurrent: "current time",
      fxReplay: "Replay",
      light: "Light",
      dark: "Dark",
      off: "Off",
      particleCurOff: "Off",
      particleCurDefault: "Default · ",
      particleCurCustom: "Custom · ",
      pageFallback: "Slide {n}"
    }
  };

  var AI_CHIPS_EN = {
    "封面": ["Harness", "Agent", "Five modules", "This repo", "Horse harness", "Model+Harness", "Demo open", "Three leaps", "Progress", "Lint"],
    "目录": ["Demo", "Understand Harness", "Five modules", "This repo", "Five-piece kit", "CHAPTER 01", "CHAPTER 02", "CHAPTER 03", "CHAPTER 04", "Agenda"],
    "01 演示": ["Web Demo", "Client", "SPECCONFIG", "pytest_cli", "Opener", "Live video", "One command", "Full suite", "See it first", "Then theory"],
    "自动化演示": ["Web automation", "Playwright", "Live video", "Demo", "Video open", "Space to play", "headed", "Browser", "mp4", "Demo · Web"],
    "客户端演示": ["Client", "Live video", "Demo", "Local mp4", "Demo · Client", "Space to play", "Pause on nav", "Live demo", "Playwright", "headed"],
    "三大痛点": ["Drift", "Forgotten contracts", "Worse fixes", "Rewrite layout", "Behavior layer", "1000 lines", "New bugs", "Single-file", "Style traps", "Why Harness"],
    "效果库": ["Anime.js", "v4 Docs", "Effects", "Gallery", "Timer", "Timeline", "Text", "SVG", "Draggable", "Easings"],
    "效果库总览": ["Getting started", "Timer", "Animation", "Timeline", "Draggable", "Layout", "Text", "SVG", "Utilities", "Engine"],
    "效果库·动画时间轴": ["animate", "createSpring", "stagger", "createTimeline", "keyframes", "transforms", "alternate", "playbackRate", "createTimer", "loop"],
    "效果库·文字SVG": ["splitText", "chars", "words", "scrambleText", "createDrawable", "morphTo", "createMotionPath", "SVG", "Text", "draw"],
    "效果库·交互工具": ["createDraggable", "createAnimatable", "createLayout", "createScope", "easings", "random", "engine", "WAAPI", "Utilities", "onScroll"]
  };

  function normalizeLang(lang) {
    lang = String(lang || "zh").toLowerCase().replace(/_/g, "-");
    if (lang === "en" || lang.indexOf("en-") === 0) return "en";
    return "zh";
  }

  function lsGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (e) {}
  }

  function cfgLangDefault() {
    var cfg = w.DECK_CONFIG || {};
    if (cfg.lang !== undefined && cfg.lang !== null && String(cfg.lang).trim()) {
      return normalizeLang(cfg.lang);
    }
    return "zh";
  }

  function resolveLang() {
    var cfg = cfgLangDefault();
    var stamp = lsGet(LANG_CFG_KEY);
    var saved = lsGet(LANG_KEY);
    if (stamp !== cfg) {
      lsSet(LANG_CFG_KEY, cfg);
      lsSet(LANG_KEY, cfg);
      return cfg;
    }
    if (saved) return normalizeLang(saved);
    return cfg;
  }

  var currentLang = "zh";

  function t(key, vars) {
    var pack = UI[currentLang] || UI.zh;
    var s = pack[key];
    if (s == null) s = (UI.zh[key] != null ? UI.zh[key] : key);
    if (vars && typeof vars === "object") {
      Object.keys(vars).forEach(function (k) {
        s = String(s).split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  function translateTitle(zhTitle) {
    if (currentLang !== "en") return zhTitle || "";
    if (!zhTitle) return "";
    return TITLE_EN[zhTitle] || zhTitle;
  }

  function applyChrome() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (!key) return;
      el.setAttribute("title", t(key));
      if (el.hasAttribute("aria-label") && el.getAttribute("data-i18n-aria") !== "0") {
        el.setAttribute("aria-label", t(key));
      }
    });
    var pageInput = document.getElementById("pageInput");
    if (pageInput) pageInput.setAttribute("aria-label", t("pageAria"));
    var themePanel = document.querySelector("#themePanel .theme-panel-head h4, #themePanel > h4");
    if (themePanel) themePanel.textContent = t("themePanel");
    var themeHint = document.querySelector("#themePanel .theme-panel-hint");
    if (themeHint) themeHint.textContent = t("themeHint");
    var particlePanel = document.querySelector("#particlePanel .particle-panel-head h4, #particlePanel > h4");
    if (particlePanel) particlePanel.textContent = t("particlePanel");
    var particleHint = document.querySelector("#particlePanel .particle-panel-hint");
    if (particleHint) particleHint.textContent = t("particleHint");
    var presentToast = document.getElementById("presentToast");
    if (presentToast) presentToast.textContent = t("toast");
    var exportToast = document.getElementById("exportPptToast");
    if (exportToast && !exportToast.classList.contains("show")) {
      exportToast.textContent = t("exportBusy");
    }
  }

  function applySlideContent(lang) {
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el.dataset.zh == null) el.dataset.zh = el.textContent;
      el.textContent = lang === "en" ? el.dataset.en : el.dataset.zh;
    });
    document.querySelectorAll("[data-en-title]").forEach(function (el) {
      if (el.dataset.zhTitle == null) {
        el.dataset.zhTitle = el.getAttribute("title") || "";
      }
      el.setAttribute(
        "title",
        lang === "en" ? el.dataset.enTitle || el.dataset.zhTitle : el.dataset.zhTitle
      );
    });
  }

  function setLang(lang, persist) {
    currentLang = normalizeLang(lang);
    var html = document.documentElement;
    html.setAttribute("lang", currentLang === "en" ? "en" : "zh-CN");
    html.setAttribute("data-lang", currentLang);
    if (persist !== false) lsSet(LANG_KEY, currentLang);
    applySlideContent(currentLang);
    applyChrome();
    var langBtn = document.getElementById("langBtn");
    if (langBtn) {
      var label = langBtn.querySelector("[data-lang-label]") || langBtn;
      if (langBtn.querySelector("[data-lang-label]")) {
        langBtn.querySelector("[data-lang-label]").textContent =
          currentLang === "en" ? "EN" : "中";
      } else if (!langBtn.querySelector(".icon")) {
        langBtn.textContent = currentLang === "en" ? "EN" : "中";
      }
      langBtn.setAttribute("aria-pressed", currentLang === "en" ? "true" : "false");
      langBtn.title = t("langTitle");
    }
    if (typeof w.__deckOnLangChange === "function") {
      try {
        w.__deckOnLangChange(currentLang);
      } catch (e) {}
    }
    if (w.lucide) {
      try {
        w.lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      } catch (e2) {}
    }
    return currentLang;
  }

  function toggleLang() {
    return setLang(currentLang === "en" ? "zh" : "en", true);
  }

  function getLang() {
    return currentLang;
  }

  function aiChipsFor(title, zhList) {
    if (currentLang !== "en") return zhList;
    return AI_CHIPS_EN[title] || zhList;
  }

  w.DECK_I18N = {
    TITLE_EN: TITLE_EN,
    UI: UI,
    t: t,
    translateTitle: translateTitle,
    setLang: setLang,
    toggleLang: toggleLang,
    getLang: getLang,
    resolveLang: resolveLang,
    applyChrome: applyChrome,
    aiChipsFor: aiChipsFor,
    LANG_KEY: LANG_KEY
  };

  // Early apply after DOM parse if script is deferred/at end — deck.js will call setLang too
  function boot() {
    setLang(resolveLang(), false);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
