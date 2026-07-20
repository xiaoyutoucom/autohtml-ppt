/*!
 * Tech Training Deck · provenance mark
 * 公开溯源标识（非隐蔽上报）。保留本文件与 fingerprint 有助于识别衍生使用。
 * 权威字段：docs/deck/provenance.json（HTTP 下可热读；否则用下方 FALLBACK）
 */
(function (w, d) {
  function stripLineComment(line) {
    var inStr = false;
    var escape = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line.charAt(i);
      if (inStr) {
        if (escape) escape = false;
        else if (ch === "\\") escape = true;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') {
        inStr = true;
      } else if (ch === "/" && line.charAt(i + 1) === "/") {
        return line.slice(0, i).replace(/\s+$/, "");
      }
    }
    return line;
  }

  function parseJsonc(text) {
    text = String(text || "").replace(/\/\*[\s\S]*?\*\//g, "");
    text = text
      .split("\n")
      .map(stripLineComment)
      .join("\n");
    text = text.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(text);
  }

  var FALLBACK = {
    "projectId": "tech-training-deck",
    "fingerprint": "TTD-2026-XIAOYUTOUCOM",
    "productName": "Tech Training Deck",
    "version": "0.1.0",
    "copyright": "© 2026 xiaoyutoucom",
    "license": "AGPL-3.0-or-later OR Commercial",
    "homepage": "https://github.com/xiaoyutoucom/autohtml-ppt",
    "contact": "xiaoyutoucom@gmail.com",
    "requireAttribution": true
  };

  var prov = null;
  var base =
    (d.currentScript && d.currentScript.src) || w.location.href;
  try {
    var url = new URL("../provenance.json", base).href;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.overrideMimeType("application/json");
    xhr.send(null);
    var ok = xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300);
    if (ok && xhr.responseText && /^\s*\{/.test(xhr.responseText)) {
      prov = parseJsonc(xhr.responseText);
    }
  } catch (e) {}
  if (!prov) prov = FALLBACK;

  var mark = {
    projectId: String(prov.projectId || FALLBACK.projectId),
    fingerprint: String(prov.fingerprint || FALLBACK.fingerprint),
    productName: String(prov.productName || FALLBACK.productName),
    version: String(prov.version || FALLBACK.version),
    copyright: String(prov.copyright || FALLBACK.copyright),
    license: String(prov.license || FALLBACK.license),
    homepage: String(prov.homepage || FALLBACK.homepage),
    contact: String(prov.contact || FALLBACK.contact),
    requireAttribution: prov.requireAttribution !== false,
    engine: "autohtml-ppt"
  };

  // 全局可核验对象（搜 fingerprint / projectId 可找衍生站）
  w.__TECH_TRAINING_DECK__ = mark;
  w.DECK_PROVENANCE = mark;

  var root = d.documentElement;
  if (root) {
    root.setAttribute("data-deck-id", mark.projectId);
    root.setAttribute("data-deck-fingerprint", mark.fingerprint);
    root.setAttribute("data-deck-version", mark.version);
  }

  function upsertMeta(name, content, attr) {
    if (!d.head || !content) return;
    attr = attr || "name";
    var sel =
      attr === "property"
        ? 'meta[property="' + name + '"]'
        : 'meta[name="' + name + '"]';
    var el = d.head.querySelector(sel);
    if (!el) {
      el = d.createElement("meta");
      el.setAttribute(attr, name);
      d.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  upsertMeta("generator", mark.productName + " " + mark.version);
  upsertMeta("author", mark.copyright);
  upsertMeta("deck-fingerprint", mark.fingerprint);
  upsertMeta("deck-license", mark.license);

  // HTML 注释锚点：导出/爬虫仍可能留下
  try {
    var comment = d.createComment(
      " " +
        mark.productName +
        " | " +
        mark.fingerprint +
        " | " +
        mark.copyright +
        " | " +
        mark.license +
        " | " +
        mark.homepage +
        " "
    );
    if (d.documentElement) {
      d.documentElement.insertBefore(comment, d.documentElement.firstChild);
    }
  } catch (e2) {}

  function paintAttribution() {
    if (!mark.requireAttribution) return;
    var slot = d.getElementById("deckAttribution");
    if (!slot) return;
    slot.hidden = false;
    var home = mark.homepage || "#";
    slot.innerHTML =
      '<a class="deck-attr-link" href="' +
      home.replace(/"/g, "&quot;") +
      '" target="_blank" rel="noopener noreferrer" title="' +
      String(mark.copyright).replace(/"/g, "&quot;") +
      '">' +
      '<span class="deck-attr-mark">' +
      mark.fingerprint +
      "</span>" +
      '<span class="deck-attr-name">' +
      mark.productName +
      "</span>" +
      "</a>";
  }

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", paintAttribution);
  } else {
    paintAttribution();
  }

  try {
    console.info(
      "[deck-provenance]",
      mark.fingerprint,
      mark.copyright,
      mark.license,
      mark.homepage
    );
  } catch (e3) {}
})(window, document);
