/*! Kuvonch Academy — Avtotest: chorraha holatlarini (tepadan ko'rinish) SVG'da chizish.
 *  ATSahna.svg({
 *    tur: "X" | "T",            // to'rt yo'lli chorraha yoki T-simon (yoq: yo'q qo'l)
 *    yoq: "N",                  // T uchun: qaysi tomon yo'q (N/E/S/W)
 *    asosiy: ["N","S"],         // asosiy yo'l qo'llari (kengroq va sariq chiziq bilan ko'rsatiladi)
 *    belgi: [{kod:"2.4", joy:"S"}],          // qaysi qo'lga kirishda turgan belgi
 *    svetofor: {S:"yashil", N:"qizil"},      // qizil | sariq | yashil | yashil-o'q (o'ngga qo'shimcha seksiya)
 *    tramvay: "NS" | "EW",       // tramvay izlari
 *    avto: [{id:"A", joy:"S", y:"togri"|"ong"|"chap"|"qaytish", tur:"yengil"|"yuk"|"avtobus"|"tramvay"|"maxsus"|"velo", rang:"#hex"}],
 *    piyoda: ["E"]               // shu qo'lda o'tish joyidan o'tayotgan piyodalar
 *  })
 *  Yo'nalish: S (pastdan) shimolga harakatlanadi; o'ng tomonlama harakat. */
