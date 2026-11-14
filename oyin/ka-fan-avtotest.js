/*! Kuvonch Academy — Avtotest savollari viktorina va arqon tortish uchun
 *  Manba: avtotest/savollar.js (Yo'l harakati qoidalari asosida o'zimiz tuzgan 200 ta savol).
 *  at0 — barcha mavzular aralash, at1…at13 — avtotest mavzulari.
 *  Savol banki og'ir (≈170 KB), shuning uchun faqat avtotest mavzusi tanlanganda yuklanadi: kaFan.prep(["at0"]).
 *  Rasmli savollar (yo'l belgisi, chorraha holati) p.r orqali keladi — rasmni kaAvto.img(r) chizadi. */
(function () {
  "use strict";
  var BASE = (function () {
    try { var sc = document.currentScript || document.querySelector('script[src*="ka-fan-avtotest.js"]'); return sc && sc.src ? sc.src.replace(/[^\/]*$/, "") : ""; } catch (e) { return ""; }
  })();
  // avtotest/savollar.js dagi mavzular tartibida (sarlavhalar bank yuklanmasdan oldin ham kerak)
  var MAV = [["umumiy", "Umumiy qoidalar va atamalar"], ["belgilar", "Yo'l belgilari"], ["chiziq", "Yo'l chiziqlari"], ["ishora", "Svetofor va tartibga soluvchi ishoralari"],
    ["manevr", "Harakatni boshlash va manevr"], ["tezlik", "Tezlik, quvib o'tish, oraliq"], ["toxtash", "To'xtash va to'xtab turish"], ["chorraha", "Chorrahalar"],
    ["maxsus", "Piyodalar, bekatlar, temir yo'l, avtomagistral"], ["yoritish", "Yoritish asboblari va signallar"], ["tashish", "Shatakka olish, odam va yuk tashish"],
    ["texnik", "Texnik holat va jihozlar"], ["tibbiy", "Birinchi tibbiy yordam"]];
  var TOPICS = [["at0", "Avtotest · Barcha mavzular (aralash)"]].concat(MAV.map(function (m, i) { return ["at" + (i + 1), "Avtotest · " + m[1]]; }));
  function isAt(id) { return /^at\d+$/.test(id); }

  /* ---------- fayllarni kerak bo'lganda yuklash (ketma-ket: katalog → belgilar → sahna → savollar) ---------- */
  var IMG_FILES = ["avtotest/belgilar-katalog.js", "avtotest/belgilar.js", "avtotest/sahna.js"], BANK = "avtotest/savollar.js";
  var LOADED = {};
  function addJs(src) {
    if (LOADED[src]) return LOADED[src];
    LOADED[src] = new Promise(function (ok) { var s = document.createElement("script"); s.src = BASE + src + "?v=20261106a"; s.onload = ok; s.onerror = function () { delete LOADED[src]; ok(); }; document.head.appendChild(s); });
    return LOADED[src];
  }
  function seq(files) { return files.reduce(function (p, f) { return p.then(function () { return addJs(f); }); }, Promise.resolve()); }
  function imgReady() { return window.ATBelgi && window.ATSahna ? Promise.resolve() : seq(IMG_FILES); }
  function load() { return imgReady().then(function () { return window.AT && window.AT.savollar ? null : addJs(BANK); }); }

  /* ---------- rasm: yo'l belgisi yoki chorraha holati (SVG, o'zimiz chizamiz) — o'quvchi telefonida ham kerak ---------- */
  if (!document.getElementById("ka-atimg-css")) {
    var st = document.createElement("style"); st.id = "ka-atimg-css";
    st.textContent = ".atimg{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:.35em;margin:0 auto .3em;padding:.25em .45em;border-radius:.35em;background:#e9edf3;width:-webkit-max-content;width:max-content;max-width:100%;box-sizing:border-box}" +
      ".atimg svg{display:block;height:5em;width:auto;max-width:100%}.atimg svg.plate{height:3.4em}" +
      ".atimg.sc{background:#cfd6c4;padding:0;overflow:hidden}.atimg.sc svg{height:9em}";
    (document.head || document.documentElement).appendChild(st);
  }
  function img(r) {
    if (!r || !window.ATBelgi || (r.sahna && !window.ATSahna)) return "";
    var h = "";
    try {
      if (r.b) (Array.isArray(r.b) ? r.b : [r.b]).forEach(function (c) { h += window.ATBelgi.svg(c) || ""; });
      if (r.sahna) h += window.ATSahna.svg(r.sahna) || "";
    } catch (e) { return ""; }
    return h ? '<span class="atimg' + (r.sahna ? " sc" : "") + '" role="img" aria-label="Rasm">' + h + "</span>" : "";
  }
  window.kaAvto = { topics: TOPICS, isAt: isAt, load: load, imgReady: imgReady, img: img };

  /* ---------- generatorlar (kaSavol bor sahifalarda) ---------- */
  var S = window.kaSavol; if (!S) return;
  var REC = {}; // har mavzu bo'yicha yaqinda berilgan savollar — takrorlanmasin
  function gen(id, key) {
    return function () {
      var A = window.AT;
      if (!A || !A.savollar) throw new Error("Avtotest savollari hali yuklanmadi");
      var pool = key ? A.savollar.filter(function (x) { return x.m === key; }) : A.savollar;
      var rec = REC[id] || (REC[id] = []), fresh = pool.filter(function (x) { return rec.indexOf(x.id) < 0; });
      var x = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh : pool).length)];
      rec.push(x.id); if (rec.length > Math.max(3, Math.floor(pool.length * 0.75))) rec.shift();
      return {
        q: x.s, a: x.v[x.j], w: x.v.filter(function (_, i) { return i !== x.j; }),
        steps: [x.i].concat(x.e ? ["💡 " + x.e] : []), r: x.r || null, atid: x.id, lang: "uz"
      };
    };
  }
  S.register("at0", gen("at0", null), TOPICS[0][1]);
  MAV.forEach(function (m, i) { S.register("at" + (i + 1), gen("at" + (i + 1), m[0]), TOPICS[i + 1][1]); });

  /* ---------- kaFan.prep: avtotest mavzusi tanlansa bankni ham yuklaydi ---------- */
  var F = window.kaFan;
  if (F && F.prep) {
    // faqat prep kengaytiriladi (need emas: aks holda fayllar ketma-ketsiz, ikki marta yuklanardi)
    if (!F.__at) { var prep0 = F.prep; F.prep = function (ids) { var ps = [prep0.call(F, ids)]; if ((ids || []).some(isAt)) ps.push(load()); return Promise.all(ps); }; F.__at = 1; }
  } else window.kaFan = { need: function () { return []; }, prep: function (ids) { return (ids || []).some(isAt) ? load() : Promise.resolve(); }, __at: 1 };

})();
