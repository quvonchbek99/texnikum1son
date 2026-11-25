/*!
 * Kuvonch Academy — 🔌 Bo'limlar → viktorina avtomatik ulagichi (ka-bolimlar.js)
 *
 * Saytdagi alohida fan bo'limlari («Ibrohim tarix», «10-sinf tarbiya», «Umida huquq» …) savollarini
 * viktorina va barcha sinf o'yinlariga (Arqon, Kartalar, Sirli kataklar, Shoh savol, Oltin sandiq, Mol ur,
 * Moslashtir, Omad g'ildiragi) o'zi ulaydi: har bo'lim — alohida fan tugmasi, har mavzu (§) — alohida mavzu.
 *
 * ➕ YANGI FAN QO'SHISH — faqat MANIFEST ga bitta qator:
 *   k     — fan kaliti (faqat kichik lotin harflari): viktorina.html?fan=<k>
 *   nom   — fan tugmasi nomi (emoji bilan)
 *   guruh — mavzular ro'yxatidagi sarlavha
 *   p     — mavzu ID prefiksi (2 harf, boshqa fanlarnikiga o'xshamasin): mavzu ID = p + bo'lim ichidagi id
 *   g     — data fayllari to'ldiradigan global massiv nomi (IT_DATA, T10 …)
 *   f     — data fayllari (tartib bilan)
 *   img   — qisqa rasm nomi uchun papka ("t10-img/" → img:"p9a" = t10-img/p9a.jpg); to'liq yo'l bo'lsa o'zi ishlatiladi
 *   sahifa — bo'lim sahifasi
 * Keyin `node tools/bolimlar.js` (yoki GitHub Actions «Bo'limlar → viktorina» o'zi) INDEX ni yangilaydi.
 *
 * Data formati (har bo'lim): {id, n:"1-§", t:"Mavzu nomi", q:[ savollar ]}
 *   {t:"m",  q, a:[to'g'ri, xato, xato, xato], e:"izoh", img?}   — variantli
 *   {t:"tf", q, a:true|false, e}                                   — to'g'ri/noto'g'ri
 *   {t:"o",  q, a:[to'g'ri tartibda…], e}                          — tartiblash → variantli savolga aylanadi
 *   {t:"f",  q, e}                                                 — ochiq (og'zaki) savol: viktorinaga qo'shilmaydi
 * Savollar ma'lumoti faqat kerak bo'lganda (mavzu tanlanib, savollar tayyorlanayotganda) yuklanadi. ES5.
 */
