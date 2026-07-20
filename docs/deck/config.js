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
  "theme": 3,
  "speaker": "y",
  "bgm": false,
  "bgmSrc": "dylanf - 卡农 (经典钢琴版).mp3"
};

  var cfg = null;
  var base =
    (document.currentScript && document.currentScript.src) ||
    w.location.href;
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

  if (!cfg) {
    cfg = FALLBACK;
    try {
      if (String(w.location.protocol) === "file:") {
        console.info(
          "[deck] file:// 下无法热读 config.json。请用本地 HTTP 打开 docs/，或改 deck/config.js 里的 FALLBACK 后刷新。"
        );
      }
    } catch (e2) {}
  }

  w.DECK_CONFIG = cfg;
})(window);
