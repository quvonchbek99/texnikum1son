/*!
 * Kuvonch Academy — grafikli savollar (viktorina uchun)
 * Savol obyektiga qo'shimcha maydonlar:
 *   g  — savol bilan birga chiziladigan grafik (spec)
 *   gs — { "javob matni": spec } — variantlar grafik ko'rinishida bo'lsa
 * spec: { v:[xmin,xmax,ymin,ymax], c:[{p:[[x,y]|null,...], d:1 (uzuq)}], pt:[[x,y,"A"]], xt:[[x,"π"]], gx, gy, lx, ly, ax:["x","y"], b:{l:[...], v:[...]} }
 * Chizish viktorina.html dagi graphSvg() da. ES5.
 */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle;

  function m(n) { n = Math.round(n * 1000) / 1000; return n < 0 ? "−" + (-n) : String(n); }
  function Q(q, a, w, steps, g, gs) {
    a = String(a);
    var seen = {}, out = []; seen[a] = 1;
    (w || []).forEach(function (x) { x = String(x); if (!seen[x] && x) { seen[x] = 1; out.push(x); } });
    var o = { q: q, a: a, w: out, steps: steps || [], lang: S.lang() };
    if (g) o.g = g;
    if (gs) o.gs = gs;
    return o;
  }
  function r3(v) { return Math.round(v * 1000) / 1000; }
  // funksiyani namunalash: aniqlanmagan joylarda va asimptotada chiziq uziladi
  function sample(f, x0, x1, n, ylim) {
    var pts = [], prev = null, span = ylim[1] - ylim[0];
    n = n || 96;
    for (var i = 0; i <= n; i++) {
      var x = x0 + (x1 - x0) * i / n, y;
      try { y = f(x); } catch (e) { y = NaN; }
      if (!isFinite(y) || y > ylim[1] + span || y < ylim[0] - span) { if (pts.length && pts[pts.length - 1]) pts.push(null); prev = null; continue; }
      if (prev !== null && Math.abs(y - prev) > span * 0.9) pts.push(null);
      pts.push([r3(x), r3(y)]); prev = y;
    }
    return pts;
  }
  function view(xr, yr) { return [-xr, xr, -yr, yr]; }
  function curve(f, v, opt) { var c = { p: sample(f, v[0], v[1], (opt && opt.n) || 96, [v[2], v[3]]) }; if (opt && opt.d) c.d = 1; return c; }
  function spec(v, curves, extra) { var s = { v: v, c: curves }; if (extra) for (var k in extra) s[k] = extra[k]; return s; }

  /* ---------- formulalar yozuvi ---------- */
  function lin(k, b) { // y = kx + b
    var s = k === 0 ? "" : k === 1 ? "x" : k === -1 ? "−x" : m(k) + "x";
    if (b !== 0) s += s ? (b > 0 ? " + " + b : " − " + (-b)) : m(b);
    return "y = " + (s || "0");
  }
  function inner(a) { return a === 0 ? "x" : a > 0 ? "x − " + a : "x + " + (-a); } // x − a
  function tail(b) { return b === 0 ? "" : b > 0 ? " + " + b : " − " + (-b); }
  function coef(k, body) { return k === 1 ? body : k === -1 ? "−" + body : m(k) + body; }
  var FAM = {
    sq: { f: function (x) { return x * x; }, t: function (a) { return a === 0 ? "x²" : "(" + inner(a) + ")²"; }, nm: "y = x²" },
    abs: { f: Math.abs, t: function (a) { return "|" + inner(a) + "|"; }, nm: "y = |x|" },
    sqrt: { f: function (x) { return x < 0 ? NaN : Math.sqrt(x); }, t: function (a) { return a === 0 ? "√x" : "√(" + inner(a) + ")"; }, nm: "y = √x" },
    cube: { f: function (x) { return x * x * x; }, t: function (a) { return a === 0 ? "x³" : "(" + inner(a) + ")³"; }, nm: "y = x³" },
    inv: { f: function (x) { return Math.abs(x) < 1e-9 ? NaN : 1 / x; }, t: function (a) { return "1/" + (a === 0 ? "x" : "(" + inner(a) + ")"); }, nm: "y = 1/x" },
    exp: { f: function (x) { return Math.pow(2, x); }, t: function (a) { return a === 0 ? "2<sup>x</sup>" : "2<sup>" + inner(a) + "</sup>"; }, nm: "y = 2<sup>x</sup>" }
  };
  function shiftF(fam, a, b, k) { k = k || 1; var F = FAM[fam]; return function (x) { return k * F.f(x - a) + b; }; }
  function shiftT(fam, a, b, k) { return "y = " + coef(k || 1, FAM[fam].t(a)) + tail(b); }

  /* =========================================================
   * gf1 — Chiziqli funksiya grafigi
   * ========================================================= */
  function gf1(L) {
    var v = view(6, 6), k, b, kinds = L === 1 ? ["form", "oy", "ox", "form"] : L === 2 ? ["slope", "pick", "ox", "form", "pick"] : ["cross", "pos", "pick", "slope"];
    var t = pick(kinds);
    if (t === "slope") { // kasr burchak koeffitsiyent
      var q = pick([2, 3]), p = RNZ(-3, 3); if (Math.abs(p) % q === 0) p = p > 0 ? p + 1 : p - 1;
      b = R(-3, 3); k = p / q;
      var pts = [[0, b, ""], [q, b + p, ""]];
      return Q("Grafikdagi to'g'ri chiziqning burchak koeffitsiyenti <b>k</b> ni toping.", H.fr(p, q), [H.fr(q, p), H.fr(-p, q), String(p), H.fr(p, q + 1)],
        ["Belgilangan nuqtalar: (0; " + m(b) + ") va (" + q + "; " + m(b + p) + ").", "k = Δy / Δx = " + m(p) + " / " + q + " = " + H.fr(p, q)],
        spec(v, [curve(function (x) { return k * x + b; }, v)], { pt: pts }));
    }
    if (t === "cross") { // ikki to'g'ri chiziq kesishishi
      var x0 = R(-3, 3), y0 = R(-3, 3), k1 = RNZ(-2, 2), k2; do { k2 = RNZ(-3, 3); } while (k2 === k1);
      var b1 = y0 - k1 * x0, b2 = y0 - k2 * x0;
      var ans = "(" + m(x0) + "; " + m(y0) + ")";
      return Q("Grafikdagi ikki to'g'ri chiziq qaysi nuqtada kesishadi?", ans, ["(" + m(y0) + "; " + m(x0) + ")", "(" + m(-x0) + "; " + m(y0) + ")", "(" + m(x0) + "; " + m(-y0) + ")", "(" + m(x0 + 1) + "; " + m(y0) + ")", "(" + m(x0) + "; " + m(y0 + 2) + ")", "(" + m(x0 - 1) + "; " + m(y0 - 1) + ")"],
        [lin(k1, b1) + " va " + lin(k2, b2) + ".", "Kesishish nuqtasi — ikkala grafikda ham bor nuqta: " + ans],
        spec(v, [curve(function (x) { return k1 * x + b1; }, v), curve(function (x) { return k2 * x + b2; }, v)]));
    }
    k = RNZ(-3, 3); b = R(-4, 4);
    if (t === "ox") { var r0 = RNZ(-4, 4); k = RNZ(-2, 2); b = -k * r0; }
    var f = function (x) { return k * x + b; }, g = spec(v, [curve(f, v)]);
    if (t === "form") {
      var wr = [lin(-k, b), lin(k, -b), lin(k + (k > 0 ? 1 : -1), b), lin(b || 1, k), lin(-k, -b)];
      return Q("Grafikda qaysi funksiya tasvirlangan?", lin(k, b), wr, ["Oy o'qi bilan kesishish: (0; " + m(b) + ") → b = " + m(b) + ".", "x 1 ga ortganda y " + m(k) + " ga o'zgaradi → k = " + m(k) + "."], g);
    }
    if (t === "oy") return Q("Grafikdagi to'g'ri chiziq Oy o'qini qaysi nuqtada kesadi?", "(0; " + m(b) + ")", ["(" + m(b) + "; 0)", "(0; " + m(-b) + ")", "(0; " + m(b + 1) + ")", "(0; " + m(k) + ")", "(0; " + m(b - 1) + ")", "(" + m(k) + "; " + m(b) + ")"], ["Oy o'qida x = 0, grafikdan y = " + m(b) + "."], g);
    if (t === "ox") { var xr = -b / k; return Q("Grafikdagi to'g'ri chiziq Ox o'qini qaysi nuqtada kesadi?", "(" + m(xr) + "; 0)", ["(0; " + m(xr) + ")", "(" + m(-xr) + "; 0)", "(" + m(xr + 1) + "; 0)", "(0; " + m(b) + ")", "(" + m(xr - 1) + "; 0)"], ["Ox o'qida y = 0: grafik x = " + m(xr) + " da kesib o'tadi."], g); }
    if (t === "pos") { var xz = R(-3, 3); k = RNZ(-2, 2); b = -k * xz; var up = k > 0;
      var A = up ? "(" + m(xz) + "; +∞)" : "(−∞; " + m(xz) + ")", B = up ? "(−∞; " + m(xz) + ")" : "(" + m(xz) + "; +∞)";
      return Q("Grafikka qarab <b>y > 0</b> bo'lgan oraliqni toping.", A, [B, "(" + m(xz) + "; " + m(xz + 3) + ")", "(−∞; +∞)", up ? "[" + m(xz) + "; +∞)" : "(−∞; " + m(xz) + "]"],
        ["Grafik x = " + m(xz) + " da Ox ni kesadi va " + (up ? "o'ngda" : "chapda") + " Ox dan yuqorida.", "Qat'iy tengsizlik — oxiri kirmaydi."], spec(v, [curve(function (x) { return k * x + b; }, v)])); }
    // pick: formula berilgan, grafiklardan tanlash
    var forms = [[k, b], [-k, b], [k, -b], [k === 1 || k === -1 ? 2 * k : (k > 0 ? 1 : -1), b]];
    if (b === 0) forms[2] = [k, k > 0 ? -2 : 2];
    var gs = {}, labels = [];
    forms.forEach(function (fb) { var L0 = lin(fb[0], fb[1]); if (gs[L0]) return; labels.push(L0); gs[L0] = spec(v, [curve(function (x) { return fb[0] * x + fb[1]; }, v)]); });
    return Q("<b>" + lin(k, b) + "</b> funksiyaning grafigi qaysi?", labels[0], labels.slice(1), ["b = " + m(b) + " — Oy o'qini (0; " + m(b) + ") da kesadi; k = " + m(k) + (k > 0 ? " > 0 — o'suvchi." : " < 0 — kamayuvchi.")], null, gs);
  }

  /* =========================================================
   * gf2 — Kvadrat funksiya (parabola)
   * ========================================================= */
  function gf2(L) {
    var v = view(6, 7), kinds = L === 1 ? ["vert", "dir", "axis", "vert"] : L === 2 ? ["roots", "pick", "vert", "min"] : ["form", "neg", "pick", "roots"];
    var t = pick(kinds), a, mm, n;
    if (t === "roots" || t === "form" || t === "neg") {
      var r1 = R(-4, 2), r2 = r1 + pick([2, 4, 6]); if (r2 > 5) { r1 -= 2; r2 -= 2; }
      a = L === 3 && t !== "neg" ? pick([1, -1]) : (t === "neg" ? 1 : pick([1, -1]));
      var f = function (x) { return a * (x - r1) * (x - r2); }, g = spec(v, [curve(f, v)]);
      var B = -a * (r1 + r2), C = a * r1 * r2;
      if (t === "roots") return Q("Grafikka qarab <b>y = 0</b> tenglamaning ildizlarini toping.", m(r1) + "; " + m(r2), [m(-r1) + "; " + m(-r2), m(r1) + "; " + m(r2 + 1), m((r1 + r2) / 2) + "; " + m(C), "ildizi yo'q"], ["Parabola Ox o'qini x = " + m(r1) + " va x = " + m(r2) + " nuqtalarda kesadi."], g);
      if (t === "neg") return Q("Grafikka qarab <b>y < 0</b> bo'lgan oraliqni toping.", "(" + m(r1) + "; " + m(r2) + ")", ["(−∞; " + m(r1) + ") ∪ (" + m(r2) + "; +∞)", "[" + m(r1) + "; " + m(r2) + "]", "(" + m(r1) + "; +∞)", "(−∞; " + m(r2) + ")"], ["Ildizlar orasida parabola Ox dan pastda.", "Qat'iy tengsizlik — ildizlar kirmaydi."], g);
      var ans = "y = " + H.poly([a, B, C]);
      return Q("Grafikda qaysi kvadrat funksiya tasvirlangan?", ans, ["y = " + H.poly([a, -B, C]), "y = " + H.poly([-a, B, C]), "y = " + H.poly([a, B, -C]), "y = " + H.poly([a, -B, -C]), "y = " + H.poly([-a, -B, -C]), "y = " + H.poly([a, B + 2 * a, C]), "y = " + H.poly([a, B, C + 2 * a])],
        ["Ildizlar: " + m(r1) + " va " + m(r2) + "; shoxlari " + (a > 0 ? "yuqoriga → a = 1." : "pastga → a = −1."), "y = " + (a < 0 ? "−" : "") + "(" + inner(r1) + ")(" + inner(r2) + ") = " + H.poly([a, B, C])], g);
    }
    a = L === 1 ? pick([1, -1]) : pick([1, -1, 1, -1, 2, -2]); mm = R(-3, 3); n = a > 0 ? R(-5, 2) : R(-2, 5);
    var fq = shiftF("sq", mm, n, a), gq = spec(v, [curve(fq, v)], { pt: [[mm, n, ""]] });
    var ft = shiftT("sq", mm, n, a);
    if (t === "vert") return Q("Grafikdagi parabolaning uchi qaysi nuqtada?", "(" + m(mm) + "; " + m(n) + ")", ["(" + m(-mm) + "; " + m(n) + ")", "(" + m(mm) + "; " + m(-n) + ")", "(" + m(n) + "; " + m(mm) + ")", "(" + m(mm) + "; " + m(n + 1) + ")", "(" + m(mm + 1) + "; " + m(n) + ")", "(" + m(mm - 1) + "; " + m(n - 1) + ")"], ["Uch — parabolaning eng " + (a > 0 ? "past" : "baland") + " nuqtasi: (" + m(mm) + "; " + m(n) + ")."], gq);
    if (t === "axis") return Q("Grafikdagi parabolaning simmetriya o'qi qaysi?", "x = " + m(mm), ["x = " + m(-mm), "y = " + m(mm), "x = " + m(n), "y = " + m(n), "x = " + m(mm + 1), "x = " + m(mm - 2)], ["Simmetriya o'qi uchidan o'tadi: x = " + m(mm) + "."], gq);
    if (t === "dir") return Q("Grafikdagi parabola uchun to'g'ri tasdiqni tanlang.", a > 0 ? "a > 0, eng kichik qiymati " + m(n) : "a < 0, eng katta qiymati " + m(n),
      a > 0 ? ["a < 0, eng katta qiymati " + m(n), "a > 0, eng kichik qiymati " + m(mm), "a < 0, eng kichik qiymati " + m(n), "a > 0, eng katta qiymati " + m(n), "a > 0, eng kichik qiymati " + m(n + 1)] : ["a > 0, eng kichik qiymati " + m(n), "a < 0, eng katta qiymati " + m(mm), "a > 0, eng katta qiymati " + m(n), "a < 0, eng kichik qiymati " + m(n), "a < 0, eng katta qiymati " + m(n - 1)],
      ["Shoxlari " + (a > 0 ? "yuqoriga → a > 0, uchi — eng kichik qiymat." : "pastga → a < 0, uchi — eng katta qiymat.")], gq);
    if (t === "min") return Q("Grafikdagi funksiyaning " + (a > 0 ? "eng kichik" : "eng katta") + " qiymati nechaga teng?", m(n), [m(mm), m(-n), m(n + (a > 0 ? -1 : 1)), "mavjud emas"], ["Parabola uchining ordinatasi: y = " + m(n) + "."], gq);
    // pick — formulaga mos grafikni tanlash
    var vars = [[mm, n, a], [-mm, n, a], [mm, -n, a], [mm, n, -a], [n, mm, a], [mm + 1, n, a], [mm, n + 2, a], [mm - 2, n - 1, a]], gs = {}, labels = [];
    vars.forEach(function (z) { if (labels.length >= 4) return; if (Math.abs(z[0]) > 4 || Math.abs(z[1]) > 6) return; var T = shiftT("sq", z[0], z[1], z[2]); if (gs[T]) return; labels.push(T); gs[T] = spec(v, [curve(shiftF("sq", z[0], z[1], z[2]), v)]); });
    if (labels.length < 4) return gf2(L);
    return Q("<b>" + ft + "</b> funksiyaning grafigi qaysi?", labels[0], labels.slice(1), ["Uchi (" + m(mm) + "; " + m(n) + "), shoxlari " + (a > 0 ? "yuqoriga." : "pastga.")], null, gs);
  }

  /* =========================================================
   * gf3 — Funksiya grafigini tanib olish
   * ========================================================= */
  var BASIC = [
    ["y = x", function (x) { return x; }], ["y = x²", function (x) { return x * x; }], ["y = x³", function (x) { return x * x * x; }],
    ["y = √x", FAM.sqrt.f], ["y = |x|", Math.abs], ["y = 1/x", FAM.inv.f], ["y = 2<sup>x</sup>", FAM.exp.f],
    ["y = (1/2)<sup>x</sup>", function (x) { return Math.pow(0.5, x); }], ["y = log₂x", function (x) { return x <= 0 ? NaN : Math.log(x) / Math.LN2; }],
    ["y = −x²", function (x) { return -x * x; }], ["y = −x", function (x) { return -x; }], ["y = 3", function () { return 3; }]
  ];
  var EASY = [["y = x + 2", function (x) { return x + 2; }], ["y = 3x", function (x) { return 3 * x; }], ["y = x² − 3", function (x) { return x * x - 3; }], ["y = |x| + 1", function (x) { return Math.abs(x) + 1; }],
    ["y = −|x|", function (x) { return -Math.abs(x); }], ["y = −x + 3", function (x) { return 3 - x; }], ["y = x² + 2", function (x) { return x * x + 2; }], ["y = |x| − 2", function (x) { return Math.abs(x) - 2; }], ["y = −2", function () { return -2; }], ["y = x − 1", function (x) { return x - 1; }]];
  function gf3(L) {
    var v = view(5, 5);
    if (L === 3) { // siljitilgan grafikni tanib olish
      var fam = pick(["sq", "abs", "sqrt", "inv", "exp"]), a = RNZ(-3, 3), b = RNZ(-3, 3);
      if (fam === "exp") { a = 0; b = RNZ(-3, 1); }
      var T = shiftT(fam, a, b), g = spec(v, [curve(shiftF(fam, a, b), v, { n: fam === "inv" ? 200 : 120 })]);
      var w = [shiftT(fam, -a, b), shiftT(fam, a, -b), shiftT(fam, -a, -b), shiftT(fam, b, a)];
      if (fam === "exp") w = [shiftT(fam, 0, -b), "y = 2<sup>x + " + Math.abs(b) + "</sup>", shiftT("sq", 0, b), "y = (1/2)<sup>x</sup>" + tail(b)];
      return Q("Grafikda qaysi funksiya tasvirlangan?", T, w, [FAM[fam].nm + " grafigi " + (a ? (a > 0 ? "o'ngga " : "chapga ") + Math.abs(a) + " birlik" : "") + (a && b ? " va " : "") + (b ? (b > 0 ? "yuqoriga " : "pastga ") + Math.abs(b) + " birlik" : "") + " surilgan."], g);
    }
    var pool = L === 1 ? BASIC.slice(0, 8).concat([BASIC[9]], EASY) : BASIC.concat(EASY), it = pick(pool);
    var others = shuffle(pool.filter(function (z) { return z !== it; })).slice(0, 4);
    if (L <= 2 && Math.random() < 0.45) { // formula -> grafik
      var gs = {}, labels = [it[0]].concat(others.slice(0, 3).map(function (z) { return z[0]; }));
      [it].concat(others.slice(0, 3)).forEach(function (z) { gs[z[0]] = spec(v, [curve(z[1], v, { n: 160 })]); });
      return Q("<b>" + it[0] + "</b> funksiyaning grafigi qaysi?", labels[0], labels.slice(1), [it[0] + " — " + hint(it[0])], null, gs);
    }
    return Q("Grafikda qaysi funksiya tasvirlangan?", it[0], others.map(function (z) { return z[0]; }), [it[0] + " — " + hint(it[0])], spec(v, [curve(it[1], v, { n: 160 })]));
  }
  function hint(nm) {
    return ({ "y = x": "koordinatalar boshidan o'tuvchi o'suvchi to'g'ri chiziq.", "y = x²": "uchi (0; 0) da, shoxlari yuqoriga parabola.", "y = x³": "kubik parabola: chapda pastda, o'ngda yuqorida.",
      "y = √x": "faqat x ≥ 0 da, (0; 0) dan o'ngga sekin o'sadi.", "y = |x|": "«V» shakli, uchi (0; 0).", "y = 1/x": "giperbola: I va III choraklarda, o'qlarga yaqinlashadi.",
      "y = 2<sup>x</sup>": "(0; 1) dan o'tadi, o'suvchi, Ox ga chapda yaqinlashadi.", "y = (1/2)<sup>x</sup>": "(0; 1) dan o'tadi, kamayuvchi.", "y = log₂x": "(1; 0) dan o'tadi, faqat x > 0.",
      "y = −x²": "uchi (0; 0), shoxlari pastga.", "y = −x": "kamayuvchi to'g'ri chiziq, (0; 0) dan o'tadi.", "y = 3": "Ox ga parallel to'g'ri chiziq." })[nm] || "";
  }

  /* =========================================================
   * gf4 — Grafikdan qiymat o'qish (siniq chiziq)
   * ========================================================= */
  function polyline(L) {
    var xs = [-6], x = -6; while (x < 6) { x += pick(L === 1 ? [2, 3] : [1, 2, 2, 3]); xs.push(Math.min(x, 6)); }
    var ys = xs.map(function () { return R(-4, 4); });
    for (var i = 1; i < ys.length; i++) if (ys[i] === ys[i - 1]) ys[i] += ys[i] < 4 ? 1 : -1;
    return xs.map(function (x0, j) { return [x0, ys[j]]; });
  }
  function valAt(P, x) { for (var i = 1; i < P.length; i++) if (x <= P[i][0]) { var a = P[i - 1], b = P[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return P[P.length - 1][1]; }
  function rootsOf(P, k) { // f(x) = k yechimlari soni (k uchlardagi qiymatlarga teng emas)
    var c = 0; for (var i = 1; i < P.length; i++) if ((P[i - 1][1] - k) * (P[i][1] - k) < 0) c++; return c;
  }
  function gf4(L) {
    var P = polyline(L), v = [-6, 6, -6, 6], g = spec(v, [{ p: P.map(function (z) { return [z[0], z[1]]; }) }]);
    var kinds = L === 1 ? ["val", "max", "min", "val"] : L === 2 ? ["val", "eq", "max", "sum"] : ["eq", "sum", "where", "eq"], t = pick(kinds);
    var Y = P.map(function (z) { return z[1]; }), mx = Math.max.apply(null, Y), mn = Math.min.apply(null, Y);
    if (t === "val" || t === "sum") {
      var inner2 = P.slice(1, -1), A = pick(inner2.length ? inner2 : P), Bp = pick(P.filter(function (z) { return z !== A; }));
      if (t === "val") return Q("Grafikka qarab <b>f(" + m(A[0]) + ")</b> ni toping.", m(A[1]), [m(-A[1]), m(A[0]), m(A[1] + 1), m(A[1] - 1)], ["x = " + m(A[0]) + " dan yuqoriga/pastga qarab grafikdagi nuqtani topamiz: y = " + m(A[1]) + "."], g);
      var s = A[1] + Bp[1];
      return Q("Grafikka qarab <b>f(" + m(A[0]) + ") + f(" + m(Bp[0]) + ")</b> ni toping.", m(s), [m(s + 1), m(s - 1), m(A[1] - Bp[1]), m(A[0] + Bp[0]), m(s + 2), m(s - 2)], ["f(" + m(A[0]) + ") = " + m(A[1]) + ", f(" + m(Bp[0]) + ") = " + m(Bp[1]) + " → " + m(s)], g);
    }
    if (t === "max") return Q("Grafikdagi funksiyaning [−6; 6] dagi eng katta qiymati nechaga teng?", m(mx), [m(mn), m(mx - 1), m(mx + 1), "6"], ["Eng baland nuqta: y = " + m(mx) + "."], g);
    if (t === "min") return Q("Grafikdagi funksiyaning [−6; 6] dagi eng kichik qiymati nechaga teng?", m(mn), [m(mx), m(mn + 1), m(mn - 1), "−6"], ["Eng past nuqta: y = " + m(mn) + "."], g);
    if (t === "where") { // f(x) = c bitta yechimli
      var cand = P.filter(function (z) { var cnt = 0; for (var i = 1; i < P.length; i++) if ((P[i - 1][1] - z[1]) * (P[i][1] - z[1]) < 0) cnt++; return cnt === 0 && Y.filter(function (y) { return y === z[1]; }).length === 1; });
      if (!cand.length) return gf4(L);
      var Z = pick(cand);
      return Q("Grafikka qarab <b>f(x) = " + m(Z[1]) + "</b> tenglamaning yechimini toping.", "x = " + m(Z[0]), ["x = " + m(Z[1]), "x = " + m(-Z[0]), "x = " + m(Z[0] + 1), "yechimi yo'q", "x = " + m(Z[0] - 2), "x = " + m(Z[0] + 3)], ["y = " + m(Z[1]) + " gorizontal chiziq grafikni faqat x = " + m(Z[0]) + " da uchratadi."], g);
    }
    var ks = [], k; for (k = -3.5; k <= 3.5; k += 1) ks.push(k);
    var kk = pick(ks.filter(function (x) { return rootsOf(P, x) > 0; }).concat([0.5, -0.5]));
    var c = rootsOf(P, kk);
    return Q("Grafikka qarab <b>f(x) = " + m(kk) + "</b> tenglama nechta yechimga ega ekanini toping.", String(c), [String(c + 1), String(Math.max(0, c - 1) === c ? c + 2 : Math.max(0, c - 1)), String(c + 2), "cheksiz ko'p"], ["y = " + m(kk) + " to'g'ri chizig'i grafikni " + c + " ta nuqtada kesadi."], spec(v, [g.c[0], { p: [[-6, kk], [6, kk]], d: 1 }]));
  }

  /* =========================================================
   * gf5 — Grafik almashtirishlar (siljitish, akslantirish)
   * ========================================================= */
  function gf5(L) {
    var v = view(6, 6), fam = pick(L === 1 ? ["sq", "abs"] : ["sq", "abs", "sqrt", "cube"]), a = L === 1 ? (Math.random() < 0.5 ? RNZ(-3, 3) : 0) : RNZ(-3, 3), b = L === 1 && a ? 0 : RNZ(-3, 3), k = 1;
    if (L === 3 && fam !== "cube" && Math.random() < 0.5) k = -1;
    var base = curve(FAM[fam].f, v, { d: 1 }), g = spec(v, [base, curve(shiftF(fam, a, b, k), v)]);
    var T = shiftT(fam, a, b, k);
    if (Math.random() < 0.5 || L === 3) {
      return Q("Uzuq chiziq — <b>" + FAM[fam].nm + "</b>. Yaxlit chiziq qaysi funksiyaning grafigi?", T, [shiftT(fam, -a, b, k), shiftT(fam, a, -b, k), shiftT(fam, -a, -b, k), shiftT(fam, a, b, -k), shiftT(fam, b, a, k), shiftT(fam, a + (a >= 0 ? 1 : -1), b, k), shiftT(fam, a, b + (b >= 0 ? 1 : -1), k)],
        [(a ? "x − (" + m(a) + ") → " + (a > 0 ? "o'ngga " : "chapga ") + Math.abs(a) + " birlik. " : "") + (b ? (b > 0 ? "+" : "") + m(b) + " → " + (b > 0 ? "yuqoriga " : "pastga ") + Math.abs(b) + " birlik." : "") + (k < 0 ? " Minus — Ox ga nisbatan akslantirish." : "")], g);
    }
    function desc(a0, b0) { var s = []; if (a0) s.push((a0 > 0 ? "o'ngga " : "chapga ") + Math.abs(a0)); if (b0) s.push((b0 > 0 ? "yuqoriga " : "pastga ") + Math.abs(b0)); return s.join(", ") + " birlik"; }
    return Q("Uzuq chiziq — <b>" + FAM[fam].nm + "</b>. Yaxlit chiziq qanday surilgan?", desc(a, b), [desc(-a, b), desc(a, -b), desc(-a, -b), desc(b, a), desc(a + (a >= 0 ? 1 : -1), b), desc(a, b + (b >= 0 ? 1 : -1))].filter(function (s) { return s !== " birlik"; }),
      [T + ": f(x − a) + b — a > 0 o'ngga, b > 0 yuqoriga."], g);
  }

  /* =========================================================
   * gf6 — Ustunli diagramma
   * ========================================================= */
  var DSETS = [
    ["Hafta kunlari bo'yicha kutubxonaga kelgan o'quvchilar", ["Du", "Se", "Ch", "Pa", "Ju"]],
    ["Sinfdagi baholar soni", ["«5»", "«4»", "«3»", "«2»"]],
    ["Do'konda sotilgan mevalar (kg)", ["Olma", "Nok", "Uzum", "Anor", "Shaftoli"]],
    ["Guruhlar bo'yicha to'plangan makulatura (kg)", ["05-26", "06-26", "07-26", "08-26"]],
    ["Oylar bo'yicha yog'ingarchilik kunlari", ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"]],
    ["To'garaklarga yozilgan o'quvchilar", ["Shaxmat", "Futbol", "Robot", "Rasm", "Musiqa"]]
  ];
  function gf6(L) {
    var ds = pick(DSETS), n = ds[1].length, step = L === 1 ? 1 : pick([2, 5]), vals = [], i;
    for (i = 0; i < n; i++) vals.push(R(1, L === 1 ? 9 : 10) * step);
    var t = pick(L === 1 ? ["max", "val", "diff"] : L === 2 ? ["sum", "diff", "avg", "max"] : ["avg", "pct", "sum", "diff2"]);
    if (t === "avg") { var s0 = vals.reduce(function (a, b) { return a + b; }, 0), rem = s0 % n; vals[n - 1] += rem ? n - rem : 0; if (vals[n - 1] > 10 * step + step) vals[n - 1] -= n; }
    if (t === "pct") { // jami 100 yoki 50 ga keltiramiz
      var tot = n >= 5 ? pick([100, 200]) : pick([50, 100, 200]); vals = []; var left = tot;
      for (i = 0; i < n - 1; i++) { var vv = Math.max(1, Math.round(tot / n / 5) * 5 + pick([-5, 0, 5])); vals.push(vv); left -= vv; }
      if (left <= 0) return gf6(L); vals.push(left);
    }
    var mx = Math.max.apply(null, vals), top = Math.ceil(mx * 1.15 / step) * step || 10;
    var g = { v: [0, n, 0, top], c: [], b: { l: ds[1], v: vals }, gy: top <= 12 ? 1 : top <= 30 ? 5 : top <= 120 ? 10 : 20, ax: ["", ""] };
    var title = ds[0] + ".<br>", sum = vals.reduce(function (a, b) { return a + b; }, 0);
    var iMax = vals.indexOf(mx);
    if (t === "max") { if (vals.filter(function (x) { return x === mx; }).length > 1) { vals[iMax] += step; mx = vals[iMax]; g.v[3] = Math.ceil(mx * 1.15 / step) * step; }
      return Q(title + "Qaysi ustun eng baland?", ds[1][iMax], ds[1].filter(function (x, j) { return j !== iMax; }), [ds[1][iMax] + ": " + mx + "."], g); }
    if (t === "val") { var j = R(0, n - 1); return Q(title + "<b>" + ds[1][j] + "</b> ustuni qiymati nechaga teng?", vals[j], [vals[j] + step, vals[j] - step || vals[j] + 2 * step, vals[(j + 1) % n] === vals[j] ? vals[j] + 3 * step : vals[(j + 1) % n], mx, vals[j] + 2 * step, vals[j] + 3 * step], ["Ustun uchidan Oy o'qiga qaraymiz: " + vals[j] + "."], g); }
    if (t === "sum") return Q(title + "Barcha ustunlar qiymatlari yig'indisi nechaga teng?", sum, [sum + step, sum - step, sum + 2 * step, mx * n], [vals.join(" + ") + " = " + sum], g);
    if (t === "avg") { var av = sum / n; return Q(title + "Qiymatlarning o'rta arifmetigi nechaga teng?", m(av), [m(av + 1), m(av - 1), m(sum), m((mx + Math.min.apply(null, vals)) / 2) === m(av) ? m(av + 2) : m((mx + Math.min.apply(null, vals)) / 2)], ["(" + vals.join(" + ") + ") : " + n + " = " + sum + " : " + n + " = " + m(av)], g); }
    if (t === "pct") { var jp = R(0, n - 1), pc = Math.round(vals[jp] / sum * 1000) / 10; return Q(title + "<b>" + ds[1][jp] + "</b> jami qiymatning necha foizini tashkil etadi?", m(pc) + "%", [m(pc * 2) + "%", m(vals[jp]) + "%", m(Math.round(100 / n * 10) / 10) + "%", m(pc + 10) + "%", m(Math.max(1, pc - 5)) + "%", m(pc + 5) + "%"], ["Jami: " + sum + ". " + vals[jp] + " : " + sum + " · 100% = " + m(pc) + "%"], g); }
    var a1 = R(0, n - 1), a2; do { a2 = R(0, n - 1); } while (a2 === a1 || vals[a2] === vals[a1]);
    var d = Math.abs(vals[a1] - vals[a2]);
    if (t === "diff") return Q(title + "<b>" + ds[1][a1] + "</b> va <b>" + ds[1][a2] + "</b> ustunlari farqi nechaga teng?", d, [d + step, Math.max(step, d - step) === d ? d + 2 * step : Math.max(step, d - step), vals[a1] + vals[a2], Math.max(vals[a1], vals[a2]), d + 3 * step], ["|" + vals[a1] + " − " + vals[a2] + "| = " + d], g);
    var rr = vals[a1] / vals[a2];
    if (Math.abs(rr - Math.round(rr)) > 1e-9 || rr < 2) { vals[a1] = vals[a2] * pick([2, 3]); g.b.v = vals; g.v[3] = Math.ceil(Math.max.apply(null, vals) * 1.15 / step) * step; rr = vals[a1] / vals[a2]; }
    return Q(title + "<b>" + ds[1][a1] + "</b> qiymati <b>" + ds[1][a2] + "</b> qiymatidan necha marta katta?", rr, [rr + 1, rr * 2, vals[a1] - vals[a2], rr - 1 || rr + 2], [vals[a1] + " : " + vals[a2] + " = " + rr], g);
  }

  /* =========================================================
   * gf7 — Fizika: harakat grafiklari
   * ========================================================= */
  function gf7(L) {
    var t = pick(L === 1 ? ["sv", "vs", "sv"] : L === 2 ? ["va", "vs", "rest", "sv"] : ["va", "area", "rest", "va"]), g;
    if (t === "sv") { // s(t) to'g'ri chiziq -> tezlik
      var vv = pick([2, 3, 4, 5, 6, 8, 10]), T = pick([4, 5, 6]);
      g = { v: [0, T + 1, 0, vv * (T + 1)], c: [{ p: [[0, 0], [T + 1, vv * (T + 1)]] }], ax: ["t, s", "s, m"], gx: 1, gy: vv, ly: vv * (T + 1) > 30 ? vv * 2 : vv, pt: [[T, vv * T, ""]] };
      return Q("Jismning yo'l grafigi s(t) berilgan. Jism tezligi necha m/s?", vv + " m/s", [vv * T + " m/s", (vv + 1) + " m/s", vv * 2 + " m/s", T + " m/s"], ["v = s / t = " + vv * T + " : " + T + " = " + vv + " m/s"], g);
    }
    if (t === "vs") { // v = const -> yo'l
      var v0 = pick([2, 3, 4, 5, 6]), T2 = pick([3, 4, 5, 6]);
      g = { v: [0, T2 + 2, 0, v0 + 3], c: [{ p: [[0, v0], [T2, v0]] }, { p: [[T2, v0], [T2, 0]], d: 1 }], ax: ["t, s", "v, m/s"] };
      return Q("Tezlik grafigi v(t) berilgan. Jism 0 dan " + T2 + " s gacha qancha yo'l bosgan?", v0 * T2 + " m", [(v0 + T2) + " m", v0 + " m", v0 * (T2 + 1) + " m", v0 * T2 * 2 + " m"], ["s = v · t = " + v0 + " · " + T2 + " = " + v0 * T2 + " m (to'rtburchak yuzasi)"], g);
    }
    if (t === "va" || t === "area") {
      var a0 = pick([1, 2, 3]), v1 = pick([0, 1, 2, 4]), T3 = pick([2, 3, 4, 5]), v2 = v1 + a0 * T3;
      g = { v: [0, T3 + 1, 0, v2 + 2], c: [{ p: [[0, v1], [T3, v2]] }], ax: ["t, s", "v, m/s"], gy: v2 + 2 > 14 ? 2 : 1, ly: v2 + 2 > 14 ? 4 : v2 + 2 > 8 ? 2 : 1, pt: [[0, v1, ""], [T3, v2, ""]] };
      if (t === "va") return Q("Tezlik grafigi v(t) berilgan. Jismning tezlanishi necha m/s²?", a0 + " m/s²", [(a0 + 1) + " m/s²", v2 + " m/s²", (v2 / T3 === a0 ? a0 * 2 : m(v2 / T3)) + " m/s²", T3 + " m/s²", (a0 + 2) + " m/s²", (v2 - v1) + " m/s²", (a0 + 3) + " m/s²", m(a0 / 2) + " m/s²"], ["a = (v − v₀) / t = (" + v2 + " − " + v1 + ") : " + T3 + " = " + a0 + " m/s²"], g);
      var sA = (v1 + v2) * T3 / 2;
      return Q("Tezlik grafigi v(t) berilgan. Jism " + T3 + " s da qancha yo'l bosgan?", m(sA) + " m", [m(v2 * T3) + " m", m(sA + T3) + " m", m(v2 * T3 / 2) === m(sA) ? m(sA * 2) + " m" : m(v2 * T3 / 2) + " m", m(v2) + " m", m(sA + 2) + " m", m(Math.max(1, sA - 2)) + " m", m(sA * 2) + " m", m(sA + 4) + " m"], ["Yo'l — grafik ostidagi trapetsiya yuzi: (" + v1 + " + " + v2 + ") : 2 · " + T3 + " = " + m(sA) + " m"], g);
    }
    // rest — jism qaysi oraliqda tinch turgan
    var t1 = pick([1, 2, 3]), d1 = pick([2, 3, 4]), t2 = t1 + pick([2, 3]), t3 = t2 + pick([1, 2]), s1 = t1 * d1, s3 = s1 + (t3 - t2) * pick([2, 3]);
    g = { v: [0, t3 + 1, 0, s3 + 2], c: [{ p: [[0, 0], [t1, s1], [t2, s1], [t3, s3]] }], ax: ["t, s", "s, m"], gy: s3 > 14 ? 2 : 1, ly: s3 > 14 ? 4 : 2 };
    var ans = t1 + " s dan " + t2 + " s gacha";
    return Q("Yo'l grafigi s(t) berilgan. Jism qaysi vaqt oralig'ida tinch turgan?", ans, ["0 s dan " + t1 + " s gacha", t2 + " s dan " + t3 + " s gacha", "hech qachon", "0 s dan " + t3 + " s gacha"], ["Gorizontal qism — yo'l o'zgarmagan, demak jism to'xtagan: " + ans + "."], g);
  }

  /* =========================================================
   * gf8 — Trigonometrik funksiyalar grafigi
   * ========================================================= */
  function piLab(q) { // q — π ning yarim ulushlari soni (x = q·π/2)
    if (q === 0) return "0";
    var neg = q < 0, a = Math.abs(q), s = a % 2 === 0 ? (a / 2 === 1 ? "π" : a / 2 + "π") : (a === 1 ? "π/2" : a + "π/2");
    return (neg ? "−" : "") + s;
  }
  function gf8(L) {
    var A = L === 1 ? pick([1, 2]) : pick([1, 2, 3]), k = L === 1 ? 1 : pick([1, 2, 0.5]), fn = pick(["sin", "cos"]), bb = pick(L === 1 ? [0, 0, 1, -1] : [0, 1, -1, 2]);
    var span = k === 0.5 ? 4 * Math.PI : 2 * Math.PI, v = [-span, span, -(A + 1) + Math.min(bb, 0), A + 1 + Math.max(bb, 0)];
    var f = fn === "sin" ? function (x) { return A * Math.sin(k * x) + bb; } : function (x) { return A * Math.cos(k * x) + bb; };
    var xt = [], st = k === 0.5 ? 4 : 2; for (var q = -Math.round(span / (Math.PI / 2)); q <= Math.round(span / (Math.PI / 2)); q += st) if (q) xt.push([r3(q * Math.PI / 2), piLab(q)]);
    var g = { v: v, c: [{ p: sample(f, v[0], v[1], 200, [v[2], v[3]]) }], xt: xt, gx: Math.PI / 2 * (k === 0.5 ? 2 : 1), gy: 1 };
    function nm(A0, k0, f0, b0) { var ks = k0 === 1 ? "x" : k0 === 2 ? "2x" : "x/2"; return "y = " + (A0 === 1 ? "" : A0) + f0 + " " + ks + tail(b0 || 0); }
    var T = nm(A, k, fn, bb), per = k === 1 ? "2π" : k === 2 ? "π" : "4π";
    var t = pick(L === 1 ? ["amp", "form"] : ["form", "per", "amp", "form"]);
    if (t === "amp") { var mxv = A + bb, ask = Math.random() < 0.5; return ask ? Q("Grafikdagi funksiyaning eng katta qiymati nechaga teng?", m(mxv), [m(mxv + 1), m(-A + bb), "π", m(2 * A), m(A)], ["Grafikning eng yuqori nuqtasi: y = " + m(mxv) + "."], g)
      : Q("Grafikdagi funksiyaning eng kichik qiymati nechaga teng?", m(-A + bb), [m(mxv), m(-A + bb - 1), m(-A), "0", m(-2 * A)], ["Grafikning eng past nuqtasi: y = " + m(-A + bb) + "."], g); }
    if (t === "per") return Q("Grafikdagi funksiyaning eng kichik musbat davri qancha?", per, ["2π", "π", "4π", "π/2"].filter(function (x) { return x !== per; }), ["Grafik har " + per + " da takrorlanadi (T = 2π / " + (k === 0.5 ? "½" : k) + ")."], g);
    var w = [nm(A, k, fn === "sin" ? "cos" : "sin", bb), nm(A === 1 ? 2 : 1, k, fn, bb), nm(A, k === 1 ? 2 : 1, fn, bb), nm(A, k, fn, -bb || 1), nm(A === 1 ? 2 : 1, k === 1 ? 2 : 1, fn === "sin" ? "cos" : "sin", bb)];
    return Q("Grafikda qaysi funksiya tasvirlangan?", T, w, [(fn === "sin" ? "x = 0 da y = 0 → sinus." : "x = 0 da eng katta qiymat → kosinus.") + " Amplituda " + A + ", davr " + per + (bb ? ", " + (bb > 0 ? "yuqoriga " : "pastga ") + Math.abs(bb) + " birlik surilgan" : "") + "."], g);
  }

  var T0 = "Grafiklar · ";
  S.register("gf1", gf1, T0 + "Chiziqli funksiya grafigi");
  S.register("gf2", gf2, T0 + "Kvadrat funksiya (parabola)");
  S.register("gf3", gf3, T0 + "Funksiya grafigini tanib olish");
  S.register("gf4", gf4, T0 + "Grafikdan qiymat o'qish");
  S.register("gf5", gf5, T0 + "Grafikni surish va akslantirish");
  S.register("gf6", gf6, T0 + "Ustunli diagramma");
  S.register("gf7", gf7, "Fizika · Harakat grafiklari (s(t), v(t))");
  S.register("gf8", gf8, T0 + "Trigonometrik funksiyalar grafigi");
})();
