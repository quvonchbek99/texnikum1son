/*! Kuvonch Academy — qo'shimcha savol turlari (takrorlanmasligi uchun) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S || !S.fn) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle, fr = H.fr, gcd = H.gcd, ms = H.ms, par = H.par, poly = H.poly, nearW = H.nearW;
  function S2(x) { return typeof x === "number" ? ms(x) : String(x); }
  function Q(q, a, w, steps) { return { q: q, a: S2(a), w: w.map(S2), steps: steps || [], lang: S.lang() }; }
  // share(L): yangi generator ishlatilish ehtimoli. Xato bo'lsa yoki variantlar yetmasa — asl generator
  function aug(id, extra, share) {
    var base = S.fn(id); if (!base) return;
    S.register(id, function (L) {
      var p = null;
      if (Math.random() < share(L)) { try { p = extra(L); } catch (e) { p = null; } }
      if (p && (!p.w || p.w.length < 3)) p = null;
      return p || base(L);
    });
  }
  function sh(a, b, c) { return function (L) { return L === 1 ? a : L === 2 ? b : c; }; }
  // takrorlanmas noto'g'ri variantlar (javobga teng bo'lganlari tashlanadi)
  function W(a, list, n) {
    var out = [], seen = {}; seen[S2(a)] = 1;
    for (var i = 0; i < list.length && out.length < (n || 4); i++) {
      var s = S2(list[i]);
      if (s && !seen[s] && s !== "NaN" && s !== "undefined" && s !== "Infinity" && s !== "-Infinity") { seen[s] = 1; out.push(s); }
    }
    return out;
  }
  // qisqartirilgan kasr, minus "−" bilan
  function F(n, d) { if (!d) return ""; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; return (n < 0 ? "−" : "") + Math.abs(n) + (d === 1 ? "" : "/" + d); }
  function deg(d) { return ms(d) + "°"; }
  function dgs(d) { return (d < 0 ? "−" : "") + String(Math.abs(d)).replace(".", ",") + "°"; }
  // p/q·π ko'rinishida: 7π/6, −π/4, 2π
  function radF(p, q) {
    if (p === 0) return "0";
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q); p /= g; q /= g;
    return (p < 0 ? "−" : "") + (Math.abs(p) === 1 ? "" : Math.abs(p)) + "π" + (q === 1 ? "" : "/" + q);
  }
  function rad(d) { return radF(d, 180); }
  function piN(p, q) { var g = gcd(p, q); p /= g; q /= g; return (p === 1 ? "" : p) + "πn" + (q === 1 ? "" : "/" + q); }
  function ang(d, r) { return r ? rad(d) : deg(d); }

  /* ================= Trigonometriya: aniq qiymatlar jadvali ================= */
  var UND = "aniqlanmagan";
  var ANG = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  var SREF = { 0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1" };
  var TREF = { 0: "0", 30: "√3/3", 45: "1", 60: "√3" };
  var FN = ["sin", "cos", "tg", "ctg"];
  var CO = { sin: "cos", cos: "sin", tg: "ctg", ctg: "tg" };
  var VALS = ["0", "1/2", "√2/2", "√3/2", "1", "−1/2", "−√2/2", "−√3/2", "−1", "√3", "√3/3", "−√3", "−√3/3"];
  function nd(d) { d %= 360; return d < 0 ? d + 360 : d; }
  function isTab(d) { return ANG.indexOf(nd(d)) > -1; }
  function neg(v) { return v === "0" || v === UND ? v : v.charAt(0) === "−" ? v.slice(1) : "−" + v; }
  function sinV(d) {
    d = nd(d); var r, s = 1;
    if (d <= 90) r = d; else if (d <= 180) r = 180 - d; else if (d <= 270) { r = d - 180; s = -1; } else { r = 360 - d; s = -1; }
    var v = SREF[r]; return s < 0 ? neg(v) : v;
  }
  function cosV(d) { return sinV(90 - d); }
  function tgV(d) { var t = nd(d) % 180; if (t === 90) return UND; return t < 90 ? TREF[t] : neg(TREF[180 - t]); }
  function ctgV(d) { return tgV(90 - d); }
  function fV(fn, d) { return fn === "sin" ? sinV(d) : fn === "cos" ? cosV(d) : fn === "tg" ? tgV(d) : ctgV(d); }
  function fnum(fn, x) { return fn === "sin" ? Math.sin(x) : fn === "cos" ? Math.cos(x) : fn === "tg" ? Math.tan(x) : Math.cos(x) / Math.sin(x); }
  // qiymat satri → son (√2/2, −√3, 1/2 ...)
  function vNum(v) {
    if (v === UND) return NaN;
    var s = String(v).replace("−", "-"), sg = 1;
    if (s.charAt(0) === "-") { sg = -1; s = s.slice(1); }
    var m = /^(\d*)(√(\d+))?(?:\/(\d+))?$/.exec(s); if (!m) return NaN;
    var k = m[1] ? +m[1] : 1, r = m[3] ? Math.sqrt(+m[3]) : 1, d = m[4] ? +m[4] : 1;
    if (!m[1] && !m[2]) return NaN;
    return sg * k * r / d;
  }
  // qiymatning kvadrati (ratsional): [surat, maxraj]
  function vSq(v) { var x = vNum(v); x = x * x; for (var d = 1; d <= 12; d++) { var n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; }
  function vRat(v) { var x = vNum(v); for (var d = 1; d <= 4; d++) { var n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; }
  function togg(s) { return s.charAt(0) === "−" ? s.slice(1) : "−" + s; }
  // shu chorakdagi "ko'zgu" burchak qiymati (keltirilgan burchakni adashtirish xatosi)
  function mirV(fn, d) { var d0 = nd(d); if (d0 % 90 === 0) return neg(fV(fn, d)); var q = quad(d0); return fV(fn, 90 * (2 * q - 1) - d0); }
  function quad(d) { d = nd(d); return d < 90 ? 1 : d < 180 ? 2 : d < 270 ? 3 : 4; }
  var RIM = ["", "I", "II", "III", "IV"];
  function tf(fn, a, r) { // "sin 210°", "cos(−45°)", "tg(7π/6)"
    var s = ang(a, r); return fn + (r || a < 0 ? "(" + s + ")" : " " + s);
  }
  // qiymat uchun noto'g'ri variantlar: ishorasi teskari, ko-funksiya qiymati va h.k.
  function wVal(a, alts) {
    var l = [neg(a)].concat(alts || []).concat(SV.indexOf(a) > -1 ? shuffle(SV).concat(shuffle(TV)) : shuffle(TV).concat(shuffle(SV)));
    if (a === UND) l = ["0", "1", "−1"].concat(shuffle(VALS));
    return W(a, l, 4);
  }
  function valSteps(fn, d, r) {
    var d0 = nd(d), v = fV(fn, d), st = [];
    if (d0 !== d) st.push((fn === "tg" || fn === "ctg") && d % 180 !== d0 % 180 ? "Davriylik" : "Davriylik: " + tf(fn, d, r) + " = " + tf(fn, d0, r));
    if (d0 % 90 === 0) st.push("Jadval qiymati: " + tf(fn, d0, r) + " = " + v);
    else {
      var q = quad(d0), ref = q === 1 ? d0 : q === 2 ? 180 - d0 : q === 3 ? d0 - 180 : 360 - d0;
      st.push(ang(d0, r) + " — " + RIM[q] + " chorak, keltirilgan burchak " + ang(ref, r));
      st.push(tf(fn, d0, r) + " = " + v);
    }
    return st;
  }
  // teskari funksiyalar (gradusda)
  function arcD(fn, v) {
    var c = fn === "sin" ? [-90, -60, -45, -30, 0, 30, 45, 60, 90] : fn === "cos" ? [0, 30, 45, 60, 90, 120, 135, 150, 180]
      : fn === "tg" ? [-60, -45, -30, 0, 30, 45, 60] : [30, 45, 60, 90, 120, 135, 150];
    for (var i = 0; i < c.length; i++) if (fV(fn, c[i]) === v) return c[i];
    return null;
  }
  var SV = ["−1", "−√3/2", "−√2/2", "−1/2", "0", "1/2", "√2/2", "√3/2", "1"];
  var TV = ["−√3", "−1", "−√3/3", "0", "√3/3", "1", "√3"];
  var TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10]];
  function tri() { var t = pick(TRI); return Math.random() < .5 ? t : [t[1], t[0], t[2]]; }
  var QIV = [null, ["(0°; 90°)", "(0; π/2)"], ["(90°; 180°)", "(π/2; π)"], ["(180°; 270°)", "(π; 3π/2)"], ["(270°; 360°)", "(3π/2; 2π)"]];
  var QS = { 1: [1, 1], 2: [1, -1], 3: [-1, -1], 4: [-1, 1] }; // [sin ishorasi, cos ishorasi]
  function lin2(a, A, b, B) { // a·A + b·B (koeffitsiyent 1 bo'lsa yozilmaydi)
    function c(k, t, first) { var s = t === "" ? String(Math.abs(k)) : Math.abs(k) === 1 ? t : Math.abs(k) + t; return first ? (k < 0 ? "−" : "") + s : (k < 0 ? " − " : " + ") + s; }
    return c(a, A, true) + c(b, B, false);
  }

  /* ---------- t68: asosiy ayniyatlar va keltirish formulalari ---------- */
  var SHIFT = [null, ["90°", "π/2"], ["180°", "π"], ["270°", "3π/2"], ["360°", "2π"]];
  function redArg(k, s, r) { return k === 0 ? "−α" : SHIFT[k][r ? 1 : 0] + (s > 0 ? " + α" : " − α"); }
  function redRes(fn, k, s) { // fn(k·90° ± α) = [ishora, funksiya]
    var g = k % 2 ? CO[fn] : fn, th = (90 * k + s * 20) * Math.PI / 180;
    return [fnum(fn, th) / fnum(g, 20 * Math.PI / 180) > 0 ? 1 : -1, g];
  }
  function redPick() { var k = R(0, 4), s = k === 0 ? -1 : pick([1, -1]); return [k, s]; }
  function combStr(m) {
    var out = "";
    ["sin", "cos", "tg", "ctg"].forEach(function (g) {
      var c = m[g]; if (!c) return;
      var t = (Math.abs(c) === 1 ? "" : Math.abs(c)) + g + " α";
      out += out ? (c < 0 ? " − " : " + ") + t : (c < 0 ? "−" : "") + t;
    });
    return out || "0";
  }
  var IDS = [
    ["1 − sin²α", "cos²α", ["sin²α", "−cos²α", "1 + cos²α"]], ["1 − cos²α", "sin²α", ["cos²α", "−sin²α", "1 + sin²α"]],
    ["sin²α − 1", "−cos²α", ["cos²α", "sin²α", "−sin²α"]], ["cos²α − 1", "−sin²α", ["sin²α", "−cos²α", "cos²α"]],
    ["tg α · ctg α", "1", ["0", "tg²α", "−1"]], ["1 + tg²α", "1/cos²α", ["1/sin²α", "ctg²α", "cos²α"]],
    ["1 + ctg²α", "1/sin²α", ["1/cos²α", "tg²α", "sin²α"]], ["tg α · cos α", "sin α", ["cos α", "1", "ctg α"]],
    ["ctg α · sin α", "cos α", ["sin α", "1", "tg α"]], ["(1 − cos²α)/cos²α", "tg²α", ["ctg²α", "sin²α", "1"]],
    ["(1 − sin²α)/sin²α", "ctg²α", ["tg²α", "cos²α", "1"]], ["(sin α + cos α)² − 2sin α cos α", "1", ["0", "2", "sin 2α"]],
    ["(sin α + cos α)² + (sin α − cos α)²", "2", ["1", "0", "4sin α cos α"]], ["1/cos²α − 1", "tg²α", ["ctg²α", "sin²α", "1"]],
    ["1/sin²α − 1", "ctg²α", ["tg²α", "cos²α", "1"]], ["sin α / tg α", "cos α", ["sin α", "1", "ctg α"]],
    ["cos α / ctg α", "sin α", ["cos α", "1", "tg α"]], ["cos²α · tg²α + cos²α", "1", ["cos²α", "sin²α", "2"]],
    ["sin²α · ctg²α + sin²α", "1", ["sin²α", "cos²α", "2"]], ["(1 − sin α)(1 + sin α)", "cos²α", ["sin²α", "1", "−cos²α"]],
    ["(1 − cos α)(1 + cos α)", "sin²α", ["cos²α", "1", "−sin²α"]], ["sin⁴α − cos⁴α + cos²α", "sin²α", ["cos²α", "1", "2sin²α"]],
    ["(tg α + ctg α) · sin α cos α", "1", ["2", "0", "tg α"]], ["sin²α + cos²α + tg²α", "1/cos²α", ["1/sin²α", "1 + ctg²α", "2"]]
  ];
  var FORM = [
    ["cos 2α ni cos α orqali yozing.", "2cos²α − 1", ["1 − 2cos²α", "2cos²α + 1", "cos²α − 1"]],
    ["cos 2α ni sin α va cos α orqali yozing.", "cos²α − sin²α", ["sin²α − cos²α", "2sin α cos α", "cos²α + sin²α"]],
    ["tg 2α formulasini yozing.", "2tg α/(1 − tg²α)", ["2tg α/(1 + tg²α)", "tg²α − 1", "2tg α"]],
    ["sin²α ni cos 2α orqali ifodalang.", "(1 − cos 2α)/2", ["(1 + cos 2α)/2", "1 − cos 2α", "(cos 2α − 1)/2"]],
    ["cos²α ni cos 2α orqali ifodalang.", "(1 + cos 2α)/2", ["(1 − cos 2α)/2", "1 + cos 2α", "(cos 2α − 1)/2"]],
    ["sin(α + β) formulasini yozing.", "sin α cos β + cos α sin β", ["sin α cos β − cos α sin β", "cos α cos β − sin α sin β", "sin α sin β + cos α cos β"]],
    ["sin(α − β) formulasini yozing.", "sin α cos β − cos α sin β", ["sin α cos β + cos α sin β", "cos α cos β + sin α sin β", "sin α sin β − cos α cos β"]],
    ["cos(α + β) formulasini yozing.", "cos α cos β − sin α sin β", ["cos α cos β + sin α sin β", "sin α cos β + cos α sin β", "sin α sin β − cos α cos β"]],
    ["cos(α − β) formulasini yozing.", "cos α cos β + sin α sin β", ["cos α cos β − sin α sin β", "sin α cos β − cos α sin β", "sin α sin β − cos α cos β"]],
    ["sin α + sin β ni ko'paytmaga keltiring.", "2sin((α+β)/2)·cos((α−β)/2)", ["2cos((α+β)/2)·cos((α−β)/2)", "2sin((α+β)/2)·sin((α−β)/2)", "sin(α+β)"]],
    ["cos α + cos β ni ko'paytmaga keltiring.", "2cos((α+β)/2)·cos((α−β)/2)", ["2sin((α+β)/2)·cos((α−β)/2)", "−2sin((α+β)/2)·sin((α−β)/2)", "cos(α+β)"]],
    ["sin 3α ni sin α orqali yozing.", "3sin α − 4sin³α", ["4sin³α − 3sin α", "3sin α", "3sin α + 4sin³α"]]
  ];
  function t68x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 1, 2] : L === 2 ? [0, 3, 3, 4, 4] : [3, 4, 5, 5, 6, 6, 7]);
    if (k === 0) { // keltirish formulasi
      var fn = pick(FN), rp = redPick(), r = Math.random() < .5, res = redRes(fn, rp[0], rp[1]);
      var a = (res[0] < 0 ? "−" : "") + res[1] + " α", g2 = res[1] === fn ? CO[fn] : fn;
      var arg = redArg(rp[0], rp[1], r);
      return Q("Soddalashtiring: " + fn + "(" + arg + ")", a, W(a, [(res[0] < 0 ? "" : "−") + res[1] + " α", (res[0] < 0 ? "−" : "") + g2 + " α", (res[0] < 0 ? "" : "−") + g2 + " α"]),
        [rp[0] % 2 ? SHIFT[rp[0]][r ? 1 : 0] + " — funksiya nomi o'zgaradi: " + fn + " → " + res[1] : "Funksiya nomi o'zgarmaydi", "α o'tkir deb olsak, " + fn + "(" + arg + ") ishorasi: " + (res[0] < 0 ? "−" : "+"), "Javob: " + a]);
    }
    if (k === 1) { var it = pick(IDS);
      return Q("Soddalashtiring: " + it[0], it[1], it[2], ["sin²α + cos²α = 1, tg α = sin α/cos α", "Javob: " + it[1]]); }
    if (k === 2) { var n = R(2, 9), m = R(1, 9), kind = R(0, 2);
      if (kind === 0) return Q("Hisoblang: " + n + "sin²α + " + m + " + " + n + "cos²α", n + m, W(n + m, [2 * n + m, n, m, n + m + 1, n * m]), [n + "(sin²α + cos²α) + " + m + " = " + n + " + " + m + " = " + (n + m)]);
      if (kind === 1) return Q("Hisoblang: " + n + "·tg α·ctg α − " + m, n - m, W(n - m, [n, n + m, -m, n - m - 1, n * m - m]), ["tg α·ctg α = 1", n + "·1 − " + m + " = " + (n - m)]);
      return Q("Hisoblang: " + n + " − " + n + "sin²α − " + n + "cos²α + " + m, m, W(m, [n + m, 2 * n + m, m - n, m + 1]), [n + " − " + n + "(sin²α + cos²α) + " + m, "= " + n + " − " + n + " + " + m + " = " + m]);
    }
    if (k === 3) { // ikki hadli keltirish
      var f1 = pick(["sin", "cos"]), f2 = pick(["sin", "cos"]), p1 = redPick(), p2 = redPick(), op = pick([1, -1]), rr = L === 3 && Math.random() < .6;
      if (p1[0] === p2[0] && p1[1] === p2[1] && f1 === f2) p2 = [(p1[0] + 1) % 5, p1[0] + 1 === 5 ? -1 : 1];
      if (p2[0] === 0) p2[1] = -1;
      var r1 = redRes(f1, p1[0], p1[1]), r2 = redRes(f2, p2[0], p2[1]);
      var mk = function (s1, g1, s2, g2) { var m2 = {}; m2[g1] = (m2[g1] || 0) + s1; m2[g2] = (m2[g2] || 0) + op * s2; return combStr(m2); };
      var ans = mk(r1[0], r1[1], r2[0], r2[1]);
      var e = f1 + "(" + redArg(p1[0], p1[1], rr) + ") " + (op > 0 ? "+" : "−") + " " + f2 + "(" + redArg(p2[0], p2[1], rr) + ")";
      return Q("Soddalashtiring: " + e, ans, W(ans, [mk(-r1[0], r1[1], r2[0], r2[1]), mk(r1[0], r1[1], -r2[0], r2[1]), mk(r1[0], f1, r2[0], f2), mk(-r1[0], r1[1], -r2[0], r2[1]), mk(r1[0], CO[r1[1]], r2[0], r2[1]), "0", "2sin α", "2cos α"]),
        [f1 + "(" + redArg(p1[0], p1[1], rr) + ") = " + (r1[0] < 0 ? "−" : "") + r1[1] + " α", f2 + "(" + redArg(p2[0], p2[1], rr) + ") = " + (r2[0] < 0 ? "−" : "") + r2[1] + " α", "Javob: " + ans]);
    }
    if (k === 4) { // ixtiyoriy burchakning qiymati
      var fn4 = pick(FN), d = pick(ANG.slice(5)), r4 = L === 3 && Math.random() < .5;
      var form = R(0, 2); if (form === 1) d = d + 360 * R(1, 2); if (form === 2) d = -pick(ANG.slice(1));
      var v = fV(fn4, d);
      if (v === UND) { fn4 = fn4 === "tg" ? "sin" : "cos"; v = fV(fn4, d); }
      return Q(tf(fn4, d, r4) + " ni hisoblang.", v, wVal(v, [fV(CO[fn4], d), mirV(fn4, d)]), valSteps(fn4, d, r4));
    }
    if (k === 5) { // ikkilangan burchak va qo'shish formulalari (son)
      var kind5 = R(0, 3);
      if (kind5 < 2) {
        var th = pick([15, 75, 105, 165, 22.5, 67.5, 112.5, 157.5]), f5 = R(0, 3), t2 = 2 * th, tS = dgs(th);
        var ex = ["2sin " + tS + "·cos " + tS, "cos²" + tS + " − sin²" + tS, "1 − 2sin²" + tS, "2cos²" + tS + " − 1"][f5];
        var res5 = f5 === 0 ? sinV(t2) : cosV(t2);
        return Q("Hisoblang: " + ex, res5, wVal(res5, [f5 === 0 ? cosV(t2) : sinV(t2), mirV(f5 === 0 ? "sin" : "cos", t2)]),
          [f5 === 0 ? "2sin α cos α = sin 2α" : "Ikkilangan burchak: cos 2α", "= " + (f5 === 0 ? "sin " : "cos ") + dgs(t2) + " = " + res5]);
      }
      var T = pick([30, 45, 60, 90, 120, 135, 150]), f6 = R(0, 3), B = pick([5, 10, 12, 15, 18, 20, 25, 35, 40, 50, 55]);
      var A = f6 % 2 === 0 ? T - B : T + B; if (A <= 0) { A = T + B; f6 = f6 === 0 ? 1 : 3; }
      var tt = f6 % 2 === 0 ? A + B : A - B;
      var exs = ["sin " + A + "°·cos " + B + "° + cos " + A + "°·sin " + B + "°", "sin " + A + "°·cos " + B + "° − cos " + A + "°·sin " + B + "°",
        "cos " + A + "°·cos " + B + "° − sin " + A + "°·sin " + B + "°", "cos " + A + "°·cos " + B + "° + sin " + A + "°·sin " + B + "°"][f6];
      var isS = f6 < 2, res6 = isS ? sinV(tt) : cosV(tt);
      return Q("Hisoblang: " + exs, res6, wVal(res6, [isS ? cosV(tt) : sinV(tt), mirV(isS ? "sin" : "cos", tt)]),
        [isS ? (f6 === 0 ? "sin(α + β)" : "sin(α − β)") + " formulasi" : (f6 === 2 ? "cos(α + β)" : "cos(α − β)") + " formulasi", "= " + (isS ? "sin " : "cos ") + tt + "° = " + res6]);
    }
    if (k === 6) { // nisbat
      var g1 = pick(["sin", "cos"]), g2b = pick(["sin", "cos"]), q1 = redPick(), q2 = redPick(), rq = Math.random() < .5;
      var s1 = redRes(g1, q1[0], q1[1]), s2 = redRes(g2b, q2[0], q2[1]), sg = s1[0] * s2[0];
      var core = s1[1] === s2[1] ? "1" : s1[1] === "sin" ? "tg α" : "ctg α", ans6 = sg < 0 ? (core === "1" ? "−1" : "−" + core) : core;
      return Q("Soddalashtiring: " + g1 + "(" + redArg(q1[0], q1[1], rq) + ") / " + g2b + "(" + redArg(q2[0], q2[1], rq) + ")", ans6,
        W(ans6, [togg(ans6)].concat(shuffle(["1", "tg α", "ctg α"].filter(function (c) { return c !== core; })).map(function (c) { return sg < 0 ? "−" + c : c; }), ["1", "−1", "tg α", "−tg α", "ctg α", "−ctg α"])),
        [g1 + "(" + redArg(q1[0], q1[1], rq) + ") = " + (s1[0] < 0 ? "−" : "") + s1[1] + " α", g2b + "(" + redArg(q2[0], q2[1], rq) + ") = " + (s2[0] < 0 ? "−" : "") + s2[1] + " α", "Javob: " + ans6]);
    }
    var it7 = pick(FORM);
    return Q(it7[0], it7[1], it7[2], ["Formula: " + it7[1]]);
  }

  /* ---------- t3: trigonometrik ayniyatlar (chorak ishorasi bilan) ---------- */
  function t3x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [0, 3, 3, 3, 2] : [3, 4, 4, 5, 5, 6, 7]);
    var t, q, rr, sS, sC, given, val, target, ans, sinF, cosF, tgF, ctgF;
    function setup(qd) {
      t = tri(); q = qd; rr = Math.random() < .5; sS = QS[q][0]; sC = QS[q][1];
      sinF = F(sS * t[0], t[2]); cosF = F(sC * t[1], t[2]); tgF = F(sS * sC * t[0], t[1]); ctgF = F(sS * sC * t[1], t[0]);
    }
    function V(f) { return f === "sin" ? sinF : f === "cos" ? cosF : f === "tg" ? tgF : ctgF; }
    if (k === 0 || k === 3) {
      setup(k === 0 ? 1 : R(1, 4)); given = pick(["sin", "cos"]); target = pick(FN.filter(function (f) { return f !== given; }));
      if (k === 0 && Math.random() < .5) rr = true;
      ans = V(target);
      var wr = [neg(ans), F(t[2], t[1]), V(CO[target]), neg(V(CO[target])), F(sS * t[1], t[0]), F(t[0], t[1])];
      if (target === "tg" || target === "ctg") wr.unshift(target === "tg" ? ctgF : tgF);
      return Q(given + " α = " + V(given) + ", α ∈ " + QIV[q][rr ? 1 : 0] + ". " + target + " α ni toping.", ans, W(ans, wr),
        [given === "sin" ? "cos²α = 1 − sin²α = " + F(t[1] * t[1], t[2] * t[2]) : "sin²α = 1 − cos²α = " + F(t[0] * t[0], t[2] * t[2]),
          RIM[q] + " chorakda: sin " + (sS > 0 ? "> 0" : "< 0") + ", cos " + (sC > 0 ? "> 0" : "< 0"), target + " α = " + ans]);
    }
    if (k === 1) { var n = R(2, 9), m = R(1, 9), A = R(1, 89), c = R(0, 1);
      if (c === 0) return Q("Hisoblang: " + n + "sin²" + A + "° + " + n + "cos²" + A + "° − " + m, n - m, W(n - m, [n, n + m, 2 * n - m, n - m + 1, -m]), ["sin²α + cos²α = 1", n + " − " + m + " = " + (n - m)]);
      return Q("Hisoblang: " + n + "·tg " + A + "°·ctg " + A + "° + " + m, n + m, W(n + m, [n, m, n * m, n + m + 1, n - m]), ["tg α·ctg α = 1", n + " + " + m + " = " + (n + m)]); }
    if (k === 2) { setup(1); target = pick(["tg", "ctg"]);
      var gv = pick(["sin", "cos"]);
      ans = V(target);
      return Q(gv + " α = " + V(gv) + " (α — o'tkir burchak). " + target + " α ni toping.", ans, W(ans, [target === "tg" ? ctgF : tgF, sinF, cosF, neg(ans), F(t[2], t[0])]),
        [(gv === "sin" ? "cos α = " + cosF : "sin α = " + sinF), "tg α = sin α/cos α = " + tgF + (target === "ctg" ? ", ctg α = 1/tg α = " + ctgF : "")]); }
    if (k === 4) { // tg berilgan
      setup(R(1, 4)); given = pick(["tg", "ctg"]); target = pick(["sin", "cos"]); ans = V(target);
      return Q(given + " α = " + V(given) + ", α ∈ " + QIV[q][rr ? 1 : 0] + ". " + target + " α ni toping.", ans, W(ans, [neg(ans), V(CO[target]), neg(V(CO[target])), F(t[2], t[1]), F(t[1], t[0])]),
        [given === "tg" ? "1 + tg²α = 1/cos²α → cos²α = " + F(t[1] * t[1], t[2] * t[2]) : "1 + ctg²α = 1/sin²α → sin²α = " + F(t[0] * t[0], t[2] * t[2]),
          RIM[q] + " chorakda: sin " + (sS > 0 ? "> 0" : "< 0") + ", cos " + (sC > 0 ? "> 0" : "< 0"), target + " α = " + ans]);
    }
    if (k === 5) { // (a sin + b cos)/(c sin + d cos), tg berilgan
      var p = RNZ(-5, 5), qq = pick([1, 1, 2, 3, 4]); if (gcd(p, qq) !== 1) qq = 1;
      var a = RNZ(-4, 4), b = RNZ(-5, 5), c2 = RNZ(-4, 4), d = RNZ(-5, 5), den = c2 * p + d * qq;
      if (den === 0 || a * p + b * qq === 0) return null;
      ans = F(a * p + b * qq, den);
      return Q("tg α = " + F(p, qq) + " bo'lsa, (" + lin2(a, "sin α", b, "cos α") + ")/(" + lin2(c2, "sin α", d, "cos α") + ") ni hisoblang.", ans,
        W(ans, [F(a * qq + b * p, c2 * qq + d * p), F(den, a * p + b * qq), neg(ans), F(a * p - b * qq, c2 * p - d * qq), F(a + b, c2 + d)]),
        ["Surat va maxrajni cos α ga bo'lamiz", "(" + lin2(a, "tg α", b, "") + ")/(" + lin2(c2, "tg α", d, "") + ")", "= " + ans]);
    }
    if (k === 6) { // sin α + cos α = p → sin α cos α
      var pr = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [1, 5], [4, 5], [6, 5], [7, 5], [5, 4], [4, 3], [7, 6], [2, 5], [3, 5]]), sgn = pick([1, -1]), mn = pick([1, -1]);
      var pm = sgn * pr[0], pn = pr[1], plus = mn > 0;
      ans = plus ? F(pm * pm - pn * pn, 2 * pn * pn) : F(pn * pn - pm * pm, 2 * pn * pn);
      return Q("sin α " + (plus ? "+" : "−") + " cos α = " + F(pm, pn) + " bo'lsa, sin α · cos α ni toping.", ans,
        W(ans, [neg(ans), F(pm * pm - pn * pn, pn * pn), plus ? F(pn * pn - pm * pm, 2 * pn * pn) : F(pm * pm - pn * pn, 2 * pn * pn), F(pm * pm, 2 * pn * pn), F(pm * pm + pn * pn, 2 * pn * pn)]),
        ["Kvadratga oshiramiz: 1 " + (plus ? "+" : "−") + " 2sin α cos α = " + F(pm * pm, pn * pn), "sin α cos α = " + ans]);
    }
    // tg α berilgan → sin α·cos α = t/(1 + t²)
    var p7 = RNZ(-6, 6), q7 = pick([1, 1, 2, 3, 5]); if (gcd(p7, q7) !== 1) q7 = 1;
    ans = F(p7 * q7, p7 * p7 + q7 * q7);
    return Q("tg α = " + F(p7, q7) + " bo'lsa, sin α · cos α ni toping.", ans,
      W(ans, [neg(ans), F(p7 * q7, q7 * q7 - p7 * p7 || 1), F(p7, q7), F(q7 * q7, p7 * p7 + q7 * q7), F(2 * p7 * q7, p7 * p7 + q7 * q7)]),
      ["sin α cos α = (sin α cos α)/(sin²α + cos²α) = tg α/(1 + tg²α)", "= " + F(p7, q7) + " : (1 + " + F(p7 * p7, q7 * q7) + ") = " + ans]);
  }

  /* ---------- t29: trigonometrik funksiyalar ---------- */
  var SUPN = { 2: "²", 3: "³" };
  function t29x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 2, 5] : L === 2 ? [2, 3, 3, 4, 4, 5] : [2, 3, 5, 6, 6, 7, 7]);
    if (k === 0) { // gradus → radian
      var d = pick([15, 18, 20, 36, 40, 72, 10, 12]) * R(1, 18); if (d % 360 === 0 || d > 720) d = pick([150, 210, 240, 300, 330, 135, 225, 315]);
      var a = rad(d);
      return Q(d + "° ni radianda ifodalang.", a, W(a, [radF(d, 360), rad(d + 30), rad(d + 15 * RNZ(-2, 2)), rad(180 - d || 90), radF(d, 90)]),
        ["1° = π/180 radian", d + "° = " + d + "π/180 = " + a]);
    }
    if (k === 1) { // radian → gradus
      var m = pick([2, 3, 4, 5, 6, 9, 10, 12, 18]), n = R(1, 2 * m); while (gcd(n, m) !== 1) n++;
      var dd = 180 * n / m;
      return Q(radF(n, m) + " radian necha gradus?", deg(dd), W(deg(dd), [deg(360 * n / m), deg(dd + 30), deg(90 * n / m), deg(Math.abs(180 - dd) || 360), deg(dd - 15)].filter(function (x) { return /^\d+°$/.test(x); })),
        ["π radian = 180°", radF(n, m) + " = " + n + "·180°/" + m + " = " + dd + "°"]);
    }
    if (k === 2) { // chorak
      var dq, txt;
      if (L === 1) { do { dq = R(1, 359); } while (dq % 90 === 0); txt = dq + "°"; }
      else if (L === 2) { do { dq = R(-720, 1440); } while (dq % 90 === 0 || (dq > 0 && dq < 360)); txt = deg(dq); }
      else { var mm = pick([3, 4, 5, 6, 7, 8, 9, 10, 12]), nn; do { nn = RNZ(-4 * mm, 4 * mm); } while ((2 * nn) % mm === 0 || gcd(nn, mm) !== 1); dq = 180 * nn / mm; txt = radF(nn, mm); }
      var qq = quad(dq), ans = RIM[qq] + " chorak", red = ((dq % 360) + 360) % 360;
      return Q(txt + " burchak qaysi chorakda yotadi?", ans, W(ans, shuffle(["I chorak", "II chorak", "III chorak", "IV chorak"])),
        [L === 1 ? "I: 0°–90°, II: 90°–180°, III: 180°–270°, IV: 270°–360°" : "360° ga karrali qismini tashlaymiz: " + txt + " → " + String(Math.round(red * 100) / 100).replace(".", ",") + "°", "Javob: " + ans]);
    }
    if (k === 3) { // davr
      var fn = pick(["sin", "cos", "tg", "ctg", "sin", "cos"]), tp = fn === "sin" || fn === "cos" ? 2 : 1, A = pick([1, 2, 3, 5, -2]), kk, argS, Tp, Tq;
      if (Math.random() < .75) { kk = R(2, 9); var b = R(-5, 5); argS = kk + "x" + (b > 0 ? " + " + b : b < 0 ? " − " + (-b) : ""); Tp = tp; Tq = kk; }
      else { kk = R(2, 5); argS = "x/" + kk; Tp = tp * kk; Tq = 1; }
      var T = radF(Tp, Tq), co = A === 1 ? "" : A === -1 ? "−" : ms(A);
      return Q("y = " + co + fn + "(" + argS + ") funksiyaning eng kichik musbat davrini toping.", T,
        W(T, [radF(3 - tp, Tq) === T ? radF(4, Tq) : radF(tp === 2 ? 1 : 2, Tq * (tp === 2 ? 1 : 1)) , radF(tp * (Tq === 1 ? 1 : Tq), Tq === 1 ? kk * kk : 1), radF(tp, 1), radF(2 * Tp, Tq), radF(Tp, 2 * Tq)]),
        [fn + " ning asosiy davri " + (tp === 2 ? "2π" : "π"), "T = " + (tp === 2 ? "2π" : "π") + " : |k|, bu yerda k = " + (Tq === 1 ? "1/" + kk : kk), "T = " + T]);
    }
    if (k === 4) { // qiymatlar sohasi
      var f4 = pick(["sin", "cos"]), A4 = RNZ(-6, 6), B4 = R(-7, 7), lo = B4 - Math.abs(A4), hi = B4 + Math.abs(A4);
      var co4 = A4 === 1 ? "" : A4 === -1 ? "−" : ms(A4), e = "y = " + co4 + f4 + " x" + (B4 > 0 ? " + " + B4 : B4 < 0 ? " − " + (-B4) : "");
      function iv(x, y) { return "[" + ms(x) + "; " + ms(y) + "]"; }
      var a4 = iv(lo, hi);
      return Q(e + " funksiyaning qiymatlar sohasini toping.", a4, W(a4, [iv(B4 - 1, B4 + 1), iv(-Math.abs(A4), Math.abs(A4)), iv(Math.min(-B4 - Math.abs(A4), -B4 + Math.abs(A4)), -B4 + Math.abs(A4)), iv(Math.min(B4, hi), Math.max(B4, hi)), iv(lo - 1, hi + 1), iv(-1, 1)]),
        ["−1 ≤ " + f4 + " x ≤ 1", "y ∈ [" + ms(B4) + " − " + Math.abs(A4) + "; " + ms(B4) + " + " + Math.abs(A4) + "]", "E(y) = " + a4]);
    }
    if (k === 5) { // f(x0) qiymati
      var f5 = pick(["sin", "cos"]), A5 = RNZ(-5, 5), B5 = R(-6, 6), d5, rv, kk5 = L === 3 ? pick([1, 2, 3]) : 1, tries = 0;
      do { d5 = pick(ANG); rv = vRat(fV(f5, kk5 * d5)); } while ((!rv || (L > 1 && d5 === 0)) && tries++ < 40);
      if (!rv) return null;
      var num = A5 * rv[0] + B5 * rv[1], ans5 = F(num, rv[1]);
      var co5 = A5 === 1 ? "" : A5 === -1 ? "−" : ms(A5), arg5 = kk5 === 1 ? "x" : kk5 + "x";
      return Q("f(x) = " + co5 + f5 + " " + arg5 + (B5 > 0 ? " + " + B5 : B5 < 0 ? " − " + (-B5) : "") + " bo'lsa, f(" + rad(d5) + ") ni toping.", ans5,
        W(ans5, [F(-A5 * rv[0] + B5 * rv[1], rv[1]), F(A5 * rv[0], rv[1]), F(num + rv[1], rv[1]), F(A5 * (vRat(fV(CO[f5], kk5 * d5)) || [0, 1])[0] * rv[1] / ((vRat(fV(CO[f5], kk5 * d5)) || [0, 1])[1]) + B5 * rv[1], rv[1]), F(num - rv[1], rv[1])]),
        [f5 + " " + (kk5 === 1 ? rad(d5) : rad(kk5 * d5)) + " = " + fV(f5, kk5 * d5), "f = " + ms(A5) + "·" + par(+0) .replace("0", fV(f5, kk5 * d5)) + (B5 >= 0 ? " + " + B5 : " − " + (-B5)) + " = " + ans5]);
    }
    if (k === 6) { // a sin x + b cos x eng katta / kichik qiymati
      var tr = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15]]), sw = Math.random() < .5;
      var a6 = (sw ? tr[1] : tr[0]) * pick([1, -1]), b6 = (sw ? tr[0] : tr[1]) * pick([1, -1]), c6 = R(-6, 6), mx = Math.random() < .5;
      var res6 = mx ? tr[2] + c6 : c6 - tr[2];
      var e6 = "y = " + lin2(a6, "sin x", b6, "cos x") + (c6 > 0 ? " + " + c6 : c6 < 0 ? " − " + (-c6) : "");
      return Q(e6 + " funksiyaning eng " + (mx ? "katta" : "kichik") + " qiymatini toping.", res6,
        W(res6, [mx ? Math.abs(a6) + Math.abs(b6) + c6 : c6 - Math.abs(a6) - Math.abs(b6), mx ? c6 - tr[2] : c6 + tr[2], mx ? tr[2] : -tr[2], mx ? 1 + c6 : c6 - 1, mx ? tr[2] + c6 + 1 : c6 - tr[2] - 1]),
        ["a sin x + b cos x ning qiymatlari [−√(a² + b²); √(a² + b²)] oralig'ida", "√(" + a6 * a6 + " + " + b6 * b6 + ") = " + tr[2], "Javob: " + ms(res6)]);
    }
    // juft-toqlik
    function term() {
      var n = R(0, 3), f = pick(["sin x", "cos x", "tg x", "", "sin x", "cos x"]), c = pick([1, 1, 2, 3, 4, 5]);
      if (!n && !f) f = "cos x";
      var str = (c === 1 ? "" : c) + (n ? "x" + (SUPN[n] || "") : "") + (f ? ((n || c !== 1) ? "·" : "") + f : "");
      return [str, (n % 2 + (f === "sin x" || f === "tg x" ? 1 : 0)) % 2];
    }
    var t1 = term(), two = Math.random() < .55, t2 = two ? term() : null, par7;
    if (two && t2[0] === t1[0]) t2 = ["x" + (t1[1] ? "²" : "³"), t1[1] ? 0 : 1];
    if (!two) par7 = t1[1]; else par7 = t1[1] === t2[1] ? t1[1] : 2;
    var labs = ["juft", "toq", "juft ham, toq ham emas"], ans7 = labs[par7];
    return Q("y = " + t1[0] + (two ? (Math.random() < .5 ? " + " : " − ") + t2[0] : "") + " funksiya juftmi yoki toqmi?", ans7, W(ans7, labs.concat(["ham juft, ham toq"])),
      ["f(−x) ni tekshiramiz: x, sin x, tg x — toq; cos x, x², o'zgarmas — juft", two && par7 === 2 ? "Juft va toq qo'shiluvchilar yig'indisi — umumiy ko'rinishdagi funksiya" : "Ko'paytmada toq ko'paytuvchilar soni juft bo'lsa — juft, toq bo'lsa — toq", "Javob: " + ans7]);
  }

  /* ---------- t30: teskari trigonometrik funksiyalar ---------- */
  var ARC = { sin: "arcsin", cos: "arccos", tg: "arctg", ctg: "arcctg" };
  function arcW(fn, d, r) {
    var c = [-d, 90 - d, 180 - d, d - 90, d + 90, 2 * d, d - 180, 90 + d].filter(function (x) { return Math.abs(x) <= 180; });
    return W(ang(d, r), c.map(function (x) { return ang(x, r); }));
  }
  function t30x(L) {
    var k = pick(L === 1 ? [0, 0, 5, 5] : L === 2 ? [0, 1, 1, 4, 5] : [1, 2, 2, 3, 3, 4]);
    if (k === 0) { // arc qiymatlari
      var fn = pick(FN), pool = fn === "sin" || fn === "cos" ? SV : TV.concat(fn === "ctg" ? [] : []), v, r = Math.random() < .6;
      if (L === 1) pool = pool.filter(function (x) { return x.charAt(0) !== "−"; });
      else pool = pool.filter(function (x) { return x.charAt(0) === "−" || Math.random() < .3; });
      v = pick(pool); var d = arcD(fn, v); if (d === null) return null;
      var a = ang(d, r);
      return Q(ARC[fn] + "(" + v + ") ni " + (r ? "radianda" : "gradusda") + " toping.", a, arcW(fn, d, r),
        [ARC[fn] + " qiymatlari sohasi: " + (fn === "sin" ? "[−π/2; π/2]" : fn === "cos" ? "[0; π]" : fn === "tg" ? "(−π/2; π/2)" : "(0; π)"), tf(fn, d, r) + " = " + v, ARC[fn] + "(" + v + ") = " + a]);
    }
    if (k === 1) { // f(arcg(v))
      var t = tri(), inner = pick(["sin", "cos", "tg"]), sg = L === 2 && Math.random() < .5 ? 1 : pick([1, -1]), sn, cs, vin;
      if (inner === "sin") { vin = F(sg * t[0], t[2]); sn = [sg * t[0], t[2]]; cs = [t[1], t[2]]; }
      else if (inner === "cos") { vin = F(sg * t[1], t[2]); sn = [t[0], t[2]]; cs = [sg * t[1], t[2]]; }
      else { vin = F(sg * t[0], t[1]); sn = [sg * t[0], t[2]]; cs = [t[1], t[2]]; }
      var outer = pick(FN.filter(function (f) { return f !== inner; }));
      var val = outer === "sin" ? F(sn[0], sn[1]) : outer === "cos" ? F(cs[0], cs[1]) : outer === "tg" ? F(sn[0] * cs[1], cs[0] * sn[1]) : F(cs[0] * sn[1], sn[0] * cs[1]);
      return Q(outer + "(" + ARC[inner] + "(" + vin + ")) ni hisoblang.", val, W(val, [neg(val), F(sn[0], cs[0]), F(cs[0], sn[0]), F(t[2], t[1]), F(t[1], t[0]), F(-sn[0], cs[0])]),
        ["α = " + ARC[inner] + "(" + vin + "): " + inner + " α = " + vin + (inner === "cos" ? ", α ∈ [0; π] → sin α ≥ 0" : ", α ∈ (−π/2; π/2) → cos α > 0"), "sin α = " + F(sn[0], sn[1]) + ", cos α = " + F(cs[0], cs[1]), outer + " α = " + val]);
    }
    if (k === 2) { // arcf(f(θ))
      var f2 = pick(FN), th; do { th = pick(ANG) + pick([0, 0, 360, -360]); } while (fV(f2, th) === UND);
      var v2 = fV(f2, th), d2 = arcD(f2, v2); if (d2 === null || d2 === th) { th = th + 360; }
      var a2 = rad(d2);
      return Q(ARC[f2] + "(" + f2 + "(" + rad(th) + ")) ni hisoblang.", a2, W(a2, [rad(th), rad(-d2), rad(180 - d2), rad(nd(th)), rad(d2 + 180)]),
        [f2 + "(" + rad(th) + ") = " + v2, ARC[f2] + "(" + v2 + ") = " + a2 + " (qiymatlar sohasidagi burchak)"]);
    }
    if (k === 3) { // yig'indi
      var g1 = pick(FN), g2 = pick(FN), v1 = pick(g1 === "sin" || g1 === "cos" ? SV : TV), vv2 = pick(g2 === "sin" || g2 === "cos" ? SV : TV);
      var e1 = arcD(g1, v1), e2 = arcD(g2, vv2); if (e1 === null || e2 === null) return null;
      var c1 = pick([1, 1, 2, 3]), op = pick([1, -1]), sum = c1 * e1 + op * e2, a3 = rad(sum);
      var e3 = (c1 === 1 ? "" : c1) + ARC[g1] + "(" + v1 + ") " + (op > 0 ? "+" : "−") + " " + ARC[g2] + "(" + vv2 + ")";
      return Q("Hisoblang: " + e3, a3, W(a3, [rad(c1 * e1 - op * e2), rad(-sum), rad(c1 * e1 + op * (90 - e2)), rad(c1 * (90 - e1) + op * e2), rad(sum + 30), rad(sum - 45)]),
        [ARC[g1] + "(" + v1 + ") = " + rad(e1) + ", " + ARC[g2] + "(" + vv2 + ") = " + rad(e2), (c1 === 1 ? "" : c1 + "·") + (c1 > 1 && e1 < 0 ? "(" + rad(e1) + ")" : rad(e1)) + (op * e2 < 0 ? " − " : " + ") + rad(Math.abs(e2)) + " = " + a3]);
    }
    if (k === 4) { // aniqlanish sohasi
      var f4 = pick(["sin", "cos"]), kk = R(1, 4), b = R(-5, 5); if (kk === 1 && b === 0) b = R(1, 4);
      var ans4 = "[" + F(b - 1, kk) + "; " + F(b + 1, kk) + "]";
      return Q("y = " + ARC[f4] + "(" + poly([kk, -b]) + ") funksiyaning aniqlanish sohasini toping.", ans4,
        W(ans4, ["[" + F(-b - 1, kk) + "; " + F(-b + 1, kk) + "]", "[" + ms(b - 1) + "; " + ms(b + 1) + "]", "(" + F(b - 1, kk) + "; " + F(b + 1, kk) + ")", "[−1; 1]", "[" + F(b, kk) + "; " + F(b + 2, kk) + "]"]),
        ["−1 ≤ " + poly([kk, -b]) + " ≤ 1", ms(b - 1) + " ≤ " + (kk === 1 ? "x" : kk + "x") + " ≤ " + ms(b + 1), "D(y) = " + ans4]);
    }
    // arcf x = θ → x
    var f5 = pick(FN), cand = f5 === "sin" ? [-90, -60, -45, -30, 0, 30, 45, 60, 90] : f5 === "cos" ? [0, 30, 45, 60, 90, 120, 135, 150, 180] : f5 === "tg" ? [-60, -45, -30, 0, 30, 45, 60] : [30, 45, 60, 90, 120, 135, 150];
    if (L === 1) cand = cand.filter(function (x) { return x >= 0 && x <= 90; });
    var d5 = pick(cand), r5 = Math.random() < .6, x5 = fV(f5, d5);
    return Q(ARC[f5] + " x = " + ang(d5, r5) + " bo'lsa, x ni toping.", x5, wVal(x5, [fV(CO[f5], d5)]),
      [ARC[f5] + " x = " + ang(d5, r5) + " → x = " + tf(f5, d5, r5), "x = " + x5]);
  }

  /* ---------- t31: trigonometrik ifodalar qiymati ---------- */
  function t31x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 3] : [0, 1, 2, 3, 3]);
    if (k === 0) { // ratsional qiymatli ifoda
      var nt = L === 1 ? 2 : pick([2, 3]), r = L === 3 && Math.random() < .6, angs = L === 1 ? [0, 30, 45, 60, 90] : ANG;
      var ex = "", N = 0, alt = [], Ns = [], used = {};
      for (var i = 0; i < nt; i++) {
        var fn, d, v, rv, sq, tries = 0;
        do { fn = pick(FN); d = pick(angs); v = fV(fn, d); } while ((v === UND || v === "0" || used[fn + d]) && tries++ < 50);
        used[fn + d] = 1;
        rv = vRat(v); sq = !rv; if (sq) rv = vSq(v);
        var c = pick(L === 1 ? [1, 2, 4] : [1, 2, 3, 4, 6]), sg = i === 0 ? 1 : pick([1, -1]);
        var term = (c === 1 ? "" : c) + fn + (sq ? "²" : "") + (r ? "(" + rad(d) + ")" : (sq ? "" : " ") + deg(d));
        ex += i === 0 ? term : (sg > 0 ? " + " : " − ") + term;
        var contrib = sg * c * rv[0] * (12 / rv[1]); N += contrib; Ns.push(contrib);
      }
      var a = F(N, 12);
      return Q("Hisoblang: " + ex, a, W(a, [F(N - 2 * Ns[Ns.length - 1], 12), F(N + 6, 12), F(N - 6, 12), F(-N, 12), F(N + 12, 12), F(N - 12, 12)]),
        ["Jadval qiymatlarini qo'yamiz", "Natija: " + a]);
    }
    if (k === 1) { // qiymat
      var f1 = pick(FN), d1 = L === 1 ? pick([120, 135, 150, 180]) : L === 2 ? (Math.random() < .5 ? pick(ANG.slice(8)) : -pick(ANG.slice(1, 9))) : pick(ANG) + 360 * R(1, 3), r1 = L === 3 && Math.random() < .5;
      var v1 = fV(f1, d1); if (v1 === UND) { f1 = CO[f1]; v1 = fV(f1, d1); }
      return Q(tf(f1, d1, r1) + " ni hisoblang.", v1, wVal(v1, [fV(CO[f1], d1), mirV(f1, d1)]), valSteps(f1, d1, r1));
    }
    if (k === 2) { // ishora
      var nf = L === 2 ? 2 : 3, txt = "", s = 1, parts = [];
      for (var j = 0; j < nf; j++) {
        var g = pick(FN), dd; do { dd = R(1, 359); } while (dd % 90 === 0);
        var qd = quad(dd), sgn = g === "sin" ? (qd <= 2 ? 1 : -1) : g === "cos" ? (qd === 1 || qd === 4 ? 1 : -1) : (qd === 1 || qd === 3 ? 1 : -1);
        s *= sgn; parts.push(g + " " + dd + "°"); 
      }
      txt = parts.join("·");
      var a2 = s > 0 ? "musbat" : "manfiy";
      return Q("Ifodaning ishorasini aniqlang: " + txt, a2, W(a2, ["musbat", "manfiy", "nolga teng", "aniqlab bo'lmaydi"]),
        ["Har bir ko'paytuvchining chorakdagi ishorasini aniqlaymiz", "Manfiy ko'paytuvchilar soni " + (s > 0 ? "juft" : "toq") + " → " + a2]);
    }
    // to'ldiruvchi burchaklar
    var A = R(1, 89), c3 = R(1, 6), m3 = R(-6, 9), kind = R(0, 4), ex3, base3;
    var B = 90 - A;
    if (kind === 0) { ex3 = "sin²" + A + "° + sin²" + B + "°"; base3 = 1; }
    else if (kind === 1) { ex3 = "cos²" + A + "° + cos²" + B + "°"; base3 = 1; }
    else if (kind === 2) { ex3 = "tg " + A + "°·tg " + B + "°"; base3 = 1; }
    else if (kind === 3) { ex3 = "sin " + A + "° / cos " + B + "°"; base3 = 1; }
    else { ex3 = "sin " + A + "° − cos " + B + "°"; base3 = 0; }
    var full = (c3 === 1 ? "" : c3 + "(") + ex3 + (c3 === 1 ? "" : ")") + (m3 > 0 ? " + " + m3 : m3 < 0 ? " − " + (-m3) : "");
    var a3 = c3 * base3 + m3;
    return Q("Hisoblang: " + full, a3, W(a3, [c3 * (1 - base3) + m3, c3 * 2 + m3, m3 - c3, a3 + 1, a3 - 1, c3 + m3 + 1]),
      [A + "° + " + B + "° = 90° → " + (kind < 2 ? "sin " + B + "° = cos " + A + "°" : kind === 2 ? "tg " + B + "° = ctg " + A + "°" : "cos " + B + "° = sin " + A + "°"), ex3 + " = " + base3, "Javob: " + ms(a3)]);
  }

  aug("t68", t68x, sh(.82, .82, .88));
  aug("t3", t3x, sh(.72, .72, .78));

  aug("t29", t29x, sh(.82, .72, .62));
  aug("t30", t30x, sh(.86, .86, .86));
  aug("t31", t31x, sh(.82, .82, .82));

  /* ---------- t33, t69, t34, t35: trigonometrik tenglamalar ---------- */
  // umumiy yechim shakli: {m: "p" | "pm" | "m0" | "m1", d: burchak (gradus, kx uchun), P: davr (180° karrasi), k}
  //   p: x = d/k + 180P·n/k;  pm: ±d/k + …;  m0: (−1)ⁿ·d/k + …;  m1: (−1)ⁿ⁺¹·d/k + …
  function gForm(fn, v, k) {
    var d;
    if (fn === "sin") {
      if (v === "0") return { m: "p", d: 0, P: 1, k: k };
      if (v === "1" || v === "−1") return { m: "p", d: v === "1" ? 90 : -90, P: 2, k: k };
      d = arcD("sin", v); return { m: d < 0 ? "m1" : "m0", d: Math.abs(d), P: 1, k: k };
    }
    if (fn === "cos") {
      if (v === "0") return { m: "p", d: 90, P: 1, k: k };
      if (v === "1" || v === "−1") return { m: "p", d: v === "1" ? 0 : 180, P: 2, k: k };
      return { m: "pm", d: arcD("cos", v), P: 2, k: k };
    }
    return { m: "p", d: arcD(fn, v), P: 1, k: k };
  }
  function gStr(f, r) {
    var k = f.k || 1;
    var A = r ? radF(f.d, 180 * k) : deg(f.d / k), Pn = r ? piN(f.P, k) : (180 * f.P / k) + "°n";
    if (f.d === 0 && f.m === "p") return "x = " + Pn;
    if (f.d === 0) return null;
    return "x = " + (f.m === "pm" ? "±" : f.m === "m0" ? "(−1)ⁿ·" : f.m === "m1" ? "(−1)ⁿ⁺¹·" : "") + A + " + " + Pn;
  }
  function gKey(f) { // yechimlar to'plami kaliti (taqqoslash uchun)
    var k = f.k || 1, out = [];
    for (var n = -12; n <= 12; n++) {
      var xs = f.m === "p" ? [f.d] : f.m === "pm" ? [f.d, -f.d] : f.m === "m0" ? [n % 2 ? -f.d : f.d] : [n % 2 ? f.d : -f.d];
      for (var i = 0; i < xs.length; i++) { var x = Math.round((xs[i] + 180 * f.P * n) / k * 1000) / 1000; if (x >= -360 && x < 360 && out.indexOf(x) < 0) out.push(x); }
    }
    return out.sort(function (a, b) { return a - b; }).join(",");
  }
  function gsol(fn, v, k, r) { return gStr(gForm(fn, v, k || 1), r); }
  // noto'g'ri umumiy yechimlar (tipik xatolar); to'plami to'g'ri javobga teng bo'lganlari tashlanadi
  function gsolW(fn, v, k, r) {
    k = k || 1;
    var f = gForm(fn, v, k), key = gKey(f), d = f.d, c = [];
    function add(m, dd, P) { c.push({ m: m, d: dd, P: P, k: k }); }
    if (fn === "sin" || fn === "cos") {
      add("p", d, 1); add("p", d, 2); add("pm", d, 1); add("pm", d, 2); add("m0", d, 1); add("m1", d, 1); add("m0", d, 2);
      add("pm", 180 - d, 2); add("m0", Math.abs(90 - d), 1); add("pm", Math.abs(90 - d), 2); add("p", -d, 2); add("p", 90, 1); add("p", 0, 1); add("p", 0, 2); add("p", 90, 2);
    } else {
      add("p", d, 2); add("p", -d, 1); add("pm", Math.abs(d) || 90, 1); add("p", 90 - d, 1); add("m0", d, 1); add("p", d + 90, 1); add("pm", Math.abs(d) || 90, 2);
    }
    var out = [], seen = {}; seen[key] = 1;
    shuffle(c.slice(0, 4)).concat(shuffle(c.slice(4))).forEach(function (g) {
      var s2 = gStr(g, r), kk = gKey(g); if (!s2 || seen[kk]) return; seen[kk] = 1; out.push(s2);
    });
    return out;
  }
  var LIN = { "1/2": [["2", "1"]], "√2/2": [["2", "√2"], ["√2", "1"]], "√3/2": [["2", "√3"]], "1": [["", "1"], ["3", "3"], ["2", "2"]], "√3": [["", "√3"], ["√3", "3"]], "√3/3": [["√3", "1"], ["3", "√3"]], "0": [["2", "0"], ["5", "0"]] };
  function argX(k) { return k === 1 ? "x" : k + "x"; }
  function linEq(fn, v, k) {
    var ab = v.charAt(0) === "−" ? v.slice(1) : v, o = pick(LIN[ab]), A = o[0], Bv = o[1];
    var As = A === "" ? "" : /√/.test(A) ? A + "·" : A;
    if (Bv === "0") return As + fn + " " + argX(k) + " = 0";
    return As + fn + " " + argX(k) + (v.charAt(0) === "−" ? " + " : " − ") + Bv + " = 0";
  }
  function eqStr(fn, v, k, lin) { return lin ? linEq(fn, v, k) : fn + " " + argX(k) + " = " + v; }
  // [lo; hi] (gradus) oraliqdagi ildizlar: fn(kx) = v
  function roots(fn, v, k, lo, hi) {
    var out = [];
    for (var d = Math.ceil(k * lo / 15) * 15; d <= k * hi; d += 15) if (isTab(d) && fV(fn, d) === v) out.push(d / k);
    return out;
  }
  function vPool(fn) { return fn === "sin" || fn === "cos" ? SV : TV; }
  function eqSteps(fn, v, k, r, lin) {
    var st = [];
    if (lin) st.push(fn + " " + argX(k) + " = " + v);
    st.push(fn === "sin" ? "sin t = a → t = (−1)ⁿ·arcsin a + πn" : fn === "cos" ? "cos t = a → t = ±arccos a + 2πn" : fn === "tg" ? "tg t = a → t = arctg a + πn" : "ctg t = a → t = arcctg a + πn");
    if (k > 1) st.push(k + "x = …, ikkala tomonni " + k + " ga bo'lamiz");
    st.push("Javob: " + gsol(fn, v, k, r));
    return st;
  }
  // fns: ishlatiladigan funksiyalar; L: daraja
  function eqx(fns, L) {
    var k = pick(L === 1 ? [0, 0, 1, 1, 3, 4, 7] : L === 2 ? [1, 2, 2, 3, 3, 4] : [2, 3, 4, 5, 5, 6, 6]);
    var fn = pick(fns), pool = vPool(fn), v = pick(pool), lin = Math.random() < (L === 1 ? .5 : .4), r = Math.random() < .55;
    if (k === 0) { // [0°; 90°] oraliqda
      var vp = pick(pool.filter(function (x) { return x.charAt(0) !== "−"; })), rt = roots(fn, vp, 1, 0, fn === "tg" || fn === "ctg" ? 89 : 90).filter(function (x) { return x > 0 || fn !== "ctg"; });
      if (fn === "ctg") rt = roots(fn, vp, 1, 1, 90);
      if (!rt.length) return null;
      var a0 = deg(rt[0]);
      return Q(eqStr(fn, vp, 1, true) + " tenglamaning (0°; 90°] oraliqdagi yechimini toping.".replace("(0°; 90°]", fn === "tg" ? "[0°; 90°)" : fn === "ctg" ? "(0°; 90°]" : "[0°; 90°]"), a0,
        W(a0, shuffle(["0°", "30°", "45°", "60°", "90°"]).concat(["120°", "150°"])), [fn + " x = " + vp, tf(fn, rt[0]) + " = " + vp, "x = " + a0]);
    }
    if (k === 1 || k === 2) { // umumiy yechim
      var rr = k === 2 || (k === 1 && L === 2 && r);
      var a1 = gsol(fn, v, 1, rr);
      return Q(eqStr(fn, v, 1, lin) + " tenglamaning umumiy yechimini toping.", a1, W(a1, gsolW(fn, v, 1, rr)), eqSteps(fn, v, 1, rr, lin));
    }
    if (k === 3) { // [0°; 360°) dagi ildizlar
      var hi = fn === "tg" || fn === "ctg" ? 359 : 359, rs = roots(fn, v, 1, 0, hi); if (!rs.length) return null;
      function lst(a) { return a.map(function (x) { return ang(x, r); }).join("; "); }
      var a3 = lst(rs), alt = [];
      alt.push(lst(roots(fn, neg(v), 1, 0, hi))); alt.push(lst(roots(CO[fn], v, 1, 0, hi))); alt.push(lst(rs.slice(0, 1))); alt.push(lst(rs.map(function (x) { return nd(-x); }).sort(function (p, q) { return p - q; })));
      alt.push(lst(rs.map(function (x) { return nd(180 - x); }).sort(function (p, q) { return p - q; }))); alt.push(lst(rs.map(function (x) { return nd(x + 90); }).sort(function (p, q) { return p - q; })));
      return Q(eqStr(fn, v, 1, lin) + " tenglamaning " + (r ? "[0; 2π)" : "[0°; 360°)") + " oraliqdagi barcha ildizlarini toping.", a3, W(a3, alt.filter(function (x) { return x; })),
        [fn + " x = " + v, "Birlik aylanada " + rs.length + " ta nuqta", "Javob: " + a3]);
    }
    if (k === 4) { // eng kichik musbat ildiz
      var rp = roots(fn, v, 1, 1, 360); if (!rp.length) return null;
      var a4 = ang(rp[0], r), d0 = arcD(fn, v);
      return Q(eqStr(fn, v, 1, lin) + " tenglamaning eng kichik musbat ildizini toping.", a4,
        W(a4, [ang(d0, r), ang(rp[1] || rp[0] + 180, r), ang(nd(-rp[0]) || 360, r), ang(rp[0] + 360, r), ang(180 - rp[0], r), ang(90 - rp[0] > 0 ? 90 - rp[0] : rp[0] + 90, r)]),
        [fn + " x = " + v, "Ildizlar: " + roots(fn, v, 1, -360, 720).filter(function (x) { return x > -200 && x < 400; }).map(function (x) { return ang(x, r); }).join("; ") + " …", "Eng kichik musbati: " + a4]);
    }
    if (k === 5) { // fn(kx) = v, radianda
      var kk = R(2, 4), a5 = gsol(fn, v, kk, true);
      return Q(eqStr(fn, v, kk, lin) + " tenglamaning umumiy yechimini toping.", a5,
        W(a5, [gsol(fn, v, 1, true)].concat(gsolW(fn, v, kk, true))), eqSteps(fn, v, kk, true, lin));
    }
    if (k === 6) { // ildizlar soni
      var IV = pick([[0, 360, "[0; 2π]"], [0, 540, "[0; 3π]"], [-180, 180, "[−π; π]"], [0, 720, "[0; 4π]"], [-360, 360, "[−2π; 2π]"], [-90, 270, "[−π/2; 3π/2]"], [0, 180, "[0; π]"]]);
      var kk6 = pick([1, 1, 2, 3]), c6 = roots(fn, v, kk6, IV[0], IV[1]).length;
      return Q(eqStr(fn, v, kk6, lin) + " tenglama " + IV[2] + " oraliqda nechta ildizga ega?", c6, W(c6, nearW(c6, 6, 3).filter(function (x) { return x >= 0; })),
        [fn + " " + argX(kk6) + " = " + v, "Ildizlar: " + roots(fn, v, kk6, IV[0], IV[1]).map(function (x) { return rad(x); }).join("; "), "Soni: " + c6]);
    }
    // yechimga ega emas
    var no = pick(["sin x = 1,2", "cos x = √3", "sin x = π/2", "cos x = −1,5", "sin x = √2", "cos x = 4/3", "sin x = −π/3", "cos x = 2", "sin x = −√5/2", "cos x = 1,01"]);
    var yes = shuffle(["sin x = 0,8", "cos x = −√2/2", "sin x = −1", "cos x = 1/3", "sin x = π/4", "cos x = √3/2", "tg x = 5", "ctg x = −7", "cos x = −0,9", "sin x = √3/3", "tg x = π", "sin x = 2/π"]);
    return Q("Qaysi tenglama yechimga ega emas?", no, yes.slice(0, 4), ["sin x va cos x qiymatlari [−1; 1] oralig'ida", "π/2 ≈ 1,57; √2 ≈ 1,41; √3 ≈ 1,73; π/3 ≈ 1,05", no.replace(" = ", " = ") + " — 1 dan katta (yoki −1 dan kichik)"]);
  }
  function t33x(L) { return eqx(["sin", "cos"], L); }
  function t34x(L) {
    if (Math.random() < .25 && L > 1) { // jadvalda yo'q qiymat
      var fn = pick(["tg", "ctg"]), p = RNZ(-9, 9), q = pick([1, 1, 1, 2, 3, 5]); if (gcd(p, q) !== 1 || (Math.abs(p) === 1 && q === 1)) { p = pick([2, 3, 4, 5, -2, -3]); q = 1; }
      var vs = F(Math.abs(p), q), sg = p < 0, arc = (fn === "tg" ? "arctg " : "arcctg ") + vs;
      var a = "x = " + (sg ? (fn === "tg" ? "−" + arc : "π − " + arc) : arc) + " + πn";
      return Q(fn + " x = " + F(p, q) + " tenglamaning umumiy yechimini toping.", a,
        W(a, ["x = " + (sg ? "−" : "") + arc + " + 2πn", "x = ±" + arc + " + πn", "x = (−1)ⁿ·" + (sg ? "(−" + arc + ")" : arc) + " + πn", "x = " + (sg ? "" : "−") + arc + " + πn", "x = " + (fn === "tg" ? "arcctg " : "arctg ") + vs + " + πn"]),
        [fn + " x = a → x = " + (fn === "tg" ? "arctg a" : "arcctg a") + " + πn", sg ? (fn === "tg" ? "arctg(−a) = −arctg a" : "arcctg(−a) = π − arcctg a") : "a = " + vs, "Javob: " + a]);
    }
    return eqx(["tg", "ctg"], L);
  }
  // usullar: kvadrat tenglamaga keltirish, bir jinsli, ko'paytuvchilarga ajratish
  function t35x(L) {
    if (L === 1) return Math.random() < .5 ? eqx(["sin", "cos"], 1) : eqx(["tg", "ctg"], 1);
    var k = pick(L === 2 ? [0, 1, 1, 2] : [0, 0, 1, 2, 3]);
    if (k === 0) { // kvadrat: a·t² + b·t + c = 0, t = sin x yoki cos x
      var fn = pick(["sin", "cos"]), RT = [[1, 2], [-1, 2], [1, 1], [-1, 1], [0, 1], [2, 1], [-2, 1], [3, 2], [-3, 2], [3, 1]];
      var r1 = pick(RT.slice(0, 5)), r2; do { r2 = pick(RT); } while (r2[0] * r1[1] === r1[0] * r2[1]);
      var A2 = r1[1] * r2[1], B2 = -(r1[1] * r2[0] + r2[1] * r1[0]), C2 = r1[0] * r2[0], g = gcd(gcd(A2, B2), C2) || 1; A2 /= g; B2 /= g; C2 /= g;
      if (A2 < 0) { A2 = -A2; B2 = -B2; C2 = -C2; }
      var t = fn + " x", e = (A2 === 1 ? "" : A2) + fn + "²x" + (B2 ? (B2 < 0 ? " − " : " + ") + (Math.abs(B2) === 1 ? "" : Math.abs(B2)) + t : "") + (C2 ? (C2 < 0 ? " − " : " + ") + Math.abs(C2) : "") + " = 0";
      var vals = [r1, r2].filter(function (z) { return Math.abs(z[0]) <= z[1]; }).map(function (z) { return F(z[0], z[1]); });
      var cnt = 0, lst = [];
      vals.forEach(function (vv) { var rr = roots(fn, vv === "0" ? "0" : vv, 1, 0, 359); cnt += rr.length; lst = lst.concat(rr); });
      lst.sort(function (p, q) { return p - q; });
      var ask = Math.random() < .55;
      if (ask) return Q(e + " tenglama [0°; 360°) oraliqda nechta ildizga ega?", cnt, W(cnt, nearW(cnt, 6, 3).filter(function (x) { return x >= 0; })),
        [t + " = t deb belgilaymiz: " + (A2 === 1 ? "" : A2) + "t²" + (B2 ? (B2 < 0 ? " − " : " + ") + (Math.abs(B2) === 1 ? "" : Math.abs(B2)) + "t" : "") + (C2 ? (C2 < 0 ? " − " : " + ") + Math.abs(C2) : "") + " = 0 → t = " + F(r1[0], r1[1]) + "; " + F(r2[0], r2[1]),
          "|t| ≤ 1 shart: " + (vals.length ? t + " = " + vals.join(" yoki ") : "mos ildiz yo'q"), "Ildizlar: " + (lst.length ? lst.map(deg).join("; ") : "yo'q") + " → " + cnt + " ta"]);
      var ta = F(r1[0], r1[1]) + "; " + F(r2[0], r2[1]);
      var good = vals.join("; ") || "yo'q";
      return Q(e + " tenglamada " + t + " qanday qiymat(lar) qabul qiladi?", good,
        W(good, [ta, F(-r1[0], r1[1]) + "; " + F(-r2[0], r2[1]), F(r1[1], r1[0] || 1) + "; " + F(r2[0], r2[1]), "yo'q", F(-r1[0], r1[1]), F(-r2[0], r2[1])]),
        [t + " = t: kvadrat tenglama ildizlari t = " + ta, "−1 ≤ " + t + " ≤ 1 bo'lgani uchun faqat " + (vals.length ? vals.join(" va ") : "hech biri") + " mos"]);
    }
    if (k === 1) { // bir jinsli: a sin x + b cos x = 0 → tg x = −b/a
      var pairs = [["", "√3", "√3", 1], ["√3", "", "√3/3", 1], ["", "", "1", 1], ["√3", "3", "√3", 1], ["3", "√3", "√3/3", 1]];
      var pr = pick(pairs), sgn = pick([1, -1]), vv2 = sgn > 0 ? pr[2] : neg(pr[2]), r = Math.random() < .7;
      // a sin x − sgn·b cos x = 0 → tg x = sgn·b/a
      var e2 = (pr[0] ? pr[0] + (/√/.test(pr[0]) ? "·" : "") : "") + "sin x " + (sgn > 0 ? "−" : "+") + " " + (pr[1] ? pr[1] + (/√/.test(pr[1]) ? "·" : "") : "") + "cos x = 0";
      var a2 = gsol("tg", vv2, 1, r);
      return Q(e2 + " tenglamani yeching.", a2, W(a2, gsolW("tg", vv2, 1, r).concat([gsol("tg", neg(vv2), 1, r), gsol("ctg", vv2, 1, r)])),
        ["cos x ≠ 0, ikkala tomonni cos x ga bo'lamiz", "tg x = " + vv2, "Javob: " + a2]);
    }
    if (k === 2) { // ko'paytma = 0
      var f1 = pick(["sin", "cos"]), f2 = pick(["sin", "cos", "tg"]), v1 = "0", v2 = pick(vPool(f2).filter(function (x) { return x !== "0" && x !== "1" && x !== "−1"; }));
      var e3 = f1 + " x·(" + linEq(f2, v2, 1).replace(" = 0", "") + ") = 0";
      var all = roots(f1, v1, 1, 0, 359).concat(roots(f2, v2, 1, 0, 359)), uq = [];
      all.sort(function (p, q) { return p - q; }).forEach(function (x) { if (uq.indexOf(x) < 0) uq.push(x); });
      if (f2 === "tg") uq = uq.filter(function (x) { return x % 180 !== 90; });
      var c3 = uq.length;
      return Q(e3 + " tenglama [0°; 360°) oraliqda nechta ildizga ega?", c3, W(c3, nearW(c3, 6, 3).filter(function (x) { return x >= 0; })),
        [f1 + " x = 0 yoki " + f2 + " x = " + v2, "Ildizlar: " + uq.map(deg).join("; "), "Soni: " + c3]);
    }
    // ikkilangan burchak: sin 2x = k·sin x ko'rinishi → sin x(2cos x − k) = 0
    var cv = pick(["1", "√2", "√3", "−1", "−√2", "−√3"]), cval = cv.charAt(0) === "−" ? neg(cv.replace("√2", "√2/2").replace("√3", "√3/2").replace(/^1$/, "1/2")) : cv;
    var cvv = { "1": "1/2", "√2": "√2/2", "√3": "√3/2", "−1": "−1/2", "−√2": "−√2/2", "−√3": "−√3/2" }[cv];
    var e4 = "sin 2x " + (cv.charAt(0) === "−" ? "+ " + cv.slice(1) : "− " + cv) + "·sin x = 0";
    var rr4 = roots("sin", "0", 1, 0, 359).concat(roots("cos", cvv, 1, 0, 359)).sort(function (p, q) { return p - q; });
    return Q(e4 + " tenglama [0°; 360°) oraliqda nechta ildizga ega?", rr4.length, W(rr4.length, nearW(rr4.length, 6, 3).filter(function (x) { return x >= 0; })),
      ["sin 2x = 2sin x cos x → sin x·(2cos x " + (cv.charAt(0) === "−" ? "+ " + cv.slice(1) : "− " + cv) + ") = 0", "sin x = 0 yoki cos x = " + cvv, "Ildizlar: " + rr4.map(deg).join("; ") + " → " + rr4.length + " ta"]);
  }

  /* ---------- t36: eng sodda trigonometrik tengsizliklar ---------- */
  var OPS = [">", "<", "≥", "≤"], OPP = { ">": "≤", "<": "≥", "≥": "<", "≤": ">" };
  function cmp(x, op, a) { return op === ">" ? x > a + 1e-9 : op === "<" ? x < a - 1e-9 : op === "≥" ? x > a - 1e-9 : x < a + 1e-9; }
  // [0°; 360°) dagi yechim (fn: sin/cos), oraliqlar ko'rinishida
  function ineqSet(fn, op, v, r) {
    var a = vNum(v), rts = ANG.filter(function (d) { return fV(fn, d) === v; });
    var pts = [0].concat(rts.filter(function (d) { return d !== 0; })).sort(function (p, q) { return p - q; });
    var el = [];
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], isR = fV(fn, p) === v;
      el.push({ t: "p", x: p, ok: isR ? (op === "≥" || op === "≤") : cmp(fnum(fn, p * Math.PI / 180), op, a) });
      var nx = i + 1 < pts.length ? pts[i + 1] : 360;
      el.push({ t: "o", x: p, y: nx, ok: cmp(fnum(fn, (p + nx) / 2 * Math.PI / 180), op, a) });
    }
    var out = [], cur = null;
    for (var j = 0; j < el.length; j++) {
      var e = el[j];
      if (e.ok) {
        if (!cur) cur = { s: e.x, sb: e.t === "p" ? "[" : "(" };
        cur.e = e.t === "p" ? e.x : e.y; cur.eb = e.t === "p" ? "]" : ")";
      } else if (cur) { out.push(cur); cur = null; }
    }
    if (cur) out.push(cur);
    if (!out.length) return "yechimi yo'q";
    for (var m = 0; m < out.length; m++) if (out[m].s === out[m].e) return null;
    return out.map(function (c) { return c.sb + ang(c.s, r) + "; " + ang(c.e, r) + c.eb; }).join("∪");
  }
  function term2(d, per) { return (d === 0 ? "" : rad(d) + " + ") + per; }
  function ineqGen(fn, op, v) { // umumiy yechim (radianda)
    var st = op === ">" || op === "<", L1 = st ? "(" : "[", R1 = st ? ")" : "]", lo, hi, per = fn === "sin" || fn === "cos" ? "2πn" : "πn", up = op === ">" || op === "≥";
    if (fn === "sin") { var al = arcD("sin", v); if (up) { lo = al; hi = 180 - al; } else { lo = -180 - al; hi = al; } }
    else if (fn === "cos") { var be = arcD("cos", v); if (up) { lo = -be; hi = be; } else { lo = be; hi = 360 - be; } }
    else if (fn === "tg") { var at = arcD("tg", v); if (up) { lo = at; hi = 90; R1 = ")"; } else { lo = -90; hi = at; L1 = "("; } }
    else { var ac = arcD("ctg", v); if (up) { lo = 0; hi = ac; L1 = "("; } else { lo = ac; hi = 180; R1 = ")"; } }
    return L1 + term2(lo, per) + "; " + term2(hi, per) + R1;
  }
  function t36x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 3] : L === 2 ? [0, 1, 1, 3, 2] : [1, 2, 2, 2, 3]);
    var fn = pick(["sin", "cos"]), op = pick(OPS), v = pick(["−√3/2", "−√2/2", "−1/2", "0", "1/2", "√2/2", "√3/2"]);
    if (k === 0) { // berilgan burchaklardan qaysi biri yechim
      var good = [], bad = [];
      ANG.concat([20, 70, 100, 160, 200, 250, 290, 340]).forEach(function (d) { var root = isTab(d) && fV(fn, d) === v; (root ? [] : cmp(fnum(fn, d * Math.PI / 180), op, vNum(v)) ? good : bad).push(d); });
      if (!good.length || bad.length < 3) return null;
      var g = pick(good), a0 = deg(g);
      return Q("Qaysi burchak " + fn + " x " + op + " " + v + " tengsizlikni qanoatlantiradi?", a0, W(a0, shuffle(bad).map(deg)),
        [tf(fn, g) + " ≈ " + String(Math.round(fnum(fn, g * Math.PI / 180) * 100) / 100).replace("-", "−").replace(".", ","), v + " ≈ " + String(Math.round(vNum(v) * 100) / 100).replace("-", "−").replace(".", ","), "Shart bajariladi: " + a0]);
    }
    if (k === 1) { // [0°; 360°) dagi yechim
      var r1 = L === 3 && Math.random() < .5, a1 = ineqSet(fn, op, v, r1); if (!a1) return null;
      var alts = [ineqSet(fn, OPP[op], v, r1), ineqSet(CO[fn], op, v, r1), ineqSet(fn, op, neg(v), r1), ineqSet(fn, op === ">" ? "≥" : op === "≥" ? ">" : op === "<" ? "≤" : "<", v, r1), ineqSet(fn, op === ">" ? "<" : op === "<" ? ">" : op === "≥" ? "≤" : "≥", v, r1)];
      return Q(fn + " x " + op + " " + v + " tengsizlikning " + (r1 ? "[0; 2π)" : "[0°; 360°)") + " oraliqdagi yechimini toping.", a1, W(a1, alts.filter(function (x) { return x; })),
        [fn + " x = " + v + ": " + ANG.filter(function (d) { return fV(fn, d) === v; }).map(function (d) { return ang(d, r1); }).join(" va "), "Birlik aylanada " + (fn === "sin" ? "ordinatasi" : "abssissasi") + " " + v + " dan " + (op === ">" || op === "≥" ? "katta" : "kichik") + " bo'lgan yoy", "Javob: " + a1]);
    }
    if (k === 2) { // umumiy yechim
      var f2 = pick(["sin", "cos", "sin", "cos", "tg", "ctg"]), v2 = f2 === "tg" || f2 === "ctg" ? pick(TV) : v, a2 = ineqGen(f2, op, v2);
      var alt2 = [ineqGen(f2, OPP[op], v2), ineqGen(f2, op, neg(v2)), a2.replace(/2πn/g, "πn"), (f2 === "tg" || f2 === "ctg") && v2 === "0" ? "" : ineqGen(CO[f2], op, v2)];
      if (f2 === "tg" || f2 === "ctg") alt2.push(a2.replace(/πn/g, "2πn"));
      return Q(f2 + " x " + op + " " + v2 + " tengsizlikni yeching.", a2, W(a2, alt2),
        [f2 + " x = " + v2 + " → x = " + rad(arcD(f2, v2)) + (f2 === "sin" ? " va π − " + rad(arcD(f2, v2)) : f2 === "cos" ? " va −" + rad(arcD(f2, v2)) : ""), "Davr: " + (f2 === "sin" || f2 === "cos" ? "2π" : "π"), "Javob: " + a2]);
    }
    // tg x op a, (−90°; 90°) da
    var t = pick(TV), at = arcD("tg", t), up = op === ">" || op === "≥", br = op === "≥" || op === "≤";
    var a3 = up ? (br ? "[" : "(") + deg(at) + "; 90°)" : "(−90°; " + deg(at) + (br ? "]" : ")");
    var w3 = [up ? "(−90°; " + deg(at) + (br ? "]" : ")") : (br ? "[" : "(") + deg(at) + "; 90°)", up ? (br ? "(" : "[") + deg(at) + "; 90°)" : "(−90°; " + deg(at) + (br ? ")" : "]"), up ? (br ? "[" : "(") + deg(-at) + "; 90°)" : "(−90°; " + deg(-at) + (br ? "]" : ")"), up ? (br ? "[" : "(") + deg(at) + "; 180°)" : "(0°; " + deg(at) + (br ? "]" : ")"), up ? (br ? "[" : "(") + deg(90 - at) + "; 90°)" : "(−90°; " + deg(90 - at) + (br ? "]" : ")")];
    return Q("tg x " + op + " " + t + " tengsizlikning (−90°; 90°) oraliqdagi yechimini toping.", a3, W(a3, w3),
      ["tg x o'suvchi, " + tf("tg", at) + " = " + t, up ? "x " + (br ? "≥ " : "> ") + deg(at) + " va x < 90°" : "−90° < x " + (br ? "≤ " : "< ") + deg(at), "Javob: " + a3]);
  }

  /* ---------- s9m3: 9-sinf trigonometriya asoslari ---------- */
  function s9m3x(L) {
    var k = pick(L === 1 ? [0, 0, 3, 4] : L === 2 ? [0, 1, 2, 3, 4] : [0, 1, 1, 2, 2, 3]);
    if (k === 0) { // to'g'ri burchakli uchburchakda nisbatlar
      var t = pick(TRI), sc = pick([1, 1, 2, 3]), a = t[0] * sc, b = t[1] * sc, c = t[2] * sc, sw = Math.random() < .5;
      // ∠C = 90°, BC = a (∠A qarshisida), AC = b, AB = c
      var BC = sw ? b : a, AC = sw ? a : b, at = pick(["A", "B"]), fn = pick(["sin", "cos", "tg", "ctg"]);
      var opp = at === "A" ? BC : AC, adj = at === "A" ? AC : BC;
      var ans = fn === "sin" ? F(opp, c) : fn === "cos" ? F(adj, c) : fn === "tg" ? F(opp, adj) : F(adj, opp);
      var giv = L === 1 ? "BC = " + BC + ", AC = " + AC + ", AB = " + c : pick(["BC = " + BC + ", AC = " + AC, "BC = " + BC + ", AB = " + c, "AC = " + AC + ", AB = " + c]);
      return Q("ABC uchburchakda ∠C = 90°, " + giv + ". " + fn + " " + at + " ni toping.", ans, W(ans, [F(adj, c), F(opp, c), F(opp, adj), F(adj, opp), F(c, opp), F(c, adj)]),
        [L === 1 ? "" : "Pifagor: AB² = AC² + BC² → " + "AB = " + c + ", AC = " + AC + ", BC = " + BC, fn === "sin" ? "sin = qarshi katet / gipotenuza" : fn === "cos" ? "cos = yopishgan katet / gipotenuza" : fn === "tg" ? "tg = qarshi katet / yopishgan katet" : "ctg = yopishgan katet / qarshi katet", fn + " " + at + " = " + ans].filter(function (x) { return x; }));
    }
    if (k === 1) { // 30°, 45°, 60° li uchburchak tomonlari
      var n = R(2, 12), typ = R(0, 3), q, a1, w1, st;
      if (typ === 0) { q = "∠C = 90°, ∠A = 30°, AB = " + 2 * n + ". BC ni toping."; a1 = n; w1 = [2 * n, n + "√3", n + "√2", 4 * n]; st = ["30° qarshisidagi katet gipotenuzaning yarmiga teng", "BC = " + 2 * n + " : 2 = " + n]; }
      else if (typ === 1) { q = "∠C = 90°, ∠A = 30°, AB = " + 2 * n + ". AC ni toping."; a1 = n + "√3"; w1 = [n, n + "√2", 2 * n + "√3", n + "√3/2"]; st = ["AC = AB·cos 30° = " + 2 * n + "·√3/2", "AC = " + n + "√3"]; }
      else if (typ === 2) { q = "∠C = 90°, ∠A = 45°, AC = " + n + ". AB ni toping."; a1 = n + "√2"; w1 = [n, 2 * n, n + "√3", n + "√2/2"]; st = ["Teng yonli to'g'ri burchakli uchburchak: BC = AC = " + n, "AB = " + n + "√2"]; }
      else { q = "∠C = 90°, ∠B = 60°, BC = " + n + ". AB ni toping."; a1 = 2 * n; w1 = [n, n + "√3", n + "√2", 3 * n]; st = ["∠A = 30°, BC — 30° qarshisidagi katet", "AB = 2·BC = " + 2 * n]; }
      return Q("ABC uchburchakda " + q, a1, W(a1, w1), st);
    }
    if (k === 2) { // sin α berilgan, o'tkir burchak
      var t2 = tri(), giv2 = pick(["sin", "cos", "tg"]), tar = pick(["sin", "cos", "tg"].filter(function (f) { return f !== giv2; }));
      var V2 = { sin: F(t2[0], t2[2]), cos: F(t2[1], t2[2]), tg: F(t2[0], t2[1]) };
      return Q(giv2 + " α = " + V2[giv2] + " (α — o'tkir burchak). " + tar + " α ni toping.", V2[tar], W(V2[tar], [F(t2[1], t2[0]), V2[giv2], F(t2[2], t2[1]), F(t2[2], t2[0]), "−" + V2[tar], F(t2[1], t2[2]) === V2[tar] ? F(t2[0], t2[2]) : F(t2[1], t2[2])]),
        [giv2 === "tg" ? "1 + tg²α = 1/cos²α" : "sin²α + cos²α = 1", "sin α = " + V2.sin + ", cos α = " + V2.cos, tar + " α = " + V2[tar]]);
    }
    if (k === 3) { // to'ldiruvchi burchak
      var A = R(1, 89), f = pick(["sin", "cos", "tg", "ctg"]);
      var a3 = deg(90 - A);
      return Q(f + " " + A + "° = " + CO[f] + " x bo'lsa, o'tkir burchak x ni toping.", a3, W(a3, [deg(A), deg(180 - A), deg(90 + A), deg(Math.abs(45 - A) || 45), deg(360 - A)]),
        [f + " α = " + CO[f] + "(90° − α)", "x = 90° − " + A + "° = " + a3]);
    }
    // jadval qiymatlaridan ifoda
    var terms = [["sin 30°", 1, 2], ["cos 60°", 1, 2], ["tg 45°", 1, 1], ["sin 90°", 1, 1], ["cos 0°", 1, 1], ["sin²45°", 1, 2], ["cos²30°", 3, 4], ["sin²60°", 3, 4], ["tg²60°", 3, 1], ["tg²30°", 1, 3], ["cos²45°", 1, 2], ["ctg 45°", 1, 1], ["cos 90°", 0, 1], ["sin 0°", 0, 1]];
    var t1 = pick(terms), tt2; do { tt2 = pick(terms); } while (tt2 === t1);
    var c1 = pick([1, 2, 3, 4]), c2 = pick([1, 2, 4, 6]), op = pick([1, -1]);
    var N = c1 * t1[1] * 12 / t1[2] + op * c2 * tt2[1] * 12 / tt2[2], a4 = F(N, 12);
    return Q("Hisoblang: " + (c1 === 1 ? "" : c1) + t1[0] + (op > 0 ? " + " : " − ") + (c2 === 1 ? "" : c2) + tt2[0], a4,
      W(a4, [F(c1 * t1[1] * 12 / t1[2] - op * c2 * tt2[1] * 12 / tt2[2], 12), F(N + 6, 12), F(N - 6, 12), F(N + 12, 12), F(-N, 12)]),
      [t1[0] + " = " + F(t1[1], t1[2]) + ", " + tt2[0] + " = " + F(tt2[1], tt2[2]), "Natija: " + a4]);
  }

  aug("t33", t33x, sh(.85, .7, .7));
  aug("t69", t33x, sh(.85, .7, .7));
  aug("t34", t34x, sh(.85, .8, .8));
  aug("t35", t35x, sh(.75, .65, .65));
  aug("t36", t36x, sh(.88, .88, .88));
  aug("s9m3", s9m3x, sh(.88, .85, .8));

  /* ================= Ko'rsatkichli va logarifmik funksiyalar ================= */
  var SUPC = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "−": "⁻", "+": "⁺", "x": "ˣ", "n": "ⁿ", "(": "⁽", ")": "⁾" };
  var SUBC = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
  function sup(n) { return String(n).replace(/ /g, "").split("").map(function (c) { return SUPC[c] || c; }).join(""); }
  function sub(n) { return String(n).split("").map(function (c) { return SUBC[c] || c; }).join(""); }
  function lg(a) { return a === 10 ? "lg" : "log" + (typeof a === "string" ? "_" + a : sub(a)); }
  function pw(a, n) { return Math.pow(a, n); }
  // a^n ratsional ko'rinishda (n manfiy bo'lsa kasr)
  function pwS(a, n) { return n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n); }
  function base(b) { return b[1] === 1 ? String(b[0]) : "(" + b[0] + "/" + b[1] + ")"; }   // [p, q] → "(p/q)"
  function expo(e) { return e.length === 1 ? sup(e) : "^(" + e + ")"; }
  // ko'rsatkichdagi chiziqli ifoda: mx + b
  function linX(m, b) { return poly([m, b]); }

  function t19x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [1, 2, 3, 3, 4, 5] : [3, 5, 6, 6, 7]);
    if (k === 0) { // daraja qiymati
      var a = R(2, 9), n = L === 1 ? R(-3, 4) : R(-4, 5); if (Math.abs(n) > 3 && a > 5) n = n > 0 ? 3 : -3;
      if (Math.random() < .3) { var p = R(1, 4), q = R(2, 5); if (gcd(p, q) !== 1) p = 1; var m = R(-3, 3);
        var ans0 = m >= 0 ? F(pw(p, m), pw(q, m)) : F(pw(q, -m), pw(p, -m));
        return Q("(" + p + "/" + q + ")" + sup(m) + " ni hisoblang.", ans0, W(ans0, [F(pw(p, Math.abs(m)), pw(q, Math.abs(m))), F(pw(q, Math.abs(m)), pw(p, Math.abs(m))), F(p * Math.abs(m), q), F(-pw(p, Math.abs(m)), pw(q, Math.abs(m))), F(p * m, q * m || 1), "1"]),
          [m < 0 ? "(a/b)⁻ⁿ = (b/a)ⁿ" : m === 0 ? "a⁰ = 1" : "(a/b)ⁿ = aⁿ/bⁿ", "= " + ans0]); }
      var ans = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n);
      return Q(a + sup(n) + " ni hisoblang.", ans, W(ans, [n >= 0 ? -pw(a, n) : "−" + pw(a, -n), n >= 0 ? a * n : "−1/" + pw(a, -n), n >= 0 ? pw(a, n + 1) : String(-a * -n), n === 0 ? "0" : n > 0 ? pw(a, n - 1) : "1/" + (a * -n), String(a)]),
        [n < 0 ? "a⁻ⁿ = 1/aⁿ" : n === 0 ? "a⁰ = 1" : a + " ni " + n + " marta ko'paytiramiz", "= " + ans]);
    }
    if (k === 1) { // qaysi funksiya o'suvchi / kamayuvchi
      var inc = ["2ˣ", "3ˣ", "(3/2)ˣ", "(5/4)ˣ", "πˣ", "(√2)ˣ", "10ˣ", "(7/3)ˣ", "eˣ", "(1,5)ˣ"], dec = ["(1/2)ˣ", "(2/3)ˣ", "(0,3)ˣ", "(3/5)ˣ", "(1/π)ˣ", "(√2/2)ˣ", "(0,9)ˣ", "(4/7)ˣ", "3⁻ˣ", "(5/8)ˣ"];
      var askInc = Math.random() < .5, A1 = pick(askInc ? inc : dec), oth = shuffle(askInc ? dec : inc).slice(0, 4);
      return Q("Qaysi funksiya " + (askInc ? "o'suvchi" : "kamayuvchi") + "?", "y = " + A1, oth.map(function (x) { return "y = " + x; }),
        ["y = aˣ: a > 1 bo'lsa o'suvchi, 0 < a < 1 bo'lsa kamayuvchi", "Javob: y = " + A1]);
    }
    if (k === 2) { // f(x) = aˣ + b qiymati
      var a2 = R(2, 6), b2 = R(-9, 9), x2 = R(L === 1 ? 0 : -2, 3), v2 = x2 >= 0 ? F(pw(a2, x2) + b2, 1) : F(1 + b2 * pw(a2, -x2), pw(a2, -x2));
      return Q("f(x) = " + a2 + "ˣ" + (b2 > 0 ? " + " + b2 : b2 < 0 ? " − " + (-b2) : "") + " bo'lsa, f(" + ms(x2) + ") ni toping.", v2,
        W(v2, [x2 >= 0 ? F(a2 * x2 + b2, 1) : F(-pw(a2, -x2) + b2, 1), x2 >= 0 ? F(pw(a2, x2 + 1) + b2, 1) : F(b2 - 1, pw(a2, -x2)), x2 >= 0 ? F(pw(a2, x2) - b2, 1) : F(1 - b2 * pw(a2, -x2), pw(a2, -x2)), F(b2 + 1, 1), x2 >= 0 ? F(pw(a2, x2) + b2 + 1, 1) : F(b2, 1)]),
        ["f(" + ms(x2) + ") = " + a2 + sup(x2) + (b2 >= 0 ? " + " + b2 : " − " + (-b2)), a2 + sup(x2) + " = " + pwS(a2, x2), "= " + v2]);
    }
    if (k === 3) { // qiymatlar sohasi / Oy bilan kesishish
      var a3 = R(2, 7), b3 = RNZ(-9, 9), sg = L === 3 && Math.random() < .5 ? -1 : 1, e3 = "y = " + (sg < 0 ? "−" : "") + a3 + "ˣ" + (b3 > 0 ? " + " + b3 : " − " + (-b3));
      if (Math.random() < .5) { var ans3 = sg > 0 ? "(" + ms(b3) + "; +∞)" : "(−∞; " + ms(b3) + ")";
        return Q(e3 + " funksiyaning qiymatlar sohasini toping.", ans3, W(ans3, ["[" + ms(b3) + "; +∞)", "(0; +∞)", sg > 0 ? "(−∞; " + ms(b3) + ")" : "(" + ms(b3) + "; +∞)", "(" + ms(-b3) + "; +∞)", "(" + ms(b3 + 1) + "; +∞)", "(−∞; +∞)"]),
          [a3 + "ˣ > 0 → " + (sg < 0 ? "−" + a3 + "ˣ < 0" : a3 + "ˣ" + (b3 > 0 ? " + " + b3 : " − " + (-b3)) + " > " + ms(b3)), "E(y) = " + ans3]); }
      var yy = sg + b3, ans4 = "(0; " + ms(yy) + ")";
      return Q(e3 + " funksiya grafigi Oy o'qini qaysi nuqtada kesadi?", ans4, W(ans4, ["(0; " + ms(b3) + ")", "(0; " + ms(sg * a3 + b3) + ")", "(" + ms(yy) + "; 0)", "(0; " + ms(yy + 1) + ")", "(1; " + ms(sg * a3 + b3) + ")"]),
        ["x = 0: y = " + (sg < 0 ? "−" : "") + a3 + "⁰" + (b3 > 0 ? " + " + b3 : " − " + (-b3)) + " = " + ms(yy), "Nuqta: " + ans4]);
    }
    if (k === 4) { // grafik nuqtadan o'tadi
      var a5 = R(2, 7), x5 = R(2, 4); if (pw(a5, x5) > 1000) x5 = 2;
      return Q("y = aˣ funksiya grafigi (" + x5 + "; " + pw(a5, x5) + ") nuqtadan o'tadi. a ni toping.", a5, W(a5, [pw(a5, x5) / x5 === Math.round(pw(a5, x5) / x5) ? pw(a5, x5) / x5 : a5 + 2, a5 + 1, a5 - 1 > 1 ? a5 - 1 : a5 + 3, a5 * x5, x5]),
        ["a" + sup(x5) + " = " + pw(a5, x5), "a = " + a5]);
    }
    if (k === 5) { // amallar
      var a6 = R(2, 5), m6 = R(1, 5), n6 = R(-4, -1), c6 = R(0, 1);
      if (c6 === 0) { var e6 = pw(a6, m6 + n6), s6 = m6 + n6 >= 0 ? String(e6) : "1/" + pw(a6, -(m6 + n6)), extra = R(1, 9);
        var full = m6 + n6 >= 0 ? F(e6 + extra, 1) : F(1 + extra * pw(a6, -(m6 + n6)), pw(a6, -(m6 + n6)));
        return Q("Hisoblang: " + a6 + sup(m6) + " · " + a6 + sup(n6) + " + " + extra + "⁰·" + extra, full, W(full, [F(pw(a6, m6 * n6 < 0 ? 0 : m6 * n6) + extra, 1), m6 + n6 >= 0 ? F(e6 + 1, 1) : F(1 + pw(a6, -(m6 + n6)), pw(a6, -(m6 + n6))), F(pw(a6, m6 - n6) + extra, 1), m6 + n6 >= 0 ? F(e6, 1) : s6, F(extra + 1, 1)]),
          ["aᵐ·aⁿ = aᵐ⁺ⁿ: " + a6 + sup(m6 + n6) + " = " + s6, extra + "⁰ = 1", "= " + full]); }
      var mm = R(2, 4), nn = R(2, 3), bb = pw(a6, mm);
      var ans6 = String(pw(a6, mm * nn - mm));
      return Q("Hisoblang: (" + a6 + sup(mm) + ")" + sup(nn) + " : " + bb, ans6, W(ans6, [pw(a6, mm + nn - mm), pw(a6, mm * nn), pw(a6, mm * nn - mm - 1), pw(a6, mm * nn - mm + 1), pw(a6, nn)]),
        ["(aᵐ)ⁿ = aᵐⁿ = " + a6 + sup(mm * nn), bb + " = " + a6 + sup(mm), a6 + sup(mm * nn - mm) + " = " + ans6]);
    }
    if (k === 6) { // eng katta / eng kichik son
      var C = [[2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [5, 1], [6, 1], [7, 1], [10, 1], [2, 4], [11, 1], [3, 3], [5, 2], [2, 5]], sel = [], used = {};
      shuffle(C).forEach(function (c) { var B = pw(c[0], c[1]); if (sel.length < 4 && !used[B]) { used[B] = 1; sel.push(c); } });
      var m7 = pick([10, 15, 20, 25, 30]), big = Math.random() < .5;
      sel.sort(function (p, q) { return pw(p[0], p[1]) - pw(q[0], q[1]); });
      var lab = sel.map(function (c) { return c[0] + sup(c[1] * m7); }), A7 = big ? lab[3] : lab[0];
      return Q("Qaysi son eng " + (big ? "katta" : "kichik") + ": " + shuffle(lab).join(", ") + "?", A7, W(A7, lab),
        ["Barchasini bir xil " + m7 + "-darajaga keltiramiz: " + sel.map(function (c) { return pw(c[0], c[1]) + sup(m7); }).join(", "), "Asosi eng " + (big ? "katta" : "kichik") + " bo'lgani: " + A7]);
    }
    // f(x) = aˣ xossasi: f(m)·f(n), f(x+1)/f(x)
    var a8 = R(2, 5), m8 = R(1, 4), n8 = R(1, 3);
    if (Math.random() < .5) return Q("f(x) = " + a8 + "ˣ bo'lsa, f(" + m8 + ")·f(" + n8 + ") ni toping.", pw(a8, m8 + n8), W(pw(a8, m8 + n8), [pw(a8, m8 * n8), pw(a8, m8) + pw(a8, n8), pw(a8, m8 + n8 + 1), pw(a8, m8 + n8 - 1), a8 * (m8 + n8)]),
      ["f(m)·f(n) = aᵐ·aⁿ = aᵐ⁺ⁿ", a8 + sup(m8 + n8) + " = " + pw(a8, m8 + n8)]);
    return Q("f(x) = " + a8 + "ˣ bo'lsa, f(x + " + n8 + ") : f(x) ni toping.", pw(a8, n8), W(pw(a8, n8), [a8 * n8, n8, pw(a8, n8 + 1), a8, pw(a8, n8) + 1].filter(function (x) { return x !== pw(a8, n8); })),
      ["f(x + " + n8 + ")/f(x) = " + a8 + "ˣ⁺" + sup(n8) + "/" + a8 + "ˣ = " + a8 + sup(n8), "= " + pw(a8, n8)]);
  }

  var PB = [[2, [2, 4, 8, 16, 32, 64, 128]], [3, [3, 9, 27, 81, 243]], [5, [5, 25, 125, 625]], [7, [7, 49, 343]], [10, [10, 100, 1000, 10000]], [4, [4, 16, 64, 256]], [6, [6, 36, 216]], [9, [9, 81, 729]], [8, [8, 64, 512]]];
  function t20x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 2, 3] : [2, 3, 4, 4, 5]);
    if (k === 0) { // log qiymati (manfiy va kasr ko'rsatkich bilan)
      var b = pick(PB), a = b[0], n = R(L === 1 ? -2 : -3, b[1].length), arg = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n);
      if (Math.random() < .2) { arg = "√" + a; n = "1/2"; }
      var inv = Math.random() < .25 && typeof n === "number" && n !== 0;
      if (inv) { var res = -n;
        return Q("log_(1/" + a + ") " + arg + " ni hisoblang.", res, W(res, [n, res + 1, res - 1, pw(a, Math.abs(n)), -res * 2]),
          ["(1/" + a + ")" + sup(res) + " = " + arg, "Javob: " + ms(res)]); }
      return Q(lg(a) + " " + arg + " ni hisoblang.", n, W(n, typeof n === "string" ? ["2", "−1/2", "1", "1/" + a] : [-n, n + 1, n - 1, n === 0 ? 1 : 1 / n === Math.round(1 / n) ? 1 / n + 1 : n * 2, a]),
        [typeof n === "string" ? "√" + a + " = " + a + "^(1/2)" : a + sup(n) + " = " + arg, "Javob: " + ms(typeof n === "string" ? 0 : n).replace("0", typeof n === "string" ? n : "0").replace(/^(−?)(\d+)$/, "$1$2")]);
    }
    if (k === 1) { // grafik nuqtadan o'tadi / funksiya qiymati
      var b1 = pick(PB.slice(0, 5)), a1 = b1[0], i1 = R(1, b1[1].length - 1), x1 = b1[1][i1], y1 = i1 + 1, c1 = R(-6, 6);
      if (Math.random() < .5) return Q("y = logₐ x funksiya grafigi (" + x1 + "; " + y1 + ") nuqtadan o'tadi. a ni toping.", a1, W(a1, [x1 / y1 === Math.round(x1 / y1) ? x1 / y1 : a1 + 1, y1, a1 + 1, a1 * a1 < x1 ? a1 * a1 : a1 + 2, x1]),
        ["logₐ " + x1 + " = " + y1 + " → a" + sup(y1) + " = " + x1, "a = " + a1]);
      var v1 = y1 + c1;
      return Q("f(x) = " + lg(a1) + " x" + (c1 > 0 ? " + " + c1 : c1 < 0 ? " − " + (-c1) : "") + " bo'lsa, f(" + x1 + ") ni toping.", v1, W(v1, [y1 - c1, x1 + c1, v1 + 1, v1 - 1, y1]),
        [lg(a1) + " " + x1 + " = " + y1, "f(" + x1 + ") = " + y1 + (c1 >= 0 ? " + " + c1 : " − " + (-c1)) + " = " + ms(v1)]);
    }
    if (k === 2) { // aniqlanish sohasi
      var a2 = pick([2, 3, 5, 10]), kk = R(1, 5), bb = R(-9, 9), kind = R(0, 2), ans, e, w;
      if (kind === 0) { e = poly([kk, -bb]); ans = "(" + F(bb, kk) + "; +∞)"; w = ["[" + F(bb, kk) + "; +∞)", "(−∞; " + F(bb, kk) + ")", "(" + F(-bb, kk) + "; +∞)", "(" + ms(bb) + "; +∞)", "(0; +∞)"]; }
      else if (kind === 1) { e = poly([-kk, bb]).replace(/^−(\d*)x \+ (\d+)$/, "$2 − $1x").replace(/^−(\d*)x − (\d+)$/, "−$2 − $1x"); ans = "(−∞; " + F(bb, kk) + ")"; w = ["(" + F(bb, kk) + "; +∞)", "(−∞; " + F(bb, kk) + "]", "(−∞; " + F(-bb, kk) + ")", "(0; " + F(Math.abs(bb), kk) + ")", "(−∞; +∞)"]; }
      else { var c = R(1, 7); e = "x² − " + c * c; ans = "(−∞; " + ms(-c) + ")∪(" + c + "; +∞)"; w = ["(" + ms(-c) + "; " + c + ")", "(" + c + "; +∞)", "(−∞; " + ms(-c) + "]∪[" + c + "; +∞)", "(" + c * c + "; +∞)", "(0; +∞)"]; }
      return Q("y = " + lg(a2) + "(" + e + ") funksiyaning aniqlanish sohasini toping.", ans, W(ans, w), [e + " > 0", "D(y) = " + ans]);
    }
    if (k === 3) { // qaysi funksiya kamayuvchi
      var inc = ["log₂ x", "log₃ x", "lg x", "ln x", "log₅ x", "log₇ x", "log₁.₅ x"], dec = ["log₀.₅ x", "log_(1/3) x", "log_(2/5) x", "log_(1/2) x", "log₀.₂ x", "log_(3/4) x"];
      var askInc = Math.random() < .5, A3 = pick(askInc ? inc.slice(0, 6) : dec), oth = shuffle(askInc ? dec : inc.slice(0, 6)).slice(0, 4);
      return Q("Qaysi funksiya " + (askInc ? "o'suvchi" : "kamayuvchi") + "?", "y = " + A3, oth.map(function (x) { return "y = " + x; }),
        ["y = logₐ x: a > 1 → o'suvchi, 0 < a < 1 → kamayuvchi", "Javob: y = " + A3]);
    }
    if (k === 4) { // log_(c^p) c^q = q/p
      var cB = pick([2, 3, 5]), pp = R(1, cB === 2 ? 5 : 3), qq = RNZ(-(cB === 2 ? 5 : 3), cB === 2 ? 6 : 4); if (pp === 1 && Math.random() < .7) pp = 2;
      var A4 = pw(cB, pp), B4 = qq >= 0 ? String(pw(cB, qq)) : "1/" + pw(cB, -qq), ans4 = F(qq, pp);
      return Q("log" + sub(A4) + " " + B4 + " ni hisoblang.", ans4, W(ans4, [F(pp, qq), neg(ans4), F(qq + 1, pp), F(qq, pp + 1), String(qq), F(qq * pp, 1)]),
        [A4 + " = " + cB + sup(pp) + ", " + B4 + " = " + cB + sup(qq), "logₐᵖ aᵠ = q/p = " + ans4]);
    }
    // logarifmlarni taqqoslash: qaysi biri manfiy
    var negs = ["log₂ 0,5", "lg 0,01", "log₃ (1/9)", "log₅ 0,2", "log₀.₅ 4", "log_(1/3) 27", "log₂ (1/8)", "log₇ (1/7)"], pos = ["log₂ 3", "lg 20", "log₀.₅ 0,25", "log₃ 10", "log_(1/2) (1/8)", "log₅ 7", "ln 3", "log₀.₂ 0,04"];
    var askNeg = Math.random() < .5, A5 = pick(askNeg ? negs : pos);
    return Q("Qaysi son " + (askNeg ? "manfiy" : "musbat") + "?", A5, shuffle(askNeg ? pos : negs).slice(0, 4),
      ["logₐ b > 0, agar a va b 1 dan bir tomonda bo'lsa", "logₐ b < 0, agar a va b 1 ning turli tomonida bo'lsa", "Javob: " + A5]);
  }

  function t22x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4, 4, 5]);
    var b = pick(PB.slice(0, 7)), a = b[0];
    if (k === 0) { // aˣ = c (c: daraja, 1, kasr)
      var n = R(-3, b[1].length), rhs = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n), flip = Math.random() < .3 && n !== 0;
      var bs = flip ? "(1/" + a + ")" : String(a), ans = flip ? -n : n;
      return Q(bs + "ˣ = " + rhs + " tenglamani yeching.", ans, W(ans, [-ans, ans + 1, ans - 1, n >= 0 ? pw(a, n) / a : -pw(a, -n), 2 * ans || 2]),
        [rhs + " = " + bs + sup(ans), "Asoslar teng → x = " + ms(ans)]);
    }
    if (k === 1) { // a^(kx + b) = c
      var kk = pick([1, 2, 3]), x = R(-3, 4), bb = R(-5, 5), e = kk * x + bb, i = 0;
      while ((e < -2 || e >= b[1].length) && i++ < 30) { x = R(-3, 4); bb = R(-5, 5); e = kk * x + bb; }
      if (e < -2 || e >= b[1].length) return null;
      var rhs1 = e >= 0 ? String(pw(a, e)) : "1/" + pw(a, -e);
      return Q(a + expo(linX(kk, bb)) + " = " + rhs1 + " tenglamani yeching.", x, W(x, [e, x + 1, x - 1, -x, (e + bb) / kk === Math.round((e + bb) / kk) ? (e + bb) / kk : x + 2]),
        [rhs1 + " = " + a + sup(e), linX(kk, bb) + " = " + e, "x = " + ms(x)]);
    }
    if (k === 2) { // A^(mx + p) = B^(nx + q), A = c^s, B = c^t
      var c = pick([2, 3, 5]), s = R(1, 3), t = R(1, 3); if (s === t) t = s + 1;
      var A = pw(c, s), B = pw(c, t), m = R(1, 3), nn = R(1, 3), x2 = R(-4, 5), den = s * m - t * nn;
      if (den === 0) { m = m + 1; den = s * m - t * nn; }
      var p = R(-4, 4), q = (s * (m * x2 + p) - t * nn * x2); if (q % t !== 0) { p = p + (t - ((s * (m * x2 + p) - t * nn * x2) % t + t) % t) / 1; q = s * (m * x2 + p) - t * nn * x2; }
      if (q % t !== 0) return null; q = q / t;
      return Q(A + expo(linX(m, p)) + " = " + B + expo(linX(nn, q)) + " tenglamani yeching.", x2, W(x2, [-x2, x2 + 1, x2 - 1, (q - p) / (m - nn || 1) === Math.round((q - p) / (m - nn || 1)) ? (q - p) / (m - nn || 1) : x2 + 2, x2 * 2]),
        [A + " = " + c + sup(s) + ", " + B + " = " + c + sup(t), s + "(" + linX(m, p) + ") = " + t + "(" + linX(nn, q) + ")", "x = " + ms(x2)]);
    }
    if (k === 3) { // a^(x+p) + a^x = M
      var a3 = pick([2, 3, 5]), p3 = R(1, 3), x3 = R(0, 3), coef = pw(a3, p3) + 1, M = coef * pw(a3, x3);
      return Q(a3 + "ˣ⁺" + sup(p3) + " + " + a3 + "ˣ = " + M + " tenglamani yeching.", x3, W(x3, [x3 + 1, x3 + p3, x3 - 1 >= 0 ? x3 - 1 : x3 + 2, M / coef === x3 ? x3 + 3 : M / coef, p3 === x3 ? x3 + 4 : p3]),
        [a3 + "ˣ·(" + a3 + sup(p3) + " + 1) = " + M, a3 + "ˣ = " + M + " : " + coef + " = " + pw(a3, x3), "x = " + x3]);
    }
    if (k === 4) { // kvadrat: a^(2x) − S·aˣ + P = 0 → ildizlar yig'indisi
      var a4 = pick([2, 3]), u = R(0, 3), v = R(0, 3); if (u === v) v = u + 1;
      var t1 = pw(a4, u), t2 = pw(a4, v), S4 = t1 + t2, P4 = t1 * t2;
      return Q(pw(a4, 2) + "ˣ − " + S4 + "·" + a4 + "ˣ + " + P4 + " = 0 tenglama ildizlari yig'indisini toping.", u + v, W(u + v, [S4, P4, u * v, u + v + 1, Math.abs(u - v)]),
        [a4 + "ˣ = t: t² − " + S4 + "t + " + P4 + " = 0 → t = " + t1 + "; " + t2, "x = " + u + " yoki x = " + v, "Yig'indi: " + (u + v)]);
    }
    // (1/a)^(x) = a^(kx + b)
    var a5 = pick([2, 3, 5]), k5 = R(1, 3), x5 = R(-3, 3), b5 = -x5 - k5 * x5;
    return Q("(1/" + a5 + ")ˣ = " + a5 + expo(linX(k5, b5)) + " tenglamani yeching.", x5, W(x5, [-x5, x5 + 1, x5 - 1, b5, x5 + 2]),
      ["(1/" + a5 + ")ˣ = " + a5 + "⁻ˣ", "−x = " + linX(k5, b5), "x = " + ms(x5)]);
  }

  function t23x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2, 6] : L === 2 ? [0, 2, 3, 3] : [3, 4, 4, 5]);
    var b = pick(PB.slice(0, 5)), a = b[0];
    if (k === 6) { // logₐ(x + c) = 0 yoki 1
      var c6 = RNZ(-9, 9), a6 = R(2, 9), n6 = R(0, 1), x6 = pw(a6, n6) - c6;
      return Q(lg(a6) + "(x " + (c6 > 0 ? "+ " + c6 : "− " + (-c6)) + ") = " + n6 + " tenglamani yeching.", x6, W(x6, [-c6, x6 + 1, n6 - c6 === x6 ? x6 - 1 : n6 - c6, a6 + c6, x6 + a6]),
        ["x " + (c6 > 0 ? "+ " + c6 : "− " + (-c6)) + " = " + a6 + sup(n6) + " = " + pw(a6, n6), "x = " + ms(x6)]);
    }
    if (k === 0) { // logₐ x = n (n manfiy yoki 0 ham)
      if (Math.random() < .5) { a = R(2, 9); b = [a, [a, a * a, a * a * a]]; }
      var n = R(-2, Math.min(4, b[1].length)), ans = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n);
      return Q(lg(a) + " x = " + ms(n) + " tenglamani yeching.", ans, W(ans, [n >= 0 ? a * n : "−" + pw(a, -n), n >= 0 ? pw(n, a) : "−1/" + pw(a, -n), n >= 0 ? pw(a, n + 1) : String(pw(a, -n)), n === 0 ? "0" : n > 0 ? pw(a, n - 1) : "1/" + (a * -n), String(n + a)]),
        ["x = " + a + sup(n), "x = " + ans]);
    }
    if (k === 1) { // logₓ N = n
      var i = R(1, b[1].length - 1), N = b[1][i], n1 = i + 1;
      return Q("log" + sub("x") .replace("x", "ₓ") + " " + N + " = " + n1 + " tenglamani yeching.", a, W(a, [N / n1 === Math.round(N / n1) ? N / n1 : a + 1, pw(N, 1) === N ? N : 1, a + 1, a * n1, n1]),
        ["x" + sup(n1) + " = " + N + ", x > 0, x ≠ 1", "x = " + a]);
    }
    if (k === 2) { // lg x = n yoki ln
      var n2 = R(-3, 4), ans2 = n2 >= 0 ? String(pw(10, n2)) : "0," + new Array(-n2).join("0") + "1";
      return Q("lg x = " + ms(n2) + " tenglamani yeching.", ans2, W(ans2, [n2 >= 0 ? 10 * n2 : "−" + pw(10, -n2), n2 >= 0 ? pw(10, n2 + 1) : "0," + new Array(-n2 + 1).join("0") + "1", n2 >= 0 ? (n2 ? pw(10, n2 - 1) : 0) : String(pw(10, -n2)), String(n2 + 10)]),
        ["lg x = log₁₀ x", "x = 10" + sup(n2) + " = " + ans2]);
    }
    if (k === 3) { // logₐ(kx + c) = n
      var kk = R(1, 5), n3 = R(0, Math.min(3, b[1].length)), val = pw(a, n3), x3 = R(-6, 9), c3 = val - kk * x3;
      return Q(lg(a) + "(" + poly([kk, c3]) + ") = " + n3 + " tenglamani yeching.", x3, W(x3, [(val + c3) / kk === Math.round((val + c3) / kk) ? (val + c3) / kk : x3 + 2, x3 + 1, x3 - 1, (n3 - c3) / kk === Math.round((n3 - c3) / kk) ? (n3 - c3) / kk : -x3, -x3]),
        [poly([kk, c3]) + " = " + a + sup(n3) + " = " + val, (kk === 1 ? "x" : kk + "x") + " = " + (val - c3), "x = " + ms(x3)]);
    }
    if (k === 4) { // logₐ x = logₐ m + logₐ p − logₐ q
      var m4 = R(2, 9), p4 = R(2, 9), q4 = pick([1, 2, 3, 4, 6]); if ((m4 * p4) % q4) q4 = 1;
      var ans4 = m4 * p4 / q4, a4 = pick([2, 3, 5, 7]);
      var e4 = "log" + sub(a4) + " " + m4 + " + log" + sub(a4) + " " + p4 + (q4 > 1 ? " − log" + sub(a4) + " " + q4 : "");
      return Q("log" + sub(a4) + " x = " + e4 + " tenglamani yeching.", ans4, W(ans4, [m4 + p4 - (q4 > 1 ? q4 : 0), m4 * p4 * q4, q4 > 1 ? m4 * p4 : m4 * p4 + 1, m4 + p4, ans4 + 1]),
        ["logₐ m + logₐ p = logₐ(mp), logₐ m − logₐ q = logₐ(m/q)", "x = " + m4 + "·" + p4 + (q4 > 1 ? " : " + q4 : "") + " = " + ans4]);
    }
    // logₐ x + logₐ(x + d) = logₐ N → x(x + d) = N, x > 0
    var x5 = R(1, 8), d5 = R(1, 6), N5 = x5 * (x5 + d5), a5 = pick([2, 3, 5, 6]);
    return Q("log" + sub(a5) + " x + log" + sub(a5) + "(x + " + d5 + ") = log" + sub(a5) + " " + N5 + " tenglamani yeching.", x5, W(x5, [-(x5 + d5), x5 + 1, N5 - d5 > 0 && N5 / 2 !== x5 ? Math.round(N5 / 2) : x5 + 2, d5 === x5 ? x5 + 3 : d5, x5 + d5]),
      ["x(x + " + d5 + ") = " + N5 + " → x² + " + d5 + "x − " + N5 + " = 0", "x₁ = " + x5 + ", x₂ = " + ms(-(x5 + d5)), "ODZ: x > 0 → x = " + x5]);
  }

  function t26x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 2] : [2, 3, 3, 4]);
    var ops = [">", "<", "≥", "≤"];
    function iv(T, op, up) { // up: x > T yo'nalishi (asos > 1 va >)
      var strict = op === ">" || op === "<";
      return up ? (strict ? "(" : "[") + T + "; +∞)" : "(0; " + T + (strict ? ")" : "]");
    }
    if (k === 0 || k === 1) {
      var b = pick(PB.slice(0, 5)), a = b[0], n = R(-2, Math.min(3, b[1].length)), op = pick(ops), small = k === 1;
      var T = small ? (n >= 0 ? (n === 0 ? "1" : "1/" + pw(a, n)) : String(pw(a, -n))) : (n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n));
      var bs = small ? "_(1/" + a + ")" : "", up = (op === ">" || op === "≥") !== small;
      var ans = iv(T, op, up), lb = small ? "log_(1/" + a + ")" : lg(a);
      return Q(lb + " x " + op + " " + ms(n) + " tengsizlikni yeching.", ans, W(ans, [iv(T, op, !up), "(" + T + "; +∞)" === ans ? "[" + T + "; +∞)" : "(" + T + "; +∞)", "(−∞; " + T + ")", iv(String(n), op, up), iv(T, op === ">" ? "≥" : op === "<" ? "≤" : op === "≥" ? ">" : "<", up)]),
        ["ODZ: x > 0", ms(n) + " = " + lb + " " + T, small ? "Asos 1 dan kichik → ishora almashadi" : "Asos 1 dan katta → ishora saqlanadi", "Javob: " + ans]);
    }
    if (k === 2) { // logₐ(x − p) op n
      var a2 = pick([2, 3, 5]), n2 = R(0, 3), p2 = R(-6, 6), op2 = pick([">", "<"]), V = pw(a2, n2) + p2;
      var ans2 = op2 === ">" ? "(" + ms(V) + "; +∞)" : "(" + ms(p2) + "; " + ms(V) + ")";
      return Q(lg(a2) + "(x " + (p2 >= 0 ? "− " + p2 : "+ " + (-p2)) + ") " + op2 + " " + n2 + " tengsizlikni yeching.", ans2,
        W(ans2, [op2 === ">" ? "(" + ms(p2) + "; " + ms(V) + ")" : "(" + ms(V) + "; +∞)", op2 === ">" ? "(" + ms(pw(a2, n2) - p2) + "; +∞)" : "(−∞; " + ms(V) + ")", op2 === ">" ? "[" + ms(V) + "; +∞)" : "(0; " + ms(V) + ")", op2 === ">" ? "(" + ms(n2 * a2 + p2) + "; +∞)" : "(" + ms(p2) + "; " + ms(n2 * a2 + p2) + ")"]),
        ["ODZ: x > " + ms(p2), "x " + (p2 >= 0 ? "− " + p2 : "+ " + (-p2)) + " " + op2 + " " + a2 + sup(n2) + " = " + pw(a2, n2), "Javob: " + ans2]);
    }
    if (k === 3) { // butun yechimlar soni
      var a3 = pick([2, 3]), n3 = R(1, a3 === 2 ? 4 : 2), p3 = R(-5, 5), V3 = pw(a3, n3) + p3, cnt = V3 - p3 - 1;
      return Q(lg(a3) + "(x " + (p3 >= 0 ? "− " + p3 : "+ " + (-p3)) + ") < " + n3 + " tengsizlikning butun yechimlari nechta?", cnt, W(cnt, [cnt + 1, cnt - 1, cnt + 2, V3, pw(a3, n3)]),
        ["ODZ: x > " + ms(p3), "x < " + ms(V3) + " → (" + ms(p3) + "; " + ms(V3) + ")", "Butun sonlar: " + (p3 + 1) + " … " + (V3 - 1) + " → " + cnt + " ta"]);
    }
    // logₐ(x − p) < logₐ(q − x)
    var p4 = R(-6, 4), q4 = p4 + 2 * R(1, 5), m4 = (p4 + q4) / 2, a4 = pick([2, 3, 5, 10]), bigger = Math.random() < .5;
    var ans4 = bigger ? "(" + ms(m4) + "; " + ms(q4) + ")" : "(" + ms(p4) + "; " + ms(m4) + ")";
    return Q(lg(a4) + "(x " + (p4 >= 0 ? "− " + p4 : "+ " + (-p4)) + ") " + (bigger ? ">" : "<") + " " + lg(a4) + "(" + q4 + " − x) tengsizlikni yeching.".replace("(0 − x)", "(−x)"), ans4,
      W(ans4, [bigger ? "(" + ms(p4) + "; " + ms(m4) + ")" : "(" + ms(m4) + "; " + ms(q4) + ")", bigger ? "(" + ms(m4) + "; +∞)" : "(−∞; " + ms(m4) + ")", "(" + ms(p4) + "; " + ms(q4) + ")", bigger ? "(" + ms(m4) + "; " + ms(q4) + "]" : "[" + ms(p4) + "; " + ms(m4) + ")"]),
      ["ODZ: x > " + ms(p4) + " va x < " + q4, "Asos > 1: x " + (p4 >= 0 ? "− " + p4 : "+ " + (-p4)) + " " + (bigger ? ">" : "<") + " " + q4 + " − x → x " + (bigger ? ">" : "<") + " " + ms(m4), "Javob: " + ans4]);
  }

  aug("t19", t19x, sh(.75, .55, .55));
  aug("t20", t20x, sh(.8, .6, .7));
  aug("t22", t22x, sh(.82, .4, .45));
  aug("t23", t23x, sh(.85, .35, .3));
  aug("t26", t26x, sh(.85, .85, .85));

  /* ================= Arifmetika: daraja va karra jadvali ================= */
  function a6x(L) {
    var k = pick([0, 0, 1, 2, 3, 4, 5]), n, a;
    if (k === 0) { n = R(2, 20); a = n * n; return Q(n + "² ni hisoblang.", a, W(a, [2 * n, a + n, (n + 1) * (n + 1), a - n, (n - 1) * (n - 1)]), [n + "² = " + n + "·" + n + " = " + a]); }
    if (k === 1) { n = R(2, 10); a = n * n * n; return Q(n + "³ ni hisoblang.", a, W(a, [3 * n, n * n, a + n * n, (n + 1) * (n + 1) * (n + 1), a - n]), [n + "³ = " + n + "·" + n + "·" + n + " = " + a]); }
    if (k === 2) { n = R(2, 12); var t = R(0, 2);
      if (t === 0) return Q("(−" + n + ")² ni hisoblang.", n * n, W(n * n, [-n * n, -2 * n, 2 * n, n * n + 1]), ["Manfiy sonning juft darajasi musbat", "(−" + n + ")² = " + n * n]);
      if (t === 1) return Q("−" + n + "² ni hisoblang.", -n * n, W(-n * n, [n * n, -2 * n, 2 * n, -n * n - 1]), ["Avval daraja, keyin minus: −(" + n + "²)", "= −" + n * n]);
      var m = Math.min(n, 6); return Q("(−" + m + ")³ ni hisoblang.", -m * m * m, W(-m * m * m, [m * m * m, -3 * m, -m * m, -m * m * m - m]), ["Manfiy sonning toq darajasi manfiy", "(−" + m + ")³ = −" + m * m * m]); }
    if (k === 3) { var bs = pick([2, 2, 3, 10]), e = bs === 2 ? R(4, 10) : bs === 3 ? R(3, 5) : R(2, 6); a = pw(bs, e);
      return Q(bs + sup(e) + " ni hisoblang.", a, W(a, [bs * e, pw(bs, e - 1), pw(bs, e + 1), a + bs]), [bs + " ni " + e + " marta ko'paytiramiz", "= " + a]); }
    if (k === 4) { var t4 = R(0, 2), e4 = R(2, 60), b4 = R(2, 30);
      if (t4 === 0) return Q("1" + sup(e4) + " ni hisoblang.", 1, W(1, [e4, 0, e4 + 1, 2]), ["1 ning har qanday darajasi 1 ga teng"]);
      if (t4 === 1) return Q("0" + sup(Math.min(e4, 12)) + " ni hisoblang.", 0, W(0, [1, Math.min(e4, 12), -1, 10]), ["0 ning musbat darajasi 0 ga teng"]);
      return Q(b4 + "¹ ni hisoblang.", b4, W(b4, [1, 0, b4 * b4, b4 + 1]), ["Sonning birinchi darajasi o'ziga teng"]); }
    n = R(2, 15); a = n * n;
    return Q("x² = " + a + " bo'lsa, natural x ni toping.", n, W(n, [a / 2 === Math.round(a / 2) ? a / 2 : n + 2, n + 1, n - 1, 2 * n]), [n + "·" + n + " = " + a, "x = " + n]);
  }
  function a7x(L) {
    var a = R(1, 10), b = R(1, 10), c = a * b, k = pick([0, 0, 1, 2]);
    if (k === 0) return Q(a + " × " + b + " = ?", c, W(c, [c + a, c - b, a + b, c + 1, c - 1, (a + 1) * b].filter(function (x) { return x > 0; })), [a + " × " + b + " = " + c]);
    if (k === 1) return Q(a + " × ? = " + c, b, W(b, [b + 1, b - 1 || b + 2, c - a > 0 ? c - a : b + 3, a]), [a + " × " + b + " = " + c, "Javob: " + b]);
    return Q(c + " : " + a + " = ?", b, W(b, [b + 1, b - 1 || b + 2, a === b ? b + 3 : a, c - a > 0 ? c - a : b + 4]), [a + " × " + b + " = " + c + " → " + c + " : " + a + " = " + b]);
  }

  /* ---------- t53: modulli tenglama va tengsizliklar ---------- */
  function xm(a) { return a === 0 ? "x" : "x " + (a > 0 ? "− " + a : "+ " + (-a)); }
  function t53x(L) {
    var k = pick([0, 0, 1, 2, 3, 4, 5]), a = RNZ(-8, 8), c = R(1, 9);
    if (k === 0) { var op = pick(["<", "≤", ">", "≥"]), st = op === "<" || op === ">", lo = a - c, hi = a + c, ans;
      if (op === "<" || op === "≤") ans = (st ? "(" : "[") + ms(lo) + "; " + ms(hi) + (st ? ")" : "]");
      else ans = "(−∞; " + ms(lo) + (st ? ")" : "]") + "∪" + (st ? "(" : "[") + ms(hi) + "; +∞)";
      var inner = (st ? "(" : "[") + ms(lo) + "; " + ms(hi) + (st ? ")" : "]"), outer = "(−∞; " + ms(lo) + (st ? ")" : "]") + "∪" + (st ? "(" : "[") + ms(hi) + "; +∞)";
      return Q("|" + xm(a) + "| " + op + " " + c + " tengsizlikni yeching.", ans, W(ans, [ans === inner ? outer : inner, "(" + ms(-a - c) + "; " + ms(-a + c) + ")", "(" + ms(-c) + "; " + c + ")", (st ? "[" : "(") + ms(lo) + "; " + ms(hi) + (st ? "]" : ")"), "(−∞; " + ms(hi) + ")"]),
        [op === "<" || op === "≤" ? "−" + c + " " + op + " " + xm(a) + " " + op + " " + c : xm(a) + " " + op + " " + c + " yoki " + xm(a) + " " + (op === ">" ? "<" : "≤") + " −" + c, "Javob: " + ans]);
    }
    if (k === 1) { var kk = R(2, 5), b = RNZ(-9, 9), lo1 = F(b - c, kk), hi1 = F(b + c, kk), ans1 = "[" + lo1 + "; " + hi1 + "]";
      return Q("|" + poly([kk, -b]) + "| ≤ " + c + " tengsizlikni yeching.", ans1, W(ans1, ["[" + ms(b - c) + "; " + ms(b + c) + "]", "(" + lo1 + "; " + hi1 + ")", "[" + F(-b - c, kk) + "; " + F(-b + c, kk) + "]", "(−∞; " + lo1 + "]∪[" + hi1 + "; +∞)", "[" + F(-c, kk) + "; " + F(c, kk) + "]"]),
        ["−" + c + " ≤ " + poly([kk, -b]) + " ≤ " + c, ms(b - c) + " ≤ " + kk + "x ≤ " + ms(b + c), "Javob: " + ans1]);
    }
    if (k === 2) { var strict = Math.random() < .5, n2 = strict ? 2 * c - 1 : 2 * c + 1;
      return Q("|" + xm(a) + "| " + (strict ? "<" : "≤") + " " + c + " tengsizlikning butun yechimlari nechta?", n2, W(n2, [strict ? 2 * c + 1 : 2 * c - 1, 2 * c, c, n2 + 2, c + 1]),
        ["Yechim: " + (strict ? "(" : "[") + ms(a - c) + "; " + ms(a + c) + (strict ? ")" : "]"), "Butun sonlar: " + ms(strict ? a - c + 1 : a - c) + " … " + ms(strict ? a + c - 1 : a + c), "Soni: " + n2]);
    }
    if (k === 3) { var p = R(-9, 9), q = R(-9, 9); if (p === q) q = p + R(1, 6);
      var x3 = F(p + q, 2);
      return Q("|" + xm(p) + "| = |" + xm(q) + "| tenglamani yeching.", x3, W(x3, [F(p - q, 2), F(q - p, 2), F(-p - q, 2), F(p + q, 1), "0"]),
        [xm(p) + " = −(" + xm(q) + ") (chunki " + xm(p) + " = " + xm(q) + " yechimga ega emas)", "2x = " + ms(p + q) + " → x = " + x3]);
    }
    if (k === 4) { var k4 = pick([2, 2, 3, 4]), b4 = RNZ(-9, 9), c4 = R(1, 9), r1 = F(b4 - c4, k4), r2 = F(b4 + c4, k4), ans4 = r1 + "; " + r2;
      return Q("|" + poly([k4, -b4]) + "| = " + c4 + " tenglamani yeching.", ans4, W(ans4, [F(b4 + c4, k4), F(-b4 - c4, k4) + "; " + F(-b4 + c4, k4), ms(b4 - c4) + "; " + ms(b4 + c4), F(c4, k4) + "; " + F(-c4, k4), r1]),
        [poly([k4, -b4]) + " = " + c4 + " yoki " + poly([k4, -b4]) + " = −" + c4, "x = " + r2 + " yoki x = " + r1]);
    }
    var p5 = R(-9, 9), q5 = R(-9, 9); if (p5 === q5) q5 = p5 + R(1, 7);
    var m5 = Math.abs(p5 - q5);
    return Q("f(x) = |" + xm(p5) + "| + |" + xm(q5) + "| funksiyaning eng kichik qiymatini toping.", m5, W(m5, [0, Math.abs(p5 + q5), m5 + 1, Math.min(Math.abs(p5), Math.abs(q5)), 2 * m5]),
      ["Sonlar o'qida: x dan " + ms(p5) + " va " + ms(q5) + " gacha masofalar yig'indisi", "Eng kichigi x ∈ [" + ms(Math.min(p5, q5)) + "; " + ms(Math.max(p5, q5)) + "] da: " + m5]);
  }

  /* ---------- t57: o'rta qiymatlar ---------- */
  var HM = [], QM = [];
  (function () { for (var p = 2; p <= 60; p++) for (var q = p + 1; q <= 90; q++) { if ((2 * p * q) % (p + q) === 0) HM.push([p, q]); var s = (p * p + q * q) / 2, r = Math.round(Math.sqrt(s)); if (r * r === s && q <= 50) QM.push([p, q, r]); } })();
  function t57x(L) {
    var k = pick([0, 1, 2, 3, 4, 5]);
    if (k === 0) { var n = R(4, 7), M = R(5, 40), xs = [], s = 0; for (var i = 0; i < n - 1; i++) { var v = M + R(-9, 9); xs.push(v); s += v; }
      var miss = n * M - s; if (miss <= 0) return null;
      return Q(n + " ta sonning arifmetik o'rtasi " + M + ". Ulardan " + (n - 1) + " tasi: " + xs.join("; ") + ". Qolgan sonni toping.", miss, W(miss, [M, n * M - s + M - miss === 0 ? miss + 1 : miss + 1, Math.round(s / (n - 1)), miss - 1, n * M]),
        ["Yig'indi: " + n + "·" + M + " = " + n * M, "Ma'lum sonlar yig'indisi: " + s, "Javob: " + (n * M) + " − " + s + " = " + miss]);
    }
    if (k === 1) { var p = pick([1, 2, 3, 5, 6]), s1 = R(1, 6), t1 = R(1, 7); if (s1 === t1) t1 = s1 + 1;
      var A = p * s1 * s1, B = p * t1 * t1, gm = p * s1 * t1;
      return Q(A + " va " + B + " sonlarining geometrik o'rtasini toping.", gm, W(gm, [(A + B) / 2 === Math.round((A + B) / 2) ? (A + B) / 2 : gm + 2, gm + 1, gm - 1, A * B, Math.round(Math.sqrt(A + B))]),
        ["G = √(a·b) = √(" + A + "·" + B + ") = √" + A * B, "G = " + gm]);
    }
    if (k === 2) { var h = pick(HM), hm = 2 * h[0] * h[1] / (h[0] + h[1]);
      return Q(h[0] + " va " + h[1] + " sonlarining garmonik o'rtasini toping.", hm, W(hm, [(h[0] + h[1]) / 2 === Math.round((h[0] + h[1]) / 2) ? (h[0] + h[1]) / 2 : hm + 1, hm + 1, hm - 1, h[0] * h[1] / (h[0] + h[1]) === Math.round(h[0] * h[1] / (h[0] + h[1])) ? h[0] * h[1] / (h[0] + h[1]) : hm + 2]),
        ["H = 2ab/(a + b) = 2·" + h[0] + "·" + h[1] + "/(" + h[0] + " + " + h[1] + ")", "= " + 2 * h[0] * h[1] + "/" + (h[0] + h[1]) + " = " + hm]);
    }
    if (k === 3) { // vaznli o'rtacha
      var m = R(55, 80), g = R(3, 8), u = R(1, 4), v = R(1, 4); if (u === v) v = u === 4 ? 3 : u + 1;
      var a = g * u, b = g * v, t = R(1, 3), d = t * v, x = m + d, y = m - t * u;
      var naive = (x + y) / 2;
      return Q("Sinfda " + a + " ta o'quvchining o'rtacha bali " + x + ", " + b + " ta o'quvchiniki " + y + ". Hammasining o'rtacha balini toping.", m, W(m, [naive === Math.round(naive) && naive !== m ? naive : m + 2, m + 1, m - 1, Math.round((x * b + y * a) / (a + b)) === m ? m - 2 : Math.round((x * b + y * a) / (a + b))]),
        ["Umumiy ball: " + a + "·" + x + " + " + b + "·" + y + " = " + (a * x + b * y), "O'quvchilar: " + (a + b), "O'rtacha: " + (a * x + b * y) + " : " + (a + b) + " = " + m]);
    }
    if (k === 4) { var qm = pick(QM);
      return Q(qm[0] + " va " + qm[1] + " sonlarining o'rta kvadratik qiymatini toping.", qm[2], W(qm[2], [(qm[0] + qm[1]) / 2 === Math.round((qm[0] + qm[1]) / 2) ? (qm[0] + qm[1]) / 2 : qm[2] + 1, qm[2] + 1, qm[2] - 1, (qm[0] * qm[0] + qm[1] * qm[1]) / 2]),
        ["Q = √((a² + b²)/2) = √((" + qm[0] * qm[0] + " + " + qm[1] * qm[1] + ")/2)", "= √" + (qm[0] * qm[0] + qm[1] * qm[1]) / 2 + " = " + qm[2]]);
    }
    var n5 = R(4, 9), M5 = R(10, 40), N5 = M5 + RNZ(-4, 4), x5 = (n5 + 1) * N5 - n5 * M5; if (x5 <= 0) return null;
    return Q(n5 + " ta sonning arifmetik o'rtasi " + M5 + ". Ularga yana bitta son qo'shilsa, o'rtacha " + N5 + " bo'ldi. Qo'shilgan sonni toping.", x5,
      W(x5, [N5, (N5 - M5) * n5, x5 + N5 - M5, n5 * N5 - n5 * M5 + M5 === x5 ? x5 + 1 : n5 * N5 - n5 * M5 + M5, x5 - 1]),
      ["Avvalgi yig'indi: " + n5 + "·" + M5 + " = " + n5 * M5, "Yangi yig'indi: " + (n5 + 1) + "·" + N5 + " = " + (n5 + 1) * N5, "Qo'shilgan son: " + x5]);
  }

  /* ---------- t60: hosila ---------- */
  function polyS(cs) { // superscript darajali ko'phad: 3x⁴ − 2x² + 5
    var deg = cs.length - 1, out = "";
    cs.forEach(function (c, i) {
      var p = deg - i; if (c === 0) return;
      var ac = Math.abs(c), co = ac === 1 && p > 0 ? "" : String(ac);
      out += (c < 0 ? (out ? " − " : "−") : (out ? " + " : "")) + (p === 0 ? String(ac) : co + "x" + (p === 1 ? "" : sup(p)));
    });
    return out || "0";
  }
  function der(cs) { var d = cs.length - 1, o = []; for (var i = 0; i < d; i++) o.push(cs[i] * (d - i)); return o.length ? o : [0]; }
  function pval(cs, x) { var v = 0; cs.forEach(function (c) { v = v * x + c; }); return v; }
  function t60x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2, 3] : L === 2 ? [4, 4, 5, 6, 1] : [5, 6, 7, 7]);
    if (k === 0) { var c = RNZ(-9, 9), n = R(2, 7), cs = [c].concat(new Array(n).join("0").split("").map(Number)), d = der(cs), a = polyS(d);
      return Q("y = " + polyS(cs) + " funksiyaning hosilasini toping.", a, W(a, [polyS([c * (n + 1)].concat(new Array(n + 1).join("0").split("").map(Number)).slice(0, n + 1)), polyS([c].concat(new Array(n).join("0").split("").map(Number)).slice(0, n)), polyS([c * n].concat(new Array(n + 1).join("0").split("").map(Number)).slice(0, n + 1)), polyS([c * (n - 1)].concat(new Array(n - 1).join("0").split("").map(Number)))]),
        ["(c·xⁿ)' = c·n·xⁿ⁻¹", "y' = " + ms(c) + "·" + n + "·x" + (n - 1 === 1 ? "" : sup(n - 1)) + " = " + a]);
    }
    if (k === 1) { var n1 = R(2, 5), c1 = RNZ(-9, 9), b1 = R(-9, 9), cs1 = [1].concat(new Array(n1 - 1).join("0").split("").map(Number)).concat([c1, b1]), d1 = polyS(der(cs1));
      return Q("y = " + polyS(cs1) + " funksiyaning hosilasini toping.", d1, W(d1, [polyS(der(cs1).slice(0, -1).concat([c1 + b1])), polyS(der(cs1).concat([b1])), polyS([n1 + 1].concat(new Array(n1).join("0").split("").map(Number)).concat([c1])), polyS(der(cs1).slice(0, -1).concat([-c1]))]),
        ["(xⁿ)' = n·xⁿ⁻¹, (kx)' = k, (o'zgarmas)' = 0", "y' = " + d1]);
    }
    if (k === 2) { var c2 = RNZ(-6, 6), n2 = R(2, 4), x2 = RNZ(-3, 3), cs2 = [c2].concat(new Array(n2).join("0").split("").map(Number)), v2 = pval(der(cs2), x2);
      return Q("y = " + polyS(cs2) + " bo'lsa, y'(" + ms(x2) + ") ni toping.", v2, W(v2, [pval(cs2, x2), -v2, c2 * n2 * x2, v2 + c2, c2 * pw(x2, n2 - 1)]),
        ["y' = " + polyS(der(cs2)), "y'(" + ms(x2) + ") = " + v2]);
    }
    if (k === 3) { var T = pick([["1/x", "−1/x²", ["1/x²", "−1/x", "ln x"]], ["√x", "1/(2√x)", ["2√x", "1/√x", "√x/2"]], ["2√x", "1/√x", ["1/(2√x)", "√x", "4√x"]], ["3/x", "−3/x²", ["3/x²", "−3/x", "3"]], ["x⁻²", "−2x⁻³", ["−2x⁻¹", "2x⁻³", "−x⁻³"]], ["−1/x", "1/x²", ["−1/x²", "1/x", "−ln x"]], ["5/x", "−5/x²", ["5/x²", "−5/x", "5"]], ["eˣ + x", "eˣ + 1", ["eˣ", "xeˣ⁻¹ + 1", "eˣ + x"]], ["sin x + cos x", "cos x − sin x", ["cos x + sin x", "−cos x + sin x", "sin x − cos x"]], ["2sin x", "2cos x", ["−2cos x", "2sin x", "cos 2x"]], ["3cos x", "−3sin x", ["3sin x", "−3cos x", "−sin 3x"]], ["ln x + x²", "1/x + 2x", ["1/x + x", "ln x + 2x", "x + 2x"]]]);
      var t3 = T; return Q("y = " + t3[0] + " funksiyaning hosilasini toping.", t3[1], t3[2], ["Hosilalar jadvali", "y' = " + t3[1]]);
    }
    if (k === 4) { var cs4 = [RNZ(-5, 5), R(-9, 9), R(-9, 9), R(-9, 9)], d4 = polyS(der(cs4));
      return Q("y = " + polyS(cs4) + " funksiyaning hosilasini toping.", d4, W(d4, [polyS(der(cs4).slice(0, 2).concat([der(cs4)[2] + cs4[3]])), polyS([cs4[0] * 3, cs4[1], cs4[2]]), polyS(der(cs4).map(function (v, i) { return i === 1 ? -v : v; })), polyS([cs4[0] * 3, cs4[1] * 2, cs4[2], cs4[3]]), polyS([cs4[0], cs4[1], cs4[2]])]),
        ["Har bir hadning hosilasini topamiz", "y' = " + d4]);
    }
    if (k === 5) { var cs5 = [RNZ(-3, 3), R(-6, 6), R(-9, 9), R(-9, 9)], x5 = RNZ(-3, 3), v5 = pval(der(cs5), x5);
      return Q("y = " + polyS(cs5) + " bo'lsa, y'(" + ms(x5) + ") ni toping.", v5, W(v5, [pval(cs5, x5), v5 + cs5[2], -v5, v5 + 2 * cs5[1] * x5 === v5 ? v5 + 1 : v5 - cs5[1] * x5, v5 - 1]),
        ["y' = " + polyS(der(cs5)), "y'(" + ms(x5) + ") = " + v5]);
    }
    if (k === 6) { var cs6 = [R(1, 3) * pick([1, -1]), R(-8, 8), R(-9, 9)], x6 = R(-4, 4), sl = pval(der(cs6), x6);
      return Q("y = " + polyS(cs6) + " funksiya grafigiga x₀ = " + ms(x6) + " nuqtada o'tkazilgan urinmaning burchak koeffitsiyentini toping.", sl, W(sl, [pval(cs6, x6), -sl, sl + cs6[1], 2 * cs6[0] * x6, sl + 1]),
        ["Urinma burchak koeffitsiyenti k = y'(x₀)", "y' = " + polyS(der(cs6)), "k = " + sl]);
    }
    // kritik nuqtalar: y = x³ − 3p²x + c → x = ±p ; y = ax² + bx + c ning kritik nuqtasi
    if (Math.random() < .5) { var p7 = R(1, 5), c7 = R(-9, 9), cs7 = [1, 0, -3 * p7 * p7, c7], a7 = ms(-p7) + "; " + p7;
      return Q("y = " + polyS(cs7) + " funksiyaning kritik nuqtalarini toping.", a7, W(a7, [String(p7), ms(-p7) + "; 0; " + p7, ms(-3 * p7) + "; " + 3 * p7, ms(-p7 * p7) + "; " + p7 * p7, "0; " + p7]),
        ["y' = " + polyS(der(cs7)) + " = 0", "x² = " + p7 * p7 + " → x = ±" + p7]); }
    var a8 = RNZ(-4, 4), x8 = RNZ(-5, 5), b8 = -2 * a8 * x8, c8 = R(-9, 9), cs8 = [a8, b8, c8], y8 = pval(cs8, x8), mx = a8 < 0;
    return Q("y = " + polyS(cs8) + " funksiyaning ekstremum nuqtasini toping.", "x = " + ms(x8), W("x = " + ms(x8), ["x = " + ms(-x8), "x = " + ms(y8), "x = " + ms(b8), "x = " + ms(x8 + 1), "x = " + ms(2 * x8)]),
      ["y' = " + polyS(der(cs8)) + " = 0", "x = " + ms(x8) + " (" + (mx ? "maksimum" : "minimum") + ")"]);
  }

  /* ---------- t65: aniqlanish sohasi ---------- */
  function t65x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 7] : L === 2 ? [0, 1, 3, 4, 7] : [3, 4, 5, 6, 6]);
    var c = R(1, 9), p = R(-9, 9), q = p + R(1, 9);
    if (k === 0) { var a = "x ≠ ±" + c;
      return Q("y = 1/(x² − " + c * c + ") funksiyaning aniqlanish sohasini toping.", a, ["x ≠ " + c, "x ≠ " + c * c, "x > " + c, "x ≠ 0"], ["x² − " + c * c + " ≠ 0", "x ≠ ±" + c]); }
    if (k === 1) { var kk = R(2, 5), b = RNZ(-9, 9), ans = "[" + F(b, kk) + "; +∞)";
      return Q("y = √(" + poly([kk, -b]) + ") funksiyaning aniqlanish sohasini toping.", ans, W(ans, ["(" + F(b, kk) + "; +∞)", "(−∞; " + F(b, kk) + "]", "[" + F(-b, kk) + "; +∞)", "[" + ms(b) + "; +∞)", "[" + F(kk, b) + "; +∞)"]),
        [poly([kk, -b]) + " ≥ 0", "x ≥ " + F(b, kk), "D(y) = " + ans]); }
    if (k === 2) { var a2 = "[−" + c + "; " + c + "]";
      return Q("y = √(" + c * c + " − x²) funksiyaning aniqlanish sohasini toping.", a2, W(a2, ["(−" + c + "; " + c + ")", "(−∞; −" + c + "]∪[" + c + "; +∞)", "[0; " + c + "]", "[−" + c * c + "; " + c * c + "]"]),
        [c * c + " − x² ≥ 0 → x² ≤ " + c * c, "−" + c + " ≤ x ≤ " + c]); }
    if (k === 3) { var a3 = "x ≠ " + ms(p) + ", x ≠ " + ms(q);
      return Q("y = 5/((" + xm(p) + ")(" + xm(q) + ")) funksiyaning aniqlanish sohasini toping.", a3, W(a3, ["x ≠ " + ms(-p) + ", x ≠ " + ms(-q), "x ≠ " + ms(p), "x > " + ms(q), "x ≠ " + ms(p) + ", x ≠ " + ms(-q)]),
        ["Maxraj ≠ 0: (" + xm(p) + ")(" + xm(q) + ") ≠ 0", a3]); }
    if (k === 4) { var a4 = "[" + ms(p) + "; " + ms(q) + "]";
      return Q("y = √(" + xm(p) + ") + √(" + q + " − x) funksiyaning aniqlanish sohasini toping.".replace("√(0 − x)", "√(−x)"), a4, W(a4, ["(" + ms(p) + "; " + ms(q) + ")", "[" + ms(-p) + "; " + ms(-q) + "]", "[" + ms(p) + "; +∞)", "(−∞; " + ms(q) + "]", "[" + ms(-q) + "; " + ms(-p) + "]"].map(function (x) { return x; }).filter(function (x) { return !/\[(−?\d+); \1\]/.test(x) || true; })),
        [xm(p) + " ≥ 0 va " + q + " − x ≥ 0", ms(p) + " ≤ x ≤ " + ms(q)]); }
    if (k === 5) { var p5 = R(1, 9), a5 = "[0; " + p5 + ")∪(" + p5 + "; +∞)";
      return Q("y = √x + 1/(x − " + p5 + ") funksiyaning aniqlanish sohasini toping.", a5, W(a5, ["[0; +∞)", "(0; " + p5 + ")∪(" + p5 + "; +∞)", "(−∞; " + p5 + ")∪(" + p5 + "; +∞)", "[" + p5 + "; +∞)", "(" + p5 + "; +∞)"]),
        ["x ≥ 0 va x ≠ " + p5, "D(y) = " + a5]); }
    if (k === 6) { var a6 = "(" + ms(p) + "; " + ms(q) + "]";
      return Q("y = lg(" + xm(p) + ") + √(" + q + " − x) funksiyaning aniqlanish sohasini toping.".replace("√(0 − x)", "√(−x)"), a6, W(a6, ["[" + ms(p) + "; " + ms(q) + "]", "(" + ms(p) + "; " + ms(q) + ")", "[" + ms(p) + "; " + ms(q) + ")", "(" + ms(p) + "; +∞)", "(−∞; " + ms(q) + "]"]),
        [xm(p) + " > 0 va " + q + " − x ≥ 0", ms(p) + " < x ≤ " + ms(q)]); }
    var p7 = R(1, 12), a7 = "(−∞; " + p7 + ")";
    return Q("y = 1/√(" + p7 + " − x) funksiyaning aniqlanish sohasini toping.", a7, W(a7, ["(−∞; " + p7 + "]", "(" + p7 + "; +∞)", "[" + p7 + "; +∞)", "x ≠ " + p7]),
      [p7 + " − x > 0 (ildiz maxrajda)", "x < " + p7]);
  }

  /* ---------- t70: aniqmas integral ---------- */
  function mono(n, d, p, first) { // (n/d)·xᵖ ko'rinishi: 3x⁴/4, −x²/2, 5x
    var g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; }
    var an = Math.abs(n), body = (an === 1 && p > 0 ? "" : String(an)) + (p > 0 ? "x" + (p === 1 ? "" : sup(p)) : "") + (d === 1 ? "" : "/" + d);
    return first ? (n < 0 ? "−" : "") + body : (n < 0 ? " − " : " + ") + body;
  }
  function antider(cs) { // ko'phad koeffitsiyentlari → boshlang'ich funksiya satri
    var deg = cs.length - 1, out = "";
    cs.forEach(function (c, i) { var p = deg - i + 1; if (!c) return; out += mono(c, p, p, !out); });
    return (out || "0") + " + C";
  }
  function t70x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [0, 1, 2, 3, 3, 4] : [3, 4, 5, 5, 6]);
    if (k === 0) { var c = RNZ(-9, 9), n = R(0, 6), cs = [c].concat(new Array(n + 1).join("0").split("").map(Number)), a = antider(cs);
      return Q("∫" + (c === 1 ? "" : c === -1 ? "−" : ms(c)) + (n === 0 ? (Math.abs(c) === 1 ? "1" : "") : "x" + (n === 1 ? "" : sup(n))) + " dx ni toping.", a,
        W(a, [mono(c * n, 1, n - 1 < 0 ? 0 : n - 1, true) + " + C", mono(c, 1, n + 1, true) + " + C", mono(c, n || 1, n + 1, true) + " + C", mono(c, n + 2, n + 1, true) + " + C", mono(c, n + 1, n, true) + " + C"]),
        ["∫xⁿ dx = xⁿ⁺¹/(n + 1) + C", "= " + a]);
    }
    if (k === 1) { var a1 = RNZ(-6, 6), b1 = RNZ(-9, 9), r1 = antider([a1, b1]);
      return Q("∫(" + polyS([a1, b1]) + ") dx ni toping.", r1, W(r1, [antider([a1 * 2, b1]).replace(/\/2/, ""), polyS([a1, b1, 0]) + " + C", mono(a1, 2, 2, true) + " + " + b1 + " + C", String(a1) + " + C", antider([a1, 0]).replace(" + C", "") + mono(b1, 1, 0, false) + " + C"]),
        ["∫ax dx = ax²/2, ∫b dx = bx", "= " + r1]);
    }
    if (k === 2) { var kk = R(2, 5), T = pick([["cos " + kk + "x", "(1/" + kk + ")·sin " + kk + "x + C", ["sin " + kk + "x + C", kk + "·sin " + kk + "x + C", "−(1/" + kk + ")·sin " + kk + "x + C"]],
        ["sin " + kk + "x", "−(1/" + kk + ")·cos " + kk + "x + C", ["(1/" + kk + ")·cos " + kk + "x + C", "−cos " + kk + "x + C", kk + "·cos " + kk + "x + C"]],
        ["e" + sup(kk + "x"), "(1/" + kk + ")·e" + sup(kk + "x") + " + C", ["e" + sup(kk + "x") + " + C", kk + "·e" + sup(kk + "x") + " + C", "e" + sup(kk + "x") + "/(" + kk + "x) + C"]],
        [kk + "/x", kk + "·ln|x| + C", ["ln|" + kk + "x| + C", "−" + kk + "/x² + C", kk + "x + C"]],
        ["1/x²", "−1/x + C", ["1/x + C", "−2/x³ + C", "ln x² + C"]],
        [kk + "eˣ", kk + "eˣ + C", ["eˣ + C", kk + "xeˣ + C", "(1/" + kk + ")eˣ + C"]],
        [kk + "cos x", kk + "·sin x + C", ["−" + kk + "·sin x + C", "sin " + kk + "x + C", kk + "·cos x + C"]]]);
      return Q("∫" + T[0] + " dx ni toping.", T[1], T[2], ["Jadval integrali", "= " + T[1]]);
    }
    if (k === 3) { var cs3 = [RNZ(-6, 6), RNZ(-8, 8), R(-9, 9)], r3 = antider(cs3);
      return Q("∫(" + polyS(cs3) + ") dx ni toping.", r3, W(r3, [polyS(der(cs3)) + " + C", antider([cs3[0], cs3[1], 0]).replace(" + C", "") + " + C", polyS(cs3.concat([0])) + " + C", antider([cs3[0], -cs3[1], cs3[2]]), antider([cs3[0] * 3, cs3[1] * 2, cs3[2]])]),
        ["Har bir hadni alohida integrallaymiz", "= " + r3]);
    }
    if (k === 4) { // boshlang'ich funksiya shart bilan
      var a4 = RNZ(-4, 4), b4 = R(-6, 6), x4 = R(-2, 3), y4 = R(-9, 9);
      var cs4 = [2 * a4, b4], Fv = a4 * x4 * x4 + b4 * x4, C4 = y4 - Fv, ans4 = polyS([a4, b4, C4]);
      return Q("f(x) = " + polyS(cs4) + " funksiyaning F(" + ms(x4) + ") = " + ms(y4) + " shartni qanoatlantiruvchi boshlang'ichini toping.", "F(x) = " + ans4,
        W("F(x) = " + ans4, ["F(x) = " + polyS([a4, b4, y4]), "F(x) = " + polyS([2 * a4, b4, C4]), "F(x) = " + polyS([a4, b4, -C4]), "F(x) = " + polyS([a4, b4, C4 + 1])]),
        ["F(x) = " + polyS([a4, b4]) .replace(/^/, "") + "… → F(x) = " + polyS([a4, b4, 0]) + " + C", "F(" + ms(x4) + ") = " + Fv + " + C = " + ms(y4) + " → C = " + C4, "F(x) = " + ans4]);
    }
    if (k === 5) { // qaysi biri boshlang'ich
      var a5 = R(1, 5), n5 = R(1, 4), c5 = R(1, 9), fx = polyS([a5 * (n5 + 1)].concat(new Array(n5 + 1).join("0").split("").map(Number))), good = polyS([a5].concat(new Array(n5 + 1).join("0").split("").map(Number)).concat([c5]));
      var bad = [polyS([a5 * (n5 + 1)].concat(new Array(n5 + 2).join("0").split("").map(Number))), polyS([a5 * (n5 + 1) * n5].concat(new Array(n5).join("0").split("").map(Number))), polyS([a5].concat(new Array(n5).join("0").split("").map(Number)).concat([c5])), polyS([a5 * (n5 + 2)].concat(new Array(n5 + 2).join("0").split("").map(Number)))];
      return Q("Qaysi funksiya f(x) = " + fx + " ning boshlang'ich funksiyasi?", good, W(good, bad), ["F'(x) = f(x) bo'lishi kerak", "(" + good + ")' = " + fx]);
    }
    var a6 = RNZ(-6, 6), b6 = R(2, 6), r6 = (a6 === 1 ? "" : a6 === -1 ? "−" : ms(a6)) + "ln|x|" + mono(b6, 2, 2, false) + " + C";
    return Q("∫(" + a6 + "/x + " + b6 + "x) dx ni toping.".replace("(1/x", "(1/x").replace("(−1/x", "(−1/x"), r6,
      W(r6, [(a6 === 1 ? "" : a6 === -1 ? "−" : ms(a6)) + "ln|x|" + mono(b6, 1, 2, false) + " + C", mono(-a6, 1, 0, true) + "/x²" + mono(b6, 2, 2, false) + " + C", (a6 === 1 ? "" : a6 === -1 ? "−" : ms(a6)) + "x" + mono(b6, 2, 2, false) + " + C", (a6 === 1 ? "" : a6 === -1 ? "−" : ms(a6)) + "ln|x| + " + b6 + " + C"]),
      ["∫(1/x) dx = ln|x|, ∫x dx = x²/2", "= " + r6]);
  }

  /* ---------- t7: grafik almashtirishlar ---------- */
  var FX = [["x²", function (u) { return "(" + u + ")²"; }], ["|x|", function (u) { return "|" + u + "|"; }], ["√x", function (u) { return "√(" + u + ")"; }], ["x³", function (u) { return "(" + u + ")³"; }], ["1/x", function (u) { return "1/(" + u + ")"; }], ["2ˣ", function (u) { return "2^(" + u + ")"; }]];
  function shiftF(f, a, b) { var s = f[1](xm(a)); return "y = " + s + (b > 0 ? " + " + b : b < 0 ? " − " + (-b) : ""); }
  function dirS(a, b) { return (a > 0 ? "o'ngga " + a : "chapga " + (-a)) + " va " + (b > 0 ? "yuqoriga " + b : "pastga " + (-b)); }
  function t7x(L) {
    var k = pick(L === 1 ? [0, 1, 4] : L === 2 ? [0, 1, 2, 4] : [1, 2, 3, 5]), f = pick(FX), a = RNZ(-6, 6), b = RNZ(-6, 6);
    if (k === 0) { var ans = shiftF(f, a, b);
      return Q("y = " + f[0] + " grafigi " + dirS(a, b) + " birlik siljitildi. Hosil bo'lgan funksiyani toping.", ans, W(ans, [shiftF(f, -a, b), shiftF(f, a, -b), shiftF(f, -a, -b), shiftF(f, b, a)]),
        ["O'ngga a: x → x − a; yuqoriga b: + b", "Javob: " + ans]);
    }
    if (k === 1) { var ans1 = dirS(a, b);
      return Q(shiftF(f, a, b) + " grafigi y = " + f[0] + " grafigidan qanday hosil qilinadi?", ans1, W(ans1, [dirS(-a, b), dirS(a, -b), dirS(-a, -b), dirS(b, a)]),
        ["y = f(x − a) + b: a > 0 — o'ngga, b > 0 — yuqoriga", "Javob: " + ans1]);
    }
    if (k === 2) { var g = pick(FX.slice(1, 3)), ans2 = "(" + ms(a) + "; " + ms(b) + ")";
      return Q(shiftF(g, a, b) + " grafigining " + (g[0] === "|x|" ? "uchi" : "boshlang'ich nuqtasi") + " koordinatalarini toping.", ans2, W(ans2, H.pairW(a, b, 5)),
        ["y = " + g[0] + " uchun bu nuqta (0; 0)", "Siljitishdan keyin: " + ans2]);
    }
    if (k === 3) { var T = pick([["y = √(−x)", "y = √x", "Oy o'qiga nisbatan simmetrik akslantirish"], ["y = −√x", "y = √x", "Ox o'qiga nisbatan simmetrik akslantirish"], ["y = −x³", "y = x³", "Ox o'qiga nisbatan simmetrik akslantirish"], ["y = 2⁻ˣ", "y = 2ˣ", "Oy o'qiga nisbatan simmetrik akslantirish"], ["y = −2ˣ", "y = 2ˣ", "Ox o'qiga nisbatan simmetrik akslantirish"], ["y = |x| ning 3 marta cho'zilgani y = 3|x|", "y = |x|", "Oy o'qi bo'ylab 3 marta cho'zish"], ["y = −|x|", "y = |x|", "Ox o'qiga nisbatan simmetrik akslantirish"], ["y = |x − 2|", "y = |x|", "o'ngga 2 birlik siljitish"], ["y = (1/2)·x²", "y = x²", "Oy o'qi bo'ylab 2 marta siqish"], ["y = √(2x)", "y = √x", "Ox o'qi bo'ylab 2 marta siqish"]]);
      var lab = T[0].indexOf(" ning ") > -1 ? "y = 3|x|" : T[0];
      return Q(lab + " grafigi " + T[1] + " grafigidan qanday almashtirish bilan hosil bo'ladi?", T[2], W(T[2], ["Oy o'qiga nisbatan simmetrik akslantirish", "Ox o'qiga nisbatan simmetrik akslantirish", "Oy o'qi bo'ylab 3 marta cho'zish", "o'ngga 2 birlik siljitish", "Oy o'qi bo'ylab 2 marta siqish", "Ox o'qi bo'ylab 2 marta siqish", "koordinata boshiga nisbatan simmetriya"]),
        ["f(−x) — Oy ga, −f(x) — Ox ga nisbatan simmetriya; k·f(x) — Oy bo'ylab cho'zish", "Javob: " + T[2]]);
    }
    if (k === 4) { var a4 = RNZ(-4, 4), b4 = R(-5, 5), x4 = a4 + RNZ(-4, 4), v4 = (x4 - a4) * (x4 - a4) + b4;
      return Q("y = x² grafigi " + dirS(a4, b4 || 1).replace(/ va (yuqoriga|pastga) 0/, "") + " birlik siljitildi. Yangi funksiyaning x = " + ms(x4) + " dagi qiymatini toping.", (x4 - a4) * (x4 - a4) + (b4 || 1),
        W((x4 - a4) * (x4 - a4) + (b4 || 1), [(x4 + a4) * (x4 + a4) + (b4 || 1), (x4 - a4) * (x4 - a4) - (b4 || 1), x4 * x4 + (b4 || 1), (x4 - a4) * (x4 - a4) + (b4 || 1) + 1]),
        ["Yangi funksiya: " + shiftF(FX[0], a4, b4 || 1), "y(" + ms(x4) + ") = " + ((x4 - a4) * (x4 - a4) + (b4 || 1))]);
    }
    var ans5 = "x = " + ms(a) + ", y = " + ms(b);
    return Q("y = 1/(" + xm(a) + ")" + (b > 0 ? " + " + b : " − " + (-b)) + " giperbolaning asimptotalarini toping.", ans5, W(ans5, ["x = " + ms(-a) + ", y = " + ms(b), "x = " + ms(a) + ", y = " + ms(-b), "x = " + ms(b) + ", y = " + ms(a), "x = 0, y = 0"]),
      ["y = 1/x ning asimptotalari x = 0, y = 0", "Siljitishdan keyin: " + ans5]);
  }

  aug("a6", a6x, sh(.88, 0, 0));
  aug("a7", a7x, sh(.85, .2, 0));
  aug("t53", t53x, sh(0, .15, .88));
  aug("t57", t57x, sh(0, .4, .88));
  aug("t60", t60x, sh(.85, .55, .3));
  aug("t65", t65x, sh(.82, .82, .82));
  aug("t70", t70x, sh(.88, .88, .65));
  aug("t7", t7x, sh(.75, .45, .45));

  /* ================= Ehtimollik va kombinatorika ================= */
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function Cn(n, k) { return k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))); }
  function An(n, k) { return Math.round(fact(n) / fact(n - k)); }
  function pW(n, d) { // ehtimollik (kasr) uchun noto'g'ri variantlar
    var out = [F(d - n, d), F(n + 1, d), F(n, d + 1), F(n, d - n || 1), F(Math.max(1, n - 1), d), F(d, n + d)];
    return W(F(n, d), out);
  }
  function t37x(L) {
    var k = pick([0, 1, 2, 3, 4, 5]);
    if (k === 0) { // ikki kubik
      var t = R(0, 3), c = 0, txt, s = R(3, 11), i, j;
      for (i = 1; i <= 6; i++) for (j = 1; j <= 6; j++) {
        if (t === 0 ? i + j > s : t === 1 ? (i * j) % 2 === 0 : t === 2 ? i === j : Math.abs(i - j) === 1) c++;
      }
      txt = t === 0 ? "yig'indisi " + s + " dan katta" : t === 1 ? "ko'paytmasi juft son" : t === 2 ? "ikkalasida bir xil raqam" : "raqamlar ayirmasi 1 ga teng";
      return Q("Ikki kubik tashlanadi. " + txt.charAt(0).toUpperCase() + txt.slice(1) + " bo'lish ehtimolini toping.".replace("ikkalasida bir xil raqam bo'lish", "ikkalasida bir xil raqam chiqish"), F(c, 36), pW(c, 36),
        ["Barcha hollar: 6·6 = 36", "Qulay hollar: " + c + " ta", "P = " + c + "/36 = " + F(c, 36)]);
    }
    if (k === 1) { // 1..N kartochkalar
      var N = pick([10, 12, 15, 20, 25, 30, 40, 50]), prop = R(0, 4), cnt = 0, nm;
      for (var x = 1; x <= N; x++) {
        var isP = x > 1; for (var d = 2; d * d <= x; d++) if (x % d === 0) isP = false;
        if (prop === 0 ? isP : prop === 1 ? x % 3 === 0 : prop === 2 ? Math.round(Math.sqrt(x)) * Math.round(Math.sqrt(x)) === x : prop === 3 ? x % 5 === 0 : String(x).indexOf("1") > -1) cnt++;
      }
      nm = ["tub son", "3 ga karrali son", "to'liq kvadrat", "5 ga karrali son", "yozuvida 1 raqami qatnashgan son"][prop];
      return Q("1 dan " + N + " gacha raqamlangan kartochkalardan biri olinadi. Unda " + nm + " bo'lish ehtimolini toping.", F(cnt, N), pW(cnt, N),
        ["Barcha hollar: " + N, "Qulay hollar: " + cnt + " ta", "P = " + F(cnt, N)]);
    }
    if (k === 2) { // n tanga, aynan m gerb
      var n2 = R(2, 4), m2 = R(0, n2), c2 = Cn(n2, m2), tot = pw(2, n2);
      return Q(n2 + " ta tanga tashlanadi. Aynan " + m2 + " ta gerb tushish ehtimolini toping.", F(c2, tot), W(F(c2, tot), [F(1, tot), F(m2, n2), F(c2, tot * 2), F(c2 + 1, tot), F(tot - c2, tot)]),
        ["Barcha hollar: 2" + sup(n2) + " = " + tot, "Qulay: C(" + n2 + "; " + m2 + ") = " + c2, "P = " + F(c2, tot)]);
    }
    if (k === 3) { // uch rangli sharlar
      var r = R(2, 9), g = R(2, 9), b = R(2, 9), T = r + g + b, ask = R(0, 2);
      var fav = ask === 0 ? g + b : ask === 1 ? r + g : r + b, nm3 = ["qizil emas", "ko'k emas", "yashil emas"][ask];
      return Q("Qutida " + r + " ta qizil, " + g + " ta yashil va " + b + " ta ko'k shar bor. Olingan shar " + nm3 + " bo'lish ehtimolini toping.", F(fav, T), pW(fav, T),
        ["Jami: " + T, "Qulay: " + fav, "P = " + F(fav, T)]);
    }
    if (k === 4) { // qarama-qarshi hodisa
      var d4 = pick([5, 6, 8, 9, 10, 12, 15, 20]), n4 = R(1, d4 - 1);
      return Q("P(A) = " + F(n4, d4) + " bo'lsa, A hodisaga qarama-qarshi hodisa ehtimolini toping.", F(d4 - n4, d4), W(F(d4 - n4, d4), [F(n4, d4), F(d4, n4), "1", F(d4 - n4, d4 + n4), F(d4 - n4 + 1, d4)]),
        ["P(Ā) = 1 − P(A)", "= 1 − " + F(n4, d4) + " = " + F(d4 - n4, d4)]);
    }
    var Nn = R(20, 40), oq = R(3, Nn - 5);
    return Q("Lotereyada " + Nn + " ta biletdan " + oq + " tasi yutuqli. Bitta bilet olinganda yutuqsiz bo'lish ehtimolini toping.", F(Nn - oq, Nn), pW(Nn - oq, Nn),
      ["Yutuqsiz biletlar: " + (Nn - oq), "P = " + F(Nn - oq, Nn)]);
  }

  var WORDS = ["KITOB", "OLMA", "QALAM", "MAKTAB", "DARAXT", "BAHOR", "ANOR", "SAMARQAND", "TOSHKENT", "DAFTAR", "ALLA", "SINF", "QUYOSH", "MATEMATIKA"];
  function anag(w) { var c = {}, r = fact(w.length); w.split("").forEach(function (ch) { c[ch] = (c[ch] || 0) + 1; }); for (var k in c) r /= fact(c[k]); return [Math.round(r), c]; }
  function t38x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 3, 4] : L === 2 ? [1, 2, 4, 5, 6, 7] : [5, 6, 7, 8, 8]);
    if (k === 0) { var n = R(3, 8); return Q(n + " kishi navbatga necha xil usulda turishi mumkin?", fact(n), W(fact(n), [n * n, fact(n - 1), fact(n) / 2, n * (n - 1)]), ["Pₙ = n! = " + fact(n)]); }
    if (k === 1) { var n1 = R(5, 12), m = R(2, 3), c = Cn(n1, m);
      var ctx = pick([n1 + " kishidan " + m + " kishilik guruhni necha usulda tanlash mumkin?", n1 + " ta turli kitobdan " + m + " tasini necha usulda tanlash mumkin?", n1 + " ta o'quvchidan " + m + " nafar navbatchini necha usulda tanlash mumkin?"]);
      return Q(ctx, c, W(c, [An(n1, m), n1 * m, c + n1, Cn(n1, m + 1), pw(n1, m)]), ["Tartib muhim emas → C(" + n1 + "; " + m + ")", "= " + c]); }
    if (k === 2) { var n2 = R(4, 12), m2 = R(2, 3), a = An(n2, m2), lab = m2 === 2 ? "sardor va uning o'rinbosarini" : "1-, 2- va 3-o'rin sovrindorlarini";
      return Q(n2 + " kishidan " + lab + " necha usulda tanlash mumkin?", a, W(a, [Cn(n2, m2), pw(n2, m2), a / 2, n2 * m2, a + n2]), ["Tartib muhim → A(" + n2 + "; " + m2 + ")", "= " + a]); }
    if (k === 3) { var n3 = R(4, 14), c3 = Cn(n3, 2), t3 = pick(["Turnirda " + n3 + " ta jamoa bor, har biri boshqasi bilan bir marta o'ynaydi. Jami nechta o'yin bo'ladi?", n3 + " kishi bir-biri bilan bir martadan qo'l berib ko'rishdi. Jami nechta qo'l berish bo'ldi?", "Tekislikda " + n3 + " ta nuqta bor (uchtasi bir to'g'ri chiziqda yotmaydi). Ular orqali nechta to'g'ri chiziq o'tkazish mumkin?"]);
      return Q(t3, c3, W(c3, [n3 * (n3 - 1), n3 * n3, c3 + n3, n3 * 2]), ["Juftliklar soni: C(" + n3 + "; 2) = " + n3 + "·" + (n3 - 1) + "/2", "= " + c3]); }
    if (k === 4) { var n4 = R(3, 6), m4 = R(2, 4);
      return Q(m4 + " ta raqamdan iborat kodning har bir o'rniga " + n4 + " ta raqamdan biri qo'yiladi (takrorlanishi mumkin). Nechta kod bor?", pw(n4, m4), W(pw(n4, m4), [An(n4, Math.min(m4, n4)), pw(m4, n4), n4 * m4, Cn(n4 + m4 - 1, m4)]), ["Har bir o'ringa " + n4 + " ta tanlov", n4 + sup(m4) + " = " + pw(n4, m4)]); }
    if (k === 5) { var w = pick(WORDS), an = anag(w), rep = []; for (var ch in an[1]) if (an[1][ch] > 1) rep.push(ch + " — " + an[1][ch] + " marta");
      return Q(w + " so'zidagi harflarning o'rnini almashtirib nechta turli \"so'z\" (harflar ketma-ketligi) hosil qilish mumkin?", an[0], W(an[0], [fact(w.length), an[0] * 2, fact(w.length - 1), an[0] / 2 === Math.round(an[0] / 2) ? an[0] / 2 : an[0] + 1]),
        [w.length + " ta harf" + (rep.length ? ", takrorlanadi: " + rep.join(", ") : ", hammasi har xil"), "Javob: " + an[0]]); }
    if (k === 6) { var b = R(3, 7), g = R(3, 7), x = R(1, 2), y = R(1, 3), res = Cn(b, x) * Cn(g, y);
      return Q("Sinfda " + b + " o'g'il va " + g + " qiz bor. " + x + " o'g'il va " + y + " qizdan iborat guruhni necha usulda tuzish mumkin?", res, W(res, [Cn(b + g, x + y), Cn(b, x) + Cn(g, y), An(b, x) * An(g, y), res * 2]),
        ["C(" + b + "; " + x + ")·C(" + g + "; " + y + ") = " + Cn(b, x) + "·" + Cn(g, y), "= " + res]); }
    if (k === 7) { var d7 = R(3, 4), withZ = Math.random() < .5, digs = withZ ? R(4, 6) : R(4, 7), res7 = withZ ? (digs - 1) * An(digs - 1, d7 - 1) : An(digs, d7);
      var dl = []; for (var q = withZ ? 0 : 1; dl.length < digs; q++) dl.push(q);
      return Q(dl.join(", ") + " raqamlaridan raqamlari takrorlanmaydigan nechta " + d7 + " xonali son tuzish mumkin?", res7, W(res7, [An(digs, d7), Cn(digs, d7), pw(digs, d7), withZ ? An(digs - 1, d7) : res7 * 2]),
        [withZ ? "Birinchi raqam 0 bo'la olmaydi: " + (digs - 1) + " ta tanlov" : "A(" + digs + "; " + d7 + ")", withZ ? (digs - 1) + "·" + An(digs - 1, d7 - 1) + " = " + res7 : "= " + res7]); }
    var n8 = R(5, 9), m8 = R(2, 3), bc = Cn(n8, m8);
    return Q("C(" + n8 + "; " + m8 + ") + C(" + n8 + "; " + (m8 + 1) + ") ni hisoblang.", Cn(n8 + 1, m8 + 1), W(Cn(n8 + 1, m8 + 1), [Cn(n8, m8 + 1) * 2, Cn(n8 + 1, m8), bc * 2, Cn(n8 + 2, m8 + 1)]),
      ["C(n; k) + C(n; k + 1) = C(n + 1; k + 1)", "C(" + (n8 + 1) + "; " + (m8 + 1) + ") = " + Cn(n8 + 1, m8 + 1)]);
  }

  function t89x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [1, 2, 3, 4, 5] : [3, 4, 5, 6, 7]);
    if (k === 0) { var n = R(0, 10); return Q(n + "! ni hisoblang.", fact(n), W(fact(n), [n === 0 ? 0 : fact(n - 1), fact(n + 1), n * n, fact(n) + n, n]), [n === 0 ? "Kelishuv: 0! = 1" : "1·2·…·" + n + " = " + fact(n)]); }
    if (k === 1) { var n1 = R(2, 15); return Q("(" + (n1 + 2) + ")!/" + n1 + "! ni hisoblang.", (n1 + 1) * (n1 + 2), W((n1 + 1) * (n1 + 2), [n1 + 2, 2, (n1 + 2) * (n1 + 2), n1 * (n1 + 1), (n1 + 2) * (n1 + 3)]), ["(n + 2)!/n! = (n + 1)(n + 2)", "= " + (n1 + 1) + "·" + (n1 + 2) + " = " + (n1 + 1) * (n1 + 2)]); }
    if (k === 2) { var n2 = R(3, 9), m2 = R(1, n2 - 1); return Q(n2 + "!/(" + m2 + "!·" + (n2 - m2) + "!) ni hisoblang.", Cn(n2, m2), W(Cn(n2, m2), [An(n2, m2), fact(n2) / fact(m2), n2 * m2, Cn(n2, m2) + 1]), ["Bu C(" + n2 + "; " + m2 + ")", "= " + Cn(n2, m2)]); }
    if (k === 3) { var n3 = R(3, 12), v3 = n3 * (n3 + 1); return Q("(n + 1)!/(n − 1)! = " + v3 + " bo'lsa, n ni toping.", n3, W(n3, [n3 + 1, n3 - 1, v3 / 2 === Math.round(v3 / 2) ? v3 / 2 : n3 + 2, Math.round(Math.sqrt(v3)) === n3 ? n3 + 3 : Math.round(Math.sqrt(v3))]), ["(n + 1)!/(n − 1)! = n(n + 1)", "n(n + 1) = " + v3 + " → n = " + n3]); }
    if (k === 4) { var n4 = R(4, 10), v4 = n4 * (n4 - 1) * (n4 - 2); return Q("n!/(n − 3)! = " + v4 + " bo'lsa, n ni toping.", n4, W(n4, [n4 + 1, n4 - 1, n4 + 2, 3]), ["n!/(n − 3)! = n(n − 1)(n − 2)", "= " + n4 + "·" + (n4 - 1) + "·" + (n4 - 2) + " = " + v4 + " → n = " + n4]); }
    if (k === 5) { var n5 = R(3, 8); return Q("(" + (n5 + 1) + "! − " + n5 + "!)/" + n5 + "! ni hisoblang.", n5, W(n5, [n5 + 1, 1, n5 - 1, fact(n5)]), ["(n + 1)! − n! = n!·(n + 1 − 1) = n·n!", "Javob: " + n5]); }
    if (k === 6) { var n6 = R(10, 120), z = 0, t = n6; while (t >= 5) { t = Math.floor(t / 5); z += t; }
      return Q(n6 + "! soni nechta nol bilan tugaydi?", z, W(z, [Math.floor(n6 / 5), Math.floor(n6 / 10), z + 1, z - 1 >= 0 ? z - 1 : z + 2]), ["5 ga bo'linuvchilar: [" + n6 + "/5] = " + Math.floor(n6 / 5) + (n6 >= 25 ? ", 25 ga: " + Math.floor(n6 / 25) : "") + (n6 >= 125 ? ", 125 ga: " + Math.floor(n6 / 125) : ""), "Nollar soni: " + z]); }
    var n7 = R(2, 6); return Q(n7 + "!·" + (n7 + 1) + " ni bitta faktorial ko'rinishida yozing.", "(" + (n7 + 1) + ")!", W("(" + (n7 + 1) + ")!", [(n7 + 2) + "!", n7 + "!", (2 * n7 + 1) + "!", "(" + n7 + "·" + (n7 + 1) + ")!"]), ["n!·(n + 1) = (n + 1)!", "= " + (n7 + 1) + "!"]);
  }

  function t93x(L) {
    var k = pick([0, 0, 1, 2, 3, 4, 5]);
    if (k === 0) { var a = R(1, 9), b = R(1, 9), t = R(0, 2), pa = a / 10, res, nm;
      var n = t === 0 ? 100 - (10 - a) * (10 - b) : t === 1 ? a * (10 - b) + (10 - a) * b : (10 - a) * (10 - b);
      nm = ["kamida bittasi", "faqat bittasi", "hech biri"][t];
      return Q("Ikki mergan nishonga o'q uzadi. Tegish ehtimollari " + F(a, 10) + " va " + F(b, 10) + ". Nishonga " + nm + " tegish ehtimolini toping.", F(n, 100), W(F(n, 100), [F(a * b, 100), F(a + b, 10), F(100 - n, 100), F(a * (10 - b), 100), F((10 - a) * (10 - b), 100), F(a * b + 1, 100)]),
        [t === 0 ? "1 − P(hech biri) = 1 − " + F(10 - a, 10) + "·" + F(10 - b, 10) : t === 1 ? "p₁(1 − p₂) + (1 − p₁)p₂" : "(1 − p₁)(1 − p₂) = " + F(10 - a, 10) + "·" + F(10 - b, 10), "= " + F(n, 100)]);
    }
    if (k === 1) { var w = R(2, 8), bl = R(2, 8), T = w + bl, col = Math.random() < .5;
      var fav = col ? w * (w - 1) : bl * (bl - 1);
      return Q("Qutida " + w + " ta oq va " + bl + " ta qora shar bor. Qaytarmasdan ketma-ket 2 ta shar olinadi. Ikkalasi ham " + (col ? "oq" : "qora") + " bo'lish ehtimolini toping.", F(fav, T * (T - 1)),
        W(F(fav, T * (T - 1)), [F((col ? w : bl) * (col ? w : bl), T * T), F(col ? w : bl, T), F(fav, T * T), F(2 * (col ? w : bl), T * (T - 1)), F((col ? bl : w) * ((col ? bl : w) - 1), T * (T - 1))]),
        [F(col ? w : bl, T) + " · " + F((col ? w : bl) - 1, T - 1), "= " + F(fav, T * (T - 1))]);
    }
    if (k === 2) { var D = pick([6, 8, 10, 12, 20]), x = R(1, D - 2), y = R(1, D - 2), z = R(0, Math.min(x, y) - 1 >= 0 ? Math.min(x, y) - 1 : 0); if (x + y - z > D) return null;
      return Q("P(A) = " + F(x, D) + ", P(B) = " + F(y, D) + ", P(A ∩ B) = " + F(z, D) + ". P(A ∪ B) ni toping.", F(x + y - z, D), W(F(x + y - z, D), [F(x + y, D), F(x * y, D * D), F(x + y + z, D), F(x + y - 2 * z, D), F(D - x - y + z, D)]),
        ["P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", "= " + F(x + y - z, D)]);
    }
    if (k === 3) { var pB = R(2, 9), pAB = R(1, pB - 1), D3 = 10;
      return Q("P(B) = " + F(pB, D3) + ", P(A ∩ B) = " + F(pAB, D3) + " bo'lsa, shartli ehtimol P(A|B) ni toping.", F(pAB, pB), W(F(pAB, pB), [F(pAB * pB, 100), F(pB, pAB), F(pAB, D3), F(pB - pAB, pB), F(pAB, D3 - pB || 1)]),
        ["P(A|B) = P(A ∩ B)/P(B)", "= " + F(pAB, D3) + " : " + F(pB, D3) + " = " + F(pAB, pB)]);
    }
    if (k === 4) { var p = R(1, 4), q = p + R(1, 3), n = R(2, 4);
      return Q("Basketbolchi to'pni savatga " + F(p, q) + " ehtimol bilan tushiradi. " + n + " ta otishning hammasi tushish ehtimolini toping.", F(pw(p, n), pw(q, n)), W(F(pw(p, n), pw(q, n)), [F(n * p, q), F(p, n * q), F(pw(q - p, n), pw(q, n)), F(pw(q, n) - pw(p, n), pw(q, n)), F(pw(p, n - 1), pw(q, n - 1))]),
        ["Erkli hodisalar: (" + F(p, q) + ")" + sup(n), "= " + F(pw(p, n), pw(q, n))]);
    }
    var n5 = R(2, 4), p5 = pick([[1, 6], [1, 2], [1, 3], [1, 4], [2, 5]]), qn = pw(p5[1] - p5[0], n5), tot = pw(p5[1], n5);
    return Q("Hodisaning bitta sinovda ro'y berish ehtimoli " + F(p5[0], p5[1]) + ". " + n5 + " ta erkli sinovda kamida bir marta ro'y berish ehtimolini toping.", F(tot - qn, tot), W(F(tot - qn, tot), [F(qn, tot), F(n5 * p5[0], p5[1]), F(pw(p5[0], n5), tot), F(tot - pw(p5[0], n5), tot)]),
      ["1 − (1 − p)" + sup(n5) + " = 1 − (" + F(p5[1] - p5[0], p5[1]) + ")" + sup(n5), "= 1 − " + F(qn, tot) + " = " + F(tot - qn, tot)]);
  }

  function t96x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [1, 2, 3, 4] : [3, 4, 5, 5, 6, 7]);
    if (k === 0) { var n = R(3, 15), f = pick(["(x + y)", "(a − b)", "(2x + 3)", "(x² + 1)", "(1 + x)"]);
      return Q(f + "^" + n + " yoyilmasida nechta had bor?", n + 1, W(n + 1, [n, n + 2, 2 * n, n - 1]), ["(a + b)ⁿ yoyilmasida n + 1 ta had", "= " + (n + 1)]); }
    if (k === 1) { var n1 = R(4, 10), m = R(1, n1 - 1), lab = pick(["a^" + (n1 - m) + "·b^" + m + " hadning", (m + 1) + "-hadning"]);
      return Q("(a + b)^" + n1 + " yoyilmasida " + lab + " binomial koeffitsiyentini toping.", Cn(n1, m), W(Cn(n1, m), [An(n1, m), Cn(n1, m + 1), Cn(n1, m - 1) || n1 + 1, n1 * m]), ["T(k+1) = C(n; k)·aⁿ⁻ᵏ·bᵏ, k = " + m, "C(" + n1 + "; " + m + ") = " + Cn(n1, m)]); }
    if (k === 2) { var n2 = R(3, 10), sgn = Math.random() < .5;
      var val = sgn ? 0 : pw(2, n2), fx = sgn ? "(x − 1)" : "(x + 1)";
      var a2 = pick([1, 2, 3]), b2 = pick([1, -1, 2]);
      if (Math.random() < .5) { fx = "(" + (a2 === 1 ? "" : a2) + "x " + (b2 < 0 ? "− " + (-b2) : "+ " + b2) + ")"; val = pw(a2 + b2, n2); }
      return Q(fx + "^" + n2 + " yoyilmasidagi barcha koeffitsiyentlar yig'indisini toping.", val, W(val, [pw(2, n2), n2 + 1, val + 1, pw(a2 + Math.abs(b2), n2) === val ? 1 : pw(a2 + Math.abs(b2), n2), 0, pw(2, n2) - 1]),
        ["x = 1 qo'yamiz", "Yig'indi = " + fx.replace(/x/, "·1").replace("(·1", "(1").replace(/(\d)·1/, "$1·1") + "^" + n2 + " = " + val]); }
    if (k === 3) { // (ax + b)^n da xᵏ koeffitsiyenti
      var a3 = pick([1, 2, 3, -1, -2]), b3 = pick([1, 2, 3, -1, -2]), n3 = R(3, 6), k3 = R(1, n3 - 1), cf = Cn(n3, k3) * pw(a3, k3) * pw(b3, n3 - k3);
      var e3 = "(" + (a3 === 1 ? "" : a3 === -1 ? "−" : ms(a3)) + "x " + (b3 < 0 ? "− " + (-b3) : "+ " + b3) + ")";
      return Q(e3 + "^" + n3 + " yoyilmasida x" + (k3 === 1 ? "" : sup(k3)) + " oldidagi koeffitsiyentni toping.", cf,
        W(cf, [Cn(n3, k3), -cf, Cn(n3, k3) * pw(Math.abs(a3), k3) * pw(Math.abs(b3), n3 - k3), Cn(n3, k3) * pw(a3, n3 - k3) * pw(b3, k3), Cn(n3, k3) * a3 * b3]),
        ["Tₖ₊₁ = C(" + n3 + "; " + k3 + ")·(" + ms(a3) + "x)" + sup(k3) + "·(" + ms(b3) + ")" + sup(n3 - k3), "= " + Cn(n3, k3) + "·" + par(pw(a3, k3)) + "·" + par(pw(b3, n3 - k3)) + " = " + ms(cf)]); }
    if (k === 4) { // (x + 1/x)^(2m) ozod hadi
      var m4 = R(2, 6), n4 = 2 * m4, ft = Cn(n4, m4);
      return Q("(x + 1/x)^" + n4 + " yoyilmasidagi ozod hadni (x qatnashmagan hadni) toping.", ft, W(ft, [Cn(n4, m4 - 1), An(n4, m4), pw(2, n4), Cn(n4, 2)]), ["Tₖ₊₁ = C(" + n4 + "; k)·x" + sup(n4) + "⁻²ᵏ", n4 + " − 2k = 0 → k = " + m4, "C(" + n4 + "; " + m4 + ") = " + ft]); }
    if (k === 5) { // (x² + 1/x)^(3m) ozod hadi: 2(n−k) − k = 0 → k = 2n/3
      var m5 = R(1, 3), n5 = 3 * m5, k5 = 2 * m5, f5 = Cn(n5, k5);
      return Q("(x² + 1/x)^" + n5 + " yoyilmasidagi ozod hadni toping.", f5, W(f5, [Cn(n5, m5 + 1) === f5 ? Cn(n5, 1) + 1 : Cn(n5, m5 + 1), An(n5, k5) / 2, pw(2, n5), f5 + n5].filter(function (x) { return x !== f5; })),
        ["Tₖ₊₁ = C(" + n5 + "; k)·x^(2(" + n5 + " − k))·x⁻ᵏ", "2(" + n5 + " − k) − k = 0 → k = " + k5, "C(" + n5 + "; " + k5 + ") = " + f5]); }
    if (k === 6) { var n6 = 2 * R(2, 5), mid = Cn(n6, n6 / 2);
      return Q("(a + b)^" + n6 + " yoyilmasining o'rta hadi koeffitsiyentini toping.", mid, W(mid, [Cn(n6, n6 / 2 - 1), pw(2, n6) / 2, An(n6, n6 / 2), n6 + 1]), ["Hadlar soni " + (n6 + 1) + ", o'rta had: T" + sub(n6 / 2 + 1), "C(" + n6 + "; " + n6 / 2 + ") = " + mid]); }
    var n7 = R(3, 8), s7 = pw(2, n7 - 1);
    return Q("C(" + n7 + "; 0) + C(" + n7 + "; 2) + C(" + n7 + "; 4) + … (juft indeksli koeffitsiyentlar) yig'indisini toping.", s7, W(s7, [pw(2, n7), s7 - 1, n7 + 1, pw(2, n7) - 1]), ["Juft va toq indeksli koeffitsiyentlar yig'indilari teng", "= 2" + sup(n7) + "/2 = " + s7]);
  }

  aug("t37", t37x, sh(.3, .3, .88));
  aug("t38", t38x, sh(.82, .7, .6));
  aug("t89", t89x, sh(.7, .65, .82));
  aug("t93", t93x, sh(.3, .3, .85));
  aug("t96", t96x, sh(.6, .6, .85));

  /* ================= Stereometriya: jismlar, masofalar, kesimlar ================= */
  function rt(k, n) { return (k === 1 ? "" : k) + "√" + n; }
  function rtW(k, n) { return W(rt(k, n), [rt(k + 1, n), k > 1 ? rt(k - 1, n) : rt(k + 2, n), rt(2 * k, n), rt(k, n === 2 ? 3 : 2), String(k * n), String(k)]); }
  function piS(n, d) { d = d || 1; var g = gcd(n, d); n /= g; d /= g; return (n === 1 ? "" : n) + "π" + (d === 1 ? "" : "/" + d); }
  function piW(n, d) { d = d || 1; return W(piS(n, d), [piS(2 * n, d), piS(n, 2 * d), piS(n + d, d), piS(Math.max(1, n - d), d), String(Math.round(n / d)), piS(n * 3, d * 4)]); }
  var CYL = [[3, 8, 10], [4, 6, 10], [6, 5, 13], [5, 24, 26], [4, 15, 17], [6, 8, 10], [8, 6, 10], [12, 5, 13], [9, 24, 30], [8, 30, 34]]; // [r, h, ...] uchun 2r, h, d
  function t81x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 3] : L === 2 ? [0, 1, 2, 3, 4, 5] : [3, 4, 5, 6, 7]);
    if (k === 0) { var m = R(1, 6), a = 2 * m; // kubga ichki shar hajmi: (4/3)πm³
      return Q("Qirrasi " + a + " bo'lgan kubga ichki chizilgan sharning hajmini toping.", piS(4 * m * m * m, 3), piW(4 * m * m * m, 3), ["r = a/2 = " + m, "V = (4/3)πr³ = " + piS(4 * m * m * m, 3)]); }
    if (k === 1) { var a1 = 2 * R(1, 6), r1 = a1 / 2; // kubga ichki silindr hajmi: πr²·a
      return Q("Qirrasi " + a1 + " bo'lgan kubga ichki chizilgan silindrning hajmini toping.", piS(r1 * r1 * a1), piW(r1 * r1 * a1), ["Silindr: r = a/2 = " + r1 + ", H = a = " + a1, "V = πr²H = " + piS(r1 * r1 * a1)]); }
    if (k === 2) { var r2 = R(1, 9);
      if (Math.random() < .5) return Q("Radiusi " + r2 + " bo'lgan sharga tashqi chizilgan silindrning to'la sirtini toping.", piS(6 * r2 * r2), piW(6 * r2 * r2), ["Silindr: r = " + r2 + ", H = 2r = " + 2 * r2, "S = 2πr² + 2πrH = 6πr² = " + piS(6 * r2 * r2)]);
      return Q("Radiusi " + r2 + " bo'lgan sharga tashqi chizilgan kubning hajmini toping.", 8 * r2 * r2 * r2, W(8 * r2 * r2 * r2, [r2 * r2 * r2, 4 * r2 * r2 * r2, 6 * r2 * r2, 2 * r2 * r2 * r2, 8 * r2 * r2]), ["Kub qirrasi a = 2r = " + 2 * r2, "V = a³ = " + 8 * r2 * r2 * r2]); }
    if (k === 3) { var c = pick(CYL), s = pick([1, 1, 2]), R3 = c[2] * s / 2, rr = c[0] * s / 2 * 2 / 2;
      // silindr sharga ichki: asos diametri 2r = c[0]·s, balandligi c[1]·s, shar diametri c[2]·s
      var D = c[2] * s, d2 = c[0] * s, h3 = c[1] * s;
      if (D % 2 || d2 % 2) return null;
      return Q("Radiusi " + D / 2 + " bo'lgan sharga asos radiusi " + d2 / 2 + " bo'lgan silindr ichki chizilgan. Silindr balandligini toping.", h3, W(h3, [h3 / 2, D - d2, D / 2 + d2 / 2, h3 + 2, Math.round(Math.sqrt(D * D / 4 - d2 * d2 / 4))]),
        ["(H/2)² + r² = R²", "(H/2)² = " + D * D / 4 + " − " + d2 * d2 / 4 + " = " + h3 * h3 / 4, "H = 2·" + h3 / 2 + " = " + h3]); }
    if (k === 4) { var k4 = R(1, 8);
      if (Math.random() < .5) return Q("Radiusi " + rt(k4, 3) + " bo'lgan sharga ichki chizilgan kubning qirrasini toping.", 2 * k4, W(2 * k4, [k4, 3 * k4, rt(2 * k4, 3), rt(k4, 2), 2 * k4 + 2]), ["Kub diagonali = shar diametri: a√3 = 2·" + rt(k4, 3), "a = " + 2 * k4]);
      return Q("Qirrasi " + k4 + " bo'lgan kubga tashqi chizilgan sharning diametrini toping.", rt(k4, 3), rtW(k4, 3), ["Shar diametri = kub diagonali", "d = a√3 = " + rt(k4, 3)]); }
    if (k === 5) { var t5 = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
      return Q("Konus silindrga ichki chizilgan (asoslari va balandligi umumiy). Silindr hajmi " + 3 * t5[0] * t5[0] * t5[1] + "π bo'lsa, konus hajmini toping.", piS(t5[0] * t5[0] * t5[1]), piW(t5[0] * t5[0] * t5[1]), ["V(konus) = (1/3)·V(silindr)", "= " + piS(t5[0] * t5[0] * t5[1])]); }
    if (k === 6) { var a6 = R(1, 9);
      return Q("Muntazam to'rtburchakli prizma silindrga ichki chizilgan. Prizma asosining tomoni " + a6 + ". Silindr asosining radiusini toping.", a6 === 2 ? "√2" : F(a6, 2) === String(a6 / 2) && a6 % 2 === 0 ? rt(a6 / 2, 2) : a6 + "√2/2", W(a6 % 2 === 0 ? rt(a6 / 2, 2) : a6 + "√2/2", [rt(a6, 2), F(a6, 2), String(a6), rt(a6, 3), a6 + "√3/2"]),
        ["Silindr radiusi = asos kvadrati diagonalining yarmi", "R = a√2/2 = " + (a6 % 2 === 0 ? rt(a6 / 2, 2) : a6 + "√2/2")]); }
    var m7 = R(1, 5), r7 = 3 * m7; // shar va silindr hajmlari: V(shar) = (2/3)V(silindr)
    return Q("Sharga tashqi chizilgan silindr hajmi " + piS(2 * r7 * r7 * r7) + ". Shar hajmini toping.", piS(4 * r7 * r7 * r7, 3), piW(4 * r7 * r7 * r7, 3), ["V(shar) : V(silindr) = 2 : 3 (Arximed)", "V(shar) = (2/3)·" + piS(2 * r7 * r7 * r7) + " = " + piS(4 * r7 * r7 * r7, 3)]);
  }
  var QD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [3, 4, 12, 13], [2, 10, 11, 15], [4, 4, 7, 9], [6, 6, 7, 11], [4, 8, 8, 12], [2, 5, 14, 15], [6, 10, 15, 19], [1, 12, 12, 17]];
  function t87x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [0, 1, 2, 3, 4] : [1, 3, 4, 5, 5, 6]);
    if (k === 0) { var q = pick(QD), s = pick([1, 1, 2]), d = shuffle([q[0], q[1], q[2]]).map(function (x) { return x * s; });
      return Q("To'g'ri burchakli parallelepipedning o'lchamlari " + d.join(", ") + ". Uning diagonalini toping.", q[3] * s, W(q[3] * s, [d[0] + d[1] + d[2], q[3] * s + 1, Math.round(Math.sqrt(d[0] * d[0] + d[1] * d[1])), q[3] * s - 1, q[3] * s * q[3] * s]),
        ["d² = a² + b² + c² = " + d.map(function (x) { return x * x; }).join(" + ") + " = " + q[3] * q[3] * s * s, "d = " + q[3] * s]); }
    if (k === 1) { var q1 = pick(QD), A = [R(-5, 5), R(-5, 5), R(-5, 5)], sg = [pick([1, -1]), pick([1, -1]), pick([1, -1])], dl = shuffle([q1[0], q1[1], q1[2]]);
      var Bp = [A[0] + sg[0] * dl[0], A[1] + sg[1] * dl[1], A[2] + sg[2] * dl[2]];
      return Q("A(" + A.map(ms).join("; ") + ") va B(" + Bp.map(ms).join("; ") + ") nuqtalar orasidagi masofani toping.", q1[3], W(q1[3], [dl[0] + dl[1] + dl[2], q1[3] + 1, q1[3] * q1[3], q1[3] - 1, Math.abs(Bp[0] + Bp[1] + Bp[2] - A[0] - A[1] - A[2]) || q1[3] + 2]),
        ["d = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²)", "= √(" + dl.map(function (x) { return x * x; }).join(" + ") + ") = " + q1[3]]); }
    if (k === 2) { var h = R(2, 12), an = pick([30, 45, 60]);
      var lab = an === 30 ? 2 * h : an === 45 ? rt(h, 2) : null;
      if (an === 60) { var m60 = R(1, 8); return Q("Og'ma tekislik bilan 60° burchak hosil qiladi, og'ma uzunligi " + 2 * m60 + ". Nuqtadan tekislikkacha masofani toping.", rt(m60, 3), rtW(m60, 3), ["h = l·sin 60° = " + 2 * m60 + "·√3/2", "h = " + rt(m60, 3)]); }
      return Q("Nuqtadan tekislikkacha masofa " + h + ". Og'ma tekislik bilan " + an + "° burchak hosil qiladi. Og'ma uzunligini toping.", lab, an === 30 ? W(lab, [h, rt(h, 2), rt(h, 3), h / 2 === Math.round(h / 2) ? h / 2 : 3 * h]) : rtW(h, 2),
        ["l = h / sin " + an + "°", "l = " + lab]); }
    if (k === 3) { var h3 = R(2, 9), an3 = pick([30, 45, 60]), lv3 = an3 === 30 ? String(2 * h3) : an3 === 45 ? rt(h3, 2) : null;
      if (an3 === 60) { lv3 = String(2 * h3); return Q("Og'ma uzunligi " + lv3 + ", uning proyeksiyasi " + h3 + ". Og'ma bilan tekislik orasidagi burchakni toping.", "60°", ["30°", "45°", "90°", "120°"], ["cos φ = proyeksiya/og'ma = " + h3 + "/" + lv3 + " = 1/2", "φ = 60°"]); }
      return Q("Nuqtadan tekislikkacha masofa " + h3 + ", og'ma uzunligi " + lv3 + ". Og'ma bilan tekislik orasidagi burchakni toping.", deg(an3), W(deg(an3), ["30°", "45°", "60°", "90°"]), ["sin φ = h/l = " + h3 + "/" + lv3 + " = " + (an3 === 30 ? "1/2" : "√2/2"), "φ = " + an3 + "°"]); }
    if (k === 4) { var T = pick([["Kubda bir uchidan chiqqan ikki yoq diagonali orasidagi burchakni toping.", "60°", ["45°", "90°", "30°"], ["Uchta yoq diagonali teng tomonli uchburchak hosil qiladi", "Burchak 60°"]],
        ["Kubda yoq diagonali va shu yoqdagi qirra orasidagi burchakni toping.", "45°", ["30°", "60°", "90°"], ["Yoq — kvadrat, diagonal burchakni teng ikkiga bo'ladi", "45°"]],
        ["Kubda ayqash qirralar orasidagi burchakni toping.", "90°", ["45°", "60°", "0°"], ["Ayqash qirralardan biri boshqasiga parallel ko'chiriladi", "90°"]],
        ["Kubning qo'shni ikki yog'i orasidagi ikki yoqli burchakni toping.", "90°", ["45°", "60°", "120°"], ["Qo'shni yoqlar perpendikulyar", "90°"]],
        ["Kubda AC (yoq diagonali) va B₁D₁ (qarama-qarshi yoq diagonali) orasidagi burchakni toping.", "90°", ["45°", "60°", "0°"], ["B₁D₁ ∥ BD, AC ⊥ BD", "90°"]],
        ["Kubda AB₁ va BC₁ yoq diagonallari orasidagi burchakni toping.", "60°", ["45°", "90°", "30°"], ["BC₁ ∥ AD₁, AB₁D₁ — teng tomonli uchburchak", "60°"]]]);
      if (Math.random() < .5) return Q(T[0], T[1], T[2], T[3]);
      var a4 = R(2, 12); return Q("Qirrasi " + a4 + " bo'lgan kubda ayqash qirralar orasidagi masofani toping.", a4, W(a4, [rt(a4, 2), rt(a4, 3), a4 / 2 === Math.round(a4 / 2) ? a4 / 2 : 2 * a4, 2 * a4]), ["Ayqash qirralarning umumiy perpendikulyari — kub qirrasi", "d = " + a4]); }
    if (k === 5) { var t5 = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15]]), hh = t5[0], p1 = t5[1], l1 = t5[2];
      return Q("Nuqtadan tekislikkacha masofa " + hh + ", shu nuqtadan tushirilgan og'ma uzunligi " + l1 + ". Og'maning tekislikdagi proyeksiyasini toping.", p1, W(p1, [l1 - hh, l1 + hh, hh, p1 + 1, Math.round((l1 + hh) / 2)]), ["p² = l² − h² = " + l1 * l1 + " − " + hh * hh + " = " + p1 * p1, "p = " + p1]); }
    var a7 = R(1, 9);
    return Q("Qirrasi " + a7 + " bo'lgan kubda uchidan qarama-qarshi uchgacha bo'lgan masofani (fazoviy diagonalni) toping.", rt(a7, 3), rtW(a7, 3), ["d = a√3", "d = " + rt(a7, 3)]);
  }
  function t88x(L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3, 4] : [3, 4, 5, 6, 6, 7]);
    if (k === 0) { var c = pick(CYL); if (c[0] % 2) return null;
      return Q("Silindr asosining radiusi " + c[0] / 2 + ", balandligi " + c[1] + ". O'q kesimining diagonalini toping.", c[2], W(c[2], [c[0] / 2 + c[1], c[2] + 1, Math.round(Math.sqrt(c[0] * c[0] / 4 + c[1] * c[1])), c[0] + c[1], c[2] - 1]),
        ["O'q kesimi — to'g'ri to'rtburchak: " + c[0] + " × " + c[1], "d² = " + c[0] + "² + " + c[1] + "² = " + c[2] * c[2], "d = " + c[2]]); }
    if (k === 1) { var t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), ask = R(0, 1);
      if (ask === 0) return Q("Konus asosining radiusi " + t[0] + ", yasovchisi " + t[2] + ". O'q kesimining perimetrini toping.", 2 * t[0] + 2 * t[2], W(2 * t[0] + 2 * t[2], [t[0] + 2 * t[2], 2 * t[0] + t[2], 2 * (t[0] + t[1]), 2 * t[0] + 2 * t[2] + 2]), ["O'q kesimi: asosi 2r = " + 2 * t[0] + ", yon tomonlari l = " + t[2], "P = " + 2 * t[0] + " + 2·" + t[2] + " = " + (2 * t[0] + 2 * t[2])]);
      return Q("Konus asosining radiusi " + t[0] + ", yasovchisi " + t[2] + ". O'q kesimining yuzini toping.", t[0] * t[1], W(t[0] * t[1], [2 * t[0] * t[1], t[0] * t[2], t[0] * t[1] / 2 === Math.round(t[0] * t[1] / 2) ? t[0] * t[1] / 2 : t[0] * t[1] + 1, t[1] * t[2]]), ["H = √(l² − r²) = " + t[1], "S = ½·2r·H = " + t[0] + "·" + t[1] + " = " + t[0] * t[1]]); }
    if (k === 2) { var t2 = pick([[5, 3, 4], [13, 5, 12], [10, 6, 8], [17, 8, 15], [25, 7, 24], [15, 9, 12], [13, 12, 5], [5, 4, 3], [10, 8, 6], [17, 15, 8]]);
      return Q("Shar radiusi " + t2[0] + ", kesim doirasining radiusi " + t2[2] + ". Shar markazidan kesimgacha masofani toping.", t2[1], W(t2[1], [t2[0] - t2[2], t2[1] + 1, t2[0] + t2[2], Math.abs(t2[1] - 1) || t2[1] + 2]), ["d² = R² − r² = " + t2[0] * t2[0] + " − " + t2[2] * t2[2] + " = " + t2[1] * t2[1], "d = " + t2[1]]); }
    if (k === 3) { var t3 = pick([[5, 3, 4], [13, 5, 12], [10, 6, 8], [17, 8, 15], [25, 7, 24], [15, 9, 12]]), sw = Math.random() < .5, d3 = sw ? t3[2] : t3[1], r3 = sw ? t3[1] : t3[2];
      return Q("Shar radiusi " + t3[0] + ". Markazdan " + d3 + " masofada o'tgan tekislik kesimining yuzini toping.", piS(r3 * r3), piW(r3 * r3), ["r² = R² − d² = " + t3[0] * t3[0] + " − " + d3 * d3 + " = " + r3 * r3, "S = πr² = " + piS(r3 * r3)]); }
    if (k === 4) { var ratio = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]), S0 = ratio[1] * ratio[1] * R(1, 6);
      var S1 = S0 * ratio[0] * ratio[0] / (ratio[1] * ratio[1]);
      return Q("Piramida asosining yuzi " + S0 + ". Uchidan hisoblaganda balandlikning " + ratio[0] + "/" + ratio[1] + " qismidan asosga parallel kesim o'tkazildi. Kesim yuzini toping.", S1, W(S1, [S0 * ratio[0] / ratio[1], S0 - S1, S1 * 2, S0 / ratio[1]]), ["O'xshashlik koeffitsiyenti k = " + ratio[0] + "/" + ratio[1], "Yuzlar nisbati k² = " + F(ratio[0] * ratio[0], ratio[1] * ratio[1]), "S = " + S0 + "·" + F(ratio[0] * ratio[0], ratio[1] * ratio[1]) + " = " + S1]); }
    if (k === 5) { var m5 = R(1, 6), a5 = 2 * m5; // kubni uch uchidan o'tgan kesim: teng tomonli uchburchak, tomoni a√2
      return Q("Qirrasi " + a5 + " bo'lgan kubni bir uchidan chiqqan uchta qirraning uchlaridan o'tgan tekislik kesdi. Kesim yuzini toping.", rt(2 * m5 * m5, 3), rtW(2 * m5 * m5, 3), ["Kesim — teng tomonli uchburchak, tomoni a√2 = " + rt(a5, 2), "S = (a√2)²·√3/4 = " + 2 * a5 * a5 / 4 + "√3/2 = " + rt(2 * m5 * m5, 3)]); }
    if (k === 6) { var t6 = pick([[5, 3, 4], [13, 5, 12], [10, 6, 8], [17, 8, 15], [25, 7, 24], [5, 4, 3], [13, 12, 5]]), h6 = R(2, 9), ch = 2 * t6[2];
      return Q("Silindr radiusi " + t6[0] + ", balandligi " + h6 + ". O'qdan " + t6[1] + " masofada o'qqa parallel kesim o'tkazildi. Kesim yuzini toping.", ch * h6, W(ch * h6, [t6[2] * h6, 2 * t6[0] * h6, ch * h6 + h6, (2 * t6[0] - t6[1]) * h6]), ["Kesim — to'g'ri to'rtburchak, asosdagi vatar: 2√(" + t6[0] + "² − " + t6[1] + "²) = " + ch, "S = " + ch + "·" + h6 + " = " + ch * h6]); }
    var r7 = R(2, 12) * 2, p7 = pick([[1, 2], [1, 4], [3, 4], [1, 3], [2, 3]]), R7 = r7 * p7[1];
    return Q("Konus asosining radiusi " + R7 + ". Uchidan hisoblaganda balandlikning " + p7[0] + "/" + p7[1] + " qismidan asosga parallel kesim o'tkazildi. Kesim radiusini toping.", R7 * p7[0] / p7[1], W(R7 * p7[0] / p7[1], [R7 - R7 * p7[0] / p7[1], R7 * p7[0] * p7[0] / (p7[1] * p7[1]) === Math.round(R7 * p7[0] * p7[0] / (p7[1] * p7[1])) ? R7 * p7[0] * p7[0] / (p7[1] * p7[1]) : R7 / 2, R7 / p7[1] + 1, R7 / 2 === R7 * p7[0] / p7[1] ? R7 / 4 : R7 / 2]),
      ["k = " + p7[0] + "/" + p7[1], "r = " + R7 + "·" + p7[0] + "/" + p7[1] + " = " + R7 * p7[0] / p7[1]]);
  }

  /* ================= Boshlang'ich sinflar ================= */
  function s1m2x(L) {
    var k = pick([0, 1, 2, 3]), s = R(L === 1 ? 2 : 4, 10), a = R(1, s - 1), b = s - a;
    if (k === 0) return Q(a + " + " + b + " = ?", s, W(s, [s + 1, s - 1, a, s + 2].filter(function (x) { return x >= 0; })), [a + " + " + b + " = " + s]);
    if (k === 1) return Q(s + " − " + a + " = ?", b, W(b, [b + 1, b - 1, s, a === b ? b + 2 : a].filter(function (x) { return x >= 0; })), [s + " − " + a + " = " + b]);
    if (k === 2) return Q(a + " + ? = " + s, b, W(b, [b + 1, b - 1, s, a === b ? b + 2 : a].filter(function (x) { return x >= 0; })), [s + " − " + a + " = " + b]);
    return Q("? − " + a + " = " + b, s, W(s, [s + 1, s - 1, Math.abs(b - a) === s ? s + 2 : Math.abs(b - a), b].filter(function (x) { return x >= 0; })), [b + " + " + a + " = " + s]);
  }
  function s1m3x(L) {
    var a = R(L === 1 ? 6 : 2, 9), b = R(11 - a, 9), s = a + b, k = pick(L === 3 ? [2, 3, 4, 4] : [0, 1, 2, 3]);
    if (k === 0) return Q(a + " + " + b + " = ?", s, W(s, [s - 10, s + 1, s - 1, 10]), [a + " + " + (10 - a) + " = 10", "10 + " + (b - 10 + a) + " = " + s]);
    if (k === 1) return Q(s + " − " + b + " = ?", a, W(a, [a + 1, a - 1, s - 10, b]), [s + " − " + (s - 10) + " = 10", "10 − " + (b - s + 10) + " = " + a]);
    if (k === 2) return Q(a + " + ? = " + s, b, W(b, [b + 1, b - 1, s - 10, a === b ? b + 2 : a]), [s + " − " + a + " = " + b]);
    if (k === 3) return Q("? − " + b + " = " + a, s, W(s, [s + 1, s - 1, a + b - 10 > 0 ? a + b - 10 : s + 2, 10 + a]), [a + " + " + b + " = " + s]);
    var c = R(1, 9), e = R(0, 1);
    if (e === 0 && s - c >= 0) return Q(a + " + " + b + " − " + c + " = ?", s - c, W(s - c, [s + c, s - c + 1, s - c - 1, s]), [a + " + " + b + " = " + s, s + " − " + c + " = " + (s - c)]);
    var d = R(1, 20 - (s - b)); return Q(s + " − " + b + " + " + d + " = ?", a + d, W(a + d, [s - b - d, a + d + 1, a + d - 1, s + d]), [s + " − " + b + " = " + a, a + " + " + d + " = " + (a + d)]);
  }
  function s2m2x(L) {
    var a = R(2, 5), b = R(1, 10), c = a * b, k = pick([0, 0, 1, 2]);
    if (k === 0) return Q(a + " · " + b + " = ?", c, W(c, [c + a, c - a, a + b, c + 1].filter(function (x) { return x > 0; })), [a + " ni " + b + " marta qo'shamiz: " + c]);
    if (k === 1) return Q(c + " : " + a + " = ?", b, W(b, [b + 1, b - 1 || b + 2, a === b ? b + 3 : a, c - a > 0 ? c - a : b + 4]), [a + " · " + b + " = " + c + ", demak " + c + " : " + a + " = " + b]);
    return Q(a + " · ? = " + c, b, W(b, [b + 1, b - 1 || b + 2, a === b ? b + 3 : a, c - a > 0 ? c - a : b + 4]), [c + " : " + a + " = " + b]);
  }
  function s2m3x(L) {
    var T = [["m", "sm", 100], ["dm", "sm", 10], ["m", "dm", 10], ["sm", "mm", 10], ["soat", "daqiqa", 60], ["daqiqa", "soniya", 60], ["kg", "g", 1000], ["sutka", "soat", 24], ["hafta", "kun", 7], ["yil", "oy", 12], ["km", "m", 1000], ["t", "kg", 1000]];
    var t = pick(L === 1 ? T.slice(0, 9) : T), n = R(1, L === 1 ? 7 : 9), k = pick(L === 1 ? [0, 0, 1] : [0, 1, 2, 2]);
    if (k === 0) return Q(n + " " + t[0] + " necha " + t[1] + "?", n * t[2], W(n * t[2], [n * t[2] / 10 === Math.round(n * t[2] / 10) && t[2] !== 10 ? n * t[2] / 10 : n * t[2] + t[2], n * t[2] * 10, n + t[2], n * t[2] + t[2], n * (t[2] === 60 ? 100 : 60)]), ["1 " + t[0] + " = " + t[2] + " " + t[1], n + " · " + t[2] + " = " + n * t[2]]);
    if (k === 1) return Q(n * t[2] + " " + t[1] + " necha " + t[0] + "?", n, W(n, [n * 10, n + 1, n * t[2] / 2 === Math.round(n * t[2] / 2) && n * t[2] / 2 !== n ? n * t[2] / 2 : n + 2, n - 1 || n + 3]), ["1 " + t[0] + " = " + t[2] + " " + t[1], n * t[2] + " : " + t[2] + " = " + n]);
    var m = R(1, t[2] - 1);
    return Q(n + " " + t[0] + " " + m + " " + t[1] + " necha " + t[1] + "?", n * t[2] + m, W(n * t[2] + m, [n + m, n * t[2], n * 10 + m, n * t[2] + m + t[2], n * (t[2] === 60 ? 100 : 60) + m]), [n + " " + t[0] + " = " + n * t[2] + " " + t[1], n * t[2] + " + " + m + " = " + (n * t[2] + m)]);
  }
  function s4m3x(L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3, 4] : [3, 4, 5, 5]);
    var who = pick([["Piyoda", 3, 6], ["Velosipedchi", 10, 20], ["Avtobus", 40, 70], ["Avtomobil", 50, 100], ["Poyezd", 60, 120], ["Mototsiklchi", 30, 80]]), v = R(who[1], who[2]), t = R(2, L === 1 ? 5 : 9);
    if (k === 0) return Q(who[0] + " " + v + " km/soat tezlik bilan " + t + " soat yurdi. U necha km yo'l bosdi?", v * t, W(v * t, [v + t, v * t + v, v * (t - 1), v * t + 10]), ["S = v · t = " + v + " · " + t + " = " + v * t]);
    if (k === 1) return Q(who[0] + " " + v * t + " km yo'lni " + t + " soatda bosib o'tdi. Uning tezligi necha km/soat?", v, W(v, [v * t - t, v + t, v + 1, v - 1]), ["v = S : t = " + v * t + " : " + t + " = " + v]);
    if (k === 2) return Q(who[0] + " " + v + " km/soat tezlik bilan " + v * t + " km yo'l bosdi. U necha soat yurdi?", t, W(t, [t + 1, t - 1, t + 2, v]), ["t = S : v = " + v * t + " : " + v + " = " + t]);
    var v1 = R(40, 80), v2 = R(40, 80), t3 = R(2, 5);
    if (k === 3) return Q("Ikki shahardan bir vaqtda bir-biriga qarab ikki avtomobil yo'lga chiqdi. Tezliklari " + v1 + " va " + v2 + " km/soat. " + t3 + " soatdan keyin ular uchrashdi. Shaharlar orasidagi masofani toping (km).", (v1 + v2) * t3, W((v1 + v2) * t3, [Math.abs(v1 - v2) * t3, v1 * t3, (v1 + v2) * t3 + 10, (v1 + v2) * (t3 + 1)]), ["Yaqinlashish tezligi: " + v1 + " + " + v2 + " = " + (v1 + v2), "S = " + (v1 + v2) + " · " + t3 + " = " + (v1 + v2) * t3]);
    if (k === 4) { if (v1 === v2) v2 = v1 + 10; var f = Math.max(v1, v2), sl = Math.min(v1, v2), d4 = (f - sl) * t3;
      return Q("Orasidagi masofa " + d4 + " km bo'lgan ikki avtomobil bir yo'nalishda harakatlanmoqda: oldindagisi " + sl + " km/soat, orqadagisi " + f + " km/soat. Necha soatdan keyin orqadagisi yetib oladi?", t3, W(t3, [t3 + 1, t3 - 1 || t3 + 2, d4 / (f + sl) === Math.round(d4 / (f + sl)) && d4 / (f + sl) !== t3 ? d4 / (f + sl) : t3 + 3, f - sl]), ["Yaqinlashish tezligi: " + f + " − " + sl + " = " + (f - sl), "t = " + d4 + " : " + (f - sl) + " = " + t3]); }
    var vb = R(12, 30), u = R(2, 5), t5 = R(2, 6), down = Math.random() < .5;
    return Q("Qayiqning turg'un suvdagi tezligi " + vb + " km/soat, daryo oqimi " + u + " km/soat. Qayiq oqim " + (down ? "bo'ylab" : "ga qarshi") + " " + t5 + " soatda necha km suzadi?", (down ? vb + u : vb - u) * t5, W((down ? vb + u : vb - u) * t5, [(down ? vb - u : vb + u) * t5, vb * t5, (vb + u) * t5 + u, u * t5]), ["Tezlik: " + vb + (down ? " + " : " − ") + u + " = " + (down ? vb + u : vb - u) + " km/soat", "S = " + (down ? vb + u : vb - u) + " · " + t5 + " = " + (down ? vb + u : vb - u) * t5]);
  }
  function sq(a, b, minus) { return "x² " + (minus ? "− " : "+ ") + (2 * a * b === 1 ? "" : 2 * a * b) + "x + " + b * b; }
  function s7m2x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 3] : L === 2 ? [0, 2, 3, 4, 5] : [4, 5, 6, 7]), b = R(1, L === 1 ? 9 : 12), c = R(1, 9);
    if (k === 0) { var a0 = "x² − " + 2 * b + "x + " + b * b; return Q("Qavsni oching: (x − " + b + ")²", a0, W(a0, ["x² − " + b * b, "x² + " + 2 * b + "x + " + b * b, "x² − " + b + "x + " + b * b, "x² − " + 2 * b + "x − " + b * b]), ["(a − b)² = a² − 2ab + b²", "= " + a0]); }
    if (k === 1) { var a1 = "x² − " + b * b; return Q("Ko'paytiring: (x − " + b + ")(x + " + b + ")", a1, W(a1, ["x² + " + b * b, "x² − " + 2 * b + "x − " + b * b, "x² − " + b, "x² − " + 2 * b]), ["(a − b)(a + b) = a² − b²", "= " + a1]); }
    if (k === 2) { var s2 = b + c, p2 = b * c, a2 = "x² + " + s2 + "x + " + p2; return Q("Ko'paytiring: (x + " + b + ")(x + " + c + ")", a2.replace("+ 1x", "+ x"), W(a2.replace("+ 1x", "+ x"), ["x² + " + p2 + "x + " + s2, "x² + " + p2, "x² + " + s2 + "x + " + s2, "x² + " + (s2 + 1) + "x + " + p2]), ["(x + a)(x + b) = x² + (a + b)x + ab", "= " + a2]); }
    if (k === 3) { var a3 = "(x + " + b + ")²"; return Q("Ko'paytuvchilarga ajrating: x² + " + 2 * b + "x + " + b * b, a3, W(a3, ["(x − " + b + ")²", "(x + " + 2 * b + ")²", "(x + " + b + ")(x − " + b + ")", "(x + " + b * b + ")²"]), ["a² + 2ab + b² = (a + b)²", "= " + a3]); }
    if (k === 4) { var m4 = R(21, 99), n4 = m4 - R(1, 9); return Q("Qulay usulda hisoblang: " + m4 + "² − " + n4 + "²", m4 * m4 - n4 * n4, W(m4 * m4 - n4 * n4, [(m4 - n4) * (m4 - n4), m4 + n4, (m4 - n4) * (m4 + n4) + 10, (m4 - n4) * 100]), ["a² − b² = (a − b)(a + b)", "= " + (m4 - n4) + " · " + (m4 + n4) + " = " + (m4 * m4 - n4 * n4)]); }
    if (k === 5) { var a5 = R(2, 5), b5 = R(1, 7), ans5 = a5 * a5 + "x² + " + 2 * a5 * b5 + "x + " + b5 * b5;
      return Q("Qavsni oching: (" + a5 + "x + " + b5 + ")²", ans5, W(ans5, [a5 * a5 + "x² + " + b5 * b5, a5 + "x² + " + 2 * a5 * b5 + "x + " + b5 * b5, a5 * a5 + "x² + " + a5 * b5 + "x + " + b5 * b5, 2 * a5 + "x² + " + 2 * a5 * b5 + "x + " + 2 * b5]), ["(a + b)² = a² + 2ab + b²", "= " + ans5]); }
    if (k === 6) { var b6 = R(1, 5), a6 = "x³ + " + 3 * b6 + "x² + " + 3 * b6 * b6 + "x + " + b6 * b6 * b6;
      return Q("Qavsni oching: (x + " + b6 + ")³", a6.replace("+ 3x²", "+ 3x²"), W(a6, ["x³ + " + b6 * b6 * b6, "x³ + " + b6 + "x² + " + b6 * b6 + "x + " + b6 * b6 * b6, "x³ + " + 3 * b6 + "x² + " + 3 * b6 + "x + " + b6 * b6 * b6, "x³ + " + 3 * b6 * b6 + "x² + " + 3 * b6 + "x + " + b6 * b6 * b6]), ["(a + b)³ = a³ + 3a²b + 3ab² + b³", "= " + a6]); }
    var b7 = R(1, 6), minus = Math.random() < .5, a7 = minus ? "(x − " + b7 + ")(x² + " + (b7 === 1 ? "" : b7) + "x + " + b7 * b7 + ")" : "(x + " + b7 + ")(x² − " + (b7 === 1 ? "" : b7) + "x + " + b7 * b7 + ")";
    return Q("Ko'paytuvchilarga ajrating: x³ " + (minus ? "− " : "+ ") + b7 * b7 * b7, a7, W(a7, [minus ? "(x − " + b7 + ")(x² − " + (b7 === 1 ? "" : b7) + "x + " + b7 * b7 + ")" : "(x + " + b7 + ")(x² + " + (b7 === 1 ? "" : b7) + "x + " + b7 * b7 + ")", minus ? "(x − " + b7 + ")³" : "(x + " + b7 + ")³", minus ? "(x + " + b7 + ")(x² − " + (b7 === 1 ? "" : b7) + "x + " + b7 * b7 + ")" : "(x − " + b7 + ")(x² + " + (b7 === 1 ? "" : b7) + "x + " + b7 * b7 + ")", minus ? "(x − " + b7 + ")(x² + " + b7 * b7 + ")" : "(x + " + b7 + ")(x² + " + b7 * b7 + ")"]),
      [minus ? "a³ − b³ = (a − b)(a² + ab + b²)" : "a³ + b³ = (a + b)(a² − ab + b²)", "= " + a7]);
  }
  function s8m4x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 3] : L === 2 ? [0, 2, 3, 4, 5] : [3, 4, 5, 6]), b = R(1, 9), a = R(2, 9);
    if (k === 0) return Q("Kasrni qisqartiring: (x² + " + 2 * b + "x + " + b * b + ") / (x + " + b + ")", "x + " + b, W("x + " + b, ["x − " + b, "x + " + b * b, "(x + " + b + ")²", "x + " + 2 * b, "x² + " + b]), ["Surat: (x + " + b + ")², qisqargach x + " + b]);
    if (k === 1) return Q("Kasrni qisqartiring: (" + a + "x + " + a * b + ") / " + a, "x + " + b, W("x + " + b, ["x + " + a * b, a + "x + " + b, "x + " + (a * b - a), "x + " + (b + 1)]), [a + "x + " + a * b + " = " + a + "(x + " + b + ")", "Javob: x + " + b]);
    if (k === 2) { var c = R(1, 9); if (a === c) c = a + 1; return Q("Amalni bajaring: " + a + "/x + " + c + "/x", (a + c) + "/x", [(a + c) + "/(2x)", (a * c) + "/x", (a + c) + "/x²"], ["Maxrajlar bir xil — suratlar qo'shiladi", "= " + (a + c) + "/x"]); }
    if (k === 3) { var x3 = R(-6, 9); while (x3 === b || x3 === -b) x3++; var num = x3 * x3 - b * b, den = x3 - b, val = F(num, den);
      return Q("(x² − " + b * b + ")/(x − " + b + ") kasrning x = " + ms(x3) + " dagi qiymatini toping.", val, W(val, [F(x3 - b, 1), F(num, 1), F(x3 * x3 + b * b, den), F(-num, den), F(x3 + b + 1, 1)]), ["Qisqartiramiz: x + " + b, ms(x3) + " + " + b + " = " + val]); }
    if (k === 4) { var a4 = "x ≠ ±" + b; return Q("Kasrning aniqlanish sohasini toping: " + a + "/(x² − " + b * b + ")", a4, W(a4, ["x ≠ " + b, "x ≠ " + b * b, "x ≠ 0", "x ≠ " + a, "x ≠ −" + b]), ["x² − " + b * b + " ≠ 0", "x ≠ ±" + b]); }
    if (k === 5) { var c5 = R(2, 9), d5 = R(2, 9); return Q("Amalni bajaring: (" + a + "/x) · (x²/" + c5 + ")", F(a, c5) === String(a / c5) ? (a / c5 === 1 ? "x" : (a / c5) + "x") : a + "x/" + c5, W(F(a, c5) === String(a / c5) ? (a / c5 === 1 ? "x" : (a / c5) + "x") : a + "x/" + c5, [a + "x²/" + c5, a + "/(" + c5 + "x)", (a * c5) + "x", a + "x/" + (c5 + 1)]), ["x² : x = x", "= " + a + "x/" + c5]); }
    var p6 = R(1, 9), q6 = R(1, 9); if (p6 === q6) q6++;
    var ansN = "(x + " + p6 + ")/(x − " + q6 + ")";
    return Q("Kasrni qisqartiring: (x² + " + (p6 + q6) + "x + " + p6 * q6 + ") / (x² − " + q6 * q6 + ")", ansN, W(ansN, ["(x + " + q6 + ")/(x − " + p6 + ")", "(x + " + p6 + ")/(x + " + q6 + ")", "(x − " + p6 + ")/(x − " + q6 + ")", "x + " + p6]),
      ["Surat: (x + " + p6 + ")(x + " + q6 + ")", "Maxraj: (x − " + q6 + ")(x + " + q6 + ")", "= " + ansN]);
  }
  function s9m4x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 3] : L === 2 ? [0, 1, 2, 3, 4, 5, 6] : [4, 5, 6, 7, 8]);
    if (k === 0) { var r = R(2, 15); return Q("Aylana uzunligi " + piS(2 * r) + ". Uning radiusini toping.", r, W(r, [2 * r, r + 1, r * r, r - 1]), ["C = 2πr → r = C/(2π)", "r = " + r]); }
    if (k === 1) { var r1 = R(2, 15); return Q("Doira yuzi " + piS(r1 * r1) + ". Uning radiusini toping.", r1, W(r1, [r1 * r1 / 2 === Math.round(r1 * r1 / 2) ? r1 * r1 / 2 : r1 + 2, r1 + 1, r1 * r1, 2 * r1]), ["S = πr² → r² = " + r1 * r1, "r = " + r1]); }
    if (k === 2) { var d2 = 2 * R(2, 12); return Q("Diametri " + d2 + " bo'lgan doiraning yuzini toping.", piS(d2 * d2 / 4), piW(d2 * d2 / 4), ["r = d/2 = " + d2 / 2, "S = πr² = " + piS(d2 * d2 / 4)]); }
    if (k === 3) { var ins = R(10, 85); return Q("Aylanaga ichki chizilgan burchak " + ins + "°. Shu yoyga tiralgan markaziy burchakni toping.", deg(2 * ins), W(deg(2 * ins), [deg(ins), deg(180 - ins), deg(360 - 2 * ins), deg(2 * ins + 10)]), ["Markaziy burchak = 2 · ichki chizilgan burchak", "= 2·" + ins + "° = " + 2 * ins + "°"]); }
    if (k === 4) { var r4 = pick([3, 6, 9, 12, 18, 2, 4, 8]), al = pick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]);
      return Q("Radiusi " + r4 + " bo'lgan aylananing " + al + "° li yoyi uzunligini toping.", piS(r4 * al, 180), piW(r4 * al, 180), ["l = πrα/180°", "= π·" + r4 + "·" + al + "/180 = " + piS(r4 * al, 180)]); }
    if (k === 5) { var r5 = pick([2, 3, 4, 6, 8, 12]), a5 = pick([30, 45, 60, 90, 120, 180]);
      return Q("Radiusi " + r5 + " bo'lgan doiraning " + a5 + "° li sektori yuzini toping.", piS(r5 * r5 * a5, 360), piW(r5 * r5 * a5, 360), ["S = πr²α/360°", "= π·" + r5 * r5 + "·" + a5 + "/360 = " + piS(r5 * r5 * a5, 360)]); }
    if (k === 6) { var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]]), sw = Math.random() < .5, rr = sw ? t[1] : t[0], tl = sw ? t[0] : t[1];
      return Q("Aylana radiusi " + rr + ". Markazdan " + t[2] + " masofadagi nuqtadan aylanaga urinma o'tkazildi. Urinma kesmasining uzunligini toping.", tl, W(tl, [t[2] - rr, t[2] + rr, rr, tl + 1]), ["Urinma radiusga perpendikulyar", "t² = " + t[2] + "² − " + rr + "² = " + tl * tl, "t = " + tl]); }
    if (k === 7) { var t7 = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), d7 = t7[0], hc = t7[1];
      return Q("Aylana radiusi " + t7[2] + ". Markazdan " + d7 + " masofadagi vatar uzunligini toping.", 2 * hc, W(2 * hc, [hc, t7[2] - d7, 2 * (t7[2] - d7), 2 * hc + 2]), ["Vatar yarmi: √(" + t7[2] + "² − " + d7 + "²) = " + hc, "Vatar = 2·" + hc + " = " + 2 * hc]); }
    var tr = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [7, 8, 9], [4, 5, 6], [5, 6, 7]]), kk = R(2, 5), P = (tr[0] + tr[1] + tr[2]) * kk, ask = R(0, 2);
    return Q("Uchburchak tomonlari " + tr.join(", ") + ". Unga o'xshash uchburchakning perimetri " + P + ". Uning eng " + (ask === 0 ? "kichik" : ask === 1 ? "katta" : "o'rtadagi") + " tomonini toping.", (ask === 0 ? tr[0] : ask === 1 ? tr[2] : tr[1]) * kk,
      W((ask === 0 ? tr[0] : ask === 1 ? tr[2] : tr[1]) * kk, [tr[0] * kk, tr[1] * kk, tr[2] * kk, (ask === 0 ? tr[0] : ask === 1 ? tr[2] : tr[1]) * (kk + 1), P / 3 === Math.round(P / 3) ? P / 3 : P - 1]),
      ["k = " + P + " : " + (tr[0] + tr[1] + tr[2]) + " = " + kk, "Tomon: " + (ask === 0 ? tr[0] : ask === 1 ? tr[2] : tr[1]) + "·" + kk + " = " + (ask === 0 ? tr[0] : ask === 1 ? tr[2] : tr[1]) * kk]);
  }
  function s9m5x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 3] : [1, 2, 3, 4]);
    if (k === 0) { var n = R(5, 30), m = R(1, n - 1), it = pick([["sinfda", "o'quvchi", "qiz", "o'g'il bola"], ["savatda", "meva", "olma", "nok"], ["qutida", "qalam", "qizil qalam", "ko'k qalam"]]);
      return Q(it[0].charAt(0).toUpperCase() + it[0].slice(1) + " " + n + " ta " + it[1] + " bor, ulardan " + m + " tasi " + it[2] + ", qolgani " + it[3] + ". Tavakkaliga tanlangani " + it[3] + " bo'lish ehtimolini toping.", F(n - m, n), W(F(n - m, n), [F(m, n), F(n - m, m), F(1, n), F(n - m + 1, n)]), ["Qulay: " + n + " − " + m + " = " + (n - m), "P = " + F(n - m, n)]); }
    if (k === 1) { var w = pick(["MATEMATIKA", "KITOBXON", "SAMARQAND", "OLIMPIADA", "ALGEBRA", "GEOMETRIYA", "TOSHKENT", "UNLI"]), letters = w.split(""), ch = pick(letters), c = letters.filter(function (x) { return x === ch; }).length;
      return Q(w + " so'zi harflari kartochkalarga yozilgan. Tavakkaliga olingan kartochkada \"" + ch + "\" harfi bo'lish ehtimolini toping.", F(c, letters.length), W(F(c, letters.length), [F(1, letters.length), F(c + 1, letters.length), F(c, letters.length - c), F(letters.length - c, letters.length)]), ["Jami harflar: " + letters.length, "\"" + ch + "\" — " + c + " ta", "P = " + F(c, letters.length)]); }
    if (k === 2) { var days = R(0, 2), lab = ["dam olish kuni (shanba yoki yakshanba)", "seshanba", "ish kuni (dushanba–juma)"][days], c2 = [2, 1, 5][days];
      return Q("Haftaning tasodifiy bir kuni tanlandi. U " + lab + " bo'lish ehtimolini toping.", F(c2, 7), W(F(c2, 7), [F(7 - c2, 7), F(1, 7), F(c2, 5), F(c2 + 1, 7)]), ["Hafta — 7 kun", "Qulay: " + c2, "P = " + F(c2, 7)]); }
    if (k === 3) { var N = pick([10, 20, 30, 50, 100]), d3 = pick([2, 3, 4, 5, 10]), c3 = Math.floor(N / d3);
      return Q("1 dan " + N + " gacha sonlardan biri tanlandi. U " + d3 + " ga bo'linish ehtimolini toping.", F(c3, N), W(F(c3, N), [F(1, d3 + 1), F(c3 + 1, N), F(N - c3, N), F(d3, N)]), [d3 + " ga bo'linuvchilar: " + c3 + " ta", "P = " + F(c3, N)]); }
    var a = R(1, 9), b = R(1, 9), tot = 10, ev = a + b;
    if (ev > 10) return null;
    return Q("A va B birgalikda bo'lmagan hodisalar: P(A) = " + F(a, tot) + ", P(B) = " + F(b, tot) + ". A yoki B ro'y berish ehtimolini toping.", F(ev, tot), W(F(ev, tot), [F(a * b, 100), F(Math.abs(a - b), tot) === "0" ? F(ev + 1, tot) : F(Math.abs(a - b), tot), F(tot - ev, tot), F(ev, 2 * tot)]), ["P(A ∪ B) = P(A) + P(B)", "= " + F(ev, tot)]);
  }

  aug("t81", t81x, sh(.72, .72, .72));
  aug("t87", t87x, sh(.75, .75, .75));
  aug("t88", t88x, sh(.5, .5, .85));
  aug("s1m2", s1m2x, sh(.82, .4, .4));
  aug("s1m3", s1m3x, sh(.4, .65, .88));
  aug("s2m2", s2m2x, sh(.85, .5, .2));
  aug("s2m3", s2m3x, sh(.88, .88, .88));
  aug("s4m3", s4m3x, sh(.8, .6, .5));
  aug("s7m2", s7m2x, sh(.8, .6, .4));
  aug("s8m4", s8m4x, sh(.8, .6, .4));
  aug("s9m4", s9m4x, sh(.8, .8, .8));
  aug("s9m5", s9m5x, sh(.75, .3, .2));

})();