(function () {
  "use strict";
  var ROT = { S: 0, W: 90, N: 180, E: 270 };
  var C = 200, H = 40;               // markaz va yo'lning yarim kengligi
  var COL = { grass: "#a9c48a", road: "#5d636e", line: "#f4f4f4", main: "#f3c623", walk: "#f4f4f4" };
  var CAR = { yengil: ["#e8473f", "#2f7de1", "#f2b632", "#2fb37a", "#9c5bd8", "#ef7b2e"] };

  function rot(a, inner) { return a ? '<g transform="rotate(' + a + ' ' + C + ' ' + C + ')">' + inner + '</g>' : inner; }
  function pt(x, y, a) { // nuqtani markaz atrofida a gradusga (soat yo'nalishida) aylantirish
    var r = a * Math.PI / 180, dx = x - C, dy = y - C;
    return [C + dx * Math.cos(r) - dy * Math.sin(r), C + dx * Math.sin(r) + dy * Math.cos(r)];
  }
  function arms(spec) { var all = ["N", "E", "S", "W"]; return spec.tur === "T" ? all.filter(function (a) { return a !== (spec.yoq || "N"); }) : all; }

  function roads(spec) {
    var A = arms(spec), h = "";
    A.forEach(function (a) { h += rot(ROT[a], '<rect x="' + (C - H) + '" y="' + C + '" width="' + (2 * H) + '" height="' + (400 - C) + '" fill="' + COL.road + '"/>'); });
    h += '<rect x="' + (C - H) + '" y="' + (C - H) + '" width="' + (2 * H) + '" height="' + (2 * H) + '" fill="' + COL.road + '"/>';
    A.forEach(function (a) {
      var main = spec.asosiy && spec.asosiy.indexOf(a) >= 0;
      var g = '<path d="M' + C + ' ' + (C + H + 4) + ' V400" stroke="' + (main ? COL.main : COL.line) + '" stroke-width="' + (main ? 4 : 3) + '"' + (main ? "" : ' stroke-dasharray="14 12"') + '/>';
      g += '<path d="M' + C + ' ' + (C + H + 2) + ' H' + (C + H) + '" stroke="' + COL.line + '" stroke-width="4"/>'; // to'xtash chizig'i (o'ng bo'lak)
      h += rot(ROT[a], g);
    });
    if (spec.asosiy && spec.asosiy.length > 1) { // asosiy yo'l chorraha ichida ham sariq chiziq bilan
      var m = spec.asosiy, k = m.join("");
      if (/N/.test(k) && /S/.test(k)) h += '<path d="M' + C + ' ' + (C - H) + ' V' + (C + H) + '" stroke="' + COL.main + '" stroke-width="3" stroke-dasharray="6 6" opacity=".8"/>';
      else if (/E/.test(k) && /W/.test(k)) h += '<path d="M' + (C - H) + ' ' + C + ' H' + (C + H) + '" stroke="' + COL.main + '" stroke-width="3" stroke-dasharray="6 6" opacity=".8"/>';
      else { var p1 = pt(C, C + H, ROT[m[0]]), p2 = pt(C, C + H, ROT[m[1]]); h += '<path d="M' + p1[0] + ' ' + p1[1] + ' Q' + C + ' ' + C + ' ' + p2[0] + ' ' + p2[1] + '" fill="none" stroke="' + COL.main + '" stroke-width="3" stroke-dasharray="6 6" opacity=".8"/>'; }
    }
    if (spec.tramvay) {
      var t = '<path d="M' + (C - 7) + ' 0 V400 M' + (C + 7) + ' 0 V400" stroke="#2b2b2b" stroke-width="2.5"/>';
      h += spec.tramvay === "EW" ? rot(90, t) : t;
    }
    return h;
  }
  function zebra(a) {
    var g = ""; for (var i = 0; i < 7; i++) g += '<rect x="' + (C - H + 3 + i * 11) + '" y="' + (C + H + 10) + '" width="7" height="22" fill="' + COL.walk + '"/>';
    g += '<g transform="translate(' + (C + 16) + ' ' + (C + H + 21) + ')"><circle r="6" fill="#ffd25e" stroke="#222" stroke-width="1.5"/><circle r="2.5" fill="#222"/></g>';
    return rot(ROT[a], g);
  }
  function carShape(tur, color) {
    if (tur === "tramvay") return '<rect x="-13" y="-46" width="26" height="92" rx="6" fill="#f0c419" stroke="#7a5d00" stroke-width="2"/><rect x="-9" y="-40" width="18" height="10" fill="#5a6b80"/><rect x="-13" y="-4" width="26" height="4" fill="#d8352a"/>';
    if (tur === "avtobus") return '<rect x="-13" y="-34" width="26" height="68" rx="5" fill="#2f8fd8" stroke="#123" stroke-width="1.5"/><rect x="-9" y="-30" width="18" height="9" fill="#cfe6ff"/>';
    if (tur === "yuk") return '<rect x="-13" y="-30" width="26" height="16" rx="3" fill="' + color + '" stroke="#222" stroke-width="1.5"/><rect x="-14" y="-12" width="28" height="44" rx="2" fill="#8d97a5" stroke="#222" stroke-width="1.5"/>';
    if (tur === "velo") return '<rect x="-2.5" y="-16" width="5" height="32" rx="2" fill="#222"/><rect x="-9" y="-8" width="18" height="4" fill="#222"/><circle cy="-2" r="5" fill="' + color + '"/>';
    var h = '<rect x="-12" y="-22" width="24" height="44" rx="7" fill="' + color + '" stroke="#1b1b1b" stroke-width="1.5"/><rect x="-9" y="-14" width="18" height="9" rx="2" fill="#cfe0ef"/><rect x="-9" y="9" width="18" height="6" rx="2" fill="#cfe0ef"/>';
    if (tur === "maxsus") h += '<rect x="-9" y="-3" width="9" height="5" fill="#2d6cff"/><rect x="0" y="-3" width="9" height="5" fill="#ff2d2d"/>';
    return h;
  }
  // S qo'lidagi avtomobil (shimolga harakatlanadi) uchun yo'nalish o'qlari
  var PATH = {
    togri: "M220 238 V112",
    ong: "M220 238 V232 Q220 220 236 220 H292",
    chap: "M220 238 V206 Q220 182 196 182 H108",
    qaytish: "M220 238 V196 Q220 172 200 172 Q180 172 180 196 V292"
  };
  function car(v, i) {
    var a = ROT[v.joy] || 0, tur = v.tur || "yengil", color = v.rang || CAR.yengil[i % CAR.yengil.length];
    var y0 = tur === "tramvay" ? 300 : (tur === "avtobus" ? 286 : 270), x0 = tur === "tramvay" ? 200 : 220;
    if (tur === "tramvay" && PATH[v.y]) {} // tramvay izi markazda
    var path = (PATH[v.y || "togri"] || PATH.togri);
    if (tur === "tramvay") path = path.replace(/^M220/, "M200").replace(/V232 Q220 220 236 220/, "V230 Q200 220 220 220").replace(/V206 Q220 182 196 182/, "V200 Q200 182 182 182");
    var g = '<path d="' + path + '" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/>' +
      '<path d="' + path + '" fill="none" stroke="#1f6fff" stroke-width="3.5" stroke-linecap="round" marker-end="url(#ah)"/>' +
      '<g transform="translate(' + x0 + ' ' + y0 + ')">' + carShape(tur, color) + '</g>';
    var L = pt(x0, y0 + (tur === "tramvay" ? 62 : tur === "avtobus" ? 50 : tur === "velo" ? 30 : 38), a);
    return rot(a, g) + (v.id ? '<g transform="translate(' + L[0].toFixed(1) + ' ' + L[1].toFixed(1) + ')"><circle r="12" fill="#fff" stroke="#1b1b1b" stroke-width="2"/><text y="5" font-size="15" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="#1b1b1b">' + v.id + '</text></g>' : "");
  }
  function sign(b) {
    var a = ROT[b.joy] || 0, p = pt(C + H + 26, C + H + 40, a);
    var s = window.ATBelgi ? window.ATBelgi.svg(b.kod) : "";
    var plate = /class="plate"/.test(s);
    var w = plate ? 46 : 34, hgt = plate ? 20 : 34;
    s = s.replace("<svg ", '<svg x="' + (p[0] - w / 2).toFixed(1) + '" y="' + (p[1] - hgt / 2).toFixed(1) + '" width="' + w + '" height="' + hgt + '" ');
    return '<rect x="' + (p[0] - 2).toFixed(1) + '" y="' + (p[1]).toFixed(1) + '" width="4" height="22" fill="#555"/>' + s;
  }
  function light(a, st) {
    var p = pt(C + H + 22, C + H + 20, ROT[a]), on = { qizil: 0, sariq: 1, yashil: 2, "yashil-o'q": 0 }[st];
    var cols = ["#ff3030", "#ffc400", "#22c35e"], h = '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')"><rect x="-8" y="-24" width="16" height="46" rx="4" fill="#1d1d1d"/>';
    for (var i = 0; i < 3; i++) h += '<circle cy="' + (-15 + i * 14) + '" r="5.5" fill="' + (i === on ? cols[i] : "#444") + '"/>';
    if (st === "yashil-o'q") h += '<rect x="8" y="9" width="14" height="14" rx="3" fill="#1d1d1d"/><path d="M11 16 H19 M16 12 L20 16 L16 20" stroke="#22c35e" stroke-width="2.5" fill="none"/>';
    return h + '</g>';
  }
  window.ATSahna = {
    svg: function (spec) {
      spec = spec || {};
      var h = '<svg class="sahna" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#1f6fff"/></marker></defs>';
      h += '<rect width="400" height="400" fill="' + COL.grass + '"/>' + roads(spec);
      (spec.piyoda || []).forEach(function (a) { h += zebra(a); });
      (spec.avto || []).forEach(function (v, i) { h += car(v, i); });
      for (var a in (spec.svetofor || {})) h += light(a, spec.svetofor[a]);
      (spec.belgi || []).forEach(function (b) { h += sign(b); });
      return h + '</svg>';
    }
  };
})();
