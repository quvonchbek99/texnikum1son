/* Yo'l harakati qoidalari 2026 — oflayn ilova */
(function () {
  'use strict';
  var D = window.APPDATA, TR = window.Translit;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var view = $('#view');

  /* ---------- saqlash ---------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('yhq_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('yhq_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var S = {
    script: LS.get('script', 'lat'), theme: LS.get('theme', 'auto'), fs: LS.get('fs', 16),
    bhm: LS.get('bhm', D.meta.bhm), saved: LS.get('saved', []), last: LS.get('last', null),
    wrong: LS.get('wrong', []), best: LS.get('best', {})
  };
  function save(k) { LS.set(k, S[k]); }

  /* ---------- yordamchilar ---------- */
  function T(s) { return S.script === 'cyr' ? TR.toCyr(s) : s; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function supf(h) { return h.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/_\{([^}]*)\}/g, '<sub>$1</sub>'); }
  function tx(s) { return supf(esc(T(s))); }               // oddiy matn
  function idEnc(s) { return String(s).replace(/\^\{(\d+)\}/g, '-$1'); }   // 17^{1} -> 17-1
  function idDec(s) { return String(s).replace(/-(\d+)$/, '^{$1}'); }
  function som(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + T('soʻm'); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(function () { t.classList.remove('on'); }, 1800); }
  var IC = {
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
    sign: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    road: 'M3 20 8 4h2L6.6 20zm18 0L16 4h-2l3.4 16zM11 4.5h2v3h-2zm0 5.5h2v4h-2zm0 6h2v4h-2z',
    fine: 'M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z',
    quiz: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    starb: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
    gear: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z',
    info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    light: 'M20 10h-3V8.86c1.72-.45 3-2 3-3.86h-3V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H4c0 1.86 1.28 3.41 3 3.86V10H4c0 1.86 1.28 3.41 3 3.86V15H4c0 1.86 1.28 3.41 3 3.86V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.14c1.72-.45 3-2 3-3.86h-3v-1.14c1.72-.45 3-2 3-3.86zm-8 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
    wrench: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
    hazard: 'M12 2 2 12l10 10 10-10L12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    chev: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    dl: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    web: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    game: 'M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
    search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
  };
  function ic(n, cls) { return '<svg viewBox="0 0 24 24"' + (cls ? ' class="' + cls + '"' : '') + '><path d="' + IC[n] + '"/></svg>'; }
  var CHEV = ic('chev', 'chev');

  /* ---------- indekslar ---------- */
  var PT = {};      // band raqami -> bob raqami
  D.rules.forEach(function (c) { c.p.forEach(function (p) { if (p.n) PT[p.n] = c.n; }); });
  var SIGN = {}, SIGNGRP = {}, SIGNLIST = [];
  D.signs.groups.forEach(function (g) {
    g.items.forEach(function (e) { e.nums.forEach(function (n) { SIGN[n] = e; }); SIGNGRP[e.id] = g; SIGNLIST.push(e); });
  });
  function imgOf(n) { var e = SIGN[n]; if (!e) return ''; var i = e.nums.indexOf(n); var f = e.img[Math.min(i, e.img.length - 1)] || e.img[0]; return 'img/signs/' + f; }
  function imgFor(n) { // aniq raqamga mos rasm
    var e = SIGN[n]; if (!e) return '';
    var f = e.img.filter(function (x) { return x.replace(/\.(svg|png)$/, '') === n; })[0];
    return 'img/signs/' + (f || e.img[0]);
  }

  /* ---------- boy matn: belgi va bandlarga havola ---------- */
  var REF = /(\d\.\d{1,2}(?:\.\d{1,2})?)((?:\.?\s*(?:,|—|–|va)\s*\d\.\d{1,2}(?:\.\d{1,2})?)*)(\.?\s+(?:yoʻl\s+|qoʻshimcha[- ]axborot\s+|ogohlantiruvchi\s+|taqiqlovchi\s+|axborot-koʻrsatkich\s+)?belgi)/g;
  var BAND = /(\d{1,3}(?:\^\{\d+\})?)-band/g;
  function rich(s) {
    if (s == null) return '';
    var out = '', last = 0, m, re = /\[\[TABLE:(.*?)\]\]/g;
    while ((m = re.exec(s))) { out += richText(s.slice(last, m.index)); out += table(JSON.parse(m[1])); last = re.lastIndex; }
    return out + richText(s.slice(last));
  }
  function richText(s) {
    var segs = [], last = 0, m;
    var marks = [];
    REF.lastIndex = 0;
    while ((m = REF.exec(s))) {
      var span = m[1] + m[2], st = m.index;
      var nre = /\d\.\d{1,2}(?:\.\d{1,2})?/g, k;
      while ((k = nre.exec(span))) { if (SIGN[k[0]]) marks.push({ a: st + k.index, b: st + k.index + k[0].length, h: '#/sign/' + k[0] }); }
    }
    BAND.lastIndex = 0;
    while ((m = BAND.exec(s))) { if (PT[m[1]]) marks.push({ a: m.index, b: m.index + m[1].length, h: '#/pt/' + idEnc(m[1]) }); }
    marks.sort(function (x, y) { return x.a - y.a; });
    var html = '';
    marks.forEach(function (mk) {
      if (mk.a < last) return;
      html += tx(s.slice(last, mk.a)) + '<a class="sl" href="' + mk.h + '">' + tx(s.slice(mk.a, mk.b)) + '</a>';
      last = mk.b;
    });
    return html + tx(s.slice(last));
  }
  function table(rows) {
    return '<table class="t">' + rows.map(function (r, i) { return '<tr>' + r.map(function (c) { return (i ? '<td>' : '<th>') + tx(c) + (i ? '</td>' : '</th>'); }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ---------- navigatsiya ---------- */
  var NAV = [
    ['', 'home', 'Asosiy'], ['rules', 'book', 'Qoidalar'], ['signs', 'sign', 'Belgilar'], ['marks', 'road', 'Chiziqlar'],
    ['fines', 'fine', 'Jarimalar'], ['viktorina.html', 'game', 'Oʻyinlar'], ['quiz', 'quiz', 'Belgilar testi'], ['saved', 'starb', 'Saqlanganlar'], ['settings', 'gear', 'Sozlamalar'], ['about', 'info', 'Ilova haqida']
  ];
  var BOTTOM = ['', 'rules', 'signs', 'fines', 'viktorina.html'];
  if (window.YHQ_WEB) NAV.push(['yuklab/YHQ-2026.apk', 'dl', 'Android ilova (APK)'], ['../', 'web', 'texnikum1son.uz']);
  function drawNav() {
    var cur = (location.hash.replace(/^#\/?/, '').split('/')[0]) || '';
    var alias = { sign: 'signs', chap: 'rules', pt: 'rules', fine: 'fines', mark: 'marks' };
    cur = alias[cur] || cur;
    function a(n) { var ext = /\.(html|apk)$|^\.\.\//.test(n[0]); return '<a href="' + (ext ? n[0] : '#/' + n[0]) + '"' + (/\.apk$/.test(n[0]) ? ' download' : '') + ' class="' + (cur === n[0] ? 'on' : '') + '">' + ic(n[1]) + '<span>' + esc(T(n[2])) + '</span></a>'; }
    $('#side').innerHTML = NAV.map(a).join('');
    $('#bnav').innerHTML = NAV.filter(function (n) { return BOTTOM.indexOf(n[0]) >= 0; }).map(a).join('');
  }
  function setTitle(t, back) { $('#ttl').innerHTML = supf(esc(T(t))); $('#bk').style.display = back ? '' : 'none'; document.title = T(t); }
  var ROUTES = [];
  function route(re, fn) { ROUTES.push([re, fn]); }
  var scrollMem = {};
  function render() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    var path = h.split('?')[0], q = {};
    (h.split('?')[1] || '').split('&').forEach(function (kv) { if (kv) { var p = kv.split('='); q[p[0]] = decodeURIComponent(p[1] || ''); } });
    for (var i = 0; i < ROUTES.length; i++) {
      var m = path.match(ROUTES[i][0]);
      if (m) { ROUTES[i][1].apply(null, m.slice(1).concat([q])); break; }
    }
    drawNav();
    var y = scrollMem[location.hash];
    view.scrollTop = (y != null && !render.noRestore) ? y : 0;
    render.noRestore = false;
  }
  view.addEventListener('scroll', function () { scrollMem[location.hash] = view.scrollTop; });
  window.addEventListener('hashchange', render);
  $('#bk').onclick = function () { goBack(); };
  $('#srch').onclick = function () { location.hash = '#/search'; };
  $('#scr').onclick = function () { S.script = S.script === 'cyr' ? 'lat' : 'cyr'; save('script'); applyPrefs(); render(); };
  function goBack() {
    if ($('#ov').classList.contains('on')) { closeOv(); return true; }
    var h = location.hash.replace(/^#\/?/, '');
    if (!h) return false;
    if (history.length > 1) history.back(); else location.hash = '#/';
    return true;
  }
  window.appBack = goBack; // Android "orqaga" tugmasi uchun

  /* ---------- rasmni kattalashtirish ---------- */
  function openOv(src) { $('#ovi').src = src; $('#ov').classList.add('on'); $('#ov').classList.remove('full'); }
  function closeOv() { $('#ov').classList.remove('on'); }
  $('#ovx').onclick = closeOv;
  $('#ov').onclick = function (e) { if (e.target.id === 'ovi') $('#ov').classList.toggle('full'); else if (e.target.closest('.x') == null) closeOv(); };
  view.addEventListener('click', function (e) {
    var im = e.target.closest('[data-zoom]');
    if (im) { openOv(im.getAttribute('data-zoom')); return; }
    var st = e.target.closest('[data-star]');
    if (st) { toggleSaved(JSON.parse(st.getAttribute('data-star'))); st.classList.toggle('on', isSaved(JSON.parse(st.getAttribute('data-star')))); st.innerHTML = ic(isSaved(JSON.parse(st.getAttribute('data-star'))) ? 'star' : 'starb'); }
  });

  /* ---------- saqlanganlar ---------- */
  function key(o) { return o.t + ':' + o.id; }
  function isSaved(o) { return S.saved.some(function (x) { return key(x) === key(o); }); }
  function toggleSaved(o) {
    if (isSaved(o)) { S.saved = S.saved.filter(function (x) { return key(x) !== key(o); }); toast(T('Saqlanganlardan olib tashlandi')); }
    else { S.saved.unshift(o); toast(T('Saqlandi')); }
    save('saved');
  }
  function starBtn(o) { var on = isSaved(o); return '<button class="star' + (on ? ' on' : '') + '" data-star=\'' + esc(JSON.stringify(o)) + '\' aria-label="Saqlash">' + ic(on ? 'star' : 'starb') + '</button>'; }

  /* ================= SAHIFALAR ================= */
  // Bosh sahifa
  route(/^$/, function () {
    setTitle('Yoʻl harakati qoidalari 2026', false);
    var cont = '';
    if (S.last) {
      var c = D.rules.filter(function (x) { return x.n === S.last; })[0];
      if (c) cont = '<a class="card row" href="#/chap/' + idEnc(c.n) + '" style="margin-bottom:12px"><span class="num">' + supf(esc(c.n)) + '</span><span class="t"><small>' + tx('Oʻqishni davom ettirish') + '</small><b>' + tx(c.title) + '</b></span>' + CHEV + '</a>';
    }
    var tiles = [
      ['rules', 'book', '#1d4fa0', 'Yoʻl harakati qoidalari', D.rules.length + ' bob, ' + Object.keys(PT).length + ' band'],
      ['signs', 'sign', '#e53935', 'Yoʻl belgilari', Object.keys(SIGN).length + ' ta belgi'],
      ['marks', 'road', '#455a64', 'Yoʻl chiziqlari', 'Yotiq va tik chiziqlar'],
      ['fines', 'fine', '#ef6c00', 'Jarimalar', 'MJtK, ' + D.fines.length + ' modda'],
      ['viktorina.html', 'game', '#46178f', 'Viktorina oʻyinlari', 'Jonli (Kahoot uslubida), jamoaviy, yakka'],
      ['quiz', 'quiz', '#2e7d32', 'Belgilar testi', 'Bilimingizni sinang'],
      ['signs/svetofor', 'light', '#6d4c41', 'Svetofor va taniqlik belgilari', 'Rasmiy rasmlar bilan'],
      ['apx/3', 'wrench', '#5e35b1', 'Nosozliklar roʻyxati', '3-ilova'],
      ['apx/4', 'hazard', '#c62828', 'Xavfli yuk belgilari', '4-ilova'],
      ['saved', 'star', '#f2a900', 'Saqlanganlar', S.saved.length + ' ta']
    ];
    view.innerHTML = '<div class="wrap">' +
      '<div class="hero"><h2>' + tx('Yoʻl harakati qoidalari') + '</h2><p>' + tx('Oʻzbekiston Respublikasi, 2026-yil tahriri. Internetsiz ishlaydi.') + '</p>' +
      '<form class="search" id="hs">' + ic('search') + '<input id="hq" type="search" placeholder="' + esc(T('Qoidalar, belgilar, jarimalardan qidirish...')) + '"></form></div>' + cont +
      '<div class="tiles">' + tiles.map(function (t) {
        return '<a class="card tile" href="' + (/\.html$/.test(t[0]) ? t[0] : '#/' + t[0]) + '"><span class="ic" style="background:' + t[2] + '">' + ic(t[1]) + '</span><b>' + tx(t[3]) + '</b><small>' + tx(t[4]) + '</small></a>';
      }).join('') + '</div>' +
      '<p class="foot">' + tx('Manba: lex.uz — Vazirlar Mahkamasining 172-son qarori (30.10.2026 tahriri) va MJtK.') +
      (window.YHQ_WEB ? '<br><a href="yuklab/YHQ-2026.apk" download>' + tx('Android ilovani yuklab olish') + '</a> · <a href="../">' + tx('texnikum1son.uz e-bazasi') + '</a>' : '') + '</p></div>';
    $('#hs').onsubmit = function (e) { e.preventDefault(); location.hash = '#/search?q=' + encodeURIComponent($('#hq').value); };
  });

  // Qoidalar: boblar ro'yxati
  route(/^rules$/, function () {
    setTitle('Yoʻl harakati qoidalari', false);
    view.innerHTML = '<div class="wrap"><div class="list">' + D.rules.map(function (c) {
      var pts = c.p.filter(function (p) { return p.n; });
      var rng = pts.length ? (pts[0].n + (pts.length > 1 ? ' — ' + pts[pts.length - 1].n : '')) : '';
      return '<a class="card row" href="#/chap/' + idEnc(c.n) + '"><span class="num">' + supf(esc(c.n)) + '</span><span class="t"><b>' + tx(c.title) + '</b><small>' + supf(esc(T(rng ? rng + '-bandlar' : ''))) + '</small></span>' + CHEV + '</a>';
    }).join('') + '</div>' + apxLinks() + '</div>';
  });
  function apxLinks() {
    return '<h2 class="sec">' + tx('Ilovalar') + '</h2><div class="list">' +
      '<a class="card row" href="#/signs"><span class="num">1</span><span class="t"><b>' + tx('Yoʻl belgilari') + '</b></span>' + CHEV + '</a>' +
      '<a class="card row" href="#/marks"><span class="num">2</span><span class="t"><b>' + tx('Yoʻl chiziqlari') + '</b></span>' + CHEV + '</a>' +
      '<a class="card row" href="#/apx/3"><span class="num">3</span><span class="t"><b>' + tx(D.il3.title) + '</b></span>' + CHEV + '</a>' +
      '<a class="card row" href="#/apx/4"><span class="num">4</span><span class="t"><b>' + tx(D.il4.title) + '</b></span>' + CHEV + '</a></div>';
  }
  // Bob matni
  function chapterHTML(c) {
    var html = '', open = false;
    c.p.forEach(function (p, i) {
      if (p.n) {
        if (open) html += '</div>';
        html += '<div class="pt" id="p-' + idEnc(p.n) + '">' + starBtn({ t: 'pt', id: p.n, title: p.n + '-band. ' + p.t.slice(0, 90) }) + '<p><span class="pn">' + supf(esc(p.n)) + '.</span>' + rich(p.t) + '</p>';
        open = true;
      } else {
        if (!open) { html += '<div class="pt">'; open = true; }
        var isSub = /[;:]$/.test(p.t) || /^[a-zʻ]/.test(p.t) || /^\d\.\d/.test(p.t);
        html += '<p class="' + (isSub ? 'sub' : '') + '">' + rich(p.t) + '</p>';
      }
    });
    if (open) html += '</div>';
    return html;
  }
  route(/^chap\/(.+)$/, function (cid, q) {
    var n = idDec(cid), idx = -1;
    D.rules.forEach(function (c, i) { if (c.n === n) idx = i; });
    var c = D.rules[idx]; if (!c) { location.hash = '#/rules'; return; }
    S.last = c.n; save('last');
    setTitle(n + '-bob', true);
    var prev = D.rules[idx - 1], next = D.rules[idx + 1];
    view.innerHTML = '<div class="wrap"><div class="card chap-h"><span class="pill">' + supf(esc(T(c.n + '-bob'))) + '</span><h2>' + tx(c.title) + '</h2></div>' +
      '<div class="card">' + chapterHTML(c) + '</div>' +
      '<div class="pager">' + (prev ? '<a class="btn sec" href="#/chap/' + idEnc(prev.n) + '">‹ ' + supf(esc(T(prev.n + '-bob'))) + '</a>' : '<span style="flex:1"></span>') +
      (next ? '<a class="btn" href="#/chap/' + idEnc(next.n) + '">' + supf(esc(T(next.n + '-bob'))) + ' ›</a>' : '<span style="flex:1"></span>') + '</div></div>';
    if (q.p) setTimeout(function () { var el = document.getElementById('p-' + q.p); if (el) { view.scrollTop = el.offsetTop - 8; el.classList.add('flash'); } }, 30);
    render.noRestore = !!q.p;
  });
  route(/^pt\/(.+)$/, function (pid) {
    var n = idDec(pid), ch = PT[n];
    if (ch) location.replace('#/chap/' + idEnc(ch) + '?p=' + idEnc(n)); else location.replace('#/rules');
  });

  // Belgilar: guruhlar
  route(/^signs$/, function () {
    setTitle('Yoʻl belgilari', false);
    view.innerHTML = '<div class="wrap"><div class="list">' + D.signs.groups.map(function (g) {
      var cnt = 0; g.items.forEach(function (e) { cnt += e.nums.length; });
      return '<a class="card row" href="#/signs/' + g.n + '"><span class="gthumb"><img src="img/signs/' + g.items[0].img[0] + '" alt=""></span><span class="t"><b>' + tx(g.n + '. ' + g.title) + '</b><small>' + tx(cnt + ' ta belgi') + '</small></span>' + CHEV + '</a>';
    }).join('') + '</div><h2 class="sec">' + tx('Qoʻshimcha') + '</h2><div class="list">' + D.signs.extra.map(function (x) {
      return '<a class="card row" href="#/signs/' + x.id + '"><span class="gthumb">' + ic(x.id === 'svetofor' ? 'light' : x.id === 'vaqtincha' ? 'sign' : 'info', 'chev') + '</span><span class="t"><b>' + tx(x.title) + '</b></span>' + CHEV + '</a>';
    }).join('') + '</div></div>';
  });
  route(/^signs\/(\w+)$/, function (gid) {
    var g = D.signs.groups.filter(function (x) { return x.n === gid; })[0];
    if (!g) return extraPage(gid);
    setTitle(g.title, true);
    var cells = '';
    g.items.forEach(function (e) {
      e.nums.forEach(function (n) {
        cells += '<a class="card sg" href="#/sign/' + n + '"><span class="im"><img loading="lazy" src="' + imgFor(n) + '" alt=""></span><b>' + n + '</b><span>' + tx(e.name) + '</span></a>';
      });
    });
    view.innerHTML = '<div class="wrap">' + (g.intro.length ? '<div class="card sd-b" style="margin-bottom:10px">' + g.intro.map(function (t) { return '<p>' + rich(t) + '</p>'; }).join('') + '</div>' : '') +
      '<div class="grid">' + cells + '</div>' + (g.outro && g.outro.length ? '<div class="card sd-b" style="margin-top:10px">' + g.outro.map(function (t) { return '<p>' + rich(t) + '</p>'; }).join('') + '</div>' : '') + '</div>';
  });
  function cap(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; }
  function extraPage(id) {
    var x = D.signs.extra.filter(function (e) { return e.id === id; })[0];
    if (!x) { location.hash = '#/signs'; return; }
    setTitle(x.title, true);
    var body = (x.p || []).map(function (t) { return '<p>' + rich(t) + '</p>'; }).join('');
    var html = '<div class="wrap">' + (body ? '<div class="card sd-b" style="margin-bottom:10px">' + body + '</div>' : '');
    if (x.grid) html += '<div class="grid">' + x.grid.map(function (g) {
      return '<a class="card sg" href="#/sign/' + g.n + '"><span class="im"><img loading="lazy" src="img/' + g.img + '" alt=""></span><b>' + esc(g.n) + '</b><span>' + tx(g.t) + '</span></a>';
    }).join('') + '</div>';
    (x.sections || []).forEach(function (sct) {
      html += '<h2 class="sec">' + tx(sct.h) + '</h2><div class="card">' + sct.items.map(function (it) {
        return it.img ? '<div class="irow"><span class="ii" data-zoom="img/' + it.img + '"><img loading="lazy" src="img/' + it.img + '" alt=""></span><span class="t">' + rich(cap(it.t)) + '</span></div>'
          : '<div class="irow"><span class="t muted">' + rich(it.t) + '</span></div>';
      }).join('') + '</div>';
    });
    if (x.items) html += '<div class="list">' + x.items.map(function (it) {
      return '<div class="card irow big"><span class="ii" data-zoom="img/' + it.img + '"><img loading="lazy" src="img/' + it.img + '" alt=""></span><span class="t"><b>“' + tx(it.name) + '”</b><br>' + rich(cap(it.t)) + '</span></div>';
    }).join('') + '</div>';
    view.innerHTML = html + '<p class="foot">' + tx('Matn: Yoʻl harakati qoidalari (lex.uz). Rasmni kattalashtirish uchun bosing.') + '</p></div>';
  }
  // Belgi tafsiloti
  route(/^sign\/(.+)$/, function (n) {
    var e = SIGN[n]; if (!e) { location.hash = '#/signs'; return; }
    var g = SIGNGRP[e.id];
    setTitle(n + ' — ' + g.title, true);
    var idx = SIGNLIST.indexOf(e), prev = SIGNLIST[idx - 1], next = SIGNLIST[idx + 1];
    var imgs = e.img.map(function (f) { return '<img src="img/signs/' + f + '" data-zoom="img/signs/' + f + '" alt="' + esc(n) + '">'; }).join('');
    view.innerHTML = '<div class="wrap"><div class="card"><div class="sd-img' + (e.img.length > 2 ? ' many' : '') + '">' + imgs + '</div>' +
      '<div class="sd-h" style="position:relative;padding-right:50px">' + starBtn({ t: 'sign', id: n, title: n + ' ' + e.name }) + '<div class="nums">' + esc(e.nums.length > 1 ? e.nums[0] + ' — ' + e.nums[e.nums.length - 1] : n) + '</div><h2>“' + tx(e.name) + '”</h2>' +
      '<div class="muted" style="font-size:.85em;margin-top:4px">' + tx(g.n + '. ' + g.title) + '</div></div>' +
      (e.d.length ? '<div class="sd-b">' + e.d.map(function (t) { return '<p>' + rich(t) + '</p>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="pager">' + (prev ? '<a class="btn sec" href="#/sign/' + prev.nums[0] + '">‹ ' + prev.nums[0] + '</a>' : '<span style="flex:1"></span>') +
      (next ? '<a class="btn" href="#/sign/' + next.nums[0] + '">' + next.nums[0] + ' ›</a>' : '<span style="flex:1"></span>') + '</div></div>';
  });

  // Yo'l chiziqlari
  function mkImg(id) { return 'img/markings/' + id + '.svg'; }
  route(/^marks$/, function () {
    setTitle('Yoʻl chiziqlari', false);
    var html = '<div class="wrap">';
    D.markings.groups.forEach(function (g) {
      html += '<h2 class="sec">' + tx(g.n + '. ' + g.title) + '</h2>';
      if (g.intro.length) html += '<div class="card sd-b" style="margin-bottom:8px">' + g.intro.map(function (t) { return '<p>' + rich(t) + '</p>'; }).join('') + '</div>';
      if (g.sheet) html += '<button class="btn sec" data-zoom="img/' + g.sheet + '" style="margin:0 0 8px">' + tx('Rasmiy ilovadagi umumiy sxema') + '</button>';
      html += '<div class="card">' + g.items.map(function (it) {
        var nums = it.nums.length > 1 ? it.nums[0] + ' — ' + it.nums[it.nums.length - 1] : it.id;
        var sub = (it.sub || []).map(function (s) { return '<div class="mk" style="padding-left:0"><span class="mi" data-zoom="img/' + s.img[0] + '"><img loading="lazy" src="img/' + s.img[0] + '" alt=""></span><span class="t"><b>' + esc(s.id) + '</b> — ' + rich(s.t) + '</span></div>'; }).join('');
        return '<div class="mk" id="m-' + it.id + '" style="border-top:1px solid var(--ln)"><span class="mi" data-zoom="' + mkImg(it.id) + '"><img loading="lazy" src="' + mkImg(it.id) + '" alt=""></span><span class="t"><b>' + esc(nums) + '</b>' +
          (it.note ? ' <span class="muted">(' + tx(it.note) + ')</span>' : '') + ' — ' + rich(it.t) + sub + '</span></div>';
      }).join('') + '</div>';
      if (g.outro && g.outro.length) html += '<div class="card sd-b" style="margin-top:8px">' + g.outro.map(function (t) { return '<p>' + rich(t) + '</p>'; }).join('') + '</div>';
    });
    view.innerHTML = html + '</div>';
  });

  // Jarimalar
  function amounts(p) {
    return (p.bhm || []).map(function (a) {
      var t = a.length > 1 ? som(a[0] * S.bhm) + ' — ' + som(a[1] * S.bhm) : som(a[0] * S.bhm);
      return '<span>' + t + '</span>';
    }).join('');
  }
  function maxAmt(f) { var mx = 0, mn = 1e9; f.parts.forEach(function (p) { (p.bhm || []).forEach(function (a) { mx = Math.max(mx, a[a.length - 1]); mn = Math.min(mn, a[0]); }); }); return mx ? (mn === mx ? som(mn * S.bhm) : som(mn * S.bhm) + ' — ' + som(mx * S.bhm)) : ''; }
  route(/^fines$/, function (q) {
    setTitle('Jarimalar', false);
    view.innerHTML = '<div class="wrap"><div class="card sd-b" style="margin-bottom:10px"><p>' + tx('Maʼmuriy javobgarlik toʻgʻrisidagi kodeksning yoʻl harakatiga oid moddalari.') + ' ' +
      tx('Hisob: 1 BHM = ') + '<b>' + som(S.bhm) + '</b> <span class="muted">(' + tx(D.meta.bhmDate) + ')</span>. <a href="#/settings">' + tx('Oʻzgartirish') + '</a></p></div>' +
      '<div class="filter">' + ic('search') + '<input id="ff" placeholder="' + esc(T('Modda yoki qoidabuzarlikni qidiring...')) + '"></div><div class="list" id="fl"></div></div>';
    function draw() {
      var qq = TR.norm($('#ff').value).trim().split(' ').filter(Boolean);
      var items = D.fines.filter(function (f) {
        if (!qq.length) return true;
        var hay = TR.norm(f.n + ' ' + f.title + ' ' + f.parts.map(function (p) { return p.off; }).join(' '));
        return qq.every(function (w) { return hay.indexOf(w) >= 0; });
      });
      $('#fl').innerHTML = items.map(function (f) {
        return '<a class="card row" href="#/fine/' + idEnc(f.n) + '"><span class="num">' + supf(esc(f.n)) + '</span><span class="t"><b>' + tx(f.title) + '</b><small class="fine-amt">' + maxAmt(f) + '</small></span>' + CHEV + '</a>';
      }).join('') || '<div class="empty">' + tx('Hech narsa topilmadi') + '</div>';
    }
    $('#ff').oninput = draw; draw();
  });
  route(/^fine\/(.+)$/, function (fid) {
    var n = idDec(fid), f = D.fines.filter(function (x) { return x.n === n; })[0];
    if (!f) { location.hash = '#/fines'; return; }
    setTitle(n + '-modda', true);
    var qn = ['Birinchi', 'Ikkinchi', 'Uchinchi', 'Toʻrtinchi', 'Beshinchi', 'Oltinchi', 'Yettinchi', 'Sakkizinchi', 'Toʻqqizinchi', 'Oʻninchi'];
    view.innerHTML = '<div class="wrap"><div class="card chap-h" style="position:relative;padding-right:50px">' + starBtn({ t: 'fine', id: n, title: n + '-modda. ' + f.title }) + '<span class="pill">' + supf(esc(T(n + '-modda'))) + '</span><h2>' + tx(f.title) + '</h2></div>' +
      '<div class="card">' + f.parts.map(function (p, i) {
        return '<div class="part">' + (f.parts.length > 1 ? '<div class="muted" style="font-size:.8em;font-weight:600;margin-bottom:4px">' + tx((qn[i] || (i + 1) + '-') + ' qism') + '</div>' : '') +
          (p.off ? '<p class="off">' + rich(p.off) + '</p>' : '') + '<p class="sanc">' + rich(p.sanc) + '</p>' + (p.bhm && p.bhm.length ? '<div class="sum">' + amounts(p) + '</div>' : '') + '</div>';
      }).join('') + '</div>' +
      (f.notes.length ? '<div class="card sd-b" style="margin-top:10px">' + f.notes.map(function (t) { return '<p class="muted">' + rich(t) + '</p>'; }).join('') + '</div>' : '') +
      '<p class="foot">' + tx('Summalar 1 BHM = ' ) + som(S.bhm) + tx(' asosida hisoblangan. Rasmiy matn: lex.uz') + '</p></div>';
  });

  // Ilovalar 3 va 4
  route(/^apx\/(3|4)$/, function (k) {
    var A = k === '3' ? D.il3 : D.il4;
    setTitle(k + '-ilova', true);
    var html = '<div class="wrap"><div class="card chap-h"><span class="pill">' + tx(k + '-ilova') + '</span><h2>' + tx(A.title) + '</h2></div>';
    if (A.grid) html += '<div class="grid" style="margin-bottom:10px">' + A.grid.map(function (g) {
      return '<div class="card sg" data-zoom="img/' + g.img + '"><span class="im"><img loading="lazy" src="img/' + g.img + '" alt=""></span><span>' + tx(g.t) + '</span></div>';
    }).join('') + '</div>';
    html += '<div class="card sd-b">';
    A.items.forEach(function (it) {
      if (it.h) html += '<h3 style="margin:16px 0 6px;color:var(--pri)">' + tx(it.h) + '</h3>';
      else if (it.table) html += table(it.table);
      else if (it.img) html += '<div class="sheet" style="margin:8px 0"><img src="img/' + it.img + '" data-zoom="img/' + it.img + '" alt=""></div>';
      else if (it.note) html += '<p class="muted" style="font-size:.9em">' + rich(it.note) + '</p>';
      else if (it.n) html += '<p><b style="color:var(--pri)">' + esc(it.n) + '.</b> ' + rich(it.t) + '</p>';
      else html += '<p class="' + (/[;:]$/.test(it.t) ? 'sub' : '') + '">' + rich(it.t) + '</p>';
    });
    view.innerHTML = html + '</div></div>';
  });

  /* ---------- qidiruv ---------- */
  var IDX = null;
  function buildIdx() {
    IDX = [];
    D.rules.forEach(function (c) {
      var cur = null;
      c.p.forEach(function (p) {
        if (p.n) { cur = { k: 'Qoidalar', h: '#/pt/' + idEnc(p.n), lab: p.n + '-band (' + c.n + '-bob)', t: p.t }; IDX.push(cur); }
        else if (cur) cur.t += ' ' + p.t;
        else { cur = { k: 'Qoidalar', h: '#/chap/' + idEnc(c.n), lab: c.n + '-bob. ' + c.title, t: p.t }; IDX.push(cur); }
      });
    });
    SIGNLIST.forEach(function (e) { IDX.push({ k: 'Belgilar', h: '#/sign/' + e.nums[0], lab: e.nums.join(', ') + ' “' + e.name + '”', t: e.name + '. ' + e.d.join(' '), img: 'img/signs/' + e.img[0], extra: e.nums.join(' ') }); });
    D.markings.groups.forEach(function (g) { g.items.forEach(function (it) { IDX.push({ k: 'Yoʻl chiziqlari', h: '#/marks', lab: it.nums.join(', ') + ' (' + g.title + ')', t: (it.note ? it.note + '. ' : '') + it.t, extra: it.nums.join(' ') }); }); });
    D.fines.forEach(function (f) { IDX.push({ k: 'Jarimalar', h: '#/fine/' + idEnc(f.n), lab: f.n + '-modda. ' + f.title, t: f.parts.map(function (p) { return p.off + ' ' + p.sanc; }).join(' '), extra: f.title }); });
    [['3', D.il3], ['4', D.il4]].forEach(function (a) { var t = a[1].items.map(function (i) { return i.t || i.h || i.note || ''; }).join(' '); IDX.push({ k: 'Ilovalar', h: '#/apx/' + a[0], lab: a[0] + '-ilova. ' + a[1].title, t: t }); });
    IDX.forEach(function (r) { r.n = TR.norm(r.lab + ' ' + (r.extra || '') + ' ' + r.t); });
  }
  function hlRe(words) {
    // so'zni tutuq/apostrofga chidamli regexga aylantirish
    var parts = words.map(function (w) {
      var src = S.script === 'cyr' ? TR.toCyr(w) : w;
      return src.split('').map(function (ch) { return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "[ʻʼ‘’'`]?"; }).join('');
    }).filter(Boolean);
    return parts.length ? new RegExp('(' + parts.join('|') + ')', 'gi') : null;
  }
  function snippet(t, words) {
    var re = hlRe(words.map(function (w) { return w; }));
    var lat = t, i = -1;
    if (words.length) { var r0 = new RegExp(words[0].split('').map(function (ch) { return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "[ʻʼ‘’'`]?"; }).join(''), 'i'); var m = lat.match(r0); if (m) i = m.index; }
    var a = Math.max(0, i - 60), b = Math.min(lat.length, (i < 0 ? 0 : i) + 160);
    var s = (a > 0 ? '…' : '') + lat.slice(a, b) + (b < lat.length ? '…' : '');
    var h = supf(esc(T(s)));
    return re ? h.replace(re, '<mark>$1</mark>') : h;
  }
  route(/^search$/, function (q) {
    setTitle('Qidiruv', true);
    view.innerHTML = '<div class="wrap"><div class="filter">' + ic('search') + '<input id="sq" type="search" placeholder="' + esc(T('Masalan: tezlik, 3.27, quvib oʻtish')) + '" value="' + esc(q.q || '') + '"></div><div id="sr"></div></div>';
    var inp = $('#sq');
    function run() {
      if (!IDX) buildIdx();
      var raw = inp.value.trim(), words = TR.norm(raw).trim().split(' ').filter(Boolean);
      if (!words.length) { $('#sr').innerHTML = '<div class="empty">' + tx('Qidirish uchun soʻz yozing (lotin yoki kirillda).') + '</div>'; return; }
      var res = IDX.filter(function (r) { return words.every(function (w) { return r.n.indexOf(w) >= 0; }); });
      var latWords = raw.toLowerCase().split(/\s+/).filter(Boolean).map(function (w) { return /[а-яёўқғҳ]/i.test(w) ? TR.norm(w) : w; });
      var groups = {};
      res.forEach(function (r) { (groups[r.k] = groups[r.k] || []).push(r); });
      var order = ['Belgilar', 'Qoidalar', 'Jarimalar', 'Yoʻl chiziqlari', 'Ilovalar'];
      $('#sr').innerHTML = res.length ? order.filter(function (k) { return groups[k]; }).map(function (k) {
        var arr = groups[k].slice(0, 60);
        return '<h2 class="sec">' + tx(k) + ' <span class="pill">' + groups[k].length + '</span></h2><div class="card">' + arr.map(function (r) {
          return '<a class="res" href="' + r.h + '"><b>' + supf(esc(T(r.lab))) + '</b><div>' + snippet(r.t, latWords) + '</div></a>';
        }).join('') + '</div>';
      }).join('') : '<div class="empty">' + tx('Hech narsa topilmadi') + '</div>';
    }
    var tmr; inp.oninput = function () { clearTimeout(tmr); tmr = setTimeout(function () { history.replaceState(null, '', '#/search?q=' + encodeURIComponent(inp.value)); run(); }, 200); };
    run(); setTimeout(function () { inp.focus(); }, 50);
  });

  /* ---------- saqlanganlar ---------- */
  route(/^saved$/, function () {
    setTitle('Saqlanganlar', false);
    if (!S.saved.length) { view.innerHTML = '<div class="wrap"><div class="empty">' + ic('starb', 'chev') + '<p>' + tx('Hozircha hech narsa saqlanmagan. Band, belgi yoki jarima yonidagi ☆ tugmasini bosing.') + '</p></div></div>'; return; }
    var lab = { pt: 'Band', sign: 'Belgi', fine: 'Jarima' };
    view.innerHTML = '<div class="wrap"><div class="list">' + S.saved.map(function (o) {
      var href = o.t === 'pt' ? '#/pt/' + idEnc(o.id) : o.t === 'sign' ? '#/sign/' + o.id : '#/fine/' + idEnc(o.id);
      var th = o.t === 'sign' ? '<span class="gthumb"><img src="' + imgFor(o.id) + '" alt=""></span>' : '<span class="num">' + supf(esc(o.id)) + '</span>';
      return '<a class="card row" href="' + href + '">' + th + '<span class="t"><small>' + tx(lab[o.t]) + '</small><b>' + supf(esc(T(o.title))) + '</b></span>' + CHEV + '</a>';
    }).join('') + '</div></div>';
  });

  /* ---------- test ---------- */
  var POOL = [];
  SIGNLIST.forEach(function (e) {
    e.nums.forEach(function (n) {
      var name = e.name;
      if (e.nums.length > 1) {
        var re = new RegExp(n.replace(/\./g, '\\.') + '\\.?\\s*—\\s*([^,;.]+)');
        var m = e.d.join(' ').match(re);
        if (m) { var sub = m[1].split(/\s+yoʻl belgi/)[0].split(' ').slice(0, 5).join(' '); if (sub && !/^\d/.test(sub)) name += ' (' + sub.trim() + ')'; }
      }
      POOL.push({ n: n, name: name, img: imgFor(n), g: SIGNGRP[e.id].n });
    });
  });
  var Q = null;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var qset = { mode: 'img', g: 'all', cnt: 20 };
  route(/^quiz$/, function () {
    setTitle('Belgilar testi', false);
    function seg(name, opts) { return '<div class="seg" data-k="' + name + '">' + opts.map(function (o) { return '<button data-v="' + o[0] + '" class="' + (String(qset[name]) === String(o[0]) ? 'on' : '') + '">' + tx(o[1]) + '</button>'; }).join('') + '</div>'; }
    var best = S.best[qset.mode + qset.g] || null;
    view.innerHTML = '<div class="wrap"><div class="card qcard">' +
      '<b>' + tx('Savol turi') + '</b>' + seg('mode', [['img', 'Belgiga qarab nomini toping'], ['name', 'Nomiga qarab belgini toping']]) +
      '<b>' + tx('Belgilar guruhi') + '</b>' + seg('g', [['all', 'Hammasi']].concat(D.signs.groups.map(function (g) { return [g.n, g.n + '. ' + g.title.replace(' belgilari', '').replace(' belgilar', '')]; }))) +
      '<b>' + tx('Savollar soni') + '</b>' + seg('cnt', [[10, '10'], [20, '20'], [40, '40']]) +
      '<button class="btn block" id="qs">' + tx('Testni boshlash') + '</button>' +
      (S.wrong.length ? '<button class="btn sec block" id="qw" style="margin-top:8px">' + tx('Xatolarim ustida ishlash') + ' (' + S.wrong.length + ')</button>' : '') +
      (best != null ? '<p class="muted" style="text-align:center;margin:10px 0 0">' + tx('Eng yaxshi natija: ') + best + '%</p>' : '') + '</div></div>';
    Array.prototype.forEach.call(view.querySelectorAll('.seg'), function (s) {
      s.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; var k = s.getAttribute('data-k'); qset[k] = k === 'cnt' ? +b.getAttribute('data-v') : b.getAttribute('data-v'); render(); };
    });
    $('#qs').onclick = function () { startQuiz(false); };
    if ($('#qw')) $('#qw').onclick = function () { startQuiz(true); };
  });
  function startQuiz(wrongOnly) {
    var src = POOL.filter(function (p) { return wrongOnly ? S.wrong.indexOf(p.n) >= 0 : (qset.g === 'all' || p.g === qset.g); });
    if (!src.length) { toast(T('Savollar yoʻq')); return; }
    var qs = shuffle(src.slice()).slice(0, wrongOnly ? Math.min(40, src.length) : qset.cnt).map(function (p) {
      var others = shuffle(POOL.filter(function (o) { return o.name !== p.name && o.img !== p.img && (o.g === p.g || Math.random() < .25); })).slice(0, 12);
      var uniq = [], names = {}; names[p.name] = 1;
      others.forEach(function (o) { if (!names[o.name] && uniq.length < 3) { names[o.name] = 1; uniq.push(o); } });
      return { p: p, opts: shuffle([p].concat(uniq)), ans: null };
    });
    Q = { qs: qs, i: 0, ok: 0, mode: qset.mode, key: wrongOnly ? null : qset.mode + qset.g, wrongOnly: wrongOnly };
    location.hash = '#/quiz/run';
  }
  route(/^quiz\/run$/, function () {
    if (!Q) { location.replace('#/quiz'); return; }
    setTitle(T('Test') + ' ' + Math.min(Q.i + 1, Q.qs.length) + '/' + Q.qs.length, true);
    if (Q.i >= Q.qs.length) return quizResult();
    var q = Q.qs[Q.i], L = 'ABCD';
    var head = Q.mode === 'img' ? '<div class="qimg"><img src="' + q.p.img + '" alt=""></div><p class="qq">' + tx('Bu qaysi belgi?') + '</p>' :
      '<p class="qq">' + tx('Qaysi rasm “' + q.p.name + '” belgisini bildiradi?') + '</p>';
    var opts = q.opts.map(function (o, k) {
      var st = q.ans == null ? '' : (o === q.p ? ' ok' : (q.ans === k ? ' bad' : ''));
      return Q.mode === 'img' ? '<button class="opt' + st + '" data-k="' + k + '"><span class="l">' + L[k] + '</span><span>' + tx(o.name) + '</span></button>' :
        '<button class="opt' + st + '" data-k="' + k + '"><img src="' + o.img + '" alt=""></button>';
    }).join('');
    view.innerHTML = '<div class="wrap"><div class="card qcard"><div class="qprog"><i style="width:' + (Q.i / Q.qs.length * 100) + '%"></i></div>' + head +
      '<div class="opts' + (Q.mode === 'name' ? ' img' : '') + '">' + opts + '</div>' +
      (q.ans != null ? '<div style="margin-top:12px;display:flex;gap:8px"><a class="btn sec" href="#/sign/' + q.p.n + '" style="flex:1">' + tx('Batafsil') + ' (' + q.p.n + ')</a><button class="btn" id="qn" style="flex:1">' + tx(Q.i + 1 < Q.qs.length ? 'Keyingi' : 'Natija') + ' ›</button></div>' : '') + '</div></div>';
    if (q.ans == null) {
      view.querySelector('.opts').onclick = function (e) {
        var b = e.target.closest('.opt'); if (!b) return;
        q.ans = +b.getAttribute('data-k');
        var right = q.opts[q.ans] === q.p;
        if (right) { Q.ok++; S.wrong = S.wrong.filter(function (x) { return x !== q.p.n; }); }
        else if (S.wrong.indexOf(q.p.n) < 0) S.wrong.push(q.p.n);
        save('wrong'); render.noRestore = true; render();
      };
    } else $('#qn').onclick = function () { Q.i++; render.noRestore = true; render(); };
  });
  function quizResult() {
    setTitle('Natija', true);
    var pct = Math.round(Q.ok / Q.qs.length * 100);
    if (Q.key) { S.best[Q.key] = Math.max(S.best[Q.key] || 0, pct); save('best'); }
    var bad = Q.qs.filter(function (q) { return q.opts[q.ans] !== q.p; });
    view.innerHTML = '<div class="wrap"><div class="card qcard" style="text-align:center"><div class="score">' + pct + '%</div><p>' + tx(Q.ok + ' ta toʻgʻri, ' + (Q.qs.length - Q.ok) + ' ta xato') + '</p>' +
      '<p class="muted">' + tx(pct >= 90 ? 'Aʼlo! Belgilarni juda yaxshi bilasiz.' : pct >= 70 ? 'Yaxshi natija. Xatolarni takrorlab chiqing.' : 'Belgilarni yana bir bor koʻrib chiqing.') + '</p>' +
      '<div style="display:flex;gap:8px"><a class="btn sec" href="#/quiz" style="flex:1">' + tx('Test menyusi') + '</a><button class="btn" id="qa" style="flex:1">' + tx('Qayta boshlash') + '</button></div></div>' +
      (bad.length ? '<h2 class="sec">' + tx('Xatolar') + '</h2><div class="list">' + bad.map(function (q) {
        return '<a class="card row" href="#/sign/' + q.p.n + '"><span class="gthumb"><img src="' + q.p.img + '" alt=""></span><span class="t"><small>' + esc(q.p.n) + '</small><b>' + tx(q.p.name) + '</b></span>' + CHEV + '</a>';
      }).join('') + '</div>' : '') + '</div>';
    $('#qa').onclick = function () { startQuiz(Q.wrongOnly); };
  }

  /* ---------- sozlamalar ---------- */
  route(/^settings$/, function () {
    setTitle('Sozlamalar', false);
    function seg(k, opts) { return '<div class="seg" style="margin:0" data-k="' + k + '">' + opts.map(function (o) { return '<button data-v="' + o[0] + '" class="' + (String(S[k]) === String(o[0]) ? 'on' : '') + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>'; }
    view.innerHTML = '<div class="wrap"><div class="card">' +
      '<div class="set"><span>' + tx('Yozuv') + '</span>' + seg('script', [['lat', 'Lotin'], ['cyr', 'Кирилл']]) + '</div>' +
      '<div class="set"><span>' + tx('Mavzu') + '</span>' + seg('theme', [['auto', T('Avto')], ['light', T('Kunduzgi')], ['dark', T('Tungi')]]) + '</div>' +
      '<div class="set"><span>' + tx('Matn oʻlchami') + '</span>' + seg('fs', [[14, 'A-'], [16, 'A'], [18, 'A+'], [20, 'A++']]) + '</div>' +
      '<div class="set"><span>' + tx('BHM (soʻm)') + '<br><small class="muted">' + tx('Jarimalarni hisoblash uchun') + '</small></span><input type="number" id="bhm" min="1000" step="1000" value="' + S.bhm + '"></div>' +
      '<div class="set"><span>' + tx('Test natijalari va xatolar') + '</span><button class="btn sec" id="rst">' + tx('Tozalash') + '</button></div></div></div>';
    Array.prototype.forEach.call(view.querySelectorAll('.seg'), function (s) {
      s.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; var k = s.getAttribute('data-k'); S[k] = k === 'fs' ? +b.getAttribute('data-v') : b.getAttribute('data-v'); save(k); applyPrefs(); render(); };
    });
    $('#bhm').onchange = function () { var v = +this.value; if (v >= 1000) { S.bhm = v; save('bhm'); toast(T('Saqlandi')); } };
    $('#rst').onclick = function () { S.wrong = []; S.best = {}; save('wrong'); save('best'); toast(T('Tozalandi')); };
  });
  route(/^about$/, function () {
    setTitle('Ilova haqida', false);
    view.innerHTML = '<div class="wrap"><div class="card sd-b" style="text-align:center;padding-top:20px"><img src="img/icon.png" alt="" style="width:84px;height:84px;border-radius:20px"><h2 style="margin:10px 0 2px">' + tx('Yoʻl harakati qoidalari 2026') + '</h2><p class="muted" style="margin:0">' + tx('Versiya 1.1.0 · Internetsiz ishlaydi') + '</p></div>' +
      '<div class="card sd-b" style="margin-top:10px">' +
      '<p>' + tx('Ilovada Oʻzbekiston Respublikasi Yoʻl harakati qoidalarining toʻliq matni, yoʻl belgilari va chiziqlari, transport vositalaridan foydalanishni taqiqlovchi shartlar, xavflilik belgilari hamda yoʻl harakatiga oid jarimalar jamlangan.') + '</p>' +
      '<p><b>' + tx('Manbalar:') + '</b></p><ul style="padding-left:20px;margin:4px 0">' +
      '<li>' + tx('Vazirlar Mahkamasining 2022-yil 12-apreldagi 172-son qarori (30.10.2026 holatidagi tahrir) — lex.uz/docs/-5953883') + '</li>' +
      '<li>' + tx('Maʼmuriy javobgarlik toʻgʻrisidagi kodeks, XI bob — lex.uz/docs/-97664') + '</li>' +
      '<li>' + tx('Belgilar tasvirlari: rasmiy ilova rasmlari (lex.uz) va Wikimedia Commons (ochiq litsenziya)') + '</li></ul>' +
      (window.YHQ_WEB ? '<p><a class="btn" href="yuklab/YHQ-2026.apk" download>' + tx('Android ilovani yuklab olish (APK)') + '</a></p><p>' + tx('Toshkent tuman 1-son texnikumi e-bazasi: ') + '<a href="../">texnikum1son.uz</a></p>' : '') +
      '<p class="muted" style="font-size:.9em">' + tx('Ushbu ilova norasmiy maʼlumotnoma boʻlib, davlat organlariga tegishli emas. Huquqiy ahamiyatga ega masalalarda lex.uz dagi rasmiy matnga tayaning. Maʼlumotlar 19.11.2026 holatiga koʻra.') + '</p></div></div>';
  });

  /* ---------- sozlamalarni qo'llash ---------- */
  function applyPrefs() {
    var dark = S.theme === 'dark' || (S.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.setProperty('--fs', S.fs + 'px');
    $('#scr').textContent = S.script === 'cyr' ? 'Lot' : 'Кир';
    var meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = dark ? '#1a2333' : '#1d4fa0';
    try { if (window.AndroidBridge) AndroidBridge.setBars(dark ? '#1a2333' : '#1d4fa0', dark ? '#181d26' : '#ffffff', !dark); } catch (e) { }
    IDX = null;
  }
  if (window.matchMedia) { var mq = matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', applyPrefs); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') goBack(); });
  applyPrefs();
  render();
})();
