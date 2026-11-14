/*! Kuvonch Academy — Kuvi: butun sayt bo'ylab ovozli AI ustoz tugmasi
 *  Har sahifaning o'ng pastki burchagida kichik Kuvi turadi. Bosilsa — shu sahifa mavzusi bo'yicha ovozli suhbat
 *  (ai-ustoz.html) shu sahifaning ustida ochiladi. statistika.js / ka-fasl.js o'zi ulaydi. */
(function () {
  "use strict";
  if (window.__kaKuviFab) return; window.__kaKuviFab = 1;
  var path = location.pathname;
  if (window.top !== window.self) return;
  if (/ai-ustoz\.html|viktorina\.html|jamoa\.html|chempionat\.html|\/playables\/|ezop-reels|google[0-9a-f]+\.html|kirish-ekrani/.test(path)) return;
  var me = document.currentScript && document.currentScript.src, base = me ? me.replace(/[^\/]*(\?.*)?$/, "") : "/";
  try { if (localStorage.getItem("ka.kuvi.fab.off") === new Date().toISOString().slice(0, 10)) return; } catch (e) {}
  function mode() {
    if (/\/english\//.test(path)) return /ielts|sat/i.test(document.title + path) ? "ielts" : "en";
    if (/\/rus-tili\//.test(path)) return "ru";
    if (/sherlock|mantiq|sudoku|shaxmat|stroop|diqqat/.test(path)) return "logic";
    if (/fizika|kimyo|biolog|tarix|geograf|informatika|avtotest|robot/.test(path)) return "free";
    return "math";
  }
  function fan() { var m = /(fizika|kimyo|biologiya|tarix|geografiya|informatika)/.exec(path); return m ? m[1] : ""; }
  function topic() { return String(document.title || "").replace(/\s*[|—–]\s*Kuvonch Academy.*$/i, "").replace(/\s+/g, " ").trim().slice(0, 100); }
  var css = ".kvfab{position:fixed;right:14px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:940;width:66px;height:62px;border:0;background:none;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}" +
    ".kvfab .kuvi{width:66px}.kvfab:focus-visible{outline:3px solid #3b82f6;outline-offset:3px;border-radius:16px}" +
    ".kvtip{position:fixed;right:88px;bottom:calc(30px + env(safe-area-inset-bottom,0px));z-index:940;background:#fff;color:#1d2230;font:700 13px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:8px 12px;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.25);max-width:220px;transition:opacity .4s}" +
    ".kvtip:after{content:'';position:absolute;right:-6px;bottom:12px;border:6px solid transparent;border-right:0;border-left-color:#fff}.kvtip button{border:0;background:none;color:#6b7280;font:600 12px sans-serif;cursor:pointer;padding:2px 0 0;display:block}" +
    ".kvov{position:fixed;inset:0;z-index:3600;background:rgba(10,12,20,.5);display:flex;align-items:flex-end;justify-content:center}" +
    ".kvov .bx{position:relative;width:min(560px,100%);height:min(88vh,780px);background:#f4f2ee;border-radius:22px 22px 0 0;overflow:hidden;box-shadow:0 -10px 40px rgba(0,0,0,.35)}" +
    "@media (min-width:700px){.kvov{align-items:center}.kvov .bx{border-radius:22px}}" +
    ".kvov iframe{width:100%;height:100%;border:0;display:block}.kvov .x{position:absolute;right:10px;top:10px;z-index:2;width:38px;height:38px;border-radius:12px;border:1px solid #e3dfd7;background:#fff;font-size:18px;cursor:pointer}" +
    "@media print{.kvfab,.kvtip,.kvov{display:none!important}}";
  var b = null, stEl = null;
  function css1() { if (!stEl) { stEl = document.createElement("style"); stEl.textContent = css; document.head.appendChild(stEl); } }
  // Suhbat oynasi (sahifa ustida): FAB ham, robot-maskot Kuvi ham shuni ochadi
  function openChat() {
    css1(); if (document.querySelector(".kvov")) return;
    var ov = document.createElement("div"); ov.className = "kvov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Kuvi — AI ustoz");
    var f = fan(), url = base + "ai-ustoz.html?embed=1&rejim=" + mode() + (f ? "&fan=" + f : "") + "&mavzu=" + encodeURIComponent(topic());
    ov.innerHTML = '<div class="bx"><button type="button" class="x" aria-label="Yopish">✕</button><iframe allow="microphone; autoplay" title="Kuvi — AI ustoz"></iframe></div>';
    ov.querySelector("iframe").src = url;
    function close() { ov.remove(); document.removeEventListener("keydown", esc); if (b && document.body.contains(b)) b.focus(); robot("happy", "Yana gaplashamiz! 👋"); }
    function esc(e) { if (e.key === "Escape") close(); }
    ov.querySelector(".x").onclick = close; ov.onclick = function (e) { if (e.target === ov) close(); };
    document.addEventListener("keydown", esc);
    document.body.appendChild(ov);
  }
  window.kaKuviChat = { open: openChat };
  // robot-maskot (ka-effektlar.js) bor bo'lsa — uning LED-yuzi suhbatdagi kayfiyatga qarab o'zgaradi
  function hasRobot() { return !!document.querySelector(".ka-kuvi"); }
  function robot(emo, text) { try { if (hasRobot() && window.kaKuvi && kaKuvi.react) kaKuvi.react(emo, text); } catch (e) {} }
  var EMO = { happy: "happy", love: "love", think: "thinking", strict: "angry", jealous: "angry", sad: "sad", wow: "surprised", laugh: "celebrate", cry: "sad", shy: "love", wink: "wink" };
  window.addEventListener("message", function (e) {
    if (e.origin !== location.origin || !e.data || !e.data.kuviMood) return;
    var TX = { happy: "Zo'r! 😄", love: "💖 Barakalla!", think: "Hmm… 🤔", strict: "Diqqat bilan! 🤨", jealous: "Rashkim keldi! 🔥", sad: "Xafa bo'lmang 🥺", wow: "Voy! 😮", laugh: "Ha-ha-ha! 😂", cry: "Uhu-uhu 😭", shy: "Uyalib ketdim ☺️", wink: "😉" };
    var m = EMO[e.data.kuviMood]; if (m) robot(m, TX[e.data.kuviMood] || "");
  });
  function boot() {
    css1();
    if (hasRobot()) return; // robot-maskot o'zi suhbatni ochadi
    b = document.createElement("button"); b.type = "button"; b.className = "kvfab"; b.setAttribute("aria-label", "Kuvi — ovozli AI ustoz bilan gaplashish");
    b.title = "Kuvi — ovozli AI ustoz";
    function face() { b.innerHTML = window.kaYuz ? kaYuz.svg(Math.random() < .5 ? "happy" : "neutral") : "🤖"; }
    face(); document.body.appendChild(b);
    var day = new Date().toISOString().slice(0, 10), seen = ""; try { seen = localStorage.getItem("ka.kuvi.fab.tip") || ""; } catch (e) {}
    if (seen !== day) {
      var tip = document.createElement("div"); tip.className = "kvtip"; tip.innerHTML = "Salom! Men Kuvi 🙂 Savol bormi? Bosing — gaplashamiz!<button type=\"button\">Bugun yashirish</button>";
      document.body.appendChild(tip);
      tip.querySelector("button").onclick = function () { try { localStorage.setItem("ka.kuvi.fab.off", day); } catch (e) {} tip.remove(); b.remove(); };
      setTimeout(function () { tip.style.opacity = "0"; setTimeout(function () { tip.remove(); }, 500); }, 7000);
      try { localStorage.setItem("ka.kuvi.fab.tip", day); } catch (e) {}
    }
    b.onclick = openChat;
    setInterval(function () { if (document.body.contains(b) && !document.hidden) face(); }, 12000);
  }
  function go() { if (window.kaYuz) setTimeout(boot, 800); else { var s = document.createElement("script"); s.src = base + "ka-kuvi.js?v=20261112d"; s.onload = function () { setTimeout(boot, 800); }; s.onerror = boot; document.head.appendChild(s); } }
  if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
})();
