/*! Kuvonch Academy — til tanlagich (uz / ru / en / kk / ky) */
(function () {
  "use strict";
  if (window.kaTil) return;
  var LANGS = [["uz", "O'zbekcha"], ["ru", "Русский"], ["en", "English"], ["kk", "Қазақша"], ["ky", "Кыргызча"]];
  var SR = { uz: "uz-UZ", ru: "ru-RU", en: "en-US", kk: "kk-KZ", ky: "ky-KG" };
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1, SVG: 1 };
  var lang = "uz", dict = null, obs = null, timer = null, busy = false;
  var tmap = new WeakMap(), amap = new WeakMap();

  try { var q = /[?&]til=(uz|ru|en|kk|ky)\b/.exec(location.search); lang = (q && q[1]) || localStorage.getItem("ka.til") || "uz"; } catch (e) {}
  if (!SR[lang]) lang = "uz";
  // Sahifa tili qat'iy belgilangan bo'lsa (masalan, SAT bo'limi — faqat inglizcha): <html data-til-force="en">
  var FORCE = document.documentElement.getAttribute("data-til-force");
  if (FORCE && SR[FORCE]) lang = FORCE; else FORCE = null;

  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function tr(s) {
    if (!dict) return null;
    var k = norm(s); if (!k) return null;
    if (dict[k] != null) return dict[k];
    var m = /^((?:\d+|[IVXL]+)\.\s*)(.+)$/.exec(k);
    if (m && dict[m[2]] != null) return m[1] + dict[m[2]];
    // sonli matnlar: "Xatolar (3 ta)" → kalit "Xatolar (# ta)"
    if (/\d/.test(k)) {
      var nums = k.match(/\d+/g), t = dict[k.replace(/\d+/g, "#")];
      if (t != null && (t.match(/#/g) || []).length === nums.length) { var i = 0; return t.replace(/#/g, function () { return nums[i++]; }); }
    }
    return null;
  }
  function textNode(n) {
    var rec = tmap.get(n), cur = n.data, src = cur;
    if (rec && norm(cur) === rec.tr) src = rec.orig; // o'zimiz o'zgartirgan matn
    var t = lang === "uz" ? null : tr(src);
    if (t == null) { if (src !== cur) n.data = src; if (rec && lang === "uz") tmap.delete(n); else if (rec && src === cur) tmap.delete(n); return; }
    var lead = /^\s*/.exec(src)[0], trail = /\s*$/.exec(src)[0];
    var out = lead + t + trail;
    if (n.data !== out) n.data = out;
    tmap.set(n, { orig: src, tr: norm(t) });
  }
  function attrs(el) {
    var rec = amap.get(el) || {};
    ATTRS.forEach(function (a) {
      var v = el.getAttribute && el.getAttribute(a); if (v == null) return;
      var r = rec[a], src = v;
      if (r && norm(v) === r.tr) src = r.orig;
      var t = lang === "uz" ? null : tr(src);
      if (t == null) { if (src !== v) el.setAttribute(a, src); delete rec[a]; return; }
      if (v !== t) el.setAttribute(a, t);
      rec[a] = { orig: src, tr: norm(t) };
    });
    amap.set(el, rec);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1 || SKIP[root.tagName && root.tagName.toUpperCase()]) return;
    if (root.id === "ka-til-box") return;
    attrs(root);
    for (var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }
  function apply(root) {
    busy = true;
    try { walk(root || document.body); if (!root || root === document.body) { document.documentElement.lang = lang; if (!window.__kaTitle) window.__kaTitle = document.title; var t = lang === "uz" ? null : tr(window.__kaTitle); document.title = t || window.__kaTitle; } }
    finally { if (obs && (!root || root === document.body)) obs.takeRecords(); busy = false; }
  }
  // Faqat o'zgargan tugunlarni tarjima qilamiz (avval har o'zgarishda butun sahifa qayta aylanardi —
  // taymerli o'yinlarda va katta sahifalarda telefon qotib qolardi).
  var pend = [], pendAttr = [], full = false;
  function flush() {
    timer = 0;
    if (lang === "uz" && !dict) { pend = []; pendAttr = []; full = false; return; }
    busy = true;
    try {
      if (full) walk(document.body);
      else {
        for (var i = 0; i < pend.length; i++) { var n = pend[i]; if (n.isConnected !== false) walk(n); }
        for (var j = 0; j < pendAttr.length; j++) { var el = pendAttr[j]; if (el.isConnected !== false && !(el.closest && el.closest("#ka-til-box"))) attrs(el); }
      }
    } finally {
      pend = []; pendAttr = []; full = false;
      if (obs) obs.takeRecords(); // o'zimiz qilgan o'zgarishlar qayta navbatga tushmasin
      busy = false;
    }
  }
  function watch() {
    if (obs) return;
    obs = new MutationObserver(function (ms) {
      if (busy || lang === "uz" && !dict) return;
      if (!full) for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === "childList") { for (var j = 0; j < m.addedNodes.length; j++) pend.push(m.addedNodes[j]); }
        else if (m.type === "characterData") pend.push(m.target);
        else pendAttr.push(m.target);
        if (pend.length + pendAttr.length > 600) { full = true; pend = []; pendAttr = []; break; }
      }
      if (!timer) timer = setTimeout(flush, 40);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  // Katta sahifalarning matn tarjimalari alohida faylda — boshqa sahifalar ularni yuklamaydi
  var EXTRA = { "mashqlar.html": "mashq", "sat-dars.html": "sat" };
  function extraName() {
    var a = document.documentElement.getAttribute("data-til-extra");
    if (a) return a;
    var f = (location.pathname.split("/").pop() || "index.html");
    return EXTRA[f] || "";
  }
  var loaded = {};
  function addScript(src) {
    return new Promise(function (ok) {
      if (loaded[src]) return ok();
      var s = document.createElement("script"); s.src = src;
      s.onload = function () { loaded[src] = 1; ok(); };
      s.onerror = function () { ok(); };
      document.head.appendChild(s);
    });
  }
  function loadDict(l) {
    if (l === "uz") { dict = null; return Promise.resolve(); }
    window.KA_TR = window.KA_TR || {};
    var main = window.KA_TR[l] ? Promise.resolve() : addScript("ka-til-" + l + ".js");
    var ex = extraName();
    return main.then(function () { return ex ? addScript("ka-til-" + l + "-" + ex + ".js") : null; })
      .then(function () { dict = window.KA_TR[l] || null; });
  }
  function set(l) {
    if (!SR[l]) return Promise.resolve();
    if (FORCE) { try { localStorage.setItem("ka.til", l); } catch (e) {} return Promise.resolve(); } // bu sahifa tili o'zgarmaydi
    lang = l; try { localStorage.setItem("ka.til", l); } catch (e) {}
    return loadDict(l).then(function () { apply(document.body); var sel = document.getElementById("ka-til-sel"); if (sel) sel.value = l; try { window.dispatchEvent(new CustomEvent("ka-til", { detail: l })); } catch (e) {} });
  }
  function ui() {
    var box = document.createElement("div"); box.id = "ka-til-box";
    box.style.cssText = "position:fixed;left:112px;top:8px;z-index:961;";
    var sel = document.createElement("select"); sel.id = "ka-til-sel"; sel.setAttribute("aria-label", "Til / Language");
    sel.style.cssText = "-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#141f38 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23eef2ff' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\") no-repeat right 10px center/10px 6px;color:#eef2ff;border:1px solid #243252;border-radius:999px;padding:7px 26px 7px 10px;font:700 13px/1 -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);height:38px;max-width:140px";
    LANGS.forEach(function (x) { var o = document.createElement("option"); o.value = x[0]; o.textContent = "🌐 " + x[1]; sel.appendChild(o); });
    sel.value = lang; sel.onchange = function () { set(sel.value); };
    if (FORCE) { sel.disabled = true; sel.title = FORCE === "en" ? "This section is in English only" : ""; sel.style.opacity = ".75"; }
    box.appendChild(sel); document.body.appendChild(box);
  }
  function init() {
    ui(); watch();
    if (lang !== "uz") loadDict(lang).then(function () { apply(document.body); }); else apply(document.body);
  }
  window.kaTil = { get: function () { return lang; }, set: set, speech: function () { return SR[lang]; }, t: function (s) { return lang === "uz" ? s : (tr(s) || s); }, apply: function () { apply(document.body); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

/* Tepadagi chiplar (👤 akkount, 🌐 til, 🌳 daraxt) o'yin maydoni yoki o'yin tugmasi ustiga tushib qolsa —
   vaqtincha yashirinadi (bosilgan barmoq o'yinga yetib borsin), joy bo'shashi bilan qaytadi. */
(function () {
  if (window.__kaChipJoy) return; window.__kaChipJoy = 1;
  var SEL = ".acc-fixed,#ka-til-box,.kd-pill";
  var CTRL = "canvas,button,a[href],input,select,textarea,label,summary,[role=button],[onclick],[data-act]";
  try { var st = document.createElement("style"); st.textContent = ".ka-joy{opacity:0!important;pointer-events:none!important;transition:opacity .18s!important}"; document.head.appendChild(st); } catch (e) { return; }
  function fixedUp(n) { for (; n && n.nodeType === 1 && n !== document.body; n = n.parentElement) { var p = getComputedStyle(n).position; if (p === "fixed" || p === "sticky") return true; } return false; }
  function blocks(c) {
    var r = c.getBoundingClientRect(); if (!r.width || !r.height) return false;
    var pe = c.style.pointerEvents; c.style.pointerEvents = "none";
    var y = r.top + r.height / 2, xs = [r.left + 6, r.left + r.width / 2, r.right - 6], hit = false;
    var tinch = window.scrollY < 80 || document.documentElement.scrollHeight <= innerHeight + 4;
    for (var i = 0; i < 3 && !hit; i++) {
      var h = document.elementFromPoint(xs[i], y);
      if (!h || h === document.body || h === document.documentElement || h.closest(SEL)) continue;
      var t = h.closest(CTRL);
      if (!t) { for (var p = h, k = 0; p && p !== document.body && k < 4; p = p.parentElement, k++) { if (getComputedStyle(p).cursor === "pointer" && getComputedStyle(p.parentElement).cursor !== "pointer") { t = p; break; } } }
      if (!t) continue;
      if (t.tagName === "CANVAS") { var q = t.getBoundingClientRect(); hit = q.width >= innerWidth * 0.45 && q.height >= 160; }
      else hit = tinch || fixedUp(t);
    }
    c.style.pointerEvents = pe; return hit;
  }
  // pastga aylantirilganda chiplar yashirinadi, tepaga qaytilganda chiqadi (o'yin maydonini to'smasin)
  var raf = 0, lastY = window.scrollY || 0, down = false;
  function onScroll() {
    var y = window.scrollY || 0;
    if (y < 120) down = false; else if (y > lastY + 6) down = true; else if (y < lastY - 6) down = false;
    if (Math.abs(y - lastY) > 6 || y < 120) lastY = y;
    soon();
  }
  function check() {
    raf = 0; if (document.hidden) return;
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) { try { cs[i].classList.toggle("ka-joy", down || blocks(cs[i])); } catch (e) {} }
  }
  function soon() { if (!raf) raf = requestAnimationFrame(check); }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", soon);
  addEventListener("pointerup", function () { setTimeout(soon, 250); }, true);
  addEventListener("keyup", function () { setTimeout(soon, 250); }, true);
  setInterval(soon, 900);
  setTimeout(soon, 600);
})();

/* iPhone/iPad (Safari) uchun: tugmalar tez-tez bosilganda sahifa kattalashib ketmasin,
   va div/span ko'rinishidagi tugmalarga bosish ishlasin (iOS'da ular ba'zan "bosilmaydi"). */
(function () {
  if (window.__kaIosFix) return; window.__kaIosFix = 1;
  try {
    var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var css = ":where(button,a,[role=button],input,select,textarea,label,summary,[onclick],[data-act]){touch-action:manipulation}";
    if (ios) css += "@media (hover:none){body{cursor:pointer}}";
    var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  } catch (e) {}
})();
