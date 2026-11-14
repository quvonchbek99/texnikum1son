/*!
 * Kuvonch Academy — ☕ Buy me a coffee band + HOMIYLAR REYTINGI
 *  - Har sahifaning oxirida (footer oldidan) doimiy "Buy me a coffee" bandi
 *  - Havola/pul bilan qo'llab-quvvatlaganlar reytingi (donat.html va bosh sahifada)
 *  Ulash: <script src="homiylar.js"></script>  (ka-effektlar.js yuklanadigan sahifalarda avtomatik)
 *
 *  ======================= HOMIYLARNI SHU YERGA YOZING =======================
 *  ism      — ko'rsatiladigan ism (yoki nik)
 *  summa    — so'mda (0 bo'lsa — faqat havola/ulashish bilan yordam bergan)
 *  havola   — ixtiyoriy: Instagram/Telegram/sayt havolasi (bosilsa ochiladi)
 *  xabar    — ixtiyoriy: qisqa fikri
 *  sana     — "2026-10-17" ko'rinishida
 *  oila     — true bo'lsa: ro'yxat tepasida ❤️ bilan alohida turadi (medal, jami summa va "Top homiylar"ga kirmaydi)
 *  matn     — ixtiyoriy: summa o'rnida ko'rsatiladigan yozuv (masalan "♾ cheksiz")
 *  Reyting avtomatik: summa bo'yicha, teng bo'lsa — sanasi bo'yicha.
 *  ===========================================================================
 */
window.HOMIYLAR = [
  { ism: "My mom", oila: true, matn: "444 mln so'm", xabar: "Cheksiz mehr" },
  { ism: "My dad", oila: true, matn: "♾ cheksiz", xabar: "Cheksiz mehr va boylik — 2012-yil 12-aprelgacha" },
  // { ism: "Aliyev Vali", summa: 50000, havola: "https://instagram.com/…", xabar: "Zo'r loyiha!", sana: "2026-10-17" },
  // { ism: "@matematik_uz", summa: 0, havola: "https://t.me/…", xabar: "Kanalda ulashdim", sana: "2026-10-16" },
  { ism: "Hamroyev Ibrohim", summa: 100000, sana: "2026-11-10" },
  { ism: "Islomov Oybek", summa: 400000, sana: "2026-11-10" },
];

