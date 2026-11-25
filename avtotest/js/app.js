/* YHQ Test 2026 — Yoʻl harakati qoidalari boʻyicha imtihon testlari (oflayn).
 * Maʼlumot: data/bank.js (window.BANK). Holat: localStorage ("yhqt1"). */
(function () {
  'use strict';
  var B = window.BANK, Q = {}, TOP = {};
  B.q.forEach(function (q) { Q[q.id] = q; });
  B.topics.forEach(function (t) { TOP[t.id] = t; });
  var WEB = !!window.YHQ_WEB, AND = !!window.AndroidBridge;

  /* ---------------- holat ---------------- */
  var KEY = 'yhqt1', S;
  function defaults() {
    return { ans: {}, saved: [], tk: {}, exams: [], mar: 0, days: {},
      set: { script: 'lat', theme: 'auto', fs: 16, bhm: B.bhm, voice: 1, exp: 1, rem: '' } };
  }
  function load() {
    var d = defaults();
    try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) d[k] = o[k]; d.set = Object.assign(defaults().set, o.set || {}); } } catch (e) { }
    return d;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  S = load();

  /* ---------------- yordamchilar ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var main, bar, titleEl, actEl;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function T(s) { return S.set.script === 'kir' && window.Translit ? Translit.toCyr(s) : s; }
  function H(s) { return esc(T(s)).replace(/\^\{?(\d+)\}?/g, '<sup>$1</sup>'); }
  function bandName(n) { return String(n).replace(/\^\{(\d+)\}/g, '<sup>$1</sup>'); }
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = T(msg); document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
  var IC = {
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    ticket: 'M4 6a2 2 0 0 0-2 2v2.5a1.5 1.5 0 0 1 0 3V16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1.5 1.5 0 0 1 0-3V8a2 2 0 0 0-2-2zm5 2h2v2H9zm0 3h2v2H9zm0 3h2v2H9z',
    exam: 'M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z',
    book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
    flag: 'M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z',
    warn: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    staro: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
    stats: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',
    search: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    gear: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    car: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    vol: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
    info: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    next: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    redo: 'M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
    check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    globe: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z'
  };
  function svg(name, cls) { return '<svg viewBox="0 0 24 24"' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><path d="' + IC[name] + '"/></svg>'; }

  /* ---------------- statistika yordamchilari ---------------- */
  function rec(id) { return S.ans[id]; }        // [oxirgi natija 0/1, urinishlar, xatolar]
  function mark(id, ok) {
    var r = S.ans[id] || [0, 0, 0]; r[0] = ok ? 1 : 0; r[1]++; if (!ok) r[2]++; S.ans[id] = r;
    var d = today(); S.days[d] = (S.days[d] || 0) + 1;
    var keys = Object.keys(S.days); if (keys.length > 60) delete S.days[keys[0]];
  }
  function mistakes() { return B.q.filter(function (q) { var r = S.ans[q.id]; return r && r[0] === 0; }).map(function (q) { return q.id; }); }
  function topicStat(tid) {
    var n = 0, a = 0, ok = 0;
    B.q.forEach(function (q) { if (q.t !== tid) return; n++; var r = S.ans[q.id]; if (r) { a++; if (r[0]) ok++; } });
    return { n: n, a: a, ok: ok };
  }
  function totals() {
    var a = 0, ok = 0; for (var k in S.ans) { if (!Q[k]) continue; a++; if (S.ans[k][0]) ok++; }
    return { n: B.q.length, a: a, ok: ok };
  }

  /* ---------------- shell ---------------- */
  var NAV = [['', 'home', 'Asosiy'], ['biletlar', 'ticket', 'Biletlar'], ['imtihon', 'exam', 'Imtihon'], ['mavzular', 'book', 'Mavzular'], ['statistika', 'stats', 'Statistika']];
  var SIDE = NAV.concat([['marafon', 'flag', 'Marafon'], ['xatolar', 'warn', 'Xatolar'], ['saqlangan', 'star', 'Saqlanganlar'], ['avtodrom', 'car', 'Avtodrom'], ['qidiruv', 'search', 'Qidiruv'], ['sozlamalar', 'gear', 'Sozlamalar']]);
  function shell() {
    document.getElementById('app').innerHTML =
      '<header class="bar"><button class="ib" id="bk" aria-label="Orqaga">' + svg('back') + '</button><h1 id="tt"></h1><span id="act"></span></header>' +
      '<div class="body"><nav class="side" id="side"></nav><main id="main"><div class="wrap" id="view"></div></main></div>' +
      '<nav class="bottom" id="bottom"></nav>';
    main = $('#main'); titleEl = $('#tt'); actEl = $('#act');
    $('#bk').onclick = function () { goBack(); };
    drawNav();
  }
  function drawNav() {
    var h = location.hash.replace(/^#\/?/, '').split('/')[0];
    $('#bottom').innerHTML = NAV.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (h === n[0] ? 'on' : '') + '">' + svg(n[1]) + '<span>' + H(n[2]) + '</span></a>'; }).join('');
    $('#side').innerHTML = SIDE.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (h === n[0] ? 'on' : '') + '">' + svg(n[1]) + '<span>' + H(n[2]) + '</span></a>'; }).join('') +
      (WEB ? '<a href="../">' + svg('globe') + '<span>' + H('texnikum1son.uz') + '</span></a>' : '');
  }
  function setTitle(t, back, actions) {
    titleEl.innerHTML = H(t); $('#bk').style.display = back ? '' : 'none'; actEl.innerHTML = actions || '';
    document.title = T(t) + ' — YHQ Test 2026';
  }
  function view(html) { $('#view').innerHTML = html; main.scrollTop = 0; }
  function goBack() {
    if (run && !run.done && run.exam) { confirmBox('Imtihonni toʻxtatasizmi? Natija saqlanmaydi.', function () { stopRun(); history.back(); }); return; }
    if (history.length > 1) history.back(); else location.hash = '#/';
  }
  window.onAndroidBack = function () {
    var sh = document.querySelector('.sheet-bg'); if (sh) { sh.remove(); return true; }
    if (window.YHQSim && YHQSim.isOpen()) { YHQSim.close(); return true; }
    var h = location.hash.replace(/^#\/?/, ''); if (!h) return false;
    goBack(); return true;
  };

  /* ---------------- marshrutlash ---------------- */
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/'), p = parts[0] || '';
    document.body.classList.toggle('quiz', p === 'test');
    drawNav();
    if (p !== 'test' && run && !run.done && !run.exam) run = null;
    if (p !== 'test') stopTimer();
    if (window.YHQSim && p !== 'avtodrom' && YHQSim.isOpen()) YHQSim.close(true);
    switch (p) {
      case '': return home();
      case 'biletlar': return tickets();
      case 'imtihon': return examIntro();
      case 'mavzular': return topics();
      case 'statistika': return stats();
      case 'marafon': return marathon();
      case 'xatolar': return mistakesPage();
      case 'saqlangan': return savedPage();
      case 'qidiruv': return searchPage(decodeURIComponent(parts[1] || ''));
      case 'sozlamalar': return settings();
      case 'haqida': return about();
      case 'avtodrom': return simPage();
      case 'test': return run ? renderRun() : (location.replace('#/'), null);
      case 'natija': return run && run.done ? results() : (location.replace('#/'), null);
      default: location.replace('#/');
    }
  }

  /* ---------------- bosh sahifa ---------------- */
  function ring(p) {
    var r = 32, c = 2 * Math.PI * r, off = c * (1 - p / 100);
    return '<svg class="ring" viewBox="0 0 78 78"><circle cx="39" cy="39" r="' + r + '" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="8"/>' +
      '<circle cx="39" cy="39" r="' + r + '" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 39 39)"/>' +
      '<text x="39" y="44" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="inherit">' + p + '%</text></svg>';
  }
  function tile(href, icon, color, title, sub) {
    return '<a class="tile" href="' + href + '"><div class="ic" style="background:' + color + '">' + svg(icon) + '</div><b>' + H(title) + '</b><span>' + H(sub) + '</span></a>';
  }
  function home() {
    setTitle('YHQ Test 2026', false, '<button class="ib" onclick="location.hash=\'#/qidiruv\'" aria-label="Qidiruv">' + svg('search') + '</button><button class="ib" onclick="location.hash=\'#/sozlamalar\'" aria-label="Sozlamalar">' + svg('gear') + '</button>');
    var t = totals(), mis = mistakes().length, passed = 0;
    for (var k in S.tk) if (S.tk[k].best >= 18) passed++;
    var lastEx = S.exams.length ? S.exams[S.exams.length - 1] : null;
    view('<div class="card hero">' + ring(pct(t.a, t.n)) + '<div><h2>' + H('Imtihonga tayyorgarlik') + '</h2><p>' +
      H(t.a + ' / ' + t.n + ' ta savol yechildi · ' + pct(t.ok, t.a || 1) + '% toʻgʻri') + '</p><p>' +
      H(passed + ' / ' + B.tickets.length + ' ta bilet topshirildi') + (lastEx ? H(' · oxirgi imtihon: ' + lastEx.ok + '/20') : '') + '</p></div></div>' +
      '<div class="tiles">' +
      tile('#/imtihon', 'exam', '#e53935', 'Imtihon', '20 savol · 25 daqiqa · 2 xato') +
      tile('#/biletlar', 'ticket', '#1d4fa0', 'Biletlar', B.tickets.length + ' ta bilet, har birida 20 savol') +
      tile('#/mavzular', 'book', '#2e7d32', 'Mavzular', B.topics.length + ' ta mavzu boʻyicha') +
      tile('#/marafon', 'flag', '#6a1b9a', 'Marafon', 'Barcha ' + B.q.length + ' ta savol ketma-ket') +
      tile('#/xatolar', 'warn', '#ef6c00', 'Xatolar ustida ishlash', mis ? mis + ' ta savol' : 'Hozircha xato yoʻq') +
      tile('#/saqlangan', 'star', '#f2a900', 'Saqlanganlar', S.saved.length + ' ta savol') +
      tile('#/avtodrom', 'car', '#00838f', 'Avtodrom simulyatori', 'Amaliy imtihon mashqlari') +
      tile('#/statistika', 'stats', '#455a64', 'Statistika', 'Natijalar va zaif mavzular') +
      tile('#/qidiruv', 'search', '#5d4037', 'Qidiruv', 'Savollar va javoblar boʻyicha') +
      '</div>' +
      '<p class="disclaimer" style="margin-top:16px">' + H('Savollar Yoʻl harakati qoidalari (VM 172-son qarori, lex.uz, 30.10.2026 tahriri) asosida mustaqil tuzilgan. Bular rasmiy imtihon savollari emas, lekin imtihondagi barcha mavzularni qamrab oladi.') + '</p>');
  }

  /* ---------------- biletlar ---------------- */
  function tickets() {
    setTitle('Biletlar', true);
    var h = '<div class="grid-t">';
    B.tickets.forEach(function (ids, i) {
      var r = S.tk[i + 1], cls = r ? (r.last >= 18 ? 'ok' : 'bad') : '';
      h += '<a class="tk ' + cls + '" href="javascript:void 0" data-t="' + (i + 1) + '">' + (i + 1) + (r ? '<small>' + r.last + '/20</small>' : '') + '</a>';
    });
    h += '</div><div class="legend"><span><i style="background:var(--ok)"></i>' + H('Topshirilgan (≥18)') + '</span><span><i style="background:var(--bad)"></i>' + H('Topshirilmagan') + '</span><span><i style="background:var(--ln)"></i>' + H('Hali yechilmagan') + '</span></div>' +
      '<div class="card small muted">' + H('Har bir biletda 20 ta savol bor: qoidalar va vaziyatlar, yoʻl belgilari, chiziqlar, texnik holat va tibbiy yordam. Imtihondagidek 2 tadan ortiq xato qilinsa, bilet topshirilmagan hisoblanadi.') + '</div>';
    view(h);
    Array.prototype.forEach.call(document.querySelectorAll('.tk'), function (a) {
      a.onclick = function () { var n = +a.getAttribute('data-t'); startRun({ mode: 'bilet', n: n, title: n + '-bilet', ids: B.tickets[n - 1].slice(), limit: 25 * 60 }); };
    });
  }

  /* ---------------- imtihon ---------------- */
  function examIntro() {
    setTitle('Imtihon', true);
    var hist = S.exams.slice(-5).reverse();
    view('<div class="card"><h3 style="margin:0 0 6px">' + H('Nazariy imtihon simulyatsiyasi') + '</h3>' +
      '<p class="muted" style="margin:0 0 10px">' + H('Imtihondagidek: 20 ta savol, 25 daqiqa. Kamida 18 ta toʻgʻri javob kerak (koʻpi bilan 2 ta xato). Savolni oʻtkazib yuborib, keyin qaytish mumkin. Izohlar imtihon tugagach koʻrsatiladi.') + '</p>' +
      '<button class="btn block" id="go">' + svg('exam') + H('Imtihonni boshlash') + '</button></div>' +
      (hist.length ? '<div class="h2">' + H('Oxirgi natijalar') + '</div><div class="list">' + hist.map(function (e) {
        return '<div class="row"><span class="pill ' + (e.pass ? 'ok' : 'bad') + '">' + e.ok + '/20</span><div class="t"><b>' + H(e.pass ? 'Topshirildi' : 'Topshirilmadi') + '</b><span class="cnt">' + H(new Date(e.ts).toLocaleString() + ' · ' + mmss(e.time)) + '</span></div></div>';
      }).join('') + '</div>' : ''));
    $('#go').onclick = function () { startRun({ mode: 'imtihon', title: 'Imtihon', ids: makeExam(), limit: B.exam.min * 60, exam: true }); };
  }
  function makeExam() {
    var rule = [], scene = [], sign = [], mk = [], tx = [], md = [];
    B.q.forEach(function (q) {
      var s = TOP[q.t] && TOP[q.t].s;
      if (q.t === 'chiziq') mk.push(q.id);
      else if (q.t === 'texnik') tx.push(q.id);
      else if (q.t === 'tibbiy') md.push(q.id);
      else if (q.t.indexOf('belgi') === 0) sign.push(q.id);
      else if (q.t !== 'jarima' && s === 'q') (q.sc ? scene : rule).push(q.id);
    });
    var ids = shuffle(scene).slice(0, 2).concat(shuffle(rule).slice(0, 10));
    var signs = [], seen = {};
    shuffle(sign).forEach(function (id) { if (signs.length < 5 && !seen[Q[id].sn]) { seen[Q[id].sn] = 1; signs.push(id); } });
    ids = ids.concat(signs, shuffle(mk).slice(0, 1), shuffle(tx).slice(0, 1), shuffle(md).slice(0, 1));
    return shuffle(ids);
  }

  /* ---------------- mavzular ---------------- */
  var SECT = { q: 'Yoʻl harakati qoidalari', b: 'Yoʻl belgilari va chiziqlar', x: 'Qoʻshimcha boʻlimlar' };
  function topics() {
    setTitle('Mavzular', true);
    var h = '';
    ['q', 'b', 'x'].forEach(function (s) {
      h += '<div class="h2">' + H(SECT[s]) + '</div><div class="list">';
      B.topics.filter(function (t) { return t.s === s; }).forEach(function (t) {
        var st = topicStat(t.id);
        h += '<a href="javascript:void 0" data-t="' + t.id + '"><div class="t"><b>' + H(t.n) + '</b><div class="bar2"><i style="width:' + pct(st.a, st.n) + '%"></i></div></div><span class="cnt">' + st.a + '/' + st.n + '</span></a>';
      });
      h += '</div>';
    });
    view(h);
    Array.prototype.forEach.call(document.querySelectorAll('.list a[data-t]'), function (a) {
      a.onclick = function () { startTopic(a.getAttribute('data-t')); };
    });
  }
  function marathon() {
    var ids = B.q.map(function (q) { return q.id; });
    startRun({ mode: 'marafon', title: 'Marafon', ids: ids, start: Math.min(S.mar || 0, ids.length - 1) }, true);
  }
  function mistakesPage() {
    var ids = mistakes();
    if (!ids.length) { setTitle('Xatolar ustida ishlash', true); return view('<div class="empty">' + svg('check') + H('Xato qilingan savollar yoʻq. Testlarni yechishda xato qilgan savollaringiz shu yerda toʻplanadi.') + '</div>'); }
    startRun({ mode: 'xato', title: 'Xatolar ustida ishlash', ids: shuffle(ids) }, true);
  }
  function savedPage() {
    var ids = S.saved.filter(function (x) { return Q[x]; });
    if (!ids.length) { setTitle('Saqlanganlar', true); return view('<div class="empty">' + svg('staro') + H('Hozircha saqlangan savol yoʻq. Savol ustidagi ☆ tugmasini bossangiz, u shu yerga qoʻshiladi.') + '</div>'); }
    startRun({ mode: 'saqlangan', title: 'Saqlanganlar', ids: ids }, true);
  }

  /* ---------------- test dvigateli ---------------- */
  var run = null, timerId = null;
  function startRun(o, replace) {
    run = { mode: o.mode, title: o.title, ids: o.ids, i: o.start || 0, ch: {}, exam: !!o.exam, limit: o.limit || 0, t0: Date.now(), n: o.n, topic: o.topic, done: false, warned: false };
    if (replace) location.replace('#/test'); else location.hash = '#/test';
    if (location.hash === '#/test') route();
  }
  function stopRun() { stopTimer(); run = null; }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function elapsed() { return (Date.now() - run.t0) / 1000; }
  function startTimer() {
    stopTimer();
    if (!run.limit || run.done) return;
    timerId = setInterval(function () {
      if (!run) return stopTimer();
      var left = run.limit - elapsed(), el = $('#tmr');
      if (el) { el.textContent = mmss(left); el.classList.toggle('low', left < 120); }
      if (left <= 0) { stopTimer(); toast('Vaqt tugadi'); finishRun(); }
    }, 500);
  }
  function errCount() { var e = 0; for (var k in run.ch) if (run.ch[k] !== Q[run.ids[k]].a) e++; return e; }
  function okCount() { var c = 0; for (var k in run.ch) if (run.ch[k] === Q[run.ids[k]].a) c++; return c; }
  function renderRun() {
    var q = Q[run.ids[run.i]], n = run.ids.length, ans = run.ch[run.i], answered = ans != null;
    var showExp = answered && !run.exam && S.set.exp;
    var ec = run.exam && !run.done ? errCount() : 0;
    var acts = (run.exam && !run.done ? '<span class="errc' + (ec > B.exam.err ? ' over' : '') + '" title="' + esc(T('Xatolar soni (koʻpi bilan ' + B.exam.err + ' ta mumkin)')) + '">' + esc(T('Xato')) + ': ' + ec + '</span>' : '') +
      (run.limit && !run.done ? '<span class="timer" id="tmr">' + mmss(run.limit - elapsed()) + '</span>' : '') +
      (run.exam || run.mode === 'bilet' ? '<button class="ib" id="fin" aria-label="Yakunlash" title="' + esc(T('Yakunlash')) + '">' + svg('check') + '</button>' : '');
    setTitle(run.title, true, acts);
    var h = '';
    if (n <= 60) {
      h += '<div class="qnav" id="qnav">';
      for (var i = 0; i < n; i++) {
        var c = run.ch[i], cls = i === run.i ? 'cur ' : '';
        if (c != null) cls += c === Q[run.ids[i]].a ? 'ok' : 'bad';
        h += '<button class="' + cls + '" data-i="' + i + '">' + (i + 1) + '</button>';
      }
      h += '</div>';
    }
    var saved = S.saved.indexOf(q.id) >= 0, tp = TOP[q.t];
    h += '<div class="qmeta"><span>' + H((run.i + 1) + ' / ' + n) + '</span><span>·</span><span>' + H(tp ? tp.n : '') + '</span><span class="sp"></span>' +
      (canSpeak() ? '<button id="say" title="' + esc(T('Ovoz chiqarib oʻqish')) + '">' + svg('vol') + '</button>' : '') +
      '<button id="sv" class="' + (saved ? 'on' : '') + '" title="' + esc(T('Saqlash')) + '">' + svg(saved ? 'star' : 'staro') + '</button></div>';
    h += '<div class="card qcard">' + figure(q) + '<div class="qtext">' + H(q.q) + '</div>' + optionsHtml(q, ans, false) + (showExp || (run.done && answered) ? expHtml(q, ans) : '') + '</div>';
    h += '<div class="qfoot">' +
      '<button class="btn sec" id="prev"' + (run.i === 0 ? ' disabled' : '') + '>' + svg('back') + H('Oldingi') + '</button>' +
      (run.i < n - 1 ? '<button class="btn" id="nx">' + H(answered ? 'Keyingi' : 'Oʻtkazish') + svg('next') + '</button>'
        : ((run.exam || run.mode === 'bilet') && !run.done ? '<button class="btn ok" id="fin2">' + H('Yakunlash') + '</button>' : '<button class="btn" id="end">' + H('Tugatish') + '</button>')) +
      '</div>';
    if (run.mode === 'marafon') h += '<p class="small muted" style="text-align:center;margin-top:10px">' + H('Marafon joyi saqlanadi. Klaviatura: 1–4 — javob, ← → — oʻtish.') + '</p>';
    view(h);
    var cur = document.querySelector('.qnav .cur'); if (cur) cur.scrollIntoView({ inline: 'center', block: 'nearest' });
    Array.prototype.forEach.call(document.querySelectorAll('.qnav button'), function (b) { b.onclick = function () { go(+b.getAttribute('data-i')); }; });
    Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (b) { b.onclick = function () { choose(+b.getAttribute('data-k')); }; });
    Array.prototype.forEach.call(document.querySelectorAll('.refs button'), function (b) { b.onclick = function () { bandSheet(b.getAttribute('data-b')); }; });
    $('#prev').onclick = function () { go(run.i - 1); };
    if ($('#nx')) $('#nx').onclick = function () { go(nextIndex()); };
    if ($('#end')) $('#end').onclick = function () { finishRun(); };
    if ($('#fin')) $('#fin').onclick = askFinish;
    if ($('#fin2')) $('#fin2').onclick = askFinish;
    $('#sv').onclick = function () { toggleSave(q.id); renderRun(); };
    if ($('#say')) $('#say').onclick = function () { speak(q, ans); };
    if (run.mode === 'marafon') { S.mar = run.i; save(); }
    startTimer();
  }
  function nextIndex() {
    if (!run.exam || run.i < run.ids.length - 1) return Math.min(run.i + 1, run.ids.length - 1);
    return run.i;
  }
  function go(i) {
    if (i < 0 || i >= run.ids.length) return;
    run.i = i; renderRun();
  }
  function figure(q) {
    if (q.sc) return '<div class="qfig">' + YHQScene.render(q.sc) + '</div>';
    if (q.img) return '<div class="qfig"><img src="' + q.img + '" alt="" class="' + (q.wide ? 'wide' : '') + '"></div>';
    return '';
  }
  var KEYS = ['A', 'B', 'C', 'D', 'E'];
  function fineLabel(b) {
    if (!b || !b.length) return '';
    var v = S.set.bhm || B.bhm, a = fmt(b[0] * v);
    return b.length > 1 ? a + ' – ' + fmt(b[1] * v) + ' soʻm' : a + ' soʻm';
  }
  function optionsHtml(q, ans, hide) {
    var answered = ans != null, img = q.k === 'img4';
    var h = '<div class="opts' + (img ? ' img4' : '') + (q.wide ? ' wide' : '') + '">';
    q.o.forEach(function (o, k) {
      var cls = 'opt';
      if (answered) {
        if (hide) { if (k === ans) cls += ' sel'; }
        else if (k === q.a) cls += ' ok';
        else if (k === ans) cls += ' bad';
      }
      var body = img ? '<img src="' + o + '" alt="">' : '<span>' + H(o) + (q.fb ? '<span class="fine">' + H(fineLabel(q.fb[k])) + '</span>' : '') + '</span>';
      h += '<button class="' + cls + '" data-k="' + k + '"' + (answered && !hide ? ' disabled' : '') + '><span class="k">' + KEYS[k] + '</span>' + body + '</button>';
    });
    return h + '</div>';
  }
  function expHtml(q, ans) {
    var ok = ans === q.a;
    var refs = (q.r || []).map(function (r) { return '<button data-b="' + esc(r) + '">' + bandName(r) + H('-band') + '</button>'; }).join('');
    return '<div class="exp ' + (ok ? 'ok' : 'bad') + '"><b>' + H(ok ? 'Toʻgʻri!' : 'Notoʻgʻri. Toʻgʻri javob: ' + KEYS[q.a]) + '</b>' + H(q.e) + (refs ? '<div class="refs">' + refs + '</div>' : '') + '</div>';
  }
  function choose(k) {
    if (!run || run.done) return;
    var q = Q[run.ids[run.i]];
    if (run.ch[run.i] != null && !run.exam) return;
    if (run.exam && run.ch[run.i] != null) return; // imtihonda javobni o'zgartirib bo'lmaydi
    run.ch[run.i] = k;
    var ok = k === q.a;
    mark(q.id, ok); save();
    if (navigator.vibrate && !ok) try { navigator.vibrate(60); } catch (e) { }
    if (run.mode === 'xato' && ok) { /* toʻgʻri javob xatolar roʻyxatidan chiqaradi */ }
    if (run.exam) {
      // imtihonda ham javob darhol koʻrinadi: xato — qizil, toʻgʻri — yashil; biroz kutib keyingi savolga oʻtadi
      var errs = errCount(), r0 = run, i0 = run.i;
      renderRun();
      var later = function (fn, ms) { setTimeout(function () { if (run === r0 && !r0.done) fn(); }, ms); };
      if (errs === B.exam.err + 1 && !run.warned) {
        run.warned = true;
        return later(function () {
          confirmBox('Bu ' + errs + '-xato. Haqiqiy imtihonda natija «topshirmadi» boʻlardi. Imtihonni yakunlaysizmi?', function () { finishRun(); }, 'Yakunlash', 'Davom etish', function () { autoNext(); });
        }, 900);
      }
      if (Object.keys(run.ch).length === run.ids.length) return later(finishRun, ok ? 900 : 1600);
      return later(function () { if (run.i === i0) autoNext(); }, ok ? 700 : 1500);
    }
    renderRun();
    if (run.mode === 'bilet' && Object.keys(run.ch).length === run.ids.length) {
      var r0 = run; // faqat shu biletni yakunlash (bu orada boshqa test boshlangan boʻlishi mumkin)
      setTimeout(function () { if (run === r0 && !r0.done) finishRun(); }, 1200);
    }
  }
  function autoNext() {
    // keyingi javob berilmagan savolga o'tish
    var n = run.ids.length;
    for (var s = 1; s <= n; s++) { var j = (run.i + s) % n; if (run.ch[j] == null) { run.i = j; break; } }
    renderRun();
  }
  function askFinish() {
    var left = run.ids.length - Object.keys(run.ch).length;
    if (left > 0) confirmBox(left + ' ta savolga javob berilmagan. Yakunlaysizmi?', finishRun, 'Yakunlash', 'Qaytish');
    else finishRun();
  }
  function finishRun() {
    if (!run || run.done) return;
    stopTimer();
    run.done = true; run.time = Math.min(elapsed(), run.limit || 1e9);
    var ok = okCount(), n = run.ids.length, errs = n - ok;
    run.ok = ok; run.pass = errs <= B.exam.err;
    if (run.mode === 'bilet') {
      var r = S.tk[run.n] || { best: 0, tries: 0 };
      r.last = ok; r.best = Math.max(r.best || 0, ok); r.tries++; r.ts = Date.now(); S.tk[run.n] = r;
    }
    if (run.exam) { S.exams.push({ ts: Date.now(), ok: ok, time: Math.round(run.time), pass: run.pass }); if (S.exams.length > 100) S.exams.shift(); }
    save();
    location.hash = '#/natija';
  }
  function results() {
    var n = run.ids.length, ok = run.ok, answered = Object.keys(run.ch).length, scored = run.exam || run.mode === 'bilet';
    setTitle('Natija', true);
    var h = '<div class="card"><div class="res-big">' + ok + ' / ' + n + '</div>' +
      (scored ? '<div class="res-st ' + (run.pass ? 'ok' : 'bad') + '">' + H(run.pass ? 'Tabriklaymiz — topshirdingiz!' : 'Topshirilmadi — koʻpi bilan 2 ta xato mumkin') + '</div>' : '<div class="res-st">' + H(run.title) + '</div>') +
      '<div class="kv"><div><b>' + ok + '</b><span>' + H('toʻgʻri') + '</span></div><div><b>' + (answered - ok) + '</b><span>' + H('xato') + '</span></div><div><b>' + (n - answered) + '</b><span>' + H('javobsiz') + '</span></div><div><b>' + mmss(run.time) + '</b><span>' + H('vaqt') + '</span></div></div>' +
      '<div class="btns"><button class="btn" id="again">' + svg('redo') + H(run.exam ? 'Yangi imtihon' : 'Qayta yechish') + '</button>' +
      (answered - ok > 0 ? '<button class="btn sec" id="mist">' + H('Xatolarni koʻrish') + '</button>' : '') + '</div></div>';
    h += '<div id="aiSlot"></div>'; // sayt varianti: AI xulosa (js/ai.js)
    h += '<div class="h2">' + H('Savollar') + '</div><div class="list revlist">';
    run.ids.forEach(function (id, i) {
      var q = Q[id], c = run.ch[i], col = c == null ? '#90a4ae' : (c === q.a ? 'var(--ok)' : 'var(--bad)');
      h += '<a href="javascript:void 0" data-i="' + i + '"><span class="n" style="background:' + col + '">' + (i + 1) + '</span><span>' + H(q.q.length > 140 ? q.q.slice(0, 140) + '…' : q.q) + '</span></a>';
    });
    h += '</div>';
    view(h);
    var r = run;
    $('#again').onclick = function () {
      if (r.exam) startRun({ mode: 'imtihon', title: 'Imtihon', ids: makeExam(), limit: B.exam.min * 60, exam: true }, true);
      else startRun({ mode: r.mode, n: r.n, title: r.title, ids: r.ids.slice(), limit: r.limit, topic: r.topic }, true);
    };
    if ($('#mist')) $('#mist').onclick = function () {
      var ids = r.ids.filter(function (id, i) { return r.ch[i] != null && r.ch[i] !== Q[id].a; });
      startRun({ mode: 'xato', title: 'Xatolar', ids: ids });
    };
    Array.prototype.forEach.call(document.querySelectorAll('.revlist a'), function (a) {
      a.onclick = function () { r.i = +a.getAttribute('data-i'); run = r; location.hash = '#/test'; };
    });
    if (window.YHQAI) try { YHQAI.mount('natija', $('#aiSlot'), r); } catch (e) { }
  }
  function startTopic(id) {
    if (!TOP[id]) return;
    var ids = B.q.filter(function (q) { return q.t === id; }).map(function (q) { return q.id; });
    // avval yechilmagan va xato qilinganlar
    var fresh = ids.filter(function (x) { return !S.ans[x]; }), bad = ids.filter(function (x) { return S.ans[x] && !S.ans[x][0]; }), good = ids.filter(function (x) { return S.ans[x] && S.ans[x][0]; });
    startRun({ mode: 'mavzu', title: TOP[id].n, ids: fresh.concat(bad, good), topic: id });
  }
  function toggleSave(id) {
    var i = S.saved.indexOf(id);
    if (i >= 0) { S.saved.splice(i, 1); toast('Saqlanganlardan olib tashlandi'); } else { S.saved.push(id); toast('Saqlanganlarga qoʻshildi'); }
    save();
  }

  /* ---------------- band oynasi ---------------- */
  function bandSheet(n) {
    var b = B.bands[n]; if (!b) return;
    var h = '<h3>' + bandName(n) + H('-band') + '</h3><div class="src">' + H(b.c.replace(/\^\{(\d+)\}/, '^$1') + '-bob. ' + b.ct) + '</div>' +
      b.t.map(function (p) { return '<p>' + H(p) + '</p>'; }).join('') +
      '<p class="src" style="margin-top:12px">' + H('Manba: Yoʻl harakati qoidalari, VM 172-son qarori (lex.uz)') + '</p>';
    sheet(h);
  }
  function sheet(inner) {
    var bg = document.createElement('div'); bg.className = 'sheet-bg';
    bg.innerHTML = '<div class="sheet">' + inner + '<div class="btns"><button class="btn sec block">' + H('Yopish') + '</button></div></div>';
    bg.onclick = function (e) { if (e.target === bg || e.target.closest('.btn')) bg.remove(); };
    document.body.appendChild(bg);
  }
  function confirmBox(msg, yes, yesT, noT, no) {
    var bg = document.createElement('div'); bg.className = 'sheet-bg center';
    bg.innerHTML = '<div class="modal"><p style="margin:0 0 14px;font-size:16px">' + H(msg) + '</p><div class="btns"><button class="btn sec" data-a="0">' + H(noT || 'Bekor qilish') + '</button><button class="btn" data-a="1">' + H(yesT || 'Ha') + '</button></div></div>';
    bg.onclick = function (e) {
      var b = e.target.closest('button'); if (!b && e.target !== bg) return;
      bg.remove(); if (b && b.getAttribute('data-a') === '1') yes(); else if (no) no();
    };
    document.body.appendChild(bg);
  }

  /* ---------------- statistika ---------------- */
  function stats() {
    setTitle('Statistika', true);
    var t = totals(), days = [], d = new Date();
    for (var i = 13; i >= 0; i--) { var x = new Date(d.getTime() - i * 864e5), k = x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(); days.push([x.getDate(), S.days[k] || 0]); }
    var mx = Math.max.apply(null, days.map(function (z) { return z[1]; }).concat([10]));
    var chart = '<svg class="chart" viewBox="0 0 280 120" preserveAspectRatio="none">' + days.map(function (z, i) {
      var hgt = Math.round(z[1] / mx * 92), x = 4 + i * 20;
      return '<rect x="' + x + '" y="' + (100 - hgt) + '" width="14" height="' + Math.max(hgt, 1) + '" rx="3" fill="var(--pri)" opacity="' + (z[1] ? 1 : .25) + '"/><text x="' + (x + 7) + '" y="114" font-size="8" text-anchor="middle" fill="var(--mut)">' + z[0] + '</text>';
    }).join('') + '</svg>';
    var passed = 0, tried = 0; for (var kk in S.tk) { tried++; if (S.tk[kk].best >= 18) passed++; }
    var ex = S.exams, exOk = ex.filter(function (e) { return e.pass; }).length;
    var tops = B.topics.map(function (tp) { var s = topicStat(tp.id); return { tp: tp, s: s, p: s.a ? s.ok / s.a : 1 }; });
    var weak = tops.filter(function (z) { return z.s.a >= 5; }).sort(function (a, b) { return a.p - b.p; }).slice(0, 5);
    var h = '<div class="card"><div class="kv"><div><b>' + t.a + '</b><span>' + H('yechilgan') + '</span></div><div><b>' + pct(t.ok, t.a) + '%</b><span>' + H('toʻgʻri') + '</span></div><div><b>' + passed + '/' + B.tickets.length + '</b><span>' + H('bilet') + '</span></div><div><b>' + exOk + '/' + ex.length + '</b><span>' + H('imtihon') + '</span></div></div></div>' +
      '<div class="card"><b>' + H('Soʻnggi 14 kun faolligi') + '</b>' + chart + '</div>';
    h += '<div id="aiSlot"></div>'; // sayt varianti: AI tahlil (js/ai.js)
    if (weak.length) h += '<div class="h2">' + H('Eʼtibor bering — zaif mavzular') + '</div><div class="list">' + weak.map(function (z) {
      return '<a href="#/mavzular"><div class="t"><b>' + H(z.tp.n) + '</b><div class="bar2"><i style="width:' + Math.round(z.p * 100) + '%;background:' + (z.p < .7 ? 'var(--bad)' : 'var(--ok)') + '"></i></div></div><span class="cnt">' + Math.round(z.p * 100) + '%</span></a>';
    }).join('') + '</div>';
    h += '<div class="h2">' + H('Mavzular boʻyicha') + '</div><div class="list">' + tops.map(function (z) {
      return '<div class="row"><div class="t" style="flex:1"><b style="font-weight:600;font-size:14.5px">' + H(z.tp.n) + '</b><div class="bar2"><i style="width:' + pct(z.s.a, z.s.n) + '%"></i></div></div><span class="cnt">' + z.s.a + '/' + z.s.n + (z.s.a ? ' · ' + Math.round(z.p * 100) + '%' : '') + '</span></div>';
    }).join('') + '</div>';
    h += '<div class="btns"><button class="btn sec" id="rst">' + H('Natijalarni tozalash') + '</button></div>';
    view(h);
    $('#rst').onclick = function () { confirmBox('Barcha natijalar, biletlar va saqlanganlar oʻchiriladi. Davom etasizmi?', function () { var set = S.set; S = defaults(); S.set = set; save(); stats(); toast('Tozalandi'); }); };
    if (window.YHQAI) try {
      YHQAI.mount('stat', $('#aiSlot'), {
        a: t.a, ok: t.ok, n: t.n, tickets: B.tickets.length, tkTried: tried, tkPassed: passed,
        exams: ex.slice(-10), days: days.filter(function (z) { return z[1] > 0; }).length,
        tops: tops.map(function (z) { return { id: z.tp.id, n: z.tp.n, all: z.s.n, a: z.s.a, ok: z.s.ok }; })
      });
    } catch (e) { }
  }

  /* ---------------- qidiruv ---------------- */
  var NORM = null;
  function norm(s) { return window.Translit ? Translit.norm(s) : String(s).toLowerCase(); }
  function searchPage(qs) {
    setTitle('Qidiruv', true);
    view('<input type="search" id="qs" placeholder="' + esc(T('Savol yoki javobdan soʻz kiriting…')) + '" value="' + esc(qs) + '" autocomplete="off"><div id="res" style="margin-top:12px"></div>');
    var inp = $('#qs'), res = $('#res');
    if (!NORM) NORM = B.q.map(function (q) { return norm(q.q + ' ' + (q.k === 'img4' ? '' : q.o.join(' ')) + ' ' + q.e); });
    function doit() {
      var v = norm(inp.value).trim();
      if (v.length < 2) { res.innerHTML = '<p class="muted small">' + H('Kamida 2 ta harf kiriting. Lotin va kirill yozuvida qidirish mumkin.') + '</p>'; return; }
      var words = v.split(' ').filter(Boolean), found = [];
      for (var i = 0; i < B.q.length && found.length < 60; i++) { var s = NORM[i]; if (words.every(function (w) { return s.indexOf(w) >= 0; })) found.push(B.q[i].id); }
      if (!found.length) { res.innerHTML = '<div class="empty">' + svg('search') + H('Hech narsa topilmadi') + '</div>'; return; }
      res.innerHTML = '<p class="muted small">' + H(found.length + (found.length === 60 ? '+' : '') + ' ta natija') + '</p><div class="list revlist">' + found.map(function (id, i) {
        var q = Q[id];
        return '<a href="javascript:void 0" data-i="' + i + '"><span class="n" style="background:var(--pri)">' + (i + 1) + '</span><span>' + H(q.q) + '<br><span class="cnt">' + H(TOP[q.t].n) + '</span></span></a>';
      }).join('') + '</div>';
      Array.prototype.forEach.call(res.querySelectorAll('a'), function (a) {
        a.onclick = function () { history.replaceState(null, '', '#/qidiruv/' + encodeURIComponent(inp.value)); startRun({ mode: 'qidiruv', title: 'Qidiruv natijalari', ids: found, start: +a.getAttribute('data-i') }); };
      });
    }
    inp.oninput = doit; doit(); if (!qs) inp.focus();
  }

  /* ---------------- sozlamalar ---------------- */
  function seg(name, opts, val) { return '<div class="seg" data-s="' + name + '">' + opts.map(function (o) { return '<button data-v="' + o[0] + '" class="' + (String(val) === String(o[0]) ? 'on' : '') + '">' + H(o[1]) + '</button>'; }).join('') + '</div>'; }
  function settings() {
    setTitle('Sozlamalar', true);
    var h = '<div class="list">' +
      '<div class="field"><div class="t">' + H('Yozuv') + '<small>' + H('Ilova matni lotin yoki kirill yozuvida') + '</small></div>' + seg('script', [['lat', 'Lotin'], ['kir', 'Кирилл']], S.set.script) + '</div>' +
      '<div class="field"><div class="t">' + H('Mavzu (rang)') + '</div>' + seg('theme', [['auto', 'Avto'], ['light', 'Kunduzgi'], ['dark', 'Tungi']], S.set.theme) + '</div>' +
      '<div class="field"><div class="t">' + H('Matn oʻlchami') + '</div>' + seg('fs', [[14, 'A−'], [16, 'A'], [18, 'A+'], [20, 'A++']], S.set.fs) + '</div>' +
      '<div class="field"><div class="t">' + H('Javobdan keyin izohni koʻrsatish') + '<small>' + H('Mashq rejimlarida (imtihonda izoh oxirida chiqadi)') + '</small></div><label class="sw"><input type="checkbox" id="exp"' + (S.set.exp ? ' checked' : '') + '><i></i></label></div>' +
      '<div class="field"><div class="t">' + H('Ovozli oʻqish tugmasi') + '<small>' + H(canSpeak(true) ? 'Savol va izohni qurilma ovozi bilan oʻqiydi' : 'Bu qurilmada nutq sintezatori topilmadi') + '</small></div><label class="sw"><input type="checkbox" id="voice"' + (S.set.voice ? ' checked' : '') + '><i></i></label></div>' +
      '<div class="field"><div class="t">' + H('Bazaviy hisoblash miqdori (BHM)') + '<small>' + H('Jarimalarni soʻmda hisoblash uchun') + '</small></div><input type="number" id="bhm" min="1000" step="1000" value="' + (S.set.bhm || B.bhm) + '"></div>' +
      (AND ? '<div class="field"><div class="t">' + H('Kundalik eslatma') + '<small>' + H('Har kuni belgilangan vaqtda mashq qilishni eslatadi') + '</small></div><input type="time" id="rem" value="' + esc(S.set.rem || '') + '"></div>' : '') +
      '</div><div class="list"><a href="#/haqida"><div class="t"><b>' + H('Ilova haqida') + '</b><span class="cnt">' + H('Manbalar, versiya') + '</span></div>' + svg('info') + '</a></div>';
    view(h);
    Array.prototype.forEach.call(document.querySelectorAll('.seg'), function (sg) {
      sg.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var k = sg.getAttribute('data-s'), v = b.getAttribute('data-v'); S.set[k] = k === 'fs' ? +v : v; save(); applySettings(); NORM = null; drawNav(); settings();
      };
    });
    $('#exp').onchange = function () { S.set.exp = this.checked ? 1 : 0; save(); };
    $('#voice').onchange = function () { S.set.voice = this.checked ? 1 : 0; save(); };
    $('#bhm').onchange = function () { var v = Math.max(1000, +this.value || B.bhm); S.set.bhm = v; save(); toast('Saqlandi'); };
    if ($('#rem')) $('#rem').onchange = function () {
      S.set.rem = this.value; save();
      try { AndroidBridge.setReminder(this.value || ''); toast(this.value ? 'Eslatma har kuni ' + this.value + ' da' : 'Eslatma oʻchirildi'); } catch (e) { }
    };
  }
  function applySettings() {
    var dark = S.set.theme === 'dark' || (S.set.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.setProperty('--fs', (S.set.fs || 16) + 'px');
    var meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = dark ? '#1a2333' : '#1d4fa0';
    try { if (AND && AndroidBridge.setBars) AndroidBridge.setBars(dark ? '#1a2333' : '#1d4fa0', dark ? '#181d26' : '#ffffff', !dark); } catch (e) { }
  }

  /* ---------------- ovoz ---------------- */
  function canSpeak(any) {
    if (!any && !S.set.voice) return false;
    if (AND) { try { return !!AndroidBridge.canSpeak(); } catch (e) { return false; } }
    return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }
  function speechText(q, ans) {
    var s = q.q + '. ';
    if (q.k !== 'img4') q.o.forEach(function (o, k) { s += KEYS[k] + ': ' + o + '. '; });
    if (ans != null && !(run && run.exam && !run.done)) s += (ans === q.a ? 'Toʻgʻri. ' : 'Toʻgʻri javob: ' + KEYS[q.a] + '. ') + q.e;
    return s.replace(/[«»“”]/g, '');
  }
  function speak(q, ans) {
    var text = speechText(q, ans);
    if (AND) { try { AndroidBridge.speak(Translit.toCyr(text)); } catch (e) { } return; }
    var ss = window.speechSynthesis; if (!ss) return;
    if (ss.speaking) { ss.cancel(); return; }
    var vs = ss.getVoices(), v = null, pick = function (re) { for (var i = 0; i < vs.length; i++) if (re.test(vs[i].lang)) return vs[i]; return null; };
    v = pick(/^uz/i); var t = text;
    if (!v) { v = pick(/^tr/i); }
    if (!v) { v = pick(/^ru/i); if (v) t = Translit.toCyr(text); }
    var u = new SpeechSynthesisUtterance(t); if (v) { u.voice = v; u.lang = v.lang; } u.rate = 0.95;
    ss.speak(u);
  }

  /* ---------------- haqida ---------------- */
  function about() {
    setTitle('Ilova haqida', true);
    var c = {}; B.q.forEach(function (q) { var s = TOP[q.t].s; c[s] = (c[s] || 0) + 1; });
    view('<div class="card"><h3 style="margin:0 0 6px">YHQ Test 2026 · v' + esc(B.v) + '</h3><p class="muted" style="margin:0">' +
      H('Yoʻl harakati qoidalari boʻyicha nazariy imtihonga tayyorlanish ilovasi. Internetsiz ishlaydi.') + '</p>' +
      '<div class="kv"><div><b>' + B.q.length + '</b><span>' + H('savol') + '</span></div><div><b>' + B.tickets.length + '</b><span>' + H('bilet') + '</span></div><div><b>' + B.topics.length + '</b><span>' + H('mavzu') + '</span></div></div></div>' +
      '<div class="card small"><b>' + H('Manbalar') + '</b><p style="margin:.4em 0">' + H('Yoʻl harakati qoidalari — Vazirlar Mahkamasining 2022-yil 12-apreldagi 172-son qarori (lex.uz, 30.10.2026 holatidagi tahrir); Maʼmuriy javobgarlik toʻgʻrisidagi kodeks; imtihon tartibi va avtodrom mashqlari — VM 272-son qarori bilan tasdiqlangan nizom.') + '</p>' +
      '<p style="margin:.4em 0">' + H('Savollar va vaziyat rasmlari shu manbalar asosida mustaqil tuzilgan. Rasmiy imtihon savollari bazasi ochiq eʼlon qilinmagan, shuning uchun bu savollar imtihondagilar bilan soʻzma-soʻz bir xil emas. Tibbiy yordam savollari xalqaro birinchi yordam tavsiyalariga asoslangan.') + '</p>' +
      '<p style="margin:.4em 0">' + H('Jarimalar BHM boʻyicha hisoblanadi (standart: ' + fmt(B.bhm) + ' soʻm). BHM oʻzgarsa, sozlamalarda yangilang.') + '</p></div>' +
      (WEB ? '<div class="card small"><b>' + H('Yuklab olish') + '</b><p style="margin:.4em 0">' + H('Telefonga oʻrnatsangiz, internetsiz ishlaydi (Android 7.0 va undan yangi, 1,7 MB).') + '</p><a class="btn" href="yuklab/YHQ-Test-2026.apk" download>' + H('Android (APK) yuklab olish') + '</a></div>' +
        '<div class="card small"><b>' + H('Kompyuter sinfi uchun (Windows)') + '</b><p style="margin:.4em 0">' + H('Bitta oʻqituvchi serveri va oʻquvchi kompyuterlari — lokal tarmoqda, internetsiz imtihon. Ruxsat bilan boshlash, jonli kuzatuv, Excel natijalar.') + '</p><a class="btn" href="lan/">' + H('AvtoTest LAN — batafsil va yuklab olish') + '</a></div>' : '') +
      '<p class="disclaimer">' + H('Toshkent tuman 1-son texnikumi · 2026') + '</p>');
  }

  /* ---------------- avtodrom ---------------- */
  function simPage() {
    setTitle('Avtodrom simulyatori', true);
    if (!window.YHQSim) { view('<div class="empty">' + H('Simulyator yuklanmadi') + '</div>'); return; }
    YHQSim.menu($('#view'), { T: T, H: H });
  }

  /* ---------------- klaviatura va surish ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (document.querySelector('.sheet-bg')) { if (e.key === 'Escape') document.querySelector('.sheet-bg').remove(); return; }
    if (!run || location.hash !== '#/test') return;
    if (/^[1-5]$/.test(e.key)) { var k = +e.key - 1; if (k < Q[run.ids[run.i]].o.length) choose(k); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') go(nextIndex());
    else if (e.key === 'ArrowLeft') go(run.i - 1);
  });
  var tx0 = null, ty0 = null;
  document.addEventListener('touchstart', function (e) { if (!run || location.hash !== '#/test' || e.touches.length !== 1) return; tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx0 == null || !run) return;
    var dx = e.changedTouches[0].clientX - tx0, dy = e.changedTouches[0].clientY - ty0; tx0 = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && !e.target.closest('.qnav')) go(dx < 0 ? nextIndex() : run.i - 1);
  }, { passive: true });

  /* ---------------- ishga tushirish ---------------- */
  shell(); applySettings();
  if (window.matchMedia) try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySettings); } catch (e) { }
  window.addEventListener('hashchange', route);
  route();
  window.YHQApp = { T: T, H: H, esc: esc, svg: svg, toast: toast, sheet: sheet, save: save, state: function () { return S; },
    q: function (id) { return Q[id]; }, topic: function (id) { return TOP[id]; }, band: bandSheet, startTopic: startTopic, mmss: mmss };
})();
