/* RTR (raqamli ta'lim resursi) formatidagi fan materialini fan sahifasiga chiqaradi:
   TMR, texnologik xaritalar, ma'ruzalar, amaliy ishlar, mustaqil ta'lim, nazorat, glossariy va O'UM (chop etish / Word).
   Ishlatish: t1RTR.render(D, { root: fanBlok, base: "media papka manzili/", plan: { jami: 54, auditoriya: 40 }, fan: "nomi", yonalish: "..." }) */
(function () {
  "use strict";
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function md(t) { return esc(t).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); }
  function li(a) { return (a || []).map(function (x) { return "<li>" + md(typeof x === "string" ? x : (x.p || x.matn || JSON.stringify(x))) + "</li>"; }).join(""); }
  function ul(a) { return a && a.length ? "<ul>" + li(a) + "</ul>" : ""; }
  function ol(a) { return a && a.length ? "<ol>" + li(a) + "</ol>" : ""; }
  function tbl(cols, rows, cap) {
    return (cap ? "<h4>" + esc(cap) + "</h4>" : "") + '<div class="tbl-w"><table><thead><tr>' + cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + md(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }
  function blocks(bs) {
    return (bs || []).map(function (b) {
      if (b.h) return "<h4>" + md(b.h) + "</h4>";
      if (b.p) return "<p>" + md(b.p) + "</p>";
      if (b.ul) return ul(b.ul);
      if (b.ol) return ol(b.ol);
      if (b.tur === "table") return tbl(b.ustunlar || [], b.qatorlar || [], b.sarlavha);
      return "";
    }).join("");
  }
  function kv(pairs) { return '<div class="kv">' + pairs.filter(function (p) { return p[1]; }).map(function (p) { return "<div>" + esc(p[0]) + "</div><div>" + p[1] + "</div>"; }).join("") + "</div>"; }
  function turi(t) { return /amaliy/i.test(t.turi) ? "A" : /lab/i.test(t.turi) ? "L" : "N"; }

  /* ---------- TMR ---------- */
  function tmr(D, plan, sel) {
    var T0 = D.topics || [], hammasi = !sel || sel.length === T0.length, sum = 0, nz = 0, am = 0;
    var T = hammasi ? T0 : sel.map(function (i) { return T0[i]; }), LOS = {};
    T.forEach(function (t) { LOS[t.lo] = 1; });
    var M = (D.mustaqil || []).filter(function (m) { return hammasi || !m.lo || LOS[m.lo]; });
    var rows = T.map(function (t, k) { var i = hammasi ? k : sel[k];
      var s = +t.soat || 0; sum += s; if (turi(t) === "A") am += s; else nz += s;
      var mi = M.filter(function (m) { return m.lo === t.lo; }).map(function (m) { return m.id; });
      return "<tr><td class=n>" + (i + 1) + "</td><td>" + esc(t.nomi) + '</td><td><span class="tag ' + (turi(t) === "A" ? "a" : "u") + '">' + esc(t.turi) + "</span></td><td class=n>" + s +
        "</td><td>" + esc(t.lo || "") + "</td><td></td><td></td></tr>";
    }).join("");
    var ms = M.reduce(function (a, m) { return a + (+m.soat || 0); }, 0);
    var aud = hammasi && plan && plan.auditoriya, ok = aud ? aud === sum : null;
    var chk = !hammasi ? '<p class="note">Tanlangan ' + T.length + " ta mavzu: <b>" + sum + "</b> soat (nazariy " + nz + ", amaliy " + am + "). Dars raqamlari to‘liq TMR bo‘yicha.</p>" : aud ? '<p class="note ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ Soatlar o‘quv reja bilan mos: " : "✗ Soatlar o‘quv rejaga mos emas: ") +
      "TMR — <b>" + sum + "</b> soat (nazariy " + nz + ", amaliy " + am + "), o‘quv rejada auditoriya — <b>" + aud + "</b> soat" + (plan.jami ? ", jami " + plan.jami + " soat" : "") + ".</p>" : "";
    var mrows = M.map(function (m, i) { return "<tr><td class=n>" + (i + 1) + "</td><td>" + esc(m.nomi) + "</td><td>" + esc(m.lo || "") + "</td><td class=n>" + esc(m.soat) + "</td><td>" + esc(m.topshirish_shakli || "") + "</td></tr>"; }).join("");
    return chk + '<div class="tbl-w"><table><thead><tr><th class=n>№</th><th>Mavzu (dars)</th><th>Turi</th><th class=n>Soat</th><th>O‘qitish natijasi</th><th>Reja sanasi</th><th>O‘tilgan sana</th></tr></thead><tbody>' +
      rows + '<tr class="jami"><td></td><td>Jami auditoriya soati</td><td></td><td class=n>' + sum + "</td><td></td><td></td><td></td></tr></tbody></table></div>" +
      (M.length ? '<h3 style="margin-top:22px">Mustaqil ta’lim topshiriqlari</h3><div class="tbl-w"><table><thead><tr><th class=n>№</th><th>Topshiriq</th><th>Natija</th><th class=n>Soat</th><th>Topshirish shakli</th></tr></thead><tbody>' +
        mrows + '<tr class="jami"><td></td><td>Jami mustaqil ta’lim</td><td></td><td class=n>' + ms + "</td><td></td></tr></tbody></table></div>" : "");
  }

  /* ---------- Texnologik xarita (80 daqiqa) ---------- */
  function xarita(t, prev, i) {
    var A = turi(t) === "A", at = t.amaliy_topshiriq || {}, test = t.test || [];
    var metod = (t.metodlar || []).map(function (m) { return "<li><b>" + esc(m.nomi) + "</b> — " + md(m.qollanishi) + "</li>"; }).join("");
    var takror = prev && prev.savollar && prev.savollar.length ? "Oldingi mavzu («" + esc(prev.nomi) + "») bo‘yicha savollar: " + prev.savollar.slice(0, 3).map(esc).join(" ") : "Kirish suhbati: o‘quvchilarning mavzu bo‘yicha hayotiy tajribasi so‘raladi.";
    var bosq = [
      ["Tashkiliy qism", 5, "Salomlashadi, davomatni aniqlaydi, mavzu, maqsad va kutilayotgan natijalarni e’lon qiladi.", "Darsga tayyorlanadi, maqsad bilan tanishadi.", "Tayyorgarlik"],
      ["O‘tilgan mavzuni takrorlash", 10, takror, "Savollarga javob beradi, bir-birini to‘ldiradi.", "Og‘zaki baholash"],
      [A ? "Amaliy ish yo‘riqnomasi" : "Yangi mavzu bayoni", 30,
        A ? "«" + esc(at.nomi || t.nomi) + "» ishining maqsadi, jihozlari, xavfsizlik qoidalari va bajarish bosqichlarini tushuntiradi, namuna ko‘rsatadi."
          : "Reja bo‘yicha tushuntiradi: " + (t.reja || []).map(function (r, k) { return (k + 1) + ") " + esc(r); }).join("; ") + ". Didaktik sxema va videodan foydalanadi.",
        A ? "Yo‘riqnomani o‘rganadi, xavfsizlik qoidalarini takrorlaydi, ish o‘rnini tayyorlaydi." : "Tinglaydi, tayanch tushunchalarni yozib oladi, savollar beradi.", "Kuzatish"],
      ["Mustahkamlash", 20,
        A ? "Bosqichma-bosqich bajarishni kuzatadi, xatolarni tuzatadi, individual yordam beradi."
          : (t.keys && t.keys.sarlavha ? "Keys-stadi: «" + esc(t.keys.sarlavha) + "». " : "") + ((t.masalalar || []).length ? (t.masalalar.length + " ta amaliy masala yechiladi.") : ""),
        A ? "Topshiriqni bosqichma-bosqich bajaradi, natijani rasmiylashtiradi." : "Kichik guruhlarda ishlaydi, keysni tahlil qiladi, masala yechadi.", A ? "Amaliy natija" : "Guruh ishi"],
      ["Baholash va xulosa", 10, (test.length ? test.length + " ta savollik test o‘tkazadi, " : "") + "natijalarni tahlil qiladi va baholaydi.", "Test yechadi, o‘z natijasini tahlil qiladi.", "5 ballik tizim"],
      ["Uyga vazifa", 5, md(t.uyga_vazifa || "Mavzu bo‘yicha savollarga yozma javob tayyorlash."), "Vazifani yozib oladi.", "—"]
    ];
    var jami = bosq.reduce(function (a, b) { return a + b[1]; }, 0);
    var trs = bosq.map(function (b, k) { return "<tr><td>" + (k + 1) + ". " + b[0] + "</td><td class=n>" + b[1] + "</td><td>" + b[2] + "</td><td>" + b[3] + "</td><td>" + b[4] + "</td></tr>"; }).join("");
    return kv([
      ["Mavzu", esc(t.nomi)], ["Dars raqami va turi", (i + 1) + "-dars, " + esc(t.turi) + " (80 daqiqa)"], ["O‘qitish natijasi", esc(t.lo) + (t.ac ? " · " + esc(t.ac) : "")],
      ["Darsning maqsadi", md(t.maqsad)], ["Kutilayotgan natijalar", ul(t.natijalar)],
      ["Metodlar", metod ? "<ul>" + metod + "</ul>" : ""], ["Jihozlar", (at.jihozlar || []).map(esc).join("; ")],
      ["Tayanch tushunchalar", (t.tayanch_tushunchalar || []).map(esc).join(", ")]
    ]) + '<div class="tbl-w"><table><thead><tr><th>Bosqich</th><th class=n>Vaqt, daq</th><th>O‘qituvchi faoliyati</th><th>O‘quvchi faoliyati</th><th>Natija / baholash</th></tr></thead><tbody>' +
      trs + '<tr class="jami"><td>Jami</td><td class=n>' + jami + "</td><td></td><td></td><td></td></tr></tbody></table></div>";
  }

  /* ---------- Ma'ruza ---------- */
  function figs(t, base) {
    var d = (t.media && t.media.didaktik) || [];
    return d.map(function (x) { return '<figure><img loading="lazy" src="' + esc(base + x.src) + '" alt="' + esc(x.title) + '"><figcaption>' + esc(x.title) + "</figcaption></figure>"; }).join("");
  }
  function video(t, base) {
    var m = t.media || {}; if (!m.video) return "";
    return '<figure class="no-print"><video controls preload="none" style="width:100%;border-radius:10px;background:#000" poster="' + esc(base + (m.poster || "")) + '" src="' + esc(base + m.video) + '"></video><figcaption>Video dars' +
      (m.duration ? " · " + Math.round(m.duration / 60 * 10) / 10 + " daqiqa" : "") + "</figcaption></figure>";
  }
  function maruza(t, base) {
    return kv([["Reja", ol(t.reja)], ["Tayanch tushunchalar", (t.tayanch_tushunchalar || []).map(esc).join(", ")]]) +
      (t.matn || []).map(function (s) { return "<h3>" + md(s.sarlavha) + "</h3>" + blocks(s.bloklar); }).join("") +
      figs(t, base) + video(t, base) +
      ((t.savollar || []).length ? "<h3>Nazorat savollari</h3>" + ol(t.savollar) : "");
  }
  function amaliy(t) {
    var a = t.amaliy_topshiriq; if (!a) return "";
    return kv([["Ish nomi", esc(a.nomi)], ["Maqsad", md(a.maqsad)], ["Jihozlar", ul(a.jihozlar)], ["Xavfsizlik texnikasi", ul(a.xavfsizlik)]]) +
      "<h4>Ishni bajarish tartibi</h4>" + ol(a.bosqichlar) + (a.natija ? "<p><b>Kutilgan natija:</b> " + md(a.natija) + "</p>" : "") + baho(a.baholash) +
      ((t.masalalar || []).length ? "<h4>Masalalar</h4>" + t.masalalar.map(function (m, k) { return "<p><b>" + (k + 1) + ".</b> " + md(m.shart) + '</p><details class="no-print"><summary>Yechim</summary><p>' + md(m.yechim) + "</p></details>"; }).join("") : "") +
      (t.keys && t.keys.sarlavha ? "<h4>Keys-stadi: " + esc(t.keys.sarlavha) + "</h4><p>" + md(t.keys.vaziyat) + "</p>" + ol(t.keys.savollar) + (t.keys.javob ? '<details class="no-print"><summary>Namunaviy yechim</summary><p>' + md(t.keys.javob) + "</p></details>" : "") : "");
  }
  function baho(b) { return b && b.length ? tbl(["Baho", "Mezon"], b.map(function (x) { return typeof x === "string" ? ["", x] : [String(x.baho), x.mezon]; }), "Baholash mezonlari") : ""; }
  function test(qs, kalit) {
    return (qs || []).map(function (q, k) {
      return '<div class="test-q"><b>' + (k + 1) + ". " + md(q.savol) + "</b><ol>" + (q.variantlar || []).map(function (v, j) { return "<li" + (kalit && j === q.togri ? ' class="togri"' : "") + ">" + md(v) + "</li>"; }).join("") + "</ol>" +
        (kalit && q.izoh ? '<p class="small muted">' + md(q.izoh) + "</p>" : "") + "</div>";
    }).join("");
  }
  function kalitlar(qs) { return (qs || []).map(function (q, k) { return (k + 1) + "–" + "ABCDEFG"[q.togri]; }).join(", "); }
  function mustaqil(m) {
    return kv([["Natija", esc(m.lo)], ["Soat", esc(m.soat)], ["Maqsad", md(m.maqsad)], ["Topshirish shakli", md(m.topshirish_shakli)]]) +
      (m.yoriqnoma || []).map(function (y) { return "<p>" + md(y.p || y) + "</p>"; }).join("") + "<h4>Bajarish bosqichlari</h4>" + ol(m.bosqichlar) +
      (m.namuna && m.namuna.ustunlar ? tbl(m.namuna.ustunlar, m.namuna.qatorlar || [], m.namuna.sarlavha) : "") + baho(m.baholash) +
      ((m.tavsiya_manbalar || []).length ? "<h4>Tavsiya etilgan manbalar</h4>" + ul(m.tavsiya_manbalar) : "");
  }
  function det(no, title, body, tag) { return '<details class="mv"><summary><span class="no">' + esc(no) + "</span><span>" + esc(title) + "</span>" + (tag || "") + '</summary><div class="ic doc">' + body + "</div></details>"; }
  function annot(D) {
    var m = D.meta || {};
    return kv([
      ["Modul", esc((m.modul_kod ? m.modul_kod + " — " : "") + (m.modul || ""))], ["Mutaxassislik", esc((m.kasb_kod ? m.kasb_kod + " — " : "") + (m.kasb || ""))],
      ["Kvalifikatsiya", esc(m.kvalifikatsiya || "")], ["Soatlar", m.soat ? "jami " + esc(m.soat.jami) + " · nazariy " + esc(m.soat.nazariy) + " · amaliy " + esc(m.soat.amaliy) + " · mustaqil " + esc(m.soat.mustaqil) : ""],
      ["Tuzuvchi", esc((m.muallif || "") + (m.lavozim ? ", " + m.lavozim : ""))], ["Maqsad", md(m.maqsad)], ["Kirish talablari", md(m.kirish_talablari)],
      ["Ta’lim shakllari va usullari", md(m.shakllar)], ["Asos", md(m.asos)]
    ]) + ((m.natijalar || []).length ? tbl(["Kod", "O‘qitish natijasi"], m.natijalar.map(function (n) { return [n.kod, n.matn]; }), "O‘qitish natijalari") : "") +
      ((m.imtihon || []).length ? "<h4>Baholash mezonlari</h4>" + m.imtihon.map(function (x) { return "<p><b>" + esc(x.nomi) + "</b></p>" + ul(x.bandlar); }).join("") : "");
  }
  function adab(D) { return (D.adabiyotlar || []).map(function (g) { return "<h4>" + esc(g.guruh) + "</h4>" + ol(g.bandlar); }).join(""); }
  function gloss(D) {
    return '<input type="search" class="no-print" placeholder="Atamani qidiring…" data-gl style="margin-bottom:12px">' +
      '<div class="tbl-w"><table><thead><tr><th>Atama</th><th>Izoh</th><th>Mavzu</th></tr></thead><tbody>' +
      (D.glossariy || []).map(function (g) { return "<tr data-g=\"" + esc((g.atama + " " + g.izoh).toLowerCase()) + "\"><td><b>" + esc(g.atama) + "</b></td><td>" + md(g.izoh) + "</td><td>" + esc((g.mavzular || []).join(", ")) + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }

  /* ---------- O'UM yig'uvchi: bo'limlar va modul/mavzular tanlanadi; bitta hujjat yoki qismlarga bo'lingan ZIP ---------- */
  var BOLIM = [["titul", "Titul varag‘i"], ["annot", "Annotatsiya"], ["tmr", "Taqvim-mavzu reja (TMR)"], ["xarita", "Texnologik xaritalar"], ["maruza", "Ma’ruza matnlari"],
    ["amaliy", "Amaliy mashg‘ulotlar"], ["mustaqil", "Mustaqil ta’lim"], ["nazorat", "Mavzu testlari"], ["yakuniy", "Yakuniy nazorat"], ["glossariy", "Glossariy"], ["adab", "Adabiyotlar"]];
  function oraliq(D, sel) {
    var T = D.topics || [];
    if (!sel || sel.length === T.length) return "";
    return sel.map(function (i) { return T[i].id; }).join(", ");
  }
  function titul(D, o, sel) {
    var m = D.meta || {}, or = oraliq(D, sel);
    return '<div class="titul" style="text-align:center;padding:30mm 0 20mm"><p>' + esc(m.muassasa || "Toshkent tuman 1-son texnikumi") + "</p><h1 style=\"font-size:26pt\">" + esc(m.modul || o.fan || "") +
      "</h1><p>fanidan</p><h2>O‘QUV-USLUBIY MAJMUA</h2>" + (or ? "<p>(tanlangan mavzular: " + esc(or) + ")</p>" : "") + "<p>" + esc((m.kasb_kod ? m.kasb_kod + " — " : "") + (m.kasb || o.yonalish || "")) + "</p><p>Tuzuvchi: " + esc(m.muallif || "________________") +
      "</p><p>Ko‘rib chiqildi: metodik birlashma majlisi, bayonnoma № ___ «___» ________ 2026-y.</p><p>Tasdiqlandi: o‘quv ishlari bo‘yicha direktor o‘rinbosari ________</p><p>2026</p></div>";
  }
  function qism(D, o, key, sel) {
    var T = D.topics || [], base = o.base || "", I = sel || T.map(function (_, i) { return i; }), hammasi = I.length === T.length;
    var LOS = {}, IDS = {}; I.forEach(function (i) { LOS[T[i].lo] = 1; IDS[T[i].id] = 1; });
    var Y = D.yakuniy || {};
    switch (key) {
      case "titul": return titul(D, o, sel);
      case "annot": return annot(D);
      case "tmr": return I.length ? tmr(D, o.plan, hammasi ? null : I) : "";
      case "xarita": return I.map(function (i) { return "<h3>" + (i + 1) + "-dars. " + esc(T[i].nomi) + "</h3>" + xarita(T[i], T[i - 1], i); }).join("");
      case "maruza": return I.filter(function (i) { return turi(T[i]) === "N"; }).map(function (i) { return "<h3>" + esc(T[i].id) + ". " + esc(T[i].nomi) + "</h3>" + maruza(T[i], base); }).join("");
      case "amaliy": return I.filter(function (i) { return turi(T[i]) === "A"; }).map(function (i) { return "<h3>" + esc(T[i].id) + ". " + esc(T[i].nomi) + "</h3>" + amaliy(T[i]); }).join("");
      case "mustaqil": return (D.mustaqil || []).filter(function (x) { return hammasi || !x.lo || LOS[x.lo]; }).map(function (x) { return "<h3>" + esc(x.id) + ". " + esc(x.nomi) + "</h3>" + mustaqil(x); }).join("");
      case "nazorat": return I.filter(function (i) { return (T[i].test || []).length; }).map(function (i) { return "<h3>" + esc(T[i].id) + ". " + esc(T[i].nomi) + " — test</h3>" + test(T[i].test, false) + "<p class=small><b>Javoblar:</b> " + kalitlar(T[i].test) + "</p>"; }).join("");
      case "yakuniy": return ((Y.test || []).length ? "<h3>Yakuniy nazorat — test</h3>" + test(Y.test, false) + "<p class=small><b>Javoblar:</b> " + kalitlar(Y.test) + "</p>" : "") +
        ((Y.amaliy_biletlar || []).length ? "<h3>Yakuniy nazorat — amaliy biletlar</h3>" + Y.amaliy_biletlar.map(function (b, k) { return "<p><b>" + (k + 1) + "-bilet (" + esc(b.lo) + ", " + esc(b.vaqt || "") + "):</b> " + md(b.topshiriq) + "</p>" + baho(b.baholash); }).join("") : "");
      case "glossariy": var G = (D.glossariy || []).filter(function (g) { return hammasi || !(g.mavzular || []).length || g.mavzular.some(function (id) { return IDS[id]; }); });
        return G.length ? tbl(["Atama", "Izoh"], G.map(function (g) { return [g.atama, g.izoh]; })) : "";
      case "adab": return adab(D);
    }
    return "";
  }
  // Bitta umumiy hujjat
  function oum(D, o, bol, sel) {
    bol = bol || BOLIM.map(function (b) { return b[0]; });
    var h = "", n = 0;
    BOLIM.forEach(function (b) {
      if (bol.indexOf(b[0]) < 0) return;
      var x = qism(D, o, b[0], sel); if (!x) return;
      if (b[0] === "titul") { h += x; return; }
      n++; h += '<h2 class="yb">' + n + ". " + b[1] + "</h2>" + x;
    });
    return h;
  }
  // Qismlarga bo'lib: [{nom, html}]
  function qismlar(D, o, bol, sel, rejim) {
    var T = D.topics || [], I = sel || T.map(function (_, i) { return i; }), out = [], n = 0, fan = (D.meta && D.meta.modul) || o.fan || "Fan";
    if (rejim === "mavzu") {
      I.forEach(function (i) {
        var t = T[i], h = "";
        if (bol.indexOf("xarita") >= 0) h += "<h2>Texnologik xarita</h2>" + xarita(t, T[i - 1], i);
        if (bol.indexOf("maruza") >= 0 && turi(t) === "N") h += "<h2>Ma’ruza matni</h2>" + maruza(t, o.base || "");
        if (bol.indexOf("amaliy") >= 0 && turi(t) === "A") h += "<h2>Amaliy mashg‘ulot</h2>" + amaliy(t);
        if (bol.indexOf("nazorat") >= 0 && (t.test || []).length) h += "<h2>Test</h2>" + test(t.test, false) + "<p class=small><b>Javoblar:</b> " + kalitlar(t.test) + "</p>";
        if (h) out.push({ nom: t.id + " " + t.nomi, html: "<p>" + esc(fan) + " · " + (i + 1) + "-dars · " + esc(t.turi) + " · " + esc(t.lo || "") + "</p><h1>" + esc(t.id) + ". " + esc(t.nomi) + "</h1>" + h });
      });
      ["titul", "annot", "tmr", "mustaqil", "yakuniy", "glossariy", "adab"].forEach(function (k) {
        if (bol.indexOf(k) < 0) return; var x = qism(D, o, k, sel); if (!x) return;
        var nm = BOLIM.filter(function (b) { return b[0] === k; })[0][1];
        out.push({ nom: "00 " + nm, html: (k === "titul" ? "" : "<h1>" + esc(nm) + "</h1>") + x });
      });
      return out;
    }
    BOLIM.forEach(function (b) {
      if (bol.indexOf(b[0]) < 0) return;
      var x = qism(D, o, b[0], sel); if (!x) return;
      n++; out.push({ nom: (n < 10 ? "0" : "") + n + " " + b[1], html: (b[0] === "titul" ? "" : "<h1>" + esc(b[1]) + "</h1><p>" + esc(fan) + "</p>") + x });
    });
    return out;
  }
  function yigUI(D, o) {
    var T = D.topics || [], m = D.meta || {}, NAT = {}, grp = [], gi = {};
    (m.natijalar || []).forEach(function (x) { NAT[x.kod] = x.matn; });
    T.forEach(function (t, i) { var k = t.lo || "Mavzular"; if (!(k in gi)) { gi[k] = grp.length; grp.push({ k: k, L: [] }); } grp[gi[k]].L.push(i); });
    return '<div class="yig no-print"><div class="yig-h"><h3>Majmuani yig‘ish</h3><p class="small muted">Kerakli bo‘limlar va modul/mavzularni belgilang. «Bitta hujjat» — to‘liq yoki tanlangan qismlardan bitta umumiy majmua; «qismlarga bo‘lib» — har biri alohida Word fayl (ZIP arxivda).</p></div>' +
      '<div class="yig-g"><fieldset><legend>1. Bo‘limlar</legend><div class="yig-tz"><button type="button" class="kv-l" data-yb="1">Hammasi</button><button type="button" class="kv-l" data-yb="0">Hech biri</button></div>' +
      BOLIM.map(function (b) { return '<label class="yig-c"><input type="checkbox" data-b="' + b[0] + '" checked> ' + b[1] + "</label>"; }).join("") + "</fieldset>" +
      '<fieldset><legend>2. Modullar (o‘qitish natijalari) va mavzular</legend><div class="yig-tz"><button type="button" class="kv-l" data-yt="all">Barchasi</button><button type="button" class="kv-l" data-yt="N">Faqat nazariy</button><button type="button" class="kv-l" data-yt="A">Faqat amaliy</button><button type="button" class="kv-l" data-yt="0">Tozalash</button></div>' +
      grp.map(function (g) {
        return '<details class="yig-m"><summary><label><input type="checkbox" data-lo="' + esc(g.k) + '" checked> <b>' + esc(g.k) + "</b></label> <span class=\"muted small\">" + (NAT[g.k] ? "— " + esc(NAT[g.k]) + " " : "") + "(" + g.L.length + " ta mavzu)</span></summary><div class=\"yig-ml\">" +
          g.L.map(function (i) { var t = T[i]; return '<label class="yig-c"><input type="checkbox" data-ti="' + i + '" data-lo-of="' + esc(g.k) + '" data-tt="' + turi(t) + '" checked> <span class="no">' + esc(t.id) + "</span> " + esc(t.nomi) + ' <span class="tag ' + (turi(t) === "A" ? "a" : "u") + '">' + esc(t.turi) + "</span></label>"; }).join("") + "</div></details>";
      }).join("") + "</fieldset></div>" +
      '<fieldset class="yig-r"><legend>3. Qanday chiqarilsin</legend><label class="yig-c"><input type="radio" name="yigc" value="bir" checked> Bitta umumiy hujjat</label><label class="yig-c"><input type="radio" name="yigc" value="bolim"> Qismlarga bo‘lib — har bo‘lim alohida fayl (ZIP)</label><label class="yig-c"><input type="radio" name="yigc" value="mavzu"> Mavzular bo‘yicha — har mavzu alohida fayl (ZIP)</label></fieldset>' +
      '<p class="small" data-ys></p><div class="toolbar"><button type="button" class="btn" data-yw>Yuklab olish</button><button type="button" class="btn ghost" data-yp>Chop etish / PDF</button>' +
      (o.paket ? '<a class="btn ghost" target="_blank" rel="noopener" href="' + esc(o.paket) + '">Interaktiv resursni ochish</a>' : "") + "</div></div>";
  }
  function yigBog(box, D, o) {
    var T = D.topics || [], $$ = function (q) { return Array.prototype.slice.call(box.querySelectorAll(q)); };
    function bol() { return $$("[data-b]:checked").map(function (c) { return c.getAttribute("data-b"); }); }
    function sel() { return $$("[data-ti]:checked").map(function (c) { return +c.getAttribute("data-ti"); }).sort(function (a, b) { return a - b; }); }
    function rej() { var r = box.querySelector('[name="yigc"]:checked'); return r ? r.value : "bir"; }
    function yangila() {
      $$("[data-lo]").forEach(function (g) {
        var k = g.getAttribute("data-lo"), L = $$('[data-lo-of="' + k.replace(/"/g, "") + '"]'), c = L.filter(function (x) { return x.checked; }).length;
        g.checked = c === L.length && c > 0; g.indeterminate = c > 0 && c < L.length;
      });
      var S = sel(), B = bol(), soat = S.reduce(function (a, i) { return a + (+T[i].soat || 0); }, 0);
      box.querySelector("[data-ys]").innerHTML = "Tanlandi: <b>" + B.length + "</b> ta bo‘lim, <b>" + S.length + "</b> / " + T.length + " ta mavzu (" + soat + " soat)." +
        (rej() !== "bir" ? " Chop etishda tanlanganlar bitta hujjat bo‘lib chiqadi." : "");
      box.querySelector("[data-yw]").textContent = rej() === "bir" ? "Word (.doc) yuklab olish" : "ZIP yuklab olish";
    }
    box.addEventListener("change", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-lo")) $$('[data-lo-of="' + t.getAttribute("data-lo").replace(/"/g, "") + '"]').forEach(function (x) { x.checked = t.checked; });
      yangila();
    });
    $$("[data-yb]").forEach(function (b) { b.addEventListener("click", function () { var v = b.getAttribute("data-yb") === "1"; $$("[data-b]").forEach(function (c) { c.checked = v; }); yangila(); }); });
    $$("[data-yt]").forEach(function (b) { b.addEventListener("click", function () { var v = b.getAttribute("data-yt"); $$("[data-ti]").forEach(function (c) { c.checked = v === "all" || c.getAttribute("data-tt") === v; }); yangila(); }); });
    $$("summary label").forEach(function (l) { l.addEventListener("click", function (e) { e.stopPropagation(); }); });
    function tek() {
      if (!bol().length) { alert("Kamida bitta bo‘limni belgilang."); return false; }
      if (!sel().length && bol().some(function (k) { return /^(tmr|xarita|maruza|amaliy|nazorat)$/.test(k); }) && !bol().some(function (k) { return /^(titul|annot|mustaqil|yakuniy|glossariy|adab)$/.test(k); })) { alert("Kamida bitta mavzuni belgilang."); return false; }
      return true;
    }
    var fan = (D.meta && D.meta.modul) || o.fan || "Fan", qisman = function () { return sel().length < T.length; };
    box.querySelector("[data-yp]").addEventListener("click", function () { if (tek()) chop(oum(D, o, bol(), sel())); });
    box.querySelector("[data-yw]").addEventListener("click", function () {
      if (!tek()) return;
      var nom = fan + " — O‘UM" + (qisman() ? " (tanlangan qismlar)" : "");
      if (rej() === "bir") { word(oum(D, o, bol(), sel()), nom); return; }
      var btn = this, eski = btn.textContent; btn.disabled = true; btn.textContent = "Tayyorlanmoqda…";
      zipla(qismlar(D, o, bol(), sel(), rej()), nom + (rej() === "mavzu" ? " — mavzular bo‘yicha" : " — qismlar"))["catch"](function (e) { alert("ZIP tayyorlanmadi: " + (e && e.message || e)); })
        .then(function () { btn.disabled = false; btn.textContent = eski; });
    });
    yangila();
  }

  function render(D, o) {
    var R = o.root, P = function (id) { return R.querySelector('[data-p="' + id + '"]'); }, base = o.base || "";
    var T = D.topics || [], N = T.filter(function (t) { return turi(t) === "N"; }), A = T.filter(function (t) { return turi(t) === "A"; });
    var src = '<p class="small muted">Manba: ' + esc(o.manba || "o‘qituvchi tayyorlagan raqamli ta’lim resursi") + (D.meta && D.meta.muallif ? " · Tuzuvchi: <b>" + esc(D.meta.muallif) + "</b>" : "") + "</p>";
    var fill = function (id, html, n) { var p = P(id); if (!p) return; p.innerHTML = html; var b = R.querySelector('[data-t="' + id + '"] .cnt'); if (b && n != null) b.textContent = n; };
    fill("tmr", src + tmr(D, o.plan), T.length);
    fill("xarita", src + '<p class="note">Har bir dars uchun texnologik xarita RTR ma’lumotlari (maqsad, natijalar, metodlar, keys, test, uyga vazifa) asosida avtomatik yig‘ildi. Vaqt taqsimoti: 80 daqiqa.</p>' +
      T.map(function (t, i) { return det(t.id, t.nomi, xarita(t, T[i - 1], i), ' <span class="tag ' + (turi(t) === "A" ? "a" : "u") + '">' + esc(t.turi) + "</span>"); }).join(""), T.length);
    fill("maruza", src + N.map(function (t) { return det(t.id, t.nomi, maruza(t, base)); }).join(""), N.length);
    fill("amaliy", src + A.map(function (t) { return det(t.id, t.nomi, amaliy(t)); }).join(""), A.length);
    fill("mustaqil", src + (D.mustaqil || []).map(function (m) { return det(m.id, m.nomi, mustaqil(m)); }).join(""), (D.mustaqil || []).length);
    var Y = D.yakuniy || {};
    fill("nazorat", src + T.map(function (t) {
      return det(t.id, "Test: " + t.nomi, test(t.test, false) + '<details class="no-print kalit"><summary>Javoblar va izohlar</summary>' + test(t.test, true) + "</details>");
    }).join("") + det("YN", "Yakuniy nazorat — " + (Y.test || []).length + " ta test", test(Y.test, false) + '<details class="no-print kalit"><summary>Javoblar va izohlar</summary>' + test(Y.test, true) + "</details>") +
      ((Y.amaliy_biletlar || []).length ? det("YN", "Yakuniy nazorat — amaliy biletlar", Y.amaliy_biletlar.map(function (b, k) { return "<p><b>" + (k + 1) + "-bilet (" + esc(b.lo) + ", " + esc(b.vaqt || "") + "):</b> " + md(b.topshiriq) + "</p>" + baho(b.baholash); }).join("")) : ""), T.length + 1);
    fill("glossariy", src + gloss(D), (D.glossariy || []).length);
    var g = R.querySelector("[data-gl]");
    if (g) g.addEventListener("input", function () { var v = g.value.toLowerCase().trim(); Array.prototype.forEach.call(R.querySelectorAll("tr[data-g]"), function (tr) { tr.hidden = v && tr.getAttribute("data-g").indexOf(v) < 0; }); });
    fill("oum", src + yigUI(D, o) + '<h3 style="margin-top:26px">Annotatsiya</h3>' + annot(D) + "<h3>Adabiyotlar</h3>" + adab(D) +
      '<p class="small muted">O‘UM tarkibi: annotatsiya, TMR, ' + T.length + " ta texnologik xarita, " + N.length + " ta ma’ruza, " + A.length + " ta amaliy ish, " + (D.mustaqil || []).length + " ta mustaqil topshiriq, testlar, glossariy, adabiyotlar.</p>");
    var yb = R.querySelector(".yig"); if (yb) yigBog(yb, D, o);
    var fb = P("fayllar");
    if (fb && o.paket) {
      var hj = (D.hujjatlar || []).map(function (x) { return "<li>" + esc(x.nomi) + " <span class=\"muted small\">(" + esc(x.ext || "") + (x.izoh ? ", " + esc(x.izoh) : "") + ")</span></li>"; }).join("");
      fb.innerHTML = '<div class="card"><h3>Interaktiv raqamli ta’lim resursi</h3><p>Video darslar, slaydlar, testlar va didaktik materiallar bitta interaktiv resursda.</p><a class="btn" target="_blank" rel="noopener" href="' + esc(o.paket) + '">Resursni ochish</a></div>' +
        (hj ? '<h3 style="margin-top:20px">Resurs tarkibidagi hujjatlar</h3><ul>' + hj + '</ul><p class="small muted">Eslatma: bu hujjatlarning DOCX fayllari yuklangan arxivda yo‘q edi — o‘qituvchi kabinet orqali qo‘shishi mumkin.</p>' : "");
    }
  }

  /* ---------- Chop etish va Word ---------- */
  function chop(html) {
    var c = document.getElementById("chop"); if (!c) { c = document.createElement("div"); c.id = "chop"; document.body.appendChild(c); }
    c.className = "doc"; c.innerHTML = html; document.body.classList.add("chop-rejim");
    setTimeout(function () { window.print(); setTimeout(function () { document.body.classList.remove("chop-rejim"); c.innerHTML = ""; }, 400); }, 120);
  }
  function wordDoc(html, nom) {
    return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>' + esc(nom) +
      "</title><style>body{font-family:'Times New Roman';font-size:14pt;color:#000}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:4px;vertical-align:top}h1,h2,h3,h4{color:#000}h2.yb{page-break-before:always}.titul{page-break-after:always}.no-print,video,img,input,details>summary{display:none}.kv{display:block}.kv>div:nth-child(odd){font-weight:bold;margin-top:6pt}</style></head><body>" + html + "</body></html>";
  }
  // Fayl nomi: o'zbekcha tutuq belgilari va tirelar ASCII'ga (ba'zi tizimlar Unicode nomni rad etadi)
  function fnom(nom) { return String(nom).replace(/[‘’ʻʼ`´]/g, "'").replace(/[—–]/g, "-").replace(/[«»“”]/g, "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120); }
  function yukla(blob, nom) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nom; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function word(html, nom) { yukla(new Blob(["\ufeff" + wordDoc(html, nom)], { type: "application/msword" }), fnom(nom) + ".doc"); }
  var JZ = null;
  function jszip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (!JZ) JZ = new Promise(function (ok, no) { var sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; sc.onload = function () { ok(window.JSZip); }; sc.onerror = function () { JZ = null; no(new Error("JSZip yuklanmadi")); }; document.head.appendChild(sc); });
    return JZ;
  }
  // [{nom, html}] -> bitta ZIP (har biri .doc)
  function zipla(parts, nom) {
    if (!parts.length) return Promise.reject(new Error("tanlangan qismlarda material yo‘q"));
    return jszip().then(function (Z) {
      var z = new Z(), papka = z.folder(fnom(nom)), bor = {};
      parts.forEach(function (p) { var f = fnom(p.nom) || "qism", k = f, j = 2; while (bor[k]) k = f + " (" + (j++) + ")"; bor[k] = 1; papka.file(k + ".doc", "\ufeff" + wordDoc(p.html, p.nom)); });
      return z.generateAsync({ type: "blob" });
    }).then(function (b) { yukla(b, fnom(nom) + ".zip"); });
  }

  window.t1RTR = { render: render, oum: oum, qismlar: qismlar, chop: chop, word: word, wordDoc: wordDoc, zipla: zipla, esc: esc, md: md, tbl: tbl };
})();