(function () {
  "use strict";
  if (window.__kaHomiy) return; window.__kaHomiy = true;
  var H = (window.HOMIYLAR || []).filter(function (h) { return h && h.ism; });
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function oila() { return H.filter(function (h) { return h.oila; }); }
  function rank() { return H.filter(function (h) { return !h.oila; }).sort(function (a, b) { return (b.summa || 0) - (a.summa || 0) || String(b.sana || "").localeCompare(String(a.sana || "")); }); }
  function kofe(s) { return s >= 10000 ? "☕".repeat(Math.min(5, Math.round(s / 50000) || 1)) : "🔗"; }
  function daraja(s) { return s >= 500000 ? "💎 Oltin homiy" : s >= 150000 ? "🥇 Katta homiy" : s >= 50000 ? "🥈 Homiy" : s > 0 ? "🥉 Do'st" : "🔗 Ulashgan"; }

  var css = document.createElement("style");
  css.textContent = [
    ".bmc-band{margin:40px auto 0;max-width:1080px;padding:0 16px}",
    ".bmc-card{position:relative;overflow:hidden;border-radius:22px;padding:26px 24px;background:linear-gradient(135deg,#1d3b6e 0%,#0f6b5c 60%,#13213f 100%);border:1px solid #3a5a9a;box-shadow:0 18px 48px rgba(0,0,0,.45);display:flex;gap:18px;align-items:center;flex-wrap:wrap;color:#eef2ff}",
    ".bmc-card::before{content:'☕';position:absolute;right:-10px;top:-30px;font-size:170px;opacity:.07;transform:rotate(-12deg)}",
    ".bmc-cup{font-size:54px;line-height:1;animation:bmcfloat 3s ease-in-out infinite}",
    "@keyframes bmcfloat{50%{transform:translateY(-6px) rotate(-6deg)}}",
    ".bmc-txt{flex:1 1 260px}",
    ".bmc-txt b{display:block;font-size:22px;margin-bottom:4px}",
    ".bmc-txt span{color:#c9d4ff;font-size:14px}",
    ".bmc-btn{display:inline-flex;align-items:center;gap:8px;background:#ffd479;color:#2a1b00;text-decoration:none;font:800 16px/1 inherit;padding:14px 22px;border-radius:999px;box-shadow:0 8px 24px rgba(255,212,121,.35);transition:transform .2s}",
    ".bmc-btn:hover{transform:translateY(-2px) scale(1.03)}",
    ".bmc-sub{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}",
    ".bmc-sub a{font-size:13px;color:#eef2ff;text-decoration:none;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:6px 10px}",
    ".bmc-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px;font-size:13px;color:#c9d4ff}",
    ".bmc-top i{font-style:normal;background:rgba(255,255,255,.12);border-radius:999px;padding:5px 10px;color:#fff;font-weight:700}",
    /* reyting */
    ".hm-wrap{margin:16px 0}",
    ".hm-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px}",
    ".hm-head h3{margin:0;font-size:20px;color:#eef2ff}",
    ".hm-head small{color:#9fb0d0}",
    ".hm-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}",
    ".hm-row{display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:center;background:#0e1628;border:1px solid #243252;border-radius:14px;padding:12px 14px;color:#eef2ff;transition:transform .2s,border-color .2s}",
    ".hm-row:hover{transform:translateX(4px);border-color:#5ee6c7}",
    ".hm-row.top1{background:linear-gradient(135deg,rgba(255,212,121,.18),#0e1628);border-color:#ffd479}",
    ".hm-row.oila{background:linear-gradient(135deg,rgba(255,122,154,.20),#0e1628);border-color:#ff7a9a}",
    ".oila .hm-n{background:#ff7a9a;color:#fff;font-size:20px}.oila .hm-amt{color:#ffb3c4}",
    ".hm-row.top2{border-color:#c0c7d6}.hm-row.top3{border-color:#d08a4a}",
    ".hm-n{width:44px;height:44px;border-radius:50%;background:#1a2540;display:flex;align-items:center;justify-content:center;font:900 16px/1 inherit;color:#9fb0d0}",
    ".top1 .hm-n{background:#ffd479;color:#2a1b00;font-size:22px}.top2 .hm-n{background:#c0c7d6;color:#111}.top3 .hm-n{background:#d08a4a;color:#fff}",
    ".hm-who b{display:block;font-size:16px}",
    ".hm-who a{color:#7c9bff;text-decoration:none;font-size:13px}",
    ".hm-who small{display:block;color:#9fb0d0;font-size:12.5px;margin-top:2px}",
    ".hm-amt{text-align:right;font:800 15px/1.3 inherit;color:#5ee6c7;white-space:nowrap}",
    ".hm-amt small{display:block;color:#9fb0d0;font-weight:600;font-size:11.5px}",
    ".hm-empty{border:1px dashed #3a5a9a;border-radius:14px;padding:18px;text-align:center;color:#9fb0d0;font-size:14px}",
    ".hm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:0 0 12px}",
    ".hm-stats div{background:#0e1628;border:1px solid #243252;border-radius:12px;padding:10px;text-align:center}",
    ".hm-stats b{display:block;font-size:20px;color:#ffd479}.hm-stats small{color:#9fb0d0;font-size:12px}",
    "@media(max-width:480px){.bmc-card{padding:20px 16px}.bmc-cup{font-size:42px}.hm-row{grid-template-columns:36px 1fr auto;gap:8px}.hm-n{width:36px;height:36px}}"
  ].join("");
  document.head.appendChild(css);

  function statsHTML() {
    var D = rank();
    if (!D.length) return "";
    var tot = D.reduce(function (s, h) { return s + (+h.summa || 0); }, 0), n = D.length, links = D.filter(function (h) { return !h.summa; }).length;
    return '<div class="hm-stats"><div><b>' + n + '</b><small>homiy</small></div><div><b>' + fmt(tot) + '</b><small>so\'m jami</small></div><div><b>' + Math.max(0, Math.round(tot / 10000)) + '</b><small>piyola kofe</small></div><div><b>' + links + '</b><small>havola bilan</small></div></div>';
  }
  function listHTML(limit) {
    var R = rank().slice(0, limit || 50), O = oila();
    var oilaHTML = O.map(function (h) {
      return '<li class="hm-row oila"><div class="hm-n">❤️</div><div class="hm-who"><b>' + esc(h.ism) + '</b>' + (h.xabar ? '<small>' + esc(h.xabar) + '</small>' : "") + '</div><div class="hm-amt">' + esc(h.matn || (h.summa ? fmt(h.summa) + " so'm" : "♾")) + '<small>❤️ Oilam</small></div></li>';
    }).join("");
    if (!R.length && O.length) return '<ol class="hm-list">' + oilaHTML + '</ol>';
    if (!R.length) return '<div class="hm-empty">Hali homiylar ro\'yxati bo\'sh — birinchi bo\'ling! Kofe uchun hissa qo\'shing yoki saytni ulashib, havolani Telegram\'da (@miir1999) yuboring: ismingiz shu yerda chiqadi.</div>';
    return '<ol class="hm-list">' + oilaHTML + R.map(function (h, i) {
      var cls = i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : "", medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : String(i + 1);
      var safe = /^https?:\/\//i.test(String(h.havola || "")) ? String(h.havola) : "";
      var who = safe ? '<a href="' + esc(safe) + '" target="_blank" rel="noopener noreferrer nofollow">' + esc(safe.replace(/^https?:\/\/(www\.)?/, "").slice(0, 36)) + '</a>' : "";
      return '<li class="hm-row ' + cls + '"><div class="hm-n">' + medal + '</div><div class="hm-who"><b>' + esc(h.ism) + '</b>' + who + (h.xabar ? '<small>“' + esc(h.xabar) + '”</small>' : "") + '</div><div class="hm-amt">' + (h.matn ? esc(h.matn) : h.summa ? fmt(h.summa) + " so'm" : "🔗 havola") + '<small>' + daraja(+h.summa || 0) + " " + kofe(+h.summa || 0) + (h.sana ? " · " + esc(h.sana) : "") + '</small></div></li>';
    }).join("") + "</ol>";
  }
  window.kaHomiylar = { stats: statsHTML, list: listHTML, data: H };

  // Bulutdagi (ustoz.html'dan qo'shilgan) homiylar — kesh bilan; faqat reyting ko'rsatiladigan sahifada yuklanadi
  function cloudList(cb) {
    try { var c = JSON.parse(localStorage.getItem("ka.homiylar") || "null"); if (c && c.t > Date.now() - 6 * 3600e3 && c.l) merge(c.l); } catch (e) {}
    if (!document.getElementById("homiylar")) { cb(); return; }
    function go() {
      if (!window.kaCloud || !window.kaCloud.homiylar) { cb(); return; }
      window.kaCloud.homiylar().then(function (l) { merge(l); try { localStorage.setItem("ka.homiylar", JSON.stringify({ t: Date.now(), l: l })); } catch (e) {} cb(); }, function () { cb(); });
    }
    if (window.kaCloud) go();
    else { var sc = document.createElement("script"); sc.src = "ka-bulut.js"; sc.onload = go; sc.onerror = cb; document.head.appendChild(sc); }
  }
  function merge(l) { (l || []).forEach(function (h) { if (h && h.ism && !H.some(function (x) { return x.ism === h.ism && (x.summa | 0) === (h.summa | 0); })) H.push(h); }); }

  function init() { cloudList(render); }
  function render() {
    // 1) Reyting konteyneri bo'lsa (donat.html, index.html)
    var host = document.getElementById("homiylar");
    if (host) host.innerHTML = '<div class="hm-wrap"><div class="hm-head"><h3>🏆 Homiylar reytingi</h3><small>Pul yoki havola bilan qo\'llab-quvvatlaganlar</small></div>' + statsHTML() + listHTML(host.getAttribute("data-limit") ? +host.getAttribute("data-limit") : 50) + "</div>";
    // 2) Doimiy "Buy me a coffee" bandi — footer oldidan (donat.html da shart emas)
    if (/donat\.html$/.test(location.pathname) || document.querySelector(".bmc-band") || document.getElementById("qollab")) return;
    var foot = document.querySelector("footer");
    var top3 = rank().slice(0, 3);
    var band = document.createElement("section"); band.className = "bmc-band";
    band.innerHTML = '<div class="bmc-card"><div class="bmc-cup">☕</div><div class="bmc-txt"><b>Buy me a coffee</b><span>Kuvonch Academy bepul va reklamasiz. Bir piyola kofe narxidagi hissa — yangi o\'yin, mashq va darslarga aylanadi. 💛</span>' +
      (top3.length ? '<div class="bmc-top">Top homiylar: ' + top3.map(function (h, i) { return "<i>" + ["🥇", "🥈", "🥉"][i] + " " + esc(h.ism) + "</i>"; }).join("") + ' <a href="donat.html#homiylar" style="color:#ffd479">reyting →</a></div>' : "") +
      '<div class="bmc-sub"><a href="https://t.me/miir1999" target="_blank" rel="noopener">✈ Chek yuborish</a><a href="premium.html">💎 Pro obuna</a><a href="donat.html#homiylar">🏆 Homiylar reytingi</a></div></div>' +
      '<a class="bmc-btn" href="donat.html">☕ Kofe uchun qo\'llab-quvvatlash</a></div>';
    if (foot && foot.parentNode) foot.parentNode.insertBefore(band, foot); else document.body.appendChild(band);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