(function () {
  "use strict";
  if (window.KA_BOLIM) return;

  var MANIFEST = /*MANIFEST*/[
    {"k": "ibrohim", "nom": "📜 Ibrohim tarix", "guruh": "📜 Ibrohim tarix — 6-sinf «Qadimgi dunyo tarixi» + umumiy bilim", "p": "it", "g": "IT_DATA", "f": ["ibrohim-tarix-1.js", "ibrohim-tarix-2.js", "ibrohim-tarix-3.js", "ibrohim-tarix-4.js", "ibrohim-tarix-bilim.js"], "img": "it-img/", "sahifa": "ibrohim-tarix.html"},
    {"k": "sinftarbiya", "nom": "🤝 10-sinf tarbiya", "guruh": "🤝 10-sinf Tarbiya — «Baxt va muvaffaqiyat sirlari»", "p": "tv", "g": "T10", "f": ["tarbiya-10-1.js", "tarbiya-10-2.js"], "img": "t10-img/", "sahifa": "tarbiya-10.html"},
    {"k": "umidahuquq", "nom": "⚖️ Umida huquq", "guruh": "⚖️ Umida huquq — 8-sinf «Davlat va huquq asoslari»", "p": "uh", "g": "T10", "f": ["umida-huquq-1.js", "umida-huquq-2.js"], "img": "uh-img/", "sahifa": "umida-huquq.html"}
  ]/*MANIFEST-END*/;

  // AVTOMATIK — tools/bolimlar.js yozadi (qo'lda tahrirlamang): {k: [[mavzuId, nom, savollarSoni], …]}
  var INDEX = /*INDEX*/{
    "ibrohim": [
      ["itp1","Ibrohim tarix · 1-§ Qadimgi tarix ildizlari",8],
      ["itp2","Ibrohim tarix · 2-§ Eng qadimgi odamlarning rivojlanish bosqichlari",9],
      ["itp3","Ibrohim tarix · 3-§ Urug‘chilik jamiyati",9],
      ["itp4","Ibrohim tarix · 4-§ Eneolit va bronza davri",9],
      ["itp5","Ibrohim tarix · 5-§ O‘rta Osiyo temir asriga o‘tish davrida",8],
      ["itp6","Ibrohim tarix · 6-§ Nil vodiysi va uning aholisi",8],
      ["itp7","Ibrohim tarix · 7-§ Qadimgi Misr va qo‘shni davlatlar",7],
      ["itp8","Ibrohim tarix · 8-§ Qadimgi Misrda din",7],
      ["itp9","Ibrohim tarix · 9-§ Piramidalar va daxmalar",9],
      ["itp10","Ibrohim tarix · 10-§ Qadimgi Misr madaniyati",9],
      ["itp11","Ibrohim tarix · 11-§ Mesopotamiya sivilizatsiyalari",9],
      ["itp12","Ibrohim tarix · 12-§ Bobil podsholigi",8],
      ["itp13","Ibrohim tarix · 13-§ Old Osiyo davlatlari",8],
      ["itp14","Ibrohim tarix · 14-§ Ahamoniylar davlati",8],
      ["itp15","Ibrohim tarix · 15-§ Qadimgi Hindistondagi ilk sivilizatsiya",8],
      ["itp16","Ibrohim tarix · 16-§ Qadimgi Hindiston madaniyati",8],
      ["itp17","Ibrohim tarix · 17-§ Qadimgi Xitoy sivilizatsiyalari",8],
      ["itp18","Ibrohim tarix · 18-§ Miloddan avvalgi III asrda Xitoy",7],
      ["itp19","Ibrohim tarix · 19–20-§ O‘zbekiston hududidagi qadimiy davlatlar",9],
      ["itp21","Ibrohim tarix · 21-§ Zardushtiylik va «Avesto»",8],
      ["itp22","Ibrohim tarix · 22-§ Antik tarixning boshlanishi",7],
      ["itp23","Ibrohim tarix · 23–24-§ Qadimgi Yunonistonning yuksalishi",9],
      ["itp25","Ibrohim tarix · 25-§ Yunon koloniyalari",6],
      ["itp26","Ibrohim tarix · 26-§ Afinada demokratiya",9],
      ["itp27","Ibrohim tarix · 27–28-§ Yunon-fors urushlari. Makedoniyaning Yunonistonni bosib olishi",10],
      ["itp29","Ibrohim tarix · 29-§ Yunon fuqarolari tarbiyasi",8],
      ["itp30","Ibrohim tarix · 30-§ Qadimgi Yunoniston madaniyati",9],
      ["itp31","Ibrohim tarix · 31-§ Qadimgi Yunoniston olimlari va mutafakkirlari",7],
      ["itp32","Ibrohim tarix · 32-§ Qadimgi Yunoniston afsonalari",7],
      ["itp33","Ibrohim tarix · 33–34-§ Ahamoniylarning O‘rta Osiyoga bosqinchilik yurishlari",10],
      ["itp35","Ibrohim tarix · 35–36-§ O‘rta Osiyo aholisining yunon-makedon istilochilariga qarshi kurashi",10],
      ["itp37","Ibrohim tarix · 37-§ Salavkiylar davlati va Yunon-Baqtriya podsholigi",9],
      ["itp38","Ibrohim tarix · 38–39-§ Qadimgi Xorazm",10],
      ["itp40","Ibrohim tarix · 40-§ Qadimgi Qang‘ va Davan davlatlari",10],
      ["itp41","Ibrohim tarix · 41-§ Kushon davlati",9],
      ["itp42","Ibrohim tarix · 42-§ Buyuk ipak yo‘li",8],
      ["itp43","Ibrohim tarix · 43-§ Qadimgi Italiya va uning aholisi",7],
      ["itp44","Ibrohim tarix · 44-§ Rim respublikasi",9],
      ["itp45","Ibrohim tarix · 45-§ Rim respublikasida hayot",9],
      ["itp46","Ibrohim tarix · 46-§ Qullar va gladiatorlar",8],
      ["itp47","Ibrohim tarix · 47-§ Rim respublikasining qulashi",8],
      ["itp48","Ibrohim tarix · 48-§ G‘arbiy Rim imperiyasining tanazzuli va halokati",8],
      ["itp49","Ibrohim tarix · 49–50-§ Qadimgi Rim madaniyati",9],
      ["itb1","Ibrohim tarix · ★ Davlat bayroqlari",43],
      ["itb2","Ibrohim tarix · ★ Poytaxtlar",56],
      ["itb3","Ibrohim tarix · ★ Pul birliklari",47],
      ["itb4","Ibrohim tarix · ★ O‘simliklar vatani",33],
      ["itb5","Ibrohim tarix · ★ Ixtirolar vatani",25],
      ["itb6","Ibrohim tarix · ★ Eng baland binolar",13],
      ["itb7","Ibrohim tarix · ★ Avtomobillar",30],
      ["itb8","Ibrohim tarix · ★ Ekskavator va texnikalar",24],
      ["itb9","Ibrohim tarix · ★ Hayvonlar",36],
      ["itb10","Ibrohim tarix · ★ Mevalar",19],
      ["itb11","Ibrohim tarix · ★ Poliz ekinlari",11]
    ],
    "sinftarbiya": [
      ["tvm1","10-sinf tarbiya · 1-mavzu Vatan yagona",10],
      ["tvm2","10-sinf tarbiya · 2–3-mavzu Oila – Vatan ichra Vatan",11],
      ["tvm3","10-sinf tarbiya · 4–5-mavzu Oila – baxt qo‘rg‘oni",10],
      ["tvm4","10-sinf tarbiya · 6–7-mavzu Oiladagi burch va mas’uliyat",10],
      ["tvm5","10-sinf tarbiya · 8-mavzu Baxt manzillari",10],
      ["tvm6","10-sinf tarbiya · 9-mavzu Mahalla – qadriyatlar beshigi",10],
      ["tvm7","10-sinf tarbiya · 10-mavzu Jamiyatning ma’naviy asoslari",10],
      ["tvm8","10-sinf tarbiya · 11–12-mavzu Din va madaniyat",11],
      ["tvm9","10-sinf tarbiya · 13–14-mavzu Dunyo dinlarida insonparvarlik g‘oyalari",11],
      ["tvm10","10-sinf tarbiya · 15-mavzu Eng katta meros",10],
      ["tvm11","10-sinf tarbiya · 16–17-mavzu Buzg‘unchi g‘oyalar",10],
      ["tvm12","10-sinf tarbiya · 18–19-mavzu Jaholatga qarshi ma’rifat",10],
      ["tvm13","10-sinf tarbiya · 20-mavzu Xavfsiz media ummoni",10],
      ["tvm14","10-sinf tarbiya · 21-mavzu Soxta xabarlar ortida nima bor?",10],
      ["tvm15","10-sinf tarbiya · 22-mavzu Baxtli hayot poydevori",10],
      ["tvm16","10-sinf tarbiya · 23–24-mavzu Iste’mol va tadbirkorlik madaniyati",10],
      ["tvm17","10-sinf tarbiya · 25–26-mavzu Kasb tanlash sirlari",11],
      ["tvm18","10-sinf tarbiya · 27–28-mavzu O‘rganishdan to‘xtamang",10],
      ["tvm19","10-sinf tarbiya · 29–30-mavzu Iroda",11]
    ],
    "umidahuquq": [
      ["uhd1","Umida huquq · 1–2-dars Shaxs",10],
      ["uhd2","Umida huquq · 3-dars Jamiyat",10],
      ["uhd3","Umida huquq · 4–5-dars Davlat",10],
      ["uhd4","Umida huquq · 6-dars Davlat funksiyasi",9],
      ["uhd5","Umida huquq · 7–8-dars Davlat shakllari",11],
      ["uhd6","Umida huquq · 10-dars Axloq va huquq",10],
      ["uhd7","Umida huquq · 11–12-dars Huquq manbalari",10],
      ["uhd8","Umida huquq · 13-dars Huquq normasi",10],
      ["uhd9","Umida huquq · 14-dars Huquq tarmoqlari",10],
      ["uhd10","Umida huquq · 15-dars Huquqiy munosabatlar",10],
      ["uhd11","Umida huquq · 17–18-dars Huquqiy xulq-atvor",10],
      ["uhd12","Umida huquq · 19–20-dars Huquqbuzarlik",11],
      ["uhd13","Umida huquq · 21–22-dars Yuridik javobgarlik",10],
      ["uhd14","Umida huquq · 23–24-dars Javobgarlik oqibatlari",10],
      ["uhd15","Umida huquq · 27-dars Fuqarolik qonunchiligida voyaga yetmaganlar",10],
      ["uhd16","Umida huquq · 28-dars Jinoyat qonunchiligida voyaga yetmaganlar",10],
      ["uhd17","Umida huquq · 29–30-dars Voyaga yetmaganlarning javobgarligi",10],
      ["uhd18","Umida huquq · 31–32-dars Oila qonunchiligida voyaga yetmaganlar",10],
      ["uhd19","Umida huquq · 33-dars Mehnat qonunchiligida voyaga yetmaganlar",11]
    ]
  }/*INDEX-END*/;

  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var V = "?v=20261125a";
  var BY_ID = {}, SEC = {};
  MANIFEST.forEach(function (m) { SEC[m.k] = m; (INDEX[m.k] || []).forEach(function (t) { BY_ID[t[0]] = m.k; }); });

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---- katalogga qo'shish: TOPICS [[id, nom, guruh]], GROUPS [nom], FANS [[kalit, nom, [guruhlar]]] ---- */
  function apply(TOPICS, GROUPS, FANS) {
    if (!TOPICS || TOPICS.__kaBolim) return;
    TOPICS.__kaBolim = 1;
    MANIFEST.forEach(function (m) {
      var list = INDEX[m.k]; if (!list || !list.length) return;
      var gi = GROUPS.length; GROUPS.push(m.guruh || m.nom);
      FANS.push([m.k, m.nom, [gi]]);
      list.forEach(function (t) { TOPICS.push([t[0], t[1], gi]); });
    });
  }

  /* ---- savolni viktorina formatiga: {q, a, w, steps, r} ---- */
  function imgOf(m, s) {
    if (!s) return null; s = String(s);
    if (/^https:\/\//.test(s) || s.indexOf("/") > -1) return s;
    return (m.img || "") + s + (/\.(png|jpe?g|webp|svg)$/i.test(s) ? "" : ".jpg");
  }
  function perms(a) { // to'g'ri tartibdan farqli 3 ta tartib
    var key = a.join("¦"), out = [], seen = {}; seen[key] = 1;
    function add(b) { var k = b.join("¦"); if (!seen[k]) { seen[k] = 1; out.push(b); } }
    for (var i = 0; i + 1 < a.length && out.length < 2; i++) { var b = a.slice(); b[i] = a[i + 1]; b[i + 1] = a[i]; add(b); }
    add(a.slice().reverse());
    for (var t = 0; t < 30 && out.length < 3; t++) add(shuffle(a));
    return out.slice(0, 3);
  }
  function conv(m, x) {
    if (!x || !x.q) return null;
    var r = imgOf(m, x.img), st = x.e ? [esc(x.e)] : [];
    if (x.t === "m" && x.a && x.a.length >= 2) return { q: esc(x.q), a: esc(x.a[0]), w: x.a.slice(1).map(esc), steps: st, r: r };
    if (x.t === "tf" && typeof x.a === "boolean") { var o = ["✅ To'g'ri", "❌ Noto'g'ri"]; return { q: esc(x.q), a: x.a ? o[0] : o[1], w: [x.a ? o[1] : o[0]], steps: st, r: r }; }
    if (x.t === "o" && x.a && x.a.length >= 3) return { q: esc(x.q) + "<br><small>To'g'ri tartibni tanlang</small>", a: x.a.map(esc).join(" → "), w: perms(x.a).map(function (b) { return b.map(esc).join(" → "); }), steps: st, r: r };
    return null; // "f" — ochiq savol
  }
  // savollar soni (tools/bolimlar.js ham shuni ishlatadi)
  function count(m, it) { return (it.q || []).filter(function (x) { return !!conv(m, x); }).length; }

  /* ---- yuklash va kaSavol ga ro'yxatdan o'tkazish ---- */
  var DATA = {}, loading = {}, regd = {}, chain = Promise.resolve();
  function addJs(src) {
    return new Promise(function (ok) {
      var s = document.createElement("script"); s.src = BASE + src + V;
      s.onload = ok; s.onerror = ok; setTimeout(ok, 15000); document.head.appendChild(s);
    });
  }
  // bo'limlar ketma-ket yuklanadi: ikki bo'lim bitta global (T10) ishlatsa ham aralashmaydi
  function loadSec(k) {
    if (DATA[k]) return Promise.resolve();
    if (loading[k]) return loading[k];
    var m = SEC[k];
    return (loading[k] = chain = chain.then(function () {
      var prev = window[m.g]; window[m.g] = [];
      return m.f.reduce(function (p, f) { return p.then(function () { return addJs(f); }); }, Promise.resolve()).then(function () {
        DATA[k] = window[m.g] || [];
        if (prev === undefined) { try { delete window[m.g]; } catch (e) { window[m.g] = undefined; } } else window[m.g] = prev;
      });
    }));
  }
  function regSec(k) {
    var S = window.kaSavol, m = SEC[k]; if (regd[k] || !S || !S.register || !DATA[k]) return;
    regd[k] = 1;
    var want = {}; (INDEX[k] || []).forEach(function (t) { want[t[0]] = t[1]; });
    DATA[k].forEach(function (it) {
      var id = m.p + it.id; if (!want[id]) return;
      var qs = (it.q || []).filter(function (x) { return !!conv(m, x); }), n = qs.length; if (!n) return;
      // daraja: mavzu ichidagi o'rniga qarab (boshi — oson, oxiri — qiyin); ha/yo'q — oson, tartiblash — qiyin
      var pool = qs.map(function (x, i) { return { x: x, L: x.t === "tf" ? 1 : x.t === "o" ? 3 : 1 + Math.min(2, Math.floor(i * 3 / n)) }; });
      var rec = [];
      S.register(id, function (L) {
        L = L === 2 || L === 3 ? L : 1;
        var cand = [];
        for (var d = 0; d < 3 && !cand.length; d++) cand = pool.filter(function (o) { return Math.abs(o.L - L) === d && rec.indexOf(o) < 0; });
        if (!cand.length) cand = pool.filter(function (o) { return rec.indexOf(o) < 0; });
        if (!cand.length) { rec = []; cand = pool; }
        var o = cand[Math.floor(Math.random() * cand.length)];
        rec.push(o); if (rec.length > Math.min(24, n - 1)) rec.shift();
        return conv(m, o.x);
      }, want[id]);
    });
  }
  // ids berilsa — faqat o'shalar tegishli bo'limlar, berilmasa — hammasi
  function prep(ids) {
    var ks = [];
    if (ids) ids.forEach(function (id) { var k = BY_ID[id]; if (k && ks.indexOf(k) < 0) ks.push(k); });
    else ks = MANIFEST.map(function (m) { return m.k; }).filter(function (k) { return (INDEX[k] || []).length; });
    return Promise.all(ks.map(function (k) { return loadSec(k).then(function () { regSec(k); }); })).catch(function () {});
  }
  function done() { return MANIFEST.every(function (m) { return !(INDEX[m.k] || []).length || regd[m.k]; }); }
  function has(id) { return !!BY_ID[id]; }
  // savol rasmi: faqat saytdagi rasm papkalari va bayroqlar (flagcdn)
  function okImg(r) { return typeof r === "string" && /^(https:\/\/flagcdn\.com\/|[a-z0-9-]+-img\/)[\w\/.-]+\.(png|jpe?g|webp|svg)$/i.test(r); }
  function img(r, cls) { return okImg(r) ? '<img class="' + (cls || "qimg") + '" src="' + (/^https:/.test(r) ? r : BASE + r) + '" alt="Savol rasmi" loading="lazy">' : ""; }

  window.KA_BOLIM = { MANIFEST: MANIFEST, INDEX: INDEX, apply: apply, prep: prep, done: done, has: has, img: img, okImg: okImg, conv: conv, count: count };
})();
