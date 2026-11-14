/*! Kuvonch Academy — mavzu savollari: 37–50 (ehtimollik, planimetriya, stereometriya) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle, gcd = H.gcd, fr = H.fr, ms = H.ms, nearW = H.nearW;
  function wT(right, list) { return list.filter(function (x) { return x !== right; }); }
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function C(n, k) { return Math.round(fact(n) / (fact(k) * fact(n - k))); }
  function A(n, k) { return Math.round(fact(n) / fact(n - k)); }
  var G = {};

  /* ---- 37. Tasodifiy hodisalar ---- */
  G.t37 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3, 4] : [3, 4, 5, 6]);
    if (k === 0) { var tgt = R(1, 6);
      return { q: "Kubik (zar) tashlanadi. " + tgt + " raqami chiqish ehtimolini toping.", a: "1/6", hint: "kasr", type: "text",
        w: ["1/2", "1/3", "6", "5/6"], steps: ["Teng imkonli hodisalar soni n = 6", "Qulay hollar m = 1", "P = 1/6"] }; }
    if (k === 1) return { q: "Tanga tashlanadi. \"Gerb\" tushish ehtimolini toping.", a: "1/2", hint: "kasr", type: "text",
      w: ["1/4", "1", "1/3", "2"], steps: ["n = 2 (gerb yoki raqam), m = 1", "P = 1/2"] };
    if (k === 2) { var w2 = R(2, 9), b = R(2, 9), tot = w2 + b;
      return { q: "Qutida " + w2 + " oq va " + b + " qora shar bor. Tasodifiy olingan shar oq bo'lish ehtimolini toping.",
        a: fr(w2, tot), hint: "kasr", type: "text", w: [fr(b, tot), fr(tot, w2), fr(w2, b), "1/2"],
        steps: ["Jami sharlar: " + tot, "Qulay hollar: " + w2, "P = " + fr(w2, tot)] }; }
    if (k === 3) { var even = Math.random() < .5;
      return { q: "Kubik tashlanadi. " + (even ? "Juft" : "Toq") + " raqam chiqish ehtimolini toping.", a: "1/2", hint: "kasr", type: "text",
        w: ["1/3", "1/6", "2/3", "1/4"], steps: [(even ? "Juft: 2, 4, 6" : "Toq: 1, 3, 5") + " → m = 3", "P = 3/6 = 1/2"] }; }
    if (k === 4) { var lim = R(2, 5);
      var m = 6 - lim, fav = [];
      for (var d = lim + 1; d <= 6; d++) fav.push(d);
      return { q: "Kubik tashlanadi. " + lim + " dan katta raqam chiqish ehtimolini toping.", a: fr(m, 6), hint: "kasr", type: "text",
        w: [fr(lim, 6), fr(m + 1, 6), fr(m, 5), fr(m - 1 || 5, 6), "1/6", "5/6"], steps: ["Qulay raqamlar: " + fav.join(", ") + " → m = " + m, "P = " + m + "/6 = " + fr(m, 6)] }; }
    if (k === 5) { var p1 = R(1, 9), tot2 = 10;
      return { q: "Hodisaning ehtimoli " + fr(p1, tot2) + " bo'lsa, qarama-qarshi hodisa ehtimolini toping.",
        a: fr(tot2 - p1, tot2), hint: "kasr", type: "text", w: [fr(p1, tot2), fr(tot2, p1), "1", "0"],
        steps: ["P(Ā) = 1 − P(A)", "= 1 − " + fr(p1, tot2) + " = " + fr(tot2 - p1, tot2)] }; }
    return { q: "Ikki tanga tashlanadi. Ikkitasi ham \"gerb\" bo'lish ehtimolini toping.", a: "1/4", hint: "kasr", type: "text",
      w: ["1/2", "1/3", "3/4", "1/8"], steps: ["Barcha hollar: GG, GR, RG, RR → n = 4", "Qulay: GG → m = 1", "P = 1/4"] };
  };

  /* ---- 38. Kombinatorika ---- */
  G.t38 = function (L) {
    var k = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4, 5]);
    var n = R(4, L === 3 ? 9 : 7), m = R(2, Math.min(4, n - 1));
    if (k === 0) { var f = R(3, 7); return { q: f + "! ni hisoblang.", a: fact(f), hint: "son", w: [fact(f - 1), fact(f + 1), f * f, fact(f) + f],
      steps: [Array.from({ length: f }, function (_, i) { return i + 1; }).join("·") + " = " + fact(f)] }; }
    if (k === 1) return { q: "C(" + n + "; " + m + ") — " + n + " elementdan " + m + " tasini tanlash usullari sonini toping.",
      a: C(n, m), hint: "son", w: [A(n, m), C(n, m + 1) || C(n, m) + 2, n * m, C(n, m) + n].filter(function (x) { return x !== C(n, m); }),
      steps: ["C(n;k) = n!/(k!(n−k)!)", "C(" + n + ";" + m + ") = " + C(n, m)] };
    if (k === 2) return { q: n + " elementdan " + m + " tasini tartib bilan tanlash usullari soni (A(" + n + "; " + m + ")) nechaga teng?",
      a: A(n, m), hint: "son", w: [C(n, m), A(n, m) + n, n * m, fact(m)].filter(function (x) { return x !== A(n, m); }),
      steps: ["A(n;k) = n!/(n−k)!", "= " + A(n, m)] };
    if (k === 3) { var p = R(3, 6); return { q: p + " ta turli kitobni javonga nechta usulda terish mumkin?", a: fact(p), hint: "son",
      w: [fact(p - 1), p * p, fact(p) + p, C(p, 2)], steps: ["O'rin almashtirishlar soni = " + p + "! = " + fact(p)] }; }
    if (k === 4) { var g = R(3, 6), bb = R(3, 6), take = 2;
      var totC = C(g + bb, take), favC = C(g, take);
      return { q: "Qutida " + g + " ta qizil va " + bb + " ta ko'k shar bor. Tasodifiy 2 ta olinganda ikkisi ham qizil bo'lish ehtimolini toping.",
        a: fr(favC, totC), hint: "kasr", type: "text", w: [fr(C(bb, 2), totC), fr(g, g + bb), fr(favC, totC + 1), "1/2", fr(g * g, (g + bb) * (g + bb)), fr(favC + 1, totC), fr(g - 1, g + bb)],
        steps: ["Jami: C(" + (g + bb) + ";2) = " + totC, "Qulay: C(" + g + ";2) = " + favC, "P = " + fr(favC, totC)] }; }
    var dg = R(3, 5);
    return { q: "1, 2, 3, 4, 5 raqamlaridan (takrorlanmaydi) nechta " + dg + " xonali son tuzish mumkin?", a: A(5, dg), hint: "son",
      w: [C(5, dg), Math.pow(5, dg), fact(dg), A(5, dg) + 5], steps: ["A(5;" + dg + ") = 5!/(5−" + dg + ")! = " + A(5, dg)] };
  };

  /* ---- 39. Teng ehtimolli hodisalar ---- */
  G.t39 = function (L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2, 3]);
    if (k === 0) { var n = pick([10, 20, 25, 50, 100]), m = R(1, n - 1);
      return { q: n + " ta bilet ichida " + m + " tasi omadli. Tasodifiy olingan bilet omadli bo'lish ehtimolini toping.",
        a: fr(m, n), hint: "kasr", type: "text", w: [fr(n - m, n), fr(n, m), fr(m, n - m), "1/2"],
        steps: ["P = m/n = " + m + "/" + n + " = " + fr(m, n)] }; }
    if (k === 1) { var s = R(2, 12);
      var cnt = 0; for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) if (i + j === s) cnt++;
      return { q: "Ikki kubik tashlanadi. Raqamlar yig'indisi " + s + " bo'lish ehtimolini toping.", a: cnt ? fr(cnt, 36) : "0", hint: "kasr", type: "text",
        w: [fr(cnt + 1, 36), fr(cnt, 12), "1/6", "1/36"].filter(function (x) { return x !== (cnt ? fr(cnt, 36) : "0"); }),
        steps: ["Barcha hollar: 6·6 = 36", "Yig'indisi " + s + " bo'ladigan hollar: " + cnt + " ta", "P = " + (cnt ? fr(cnt, 36) : "0")] }; }
    if (k === 2) { var total = pick([30, 40, 50, 60]), girls = R(10, total - 10);
      return { q: "Guruhda " + total + " o'quvchi, shundan " + girls + " tasi qiz. Tasodifiy tanlangan o'quvchi o'g'il bola bo'lish ehtimolini toping.",
        a: fr(total - girls, total), hint: "kasr", type: "text", w: [fr(girls, total), fr(total, girls), fr(total - girls, girls), "1/2"],
        steps: ["O'g'il bolalar: " + (total - girls), "P = " + (total - girls) + "/" + total + " = " + fr(total - girls, total)] }; }
    var d = R(1, 9);
    return { q: "1 dan 100 gacha sonlardan biri tanlandi. U " + (d < 5 ? 10 : 5) + " ga bo'linish ehtimolini toping.",
      a: fr(100 / (d < 5 ? 10 : 5), 100), hint: "kasr", type: "text", w: ["1/100", "1/2", "1/3", fr(100 / (d < 5 ? 10 : 5) + 1, 100)],
      steps: [(d < 5 ? "10" : "5") + " ga bo'linuvchilar soni: " + 100 / (d < 5 ? 10 : 5), "P = " + fr(100 / (d < 5 ? 10 : 5), 100)] };
  };

  /* ---- 40. Planimetriyaning mantiqiy tuzilishi ---- */
  G.t40 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : [1, 2, 3, 4]);
    if (k === 0) return { q: "Uchburchak ichki burchaklari yig'indisi nechaga teng?", a: "180°", hint: "gradus", type: "text",
      w: ["90°", "360°", "270°", "540°"], steps: ["Uchburchak burchaklari yig'indisi haqidagi teorema: 180°"] };
    if (k === 1) { var n = R(3, 12); return { q: n + " burchakli ko'pburchak ichki burchaklari yig'indisini toping (gradus).",
      a: (n - 2) * 180, hint: "gradus", w: [(n - 1) * 180, n * 180, (n - 2) * 90, 360],
      steps: ["(n − 2)·180°", "(" + n + " − 2)·180° = " + (n - 2) * 180 + "°"] }; }
    if (k === 2) { var a = R(20, 120), b = R(20, 150 - a > 20 ? 150 - a : 30);
      var c = 180 - a - b; if (c <= 0) { a = 60; b = 50; c = 70; }
      return { q: "Uchburchakning ikki burchagi " + a + "° va " + b + "°. Uchinchi burchagini toping.", a: c + "°", hint: "gradus", type: "text",
        w: [(c + 10) + "°", (c - 10) + "°", (180 - c) + "°", (a + b) + "°"], steps: ["180° − " + a + "° − " + b + "° = " + c + "°"] }; }
    if (k === 3) { var st = pick([
      ["Aksioma", "isbotsiz qabul qilinadigan tasdiq"], ["Teorema", "isbotlanadigan tasdiq"],
      ["Xulosa (natija)", "teoremadan bevosita kelib chiqadigan tasdiq"], ["Ta'rif", "tushunchaning mazmunini ochib beruvchi bayon"]]);
      return { q: st[0] + " nima?", a: st[1], hint: "ta'rif", type: "text",
        w: wT(st[1], ["isbotsiz qabul qilinadigan tasdiq", "isbotlanadigan tasdiq", "teoremadan bevosita kelib chiqadigan tasdiq", "tushunchaning mazmunini ochib beruvchi bayon"]).slice(0, 3),
        steps: [st[0] + " — " + st[1]] }; }
    var ang = R(10, 80);
    return { q: ang + "° burchakka qo'shni burchakni toping.", a: (180 - ang) + "°", hint: "gradus", type: "text",
      w: [(90 - ang) + "°", (360 - ang) + "°", ang + "°", (180 + ang) + "°"],
      steps: ["Qo'shni burchaklar yig'indisi 180°", "180° − " + ang + "° = " + (180 - ang) + "°"] };
  };

  function kpi(k) { return (k === 1 ? "" : k) + "π"; }
  /* ---- 41. Geometrik masalalar ---- */
  G.t41 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    if (k === 0) { var a = R(2, 15), b = R(2, 15);
      return { q: "To'g'ri to'rtburchakning tomonlari " + a + " va " + b + ". Yuzini toping.", a: a * b, hint: "yuz", w: [2 * (a + b), a + b, a * b + a, a * b - b].filter(function (x) { return x !== a * b; }),
        steps: ["S = a·b = " + a + "·" + b + " = " + a * b] }; }
    if (k === 1) { var base = R(2, 16), h = 2 * R(1, 9);
      return { q: "Uchburchakning asosi " + base + ", balandligi " + h + ". Yuzini toping.", a: base * h / 2, hint: "yuz",
        w: [base * h, base + h, base * h / 2 + base, base * h / 2 - 2].filter(function (x) { return x !== base * h / 2; }),
        steps: ["S = (a·h)/2 = (" + base + "·" + h + ")/2 = " + base * h / 2] }; }
    if (k === 2) { var tri = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);
      return { q: "To'g'ri burchakli uchburchakning katetlari " + tri[0] + " va " + tri[1] + ". Gipotenuzani toping.", a: tri[2], hint: "son",
        w: [tri[0] + tri[1], tri[2] + 1, tri[2] - 1, tri[1] - tri[0]], steps: ["c² = a² + b² = " + tri[0] * tri[0] + " + " + tri[1] * tri[1] + " = " + tri[2] * tri[2], "c = " + tri[2]] }; }
    if (k === 3) { var r = R(1, 12);
      return { q: "Radiusi " + r + " bo'lgan aylananing uzunligini π orqali yozing.", a: kpi(2 * r), hint: "k·π", type: "text",
        w: [kpi(r * r), kpi(r), kpi(4 * r), kpi(r * 2 + 1)], steps: ["C = 2πr = 2π·" + r + " = " + kpi(2 * r)] }; }
    if (k === 4) { var r2 = R(1, 12);
      return { q: "Radiusi " + r2 + " bo'lgan doiraning yuzini π orqali yozing.", a: kpi(r2 * r2), hint: "k·π", type: "text",
        w: [kpi(2 * r2), kpi(r2 * r2 + 1), kpi(4 * r2), kpi(r2 * r2 + 2 * r2), kpi(r2 + 1)], steps: ["S = πr² = π·" + r2 + "² = " + kpi(r2 * r2)] }; }
    var s = R(2, 15);
    return { q: "Tomoni " + s + " bo'lgan kvadratning diagonalini ildiz ko'rinishida yozing.", a: s + "√2", hint: "k√2", type: "text",
      w: [s + "√3", (2 * s) + "√2", s * s + "√2", s + "√2/2"], steps: ["d = a√2 = " + s + "√2"] };
  };

  /* ---- 42. Stereometriyaning asosiy tushunchalari ---- */
  G.t42 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : [1, 2, 3, 4]);
    if (k === 0) return { q: "Bir to'g'ri chiziqda yotmaydigan uch nuqta orqali nechta tekislik o'tadi?", a: 1, hint: "son", w: [0, 2, 3, "cheksiz ko'p"],
      steps: ["Stereometriya aksiomasi: bir to'g'ri chiziqda yotmaydigan uch nuqta orqali faqat bitta tekislik o'tadi"] };
    if (k === 1) return { q: "Ikki har xil nuqta orqali nechta to'g'ri chiziq o'tadi?", a: 1, hint: "son", w: [0, 2, 3, "cheksiz ko'p"],
      steps: ["Ikki nuqta orqali faqat bitta to'g'ri chiziq o'tadi"] };
    if (k === 2) return { q: "Bitta to'g'ri chiziq orqali nechta tekislik o'tishi mumkin?", a: "cheksiz ko'p", hint: "son/so'z", type: "text",
      w: ["1", "2", "3", "0"], steps: ["To'g'ri chiziq atrofida tekisliklar cheksiz ko'p holatda joylashadi"] };
    if (k === 3) return { q: "To'g'ri chiziq va unda yotmaydigan nuqta orqali nechta tekislik o'tadi?", a: 1, hint: "son", w: [0, 2, 3, "cheksiz ko'p"],
      steps: ["To'g'ri chiziq va undan tashqaridagi nuqta orqali faqat bitta tekislik o'tadi"] };
    return { q: "Ikki tekislik kesishsa, kesishma nimadan iborat bo'ladi?", a: "to'g'ri chiziq", hint: "shakl", type: "text",
      w: ["nuqta", "tekislik", "kesma", "aylana"], steps: ["Aksioma: ikki tekislikning umumiy nuqtasi bo'lsa, ular to'g'ri chiziq bo'yicha kesishadi"] };
  };

  /* ---- 43. Fazoda to'g'ri chiziqlar va tekisliklar ---- */
  G.t43 = function (L) {
    var k = pick([0, 1, 2, 3]);
    if (k === 0) return { q: "Fazoda ikki to'g'ri chiziq nechta xil holatda joylashishi mumkin?", a: 3, hint: "son", w: [1, 2, 4, 5],
      steps: ["Kesishuvchi, parallel, ayqash — 3 xil holat"] };
    if (k === 1) return { q: "To'g'ri chiziq va tekislik nechta xil holatda joylashishi mumkin?", a: 3, hint: "son", w: [1, 2, 4, 5],
      steps: ["Tekislikda yotadi, parallel, bitta nuqtada kesishadi — 3 xil holat"] };
    if (k === 2) return { q: "To'g'ri chiziq tekislikka parallel bo'lishi uchun nima yetarli?", a: "tekislikdagi biror to'g'ri chiziqqa parallel bo'lishi", hint: "shart", type: "text",
      w: ["tekislikka tegib o'tishi", "tekislikda yotishi", "tekislikka perpendikulyar bo'lishi"],
      steps: ["Parallellik belgisi: to'g'ri chiziq tekislikdagi biror to'g'ri chiziqqa parallel va tekislikda yotmasa, u tekislikka parallel"] };
    return { q: "To'g'ri chiziq tekislikni kessa, umumiy nuqtalari soni nechta?", a: 1, hint: "son", w: [0, 2, "cheksiz ko'p", 3],
      steps: ["Kesishgan holatda faqat bitta umumiy nuqta bo'ladi"] };
  };

  /* ---- 44. Fazoviy shakllar. Ko'pyoqlar ---- */
  G.t44 = function (L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3] : [3, 4, 5]);
    if (k === 0) { var a = R(2, 12), b = R(2, 12), c = R(2, 12);
      return { q: a + "×" + b + "×" + c + " o'lchamli parallelepiped hajmini toping.", a: a * b * c, hint: "hajm",
        w: [2 * (a * b + b * c + a * c), a + b + c, a * b, a * b * c + a], steps: ["V = abc = " + a * b * c] }; }
    if (k === 1) { var s = R(2, 10); return { q: "Qirrasi " + s + " bo'lgan kubning hajmini toping.", a: s * s * s, hint: "hajm",
      w: [6 * s * s, s * s, 12 * s, s * s * s + s], steps: ["V = a³ = " + s + "³ = " + s * s * s] }; }
    if (k === 2) { var s2 = R(2, 10); return { q: "Qirrasi " + s2 + " bo'lgan kubning to'liq sirtini toping.", a: 6 * s2 * s2, hint: "yuz",
      w: [s2 * s2 * s2, 4 * s2 * s2, s2 * s2, 12 * s2], steps: ["S = 6a² = 6·" + s2 * s2 + " = " + 6 * s2 * s2] }; }
    if (k === 3) { var n = R(3, 8);
      return { q: n + " burchakli prizmaning qirralari sonini toping.", a: 3 * n, hint: "son", w: [2 * n, n + 2, 4 * n, 3 * n + 1],
        steps: ["Prizmada: " + 2 * n + " ta asos qirrasi + " + n + " ta yon qirra", "Jami: " + 3 * n] }; }
    if (k === 4) { var n2 = R(3, 8);
      return { q: n2 + " burchakli piramidaning yoqlari sonini toping.", a: n2 + 1, hint: "son", w: [n2, 2 * n2, n2 + 2, 3 * n2],
        steps: [n2 + " ta yon yoq + 1 ta asos = " + (n2 + 1)] }; }
    // faqat mavjud ko'pyoqlar (prizma, piramida, Platon jismlari)
    var nn = R(3, 10), tp = pick([0, 1, 2]), pv = tp === 0 ? [2 * nn, 3 * nn, nn + " burchakli prizma"] : tp === 1 ? [nn + 1, 2 * nn, nn + " burchakli piramida"]
      : pick([[4, 6, "tetraedr"], [8, 12, "kub"], [6, 12, "oktaedr"], [20, 30, "dodekaedr"], [12, 30, "ikosaedr"]]);
    var V = pv[0], E = pv[1], Fc = 2 - V + E;
    return { q: "Ko'pyoqda uchlari " + V + " ta, qirralari " + E + " ta. Eyler formulasi bo'yicha yoqlari sonini toping.",
      a: Fc, hint: "son", w: nearW(Fc, 4, 3).filter(function (x) { return x > 0; }),
      steps: ["U − Q + Y = 2 → Y = 2 − U + Q", "Y = 2 − " + V + " + " + E + " = " + Fc, "(Masalan: " + pv[2] + ")"] };
  };

  /* ---- 45. Ko'pyoqlarni tasvirlash ---- */
  G.t45 = function (L) {
    var k = pick([0, 1, 2, 3]);
    if (k === 0) return { q: "Kubning yoyilmasi nechta kvadratdan iborat?", a: 6, hint: "son", w: [4, 5, 8, 12],
      steps: ["Kubda 6 ta yoq bor → yoyilmasida 6 ta kvadrat"] };
    if (k === 1) return { q: "To'g'ri to'rtburchakli parallelepipedda nechta uch (vertex) bor?", a: 8, hint: "son", w: [6, 12, 4, 10],
      steps: ["Parallelepipedda 8 ta uch, 12 ta qirra, 6 ta yoq"] };
    if (k === 2) return { q: "Tetraedrda nechta yoq bor?", a: 4, hint: "son", w: [3, 5, 6, 8],
      steps: ["Tetraedr — 4 ta uchburchak yoqdan iborat piramida"] };
    var n = R(3, 7);
    return { q: n + " burchakli prizmada nechta uch bor?", a: 2 * n, hint: "son", w: [n, 3 * n, n + 2, 2 * n + 2],
      steps: ["Ikki asosda " + n + " + " + n + " = " + 2 * n + " ta uch"] };
  };

  /* ---- 46. To'g'ri chiziqlarning o'zaro joylashuvi ---- */
  G.t46 = function (L) {
    var k = pick([0, 1, 2]);
    if (k === 0) return { q: "Bir tekislikda yotuvchi va umumiy nuqtasi bo'lmagan to'g'ri chiziqlar qanday nomlanadi?",
      a: "parallel", hint: "nom", type: "text", w: ["ayqash", "kesishuvchi", "perpendikulyar"],
      steps: ["Bir tekislikda yotib kesishmasa — parallel to'g'ri chiziqlar"] };
    if (k === 1) return { q: "Bir tekislikda yotmaydigan to'g'ri chiziqlar qanday nomlanadi?", a: "ayqash", hint: "nom", type: "text",
      w: ["parallel", "kesishuvchi", "ustma-ust"], steps: ["Hech qanday umumiy tekislikda yotmasa — ayqash to'g'ri chiziqlar"] };
    return { q: "Ikki to'g'ri chiziqning bitta umumiy nuqtasi bo'lsa, ular qanday joylashgan?", a: "kesishuvchi", hint: "nom", type: "text",
      w: ["parallel", "ayqash", "ustma-ust"], steps: ["Bitta umumiy nuqta → kesishuvchi to'g'ri chiziqlar"] };
  };

  /* ---- 47. Ayqash to'g'ri chiziqlar ---- */
  G.t47 = function (L) {
    var k = pick([0, 1, 2]);
    if (k === 0) return { q: "Ayqash to'g'ri chiziqlar bir tekislikda yotadimi?", a: "yo'q", hint: "ha / yo'q", type: "text", w: ["ha"],
      steps: ["Ayqash to'g'ri chiziqlar ta'rifi: ular hech qanday bitta tekislikda yotmaydi"] };
    if (k === 1) return { q: "Kubda bitta qirra bilan ayqash bo'lgan qirralar soni nechta?", a: 4, hint: "son", w: [2, 3, 6, 8],
      steps: ["Tanlangan qirra bilan: 1 ta parallel juftlik emas, 4 ta kesishuvchi, 4 ta ayqash", "Javob: 4"] };
    return { q: "Ayqash to'g'ri chiziqlar orasidagi burchak qanday topiladi?",
      a: "biriga parallel to'g'ri chiziq o'tkazib, kesishuvchi burchak o'lchanadi", hint: "usul", type: "text",
      w: ["ularning uzunliklari taqqoslanadi", "tekislik bilan burchak o'lchanadi", "0° deb olinadi"],
      steps: ["Bitta nuqtadan ikkisiga parallel to'g'ri chiziqlar o'tkaziladi va ular orasidagi burchak olinadi"] };
  };

  /* ---- 48. To'g'ri chiziq va tekislik joylashuvi ---- */
  G.t48 = function (L) {
    var k = pick([0, 1, 2]);
    if (k === 0) return { q: "To'g'ri chiziq tekislikka parallel bo'lsa, ularning umumiy nuqtalari soni nechta?", a: 0, hint: "son", w: [1, 2, "cheksiz ko'p", 3],
      steps: ["Parallel bo'lsa umumiy nuqta bo'lmaydi → 0"] };
    if (k === 1) return { q: "To'g'ri chiziq tekislikda yotsa, umumiy nuqtalari soni nechta?", a: "cheksiz ko'p", hint: "son/so'z", type: "text",
      w: ["0", "1", "2", "3"], steps: ["To'g'ri chiziqning barcha nuqtalari tekislikka tegishli bo'ladi"] };
    return { q: "To'g'ri chiziq tekislikka perpendikulyar bo'lishi uchun nima kerak?",
      a: "tekislikdagi kesishuvchi ikki to'g'ri chiziqqa perpendikulyar bo'lishi", hint: "shart", type: "text",
      w: ["tekislikdagi bitta to'g'ri chiziqqa perpendikulyar bo'lishi", "tekislikka parallel bo'lishi", "tekislikda yotishi"],
      steps: ["Perpendikulyarlik belgisi: kesishuvchi ikki to'g'ri chiziqqa perpendikulyar bo'lsa, tekislikka perpendikulyar"] };
  };

  /* ---- 49. Tekisliklarning o'zaro joylashuvi ---- */
  G.t49 = function (L) {
    var k = pick([0, 1, 2]);
    if (k === 0) return { q: "Fazoda ikki tekislik nechta xil holatda joylashishi mumkin?", a: 2, hint: "son", w: [1, 3, 4, 5],
      steps: ["Parallel yoki to'g'ri chiziq bo'yicha kesishadi — 2 xil holat"] };
    if (k === 1) return { q: "Parallel tekisliklarning umumiy nuqtalari soni nechta?", a: 0, hint: "son", w: [1, 2, "cheksiz ko'p", 3],
      steps: ["Parallel tekisliklar kesishmaydi → 0"] };
    return { q: "Uchinchi tekislik ikki parallel tekislikni kessa, kesishma chiziqlari qanday bo'ladi?", a: "parallel", hint: "nom", type: "text",
      w: ["ayqash", "kesishuvchi", "perpendikulyar"], steps: ["Teorema: parallel tekisliklarni kesuvchi tekislik ulardan parallel chiziqlar ajratadi"] };
  };

  /* ---- 50. Fazoda parallel proyeksiyalash ---- */
  G.t50 = function (L) {
    var k = pick([0, 1, 2, 3]);
    if (k === 0) return { q: "Parallel proyeksiyalashda to'g'ri chiziqning proyeksiyasi nima bo'ladi (proyeksiyalash yo'nalishiga parallel bo'lmasa)?",
      a: "to'g'ri chiziq", hint: "shakl", type: "text", w: ["nuqta", "aylana", "kesma", "egri chiziq"],
      steps: ["Parallel proyeksiyalash to'g'ri chiziqni to'g'ri chiziqqa o'tkazadi"] };
    if (k === 1) return { q: "Parallel proyeksiyalashda parallel kesmalarning nisbati saqlanadimi?", a: "ha", hint: "ha / yo'q", type: "text", w: ["yo'q"],
      steps: ["Parallel proyeksiyalash kesmalar nisbatini saqlaydi"] };
    if (k === 2) return { q: "Parallel proyeksiyalashda burchak kattaligi har doim saqlanadimi?", a: "yo'q", hint: "ha / yo'q", type: "text", w: ["ha"],
      steps: ["Burchaklar o'zgarishi mumkin — faqat parallellik va nisbatlar saqlanadi"] };
    return { q: "Kub tasvirida ko'rinmas qirralar qanday chiziq bilan ko'rsatiladi?", a: "punktir (uzuq) chiziq", hint: "chiziq turi", type: "text",
      w: ["qalin to'liq chiziq", "qizil chiziq", "ikki qatorli chiziq"], steps: ["Chizmada ko'rinmas qirralar punktir chiziq bilan tasvirlanadi"] };
  };

  S.registerAll(G, {
    t37: "Tasodifiy hodisalar", t38: "Ehtimollikda kombinatorika formulalari", t39: "Teng ehtimolli hodisalar",
    t40: "Planimetriyaning mantiqiy tuzilishi", t41: "Geometrik masalalar va yechish usullari", t42: "Stereometriyaning asosiy tushunchalari",
    t43: "Fazoda to'g'ri chiziqlar va tekisliklar", t44: "Fazoviy geometrik shakllar. Ko'pyoqlar", t45: "Ko'pyoqlarni tasvirlash va modeli",
    t46: "Fazoda to'g'ri chiziqlarning o'zaro joylashuvi", t47: "Ayqash to'g'ri chiziqlar",
    t48: "Fazoda to'g'ri chiziq va tekisliklarning joylashuvi", t49: "Fazoda tekisliklarning o'zaro joylashuvi", t50: "Fazoda parallel proyeksiyalash"
  });
})();
