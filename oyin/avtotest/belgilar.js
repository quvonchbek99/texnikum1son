/*! Kuvonch Academy — Avtotest: yo'l belgilarini SVG'da chizish (o'zimiz chizgan soddalashtirilgan belgilar).
 *  ATBelgi.svg("2.4") → <svg>…</svg>;  ATBelgi.guruhlar(), ATBelgi.royxat(guruh) — katalog uchun.
 *  Katalog (raqam, nom, ma'no) — avtotest/belgilar-katalog.js da (window.AT_BELGI_KATALOG). */
(function () {
  "use strict";
  var RED = "#d7262e", BLUE = "#1f5fbf", YEL = "#f6c400", BLK = "#1a1a1a", WH = "#fff", GRY = "#8a8f98";

  // ---------- piktogrammalar (100×100 maydon, rang c) ----------
  function head(x, y, ang, c, s) { s = s || 1; return '<polygon points="' + [0, -14 * s, 12 * s, 6 * s, -12 * s, 6 * s].join(" ").replace(/(-?[\d.]+) (-?[\d.]+)/g, function (_, a, b) { return (+a + x) + "," + (+b + y); }) + '" fill="' + c + '" transform="rotate(' + ang + ' ' + x + ' ' + y + ')"/>'; }
  function st(d, c, w) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 10) + '" stroke-linecap="butt" stroke-linejoin="round"/>'; }
  function fig(x, y, c, s) { // yurayotgan odam
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><circle cx="0" cy="-30" r="6.5" fill="' + c + '"/>' +
      '<path d="M0 -21 L-3 2 M-3 2 L-13 22 M-3 2 L8 21 M-1 -16 L-13 -4 M-1 -16 L11 -6" fill="none" stroke="' + c + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }
  function carSide(x, y, c, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-30 6 V-4 Q-30 -8 -25 -9 L-16 -10 L-9 -20 H12 L22 -10 L28 -8 Q31 -7 31 -3 V6 Z" fill="' + c + '"/>' +
      '<circle cx="-17" cy="7" r="7" fill="' + c + '"/><circle cx="17" cy="7" r="7" fill="' + c + '"/><circle cx="-17" cy="7" r="3" fill="#fff"/><circle cx="17" cy="7" r="3" fill="#fff"/></g>';
  }
  function carBack(x, y, c, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-14 -14 H14 L18 -2 H22 V10 H-22 V-2 H-18 Z" fill="' + c + '"/><rect x="-20" y="10" width="8" height="7" fill="' + c + '"/><rect x="12" y="10" width="8" height="7" fill="' + c + '"/><rect x="-10" y="-11" width="20" height="8" fill="#fff"/></g>';
  }
  function truckSide(x, y, c, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-32" y="-20" width="40" height="24" fill="' + c + '"/><path d="M10 4 V-12 H22 L30 -2 V4 Z" fill="' + c + '"/>' +
      '<circle cx="-20" cy="8" r="6.5" fill="' + c + '"/><circle cx="20" cy="8" r="6.5" fill="' + c + '"/></g>';
  }
  var P = {
    up: function (c) { return st("M50 84 V36", c, 12) + head(50, 30, 0, c, 1.6); },
    right: function (c) { return st("M50 84 V54 Q50 42 62 42 H66", c, 11) + head(74, 42, 90, c, 1.5); },
    left: function (c) { return '<g transform="translate(100 0) scale(-1 1)">' + P.right(c) + '</g>'; },
    upright: function (c) { return st("M44 84 V30", c, 11) + head(44, 24, 0, c, 1.4) + st("M44 66 Q44 54 58 54 H64", c, 9) + head(71, 54, 90, c, 1.3); },
    upleft: function (c) { return '<g transform="translate(100 0) scale(-1 1)">' + P.upright(c) + '</g>'; },
    leftright: function (c) { return st("M50 84 V58 Q50 48 40 48 H34 M50 58 Q50 48 60 48 H66", c, 10) + head(27, 48, -90, c, 1.3) + head(73, 48, 90, c, 1.3); },
    uturn: function (c) { return st("M36 84 V46 Q36 26 52 26 Q66 26 66 44 V52", c, 10) + head(66, 60, 180, c, 1.4); },
    keepright: function (c) { return st("M34 26 L62 62", c, 11) + head(68, 70, 142, c, 1.5); },
    keepleft: function (c) { return '<g transform="translate(100 0) scale(-1 1)">' + P.keepright(c) + '</g>'; },
    keepboth: function (c) { return st("M50 24 V44 L32 66 M50 44 L68 66", c, 9) + head(27, 72, -140, c, 1.25) + head(73, 72, 140, c, 1.25); },
    round: function (c) {
      var h = '<circle cx="50" cy="52" r="20" fill="none" stroke="' + c + '" stroke-width="9" stroke-dasharray="26 16" transform="rotate(-20 50 52)"/>';
      return h + head(68, 38, 140, c, 1.1) + head(32, 40, 20, c, 1.1) + head(48, 74, -100, c, 1.1);
    },
    bendright: function (c) { return st("M42 84 V56 Q42 36 62 30", c, 10) + head(66, 28, 70, c, 1.3); },
    bendleft: function (c) { return '<g transform="translate(100 0) scale(-1 1)">' + P.bendright(c) + '</g>'; },
    dbend: function (c) { return st("M40 86 V72 Q40 58 56 52 Q66 46 62 34", c, 9) + head(60, 28, -20, c, 1.2); },
    cross: function (c) { return st("M50 20 V86 M22 56 H78", c, 10); },
    crossmain: function (c) { return st("M50 18 V88", c, 15) + st("M24 56 H76", c, 7); },
    sideright: function (c) { return st("M48 18 V88", c, 15) + st("M48 52 H76", c, 7); },
    sideleft: function (c) { return st("M52 18 V88", c, 15) + st("M52 52 H24", c, 7); },
    tjun: function (c) { return st("M22 40 H78", c, 10) + st("M50 40 V88", c, 10); },
    excl: function (c) { return '<rect x="45" y="30" width="10" height="34" rx="3" fill="' + c + '"/><circle cx="50" cy="74" r="6" fill="' + c + '"/>'; },
    light: function () { return '<rect x="38" y="28" width="24" height="56" rx="5" fill="' + BLK + '"/><circle cx="50" cy="38" r="6" fill="' + RED + '"/><circle cx="50" cy="56" r="6" fill="' + YEL + '"/><circle cx="50" cy="74" r="6" fill="#1e9c4a"/>'; },
    fence: function (c) { var h = ""; for (var i = 0; i < 4; i++) h += '<rect x="' + (24 + i * 15) + '" y="40" width="7" height="42" fill="' + c + '"/>'; return h + '<rect x="18" y="48" width="64" height="7" fill="' + c + '"/><rect x="18" y="66" width="64" height="7" fill="' + c + '"/>'; },
    train: function (c) { return '<path d="M20 74 V50 H34 V36 H44 V50 H58 V40 H74 V74 Z" fill="' + c + '"/><rect x="62" y="30" width="6" height="12" fill="' + c + '"/><circle cx="30" cy="78" r="6" fill="' + c + '"/><circle cx="50" cy="78" r="6" fill="' + c + '"/><circle cx="70" cy="78" r="6" fill="' + c + '"/>'; },
    tram: function (c) { return '<path d="M50 24 L40 34 H60 Z" fill="none" stroke="' + c + '" stroke-width="3"/><rect x="26" y="36" width="48" height="38" rx="6" fill="' + c + '"/><rect x="32" y="42" width="14" height="12" fill="#fff"/><rect x="54" y="42" width="14" height="12" fill="#fff"/><circle cx="36" cy="78" r="5" fill="' + c + '"/><circle cx="64" cy="78" r="5" fill="' + c + '"/>'; },
    ped: function (c) { return fig(50, 62, c, 1.15); },
    kids: function (c) { return fig(40, 64, c, 1) + fig(62, 70, c, 0.78); },
    bike: function (c) { return '<circle cx="30" cy="66" r="12" fill="none" stroke="' + c + '" stroke-width="5"/><circle cx="70" cy="66" r="12" fill="none" stroke="' + c + '" stroke-width="5"/>' + st("M30 66 L44 44 H64 L70 66 M44 44 L52 66 L64 44 M40 40 H50 M64 44 L60 36 H68", c, 5); },
    moto: function (c) { return '<circle cx="28" cy="68" r="11" fill="none" stroke="' + c + '" stroke-width="6"/><circle cx="72" cy="68" r="11" fill="none" stroke="' + c + '" stroke-width="6"/><path d="M28 68 L44 52 H62 L72 68 M58 52 L64 38 H70" fill="none" stroke="' + c + '" stroke-width="6"/><path d="M40 48 H60 L56 58 H42 Z" fill="' + c + '"/>'; },
    car: function (c) { return carSide(50, 60, c, 1.1); },
    truck: function (c) { return truckSide(50, 60, c, 1.05); },
    bus: function (c) { return '<rect x="18" y="38" width="64" height="30" rx="5" fill="' + c + '"/><rect x="24" y="43" width="11" height="10" fill="#fff"/><rect x="39" y="43" width="11" height="10" fill="#fff"/><rect x="54" y="43" width="11" height="10" fill="#fff"/><circle cx="32" cy="70" r="6" fill="' + c + '"/><circle cx="68" cy="70" r="6" fill="' + c + '"/>'; },
    tractor: function (c) { return '<circle cx="36" cy="64" r="14" fill="none" stroke="' + c + '" stroke-width="6"/><circle cx="70" cy="70" r="8" fill="' + c + '"/><path d="M30 48 V32 H48 V48 H74 V62 H50 Z" fill="' + c + '"/>'; },
    slip: function (c) { return carSide(50, 44, c, 0.85) + st("M30 66 Q38 58 46 66 T62 66 M42 80 Q50 72 58 80 T74 80", c, 4); },
    bump: function (c) { return '<path d="M18 74 H34 Q50 46 66 74 H82 V80 H18 Z" fill="' + c + '"/>'; },
    uneven: function (c) { return '<path d="M18 74 Q30 58 42 74 Q54 58 66 74 Q74 64 82 74 V80 H18 Z" fill="' + c + '"/>'; },
    narrow: function (c) { return st("M34 86 V66 L42 50 V24 M66 86 V66 L58 50 V24", c, 7); },
    narrowr: function (c) { return st("M36 86 V24 M66 86 V66 L54 50 V24", c, 7); },
    narrowl: function (c) { return '<g transform="translate(100 0) scale(-1 1)">' + P.narrowr(c) + '</g>'; },
    twoway: function (c) { return st("M38 84 V40", c, 8) + head(38, 34, 0, c, 1.1) + st("M62 30 V74", c, 8) + head(62, 80, 180, c, 1.1); },
    down: function (c) { return '<path d="M16 46 L84 80 H16 Z" fill="' + c + '"/><text x="60" y="52" font-size="15" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + c + '">10%</text>'; },
    climb: function (c) { return '<path d="M84 46 L16 80 H84 Z" fill="' + c + '"/><text x="40" y="52" font-size="15" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + c + '">10%</text>'; },
    works: function (c) { return fig(44, 62, c, 1) + st("M56 52 L70 78", c, 5) + '<path d="M60 82 Q72 66 84 82 Z" fill="' + c + '"/>'; },
    rocks: function (c) { return '<path d="M20 84 L30 30 H38 L26 84 Z" fill="' + c + '"/><circle cx="56" cy="44" r="7" fill="' + c + '"/><circle cx="66" cy="62" r="6" fill="' + c + '"/><circle cx="54" cy="76" r="8" fill="' + c + '"/>'; },
    deer: function (c) { return '<path d="M30 80 L34 60 Q30 52 36 48 L58 46 L66 34 L62 26 L68 28 L70 22 L72 30 L78 30 L74 36 L70 48 L66 52 L66 80 H62 L60 62 L42 62 L40 80 Z" fill="' + c + '"/>'; },
    cow: function (c) { return '<path d="M22 50 H62 L70 44 L80 46 L76 56 L70 56 L68 66 V80 H62 V68 H34 V80 H28 V66 Q22 62 22 56 Z" fill="' + c + '"/>'; },
    plane: function (c) { return '<path d="M50 20 Q54 20 54 30 V44 L80 58 V64 L54 56 V72 L62 78 V82 L50 79 L38 82 V78 L46 72 V56 L20 64 V58 L46 44 V30 Q46 20 50 20 Z" fill="' + c + '"/>'; },
    tunnel: function (c) { return '<path d="M18 84 V58 Q18 30 50 30 Q82 30 82 58 V84 H66 V60 Q66 46 50 46 Q34 46 34 60 V84 Z" fill="' + c + '"/>'; },
    wind: function (c) { return st("M20 40 H66 Q76 40 76 32 M20 56 H78 M20 72 H62 Q72 72 72 80", c, 6); },
    horn: function (c) { return '<path d="M22 42 H36 L66 26 V82 L36 66 H22 Z" fill="' + c + '"/>'; },
    overtake: function () { return carBack(32, 56, RED, 1) + carBack(68, 56, BLK, 1); },
    overtakeTruck: function () { return '<g transform="translate(-4 0)">' + truckSide(34, 58, RED, 0.62) + '</g>' + carBack(70, 56, BLK, 1); },
    P: function (c) { return '<text x="50" y="76" font-size="66" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + c + '">P</text>'; },
    house: function (c) { return '<path d="M20 60 L40 42 L60 60 V82 H20 Z" fill="' + c + '"/>' + fig(70, 70, c, 0.75) + '<circle cx="80" cy="80" r="4" fill="' + c + '"/>'; },
    motorway: function (c) { return '<path d="M18 86 L42 40 H46 L36 86 Z M82 86 L58 40 H54 L64 86 Z" fill="' + c + '"/><path d="M16 36 H84 V44 H16 Z" fill="' + c + '"/><path d="M48 86 V74 M48 66 V56 M48 50 V44" stroke="' + c + '" stroke-width="3"/>'; },
    hospital: function () { return '<path d="M42 24 H58 V42 H76 V58 H58 V76 H42 V58 H24 V42 H42 Z" fill="' + RED + '"/>'; },
    fuel: function (c) { return '<rect x="28" y="24" width="30" height="58" rx="3" fill="' + c + '"/><rect x="33" y="30" width="20" height="14" fill="#fff"/><path d="M58 40 H66 V70 Q66 76 72 74 V36 L64 28" fill="none" stroke="' + c + '" stroke-width="5"/>'; },
    phone: function (c) { return '<path d="M30 24 Q24 30 26 40 Q34 66 60 74 Q70 76 76 70 L66 58 L58 62 Q44 56 38 42 L42 34 Z" fill="' + c + '"/>'; },
    food: function (c) { return st("M36 24 V78 M28 24 V40 Q28 48 36 48 Q44 48 44 40 V24 M64 78 V24 Q74 30 74 48 H64", c, 5); },
    deadend: function (c) { return '<rect x="38" y="40" width="24" height="50" fill="' + c + '"/><rect x="22" y="22" width="56" height="18" fill="' + RED + '"/>'; },
    pedx: function (c) { return fig(52, 58, c, 0.95) + '<path d="M20 86 H84" stroke="' + c + '" stroke-width="6" stroke-dasharray="8 5"/>'; },
    trailer: function (c) { return carSide(36, 58, c, 0.72) + '<rect x="62" y="44" width="26" height="18" fill="' + c + '"/><path d="M58 56 H62" stroke="' + c + '" stroke-width="4"/><circle cx="75" cy="66" r="5" fill="' + c + '"/>'; },
    jam: function (c) { return carSide(36, 48, c, 0.62) + carSide(64, 48, c, 0.62) + carSide(50, 74, c, 0.62); },
    gravel: function (c) { return carSide(36, 66, c, 0.7) + '<circle cx="68" cy="50" r="5" fill="' + c + '"/><circle cx="78" cy="40" r="4" fill="' + c + '"/><circle cx="74" cy="60" r="3.5" fill="' + c + '"/><circle cx="84" cy="54" r="3" fill="' + c + '"/>'; },
    wrench: function (c) { return '<path d="M30 76 L58 48 Q54 34 64 26 Q72 22 78 24 L68 34 L72 42 L80 40 L84 30 Q86 38 82 46 Q74 56 62 52 L34 80 Z" fill="' + c + '"/>'; },
    school: function (c) { return fig(38, 64, c, 0.85) + fig(60, 68, c, 0.7) + '<rect x="66" y="30" width="16" height="12" fill="' + c + '"/>'; },
    taxi: function (c) { return '<text x="50" y="62" font-size="26" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + c + '">TAXI</text>'; },
    oneway: function (c) { return st("M50 88 V30", c, 16) + head(50, 22, 0, c, 2); },
    busstop: function (c) { return P.bus(c); },
    tramstop: function (c) { return P.tram(c); }
  };

  // ---------- ramkalar ----------
  function txt(t, y, fs, c, w) { return '<text x="50" y="' + y + '" font-size="' + fs + '" font-weight="' + (w || 800) + '" font-family="Arial,Helvetica,sans-serif" text-anchor="middle" fill="' + c + '">' + t + '</text>'; }
  function inner(p, x, y, s, c) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ') translate(-50 -50)">' + (P[p] ? P[p](c) : txt(p, 66, 40, c)) + '</g>'; }
  function svg(body, vb, cls) { return '<svg class="' + (cls || "belgi") + '" viewBox="' + (vb || "0 0 100 100") + '" xmlns="http://www.w3.org/2000/svg" role="img">' + body + '</svg>'; }
  var F = {
    ogoh: function (p) { return svg('<path d="M50 6 L96 88 Q98 93 92 93 H8 Q2 93 4 88 Z" fill="' + RED + '"/><path d="M50 22 L84 84 H16 Z" fill="' + WH + '"/>' + (p ? inner(p, 50, 64, 0.48, BLK) : "")); },
    berish: function () { return svg('<path d="M50 94 L96 12 Q98 7 92 7 H8 Q2 7 4 12 Z" fill="' + RED + '"/><path d="M50 78 L84 16 H16 Z" fill="' + WH + '"/>'); },
    taqiq: function (p, slash) { return svg('<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + WH + '"/>' + (p ? inner(p, 50, 50, 0.66, BLK) : "") + (slash ? '<path d="M24 24 L76 76" stroke="' + RED + '" stroke-width="9"/>' : "")); },
    kirish: function () { return svg('<circle cx="50" cy="50" r="47" fill="' + RED + '"/><rect x="18" y="41" width="64" height="18" fill="' + WH + '"/>'); },
    tson: function (t, unit) { return svg('<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + WH + '"/>' + txt(t, unit ? 56 : 64, unit ? 28 : 38, BLK) + (unit ? txt(unit, 76, 16, BLK, 700) : "")); },
    tugash: function (t) { var h = '<circle cx="50" cy="50" r="46" fill="' + WH + '" stroke="' + BLK + '" stroke-width="2"/>'; if (t) h += txt(t, 64, 38, GRY); for (var i = -2; i <= 2; i++) h += '<path d="M' + (22 + i * 7) + ' ' + (78 + i * 7) + ' L' + (78 + i * 7) + ' ' + (22 + i * 7) + '" stroke="' + BLK + '" stroke-width="2.5"/>'; return svg(h); },
    tugashP: function (p) { var h = '<circle cx="50" cy="50" r="46" fill="' + WH + '" stroke="' + BLK + '" stroke-width="2"/>' + inner(p, 50, 50, 0.62, GRY); for (var i = -2; i <= 2; i++) h += '<path d="M' + (22 + i * 7) + ' ' + (78 + i * 7) + ' L' + (78 + i * 7) + ' ' + (22 + i * 7) + '" stroke="' + BLK + '" stroke-width="2.5"/>'; return svg(h); },
    kokx: function (one) { return svg('<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + BLUE + '"/><path d="M24 24 L76 76' + (one ? "" : " M76 24 L24 76") + '" stroke="' + RED + '" stroke-width="9"/>'); },
    buyur: function (p) { return svg('<circle cx="50" cy="50" r="47" fill="' + BLUE + '"/><circle cx="50" cy="50" r="45" fill="none" stroke="' + WH + '" stroke-width="2"/>' + (p ? inner(p, 50, 50, 0.72, WH) : "")); },
    bson: function (t) { return svg('<circle cx="50" cy="50" r="47" fill="' + BLUE + '"/>' + txt(t, 64, 38, WH)); },
    stop: function () { return svg('<polygon points="30,3 70,3 97,30 97,70 70,97 30,97 3,70 3,30" fill="' + RED + '"/><polygon points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" fill="none" stroke="' + WH + '" stroke-width="3"/>' + txt("STOP", 61, 27, WH)); },
    romb: function (end) { var h = '<polygon points="50,3 97,50 50,97 3,50" fill="' + WH + '" stroke="' + BLK + '" stroke-width="2"/><polygon points="50,18 82,50 50,82 18,50" fill="' + YEL + '"/>'; if (end) h += '<path d="M26 74 L74 26" stroke="' + BLK + '" stroke-width="9"/><path d="M14 62 L62 14 M38 86 L86 38" stroke="' + BLK + '" stroke-width="5"/>'; return svg(h); },
    imtiyozQ: function () { return svg('<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + WH + '"/>' + st("M62 76 V40", RED, 8) + head(62, 34, 0, RED, 1.1) + st("M38 26 V62", BLK, 8) + head(38, 68, 180, BLK, 1.1)); },
    imtiyozB: function () { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + BLUE + '"/>' + st("M38 26 V62", RED, 8) + head(38, 68, 180, RED, 1.1) + st("M62 76 V40", WH, 8) + head(62, 34, 0, WH, 1.1)); },
    kok: function (p, t) { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + BLUE + '"/><rect x="6" y="6" width="88" height="88" rx="4" fill="none" stroke="' + WH + '" stroke-width="2"/>' + (p ? inner(p, 50, t ? 44 : 50, t ? 0.62 : 0.74, WH) : "") + (t ? txt(t, 88, 14, WH, 700) : "")); },
    kokOxir: function (p) { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + BLUE + '"/>' + inner(p, 50, 50, 0.74, WH) + '<path d="M18 82 L82 18" stroke="' + RED + '" stroke-width="7"/>'); },
    piyoda: function () { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + BLUE + '"/><path d="M50 12 L90 84 H10 Z" fill="' + WH + '"/>' + fig(52, 66, BLK, 0.9) + '<path d="M22 80 H78" stroke="' + BLK + '" stroke-width="3" stroke-dasharray="6 4"/>'); },
    servis: function (p) { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + BLUE + '"/><rect x="16" y="12" width="68" height="60" rx="3" fill="' + WH + '"/>' + inner(p, 50, 42, 0.58, BLK)); },
    andrey: function (two) { var arm = '<rect x="-40" y="-7" width="80" height="14" fill="' + WH + '" stroke="' + RED + '" stroke-width="4"/>', cy = two ? 38 : 50; return svg('<g transform="translate(50 ' + cy + ') rotate(40)">' + arm + '</g><g transform="translate(50 ' + cy + ') rotate(-40)">' + arm + '</g>' + (two ? '<g transform="translate(50 84) scale(.42) rotate(40)">' + arm + '</g><g transform="translate(50 84) scale(.42) rotate(-40)">' + arm + '</g>' : "")); },
    aholi: function (t, end) { return svg('<rect x="3" y="3" width="194" height="74" rx="6" fill="' + WH + '" stroke="' + BLK + '" stroke-width="4"/><text x="100" y="50" font-size="26" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + BLK + '">' + t + '</text>' + (end ? '<path d="M14 66 L186 14" stroke="' + RED + '" stroke-width="7"/>' : ""), "0 0 200 80", "plate"); },
    jadval: function (t, p) { return svg('<rect x="3" y="3" width="194" height="84" rx="6" fill="' + WH + '" stroke="' + BLK + '" stroke-width="4"/>' + (p ? '<g transform="translate(20 6) scale(.78)">' + (P[p] ? P[p](BLK) : "") + '</g>' : "") + '<text x="' + (p ? 130 : 100) + '" y="56" font-size="28" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + BLK + '">' + t + '</text>', "0 0 200 90", "plate"); },
    ttext: function (t, fs) { return svg('<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + WH + '"/>' + txt(t, 50 + (fs || 14) * 0.36, fs || 14, BLK)); },
    kokParity: function (n) { var h = '<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + BLUE + '"/><path d="M24 24 L76 76" stroke="' + RED + '" stroke-width="9"/>'; h += n === 2 ? '<rect x="34" y="34" width="7" height="32" fill="' + WH + '"/><rect x="59" y="34" width="7" height="32" fill="' + WH + '"/>' : '<rect x="46" y="32" width="8" height="36" fill="' + WH + '"/>'; return svg(h); },
    bsonX: function (t) { return svg('<circle cx="50" cy="50" r="47" fill="' + BLUE + '"/>' + txt(t, 64, 38, WH) + '<path d="M22 78 L78 22" stroke="' + RED + '" stroke-width="7"/>'); },
    aholiKok: function (t, end) { return svg('<rect x="3" y="3" width="194" height="74" rx="6" fill="' + BLUE + '"/><rect x="8" y="8" width="184" height="64" rx="4" fill="none" stroke="' + WH + '" stroke-width="2"/><text x="100" y="50" font-size="26" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="' + WH + '">' + t + '</text>' + (end ? '<path d="M14 66 L186 14" stroke="' + RED + '" stroke-width="7"/>' : ""), "0 0 200 80", "plate"); },
    piyodaL: function () { return svg('<g transform="translate(100 0) scale(-1 1)">' + F.piyoda().replace(/^<svg[^>]*>|<\/svg>$/g, "") + '</g>'); },
    asosiyYol: function (dir) { var main = dir === "chap" ? "M100 86 V45 H40" : "M100 86 V45 H160", thin = "M40 45 H160 M100 45 V8"; return svg('<rect x="3" y="3" width="194" height="84" rx="6" fill="' + WH + '" stroke="' + BLK + '" stroke-width="4"/><path d="' + thin + '" stroke="' + BLK + '" stroke-width="4" fill="none"/><path d="' + main + '" stroke="' + BLK + '" stroke-width="11" fill="none"/>', "0 0 200 90", "plate"); },
    kokT: function (t, fs) { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + BLUE + '"/><rect x="6" y="6" width="88" height="88" rx="4" fill="none" stroke="' + WH + '" stroke-width="2"/>' + txt(t, 50 + (fs || 40) * 0.35, fs || 40, WH)); },
    zona: function (p) { return svg('<rect x="3" y="3" width="94" height="94" rx="6" fill="' + WH + '" stroke="' + BLK + '" stroke-width="3"/><g transform="translate(50 46) scale(.62) translate(-50 -50)">' + F.taqiqRaw(p) + '</g>' + txt("ZONA", 92, 15, BLK)); },
    taqiqRaw: function (p) { return '<circle cx="50" cy="50" r="47" fill="' + RED + '"/><circle cx="50" cy="50" r="37" fill="' + WH + '"/>' + (p === "P" ? '<circle cx="50" cy="50" r="37" fill="' + BLUE + '"/><path d="M24 24 L76 76" stroke="' + RED + '" stroke-width="9"/>' : txt(p, 64, 38, BLK)); }
  };

  // ---------- chizish retsepti: kod → ramka + parametrlar ----------
  // window.AT_BELGI_KATALOG: [{kod, nom, g (guruh 1–7), izoh, d: ["ramka", arg1, arg2]}]
  function draw(d) {
    if (!d) return null;
    var f = F[d[0]]; if (!f) return null;
    return f(d[1], d[2]);
  }
  var KAT = null, BYK = {};
  function kat() {
    if (KAT) return KAT;
    KAT = window.AT_BELGI_KATALOG || [];
    KAT.forEach(function (b) { BYK[b.kod] = b; });
    return KAT;
  }
  var GN = { 1: "Ogohlantiruvchi", 2: "Imtiyoz", 3: "Taqiqlovchi", 4: "Buyuruvchi", 5: "Axborot-ishora", 6: "Servis", 7: "Qo'shimcha axborot" };
  window.ATBelgi = {
    svg: function (kod) {
      kat();
      var b = BYK[kod];
      var s = b && draw(b.d);
      return s || svg('<rect x="3" y="3" width="94" height="94" rx="10" fill="#ddd"/>' + txt(String(kod), 60, 22, BLK));
    },
    nom: function (kod) { kat(); return BYK[kod] ? BYK[kod].nom : ""; },
    guruhlar: function () { var seen = {}, out = []; kat().forEach(function (b) { if (!seen[b.g]) { seen[b.g] = 1; out.push({ k: String(b.g), n: GN[b.g] || ("Guruh " + b.g) }); } }); return out; },
    royxat: function (g) { return kat().filter(function (b) { return String(b.g) === String(g); }); },
    _F: F, _P: P
  };
})();
