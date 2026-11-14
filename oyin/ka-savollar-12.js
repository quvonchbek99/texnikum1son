/*! Kuvonch Academy — 99–102: SAT statistika va kompleks sonlar
 *  99 O'rtacha kvadratik chetlanish, tanlanma va xatolik chegarasi · 100 Diagrammalar (nuqtali, quti, gistogramma)
 *  101 Sochilma diagramma va eng yaxshi moslik chizig'i · 102 Kompleks sonlar
 *  Savollar SAT "Problem-Solving & Data Analysis" uslubida, har safar yangi sonlar bilan. */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle, nearW = H.nearW, G = {};
  function uniq(a) { var s = {}, o = []; a.forEach(function (x) { x = String(x); if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  function numQ(q, a, steps, hint, w) { var ws = (w || nearW(a, 4, Math.max(1, Math.round(Math.abs(a) * .25) || 1))).filter(function (x) { return x !== a && x >= 0; }); return { q: q, a: a, hint: hint || "son", w: ws.slice(0, 5), steps: steps }; }
  function txtQ(q, a, w, steps, hint) { return { q: q, a: a, hint: hint || "javob", type: "text", w: uniq(w).filter(function (x) { return x !== String(a); }).slice(0, 4), steps: steps }; }
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function mean(a) { return sum(a) / a.length; }
  function sd(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }
  function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; }
  function fmtSet(a) { return "{" + a.join("; ") + "}"; }
  var NOMLAR = ["o'quvchilar", "talabalar", "ishchilar", "mijozlar", "haydovchilar", "o'qituvchilar", "sportchilar", "sayyohlar"];
  var OBJ = ["kitob", "telefon", "daraxt", "mashina", "uy", "o'quvchi", "stol"];

  /* ---------- 99 O'rtacha kvadratik chetlanish, tanlanma, xatolik chegarasi ---------- */
  G.t99 = function (L) {
    var k = pick(lv(L, [0, 1, 2], [1, 3, 4, 5], [4, 6, 7]));
    if (k === 0) {
      // qaysi to'plamning standart og'ishi katta — tarqoqlik bo'yicha
      var c = R(10, 40), A = [c - 1, c, c, c, c + 1], B = [c - 9, c - 4, c, c + 3, c + 10];
      var swap = R(0, 1), X = swap ? B : A, Y = swap ? A : B, ans = swap ? "A" : "B";
      return txtQ("A = " + fmtSet(X) + " va B = " + fmtSet(Y) + " to'plamlarining o'rta qiymati teng. Qaysi to'plamning standart og'ishi katta?", ans, ["A", "B", "Teng", "Aniqlab bo'lmaydi"],
        ["Standart og'ish — qiymatlar o'rtachadan qanchalik tarqoqligi. " + (swap ? "A" : "B") + " to'plamda qiymatlar o'rtachadan uzoqroq → og'ish katta."], "A/B");
    }
    if (k === 1) {
      var N = pick([800, 1200, 1500, 2000, 2400, 3000]), n = pick([50, 100, 150, 200]), p = pick([20, 25, 30, 35, 40, 45, 60]);
      var est = N * p / 100;
      return numQ("Shahardagi " + N + " nafar " + pick(NOMLAR) + "dan tasodifiy " + n + " nafari so'rovda qatnashdi; ularning " + p + "% i \"ha\" dedi. Butun guruhda taxminan nechta kishi \"ha\" deydi?", est,
        ["Tasodifiy tanlanma natijasi butun guruhga ko'chiriladi: " + N + " · " + p + "% = " + est]);
    }
    if (k === 2) {
      var opts = [
        ["Maktabning barcha o'quvchilari ro'yxatidan tasodifiy 100 tasini tanlash", 1],
        ["Faqat sport to'garagidagi o'quvchilarni so'rash", 0],
        ["Ertalab birinchi kelgan 100 o'quvchini so'rash", 0],
        ["Ixtiyoriy javob beradiganlarni internetda so'rash", 0]
      ];
      return txtQ("Maktab o'quvchilarining o'rtacha uyqu vaqtini aniqlash uchun qaysi tanlanma usuli natijani butun maktabga ko'chirishga imkon beradi?", opts[0][0], opts.slice(1).map(function (o) { return o[0]; }),
        ["Faqat tasodifiy tanlanma (hamma o'quvchida teng imkoniyat) butun maktab haqida xulosa qilishga asos beradi. Qolganlari — noxolis (biased) tanlanma."]);
    }
    if (k === 3) {
      var pc = R(30, 70), me = pick([2, 3, 4, 5]);
      var lo = pc - me, hi = pc + me;
      return txtQ("So'rov natijasi: " + pc + "% ± " + me + "% (xatolik chegarasi). Haqiqiy foiz qaysi oraliqda bo'lishi kutiladi?", lo + "% – " + hi + "%",
        [(pc - 2 * me) + "% – " + (pc + 2 * me) + "%", pc + "% – " + (pc + me) + "%", (pc - me) + "% – " + pc + "%"],
        ["Oraliq = natija ∓ xatolik chegarasi: " + pc + " − " + me + " = " + lo + ", " + pc + " + " + me + " = " + hi], "oraliq");
    }
    if (k === 4) {
      var n1 = pick([50, 100, 200]), n2 = n1 * pick([4, 9, 16]);
      return txtQ("Ikki so'rov o'tkazildi: birinchisida " + n1 + " kishi, ikkinchisida " + n2 + " kishi (ikkalasi ham tasodifiy). Qaysi so'rovning xatolik chegarasi kichikroq?", "Ikkinchi (" + n2 + " kishi)",
        ["Birinchi (" + n1 + " kishi)", "Teng", "Aniqlab bo'lmaydi"],
        ["Tanlanma qancha katta bo'lsa, xatolik chegarasi shuncha kichik bo'ladi (≈ 1/√n)."]);
    }
    if (k === 5) {
      var m0 = R(20, 60), d = pick([1, 2, 3, 5]), set = shuffle([m0 - d, m0 - d, m0 + d, m0 + d]);
      return numQ(fmtSet(set) + " to'plamning standart og'ishini toping.", d,
        ["O'rtacha = " + m0 + ". Har qiymat o'rtachadan " + d + " ga farq qiladi → og'ishlar kvadrati " + d * d + ", o'rtachasi " + d * d + ", ildizi " + d + "."], "son", [d + 1, d + 2, 2 * d, d * d].filter(function (x) { return x !== d; }));
    }
    if (k === 6) {
      var base = R(10, 50), add = pick([5, 10, 20]);
      var setA = [base, base + 2, base + 4, base + 6, base + 8], setB = setA.map(function (x) { return x + add; });
      return txtQ("B to'plam A to'plamning har bir qiymatiga " + add + " qo'shib hosil qilingan: A = " + fmtSet(setA) + ", B = " + fmtSet(setB) + ". Qaysi tasdiq to'g'ri?",
        "O'rtachalar " + add + " ga farq qiladi, standart og'ishlar teng",
        ["O'rtachalar teng, standart og'ishlar " + add + " ga farq qiladi", "Ikkalasi ham " + add + " ga farq qiladi", "Ikkalasi ham teng"],
        ["Hamma qiymatga bir xil son qo'shilsa, o'rtacha shu songa siljiydi, tarqoqlik (standart og'ish) o'zgarmaydi."]);
    }
    var tot = pick([2000, 5000, 10000]), pr = R(20, 60), m = pick([2, 3, 4]);
    var lo2 = tot * (pr - m) / 100, hi2 = tot * (pr + m) / 100;
    return txtQ(tot + " kishilik shaharda tasodifiy so'rov: " + pr + "% ± " + m + "% kishi velosiped haydaydi. Velosiped haydaydiganlar soni qaysi oraliqda bo'lishi kutiladi?", lo2 + " – " + hi2,
      [(tot * pr / 100) + " – " + hi2, (tot * (pr - 2 * m) / 100) + " – " + (tot * (pr + 2 * m) / 100), lo2 + " – " + (tot * pr / 100)],
      ["Foiz oralig'i " + (pr - m) + "%–" + (pr + m) + "%. " + tot + " ning " + (pr - m) + "% = " + lo2 + ", " + (pr + m) + "% = " + hi2], "oraliq");
  };

  /* ---------- 100 Diagrammalar: nuqtali, quti diagrammasi, gistogramma (matn bilan tasvirlangan) ---------- */
  function dotPlot() { var vals = [], desc = [], start = R(1, 5); for (var v = start; v < start + 5; v++) { var c = R(0, 5); if (c) { desc.push(v + " → " + c + " ta"); for (var j = 0; j < c; j++) vals.push(v); } } if (vals.length < 3) return dotPlot(); return { vals: vals, desc: desc.join(", ") }; }
  G.t100 = function (L) {
    var k = pick(lv(L, [0, 1, 2], [2, 3, 4, 5], [5, 6, 7]));
    if (k === 0) { var d = dotPlot(); return numQ("Nuqtali diagrammada qiymatlar: " + d.desc + ". Ma'lumotlar nechta?", d.vals.length, ["Nuqtalar sonini qo'shamiz: " + d.vals.length]); }
    if (k === 1) {
      var d1 = dotPlot(), cnt = {}; d1.vals.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
      var best = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; });
      if (cnt[best[0]] === cnt[best[1]]) return G.t100(L);
      return numQ("Nuqtali diagrammada qiymatlar: " + d1.desc + ". Moda (eng ko'p uchraydigan qiymat)?", +best[0], ["Eng ko'p nuqta " + best[0] + " ustida (" + cnt[best[0]] + " ta)."]);
    }
    if (k === 2) { var d2 = dotPlot(), med = median(d2.vals); if (med !== Math.floor(med)) return G.t100(L); return numQ("Nuqtali diagrammada qiymatlar: " + d2.desc + ". Mediana?", med, ["Jami " + d2.vals.length + " ta qiymat, tartiblab o'rtadagisini olamiz: " + med]); }
    // quti (box) diagrammasi
    var mn = R(2, 10), q1 = mn + R(2, 6), me = q1 + R(2, 6), q3 = me + R(2, 6), mx = q3 + R(2, 8);
    var box = "Quti diagrammasi: eng kichik = " + mn + ", Q1 = " + q1 + ", mediana = " + me + ", Q3 = " + q3 + ", eng katta = " + mx + ". ";
    if (k === 3) return numQ(box + "Kvartillararo kenglik (IQR)?", q3 - q1, ["IQR = Q3 − Q1 = " + q3 + " − " + q1 + " = " + (q3 - q1)]);
    if (k === 4) return numQ(box + "Kenglik (range)?", mx - mn, ["Kenglik = eng katta − eng kichik = " + mx + " − " + mn + " = " + (mx - mn)]);
    if (k === 5) { var c5 = pick([["Q1 dan Q3 gacha", 50], ["medianadan kattasi", 50], ["Q3 dan kattasi", 25], ["Q1 dan kichigi", 25], ["eng kichikdan medianagacha", 50]]); return numQ(box + "Ma'lumotlarning necha foizi " + c5[0] + " oraliqda?", c5[1], ["Quti diagrammasi ma'lumotni 4 ta 25% lik bo'lakka bo'ladi: " + c5[0] + " → " + c5[1] + "%"], "foiz", [25, 50, 75, 100].filter(function (x) { return x !== c5[1]; })); }
    // gistogramma
    var w = pick([5, 10, 20]), st = pick([0, 10, 20]), cs = [R(2, 8), R(3, 10), R(2, 9), R(1, 7)], tot = sum(cs);
    var lab = cs.map(function (c, i) { return (st + i * w) + "–" + (st + (i + 1) * w) + ": " + c + " ta"; }).join(", ");
    if (k === 6) { var acc = 0, idx = 0, half = (tot + 1) / 2; for (var i = 0; i < cs.length; i++) { acc += cs[i]; if (acc >= half) { idx = i; break; } } return txtQ("Gistogramma oraliqlari va chastotalar: " + lab + ". Mediana qaysi oraliqda?", (st + idx * w) + "–" + (st + (idx + 1) * w), cs.map(function (c, i) { return (st + i * w) + "–" + (st + (i + 1) * w); }), ["Jami " + tot + " ta. O'rtadagi (" + Math.ceil(half) + "-) qiymat yig'ib borilganda " + (st + idx * w) + "–" + (st + (idx + 1) * w) + " oraliqqa tushadi."], "oraliq"); }
    var j = R(0, 3), pcnt = Math.round(cs[j] / tot * 100);
    return numQ("Gistogramma: " + lab + ". Ma'lumotlarning necha foizi " + (st + j * w) + "–" + (st + (j + 1) * w) + " oraliqda? (butun songacha yaxlitlang)", pcnt, [cs[j] + " / " + tot + " · 100% ≈ " + pcnt + "%"], "foiz");
  };

  /* ---------- 101 Sochilma diagramma va eng yaxshi moslik chizig'i ---------- */
  var XN = ["soat", "kun", "yil", "kg", "km"], YN = ["ball", "so'm (ming)", "daraja", "dona", "sm"];
  G.t101 = function (L) {
    var k = pick(lv(L, [0, 1], [1, 2, 3], [3, 4, 5]));
    var m = pick([2, 3, 4, 5, -2, -3, 1.5, 0.5]), b = R(5, 40), xu = pick(XN), yu = pick(YN);
    var eq = "y = " + String(m).replace("-", "−") + "x + " + b;
    if (k === 0) { var x0 = R(2, 12), y0 = m * x0 + b; return numQ("Sochilma diagrammaga eng yaxshi moslik chizig'i " + eq + " o'tkazilgan (x — " + xu + ", y — " + yu + "). x = " + x0 + " bo'lganda y ning bashorat qiymati?", y0, [m + "·" + x0 + " + " + b + " = " + y0]); }
    if (k === 1) return txtQ("Moslik chizig'i " + eq + " (x — " + xu + ", y — " + yu + "). Qiyalik " + m + " nimani bildiradi?", "x har 1 " + xu + " oshganda y o'rtacha " + Math.abs(m) + " " + yu + " ga " + (m > 0 ? "oshadi" : "kamayadi"),
      ["x = 0 bo'lganda y = " + m, "y har 1 " + yu + " oshganda x " + Math.abs(m) + " ga oshadi", "x = " + m + " bo'lganda y = " + b], ["Qiyalik = y ning x bo'yicha o'zgarish tezligi: Δy/Δx = " + m + "."]);
    if (k === 2) return numQ("Moslik chizig'i " + eq + ". y-kesishma (x = 0 bo'lgandagi bashorat) nechaga teng?", b, ["x = 0 → y = " + b]);
    if (k === 3) { var x1 = R(2, 10), pr = m * x1 + b, res = pick([-6, -4, -3, 3, 4, 6]), act = pr + res; return numQ("Moslik chizig'i " + eq + ". Diagrammadagi nuqta (" + x1 + "; " + act + "). Haqiqiy qiymat bashoratdan qanchaga farq qiladi (qoldiq = haqiqiy − bashorat)?", res, ["Bashorat: " + m + "·" + x1 + " + " + b + " = " + pr + "; qoldiq = " + act + " − " + pr + " = " + res], "son", [-res, res + 1, res - 1, 0]); }
    if (k === 4) { var x2 = R(2, 10), pr2 = m * x2 + b, up = R(0, 1), act2 = pr2 + (up ? R(2, 6) : -R(2, 6)); return txtQ("Moslik chizig'i " + eq + ". (" + x2 + "; " + act2 + ") nuqta chiziqqa nisbatan qayerda?", up ? "Chiziqdan yuqorida" : "Chiziqdan pastda", ["Chiziqdan pastda", "Chiziqdan yuqorida", "Chiziq ustida"], ["Bashorat " + pr2 + ", haqiqiy " + act2 + " → " + (up ? "yuqorida" : "pastda")]); }
    var xa = R(1, 5), xb = xa + pick([2, 4, 5]), mm = pick([2, 3, 4]), bb = R(3, 20), ya = mm * xa + bb, yb = mm * xb + bb;
    return numQ("Eng yaxshi moslik chizig'i (" + xa + "; " + ya + ") va (" + xb + "; " + yb + ") nuqtalardan o'tadi. Chiziqning y-kesishmasi?", bb, ["Qiyalik = (" + yb + " − " + ya + ")/(" + xb + " − " + xa + ") = " + mm + "; b = " + ya + " − " + mm + "·" + xa + " = " + bb]);
  };

  /* ---------- 102 Kompleks sonlar ---------- */
  function cx(a, b) { return (a === 0 && b !== 0 ? "" : a) + (b === 0 ? "" : (b > 0 ? (a === 0 ? "" : " + ") : (a === 0 ? "−" : " − ")) + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "i"); }
  G.t102 = function (L) {
    var k = pick(lv(L, [0, 1], [1, 2, 3], [3, 4, 5]));
    if (k === 0) { var n = pick([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 21]), r = ["1", "i", "−1", "−i"][n % 4]; return txtQ("i^" + n + " nechaga teng? (i — mavhum birlik)", r, ["1", "i", "−1", "−i"], ["i² = −1, i³ = −i, i⁴ = 1; daraja 4 ga bo'linganda qoldiq " + (n % 4) + " → " + r]); }
    var a = R(1, 7), b = R(1, 7), c = R(1, 7), d = R(1, 7);
    if (k === 1) return txtQ("(" + cx(a, b) + ") + (" + cx(c, -d) + ") ni hisoblang.", cx(a + c, b - d), [cx(a + c, b + d), cx(a - c, b - d), cx(a + c, -(b - d))], ["Haqiqiy qismlar: " + a + " + " + c + " = " + (a + c) + "; mavhum: " + b + " − " + d + " = " + (b - d)]);
    if (k === 2) return numQ("(" + cx(a, b) + ")(" + cx(c, d) + ") ko'paytmasining haqiqiy qismi?", a * c - b * d, ["(a+bi)(c+di) = (ac − bd) + (ad + bc)i; ac − bd = " + a * c + " − " + b * d + " = " + (a * c - b * d)], "son", [a * c + b * d, a * d + b * c, a * c]);
    if (k === 3) return numQ("(" + cx(a, b) + ")(" + cx(c, d) + ") ko'paytmasining mavhum qismi (i oldidagi koeffitsiyent)?", a * d + b * c, ["ad + bc = " + a * d + " + " + b * c + " = " + (a * d + b * c)], "son", [a * c - b * d, a * d - b * c, b * d]);
    if (k === 4) { var t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]); return numQ("|" + cx(t[0], pick([1, -1]) * t[1]) + "| ni toping.", t[2], ["|a + bi| = √(a² + b²) = √(" + t[0] * t[0] + " + " + t[1] * t[1] + ") = " + t[2]]); }
    return txtQ("(" + cx(a, b) + ")(" + cx(a, -b) + ") ni hisoblang.", String(a * a + b * b), [String(a * a - b * b), cx(a * a, 2 * a * b), cx(a * a - b * b, 2 * a * b)], ["Qo'shma sonlar ko'paytmasi: a² + b² = " + a * a + " + " + b * b + " = " + (a * a + b * b)]);
  };

  S.registerAll(G, {
    t99: "O'rtacha kvadratik chetlanish, tanlanma va xatolik chegarasi",
    t100: "Diagrammalar: nuqtali, quti diagrammasi, gistogramma",
    t101: "Sochilma diagramma va eng yaxshi moslik chizig'i",
    t102: "Kompleks sonlar"
  });
})();
