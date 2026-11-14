/* Kuvonch Academy — anonim tashrif statistikasi (Google Analytics 4 + Yandex Metrika). Ism/guruh yuborilmaydi. */
/* Himoya: sayt boshqa (begona) saytning iframe'i ichida ochilsa — clickjacking — o'zini to'liq oynaga chiqaradi */
(function () {
  try {
    if (window.top === window.self) return;
    var same = false;
    try { same = window.top.location.hostname === location.hostname; } catch (e) {}
    if (same) return;
    document.documentElement.style.visibility = "hidden"; // ko'rinmas sahifani "bosdirib" bo'lmaydi
    try { window.top.location.replace(location.href); } catch (e) {}
  } catch (e) {}
})();
/* + "Davom ettirish": oxirgi ochilgan sahifa (bosh sahifadan tashqari) faqat shu brauzerda eslab qolinadi */
(function () {
  try {
    var p = location.pathname.replace(/\/index\.html$/, "/");
    if (p === "/" || /^\/(donat|premium|maxfiylik|havolalar|404)\.html$/.test(p)) return;
    var t = (document.title || "").replace(/\s*[—|·-]\s*Kuvonch Academy.*$/i, "").trim();
    localStorage.setItem("ka.oxirgi", JSON.stringify({ u: p + location.search, t: t.slice(0, 60), d: Date.now() }));
  } catch (e) {}
})();
/* + Service worker barcha sahifalarda: o'yin modellari (qo'l/ko'z) bir marta yuklangach, keyingi safar keshdan darhol ochiladi */
(function () {
  try {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    var me = document.currentScript && document.currentScript.src;
    var sw = me ? me.replace(/statistika\.js(\?.*)?$/, "sw.js") : "sw.js";
    var reg = function () { navigator.serviceWorker.register(sw).catch(function () {}); };
    if (document.readyState === "complete") reg(); else window.addEventListener("load", reg);
  } catch (e) {}
})();
(function () {
  "use strict";
  var ID = "G-PWVVKHD3ET";
  if (window.__kaGA || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
  window.__kaGA = 1;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", ID, { anonymize_ip: true });
  // Sahifa yuklanib bo'lgach, bo'sh vaqtda ulanadi — foydalanuvchini kuttirmaydi
  function go() { var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID; document.head.appendChild(s); }
  function later() { if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 8000 }); else setTimeout(go, 4000); }
  if (document.readyState === "complete") later(); else window.addEventListener("load", later);
})();

/* Bolalarga mos reklama (Google AdSense) — sozlama va qoidalar reklama.js ichida; ID yozilmaguncha o'chiq */
(function () {
  try {
    if (window.__kaAdsLd || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
    window.__kaAdsLd = 1;
    var me = document.currentScript && document.currentScript.src;
    var s = document.createElement("script"); s.async = true;
    s.src = me ? me.replace(/statistika\.js(\?.*)?$/, "reklama.js") : "/reklama.js";
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
})();

/* Yandex Metrika — hisoblagich raqamini YM_ID ga yozing (metrika.yandex.ru). 0 bo'lsa o'chiq turadi. */
(function () {
  "use strict";
  var YM_ID = 113775848;
  if (!YM_ID || window.__kaYM || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
  window.__kaYM = 1;
  // Vebvizor yozuvlarida o'quvchi kiritgan matn (ism, javob) saqlanmasin
  function yashir() {
    var el = document.querySelectorAll("input, textarea, [contenteditable]");
    for (var i = 0; i < el.length; i++) el[i].classList.add("ym-disable-keys");
  }
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = 1 * new Date();
  ym(YM_ID, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, trackHash: true });
  function go() {
    yashir();
    try { new MutationObserver(yashir).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    var s = document.createElement("script"); s.async = true; s.src = "https://mc.yandex.ru/metrika/tag.js"; document.head.appendChild(s);
  }
  function later() { if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 8000 }); else setTimeout(go, 4000); }
  if (document.readyState === "complete") later(); else window.addEventListener("load", later);
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

/* Kuvi — ovozli AI ustoz tugmasi (butun sayt): ka-kuvi-fab.js ni ulaymiz */
(function () {
  try {
    if (window.__kaKuviFabL) return; window.__kaKuviFabL = 1;
    var me = document.currentScript && document.currentScript.src;
    if (!me) { var ss = document.querySelectorAll('script[src*="statistika.js"],script[src*="ka-fasl.js"]'); me = ss.length ? ss[ss.length - 1].src : ""; }
    var s = document.createElement("script"); s.src = (me ? me.replace(/[^\/]*(\?.*)?$/, "") : "/") + "ka-kuvi-fab.js?v=20261112d"; s.async = true;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
})();
