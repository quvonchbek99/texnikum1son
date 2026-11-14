/*! Kuvonch Academy — mavzu savollari: A1–A8 va 51–70 */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle, gcd = H.gcd, fr = H.fr, ms = H.ms, par = H.par, poly = H.poly, nearW = H.nearW;
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function wT(right, list) { return list.filter(function (x) { return x !== right; }); }
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "−": "⁻", "+": "⁺", "x": "ˣ", "y": "ʸ", "n": "ⁿ", "(": "⁽", ")": "⁾", "=": "⁼" };
  function sup(n) { return String(n).split("").map(function (c) { return SUP[c] || c; }).join(""); }
  function sub(n) { var SB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" }; return String(n).split("").map(function (c) { return SB[c] || c; }).join(""); }
  function roman(n) { var v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], s = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"], r = ""; for (var i = 0; i < v.length; i++) while (n >= v[i]) { r += s[i]; n -= v[i]; } return r; }
  var G = {};

  /* ===== A1–A8 arifmetika ===== */
  G.a1 = function (L) {
    var hi = L === 1 ? 50 : L === 2 ? 500 : 100000;
    var a = R(2, hi), b = R(2, hi);
    if (L === 3 && Math.random() < .4) { var c = R(2, 999); return { q: a + " + " + b + " + " + c + " = ?", a: a + b + c, hint: "son", w: nearW(a + b + c, 5, 12), steps: [a + " + " + b + " = " + (a + b), (a + b) + " + " + c + " = " + (a + b + c)] }; }
    return { q: a + " + " + b + " = ?", a: a + b, hint: "son", w: nearW(a + b, 5, Math.max(3, Math.round((a + b) / 12))),
      steps: ["Xonalar bo'yicha qo'shamiz", a + " + " + b + " = " + (a + b)] };
  };
  G.a2 = function (L) {
    var hi = L === 1 ? 50 : L === 2 ? 500 : 100000;
    var a = R(10, hi), b = R(2, a);
    if (L === 3 && Math.random() < .3) {
      var n = R(2, 99), m = R(2, 99), res = -n - (-m);
      return { q: ms(-n) + " − " + par(-m) + " = ?", a: res, hint: "son", w: nearW(res, 5, 12),
        steps: ["Manfiy sonni ayirish — qo'shish bilan bir xil: " + ms(-n) + " + " + m, "= " + res] };
    }
    return { q: a + " − " + b + " = ?", a: a - b, hint: "son", w: nearW(a - b, 5, Math.max(3, Math.round((a - b) / 12 + 2))),
      steps: ["Xonalar bo'yicha ayiramiz", a + " − " + b + " = " + (a - b)] };
  };
  G.a3 = function (L) {
    var a = L === 1 ? R(2, 9) : L === 2 ? R(11, 99) : R(101, 999);
    var b = L === 1 ? R(2, 9) : L === 2 ? R(2, 19) : R(11, 99);
    return { q: a + " × " + b + " = ?", a: a * b, hint: "son", w: nearW(a * b, 5, Math.max(4, Math.round(a * b / 10))),
      steps: [a + " × " + b + " = " + a * b] };
  };
  G.a4 = function (L) {
    var b = L === 1 ? R(2, 9) : L === 2 ? R(2, 12) : R(11, 40);
    var c = L === 1 ? R(2, 9) : L === 2 ? R(5, 40) : R(10, 99);
    return { q: (b * c) + " : " + b + " = ?", a: c, hint: "son", w: nearW(c, 5, Math.max(3, Math.round(c / 5))),
      steps: [(b * c) + " : " + b + " = " + c + "  (tekshirish: " + b + "·" + c + " = " + b * c + ")"] };
  };
  G.a5 = function (L) {
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2, 3]);
    var p = pick(L === 1 ? [10, 20, 25, 50] : [5, 10, 15, 20, 25, 30, 40, 60, 75]);
    var N = pick([20, 40, 60, 80, 100, 120, 200, 240, 300, 400, 500, 800]);
    var v = N * p / 100;
    if (v !== Math.round(v)) { N = 100; v = p; }
    if (k === 0) return { q: N + " ning " + p + "% ini toping.", a: v, hint: "son", w: nearW(v, 5, Math.max(3, Math.round(v / 2))),
      steps: [N + " · " + p + " / 100 = " + v] };
    if (k === 1) return { q: v + " soni " + N + " ning necha foizini tashkil etadi?", a: p, hint: "foiz", w: nearW(p, 5, 8),
      steps: [v + " / " + N + " · 100% = " + p + "%"] };
    if (k === 2) return { q: "Narx " + N + " so'm edi, " + p + "% ga oshdi. Yangi narxni toping.", a: N + v, hint: "so'm", w: nearW(N + v, 5, Math.max(5, v)),
      steps: ["Oshish: " + v, N + " + " + v + " = " + (N + v)] };
    return { q: "Narx " + N + " so'm edi, " + p + "% ga arzonlashdi. Yangi narxni toping.", a: N - v, hint: "so'm", w: nearW(N - v, 5, Math.max(5, v)),
      steps: ["Chegirma: " + v, N + " − " + v + " = " + (N - v)] };
  };
  G.a6 = function (L) {
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2, 3]);
    var b = L === 1 ? pick([2, 3, 4, 5, 10]) : pick([2, 3, 4, 5, 6, 7, 10]);
    var n = L === 1 ? R(2, 3) : L === 2 ? R(2, 4) : R(2, b === 2 ? 10 : 5);
    if (k === 0) return { q: b + sup(n) + " ni hisoblang.", a: Math.pow(b, n), hint: "son", w: [b * n, Math.pow(b, n - 1), Math.pow(b, n + 1), Math.pow(b, n) + b],
      steps: [b + " ni " + n + " marta ko'paytiramiz = " + Math.pow(b, n)] };
    if (k === 1) { var m = R(2, 5), p = R(2, 5);
      return { q: b + sup(m) + " · " + b + sup(p) + " ni bitta daraja ko'rinishida yozing.", a: b + "^" + (m + p), hint: "a^n", type: "text",
        w: [b + "^" + (m * p), (b * b) + "^" + (m + p), b + "^" + Math.abs(m - p), b + "^" + (m + p + 1)],
        steps: ["aᵐ·aⁿ = aᵐ⁺ⁿ = " + b + "^" + (m + p)] }; }
    if (k === 2) { var n2 = R(1, 4);
      return { q: b + sup("−" + n2) + " ni kasr ko'rinishida yozing.", a: "1/" + Math.pow(b, n2), hint: "kasr", type: "text",
        w: ["−1/" + Math.pow(b, n2), String(-Math.pow(b, n2)), "1/" + (b * n2), "1/" + Math.pow(b, n2 + 1)],
        steps: ["a⁻ⁿ = 1/aⁿ = 1/" + Math.pow(b, n2)] }; }
    return { q: b + sup(0) + " ni hisoblang.", a: 1, hint: "son", w: [0, b, -1, 10], steps: ["Noldan farqli sonning nolinchi darajasi 1 ga teng"] };
  };
  G.a7 = function (L) {
    var a = L === 1 ? R(2, 5) : R(2, 12), b = L === 1 ? R(2, 5) : R(2, 12);
    if (L === 3 && Math.random() < .5) { var c = a * b; return { q: c + " : " + a + " = ? (karra jadvali)", a: b, hint: "son", w: nearW(b, 5, 4), steps: [a + " × " + b + " = " + c + " → " + c + " : " + a + " = " + b] }; }
    return { q: a + " × " + b + " = ?", a: a * b, hint: "son", w: nearW(a * b, 5, Math.max(a, b) + 3), steps: [a + " × " + b + " = " + a * b] };
  };
  G.a8 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3, 4] : [3, 4, 5, 6]);
    if (k === 0) { var n = R(100, 9999), p = R(0, 2), XN = ["birlar", "o'nlar", "yuzlar", "minglar"];
      var d = Math.floor(n / Math.pow(10, p)) % 10;
      return { q: n + " sonining " + XN[p] + " xonasidagi raqamni toping.", a: d, hint: "raqam", w: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== d; }).slice(0, 4),
        steps: [n + " → " + XN[p] + " xonasida " + d] }; }
    if (k === 1) { var n2 = R(-99, 99) || 5;
      return { q: "|" + ms(n2) + "| ni hisoblang.", a: Math.abs(n2), hint: "son", w: [n2, -Math.abs(n2), Math.abs(n2) + 1, 0].filter(function (x) { return x !== Math.abs(n2); }),
        steps: ["Modul — sonning noldan masofasi: " + Math.abs(n2)] }; }
    if (k === 2) { var n3 = R(1000, 99999), m = pick([10, 100, 1000]), nm = { 10: "o'nlar", 100: "yuzlar", 1000: "minglar" }[m];
      return { q: n3 + " sonini " + nm + " xonasigacha yaxlitlang.", a: Math.round(n3 / m) * m, hint: "son",
        w: [Math.floor(n3 / m) * m, Math.ceil(n3 / m) * m, Math.round(n3 / m) * m + m, Math.round(n3 / m) * m - m, Math.round(n3 / (m * 10)) * m * 10, Math.round(n3 / m) * m + 2 * m].filter(function (x) { return x !== Math.round(n3 / m) * m && x > 0; }),
        steps: ["Keyingi raqam 5 dan kichik bo'lsa pastga, aks holda yuqoriga", n3 + " ≈ " + Math.round(n3 / m) * m] }; }
    if (k === 3) { var n4 = R(1, 49); return { q: "Rim raqamidagi " + roman(n4) + " sonini arab raqamida yozing.", a: n4, hint: "son", w: nearW(n4, 5, 6),
      steps: [roman(n4) + " = " + n4] }; }
    if (k === 4) { var n5 = R(1000, 99999), s = String(n5).split("").reduce(function (x, y) { return x + +y; }, 0);
      return { q: n5 + " sonining raqamlari yig'indisini toping.", a: s, hint: "son", w: nearW(s, 5, 5),
        steps: [String(n5).split("").join(" + ") + " = " + s] }; }
    if (k === 5) { var dg = R(2, 6), small = Math.random() < .5, ans = small ? Math.pow(10, dg - 1) : Math.pow(10, dg) - 1;
      return { q: "Eng " + (small ? "kichik" : "katta") + " " + dg + " xonali natural sonni toping.", a: ans, hint: "son",
        w: [small ? Math.pow(10, dg) - 1 : Math.pow(10, dg - 1), ans + 1, ans - 1, Math.pow(10, dg)].filter(function (x) { return x !== ans; }),
        steps: [small ? "1 va " + (dg - 1) + " ta nol" : dg + " ta 9 raqami", "Javob: " + ans] }; }
    var a3 = R(10, 90), b3 = a3 + R(5, 30);
    return { q: a3 + " va " + b3 + " orasida (ular kirmaydi) nechta natural son bor?", a: b3 - a3 - 1, hint: "son", w: nearW(b3 - a3 - 1, 5, 3),
      steps: [b3 + " − " + a3 + " − 1 = " + (b3 - a3 - 1)] };
  };

  /* ===== 51. Qisqa ko'paytirish formulalari ===== */
  G.t51 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4]);
    var a = R(1, L === 3 ? 9 : 5), b = R(1, L === 3 ? 9 : 9);
    if (k === 0) return { q: "(" + (a === 1 ? "" : a) + "x + " + b + ")² ni yoyib yozing.", a: poly([a * a, 2 * a * b, b * b]), hint: "ko'phad", type: "text",
      w: [poly([a * a, a * b, b * b]), poly([a * a, 2 * a * b, b]), poly([a, 2 * a * b, b * b]), poly([a * a, -2 * a * b, b * b])],
      steps: ["(p + q)² = p² + 2pq + q²", "= " + poly([a * a, 2 * a * b, b * b])] };
    if (k === 1) return { q: "(" + (a === 1 ? "" : a) + "x − " + b + ")² ni yoyib yozing.", a: poly([a * a, -2 * a * b, b * b]), hint: "ko'phad", type: "text",
      w: [poly([a * a, 2 * a * b, b * b]), poly([a * a, -a * b, b * b]), poly([a * a, -2 * a * b, -b * b]), poly([a, -2 * a * b, b * b])],
      steps: ["(p − q)² = p² − 2pq + q²", "= " + poly([a * a, -2 * a * b, b * b])] };
    if (k === 2) return { q: "(" + (a === 1 ? "" : a) + "x − " + b + ")(" + (a === 1 ? "" : a) + "x + " + b + ") ni yoyib yozing.",
      a: poly([a * a, 0, -b * b]), hint: "ko'phad", type: "text",
      w: [poly([a * a, 0, b * b]), poly([a * a, 2 * a * b, -b * b]), poly([a, 0, -b * b]), poly([a * a, -2 * a * b, b * b])],
      steps: ["(p − q)(p + q) = p² − q²", "= " + poly([a * a, 0, -b * b])] };
    if (k === 3) { var n = R(11, 29);
      return { q: n + "² ni qisqa ko'paytirish formulasi bilan hisoblang.", a: n * n, hint: "son", w: nearW(n * n, 5, Math.round(n * 1.5)),
        steps: [n + "² = (" + (n - n % 10) + " + " + (n % 10) + ")² = " + Math.pow(n - n % 10, 2) + " + 2·" + (n - n % 10) + "·" + (n % 10) + " + " + Math.pow(n % 10, 2), "= " + n * n] }; }
    var p = R(2, 15), q = R(1, p - 1);
    return { q: p + "² − " + q + "² ni hisoblang.", a: p * p - q * q, hint: "son", w: nearW(p * p - q * q, 5, Math.max(4, p + q)),
      steps: ["a² − b² = (a − b)(a + b) = " + (p - q) + "·" + (p + q), "= " + (p * p - q * q)] };
  };

  /* ===== 52. Ko'phadni ko'paytuvchilarga ajratish ===== */
  G.t52 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2]);
    var x1 = RNZ(-8, 8), x2; do { x2 = RNZ(-8, 8); } while (x2 === x1);
    if (k === 0) { var b = -(x1 + x2), c = x1 * x2;
      var f = "(x " + (x1 > 0 ? "− " + x1 : "+ " + (-x1)) + ")(x " + (x2 > 0 ? "− " + x2 : "+ " + (-x2)) + ")";
      return { q: poly([1, b, c]) + " ni ko'paytuvchilarga ajratish uchun ildizlari qanday?", a: ms(Math.min(x1, x2)) + "; " + ms(Math.max(x1, x2)), hint: "x₁; x₂", type: "text",
        w: [ms(-x1) + "; " + ms(-x2), ms(b) + "; " + ms(c), ms(x1) + "; " + ms(x2 + 1), ms(x1 - 1) + "; " + ms(x2)],
        steps: ["Vyet: x₁ + x₂ = " + ms(-b) + ", x₁x₂ = " + ms(c), "Ko'paytuvchilar: " + f] }; }
    if (k === 1) { var n = R(2, 9), m = R(2, 9);
      return { q: poly([n * m, n * m * 2, 0]).replace(/x²/, "x²") + " ifodadan umumiy ko'paytuvchini ajratganda qavs tashqarisida nima qoladi?",
        a: (n * m) + "x", hint: "ifoda", type: "text", w: [String(n * m), (n * m * 2) + "x", "x", (n * m) + "x²"],
        steps: [poly([n * m, n * m * 2, 0]) + " = " + (n * m) + "x(x + 2)", "Umumiy ko'paytuvchi: " + (n * m) + "x"] }; }
    var a = R(2, 9);
    return { q: "x² − " + (a * a) + " ni ko'paytuvchilarga ajratganda qanday ko'rinish olinadi?",
      a: "(x − " + a + ")(x + " + a + ")", hint: "ko'paytma", type: "text",
      w: ["(x − " + a + ")²", "(x + " + a + ")²", "(x − " + (a * a) + ")(x + 1)", "x(x − " + (a * a) + ")"],
      steps: ["a² − b² = (a − b)(a + b)", "x² − " + a * a + " = (x − " + a + ")(x + " + a + ")"] };
  };

  /* ===== 53. Modulli tenglamalar va tengsizliklar ===== */
  G.t53 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3]);
    var c = R(1, 12), b = RNZ(-9, 9);
    if (k === 0) return { q: "|x| = " + c + " tenglamani yeching.", a: ms(-c) + "; " + ms(c), hint: "x₁; x₂", type: "text",
      w: [String(c), ms(-c), "0; " + c, ms(-c) + "; " + ms(c + 1)], steps: ["|x| = a (a > 0) → x = ±a", "x = " + ms(-c) + " yoki x = " + c] };
    if (k === 1) return { q: "|x " + (b >= 0 ? "+ " + b : "− " + (-b)) + "| = " + c + " tenglamani yeching.",
      a: ms(Math.min(-c - b, c - b)) + "; " + ms(Math.max(-c - b, c - b)), hint: "x₁; x₂", type: "text",
      w: [ms(c - b), ms(-c - b), ms(c + b) + "; " + ms(-c + b), ms(-c - b) + "; " + ms(c - b + 1)],
      steps: ["x " + (b >= 0 ? "+ " + b : "− " + (-b)) + " = ±" + c, "x = " + ms(c - b) + " yoki x = " + ms(-c - b)] };
    if (k === 2) return { q: "|x| < " + c + " tengsizlikni yeching.", a: "(" + ms(-c) + "; " + c + ")", hint: "oraliq", type: "text",
      w: ["[" + ms(-c) + "; " + c + "]", "(−∞; " + ms(-c) + ")∪(" + c + "; +∞)", "(0; " + c + ")", "(" + ms(-c) + "; 0)"],
      steps: ["|x| < a → −a < x < a", "Javob: (" + ms(-c) + "; " + c + ")"] };
    return { q: "|x| > " + c + " tengsizlikni yeching.", a: "(−∞; " + ms(-c) + ")∪(" + c + "; +∞)", hint: "oraliq", type: "text",
      w: ["(" + ms(-c) + "; " + c + ")", "[" + ms(-c) + "; " + c + "]", "(" + c + "; +∞)", "(−∞; " + ms(-c) + ")"],
      steps: ["|x| > a → x &lt; −a yoki x &gt; a", "Javob: (−∞; " + ms(-c) + ")∪(" + c + "; +∞)"] };
  };

  /* ===== 54. Arifmetik progressiya ===== */
  G.t54 = function (L) {
    var a1 = RNZ(-12, 15), d = RNZ(-7, 8), n = R(5, L === 3 ? 40 : 15);
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    if (k === 0) { var an = a1 + (n - 1) * d;
      return { q: "a₁ = " + ms(a1) + ", d = " + ms(d) + ". a" + n + " ni toping.", a: an, hint: "son", w: nearW(an, 5, Math.abs(d) + 4),
        steps: ["aₙ = a₁ + (n − 1)d = " + ms(a1) + " + " + (n - 1) + "·" + par(d), "= " + an] }; }
    if (k === 1) { var sn = n * (2 * a1 + (n - 1) * d) / 2;
      return { q: "a₁ = " + ms(a1) + ", d = " + ms(d) + ". S" + n + " ni toping.", a: sn, hint: "son", w: nearW(sn, 5, Math.max(6, Math.abs(sn) / 4)),
        steps: ["Sₙ = n(2a₁ + (n−1)d)/2", "= " + sn] }; }
    if (k === 2) { var i1 = R(2, 8), i2 = i1 + R(2, 9), v1 = a1 + (i1 - 1) * d, v2 = a1 + (i2 - 1) * d;
      return { q: "a" + i1 + " = " + ms(v1) + ", a" + i2 + " = " + ms(v2) + ". d ni toping.", a: d, hint: "son", w: nearW(d, 5, 4),
        steps: ["d = (a" + i2 + " − a" + i1 + ")/(" + i2 + " − " + i1 + ") = " + (v2 - v1) + "/" + (i2 - i1), "= " + d] }; }
    if (k === 3) { var an2 = a1 + (n - 1) * d, sn2 = n * (a1 + an2) / 2;
      return { q: "a₁ = " + ms(a1) + ", a" + n + " = " + ms(an2) + ". S" + n + " ni toping.", a: sn2, hint: "son", w: nearW(sn2, 5, Math.max(6, Math.abs(sn2) / 4)),
        steps: ["Sₙ = n(a₁ + aₙ)/2 = " + n + "(" + ms(a1) + " + " + ms(an2) + ")/2", "= " + sn2] }; }
    var i = R(2, 15), prev = a1 + (i - 2) * d, next = a1 + i * d;
    return { q: "Arifmetik progressiyada a" + (i - 1) + " = " + ms(prev) + ", a" + (i + 1) + " = " + ms(next) + ". a" + i + " ni toping.",
      a: (prev + next) / 2, hint: "son", w: nearW((prev + next) / 2, 5, 5),
      steps: ["aₙ = (aₙ₋₁ + aₙ₊₁)/2", "= (" + ms(prev) + " + " + ms(next) + ")/2 = " + (prev + next) / 2] };
  };

  /* ===== 55. Geometrik progressiya ===== */
  G.t55 = function (L) {
    var b1 = pick([1, 2, 3, -2, 5, -1, 4]), q = pick([2, 3, -2, -3]), n = R(4, L === 3 ? 9 : 6);
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    if (k === 0) { var bn = b1 * Math.pow(q, n - 1);
      return { q: "b₁ = " + ms(b1) + ", q = " + ms(q) + ". b" + n + " ni toping.", a: bn, hint: "son", w: nearW(bn, 5, Math.max(4, Math.abs(bn) / 2)),
        steps: ["bₙ = b₁qⁿ⁻¹ = " + ms(b1) + "·" + par(q) + sup(n - 1), "= " + bn] }; }
    if (k === 1) { var sn = b1 * (Math.pow(q, n) - 1) / (q - 1);
      return { q: "b₁ = " + ms(b1) + ", q = " + ms(q) + ". S" + n + " ni toping.", a: sn, hint: "son", w: nearW(sn, 5, Math.max(5, Math.abs(sn) / 3)),
        steps: ["Sₙ = b₁(qⁿ − 1)/(q − 1)", "= " + sn] }; }
    if (k === 2) { var i = R(2, 7), v1 = b1 * Math.pow(q, i - 1), v2 = b1 * Math.pow(q, i);
      return { q: "b" + i + " = " + ms(v1) + ", b" + (i + 1) + " = " + ms(v2) + ". q ni toping.", a: q, hint: "son", w: nearW(q, 5, 3),
        steps: ["q = b" + (i + 1) + " / b" + i + " = " + ms(v2) + " : " + ms(v1), "= " + ms(q)] }; }
    if (k === 3) { var den = pick([2, 3, 4, 5, 10]), b0 = (den - 1) * R(1, 8), inf = b0 * den / (den - 1);
      return { q: "Cheksiz kamayuvchi progressiyada b₁ = " + b0 + ", q = 1/" + den + ". Yig'indisini toping.", a: inf, hint: "son",
        w: nearW(inf, 5, Math.max(3, Math.round(inf / 3))).concat([b0 * 2]).filter(function (v) { return v > 0 && v !== inf; }),
        steps: ["S = b₁/(1 − q) = " + b0 + "/(1 − 1/" + den + ")", "= " + b0 + " : " + (den - 1) + "/" + den + " = " + b0 + "·" + den + "/" + (den - 1), "= " + inf] }; }
    var m = R(1, 6), g1 = Math.pow(2, m), g3 = Math.pow(2, m + 2);
    return { q: "Geometrik progressiyada b₁ = " + g1 + ", b₃ = " + g3 + " (q > 0). b₂ ni toping.", a: Math.pow(2, m + 1), hint: "son",
      w: nearW(Math.pow(2, m + 1), 5, Math.max(3, Math.pow(2, m))), steps: ["b₂² = b₁·b₃ = " + (g1 * g3), "b₂ = √" + (g1 * g3) + " = " + Math.pow(2, m + 1)] };
  };

  /* ===== 56. Nisbat, proporsiya va foiz ===== */
  G.t56 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3]);
    if (k === 0) { var a = R(2, 12), b = R(2, 12), c = R(2, 12), x = b * c / a;
      if (x !== Math.round(x)) { a = 2; b = 6; c = 10; x = 30; }
      return { q: a + " : " + b + " = " + c + " : x proporsiyadan x ni toping.", a: x, hint: "son", w: nearW(x, 5, Math.max(3, Math.round(x / 3))),
        steps: ["a·x = b·c → x = " + b + "·" + c + "/" + a, "= " + x] }; }
    if (k === 1) { var tot = pick([60, 90, 120, 150, 180, 240]), r1 = R(1, 5), r2 = R(1, 5);
      var part = tot * r1 / (r1 + r2);
      if (part !== Math.round(part)) { tot = 120; r1 = 1; r2 = 2; part = 40; }
      return { q: tot + " soni " + r1 + " : " + r2 + " nisbatda bo'lindi. Birinchi qismni toping.", a: part, hint: "son", w: nearW(part, 5, Math.max(4, Math.round(part / 3))),
        steps: ["Jami ulush: " + (r1 + r2), tot + " : " + (r1 + r2) + " · " + r1 + " = " + part] }; }
    if (k === 2) { var N = pick([200, 400, 500, 800, 1000]), p = pick([5, 10, 15, 20, 25]);
      return { q: N + " so'm tovar " + p + "% chegirma bilan sotildi. Yangi narxni toping.", a: N - N * p / 100, hint: "so'm",
        w: nearW(N - N * p / 100, 5, Math.max(10, N * p / 100)), steps: ["Chegirma: " + N * p / 100, "Yangi narx: " + (N - N * p / 100)] }; }
    var old = pick([200, 400, 500, 800]), pp = pick([10, 20, 25, 50]);
    var nw = old * (100 + pp) / 100;
    return { q: "Narx " + old + " dan " + nw + " ga oshdi. Necha foizga oshgan?", a: pp, hint: "foiz", w: nearW(pp, 5, 12),
      steps: ["Oshish: " + (nw - old), (nw - old) + "/" + old + "·100% = " + pp + "%"] };
  };

  /* ===== 57. O'rta qiymatlar ===== */
  G.t57 = function (L) {
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2, 3]);
    if (k === 0) { var xs = Array.from({ length: R(3, 6) }, function () { return R(1, 40); });
      var s = xs.reduce(function (a, b) { return a + b; }, 0);
      while (s % xs.length !== 0) { xs[0]++; s++; }
      return { q: xs.join("; ") + " sonlarining arifmetik o'rtasini toping.", a: s / xs.length, hint: "son", w: nearW(s / xs.length, 5, 6),
        steps: ["Yig'indi: " + s, s + " : " + xs.length + " = " + s / xs.length] }; }
    if (k === 1) { var g = pick([2, 3, 4, 5, 6, 8, 10, 12]), m = pick([2, 3, 4]);
      var a = g / m > 0 ? g * m : g, b = g / m;
      a = g * m; b = Math.round(g / m) === g / m ? g / m : g;
      var gm = Math.sqrt(a * b);
      if (gm !== Math.round(gm)) { a = 4; b = 9; gm = 6; }
      return { q: a + " va " + b + " sonlarining geometrik o'rtasini toping.", a: gm, hint: "son", w: nearW(gm, 5, 4).concat([(a + b) / 2]).filter(function (x) { return x !== gm && x > 0; }),
        steps: ["√(a·b) = √" + (a * b), "= " + gm] }; }
    if (k === 2) { var hp = pick([[3, 6], [2, 6], [4, 12], [6, 12], [10, 15], [12, 24], [6, 3], [15, 10], [5, 20], [12, 4]]), p = hp[0], q = hp[1];
      var hm = 2 * p * q / (p + q);
      return { q: p + " va " + q + " sonlarining garmonik o'rtasini toping.", a: hm, hint: "son", w: nearW(hm, 5, 3).concat([(p + q) / 2]).filter(function (x) { return x !== hm && x > 0; }),
        steps: ["2ab/(a+b) = 2·" + p + "·" + q + "/(" + p + " + " + q + ")", "= " + hm] }; }
    return { q: "Ikki musbat son uchun arifmetik, geometrik va garmonik o'rtalar qanday tartibda joylashadi?",
      a: "garmonik ≤ geometrik ≤ arifmetik", hint: "tartib", type: "text",
      w: ["arifmetik ≤ geometrik ≤ garmonik", "geometrik ≤ garmonik ≤ arifmetik", "hammasi teng"],
      steps: ["Klassik tengsizlik: H ≤ G ≤ A (tenglik faqat sonlar teng bo'lganda)"] };
  };

  /* ===== 58. Determinantlar va Kramer usuli ===== */
  G.t58 = function (L) {
    var a = RNZ(-6, 6), b = RNZ(-6, 6), c = RNZ(-6, 6), d = RNZ(-6, 6);
    var det = a * d - b * c;
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    if (k === 0) return { q: "Determinantni hisoblang: | " + ms(a) + " " + ms(b) + " ; " + ms(c) + " " + ms(d) + " |", a: det, hint: "son", w: nearW(det, 5, Math.max(4, Math.abs(det) / 2)).concat([a * d + b * c]),
      steps: ["Δ = ad − bc = " + ms(a) + "·" + ms(d) + " − " + ms(b) + "·" + ms(c), "= " + det] };
    if (k === 1) { var gd = 0; while ((det === 0 || d === 0 || b === 0) && gd++ < 50) { a = RNZ(-6, 6); b = RNZ(-6, 6); c = RNZ(-6, 6); d = RNZ(-6, 6); det = a * d - b * c; }
      var x = RNZ(-5, 5), y = RNZ(-5, 5), e = a * x + b * y, f = c * x + d * y;
      return { q: "Kramer usuli bilan yeching: " + ms(a) + "x + " + ms(b) + "y = " + ms(e) + " ; " + ms(c) + "x + " + ms(d) + "y = " + ms(f) + ". x ni toping.",
        a: x, hint: "son", w: nearW(x, 5, 4).concat([y]).filter(function (v) { return v !== x; }),
        steps: ["Δ = " + det, "Δx = " + ms(e) + "·" + ms(d) + " − " + ms(b) + "·" + ms(f) + " = " + (e * d - b * f), "x = Δx/Δ = " + x] }; }
    return { q: "Chiziqli sistemada Δ = 0 va Δx ≠ 0 bo'lsa, sistema qanday bo'ladi?", a: "yechimga ega emas", hint: "xulosa", type: "text",
      w: ["yagona yechimga ega", "cheksiz ko'p yechimga ega", "x = 0 yechimga ega"],
      steps: ["Δ = 0, Δx ≠ 0 → birgalikda emas (yechimi yo'q)"] };
  };

  /* ===== 59. Limit asoslari ===== */
  G.t59 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    var a = RNZ(-5, 5), b = RNZ(-9, 9), x0 = RNZ(-4, 4);
    if (k === 0) return { q: "lim(x→" + ms(x0) + ") (" + poly([a, b]) + ") ni hisoblang.", a: a * x0 + b, hint: "son", w: nearW(a * x0 + b, 5, 5),
      steps: ["Ko'phad uzluksiz → x₀ ni o'rniga qo'yamiz", "= " + ms(a) + "·" + par(x0) + " + " + ms(b) + " = " + (a * x0 + b)] };
    if (k === 1) { var c = R(2, 9); return { q: "lim(x→∞) " + c + "/x ni hisoblang.", a: 0, hint: "son", w: [c, 1, "∞", -c],
      steps: ["x cheksiz oshganda " + c + "/x nolga intiladi", "Javob: 0"] }; }
    if (k === 2) { var m = R(2, 9), n = R(2, 9);
      return { q: "lim(x→∞) (" + m + "x + 1)/(" + n + "x + 3) ni hisoblang.", a: fr(m, n), hint: "kasr", type: "text",
        w: [fr(n, m), "0", "1", "∞"], steps: ["Surat va maxrajni x ga bo'lamiz", "= " + m + "/" + n + " = " + fr(m, n)] }; }
    if (k === 3) { var r = RNZ(-6, 6);
      return { q: "lim(x→" + ms(r) + ") (x² − " + (r * r) + ")/(x " + (r > 0 ? "− " + r : "+ " + (-r)) + ") ni hisoblang.", a: 2 * r, hint: "son", w: nearW(2 * r, 5, 4).concat([0]),
        steps: ["(x² − " + r * r + ")/(x − " + ms(r) + ") = x + " + ms(r), "x → " + ms(r) + " → " + ms(r) + " + " + ms(r) + " = " + 2 * r] }; }
    return { q: "lim(x→0) (sin x)/x ni hisoblang.", a: 1, hint: "son", w: [0, "∞", -1, 2],
      steps: ["Asosiy trigonometrik limit: lim(x→0) sin x / x = 1"] };
  };

  /* ===== 60. Hosila ===== */
  G.t60 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    var n = R(2, L === 3 ? 8 : 5), c = R(2, 9);
    if (k === 0) return { q: "y = x" + sup(n) + " funksiyaning hosilasini toping.", a: (n === 2 ? "2x" : n + "x" + sup(n - 1)), hint: "ifoda", type: "text",
      w: [(n + 1) + "x" + sup(n), n + "x" + sup(n), "x" + sup(n - 1), (n - 1) + "x" + sup(n - 1)],
      steps: ["(xⁿ)' = n·xⁿ⁻¹", "= " + n + "x" + sup(n - 1)] };
    if (k === 1) return { q: "y = " + c + "x funksiyaning hosilasini toping.", a: c, hint: "son", w: nearW(c, 5, 3).concat([0, 1]).filter(function (x) { return x !== c; }),
      steps: ["(kx)' = k", "= " + c] };
    if (k === 2) return { q: "y = " + c + " (o'zgarmas) funksiyaning hosilasini toping.", a: 0, hint: "son", w: [c, 1, -c, 2],
      steps: ["O'zgarmasning hosilasi nolga teng"] };
    if (k === 3) { var a = R(2, 7), b = R(2, 9);
      return { q: "y = " + a + "x² + " + b + "x funksiyaning hosilasini toping.", a: (2 * a) + "x + " + b, hint: "ifoda", type: "text",
        w: [a + "x + " + b, (2 * a) + "x", (2 * a) + "x + " + (b + 1), a + "x² + " + b],
        steps: ["(ax²)' = 2ax, (bx)' = b", "y' = " + 2 * a + "x + " + b] }; }
    if (k === 4) { var a2 = R(1, 6), b2 = R(1, 9), x0 = R(1, 5);
      var dv = 2 * a2 * x0 + b2;
      return { q: "y = " + a2 + "x² + " + b2 + "x bo'lsa, y'(" + x0 + ") ni toping.", a: dv, hint: "son", w: nearW(dv, 5, 5),
        steps: ["y' = " + 2 * a2 + "x + " + b2, "y'(" + x0 + ") = " + 2 * a2 + "·" + x0 + " + " + b2 + " = " + dv] }; }
    var fn = pick([["sin x", "cos x"], ["cos x", "−sin x"], ["eˣ", "eˣ"], ["ln x", "1/x"]]);
    return { q: "y = " + fn[0] + " funksiyaning hosilasini toping.", a: fn[1], hint: "ifoda", type: "text",
      w: wT(fn[1], ["cos x", "−sin x", "sin x", "eˣ", "1/x"]).slice(0, 4), steps: ["Jadval: (" + fn[0] + ")' = " + fn[1]] };
  };

  /* ===== 61. Bo'linish belgilari, EKUB va EKUK ===== */
  G.t61 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    if (k === 0) { var g = pick([2, 3, 4, 5, 6, 7, 8, 9, 12]), a = g * R(2, 8), b = g * R(2, 9);
      while (gcd(a / g, b / g) !== 1 || a === b) { a = g * R(2, 8); b = g * R(2, 9); }
      return { q: "EKUB(" + a + "; " + b + ") ni toping.", a: g, hint: "son", w: nearW(g, 5, 4).concat([a, b, lcm(a, b)]).filter(function (x) { return x !== g; }).slice(0, 4),
        steps: [a + " = " + g + "·" + (a / g) + ", " + b + " = " + g + "·" + (b / g), "Umumiy eng katta bo'luvchi: " + g] }; }
    if (k === 1) { var a2 = R(2, 15), b2 = R(2, 15); if (a2 === b2) b2++;
      return { q: "EKUK(" + a2 + "; " + b2 + ") ni toping.", a: lcm(a2, b2), hint: "son",
        w: [a2 * b2, gcd(a2, b2), lcm(a2, b2) * 2, Math.max(a2, b2)].filter(function (x) { return x !== lcm(a2, b2); }),
        steps: ["EKUK = a·b/EKUB = " + a2 + "·" + b2 + "/" + gcd(a2, b2), "= " + lcm(a2, b2)] }; }
    if (k === 2) { var d = pick([2, 3, 5, 9, 10]), n = R(100, 9999);
      var ok = n % d === 0;
      return { q: n + " soni " + d + " ga bo'linadimi?", a: ok ? "ha" : "yo'q", hint: "ha / yo'q", type: "text", w: [ok ? "yo'q" : "ha"],
        steps: [d === 2 ? "Oxirgi raqam juftmi?" : d === 5 ? "Oxirgi raqam 0 yoki 5 mi?" : d === 10 ? "Oxirgi raqam 0 mi?" : "Raqamlari yig'indisi " + d + " ga bo'linadimi?",
          n + " : " + d + " → " + (ok ? "bo'linadi" : "bo'linmaydi (qoldiq " + (n % d) + ")")] }; }
    if (k === 3) { var n2 = R(10, 300), d2 = pick([3, 7, 11, 13]);
      return { q: n2 + " ni " + d2 + " ga bo'lganda qoldiqni toping.", a: n2 % d2, hint: "son", w: [0, 1, 2, 3, 4, 5, 6].filter(function (x) { return x !== n2 % d2; }).slice(0, 4),
        steps: [n2 + " = " + d2 + "·" + Math.floor(n2 / d2) + " + " + (n2 % d2), "Qoldiq: " + (n2 % d2)] }; }
    if (k === 4) { var p = pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60, 72]);
      var ds = []; for (var i = 1; i <= p; i++) if (p % i === 0) ds.push(i);
      return { q: p + " sonining nechta natural bo'luvchisi bor?", a: ds.length, hint: "son", w: nearW(ds.length, 5, 3).filter(function (x) { return x > 0; }),
        steps: ["Bo'luvchilar: " + ds.join(", "), "Soni: " + ds.length] }; }
    var n3 = pick([12, 18, 20, 24, 36, 40, 45, 48, 50, 60, 72, 84, 90, 100]);
    var fs = [], t = n3;
    for (var j = 2; j * j <= t; j++) while (t % j === 0) { fs.push(j); t /= j; }
    if (t > 1) fs.push(t);
    return { q: n3 + " ni tub ko'paytuvchilarga ajratganda nechta ko'paytuvchi bo'ladi (takrorlar bilan)?", a: fs.length, hint: "son",
      w: nearW(fs.length, 5, 2).filter(function (x) { return x > 0; }), steps: [n3 + " = " + fs.join("·"), "Soni: " + fs.length] };
  };

  /* ===== 62. Kvadrat ildiz va ratsional ko'rsatkichli daraja ===== */
  G.t62 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    if (k === 0) { var n = pick([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 400]);
      return { q: "√" + n + " ni hisoblang.", a: Math.sqrt(n), hint: "son", w: nearW(Math.sqrt(n), 5, 4),
        steps: [Math.sqrt(n) + "² = " + n + " → √" + n + " = " + Math.sqrt(n)] }; }
    if (k === 1) { var m = pick([8, 12, 18, 20, 27, 32, 45, 50, 72, 75, 98, 128]);
      var out = 1, inn = m;
      for (var i = 2; i * i <= inn; i++) while (inn % (i * i) === 0) { out *= i; inn /= i * i; }
      return { q: "√" + m + " ni soddalashtiring.", a: out + "√" + inn, hint: "k√m", type: "text",
        w: [(out * out) + "√" + inn, (out + 1) + "√" + inn, out + "√" + (inn + 1), String(out * inn), inn + "√" + out],
        steps: ["√" + m + " = √(" + out * out + "·" + inn + ") = " + out + "√" + inn] }; }
    if (k === 2) { var b = pick([4, 8, 9, 16, 27, 25, 32, 64, 81, 125]);
      var tbl = { 4: ["1/2", 2], 9: ["1/2", 3], 16: ["1/2", 4], 25: ["1/2", 5], 81: ["1/2", 9], 8: ["1/3", 2], 27: ["1/3", 3], 64: ["1/3", 4], 125: ["1/3", 5], 32: ["1/5", 2] };
      var e = tbl[b];
      return { q: b + sup("") + "^(" + e[0] + ") ni hisoblang.", a: e[1], hint: "son", w: nearW(e[1], 5, 3).concat([b / 2]).filter(function (x) { return x !== e[1]; }),
        steps: ["a^(1/n) = ⁿ√a", "= " + e[1]] }; }
    if (k === 3) { var p = R(2, 8), q = R(2, 8);
      return { q: "√" + (p * p) + " · √" + (q * q) + " ni hisoblang.", a: p * q, hint: "son", w: nearW(p * q, 5, Math.max(4, p + q)),
        steps: ["= " + p + "·" + q + " = " + p * q] }; }
    var r = R(2, 9), s = R(2, 6);
    return { q: "(" + s + "√" + r + ")² ni hisoblang.", a: s * s * r, hint: "son", w: nearW(s * s * r, 5, Math.max(4, s * r)),
      steps: ["(k√m)² = k²m = " + s * s + "·" + r + " = " + s * s * r] };
  };

  /* ===== 63. Vyet teoremasi ===== */
  G.t63 = function (L) {
    var x1 = RNZ(-9, 9), x2; do { x2 = RNZ(-9, 9); } while (x2 === x1);
    var b = -(x1 + x2), c = x1 * x2;
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    if (k === 0) return { q: poly([1, b, c]) + " = 0 tenglamada ildizlar yig'indisini toping.", a: x1 + x2, hint: "son", w: nearW(x1 + x2, 5, 4).concat([c, -c]).filter(function (v) { return v !== x1 + x2; }),
      steps: ["x₁ + x₂ = −b = " + ms(-b), "= " + (x1 + x2)] };
    if (k === 1) return { q: poly([1, b, c]) + " = 0 tenglamada ildizlar ko'paytmasini toping.", a: c, hint: "son", w: nearW(c, 5, 5).concat([x1 + x2]).filter(function (v) { return v !== c; }),
      steps: ["x₁·x₂ = c = " + ms(c)] };
    if (k === 2) { var srt = [x1, x2].sort(function (a, b) { return a - b; });
      return { q: poly([1, b, c]) + " = 0 tenglamani Vyet teoremasi yordamida yeching.", a: ms(srt[0]) + "; " + ms(srt[1]), hint: "x₁; x₂", type: "text",
        w: [ms(-srt[0]) + "; " + ms(-srt[1]), ms(b) + "; " + ms(c), ms(srt[0]) + "; " + ms(srt[1] + 1), ms(srt[0] - 1) + "; " + ms(srt[1])],
        steps: ["Yig'indi " + ms(-b) + ", ko'paytma " + ms(c), "x₁ = " + ms(srt[0]) + ", x₂ = " + ms(srt[1])] }; }
    if (k === 3) return { q: "Ildizlari yig'indisi " + (x1 + x2) + " va ko'paytmasi " + c + " bo'lgan kvadrat tenglamani tuzing.",
      a: poly([1, b, c]) + " = 0", hint: "tenglama", type: "text",
      w: [poly([1, -b, c]) + " = 0", poly([1, b, -c]) + " = 0", poly([1, -b, -c]) + " = 0", poly([1, x1, x2]) + " = 0"],
      steps: ["x² − (x₁+x₂)x + x₁x₂ = 0", "x² − " + ms(x1 + x2) + "x + " + ms(c) + " = 0 → " + poly([1, b, c]) + " = 0"] };
    return { q: poly([1, b, c]) + " = 0 tenglamada 1/x₁ + 1/x₂ ni toping.", a: fr(x1 + x2, c), hint: "kasr", type: "text",
      w: (x1 + x2 !== 0 ? [fr(c, x1 + x2)] : ["1", "−1"]).concat([fr(-(x1 + x2), c), String(x1 + x2), String(c), fr(x1 + x2 + 1, c)]),
      steps: ["1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂)", "= " + (x1 + x2) + "/" + c + " = " + fr(x1 + x2, c)] };
  };

  /* ===== 64. Irratsional tenglamalar ===== */
  G.t64 = function (L) {
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    var c = R(2, L === 3 ? 10 : 7), p = RNZ(-9, 9);
    if (k === 0) { var x = c * c - p;
      return { q: "√(x " + (p >= 0 ? "+ " + p : "− " + (-p)) + ") = " + c + " tenglamani yeching.", a: x, hint: "son", w: nearW(x, 5, 6),
        steps: ["Kvadratga ko'taramiz: x " + (p >= 0 ? "+ " + p : "− " + (-p)) + " = " + c * c, "x = " + x] }; }
    if (k === 1) { var a = pick([2, 3, 4]), b = RNZ(-8, 8), x2 = (c * c - b) / a;
      if (x2 !== Math.round(x2)) { b = c * c - a * R(1, 8); x2 = (c * c - b) / a; }
      return { q: "√(" + poly([a, b]) + ") = " + c + " tenglamani yeching.", a: x2, hint: "son", w: nearW(x2, 5, 5),
        steps: [poly([a, b]) + " = " + c * c, a + "x = " + (c * c - b), "x = " + x2] }; }
    var r = R(2, 6), s = R(1, 9), xv = r * r + s;
    return { q: "√(x − " + s + ") = " + r + " tenglamaning ildizini toping va ODZ ni tekshiring.", a: xv, hint: "son", w: nearW(xv, 5, 6),
      steps: ["ODZ: x ≥ " + s, "x − " + s + " = " + r * r + " → x = " + xv, xv + " ≥ " + s + " → ildiz to'g'ri"] };
  };

  /* ===== 65. ODZ ===== */
  G.t65 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    var p = R(1, 12);
    if (k === 0) return { q: "y = 1/(x − " + p + ") funksiyaning aniqlanish sohasini toping.", a: "x ≠ " + p, hint: "shart", type: "text",
      w: ["x ≠ " + (-p), "x > " + p, "x ≥ " + p, "x ≠ 0"], steps: ["Maxraj ≠ 0 → x − " + p + " ≠ 0", "x ≠ " + p] };
    if (k === 1) return { q: "y = √(x − " + p + ") funksiyaning aniqlanish sohasini toping.", a: "[" + p + "; +∞)", hint: "oraliq", type: "text",
      w: ["(" + p + "; +∞)", "(−∞; " + p + "]", "[" + (-p) + "; +∞)", "(−∞; +∞)"], steps: ["x − " + p + " ≥ 0", "x ≥ " + p] };
    if (k === 2) return { q: "y = √(" + p + " − x) funksiyaning aniqlanish sohasini toping.", a: "(−∞; " + p + "]", hint: "oraliq", type: "text",
      w: ["[" + p + "; +∞)", "(−∞; " + p + ")", "(−∞; " + (-p) + "]", "(" + p + "; +∞)"], steps: [p + " − x ≥ 0", "x ≤ " + p] };
    if (k === 3) return { q: "y = log₂(x − " + p + ") funksiyaning aniqlanish sohasini toping.", a: "(" + p + "; +∞)", hint: "oraliq", type: "text",
      w: ["[" + p + "; +∞)", "(−∞; " + p + ")", "(0; +∞)", "(" + (-p) + "; +∞)"], steps: ["Logarifm ostidagi ifoda > 0", "x − " + p + " > 0 → x > " + p] };
    return { q: "y = 1/√(x − " + p + ") funksiyaning aniqlanish sohasini toping.", a: "(" + p + "; +∞)", hint: "oraliq", type: "text",
      w: ["[" + p + "; +∞)", "(−∞; " + p + "]", "(0; +∞)", "x ≠ " + p], steps: ["Ildiz ostida > 0 (maxrajda ham turgani uchun nolga teng bo'lmaydi)", "x > " + p] };
  };

  /* ===== 66. Gorner sxemasi va Bezu teoremasi ===== */
  G.t66 = function (L) {
    var a = pick([1, 1, 2]), b = RNZ(-6, 6), c = RNZ(-9, 9), d = RNZ(-9, 9);
    var r = RNZ(-4, 4);
    var val = a * r * r * r + b * r * r + c * r + d;
    var k = pick(L === 1 ? [0] : L === 2 ? [0, 1] : [1, 2]);
    if (k === 0) return { q: "P(x) = " + poly([a, b, c, d]) + " ko'phadni (x " + (r > 0 ? "− " + r : "+ " + (-r)) + ") ga bo'lgandagi qoldiqni toping.",
      a: val, hint: "son", w: nearW(val, 5, Math.max(5, Math.abs(val) / 2)),
      steps: ["Bezu teoremasi: qoldiq = P(" + ms(r) + ")", "P(" + ms(r) + ") = " + val] };
    if (k === 1) { // ildiz bo'ladigan yoki bo'lmaydigan holat
      var yes = Math.random() < .5, d2 = d - val + (yes ? 0 : RNZ(-5, 5));
      var rem = val + (d2 - d);
      return { q: "P(x) = " + poly([a, b, c, d2]) + " ko'phad (x " + (r > 0 ? "− " + r : "+ " + (-r)) + ") ga qoldiqsiz bo'linadimi?",
        a: yes ? "ha" : "yo'q", hint: "ha / yo'q", type: "text", w: [yes ? "yo'q" : "ha"],
        steps: ["Bezu teoremasi: qoldiq = P(" + ms(r) + ")", "P(" + ms(r) + ") = " + ms(rem) + (yes ? " → qoldiqsiz bo'linadi" : " ≠ 0 → qoldiqsiz bo'linmaydi")] }; }
    return { q: "Gorner sxemasi nima uchun ishlatiladi?", a: "ko'phadni (x − a) ga bo'lish va qiymatini hisoblash", hint: "maqsad", type: "text",
      w: ["kvadrat tenglamani yechish", "logarifm hisoblash", "matritsani aylantirish"],
      steps: ["Gorner sxemasi — ko'phadni chiziqli ikkihadga bo'lishning tez usuli; qoldiq P(a) ga teng"] };
  };

  /* ===== 67. Logarifm xossalari ===== */
  G.t67 = function (L) {
    var a = pick([2, 3, 5, 10]), m = R(1, 5), n = R(1, 5);
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    if (k === 0) return { q: "log" + sub(a) + " " + Math.pow(a, m) + " ni hisoblang.", a: m, hint: "son", w: nearW(m, 5, 3).concat([Math.pow(a, m)]),
      steps: [a + sup(m) + " = " + Math.pow(a, m) + " → javob " + m] };
    if (k === 1) return { q: "log" + sub(a) + " (" + Math.pow(a, m) + " · " + Math.pow(a, n) + ") ni hisoblang.", a: m + n, hint: "son", w: nearW(m + n, 5, 3).concat([m * n]),
      steps: ["log(xy) = log x + log y", "= " + m + " + " + n + " = " + (m + n)] };
    if (k === 2) return { q: "log" + sub(a) + " (" + Math.pow(a, m + n) + " / " + Math.pow(a, n) + ") ni hisoblang.", a: m, hint: "son", w: nearW(m, 5, 3).concat([m + n]),
      steps: ["log(x/y) = log x − log y", "= " + (m + n) + " − " + n + " = " + m] };
    if (k === 3) { var c = R(2, 5);
      return { q: "log" + sub(a) + " " + Math.pow(a, m) + sup(c) + " ni hisoblang.", a: m * c, hint: "son", w: nearW(m * c, 5, 4).concat([m + c]),
        steps: ["log(xᶜ) = c·log x", "= " + c + "·" + m + " = " + m * c] }; }
    if (k === 4) { var x = Math.pow(a, m);
      return { q: "log" + sub(a) + " x = " + m + " bo'lsa, x ni toping.", a: x, hint: "son", w: nearW(x, 5, Math.max(3, x / 2)).concat([a * m]),
        steps: ["x = " + a + sup(m) + " = " + x] }; }
    return { q: "log" + sub(a) + " x = " + m + " tenglamada ODZ qanday?", a: "x > 0", hint: "shart", type: "text",
      w: ["x ≥ 0", "x ≠ 0", "x > 1", "barcha x"], steps: ["Logarifm ostidagi ifoda musbat bo'lishi shart: x > 0"] };
  };

  /* ===== 68. Trigonometrik ayniyatlar va keltirish formulalari ===== */
  G.t68 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4]);
    if (k === 0) { var n = R(2, 9);
      return { q: "Soddalashtiring: " + n + "(sin²α + cos²α) = ?", a: n, hint: "son", w: nearW(n, 5, 3),
        steps: ["sin²α + cos²α = 1", "= " + n] }; }
    if (k === 1) { var f = pick([["sin(180° − α)", "sin α"], ["cos(180° − α)", "−cos α"], ["sin(90° − α)", "cos α"], ["cos(90° − α)", "sin α"], ["tg(180° + α)", "tg α"]]);
      return { q: f[0] + " ni soddalashtiring.", a: f[1], hint: "ifoda", type: "text",
        w: wT(f[1], ["sin α", "cos α", "−sin α", "−cos α", "tg α"]).slice(0, 4), steps: ["Keltirish formulasi: " + f[0] + " = " + f[1]] }; }
    if (k === 2) return { q: "sin 2α formulasini yozing.", a: "2 sin α cos α", hint: "formula", type: "text",
      w: ["sin²α − cos²α", "2 cos²α − 1", "sin α + cos α", "1 − 2sin²α"], steps: ["Ikkilangan burchak: sin 2α = 2 sin α cos α"] };
    if (k === 3) return { q: "cos 2α ni sin α orqali yozing.", a: "1 − 2sin²α", hint: "formula", type: "text",
      w: ["2sin²α − 1", "2 sin α cos α", "1 − sin²α", "sin²α − 1"], steps: ["cos 2α = 1 − 2sin²α"] };
    var val = pick([["sin 120°", "√3/2"], ["cos 150°", "−√3/2"], ["sin 135°", "√2/2"], ["cos 135°", "−√2/2"], ["sin 210°", "−1/2"]]);
    return { q: val[0] + " ni hisoblang.", a: val[1], hint: "qiymat", type: "text",
      w: wT(val[1], ["√3/2", "−√3/2", "√2/2", "−√2/2", "1/2", "−1/2"]).slice(0, 4),
      steps: ["Keltirish formulasi va chorak ishorasi orqali: " + val[0] + " = " + val[1]] };
  };

  /* ===== 69. Sodda trigonometrik tenglamalar ===== */
  G.t69 = function (L) {
    var pr = pick([["0", 0], ["1/2", 30], ["√2/2", 45], ["√3/2", 60], ["1", 90]]);
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3]);
    if (k === 0) return { q: "sin x = " + pr[0] + " tenglamaning [0°; 90°] dagi yechimini toping.", a: pr[1] + "°", hint: "gradus", type: "text",
      w: wT(pr[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["sin " + pr[1] + "° = " + pr[0]] };
    if (k === 1) { var ac = 90 - pr[1];
      return { q: "cos x = " + pr[0] + " tenglamaning [0°; 90°] dagi yechimini toping.", a: ac + "°", hint: "gradus", type: "text",
        w: wT(ac + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["cos " + ac + "° = " + pr[0]] }; }
    if (k === 2) return { q: "sin x = " + pr[0] + " tenglamaning umumiy yechimini yozing.", a: "x = (−1)ⁿ·" + pr[1] + "° + 180°n", hint: "umumiy yechim", type: "text",
      w: ["x = ±" + pr[1] + "° + 360°n", "x = " + pr[1] + "° + 180°n", "x = " + pr[1] + "° + 360°n", "x = ±" + pr[1] + "° + 180°n"],
      steps: ["sin x = a → x = (−1)ⁿ·arcsin a + 180°n"] };
    return { q: "cos x = " + pr[0] + " tenglamaning umumiy yechimini yozing.", a: "x = ±" + (90 - pr[1]) + "° + 360°n", hint: "umumiy yechim", type: "text",
      w: ["x = (−1)ⁿ·" + (90 - pr[1]) + "° + 180°n", "x = " + (90 - pr[1]) + "° + 180°n", "x = " + (90 - pr[1]) + "° + 360°n", "x = ±" + (90 - pr[1]) + "° + 180°n"],
      steps: ["cos x = a → x = ±arccos a + 360°n"] };
  };

  /* ===== 70. Aniqmas integral ===== */
  G.t70 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2] : [2, 3, 4]);
    var n = R(2, L === 3 ? 7 : 4), c = R(2, 9);
    if (k === 0) return { q: "∫x" + sup(n) + " dx ni toping.", a: "x" + sup(n + 1) + "/" + (n + 1) + " + C", hint: "ifoda", type: "text",
      w: ["x" + sup(n - 1) + "/" + n + " + C", n + "x" + sup(n - 1) + " + C", "x" + sup(n + 1) + " + C", (n + 1) + "x" + sup(n) + " + C"],
      steps: ["∫xⁿ dx = xⁿ⁺¹/(n+1) + C", "= x" + sup(n + 1) + "/" + (n + 1) + " + C"] };
    if (k === 1) return { q: "∫" + c + " dx ni toping.", a: c + "x + C", hint: "ifoda", type: "text",
      w: [c + " + C", "x + C", (c / 2) + "x² + C", c + "x² + C"], steps: ["∫k dx = kx + C", "= " + c + "x + C"] };
    if (k === 2) { var f = pick([["sin x", "−cos x + C"], ["cos x", "sin x + C"], ["eˣ", "eˣ + C"], ["1/x", "ln|x| + C"]]);
      return { q: "∫" + f[0] + " dx ni toping.", a: f[1], hint: "ifoda", type: "text",
        w: wT(f[1], ["cos x + C", "−cos x + C", "sin x + C", "eˣ + C", "ln|x| + C"]).slice(0, 4),
        steps: ["Jadval integral: ∫" + f[0] + " dx = " + f[1]] }; }
    if (k === 3) return { q: "∫x dx ni toping.", a: "x²/2 + C", hint: "ifoda", type: "text",
      w: ["x² + C", "2x + C", "x²/3 + C", "1 + C"], steps: ["∫x dx = x²/2 + C"] };
    var a2 = R(2, 6), b2 = R(2, 9);
    return { q: "∫(" + a2 + "x + " + b2 + ") dx ni toping.", a: (a2 / 2 === Math.round(a2 / 2) ? (a2 / 2) + "x²" : a2 + "x²/2") + " + " + b2 + "x + C", hint: "ifoda", type: "text",
      w: [a2 + "x² + " + b2 + "x + C", (a2 / 2) + "x² + " + b2 + " + C", a2 + "x + " + b2 + "x + C", (a2 + b2) + "x + C"],
      steps: ["∫ax dx = ax²/2, ∫b dx = bx", "= " + (a2 / 2 === Math.round(a2 / 2) ? (a2 / 2) + "x²" : a2 + "x²/2") + " + " + b2 + "x + C"] };
  };

  S.registerAll(G, {
    a1: "Qo'shish amali", a2: "Ayirish amali", a3: "Ko'paytirish amali", a4: "Bo'lish amali", a5: "Foizlar bilan amallar",
    a6: "Darajaga ko'tarish amali", a7: "Ko'paytirish (karra) jadvali", a8: "Sonlar",
    t51: "Qisqa ko'paytirish formulalari", t52: "Ko'phadni ko'paytuvchilarga ajratish", t53: "Modulli tenglamalar va tengsizliklar",
    t54: "Arifmetik progressiya", t55: "Geometrik progressiya", t56: "Nisbat, proporsiya va foizli masalalar",
    t57: "O'rta qiymatlar", t58: "Determinantlar va Kramer usuli", t59: "Funksiyaning limiti asoslari",
    t60: "Hosila va uning tatbiqlari", t61: "Bo'linish belgilari, EKUB va EKUK", t62: "Kvadrat ildiz va ratsional ko'rsatkichli daraja",
    t63: "Vyet teoremasi", t64: "Irratsional tenglamalar", t65: "Funksiyaning aniqlanish sohasi",
    t66: "Gorner sxemasi va Bezu teoremasi", t67: "Logarifm xossalari", t68: "Asosiy trigonometrik ayniyatlar va keltirish formulalari",
    t69: "Sodda trigonometrik tenglamalar", t70: "Aniqmas integral asoslari"
  });
})();
