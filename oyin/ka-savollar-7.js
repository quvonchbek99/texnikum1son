/*! Kuvonch Academy — mavzu savollari: 71–79 (geometriya: shakllar va jismlar xossalari) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle, nearW = H.nearW;
  var G = {};

  /* ---------- yordamchilar ---------- */
  function uniq(a) { var s = {}, o = []; a.forEach(function (x) { x = String(x); if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  function numQ(q, a, steps, extra) {
    var ws = nearW(a, 4, Math.max(2, Math.round(Math.abs(a) * 0.25))).filter(function (x) { return x > 0 && x !== a; });
    return { q: q, a: a, hint: "son", w: (extra || []).concat(ws).filter(function (x) { return x !== a && x > 0; }).slice(0, 5), steps: steps };
  }
  function txtQ(q, a, w, steps, hint) { return { q: q, a: a, hint: hint || "javob", type: "text", w: uniq(w).filter(function (x) { return x !== String(a); }).slice(0, 4), steps: steps }; }
  function bank(list) { var it = pick(list); return txtQ(it[0], it[1], it[2], it[3]); }
  function pi(k) { k = +k; return (k === 1 ? "" : k) + "π"; }
  function piQ(q, k, steps, extra) {
    var w = (extra || []).concat([k + 1, k - 1, 2 * k, k * 2 + 1, Math.max(1, Math.round(k / 2)), k + 2, 4 * k, k + 3]).filter(function (x) { return x > 0 && x !== k; });
    return txtQ(q, pi(k), uniq(w).map(pi), steps, "π ko'paytmasi");
  }
  function rootQ(q, k, r, steps, extra) { // k√r
    var w = (extra || []).concat([k + 1, k - 1, 2 * k, k * 2 + 2, k + 2]).filter(function (x) { return x > 0 && x !== k; });
    var f = function (x) { x = +x; return (x === 1 ? "" : x) + "√" + r; };
    return txtQ(q, f(k), uniq(w).map(f), steps, "ildizli ifoda");
  }
  var TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  var TRI_S = TRI.slice(0, 4);
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }

  /* ================= 71. Uchburchak ================= */
  var T71 = [
    ["Uchburchak ichki burchaklarining yig'indisi nechaga teng?", "180°", ["90°", "360°", "270°"], ["Har qanday uchburchakda ichki burchaklar yig'indisi 180°"]],
    ["Teng tomonli uchburchakning har bir burchagi necha gradus?", "60°", ["45°", "90°", "30°"], ["180° : 3 = 60°"]],
    ["Uchburchakning tashqi burchagi nimaga teng?", "o'ziga qo'shni bo'lmagan ikki ichki burchak yig'indisiga", ["qo'shni ichki burchakka", "uchala ichki burchak yig'indisiga", "180° ga"], ["Tashqi burchak teoremasi"]],
    ["Uchburchakda katta tomon qarshisida qanday burchak yotadi?", "katta burchak", ["kichik burchak", "to'g'ri burchak", "teng burchak"], ["Katta tomon qarshisida katta burchak yotadi"]],
    ["Uchburchak tengsizligi qanday yoziladi (a, b, c — tomonlar)?", "a < b + c", ["a > b + c", "a = b + c", "a + b + c = 180"], ["Har bir tomon qolgan ikki tomon yig'indisidan kichik"]],
    ["To'g'ri burchakli uchburchakda gipotenuza qaysi tomon?", "to'g'ri burchak qarshisidagi tomon", ["eng qisqa tomon", "katetlardan biri", "balandlik"], ["Gipotenuza — to'g'ri burchak qarshisida, eng uzun tomon"]],
    ["Teng yonli uchburchakda qaysi burchaklar teng?", "asosidagi burchaklar", ["uchidagi burchak va asosidagi biri", "hamma burchaklar", "tashqi burchaklar"], ["Teng yonli uchburchakda asosdagi burchaklar teng"]],
    ["Uchburchakning medianalari qanday nisbatda kesishadi?", "uchdan hisoblaganda 2 : 1", ["1 : 1", "3 : 1", "1 : 2 (uchdan)"], ["Medianalar kesishish nuqtasida uchdan hisoblab 2:1 nisbatda bo'linadi"]],
    ["Uchburchakning o'rta chizig'i nimaga teng?", "parallel tomonning yarmiga", ["parallel tomonga", "ikki tomon yig'indisiga", "balandlikka"], ["O'rta chiziq uchinchi tomonga parallel va uning yarmiga teng"]],
    ["Bissektrisalar kesishgan nuqta qaysi aylananing markazi?", "ichki chizilgan aylana", ["tashqi chizilgan aylana", "o'rta chiziq", "hech qaysi"], ["Bissektrisalar — ichki chizilgan aylana markazida kesishadi"]],
    ["O'rta perpendikulyarlar kesishgan nuqta qaysi aylananing markazi?", "tashqi chizilgan aylana", ["ichki chizilgan aylana", "mediana", "hech qaysi"], ["Tomonlarning o'rta perpendikulyarlari tashqi aylana markazida kesishadi"]],
    ["To'g'ri burchakli uchburchakda tashqi chizilgan aylana markazi qayerda?", "gipotenuzaning o'rtasida", ["to'g'ri burchak uchida", "katetning o'rtasida", "uchburchak tashqarisida"], ["Gipotenuza — tashqi aylananing diametri"]]
  ];
  G.t71 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 12], [0, 1, 2, 3, 5, 6, 7, 8, 12], [3, 5, 6, 7, 8, 9, 10, 11, 12]));
    if (k === 0) { var a = R(30, 80), b = R(30, 70);
      return numQ("Uchburchakning ikki burchagi " + a + "° va " + b + "°. Uchinchi burchagini toping (gradusda).", 180 - a - b, ["180° − (" + a + "° + " + b + "°) = " + (180 - a - b) + "°"]); }
    if (k === 1) { var x = R(30, 70), y = R(30, 80);
      return numQ("Uchburchakning ichki burchaklari " + x + "° va " + y + "°. Uchinchi burchagiga qo'shni tashqi burchakni toping.", x + y, ["Tashqi burchak = ikki ichki burchak yig'indisi", x + "° + " + y + "° = " + (x + y) + "°"]); }
    if (k === 2) { var ap = pick([20, 30, 40, 50, 80, 100, 120]);
      return numQ("Teng yonli uchburchakning uchidagi burchagi " + ap + "°. Asosidagi burchagini toping.", (180 - ap) / 2, ["(180° − " + ap + "°) : 2 = " + (180 - ap) / 2 + "°"]); }
    if (k === 3) { var t = pick(lv(L, TRI_S, TRI_S, TRI)), m = R(1, L === 3 ? 3 : 2), hyp = Math.random() < .5;
      var a1 = t[0] * m, b1 = t[1] * m, c1 = t[2] * m;
      return hyp ? numQ("To'g'ri burchakli uchburchakning katetlari " + a1 + " va " + b1 + ". Gipotenuzasini toping.", c1, ["c² = " + a1 + "² + " + b1 + "² = " + (a1 * a1 + b1 * b1), "c = " + c1])
                 : numQ("To'g'ri burchakli uchburchakning gipotenuzasi " + c1 + ", bir kateti " + a1 + ". Ikkinchi katetini toping.", b1, ["b² = " + c1 + "² − " + a1 + "² = " + (b1 * b1), "b = " + b1]); }
    if (k === 4) { var c = R(2, 12) * 2;
      return numQ("To'g'ri burchakli uchburchakning bir o'tkir burchagi 30°, gipotenuzasi " + c + ". 30° qarshisidagi katetni toping.", c / 2, ["30° qarshisidagi katet gipotenuzaning yarmiga teng", c + " : 2 = " + c / 2]); }
    if (k === 5) { var base = R(3, 14) * 2, h = R(2, 12);
      return numQ("Uchburchakning asosi " + base + ", unga tushirilgan balandligi " + h + ". Yuzini toping.", base * h / 2, ["S = (1/2)·a·h = (1/2)·" + base + "·" + h + " = " + base * h / 2]); }
    if (k === 6) { var tr = pick([[13, 14, 15, 84], [5, 5, 6, 12], [6, 25, 29, 60], [9, 10, 17, 36], [10, 13, 13, 60], [8, 15, 17, 60], [7, 15, 20, 42]]);
      var p = (tr[0] + tr[1] + tr[2]) / 2;
      return numQ("Tomonlari " + tr[0] + ", " + tr[1] + ", " + tr[2] + " bo'lgan uchburchakning yuzini Geron formulasi bilan toping.", tr[3],
        ["p = " + p, "S = √(p(p−a)(p−b)(p−c)) = √(" + p + "·" + (p - tr[0]) + "·" + (p - tr[1]) + "·" + (p - tr[2]) + ")", "S = " + tr[3]]); }
    if (k === 7) { var bs = R(3, 20) * 2;
      return numQ("Uchburchakning tomoni " + bs + ". Shu tomonga parallel o'rta chizig'ini toping.", bs / 2, ["O'rta chiziq = tomonning yarmi", bs + " : 2 = " + bs / 2]); }
    if (k === 8) { var tt = pick([[3, 4, 5, 1], [5, 12, 13, 2], [8, 15, 17, 3], [6, 8, 10, 2], [9, 12, 15, 3]]);
      return numQ("Katetlari " + tt[0] + " va " + tt[1] + " bo'lgan to'g'ri burchakli uchburchakka ichki chizilgan aylana radiusini toping.", tt[3],
        ["Gipotenuza = " + tt[2], "r = (a + b − c)/2 = (" + tt[0] + " + " + tt[1] + " − " + tt[2] + ")/2 = " + tt[3]]); }
    if (k === 9) { var cc = R(3, 14) * 2;
      return numQ("To'g'ri burchakli uchburchakning gipotenuzasi " + cc + ". Gipotenuzaga tushirilgan medianani toping.", cc / 2, ["Mediana gipotenuzaning yarmiga teng", cc + " : 2 = " + cc / 2]); }
    if (k === 10) { var a2 = pick([2, 4, 6, 8, 10]);
      return rootQ("Tomoni " + a2 + " bo'lgan teng tomonli uchburchakning yuzini toping.", a2 * a2 / 4, 3, ["S = a²√3/4 = " + a2 * a2 + "√3/4 = " + a2 * a2 / 4 + "√3"]); }
    if (k === 11) { var A = R(3, 9), B = R(3, 9), C2 = A + B + pick([-1, 1, 0, 2, -2]) , ok = C2 < A + B && C2 > Math.abs(A - B) && C2 > 0;
      return txtQ("Tomonlari " + A + ", " + B + " va " + C2 + " bo'lgan uchburchak mavjudmi?", ok ? "ha" : "yo'q", [ok ? "yo'q" : "ha", "aniqlab bo'lmaydi"],
        ["Har bir tomon qolgan ikkitasining yig'indisidan kichik bo'lishi kerak", "Eng katta tomon: " + Math.max(A, B, C2) + ", qolganlar yig'indisi: " + (A + B + C2 - Math.max(A, B, C2))], "ha / yo'q"); }
    return bank(T71);
  };

  /* ================= 72. To'rtburchaklar ================= */
  var T72 = [
    ["Parallelogrammning diagonallari qanday xossaga ega?", "kesishish nuqtasida teng ikkiga bo'linadi", ["o'zaro teng", "o'zaro perpendikulyar", "burchaklarni teng ikkiga bo'ladi"], ["Parallelogramm diagonallari kesishish nuqtasida teng ikkiga bo'linadi"]],
    ["Parallelogrammning qo'shni burchaklari yig'indisi nechaga teng?", "180°", ["90°", "360°", "270°"], ["Qo'shni burchaklar yig'indisi 180°"]],
    ["Qaysi to'rtburchakning diagonallari teng?", "to'g'ri to'rtburchak", ["romb", "ixtiyoriy parallelogramm", "ixtiyoriy trapetsiya"], ["To'g'ri to'rtburchak va kvadrat diagonallari teng"]],
    ["Rombning diagonallari qanday joylashgan?", "o'zaro perpendikulyar", ["o'zaro parallel", "har doim teng", "bir to'g'ri chiziqda"], ["Romb diagonallari perpendikulyar va burchaklarni teng ikkiga bo'ladi"]],
    ["Kvadrat rombmi?", "ha, barcha tomonlari teng", ["yo'q", "faqat diagonallari teng bo'lsa", "faqat 90° bo'lsa"], ["Kvadrat — burchaklari to'g'ri romb"]],
    ["Kvadrat to'g'ri to'rtburchakmi?", "ha, burchaklari 90°", ["yo'q", "faqat tomoni 1 bo'lsa", "faqat diagonali teng bo'lsa"], ["Kvadrat — tomonlari teng to'g'ri to'rtburchak"]],
    ["Trapetsiyaning o'rta chizig'i nimaga teng?", "asoslari yig'indisining yarmiga", ["asoslari ayirmasiga", "asoslari ko'paytmasiga", "balandligiga"], ["m = (a + b)/2"]],
    ["Trapetsiya yuzi formulasi qaysi?", "S = (a + b)/2 · h", ["S = a · h", "S = (a · b)/2", "S = a + b + h"], ["O'rta chiziq × balandlik"]],
    ["Teng yonli trapetsiyada nima teng bo'ladi?", "yon tomonlari va diagonallari", ["asoslari", "faqat balandligi", "hech narsa"], ["Teng yonli trapetsiyada diagonallar teng va asosdagi burchaklar teng"]],
    ["Trapetsiyaga aylana ichki chizilishi uchun qanday shart kerak?", "asoslar yig'indisi yon tomonlar yig'indisiga teng", ["asoslari teng", "diagonallari teng", "balandligi asosdan katta"], ["To'rtburchakka aylana ichki chizilsa, qarama-qarshi tomonlar yig'indilari teng", "Trapetsiyada: a + b = c + d (asoslar yig'indisi = yon tomonlar yig'indisi)"]],
    ["Rombning yuzi diagonallar orqali qanday topiladi?", "S = d₁·d₂ / 2", ["S = d₁ + d₂", "S = d₁·d₂", "S = (d₁ + d₂)/2"], ["Yuz diagonallar ko'paytmasining yarmi"]]
  ];
  G.t72 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 12], [0, 2, 3, 4, 5, 6, 7, 8, 12], [4, 5, 6, 7, 8, 9, 10, 11, 12]));
    if (k === 0) { var al = pick([50, 60, 70, 75, 110, 120]);
      return numQ("Parallelogrammning bir burchagi " + al + "°. Unga qo'shni burchagini toping.", 180 - al, ["Qo'shni burchaklar yig'indisi 180°", "180° − " + al + "° = " + (180 - al) + "°"]); }
    if (k === 1) { var a = R(3, 15), b = R(2, 14);
      return numQ("Parallelogrammning qo'shni tomonlari " + a + " va " + b + ". Perimetrini toping.", 2 * (a + b), ["P = 2(a + b) = 2·" + (a + b) + " = " + 2 * (a + b)]); }
    if (k === 2) { var d = R(3, 20) * 2;
      return numQ("Parallelogrammning diagonali " + d + ". Diagonallar kesishish nuqtasidan shu diagonalning uchigacha masofa necha?", d / 2, ["Diagonallar kesishish nuqtasida teng ikkiga bo'linadi", d + " : 2 = " + d / 2]); }
    if (k === 3) { var base = R(3, 15), h = R(2, 12);
      return numQ("Parallelogrammning asosi " + base + ", shu asosga tushirilgan balandligi " + h + ". Yuzini toping.", base * h, ["S = a·h = " + base + "·" + h + " = " + base * h]); }
    if (k === 4) { var t = pick(TRI_S), m = R(1, 3), x = t[0] * m, y = t[1] * m;
      return Math.random() < .5 ? numQ("To'g'ri to'rtburchakning tomonlari " + x + " va " + y + ". Diagonalini toping.", t[2] * m, ["d² = " + x + "² + " + y + "² = " + (x * x + y * y), "d = " + t[2] * m])
        : numQ("To'g'ri to'rtburchakning tomonlari " + x + " va " + y + ". Yuzini toping.", x * y, ["S = a·b = " + x + "·" + y + " = " + x * y]); }
    if (k === 5) { var s = R(2, 12);
      var q = pick([0, 1, 2]);
      if (q === 0) return rootQ("Tomoni " + s + " bo'lgan kvadratning diagonalini toping.", s, 2, ["d = a√2 = " + s + "√2"]);
      if (q === 1) return numQ("Kvadratning perimetri " + 4 * s + ". Tomonini toping.", s, ["P = 4a → a = " + 4 * s + " : 4 = " + s]);
      return numQ("Kvadratning yuzi " + s * s + ". Perimetrini toping.", 4 * s, ["a = √" + s * s + " = " + s, "P = 4a = " + 4 * s]); }
    if (k === 6) { var r = pick([[6, 8, 5], [10, 24, 13], [16, 12, 10], [24, 10, 13], [12, 16, 10], [18, 24, 15]]);
      return numQ("Rombning diagonallari " + r[0] + " va " + r[1] + ". Tomonini toping.", r[2], ["Diagonallar perpendikulyar va teng ikkiga bo'linadi", "a² = (" + r[0] / 2 + ")² + (" + r[1] / 2 + ")² = " + r[2] * r[2], "a = " + r[2]]); }
    if (k === 7) { var d1 = R(3, 12) * 2, d2 = R(2, 10) * 2;
      return numQ("Rombning diagonallari " + d1 + " va " + d2 + ". Yuzini toping.", d1 * d2 / 2, ["S = d₁·d₂/2 = " + d1 + "·" + d2 + "/2 = " + d1 * d2 / 2]); }
    if (k === 8) { var tt = pick([[10, 6], [14, 8], [20, 12], [16, 10], [18, 6]]);
      return numQ("Trapetsiyaning asoslari " + tt[0] + " va " + tt[1] + ". O'rta chizig'ini toping.", (tt[0] + tt[1]) / 2, ["m = (a + b)/2 = (" + tt[0] + " + " + tt[1] + ")/2 = " + (tt[0] + tt[1]) / 2]); }
    if (k === 9) { var a9 = pick([8, 10, 12, 14]), b9 = pick([4, 6, 2]), h9 = R(2, 9) * 2;
      return numQ("Trapetsiyaning asoslari " + a9 + " va " + b9 + ", balandligi " + h9 + ". Yuzini toping.", (a9 + b9) * h9 / 2, ["S = (a + b)/2 · h = " + (a9 + b9) / 2 + "·" + h9 + " = " + (a9 + b9) * h9 / 2]); }
    if (k === 10) { var c = pick([[5, 3, 4, 6], [13, 5, 12, 10], [10, 6, 8, 12], [17, 8, 15, 16]]); // yon, ayirma/2, h, ayirma
      var bb = R(4, 10), aa = bb + c[3];
      return numQ("Teng yonli trapetsiyaning asoslari " + aa + " va " + bb + ", yon tomoni " + c[0] + ". Balandligini toping.", c[2],
        ["Asosdagi proyeksiya = (" + aa + " − " + bb + ")/2 = " + c[1], "h² = " + c[0] + "² − " + c[1] + "² = " + c[2] * c[2], "h = " + c[2]]); }
    if (k === 11) { var a11 = R(4, 10), c11 = R(5, 12), b11 = R(3, 9), d11 = a11 + c11 - b11;
      var ok = d11 > 0;
      return ok ? numQ("To'rtburchakka aylana ichki chizilgan. Ketma-ket tomonlari " + a11 + ", " + b11 + ", " + c11 + " bo'lsa, to'rtinchi tomonini toping.", d11,
        ["Qarama-qarshi tomonlar yig'indisi teng: " + a11 + " + " + c11 + " = " + b11 + " + x", "x = " + d11]) : bank(T72);
    }
    return bank(T72);
  };

  /* ================= 73. Aylana va doira ================= */
  var T73 = [
    ["Aylananing eng katta vatari qaysi?", "diametr", ["radius", "urinma", "yoy"], ["Markazdan o'tuvchi vatar — diametr, u eng katta vatar"]],
    ["Diametr radiusdan necha marta katta?", "2 marta", ["3 marta", "π marta", "bir xil"], ["d = 2r"]],
    ["Urinma urinish nuqtasiga o'tkazilgan radiusga nisbatan qanday?", "perpendikulyar", ["parallel", "teng", "kesishmaydi"], ["Urinma radiusga perpendikulyar"]],
    ["Markaziy burchak nimaga teng?", "o'ziga tiralgan yoy gradusiga", ["yoyning yarmiga", "yoyning ikki barobariga", "180° ga"], ["Markaziy burchak = yoyi"]],
    ["Ichki chizilgan burchak nimaga teng?", "o'ziga tiralgan yoyning yarmiga", ["yoyning o'ziga", "180° ga", "yoyning ikki barobariga"], ["Ichki chizilgan burchak = yoyning yarmi"]],
    ["Diametrga tiralgan ichki chizilgan burchak necha gradus?", "90°", ["45°", "180°", "60°"], ["Yarim aylanaga tiralgan burchak to'g'ri"]],
    ["Bir yoyga tiralgan ichki chizilgan burchaklar qanday?", "o'zaro teng", ["yig'indisi 180°", "ikki barobar farq qiladi", "har xil"], ["Teng yoyga tiralgan burchaklar teng"]],
    ["Bir nuqtadan aylanaga o'tkazilgan ikki urinma kesmasi qanday?", "o'zaro teng", ["perpendikulyar", "parallel", "ikki barobar farq qiladi"], ["Urinma kesmalari teng"]],
    ["Aylana uzunligi formulasi qaysi?", "C = 2πr", ["C = πr²", "C = πr", "C = 4πr²"], ["C = 2πr = πd"]],
    ["Doira yuzi formulasi qaysi?", "S = πr²", ["S = 2πr", "S = πr", "S = πd²"], ["S = πr²"]],
    ["Aylana markazidan vatargacha tushirilgan perpendikulyar vatarni qanday bo'ladi?", "teng ikkiga bo'ladi", ["uchga bo'ladi", "bo'lmaydi", "bir yoyga aylantiradi"], ["Markazdan vatarga perpendikulyar uni teng ikkiga bo'ladi"]]
  ];
  G.t73 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 12], [0, 1, 2, 3, 4, 5, 6, 12], [4, 5, 6, 7, 8, 9, 10, 11, 12]));
    if (k === 0) { var r = R(2, 12);
      return piQ("Radiusi " + r + " bo'lgan aylananing uzunligini toping (π ko'paytmasi).", 2 * r, ["C = 2πr = 2π·" + r + " = " + 2 * r + "π"]); }
    if (k === 1) { var r1 = R(2, 12);
      return piQ("Radiusi " + r1 + " bo'lgan doiraning yuzini toping (π ko'paytmasi).", r1 * r1, ["S = πr² = π·" + r1 + "² = " + r1 * r1 + "π"]); }
    if (k === 2) { var d = R(2, 15) * 2;
      return numQ("Aylananing diametri " + d + ". Radiusini toping.", d / 2, ["r = d : 2 = " + d / 2]); }
    if (k === 3) { var c = R(2, 9);
      return numQ("Aylana uzunligi " + 2 * c + "π. Radiusini toping.", c, ["C = 2πr → r = " + 2 * c + "π : 2π = " + c]); }
    if (k === 4) { var arc = pick([40, 50, 60, 70, 80, 100, 110, 120, 140]);
      return Math.random() < .5 ? numQ("Markaziy burchak " + arc + "°. Shu yoyga tiralgan ichki chizilgan burchakni toping.", arc / 2, ["Ichki chizilgan burchak markaziy burchakning yarmi", arc + "° : 2 = " + arc / 2 + "°"])
        : numQ("Ichki chizilgan burchak " + arc / 2 + "°. Shu yoyga tiralgan markaziy burchakni toping.", arc, ["Markaziy burchak = 2 · ichki chizilgan burchak", 2 * (arc / 2) + "°"]); }
    if (k === 5) { var t = pick([[3, 5, 4], [5, 13, 12], [8, 17, 15], [6, 10, 8], [12, 13, 5], [15, 17, 8]]);
      return numQ("Aylana radiusi " + t[0] + ". Markazdan " + t[1] + " masofadagi nuqtadan urinma o'tkazildi. Urinma kesmasi uzunligini toping.", t[2],
        ["Urinma radiusga perpendikulyar → to'g'ri burchakli uchburchak", "l² = " + t[1] + "² − " + t[0] + "² = " + t[2] * t[2], "l = " + t[2]]); }
    if (k === 6) { var v = pick([[5, 3, 8], [13, 5, 24], [10, 6, 16], [5, 4, 6], [17, 8, 30], [25, 7, 48]]);
      return numQ("Aylana radiusi " + v[0] + ". Markazdan " + v[1] + " masofadagi vatar uzunligini toping.", v[2],
        ["Yarim vatar² = " + v[0] + "² − " + v[1] + "² = " + (v[2] / 2) * (v[2] / 2), "Yarim vatar = " + v[2] / 2, "Vatar = " + v[2]]); }
    if (k === 7) { var p = pick([2, 3, 4, 6]), q = pick([4, 6, 8, 9, 10]), rr = pick([2, 3, 4, 6]);
      var prod = p * q; if (prod % rr !== 0 || prod / rr === p) return bank(T73);
      return numQ("Aylananing ikki vatari kesishdi. Birining bo'laklari " + p + " va " + q + ", ikkinchisining bir bo'lagi " + rr + ". Ikkinchi bo'lagini toping.", prod / rr,
        ["AE·EB = CE·ED", p + "·" + q + " = " + rr + "·x", "x = " + prod / rr]); }
    if (k === 8) { var o = pick([[60, 3], [120, 3], [90, 2], [30, 6], [180, 1]]); var rad = o[1] * R(1, 4);
      return piQ("Radiusi " + rad + " bo'lgan doira sektorining burchagi " + o[0] + "°. Sektor yoyining uzunligini toping (π ko'paytmasi).", rad * o[0] / 180,
        ["l = πrα/180 = π·" + rad + "·" + o[0] + "/180 = " + rad * o[0] / 180 + "π"]); }
    if (k === 9) { var o2 = pick([[90, 2, 4], [180, 2, 2], [60, 6, 6], [120, 3, 3]]); var r9 = o2[1] * R(1, 3);
      var area = r9 * r9 * o2[0] / 360;
      return piQ("Radiusi " + r9 + " bo'lgan doira sektorining burchagi " + o2[0] + "°. Sektor yuzini toping (π ko'paytmasi).", area,
        ["S = πr²α/360 = π·" + r9 * r9 + "·" + o2[0] + "/360 = " + area + "π"]); }
    if (k === 10) { var ang = pick([20, 25, 30, 35, 40, 55]);
      return numQ("AB — aylana diametri, C nuqta aylanada yotadi. ABC uchburchakda ∠A = " + ang + "°. ∠B ni toping.", 90 - ang,
        ["Diametrga tiralgan ichki burchak ∠C = 90°", "∠B = 180° − 90° − " + ang + "° = " + (90 - ang) + "°"]); }
    if (k === 11) { var ra = R(2, 9);
      return piQ("Diametri " + 2 * ra + " bo'lgan doiraning yuzini toping (π ko'paytmasi).", ra * ra, ["r = " + ra, "S = πr² = " + ra * ra + "π"]); }
    return bank(T73);
  };

  /* ================= 74. Muntazam ko'pburchaklar ================= */
  var T74 = [
    ["Muntazam ko'pburchak deb qanday ko'pburchakka aytiladi?", "barcha tomonlari va burchaklari teng", ["faqat tomonlari teng", "faqat burchaklari teng", "diagonallari teng"], ["Tomonlari ham, burchaklari ham teng"]],
    ["Muntazam oltiburchakning tomoni tashqi aylana radiusiga qanday?", "teng", ["ikki barobar katta", "yarmiga teng", "√2 marta katta"], ["Oltiburchak: a = R"]],
    ["Qaysi muntazam ko'pburchak tekislikni to'ldirib yopishtirib qoplay oladi?", "uchburchak, to'rtburchak, oltiburchak", ["beshburchak", "sakkizburchak", "yettiburchak"], ["Burchagi 360° ning bo'luvchisi bo'lishi kerak"]],
    ["Muntazam ko'pburchakka ichki chizilgan aylana markazi qayerda?", "tashqi aylana markazi bilan bir nuqtada", ["uchlaridan birida", "tomon o'rtasida", "hech qayerda"], ["Ikkala aylananing markazi bir xil"]],
    ["Muntazam ko'pburchakning apofemasi nima?", "ichki chizilgan aylana radiusi", ["tashqi aylana radiusi", "tomonining yarmi", "diagonali"], ["Markazdan tomonga tushirilgan perpendikulyar"]],
    ["Muntazam ko'pburchak yuzi formulasi qaysi?", "S = (1/2)·P·r", ["S = P·r", "S = P + r", "S = (1/2)·P·R²"], ["Perimetr × apofema / 2"]],
    ["Muntazam uchburchak ichki burchagi necha gradus?", "60°", ["90°", "45°", "120°"], ["(3−2)·180°/3 = 60°"]],
    ["Muntazam oltiburchak ichki burchagi necha gradus?", "120°", ["60°", "90°", "135°"], ["(6−2)·180°/6 = 120°"]]
  ];
  var NG = [[3, 60], [4, 90], [5, 108], [6, 120], [8, 135], [9, 140], [10, 144], [12, 150], [15, 156], [18, 160], [20, 162], [24, 165], [30, 168], [36, 170]];
  G.t74 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 12], [0, 1, 2, 3, 4, 5, 6, 12], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    if (k === 0) { var n = R(5, 14);
      return numQ(n + " burchakli ko'pburchak ichki burchaklarining yig'indisini toping.", (n - 2) * 180, ["(n − 2)·180° = " + (n - 2) + "·180° = " + (n - 2) * 180 + "°"]); }
    if (k === 1) { var p = pick(NG.slice(0, lv(L, 4, 8, 14)));
      return numQ("Muntazam " + p[0] + " burchakning ichki burchagini toping (gradusda).", p[1], ["(n − 2)·180°/n = " + (p[0] - 2) * 180 + "°/" + p[0] + " = " + p[1] + "°"]); }
    if (k === 2) { var q = pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
      return numQ("Muntazam " + q + " burchakning tashqi burchagini toping (gradusda).", 360 / q, ["Tashqi burchak = 360°/n = 360°/" + q + " = " + 360 / q + "°"]); }
    if (k === 3) { var n2 = R(5, 15);
      return numQ(n2 + " burchakli qavariq ko'pburchakning diagonallari sonini toping.", n2 * (n2 - 3) / 2, ["n(n − 3)/2 = " + n2 + "·" + (n2 - 3) + "/2 = " + n2 * (n2 - 3) / 2]); }
    if (k === 4) { var ang = pick(NG.slice(0, 10));
      return numQ("Muntazam ko'pburchakning ichki burchagi " + ang[1] + "°. U necha burchakli?", ang[0], ["Tashqi burchak = 180° − " + ang[1] + "° = " + (180 - ang[1]) + "°", "n = 360°/" + (180 - ang[1]) + "° = " + ang[0]]); }
    if (k === 5) { var a = R(2, 14);
      return numQ("Tomoni " + a + " bo'lgan muntazam oltiburchakka tashqi chizilgan aylana radiusini toping.", a, ["Muntazam oltiburchakda R = a = " + a]); }
    if (k === 6) { var a6 = R(2, 10) * 2;
      return rootQ("Tomoni " + a6 + " bo'lgan muntazam oltiburchakning yuzini toping.", 3 * a6 * a6 / 2, 3, ["S = 3√3·a²/2 = 3√3·" + a6 * a6 + "/2 = " + 3 * a6 * a6 / 2 + "√3"]); }
    if (k === 7) { var a7 = R(2, 12);
      return numQ("Tomoni " + a7 + " bo'lgan kvadratga ichki chizilgan aylana radiusini toping.", a7 / 2 === Math.floor(a7 / 2) ? a7 / 2 : a7, ["r = a/2 = " + a7 + "/2"]).a % 1 === 0 ? numQ("Tomoni " + (a7 % 2 ? a7 + 1 : a7) + " bo'lgan kvadratga ichki chizilgan aylana radiusini toping.", (a7 % 2 ? a7 + 1 : a7) / 2, ["r = a/2"]) : bank(T74); }
    if (k === 8) { var r = R(2, 9), P = 2 * R(Math.ceil(Math.PI * r) + 1, Math.ceil(Math.PI * r) + 12);
      return numQ("Radiusi " + r + " bo'lgan aylanaga tashqi chizilgan ko'pburchakning perimetri " + P + ". Yuzini toping.", P * r / 2, ["Tashqi chizilgan ko'pburchak uchun S = p·r (p — yarim perimetr)", "S = (1/2)·" + P + "·" + r + " = " + P * r / 2]); }
    if (k === 9) { var m = R(5, 12), s = R(2, 10);
      return numQ("Muntazam " + m + " burchakning tomoni " + s + ". Perimetrini toping.", m * s, ["P = n·a = " + m + "·" + s + " = " + m * s]); }
    if (k === 10) { var a10 = pick([6, 12, 18, 24, 30]);
      return rootQ("Tomoni " + a10 + " bo'lgan muntazam uchburchakka ichki chizilgan aylana radiusini toping (r = a√3/6).", a10 / 6, 3, ["r = a√3/6 = " + a10 + "√3/6 = " + a10 / 6 + "√3"]); }
    if (k === 11) { var ng = pick([4, 6, 8, 12]), r2 = 360 / ng;
      return numQ("Muntazam " + ng + " burchakning markaziy burchagi (qo'shni ikki uchi markaz bilan tutashganda) necha gradus?", r2, ["360°/n = 360°/" + ng + " = " + r2 + "°"]); }
    return bank(T74);
  };

  /* ================= 75. Prizma va parallelepiped ================= */
  var T75 = [
    ["Prizmaning asoslari qanday bo'ladi?", "teng va parallel ko'pburchaklar", ["faqat parallel", "faqat teng", "har xil ko'pburchaklar"], ["Prizmaning ikki asosi teng va parallel tekisliklarda yotadi"]],
    ["Prizmaning yon yoqlari qanday shakl?", "parallelogramm", ["uchburchak", "trapetsiya", "doira"], ["Yon yoqlar parallelogrammlar"]],
    ["To'g'ri prizmaning yon qirralari asosga nisbatan qanday?", "perpendikulyar", ["parallel", "ayqash", "og'ma"], ["To'g'ri prizmada yon qirra balandlikka teng"]],
    ["Muntazam prizma deb qanday prizmaga aytiladi?", "to'g'ri prizma, asosi muntazam ko'pburchak", ["asosi ixtiyoriy to'g'ri prizma", "og'ma prizma", "asosi doira prizma"], ["To'g'ri va asosi muntazam ko'pburchak"]],
    ["Prizma hajmi formulasi qaysi?", "V = S_asos · H", ["V = S_asos · H / 3", "V = P_asos · H", "V = 2S_asos"], ["Asos yuzi × balandlik"]],
    ["To'g'ri prizmaning yon sirti formulasi qaysi?", "S_yon = P_asos · H", ["S_yon = S_asos · H", "S_yon = 2P_asos", "S_yon = P_asos / H"], ["Asos perimetri × balandlik"]],
    ["To'g'ri burchakli parallelepiped diagonali formulasi qaysi?", "d² = a² + b² + c²", ["d = a + b + c", "d² = a² + b²", "d = abc"], ["Uch o'lcham kvadratlari yig'indisining ildizi"]],
    ["Parallelepipedning diagonallari qanday kesishadi?", "bir nuqtada teng ikkiga bo'linadi", ["kesishmaydi", "perpendikulyar", "uchdan bir nisbatda"], ["To'rt diagonal bir nuqtada kesishib teng ikkiga bo'linadi"]],
    ["Kubning barcha yoqlari qanday shakl?", "teng kvadratlar", ["teng uchburchaklar", "trapetsiyalar", "teng beshburchaklar"], ["Kub — 6 ta teng kvadratdan iborat"]],
    ["Parallelepipedda nechta yoq bor?", "6", ["4", "8", "12"], ["6 yoq, 8 uch, 12 qirra"]]
  ];
  var BOX = [[1, 2, 2, 3], [2, 3, 6, 7], [2, 4, 4, 6], [3, 4, 12, 13], [4, 4, 7, 9], [1, 4, 8, 9], [6, 6, 7, 11], [2, 10, 11, 15]];
  G.t75 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 12], [0, 1, 2, 3, 4, 5, 6, 7, 12], [4, 5, 6, 7, 8, 9, 10, 11, 12]));
    if (k === 0) { var n = R(3, 12);
      return numQ(n + " burchakli prizmada nechta yoq bor?", n + 2, [n + " ta yon yoq + 2 ta asos = " + (n + 2)]); }
    if (k === 1) { var n1 = R(3, 12);
      return numQ(n1 + " burchakli prizmada nechta uch bor?", 2 * n1, ["Har asosda " + n1 + " ta uch: 2·" + n1 + " = " + 2 * n1]); }
    if (k === 2) { var a = R(2, 9), b = R(2, 9), h = R(3, 12);
      return numQ("To'g'ri prizmaning asosi tomonlari " + a + " va " + b + " bo'lgan to'g'ri to'rtburchak, balandligi " + h + ". Hajmini toping.", a * b * h, ["V = S_asos·H = " + a * b + "·" + h + " = " + a * b * h]); }
    if (k === 3) { var a3 = R(2, 9), h3 = R(3, 10);
      return numQ("Asosi tomoni " + a3 + " bo'lgan kvadrat, balandligi " + h3 + " to'g'ri prizmaning yon sirtini toping.", 4 * a3 * h3, ["P_asos = 4·" + a3 + " = " + 4 * a3, "S_yon = P·H = " + 4 * a3 + "·" + h3 + " = " + 4 * a3 * h3]); }
    if (k === 4) { var t = pick(BOX), m = R(1, 2);
      return numQ("To'g'ri burchakli parallelepipedning o'lchamlari " + t[0] * m + ", " + t[1] * m + ", " + t[2] * m + ". Diagonalini toping.", t[3] * m,
        ["d² = " + (t[0] * m) + "² + " + (t[1] * m) + "² + " + (t[2] * m) + "² = " + (t[3] * m) * (t[3] * m), "d = " + t[3] * m]); }
    if (k === 5) { var a5 = R(2, 8), b5 = R(2, 8), c5 = R(2, 8);
      return numQ("To'g'ri burchakli parallelepipedning o'lchamlari " + a5 + ", " + b5 + ", " + c5 + ". To'la sirtini toping.", 2 * (a5 * b5 + b5 * c5 + a5 * c5), ["S = 2(ab + bc + ac) = 2(" + a5 * b5 + " + " + b5 * c5 + " + " + a5 * c5 + ") = " + 2 * (a5 * b5 + b5 * c5 + a5 * c5)]); }
    if (k === 6) { var s = R(2, 10);
      return numQ("Qirrasi " + s + " bo'lgan kubning hajmini toping.", s * s * s, ["V = a³ = " + s + "³ = " + s * s * s]); }
    if (k === 7) { var s7 = R(2, 10);
      return numQ("Qirrasi " + s7 + " bo'lgan kubning to'la sirtini toping.", 6 * s7 * s7, ["S = 6a² = 6·" + s7 * s7 + " = " + 6 * s7 * s7]); }
    if (k === 8) { var cb = pick([[8, 2], [27, 3], [64, 4], [125, 5], [216, 6], [343, 7], [512, 8], [729, 9]]);
      return numQ("Kubning hajmi " + cb[0] + ". Qirrasini toping.", cb[1], ["a³ = " + cb[0] + " → a = " + cb[1]]); }
    if (k === 9) { var sf = pick([[54, 3], [96, 4], [150, 5], [216, 6], [294, 7], [384, 8]]);
      return numQ("Kubning to'la sirti " + sf[0] + ". Qirrasini toping.", sf[1], ["6a² = " + sf[0] + " → a² = " + sf[0] / 6, "a = " + sf[1]]); }
    if (k === 10) { var s10 = R(2, 10);
      return rootQ("Qirrasi " + s10 + " bo'lgan kubning fazoviy diagonalini toping.", s10, 3, ["d = a√3 = " + s10 + "√3"]); }
    if (k === 11) { var s11 = R(2, 10);
      return rootQ("Qirrasi " + s11 + " bo'lgan kubning yog'idagi diagonalini toping.", s11, 2, ["Yoq — kvadrat: d = a√2 = " + s11 + "√2"]); }
    return bank(T75);
  };

  /* ================= 76. Piramida ================= */
  var T76 = [
    ["Piramidaning yon yoqlari qanday shakl?", "uchburchak", ["to'g'ri to'rtburchak", "parallelogramm", "trapetsiya"], ["Yon yoqlar umumiy uchga ega uchburchaklar"]],
    ["Piramida hajmi formulasi qaysi?", "V = (1/3)·S_asos·H", ["V = S_asos·H", "V = (1/2)·S_asos·H", "V = (1/3)·P_asos·H"], ["Asos yuzi × balandlik / 3"]],
    ["Muntazam piramidaning balandligi asosning qaysi nuqtasiga tushadi?", "asos markaziga", ["uchlaridan biriga", "tomon o'rtasiga", "ixtiyoriy nuqtaga"], ["Balandlik asosga chizilgan aylana markaziga tushadi"]],
    ["Muntazam piramidaning yon qirralari qanday?", "o'zaro teng", ["har xil", "parallel", "perpendikulyar"], ["Muntazam piramidada yon qirralar teng"]],
    ["Muntazam piramida yon yoqlari qanday uchburchak?", "teng yonli", ["to'g'ri burchakli", "turli tomonli", "teng tomonli (doim)"], ["Yon yoqlar teng yonli uchburchaklar"]],
    ["Piramidaning apofemasi nima?", "muntazam piramida yon yog'ining uchidan asosiga tushirilgan balandligi", ["yon qirra", "piramida balandligi", "asos diagonali"], ["Apofema — yon yoq balandligi"]],
    ["Muntazam piramida yon sirti formulasi qaysi?", "S_yon = (1/2)·P_asos·l", ["S_yon = P_asos·l", "S_yon = (1/3)·P_asos·l", "S_yon = S_asos·l"], ["Perimetr × apofema / 2"]],
    ["Tetraedr deb qanday piramidaga aytiladi?", "asosi uchburchak bo'lgan piramida", ["asosi to'rtburchak", "ikki asosli", "asosi doira"], ["4 yoqli piramida"]],
    ["Muntazam tetraedrning barcha yoqlari qanday?", "teng tomonli uchburchak", ["to'g'ri burchakli uchburchak", "teng yonli lekin teng tomonli emas", "kvadrat"], ["Barcha qirralari teng"]],
    ["Kesik piramidaning asoslari qanday joylashgan?", "parallel tekisliklarda", ["bir tekislikda", "perpendikulyar", "ayqash"], ["Asosga parallel kesim hosil qiladi"]]
  ];
  G.t76 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 12], [0, 1, 2, 3, 4, 5, 6, 7, 12], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    if (k === 0) { var n = R(3, 12);
      return numQ(n + " burchakli piramidada nechta qirra bor?", 2 * n, [n + " ta asos qirrasi + " + n + " ta yon qirra = " + 2 * n]); }
    if (k === 1) { var n1 = R(3, 12);
      return numQ(n1 + " burchakli piramidada nechta yoq bor?", n1 + 1, [n1 + " ta yon yoq + 1 ta asos = " + (n1 + 1)]); }
    if (k === 2) { var n2 = R(3, 12);
      return numQ(n2 + " burchakli piramidada nechta uch bor?", n2 + 1, [n2 + " ta asos uchi + 1 ta cho'qqi = " + (n2 + 1)]); }
    if (k === 3) { var a = pick([3, 6, 9, 12]), h = R(2, 9);
      return numQ("Asosi tomoni " + a + " bo'lgan kvadrat, balandligi " + h + " bo'lgan piramidaning hajmini toping.", a * a * h / 3, ["V = (1/3)·S·H = (1/3)·" + a * a + "·" + h + " = " + a * a * h / 3]); }
    if (k === 4) { var t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]);
      var a4 = 2 * t[0];
      return numQ("Muntazam to'rtburchakli piramidaning asosi tomoni " + a4 + ", balandligi " + t[1] + ". Apofemasini toping.", t[2],
        ["Asos markazidan tomonigacha masofa = " + a4 + "/2 = " + t[0], "l² = H² + r² = " + t[1] + "² + " + t[0] + "² = " + t[2] * t[2], "l = " + t[2]]); }
    if (k === 5) { var t5 = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10]]), a5 = 2 * t5[0];
      return numQ("Muntazam to'rtburchakli piramidaning asosi tomoni " + a5 + ", apofemasi " + t5[2] + ". Yon sirtini toping.", 2 * a5 * t5[2],
        ["P_asos = 4·" + a5 + " = " + 4 * a5, "S_yon = (1/2)·P·l = (1/2)·" + 4 * a5 + "·" + t5[2] + " = " + 2 * a5 * t5[2]]); }
    if (k === 6) { var t6 = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), a6 = 2 * t6[0];
      return numQ("Muntazam to'rtburchakli piramidaning asosi tomoni " + a6 + ", balandligi " + t6[1] + ". To'la sirtini toping.", a6 * a6 + 2 * a6 * t6[2],
        ["Apofema l = " + t6[2], "S_yon = (1/2)·4·" + a6 + "·" + t6[2] + " = " + 2 * a6 * t6[2], "S_asos = " + a6 * a6, "S = " + (a6 * a6 + 2 * a6 * t6[2])]); }
    if (k === 7) { var a7 = pick([3, 6, 9]), h7 = R(2, 8);
      return numQ("Muntazam to'rtburchakli piramidaning hajmi: asos tomoni " + a7 + ", balandligi " + h7 * 3 + ". Hajmini toping.", a7 * a7 * h7, ["V = (1/3)·" + a7 * a7 + "·" + h7 * 3 + " = " + a7 * a7 * h7]); }
    if (k === 8) { var s8 = R(2, 12);
      return txtQ("Muntazam tetraedrning qirrasi " + s8 + ". Uning to'la sirtida nechta teng tomonli uchburchak bor va ularning har birining tomoni nechaga teng?", "4 ta, tomoni " + s8,
        ["3 ta, tomoni " + s8, "4 ta, tomoni " + (s8 % 2 ? s8 * 2 : s8 / 2), "6 ta, tomoni " + s8, "8 ta, tomoni " + s8],
        ["Muntazam tetraedr — 4 ta teng tomonli uchburchak yoqdan iborat", "Har bir yoqning tomoni tetraedr qirrasiga teng: " + s8]); }
    if (k === 9) { var a9 = pick([4, 6, 8]), hh = pick([3, 6]);
      var b9 = a9 - 2, A1 = a9 * a9, B1 = b9 * b9, vol = hh * (A1 + a9 * b9 + B1) / 3;
      return numQ("Kesik piramidaning asoslari kvadrat: tomonlari " + a9 + " va " + b9 + ", balandligi " + hh + ". Hajmini toping (V = h/3·(S₁ + S₂ + √(S₁S₂))).", vol,
        ["S₁ = " + A1 + ", S₂ = " + B1 + ", √(S₁S₂) = " + a9 * b9, "V = " + hh + "/3·(" + A1 + " + " + B1 + " + " + a9 * b9 + ") = " + vol]); }
    if (k === 10) { var n10 = R(3, 10);
      return numQ(n10 + " burchakli kesik piramidada nechta yoq bor?", n10 + 2, [n10 + " ta yon yoq (trapetsiya) + 2 ta asos = " + (n10 + 2)]); }
    if (k === 11) { var vv = pick([[24, 6, 12], [36, 9, 12], [48, 12, 12]]);
      return numQ("Piramida hajmi " + vv[0] + ", balandligi " + vv[1] + ". Asos yuzini toping.", vv[0] * 3 / vv[1], ["V = (1/3)·S·H → S = 3V/H = " + vv[0] * 3 + "/" + vv[1] + " = " + vv[0] * 3 / vv[1]]); }
    return bank(T76);
  };

  /* ================= 77. Silindr ================= */
  var T77 = [
    ["Silindrning asoslari qanday shakl?", "teng doiralar", ["ellipslar", "kvadratlar", "har xil doiralar"], ["Ikki asos — teng parallel doiralar"]],
    ["Silindrning o'q kesimi qanday shakl?", "to'g'ri to'rtburchak", ["doira", "uchburchak", "trapetsiya"], ["O'q kesimi 2r × H to'g'ri to'rtburchak"]],
    ["Asosga parallel kesim silindrda qanday shakl beradi?", "asosga teng doira", ["kichikroq doira", "ellips", "to'g'ri to'rtburchak"], ["Parallel kesim asosga teng doira"]],
    ["Silindrning yon sirti yoyilmasi qanday shakl?", "to'g'ri to'rtburchak", ["doira", "sektor", "uchburchak"], ["Tomonlari 2πr va H"]],
    ["Teng tomonli silindr deb nimaga aytiladi?", "o'q kesimi kvadrat bo'lgan silindr", ["balandligi radiusga teng silindr", "asosi kvadrat silindr", "yasovchisi og'ma silindr"], ["H = 2r"]],
    ["Silindr yon sirti formulasi qaysi?", "S_yon = 2πrH", ["S_yon = πr²H", "S_yon = πrH", "S_yon = 2πr²"], ["Aylana uzunligi × balandlik"]],
    ["Silindr hajmi formulasi qaysi?", "V = πr²H", ["V = 2πrH", "V = (1/3)πr²H", "V = πrH"], ["Asos yuzi × balandlik"]],
    ["Silindr to'la sirti formulasi qaysi?", "S = 2πr(r + H)", ["S = 2πrH", "S = πr(r + H)", "S = 2πr²H"], ["Yon sirt + 2 asos"]]
  ];
  G.t77 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 10], [0, 1, 2, 3, 4, 5, 6, 10], [3, 4, 5, 6, 7, 8, 9, 10]));
    var r = R(2, 9), h = R(2, 12);
    if (k === 0) return piQ("Silindrning radiusi " + r + ", balandligi " + h + ". Yon sirtini toping (π ko'paytmasi).", 2 * r * h, ["S_yon = 2πrH = 2π·" + r + "·" + h + " = " + 2 * r * h + "π"]);
    if (k === 1) return piQ("Silindrning radiusi " + r + ", balandligi " + h + ". Hajmini toping (π ko'paytmasi).", r * r * h, ["V = πr²H = π·" + r * r + "·" + h + " = " + r * r * h + "π"]);
    if (k === 2) return piQ("Silindrning radiusi " + r + ", balandligi " + h + ". To'la sirtini toping (π ko'paytmasi).", 2 * r * (r + h), ["S = 2πr(r + H) = 2π·" + r + "·" + (r + h) + " = " + 2 * r * (r + h) + "π"]);
    if (k === 3) return numQ("Silindrning radiusi " + r + ", balandligi " + h + ". O'q kesimining yuzini toping.", 2 * r * h, ["O'q kesimi — to'g'ri to'rtburchak 2r × H", "S = " + 2 * r + "·" + h + " = " + 2 * r * h]);
    if (k === 4) return numQ("Teng tomonli silindrning (o'q kesimi kvadrat) radiusi " + r + ". Balandligini toping.", 2 * r, ["O'q kesimi kvadrat → H = 2r = " + 2 * r]);
    if (k === 5) { var t = pick([[6, 8, 10], [8, 6, 10], [10, 24, 26], [12, 16, 20]]);
      return numQ("Silindr asosining diametri " + t[0] + ", balandligi " + t[1] + ". O'q kesimining diagonalini toping.", t[2], ["d² = " + t[0] + "² + " + t[1] + "² = " + t[2] * t[2], "d = " + t[2]]); }
    if (k === 6) { var c = R(2, 9);
      return numQ("Silindr asosining aylana uzunligi " + 2 * c + "π, balandligi 5. Asosining radiusini toping.", c, ["C = 2πr → r = " + c]); }
    if (k === 7) return piQ("Silindr yon sirtining yoyilmasi to'g'ri to'rtburchak: bir tomoni " + h + ", ikkinchisi asos aylanasi uzunligi (r = " + r + "). To'rtburchak yuzini toping (π ko'paytmasi).", 2 * r * h, ["Tomonlar: 2π·" + r + " va " + h, "Yuz = " + 2 * r * h + "π"]);
    if (k === 8) { var vv = r * r * h;
      return numQ("Silindr hajmi " + vv + "π, radiusi " + r + ". Balandligini toping.", h, ["V = πr²H → H = " + vv + "π/(π·" + r * r + ") = " + h]); }
    if (k === 9) return piQ("Silindrning radiusi " + r + ", balandligi " + h + ". Faqat bitta asosining yuzini toping (π ko'paytmasi).", r * r, ["S_asos = πr² = " + r * r + "π"]);
    return bank(T77);
  };

  /* ================= 78. Konus ================= */
  var T78 = [
    ["Konusning o'q kesimi qanday shakl?", "teng yonli uchburchak", ["to'g'ri to'rtburchak", "doira", "teng tomonli uchburchak (doim)"], ["Yon tomonlari — yasovchilar"]],
    ["Konusning yasovchisi, radiusi va balandligi orasidagi bog'lanish qaysi?", "l² = r² + H²", ["l = r + H", "l² = r² − H²", "H² = r + l"], ["Pifagor teoremasi"]],
    ["Konus yon sirti yoyilmasi qanday shakl?", "doira sektori", ["to'g'ri to'rtburchak", "to'liq doira", "uchburchak"], ["Sektor radiusi = yasovchi l"]],
    ["Konus hajmi formulasi qaysi?", "V = (1/3)πr²H", ["V = πr²H", "V = (1/2)πr²H", "V = (1/3)πrH"], ["Silindr hajmining uchdan biri"]],
    ["Konus yon sirti formulasi qaysi?", "S_yon = πrl", ["S_yon = 2πrl", "S_yon = πr²", "S_yon = πrH"], ["π × radius × yasovchi"]],
    ["Konus to'la sirti formulasi qaysi?", "S = πr(r + l)", ["S = πrl", "S = πr²l", "S = 2πr(r + l)"], ["Yon sirt + asos"]],
    ["Asosga parallel kesim konusda qanday shakl beradi?", "kichik doira", ["ellips", "uchburchak", "asosga teng doira"], ["Kesim — asosdan kichik doira"]],
    ["Konusning barcha yasovchilari qanday?", "o'zaro teng", ["har xil", "parallel", "perpendikulyar"], ["To'g'ri doiraviy konusda yasovchilar teng"]]
  ];
  G.t78 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 9], [0, 1, 2, 3, 4, 5, 9], [2, 3, 4, 5, 6, 7, 8, 9]));
    var t = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [15, 8, 17], [8, 15, 17]]); // r, H, l
    var r = t[0], h = t[1], l = t[2];
    if (k === 0) return numQ("Konusning radiusi " + r + ", balandligi " + h + ". Yasovchisini toping.", l, ["l² = r² + H² = " + r * r + " + " + h * h + " = " + l * l, "l = " + l]);
    if (k === 1) return piQ("Konusning radiusi " + r + ", yasovchisi " + l + ". Yon sirtini toping (π ko'paytmasi).", r * l, ["S_yon = πrl = π·" + r + "·" + l + " = " + r * l + "π"]);
    if (k === 2) return piQ("Konusning radiusi " + r + ", yasovchisi " + l + ". To'la sirtini toping (π ko'paytmasi).", r * (r + l), ["S = πr(r + l) = π·" + r + "·" + (r + l) + " = " + r * (r + l) + "π"]);
    if (k === 3) { if ((r * r * h) % 3) return bank(T78);
      return piQ("Konusning radiusi " + r + ", balandligi " + h + ". Hajmini toping (π ko'paytmasi).", r * r * h / 3, ["V = (1/3)πr²H = (1/3)π·" + r * r + "·" + h + " = " + r * r * h / 3 + "π"]); }
    if (k === 4) return numQ("Konusning radiusi " + r + ", balandligi " + h + ". O'q kesimining yuzini toping.", r * h, ["O'q kesimi — asosi 2r = " + 2 * r + ", balandligi " + h + " bo'lgan uchburchak", "S = (1/2)·" + 2 * r + "·" + h + " = " + r * h]);
    if (k === 5) { var tt = pick([[3, 5, 216], [4, 5, 288], [6, 10, 216], [9, 15, 216], [12, 15, 288], [8, 10, 288]]);
      return numQ("Konusning asosi radiusi " + tt[0] + ", yasovchisi " + tt[1] + ". Yon sirti yoyilmasidagi sektorning markaziy burchagini toping (gradusda).", tt[2],
        ["α = 360°·r/l = 360°·" + tt[0] + "/" + tt[1] + " = " + tt[2] + "°"]); }
    if (k === 6) { var rr = R(2, 9);
      return numQ("Konus o'q kesimi teng tomonli uchburchak, asosi radiusi " + rr + ". Yasovchisini toping.", 2 * rr, ["Teng tomonli: yasovchi = asos diametri = 2r = " + 2 * rr]); }
    if (k === 7) { var h7 = pick([3, 6, 9]), r7 = R(2, 6);
      return numQ("Konusning balandligi " + h7 + ", asos radiusi " + r7 + ". Hajmi nechta π ga teng?", r7 * r7 * h7 / 3, ["V = (1/3)πr²H = (1/3)·" + r7 * r7 + "·" + h7 + "·π = " + r7 * r7 * h7 / 3 + "π"]); }
    if (k === 8) { var R1 = pick([6, 8, 10]), r1 = pick([2, 3, 4]), hh = pick([3, 6]);
      var vol = hh * (R1 * R1 + R1 * r1 + r1 * r1) / 3;
      return piQ("Kesik konusning asoslari radiuslari " + R1 + " va " + r1 + ", balandligi " + hh + ". Hajmini toping (π ko'paytmasi). V = (πh/3)(R² + Rr + r²)", vol,
        ["V = π·" + hh + "/3·(" + R1 * R1 + " + " + R1 * r1 + " + " + r1 * r1 + ") = " + vol + "π"]); }
    return bank(T78);
  };

  /* ================= 79. Shar va sfera ================= */
  var T79 = [
    ["Sfera nima?", "fazoda markazdan bir xil uzoqlikdagi nuqtalar to'plami", ["fazodagi doira", "ichi to'la shar", "ikki aylana"], ["Sfera — shar sirti"]],
    ["Sharning har qanday tekislik bilan kesimi qanday shakl?", "doira", ["ellips", "to'g'ri to'rtburchak", "uchburchak"], ["Kesim doira bo'ladi"]],
    ["Sharning eng katta kesimi qaysi?", "markazdan o'tuvchi kesim (katta doira)", ["sirtga yaqin kesim", "markazdan uzoq kesim", "hammasi teng"], ["Markazdan o'tgan tekislik — katta doira"]],
    ["Shar va tekislik urinadi, agar markazdan tekislikkacha masofa d nimaga teng?", "d = R", ["d < R", "d > R", "d = 0"], ["d = R — urinish"]],
    ["Shar va tekislik kesishmaydi, agar:", "d > R", ["d < R", "d = R", "d = 0"], ["Masofa radiusdan katta"]],
    ["Urinma tekislik urinish nuqtasiga o'tkazilgan radiusga qanday?", "perpendikulyar", ["parallel", "teng", "og'ma"], ["Urinma tekislik radiusga perpendikulyar"]],
    ["Shar sirti (sfera yuzi) formulasi qaysi?", "S = 4πR²", ["S = πR²", "S = (4/3)πR³", "S = 2πR²"], ["Katta doira yuzining 4 barobari"]],
    ["Shar hajmi formulasi qaysi?", "V = (4/3)πR³", ["V = 4πR²", "V = πR³", "V = (1/3)πR³"], ["V = (4/3)πR³"]]
  ];
  G.t79 = function (L) {
    var k = pick(lv(L, [0, 1, 2, 3, 8], [0, 1, 2, 3, 4, 5, 8], [3, 4, 5, 6, 7, 8]));
    var r = R(2, 9);
    if (k === 0) return piQ("Sharning radiusi " + r + ". Sirtining yuzini toping (π ko'paytmasi).", 4 * r * r, ["S = 4πR² = 4π·" + r * r + " = " + 4 * r * r + "π"]);
    if (k === 1) { var rr = pick([3, 6, 9, 12]);
      return piQ("Sharning radiusi " + rr + ". Hajmini toping (π ko'paytmasi).", 4 * rr * rr * rr / 3, ["V = (4/3)πR³ = (4/3)π·" + rr * rr * rr + " = " + 4 * rr * rr * rr / 3 + "π"]); }
    if (k === 2) { var d = R(2, 9) * 2;
      return numQ("Sharning diametri " + d + ". Radiusini toping.", d / 2, ["R = d : 2 = " + d / 2]); }
    if (k === 3) { var t = pick([[5, 3, 4], [13, 5, 12], [10, 6, 8], [17, 8, 15], [25, 7, 24], [25, 15, 20]]);
      return numQ("Sharning radiusi " + t[0] + ". Markazdan " + t[1] + " masofadagi tekislik bilan kesimi — doira. Uning radiusini toping.", t[2], ["r² = R² − d² = " + t[0] * t[0] + " − " + t[1] * t[1] + " = " + t[2] * t[2], "r = " + t[2]]); }
    if (k === 4) { var Rr = R(3, 10), dd = pick([Rr - 1, Rr, Rr + 1, Rr + 3]);
      var res = dd < Rr ? "doira bo'yicha kesadi" : dd === Rr ? "urinadi" : "kesishmaydi";
      return txtQ("Sharning radiusi " + Rr + ". Markazdan tekislikkacha masofa " + dd + ". Tekislik shar bilan qanday joylashgan?", res, ["doira bo'yicha kesadi", "urinadi", "kesishmaydi"].filter(function (x) { return x !== res; }),
        ["d bilan R ni solishtiramiz: d = " + dd + ", R = " + Rr, "d < R — kesadi, d = R — urinadi, d > R — kesishmaydi"]); }
    if (k === 5) { var a = R(2, 9) * 2;
      return numQ("Kubning qirrasi " + a + ". Unga ichki chizilgan sharning radiusini toping.", a / 2, ["Ichki chizilgan shar radiusi R = a/2 = " + a / 2]); }
    if (k === 6) { var rc = R(2, 9);
      return numQ("Sharga tashqi chizilgan silindrning (o'q kesimi kvadrat) balandligi nechaga teng, agar shar radiusi " + rc + " bo'lsa?", 2 * rc, ["Silindr balandligi = shar diametri = 2R = " + 2 * rc]); }
    if (k === 7) { var rs = pick([3, 6, 9]);
      return numQ("Sharning sirt yuzi " + 4 * rs * rs + "π. Radiusini toping.", rs, ["4πR² = " + 4 * rs * rs + "π → R² = " + rs * rs, "R = " + rs]); }
    if (k === 8) { var rb = R(2, 8);
      return numQ("Sharni markazidan kesganda kesimning radiusi shar radiusiga teng. Shar radiusi " + rb + " bo'lsa, katta doiraning diametri nechaga teng?", 2 * rb, ["Katta doira radiusi = R = " + rb, "Diametr = " + 2 * rb]); }
    return bank(T79);
  };

  S.registerAll(G, {
    t71: "Uchburchak va uning xossalari", t72: "To'rtburchaklar va ularning xossalari", t73: "Aylana va doira",
    t74: "Muntazam ko'pburchaklar", t75: "Prizma va parallelepiped", t76: "Piramida",
    t77: "Silindr", t78: "Konus", t79: "Shar va sfera"
  });
})();
