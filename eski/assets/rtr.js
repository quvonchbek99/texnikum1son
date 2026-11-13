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
  function tmr(D, plan) {
    var T = D.topics || [], M = D.mustaqil || [], sum = 0, nz = 0, am = 0;
    var rows = T.map(function (t, i) {
      var s = +t.soat || 0; sum += s; if (turi(t) === "A") am += s; else nz += s;
      var mi = M.filter(function (m) { return m.lo === t.lo; }).map(function (m) { return m.id; });
      return "<tr><td class=n>" + (i + 1) + "</td><td>" + esc(t.nomi) + '</td><td><span class="tag ' + (turi(t) === "A" ? "a" : "u") + '">' + esc(t.turi) + "</span></td><td class=n>" + s +
        "</td><td>" + esc(t.lo || "") + "</td><td></td><td></td></tr>";
    }).join("");
    var ms = M.reduce(function (a, m) { return a + (+m.soat || 0); }, 0);
    var aud = plan && plan.auditoriya, ok = aud ? aud === sum : null;
    var chk = aud ? '<p class="note ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ Soatlar o‘quv reja bilan mos: " : "✗ Soatlar o‘quv rejaga mos emas: ") +
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

  /* ---------- O'UM: hammasi bitta hujjatda ---------- */
  function oum(D, o) {
    var m = D.meta || {}, T = D.topics || [], base = o.base || "";
    var h = '<div style="text-align:center;padding:30mm 0 20mm"><p>' + esc(m.muassasa || "Toshkent tuman 1-son texnikumi") + "</p><h1 style=\"font-size:26pt\">" + esc(m.modul || o.fan || "") +
      "</h1><p>fanidan</p><h2>O‘QUV-USLUBIY MAJMUA</h2><p>" + esc((m.kasb_kod ? m.kasb_kod + " — " : "") + (m.kasb || o.yonalish || "")) + "</p><p>Tuzuvchi: " + esc(m.muallif || "________________") +
      "</p><p>Ko‘rib chiqildi: metodik birlashma majlisi, bayonnoma № ___ «___» ________ 2026-y.</p><p>Tasdiqlandi: o‘quv ishlari bo‘yicha direktor o‘rinbosari ________</p><p>2026</p></div>";
    h += "<h2>1. Annotatsiya</h2>" + annot(D);
    h += "<h2>2. Taqvim-mavzu reja</h2>" + tmr(D, o.plan);
    h += "<h2>3. Texnologik xaritalar</h2>" + T.map(function (t, i) { return "<h3>" + (i + 1) + ". " + esc(t.nomi) + "</h3>" + xarita(t, T[i - 1], i); }).join("");
    h += "<h2>4. Ma’ruza matnlari</h2>" + T.filter(function (t) { return turi(t) === "N"; }).map(function (t) { return "<h3>" + esc(t.id) + ". " + esc(t.nomi) + "</h3>" + maruza(t, base); }).join("");
    h += "<h2>5. Amaliy mashg‘ulotlar</h2>" + T.filter(function (t) { return turi(t) === "A"; }).map(function (t) { return "<h3>" + esc(t.id) + ". " + esc(t.nomi) + "</h3>" + amaliy(t); }).join("");
    h += "<h2>6. Mustaqil ta’lim</h2>" + (D.mustaqil || []).map(function (x) { return "<h3>" + esc(x.id) + ". " + esc(x.nomi) + "</h3>" + mustaqil(x); }).join("");
    h += "<h2>7. Nazorat materiallari</h2>" + T.map(function (t) { return "<h3>" + esc(t.id) + " — test</h3>" + test(t.test, false) + "<p class=small><b>Javoblar:</b> " + kalitlar(t.test) + "</p>"; }).join("");
    var Y = D.yakuniy || {};
    h += "<h3>Yakuniy nazorat — test</h3>" + test(Y.test, false) + "<p class=small><b>Javoblar:</b> " + kalitlar(Y.test) + "</p>";
    if ((Y.amaliy_biletlar || []).length) h += "<h3>Yakuniy nazorat — amaliy biletlar</h3>" + Y.amaliy_biletlar.map(function (b, k) { return "<p><b>" + (k + 1) + "-bilet (" + esc(b.lo) + ", " + esc(b.vaqt || "") + "):</b> " + md(b.topshiriq) + "</p>" + baho(b.baholash); }).join("");
    h += "<h2>8. Glossariy</h2>" + tbl(["Atama", "Izoh"], (D.glossariy || []).map(function (g) { return [g.atama, g.izoh]; }));
    h += "<h2>9. Adabiyotlar</h2>" + adab(D);
    return h;
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
    fill("oum", src + annot(D) + "<h3>Adabiyotlar</h3>" + adab(D) +
      '<div class="toolbar no-print" style="margin-top:18px"><button class="btn" data-oum-print>O‘UMni chop etish / PDF</button><button class="btn ghost" data-oum-word>Word (.doc) yuklab olish</button>' +
      (o.paket ? '<a class="btn ghost" target="_blank" rel="noopener" href="' + esc(o.paket) + '">Interaktiv resursni ochish</a>' : "") + "</div>" +
      '<p class="small muted">O‘UM tarkibi: annotatsiya, TMR, ' + T.length + " ta texnologik xarita, " + N.length + " ta ma’ruza, " + A.length + " ta amaliy ish, " + (D.mustaqil || []).length + " ta mustaqil topshiriq, testlar, glossariy, adabiyotlar.</p>");
    var pb = R.querySelector("[data-oum-print]"), wb = R.querySelector("[data-oum-word]");
    if (pb) pb.addEventListener("click", function () { chop(oum(D, o)); });
    if (wb) wb.addEventListener("click", function () { word(oum(D, o), (o.fan || "fan") + " — O‘UM"); });
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
  function word(html, nom) {
    var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>' + esc(nom) +
      "</title><style>body{font-family:'Times New Roman';font-size:14pt;color:#000}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:4px;vertical-align:top}h1,h2,h3,h4{color:#000}.no-print,video,img,input,details>summary{display:none}.kv{display:block}.kv>div:nth-child(odd){font-weight:bold;margin-top:6pt}</style></head><body>" + html + "</body></html>";
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + doc], { type: "application/msword" }));
    a.download = nom.replace(/[\\/:*?"<>|]+/g, " ").trim() + ".doc"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  window.t1RTR = { render: render, oum: oum, chop: chop, word: word, esc: esc, md: md, tbl: tbl };
})();
