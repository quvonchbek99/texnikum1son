/* YHQ Test 2026 — natija va AI xulosani PDF faylga saqlash (faqat sayt varianti).
 * ai.js tugma bosilganda shu faylni yuklaydi; bu fayl esa jsPDF (js/vendor/jspdf.umd.min.js, MIT) va
 * DejaVu Sans shriftini (fonts/*.ttf — lotin, kirill, ʻ ʼ belgilari bilan kichraytirilgan nusxa) yuklaydi.
 * Sahifa: A4, faqat qora matn va chiziqlar (oq-qora printerga mos), sahifa raqamlari bilan.
 * YHQPDF.save(spec) — spec: { file, title, sub, url, meta: [[nom, qiymat]], sections: [{h, ai | lines | items | list}], note, footer } */
(function () {
  'use strict';
  if (window.YHQPDF) return;
  var LIB = 'js/vendor/jspdf.umd.min.js', FN = 'fonts/DejaVuSans-yhq.ttf', FB = 'fonts/DejaVuSans-Bold-yhq.ttf';
  var PW = 210, PH = 297, ML = 18, MR = 18, MT = 17, MB = 20, W = PW - ML - MR, K = 0.3528; // mm/pt
  var ready = null;

  function script(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = function () { res(); }; s.onerror = function () { rej(new Error('PDF kutubxonasi yuklanmadi')); };
      document.head.appendChild(s);
    });
  }
  function b64(buf) {
    var u = new Uint8Array(buf), s = '';
    for (var i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function font(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('Shrift yuklanmadi'); return r.arrayBuffer(); }).then(b64);
  }
  function prep() {
    if (ready) return ready;
    ready = Promise.all([window.jspdf ? null : script(LIB), font(FN), font(FB)]).then(function (r) {
      if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('PDF kutubxonasi topilmadi');
      return { n: r[1], b: r[2] };
    });
    ready['catch'](function () { ready = null; });
    return ready;
  }

  /* matn: lotin/kirill (sozlamaga koʻra), ^{1} → ¹, shriftda yoʻq belgilar (emoji va h.k.) olib tashlanadi */
  var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function tx(s, raw) { // raw — manzil (URL) kabi lotinda qolishi kerak boʻlgan matn
    s = String(s == null ? '' : s);
    if (window.YHQApp && !raw) s = YHQApp.T(s);
    return s.replace(/\^\{?(\d+)\}?/g, function (_, d) { return d.split('').map(function (c) { return SUP.charAt(+c); }).join(''); })
      .replace(/[\u00A0\u202F\u2007]/g, ' ').replace(/\u2011/g, '-').replace(/\t/g, ' ')
      .replace(/[\u200B-\u200F\u2028-\u202E\u2060-\u206F]/g, '')
      .replace(/[^\n\u0020-\u007E\u00A0-\u024F\u02B0-\u02FF\u0400-\u052F\u2000-\u206F\u2070-\u209F\u20AC\u2116\u2122\u2190-\u21FF\u2212\u2260-\u2265\u2713-\u2717\u25A0-\u25CF]/g, '');
  }
  /* **qalin** belgilari boʻyicha boʻlaklar */
  function segs(s, bold) {
    var out = [], re = /\*\*([^*]+)\*\*/g, m, last = 0;
    s = tx(s);
    while ((m = re.exec(s))) { if (m.index > last) out.push({ t: s.slice(last, m.index), b: !!bold }); out.push({ t: m[1], b: true }); last = re.lastIndex; }
    if (last < s.length) out.push({ t: s.slice(last), b: !!bold });
    return out.map(function (g) { g.t = g.t.replace(/(^|\s)\*([^*\s][^*]*?)\*(?=\s|[.,;:!?]|$)/g, '$1$2'); return g; });
  }

  function build(F, spec) {
    var d = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true });
    d.addFileToVFS('DejaVuSans.ttf', F.n); d.addFont('DejaVuSans.ttf', 'DejaVu', 'normal');
    d.addFileToVFS('DejaVuSans-Bold.ttf', F.b); d.addFont('DejaVuSans-Bold.ttf', 'DejaVu', 'bold');
    d.setFont('DejaVu', 'normal'); d.setTextColor(0, 0, 0); d.setDrawColor(0, 0, 0);
    d.setProperties({ title: tx(spec.title), subject: tx(spec.title), author: 'YHQ Test 2026', creator: 'texnikum1son.uz/avtotest', keywords: 'YHQ, avtotest' });
    var y = MT;
    function lh(size) { return size * K * 1.4; }
    function need(h) { if (y + h > PH - MB) { d.addPage(); y = MT; } }
    function font(b, size) { d.setFont('DejaVu', b ? 'bold' : 'normal'); if (size) d.setFontSize(size); }
    function wid(t, b) { font(b); return d.getTextWidth(t); }
    /* boʻlaklarni soʻzlarga ajratib, kenglikka sigʻdirib chizish */
    function rich(parts, o) {
      o = o || {};
      var size = o.size || 10, x0 = ML + (o.indent || 0), width = W - (o.indent || 0), h = lh(size), first = true;
      d.setFontSize(size);
      var toks = [];
      parts.forEach(function (p) {
        p.t.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { if (toks.length) toks[toks.length - 1].sp = true; return; }
          // juda uzun soʻz (havola va h.k.) — boʻlib yuboriladi
          while (wid(w, p.b) > width && w.length > 1) {
            var k = w.length; while (k > 1 && wid(w.slice(0, k), p.b) > width) k--;
            toks.push({ t: w.slice(0, k), b: p.b }); w = w.slice(k);
          }
          toks.push({ t: w, b: p.b });
        });
      });
      var line = [], lw = 0;
      function flush() {
        need(h);
        if (first && o.bullet) { font(false); d.text(o.bullet, x0 - 4.5, y, { baseline: 'top' }); }
        var x = x0;
        line.forEach(function (tk) { font(tk.b); d.text(tk.t, x, y, { baseline: 'top' }); x += tk.w + (tk.sp ? tk.spw : 0); });
        y += h; line = []; lw = 0; first = false;
      }
      toks.forEach(function (tk) {
        tk.w = wid(tk.t, tk.b); tk.spw = wid(' ', tk.b);
        var prev = line[line.length - 1], add = prev && prev.sp ? prev.spw : 0;
        if (line.length && lw + add + tk.w > width) { flush(); add = 0; }
        lw += add + tk.w; line.push(tk);
      });
      if (line.length || first) flush();
      if (o.after) y += o.after;
    }
    function rule(wd, gap) { d.setLineWidth(wd); d.line(ML, y, PW - MR, y); y += gap || 2.5; }
    function heading(t) {
      need(lh(12.5) + lh(10) * 2 + 4); y += 3;
      rich([{ t: tx(t), b: true }], { size: 12.5 }); y += 0.6; rule(0.25, 2.6);
    }

    // sarlavha
    rich([{ t: tx(spec.title), b: true }], { size: 16 });
    rich([{ t: tx(spec.sub) + (spec.url ? '  ·  ' + tx(spec.url, true) : ''), b: false }], { size: 9, after: 1.5 });
    rule(0.6, 3.5);
    (spec.meta || []).forEach(function (r) { rich([{ t: tx(r[0]) + ': ', b: true }, { t: tx(r[1]), b: false }], { size: 10.5, after: 0.4 }); });
    (spec.sections || []).forEach(function (s) {
      heading(s.h);
      if (s.ai) {
        String(s.ai).replace(/\r/g, '').split('\n').forEach(function (ln) {
          var t = ln.replace(/^\s*#+\s*/, '').trim(); if (!t) { y += 1.2; return; }
          var m = /^[-*•–]\s+(.*)$/.exec(t);
          if (m) rich(segs(m[1]), { indent: 5, bullet: '•', after: 0.6 });
          else rich(segs(t), { after: 0.8 });
        });
      }
      (s.lines || []).forEach(function (t) { rich(segs(t), { after: 0.8 }); });
      (s.list || []).forEach(function (t) { rich(segs(t), { indent: 5, bullet: '•', after: 0.4 }); });
      (s.items || []).forEach(function (it) {
        need(lh(10.5) * 3);
        rich(segs(it.head, true), { size: 10.5, after: 0.3 });
        if (it.sub) rich([{ t: tx(it.sub), b: false }], { size: 8.8, indent: 5, after: 0.3 });
        (it.rows || []).forEach(function (r) { if (r[1]) rich([{ t: tx(r[0]) + ': ', b: true }, { t: tx(r[1]), b: false }], { size: 9.6, indent: 5, after: 0.2 }); });
        y += 2.2;
      });
      if (s.more) rich([{ t: tx(s.more), b: false }], { size: 9.6, after: 0.5 });
    });
    if (spec.note) { y += 3; need(lh(8.5) * 3); rule(0.25, 2); rich([{ t: tx(spec.note), b: false }], { size: 8.5 }); }
    // pastki yozuv va sahifa raqamlari
    var n = d.getNumberOfPages();
    for (var i = 1; i <= n; i++) {
      d.setPage(i); d.setLineWidth(0.2); d.line(ML, PH - 14, PW - MR, PH - 14);
      font(false, 8); d.text(tx(spec.footer || '') + (spec.url ? '  ·  ' + tx(spec.url, true) : ''), ML, PH - 12.6, { baseline: 'top' });
      d.text(i + ' / ' + n, PW - MR, PH - 12.6, { baseline: 'top', align: 'right' });
    }
    d.save(spec.file || 'YHQ-Test.pdf');
    return true;
  }

  window.YHQPDF = { save: function (spec) { return prep().then(function (F) { return build(F, spec); }); }, _tx: tx };
})();
