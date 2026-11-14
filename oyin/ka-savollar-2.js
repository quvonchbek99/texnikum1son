/*! Kuvonch Academy — mavzu savollari: 2–18 (algebra) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle, gcd = H.gcd, fr = H.fr, ms = H.ms, par = H.par, poly = H.poly, nearW = H.nearW;
  function iv(a, b) { return "(" + ms(a) + "; " + ms(b) + ")"; }
  function wIv(a, b) { return ["[" + ms(a) + "; " + ms(b) + "]", "(−∞; " + ms(a) + ")∪(" + ms(b) + "; +∞)", "(" + ms(a - 1) + "; " + ms(b) + ")", "(" + ms(a) + "; " + ms(b + 1) + ")", "(−∞; " + ms(b) + ")"]; }
  function wTxt(right, list) { return list.filter(function (x) { return x !== right; }); }

  var G = {};
  /* ---- 2. Kvadrat tengsizlik ---- */
  G.t2 = function (L) {
    var x1 = RNZ(-6, 6), x2 = RNZ(-6, 6); if (x1 === x2) x2 = x1 + 2;
    if (x1 > x2) { var t = x1; x1 = x2; x2 = t; }
    var a = L === 1 ? 1 : pick([1, 1, -1]);
    var b = -a * (x1 + x2), c = a * x1 * x2;
    var k = pick(L === 1 ? [0, 0, 1] : [0, 1, 2, 3]);
    var expr = poly([a, b, c]);
    if (k === 0) { // > 0
      var ans = a > 0 ? "(−∞; " + ms(x1) + ")∪(" + ms(x2) + "; +∞)" : iv(x1, x2);
      return { q: expr + " > 0 tengsizlikni yeching.", a: ans, hint: "oraliq", type: "text",
        w: wTxt(ans, [iv(x1, x2), "(−∞; " + ms(x1) + ")∪(" + ms(x2) + "; +∞)", "[" + ms(x1) + "; " + ms(x2) + "]", "(−∞; +∞)", "yechimi yo'q"]),
        steps: ["Ildizlar: x₁ = " + ms(x1) + ", x₂ = " + ms(x2), "a = " + ms(a) + (a > 0 ? " > 0 → ildizlardan tashqarida musbat" : " < 0 → ildizlar orasida musbat"), "Javob: " + ans] };
    }
    if (k === 1) { // < 0
      var ans2 = a > 0 ? iv(x1, x2) : "(−∞; " + ms(x1) + ")∪(" + ms(x2) + "; +∞)";
      return { q: expr + " < 0 tengsizlikni yeching.", a: ans2, hint: "oraliq", type: "text",
        w: wTxt(ans2, [iv(x1, x2), "(−∞; " + ms(x1) + ")∪(" + ms(x2) + "; +∞)", "[" + ms(x1) + "; " + ms(x2) + "]", "(−∞; +∞)", "yechimi yo'q"]),
        steps: ["Ildizlar: x₁ = " + ms(x1) + ", x₂ = " + ms(x2), "a = " + ms(a) + (a > 0 ? " > 0 → ildizlar orasida manfiy" : " < 0 → ildizlardan tashqarida manfiy"), "Javob: " + ans2] };
    }
    if (k === 2) { // butun yechimlar soni (a>0, <0 holati)
      a = 1; b = -(x1 + x2); c = x1 * x2;
      var cnt = Math.max(0, x2 - x1 - 1);
      return { q: poly([a, b, c]) + " < 0 tengsizlik nechta butun yechimga ega?", a: cnt, hint: "son",
        w: nearW(cnt, 5, 3).filter(function (v) { return v >= 0; }),
        steps: ["Yechim: " + iv(x1, x2), "Orasidagi butun sonlar: " + (x2 - x1 - 1 > 0 ? (x1 + 1) + " … " + (x2 - 1) : "yo'q"), "Javob: " + cnt + " ta"] };
    }
    // nuqtada ishora
    var xq = RNZ(-8, 8), val = a * xq * xq + b * xq + c;
    var sg = val > 0 ? "musbat" : val < 0 ? "nolga teng emas — manfiy" : "nolga teng";
    sg = val > 0 ? "musbat" : val < 0 ? "manfiy" : "nol";
    return { q: "f(x) = " + expr + " bo'lsa, f(" + ms(xq) + ") qiymati musbat, manfiy yoki nolmi?", a: sg, hint: "musbat / manfiy / nol", type: "text",
      w: wTxt(sg, ["musbat", "manfiy", "nol"]),
      steps: ["f(" + ms(xq) + ") = " + val, "Javob: " + sg] };
  };

  /* ---- 3. Trigonometrik ayniyatlar ---- */
  G.t3 = function (L) {
    var tri = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29]]);
    var k = pick(L === 1 ? [0, 1, 4] : L === 2 ? [0, 1, 2, 3, 4] : [2, 3, 5, 6]);
    var s = tri[0], cs = tri[1], h = tri[2];
    if (k === 0) return { q: "sin α = " + fr(s, h) + " va α — birinchi chorak burchagi. cos α ni toping.", a: fr(cs, h), hint: "kasr", type: "text",
      w: [fr(s, h), fr(h, cs), fr(cs, s), "−" + fr(cs, h), fr(s, cs)], steps: ["sin²α + cos²α = 1", "cos²α = 1 − (" + fr(s, h) + ")² = " + fr(cs * cs, h * h), "cos α = " + fr(cs, h) + " (1-chorakda musbat)"] };
    if (k === 1) return { q: "cos α = " + fr(cs, h) + ", α ∈ (0°; 90°). sin α ni toping.", a: fr(s, h), hint: "kasr", type: "text",
      w: [fr(cs, h), fr(h, s), fr(s, cs), "−" + fr(s, h), fr(cs, s)], steps: ["sin²α = 1 − cos²α = " + fr(s * s, h * h), "sin α = " + fr(s, h)] };
    if (k === 2) return { q: "sin α = " + fr(s, h) + ", α — 1-chorak. tg α ni toping.", a: fr(s, cs), hint: "kasr", type: "text",
      w: [fr(cs, s), fr(s, h), fr(cs, h), "−" + fr(s, cs), fr(h, cs)], steps: ["cos α = " + fr(cs, h), "tg α = sin α / cos α = " + fr(s, h) + " : " + fr(cs, h) + " = " + fr(s, cs)] };
    if (k === 3) return { q: "tg α = " + fr(s, cs) + " bo'lsa, ctg α ni toping.", a: fr(cs, s), hint: "kasr", type: "text",
      w: [fr(s, cs), "−" + fr(cs, s), fr(s, h), fr(cs, h), "1"], steps: ["tg α · ctg α = 1", "ctg α = 1 / tg α = " + fr(cs, s)] };
    if (k === 4) { var ang = pick([[0, "0", "1", "0"], [30, "1/2", "√3/2", "√3/3"], [45, "√2/2", "√2/2", "1"], [60, "√3/2", "1/2", "√3"], [90, "1", "0", "aniqlanmagan"]]);
      var fn = pick(["sin", "cos", "tg"]), idx = fn === "sin" ? 1 : fn === "cos" ? 2 : 3;
      return { q: fn + " " + ang[0] + "° ni hisoblang.", a: ang[idx], hint: "qiymat", type: "text",
        w: wTxt(ang[idx], ["0", "1/2", "√2/2", "√3/2", "1", "√3"]).slice(0, 4), steps: ["Jadval qiymati: " + fn + " " + ang[0] + "° = " + ang[idx]] }; }
    if (k === 5) { var n = R(2, 9); return { q: "Soddalashtiring: " + n + "·(sin²α + cos²α) + " + n + " = ?", a: 2 * n, hint: "son",
      w: nearW(2 * n, 5), steps: ["sin²α + cos²α = 1", n + "·1 + " + n + " = " + 2 * n] }; }
    var m = R(2, 9);
    return { q: "Soddalashtiring: (1 − cos²α)·" + m + " + " + m + "·cos²α = ?", a: m, hint: "son", w: nearW(m, 5),
      steps: [m + "(1 − cos²α) + " + m + "cos²α = " + m + "(1 − cos²α + cos²α) = " + m + "·1 = " + m] };
  };

  /* ---- 4. Arifmetik va geometrik progressiya ---- */
  G.t4 = function (L) {
    var k = pick(L === 1 ? [0, 1, 4] : L === 2 ? [0, 1, 2, 4, 5] : [2, 3, 5, 6]);
    var a1 = RNZ(-9, 12), d = RNZ(-6, 7), n = R(5, L === 3 ? 30 : 14);
    if (k === 0) { var an = a1 + (n - 1) * d;
      return { q: "Arifmetik progressiyada a₁ = " + ms(a1) + ", d = " + ms(d) + ". a" + n + " ni toping.", a: an, hint: "son", w: nearW(an, 5, Math.abs(d) + 3),
        steps: ["aₙ = a₁ + (n − 1)d", "a" + n + " = " + ms(a1) + " + " + (n - 1) + "·" + par(d) + " = " + an] }; }
    if (k === 1) { var sn = n * (2 * a1 + (n - 1) * d) / 2;
      return { q: "Arifmetik progressiyada a₁ = " + ms(a1) + ", d = " + ms(d) + ". S" + n + " ni toping.", a: sn, hint: "son", w: nearW(sn, 5, Math.abs(d) * n / 2 + 4),
        steps: ["Sₙ = n(2a₁ + (n−1)d)/2", "S" + n + " = " + n + "(2·" + ms(a1) + " + " + (n - 1) + "·" + par(d) + ")/2 = " + sn] }; }
    if (k === 2) { var i1 = R(2, 6), i2 = i1 + R(2, 7), v1 = a1 + (i1 - 1) * d, v2 = a1 + (i2 - 1) * d;
      return { q: "Arifmetik progressiyada a" + i1 + " = " + ms(v1) + ", a" + i2 + " = " + ms(v2) + ". d ni toping.", a: d, hint: "son", w: nearW(d, 5, 4),
        steps: ["a" + i2 + " − a" + i1 + " = (" + i2 + " − " + i1 + ")d", ms(v2) + " − " + ms(v1) + " = " + (i2 - i1) + "d", "d = " + d] }; }
    if (k === 3) { var p = RNZ(-9, 9), q2 = RNZ(-9, 9), mid = (p + q2) / 2;
      if (mid !== Math.round(mid) || q2 === p) { q2 = p + 2 * RNZ(-5, 5); mid = (p + q2) / 2; }
      return { q: ms(p) + " va " + ms(q2) + " sonlari orasidagi arifmetik o'rtani toping.", a: mid, hint: "son", w: nearW(mid, 5, 4),
        steps: ["Arifmetik o'rta = (a + b)/2", "(" + ms(p) + " + " + ms(q2) + ")/2 = " + mid] }; }
    var b1 = pick([1, 2, 3, -2, 5, -1]), qq = pick([2, 3, -2, -3]), m = R(4, L === 3 ? 9 : 6);
    if (k === 4) { var bn = b1 * Math.pow(qq, m - 1);
      return { q: "Geometrik progressiyada b₁ = " + ms(b1) + ", q = " + ms(qq) + ". b" + m + " ni toping.", a: bn, hint: "son", w: nearW(bn, 5, Math.max(4, Math.abs(bn) / 2)),
        steps: ["bₙ = b₁·qⁿ⁻¹", "b" + m + " = " + ms(b1) + "·" + par(qq) + "^" + (m - 1) + " = " + bn] }; }
    if (k === 5) { var sm = b1 * (Math.pow(qq, m) - 1) / (qq - 1);
      return { q: "Geometrik progressiyada b₁ = " + ms(b1) + ", q = " + ms(qq) + ". S" + m + " ni toping.", a: sm, hint: "son", w: nearW(sm, 5, Math.max(5, Math.abs(sm) / 3)),
        steps: ["Sₙ = b₁(qⁿ − 1)/(q − 1)", "S" + m + " = " + ms(b1) + "(" + par(qq) + "^" + m + " − 1)/(" + ms(qq) + " − 1) = " + sm] }; }
    // cheksiz kamayuvchi
    var den = pick([2, 3, 4, 5]), b0 = (den - 1) * R(1, 6), inf = b0 * den / (den - 1);
    return { q: "Cheksiz kamayuvchi geometrik progressiyada b₁ = " + b0 + ", q = 1/" + den + ". Yig'indisini toping.", a: inf, hint: "son",
      w: nearW(inf, 5, Math.max(3, Math.round(inf / 3))).concat([b0 * (den - 1) / den, b0 * 2]), steps: ["S = b₁/(1 − q)", "1 − 1/" + den + " = " + fr(den - 1, den), "S = " + b0 + " : (" + fr(den - 1, den) + ") = " + b0 + "·" + den + "/" + (den - 1) + " = " + inf] };
  };

  /* ---- 5. Funksiya tushunchasi ---- */
  G.t5 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    var a = RNZ(-5, 5), b = RNZ(-9, 9), x = RNZ(-6, 6);
    if (k === 0) { var v = a * x + b; return { q: "f(x) = " + poly([a, b]) + " bo'lsa, f(" + ms(x) + ") ni toping.", a: v, hint: "son", w: nearW(v, 5),
      steps: ["f(" + ms(x) + ") = " + ms(a) + "·" + par(x) + " + " + ms(b) + " = " + v] }; }
    if (k === 1) { var y = RNZ(-12, 12), xx = (y - b) / a;
      if (xx !== Math.round(xx)) { y = a * R(-6, 6) + b; xx = (y - b) / a; }
      return { q: "f(x) = " + poly([a, b]) + " bo'lsa, f(x) = " + ms(y) + " bo'ladigan x ni toping.", a: xx, hint: "son", w: nearW(xx, 5),
        steps: [ms(a) + "x + " + ms(b) + " = " + ms(y), ms(a) + "x = " + (y - b), "x = " + xx] }; }
    if (k === 2) { var c = RNZ(-8, 8); return { q: "f(x) = " + ms(c) + "/x funksiyaning aniqlanish sohasiga qaysi son kirmaydi?", a: 0, hint: "son",
      w: [c, -c, 1, -1, 2], steps: ["Maxraj nolga teng bo'lmasligi kerak: x ≠ 0", "Javob: 0"] }; }
    if (k === 3) { var p = R(1, 9); return { q: "f(x) = √(x " + (p > 0 ? "− " + p : "+ " + (-p)) + ") funksiyaning aniqlanish sohasini toping.", a: "[" + p + "; +∞)", hint: "oraliq", type: "text",
      w: ["(" + p + "; +∞)", "(−∞; " + p + "]", "[" + (-p) + "; +∞)", "(−∞; +∞)"], steps: ["Ildiz ostida manfiy bo'lmasligi kerak: x − " + p + " ≥ 0", "x ≥ " + p, "D(f) = [" + p + "; +∞)"] }; }
    if (k === 4) { var m = RNZ(-4, 4), n = RNZ(-6, 6), xg = RNZ(-4, 4);
      var inner = m * xg + n, out = 2 * inner + 1;
      return { q: "g(x) = " + poly([m, n]) + ", f(t) = 2t + 1 bo'lsa, f(g(" + ms(xg) + ")) ni toping.", a: out, hint: "son", w: nearW(out, 5),
        steps: ["g(" + ms(xg) + ") = " + inner, "f(" + ms(inner) + ") = 2·" + par(inner) + " + 1 = " + out] }; }
    var set = shuffle([[1, 2], [2, 4], [3, 6], [4, 8]]).slice(0, 3);
    var isF = Math.random() < .5;
    var pairs = isF ? set : set.concat([[set[0][0], set[0][1] + 3]]);
    return { q: "{" + pairs.map(function (p) { return "(" + p[0] + "; " + p[1] + ")"; }).join(", ") + "} munosabat funksiya bo'ladimi?",
      a: isF ? "ha" : "yo'q", hint: "ha / yo'q", type: "text", w: [isF ? "yo'q" : "ha"],
      steps: [isF ? "Har bir x faqat bitta y ga mos → funksiya" : "Bitta x ikki xil y ga mos kelgan → funksiya emas"] };
  };

  /* ---- 6. Funksiya xossalari ---- */
  G.t6 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4]);
    if (k === 0) { var deg = pick([2, 4]), c = RNZ(-9, 9), a = RNZ(-4, 4);
      var even = Math.random() < .5;
      var txt = even ? "y = " + ms(a) + "x" + (deg === 2 ? "²" : "⁴") + " + " + ms(c) : "y = " + ms(a) + "x³ " + (c > 0 ? "+ " + c : "− " + (-c)) + "x";
      var ans = even ? "juft" : "toq";
      return { q: txt + " funksiya juftmi yoki toqmi?", a: ans, hint: "juft / toq", type: "text", w: [even ? "toq" : "juft", "juft ham, toq ham emas"],
        steps: even ? ["Faqat juft darajalar va o'zgarmas bor → f(−x) = f(x) → juft"] : ["Faqat toq darajalar bor → f(−x) = −f(x) → toq"] }; }
    if (k === 1) { var a2 = RNZ(-6, 6), b2 = RNZ(-12, 12), zx = -b2 / a2;
      if (zx !== Math.round(zx)) { b2 = -a2 * RNZ(-6, 6); zx = -b2 / a2; }
      return { q: "y = " + poly([a2, b2]) + " funksiyaning nolini toping.", a: zx, hint: "son", w: nearW(zx, 5),
        steps: [ms(a2) + "x + " + ms(b2) + " = 0", "x = " + ms(-b2) + "/" + ms(a2) + " = " + zx] }; }
    if (k === 2) { var a3 = RNZ(-7, 7), b3 = RNZ(-9, 9);
      var ans3 = a3 > 0 ? "o'suvchi" : "kamayuvchi";
      return { q: "y = " + poly([a3, b3]) + " funksiya o'suvchimi yoki kamayuvchimi?", a: ans3, hint: "o'suvchi / kamayuvchi", type: "text",
        w: [a3 > 0 ? "kamayuvchi" : "o'suvchi", "o'zgarmas"], steps: ["Chiziqli funksiyada yo'nalish k ning ishorasiga bog'liq", "k = " + ms(a3) + (a3 > 0 ? " > 0 → o'suvchi" : " < 0 → kamayuvchi")] }; }
    if (k === 3) { var p = R(1, 8), q = R(p + 1, 12);
      return { q: "y = 1/(x " + "− " + p + ") funksiyaning aniqlanish sohasini toping.", a: "x ≠ " + p, hint: "x ≠ son", type: "text",
        w: ["x ≠ " + (-p), "x > " + p, "x ≥ " + p, "x ≠ 0"], steps: ["Maxraj nolga teng bo'lmaydi: x − " + p + " ≠ 0", "x ≠ " + p] }; }
    var a4 = pick([1, 2, -1, -2]), x0 = RNZ(-5, 5), y0 = R(-8, 8);
    var b4 = -2 * a4 * x0, c4 = a4 * x0 * x0 + y0;
    return { q: "y = " + poly([a4, b4, c4]) + " funksiyaning eng " + (a4 > 0 ? "kichik" : "katta") + " qiymatini toping.", a: y0, hint: "son", w: nearW(y0, 5),
      steps: ["x₀ = −b/(2a) = " + x0, "y₀ = " + y0] };
  };

  /* ---- 7. Grafik almashtirishlar ---- */
  G.t7 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3]);
    var p = RNZ(-6, 6), q = RNZ(-6, 6);
    if (k === 0) { var dir = p > 0 ? "o'ngga " + p : "chapga " + (-p);
      return { q: "y = x² grafigi y = (x " + (p > 0 ? "− " + p : "+ " + (-p)) + ")² grafigiga qanday siljitilgan?", a: dir, hint: "yo'nalish va birlik", type: "text",
        w: [p > 0 ? "chapga " + p : "o'ngga " + (-p), "yuqoriga " + Math.abs(p), "pastga " + Math.abs(p)],
        steps: ["y = f(x − a) grafik o'ngga a ga siljiydi (a > 0)", "Javob: " + dir] }; }
    if (k === 1) { var dir2 = q > 0 ? "yuqoriga " + q : "pastga " + (-q);
      return { q: "y = x² grafigi y = x² " + (q > 0 ? "+ " + q : "− " + (-q)) + " grafigiga qanday siljitilgan?", a: dir2, hint: "yo'nalish va birlik", type: "text",
        w: [q > 0 ? "pastga " + q : "yuqoriga " + (-q), "o'ngga " + Math.abs(q), "chapga " + Math.abs(q)],
        steps: ["y = f(x) + b grafik yuqoriga b ga siljiydi (b > 0)", "Javob: " + dir2] }; }
    if (k === 2) return { q: "y = (x " + (p > 0 ? "− " + p : "+ " + (-p)) + ")² " + (q >= 0 ? "+ " + q : "− " + (-q)) + " parabolaning uchini toping.",
      a: "(" + ms(p) + "; " + ms(q) + ")", hint: "(x₀; y₀)", type: "text", w: H.pairW(p, q, 5),
      steps: ["y = (x − m)² + n → uchi (m; n)", "Uchi: (" + ms(p) + "; " + ms(q) + ")"] };
    var kk = pick([-1, 2, -2, 3]);
    var d = kk === -1 ? "Ox o'qiga nisbatan simmetrik akslanadi" : kk > 0 ? "Oy bo'yicha " + kk + " marta cho'ziladi" : "akslanadi va " + (-kk) + " marta cho'ziladi";
    return { q: "y = x² grafigidan y = " + ms(kk) + "x² grafigi qanday hosil bo'ladi?", a: d, hint: "tavsif", type: "text",
      w: wTxt(d, ["Ox o'qiga nisbatan simmetrik akslanadi", "Oy bo'yicha 2 marta cho'ziladi", "o'ngga siljiydi", "pastga siljiydi"]).slice(0, 3),
      steps: ["y = a·f(x): |a| > 1 — cho'ziladi, a < 0 — Ox ga nisbatan akslanadi", "a = " + ms(kk) + " → " + d] };
  };

  /* ---- 8. Chiziqli va kvadratik modellashtirish ---- */
  G.t8 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3]);
    if (k === 0) { var base = R(3, 15) * 1000, perKm = R(1, 9) * 100, km = R(3, 20), tot = base + perKm * km;
      return { q: "Taksi " + base + " so'm asosiy haq va har km uchun " + perKm + " so'm oladi. " + km + " km yo'l uchun qancha to'lanadi?", a: tot, hint: "so'm",
        w: [tot + perKm, tot - perKm, tot + 2 * perKm, base * km + perKm, perKm * km, tot - base + perKm].filter(function (v) { return v > 0 && v !== tot; }), steps: ["y = " + base + " + " + perKm + "x", "y = " + base + " + " + perKm + "·" + km + " = " + tot + " so'm"] }; }
    if (k === 1) { var st = R(20, 80), rate = R(2, 9), dys = R(3, 12), end = st + rate * dys;
      return { q: "Suv havzasida " + st + " m³ suv bor, har kuni " + rate + " m³ qo'shiladi. " + dys + " kundan keyin qancha suv bo'ladi?", a: end, hint: "m³",
        w: nearW(end, 5, rate * 2), steps: ["V(t) = " + st + " + " + rate + "t", "V(" + dys + ") = " + st + " + " + rate + "·" + dys + " = " + end + " m³"] }; }
    if (k === 2) { var per = R(10, 30) * 2, half = per / 2, s = half / 2, area = s * s;
      return { q: "Perimetri " + per + " m bo'lgan to'rtburchakning eng katta yuzi qanday (m²)?", a: area, hint: "m²",
        w: nearW(area, 5, Math.round(area / 4)), steps: ["a + b = " + half, "Yuz eng katta bo'lishi uchun a = b = " + s, "S = " + s + "² = " + area + " m²"] }; }
    var v0 = R(10, 40), g = 10, tmax = v0 / g, hmax = v0 * v0 / (2 * g);
    return { q: "Jism " + v0 + " m/s tezlik bilan tik yuqoriga otildi (g = 10 m/s²). Eng yuqori nuqtaga qancha vaqtda chiqadi (s)?",
      a: tmax, hint: "sekund", w: nearW(tmax, 5, 2).concat([hmax]).filter(function (x) { return x !== tmax; }),
      steps: ["h(t) = " + v0 + "t − 5t²", "t = −b/(2a) = " + v0 + "/(2·5) = " + tmax + " s"] };
  };

  /* ---- 9. Munosabatlar va funksiyalar (loyiha) ---- */
  G.t9 = function (L) {
    var xs = shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 4);
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2]);
    var a = RNZ(-4, 4), b = RNZ(-6, 6);
    var ys = xs.map(function (x) { return a * x + b; });
    if (k === 0) return { q: "D = {" + xs.map(ms).join("; ") + "} va f(x) = " + poly([a, b]) + ". Qiymatlar to'plamining eng katta elementini toping.",
      a: Math.max.apply(null, ys), hint: "son", w: nearW(Math.max.apply(null, ys), 5, 5),
      steps: ["Qiymatlar: " + ys.map(ms).join("; "), "Eng kattasi: " + Math.max.apply(null, ys)] };
    if (k === 1) return { q: "f(x) = " + poly([a, b]) + " va D = {" + xs.map(ms).join("; ") + "}. Qiymatlar to'plamining eng kichik elementini toping.",
      a: Math.min.apply(null, ys), hint: "son", w: nearW(Math.min.apply(null, ys), 5, 5),
      steps: ["Qiymatlar: " + ys.map(ms).join("; "), "Eng kichigi: " + Math.min.apply(null, ys)] };
    var n = R(3, 6), m = pick([2, 3, 4].filter(function (v) { return v !== n; }));
    return { q: n + " elementli A to'plamdan " + m + " elementli B to'plamga nechta har xil funksiya tuzish mumkin?",
      a: Math.pow(m, n), hint: "son", w: [Math.pow(n, m), n * m, n + m, Math.pow(m, n) + m],
      steps: ["Har bir x uchun " + m + " xil tanlov", m + "^" + n + " = " + Math.pow(m, n)] };
  };

  /* ---- 10. Sodda ratsional tenglamalar ---- */
  G.t10 = function (L) {
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    var x = RNZ(-8, 8);
    if (k === 0) { var c = RNZ(-6, 6), d = RNZ(-9, 9); if (x === -d / c) x += 1;
      var num = RNZ(-5, 5), val = (num * x) / (c * x + d);
      var A = num * x, B = c * x + d;
      // (num·x)/(c·x + d) = A/B — teng kuchli: num·x·B = A·(c x + d) → oddiy chiziqli
      return { q: "(" + poly([num, 0]) + ")/(" + poly([c, d]) + ") = " + fr(A, B) + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5),
        steps: (function () { var gA = gcd(A, B) || 1, An = A / gA, Bn = B / gA; if (Bn < 0) { An = -An; Bn = -Bn; }
          return ["Krest ko'paytirish: " + (Bn === 1 ? poly([num, 0]) : ms(num) + "x·" + Bn) + " = " + (An === 1 ? "" : An === -1 ? "−" : ms(An)) + "(" + poly([c, d]) + ")", "x = " + ms(x)]; })() }; }
    if (k === 1) { var p = RNZ(-7, 7), q = RNZ(-7, 7); if (p === q) q = p + 2;
      // 1/(x−p) = 1/(x−q) → yechimi yo'q; shuning uchun: a/(x−p) = b holati
      var a2 = RNZ(-8, 8); if (x === p) x = p + 2;
      var rhs = a2 / (x - p); var g = gcd(a2, x - p) || 1;
      return { q: fr(a2, 1) + "/(x " + (p > 0 ? "− " + p : "+ " + (-p)) + ") = " + fr(a2 / g, (x - p) / g) + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5),
        steps: (function () { var Nn = a2 / g, Dn = (x - p) / g; if (Dn < 0) { Nn = -Nn; Dn = -Dn; }
          return ["Krest ko'paytirish: " + ms(a2) + (Dn === 1 ? "" : "·" + Dn) + " = " + (Nn === 1 ? "" : Nn === -1 ? "−" : ms(Nn)) + "(x " + (p > 0 ? "− " + p : "+ " + (-p)) + ")", "x = " + ms(x)]; })() }; }
    var p2 = RNZ(-6, 6);
    return { q: "1/(x " + (p2 > 0 ? "− " + p2 : "+ " + (-p2)) + ") = 1/(x " + (p2 > 0 ? "− " + p2 : "+ " + (-p2)) + ") tenglama uchun x qanday qiymat <b>qabul qila olmaydi</b>?",
      a: p2, hint: "son", w: nearW(p2, 5), steps: ["Maxraj nolga teng bo'lmaydi: x " + (p2 > 0 ? "− " + p2 : "+ " + (-p2)) + " ≠ 0", "x ≠ " + ms(p2)] };
  };

  /* ---- 11. Tenglamalar sistemasi ---- */
  G.t11 = function (L) {
    var x = RNZ(-7, 7), y = RNZ(-7, 7);
    var a = RNZ(-4, 4), b = RNZ(-4, 4), c = RNZ(-4, 4), d = RNZ(-4, 4);
    if (a * d - b * c === 0) { d = d + (d === 0 ? 1 : d > 0 ? 1 : -1); if (a * d - b * c === 0) d += 1; }
    var e = a * x + b * y, f = c * x + d * y;
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2] : [0, 2]);
    var sys = poly([a, 0]) + " " + (b > 0 ? "+ " + (b === 1 ? "" : b) : "− " + (b === -1 ? "" : -b)) + "y = " + ms(e) + " ; " +
      poly([c, 0]) + " " + (d > 0 ? "+ " + (d === 1 ? "" : d) : "− " + (d === -1 ? "" : -d)) + "y = " + ms(f);
    if (k === 0) return { q: "Sistemani yeching: " + sys, a: "(" + ms(x) + "; " + ms(y) + ")", hint: "(x; y)", type: "text", w: H.pairW(x, y, 5),
      steps: ["Qo'shish usuli bilan yoki o'rniga qo'yib yechamiz", "x = " + ms(x) + ", y = " + ms(y), "Javob: (" + ms(x) + "; " + ms(y) + ")"] };
    if (k === 1) return { q: "Sistemada x ni toping: " + sys, a: x, hint: "son", w: nearW(x, 5),
      steps: ["Determinant usuli: Δ = " + (a * d - b * c), "x = " + ms(x)] };
    return { q: "Sistemada x + y ni toping: " + sys, a: x + y, hint: "son", w: nearW(x + y, 5),
      steps: ["x = " + ms(x) + ", y = " + ms(y), "x + y = " + (x + y)] };
  };

  /* ---- 12. Ratsional tengsizliklar ---- */
  G.t12 = function (L) {
    var p = RNZ(-6, 6), q; do { q = RNZ(-6, 6); } while (q === p);
    if (p > q) { var t = p; p = q; q = t; }
    var pos = Math.random() < .5;
    var ans = pos ? "(−∞; " + ms(p) + ")∪(" + ms(q) + "; +∞)" : iv(p, q);
    return { q: "(x " + (p > 0 ? "− " + p : "+ " + (-p)) + ")/(x " + (q > 0 ? "− " + q : "+ " + (-q)) + ") " + (pos ? ">" : "<") + " 0 tengsizlikni yeching.",
      a: ans, hint: "oraliq", type: "text",
      w: wTxt(ans, [iv(p, q), "(−∞; " + ms(p) + ")∪(" + ms(q) + "; +∞)", "[" + ms(p) + "; " + ms(q) + "]", "(−∞; +∞)"]),
      steps: ["Nollar: x = " + ms(p) + " (surat), x = " + ms(q) + " (maxraj, kirmaydi)",
        "Oraliqlarda ishora: " + (pos ? "tashqarida musbat" : "orasida manfiy"), "Javob: " + ans] };
  };

  /* ---- 13. Tengsizliklar sistemasi ---- */
  G.t13 = function (L) {
    var a = RNZ(-8, 4), b = a + R(2, 9);
    var ans = "[" + ms(a) + "; " + ms(b) + "]";
    var k = pick([0, 1]);
    if (k === 0) return { q: "Sistemani yeching: x ≥ " + ms(a) + " ; x ≤ " + ms(b), a: ans, hint: "oraliq", type: "text",
      w: [iv(a, b), "(−∞; " + ms(a) + "]∪[" + ms(b) + "; +∞)", "[" + ms(b) + "; " + ms(a) + "]", "(−∞; +∞)"],
      steps: ["Ikki shart birgalikda bajarilishi kerak", "Kesishma: " + ans] };
    var cnt = b - a + 1;
    return { q: "x ≥ " + ms(a) + " va x ≤ " + ms(b) + " sistemasi nechta butun yechimga ega?", a: cnt, hint: "son", w: nearW(cnt, 5, 3).filter(function (v) { return v > 0; }),
      steps: ["Yechim: " + ans, "Butun sonlar: " + ms(a) + " … " + ms(b), "Soni: " + ms(b) + " − " + ms(a) + " + 1 = " + cnt] };
  };

  /* ---- 14. Ratsional tenglamalarga doir misollar ---- */
  G.t14 = function (L) {
    var k = pick(L === 1 ? [0] : [0, 1, 2]);
    var x1 = RNZ(-7, 7), x2 = RNZ(-7, 7); if (x1 === x2) x2 = x1 + 1;
    if (k === 0) { var b = -(x1 + x2), c = x1 * x2;
      var srt = [x1, x2].sort(function (a, b) { return a - b; });
      return { q: poly([1, b, c]) + " = 0 tenglamani yeching.", a: ms(srt[0]) + "; " + ms(srt[1]), hint: "x₁; x₂", type: "text",
        w: [ms(-srt[0]) + "; " + ms(-srt[1]), ms(srt[0]) + "; " + ms(srt[1] + 1), ms(srt[0] - 1) + "; " + ms(srt[1]), ms(b) + "; " + ms(c)],
        steps: ["Vyet: x₁ + x₂ = " + ms(-b) + ", x₁·x₂ = " + ms(c), "x₁ = " + ms(srt[0]) + ", x₂ = " + ms(srt[1])] }; }
    if (k === 1) { var a2 = RNZ(-6, 6), b2 = RNZ(-9, 9), x = RNZ(-6, 6);
      var rhs = a2 * x + b2;
      return { q: poly([a2, b2]) + " = " + ms(rhs) + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5),
        steps: [ms(a2) + "x = " + ms(rhs) + " − " + ms(b2) + " = " + (rhs - b2), "x = " + ms(x)] }; }
    var p = RNZ(-6, 6), n = R(2, 9), xx = p + n;
    return { q: "x/(x " + (p > 0 ? "− " + p : "+ " + (-p)) + ") = " + fr(xx, n) + " tenglamani yeching.", a: xx, hint: "son", w: nearW(xx, 5),
      steps: (function () { var g2 = gcd(xx, n) || 1, Xn = xx / g2, Nn = n / g2; if (Nn < 0) { Xn = -Xn; Nn = -Nn; }
        return ["Krest ko'paytirish: " + (Nn === 1 ? "" : Nn) + "x = " + (Xn === 1 ? "" : Xn === -1 ? "−" : ms(Xn)) + "(x " + (p > 0 ? "− " + p : "+ " + (-p)) + ")", "x = " + ms(xx) + " (maxraj ≠ 0 shart bajariladi)"]; })() };
  };

  /* ---- 15. Sodda irratsional tenglamalar ---- */
  G.t15 = function (L) {
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    var c = R(2, L === 3 ? 12 : 8);
    if (k === 0) { var a = pick([1, 1, 2, 3]), b = RNZ(-9, 9), x = (c * c - b) / a;
      if (x !== Math.round(x)) { b = c * c - a * R(1, 9); x = (c * c - b) / a; }
      return { q: "√(" + poly([a, b]) + ") = " + c + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5),
        steps: ["Ikki tomonni kvadratga ko'taramiz: " + poly([a, b]) + " = " + (c * c), ms(a) + "x = " + (c * c - b), "x = " + ms(x)] }; }
    if (k === 1) { var p = R(1, 9), x2 = R(p + 1, p + 12);
      var rad = x2 - p;
      var root = Math.round(Math.sqrt(rad));
      if (root * root !== rad) { root = R(2, 6); x2 = p + root * root; }
      return { q: "√(x − " + p + ") = " + root + " tenglamani yeching.", a: p + root * root, hint: "son", w: nearW(p + root * root, 5),
        steps: ["x − " + p + " = " + root + "² = " + root * root, "x = " + (p + root * root)] }; }
    var r = R(2, 7), s = R(1, 9), xv = r * r + s;
    return { q: "√(x − " + s + ") + " + r + " = " + (2 * r) + " tenglamani yeching.", a: xv, hint: "son", w: nearW(xv, 5),
      steps: ["√(x − " + s + ") = " + (2 * r) + " − " + r + " = " + r, "x − " + s + " = " + r * r, "x = " + xv] };
  };

  /* ---- 16. Irratsional misollar ---- */
  G.t16 = function (L) {
    var k = pick([0, 1, 2]);
    if (k === 0) { var n = pick([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225]);
      return { q: "√" + n + " ni hisoblang.", a: Math.sqrt(n), hint: "son", w: nearW(Math.sqrt(n), 5, 4),
        steps: [Math.sqrt(n) + "² = " + n + " → √" + n + " = " + Math.sqrt(n)] }; }
    if (k === 1) { var a = pick([2, 3, 5, 6, 7, 8, 10]), b = pick([2, 3, 5, 6, 7, 8, 10]);
      var pr = a * b, rt = Math.sqrt(pr);
      if (rt === Math.round(rt)) return { q: "√" + a + " · √" + b + " ni hisoblang.", a: rt, hint: "son", w: nearW(rt, 5, 3),
        steps: ["√a·√b = √(ab) = √" + pr, "= " + rt] };
      return { q: "√" + a + " · √" + b + " ifodasini bitta ildiz ostida yozing.", a: "√" + pr, hint: "√son", type: "text",
        w: ["√" + (a + b), "√" + (pr + 1), String(pr), "√" + (pr * 2)], steps: ["√a·√b = √(ab)", "√" + a + "·√" + b + " = √" + pr] }; }
    var m = pick([2, 3, 5, 7]), k2 = R(2, 9);
    return { q: "(" + k2 + "√" + m + ")² ni hisoblang.", a: k2 * k2 * m, hint: "son", w: nearW(k2 * k2 * m, 5, Math.max(4, k2 * m)),
      steps: ["(k√m)² = k²·m", "= " + k2 * k2 + "·" + m + " = " + k2 * k2 * m] };
  };

  /* ---- 17. Irratsional sistemalar ---- */
  G.t17 = function (L) {
    var u = R(1, 8), v = R(1, 8);
    var k = pick([0, 1]);
    if (k === 0) return { q: "Sistemani yeching: √x + √y = " + (u + v) + " ; √x − √y = " + (u - v) + "  (x, y ≥ 0). x ni toping.",
      a: u * u, hint: "son", w: nearW(u * u, 5, Math.max(4, u * 2)),
      steps: ["√x = ((" + (u + v) + ") + (" + (u - v) + "))/2 = " + u, "x = " + u + "² = " + u * u] };
    return { q: "Sistemani yeching: √x + √y = " + (u + v) + " ; √x · √y = " + (u * v) + "  (x ≤ y). y ni toping.",
      a: Math.max(u, v) * Math.max(u, v), hint: "son", w: nearW(Math.max(u, v) * Math.max(u, v), 5, 6),
      steps: ["√x va √y — t² − " + (u + v) + "t + " + (u * v) + " = 0 tenglamaning ildizlari", "√x = " + Math.min(u, v) + ", √y = " + Math.max(u, v),
        "y = " + Math.max(u, v) + "² = " + Math.max(u, v) * Math.max(u, v)] };
  };

  /* ---- 18. Ratsional va irratsional ifodalar ---- */
  G.t18 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2, 3]);
    if (k === 0) { var a = R(2, 12), b = R(2, 12), g = gcd(a, b);
      if (a === b) b = a + R(1, 5);
      var kq = pick([2, 3, 4, 5, 6]), gg = gcd(a, b) * kq;
      return { q: (a * kq) + "/" + (b * kq) + " kasrni qisqartiring.", a: fr(a, b), hint: "kasr", type: "text",
        w: [fr(b, a), fr(a + 1, b), fr(a, b + 1), (a * kq / gcd(a * kq, 2 * b * kq) * 2 === a * kq ? fr(a * kq, b * kq * 2) : fr(a * kq + 1, b * kq))],
        steps: ["Surat va maxrajning EKUBi: EKUB(" + (a * kq) + "; " + (b * kq) + ") = " + gg, (a * kq) + "/" + (b * kq) + " = " + (a * kq / gg) + "/" + (b * kq / gg)] }; }
    if (k === 1) { var n = pick([8, 12, 18, 20, 27, 32, 45, 50, 72, 75, 98]);
      var out = 1, inn = n;
      for (var i = 2; i * i <= inn; i++) while (inn % (i * i) === 0) { out *= i; inn /= i * i; }
      return { q: "√" + n + " ni ildizdan chiqarib soddalashtiring.", a: (out === 1 ? "" : out) + "√" + inn, hint: "k√m", type: "text",
        w: [(out * out) + "√" + inn, (out + 1) + "√" + inn, out + "√" + (inn + 1), String(out * inn), inn + "√" + out],
        steps: ["√" + n + " = √(" + (out * out) + "·" + inn + ")", "= " + out + "√" + inn] }; }
    if (k === 2) { var p = R(2, 9), q = R(2, 9);
      return { q: "(" + p + " + √" + q + ")(" + p + " − √" + q + ") ni hisoblang.", a: p * p - q, hint: "son", w: nearW(p * p - q, 5, 6),
        steps: ["(a + b)(a − b) = a² − b²", "= " + p + "² − " + q + " = " + (p * p - q)] }; }
    var x = R(2, 9), y = R(2, 9); if (y === x) y = x + R(1, 4);
    return { q: "x = " + x + ", y = " + y + " bo'lsa, (x² − y²)/(x − y) ni hisoblang.", a: x + y, hint: "son", w: nearW(x + y, 5, 5),
      steps: ["(x² − y²)/(x − y) = x + y", "= " + x + " + " + y + " = " + (x + y)] };
  };

  S.registerAll(G, {
    t2: "Kvadrat tengsizlik va uning yechimi", t3: "Trigonometrik ayniyatlar", t4: "Arifmetik va geometrik progressiya",
    t5: "Funksiya tushunchasi", t6: "Funksiya xossalari", t7: "Funksiya grafiklarini sodda almashtirish",
    t8: "Chiziqli va kvadratik modellashtirish", t9: "Munosabatlar va funksiyalar", t10: "Sodda ratsional tenglamalar",
    t11: "Sodda ratsional tenglamalar sistemasi", t12: "Sodda ratsional tengsizliklar", t13: "Sodda ratsional tengsizliklar sistemasi",
    t14: "Ratsional tenglamalarga doir misollar", t15: "Sodda irratsional tenglamalar", t16: "Irratsional tenglamalarga doir misollar",
    t17: "Sodda irratsional tenglamalar sistemasi", t18: "Ratsional va irratsional ifodalar"
  });
})();
