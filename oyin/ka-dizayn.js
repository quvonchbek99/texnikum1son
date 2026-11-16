/* Kuvonch Academy — umumiy dizayn qatlami (statistika.js orqali barcha sahifalarda yuklanadi).
   1) Yorug' (kunduzgi) rejim: tugma yuqorida; tanlov shu brauzerda eslab qolinadi (ka.mavzu).
   2) Ichki sahifalar: bosh sahifadagi shriftlar (Golos Text + Unbounded), fokus, tanlash, aylantirish chizig'i.
   3) Telefon: suzuvchi tugmalar ixchamroq. */
(function () {
  "use strict";
  if (window.__kaDizayn) return; window.__kaDizayn = 1;
  var D = document, H = D.documentElement;
  function get() { try { return localStorage.getItem("ka.mavzu"); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem("ka.mavzu", v); } catch (e) {} }
  var INV = "invert(1) hue-rotate(180deg)";
  var css =
    /* --- yorug' rejim: sahifa ranglari ag'dariladi, rasm/video/o'yin maydoni o'z rangida qoladi --- */
    "html.ka-yorug{filter:" + INV + ";background:#060a1a}" +
    "html.ka-yorug img,html.ka-yorug video,html.ka-yorug canvas,html.ka-yorug iframe,html.ka-yorug picture,html.ka-yorug .ka-kuvi,html.ka-yorug .ka-ball,html.ka-yorug .ka-say,html.ka-yorug .kvtip,html.ka-yorug .kvfab,html.ka-yorug .kuvi,html.ka-yorug [data-asl]{filter:" + INV + "}" +
    "html.ka-yorug [data-asl] img,html.ka-yorug [data-asl] video,html.ka-yorug [data-asl] canvas,html.ka-yorug [data-asl] iframe,html.ka-yorug [data-asl] picture,html.ka-yorug picture img,html.ka-yorug .kvfab .kuvi,html.ka-yorug .kvfab img,html.ka-yorug .kvfab canvas,html.ka-yorug .kuvi img{filter:none}" +
    /* --- rejim tugmasi --- */
    ".ka-mv{position:absolute;top:8px;right:104px;z-index:955;width:36px;height:36px;border-radius:50%;border:1px solid rgba(147,163,204,.35);background:rgba(12,19,48,.82);color:#ffd479;font-size:17px;line-height:1;cursor:pointer;padding:0;display:grid;place-items:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:transform .2s,border-color .2s}" +
    ".ka-mv:hover{transform:rotate(18deg) scale(1.06);border-color:#ffc23d}.ka-mv:focus-visible{outline:3px solid #35f0c4;outline-offset:2px}" +
    "@media (max-width:640px){.ka-mv{right:54px}}@media (max-width:640px){.ai-fab{font-size:12px!important;padding:8px 11px!important;opacity:.94}}@media print{.ka-mv{display:none!important}html.ka-yorug{filter:none}html.ka-yorug *{filter:none!important}}" +
    /* --- umumiy sayqal --- */
    "html{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}" +
    "::selection{background:rgba(53,240,196,.32)}" +
    "html.ka-dz body{font-family:\"Golos Text\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif}" +
    "html.ka-dz h1.ka-dzh{font-family:\"Unbounded\",\"Golos Text\",system-ui,sans-serif;letter-spacing:-.02em;line-height:1.16;overflow-wrap:anywhere}" +
    "html.ka-dz a:focus-visible,html.ka-dz button:focus-visible,html.ka-dz [tabindex]:focus-visible{outline:3px solid #35f0c4;outline-offset:2px;border-radius:8px}" +
    "@media (hover:hover){html.ka-dz ::-webkit-scrollbar{width:11px;height:11px}html.ka-dz ::-webkit-scrollbar-thumb{background:#2a3769;border-radius:8px;border:2px solid transparent;background-clip:padding-box}html.ka-dz ::-webkit-scrollbar-thumb:hover{background:#3d4d8c;background-clip:padding-box;border:2px solid transparent}html.ka-dz ::-webkit-scrollbar-track{background:transparent}}";
  var st = D.createElement("style"); st.id = "ka-dizayn-css"; st.textContent = css; (D.head || H).appendChild(st);
  if (get() === "yorug") H.classList.add("ka-yorug");

  function fonts() {
    if (D.querySelector('link[href*="Golos+Text"]')) return;
    var l = D.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Unbounded:wght@500;700;800&display=swap";
    D.head.appendChild(l);
  }
  function inner() {
    var b = D.body; if (!b) return;
    var ff = getComputedStyle(b).fontFamily || "";
    if (/Golos/i.test(ff)) return;                         // bosh sahifa uslubidagi sahifalar — tegilmaydi
    if (/serif/i.test(ff) && !/sans-serif/i.test(ff)) return; // maxsus (kitobiy) shriftli sahifalar
    if (H.hasAttribute("data-dz-off")) return;
    fonts(); H.classList.add("ka-dz");
    var hs = D.querySelectorAll("h1");
    for (var i = 0; i < hs.length && i < 3; i++) {
      var h = hs[i], cs = getComputedStyle(h), fs = parseFloat(cs.fontSize) || 0;
      if (/Unbounded/i.test(cs.fontFamily) || fs < 20 || fs > 64) continue;
      h.classList.add("ka-dzh"); h.style.fontSize = (fs * 0.86).toFixed(1) + "px";   // Unbounded kengroq — biroz kichraytiriladi
    }
  }
  /* Yorug' rejimda: asli och rangli katta bloklar (oq kartalar) ag'darilmaydi — o'z rangida qoladi */
  function asl() {
    if (!H.classList.contains("ka-yorug") || !D.body) return;
    var els = D.body.querySelectorAll("main,section,article,aside,div,table,form"), n = Math.min(els.length, 2500);
    for (var i = 0; i < n; i++) {
      var e = els[i]; if (e.hasAttribute("data-asl") || (e.closest && e.closest("[data-asl]"))) continue;
      var w = e.offsetWidth, h = e.offsetHeight; if (w < 180 || h < 70) continue;
      var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(getComputedStyle(e).backgroundColor || ""); if (!m) continue;
      if (m[4] !== undefined && +m[4] < 0.9) continue;
      if ((0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255 > 0.82) e.setAttribute("data-asl", "");
    }
  }
  function aslSoon() { try { asl(); } catch (e) {} setTimeout(function () { try { asl(); } catch (e) {} }, 1500); setTimeout(function () { try { asl(); } catch (e) {} }, 5000); }
  function btn() {
    if (D.querySelector(".ka-mv") || window.top !== window.self) return;
    var b = D.createElement("button"); b.type = "button"; b.className = "ka-mv";
    function paint() { var y = H.classList.contains("ka-yorug"); b.textContent = y ? "🌙" : "☀️"; b.title = y ? "Tungi rejim" : "Yorug' (kunduzgi) rejim"; b.setAttribute("aria-label", b.title); b.setAttribute("aria-pressed", y ? "true" : "false"); }
    b.addEventListener("click", function () { var y = H.classList.toggle("ka-yorug"); set(y ? "yorug" : "tun"); paint(); if (y) aslSoon(); });
    paint(); D.body.appendChild(b);
  }
  function go() { try { inner(); } catch (e) {} try { btn(); } catch (e) {} aslSoon(); }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", go); else go();
})();
