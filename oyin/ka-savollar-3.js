/*! Kuvonch Academy — mavzu savollari: 19–36 (ko'rsatkichli, logarifmik, trigonometriya) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle, fr = H.fr, ms = H.ms, par = H.par, poly = H.poly, nearW = H.nearW;
  function wT(right, list) { return list.filter(function (x) { return x !== right; }); }
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "−": "⁻", "+": "⁺", "x": "ˣ", "y": "ʸ", "n": "ⁿ", "(": "⁽", ")": "⁾", "=": "⁼" };
  function sup(n) { return String(n).split("").map(function (c) { return SUP[c] || c; }).join(""); }
  var G = {};

  /* ---- 19. Ko'rsatkichli funksiya ---- */
  G.t19 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    var a = pick([2, 3, 5, 10]), n = R(2, L === 3 ? 7 : 5);
    if (k === 0) return { q: a + sup(n) + " ni hisoblang.", a: Math.pow(a, n), hint: "son", w: [Math.pow(a, n - 1), Math.pow(a, n + 1), a * n, Math.pow(a, n) + a],
      steps: [a + " ni " + n + " marta o'ziga ko'paytiramiz", "= " + Math.pow(a, n)] };
    if (k === 1) return { q: "y = " + a + sup("x") + " funksiya Oy o'qini qaysi nuqtada kesadi?", a: "(0; 1)", hint: "(x; y)", type: "text",
      w: ["(0; " + a + ")", "(1; " + a + ")", "(0; 0)", "(1; 0)"], steps: ["x = 0: y = " + a + "⁰ = 1", "Nuqta: (0; 1)"] };
    if (k === 2) { var b = pick([2, 3, 5, 10, 0.5]);
      var inc = b > 1;
      return { q: "y = " + (b === 0.5 ? "(1/2)" : b) + sup("x") + " funksiya o'suvchimi yoki kamayuvchimi?", a: inc ? "o'suvchi" : "kamayuvchi", hint: "o'suvchi / kamayuvchi", type: "text",
        w: [inc ? "kamayuvchi" : "o'suvchi", "o'zgarmas"], steps: ["Asos 1 dan katta bo'lsa o'suvchi, 0 < a < 1 bo'lsa kamayuvchi", (b === 0.5 ? "1/2 < 1" : b + " > 1") + " → " + (inc ? "o'suvchi" : "kamayuvchi")] }; }
    if (k === 3) { var m = R(2, 5), p = R(2, 5);
      return { q: a + sup(m) + " · " + a + sup(p) + " ni " + a + " asosli bitta daraja ko'rinishida yozing.", a: a + "^" + (m + p), hint: "a^n", type: "text",
        w: [a + "^" + (m * p), a + "^" + (p - m), a + "^" + (m + p + 1), (a * a) + "^" + (m + p)],
        steps: ["aᵐ·aⁿ = aᵐ⁺ⁿ", "= " + a + "^" + (m + p)] }; }
    if (k === 4) return { q: "y = " + a + sup("x") + " funksiyaning qiymatlar sohasini toping.", a: "(0; +∞)", hint: "oraliq", type: "text",
      w: ["[0; +∞)", "(−∞; +∞)", "(1; +∞)", "(−∞; 0)"], steps: ["Ko'rsatkichli funksiya hamma vaqt musbat, nolga teng bo'lmaydi", "E(y) = (0; +∞)"] };
    var nn = R(1, 4);
    return { q: a + sup("−" + nn) + " ni kasr ko'rinishida yozing.", a: "1/" + Math.pow(a, nn), hint: "kasr", type: "text",
      w: ["−1/" + Math.pow(a, nn), "1/" + (a * nn), String(-Math.pow(a, nn)), "1/" + Math.pow(a, nn + 1)],
      steps: ["a⁻ⁿ = 1/aⁿ", "= 1/" + a + sup(nn) + " = 1/" + Math.pow(a, nn)] };
  };

  /* ---- 20. Logarifmik funksiya ---- */
  G.t20 = function (L) {
    var a = pick([2, 3, 5, 10]), n = R(1, L === 3 ? 6 : 4);
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4]);
    if (k === 0) return { q: "log" + sub(a) + " " + Math.pow(a, n) + " ni hisoblang.", a: n, hint: "son", w: nearW(n, 5, 3).concat([Math.pow(a, n)]),
      steps: [a + sup(n) + " = " + Math.pow(a, n), "log" + sub(a) + " " + Math.pow(a, n) + " = " + n] };
    if (k === 1) return { q: "log" + sub(a) + " 1 ni hisoblang.", a: 0, hint: "son", w: [1, a, -1, 10],
      steps: ["a⁰ = 1 → log" + sub(a) + " 1 = 0"] };
    if (k === 2) return { q: "y = log" + sub(a) + " x funksiyaning aniqlanish sohasini toping.", a: "(0; +∞)", hint: "oraliq", type: "text",
      w: ["[0; +∞)", "(−∞; +∞)", "(1; +∞)", "(−∞; 0)"], steps: ["Logarifm ostidagi ifoda musbat bo'lishi kerak: x > 0", "D(y) = (0; +∞)"] };
    if (k === 3) { var p = R(1, 9);
      return { q: "y = log" + sub(a) + " (x − " + p + ") funksiyaning aniqlanish sohasini toping.", a: "(" + p + "; +∞)", hint: "oraliq", type: "text",
        w: ["[" + p + "; +∞)", "(−∞; " + p + ")", "(" + (-p) + "; +∞)", "(0; +∞)"],
        steps: ["x − " + p + " > 0", "x > " + p, "D(y) = (" + p + "; +∞)"] }; }
    return { q: "log" + sub(a) + " " + a + " ni hisoblang.", a: 1, hint: "son", w: [0, a, -1, 2],
      steps: ["a¹ = a → log" + sub(a) + " " + a + " = 1"] };
  };
  function sub(n) { var SB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" }; return String(n).split("").map(function (c) { return SB[c] || c; }).join(""); }

  /* ---- 21. Ifodalarni soddalashtirish ---- */
  G.t21 = function (L) {
    var a = pick([2, 3, 5, 10]);
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    var m = R(2, 6), p = R(2, 6);
    if (k === 0) return { q: "log" + sub(a) + " " + Math.pow(a, m) + " + log" + sub(a) + " " + Math.pow(a, p) + " ni hisoblang.", a: m + p, hint: "son", w: nearW(m + p, 5, 3).concat([m * p]),
      steps: ["log x + log y = log(xy)", "= " + m + " + " + p + " = " + (m + p)] };
    if (k === 1) return { q: "log" + sub(a) + " " + Math.pow(a, m + p) + " − log" + sub(a) + " " + Math.pow(a, p) + " ni hisoblang.", a: m, hint: "son", w: nearW(m, 5, 3).concat([m + p]),
      steps: ["log x − log y = log(x/y)", "= " + (m + p) + " − " + p + " = " + m] };
    if (k === 2) { var mm = Math.max(m, p) + 1, pp = Math.min(m, p); if (pp >= mm) pp = mm - 1;
      return { q: a + sup(mm) + " : " + a + sup(pp) + " ni daraja ko'rinishida yozing.", a: a + "^" + (mm - pp), hint: "a^n", type: "text",
        w: [a + "^" + (mm + pp), a + "^" + (mm * pp), a + "^" + (mm - pp + 1), a + "^" + (pp - mm)],
        steps: ["aᵐ : aⁿ = aᵐ⁻ⁿ", "= " + a + "^(" + mm + " − " + pp + ") = " + a + "^" + (mm - pp)] }; }
    if (k === 3) return { q: "(" + a + sup(m) + ")" + sup(p) + " ni bitta daraja ko'rinishida yozing.", a: a + "^" + (m * p), hint: "a^n", type: "text",
      w: [a + "^" + (m + p), a + "^" + (m * p + 1), (a * a) + "^" + (m * p), a + "^" + Math.abs(m - p)],
      steps: ["(aᵐ)ⁿ = aᵐⁿ", "= " + a + "^" + (m * p)] };
    var c = R(2, 5);
    return { q: c + "·log" + sub(a) + " " + a + sup(m) + " ni hisoblang.", a: c * m, hint: "son", w: nearW(c * m, 5, 4),
      steps: ["log" + sub(a) + " " + a + sup(m) + " = " + m, c + "·" + m + " = " + c * m] };
  };

  /* ---- 22. Sodda ko'rsatkichli tenglamalar ---- */
  G.t22 = function (L) {
    var a = pick([2, 3, 5, 10]);
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    var x = R(1, L === 3 ? 6 : 4);
    if (k === 0) return { q: a + sup("x") + " = " + Math.pow(a, x) + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5, 3).concat([Math.pow(a, x)]),
      steps: [Math.pow(a, x) + " = " + a + sup(x), "Asoslar teng → x = " + x] };
    if (k === 1) { var b = RNZ(-4, 4), c = R(1, 4), rhs = Math.pow(a, c);
      // a^(x+b) = a^c → x = c − b
      return { q: a + sup("x" + (b >= 0 ? "+" + b : String(b))) + " = " + rhs + " tenglamani yeching.", a: c - b, hint: "son", w: nearW(c - b, 5, 3),
        steps: [rhs + " = " + a + sup(c), "x " + (b >= 0 ? "+ " + b : "− " + (-b)) + " = " + c, "x = " + (c - b)] }; }
    var m = pick([2, 3]), c2 = R(1, 3);
    return { q: a + sup(m + "x") + " = " + Math.pow(a, m * c2) + " tenglamani yeching.", a: c2, hint: "son", w: nearW(c2, 5, 3).concat([m * c2]),
      steps: [Math.pow(a, m * c2) + " = " + a + sup(m * c2), m + "x = " + m * c2, "x = " + c2] };
  };

  /* ---- 23. Sodda logarifmik tenglamalar ---- */
  G.t23 = function (L) {
    var a = pick([2, 3, 5, 10]), n = R(1, L === 3 ? 5 : 3);
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    if (k === 0) return { q: "log" + sub(a) + " x = " + n + " tenglamani yeching.", a: Math.pow(a, n), hint: "son", w: nearW(Math.pow(a, n), 5, Math.max(3, Math.pow(a, n) / 2)).concat([a * n]),
      steps: ["x = " + a + sup(n), "x = " + Math.pow(a, n)] };
    if (k === 1) { var b = RNZ(-6, 6), x = Math.pow(a, n) - b;
      return { q: "log" + sub(a) + " (x " + (b >= 0 ? "+ " + b : "− " + (-b)) + ") = " + n + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5, 4),
        steps: ["x " + (b >= 0 ? "+ " + b : "− " + (-b)) + " = " + a + sup(n) + " = " + Math.pow(a, n), "x = " + x] }; }
    var c = pick([2, 3]), xv = Math.pow(a, n);
    return { q: "log" + sub(a) + " x = " + n + " bo'lsa, " + c + "·log" + sub(a) + " x ni toping.", a: c * n, hint: "son", w: nearW(c * n, 5, 3).concat([xv]),
      steps: [c + "·" + n + " = " + c * n] };
  };

  /* ---- 24. Ko'rsatkichli va logarifmik sistemalar ---- */
  G.t24 = function (L) {
    var a = pick([2, 3, 5]), m = R(1, 4), n = R(1, 4);
    var k = pick([0, 1]);
    if (k === 0) return { q: "Sistemani yeching: " + a + sup("x") + " = " + Math.pow(a, m) + " ; " + a + sup("y") + " = " + Math.pow(a, n) + ". x + y ni toping.",
      a: m + n, hint: "son", w: nearW(m + n, 5, 3).concat([m * n]),
      steps: ["x = " + m + ", y = " + n, "x + y = " + (m + n)] };
    return { q: "Sistemani yeching: log" + sub(a) + " x = " + m + " ; log" + sub(a) + " y = " + n + ". x·y ni toping.",
      a: Math.pow(a, m + n), hint: "son", w: [Math.pow(a, m) + Math.pow(a, n), Math.pow(a, m * n), Math.pow(a, m + n + 1), m + n],
      steps: ["x = " + a + sup(m) + " = " + Math.pow(a, m) + ", y = " + a + sup(n) + " = " + Math.pow(a, n), "x·y = " + a + sup(m + n) + " = " + Math.pow(a, m + n)] };
  };

  /* ---- 25. Ko'rsatkichli tengsizliklar ---- */
  G.t25 = function (L) {
    var a = pick([2, 3, 5, 10]), n = R(1, 4), gt = Math.random() < .5;
    var k = pick(L === 1 ? [0] : [0, 1]);
    if (k === 0) { var ans = gt ? "(" + n + "; +∞)" : "(−∞; " + n + ")";
      return { q: a + sup("x") + " " + (gt ? ">" : "<") + " " + Math.pow(a, n) + " tengsizlikni yeching.", a: ans, hint: "oraliq", type: "text",
        w: wT(ans, ["(" + n + "; +∞)", "(−∞; " + n + ")", "[" + n + "; +∞)", "(0; " + n + ")"]),
        steps: [Math.pow(a, n) + " = " + a + sup(n), "Asos " + a + " > 1 → ishora saqlanadi", "x " + (gt ? ">" : "<") + " " + n, "Javob: " + ans] }; }
    var ans2 = gt ? "(−∞; " + n + ")" : "(" + n + "; +∞)";
    return { q: "(1/" + a + ")" + sup("x") + " " + (gt ? ">" : "<") + " (1/" + a + ")" + sup(n) + " tengsizlikni yeching.", a: ans2, hint: "oraliq", type: "text",
      w: wT(ans2, ["(" + n + "; +∞)", "(−∞; " + n + ")", "[" + n + "; +∞)", "(0; +∞)"]),
      steps: ["Asos 0 < 1/" + a + " < 1 → tengsizlik ishorasi almashadi", "x " + (gt ? "<" : ">") + " " + n, "Javob: " + ans2] };
  };

  /* ---- 26. Logarifmik tengsizliklar ---- */
  G.t26 = function (L) {
    var a = pick([2, 3, 5, 10]), n = R(1, 3), gt = Math.random() < .5;
    var v = Math.pow(a, n);
    var ans = gt ? "(" + v + "; +∞)" : "(0; " + v + ")";
    return { q: "log" + sub(a) + " x " + (gt ? ">" : "<") + " " + n + " tengsizlikni yeching.", a: ans, hint: "oraliq", type: "text",
      w: wT(ans, ["(" + v + "; +∞)", "(0; " + v + ")", "(−∞; " + v + ")", "[" + v + "; +∞)"]),
      steps: ["ODZ: x > 0", n + " = log" + sub(a) + " " + v, "Asos " + a + " > 1 → x " + (gt ? ">" : "<") + " " + v, "Javob: " + ans] };
  };

  /* ---- 27. Ko'rsatkichli modellashtirish ---- */
  G.t27 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2]);
    if (k === 0) { var st = pick([100, 200, 500, 1000]), t = R(2, 6), end = st * Math.pow(2, t);
      return { q: "Bakteriya soni har soatda 2 marta ko'payadi. Boshida " + st + " ta bo'lsa, " + t + " soatdan keyin nechta bo'ladi?",
        a: end, hint: "son", w: [st * 2 * t, st * Math.pow(2, t - 1), st * Math.pow(2, t + 1), st + 2 * t],
        steps: ["N(t) = " + st + "·2ᵗ", "N(" + t + ") = " + st + "·2" + sup(t) + " = " + end] }; }
    if (k === 1) { var m0 = pick([80, 160, 320, 640]), hl = R(2, 5), per = R(1, 3), left = m0 / Math.pow(2, per);
      return { q: "Radioaktiv moddaning yarim yemirilish davri " + hl + " yil. " + m0 + " g moddadan " + (hl * per) + " yildan keyin qancha qoladi (g)?",
        a: left, hint: "gramm", w: [m0 / 2, m0 / Math.pow(2, per + 1), m0 - per * 10, m0 / (2 * per)].filter(function (x) { return x !== left; }),
        steps: [(hl * per) + " yil = " + per + " ta yarim yemirilish davri", m0 + " : 2" + sup(per) + " = " + left + " g"] }; }
    var cap = pick([1000, 2000, 5000]), rate = pick([10, 20, 50]), yr = R(2, 3);
    var fin = Math.round(cap * Math.pow(1 + rate / 100, yr));
    return { q: cap + " so'm yiliga " + rate + "% ustama bilan qo'yildi. " + yr + " yildan keyin qancha bo'ladi (so'm)?",
      a: fin, hint: "so'm", w: [cap + cap * rate * yr / 100, Math.round(cap * (1 + rate / 100)), Math.round(cap * Math.pow(1 + rate / 100, yr + 1)), cap * yr].filter(function (x) { return x !== fin; }),
      steps: ["S = " + cap + "·(1 + " + rate + "/100)" + sup(yr), "= " + fin + " so'm"] };
  };

  /* ---- 28. Ko'rsatkichli va logarifmik misollar ---- */
  G.t28 = function (L) {
    var a = pick([2, 3, 5, 10]), n = R(1, 5);
    var k = pick([0, 1, 2, 3]);
    if (k === 0) return { q: a + "^(log" + sub(a) + " " + Math.pow(a, n) + ") ni hisoblang.", a: Math.pow(a, n), hint: "son",
      w: [n, Math.pow(a, n - 1), Math.pow(a, n + 1), a * n], steps: ["a^(log" + sub("a") + " x) = x", "= " + Math.pow(a, n)] };
    if (k === 1) return { q: "log" + sub(a) + " (" + a + sup(n) + " · " + a + ") ni hisoblang.", a: n + 1, hint: "son", w: nearW(n + 1, 5, 3),
      steps: [a + sup(n) + "·" + a + " = " + a + sup(n + 1), "log" + sub(a) + " " + a + sup(n + 1) + " = " + (n + 1)] };
    if (k === 2) { var m = R(2, 6); return { q: "log" + sub(a) + " √(" + a + sup(2 * m) + ") ni hisoblang.", a: m, hint: "son", w: nearW(m, 5, 3).concat([2 * m]),
      steps: ["√(" + a + sup(2 * m) + ") = " + a + sup(m), "log" + sub(a) + " " + a + sup(m) + " = " + m] }; }
    return { q: "log" + sub(a) + " (1/" + a + sup(n) + ") ni hisoblang.", a: -n, hint: "son", w: nearW(-n, 5, 3),
      steps: ["1/" + a + sup(n) + " = " + a + sup("−" + n), "log" + sub(a) + " " + a + sup("−" + n) + " = −" + n] };
  };

  /* ---- Trigonometriya jadvali ---- */
  var TBL = [
    { d: 0, s: "0", c: "1", t: "0" }, { d: 30, s: "1/2", c: "√3/2", t: "√3/3" },
    { d: 45, s: "√2/2", c: "√2/2", t: "1" }, { d: 60, s: "√3/2", c: "1/2", t: "√3" },
    { d: 90, s: "1", c: "0", t: "aniqlanmagan" }, { d: 180, s: "0", c: "−1", t: "0" },
    { d: 270, s: "−1", c: "0", t: "aniqlanmagan" }, { d: 360, s: "0", c: "1", t: "0" }
  ];
  var VALS = ["0", "1/2", "√2/2", "√3/2", "1", "−1", "−1/2", "√3", "√3/3"];

  /* ---- 29. Trigonometrik funksiyalar ---- */
  G.t29 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4, 5]);
    if (k === 0) { var r = pick(TBL.slice(0, 5)), fn = pick(["sin", "cos"]);
      var v = fn === "sin" ? r.s : r.c;
      return { q: fn + " " + r.d + "° ni hisoblang.", a: v, hint: "qiymat", type: "text", w: wT(v, VALS).slice(0, 4),
        steps: ["Jadval qiymati: " + fn + " " + r.d + "° = " + v] }; }
    if (k === 1) { var fn2 = pick(["sin", "cos", "tg"]);
      var per = fn2 === "tg" ? "180°" : "360°";
      return { q: "y = " + fn2 + " x funksiyaning asosiy davri nechaga teng?", a: per, hint: "gradus", type: "text",
        w: wT(per, ["360°", "180°", "90°", "720°"]), steps: ["sin va cos davri 360°, tg va ctg davri 180°", "Javob: " + per] }; }
    if (k === 2) { var q2 = R(1, 4), fn3 = pick(["sin", "cos", "tg"]);
      var sgn = { 1: { sin: "+", cos: "+", tg: "+" }, 2: { sin: "+", cos: "−", tg: "−" }, 3: { sin: "−", cos: "−", tg: "+" }, 4: { sin: "−", cos: "+", tg: "−" } }[q2][fn3];
      var ans = sgn === "+" ? "musbat" : "manfiy";
      return { q: q2 + "-chorakda " + fn3 + " α ning ishorasi qanday?", a: ans, hint: "musbat / manfiy", type: "text", w: [ans === "musbat" ? "manfiy" : "musbat", "nol"],
        steps: ["Choraklar bo'yicha ishoralar jadvali", q2 + "-chorak, " + fn3 + " → " + ans] }; }
    if (k === 3) { var A = R(2, 7);
      return { q: "y = " + A + "·sin x funksiyaning eng katta qiymatini toping.", a: A, hint: "son", w: nearW(A, 5, 3).concat([-A, 1]),
        steps: ["sin x ≤ 1", "y ≤ " + A + "·1 = " + A] }; }
    if (k === 4) { var w2 = pick([2, 3, 4]);
      return { q: "y = sin " + w2 + "x funksiyaning davrini toping (gradusda).", a: (360 / w2) + "°", hint: "gradus", type: "text",
        w: wT((360 / w2) + "°", ["360°", "180°", "120°", "90°", "720°"]).slice(0, 4),
        steps: ["T = 360°/k", "T = 360°/" + w2 + " = " + (360 / w2) + "°"] }; }
    var A2 = R(2, 6), B = R(1, 5);
    return { q: "y = " + A2 + "·cos x + " + B + " funksiyaning eng kichik qiymatini toping.", a: B - A2, hint: "son", w: nearW(B - A2, 5, 3).concat([B + A2]),
      steps: ["cos x ≥ −1", "y ≥ " + A2 + "·(−1) + " + B + " = " + (B - A2)] };
  };

  /* ---- 30. Teskari trigonometrik funksiyalar ---- */
  G.t30 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2, 3]);
    var ar = [["0", 0], ["1/2", 30], ["√2/2", 45], ["√3/2", 60], ["1", 90]];
    var r = pick(ar);
    if (k === 0) return { q: "arcsin " + r[0] + " ni gradusda toping.", a: r[1] + "°", hint: "gradus", type: "text",
      w: wT(r[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["sin " + r[1] + "° = " + r[0], "arcsin " + r[0] + " = " + r[1] + "°"] };
    if (k === 1) { var ac = 90 - r[1];
      return { q: "arccos " + r[0] + " ni gradusda toping.", a: ac + "°", hint: "gradus", type: "text",
        w: wT(ac + "°", ["0°", "30°", "45°", "60°", "90°", "180°"]).slice(0, 4), steps: ["cos " + ac + "° = " + r[0], "arccos " + r[0] + " = " + ac + "°"] }; }
    if (k === 2) { var at = pick([["0", 0], ["√3/3", 30], ["1", 45], ["√3", 60]]);
      return { q: "arctg " + at[0] + " ni gradusda toping.", a: at[1] + "°", hint: "gradus", type: "text",
        w: wT(at[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["tg " + at[1] + "° = " + at[0], "arctg " + at[0] + " = " + at[1] + "°"] }; }
    return { q: "arcsin x + arccos x ni hisoblang (gradusda).", a: "90°", hint: "gradus", type: "text",
      w: ["180°", "45°", "360°", "0°"], steps: ["arcsin x + arccos x = 90° (π/2) — ayniyat"] };
  };

  /* ---- 31. Trigonometrik misollar ---- */
  G.t31 = function (L) {
    var k = pick([0, 1, 2, 3]);
    if (k === 0) { var n = R(2, 9); return { q: "Soddalashtiring: sin²30° + cos²30° + " + n + " = ?", a: n + 1, hint: "son", w: nearW(n + 1, 5, 3),
      steps: ["sin²α + cos²α = 1", "1 + " + n + " = " + (n + 1)] }; }
    if (k === 1) return { q: "sin 150° ni hisoblang.", a: "1/2", hint: "qiymat", type: "text", w: ["−1/2", "√3/2", "√2/2", "1"],
      steps: ["sin 150° = sin(180° − 30°) = sin 30°", "= 1/2"] };
    if (k === 2) return { q: "cos 120° ni hisoblang.", a: "−1/2", hint: "qiymat", type: "text", w: ["1/2", "−√3/2", "√3/2", "0"],
      steps: ["cos 120° = −cos(180° − 120°) = −cos 60°", "= −1/2"] };
    var m = R(2, 6);
    return { q: "tg 45° · " + m + " ni hisoblang.", a: m, hint: "son", w: nearW(m, 5, 3),
      steps: ["tg 45° = 1", "1·" + m + " = " + m] };
  };

  /* ---- 32. STEM topshiriq ---- */
  G.t32 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2, 3]);
    if (k === 0) { var h = R(3, 20), ang = pick([30, 60]);
      return { q: ang + "° burchak ostida ko'rinadigan " + h + " m balandlikdagi minoragacha masofa qanday ifoda bilan hisoblanadi?",
        a: h + "/tg " + ang + "°", hint: "ifoda", type: "text", w: [h + "·tg " + ang + "°", h + "/sin " + ang + "°", h + "·sin " + ang + "°", h + "/cos " + ang + "°"],
        steps: ["tg(burchak) = balandlik / masofa", "masofa = " + h + "/tg " + ang + "°"] }; }
    if (k === 1) { var v = R(40, 120), t = R(2, 6);
      return { q: "Avtomobil " + v + " km/soat tezlik bilan " + t + " soat yurdi. Qancha yo'l bosdi (km)?", a: v * t, hint: "km", w: nearW(v * t, 5, Math.max(3, Math.round(v / 2))).filter(function (x) { return x > 0; }),
        steps: ["S = v·t = " + v + "·" + t + " = " + v * t + " km"] }; }
    if (k === 2) { var a = R(2, 12), b = R(2, 12), c = R(2, 12), vol = a * b * c;
      return { q: a + "×" + b + "×" + c + " cm o'lchamli to'g'ri burchakli parallelepipedning hajmini toping (cm³).", a: vol, hint: "cm³",
        w: nearW(vol, 5, Math.round(vol / 4)).concat([2 * (a * b + b * c + a * c)]),
        steps: ["V = abc = " + a + "·" + b + "·" + c + " = " + vol + " cm³"] }; }
    var m = R(20, 200), p = pick([5, 10, 20, 25]);
    return { q: m + " kg mahsulotning " + p + "% i nuqsonli. Nuqsonsiz mahsulot qancha (kg)?", a: m * (100 - p) / 100, hint: "kg",
      w: [m * p / 100, m - p, m * (100 - p) / 100 + 1, m].filter(function (x) { return x !== m * (100 - p) / 100; }),
      steps: ["Nuqsonsiz ulush: " + (100 - p) + "%", m + "·" + (100 - p) + "/100 = " + m * (100 - p) / 100 + " kg"] };
  };

  /* ---- 33. sinx = a, cosx = a ---- */
  G.t33 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3]);
    var pairs = [["0", 0], ["1/2", 30], ["√2/2", 45], ["√3/2", 60], ["1", 90]];
    var r = pick(pairs);
    if (k === 0) return { q: "sin x = " + r[0] + " tenglamaning [0°; 90°] oraliqdagi yechimini toping.", a: r[1] + "°", hint: "gradus", type: "text",
      w: wT(r[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["sin " + r[1] + "° = " + r[0], "Javob: x = " + r[1] + "°"] };
    if (k === 1) { var ac = 90 - r[1];
      return { q: "cos x = " + r[0] + " tenglamaning [0°; 90°] oraliqdagi yechimini toping.", a: ac + "°", hint: "gradus", type: "text",
        w: wT(ac + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["cos " + ac + "° = " + r[0], "Javob: x = " + ac + "°"] }; }
    if (k === 2) { var big = pick([2, 3, 5, -2, -4]);
      return { q: "sin x = " + ms(big) + " tenglama yechimga egami?", a: "yo'q", hint: "ha / yo'q", type: "text", w: ["ha"],
        steps: ["−1 ≤ sin x ≤ 1", ms(big) + " bu oraliqqa kirmaydi → yechimi yo'q"] }; }
    var a2 = pick([["0", 2], ["1", 1], ["−1", 1], ["1/2", 2], ["√2/2", 2]]);
    return { q: "sin x = " + a2[0] + " tenglama [0°; 360°) oraliqda nechta yechimga ega?", a: a2[1], hint: "son", w: [0, 1, 2, 3, 4].filter(function (v) { return v !== a2[1]; }).slice(0, 4),
      steps: ["Birlik aylanada y = " + a2[0] + " chizig'i bilan kesishish nuqtalari sanaladi", "Javob: " + a2[1] + " ta"] };
  };

  /* ---- 34. tgx = a, ctgx = a ---- */
  G.t34 = function (L) {
    var r = pick([["0", 0], ["√3/3", 30], ["1", 45], ["√3", 60]]);
    var k = pick(L === 1 ? [0] : [0, 1, 2]);
    if (k === 0) return { q: "tg x = " + r[0] + " tenglamaning [0°; 90°) oraliqdagi yechimini toping.", a: r[1] + "°", hint: "gradus", type: "text",
      w: wT(r[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["tg " + r[1] + "° = " + r[0], "x = " + r[1] + "°"] };
    if (k === 1) { var c = pick([["√3", 30], ["1", 45], ["√3/3", 60]]);
      return { q: "ctg x = " + c[0] + " tenglamaning (0°; 90°) oraliqdagi yechimini toping.", a: c[1] + "°", hint: "gradus", type: "text",
        w: wT(c[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["ctg " + c[1] + "° = " + c[0], "x = " + c[1] + "°"] }; }
    return { q: "tg x = " + r[0] + " tenglamaning umumiy yechimi qanday yoziladi?", a: "x = " + r[1] + "° + 180°n", hint: "umumiy yechim", type: "text",
      w: ["x = " + r[1] + "° + 360°n", "x = ±" + r[1] + "° + 360°n", "x = " + r[1] + "° + 90°n", "x = " + (90 - r[1]) + "° + 180°n"],
      steps: ["tg davri 180°", "x = arctg a + 180°n = " + r[1] + "° + 180°n"] };
  };

  /* ---- 35. Trigonometrik tenglamalarni yechish ---- */
  G.t35 = function (L) {
    var k = pick(L === 1 ? [0] : [0, 1, 2]);
    if (k === 0) { var n = R(2, 6), r = pick([["1/2", 30], ["√2/2", 45], ["√3/2", 60]]);
      return { q: n + "·sin x = " + n + "·" + r[0] + " tenglamaning [0°; 90°] dagi yechimini toping.", a: r[1] + "°", hint: "gradus", type: "text",
        w: wT(r[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["Ikki tomonni " + n + " ga bo'lamiz: sin x = " + r[0], "x = " + r[1] + "°"] }; }
    if (k === 1) return { q: "sin x · cos x = 0 tenglama [0°; 180°] oraliqda nechta yechimga ega?", a: 3, hint: "son", w: [1, 2, 4, 5],
      steps: ["sin x = 0 → x = 0°; 180°", "cos x = 0 → x = 90°", "Jami 3 ta yechim"] };
    var c = pick([2, 3, 4]);
    return { q: "cos²x = 1 − sin²x ayniyatidan foydalanib sin x = " + (c === 2 ? "1" : "0") + " bo'lganda cos x ni toping.",
      a: c === 2 ? "0" : "±1", hint: "qiymat", type: "text", w: c === 2 ? ["1", "−1", "±1"] : ["0", "1", "−1"],
      steps: ["cos²x = 1 − sin²x", c === 2 ? "sin x = 1 → cos²x = 0 → cos x = 0" : "sin x = 0 → cos²x = 1 → cos x = ±1"] };
  };

  /* ---- 36. Eng sodda trigonometrik tengsizliklar ---- */
  G.t36 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2]);
    if (k === 0) return { q: "sin x > 1 tengsizlik yechimga egami?", a: "yo'q", hint: "ha / yo'q", type: "text", w: ["ha"],
      steps: ["sin x ning eng katta qiymati 1", "1 dan katta bo'lishi mumkin emas → yechimi yo'q"] };
    if (k === 1) return { q: "sin x > 0 tengsizlikning [0°; 360°) dagi yechimini toping.", a: "(0°; 180°)", hint: "oraliq", type: "text",
      w: ["(180°; 360°)", "(0°; 90°)", "(90°; 270°)", "[0°; 180°]"],
      steps: ["sin x yuqori yarim aylanada musbat", "Javob: (0°; 180°)"] };
    return { q: "cos x > 0 tengsizlikning [0°; 360°) dagi yechimini toping.", a: "[0°; 90°)∪(270°; 360°)", hint: "oraliq", type: "text",
      w: ["(0°; 180°)", "(90°; 270°)", "(180°; 360°)", "(0°; 90°)"],
      steps: ["cos x o'ng yarim aylanada musbat", "Javob: [0°; 90°)∪(270°; 360°)"] };
  };

  S.registerAll(G, {
    t19: "Ko'rsatkichli funksiya", t20: "Logarifmik funksiya", t21: "Ko'rsatkichli va logarifmik ifodalarni soddalashtirish",
    t22: "Sodda ko'rsatkichli tenglamalar", t23: "Sodda logarifmik tenglamalar", t24: "Ko'rsatkichli va logarifmik tenglamalar sistemasi",
    t25: "Sodda ko'rsatkichli tengsizliklar", t26: "Sodda logarifmik tengsizliklar", t27: "Ko'rsatkichli modellashtirish",
    t28: "Ko'rsatkichli va logarifmik ifodalarga doir misollar", t29: "Trigonometrik funksiyalar", t30: "Teskari trigonometrik funksiyalar",
    t31: "Trigonometrik funksiyalarga doir misollar", t32: "STEM topshiriq", t33: "sin x = a, cos x = a trigonometrik tenglamalar",
    t34: "tg x = a, ctg x = a trigonometrik tenglamalar", t35: "Trigonometrik tenglamalarni yechish", t36: "Eng sodda trigonometrik tengsizliklar"
  });
})();
