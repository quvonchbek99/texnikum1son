/* Kuvi AI — texnikum1son.uz yordamchisi (kuvonch.uz'dagi Kuvi personaji).
   Ikki rejim: «Maslahatchi» — o'qituvchilarga (TMR, texnologik xarita, dars ishlanma, metodika, nazorat);
               «Javob beruvchi» — o'quvchilarga (fan bo'yicha savollarga sodda tushuntirish).
   Miya: Gemini (Firebase AI Logic, t1Bulut.ai). Yuz: https://kuvonch.uz/ka-kuvi.js (kaYuz), bo'lmasa oddiy belgi. */
(function () {
  "use strict";
  if (window.__t1Kuvi || window.top !== window.self) return; window.__t1Kuvi = 1;
  var KUVI_JS = "https://kuvonch.uz/ka-kuvi.js?v=20261112d";
  var ROOT = document.body.getAttribute("data-root") || "";
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || "null"); sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Sahifa konteksti ---------- */
  var fanEl = document.getElementById("fan");
  var CTX = { fan: "", yn: "", toifa: "", plan: {} };
  if (fanEl) {
    CTX.fan = fanEl.getAttribute("data-fan") || ""; CTX.yn = fanEl.getAttribute("data-yn") || ""; CTX.toifa = fanEl.getAttribute("data-toifa") || "";
    try { CTX.plan = JSON.parse(fanEl.getAttribute("data-plan") || "{}"); } catch (e) {}
  }
  var TOIFA = { kasbiy: "kasbiy (spes) fan", amaliyot: "amaliyot", umumtalim: "umumta’lim fani" };
  function ctxMatn() {
    if (!CTX.fan) return /\/kabinet\//.test(location.pathname)
      ? "Foydalanuvchi o‘qituvchi kabinetida — fan materiallarini (TMR, xarita, ma’ruza, ZIP) yuklamoqda."
      : "Foydalanuvchi fanlar katalogida (kasbiy fanlar mutaxassisliklar bo‘yicha, umumta’lim fanlari hammasi uchun bitta).";
    var p = Object.keys(CTX.plan).map(function (s) { var x = CTX.plan[s] || {}; return s + "-semestr: jami " + x.jami + " soat" + (x.auditoriya ? ", auditoriya ~" + x.auditoriya + " soat (" + Math.round(x.auditoriya / 2) + " juftlik)" : ""); }).join("; ");
    var M = window.t1Majmua || [];
    return "Foydalanuvchi «" + CTX.fan + "» fani sahifasida: " + (TOIFA[CTX.toifa] || "fan") + ", " + CTX.yn + ". O‘quv reja: " + (p || "—") + "." +
      (M.length ? " Bu fan bo‘yicha o‘qituvchi joylagan majmua(lar): " + M.map(function (m) { return "«" + m.nom + "» (" + m.betlar + " bet)"; }).join(", ") + "." : "");
  }

  /* ---------- Majmua matnidan qidiruv (BM25, o'zbekcha qo'shimchalarga chidamli: so'z o'zagi ~6 harf) ---------- */
  var KC = {}, STOP = {};
  "va bilan uchun ham bu shu u ular bir esa yoki agar qanday nima nega qachon qaysi kabi bo‘yicha boyicha dan da ga ni ning lar bo‘ladi boladi deb hamda biz siz men sen ushbu shuning har barcha".split(" ").forEach(function (w) { STOP[w.replace(/[‘’ʻʼ']/g, "")] = 1; });
  function sozlar(t) {
    return String(t || "").toLowerCase().replace(/[‘’ʻʼ`´']/g, "").split(/[^a-zа-яёўқғҳ0-9]+/i)
      .filter(function (w) { return w.length > 2 && !STOP[w]; }).map(function (w) { return w.length > 6 ? w.slice(0, 6) : w; });
  }
  function bolaklar(m) {
    if (!KC[m.id]) KC[m.id] = fetch(m.k).then(function (r) { return r.json(); }).then(function (j) {
      return j.b.map(function (x) { var w = sozlar(x.t), tf = {}; w.forEach(function (s) { tf[s] = (tf[s] || 0) + 1; }); return { b: x.b, t: x.t, m: m, tf: tf, n: w.length }; });
    });
    KC[m.id]["catch"](function () { delete KC[m.id]; });
    return KC[m.id];
  }
  function parchalar(savol) {
    var M = window.t1Majmua || []; if (!M.length) return Promise.resolve(null);
    return Promise.all(M.map(bolaklar)).then(function (ALL) {
      var L = [].concat.apply([], ALL); if (!L.length) return null;
      var q = sozlar(savol).filter(function (w, i, a) { return a.indexOf(w) === i; }), N = L.length, avg = L.reduce(function (a, x) { return a + x.n; }, 0) / N;
      var df = {}; q.forEach(function (w) { df[w] = L.filter(function (x) { return x.tf[w]; }).length; });
      L.forEach(function (x) {
        var sc = 0; q.forEach(function (w) { var f = x.tf[w] || 0; if (!f) return; var idf = Math.log(1 + (N - df[w] + 0.5) / (df[w] + 0.5)); sc += idf * f * 2.2 / (f + 1.2 * (0.25 + 0.75 * x.n / avg)); });
        x.sc = sc;
      });
      var tanlov = [], dm = /(\d{1,3})\s*[-–.]?\s*(mavzu|dars|ma.?ruza|amaliy)/i.exec(savol), mavzuBet = {};
      if (dm) M.forEach(function (m) { (m.qismlar || []).forEach(function (qq) { if (String(qq.dars) === dm[1] && /maruza|amaliy|xarita/.test(qq.turi)) for (var b = qq.bet_bosh; b <= Math.min(qq.bet_oxir, qq.bet_bosh + 3); b++) mavzuBet[m.id + ":" + b] = 1; }); });
      L.forEach(function (x) { if (mavzuBet[x.m.id + ":" + x.b]) x.sc += 6; });
      L.slice().sort(function (a, b) { return b.sc - a.sc; }).some(function (x) { if (x.sc <= 0) return true; tanlov.push(x); return tanlov.reduce(function (a, y) { return a + y.t.length; }, 0) > 9000; });
      if (!tanlov.length) return null;
      tanlov.sort(function (a, b) { return a.m === b.m ? a.b - b.b : 0; });
      return tanlov;
    });
  }
  var BETMAP = {};

  /* ---------- Rejimlar ---------- */
  var MANBA = "Agar xabarda «Majmua parchalari» berilgan bo‘lsa, javobni avvalo shu parchalarga asosla va har asosiy fikrdan keyin manba betini qavs ichida «(12-bet)» ko‘rinishida yoz. Parchalarda javob bo‘lmasa, buni ochiq ayt va umumiy bilim bilan qisqa javob ber. ";
  var UMUMIY = MANBA + "Faqat o‘zbek tilida (lotin yozuvi) yoz. Faktlar, raqamlar, me’yoriy hujjat raqamlari yoki manbalarni to‘qima — aniq bilmasang, ochiq ayt. " +
    "Javobni aynan bitta kayfiyat tegi bilan boshla: [happy], [think], [wow], [love], [wink] yoki [neutral] — teg yuz ifodasini o‘zgartiradi va foydalanuvchiga ko‘rinmaydi.";
  var R = {
    m: { nom: "Maslahatchi", kim: "o‘qituvchilar uchun", salom: "Assalomu alaykum, ustoz! Men Kuvi — o‘quv-uslubiy maslahatchiman. TMR, texnologik xarita, dars ishlanma yoki nazorat savollari kerakmi? Yozing — birga tayyorlaymiz.",
      sys: "Sen — Kuvi, Toshkent tuman 1-son texnikumi fanlar e-bazasining AI maslahatchisisan. Suhbatdoshing — texnikum o‘qituvchisi. " +
        "Unga o‘quv-uslubiy ishlarda amaliy yordam ber: taqvim-mavzu reja (TMR), texnologik xarita, dars ishlanma, ma’ruza rejasi, amaliy va laboratoriya mashg‘ulotlari, mustaqil ta’lim topshiriqlari, oraliq va yakuniy nazorat savollari, baholash mezonlari, interfaol metodlar, o‘quv-uslubiy majmua (O‘UM) tuzilmasi. " +
        "Kasbiy ta’lim (texnikum) amaliyotiga mos yoz: 1 dars = 1 juftlik = 2 akademik soat = 80 daqiqa. Texnologik xaritada bosqichlar va daqiqalarni ko‘rsat (tashkiliy qism, takrorlash, yangi mavzu, mustahkamlash, baholash, uyga vazifa — jami 80 daqiqa). " +
        "Javobing tuzilgan bo‘lsin: qisqa sarlavhalar, ro‘yxatlar, kerak bo‘lsa markdown jadval. Hurmat bilan «ustoz» deb murojaat qil. " + UMUMIY,
      tez: ["TMR loyihasini tuzib ber", "1-dars uchun texnologik xarita", "80 daqiqalik dars ishlanma", "Oraliq nazorat uchun 10 ta test", "Mavzuga mos interfaol metod"] },
    j: { nom: "Javob beruvchi", kim: "o‘quvchilar uchun", salom: "Salom! Men Kuvi 🙂 Fan bo‘yicha nima tushunarsiz bo‘lsa, so‘rang — sodda qilib tushuntiraman.",
      sys: "Sen — Kuvi, texnikum o‘quvchilarining fanlar bo‘yicha savollariga javob beradigan mehribon AI ustozsan. " +
        "Sodda tilda, qisqa (odatda 3–8 gap) tushuntir, hayotiy yoki kasbga oid misol keltir. Atama yoki formula bo‘lsa, ma’nosini ayt. " +
        "Oxirida tushunganini tekshirish uchun bitta qisqa savol ber. Test yoki nazorat javoblarini shunchaki aytib berma — yechish yo‘lini tushuntir. " + UMUMIY,
      tez: ["Bu fan nima haqida?", "Asosiy atamalarni tushuntir", "Oddiy misol bilan tushuntir", "Meni 3 ta savol bilan tekshir"] }
  };
  var rejim = ls("t1.kuvi.r") || (/\/(kabinet|admin)\//.test(location.pathname) ? "m" : "j");
  if (!R[rejim]) rejim = "j";
  var KEY = function () { return "t1.kuvi.h." + rejim + "." + (CTX.fan || "umumiy"); };

  /* ---------- Yuz ---------- */
  function yuz(m, cls) {
    if (window.kaYuz) { try { return kaYuz.svg(m || "neutral", "kuvi " + (cls || "")); } catch (e) {} }
    return '<svg class="kuvi kv-oddiy ' + (cls || "") + '" viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="38" rx="19" fill="#22c55e"/><circle cx="24" cy="31" r="4.5" fill="#fff"/><circle cx="40" cy="31" r="4.5" fill="#fff"/><circle cx="25" cy="32" r="2.2" fill="#1d2230"/><circle cx="41" cy="32" r="2.2" fill="#1d2230"/><path d="M25 41q7 5 14 0" stroke="#1d2230" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  }

  /* ---------- Yengil markdown ---------- */
  function inl(t) {
    return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[\s(])\*(?!\s)(.+?)\*(?=[\s).,!?:;]|$)/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function md(s) {
    var L = String(s || "").replace(/\r/g, "").split("\n"), out = [], i = 0;
    while (i < L.length) {
      var l = L[i];
      if (/^\s*\|.*\|\s*$/.test(l) && i + 1 < L.length && /^\s*\|?\s*:?-{2,}/.test(L[i + 1])) {
        var row = function (x) { return x.trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); }); };
        var h = row(l), body = []; i += 2;
        while (i < L.length && /^\s*\|.*\|\s*$/.test(L[i])) { body.push(row(L[i])); i++; }
        out.push('<div class="tbl-w"><table><thead><tr>' + h.map(function (c) { return "<th>" + inl(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          body.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inl(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
        continue;
      }
      var m;
      if ((m = /^\s*#{1,4}\s+(.*)$/.exec(l))) { out.push("<h4>" + inl(m[1]) + "</h4>"); i++; continue; }
      if (/^\s*([-*•]|\d+[.)])\s+/.test(l)) {
        var ol = /^\s*\d/.test(l), items = [];
        while (i < L.length && /^\s*([-*•]|\d+[.)])\s+/.test(L[i])) { items.push("<li>" + inl(L[i].replace(/^\s*([-*•]|\d+[.)])\s+/, "")) + "</li>"); i++; }
        out.push((ol ? "<ol>" : "<ul>") + items.join("") + (ol ? "</ol>" : "</ul>")); continue;
      }
      if (!l.trim()) { i++; continue; }
      var p = [];
      while (i < L.length && L[i].trim() && !/^\s*(#{1,4}\s|[-*•]\s|\d+[.)]\s|\|)/.test(L[i])) { p.push(inl(L[i])); i++; }
      if (p.length) out.push("<p>" + p.join("<br>") + "</p>"); else { out.push("<p>" + inl(l) + "</p>"); i++; }
    }
    return out.join("");
  }
  function betlar(h) {
    if (!(window.t1Majmua || []).length) return h;
    return h.replace(/(\d{1,4})\s*[-–]\s*bet(lar)?\b/g, function (a, n) { return '<a href="#" class="kv-bet" data-bet="' + n + '">' + a + "</a>"; });
  }
  var MOODS = /^\s*\[(neutral|happy|love|think|strict|jealous|sad|wow|laugh|cry|shy|wink|sleepy)\]\s*/i;
  function tegsiz(t) { var m = MOODS.exec(t || ""); return { mood: m ? m[1].toLowerCase() : "neutral", t: String(t || "").replace(MOODS, "").replace(/\[(neutral|happy|love|think|wow|wink|laugh|sad|shy)\]/gi, "") }; }

  /* ---------- Interfeys ---------- */
  var fab, pan, log, ta, tez, ctxEl, face, ovoz = ls("t1.kuvi.ovoz") === "1", band = false;
  function boot() {
    fab = document.createElement("button"); fab.type = "button"; fab.className = "kv-fab"; fab.setAttribute("aria-label", "Kuvi AI — yordamchi"); fab.title = "Kuvi AI — maslahatchi va javob beruvchi";
    fab.innerHTML = yuz("happy") + '<span class="kv-fab-l">Kuvi AI</span>';
    document.body.appendChild(fab);
    fab.addEventListener("click", function () { pan && !pan.hidden ? yop() : och(); });
    var kun = new Date().toISOString().slice(0, 10);
    if (ls("t1.kuvi.tip") !== kun) {
      var tip = document.createElement("div"); tip.className = "kv-tip";
      tip.textContent = CTX.fan ? "«" + CTX.fan + "» bo‘yicha savol bormi? Menga yozing!" : "Salom! Men Kuvi — AI maslahatchi. Savolingiz bormi?";
      document.body.appendChild(tip); ls("t1.kuvi.tip", kun);
      setTimeout(function () { tip.style.opacity = "0"; setTimeout(function () { tip.remove(); }, 500); }, 6500);
      tip.addEventListener("click", function () { tip.remove(); och(); });
    }
  }
  function qur() {
    pan = document.createElement("section"); pan.className = "kv-pan"; pan.hidden = true;
    pan.setAttribute("role", "dialog"); pan.setAttribute("aria-label", "Kuvi AI");
    var voice = "https://kuvonch.uz/ai-ustoz.html?rejim=free&sinf=t1" + (CTX.fan ? "&mavzu=" + encodeURIComponent(CTX.fan) : "");
    pan.innerHTML =
      '<header class="kv-h"><span class="kv-face"></span><div><b>Kuvi AI</b><small>texnikum1son.uz yordamchisi</small></div><button type="button" class="kv-x" aria-label="Yopish">✕</button></header>' +
      '<div class="kv-seg" role="tablist">' + ["m", "j"].map(function (k) { return '<button type="button" role="tab" data-r="' + k + '"><b>' + R[k].nom + "</b><small>" + R[k].kim + "</small></button>"; }).join("") + "</div>" +
      '<div class="kv-ctx"></div><div class="kv-log" aria-live="polite"></div><div class="kv-tez"></div>' +
      '<form class="kv-in"><label class="sr" for="kv-ta">Savol</label><textarea id="kv-ta" rows="1" placeholder="Savolingizni yozing…" maxlength="2000"></textarea><button class="btn" aria-label="Yuborish"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>' +
      '<div class="kv-f"><button type="button" class="kv-l" data-ovoz></button><button type="button" class="kv-l" data-toz>Suhbatni tozalash</button><a class="kv-l" target="_blank" rel="noopener" href="' + esc(voice) + '">Ovozli Kuvi ↗</a></div>';
    document.body.appendChild(pan);
    log = pan.querySelector(".kv-log"); ta = pan.querySelector("textarea"); tez = pan.querySelector(".kv-tez"); ctxEl = pan.querySelector(".kv-ctx"); face = pan.querySelector(".kv-face");
    pan.querySelector(".kv-x").addEventListener("click", yop);
    log.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-bet]"); if (!a) return;
      e.preventDefault();
      var n = +a.getAttribute("data-bet"), m = BETMAP[n] || (window.t1Majmua || [])[0];
      if (m && window.t1PDF) t1PDF.och(m.pdf, { bet: n, sarlavha: m.nom, nom: m.nom });
    });
    Array.prototype.forEach.call(pan.querySelectorAll(".kv-seg button"), function (b) { b.addEventListener("click", function () { rejim = b.getAttribute("data-r"); ls("t1.kuvi.r", rejim); chiz(); ta.focus(); }); });
    pan.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); yubor(ta.value); });
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); yubor(ta.value); } });
    ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; });
    pan.querySelector("[data-toz]").addEventListener("click", function () { ss(KEY(), []); chiz(); });
    var ob = pan.querySelector("[data-ovoz]");
    function ovozTxt() { ob.textContent = "O‘qib berish: " + (ovoz ? "yoqiq" : "o‘chiq"); }
    ob.addEventListener("click", function () { ovoz = !ovoz; ls("t1.kuvi.ovoz", ovoz ? "1" : "0"); ovozTxt(); if (!ovoz) try { speechSynthesis.cancel(); } catch (e) {} });
    ovozTxt();
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && pan && !pan.hidden) yop(); });
  }
  function och() { if (!pan) qur(); pan.hidden = false; document.documentElement.classList.add("kv-ochiq"); chiz(); setTimeout(function () { ta.focus(); }, 60); }
  function yop() { if (!pan) return; pan.hidden = true; document.documentElement.classList.remove("kv-ochiq"); try { speechSynthesis.cancel(); } catch (e) {} fab.focus(); }
  function setFace(m) { if (face) face.innerHTML = yuz(m || "neutral"); }
  function chiz() {
    Array.prototype.forEach.call(pan.querySelectorAll(".kv-seg button"), function (b) { b.setAttribute("aria-selected", b.getAttribute("data-r") === rejim ? "true" : "false"); });
    var MJ = window.t1Majmua || [];
    ctxEl.innerHTML = CTX.fan ? "Fan: <b>" + esc(CTX.fan) + "</b> · " + esc(CTX.yn) + (MJ.length ? " · majmua: " + MJ.map(function (m) { return m.betlar + " bet"; }).join(", ") : "") : (rejim === "m" ? "Istalgan fan bo‘yicha o‘quv-uslubiy savol bering" : "Istalgan fan bo‘yicha savol bering");
    var H = ss(KEY()) || [];
    log.innerHTML = '<div class="kv-m k">' + md(R[rejim].salom) + "</div>" + H.map(function (x) { return '<div class="kv-m ' + x.r + '">' + (x.r === "k" ? betlar(md(x.t)) : esc(x.t).replace(/\n/g, "<br>")) + "</div>"; }).join("");
    var MT = (window.t1Majmua || []).length ? (rejim === "m" ? ["Majmua asosida 10 ta test tuz", "1-mavzuning texnologik xaritasini tahlil qil"] : ["1-mavzuni qisqacha tushuntir", "Majmuadagi asosiy atamalar"]) : [];
    tez.innerHTML = MT.concat(R[rejim].tez).map(function (t) { return '<button type="button">' + esc(t) + "</button>"; }).join("");
    Array.prototype.forEach.call(tez.querySelectorAll("button"), function (b) { b.addEventListener("click", function () { yubor(b.textContent); }); });
    tez.hidden = H.length > 0;
    setFace(H.length ? (H[H.length - 1].m || "neutral") : "happy");
    log.scrollTop = log.scrollHeight;
  }
  function yubor(t) {
    t = String(t || "").trim(); if (!t || band) return;
    var H = ss(KEY()) || []; H.push({ r: "u", t: t }); ss(KEY(), H.slice(-24));
    ta.value = ""; ta.style.height = "auto"; tez.hidden = true;
    log.insertAdjacentHTML("beforeend", '<div class="kv-m u">' + esc(t).replace(/\n/g, "<br>") + '</div><div class="kv-m k kv-w"><span></span><span></span><span></span></div>');
    log.scrollTop = log.scrollHeight; setFace("think"); band = true;
    var tarix = H.slice(-9, -1).map(function (x) { return (x.r === "u" ? (rejim === "m" ? "O‘qituvchi" : "O‘quvchi") : "Kuvi") + ": " + x.t; }).join("\n\n");
    var ai = parchalar(t + " " + (H.length > 2 ? H[H.length - 3].t : ""))["catch"](function () { return null; }).then(function (P) {
      var pr = "";
      if (P) {
        BETMAP = {};
        pr = "\n\nMajmua parchalari (o‘qituvchi joylagan majmuadan, bet raqamlari bilan):\n" + P.map(function (x) { BETMAP[x.b] = BETMAP[x.b] || x.m; return "[" + x.b + "-bet] " + x.t.replace(/\s+/g, " ").trim(); }).join("\n");
      }
      var prompt = "Kontekst: " + ctxMatn() + (tarix ? "\n\nOldingi suhbat:\n" + tarix : "") + pr + "\n\nYangi xabar: " + t;
      return window.t1Bulut ? t1Bulut.ai(prompt, { sys: R[rejim].sys }) : Promise.reject(new Error("bulut moduli yuklanmadi"));
    });
    ai.then(function (javob) {
      var x = tegsiz(javob); H = ss(KEY()) || []; H.push({ r: "k", t: x.t.trim(), m: x.mood }); ss(KEY(), H.slice(-24));
      var w = log.querySelector(".kv-w"); if (w) w.outerHTML = '<div class="kv-m k">' + betlar(md(x.t)) + "</div>";
      setFace(x.mood); gapir(x.t);
    })["catch"](function (e) {
      var w = log.querySelector(".kv-w"), m = window.t1Bulut ? t1Bulut.uzXato(e) : String(e && e.message || e);
      if (w) w.outerHTML = '<div class="kv-m k kv-err">Kuvi hozir javob bera olmadi: ' + esc(m) + ". Birozdan keyin qayta urinib ko‘ring yoki «Ovozli Kuvi» orqali so‘rang.</div>";
      setFace("sad"); try { console.warn("[Kuvi]", e); } catch (x) {}
    }).then(function () { band = false; log.scrollTop = log.scrollHeight; });
  }
  function gapir(t) {
    if (!ovoz || !window.speechSynthesis) return;
    try {
      var v = speechSynthesis.getVoices().filter(function (x) { return /^uz/i.test(x.lang); })[0];
      if (!v) { log.insertAdjacentHTML("beforeend", '<div class="kv-m k kv-err">Bu qurilmada o‘zbekcha ovoz topilmadi — to‘liq ovozli suhbat uchun «Ovozli Kuvi»ni oching.</div>'); ovoz = false; ls("t1.kuvi.ovoz", "0"); pan.querySelector("[data-ovoz]").textContent = "O‘qib berish: o‘chiq"; return; }
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(t.replace(/[*#|`_>-]+/g, " ").slice(0, 1500)); u.voice = v; u.lang = v.lang; speechSynthesis.speak(u);
    } catch (e) {}
  }

  document.addEventListener("t1-majmua", function () { if (pan && !pan.hidden) chiz(); });
  function go() {
    if (window.kaYuz) return boot();
    var s = document.createElement("script"); s.src = KUVI_JS; s.async = true;
    var tm = setTimeout(function () { if (!fab) boot(); }, 3500);
    s.onload = function () { clearTimeout(tm); if (!fab) boot(); else fab.innerHTML = yuz("happy") + '<span class="kv-fab-l">Kuvi AI</span>'; };
    s.onerror = function () { clearTimeout(tm); if (!fab) boot(); };
    document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
