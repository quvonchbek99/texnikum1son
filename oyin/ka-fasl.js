/*! Kuvonch Academy — menyuning fasl va oyga mos bezagi (ka-fasl.js)
 *  Har oyning o'z ranglari, faslning bezaklari (qor, gul barglari, quyosh uchqunlari, kuzgi barglar)
 *  va bayram kunlari. Toshkent vaqti bo'yicha o'zi almashadi — hech narsani qo'lda o'zgartirish shart emas.
 *  Qayerda: bosh menyu (.knav-head), Ingliz tili (header.en), Rus tili (header.site), akkount tugmasi.
 *  Sinab ko'rish: sahifa manziliga ?oy=3 (1–12) yoki ?sana=2026-03-21 qo'shing.
 *  Ulash: <script src="ka-fasl.js"></script> (head ichida) — akkount.js boshqa sahifalarga o'zi qo'shadi. */
(function () {
  "use strict";
  if (window.kaFasl) return;

  // [fasl, rang A, rang B, rang C, belgi, zarra]
  var OY = [
    ["qish",  "#7fd3ff", "#a9b8ff", "#eaf6ff", "⛄", "❄"],   // yanvar — muzday havorang
    ["qish",  "#9fb4ff", "#d6a8ff", "#ffe3f3", "❄️", "❄"],   // fevral — qirovli binafsha
    ["bahor", "#4fe39a", "#ffd166", "#ff6b9a", "🌷", "🌸"],  // mart — Navro'z: maysa va lola
    ["bahor", "#ff9ec7", "#9ff07a", "#fff3a8", "🌸", "🌸"],  // aprel — o'rik guli
    ["bahor", "#b48cff", "#5fe3a1", "#ffcfe9", "🌼", "🌼"],  // may — gulzor
    ["yoz",   "#ffd23f", "#ff8a3d", "#4fd1ff", "☀️", "✦"],   // iyun — quyosh
    ["yoz",   "#ff5e7a", "#3ddc97", "#4fc3ff", "🍉", "✦"],   // iyul — tarvuz va suv
    ["yoz",   "#ffc93c", "#ff7b54", "#8bd17c", "🌻", "✦"],   // avgust — kungaboqar
    ["kuz",   "#3fb7ff", "#1eb53a", "#ffd166", "📚", "🍃"],  // sentabr — bayroq ranglari, maktab
    ["kuz",   "#ff8c42", "#ff4e50", "#ffd166", "🍁", "🍁"],  // oktabr — zarg'aldoq barglar
    ["kuz",   "#e0a458", "#c0567b", "#9d8cff", "🍂", "🍂"],  // noyabr — kech kuz
    ["qish",  "#4fd1ff", "#ff4d6d", "#ffd23f", "🎄", "❄"]    // dekabr — yangi yil arafasi
  ];

  var NOM = {
    uz: { oy: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"], f: { qish: "Qish", bahor: "Bahor", yoz: "Yoz", kuz: "Kuz" } },
    ru: { oy: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], f: { qish: "Зима", bahor: "Весна", yoz: "Лето", kuz: "Осень" } },
    en: { oy: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], f: { qish: "Winter", bahor: "Spring", yoz: "Summer", kuz: "Autumn" } },
    kk: { oy: ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"], f: { qish: "Қыс", bahor: "Көктем", yoz: "Жаз", kuz: "Күз" } },
    ky: { oy: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], f: { qish: "Кыш", bahor: "Жаз", yoz: "Жай", kuz: "Күз" } }
  };

  // Bayram kunlari: "OO-KK": [belgi, uz, ru, en]  (kk/ky — ruscha nomi)
  var BAYRAM = {
    "01-01": ["🎉", "Yangi yil", "Новый год", "New Year"],
    "01-14": ["🎖", "Vatan himoyachilari kuni", "День защитников Родины", "Defenders of the Motherland Day"],
    "02-09": ["📜", "Alisher Navoiy tavallud kuni", "День рождения Алишера Навои", "Alisher Navoi's birthday"],
    "03-08": ["💐", "Xotin-qizlar kuni", "Международный женский день", "Women's Day"],
    "03-14": ["🥧", "π kuni", "День числа π", "Pi Day"],
    "03-21": ["🌷", "Navro'z bayrami", "Навруз", "Navruz"],
    "05-09": ["🌹", "Xotira va qadrlash kuni", "День памяти и почестей", "Day of Remembrance and Honour"],
    "06-01": ["🎈", "Bolalarni himoya qilish kuni", "День защиты детей", "Children's Day"],
    "09-01": ["🇺🇿", "Mustaqillik kuni", "День независимости", "Independence Day"],
    "10-01": ["🍎", "O'qituvchi va murabbiylar kuni", "День учителя", "Teachers' Day"],
    "10-21": ["🔤", "O'zbek tili bayrami", "День узбекского языка", "Uzbek Language Day"],
    "12-31": ["🎄", "Yangi yil arafasi", "Канун Нового года", "New Year's Eve"]
  };

  // --- Bugungi sana (Toshkent, UTC+5) yoki sinov uchun ?oy= / ?sana= ---
  var t = new Date(Date.now() + 5 * 3600e3), oy = t.getUTCMonth() + 1, kun = t.getUTCDate();
  try {
    var q = location.search, m1 = /[?&]oy=(\d{1,2})/.exec(q), m2 = /[?&]sana=\d{4}-(\d{2})-(\d{2})/.exec(q);
    if (m2) { oy = +m2[1]; kun = +m2[2]; } else if (m1) { oy = +m1[1]; kun = 15; }
  } catch (e) {}
  if (!(oy >= 1 && oy <= 12)) oy = t.getUTCMonth() + 1;
  var O = OY[oy - 1], FASL = O[0], key = (oy < 10 ? "0" : "") + oy + "-" + (kun < 10 ? "0" : "") + kun, B = BAYRAM[key] || null;

  // --- Ranglar va uslub darhol (sahifa chizilishidan oldin) ---
  var root = document.documentElement;
  root.setAttribute("data-fasl", FASL); root.setAttribute("data-oy", String(oy));
  if (B) root.setAttribute("data-bayram", key);
  root.style.setProperty("--fasl-a", O[1]); root.style.setProperty("--fasl-b", O[2]); root.style.setProperty("--fasl-c", O[3]);
  root.style.setProperty("--fasl-e", JSON.stringify(B ? B[0] : O[4]));

  var css = [
    // bosh menyu
    "html[data-fasl] .knav-head::after{height:2px;opacity:.95;background:linear-gradient(90deg,transparent,var(--fasl-a) 18%,var(--fasl-b) 50%,var(--fasl-c) 82%,transparent)}",
    "html[data-fasl] .knav-head .brand-badge{background:conic-gradient(from 200deg,var(--fasl-a),var(--fasl-b),var(--fasl-c),var(--fasl-a));box-shadow:0 0 0 1px rgba(255,255,255,.06),0 6px 18px -6px var(--fasl-b)}",
    "html[data-fasl] .knav a[aria-current=page]{color:#081019;background:linear-gradient(120deg,var(--fasl-a),var(--fasl-b));box-shadow:0 6px 22px -8px var(--fasl-b)}",
    "html[data-fasl] .knav a:hover{background:color-mix(in srgb,var(--fasl-a) 14%,transparent);border-color:color-mix(in srgb,var(--fasl-a) 30%,transparent)}",
    "html[data-fasl] .knav a.new::after{background:var(--fasl-c);color:#1d1200}",
    ".knav-head>.brand,.knav-head>.knav,.knav-head>.fasl-chip{position:relative;z-index:1}",
    ".knav-head .fasl-chip{margin-right:auto}",
    // oy belgisi (chip)
    ".fasl-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 11px 5px 9px;border-radius:999px;font:700 12.5px/1.1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;white-space:nowrap;color:inherit;background:color-mix(in srgb,var(--fasl-a) 13%,transparent);border:1px solid color-mix(in srgb,var(--fasl-a) 42%,transparent);cursor:default;user-select:none}",
    ".fasl-chip i{font-style:normal;font-size:14px;line-height:1}",
    ".knav-head .fasl-chip b{background:linear-gradient(90deg,var(--fasl-a),var(--fasl-b));-webkit-background-clip:text;background-clip:text;color:transparent}",
    "html[data-bayram] .fasl-chip{animation:fasl-nur 2.6s ease-in-out infinite}",
    "@keyframes fasl-nur{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--fasl-a) 0%,transparent)}50%{box-shadow:0 0 18px 2px color-mix(in srgb,var(--fasl-a) 45%,transparent)}}",
    // Ingliz tili va Rus tili bo'limlari menyusi
    "html[data-fasl] header.en,html[data-fasl] header.site{border-bottom-color:transparent;box-shadow:inset 0 -2px 0 0 color-mix(in srgb,var(--fasl-a) 80%,transparent)}",
    "html[data-fasl] header.en nav a[aria-current=page],html[data-fasl] header.site .nav-links a[aria-current=page]{box-shadow:inset 0 -2px 0 var(--fasl-b)}",
    "header.en .fasl-chip,header.site .fasl-chip{padding:4px 9px 4px 7px;font-size:12px;flex:0 0 auto}",
    "header.site .fasl-chip b{display:none}header.site .fasl-chip{padding:4px 6px}",
    "@media (max-width:900px){header.en .fasl-chip b{display:none}header.en .fasl-chip{padding:4px 6px}}",
    // akkount tugmasi
    "html[data-fasl] .acc-chip{border-color:color-mix(in srgb,var(--fasl-a) 55%,#243252)}",
    ".acc-chip:not(.acc-fixed){position:relative}",
    "html[data-fasl] .acc-chip::after{content:var(--fasl-e);position:absolute;right:-7px;top:-8px;font-size:13px;line-height:1;pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55))}",
    // zarralar (faqat bosh menyuda)
    ".fasl-zarra{position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden;pointer-events:none;z-index:0}",
    ".fasl-zarra span{position:absolute;top:0;left:var(--x);font-size:var(--s);line-height:1;opacity:0;color:var(--fasl-c);will-change:transform,opacity;animation:var(--an) var(--d) linear var(--w) infinite}",
    "html[data-fasl=yoz] .fasl-zarra span{color:var(--fasl-a);text-shadow:0 0 6px var(--fasl-a)}",
    "@keyframes fasl-tush{0%{opacity:0;transform:translate3d(0,-22px,0) rotate(0)}12%{opacity:.6}85%{opacity:.45}100%{opacity:0;transform:translate3d(var(--dx),var(--h),0) rotate(var(--r))}}",
    "@keyframes fasl-chayqal{0%{opacity:0;transform:translate3d(0,-22px,0) rotate(0)}12%{opacity:.65}30%{transform:translate3d(calc(var(--dx) * .6),calc(var(--h) * .3),0) rotate(calc(var(--r) * .3))}55%{transform:translate3d(calc(var(--dx) * -.4),calc(var(--h) * .55),0) rotate(calc(var(--r) * -.2))}85%{opacity:.45}100%{opacity:0;transform:translate3d(var(--dx),var(--h),0) rotate(var(--r))}}",
    "@keyframes fasl-uch{0%{opacity:0;transform:translate3d(0,var(--h),0) scale(.6)}20%{opacity:.9}50%{transform:translate3d(calc(var(--dx) * .5),calc(var(--h) * .5),0) scale(1.1)}80%{opacity:.5}100%{opacity:0;transform:translate3d(var(--dx),-10px,0) scale(.5)}}",
    "@media (prefers-reduced-motion:reduce){.fasl-zarra{display:none}html[data-bayram] .fasl-chip{animation:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "ka-fasl-css"; st.textContent = css;
  (document.head || root).appendChild(st);

  function til() {
    var l = (root.getAttribute("lang") || "uz").slice(0, 2).toLowerCase();
    return NOM[l] ? l : "uz";
  }
  function matn() {
    var l = til(), N = NOM[l], oyN = N.oy[oy - 1], faslN = N.f[FASL];
    if (B) { var bi = l === "uz" ? 1 : l === "en" ? 3 : 2; return { i: B[0], b: B[bi], title: B[bi] + " · " + oyN }; }
    return { i: O[4], b: oyN, title: faslN + " · " + oyN };
  }
  function chip() {
    var c = document.createElement("span"); c.className = "fasl-chip"; c.setAttribute("role", "note");
    yoz(c); return c;
  }
  function yoz(c) {
    var m = matn(); c.title = m.title; c.setAttribute("aria-label", m.title);
    c.innerHTML = "<i aria-hidden=\"true\"></i><b></b>"; c.firstChild.textContent = m.i; c.lastChild.textContent = m.b;
  }

  function zarralar(head) {
    try {
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (navigator.connection && navigator.connection.saveData) return;
    } catch (e) {}
    var box = document.createElement("div"); box.className = "fasl-zarra"; box.setAttribute("aria-hidden", "true");
    var an = FASL === "yoz" ? "fasl-uch" : FASL === "bahor" ? "fasl-chayqal" : "fasl-tush", n = innerWidth < 600 ? 7 : 12, h = "";
    for (var i = 0; i < n; i++) {
      var d = 7 + Math.random() * 7, x = (i + Math.random()) / n * 100, dx = (Math.random() * 60 - 30).toFixed(0), r = (FASL === "qish" ? 120 : 300) * (Math.random() > .5 ? 1 : -1);
      h += "<span style=\"--x:" + x.toFixed(1) + "%;--s:" + (10 + Math.random() * 8).toFixed(0) + "px;--d:" + d.toFixed(1) + "s;--w:" + (-Math.random() * d).toFixed(1) + "s;--dx:" + dx + "px;--r:" + r + "deg;--an:" + an + "\">" + O[5] + "</span>";
    }
    box.innerHTML = h; head.insertBefore(box, head.firstChild);
    function bal() { box.style.setProperty("--h", (head.offsetHeight + 20) + "px"); }
    bal(); var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(bal, 150); }, { passive: true });
  }

  var chips = [];
  function bezat() {
    Array.prototype.forEach.call(document.querySelectorAll(".knav-head"), function (h) {
      if (h.querySelector(".fasl-chip")) return;
      var c = chip(), br = h.querySelector(".brand");
      if (br && br.parentNode === h) br.insertAdjacentElement("afterend", c); else h.insertBefore(c, h.firstChild);
      chips.push(c); zarralar(h);
    });
    Array.prototype.forEach.call(document.querySelectorAll("header.en .logo, header.site .brand"), function (lg) {
      if (lg.parentNode.querySelector(".fasl-chip")) return;
      var c = chip(); lg.insertAdjacentElement("afterend", c); chips.push(c);
    });
    // til almashsa (ka-til.js) — oy nomini ham almashtiramiz
    try { new MutationObserver(function () { chips.forEach(yoz); }).observe(root, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bezat); else bezat();

  window.kaFasl = { oy: oy, kun: kun, fasl: FASL, bayram: B ? B[1] : null, ranglar: O.slice(1, 4) };
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
