/* YHQ Test 2026 — vaziyat rasmlari: yuqoridan koʻrinishdagi yoʻl sahnalari (SVG).
 * Sahna oddiy obyekt bilan beriladi (savollar bazasidagi `sc` maydoni), shu fayl uni SVG matnga aylantiradi.
 * Oʻng tomonlama harakat. Yondashuvlar: s — janubdan (pastdan), n — shimoldan, e — sharqdan, w — gʻarbdan. */
(function (g) {
  'use strict';
  var W = 400, H = 300, CX = 200, CY = 150, LW = 26, SW = 9;
  var ANG = { s: 0, w: 90, n: 180, e: 270 };
  var PAL = { A: '#e53935', B: '#1e66d0', C: '#2e9d4f', D: '#f2b400', E: '#8e44ad', F: '#ef7d00', '1': '#e53935', '2': '#1e66d0', '3': '#2e9d4f', '4': '#f2b400', '5': '#8e44ad' };
  var BASE = 'img/signs/';

  function f(n) { return Math.round(n * 10) / 10; }
  function rot(x, y, deg) {
    var a = deg * Math.PI / 180, dx = x - CX, dy = y - CY;
    return [CX + dx * Math.cos(a) - dy * Math.sin(a), CY + dx * Math.sin(a) + dy * Math.cos(a)];
  }
  function darker(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return '#333';
    var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    if (r + gg + b > 600) return '#555';
    return 'rgb(' + Math.round(r * .62) + ',' + Math.round(gg * .62) + ',' + Math.round(b * .62) + ')';
  }

  /* ---------- Bezier yoʻllar ---------- */
  function bez(p, t) { // p: [[x,y]...] 3 yoki 4 nuqta
    var u = 1 - t;
    if (p.length === 2) return [p[0][0] * u + p[1][0] * t, p[0][1] * u + p[1][1] * t];
    if (p.length === 3) return [u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0], u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1]];
    return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
  }
  function bezTan(p, t) { var a = bez(p, Math.max(0, t - 0.01)), b = bez(p, Math.min(1, t + 0.01)); return Math.atan2(b[1] - a[1], b[0] - a[0]); }
  function subPath(p, t0) { // [t0..1] boʻlagini koʻp nuqtali chiziq sifatida
    var pts = [], N = 24; for (var i = 0; i <= N; i++) pts.push(bez(p, t0 + (1 - t0) * i / N));
    return pts;
  }
  function arrow(pts, col, dash) {
    if (pts.length < 2) return '';
    var d = 'M' + pts.map(function (q) { return f(q[0]) + ' ' + f(q[1]); }).join(' L');
    var a = pts[pts.length - 2], b = pts[pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    var hl = 11, hw = 6.5, tip = [b[0] + Math.cos(ang) * 4, b[1] + Math.sin(ang) * 4];
    var l = [tip[0] - Math.cos(ang) * hl + Math.cos(ang + Math.PI / 2) * hw, tip[1] - Math.sin(ang) * hl + Math.sin(ang + Math.PI / 2) * hw];
    var r = [tip[0] - Math.cos(ang) * hl - Math.cos(ang + Math.PI / 2) * hw, tip[1] - Math.sin(ang) * hl - Math.sin(ang + Math.PI / 2) * hw];
    return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>' +
      '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"' + (dash ? ' stroke-dasharray="7 5"' : '') + '/>' +
      '<path d="M' + f(tip[0]) + ' ' + f(tip[1]) + ' L' + f(l[0]) + ' ' + f(l[1]) + ' L' + f(r[0]) + ' ' + f(r[1]) + 'Z" fill="' + col + '" stroke="#fff" stroke-width="1.4"/>';
  }

  /* ---------- Transport vositalari ---------- */
  var DIM = { car: [17, 31], taxi: [17, 31], police: [17, 32], amb: [18, 34], fire: [19, 44], bus: [20, 54], truck: [19, 46], tram: [20, 74], moto: [8, 19], bike: [6, 17], tractor: [17, 26], cart: [16, 30] };
  function vehicle(v, x, y, angDeg) { // angDeg: 0 — yuqoriga (shimolga)
    var t = v.type || 'car', d = DIM[t] || DIM.car, w = d[0], l = d[1], col = v.col || PAL[v.lab] || '#e53935';
    if (t === 'amb') col = '#ffffff'; if (t === 'fire') col = '#d32f2f'; if (t === 'police') col = '#ffffff'; if (t === 'tram') col = v.col || '#f2b400';
    var s = '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(angDeg) + ')">';
    var stroke = darker(col);
    if (t === 'bike' || t === 'moto') {
      s += '<rect x="' + (-w / 2) + '" y="' + (-l / 2) + '" width="' + w + '" height="' + l + '" rx="3" fill="#222"/>' +
        '<rect x="' + (-w / 2 - 4) + '" y="' + (-l / 2 + 5) + '" width="' + (w + 8) + '" height="2.4" fill="#222"/>' +
        '<circle cx="0" cy="' + (t === 'moto' ? 1 : 2) + '" r="' + (t === 'moto' ? 5 : 4.5) + '" fill="' + col + '" stroke="#fff" stroke-width="1"/>';
    } else if (t === 'cart') {
      s += '<rect x="-8" y="-6" width="16" height="20" rx="2" fill="#8d6e63" stroke="#4e342e"/><ellipse cx="0" cy="-12" rx="4" ry="7" fill="#6d4c41"/>';
    } else {
      s += '<rect x="' + (-w / 2 + 1) + '" y="' + (-l / 2 + 2) + '" width="' + w + '" height="' + l + '" rx="5" fill="rgba(0,0,0,.22)"/>';
      s += '<rect x="' + (-w / 2) + '" y="' + (-l / 2) + '" width="' + w + '" height="' + l + '" rx="' + (t === 'tram' || t === 'bus' ? 4 : 5) + '" fill="' + col + '" stroke="' + stroke + '" stroke-width="1.2"/>';
      if (t === 'truck') {
        s += '<rect x="' + (-w / 2) + '" y="' + (-l / 2 + 13) + '" width="' + w + '" height="' + (l - 13) + '" rx="2" fill="#cfd8dc" stroke="#78909c"/>' +
          '<rect x="' + (-w / 2 + 2.5) + '" y="' + (-l / 2 + 2.5) + '" width="' + (w - 5) + '" height="5" rx="1.5" fill="#263238" opacity=".8"/>';
      } else if (t === 'bus' || t === 'tram') {
        s += '<rect x="' + (-w / 2 + 2.5) + '" y="' + (-l / 2 + 2.5) + '" width="' + (w - 5) + '" height="5" rx="1.5" fill="#263238" opacity=".8"/>';
        for (var k = 0; k < (t === 'tram' ? 6 : 4); k++) s += '<rect x="' + (-w / 2 + 3) + '" y="' + f(-l / 2 + 12 + k * (l - 16) / (t === 'tram' ? 6 : 4)) + '" width="' + (w - 6) + '" height="' + f((l - 16) / (t === 'tram' ? 6 : 4) - 3) + '" rx="1" fill="#fff" opacity=".35"/>';
        if (t === 'tram') s += '<line x1="0" y1="' + (-l / 2 + 10) + '" x2="0" y2="' + (l / 2 - 10) + '" stroke="#555" stroke-width="1.4"/>';
      } else {
        s += '<rect x="' + (-w / 2 + 2.5) + '" y="' + f(-l / 2 + l * .2) + '" width="' + (w - 5) + '" height="' + f(l * .17) + '" rx="2" fill="#263238" opacity=".78"/>' +
          '<rect x="' + (-w / 2 + 3) + '" y="' + f(l / 2 - l * .22) + '" width="' + (w - 6) + '" height="' + f(l * .11) + '" rx="2" fill="#263238" opacity=".6"/>';
      }
      if (t === 'police' || t === 'amb' || t === 'fire' || v.blue) {
        var on = v.blue !== 0;
        s += '<rect x="' + (-w / 2 + 2) + '" y="' + f(-l / 2 + l * .45) + '" width="' + f(w / 2 - 2) + '" height="4" fill="' + (on ? '#1565ff' : '#90a4ae') + '"/>' +
          '<rect x="0" y="' + f(-l / 2 + l * .45) + '" width="' + f(w / 2 - 2) + '" height="4" fill="' + (t === 'police' ? '#e53935' : (on ? '#1565ff' : '#90a4ae')) + '"/>';
        if (on) s += '<circle cx="0" cy="' + f(-l / 2 + l * .45 + 2) + '" r="' + (w * .9) + '" fill="#2979ff" opacity=".18"/>';
        if (t === 'amb') s += '<path d="M-2 ' + f(l * .12) + 'h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#e53935"/>';
        if (t === 'police') s += '<rect x="' + (-w / 2) + '" y="' + f(l * .15) + '" width="' + w + '" height="4" fill="#1e66d0"/>';
      }
      if (t === 'taxi') s += '<rect x="-5" y="' + f(-l * .06) + '" width="10" height="5" rx="1" fill="#111"/><rect x="-4" y="' + f(-l * .06 + 1) + '" width="8" height="3" fill="#ffd600"/>';
      if (v.sig) { // burilish koʻrsatkichi
        var sx = v.sig === 'l' ? -w / 2 : w / 2, both = v.sig === 'a';
        [-l / 2 + 1.5, l / 2 - 3.5].forEach(function (yy) {
          (both ? [-w / 2, w / 2] : [sx]).forEach(function (xx) {
            s += '<circle cx="' + f(xx) + '" cy="' + f(yy + 1) + '" r="5" fill="#ffb300" opacity=".45"/><rect x="' + f(xx - 2.2) + '" y="' + f(yy - 1) + '" width="4.4" height="4" rx="1" fill="#ff8f00"/>';
          });
        });
      }
      if (v.stopL) s += '<rect x="' + (-w / 2 + 1) + '" y="' + (l / 2 - 2) + '" width="4" height="2.5" fill="#ff1744"/><rect x="' + (w / 2 - 5) + '" y="' + (l / 2 - 2) + '" width="4" height="2.5" fill="#ff1744"/>';
      if (v.tow) s += '<line x1="0" y1="' + (l / 2) + '" x2="0" y2="' + (l / 2 + (v.tow > 1 ? v.tow : 14)) + '" stroke="#222" stroke-width="2.4"/>';
    }
    s += '</g>';
    if (v.lab) {
      s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="9.5" fill="#fff" stroke="#222" stroke-width="1.6"/>' +
        '<text x="' + f(x) + '" y="' + f(y + 4.6) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#111" font-family="Arial,sans-serif">' + v.lab + '</text>';
    }
    return s;
  }
  function person(x, y, col) {
    return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="6.5" fill="' + (col || '#37474f') + '" stroke="#fff" stroke-width="1.4"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="2.8" fill="#ffcc80"/>';
  }
  function signImg(id, x, y, sz) {
    sz = sz || 26;
    var p = '<line x1="' + f(x) + '" y1="' + f(y + sz / 2 - 2) + '" x2="' + f(x) + '" y2="' + f(y + sz / 2 + 6) + '" stroke="#555" stroke-width="2"/>';
    if (id === 'ped') return p;
    return p + '<image href="' + BASE + id + '.svg" x="' + f(x - sz / 2) + '" y="' + f(y - sz / 2) + '" width="' + sz + '" height="' + sz + '"/>';
  }
  function light(state, x, y, arrow) { // state: r | y | g | ry | yb (miltillovchi sariq) | off
    var s = '<rect x="' + f(x - 6.5) + '" y="' + f(y - 18) + '" width="13" height="36" rx="3.5" fill="#212121" stroke="#fff" stroke-width="1"/>';
    var c = [['r', '#ff1744', -10], ['y', '#ffc400', 0], ['g', '#00e676', 10]];
    c.forEach(function (k) {
      var on = state === k[0] || (state === 'ry' && k[0] !== 'g') || (state === 'yb' && k[0] === 'y');
      s += '<circle cx="' + f(x) + '" cy="' + f(y + k[2]) + '" r="4.2" fill="' + (on ? k[1] : '#4a4a4a') + '"' + (on ? '' : ' opacity=".9"') + '/>';
      if (on) s += '<circle cx="' + f(x) + '" cy="' + f(y + k[2]) + '" r="7" fill="' + k[1] + '" opacity=".28"/>';
    });
    if (state === 'yb') s += '<text x="' + f(x + 9) + '" y="' + f(y + 3) + '" font-size="9" fill="#ffc400" font-family="Arial">✱</text>';
    if (arrow) { // qoʻshimcha seksiya: 'r' (oʻngga), 'l' (chapga), arrow+'0' — oʻchiq
      var lit = arrow.indexOf('0') < 0, dir = arrow[0] === 'l' ? -1 : 1, ax = x + dir * 12;
      s += '<rect x="' + f(ax - 6) + '" y="' + f(y + 4) + '" width="12" height="12" rx="2.5" fill="#212121" stroke="#fff" stroke-width="1"/>' +
        '<path d="M' + f(ax - 3.5 * dir) + ' ' + f(y + 10) + ' h' + f(5 * dir) + ' M' + f(ax + 2.5 * dir) + ' ' + f(y + 7) + ' l' + f(2.6 * dir) + ' 3 l' + f(-2.6 * dir) + ' 3" stroke="' + (lit ? '#00e676' : '#555') + '" stroke-width="1.8" fill="none"/>';
    }
    return s;
  }
  function regulator(x, y, pose) { // tartibga soluvchi (yuqoridan): pose — 'side' (yon tomoni), 'front' (koʻkragi), 'up' (qoʻl yuqorida)
    var s = '<g transform="translate(' + f(x) + ' ' + f(y) + ')">';
    s += '<ellipse cx="0" cy="0" rx="11" ry="7" fill="#1e3a5f" stroke="#fff" stroke-width="1.2"/><circle cx="0" cy="0" r="5" fill="#fafafa" stroke="#1e3a5f" stroke-width="1.5"/>';
    if (pose === 'up') s += '<circle cx="0" cy="0" r="2" fill="#e53935"/>';
    s += '</g>';
    return s;
  }

  /* ---------- Fon va yoʻllar ---------- */
  function bg() {
    return '<rect width="' + W + '" height="' + H + '" fill="#b9d89a"/>';
  }
  function zebraAcross(x0, y0, len, depth, vertical) { // vertical=true: yoʻl vertikal, chiziqlar gorizontal joylashadi
    var s = '', n = Math.floor(len / 8);
    for (var i = 0; i < n; i++) {
      if (vertical) s += '<rect x="' + f(x0 + i * 8 + 1.5) + '" y="' + f(y0) + '" width="5" height="' + depth + '" fill="#fff"/>';
      else s += '<rect x="' + f(x0) + '" y="' + f(y0 + i * 8 + 1.5) + '" width="' + depth + '" height="5" fill="#fff"/>';
    }
    return s;
  }
  function lineStyle(kind) {
    if (kind === 'solid') return ' stroke-width="2.4"';
    if (kind === 'dash') return ' stroke-width="2.2" stroke-dasharray="10 9"';
    if (kind === 'short') return ' stroke-width="2" stroke-dasharray="5 6"';
    return ' stroke-width="2.2" stroke-dasharray="10 9"';
  }

  /* ---------- Chorraha (x / t) ---------- */
  function cross(sc) {
    var arms = sc.arms || 'nesw', lnv = sc.lnv || sc.ln || 1, lnh = sc.lnh || sc.ln || 1;
    var hv = lnv * LW, hh = lnh * LW, out = [bg()], over = [], top = [], deco = [];
    function aw(k) { return k === 'n' || k === 's' ? hv : hh; }
    function ae(k) { return k === 'n' || k === 's' ? hh : hv; }
    function has(k) { return arms.indexOf(k) >= 0; }
    // trotuar va asfalt
    var road = '', walk = '';
    ['n', 'e', 's', 'w'].forEach(function (k) {
      if (!has(k)) return;
      var a = aw(k), e = ae(k), R = ANG[k];
      walk += '<g transform="rotate(' + R + ' ' + CX + ' ' + CY + ')"><rect x="' + (CX - a - SW) + '" y="' + (CY) + '" width="' + (2 * a + 2 * SW) + '" height="320" fill="#d5d9de"/></g>';
      road += '<g transform="rotate(' + R + ' ' + CX + ' ' + CY + ')"><rect x="' + (CX - a) + '" y="' + (CY + e - 1) + '" width="' + (2 * a) + '" height="320" fill="#5f6670"/></g>';
    });
    // markaziy kvadrat
    walk += '<rect x="' + (CX - hv - SW) + '" y="' + (CY - hh - SW) + '" width="' + (2 * hv + 2 * SW) + '" height="' + (2 * hh + 2 * SW) + '" fill="#d5d9de"/>';
    road += '<rect x="' + (CX - hv) + '" y="' + (CY - hh) + '" width="' + (2 * hv) + '" height="' + (2 * hh) + '" fill="#5f6670"/>';
    // T chorrahada yoʻq tomon — yaxlit chekka
    ['n', 'e', 's', 'w'].forEach(function (k) {
      if (has(k)) return;
      var a = aw(k), e = ae(k), R = ANG[k];
      walk += '<g transform="rotate(' + R + ' ' + CX + ' ' + CY + ')"><rect x="' + (CX - a - SW) + '" y="' + (CY + e) + '" width="' + (2 * a + 2 * SW) + '" height="' + SW + '" fill="#d5d9de"/></g>';
    });
    out.push(walk, road);
    if (sc.tram) { // tramvay izlari
      sc.tram.split('').forEach(function (k) {
        if (!has(k)) return;
        var R = ANG[k], e = ae(k);
        var tr = '<g transform="rotate(' + R + ' ' + CX + ' ' + CY + ')" stroke="#c9ccd1" stroke-width="1.6">';
        [-LW / 2, LW / 2].forEach(function (dx) { tr += '<line x1="' + (CX + dx - 5) + '" y1="' + (CY - e) + '" x2="' + (CX + dx - 5) + '" y2="' + (CY + 320) + '"/><line x1="' + (CX + dx + 5) + '" y1="' + (CY - e) + '" x2="' + (CX + dx + 5) + '" y2="' + (CY + 320) + '"/>'; });
        out.push(tr + '</g>');
      });
    }
    // chiziqlar
    var mk = sc.mk || {};
    ['n', 'e', 's', 'w'].forEach(function (k) {
      if (!has(k)) return;
      var a = aw(k), e = ae(k), R = ANG[k], kind = mk[k] || sc.center || 'dash', z = (sc.zebra || '').indexOf(k) >= 0;
      var s = '<g transform="rotate(' + R + ' ' + CX + ' ' + CY + ')">';
      var y0 = CY + e + (z ? 30 : 4);
      if (kind === 'double') s += '<line x1="' + (CX - 2.2) + '" y1="' + y0 + '" x2="' + (CX - 2.2) + '" y2="' + (CY + 320) + '" stroke="#fff" stroke-width="1.9"/><line x1="' + (CX + 2.2) + '" y1="' + y0 + '" x2="' + (CX + 2.2) + '" y2="' + (CY + 320) + '" stroke="#fff" stroke-width="1.9"/>';
      else if (kind !== 'none') s += '<line x1="' + CX + '" y1="' + y0 + '" x2="' + CX + '" y2="' + (CY + 320) + '" stroke="#fff"' + lineStyle(kind) + '/>';
      var ln = (k === 'n' || k === 's') ? lnv : lnh;
      for (var i = 1; i < ln; i++) {
        [-1, 1].forEach(function (sd) { s += '<line x1="' + (CX + sd * i * LW) + '" y1="' + y0 + '" x2="' + (CX + sd * i * LW) + '" y2="' + (CY + 320) + '" stroke="#fff"' + lineStyle('dash') + '/>'; });
      }
      if (z) s += zebraAcross(CX - a + 1, CY + e + 4, 2 * a - 2, 20, true);
      if ((sc.stop || '').indexOf(k) >= 0) s += '<rect x="' + CX + '" y="' + (CY + e + (z ? 28 : 3) + (z ? 0 : 0)) + '" width="' + a + '" height="3.5" fill="#fff"/>';
      if ((sc.yellow || '').indexOf(k) >= 0) s += '<line x1="' + (CX + a - 2) + '" y1="' + (CY + e + 6) + '" x2="' + (CX + a - 2) + '" y2="' + (CY + 320) + '" stroke="#ffd600" stroke-width="2.4"/>';
      out.push(s + '</g>');
    });
    if (sc.grid) out.push('<rect x="' + (CX - hv + 3) + '" y="' + (CY - hh + 3) + '" width="' + (2 * hv - 6) + '" height="' + (2 * hh - 6) + '" fill="none" stroke="#ffd600" stroke-width="1.8"/>' +
      '<path d="M' + (CX - hv + 3) + ' ' + (CY - hh + 3) + 'L' + (CX + hv - 3) + ' ' + (CY + hh - 3) + 'M' + (CX + hv - 3) + ' ' + (CY - hh + 3) + 'L' + (CX - hv + 3) + ' ' + (CY + hh - 3) + '" stroke="#ffd600" stroke-width="1.5"/>');
    // belgilar va svetoforlar
    var sg = sc.sg || {};
    Object.keys(sg).forEach(function (k) {
      var a = aw(k), e = ae(k), list = [].concat(sg[k]);
      list.forEach(function (id, i) {
        var p = rot(CX + a + SW + 15, CY + e + 30 + i * 30 + ((sc.tl || {})[k] ? 30 : 0), ANG[k]);
        deco.push(signImg(id, p[0], p[1], 26));
      });
    });
    var tl = sc.tl || {};
    Object.keys(tl).forEach(function (k) {
      var a = aw(k), e = ae(k), p = rot(CX + a + SW + 10, CY + e + 14, ANG[k]);
      var st = String(tl[k]).split('+');
      deco.push(light(st[0], p[0], p[1], st[1]));
    });
    if (sc.reg) deco.push(regulator(CX, CY, sc.reg));
    // piyodalar
    (sc.ped || []).forEach(function (pd) {
      var k = pd[0], a = aw(k), e = ae(k), frac = pd[1] == null ? 0.5 : pd[1];
      var p = rot(CX - a + 2 * a * frac, CY + e + (pd[2] === 'walk' ? -0 : 14), ANG[k]);
      if (pd[2] === 'side') p = rot(CX + a + SW / 2 + 1, CY + e + 14, ANG[k]);
      top.push(person(p[0], p[1]));
    });
    // transport
    (sc.v || []).forEach(function (raw) {
      var v = normV(raw), k = v.ap, a = aw(k), e = ae(k), R = ANG[k];
      var ln = (k === 'n' || k === 's') ? lnv : lnh;
      var idx = v.lane != null ? v.lane : (v.m === 'l' || v.m === 'u' ? 0 : ln - 1);
      if (v.type === 'tram') idx = 0;
      var x0 = CX + LW / 2 + idx * LW;
      var dim = DIM[v.type || 'car'] || DIM.car, z = (sc.zebra || '').indexOf(k) >= 0;
      var yFront = CY + e + (z ? 33 : 7) + (v.q || 0) * (dim[1] + 9) + (v.back || 0);
      var outLn = function (k2) { return (k2 === 'n' || k2 === 's') ? lnv : lnh; };
      var lnC = (k === 'n' || k === 's') ? lnh : lnv, path = null, ex = 34;
      if (v.m === 's') path = [[x0, yFront], [x0, CY - e - ex]];
      else if (v.m === 'r') { var ti = v.toLane != null ? v.toLane : lnC - 1, yr = CY + LW / 2 + ti * LW; path = [[x0, yFront], [x0, yr], [CX + a + ex + 10, yr]]; }
      else if (v.m === 'l') { var tl2 = v.toLane != null ? v.toLane : 0, yl = CY - LW / 2 - tl2 * LW; path = [[x0, yFront], [x0, yl], [CX - a - ex - 10, yl]]; }
      else if (v.m === 'u') path = [[x0, yFront], [x0, CY - LW * .9], [CX - LW / 2, CY - LW * .9], [CX - LW / 2, CY + e + ex + 6]];
      // yoʻnalishni haqiqiy koordinataga oʻtkazish
      function T(p) { return rot(p[0], p[1], R); }
      var pathR = path ? path.map(T) : null, pos, ang;
      if (v.p != null && pathR) { pos = bez(pathR, v.p); ang = bezTan(pathR, v.p) * 180 / Math.PI + 90; }
      else { var c = T([x0, yFront + dim[1] / 2]); pos = c; ang = R; }
      if (pathR && v.m !== '-') {
        var t0 = v.p != null ? Math.min(.95, v.p + .12) : 0;
        var pts = subPath(pathR, t0);
        if (v.p == null) pts[0] = T([x0, yFront - 2]);
        over.push(arrow(pts, v.acol || darker(v.col || PAL[v.lab] || '#e53935') , v.dash));
      }
      top.push(vehicle(v, pos[0], pos[1], ang));
    });
    return out.join('') + deco.join('') + over.join('') + top.join('');
  }

  /* ---------- Aylanma chorraha ---------- */
  function ring(sc) {
    var RO = 78, RI = 34, hw = LW, out = [bg()], top = [], over = [];
    ['n', 'e', 's', 'w'].forEach(function (k) {
      out.push('<g transform="rotate(' + ANG[k] + ' ' + CX + ' ' + CY + ')"><rect x="' + (CX - hw - SW) + '" y="' + CY + '" width="' + (2 * hw + 2 * SW) + '" height="320" fill="#d5d9de"/></g>');
    });
    out.push('<circle cx="' + CX + '" cy="' + CY + '" r="' + (RO + SW) + '" fill="#d5d9de"/>');
    ['n', 'e', 's', 'w'].forEach(function (k) {
      out.push('<g transform="rotate(' + ANG[k] + ' ' + CX + ' ' + CY + ')"><rect x="' + (CX - hw) + '" y="' + CY + '" width="' + (2 * hw) + '" height="320" fill="#5f6670"/>' +
        '<line x1="' + CX + '" y1="' + (CY + RO + 14) + '" x2="' + CX + '" y2="' + (CY + 320) + '" stroke="#fff"' + lineStyle('dash') + '/></g>');
    });
    out.push('<circle cx="' + CX + '" cy="' + CY + '" r="' + RO + '" fill="#5f6670"/><circle cx="' + CX + '" cy="' + CY + '" r="' + (RI + SW) + '" fill="#d5d9de"/><circle cx="' + CX + '" cy="' + CY + '" r="' + RI + '" fill="#9ccc65"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + ((RO + RI + SW) / 2) + '" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="6 9" opacity=".7"/>');
    var sg = sc.sg || {};
    Object.keys(sg).forEach(function (k) { [].concat(sg[k]).forEach(function (id, i) { var p = rot(CX + hw + SW + 15, CY + RO + 22 + i * 30, ANG[k]); top.push(signImg(id, p[0], p[1], 26)); }); });
    var rm = (RO + RI + SW) / 2;
    (sc.v || []).forEach(function (raw) {
      var v = normV(raw), pos, ang;
      if (v.ring != null) { // halqadagi joy: burchak (gradus, 0 — janub, soat millariga teskari)
        var th = (90 - v.ring) * Math.PI / 180; pos = [CX + Math.cos(th) * rm, CY + Math.sin(th) * rm];
        ang = Math.atan2(-Math.cos(th), Math.sin(th)) * 180 / Math.PI + 90; // soat millariga teskari harakat urinmasi
        if (v.m === 'x') { var pts = []; for (var i = 0; i <= 12; i++) { var t2 = th - i * 0.07; pts.push([CX + Math.cos(t2) * rm, CY + Math.sin(t2) * rm]); } over.push(arrow(pts.slice(2), darker(v.col || PAL[v.lab] || '#e53935'))); }
      } else {
        var k = v.ap, R = ANG[k], x0 = CX + LW / 2, yF = CY + RO + 10 + (v.q || 0) * 40;
        pos = rot(x0, yF + 16, R); ang = R;
        if (v.m && v.m !== '-') { var a0 = rot(x0, yF - 2, R), a1 = rot(x0, CY + rm, R), a2 = rot(CX + rm * .78, CY + rm * .6, R); over.push(arrow(subPath([a0, a1, a2], 0), darker(v.col || PAL[v.lab] || '#e53935'))); }
      }
      top.push(vehicle(v, pos[0], pos[1], ang));
    });
    return out.join('') + over.join('') + top.join('');
  }

  /* ---------- Toʻgʻri yoʻl ---------- */
  function road(sc) {
    var ln = sc.ln || [1, 1], hb = ln[0] * LW, ht = ln[1] * LW, out = [bg()], top = [], over = [];
    var y0 = CY - ht, y1 = CY + hb;
    out.push('<rect x="0" y="' + (y0 - SW) + '" width="' + W + '" height="' + (hb + ht + 2 * SW) + '" fill="#d5d9de"/>');
    (sc.branch || []).forEach(function (b) { // yon yoʻl: [x, 'b'|'t']
      var x = b[0], bt = b[1] === 't';
      out.push('<rect x="' + (x - LW - SW) + '" y="' + (bt ? 0 : CY) + '" width="' + (2 * LW + 2 * SW) + '" height="' + (bt ? CY : H - CY) + '" fill="#d5d9de"/>');
    });
    out.push('<rect x="0" y="' + y0 + '" width="' + W + '" height="' + (hb + ht) + '" fill="#5f6670"/>');
    (sc.branch || []).forEach(function (b) {
      var x = b[0], bt = b[1] === 't';
      out.push('<rect x="' + (x - LW) + '" y="' + (bt ? 0 : CY) + '" width="' + (2 * LW) + '" height="' + (bt ? CY : H - CY) + '" fill="#5f6670"/>' +
        '<line x1="' + x + '" y1="' + (bt ? 0 : y1 + 4) + '" x2="' + x + '" y2="' + (bt ? y0 - 4 : H) + '" stroke="#fff"' + lineStyle('dash') + '/>');
    });
    if (sc.rail) sc.rail.forEach(function (x) {
      out.push('<rect x="' + (x - 22) + '" y="0" width="44" height="' + H + '" fill="#8d8173" opacity=".55"/>');
      for (var yy = 4; yy < H; yy += 9) out.push('<rect x="' + (x - 20) + '" y="' + yy + '" width="40" height="4" fill="#6d4c41" opacity=".8"/>');
      out.push('<rect x="' + (x - 26) + '" y="' + y0 + '" width="52" height="' + (hb + ht) + '" fill="#6b6f76"/>');
      [-8, 8].forEach(function (dx) { out.push('<line x1="' + (x + dx) + '" y1="0" x2="' + (x + dx) + '" y2="' + H + '" stroke="#cfd8dc" stroke-width="2.6"/>'); });
    });
    // markaziy chiziq
    var c = sc.c || 'dash', segs = sc.cseg || [[0, W, c]];
    segs.forEach(function (sg) {
      var a = sg[0], b = sg[1], k = sg[2];
      if (k === 'double') out.push('<line x1="' + a + '" y1="' + (CY - 2.4) + '" x2="' + b + '" y2="' + (CY - 2.4) + '" stroke="#fff" stroke-width="1.9"/><line x1="' + a + '" y1="' + (CY + 2.4) + '" x2="' + b + '" y2="' + (CY + 2.4) + '" stroke="#fff" stroke-width="1.9"/>');
      else if (k === 'sd' || k === 'ds') { // sd: yuqorida yaxlit, pastda uzuq (pastdagi oqim kesib oʻtishi mumkin)
        var yS = k === 'sd' ? CY - 2.4 : CY + 2.4, yD = k === 'sd' ? CY + 2.4 : CY - 2.4;
        out.push('<line x1="' + a + '" y1="' + yS + '" x2="' + b + '" y2="' + yS + '" stroke="#fff" stroke-width="1.9"/><line x1="' + a + '" y1="' + yD + '" x2="' + b + '" y2="' + yD + '" stroke="#fff" stroke-width="1.9" stroke-dasharray="10 9"/>');
      } else if (k !== 'none') out.push('<line x1="' + a + '" y1="' + CY + '" x2="' + b + '" y2="' + CY + '" stroke="#fff"' + lineStyle(k) + '/>');
    });
    for (var i = 1; i < ln[0]; i++) out.push('<line x1="0" y1="' + (CY + i * LW) + '" x2="' + W + '" y2="' + (CY + i * LW) + '" stroke="#fff"' + lineStyle(sc.lc || 'dash') + '/>');
    for (var j = 1; j < ln[1]; j++) out.push('<line x1="0" y1="' + (CY - j * LW) + '" x2="' + W + '" y2="' + (CY - j * LW) + '" stroke="#fff"' + lineStyle(sc.lc || 'dash') + '/>');
    if (sc.edge) out.push('<line x1="0" y1="' + (y1 - 2) + '" x2="' + W + '" y2="' + (y1 - 2) + '" stroke="' + (String(sc.edge).charAt(0) === 'y' ? '#ffd600' : '#fff') + '" stroke-width="2.2"' + (sc.edge === 'yd' ? ' stroke-dasharray="10 8"' : '') + '/>');
    (sc.zebra || []).forEach(function (x) { out.push(zebraAcross(x - 10, y0 + 1, hb + ht - 2, 20, false)); });
    (sc.stopl || []).forEach(function (s) { var x = s[0], d = s[1] || 'e'; out.push(d === 'e' ? '<rect x="' + (x - 2) + '" y="' + CY + '" width="3.5" height="' + hb + '" fill="#fff"/>' : '<rect x="' + (x - 2) + '" y="' + y0 + '" width="3.5" height="' + ht + '" fill="#fff"/>'); });
    (sc.yz || []).forEach(function (x) { // sariq zigzag 1.17
      var pz = 'M' + (x - 40) + ' ' + (y1 - 2); for (var t = 0; t < 8; t++) pz += ' L' + (x - 40 + t * 10 + 5) + ' ' + (y1 - (t % 2 ? 2 : 14)); pz += ' L' + (x + 40) + ' ' + (y1 - 2);
      out.push('<path d="' + pz + '" fill="none" stroke="#ffd600" stroke-width="2"/>');
    });
    (sc.sg || []).forEach(function (s) { var x = s[0], side = s[1], id = s[2], yy = side === 't' ? y0 - SW - 16 : y1 + SW + 16; top.push(signImg(id, x, yy + (s[3] || 0), 26)); });
    (sc.tl || []).forEach(function (s) { var x = s[0], side = s[1], yy = side === 't' ? y0 - SW - 20 : y1 + SW + 20; top.push(light(s[2], x, yy, s[3])); });
    (sc.ped || []).forEach(function (p) { top.push(person(p[0], p[1])); });
    (sc.obs || []).forEach(function (o) { // toʻsiq: [x, laneY]
      var oy = o[1];
      top.push('<rect x="' + (o[0] - 14) + '" y="' + (oy - 9) + '" width="28" height="18" rx="2" fill="#fff" stroke="#e53935" stroke-width="2"/><path d="M' + (o[0] - 12) + ' ' + (oy + 7) + ' l8 -14 M' + (o[0] - 4) + ' ' + (oy + 7) + ' l8 -14 M' + (o[0] + 4) + ' ' + (oy + 7) + ' l8 -14" stroke="#e53935" stroke-width="3"/>');
    });
    (sc.tri || []).forEach(function (t) { top.push('<path d="M' + t[0] + ' ' + (t[1] - 8) + ' l7 12 h-14z" fill="#fff" stroke="#e53935" stroke-width="2.6"/>'); });
    (sc.v || []).forEach(function (raw) {
      var v = normV(raw), d = v.ap || 'e', east = d === 'e';
      if (d === 'n' || d === 's') { // yon yoʻldagi (vertikal) transport
        var up = d === 'n', vx = v.x, vy = v.y, dm = DIM[v.type || 'car'] || DIM.car, fy = vy + (up ? -1 : 1) * dm[1] / 2, pth = null;
        if (v.m === 's') pth = [[vx, fy], [vx, up ? -10 : H + 10]];
        else if (v.m === 'r') { var ry = up ? CY + hb - LW / 2 : CY - ht + LW / 2; pth = [[vx, fy], [vx, ry], [up ? vx + 140 : vx - 140, ry]]; }
        else if (v.m === 'l') { var lyy = up ? CY - LW / 2 : CY + LW / 2; pth = [[vx, fy], [vx, lyy], [up ? vx - 140 : vx + 140, lyy]]; }
        if (pth) over.push(arrow(subPath(pth, 0), v.acol || darker(v.col || PAL[v.lab] || '#e53935'), v.dash));
        top.push(vehicle(v, vx, vy, up ? 0 : 180));
        return;
      }
      var lane = v.lane || 0, ly = east ? CY + LW / 2 + lane * LW : CY - LW / 2 - lane * LW;
      if (v.y != null) ly = v.y;
      var x = v.x != null ? v.x : 120, ang = east ? 90 : 270, dim = DIM[v.type || 'car'] || DIM.car, s = east ? 1 : -1;
      var fx = x + s * dim[1] / 2, path = null;
      if (v.m === 's') path = [[fx, ly], [fx + s * (v.len || 90), ly]];
      else if (v.m === 'L' || v.m === 'R') { var ty = ly + (v.m === 'L' ? -1 : 1) * (east ? 1 : -1) * LW * (v.n || 1); path = [[fx, ly], [fx + s * 45, ly], [fx + s * 45, ty], [fx + s * 95, ty]]; }
      else if (v.m === 'o') { var oy = east ? ly - LW * (lane + 1) : ly + LW * (lane + 1); path = [[fx, ly], [fx + s * 40, ly], [fx + s * 20, oy], [fx + s * 95, oy]]; }
      else if (v.m === 'back') { var oy2 = east ? CY + LW / 2 : CY - LW / 2; path = [[fx, ly], [fx + s * 60, ly], [fx + s * 40, oy2], [fx + s * 100, oy2]]; }
      else if (v.m === 'u') { var uy = east ? CY - LW / 2 : CY + LW / 2; path = [[fx, ly], [fx + s * 55, ly - s * 0], [fx + s * 55, uy], [fx, uy]]; }
      else if (v.m === 'p') { var py = east ? y1 - LW / 2 + 2 : y0 + LW / 2 - 2; path = [[fx, ly], [fx + s * 40, ly], [fx + s * 30, py], [fx + s * 80, py]]; }
      else if (v.m === 'rt' || v.m === 'lt') { var right = v.m === 'rt', down = (east && right) || (!east && !right), bxl = down ? v.bx - LW / 2 : v.bx + LW / 2; path = [[fx, ly], [bxl, ly], [bxl, down ? H + 10 : -10]]; }
      if (path) over.push(arrow(path.length === 4 ? subPath(path, 0) : (path.length === 3 ? subPath(path, 0) : path), v.acol || darker(v.col || PAL[v.lab] || '#e53935'), v.dash));
      top.push(vehicle(v, x, ly, ang));
    });
    return out.join('') + over.join('') + top.join('');
  }

  function normV(raw) {
    if (!Array.isArray(raw)) return raw;
    var o = raw[raw.length - 1]; o = (o && typeof o === 'object') ? o : {};
    var v = { lab: raw[0], ap: raw[1], m: raw[2], type: typeof raw[3] === 'string' ? raw[3] : undefined, col: typeof raw[4] === 'string' ? raw[4] : undefined };
    Object.keys(o).forEach(function (k) { v[k] = o[k]; });
    if (v.col == null && v.lab && PAL[v.lab]) v.col = PAL[v.lab];
    return v;
  }

  function render(sc) {
    var body = sc.k === 'road' ? road(sc) : sc.k === 'ring' ? ring(sc) : cross(sc);
    var cap = sc.cap ? '<rect x="0" y="' + (H - 22) + '" width="' + W + '" height="22" fill="rgba(0,0,0,.55)"/><text x="' + (W / 2) + '" y="' + (H - 7) + '" font-size="12.5" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">' + sc.cap + '</text>' : '';
    return '<svg class="scene" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">' + body + cap + '</svg>';
  }
  g.YHQScene = { render: render, setBase: function (b) { BASE = b; } };
})(typeof window !== 'undefined' ? window : globalThis);
