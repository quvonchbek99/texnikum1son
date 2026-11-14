/*!
 * Kuvonch Academy — viktorina uchun fanlar: Mantiq, Ingliz tili, Rus tili
 * kaSavol.register(id, fn, title) orqali ulanadi (ka-savollar.js dan keyin yuklanadi).
 * Ingliz va rus tili lug'atlari saytning o'z ma'lumotlaridan olinadi (english/assets, rus-tili/assets) —
 * ular faqat shu mavzu tanlanganda yuklanadi: kaFan.prep(["e1","r1"]).then(...)
 * ES5 — eski telefonlarda ham ishlaydi.
 */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle;
  function Q(q, a, w, steps) {
    a = String(a);
    var seen = {}, out = []; seen[a] = 1;
    (w || []).forEach(function (x) { x = String(x); if (!seen[x] && x !== "") { seen[x] = 1; out.push(x); } });
    return { q: q, a: a, w: out, steps: steps ? [].concat(steps) : [], lang: S.lang() };
  }
  // son javob uchun yaqin noto'g'ri variantlar (musbat bo'lsa musbat)
  function nw(a, extra, spread) {
    var out = (extra || []).filter(function (x) { return x !== a && !(a > 0 && x <= 0); });
    H.nearW(a, 8, spread).forEach(function (x) { if (out.length < 5 && out.indexOf(x) < 0 && x !== a && !(a > 0 && x <= 0)) out.push(x); });
    return out;
  }
  function seq(t) { return "Keyingi sonni toping:<br><b>" + t.join(", ") + ", ?</b>"; }
  // so'nggi savollar takrorlanmasin (bank uchun)
  var RECENT = {};
  function pickFresh(key, arr, n) {
    var r = RECENT[key] || (RECENT[key] = []), lim = Math.min(n || 12, Math.floor(arr.length / 2)), it, g = 0;
    do { it = pick(arr); g++; } while (r.indexOf(it) > -1 && g < 30);
    r.push(it); if (r.length > lim) r.shift();
    return it;
  }
  // bank: [daraja, savol, javob, [noto'g'rilar], izoh]
  function bank(key, items, L) {
    var lv = items.filter(function (b) { return b[0] === L; });
    if (lv.length < 3) lv = items.filter(function (b) { return Math.abs(b[0] - L) <= 1; });
    var b = pickFresh(key + L, lv.length ? lv : items);
    return Q(b[1], b[2], shuffle(b[3]), b[4] ? [b[4]] : []);
  }

  /* =====================================================================
   *  🧠 MANTIQ (m1–m10)
   *  Har bir savol tasodifiy parametrlardan yasaladi va javob kodda hisoblanadi.
   *  Jumboqlar (m5, m7, m8, m9) barcha holatlarni saralab (brute force) tekshiriladi —
   *  faqat yagona yechimlilari qoldiriladi.
   * ===================================================================== */
  var mms = H.ms; // manfiy son "−5" ko'rinishida
  function sgn(k) { return k ? (k > 0 ? " + " + k : " − " + (-k)) : ""; }
  function dot(t) { return /[.…!?]$/.test(t) ? t : t + "."; }
  function p2(n) { return (n < 10 ? "0" : "") + n; }
  function joinUz(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " va " + a[a.length - 1]; }
  // butun son javob uchun noto'g'ri variantlar (matn, "−" bilan); neg — manfiy variantlarga ruxsat
  function wNum(a, ex, neg) {
    var out = [], seen = {}, g = 0, sp = Math.max(2, Math.round(Math.abs(a) * 0.12) + 1);
    seen[a] = 1;
    function add(x) {
      if (typeof x !== "number" || !isFinite(x) || Math.round(x) !== x || seen[x]) return;
      if (!neg && (x < 0 || (a > 0 && x === 0))) return;
      seen[x] = 1; out.push(x);
    }
    (ex || []).forEach(add);
    while (out.length < 4 && g++ < 80) add(a + H.RNZ(-sp, sp));
    for (g = 1; out.length < 3 && g < 40; g++) add(a + g);
    return out.slice(0, 5).map(mms);
  }
  function QN(q, a, ex, steps, neg) { return Q(q, mms(a), wNum(a, ex, neg), steps); }
  function permsOf(n) {
    var out = [];
    (function rec(a, used) {
      if (a.length === n) { out.push(a.slice()); return; }
      for (var i = 0; i < n; i++) if (!used[i]) { used[i] = 1; a.push(i); rec(a, used); a.pop(); used[i] = 0; }
    })([], {});
    return out;
  }
  var PERM = { 3: permsOf(3), 4: permsOf(4), 5: permsOf(5) };
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function isCube(n) { var r = Math.round(Math.pow(n, 1 / 3)); return r * r * r === n; }
  function dsum(n) { var s = 0; n = Math.abs(n); while (n) { s += n % 10; n = Math.floor(n / 10); } return s; }
  function isPal(n) { var s = String(n); return s.length > 1 && s === s.split("").reverse().join(""); }
  function isRep(n) { return /^(\d)\1+$/.test(String(n)); }
  function isRun(n) { var s = String(n), i; if (s.length < 3) return false; for (i = 1; i < s.length; i++) if (+s.charAt(i) !== +s.charAt(i - 1) + 1) return false; return true; }

  // m1 — sonli ketma-ketliklar
  var PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
  var SEQ_MID = { ar: 1, ar2: 1, dec: 1, neg: 1, geo: 1, halve: 1, sq: 1, cube: 1, tri: 1, pron: 1 };
  var SEQ_ASK = ["Keyingi sonni toping:", "Qonuniyatni toping va davom ettiring:", "«?» o'rniga qaysi son keladi?"];
  function m1(L) {
    var K = L === 1 ? ["ar", "ar", "dec", "geo", "sq", "halve", "ar2", "rep"]
      : L === 2 ? ["alt", "fib", "sq", "sqk", "cube", "tri", "diffE", "inter", "geo", "muladd", "pron", "neg", "rep", "halve"]
      : ["diffK", "muladd", "fib", "trib", "prime", "alt3", "cubek", "sign", "fact", "dbld", "inter2", "pron", "sqk", "diffE"];
    var k = pick(K), f = [], e = "", c = "", ex = [], neg = false, i, s, d, x, y, n, p, q, y0;
    if (k === "ar" || k === "ar2") { d = k === "ar" ? R(2, 12) : R(11, 25); s = R(1, k === "ar" ? 40 : 60); for (i = 0; i < 6; i++) f.push(s + d * i); e = "Har safar " + d + " qo'shiladi"; ex = [f[5] + d, f[5] - 1, f[5] + 1]; }
    else if (k === "dec" || k === "neg") { d = k === "dec" ? R(2, 9) : R(3, 8); s = k === "dec" ? R(5 * d + 1, 5 * d + 60) : R(1, 3 * d); for (i = 0; i < 6; i++) f.push(s - d * i); e = "Har safar " + d + " ayriladi"; neg = k === "neg"; ex = [f[5] - d, f[5] + 1, f[5] - 1, -f[5]]; }
    else if (k === "geo") { x = L === 1 ? pick([2, 3]) : pick([2, 3, 4, 5]); s = R(1, L === 1 ? 5 : 7); for (i = 0; i < 5; i++) f.push(s * Math.pow(x, i)); e = "Har safar " + x + " ga ko'paytiriladi"; c = f[3] + " · " + x + " = " + f[4]; ex = [f[4] + x, f[3] + x, f[3] * (x + 1), f[4] - f[3]]; }
    else if (k === "halve") { x = L === 1 ? 2 : pick([2, 3]); s = R(1, 12); for (i = 4; i >= 0; i--) f.push(s * Math.pow(x, i)); e = "Har safar " + x + " ga bo'linadi"; c = f[3] + " : " + x + " = " + f[4]; ex = [f[4] + x, f[3] - x, f[4] + 1, f[4] * 2 === f[3] ? f[4] * 3 : f[4] * 2]; }
    else if (k === "sq" || k === "sqk") { y = k === "sqk" ? pick([-3, -2, -1, 1, 2, 3, 4, 5]) : 0; s = R(y < 0 ? 2 : 1, L === 1 ? 12 : 15); for (i = 0; i < 5; i++) f.push((s + i) * (s + i) + y); e = "Sonlar n²" + sgn(y) + " ko'rinishida: " + s + "²" + sgn(y) + ", " + (s + 1) + "²" + sgn(y) + ", …"; c = (s + 4) + "²" + sgn(y) + " = " + f[4]; ex = [f[3] + (f[3] - f[2]), f[4] + 1, f[4] - 1, (s + 4) * 2 + y]; }
    else if (k === "cube" || k === "cubek") { y = k === "cubek" ? pick([-2, -1, 1, 2, 3]) : 0; s = R(y < 0 ? 2 : 1, k === "cube" ? 5 : 6); for (i = 0; i < 5; i++) f.push(Math.pow(s + i, 3) + y); e = "Sonlar n³" + sgn(y) + " ko'rinishida: " + s + "³" + sgn(y) + ", " + (s + 1) + "³" + sgn(y) + ", …"; c = (s + 4) + "³" + sgn(y) + " = " + f[4]; ex = [Math.pow(s + 4, 2) + y, f[3] + (f[3] - f[2]), Math.pow(s + 5, 3) + y, f[4] + 1]; }
    else if (k === "tri") { s = R(1, 10); for (i = 0; i < 6; i++) f.push((s + i) * (s + i + 1) / 2); e = "Ayirmalar har safar 1 ga ortadi: " + (s + 1) + ", " + (s + 2) + ", " + (s + 3) + ", " + (s + 4) + ", keyingisi " + (s + 5); ex = [f[4] + (s + 4), f[5] + 1, f[5] + s + 6]; }
    else if (k === "diffE" || k === "diffK") { x = k === "diffE" ? 2 : R(2, 4); d = R(1, 6); s = R(1, 20); f = [s]; for (i = 1; i < 6; i++) f.push(f[i - 1] + d + x * (i - 1)); e = "Ayirmalar har safar " + x + " ga ortadi: " + d + ", " + (d + x) + ", " + (d + 2 * x) + ", " + (d + 3 * x) + ", keyingisi " + (d + 4 * x); ex = [f[4] + d + 3 * x, f[5] + x, f[5] + 1]; }
    else if (k === "alt") { x = R(1, 6); y = R(7, 14); s = R(1, 12); f = [s]; for (i = 1; i < 7; i++) f.push(f[i - 1] + (i % 2 ? x : y)); e = "Ayirmalar navbat bilan +" + x + " va +" + y; ex = [f[5] + x, f[6] + x, f[6] + 1]; }
    else if (k === "rep") { x = R(3, 9); y = R(1, x - 1); s = R(1, 15); f = [s]; for (i = 1; i < 7; i++) f.push(f[i - 1] + (i % 2 ? x : -y)); e = "Navbat bilan +" + x + " va −" + y; ex = [f[5] + x, f[5] + y, f[6] - 1]; }
    else if (k === "inter" || k === "inter2") {
      n = pick([6, 7]); p = R(2, 6); q = R(1, 5);
      if (k === "inter") { x = R(1, 10); y0 = R(25, 60); for (i = 0; i <= n; i++) f.push(i % 2 ? y0 - q * (i - 1) / 2 : x + p * i / 2); e = "Ikki qator aralashgan: 1-, 3-, 5-, … o'rinlarda +" + p + ", 2-, 4-, … o'rinlarda −" + q; c = n % 2 ? f[n - 2] + " − " + q + " = " + f[n] : f[n - 2] + " + " + p + " = " + f[n]; ex = [n % 2 ? f[n - 1] + p : f[n - 1] - q, f[n] + (n % 2 ? -q : p), f[n] + 1]; }
      else { x = R(1, 5); y0 = R(1, 20); for (i = 0; i <= n; i++) f.push(i % 2 ? y0 + p * (i - 1) / 2 : x * Math.pow(2, i / 2)); e = "Ikki qator aralashgan: 1-, 3-, 5-, … o'rinlarda ×2, 2-, 4-, … o'rinlarda +" + p; c = n % 2 ? f[n - 2] + " + " + p + " = " + f[n] : f[n - 2] + " · 2 = " + f[n]; ex = [n % 2 ? f[n - 1] * 2 : f[n - 1] + p, f[n] + (n % 2 ? p : f[n - 2]), f[n] + 1]; }
    }
    else if (k === "muladd") { x = pick([2, 3]); y = pick(x === 2 ? [1, -1, 2, 3, -2] : [1, -1, 2, -2]); s = R(y < 0 ? 3 : 1, 5); f = [s]; for (i = 1; i < 5; i++) f.push(f[i - 1] * x + y); e = "Qoida: oldingi son · " + x + sgn(y); c = f[3] + " · " + x + sgn(y) + " = " + f[4]; ex = [f[3] * x, f[4] + 1, f[3] + f[2], f[4] - 2 * y]; }
    else if (k === "pron") { s = R(1, 10); for (i = 0; i < 6; i++) f.push((s + i) * (s + i + 1)); e = "Sonlar n · (n + 1) ko'rinishida: " + s + " · " + (s + 1) + ", " + (s + 1) + " · " + (s + 2) + ", …"; c = (s + 5) + " · " + (s + 6) + " = " + f[5]; ex = [f[4] + (f[4] - f[3]), (s + 5) * (s + 5), f[5] + 2]; }
    else if (k === "fib") { n = L === 3 ? 7 : 6; f = [R(1, L === 3 ? 12 : 8), R(2, L === 3 ? 15 : 10)]; for (i = 2; i <= n; i++) f.push(f[i - 1] + f[i - 2]); e = "Har bir son oldingi ikkitasining yig'indisi"; c = f[n - 2] + " + " + f[n - 1] + " = " + f[n]; ex = [f[n - 1] * 2, f[n] + 1, f[n - 1] + f[n - 3], f[n] - 1]; }
    else if (k === "trib") { f = [R(1, 4), R(1, 4), R(1, 5)]; for (i = 3; i <= 6; i++) f.push(f[i - 1] + f[i - 2] + f[i - 3]); e = "Har bir son oldingi uchtasining yig'indisi"; c = f[3] + " + " + f[4] + " + " + f[5] + " = " + f[6]; ex = [f[5] + f[4], f[6] + 1, f[5] * 2]; }
    else if (k === "prime") { s = R(0, 19); f = PRIMES.slice(s, s + 6); e = "Bular ketma-ket tub sonlar"; c = f[4] + " dan keyingi tub son — " + f[5]; ex = [f[5] + 2, f[5] - 2, f[4] + 2, f[5] + 1, f[4] + 4]; }
    else if (k === "alt3") { x = R(2, 3); y = R(1, 6); s = R(1, 5); f = [s]; for (i = 1; i < 7; i++) f.push(i % 2 ? f[i - 1] * x : f[i - 1] + y); e = "Navbat bilan: ×" + x + ", +" + y; c = f[5] + " + " + y + " = " + f[6]; ex = [f[5] * x, f[6] + y, f[6] - 1]; }
    else if (k === "sign") {
      neg = true;
      if (Math.random() < 0.5) { x = pick([2, 3]); s = R(1, x === 2 ? 5 : 3); for (i = 0; i < 5; i++) f.push(s * Math.pow(-x, i)); e = "Har safar −" + x + " ga ko'paytiriladi"; c = mms(f[3]) + " · (−" + x + ") = " + mms(f[4]); ex = [-f[4], f[4] + x, f[4] - f[3], f[4] - x]; }
      else { d = R(2, 5); s = R(1, 6); for (i = 0; i < 7; i++) f.push((i % 2 ? -1 : 1) * (s + d * i)); e = "Ishoralar navbat bilan almashadi, son qiymati esa har safar " + d + " ga ortadi"; c = "Keyingisi musbat: " + mms(f[6]); ex = [-f[6], f[6] - d, f[6] + d]; }
    }
    else if (k === "fact") { x = R(2, 3); s = R(1, 3); f = [s]; for (i = 0; i < 4; i++) f.push(f[i] * (x + i)); e = "Ko'paytuvchi har safar 1 ga ortadi: ×" + x + ", ×" + (x + 1) + ", ×" + (x + 2) + ", keyingisi ×" + (x + 3); c = f[3] + " · " + (x + 3) + " = " + f[4]; ex = [f[3] * (x + 2), f[3] * (x + 4), f[4] + 1]; }
    else { d = R(1, 4); s = R(1, 10); f = [s]; for (i = 0; i < 5; i++) f.push(f[i] + d * Math.pow(2, i)); e = "Ayirmalar har safar 2 marta ortadi: " + d + ", " + 2 * d + ", " + 4 * d + ", " + 8 * d + ", keyingisi " + 16 * d; ex = [f[4] + 8 * d, f[4] + 12 * d, f[5] + d]; } // dbld
    var a, last = f.length - 1;
    if (SEQ_MID[k] && Math.random() < (L === 3 ? 0.25 : 0.33)) { // o'rtadagi son tushib qolgan
      var h = R(1, last - 1); a = f[h];
      return Q("Qaysi son tushib qolgan?<br><b>" + f.map(function (v, j) { return j === h ? "?" : mms(v); }).join(", ") + "</b>", mms(a),
        wNum(a, [(f[h - 1] + f[h + 1]) / 2, a + (f[1] - f[0]), a - 1, a + 1, a + 2], neg), [dot(e), "Tushib qolgan son: " + mms(a) + "."]);
    }
    a = f[last];
    if (!c) { var dl = a - f[last - 1]; c = mms(f[last - 1]) + (dl >= 0 ? " + " + dl : " − " + (-dl)) + " = " + mms(a); }
    return Q(pick(SEQ_ASK) + "<br><b>" + f.slice(0, last).map(mms).join(", ") + ", ?</b>", mms(a), wNum(a, ex, neg), [dot(e), dot(c)]);
  }

  // m2 — ortiqchasini toping
  var DAYS = ["dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba", "yakshanba"];
  var MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  var CATS = {
    "mevalar": ["olma", "nok", "o'rik", "shaftoli", "uzum", "anor", "gilos", "olcha", "behi", "xurmo", "anjir"],
    "sabzavotlar": ["sabzi", "kartoshka", "piyoz", "karam", "bodring", "sholg'om", "lavlagi", "turp", "baqlajon"],
    "uy hayvonlari": ["sigir", "qo'y", "echki", "ot", "tuya", "eshak"],
    "yovvoyi hayvonlar": ["sher", "yo'lbars", "bo'ri", "ayiq", "tulki", "fil", "jirafa", "zebra"],
    "qushlar": ["chumchuq", "burgut", "laylak", "qarg'a", "lochin", "bulbul", "boyqush", "qaldirg'och"],
    "hasharotlar": ["chumoli", "asalari", "ninachi", "kapalak", "chigirtka", "pashsha", "qo'ng'iz"],
    "baliqlar": ["laqqa", "zog'ora", "cho'rtan", "sazan", "losos", "forel"],
    "daraxtlar": ["chinor", "terak", "archa", "qayrag'och", "tol", "qarag'ay", "eman"],
    "gullar": ["atirgul", "lola", "chinnigul", "nargis", "romashka", "gulsafsar"],
    "geometrik shakllar": ["kvadrat", "uchburchak", "romb", "trapetsiya", "to'rtburchak", "beshburchak"],
    "transport vositalari": ["avtobus", "poyezd", "samolyot", "velosiped", "tramvay", "kema", "taksi"],
    "musiqa asboblari": ["dutor", "rubob", "g'ijjak", "nay", "tanbur", "karnay", "pianino", "skripka", "doira"],
    "fasllar": ["bahor", "yoz", "kuz", "qish"],
    "kasblar": ["shifokor", "o'qituvchi", "haydovchi", "oshpaz", "duradgor", "muhandis", "quruvchi", "sartarosh"],
    "ranglar": ["qizil", "yashil", "sariq", "ko'k", "oq", "qora", "jigarrang", "pushti"],
    "matematik amallar": ["qo'shish", "ayirish", "ko'paytirish", "bo'lish"],
    "uzunlik birliklari": ["metr", "santimetr", "kilometr", "millimetr", "detsimetr"],
    "massa birliklari": ["gramm", "kilogramm", "tonna", "sentner", "milligramm"],
    "vaqt birliklari": ["soniya", "daqiqa", "soat", "sutka", "hafta", "yil"],
    "kiyimlar": ["ko'ylak", "shim", "kurtka", "palto", "do'ppi", "sharf", "sviter"],
    "mebel": ["stol", "stul", "shkaf", "divan", "kreslo", "karavot", "javon"],
    "idishlar": ["piyola", "choynak", "qozon", "lagan", "kosa", "likopcha", "tovoq"],
    "sport turlari": ["futbol", "kurash", "boks", "tennis", "suzish", "voleybol", "basketbol", "gimnastika"],
    "sayyoralar": ["Merkuriy", "Venera", "Mars", "Yupiter", "Saturn", "Uran", "Neptun"],
    "O'zbekiston shaharlari": ["Samarqand", "Buxoro", "Xiva", "Namangan", "Andijon", "Farg'ona", "Qarshi", "Termiz", "Jizzax", "Nukus"],
    "davlatlar": ["Qozog'iston", "Turkiya", "Yaponiya", "Misr", "Fransiya", "Hindiston", "Xitoy", "Germaniya", "Italiya"],
    "daryolar": ["Amudaryo", "Sirdaryo", "Nil", "Volga", "Dunay", "Amazonka"],
    "materiklar": ["Afrika", "Yevropa", "Osiyo", "Antarktida", "Janubiy Amerika"],
    "hafta kunlari": DAYS,
    "oylar": MONTHS,
    "o'quv qurollari": ["qalam", "ruchka", "chizg'ich", "o'chirg'ich", "daftar", "sirkul"],
    "ichimliklar": ["choy", "sut", "kefir", "sharbat", "kompot", "ayron"],
    "tana a'zolari": ["qo'l", "oyoq", "bosh", "ko'z", "quloq", "burun"]
  };
  var CAT_KEYS = Object.keys(CATS);
  var CAT_BAD = ["mevalar|daraxtlar", "uy hayvonlari|yovvoyi hayvonlar"]; // aralashtirilmaydigan (ma'nosi yaqin) juftlar
  var CAT_NEAR = [["mevalar", "sabzavotlar"], ["qushlar", "hasharotlar"], ["uzunlik birliklari", "massa birliklari"], ["massa birliklari", "vaqt birliklari"], ["uzunlik birliklari", "vaqt birliklari"],
    ["davlatlar", "O'zbekiston shaharlari"], ["daryolar", "O'zbekiston shaharlari"], ["kiyimlar", "mebel"], ["idishlar", "mebel"], ["gullar", "daraxtlar"], ["sayyoralar", "materiklar"],
    ["baliqlar", "qushlar"], ["yovvoyi hayvonlar", "qushlar"], ["hafta kunlari", "oylar"], ["fasllar", "oylar"], ["ichimliklar", "idishlar"], ["davlatlar", "materiklar"], ["kasblar", "sport turlari"]];
  function catOk(a, b) { return a !== b && CAT_BAD.indexOf(a + "|" + b) < 0 && CAT_BAD.indexOf(b + "|" + a) < 0; }
  function m2words(L) {
    var c1, c2, nr;
    if (L === 3 || (L === 2 && Math.random() < 0.3)) { nr = shuffle(pick(CAT_NEAR)); c1 = nr[0]; c2 = nr[1]; }
    else { c1 = pick(CAT_KEYS); do { c2 = pick(CAT_KEYS); } while (!catOk(c1, c2)); }
    var k = L === 1 ? 3 : 4, same = shuffle(CATS[c1]).slice(0, k), a = pick(CATS[c2]);
    return Q("Qaysi so'z ortiqcha?<br><b>" + shuffle(same.concat([a])).join(", ") + "</b>", a, same, [same.join(", ") + " — " + c1 + "; " + a + " esa " + c2 + " qatoriga kiradi."]);
  }
  // boshqa oddiy qoida boshqa sonni "ortiqcha" qilib qo'ymasligi uchun tekshiruv
  var NPROPS = [function (n) { return n % 2; }, isPrime, isSq, isCube, function (n) { return n % 3 === 0; }, function (n) { return n % 4 === 0; }, function (n) { return n % 5 === 0; },
    function (n) { return n % 7 === 0; }, function (n) { return n % 9 === 0; }, function (n) { return String(n).length; }, dsum, function (n) { return n % 10; }, isPal, isRep, isRun];
  function oddOK(all, a) {
    for (var p = 0; p < NPROPS.length; p++) {
      var keys = all.map(NPROPS[p]), cnt = {}, j, ks;
      keys.forEach(function (k) { cnt[k] = (cnt[k] || 0) + 1; });
      ks = Object.keys(cnt); if (ks.length !== 2) continue;
      var lone = cnt[ks[0]] === 1 ? ks[0] : cnt[ks[1]] === 1 ? ks[1] : null;
      if (lone === null) continue;
      for (j = 0; j < all.length; j++) if (String(keys[j]) === lone && all[j] !== a) return false;
    }
    return true;
  }
  function distinctNums(n, gen, bad) { var o = [], g = 0, x; while (o.length < n && g++ < 200) { x = gen(); if (o.indexOf(x) < 0 && (!bad || !bad(x))) o.push(x); } return o; }
  function factorTxt(n) { for (var i = 2; i * i <= n; i++) if (n % i === 0) return i + " · " + (n / i); return ""; }
  var M2_RULES = { 1: ["div", "par", "dig", "rep", "sq"], 2: ["div", "prime", "sq", "dsum", "pal", "rep", "run"], 3: ["div", "prime", "sq", "cube", "dsum", "div9", "pal"] };
  function m2num(L, r) {
    var nums, a, ex, k, S, cnt = L === 3 ? 4 : 3, t;
    if (r === "div") {
      k = pick(L === 1 ? [3, 4, 5, 10] : L === 2 ? [3, 4, 6, 7, 8, 9, 11, 12] : [6, 7, 8, 9, 11, 12, 13, 15]);
      t = L === 1 ? 99 : L === 2 ? 150 : 400;
      nums = distinctNums(cnt, function () { return k * R(Math.ceil(10 / k), Math.floor(t / k)); });
      do { a = R(10, t); } while (a % k === 0);
      ex = a + " soni " + k + " ga bo'linmaydi, qolganlari " + k + " ga bo'linadi.";
    } else if (r === "par") {
      var odd = Math.random() < 0.5; nums = distinctNums(cnt, function () { return R(11, 99); }, function (x) { return (x % 2 === 1) !== odd; });
      do { a = R(11, 99); } while ((a % 2 === 1) === odd);
      ex = a + (odd ? " juft" : " toq") + " son, qolganlari " + (odd ? "toq." : "juft.");
    } else if (r === "dig") {
      var big = Math.random() < 0.5; nums = distinctNums(cnt, function () { return big ? R(100, 999) : R(10, 99); });
      a = big ? R(10, 99) : R(100, 999); ex = a + " — " + (big ? "ikki" : "uch") + " xonali, qolganlari " + (big ? "uch" : "ikki") + " xonali.";
    } else if (r === "rep") {
      nums = distinctNums(cnt, function () { return Math.random() < 0.5 ? 11 * R(1, 9) : 111 * R(1, 9); });
      do { a = R(1, 9) * 111 + pick([1, 10, -1, -10, 100]); } while (isRep(a) || a < 100 || a > 999);
      ex = "Qolganlarining hamma raqamlari bir xil, " + a + " niki esa har xil.";
    } else if (r === "sq") {
      t = L === 1 ? 10 : L === 2 ? 20 : 31;
      nums = distinctNums(cnt, function () { var b = R(2, t); return b * b; });
      do { a = R(10, t * t); } while (isSq(a));
      ex = a + " to'la kvadrat emas, qolganlari to'la kvadratlar (" + nums.map(function (x) { return Math.round(Math.sqrt(x)) + "²"; }).join(", ") + ").";
    } else if (r === "cube") {
      nums = distinctNums(cnt, function () { var b = R(2, 10); return b * b * b; });
      do { a = R(9, 999); } while (isCube(a));
      ex = a + " butun sonning kubi emas, qolganlari kublar (" + nums.map(function (x) { return Math.round(Math.pow(x, 1 / 3)) + "³"; }).join(", ") + ").";
    } else if (r === "prime") {
      t = L === 2 ? 99 : 199;
      nums = distinctNums(cnt, function () { return R(11, t); }, function (x) { return !isPrime(x); });
      do { a = R(11, t) | 1; } while (isPrime(a) || a % 5 === 0);
      ex = a + " tub emas (" + a + " = " + factorTxt(a) + "), qolganlari tub sonlar.";
    } else if (r === "dsum") {
      S = R(7, 16); t = L === 3 ? [100, 999] : [10, 99];
      nums = distinctNums(cnt, function () { return R(t[0], t[1]); }, function (x) { return dsum(x) !== S; });
      do { a = R(t[0], t[1]); } while (dsum(a) === S || Math.abs(dsum(a) - S) > 3);
      ex = "Qolganlarining raqamlari yig'indisi " + S + ", " + a + " niki esa " + dsum(a) + ".";
    } else if (r === "div9") {
      nums = distinctNums(cnt, function () { return 9 * R(12, 111); });
      do { a = 3 * R(34, 333); } while (a % 9 === 0);
      ex = "Raqamlar yig'indisi 9 ga bo'linsa, son 9 ga bo'linadi. " + a + ": " + dsum(a) + " — 9 ga bo'linmaydi.";
    } else if (r === "pal") {
      nums = distinctNums(cnt, function () { var x = R(1, 9), y = R(0, 9); return L === 3 && Math.random() < 0.5 ? x * 1001 + y * 110 : x * 101 + y * 10; });
      do { a = R(100, 999); } while (isPal(a) || a % 10 === 0);
      ex = "Qolganlari teskarisiga o'qilganda ham bir xil (palindrom), " + a + " esa yo'q.";
    } else { // run
      nums = distinctNums(cnt, function () { var s0 = R(1, 7); return s0 * 100 + (s0 + 1) * 10 + s0 + 2; });
      var s1 = R(1, 5); a = pick([s1 * 100 + (s1 + 2) * 10 + s1 + 4, s1 * 100 + (s1 + 2) * 10 + s1 + 1, (s1 + 1) * 100 + s1 * 10 + s1 + 2]);
      ex = "Qolganlarining raqamlari ketma-ket ortib boradi (masalan, 3-4-5), " + a + " niki esa yo'q.";
    }
    if (nums.length < cnt || nums.indexOf(a) > -1) return null;
    var all = nums.concat([a]);
    if (!oddOK(all, a)) return null;
    return Q("Qaysi son boshqalaridan farq qiladi?<br><b>" + shuffle(all).join(", ") + "</b>", String(a), nums.map(String), [ex]);
  }
  function m2(L) {
    if (Math.random() < (L === 1 ? 0.5 : L === 2 ? 0.35 : 0.3)) return m2words(L);
    var r0 = pick(M2_RULES[L]);
    for (var g0 = 0; g0 < 200; g0++) { var p0 = m2num(L, r0); if (p0) return p0; }
    for (var g = 0; g < 60; g++) { var p = m2num(L, pick(M2_RULES[L])); if (p) return p; }
    return m2words(L);
  }

  // m3 — harflar, kunlar, oylar, soat va taqvim
  var MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var CODE_W = ["KITOB", "MAKTAB", "DAFTAR", "QALAM", "OLMA", "BAHOR", "DUNYO", "SINF", "ILM", "VATAN", "OTA", "ONA", "KUZ", "QISH", "YOZ", "DARS", "BILIM", "MEHR", "ZAFAR", "TOSH", "SUV", "GUL", "QUYOSH", "OSMON", "DOST", "NON", "ANOR", "TULKI"];
  var REL_D = [[-2, "Kechadan oldingi kun", " edi", "Kechadan oldingi kun qaysi kun edi?"], [-1, "Kecha", " edi", "Kecha qaysi kun edi?"], [0, "Bugun", "", "Bugun qaysi kun?"], [1, "Ertaga", " bo'ladi", "Ertaga qaysi kun bo'ladi?"], [2, "Ertadan keyingi kun", " bo'ladi", "Ertadan keyingi kun qaysi kun bo'ladi?"]];
  function letW(i, offs) { var o = []; offs.forEach(function (x) { var c = ABC.charAt(i + x); if (c && i + x >= 0 && o.indexOf(c) < 0) o.push(c); }); return o; }
  function hhmm(m) { m = ((m % 1440) + 1440) % 1440; var h = Math.floor(m / 60), mm = m % 60; return h + ":" + (mm < 10 ? "0" : "") + mm; }
  function doyOf(m, d) { var s = d; for (var i = 0; i < m; i++) s += MDAYS[i]; return s; }
  function fromDoy(n) { for (var m = 0; m < 12; m++) { if (n <= MDAYS[m]) return [m, n]; n -= MDAYS[m]; } return [11, 31]; }
  function dstr(md) { return md[1] + "-" + MONTHS[md[0]]; }
  function dayW(i) { return [1, 6, 2, 5, 3].map(function (x) { return DAYS[(i + x) % 7]; }); }
  function dur(m) { var h = Math.floor(m / 60), r = m % 60; return h ? h + " soat" + (r ? " " + r + " daqiqa" : "") : r + " daqiqa"; }
  function m3(L) {
    var v = pick(L === 1 ? ["let", "day", "mon", "letpos", "rel", "mday", "ang", "h24"]
      : L === 2 ? ["let", "letmix", "day", "clock", "mon", "rel", "date", "doy", "ang", "h24", "code", "mday"]
        : ["day2", "clock2", "let2", "mon2", "date", "doy", "ang", "night", "letpair", "code"]);
    var a, i, t = [], s, d, x, y, n, h, mm;
    if (v === "let" || v === "let2") {
      d = v === "let" ? pick([1, 2, 3]) : pick([2, 3, 4]); s = R(0, 25 - 4 * d);
      if (v === "let2" && Math.random() < 0.5) { // kamayib boruvchi
        s = R(4 * d, 25); for (i = 0; i < 4; i++) t.push(ABC.charAt(s - d * i)); a = ABC.charAt(s - 4 * d);
        return Q("Harflar qatorini davom ettiring:<br><b>" + t.join(", ") + ", ?</b>", a, letW(s - 4 * d, [1, -1, 2, -2, d, 3, -3]), ["Har safar lotin alifbosida " + d + " harf orqaga: " + t[3] + " → " + a + "."]);
      }
      for (i = 0; i < 4; i++) t.push(ABC.charAt(s + d * i)); a = ABC.charAt(s + 4 * d);
      return Q("Harflar qatorini davom ettiring:<br><b>" + t.join(", ") + ", ?</b>", a, letW(s + 4 * d, [1, -1, 2, -2, -d, -3, 3]), ["Har safar lotin alifbosida " + d + " harf oldinga: " + t[3] + " → " + a + "."]);
    }
    if (v === "letmix") {
      x = R(1, 3); y = R(1, 3); if (x === y) y = x % 3 + 1; s = R(0, 25 - 3 * x - 2 * y); t = [s];
      for (i = 1; i < 6; i++) t.push(t[i - 1] + (i % 2 ? x : y));
      a = ABC.charAt(t[5]);
      return Q("Harflar qatorini davom ettiring:<br><b>" + t.slice(0, 5).map(function (j) { return ABC.charAt(j); }).join(", ") + ", ?</b>", a, letW(t[5], [y - x, 1, -1, 2, -2, -3]), ["Navbat bilan " + x + " va " + y + " harf oldinga: " + ABC.charAt(t[4]) + " → " + a + "."]);
    }
    if (v === "letpos") {
      i = R(0, 25);
      if (Math.random() < 0.5) return QN("Lotin alifbosida <b>" + ABC.charAt(i) + "</b> harfi nechanchi o'rinda turadi?", i + 1, [i, i + 2, 26 - i, i + 3], ["A — 1, B — 2, C — 3, … sanab boramiz: " + ABC.charAt(i) + " — " + (i + 1) + "-harf."]);
      return Q("Lotin alifbosidagi <b>" + (i + 1) + "-harf</b> qaysi?", ABC.charAt(i), letW(i, [1, -1, 2, -2, 3, -3]), ["A — 1, B — 2, … sanab boramiz: " + (i + 1) + "-harf — " + ABC.charAt(i) + "."]);
    }
    if (v === "letpair") {
      var pr = [];
      if (Math.random() < 0.5) { // ko'zgu: AZ, BY, CX
        s = R(0, 8); for (i = 0; i < 3; i++) pr.push(ABC.charAt(s + i) + ABC.charAt(25 - s - i)); a = ABC.charAt(s + 3) + ABC.charAt(22 - s);
        return Q("Harf juftlari qatorini davom ettiring:<br><b>" + pr.join(", ") + ", ?</b>", a, [ABC.charAt(s + 3) + ABC.charAt(21 - s), ABC.charAt(s + 4) + ABC.charAt(22 - s), ABC.charAt(s + 3) + ABC.charAt(23 - s), ABC.charAt(s + 2) + ABC.charAt(22 - s)], ["Birinchi harf alifbo boshidan oldinga, ikkinchisi oxiridan orqaga yuradi: " + a + "."]);
      }
      x = pick([1, 2]); d = R(1, 4); s = R(0, 25 - 3 * x - d);
      for (i = 0; i < 3; i++) pr.push(ABC.charAt(s + x * i) + ABC.charAt(s + x * i + d)); a = ABC.charAt(s + 3 * x) + ABC.charAt(s + 3 * x + d);
      return Q("Harf juftlari qatorini davom ettiring:<br><b>" + pr.join(", ") + ", ?</b>", a, [ABC.charAt(s + 3 * x) + (ABC.charAt(s + 3 * x + d + 1) || "A"), ABC.charAt(s + 3 * x + 1) + ABC.charAt(s + 3 * x + d), ABC.charAt(s + 3 * x) + ABC.charAt(s + 3 * x + d - 1), ABC.charAt(s + 3 * x - 1) + ABC.charAt(s + 3 * x + d - 1)].filter(function (z) { return z.length === 2; }), ["Juftning birinchi harfi har safar " + x + " ta oldinga siljiydi, ikkinchisi undan " + d + " ta keyin turadi: " + a + "."]);
    }
    if (v === "code") {
      var wd = pick(CODE_W), sum = 0, parts = [];
      for (i = 0; i < wd.length; i++) { var cv = ABC.indexOf(wd.charAt(i)) + 1; sum += cv; parts.push(wd.charAt(i) + "=" + cv); }
      return QN("A = 1, B = 2, …, Z = 26 bo'lsa, <b>" + wd + "</b> so'zidagi harflar sonlarining yig'indisi nechaga teng?", sum, [sum + 1, sum - 1, sum + 2, sum - 10, sum + 10], [parts.join(", ") + ".", "Yig'indi: " + sum + "."]);
    }
    if (v === "day" || v === "day2") {
      var dd = R(0, 6); n = v === "day" ? R(2, 20) : R(25, 200); var back = v === "day2" && Math.random() < 0.4;
      a = ((dd + (back ? -n : n)) % 7 + 7) % 7;
      return Q("Bugun <b>" + DAYS[dd] + "</b>. " + n + " kun" + (back ? " oldin" : "dan keyin") + " haftaning qaysi kuni " + (back ? "bo'lgan" : "bo'ladi") + "?", DAYS[a], dayW(a), [n + " = 7 · " + Math.floor(n / 7) + " + " + (n % 7) + " — to'liq haftalar kunni o'zgartirmaydi, faqat " + (n % 7) + " kun " + (back ? "orqaga" : "oldinga") + " sanaymiz."]);
    }
    if (v === "mday") {
      var w0 = R(0, 6); d = R(5, 28); a = (w0 + d - 1) % 7;
      return Q("Oyning 1-sanasi — <b>" + DAYS[w0] + "</b>. Shu oyning " + d + "-sanasi haftaning qaysi kuni?", DAYS[a], dayW(a), [d + "-sana 1-sanadan " + (d - 1) + " kun keyin: " + (d - 1) + " = 7 · " + Math.floor((d - 1) / 7) + " + " + ((d - 1) % 7) + " → " + DAYS[w0] + "dan " + ((d - 1) % 7) + " kun oldinga."]);
    }
    if (v === "rel") {
      var r1 = pick(REL_D), r2; do { r2 = pick(REL_D); } while (r2 === r1);
      var dk = R(0, 6), today = ((dk - r1[0]) % 7 + 7) % 7; a = (today + r2[0] + 7) % 7;
      return Q(r1[1] + " <b>" + DAYS[dk] + "</b>" + r1[2] + ". " + r2[3], DAYS[a], dayW(a), [(r1[0] ? r1[1] + " " + DAYS[dk] + " → bugun " + DAYS[today] + ". " : "") + (r2[0] ? r2[1] + " (" + (r2[0] > 0 ? "+" : "−") + Math.abs(r2[0]) + " kun) — " + DAYS[a] + "." : "Demak, bugun " + DAYS[a] + ".")]);
    }
    if (v === "mon" || v === "mon2") {
      var mi = R(0, 11), k = v === "mon" ? R(2, 11) : R(13, 40);
      a = MONTHS[(mi + k) % 12];
      return Q("Hozir <b>" + MONTHS[mi] + "</b>. " + k + " oydan keyin qaysi oy bo'ladi?", a, [1, 2, 11, 10].map(function (z) { return MONTHS[(mi + k + z) % 12]; }), [k + " oy = " + Math.floor(k / 12) + " yil + " + (k % 12) + " oy: " + MONTHS[mi] + "dan " + (k % 12) + " oy oldinga."]);
    }
    if (v === "date") { // kabisa bo'lmagan yil: sana → hafta kuni
      var n1 = L === 2 ? doyOf(R(0, 10), 1) : R(1, 320), n2 = n1 + (L === 2 ? R(5, 50) : R(10, 365 - n1)), wk = R(0, 6);
      if (n2 > 365) n2 = 365;
      var A1 = fromDoy(n1), A2 = fromDoy(n2), df = n2 - n1, pt = [];
      a = (wk + df) % 7;
      if (A1[0] === A2[0]) pt = [String(df)];
      else { pt.push(MDAYS[A1[0]] - A1[1]); var mid = 0, mc = 0; for (i = A1[0] + 1; i < A2[0]; i++) { mid += MDAYS[i]; mc++; } if (mc) pt.push(mc > 3 ? mid + " (" + mc + " ta oy)" : mid); pt.push(A2[1]); }
      return Q("Kabisa bo'lmagan yilda <b>" + dstr(A1) + "</b> — " + DAYS[wk] + ". <b>" + dstr(A2) + "</b> haftaning qaysi kuni?", DAYS[a], dayW(a),
        [(pt.length > 1 ? "Oradagi kunlar: " + pt.join(" + ") + " = " + df + ". " : "Oradagi kunlar: " + df + ". ") + df + " = 7 · " + Math.floor(df / 7) + " + " + (df % 7) + ".", DAYS[wk] + "dan " + (df % 7) + " kun oldinga → " + DAYS[a] + "."]);
    }
    if (v === "doy") {
      n = R(32, 364); var md = fromDoy(n), cum = n - md[1];
      var stp = ["Oldingi oylar: " + MDAYS.slice(0, md[0]).join(" + ") + " = " + cum + " kun. " + n + " − " + cum + " = " + md[1] + " → " + dstr(md) + "."];
      if (L === 2) return Q("Kabisa bo'lmagan yilning <b>" + n + "-kuni</b> qaysi oyga to'g'ri keladi?", MONTHS[md[0]], [MONTHS[(md[0] + 11) % 12], MONTHS[(md[0] + 1) % 12], MONTHS[(md[0] + 2) % 12]], stp);
      return Q("Kabisa bo'lmagan yilning <b>" + n + "-kuni</b> qaysi sana?", dstr(md), [dstr(fromDoy(n - 1)), dstr(fromDoy(n + 1)), Math.min(md[1], MDAYS[(md[0] + 1) % 12]) + "-" + MONTHS[(md[0] + 1) % 12], dstr(fromDoy(Math.max(1, n - 2)))], stp);
    }
    if (v === "ang") { // soat millari orasidagi burchak
      h = L === 1 ? R(1, 11) : R(1, 12); mm = L === 1 ? 0 : L === 2 ? 30 : pick([10, 20, 30, 40, 50]);
      var hd = (h % 12) * 30 + mm / 2, mdg = mm * 6, raw = Math.abs(hd - mdg), ang = raw > 180 ? 360 - raw : raw, naive = Math.abs((h % 12) * 30 - mdg);
      if (naive > 180) naive = 360 - naive;
      var aw = [ang + 30, Math.abs(ang - 30), 360 - ang, mm ? naive : h * 6, ang + 15, Math.abs(ang - 15)].filter(function (z) { return z !== ang; }).map(function (z) { return z + "°"; });
      return Q("Soat aynan <b>" + h + ":" + p2(mm) + "</b> ni ko'rsatmoqda. Soat va daqiqa millari orasidagi kichik burchak necha gradus?", ang + "°", aw,
        mm ? ["Daqiqa mili: " + mm + " · 6° = " + mdg + "°. Soat mili: " + (h % 12) + " · 30° + " + mm + " · 0,5° = " + hd + "°.", "Farq: " + raw + "°" + (raw > 180 ? ", kichigi 360° − " + raw + "° = " + ang + "°" : "") + "."]
          : ["Har bir soat oralig'i 360° : 12 = 30°. " + h + " oraliq → " + (h * 30) + "°" + (h > 6 ? ", kichigi 360° − " + (h * 30) + "° = " + ang + "°" : "") + "."]);
    }
    if (v === "h24") {
      mm = 5 * R(0, 11);
      if (L === 1 || Math.random() < 0.5) {
        h = R(1, 11); a = (h + 12) + ":" + p2(mm);
        return Q("<b>" + (h <= 5 ? "Tushdan keyin" : "Kechki") + " soat " + h + ":" + p2(mm) + "</b> 24 soatlik ko'rinishda qanday yoziladi?", a, [h + ":" + p2(mm), (h + 10) + ":" + p2(mm), (h + 11) + ":" + p2(mm), (h + 13 <= 23 ? h + 13 : h + 9) + ":" + p2(mm)], ["Tushdan keyingi vaqtga 12 qo'shiladi: " + h + " + 12 = " + (h + 12) + "."]);
      }
      h = R(13, 23); a = (h - 12) + ":" + p2(mm);
      return Q("Soat <b>" + h + ":" + p2(mm) + "</b>. 12 soatlik siferblatli soatda millar soat nechani ko'rsatadi?", a, [(h - 11) + ":" + p2(mm), (h - 10) + ":" + p2(mm), (h - 13 > 0 ? h - 13 : h - 9) + ":" + p2(mm), (h - 12) + ":" + p2((mm + 30) % 60)], [h + " − 12 = " + (h - 12) + " → " + a + "."]);
    }
    if (v === "clock") {
      var st = R(6, 20) * 60 + pick([0, 10, 15, 20, 30, 40, 45, 50]), du = R(1, 3) * 60 + pick([5, 15, 20, 25, 35, 40, 50]);
      a = hhmm(st + du);
      return Q("Dars soat <b>" + hhmm(st) + "</b> da boshlandi va " + Math.floor(du / 60) + " soat " + (du % 60) + " daqiqa davom etdi. Qachon tugadi?", a, [hhmm(st + du + 60), hhmm(st + du - 10), hhmm(st + du + 10), hhmm(st + Math.floor(du / 60) * 100 % 1440)], [hhmm(st) + " + " + Math.floor(du / 60) + " soat = " + hhmm(st + Math.floor(du / 60) * 60) + ", yana " + (du % 60) + " daqiqa → " + a + "."]);
    }
    if (v === "night") { // yarim tundan o'tadigan sayohat
      var s1n = R(20, 23) * 60 + pick([10, 20, 25, 35, 40, 50]), dn = R(5, 10) * 60 + pick([5, 15, 25, 35, 45, 55]), e1 = (s1n + dn) % 1440, nv = s1n - e1;
      a = dur(dn);
      return Q("Poyezd kechqurun <b>" + hhmm(s1n) + "</b> da jo'nab, ertasi kuni <b>" + hhmm(e1) + "</b> da yetib keldi. Yo'lda qancha vaqt bo'ldi?", a, [dur(nv), dur(dn + 60), dur(dn - 60), Math.floor(dn / 60) + " soat " + (60 - dn % 60) + " daqiqa"], ["Yarim tungacha: 24:00 − " + hhmm(s1n) + " = " + dur(1440 - s1n) + ".", "Keyin yana " + dur(e1) + ": jami " + a + "."]);
    }
    // clock2 — ikki vaqt orasidagi farq
    var s1 = R(7, 12) * 60 + pick([0, 15, 20, 30, 45]), s2 = s1 + R(2, 9) * 60 + pick([10, 25, 35, 50]), df2 = s2 - s1;
    a = dur(df2);
    return Q("Poyezd <b>" + hhmm(s1) + "</b> da jo'nab, <b>" + hhmm(s2) + "</b> da yetib keldi. Yo'lda qancha vaqt bo'ldi?", a, [dur(df2 + 60), Math.floor(df2 / 60) + " soat " + ((df2 % 60 + 10) % 60) + " daqiqa", dur(df2 - 60), Math.floor(df2 / 60) + " soat " + (60 - df2 % 60) + " daqiqa"], [hhmm(s2) + " − " + hhmm(s1) + " = " + a + "."]);
  }

  // m4 — mantiqiy xulosa: sillogizmlar, «agar … bo'lsa», «hamma / ba'zi / hech bir»
  var NO_X = "Aniq xulosa chiqarib bo'lmaydi";
  var SYL = [ // [guruh (ko'plik), birlik, xususiyat, misol, guruhga kirmaydigan, kengroq guruh]
    ["qushlar", "qush", "tuxum qo'yadi", "laylak", "mushuk", "hayvonlar"], ["sutemizuvchilar", "sutemizuvchi", "bolasini sut bilan boqadi", "delfin", "timsoh", "hayvonlar"],
    ["metallar", "metall", "elektr tokini o'tkazadi", "mis", "shisha", "moddalar"], ["kvadratlar", "kvadrat", "to'rtta teng tomonga ega", "ABCD", "uchburchak", "shakllar"],
    ["juft sonlar", "juft son", "2 ga bo'linadi", "48", "37", "natural sonlar"], ["daraxtlar", "daraxt", "yog'och tanaga ega", "chinor", "tosh", "o'simliklar"],
    ["baliqlar", "baliq", "jabra bilan nafas oladi", "zog'ora baliq", "kit", "suv jonzotlari"], ["hasharotlar", "hasharot", "oltita oyoqqa ega", "chumoli", "o'rgimchak", "jonivorlar"],
    ["yulduzlar", "yulduz", "o'zi nur sochadi", "Quyosh", "Oy", "osmon jismlari"], ["tub sonlar", "tub son", "ikkita bo'luvchiga ega", "13", "15", "natural sonlar"]
  ];
  var SOME = [["o'quvchilar", "o'quvchi", "shaxmat o'ynaydi", "Aziz"], ["sportchilar", "sportchi", "suzishni biladi", "Kamola"], ["shifokorlar", "shifokor", "ingliz tilini biladi", "Doniyor"], ["haydovchilar", "haydovchi", "Samarqandda yashaydi", "Rustam"], ["talabalar", "talaba", "kutubxonaga boradi", "Malika"]];
  var LOGIC_BANK = [
    [1, "A = B va B = C bo'lsa, A va C haqida nima deyish mumkin?", "A = C", ["A > C", "A < C", "Aniq emas"], "Tenglik tranzitiv: A = B = C."],
    [2, "A > B va B > C bo'lsa, qaysi biri to'g'ri?", "A > C", ["C > A", "A = C", "B > A"], "A > B > C."],
    [2, "Hamma mushuklar hayvon. Ba'zi hayvonlar uyda yashaydi. Qaysi xulosa albatta to'g'ri?", "Albatta to'g'ri xulosa yo'q", ["Hamma mushuk uyda yashaydi", "Hech bir mushuk uyda yashamaydi", "Hamma hayvon mushuk"], "«Ba'zi hayvonlar» ichida mushuklar bo'lishi shart emas."],
    [1, "Qutida faqat qizil va ko'k qalamlar bor. Olingan qalam qizil emas. U qanday qalam?", "Ko'k", ["Qizil", "Sariq", "Aniq emas"], "Faqat ikki tur bor — biri bo'lmasa, ikkinchisi."],
    [3, "Bir kishi: «Men hozir yolg'on gapiryapman» dedi. Bu gap haqida nima deyish mumkin?", "Bu paradoks: rost ham, yolg'on ham emas", ["Rost", "Yolg'on", "Har doim rost"], "Rost desak — yolg'on bo'ladi, yolg'on desak — rost bo'ladi (yolg'onchi paradoksi)."],
    [2, "To'g'ri chiziqlar a ∥ b va b ∥ c. a va c qanday joylashgan?", "a ∥ c", ["a ⊥ c", "kesishadi", "aniq emas"], "Parallellik tranzitiv."],
    [3, "Har bir juft son 2 ga bo'linadi. 2 ga bo'linadigan son albatta juftmi?", "Ha", ["Yo'q", "Ba'zan", "Faqat musbat bo'lsa"], "2 ga bo'linish va juftlik — bir xil xossa (teng kuchli)."],
    [3, "Har bir kvadrat — romb. Har bir romb kvadratmi?", "Yo'q", ["Ha", "Faqat katta romb", "Aniq emas"], "Burchaklari to'g'ri bo'lmagan romb kvadrat emas."],
    [2, "Tekislikda ikki to'g'ri chiziq uchinchisiga perpendikulyar. Bu ikki chiziq qanday?", "O'zaro parallel", ["O'zaro perpendikulyar", "Kesishadi", "Ustma-ust tushadi"], "Tekislikda bir chiziqqa perpendikulyar ikki chiziq parallel."]
  ];
  function SCH_G() { // [ko'plik, birlik]
    var t = R(0, 3), n;
    if (t === 0) { n = R(5, 11) + "-«" + pick(["A", "B", "V", "G", "D"]) + "» sinf"; return [n + " o'quvchilari", n + " o'quvchisi"]; }
    if (t === 1) { n = pick(["shaxmat", "robototexnika", "rasm", "matematika", "futbol", "kurash", "dasturlash", "qo'shiq"]) + " to'garagi"; return [n + " a'zolari", n + " a'zosi"]; }
    if (t === 2) { n = R(1, 12) + "-guruh"; return [n + " talabalari", n + " talabasi"]; }
    n = pick(["olimpiada", "tanlov", "viktorina"]); return [n + " g'oliblari", n + " g'olibi"];
  }
  var SCH_P = [["ekskursiyaga bordi", "ekskursiyaga bormadi"], ["imtihondan o'tdi", "imtihondan o'tmadi"], ["sovg'a oldi", "sovg'a olmadi"], ["mashqni bajardi", "mashqni bajarmadi"], ["formada keldi", "formada kelmadi"],
    ["kitobni o'qib chiqdi", "kitobni o'qib chiqmadi"], ["testni yechdi", "testni yechmadi"], ["musobaqaga qatnashdi", "musobaqaga qatnashmadi"], ["darsga kechikdi", "darsga kechikmadi"], ["daraxt ekdi", "daraxt ekmadi"]];
  function m4sch(L) {
    var g = SCH_G(), p = pick(SCH_P), nm = pick(NAMES), v = pick(L === 1 ? ["A", "E", "MT", "I"] : L === 2 ? ["A", "E", "MT", "I", "AC", "EN"] : ["MT", "AC", "DA", "EN", "I", "E"]);
    var isG = nm + " — " + g[1], notG = nm + " " + g[1] + " emas", P = nm + " " + p[0], NP = nm + " " + p[1], ask = "<br>" + nm + " haqida qaysi xulosa to'g'ri?";
    var A = "Barcha " + g[0] + " " + p[0] + ". ", E = "Hech bir " + g[1] + " " + p[1] + ". ";
    if (v === "A") return Q(A + isG + "." + ask, P, [NP, NO_X, notG], ["Guruhning hamma a'zolari " + p[0] + "; " + nm + " shu guruhdan — demak, u ham " + p[0] + "."]);
    if (v === "E") return Q(E + isG + "." + ask, NP, [P, NO_X, notG], ["«Hech bir» — guruhdagi hech kim. " + nm + " shu guruhdan — demak, u ham " + p[1] + "."]);
    if (v === "MT") return Q(A + NP + "." + ask, notG, [isG, NO_X, P], ["Guruhning hamma a'zolari " + p[0] + ", " + nm + " esa yo'q — demak, u shu guruhda emas."]);
    if (v === "EN") return Q(E + P + "." + ask, notG, [isG, NO_X, NP], ["Guruhdagi hech kim bunday qilmagan, " + nm + " esa qilgan — demak, u shu guruhdan emas."]);
    if (v === "I") return Q("Ba'zi " + g[0] + " " + p[0] + ". " + isG + "." + ask, NO_X, [P, NP, notG], ["«Ba'zi» — hammasi emas: " + nm + " ular orasida bo'lishi ham, bo'lmasligi ham mumkin."]);
    if (v === "AC") return Q(A + P + "." + ask, NO_X, [isG, notG, NP], ["Guruhdan tashqaridagilar ham shunday qilgan bo'lishi mumkin — " + nm + " guruhdami, yo'qmi, noma'lum."]);
    return Q(A + notG + "." + ask, NO_X, [NP, P, isG], ["Qoida faqat guruh a'zolari haqida; guruhdan tashqaridagilar haqida hech narsa aytilmagan."]);
  }
  function m4syl(L) {
    var y = pick(SYL), v = pick(L === 1 ? [0, 1] : L === 2 ? [0, 1, 2, 3] : [1, 2]);
    if (v === 0) return Q("Barcha " + y[0] + " " + y[2] + ". " + cap(y[3]) + " — " + y[0] + "dan biri. Xulosa?", cap(y[3]) + " " + y[2], [cap(y[3]) + " " + neg(y[2]), NO_X, cap(y[3]) + " " + y[1] + " emas"], ["Umumiy qoida guruhning har bir a'zosiga tegishli."]);
    if (v === 1) return Q("Barcha " + y[0] + " " + y[2] + ". " + cap(y[4]) + " " + neg(y[2]) + ". Xulosa?", cap(y[4]) + " " + y[1] + " emas", [cap(y[4]) + " " + y[1], NO_X, cap(y[4]) + " " + y[2]], ["Agar " + y[4] + " " + y[1] + " bo'lganida, bu xossaga ega bo'lardi. Xossa yo'q — demak, " + y[1] + " emas (kontrapozitsiya)."]);
    if (v === 2) return Q("Barcha " + y[0] + " " + y[2] + ". Ba'zi " + y[5] + " — " + y[0] + ". Qaysi xulosa to'g'ri?", "Ba'zi " + y[5] + " " + y[2], ["Barcha " + y[5] + " " + y[2], "Barcha " + y[5] + " — " + y[0], NO_X], ["Ba'zi " + y[5] + " " + y[0] + " qatoriga kiradi, " + y[0] + " esa hammasi " + y[2] + "."]);
    var o = pick(SOME);
    return Q("Ba'zi " + o[0] + " " + o[2] + ". " + o[3] + " — " + o[1] + ". " + o[3] + " haqida qaysi xulosa to'g'ri?", NO_X, [o[3] + " albatta " + o[2], o[3] + " " + neg(o[2]), o[3] + " " + o[1] + " emas"], ["«Ba'zi» — hammasi emas. " + o[3] + " o'sha «ba'zi»lar ichida bo'lishi ham, bo'lmasligi ham mumkin."]);
  }
  // «Agar p bo'lsa, q»: [ega, intro, p shart, ¬p shart, q shart, ¬q shart, p natija, ¬p natija, q natija, ¬q natija, p fakt, ¬p fakt, q fakt, ¬q fakt]
  var COND = [
    ["", "", "yomg'ir yog'sa", "yomg'ir yog'masa", "yer ho'l bo'lsa", "yer ho'l bo'lmasa", "yomg'ir yog'gan", "yomg'ir yog'magan", "yer ho'l bo'ladi", "yer ho'l bo'lmaydi", "Yomg'ir yog'di", "Yomg'ir yog'madi", "Yer ho'l", "Yer ho'l emas"],
    ["son", "", "son {k} ga bo'linsa", "son {k} ga bo'linmasa", "son {m} ga bo'linsa", "son {m} ga bo'linmasa", "{u} {k} ga bo'linadi", "{u} {k} ga bo'linmaydi", "{u} {m} ga bo'linadi", "{u} {m} ga bo'linmaydi", "Son {k} ga bo'linadi", "Son {k} ga bo'linmaydi", "Son {m} ga bo'linadi", "Son {m} ga bo'linmaydi"],
    ["{N}", "", "{N} imtihondan o'tsa", "{N} imtihondan o'tmasa", "{N} sovg'a olsa", "{N} sovg'a olmasa", "{u} imtihondan o'tgan", "{u} imtihondan o'tmagan", "{u} sovg'a oladi", "{u} sovg'a olmaydi", "{N} imtihondan o'tdi", "{N} imtihondan o'tmadi", "{N} sovg'a oldi", "{N} sovg'a olmadi"],
    ["", "", "chiroq yonsa", "chiroq yonmasa", "xonada tok bo'lsa", "xonada tok bo'lmasa", "chiroq yonadi", "chiroq yonmaydi", "xonada tok bor", "xonada tok yo'q", "Chiroq yonyapti", "Chiroq yonmayapti", "Xonada tok bor", "Xonada tok yo'q"],
    ["ABC", "ABC — uchburchak. ", "ABC teng tomonli bo'lsa", "ABC teng tomonli bo'lmasa", "ABC teng yonli bo'lsa", "ABC teng yonli bo'lmasa", "{u} teng tomonli", "{u} teng tomonli emas", "{u} teng yonli", "{u} teng yonli emas", "ABC teng tomonli", "ABC teng tomonli emas", "ABC teng yonli", "ABC teng yonli emas"],
    ["{N}", "", "{N} {C}da bo'lsa", "{N} {C}da bo'lmasa", "{N} O'zbekistonda bo'lsa", "{N} O'zbekistonda bo'lmasa", "{u} {C}da", "{u} {C}da emas", "{u} O'zbekistonda", "{u} O'zbekistonda emas", "{N} {C}da", "{N} {C}da emas", "{N} O'zbekistonda", "{N} O'zbekistonda emas"],
    ["", "", "bugun yakshanba bo'lsa", "bugun yakshanba bo'lmasa", "maktab yopiq bo'lsa", "maktab ochiq bo'lsa", "bugun yakshanba", "bugun yakshanba emas", "maktab yopiq bo'ladi", "maktab ochiq bo'ladi", "Bugun yakshanba", "Bugun yakshanba emas", "Maktab yopiq", "Maktab ochiq"],
    ["{N}", "", "{N} uy vazifasini bajarsa", "{N} vazifani bajarmasa", "{N} futbolga borsa", "{N} futbolga bormasa", "{u} vazifani bajargan", "{u} vazifani bajarmagan", "{u} futbolga boradi", "{u} futbolga bormaydi", "{N} uy vazifasini bajardi", "{N} uy vazifasini bajarmadi", "{N} futbolga bordi", "{N} futbolga bormadi"],
    ["shakl", "", "shakl kvadrat bo'lsa", "shakl kvadrat bo'lmasa", "shakl romb bo'lsa", "shakl romb bo'lmasa", "{u} kvadrat", "{u} kvadrat emas", "{u} romb bo'ladi", "{u} romb bo'lmaydi", "Shakl kvadrat", "Shakl kvadrat emas", "Shakl romb", "Shakl romb emas"]
  ];
  var DIVP = [[10, 5], [9, 3], [6, 2], [6, 3], [4, 2], [8, 4], [12, 4], [12, 6], [15, 5], [20, 10], [15, 3], [100, 10], [25, 5], [18, 9], [8, 2], [20, 4]];
  function m4cond(L) {
    var it = pick(COND), nm = pick(NAMES), dp = pick(DIVP), city = pick(["Samarqand", "Buxoro", "Xiva", "Termiz", "Nukus", "Qarshi", "Andijon"]);
    function f(s) { return s.replace(/\{N\}/g, nm).replace(/\{k\}/g, dp[0]).replace(/\{m\}/g, dp[1]).replace(/\{C\}/g, city); }
    var subj = f(it[0]), c = it.map(f);
    function st(s) { return s.replace("{u}", "u"); }
    function cc(s) { return cap(s.replace("{u}", subj)); }
    var rule = "Agar " + st(c[2]) + ", " + st(c[8]), pre = c[1] + rule + ". ", ask = "<br>Qaysi xulosa to'g'ri?";
    var v = pick(L === 1 ? ["MP", "MP", "MT"] : L === 2 ? ["MP", "MT", "MT", "AC", "EQ"] : ["MT", "AC", "DA", "EQ", "CONV"]);
    if (v === "MP") return Q(pre + c[10] + "." + ask, cc(c[8]), [cc(c[9]), NO_X, cc(c[7])], ["Shart bajarildi — demak, natija ham bo'ladi."]);
    if (v === "MT") return Q(pre + c[13] + "." + ask, cc(c[7]), [cc(c[6]), NO_X, cc(c[8])], ["Natija yo'q — demak, shart ham bajarilmagan (kontrapozitsiya)."]);
    if (v === "AC") return Q(pre + c[12] + "." + ask, NO_X, [cc(c[6]), cc(c[7]), cc(c[9])], ["Natija boshqa sabab bilan ham bo'lishi mumkin — shart bajarilgani noma'lum."]);
    if (v === "DA") return Q(pre + c[11] + "." + ask, NO_X, [cc(c[9]), cc(c[8]), cc(c[6])], ["Shart bajarilmasa, qoida hech narsa demaydi — natija bo'lishi ham, bo'lmasligi ham mumkin."]);
    if (v === "EQ") return Q(c[1] + "«" + rule + "» gapiga teng kuchli gap qaysi?", cap(c[5]) + ", " + st(c[7]), [cap(c[4]) + ", " + st(c[6]), cap(c[3]) + ", " + st(c[9]), cap(c[4]) + ", " + st(c[7])], ["Teng kuchli — kontrapozitsiya: «natija bo'lmasa, shart ham bajarilmagan». Teskari gap teng kuchli emas."]);
    return Q(c[1] + "«" + rule + "» — rost. Unga teskari gap «Agar " + st(c[4]) + ", " + st(c[6]) + "» haqida nima deyish mumkin?", "Rost bo'lishi shart emas", ["Albatta rost", "Albatta yolg'on", "Berilgan gapga teng kuchli"], ["Teskari gap (konvers) asl gapdan kelib chiqmaydi: natija boshqa sababdan ham bo'lishi mumkin."]);
  }
  // «Hamma / Ba'zi / Hech bir»: [ko'plik, birlik, qiladi, qilmaydi]
  var QUANT = [["o'quvchilar", "o'quvchi", "shaxmat o'ynaydi", "shaxmat o'ynamaydi"], ["talabalar", "talaba", "kutubxonaga boradi", "kutubxonaga bormaydi"], ["sportchilar", "sportchi", "ertalab yuguradi", "ertalab yugurmaydi"],
    ["shifokorlar", "shifokor", "ingliz tilini biladi", "ingliz tilini bilmaydi"], ["o'qituvchilar", "o'qituvchi", "velosiped haydaydi", "velosiped haydamaydi"], ["bolalar", "bola", "muzqaymoq yeydi", "muzqaymoq yemaydi"],
    ["haydovchilar", "haydovchi", "Toshkentda yashaydi", "Toshkentda yashamaydi"], ["turistlar", "turist", "tog'ga chiqadi", "tog'ga chiqmaydi"], ["dasturchilar", "dasturchi", "kofe ichadi", "kofe ichmaydi"],
    ["rassomlar", "rassom", "she'r yozadi", "she'r yozmaydi"], ["mehmonlar", "mehmon", "choy ichadi", "choy ichmaydi"], ["quruvchilar", "quruvchi", "futbol o'ynaydi", "futbol o'ynamaydi"]];
  function m4quant(L) {
    var it = pick(QUANT), A = "Hamma " + it[0] + " " + it[2], E = "Hech bir " + it[1] + " " + it[3], I = "Ba'zi " + it[0] + " " + it[2], O = "Ba'zi " + it[0] + " " + it[3],
      Kp = "Ko'pchilik " + it[0] + " " + it[2], Kn = "Ko'pchilik " + it[0] + " " + it[3], K1p = "Kamida bitta " + it[1] + " " + it[2], K1n = "Kamida bitta " + it[1] + " " + it[3], An = "Hamma " + it[0] + " " + it[3];
    var v = pick(L === 2 ? [1, 3, 6, 6] : [2, 4, 5, 6, 7, 8]), t = "<br>Qaysi gap albatta rost?";
    if (v === 1) return Q("«" + A + "» — rost." + t, I, [E, O, Kn], ["«Hamma» rost bo'lsa, «ba'zi» (kamida bittasi) ham rost."]);
    if (v === 2) return Q("«" + A + "» — yolg'on." + t, O, [E, I, Kp], ["«Hamma … » yolg'on — demak, kamida bittasi bunday emas."]);
    if (v === 3) return Q("«" + E + "» — rost." + t, O, [A, I, Kp], ["Hech kim bunday qilmasa, «ba'zilari qilmaydi» ham rost."]);
    if (v === 4) return Q("«" + I + "» — yolg'on." + t, E, [A, K1p, Kp], ["«Ba'zilari (kamida bittasi) …» yolg'on — demak, hech kim bunday emas."]);
    if (v === 5) return Q("«" + O + "» — yolg'on." + t, A, [E, K1n, Kn], ["«Ba'zilari … emas» yolg'on — demak, istisnosiz hammasi shunday."]);
    if (v === 6) return Q("«" + A + "» gapining inkori qaysi?", K1n, [E, I, Kn], ["«Hamma» ning inkori — «kamida bittasi … emas»."]);
    if (v === 7) return Q("«" + I + "» gapining inkori qaysi?", E, [A, O, "Faqat bitta " + it[1] + " " + it[2]], ["«Ba'zi» (kamida bittasi) ning inkori — «hech biri»."]);
    return Q("«" + E + "» gapining inkori qaysi?", K1p, [A, O, An], ["«Hech bir» ning inkori — «kamida bittasi»."]);
  }
  var NEST = [["kvadratlar", "romblar", "parallelogrammlar", "kvadrat", "romb", "parallelogramm"], ["atirgullar", "gullar", "o'simliklar", "atirgul", "gul", "o'simlik"],
    ["burgutlar", "qushlar", "hayvonlar", "burgut", "qush", "hayvon"], ["natural sonlar", "butun sonlar", "ratsional sonlar", "natural son", "butun son", "ratsional son"],
    ["toshkentliklar", "o'zbekistonliklar", "osiyoliklar", "toshkentlik", "o'zbekistonlik", "osiyolik"], ["delfinlar", "sutemizuvchilar", "umurtqalilar", "delfin", "sutemizuvchi", "umurtqali"],
    ["chumolilar", "hasharotlar", "bo'g'imoyoqlilar", "chumoli", "hasharot", "bo'g'imoyoqli"], ["sherlar", "mushuksimonlar", "sutemizuvchilar", "sher", "mushuksimon", "sutemizuvchi"],
    ["olmalar", "mevalar", "o'simlik mahsulotlari", "olma", "meva", "o'simlik mahsuloti"], ["skripkalar", "torli cholg'ular", "musiqa asboblari", "skripka", "torli cholg'u", "musiqa asbobi"]];
  function m4nest(L) {
    var n = pick(NEST), pre = "Barcha " + n[0] + " — " + n[1] + ". Barcha " + n[1] + " — " + n[2] + ". ";
    if (L === 1 || (L === 2 && Math.random() < 0.5)) return Q(pre + "Qaysi xulosa to'g'ri?", "Barcha " + n[0] + " — " + n[2], ["Barcha " + n[2] + " — " + n[0], "Barcha " + n[1] + " — " + n[0], "Ba'zi " + n[0] + " — " + n[2] + " emas"], ["Zanjir: " + n[0] + " → " + n[1] + " → " + n[2] + ". Demak, barcha " + n[0] + " — " + n[2] + "."]);
    return Q(pre + "X — " + n[5] + " emas. Xulosa?", "X — " + n[3] + " emas", ["X — " + n[3], "X — " + n[4], NO_X], ["X " + n[2] + " qatoriga kirmaydi, " + n[0] + " esa to'liq " + n[2] + " ichida — demak, X " + n[3] + " ham emas."]);
  }
  function m4(L) {
    var K = L === 1 ? [m4sch, m4sch, m4syl, m4cond, m4nest] : L === 2 ? [m4sch, m4syl, m4cond, m4cond, m4quant, m4nest] : [m4sch, m4syl, m4cond, m4cond, m4quant, m4quant, m4nest];
    for (var g = 0; g < 30; g++) {
      var p = Math.random() < 0.07 ? bank("m4", LOGIC_BANK, L) : pick(K)(L);
      if (p.a.length <= 45 && p.w.every(function (x) { return x.length <= 45; }) && p.q.replace(/<[^>]+>/g, "").length <= 170) return p;
    }
    return bank("m4", LOGIC_BANK, L);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function neg(p) { // "tuxum qo'yadi" -> "tuxum qo'ymaydi"
    var w = p.split(" "), last = w.pop(), n = last;
    if (/adi$/.test(last)) n = last.replace(/adi$/, "maydi"); else if (/ydi$/.test(last)) n = last.replace(/ydi$/, "ymaydi"); else if (/ega$/.test(last)) n = last + " emas"; else n = last + " emas";
    if (/ga ega$/.test(p)) return p.replace(/ga ega$/, "ga ega emas");
    if (/ega$/.test(last)) return w.concat([last, "emas"]).join(" ");
    return w.concat([n]).join(" ");
  }

  // m5 — tartiblash, taqqoslash va navbat
  var NAMES = ["Ali", "Vali", "Sami", "Hasan", "Dilnoza", "Bobur", "Zafar", "Laylo", "Madina", "Jasur", "Nodira", "Sardor"];
  var REL5 = [["baland", "past", "Eng baland kim?", "Eng past kim?", "eng balanddan"], ["katta", "kichik", "Yoshi eng katta kim?", "Yoshi eng kichik kim?", "eng kattadan"], ["og'ir", "yengil", "Eng og'ir kim?", "Eng yengil kim?", "eng og'iridan"],
    ["tez yuguradi", "sekin yuguradi", "Kim eng tez yuguradi?", "Kim eng sekin yuguradi?", "eng tezidan"], ["ko'p ball oldi", "kam ball oldi", "Kim eng ko'p ball oldi?", "Kim eng kam ball oldi?", "eng ko'p ball olgandan"],
    ["oldin keldi", "keyin keldi", "Kim birinchi keldi?", "Kim oxirgi keldi?", "birinchi kelgandan"], ["ko'p kitob o'qidi", "kam kitob o'qidi", "Kim eng ko'p kitob o'qidi?", "Kim eng kam kitob o'qidi?", "eng ko'p o'qigandan"]];
  var NOD = "Aniqlab bo'lmaydi";
  function m5ord(L) {
    var n = L === 1 ? 3 : L === 2 ? 4 : 5, PS = PERM[n], tries, i, j;
    for (tries = 0; tries < 60; tries++) {
      var nm = shuffle(NAMES).slice(0, n), r = pick(REL5), cl = [], pairs = [];
      // yashirin tartib: nm[0] eng yuqori … nm[n-1] eng quyi; [u, v] — u v dan yuqori
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) pairs.push([i, j]);
      if (L === 1) { for (i = 0; i < n - 1; i++) cl.push([i, i + 1]); }
      else cl = shuffle(pairs).slice(0, R(n - 1, n + (L === 3 ? 1 : 0)));
      var ask = L === 3 ? pick(["top", "bot", "mid"]) : pick(["top", "bot"]), t = ask === "top" ? 0 : ask === "bot" ? n - 1 : 2, can = {}, full = 0;
      PS.forEach(function (o) {
        var pos = []; o.forEach(function (who, k) { pos[who] = k; });
        for (var c = 0; c < cl.length; c++) if (pos[cl[c][0]] > pos[cl[c][1]]) return;
        can[o[t]] = 1; full++;
      });
      var cands = Object.keys(can).map(Number), a, ex;
      if (cands.length !== 1 && Math.random() > (L === 2 ? 0.12 : 0.2)) continue;
      var st = shuffle(cl).map(function (c) { return L === 1 || Math.random() < 0.5 ? nm[c[0]] + " " + nm[c[1]] + "dan " + r[0] + "." : nm[c[1]] + " " + nm[c[0]] + "dan " + r[1] + "."; });
      var qq = st.join(" ") + "<br><b>" + (ask === "top" ? r[2] : ask === "bot" ? r[3] : "Tartibda o'rtada (3-o'rinda) kim turadi?") + "</b>";
      if (qq.replace(/<[^>]+>/g, "").length > 170) continue;
      if (cands.length === 1) {
        a = nm[cands[0]];
        ex = full === 1 ? "Tartib (" + r[4] + " boshlab): " + nm.join(" → ") + "." : "Shartlardan faqat " + a + " bu o'rinda bo'la oladi (qolganlarning tartibi to'liq aniq emas).";
        return Q(qq, a, nm.filter(function (x) { return x !== a; }).concat([NOD]), [ex]);
      }
      return Q(qq, NOD, nm.slice(0, 4), ["Shartlarga " + joinUz(cands.map(function (k) { return nm[k]; })) + " — har biri mos keladi. Demak, aniqlab bo'lmaydi."]);
    }
    return m5q(L);
  }
  var QCTX = [["Navbatda", "oldindan", "orqadan", "kishi", "oldida", "ortida"], ["Safda", "chapdan", "o'ngdan", "o'quvchi", "chap tomonida", "o'ng tomonida"], ["Javondagi qatorda", "chapdan", "o'ngdan", "kitob", "chap tomonida", "o'ng tomonida"]];
  function m5q(L) {
    var c = pick(QCTX), bk = c[3] === "kitob", nn = shuffle(NAMES), A = bk ? "qizil kitob" : nn[0], B = bk ? "ko'k kitob" : nn[1], a, x, y, T, pm;
    var v = pick(L === 1 ? ["tot", "back"] : L === 2 ? ["tot", "back", "betw", "race"] : ["betw", "betw2", "tot", "race"]);
    if (v === "tot") { x = R(2, 15); y = R(2, 15); a = x + y - 1; return QN(c[0] + " " + A + " " + c[1] + " " + x + "-, " + c[2] + " " + y + "-o'rinda turibdi. Jami nechta " + c[3] + " bor?", a, [x + y, x + y - 2, x + y + 1], [cap(A) + " " + c[4] + " " + (x - 1) + " ta, " + c[5] + " " + (y - 1) + " ta: " + (x - 1) + " + " + (y - 1) + " + 1 = " + a + "."]); }
    if (v === "back") { T = R(8, 30); x = R(2, T - 1); a = T - x + 1; return QN(c[0] + " jami " + T + (c[3] === "kishi" ? " " : " ta ") + c[3] + ". " + cap(A) + " " + c[1] + " " + x + "-o'rinda. " + c[2].charAt(0).toUpperCase() + c[2].slice(1) + " nechanchi o'rinda?", a, [T - x, T - x + 2, x], [cap(A) + " " + c[5] + " " + T + " − " + x + " = " + (T - x) + " ta " + c[3] + " bor, demak u " + c[2] + " " + a + "-o'rinda."]); }
    if (v === "betw") { x = R(2, 10); y = x + R(2, 12); a = y - x - 1; return QN(c[0] + " " + A + " " + c[1] + " " + x + "-, " + B + " esa " + y + "-o'rinda. Ular orasida nechta " + c[3] + " bor?", a, [y - x, y - x + 1, y - x - 2], [y + " − " + x + " − 1 = " + a + " (ikkalasining o'zi sanalmaydi)."]); }
    if (v === "betw2") {
      do { T = R(15, 40); x = R(2, 9); y = R(2, 9); pm = T - y + 1; } while (pm <= x + 1);
      a = pm - x - 1;
      return QN(c[0] + " jami " + T + (c[3] === "kishi" ? " " : " ta ") + c[3] + ". " + cap(A) + " " + c[1] + " " + x + "-, " + B + " " + c[2] + " " + y + "-o'rinda. Ular orasida nechta " + c[3] + " bor?", a, [a + 1, a - 1, a + 2, T - x - y + 2], [cap(B) + " " + c[1] + " " + pm + "-o'rinda (" + T + " − " + y + " + 1).", "Orasida: " + pm + " − " + x + " − 1 = " + a + "."]);
    }
    x = R(2, 9);
    return Q("Yugurish musobaqasida siz " + x + "-o'rindagi yuguruvchini quvib o'tdingiz. Endi nechanchi o'rindasiz?", x + "-o'rinda", [(x - 1) + "-o'rinda", (x + 1) + "-o'rinda", "1-o'rinda", (x + 2) + "-o'rinda"], ["Siz uning o'rnini egalladingiz: endi siz " + x + "-o'rinda, u esa " + (x + 1) + "-o'rinda."]);
  }
  function m5(L) { return Math.random() < (L === 1 ? 0.6 : 0.55) ? m5ord(L) : m5q(L); }

  // m6 — mantiqiy masalalar (arifmetikasi kodda tekshiriladi)
  function m6(L) {
    var v = pick(L === 1 ? ["legs", "stairs", "cut", "age", "trees", "strike", "venn", "sumage", "consec", "cats", "pig"]
      : L === 2 ? ["legs2", "hand", "tourn", "age", "cut2", "pages", "snail", "lily", "venn", "coin", "bottle", "brick", "trees", "strike", "pig", "cats"]
        : ["legs2", "tourn", "age3", "ageback", "pages", "socks", "pig", "snail", "lily", "coin", "venn", "train", "catch", "brick", "consec"]);
    var a, i, x, y, z, k, n, s, d, t;
    if (v === "legs") { x = R(2, 9); y = R(2, 9); a = x * 2 + y * 4; return QN("Hovlida " + x + " ta tovuq va " + y + " ta quyon bor. Ularning hammasida jami nechta oyoq bor?", a, [(x + y) * 4, (x + y) * 2, x * 4 + y * 2], [x + " · 2 + " + y + " · 4 = " + a + "."]); }
    if (v === "legs2") { var hh = R(8, 20); y = R(2, hh - 2); var lg = (hh - y) * 2 + y * 4; return QN("Hovlida tovuqlar va quyonlar bor: jami " + hh + " ta bosh va " + lg + " ta oyoq. Nechta quyon bor?", y, [hh - y, y + 1, y - 1, y + 2], ["Hammasi tovuq bo'lsa: " + hh + " · 2 = " + (hh * 2) + " oyoq. Ortiqcha " + (lg - hh * 2) + " oyoq — har quyonda +2: " + (lg - hh * 2) + " : 2 = " + y + "."]); }
    if (v === "stairs") { var f = R(3, 9), fl = R(2, f - 1), sp = pick([12, 14, 16, 18, 20]); a = (f - 1) * sp; return QN("Uyda 1-qavatdan " + fl + "-qavatga chiqish uchun " + (fl - 1) * sp + " ta zinapoya bosiladi. " + f + "-qavatga chiqish uchun nechta zinapoya bosiladi?", a, [f * sp, (f - 2) * sp, (f + 1) * sp, Math.round(sp * (fl - 1) * f / fl)], ["Har qavat oralig'i: " + (fl - 1) * sp + " : " + (fl - 1) + " = " + sp + " zinapoya. " + f + "-qavatgacha " + (f - 1) + " oraliq: " + (f - 1) + " · " + sp + " = " + a + "."]); }
    if (v === "cut" || v === "cut2") { var pc = v === "cut" ? R(3, 9) : R(6, 15), m = R(2, 6); a = (pc - 1) * m; return QN("Yog'ochni bir marta arralash " + m + " daqiqa davom etadi. Uni " + pc + " bo'lakka ajratish uchun necha daqiqa kerak?", a, [pc * m, (pc + 1) * m, (pc - 2) * m], [pc + " bo'lak uchun " + (pc - 1) + " ta kesish kerak: " + (pc - 1) + " · " + m + " = " + a + " daqiqa."]); }
    if (v === "age") { s = R(5, 14); k = R(3, 5); var sm = s * (k + 1); return QN("Ota o'g'lidan " + k + " marta katta. Ularning yoshlari yig'indisi " + sm + ". O'g'il necha yoshda?", s, [Math.round(sm / k), s * k, s + 2], ["O'g'il x yosh, ota " + k + "x: x + " + k + "x = " + sm + " → x = " + s + "."]); }
    if (v === "age3") { s = R(5, 12); var dad = s + R(22, 32); a = dad - 2 * s; return QN("Ota " + dad + " yoshda, o'g'li " + s + " yoshda. Necha yildan keyin ota o'g'lidan 2 marta katta bo'ladi?", a, [a + 2, dad - s, a - 1], [dad + " + x = 2 · (" + s + " + x) → x = " + dad + " − 2 · " + s + " = " + a + "."]); }
    if (v === "ageback") {
      k = R(3, 6); var s0 = R(Math.ceil(24 / k), 9); x = R(2, 12); s = s0 + x; var F = k * s0 + x;
      return QN("Hozir ota " + F + " yoshda, o'g'li " + s + " yoshda. Necha yil oldin ota o'g'lidan " + k + " marta katta bo'lgan?", x, [x + 1, x - 1, x + 2, Math.round(F / s)], [F + " − x = " + k + " · (" + s + " − x) → " + (k - 1) + "x = " + k + " · " + s + " − " + F + " = " + (k * s - F) + " → x = " + x + "."]);
    }
    if (v === "sumage") { n = R(2, 5); s = R(10, 60); y = R(2, 9); a = s + n * y; return QN("Hozir " + n + " nafar aka-ukaning yoshlari yig'indisi " + s + ". " + y + " yildan keyin ularning yoshlari yig'indisi necha bo'ladi?", a, [s + y, s + (n - 1) * y, a + y], ["Har biri " + y + " yoshga kattalashadi: " + s + " + " + n + " · " + y + " = " + a + "."]); }
    if (v === "hand") { n = R(4, 12); a = n * (n - 1) / 2; return QN("Uchrashuvda " + n + " kishi har biri qolganlar bilan bir martadan qo'l berib ko'rishdi. Jami necha marta qo'l berib ko'rishildi?", a, [n * (n - 1), n * n, n * (n + 1) / 2], ["Har kishi " + (n - 1) + " kishi bilan ko'rishadi, har juftlik ikki marta sanalmasligi uchun: " + n + " · " + (n - 1) + " : 2 = " + a + "."]); }
    if (v === "tourn") {
      t = R(0, 2);
      if (t === 0) { n = R(4, 16); a = n * (n - 1) / 2; return QN("Futbol turnirida " + n + " ta jamoa qatnashdi: har bir jamoa qolganlari bilan bir martadan o'ynadi. Jami nechta o'yin bo'ldi?", a, [n * (n - 1), n * n / 2, a + n], [n + " · " + (n - 1) + " : 2 = " + a + " (har o'yinda 2 jamoa)."]); }
      if (t === 1) { n = R(4, 12); a = n * (n - 1); return QN("Sinfdagi " + n + " o'quvchining har biri qolgan har bir sinfdoshiga bittadan otkritka yubordi. Jami nechta otkritka yuborildi?", a, [a / 2, n * n, a - n], ["Har biri " + (n - 1) + " ta yuboradi: " + n + " · " + (n - 1) + " = " + a + "."]); }
      n = pick([8, 12, 16, 20, 24, 32, 40, 64]); a = n - 1;
      return QN("Turnir olimpiya tizimida: har o'yinda yutqazgan jamoa chiqib ketadi (durang yo'q). " + n + " ta jamoa qatnashsa, g'olib aniqlanguncha nechta o'yin o'tkaziladi?", a, [n, n / 2, n - 2, n * (n - 1) / 2], ["G'olibdan boshqa har bir jamoa aynan bir marta yutqazadi: " + n + " − 1 = " + a + " ta o'yin."]);
    }
    if (v === "pages") { var pg = R(L === 3 ? 100 : 20, L === 3 ? 400 : 99), dig = pg <= 9 ? pg : pg <= 99 ? 9 + (pg - 9) * 2 : 189 + (pg - 99) * 3; return QN("Kitob sahifalari 1 dan " + pg + " gacha raqamlangan. Raqamlashda jami nechta raqam yozilgan?", dig, [pg * 2, pg * 3, dig - 9], ["1–9: 9 ta" + (pg > 9 ? ", 10–" + Math.min(pg, 99) + ": " + (Math.min(pg, 99) - 9) + " · 2 = " + (Math.min(pg, 99) - 9) * 2 : "") + (pg > 99 ? ", 100–" + pg + ": " + (pg - 99) + " · 3 = " + (pg - 99) * 3 : "") + ". Jami " + dig + "."]); }
    if (v === "socks") { k = R(2, 6); a = k + 1; return QN("Qorong'i xonadagi qutida " + k + " xil rangdagi ko'p paypoq bor. Bir xil rangli juftlik albatta chiqishi uchun kamida nechta paypoq olish kerak?", a, [k, k * 2, k + 2, 2], ["Har rangdan bittadan " + k + " ta chiqishi mumkin; keyingisi (" + a + "-chi) albatta biror rang bilan juft bo'ladi (Dirixle prinsipi)."]); }
    if (v === "pig") {
      t = L === 3 ? R(1, 2) : R(0, 1);
      if (t === 2) { k = R(2, 6); a = 2 * k + 1; return QN("Qutida " + k + " xil rangli ko'p qalam bor. Qaramasdan olinganda bir xil rangli 3 ta qalam albatta chiqishi uchun kamida nechta qalam olish kerak?", a, [3 * k, 2 * k, k + 3, 3 * k + 1], ["Har rangdan 2 tadan " + 2 * k + " ta olinsa ham, 3 ta bir xil chiqmasligi mumkin; yana bittasi — " + a + " ta."]); }
      x = R(2, 12); do { y = R(2, 12); } while (y === x);
      if (t === 0) { a = y + 1; return QN("Qopda " + x + " ta qizil va " + y + " ta ko'k shar bor. Qaramasdan kamida nechta shar olinsa, ular orasida albatta qizil shar bo'ladi?", a, [x + 1, y, 2, x + y], ["Eng yomon holda avval hamma " + y + " ta ko'k shar chiqadi; keyingisi albatta qizil: " + y + " + 1 = " + a + "."]); }
      a = Math.max(x, y) + 1; return QN("Qopda " + x + " ta qizil va " + y + " ta ko'k shar bor. Qaramasdan kamida nechta shar olinsa, albatta ikkala rangdagi shar ham chiqadi?", a, [Math.min(x, y) + 1, 3, x + y, Math.max(x, y)], ["Eng yomon holda avval ko'p rangdagi " + Math.max(x, y) + " ta shar chiqadi; keyingisi boshqa rangda: " + a + "."]);
    }
    if (v === "trees") {
      t = L === 1 ? R(0, 1) : R(0, 3); d = pick([2, 3, 4, 5, 6, 8, 10]); n = R(4, 25); var len = d * n;
      if (t === 0) { a = n + 1; return QN("Uzunligi " + len + " m bo'lgan yo'lning bir chetiga har " + d + " m da daraxt ekildi (yo'lning boshida va oxirida ham). Nechta daraxt ekildi?", a, [n, n - 1, 2 * n], [len + " : " + d + " = " + n + " ta oraliq, daraxtlar oraliqdan bitta ko'p: " + a + "."]); }
      if (t === 1) { a = n; return QN("Aylanasi " + len + " m bo'lgan hovuz atrofiga har " + d + " m da daraxt ekildi. Nechta daraxt ekildi?", a, [n + 1, n - 1, 2 * n], ["Aylanada boshi va oxiri ustma-ust tushadi: " + len + " : " + d + " = " + a + " ta daraxt."]); }
      if (t === 2) { a = 2 * (n + 1); return QN("Uzunligi " + len + " m bo'lgan ko'chaning ikkala chetiga har " + d + " m da daraxt ekildi (boshida va oxirida ham). Nechta daraxt ekildi?", a, [2 * n, n + 1, 2 * n + 1], ["Bir chetida " + len + " : " + d + " + 1 = " + (n + 1) + " ta, ikkala chetida " + a + " ta."]); }
      a = n - 1; return QN("Ikki ustun orasidagi masofa " + len + " m. Ular orasiga har " + d + " m da daraxt ekildi (ustunlar yoniga ekilmadi). Nechta daraxt ekildi?", a, [n, n + 1, n - 2], [len + " : " + d + " = " + n + " oraliq; ikki chetdagi ustun o'rniga daraxt yo'q: " + n + " − 1 = " + a + "."]);
    }
    if (v === "strike") { var iv = R(1, 4), k1 = R(3, 6), k2 = R(k1 + 2, 12), t1 = iv * (k1 - 1); a = iv * (k2 - 1); return QN("Soat " + k1 + " da " + k1 + " marta zang chaladi, bunga " + t1 + " soniya ketadi (zanglar orasidagi vaqt bir xil). Soat " + k2 + " da " + k2 + " marta zang chalishga necha soniya ketadi?", a, [Math.round(t1 * k2 / k1), iv * k2, a + iv], [k1 + " zang orasida " + (k1 - 1) + " ta oraliq: " + t1 + " : " + (k1 - 1) + " = " + iv + " s.", k2 + " zangda " + (k2 - 1) + " oraliq: " + (k2 - 1) + " · " + iv + " = " + a + " s."]); }
    if (v === "venn") {
      var VP = pick([["futbolni", "shaxmatni", "yaxshi ko'radi", "yoqtirmaydi"], ["matematikani", "fizikani", "yaxshi ko'radi", "yoqtirmaydi"], ["ingliz tilini", "rus tilini", "biladi", "bilmaydi"], ["rasm chizishni", "qo'shiq aytishni", "yaxshi ko'radi", "yoqtirmaydi"]]);
      var both = R(1, 6), xa = both + R(2, 10), xb = both + R(2, 10), none = R(1, 8), N = xa + xb - both + none, pre = "Sinfda " + N + " o'quvchi. " + xa + " tasi " + VP[0] + ", " + xb + " tasi " + VP[1] + " " + VP[2] + ", " + both + " tasi ikkalasini ham. ";
      t = L === 1 ? 0 : L === 2 ? R(0, 1) : R(0, 2);
      if (t === 0) return QN(pre + "Nechtasi ikkalasini ham " + VP[3] + "?", none, [N - xa - xb, none + both, N - xa - xb + 2 * both, xa + xb - both], ["Kamida bittasini " + VP[2] + ": " + xa + " + " + xb + " − " + both + " = " + (xa + xb - both) + " (ikkalasi ikki marta sanalmasin).", N + " − " + (xa + xb - both) + " = " + none + "."]);
      if (t === 1) return QN(pre + "Nechtasi faqat " + VP[0] + " " + VP[2] + "?", xa - both, [xa, xb - both, xa - both + 1, xa + both], ["Faqat birinchisi: " + xa + " − " + both + " = " + (xa - both) + "."]);
      return QN(pre + "Nechtasi kamida bittasini " + VP[2] + "?", xa + xb - both, [xa + xb, xa + xb - 2 * both, N - both], [xa + " + " + xb + " − " + both + " = " + (xa + xb - both) + " (ikkalasini ham tanlaganlar ikki marta sanalmasin)."]);
    }
    if (v === "consec") {
      if (L === 1) { x = R(5, 60); return QN("Uchta ketma-ket natural sonning yig'indisi " + 3 * x + ". Ularning eng kattasi nechaga teng?", x + 1, [x, x + 2, x - 1], ["O'rtadagi son: " + 3 * x + " : 3 = " + x + ". Eng kattasi " + (x + 1) + "."]); }
      x = 2 * R(2, 40); s = 4 * x + 12; return QN("To'rtta ketma-ket juft sonning yig'indisi " + s + ". Ularning eng kichigi nechaga teng?", x, [x + 2, x - 2, s / 4, x + 4], ["x + (x + 2) + (x + 4) + (x + 6) = 4x + 12 = " + s + " → x = " + x + "."]);
    }
    if (v === "cats") { k = R(2, 9); do { n = R(10, 100); } while (n === k); return QN(k + " ta mushuk " + k + " ta sichqonni " + k + " daqiqada tutadi. " + n + " ta mushuk " + n + " ta sichqonni necha daqiqada tutadi?", k, [n, k * n, n - k, k + 1], ["Har bir mushuk bitta sichqonni " + k + " daqiqada tutadi. " + n + " ta mushuk bir vaqtda " + n + " ta sichqonni ham " + k + " daqiqada tutadi."]); }
    if (v === "snail") {
      var Hh = L === 3 ? R(12, 40) : R(6, 20), up = R(2, L === 3 ? 7 : 5), dn = R(1, up - 1), pos = 0; if (Hh <= up) Hh = up + R(2, 8);
      for (a = 1; ; a++) { pos += up; if (pos >= Hh) break; pos -= dn; }
      return QN("Quduq chuqurligi " + Hh + " m. Shilliqqurt kunduzi " + up + " m ko'tariladi, kechasi " + dn + " m sirpanib tushadi. U nechanchi kuni quduqdan chiqadi?", a, [Math.ceil(Hh / (up - dn)), a + 1, a - 1], ["Har sutkada " + (up - dn) + " m. " + (a - 1) + " sutkada " + (a - 1) * (up - dn) + " m ko'tariladi.", a + "-kuni kunduzi yana " + up + " m: " + ((a - 1) * (up - dn) + up) + " ≥ " + Hh + " — chiqadi."]);
    }
    if (v === "lily") {
      n = R(10, 40); var tri = L === 3 && Math.random() < 0.4, j = L === 2 ? 1 : R(1, 3), part = tri ? ["", "uchdan bir qismi", "to'qqizdan bir qismi", "yigirma yettidan bir qismi"][j] : ["", "yarmi", "choragi", "sakkizdan bir qismi"][j];
      a = n - j;
      return QN("Ko'ldagi nilufar barglari egallagan maydon har kuni " + (tri ? 3 : 2) + " marta ortadi. Ko'l " + n + " kunda to'liq qoplanadi. Ko'lning " + part + " necha kunda qoplangan?", a, [Math.round(n / Math.pow(tri ? 3 : 2, j)), a - 1, a + 1, n - j - 2], ["Har kuni " + (tri ? 3 : 2) + " marta ortgani uchun, to'liq qoplanishdan " + j + " kun oldin ko'lning " + part + " qoplangan bo'ladi: " + n + " − " + j + " = " + a + "."]);
    }
    if (v === "coin") {
      n = L === 2 ? R(4, 27) : R(10, 243); k = 0; var p3 = 1; while (p3 < n) { p3 *= 3; k++; }
      var k2 = 0, p2 = 1; while (p2 < n) { p2 *= 2; k2++; }
      return QN(n + " ta bir xil tangadan bittasi soxta — u yengilroq. Toshsiz pallali tarozida kamida necha marta tortib, soxtasini albatta topish mumkin?", k, [k2, k + 1, k - 1], ["Har tortishda tangalarni 3 guruhga bo'lamiz — gumonlilar 3 marta kamayadi.", Math.pow(3, k - 1) + " < " + n + " ≤ " + p3 + " = 3" + "⁰¹²³⁴⁵⁶".charAt(k) + " → " + k + " marta."]);
    }
    if (v === "bottle") {
      var cp = R(1, 9) * 50, df = R(2, 9) * 1000, tot = 2 * cp + df;
      if (Math.random() < 0.5) return QN("Kitob va daftar birga " + tot + " so'm turadi. Kitob daftardan " + df + " so'm qimmat. Daftar necha so'm turadi?", cp, [tot - df, cp + df, cp * 3, cp + 50], ["Daftar x bo'lsa, kitob x + " + df + ": 2x + " + df + " = " + tot + " → x = " + cp + "."]);
      return QN("Kitob va daftar birga " + tot + " so'm turadi. Kitob daftardan " + df + " so'm qimmat. Kitob necha so'm turadi?", cp + df, [df, tot - cp, tot - df, df + 2 * cp + 50], ["Daftar x bo'lsa, kitob x + " + df + ": 2x + " + df + " = " + tot + " → x = " + cp + ". Kitob: " + (cp + df) + "."]);
    }
    if (v === "brick") {
      if (L === 2 || Math.random() < 0.5) { x = R(1, 9); return QN("Bitta g'isht og'irligi " + x + " kg va yana yarim g'isht og'irligiga teng. Bitta g'isht necha kg?", 2 * x, [x, 3 * x, 2 * x + 1, x + 1], ["G'isht = " + x + " + g'isht : 2 → yarim g'isht = " + x + " kg → g'isht = " + 2 * x + " kg."]); }
      x = 2 * R(1, 6); return QN("Bitta g'isht og'irligi " + x + " kg va yana uchdan bir g'isht og'irligiga teng. Bitta g'isht necha kg?", 3 * x / 2, [x, 2 * x, x + 1, 3 * x], ["G'ishtning 2/3 qismi " + x + " kg → 1/3 qismi " + x / 2 + " kg → g'isht " + 3 * x / 2 + " kg."]);
    }
    if (v === "catch") {
      d = R(2, 6); t = R(2, 5); x = R(10, 20); y = x - d; z = d * t;
      return QN("Piyoda soatiga " + y + " km, velosipedchi soatiga " + x + " km yuradi. Piyoda " + z + " km oldinda. Ular bir yo'nalishda yursa, velosipedchi uni necha soatda quvib yetadi?", t, [Math.round(z / x), t + 1, t - 1, Math.round(z / y)], ["Yaqinlashish tezligi: " + x + " − " + y + " = " + d + " km/soat. " + z + " : " + d + " = " + t + " soat."]);
    }
    var v1 = R(4, 9) * 10, v2 = R(3, 8) * 10, tt = R(2, 5), dist = (v1 + v2) * tt; // train — uchrashish
    return QN("Ikki shahar orasidagi masofa " + dist + " km. Ulardan bir vaqtda bir-biriga qarab ikki avtomobil chiqdi: " + v1 + " km/soat va " + v2 + " km/soat tezlik bilan. Necha soatdan keyin uchrashadi?", tt, [tt + 1, Math.max(1, tt - 1), Math.round(dist / v1)], ["Yaqinlashish tezligi " + v1 + " + " + v2 + " = " + (v1 + v2) + " km/soat. " + dist + " : " + (v1 + v2) + " = " + tt + " soat."]);
  }

  // m7 — rostgo'y va yolg'onchi (2^n holat saralanadi, faqat yagona yechimli jumboqlar)
  var KK_NAMES = ["Ali", "Vali", "Sami", "Bek", "Lola", "Nilu", "Olim", "Dina", "Aziz", "Anvar", "Zuhra", "Jasur"];
  function cntT(T) { var c = 0; for (var i = 0; i < T.length; i++) if (T[i]) c++; return c; }
  function kind(t) { return t ? "rostgo'y" : "yolg'onchi"; }
  var KK_ST = [ // lv — qaysi darajadan, ar — gap nechta boshqa odam haqida, f — gap rostmi, t — matni, h — maslahat
    { lv: 1, ar: 1, f: function (T, s, x) { return T[x]; }, t: function (N, s, x) { return N[x] + " — rostgo'y"; } },
    { lv: 1, ar: 1, f: function (T, s, x) { return !T[x]; }, t: function (N, s, x) { return N[x] + " — yolg'onchi"; } },
    { lv: 1, ar: 1, f: function (T, s, x) { return T[s] === T[x]; }, t: function (N, s, x) { return "Men va " + N[x] + " bir toifadanmiz"; }, h: function (N, s, x) { return "«Bir toifadanmiz» gapini kim aytsa ham, " + N[x] + " rostgo'y chiqadi."; } },
    { lv: 1, ar: 1, f: function (T, s, x) { return T[s] !== T[x]; }, t: function (N, s, x) { return "Men va " + N[x] + " har xil toifadanmiz"; }, h: function (N, s, x) { return "«Har xil toifadanmiz» gapini kim aytsa ham, " + N[x] + " yolg'onchi chiqadi."; } },
    { lv: 1, ar: 1, f: function (T, s, x) { return T[s] && T[x]; }, t: function (N, s, x) { return "Men ham, " + N[x] + " ham rostgo'ymiz"; } },
    { lv: 2, ar: 1, f: function (T, s, x) { return !T[s] || !T[x]; }, t: function (N, s, x) { return "Men va " + N[x] + " — kamida bittamiz yolg'onchi"; }, h: function (N, s) { return N[s] + " rostgo'y: yolg'onchi bu gapni aytsa, gap rost bo'lib qolardi."; } },
    { lv: 1, ar: 0, f: function (T) { return cntT(T) === 0; }, t: function (N) { return N.length === 2 ? "Ikkalamiz ham yolg'onchimiz" : "Hammamiz yolg'onchimiz"; }, h: function (N, s) { return N[s] + " yolg'onchi: rostgo'y o'zini yolg'onchi demaydi."; } },
    { lv: 2, ar: 0, f: function (T) { return cntT(T) === 1; }, t: function () { return "Oramizda aynan bitta rostgo'y bor"; } },
    { lv: 2, ar: 0, f: function (T) { return cntT(T) < T.length; }, t: function () { return "Oramizda kamida bitta yolg'onchi bor"; }, h: function (N, s) { return N[s] + " rostgo'y: yolg'onchi bu gapni aytsa, gap rost bo'lib qolardi."; } },
    { lv: 3, ar: 0, n: 3, f: function (T) { return cntT(T) === 2; }, t: function () { return "Oramizda aynan ikkita rostgo'y bor"; } },
    { lv: 2, ar: 2, f: function (T, s, x, y) { return T[x] && T[y]; }, t: function (N, s, x, y) { return N[x] + " ham, " + N[y] + " ham rostgo'y"; } },
    { lv: 3, ar: 2, f: function (T, s, x, y) { return T[x] || T[y]; }, t: function (N, s, x, y) { return N[x] + " va " + N[y] + " — kamida bittasi rostgo'y"; } },
    { lv: 3, ar: 2, f: function (T, s, x, y) { return T[x] === T[y]; }, t: function (N, s, x, y) { return N[x] + " va " + N[y] + " bir toifadan"; } },
    { lv: 3, ar: 2, f: function (T, s, x, y) { return !T[x] || !T[y]; }, t: function (N, s, x, y) { return N[x] + " va " + N[y] + " — kamida bittasi yolg'onchi"; } }
  ];
  function kkWho(N, T, want) {
    var o = []; for (var i = 0; i < N.length; i++) if (T[i] === want) o.push(N[i]);
    if (N.length === 2) return o.length === 2 ? "Ikkalasi ham" : o.length ? "Faqat " + o[0] : "Hech biri";
    return o.length === 3 ? "Hammasi" : o.length === 2 ? o[0] + " va " + o[1] : o.length ? "Faqat " + o[0] : "Hech kim";
  }
  function m7(L) {
    for (var g = 0; g < 400; g++) {
      var n = L === 1 ? 2 : L === 2 ? (Math.random() < 0.6 ? 2 : 3) : 3, i, m;
      var N = n === 3 ? ["A", "B", "C"] : shuffle(KK_NAMES).slice(0, 2);
      var pool = KK_ST.filter(function (t) { return t.lv <= L && t.ar <= n - 1 && (!t.n || t.n === n); });
      var sp = n === 2 ? (Math.random() < 0.25 ? [R(0, 1)] : [0, 1]) : shuffle([0, 1, 2]).slice(0, Math.random() < 0.4 ? 2 : 3).sort();
      var sts = sp.map(function (s) { var ot = shuffle([0, 1, 2].slice(0, n).filter(function (j) { return j !== s; })); return { s: s, tp: pick(pool), x: ot[0], y: ot[1] }; });
      var all = [], sols = [];
      for (m = 0; m < (1 << n); m++) {
        var T = [], ok = 0; for (i = 0; i < n; i++) T.push(!!(m & (1 << i)));
        sts.forEach(function (o) { if (T[o.s] === !!o.tp.f(T, o.s, o.x, o.y)) ok++; });
        all.push({ T: T, ok: ok }); if (ok === sts.length) sols.push(T);
      }
      if (sols.length !== 1) continue;
      if (L === 3 && !sts.some(function (o) { return o.tp.lv >= 2; })) continue;
      var sol = sols[0], mode = n === 2 ? pick(["who", "each"]) : pick(["who", "liar", "cnt"]), qs, a, w = [];
      var near = shuffle(all.filter(function (o) { return o.T !== sol; })).sort(function (p, q) { return q.ok - p.ok; });
      if (mode === "cnt") { qs = "Ular orasida nechta rostgo'y bor?"; a = String(cntT(sol)); w = ["0", "1", "2", "3"]; }
      else if (mode === "each") { qs = "Ular kim?"; var ea = function (T) { return N[0] + " — " + kind(T[0]) + ", " + N[1] + " — " + kind(T[1]); }; a = ea(sol); w = near.map(function (o) { return ea(o.T); }); }
      else { qs = mode === "who" ? "Kim rostgo'y?" : "Kim yolg'onchi?"; a = kkWho(N, sol, mode === "who"); w = near.map(function (o) { return kkWho(N, o.T, mode === "who"); }); }
      var body = sts.map(function (o) { return "<b>" + N[o.s] + ":</b> «" + o.tp.t(N, o.s, o.x, o.y) + "»."; }).join("<br>") + "<br><b>" + qs + "</b>";
      var RL = "Rostgo'y doim rost, yolg'onchi doim yolg'on gapiradi.", HD = sts.length === n ? [RL, joinUz(N) + " — har biri rostgo'y yoki yolg'onchi."] // jim turgan odam bo'lsa, ismlar albatta aytiladi
        : [RL + " " + joinUz(N) + " — har biri shulardan biri.", joinUz(N) + " — har biri rostgo'y (doim rost gapiradi) yoki yolg'onchi (doim yolg'on).", joinUz(N) + " — har biri rostgo'y yoki yolg'onchi."], hd = null;
      for (i = 0; i < HD.length && !hd; i++) if ((HD[i] + body).replace(/<[^>]+>/g, "").length <= 170) hd = HD[i] + "<br>";
      if (!hd) continue;
      var hint = null; sts.forEach(function (o) { if (!hint && o.tp.h) hint = o.tp.h(N, o.s, o.x, o.y); });
      return Q(hd + body, a, w, ["Yagona mos holat: " + N.map(function (x, j) { return x + " — " + kind(sol[j]); }).join(", ") + ".", hint || "Tekshiring: rostgo'yning gapi rost, yolg'onchiniki yolg'on; boshqa holatlarda qarama-qarshilik chiqadi."]);
    }
    return m4(L);
  }

  // m8 — kim qaysi kasbda? (mantiqiy jadval; barcha o'rinlashtirishlar saralanadi)
  var LG_NAMES = ["Ali", "Vali", "Sami", "Lola", "Bek", "Nilu", "Olim", "Dina", "Aziz", "Zuhra"];
  var LG_CAT = [
    { v: ["shifokor", "oshpaz", "haydovchi", "o'qituvchi", "muhandis", "rassom", "duradgor", "sartarosh"],
      h: function (nm, vl, sh) { return nm + " — " + vl + (sh ? " (har xil)." : " (har biri boshqa kasbda)."); }, pos: function (p, v) { return p + " — " + v + "."; }, neg: function (p, v) { return p + " " + v + " emas."; },
      neg2: function (p, v, u) { return p + " " + v + " ham, " + u + " ham emas."; }, qv: function (v) { return "Kim " + v + "?"; }, qp: function (p) { return p + "ning kasbi nima?"; } },
    { v: ["Toshkent", "Samarqand", "Buxoro", "Xiva", "Termiz", "Nukus", "Qarshi", "Andijon"],
      h: function (nm, vl, sh) { return nm + " — " + vl + "da yashaydi" + (sh ? " (har xil)." : " (har biri boshqa shaharda)."); }, pos: function (p, v) { return p + " " + v + "da yashaydi."; }, neg: function (p, v) { return p + " " + v + "da yashamaydi."; },
      neg2: function (p, v, u) { return p + " " + v + "da ham, " + u + "da ham yashamaydi."; }, qv: function (v) { return v + "da kim yashaydi?"; }, qp: function (p) { return p + " qaysi shaharda yashaydi?"; } },
    { v: ["qizil", "ko'k", "yashil", "sariq", "oq", "qora"],
      h: function (nm, vl) { return nm + "ning shapkalari — " + vl + " (har xil)."; }, pos: function (p, v) { return p + "ning shapkasi " + v + "."; }, neg: function (p, v) { return p + "ning shapkasi " + v + " emas."; },
      neg2: function (p, v, u) { return p + "ning shapkasi " + v + " ham, " + u + " ham emas."; }, qv: function (v) { return "Kimning shapkasi " + v + "?"; }, qp: function (p) { return p + "ning shapkasi qanday rangda?"; } },
    { v: ["futbol", "kurash", "tennis", "suzish", "boks", "shaxmat"],
      h: function (nm, vl, sh) { return nm + " — " + vl + " to'garaklariga qatnaydi" + (sh ? " (har xil)." : " (har biri bittasiga)."); }, pos: function (p, v) { return p + " " + v + "ga qatnaydi."; }, neg: function (p, v) { return p + " " + v + "ga qatnamaydi."; },
      neg2: function (p, v, u) { return p + " " + v + "ga ham, " + u + "ga ham qatnamaydi."; }, qv: function (v) { return "Kim " + v + "ga qatnaydi?"; }, qp: function (p) { return p + " qaysi to'garakka qatnaydi?"; } },
    { v: ["matematika", "fizika", "tarix", "biologiya", "kimyo", "adabiyot", "geografiya"],
      h: function (nm, vl) { return nm + "ning sevimli fanlari — " + vl + " (har xil)."; }, pos: function (p, v) { return p + " " + v + "ni sevadi."; }, neg: function (p, v) { return p + " " + v + "ni sevmaydi."; },
      neg2: function (p, v, u) { return p + " " + v + "ni ham, " + u + "ni ham sevmaydi."; }, qv: function (v) { return "Kimning sevimli fani " + v + "?"; }, qp: function (p) { return p + "ning sevimli fani qaysi?"; } },
    { v: ["mushuk", "it", "to'tiqush", "baliq", "quyon", "toshbaqa"],
      h: function (nm, vl, sh) { return nm + "ning uyida " + vl + " bor" + (sh ? " (har xil)." : " (har birida bittadan)."); }, pos: function (p, v) { return p + "da " + v + " bor."; }, neg: function (p, v) { return p + "da " + v + " yo'q."; },
      neg2: function (p, v, u) { return p + "da " + v + " ham, " + u + " ham yo'q."; }, qv: function (v) { return "Kimda " + v + " bor?"; }, qp: function (p) { return p + "da qaysi uy hayvoni bor?"; } }
  ];
  function dat(w) { return /k$/.test(w) ? w + "ka" : /q$/.test(w) ? w + "qa" : w + "ga"; }
  function lgFits(pm, cs) { for (var k = 0; k < cs.length; k++) { var c = cs[k]; if (c.t ? pm[c.p] !== c.v : pm[c.p] === c.v) return false; } return true; }
  function lgCount(PS, cs) { var c = 0; for (var i = 0; i < PS.length; i++) if (lgFits(PS[i], cs)) c++; return c; }
  // jadval usuli: yagona imkoniyat qolgan katakni belgilash (o'quvchi ham shunday yechadi)
  function lgSolve(n, cl) {
    var P = [], i, j, k, ch = true, steps = [], done = {};
    for (i = 0; i < n; i++) { P.push([]); for (j = 0; j < n; j++) P[i].push(true); }
    cl.forEach(function (c) {
      var a, b;
      if (!c.t) { P[c.p][c.v] = false; return; }
      for (b = 0; b < n; b++) if (b !== c.v) P[c.p][b] = false;
      for (a = 0; a < n; a++) if (a !== c.p) P[a][c.v] = false;
      done["r" + c.p] = done["c" + c.v] = 1;
    });
    while (ch) {
      ch = false;
      for (i = 0; i < n; i++) {
        var cnt = 0, lj = -1; for (j = 0; j < n; j++) if (P[i][j]) { cnt++; lj = j; }
        if (!cnt) return null;
        if (cnt === 1 && !done["r" + i]) { done["r" + i] = done["c" + lj] = 1; steps.push([i, lj, 0]); for (k = 0; k < n; k++) if (k !== i) P[k][lj] = false; ch = true; }
      }
      for (j = 0; j < n; j++) {
        var cn = 0, li = -1; for (i = 0; i < n; i++) if (P[i][j]) { cn++; li = i; }
        if (!cn) return null;
        if (cn === 1 && !done["c" + j]) { done["c" + j] = done["r" + li] = 1; steps.push([li, j, 1]); for (k = 0; k < n; k++) if (k !== j) P[li][k] = false; ch = true; }
      }
    }
    var sol = [];
    for (i = 0; i < n; i++) { var c3 = 0, l3 = -1; for (j = 0; j < n; j++) if (P[i][j]) { c3++; l3 = j; } if (c3 !== 1) return null; sol.push(l3); }
    return { sol: sol, steps: steps };
  }
  function lgMake(n, L) {
    var C = pick(LG_CAT), nm = shuffle(LG_NAMES).slice(0, n), vl = shuffle(C.v).slice(0, n), PS = PERM[n], sol = pick(PS), pool = [], cl = [], i, j, cur;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (j !== sol[i]) pool.push({ t: false, p: i, v: j });
    pool = shuffle(pool);
    if (Math.random() < (L === 1 ? 0.6 : 0.35)) { i = R(0, n - 1); pool.unshift({ t: true, p: i, v: sol[i] }); }
    cur = PS.length;
    for (i = 0; i < pool.length && cur > 1; i++) { var tr = cl.concat([pool[i]]), c2 = lgCount(PS, tr); if (c2 < cur) { cl = tr; cur = c2; } }
    if (cur !== 1) return null;
    shuffle(cl.slice()).forEach(function (c) { var t2 = cl.filter(function (x) { return x !== c; }); if (lgCount(PS, t2) === 1) cl = t2; });
    var sv = lgSolve(n, cl); if (!sv || sv.sol.join() !== sol.join()) return null;
    var byP = {}, txt = [], given = {};
    cl.forEach(function (c) { if (c.t) { txt.push(C.pos(nm[c.p], vl[c.v])); given[c.p] = 1; } else (byP[c.p] = byP[c.p] || []).push(c.v); });
    Object.keys(byP).forEach(function (p) { var a = shuffle(byP[p]); while (a.length >= 2) txt.push(C.neg2(nm[p], vl[a.shift()], vl[a.shift()])); if (a.length) txt.push(C.neg(nm[p], vl[a[0]])); });
    var cand = []; for (i = 0; i < n; i++) if (!given[i]) cand.push(i);
    var tp = pick(cand), byVal = Math.random() < 0.5, qs, a, w;
    if (byVal) { qs = C.qv(vl[sol[tp]]); a = nm[tp]; w = nm.filter(function (x) { return x !== a; }); }
    else { qs = C.qp(nm[tp]); a = vl[sol[tp]]; w = vl.filter(function (x) { return x !== a; }); }
    if (w.length < 3) w.push("Aniqlab bo'lmaydi");
    var q = C.h(joinUz(nm), joinUz(vl), n > 3) + "<br>" + shuffle(txt).join(" ") + "<br><b>" + qs + "</b>";
    if (q.replace(/<[^>]+>/g, "").length > 170) return null;
    var hs = sv.steps.slice(0, 2).map(function (s) { return s[2] ? "«" + vl[s[1]] + "» faqat " + dat(nm[s[0]]) + " to'g'ri keladi." : nm[s[0]] + " uchun faqat «" + vl[s[1]] + "» qoladi."; });
    return Q(q, a, w, [hs.join(" "), "Javob jadvali: " + nm.map(function (x, k) { return x + " — " + vl[sol[k]]; }).join(", ") + "."]);
  }
  function m8(L) {
    var n = L === 3 ? 4 : 3, g, p;
    for (g = 0; g < 80; g++) { p = lgMake(g < 50 ? n : 3, L); if (p) return p; }
    for (g = 0; g < 50; g++) { p = lgMake(3, 1); if (p) return p; }
    return m5(L);
  }

  // m9 — sehrli kvadrat va sonli jumboqlar (hammasi saralash bilan tekshiriladi)
  var LOSHU = [2, 7, 6, 9, 5, 1, 4, 3, 8];
  var SQL = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var SQL_N = ["1-qator", "2-qator", "3-qator", "1-ustun", "2-ustun", "3-ustun", "diagonal", "diagonal"];
  function symSq(g, t) {
    var out = [], i, k;
    for (i = 0; i < 9; i++) { var r = Math.floor(i / 3), c = i % 3, tmp; if (t & 4) c = 2 - c; for (k = 0; k < (t & 3); k++) { tmp = r; r = c; c = 2 - tmp; } out[r * 3 + c] = g[i]; }
    return out;
  }
  function gridTxt(rows) { return rows.map(function (r) { return r.join(" │ "); }).join("<br>"); }
  function m9magic(L) {
    var m = L === 1 ? 1 : R(1, L === 2 ? 3 : 5), b = R(0, L === 1 ? 10 : 20), g = symSq(LOSHU, R(0, 7)).map(function (v) { return v * m + b; }), S = 15 * m + 3 * b, i, k;
    for (i = 0; i < 8; i++) if (g[SQL[i][0]] + g[SQL[i][1]] + g[SQL[i][2]] !== S) return null;
    var nh = L === 1 ? 1 : L === 2 ? 2 : 3, hid = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, nh), lab = {}, kn = {}, sLine = -1, xLine = -1, prog = true;
    hid.forEach(function (c, j) { lab[c] = ["x", "y", "z"][j]; });
    for (i = 0; i < 9; i++) if (!(i in lab)) kn[i] = g[i];
    for (i = 0; i < 8 && sLine < 0; i++) if (SQL[i].every(function (c) { return c in kn; })) sLine = i;
    if (sLine < 0) return null;
    while (prog && !(hid[0] in kn)) {
      prog = false;
      for (i = 0; i < 8; i++) {
        var un = SQL[i].filter(function (c) { return !(c in kn); });
        if (un.length === 1) { var u = un[0]; kn[u] = S - SQL[i].reduce(function (s, c) { return c === u ? s : s + kn[c]; }, 0); if (u === hid[0]) xLine = i; prog = true; }
      }
    }
    if (!(hid[0] in kn) || kn[hid[0]] !== g[hid[0]]) return null;
    var rows = [0, 1, 2].map(function (r) { return [0, 1, 2].map(function (c) { var j = r * 3 + c; return j in lab ? lab[j] : g[j]; }); });
    var a = g[hid[0]], xl = SQL[xLine], others = xl.filter(function (c) { return c !== hid[0]; });
    k = SQL[sLine].map(function (c) { return g[c]; });
    return QN("Sehrli kvadratda har bir qator, ustun va diagonal yig'indisi bir xil.<br>" + gridTxt(rows) + "<br><b>x = ?</b>", a, [a + m, a - m, 2 * g[4] - a, S - a, a + 1],
      ["Sehrli son: " + k.join(" + ") + " = " + S + " (" + SQL_N[sLine] + ").", "x turgan " + SQL_N[xLine] + ": x = " + S + " − " + others.map(function (c) { return kn[c]; }).join(" − ") + " = " + a + "."]);
  }
  var RULES2 = [
    [1, function (a, b) { return a + b; }, function (a, b) { return a + " + " + b; }],
    [1, function (a, b) { return a * b; }, function (a, b) { return a + " · " + b; }],
    [2, function (a, b) { return a * b + 1; }, function (a, b) { return a + " · " + b + " + 1"; }],
    [2, function (a, b) { return a * b - 1; }, function (a, b) { return a + " · " + b + " − 1"; }],
    [2, function (a, b) { return 2 * a + b; }, function (a, b) { return "2 · " + a + " + " + b; }],
    [2, function (a, b) { return a + 2 * b; }, function (a, b) { return a + " + 2 · " + b; }],
    [2, function (a, b) { return (a + b) * 2; }, function (a, b) { return "(" + a + " + " + b + ") · 2"; }],
    [3, function (a, b) { return a * a + b; }, function (a, b) { return a + "² + " + b; }],
    [3, function (a, b) { return a * b - a; }, function (a, b) { return a + " · " + b + " − " + a; }],
    [3, function (a, b) { return a * b + a + b; }, function (a, b) { return a + " · " + b + " + " + a + " + " + b; }],
    [3, function (a, b) { return a * a - b; }, function (a, b) { return a + "² − " + b; }],
    [3, function (a, b) { return a * b + b; }, function (a, b) { return a + " · " + b + " + " + b; }]
  ];
  var RULES3 = [
    [function (a, b, c) { return a + b + c; }, function (a, b, c) { return a + " + " + b + " + " + c; }],
    [function (a, b, c) { return a * b + c; }, function (a, b, c) { return a + " · " + b + " + " + c; }],
    [function (a, b, c) { return a * b - c; }, function (a, b, c) { return a + " · " + b + " − " + c; }],
    [function (a, b, c) { return (a + b) * c; }, function (a, b, c) { return "(" + a + " + " + b + ") · " + c; }],
    [function (a, b, c) { return a * b * c; }, function (a, b, c) { return a + " · " + b + " · " + c; }],
    [function (a, b, c) { return a + b * c; }, function (a, b, c) { return a + " + " + b + " · " + c; }],
    [function (a, b, c) { return a * (b + c); }, function (a, b, c) { return a + " · (" + b + " + " + c + ")"; }],
    [function (a, b, c) { return a * b + b * c; }, function (a, b, c) { return a + " · " + b + " + " + b + " · " + c; }]
  ];
  function m9mach(L, three) {
    var RS = three ? RULES3 : RULES2.filter(function (r) { return r[0] <= L; }), ALL = three ? RULES3 : RULES2, fi = three ? 0 : 1, gi = three ? 1 : 2;
    var rule = pick(RS), rows = [], i, lo = L === 1 ? 1 : 2, hi = three ? 7 : 9;
    for (i = 0; i < 3; i++) rows.push(three ? [R(lo, hi), R(lo, hi), R(lo, hi)] : [R(lo, hi), R(lo, hi)]);
    function ap(f, r) { return f.apply(null, r); }
    var a = ap(rule[fi], rows[2]), alt = [];
    for (i = 0; i < ALL.length; i++) {
      var f = ALL[i][fi];
      if (ap(f, rows[0]) === ap(rule[fi], rows[0]) && ap(f, rows[1]) === ap(rule[fi], rows[1]) && ap(f, rows[2]) !== a) return null; // boshqa qoida ham mos — noaniq
      if (ap(f, rows[2]) !== a && ap(f, rows[2]) > 0) alt.push(ap(f, rows[2]));
    }
    if (rows.some(function (r) { return ap(rule[fi], r) <= 0; })) return null;
    var show = rows.map(function (r, j) { return r.concat([j < 2 ? ap(rule[fi], r) : "?"]); });
    return QN("Har bir qatorda oxirgi son oldingilaridan bir xil qoida bilan hosil bo'lgan. «?» o'rniga qaysi son?<br>" + gridTxt(show), a, shuffle(alt).slice(0, 3).concat([a + 1, a - 1]),
      ["Qoida: " + rows.slice(0, 2).map(function (r) { return ap(rule[gi], r) + " = " + ap(rule[fi], r); }).join("; ") + ".", "Demak, " + ap(rule[gi], rows[2]) + " = " + a + "."]);
  }
  function m9pyr(L) {
    var n = L === 1 ? 3 : 4, b = [], i, j, rows = [];
    for (i = 0; i < n; i++) b.push(R(1, L === 3 ? 15 : 12));
    rows.push(b);
    while (rows[rows.length - 1].length > 1) { var p = rows[rows.length - 1], nx = []; for (j = 0; j < p.length - 1; j++) nx.push(p[j] + p[j + 1]); rows.push(nx); }
    var top = rows[rows.length - 1][0], sumB = b.reduce(function (s, x) { return s + x; }, 0);
    if (L < 3) return QN("Sonli piramidada har bir son ostidagi ikki son yig'indisiga teng. Pastki qator: " + b.join(", ") + ". Eng yuqoridagi son nechaga teng?", top, [sumB, top + 1, top - 1, top + b[0]],
      [rows.slice(1, -1).map(function (r, k) { return (k + 2) + "-qator: " + r.join(", "); }).join("; ") + "; tepada: " + top + "."]);
    var h = R(0, n - 1), cf = [1, 3, 3, 1], rest = 0;
    for (i = 0; i < n; i++) if (i !== h) rest += cf[i] * b[i];
    if ((top - rest) / cf[h] !== b[h]) return null;
    var shown = b.map(function (x, k) { return k === h ? "x" : x; });
    return QN("Sonli piramidada har bir son ostidagi ikki son yig'indisiga teng. Pastki qator: " + shown.join(", ") + ", eng yuqorida " + top + ". x = ?", b[h], [top - rest, b[h] + 1, b[h] - 1, b[h] * cf[h], b[h] + 2],
      ["Tepadagi son = a + 3b + 3c + d (har bir pastki son necha marta qo'shilishini sanang).", "Demak, " + cf[h] + " · x = " + top + " − " + rest + " = " + (top - rest) + " → x = " + b[h] + "."]);
  }
  function m9crypt(L) {
    var v = pick(L === 1 ? ["c1", "c3"] : L === 2 ? ["c1", "c2", "c3", "c6"] : ["c4", "c5", "c6", "c2"]), A, B, C, n, cnt, s, d, k, a;
    if (v === "c1") { do { A = R(1, 9); B = R(1, 9); } while (A === B); n = 11 * (A + B); s = {}; for (A = 1; A <= 9; A++) for (B = 1; B <= 9; B++) if (A !== B && 11 * (A + B) === n) s[A + B] = 1; if (Object.keys(s).length !== 1) return null; a = +Object.keys(s)[0];
      return QN("<b>AB + BA = " + n + "</b> (AB va BA — ikki xonali sonlar, A va B — har xil raqamlar). A + B nechaga teng?", a, [a + 1, a - 1, Math.floor(n / 10), a + 2], ["AB + BA = (10A + B) + (10B + A) = 11 · (A + B).", "11 · (A + B) = " + n + " → A + B = " + a + "."]); }
    if (v === "c2") { do { A = R(2, 9); B = R(1, 9); } while (A <= B); n = 9 * (A - B); s = {}; for (A = 1; A <= 9; A++) for (B = 1; B <= 9; B++) if (A > B && 9 * (A - B) === n) s[A - B] = 1; if (Object.keys(s).length !== 1) return null; a = +Object.keys(s)[0];
      return QN("<b>AB − BA = " + n + "</b> (AB va BA — ikki xonali sonlar, A > B). A − B nechaga teng?", a, [a + 1, a - 1, Math.floor(n / 10), a + 2], ["AB − BA = (10A + B) − (10B + A) = 9 · (A − B).", "9 · (A − B) = " + n + " → A − B = " + a + "."]); }
    if (v === "c3") { A = R(1, 9); n = 123 * A; cnt = 0; for (k = 1; k <= 9; k++) if (k + 11 * k + 111 * k === n) cnt++; if (cnt !== 1) return null;
      return QN("<b>A + AA + AAA = " + n + "</b> (A — raqam). A nechaga teng?", A, [A + 1, A - 1, Math.floor(n / 100), A + 2], ["A + AA + AAA = A + 11A + 111A = 123 · A.", n + " : 123 = " + A + "."]); }
    if (v === "c4") { do { A = R(2, 9); C = R(1, 8); } while (A <= C); B = R(0, 9); n = 99 * (A - C); s = {}; for (A = 1; A <= 9; A++) for (C = 1; C <= 9; C++) if (A > C && 99 * (A - C) === n) s[A - C] = 1; if (Object.keys(s).length !== 1) return null; a = +Object.keys(s)[0];
      return QN("<b>ABC − CBA = " + n + "</b> (uch xonali sonlar, A > C). A − C nechaga teng?", a, [a + 1, a - 1, Math.floor(n / 100), a + 2], ["ABC − CBA = (100A + 10B + C) − (100C + 10B + A) = 99 · (A − C).", n + " : 99 = " + a + "."]); }
    if (v === "c5") { A = R(1, 7); B = R(A + 1, 9); s = A + B; d = 9 * (B - A); cnt = []; for (k = 10; k <= 99; k++) { var t = Math.floor(k / 10), u = k % 10; if (t + u === s && u * 10 + t - k === d) cnt.push(k); } if (cnt.length !== 1) return null; a = cnt[0];
      return QN("Ikki xonali sonning raqamlari yig'indisi " + s + ". Raqamlari o'rni almashsa, son " + d + " ga ortadi. Bu qaysi son?", a, [u10(a), a + 9, a - 9, a + 1], ["O'rni almashganda son 9 · (b − a) ga o'zgaradi: " + d + " : 9 = " + (B - A) + " → b − a = " + (B - A) + ".", "a + b = " + s + ", b − a = " + (B - A) + " → a = " + A + ", b = " + B + " → " + a + "."]); }
    do { A = R(2, 9); B = R(1, 8); } while (A <= B); var pr = A * B, sm = A + B; cnt = []; for (k = 1; k <= 9; k++) for (var l = 1; l < k; l++) if (k * l === pr && k + l === sm) cnt.push(k); if (cnt.length !== 1) return null;
    return QN("A va B — raqamlar, A > B. <b>A · B = " + pr + "</b>, <b>A + B = " + sm + "</b>. A nechaga teng?", A, [B, A + 1, A - 1, sm - 1], ["Ko'paytmasi " + pr + ", yig'indisi " + sm + " bo'lgan raqamlar: " + A + " va " + B + " (" + A + " · " + B + " = " + pr + ", " + A + " + " + B + " = " + sm + ").", "A > B → A = " + A + "."]);
  }
  function u10(k) { return (k % 10) * 10 + Math.floor(k / 10); }
  function m9(L) {
    var K = L === 1 ? ["magic", "mach", "pyr", "crypt"] : L === 2 ? ["magic", "mach", "pyr", "crypt", "crypt"] : ["magic", "mach3", "mach", "pyr", "crypt", "crypt"];
    for (var g = 0; g < 200; g++) {
      var k = pick(K), p = k === "magic" ? m9magic(L) : k === "mach" ? m9mach(L, false) : k === "mach3" ? m9mach(L, true) : k === "pyr" ? m9pyr(L) : m9crypt(L);
      if (p) return p;
    }
    return m1(L);
  }

  // m10 — Ezop masallari (ezop-masallar.js dan; fayl har kuni to'ldiriladi — shuning uchun dinamik o'qiladi)
  function shortTxt(s, max) {
    s = String(s).replace(/\s+/g, " ").trim(); if (s.length <= max) return s;
    var parts = s.match(/[^.!?]+[.!?]+["»”]?/g) || [s], out = "", i;
    for (i = 0; i < parts.length; i++) { var nx = (out + parts[i]).trim(); if (nx.length > max) break; out = nx + " "; }
    out = out.trim();
    if (!out) { out = s.slice(0, max - 1); out = out.slice(0, out.lastIndexOf(" ")) + "…"; }
    return out;
  }
  function m10(L) {
    var E = window.EZOP_MASALLAR; if (!E || !E.length) return null;
    var it = pickFresh("ezop", E, 60), cor = it.variantlar[it.javob], w = it.variantlar.filter(function (x, i) { return i !== it.javob; });
    var fw = cor.split(" ")[0].toLowerCase(), c1 = [], c2 = [], c3 = [], c4 = [];
    E.forEach(function (o) {
      if (o === it) return;
      o.variantlar.forEach(function (x, i) {
        if (i === o.javob || x === cor || w.indexOf(x) > -1) return; // boshqa masalning faqat NOTO'G'RI varianti olinadi
        var x0 = x.split(" ")[0].toLowerCase(), sameW = x0 === fw, sameM = o.mavzu === it.mavzu;
        if (!sameW && (x0 === "chunki") !== (fw === "chunki")) return; // "nega?" savoliga "chunki …", boshqasiga esa yo'q
        (sameW && sameM ? c1 : sameW ? c2 : sameM ? c3 : c4).push(x);
      });
    });
    var bk = c1.length ? c1 : c2.length ? c2 : c3.length ? c3 : c4, near = bk.filter(function (x) { return x.length > cor.length * 0.5 && x.length < cor.length * 1.6; });
    var ex = pick(near.length ? near : bk);
    var q = "«" + it.sarlavha + "» masali: " + it.savol;
    if (q.length > 170) q = it.savol.length <= 170 ? it.savol : it.savol.slice(0, 168) + "…";
    return Q(q, cor, w.concat(ex ? [ex] : []), [shortTxt(it.izoh, 160)]);
  }

  // m11 — Sherlock tergov ishlari (sherlock-ishlar.js dan)
  // har bir ishda 3 ta savol: asosiy + qoshimcha[] — hammasi bitta ro'yxatga yoyiladi
  var M11 = null;
  function m11(L) {
    var E = window.SHERLOCK_ISHLAR; if (!E || !E.length) return null;
    if (!M11 || M11.src !== E) {
      M11 = []; M11.src = E;
      E.forEach(function (c) { M11.push({ c: c, q: c }); (c.qoshimcha || []).forEach(function (x) { M11.push({ c: c, q: x }); }); });
    }
    var o = pickFresh("sherlock", M11, 12), it = o.c, x = o.q, cor = x.variantlar[x.javob];
    var w = x.variantlar.filter(function (v, i) { return i !== x.javob; });
    var hik = String(it.hikoya).replace(/<(?!\/?(em|b|i)>)[^>]*>/g, "");
    var q = "🔎 «" + it.sarlavha + "»<br><span style=\"font-size:.82em;font-weight:500\">" + hik + "</span><br><b>" + x.savol + "</b>";
    return Q(q, cor, w, [shortTxt(x.izoh, 200)]);
  }

  S.register("m1", m1, "Mantiq · Sonli ketma-ketliklar");
  S.register("m2", m2, "Mantiq · Ortiqchasini toping");
  S.register("m3", m3, "Mantiq · Harflar, kunlar, oylar va soat");
  S.register("m4", m4, "Mantiq · Mantiqiy xulosa (sillogizmlar)");
  S.register("m5", m5, "Mantiq · Tartiblash va taqqoslash");
  S.register("m6", m6, "Mantiq · Mantiqiy masalalar");
  S.register("m7", m7, "Mantiq · Rostgo'y va yolg'onchi");
  S.register("m8", m8, "Mantiq · Kim qaysi kasbda? (mantiqiy jadval)");
  S.register("m9", m9, "Mantiq · Sehrli kvadrat va sonli jumboqlar");
  S.register("m10", m10, "Mantiq · Ezop masallari");
  S.register("m11", m11, "Mantiq · Sherlock tergov ishlari");

  /* =====================================================================
   *  🇬🇧 INGLIZ TILI
   * ===================================================================== */
  var BOOK_LV = ["", "A1", "A2", "B1", "B1+", "B2", "C1"];
  function enWords(b) {
    var B = window.EN_WORDS && window.EN_WORDS[b]; if (!B) return null;
    if (B._flat) return B._flat;
    var out = [];
    B.forEach(function (u) { (u.w || []).forEach(function (w) { if (w && w.w && w.uz) out.push(w); }); });
    B._flat = out; return out;
  }
  function shortUz(s) {
    s = String(s).replace(/\s*\([^)]*\)/g, "").split(";")[0];
    var parts = s.split(","), r = parts[0].trim();
    if (parts[1] && (r + ", " + parts[1].trim()).length <= 30) r += ", " + parts[1].trim();
    return r.length > 40 ? r.slice(0, 38) + "…" : r;
  }
  function enVocab(b) {
    return function (L) {
      var W = enWords(b); if (!W || W.length < 8) return null;
      var w = pickFresh("en" + b, W, 40), same = W.filter(function (x) { return x.ps === w.ps && x.w !== w.w; });
      if (same.length < 6) same = W.filter(function (x) { return x.w !== w.w; });
      var others = shuffle(same).slice(0, 8), mode = L === 1 ? pick([0, 0, 1]) : L === 2 ? pick([0, 1, 1, 2]) : pick([1, 2, 2]);
      var re = new RegExp("\\b" + w.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (mode === 2 && w.ex && re.test(w.ex)) {
        var gap = w.ex.replace(re, "_____");
        return Q("Gapni to'ldiring:<br><i>" + gap + "</i>", w.w, others.map(function (x) { return x.w; }).filter(function (x) { return !new RegExp("\\b" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(gap); }), [w.ex + " — " + (w.exu || "")]);
      }
      var uz = shortUz(w.uz);
      if (mode === 1) return Q("«<b>" + uz + "</b>» inglizcha qanday bo'ladi?", w.w, others.map(function (x) { return x.w; }), [w.w + " " + (w.ip || "") + " — " + uz + (w.ex ? ". " + w.ex : "")]);
      var wu = []; others.forEach(function (x) { var s = shortUz(x.uz); if (s !== uz && wu.indexOf(s) < 0) wu.push(s); });
      return Q("<b>" + w.w + "</b> " + (w.ip || "") + " so'zining tarjimasi?", uz, wu, [w.w + " — " + uz + (w.ex ? ". " + w.ex + " — " + (w.exu || "") : "")]);
    };
  }
  for (var bk = 1; bk <= 6; bk++) S.register("e" + bk, enVocab(bk), "Ingliz tili · Lug'at " + BOOK_LV[bk] + " (4000 Essential Words " + bk + ")");

  // e7 — to be va Present Simple
  var SUBJ = [["I", "am", "do", 1], ["You", "are", "do", 2], ["He", "is", "does", 3], ["She", "is", "does", 3], ["It", "is", "does", 3], ["We", "are", "do", 2], ["They", "are", "do", 2], ["My brother", "is", "does", 3], ["Our teachers", "are", "do", 2], ["The cat", "is", "does", 3], ["Ali and Vali", "are", "do", 2], ["My mother", "is", "does", 3]];
  var VERBS = [["play", "plays", "football"], ["read", "reads", "books"], ["watch", "watches", "TV"], ["go", "goes", "to school"], ["do", "does", "homework"], ["study", "studies", "English"], ["work", "works", "in a bank"], ["drink", "drinks", "tea"], ["wash", "washes", "the dishes"], ["fly", "flies", "kites"], ["have", "has", "breakfast"], ["cook", "cooks", "plov"], ["teach", "teaches", "maths"], ["speak", "speaks", "Uzbek"], ["fix", "fixes", "cars"]];
  var BE_REST = ["a student", "at home", "happy", "from Tashkent", "in the classroom", "tired", "very kind", "ready"];
  function e7(L) {
    var s = pick(SUBJ), v = pick(VERBS), k = L === 1 ? pick(["be", "be", "ps"]) : L === 2 ? pick(["ps", "neg", "q", "be"]) : pick(["neg", "q", "ps3", "beq"]);
    var rest = pick(BE_REST);
    if (k === "be") return Q(s[0] + " _____ " + rest + ".", s[1], ["am", "is", "are", "be"].filter(function (x) { return x !== s[1]; }), [s[0] + " → " + s[1] + " (I am; he/she/it is; we/you/they are)."]);
    if (k === "beq") return Q("_____ " + s[0].toLowerCase().replace(/^i$/, "I") + " " + rest + "?", cap(s[1]), ["Am", "Is", "Are", "Do", "Does"].filter(function (x) { return x !== cap(s[1]); }), ["So'roq gapda to be oldinga chiqadi: " + cap(s[1]) + " " + (s[0] === "I" || /^[A-Z][a-z]+ and/.test(s[0]) ? s[0] : s[0].charAt(0).toLowerCase() + s[0].slice(1)) + " …?"]);
    var form = s[3] === 3 ? v[1] : v[0];
    if (k === "ps" || k === "ps3") return Q(s[0] + " _____ (" + v[0] + ") " + v[2] + " every day.", form, [v[0], v[1], v[0] + "ing", v[0] === "have" ? "had" : v[0] + "ed", "is " + v[0] + "ing"].filter(function (x) { return x !== form; }), ["Present Simple: " + (s[3] === 3 ? "he/she/it + fe'l + -s/-es → " : "I/you/we/they + fe'l → ") + form + "."]);
    if (k === "neg") return Q(s[0] + " _____ " + v[0] + " " + v[2] + " on Sundays.", s[2] + "n't", ["don't", "doesn't", "isn't", "aren't", "not"].filter(function (x) { return x !== s[2] + "n't"; }), ["Inkor: " + (s[3] === 3 ? "he/she/it + doesn't" : "I/you/we/they + don't") + " + fe'l (o'zak)."]);
    return Q("_____ " + (s[0] === "I" ? "I" : s[0].charAt(0).toLowerCase() + s[0].slice(1)).replace(/^ali/, "Ali").replace(/^i$/, "I") + " " + v[0] + " " + v[2] + "?", cap(s[2]), ["Do", "Does", "Is", "Are", "Am"].filter(function (x) { return x !== cap(s[2]); }), ["So'roq: " + (s[3] === 3 ? "Does + he/she/it" : "Do + I/you/we/they") + " + fe'l?"]);
  }
  S.register("e7", e7, "Ingliz tili · To be va Present Simple");

  // e8 — noto'g'ri fe'llar (Past Simple / V3)
  var IRR = [["be", "was/were", "been", "bo'lmoq"], ["begin", "began", "begun", "boshlamoq"], ["break", "broke", "broken", "sindirmoq"], ["bring", "brought", "brought", "olib kelmoq"], ["build", "built", "built", "qurmoq"], ["buy", "bought", "bought", "sotib olmoq"], ["catch", "caught", "caught", "tutmoq"], ["choose", "chose", "chosen", "tanlamoq"], ["come", "came", "come", "kelmoq"], ["cost", "cost", "cost", "turmoq (narx)"], ["cut", "cut", "cut", "kesmoq"], ["do", "did", "done", "qilmoq"], ["draw", "drew", "drawn", "chizmoq"], ["drink", "drank", "drunk", "ichmoq"], ["drive", "drove", "driven", "haydamoq"], ["eat", "ate", "eaten", "yemoq"], ["fall", "fell", "fallen", "yiqilmoq"], ["feel", "felt", "felt", "his qilmoq"], ["find", "found", "found", "topmoq"], ["fly", "flew", "flown", "uchmoq"], ["forget", "forgot", "forgotten", "unutmoq"], ["get", "got", "got", "olmoq"], ["give", "gave", "given", "bermoq"], ["go", "went", "gone", "bormoq"], ["grow", "grew", "grown", "o'smoq"], ["have", "had", "had", "ega bo'lmoq"], ["hear", "heard", "heard", "eshitmoq"], ["keep", "kept", "kept", "saqlamoq"], ["know", "knew", "known", "bilmoq"], ["leave", "left", "left", "tark etmoq"], ["lose", "lost", "lost", "yo'qotmoq"], ["make", "made", "made", "yasamoq"], ["meet", "met", "met", "uchratmoq"], ["pay", "paid", "paid", "to'lamoq"], ["put", "put", "put", "qo'ymoq"], ["read", "read", "read", "o'qimoq"], ["ride", "rode", "ridden", "minmoq"], ["run", "ran", "run", "yugurmoq"], ["say", "said", "said", "aytmoq"], ["see", "saw", "seen", "ko'rmoq"], ["sell", "sold", "sold", "sotmoq"], ["send", "sent", "sent", "jo'natmoq"], ["sing", "sang", "sung", "kuylamoq"], ["sit", "sat", "sat", "o'tirmoq"], ["sleep", "slept", "slept", "uxlamoq"], ["speak", "spoke", "spoken", "gapirmoq"], ["spend", "spent", "spent", "sarflamoq"], ["stand", "stood", "stood", "turmoq"], ["swim", "swam", "swum", "suzmoq"], ["take", "took", "taken", "olmoq"], ["teach", "taught", "taught", "o'rgatmoq"], ["tell", "told", "told", "aytib bermoq"], ["think", "thought", "thought", "o'ylamoq"], ["understand", "understood", "understood", "tushunmoq"], ["wear", "wore", "worn", "kiymoq"], ["win", "won", "won", "yutmoq"], ["write", "wrote", "written", "yozmoq"]];
  function ed(v) { return /e$/.test(v) ? v + "d" : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + "ied" : v + "ed"; }
  function e8(L) {
    var v = pickFresh("e8", IRR, 20), k = L === 1 ? "v2" : L === 2 ? pick(["v2", "sent", "v3"]) : pick(["v3", "sent", "sent3"]);
    var others = shuffle(IRR.filter(function (x) { return x !== v; })).slice(0, 2);
    if (v[0] === "be" && k !== "v2") k = "v2";
    if (k === "v2") return Q("<b>" + v[0] + "</b> (" + v[3] + ") fe'lining Past Simple (V2) shakli?", v[1], [ed(v[0]), v[2], v[0] + "s", v[0] + "ing", others[0][1]], [v[0] + " — " + v[1] + " — " + v[2]]);
    if (k === "v3") return Q("<b>" + v[0] + "</b> fe'lining uchinchi shakli (V3, Past Participle)?", v[2], [ed(v[0]), v[1], v[0] + "en", v[0] + "ing", others[0][2]], [v[0] + " — " + v[1] + " — " + v[2]]);
    var who = pick(["I", "She", "We", "My father", "They", "He"]);
    if (k === "sent") return Q("Yesterday " + who.replace(/^(?!I\b)\w/, function (c) { return c.toLowerCase(); }) + " _____ (" + v[0] + ").", v[1], [ed(v[0]), v[2], v[0] + "s", v[0], "will " + v[0]], ["«Yesterday» — Past Simple: " + v[0] + " → " + v[1] + "."]);
    return Q(who + " " + (who === "I" || who === "We" || who === "They" ? "have" : "has") + " just _____ (" + v[0] + ").", v[2], [v[1], ed(v[0]), v[0] + "s", v[0] + "ing", v[0], others[0][2]], ["Present Perfect: have/has + V3 → " + v[2] + "."]);
  }
  S.register("e8", e8, "Ingliz tili · Noto'g'ri fe'llar (V2, V3)");

  // e9 — artikl, ko'plik, predloglar
  var AN = ["apple", "egg", "orange", "umbrella", "elephant", "hour", "honest man", "idea", "ice cream", "old car", "English book", "island", "uncle", "artist", "engineer"];
  var A_ = ["book", "car", "university", "uniform", "European city", "house", "one-way street", "dog", "teacher", "banana", "useful tip", "pen", "window", "year", "horse"];
  var PLUR = [["child", "children"], ["man", "men"], ["woman", "women"], ["tooth", "teeth"], ["foot", "feet"], ["mouse", "mice"], ["sheep", "sheep"], ["box", "boxes"], ["city", "cities"], ["knife", "knives"], ["leaf", "leaves"], ["wife", "wives"], ["potato", "potatoes"], ["tomato", "tomatoes"], ["baby", "babies"], ["boy", "boys"], ["bus", "buses"], ["watch", "watches"], ["day", "days"], ["glass", "glasses"], ["goose", "geese"], ["dish", "dishes"]];
  var TIME_P = [["in", "July"], ["in", "2010"], ["in", "winter"], ["in", "the morning"], ["in", "the evening"], ["on", "Monday"], ["on", "Friday"], ["on", "5 May"], ["on", "my birthday"], ["at", "7 o'clock"], ["at", "night"], ["at", "noon"], ["at", "half past six"], ["in", "the 21st century"], ["on", "Sunday morning"]];
  var PLACE_P = [["in", "the box", "qutining ichida"], ["on", "the table", "stol ustida"], ["under", "the bed", "karavot tagida"], ["next to", "the door", "eshik yonida"], ["between", "the two chairs", "ikki stul orasida"], ["behind", "the house", "uy orqasida"], ["in front of", "the school", "maktab oldida"]];
  function plWrong(s, p) { var w = [s + "s", s + "es", p + "s"]; if (s === p) w.push(s + "ies", s + "en"); if (/y$/.test(s)) w.push(s.slice(0, -1) + "ies"); if (/f$|fe$/.test(s)) w.push(s.replace(/fe?$/, "ves")); return w.filter(function (x) { return x !== p; }); }
  function e9(L) {
    var k = L === 1 ? pick(["art", "plur", "place"]) : L === 2 ? pick(["art", "plur", "time", "place"]) : pick(["art2", "plur", "time", "time"]);
    if (k === "art" || k === "art2") {
      var isAn = Math.random() < 0.5, nn = pick(isAn ? AN : A_), hard = /^(hour|honest|university|uniform|European|one-way|useful)/.test(nn);
      if (k === "art2" && !hard) { nn = pick(["hour", "honest man", "university", "uniform", "European city", "one-way street", "useful tip"]); isAn = /^(hour|honest)/.test(nn); }
      var ans = isAn ? "an" : "a";
      return Q("Noaniq artikl qaysi biri: ___ <b>" + nn + "</b>?", ans, ["a", "an", "ikkalasi ham to'g'ri", "artikl qo'yilmaydi"].filter(function (x) { return x !== ans; }), [/^(hour|honest)/.test(nn) ? "«h» o'qilmaydi — unli tovush bilan boshlanadi → an." : /^(university|uniform|European|one-way|useful)/.test(nn) ? "Unli harf bo'lsa ham undosh tovush ([j]/[w]) bilan boshlanadi → a." : "Unli tovush oldidan — an, undosh tovush oldidan — a."]);
    }
    if (k === "plur") { var p = pick(L === 1 ? PLUR.slice(9) : PLUR); return Q("<b>" + p[0] + "</b> so'zining ko'plik shakli?", p[1], plWrong(p[0], p[1]).concat([p[0]]).filter(function (x) { return x !== p[1]; }), [p[0] + " → " + p[1]]); }
    if (k === "time") { var t = pick(TIME_P); return Q("Predlogni tanlang: I was born ___ <b>" + t[1] + "</b>.", t[0], ["in", "on", "at", "to"].filter(function (x) { return x !== t[0]; }), ["in — oy, yil, fasl, kun qismi; on — hafta kuni, sana; at — aniq vaqt, night, noon."]); }
    var pl = pick(PLACE_P);
    return Q("«Mushuk " + pl[2] + "» — inglizchasi: The cat is ___ " + pl[1] + ".", pl[0], shuffle(PLACE_P.map(function (x) { return x[0]; }).filter(function (x) { return x !== pl[0]; })).slice(0, 5), ["The cat is " + pl[0] + " " + pl[1] + " — mushuk " + pl[2] + "."]);
  }
  S.register("e9", e9, "Ingliz tili · Artikllar, ko'plik, predloglar");

  // e10 — sifat darajalari va zamonlar
  var ADJ = [["big", "bigger", "the biggest"], ["small", "smaller", "the smallest"], ["tall", "taller", "the tallest"], ["hot", "hotter", "the hottest"], ["happy", "happier", "the happiest"], ["easy", "easier", "the easiest"], ["good", "better", "the best"], ["bad", "worse", "the worst"], ["beautiful", "more beautiful", "the most beautiful"], ["interesting", "more interesting", "the most interesting"], ["expensive", "more expensive", "the most expensive"], ["fast", "faster", "the fastest"], ["long", "longer", "the longest"], ["cold", "colder", "the coldest"], ["difficult", "more difficult", "the most difficult"], ["young", "younger", "the youngest"], ["many", "more", "the most"], ["little", "less", "the least"]];
  var TENSES = [["She is reading a book now.", "Present Continuous"], ["I have already finished my homework.", "Present Perfect"], ["They played football yesterday.", "Past Simple"], ["He will come tomorrow.", "Future Simple"], ["We were watching TV at 8 pm yesterday.", "Past Continuous"], ["She had left before we arrived.", "Past Perfect"], ["I get up at 7 every day.", "Present Simple"], ["Look! It is raining.", "Present Continuous"], ["Have you ever been to Samarkand?", "Present Perfect"], ["My father works in a hospital.", "Present Simple"], ["I saw him last week.", "Past Simple"], ["They will travel to London next year.", "Future Simple"]];
  var MARK = [["every day", "Present Simple"], ["now", "Present Continuous"], ["at the moment", "Present Continuous"], ["yesterday", "Past Simple"], ["last year", "Past Simple"], ["tomorrow", "Future Simple"], ["next week", "Future Simple"], ["already", "Present Perfect"], ["ever / never", "Present Perfect"], ["usually", "Present Simple"], ["two days ago", "Past Simple"]];
  var TN = ["Present Simple", "Present Continuous", "Present Perfect", "Past Simple", "Past Continuous", "Past Perfect", "Future Simple"];
  function e10(L) {
    var k = L === 1 ? pick(["cmp", "mark"]) : L === 2 ? pick(["cmp", "sup", "mark", "tense"]) : pick(["sup", "tense", "tense", "cmp"]);
    if (k === "cmp" || k === "sup") {
      var a = pick(ADJ), ans = k === "cmp" ? a[1] : a[2];
      var w = k === "cmp" ? [a[0] + "er", "more " + a[0], a[2], a[0] + "est"] : ["the " + a[0] + "est", "the more " + a[0], a[1], "most " + a[0]];
      return Q((k === "cmp" ? "Qiyosiy daraja: " : "Orttirma daraja: ") + "<b>" + a[0] + "</b> → ?", ans, w.filter(function (x) { return x !== ans; }), [a[0] + " — " + a[1] + " — " + a[2]]);
    }
    if (k === "mark") { var m = pick(MARK); return Q("«<b>" + m[0] + "</b>» so'zi odatda qaysi zamon bilan ishlatiladi?", m[1], shuffle(TN.filter(function (x) { return x !== m[1]; })).slice(0, 4), [m[0] + " → " + m[1]]); }
    var t = pick(TENSES);
    return Q("Gap qaysi zamonda?<br><i>" + t[0] + "</i>", t[1], shuffle(TN.filter(function (x) { return x !== t[1]; })).slice(0, 4), [t[0] + " — " + t[1]]);
  }
  S.register("e10", e10, "Ingliz tili · Sifat darajalari va zamonlar");

  /* =====================================================================
   *  🇷🇺 RUS TILI
   * ===================================================================== */
  function ruWords() {
    var D = window.TETRAD_DAYS; if (!D) return null;
    if (D._flat) return D._flat;
    var out = [];
    D.forEach(function (d) { String(d.w || "").split("\n").forEach(function (ln) { var p = ln.split("|"); if (p.length === 3 && p[0].trim() && p[2].trim()) out.push({ ru: p[0].trim(), tr: p[1].trim(), uz: p[2].trim(), g: (/\((м|ж|ср)\)/.exec(p[2]) || [])[1] || "" }); }); });
    D._flat = out; return out;
  }
  function uzOf(x) { return shortUz(x.uz); }
  function ruPlain(s) { return s.replace(/́/g, ""); }
  function ruVocab(dir) {
    return function (L) {
      var W = ruWords(); if (!W || W.length < 8) return null;
      var w = pickFresh("ru" + dir, W, 40), ou = shuffle(W.filter(function (x) { return x !== w && !!x.g === !!w.g; })).slice(0, 8);
      if (dir === "uz") {
        var opts = []; ou.forEach(function (x) { var s = uzOf(x); if (s !== uzOf(w) && opts.indexOf(s) < 0) opts.push(s); });
        return Q("<b>" + w.ru + "</b> (" + w.tr + ") — tarjimasi?", uzOf(w), opts, [w.ru + " — " + uzOf(w)]);
      }
      var useTr = L === 1;
      return Q("«<b>" + uzOf(w) + "</b>» ruscha qanday bo'ladi?", useTr ? w.ru + " (" + w.tr + ")" : w.ru, ou.map(function (x) { return useTr ? x.ru + " (" + x.tr + ")" : x.ru; }), [w.ru + " [" + w.tr + "] — " + uzOf(w)]);
    };
  }
  S.register("r1", ruVocab("uz"), "Rus tili · Lug'at: ruscha → o'zbekcha");
  S.register("r2", ruVocab("ru"), "Rus tili · Lug'at: o'zbekcha → ruscha");

  // r3 — olmoshlar kelishiklarda
  var PR = { // [qaratqich/tushum (у ..., вижу ...), jo'nalish (дам ...), vosita (с ...), predl (о ...)]
    "я": { gen: "меня", acc: "меня", dat: "мне", ins: "мной", prep: "мне" },
    "ты": { gen: "тебя", acc: "тебя", dat: "тебе", ins: "тобой", prep: "тебе" },
    "он": { gen: "него", acc: "его", dat: "ему", ins: "ним", prep: "нём" },
    "она": { gen: "неё", acc: "её", dat: "ей", ins: "ней", prep: "ней" },
    "мы": { gen: "нас", acc: "нас", dat: "нам", ins: "нами", prep: "нас" },
    "вы": { gen: "вас", acc: "вас", dat: "вам", ins: "вами", prep: "вас" },
    "они": { gen: "них", acc: "их", dat: "им", ins: "ними", prep: "них" }
  };
  var PR_T = [
    ["gen", "У ___ есть новый телефон.", "Родительный падеж (кого?): у + "],
    ["acc", "Я хорошо знаю ___.", "Винительный падеж (кого?): "],
    ["acc", "Мама ждёт ___ дома.", "Винительный падеж (кого?): "],
    ["dat", "Учитель дал ___ книгу.", "Дательный падеж (кому?): "],
    ["dat", "Позвони ___ вечером!", "Дательный падеж (кому?): "],
    ["ins", "Мы пойдём в кино вместе с ___.", "Творительный падеж (с кем?): с + "],
    ["prep", "Все говорят о ___.", "Предложный падеж (о ком?): о + "]
  ];
  var PR_ALL = ["меня", "мне", "мной", "тебя", "тебе", "тобой", "его", "него", "ему", "ним", "нём", "её", "неё", "ей", "ней", "нас", "нам", "нами", "вас", "вам", "вами", "их", "них", "им", "ими", "ними"];
  function prForms(base) { var f = PR[base], o = []; if (!f) return o; for (var k in f) if (o.indexOf(f[k]) < 0) o.push(f[k]); return o; }
  function r3(L) {
    var P = window.TETRAD_PRON;
    if (P && L >= 2 && Math.random() < 0.6) {
      if (L === 3 && P.ex2 && P.ex2.length && Math.random() < 0.4) {
        var c = pickFresh("r3c", P.ex2, 6), right = c.o[c.a];
        return Q(c.q, right, c.o.filter(function (x) { return x !== right; }).concat(shuffle(PR_ALL.filter(function (x) { return c.o.indexOf(x) < 0; })).slice(0, 2)), [c.h || ""]);
      }
      var it = pickFresh("r3i", P.ex1, 12), base = (/\((я|ты|он|она|оно|мы|вы|они)\)\s*$/.exec(it.q) || [])[1], ans = it.a[0];
      var wr = prForms(base === "оно" ? "он" : base).concat(base ? [base] : []).filter(function (x) { return it.a.indexOf(x) < 0; });
      while (wr.length < 3) { var z = pick(PR_ALL); if (it.a.indexOf(z) < 0 && wr.indexOf(z) < 0) wr.push(z); }
      return Q(it.q, ans, wr, [it.h || ""]);
    }
    var t = pick(PR_T), keys = Object.keys(PR).filter(function (k) { return !(t[0] === "prep" && k === "я"); }), b = pick(keys), a = PR[b][t[0]];
    var w = prForms(b).concat([b]).filter(function (x) { return x !== a; });
    if (t[0] === "acc" && (b === "он" || b === "она" || b === "они")) w = w.filter(function (x) { return x !== PR[b].gen; }).concat([PR[b].gen === a ? "" : PR[b].gen]).filter(Boolean);
    return Q(t[1] + " <b>(" + b + ")</b>", a, w, [t[2] + a]);
  }
  S.register("r3", r3, "Rus tili · Olmoshlar kelishiklarda");

  // r4 — otlarning jinsi
  var GEN = { "м": "мужской род (м)", "ж": "женский род (ж)", "ср": "средний род (ср)" };
  function r4(L) {
    var W = ruWords(); if (!W) return null;
    var nouns = W.filter(function (x) { return x.g && x.ru.split(" ").length === 1; });
    if (L === 1) nouns = nouns.filter(function (x) { var p = ruPlain(x.ru); return x.g === "м" ? /[бвгджзклмнпрстфхцчшщ]$/.test(p) : x.g === "ж" ? /[ая]$/.test(p) : /[оеё]$/.test(p); });
    if (!nouns.length) return null;
    var n = pickFresh("r4" + L, nouns, 30), a = GEN[n.g];
    return Q("<b>" + n.ru + "</b> (" + uzOf(n) + ") — qaysi jinsda?", a, ["мужской род (м)", "женский род (ж)", "средний род (ср)", "общий род"].filter(function (x) { return x !== a; }), [ruPlain(n.ru) + " — " + a + ". Odatda: undosh/-й → м; -а/-я → ж; -о/-е → ср; -ь — ikkalasi ham bo'lishi mumkin."]);
  }
  S.register("r4", r4, "Rus tili · Otlarning jinsi (м, ж, ср)");

  // r5 — sonlar, hafta kunlari, oylar
  var RU_N = { 0: "ноль", 1: "один", 2: "два", 3: "три", 4: "четыре", 5: "пять", 6: "шесть", 7: "семь", 8: "восемь", 9: "девять", 10: "десять", 11: "одиннадцать", 12: "двенадцать", 13: "тринадцать", 14: "четырнадцать", 15: "пятнадцать", 16: "шестнадцать", 17: "семнадцать", 18: "восемнадцать", 19: "девятнадцать", 20: "двадцать", 30: "тридцать", 40: "сорок", 50: "пятьдесят", 60: "шестьдесят", 70: "семьдесят", 80: "восемьдесят", 90: "девяносто", 100: "сто", 200: "двести", 300: "триста", 400: "четыреста", 500: "пятьсот", 600: "шестьсот", 700: "семьсот", 800: "восемьсот", 900: "девятьсот" };
  function ruNum(n) {
    if (RU_N[n] != null) return RU_N[n];
    var h = Math.floor(n / 100) * 100, r = n % 100, out = [];
    if (h) out.push(RU_N[h]);
    if (r) { if (RU_N[r] != null) out.push(RU_N[r]); else { out.push(RU_N[Math.floor(r / 10) * 10]); if (r % 10) out.push(RU_N[r % 10]); } }
    return out.join(" ");
  }
  var RU_D = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  var RU_M = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  function r5(L) {
    var k = L === 1 ? pick(["n1", "day", "mon"]) : L === 2 ? pick(["n2", "day", "mon", "n2"]) : pick(["n3", "n3", "n2r"]);
    if (k === "day") { var i = R(0, 6), dir = Math.random() < 0.5; return dir ? Q("<b>" + RU_D[i] + "</b> — qaysi kun?", DAYS[i], shuffle(DAYS.filter(function (x, j) { return j !== i; })).slice(0, 4), [RU_D[i] + " — " + DAYS[i]]) : Q("«<b>" + DAYS[i] + "</b>» ruscha?", RU_D[i], shuffle(RU_D.filter(function (x, j) { return j !== i; })).slice(0, 4), [DAYS[i] + " — " + RU_D[i]]); }
    if (k === "mon") { var m = R(0, 11); return Q("Yilning " + (m + 1) + "-oyi ruscha qanday ataladi?", RU_M[m], shuffle(RU_M.filter(function (x, j) { return j !== m; })).slice(0, 4), [(m + 1) + "-oy — " + MONTHS[m] + " — " + RU_M[m]]); }
    var n = k === "n1" ? R(1, 20) : k === "n2" || k === "n2r" ? R(21, 99) : R(101, 999);
    var cand = [n + 1, n - 1, n + 10, n - 10, n + 100, n + 2].filter(function (x) { return x > 0 && x < 1000 && x !== n; });
    if (k === "n2r" || (k === "n3" && Math.random() < 0.5)) return Q("<b>" + ruNum(n) + "</b> — qaysi son?", n, shuffle(cand).slice(0, 4), [ruNum(n) + " = " + n]);
    return Q("<b>" + n + "</b> soni ruscha qanday yoziladi?", ruNum(n), shuffle(cand).slice(0, 4).map(ruNum), [n + " — " + ruNum(n)]);
  }
  S.register("r5", r5, "Rus tili · Sonlar, hafta kunlari va oylar");

  // r6 — kundalik iboralar
  var RU_PH = [["Здравствуйте!", "Assalomu alaykum! (rasmiy)", "Здравствуйте, Анна Ивановна!", "Assalomu alaykum, Anna Ivanovna!"], ["Спасибо!", "Rahmat!", "Спасибо за помощь!", "Yordam uchun rahmat!"], ["Извините", "Kechirasiz", "Извините, я опоздал.", "Kechirasiz, kechikdim."], ["До свидания!", "Xayr! (rasmiy)", "До свидания, до завтра!", "Xayr, ertagacha!"], ["Как дела?", "Ishlaring qalay?", "Привет! Как дела?", "Salom! Ishlaring qalay?"], ["Меня зовут …", "Mening ismim …", "Меня зовут Азиз.", "Mening ismim Aziz."], ["Сколько стоит?", "Qancha turadi?", "Сколько стоит эта книга?", "Bu kitob qancha turadi?"], ["Я не понимаю", "Men tushunmayapman", "Извините, я не понимаю.", "Kechirasiz, men tushunmayapman."], ["Доброе утро!", "Xayrli tong!", "Доброе утро, мама!", "Xayrli tong, oyi!"], ["Спокойной ночи!", "Xayrli tun!", "Спокойной ночи, дети!", "Xayrli tun, bolalar!"], ["Который час?", "Soat necha?", "Скажите, пожалуйста, который час?", "Ayting-chi, soat necha?"], ["Приятного аппетита!", "Yoqimli ishtaha!", "Приятного аппетита всем!", "Hammaga yoqimli ishtaha!"], ["С днём рождения!", "Tug'ilgan kuning bilan!", "С днём рождения, друг!", "Tug'ilgan kuning bilan, do'stim!"], ["Не за что", "Arzimaydi", "— Спасибо! — Не за что.", "— Rahmat! — Arzimaydi."], ["Удачи!", "Omad!", "Удачи на экзамене!", "Imtihonda omad!"], ["Где находится …?", "… qayerda joylashgan?", "Где находится вокзал?", "Vokzal qayerda joylashgan?"]];
  function r6(L) {
    var P = window.TETRAD_PRON, ALL = RU_PH.concat(P && P.phrases ? P.phrases : []);
    var ph = pickFresh("r6", ALL, 10), others = shuffle(ALL.filter(function (x) { return x !== ph; })).slice(0, 4);
    if (L === 1 || (L === 2 && Math.random() < 0.5)) return Q("«<b>" + ph[0] + "</b>» iborasining ma'nosi?", shortUz(ph[1]), others.map(function (x) { return shortUz(x[1]); }), [ph[2] + " — " + ph[3]]);
    return Q("«<b>" + shortUz(ph[1]) + "</b>» ruscha qanday aytiladi?", ph[0], others.map(function (x) { return x[0]; }), [ph[2] + " — " + ph[3]]);
  }
  S.register("r6", r6, "Rus tili · Kundalik iboralar");

  /* =====================================================================
   *  Ma'lumot fayllarini kerak bo'lganda yuklash
   * ===================================================================== */
  var BASE = (function () {
    try { var sc = document.currentScript || document.querySelector('script[src*="ka-savollar-fanlar.js"]'); return sc && sc.src ? sc.src.replace(/[^\/]*$/, "") : ""; } catch (e) { return ""; }
  })();
  var NEED = {
    e1: ["english/assets/words-b1.js"], e2: ["english/assets/words-b2.js"], e3: ["english/assets/words-b3.js"],
    e4: ["english/assets/words-b4.js"], e5: ["english/assets/words-b5.js"], e6: ["english/assets/words-b6.js"],
    r1: ["rus-tili/assets/lugat-data.js"], r2: ["rus-tili/assets/lugat-data.js"], r4: ["rus-tili/assets/lugat-data.js"],
    r3: ["rus-tili/assets/mashq-data.js"], r6: ["rus-tili/assets/mashq-data.js"],
    m10: ["ezop-masallar.js"], m11: ["sherlock-ishlar.js?v=20261113a"]
  };
  var LOADED = {};
  function addJs(src) {
    if (LOADED[src]) return LOADED[src];
    LOADED[src] = new Promise(function (ok) { var s = document.createElement("script"); s.src = BASE + src; s.onload = ok; s.onerror = function () { delete LOADED[src]; ok(); }; document.head.appendChild(s); });
    return LOADED[src];
  }
  window.kaFan = {
    need: function (ids) { var o = []; (ids || []).forEach(function (id) { (NEED[id] || []).forEach(function (f) { if (o.indexOf(f) < 0) o.push(f); }); }); return o; },
    prep: function (ids) { return Promise.all(window.kaFan.need(ids).map(addJs)); },
    // node testlari uchun
    loadNode: function (root, vm, ctx, fs) { var all = {}; for (var k in NEED) NEED[k].forEach(function (f) { all[f] = 1; }); for (var f in all) vm.runInContext(fs.readFileSync(root + "/" + f.split("?")[0], "utf8"), ctx, { filename: f }); }
  };
})();
