/* YHQ Test 2026 — avtodrom simulyatori (2D, yuqoridan koʻrinish).
 * Mashqlar va jarima ballari VM 272-son qarori bilan tasdiqlangan nizomning 2-ilovasidagi «Avtomobil boshqarish boʻyicha imtihon varaqasi»ga asoslangan:
 * har bir xato — 20 ball, bosqichni notoʻgʻri bajarish — 100 ball; jami 99 balldan oshmasa — topshirildi. */
(function (g) {
  'use strict';
  var Gc = 9.81, WB = 2.6, RO = 0.85, FO = 0.85, CW = 1.8, DMAX = 35 * Math.PI / 180;
  var hp = null, wrap = null, cv = null, ctx = null, raf = 0, last = 0, st = null, seq = null, seqTotal = 0, seqLog = [];
  var keys = {}, inp = { steer: 0, gas: 0, brake: 0, gasHeld: false, brakeHeld: false, wheelHeld: false };
  function T(s) { return hp ? hp.T(s) : s; }
  function H(s) { return hp ? hp.H(s) : s; }

  /* ---------------- geometriya ---------------- */
  function corners(s) {
    var c = Math.cos(s.th), sn = Math.sin(s.th), out = [];
    [[-RO, -CW / 2], [-RO, CW / 2], [WB + FO, CW / 2], [WB + FO, -CW / 2]].forEach(function (p) {
      out.push([s.x + p[0] * c - p[1] * sn, s.y + p[0] * sn + p[1] * c]);
    });
    return out;
  }
  function front(s) { return [s.x + (WB + FO) * Math.cos(s.th), s.y + (WB + FO) * Math.sin(s.th)]; }
  function center(s) { return [s.x + (WB / 2) * Math.cos(s.th), s.y + (WB / 2) * Math.sin(s.th)]; }
  function segX(a, b, c, d) {
    function o(p, q, r) { return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); }
    var d1 = o(a, b, c), d2 = o(a, b, d), d3 = o(c, d, a), d4 = o(c, d, b);
    return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
  }
  function inPoly(p, poly) {
    var ins = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if (((poly[i][1] > p[1]) !== (poly[j][1] > p[1])) && (p[0] < (poly[j][0] - poly[i][0]) * (p[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])) ins = !ins;
    }
    return ins;
  }
  function distSeg(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1);
    t = Math.max(0, Math.min(1, t)); var x = a[0] + t * dx - p[0], y = a[1] + t * dy - p[1]; return Math.sqrt(x * x + y * y);
  }
  function hitsWall(s, w) {
    var c = corners(s);
    for (var i = 0; i < 4; i++) if (segX(c[i], c[(i + 1) % 4], w[0], w[1])) return true;
    return false;
  }
  function hitsPole(s, p) {
    var c = corners(s); if (inPoly([p[0], p[1]], c)) return true;
    for (var i = 0; i < 4; i++) if (distSeg([p[0], p[1]], c[i], c[(i + 1) % 4]) < p[2]) return true;
    return false;
  }
  function insideRect(s, r) { return corners(s).every(function (p) { return p[0] >= r[0] && p[0] <= r[2] && p[1] >= r[1] && p[1] <= r[3]; }); }
  function angDiff(a, b) { var d = (a - b) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d); }

  /* ---------------- mashqlar ---------------- */
  function rectWalls(x1, y1, x2, y2, skip) { // skip: ochiq tomonlar 'n','s','e','w'
    var w = []; skip = skip || '';
    if (skip.indexOf('n') < 0) w.push([[x1, y1], [x2, y1]]);
    if (skip.indexOf('s') < 0) w.push([[x1, y2], [x2, y2]]);
    if (skip.indexOf('w') < 0) w.push([[x1, y1], [x1, y2]]);
    if (skip.indexOf('e') < 0) w.push([[x2, y1], [x2, y2]]);
    return w;
  }
  var EX = {
    hill: {
      name: 'Tepalikda toʻxtash va qoʻzgʻalish (estakada)', code: '1',
      info: 'Estakadaga koʻtarilib, «STOP» chizigʻidan oʻtmasdan toʻxtang (chiziqqacha 1,5 m ichida). Ishora berilgach, orqaga 70 sm dan koʻp jilmasdan, ravon qoʻzgʻalib yuqoriga chiqing. Maslahat: qoʻl tormozini (P) torting, gazni sekin bosing va keyin qoʻl tormozini qoʻyib yuboring.',
      area: [-9, -6, 9, 46], start: { x: 0, y: 40, th: -Math.PI / 2 },
      ramp: { x1: -1.9, x2: 1.9, y1: 10, y2: 28, grade: 0.12 }, stopY: 17, finY: 2,
      walls: [[[-1.9, 4], [-1.9, 30]], [[1.9, 4], [1.9, 30]]],
      init: function (s) { s.phase = 'yaqinlash'; s.stopAt = null; s.rolled = false; s.jerk = false; },
      update: function (s, dt) {
        var f = front(s), up = -(s.y); // yuqoriga koʻtarilish oʻqi: y kamaygan sari
        if (s.phase === 'yaqinlash') {
          if (f[1] < this.stopY - 0.05 && !s.crossed) { s.crossed = true; pen('5', 'STOP chizigʻini bosib oʻtdi — bosqich notoʻgʻri bajarildi', 100); }
          if (Math.abs(s.v) < 0.03) s.still += dt; else s.still = 0;
          if (s.still > 0.6 && f[1] <= this.stopY + 1.5 && f[1] >= this.stopY - 3) { s.phase = 'kutish'; s.wait = 2.2; s.stopAt = up; hint('Toʻxtadingiz. Ishorani kuting…'); }
          else if (s.still > 0.6 && f[1] > this.stopY + 1.5 && f[1] < this.stopY + 8) hint('STOP chizigʻiga yaqinroq toʻxtang (1,5 m ichida)');
        } else if (s.phase === 'kutish') {
          s.wait -= dt; if (up < s.stopAt - 0.7 && !s.rolled) { s.rolled = true; pen('1.3', 'Orqaga 70 sm dan koʻp jildi', 20); }
          if (s.wait <= 0) { s.phase = 'qoʻzgʻalish'; s.light = 'g'; hint('Ishora berildi — harakatni boshlang!'); }
        } else if (s.phase === 'qoʻzgʻalish') {
          if (up < s.stopAt - 0.7 && !s.rolled) { s.rolled = true; pen('1.3', 'Orqaga 70 sm dan koʻp jildi', 20); }
          if (!s.moved && s.v > 0.15) { s.moved = true; if (s.gasAtStart > 0.85 && !s.jerk) { s.jerk = true; pen('1.1', 'Notekis (keskin) qoʻzgʻaldi', 20); } }
          if (Math.abs(s.v) < 0.05) s.gasAtStart = inp.gas;
          if (f[1] < this.finY) finish();
        }
      },
      wallPen: ['5', 'Estakada chetidan chiqib ketdi — bosqich notoʻgʻri bajarildi', 100, true],
      stall: ['1.2', 'Dvigatelni oʻchirib qoʻydi', 20]
    },
    uturn: {
      name: 'Cheklangan joyda qayrilib olish', code: '2',
      info: 'Yoʻlak boʻylab oʻtib, yon tomondagi boksga orqa bilan kirib qayriling va teskari yoʻnalishda (chapga) chiqib keting. Orqa uzatmani faqat 1 marta qoʻshish mumkin, chegaralarga tegmang.',
      area: [-2, -8, 38, 9], start: { x: 3, y: 4.3, th: 0 },
      box: [16.5, -5, 20.3, 0],
      walls: [[[0, 0], [16.5, 0]], [[20.3, 0], [36, 0]], [[0, 7], [36, 7]], [[16.5, -5], [16.5, 0]], [[20.3, -5], [20.3, 0]], [[16.5, -5], [20.3, -5]], [[36, 0], [36, 7]]],
      init: function (s) { s.rev = 0; s.revPen = false; },
      update: function (s, dt) {
        if (s.gearChangedToR) { s.rev++; s.gearChangedToR = false; if (s.rev > 1 && !s.revPen) { s.revPen = true; pen('2.1', 'Orqa uzatmani 1 marta qoʻshib qayrila olmadi', 20); } }
        var f = front(s);
        if (s.x < 1.5 && f[0] < 0.8 && angDiff(s.th, Math.PI) < 0.6) finish();
        if (s.x > 34) { pen('5', 'Qayrilmasdan yoʻlakdan chiqib ketdi', 100); finish(); }
      },
      wallPen: ['2.3', 'Cheklagichlardan chetga oʻtib ketdi', 20],
      stall: ['2.2', 'Dvigatelni oʻchirib qoʻydi', 20]
    },
    slalom: {
      name: 'Ilon izi', code: '3',
      info: 'Ustunchalarni navbatma-navbat aylanib oʻting: birinchisini chap tomonidan (yerdagi strelkalar boʻyicha). Toʻxtamang va ustunchalarga tegmang.',
      area: [-2, -6, 70, 6], start: { x: 2, y: 2, th: 0 },
      poles: [[16, 0], [25, 0], [34, 0], [43, 0], [52, 0]],
      walls: [[[0, -4.6], [68, -4.6]], [[0, 4.6], [68, 4.6]]], finX: 62,
      init: function (s) { s.pole = 0; s.stopPen = false; s.hitPole = {}; s.side = {}; },
      update: function (s, dt) {
        var me = this, c = center(s);
        this.poles.forEach(function (p, i) {
          if (hitsPole(s, [p[0], p[1], 0.18])) { if (!s.hitPole[i]) { s.hitPole[i] = 1; pen('3.1', 'Ustunchaga tegib ketdi', 20); } }
          if (!s.side[i] && c[0] > p[0]) { s.side[i] = 1; var want = i % 2 === 0 ? -1 : 1; if (Math.sign(c[1] - p[1]) !== want) pen('5', (i + 1) + '-ustunchani notoʻgʻri tomondan aylanib oʻtdi', 100); }
        });
        if (c[0] > 9 && c[0] < this.finX) { if (Math.abs(s.v) < 0.05) s.still += dt; else s.still = 0; if (s.still > 1 && !s.stopPen) { s.stopPen = true; pen('3.2', 'Oʻtish davomida toʻxtab qoldi', 20); } }
        if (c[0] > this.finX) finish();
      },
      wallPen: ['3.4', 'Yoʻlak chegarasini bosib oʻtdi', 20],
      stall: ['3.3', 'Dvigatelni oʻchirib qoʻydi', 20]
    },
    garage: {
      name: 'Orqaga yurgizib boksga qoʻyish (garaj)', code: '4',
      info: 'Boks yonidan oʻtib, orqa bilan boksga kiring va toʻliq ichkarida toʻxtang (orqa uzatma — 1 marta). Ishora berilgach, oldinga chiqib keting. Chiziqlarga tegmang.',
      area: [-2, -8, 40, 9], start: { x: 3, y: 4.4, th: 0 },
      box: [19.5, -6, 22.3, 0],
      walls: [[[0, 0], [19.5, 0]], [[22.3, 0], [38, 0]], [[0, 7], [38, 7]], [[19.5, -6], [19.5, 0]], [[22.3, -6], [22.3, 0]], [[19.5, -6], [22.3, -6]]],
      init: function (s) { s.rev = 0; s.revPen = false; s.phase = 'kirish'; },
      update: function (s, dt) {
        if (s.gearChangedToR) { s.rev++; s.gearChangedToR = false; if (s.rev > 1 && !s.revPen && s.phase === 'kirish') { s.revPen = true; pen('4.1', 'Orqa uzatmani 1 marta qoʻshib boksga kira olmadi', 20); } }
        var b = this.box, inside = insideRect(s, [b[0], b[1] - 0.1, b[2], b[3] + 0.05]);
        if (s.phase === 'kirish') {
          if (Math.abs(s.v) < 0.03) s.still += dt; else s.still = 0;
          if (inside && s.still > 0.8) { s.phase = 'kutish'; s.wait = 1.6; hint('Boksda toʻxtadingiz. Ishorani kuting…'); }
        } else if (s.phase === 'kutish') { s.wait -= dt; if (s.wait <= 0) { s.phase = 'chiqish'; s.light = 'g'; hint('Endi oldinga yurib boksdan chiqing'); } }
        else if (s.phase === 'chiqish') { var c = center(s); if (c[1] > 3.2 && (c[0] > 27 || c[0] < 14)) finish(); }
        if (s.x > 36 && s.phase === 'kirish') { pen('5', 'Boksga kirmasdan oʻtib ketdi', 100); finish(); }
      },
      wallPen: ['4.3', 'Cheklagichlardan chetga oʻtib ketdi', 20],
      stall: ['4.2', 'Dvigatelni oʻchirib qoʻydi', 20]
    },
    parallel: {
      name: 'Orqaga yurib parallel toʻxtash (parkovka)', code: 'P',
      info: 'Toʻxtash joyi yonidan oʻtib, orqa bilan unga kiring va yoʻl chetiga parallel, chiziqlarga tegmasdan, toʻliq ichkarida toʻxtang.',
      area: [-2, -2, 38, 13], start: { x: 3, y: 3.5, th: 0 },
      box: [16, 7, 23.5, 9.7],
      walls: [[[0, 7], [16, 7]], [[23.5, 7], [36, 7]], [[16, 9.7], [23.5, 9.7]], [[16, 7], [16, 9.7]], [[23.5, 7], [23.5, 9.7]], [[0, -0.5], [36, -0.5]]],
      init: function (s) { s.rev = 0; s.revPen = false; },
      update: function (s, dt) {
        if (s.gearChangedToR) { s.rev++; s.gearChangedToR = false; if (s.rev > 2 && !s.revPen) { s.revPen = true; pen('P.1', 'Ikki martadan koʻp orqa uzatma qoʻshdi', 20); } }
        var b = this.box;
        if (Math.abs(s.v) < 0.03) s.still += dt; else s.still = 0;
        if (s.still > 1 && insideRect(s, [b[0], b[1] - 0.05, b[2], b[3]]) && angDiff(s.th, 0) < 0.18) finish();
        if (s.x > 35) { pen('5', 'Toʻxtash joyiga kirmasdan oʻtib ketdi', 100); finish(); }
      },
      wallPen: ['P.2', 'Chegara chizigʻiga tegdi', 20],
      stall: ['P.3', 'Dvigatelni oʻchirib qoʻydi', 20]
    }
  };
  var ORDER = ['hill', 'uturn', 'slalom', 'garage', 'parallel'];
  var EXAM = ['hill', 'uturn', 'slalom', 'garage'];

  /* ---------------- holat va jarimalar ---------------- */
  function newState(id) {
    var e = EX[id], s = { id: id, ex: e, x: e.start.x, y: e.start.y, th: e.start.th, v: 0, d: 0, gear: 'N', hb: true, eng: true, pen: [], pts: 0,
      still: 0, done: false, t: 0, wallOn: {}, wallClear: {}, light: 'r', msg: '', gasAtStart: 0, stallT: 0 };
    e.init(s); return s;
  }
  function pen(code, text, pts) {
    if (!st || st.done) return;
    st.pen.push({ c: code, t: text, p: pts }); st.pts += pts;
    flash(T(text) + ' — ' + pts + ' ' + T('ball'), pts >= 100 ? '#c62828' : '#ef6c00');
    try { if (navigator.vibrate) navigator.vibrate(pts >= 100 ? [80, 60, 80] : 70); } catch (e) { }
    updTop();
  }
  function hint(t) { if (st) { st.msg = t; updHud(); } }
  function stall() {
    if (!st.eng) return;
    st.eng = false; st.v = Math.abs(st.v) < 0.4 ? 0 : st.v * 0.3;
    var s = st.ex.stall; pen(s[0], s[1], s[2]);
    hint('Dvigatel oʻchdi! «Dvigatel» tugmasini (E) bosib qayta yoqing.');
    drawCtl();
  }

  /* ---------------- fizika ---------------- */
  function slopeAt(x, y) {
    var r = st.ex.ramp; if (!r) return 0;
    if (x >= r.x1 - 0.5 && x <= r.x2 + 0.5 && y >= r.y1 && y <= r.y2) return r.grade; // tepaga (y kamayadi) koʻtarilish
    return 0;
  }
  function physics(dt) {
    var s = st;
    // pedallar silliq oʻzgaradi
    var gasT = (keys.up || inp.gasHeld) ? 1 : 0, brT = (keys.down || inp.brakeHeld) ? 1 : 0;
    inp.gas += gasT ? Math.min(1.3 * dt, 1 - inp.gas) : -Math.min(3 * dt, inp.gas);
    inp.brake += brT ? Math.min(5 * dt, 1 - inp.brake) : -Math.min(7 * dt, inp.brake);
    // rul
    if (keys.left || keys.right) inp.steer = Math.max(-1, Math.min(1, inp.steer + ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 1.5 * dt));
    else if (!inp.wheelHeld && s.v > 2) inp.steer -= inp.steer * Math.min(1, 0.15 * (s.v - 2) * dt); // tezlikda rul oʻzi toʻgʻrilanadi
    var target = inp.steer * DMAX;
    s.d += Math.max(-2.5 * dt, Math.min(2.5 * dt, target - s.d));
    // kuchlar
    var a = 0, dir = s.gear === 'D' ? 1 : s.gear === 'R' ? -1 : 0;
    if (s.eng && dir) {
      var vmax = dir > 0 ? 8.5 : 2.4, vd = s.v * dir;
      if (vd < vmax) a += dir * inp.gas * 2.8 * (1 - Math.max(0, vd) / vmax);
      if (vd < 0.9 && inp.gas < 0.1) a += dir * 0.75; // salt yurish (sekin oʻrmalash)
    }
    // nishablik: oldi yuqoriga (y kamayishi tomonga) qarasa — sekinlashtiradi
    var gr = slopeAt(s.x + Math.cos(s.th) * WB / 2, s.y + Math.sin(s.th) * WB / 2);
    if (gr) a -= Gc * gr * (-Math.sin(s.th)); // sin(th)=-1 — tepaga qaragan
    if (Math.abs(s.v) > 0.01) a -= Math.sign(s.v) * 0.25;
    var brakeDec = inp.brake * 7.5 + (s.hb ? 5 : 0);
    var vn = s.v + a * dt;
    if (brakeDec > 0) {
      if (Math.abs(vn) <= brakeDec * dt) vn = 0;
      else vn -= Math.sign(vn) * brakeDec * dt;
      // statik ushlash: tormoz yetarli kuchli bo'lsa, joyida turadi
      if (Math.abs(s.v) < 0.05 && Math.abs(a) < brakeDec) vn = 0;
    }
    s.v = vn;
    // dvigatel oʻchishi
    if (s.eng) {
      if ((s.gear === 'D' && s.v < -0.45) || (s.gear === 'R' && s.v > 0.45)) stall();
      if (s.hb && dir && inp.gas > 0.6 && Math.abs(s.v) < 0.1) { s.stallT += dt; if (s.stallT > 1.6) { s.stallT = 0; stall(); hint('Qoʻl tormozi tortilgan holda gaz berildi — dvigatel oʻchdi.'); } } else s.stallT = 0;
    }
    // harakat (velosiped modeli, orqa oʻq nuqtasi)
    s.x += s.v * Math.cos(s.th) * dt; s.y += s.v * Math.sin(s.th) * dt;
    s.th += s.v / WB * Math.tan(s.d) * dt;
  }
  function contacts(dt) {
    var e = st.ex;
    (e.walls || []).forEach(function (w, i) {
      var hit = hitsWall(st, w);
      if (hit) {
        if (!st.wallOn[i]) {
          st.wallOn[i] = true;
          if (!e.wallPen[3] || !st.wallOnce) { pen(e.wallPen[0], e.wallPen[1], e.wallPen[2]); if (e.wallPen[3]) st.wallOnce = true; }
        }
        st.wallClear[i] = 0;
      } else if (st.wallOn[i]) { st.wallClear[i] = (st.wallClear[i] || 0) + dt; if (st.wallClear[i] > 0.6) st.wallOn[i] = false; }
    });
  }
  function step(dt) {
    if (!st || st.done) return;
    st.t += dt;
    var n = 4; for (var i = 0; i < n; i++) physics(dt / n);
    contacts(dt);
    st.ex.update(st, dt);
  }

  /* ---------------- tugash ---------------- */
  function finish() {
    if (st.done) return;
    st.done = true; st.v = 0;
    var ok = st.pts <= 99;
    if (seq) { seqLog.push({ id: st.id, pts: st.pts, pen: st.pen.slice() }); seqTotal += st.pts; }
    var h = '<h3>' + H(st.ex.name) + '</h3>';
    h += '<div style="font-size:30px;font-weight:800;margin:4px 0">' + st.pts + ' ' + H('ball') + '</div>';
    if (st.pen.length) h += '<div style="text-align:left;font-size:14px;margin:6px 0 10px">' + st.pen.map(function (p) { return '• ' + H(p.t) + ' — <b>' + p.p + '</b>'; }).join('<br>') + '</div>';
    else h += '<p style="margin:4px 0 10px">' + H('Xatosiz bajarildi!') + '</p>';
    if (seq) {
      var idx = seq.indexOf(st.id), more = idx < seq.length - 1;
      if (more) h += '<p style="margin:0 0 10px;opacity:.85">' + H('Jami: ' + seqTotal + ' ball. Keyingi mashq: ' + EX[seq[idx + 1]].name) + '</p><div class="btns"><button class="btn" data-a="next">' + H('Davom etish') + '</button></div>';
      else {
        var pass = seqTotal <= 99;
        h = '<h3>' + H('Amaliy imtihon natijasi') + '</h3><div style="font-size:32px;font-weight:800;margin:4px 0;color:' + (pass ? '#7ee787' : '#ff8a80') + '">' + seqTotal + ' ' + H('ball') + '</div>' +
          '<p style="margin:0 0 8px;font-weight:700">' + H(pass ? 'Topshirildi (99 balldan oshmadi)' : 'Topshirilmadi (99 balldan oshdi)') + '</p>' +
          '<div style="text-align:left;font-size:14px;margin:6px 0 10px">' + seqLog.map(function (l) { return '<b>' + H(EX[l.id].name) + '</b>: ' + l.pts + H(' ball') + (l.pen.length ? '<br>' + l.pen.map(function (p) { return '&nbsp;&nbsp;• ' + H(p.t) + ' — ' + p.p; }).join('<br>') : ''); }).join('<br>') + '</div>' +
          '<div class="btns"><button class="btn sec" data-a="menu">' + H('Menyu') + '</button><button class="btn" data-a="exam">' + H('Qayta topshirish') + '</button></div>';
      }
    } else {
      h += '<p style="margin:0 0 10px;font-weight:700;color:' + (ok ? '#7ee787' : '#ff8a80') + '">' + H(ok ? 'Mashq bajarildi' : 'Mashq bajarilmadi') + '</p>' +
        '<div class="btns"><button class="btn sec" data-a="menu">' + H('Menyu') + '</button><button class="btn" data-a="again">' + H('Qayta') + '</button></div>';
    }
    showMsg(h);
    saveBest();
  }
  function saveBest() {
    try { var S = g.YHQApp.state(); S.sim = S.sim || {}; var b = S.sim[st.id]; if (b == null || st.pts < b) S.sim[st.id] = st.pts; if (seq && seq.indexOf(st.id) === seq.length - 1) { S.simExam = S.simExam || []; S.simExam.push({ ts: Date.now(), pts: seqTotal }); } g.YHQApp.save(); } catch (e) { }
  }

  /* ---------------- chizish ---------------- */
  var view = { s: 20, ox: 0, oy: 0 };
  var CTL = 150; // pastdagi boshqaruv panelining balandligi (px)
  function fit() {
    var w = cv.clientWidth, h = cv.clientHeight - CTL, a = st.ex.area, aw = a[2] - a[0], ah = a[3] - a[1];
    var sc = Math.min(w / aw, h / ah) * 0.96;
    var minS = Math.min(w, h) < 600 ? 16 : 20;
    if (sc >= minS) { view.s = sc; view.ox = w / 2 - (a[0] + aw / 2) * sc; view.oy = h / 2 - (a[1] + ah / 2) * sc; view.follow = false; }
    else { view.s = minS; view.follow = true; }
  }
  function camera() {
    if (!view.follow) return;
    var w = cv.clientWidth, h = cv.clientHeight - CTL, c = center(st), a = st.ex.area, s = view.s;
    var mx = CTL / s; // pastki panel ostiga ham kamera tusha olsin
    var cx = Math.max(a[0] + w / 2 / s, Math.min(a[2] - w / 2 / s, c[0])), cy = Math.max(a[1] + h / 2 / s, Math.min(a[3] + mx - h / 2 / s, c[1]));
    if ((a[2] - a[0]) * s < w) cx = (a[0] + a[2]) / 2; if ((a[3] - a[1]) * s < h) cy = (a[1] + a[3]) / 2;
    view.ox = w / 2 - cx * s; view.oy = h / 2 - cy * s;
  }
  function W(x, y) { return [view.ox + x * view.s, view.oy + y * view.s]; }
  function draw() {
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); fit(); }
    camera();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#6d9a45'; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.translate(view.ox, view.oy); ctx.scale(view.s, view.s);
    var e = st.ex, a = e.area;
    // asfalt maydoni
    ctx.fillStyle = '#5c636d'; ctx.fillRect(a[0], a[1], a[2] - a[0], a[3] - a[1]);
    ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 0.05;
    for (var gx = Math.ceil(a[0]); gx < a[2]; gx += 2) { ctx.beginPath(); ctx.moveTo(gx, a[1]); ctx.lineTo(gx, a[3]); ctx.stroke(); }
    if (e.ramp) {
      var r = e.ramp, grd = ctx.createLinearGradient(0, r.y2, 0, r.y1);
      grd.addColorStop(0, '#5c636d'); grd.addColorStop(1, '#7d858f');
      ctx.fillStyle = grd; ctx.fillRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
      ctx.fillStyle = '#868e98'; ctx.fillRect(r.x1, 4, r.x2 - r.x1, r.y1 - 4);
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '1px Arial'; ctx.textAlign = 'center';
      ctx.save(); ctx.translate(r.x2 + 1.6, (r.y1 + r.y2) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(Math.round(r.grade * 100) + '%', 0, 0); ctx.restore();
      // STOP chizigʻi
      ctx.fillStyle = '#fff'; ctx.fillRect(r.x1, e.stopY - 0.15, r.x2 - r.x1, 0.3);
      ctx.font = 'bold 0.9px Arial'; ctx.fillText('STOP', 0, e.stopY + 1.3);
      chequer(r.x1, e.finY - 0.4, r.x2 - r.x1, 0.8);
    }
    if (e.box) { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(e.box[0], e.box[1], e.box[2] - e.box[0], e.box[3] - e.box[1]); }
    // chegaralar
    ctx.lineCap = 'round';
    (e.walls || []).forEach(function (wl, i) {
      ctx.strokeStyle = st.wallOn[i] ? '#ff5252' : '#f5f5f5'; ctx.lineWidth = 0.16;
      ctx.beginPath(); ctx.moveTo(wl[0][0], wl[0][1]); ctx.lineTo(wl[1][0], wl[1][1]); ctx.stroke();
      ctx.fillStyle = '#ff7043'; [wl[0], wl[1]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 0.14, 0, 7); ctx.fill(); });
    });
    if (e.poles) {
      e.poles.forEach(function (p, i) {
        var want = i % 2 === 0 ? -1 : 1;
        ctx.fillStyle = 'rgba(255,255,255,.5)'; arrowGround(p[0] - 3, p[1] + want * 2.2, p[0] + 3, p[1] + want * 2.2);
        ctx.fillStyle = st.hitPole && st.hitPole[i] ? '#ff5252' : '#ff9800'; ctx.beginPath(); ctx.arc(p[0], p[1], 0.32, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1], 0.14, 0, 7); ctx.fill();
      });
      chequer(e.finX - 0.4, -4.6, 0.8, 9.2);
    }
    if (e.id === 'parallel' || st.id === 'parallel') { ctx.fillStyle = '#9e9e9e'; ctx.fillRect(0, 9.7, 36, 0.4); }
    // svetofor (ishora)
    if (e.ramp || st.id === 'garage') {
      var lp = e.ramp ? [3.2, e.stopY - 1] : [24, -2];
      ctx.fillStyle = '#212121'; ctx.fillRect(lp[0] - 0.4, lp[1] - 1, 0.8, 2);
      ctx.fillStyle = st.light === 'g' ? '#424242' : '#ff1744'; ctx.beginPath(); ctx.arc(lp[0], lp[1] - 0.5, 0.3, 0, 7); ctx.fill();
      ctx.fillStyle = st.light === 'g' ? '#00e676' : '#424242'; ctx.beginPath(); ctx.arc(lp[0], lp[1] + 0.5, 0.3, 0, 7); ctx.fill();
    }
    drawCar();
    ctx.restore();
  }
  function chequer(x, y, w, h) {
    var n = Math.max(2, Math.round(Math.max(w, h) / 0.4));
    for (var i = 0; i < n; i++) for (var j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#fff' : '#111';
      if (w > h) ctx.fillRect(x + i * w / n, y + j * h / 2, w / n, h / 2); else ctx.fillRect(x + j * w / 2, y + i * h / n, w / 2, h / n);
    }
  }
  function arrowGround(x1, y1, x2, y2) {
    ctx.beginPath(); ctx.moveTo(x1, y1 - 0.15); ctx.lineTo(x2 - 0.8, y2 - 0.15); ctx.lineTo(x2 - 0.8, y2 - 0.5); ctx.lineTo(x2, y2); ctx.lineTo(x2 - 0.8, y2 + 0.5); ctx.lineTo(x2 - 0.8, y2 + 0.15); ctx.lineTo(x1, y1 + 0.15); ctx.closePath(); ctx.fill();
  }
  function drawCar() {
    var s = st;
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.th);
    var L = WB + FO + RO;
    ctx.fillStyle = 'rgba(0,0,0,.28)'; roundRect(-RO + 0.12, -CW / 2 + 0.12, L, CW, 0.35); ctx.fill();
    // gʻildiraklar
    ctx.fillStyle = '#111';
    [[0, -CW / 2 + 0.05], [0, CW / 2 - 0.05]].forEach(function (p) { ctx.fillRect(p[0] - 0.33, p[1] - 0.12, 0.66, 0.24); });
    [[WB, -CW / 2 + 0.05], [WB, CW / 2 - 0.05]].forEach(function (p) { ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(s.d); ctx.fillRect(-0.33, -0.12, 0.66, 0.24); ctx.restore(); });
    ctx.fillStyle = '#d32f2f'; roundRect(-RO, -CW / 2, L, CW, 0.35); ctx.fill();
    ctx.fillStyle = '#263238'; roundRect(WB - 0.55, -CW / 2 + 0.2, 0.75, CW - 0.4, 0.15); ctx.fill();
    roundRect(-RO + 0.25, -CW / 2 + 0.25, 0.5, CW - 0.5, 0.12); ctx.fill();
    ctx.fillStyle = '#b71c1c'; roundRect(0.1, -CW / 2 + 0.2, WB - 0.75, CW - 0.4, 0.15); ctx.fill();
    ctx.fillStyle = '#fff59d'; ctx.fillRect(WB + FO - 0.12, -CW / 2 + 0.15, 0.1, 0.35); ctx.fillRect(WB + FO - 0.12, CW / 2 - 0.5, 0.1, 0.35);
    var brk = inp.brake > 0.1 || s.hb;
    ctx.fillStyle = s.gear === 'R' ? '#ffffff' : (brk ? '#ff1744' : '#7f0000');
    ctx.fillRect(-RO + 0.02, -CW / 2 + 0.15, 0.1, 0.35); ctx.fillRect(-RO + 0.02, CW / 2 - 0.5, 0.1, 0.35);
    if (!s.eng) { ctx.fillStyle = 'rgba(255,193,7,.95)'; ctx.font = 'bold 0.8px Arial'; ctx.textAlign = 'center'; ctx.save(); ctx.translate(WB / 2, 0); ctx.rotate(-s.th); ctx.fillText('!', 0, 0.3); ctx.restore(); }
    ctx.restore();
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  /* ---------------- interfeys ---------------- */
  function loop(ts) {
    if (!st) return;
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
    if (!st.paused) step(dt);
    draw(); updHud(); updWheel();
    raf = requestAnimationFrame(loop);
  }
  var flashT = 0;
  function flash(t, col) {
    var el = wrap && wrap.querySelector('.simflash'); if (!el) return;
    el.textContent = t; el.style.background = col; el.style.display = 'block'; clearTimeout(flashT);
    flashT = setTimeout(function () { el.style.display = 'none'; }, 2200);
  }
  function updTop() { var el = wrap && wrap.querySelector('.pts'); if (el) el.textContent = (seq ? seqTotal + st.pts : st.pts) + ' ' + T('ball'); }
  var lastHud = '';
  function updHud() {
    var el = wrap && wrap.querySelector('.simhud'); if (!el || !st) return;
    var kmh = Math.round(Math.abs(st.v) * 3.6);
    var h = '<b>' + H(st.ex.name) + '</b><br>' + H('Tezlik: ' + kmh + ' km/soat · Uzatma: ' + st.gear + (st.hb ? ' · P' : '') + (st.eng ? '' : ' · DVIGATEL OʻCHIQ')) + (st.msg ? '<br><span style="color:#ffd54f">' + H(st.msg) + '</span>' : '');
    if (h !== lastHud) { el.innerHTML = h; lastHud = h; }
  }
  function updWheel() { var wi = wrap && wrap.querySelector('.wheel'); if (wi) wi.style.transform = 'rotate(' + Math.round(inp.steer * 450) + 'deg)'; }
  function showMsg(h) {
    var m = wrap && wrap.querySelector('.simmsg'); if (!m) return; m.innerHTML = h; m.style.display = 'block';
    m.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-a'); m.style.display = 'none';
        if (a === 'start') { st.paused = false; }
        else if (a === 'again') begin(st.id);
        else if (a === 'next') begin(seq[seq.indexOf(st.id) + 1]);
        else if (a === 'exam') { seq = EXAM.slice(); seqTotal = 0; seqLog = []; begin(seq[0]); }
        else if (a === 'menu') close();
      };
    });
  }
  function drawCtl() {
    var c = wrap && wrap.querySelector('.gears'); if (!c || !st) return;
    c.innerHTML = ['D', 'N', 'R'].map(function (gname) { return '<button data-g="' + gname + '" class="' + (st.gear === gname ? 'on' : '') + '">' + gname + '</button>'; }).join('') +
      '<button class="hb ' + (st.hb ? 'on' : '') + '" data-g="P" title="' + T('Qoʻl tormozi') + '">P</button>' +
      (st.eng ? '' : '<button data-g="E" style="background:#2e7d32;border-color:#81c784">' + T('Dvig.') + '</button>');
    c.querySelectorAll('button').forEach(function (b) { b.onclick = function () { gearCmd(b.getAttribute('data-g')); }; });
  }
  function gearCmd(gname) {
    if (!st || st.done) return;
    if (gname === 'P') { st.hb = !st.hb; }
    else if (gname === 'E') { if (!st.eng) { st.eng = true; hint('Dvigatel yoqildi'); } }
    else if (gname !== st.gear) {
      if ((gname === 'R' || st.gear === 'R') && Math.abs(st.v) > 0.3) { flash(T('Avval toʻliq toʻxtang'), '#455a64'); return; }
      if (gname === 'R') st.gearChangedToR = true;
      st.gear = gname;
    }
    drawCtl();
  }
  function begin(id) {
    st = newState(id); last = 0; lastHud = '';
    inp.steer = 0; inp.gas = 0; inp.brake = 0;
    wrap.querySelector('.simtop h1').textContent = T(seq ? 'Amaliy imtihon: ' + (seq.indexOf(id) + 1) + '/' + seq.length : 'Avtodrom');
    fit(); updTop(); drawCtl(); st.paused = true;
    showMsg('<h3>' + H(st.ex.name) + '</h3><p style="font-size:14.5px;line-height:1.45;margin:6px 0 10px">' + H(st.ex.info) + '</p>' +
      '<p style="font-size:12.5px;opacity:.8;margin:0 0 10px">' + H('Boshqaruv: ↑ gaz, ↓ tormoz, ← → rul, D/N/R — uzatma (klaviaturada F, N, R), P — qoʻl tormozi (Probel), E — dvigatel. Sensorli ekranda: rulni aylantiring, pedallarni bosib turing.') + '</p>' +
      '<div class="btns"><button class="btn" data-a="start">' + H('Boshlash') + '</button></div>');
  }
  function open(ids) {
    close(true);
    seq = ids.length > 1 ? ids.slice() : null; seqTotal = 0; seqLog = [];
    wrap = document.createElement('div'); wrap.className = 'simwrap';
    wrap.innerHTML = '<div class="simtop"><button class="ib" data-x="1" aria-label="Yopish"><svg viewBox="0 0 24 24"><path fill="#fff" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button><h1></h1><span class="pts">0</span>' +
      '<button class="ib" data-r="1" aria-label="Qayta"><svg viewBox="0 0 24 24"><path fill="#fff" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button></div>' +
      '<div class="simcv"><canvas></canvas><div class="simhud"></div><div class="simflash" style="display:none;position:absolute;left:50%;top:12px;transform:translateX(-50%);color:#fff;padding:8px 14px;border-radius:12px;font-weight:700;font-size:14px;max-width:90%;text-align:center"></div>' +
      '<div class="simctl"><div class="wheel"><i></i></div><div class="gears"></div><div class="pedals"><div class="pedal brk">' + T('TORMOZ') + '</div><div class="pedal gas">' + T('GAZ') + '</div></div></div>' +
      '<div class="simmsg" style="display:none"></div></div>';
    document.body.appendChild(wrap);
    cv = wrap.querySelector('canvas'); ctx = cv.getContext('2d');
    wrap.querySelector('[data-x]').onclick = function () { close(); };
    wrap.querySelector('[data-r]').onclick = function () { if (seq) { seqTotal = 0; seqLog = []; begin(seq[0]); } else begin(st.id); };
    bindPedal(wrap.querySelector('.pedal.gas'), 'gasHeld'); bindPedal(wrap.querySelector('.pedal.brk'), 'brakeHeld');
    bindWheel(wrap.querySelector('.wheel'));
    window.addEventListener('resize', onResize);
    begin(ids[0]);
    raf = requestAnimationFrame(loop);
  }
  function onResize() { if (cv) { cv.width = 0; } }
  function bindPedal(el, key) {
    function on(e) { e.preventDefault(); inp[key] = true; el.classList.add('on'); }
    function off() { inp[key] = false; el.classList.remove('on'); }
    el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); el.addEventListener('pointerleave', off);
  }
  function bindWheel(el) {
    var cx, cy, a0, s0, id = null;
    function ang(e) { return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI; }
    el.addEventListener('pointerdown', function (e) {
      e.preventDefault(); var r = el.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      a0 = ang(e); s0 = inp.steer; id = e.pointerId; inp.wheelHeld = true; try { el.setPointerCapture(id); } catch (x) { }
    });
    el.addEventListener('pointermove', function (e) {
      if (id !== e.pointerId) return;
      var d = ang(e) - a0; if (d > 180) d -= 360; if (d < -180) d += 360;
      a0 = ang(e); s0 = Math.max(-1, Math.min(1, s0 + d / 450)); inp.steer = s0;
    });
    function up(e) { if (id !== e.pointerId) return; id = null; inp.wheelHeld = false; }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('dblclick', function () { inp.steer = 0; });
  }
  function close(silent) {
    cancelAnimationFrame(raf); raf = 0;
    if (wrap) { wrap.remove(); wrap = null; }
    window.removeEventListener('resize', onResize);
    st = null; keys = {};
    if (!silent && g.location.hash === '#/avtodrom' && g.YHQApp) { var v = document.getElementById('view'); if (v && lastMenu) menu(lastMenu.el, lastMenu.hp); }
  }
  var KMAP = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
  document.addEventListener('keydown', function (e) {
    if (!st) return;
    if (KMAP[e.code]) { keys[KMAP[e.code]] = true; e.preventDefault(); return; }
    if (e.code === 'Space') { gearCmd('P'); e.preventDefault(); }
    else if (e.code === 'KeyR') gearCmd('R');
    else if (e.code === 'KeyF') gearCmd('D');
    else if (e.code === 'KeyN') gearCmd('N');
    else if (e.code === 'KeyE') gearCmd('E');
    else if (e.code === 'KeyC') inp.steer = 0;
    else if (e.code === 'Escape') close();
    else if (e.code === 'Enter') { var b = wrap && wrap.querySelector('.simmsg[style*="block"] .btn:last-child'); if (b) b.click(); }
  });
  document.addEventListener('keyup', function (e) { if (KMAP[e.code]) keys[KMAP[e.code]] = false; });

  /* ---------------- menyu (ilova sahifasi) ---------------- */
  var lastMenu = null;
  function menu(el, helpers) {
    hp = helpers; lastMenu = { el: el, hp: helpers };
    var S = {}; try { S = g.YHQApp.state(); } catch (e) { }
    var best = S.sim || {}, ex = (S.simExam || []).slice(-3).reverse();
    var h = '<div class="card"><b>' + H('Amaliy imtihon mashqlari') + '</b><p class="small muted" style="margin:.4em 0 0">' +
      H('Avtodromdagi mashqlarning soddalashtirilgan 2D modeli. Baholash VM 272-son qarori bilan tasdiqlangan nizomdagi imtihon varaqasiga asoslangan: har bir xato — 20 ball, bosqichni notoʻgʻri bajarish — 100 ball. Jami jarima 99 balldan oshmasa, imtihon topshirilgan hisoblanadi.') + '</p>' +
      '<div class="btns"><button class="btn" data-ex="EXAM">' + H('Amaliy imtihon (4 mashq ketma-ket)') + '</button></div>' +
      (ex.length ? '<p class="small muted" style="margin:.6em 0 0">' + H('Oxirgi natijalar: ' + ex.map(function (x) { return x.pts + ' ball'; }).join(', ')) + '</p>' : '') + '</div>' +
      '<div class="list">' + ORDER.map(function (id) {
        var e = EX[id], b = best[id];
        return '<a href="javascript:void 0" data-ex="' + id + '"><div class="t"><b>' + H((e.code === 'P' ? '' : e.code + '. ') + e.name) + '</b><span class="cnt">' + H(b == null ? 'Hali bajarilmagan' : 'Eng yaxshi natija: ' + b + ' ball') + '</span></div><span class="pill ' + (b == null ? '' : b <= 0 ? 'ok' : 'bad') + '">' + H(b == null ? '—' : b + ' b') + '</span></a>';
      }).join('') + '</div>' +
      '<div class="card small muted">' + H('Boshqaruv: klaviaturada ↑ — gaz, ↓ — tormoz, ← → — rul, F / N / R — uzatma (oldinga, neytral, orqaga), Probel — qoʻl tormozi, E — dvigatelni yoqish, C — rulni toʻgʻrilash. Telefonda — ekrandagi rul va pedallar. Gazni bosib turganda u asta-sekin kuchayadi; qoʻl tormozi tortilgan holda kuchli gaz berilsa, dvigatel oʻchadi.') + '</div>';
    el.innerHTML = h;
    el.querySelectorAll('[data-ex]').forEach(function (a) {
      a.onclick = function () { var id = a.getAttribute('data-ex'); open(id === 'EXAM' ? EXAM.slice() : [id]); };
    });
  }

  g.YHQSim = {
    menu: menu, isOpen: function () { return !!wrap; }, close: close,
    _t: { ex: EX, newState: newState, step: step, inp: inp, keys: keys, set: function (s) { st = s; }, get: function () { return st; }, gear: gearCmd, corners: corners }
  };
})(window);
