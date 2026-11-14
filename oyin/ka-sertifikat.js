/*!
 * Kuvonch Academy — viktorina sertifikati (PDF), internet va kutubxonasiz.
 * Oq-qora: faqat qora chiziq va matn — oddiy printerda ham chiroyli chiqadi.
 * API: kaSertifikat.canvas(d, w) / .pdf([d, ...], cb?) -> Blob / .save(blob, nom) / .share(blob, nom) -> Promise<bool>
 *   d = { name, full, group, topic, rank, of, correct, total, score, date, kind? }
 */
(function () {
  "use strict";
  if (window.kaSertifikat) return;
  var SERIF = "Georgia, 'Times New Roman', 'Noto Serif', 'DejaVu Serif', serif";
  var SANS = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
  var INK = "#111";

  function spaced(ctx, text, x, y, sp) { // markazlashtirilgan, harflar orasi ochiq matn
    var chars = String(text).split(""), w = 0, i;
    for (i = 0; i < chars.length; i++) w += ctx.measureText(chars[i]).width + (i < chars.length - 1 ? sp : 0);
    var cx = x - w / 2, al = ctx.textAlign; ctx.textAlign = "left";
    for (i = 0; i < chars.length; i++) { ctx.fillText(chars[i], cx, y); cx += ctx.measureText(chars[i]).width + sp; }
    ctx.textAlign = al; return w;
  }
  function fitFont(ctx, text, maxW, size, min, fam, weight) {
    var s = size; do { ctx.font = (weight || "") + " " + s + "px " + fam; if (ctx.measureText(text).width <= maxW) break; s -= 2; } while (s > min);
    return s;
  }
  function wrap(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); return lines;
  }
  function diamond(ctx, x, y, r, fill) { ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); if (fill) ctx.fill(); else ctx.stroke(); }
  function corner(ctx, x, y, sx, sy, k) { // burchak bezagi
    ctx.lineWidth = 2 * k;
    ctx.beginPath(); ctx.moveTo(x, y + sy * 70 * k); ctx.lineTo(x, y); ctx.lineTo(x + sx * 70 * k, y); ctx.stroke();
    ctx.lineWidth = 1.2 * k;
    ctx.beginPath(); ctx.arc(x + sx * 22 * k, y + sy * 22 * k, 13 * k, 0, Math.PI * 2); ctx.stroke();
    diamond(ctx, x + sx * 22 * k, y + sy * 22 * k, 5 * k, true);
    ctx.beginPath(); ctx.moveTo(x + sx * 44 * k, y + sy * 10 * k); ctx.lineTo(x + sx * 90 * k, y + sy * 10 * k); ctx.moveTo(x + sx * 10 * k, y + sy * 44 * k); ctx.lineTo(x + sx * 10 * k, y + sy * 90 * k); ctx.stroke();
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul ? Math.imul(h, 16777619) : (h * 16777619) | 0; } return (h >>> 0).toString(36).toUpperCase(); }
  function certNo(d) { var h = hash([d.full || d.name, d.topic, d.date, d.score, d.correct].join("|")); return "KA-" + ("000000" + h).slice(-6); }
  function kindOf(d) { return d.kind || (d.correct && d.rank === 1 ? "1-O'RIN · G'OLIB" : d.correct && d.rank === 2 ? "2-O'RIN · SOVRINDOR" : d.correct && d.rank === 3 ? "3-O'RIN · SOVRINDOR" : "JONLI VIKTORINA"); }
  /* Unvon — o'quvchi nechta savolni to'g'ri yechganiga qarab (fan nomidan qat'i nazar).
     [chegara (aniqlik ulushi), unvon, yulduzlar, ekrandagi belgi] */
  var UNVON = [[1, "Mutlaq bilimdon", 5, "🏆"], [0.9, "Oltin bilimdon", 5, "🥇"], [0.75, "Kumush bilimdon", 4, "🥈"], [0.6, "Bronza bilimdon", 3, "🥉"],
    [0.4, "Zukko izlanuvchi", 2, "📘"], [1e-6, "Faol ishtirokchi", 1, "✨"], [0, "Ishtirokchi", 0, "🌱"]];
  function unvon(correct, total) {
    var a = total ? Math.max(0, correct || 0) / total : 0;
    for (var i = 0; i < UNVON.length; i++) if (a >= UNVON[i][0] - 1e-9) return { name: UNVON[i][1], stars: UNVON[i][2], icon: UNVON[i][3], pct: Math.round(a * 100) };
    return { name: "Ishtirokchi", stars: 0, icon: "🌱", pct: 0 };
  }
  function star(ctx, x, y, r, fill) { // besh qirrali yulduz: to'ldirilgan (qo'lga kiritilgan) yoki faqat chiziq (oq-qora printer uchun)
    ctx.beginPath();
    for (var i = 0; i < 10; i++) { var an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx[i ? "lineTo" : "moveTo"](x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
    ctx.closePath(); if (fill) ctx.fill(); else ctx.stroke();
  }

  function canvas(d, W) {
    W = W || 1754; var Hh = Math.round(W / 1.4142), k = W / 1754;
    var c = document.createElement("canvas"); c.width = W; c.height = Hh;
    var ctx = c.getContext("2d"), cx = W / 2;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Hh);
    ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    // ramka: qalin + ingichka, burchak bezaklari
    ctx.lineWidth = 9 * k; ctx.strokeRect(36 * k, 36 * k, W - 72 * k, Hh - 72 * k);
    ctx.lineWidth = 2 * k; ctx.strokeRect(58 * k, 58 * k, W - 116 * k, Hh - 116 * k);
    ctx.lineWidth = 1 * k; ctx.strokeRect(66 * k, 66 * k, W - 132 * k, Hh - 132 * k);
    corner(ctx, 82 * k, 82 * k, 1, 1, k); corner(ctx, W - 82 * k, 82 * k, -1, 1, k); corner(ctx, 82 * k, Hh - 82 * k, 1, -1, k); corner(ctx, W - 82 * k, Hh - 82 * k, -1, -1, k);
    // gerb: doira ichida π
    var ey = 168 * k;
    ctx.lineWidth = 4 * k; ctx.beginPath(); ctx.arc(cx, ey, 56 * k, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.arc(cx, ey, 47 * k, 0, Math.PI * 2); ctx.stroke();
    for (var i = 0; i < 24; i++) { var an = i * Math.PI / 12; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * 60 * k, ey + Math.sin(an) * 60 * k); ctx.lineTo(cx + Math.cos(an) * 68 * k, ey + Math.sin(an) * 68 * k); ctx.stroke(); }
    ctx.font = "bold " + Math.round(66 * k) + "px " + SERIF; ctx.fillText("π", cx, ey + 22 * k);
    ctx.font = "bold " + Math.round(25 * k) + "px " + SANS; spaced(ctx, "KUVONCH ACADEMY", cx, 272 * k, 9 * k);
    // sarlavha
    ctx.font = "bold " + Math.round(104 * k) + "px " + SERIF; spaced(ctx, "SERTIFIKAT", cx, 392 * k, 16 * k);
    var kind = kindOf(d);
    ctx.font = "bold " + Math.round(29 * k) + "px " + SANS; var kw = spaced(ctx, kind, cx, 452 * k, 5 * k);
    ctx.lineWidth = 1.5 * k;
    ctx.beginPath(); ctx.moveTo(cx - kw / 2 - 40 * k, 442 * k); ctx.lineTo(cx - kw / 2 - 210 * k, 442 * k); ctx.moveTo(cx + kw / 2 + 40 * k, 442 * k); ctx.lineTo(cx + kw / 2 + 210 * k, 442 * k); ctx.stroke();
    diamond(ctx, cx - kw / 2 - 26 * k, 442 * k, 6 * k, true); diamond(ctx, cx + kw / 2 + 26 * k, 442 * k, 6 * k, true);
    // ism
    ctx.font = "italic " + Math.round(25 * k) + "px " + SERIF; ctx.fillText("Taqdirlanuvchi", cx, 528 * k);
    var nm = String(d.full || d.name || "").trim() || "O'quvchi";
    fitFont(ctx, nm, 1260 * k, Math.round(78 * k), Math.round(36 * k), SERIF, "bold"); ctx.fillText(nm, cx, 616 * k);
    ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.moveTo(cx - 560 * k, 644 * k); ctx.lineTo(cx + 560 * k, 644 * k); ctx.stroke();
    var y = 644, nick = d.full && d.name && d.name !== d.full;
    if (nick) { ctx.font = Math.round(22 * k) + "px " + SANS; ctx.fillText("(" + d.name + ")", cx, 676 * k); y = 676; }
    // unvon: yulduzlar + unvon nomi
    var u = d.unvon && d.unvon.name ? d.unvon : unvon(d.correct, d.total);
    ctx.lineWidth = 2 * k;
    for (var si = 0; si < 5; si++) star(ctx, cx + (si - 2) * 46 * k, (y + 44) * k, 17 * k, si < u.stars);
    ctx.font = "bold " + Math.round(38 * k) + "px " + SERIF; var uw = spaced(ctx, u.name.toUpperCase(), cx, (y + 100) * k, 6 * k);
    ctx.font = "italic " + Math.round(20 * k) + "px " + SERIF; ctx.fillText("unvoni", cx, (y + 126) * k);
    ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.moveTo(cx - uw / 2 - 30 * k, (y + 88) * k); ctx.lineTo(cx - uw / 2 - 120 * k, (y + 88) * k); ctx.moveTo(cx + uw / 2 + 30 * k, (y + 88) * k); ctx.lineTo(cx + uw / 2 + 120 * k, (y + 88) * k); ctx.stroke();
    // matn
    var topic = String(d.topic || "Jonli viktorina");
    var body = d.correct && !d.rank ? "«" + topic + "» bo'yicha viktorinada " + d.total + " ta savoldan " + d.correct + " tasiga to'g'ri javob berib, «" + u.name + "» unvoniga sazovor bo'ldi." :
      d.correct ? "«" + topic + "» bo'yicha jonli viktorinada " + d.total + " ta savoldan " + d.correct + " tasiga to'g'ri javob berib, " +
      d.of + " nafar ishtirokchi orasida " + d.rank + "-o'rinni egalladi va «" + u.name + "» unvoniga sazovor bo'ldi." :
      "«" + topic + "» bo'yicha jonli viktorinada ishtirok etdi. Keyingi safar albatta yaxshiroq natija bo'ladi!";
    var fs = 25, lh = 35, lines;
    ctx.font = Math.round(fs * k) + "px " + SANS; lines = wrap(ctx, body, 1300 * k);
    if (lines.length > 2 && nick) { fs = 22; lh = 31; ctx.font = Math.round(fs * k) + "px " + SANS; lines = wrap(ctx, body, 1360 * k); }
    lines = lines.slice(0, 3);
    var ly = y + 166;
    lines.forEach(function (ln, j) { ctx.fillText(ln, cx, (ly + j * lh) * k); });
    // natija qutilari
    var acc = d.total ? Math.round(d.correct / d.total * 100) : 0;
    var boxes = [["O'RIN", d.rank ? d.rank + " / " + d.of : "—"], ["TO'G'RI JAVOB", d.correct + " / " + d.total], ["ANIQLIK", acc + "%"], ["OCHKO", String(d.score || 0)]];
    var bw = 250 * k, gap = 34 * k, bx = cx - (boxes.length * bw + (boxes.length - 1) * gap) / 2, by = 912 * k, bh = 88 * k;
    boxes.forEach(function (b, j) {
      var x = bx + j * (bw + gap);
      ctx.lineWidth = 2 * k; ctx.strokeRect(x, by, bw, bh); ctx.lineWidth = 0.8 * k; ctx.strokeRect(x + 6 * k, by + 6 * k, bw - 12 * k, bh - 12 * k);
      ctx.font = "bold " + Math.round(16 * k) + "px " + SANS; spaced(ctx, b[0], x + bw / 2, by + 32 * k, 2.5 * k);
      ctx.font = "bold " + Math.round(34 * k) + "px " + SERIF; ctx.fillText(b[1], x + bw / 2, by + 72 * k);
    });
    // pastki qism: sana, raqam, imzo
    var fy = 1062 * k;
    ctx.textAlign = "left"; ctx.font = Math.round(19 * k) + "px " + SANS; ctx.fillText("Sana", 170 * k, fy - 34 * k);
    ctx.font = "bold " + Math.round(28 * k) + "px " + SERIF; ctx.fillText(d.date || "", 170 * k, fy);
    if (d.group) { ctx.font = Math.round(21 * k) + "px " + SANS; ctx.fillText("Guruh: " + d.group, 170 * k, fy + 36 * k); }
    ctx.textAlign = "center"; ctx.font = Math.round(19 * k) + "px " + SANS; ctx.fillText("Sertifikat raqami", cx, fy - 34 * k);
    ctx.font = "bold " + Math.round(27 * k) + "px " + "ui-monospace, Menlo, Consolas, monospace"; ctx.fillText("№ " + certNo(d), cx, fy);
    ctx.font = Math.round(20 * k) + "px " + SANS; ctx.fillText("kuvonch.uz", cx, fy + 34 * k);
    ctx.textAlign = "right"; ctx.lineWidth = 1.5 * k; ctx.beginPath(); ctx.moveTo(W - 470 * k, fy); ctx.lineTo(W - 170 * k, fy); ctx.stroke();
    ctx.font = Math.round(19 * k) + "px " + SANS; ctx.fillText("O'qituvchi imzosi", W - 170 * k, fy + 30 * k);
    ctx.textAlign = "center";
    return c;
  }

  /* ---- minimal PDF yozuvchi: har sahifada bitta JPEG rasm (A4 albom) ---- */
  function bytes(s) { var u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; }
  function jpeg(c, q) { var b64 = c.toDataURL("image/jpeg", q || 0.9).split(",")[1], bin = atob(b64), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return { data: u, w: c.width, h: c.height }; }
  function build(pages) {
    var chunks = [], off = 0, xref = [], W = "841.89", Hh = "595.28", n = pages.length, i;
    function push(x) { var u = typeof x === "string" ? bytes(x) : x; chunks.push(u); off += u.length; }
    function obj(id, body) { xref[id] = off; push(id + " 0 obj\n"); if (typeof body === "function") body(); else push(body); push("\nendobj\n"); }
    push("%PDF-1.4\n%âãÏÓ\n");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    var kids = []; for (i = 0; i < n; i++) kids.push((4 + 3 * i) + " 0 R");
    obj(2, "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + n + " >>");
    obj(3, "<< /Title (Kuvonch Academy sertifikat) /Producer (kuvonch.uz) >>");
    pages.forEach(function (p, j) {
      var pid = 4 + 3 * j, iid = pid + 1, cid = pid + 2, cs = "q " + W + " 0 0 " + Hh + " 0 0 cm /Im" + j + " Do Q";
      obj(pid, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + Hh + "] /Resources << /XObject << /Im" + j + " " + iid + " 0 R >> >> /Contents " + cid + " 0 R >>");
      obj(iid, function () { push("<< /Type /XObject /Subtype /Image /Width " + p.w + " /Height " + p.h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + p.data.length + " >>\nstream\n"); push(p.data); push("\nendstream"); });
      obj(cid, "<< /Length " + cs.length + " >>\nstream\n" + cs + "\nendstream");
    });
    var total = 4 + 3 * n, xo = off;
    push("xref\n0 " + total + "\n0000000000 65535 f \n");
    for (i = 1; i < total; i++) push(("0000000000" + xref[i]).slice(-10) + " 00000 n \n");
    push("trailer\n<< /Size " + total + " /Root 1 0 R /Info 3 0 R >>\nstartxref\n" + xo + "\n%%EOF\n");
    return new Blob(chunks, { type: "application/pdf" });
  }
  // ko'p sahifali (o'qituvchi uchun) — brauzer qotib qolmasligi uchun bo'lib-bo'lib chiziladi
  function pdf(list, onProgress) {
    var many = list.length > 1, pages = [], i = 0;
    // har safar bitta sahifa — sahifa (va tugmalar) qotib qolmasin; xato bo'lsa tugma "⏳" holatida qolmasligi uchun reject
    return new Promise(function (res, rej) {
      (function step() {
        try {
          if (i < list.length) { pages.push(jpeg(canvas(list[i], many ? 1404 : 1754), many ? 0.82 : 0.9)); i++; }
          if (onProgress) onProgress(i, list.length);
          if (i < list.length) setTimeout(step, 16); else res(build(pages));
        } catch (e) { rej(e); }
      })();
    });
  }
  function fileName(s) { return String(s || "sertifikat").replace(/[\\\/:*?"<>|]+/g, "").replace(/\s+/g, "-").slice(0, 60) + ".pdf"; }
  function save(blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = fileName(name); a.rel = "noopener"; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 8000);
  }
  function share(blob, name) {
    try {
      var f = new File([blob], fileName(name), { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], title: "Sertifikat — Kuvonch Academy" }).then(function () { return true; }, function () { return false; });
    } catch (e) {}
    return Promise.resolve(false);
  }
  function canShareFiles() { try { return !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([""], "a.pdf", { type: "application/pdf" })] })); } catch (e) { return false; } }
  window.kaSertifikat = { canvas: canvas, pdf: pdf, save: save, share: share, canShare: canShareFiles, no: certNo, kind: kindOf, unvon: unvon };
})();
