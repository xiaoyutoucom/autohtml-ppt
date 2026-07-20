(function () {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = document.documentElement;
      /** window.DECK_CONFIG：由 deck/config.js 运行时加载（优先 config.json） */
      const DECK_CFG = (typeof window !== "undefined" && window.DECK_CONFIG) || {};
      function cfgBool(key, fallback) {
        if (DECK_CFG[key] === undefined || DECK_CFG[key] === null) return fallback;
        return !!DECK_CFG[key];
      }
      function cfgThemeDefault() {
        var t = DECK_CFG.theme;
        if (t === undefined || t === null || t === "") return "1";
        return String(t);
      }
      function applySpeakerFromConfig() {
        var el = document.getElementById("coverSpeaker");
        if (!el) return;
        if (DECK_CFG.speaker === undefined || DECK_CFG.speaker === null) return;
        var name = String(DECK_CFG.speaker).trim();
        if (name) el.textContent = name;
      }
      applySpeakerFromConfig();

      const presentToast = document.getElementById("presentToast");
      const presentBtn = document.getElementById("presentBtn");
      const particlesBtn = document.getElementById("particlesBtn");
      const bgmBtn = document.getElementById("bgmBtn");
      const exportPptBtn = document.getElementById("exportPptBtn");
      const exportPptToast = document.getElementById("exportPptToast");
      const fsBtn = document.getElementById("fsBtn");
      const railBtn = document.getElementById("railBtn");
      const gridBtn = document.getElementById("gridBtn");
      const annotateBtn = document.getElementById("annotateBtn");
      const footerEl = document.querySelector(".footer");
      const presentHotzone = document.getElementById("presentHotzone");
      const themeWrap = document.getElementById("themeWrap");
      const themeBtn = document.getElementById("themeBtn");
      const themeBtnLabel = document.getElementById("themeBtnLabel");
      const themeGrid = document.getElementById("themeGrid");
      let presentMode = false;
      let exportPptBusy = false;
      let particlesEnabled = cfgBool("particles", true);
      const PARTICLES_KEY = "harness_training_particles";
      const BGM_KEY = "harness_training_bgm";
      let bgmEnabled = cfgBool("bgm", false);
      let bgmAudio = null;
      let bgmUnlockBound = false;

      function resolveBgmSrc(src) {
        src = String(src || "").trim().replace(/\\/g, "/");
        if (!src) return "";
        // 配置可写 docs/xxx.mp3（相对工程根）或 xxx.mp3（相对 docs/）
        if (/^docs\//i.test(src)) src = src.replace(/^docs\//i, "");
        try {
          return encodeURI(src);
        } catch (e) {
          return src;
        }
      }

      function ensureBgmAudio() {
        if (bgmAudio) return bgmAudio;
        var src = resolveBgmSrc(DECK_CFG.bgmSrc || DECK_CFG.bgm_src || "");
        if (!src) return null;
        bgmAudio = new Audio(src);
        bgmAudio.loop = true;
        bgmAudio.preload = "auto";
        var vol = DECK_CFG.bgmVolume;
        if (typeof vol === "number" && vol >= 0 && vol <= 1) bgmAudio.volume = vol;
        else bgmAudio.volume = 0.35;
        bgmAudio.addEventListener("error", function () {
          console.warn("[deck] BGM 加载失败，请确认文件在 docs/ 下：", src);
        });
        return bgmAudio;
      }

      function syncBgmBtn() {
        if (!bgmBtn) return;
        var hasSrc = !!(DECK_CFG.bgmSrc || DECK_CFG.bgm_src);
        bgmBtn.disabled = !hasSrc;
        bgmBtn.setAttribute("aria-pressed", bgmEnabled ? "true" : "false");
        bgmBtn.classList.toggle("primary", bgmEnabled);
        bgmBtn.title = !hasSrc
          ? "未配置 bgmSrc"
          : (bgmEnabled ? "关闭背景音乐 (M)" : "打开背景音乐 (M)");
        bgmBtn.innerHTML = bgmEnabled
          ? '<i data-lucide="volume-2" class="icon"></i><span>音乐开</span>'
          : '<i data-lucide="volume-x" class="icon"></i><span>音乐关</span>';
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      }

      function tryPlayBgm() {
        var a = ensureBgmAudio();
        if (!a || !bgmEnabled) return;
        var p = a.play();
        if (p && typeof p.catch === "function") {
          p.catch(function () {
            // 浏览器拦截自动播放：等一次用户手势再播
            if (bgmUnlockBound) return;
            bgmUnlockBound = true;
            var unlock = function () {
              if (!bgmEnabled) return;
              tryPlayBgm();
              document.removeEventListener("pointerdown", unlock, true);
              document.removeEventListener("keydown", unlock, true);
            };
            document.addEventListener("pointerdown", unlock, true);
            document.addEventListener("keydown", unlock, true);
          });
        }
      }

      function setBgmEnabled(on, persist) {
        bgmEnabled = !!on;
        syncBgmBtn();
        if (persist !== false) {
          try { localStorage.setItem(BGM_KEY, bgmEnabled ? "1" : "0"); } catch (e) {}
        }
        var a = ensureBgmAudio();
        if (!a) return;
        if (bgmEnabled) tryPlayBgm();
        else {
          try { a.pause(); } catch (e) {}
        }
      }

      function toggleBgm() {
        setBgmEnabled(!bgmEnabled, true);
      }

      const THEME_META = [
        { id: 1, name: "深空青光", mode: "dark", swatch: "#22d3ee", paper: "#060a10", ink: "#fde047" },
        { id: 2, name: "墨玉翠绿", mode: "dark", swatch: "#6ee7b7", paper: "#06140f", ink: "#e6fff4" },
        { id: 3, name: "曜石琥珀", mode: "dark", swatch: "#fcd34d", paper: "#120c08", ink: "#fff7ed" },
        { id: 4, name: "工业板岩", mode: "dark", swatch: "#cbd5e1", paper: "#0f141a", ink: "#e8eef5" },
        { id: 5, name: "极地冰原", mode: "light", swatch: "#0284c7", paper: "#eef6fb", ink: "#0f2744" },
        { id: 6, name: "雨林夜色", mode: "dark", swatch: "#86efac", paper: "#0a1610", ink: "#ecfdf5" },
        { id: 7, name: "珊瑚暗礁", mode: "dark", swatch: "#fda4af", paper: "#140a0e", ink: "#fff1f2" },
        { id: 8, name: "蓝图草稿", mode: "light", swatch: "#3b82f6", paper: "#e8f0fa", ink: "#0b1f3a" },
        { id: 9, name: "碳纤维红", mode: "dark", swatch: "#f87171", paper: "#0a0a0a", ink: "#f5f5f5" },
        { id: 10, name: "暖砂工坊", mode: "light", swatch: "#c2410c", paper: "#f3ebe1", ink: "#2a2118" },
        { id: 11, name: "终端酸绿", mode: "dark", swatch: "#4ade80", paper: "#020805", ink: "#d1fae5" },
        { id: 12, name: "深海蓝渊", mode: "dark", swatch: "#7dd3fc", paper: "#020617", ink: "#e0f2fe" },
        { id: 13, name: "铜作车间", mode: "dark", swatch: "#f59e0b", paper: "#1a120c", ink: "#f5e6d3" },
        { id: 14, name: "瓷白墨线", mode: "light", swatch: "#334155", paper: "#f8fafc", ink: "#111827" },
        { id: 15, name: "岩浆余烬", mode: "dark", swatch: "#fb923c", paper: "#140808", ink: "#fff1f0" },
        { id: 16, name: "冰川雾霭", mode: "light", swatch: "#0ea5e9", paper: "#edf4f7", ink: "#1e3a4c" },
        { id: 17, name: "石墨信号", mode: "dark", swatch: "#fde047", paper: "#18181b", ink: "#f4f4f5" },
        { id: 18, name: "青玉金阙", mode: "dark", swatch: "#f0d78c", paper: "#052e26", ink: "#ecfdf5" },
        { id: 19, name: "落日线路", mode: "dark", swatch: "#fdba74", paper: "#1c0a14", ink: "#fff7ed" },
        { id: 20, name: "摄影棚黑白", mode: "light", swatch: "#222222", paper: "#f0f0f0", ink: "#0a0a0a" }
      ];
      const THEME_KEY = "harness_training_theme";
      // 记录上次应用的 config 值；config.json 变更（重建后）时覆盖 localStorage
      const THEME_CFG_KEY = "harness_training_theme_cfg";
      const PARTICLES_CFG_KEY = "harness_training_particles_cfg";
      const BGM_CFG_KEY = "harness_training_bgm_cfg";

      function lsGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
      }
      function lsSet(key, val) {
        try { localStorage.setItem(key, String(val)); } catch (e) {}
      }

      /**
       * config 与上次 stamp 不一致 → 用 config（并写回记忆）；
       * 一致且有用户记忆 → 用记忆；否则用 config。
       */
      function resolvePref(cfgValue, savedKey, stampKey) {
        var cfg = String(cfgValue);
        var stamp = lsGet(stampKey);
        var saved = lsGet(savedKey);
        if (stamp !== cfg) {
          lsSet(stampKey, cfg);
          lsSet(savedKey, cfg);
          return cfg;
        }
        if (saved === "0" || saved === "1" || (saved && saved.length)) return saved;
        return cfg;
      }

      function themeById(id) {
        return THEME_META.find(function (t) { return String(t.id) === String(id); }) || THEME_META[0];
      }

      function setTheme(id, persist) {
        var t = themeById(id);
        root.setAttribute("data-theme", String(t.id));
        root.setAttribute("data-theme-mode", t.mode === "light" ? "light" : "dark");
        if (themeBtnLabel) themeBtnLabel.textContent = "样式" + t.id;
        themeGrid.querySelectorAll(".theme-swatch").forEach(function (btn) {
          btn.classList.toggle("active", btn.getAttribute("data-theme") === String(t.id));
        });
        if (persist !== false) {
          lsSet(THEME_KEY, t.id);
        }
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
        // 主题色驱动粒子 / 封面 Vanta（粒子表未初始化前跳过，避免 initTheme 早于 PARTICLE_FLAVORS）
        if (typeof PARTICLE_FLAVORS !== "undefined" && PARTICLE_FLAVORS && typeof refreshParticles === "function") {
          refreshParticles(true);
        }
        if (typeof refreshVanta === "function" && typeof VANTA !== "undefined") refreshVanta();
      }

      function buildThemeGrid() {
        themeGrid.innerHTML = THEME_META.map(function (t) {
          return (
            '<button type="button" class="theme-swatch" data-theme="' + t.id + '"' +
            ' style="background:' + t.paper + ';color:' + t.ink + ';border-color:' + t.swatch + '">' +
            '<span class="n">#' + t.id + (t.mode === "light" ? " · 浅" : " · 深") + "</span>" +
            '<span class="label">' + t.name + "</span></button>"
          );
        }).join("");
        themeGrid.addEventListener("click", function (e) {
          var btn = e.target.closest(".theme-swatch");
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          setTheme(btn.getAttribute("data-theme"), true);
          themeWrap.classList.remove("open");
        });
      }

      function toggleThemePanel() {
        themeWrap.classList.toggle("open");
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      }

      buildThemeGrid();
      (function initTheme() {
        // config 变更后优先生效；未变更时仍尊重用户上次用 T 选的样式
        setTheme(resolvePref(cfgThemeDefault(), THEME_KEY, THEME_CFG_KEY), false);
      })();

      themeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleThemePanel();
      });
      document.addEventListener("click", function (e) {
        if (!themeWrap.classList.contains("open")) return;
        if (e.target.closest("#themeWrap")) return;
        themeWrap.classList.remove("open");
      });

      var footerPeekTimer = null;
      function syncFooterPeekHeight() {
        if (!footerEl || !footerEl.classList.contains("is-peek")) {
          root.style.removeProperty("--footer-peek-h");
          return;
        }
        var h = Math.ceil(footerEl.getBoundingClientRect().height);
        root.style.setProperty("--footer-peek-h", Math.max(h, 52) + "px");
      }
      function setFooterPeek(on) {
        if (!footerEl) return;
        var show = !!(on && presentMode);
        footerEl.classList.toggle("is-peek", show);
        root.classList.toggle("footer-peek", show);
        if (presentHotzone) {
          presentHotzone.style.pointerEvents = show ? "none" : "";
        }
        if (show) {
          requestAnimationFrame(function () {
            requestAnimationFrame(syncFooterPeekHeight);
          });
        } else {
          root.style.removeProperty("--footer-peek-h");
        }
      }

      function setPresentMode(on) {
        presentMode = on;
        root.classList.toggle("present-mode", on);
        presentBtn.classList.toggle("primary", on);
        presentBtn.innerHTML = on
          ? '<i data-lucide="presentation" class="icon"></i>演示中'
          : '<i data-lucide="presentation" class="icon"></i>演示';
        if (!on) setFooterPeek(false);
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      }

      function togglePresentMode() {
        setPresentMode(!presentMode);
      }

      function syncParticlesBtn() {
        root.classList.toggle("particles-off", !particlesEnabled);
        if (!particlesBtn) return;
        particlesBtn.setAttribute("aria-pressed", particlesEnabled ? "true" : "false");
        particlesBtn.classList.toggle("primary", particlesEnabled);
        particlesBtn.title = particlesEnabled ? "隐藏粒子效果 (P)" : "显示粒子效果 (P)";
        particlesBtn.innerHTML = particlesEnabled
          ? '<i data-lucide="sparkles" class="icon"></i><span>隐藏粒子</span>'
          : '<i data-lucide="eye-off" class="icon"></i><span>显示粒子</span>';
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      }

      function setParticlesEnabled(on, persist) {
        particlesEnabled = !!on;
        syncParticlesBtn();
        if (persist !== false) {
          try { localStorage.setItem(PARTICLES_KEY, particlesEnabled ? "1" : "0"); } catch (e) {}
        }
        if (!particlesEnabled) {
          if (particlesInst) {
            try { particlesInst.destroy(); } catch (e) {}
            particlesInst = null;
            lastParticleKey = "";
          }
          if (typeof destroyVanta === "function") destroyVanta();
        } else {
          if (typeof refreshParticles === "function") refreshParticles(true);
          if (typeof refreshVanta === "function") refreshVanta();
        }
      }

      function toggleParticles() {
        setParticlesEnabled(!particlesEnabled, true);
      }

      (function initParticlesPref() {
        var cfg = cfgBool("particles", true) ? "1" : "0";
        var pick = resolvePref(cfg, PARTICLES_KEY, PARTICLES_CFG_KEY);
        particlesEnabled = pick === "1";
        syncParticlesBtn();
      })();

      (function initBgmPref() {
        var cfg = cfgBool("bgm", false) ? "1" : "0";
        var pick = resolvePref(cfg, BGM_KEY, BGM_CFG_KEY);
        bgmEnabled = pick === "1";
        syncBgmBtn();
        if (bgmEnabled) tryPlayBgm();
      })();

      if (particlesBtn) {
        particlesBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleParticles();
        });
      }
      if (bgmBtn) {
        bgmBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleBgm();
        });
      }

      /* 演示模式：仅鼠标靠近底部热区时展开快捷栏（完整高度、可点） */
      (function bindPresentDock() {
        if (!footerEl || !presentHotzone) return;
        function scheduleHide() {
          if (footerPeekTimer) clearTimeout(footerPeekTimer);
          footerPeekTimer = setTimeout(function () {
            if (!presentMode) return;
            var over = false;
            try {
              over = footerEl.matches(":hover") || presentHotzone.matches(":hover");
            } catch (err) {}
            if (!over) setFooterPeek(false);
          }, 180);
        }
        function showDock() {
          if (footerPeekTimer) clearTimeout(footerPeekTimer);
          setFooterPeek(true);
        }
        presentHotzone.addEventListener("mouseenter", showDock);
        presentHotzone.addEventListener("mouseleave", scheduleHide);
        footerEl.addEventListener("mouseenter", showDock);
        footerEl.addEventListener("mouseleave", scheduleHide);
        document.addEventListener("mousemove", function (e) {
          if (!presentMode || exportPptBusy) return;
          var near = window.innerHeight - e.clientY <= 56;
          if (near) showDock();
          else if (!footerEl.classList.contains("is-peek")) return;
          else {
            var over = false;
            try { over = footerEl.matches(":hover"); } catch (err) {}
            if (!over && window.innerHeight - e.clientY > 72) scheduleHide();
          }
        });
      })();

      function toggleFullscreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(function () {});
        } else {
          document.exitFullscreen().catch(function () {});
        }
      }

      setPresentMode(false);
      setTimeout(function () { presentToast.classList.add("hide"); }, 4200);

      document.addEventListener("fullscreenchange", function () {
        fsBtn.innerHTML = document.fullscreenElement
          ? '<i data-lucide="minimize-2" class="icon"></i>'
          : '<i data-lucide="maximize-2" class="icon"></i>';
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      });

      presentBtn.addEventListener("click", togglePresentMode);
      fsBtn.addEventListener("click", toggleFullscreen);

      var particlesInst = null;
      var vantaEffect = null;
      var coverBrandReady = false;

      function cssVar(name, fallback) {
        var v = getComputedStyle(root).getPropertyValue(name).trim();
        return v || fallback || "#22d3ee";
      }

      function themeParticleColors() {
        var neon = cssVar("--neon", "#22d3ee");
        var teal = cssVar("--teal", "#2dd4bf");
        var signal = cssVar("--signal", "#fb923c");
        return [neon, teal, signal];
      }

      function isCoverActive() {
        return !!document.querySelector(".slide.active.slide-cover");
      }

      function formatCoverTalkTime(d) {
        d = d || new Date();
        var pad = function (n) { return n < 10 ? "0" + n : String(n); };
        return (
          d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
          " " + pad(d.getHours()) + ":" + pad(d.getMinutes())
        );
      }

      function refreshCoverTalkTime() {
        var el = document.getElementById("coverTalkTime");
        if (!el) return;
        el.textContent = formatCoverTalkTime(new Date());
      }

      function isTocActive() {
        var s = document.querySelector(".slide.active");
        return !!(s && (s.dataset.title || "") === "目录");
      }

      function getActiveSlide() {
        return document.querySelector(".slide.active");
      }

      /* 每页飘荡标签须与本页主题相关（约 10 个；也可用 data-ai-chips="A|B|…"） */
      var AI_CHIP_COUNT = 10;
      var SLIDE_AI_CHIPS = {
        "封面": ["Harness", "Agent", "五大模块", "本仓实践", "马具", "模型+Harness", "演示开场", "三次跃迁", "Progress", "Lint"],
        "目录": ["演示", "认识 Harness", "五大模块", "本仓实践", "五件套", "CHAPTER 01", "CHAPTER 02", "CHAPTER 03", "CHAPTER 04", "今天怎么讲"],
        "01 演示": ["Web Demo", "客户端", "SPECCONFIG", "pytest_cli", "开场", "实机视频", "一条命令", "跑全量", "先看效果", "再讲原理"],
        "自动化演示": ["Web 自动化", "Playwright", "实机视频", "演示", "视频开场", "空格播控", "headed", "浏览器", "mp4", "Demo · Web"],
        "客户端演示": ["客户端", "实机视频", "Demo", "本地 mp4", "Demo · Client", "空格播控", "翻页暂停", "现场演示", "Playwright", "headed"],
        "现场跑全量": ["pytest_cli", "SPECCONFIG", "--headed", "一条命令", "report.html", "-c case_id", "无头跑批", "test-output", "可复制", "Live"],
        "02 认识": ["痛点", "马具隐喻", "三次跃迁", "Harness", "是什么", "幻读", "Prompt", "Context", "为什么火了", "先讲清"],
        "三大痛点": ["改偏", "忘约", "越修越乱", "重写布局", "行为层", "1000 行", "新 Bug", "单文件约束", "样式坑", "Why Harness"],
        "更隐蔽的坑": ["幻读", "记忆污染", "假装执行", "约束失效", "门禁", "幻觉", "AGENTS.md", "Skill 挡不住", "落盘状态", "阶段注入"],
        "Harness 是什么": ["马具", "缰绳", "五大模块", "工作环境", "工作流程", "模型是马", "围栏", "规则文件", "工具配置", "任务拆分"],
        "为什么火了": ["LangChain", "Codex", "Coinbase", "GAIA", "Ralph", "OpenAI", "Cursor", "Anthropic", "同模型分差", "环境和流程"],
        "提示词工程": ["角色设定", "CoT", "Few-shot", "JSON 约束", "听懂需求", "思维链", "格式约束", "单次输出", "最内层", "2022～2024"],
        "上下文工程": ["AGENTS.md", "RAG", "压缩摘要", "跨对话记忆", "对的信息", "规则文件", "按需加载", "中间层", "检索", "2025"],
        "Harness 工程": ["装工具", "拆任务", "自检", "护栏", "持续靠谱", "MCP", "增量开发", "质量不滑坡", "最外层", "2026"],
        "层层包含": ["Prompt", "Context", "Harness", "层层包含", "不互相取代", "最内层", "中间层", "最外层", "嵌套", "有了名字"],
        "公式": ["Agent", "模型", "Harness", "思考生成", "环境流程", "能持续干活", "规则", "工具", "检查机制", "模型之外"],
        "公式总览": ["人类驾驭", "五模块", "持续交付", "测试通过", "Agent", "AI 模型", "上下文", "执行", "反馈", "护栏"],
        "03 架构": ["上下文", "执行", "编排", "反馈", "护栏", "五大核心", "可靠交付", "骨架", "核心问题", "项目经验"],
        "模块一": ["AGENTS.md", "分层文档", "按需加载", "上下文压缩", "规矩", "技术栈", "禁止事项", "docs/", "目录式", "新人入职"],
        "模块二": ["终端", "MCP", "Skills", "浏览器", "Tool Use", "文件读写", "权限边界", "手脚", "联网", "技能包"],
        "模块三": ["Plan Mode", "增量开发", "SubAgents", "Git 存档", "拆任务", "人工确认", "沉淀文档", "并行", "功能点", "一把梭"],
        "模块四": ["Linter", "自测", "读错修复", "互审", "反馈环", "浏览器检查", "Code Review", "自主修复", "完成≠通过", "关键纠偏"],
        "模块五": ["架构 Linter", "Pre-commit", "垃圾回收", "Git 检查点", "护栏", "依赖方向", "技术债", "回滚", "烂代码模仿", "拦截"],
        "本质收束": ["工程经验", "AGENTS.md", "Plan Mode", "MCP", "Git 存档", "不是新技术", "驾驭 AI", "跑测试", "Skills", "下一章实践"],
        "04 实践": ["五件套", "Stage", "门禁", "闭环", "本仓落地", "Progress", "Runner", "Skill", "Rules", "Lint"],
        "实践框架": ["Progress", "Runner", "Skill", "Rules", "Lint", "S0–S9", "Gate", "Delegate", "教写对", "pass/fail"],
        "Stage": ["S0–S9", "STAGE_ORDER", "S8 浏览器", "cleaned", "runnable", "S1 清洗", "S3 动作", "S6 校验", "playwright_plan", "report.html"],
        "Progress": ["唯一事实来源", "status", "gate", "notes", "progress.yaml", "done", "pending", "file", "Runner 读写", "阶段块"],
        "Progress 实战": ["executed_trace", "--note", "blocker", "feedback", "--next", "fix", "--lint", "--advance", "ordinal", "卡点"],
        "Runner": ["--advance", "门禁链", "Delegate", "Lint 盖章", "--status", "--next", "--lint", "online", "offline", "总控"],
        "Skill Rules Lint": ["教写对", "定义错", "pass/fail", "cleaned_rules", "lint_cleaned", "登录@admin", "valid_tags", "STAGE_META", "S1", "Gate"],
        "闭环": ["收集", "处理", "生成", "复盘", "Rules/Skill", "飞轮", "blocker", "Fragment", "越跑越稳", "人审异常"],
        "思考与行动": ["五件套", "--advance", "Gate", "稳定用多久", "动手", "--next", "--lint", "Progress", "Rules", "参考资料"],
        "开源与赞助": ["MIT", "Star", "微信赞助", "GitHub", "Gitee", "扫码", "xiaoyutoucom", "白标", "定制", "邮箱"]
      };

      function parseAiChipsAttr(raw) {
        if (!raw) return null;
        var parts = String(raw).split("|").map(function (s) { return s.trim(); }).filter(Boolean);
        return parts.length ? parts.slice(0, AI_CHIP_COUNT) : null;
      }

      function extractAiChipsFromSlide(slide) {
        if (!slide) return [];
        var seen = {};
        var out = [];
        function push(label) {
          label = String(label || "").replace(/\s+/g, " ").trim();
          if (!label || label.length > 18) return;
          var key = label.toLowerCase();
          if (seen[key]) return;
          seen[key] = true;
          out.push(label);
        }
        var h = slide.querySelector("h1, h2");
        if (h) {
          var ht = (h.textContent || "").replace(/\s+/g, " ").trim();
          if (ht && ht.length <= 16) push(ht);
        }
        slide.querySelectorAll(".tag, .kicker, code, strong.strong, .story-take strong, .node").forEach(function (el) {
          var t = (el.textContent || "").replace(/\s+/g, " ").trim();
          if (t && t.length >= 2 && t.length <= 16) push(t);
        });
        return out.slice(0, AI_CHIP_COUNT);
      }

      function aiChipSetForSlide(slide) {
        var fallback = ["Harness", "Agent", "Context", "Gate", "Lint", "Progress", "Runner", "Skill", "Rules", "Eval"];
        if (!slide) return fallback.slice();
        var fromAttr = parseAiChipsAttr(slide.getAttribute("data-ai-chips") || slide.dataset.aiChips || "");
        if (fromAttr) return fromAttr;
        var title = slide.dataset.title || "";
        if (SLIDE_AI_CHIPS[title]) return SLIDE_AI_CHIPS[title].slice(0, AI_CHIP_COUNT);
        var extracted = extractAiChipsFromSlide(slide);
        if (extracted.length >= 6) return extracted;
        return extracted.concat(fallback).slice(0, AI_CHIP_COUNT);
      }

      function refreshAiAmbient() {
        if (reducedMotion) return;
        var slide = getActiveSlide();
        var chipsEl = document.getElementById("aiChips");
        var nodesEl = document.getElementById("aiNodes");
        if (!chipsEl || !nodesEl) return;

        var labels = aiChipSetForSlide(slide);
        var title = (slide && slide.dataset.title) || "";
        var seed = 0;
        for (var i = 0; i < title.length; i++) seed = (seed + title.charCodeAt(i) * (i + 1)) % 997;

        var chipSlots = [
          { t: "8%", l: "5%" },
          { t: "14%", l: "72%" },
          { t: "22%", l: "88%" },
          { t: "28%", l: "8%" },
          { t: "36%", l: "78%" },
          { t: "44%", l: "3%" },
          { t: "52%", l: "90%" },
          { t: "60%", l: "12%" },
          { t: "68%", l: "80%" },
          { t: "76%", l: "6%" },
          { t: "82%", l: "70%" },
          { t: "18%", l: "48%" }
        ];
        chipsEl.innerHTML = labels.slice(0, AI_CHIP_COUNT).map(function (label, idx) {
          var slot = chipSlots[(seed + idx * 5) % chipSlots.length];
          var delay = ((idx * 0.28) % 2.6).toFixed(2);
          return (
            '<span class="ai-chip is-on" style="top:' + slot.t + ";left:" + slot.l +
            ";animation-delay:-" + delay + 's">' + label + "</span>"
          );
        }).join("");

        var nodeHtml = "";
        for (var n = 0; n < 14; n++) {
          var top = 8 + ((seed * (n + 3) * 17) % 84);
          var left = 6 + ((seed * (n + 5) * 29) % 88);
          var dly = ((n * 0.28) % 2.5).toFixed(2);
          nodeHtml +=
            '<span class="ai-node" style="top:' + top + "%;left:" + left +
            "%;animation-delay:-" + dly + 's"></span>';
        }
        nodesEl.innerHTML = nodeHtml;
      }

      function setHeroFxClasses() {
        if (reducedMotion) {
          root.classList.remove("cursor-glow-fx", "cover-hero-fx", "toc-hero-fx");
          return;
        }
        var cover = isCoverActive();
        var toc = isTocActive();
        root.classList.add("cursor-glow-fx");
        root.classList.toggle("cover-hero-fx", cover);
        root.classList.toggle("toc-hero-fx", toc);
      }

      /**
       * 一页一风格：PARTICLE_FLAVORS 每条视觉差异拉开；
       * SLIDE_PARTICLE_MAP 按 data-title 唯一映射（禁止同风格连用）。
       * 覆盖：slide[data-particles="matrix_thick"]
       */
      var PARTICLE_FLAVORS = {
        /* 封面专用 */
        cover_mesh: {
          count: 128, area: 660, shape: "circle", colorMode: "all",
          opMin: 0.34, opMax: 0.88, szMin: 1.5, szMax: 4.4,
          speed: 1.3, dir: "none", straight: false, random: true,
          links: true, linkDist: 175, linkOp: 0.52, linkW: 1.55,
          hover: ["grab", "attract", "bubble"], grabDist: 280, bubbleSize: 10,
          twinkle: false, fps: 60
        },
        /* 目录 / 章节 / 内容——彼此拉开 */
        toc_constellation: {
          count: 34, area: 1100, shape: "circle", colorMode: "neon",
          opMin: 0.3, opMax: 0.8, szMin: 1.8, szMax: 4,
          speed: 0.28, dir: "none", straight: false, random: true,
          links: true, linkDist: 240, linkOp: 0.55, linkW: 1.15,
          hover: ["grab"], grabDist: 320, bubbleSize: 6,
          twinkle: true, fps: 40
        },
        sec_demo_rise: {
          count: 55, area: 900, shape: "circle", colorMode: "teal",
          opMin: 0.2, opMax: 0.65, szMin: 1.4, szMax: 3.2,
          speed: 1.35, dir: "top", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble"], grabDist: 200, bubbleSize: 8,
          twinkle: false, fps: 50
        },
        demo_web_rain: {
          count: 110, area: 620, shape: "circle", colorMode: "neon",
          opMin: 0.18, opMax: 0.75, szMin: 0.7, szMax: 2,
          speed: 2.8, dir: "bottom", straight: true, random: false,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["attract"], grabDist: 160, bubbleSize: 4,
          twinkle: false, fps: 55
        },
        demo_client_slash: {
          count: 70, area: 780, shape: "triangle", colorMode: "signal",
          opMin: 0.22, opMax: 0.7, szMin: 1.5, szMax: 3.6,
          speed: 1.9, dir: "right", straight: true, random: false,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["repulse"], grabDist: 180, bubbleSize: 6,
          twinkle: false, fps: 55
        },
        cmd_pulse: {
          count: 42, area: 950, shape: "circle", colorMode: "duo",
          opMin: 0.25, opMax: 0.85, szMin: 2, szMax: 6,
          speed: 0.45, dir: "none", straight: false, random: true,
          links: true, linkDist: 180, linkOp: 0.4, linkW: 1.4,
          hover: ["bubble", "grab"], grabDist: 260, bubbleSize: 12,
          twinkle: true, fps: 45
        },
        sec_know_drift: {
          count: 48, area: 920, shape: "star", colorMode: "all",
          opMin: 0.2, opMax: 0.7, szMin: 1.2, szMax: 3.4,
          speed: 0.55, dir: "left", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble"], grabDist: 200, bubbleSize: 7,
          twinkle: true, fps: 45
        },
        pain_chaos: {
          count: 95, area: 680, shape: "triangle", colorMode: "signal",
          opMin: 0.25, opMax: 0.8, szMin: 1, szMax: 3,
          speed: 2.6, dir: "none", straight: false, random: true,
          links: true, linkDist: 85, linkOp: 0.2, linkW: 0.75,
          hover: ["repulse", "attract"], grabDist: 190, bubbleSize: 6,
          twinkle: false, fps: 55
        },
        pit_scatter: {
          count: 80, area: 740, shape: "circle", colorMode: "signal",
          opMin: 0.15, opMax: 0.55, szMin: 0.8, szMax: 2.6,
          speed: 1.7, dir: "none", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["repulse"], grabDist: 210, bubbleSize: 5,
          twinkle: true, fps: 55
        },
        harness_web: {
          count: 68, area: 840, shape: "circle", colorMode: "all",
          opMin: 0.24, opMax: 0.68, szMin: 1.3, szMax: 3.5,
          speed: 0.9, dir: "none", straight: false, random: true,
          links: true, linkDist: 150, linkOp: 0.42, linkW: 1.25,
          hover: ["grab", "attract"], grabDist: 250, bubbleSize: 8,
          twinkle: false, fps: 55
        },
        cases_bubbles: {
          count: 22, area: 1200, shape: "circle", colorMode: "teal",
          opMin: 0.1, opMax: 0.4, szMin: 12, szMax: 34,
          speed: 0.4, dir: "none", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble", "repulse"], grabDist: 240, bubbleSize: 40,
          twinkle: false, fps: 40
        },
        prompt_stars: {
          count: 50, area: 900, shape: "star", colorMode: "neon",
          opMin: 0.22, opMax: 0.9, szMin: 1.4, szMax: 4.6,
          speed: 0.22, dir: "none", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble"], grabDist: 200, bubbleSize: 8,
          twinkle: true, fps: 40
        },
        context_mesh: {
          count: 40, area: 1000, shape: "circle", colorMode: "duo",
          opMin: 0.28, opMax: 0.72, szMin: 1.5, szMax: 3.6,
          speed: 0.38, dir: "none", straight: false, random: true,
          links: true, linkDist: 210, linkOp: 0.5, linkW: 1.05,
          hover: ["grab"], grabDist: 300, bubbleSize: 6,
          twinkle: true, fps: 45
        },
        harness_eng_grid: {
          count: 58, area: 860, shape: "triangle", colorMode: "all",
          opMin: 0.2, opMax: 0.62, szMin: 2, szMax: 4.8,
          speed: 0.75, dir: "none", straight: false, random: true,
          links: true, linkDist: 135, linkOp: 0.34, linkW: 1.1,
          hover: ["grab", "attract"], grabDist: 230, bubbleSize: 7,
          twinkle: false, fps: 50
        },
        nest_layers: {
          count: 36, area: 980, shape: "circle", colorMode: "teal",
          opMin: 0.25, opMax: 0.7, szMin: 2.5, szMax: 7,
          speed: 0.5, dir: "none", straight: false, random: true,
          links: true, linkDist: 170, linkOp: 0.28, linkW: 1.6,
          hover: ["grab", "bubble"], grabDist: 260, bubbleSize: 14,
          twinkle: false, fps: 45
        },
        formula_lift: {
          count: 45, area: 920, shape: "circle", colorMode: "neon",
          opMin: 0.2, opMax: 0.75, szMin: 1.2, szMax: 3,
          speed: 1.5, dir: "top", straight: true, random: false,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["attract"], grabDist: 200, bubbleSize: 6,
          twinkle: false, fps: 50
        },
        formula_ring: {
          count: 52, area: 880, shape: "star", colorMode: "duo",
          opMin: 0.25, opMax: 0.8, szMin: 1.6, szMax: 3.8,
          speed: 0.85, dir: "none", straight: false, random: true,
          links: true, linkDist: 125, linkOp: 0.3, linkW: 0.95,
          hover: ["grab", "attract", "bubble"], grabDist: 240, bubbleSize: 9,
          twinkle: true, fps: 50
        },
        sec_arch_beam: {
          count: 64, area: 800, shape: "circle", colorMode: "neon",
          opMin: 0.2, opMax: 0.65, szMin: 1, szMax: 2.4,
          speed: 2.1, dir: "right", straight: true, random: false,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["attract"], grabDist: 180, bubbleSize: 5,
          twinkle: false, fps: 55
        },
        mod1_tri: {
          count: 46, area: 900, shape: "triangle", colorMode: "neon",
          opMin: 0.22, opMax: 0.68, szMin: 2.4, szMax: 5.8,
          speed: 0.65, dir: "none", straight: false, random: true,
          links: true, linkDist: 145, linkOp: 0.36, linkW: 1.1,
          hover: ["grab"], grabDist: 230, bubbleSize: 8,
          twinkle: false, fps: 50
        },
        mod2_stars: {
          count: 58, area: 860, shape: "star", colorMode: "teal",
          opMin: 0.2, opMax: 0.85, szMin: 1.3, szMax: 4,
          speed: 0.32, dir: "top", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble"], grabDist: 200, bubbleSize: 7,
          twinkle: true, fps: 45
        },
        mod3_matrix: {
          count: 100, area: 650, shape: "circle", colorMode: "duo",
          opMin: 0.16, opMax: 0.7, szMin: 0.6, szMax: 1.8,
          speed: 3.1, dir: "bottom", straight: true, random: false,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["repulse"], grabDist: 150, bubbleSize: 4,
          twinkle: false, fps: 60
        },
        mod4_foam: {
          count: 30, area: 1050, shape: "circle", colorMode: "signal",
          opMin: 0.12, opMax: 0.48, szMin: 6, szMax: 22,
          speed: 0.7, dir: "top", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble", "repulse"], grabDist: 220, bubbleSize: 28,
          twinkle: false, fps: 40
        },
        mod5_spark: {
          count: 120, area: 600, shape: "circle", colorMode: "all",
          opMin: 0.3, opMax: 0.95, szMin: 0.5, szMax: 2.2,
          speed: 3.2, dir: "none", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["attract", "repulse"], grabDist: 190, bubbleSize: 5,
          twinkle: true, fps: 60
        },
        essence_soft: {
          count: 32, area: 1100, shape: "circle", colorMode: "teal",
          opMin: 0.3, opMax: 0.75, szMin: 2, szMax: 5,
          speed: 0.25, dir: "none", straight: false, random: true,
          links: true, linkDist: 230, linkOp: 0.45, linkW: 1.2,
          hover: ["grab"], grabDist: 310, bubbleSize: 8,
          twinkle: true, fps: 40
        },
        sec_practice_up: {
          count: 60, area: 840, shape: "triangle", colorMode: "neon",
          opMin: 0.2, opMax: 0.65, szMin: 1.4, szMax: 3.5,
          speed: 1.4, dir: "top", straight: false, random: true,
          links: true, linkDist: 110, linkOp: 0.2, linkW: 0.85,
          hover: ["grab", "bubble"], grabDist: 220, bubbleSize: 7,
          twinkle: false, fps: 50
        },
        practice_lattice: {
          count: 54, area: 870, shape: "triangle", colorMode: "duo",
          opMin: 0.22, opMax: 0.66, szMin: 2.2, szMax: 5.2,
          speed: 0.6, dir: "none", straight: false, random: true,
          links: true, linkDist: 155, linkOp: 0.38, linkW: 1.15,
          hover: ["grab", "attract"], grabDist: 240, bubbleSize: 8,
          twinkle: false, fps: 50
        },
        stage_codefall: {
          count: 88, area: 700, shape: "circle", colorMode: "neon",
          opMin: 0.14, opMax: 0.6, szMin: 0.9, szMax: 2.4,
          speed: 2.2, dir: "bottom", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["attract"], grabDist: 170, bubbleSize: 5,
          twinkle: false, fps: 55
        },
        progress_orbit: {
          count: 50, area: 900, shape: "circle", colorMode: "teal",
          opMin: 0.24, opMax: 0.72, szMin: 1.5, szMax: 3.8,
          speed: 1.05, dir: "top", straight: false, random: true,
          links: true, linkDist: 130, linkOp: 0.26, linkW: 1,
          hover: ["grab", "bubble"], grabDist: 230, bubbleSize: 9,
          twinkle: false, fps: 50
        },
        progress_live: {
          count: 72, area: 780, shape: "circle", colorMode: "all",
          opMin: 0.2, opMax: 0.7, szMin: 1.1, szMax: 3.2,
          speed: 1.6, dir: "left", straight: false, random: true,
          links: true, linkDist: 120, linkOp: 0.3, linkW: 1.05,
          hover: ["attract", "grab"], grabDist: 220, bubbleSize: 7,
          twinkle: false, fps: 55
        },
        runner_burst: {
          count: 105, area: 640, shape: "star", colorMode: "signal",
          opMin: 0.28, opMax: 0.92, szMin: 0.8, szMax: 2.8,
          speed: 2.9, dir: "none", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["attract", "repulse"], grabDist: 200, bubbleSize: 6,
          twinkle: true, fps: 60
        },
        srl_glyphs: {
          count: 44, area: 940, shape: "star", colorMode: "duo",
          opMin: 0.25, opMax: 0.8, szMin: 2, szMax: 5,
          speed: 0.4, dir: "right", straight: false, random: true,
          links: true, linkDist: 160, linkOp: 0.25, linkW: 0.9,
          hover: ["grab", "bubble"], grabDist: 250, bubbleSize: 10,
          twinkle: true, fps: 45
        },
        loop_flow: {
          count: 56, area: 860, shape: "circle", colorMode: "teal",
          opMin: 0.22, opMax: 0.68, szMin: 1.3, szMax: 3.4,
          speed: 1.2, dir: "right", straight: false, random: true,
          links: true, linkDist: 145, linkOp: 0.35, linkW: 1.2,
          hover: ["grab"], grabDist: 240, bubbleSize: 7,
          twinkle: false, fps: 50
        },
        takeaway_snow: {
          count: 65, area: 820, shape: "circle", colorMode: "neon",
          opMin: 0.16, opMax: 0.5, szMin: 1.4, szMax: 3.8,
          speed: 0.55, dir: "bottom", straight: false, random: true,
          links: false, linkDist: 0, linkOp: 0, linkW: 0,
          hover: ["bubble"], grabDist: 180, bubbleSize: 6,
          twinkle: false, fps: 40
        },
        sponsor_glow: {
          count: 48, area: 920, shape: "circle", colorMode: "teal",
          opMin: 0.2, opMax: 0.7, szMin: 1.6, szMax: 4.2,
          speed: 0.45, dir: "none", straight: false, random: true,
          links: true, linkDist: 170, linkOp: 0.28, linkW: 1,
          hover: ["grab", "bubble"], grabDist: 260, bubbleSize: 9,
          twinkle: true, fps: 42
        }
      };

      /** 每页标题 → 唯一风格（值不可重复） */
      var SLIDE_PARTICLE_MAP = {
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
      };

      function resolveColorPalette(mode, colors) {
        var neon = colors[0], teal = colors[1], signal = colors[2];
        switch (mode) {
          case "neon": return [neon];
          case "teal": return [teal, neon];
          case "signal": return [signal, neon];
          case "duo": return [neon, teal];
          default: return colors;
        }
      }

      function pickParticleFlavor(slide) {
        if (!slide) return "cover_mesh";
        var forced = (slide.dataset.particles || "").trim();
        if (forced && PARTICLE_FLAVORS[forced]) return forced;
        var title = slide.dataset.title || "";
        if (SLIDE_PARTICLE_MAP[title] && PARTICLE_FLAVORS[SLIDE_PARTICLE_MAP[title]]) {
          return SLIDE_PARTICLE_MAP[title];
        }
        // 未登记页：按 DOM 序号取尚未占用的风格，避免撞车
        var slides = document.querySelectorAll(".slide");
        var idx = Array.prototype.indexOf.call(slides, slide);
        var used = {};
        Object.keys(SLIDE_PARTICLE_MAP).forEach(function (k) { used[SLIDE_PARTICLE_MAP[k]] = true; });
        var pool = Object.keys(PARTICLE_FLAVORS).filter(function (k) { return !used[k]; });
        if (!pool.length) pool = Object.keys(PARTICLE_FLAVORS);
        return pool[Math.abs(idx) % pool.length];
      }

      function resolveParticleProfile(slide) {
        var flavor = pickParticleFlavor(slide);
        var title = (slide && slide.dataset.title) || "page";
        var tier = (slide && slide.classList.contains("slide-cover")) ? "cover" : "page";
        return { tier: tier, flavor: flavor, key: tier + ":" + flavor + ":" + title };
      }

      function buildParticlesOptions(profile) {
        var colors = themeParticleColors();
        var neon = colors[0];
        var flavor = (profile && profile.flavor) || "cover_mesh";
        var flavors = typeof PARTICLE_FLAVORS !== "undefined" ? PARTICLE_FLAVORS : null;
        var cfg = (flavors && flavors[flavor]) || (flavors && flavors.cover_mesh) || null;
        if (!cfg) {
          cfg = {
            count: 48, area: 900, shape: "circle", colorMode: "all",
            opMin: 0.2, opMax: 0.6, szMin: 1.2, szMax: 3.2,
            speed: 0.9, dir: "none", straight: false, random: true,
            links: true, linkDist: 150, linkOp: 0.35, linkW: 1.2,
            hover: ["grab"], grabDist: 240, bubbleSize: 8,
            twinkle: false, fps: 50
          };
        }
        var palette = resolveColorPalette(cfg.colorMode || "all", colors);
        var isCover = flavor === "cover_mesh";

        var opacity = {
          value: { min: cfg.opMin, max: cfg.opMax }
        };
        var size = {
          value: { min: cfg.szMin, max: cfg.szMax }
        };
        if (cfg.twinkle) {
          opacity.animation = { enable: true, speed: 1.1, sync: false, startValue: "random" };
          size.animation = { enable: true, speed: 2.2, sync: false, startValue: "random" };
        }

        return {
          fullScreen: { enable: false },
          fpsLimit: cfg.fps,
          detectRetina: true,
          background: { color: { value: "transparent" } },
          particles: {
            number: {
              value: cfg.count,
              density: { enable: true, area: cfg.area }
            },
            color: { value: palette },
            shape: { type: cfg.shape },
            opacity: opacity,
            size: size,
            move: {
              enable: true,
              speed: cfg.speed,
              direction: cfg.dir,
              straight: !!cfg.straight,
              random: !!cfg.random,
              outModes: { default: "out" }
            },
            links: {
              enable: !!cfg.links,
              distance: cfg.linkDist,
              color: palette[0] || neon,
              opacity: cfg.linkOp,
              width: cfg.linkW
            }
          },
          interactivity: {
            detectsOn: "window",
            events: {
              onHover: {
                enable: true,
                mode: cfg.hover
              },
              resize: true
            },
            modes: {
              grab: {
                distance: cfg.grabDist,
                links: { opacity: isCover ? 0.95 : 0.8, color: neon }
              },
              attract: {
                distance: isCover ? 260 : 220,
                duration: 0.25,
                easing: "ease-out-quad",
                factor: isCover ? 4 : 3.2,
                maxSpeed: 28,
                speed: 2.6
              },
              repulse: {
                distance: 140,
                duration: 0.35,
                factor: 60,
                speed: 0.8
              },
              bubble: {
                distance: 220,
                size: cfg.bubbleSize,
                duration: 0.35,
                opacity: 1,
                speed: 2
              }
            }
          }
        };
      }

      var lastParticleKey = "";
      function refreshParticles(force) {
        if (reducedMotion || !window.tsParticles) return;
        if (!particlesEnabled) {
          if (particlesInst) {
            try { particlesInst.destroy(); } catch (e) {}
            particlesInst = null;
            lastParticleKey = "";
          }
          return;
        }
        var profile = resolveParticleProfile(getActiveSlide());
        if (!force && profile.key === lastParticleKey && particlesInst) return;
        lastParticleKey = profile.key;
        if (particlesInst) {
          try { particlesInst.destroy(); } catch (e) {}
          particlesInst = null;
        }
        var opts = buildParticlesOptions(profile);
        var p = tsParticles.load("tsparticles", opts);
        if (p && typeof p.then === "function") {
          p.then(function (inst) { particlesInst = inst || null; }).catch(function () {});
        }
      }

      function destroyVanta() {
        if (vantaEffect && typeof vantaEffect.destroy === "function") {
          try { vantaEffect.destroy(); } catch (e) {}
        }
        vantaEffect = null;
        var cover = document.querySelector(".slide-cover");
        if (cover) cover.classList.remove("is-vanta");
      }

      function refreshVanta() {
        var cover = document.querySelector(".slide-cover");
        var el = document.getElementById("vanta-cover");
        if (!cover || !el) return;
        if (!particlesEnabled || reducedMotion || !window.VANTA || !window.VANTA.NET || !window.THREE) {
          destroyVanta();
          return;
        }
        if (!isCoverActive()) {
          destroyVanta();
          return;
        }
        var neon = cssVar("--neon", "#22d3ee");
        var paper = cssVar("--paper", "#060a10");
        // parse hex-ish to int for Vanta
        function hexInt(c, fb) {
          var m = String(c).trim().match(/^#([0-9a-f]{6})$/i);
          return m ? parseInt(m[1], 16) : fb;
        }
        destroyVanta();
        try {
          vantaEffect = VANTA.NET({
            el: el,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            color: hexInt(neon, 0x22d3ee),
            backgroundColor: hexInt(paper, 0x060a10),
            points: 12,
            maxDistance: 26,
            spacing: 16,
            showDots: true
          });
          cover.classList.add("is-vanta");
        } catch (err) {
          destroyVanta();
        }
      }

      function prepareCoverBrand() {
        var brand = document.getElementById("coverBrand");
        if (!brand || coverBrandReady) return;
        // 一词一行：按 <br> / 空白拆词，词内再拆字做飞入
        var raw = brand.innerHTML
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/&nbsp;/gi, " ");
        var tmp = document.createElement("div");
        tmp.innerHTML = raw;
        var plain = (tmp.textContent || "").replace(/\r/g, "");
        var lines = plain.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
        if (!lines.length) {
          lines = ["Harness", "Engineering"];
        }
        brand.innerHTML = lines.map(function (word) {
          var chars = Array.from(word).map(function (ch) {
            if (ch === " ") return '<span class="char char-space">&nbsp;</span>';
            return '<span class="char">' + ch + "</span>";
          }).join("");
          return '<span class="word">' + chars + "</span>";
        }).join("");
        brand.classList.add("has-chars");
        coverBrandReady = true;
      }

      function prepareCodeLines(slide) {
        slide.querySelectorAll("pre").forEach(function (pre) {
          if (pre.dataset.lined === "1") return;
          var text = pre.textContent.replace(/\n$/, "");
          if (!text || text.indexOf("\n") === -1) return;
          var lines = text.split("\n");
          pre.classList.add("line-lit");
          pre.innerHTML = lines.map(function (line) {
            return '<span class="code-line">' + line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span>";
          }).join("\n");
          pre.dataset.lined = "1";
        });
      }

      function clearLit(slide) {
        slide.querySelectorAll(".is-lit").forEach(function (el) {
          el.classList.remove("is-lit");
        });
      }

      function animateHighlightSequence(slide) {
        if (reducedMotion || !window.anime) return;
        var flowNodes = slide.querySelectorAll(".flow .node");
        var title = slide.dataset.title || "";
        var h2t = slide.querySelector("h2") ? slide.querySelector("h2").textContent : "";
        var tableRows = [];
        // 实践框架五件套、Stage S0–S9：逐行点亮
        if (
          title === "Stage" ||
          title.indexOf("实践框架") !== -1 ||
          /五件套|S0|工序/.test(h2t)
        ) {
          tableRows = slide.querySelectorAll("table.fw-table tbody tr");
        }
        // 也可显式开启：data-row-pulse="1"
        if (!tableRows.length && slide.getAttribute("data-row-pulse") === "1") {
          tableRows = slide.querySelectorAll("table.fw-table tbody tr");
        }
        var codeLines = slide.querySelectorAll("pre.line-lit .code-line");

        function pulseList(list, hold) {
          if (!list || !list.length) return;
          var items = Array.prototype.slice.call(list);
          var i = 0;
          var holdMs = hold || 380;
          function step() {
            if (!slide.classList.contains("active")) return;
            items.forEach(function (el) { el.classList.remove("is-lit"); });
            if (i < items.length) {
              items[i].classList.add("is-lit");
              anime({
                targets: items[i],
                scale: [1, 1.015, 1],
                duration: Math.min(360, holdMs),
                easing: "easeOutQuad"
              });
              i += 1;
              setTimeout(step, holdMs);
            } else {
              setTimeout(function () {
                if (slide.classList.contains("active")) {
                  items.forEach(function (el) { el.classList.remove("is-lit"); });
                }
              }, 700);
            }
          }
          setTimeout(step, 360);
        }

        if (flowNodes.length) pulseList(flowNodes, 420);
        if (tableRows.length) {
          // 行多则稍快，保证整表扫完不太拖
          var hold = tableRows.length >= 8 ? 300 : 450;
          pulseList(tableRows, hold);
        }
        if (codeLines.length && codeLines.length <= 16) pulseList(codeLines, 220);
      }

      function animateCoverTitle(slide) {
        prepareCoverBrand();
        var chars = slide.querySelectorAll("#coverBrand .char");
        if (!chars.length) return;
        // 先清掉可能残留的 inline 样式，避免卡在 opacity:0
        chars.forEach(function (el) {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
        });
        if (reducedMotion || !window.anime || !slide.classList.contains("slide-cover")) return;
        try { anime.remove(chars); } catch (e) {}
        anime.set(chars, { opacity: 0, translateY: 22 });
        anime({
          targets: chars,
          opacity: 1,
          translateY: 0,
          delay: anime.stagger(28, { start: 80 }),
          duration: 620,
          easing: "easeOutCubic",
          complete: function () {
            chars.forEach(function (el) {
              el.style.removeProperty("opacity");
              el.style.removeProperty("transform");
            });
          }
        });
      }

      prepareCoverBrand();
      refreshParticles();
      refreshVanta();

      (function bindCoverMouseFx() {
        var glow = document.getElementById("coverCursorGlow");
        var raf = 0;
        var mx = 0;
        var my = 0;
        var pending = false;

        function applyFx() {
          pending = false;
          setHeroFxClasses();
          if (reducedMotion) {
            if (glow) glow.style.removeProperty("opacity");
            return;
          }
          if (glow) {
            glow.style.left = mx + "px";
            glow.style.top = my + "px";
          }
          var cover = isCoverActive();
          var toc = isTocActive();
          if (cover) {
            var viz = document.querySelector(".slide.active.slide-cover .cover-viz");
            if (viz) {
              var nx = (mx / Math.max(window.innerWidth, 1) - 0.5) * 36;
              var ny = (my / Math.max(window.innerHeight, 1) - 0.5) * 28;
              viz.style.transform = "translate3d(" + nx.toFixed(1) + "px," + ny.toFixed(1) + "px,0) rotateY(" + (nx * 0.35).toFixed(2) + "deg) rotateX(" + (-ny * 0.3).toFixed(2) + "deg)";
            }
          } else {
            var idleViz = document.querySelector(".slide-cover .cover-viz");
            if (idleViz) idleViz.style.transform = "";
          }
          // 目录卡不再跟鼠标位移，避免发飘抢内容
        }

        function onMove(e) {
          mx = e.clientX;
          my = e.clientY;
          if (pending) return;
          pending = true;
          raf = requestAnimationFrame(applyFx);
        }

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("blur", function () {
          root.classList.remove("cover-hero-fx", "toc-hero-fx", "cursor-glow-fx");
        });
        // 进页即开启光斑档位
        setHeroFxClasses();
      })();

      const termTip = document.getElementById("term-tip");
      const GLOSSARY = {
        "RAG": "检索增强生成（Retrieval-Augmented Generation）：先从知识库/文档检索相关片段，再交给模型作答，降低瞎编概率。",
        "CoT": "思维链（Chain of Thought）：要求模型一步步写出推理过程，再给出结论，提升复杂题正确率。",
        "Few-shot": "少样本示例：在提示里给 1～若干条「输入→输出」范例，让模型模仿格式与风格。",
        "MCP": "Model Context Protocol：把终端、浏览器、数据库等能力以标准工具协议暴露给 Agent，统一调用方式。",
        "Lint": "静态检查门禁：用脚本自动校验产物格式/规范；不通过则阻断推进（本仓 lints/*.py）。",
        "Harness": "马具/驾驭层：围绕模型的工作环境 + 工作流程（规则、工具、编排、反馈、护栏），让 Agent 持续靠谱交付。",
        "Harness Engineering": "驾驭工程：把围绕模型的环境与流程系统化设计，而不是只调提示词。",
        "Skill": "可复用的 Agent 操作手册（SKILL.md）：告诉 AI 何时用、怎么做、边界是什么；仍需门禁强制才可靠。",
        "AGENTS.md": "项目级 Agent 说明书：技术栈、规范、禁止事项；宜做「目录」，细节放到 docs/ 按需加载。",
        "Delegate": "委派：由 Runner 把某一阶段任务交给 Cursor/Agent 生成产物，再经 Lint 验收。",
        "Progress": "进度落盘（如 progress.yaml）：记录各阶段状态与门禁结果，支持复跑与审计。",
        "Runner": "调度器：按阶段检查前置条件、触发 Delegate/执行器、跑门禁并写回 Progress。",
        "Stage": "工序阶段：把大任务切成 S0–S9 等小块，靠产物文件衔接，设计时在 STAGE_ORDER 中定义。",
        "Rules": "机读约束（YAML）：定义「什么算错」，专供 Lint 脚本读取与判定。",
        "Guides": "引导文档：教人/Agent「怎么写对」，对应本仓 Skill；不直接当机器门禁。",
        "Sensors": "传感器/质检层：Rules + Lint，把规范变成可自动判定的 pass/fail。",
        "Gate": "门禁状态：嵌在 progress 里；Lint 结果写 gate.status（pass/fail/expired）。",
        "Status": "阶段状态：如 done / pending / expired，表示该 Stage 是否完成。",
        "Next": "Runner 的 --next：根据 progress 指出当前应处理的下一阶段。",
        "Advance": "Runner 的 --advance：按门禁链推进当前阶段（可 Delegate → Lint → 写回）。",
        "CI": "持续集成：流水线里调用 Runner/Lint，把门禁嵌入自动化构建。",
        "gate": "门禁结果：通常含 pass/fail；PASS 才允许 advance 到下一阶段。",
        "Fragment": "可复用业务步骤片段：在 runnable 里引用，执行时由 run_case 展开。",
        "Preset": "预设参数包：把常用入参打包，口令里用「别名@preset」快速引用。",
        "Agent": "智能体：= 模型 + Harness。模型负责思考生成，Harness 负责环境、工具与流程约束。",
        "Prompt": "提示词：单次对话里给模型的指令与约束，是最内层技巧。",
        "Context": "上下文：在对的时机喂给模型的信息集合（规则、检索、记忆、压缩摘要等）。",
        "幻读": "模型声称已读某文件/文档，或编造不存在的 API、路径、结论——实际未读或读错。",
        "幻觉": "Hallucination：模型一本正经地生成不实内容（假引用、假接口、假结果）。",
        "PRD": "产品需求文档：把目标拆成可勾选条目，供 Agent 循环执行直到清零（如 Ralph 模式）。",
        "GAIA": "面向 Agent 的基准评测集，常用来对比「同模型不同 Harness」的效果差异。",
        "Plan Mode": "先写计划再改代码的工作模式：降低一次改炸、范围失控的风险。",
        "worktree": "Git 工作树：同一仓库的多份检出目录，便于 Agent 隔离改动、互不踩脚。",
        "offline": "离线推进：跳过在线委派（如 HARNESS_OFFLINE_ADVANCE=1），用本地/已有产物继续流水线。"
      };

      function escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      function wrapGlossaryTerms(root) {
        const keys = Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; });
        const re = new RegExp("(" + keys.map(escapeRegExp).join("|") + ")", "g");
        const skip = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, SVG: 1 };
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            var p = node.parentElement;
            if (!p) return NodeFilter.FILTER_REJECT;
            if (p.closest(".term, #term-tip, .case-detail, .present-toast, .footer, .hud-frame, #coverBrand, .brand-mark")) {
              return NodeFilter.FILTER_REJECT;
            }
            if (skip[p.tagName]) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(function (textNode) {
          const text = textNode.nodeValue;
          if (!re.test(text)) return;
          re.lastIndex = 0;
          const frag = document.createDocumentFragment();
          let last = 0;
          let m;
          while ((m = re.exec(text))) {
            if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
            const span = document.createElement("span");
            span.className = "term";
            span.tabIndex = 0;
            span.dataset.term = m[1];
            span.dataset.tip = GLOSSARY[m[1]];
            span.textContent = m[1];
            frag.appendChild(span);
            last = m.index + m[1].length;
          }
          if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
          textNode.parentNode.replaceChild(frag, textNode);
        });
      }

      function placeTermTip(anchor) {
        const tip = termTip;
        const rect = anchor.getBoundingClientRect();
        tip.innerHTML = "<b>" + anchor.dataset.term + "</b>" + (anchor.dataset.tip || "");
        tip.classList.add("show");
        tip.setAttribute("aria-hidden", "false");
        tip.style.left = "0px";
        tip.style.top = "0px";
        const tw = tip.offsetWidth;
        const th = tip.offsetHeight;
        let left = rect.left + rect.width / 2 - tw / 2;
        let top = rect.top - th - 10;
        if (top < 8) top = rect.bottom + 10;
        left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
        tip.style.left = left + "px";
        tip.style.top = top + "px";
      }

      function hideTermTip() {
        termTip.classList.remove("show");
        termTip.setAttribute("aria-hidden", "true");
      }

      wrapGlossaryTerms(document.getElementById("deck"));
      document.getElementById("deck").addEventListener("mouseover", function (e) {
        const t = e.target.closest(".term");
        if (t) placeTermTip(t);
      });
      document.getElementById("deck").addEventListener("mouseout", function (e) {
        const t = e.target.closest(".term");
        if (t && (!e.relatedTarget || !t.contains(e.relatedTarget))) hideTermTip();
      });
      document.getElementById("deck").addEventListener("focusin", function (e) {
        const t = e.target.closest(".term");
        if (t) placeTermTip(t);
      });
      document.getElementById("deck").addEventListener("focusout", function (e) {
        if (!e.relatedTarget || !e.relatedTarget.closest(".term")) hideTermTip();
      });

      const slides = Array.from(document.querySelectorAll(".slide"));
      const bar = document.getElementById("bar");
      const counter = document.getElementById("counter");
      const pageInput = document.getElementById("pageInput");
      const pageTotal = document.getElementById("pageTotal");
      const homeBtn = document.getElementById("homeBtn");
      const endBtn = document.getElementById("endBtn");
      const titleHint = document.getElementById("titleHint");
      const prevBtn = document.getElementById("prev");
      const nextBtn = document.getElementById("next");
      let index = 0;
      let railOpen = false;
      let gridOpen = false;
      let annotateOn = false;

      function paintIcons() {
        if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
      }

      let navDir = 1;
      let animToken = 0;

      function animTargets(slide) {
        return slide.querySelectorAll(
          ":scope > *, .card, .case-card, .pain-card, .cover-foot-card, .toc-card, .story-points li, .cmd-notes li, .pain-grid > *, table.fw-table tbody tr, .flow .node, .chip, .section-num, .cover-viz, .cmd-hero, .demo-player, .formula"
        );
      }

      function resetAnimStyles(slide) {
        animTargets(slide).forEach(function (el) {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
          el.style.removeProperty("filter");
        });
        // 封面字级拆分也可能停在 opacity:0
        slide.querySelectorAll("#coverBrand .char, .brand-mark .char").forEach(function (el) {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
          el.style.removeProperty("filter");
        });
      }

      function animateCssFallback(slide) {
        slide.querySelectorAll(":scope > *").forEach(function (el, i) {
          el.classList.remove("animate__animated", "animate__fadeInUp", "animate__fadeInLeft", "animate__zoomIn");
          void el.offsetWidth;
          var cls = "animate__fadeInUp";
          if (slide.classList.contains("section-slide")) cls = i === 0 ? "animate__zoomIn" : "animate__fadeInUp";
          if (slide.classList.contains("slide-story")) cls = i === 1 ? "animate__fadeInLeft" : "animate__fadeInUp";
          el.classList.add("animate__animated", cls);
          el.style.setProperty("--animate-duration", ".55s");
          el.style.animationDelay = (i * 0.08) + "s";
        });
      }

      function animateActiveSlide(slide) {
        var kickers = slide.querySelectorAll(".kicker");
        kickers.forEach(function (k) {
          k.classList.remove("kicker-in");
          void k.offsetWidth;
          k.classList.add("kicker-in");
        });

        clearLit(slide);
        prepareCodeLines(slide);

        if (reducedMotion) {
          animateCoverTitle(slide);
          return;
        }
        if (!window.anime) {
          animateCssFallback(slide);
          animateCoverTitle(slide);
          animateHighlightSequence(slide);
          return;
        }

        var token = ++animToken;
        try { anime.remove(animTargets(slide)); } catch (e) {}
        resetAnimStyles(slide);
        // 放在 remove 之后，避免标题入场被动效清理掐掉
        animateCoverTitle(slide);

        var sectionNum = slide.querySelector(".section-num");
        var coverViz = slide.querySelector(".cover-viz");
        var vantaEl = slide.querySelector("#vanta-cover");
        var isCover = slide.classList.contains("slide-cover");
        var tops = Array.prototype.slice.call(slide.querySelectorAll(":scope > *")).filter(function (el) {
          if (el === sectionNum || el === vantaEl) return false;
          // 封面标题走字级 stagger，避免父级 opacity 盖掉
          if (isCover && el.classList.contains("cover-hero")) return false;
          return true;
        });
        var coverMeta = isCover
          ? slide.querySelectorAll(".cover-hero .kicker, .cover-hero .lead, .cover-hero .title-meta")
          : [];
        var cards = slide.querySelectorAll(".card, .case-card, .pain-card, .cover-foot-card, .toc-card");
        var listItems = slide.querySelectorAll(".story-points li, .cmd-notes li, .pain-grid > *");
        var rows = slide.querySelectorAll("table.fw-table tbody tr");
        var nodes = slide.querySelectorAll(".flow .node");
        var chips = slide.querySelectorAll(".chip-row .chip");

        anime.set(tops, { opacity: 0, translateY: navDir >= 0 ? 26 : -18 });
        if (coverMeta.length) anime.set(coverMeta, { opacity: 0, translateY: 16 });
        if (cards.length) anime.set(cards, { opacity: 0, translateY: 32, scale: 0.96 });
        if (listItems.length) anime.set(listItems, { opacity: 0, translateX: -18 });
        if (rows.length) anime.set(rows, { opacity: 0, translateX: 14 });
        if (nodes.length) anime.set(nodes, { opacity: 0, scale: 0.85 });
        if (chips.length) anime.set(chips, { opacity: 0, translateY: 10 });
        if (sectionNum) anime.set(sectionNum, { opacity: 0, scale: 0.65, rotate: -6 });
        if (coverViz) anime.set(coverViz, { opacity: 0, scale: 0.88 });

        var tl = anime.timeline({
          easing: "easeOutCubic",
          autoplay: true,
          complete: function () {
            if (token !== animToken) return;
            resetAnimStyles(slide);
            animateHighlightSequence(slide);
          }
        });

        if (sectionNum) {
          tl.add({
            targets: sectionNum,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 720,
            easing: "easeOutElastic(1, .72)"
          });
        }

        if (coverViz) {
          tl.add({
            targets: coverViz,
            opacity: 1,
            scale: 1,
            duration: 780,
            easing: "easeOutElastic(1, .78)"
          }, sectionNum ? "-=520" : 0);
        }

        tl.add({
          targets: tops,
          opacity: 1,
          translateY: 0,
          delay: anime.stagger(68),
          duration: 480
        }, sectionNum || coverViz ? "-=480" : 0);

        if (coverMeta.length) {
          tl.add({
            targets: coverMeta,
            opacity: 1,
            translateY: 0,
            delay: anime.stagger(90),
            duration: 420
          }, "-=420");
        }

        if (cards.length) {
          tl.add({
            targets: cards,
            opacity: 1,
            translateY: 0,
            scale: 1,
            delay: anime.stagger(75),
            duration: 520,
            easing: "easeOutBack"
          }, "-=300");
        }

        if (listItems.length) {
          tl.add({
            targets: listItems,
            opacity: 1,
            translateX: 0,
            delay: anime.stagger(48),
            duration: 380
          }, "-=360");
        }

        if (rows.length) {
          tl.add({
            targets: rows,
            opacity: 1,
            translateX: 0,
            delay: anime.stagger(36),
            duration: 340
          }, "-=280");
        }

        if (nodes.length) {
          tl.add({
            targets: nodes,
            opacity: 1,
            scale: 1,
            delay: anime.stagger(70),
            duration: 420,
            easing: "easeOutBack"
          }, "-=300");
        }

        if (chips.length) {
          tl.add({
            targets: chips,
            opacity: 1,
            translateY: 0,
            delay: anime.stagger(35),
            duration: 320
          }, "-=340");
        }
      }

      function pauseAllVideos() {
        document.querySelectorAll("video").forEach(function (v) {
          try { v.pause(); } catch (e) {}
        });
      }

      function videoHasSrc(v) {
        return !!(v && (v.getAttribute("src") || v.currentSrc));
      }

      function bindClientDemoLoader() {
        var btn = document.getElementById("loadClientDemo");
        var v = document.getElementById("demoVideoClient");
        var hint = document.getElementById("demoClientHint");
        if (!btn || !v) return;
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var ds = v.getAttribute("data-src");
          if (!ds) return;
          v.onerror = function () {
            if (hint) {
              hint.innerHTML = "未找到 <code>docs/客户端演示.mp4</code>，请先把文件放到 docs 目录后再点加载。";
            }
          };
          v.onloadeddata = function () {
            if (hint) {
              hint.textContent = "文件：docs/客户端演示.mp4 · 空格播放/暂停 · 翻页会自动暂停";
            }
          };
          v.setAttribute("src", ds);
          try { v.load(); } catch (err) {}
        });
      }
      bindClientDemoLoader();

      function playDemoIfActive(slide) {
        const v = slide.querySelector("video");
        if (!v || !videoHasSrc(v)) return;
        var p = v.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      }

      var lastHeroMode = null;
      function isExportingPpt() {
        return !!exportPptBusy || root.classList.contains("exporting-ppt");
      }
      function render() {
        var exporting = isExportingPpt();
        slides.forEach(function (s, i) {
          const on = i === index;
          s.classList.toggle("active", on);
          s.classList.toggle("enter-next", on && navDir > 0 && !exporting);
          s.classList.toggle("enter-prev", on && navDir < 0 && !exporting);
          if (on) {
            s.style.display = s.classList.contains("slide-cover") ? "grid" : "flex";
            if (!exporting) {
              animateActiveSlide(s);
              if (s.classList.contains("slide-demo")) playDemoIfActive(s);
            } else {
              pauseAllVideos();
              resetAnimStyles(s);
              clearLit(s);
            }
          } else {
            s.style.display = "none";
            clearLit(s);
            try { if (window.anime) anime.remove(animTargets(s)); } catch (e) {}
            resetAnimStyles(s);
            s.querySelectorAll("video").forEach(function (v) {
              try { v.pause(); } catch (e) {}
            });
          }
        });
        bar.style.width = (((index + 1) / slides.length) * 100) + "%";
        counter.textContent = (index + 1) + " / " + slides.length;
        if (pageTotal) pageTotal.textContent = String(slides.length);
        if (pageInput && document.activeElement !== pageInput) {
          pageInput.value = String(index + 1);
          pageInput.max = String(slides.length);
        }
        titleHint.textContent = slides[index].dataset.title || "";
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
        if (homeBtn) homeBtn.disabled = index === 0;
        if (endBtn) endBtn.disabled = index === slides.length - 1;
        if (!exporting) location.hash = "s" + (index + 1);
        paintIcons();

        var hero = isCoverActive();
        setHeroFxClasses();
        if (hero) refreshCoverTalkTime();
        if (!hero) {
          var viz = document.querySelector(".slide-cover .cover-viz");
          if (viz) viz.style.transform = "";
        }
        // DOM 截图模式不刷特效；标签页截屏模式要刷，才能进 PPT
        var domExport = exporting && root.classList.contains("export-dom-mode");
        if (!domExport) {
          if (hero !== lastHeroMode) {
            lastHeroMode = hero;
            refreshVanta();
          } else {
            lastHeroMode = hero;
          }
          refreshParticles();
          refreshAiAmbient();
        } else {
          lastHeroMode = hero;
        }
        if (typeof syncChromeActive === "function") syncChromeActive();
        if (typeof redrawAnnotations === "function") redrawAnnotations();
      }
      function go(delta) {
        goTo(index + delta);
      }
      function goTo(pageZeroBased, forceRender) {
        const next = Math.min(slides.length - 1, Math.max(0, pageZeroBased | 0));
        if (next === index && !forceRender) {
          if (pageInput) pageInput.value = String(index + 1);
          return;
        }
        navDir = next > index ? 1 : -1;
        pauseAllVideos();
        index = next;
        render();
      }
      // 供 tools/export_training_ppt.py / 控制台调用
      window.deckGoTo = goTo;
      window.deckSlideCount = function () { return slides.length; };

      /* —— 缩略图轨 / 网格总览 / 画笔批注 —— */
      var slideRail = document.getElementById("slideRail");
      var slideRailList = document.getElementById("slideRailList");
      var slideGrid = document.getElementById("slideGrid");
      var slideGridList = document.getElementById("slideGridList");
      var annotateLayer = document.getElementById("annotateLayer");
      var annotateCanvas = document.getElementById("annotateCanvas");
      var annotateBar = document.getElementById("annotateBar");
      var annStore = {};
      var annTool = "pen";
      var annColor = "#fde047";
      var annSize = 3;
      var annDrawing = false;
      var annCurr = null;
      var annCtx = annotateCanvas ? annotateCanvas.getContext("2d") : null;

      function makeThumbButton(i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "slide-thumb" + (i === index ? " active" : "");
        btn.dataset.index = String(i);
        var title = slides[i].dataset.title || ("第" + (i + 1) + "页");
        btn.innerHTML =
          '<div class="slide-thumb-head"><span class="no"></span><span class="ttl"></span></div>' +
          '<div class="slide-thumb-frame" data-thumb-frame="1"></div>';
        btn.querySelector(".no").textContent = String(i + 1);
        btn.querySelector(".ttl").textContent = title;
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(i);
          setRailOpen(false);
          setGridOpen(false);
        });
        return btn;
      }

      function prepareThumbClone(slideEl) {
        var clone = slideEl.cloneNode(true);
        clone.classList.add("active");
        clone.classList.remove("enter-next", "enter-prev");
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
        clone.querySelectorAll("video").forEach(function (v) {
          var ph = document.createElement("div");
          ph.className = "slide-thumb-video-ph";
          ph.textContent = "视频";
          if (v.parentNode) v.parentNode.replaceChild(ph, v);
        });
        clone.querySelectorAll("canvas, script, iframe, #vanta-cover, [id='vanta-cover']").forEach(function (el) {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        });
        clone.querySelectorAll(".animate__animated").forEach(function (el) {
          el.classList.remove("animate__animated", "animate__fadeInUp", "animate__fadeInLeft", "animate__zoomIn");
        });
        var isCover = clone.classList.contains("slide-cover");
        clone.style.setProperty("display", isCover ? "grid" : "flex", "important");
        clone.style.setProperty("opacity", "1", "important");
        clone.style.setProperty("visibility", "visible", "important");
        clone.style.setProperty("position", "relative", "important");
        clone.style.setProperty("inset", "auto", "important");
        clone.style.setProperty("width", "100%", "important");
        clone.style.setProperty("height", "100%", "important");
        clone.style.setProperty("animation", "none", "important");
        clone.style.setProperty("transform", "none", "important");
        clone.style.setProperty("filter", "none", "important");
        clone.querySelectorAll("*").forEach(function (el) {
          if (el.style) {
            if (el.style.opacity === "0") el.style.setProperty("opacity", "1", "important");
            el.style.setProperty("animation", "none", "important");
            el.style.removeProperty("transform");
          }
        });
        return clone;
      }

      function fillThumbFrame(frame, slideIndex) {
        if (!frame || !slides[slideIndex]) return;
        var vw = Math.max(960, window.innerWidth || 1280);
        var vh = Math.max(540, window.innerHeight || 720);
        var stage = document.createElement("div");
        stage.className = "slide-thumb-stage";
        stage.style.width = vw + "px";
        stage.style.height = vh + "px";
        stage.appendChild(prepareThumbClone(slides[slideIndex]));
        frame.innerHTML = "";
        frame.appendChild(stage);
        var applyScale = function () {
          var fw = frame.clientWidth || 1;
          var scale = fw / vw;
          stage.style.transform = "scale(" + scale + ")";
        };
        applyScale();
        requestAnimationFrame(applyScale);
      }

      var thumbFillToken = 0;
      function fillThumbPreviewsIn(rootEl) {
        if (!rootEl) return;
        var frames = rootEl.querySelectorAll("[data-thumb-frame]");
        var token = ++thumbFillToken;
        var i = 0;
        function step() {
          if (token !== thumbFillToken) return;
          var batch = 0;
          while (i < frames.length && batch < 4) {
            var frame = frames[i];
            var btn = frame.closest(".slide-thumb");
            var idx = btn ? Number(btn.dataset.index) : i;
            fillThumbFrame(frame, idx);
            i += 1;
            batch += 1;
          }
          if (i < frames.length) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      function buildChromeLists() {
        if (slideRailList) {
          slideRailList.innerHTML = "";
          slides.forEach(function (_, i) { slideRailList.appendChild(makeThumbButton(i)); });
        }
        if (slideGridList) {
          slideGridList.innerHTML = "";
          slides.forEach(function (_, i) { slideGridList.appendChild(makeThumbButton(i)); });
        }
      }

      function syncChromeActive() {
        document.querySelectorAll(".slide-thumb").forEach(function (btn) {
          btn.classList.toggle("active", Number(btn.dataset.index) === index);
        });
        if (railBtn) railBtn.classList.toggle("primary", railOpen);
        if (gridBtn) gridBtn.classList.toggle("primary", gridOpen);
        if (annotateBtn) annotateBtn.classList.toggle("primary", annotateOn);
      }

      function setRailOpen(on) {
        railOpen = !!on;
        root.classList.toggle("rail-open", railOpen);
        if (railOpen) {
          setGridOpen(false);
          fillThumbPreviewsIn(slideRailList);
        }
        syncChromeActive();
      }
      function setGridOpen(on) {
        gridOpen = !!on;
        root.classList.toggle("grid-open", gridOpen);
        if (gridOpen) {
          setRailOpen(false);
          fillThumbPreviewsIn(slideGridList);
        }
        syncChromeActive();
      }
      function toggleRail() { setRailOpen(!railOpen); }
      function toggleGrid() { setGridOpen(!gridOpen); }

      function resizeAnnotateCanvas() {
        if (!annotateCanvas) return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        annotateCanvas.width = Math.floor(window.innerWidth * dpr);
        annotateCanvas.height = Math.floor(window.innerHeight * dpr);
        if (annCtx) annCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redrawAnnotations();
      }

      function strokeList() {
        var key = String(index);
        if (!annStore[key]) annStore[key] = [];
        return annStore[key];
      }

      function drawStroke(ctx, s, w, h) {
        if (!s.points || s.points.length < 1) return;
        ctx.save();
        if (s.tool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.strokeStyle = "rgba(0,0,0,1)";
          ctx.lineWidth = (s.size || 3) * 4;
        } else if (s.tool === "highlighter") {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = s.color || annColor;
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = (s.size || 3) * 5;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = s.color || annColor;
          ctx.globalAlpha = 1;
          ctx.lineWidth = s.size || 3;
        }
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        s.points.forEach(function (p, i) {
          var x = p.x * w;
          var y = p.y * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.restore();
      }

      function redrawAnnotations() {
        if (!annCtx || !annotateCanvas) return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        annCtx.clearRect(0, 0, w, h);
        strokeList().forEach(function (s) { drawStroke(annCtx, s, w, h); });
        if (annCurr) drawStroke(annCtx, annCurr, w, h);
        var has = strokeList().length > 0 || annotateOn;
        if (annotateLayer) annotateLayer.style.opacity = has ? "1" : "0";
      }

      function setAnnotateOn(on) {
        annotateOn = !!on;
        root.classList.toggle("annotate-on", annotateOn);
        if (annotateLayer) annotateLayer.setAttribute("aria-hidden", annotateOn ? "false" : "true");
        if (annotateOn) {
          setRailOpen(false);
          setGridOpen(false);
          resizeAnnotateCanvas();
        } else {
          annDrawing = false;
          annCurr = null;
          redrawAnnotations();
        }
        syncChromeActive();
      }
      function toggleAnnotate() { setAnnotateOn(!annotateOn); }

      function annPointer(e) {
        return {
          x: e.clientX / Math.max(window.innerWidth, 1),
          y: e.clientY / Math.max(window.innerHeight, 1)
        };
      }

      if (annotateCanvas) {
        annotateCanvas.addEventListener("pointerdown", function (e) {
          if (!annotateOn) return;
          e.preventDefault();
          annotateCanvas.setPointerCapture(e.pointerId);
          annDrawing = true;
          annCurr = {
            tool: annTool,
            color: annColor,
            size: annSize,
            points: [annPointer(e)]
          };
          redrawAnnotations();
        });
        annotateCanvas.addEventListener("pointermove", function (e) {
          if (!annDrawing || !annCurr) return;
          annCurr.points.push(annPointer(e));
          redrawAnnotations();
        });
        function endAnnStroke(e) {
          if (!annDrawing || !annCurr) return;
          annDrawing = false;
          if (annCurr.points.length > 1) strokeList().push(annCurr);
          annCurr = null;
          redrawAnnotations();
          try { annotateCanvas.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        annotateCanvas.addEventListener("pointerup", endAnnStroke);
        annotateCanvas.addEventListener("pointercancel", endAnnStroke);
      }

      if (annotateBar) {
        annotateBar.addEventListener("click", function (e) {
          var t = e.target.closest("[data-tool]");
          if (t) {
            annTool = t.getAttribute("data-tool");
            annotateBar.querySelectorAll("[data-tool]").forEach(function (b) {
              b.classList.toggle("on", b === t);
            });
            return;
          }
          var sw = e.target.closest(".swatch[data-color]");
          if (sw) {
            annColor = sw.getAttribute("data-color");
            annotateBar.querySelectorAll(".swatch").forEach(function (b) {
              b.classList.toggle("on", b === sw);
            });
          }
        });
      }
      var annUndoBtn = document.getElementById("annUndoBtn");
      var annClearBtn = document.getElementById("annClearBtn");
      var annCloseBtn = document.getElementById("annCloseBtn");
      if (annUndoBtn) annUndoBtn.addEventListener("click", function () {
        strokeList().pop();
        redrawAnnotations();
      });
      if (annClearBtn) annClearBtn.addEventListener("click", function () {
        annStore[String(index)] = [];
        redrawAnnotations();
      });
      if (annCloseBtn) annCloseBtn.addEventListener("click", function () { setAnnotateOn(false); });

      buildChromeLists();
      resizeAnnotateCanvas();
      window.addEventListener("resize", resizeAnnotateCanvas);

      if (railBtn) railBtn.addEventListener("click", function (e) { e.preventDefault(); toggleRail(); });
      if (gridBtn) gridBtn.addEventListener("click", function (e) { e.preventDefault(); toggleGrid(); });
      if (annotateBtn) annotateBtn.addEventListener("click", function (e) { e.preventDefault(); toggleAnnotate(); });
      var railCloseBtn = document.getElementById("railCloseBtn");
      var gridCloseBtn = document.getElementById("gridCloseBtn");
      if (railCloseBtn) railCloseBtn.addEventListener("click", function () { setRailOpen(false); });
      if (gridCloseBtn) gridCloseBtn.addEventListener("click", function () { setGridOpen(false); });

      function jumpFromInput() {
        if (!pageInput) return;
        var n = parseInt(String(pageInput.value).trim(), 10);
        if (!Number.isFinite(n)) {
          pageInput.value = String(index + 1);
          return;
        }
        goTo(n - 1);
        pageInput.blur();
      }
      prevBtn.addEventListener("click", function () { go(-1); });
      nextBtn.addEventListener("click", function () { go(1); });
      if (homeBtn) homeBtn.addEventListener("click", function () { goTo(0); });
      if (endBtn) endBtn.addEventListener("click", function () { goTo(slides.length - 1); });

      function sleep(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
      }

      function resolvePptxCtor() {
        function looksLikePptx(Ctor) {
          if (typeof Ctor !== "function") return false;
          try {
            var probe = new Ctor();
            return !!(probe && typeof probe.addSlide === "function" && typeof probe.writeFile === "function");
          } catch (err) {
            return false;
          }
        }
        var candidates = [
          window.PptxGenJS,
          window.PptxGenJS && window.PptxGenJS.default,
          window.pptxgen,
          window.pptxgenjs
        ];
        for (var i = 0; i < candidates.length; i++) {
          if (looksLikePptx(candidates[i])) return candidates[i];
        }
        return null;
      }

      function withTimeout(promise, ms, label) {
        return new Promise(function (resolve, reject) {
          var done = false;
          var timer = setTimeout(function () {
            if (done) return;
            done = true;
            reject(new Error((label || "操作") + "超时（>" + ms + "ms）"));
          }, ms);
          promise.then(function (v) {
            if (done) return;
            done = true;
            clearTimeout(timer);
            resolve(v);
          }, function (err) {
            if (done) return;
            done = true;
            clearTimeout(timer);
            reject(err);
          });
        });
      }

      function makeFallbackSlideCanvas(title) {
        var w = Math.max(960, window.innerWidth || 1280);
        var h = Math.max(540, window.innerHeight || 720);
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var ctx = c.getContext("2d");
        var paper = getComputedStyle(root).getPropertyValue("--paper").trim() || "#060a10";
        var ink = getComputedStyle(root).getPropertyValue("--ink").trim() || "#fde047";
        var neon = getComputedStyle(root).getPropertyValue("--neon").trim() || "#22d3ee";
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = neon;
        ctx.font = "600 28px Syne, sans-serif";
        ctx.fillText("Harness Training", 48, 64);
        ctx.fillStyle = ink;
        ctx.font = "700 54px Syne, PingFang SC, sans-serif";
        ctx.fillText(String(title || "Slide"), 48, h / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px IBM Plex Mono, monospace";
        ctx.fillText("screenshot fallback · 请用 python -m tools.export_training_ppt", 48, h - 48);
        c.__fallback = true;
        return c;
      }

      function letterboxCanvas(src, w, h, paper) {
        var out = document.createElement("canvas");
        out.width = w;
        out.height = h;
        var ctx = out.getContext("2d");
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, w, h);
        if (!src || !src.width || !src.height) return out;
        var scale = Math.min(w / src.width, h / src.height);
        var dw = Math.round(src.width * scale);
        var dh = Math.round(src.height * scale);
        var dx = Math.round((w - dw) / 2);
        var dy = Math.round((h - dh) / 2);
        ctx.drawImage(src, dx, dy, dw, dh);
        return out;
      }

      function prepareSlideForCapture(slide) {
        if (!slide) return function () {};
        try { if (window.anime) anime.remove(animTargets(slide)); } catch (e) {}
        try {
          if (window.anime) {
            var chars = slide.querySelectorAll("#coverBrand .char, .brand-mark .char");
            if (chars.length) anime.remove(chars);
          }
        } catch (e2) {}
        resetAnimStyles(slide);
        clearLit(slide);

        var prev = {
          opacity: slide.style.opacity,
          transform: slide.style.transform,
          animation: slide.style.animation,
          filter: slide.style.filter,
          display: slide.style.display
        };
        var touched = [];
        slide.style.setProperty("opacity", "1", "important");
        slide.style.setProperty("transform", "none", "important");
        slide.style.setProperty("animation", "none", "important");
        slide.style.setProperty("filter", "none", "important");
        slide.style.display = slide.classList.contains("slide-cover") ? "grid" : "flex";

        var forceSel = [
          ".char", ".word", ".brand-mark", ".cover-hero", ".cover-copy", ".cover-foot",
          ".cover-foot-card", ".cover-viz", ".cover-meta", ".cover-speaker", ".cover-talk-time", ".kicker", ".lead",
          ".title-meta", "h1", "h2", "h3", "p", "li", ".card", ".case-card", ".pain-card",
          ".toc-card", ".section-num", ".badge", ".chip", ".formula", ".cmd-hero",
          ".ref-panel", "table", "pre", ".flow", ".node", ".animate__animated",
          ":scope > *"
        ].join(",");
        slide.querySelectorAll(forceSel).forEach(function (el) {
          touched.push({
            el: el,
            opacity: el.style.opacity,
            transform: el.style.transform,
            filter: el.style.filter,
            animation: el.style.animation,
            visibility: el.style.visibility
          });
          el.style.setProperty("opacity", "1", "important");
          el.style.setProperty("visibility", "visible", "important");
          el.style.setProperty("transform", "none", "important");
          el.style.setProperty("filter", "none", "important");
          el.style.setProperty("animation", "none", "important");
        });
        return function restore() {
          slide.style.opacity = prev.opacity;
          slide.style.transform = prev.transform;
          slide.style.animation = prev.animation;
          slide.style.filter = prev.filter;
          slide.style.display = prev.display;
          touched.forEach(function (t) {
            t.el.style.opacity = t.opacity;
            t.el.style.transform = t.transform;
            t.el.style.filter = t.filter;
            t.el.style.animation = t.animation;
            t.el.style.visibility = t.visibility;
          });
        };
      }

      function safeCanvasToDataURL(canvas, type, quality) {
        if (!canvas) return null;
        try {
          return canvas.toDataURL(type || "image/jpeg", quality == null ? 0.92 : quality);
        } catch (err) {
          console.warn("toDataURL tainted/blocked:", err);
          return null;
        }
      }

      function isExportIgnoreEl(el) {
        if (!el) return false;
        if (el.tagName === "VIDEO" || el.tagName === "SOURCE" || el.tagName === "CANVAS") return true;
        if (el.id === "term-tip" || el.id === "exportPptToast" || el.id === "tsparticles"
          || el.id === "vanta-cover" || el.id === "aiAmbient" || el.id === "coverCursorGlow") {
          return true;
        }
        if (!el.classList) return false;
        return el.classList.contains("footer")
          || el.classList.contains("progress")
          || el.classList.contains("present-toast")
          || el.classList.contains("present-hotzone")
          || el.classList.contains("export-ppt-toast")
          || el.classList.contains("theme-panel")
          || el.classList.contains("theme-wrap")
          || el.classList.contains("demo-player")
          || el.classList.contains("scanlines")
          || el.classList.contains("hud-frame")
          || el.classList.contains("slide-rail")
          || el.classList.contains("slide-grid")
          || el.classList.contains("annotate-layer")
          || el.classList.contains("annotate-bar");
      }

      function oncloneForExport(doc) {
        try {
          doc.documentElement.classList.add("exporting-ppt");
          doc.documentElement.style.background = getComputedStyle(root).getPropertyValue("--paper").trim() || "#060a10";
          if (doc.body) {
            doc.body.style.background = doc.documentElement.style.background;
          }
          var clonedSlide = doc.querySelector(".slide.active");
          if (clonedSlide) {
            clonedSlide.style.setProperty("opacity", "1", "important");
            clonedSlide.style.setProperty("animation", "none", "important");
            clonedSlide.style.setProperty("transform", "none", "important");
            clonedSlide.style.setProperty("filter", "none", "important");
            clonedSlide.style.display = clonedSlide.classList.contains("slide-cover") ? "grid" : "flex";
            clonedSlide.querySelectorAll("*").forEach(function (n) {
              var op = n.style.opacity;
              if (op === "0") n.style.setProperty("opacity", "1", "important");
              n.style.setProperty("animation", "none", "important");
              n.style.setProperty("transition", "none", "important");
            });
            // background-clip:text 在克隆里再保一次实色
            clonedSlide.querySelectorAll(".brand-mark, .brand-mark .char").forEach(function (n) {
              n.style.setProperty("background", "none", "important");
              n.style.setProperty("color", "#fde047", "important");
              n.style.setProperty("-webkit-text-fill-color", "#fde047", "important");
              n.style.setProperty("-webkit-background-clip", "border-box", "important");
              n.style.setProperty("background-clip", "border-box", "important");
            });
          }
          doc.querySelectorAll(
            "video, canvas, .demo-player, #tsparticles, #vanta-cover, #aiAmbient, #coverCursorGlow, .scanlines, .hud-frame, .footer, .progress, .export-ppt-toast, .present-toast, .present-hotzone, .theme-wrap, #term-tip"
          ).forEach(function (n) {
            if (n && n.parentNode) n.parentNode.removeChild(n);
          });
        } catch (err) {}
      }

      async function html2canvasOnce(target, opts, label, ms) {
        return withTimeout(html2canvas(target, opts), ms || 18000, label);
      }

      async function captureOneTarget(target, paper, w, h, label) {
        if (!target) throw new Error("no target");
        var rect = target.getBoundingClientRect();
        var opts = {
          backgroundColor: paper,
          windowWidth: w,
          windowHeight: h,
          scrollX: 0,
          scrollY: 0,
          scale: 1,
          logging: false,
          foreignObjectRendering: false,
          useCORS: true,
          allowTaint: false,
          imageTimeout: 1200,
          ignoreElements: isExportIgnoreEl,
          onclone: oncloneForExport
        };
        // 对全视口容器限定宽高；对 .slide 用自身包围盒，避免裁切封面底部卡片
        if (target === document.body || (target.id && target.id === "deck")) {
          opts.width = w;
          opts.height = h;
          opts.x = 0;
          opts.y = 0;
        } else if (rect.width > 0 && rect.height > 0) {
          opts.width = Math.ceil(rect.width);
          opts.height = Math.ceil(rect.height);
        }
        var canvas = await html2canvasOnce(target, opts, label, 18000);
        if (!canvas || !canvas.width || !canvas.height) throw new Error("empty canvas");
        var boxed = letterboxCanvas(canvas, w, h, paper);
        if (safeCanvasToDataURL(boxed, "image/jpeg", 0.92)) return boxed;
        if (safeCanvasToDataURL(canvas, "image/jpeg", 0.92)) return canvas;
        throw new Error("tainted canvas");
      }

      /** 当前标签页屏幕截屏（Chrome/Edge）：能带上粒子 / WebGL，比 html2canvas 真 */
      async function startTabCaptureSession() {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== "function") {
          return null;
        }
        try {
          var stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "browser",
              frameRate: { ideal: 30 }
            },
            audio: false,
            preferCurrentTab: true,
            selfBrowserSurface: "include",
            surfaceSwitching: "exclude",
            systemAudio: "exclude"
          });
          var track = stream.getVideoTracks()[0];
          if (!track) {
            stream.getTracks().forEach(function (t) { t.stop(); });
            return null;
          }
          var video = document.createElement("video");
          video.setAttribute("playsinline", "");
          video.muted = true;
          video.playsInline = true;
          video.srcObject = stream;
          await video.play();
          await new Promise(function (resolve) {
            if (video.videoWidth > 0) resolve();
            else {
              video.onloadedmetadata = function () { resolve(); };
              setTimeout(resolve, 1200);
            }
          });
          await sleep(120);
          return {
            stream: stream,
            video: video,
            track: track,
            stop: function () {
              try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
              try { video.pause(); } catch (e2) {}
              video.srcObject = null;
            }
          };
        } catch (err) {
          console.warn("tab capture unavailable:", err);
          return null;
        }
      }

      function captureFrameFromTab(session, w, h, paper) {
        var video = session.video;
        var vw = video.videoWidth || 0;
        var vh = video.videoHeight || 0;
        if (!vw || !vh) throw new Error("tab capture no video frame");
        var out = document.createElement("canvas");
        out.width = w;
        out.height = h;
        var ctx = out.getContext("2d");
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, w, h);
        // cover 裁切到 16:9 视口比例
        var scale = Math.max(w / vw, h / vh);
        var dw = Math.round(vw * scale);
        var dh = Math.round(vh * scale);
        var dx = Math.round((w - dw) / 2);
        var dy = Math.round((h - dh) / 2);
        ctx.drawImage(video, dx, dy, dw, dh);
        out.__captureMode = "tab";
        return out;
      }

      /** DOM 截图兜底（关特效，保证正文不丢） */
      async function captureViewportDom(title) {
        var paper = getComputedStyle(root).getPropertyValue("--paper").trim() || "#060a10";
        var w = Math.max(960, window.innerWidth || 1280);
        var h = Math.max(540, window.innerHeight || 720);
        var slide = getActiveSlide();
        var restoreSlide = prepareSlideForCapture(slide);
        await sleep(80);
        await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });

        try {
          if (slide) {
            try {
              return await captureOneTarget(slide, paper, w, h, "截图页「" + title + "」");
            } catch (err1) {
              console.warn("slide capture failed, try deck:", title, err1);
            }
          }
          var deck = document.getElementById("deck");
          if (deck) {
            try {
              return await captureOneTarget(deck, paper, w, h, "截图deck「" + title + "」");
            } catch (err2) {
              console.warn("deck capture failed, try body:", title, err2);
            }
          }
          return await captureOneTarget(document.body, paper, w, h, "截图body「" + title + "」");
        } catch (err) {
          console.warn("all DOM capture paths failed:", title, err);
          return makeFallbackSlideCanvas(title);
        } finally {
          restoreSlide();
        }
      }

      async function captureViewportForPpt(title, tabSession) {
        var paper = getComputedStyle(root).getPropertyValue("--paper").trim() || "#060a10";
        var w = Math.max(960, window.innerWidth || 1280);
        var h = Math.max(540, window.innerHeight || 720);
        var slide = getActiveSlide();
        var restoreSlide = prepareSlideForCapture(slide);
        pauseAllVideos();
        await sleep(tabSession ? 280 : 100);
        await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });

        try {
          if (tabSession && tabSession.video && tabSession.track && tabSession.track.readyState === "live") {
            root.classList.add("export-grabbing");
            await sleep(50);
            try {
              var frame = captureFrameFromTab(tabSession, w, h, paper);
              if (safeCanvasToDataURL(frame, "image/jpeg", 0.92)) return frame;
            } finally {
              root.classList.remove("export-grabbing");
            }
          }
          // 标签页帧失败 → 降级 DOM（关掉特效层）
          restoreSlide();
          restoreSlide = function () {};
          if (!root.classList.contains("export-dom-mode")) {
            root.classList.add("export-dom-mode");
            setParticlesEnabled(false, false);
          }
          return await captureViewportDom(title);
        } catch (err) {
          console.warn("capture failed:", title, err);
          return makeFallbackSlideCanvas(title);
        } finally {
          restoreSlide();
        }
      }

      function createPptxDoc(PptxCtor) {
        var pptx = new PptxCtor();
        if (typeof pptx.defineLayout !== "function" || typeof pptx.addSlide !== "function") {
          throw new Error("PptxGenJS 未正确加载（实例无 addSlide）。请硬刷新后重试。");
        }
        var layoutW = 13.333;
        var layoutH = 7.5;
        pptx.defineLayout({ name: "VIEW16x9", width: layoutW, height: layoutH });
        pptx.layout = "VIEW16x9";
        pptx.author = "Harness Training Deck";
        pptx.title = "Harness Engineering 培训";
        return { pptx: pptx, layoutW: layoutW, layoutH: layoutH };
      }

      function addCanvasToPptx(pptx, canvas, title, layoutW, layoutH) {
        var dataUrl = safeCanvasToDataURL(canvas, "image/jpeg", 0.92);
        if (!dataUrl) {
          canvas = makeFallbackSlideCanvas(title);
          dataUrl = safeCanvasToDataURL(canvas, "image/jpeg", 0.92);
        }
        if (!dataUrl) return { ok: false, fallback: true };
        var slide = pptx.addSlide();
        slide.addNotes(title);
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: layoutW, h: layoutH });
        return { ok: true, fallback: !!(canvas && canvas.__fallback) };
      }

      /** 导出全部页：优先当前标签页截屏（含粒子）；导出中不显示进度浮层 */
      async function exportVisibleSlidesToPpt() {
        if (exportPptBusy) return;
        var PptxCtor = resolvePptxCtor();
        if (!PptxCtor) {
          alert("导出库未加载：需要 jszip.min.js + pptxgen.min.js（且 window.PptxGenJS 可用）。");
          return;
        }
        exportPptBusy = true;
        var savedIndex = index;
        var wasPresent = presentMode;
        var wasParticles = particlesEnabled;
        var wasBgm = bgmEnabled;
        var tabSession = null;
        var useTabCapture = false;

        if (wasPresent) setPresentMode(false);
        setFooterPeek(false);
        if (themeWrap) themeWrap.classList.remove("open");
        if (wasBgm) setBgmEnabled(false, false);
        if (!particlesEnabled) setParticlesEnabled(true, false);
        root.classList.add("exporting-ppt");
        root.classList.remove("export-dom-mode");

        try {
          tabSession = await startTabCaptureSession();
          useTabCapture = !!tabSession;
          if (!useTabCapture) {
            if (typeof html2canvas !== "function") {
              throw new Error("未授权标签页截屏，且 html2canvas 未加载，无法导出。");
            }
            root.classList.add("export-dom-mode");
            if (wasParticles) setParticlesEnabled(false, false);
            await sleep(200);
          }

          var full = createPptxDoc(PptxCtor);
          var fallbackCount = 0;

          for (var i = 0; i < slides.length; i++) {
            var title = slides[i].dataset.title || ("第" + (i + 1) + "页");
            // 进度只写 document.title，不弹浮层，避免进截屏
            try {
              document.title = "导出中 " + (i + 1) + "/" + slides.length;
            } catch (e) {}

            goTo(i, true);
            pauseAllVideos();
            if (useTabCapture) {
              if (typeof refreshParticles === "function") refreshParticles(true);
              if (typeof refreshVanta === "function") refreshVanta();
            }
            await sleep(useTabCapture ? 320 : 160);

            if (useTabCapture && (!tabSession.track || tabSession.track.readyState !== "live")) {
              useTabCapture = false;
              tabSession = null;
              root.classList.add("export-dom-mode");
              setParticlesEnabled(false, false);
            }

            var canvas = await captureViewportForPpt(title, useTabCapture ? tabSession : null);
            var added = addCanvasToPptx(full.pptx, canvas, title, full.layoutW, full.layoutH);
            if (!added.ok || added.fallback) fallbackCount += 1;
            await sleep(16);
          }

          await withTimeout(
            full.pptx.writeFile({ fileName: "Harness_Engineering_培训.pptx" }),
            60000,
            "写入 PPTX"
          );
          if (fallbackCount > 0) {
            alert(
              "导出完成，但有 " + fallbackCount + " 页截图质量较差或失败。\n\n" +
              "可重试并选择「这个标签页」截屏；或 CLI：\npython -m tools.export_training_ppt"
            );
          } else {
            alert(
              "导出完成：" + slides.length + " 页" +
              (useTabCapture ? "（标签页截屏·含粒子）" : "（DOM 截图）")
            );
          }
        } catch (err) {
          console.error(err);
          alert("导出 PPT 失败：" + (err && err.message ? err.message : String(err)));
        } finally {
          if (tabSession && typeof tabSession.stop === "function") tabSession.stop();
          root.classList.remove("exporting-ppt", "export-dom-mode", "export-grabbing");
          exportPptBusy = false;
          try { document.title = "Harness Engineering 培训"; } catch (e) {}
          if (wasParticles) setParticlesEnabled(true, false);
          else setParticlesEnabled(false, false);
          if (wasBgm) setBgmEnabled(true, false);
          goTo(savedIndex, true);
          if (wasPresent) setPresentMode(true);
          if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 2.1 } });
        }
      }

      if (exportPptBtn) {
        exportPptBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          exportVisibleSlidesToPpt();
        });
      }

      if (pageInput) {
        pageInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            jumpFromInput();
          } else if (e.key === "Escape") {
            e.preventDefault();
            pageInput.value = String(index + 1);
            pageInput.blur();
          }
        });
        pageInput.addEventListener("change", jumpFromInput);
        pageInput.addEventListener("click", function (e) { e.stopPropagation(); });
        pageInput.addEventListener("focus", function () { pageInput.select(); });
      }
      document.addEventListener("keydown", function (e) {
        if (e.target.closest("input, textarea")) return;
        if (e.key === "f" || e.key === "F") {
          if (e.target.closest("video")) return;
          e.preventDefault();
          togglePresentMode();
          return;
        }
        if (e.key === "t" || e.key === "T") {
          if (e.target.closest("video, input, textarea")) return;
          e.preventDefault();
          toggleThemePanel();
          return;
        }
        if (e.key === "p" || e.key === "P") {
          if (e.target.closest("video, input, textarea")) return;
          e.preventDefault();
          toggleParticles();
          return;
        }
        if (e.key === "m" || e.key === "M") {
          if (e.target.closest("video, input, textarea")) return;
          e.preventDefault();
          toggleBgm();
          return;
        }
        if (e.key === "s" || e.key === "S") {
          if (e.target.closest("video, input, textarea")) return;
          e.preventDefault();
          toggleRail();
          return;
        }
        if (e.key === "g" || e.key === "G") {
          if (e.target.closest("video, input, textarea")) return;
          e.preventDefault();
          toggleGrid();
          return;
        }
        if (e.key === "a" || e.key === "A") {
          if (e.target.closest("video, input, textarea")) return;
          e.preventDefault();
          toggleAnnotate();
          return;
        }
        if (e.key === "Escape") {
          if (railOpen) { setRailOpen(false); e.preventDefault(); return; }
          if (gridOpen) { setGridOpen(false); e.preventDefault(); return; }
          if (annotateOn) { setAnnotateOn(false); e.preventDefault(); return; }
        }
        // 画笔开启时方向键仍可翻页；空格不翻页以免误触
        if (annotateOn && e.key === " ") {
          e.preventDefault();
          return;
        }
        // 演示页：空格控制播放/暂停，不翻页
        if (e.key === " " && slides[index] && slides[index].classList.contains("slide-demo")) {
          e.preventDefault();
          var dv = slides[index].querySelector("video");
          if (!dv) return;
          if (dv.paused) {
            var pp = dv.play();
            if (pp && typeof pp.catch === "function") pp.catch(function () {});
          } else {
            dv.pause();
          }
          return;
        }
        if (e.target.closest("video") && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
        if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(1); }
        else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
        else if (e.key === "Home") { e.preventDefault(); goTo(0); }
        else if (e.key === "End") { e.preventDefault(); goTo(slides.length - 1); }
      });
      document.getElementById("deck").addEventListener("click", function (e) {
        if (annotateOn || railOpen || gridOpen) return;
        if (e.target.closest("button, a, pre, code, .case-card, .term, video, .demo-player, .cmd-hero, .theme-wrap, .page-jump, .slide-rail, .slide-grid, .annotate-bar, .layout-contrast, .layout-steps")) return;
        const x = e.clientX / window.innerWidth;
        if (x > 0.55) go(1); else if (x < 0.45) go(-1);
      });

      (function bindCopyCmd() {
        var btn = document.getElementById("copyLiveCmd");
        if (!btn) return;
        function fallbackCopy(text) {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (err) {}
          document.body.removeChild(ta);
        }
        function flashOk() {
          var label = btn.querySelector("span");
          btn.classList.add("ok");
          if (label) label.textContent = "已复制";
          paintIcons();
          setTimeout(function () {
            btn.classList.remove("ok");
            if (label) label.textContent = "复制";
            paintIcons();
          }, 1600);
        }
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var text = (btn.getAttribute("data-cmd") || "").trim();
          if (!text) return;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(flashOk).catch(function () {
              fallbackCopy(text);
              flashOk();
            });
          } else {
            fallbackCopy(text);
            flashOk();
          }
        });
      })();

      document.querySelectorAll(".grid2 .card, .grid3 .card, .grid6 .card").forEach(function (card) {
        if (!card.classList.contains("hvr-grow")) card.classList.add("hvr-grow");
      });

      refreshCoverTalkTime();
      setInterval(function () {
        if (isCoverActive()) refreshCoverTalkTime();
      }, 30000);

      const m = location.hash.match(/^#s(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10) - 1;
        if (n >= 0 && n < slides.length) index = n;
      }
      render();
    })();

