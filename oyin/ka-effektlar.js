/*!
 * Kuvonch Academy — sahifa effektlari
 *  1) Pastga surilganda bloklar chiroyli animatsiya bilan paydo bo'ladi + yuqorida o'qish chizig'i
 *  2) "Kuvi" — zirhli robot-maskot: LED-yuzida his-tuyg'ular (xursand, hayron, xafa, sevgi, o'ylash, bayram…),
 *     reaktiv ryukzak bilan uchadi, to'p o'ynaydi, ko'zi barmoqqa qaraydi, uzoq tegilmasa uxlaydi
 * Ulash: </body> dan oldin <script src="ka-effektlar.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaFx) return; window.__kaFx = true;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var css = `
  html{overflow-x:hidden}@supports (overflow-x:clip){html{overflow-x:clip}}
  .ka-prog{position:fixed;left:0;top:0;height:3px;width:0;z-index:99999;background:linear-gradient(90deg,#5ee6c7,#7c9bff,#ff5c7a);box-shadow:0 0 10px rgba(94,230,199,.6);pointer-events:none}
  .ka-rv{opacity:0;transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1),filter .8s;will-change:opacity,transform}
  .ka-rv.up{transform:translateY(46px)}
  .ka-rv.left{transform:translateX(-60px) rotate(-1.5deg)}
  .ka-rv.right{transform:translateX(60px) rotate(1.5deg)}
  .ka-rv.zoom{transform:scale(.86);filter:blur(6px)}
  .ka-rv.flip{transform:perspective(800px) rotateX(18deg) translateY(30px);transform-origin:50% 100%}
  .ka-rv.in{opacity:1;transform:none;filter:none}
  @media (max-width:760px){.ka-rv.left,.ka-rv.right{transform:translateY(40px)}}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ================= 1) Scroll animatsiyalari ================= */
  var prog = document.createElement("div"); prog.className = "ka-prog"; document.body.appendChild(prog);
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%";
      // tez aylantirilganda o'tkazib yuborilgan (yuqorida qolib ketgan) bloklar ko'rinmas qolmasin
      Array.prototype.forEach.call(document.querySelectorAll(".ka-rv:not(.in)"), function (e) {
        if (e.getBoundingClientRect().bottom < 0) e.classList.remove("ka-rv", "up", "zoom", "left", "right", "flip");
      });
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (!reduce && "IntersectionObserver" in window) {
    var SEL = ".ev-link,.picker-card,.card,.era-card,.topic-chip,section>h2,section>p,.hero,article,.test-start-btn,main h2,main h3,.timeline-item,.grid>*,.cards>*,figure,blockquote,table";
    var kinds = ["up", "zoom", "left", "right", "flip"];
    var io = new IntersectionObserver(function (ents) {
      var batch = 0;
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var e = en.target; io.unobserve(e);
        e.style.transitionDelay = Math.min(batch++ * 70, 420) + "ms";
        e.classList.add("in");
        setTimeout(function () { e.style.transitionDelay = ""; e.classList.remove("ka-rv", "up", "zoom", "left", "right", "flip", "in"); }, 1400 + batch * 70);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    var n = 0, used = 0;
    // juda katta sahifalarda (mashqlar) faqat yuqori darajadagi bloklar jonlanadi — har bir elementni o'lchash sahifani sekinlashtiradi
    var BIG = document.getElementsByTagName("*").length > 3000, CAP = BIG ? 60 : 400;
    function prepOne(e) {
      if (e.__kaRv || used >= CAP) return;
      e.__kaRv = 1;
      if ((BIG && e.closest(".topic")) || e.closest("[role=dialog],.modal,#testModal,.km,.ka-menu,nav,header,footer,.ka-kuvi,.acc-bg,.kd-bg") || getComputedStyle(e).position === "fixed") return;
      var r = e.getBoundingClientRect();
      if (r.top < innerHeight * 0.9 && r.bottom > 0) return; // birinchi ekrandagilar darhol ko'rinadi
      used++;
      var k = e.classList.contains("topic-chip") ? "zoom" : kinds[n++ % kinds.length];
      e.classList.add("ka-rv", k); io.observe(e);
    }
    function prepare(root) {
      if (root && root.matches && root.matches(SEL)) prepOne(root);
      Array.prototype.forEach.call((root || document).querySelectorAll(SEL), prepOne);
    }
    if (document.readyState === "complete") prepare(); else addEventListener("load", function () { prepare(); });
    // keyin qo'shilgan bloklar (masalan, admin mavzulari) uchun — faqat yangi qo'shilgan tugunlar tekshiriladi
    if ("MutationObserver" in window) {
      var mt = 0, pend = [];
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) { var an = ms[i].addedNodes; for (var j = 0; j < an.length; j++) { var nd = an[j]; if (nd.nodeType === 1 && pend.length < 200) pend.push(nd); } }
        if (!pend.length) return;
        clearTimeout(mt); mt = setTimeout(function () { var l = pend; pend = []; l.forEach(function (nd) { if (nd.isConnected) prepare(nd); }); }, 400);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ================= 2) Maskot "Kuvi" — robot-qahramon (2-avlod) =================
   * Zirhli robot: LED-ekranli yuz (his-tuyg'ular), ryukzak-reaktiv dvigatel bilan uchadi,
   * to'p bilan o'ynaydi, barmoq/sichqonchaga qaraydi, uzoq tegilmasa uxlab qoladi,
   * tanga yutilganda (kaAccount.addCoins) bayram qiladi.
   * Boshqa sahifalardan: window.kaKuvi.react("happy"|"sad"|"love"|"surprised"|"thinking"|"celebrate"|"angry"|"sleepy"|"dizzy"|"wink", "matn")
   *   yoki document.dispatchEvent(new CustomEvent("ka:kuvi",{detail:{emo:"celebrate",text:"Ofarin!"}}))
   */
  var FACTS = [
    "Bilasizmi? 0 sonini hind matematiklari kashf etgan. 🔢",
    "Al-Xorazmiy nomidan “algoritm” so'zi kelib chiqqan! 🇺🇿",
    "1 dan 100 gacha sonlar yig'indisi 5050 — Gauss buni bolaligida topgan.",
    "Pi (π) soni hech qachon tugamaydi: 3,14159…",
    "Futbol to'pi 12 ta beshburchak va 20 ta oltiburchakdan tikiladi! ⚽",
    "Asalari uyalari oltiburchak — eng kam mum bilan eng ko'p joy. 🐝",
    "Har qanday juft son (2 dan katta) ikki tub son yig'indisi deb taxmin qilinadi.",
    "Kungaboqar urug'lari Fibonachchi spiralida joylashgan: 1, 1, 2, 3, 5, 8…",
    "Bir yilda taxminan 31 536 000 soniya bor. ⏱️",
    "111111111 × 111111111 = 12345678987654321 🤯",
    "Ulug'bek yulduzlar jadvalini 600 yil oldin juda aniq tuzgan. 🔭",
    "Tub sonlar cheksiz ko'p — buni Evklid isbotlagan.",
    "Inglizcha “algebra” so'zi al-Xorazmiyning “al-jabr” kitobidan olingan. 📖",
    "Shaxmat taxtasida 64 katak, lekin pozitsiyalar soni koinotdagi atomlardan ko'p! ♟️",
    "Sudoku'da kamida 17 ta raqam berilsagina yechim yagona bo'lishi mumkin. 🧩"
  ];
  var LINES = {
    happy: ["Zo'r! 😄", "Bugun ajoyib kun!", "Men tayyorman! ⚡", "O'rganishda davom etamiz!"],
    love: ["Matematikani yaxshi ko'raman! 💙", "Siz eng zo'risiz! 💖"],
    surprised: ["Voy! 😮", "Kutilmagan!", "Shunchalik tezmi?!"],
    sad: ["Ketyapsizmi? 🥺", "Meni unutmang…"],
    thinking: ["Hmm… o'ylab ko'raylik 🤔", "Bir daqiqa… hisoblayapman…"],
    celebrate: ["Ofarin! 🎉", "Barakalla! 🏆", "Zo'r natija! ⭐"],
    angry: ["Hey, qitiqlamang! 😤", "Sekinroq! Men robotman, o'yinchoq emas!"],
    sleepy: ["Zzz… 😴"],
    dizzy: ["Boshim aylandi… 😵‍💫"],
    wink: ["Sir: har kuni 1 ta masala = katta natija 😉", "Biz birga uddalaymiz 😉"]
  };
  var BULB = { idle: "#5ee6c7", happy: "#5ee6c7", love: "#ff7eb6", surprised: "#ffd479", sad: "#7c9bff", thinking: "#ffd479", celebrate: "#ffd479", angry: "#ff6b6b", sleepy: "#6b7a99", dizzy: "#c084fc", wink: "#5ee6c7" };
  var LED = { love: "#ff8fc6", angry: "#ff7b7b", sad: "#8fb2ff", sleepy: "#7fa0c0", dizzy: "#d6a8ff" };

  var kcss = `
  .ka-kuvi,.ka-ball,.ka-shadow{will-change:transform;contain:layout paint}
  .ka-kuvi{position:fixed;bottom:calc(4px + var(--kb,0px));left:0;width:84px;height:104px;z-index:900;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;touch-action:manipulation}
  .ka-kuvi svg{width:100%;height:100%;overflow:visible;display:block}
  @media (min-width:900px) and (hover:hover){.ka-kuvi svg{filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}}
  .ka-kuvi .face *{transition:none}
  .ka-kuvi .jet{transition:opacity .25s}
  .ka-kuvi .fl{transform-box:fill-box;transform-origin:50% 0}
  .ka-kuvi .zz{font:800 11px sans-serif;fill:#9fb0d0}
  .ka-ball{position:fixed;bottom:calc(4px + var(--kb,0px));left:0;width:28px;height:28px;z-index:899;pointer-events:none}
  .ka-shadow{position:fixed;left:0;width:54px;transform-origin:50% 50%;bottom:calc(1px + var(--kb,0px));height:8px;border-radius:50%;background:rgba(0,0,0,.3);z-index:898;pointer-events:none;filter:blur(2px)}
  .ka-say{position:fixed;bottom:calc(116px + var(--kb,0px));max-width:250px;background:#fff;color:#14203a;font:600 14px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:10px 12px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);z-index:903;opacity:0;transform:translateY(8px) scale(.95);transition:opacity .25s,transform .25s;pointer-events:none}
  .ka-say.on{opacity:1;transform:none}
  .ka-say::after{content:"";position:absolute;bottom:-8px;left:var(--tx,30px);border:8px solid transparent;border-bottom:0;border-top-color:#fff}
  .ka-kx{position:fixed;bottom:calc(98px + var(--kb,0px));width:22px;height:22px;border-radius:50%;border:0;background:rgba(20,31,56,.9);color:#9fb0d0;font-size:12px;line-height:22px;text-align:center;padding:0;z-index:902;cursor:pointer;opacity:0;transition:opacity .2s}
  .ka-kuvi:hover~.ka-kx,.ka-kx:hover,.ka-kx:focus{opacity:1}
  @media (hover:none){.ka-kx{opacity:.55}}
  .ka-kback{position:fixed;left:10px;bottom:10px;z-index:900;border:1px solid #243252;background:rgba(20,31,56,.92);color:#eef2ff;border-radius:99px;padding:6px 10px;font-size:18px;cursor:pointer}
  .ka-spark{position:fixed;z-index:903;pointer-events:none;font-size:16px;will-change:transform,opacity}
  @media print{.ka-kuvi,.ka-ball,.ka-shadow,.ka-say,.ka-kx,.ka-kback,.ka-spark,.ka-prog{display:none!important}}
  `;
  var kst = document.createElement("style"); kst.textContent = kcss; document.head.appendChild(kst);

  window.kaKuvi = { react: function () {}, say: function () {} }; // kuvi o'chiq bo'lsa ham xato bermasin
  if (store("ka.kuvi.off") === "1") { backBtn(); return; }
  startKuvi();

  function backBtn() {
    var b = document.createElement("button"); b.className = "ka-kback"; b.title = "Kuvini qaytarish"; b.setAttribute("aria-label", "Kuvini qaytarish"); b.textContent = "🤖";
    b.onclick = function () { store("ka.kuvi.off", "0"); b.remove(); startKuvi(true); };
    document.body.appendChild(b);
  }

  function startKuvi(welcomeBack) {
    var SVGNS = "http://www.w3.org/2000/svg";
    var svg =
      '<svg viewBox="0 0 100 124" aria-hidden="true"><defs>' +
      '<linearGradient id="kvT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fe6c9"/><stop offset="1" stop-color="#0c7f70"/></linearGradient>' +
      '<linearGradient id="kvH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b8c6dd"/></linearGradient>' +
      '<linearGradient id="kvF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7c2"/><stop offset=".45" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5c3a" stop-opacity="0"/></linearGradient>' +
      '<filter id="kvGl" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs><g class="bd">' +
      // ryukzak dvigatellari (orqada) va olov
      '<g class="pack"><rect x="15" y="64" width="11" height="22" rx="5" fill="#7d8ca8"/><rect x="74" y="64" width="11" height="22" rx="5" fill="#7d8ca8"/>' +
      '<rect x="16.5" y="83" width="8" height="5" rx="2" fill="#3b4762"/><rect x="75.5" y="83" width="8" height="5" rx="2" fill="#3b4762"/></g>' +
      '<g class="jet" opacity="0"><path class="fl" d="M15.5 88 Q20.5 120 25.5 88Z" fill="url(#kvF)"/><path class="fl" d="M74.5 88 Q79.5 120 84.5 88Z" fill="url(#kvF)"/></g>' +
      // oyoqlar
      '<g class="lg1"><rect x="35" y="96" width="11" height="15" rx="5" fill="#a9b8cf"/><path d="M31 109h16a5 5 0 0 1 0 10H31a4.5 4.5 0 0 1 0-10z" fill="#0c7f70"/><path d="M31 117h17" stroke="#5ee6c7" stroke-width="1.6"/></g>' +
      '<g class="lg2"><rect x="54" y="96" width="11" height="15" rx="5" fill="#a9b8cf"/><path d="M53 109h16a4.5 4.5 0 0 1 0 10H53a5 5 0 0 1 0-10z" fill="#0c7f70"/><path d="M52 117h17" stroke="#5ee6c7" stroke-width="1.6"/></g>' +
      // tana
      '<rect x="24" y="58" width="52" height="44" rx="19" fill="url(#kvT)"/>' +
      '<path d="M33 66h34a6 6 0 0 1 6 6v8c0 9-7.5 16-17 16h-12c-9.5 0-17-7-17-16v-8a6 6 0 0 1 6-6z" fill="#eaf1fc"/>' +
      '<path d="M33 66h34a6 6 0 0 1 6 6v2H27v-2a6 6 0 0 1 6-6z" fill="#cfd9ea"/>' +
      '<g class="core"><path d="M50 71l8.2 4.7v9.5L50 90l-8.2-4.8v-9.5z" fill="#0b1220" stroke="#5ee6c7" stroke-width="1.6"/>' +
      '<text class="pi" x="50" y="84.3" text-anchor="middle" font-size="11" font-weight="900" fill="#5ee6c7" font-family="Georgia,serif" filter="url(#kvGl)">π</text></g>' +
      // qo'llar
      '<g class="ar1"><path d="M27 67 Q15 74 14 86" stroke="#0c7f70" stroke-width="8.5" stroke-linecap="round" fill="none"/><path d="M27 67 Q15 74 14 86" stroke="#3fe6c9" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/><circle cx="14" cy="88.5" r="6" fill="#eaf1fc" stroke="#0c7f70" stroke-width="1.5"/></g>' +
      '<g class="ar2"><path d="M73 67 Q85 74 86 86" stroke="#0c7f70" stroke-width="8.5" stroke-linecap="round" fill="none"/><path d="M73 67 Q85 74 86 86" stroke="#3fe6c9" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/><circle cx="86" cy="88.5" r="6" fill="#eaf1fc" stroke="#0c7f70" stroke-width="1.5"/></g>' +
      // bosh
      '<g class="hd">' +
      '<path d="M50 14V5" stroke="#a9b8cf" stroke-width="3" stroke-linecap="round"/><circle class="bulb" cx="50" cy="5" r="4.6" fill="#5ee6c7" filter="url(#kvGl)"/>' +
      '<circle cx="16" cy="37" r="7.5" fill="#0c7f70"/><circle cx="84" cy="37" r="7.5" fill="#0c7f70"/>' +
      '<circle class="ear" cx="16" cy="37" r="3" fill="#5ee6c7"/><circle class="ear" cx="84" cy="37" r="3" fill="#5ee6c7"/>' +
      '<rect x="16" y="12" width="68" height="50" rx="24" fill="url(#kvH)" stroke="#0c7f70" stroke-width="2.5"/>' +
      '<rect x="22.5" y="19.5" width="55" height="35" rx="15" fill="#0b1220"/>' +
      '<g class="face" filter="url(#kvGl)"></g>' +
      '<path d="M28 24q7-4.5 15-3.6" stroke="rgba(255,255,255,.28)" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
      '</g></g></svg>';
    var ballSvg = '<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#fff" stroke="#14203a" stroke-width="1.5"/>' +
      '<path d="M15 8l5 3.6-1.9 5.9h-6.2L10 11.6z" fill="#14203a"/>' +
      '<path d="M15 1v7M20 11.6l7-2M18.1 17.5l4 6M11.9 17.5l-4 6M10 11.6l-7-2" stroke="#14203a" stroke-width="1.3"/></svg>';

    var k = document.createElement("div"); k.className = "ka-kuvi"; k.innerHTML = svg; k.title = "Kuvi — meni bosing!";
    k.setAttribute("role", "button"); k.setAttribute("aria-label", "Kuvi robot: bosing — qiziqarli fakt aytadi"); k.tabIndex = 0;
    var ball = document.createElement("div"); ball.className = "ka-ball"; ball.innerHTML = ballSvg;
    var sh = document.createElement("div"); sh.className = "ka-shadow";
    var say = document.createElement("div"); say.className = "ka-say"; say.setAttribute("aria-live", "polite");
    var x = document.createElement("button"); x.className = "ka-kx"; x.textContent = "✕"; x.title = "Kuvini yashirish"; x.setAttribute("aria-label", "Kuvini yashirish");
    document.body.appendChild(sh); document.body.appendChild(ball); document.body.appendChild(k); document.body.appendChild(x); document.body.appendChild(say);

    var Q = function (s) { return k.querySelector(s); };
    var bd = Q(".bd"), hd = Q(".hd"), lg1 = Q(".lg1"), lg2 = Q(".lg2"), ar1 = Q(".ar1"), ar2 = Q(".ar2"), face = Q(".face"), bulb = Q(".bulb"), jet = Q(".jet"), core = Q(".pi");
    var flames = k.querySelectorAll(".fl"), ears = k.querySelectorAll(".ear");

    // ---------- yuz ifodalari (LED) ----------
    function eyesPill(c, lx, ly, h) { h = h || 12; return '<g class="eyes"><rect x="' + (33.5 + lx) + '" y="' + (35 - h / 2 + ly) + '" width="10" height="' + h + '" rx="5" fill="' + c + '"/><rect x="' + (56.5 + lx) + '" y="' + (35 - h / 2 + ly) + '" width="10" height="' + h + '" rx="5" fill="' + c + '"/></g>'; }
    function arcs(c, up, y) { y = y || 37; var q = up ? y - 8 : y + 5; return '<g class="eyes"><path d="M33 ' + y + 'Q38.5 ' + q + ' 44 ' + y + 'M56 ' + y + 'Q61.5 ' + q + ' 67 ' + y + '" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round" fill="none"/></g>'; }
    function heart(cx, cy, c) { return '<path d="M' + cx + ' ' + (cy + 5) + 'c-7-4.5-8-9.5-4.3-11.2c2.3-1 4.3.6 4.3 2.3c0-1.7 2-3.3 4.3-2.3c3.7 1.7 2.7 6.7-4.3 11.2z" fill="' + c + '"/>'; }
    function star(cx, cy, r, c) { var p = ""; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); } return '<path d="' + p + 'Z" fill="' + c + '"/>'; }
    function cheeks() { return '<ellipse cx="30" cy="46" rx="4" ry="2.2" fill="#ff7eb6" opacity=".55"/><ellipse cx="70" cy="46" rx="4" ry="2.2" fill="#ff7eb6" opacity=".55"/>'; }
    var FACES = {
      idle: function (c, lx, ly) { return eyesPill(c, lx, ly) + '<path d="M45 46.5Q50 49.5 55 46.5" stroke="' + c + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>'; },
      happy: function (c) { return arcs(c, true) + '<path d="M41 44Q50 52.5 59 44" stroke="' + c + '" stroke-width="2.8" stroke-linecap="round" fill="none"/>' + cheeks(); },
      wink: function (c, lx, ly) { return '<g class="eyes"><path d="M33 36Q38.5 30 44 36" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round" fill="none"/><rect x="' + (56.5 + lx) + '" y="' + (29 + ly) + '" width="10" height="12" rx="5" fill="' + c + '"/></g><path d="M43 45Q51 51 58 44" stroke="' + c + '" stroke-width="2.8" stroke-linecap="round" fill="none"/>' + cheeks(); },
      love: function () { var c = LED.love; return '<g class="eyes">' + heart(38.5, 31, c) + heart(61.5, 31, c) + '</g><path d="M42 44.5Q50 52 58 44.5" stroke="' + c + '" stroke-width="2.8" stroke-linecap="round" fill="none"/>' + cheeks(); },
      surprised: function (c) { return '<g class="eyes"><circle cx="38.5" cy="34" r="5.6" stroke="' + c + '" stroke-width="3" fill="none"/><circle cx="61.5" cy="34" r="5.6" stroke="' + c + '" stroke-width="3" fill="none"/><circle cx="38.5" cy="34" r="1.8" fill="' + c + '"/><circle cx="61.5" cy="34" r="1.8" fill="' + c + '"/></g><circle cx="50" cy="47" r="3.2" stroke="' + c + '" stroke-width="2.4" fill="none"/>'; },
      sad: function () { var c = LED.sad; return '<path d="M33 30.5L43 27M67 30.5L57 27" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"/>' + eyesPill(c, 0, 2, 9) + '<path d="M43 49Q50 43 57 49" stroke="' + c + '" stroke-width="2.6" stroke-linecap="round" fill="none"/><path class="tear" d="M36 42q-2 3.6 0 4.8q2-1.2 0-4.8z" fill="#7cc4ff"/>'; },
      thinking: function (c) { return '<path d="M55 27.5L66 26" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"/><g class="eyes"><path d="M33.5 36h10" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round"/><rect x="56.5" y="30" width="10" height="11" rx="5" fill="' + c + '"/></g><path d="M45 47L56 45" stroke="' + c + '" stroke-width="2.6" stroke-linecap="round"/>'; },
      celebrate: function () { var c = "#ffd479"; return '<g class="eyes">' + star(38.5, 34, 6.6, c) + star(61.5, 34, 6.6, c) + '</g><path d="M42 43.5h16a8 8 0 0 1-16 0z" fill="' + c + '"/>'; },
      angry: function () { var c = LED.angry; return '<path d="M33 28L43.5 32M67 28L56.5 32" stroke="' + c + '" stroke-width="2.8" stroke-linecap="round"/>' + eyesPill(c, 0, 1.5, 9) + '<path d="M44 47.5h12" stroke="' + c + '" stroke-width="2.8" stroke-linecap="round"/>'; },
      sleepy: function () { var c = LED.sleepy; return arcs(c, false, 35) + '<circle cx="50" cy="47" r="2.2" fill="' + c + '"/>'; },
      dizzy: function () { var c = LED.dizzy, sp = function (cx) { return '<path d="M' + cx + ' 34m-1 0a1 1 0 1 1 2 0a2.5 2.5 0 1 1 -5 0a4 4 0 1 1 8 0a5.5 5.5 0 1 1 -11 0" stroke="' + c + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'; }; return '<g class="eyes">' + sp(38.5) + sp(61.5) + '</g><path d="M42 47q2-2.5 4 0t4 0t4 0t4 0" stroke="' + c + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; }
    };

    var emo = "idle", emoT = 0, lookX = 0, lookY = 0, faceKey = "", blinkT = 2.5, blinkP = 0;
    function drawFace() {
      var c = LED[emo] || "#5ee6c7";
      var lx = Math.round(lookX * 2) / 2, ly = Math.round(lookY * 2) / 2, key = emo + lx + "," + ly;
      if (key === faceKey) return; faceKey = key;
      face.innerHTML = (FACES[emo] || FACES.idle)(c, lx, ly);
      bulb.setAttribute("fill", BULB[emo] || BULB.idle);
      for (var i = 0; i < ears.length; i++) ears[i].setAttribute("fill", BULB[emo] || BULB.idle);
    }
    function setEmo(e, dur) { emo = FACES[e] ? e : "idle"; emoT = dur == null ? 2.6 : dur; faceKey = ""; drawFace(); }

    // ---------- gapirish ----------
    var sayT = 0;
    function speak(t, dur) { say.textContent = t; say.classList.add("on"); sayT = dur || Math.min(7, 2.4 + t.length / 18); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

    // ---------- uchqunlar ----------
    function sparks(n, chars) {
      if (reduce) return;
      var r = k.getBoundingClientRect();
      for (var i = 0; i < n; i++) (function (i) {
        var s = document.createElement("span"); s.className = "ka-spark"; s.textContent = pick(chars || ["⭐", "✨", "🪙", "🎉"]);
        var x0 = r.left + r.width / 2, y0 = r.top + 18, ang = -Math.PI / 2 + (Math.random() - .5) * 2.2, sp = 90 + Math.random() * 120;
        s.style.left = x0 + "px"; s.style.top = y0 + "px"; document.body.appendChild(s);
        var t0 = performance.now();
        (function an(now) {
          var t = (now - t0) / 1000; if (t > 1.1) { s.remove(); return; }
          var dx = Math.cos(ang) * sp * t, dy = Math.sin(ang) * sp * t + 260 * t * t;
          s.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + (t * 360 * (i % 2 ? 1 : -1)) + "deg)"; s.style.opacity = String(1 - t / 1.1);
          requestAnimationFrame(an);
        })(t0);
      })(i);
    }

    // ---------- holat ----------
    var W = innerWidth, px = Math.random() * Math.max(40, W - 140) + 20, dir = 1, speed = 52;
    var mode = "walk", modeT = 0;          // walk | idle | fly | sleep
    var jumpT = -1, jumpH = 0, nextJump = 3 + Math.random() * 3, t = 0, last = performance.now();
    var fly = null;                         // {x0,x1,h,T,t}
    var bx = px + 76, by = 0, bvy = 0, ballAngle = 0, dribble = true;
    var stopped = 0, wave = 0, idleFor = 0, taps = [], nextFly = 14 + Math.random() * 12, spin = 0;

    function jump(h) { if (jumpT < 0 && mode !== "fly") { jumpT = 0; jumpH = h || 70; bvy = 520 + Math.random() * 180; dribble = false; } }
    function startFly(tx, h) {
      if (mode === "fly" || reduce) return;
      var x1 = tx != null ? tx : Math.max(8, Math.min(W - 96, px + (Math.random() < .5 ? -1 : 1) * (W * (.3 + Math.random() * .4))));
      fly = { x0: px, x1: x1, h: h || 110 + Math.random() * 120, T: 1.8 + Math.abs(x1 - px) / 420, t: 0 };
      mode = "fly"; dir = x1 >= px ? 1 : -1; jumpT = -1; dribble = false; bvy = 380;
    }
    function wake() { if (mode === "sleep") { mode = "walk"; setEmo("surprised", 1.4); speak(pick(LINES.surprised), 2.2); jump(60); } idleFor = 0; }

    function react(e, text) {
      wake();
      if (e === "celebrate") { setEmo("celebrate", 3.2); jump(110); sparks(12); wave = 2.2; }
      else if (e === "sad") { setEmo("sad", 3); stopped = 2.5; }
      else if (e === "surprised") { setEmo("surprised", 1.8); jump(70); }
      else if (e === "love") { setEmo("love", 3); sparks(6, ["💖", "💙", "✨"]); }
      else if (e === "angry") { setEmo("angry", 2.2); stopped = 1.2; }
      else if (e === "dizzy") { setEmo("dizzy", 2.4); spin = 1.2; }
      else if (e === "fly") { setEmo("happy", 2.5); startFly(); }
      else setEmo(e, 2.8);
      if (text) speak(text); else if (LINES[e]) speak(pick(LINES[e]));
    }
    window.kaKuvi = { react: react, say: function (s) { speak(String(s)); } };
    document.addEventListener("ka:kuvi", function (ev) { var d = ev.detail || {}; react(d.emo || "happy", d.text); });

    // tanga yutilganda bayram (akkount.js keyinroq yuklanadi)
    function hookCoins() {
      var A = window.kaAccount; if (!A || A.__kuvi || typeof A.addCoins !== "function") return !!(A && A.__kuvi);
      var f = A.addCoins; A.addCoins = function (n) { var r = f.apply(this, arguments); if (r) react("celebrate", "Ofarin! +" + Math.floor(+n || 0) + " 🪙"); return r; };
      A.__kuvi = true; return true;
    }
    var hookTries = 0, hookIv = setInterval(function () { if (hookCoins() || ++hookTries > 20) clearInterval(hookIv); }, 500);

    // ---------- kiritish ----------
    var chatT = 0;
    function onTap(ev) {
      if (ev) ev.preventDefault();
      wake();
      var now = performance.now(); taps = taps.filter(function (q) { return now - q < 1400; }); taps.push(now);
      if (taps.length >= 6) { clearTimeout(chatT); taps = []; react("dizzy"); return; }
      if (taps.length >= 4) { clearTimeout(chatT); react("angry"); return; }
      if (mode === "fly") { react("surprised"); return; }
      // Kuvi endi ovozli AI ustoz: bitta bosilsa — suhbat oynasi ochiladi (tez-tez bosilsa — avvalgi o'yinlar)
      if (window.kaKuviChat) {
        clearTimeout(chatT); setEmo("happy", 2.5); jump(70); speak("Gaplashamiz! 🎙 Savolingizni ayting", 2);
        chatT = setTimeout(function () { if (taps.length < 3) window.kaKuviChat.open(); }, 520);
        return;
      }
      var r = Math.random();
      if (r < .12) { react("fly", "Uchdik! 🚀"); return; }
      stopped = 3.5; jump(95);
      var e = pick(["happy", "happy", "wink", "love", "thinking"]);
      if (e === "thinking") { setEmo("thinking", 1.3); setTimeout(function () { setEmo("happy", 3.5); speak(pick(FACTS), 6); }, 1100); speak(pick(LINES.thinking), 1.2); }
      else { setEmo(e, 3.5); speak(pick(FACTS), 6); }
    }
    k.addEventListener("click", onTap);
    k.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") onTap(e); });
    k.addEventListener("mouseenter", function () { if (mode !== "sleep" && emo === "idle") setEmo("love", 1.6); });
    x.addEventListener("click", function () {
      setEmo("sad", 3); speak("Xayr! 👋 Pastdagi 🤖 tugmasi bilan meni qaytarasiz.", 2.2); wave = 1.6; stopped = 2;
      setTimeout(function () { store("ka.kuvi.off", "1"); [k, ball, sh, say, x].forEach(function (e) { e.remove(); }); cancelAnimationFrame(raf); clearInterval(hookIv); window.kaKuvi = { react: function () {}, say: function () {} }; backBtn(); }, 1700);
    });

    var pX = -1, pY = -1;
    addEventListener("pointermove", function (e) { pX = e.clientX; pY = e.clientY; idleFor = 0; if (mode === "sleep" && Math.random() < .02) wake(); }, { passive: true });
    addEventListener("pointerdown", function () { idleFor = 0; }, { passive: true });
    addEventListener("keydown", function () { idleFor = 0; });
    addEventListener("resize", function () { W = innerWidth; px = Math.min(px, W - 96); });
    var lastSY = scrollY, scrollJumpAt = 0;
    addEventListener("scroll", function () {
      var d = scrollY - lastSY; lastSY = scrollY; idleFor = 0;
      if (mode === "sleep") { wake(); return; }
      var now = performance.now();
      if (Math.abs(d) > 30 && now - scrollJumpAt > 900) { scrollJumpAt = now; if (Math.abs(d) > 160 && Math.random() < .35) { startFly(); setEmo("happy", 2); } else { jump(55 + Math.min(60, Math.abs(d))); if (Math.abs(d) > 120) setEmo("surprised", 1); } }
    }, { passive: true });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && Math.random() < .6) { setEmo("happy", 2.5); speak("Qaytdingizmi! 👋", 2.2); wave = 1.6; } });

    // ---------- fitBottom: pastdagi suzuvchi tugmalar ustidan yursin ----------
    function fitBottom() {
      var mine = [k, ball, sh, say, x], off = 0;
      // faqat body'ning yuqori qatlamidagi elementlar (fixed tugmalar odatda shu yerda) — butun DOMni aylanmaymiz
      Array.prototype.forEach.call(document.body.querySelectorAll("body > *, body > * > *"), function (e) {
        if (mine.indexOf(e) >= 0 || mine.some(function (m) { return m.contains(e); }) || e.classList.contains("ka-spark")) return;
        var cs = getComputedStyle(e); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
        var r = e.getBoundingClientRect(); if (r.height > 0 && r.height < 120 && r.width < innerWidth * 0.9 && innerHeight - r.bottom < 40) off = Math.max(off, innerHeight - r.top + 4);
      });
      document.documentElement.style.setProperty("--kb", off + "px");
    }
    setTimeout(fitBottom, 1500); setTimeout(fitBottom, 4000); addEventListener("resize", function () { setTimeout(fitBottom, 300); });

    // salomlashish
    setEmo("happy", 3);
    setTimeout(function () {
      var greeted = false; try { greeted = sessionStorage.getItem("ka.kuvi.hi") === "1"; sessionStorage.setItem("ka.kuvi.hi", "1"); } catch (e) {}
      if (welcomeBack) { speak("Men qaytdim! 🤖⚡", 2.6); wave = 1.8; return; }
      if (greeted) return;
      var h = new Date().getHours(), g = h < 5 ? "Hali uxlamadingizmi? 🌙" : h < 11 ? "Xayrli tong! ☀️" : h < 17 ? "Xayrli kun! 👋" : "Xayrli kech! 🌆";
      speak(g + " Men Kuvi — bosib ko'ring!", 3.6); wave = 2;
    }, 900);

    var raf = 0, fN = 0, rK = null;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      // tejamkor: oddiy holatda 30 kadr/s, sakrash/uchishda 60, uyquda 12 (telefon qizimasin, sahifa silliq aylansin)
      var minDt = mode === "fly" || jumpT >= 0 || spin > 0 ? 0 : mode === "sleep" ? 80 : 32;
      if (now - last < minDt) return;
      var dt = Math.min(0.08, (now - last) / 1000); last = now; t += dt; fN++;
      idleFor += dt;

      // his-tuyg'u taymeri
      if (emoT > 0) { emoT -= dt; if (emoT <= 0 && mode !== "sleep") setEmo("idle", 0); }
      // uyqu
      if (mode !== "sleep" && mode !== "fly" && idleFor > 28 && !reduce) { mode = "sleep"; setEmo("sleepy", 1e9); speak(LINES.sleepy[0], 2); }
      // ko'zlar barmoq/sichqonchaga qaraydi
      if (!rK || fN % 6 === 0) rK = k.getBoundingClientRect();
      var r = rK, tx = 0, ty = 0;
      if (pX >= 0 && mode !== "sleep") { var dx = pX - (r.left + r.width / 2), dy = pY - (r.top + 30), dd = Math.hypot(dx, dy) || 1; tx = dx / dd * 3; ty = dy / dd * 2; }
      else tx = dir * 1.5;
      lookX += (tx - lookX) * Math.min(1, dt * 8); lookY += (ty - lookY) * Math.min(1, dt * 8);
      if (emo === "idle" || emo === "wink") drawFace();
      // ko'z pirpiratish
      blinkT -= dt;
      if (blinkT <= 0 && emo === "idle") { blinkP = 0.16; blinkT = 2.5 + Math.random() * 3.5; }
      var eyes = face.querySelector(".eyes");
      if (eyes) { if (blinkP > 0) { blinkP -= dt; eyes.setAttribute("transform", "translate(0,35) scale(1,0.12) translate(0,-35)"); } else eyes.removeAttribute("transform"); }
      // yadro (π) va quloq LED'lari pulsatsiyasi
      core.setAttribute("opacity", (0.75 + 0.25 * Math.sin(t * (mode === "fly" ? 14 : 3))).toFixed(2));

      // harakat
      var jy = 0, squash = 1, tilt = 0;
      if (mode === "sleep") { stopped = 0; }
      else if (mode === "fly") {
        fly.t += dt; var p = Math.min(1, fly.t / fly.T), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        px = fly.x0 + (fly.x1 - fly.x0) * e;
        jy = Math.sin(p * Math.PI) * fly.h + Math.sin(t * 6) * 4 * Math.sin(p * Math.PI);
        tilt = dir * 12 * Math.sin(p * Math.PI);
        if (p >= 1) { mode = "walk"; fly = null; squash = .82; dribble = true; nextFly = 16 + Math.random() * 16; if (emo === "idle") setEmo("happy", 1.5); }
      } else {
        if (stopped > 0) stopped -= dt;
        else if (!reduce) {
          px += dir * speed * dt;
          if (px > W - 96) { px = W - 96; dir = -1; }
          if (px < 6) { px = 6; dir = 1; }
          if (Math.random() < 0.002) dir = -dir;
        }
        nextJump -= dt; if (nextJump <= 0 && !reduce) { jump(45 + Math.random() * 50); nextJump = 3 + Math.random() * 4; }
        nextFly -= dt; if (nextFly <= 0 && !reduce) { startFly(); }
        if (jumpT >= 0) { jumpT += dt; var D = .75, q = jumpT / D; if (q >= 1) { jumpT = -1; squash = .85; } else jy = Math.sin(q * Math.PI) * jumpH; }
      }
      var walking = mode === "walk" && stopped <= 0 && !reduce && jy === 0;
      var walk = walking ? Math.sin(t * 12) : 0;
      var bob = mode === "sleep" ? Math.sin(t * 2) * 1.5 : (jy > 0 ? 0 : Math.abs(walk) * 3);
      if (spin > 0) { spin -= dt; tilt = Math.sin(spin * 20) * 14; }
      k.style.transform = "translate(" + px + "px," + (-jy - bob) + "px)";
      bd.style.transformOrigin = "50px 118px";
      bd.style.transform = (dir < 0 ? "scaleX(-1) " : "") + "rotate(" + (tilt * (dir < 0 ? -1 : 1)) + "deg)" + (jy > 0 ? "" : " scaleY(" + squash + ")");
      hd.style.transformOrigin = "50px 60px";
      hd.style.transform = mode === "sleep" ? "rotate(8deg)" : (emo === "thinking" ? "rotate(-6deg)" : "rotate(" + (walk * 2) + "deg)");
      lg1.style.transformOrigin = "40px 96px"; lg2.style.transformOrigin = "60px 96px";
      var legSwing = mode === "fly" ? 18 : walk * 16;
      lg1.style.transform = "rotate(" + legSwing + "deg)"; lg2.style.transform = "rotate(" + (mode === "fly" ? 8 : -legSwing) + "deg)";
      // qo'llar: yurish, sakrash, uchish, qo'l silkitish, bayram
      var a1, a2;
      if (wave > 0) { wave -= dt; a1 = 10 * Math.sin(t * 3); a2 = -150 + 28 * Math.sin(t * 14); }
      else if (emo === "celebrate") { a1 = 140 + 20 * Math.sin(t * 16); a2 = -140 - 20 * Math.sin(t * 16); }
      else if (mode === "fly") { a1 = -40; a2 = 40; }
      else if (jy > 0) { a1 = -35; a2 = 35; }
      else if (emo === "thinking") { a1 = walk * 8; a2 = -120; }
      else if (mode === "sleep") { a1 = 8; a2 = -8; }
      else { a1 = walk * 12; a2 = -walk * 12; }
      ar1.style.transformOrigin = "27px 67px"; ar2.style.transformOrigin = "73px 67px";
      ar1.style.transform = "rotate(" + a1 + "deg)"; ar2.style.transform = "rotate(" + a2 + "deg)";
      // reaktiv olov
      var jetOn = mode === "fly";
      jet.setAttribute("opacity", jetOn ? "1" : "0");
      if (jetOn) for (var i = 0; i < flames.length; i++) flames[i].style.transform = "scaleY(" + (0.75 + Math.random() * 0.5) + ")";
      // ko'z yoshi tomchisi
      var tear = face.querySelector(".tear"); if (tear) tear.setAttribute("transform", "translate(0," + ((t * 14) % 9).toFixed(1) + ")");
      // Zzz
      var zz = face.parentNode.querySelector(".zz");
      if (mode === "sleep") { if (!zz) { zz = document.createElementNS(SVGNS, "text"); zz.setAttribute("class", "zz"); zz.textContent = "z"; face.parentNode.appendChild(zz); } var zp = (t * .6) % 1; zz.setAttribute("x", String(78 + zp * 10)); zz.setAttribute("y", String(14 - zp * 14)); zz.setAttribute("opacity", String(1 - zp)); zz.textContent = zp < .33 ? "z" : zp < .66 ? "zZ" : "zZz"; }
      else if (zz) zz.remove();

      // to'p
      var targetX = px + (dir > 0 ? 70 : -16);
      bx += (targetX - bx) * Math.min(1, dt * (mode === "fly" ? 1.6 : 6));
      bvy -= 1500 * dt; by += bvy * dt;
      if (by <= 0) { by = 0; if (dribble || bvy < -60) { bvy = dribble && mode === "walk" && stopped <= 0 ? 320 : Math.abs(bvy) * 0.5; if (!dribble && bvy < 200 && mode !== "fly") dribble = true; } else bvy = 0; }
      if (mode === "sleep") { bvy = 0; by = 0; }
      ballAngle += (stopped > 0 || mode === "sleep" ? 0 : dir * speed * dt / 14 * 57);
      ball.style.transform = "translate(" + bx + "px," + (-by) + "px) rotate(" + ballAngle + "deg)";
      var shw = 54 - Math.min(34, jy / 4);
      sh.style.transform = "translateX(" + (px + 15).toFixed(1) + "px) scaleX(" + (shw / 54).toFixed(3) + ")"; sh.style.opacity = String(1 - Math.min(.7, jy / 160)).slice(0, 5);
      x.style.left = (px + 70) + "px"; x.style.transform = "translateY(" + (-jy - bob) + "px)";
      if (sayT > 0) {
        sayT -= dt; var sx = Math.max(8, Math.min(W - 262, px - 20)); say.style.left = sx + "px"; say.style.setProperty("--tx", Math.max(10, Math.min(232, px + 42 - sx - 8)) + "px");
        say.style.transform = "translateY(" + (-jy - bob) + "px)";
        if (sayT <= 0) { say.classList.remove("on"); say.style.transform = ""; }
      }
    }
    raf = requestAnimationFrame(frame);
  }
})();
