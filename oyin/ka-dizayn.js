/* Kuvonch Academy — umumiy dizayn qatlami (statistika.js orqali barcha sahifalarda yuklanadi).
   1) Rang mavzusi: yuqoridagi 🎨 tugma — Asl tungi, Yumshoq tungi, Toza kunduzgi, O'zbek milliy (ranglar va ag'darish
      qoidalari ka-fasl.js dagi kaMavzu da; tanlov shu brauzerda eslab qolinadi: ka.mavzu).
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
    /* --- mavzu tugmasi va menyusi --- */
    ".ka-mv{position:absolute;top:8px;right:104px;z-index:955;width:36px;height:36px;border-radius:50%;border:1px solid rgba(147,163,204,.35);background:rgba(12,19,48,.82);color:#ffd479;font-size:17px;line-height:1;cursor:pointer;padding:0;display:grid;place-items:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:transform .2s,border-color .2s}" +
    ".ka-mv:hover{transform:rotate(18deg) scale(1.06);border-color:#ffc23d}.ka-mv:focus-visible{outline:3px solid #35f0c4;outline-offset:2px}" +
    "@media (max-width:640px){.ka-mv{right:12px;top:52px}}@media (max-width:640px){.ai-fab{font-size:12px!important;padding:8px 11px!important;opacity:.94}}@media print{.ka-mv,.ka-mvm{display:none!important}html.ka-yorug{filter:none}html.ka-yorug *{filter:none!important}}" +
    ".ka-mvm{position:absolute;top:50px;right:104px;z-index:956;width:244px;padding:6px;border-radius:16px;border:1px solid rgba(147,163,204,.35);background:#0c1330;color:#eef2ff;box-shadow:0 14px 40px rgba(0,0,0,.45);font:500 14px/1.3 \"Golos Text\",system-ui,sans-serif}" +
    ".ka-mvm[hidden]{display:none}.ka-mvm b{display:block;font-size:12px;font-weight:600;color:#93a3cc;padding:6px 10px 4px}" +
    ".ka-mvm button{display:flex;align-items:center;gap:10px;width:100%;border:0;background:transparent;color:inherit;font:inherit;text-align:left;padding:8px 10px;border-radius:11px;cursor:pointer}" +
    ".ka-mvm button:hover,.ka-mvm button:focus-visible{background:rgba(147,163,204,.14);outline:none}.ka-mvm button[aria-checked=true]{background:rgba(53,240,196,.14)}" +
    ".ka-mvm .sw{display:flex;flex:none}.ka-mvm .sw i{width:14px;height:14px;border-radius:50%;margin-left:-4px;border:2px solid #0c1330}.ka-mvm .sw i:first-child{margin-left:0}" +
    ".ka-mvm span.t{flex:1}.ka-mvm small{display:block;font-size:12px;color:#93a3cc}.ka-mvm .ok{color:#35f0c4;font-weight:700;visibility:hidden}.ka-mvm button[aria-checked=true] .ok{visibility:visible}" +
    "@media (max-width:640px){.ka-mvm{right:10px;top:94px}}" +
    /* --- umumiy sayqal --- */
    "html{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}" +
    "::selection{background:rgba(53,240,196,.32)}" +
    "html.ka-dz body{font-family:\"Golos Text\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif}" +
    "html.ka-dz h1.ka-dzh{font-family:\"Unbounded\",\"Golos Text\",system-ui,sans-serif;letter-spacing:-.02em;line-height:1.16;overflow-wrap:anywhere}" +
    "html.ka-dz a:focus-visible,html.ka-dz button:focus-visible,html.ka-dz [tabindex]:focus-visible{outline:3px solid #35f0c4;outline-offset:2px;border-radius:8px}" +
    "@media (hover:hover){html.ka-dz ::-webkit-scrollbar{width:11px;height:11px}html.ka-dz ::-webkit-scrollbar-thumb{background:#2a3769;border-radius:8px;border:2px solid transparent;background-clip:padding-box}html.ka-dz ::-webkit-scrollbar-thumb:hover{background:#3d4d8c;background-clip:padding-box;border:2px solid transparent}html.ka-dz ::-webkit-scrollbar-track{background:transparent}}";
  var st = D.createElement("style"); st.id = "ka-dizayn-css"; st.textContent = css; (D.head || H).appendChild(st);

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
  // kaMavzu (ka-fasl.js) yo'q bo'lsa — yuklab olamiz (ka-fasl.js boshqa sahifalarda <head> da turadi)
  function mavzu(cb) {
    if (window.kaMavzu) return cb(window.kaMavzu);
    var me = (D.currentScript && D.currentScript.src) || "", ss = D.querySelectorAll('script[src*="ka-dizayn.js"],script[src*="statistika.js"]');
    if (!me && ss.length) me = ss[ss.length - 1].src;
    var s = D.querySelector('script[src*="ka-fasl.js"]');
    if (!s) { s = D.createElement("script"); s.src = (me ? me.replace(/[^\/]*(\?.*)?$/, "") : "/") + "ka-fasl.js?v=20261122a"; s.async = true; (D.head || H).appendChild(s); }
    var n = 0, t = setInterval(function () { if (window.kaMavzu || ++n > 50) { clearInterval(t); if (window.kaMavzu) cb(window.kaMavzu); } }, 100);
  }
  function btn() {
    if (D.querySelector(".ka-mv") || window.top !== window.self) return;
    mavzu(function (M) {
      var b = D.createElement("button"); b.type = "button"; b.className = "ka-mv"; b.textContent = "🎨";
      b.title = "Rang mavzusi"; b.setAttribute("aria-label", "Rang mavzusini tanlash"); b.setAttribute("aria-haspopup", "menu"); b.setAttribute("aria-expanded", "false");
      var m = D.createElement("div"); m.className = "ka-mvm"; m.hidden = true; m.setAttribute("role", "menu"); m.setAttribute("aria-label", "Rang mavzusi");
      function chiz() {
        var j = M.joriy();
        m.innerHTML = "<b>🎨 Rang mavzusi</b>" + Object.keys(M.royxat).map(function (k) {
          var r = M.royxat[k];
          return '<button type="button" role="menuitemradio" data-m="' + k + '" aria-checked="' + (k === j) + '"><span class="sw">' + r.r.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") +
            '</span><span class="t">' + r.nom + "<small>" + r.izoh + '</small></span><span class="ok">✓</span></button>';
        }).join("");
      }
      function och(on) { m.hidden = !on; b.setAttribute("aria-expanded", on ? "true" : "false"); if (on) { chiz(); var c = m.querySelector('[aria-checked="true"]'); if (c) c.focus(); } }
      b.addEventListener("click", function (e) { e.stopPropagation(); och(m.hidden); });
      m.addEventListener("click", function (e) {
        var x = e.target.closest && e.target.closest("button[data-m]"); if (!x) return;
        M.tanla(x.getAttribute("data-m")); och(false); b.focus();
        if (H.classList.contains("ka-yorug")) aslSoon();
      });
      D.addEventListener("click", function (e) { if (!m.hidden && !m.contains(e.target) && e.target !== b) och(false); });
      D.addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { och(false); b.focus(); } });
      D.body.appendChild(b); D.body.appendChild(m);
    });
  }
  function go() { try { inner(); } catch (e) {} try { btn(); } catch (e) {} aslSoon(); }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", go); else go();
})();
