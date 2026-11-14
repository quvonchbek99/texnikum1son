/*! Kuvonch Academy — Sinflar bo'yicha modullar (1–11-sinf)
 *  Har bir sinf uchun: modullar (qisqa tushuncha) + savol generatorlari.
 *  Generator ID lari: s<sinf>m<modul>  (masalan s5m2) — har safar yangi sonlar.
 *  s1 … s11 — shu sinfning barcha modullaridan aralash savol (daraja testi va viktorina uchun).
 *  10–11-sinf modullari mashqlar.html dagi 1–50 asosiy mavzulardan (t1…t50) foydalanadi. */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle, nearW = H.nearW, G = {}, T = {};

  function uniq(a) { var s = {}, o = []; a.forEach(function (x) { x = String(x); if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  function numQ(q, a, steps, w) {
    var ws = (w || nearW(a, 5, Math.max(1, Math.round(Math.abs(a) * .3) || 1))).filter(function (x) { return x !== a && x >= 0; });
    return { q: q, a: a, hint: "son", w: ws.slice(0, 5), steps: steps };
  }
  function txtQ(q, a, w, steps) { return { q: q, a: String(a), hint: "javob", type: "text", w: uniq(w).filter(function (x) { return x !== String(a); }).slice(0, 4), steps: steps }; }
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function fr(n, d) { var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
  function sign(n) { return n < 0 ? "(" + n + ")" : String(n); }
  var SHAPES = [["uchburchak", 3], ["to'rtburchak", 4], ["beshburchak", 5], ["oltiburchak", 6]];
  var NARSA = ["olma", "daftar", "qalam", "kitob", "koptok", "shar", "konfet", "gul"];
  var ISM = ["Ali", "Vali", "Zuhra", "Malika", "Bobur", "Dilnoza", "Sardor", "Nilufar"];

  /* ================= 1-SINF ================= */
  G.s1m1 = function (L) { // 1 dan 10 (20) gacha sonlar
    var mx = lv(L, 10, 20, 20), k = R(0, 2);
    if (k === 0) { var a = R(1, mx - 1); return numQ(a + " dan keyin qaysi son keladi?", a + 1, [a + " dan keyingi son — " + (a + 1)]); }
    if (k === 1) { var b = R(2, mx); return numQ(b + " dan oldin qaysi son keladi?", b - 1, [b + " dan oldingi son — " + (b - 1)]); }
    var x = R(1, mx), y = R(1, mx); while (y === x) y = R(1, mx);
    return txtQ("Qaysi son katta: " + x + " yoki " + y + "?", Math.max(x, y), [String(Math.min(x, y)), "Teng"], [Math.max(x, y) + " > " + Math.min(x, y)]);
  };
  G.s1m2 = function (L) { // 10 ichida qo'shish va ayirish
    var mx = lv(L, 5, 10, 10), a = R(1, mx), b = R(1, mx - a + 1 > 0 ? mx - a + 1 : 1);
    if (a + b > mx) b = Math.max(1, mx - a);
    if (R(0, 1)) return numQ(a + " + " + b + " = ?", a + b, [a + " + " + b + " = " + (a + b)]);
    var s = a + b; return numQ(s + " − " + a + " = ?", b, [s + " − " + a + " = " + b]);
  };
  G.s1m3 = function (L) { // o'nlikdan o'tib qo'shish/ayirish (20 ichida)
    var a = R(lv(L, 5, 7, 9), 9), b = R(11 - a, 9);
    if (R(0, 1)) return numQ(a + " + " + b + " = ?", a + b, [a + " + " + (10 - a) + " = 10, keyin 10 + " + (b - (10 - a)) + " = " + (a + b)]);
    var s = a + b; return numQ(s + " − " + b + " = ?", a, [s + " − " + (s - 10) + " = 10, keyin 10 − " + (b - (s - 10)) + " = " + a]);
  };
  G.s1m4 = function (L) { // shakllar, masalalar
    if (R(0, 1)) { var sh = pick(SHAPES); return numQ(sh[0] + "ning nechta tomoni bor?", sh[1], [sh[0] + "da " + sh[1] + " ta tomon va " + sh[1] + " ta uchi bor"], [sh[1] - 1, sh[1] + 1, sh[1] + 2]); }
    var n = pick(NARSA), a = R(2, lv(L, 5, 8, 9)), b = R(1, lv(L, 4, 8, 9)), who = pick(ISM);
    if (R(0, 1)) return numQ(who + "da " + a + " ta " + n + " bor edi. Unga yana " + b + " ta " + n + " berishdi. " + who + "da nechta " + n + " bo'ldi?", a + b, [a + " + " + b + " = " + (a + b)]);
    return numQ(who + "da " + (a + b) + " ta " + n + " bor edi. U " + b + " tasini do'stiga berdi. Nechta " + n + " qoldi?", a, [(a + b) + " − " + b + " = " + a]);
  };

  /* ================= 2-SINF ================= */
  G.s2m1 = function (L) { // 100 ichida qo'shish/ayirish
    var a = R(lv(L, 10, 20, 30), lv(L, 50, 70, 90)), b = R(lv(L, 1, 10, 15), Math.min(lv(L, 20, 40, 60), 99 - a));
    if (R(0, 1)) return numQ(a + " + " + b + " = ?", a + b, ["O'nliklar: " + Math.floor(a / 10) * 10 + " + " + Math.floor(b / 10) * 10 + ", birliklar: " + a % 10 + " + " + b % 10, a + " + " + b + " = " + (a + b)]);
    var s = a + b; return numQ(s + " − " + b + " = ?", a, [s + " − " + b + " = " + a]);
  };
  G.s2m2 = function (L) { // ko'paytirish jadvali 2–5 (L3: 2–9)
    var a = R(2, lv(L, 3, 5, 9)), b = R(2, lv(L, 5, 9, 9));
    if (R(0, 2)) return numQ(a + " · " + b + " = ?", a * b, [a + " ni " + b + " marta qo'shamiz: " + a * b]);
    return numQ((a * b) + " : " + a + " = ?", b, [a + " · " + b + " = " + a * b + ", demak " + a * b + " : " + a + " = " + b]);
  };
  G.s2m3 = function (L) { // uzunlik va vaqt birliklari
    var k = R(0, 2);
    if (k === 0) { var m = R(1, lv(L, 3, 6, 9)); return numQ(m + " m necha sm?", m * 100, ["1 m = 100 sm, " + m + " m = " + m * 100 + " sm"]); }
    if (k === 1) { var d = R(1, 9); return numQ(d + " dm necha sm?", d * 10, ["1 dm = 10 sm"]); }
    var h = R(1, lv(L, 2, 3, 5)); return numQ(h + " soat necha daqiqa?", h * 60, ["1 soat = 60 daqiqa, " + h + " · 60 = " + h * 60]);
  };
  G.s2m4 = function (L) { // masalalar (narx, marta)
    var n = pick(NARSA), p = R(2, lv(L, 5, 9, 12)), q = R(2, lv(L, 4, 6, 9));
    if (R(0, 1)) return numQ("Bitta " + n + " " + p + " ming so'm turadi. " + q + " ta " + n + " necha ming so'm turadi?", p * q, [p + " · " + q + " = " + p * q]);
    var who = pick(ISM); return numQ(who + "da " + p + " ta " + n + " bor. Ukasida undan " + q + " marta ko'p. Ukasida nechta " + n + " bor?", p * q, ["\"" + q + " marta ko'p\" — ko'paytiramiz: " + p + " · " + q + " = " + p * q]);
  };

  /* ================= 3-SINF ================= */
  G.s3m1 = function (L) { // ko'paytirish va bo'lish jadvali (to'liq)
    var a = R(lv(L, 2, 3, 6), 9), b = R(lv(L, 2, 4, 6), 9), k = R(0, 2);
    if (k === 0) return numQ(a + " · " + b + " = ?", a * b, [a + " · " + b + " = " + a * b]);
    if (k === 1) return numQ((a * b) + " : " + b + " = ?", a, [a + " · " + b + " = " + a * b]);
    return numQ(a * b + " : " + a + " + " + b + " = ?", 2 * b, ["Avval bo'lamiz: " + a * b + " : " + a + " = " + b, b + " + " + b + " = " + 2 * b]);
  };
  G.s3m2 = function (L) { // 1000 ichida qo'shish/ayirish
    var a = R(lv(L, 100, 200, 350), lv(L, 400, 600, 800)), b = R(lv(L, 10, 50, 120), Math.min(lv(L, 100, 300, 500), 999 - a));
    if (R(0, 1)) return numQ(a + " + " + b + " = ?", a + b, ["Ustun usulida qo'shamiz: " + (a + b)]);
    return numQ((a + b) + " − " + b + " = ?", a, ["Ustun usulida ayiramiz: " + a]);
  };
  G.s3m3 = function (L) { // ikki xonalini bir xonaliga ko'paytirish/bo'lish
    var a = R(lv(L, 11, 15, 23), lv(L, 25, 48, 99)), b = R(2, lv(L, 4, 6, 9));
    if (R(0, 1)) return numQ(a + " · " + b + " = ?", a * b, [Math.floor(a / 10) * 10 + " · " + b + " = " + Math.floor(a / 10) * 10 * b + ", " + a % 10 + " · " + b + " = " + (a % 10) * b, "Yig'indi: " + a * b]);
    return numQ((a * b) + " : " + b + " = ?", a, [a + " · " + b + " = " + a * b + ", demak javob " + a]);
  };
  G.s3m4 = function (L) { // perimetr, masalalar
    var k = R(0, 2);
    if (k === 0) { var s = R(2, lv(L, 9, 15, 25)); return numQ("Tomoni " + s + " sm bo'lgan kvadratning perimetrini toping (sm).", 4 * s, ["P = 4 · a = 4 · " + s + " = " + 4 * s]); }
    if (k === 1) { var a = R(2, lv(L, 8, 15, 30)), b = R(1, a - 1); return numQ("Tomonlari " + a + " sm va " + b + " sm bo'lgan to'g'ri to'rtburchakning perimetri necha sm?", 2 * (a + b), ["P = 2 · (a + b) = 2 · (" + a + " + " + b + ") = " + 2 * (a + b)]); }
    var p = R(3, lv(L, 6, 9, 12)), q = R(2, 9), r = R(1, p * q - 1); return numQ(p + " ta qutida " + q + " tadan olma bor edi. " + r + " tasi sotildi. Nechta olma qoldi?", p * q - r, [p + " · " + q + " = " + p * q, p * q + " − " + r + " = " + (p * q - r)]);
  };

  /* ================= 4-SINF ================= */
  G.s4m1 = function (L) { // ko'p xonali sonlar, razryadlar
    var n = R(lv(L, 1000, 10000, 100000), lv(L, 9999, 99999, 999999)), k = R(0, 2), d = String(n);
    if (k === 0) { var p = pick([["birlik", 0], ["o'nlik", 1], ["yuzlik", 2], ["minglik", 3]]); return numQ(n + " sonida " + p[0] + "lar xonasida qaysi raqam turibdi?", +d[d.length - 1 - p[1]], ["O'ngdan " + (p[1] + 1) + "-raqam"], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== +d[d.length - 1 - p[1]]; }).slice(0, 4)); }
    if (k === 1) { var r = pick([10, 100, 1000]); return numQ(n + " sonini " + r + " gacha yaxlitlang.", Math.round(n / r) * r, ["Keyingi raqamga qaraymiz: " + Math.round(n / r) * r]); }
    var m = R(1, 9); return numQ(n + " + " + m * 1000 + " = ?", n + m * 1000, ["Mingliklarga " + m + " qo'shamiz"]);
  };
  G.s4m2 = function (L) { // ustun ko'paytirish va bo'lish
    var a = R(lv(L, 12, 24, 120), lv(L, 50, 99, 999)), b = R(lv(L, 2, 3, 12), lv(L, 9, 12, 25));
    if (R(0, 1)) return numQ(a + " · " + b + " = ?", a * b, ["Ustun usulida: " + a * b]);
    return numQ((a * b) + " : " + b + " = ?", a, ["Burchakli bo'lish: " + a]);
  };
  G.s4m3 = function (L) { // tezlik, vaqt, masofa
    var v = pick(lv(L, [40, 50, 60], [45, 60, 70, 80], [55, 65, 72, 90])), t = R(2, lv(L, 4, 6, 9)), k = R(0, 2);
    if (k === 0) return numQ("Avtomobil " + v + " km/soat tezlik bilan " + t + " soat yurdi. U qancha masofa bosib o'tdi (km)?", v * t, ["S = v · t = " + v + " · " + t + " = " + v * t]);
    if (k === 1) return numQ("Poyezd " + v * t + " km masofani " + t + " soatda bosib o'tdi. Uning tezligi qancha (km/soat)?", v, ["v = S : t = " + v * t + " : " + t + " = " + v]);
    return numQ("Velosipedchi " + v + " km/soat tezlik bilan " + v * t + " km yo'l bosdi. U necha soat yurdi?", t, ["t = S : v = " + v * t + " : " + v + " = " + t]);
  };
  G.s4m4 = function (L) { // yuza, ulushlar
    if (R(0, 1)) { var a = R(2, lv(L, 9, 15, 30)), b = R(2, lv(L, 9, 12, 25)); return numQ("Tomonlari " + a + " sm va " + b + " sm bo'lgan to'g'ri to'rtburchakning yuzini toping (sm²).", a * b, ["S = a · b = " + a + " · " + b + " = " + a * b]); }
    var d = pick(lv(L, [2, 4, 5], [3, 4, 6, 8], [5, 6, 7, 8, 9])), n = R(1, d - 1), w = d * R(2, lv(L, 5, 9, 12));
    return numQ(w + " ning " + n + "/" + d + " qismini toping.", w / d * n, [w + " : " + d + " = " + w / d + " (bir ulush)", w / d + " · " + n + " = " + w / d * n]);
  };

  /* ================= 5-SINF ================= */
  G.s5m1 = function (L) { // natural sonlar: bo'linish belgilari, EKUB/EKUK, tub sonlar
    var k = R(0, 2);
    if (k === 0) { var d = pick([2, 3, 5, 9, 10]), ok = d * R(12, Math.floor(999 / d)), bad = [], g = 0; while (bad.length < 4 && g++ < 60) { var m = R(100, 999); if (m % d && bad.indexOf(m) < 0) bad.push(m); }
      return numQ("Qaysi son " + d + " ga qoldiqsiz bo'linadi?", ok, [d === 2 ? "Oxirgi raqami juft son 2 ga bo'linadi" : d === 3 || d === 9 ? "Raqamlar yig'indisi " + d + " ga bo'linsa, son ham bo'linadi" : "Oxirgi raqami " + (d === 5 ? "0 yoki 5" : "0") + " bo'lgan son " + d + " ga bo'linadi", ok + " : " + d + " = " + ok / d], bad); }
    if (k === 1) { var a = R(2, lv(L, 6, 9, 12)) * R(2, 4), b = R(2, lv(L, 6, 9, 12)) * R(2, 4); return numQ("EKUB(" + a + "; " + b + ") ni toping.", gcd(a, b), ["Umumiy bo'luvchilarning eng kattasi — " + gcd(a, b)]); }
    var x = R(2, lv(L, 6, 9, 12)), y = R(2, lv(L, 6, 9, 12)); return numQ("EKUK(" + x + "; " + y + ") ni toping.", x * y / gcd(x, y), ["EKUK = a·b : EKUB = " + x * y + " : " + gcd(x, y) + " = " + x * y / gcd(x, y)]);
  };
  G.s5m2 = function (L) { // oddiy kasrlar
    var d = pick(lv(L, [2, 4, 5, 10], [3, 6, 8, 12], [7, 9, 12, 15])), a = R(1, d - 1), b = R(1, d - 1), k = R(0, 2);
    if (k === 0) return txtQ(a + "/" + d + " + " + b + "/" + d + " = ?", fr(a + b, d), [fr(a + b, d + 1), fr(Math.abs(a - b) || 1, d), (a + b) + "/" + 2 * d], ["Maxrajlar bir xil — suratlarni qo'shamiz: " + (a + b) + "/" + d + (gcd(a + b, d) > 1 ? " = " + fr(a + b, d) : "")]);
    if (k === 1) { var d2 = d * R(2, 3), a2 = a * (d2 / d); return txtQ(a2 + "/" + d2 + " kasrni qisqartiring.", fr(a2, d2), [a2 + "/" + d, a + "/" + d2, fr(a2 + 1, d2)], ["Surat va maxrajni " + gcd(a2, d2) + " ga bo'lamiz"]); }
    var w = R(2, lv(L, 3, 5, 9)); return txtQ((w * d + a) + "/" + d + " noto'g'ri kasrni aralash son ko'rinishida yozing.", w + " " + fr(a, d), [(w + 1) + " " + fr(a, d), w + " " + a + "/" + (d + 1), (w - 1) + " " + fr(a, d)], [(w * d + a) + " : " + d + " = " + w + " (qoldiq " + a + ")"]);
  };
  G.s5m3 = function (L) { // o'nli kasrlar
    var a = R(10, lv(L, 99, 999, 9999)) / 10, b = R(10, lv(L, 99, 999, 999)) / 10, k = R(0, 2);
    if (k === 0) return numQ(a + " + " + b + " = ?", Math.round((a + b) * 10) / 10, ["Vergulni vergul ostiga yozib qo'shamiz"]);
    if (k === 1) { var m = pick([10, 100, 1000]); return numQ(a + " · " + m + " = ?", Math.round(a * m * 10) / 10, ["Vergulni o'ngga " + String(m).length - 1 + " xona suramiz"]); }
    var c = R(2, 9), e = R(1, 9); return numQ((c + e / 10) + " · " + c + " = ?", Math.round((c + e / 10) * c * 100) / 100, [c + " · " + c + " = " + c * c + ", " + e / 10 + " · " + c + " = " + e * c / 10]);
  };
  G.s5m4 = function (L) { // foiz
    var p = pick(lv(L, [10, 25, 50], [5, 20, 30, 75], [12, 15, 35, 60])), n = R(1, lv(L, 5, 9, 20)) * 100, k = R(0, 1);
    if (k === 0) return numQ(n + " ning " + p + "% ini toping.", n * p / 100, [n + " · " + p + " : 100 = " + n * p / 100]);
    return numQ("Tovar " + n + " ming so'm turardi, narxi " + p + "% arzonlashtirildi. Yangi narxi necha ming so'm?", n - n * p / 100, [p + "% = " + n * p / 100 + " ming", n + " − " + n * p / 100 + " = " + (n - n * p / 100)]);
  };
  G.s5m5 = function (L) { // burchaklar
    var k = R(0, 1), a = R(lv(L, 20, 15, 11), lv(L, 70, 85, 89));
    if (k === 0) return numQ("Burchak " + a + "°. Unga qo'shni burchak necha gradus?", 180 - a, ["Qo'shni burchaklar yig'indisi 180°: 180 − " + a + " = " + (180 - a)]);
    var b = R(20, 120 - a); return numQ("Uchburchakning ikki burchagi " + a + "° va " + b + "°. Uchinchi burchagi necha gradus?", 180 - a - b, ["Burchaklar yig'indisi 180°: 180 − " + a + " − " + b + " = " + (180 - a - b)]);
  };

  /* ================= 6-SINF ================= */
  G.s6m1 = function (L) { // nisbat va proporsiya
    var a = R(2, lv(L, 6, 9, 12)), b = R(2, lv(L, 6, 9, 12)), k = R(2, lv(L, 5, 9, 15)), q = R(0, 1);
    if (q === 0) return numQ("Proporsiyadagi noma'lumni toping: " + a + " : " + b + " = x : " + b * k, a * k, ["x = " + a + " · " + b * k + " : " + b + " = " + a * k]);
    var t = R(3, lv(L, 10, 20, 50)), s = a * t; return numQ("Ikki son nisbati " + a + " : " + b + " kabi, yig'indisi " + (a + b) * t + ". Kichik sonni toping.", Math.min(a, b) * t, ["Bir ulush: " + (a + b) * t + " : " + (a + b) + " = " + t, Math.min(a, b) + " · " + t + " = " + Math.min(a, b) * t]);
  };
  G.s6m2 = function (L) { // butun sonlar
    var a = R(-lv(L, 9, 20, 50), lv(L, 9, 20, 50)), b = R(-lv(L, 9, 20, 50), lv(L, 9, 20, 50)), k = R(0, 2);
    if (k === 0) return numQ(sign(a) + " + " + sign(b) + " = ?", a + b, ["Ishoralarni hisobga olib qo'shamiz: " + (a + b)], nearW(a + b, 5, 3).filter(function (x) { return x !== a + b; }));
    if (k === 1) return numQ(sign(a) + " − " + sign(b) + " = ?", a - b, [a + " − (" + b + ") = " + a + " + " + (-b) + " = " + (a - b)], nearW(a - b, 5, 3).filter(function (x) { return x !== a - b; }));
    var c = R(2, 9) * pick([1, -1]), d = R(2, 9) * pick([1, -1]); return numQ(sign(c) + " · " + sign(d) + " = ?", c * d, ["Ishoralar " + (c * d > 0 ? "bir xil — natija musbat" : "har xil — natija manfiy") + ": " + c * d], [-c * d, c * d + 1, -(c * d) - 1, c * d - 2].filter(function (x) { return x !== c * d; }));
  };
  G.s6m3 = function (L) { // ratsional sonlar: kasrlar ko'paytirish/bo'lish, turli maxraj
    var k = R(0, 1), a = R(1, 5), b = pick([2, 3, 4, 6]), c = R(1, 5), d = pick([2, 3, 5, 8]);
    if (k === 0) return txtQ(a + "/" + b + " · " + c + "/" + d + " = ?", fr(a * c, b * d), [fr(a * d, b * c), fr(a + c, b + d), fr(a * c, b + d), fr(a * c + 1, b * d), fr(a * c, b * d + 1)], ["Surat·surat, maxraj·maxraj: " + a * c + "/" + b * d + (gcd(a * c, b * d) > 1 ? " = " + fr(a * c, b * d) : "")]);
    var m = b * d / gcd(b, d); return txtQ(a + "/" + b + " + " + c + "/" + d + " = ?", fr(a * (m / b) + c * (m / d), m), [fr(a + c, b + d), fr(a * (m / b) + c * (m / d), m + 1), fr(a * (m / b) - c * (m / d) || 1, m)], ["Umumiy maxraj " + m + ": " + a * (m / b) + "/" + m + " + " + c * (m / d) + "/" + m]);
  };
  G.s6m4 = function (L) { // chiziqli tenglamalar
    var a = R(2, lv(L, 5, 9, 12)), x = R(-lv(L, 0, 5, 10), lv(L, 9, 12, 20)), b = R(-lv(L, 9, 20, 30), lv(L, 9, 20, 30)), k = R(0, 1);
    if (k === 0) return numQ("Tenglamani yeching: " + a + "x " + (b < 0 ? "− " + (-b) : "+ " + b) + " = " + (a * x + b), x, [a + "x = " + (a * x + b) + " − " + sign(b) + " = " + a * x, "x = " + a * x + " : " + a + " = " + x], nearW(x, 5, 3).filter(function (v) { return v !== x; }));
    var c = R(1, a - 1); return numQ("Tenglamani yeching: " + a + "x " + (b < 0 ? "− " + (-b) : "+ " + b) + " = " + c + "x + " + ((a - c) * x + b), x, [(a - c) + "x = " + ((a - c) * x), "x = " + x], nearW(x, 5, 3).filter(function (v) { return v !== x; }));
  };
  G.s6m5 = function (L) { // koordinata tekisligi
    var x = R(-9, 9) || 3, y = R(-9, 9) || -4, ch = ["I", "II", "III", "IV"], q = x > 0 && y > 0 ? "I" : x < 0 && y > 0 ? "II" : x < 0 && y < 0 ? "III" : "IV";
    if (R(0, 1)) return txtQ("A(" + x + "; " + y + ") nuqta qaysi chorakda joylashgan?", q, ch, ["x " + (x > 0 ? "> 0" : "< 0") + ", y " + (y > 0 ? "> 0" : "< 0") + " → " + q + " chorak"]);
    var x2 = x + pick([3, 4, 5, 6]) * pick([1, -1]); return numQ("A(" + x + "; " + y + ") va B(" + x2 + "; " + y + ") nuqtalar orasidagi masofani toping.", Math.abs(x2 - x), ["Ordinatalar teng, masofa = |" + x2 + " − " + sign(x) + "| = " + Math.abs(x2 - x)]);
  };

  /* ================= 7-SINF ================= */
  G.s7m1 = function (L) { // darajalar
    var a = R(2, lv(L, 5, 7, 9)), m = R(2, lv(L, 4, 6, 9)), n = R(1, lv(L, 3, 5, 8)), k = R(0, 2);
    if (k === 0) return txtQ("Soddalashtiring: a^" + m + " · a^" + n, "a^" + (m + n), ["a^" + m * n, "a^" + Math.abs(m - n), "2a^" + (m + n)], ["Asoslar bir xil — ko'rsatkichlar qo'shiladi: a^" + (m + n)]);
    if (k === 1) return txtQ("Soddalashtiring: (a^" + m + ")^" + n, "a^" + m * n, ["a^" + (m + n), "a^" + Math.abs(m - n), "a^" + m + "^" + n], ["Darajani darajaga oshirganda ko'rsatkichlar ko'paytiriladi: a^" + m * n]);
    var p = R(1, lv(L, 3, 4, 5)); return numQ(a + "^" + p + " = ?", Math.pow(a, p), [a + " ni " + p + " marta ko'paytiramiz: " + Math.pow(a, p)]);
  };
  G.s7m2 = function (L) { // ko'phadlar, qisqa ko'paytirish
    var a = R(1, lv(L, 3, 5, 9)), b = R(1, lv(L, 5, 9, 12)), k = R(0, 2);
    if (k === 0) return txtQ("Qavsni oching: (x + " + b + ")²", "x² + " + 2 * b + "x + " + b * b, ["x² + " + b * b, "x² + " + b + "x + " + b * b, "x² + " + 2 * b + "x + " + 2 * b], ["(a + b)² = a² + 2ab + b²"]);
    if (k === 1) return txtQ("Ko'paytuvchilarga ajrating: x² − " + b * b, "(x − " + b + ")(x + " + b + ")", ["(x − " + b + ")²", "(x + " + b + ")²", "(x − " + b * b + ")(x + 1)"], ["a² − b² = (a − b)(a + b)"]);
    return txtQ("Soddalashtiring: " + a + "x + " + b + " + " + (a + 1) + "x − " + (b > 1 ? b - 1 : 1), (2 * a + 1) + "x + " + (b - (b > 1 ? b - 1 : 1)), [(2 * a + 1) + "x + " + b, (2 * a) + "x + 1", (2 * a + 1) + "x − 1"], ["O'xshash hadlarni jamlaymiz"]);
  };
  G.s7m3 = function (L) { // chiziqli tenglamalar sistemasi
    var x = R(-lv(L, 3, 5, 9), lv(L, 5, 9, 12)) || 2, y = R(-lv(L, 3, 5, 9), lv(L, 5, 9, 12)) || -1, a = R(1, lv(L, 1, 3, 5)), b = R(1, lv(L, 2, 4, 6)); if (x === y) y += 1;
    var e1 = x + y, e2 = a * x - b * y;
    return txtQ("Sistemani yeching: { x + y = " + e1 + "; " + (a === 1 ? "" : a) + "x − " + (b === 1 ? "" : b) + "y = " + e2 + " }. (x; y) = ?", "(" + x + "; " + y + ")", ["(" + y + "; " + x + ")", "(" + (x + 1) + "; " + (y - 1) + ")", "(" + (-x) + "; " + (-y) + ")"], ["Birinchidan x = " + e1 + " − y, ikkinchiga qo'yamiz", "y = " + y + ", x = " + x]);
  };
  G.s7m4 = function (L) { // uchburchak, parallel chiziqlar
    var k = R(0, 1), a = R(20, 80);
    if (k === 0) { var b = R(20, 150 - a); return numQ("Uchburchakning burchaklari " + a + "°, " + b + "° va x. x ni toping.", 180 - a - b, ["x = 180 − " + a + " − " + b + " = " + (180 - a - b)]); }
    var t = pick([["ichki almashinuvchi", true], ["mos", true], ["bir tomonli ichki", false]]);
    return numQ("Ikki parallel to'g'ri chiziq kesuvchi bilan kesilgan. Burchaklardan biri " + a + "°. Unga " + t[0] + " burchak necha gradus?", t[1] ? a : 180 - a, [t[1] ? "Bunday burchaklar teng: " + a + "°" : "Bir tomonli ichki burchaklar yig'indisi 180°: " + (180 - a) + "°"]);
  };

  /* ================= 8-SINF ================= */
  G.s8m1 = function (L) { // kvadrat ildiz
    var a = R(2, lv(L, 9, 12, 20)), k = R(0, 2);
    if (k === 0) return numQ("√" + a * a + " = ?", a, [a + "² = " + a * a]);
    if (k === 1) { var b = pick([2, 3, 5]); return txtQ("√" + a * a * b + " ni soddalashtiring.", a + "√" + b, [b + "√" + a, "√" + a * b, (a * b) + "√" + a], ["√(" + a * a + " · " + b + ") = " + a + "√" + b]); }
    var c = R(2, 9); return numQ("√" + c * c * 4 + " · √" + 9 + " − " + c + " = ?", 2 * c * 3 - c, ["√" + c * c * 4 + " = " + 2 * c + ", √9 = 3", 2 * c + " · 3 − " + c + " = " + (6 * c - c)]);
  };
  G.s8m2 = function (L) { // kvadrat tenglamalar
    var x1 = R(-lv(L, 5, 9, 12), lv(L, 5, 9, 12)), x2 = R(-lv(L, 5, 9, 12), lv(L, 5, 9, 12)); if (x1 === x2) x2 += 2;
    var p = -(x1 + x2), q = x1 * x2, k = R(0, 1);
    var eq = "x² " + (p === 0 ? "" : (p < 0 ? "− " + (-p === 1 ? "" : -p) : "+ " + (p === 1 ? "" : p)) + "x ") + (q < 0 ? "− " + (-q) : "+ " + q) + " = 0";
    if (k === 0) return txtQ("Tenglamani yeching: " + eq, Math.min(x1, x2) + "; " + Math.max(x1, x2), [(-x1) + "; " + (-x2), x1 + "; " + (x2 + 1), String(x1)], ["Vyet teoremasi: x₁ + x₂ = " + (-p) + ", x₁ · x₂ = " + q, "Ildizlar: " + Math.min(x1, x2) + " va " + Math.max(x1, x2)]);
    return numQ(eq + " tenglama ildizlarining yig'indisini toping.", x1 + x2, ["Vyet: x₁ + x₂ = −b/a = " + (x1 + x2)], nearW(x1 + x2, 5, 3).filter(function (v) { return v !== x1 + x2; }));
  };
  G.s8m3 = function (L) { // Pifagor, to'rtburchaklar
    var t = pick(lv(L, [[3, 4, 5], [6, 8, 10]], [[5, 12, 13], [8, 15, 17], [9, 12, 15]], [[7, 24, 25], [20, 21, 29], [12, 35, 37]])), k = R(0, 2);
    if (k === 0) return numQ("To'g'ri burchakli uchburchakning katetlari " + t[0] + " va " + t[1] + ". Gipotenuzani toping.", t[2], ["c² = " + t[0] + "² + " + t[1] + "² = " + (t[0] * t[0] + t[1] * t[1]) + ", c = " + t[2]]);
    if (k === 1) return numQ("Gipotenuza " + t[2] + ", bir katet " + t[0] + ". Ikkinchi katetni toping.", t[1], ["b² = " + t[2] + "² − " + t[0] + "² = " + (t[2] * t[2] - t[0] * t[0]) + ", b = " + t[1]]);
    var d = R(3, lv(L, 8, 12, 20)), e = R(3, lv(L, 8, 12, 20)); return numQ("Rombning diagonallari " + 2 * d + " va " + 2 * e + ". Yuzini toping.", 2 * d * e, ["S = d₁ · d₂ / 2 = " + 2 * d + " · " + 2 * e + " / 2 = " + 2 * d * e]);
  };
  G.s8m4 = function (L) { // algebraik kasrlar
    var a = R(2, lv(L, 5, 9, 12)), b = R(1, lv(L, 5, 9, 12)), k = R(0, 1);
    if (k === 0) return txtQ("Kasrni qisqartiring: (x² − " + b * b + ") / (x − " + b + ")", "x + " + b, ["x − " + b, "x² + " + b, "1/(x + " + b + ")"], ["Surat: (x − " + b + ")(x + " + b + "), qisqargach x + " + b]);
    return txtQ("Kasrning aniqlanish sohasini toping: " + a + " / (x − " + b + ")", "x ≠ " + b, ["x ≠ " + a, "x ≠ 0", "x ≠ −" + b], ["Maxraj nolga teng bo'lmasligi kerak: x − " + b + " ≠ 0"]);
  };

  /* ================= 9-SINF ================= */
  G.s9m1 = function (L) { // kvadrat funksiya, tengsizliklar
    var a = R(-lv(L, 3, 6, 9), lv(L, 3, 6, 9)) || 2, c = R(-9, 9) || -3, k = R(0, 1);
    if (k === 0) return txtQ("y = (x − " + sign(a) + ")² + " + sign(c) + " parabolaning uchini toping.", "(" + a + "; " + c + ")", ["(" + (-a) + "; " + c + ")", "(" + c + "; " + a + ")", "(" + a + "; " + (-c) + ")"], ["y = (x − m)² + n ko'rinishida uchi (m; n)"]);
    var x1 = R(-5, 2), x2 = x1 + R(2, 6); return txtQ("Tengsizlikni yeching: (x − " + sign(x1) + ")(x − " + sign(x2) + ") < 0", "(" + x1 + "; " + x2 + ")", ["(−∞; " + x1 + ") ∪ (" + x2 + "; +∞)", "[" + x1 + "; " + x2 + "]", "(" + x2 + "; +∞)"], ["Ildizlar " + x1 + " va " + x2 + ", parabola tarmoqlari yuqoriga — ildizlar orasida manfiy"]);
  };
  G.s9m2 = function (L) { // progressiyalar
    var a1 = R(-lv(L, 5, 10, 20), lv(L, 10, 20, 30)), d = R(-lv(L, 0, 5, 9), lv(L, 9, 9, 12)) || 3, n = R(lv(L, 5, 8, 10), lv(L, 10, 20, 30)), k = R(0, 1);
    if (k === 0) return numQ("Arifmetik progressiyada a₁ = " + a1 + ", d = " + d + ". a" + n + " ni toping.", a1 + (n - 1) * d, ["aₙ = a₁ + (n − 1)d = " + a1 + " + " + (n - 1) + " · " + sign(d) + " = " + (a1 + (n - 1) * d)], nearW(a1 + (n - 1) * d, 5, 4).filter(function (v) { return v !== a1 + (n - 1) * d; }));
    var b1 = R(1, 5), q = pick([2, 3]), m = R(3, lv(L, 4, 5, 6)); return numQ("Geometrik progressiyada b₁ = " + b1 + ", q = " + q + ". b" + m + " ni toping.", b1 * Math.pow(q, m - 1), ["bₙ = b₁ · q^(n−1) = " + b1 + " · " + q + "^" + (m - 1) + " = " + b1 * Math.pow(q, m - 1)]);
  };
  G.s9m3 = function (L) { // trigonometriya asoslari
    var tab = [["sin 30°", "1/2"], ["cos 60°", "1/2"], ["sin 90°", "1"], ["cos 0°", "1"], ["tg 45°", "1"], ["sin 45°", "√2/2"], ["cos 45°", "√2/2"], ["sin 60°", "√3/2"], ["cos 30°", "√3/2"], ["tg 60°", "√3"], ["tg 30°", "√3/3"], ["cos 90°", "0"]];
    var t = pick(tab.slice(0, lv(L, 5, 9, 12)));
    if (R(0, 1)) return txtQ(t[0] + " = ?", t[1], ["1/2", "√3/2", "√2/2", "1", "0", "√3"], ["Jadval qiymati: " + t[0] + " = " + t[1]]);
    var p = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); return txtQ("To'g'ri burchakli uchburchakda katetlar " + p[0] + " va " + p[1] + ", gipotenuza " + p[2] + ". Kichik o'tkir burchakning sinusi nimaga teng?", fr(p[0], p[2]), [fr(p[1], p[2]), fr(p[0], p[1]), fr(p[1], p[0])], ["sin = qarshi katet / gipotenuza = " + p[0] + "/" + p[2]]);
  };
  G.s9m4 = function (L) { // aylana, o'xshashlik
    var r = R(2, lv(L, 7, 10, 15)), k = R(0, 2);
    if (k === 0) return txtQ("Radiusi " + r + " bo'lgan aylananing uzunligini toping.", 2 * r + "π", [r + "π", r * r + "π", 4 * r + "π"], ["C = 2πr = 2 · π · " + r + " = " + 2 * r + "π"]);
    if (k === 1) return txtQ("Radiusi " + r + " bo'lgan doiraning yuzini toping.", r * r + "π", [2 * r + "π", r + "π", 2 * r * r + "π"], ["S = πr² = π · " + r + "² = " + r * r + "π"]);
    var kk = R(2, 4), s = R(2, 9); return numQ("Ikki o'xshash uchburchakning o'xshashlik koeffitsiyenti " + kk + ". Kichigining yuzi " + s + " bo'lsa, kattasining yuzi qancha?", s * kk * kk, ["Yuzalar nisbati k² = " + kk * kk, s + " · " + kk * kk + " = " + s * kk * kk]);
  };
  G.s9m5 = function (L) { // ehtimollik elementlari
    var n = R(lv(L, 6, 10, 20), lv(L, 10, 20, 40)), m = R(1, n - 1);
    if (R(0, 1)) return txtQ("Qutida " + m + " ta qizil va " + (n - m) + " ta ko'k shar bor. Tavakkaliga olingan shar qizil bo'lish ehtimoli qancha?", fr(m, n), [fr(n - m, n), fr(m, n - m), fr(1, n)], ["P = qulay / barcha = " + m + "/" + n + (gcd(m, n) > 1 ? " = " + fr(m, n) : "")]);
    var e = pick([["juft son", 3, "2, 4, 6"], ["3 dan katta son", 3, "4, 5, 6"], ["tub son", 3, "2, 3, 5"], ["6 ga bo'linuvchi son", 1, "6"], ["5 dan kichik son", 4, "1, 2, 3, 4"]]);
    return txtQ("O'yin kubigi tashlanganda " + e[0] + " tushish ehtimoli qancha?", fr(e[1], 6), [fr(e[1] + 1, 6), fr(e[1], 5), "1/6", "1/2"], ["Qulay hollar: " + e[2] + " (" + e[1] + " ta), hammasi 6 ta: " + fr(e[1], 6)]);
  };

  /* ================= MODULLAR RO'YXATI ================= */
  // har modul: {id, nom, qisqa (tushuncha), test:[generator id lar]}  — 10–11 da t1…t50 (mashqlar.html)
  var MODULLAR = {
    1: { bosqich: "Boshlang'ich", mod: [
      { id: "s1m1", nom: "1 dan 20 gacha sonlar", qisqa: "Sonlarni sanash va taqqoslash (katta, kichik, teng), oldingi va keyingi sonni topish. Son o'qi — sonlar tartib bilan joylashgan to'g'ri chiziq." },
      { id: "s1m2", nom: "10 ichida qo'shish va ayirish", qisqa: "Qo'shish — birlashtirish (+), ayirish — olib qo'yish (−). Qo'shishda: qo'shiluvchilar va yig'indi; ayirishda: kamayuvchi, ayriluvchi va ayirma." },
      { id: "s1m3", nom: "20 ichida o'nlikdan o'tib qo'shish va ayirish", qisqa: "Avval 10 gacha to'ldiramiz, keyin qolganini qo'shamiz: 8 + 5 = 8 + 2 + 3 = 13. Ayirishda avval 10 gacha ayiramiz, keyin qolganini ayiramiz: 13 − 5 = 13 − 3 − 2 = 8." },
      { id: "s1m4", nom: "Shakllar va sodda masalalar", qisqa: "Uchburchak, to'rtburchak, doira; shaklning tomonlari va uchlari. Bir amalli matnli masalalar: «bo'ldi» — qo'shamiz, «qoldi» — ayiramiz." }] },
    2: { bosqich: "Boshlang'ich", mod: [
      { id: "s2m1", nom: "100 ichida qo'shish va ayirish", qisqa: "Ikki xonali sonlarni o'nliklar va birliklar bo'yicha qo'shish va ayirish, ustun usuli, o'nlikdan o'tish. Tekshirish: ayirmaga ayriluvchini qo'shsak, kamayuvchi hosil bo'ladi." },
      { id: "s2m2", nom: "Ko'paytirish va bo'lish jadvali (2–5)", qisqa: "Ko'paytirish — bir xil qo'shiluvchilar yig'indisi: 3 · 4 = 3 + 3 + 3 + 3. Bo'lish — ko'paytirishga teskari amal." },
      { id: "s2m3", nom: "Uzunlik, vaqt, massa birliklari", qisqa: "1 m = 10 dm = 100 sm, 1 soat = 60 daqiqa, 1 kg = 1000 g. Bir birlikdan boshqa birlikka o'tish." },
      { id: "s2m4", nom: "Matnli masalalar: narx, \"marta ko'p\"", qisqa: "«3 marta ko'p» — ko'paytiramiz, «3 marta kam» — bo'lamiz. Narx · miqdor = qiymat." }] },
    3: { bosqich: "Boshlang'ich", mod: [
      { id: "s3m1", nom: "Ko'paytirish va bo'lish jadvali (to'liq)", qisqa: "2 dan 9 gacha sonlarga ko'paytirish va bo'lish jadvali. Amallar tartibi: avval qavs ichidagi amallar, keyin ko'paytirish va bo'lish, so'ng qo'shish va ayirish." },
      { id: "s3m2", nom: "1000 ichida qo'shish va ayirish", qisqa: "Uch xonali sonlar: yuzliklar, o'nliklar, birliklar. Ustun usulida qo'shish va ayirish, keyingi xonaga o'tish." },
      { id: "s3m3", nom: "Jadvaldan tashqari ko'paytirish va bo'lish", qisqa: "Ikki xonali sonni bir xonali songa ko'paytirish: o'nliklar va birliklarni alohida ko'paytirib, natijalarni qo'shamiz. Qoldiqli bo'lish." },
      { id: "s3m4", nom: "Perimetr va ikki amalli masalalar", qisqa: "Perimetr — barcha tomonlar uzunliklarining yig'indisi. Kvadratning perimetri P = 4a, to'g'ri to'rtburchakniki P = 2(a + b)." }] },
    4: { bosqich: "Boshlang'ich", mod: [
      { id: "s4m1", nom: "Ko'p xonali sonlar", qisqa: "Minglar va millionlar sinfi; xona birliklari; sonlarni yaxlitlash va taqqoslash." },
      { id: "s4m2", nom: "Ustun ko'paytirish va burchakli bo'lish", qisqa: "Ko'p xonali sonni ikki xonali songa ustun usulida ko'paytirish, burchakli bo'lish, natijani teskari amal bilan tekshirish." },
      { id: "s4m3", nom: "Tezlik, vaqt, masofa", qisqa: "S = v · t, v = S : t, t = S : v. Qarama-qarshi yo'nalishda va bir tomonga harakatga doir masalalar." },
      { id: "s4m4", nom: "Yuza va ulushlar (kasr tushunchasi)", qisqa: "To'g'ri to'rtburchakning yuzi S = a · b (sm², m²). Sonning qismini topish: avval maxrajga bo'lamiz, keyin suratga ko'paytiramiz." }] },
    5: { bosqich: "Tayanch o'rta", mod: [
      { id: "s5m1", nom: "Natural sonlar va bo'linish", qisqa: "2, 3, 5, 9, 10 ga bo'linish belgilari; tub va murakkab sonlar; EKUB va EKUK." },
      { id: "s5m2", nom: "Oddiy kasrlar", qisqa: "Surat va maxraj, to'g'ri va noto'g'ri kasrlar, aralash son, kasrlarni qisqartirish, bir xil maxrajli kasrlar ustida amallar." },
      { id: "s5m3", nom: "O'nli kasrlar", qisqa: "O'nli kasrlarni o'qish va yozish, taqqoslash, qo'shish va ayirish, 10, 100, 1000 ga hamda natural songa ko'paytirish." },
      { id: "s5m4", nom: "Foizlar", qisqa: "1% — sonning yuzdan bir qismi. Sonning foizini topish, foiziga ko'ra sonni topish, narxning arzonlashishi va qimmatlashishi." },
      { id: "s5m5", nom: "Burchaklar va uchburchak", qisqa: "Burchak turlari, burchakni transportir bilan o'lchash, qo'shni va vertikal burchaklar, uchburchak burchaklari yig'indisi 180°." }] },
    6: { bosqich: "Tayanch o'rta", mod: [
      { id: "s6m1", nom: "Nisbat va proporsiya", qisqa: "a : b nisbat, proporsiyaning asosiy xossasi (a : b = c : d bo'lsa, a · d = b · c), to'g'ri va teskari proporsional miqdorlar, masshtab." },
      { id: "s6m2", nom: "Butun sonlar", qisqa: "Musbat va manfiy sonlar, sonning moduli, son o'qi, turli ishorali sonlarni qo'shish, ayirish, ko'paytirish va bo'lish." },
      { id: "s6m3", nom: "Ratsional sonlar ustida amallar", qisqa: "Turli maxrajli kasrlarni qo'shish va ayirish (umumiy maxrajga keltirib), kasrlarni ko'paytirish va bo'lish (bo'luvchiga teskari kasrga ko'paytirib)." },
      { id: "s6m4", nom: "Chiziqli tenglamalar", qisqa: "Hadlarni qarama-qarshi ishora bilan tenglamaning boshqa qismiga o'tkazish, o'xshash hadlarni ixchamlash, ax = b (a ≠ 0) dan x = b/a." },
      { id: "s6m5", nom: "Koordinata tekisligi", qisqa: "Abssissa va ordinata, koordinata choraklari, nuqtalarni belgilash, koordinatalar bo'yicha masofa." }] },
    7: { bosqich: "Tayanch o'rta", mod: [
      { id: "s7m1", nom: "Natural ko'rsatkichli daraja", qisqa: "aᵐ · aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ (a ≠ 0, m > n), (aᵐ)ⁿ = aᵐⁿ, (ab)ⁿ = aⁿbⁿ. Sonning standart shakli." },
      { id: "s7m2", nom: "Ko'phadlar va qisqa ko'paytirish formulalari", qisqa: "Birhad va ko'phad, o'xshash hadlarni ixchamlash, (a ± b)² = a² ± 2ab + b², a² − b² = (a − b)(a + b), ko'paytuvchilarga ajratish." },
      { id: "s7m3", nom: "Chiziqli tenglamalar sistemasi", qisqa: "O'rniga qo'yish va qo'shish usullari, grafik usul; sistemaning yechimi — ikkala tenglamani ham qanoatlantiradigan (x; y) sonlar jufti." },
      { id: "s7m4", nom: "Uchburchaklar va parallel to'g'ri chiziqlar", qisqa: "Uchburchaklar tengligi alomatlari, teng yonli uchburchak, uchburchak burchaklarining yig'indisi, parallel to'g'ri chiziqlar va kesuvchi hosil qilgan mos va ichki almashinuvchi burchaklar." }] },
    8: { bosqich: "Tayanch o'rta", mod: [
      { id: "s8m1", nom: "Kvadrat ildizlar", qisqa: "√(a²) = |a|, √(ab) = √a · √b (a ≥ 0, b ≥ 0), ko'paytuvchini ildiz belgisi ostidan chiqarish, irratsional sonlar.", qosh: ["t62"] },
      { id: "s8m2", nom: "Kvadrat tenglamalar", qisqa: "ax² + bx + c = 0 (a ≠ 0), diskriminant D = b² − 4ac, ildizlar formulasi, Vyet teoremasi, keltirilgan kvadrat tenglama.", qosh: ["t63"] },
      { id: "s8m3", nom: "To'rtburchaklar va Pifagor teoremasi", qisqa: "Parallelogramm, romb, to'g'ri to'rtburchak, trapetsiya xossalari; Pifagor teoremasi c² = a² + b²; yuzlar formulalari.", qosh: ["t72"] },
      { id: "s8m4", nom: "Algebraik kasrlar", qisqa: "Algebraik kasrning aniqlanish sohasi (maxraj ≠ 0), kasrlarni qisqartirish, umumiy maxrajga keltirish, kasrlar ustida amallar." }] },
    9: { bosqich: "Tayanch o'rta", mod: [
      { id: "s9m1", nom: "Kvadrat funksiya va kvadrat tengsizliklar", qisqa: "y = ax² + bx + c (a ≠ 0) funksiyaning grafigi — parabola: uchi, nollari, tarmoqlarining yo'nalishi; kvadrat tengsizlikni grafik usulda va intervallar usulida yechish.", qosh: ["t1", "t2"] },
      { id: "s9m2", nom: "Arifmetik va geometrik progressiya", qisqa: "aₙ = a₁ + (n − 1)d, Sₙ = (a₁ + aₙ) · n/2; bₙ = b₁qⁿ⁻¹, Sₙ = b₁(qⁿ − 1)/(q − 1) (q ≠ 1).", qosh: ["t54", "t55"] },
      { id: "s9m3", nom: "Trigonometriya asoslari", qisqa: "To'g'ri burchakli uchburchakda o'tkir burchakning sinusi, kosinusi va tangensi; 30°, 45°, 60° li burchaklar uchun ularning qiymatlari; asosiy trigonometrik ayniyat sin²α + cos²α = 1." },
      { id: "s9m4", nom: "Aylana, doira va o'xshashlik", qisqa: "Aylana uzunligi C = 2πr, doira yuzi S = πr², yoy uzunligi, sektor yuzi; uchburchaklar o'xshashligi alomatlari, o'xshash shakllar yuzlarining nisbati k².", qosh: ["t73", "t86"] },
      { id: "s9m5", nom: "Ehtimollik elementlari", qisqa: "Ehtimollikning klassik ta'rifi P = m/n, tasodifiy hodisalar, tajriba, nisbiy chastota va ehtimollik.", qosh: ["t92"] }] },
    10: { bosqich: "O'rta (Algebra 10 va Geometriya 10 — asosiy mavzular 1–50)", mod: [
      { id: "s10m1", nom: "Kvadrat funksiya, tengsizlik, progressiyalar, trigonometrik ayniyatlar", qisqa: "Parabola va kvadrat tengsizlik, arifmetik va geometrik progressiya, asosiy trigonometrik ayniyatlar va formulalar.", t: ["t1", "t2", "t3", "t4"] },
      { id: "s10m2", nom: "Funksiyalar", qisqa: "Funksiya tushunchasi, aniqlanish va qiymatlar sohasi, xossalari, grafiklarni almashtirish, chiziqli va kvadrat funksiyalar yordamida modellashtirish.", t: ["t5", "t6", "t7", "t8", "t9"] },
      { id: "s10m3", nom: "Ratsional va irratsional tenglamalar", qisqa: "Kasr-ratsional tenglamalar va tengsizliklar (aniqlanish sohasi, intervallar usuli), tenglamalar sistemalari; irratsional tenglamalar — ikkala qismini kvadratga ko'tarish va ildizlarni tekshirish.", t: ["t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18"] },
      { id: "s10m4", nom: "Ko'rsatkichli va logarifmik funksiyalar", qisqa: "y = aˣ va y = logₐ x funksiyalar (a > 0, a ≠ 1), ularning xossalari, ko'rsatkichli va logarifmik tenglamalar, tengsizliklar, sistemalar, ko'rsatkichli modellashtirish.", t: ["t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28"] },
      { id: "s10m5", nom: "Trigonometrik funksiyalar va tenglamalar", qisqa: "sin x, cos x, tg x, ctg x funksiyalarning grafiklari, teskari trigonometrik funksiyalar, sin x = a, cos x = a, tg x = a tenglamalar, trigonometrik tenglamalarni yechish usullari, sodda trigonometrik tengsizliklar.", t: ["t29", "t30", "t31", "t32", "t33", "t34", "t35", "t36"] },
      { id: "s10m6", nom: "Ehtimollik", qisqa: "Tasodifiy hodisalar, teng ehtimolli hodisalar, kombinatorika formulalari bilan ehtimollikni hisoblash.", t: ["t37", "t38", "t39"] },
      { id: "s10m7", nom: "Geometriya 10: planimetriya va stereometriya asoslari", qisqa: "Planimetriyaning mantiqiy tuzilishi, fazoda to'g'ri chiziq va tekisliklar, ularning o'zaro joylashuvi, ayqash to'g'ri chiziqlar, ko'pyoqlar, parallel proyeksiyalash.", t: ["t40", "t41", "t42", "t43", "t44", "t45", "t46", "t47", "t48", "t49", "t50"] }] },
    11: { bosqich: "O'rta (Algebra va analiz asoslari 11, Geometriya 11)", mod: [
      { id: "s11m1", nom: "Limit, hosila va uning tatbiqlari", qisqa: "Funksiyaning limiti, hosilaning ta'rifi va differensiallash formulalari, urinma, funksiyaning o'sishi va kamayishi, ekstremumlar, eng katta va eng kichik qiymatlar.", t: ["t59", "t60"] },
      { id: "s11m2", nom: "Integral va uning tatbiqlari", qisqa: "Boshlang'ich funksiya, aniqmas va aniq integral, Nyuton–Leybnits formulasi, egri chiziqli trapetsiya yuzi.", t: ["t70"] },
      { id: "s11m3", nom: "Kombinatorika va Nyuton binomi", qisqa: "Faktorial, qo'shish va ko'paytirish qoidalari, o'rin almashtirish, o'rinlashtirish, guruhlash, Nyuton binomi.", t: ["t89", "t90", "t91", "t96"] },
      { id: "s11m4", nom: "Statistika va ehtimollik", qisqa: "O'rta arifmetik qiymat, mediana, o'rtacha kvadratik chetlanish (standart chetlanish), diagrammalar, miqdorlar orasidagi bog'liqlik; ehtimolliklarni qo'shish va ko'paytirish qoidalari, to'plamlar va Eyler–Venn diagrammalari, binomial va normal taqsimot tushunchasi.", t: ["t57", "t99", "t100", "t101", "t92", "t93", "t94", "t95"] },
      { id: "s11m5", nom: "Geometriya 11: perpendikulyarlik, ko'pyoqlar va aylanma jismlar", qisqa: "Fazoda perpendikulyarlik, burchak va masofalar, prizma, piramida, silindr, konus, shar — ularning sirt yuzi va hajmi, ichki va tashqi chizilgan jismlar, kesimlar, fazoda koordinatalar.", t: ["t87", "t75", "t76", "t77", "t78", "t79", "t81", "t88", "t84"] }] }
  };

  // Modul test manbalari: o'z generatori + qo'shimcha (qosh) yoki asosiy mavzular (t)
  function modIds(m) { var a = []; if (G[m.id]) a.push(m.id); (m.t || []).concat(m.qosh || []).forEach(function (id) { if (S.has(id)) a.push(id); }); return a; }
  function gradeIds(k) { var a = []; MODULLAR[k].mod.forEach(function (m) { a = a.concat(modIds(m)); }); return a; }

  // s1…s11: sinfning barcha modullaridan aralash
  for (var k = 1; k <= 11; k++) (function (k) {
    G["s" + k] = function (L) { var ids = gradeIds(k), id = pick(ids); var p = S.get(id, L); if (!p) p = G.s1m2(L); p.grade = k; return p; };
    T["s" + k] = k + "-sinf savollari";
    MODULLAR[k].mod.forEach(function (m) { if (G[m.id]) T[m.id] = k + "-sinf · " + m.nom; });
  })(k);

  S.registerAll(G, T);
  window.kaSinf = { MODULLAR: MODULLAR, modIds: modIds, gradeIds: gradeIds };
})();
