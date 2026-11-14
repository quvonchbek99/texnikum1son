/*! Kuvonch Academy — viktorina: Fizika, Kimyo, Informatika savollari
 *  f1–f5 Fizika · k1–k3 Kimyo · i1–i5 Informatika va robototexnika.
 *  Hisoblash savollari har safar yangi sonlar bilan, tushuncha savollari — bankdan. ES5. */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle;
  function Q(q, a, w, steps) { return { q: q, a: String(a), w: w.map(String), steps: steps || [], lang: S.lang() }; }
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }
  // son yozuvi: 6 xonagacha yaxlitlash, manfiy son "−" bilan
  function f(x) { var r = Math.round(Math.abs(x) * 1e6) / 1e6; return (x < 0 && r !== 0 ? "−" : "") + String(r); }
  function nf(x) { return Math.abs(x) >= 1000 ? Math.round(x) : Number(x.toPrecision(4)); }
  function un(unit) { return unit ? (unit === "%" ? "%" : " " + unit) : ""; }
  // noto'g'ri variantlar: takrorsiz, javobga teng emas; sonlar o'sha birlik bilan yoziladi
  function W(a, cands, unit, neg, n) {
    n = n || 4;
    var u = un(unit), A = String(a), out = [], seen = {}, i; seen[A] = 1;
    function add(v) {
      if (out.length >= n || v === null || v === undefined) return;
      if (typeof v === "number") { if (!isFinite(v) || v === 0 || (v < 0 && !neg) || (unit === "%" && v > 100)) return; v = f(nf(v)) + u; }
      v = String(v); if (seen[v]) return; seen[v] = 1; out.push(v);
    }
    for (i = 0; i < cands.length; i++) add(cands[i]);
    var b = parseFloat(A.replace("−", "-")), k = [2, 0.5, 10, 0.1, 3, 1.5, 4, 0.25, 5, 0.2];
    if (!isNaN(b) && b !== 0) for (i = 0; i < k.length; i++) add(b * k[i]);
    if (!isNaN(b)) for (i = 1; i < 60; i++) { add(b + i); add(b - i); }
    return shuffle(out);
  }
  function NQ(q, val, unit, cands, steps, neg) { var a = f(val) + un(unit); return Q(q, a, W(a, cands, unit, neg), steps); }
  function TQ(q, a, w, steps) { return Q(q, a, shuffle(w), steps); }
  // bank: [daraja, savol, javob, [noto'g'ri...], izoh]
  function bank(items) {
    var by = { 1: [], 2: [], 3: [] }, rec = [];   // rec — yaqinda berilgan savollar (takrorlanmasin)
    for (var i = 0; i < items.length; i++) by[items[i][0]].push(items[i]);
    return function (L) {
      var arr = by[L] && by[L].length ? by[L] : items, fr = arr.filter(function (x) { return rec.indexOf(x[1]) < 0; }), it = pick(fr.length ? fr : arr);
      rec.push(it[1]); if (rec.length > 12) rec.shift();
      return Q(it[1], it[2], shuffle(it[3]), it[4] ? [it[4]] : []);
    };
  }
  function mix(bk, pr, p) { return function (L) { return Math.random() < p ? bk(L) : pr(L); }; }
  function others(arr, x, n) { return shuffle(arr.filter(function (y) { return y !== x; })).slice(0, n || 3); }
  // ro'yxatdan n ta (ex dagilardan va o'zaro farqli) element
  function otherN(list, ex, n) { var out = []; shuffle(list).forEach(function (x) { if (out.length < n && ex.indexOf(x) < 0 && out.indexOf(x) < 0) out.push(x); }); return out; }

  /* ================= f1 Mexanika: tezlik, kuch, bosim ================= */
  var B1 = bank([
    [1, "Tashqi ta'sir bo'lmaganda jismning o'z tezligini saqlash hodisasi nima deyiladi?", "Inertsiya", ["Gravitatsiya", "Ishqalanish", "Deformatsiya"], "Jism tezligini saqlash hodisasi — inertsiya."],
    [1, "Kuchning SI dagi birligi qaysi?", "Nyuton (N)", ["Joul (J)", "Paskal (Pa)", "Vatt (Vt)"], "Kuch nyutonlarda (N) o'lchanadi."],
    [1, "Tezlikning SI dagi birligi qaysi?", "m/s", ["km/soat", "m/s²", "m·s"], "SI da tezlik metr taqsim sekund (m/s) da o'lchanadi."],
    [1, "Bosimning SI dagi birligi qaysi?", "Paskal (Pa)", ["Nyuton (N)", "Joul (J)", "Vatt (Vt)"], "1 Pa = 1 N/m²."],
    [1, "Kuchni o'lchaydigan asbob qaysi?", "Dinamometr", ["Barometr", "Spidometr", "Termometr"], "Kuch dinamometr bilan o'lchanadi."],
    [1, "Avtomobil tezligini ko'rsatadigan asbob qaysi?", "Spidometr", ["Dinamometr", "Manometr", "Ampermetr"], "Spidometr — tezlik o'lchagich."],
    [1, "Yerning jismlarni o'ziga tortish kuchi nima deyiladi?", "Og'irlik kuchi", ["Elastiklik kuchi", "Ishqalanish kuchi", "Arximed kuchi"], "Og'irlik kuchi F = m·g."],
    [1, "1 soat necha sekund?", "3600 s", ["60 s", "360 s", "1000 s"], "1 soat = 60 min = 60 · 60 s = 3600 s."],
    [1, "Teng vaqt oraliqlarida teng masofalarni bosib o'tadigan harakat qanday ataladi?", "Tekis harakat", ["Tezlanuvchan harakat", "Tebranma harakat", "Aylanma harakat"], "Tezlik o'zgarmas bo'lsa — tekis harakat."],
    [1, "Tezlik formulasi qaysi?", "v = s/t", ["v = s·t", "v = t/s", "v = m·a"], "Tezlik = yo'l : vaqt."],
    [2, "Inertsiya qonuni Nyutonning nechanchi qonuni?", "Birinchi qonuni", ["Ikkinchi qonuni", "Uchinchi qonuni", "Tortishish qonuni"], "Nyutonning 1-qonuni — inertsiya qonuni."],
    [2, "F = m·a formulasi qaysi qonunni ifodalaydi?", "Nyutonning 2-qonuni", ["Nyutonning 1-qonuni", "Nyutonning 3-qonuni", "Guk qonuni"], "Kuch = massa · tezlanish — Nyutonning 2-qonuni."],
    [2, "\"Ta'sir aks ta'sirga teng va qarama-qarshi yo'nalgan\" — bu qaysi qonun?", "Nyutonning 3-qonuni", ["Nyutonning 1-qonuni", "Nyutonning 2-qonuni", "Paskal qonuni"], "Nyutonning 3-qonuni: F₁ = −F₂."],
    [2, "Tezlanishning SI dagi birligi qaysi?", "m/s²", ["m/s", "m²/s", "km/soat"], "a = Δv/t, ya'ni (m/s)/s = m/s²."],
    [2, "Ishqalanish kuchini kamaytirish usuli qaysi?", "Sirtlarni moylash", ["Sirtni g'adir-budir qilish", "Bosim kuchini oshirish", "Qum sepish"], "Moylash ishqalanishni kamaytiradi."],
    [2, "Kuch o'zgarmaganda bosimni oshirish uchun nima qilish kerak?", "Tayanch yuzasini kichraytirish", ["Tayanch yuzasini kattalashtirish", "Massani kamaytirish", "Tezlikni oshirish"], "p = F/S: S kichik bo'lsa p katta."],
    [2, "Guk qonuniga ko'ra elastiklik kuchi nimaga proporsional?", "Cho'zilish (deformatsiya)ga", ["Jism massasiga", "Tezlikka", "Vaqtga"], "F = k·x, x — deformatsiya."],
    [2, "Jismning og'irligi qaysi birlikda o'lchanadi?", "Nyuton (N)", ["Kilogramm (kg)", "Joul (J)", "Paskal (Pa)"], "Og'irlik — kuch, shuning uchun nyutonda."],
    [2, "Yer sirtida erkin tushish tezlanishi taxminan qancha?", "9.8 m/s²", ["9.8 m/s", "98 m/s²", "1 m/s²"], "g ≈ 9.8 m/s² (masalalarda ko'pincha 10 m/s²)."],
    [2, "Raketaning reaktiv harakati qaysi qonunga asoslangan?", "Impulsning saqlanish qonuni", ["Arximed qonuni", "Paskal qonuni", "Om qonuni"], "Gaz orqaga otilib, raketa oldinga harakatlanadi — impuls saqlanadi."],
    [3, "Jism impulsi formulasi qaysi?", "p = m·v", ["p = m·a", "p = F/S", "p = m·g"], "Impuls = massa · tezlik."],
    [3, "Impulsning SI dagi birligi qaysi?", "kg·m/s", ["kg·m/s²", "N/m²", "J/s"], "p = m·v ⇒ kg·m/s."],
    [3, "Aylana bo'ylab tekis harakatda tezlanish qayerga yo'nalgan?", "Aylana markaziga", ["Tezlik yo'nalishida", "Markazdan tashqariga", "Tezlanish nolga teng"], "Markazga intilma tezlanish a = v²/R."],
    [3, "Butun olam tortishish qonunini kim kashf etgan?", "Isaak Nyuton", ["Galileo Galiley", "Iogann Kepler", "Albert Eynshteyn"], "F = G·m₁·m₂/r² — Nyuton qonuni."],
    [3, "Ikki jism orasidagi masofa 2 marta oshsa, tortishish kuchi qanday o'zgaradi?", "4 marta kamayadi", ["2 marta kamayadi", "4 marta ortadi", "O'zgarmaydi"], "F ~ 1/r²: r 2 marta ⇒ F 4 marta kichik."],
    [3, "Havosiz idishda (vakuumda) pat va tosh bir balandlikdan tashlansa nima bo'ladi?", "Bir vaqtda tushadi", ["Tosh oldin tushadi", "Pat oldin tushadi", "Pat tushmaydi"], "Vakuumda barcha jismlar bir xil tezlanish bilan tushadi."],
    [3, "Gravitatsiya doimiysi G taxminan nimaga teng?", "6.67·10⁻¹¹ N·m²/kg²", ["6.67·10¹¹ N·m²/kg²", "9.8·10⁻¹¹ N·m²/kg²", "3·10⁸ N·m²/kg²"], "G ≈ 6.67·10⁻¹¹ N·m²/kg²."],
    [3, "Sirpanish ishqalanish kuchi formulasi qaysi?", "F = μ·N", ["F = k·x", "F = ρ·g·V", "F = m·v"], "μ — ishqalanish koeffitsienti, N — tayanch reaksiya kuchi."],
    [3, "Yer uchun birinchi kosmik tezlik taxminan qancha?", "7.9 km/s", ["11.2 km/s", "16.7 km/s", "340 m/s"], "7.9 km/s — birinchi, 11.2 km/s — ikkinchi kosmik tezlik."],
    [3, "Tekis tezlanuvchan harakatda yo'l formulasi qaysi?", "s = v₀t + at²/2", ["s = v·t²", "s = v₀ + at", "s = at"], "s = v₀t + at²/2."],
    [3, "Lift yuqoriga tezlanish bilan ko'tarilganda undagi odamning og'irligi qanday o'zgaradi?", "Ortadi", ["Kamayadi", "O'zgarmaydi", "Nolga teng bo'ladi"], "P = m(g + a) > m·g."],
    [1,"Massaning Xalqaro birliklar tizimida (SI) birligi qaysi?","Kilogramm",["Nyuton","Paskal","Vatt"],"Massa miqdori kilogrammlarda o'lchanadi."],
    [1,"Vaqtning SI birligi qaysi?","Sekund",["Metr","Kilogramm","Amper"],"Vaqt SI da sekundlarda o'lchanadi."],
    [1,"Uzunlikning SI birligi qaysi?","Metr",["Sekund","Nyuton","Kandela"],"Uzunlikning asosiy birligi metrdir."],
    [1,"Bosim formulasi qanday yoziladi?","p = F/S",["p = F·S","p = S/F","p = m·g"],"Bosim kuchni yuzaga bo'lishdan kelib chiqadi."],
    [1,"Og'irlik kuchi formulasi qanday?","F = m·g",["F = m·g·h","F = m/g","F = p·S"],"Og'irlik massaga va erkin tushish tezlanishiga bog'liq."],
    [1,"Tezlik vektor kattalikmi yoki skalyar?","Vektor",["Skalyar","Doimiy","Nisbiy"],"Tezlik yo'nalishga ega, shu uchun vektor."],
    [1,"Kuch vektormi yoki skalyarmi?","Vektor",["Skalyar","O'zgarmas","Asosiy"],"Kuchning yo'nalishi va moduli bor, ya'ni vektor."],
    [1,"Massa vektormi yoki skalyarmi?","Skalyar",["Vektor","O'zgaruvchi","Nisbiy"],"Massada yo'nalish yo'q, u skalyar kattalik."],
    [1,"Yopiq idishdagi gaz yoki suyuqlik bosimini o'lchaydigan asbob qaysi?","Manometr",["Dinamometr","Termometr","Spidometr"],"Manometr yopiq muhit bosimini ko'rsatadi."],
    [1,"Jism tezligining o'zgarish tezligi qanday kattalik deyiladi?","Tezlanish",["Tezlik","Yo'l","Kuch"],"Tezlanish tezlikning birlik vaqtdagi o'zgarishini bildiradi."],
    [1,"Bir minut necha sekundga teng?","60 s",["3600 s","100 s","24 s"],"1 minut 60 sekundga teng."],
    [1,"Tezligi vaqt o'tishi bilan o'zgaradigan harakat qanday nomlanadi?","O'zgaruvchan harakat",["Tekis harakat","Tinch holat","Aylanma harakat"],"O'zgaruvchan harakatda tezlik o'zgaradi."],
    [1,"Suv ostida chuqurlik oshgani sayin bosim qanday o'zgaradi?","Ortadi",["Kamayadi","O'zgarmaydi","Nolga teng bo'ladi"],"Gidrostatik bosim chuqurlikka to'g'ri proporsional."],
    [1,"Agar g = 10 m/s² bo'lsa, massasi 2 kg jismning og'irligi qancha?","20 N",["5 N","10 N","2 N"],"Og'irlik F = m·g = 2·10 = 20 N ga teng."],
    [1,"Tezlik 5 m/s, vaqt 6 s bo'lsa, bosib o'tilgan masofa qancha?","30 m",["11 m","35 m","1 m"],"s = v·t = 5·6 = 30 m."],
    [1,"Avtomobil 3 soatda 150 km yo'l bosib o'tsa, tezligi qancha?","50 km/soat",["450 km/soat","30 km/soat","153 km/soat"],"v = s/t = 150/3 = 50 km/soat."],
    [1,"72 km/soat tezlik necha m/s ga teng?","20 m/s",["36 m/s","72 m/s","7,2 m/s"],"km/soat ni m/s ga o'tkazish uchun 3,6 ga bo'lamiz: 72 : 3,6 = 20."],
    [1,"Jism 10 m/s tezlik bilan 20 s harakatlansa, qancha yo'l bosadi?","200 m",["2 m","30 m","210 m"],"s = v·t = 10·20 = 200 m."],
    [1,"Cho'zilgan prujina qaytib boshlang'ich holatga intilganda qanday kuch hosil qiladi?","Elastiklik kuchini",["Ishqalanish kuchini","Og'irlik kuchini","Arximed kuchini"],"Prujina deformatsiyadan qaytishda elastiklik kuchi ko'rsatadi."],
    [1,"Jismning og'irligi uning massasiga qanday bog'liq?","To'g'ri proporsional",["Teskari proporsional","Bog'liq emas","Kvadratiga proporsional"],"F = m·g, shu sabab og'irlik massaga to'g'ri proporsional."],
    [1,"Sirtga 15 N kuch 3 m² maydonga perpendikulyar ta'sir etsa, bosim qancha?","5 Pa",["45 Pa","18 Pa","0.2 Pa"],"p = F/S = 15/3 = 5 Pa."],
    [1,"Harakatdagi jismga ishqalanish kuchi qanday ta'sir ko'rsatadi?","Harakatni sekinlashtiradi",["Tezlashtiradi","Harakat yo'nalishini doim teskariga aylantiradi","Hech qanday ta'sir qilmaydi"],"Ishqalanish kuchi harakatga qarshi yo'nalgan, sekinlashtiradi."],
    [1,"Bosim vektor kattalikmi yoki skalyar?","Skalyar",["Vektor","O'zgaruvchi","Doimiy"],"Bosim faqat son qiymatga ega, yo'nalishi yo'q, shu uchun skalyar."],
    [2,"Nyutonning 2-qonuniga ko'ra jism tezlanishi kuchga qanday bog'liq?","To'g'ri proporsional",["Teskari proporsional","Bog'liq emas","Kvadratiga proporsional"],"a = F/m, tezlanish kuchga to'g'ri proporsional."],
    [2,"Nyutonning 2-qonuniga ko'ra tezlanish massaga qanday bog'liq?","Teskari proporsional",["To'g'ri proporsional","Bog'liq emas","Kvadratiga proporsional"],"a = F/m, tezlanish massaga teskari proporsional."],
    [2,"Suyuqlikdagi gidrostatik bosim formulasi qanday?","p = ρ·g·h",["p = ρ·g","p = g·h","p = ρ·h"],"Bosim zichlik, tezlanish va chuqurlik ko'paytmasiga teng."],
    [2,"Atmosfera bosimini o'lchaydigan asbob qaysi?","Barometr",["Manometr","Dinamometr","Gigrometr"],"Barometr atmosfera bosimini ko'rsatadi."],
    [2,"Gidravlik press qaysi qonunga asoslangan?","Paskal qonuniga",["Guk qonuniga","Om qonuniga","Arximed qonuniga"],"Paskal qonuni suyuqlikdagi bosimning bir tekis tarqalishini bildiradi."],
    [2,"Prujina qattiqligi qaysi harf bilan belgilanadi?","k",["F","x","m"],"Guk qonunida prujina qattiqligi k harfi bilan belgilanadi."],
    [2,"Prujina qattiqligi oshsa, bir xil kuchda uning cho'zilishi qanday bo'ladi?","Kamayadi",["Ortadi","O'zgarmaydi","Nolga aylanadi"],"x = F/k, kattaroq qattiqlik kichikroq cho'zilish beradi."],
    [2,"Jism impulsining o'zgarishi nimaga teng?","Kuch va vaqt ko'paytmasiga (F·t)",["Kuch va masofa ko'paytmasiga","Massa va tezlik ko'paytmasiga","Kuch va tezlik ko'paytmasiga"],"Δp = F·t — impulsning o'zgarishi kuch bilan uning ta'sir vaqti ko'paytmasiga teng."],
    [2,"Tinch holatdagi jismning impulsi qanchaga teng?","0 ga",["Maksimal","Massasiga teng","Cheksiz"],"Tinch holatda tezlik 0, shu uchun p = m·v = 0."],
    [2,"Yerdan ikkinchi kosmik tezlik qanchaga yaqin?","11,2 km/s",["7,9 km/s","16,7 km/s","9,8 km/s"],"Ikkinchi kosmik tezlik taxminan 11,2 km/s ga teng."],
    [2,"Markazga intilma kuch formulasi qanday?","F = m·v²/r",["F = m·v","F = m/r","F = v²/r"],"Sentripetal kuch F = m·v²/r formula bilan topiladi."],
    [2,"1 kilonyuton (kN) necha nyutonga teng?","1000 N",["100 N","10 N","10000 N"],"1 kN = 1000 N."],
    [2,"Bir nuqtaga qo'yilgan kuchlarning vektor yig'indisi qanday kuch deyiladi?","Teng ta'sir etuvchi kuch",["Ishqalanish kuchini","Og'irlik kuchini","Elastiklik kuchini"],"Kuchlarning vektor yig'indisi teng ta'sir etuvchi (natijaviy) kuchni beradi."],
    [2,"Normal atmosfera bosimi necha millimetr simob ustuniga teng?","760 mm",["1000 mm","750 mm","780 mm"],"Normal atmosfera bosimi 760 mm simob ustuniga teng."],
    [2,"Massa va og'irlik bir xil kattalikmi?","Yo'q, ikki xil",["Ha, bir xil","Faqat kosmosda farqlanadi","Faqat vakuumda farqlanadi"],"Massa kg da, og'irlik N da o'lchanadi, ular turli kattaliklar."],
    [2,"Jismning massasini o'lchaydigan asbob qaysi?","Tarozi",["Dinamometr","Manometr","Spidometr"],"Tarozi massani o'lchaydi, dinamometr esa kuchni."],
    [2,"Tezlik vektori qaysi ikki kattalikdan iborat?","Modul va yo'nalishdan",["Massa va kuchdan","Vaqt va yo'ldan","Chuqurlik va zichlikdan"],"Vektor modul (kattalik) va yo'nalishdan tashkil topadi."],
    [2,"Impulsning saqlanish qonuni qaysi sharoitda o'rinli?","Tashqi kuch bo'lmaganda",["Ishqalanish katta bo'lganda","Massa nolga teng bo'lganda","Harakat tez bo'lganda"],"Tashqi kuch bo'lmasa, sistemaning umumiy impulsi saqlanadi."],
    [2,"Kuch olib tashlangach prujina boshlang'ich holatiga qaytsa, bu qanday deformatsiya?","Elastik deformatsiya",["Plastik deformatsiya","Doimiy deformatsiya","Issiqlik deformatsiyasi"],"Elastik deformatsiyada jism kuch olib tashlangach boshlang'ich holatga qaytadi."],
    [2,"1 atmosfera bosimi necha Paskalga teng?","101 325 Pa",["100 Pa","1013 Pa","10 000 Pa"],"Standart atmosfera bosimi 101 325 Pa ga teng."],
    [2,"Chang'i qanchalik keng bo'lsa, uning qorga beradigan bosimi qanday o'zgaradi?","Kamayadi",["Ortadi","O'zgarmaydi","Nolga teng"],"Keng yuza bosimni kamaytiradi, chunki p = F/S."],
    [2,"Erkin tushish tezlanishi Oyda Yerdagidan qanday?","Kichikroq",["Kattaroq","Teng","Nol"],"Oyda g ≈ 1,6 m/s², Yerdagidan taxminan 6 marta kichik."],
    [2,"Jism 4 s da tezligini 0 dan 20 m/s ga oshirsa, tezlanish qancha?","5 m/s²",["16 m/s²","80 m/s²","24 m/s²"],"a = Δv/t = 20/4 = 5 m/s²."],
    [3,"Butun olam tortishish qonunining formulasi qanday?","F = G·m₁·m₂/r²",["F = G·m₁·m₂·r²","F = G·m₁/m₂","F = m₁·m₂/G"],"Tortishish kuchi massalar ko'paytmasiga to'g'ri, masofa kvadratiga teskari proporsional."],
    [3,"Sayyora sirtidagi erkin tushish tezlanishi formulasi qanday?","g = G·M/R²",["g = G·M·R","g = G/M²","g = M/R"],"g = G·M/R², bu sayyora massasi va radiusiga bog'liq."],
    [3,"Yerdan uchinchi kosmik tezlik qanchaga yaqin?","16,7 km/s",["11,2 km/s","7,9 km/s","9,8 km/s"],"Uchinchi kosmik tezlik — Quyosh sistemasidan chiqib ketish uchun kerak bo'lgan tezlik, ≈ 16,7 km/s."],
    [3,"Aylanma harakatda markazga intilma tezlanish formulasi qanday?","a = v²/r",["a = v/r","a = v·r","a = r/v"],"Sentripetal tezlanish a = v²/r bilan aniqlanadi."],
    [3,"Matematik mayatnikning tebranish davri formulasi qanday?","T = 2π·√(l/g)",["T = 2π·√(g/l)","T = 2π·l·g","T = l/g"],"Matematik mayatnik davri T = 2π·√(l/g) ga teng."],
    [3,"Prujinali mayatnikning tebranish davri formulasi qanday?","T = 2π·√(m/k)",["T = 2π·√(k/m)","T = 2π·m·k","T = m/k"],"Prujinali mayatnik davri T = 2π·√(m/k) bilan topiladi."],
    [3,"Aylanma harakatda burchak tezligi (chiziqli tezlik orqali) qanday topiladi?","ω = v/r",["ω = v·r","ω = r/v","ω = v/r²"],"Burchak tezligi ω = v/r formula bilan aniqlanadi."],
    [3,"Tebranish davri va chastota orasidagi bog'lanish qanday?","T = 1/f",["T = f","T = f²","T = 1/f²"],"Davr chastotaga teskari kattalik: T = 1/f."],
    [3,"Chastotaning SI birligi qaysi?","Gers (Hz)",["Nyuton","Vatt","Paskal"],"Chastota Gerslarda o'lchanadi."],
    [3,"Erkin tushayotgan jismning (v₀=0) tezligi formulasi qanday?","v = g·t",["v = g/t","v = g·t²","v = t/g"],"Boshlang'ich tezliksiz erkin tushishda v = g·t."],
    [3,"Vertikal yuqoriga v₀ bilan otilgan jism boshlang'ich nuqtaga qaytib kelganda tezligi qancha?","v₀ ga",["0 ga","2·v₀ ga","v₀/2 ga"],"Havosiz muhitda jism xuddi shu tezlik bilan qaytadi."],
    [3,"Gorizontal otilgan jismning yerga tushish vaqti (h balandlikdan) formulasi qanday?","t = √(2h/g)",["t = √(h/g)","t = √(2g/h)","t = 2h/g"],"Vertikal harakatda h = g·t²/2, shu sabab t = √(2h/g)."],
    [3,"Vertikal yuqoriga otilgan jismning eng baland nuqtadagi tezligi qancha bo'ladi?","0 ga",["v₀ ga","2·v₀ ga","v₀/2 ga"],"Eng baland nuqtada tezlik vaqtincha nolga tenglashadi."],
    [3,"Ishqalanishsiz qiya tekislikda sirpanayotgan jismning tezlanishi qanday?","a = g·sinα",["a = g·cosα","a = g·sinα·cosα","a = g/sinα"],"Og'irlikning tekislik bo'ylab tashkil etuvchisi g·sinα ga teng."],
    [3,"Qiya tekislikdagi jismga ta'sir etuvchi normal reaksiya kuchi formulasi qanday?","N = m·g·cosα",["N = m·g·sinα","N = m·g","N = m·g/cosα"],"Normal reaksiya og'irlikning tekislikka perpendikulyar tashkil etuvchisi."],
    [3,"Geostatsionar sun'iy yo'ldoshning aylanish davri qancha?","24 soat",["1 soat","12 soat","48 soat"],"Geostatsionar yo'ldosh Yer bilan birga aylanadi, davri 24 soat."],
    [3,"Mutlaq elastik bo'lmagan to'qnashuvda nima saqlanadi?","Faqat impuls",["Faqat kinetik energiya","Impuls va kinetik energiya","Hech narsa"],"Elastik bo'lmagan to'qnashuvda impuls saqlanadi, kinetik energiya yo'qoladi."],
    [3,"Mutlaq elastik to'qnashuvda nima saqlanadi?","Impuls va kinetik energiya",["Faqat impuls","Faqat kinetik energiya","Hech narsa"],"Elastik to'qnashuvda ham impuls, ham kinetik energiya saqlanadi."],
    [3,"Vertikal yuqoriga v₀ bilan otilgan jismning eng baland nuqtaga ko'tarilish vaqti formulasi qanday?","t = v₀/g",["t = v₀·g","t = g/v₀","t = v₀/(2g)"],"Eng baland nuqtagacha v = v₀ − g·t = 0, shu sabab t = v₀/g."],
    [3,"Gorizontalga nisbatan otilgan jismning uchish masofasi qaysi burchakda maksimal?","45°",["30°","60°","90°"],"Havosiz muhitda eng katta uchish masofasi 45° burchakda erishiladi."],
    [3,"Aylanma harakatda burchak tezligi va davr orasidagi bog'lanish qanday?","ω = 2π/T",["ω = 2π·T","ω = T/2π","ω = π/T"],"Burchak tezligi ω = 2π/T formula bilan topiladi."],
    [3,"Aylana orbitada harakatlanayotgan sun'iy yo'ldosh tezligi formulasi qanday?","v = √(G·M/r)",["v = G·M·r","v = G·M/r","v = √(G·M/r²)"],"Orbital tezlik v = √(G·M/r) formula bilan aniqlanadi."],
    [3,"Sayyora radiusi oshsa, uning sirtidagi erkin tushish tezlanishi qanday o'zgaradi?","Kamayadi",["Ortadi","O'zgarmaydi","Nolga aylanadi"],"g = G·M/R², radius oshsa tezlanish kamayadi."]
  ]);
  function P1(L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 3, 4], [11, 12, 13, 14, 15, 16]));
    var v, t, s, m, a, F, p, kmh, ms, v0, v1, Sx, F1, F2, sm, Ff, h;
    if (k === 0) { v = R(2, 25); t = R(4, 40); s = v * t;
      return NQ("Jism " + s + " m masofani " + t + " s da tekis bosib o'tdi. Uning tezligi necha m/s?", v, "m/s", [s * t, v * 2, v / 2, v + R(1, 3)], ["v = s / t = " + s + " : " + t + " = " + v + " m/s"]); }
    if (k === 1) { v = pick([40, 50, 60, 70, 80, 90, 100]); t = R(2, 6); s = v * t;
      return NQ("Avtomobil " + v + " km/soat tezlik bilan " + t + " soat yurdi. U necha km yo'l bosdi?", s, "km", [v / t, v + t, s * 2, s / 2], ["s = v · t = " + v + " · " + t + " = " + s + " km"]); }
    if (k === 2) { v = pick([4, 5, 6, 10, 12, 15, 20]); t = R(2, 6); s = v * t;
      return NQ("Velosipedchi " + s + " km yo'lni " + v + " km/soat tezlik bilan necha soatda bosib o'tadi?", t, "soat", [s * v, s - v, t + 1, t * 2], ["t = s / v = " + s + " : " + v + " = " + t + " soat"]); }
    if (k === 3) { kmh = pick([18, 36, 54, 72, 90, 108, 126, 144]); ms = kmh * 5 / 18;
      return NQ("Tezlik " + kmh + " km/soat. Uni m/s da ifodalang.", ms, "m/s", [kmh, kmh * 3.6, kmh / 10, ms * 2], ["1 km/soat = 1000 m : 3600 s = 1/3.6 m/s", kmh + " : 3.6 = " + ms + " m/s"]); }
    if (k === 4) { ms = pick([5, 10, 15, 20, 25, 30, 35, 40]); kmh = ms * 18 / 5;
      return NQ("Tezlik " + ms + " m/s. Uni km/soat da ifodalang.", kmh, "km/soat", [ms, ms / 3.6, kmh / 2, kmh + 18], ["1 m/s = 3.6 km/soat", ms + " · 3.6 = " + kmh + " km/soat"]); }
    if (k === 5) { m = R(2, 80);
      return NQ("Massasi " + m + " kg bo'lgan jismga ta'sir etuvchi og'irlik kuchi necha N? (g = 10 N/kg)", m * 10, "N", [m, m / 10, m * 100, m + 10], ["F = m · g = " + m + " · 10 = " + m * 10 + " N"]); }
    if (k === 6) { v0 = R(0, 10); a = R(1, 5); t = R(2, 10); v1 = v0 + a * t;
      return NQ((v0 ? "Avtomobil tezligi " + t + " s da " + v0 + " m/s dan " + v1 + " m/s gacha ortdi." : "Avtomobil tinch holatdan " + t + " s da " + v1 + " m/s tezlikka erishdi.") + " Tezlanishi necha m/s²?", a, "m/s²",
        [v0 ? v1 / t : v1, (v1 - v0) * t, a + 1, a * 2], ["a = (v − v₀) / t = (" + v1 + " − " + v0 + ") : " + t + " = " + a + " m/s²"]); }
    if (k === 7) { m = pick([2, 4, 5, 10, 20, 50, 100, 500, 1000, 1200, 1500]); a = pick([0.5, 1.5, 2, 3, 4, 5]); F = m * a;
      return NQ("Massasi " + m + " kg bo'lgan jismga " + a + " m/s² tezlanish berish uchun necha N kuch kerak?", F, "N", [m / a, m + a, F * 10, F / 2], ["F = m · a = " + m + " · " + a + " = " + f(F) + " N"]); }
    if (k === 8) { do { F = pick([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]); Sx = pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.5, 2]); p = F / Sx; } while (Math.abs(p - Math.round(p)) > 1e-6);
      return NQ(F + " N kuch " + Sx + " m² yuzaga tik ta'sir qilmoqda. Hosil bo'lgan bosim necha Pa?", Math.round(p), "Pa", [F * Sx, p * 10, p / 10, p / 100], ["p = F / S = " + F + " : " + Sx + " = " + Math.round(p) + " Pa"]); }
    if (k === 9) { m = R(2, 90);
      return NQ("Jismning og'irligi " + m * 10 + " N. Uning massasi necha kg? (g = 10 N/kg)", m, "kg", [m * 100, m * 10, m * 2, m + 10], ["m = P / g = " + m * 10 + " : 10 = " + m + " kg"]); }
    if (k === 10) { F1 = R(10, 60); F2 = R(2, F1 - 2); var same = R(0, 1), Rz = same ? F1 + F2 : F1 - F2;
      return NQ("Jismga bir to'g'ri chiziq bo'ylab " + (same ? "bir xil" : "qarama-qarshi") + " yo'nalgan " + F1 + " N va " + F2 + " N kuchlar ta'sir qilmoqda. Teng ta'sir etuvchi kuch necha N?", Rz, "N",
        [same ? F1 - F2 : F1 + F2, F1 * F2, F1, (F1 + F2) / 2], [same ? "Bir yo'nalishda: R = F₁ + F₂ = " + Rz + " N" : "Qarama-qarshi: R = F₁ − F₂ = " + F1 + " − " + F2 + " = " + Rz + " N"]); }
    if (k === 11) { do { m = pick([40, 45, 48, 50, 54, 60, 64, 72, 75, 80]); sm = pick([150, 200, 250, 300, 400, 480, 500, 600]); } while ((m * 1000) % sm !== 0);
      p = m * 100 / sm;
      return NQ("Massasi " + m + " kg odam tik turibdi, poyabzallarining tayanch yuzasi jami " + sm + " sm². Uning polga bosimi necha kPa? (g = 10 N/kg)", p, "kPa", [p / 10, p * 10, p * 100, p * 2],
        ["S = " + sm + " sm² = " + f(sm / 10000) + " m², F = m·g = " + m * 10 + " N", "p = F / S = " + f(p * 1000) + " Pa = " + f(p) + " kPa"]); }
    if (k === 12) { v0 = R(1, 15); a = R(1, 4); t = R(2, 10); v = v0 + a * t;
      return NQ("Jism " + v0 + " m/s boshlang'ich tezlik bilan harakatlanib, " + a + " m/s² tezlanish oldi. " + t + " s dan keyin tezligi necha m/s bo'ladi?", v, "m/s", [v0 + a, a * t, v0 * a * t, v0 + a * t * t], ["v = v₀ + a·t = " + v0 + " + " + a + " · " + t + " = " + v + " m/s"]); }
    if (k === 13) { v0 = R(0, 10); a = pick([2, 4, 6]); t = R(2, 8); s = v0 * t + a * t * t / 2;
      return NQ("Jism " + (v0 ? v0 + " m/s boshlang'ich tezlik bilan" : "tinch holatdan") + " " + a + " m/s² tezlanish bilan harakatlanmoqda. " + t + " s da necha metr yo'l bosadi?", s, "m",
        [v0 * t + a * t * t, v0 * t, v0 ? a * t * t / 2 : a * t, (v0 + a * t) * t], ["s = v₀t + at²/2 = " + v0 + " · " + t + " + " + a + " · " + t + "² : 2 = " + s + " m"]); }
    if (k === 14) { kmh = pick([36, 54, 72, 90, 108]); ms = kmh * 5 / 18; t = R(5, 30); s = ms * t;
      return NQ("Avtomobil " + kmh + " km/soat tezlik bilan " + t + " s yurdi. U necha metr yo'l bosdi?", s, "m", [kmh * t, s * 2, ms + t, s / 2], [kmh + " km/soat = " + ms + " m/s", "s = v · t = " + ms + " · " + t + " = " + s + " m"]); }
    if (k === 15) { m = pick([2, 4, 5, 10, 20]); a = R(1, 5); Ff = m * R(1, 4); F = m * a + Ff;
      return NQ("Massasi " + m + " kg aravachani " + F + " N kuch bilan tortishmoqda, ishqalanish kuchi " + Ff + " N. Aravachaning tezlanishi necha m/s²?", a, "m/s²", [F / m, (F + Ff) / m, F - Ff, a + 1], ["a = (F − Fishq) / m = (" + F + " − " + Ff + ") : " + m + " = " + a + " m/s²"]); }
    t = R(1, 6); h = 5 * t * t;
    return NQ("Jism tinch holatdan erkin tushmoqda (g = 10 m/s², havo qarshiligi yo'q). U " + t + " s da necha metr masofani o'tadi?", h, "m", [10 * t * t, 10 * t, 5 * t, 5 * (t + 1) * (t + 1)], ["h = g·t²/2 = 10 · " + t + "² : 2 = " + h + " m"]);
  }
  S.register("f1", mix(B1, P1, 0.4), "Fizika · Mexanika: tezlik, kuch, bosim");

  /* ================= f2 Ish, quvvat va energiya ================= */
  var B2 = bank([
    [1, "Mexanik ishning SI dagi birligi qaysi?", "Joul (J)", ["Vatt (Vt)", "Nyuton (N)", "Paskal (Pa)"], "1 J = 1 N · 1 m."],
    [1, "Quvvatning SI dagi birligi qaysi?", "Vatt (Vt)", ["Joul (J)", "Nyuton (N)", "Amper (A)"], "1 Vt = 1 J/s."],
    [1, "Harakatlanayotgan jism qanday mexanik energiyaga ega?", "Kinetik energiya", ["Potensial energiya", "Issiqlik miqdori", "Bosim"], "Harakat energiyasi — kinetik energiya."],
    [1, "Yerdan ko'tarilgan jism qanday mexanik energiyaga ega?", "Potensial energiya", ["Kinetik energiya", "Elektr energiya", "Yorug'lik energiyasi"], "Ep = m·g·h."],
    [1, "Jism kuch ta'sirida joyidan siljimasa (s = 0), mexanik ish qancha bo'ladi?", "Nolga teng", ["Kuchga teng", "Massaga teng", "Cheksiz katta"], "A = F·s, s = 0 ⇒ A = 0."],
    [1, "1 kJ necha joul?", "1000 J", ["100 J", "10 J", "1 000 000 J"], "kilo = 1000."],
    [1, "1 kVt necha vatt?", "1000 Vt", ["100 Vt", "10 Vt", "1 000 000 Vt"], "kilo = 1000."],
    [1, "Quvvat formulasi qaysi?", "N = A/t", ["N = A·t", "N = F·s", "N = m·g"], "Quvvat — vaqt birligida bajarilgan ish."],
    [1, "Mexanik ish formulasi qaysi?", "A = F·s", ["A = F/s", "A = m·a", "A = F·t"], "Ish = kuch · yo'l."],
    [1, "Kinetik energiya formulasi qaysi?", "Ek = m·v²/2", ["Ek = m·v", "Ek = m·g·h", "Ek = m·v/2"], "Ek = m·v²/2."],
    [2, "Ishqalanish bo'lmaganda yopiq sistemaning to'liq mexanik energiyasi qanday o'zgaradi?", "O'zgarmaydi", ["Ortadi", "Kamayadi", "Nolga teng bo'ladi"], "Mexanik energiyaning saqlanish qonuni: Ek + Ep = const."],
    [2, "Erkin tushayotgan jismda energiya qanday aylanadi?", "Potensial → kinetik", ["Kinetik → potensial", "Elektr → kinetik", "Kinetik → kimyoviy"], "Balandlik kamayadi, tezlik ortadi."],
    [2, "Jism tezligi 2 marta ortsa, kinetik energiyasi qanday o'zgaradi?", "4 marta ortadi", ["2 marta ortadi", "8 marta ortadi", "O'zgarmaydi"], "Ek ~ v²."],
    [2, "Tezlik o'zgarmay, massa 3 marta ortsa, kinetik energiya qanday o'zgaradi?", "3 marta ortadi", ["9 marta ortadi", "O'zgarmaydi", "3 marta kamayadi"], "Ek ~ m."],
    [2, "Jism balandligi 2 marta ortsa, potensial energiyasi qanday o'zgaradi?", "2 marta ortadi", ["4 marta ortadi", "O'zgarmaydi", "2 marta kamayadi"], "Ep ~ h."],
    [2, "Real mexanizmning foydali ish koeffitsienti (FIK) qanday bo'ladi?", "100% dan kichik", ["100% dan katta", "Aniq 100%", "Doim 50%"], "Ishqalanish tufayli foydali ish sarflangan ishdan kichik."],
    [2, "Oddiy mexanizmlar ishdan yutuq beradimi?", "Yo'q, ishdan yutuq bermaydi", ["Ha, 2 marta", "Ha, 4 marta", "Faqat richag beradi"], "Mexanikaning oltin qoidasi: kuchdan yutsak, yo'ldan yutqazamiz."],
    [2, "Qo'zg'aluvchan blok kuchdan necha marta yutuq beradi?", "2 marta", ["Yutuq bermaydi", "3 marta", "4 marta"], "Qo'zg'aluvchan blok kuchdan 2 marta yutuq beradi."],
    [2, "Qo'zg'almas blok nima beradi?", "Kuch yo'nalishini o'zgartiradi", ["Kuchdan 2 marta yutuq", "Ishdan yutuq", "Yo'ldan yutuq"], "Qo'zg'almas blok faqat yo'nalishni o'zgartiradi."],
    [2, "Richagning muvozanat sharti qaysi?", "F₁·l₁ = F₂·l₂", ["F₁ + F₂ = l₁ + l₂", "F₁/l₁ = F₂/l₂", "F₁·F₂ = l₁·l₂"], "Kuch momentlari teng: F₁l₁ = F₂l₂."],
    [3, "Cho'zilgan prujinaning potensial energiyasi formulasi qaysi?", "E = k·x²/2", ["E = k·x", "E = m·g·h", "E = m·v²/2"], "Elastik deformatsiya energiyasi E = kx²/2."],
    [3, "1 kVt·soat necha joul?", "3.6·10⁶ J", ["1000 J", "3600 J", "3.6·10³ J"], "1000 Vt · 3600 s = 3 600 000 J."],
    [3, "Kuch jism harakatiga qarama-qarshi yo'nalsa, uning ishi qanday bo'ladi?", "Manfiy", ["Musbat", "Nolga teng", "Cheksiz"], "A = F·s·cos 180° = −F·s."],
    [3, "Kuch ko'chishga perpendikulyar bo'lsa, bajarilgan ish qancha?", "Nolga teng", ["F·s ga teng", "Maksimal", "Manfiy"], "cos 90° = 0 ⇒ A = 0."],
    [3, "Kuch ko'chish bilan α burchak hosil qilsa, ish formulasi qaysi?", "A = F·s·cos α", ["A = F·s·sin α", "A = F·s·tg α", "A = F·cos α / s"], "Ishni kuchning ko'chish yo'nalishidagi tashkil etuvchisi bajaradi."],
    [3, "Tekis harakatda quvvatni tezlik orqali ifodalovchi formula qaysi?", "N = F·v", ["N = F/v", "N = m·v", "N = F·v²"], "N = A/t = F·s/t = F·v."],
    [3, "Ishqalanish kuchining ishi mexanik energiyani nimaga aylantiradi?", "Ichki (issiqlik) energiyaga", ["Potensial energiyaga", "Kinetik energiyaga", "Elektr energiyaga"], "Ishqalanishda jismlar qiziydi."],
    [3, "Noelastik to'qnashuvda qaysi kattalik saqlanadi?", "Impuls", ["Kinetik energiya", "Tezlik", "Hech narsa"], "Impuls saqlanadi, kinetik energiyaning bir qismi ichki energiyaga o'tadi."],
    [3, "v tezlik bilan tik yuqoriga otilgan jismning maksimal balandligi formulasi qaysi?", "h = v²/(2g)", ["h = v/(2g)", "h = 2g/v²", "h = v·g"], "m·v²/2 = m·g·h ⇒ h = v²/(2g)."],
    [3, "Kuch momenti formulasi qaysi?", "M = F·l", ["M = F/l", "M = m·v", "M = F·t"], "Kuch momenti = kuch · yelka."],
    [1,"Kinetik va potensial energiyalarning yig'indisi nima deb ataladi?","To'liq mexanik energiya",["Ichki energiya","Yadro energiyasi","Elektr energiyasi"],"Jismning kinetik va potensial energiyalari yig'indisi uning to'liq mexanik energiyasidir."],
    [1,"4 N kuch ta'sirida jism kuch yo'nalishida 5 m siljidi. Kuchning bajargan ishi qancha?","20 J",["9 J","1,25 J","40 J"],"A = F·s = 4 N · 5 m = 20 J."],
    [1,"100 J ish 10 s da bajarilgan bo'lsa, quvvat qancha?","10 Vt",["1000 Vt","110 Vt","0,1 Vt"],"N = A/t = 100 J / 10 s = 10 Vt."],
    [1,"Quvvat birligi «vatt» qaysi olim nomi bilan atalgan?","Jeyms Vatt",["Jeyms Joul","Isaak Nyuton","Blez Paskal"],"Bug' mashinasini takomillashtirgan Jeyms Vatt sharafiga quvvat birligi vatt deb nomlangan."],
    [1,"Ish va energiya birligi «joul» qaysi olim nomi bilan atalgan?","Jeyms Joul",["Jeyms Vatt","Aleksandro Volta","Genrix Gers"],"Ingliz fizigi Jeyms Joul sharafiga ish va energiya birligi joul deb nomlangan."],
    [1,"1 MJ (megajoul) necha joulga teng?","1 000 000 J",["1000 J","100 000 J","10 000 000 J"],"Mega old qo'shimchasi million (10⁶) ni bildiradi."],
    [1,"Energiyaning saqlanish qonuniga ko'ra, energiya yo'qolmaydi, balki faqat...","bir turdan boshqasiga aylanadi",["butunlay yo'qoladi","o'z-o'zidan ortib boradi","faqat issiqlikka aylanadi"],"Energiya yo'qdan paydo bo'lmaydi va yo'qolmaydi, u bir turdan boshqasiga o'tadi."],
    [1,"Quyidagilardan qaysi birida kinetik energiya mavjud?","Yugurayotgan bola",["Stol ustidagi kitob","Yerda yotgan tosh","Devorga osilgan rasm"],"Kinetik energiya faqat harakatlanayotgan jismga xos."],
    [1,"Siqilgan prujina qanday energiyaga ega?","Elastik deformatsiya potensial energiyasiga",["Faqat kinetik energiyaga","Yadro energiyasiga","Hech qanday energiyaga ega emas"],"Deformatsiyalangan jism o'z shakli tiklanganda ish bajara oladi, demak potensial energiyaga ega."],
    [1,"Quyosh panelida yorug'lik energiyasi asosan qanday energiyaga aylantiriladi?","Elektr energiyaga",["Mexanik energiyaga","Yadro energiyasiga","Kimyoviy energiyaga"],"Quyosh batareyasi yorug'lik energiyasini elektr energiyaga aylantiradi."],
    [1,"Gidroelektrostansiyada tushayotgan suvning mexanik energiyasi nimaga aylantiriladi?","Elektr energiyaga",["Yadro energiyasiga","Kimyoviy energiyaga","Yorug'lik energiyasiga"],"Suv turbinani aylantiradi, turbina esa generator orqali elektr energiya hosil qiladi."],
    [1,"Ish formulasi A = F·s dan kuchni qaysi formula bilan topish mumkin?","F = A/s",["F = A·s","F = s/A","F = A + s"],"A = F·s tenglikning ikki tomonini s ga bo'lsak, F = A/s hosil bo'ladi."],
    [1,"Quvvati 50 Vt bo'lgan asbob 2 s da qancha energiya sarflaydi?","100 J",["25 J","52 J","50 J"],"A = N·t = 50 Vt · 2 s = 100 J."],
    [1,"Massasi 5 kg bo'lgan jism 2 m/s tezlik bilan harakatlanmoqda. Uning kinetik energiyasi qancha?","10 J",["5 J","20 J","50 J"],"Ek = m·v²/2 = 5 · 4 / 2 = 10 J."],
    [1,"Ishning bajarilish tezligini ifodalovchi fizik kattalik qaysi?","Quvvat",["Kuch","Bosim","Impuls"],"Quvvat vaqt birligida bajarilgan ishga teng."],
    [1,"Massasi 1 kg bo'lgan jism 10 m balandlikda turibdi. Yer sirtiga nisbatan potensial energiyasi qancha? (g = 10 m/s²)","100 J",["10 J","1 J","1000 J"],"Ep = m·g·h = 1 · 10 · 10 = 100 J."],
    [1,"Metrik 1 ot kuchi taxminan necha vattga teng?","735 Vt",["100 Vt","500 Vt","1000 Vt"],"1 metrik ot kuchi taxminan 735,5 Vt ga teng."],
    [1,"Mexanik ish bajarilishi uchun qaysi ikki shart birgalikda bajarilishi kerak?","Kuch ta'sir etishi va jism ko'chishi",["Jism massasi va hajmi bo'lishi","Vaqt va harorat bo'lishi","Tezlik va zichlik bo'lishi"],"Ish kuch va kuch ta'sirida bo'lgan ko'chish ko'paytmasi bilan aniqlanadi."],
    [1,"1 joul qaysi ifodaga teng?","1 N·m",["1 N/m","1 kg·m","1 Pa·s"],"A = F·s bo'lgani uchun 1 J = 1 N · 1 m."],
    [1,"1 vatt qaysi ifodaga teng?","1 J/s",["1 J·s","1 N/s","1 kg/s"],"N = A/t bo'lgani uchun 1 Vt = 1 J / 1 s."],
    [1,"Tinch turgan jismning kinetik energiyasi qancha?","Nolga teng",["Massasiga teng","Birga teng","Cheksiz katta"],"Ek = m·v²/2 formulada v = 0 bo'lsa, Ek = 0."],
    [1,"Nol sath yer sirti deb olinsa, yer sirtida yotgan jismning potensial energiyasi qancha?","Nolga teng",["Eng katta qiymatga teng","Massasiga teng","Manfiy"],"Ep = m·g·h formulada h = 0 bo'lsa, Ep = 0."],
    [1,"Massasi 2 kg bo'lgan jism 10 m/s tezlik bilan uchmoqda. Uning kinetik energiyasi qancha?","100 J",["20 J","200 J","50 J"],"Ek = m·v²/2 = 2 · 100 / 2 = 100 J."],
    [2,"Massasi 60 kg bo'lgan bola 3 m balandlikka ko'tarildi. Uning potensial energiyasi qanchaga ortdi? (g = 10 m/s²)","1800 J",["180 J","600 J","18 000 J"],"ΔEp = m·g·h = 60 · 10 · 3 = 1800 J."],
    [2,"Quvvati 2 kVt bo'lgan dvigatel 30 s davomida qancha ish bajaradi?","60 kJ",["15 kJ","6 kJ","600 kJ"],"A = N·t = 2000 Vt · 30 s = 60 000 J = 60 kJ."],
    [2,"Kran massasi 500 kg bo'lgan yukni 10 m balandlikka ko'tardi. Bajarilgan ish qancha? (g = 10 m/s²)","50 kJ",["5 kJ","500 kJ","5 MJ"],"A = m·g·h = 500 · 10 · 10 = 50 000 J = 50 kJ."],
    [2,"Quvvati 400 Vt bo'lgan asbob 5 daqiqa ishlasa, qancha ish bajaradi?","120 kJ",["2 kJ","20 kJ","12 kJ"],"5 daqiqa = 300 s, A = 400 · 300 = 120 000 J = 120 kJ."],
    [2,"Avtomobil 36 km/soat tezlik bilan tekis harakatlanmoqda, tortish kuchi 3 kN. Dvigatel quvvati qancha?","30 kVt",["108 kVt","3 kVt","300 kVt"],"v = 10 m/s, N = F·v = 3000 · 10 = 30 000 Vt = 30 kVt."],
    [2,"Massasi 3 kg bo'lgan jism 4 m/s tezlik bilan harakatlanmoqda. Uning kinetik energiyasi qancha?","24 J",["12 J","48 J","6 J"],"Ek = m·v²/2 = 3 · 16 / 2 = 24 J."],
    [2,"Mexanizmning foydali ish koeffitsienti (FIK) qaysi formula bilan topiladi?","η = (A foydali / A to'liq) · 100%",["η = (A to'liq / A foydali) · 100%","η = A foydali · A to'liq","η = A foydali − A to'liq"],"FIK foydali ishning to'liq (sarflangan) ishga nisbatiga teng."],
    [2,"Mexanizm 100 J ish sarflab, 80 J foydali ish bajardi. Uning FIK qancha?","80%",["20%","125%","180%"],"η = 80 / 100 · 100% = 80%."],
    [2,"Jism 20 m balandlikdan erkin tushmoqda. Yerga urilish tezligi qancha? (g = 10 m/s², havo qarshiligi hisobga olinmasin)","20 m/s",["10 m/s","40 m/s","200 m/s"],"m·g·h = m·v²/2 dan v = √(2·10·20) = 20 m/s."],
    [2,"Jism massasi 2 marta kamaytirilib, tezligi 2 marta orttirilsa, kinetik energiyasi qanday o'zgaradi?","2 marta ortadi",["4 marta ortadi","O'zgarmaydi","2 marta kamayadi"],"Ek ~ m·v²: (1/2)·4 = 2 marta ortadi."],
    [2,"Kilovatt-soat (kVt·soat) qaysi fizik kattalikning birligi?","Energiya (ish)",["Quvvat","Kuch","Vaqt"],"kVt·soat quvvat bilan vaqt ko'paytmasi, ya'ni energiya birligidir."],
    [2,"Massasi 0,5 kg bo'lgan jism 4 m balandlikda turibdi. Potensial energiyasi qancha? (g = 10 m/s²)","20 J",["2 J","200 J","40 J"],"Ep = m·g·h = 0,5 · 10 · 4 = 20 J."],
    [2,"Qo'zg'aluvchan blok kuchdan 2 marta yutuq bersa, yo'lda qanday o'zgarish bo'ladi?","Yo'lda 2 marta yutqazamiz",["Yo'lda 2 marta yutamiz","Yo'l o'zgarmaydi","Yo'lda 4 marta yutqazamiz"],"Mexanikaning oltin qoidasiga ko'ra kuchdan necha marta yutsak, yo'lda shuncha marta yutqazamiz."],
    [2,"Ishqalanishsiz qiya tekislikning balandligi 1 m, uzunligi 4 m. U kuchdan necha marta yutuq beradi?","4 marta",["2 marta","3 marta","8 marta"],"Kuchdan yutuq tekislik uzunligining balandligiga nisbatiga teng: 4/1 = 4."],
    [2,"Velosipedchi 5 m/s tezlik bilan tekis harakatlanmoqda, qarshilik kuchi 20 N. Uning quvvati qancha?","100 Vt",["25 Vt","4 Vt","10 Vt"],"N = F·v = 20 · 5 = 100 Vt."],
    [2,"Jismning tezligi 3 marta ortsa, kinetik energiyasi necha marta ortadi?","9 marta",["3 marta","6 marta","27 marta"],"Ek tezlik kvadratiga to'g'ri proporsional: 3² = 9."],
    [2,"Ishqalanishsiz tebranayotgan mayatnik eng quyi nuqtadan o'tayotganda qanday energiyaga ega bo'ladi?","Kinetik energiyasi eng katta bo'ladi",["Potensial energiyasi eng katta bo'ladi","Kinetik energiyasi nolga teng bo'ladi","Energiyasi butunlay yo'qoladi"],"Quyi nuqtada tezlik maksimal, potensial energiya esa minimal."],
    [2,"Tik yuqoriga otilgan jism eng yuqori nuqtada (havo qarshiligisiz) qanday mexanik energiyaga ega?","Faqat potensial energiyaga",["Faqat kinetik energiyaga","Ikkala energiyasi ham nolga teng","Kinetik energiyasi eng katta"],"Eng yuqori nuqtada tezlik nolga teng, shuning uchun butun energiya potensial."],
    [2,"5 kN kuch ta'sirida jism kuch yo'nalishida 20 m siljidi. Bajarilgan ish qancha?","100 kJ",["25 kJ","10 kJ","1 MJ"],"A = F·s = 5000 · 20 = 100 000 J = 100 kJ."],
    [2,"Quvvati 10 kVt bo'lgan dvigatel 20 s ishlasa, qancha ish bajaradi?","200 kJ",["2 kJ","20 kJ","500 J"],"A = N·t = 10 000 · 20 = 200 000 J = 200 kJ."],
    [2,"Nasos massasi 50 kg suvni 6 m balandlikka 10 s da ko'tardi. Quvvati qancha? (g = 10 m/s²)","300 Vt",["30 Vt","3000 Vt","500 Vt"],"A = 50 · 10 · 6 = 3000 J, N = 3000 / 10 = 300 Vt."],
    [2,"Massasi 1000 kg bo'lgan avtomobil 36 km/soat tezlik bilan ketmoqda. Kinetik energiyasi qancha?","50 kJ",["500 kJ","5 kJ","18 kJ"],"v = 10 m/s, Ek = 1000 · 100 / 2 = 50 000 J = 50 kJ."],
    [2,"Kinetik energiyasi 50 J bo'lgan jismning tezligi 2 marta kamaysa, energiyasi qancha bo'ladi?","12,5 J",["25 J","6,25 J","100 J"],"Ek tezlik kvadratiga bog'liq: 50 / 4 = 12,5 J."],
    [3,"Jismning kinetik energiyasi impuls p va massa m orqali qaysi formula bilan ifodalanadi?","Ek = p²/(2m)",["Ek = p²·m/2","Ek = p/(2m)","Ek = 2p²/m"],"Ek = m·v²/2 va p = m·v dan Ek = p²/(2m) kelib chiqadi."],
    [3,"Kinetik energiya haqidagi teoremaga ko'ra, jismga ta'sir etuvchi kuchlar teng ta'sir etuvchisining ishi nimaga teng?","Kinetik energiyaning o'zgarishiga",["Potensial energiyaning o'zgarishiga","Impulsning o'zgarishiga","Quvvatning o'zgarishiga"],"A = Ek₂ − Ek₁, ya'ni ish kinetik energiya o'zgarishiga teng."],
    [3,"Massasi 2 kg bo'lgan jism tezligi 10 m/s dan 20 m/s gacha ortdi. Kinetik energiyasi qanchaga o'zgardi?","300 J",["100 J","200 J","400 J"],"ΔEk = (2/2)·(400 − 100) = 300 J."],
    [3,"Bikrligi 200 N/m bo'lgan prujina 0,1 m siqildi. Uning potensial energiyasi qancha?","1 J",["10 J","20 J","0,1 J"],"E = k·x²/2 = 200 · 0,01 / 2 = 1 J."],
    [3,"Prujinaning cho'zilishi 2 marta orttirilsa, uning potensial energiyasi qanday o'zgaradi?","4 marta ortadi",["2 marta ortadi","8 marta ortadi","O'zgarmaydi"],"E = k·x²/2, ya'ni E cho'zilish kvadratiga proporsional."],
    [3,"Quvvati 2 kVt bo'lgan asbob 1 soat ishlasa, qancha energiya sarflaydi?","7,2·10⁶ J",["3,6·10⁶ J","2·10³ J","7,2·10³ J"],"2 kVt·soat = 2 · 3,6·10⁶ J = 7,2·10⁶ J."],
    [3,"Massasi 0,5 kg jism 45 m balandlikdan erkin tushmoqda. Yerga urilish paytidagi kinetik energiyasi qancha? (g = 10 m/s²)","225 J",["22,5 J","450 J","112,5 J"],"Ek = m·g·h = 0,5 · 10 · 45 = 225 J."],
    [3,"Kuch 60° burchak ostida ko'chish yo'nalishiga qo'yilgan. F = 10 N, s = 4 m bo'lsa, ish qancha?","20 J",["40 J","34,6 J","10 J"],"A = F·s·cos60° = 10 · 4 · 0,5 = 20 J."],
    [3,"Kuchning ko'chishga bog'liqlik grafigida (F–s) mexanik ish nimaga teng?","Grafik ostidagi yuzaga",["Grafikning og'ish burchagiga","Grafikning eng baland nuqtasiga","Grafikning uzunligiga"],"O'zgaruvchan kuchning ishi F–s grafigi bilan o'q orasidagi yuzaga teng."],
    [3,"Absolyut elastik to'qnashuvda impuls bilan birga yana qaysi kattalik saqlanadi?","Kinetik energiya",["Faqat potensial energiya","Faqat massa","Faqat kuch momenti"],"Elastik to'qnashuvda sistemaning impulsi ham, kinetik energiyasi ham saqlanadi."],
    [3,"Massasi 2 kg, tezligi 6 m/s bo'lgan jism tinch turgan 4 kg massali jismga yopishib qoldi. Ularning umumiy tezligi qancha?","2 m/s",["1 m/s","3 m/s","4 m/s"],"Impulsning saqlanishi: 2·6 = (2 + 4)·v, bundan v = 2 m/s."],
    [3,"Massasi 5 kg jism gorizontal sirtda 4 m siljidi, ishqalanish koeffitsienti 0,2. Ishqalanish kuchining ishi qancha? (g = 10 m/s²)","−40 J",["40 J","−4 J","−10 J"],"F = μ·m·g = 0,2·5·10 = 10 N, A = −F·s = −40 J."],
    [3,"Jism 20 m/s tezlik bilan tik yuqoriga otildi. Qanday balandlikda uning kinetik energiyasi potensial energiyasiga teng bo'ladi? (g = 10 m/s²)","10 m",["20 m","5 m","15 m"],"To'liq energiya m·200, Ek = Ep bo'lsa m·g·h = m·100, bundan h = 10 m."],
    [3,"Tik yuqoriga 30 m/s tezlik bilan otilgan jism qanday maksimal balandlikka ko'tariladi? (g = 10 m/s², havo qarshiligisiz)","45 m",["90 m","30 m","15 m"],"h = v²/(2g) = 900 / 20 = 45 m."],
    [3,"Massasi 20 kg yuk qiya tekislik bo'ylab 2 m balandlikka ko'tarildi. Tekislik uzunligi 5 m, tortish kuchi 100 N. FIK qancha? (g = 10 m/s²)","80%",["40%","125%","20%"],"A foydali = 20·10·2 = 400 J, A to'liq = 100·5 = 500 J, η = 80%."],
    [3,"Massasi 70 kg odam 10 m balandlikka 20 s da ko'tarildi. O'rtacha foydali quvvati qancha? (g = 10 m/s²)","350 Vt",["35 Vt","700 Vt","140 Vt"],"A = 70·10·10 = 7000 J, N = 7000 / 20 = 350 Vt."],
    [3,"Dvigatel quvvati 60 kVt, avtomobil tezligi 30 m/s. Tortish kuchi qancha?","2000 N",["200 N","1800 N","20 000 N"],"N = F·v dan F = 60 000 / 30 = 2000 N."],
    [3,"Jismning potensial energiyasi qiymati qanday tanlovga bog'liq?","Nol sathning tanlanishiga",["Jismning tezligiga","Havo haroratiga","Harakat trayektoriyasining shakliga"],"Potensial energiya nol sathga nisbatan aniqlanadi, uning o'zgarishi esa nol sathga bog'liq emas."],
    [3,"Og'irlik kuchining ishi nimaga bog'liq?","Boshlang'ich va oxirgi balandliklar farqiga",["Trayektoriya shakliga","Harakat tezligiga","Harakat davomiyligiga"],"Og'irlik kuchining ishi trayektoriyaga emas, faqat balandliklar farqiga bog'liq."],
    [3,"Massasi 1 kg, impulsi 4 kg·m/s bo'lgan jismning kinetik energiyasi qancha?","8 J",["16 J","4 J","2 J"],"Ek = p²/(2m) = 16 / 2 = 8 J."],
    [3,"Tinch holatdan 4 m/s tezlikkacha tezlashgan 2 kg massali jism ustida bajarilgan ish qancha?","16 J",["8 J","32 J","4 J"],"A = ΔEk = 2·16/2 − 0 = 16 J."],
    [3,"Massasi 4 marta ko'p, tezligi 2 marta kam bo'lgan jismning kinetik energiyasi dastlabkisiga nisbatan qanday?","O'zgarmaydi",["2 marta ortadi","4 marta ortadi","2 marta kamayadi"],"Ek ~ m·v²: 4 · (1/2)² = 1, ya'ni o'zgarmaydi."],
    [3,"Gorizontal yo'lda tekis harakatlanayotgan aravani 50 N kuch bilan 20 s da 100 m ga tortdi. Quvvat qancha?","250 Vt",["2500 Vt","25 Vt","100 Vt"],"A = 50 · 100 = 5000 J, N = 5000 / 20 = 250 Vt."],
    [3,"Mayatnik 0,2 m balandlikdan qo'yib yuborildi. Quyi nuqtadan o'tish tezligi qancha? (g = 10 m/s², ishqalanishsiz)","2 m/s",["4 m/s","1 m/s","0,4 m/s"],"v = √(2·g·h) = √(2·10·0,2) = 2 m/s."]
  ]);
  function P2(L) {
    var k = pick(lv(L, [0, 1, 2, 3], [4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14]));
    var F, s, A, N, t, m, h, v, E, eta, At, Af, kmh, ms, kk, x;
    if (k === 0) { F = R(2, 60) * 5; s = R(2, 25); A = F * s;
      return NQ("Jism " + F + " N kuch ta'sirida kuch yo'nalishida " + s + " m ko'chdi. Bajarilgan ish necha J?", A, "J", [F / s, F + s, A * 10, A / 2], ["A = F · s = " + F + " · " + s + " = " + A + " J"]); }
    if (k === 1) { N = R(2, 50) * 10; t = R(2, 20); A = N * t;
      return NQ("Dvigatel " + t + " s da " + A + " J ish bajardi. Uning quvvati necha Vt?", N, "Vt", [A * t, A - t, N * 2, N / 2], ["N = A / t = " + A + " : " + t + " = " + N + " Vt"]); }
    if (k === 2) { m = R(1, 30); h = R(2, 20); E = 10 * m * h;
      return NQ("Massasi " + m + " kg jism yerdan " + h + " m balandlikda turibdi. Uning potensial energiyasi necha J? (g = 10 N/kg)", E, "J", [m * h, E * 2, E / 2, 10 * (m + h)], ["Ep = m·g·h = " + m + " · 10 · " + h + " = " + E + " J"]); }
    if (k === 3) { m = pick([20, 50, 100, 200, 250, 500]); h = R(2, 15); A = 10 * m * h;
      return NQ("Kran " + m + " kg yukni " + h + " m balandlikka tekis ko'tardi. Bajarilgan ish necha J? (g = 10 N/kg)", A, "J", [m * h, A * 10, A / 2, 10 * m + h], ["F = m·g = " + 10 * m + " N", "A = F·h = " + 10 * m + " · " + h + " = " + A + " J"]); }
    if (k === 4) { m = pick([2, 4, 6, 8, 10, 20, 50, 60, 80]); v = R(2, 20); E = m * v * v / 2;
      return NQ("Massasi " + m + " kg jism " + v + " m/s tezlik bilan harakatlanmoqda. Uning kinetik energiyasi necha J?", E, "J", [m * v, m * v * v, m * v / 2, E + m], ["Ek = m·v²/2 = " + m + " · " + v + "² : 2 = " + E + " J"]); }
    if (k === 5) { F = pick([200, 500, 800, 1000, 1500, 2000, 3000]); v = R(2, 25); N = F * v;
      return NQ("Avtomobil " + v + " m/s tezlikda tekis harakatlanib, " + F + " N tortish kuchi hosil qilmoqda. Dvigatel quvvati necha Vt?", N, "Vt", [F / v, F + v, N * 10, N / 10], ["N = F · v = " + F + " · " + v + " = " + N + " Vt"]); }
    if (k === 6) { N = pick([0.5, 1, 1.5, 2, 3, 5]); t = pick([2, 5, 10, 20, 30]); A = N * 60 * t;
      return NQ("Quvvati " + N + " kVt bo'lgan dvigatel " + t + " minut ishladi. U necha kJ ish bajardi?", A, "kJ", [N * t, N * t * 1000, A / 10, A * 60], [N + " kVt = " + N * 1000 + " Vt, " + t + " min = " + t * 60 + " s", "A = N·t = " + f(A * 1000) + " J = " + f(A) + " kJ"]); }
    if (k === 7) { eta = pick([40, 50, 60, 75, 80, 90]); At = pick([200, 400, 500, 800, 1000, 1200, 2000, 4000]); Af = At * eta / 100;
      return NQ("Mexanizmga " + At + " J ish sarflandi, foydali ish " + Af + " J. Mexanizmning FIK necha foiz?", eta, "%", [Math.round(At / Af * 100), 100 - eta, eta + 10, eta / 2], ["η = A_f / A_s · 100% = " + Af + " : " + At + " · 100% = " + eta + "%"]); }
    if (k === 8) { m = R(1, 20); h = R(2, 15); E = 10 * m * h;
      return NQ("Massasi " + m + " kg jismning yerga nisbatan potensial energiyasi " + E + " J. U qanday balandlikda turibdi? (g = 10 N/kg, m da)", h, "m", [E / m, h * 10, h * 2, h + 5], ["h = Ep / (m·g) = " + E + " : " + 10 * m + " = " + h + " m"]); }
    if (k === 9) { v = pick([10, 20, 30, 40, 50, 60]); h = v * v / 20;
      return NQ("Jism " + h + " m balandlikdan erkin tushdi (g = 10 m/s², havo qarshiligi yo'q). Yerga urilish oldidagi tezligi necha m/s?", v, "m/s", [20 * h, v * 2, v / 2, v + 10], ["m·g·h = m·v²/2 ⇒ v = √(2gh)", "v = √(2 · 10 · " + h + ") = √" + 20 * h + " = " + v + " m/s"]); }
    if (k === 10) { v = pick([10, 20, 30, 40]); h = v * v / 20;
      return NQ("Jism yerdan tik yuqoriga " + v + " m/s tezlik bilan otildi (g = 10 m/s², havo qarshiligi yo'q). U necha metr balandlikka ko'tariladi?", h, "m", [v * v / 10, v * v, v / 2, h * 4], ["h = v²/(2g) = " + v + "² : 20 = " + h + " m"]); }
    if (k === 11) { m = pick([1000, 1200, 1600, 2000]); kmh = pick([36, 72, 108]); ms = kmh / 3.6; ms = Math.round(ms); E = m * ms * ms / 2000;
      return NQ("Massasi " + m + " kg avtomobil " + kmh + " km/soat tezlikda harakatlanmoqda. Uning kinetik energiyasi necha kJ?", E, "kJ", [m * kmh * kmh / 2000, E * 2, m * ms / 2000, E / 10], [kmh + " km/soat = " + ms + " m/s", "Ek = m·v²/2 = " + m + " · " + ms + "² : 2 = " + f(E * 1000) + " J = " + E + " kJ"]); }
    if (k === 12) { do { m = pick([10, 20, 40, 50, 60, 100]); h = pick([2, 3, 4, 5, 6, 10]); eta = pick([50, 60, 75, 80, 90]); Af = 10 * m * h; At = Af * 100 / eta; } while (At !== Math.round(At));
      return NQ("Yuk ko'targich " + m + " kg yukni " + h + " m balandlikka ko'tarib, " + At + " J ish sarfladi. Uning FIK necha foiz? (g = 10 N/kg)", eta, "%", [Math.round(At / Af * 100), eta / 10, 100 - eta, eta + 5],
        ["Foydali ish: A_f = m·g·h = " + Af + " J", "η = " + Af + " : " + At + " · 100% = " + eta + "%"]); }
    if (k === 13) { do { m = pick([50, 100, 200, 300, 500]); h = R(2, 12); t = pick([5, 10, 20, 25, 50]); N = 10 * m * h / t; } while (N !== Math.round(N));
      return NQ("Kran " + m + " kg yukni " + t + " s da " + h + " m balandlikka tekis ko'tardi. Kranning quvvati necha Vt? (g = 10 N/kg)", N, "Vt", [m * h / t, 10 * m * h, N * 2, N * t], ["A = m·g·h = " + 10 * m * h + " J", "N = A / t = " + 10 * m * h + " : " + t + " = " + N + " Vt"]); }
    kk = pick([100, 200, 400, 500, 1000]); x = pick([0.02, 0.05, 0.1, 0.2]); E = kk * x * x / 2;
    return NQ("Bikrligi " + kk + " N/m bo'lgan prujina " + x + " m ga cho'zildi. Uning potensial energiyasi necha J?", E, "J", [kk * x, kk * x * x, kk * x / 2, E * 10], ["E = k·x²/2 = " + kk + " · " + x + "² : 2 = " + f(E) + " J"]);
  }
  S.register("f2", mix(B2, P2, 0.4), "Fizika · Ish, quvvat va energiya");


  /* ================= f3 Elektr: Om qonuni, quvvat ================= */
  var B3 = bank([
    [1, "Tok kuchining SI dagi birligi qaysi?", "Amper (A)", ["Volt (V)", "Om", "Vatt (Vt)"], "Tok kuchi amperda o'lchanadi."],
    [1, "Kuchlanishning SI dagi birligi qaysi?", "Volt (V)", ["Amper (A)", "Om", "Joul (J)"], "Kuchlanish voltda o'lchanadi."],
    [1, "Elektr qarshilikning SI dagi birligi qaysi?", "Om", ["Volt (V)", "Amper (A)", "Kulon (Kl)"], "Qarshilik omda o'lchanadi."],
    [1, "Tok kuchini o'lchaydigan asbob qaysi?", "Ampermetr", ["Voltmetr", "Ommetr", "Dinamometr"], "Tok kuchi ampermetr bilan o'lchanadi."],
    [1, "Kuchlanishni o'lchaydigan asbob qaysi?", "Voltmetr", ["Ampermetr", "Barometr", "Manometr"], "Kuchlanish voltmetr bilan o'lchanadi."],
    [1, "Quyidagilardan qaysi biri elektr tokini yaxshi o'tkazadi?", "Mis", ["Rezina", "Shisha", "Plastmassa"], "Metallar — yaxshi o'tkazgichlar."],
    [1, "Quyidagilardan qaysi biri dielektrik (izolyator)?", "Rezina", ["Mis", "Alyuminiy", "Temir"], "Rezina tokni deyarli o'tkazmaydi."],
    [1, "Bir xil ishorali zaryadlar o'zaro qanday ta'sirlashadi?", "Itarishadi", ["Tortishadi", "Ta'sirlashmaydi", "Yo'qolib ketadi"], "Bir xil ishorali zaryadlar itarishadi, har xillari tortishadi."],
    [1, "Elektronning zaryadi qanday ishorali?", "Manfiy", ["Musbat", "Neytral", "Ba'zan musbat"], "Elektron — manfiy zaryadli zarra."],
    [1, "Om qonuni formulasi qaysi?", "I = U/R", ["I = U·R", "I = R/U", "U = I/R"], "Tok kuchi kuchlanishga to'g'ri, qarshilikka teskari proporsional."],
    [2, "Ampermetr zanjirga qanday ulanadi?", "Ketma-ket", ["Parallel", "Istalgancha", "Ulanmaydi"], "Ampermetr iste'molchi bilan ketma-ket ulanadi."],
    [2, "Voltmetr zanjirga qanday ulanadi?", "Parallel", ["Ketma-ket", "Istalgancha", "Ampermetr ichiga"], "Voltmetr iste'molchiga parallel ulanadi."],
    [2, "Ketma-ket ulangan o'tkazgichlarda qaysi kattalik bir xil bo'ladi?", "Tok kuchi", ["Kuchlanish", "Qarshilik", "Quvvat"], "Ketma-ket ulanishda I₁ = I₂ = I."],
    [2, "Parallel ulangan o'tkazgichlarda qaysi kattalik bir xil bo'ladi?", "Kuchlanish", ["Tok kuchi", "Qarshilik", "Zaryad"], "Parallel ulanishda U₁ = U₂ = U."],
    [2, "Elektr zaryadining SI dagi birligi qaysi?", "Kulon (Kl)", ["Amper (A)", "Volt (V)", "Om"], "1 Kl = 1 A · 1 s."],
    [2, "Elektr quvvati formulasi qaysi?", "P = U·I", ["P = U/I", "P = I/U", "P = U·R"], "P = U·I."],
    [2, "Metallarda elektr tokini qaysi zarralar hosil qiladi?", "Erkin elektronlar", ["Protonlar", "Musbat ionlar", "Neytronlar"], "Metallarda tok — erkin elektronlarning tartibli harakati."],
    [2, "Elektrolit eritmalarida tokni qaysi zarralar tashiydi?", "Ionlar", ["Faqat elektronlar", "Neytronlar", "Fotonlar"], "Eritmada musbat va manfiy ionlar harakatlanadi."],
    [2, "O'tkazgich uzunligi 2 marta ortsa, qarshiligi qanday o'zgaradi?", "2 marta ortadi", ["2 marta kamayadi", "4 marta ortadi", "O'zgarmaydi"], "R = ρ·l/S, R ~ l."],
    [2, "O'tkazgich ko'ndalang kesimi yuzi 2 marta ortsa, qarshiligi qanday o'zgaradi?", "2 marta kamayadi", ["2 marta ortadi", "4 marta kamayadi", "O'zgarmaydi"], "R = ρ·l/S, R ~ 1/S."],
    [2, "Elektr energiyasi hisoblagichi qaysi birlikda ko'rsatadi?", "kVt·soat", ["kVt", "Volt", "Amper"], "Iste'mol qilingan energiya kVt·soatda hisoblanadi."],
    [3, "O'tkazgich qarshiligining formulasi qaysi?", "R = ρ·l/S", ["R = ρ·S/l", "R = l/(ρ·S)", "R = ρ·l·S"], "ρ — solishtirma qarshilik, l — uzunlik, S — kesim yuzi."],
    [3, "Tokning issiqlik ta'siri (Joul−Lens qonuni) formulasi qaysi?", "Q = I²·R·t", ["Q = I·R·t", "Q = U·R·t", "Q = I²·t/R"], "Q = I²Rt."],
    [3, "Elektronning zaryadi moduli taxminan qancha?", "1.6·10⁻¹⁹ Kl", ["1.6·10¹⁹ Kl", "9.1·10⁻³¹ Kl", "6.67·10⁻¹¹ Kl"], "e ≈ 1.6·10⁻¹⁹ Kl (9.1·10⁻³¹ kg — elektron massasi)."],
    [3, "Metall o'tkazgich qizdirilsa, uning qarshiligi odatda qanday o'zgaradi?", "Ortadi", ["Kamayadi", "O'zgarmaydi", "Nolga teng bo'ladi"], "Qizdirilganda ionlar tebranishi kuchayib, elektronlar harakatiga ko'proq to'sqinlik qiladi."],
    [3, "Transformator nima qiladi?", "Kuchlanishni oshiradi yoki pasaytiradi", ["Tok kuchini o'lchaydi", "Qarshilikni o'lchaydi", "Zaryadni saqlaydi"], "Transformator o'zgaruvchan tok kuchlanishini o'zgartiradi; o'zgarmas tokda ishlamaydi."],
    [3, "Generator qanday energiyani elektr energiyaga aylantiradi?", "Mexanik energiyani", ["Yorug'lik energiyasini", "Yadro energiyasini bevosita", "Tovush energiyasini"], "Generatorda rotor aylanishi (mexanik ish) elektromagnit induksiya orqali tok hosil qiladi."],
    [3, "Elektromagnit induksiya hodisasini kim kashf etgan?", "Maykl Faradey", ["Georg Om", "Alessandro Volta", "Isaak Nyuton"], "Faradey 1831-yilda kashf etgan."],
    [3, "Yarimo'tkazgichlarga misol qaysi?", "Kremniy", ["Mis", "Shisha", "Kumush"], "Kremniy va germaniy — yarimo'tkazgichlar."],
    [3, "Zanjirdagi qisqa tutashuvdan qaysi qurilma himoya qiladi?", "Saqlagich (avtomat)", ["Voltmetr", "Reostat", "Transformator"], "Tok haddan oshsa saqlagich zanjirni uzadi."],
    [3, "Kondensator sig'imining SI dagi birligi qaysi?", "Farad (F)", ["Genri (Gn)", "Tesla (Tl)", "Veber (Vb)"], "Elektr sig'imi faradda o'lchanadi."],
    [3, "To'liq zanjir uchun Om qonuni qaysi?", "I = ℰ/(R + r)", ["I = ℰ·(R + r)", "I = R/ℰ", "I = ℰ/R − r"], "ℰ — EYuK, r — manbaning ichki qarshiligi."],
    [1,"Elektr tokining issiqlik ta'siridan qaysi qurilmada foydalaniladi?","Elektr isitgichda",["Elektr motorida","Radioda","Kompyuterda"],"Elektr isitgichda tok energiyasi to'liq issiqlikka aylanadi."],
    [1,"Batareyaning musbat qutbi qanday belgilanadi?","Plus (+) belgisi bilan",["Minus (−) belgisi bilan","Tilda (~) belgisi bilan","Ko'paytma (×) belgisi bilan"],"Batareyada '+' musbat, '−' manfiy qutbni bildiradi."],
    [1,"Elektr tokining yo'nalishi deb qaysi zaryadlarning harakat yo'nalishi qabul qilingan?","Musbat zaryadlar harakati yo'nalishida",["Manfiy zaryadlar harakati yo'nalishida","Elektronlar harakati yo'nalishida","Magnit maydoni yo'nalishida"],"Konvensional tok yo'nalishi musbat zaryadlar harakatiga mos; metallarda elektronlar teskari yo'nalishda harakat qiladi."],
    [1,"Quyidagilardan qaysi biri yaxshi o'tkazgich emas?","Shisha",["Mis","Alyuminiy","Temir"],"Shisha izolyator hisoblanadi, metallar esa yaxshi o'tkazgich."],
    [1,"Elektr zanjiridagi o'chiruvchi nima uchun xizmat qiladi?","Zanjirni uzib va ulab qo'yish uchun",["Tokni o'lchash uchun","Kuchlanishni oshirish uchun","Qarshilikni o'zgartirish uchun"],"O'chiruvchi zanjirni uzib qo'yib, tok oqishini to'xtatadi yoki tiklaydi."],
    [1,"Oddiy cho'g'lanma lampaning tolasi qanday metalldan yasaladi?","Volfram",["Mis","Temir","Alyuminiy"],"Volfram juda yuqori erish temperaturasiga (3422 °C) ega bo'lgani uchun lampada ishlatiladi."],
    [1,"Elektr tokining kimyoviy ta'siri qaysi jarayonda ko'rinadi?","Elektrolizda",["Qizishda","Yorug'lik chiqarishda","Magnit maydon hosil bo'lishida"],"Elektroliz — tok ta'sirida eritmadagi modda parchalanishi jarayoni."],
    [1,"3 ta lampa ketma-ket ulangan. Bitta lampa chiqsa, qolganlar qanday bo'ladi?","Ular ham o'chadi",["Yanada yorqinroq yonadi","O'zgarmaydi","Bittasi o'chadi, bittasi yonadi"],"Ketma-ket zanjirda bitta element uzilsa, butun zanjir uziladi."],
    [1,"3 ta lampa parallel ulangan. Bitta lampa chiqsa, qolganlar qanday bo'ladi?","Yonishda davom etadi",["Ular ham o'chadi","Ikki barobar yorug' bo'ladi","Avval o'chib, keyin yonadi"],"Parallel zanjirda har bir shox mustaqil bo'lib, birining uzilishi qolganlariga ta'sir qilmaydi."],
    [1,"Tok kuchi 2 A, qarshilik 4 Om bo'lsa, kuchlanish qancha?","8 V",["2 V","6 V","0,5 V"],"Om qonuniga ko'ra: U = I · R = 2 · 4 = 8 V."],
    [1,"Reostat nima uchun ishlatiladi?","Zanjirdagi qarshilikni o'zgartirish uchun",["Tok kuchini o'lchash uchun","Zanjirni uzish uchun","Energiyani saqlash uchun"],"Reostat — qarshiligini uzluksiz o'zgartirib bo'ladigan element."],
    [1,"Elektr tokining magnit ta'siridan qaysi qurilmada foydalaniladi?","Elektr motorida",["Rezistorda","Kondensatorda","Lampada"],"Elektr motor tokning magnit maydonini mexanik harakatga aylantiradi."],
    [1,"Elektr energiyasi SI da qaysi birlikda o'lchanadi?","Joul (J)",["Vatt (Vt)","Amper (A)","Volt (V)"],"SI sistemasida energiya birligi Joul; Vatt esa quvvat birligi."],
    [1,"Musbat va manfiy zaryadlar o'zaro qanday ta'sirlashadi?","Tortishadi",["Itarishadi","Ta'sir qilmaydi","Aylanma harakat qiladi"],"Har xil ishorali zaryadlar bir-birini tortadi; bir xil ishoraliklar itaradi."],
    [1,"Elektr sxemasida rezistor qanday belgi bilan ko'rsatiladi?","To'g'ri to'rtburchak",["Doira","Uchburchak","Doira ichida X belgisi"],"O'quv sxemalarida rezistor to'g'ri to'rtburchak belgisi bilan ko'rsatiladi."],
    [1,"100 Vt li lampa 1 soat davomida qancha energiya sarflaydi?","360 000 J",["100 J","3 600 J","36 000 J"],"W = P · t = 100 Vt · 3600 s = 360 000 J."],
    [1,"Zanjir uzilgan (ochiq) bo'lsa, tok kuchi qancha bo'ladi?","Nol",["Maksimal","O'zgaruvchan","Cheksiz"],"Ochiq zanjirda tok oqmaydi, ya'ni I = 0."],
    [1,"Elektr o'tkazuvchanligi o'tkazgich va izolyator oralig'ida bo'lgan moddalar qanday ataladi?","Yarimo'tkazgich",["Metall","Plastmassa","Shisha"],"Yarimo'tkazgichlar (Si, Ge) sharoitga qarab ham o'tkazgich, ham izolyator bo'la oladi."],
    [1,"1 kVt (kilovatt) necha vattga teng?","1000 Vt",["100 Vt","10 000 Vt","10 Vt"],"\"Kilo\" prefiks 1000 ni bildiradi: 1 kVt = 1000 Vt."],
    [1,"Elektr lampasi o'chiruvchi bilan qanday ulanishi kerak?","Ketma-ket",["Parallel","Alohida","Tok manbaiga bevosita"],"O'chiruvchi lampa bilan ketma-ket ulanganda zanjirni to'la uzib qo'yadi."],
    [1,"Tok kuchi 3 A, qarshilik 6 Om bo'lsa, elektr quvvati qancha?","54 Vt",["18 Vt","9 Vt","2 Vt"],"P = I² · R = 3² · 6 = 9 · 6 = 54 Vt."],
    [1,"Qaysi holatda elektr toki xavfli hisoblanadi?","Nam muhitda yoki suvda ishlashda",["Quruq xonada ishlashda","Izolyatsiyalangan sim bilan ishlashda","O'chirilgan qurilma bilan ishlashda"],"Nam muhit tananing elektr qarshiligini keskin kamaytiradi va tok urishi xavfini oshiradi."],
    [1,"Elektr sxemasida tok manbai (batareya) qanday ko'rsatiladi?","Uzun va qisqa parallel chiziqlar bilan",["Doira ichida X bilan","Zigzag chiziq bilan","Uchburchak bilan"],"Batareya sxemada uzun (+) va qisqa (−) parallel chiziqlar bilan belgilanadi."],
    [2,"R₁ = 4 Om va R₂ = 6 Om ketma-ket ulangan. Umumiy qarshilik qancha?","10 Om",["2,4 Om","24 Om","5 Om"],"Ketma-ket ulanishda: Rₜ = R₁ + R₂ = 4 + 6 = 10 Om."],
    [2,"R₁ = R₂ = 6 Om bo'lgan ikki rezistor parallel ulangan. Umumiy qarshilik qancha?","3 Om",["12 Om","6 Om","1 Om"],"Teng ikki parallel rezistorning umumiy qarshiligi: Rₜ = R/2 = 6/2 = 3 Om."],
    [2,"Ketma-ket ulangan zanjirda kuchlanish qanday taqsimlanadi?","Qarshiliklarga mutanosib ravishda",["Barcha elementlarda teng bo'ladi","Faqat birinchi elementga to'planadi","Tok kuchiga mutanosib bo'ladi"],"U₁/U₂ = R₁/R₂ nisbati ketma-ket ulanishda o'rinli."],
    [2,"U = 12 V, R = 6 Om bo'lsa, P = U²/R formulasi bo'yicha quvvat qancha?","24 Vt",["72 Vt","2 Vt","8 Vt"],"P = U²/R = 144/6 = 24 Vt."],
    [2,"Elektr simining solishtirma qarshiligi nimaga bog'liq?","Materialning turiga",["Simning uzunligiga","Simning ko'ndalang kesimiga","Tok kuchiga"],"Solishtirma qarshilik ρ — faqat material xususiyati bo'lib, geometrik o'lchamlarga bog'liq emas."],
    [2,"O'tkazgich uzunligi 3 marta ortsa va ko'ndalang kesimi 3 marta kamaysa, qarshilik qanday o'zgaradi?","9 marta ortadi",["3 marta ortadi","6 marta ortadi","O'zgarmaydi"],"R = ρl/S → l 3 marta ortsa, S 3 marta kamaysa: R' = ρ·(3l)/(S/3) = 9ρl/S = 9R."],
    [2,"EYuK (elektr yurituvchi kuch) qanday birlikda o'lchanadi?","Volt (V)",["Amper (A)","Vatt (Vt)","Om"],"EYuK zaryadga nisbatan ish hisoblanib, kuchlanish kabi Voltda o'lchanadi."],
    [2,"Tok manbaini zanjirga ulanganda qisqichlardagi kuchlanish EYuK dan kichik bo'ladi. Sababi nima?","Tok manbaining ichki qarshiligi bor",["Tashqi simlar uzun","O'tkazgichlar parallel ulangan","Tok kuchi kichik"],"Qisqichlardagi kuchlanish: U = ℰ − I·r, bu yerda r — ichki qarshilik."],
    [2,"1 kVt·soat qancha energiyaga (Joulda) teng?","3 600 000 J",["1 000 J","360 000 J","36 000 J"],"1 kVt·soat = 1000 Vt × 3600 s = 3 600 000 J."],
    [2,"O'zgarmas tok (DC) va o'zgaruvchan tok (AC) ning asosiy farqi nimada?","DC yo'nalishi o'zgarmaydi, AC yo'nalishi davriy o'zgarib turadi",["DC kuchliroq bo'ladi, AC kuchsizroq","DC faqat lampada, AC faqat motorida ishlatiladi","Ikkalasi ham bir xil yo'nalishda oqadi"],"Batareya DC beradi; elektr tarmog'idagi o'zgaruvchan tok (AC) chastotasi 50 Hz."],
    [2,"Transformatorda n₁:n₂ = 1:5 bo'lsa, kuchlanish nisbati qanday?","U₁:U₂ = 1:5",["U₁:U₂ = 5:1","U₁:U₂ = 1:25","U₁:U₂ = 1:1"],"Transformatorda n₁/n₂ = U₁/U₂; o'ramlar soni nisbati kuchlanish nisbatiga teng."],
    [2,"3 ta bir xil rezistor (har biri 9 Om) parallel ulangan. Umumiy qarshilik qancha?","3 Om",["27 Om","9 Om","1 Om"],"n ta bir xil R Omli rezistorlar parallel: Rₜ = R/n = 9/3 = 3 Om."],
    [2,"Mis va temir simlardan qaysi biri tokni yaxshiroq o'tkazadi?","Mis",["Temir","Ikkalasi bir xil","Bu ma'lumotdan aytib bo'lmaydi"],"Misning solishtirma qarshiligi (~1,7·10⁻⁸ Om·m) temirnikidan (~1·10⁻⁷ Om·m) kichik."],
    [2,"Joul-Lens qonunida tok 2 marta oshsa, ajraladigan issiqlik qanday o'zgaradi?","4 marta ortadi",["2 marta ortadi","8 marta ortadi","O'zgarmaydi"],"Q = I²·R·t bo'lgani uchun tok 2 marta oshsa, Q 2² = 4 marta ortadi."],
    [2,"Qaysi o'lchov asbobida ichki qarshilik mumkin qadar kichik bo'lishi kerak?","Ampermetrda",["Voltmetrda","Ohmmetrda","Galvanometrda"],"Ampermetr ketma-ket ulanadi; ichki qarshilik katta bo'lsa, zanjirdagi tok o'zgarib qoladi."],
    [2,"Qaysi o'lchov asbobida ichki qarshilik mumkin qadar katta bo'lishi kerak?","Voltmetrda",["Ampermetrda","Reostatda","Saqlagichda"],"Voltmetr parallel ulanadi; ichki qarshilik kichik bo'lsa, kuchlanishni o'zgartiradi."],
    [2,"Lampa ustida «220 V, 100 Vt» deb yozilgan. U qanday tok kuchiga mo'ljallangan?","~0,45 A",["~1 A","~2,2 A","~0,1 A"],"I = P/U = 100/220 ≈ 0,45 A."],
    [2,"R = ρl/S formulasida qaysi omil R ga ta'sir qilmaydi?","Tok kuchi (I)",["Uzunlik (l)","Ko'ndalang kesim (S)","Material turi (ρ)"],"Qarshilik formulasida tok kuchi ishtirok etmaydi; R faqat geometriya va materialga bog'liq."],
    [2,"O'zbekistonda uy elektr tarmog'idagi kuchlanish qancha?","220 V",["110 V","380 V","440 V"],"O'zbekistonda uy tarmog'idagi o'zgaruvchan tok kuchlanishi 220 V ni tashkil qiladi."],
    [2,"Yupqa va uzun sim, yo'g'on va qisqa simga nisbatan qanday?","Qarshiligi katta",["Qarshiligi kichik","Qarshiligi bir xil","O'tkazuvchanligi yuqori"],"R = ρl/S — uzun (l katta) va yupqa (S kichik) simda qarshilik katta bo'ladi."],
    [2,"O'tkazgichlarda tok o'tishi va izolyatorlarda o'tmasligi asosiy sabab nima?","O'tkazgichlarda erkin elektronlar ko'p, izolyatorlarda esa yo'q",["O'tkazgichlarda ionlar ko'p","Izolyatorlarda protonlar ko'p","O'tkazgichlar issiqlikka bardoshli"],"Metalldagi erkin elektronlar tok oqishini ta'minlaydi; izolyatorda erkin zaryadlar yo'q."],
    [2,"P = I · U formula bilan: I = 5 A, U = 20 V bo'lsa, quvvat qancha?","100 Vt",["25 Vt","4 Vt","15 Vt"],"P = I · U = 5 · 20 = 100 Vt."],
    [2,"Lampa ustida «60 Vt, 220 V» deb yozilgan. Ish holatidagi qarshiligi qancha?","~807 Om",["~220 Om","~60 Om","~3667 Om"],"R = U²/P = 220²/60 = 48 400/60 ≈ 807 Om (ishchi temperaturada)."],
    [3,"Kirchgofning birinchi qonuni nima haqida?","Tugunga kiruvchi tok yig'indisi chiquvchi tok yig'indisiga teng",["Konturda kuchlanishlar yig'indisi nolga teng","Tok o'tkazgich uzunligiga proporsional","Zanjirdagi barcha kuchlanish bir xil"],"1-Kirchgof qonuni zaryad saqlanish qonunining ifodasidir: ΣI_kiruvchi = ΣI_chiquvchi."],
    [3,"Kirchgofning ikkinchi qonuni nima haqida?","Yopiq konturda EYuK lar yig'indisi kuchlanishlar yig'indisiga teng",["Tugunga kiruvchi tok chiquvchi tokdan katta","Zanjirdagi barcha rezistorlar bir xil tokka ega","Parallel zanjirlarda kuchlanish har xil"],"2-Kirchgof qonuni energiya saqlanish qonunining ifodasidir: ΣE = ΣI·R."],
    [3,"Supero'tkazuvchanlik hodisasi odatda qanday temperaturada kuzatiladi?","Absolyut nolga yaqin juda past temperaturada",["Juda yuqori temperaturada","Xona temperaturasida","Faqat 100°C da"],"Ko'pchilik supero'tkazgichlar 0 K ga yaqin temperaturada (ba'zilari −196°C da) qarshiliksiz tok o'tkazadi."],
    [3,"Kondensatorning sig'imi nimaga bog'liq?","Plastina yuzasiga, ular orasidagi masofaga va dielektrikka",["Faqat kuchlanishga","Faqat tok kuchiga","Faqat plastina materialiga"],"C = ε·ε₀·S/d — sig'im plastina yuzi S ga to'g'ri, masofa d ga teskari proporsional."],
    [3,"Kondensatorda to'plangan energiya formulasi qaysi?","W = C·U²/2",["W = C·U","W = C²·U","W = C·U/2"],"Kondensatordagi elektr maydon energiyasi: W = CU²/2."],
    [3,"Elektroliz jarayonida katodda nima sodir bo'ladi?","Musbat ionlar qaytariladi (elektron qabul qiladi)",["Manfiy ionlar oksidlanadi","Dielektrik sinadi","Erkin elektronlar yo'qoladi"],"Katod — manfiy elektrod; musbat ionlar (kationlar) u yerda elektron qabul qilib qaytariladi."],
    [3,"Faradeyning elektroliz birinchi qonuniga ko'ra, elektrodda ajralib chiqadigan modda miqdori nimaga proporsional?","O'tgan zaryadga (I·t)",["Kuchlanishga","Eritma konsentratsiyasiga","Elektrod materialiga"],"m = k·I·t, bu yerda k — elektrokimyoviy ekvivalent."],
    [3,"Induktivlikning SI dagi birligi qaysi?","Genri (H)",["Farad (F)","Veber (Vb)","Tesla (T)"],"Induktivlik L Genrida o'lchanadi: 1 H = 1 Vb/A."],
    [3,"Birinchi g'altakdagi tok o'zgarganda ikkinchi g'altakda EYuK paydo bo'lishi qanday hodisa deyiladi?","O'zaro induktivlik",["O'zinduksiya","Elektrostatik induksiya","Rezonans"],"O'zaro induktivlik — transformatorning ishlash asosi."],
    [3,"Magnit oqimining SI dagi birligi qaysi?","Veber (Vb)",["Tesla (T)","Genri (H)","Amper (A)"],"Magnit oqimi Φ = B·S veberlarda o'lchanadi; tesla esa magnit induksiya birligi."],
    [3,"Faradeyning elektromagnit induksiya qonuniga ko'ra, induksiya EYuK formulasi qaysi?","ε = −ΔΦ/Δt",["ε = Φ·t","ε = B·l","ε = L·I"],"Induksiya EYuK magnit oqimining vaqt bo'yicha o'zgarish tezligiga teng; manfiy ishorali (Lens qoidasi)."],
    [3,"Lorens kuchi — bu qanday kuch?","Magnit maydonida harakatlanayotgan zaryadga ta'sir etuvchi kuch",["Statik zaryadga elektr maydon ta'siri","Gravitatsion kuch","Ichki kuchlanish kuchi"],"F = q·v·B·sinα — Lorens kuchi zaryadlangan zarrachaga magnit maydonida ta'sir etadi."],
    [3,"Plazma holati qanday ta'riflanadi?","Ionlashgan gaz — erkin ionlar va elektronlar aralashmasi",["Qattiq moddaning eritilishi","Suyuq metalning qotishi","Gazning suyuqlanishi"],"Plazma — moddaning to'rtinchi agregat holati: ionlar va erkin elektronlar to'plami."],
    [3,"Nega yo'g'onroq sim kamroq qiziydi?","Qarshiligi kichikroq bo'lgani uchun",["Unda tok tezroq o'tgani uchun","Unda kuchlanish katta bo'lgani uchun","Unda elektronlar kam bo'lgani uchun"],"Q = I²·R·t; R = ρl/S → S katta bo'lsa R kichik, shuning uchun Q ham kichik bo'ladi."],
    [3,"Tok manbaida qisqa tutashuv sodir bo'lsa, tok kuchi qanday o'zgaradi?","Keskin ortadi (maksimum bo'ladi)",["Nolga tushadi","O'zgarmaydi","Ohista kamayadi"],"Qisqa tutashuvda tashqi qarshilik R ≈ 0, shuning uchun I = ℰ/r faqat ichki qarshilikka bog'liq bo'lib, maksimum bo'ladi."],
    [3,"Dielektrik teshilganda nima sodir bo'ladi?","Izolyator o'tkazgichga aylanadi",["Izolyator eriydi","Dielektrik zaryadlanadi","Sig'im nolga tushadi"],"Juda katta kuchlanishda elektr maydoni dielektrik atomlarini ionlashtiradi va tok o'ta boshlaydi."],
    [3,"Magnit induksiyaning (B) SI dagi birligi qaysi?","Tesla (T)",["Veber (Vb)","Genri (H)","Oersted (Oe)"],"B ning birligi Tesla: 1 T = 1 Vb/m²."],
    [3,"To'liq zanjirda ichki qarshilik r ortsa, qisqichlardagi kuchlanish qanday o'zgaradi?","Kamayadi",["Ortadi","O'zgarmaydi","Avval ortib, keyin kamayadi"],"U = ℰ·R/(R+r) → r ortganda (ℰ va R doimiy) U kamayadi."],
    [3,"P-turdagi yarimo'tkazgich hosil qilish uchun qaysi guruh elementlari qo'shiladi?","III guruh elementlari (bor kabi)",["V guruh elementlari (fosfor kabi)","II guruh elementlari","Inert gazlar"],"Bor, alyuminiy (III guruh) qo'shilganda 'kovak' (hole) paydo bo'ladi — P-tur yarimo'tkazgich hosil bo'ladi."],
    [3,"N-turdagi yarimo'tkazgich hosil qilish uchun qaysi guruh elementlari qo'shiladi?","V guruh elementlari (fosfor kabi)",["III guruh elementlari (bor kabi)","II guruh elementlari","Inert gazlar"],"Fosfor, mishyak (V guruh) qo'shilganda ortiqcha elektron paydo bo'ladi — N-tur yarimo'tkazgich hosil bo'ladi."],
    [3,"Diod qanday xususiyatga ega?","Tokni faqat bir yo'nalishda o'tkazadi",["Tokni ikkala yo'nalishda o'tkazadi","Kuchlanishni saqlaydi","Qarshilikni o'zgartiradi"],"Diod — p-n o'tish asosidagi yarimo'tkazgich asbob: to'g'ri yo'nalishda ulanganda tok o'tkazadi, teskari ulanganda o'tkazmaydi."],
    [3,"Tranzistorning asosiy vazifasi nima?","Signalni kuchaytirish yoki kalitlash",["Kuchlanishni saqlash","Tok yo'nalishini o'zgartirish","Magnit maydon hosil qilish"],"Tranzistor (BJT yoki FET) elektron qurilmalarda signal kuchaytirgich va kalit sifatida ishlatiladi."]
  ]);
  var PAR = [[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [20, 30, 12], [12, 24, 8], [10, 40, 8], [6, 6, 3], [20, 20, 10], [30, 60, 20], [12, 6, 4], [5, 20, 4]];
  function P3(L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10], [11, 12, 13, 14, 15, 16]));
    var U, I, Rr, P, t, A, q, R1, R2, n, pr, c, Q, Pv, T, cost;
    if (k === 0) { Rr = pick([2, 4, 5, 6, 10, 12, 20, 22, 44]); I = pick([0.5, 1, 2, 3, 4, 5]); U = Rr * I;
      return NQ("Qarshiligi " + Rr + " Om bo'lgan o'tkazgich uchlariga " + f(U) + " V kuchlanish berildi. Tok kuchi necha A?", I, "A", [U * Rr, Rr / U, U + Rr, I * 2], ["I = U / R = " + f(U) + " : " + Rr + " = " + f(I) + " A"]); }
    if (k === 1) { I = pick([0.5, 1, 2, 3, 4, 5, 10]); Rr = R(2, 30); U = I * Rr;
      return NQ("O'tkazgichdan " + I + " A tok o'tmoqda, uning qarshiligi " + Rr + " Om. O'tkazgich uchlaridagi kuchlanish necha V?", U, "V", [Rr / I, I + Rr, U * 2, U / 2], ["U = I · R = " + I + " · " + Rr + " = " + f(U) + " V"]); }
    if (k === 2) { I = pick([0.5, 1, 2, 4, 5]); Rr = pick([2, 3, 4, 6, 8, 10, 12, 20, 24, 40, 44]); U = I * Rr;
      return NQ("Kuchlanish " + f(U) + " V, tok kuchi " + I + " A. O'tkazgich qarshiligi necha Om?", Rr, "Om", [U * I, U + I, Rr * 2, Rr / 2], ["R = U / I = " + f(U) + " : " + I + " = " + Rr + " Om"]); }
    if (k === 3) { U = pick([4.5, 6, 12, 24, 36, 110, 220]); I = pick([0.5, 1, 2, 3, 5]); P = U * I;
      return NQ("Asbob " + U + " V kuchlanishda ishlaydi, undan " + I + " A tok o'tadi. Asbobning quvvati necha Vt?", P, "Vt", [U / I, U + I, P * 2, P / 2], ["P = U · I = " + U + " · " + I + " = " + f(P) + " Vt"]); }
    if (k === 4) { R1 = R(2, 30); R2 = R(2, 30);
      return NQ("Qarshiliklari " + R1 + " Om va " + R2 + " Om bo'lgan ikki rezistor ketma-ket ulandi. Umumiy qarshilik necha Om?", R1 + R2, "Om", [R1 * R2, Math.abs(R1 - R2) || R1 * 2, (R1 + R2) * 2, R1 * R2 / (R1 + R2)], ["Ketma-ket: R = R₁ + R₂ = " + R1 + " + " + R2 + " = " + (R1 + R2) + " Om"]); }
    if (k === 5) { pr = pick(PAR); R1 = pr[0]; R2 = pr[1];
      return NQ("Qarshiliklari " + R1 + " Om va " + R2 + " Om bo'lgan ikki rezistor parallel ulandi. Umumiy qarshilik necha Om?", pr[2], "Om", [R1 + R2, R1 * R2, (R1 + R2) / 2, Math.abs(R1 - R2)], ["Parallel: R = R₁·R₂ / (R₁ + R₂) = " + R1 * R2 + " : " + (R1 + R2) + " = " + pr[2] + " Om"]); }
    if (k === 6) { n = pick([2, 3, 4, 5]); Rr = n * pick([2, 3, 4, 5, 6, 10, 12]);
      return NQ(n + " ta bir xil " + Rr + " Om li rezistor parallel ulandi. Umumiy qarshilik necha Om?", Rr / n, "Om", [Rr * n, Rr, Rr + n, Rr / (2 * n)], ["n ta teng rezistor parallel: R = R₁ / n = " + Rr + " : " + n + " = " + Rr / n + " Om"]); }
    if (k === 7) { I = pick([0.2, 0.5, 1, 2, 3, 4, 5]); t = pick([10, 20, 30, 60, 100, 120]); q = I * t;
      return NQ("O'tkazgichdan " + I + " A tok " + t + " s davomida o'tdi. Ko'ndalang kesimdan necha kulon zaryad o'tdi?", q, "Kl", [t / I, I + t, q * 2, q * 60], ["q = I · t = " + I + " · " + t + " = " + f(q) + " Kl"]); }
    if (k === 8) { P = pick([100, 200, 500, 1000, 1500, 2000]); t = pick([2, 3, 4, 5, 6, 8, 10]); A = P * t / 1000;
      return NQ("Quvvati " + P + " Vt bo'lgan asbob " + t + " soat ishladi. U necha kVt·soat energiya sarfladi?", A, "kVt·soat", [P * t, P / t, A * 10, A / 10], [P + " Vt = " + f(P / 1000) + " kVt", "A = P · t = " + f(P / 1000) + " · " + t + " = " + f(A) + " kVt·soat"]); }
    if (k === 9) { P = pick([110, 220, 440, 660, 1100, 2200]); U = 220; I = P / U;
      return NQ("Quvvati " + P + " Vt bo'lgan asbob 220 V tarmoqqa ulangan. Undan necha A tok o'tadi?", I, "A", [P * U, U / P, I * 10, I + 1], ["I = P / U = " + P + " : 220 = " + f(I) + " A"]); }
    if (k === 10) { R1 = pick([2, 4, 5, 6, 10]); R2 = pick([3, 5, 10, 14, 20]); I = pick([0.5, 1, 2]); U = I * (R1 + R2);
      return NQ(R1 + " Om va " + R2 + " Om li rezistorlar ketma-ket ulanib, " + f(U) + " V manbaga ulandi. Zanjirdagi tok kuchi necha A?", I, "A", [U / R1, U / R2, U * (R1 + R2), I * 2], ["R = " + R1 + " + " + R2 + " = " + (R1 + R2) + " Om", "I = U / R = " + f(U) + " : " + (R1 + R2) + " = " + f(I) + " A"]); }
    if (k === 11) { do { U = pick([6, 12, 24, 110, 220]); Rr = pick([2, 3, 4, 6, 10, 12, 20, 22, 44, 55, 110]); P = U * U / Rr; } while (P !== Math.round(P));
      return NQ("Qarshiligi " + Rr + " Om bo'lgan qizdirgich " + U + " V kuchlanishga ulandi. Uning quvvati necha Vt?", P, "Vt", [U * Rr, U / Rr, U * U * Rr, P / 2], ["P = U² / R = " + U + "² : " + Rr + " = " + P + " Vt"]); }
    if (k === 12) { I = pick([1, 2, 3, 4, 5]); Rr = pick([5, 10, 20, 25, 50]); t = pick([10, 20, 30, 60, 100]); Q = I * I * Rr * t;
      return NQ("Qarshiligi " + Rr + " Om bo'lgan o'tkazgichdan " + I + " A tok " + t + " s o'tdi. Ajralgan issiqlik miqdori necha J?", Q, "J", [I * Rr * t, I * I * Rr, Q * 2, I * Rr], ["Q = I²·R·t = " + I + "² · " + Rr + " · " + t + " = " + Q + " J"]); }
    if (k === 13) { Pv = pick([100, 200, 400, 500, 1000, 1500, 2000]); T = pick([2, 3, 4, 5, 6]); n = pick([10, 20, 30]); c = pick([500, 600, 800, 1000]);
      A = Pv * T * n / 1000; cost = A * c;
      return NQ("Quvvati " + Pv + " Vt bo'lgan asbob " + n + " kun davomida kuniga " + T + " soatdan ishladi. 1 kVt·soat " + c + " so'm bo'lsa, necha so'm to'lanadi?", cost, "so'm", [Pv * T * n * c, Pv * T * c / 1000, cost * 2, cost / 10],
        ["A = " + f(Pv / 1000) + " kVt · " + T + " soat · " + n + " kun = " + f(A) + " kVt·soat", "Narx = " + f(A) + " · " + c + " = " + f(cost) + " so'm"]); }
    if (k === 14) { pr = pick(PAR); R1 = pr[0]; R2 = pr[1]; U = pick([6, 12, 24, 60, 120]);
      while ((U / pr[2]) !== Math.round(U / pr[2] * 2) / 2) U = pick([12, 24, 60, 120, 240]);
      I = U / pr[2];
      return NQ(R1 + " Om va " + R2 + " Om li rezistorlar parallel ulanib, " + U + " V manbaga ulandi. Umumiy tok kuchi necha A?", I, "A", [U / (R1 + R2), U / R1, U / R2, I * 2], ["R = " + R1 + "·" + R2 + "/(" + R1 + "+" + R2 + ") = " + pr[2] + " Om", "I = U / R = " + U + " : " + pr[2] + " = " + f(I) + " A"]); }
    if (k === 15) { var E = pick([6, 9, 12, 24]), r = pick([0.5, 1, 2]); I = pick([1, 2, 3]); Rr = E / I - r;
      if (Rr <= 0) { E = 12; r = 1; I = 2; Rr = 5; }
      return NQ("Manbaning EYuK " + E + " V, ichki qarshiligi " + r + " Om, tashqi qarshilik " + f(Rr) + " Om. Zanjirdagi tok kuchi necha A?", I, "A", [E / Rr, E / r, E / (Rr - r) > 0 ? E / (Rr - r) : I + 1, I * 2], ["I = ℰ / (R + r) = " + E + " : (" + f(Rr) + " + " + r + ") = " + f(I) + " A"]); }
    pr = pick([[12, 6], [12, 12], [12, 24], [12, 36], [24, 12], [24, 48], [6, 3], [6, 12], [36, 36], [36, 72], [220, 100], [220, 40], [220, 25], [220, 200], [220, 1100], [220, 2200]]);
    U = pr[0]; P = pr[1]; Rr = U * U / P;
    return NQ("Lampada \"" + U + " V, " + P + " Vt\" deb yozilgan. Ish holatidagi lampaning qarshiligi necha Om?", Rr, "Om", [U / P, P / U, U * P, Rr / 2], ["P = U²/R ⇒ R = U² / P = " + U + "² : " + P + " = " + Rr + " Om"]);
  }
  S.register("f3", mix(B3, P3, 0.4), "Fizika · Elektr: Om qonuni, quvvat");


  /* ================= f4 Issiqlik, zichlik, Arximed kuchi ================= */
  var B4 = bank([
    [1, "Zichlikning SI dagi birligi qaysi?", "kg/m³", ["kg·m³", "N/m²", "g/sm"], "ρ = m/V ⇒ kg/m³."],
    [1, "Suvning zichligi qancha?", "1000 kg/m³", ["100 kg/m³", "10 000 kg/m³", "1 kg/m³"], "Suv: 1000 kg/m³ = 1 g/sm³."],
    [1, "Temperaturani o'lchaydigan asbob qaysi?", "Termometr", ["Barometr", "Manometr", "Dinamometr"], "Termometr — harorat o'lchagich."],
    [1, "Toza suv normal atmosfera bosimida necha °C da qaynaydi?", "100 °C", ["0 °C", "50 °C", "212 °C"], "Normal bosimda suv 100 °C da qaynaydi."],
    [1, "Toza muz normal sharoitda necha °C da eriydi?", "0 °C", ["100 °C", "−10 °C", "4 °C"], "Muzning erish temperaturasi 0 °C."],
    [1, "Moddaning suyuq holatdan gaz holatga o'tishi nima deyiladi?", "Bug'lanish", ["Kondensatsiya", "Qotish", "Erish"], "Suyuqlik → gaz: bug'lanish (qaynash)."],
    [1, "Moddaning qattiq holatdan suyuq holatga o'tishi nima deyiladi?", "Erish", ["Qotish", "Bug'lanish", "Kondensatsiya"], "Qattiq → suyuq: erish."],
    [1, "Bug'ning suyuqlikka aylanishi nima deyiladi?", "Kondensatsiya", ["Bug'lanish", "Erish", "Sublimatsiya"], "Gaz → suyuqlik: kondensatsiya."],
    [1, "Jism qizdirilganda odatda hajmi qanday o'zgaradi?", "Kengayadi", ["Kichrayadi", "O'zgarmaydi", "Yo'qoladi"], "Issiqlikdan kengayish."],
    [1, "Suyuqlikka botirilgan jismni yuqoriga itaruvchi kuch nima deyiladi?", "Arximed kuchi", ["Og'irlik kuchi", "Ishqalanish kuchi", "Elastiklik kuchi"], "Arximed (itarib chiqaruvchi) kuchi."],
    [2, "Issiqlik miqdorining SI dagi birligi qaysi?", "Joul (J)", ["Vatt (Vt)", "Kelvin (K)", "Gradus (°C)"], "Issiqlik miqdori — energiya, joulda o'lchanadi."],
    [2, "Suvning solishtirma issiqlik sig'imi qancha?", "4200 J/(kg·°C)", ["420 J/(kg·°C)", "1000 J/(kg·°C)", "42 J/(kg·°C)"], "c(suv) = 4200 J/(kg·°C)."],
    [2, "Qaysi holatda jism suvda suzadi?", "Jism zichligi suvnikidan kichik", ["Jism zichligi suvnikidan katta", "Jism massasi katta", "Jism hajmi kichik"], "ρ(jism) < ρ(suyuqlik) ⇒ suzadi."],
    [2, "Vakuumda issiqlik qanday usulda uzatiladi?", "Nurlanish", ["Issiqlik o'tkazuvchanlik", "Konveksiya", "Hech qanday"], "Quyosh issiqligi Yerga nurlanish orqali keladi."],
    [2, "Suyuqlik va gazlarda issiq qatlamlar ko'tarilib, sovuqlari tushishi qanday issiqlik uzatish?", "Konveksiya", ["Nurlanish", "Issiqlik o'tkazuvchanlik", "Kondensatsiya"], "Konveksiya — modda oqimlari bilan issiqlik uzatish."],
    [2, "Quyidagilardan qaysi biri issiqlikni eng yaxshi o'tkazadi?", "Mis", ["Yog'och", "Havo", "Penoplast"], "Metallar yaxshi issiqlik o'tkazadi."],
    [2, "Paskal qonuni nimani ifodalaydi?", "Bosim har tomonga bir xil uzatiladi", ["Bosim faqat pastga uzatiladi", "Bosim faqat yuqoriga uzatiladi", "Bosim uzatilmaydi"], "Gidravlik press shu qonunga asoslanadi."],
    [2, "Atmosfera bosimini o'lchaydigan asbob qaysi?", "Barometr", ["Manometr", "Termometr", "Dinamometr"], "Barometr — atmosfera bosimini o'lchaydi."],
    [2, "Normal atmosfera bosimi taxminan nimaga teng?", "760 mm sim. ust.", ["100 mm sim. ust.", "1000 mm sim. ust.", "76 mm sim. ust."], "760 mm sim. ust. ≈ 101 325 Pa."],
    [2, "Suyuqlik ichidagi bosim chuqurlik ortishi bilan qanday o'zgaradi?", "Ortadi", ["Kamayadi", "O'zgarmaydi", "Nolga teng bo'ladi"], "p = ρ·g·h."],
    [3, "Mutlaq nol temperatura necha °C?", "−273 °C", ["0 °C", "−100 °C", "−373 °C"], "0 K ≈ −273 °C (aniqrog'i −273.15 °C)."],
    [3, "Ideal gaz holat tenglamasi (Mendeleyev−Klapeyron) qaysi?", "pV = (m/M)·R·T", ["p = ρ·g·h", "pV = m·g·h", "p/V = R·T"], "pV = νRT."],
    [3, "Izotermik jarayonda (T = const) gaz hajmi 2 marta kamaysa, bosimi qanday o'zgaradi?", "2 marta ortadi", ["2 marta kamayadi", "4 marta ortadi", "O'zgarmaydi"], "Boyl−Mariott qonuni: pV = const."],
    [3, "Izobarik jarayonda nima o'zgarmaydi?", "Bosim", ["Hajm", "Temperatura", "Massa va hajm"], "Izobarik — p = const."],
    [3, "Izoxorik jarayonda nima o'zgarmaydi?", "Hajm", ["Bosim", "Temperatura", "Ichki energiya"], "Izoxorik — V = const."],
    [3, "Termodinamikaning 1-qonuni qaysi?", "Q = ΔU + A", ["Q = m·c", "A = F·s", "Q = ΔU − m"], "Issiqlik ichki energiyani oshirishga va ish bajarishga sarflanadi."],
    [3, "Bug'lanishda suyuqlik temperaturasi qanday o'zgaradi?", "Pasayadi", ["Ko'tariladi", "O'zgarmaydi", "100 °C ga yetadi"], "Eng tez molekulalar uchib chiqib, suyuqlik soviydi."],
    [3, "Kristall jism erish jarayonida temperaturasi qanday bo'ladi?", "O'zgarmaydi", ["Ortib boradi", "Kamayib boradi", "Tebranadi"], "Erish davomida issiqlik kristall panjarani buzishga sarflanadi."],
    [3, "Erish issiqligi formulasi qaysi?", "Q = λ·m", ["Q = c·m·Δt", "Q = q·m·Δt", "Q = L/m"], "λ — solishtirma erish issiqligi."],
    [3, "Yoqilg'i yonganda ajraladigan issiqlik formulasi qaysi?", "Q = q·m", ["Q = c·m·Δt", "Q = λ/m", "Q = I²Rt"], "q — yoqilg'ining solishtirma yonish issiqligi."],
    [3, "Gaz molekulalarining o'rtacha kinetik energiyasi nimaga proporsional?", "Mutlaq temperaturaga", ["Hajmga", "Massaga teskari", "Bosimga teskari"], "E = (3/2)·k·T."],
    [1,"Zichlikning formulasi qaysi?","ρ = m/V",["ρ = m·V","ρ = V/m","ρ = m/V²"],"Zichlik massa hajmga nisbati."],
    [1,"Temperaturaning SI dagi birligi qaysi?","Kelvin",["Selsiy gradusi","Gramm","Farengeyt gradusi"],"SI da temperatura kelvin bilan o'lchanadi."],
    [1,"Muzning zichligi suvnikidan qanday?","Kichik",["Katta","Teng","Noma'lum"],"Muz zichligi 917 kg/m³, suvdan kichik, shu sababli suzadi."],
    [1,"Ko'pchilik jismlar sovutilganda hajmi qanday o'zgaradi?","Kichiklashadi",["Kattalashadi","O'zgarmaydi","Avval kattalashadi"],"Sovigan zarralar yaqinlashadi, hajm kichiklashadi."],
    [1,"Qattiq holatdagi suv nima deb ataladi?","Muz",["Bug'","Qor","Shudring"],"Suv 0 °C dan pastda muzga aylanadi."],
    [1,"Issiqlik qaysi jismdan qaysi jismga oqadi?","Issiqdan sovuqqa",["Sovuqdan issiqqa","Pastdan yuqoriga","Yuqoridan pastga"],"Issiqlik yuqori temperaturadan past temperaturali jismga uzatiladi."],
    [1,"Issiqlik uzatishning necha xil usuli bor?","Uch",["Ikki","To'rt","Besh"],"O'tkazuvchanlik, konveksiya va nurlanish — uch xil usul."],
    [1,"Suyuqlikka botirilgan jism siqib chiqargan suyuqlik hajmi nimaga teng?","Botgan qism hajmiga",["Butun jism hajmiga","Jism massasiga","Jism zichligiga"],"Siqib chiqargan suyuqlik hajmi botgan qism hajmiga teng."],
    [1,"Jism og'irligi Arximed kuchidan katta bo'lsa, jism nima qiladi?","Cho'kadi",["Suzadi","Yuqoriga ko'tariladi","Yuzada qoladi"],"Og'irlik kattaroq bo'lsa jism cho'kadi."],
    [1,"Arximed kuchi qaysi yo'nalishda ta'sir qiladi?","Yuqoriga",["Pastga","Chapga","O'ngga"],"Arximed kuchi itaruvchi kuch, yuqoriga qaratilgan."],
    [1,"Jism suyuqlik yuzasida suzib turganda Arximed kuchi nimaga teng?","Jism og'irligiga",["Jism massasiga","Suyuqlik og'irligiga","Nolga"],"Suzib turganda yuqoriga va pastga kuchlar teng."],
    [1,"Issiqlik miqdori qaysi harf bilan belgilanadi?","Q",["T","U","A"],"Fizikada issiqlik miqdori Q harfi bilan belgilanadi."],
    [1,"Zichlik qaysi harf bilan belgilanadi?","ρ",["m","V","p"],"Zichlik yunoncha ρ (ro) harfi bilan belgilanadi."],
    [1,"Suyuqliklar siqilishga qanday munosabatda?","Juda kam siqiladi",["Umuman siqilmaydi","Oson siqiladi","Gaz kabi siqiladi"],"Suyuqliklar deyarli siqilmaydi."],
    [1,"Gazlar siqilishga qanday munosabatda?","Oson siqiladi",["Umuman siqilmaydi","Kam siqiladi","Qattiq jismdek"],"Gazlar orasidagi masofa katta, oson siqiladi."],
    [1,"Issiqlik miqdori qaysi asbob bilan o'lchanadi?","Kalorimetr",["Termometr","Barometr","Manometr"],"Kalorimetr issiqlik almashinuvini o'lchaydi."],
    [1,"Suvga botirilgan jism siqib chiqargan suyuqlik og'irligi nimaga teng?","Arximed kuchiga",["Jism og'irligiga","Jism massasiga","Suyuqlik hajmiga"],"Arximed kuchi siqib chiqargan suyuqlik og'irligiga teng."],
    [1,"Hajmning SI dagi birligi qaysi?","m³",["Litr","sm³","kg"],"SI da hajm kub metr bilan o'lchanadi."],
    [1,"1 litr suvning massasi taxminan necha kg?","1 kg",["0,5 kg","2 kg","1,5 kg"],"Suv zichligi 1000 kg/m³, 1 litr = 0,001 m³ = 1 kg."],
    [1,"Harorat oshganda suyuqlikning zichligi qanday o'zgaradi?","Kichiklashadi",["Kattalashadi","O'zgarmaydi","Avval ortadi"],"Suyuqlik qizganda kengayadi, zichlik kichiklashadi."],
    [1,"Jism siqib chiqargan suyuqlik hajmini qaysi idish yordamida o'lchash mumkin?","Menzurka",["Termometr","Barometr","Dinamometr"],"Menzurka hajmni o'lchaydi, siqib chiqargan suyuqlik hajmini ko'rsatadi."],
    [1,"Suvning bug'lanishi qaysi haroratda yuz beradi?","Har qanday haroratda",["Faqat 100 °C da","Faqat 0 °C dan past","Faqat 50 °C da"],"Bug'lanish har qanday temperaturada yuz beradi, qaynash esa faqat qaynash temperaturasida."],
    [2,"Gidrostatik bosim formulasi qaysi?","p = ρgh",["p = ρgV","p = mgh","p = ρVh"],"Suyuqlik bosimi zichlik, og'irlik kuchi va chuqurlikka bog'liq."],
    [2,"Arximed kuchining formulasi qaysi?","F_A = ρgV",["F_A = ρgh","F_A = mg","F_A = ρV"],"Arximed kuchi suyuqlik zichligi, og'irlik kuchi va siqib chiqarilgan hajmga bog'liq."],
    [2,"0,5 kg jism hajmi 0,0005 m³. Zichligi qancha?","1000 kg/m³",["500 kg/m³","2000 kg/m³","2500 kg/m³"],"ρ = m/V = 0,5/0,0005 = 1000 kg/m³."],
    [2,"2 kg suvni 10 °C ga qizdirish uchun qancha issiqlik kerak?","84 000 J",["42 000 J","168 000 J","8400 J"],"Q = 4200·2·10 = 84 000 J."],
    [2,"Suvga botirilgan jism siqib chiqargan suyuqlik og'irligi 10 N. Arximed kuchi qancha?","10 N",["5 N","20 N","100 N"],"Arximed kuchi siqib chiqargan suyuqlik og'irligiga teng."],
    [2,"Suyuqlikning bug'lanish tezligi harorat oshganda qanday o'zgaradi?","Ortadi",["Kamayadi","O'zgarmaydi","To'xtaydi"],"Yuqori haroratda bug'lanish tezroq yuz beradi."],
    [2,"Sof suvning qaynash temperaturasi balandlikka ko'tarilganda qanday o'zgaradi?","Pasayadi",["Ortadi","O'zgarmaydi","Avval ortadi"],"Tog'da atmosfera bosimi kichik, suv pastroq temperaturada qaynaydi."],
    [2,"Gazlarda issiqlik o'tkazuvchanlik qattiq jismlarga qaraganda qanday?","Yomonroq",["Yaxshiroq","Bir xil","Ancha yuqori"],"Gazlarda zarralar siyrak, issiqlik o'tkazuvchanligi past."],
    [2,"Og'irligi 20 N, siqib chiqargan suyuqlik og'irligi 8 N bo'lgan jism nima qiladi?","Cho'kadi",["Suzadi","Yarim suzadi","Ko'tariladi"],"Og'irlik (20 N) > Arximed (8 N), jism cho'kadi."],
    [2,"Jismni qizdirish uchun sarflangan issiqlik formulasi qaysi?","Q = c·m·Δt",["Q = c·m·t","Q = m·Δt","Q = c·Δt"],"Issiqlik sig'im, massa va temperatura farqiga bog'liq."],
    [2,"Solishtirma issiqlik sig'imning birligi qaysi?","J/(kg·°C)",["J/kg","J·kg/°C","kg/J"],"1 kg moddani 1 °C ga qizdirish issiqligi."],
    [2,"Hajmi 0,001 m³, massasi 5 kg jism zichligi qancha?","5000 kg/m³",["5 kg/m³","500 kg/m³","50 kg/m³"],"ρ = m/V = 5/0,001 = 5000 kg/m³."],
    [2,"Radiator xonani asosan qaysi usulda qizdiradi?","Konveksiya",["O'tkazuvchanlik","Nurlanish","Elektr"],"Radiatordan issiq havo ko'tarilib, konveksiya oqimi xonani qizdiradi."],
    [2,"Qaynoq choydagi metall qoshiq qiziydi. Bu qaysi issiqlik uzatish?","O'tkazuvchanlik",["Konveksiya","Nurlanish","Bug'lanish"],"Qattiq jism orqali issiqlik o'tkazuvchanlik bilan uzatiladi."],
    [2,"Termometrdagi suyuqlik qizganda nima qiladi?","Ko'tariladi",["Pastga tushadi","Siqiladi","Muzlaydi"],"Suyuqlik qizganda kengayadi va ko'tariladi."],
    [2,"Og'irligi 12 N, siqib chiqargan suyuqlik og'irligi 12 N bo'lgan jism qanday holatda bo'ladi?","Suyuqlik ichida suzib turadi",["Cho'kadi","Yarim suzadi","Yuqoriga uchadi"],"Arximed kuchi og'irlikka teng — jism suyuqlik ichida suzadi."],
    [2,"Suv muzlaganda hajmi qanday o'zgaradi?","Kattalashadi",["Kichiklashadi","O'zgarmaydi","Avval kichiklashadi"],"Suv muzlaganda anomal kengayadi, hajmi ortadi."],
    [2,"10 m chuqurlikdagi suv qo'shimcha bosimi qancha? (g=10)","100 000 Pa",["10 000 Pa","1000 Pa","1 000 000 Pa"],"p = ρgh = 1000·10·10 = 100 000 Pa."],
    [2,"Hajmi 0,0001 m³ jism to'liq suvga botgan. Arximed kuchi qancha? (g=10)","1 N",["0,1 N","10 N","100 N"],"F_A = ρgV = 1000·10·0,0001 = 1 N."],
    [2,"Issiq havo baloni ko'tarilishining sababi nima?","Issiq havo zichligi kichik",["Issiq havo og'irlashadi","Bosim ortadi","Elektr kuchi"],"Qizdirilgan havo siyraklashadi, zichlik kichiklashadi, balon ko'tariladi."],
    [2,"Chuqur ko'l muzlaganda qaysi qismi muzlamaydi?","Tubi",["Yuzasi","O'rtasi","Yonlari"],"4 °C dagi eng zich suv tubga tushadi, tubi muzlamaydi."],
    [2,"1 kg alyuminiy va 1 kg temirni teng qizdirish uchun qaysi ko'proq issiqlik kerak?","Alyuminiy",["Temir","Teng","Farqi yo'q"],"Alyuminiy sig'imi 900, temirniki 460, alyuminiyga ko'proq issiqlik kerak."],
    [3,"Gay-Lussak qonuni qaysi jarayonni ifodalaydi?","Izobarik",["Izotermik","Izoxorik","Adiabatik"],"Doimiy bosimda gaz hajmi temperaturaga proporsional."],
    [3,"Boyl-Mariott qonuni qaysi jarayonni ifodalaydi?","Izotermik",["Izobarik","Izoxorik","Adiabatik"],"Doimiy temperaturada bosim hajmga teskari proporsional."],
    [3,"Sharl qonuni qaysi jarayonni ifodalaydi?","Izoxorik",["Izotermik","Izobarik","Adiabatik"],"Doimiy hajmda bosim temperaturaga proporsional."],
    [3,"Adiabatik jarayonda tashqi muhit bilan issiqlik almashinuvi qanday?","Yo'q, almashinmaydi",["To'liq almashinadi","Qisman almashinadi","Maksimal almashinadi"],"Adiabatik jarayonda issiqlik almashinuvi nolga teng."],
    [3,"Universal gaz doimiysi R qancha?","8,31 J/(mol·K)",["1,38 J/(mol·K)","6,02 J/(mol·K)","9,8 J/(mol·K)"],"R = 8,31 J/(mol·K) Mendeleyev-Klapeyron tenglamasida."],
    [3,"1 mol ideal gaz normal sharoitda qancha hajm egallaydi?","22,4 l",["1 l","24 l","100 l"],"Normal sharoitda 1 mol gaz 22,4 litr hajm egallaydi."],
    [3,"Termodinamikaning 2-qonuniga ko'ra issiqlik qaysi tomonga o'z-o'zidan oqmaydi?","Sovuqdan issiqqa",["Issiqdan sovuqqa","Pastdan yuqoriga","Yuqoridan pastga"],"Issiqlik sovuq jismdan issiq jismga o'z-o'zidan oqmaydi."],
    [3,"Izotermik jarayonda ideal gaz ichki energiyasi qanday o'zgaradi?","O'zgarmaydi",["Ortadi","Kamayadi","Nolga teng"],"Ichki energiya temperaturaga bog'liq, T o'zgarmasa u ham o'zgarmaydi."],
    [3,"Bir atomli ideal gaz ichki energiyasi formulasi qaysi?","U = (3/2)·ν·R·T",["U = ν·R·T","U = (5/2)·ν·R·T","U = (3/2)·p·V"],"Bir atomli gazda erkinlik darajasi 3, U = 3/2 νRT."],
    [3,"Ideal Karno sikli samaradorligi formulasi qaysi?","η = 1 − T₂/T₁",["η = T₂/T₁","η = 1 − T₁/T₂","η = Q/T"],"Karno sikli FIK qizdirgich (T₁) va sovutgich (T₂) temperaturalariga bog'liq."],
    [3,"Gaz izobarik kengayganda bajarilgan ish formulasi qaysi?","A = p·ΔV",["A = p/V","A = p·ΔT","A = V·Δp"],"Doimiy bosimda ish bosim va hajm o'zgarishiga bog'liq."],
    [3,"Issiqlik dvigateli qaysi energiyani mexanik ishga aylantiradi?","Issiqlik energiyasini",["Elektr energiyasini","Kimyoviy energiyani","Yorug'lik energiyasini"],"Issiqlik dvigateli issiqlikni mexanik energiyaga aylantiradi."],
    [3,"Gidrostatik bosim formulasi p = ρgh da h nimani anglatadi?","Chuqurlikni",["Jism massasini","Hajmni","Zichlikni"],"h suyuqlik sirtidan jismgacha bo'lgan chuqurlik."],
    [3,"Mutlaq temperatura 0 K bo'lsa, gaz molekulalari harakati qanday bo'ladi?","To'xtaydi",["Tezlashadi","Kamayadi","Teskari yo'nalanadi"],"0 K da ideal gaz molekulalari harakati to'xtaydi."],
    [3,"Zichligi 600 kg/m³ bo'lgan jism suv yuzasida suzadi. Suvdan tashqaridagi qismi qanday?","0,4 hajmi tashqarida",["0,6 hajmi tashqarida","0,5 hajmi tashqarida","0,3 hajmi tashqarida"],"Botgan qism 600/1000 = 0,6, tashqarida 0,4 qismi."],
    [3,"Zichligi 500 kg/m³, hajmi 0,01 m³ jism suvda suzadi. Arximed kuchi qancha? (g=10)","50 N",["100 N","5 N","500 N"],"Suzib turganda F_A = og'irlik = 500·0,01·10 = 50 N."],
    [3,"Jism suyuqlikda muvozanatda suzib turganda siqib chiqargan suyuqlik massasi nimaga teng?","Jism massasiga",["Jism hajmiga","Jism zichligiga","Suyuqlik hajmiga"],"Suzib turganda siqib chiqargan suyuqlik og'irligi jism og'irligiga teng, massalari teng."],
    [3,"1 kg suvni 0 °C dan 100 °C gacha qizdirish uchun qancha issiqlik kerak?","420 000 J",["42 000 J","4 200 000 J","4 200 J"],"Q = 4200·1·100 = 420 000 J."],
    [3,"2 kg muzni 0 °C da eritish uchun kerakli issiqlik qancha? (λ=3,3·10⁵ J/kg)","660 000 J",["330 000 J","1 320 000 J","33 000 J"],"Q = λm = 3,3·10⁵·2 = 6,6·10⁵ J."],
    [3,"0,5 kg suvni 100 °C da bug'lantirish uchun issiqlik qancha? (L=2,3·10⁶ J/kg)","1 150 000 J",["2 300 000 J","115 000 J","23 000 J"],"Q = Lm = 2,3·10⁶·0,5 = 1,15·10⁶ J."],
    [3,"Suyuqlikda konveksiya oqimi qanday boshlanadi?","Issiq qatlam ko'tariladi",["Issiq qatlam og'irlashadi","Bosim pasayadi","Molekulalar ko'payadi"],"Qizgan qatlam siyraklashib yuqoriga ko'tariladi, sovugan pastga tushadi."],
    [3,"Issiqlik muvozanatidagi ikki jism temperaturasi qanday?","Teng",["Farqli","Nol","Maksimal"],"Muvozanatda jismlar temperaturasi bir xil bo'ladi."],
    [3,"Suyuqlikning qaynash temperaturasini ko'tarish uchun bosimni qanday qilish kerak?","Oshirish",["Kamaytirish","O'zgartirmaslik","Nolga tushirish"],"Bosim ortganda qaynash temperaturasi yuqorilaydi."]
  ]);
  function P4(L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10], [11, 12, 13, 14, 15]));
    var m, V, rho, c, dt, Qv, Fa, h, p, T, tc, sm, mat;
    var MAT = [["alyuminiy", 2700], ["temir", 7800], ["mis", 8900], ["muz", 900], ["po'lat", 7800], ["qo'rg'oshin", 11300]];
    if (k === 0) { rho = pick([200, 400, 500, 700, 800, 900, 1000, 2000, 2500, 2700]); V = pick([0.1, 0.2, 0.5, 1, 2, 3, 4]); m = rho * V;
      return NQ("Hajmi " + V + " m³ bo'lgan jismning massasi " + f(m) + " kg. Uning zichligi necha kg/m³?", rho, "kg/m³", [m * V, V / m * 1000, rho * 10, rho / 2], ["ρ = m / V = " + f(m) + " : " + V + " = " + rho + " kg/m³"]); }
    if (k === 1) { V = R(2, 30);
      return NQ(V + " litr suvning massasi necha kg? (ρ = 1000 kg/m³)", V, "kg", [V * 1000, V * 10, V / 10, V * 100], ["1 l = 0.001 m³, m = ρ·V = 1000 · " + f(V / 1000) + " = " + V + " kg"]); }
    if (k === 2) { tc = R(-50, 120); T = tc + 273;
      return NQ("Temperatura " + (tc < 0 ? "−" + (-tc) : tc) + " °C. Uni Kelvin shkalasida ifodalang (T = t + 273).", T, "K", [tc - 273, T + 100, tc, 273 - tc], ["T = t + 273 = " + f(tc) + " + 273 = " + T + " K"], true); }
    if (k === 3) { T = R(200, 400); tc = T - 273;
      return NQ("Temperatura " + T + " K. Uni Selsiy shkalasida ifodalang (°C da).", tc, "°C", [T + 273, -tc, tc + 10, tc - 10], ["t = T − 273 = " + T + " − 273 = " + f(tc) + " °C"], true); }
    if (k === 4) { rho = pick([500, 800, 900, 1000, 2000, 2700, 7800, 8900]); V = pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 2]); m = rho * V;
      return NQ("Zichligi " + rho + " kg/m³, hajmi " + V + " m³ bo'lgan jismning massasi necha kg?", m, "kg", [rho / V, V / rho * 1000, m * 10, m / 10], ["m = ρ · V = " + rho + " · " + V + " = " + f(m) + " kg"]); }
    if (k === 5) { m = pick([0.5, 1, 2, 3, 4, 5]); dt = pick([10, 20, 25, 30, 40, 50, 80]); Qv = 4200 * m * dt / 1000;
      return NQ(m + " kg suvni " + dt + " °C ga isitish uchun necha kJ issiqlik kerak? (c = 4200 J/(kg·°C))", Qv, "kJ", [4.2 * m, 4200 * m * dt, Qv * 10, Qv / 2], ["Q = c·m·Δt = 4200 · " + m + " · " + dt + " = " + f(Qv * 1000) + " J = " + f(Qv) + " kJ"]); }
    if (k === 6) { V = pick([0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1]); Fa = 1000 * 10 * V;
      return NQ("Hajmi " + V + " m³ bo'lgan jism suvga to'liq botirildi. Unga ta'sir etuvchi Arximed kuchi necha N? (ρ = 1000 kg/m³, g = 10 N/kg)", Fa, "N", [1000 * V, Fa * 10, Fa / 10, 10 * V], ["Fa = ρ·g·V = 1000 · 10 · " + V + " = " + f(Fa) + " N"]); }
    if (k === 7) { h = R(1, 40); p = 1000 * 10 * h / 1000;
      return NQ("Suvda " + h + " m chuqurlikdagi gidrostatik bosim necha kPa? (ρ = 1000 kg/m³, g = 10 N/kg; atmosfera bosimini hisobga olmang)", p, "kPa", [p * 1000, p / 10, h, p * 2], ["p = ρ·g·h = 1000 · 10 · " + h + " = " + 10000 * h + " Pa = " + p + " kPa"]); }
    if (k === 8) { mat = pick(MAT); sm = pick([10, 20, 50, 100, 200, 500]); m = mat[1] * sm / 1e6;
      return NQ(mat[0].charAt(0).toUpperCase() + mat[0].slice(1) + "dan yasalgan " + sm + " sm³ hajmli jism massasi necha gramm? (ρ = " + mat[1] + " kg/m³)", m * 1000, "g", [mat[1] * sm, m, m * 100, mat[1] / sm], ["ρ = " + mat[1] + " kg/m³ = " + f(mat[1] / 1000) + " g/sm³", "m = ρ·V = " + f(mat[1] / 1000) + " · " + sm + " = " + f(m * 1000) + " g"]); }
    if (k === 9) { m = pick([1, 2, 5, 10, 20]); var cc = pick([[4200, "suv"], [460, "temir"], [400, "mis"], [920, "alyuminiy"]]); dt = pick([10, 20, 50, 100]); Qv = cc[0] * m * dt;
      return NQ(m + " kg " + cc[1] + "ni " + dt + " °C ga isitish uchun necha J issiqlik kerak? (c = " + cc[0] + " J/(kg·°C))", Qv, "J", [cc[0] * m, cc[0] * dt, Qv / 10, Qv * 2], ["Q = c·m·Δt = " + cc[0] + " · " + m + " · " + dt + " = " + Qv + " J"]); }
    if (k === 10) { var rl = pick([[800, "kerosin"], [1000, "suv"], [13600, "simob"]]); h = pick([0.1, 0.2, 0.5, 1, 2]); p = rl[0] * 10 * h;
      return NQ("Idishda " + h + " m balandlikda " + rl[1] + " bor (ρ = " + rl[0] + " kg/m³). Idish tubidagi suyuqlik bosimi necha Pa? (g = 10 N/kg)", p, "Pa", [rl[0] * h, p * 10, p / 10, rl[0] * 10 / h], ["p = ρ·g·h = " + rl[0] + " · 10 · " + h + " = " + f(p) + " Pa"]); }
    if (k === 11) { m = pick([2, 4, 5, 10]); Qv = pick([42, 84, 168, 210, 420, 840]) * 1000; dt = Qv / (4200 * m);
      if (dt !== Math.round(dt)) { m = 2; Qv = 168000; dt = 20; }
      return NQ(m + " kg suvga " + f(Qv / 1000) + " kJ issiqlik berildi. Suv temperaturasi necha °C ga ko'tariladi? (c = 4200 J/(kg·°C))", dt, "°C", [Qv / 4200, dt * m * m, dt * 2, dt + 10], ["Δt = Q / (c·m) = " + Qv + " : (4200 · " + m + ") = " + dt + " °C"]); }
    if (k === 12) { mat = pick([["kerosin", 800], ["suv", 1000], ["dengiz suvi", 1030], ["spirt", 800]]); V = pick([0.002, 0.005, 0.01, 0.02, 0.1, 0.5]); Fa = mat[1] * 10 * V;
      return NQ("Hajmi " + V + " m³ bo'lgan jism " + mat[0] + "ga to'liq botirildi (ρ = " + mat[1] + " kg/m³). Arximed kuchi necha N? (g = 10 N/kg)", Fa, "N", [mat[1] * V, Fa * 10, Fa / 10, 1000 * 10 * V === Fa ? Fa * 2 : 1000 * 10 * V], ["Fa = ρ_suyuq·g·V = " + mat[1] + " · 10 · " + V + " = " + f(Fa) + " N"]); }
    if (k === 13) { V = pick([0.001, 0.002, 0.005, 0.01]); mat = pick([["temir", 7800], ["alyuminiy", 2700], ["mis", 8900]]); var P0 = mat[1] * 10 * V, Fa2 = 10000 * V;
      return NQ("Hajmi " + V + " m³ " + mat[0] + " jism (ρ = " + mat[1] + " kg/m³) suvga to'liq botirildi. Suvdagi og'irligi necha N? (g = 10 N/kg)", P0 - Fa2, "N", [P0, P0 + Fa2, Fa2, (P0 - Fa2) * 2], ["Havoda: P = ρ·g·V = " + f(P0) + " N, Fa = 1000·10·" + V + " = " + f(Fa2) + " N", "Suvda: " + f(P0) + " − " + f(Fa2) + " = " + f(P0 - Fa2) + " N"]); }
    if (k === 14) { var p1 = pick([100, 200, 300, 400]), ratio = pick([2, 3, 4]), V1 = ratio * R(1, 5);
      return NQ("Gaz izotermik siqildi: hajmi " + V1 + " l dan " + f(V1 / ratio) + " l gacha kamaydi. Boshlang'ich bosim " + p1 + " kPa bo'lsa, oxirgi bosim necha kPa?", p1 * ratio, "kPa", [p1 / ratio, p1, p1 * ratio * ratio, p1 + ratio], ["Boyl−Mariott: p₁V₁ = p₂V₂", "p₂ = " + p1 + " · " + V1 + " : " + f(V1 / ratio) + " = " + p1 * ratio + " kPa"]); }
    var m1 = pick([1, 2, 3]), t1 = pick([10, 20, 30]), m2 = pick([1, 2, 3]), t2 = pick([50, 60, 70, 80, 90]), tt = (m1 * t1 + m2 * t2) / (m1 + m2);
    if (tt !== Math.round(tt)) { m1 = 1; m2 = 1; t1 = 20; t2 = 80; tt = 50; }
    return NQ(m1 + " kg " + t1 + " °C li suvga " + m2 + " kg " + t2 + " °C li suv qo'shildi. Aralashma temperaturasi necha °C? (issiqlik yo'qotilmaydi)", tt, "°C", [(t1 + t2) / 2 === tt ? tt + 5 : (t1 + t2) / 2, t1 + t2, t2 - t1, tt + 10], ["m₁·c·(t − t₁) = m₂·c·(t₂ − t)", "t = (m₁t₁ + m₂t₂) / (m₁ + m₂) = " + (m1 * t1 + m2 * t2) + " : " + (m1 + m2) + " = " + tt + " °C"]);
  }
  S.register("f4", mix(B4, P4, 0.4), "Fizika · Issiqlik, zichlik, Arximed kuchi");


  /* ================= f5 Kattaliklar, birliklar va olimlar ================= */
  // [kattalik, SI birligi]
  var UNITS = [["Kuch", "Nyuton (N)"], ["Ish va energiya", "Joul (J)"], ["Quvvat", "Vatt (Vt)"], ["Bosim", "Paskal (Pa)"], ["Massa", "Kilogramm (kg)"],
    ["Uzunlik", "Metr (m)"], ["Vaqt", "Sekund (s)"], ["Tok kuchi", "Amper (A)"], ["Kuchlanish", "Volt (V)"], ["Elektr qarshilik", "Om"],
    ["Elektr zaryadi", "Kulon (Kl)"], ["Termodinamik temperatura", "Kelvin (K)"], ["Chastota", "Gers (Gs)"], ["Modda miqdori", "Mol"], ["Yorug'lik kuchi", "Kandela (kd)"]];
  // [asbob, nimani o'lchaydi]
  var INSTR = [["Dinamometr", "Kuchni"], ["Ampermetr", "Tok kuchini"], ["Voltmetr", "Kuchlanishni"], ["Manometr", "Idishdagi gaz bosimini"], ["Barometr", "Atmosfera bosimini"],
    ["Termometr", "Temperaturani"], ["Spidometr", "Tezlikni"], ["Ommetr", "Elektr qarshilikni"], ["Gigrometr", "Havo namligini"], ["Areometr", "Suyuqlik zichligini"], ["Tarozi", "Massani"]];
  var PREF = [["kilo", "10³", 1000], ["mega", "10⁶", 0], ["giga", "10⁹", 0], ["milli", "10⁻³", 0], ["mikro", "10⁻⁶", 0], ["santi", "10⁻²", 0], ["nano", "10⁻⁹", 0], ["detsi", "10⁻¹", 0]];
  var B5 = bank([
    [1, "Arximed qonunini kim kashf etgan?", "Arximed", ["Nyuton", "Galiley", "Paskal"], "Qadimgi yunon olimi Arximed (mil. avv. III asr)."],
    [1, "Nyutonning uchta qonuni fizikaning qaysi bo'limiga tegishli?", "Mexanika", ["Optika", "Elektr", "Termodinamika"], "Nyuton qonunlari — klassik mexanika asosi."],
    [1, "Teleskop orqali Yupiterning yo'ldoshlarini birinchilardan bo'lib kuzatgan olim kim?", "Galileo Galiley", ["Isaak Nyuton", "Nikola Tesla", "Georg Om"], "Galiley 1610-yilda Yupiterning 4 ta yo'ldoshini kashf etgan."],
    [1, "Kuch birligi qaysi olim sharafiga nomlangan?", "Isaak Nyuton", ["Jeyms Vatt", "Blez Paskal", "Andre Amper"], "1 N — Nyuton sharafiga."],
    [1, "Quvvat birligi (Vatt) qaysi olim sharafiga nomlangan?", "Jeyms Vatt", ["Alessandro Volta", "Jeyms Joul", "Isaak Nyuton"], "Vatt — bug' mashinasini takomillashtirgan Jeyms Vatt."],
    [1, "Abu Rayhon Beruniy qaysi kattalikni aniq o'lchashlari bilan mashhur?", "Moddalar zichligini", ["Tok kuchini", "Yorug'lik tezligini", "Radioaktivlikni"], "Beruniy ko'plab metall va qimmatbaho toshlarning solishtirma og'irligini aniqlagan."],
    [1, "1 kg necha gramm?", "1000 g", ["100 g", "10 g", "10 000 g"], "kilo = 1000."],
    [1, "1 m necha santimetr?", "100 sm", ["10 sm", "1000 sm", "60 sm"], "santi = 1/100."],
    [2, "Elektr qarshilik birligi qaysi olim sharafiga nomlangan?", "Georg Om", ["Andre Amper", "Alessandro Volta", "Maykl Faradey"], "Om qonuni muallifi Georg Om."],
    [2, "Elektromagnit induksiya hodisasini kim kashf etgan?", "Maykl Faradey", ["Georg Om", "Nikola Tesla", "Isaak Nyuton"], "Faradey, 1831-yil."],
    [2, "Birinchi elektr batareyasini (galvanik element) kim yaratgan?", "Alessandro Volta", ["Tomas Edison", "Georg Om", "Andre Amper"], "Volta ustuni (1800-yil)."],
    [2, "Suyuqlik va gazlarda bosim uzatilishi haqidagi qonun kimning nomi bilan ataladi?", "Blez Paskal", ["Arximed", "Robert Guk", "Galiley"], "Paskal qonuni."],
    [2, "Elastiklik kuchi deformatsiyaga proporsional ekanini kim aniqlagan?", "Robert Guk", ["Isaak Nyuton", "Blez Paskal", "Georg Om"], "Guk qonuni F = k·x."],
    [2, "Atmosfera bosimini birinchi bo'lib simobli nay bilan o'lchagan olim kim?", "Evanjelista Torrichelli", ["Blez Paskal", "Galileo Galiley", "Arximed"], "Torrichelli tajribasi (1643-yil)."],
    [2, "O'zgaruvchan tok tizimlari va asinxron dvigatel ixtirosi bilan mashhur olim kim?", "Nikola Tesla", ["Tomas Edison", "Maykl Faradey", "Georg Om"], "Magnit induksiya birligi tesla ham uning sharafiga."],
    [2, "Radioaktivlikni tadqiq qilgani uchun ikki marta Nobel mukofoti olgan ayol olim kim?", "Mariya Kyuri", ["Liza Meytner", "Ada Lavleys", "Rozalind Franklin"], "Fizika (1903) va kimyo (1911) bo'yicha Nobel mukofotlari."],
    [2, "Tok kuchi birligi qaysi olim sharafiga nomlangan?", "Andre Amper", ["Alessandro Volta", "Georg Om", "Jeyms Joul"], "Amper — fransuz fizigi."],
    [2, "Energiya birligi (Joul) qaysi olim sharafiga nomlangan?", "Jeyms Joul", ["Jeyms Vatt", "Isaak Nyuton", "Lord Kelvin"], "Joul issiqlik va ish ekvivalentligini o'rgangan."],
    [3, "Nisbiylik nazariyasi muallifi kim?", "Albert Eynshteyn", ["Isaak Nyuton", "Nils Bor", "Maks Plank"], "Maxsus (1905) va umumiy (1915) nisbiylik nazariyasi."],
    [3, "E = mc² formulasi kimga tegishli?", "Albert Eynshteyn", ["Isaak Nyuton", "Maks Plank", "Ernest Rezerford"], "Massa va energiya ekvivalentligi."],
    [3, "Atomning yadro modelini tajriba asosida taklif qilgan olim kim?", "Ernest Rezerford", ["Albert Eynshteyn", "Mariya Kyuri", "Isaak Nyuton"], "Rezerford α-zarralar sochilishi tajribasi (1911)."],
    [3, "Rentgen nurlarini kim kashf etgan?", "Vilgelm Rentgen", ["Mariya Kyuri", "Nikola Tesla", "Maykl Faradey"], "1895-yil, birinchi Nobel mukofoti (fizika, 1901)."],
    [3, "Kvant nazariyasiga asos solgan olim kim (1900-yil)?", "Maks Plank", ["Albert Eynshteyn", "Galileo Galiley", "Robert Guk"], "Plank doimiysi h ≈ 6.63·10⁻³⁴ J·s."],
    [3, "Yorug'likning vakuumdagi tezligi taxminan qancha?", "3·10⁸ m/s", ["3·10⁵ m/s", "340 m/s", "3·10⁶ m/s"], "c ≈ 300 000 km/s."],
    [3, "Havoda tovush tezligi taxminan qancha (20 °C da)?", "340 m/s", ["3·10⁸ m/s", "34 m/s", "1500 m/s"], "Havoda ≈ 340 m/s, suvda ≈ 1500 m/s."],
    [3, "SI tizimida nechta asosiy birlik bor?", "7 ta", ["5 ta", "10 ta", "3 ta"], "m, kg, s, A, K, mol, kd."],
    [3, "Atom tuzilishining kvant modelini (1913) taklif qilgan olim kim?", "Nils Bor", ["Ernest Rezerford", "Maks Plank", "Jeyms Maksvell"], "Bor postulatlari."],
    [3, "Elektromagnit maydon tenglamalari kimning nomi bilan ataladi?", "Jeyms Maksvell", ["Maykl Faradey", "Georg Om", "Andre Amper"], "Maksvell tenglamalari elektr va magnetizmni birlashtiradi."],
    [1,"Uzunlikning Xalqaro birliklar tizimidagi asosiy birligi qaysi?","Metr",["Kilogramm","Sekund","Amper"],"Metr uzunlikning asosiy birligi bo'lib, u yorug'lik tezligi orqali aniqlanadi."],
    [1,"Massaning Xalqaro birliklar tizimidagi asosiy birligi qaysi?","Kilogramm",["Gramm","Tonna","Nyuton"],"Kilogramm massaning asosiy birligi, gramm esa undan ming marta kichik."],
    [1,"Vaqtning Xalqaro birliklar tizimidagi asosiy birligi qaysi?","Sekund",["Daqiqa","Soat","Sutka"],"Sekund vaqtning asosiy birligi, u seziy atomining tebranishlari orqali aniqlanadi."],
    [1,"Haroratning Xalqaro birliklar tizimidagi asosiy birligi qaysi?","Kelvin",["Selsiy gradusi","Farengeyt gradusi","Kaloriya"],"Kelvin termodinamik haroratning birligi, u absolyut noldan boshlanadi."],
    [1,"Bir kilometr necha metrga teng?","1000 m",["100 m","10 m","10 000 m"],"Kilo- prefiksi ming barobar kattalikni bildiradi."],
    [1,"Bir soat necha sekundga teng?","3600 s",["60 s","600 s","360 s"],"Bir soatda 60 daqiqa, har daqiqada 60 sekund bor: 60·60 = 3600."],
    [1,"Bir tonna necha kilogrammga teng?","1000 kg",["100 kg","500 kg","10 000 kg"],"Tonna massaning yirik birligi bo'lib, ming kilogrammga teng."],
    [1,"Bir millimetr necha metrga teng?","0,001 m",["0,01 m","0,1 m","0,0001 m"],"Milli- prefiksi mingdan bir qismni bildiradi."],
    [1,"Bir litr necha kub santimetrga teng?","1000 sm³",["100 sm³","10 sm³","10 000 sm³"],"Bir litr bir kub detsimetrga, ya'ni 1000 kub santimetrga teng."],
    [1,"Kuch qanday asbob bilan o'lchanadi?","Dinamometr",["Barometr","Termometr","Menzurka"],"Dinamometr prujinaning cho'zilishiga qarab kuch qiymatini ko'rsatadi."],
    [1,"Jism massasi qanday asbob bilan o'lchanadi?","Tarozi",["Dinamometr","Spidometr","Sekundomer"],"Tarozi jism massasini etalon massalar bilan taqqoslab o'lchaydi."],
    [1,"Harorat qanday asbob bilan o'lchanadi?","Termometr",["Barometr","Gigrometr","Manometr"],"Termometr isish bilan o'zgaradigan suyuqlik yoki metall xossasidan foydalanadi."],
    [1,"Kichik vaqt oralig'i qanday asbob bilan o'lchanadi?","Sekundomer",["Termometr","Voltmetr","Dinamometr"],"Sekundomer sport musobaqalarida va tajribalarda vaqtni aniq sanaydi."],
    [1,"Kilo- prefiksi necha barobar kattalikni bildiradi?","1000",["100","10","10 000"],"Masalan, 1 kilometr 1000 metrga, 1 kilogramm 1000 grammga teng."],
    [1,"Fizik kattalik nimadan iborat?","Son qiymati va birlikdan",["Faqat son qiymatidan","Faqat o'lchov birligidan","Faqat formuladan"],"Masalan, 5 m yozuvida 5 — son qiymati, m — birlik."],
    [1,"Quyidagilardan qaysi biri skalyar kattalik?","Massa",["Kuch","Tezlik","Siljish"],"Skalyar kattalik faqat son qiymati bilan aniqlanadi, yo'nalishi bo'lmaydi."],
    [1,"Quyidagilardan qaysi biri vektor kattalik?","Kuch",["Massa","Vaqt","Harorat"],"Vektor kattalik son qiymatidan tashqari yo'nalishga ham ega."],
    [1,"Suvning normal atmosfera bosimida qaynash harorati necha gradus Selsiy?","100 °C",["0 °C","50 °C","273 °C"],"Dengiz sathida suv 100 °C da qaynaydi."],
    [1,"Suvning muzlash harorati necha gradus Selsiy?","0 °C",["100 °C","−100 °C","32 °C"],"Selsiy shkalasida suv 0 °C da muzlaydi."],
    [1,"Bir gramm necha milligrammga teng?","1000 mg",["100 mg","10 mg","10 000 mg"],"Milligramm grammning mingdan bir qismi."],
    [1,"Suyuqlik hajmi qanday asbob bilan o'lchanadi?","Menzurka",["Dinamometr","Tarozi","Termometr"],"Menzurka shkalasi bo'yicha suyuqlik hajmi kub santimetr yoki millilitrda o'qiladi."],
    [1,"Atmosfera bosimi qanday asbob bilan o'lchanadi?","Barometr",["Termometr","Gigrometr","Sekundomer"],"Barometr havo bosimini ko'rsatadi va ob-havoni kuzatishda ishlatiladi."],
    [1,"Qadimgi «qarich» o'lchovi qaysi kattalikni o'lchash uchun ishlatilgan?","Uzunlikni",["Massani","Vaqtni","Haroratni"],"Qarich — kaft yoyilganda bosh barmoq uchidan jimjiloq uchigacha bo'lgan masofa, ya'ni uzunlik o'lchovi."],
    [1,"«Fizika» so'zi yunoncha qaysi tushunchani anglatadi?","Tabiat",["Kuch","Harakat","Energiya"],"Yunoncha «fizis» so'zi tabiat ma'nosini beradi."],
    [2,"Magnit oqim birligi (veber) qaysi olim sharafiga nomlangan?","Vilgelm Veber",["Georg Om","Andre Amper","Maykl Faradey"],"Veber nemis fizigi bo'lib, magnit hodisalarni o'rgangan."],
    [2,"Induktivlik birligi (genri) qaysi olim nomi bilan ataladi?","Jozef Genri",["Nikola Tesla","Aleksandr Volta","Blez Paskal"],"Genri amerikalik fizik, o'zinduksiya hodisasini mustaqil kashf etgan."],
    [2,"Chastota birligi (gerts) qaysi olim sharafiga nomlangan?","Genrix Gerts",["Vilgelm Rentgen","Robert Guk","Xans Ersted"],"Gerts elektromagnit to'lqinlarni tajribada birinchi bo'lib hosil qilgan."],
    [2,"Elektr zaryadi birligi (kulon) qaysi olim nomi bilan ataladi?","Sharl Kulon",["Alessandro Volta","Georg Om","Jeyms Vatt"],"Kulon zaryadlar orasidagi ta'sir kuchini o'rgangan."],
    [2,"Atom massasi birligi (dalton) qaysi olim nomi bilan ataladi?","Jon Dalton",["Ernest Rezerford","Nils Bor","Dmitriy Mendeleyev"],"Dalton atom massasi tushunchasini fanga kiritgan ingliz olimi."],
    [2,"Angstrom qanday kattalikning birligi?","Uzunlikning",["Massaning","Vaqtning","Chastotaning"],"Bir angstrom 10⁻¹⁰ metrga teng, atomlar orasidagi masofani o'lchashda ishlatiladi."],
    [2,"O'lchov asbobining bo'linish qiymati nima?","Ikki qo'shni shtrix qiymatlari farqi",["Asbob ko'rsatadigan eng katta qiymat","Shkaladagi shtrixlar soni","O'lchash natijalarining o'rtachasi"],"Bo'linish qiymatini bilgan holda asbob ko'rsatkichini aniq o'qish mumkin."],
    [2,"O'lchash xatoligini kamaytirish uchun nima qilinadi?","Bir necha marta o'lchab, o'rtacha qiymat olinadi",["O'lchov faqat bir marta bajariladi","Asbob shkalasi kattaroq tanlanadi","Natija yaxlitlanadi"],"Tasodifiy xatolar ko'p o'lchovda bir-birini qisman yo'q qiladi."],
    [2,"Ampermetr elektr zanjiriga qanday ulanadi?","Ketma-ket",["Parallel","Faqat manbaga","Ketma-ket va parallel birga"],"Tok kuchini o'lchash uchun butun tok ampermetrdan o'tishi kerak."],
    [2,"Voltmetr elektr zanjiriga qanday ulanadi?","Parallel",["Ketma-ket","Tok manbaining ichiga","Zanjirga ulanmaydi"],"Voltmetr kuchlanishni o'lchash uchun zanjirning tekshirilayotgan qismiga parallel ulanadi."],
    [2,"Shtangensirkul qanday kattalikni o'lchaydi?","Tashqi va ichki o'lchamlarni",["Massani","Bosimni","Haroratni"],"Shtangensirkul detallarning qalinligi va diametrini aniq o'lchaydi."],
    [2,"Mikrometrning odatiy o'lchash aniqligi qancha?","0,01 mm",["0,1 mm","1 mm","1 sm"],"Mikrometr vint yordamida juda kichik qalinliklarni o'lchaydi."],
    [2,"Suyuqlikning zichligini qaysi asbob bilan o'lchash mumkin?","Areometr",["Manometr","Gigrometr","Menzurka"],"Areometr suyuqlikka cho'kish chuqurligiga qarab zichlikni ko'rsatadi."],
    [2,"Havoning namligini qaysi asbob o'lchaydi?","Gigrometr",["Barometr","Termometr","Manometr"],"Gigrometr havoda suv bug'ining miqdorini aniqlaydi."],
    [2,"Gaz yoki suyuqlik bosimini qaysi asbob o'lchaydi?","Manometr",["Dinamometr","Spidometr","Sekundomer"],"Manometr yopiq idishdagi bosimni ko'rsatadi."],
    [2,"Bir kilovatt necha vattga teng?","1000 Vt",["100 Vt","10 Vt","10 000 Vt"],"Kilo- prefiksi ming barobar kattalikni bildiradi."],
    [2,"Milli- prefiksi qanday ko'paytuvchini bildiradi?","10⁻³",["10⁻²","10⁻⁶","10³"],"Bir millimetr metrning mingdan bir qismiga teng."],
    [2,"Mikro- prefiksi qanday ko'paytuvchini bildiradi?","10⁻⁶",["10⁻³","10⁻⁹","10⁶"],"Bir mikrometr metrning milliondan bir qismiga teng."],
    [2,"Bir nanometr necha metrga teng?","10⁻⁹ m",["10⁻⁶ m","10⁻³ m","10⁻¹² m"],"Nano- prefiksi milliarddan bir qismni bildiradi."],
    [2,"Bir dyuym taxminan necha santimetrga teng?","2,54 sm",["1,5 sm","3,0 sm","5,0 sm"],"Dyuym xalqaro kelishuvga ko'ra aynan 2,54 santimetrga teng."],
    [2,"Bir kaloriya taxminan necha joulga teng?","4,18 J",["1,0 J","10 J","0,24 J"],"Kaloriya issiqlik miqdorining eski birligi bo'lib, 1 kal ≈ 4,18 J."],
    [2,"Bir atmosfera bosimi taxminan necha paskalga teng?","101 325 Pa",["760 Pa","1 000 Pa","10 000 Pa"],"Normal atmosfera bosimi 760 mm simob ustuniga, ya'ni taxminan 101 kPa ga teng."],
    [2,"Modda miqdorining Xalqaro birliklar tizimidagi birligi qaysi?","Mol",["Kandela","Kelvin","Amper"],"Bir mol moddada Avogadro doimiysiga teng zarrachalar bo'ladi."],
    [2,"Radioaktivlik hodisasini 1896-yilda birinchi bo'lib aniqlagan olim kim?","Anri Bekkerel",["Ernest Rezerford","Jeyms Chedvik","Nils Bor"],"Bekkerel uran tuzlarining ko'rinmas nurlar chiqarishini payqagan."],
    [3,"Absolyut nol harorati Selsiy shkalasida necha gradus?","−273,15 °C",["−100 °C","−212 °C","−373 °C"],"Absolyut nolda modda zarrachalarining issiqlik harakati minimal bo'ladi."],
    [3,"Avogadro doimiysining qiymati qanday?","6,02·10²³ mol⁻¹",["6,02·10²² mol⁻¹","6,02·10²⁴ mol⁻¹","1,60·10²³ mol⁻¹"],"Bir moldagi zarrachalar soni 6,02·10²³ ga teng."],
    [3,"Elementar elektr zaryadining qiymati qanday?","1,6·10⁻¹⁹ Kl",["1,6·10⁻¹⁶ Kl","1,6·10⁻²² Kl","9,1·10⁻¹⁹ Kl"],"Elektron va proton zaryadining moduli shu qiymatga teng."],
    [3,"Plank doimiysining qiymati qanday?","6,63·10⁻³⁴ J·s",["6,63·10⁻³¹ J·s","6,63·10⁻²⁶ J·s","1,38·10⁻²³ J·s"],"Plank doimiysi kvant mexanikasidagi asosiy doimiylardan biri."],
    [3,"Gravitatsiya doimiysining qiymati qanday?","6,67·10⁻¹¹ N·m²/kg²",["9,8 N·m²/kg²","6,67·10⁻⁷ N·m²/kg²","1,67·10⁻¹¹ N·m²/kg²"],"Bu qiymatni Kavendish 1798-yilda buralma tarozi yordamida o'lchagan."],
    [3,"Elektronning tinchlikdagi massasi qanday?","9,1·10⁻³¹ kg",["1,67·10⁻²⁷ kg","9,1·10⁻²⁷ kg","1,6·10⁻¹⁹ kg"],"Elektron massasi proton massasidan taxminan 1836 marta kichik."],
    [3,"Yorug'lik yili qanday kattalikning birligi?","Masofaning",["Vaqtning","Tezlikning","Yorqinlikning"],"Yorug'lik yili yorug'lik bir yilda bosib o'tadigan masofaga teng."],
    [3,"Bir astronomik birlik taxminan qancha masofaga teng?","150 mln km",["1,5 mln km","15 mln km","9,46 trln km"],"Astronomik birlik — Yerdan Quyoshgacha bo'lgan o'rtacha masofa."],
    [3,"Bir parsek taxminan necha yorug'lik yiliga teng?","3,26",["1,00","9,46","0,31"],"Parsek yulduzlar orasidagi masofalarni o'lchashda ishlatiladi."],
    [3,"Yorug'lik kuchining Xalqaro birliklar tizimidagi birligi qaysi?","Kandela",["Lumen","Lyuks","Nit"],"Kandela yorug'lik manbasining ma'lum yo'nalishdagi yorug'lik kuchini bildiradi."],
    [3,"Yorug'lik oqimining birligi qaysi?","Lumen",["Kandela","Lyuks","Vatt"],"Lumen manbadan chiqadigan umumiy yorug'lik oqimini o'lchaydi."],
    [3,"Nurlanishning yutilgan doza birligi (grey) nimaga teng?","1 kg moddaga yutilgan 1 J energiya",["1 kg moddaga yutilgan 1 kaloriya energiya","1 sekundda yutilgan 1 J energiya","1 m² yuzaga tushgan 1 J energiya"],"Grey nurlanish ta'sirida modda massasi birligiga yutilgan energiyani bildiradi."],
    [3,"Noaniqlik prinsipini kim ifodalagan?","Verner Geyzenberg",["Ervin Shryodinger","Pol Dirak","Nils Bor"],"Prinsipga ko'ra zarrachaning koordinatasi va impulsi bir vaqtda aniq bo'lmaydi."],
    [3,"To'lqin tenglamasini 1926-yilda taklif qilgan olim kim?","Ervin Shryodinger",["Verner Geyzenberg","Maks Plank","Enriko Fermi"],"Shryodinger tenglamasi kvant zarrachalarining holatini tavsiflaydi."],
    [3,"Antizarracha mavjudligini nazariy jihatdan asoslagan olim kim?","Pol Dirak",["Volfgang Pauli","Jeyms Chedvik","Robert Millikan"],"Dirak tenglamasidan elektronning musbat egizagi — pozitron kelib chiqadi."],
    [3,"Neytronni 1932-yilda kashf etgan olim kim?","Jeyms Chedvik",["Jozef Jon Tomson","Ernest Rezerford","Enriko Fermi"],"Neytron zaryadsiz zarracha bo'lib, yadro tarkibiga kiradi."],
    [3,"Neytrino mavjudligini 1930-yilda taklif qilgan olim kim?","Volfgang Pauli",["Pol Dirak","Verner Geyzenberg","Nils Bor"],"Pauli beta-yemirilishda energiya balansini tushuntirish uchun neytrinoni faraz qilgan."],
    [3,"Elektronni 1897-yilda kashf etgan olim kim?","Jozef Jon Tomson",["Jeyms Chedvik","Robert Millikan","Ernest Rezerford"],"Tomson katod nurlari zaryadli zarrachalardan iboratligini aniqlagan."],
    [3,"Elektron zaryadini birinchi bo'lib aniq o'lchagan olim kim?","Robert Millikan",["Jozef Jon Tomson","Ernest Rezerford","Genri Kavendish"],"Millikan moy tomchilari tajribasida elementar zaryadni aniqlagan."],
    [3,"Yorug'lik tezligini birinchi bo'lib taxminan aniqlagan astronom kim?","Ole Romer",["Genrix Gerts","Armand Fizo","Albert Maykelson"],"Romer Yupiter yo'ldoshlarining tutilishini kuzatib, yorug'lik tezligini baholagan."],
    [3,"Gravitatsiya doimiysini birinchi bo'lib o'lchagan olim kim?","Genri Kavendish",["Galileo Galiley","Iogann Kepler","Maykl Faradey"],"Kavendish buralma tarozi yordamida Yer massasini ham baholagan."],
    [3,"Sayyoralar harakati qonunlarini aniqlagan olim kim?","Iogann Kepler",["Nikolay Kopernik","Edvin Xabbl","Tixo Brage"],"Kepler aniq kuzatuvlar asosida sayyoralar harakatining uchta qonunini shakllantirgan."],
    [3,"Quyoshni markazga qo'ygan geliosentrik tizimni asoslagan olim kim?","Nikolay Kopernik",["Klaudiy Ptolemey","Iogann Kepler","Galileo Galiley"],"Kopernik Yer emas, Quyosh markazda turishini asoslagan."],
    [3,"Koinotning kengayishini kuzatishlar asosida aniqlagan olim kim?","Edvin Xabbl",["Albert Eynshteyn","Verner Geyzenberg","Enriko Fermi"],"Xabbl galaktikalar bizdan uzoqlashayotganini aniqlagan."]
  ]);
  var CONV = [
    // [savol shabloni, javob birligi, ko'paytuvchi, qiymatlar]
    ["{v} sm necha metr?", "m", 0.01, [5, 20, 35, 50, 120, 250, 375, 480]],
    ["{v} mm necha santimetr?", "sm", 0.1, [5, 20, 35, 70, 120, 250]],
    ["{v} km necha metr?", "m", 1000, [0.5, 1.2, 2, 3.5, 7, 12, 25]],
    ["{v} g necha kilogramm?", "kg", 0.001, [50, 200, 250, 500, 750, 1500, 2500]],
    ["{v} t necha kilogramm?", "kg", 1000, [0.2, 0.5, 1.5, 2, 3, 12]],
    ["{v} minut necha sekund?", "s", 60, [2, 3, 5, 10, 15, 20, 45]],
    ["{v} soat necha minut?", "min", 60, [0.5, 1.5, 2, 3, 4, 6]],
    ["{v} kN necha nyuton?", "N", 1000, [0.5, 2, 3.5, 5, 12, 40]],
    ["{v} MVt necha kilovatt?", "kVt", 1000, [0.5, 1, 2, 3, 15]],
    ["{v} mA necha amper?", "A", 0.001, [50, 100, 250, 500, 800, 1500]],
    ["{v} kPa necha paskal?", "Pa", 1000, [2, 5, 10, 100, 101]],
    ["{v} l necha m³?", "m³", 0.001, [5, 20, 100, 250, 500, 1000]],
    ["{v} sm² necha m²?", "m²", 0.0001, [100, 200, 500, 1000, 2500, 5000]],
    ["{v} dm³ necha litr?", "l", 1, [2, 5, 10, 25]]
  ];
  function P5(L) {
    var k = pick(lv(L, [0, 1, 2, 5], [0, 1, 2, 3, 5], [2, 3, 4, 5]));
    var it, c, v, ans;
    if (k === 0) { it = pick(UNITS);
      return TQ("<b>" + it[0] + "</b> — SI dagi birligi qaysi?", it[1], others(UNITS.map(function (u) { return u[1]; }), it[1], 3), [it[0] + " — " + it[1] + "."]); }
    if (k === 1) { it = pick(INSTR);
      return TQ("<b>" + it[0] + "</b> nimani o'lchaydi?", it[1], others(INSTR.map(function (u) { return u[1]; }), it[1], 3), [it[0] + " — " + it[1].toLowerCase() + " o'lchaydigan asbob."]); }
    if (k === 2) { var lst = lv(L, CONV.slice(0, 8), CONV, CONV.slice(5)); c = pick(lst); v = pick(c[3]); ans = Number((v * c[2]).toPrecision(6));
      var wr = c[2] >= 1 ? [v / c[2], v * c[2] * 10, v * c[2] / 10, v * 100] : [v / c[2], ans * 10, ans / 10, v * 10];
      return NQ(c[0].replace("{v}", f(v)), ans, c[1], wr.map(function (x) { return Number(x.toPrecision(6)); }), [f(v) + " · " + f(c[2]) + " = " + f(ans) + " " + c[1]]); }
    if (k === 3) { it = pick(PREF);
      return TQ("\"" + it[0] + "\" qo'shimchasi qanday ko'paytuvchini bildiradi?", it[1], others(PREF.map(function (p) { return p[1]; }), it[1], 3), ["\"" + it[0] + "\" = " + it[1] + "."]); }
    if (k === 4) { it = pick(INSTR);
      return TQ(it[1].replace(/ni$/, "") + " qaysi asbob bilan o'lchanadi?", it[0], others(INSTR.map(function (u) { return u[0]; }), it[0], 3), [it[0] + " " + it[1].toLowerCase() + " o'lchaydi."]); }
    return B5(L);
  }
  S.register("f5", P5, "Fizika · Kattaliklar, birliklar va olimlar");


  /* ================= k1 Kimyoviy elementlar va belgilar ================= */
  // [belgi, nomi, tartib raqami, tur (m — metall, n — metallmas, g — inert gaz), davr, guruh (A — bosh guruhcha)]
  var EL = [["H", "Vodorod", 1, "n", 1, "I"], ["He", "Geliy", 2, "g", 1, "VIII"], ["Li", "Litiy", 3, "m", 2, "I"], ["C", "Uglerod", 6, "n", 2, "IV"],
    ["N", "Azot", 7, "n", 2, "V"], ["O", "Kislorod", 8, "n", 2, "VI"], ["F", "Ftor", 9, "n", 2, "VII"], ["Ne", "Neon", 10, "g", 2, "VIII"],
    ["Na", "Natriy", 11, "m", 3, "I"], ["Mg", "Magniy", 12, "m", 3, "II"], ["Al", "Alyuminiy", 13, "m", 3, "III"], ["Si", "Kremniy", 14, "n", 3, "IV"],
    ["P", "Fosfor", 15, "n", 3, "V"], ["S", "Oltingugurt", 16, "n", 3, "VI"], ["Cl", "Xlor", 17, "n", 3, "VII"], ["Ar", "Argon", 18, "g", 3, "VIII"],
    ["K", "Kaliy", 19, "m", 4, "I"], ["Ca", "Kalsiy", 20, "m", 4, "II"], ["Cr", "Xrom", 24, "m", 4, ""], ["Mn", "Marganes", 25, "m", 4, ""],
    ["Fe", "Temir", 26, "m", 4, ""], ["Cu", "Mis", 29, "m", 4, ""], ["Zn", "Rux", 30, "m", 4, ""], ["Ag", "Kumush", 47, "m", 5, ""],
    ["Sn", "Qalay", 50, "m", 5, "IV"], ["I", "Yod", 53, "n", 5, "VII"], ["Ba", "Bariy", 56, "m", 6, "II"], ["Au", "Oltin", 79, "m", 6, ""],
    ["Hg", "Simob", 80, "m", 6, ""], ["Pb", "Qo'rg'oshin", 82, "m", 6, "IV"]];
  var TUR = { m: "Metall", n: "Metallmas", g: "Inert gaz" };
  function elOf(lst, n) { return shuffle(lst).slice(0, n); }
  var BK1 = bank([
    [1, "Havoning asosiy qismini (≈ 78%) qaysi gaz tashkil etadi?", "Azot", ["Kislorod", "Karbonat angidrid", "Vodorod"], "Havo: ≈ 78% N₂, ≈ 21% O₂."],
    [1, "Nafas olish va yonish uchun zarur gaz qaysi?", "Kislorod", ["Azot", "Geliy", "Argon"], "Yonish — kislorod bilan reaksiya."],
    [1, "Xona temperaturasida suyuq holatdagi metall qaysi?", "Simob", ["Temir", "Mis", "Natriy"], "Simob (Hg) — suyuq metall."],
    [1, "Eng yengil kimyoviy element qaysi?", "Vodorod", ["Geliy", "Litiy", "Kislorod"], "Vodorodning atom massasi ≈ 1."],
    [1, "Kimyoviy elementlar davriy jadvalini kim yaratgan?", "D. I. Mendeleyev", ["A. Lavuazye", "M. Lomonosov", "J. Dalton"], "Mendeleyev, 1869-yil."],
    [1, "Elektr simlari ko'pincha qaysi metalldan yasaladi?", "Mis", ["Qo'rg'oshin", "Simob", "Natriy"], "Mis tokni yaxshi o'tkazadi."],
    [1, "Havo sharlarini to'ldirishda ishlatiladigan yonmaydigan yengil gaz qaysi?", "Geliy", ["Vodorod", "Xlor", "Kislorod"], "Geliy yengil va inert."],
    [1, "Olmos va grafit qaysi elementdan iborat?", "Uglerod", ["Kremniy", "Oltingugurt", "Fosfor"], "Olmos va grafit — uglerodning allotropik shakllari."],
    [2, "Atomning yadrosi qanday zarralardan tashkil topgan?", "Proton va neytronlar", ["Elektron va protonlar", "Faqat elektronlar", "Elektron va neytronlar"], "Elektronlar yadro atrofida harakatlanadi."],
    [2, "Elementning tartib raqami nimaga teng?", "Yadrodagi protonlar soniga", ["Neytronlar soniga", "Atom massasiga", "Davr raqamiga"], "Z = protonlar soni = elektronlar soni (atomda)."],
    [2, "Er qobig'ida eng ko'p tarqalgan element qaysi?", "Kislorod", ["Kremniy", "Temir", "Alyuminiy"], "Er qobig'i massasining deyarli yarmi kislorod."],
    [2, "Er qobig'ida eng ko'p tarqalgan metall qaysi?", "Alyuminiy", ["Temir", "Kalsiy", "Natriy"], "Alyuminiy ≈ 8%."],
    [2, "Davriy jadvalda nechta davr bor?", "7 ta", ["8 ta", "18 ta", "10 ta"], "Gorizontal qatorlar — 7 ta davr."],
    [2, "Galogenlar qatoriga kiradigan element qaysi?", "Xlor", ["Natriy", "Kislorod", "Neon"], "Galogenlar: F, Cl, Br, I."],
    [2, "Ishqoriy metall qaysi?", "Natriy", ["Kalsiy", "Alyuminiy", "Temir"], "Ishqoriy metallar: Li, Na, K, Rb, Cs."],
    [2, "Qaysi metall eng yaxshi elektr o'tkazadi?", "Kumush", ["Temir", "Qo'rg'oshin", "Simob"], "Kumush — eng yaxshi o'tkazuvchi, keyin mis."],
    [2, "Qalqonsimon bez uchun zarur, dengiz o'tlarida ko'p bo'ladigan element qaysi?", "Yod", ["Xlor", "Ftor", "Bariy"], "Yod tanqisligi bo'qoq kasalligiga olib keladi."],
    [2, "Suyak va tishlar tarkibida ko'p bo'ladigan metall qaysi?", "Kalsiy", ["Natriy", "Kaliy", "Temir"], "Kalsiy fosfatlari suyak asosini tashkil etadi."],
    [3, "Bir elementning neytronlar soni turlicha bo'lgan atomlari nima deyiladi?", "Izotoplar", ["Izomerlar", "Ionlar", "Allotroplar"], "Izotoplar: protonlar soni bir xil, massa soni turlicha."],
    [3, "Element xossalari davriy ravishda nimaga bog'liq o'zgaradi (zamonaviy ta'rif)?", "Yadro zaryadiga", ["Atom massasiga", "Neytronlar soniga", "Zichligiga"], "Davriy qonunning zamonaviy ta'rifi — yadro zaryadi."],
    [3, "Davr bo'ylab chapdan o'ngga elementlarning metallik xossasi qanday o'zgaradi?", "Kamayadi", ["Ortadi", "O'zgarmaydi", "Avval ortadi"], "Metallmaslik xossasi ortadi."],
    [3, "Bosh guruhcha bo'ylab yuqoridan pastga metallik xossa qanday o'zgaradi?", "Ortadi", ["Kamayadi", "O'zgarmaydi", "Yo'qoladi"], "Atom radiusi ortadi, elektron oson beriladi."],
    [3, "Eng elektromanfiy element qaysi?", "Ftor", ["Kislorod", "Xlor", "Azot"], "Ftorning elektromanfiyligi eng yuqori (≈ 4.0)."],
    [3, "Bosh guruhcha elementlarida tashqi qavat elektronlari soni nimaga teng?", "Guruh raqamiga", ["Davr raqamiga", "Tartib raqamiga", "Neytronlar soniga"], "Masalan, Cl (VII A) — 7 ta tashqi elektron."],
    [3, "Davr raqami atom tuzilishida nimani ko'rsatadi?", "Elektron qavatlar sonini", ["Tashqi elektronlar sonini", "Neytronlar sonini", "Valentlikni"], "Masalan, Na 3-davr — 3 ta qavat."],
    [3, "¹²C atomida nechta neytron bor?", "6", ["12", "18", "0"], "Neytronlar = massa soni − protonlar = 12 − 6 = 6."],
    [1,"Temir elementining kimyoviy belgisi qaysi?","Fe",["Ti","Te","Fn"],"Temir lotincha «ferrum» so'zidan olingan, shuning uchun belgisi Fe."],
    [1,"Oltin elementining kimyoviy belgisi qaysi?","Au",["Or","Gt","Ol"],"Oltin lotincha «aurum» so'zidan olingan, shuning uchun belgisi Au."],
    [1,"Kumush elementining kimyoviy belgisi qaysi?","Ag",["Ku","Sl","Si"],"Kumush lotincha «argentum» so'zidan olingan, shuning uchun belgisi Ag."],
    [1,"Mis elementining kimyoviy belgisi qaysi?","Cu",["Ms","Cp","Mi"],"Mis lotincha «cuprum» so'zidan olingan, shuning uchun belgisi Cu."],
    [1,"Natriy elementining kimyoviy belgisi qaysi?","Na",["Nt","Nr","Ns"],"Natriy lotincha «natrium» so'zidan olingan, shuning uchun belgisi Na."],
    [1,"Kaliy elementining kimyoviy belgisi qaysi?","K",["Ka","Kl","Ky"],"Kaliy lotincha «kalium» so'zidan olingan, shuning uchun belgisi K."],
    [1,"Qo'rg'oshin elementining kimyoviy belgisi qaysi?","Pb",["Qo","Pl","Qr"],"Qo'rg'oshin lotincha «plumbum» so'zidan olingan, belgisi Pb."],
    [1,"Rux elementining kimyoviy belgisi qaysi?","Zn",["Ru","Rx","Rz"],"Rux nemischa «Zink» so'zidan olingan, belgisi Zn."],
    [1,"Fosfor elementining kimyoviy belgisi qaysi?","P",["Fs","Fo","Ph"],"Fosfor belgisi P — elementning lotincha «phosphorus» nomidan olingan."],
    [1,"Oltingugurt elementining kimyoviy belgisi qaysi?","S",["Ol","Su","Sg"],"Oltingugurt belgisi S — lotincha «sulfur» so'zidan olingan."],
    [1,"Xlor elementining kimyoviy belgisi qaysi?","Cl",["Xl","Ch","Xr"],"Xlor belgisi Cl — yunoncha «xloros» (sarg'ish-yashil) so'zidan olingan."],
    [1,"Magniy elementining kimyoviy belgisi qaysi?","Mg",["Ma","Mn","Mp"],"Magniy Gretsiyaning Magnesia viloyati nomidan olingan, belgisi Mg."],
    [1,"Kislorod elementining kimyoviy belgisi qaysi?","O",["Ks","Ki","Ox"],"Kislorod belgisi O — lotincha «oxygenium» so'zidan olingan."],
    [1,"Vodorod elementining kimyoviy belgisi qaysi?","H",["V","Vd","Hy"],"Vodorod belgisi H — lotincha «hydrogenium» so'zidan olingan."],
    [1,"Azot elementining kimyoviy belgisi qaysi?","N",["Az","At","Nz"],"Azot belgisi N — lotincha «nitrogenium» so'zidan olingan."],
    [1,"Davriy jadvalning uzun shaklida nechta guruh bor?","18 ta",["7 ta","12 ta","16 ta"],"Zamonaviy davriy jadvalda 18 ta guruh mavjud."],
    [1,"Xlor oddiy sharoitda qanday agregat holatda bo'ladi?","Gaz",["Suyuq","Qattiq","Plazma"],"Xlor (Cl₂) xona temperaturasida sariq-yashil rangdagi gaz."],
    [1,"Oddiy sharoitda suyuq holatda bo'lgan nometall element qaysi?","Brom",["Yod","Ftor","Xlor"],"Brom (Br₂) xona temperaturasida qo'ng'ir-qizil suyuqlik holatida bo'ladi."],
    [1,"Eng og'ir tabiiy kimyoviy element qaysi?","Uran",["Temir","Qo'rg'oshin","Oltin"],"Uran (U, tartib raqami 92) tabiatda uchraydigan eng og'ir element."],
    [1,"«Au» belgisi qaysi elementga tegishli?","Oltin",["Alyuminiy","Argon","Azot"],"Au belgisi lotincha «aurum» — oltin ma'nosini anglatadi."],
    [1,"«Fe» belgisi qaysi elementga tegishli?","Temir",["Ftor","Fosfor","Fransiy"],"Fe belgisi lotincha «ferrum» — temir ma'nosini anglatadi."],
    [1,"«Pb» belgisi qaysi elementga tegishli?","Qo'rg'oshin",["Fosfor","Platina","Poloniy"],"Pb belgisi lotincha «plumbum» — qo'rg'oshin ma'nosini anglatadi."],
    [1,"Davriy jadvalning uzun shaklida inert gazlar qaysi guruhda joylashgan?","18-guruhda",["1-guruhda","17-guruhda","2-guruhda"],"18-guruh inert gazlar: geliy, neon, argon, kripton, ksenon, radon."],
    [1,"Neon elementining kimyoviy belgisi qaysi?","Ne",["Na","Ng","Nn"],"Neon belgisi Ne — yunoncha «neos» (yangi) so'zidan olingan."],
    [1,"Eng yengil metall qaysi?","Litiy",["Natriy","Magniy","Alyuminiy"],"Litiy (Li) — eng yengil metall, zichligi 0,53 g/sm³."],
    [1,"Davriy jadvalda jami nechta element bor?","118 ta",["92 ta","103 ta","108 ta"],"Hozirgi kunda davriy jadvalda 118 ta element tasdiqlangan."],
    [1,"Olmos tabiatdagi qattiqlik jihatidan qanday o'rinda turadi?","Eng qattiq",["Eng yumshoq","O'rtacha qattiq","Ikkinchi o'rinda"],"Olmos uglerodning allotropik shakli bo'lib, Mohs shkalasi bo'yicha qattiqligi 10 — tabiatdagi eng qattiq modda."],
    [1,"Argon elementining kimyoviy belgisi qaysi?","Ar",["Ag","An","Al"],"Argon belgisi Ar — yunoncha «argos» (harakatsiz) so'zidan olingan."],
    [1,"«Cu» belgisi qaysi elementga tegishli?","Mis",["Kobalt","Uglerod","Xlor"],"Cu belgisi lotincha «cuprum» — mis ma'nosini anglatadi."],
    [1,"Qaysi metall suv bilan shiddat bilan reaksiyaga kirishib, vodorod ajratadi?","Natriy",["Temir","Mis","Oltin"],"Natriy (Na) suv bilan kuchli reaksiyaga kirishadi: 2Na + 2H₂O → 2NaOH + H₂↑."],
    [1,"Qaysi element «K» belgisi bilan belgilanadi?","Kaliy",["Kobalt","Kripton","Xlor"],"K belgisi lotincha «kalium» so'zidan olingan — kaliy elementi."],
    [1,"Volfram elementining kimyoviy belgisi qaysi?","W",["Vo","Vf","Wl"],"Volfram belgisi W — nemischa «Wolfram» so'zidan olingan."],
    [1,"Qalay elementining kimyoviy belgisi qaysi?","Sn",["Qa","Sl","St"],"Qalay belgisi Sn — lotincha «stannum» so'zidan olingan."],
    [2,"Yer qobig'ida ikkinchi o'rinda tarqalgan element qaysi?","Kremniy",["Temir","Kaliy","Magniy"],"Yer qobig'ining taxminan 27,7% ini kremniy (Si) tashkil etadi."],
    [2,"Kislorodning allotropik shakli bo'lgan ozon formulasi qaysi?","O₃",["O₂","O₄","O"],"Ozon uch atom kisloroddan tashkil topgan (O₃) va atmosferani UV nurlardan himoya qiladi."],
    [2,"Suv molekulasining kimyoviy formulasi qaysi?","H₂O",["HO","H₂O₂","HO₂"],"Suv ikki vodorod va bir kislorod atomidan tashkil topgan: H₂O."],
    [2,"Osh tuzi (natriy xlorid) kimyoviy formulasi qaysi?","NaCl",["NaOH","Na₂O","NaCO₃"],"Osh tuzi natriy va xlor ionlaridan tashkil topgan: NaCl."],
    [2,"Karbonat angidrid (uglerod (IV) oksid) formulasi qaysi?","CO₂",["CO","C₂O","CO₃"],"Karbonat angidrid bir uglerod va ikki kislorod atomidan iborat: CO₂."],
    [2,"Amfoter element deb qaysi element ataladi?","Alyuminiy (Al)",["Natriy (Na)","Temir (Fe)","Xlor (Cl)"],"Alyuminiy ham kislota, ham ishqor bilan reaksiyaga kirishuvchi amfoter element hisoblanadi."],
    [2,"Kaliy metali suv bilan qanday reaksiyaga kirishadi?","Portlash bilan",["Reaksiyaga kirmaydi","Sekin eriydi","Faqat qizdirilganda reaksiya beradi"],"Kaliy (K) suv bilan juda shiddatli, portlash bilan reaksiyaga kirishadi: 2K + 2H₂O → 2KOH + H₂↑."],
    [2,"Davriy jadvalning III-davrida ikkinchi element qaysi?","Magniy (Mg)",["Natriy (Na)","Alyuminiy (Al)","Kremniy (Si)"],"III-davr elementlari: Na, Mg, Al, Si, P, S, Cl, Ar. Magniy ikkinchi o'rinda turadi."],
    [2,"Metallar davriy jadvalning qaysi qismida joylashgan?","Chap va pastki qismida",["O'ng tomonida","Yuqori qismida","Markazida"],"Metallar davriy jadvalning chap va pastki qismini egallaydi, nometallar esa o'ng tomonida joylashgan."],
    [2,"Qaysi gaz «issiqxona effekti»da asosiy rol o'ynaydi?","Uglerod (IV) oksid (CO₂)",["Azot (N₂)","Kislorod (O₂)","Argon (Ar)"],"CO₂ quyosh nurini o'tkazib, Yerning infraqizil nurlanishini ushlab qoladi — bu issiqxona effekti."],
    [2,"Qaysi metall magnitga tortilmaydi?","Mis",["Temir","Nikel","Kobalt"],"Mis (Cu) magnit xossasiga ega emas, temir, nikel va kobalt esa ferromagnit materiallar."],
    [2,"Davriy jadvalning uzun shaklida galogenlar qaysi guruhda joylashgan?","17-guruh",["15-guruh","16-guruh","1-guruh"],"Galogenlar: F, Cl, Br, I, At — davriy jadvalning 17-guruhida joylashgan."],
    [2,"Metallar ichida eng yuqori erish haroratiga ega element qaysi?","Volfram (W)",["Temir (Fe)","Platina (Pt)","Titan (Ti)"],"Volframning erish harorati 3422 °C bo'lib, barcha metallar orasida eng yuqori."],
    [2,"Is gazi — uglerod (II) oksid (CO) qanday gaz hisoblanadi?","Zaharli gaz",["Yonmaydigan gaz","Zararsiz gaz","Kislorodga o'xshash gaz"],"CO — rangsiz, hidsiz zaharli gaz; u qon gemoglobini bilan birikib, kislorod tashishni to'xtatadi."],
    [2,"Po'lat qaysi elementning asosiy qotishmasi?","Temir (Fe)",["Xlor (Cl)","Magniy (Mg)","Rux (Zn)"],"Po'lat — temir (Fe) asosidagi qotishma bo'lib, unga ozgina uglerod qo'shiladi."],
    [2,"Vodorod peroksidning kimyoviy formulasi qaysi?","H₂O₂",["H₂O","HO","H₂O₃"],"Vodorod peroksid (H₂O₂) oksidlovchi xossasiga ega; tibbiyotda dezinfektsiya uchun ishlatiladi."],
    [2,"Qaysi element davriy jadvalda 1-guruh, 1-davrda joylashgan?","Vodorod (H)",["Litiy (Li)","Geliy (He)","Natriy (Na)"],"Vodorod (H) davriy jadvalning 1-guruh, 1-davrida joylashgan eng birinchi element."],
    [2,"Kaltsiy karbonat (ohaktosh) kimyoviy formulasi qaysi?","CaCO₃",["CaCl₂","Ca(OH)₂","CaO"],"Ohaktosh asosan kaltsiy karbonat (CaCO₃) dan iborat; qurilishda keng qo'llaniladi."],
    [2,"Sulfat kislotasining kimyoviy formulasi qaysi?","H₂SO₄",["HSO₄","H₂SO₃","H₂S"],"Sulfat kislota (H₂SO₄) eng kuchli mineral kislotalardan biri; sanoatda keng ishlatiladi."],
    [2,"Qaysi gaz yoqilganda suv va karbonat angidrid hosil bo'ladi?","Metan (CH₄)",["Azot (N₂)","Argon (Ar)","Vodorod sulfid (H₂S)"],"Metan (CH₄) + 2O₂ → CO₂ + 2H₂O — to'liq yonish reaksiyasi."],
    [2,"Neon elementining tartib raqami qaysi?","10",["8","12","18"],"Neon (Ne) davriy jadvalda 10-o'rinda turadi, ya'ni yadrosida 10 ta proton bor."],
    [2,"Qaysi modda kuchli asos (ishqor) hisoblanadi?","Natriy gidroksid (NaOH)",["Suv (H₂O)","Spirt (C₂H₅OH)","Karbonat angidrid (CO₂)"],"NaOH — kuchli ishqor, suvda to'liq dissotsilanadi: NaOH → Na⁺ + OH⁻."],
    [3,"Birinchi ionlanish energiyasi nimani ifodalaydi?","Neytral atomdan elektron uzib olishga ketadigan minimal energiyani",["Ikki atom o'rtasidagi bog' energiyasini","Yadrodagi proton energiyasini","Kimyoviy reaksiya issiqligini"],"Ionlanish energiyasi — 1 mol neytral gaz atomidan 1 mol elektron uzib olishga sarflanadigan energiya."],
    [3,"Davriy jadvalning bir davrida chapdan o'ngga atomlar radiusi qanday o'zgaradi?","Kamayadi",["Ortadi","O'zgarmaydi","Avval ortib, keyin kamayadi"],"Bir davr bo'yicha chapdan o'ngga protonlar soni ortadi, elektron qavat soni o'zgarmaydi — siqilish kuchayib, radius kamayadi."],
    [3,"Elektromanfiylik bo'yicha elementlarning to'g'ri tartibi qaysi (o'sib boruvchi)?","Na < Mg < Al < Cl < F",["F < Cl < Al < Mg < Na","Al < Na < Mg < F < Cl","Mg < Al < Na < Cl < F"],"Elektromanfiylik davrda chapdan o'ngga va guruhda pastdan yuqoriga ortadi; F — eng elektromanfiy element."],
    [3,"Izotoplar bir-biridan nima bilan farq qiladi?","Neytronlar soni bilan",["Protonlar soni bilan","Elektronlar soni bilan","Davr raqami bilan"],"Izotoplar — yadro zaryadi (protonlar soni) bir xil, lekin neytronlar soni turli atomlar."],
    [3,"¹⁴C izotopida nechta neytron bor?","8 ta",["6 ta","14 ta","7 ta"],"¹⁴C: massa soni 14, protonlar soni 6 (uglerod); neytronlar = 14 − 6 = 8."],
    [3,"Qaysi element birinchi davrdagi yagona inert gaz hisoblanadi?","Geliy (He)",["Neon (Ne)","Argon (Ar)","Vodorod (H)"],"Geliy (He) birinchi davrdagi yagona inert gaz; u 18-guruhda joylashgan."],
    [3,"Atom tuzilishida elektron qavatlari sonini nima belgilaydi?","Davr raqami",["Guruh raqami","Tartib raqami","Nisbiy atom massasi"],"Davriy jadvalda element qaysi davrda tursa, uning atomida shuncha elektron qavat bor."],
    [3,"Ftor elementining elektromanfiyligi Pauling shkalasi bo'yicha taxminan qancha?","4,0",["3,0","2,5","3,5"],"Ftor (F) Pauling shkalasida elektromanfiyligi 4,0 — barcha elementlar ichida eng yuqori."],
    [3,"Davriy jadvalning 2-davrida jami nechta element bor?","8 ta",["2 ta","18 ta","32 ta"],"2-davrda: Li, Be, B, C, N, O, F, Ne — jami 8 ta element."],
    [3,"Metallarning elektromanfiyligi odatda qanday bo'ladi?","Past (1,0–2,0 oralig'ida)",["Yuqori (3,0–4,0)","O'rta (2,5)","Nolga teng"],"Metallar elektronni berishga moyil bo'lgani uchun elektromanfiyliklari past — Pauling shkalasida 1,0–2,0."],
    [3,"Davriy jadvalning bir guruhida yuqoridan pastga metallik xossa ortishining sababi nima?","Atom radiusi ortib, tashqi elektronlar yadroga sustroq tortiladi",["Protonlar sonining ortishi","Elektronlar sonining kamayishi","Nisbiy massa oshishi"],"Radius ortgani sari tashqi elektronlar yadrodan uzoqlashadi va oson beriladi — metallik xossa kuchayadi."],
    [3,"Qaysi elementning oksidi ham kislota, ham ishqor bilan reaksiyaga kirishadi?","Alyuminiy oksidi (Al₂O₃)",["Natriy oksidi (Na₂O)","Temir (III) oksidi (Fe₂O₃)","Magniy oksidi (MgO)"],"Al₂O₃ amfoter oksid: HCl bilan ham, NaOH bilan ham reaksiyaga kirishadi."],
    [3,"Elektronlar qavatlarda qanday tartibda joylashadi?","Energiyasi past qavatlarda avval to'ladi",["Energiyasi yuqori qavatlarda avval to'ladi","Tartibsiz joylashadi","Faqat eng tashqi qavat to'ladi"],"Aufbau tamoyiliga ko'ra, elektronlar eng avval energiyasi eng past orbitallarni to'ldiradi."],
    [3,"Xlor atomi neytral holatda nechta elektron qavat va nechta valentlik elektroniga ega?","3 qavat, 7 valentlik elektroni",["2 qavat, 7 valentlik elektroni","3 qavat, 5 valentlik elektroni","4 qavat, 7 valentlik elektroni"],"Xlor (Cl, tartib raqami 17) uchinchi davrda, 17-guruhda: 3 elektron qavat, 7 valentlik elektroni."],
    [3,"Qaysi element inert xossaga ega va deyarli reaksiyaga kirishmaydi?","Argon (Ar)",["Azot (N₂)","Vodorod (H₂)","Oltingugurt (S)"],"Argon (Ar) — 18-guruh inert gazi, valentlik qavati to'liq (8 ta elektron), kimyoviy reaksiyaga kirishmaydi."],
    [3,"Davriy jadvalda lantanoidlar qaysi davr va guruhga kiradi?","6-davr, 3-guruh (f-elementlar)",["4-davr, 4-guruh","7-davr, 2-guruh","5-davr, 1-guruh"],"Lantanoidlar (La dan Lu gacha) 6-davrning f-blokiga kiradi va jadvaldagi alohida qatorga chiqariladi."],
    [3,"Atom massasi birligi (a.m.b.) nima asosida belgilangan?","¹²C izotopining 1/12 qismi",["Vodorod atomining massasi","Proton massasi","Elektron massasi"],"1 a.m.b. = ¹²C izotopi massasining 1/12 qismi — bu xalqaro standart."],
    [3,"Qaysi element d-blokka kiradi va bir nechta oksidlanish darajasiga ega?","Temir (Fe)",["Natriy (Na)","Magniy (Mg)","Alyuminiy (Al)"],"Temir o'tish metali bo'lib, +2 va +3 oksidlanish darajalarini ko'rsatadi — d-blok elementiga xos xossa."],
    [3,"Davriy jadvalning bir davrida chapdan o'ngga nometallik xossa qanday o'zgaradi?","Ortadi",["Kamayadi","O'zgarmaydi","Avval kamayib, keyin ortadi"],"Davr bo'yicha chapdan o'ngga elektromanfiylik va nometallik ortadi, chunki yadroning tortish kuchi kuchayadi."]
  ]);
  function K1(L) {
    var k = pick(lv(L, [0, 1, 0, 1, 2, 9], [0, 1, 2, 3, 4, 9], [3, 4, 5, 6, 7, 8, 9]));
    var pool = lv(L, EL.filter(function (e) { return e[2] <= 30 || /Ag|Au|Hg|Pb|I$/.test(e[0]); }), EL, EL), e = pick(pool), ws;
    if (k === 0) { ws = elOf(EL.filter(function (x) { return x[0] !== e[0]; }), 3).map(function (x) { return x[1]; });
      if (e[0] === "Na") ws[0] = "Neon"; if (e[0] === "K") ws[0] = "Kalsiy"; if (e[0] === "S") ws[0] = "Kremniy";
      ws = ws.filter(function (x, i) { return ws.indexOf(x) === i && x !== e[1]; }); while (ws.length < 3) { ws.push(pick(EL)[1]); ws = ws.filter(function (x, i) { return ws.indexOf(x) === i && x !== e[1]; }); }
      return TQ("Kimyoviy belgisi <b>" + e[0] + "</b> bo'lgan element qaysi?", e[1], ws, [e[0] + " — " + e[1] + " (tartib raqami " + e[2] + ")."]); }
    if (k === 1) { ws = elOf(EL.filter(function (x) { return x[0] !== e[0]; }), 3).map(function (x) { return x[0]; });
      if (e[0] === "Na") ws[0] = "N"; if (e[0] === "Ag") ws[0] = "Au"; if (e[0] === "Au") ws[0] = "Ag"; if (e[0] === "K") ws[0] = "Ca"; if (e[0] === "Cu") ws[0] = "Cr";
      ws = ws.filter(function (x, i) { return ws.indexOf(x) === i && x !== e[0]; }); while (ws.length < 3) { ws.push(pick(EL)[0]); ws = ws.filter(function (x, i) { return ws.indexOf(x) === i && x !== e[0]; }); }
      ws = shuffle(ws); if (e[0] === "Na") ws.sort(function (x, y) { return (x.charAt(0) === "N" ? 1 : 0) - (y.charAt(0) === "N" ? 1 : 0); });
      return Q("<b>" + e[1] + "</b> elementining kimyoviy belgisi qaysi?", e[0], ws, [e[1] + " — " + e[0] + "."]); }
    if (k === 2) { var isM = R(0, 1) === 1, yes = pick(EL.filter(function (x) { return isM ? x[3] === "m" : x[3] === "n"; })),
        no = shuffle(EL.filter(function (x) { return isM ? x[3] !== "m" : x[3] === "m"; })).slice(0, 3);
      return TQ("Quyidagilardan qaysi biri " + (isM ? "<b>metall</b>" : "<b>metallmas</b>") + "?", yes[1] + " (" + yes[0] + ")", no.map(function (x) { return x[1] + " (" + x[0] + ")"; }),
        [yes[1] + " — " + TUR[yes[3]].toLowerCase() + "; qolganlari: " + no.map(function (x) { return x[0] + " — " + TUR[x[3]].toLowerCase(); }).join(", ") + "."]); }
    if (k === 3) { return NQ("<b>" + e[1] + " (" + e[0] + ")</b> — tartib raqami nechchi?", e[2], "", [e[2] + 1, e[2] - 1, e[2] * 2, e[2] + 2, e[2] + 8].filter(function (x) { return x > 0; }), [e[1] + " — davriy jadvalda " + e[2] + "-o'rinda."]); }
    if (k === 4) { ws = elOf(EL.filter(function (x) { return x[0] !== e[0]; }), 3).map(function (x) { return x[1] + " (" + x[0] + ")"; });
      return TQ("Tartib raqami <b>" + e[2] + "</b> bo'lgan element qaysi?", e[1] + " (" + e[0] + ")", ws, ["Z = " + e[2] + " — " + e[1] + "."]); }
    if (k === 5) { e = pick(EL.slice(0, 18));
      return NQ("<b>" + e[1] + " (" + e[0] + ")</b> atomida nechta elektron bor?", e[2], "", [e[2] + 1, e[2] - 1, e[2] * 2, e[2] + 2], ["Neytral atomda elektronlar soni = tartib raqami = " + e[2] + "."]); }
    if (k === 6) { e = pick(EL.filter(function (x) { return x[2] <= 20; }));
      return NQ("<b>" + e[1] + " (" + e[0] + ")</b> davriy jadvalning nechanchi davrida joylashgan?", e[4], "", [1, 2, 3, 4, 5].filter(function (x) { return x !== e[4]; }), [e[1] + " — " + e[4] + "-davr (elektron qavatlari soni " + e[4] + ")."]); }
    if (k === 7) { e = pick(EL.filter(function (x) { return x[5] && x[2] <= 20 && x[0] !== "H"; }));
      return TQ("<b>" + e[1] + " (" + e[0] + ")</b> qaysi guruhning bosh guruhchasida joylashgan?", e[5] + " guruh", ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].filter(function (x) { return x !== e[5]; }).map(function (x) { return x + " guruh"; }).sort(function () { return Math.random() - 0.5; }).slice(0, 4),
        [e[1] + " — " + e[5] + " A guruh."]); }
    if (k === 8) { var gs = EL.filter(function (x) { return x[3] === "g"; }), g = pick(gs), nn = shuffle(EL.filter(function (x) { return x[3] !== "g"; })).slice(0, 3);
      return TQ("Quyidagilardan qaysi biri inert (asl) gaz?", g[1], nn.map(function (x) { return x[1]; }), ["He, Ne, Ar — inert gazlar (VIII A guruh)."]); }
    return BK1(L);
  }
  S.register("k1", K1, "Kimyo · Kimyoviy elementlar va belgilar");


  /* ================= k2 Molyar massa va modda miqdori ================= */
  var AR = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 64 };
  var ANOM = { H: "vodorod", C: "uglerod", N: "azot", O: "kislorod", Na: "natriy", Mg: "magniy", Al: "alyuminiy", S: "oltingugurt", Cl: "xlor", K: "kaliy", Ca: "kalsiy", Fe: "temir", Cu: "mis" };
  // [formula (HTML), tarkib [[element, soni]...], nomi]
  var FM = [
    ["H<sub>2</sub>O", [["H", 2], ["O", 1]], "suv"], ["CO<sub>2</sub>", [["C", 1], ["O", 2]], "karbonat angidrid"], ["NaCl", [["Na", 1], ["Cl", 1]], "osh tuzi"],
    ["H<sub>2</sub>SO<sub>4</sub>", [["H", 2], ["S", 1], ["O", 4]], "sulfat kislota"], ["HCl", [["H", 1], ["Cl", 1]], "xlorid kislota"], ["NaOH", [["Na", 1], ["O", 1], ["H", 1]], "natriy gidroksid"],
    ["CaCO<sub>3</sub>", [["Ca", 1], ["C", 1], ["O", 3]], "kalsiy karbonat"], ["O<sub>2</sub>", [["O", 2]], "kislorod"], ["N<sub>2</sub>", [["N", 2]], "azot"],
    ["NH<sub>3</sub>", [["N", 1], ["H", 3]], "ammiak"], ["CH<sub>4</sub>", [["C", 1], ["H", 4]], "metan"], ["HNO<sub>3</sub>", [["H", 1], ["N", 1], ["O", 3]], "nitrat kislota"],
    ["KOH", [["K", 1], ["O", 1], ["H", 1]], "kaliy gidroksid"], ["MgO", [["Mg", 1], ["O", 1]], "magniy oksid"], ["Fe<sub>2</sub>O<sub>3</sub>", [["Fe", 2], ["O", 3]], "temir(III) oksid"],
    ["CuSO<sub>4</sub>", [["Cu", 1], ["S", 1], ["O", 4]], "mis(II) sulfat"], ["C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>", [["C", 6], ["H", 12], ["O", 6]], "glyukoza"],
    ["Al<sub>2</sub>O<sub>3</sub>", [["Al", 2], ["O", 3]], "alyuminiy oksid"], ["CaO", [["Ca", 1], ["O", 1]], "kalsiy oksid"], ["SO<sub>2</sub>", [["S", 1], ["O", 2]], "oltingugurt(IV) oksid"],
    ["H<sub>2</sub>", [["H", 2]], "vodorod"], ["CO", [["C", 1], ["O", 1]], "is gazi"], ["MgCl<sub>2</sub>", [["Mg", 1], ["Cl", 2]], "magniy xlorid"], ["CuO", [["Cu", 1], ["O", 1]], "mis(II) oksid"],
    ["SO<sub>3</sub>", [["S", 1], ["O", 3]], "oltingugurt(VI) oksid"], ["Ca(OH)<sub>2</sub>", [["Ca", 1], ["O", 2], ["H", 2]], "kalsiy gidroksid"], ["KCl", [["K", 1], ["Cl", 1]], "kaliy xlorid"],
    ["Na<sub>2</sub>CO<sub>3</sub>", [["Na", 2], ["C", 1], ["O", 3]], "natriy karbonat"]];
  var GAS = ["O<sub>2</sub>", "N<sub>2</sub>", "CO<sub>2</sub>", "H<sub>2</sub>", "CH<sub>4</sub>", "NH<sub>3</sub>", "SO<sub>2</sub>", "CO", "HCl"];
  function MM(fm) { var s = 0; fm[1].forEach(function (p) { s += AR[p[0]] * p[1]; }); return s; }
  function mmStep(fm) { return "M(" + fm[0] + ") = " + fm[1].map(function (p) { return (p[1] > 1 ? p[1] + "·" : "") + AR[p[0]]; }).join(" + ") + " = " + f(MM(fm)) + " g/mol"; }
  function mmWrong(fm) { // tipik xatolar: indeksni unutish, indeksni noto'g'ri elementga qo'yish
    var M = MM(fm), w = [], s1 = 0; fm[1].forEach(function (p) { s1 += AR[p[0]]; }); w.push(s1);
    fm[1].forEach(function (p, i) { if (p[1] > 1) { w.push(M - AR[p[0]]); w.push(M + AR[p[0]]); } else if (i === fm[1].length - 1) w.push(M + AR[p[0]]); });
    w.push(M + 2, M - 2, M + 16, M - 1, M + 1); return w.filter(function (x) { return x > 0 && x !== M; });
  }
  var BK2 = bank([
    [1, "Modda miqdorining SI dagi birligi qaysi?", "Mol", ["Gramm", "Litr", "g/mol"], "Modda miqdori (ν yoki n) — mol."],
    [1, "Molyar massaning birligi qaysi?", "g/mol", ["mol", "g", "l/mol"], "M = m/n ⇒ g/mol."],
    [2, "1 mol moddadagi zarralar soni (Avogadro soni) qancha?", "6.02·10²³", ["6.02·10²²", "22.4", "1.6·10⁻¹⁹"], "N_A ≈ 6.02·10²³ mol⁻¹."],
    [2, "Normal sharoitda 1 mol istalgan gazning hajmi qancha?", "22.4 l", ["1 l", "11.2 l", "44.8 l"], "Molyar hajm V_m = 22.4 l/mol (n.sh.)."],
    [2, "Modda miqdori formulasi qaysi?", "n = m/M", ["n = m·M", "n = m − M", "n = V·22.4"], "n = m / M."],
    [3, "Normal sharoit (n.sh.) qanday sharoit?", "0 °C va 101.3 kPa", ["25 °C va 100 kPa", "100 °C va 1 atm", "20 °C va 101.3 kPa"], "n.sh.: T = 273 K, p = 101.3 kPa."],
    [3, "Avogadro qonuni: bir xil sharoitda teng hajmdagi gazlarda nima teng bo'ladi?", "Molekulalar soni", ["Massalar", "Zichliklar", "Molyar massalar"], "Teng hajm ⇒ teng molekulalar soni."],
    [3, "Gazning vodorodga nisbatan zichligi 16 ga teng. Uning molyar massasi qancha?", "32 g/mol", ["16 g/mol", "8 g/mol", "64 g/mol"], "M = 2·D(H₂) = 2 · 16 = 32 g/mol."],
    [1,"Suvning (H2O) molyar massasi qancha?","18 g/mol",["16 g/mol","20 g/mol","34 g/mol"],"M(H2O) = 2·1 + 16 = 18 g/mol."],
    [1,"Karbonat angidrid gazining (CO2) molyar massasi qancha?","44 g/mol",["28 g/mol","32 g/mol","56 g/mol"],"M(CO2) = 12 + 2·16 = 44 g/mol."],
    [1,"Osh tuzining (NaCl) molyar massasi qancha?","58,5 g/mol",["35,5 g/mol","40 g/mol","74,5 g/mol"],"M(NaCl) = 23 + 35,5 = 58,5 g/mol."],
    [1,"Ohaktoshning asosiy tarkibi bo'lgan CaCO3 ning molyar massasi qancha?","100 g/mol",["84 g/mol","56 g/mol","116 g/mol"],"M(CaCO3) = 40 + 12 + 3·16 = 100 g/mol."],
    [1,"Sulfat kislotaning (H2SO4) molyar massasi qancha?","98 g/mol",["80 g/mol","64 g/mol","100 g/mol"],"M(H2SO4) = 2·1 + 32 + 4·16 = 98 g/mol."],
    [1,"Natriy gidroksidning (NaOH) molyar massasi qancha?","40 g/mol",["23 g/mol","56 g/mol","17 g/mol"],"M(NaOH) = 23 + 16 + 1 = 40 g/mol."],
    [1,"Kislorod gazining (O2) molyar massasi qancha?","32 g/mol",["16 g/mol","48 g/mol","64 g/mol"],"O2 molekulasi ikki atomdan iborat: 2·16 = 32 g/mol."],
    [1,"2 mol suvning massasi qancha?","36 g",["18 g","9 g","72 g"],"m = n·M = 2 mol · 18 g/mol = 36 g."],
    [1,"3 mol karbonat angidrid (CO2) massasi qancha?","132 g",["44 g","88 g","176 g"],"m = 3 mol · 44 g/mol = 132 g."],
    [1,"0,5 mol natriy gidroksid (NaOH) massasi qancha?","20 g",["40 g","10 g","80 g"],"m = 0,5 mol · 40 g/mol = 20 g."],
    [1,"49 g sulfat kislota qancha mol moddaga to'g'ri keladi?","0,5 mol",["1 mol","2 mol","0,25 mol"],"n = m/M = 49 g : 98 g/mol = 0,5 mol."],
    [1,"Normal sharoitda 11,2 l gaz necha mol bo'ladi?","0,5 mol",["1 mol","2 mol","0,25 mol"],"n = V/Vm = 11,2 l : 22,4 l/mol = 0,5 mol."],
    [1,"Normal sharoitda 44,8 l gaz qancha mol moddaga teng?","2 mol",["1 mol","4 mol","0,5 mol"],"n = 44,8 l : 22,4 l/mol = 2 mol."],
    [1,"Temirning (Fe) nisbiy atom massasi 56 bo'lsa, uning molyar massasi qancha?","56 g/mol",["26 g/mol","112 g/mol","5,6 g/mol"],"Molyar massa son jihatdan nisbiy atom massasiga teng, birligi g/mol."],
    [1,"Metanning (CH4) nisbiy molekulyar massasi qancha?","16",["12","14","20"],"Mr(CH4) = 12 + 4·1 = 16."],
    [1,"Ammiakning (NH3) nisbiy molekulyar massasi qancha?","17",["14","15","18"],"Mr(NH3) = 14 + 3·1 = 17."],
    [1,"12 g magniy (Mg) necha mol bo'ladi? (Ar(Mg) = 24)","0,5 mol",["1 mol","2 mol","0,25 mol"],"n = 12 g : 24 g/mol = 0,5 mol."],
    [2,"Normal sharoitda 1 mol vodorod (H2) gazining massasi qancha?","2 g",["1 g","22,4 g","4 g"],"M(H2) = 2 g/mol, shuning uchun 1 mol H2 ning massasi 2 g."],
    [2,"2 mol moddada nechta molekula bor?","12,04·10²³ ta",["6,02·10²³ ta","3,01·10²³ ta","24,08·10²³ ta"],"N = n·NA = 2 · 6,02·10²³ = 12,04·10²³."],
    [2,"0,1 mol suvning massasi qancha?","1,8 g",["18 g","0,18 g","3,6 g"],"m = 0,1 mol · 18 g/mol = 1,8 g."],
    [2,"Alyuminiy oksidning (Al2O3) molyar massasi qancha? (Ar(Al) = 27)","102 g/mol",["43 g/mol","75 g/mol","129 g/mol"],"M(Al2O3) = 2·27 + 3·16 = 102 g/mol."],
    [2,"Kalsiy gidroksidning (Ca(OH)2) molyar massasi qancha?","74 g/mol",["57 g/mol","56 g/mol","90 g/mol"],"M = 40 + 2·(16 + 1) = 74 g/mol."],
    [2,"Normal sharoitda 5,6 l azot (N2) ning massasi qancha?","7 g",["14 g","28 g","3,5 g"],"n = 5,6 : 22,4 = 0,25 mol; m = 0,25 · 28 = 7 g."],
    [2,"88 g karbonat angidrid normal sharoitda qancha hajm egallaydi?","44,8 l",["22,4 l","67,2 l","89,6 l"],"n = 88 : 44 = 2 mol; V = 2 · 22,4 = 44,8 l."],
    [2,"4 g vodorod (H2) normal sharoitda qancha hajm egallaydi?","44,8 l",["22,4 l","11,2 l","89,6 l"],"n = 4 : 2 = 2 mol; V = 2 · 22,4 = 44,8 l."],
    [2,"32 g kislorod (O2) tarkibida nechta molekula bor?","6,02·10²³ ta",["12,04·10²³ ta","3,01·10²³ ta","32·10²³ ta"],"n = 32 : 32 = 1 mol, demak N = NA = 6,02·10²³."],
    [2,"0,5 mol temirda nechta atom bor?","3,01·10²³ ta",["6,02·10²³ ta","1,505·10²³ ta","12,04·10²³ ta"],"N = 0,5 · 6,02·10²³ = 3,01·10²³."],
    [2,"Temir(III) oksidning (Fe2O3) molyar massasi qancha? (Ar(Fe) = 56)","160 g/mol",["72 g/mol","136 g/mol","216 g/mol"],"M(Fe2O3) = 2·56 + 3·16 = 160 g/mol."],
    [2,"Soda — natriy karbonatning (Na2CO3) molyar massasi qancha?","106 g/mol",["84 g/mol","100 g/mol","122 g/mol"],"M(Na2CO3) = 2·23 + 12 + 3·16 = 106 g/mol."],
    [2,"6,5 g ruxda (Zn) necha mol modda bor? (Ar(Zn) = 65)","0,1 mol",["1 mol","0,5 mol","0,01 mol"],"n = 6,5 g : 65 g/mol = 0,1 mol."],
    [2,"Karbonat angidridning vodorodga nisbatan zichligi qancha?","22",["44","11","14"],"D(H2) = M(CO2) : M(H2) = 44 : 2 = 22."],
    [2,"Gazning havoga nisbatan zichligi 2 ga teng (M(havo) = 29 g/mol). Gazning molyar massasi qancha?","58 g/mol",["14,5 g/mol","31 g/mol","116 g/mol"],"M = D(havo)·29 = 2·29 = 58 g/mol."],
    [2,"1 mol suv molekulalari tarkibida jami necha mol atom bor?","3 mol",["1 mol","2 mol","18 mol"],"Bitta H2O molekulasida 3 ta atom (2 ta H va 1 ta O) bor."],
    [2,"Fosfat kislotaning (H3PO4) molyar massasi qancha? (Ar(P) = 31)","98 g/mol",["82 g/mol","96 g/mol","114 g/mol"],"M(H3PO4) = 3·1 + 31 + 4·16 = 98 g/mol."],
    [3,"3,01·10²³ ta suv molekulasining massasi qancha?","9 g",["18 g","4,5 g","36 g"],"n = 3,01·10²³ : 6,02·10²³ = 0,5 mol; m = 0,5 · 18 = 9 g."],
    [3,"Normal sharoitda 67,2 l ammiak (NH3) ning massasi qancha?","51 g",["17 g","34 g","68 g"],"n = 67,2 : 22,4 = 3 mol; m = 3 · 17 = 51 g."],
    [3,"Massasi 16 g bo'lgan gaz normal sharoitda 5,6 l hajm egallaydi. Uning molyar massasi qancha?","64 g/mol",["32 g/mol","16 g/mol","44 g/mol"],"n = 5,6 : 22,4 = 0,25 mol; M = 16 : 0,25 = 64 g/mol."],
    [3,"Normal sharoitda azotning zichligi qancha (g/l)?","1,25 g/l",["0,625 g/l","2,5 g/l","1,43 g/l"],"ρ = M : Vm = 28 g/mol : 22,4 l/mol = 1,25 g/l."],
    [3,"Tarkibida 6,02·10²³ ta kislorod atomi bo'lgan CO2 ning massasi qancha?","22 g",["44 g","11 g","32 g"],"1 mol O atomi 0,5 mol CO2 da bor; m = 0,5 · 44 = 22 g."],
    [3,"49 g sulfat kislota tarkibida jami necha mol atom bor?","3,5 mol",["7 mol","0,5 mol","1,75 mol"],"0,5 mol H2SO4 da har molekulada 7 atom: 0,5 · 7 = 3,5 mol."],
    [3,"Temir(III) sulfatning Fe2(SO4)3 molyar massasi qancha? (Ar(Fe) = 56, Ar(S) = 32)","400 g/mol",["152 g/mol","344 g/mol","448 g/mol"],"M = 2·56 + 3·(32 + 4·16) = 112 + 288 = 400 g/mol."],
    [3,"1 mol ammiak (NH3) tarkibida nechta vodorod atomi bor?","18,06·10²³ ta",["6,02·10²³ ta","12,04·10²³ ta","54,18·10²³ ta"],"Har molekulada 3 ta H: 3 · 6,02·10²³ = 18,06·10²³."],
    [3,"Massasi 2,8 g gaz normal sharoitda 2,24 l hajm egallaydi. Gazning molyar massasi qancha?","28 g/mol",["14 g/mol","56 g/mol","32 g/mol"],"n = 2,24 : 22,4 = 0,1 mol; M = 2,8 : 0,1 = 28 g/mol."],
    [3,"Suvdagi kislorodning massa ulushi taxminan qancha?","88,9 %",["11,1 %","50 %","94,4 %"],"w(O) = 16 : 18 ≈ 0,889, ya'ni 88,9 %."],
    [3,"CaCO3 dagi kalsiyning massa ulushi qancha?","40 %",["12 %","48 %","60 %"],"w(Ca) = 40 : 100 = 0,40, ya'ni 40 %."],
    [3,"Metandagi (CH4) vodorodning massa ulushi qancha?","25 %",["75 %","20 %","12,5 %"],"w(H) = 4 : 16 = 0,25, ya'ni 25 %."],
    [3,"1 g vodorod (H2) va 1 g kislorod (O2) dan qaysi birida molekulalar soni ko'p?","Vodorodda",["Kislorodda","Ikkalasida teng","Ularni hisoblab bo'lmaydi"],"1 g H2 = 0,5 mol, 1 g O2 = 1/32 mol; vodorodda 16 marta ko'p."],
    [2,"Normal sharoitda 1 l kislorod gazining massasi taxminan qancha?","1,43 g",["0,71 g","2,86 g","32 g"],"m = 32 g : 22,4 l ≈ 1,43 g."],
    [3,"Normal sharoitda 1,12 l gazning massasi 2,2 g bo'lsa, gaz qaysi?","Karbonat angidrid (CO2)",["Kislorod (O2)","Azot (N2)","Metan (CH4)"],"n = 1,12 : 22,4 = 0,05 mol; M = 2,2 : 0,05 = 44 g/mol, bu CO2 ga mos."]
  ]);
  function K2(L) {
    var k = pick(lv(L, [0, 0, 1, 2, 9], [0, 1, 2, 3, 4, 5, 9], [3, 4, 5, 6, 7, 8, 9]));
    var fm = pick(FM), M = MM(fm), n, m, V, g, el, frac;
    if (k === 0) { if (L === 1) fm = pick(FM.filter(function (x) { return MM(x) <= 100 && MM(x) === Math.round(MM(x)); })); M = MM(fm);
      return NQ("<b>" + fm[0] + "</b> (" + fm[2] + ") ning molyar massasi necha g/mol?", M, "g/mol", mmWrong(fm), [mmStep(fm)]); }
    if (k === 1) { fm = pick(FM.filter(function (x) { return MM(x) === Math.round(MM(x)); })); M = MM(fm); n = pick([0.5, 1, 2, 3, 4, 5, 0.1, 0.2]); m = n * M;
      return NQ(f(m) + " g <b>" + fm[0] + "</b> necha mol bo'ladi?", n, "mol", [M / m, n * 2, n + 1, n * 10], [mmStep(fm), "n = m / M = " + f(m) + " : " + f(M) + " = " + f(n) + " mol"]); }
    if (k === 2) { n = pick([0.5, 1, 2, 3, 4, 5, 0.2, 0.1]); m = n * M;
      return NQ(n + " mol <b>" + fm[0] + "</b> moddaning massasi necha gramm?", m, "g", [M / n, M, m * 2, n + M], [mmStep(fm), "m = n · M = " + n + " · " + f(M) + " = " + f(m) + " g"]); }
    if (k === 3) { g = pick(GAS); n = pick([0.5, 1, 2, 3, 0.25, 0.1, 5]); V = n * 22.4;
      return NQ("Normal sharoitda " + n + " mol " + g + " qancha hajmni egallaydi? (l da)", Number(V.toFixed(2)), "l", [n * 22.4 * 2, 22.4 / n, n * 11.2, 22.4], ["V = n · 22.4 = " + n + " · 22.4 = " + f(Number(V.toFixed(2))) + " l"]); }
    if (k === 4) { g = pick(GAS); n = pick([0.5, 1, 2, 3, 0.25, 0.1, 5]); V = Number((n * 22.4).toFixed(2));
      return NQ("Normal sharoitda " + f(V) + " l " + g + " necha mol?", n, "mol", [V * 22.4, n * 2, n / 2, n + 1], ["n = V / 22.4 = " + f(V) + " : 22.4 = " + n + " mol"]); }
    if (k === 5) { var gf = pick(FM.filter(function (x) { return GAS.indexOf(x[0]) > -1 && MM(x) === Math.round(MM(x)); })); M = MM(gf); n = pick([0.5, 1, 2, 0.25, 0.1, 3]); m = n * M; V = Number((n * 22.4).toFixed(2));
      return NQ(f(m) + " g " + gf[0] + " normal sharoitda necha litr hajmni egallaydi?", V, "l", [m * 22.4, 22.4, V * 2, m], [mmStep(gf), "n = " + f(m) + " : " + M + " = " + n + " mol, V = " + n + " · 22.4 = " + f(V) + " l"]); }
    if (k === 6) { fm = pick(FM.filter(function (x) { return x[1].length > 1; })); M = MM(fm);
      el = pick(fm[1]); frac = Math.round(AR[el[0]] * el[1] / M * 1000) / 10;
      var w1 = Math.round(AR[el[0]] / M * 1000) / 10;
      return NQ("<b>" + fm[0] + "</b> tarkibidagi " + ANOM[el[0]] + "ning massa ulushi necha foiz? (javobni 0.1 gacha yaxlitlang)", frac, "%", [w1, 100 - frac, Math.round(frac / 2 * 10) / 10, frac + 10], [mmStep(fm), "ω(" + el[0] + ") = " + (el[1] > 1 ? el[1] + "·" : "") + AR[el[0]] + " : " + f(M) + " · 100% = " + f(frac) + "%"]); }
    if (k === 7) { g = pick(["6.02·10²³", "3.01·10²³", "1.204·10²⁴"]); n = g === "6.02·10²³" ? 1 : g === "3.01·10²³" ? 0.5 : 2;
      return NQ(g + " ta " + fm[0] + " molekulasi necha mol bo'ladi?", n, "mol", [n * 2, n / 2, n * 6.02, n + 1], ["n = N / N_A = " + g + " : 6.02·10²³ = " + n + " mol"]); }
    if (k === 8) { var gs2 = pick([["O<sub>2</sub>", 32], ["CO<sub>2</sub>", 44], ["CH<sub>4</sub>", 16], ["N<sub>2</sub>", 28], ["SO<sub>2</sub>", 64], ["NH<sub>3</sub>", 17]]);
      return NQ(gs2[0] + " ning vodorodga nisbatan zichligi nechaga teng?", gs2[1] / 2, "", [gs2[1], gs2[1] * 2, gs2[1] / 4, gs2[1] / 29], ["D(H₂) = M / 2 = " + gs2[1] + " : 2 = " + f(gs2[1] / 2)]); }
    return BK2(L);
  }
  S.register("k2", K2, "Kimyo · Molyar massa va modda miqdori");


  /* ================= k3 Asosiy tushunchalar va reaksiyalar ================= */
  // [formula, sinf, nomi]
  var CLS = [["CO₂", "Oksid", "Uglerod(IV) oksid"], ["CaO", "Oksid", "Kalsiy oksid"], ["Na₂O", "Oksid", "Natriy oksid"], ["SO₃", "Oksid", "Oltingugurt(VI) oksid"],
    ["Fe₂O₃", "Oksid", "Temir(III) oksid"], ["P₂O₅", "Oksid", "Fosfor(V) oksid"], ["CuO", "Oksid", "Mis(II) oksid"], ["Al₂O₃", "Oksid", "Alyuminiy oksid"],
    ["MgO", "Oksid", "Magniy oksid"], ["ZnO", "Oksid", "Rux oksid"], ["K₂O", "Oksid", "Kaliy oksid"], ["SiO₂", "Oksid", "Kremniy(IV) oksid"], ["SO₂", "Oksid", "Oltingugurt(IV) oksid"],
    ["Li₂O", "Oksid", "Litiy oksid"], ["BaO", "Oksid", "Bariy oksid"], ["FeO", "Oksid", "Temir(II) oksid"], ["CO", "Oksid", "Uglerod(II) oksid"], ["N₂O₅", "Oksid", "Azot(V) oksid"],
    ["HCl", "Kislota", "Xlorid kislota"], ["H₂SO₄", "Kislota", "Sulfat kislota"], ["HNO₃", "Kislota", "Nitrat kislota"], ["H₃PO₄", "Kislota", "Fosfat kislota"],
    ["H₂CO₃", "Kislota", "Karbonat kislota"], ["H₂S", "Kislota", "Sulfid kislota"], ["HBr", "Kislota", "Bromid kislota"], ["HI", "Kislota", "Yodid kislota"],
    ["HF", "Kislota", "Ftorid kislota"], ["H₂SO₃", "Kislota", "Sulfit kislota"], ["HNO₂", "Kislota", "Nitrit kislota"], ["H₂SiO₃", "Kislota", "Silikat kislota"],
    ["NaOH", "Asos", "Natriy gidroksid"], ["KOH", "Asos", "Kaliy gidroksid"], ["Ca(OH)₂", "Asos", "Kalsiy gidroksid"], ["Cu(OH)₂", "Asos", "Mis(II) gidroksid"],
    ["Fe(OH)₃", "Asos", "Temir(III) gidroksid"], ["Ba(OH)₂", "Asos", "Bariy gidroksid"], ["LiOH", "Asos", "Litiy gidroksid"], ["Mg(OH)₂", "Asos", "Magniy gidroksid"], ["Fe(OH)₂", "Asos", "Temir(II) gidroksid"],
    ["NaCl", "Tuz", "Natriy xlorid"], ["CaCO₃", "Tuz", "Kalsiy karbonat"], ["CuSO₄", "Tuz", "Mis(II) sulfat"], ["KNO₃", "Tuz", "Kaliy nitrat"], ["Na₂SO₄", "Tuz", "Natriy sulfat"],
    ["AgCl", "Tuz", "Kumush xlorid"], ["K₃PO₄", "Tuz", "Kaliy fosfat"], ["MgCl₂", "Tuz", "Magniy xlorid"], ["KCl", "Tuz", "Kaliy xlorid"], ["CaCl₂", "Tuz", "Kalsiy xlorid"],
    ["Na₂CO₃", "Tuz", "Natriy karbonat"], ["AgNO₃", "Tuz", "Kumush nitrat"], ["BaSO₄", "Tuz", "Bariy sulfat"], ["ZnSO₄", "Tuz", "Rux sulfat"], ["FeCl₃", "Tuz", "Temir(III) xlorid"],
    ["Ca(NO₃)₂", "Tuz", "Kalsiy nitrat"], ["K₂CO₃", "Tuz", "Kaliy karbonat"], ["Na₂S", "Tuz", "Natriy sulfid"], ["Ca₃(PO₄)₂", "Tuz", "Kalsiy fosfat"]];
  // [formula, an'anaviy (tarixiy) nomi]
  var TRIV = [["NaCl", "Osh tuzi"], ["H₂O", "Suv"], ["CO₂", "Karbonat angidrid"], ["CaCO₃", "Bo'r (ohaktosh)"], ["CaO", "So'ndirilmagan ohak"], ["Ca(OH)₂", "So'ndirilgan ohak"],
    ["NaHCO₃", "Ichimlik sodasi"], ["Na₂CO₃", "Kalsinatsiyalangan soda"], ["NaOH", "O'yuvchi natriy"], ["NH₃", "Ammiak"], ["CH₄", "Metan"], ["O₃", "Ozon"],
    ["H₂O₂", "Vodorod peroksid"], ["SiO₂", "Kvars (qum)"], ["CO", "Is gazi"], ["CuSO₄·5H₂O", "Mis kuporosi"]];
  // [tenglama, turi]
  var RXN = [["2H₂ + O₂ → 2H₂O", "Birikish"], ["CaO + H₂O → Ca(OH)₂", "Birikish"], ["S + O₂ → SO₂", "Birikish"], ["4Al + 3O₂ → 2Al₂O₃", "Birikish"], ["N₂ + 3H₂ → 2NH₃", "Birikish"],
    ["2Mg + O₂ → 2MgO", "Birikish"], ["C + O₂ → CO₂", "Birikish"], ["SO₃ + H₂O → H₂SO₄", "Birikish"], ["2Na + Cl₂ → 2NaCl", "Birikish"],
    ["CaCO₃ → CaO + CO₂", "Parchalanish"], ["2H₂O → 2H₂ + O₂", "Parchalanish"], ["2KMnO₄ → K₂MnO₄ + MnO₂ + O₂", "Parchalanish"], ["Cu(OH)₂ → CuO + H₂O", "Parchalanish"], ["2HgO → 2Hg + O₂", "Parchalanish"],
    ["2KClO₃ → 2KCl + 3O₂", "Parchalanish"], ["2H₂O₂ → 2H₂O + O₂", "Parchalanish"], ["2Fe(OH)₃ → Fe₂O₃ + 3H₂O", "Parchalanish"],
    ["Zn + 2HCl → ZnCl₂ + H₂", "O'rin olish"], ["Fe + CuSO₄ → FeSO₄ + Cu", "O'rin olish"], ["2Na + 2H₂O → 2NaOH + H₂", "O'rin olish"], ["Mg + H₂SO₄ → MgSO₄ + H₂", "O'rin olish"],
    ["CuO + H₂ → Cu + H₂O", "O'rin olish"], ["Fe + 2HCl → FeCl₂ + H₂", "O'rin olish"], ["Zn + CuSO₄ → ZnSO₄ + Cu", "O'rin olish"], ["Cl₂ + 2KBr → 2KCl + Br₂", "O'rin olish"],
    ["NaOH + HCl → NaCl + H₂O", "Almashinish"], ["AgNO₃ + KCl → AgCl + KNO₃", "Almashinish"], ["BaCl₂ + H₂SO₄ → BaSO₄ + 2HCl", "Almashinish"], ["CuSO₄ + 2NaOH → Cu(OH)₂ + Na₂SO₄", "Almashinish"],
    ["KOH + HNO₃ → KNO₃ + H₂O", "Almashinish"], ["BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl", "Almashinish"], ["CaO + 2HCl → CaCl₂ + H₂O", "Almashinish"], ["FeCl₃ + 3NaOH → Fe(OH)₃ + 3NaCl", "Almashinish"]];
  // [tenglama (? — so'ralayotgan koeffitsient), javob]
  var BAL = [["2H₂ + O₂ → <b>?</b>H₂O", 2], ["<b>?</b>H₂ + O₂ → 2H₂O", 2], ["N₂ + <b>?</b>H₂ → 2NH₃", 3], ["N₂ + 3H₂ → <b>?</b>NH₃", 2], ["4Al + <b>?</b>O₂ → 2Al₂O₃", 3],
    ["<b>?</b>Al + 3O₂ → 2Al₂O₃", 4], ["Zn + <b>?</b>HCl → ZnCl₂ + H₂", 2], ["2Na + Cl₂ → <b>?</b>NaCl", 2], ["CH₄ + <b>?</b>O₂ → CO₂ + 2H₂O", 2], ["CH₄ + 2O₂ → CO₂ + <b>?</b>H₂O", 2],
    ["<b>?</b>Mg + O₂ → 2MgO", 2], ["4P + <b>?</b>O₂ → 2P₂O₅", 5], ["2KClO₃ → 2KCl + <b>?</b>O₂", 3], ["Fe₂O₃ + <b>?</b>H₂ → 2Fe + 3H₂O", 3], ["2C₂H₆ + <b>?</b>O₂ → 4CO₂ + 6H₂O", 7],
    ["CuSO₄ + <b>?</b>NaOH → Cu(OH)₂ + Na₂SO₄", 2], ["<b>?</b>Fe + 3Cl₂ → 2FeCl₃", 2], ["2Fe + <b>?</b>Cl₂ → 2FeCl₃", 3],
    ["<b>?</b>Ca + O₂ → 2CaO", 2], ["2KClO₃ → <b>?</b>KCl + 3O₂", 2], ["Fe + <b>?</b>HCl → FeCl₂ + H₂", 2], ["2Al + <b>?</b>HCl → 2AlCl₃ + 3H₂", 6], ["2Al + 6HCl → 2AlCl₃ + <b>?</b>H₂", 3],
    ["FeCl₃ + <b>?</b>NaOH → Fe(OH)₃ + 3NaCl", 3], ["<b>?</b>Fe(OH)₃ → Fe₂O₃ + 3H₂O", 2], ["C₂H₄ + <b>?</b>O₂ → 2CO₂ + 2H₂O", 3], ["2C₂H₂ + <b>?</b>O₂ → 4CO₂ + 2H₂O", 5],
    ["C₃H₈ + <b>?</b>O₂ → 3CO₂ + 4H₂O", 5], ["C₃H₈ + 5O₂ → <b>?</b>CO₂ + 4H₂O", 3], ["4Na + O₂ → <b>?</b>Na₂O", 2]];
  // [modda, valentlik so'raladigan element, javob]
  var VAL = [["H₂O", "kislorod", "II"], ["NH₃", "azot", "III"], ["CH₄", "uglerod", "IV"], ["HCl", "xlor", "I"], ["CO₂", "uglerod", "IV"],
    ["Fe₂O₃", "temir", "III"], ["FeO", "temir", "II"], ["SO₂", "oltingugurt", "IV"], ["SO₃", "oltingugurt", "VI"], ["Al₂O₃", "alyuminiy", "III"], ["P₂O₅", "fosfor", "V"],
    ["Na₂O", "natriy", "I"], ["CaO", "kalsiy", "II"], ["CuO", "mis", "II"], ["Cu₂O", "mis", "I"], ["Cl₂O₇", "xlor", "VII"], ["MgCl₂", "magniy", "II"], ["H₂S", "oltingugurt", "II"],
    ["NO₂", "azot", "IV"], ["N₂O₅", "azot", "V"], ["N₂O₃", "azot", "III"], ["PH₃", "fosfor", "III"], ["SiO₂", "kremniy", "IV"], ["K₂O", "kaliy", "I"], ["MgO", "magniy", "II"],
    ["Mn₂O₇", "marganes", "VII"], ["MnO₂", "marganes", "IV"], ["CrO₃", "xrom", "VI"], ["Cr₂O₃", "xrom", "III"], ["AlCl₃", "alyuminiy", "III"], ["FeCl₂", "temir", "II"], ["FeCl₃", "temir", "III"], ["PbO₂", "qo'rg'oshin", "IV"]];
  // [modda, element, oksidlanish darajasi]
  var OXD = [["H₂SO₄", "oltingugurt", "+6"], ["HNO₃", "azot", "+5"], ["H₃PO₄", "fosfor", "+5"], ["KMnO₄", "marganes", "+7"], ["K₂Cr₂O₇", "xrom", "+6"], ["Na₂SO₃", "oltingugurt", "+4"],
    ["H₂S", "oltingugurt", "−2"], ["NH₃", "azot", "−3"], ["HClO₄", "xlor", "+7"], ["KClO₃", "xlor", "+5"], ["CO", "uglerod", "+2"], ["CH₄", "uglerod", "−4"], ["Fe₂O₃", "temir", "+3"],
    ["H₂O₂", "kislorod", "−1"], ["CO₂", "uglerod", "+4"], ["NO₂", "azot", "+4"], ["N₂O₅", "azot", "+5"], ["Cl₂", "xlor", "0"], ["NaH", "vodorod", "−1"], ["HCl", "xlor", "−1"],
    ["SO₂", "oltingugurt", "+4"], ["P₂O₅", "fosfor", "+5"], ["MnO₂", "marganes", "+4"], ["KNO₂", "azot", "+3"]];
  var OXD_S = ["−4", "−3", "−2", "−1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7"];
  // indikatorlar: [nomi, kislotali, ishqoriy, neytral]
  var IND = [["Lakmus", "Qizil", "Ko'k", "Binafsha"], ["Fenolftalein", "Rangsiz", "Malina", "Rangsiz"], ["Metiloranj", "Qizil", "Sariq", ""]];
  var MUH = ["kislotali", "ishqoriy", "neytral"], RANG = ["Qizil", "Ko'k", "Binafsha", "Rangsiz", "Malina", "Sariq", "Yashil"];
  function sub2n(s) { return parseInt(s.replace(/[₀-₉]/g, function (c) { return String(c.charCodeAt(0) - 8320); }), 10); }
  function atomN(fm) {   // formuladagi jami atomlar soni (qavslar hisobga olinadi)
    var tot = 0, re = /\(([^)]*)\)([₀-₉]*)|([A-Z][a-z]?)([₀-₉]*)/g, m;
    while ((m = re.exec(fm))) tot += m[1] ? atomN(m[1]) * (m[2] ? sub2n(m[2]) : 1) : (m[4] ? sub2n(m[4]) : 1);
    return tot;
  }
  function elemN(fm) { var u = []; (fm.match(/[A-Z][a-z]?/g) || []).forEach(function (e) { if (u.indexOf(e) < 0) u.push(e); }); return u.length; }
  function lead(fm) { return fm.match(/^[A-Z][a-z]?/)[0]; }
  // o'xshash formulalar (bir xil birinchi element) — yaxshi chalg'ituvchi
  function nearCls(it, idx, n) {
    var sim = shuffle(CLS.filter(function (x) { return x !== it && lead(x[0]) === lead(it[0]); })), rest = shuffle(CLS.filter(function (x) { return x !== it && lead(x[0]) !== lead(it[0]); }));
    var out = []; sim.slice(0, 2).concat(rest).forEach(function (x) { if (out.length < n && out.indexOf(x[idx]) < 0 && x[idx] !== it[idx]) out.push(x[idx]); });
    return out;
  }
  function K3x(k, L) {
    var it, i, a, st;
    if (k === 10) { it = pick(TRIV);
      if (Math.random() < 0.5) return TQ("<b>" + it[1] + "</b> — kimyoviy formulasi qaysi?", it[0], others(TRIV.map(function (x) { return x[0]; }), it[0], 4), [it[1] + " — " + it[0] + "."]);
      return TQ("<b>" + it[0] + "</b> qanday nom bilan ataladi?", it[1], others(TRIV.map(function (x) { return x[1]; }), it[1], 4), [it[0] + " — " + it[1].toLowerCase() + "."]); }
    if (k === 11) { it = pick(CLS);
      if (Math.random() < 0.5) return TQ("<b>" + it[0] + "</b> moddasining nomi qaysi?", it[2], nearCls(it, 2, 4), [it[0] + " — " + it[2] + "."]);
      return TQ("<b>" + it[2] + "</b>ning formulasi qaysi?", it[0], nearCls(it, 0, 4), [it[2] + " — " + it[0] + "."]); }
    if (k === 12) { var d = pick(IND.slice(0, L === 1 ? 2 : 3)), t = R(0, 2), w;
      if (t === 2 && !d[3]) t = 0;
      a = d[1 + t];
      var red = { Qizil: "Malina", Malina: "Qizil" };
      w = RANG.filter(function (x) { return x !== a && x !== red[a]; });
      if (d[0] !== "Metiloranj" && Math.random() < 0.5) { var ph = t === 0 ? pick([1, 2, 3, 4]) : t === 1 ? pick([10, 11, 12]) : 7;
        return TQ("pH = " + ph + " bo'lgan eritmaga " + d[0].toLowerCase() + " tomizildi. Eritma qanday rangga kiradi?", a, shuffle(w).slice(0, 4),
          ["pH " + (ph < 7 ? "< 7 — kislotali" : ph > 7 ? "> 7 — ishqoriy" : "= 7 — neytral") + " muhit.", d[0] + " " + MUH[t] + " muhitda — " + a.toLowerCase() + "."]); }
      if (t !== 2 && !(d[0] === "Fenolftalein" && t === 0) && !(d[0] === "Metiloranj" && t === 1) && Math.random() < 0.4)
        return TQ("Qaysi muhitda " + d[0].toLowerCase() + " <b>" + a.toLowerCase() + "</b> rangga kiradi?", cap(MUH[t]), MUH.filter(function (x, j) { return j !== t; }).map(cap).concat(["Har qanday muhitda"]),
          [d[0] + ": kislotada — " + d[1].toLowerCase() + ", ishqorda — " + d[2].toLowerCase() + (d[3] ? ", neytralda — " + d[3].toLowerCase() : "") + "."]);
      return TQ("<b>" + d[0] + "</b> " + MUH[t] + " muhitda qanday rangda bo'ladi?", a, shuffle(w).slice(0, 4),
        [d[0] + ": kislotada — " + d[1].toLowerCase() + ", ishqorda — " + d[2].toLowerCase() + (d[3] ? ", neytralda — " + d[3].toLowerCase() : "") + "."]); }
    if (k === 13) { it = pick(L === 1 ? CLS.slice(0, 40).concat(TRIV.slice(0, 15)) : CLS.concat(TRIV.slice(0, 15))); var fm = it[0], n = atomN(fm), e = elemN(fm);
      if (Math.random() < 0.6 || e === n) return NQ("<b>" + fm + "</b> formulasida jami nechta atom bor?", n, "", [n + 1, n - 1, e, n + 2, n * 2, n + 3].filter(function (z) { return z > 0 && z !== n; }), ["Indekslarni qo'shamiz (qavs tashqarisidagi indeks ichidagilarni ko'paytiradi).", fm + " — " + n + " ta atom."]);
      return NQ("<b>" + fm + "</b> moddasi nechta kimyoviy elementdan tuzilgan?", e, "", [e + 1, e - 1, n, e + 2, e + 3].filter(function (z) { return z > 0 && z !== e; }), [fm + " tarkibida " + e + " xil element bor."]); }
    it = pick(OXD); i = OXD_S.indexOf(it[2]);
    return TQ("<b>" + it[0] + "</b> da " + it[1] + "ning oksidlanish darajasi nechaga teng?", it[2], OXD_S.filter(function (x, j) { return j !== i && Math.abs(j - i) <= 4; }).sort(function () { return Math.random() - 0.5; }).slice(0, 4),
      ["Molekulada oksidlanish darajalari yig'indisi 0 ga teng (odatda H — +1, O — −2)."]);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var BK3 = bank([
    [1, "Quyidagilardan qaysi biri kimyoviy hodisa?", "Temirning zanglashi", ["Muzning erishi", "Suvning qaynashi", "Shishaning sinishi"], "Zanglashda yangi modda hosil bo'ladi."],
    [1, "Quyidagilardan qaysi biri fizik hodisa?", "Suvning bug'lanishi", ["Yog'ochning yonishi", "Sutning achishi", "Temirning zanglashi"], "Bug'lanishda modda tarkibi o'zgarmaydi."],
    [1, "Qaysi belgi kimyoviy reaksiya borganini ko'rsatadi?", "Gaz ajralishi yoki cho'kma tushishi", ["Moddaning maydalanishi", "Shaklning o'zgarishi", "Erish"], "Rang o'zgarishi, gaz, cho'kma, issiqlik — reaksiya belgilari."],
    [1, "Toza moddaga misol qaysi?", "Distillangan suv", ["Havo", "Dengiz suvi", "Tuproq"], "Qolganlari — aralashmalar."],
    [1, "Aralashmaga misol qaysi?", "Havo", ["Kislorod", "Distillangan suv", "Oltin"], "Havo — gazlar aralashmasi."],
    [1, "Suv va qum aralashmasini qanday ajratish mumkin?", "Filtrlash", ["Magnit bilan", "Bug'latib", "Distillash"], "Erimaydigan qum filtrda qoladi."],
    [1, "Osh tuzi eritmasidan tuzni qanday ajratib olish mumkin?", "Bug'latish", ["Filtrlash", "Magnit bilan", "Tindirish"], "Suv bug'lanadi, tuz qoladi."],
    [1, "Temir qipig'i va oltingugurt kukuni aralashmasini qanday ajratish mumkin?", "Magnit yordamida", ["Filtrlash", "Bug'latish", "Distillash"], "Temir magnitga tortiladi."],
    [2, "Lakmus kislotali muhitda qanday rangga kiradi?", "Qizil", ["Ko'k", "Binafsha", "Rangsiz"], "Lakmus: kislotada qizil, ishqorda ko'k."],
    [2, "Lakmus ishqoriy muhitda qanday rangga kiradi?", "Ko'k", ["Qizil", "Binafsha", "Sariq"], "Neytral muhitda — binafsha."],
    [2, "Fenolftalein ishqoriy muhitda qanday rangga kiradi?", "Malina (to'q qizil)", ["Rangsiz", "Ko'k", "Sariq"], "Kislotali va neytral muhitda rangsiz."],
    [2, "Fenolftalein kislotali muhitda qanday bo'ladi?", "Rangsiz", ["Malina", "Ko'k", "Qizil"], "Fenolftalein faqat ishqorda bo'yaladi."],
    [2, "Metiloranj kislotali muhitda qanday rangga kiradi?", "Qizil (pushti)", ["Sariq", "Ko'k", "Rangsiz"], "Metiloranj: kislotada qizil, ishqorda sariq."],
    [2, "Kislota bilan asos o'rtasidagi reaksiya nima deyiladi?", "Neytrallanish", ["Oksidlanish", "Parchalanish", "Gidroliz"], "Kislota + asos → tuz + suv."],
    [2, "Kislotalar tarkibidagi umumiy element qaysi?", "Vodorod", ["Kislorod", "Uglerod", "Azot"], "Kislota = vodorod + kislota qoldig'i."],
    [2, "Asoslar (gidroksidlar) tarkibida qanday guruh bo'ladi?", "OH (gidroksogruppa)", ["SO₄", "CO₃", "NO₃"], "Asos = metall + OH guruhlar."],
    [2, "pH = 7 bo'lgan muhit qanday?", "Neytral", ["Kislotali", "Ishqoriy", "Kuchli kislotali"], "pH < 7 — kislotali, pH > 7 — ishqoriy."],
    [2, "pH = 2 bo'lgan eritma muhiti qanday?", "Kislotali", ["Neytral", "Ishqoriy", "Aniqlab bo'lmaydi"], "pH < 7 — kislotali muhit."],
    [2, "pH = 12 bo'lgan eritma muhiti qanday?", "Ishqoriy", ["Kislotali", "Neytral", "Aniqlab bo'lmaydi"], "pH > 7 — ishqoriy muhit."],
    [3, "Kimyoviy reaksiyada moddalar massasining saqlanish qonunini kim kashf etgan?", "M. Lomonosov va A. Lavuazye", ["D. Mendeleyev", "J. Dalton", "A. Avogadro"], "Reaksiyaga kirgan moddalar massasi = hosil bo'lganlar massasi."],
    [3, "Katalizator reaksiyada qanday vazifa bajaradi?", "Reaksiyani tezlashtiradi", ["Reaksiyada sarflanadi", "Mahsulot miqdorini oshiradi", "Reaksiyani to'xtatadi"], "Katalizator reaksiya oxirida o'zgarmay qoladi."],
    [3, "Issiqlik ajralib chiqadigan reaksiya qanday ataladi?", "Ekzotermik", ["Endotermik", "Katalitik", "Qaytar"], "Endotermik reaksiyada issiqlik yutiladi."],
    [3, "Oksidlanish jarayonida atom nima qiladi?", "Elektron beradi", ["Elektron oladi", "Proton beradi", "Neytron oladi"], "Oksidlanish — elektron berish, qaytarilish — elektron olish."],
    [3, "NaCl kristalida qanday kimyoviy bog' mavjud?", "Ion bog'", ["Kovalent qutbsiz", "Metall bog'", "Vodorod bog'"], "Metall va metallmas orasida — ion bog'."],
    [3, "H₂ va O₂ molekulalarida qanday bog' mavjud?", "Kovalent qutbsiz", ["Ion bog'", "Kovalent qutbli", "Metall bog'"], "Bir xil atomlar orasida — kovalent qutbsiz bog'."],
    [3, "HCl molekulasida qanday bog' mavjud?", "Kovalent qutbli", ["Kovalent qutbsiz", "Ion bog'", "Metall bog'"], "Turli metallmaslar orasida — kovalent qutbli bog'."],
    [3, "Kislorod birikmalarda (peroksidlardan tashqari) odatda qanday oksidlanish darajasini namoyon qiladi?", "−2", ["+2", "−1", "0"], "OF₂ va peroksidlar bundan mustasno."],
    [3, "Oddiy moddalardagi elementlarning oksidlanish darajasi nechaga teng?", "0", ["+1", "−1", "Valentligiga teng"], "Masalan, O₂, Fe, Cl₂ da — 0."],
    [1, "Qaysi modda oddiy modda?", "Kislorod (O₂)", ["Suv (H₂O)", "Osh tuzi (NaCl)", "Karbonat angidrid (CO₂)"], "Oddiy modda bir xil element atomlaridan tuzilgan."],
    [1, "Qaysi modda murakkab modda?", "Suv (H₂O)", ["Kislorod (O₂)", "Temir (Fe)", "Azot (N₂)"], "Murakkab modda turli element atomlaridan tuzilgan."],
    [1, "Suv molekulasi qaysi elementlardan tuzilgan?", "Vodorod va kisloroddan", ["Uglerod va kisloroddan", "Azot va vodoroddan", "Natriy va xlordan"], "H₂O: 2 ta vodorod va 1 ta kislorod atomi."],
    [1, "Moddaning kimyoviy belgilar va indekslar yordamida yozilishi nima deyiladi?", "Kimyoviy formula", ["Kimyoviy tenglama", "Valentlik", "Koeffitsient"], "Masalan, H₂O, CO₂."],
    [1, "Formulada element belgisidan keyin pastda yoziladigan kichik raqam nima deyiladi?", "Indeks", ["Koeffitsient", "Valentlik", "Tartib raqam"], "Indeks molekuladagi shu element atomlari sonini ko'rsatadi."],
    [1, "3H₂O yozuvidagi 3 raqami nima deyiladi?", "Koeffitsient", ["Indeks", "Valentlik", "Massa soni"], "Koeffitsient molekulalar sonini ko'rsatadi."],
    [1, "Spirt lampasini qanday o'chirish kerak?", "Qalpoqcha bilan yopib", ["Puflab", "Suv sepib", "Qog'oz bilan bosib"], "Spirt lampasini puflab o'chirish xavfli."],
    [1, "Kimyo laboratoriyasida moddalarni tatib ko'rish mumkinmi?", "Yo'q, mutlaqo mumkin emas", ["Ha, oz miqdorda", "Faqat tuzlarni", "Faqat suyuqliklarni"], "Moddalar tatib ko'rilmaydi va qo'l bilan ushlanmaydi."],
    [1,"Kimyoviy reaksiya natijasida hosil bo'ladigan yangi moddalar nima deyiladi?","Mahsulotlar",["Reagentlar","Katalizatorlar","Aralashmalar"],"Reaksiya mahsulotlari boshlang'ich moddalardan farqli xossalarga ega bo'ladi."],
    [1,"Kimyoviy reaksiyaga kirishayotgan boshlang'ich moddalar nima deyiladi?","Reagentlar",["Mahsulotlar","Erituvchilar","Cho'kmalar"],"Reagentlar reaksiya davomida sarflanib, yangi moddalarga aylanadi."],
    [1,"Moddalarning tarkibi, tuzilishi va o'zgarishlarini o'rganadigan fan qaysi?","Kimyo",["Fizika","Geografiya","Astronomiya"],"Kimyo moddalar va ularning o'zgarishlarini o'rganadi."],
    [1,"Moddaning kimyoviy xossalarini saqlovchi eng kichik zarrasi nima?","Molekula",["Proton","Elektron","Neytron"],"Molekula moddaning kimyoviy xossalarini saqlaydigan eng kichik zarradir."],
    [1,"Atom yadrosidagi musbat zaryadli zarra qaysi?","Proton",["Elektron","Neytron","Molekula"],"Proton +1 zaryadga ega va yadro tarkibiga kiradi."],
    [1,"Atom yadrosida joylashgan zaryadsiz zarra qaysi?","Neytron",["Proton","Elektron","Ion"],"Neytron elektr zaryadiga ega emas."],
    [1,"Atom yadrosi atrofida harakatlanuvchi manfiy zaryadli zarra qaysi?","Elektron",["Proton","Neytron","Molekula"],"Elektron manfiy zaryadli bo'lib, yadro atrofida harakatlanadi."],
    [1,"CO₂ formulasi qaysi moddaga tegishli?","Karbonat angidrid",["Is gazi","Metan","Ammiak"],"CO₂ bir atom uglerod va ikki atom kisloroddan tuzilgan karbonat angidriddir."],
    [1,"Shamning yonishi qanday hodisa hisoblanadi?","Kimyoviy hodisa",["Fizik hodisa","Mexanik hodisa","Optik hodisa"],"Yonishda yangi moddalar (CO₂ va suv bug'i) hosil bo'ladi."],
    [1,"Sutning achib qolishi qanday hodisa?","Kimyoviy hodisa",["Fizik hodisa","Mexanik hodisa","Issiqlik hodisasi"],"Achishda sut tarkibida yangi moddalar hosil bo'ladi."],
    [1,"Moddalarning yonishi uchun havodagi qaysi gaz zarur?","Kislorod",["Azot","Argon","Vodorod"],"Yonish kislorod ishtirokida boradigan oksidlanish jarayonidir."],
    [1,"Havo tarkibida hajm bo'yicha eng ko'p bo'lgan gaz qaysi?","Azot",["Kislorod","Argon","Karbonat angidrid"],"Azot havoning taxminan 78% ini tashkil qiladi."],
    [1,"Temir (Fe) qanday moddalar guruhiga kiradi?","Oddiy moddalar",["Murakkab moddalar","Aralashmalar","Eritmalar"],"Temir faqat bir xil element atomlaridan tuzilgan."],
    [1,"Yog' va suv aralashmasini qaysi asbob yordamida ajratish mumkin?","Ajratish voronkasi",["Magnit","Bug'latish idishi","Elak"],"Yog' suvda erimaydi va yengil bo'lgani uchun ajratish voronkasida qatlamlarga ajraladi."],
    [1,"Dengiz suvidan toza suv olish uchun qaysi usul qo'llanadi?","Haydash (distillash)",["Elash","Magnit yordamida ajratish","Cho'ktirish"],"Suv bug'lanib, so'ng sovitilganda tuzlarsiz toza suv hosil bo'ladi."],
    [1,"Kimyoviy tajriba o'tkazishda ko'zni nima bilan himoya qilish kerak?","Himoya ko'zoynagi bilan",["Quyosh ko'zoynagi bilan","Kontakt linza bilan","Qo'lqop bilan"],"Himoya ko'zoynagi ko'zni sachragan modda tomchilaridan saqlaydi."],
    [1,"Teriga kislota tushib qolsa, birinchi navbatda nima qilish kerak?","Ko'p suv bilan yuvish",["Spirt bilan artish","Quruq mato bilan artish","Upa sepish"],"Ko'p miqdordagi suv kislotani yuvib, kuyishni kamaytiradi."],
    [1,"H₂SO₄ qaysi moddalar sinfiga kiradi?","Kislotalar",["Asoslar","Tuzlar","Oksidlar"],"H₂SO₄ tarkibida vodorod atomlari va kislota qoldig'i bor."],
    [1,"NaOH qaysi moddalar sinfiga kiradi?","Asoslar",["Kislotalar","Tuzlar","Oksidlar"],"NaOH tarkibida metall va OH gidroksogruppa bor."],
    [1,"NaCl qaysi moddalar sinfiga kiradi?","Tuzlar",["Kislotalar","Asoslar","Oksidlar"],"Tuz metall atomi va kislota qoldig'idan tuzilgan."],
    [1,"Suvda eriydigan asoslar umumiy nom bilan nima deyiladi?","Ishqorlar",["Kislotalar","Tuzlar","Oksidlar"],"NaOH va KOH kabi suvda eriydigan asoslar ishqorlar deyiladi."],
    [2,"2H₂ + O₂ → 2H₂O reaksiyada 2 mol vodorod bilan necha mol kislorod reaksiyaga kirishadi?","1 mol",["2 mol","4 mol","0,5 mol"],"Tenglamadagi koeffitsientlar 2 : 1 : 2 nisbatda, demak 2 mol H₂ ga 1 mol O₂ to'g'ri keladi."],
    [2,"Bir necha moddadan bitta murakkab modda hosil bo'ladigan reaksiya qanday ataladi?","Birikish reaksiyasi",["Parchalanish reaksiyasi","O'rin olish reaksiyasi","Almashinish reaksiyasi"],"Birikish reaksiyasida bir nechta modda qo'shilib, bitta mahsulot beradi."],
    [2,"CaCO₃ → CaO + CO₂ reaksiyasi qaysi turga kiradi?","Parchalanish reaksiyasi",["Birikish reaksiyasi","O'rin olish reaksiyasi","Almashinish reaksiyasi"],"Bitta murakkab moddadan ikkita yangi modda hosil bo'lmoqda."],
    [2,"Zn + 2HCl → ZnCl₂ + H₂ reaksiyasi qaysi turga kiradi?","O'rin olish reaksiyasi",["Birikish reaksiyasi","Parchalanish reaksiyasi","Almashinish reaksiyasi"],"Oddiy modda sink murakkab moddadagi vodorodning o'rnini egallaydi."],
    [2,"AgNO₃ + NaCl → AgCl + NaNO₃ reaksiyasi qaysi turga kiradi?","Almashinish reaksiyasi",["Birikish reaksiyasi","Parchalanish reaksiyasi","O'rin olish reaksiyasi"],"Ikki murakkab modda o'z tarkibiy qismlarini almashtirgan."],
    [2,"Quyidagi formulalardan qaysi biri sulfat kislotaga tegishli?","H₂SO₄",["HNO₃","H₃PO₄","H₂CO₃"],"Sulfat kislota tarkibida SO₄ kislota qoldig'i bor."],
    [2,"Xlorid kislota tuzlari qanday ataladi?","Xloridlar",["Sulfatlar","Nitratlar","Karbonatlar"],"HCl ning tuzlari xloridlar deyiladi, masalan NaCl."],
    [2,"Nitrat kislota (HNO₃) tuzlari qanday ataladi?","Nitratlar",["Nitritlar","Sulfatlar","Fosfatlar"],"HNO₃ ning tuzlari nitratlar deyiladi, masalan KNO₃."],
    [2,"Quyidagi asoslardan qaysi biri ishqor hisoblanadi?","NaOH",["Cu(OH)₂","Fe(OH)₃","Al(OH)₃"],"NaOH suvda yaxshi eriydi, boshqalari esa erimaydi."],
    [2,"Quyidagi oksidlardan qaysi biri kislotali oksid?","CO₂",["CaO","Na₂O","MgO"],"CO₂ suv bilan karbonat kislota hosil qiladi."],
    [2,"Quyidagi oksidlardan qaysi biri asosli oksid?","CaO",["SO₃","CO₂","P₂O₅"],"CaO suv bilan reaksiyaga kirishib, asos Ca(OH)₂ hosil qiladi."],
    [2,"Quyidagi asoslardan qaysi biri suvda erimaydi?","Cu(OH)₂",["NaOH","KOH","Ba(OH)₂"],"NaOH, KOH va Ba(OH)₂ ishqorlar bo'lib, suvda eriydi."],
    [2,"Ammiakning kimyoviy formulasi qaysi?","NH₃",["CH₄","H₂S","HCl"],"Ammiak bitta azot va uchta vodorod atomidan tuzilgan."],
    [2,"Metanning kimyoviy formulasi qaysi?","CH₄",["NH₃","CO₂","C₂H₂"],"Metan bitta uglerod va to'rtta vodorod atomidan iborat."],
    [2,"Ozonning kimyoviy formulasi qaysi?","O₃",["O₂","CO₂","H₂O₂"],"Ozon molekulasi uchta kislorod atomidan tuziladi."],
    [2,"Ohaktoshning asosiy tarkibiy qismi qaysi modda?","CaCO₃",["CaO","Ca(OH)₂","CaCl₂"],"Ohaktosh va mramor asosan kalsiy karbonatdan iborat."],
    [2,"So'ndirilgan ohakning kimyoviy formulasi qaysi?","Ca(OH)₂",["CaO","CaCO₃","CaCl₂"],"Ohakni suv bilan so'ndirganda kalsiy gidroksid hosil bo'ladi."],
    [2,"Ichimlik sodasining (natriy gidrokarbonat) formulasi qaysi?","NaHCO₃",["Na₂CO₃","NaOH","NaCl"],"Ichimlik sodasi tarkibida vodorod atomi saqlangan gidrokarbonat ioni bor."],
    [2,"Kislorod to'ldirilgan idishga cho'g'langan cho'p tushirilsa, nima kuzatiladi?","Cho'p alangalanib yonadi",["Cho'p so'nadi","Idish portlaydi","Hech narsa o'zgarmaydi"],"Kislorod yonishni qo'llab-quvvatlaydi, shu sababli cho'g' alangalanadi."],
    [2,"Karbonat angidrid ohakli suvdan o'tkazilsa, nima kuzatiladi?","Suv loyqalanadi",["Suv ko'k rangga kiradi","Suv qaynay boshlaydi","Suv shaffofligicha qoladi"],"CO₂ bilan Ca(OH)₂ reaksiyasidan erimaydigan CaCO₃ cho'kmasi hosil bo'ladi."],
    [2,"H₂O molekulasida kislorodning valentligi nechaga teng?","II",["I","III","IV"],"Kislorod ikkita vodorod atomi bilan bog'langani uchun valentligi II."],
    [3,"H₂SO₄ tarkibidagi oltingugurtning oksidlanish darajasi nechaga teng?","+6",["+4","+2","−2"],"2·(+1) + x + 4·(−2) = 0 tenglamadan x = +6."],
    [3,"KMnO₄ tarkibidagi marganesning oksidlanish darajasi nechaga teng?","+7",["+2","+4","+6"],"(+1) + x + 4·(−2) = 0 tenglamadan x = +7."],
    [3,"H₂O₂ (vodorod peroksid) tarkibida kislorodning oksidlanish darajasi nechaga teng?","−1",["−2","0","+1"],"Peroksidlarda kislorodning oksidlanish darajasi −1 ga teng."],
    [3,"NH₃ tarkibidagi azotning oksidlanish darajasi nechaga teng?","−3",["+3","−2","+5"],"Vodorod +1 bo'lgani uchun azot 3·(+1) + x = 0 dan −3 bo'ladi."],
    [3,"Oksidlanish-qaytarilish reaksiyasida oksidlovchi nima qiladi?","Elektron qabul qiladi",["Elektron beradi","Proton beradi","Neytron qabul qiladi"],"Oksidlovchi elektron biriktirib olib, o'zi qaytariladi."],
    [3,"2Na + Cl₂ → 2NaCl reaksiyasida qaysi modda oksidlovchi?","Cl₂",["Na","NaCl","Na⁺"],"Xlor elektron qabul qilib, oksidlanish darajasini 0 dan −1 ga tushiradi."],
    [3,"Fe + CuSO₄ → FeSO₄ + Cu reaksiyasida temir qanday vazifa bajaradi?","Qaytaruvchi",["Oksidlovchi","Katalizator","Erituvchi"],"Temir elektron berib, 0 dan +2 gacha oksidlanadi, ya'ni qaytaruvchi bo'ladi."],
    [3,"Vant-Goff qoidasiga ko'ra harorat 10 °C ko'tarilsa, reaksiya tezligi taxminan necha marta ortadi?","2–4 marta",["10–20 marta","100 marta","O'zgarmaydi"],"Ko'pchilik reaksiyalar uchun tezlik har 10 °C da 2–4 marta oshadi."],
    [3,"Tashqi ta'sirda kimyoviy muvozanatning siljishini qaysi prinsip tushuntiradi?","Le Shatelye prinsipi",["Avogadro qonuni","Mendeleyev qonuni","Prust qonuni"],"Le Shatelye prinsipiga ko'ra tizim ta'sirni kamaytiradigan tomonga siljiydi."],
    [3,"Katalizator kimyoviy muvozanat holatiga qanday ta'sir qiladi?","Muvozanatni siljitmaydi",["Mahsulot unumini oshiradi","Mahsulot unumini kamaytiradi","Reaksiyani to'xtatadi"],"Katalizator to'g'ri va teskari reaksiyani teng tezlashtiradi, muvozanat joyi o'zgarmaydi."],
    [3,"Elektrolitik dissotsiatsiya nazariyasini yaratgan olim kim?","S. Arrenius",["D. Mendeleyev","A. Avogadro","D. Dalton"],"Shved olimi Svante Arrenius bu nazariyani 1887-yilda ilgari surgan."],
    [3,"Metallarda atomlar orasida qanday kimyoviy bog' mavjud?","Metall bog'",["Ion bog'","Kovalent qutbli bog'","Vodorod bog'"],"Metallarda erkin elektronlar atomlar va ionlarni o'zaro bog'laydi."],
    [3,"Suv molekulalari orasida qanday bog'lar hosil bo'ladi?","Vodorod bog'lar",["Ion bog'lar","Metall bog'lar","Kovalent qutbsiz bog'lar"],"Qutbli H₂O molekulalari orasida vodorod bog'lar paydo bo'ladi."],
    [3,"Murakkab moddaning tarkibi doimiy ekanligini ko'rsatuvchi qonunni kim kashf etgan?","J. Prust",["J. Dalton","A. Lavuazye","A. Avogadro"],"Prust tarkibning doimiylik qonunini kashf etgan."],
    [3,"Izotoplar atom yadrosidagi qaysi zarralar soni bilan farqlanadi?","Neytronlar soni bilan",["Protonlar soni bilan","Elektronlar soni bilan","Valentlik bilan"],"Izotoplarda protonlar soni bir xil, neytronlar soni har xil bo'ladi."],
    [3,"Elementning tartib raqami nimani bildiradi?","Yadrodagi protonlar sonini",["Yadrodagi neytronlar sonini","Energiya pog'onalari sonini","Tashqi elektronlar sonini"],"Tartib raqami yadro zaryadiga, ya'ni protonlar soniga teng."],
    [3,"D. I. Mendeleyev davriy qonunni qaysi yilda kashf etgan?","1869-yilda",["1859-yilda","1879-yilda","1889-yilda"],"Mendeleyev davriy qonunni 1869-yil mart oyida e'lon qilgan."],
    [3,"20 g tuz 80 g suvda eritilsa, eritmadagi tuzning massa ulushi qancha bo'ladi?","20%",["25%","80%","16%"],"Eritma massasi 100 g, shuning uchun 20 : 100 · 100% = 20%."],
    [3,"Quyidagi moddalardan qaysi biri kuchli elektrolit?","Xlorid kislota (HCl)",["Sirka kislota (CH₃COOH)","Karbonat kislota (H₂CO₃)","Ammoniy gidroksid (NH₄OH)"],"HCl suvda deyarli to'liq ionlarga ajraladi, boshqalari kuchsiz elektrolit."],
    [3,"Elektroliz paytida katodda qanday jarayon boradi?","Qaytarilish",["Oksidlanish","Neytrallanish","Parchalanish"],"Katodda musbat ionlar elektron qabul qilib qaytariladi."],
    [3,"HCl + NaOH reaksiyasida qanday mahsulotlar hosil bo'ladi?","NaCl va H₂O",["NaH va ClOH","Na₂O va HCl","NaClO va H₂"],"Neytrallanishda kislota va asos tuz hamda suv hosil qiladi."],
    [3,"Kislotali yomg'irlar asosan qaysi birikmalar tufayli hosil bo'ladi?","Oltingugurt va azot oksidlari",["Argon va geliy","Vodorod va kislorod","Metan va neon"],"SO₂ va azot oksidlari suv bilan reaksiyaga kirishib, kislotalar hosil qiladi."]
  ]);
  function K3(L) {
    var k = pick(lv(L, [0, 0, 10, 10, 13, 12, 1, 9, 9], [0, 1, 2, 3, 10, 11, 12, 13, 9, 9], [1, 2, 3, 11, 12, 14, 9, 9])), it;
    if (k >= 10) return K3x(k, L);
    if (k === 0) { it = pick(CLS);
      return TQ("<b>" + it[0] + "</b> qaysi sinf birikmalariga kiradi?", it[1], ["Oksid", "Kislota", "Asos", "Tuz"].filter(function (x) { return x !== it[1]; }),
        [{ Oksid: "Ikki elementdan iborat, biri kislorod — oksid.", Kislota: "Vodorod + kislota qoldig'i — kislota.", Asos: "Metall + OH guruh — asos.", Tuz: "Metall + kislota qoldig'i — tuz." }[it[1]]]); }
    if (k === 1) { it = pick(RXN);
      return TQ(it[0] + "<br>Bu qaysi turdagi reaksiya?", it[1], ["Birikish", "Parchalanish", "O'rin olish", "Almashinish"].filter(function (x) { return x !== it[1]; }),
        [{ "Birikish": "Bir nechta moddadan bitta murakkab modda hosil bo'ldi.", "Parchalanish": "Bitta moddadan bir nechta modda hosil bo'ldi.", "O'rin olish": "Oddiy modda murakkab moddadagi atom o'rnini oldi.", "Almashinish": "Ikki murakkab modda tarkibiy qismlarini almashdi." }[it[1]]]); }
    if (k === 2) { it = pick(BAL);
      return NQ("Tenglamadagi noma'lum koeffitsientni toping:<br>" + it[0], it[1], "", [1, 2, 3, 4, 5, 6, 7, 8].filter(function (x) { return x !== it[1]; }).sort(function () { return Math.random() - 0.5; }).slice(0, 4),
        ["Har bir element atomlari soni chap va o'ng tomonda teng bo'lishi kerak."]); }
    if (k === 3) { it = pick(VAL);
      return TQ("<b>" + it[0] + "</b> birikmasida " + it[1] + "ning valentligi nechaga teng?", it[2], ["I", "II", "III", "IV", "V", "VI", "VII"].filter(function (x) { return x !== it[2]; }).sort(function () { return Math.random() - 0.5; }).slice(0, 4),
        ["Valentliklar yig'indisi ikkala element uchun teng bo'ladi (H — I, O — II)."]); }
    return BK3(L);
  }
  S.register("k3", K3, "Kimyo · Asosiy tushunchalar va reaksiyalar");


  /* ================= i1 Sanoq sistemalari ================= */
  function bs(n, b) { return n.toString(b).toUpperCase(); }
  function sb(n, b) { return bs(n, b) + "<sub>" + b + "</sub>"; }
  function flip(str, ch) { var i = R(0, str.length - 1), c = str.charAt(i); var d = ch[(ch.indexOf(c) + 1) % ch.length]; return str.slice(0, i) + d + str.slice(i + 1); }
  function baseW(n, b, cnt) { // yaqin noto'g'ri yozuvlar
    var out = [], s = bs(n, b), t = 0, dig = "0123456789ABCDEF".slice(0, b).split("");
    var c = [bs(n + 1, b), bs(Math.max(1, n - 1), b), s.split("").reverse().join(""), bs(n * 2, b), bs(Math.max(1, n >> 1), b)];
    if (b === 2) c.push(bs(n, 10));
    for (var i = 0; i < c.length; i++) if (c[i] !== s && out.indexOf(c[i]) < 0) out.push(c[i]);
    while (out.length < cnt + 2 && t++ < 50) { var x = flip(s, dig); if (x !== s && out.indexOf(x) < 0 && x.charAt(0) !== "0") out.push(x); }
    return shuffle(out).slice(0, cnt);
  }
  function I1(L) {
    var k = pick(lv(L, [0, 1, 0, 1, 6], [0, 1, 2, 3, 4, 6], [2, 3, 4, 5, 7, 8, 9])), n, a, b, B, s;
    var mx = lv(L, 31, 255, 255);
    if (k === 0) { n = R(L === 1 ? 2 : 16, mx);
      return Q("<b>" + n + "</b> sonini ikkilik sanoq sistemasiga o'tkazing.", bs(n, 2) + "₂", baseW(n, 2, 4).map(function (x) { return x + "₂"; }), [n + " ni 2 ga ketma-ket bo'lib, qoldiqlarni pastdan yuqoriga yozamiz: " + bs(n, 2)]); }
    if (k === 1) { n = R(L === 1 ? 3 : 16, mx); s = bs(n, 2);
      return NQ("<b>" + s + "<sub>2</sub></b> sonini o'nlik sanoq sistemasiga o'tkazing.", n, "", [n + 1, n - 1, parseInt(s.split("").reverse().join(""), 2), n * 2, n + 2], [s.split("").map(function (d, i) { return d === "1" ? "2" + (s.length - 1 - i === 0 ? "⁰" : sup(s.length - 1 - i)) : null; }).filter(Boolean).join(" + ") + " = " + n]); }
    if (k === 2) { a = R(lv(L, 1, 3, 10), lv(L, 15, 60, 120)); b = R(lv(L, 1, 3, 10), lv(L, 15, 60, 120));
      return Q("Ikkilik sonlarni qo'shing: <b>" + bs(a, 2) + "<sub>2</sub> + " + bs(b, 2) + "<sub>2</sub></b>", bs(a + b, 2) + "₂", baseW(a + b, 2, 4).map(function (x) { return x + "₂"; }), [a + " + " + b + " = " + (a + b) + " = " + bs(a + b, 2) + "₂", "1₂ + 1₂ = 10₂ (ko'chirish)"]); }
    if (k === 3) { n = R(1, lv(L, 31, 255, 1023)); var c = bs(n, 2).length;
      return NQ("<b>" + n + "</b> sonining ikkilik yozuvi nechta raqamdan iborat?", c, "", [c + 1, c - 1, c + 2, String(n).length], [n + " = " + bs(n, 2) + "₂ — " + c + " ta raqam"]); }
    if (k === 4) { n = R(3, 63); s = bs(n, 2); var ones = s.split("").filter(function (x) { return x === "1"; }).length;
      return NQ("<b>" + n + "</b> sonining ikkilik yozuvida nechta <b>1</b> (bir) raqami bor?", ones, "", [ones + 1, ones - 1, s.length - ones || ones + 2, s.length], [n + " = " + s + "₂"]); }
    if (k === 5) { B = pick([8, 16]); n = R(B === 8 ? 9 : 17, 255);
      return Q("<b>" + n + "</b> sonini " + (B === 8 ? "sakkizlik" : "o'n oltilik") + " sanoq sistemasiga o'tkazing.", sb(n, B), baseW(n, B, 4).map(function (x) { return x + "<sub>" + B + "</sub>"; }), [n + " ni " + B + " ga ketma-ket bo'lamiz: " + n + " = " + bs(n, B) + "<sub>" + B + "</sub>"]); }
    if (k === 6) { var m = R(2, lv(L, 4, 7, 9)); n = Math.pow(2, m);
      return NQ("2<sup>" + m + "</sup> ning ikkilik yozuvi 1 dan keyin nechta 0 dan iborat?", m, "", [m + 1, m - 1, n, m * 2], ["2<sup>" + m + "</sup> = " + n + " = 1" + new Array(m + 1).join("0") + "₂"]); }
    if (k === 7) { B = pick([8, 16]); n = R(B === 8 ? 9 : 17, 255);
      return NQ("<b>" + sb(n, B) + "</b> sonini o'nlik sanoq sistemasiga o'tkazing.", n, "", [parseInt(bs(n, B), 10) || n + 10, n + 1, n - B, n + B], [bs(n, B).split("").map(function (d, i, arr) { return parseInt(d, 16) + "·" + B + sup(arr.length - 1 - i); }).join(" + ") + " = " + n]); }
    if (k === 8) { n = R(9, 63); s = bs(n, 2); while (s.length % 3) s = "0" + s;
      return Q("<b>" + bs(n, 2) + "<sub>2</sub></b> sonini sakkizlik sistemaga o'tkazing.", bs(n, 8) + "₈", baseW(n, 8, 4).map(function (x) { return x + "₈"; }), ["Raqamlarni o'ngdan 3 tadan guruhlaymiz: " + s.replace(/(...)(?=.)/g, "$1 ") + " → " + bs(n, 8)]); }
    n = R(17, 255); s = bs(n, 2); while (s.length % 4) s = "0" + s;
    return Q("<b>" + bs(n, 2) + "<sub>2</sub></b> sonini o'n oltilik sistemaga o'tkazing.", bs(n, 16) + "<sub>16</sub>", baseW(n, 16, 4).map(function (x) { return x + "<sub>16</sub>"; }), ["Raqamlarni o'ngdan 4 tadan guruhlaymiz: " + s.replace(/(....)(?=.)/g, "$1 ") + " → " + bs(n, 16)]);
  }
  function sup(n) { var m = "⁰¹²³⁴⁵⁶⁷⁸⁹"; return String(n).split("").map(function (d) { return m.charAt(+d); }).join(""); }
  S.register("i1", I1, "Informatika · Sanoq sistemalari");

  /* ================= i2 Axborot birliklari ================= */
  var BK_I2 = bank([
    [1, "Axborotning eng kichik o'lchov birligi qaysi?", "Bit", ["Bayt", "Kbayt", "Simvol"], "Bit — 0 yoki 1."],
    [1, "1 bayt necha bitga teng?", "8 bit", ["10 bit", "2 bit", "1024 bit"], "1 bayt = 8 bit."],
    [1, "1 Kbayt necha baytga teng?", "1024 bayt", ["1000 bayt", "8 bayt", "100 bayt"], "1 Kbayt = 2¹⁰ = 1024 bayt."],
    [2, "1 Mbayt necha Kbaytga teng?", "1024 Kbayt", ["1000 Kbayt", "8 Kbayt", "512 Kbayt"], "1 Mbayt = 1024 Kbayt."],
    [2, "1 Gbayt necha Mbaytga teng?", "1024 Mbayt", ["1000 Mbayt", "8 Mbayt", "100 Mbayt"], "1 Gbayt = 1024 Mbayt."],
    [2, "Qaysi birlik eng katta?", "1 Tbayt", ["1 Gbayt", "1 Mbayt", "1 Kbayt"], "Kbayt < Mbayt < Gbayt < Tbayt."],
    [3, "Bir bit yordamida nechta turli holatni kodlash mumkin?", "2 ta", ["1 ta", "8 ta", "256 ta"], "0 yoki 1."],
    [3, "Bir bayt yordamida nechta turli belgi kodlash mumkin?", "256 ta", ["8 ta", "255 ta", "1024 ta"], "2⁸ = 256."],
    [1,"«Bit» so'zi ingliz tilidagi qaysi ikki so'zning qisqartmasi?","binary digit",["basic digit","binary data","bit number"],"Bit inglizcha «binary digit» — ya'ni ikkilik raqam so'zlaridan olingan."],
    [1,"Kompyuterda axborot qaysi ikki raqam yordamida ifodalanadi?","0 va 1",["1 va 2","0 va 9","A va B"],"Kompyuter elektr signalining bor-yo'qligini 1 va 0 bilan ifodalaydi."],
    [1,"Sakkiz bitdan iborat axborot birligi qanday ataladi?","Bayt",["Nibbl","Kbayt","Megabit"],"Bir bayt aynan sakkiz bitdan tashkil topgan."],
    [1,"4 bayt necha bitga teng?","32 bit",["24 bit","40 bit","64 bit"],"Har bir bayt 8 bit bo'lgani uchun 4 × 8 = 32 bit."],
    [1,"2 Kbayt necha baytga teng?","2048 bayt",["2000 bayt","1024 bayt","4096 bayt"],"Bir kilobayt 1024 bayt, demak 2 × 1024 = 2048 bayt."],
    [1,"4096 bayt necha kilobaytga teng?","4 Kbayt",["2 Kbayt","40 Kbayt","4096 Kbayt"],"4096 ni 1024 ga bo'lsak, 4 kilobayt chiqadi."],
    [1,"0,5 Kbayt necha baytga teng?","512 bayt",["500 bayt","1024 bayt","256 bayt"],"Yarim kilobayt 1024 ning yarmi, ya'ni 512 bayt."],
    [1,"Qaysi birlik bitdan katta, lekin kilobaytdan kichik?","Bayt",["Megabayt","Gigabayt","Terabit"],"Birliklar zanjiri bit — bayt — kilobayt tartibida o'sib boradi."],
    [1,"Ikkilik sanoq sistemasida nechta raqam ishlatiladi?","2 ta",["8 ta","10 ta","16 ta"],"Ikkilik sistemada faqat 0 va 1 raqamlari mavjud."],
    [1,"3 bayt necha bitga teng?","24 bit",["16 bit","18 bit","32 bit"],"3 × 8 = 24 bit, chunki bir bayt sakkiz bit."],
    [1,"16 bit necha baytga teng?","2 bayt",["1,6 bayt","4 bayt","8 bayt"],"16 bitni 8 ga bo'lsak, 2 bayt hosil bo'ladi."],
    [1,"1 terabayt necha gigabaytga teng?","1024 Gbayt",["1000 Gbayt","512 Gbayt","256 Gbayt"],"Har bir pog'ona 1024 marta katta: 1 Tbayt = 1024 Gbayt."],
    [1,"1 kilobayt necha bitga teng?","8192 bit",["1024 bit","8000 bit","4096 bit"],"1024 bayt × 8 bit = 8192 bit."],
    [1,"1024 bit necha baytga teng?","128 bayt",["1024 bayt","64 bayt","256 bayt"],"1024 bitni 8 ga bo'lsak, 128 bayt bo'ladi."],
    [1,"1536 bayt necha kilobaytga teng?","1,5 Kbayt",["1,2 Kbayt","15 Kbayt","0,75 Kbayt"],"1536 ni 1024 ga bo'lganda 1,5 chiqadi."],
    [1,"512 Kbayt necha megabaytga teng?","0,5 Mbayt",["1 Mbayt","0,25 Mbayt","2 Mbayt"],"512 — 1024 ning yarmi, shuning uchun 0,5 megabayt."],
    [1,"Telefon xotirasi 8 gigabayt bo'lsa, bu necha megabaytga teng?","8192 Mbayt",["8000 Mbayt","1024 Mbayt","512 Mbayt"],"8 × 1024 = 8192 megabayt."],
    [2,"1 Kbit necha bitga teng?","1024 bit",["1000 bit","512 bit","8192 bit"],"«Kilo» qo'shimchasi axborot birliklarida 1024 marta kattalikni bildiradi."],
    [2,"8 Mbit necha megabaytga teng?","1 Mbayt",["8 Mbayt","64 Mbayt","0,5 Mbayt"],"8 megabitni 8 ga bo'lsak, 1 megabayt bo'ladi."],
    [2,"Ma'lumot 100 Mbit/s tezlikda uzatilsa, bir sekundda necha megabayt o'tadi?","12,5 Mbayt",["100 Mbayt","10 Mbayt","25 Mbayt"],"100 ni 8 ga bo'lamiz, chunki bir bayt sakkiz bitga teng."],
    [2,"1 megabayt necha baytga teng?","1 048 576 bayt",["100 000 bayt","1024 bayt","10 240 bayt"],"1024 × 1024 = 1 048 576 bayt."],
    [2,"1 gigabayt necha kilobaytga teng?","1 048 576 Kbayt",["1024 Kbayt","10 240 Kbayt","65 536 Kbayt"],"1024 megabayt × 1024 kilobayt = 1 048 576 kilobayt."],
    [2,"32 gigabayt necha megabaytga teng?","32 768 Mbayt",["3200 Mbayt","16 384 Mbayt","65 536 Mbayt"],"32 × 1024 = 32 768 megabayt."],
    [2,"4 gigabaytli flesh-xotiraga hajmi 512 megabayt bo'lgan fayllardan nechtasi sig'adi?","8 ta",["6 ta","10 ta","16 ta"],"4 Gbayt — 4096 Mbayt, uni 512 ga bo'lsak 8 chiqadi."],
    [2,"Nibbl deb qanday axborot birligiga aytiladi?","Yarim baytga",["Bir baytga","Ikki baytga","Sakkiz baytga"],"Nibbl to'rt bitga, ya'ni baytning yarmiga teng."],
    [2,"1011 ikkilik soni o'nlik sanoq sistemasida nechaga teng?","11",["13","9","15"],"8 + 0 + 2 + 1 = 11."],
    [2,"25 o'nlik soni ikkilik sanoq sistemasida qanday yoziladi?","11001",["10101","11011","10011"],"16 + 8 + 1 = 25, demak 11001."],
    [2,"Matnning har bir belgisi 1 bayt egallasa, 2048 belgili matn necha kilobayt bo'ladi?","2 Kbayt",["1 Kbayt","4 Kbayt","20 Kbayt"],"2048 baytni 1024 ga bo'lsak, 2 kilobayt bo'ladi."],
    [2,"Yetti bitli ASCII jadvali nechta turli belgini kodlaydi?","128 ta",["64 ta","256 ta","512 ta"],"Ikki yettinchi daraja 128 ga teng."],
    [2,"ASCII jadvalida 65 raqami qaysi belgini bildiradi?","Katta A harfini",["Kichik a harfini","B harfini","0 raqamini"],"Katta «A» harfi ASCII jadvalida 65-kodda turadi."],
    [2,"Unicode kodlash tizimi nima maqsadda yaratilgan?","Turli tillar belgilarini kodlash uchun",["Faqat ingliz harflarini kodlash uchun","Faqat raqamlarni saqlash uchun","Rasmlarni siqish uchun"],"Unicode dunyo tillarining belgilarini yagona jadvalda qamrab oladi."],
    [2,"1 Mbit necha Kbitga teng?","1024 Kbit",["1000 Kbit","512 Kbit","8 Kbit"],"Megabit kilobitdan 1024 marta katta."],
    [2,"Hajmi 3 kilobayt bo'lgan matn faylida nechta belgi bor (har bir belgi 1 bayt)?","3072 ta",["3000 ta","1024 ta","4096 ta"],"3 × 1024 = 3072 bayt, demak 3072 ta belgi."],
    [2,"0,25 megabayt necha kilobaytga teng?","256 Kbayt",["250 Kbayt","512 Kbayt","128 Kbayt"],"1024 ning to'rtdan bir qismi 256 kilobaytga teng."],
    [3,"1 megabayt necha bitga teng?","8 388 608 bit",["1 048 576 bit","8 000 000 bit","65 536 bit"],"1024 × 1024 bayt, so'ngra × 8 bit — jami 8 388 608 bit."],
    [3,"1 megabayt necha kilobitga teng?","8192 Kbit",["1024 Kbit","8000 Kbit","65 536 Kbit"],"1024 kilobayt × 8 = 8192 kilobit."],
    [3,"16 bit yordamida nechta turli qiymatni kodlash mumkin?","65 536 ta",["32 768 ta","1024 ta","8 ta"],"Ikki sonining o'n oltinchi darajasi 65 536 ga teng."],
    [3,"32 gigabaytli xotiraga hajmi 4 megabayt bo'lgan rasmlardan nechtasi sig'adi?","8192 ta",["8000 ta","4096 ta","16 384 ta"],"32 Gbayt — 32 768 Mbayt, uni 4 ga bo'lsak 8192 chiqadi."],
    [3,"1 petabayt necha terabaytga teng?","1024 Tbayt",["1000 Tbayt","512 Tbayt","2048 Tbayt"],"Petabayt terabaytdan 1024 marta katta."],
    [3,"2 terabayt necha megabaytga teng?","2 097 152 Mbayt",["2048 Mbayt","1 048 576 Mbayt","2 000 000 Mbayt"],"2 × 1024 gigabayt, keyin yana × 1024 megabayt hosil bo'ladi."],
    [3,"Musiqa 256 Kbit/s tezlikda uzatilsa, bir soatlik yozuv necha kilobayt bo'ladi?","115 200 Kbayt",["921 600 Kbayt","14 400 Kbayt","57 600 Kbayt"],"256 × 3600 sekund = 921 600 Kbit, uni 8 ga bo'lsak 115 200 Kbayt."],
    [3,"100 Mbit/s tezlikdagi internetda 500 megabaytlik fayl qancha vaqtda yuklanadi?","40 sekundda",["5 sekundda","80 sekundda","400 sekundda"],"500 × 8 = 4000 Mbit, uni 100 ga bo'lsak 40 sekund chiqadi."],
    [3,"1,5 gigabayt necha megabaytga teng?","1536 Mbayt",["1500 Mbayt","1024 Mbayt","2048 Mbayt"],"1,5 × 1024 = 1536 megabayt."],
    [3,"5 megabayt necha kilobaytga teng?","5120 Kbayt",["5000 Kbayt","1024 Kbayt","10 240 Kbayt"],"5 × 1024 = 5120 kilobayt."],
    [3,"2 kilobayt necha bitga teng?","16 384 bit",["2048 bit","8192 bit","32 768 bit"],"2 × 1024 bayt × 8 bit = 16 384 bit."],
    [3,"UTF-8 kodlash tizimida bitta belgi ko'pi bilan necha bayt egallaydi?","4 bayt",["1 bayt","2 bayt","8 bayt"],"UTF-8 da keng tarqalgan belgilar 1–4 bayt oralig'ida saqlanadi."],
    [3,"1 ekzabayt necha petabaytga teng?","1024 PB",["1000 PB","512 PB","2048 PB"],"Ekzabayt petabaytdan 1024 marta katta."],
    [3,"Bir megabaytlik fayl 4 kilobaytli bloklarga bo'lindi. Nechta blok hosil bo'ladi?","256 ta",["128 ta","512 ta","1024 ta"],"1024 kilobaytni 4 ga bo'lsak, 256 blok chiqadi."],
    [3,"100 o'nlik soni ikkilik sanoq sistemasida qanday yoziladi?","1100100",["1100110","1010100","1110000"],"64 + 32 + 4 = 100, shuning uchun 1100100."],
    [3,"1 terabit necha gigabitga teng?","1024 Gbit",["1000 Gbit","512 Gbit","8192 Gbit"],"Terabit gigabitdan 1024 marta katta."]
  ]);
  var UN = ["bit", "bayt", "Kbayt", "Mbayt", "Gbayt"];
  function I2(L) {
    var k = pick(lv(L, [0, 1, 2, 9], [1, 2, 3, 4, 5, 9], [3, 4, 5, 6, 7, 8, 9])), n, i, N, x, sz, v, t;
    if (k === 0) { n = R(2, 64);
      return NQ(n + " bayt necha bit?", n * 8, "bit", [n / 8, n * 10, n * 1024, n * 4], ["1 bayt = 8 bit ⇒ " + n + " · 8 = " + n * 8 + " bit"]); }
    if (k === 1) { n = R(1, 32) * 8;
      return NQ(n + " bit necha bayt?", n / 8, "bayt", [n * 8, n / 10, n / 4, n / 16], ["1 bayt = 8 bit ⇒ " + n + " : 8 = " + n / 8 + " bayt"]); }
    if (k === 2) { var j = R(2, 4); n = pick([1, 2, 3, 4, 5, 8, 10, 16]);
      return NQ(n + " " + UN[j] + " necha " + UN[j - 1] + "?", n * 1024, UN[j - 1], [n * 1000, n * 8, n * 100, n * 512], ["1 " + UN[j] + " = 1024 " + UN[j - 1] + " ⇒ " + n + " · 1024 = " + n * 1024]); }
    if (k === 3) { n = pick([1, 2, 4, 8, 16, 32, 64, 128, 256, 512]) * 1024; var jj = R(1, 3);
      return NQ(n + " " + UN[jj] + " necha " + UN[jj + 1] + "?", n / 1024, UN[jj + 1], [n / 1000, n / 8, n / 512, n * 1024], [n + " : 1024 = " + n / 1024 + " " + UN[jj + 1]]); }
    if (k === 4) { i = R(1, 8); N = Math.pow(2, i);
      return NQ("Alifbo " + N + " ta belgidan iborat. Bitta belgining axborot hajmi necha bit? (N = 2<sup>i</sup>)", i, "bit", [N / 2, i + 1, N, i * 2], ["N = 2<sup>i</sup>: " + N + " = 2<sup>" + i + "</sup> ⇒ i = " + i + " bit"]); }
    if (k === 5) { i = pick([1, 2, 3, 4, 5, 6, 7, 8]); N = Math.pow(2, i); n = pick([10, 20, 32, 40, 50, 64, 100, 128, 200]);
      return NQ(N + " ta belgili alifboda yozilgan " + n + " ta belgidan iborat xabarning hajmi necha bit?", n * i, "bit", [n * N, n * i / 8, n + i, n * 8], ["i = " + i + " bit (2<sup>" + i + "</sup> = " + N + ")", "V = " + n + " · " + i + " = " + n * i + " bit"]); }
    if (k === 6) { var ix = pick([[64, 6], [256, 8], [32, 5], [16, 4]]); n = pick([64, 80, 100, 120, 128, 160, 200, 256, 400, 512, 800, 1024, 2048]); while ((n * ix[1]) % 8) n += 4; sz = n * ix[1] / 8;
      return NQ(ix[0] + " ta belgili alifboda yozilgan " + n + " belgili matn hajmi necha bayt?", sz, "bayt", [n * ix[1], sz * 8, sz / 8, n], ["i = " + ix[1] + " bit, V = " + n + " · " + ix[1] + " = " + n * ix[1] + " bit = " + sz + " bayt"]); }
    if (k === 7) { do { sz = pick([2, 4, 5, 8, 10, 15, 16, 20, 25, 40, 50, 100]); v = pick([1, 2, 4, 5, 8, 10, 20]); t = sz * 8 / v; } while (t !== Math.round(t) || t === sz);
      return NQ(sz + " Mbayt hajmli fayl " + v + " Mbit/s tezlikda yuklanmoqda. Yuklash necha sekund davom etadi?", t, "s", [sz / v, sz * v, t * 2, t / 8], [sz + " Mbayt = " + sz * 8 + " Mbit", "t = " + sz * 8 + " : " + v + " = " + f(t) + " s"]); }
    if (k === 8) { var lines = pick([20, 32, 40, 50, 64]), chars = pick([32, 40, 50, 64]), pages = pick([4, 8, 10, 16]);
      var tot = lines * chars * pages;
      return NQ("Matn " + pages + " sahifa, har sahifada " + lines + " qator, har qatorda " + chars + " belgi. Har belgi 1 bayt bo'lsa, hajmi necha bayt?", tot, "bayt", [tot * 8, tot / 8, lines * chars, tot / 1024], ["V = " + pages + " · " + lines + " · " + chars + " · 1 = " + tot + " bayt"]); }
    return BK_I2(L);
  }
  S.register("i2", I2, "Informatika · Axborot birliklari");


  /* ================= i3 Kompyuter, internet va dasturlash ================= */
  var EXT = [[".docx", "Matn hujjati (Word)"], [".xlsx", "Elektron jadval (Excel)"], [".pptx", "Taqdimot (PowerPoint)"], [".jpg", "Rasm (tasvir)"], [".mp3", "Audio (musiqa)"],
    [".mp4", "Video"], [".exe", "Dastur (Windows ilovasi)"], [".pdf", "PDF hujjat"], [".zip", "Arxiv"], [".html", "Veb-sahifa"], [".py", "Python dasturi"], [".txt", "Oddiy matn fayli"],
    [".png", "Rasm (PNG tasvir)"], [".wav", "Audio (tovush yozuvi)"], [".rar", "Arxiv (RAR)"], [".csv", "Jadval ma'lumotlari (vergul bilan)"]];
  var BK_I3 = bank([
    [1, "Kompyuterning \"miyasi\" — hisoblash ishlarini bajaruvchi qurilma qaysi?", "Protsessor", ["Monitor", "Klaviatura", "Printer"], "Markaziy protsessor (CPU) buyruqlarni bajaradi."],
    [1, "Quyidagilardan qaysi biri kiritish qurilmasi?", "Klaviatura", ["Monitor", "Printer", "Karnay"], "Klaviatura, sichqoncha, mikrofon — kiritish qurilmalari."],
    [1, "Quyidagilardan qaysi biri chiqarish qurilmasi?", "Printer", ["Sichqoncha", "Skaner", "Mikrofon"], "Monitor, printer, karnay — chiqarish qurilmalari."],
    [1, "Kompyuter o'chirilganda qaysi xotiradagi ma'lumot o'chib ketadi?", "Operativ xotira (RAM)", ["Qattiq disk", "Fleshka", "SSD disk"], "RAM — vaqtinchalik xotira."],
    [1, "Ma'lumotlarni uzoq muddat saqlaydigan qurilma qaysi?", "Qattiq disk", ["Operativ xotira", "Protsessor", "Monitor"], "Qattiq disk/SSD — doimiy xotira."],
    [1, "Internetdagi veb-sahifalarni ko'rish uchun qanday dastur ishlatiladi?", "Brauzer", ["Antivirus", "Arxivator", "Matn muharriri"], "Chrome, Firefox, Edge — brauzerlar."],
    [1, "Quyidagilardan qaysi biri operatsion tizim?", "Windows", ["Microsoft Word", "Google Chrome", "Telegram"], "Windows, Linux, macOS, Android — OT."],
    [1, "Qaysi parol eng ishonchli?", "K7#mQ2!vRp", ["123456", "parol", "qwerty"], "Uzun, harf, raqam va belgilar aralash parol ishonchli."],
    [1, "Matnni nusxalash uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + C", ["Ctrl + V", "Ctrl + Z", "Ctrl + S"], "Ctrl+C — nusxa, Ctrl+V — qo'yish."],
    [1, "Oxirgi amalni bekor qilish uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + Z", ["Ctrl + C", "Ctrl + P", "Ctrl + A"], "Ctrl+Z — bekor qilish."],
    [1, "Nusxalangan matnni qo'yish uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + V", ["Ctrl + C", "Ctrl + Z", "Ctrl + X"], "Ctrl+C — nusxa olish, Ctrl+V — qo'yish."],
    [1, "Hujjatni saqlash uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + S", ["Ctrl + P", "Ctrl + A", "Ctrl + Z"], "S — Save (saqlash)."],
    [1, "Butun matnni belgilash uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + A", ["Ctrl + S", "Ctrl + C", "Ctrl + P"], "A — All (hammasi)."],
    [1, "Hujjatni chop etish (printerga yuborish) uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + P", ["Ctrl + S", "Ctrl + V", "Ctrl + A"], "P — Print (chop etish)."],
    [1, "Matnni kesib olish uchun qaysi tugmalar birikmasi ishlatiladi?", "Ctrl + X", ["Ctrl + C", "Ctrl + V", "Ctrl + Z"], "Kesilgan matn Ctrl+V bilan qo'yiladi."],
    [1, "Qaysi qurilma ham kiritish, ham chiqarish qurilmasi bo'la oladi?", "Sensorli ekran", ["Klaviatura", "Printer", "Karnay"], "Sensorli ekran tasvirni ko'rsatadi va bosishni sezadi."],
    [1, "Matn terish uchun mo'ljallangan dastur qaysi?", "Microsoft Word", ["Microsoft Excel", "Paint", "Kalkulyator"], "Excel — elektron jadval, Paint — rasm chizish dasturi."],
    [1, "Elektron jadvallar bilan ishlash dasturi qaysi?", "Microsoft Excel", ["Microsoft Word", "PowerPoint", "Paint"], "Excel'da hisob-kitoblar formulalar bilan bajariladi."],
    [1, "Taqdimot (slaydlar) tayyorlash dasturi qaysi?", "PowerPoint", ["Excel", "Word", "Notepad"], "PowerPoint'da slaydlar yaratiladi."],
    [1, "Kompyuter sichqonchasi qanday qurilma?", "Kiritish qurilmasi", ["Chiqarish qurilmasi", "Xotira qurilmasi", "Tarmoq qurilmasi"], "Sichqoncha bilan kompyuterga buyruq beriladi."],
    [2, "HTTPS dagi \"S\" harfi nimani bildiradi?", "Xavfsiz (shifrlangan) ulanish", ["Tezkor ulanish", "Server nomi", "Sayt hajmi"], "S — Secure."],
    [2, "Internetdagi har bir kompyuterning raqamli manzili nima deyiladi?", "IP-manzil", ["URL", "E-mail", "Login"], "Masalan, 192.168.1.1."],
    [2, "Veb-sahifaning to'liq manzili (masalan, https://kuvonch.uz) nima deyiladi?", "URL", ["IP-manzil", "Brauzer", "Protokol"], "URL — resursning internetdagi manzili."],
    [2, "Soxta xat yoki sayt orqali parol va karta ma'lumotlarini o'g'irlash nima deyiladi?", "Fishing", ["Spam", "Bloging", "Strim"], "Fishing — firibgarlik usuli."],
    [2, "Simsiz lokal tarmoq texnologiyasi qanday ataladi?", "Wi-Fi", ["USB", "HDMI", "Ethernet"], "Wi-Fi — radioto'lqinlar orqali ulanish."],
    [2, "Kompyuterni zararli dasturlardan himoya qiluvchi dastur qanday ataladi?", "Antivirus", ["Brauzer", "Drayver", "Arxivator"], "Antivirus viruslarni aniqlaydi va yo'q qiladi."],
    [2, "Dasturlashda qiymat saqlanadigan nomlangan xotira joyi nima deyiladi?", "O'zgaruvchi", ["Sikl", "Shart", "Funksiya chaqiruvi"], "Masalan, x = 5."],
    [2, "Amallarni bir necha marta takrorlash uchun qanday konstruksiya ishlatiladi?", "Sikl", ["Shart", "O'zgaruvchi", "Izoh"], "Python'da for va while."],
    [2, "Python'da shart operatori qaysi?", "if", ["for", "print", "def"], "if — agar, else — aks holda."],
    [3, "Python'da ekranga chiqarish funksiyasi qaysi?", "print()", ["input()", "len()", "int()"], "print() — chiqarish, input() — kiritish."],
    [3, "Python'da foydalanuvchidan ma'lumot kiritish funksiyasi qaysi?", "input()", ["print()", "len()", "range()"], "input() matn qaytaradi."],
    [3, "Python'da funksiya qaysi kalit so'z bilan e'lon qilinadi?", "def", ["func", "function", "void"], "def nom(parametrlar):"],
    [3, "Python'da range(5) qaysi sonlarni beradi?", "0, 1, 2, 3, 4", ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "5, 4, 3, 2, 1"], "range(n): 0 dan n − 1 gacha."],
    [3, "Python'da // amali nima qiladi?", "Butun bo'lish", ["Qoldiqni topish", "Darajaga oshirish", "Oddiy bo'lish"], "7 // 2 = 3."],
    [3, "Python'da % amali nima qiladi?", "Bo'linmaning qoldig'ini topadi", ["Foizni hisoblaydi", "Butun bo'ladi", "Darajaga oshiradi"], "7 % 2 = 1."],
    [3, "Python'da ** amali nima qiladi?", "Darajaga oshiradi", ["Ko'paytiradi", "Butun bo'ladi", "Qoldiq topadi"], "2 ** 3 = 8."],
    [3, "Domen nomlarini IP-manzillarga aylantiruvchi xizmat qanday ataladi?", "DNS", ["HTML", "USB", "CSS"], "DNS — Domain Name System."],
    [3, "Veb-sahifalar tuzilishi qaysi til yordamida yoziladi?", "HTML", ["Python", "SQL", "Excel"], "HTML — gipermatnli belgilash tili."],
    [1,"Kompyuterda barcha qurilmalarni boshqarib, dasturlarni ishga tushiradigan asosiy dastur qanday ataladi?","Operatsion tizim",["Drayver","Brauzer","Antivirus"],"Operatsion tizim kompyuter resurslarini boshqaradi va boshqa dasturlarga muhit yaratadi."],
    [1,"Kompyuter ma'lumotlarni qanday sanoq sistemasida qayta ishlaydi?","Ikkilik (binary)",["O'nlik","Sakkizlik","O'n oltilik"],"Kompyuter ichida ma'lumot faqat 0 va 1 raqamlari — bitlar orqali ifodalanadi."],
    [1,"Ma'lumotning eng kichik birligi qanday ataladi?","Bit",["Bayt","Fayl","Piksel"],"Bit — 0 yoki 1 qiymatini oladigan eng kichik axborot birligi."],
    [1,"8 bit nimani tashkil qiladi?","1 bayt",["1 kilobayt","1 fayl","1 piksel"],"Standart bo'yicha 8 bit birlashib 1 baytni hosil qiladi."],
    [1,"Qaysi qurilma monitorga tasvirni shakllantirib beradi?","Video karta",["Klaviatura","Printer","Skaner"],"Video karta grafik ma'lumotlarni qayta ishlab, ekranga chiqaradi."],
    [1,"Hujjatlarni qog'ozga chop etish uchun qaysi qurilma ishlatiladi?","Printer",["Skaner","Monitor","Proyektor"],"Printer elektron hujjatni qog'ozga bosib chiqaradi."],
    [1,"Qog'ozdagi rasm yoki matnni kompyuterga raqamli ko'rinishda kiritish uchun qaysi qurilma ishlatiladi?","Skaner",["Printer","Monitor","Karnay"],"Skaner qog'ozdagi tasvirni optik usulda o'qib, raqamli faylga aylantiradi."],
    [1,"Kompyuterda fayl va papkalarni diskda tartibli saqlash usuli nima deyiladi?","Fayl tizimi",["Tarmoq","Brauzer","Interfeys"],"Fayl tizimi ma'lumotlarni disk ichida tartibli saqlash usulini belgilaydi."],
    [1,"Internetga ulanish uchun xizmat ko'rsatuvchi tashkilot qanday ataladi?","Internet-provayder",["Brauzer","Server","Domen"],"Internet-provayder foydalanuvchiga tarmoqqa kirish imkonini beradi."],
    [1,"Elektron pochta orqali xabar yuborish va qabul qilish xizmati qanday ataladi?","E-mail",["Chat","Forum","Blog"],"E-mail — internet orqali elektron xat almashish xizmati."],
    [1,"Fayl nomining oxiridagi nuqtadan keyingi qism (masalan, .docx) nima deyiladi?","Kengaytma",["Teg","Format kodi","Indeks"],"Kengaytma fayl turini va uni qaysi dastur ochishini bildiradi."],
    [1,"Rasm fayllarining keng tarqalgan kengaytmasi qaysi?","JPG",["TXT","EXE","MP3"],"JPG — rasm va suratlarni saqlash uchun ishlatiladigan fayl formati."],
    [1,"Video fayllarning keng tarqalgan kengaytmalaridan biri qaysi?","MP4",["DOCX","XLSX","JPG"],"MP4 — video va tovushni birga saqlash uchun ishlatiladigan formatdir."],
    [1,"Kompyuterda faylni butunlay o'chirishdan oldin u avval qayerga tushadi?","Savatchaga (Recycle Bin)",["Operativ xotiraga","Buferga","Serverga"],"Savatchaga tushgan fayl u yerdan tozalanmaguncha qayta tiklanishi mumkin."],
    [1,"Dasturiy ta'minotni qonuniy ruxsatsiz nusxalash va tarqatish nima deyiladi?","Piratlik",["Xaking","Fishing","Spamming"],"Piratlik mualliflik huquqini buzgan holda dasturni ruxsatsiz tarqatishdir."],
    [1,"Kompyuter tarmog'ida bir nechta kompyuterni ulash uchun ishlatiladigan asosiy qurilma qaysi?","Router",["Skaner","Printer","Monitor"],"Router tarmoqdagi qurilmalar orasida ma'lumot yo'nalishini boshqaradi."],
    [1,"Smartfon va planshetlarda keng qo'llaniladigan operatsion tizim qaysi?","Android",["Excel","Word","Photoshop"],"Android — mobil qurilmalar uchun mo'ljallangan ochiq operatsion tizim."],
    [1,"Internetdan foydalanishda shaxsiy ma'lumotlarni begonalarga oshkor qilmaslik nima deyiladi?","Maxfiylik (privatlik)",["Fishing","Spam","Reklama"],"Maxfiylikni saqlash foydalanuvchini internet xavflaridan himoya qiladi."],
    [1,"Kerakli bo'lmagan, ko'plab yuboriladigan reklama xatlari qanday ataladi?","Spam",["Fishing","Virus","Drayver"],"Spam — foydalanuvchiga ruxsatsiz yuboriladigan keraksiz ommaviy xabarlar."],
    [1,"Kompyuter dasturlarini yozish jarayoni qanday ataladi?","Dasturlash",["Modellashtirish","Arxivlash","Formatlash"],"Dasturlash orqali kompyuterga bajarilishi kerak bo'lgan amallar ketma-ketligi yoziladi."],
    [1,"Bitta vazifani bajarish uchun yoziladigan aniq buyruqlar ketma-ketligi nima deyiladi?","Algoritm",["Interfeys","Protokol","Drayver"],"Algoritm — masalani yechish uchun qadamlar tartibini belgilaydi."],
    [2,"Kompyuterning tezligini asosan belgilaydigan protsessor ko'rsatkichi qaysi?","Taktlar chastotasi",["Ekran o'lchami","Printer turi","Fayl kengaytmasi"],"Taktlar chastotasi protsessor bir sekundda necha takt bajarishini bildiradi va gigagerts (GGs) da o'lchanadi."],
    [2,"Kompyuter operativ xotirasining hajmi qaysi birlikda o'lchanadi (odatda)?","Gigabayt (GB)",["Gigagerts (GHz)","Vatt (W)","Megapiksel (MP)"],"RAM hajmi odatda gigabaytlarda (GB) ko'rsatiladi."],
    [2,"Tarmoqdagi har bir qurilmani aniqlaydigan raqamli manzil qanday ataladi?","IP-manzil",["URL","DNS","HTML"],"Har bir qurilmaga tarmoqda noyob IP-manzil beriladi."],
    [2,"Veb-sahifalarni serverdan olib, foydalanuvchiga ko'rsatadigan dastur qanday ataladi?","Brauzer",["Kompilyator","Drayver","Antivirus"],"Brauzer HTML kodini o'qib, uni vizual sahifa ko'rinishiga aylantiradi."],
    [2,"Veb-saytlar joylashtiriladigan va doimiy ishlab turadigan kuchli kompyuter qanday ataladi?","Server",["Router","Modem","Klient"],"Server foydalanuvchi so'roviga javoban ma'lumot va xizmat taqdim etadi."],
    [2,"Bulutli xotira (cloud storage) nima uchun ishlatiladi?","Fayllarni internet orqali uzoqdagi serverda saqlash uchun",["Kompyuterni tezlashtirish uchun","Virusdan himoyalanish uchun","Ekran o'lchamini o'zgartirish uchun"],"Bulutli xotira fayllarga istalgan qurilmadan internet orqali kirish imkonini beradi."],
    [2,"Ma'lumotlarni nusxalab, boshqa joyda saqlab qo'yish (yo'qotilsa tiklash uchun) nima deyiladi?","Zaxira nusxa (backup)",["Format","Arxiv","Kesh"],"Zaxira nusxa ma'lumot yo'qolganda uni qayta tiklash imkonini beradi."],
    [2,"Kompyuter tarmoqlarida ma'lumot almashish qoidalari to'plami qanday ataladi?","Protokol",["Kodek","Drayver","Interfeys"],"Protokol qurilmalar o'zaro qanday tartibda ma'lumot almashishini belgilaydi."],
    [2,"Ikki yoki undan ortiq kompyuter dasturi o'rtasida ma'lumot almashinuvini ta'minlaydigan vosita qaysi?","API",["URL","IP","GUI"],"API dasturlarga bir-biri bilan standart usulda bog'lanish imkonini beradi."],
    [2,"Foydalanuvchi va dastur o'rtasidagi grafik (tugma, oyna kabi) muloqot vositasi qanday ataladi?","GUI (grafik interfeys)",["CPU","RAM","URL"],"GUI foydalanuvchiga dastur bilan vizual elementlar orqali ishlashni osonlashtiradi."],
    [2,"Dasturda xatolik yoki kamchilikni topish va tuzatish jarayoni nima deyiladi?","Debugging",["Kompilyatsiya","Installatsiya","Formatlash"],"Debugging dasturdagi xatolarni (baglarni) aniqlab, bartaraf etishdir."],
    [2,"Yuqori darajali dasturlash tilida yozilgan kodni kompyuter tushunadigan mashina kodiga aylantirish nima deyiladi?","Kompilyatsiya",["Debugging","Arxivlash","Render"],"Kompilyator manba kodini protsessor bajara oladigan ko'rinishga o'tkazadi."],
    [2,"Dasturlashda bir xil amalni bajaruvchi, qayta-qayta chaqirilishi mumkin bo'lgan kod bo'lagi nima deyiladi?","Funksiya",["O'zgaruvchi","Sikl","Massiv"],"Funksiya kodni takrorlamasdan bir necha joyda qayta ishlatish imkonini beradi."],
    [2,"Bir nomli o'zgaruvchida ketma-ket joylashgan bir turdagi qiymatlar to'plami qanday ataladi?","Massiv",["Funksiya","Sikl","Shart"],"Massiv bir nechta qiymatni bitta nom ostida indekslar yordamida saqlaydi."],
    [2,"Dasturlashda shartga qarab ikki yo'ldan birini tanlab bajarish uchun qaysi konstruksiya ishlatiladi?","if-else",["for","while","def"],"if-else shart to'g'ri yoki noto'g'ri bo'lishiga qarab turli amallarni bajaradi."],
    [2,"Ma'lum son marta takrorlanadigan siklni yozishda ko'pincha qaysi kalit so'z qulay ishlatiladi?","for",["if","def","class"],"for sikli odatda oldindan ma'lum bo'lgan son marta takrorlash uchun ishlatiladi."],
    [2,"Python tilida matn (satr) turidagi ma'lumot qanday ataladi?","String (str)",["Integer (int)","Boolean (bool)","List"],"String — harflar, so'z va belgilardan iborat matn turi."],
    [2,"Python tilida butun son turi qanday ataladi?","Integer (int)",["String (str)","Float","Boolean"],"Integer — kasr qismisiz butun sonlarni ifodalaydigan ma'lumot turi."],
    [2,"Python tilida True yoki False qiymatini oladigan ma'lumot turi qanday ataladi?","Boolean (bool)",["Integer","String","List"],"Boolean mantiqiy qiymatlarni, faqat ikki holatni ifodalaydi."],
    [3,"Python'da bir nechta qiymatni tartib bilan saqlaydigan va o'zgartirish mumkin bo'lgan tur qaysi?","List",["Tuple","Set","Int"],"List — kvadrat qavs ichida yoziladigan, elementlari o'zgartiriladigan ro'yxat turi."],
    [3,"Python'da len() funksiyasi nimani qaytaradi?","Element (uzunlik) sonini",["Eng katta qiymatni","O'rtacha qiymatni","Fayl nomini"],"len() funksiyasi satr, ro'yxat yoki boshqa to'plamdagi elementlar sonini beradi."],
    [3,"Python'da str() funksiyasi nima uchun ishlatiladi?","Qiymatni matn (satr) turiga aylantirish uchun",["Qiymatni songa aylantirish uchun","Faylni o'chirish uchun","Ro'yxatni saralash uchun"],"str() istalgan turdagi qiymatni matn ko'rinishiga o'zgartiradi."],
    [3,"Python'da int() funksiyasi nima uchun ishlatiladi?","Qiymatni butun songa aylantirish uchun",["Qiymatni matnga aylantirish uchun","Ro'yxat yaratish uchun","Funksiya chaqirish uchun"],"int() satr yoki kasr sonni butun songa o'zgartiradi."],
    [3,"Python'da ro'yxatga yangi element qo'shish uchun qaysi metod ishlatiladi?","append()",["remove()","sort()","len()"],"append() metodi ro'yxat oxiriga yangi element qo'shadi."],
    [3,"Python'da ro'yxatdagi elementlarni o'sish tartibida tartiblash uchun qaysi metod ishlatiladi?","sort()",["append()","len()","range()"],"sort() metodi ro'yxat elementlarini o'sish tartibida joylashtiradi."],
    [3,"Python'da while sikli qachongacha ishlaydi?","Shart True bo'lguncha",["Shart False bo'lguncha","Faqat 10 marta","Fayl tugaguncha"],"while sikli shart True bo'lib turgan ekan, amallarni takrorlaydi."],
    [3,"Python tilida # belgisidan keyin yozilgan matn nima uchun ishlatiladi?","Izoh yozish uchun",["Funksiya chaqirish uchun","O'zgaruvchi e'lon qilish uchun","Faylni ochish uchun"],"# dan keyingi matn dastur tomonidan bajarilmaydi, faqat tushuntirish uchun yoziladi."],
    [3,"Python tilida ikki qiymat teng emasligini tekshiruvchi taqqoslash belgisi qaysi?","!=",["==","=",">="],"!= belgisi ikki tomon bir-biriga teng emasligini tekshiradi."],
    [3,"Python tilida mantiqiy VA (ikkisi ham to'g'ri bo'lishi kerak) amali qanday yoziladi?","and",["or","not","xor"],"and amali faqat ikkala shart ham rost bo'lgandagina natijani rost qiladi."],
    [3,"Python tilida mantiqiy YOKI (kamida bittasi to'g'ri bo'lsa yetarli) amali qanday yoziladi?","or",["and","not","nor"],"or amali shartlardan kamida bittasi rost bo'lsa, natijani rost qiladi."],
    [3,"Python tilida shartni inkor qiluvchi (teskarisiga aylantiruvchi) amal qaysi?","not",["and","or","xor"],"not amali True qiymatni False ga, False ni True ga aylantiradi."],
    [3,"HTML tilida havola (link) yaratish uchun qaysi teg ishlatiladi?","a tegi",["p tegi","div tegi","img tegi"],"a tegi href atributi orqali boshqa sahifaga havola yaratadi."],
    [3,"HTML tilida rasm joylashtirish uchun qaysi teg ishlatiladi?","img tegi",["a tegi","p tegi","table tegi"],"img tegi src atributi orqali rasm faylini sahifaga chiqaradi."],
    [3,"Veb-sahifalarning tashqi ko'rinishi (rang, shrift, joylashuv) qaysi til orqali belgilanadi?","CSS",["HTML","SQL","PHP"],"CSS HTML elementlarining dizayn va uslubini belgilaydi."],
    [3,"Veb-saytlarda interaktiv harakatlar (tugma bosilganda amal) uchun eng ko'p ishlatiladigan skript tili qaysi?","JavaScript",["CSS","HTML","SQL"],"JavaScript brauzerda ishlab, sahifani dinamik va interaktiv qiladi."],
    [3,"Ma'lumotlar bazasidan ma'lumot so'rash uchun ishlatiladigan maxsus til qaysi?","SQL",["HTML","CSS","Python"],"SQL ma'lumotlar bazasida yozuvlarni qidirish, qo'shish va o'chirish uchun ishlatiladi."],
    [3,"Internetda ma'lumot uzatishning asosiy protokoli qaysi (veb-sahifalar uchun)?","HTTP",["FTP","SMTP","DNS"],"HTTP brauzer va server o'rtasida veb-sahifa ma'lumotlarini uzatish qoidalarini belgilaydi."],
    [3,"Fayllarni internet orqali serverga yuklash va yuklab olish uchun mo'ljallangan protokol qaysi?","FTP",["HTTP","DNS","SMTP"],"FTP serverlar bilan fayl almashish uchun maxsus ishlab chiqilgan protokoldir."],
    [3,"Elektron xat yuborish uchun ishlatiladigan tarmoq protokoli qaysi?","SMTP",["HTTP","FTP","DNS"],"SMTP elektron pochta xabarlarini serverlar orasida uzatish qoidalarini belgilaydi."],
    [3,"Python'da elementlarini o'zgartirib bo'lmaydigan tartiblangan to'plam (list dan farqli) qanday ataladi?","Tuple",["List","Dictionary","Set"],"Tuple yaratilgandan keyin elementlari o'zgartirilmaydigan tartiblangan to'plamdir."],
    [3,"Python'da kalit va qiymat juftliklarini saqlaydigan ma'lumot turi qanday ataladi?","Dictionary (dict)",["List","Tuple","Set"],"Dictionary har bir qiymatga mos keladigan noyob kalit orqali ma'lumotni saqlaydi."]
  ]);
  function I3(L) {
    var k = pick(lv(L, [0, 1, 9, 9], [0, 2, 3, 4, 9, 9], [2, 3, 4, 5, 6, 7, 9])), it, a, b, c, s, x, y;
    if (k === 0) { it = pick(EXT);
      return TQ("<b>" + it[0] + "</b> kengaytmali fayl odatda nima?", it[1], others(EXT.map(function (e) { return e[1]; }), it[1], 3), [it[0] + " — " + it[1].toLowerCase() + "."]); }
    if (k === 1) { it = pick(EXT);
      return TQ("<b>" + it[1] + "</b> qaysi kengaytmaga ega bo'ladi?", it[0], others(EXT.map(function (e) { return e[0]; }), it[0], 3), [it[1] + " — " + it[0]]); }
    if (k === 2) { a = R(1, 9); b = R(2, 9); c = R(2, 6); var op = pick([0, 1, 2, 3]), expr, val, wr;
      if (op === 0) { expr = a + " + " + b + " * " + c; val = a + b * c; wr = [(a + b) * c, a + b + c, a * b + c]; }
      else if (op === 1) { expr = "(" + a + " + " + b + ") * " + c; val = (a + b) * c; wr = [a + b * c, a + b + c, (a + b) + c * 2]; }
      else if (op === 2) { a = R(10, 40); expr = a + " - " + b + " * " + c; val = a - b * c; wr = [(a - b) * c, a - b - c, val + 2]; }
      else { a = R(3, 9); b = R(2, 9); c = R(2, 5); expr = a + " * " + c + " - " + b; val = a * c - b; wr = [a * (c - b), val + 2 * b, a * c + b]; }
      return NQ("Python: <b>print(" + expr + ")</b> nimani chiqaradi?", val, "", wr, ["Avval ko'paytirish, keyin qo'shish/ayirish (qavs bo'lsa — avval qavs).", expr + " = " + f(val)], true); }
    if (k === 3) { s = pick(["salom", "kitob", "maktab", "python", "informatika", "olma", "kompyuter", "robot", "dastur", "Toshkent", "kuvonch", "a b c", "Salom dunyo"]);
      return NQ("Python: <b>print(len(\"" + s + "\"))</b> nimani chiqaradi?", s.length, "", [s.length + 1, s.length - 1, s.replace(/ /g, "").length !== s.length ? s.replace(/ /g, "").length : s.length + 2, s.length * 2], ["len() satrdagi belgilar sonini qaytaradi (bo'sh joy ham belgi): " + s.length]); }
    if (k === 4) { a = R(7, 40); b = R(2, 7); var md = pick([0, 1, 2]);
      if (md === 0) return NQ("Python: <b>print(" + a + " // " + b + ")</b> nimani chiqaradi?", Math.floor(a / b), "", [a % b, Number((a / b).toFixed(2)), Math.floor(a / b) + 1, a * b], ["// — butun bo'lish: " + a + " = " + b + " · " + Math.floor(a / b) + " + " + a % b]);
      if (md === 1) { while (a % b === 0) a++;
        return NQ("Python: <b>print(" + a + " % " + b + ")</b> nimani chiqaradi?", a % b, "", [Math.floor(a / b), a % b + 1, b - a % b === a % b ? a % b + 2 : b - a % b, Number((a / b).toFixed(2))], ["% — qoldiq: " + a + " = " + b + " · " + Math.floor(a / b) + " + " + a % b]); }
      a = R(2, 5); b = R(2, 4);
      return NQ("Python: <b>print(" + a + " ** " + b + ")</b> nimani chiqaradi?", Math.pow(a, b), "", [a * b, Math.pow(b, a) === Math.pow(a, b) ? a * b + 1 : Math.pow(b, a), a + b, Math.pow(a, b) + a], ["** — daraja: " + a + "<sup>" + b + "</sup> = " + Math.pow(a, b)]); }
    if (k === 5) { x = R(1, 9); y = R(1, 9); a = R(2, 4);
      return NQ("Python:<br><b>x = " + x + "<br>y = " + y + "<br>x = x + y<br>y = x * " + a + "<br>print(y)</b><br>Natija?", (x + y) * a, "", [y * a, x * a, x + y * a, (x + y) * a + y], ["x = " + x + " + " + y + " = " + (x + y), "y = " + (x + y) + " · " + a + " = " + (x + y) * a]); }
    if (k === 6) { a = R(3, 8); var st = pick([1, 2]), sum = 0;
      for (var i = 0; i < a; i += st) sum += i;
      return NQ("Python:<br><b>s = 0<br>for i in range(0, " + a + ", " + st + "): s = s + i<br>print(s)</b><br>Natija?", sum, "", [sum + a, a * (a + 1) / 2 === sum ? sum + 1 : a * (a + 1) / 2, sum - st, a], ["i qiymatlari: " + (function () { var r = []; for (var j = 0; j < a; j += st) r.push(j); return r.join(", "); })() + " (" + a + " kirmaydi)", "s = " + sum]); }
    if (k === 9) return BK_I3(L);
    a = R(10, 30); b = R(10, 30); if (a === b) b++;
    return TQ("Python:<br><b>a = " + a + "<br>b = " + b + "<br>if a > b: print(\"A\")<br>else: print(\"B\")</b><br>Natija?", a > b ? "A" : "B", [a > b ? "B" : "A", "AB", "Hech narsa"], [a + (a > b ? " > " : " < ") + b + " ⇒ " + (a > b ? "if" : "else") + " bajariladi."]);
  }
  S.register("i3", I3, "Informatika · Kompyuter, internet va dasturlash");


  /* ================= i4 Mantiqiy amallar va algoritmlar ================= */
  var BK_I4 = bank([
    [1, "Muayyan natijaga olib keluvchi aniq ketma-ket ko'rsatmalar nima deyiladi?", "Algoritm", ["Dastur tili", "Kompyuter", "Fayl"], "Algoritm — buyruqlar ketma-ketligi."],
    [1, "Blok-sxemada shart (tekshirish) qaysi shakl bilan belgilanadi?", "Romb", ["To'g'ri to'rtburchak", "Oval", "Parallelogramm"], "Romb ichida shart yoziladi, \"ha\"/\"yo'q\" chiqishlari bo'ladi."],
    [1, "Blok-sxemada boshlanish va tugash qaysi shakl bilan belgilanadi?", "Oval", ["Romb", "To'g'ri to'rtburchak", "Uchburchak"], "Oval (aylanasimon to'rtburchak) — boshlash/tugatish."],
    [1, "Blok-sxemada amal (hisoblash) qaysi shakl bilan belgilanadi?", "To'g'ri to'rtburchak", ["Romb", "Oval", "Doira"], "To'g'ri to'rtburchak — jarayon bloki."],
    [1, "Blok-sxemada ma'lumot kiritish/chiqarish qaysi shakl bilan belgilanadi?", "Parallelogramm", ["Romb", "Oval", "Uchburchak"], "Parallelogramm — kiritish/chiqarish."],
    [1, "Buyruqlar ketma-ket, birin-ketin bajariladigan algoritm qanday ataladi?", "Chiziqli", ["Tarmoqlanuvchi", "Takrorlanuvchi", "Rekursiv"], "Chiziqli algoritmda shart va takrorlash yo'q."],
    [1, "Shartga qarab turli yo'llardan biri bajariladigan algoritm qanday ataladi?", "Tarmoqlanuvchi", ["Chiziqli", "Takrorlanuvchi", "Parallel"], "if ... else — tarmoqlanish."],
    [1, "Bir xil amallar bir necha marta bajariladigan algoritm qanday ataladi?", "Takrorlanuvchi (sikl)", ["Chiziqli", "Tarmoqlanuvchi", "Bir martalik"], "for, while — sikllar."],
    [2, "Mantiqiy \"VA\" (AND) amali qachon 1 (rost) bo'ladi?", "Ikkala qiymat ham 1 bo'lsa", ["Kamida bittasi 1 bo'lsa", "Ikkalasi ham 0 bo'lsa", "Qiymatlar turlicha bo'lsa"], "Konyunksiya: 1 VA 1 = 1, qolganlari 0."],
    [2, "Mantiqiy \"YOKI\" (OR) amali qachon 0 (yolg'on) bo'ladi?", "Ikkala qiymat ham 0 bo'lsa", ["Ikkalasi ham 1 bo'lsa", "Bittasi 1 bo'lsa", "Hech qachon"], "Diz'yunksiya: 0 YOKI 0 = 0, qolganlari 1."],
    [2, "\"EMAS\" (NOT) amali 1 ga qo'llansa natija qanday?", "0", ["1", "2", "−1"], "Inkor qiymatni teskarisiga aylantiradi."],
    [2, "Algoritmning har bir qadami bir xil tushunilishi xossasi nima deyiladi?", "Aniqlik", ["Ommaviylik", "Natijaviylik", "Diskretlik"], "Aniqlik — har bir buyruq bir ma'noli."],
    [2, "Algoritmning chekli qadamdan so'ng natijaga olib kelishi xossasi qanday ataladi?", "Natijaviylik", ["Ommaviylik", "Aniqlik", "Tushunarlilik"], "Natijaviylik (cheklilik)."],
    [2, "Bitta algoritm bir turdagi ko'plab masalalarga qo'llanishi xossasi qanday ataladi?", "Ommaviylik", ["Diskretlik", "Aniqlik", "Natijaviylik"], "Masalan, istalgan ikki sonni qo'shish algoritmi."],
    [2, "Ikki mantiqiy qiymatdan faqat bittasi 1 bo'lganda 1 beradigan amal qaysi?", "XOR (istisno qiluvchi YOKI)", ["VA (AND)", "YOKI (OR)", "EMAS (NOT)"], "XOR: 0⊕1 = 1, 1⊕1 = 0."],
    [3, "n ta mantiqiy o'zgaruvchi uchun rostlik jadvalida nechta qator bo'ladi?", "2ⁿ ta", ["n ta", "2n ta", "n² ta"], "Har bir o'zgaruvchi 2 qiymat oladi."],
    [3, "De Morgan qonuni: EMAS (A VA B) nimaga teng?", "(EMAS A) YOKI (EMAS B)", ["(EMAS A) VA (EMAS B)", "A YOKI B", "A VA (EMAS B)"], "¬(A ∧ B) = ¬A ∨ ¬B."],
    [3, "De Morgan qonuni: EMAS (A YOKI B) nimaga teng?", "(EMAS A) VA (EMAS B)", ["(EMAS A) YOKI (EMAS B)", "A VA B", "EMAS A"], "¬(A ∨ B) = ¬A ∧ ¬B."],
    [3, "Saralangan massivda elementni har qadamda oraliqni ikkiga bo'lib qidirish nima deyiladi?", "Ikkilik (binar) qidiruv", ["Chiziqli qidiruv", "Pufakchali saralash", "Rekursiya"], "Har qadamda oraliq 2 marta qisqaradi."],
    [3, "Ikkilik qidiruv qanday massivda ishlaydi?", "Saralangan massivda", ["Istalgan massivda", "Faqat bo'sh massivda", "Faqat 2 elementli massivda"], "Ikkilik qidiruv tartiblangan ma'lumotni talab qiladi."],
    [3, "Funksiyaning o'zini o'zi chaqirishi nima deyiladi?", "Rekursiya", ["Iteratsiya", "Saralash", "Kompilyatsiya"], "Masalan, n! = n·(n−1)!"],
    [3, "Qo'shni elementlarni taqqoslab, joyini almashtirib saralash usuli qaysi?", "Pufakchali saralash", ["Ikkilik qidiruv", "Tez saralash", "Chiziqli qidiruv"], "Bubble sort."],
    [3, "while sikli qachon to'xtaydi?", "Shart yolg'on bo'lganda", ["Shart rost bo'lganda", "Faqat 10 marta bajarilgach", "Hech qachon"], "while shart rost ekan takrorlanadi."],
    [3, "Algoritmni kompyuter tushunadigan tilda yozish nima deyiladi?", "Dasturlash", ["Tahrirlash", "Formatlash", "Arxivlash"], "Dastur — algoritmning kompyuter tilidagi yozuvi."],
    [1, "Algoritmni bajaruvchi (odam, robot yoki kompyuter) nima deb ataladi?", "Ijrochi", ["Muallif", "Kompilyator", "Fayl"], "Ijrochi buyruqlar tizimidagi buyruqlarni bajaradi."],
    [1, "Mantiqiy amallarda qanday qiymatlar ishlatiladi?", "Rost (1) va yolg'on (0)", ["1 va 2", "Ha va balki", "0 va 10"], "Mulohaza yoki rost, yoki yolg'on bo'ladi."],
    [1, "Algoritmni ifodalashning grafik usuli qanday ataladi?", "Blok-sxema", ["Jadval", "Formula", "Matn"], "Blok-sxemada buyruqlar shakllar va strelkalar bilan beriladi."],
    [2, "\"Bugun havo qanday?\" gapi mulohaza bo'ladimi?", "Yo'q, u so'roq gap", ["Ha, rost mulohaza", "Ha, yolg'on mulohaza", "Ha, murakkab mulohaza"], "Mulohaza — rost yoki yolg'onligini aytish mumkin bo'lgan darak gap."],
    [2, "Algoritmning alohida qadamlardan iborat bo'lishi qaysi xossa?", "Diskretlik", ["Ommaviylik", "Natijaviylik", "Aniqlik"], "Har bir qadam tugagach, keyingisi boshlanadi."],
    [2, "Siklda takrorlanadigan buyruqlar guruhi nima deyiladi?", "Sikl tanasi", ["Sikl sharti", "Blok-sxema", "O'zgaruvchi"], "Sikl tanasi shart bajarilguncha takrorlanadi."],
    [3, "Implikatsiya (A → B) qachon yolg'on (0) bo'ladi?", "A = 1, B = 0 bo'lganda", ["A = 0, B = 1 bo'lganda", "A = 0, B = 0 bo'lganda", "A = 1, B = 1 bo'lganda"], "Qolgan barcha hollarda A → B = 1."],
    [3, "Cheksiz sikl qachon yuzaga keladi?", "Sikl sharti doim rost bo'lsa", ["Sikl sharti darhol yolg'on bo'lsa", "Sikl tanasi bo'sh bo'lsa", "O'zgaruvchi e'lon qilinsa"], "Shart hech qachon yolg'on bo'lmasa, sikl to'xtamaydi."],
    [3, "Rekursiv funksiyada nima bo'lishi shart?", "To'xtash (bazaviy) sharti", ["Cheksiz sikl", "Global o'zgaruvchi", "Kamida ikkita parametr"], "Aks holda funksiya o'zini cheksiz chaqiradi."],
    [1,"Pythonda ekranga ma'lumot chiqarish uchun qaysi funksiya ishlatiladi?","print()",["input()","len()","range()"],"print() funksiyasi qiymatni ekranga chiqaradi."],
    [1,"Pythonda foydalanuvchidan ma'lumot kiritish uchun qaysi funksiya ishlatiladi?","input()",["print()","int()","abs()"],"input() klaviaturadan kiritilgan matnni o'qib oladi."],
    [1,"«Algoritm» atamasi qaysi buyuk bobokalonimiz nomidan kelib chiqqan?","Al-Xorazmiy",["Ibn Sino","Beruniy","Farobiy"],"Al-Xorazmiy nomining lotincha o'qilishi «algoritm» so'zini bergan."],
    [1,"Mantiq algebrasini yaratgan ingliz matematigi kim?","Jorj Bul",["Isaak Nyuton","Charlz Bebbij","Alan Tyuring"],"Jorj Bul mantiqiy amallarni algebraik shaklda ifodalagan."],
    [1,"Mantiqiy «VA» amalining boshqa nomi qaysi?","Konyunksiya",["Dizyunksiya","Inversiya","Implikatsiya"],"VA amali konyunksiya, ya'ni mantiqiy ko'paytirish deyiladi."],
    [1,"Mantiqiy «YOKI» amalining boshqa nomi qaysi?","Dizyunksiya",["Konyunksiya","Inversiya","Ekvivalensiya"],"YOKI amali dizyunksiya, ya'ni mantiqiy qo'shish deyiladi."],
    [1,"Mantiqiy «EMAS» amalining boshqa nomi qaysi?","Inversiya (inkor)",["Konyunksiya","Dizyunksiya","Implikatsiya"],"EMAS amali qiymatni teskarisiga almashtiradi."],
    [1,"1 VA 0 ifodaning natijasi nimaga teng?","0",["1","2","-1"],"VA amali faqat ikkala qiymat 1 bo'lganda 1 beradi."],
    [1,"0 YOKI 1 ifodaning natijasi nimaga teng?","1",["0","2","10"],"YOKI amali kamida bitta qiymat 1 bo'lsa, 1 beradi."],
    [1,"EMAS 0 ifodaning natijasi nimaga teng?","1",["0","2","-1"],"EMAS amali 0 ni 1 ga almashtiradi."],
    [1,"Rost yoki yolg'on deb baholash mumkin bo'lgan darak gap nima deyiladi?","Mulohaza",["Savol","Buyruq","Ifoda nomi"],"Mantiqda mulohaza faqat rost yoki yolg'on qiymat qabul qiladi."],
    [1,"«5 > 3» mulohazasining qiymati qanday?","Rost",["Yolg'on","Noaniq","Nolga teng"],"Besh uchdan katta, shuning uchun mulohaza rost."],
    [1,"«Toshkent — Qozog'iston poytaxti» mulohazasining qiymati qanday?","Yolg'on",["Rost","Noaniq","Birga teng"],"Toshkent O'zbekiston poytaxti, shuning uchun mulohaza yolg'on."],
    [1,"Blok-sxemada strelkalar nimani bildiradi?","Bajarilish yo'nalishini",["Amal turini","Ma'lumot hajmini","Xato joyini"],"Strelkalar qadamlarning bajarilish tartibini ko'rsatadi."],
    [1,"Algoritmni oddiy so'zlar bilan bayon qilish usuli qanday ataladi?","Og'zaki usul",["Grafik usul","Jadval usuli","Dasturiy usul"],"Og'zaki usulda algoritm qadamlari so'zlar bilan ketma-ket yoziladi."],
    [1,"Dasturdagi xatolarni topib, tuzatish jarayoni nima deyiladi?","Nosozliklarni tuzatish (debugging)",["Kompilyatsiya","Saralash","Arxivlash"],"Debugging dasturdagi xatolarni aniqlash va bartaraf etishdir."],
    [1,"Pythonda if so'zi nima uchun ishlatiladi?","Shartni tekshirish uchun",["Ma'lumot kiritish uchun","Sonni qo'shish uchun","Dasturni tugatish uchun"],"if sharti rost bo'lsa, uning ichidagi buyruqlar bajariladi."],
    [1,"Qiymati saqlanadigan nomlangan xotira joyi dasturlashda nima deyiladi?","O'zgaruvchi",["Operator","Izoh","Sikl"],"O'zgaruvchi qiymatni saqlaydi va dastur davomida o'zgarishi mumkin."],
    [1,"Algoritmning ijrochi tushunadigan buyruqlardan tuzilishi qaysi xossa?","Tushunarlilik",["Ommaviylik","Diskretlik","Natijaviylik"],"Algoritm ijrochi bajara oladigan buyruqlardan iborat bo'lishi kerak."],
    [1,"Pythonda == belgisi nimani tekshiradi?","Tenglikni",["Qiymat berishni","Tengsizlikni","Qo'shishni"],"== ikki qiymat tengmi yoki yo'qligini tekshiradi."],
    [1,"Pythonda matnli qiymat qaysi tur bilan belgilanadi?","str",["int","float","bool"],"str turi matn (qator) qiymatlarini saqlaydi."],
    [2,"A = 1, B = 0 bo'lsa, A XOR B nimaga teng?","1",["0","2","Aniqlanmagan"],"XOR qiymatlar har xil bo'lganda 1 beradi."],
    [2,"A = 1, B = 1 bo'lsa, A XOR B nimaga teng?","0",["1","2","11"],"Qiymatlar bir xil bo'lgani uchun XOR natijasi 0 bo'ladi."],
    [2,"A = 1, B = 0 bo'lsa, (EMAS A) YOKI B ifodasi nimaga teng?","0",["1","2","-1"],"EMAS 1 = 0, keyin 0 YOKI 0 = 0."],
    [2,"A = 1, B = 0 bo'lsa, EMAS (A VA B) ifodasi nimaga teng?","1",["0","2","10"],"1 VA 0 = 0, EMAS 0 = 1."],
    [2,"A YOKI (EMAS A) ifodasi A ning qiymatidan qat'i nazar nimaga teng?","Doim 1 ga",["Doim 0 ga","A ga","EMAS A ga"],"A va EMAS A dan biri albatta 1 bo'ladi, shuning uchun YOKI natijasi 1."],
    [2,"A VA (EMAS A) ifodasi A ning qiymatidan qat'i nazar nimaga teng?","Doim 0 ga",["Doim 1 ga","A ga","EMAS A ga"],"A va EMAS A bir vaqtda 1 bo'la olmaydi, shuning uchun VA natijasi 0."],
    [2,"Barcha qiymatlarda rost bo'ladigan mantiqiy ifoda nima deyiladi?","Tavtologiya",["Qarama-qarshilik","Implikatsiya","Ekvivalensiya"],"Tavtologiya rostlik jadvalining hamma qatorida 1 qiymat oladi."],
    [2,"Barcha qiymatlarda yolg'on bo'ladigan mantiqiy ifoda nima deyiladi?","Qarama-qarshilik",["Tavtologiya","Dizyunksiya","Inversiya"],"Qarama-qarshilik rostlik jadvalining hamma qatorida 0 qiymat oladi."],
    [2,"Ekvivalensiya (A ≡ B) qachon rost bo'ladi?","A va B qiymatlari bir xil bo'lganda",["A va B qiymatlari har xil bo'lganda","Faqat A = 1 bo'lganda","Faqat B = 0 bo'lganda"],"Ekvivalensiya ikki mulohaza qiymati teng bo'lsa, rost bo'ladi."],
    [2,"Mantiqiy amallardan qaysi biri eng yuqori ustuvorlikka ega?","EMAS",["VA","YOKI","Hammasi teng"],"Ustuvorlik tartibi: EMAS, keyin VA, keyin YOKI."],
    [2,"Pythonda 17 % 5 ifodaning natijasi nimaga teng?","2",["3","12","85"],"17 ni 5 ga bo'lganda qoldiq 2 bo'ladi."],
    [2,"s = 0 bo'lib, i ning 1 dan 4 gacha qiymatlari uchun s = s + i bajarilsa, s nimaga teng bo'ladi?","10",["4","6","24"],"1 + 2 + 3 + 4 = 10."],
    [2,"Faktorialni hisoblash algoritmida 5! nimaga teng?","120",["25","60","720"],"5! = 1 · 2 · 3 · 4 · 5 = 120."],
    [2,"Fibonachchi ketma-ketligi 1, 1, 2, 3, 5, 8 ... da keyingi son qaysi?","13",["11","12","16"],"Har bir son oldingi ikkitasining yig'indisi: 5 + 8 = 13."],
    [2,"Evklid algoritmi bo'yicha 24 va 36 sonlarining EKUB i nimaga teng?","12",["6","8","24"],"36 mod 24 = 12, 24 mod 12 = 0, demak EKUB = 12."],
    [2,"Evklid algoritmi nimani topish uchun ishlatiladi?","Ikki sonning eng katta umumiy bo'luvchisini",["Sonning faktorialini","Sonning kvadrat ildizini","Massivning eng katta elementini"],"Evklid algoritmi qoldiqli bo'lishni takrorlab EKUB ni topadi."],
    [2,"10 ta elementli massivda chiziqli qidiruvda eng ko'pi bilan nechta element tekshiriladi?","10 ta",["1 ta","5 ta","100 ta"],"Eng yomon holda qidirilayotgan element oxirida bo'ladi yoki umuman topilmaydi."],
    [2,"Tanlab saralash usuli qanday ishlaydi?","Eng kichik elementni topib, o'z o'rniga qo'yadi",["Qo'shni elementlarni almashtiradi","Massivni doim ikkiga bo'ladi","Elementlarni tasodifiy joylashtiradi"],"Har qadamda qolgan qismdagi eng kichik element boshiga o'tkaziladi."],
    [2,"for i in range(3): print(i) buyrug'i ekranga qaysi sonlarni chiqaradi?","0, 1, 2",["1, 2, 3","0, 1, 2, 3","1, 2"],"range(3) 0 dan boshlab 3 ta son beradi: 0, 1, 2."],
    [2,"Pythonda range(1, 5) nechta son hosil qiladi?","4 ta",["5 ta","3 ta","6 ta"],"Sonlar 1, 2, 3, 4; oxirgi chegara kiritilmaydi."],
    [2,"Pythonda if sharti yolg'on bo'lsa, qaysi blok bajariladi?","else bloki",["for bloki","print bloki","def bloki"],"else bloki if sharti bajarilmagan holatda ishlaydi."],
    [2,"Algoritm samaradorligi asosan qaysi ikki resurs bilan o'lchanadi?","Vaqt va xotira",["Rang va shrift","Fayl nomi va kengaytma","Ekran o'lchami va yorqinlik"],"Algoritm qancha vaqt va xotira sarflashi uning samaradorligini belgilaydi."],
    [2,"Pseudokod nima?","Algoritmning qat'iy sintaksissiz, dasturga yaqin yozuvi",["Tayyor dastur fayli","Blok-sxema turi","Xatolar ro'yxati"],"Pseudokod algoritm g'oyasini aniq dasturlash tili qoidalarisiz bayon qiladi."],
    [3,"Implikatsiya A → B da A = 0, B = 1 bo'lsa, natija nimaga teng?","1",["0","2","Aniqlanmagan"],"Implikatsiya faqat A = 1 va B = 0 bo'lganda yolg'on bo'ladi."],
    [3,"A → B implikatsiyasi qaysi ifodaga teng?","(EMAS A) YOKI B",["A VA (EMAS B)","(EMAS A) VA B","A YOKI (EMAS B)"],"Implikatsiya faqat A = 1, B = 0 holatida 0 beradi, (EMAS A) YOKI B ham xuddi shunday."],
    [3,"A YOKI (A VA B) ifodasi nimaga teng?","A",["B","A VA B","A YOKI B"],"Yutilish qonuni: A = 1 bo'lsa natija 1, A = 0 bo'lsa A VA B = 0 va natija 0."],
    [3,"(A VA B) YOKI (A VA EMAS B) ifodasi nimaga soddalashadi?","A",["B","A VA B","EMAS A"],"A VA (B YOKI EMAS B) = A VA 1 = A."],
    [3,"A XOR A ifodasi A ning qiymatidan qat'i nazar nimaga teng?","0",["1","A","EMAS A"],"XOR bir xil qiymatlarda 0 beradi."],
    [3,"3 ta mantiqiy o'zgaruvchili ifodaning rostlik jadvalida nechta qator bo'ladi?","8 ta",["3 ta","6 ta","9 ta"],"Qatorlar soni 2³ = 8 ga teng."],
    [3,"Ikkilik qidiruvning vaqt murakkabligi qanday yoziladi?","O(log n)",["O(n)","O(n²)","O(1)"],"Har qadamda qidiruv oralig'i ikki marta qisqaradi."],
    [3,"Chiziqli qidiruvning vaqt murakkabligi qanday yoziladi?","O(n)",["O(log n)","O(1)","O(n²)"],"Eng yomon holda barcha n ta element birma-bir tekshiriladi."],
    [3,"Pufakchali saralashning eng yomon holdagi vaqt murakkabligi qanday?","O(n²)",["O(n)","O(log n)","O(1)"],"Ikki ichma-ich sikl taxminan n · n ta taqqoslash qiladi."],
    [3,"Massivning i-elementiga indeks bo'yicha murojaat qilishning murakkabligi qanday?","O(1)",["O(n)","O(log n)","O(n²)"],"Indeks orqali murojaat massiv uzunligiga bog'liq emas, doimiy vaqt oladi."],
    [3,"Murakkabligi O(n²) bo'lgan algoritmda n ikki baravar oshsa, ish hajmi taxminan necha marta oshadi?","4 marta",["2 marta","8 marta","16 marta"],"(2n)² = 4n², ya'ni ish hajmi 4 baravar oshadi."],
    [3,"Rekursiv usulda faktorial: f(n) = n · f(n − 1), f(1) = 1 bo'lsa, f(4) nimaga teng?","24",["10","16","12"],"f(4) = 4 · 3 · 2 · 1 = 24."],
    [3,"Fibonachchi ketma-ketligi 1, 1, 2, 3, 5 ... ning 10-hadi nimaga teng?","55",["34","89","45"],"Hadlar: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55."],
    [3,"Evklid algoritmi bo'yicha 48 va 18 sonlarining EKUB i nimaga teng?","6",["3","9","12"],"48 mod 18 = 12, 18 mod 12 = 6, 12 mod 6 = 0, demak EKUB = 6."],
    [3,"Berilgan sondan kichik barcha tub sonlarni topish uchun qaysi qadimiy usul ishlatiladi?","Eratosfen g'alviri",["Evklid algoritmi","Pufakchali saralash","Ikkilik qidiruv"],"Eratosfen g'alviri murakkab sonlarni ketma-ket o'chirib, tub sonlarni qoldiradi."],
    [3,"Stek (stack) ma'lumotlar tuzilmasi qaysi tamoyil bo'yicha ishlaydi?","LIFO: oxirgi kirgan birinchi chiqadi",["FIFO: birinchi kirgan birinchi chiqadi","Tasodifiy tartibda","Saralangan tartibda"],"Stekda elementlar faqat yuqori uchidan qo'shiladi va olinadi."],
    [3,"Navbat (queue) ma'lumotlar tuzilmasi qaysi tamoyil bo'yicha ishlaydi?","FIFO: birinchi kirgan birinchi chiqadi",["LIFO: oxirgi kirgan birinchi chiqadi","Tasodifiy tartibda","Saralangan tartibda"],"Navbatda element oxiriga qo'shiladi va boshidan olinadi."],
    [3,"i = 1 bo'lib, while i < 5: i = i * 2 sikli tugaganda i nimaga teng bo'ladi?","8",["4","5","16"],"i ketma-ket 1, 2, 4, 8 bo'ladi; 8 < 5 yolg'on bo'lgani uchun sikl to'xtaydi."],
    [3,"Pythonda 2 ** 5 ifodaning natijasi nimaga teng?","32",["10","25","64"],"** darajaga ko'tarish amali: 2⁵ = 32."],
    [3,"Pufakchali saralash [4, 2, 5, 1] massivga birinchi marta to'liq o'tganda qanday natija beradi?","[2, 4, 1, 5]",["[1, 2, 4, 5]","[2, 4, 5, 1]","[1, 4, 2, 5]"],"4 va 2 almashadi, 4 va 5 almashmaydi, 5 va 1 almashadi."],
    [3,"Python sikli ichida break buyrug'i nima qiladi?","Siklni darhol to'xtatadi",["Keyingi iteratsiyaga o'tadi","Dasturni to'liq tugatadi","Sikl shartini o'zgartiradi"],"break siklni tugatib, undan keyingi buyruqqa o'tkazadi."],
    [3,"Birlashtirib saralash (merge sort) qaysi g'oyaga asoslangan?","Bo'l va hukmronlik qil",["Eng kichikni tanlash","Qo'shnilarni almashtirish","Tasodifiy aralashtirish"],"Massiv yarimlarga bo'linadi, alohida saralanadi va qayta birlashtiriladi."],
    [3,"Pythonda funksiya qaysi kalit so'z bilan e'lon qilinadi?","def",["func","function","fun"],"def so'zi funksiya nomi va parametrlaridan oldin yoziladi."]
  ]);
  var LOG = {
    VA: function (a, b) { return a & b; }, YOKI: function (a, b) { return a | b; }, XOR: function (a, b) { return a ^ b; },
    "→": function (a, b) { return a && !b ? 0 : 1; }, "↔": function (a, b) { return a === b ? 1 : 0; }
  };
  function sg(x) { return x < 0 ? "−" + (-x) : String(x); }
  // i4 uchun qo'shimcha protsedura savollari
  function I4x(k, L) {
    var i, x, y, a, b, n, s, v, w;
    if (k === 10) { var x0 = R(2, lv(L, 12, 20, 30)), val = x0, rv, txt = [], ops = [], nops = lv(L, 2, 3, 3);
      for (i = 0; i < nops; i++) { var o = R(0, 2), d = R(2, 5); if (o === 2 && val > 40) o = 0; if (o === 1 && val - d < 1) o = 0;
        txt.push(o === 0 ? d + " qo'shiladi" : o === 1 ? d + " ayiriladi" : d + " ga ko'paytiriladi"); ops.push([o, d]); val = o === 0 ? val + d : o === 1 ? val - d : val * d; }
      rv = x0; for (i = ops.length - 1; i >= 0; i--) rv = ops[i][0] === 0 ? rv + ops[i][1] : ops[i][0] === 1 ? rv - ops[i][1] : rv * ops[i][1];
      var skip = x0; for (i = 0; i < ops.length - 1; i++) skip = ops[i][0] === 0 ? skip + ops[i][1] : ops[i][0] === 1 ? skip - ops[i][1] : skip * ops[i][1];
      return NQ("Algoritm: kiritilgan songa ketma-ket " + txt.join(", ") + ". <b>" + x0 + "</b> kiritilsa, natija nechaga teng?", val, "", [rv, skip, val + 1, val - 1, val + 2], [x0 + " dan boshlab amallarni tartib bilan bajaramiz.", "Natija: " + val], true); }
    if (k === 11) { var th = R(5, 20), d1 = R(2, 9), d2 = R(2, 9), cond = pick([">", "≥", "<", "≤"]);
      x = Math.random() < 0.3 ? th : R(Math.max(1, th - 6), th + 6);
      var ok = cond === ">" ? x > th : cond === "≥" ? x >= th : cond === "<" ? x < th : x <= th;
      y = ok ? x - d1 : x + d2;
      return NQ("Agar <b>x " + cond + " " + th + "</b> bo'lsa, y = x − " + d1 + ", aks holda y = x + " + d2 + ". x = " + x + " bo'lsa, y nechaga teng?", y, "", [ok ? x + d2 : x - d1, x, y + 1, y - 1, y + 2, y - 2, th], [x + " " + cond + " " + th + " — " + (ok ? "rost" : "yolg'on") + " ⇒ " + (ok ? "y = " + x + " − " + d1 : "y = " + x + " + " + d2) + " = " + sg(y)], true); }
    if (k === 12) { var px = R(0, 5), py = R(0, 5), dirs = [["o'ngga", 1, 0], ["chapga", -1, 0], ["yuqoriga", 0, 1], ["pastga", 0, -1]], cm = [], dx = 0, dy = 0;
      var nc = lv(L, 2, 3, 3);
      for (i = 0; i < nc; i++) { var di = i === 0 ? R(0, 1) : i === 1 ? R(2, 3) : R(0, 3), st = R(1, 5); cm.push(st + " qadam " + dirs[di][0]); dx += dirs[di][1] * st; dy += dirs[di][2] * st; }
      var P = function (p, q) { return "(" + sg(p) + "; " + sg(q) + ")"; };
      return TQ("Ijrochi " + P(px, py) + " nuqtada turibdi. Buyruqlar: " + cm.join(", ") + ". Ijrochi qaysi nuqtaga keladi?", P(px + dx, py + dy),
        otherN([P(py + dy, px + dx), P(px - dx, py + dy), P(px + dx, py - dy), P(px + dx + 1, py + dy), P(dx, dy)], [P(px + dx, py + dy)], 4), ["x: " + px + (dx < 0 ? " − " + (-dx) : " + " + dx) + " = " + sg(px + dx) + ", y: " + py + (dy < 0 ? " − " + (-dy) : " + " + dy) + " = " + sg(py + dy)]); }
    if (k === 13) { var CMP = [">", "<", "=", "≥", "≤", "≠"], f = function (p, c, q) { return c === ">" ? p > q : c === "<" ? p < q : c === "=" ? p === q : c === "≥" ? p >= q : c === "≤" ? p <= q : p !== q; };
      var RV = ["Rost (1)", "Yolg'on (0)"];
      if (L === 1) { a = R(1, 30); b = Math.random() < 0.25 ? a : R(1, 30); var c1 = pick(CMP); v = f(a, c1, b);
        return TQ("<b>" + a + " " + c1 + " " + b + "</b> mulohazasining qiymati qanday?", RV[v ? 0 : 1], [RV[v ? 1 : 0], "Aniqlab bo'lmaydi", "Bu mulohaza emas"], [a + " " + c1 + " " + b + " — " + (v ? "rost." : "yolg'on.")]); }
      x = R(1, 20); a = R(1, 15); b = a + R(2, 10); var lo = x > a, hi = x < b, opv = pick(["VA", "YOKI"]); v = opv === "VA" ? lo && hi : lo || hi;
      return TQ("x = " + x + " bo'lsa, <b>(x > " + a + ") " + opv + " (x < " + b + ")</b> mulohazasining qiymati qanday?", RV[v ? 0 : 1], [RV[v ? 1 : 0], "Aniqlab bo'lmaydi", "Bu mulohaza emas"],
        [x + " > " + a + " — " + (lo ? "1" : "0") + ", " + x + " < " + b + " — " + (hi ? "1" : "0"), (lo ? 1 : 0) + " " + opv + " " + (hi ? 1 : 0) + " = " + (v ? 1 : 0)]); }
    if (k === 14) { if (Math.random() < 0.5) { n = R(1, lv(L, 3, 5, 6)); v = Math.pow(2, n);
        return NQ("<b>" + n + "</b> ta mantiqiy o'zgaruvchili ifodaning rostlik jadvalida nechta satr (qiymatlar to'plami) bo'ladi?", v, "", [n * 2, v * 2, n, n * n + 1], ["Satrlar soni = 2<sup>" + n + "</sup> = " + v]); }
      var T = [["A VA B", 1, 4], ["A YOKI B", 3, 4], ["A XOR B", 2, 4], ["EMAS A", 1, 2], ["A VA B VA C", 1, 8], ["A YOKI B YOKI C", 7, 8], ["(A VA B) YOKI C", 5, 8]];
      var t = pick(T);
      return NQ("<b>" + t[0] + "</b> ifodasining rostlik jadvalida natija necha marta <b>1</b> ga teng bo'ladi?", t[1], "", [t[2] - t[1], t[1] + 1, t[2], t[1] + 2], ["Jadvalda " + t[2] + " ta satr bor; natija " + t[1] + " ta satrda 1 ga teng."]); }
    if (k === 15) { a = R(0, 10); s = L === 3 && Math.random() < 0.6 ? R(2, 4) : 1; b = a + s * R(3, 12) + (s > 1 ? R(0, s - 1) : 0); n = Math.floor((b - a) / s) + 1;
      return NQ("Sikl: i = " + a + " dan " + b + " gacha" + (s > 1 ? ", qadam " + s : "") + " (" + b + " ham kiradi). Sikl tanasi necha marta bajariladi?", n, "", [n - 1, n + 1, b - a, Math.floor(b / s), n + 2, b - a + 2], [s > 1 ? "(" + b + " − " + a + ") : " + s + " ning butun qismi + 1 = " + n : b + " − " + a + " + 1 = " + n]); }
    if (k === 16) { var arr = []; n = R(5, 7); for (i = 0; i < n; i++) arr.push(R(1, 20)); var t2 = R(0, 3), ans;
      var mx = Math.max.apply(null, arr), mn = Math.min.apply(null, arr), ev = arr.filter(function (z) { return z % 2 === 0; }).length, sm = 0; arr.forEach(function (z) { sm += z; });
      var lst = arr.join(", ");
      if (t2 === 0) return NQ("Ro'yxat: " + lst + ". Algoritm: m = birinchi element; har bir a uchun: agar a > m bo'lsa, m = a. Oxirida m nechaga teng?", mx, "", [mn, arr[0], arr[n - 1], mx - 1], ["Algoritm eng katta elementni topadi: " + mx]);
      if (t2 === 1) return NQ("Ro'yxat: " + lst + ". Algoritm: m = birinchi element; har bir a uchun: agar a < m bo'lsa, m = a. Oxirida m nechaga teng?", mn, "", [mx, arr[0], arr[n - 1], mn + 1], ["Algoritm eng kichik elementni topadi: " + mn]);
      if (t2 === 2) return NQ("Ro'yxat: " + lst + ". Algoritm: k = 0; har bir a uchun: agar a juft bo'lsa, k = k + 1. Oxirida k nechaga teng?", ev, "", [n - ev === ev ? ev + 1 : n - ev, n, ev + 1, ev === 0 ? 2 : ev - 1], ["Juft elementlar soni: " + ev]);
      return NQ("Ro'yxat: " + lst + ". Algoritm: s = 0; har bir a uchun: s = s + a. Oxirida s nechaga teng?", sm, "", [sm - arr[0], sm + arr[n - 1], mx * n, sm + 1], [arr.join(" + ") + " = " + sm]); }
    // pufakchali saralashning birinchi o'tishi
    var A = []; while (A.length < 5) { x = R(1, 20); if (A.indexOf(x) < 0) A.push(x); }
    var B = A.slice(); for (i = 0; i < B.length - 1; i++) if (B[i] > B[i + 1]) { y = B[i]; B[i] = B[i + 1]; B[i + 1] = y; }
    var srt = A.slice().sort(function (p, q) { return p - q; }), J = function (z) { return z.join(", "); };
    if (J(B) === J(A) || J(B) === J(srt)) { A = [9, 4, 12, 2, 7]; B = [4, 9, 2, 7, 12]; srt = [2, 4, 7, 9, 12]; }
    w = [J(srt), J(A), J(A.slice().reverse()), J([B[0]].concat(B.slice(1).reverse()))];
    return TQ("Ro'yxat: " + J(A) + ". Pufakchali saralash (o'sish tartibida) <b>birinchi o'tishdan</b> keyin ro'yxat qanday bo'ladi?", J(B), otherN(w, [J(B)], 4),
      ["Qo'shni elementlar taqqoslanadi, kattasi o'ngga suriladi.", "1-o'tishdan keyin eng katta element oxirga chiqadi: " + J(B)]);
  }

  function I4(L) {
    var k = pick(lv(L, [0, 1, 2, 7, 10, 11, 12, 13, 9, 9], [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 15, 16, 9, 9], [0, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 9, 9])), a, b, c, op, v, s, n, i;
    if (k >= 10) return I4x(k, L);
    if (k === 0) { a = R(0, 1); b = R(0, 1); op = pick(L === 1 ? ["VA", "YOKI"] : L === 2 ? ["VA", "YOKI", "XOR"] : ["VA", "YOKI", "XOR", "→", "↔"]); v = LOG[op](a, b);
      return TQ("<b>" + a + " " + op + " " + b + "</b> = ?", String(v), [String(1 - v), "2", "Aniqlab bo'lmaydi"], [{ VA: "VA: faqat ikkalasi 1 bo'lsa 1.", YOKI: "YOKI: kamida bittasi 1 bo'lsa 1.", XOR: "XOR: qiymatlar turlicha bo'lsa 1.", "→": "Implikatsiya: faqat 1 → 0 holida 0.", "↔": "Ekvivalentlik: qiymatlar teng bo'lsa 1." }[op]]); }
    if (k === 1) { a = R(0, 1); b = R(0, 1); op = pick(["VA", "YOKI"]); v = 1 - LOG[op](a, b);
      return TQ("<b>EMAS (" + a + " " + op + " " + b + ")</b> = ?", String(v), [String(1 - v), "2", "Aniqlab bo'lmaydi"], [a + " " + op + " " + b + " = " + (1 - v) + ", EMAS " + (1 - v) + " = " + v]); }
    if (k === 2) { n = R(3, lv(L, 8, 10, 12)); s = n * (n + 1) / 2;
      return NQ("Algoritm: s = 0; i = 1 dan " + n + " gacha: s = s + i. Oxirida s nechaga teng?", s, "", [s - n, s + n + 1, n * n, n], ["s = 1 + 2 + ... + " + n + " = " + s]); }
    if (k === 3) { a = R(0, 1); b = R(0, 1); c = R(0, 1); var o1 = pick(["VA", "YOKI"]), o2 = pick(["VA", "YOKI"]);
      v = LOG[o2](LOG[o1](a, b), c);
      return TQ("<b>(" + a + " " + o1 + " " + b + ") " + o2 + " " + c + "</b> = ?", String(v), [String(1 - v), "2", "Aniqlab bo'lmaydi"], ["Qavs ichi: " + a + " " + o1 + " " + b + " = " + LOG[o1](a, b), LOG[o1](a, b) + " " + o2 + " " + c + " = " + v]); }
    if (k === 4) { n = R(2, 6); var m = R(2, 5); s = 1; for (i = 0; i < n; i++) s *= m;
      if (s > 5000) { n = 3; s = m * m * m; }
      return NQ("Algoritm: p = 1; " + n + " marta takrorla: p = p · " + m + ". Oxirida p nechaga teng?", s, "", [m * n, s * m, s / m, m + n], ["p = " + m + "<sup>" + n + "</sup> = " + s]); }
    if (k === 5) { a = R(0, 1); b = R(0, 1); c = R(0, 1);
      v = (1 - a) & (b | c);
      return TQ("A = " + a + ", B = " + b + ", C = " + c + ". <b>(EMAS A) VA (B YOKI C)</b> = ?", String(v), [String(1 - v), "2", "Aniqlab bo'lmaydi"], ["EMAS A = " + (1 - a) + ", B YOKI C = " + (b | c), (1 - a) + " VA " + (b | c) + " = " + v]); }
    if (k === 6) { n = R(10, 99); var cnt = 0, x = n; while (x > 0) { cnt += x % 10; x = Math.floor(x / 10); }
      var tn = R(0, 1);
      if (tn) { var steps = 0; x = n; while (x > 1) { x = Math.floor(x / 2); steps++; }
        return NQ("Algoritm: x = " + n + "; k = 0; x > 1 ekan: x = x // 2; k = k + 1. Oxirida k nechaga teng?", steps, "", [steps + 1, steps - 1, Math.floor(n / 2), steps * 2], ["x qiymatlari: " + (function () { var r = [n], y = n; while (y > 1) { y = Math.floor(y / 2); r.push(y); } return r.join(" → "); })(), "k = " + steps]); }
      return NQ("Algoritm: n = " + n + "; s = 0; n > 0 ekan: s = s + n % 10; n = n // 10. Oxirida s nechaga teng?", cnt, "", [cnt + 1, n % 10, Math.floor(n / 10), cnt * 2], ["Raqamlar yig'indisi: " + String(n).split("").join(" + ") + " = " + cnt]); }
    if (k === 9) return BK_I4(L);
    n = R(4, 10); var a0 = R(1, 5), d = R(2, 5);
    return NQ("Algoritm: x = " + a0 + "; " + n + " marta takrorla: x = x + " + d + ". Oxirida x nechaga teng?", a0 + n * d, "", [a0 + (n - 1) * d, n * d, a0 + (n + 1) * d, a0 * d * n], ["x = " + a0 + " + " + n + " · " + d + " = " + (a0 + n * d)]);
  }
  S.register("i4", I4, "Informatika · Mantiqiy amallar va algoritmlar");

  /* ================= i5 Robototexnika asoslari ================= */
  var BK_I5 = bank([
    [1, "Robotga masofani o'lchash uchun qaysi sensor ishlatiladi?", "Ultratovushli masofa sensori", ["Harorat sensori", "Namlik sensori", "Mikrofon"], "Masalan, HC-SR04: tovush qaytish vaqti bo'yicha masofani o'lchaydi."],
    [1, "Robotning \"miyasi\" — dasturni bajaruvchi qurilma nima deyiladi?", "Kontroller (mikrokontroller)", ["Motor", "Batareya", "G'ildirak"], "Masalan, Arduino platasi."],
    [1, "Robot g'ildiraklarini aylantiruvchi qurilma qaysi?", "Elektr motor", ["Sensor", "Rezistor", "Svetodiod"], "Motor elektr energiyasini harakatga aylantiradi."],
    [1, "Robotga energiya beruvchi qism qaysi?", "Batareya (akkumulyator)", ["Sensor", "Kontroller", "Kabel"], "Batareya — elektr manbai."],
    [1, "Yorug'lik darajasini aniqlovchi sensor qaysi?", "Fotorezistor (yorug'lik sensori)", ["Termistor", "Servo motor", "Ultratovush sensori"], "Fotorezistor qarshiligi yorug'likka qarab o'zgaradi."],
    [1, "Haroratni o'lchovchi sensor qaysi?", "Harorat sensori (masalan, DHT11)", ["Ultratovush sensori", "Fotorezistor", "Tugma"], "DHT11 harorat va namlikni o'lchaydi."],
    [1, "Robot qurilmalari bilan ishlashda qaysi qoida to'g'ri?", "Ulashni tok o'chiq holda bajarish", ["Simlarni ho'l qo'l bilan ulash", "Batareyani qisqa tutashtirish", "Motorni qo'l bilan to'xtatish"], "Xavfsizlik: avval quvvatni o'chirish."],
    [1, "Qora chiziq bo'ylab yuruvchi robot qaysi sensordan foydalanadi?", "Infraqizil (IR) chiziq sensori", ["Mikrofon", "Harorat sensori", "GPS"], "IR sensor qora va oq sirtni farqlaydi."],
    [1, "Svetodiod (LED) qanday energiya chiqaradi?", "Yorug'lik", ["Tovush", "Harakat", "Magnit maydon"], "LED — yorug'lik chiqaruvchi diod."],
    [2, "Arduino'da dastur ishga tushganda bir marta bajariladigan funksiya qaysi?", "setup()", ["loop()", "main()", "start()"], "setup() — sozlash, bir marta."],
    [2, "Arduino'da to'xtovsiz qayta-qayta bajariladigan funksiya qaysi?", "loop()", ["setup()", "repeat()", "while()"], "loop() cheksiz takrorlanadi."],
    [2, "Arduino'da pin rejimini (kirish/chiqish) belgilovchi funksiya qaysi?", "pinMode()", ["digitalWrite()", "analogRead()", "delay()"], "pinMode(13, OUTPUT);"],
    [2, "Arduino'da raqamli pinga HIGH yoki LOW yozuvchi funksiya qaysi?", "digitalWrite()", ["digitalRead()", "analogRead()", "pinMode()"], "digitalWrite(13, HIGH); — LED yonadi."],
    [2, "Arduino'da kutish (pauza) funksiyasi qaysi?", "delay()", ["wait()", "sleep()", "pause()"], "delay(1000) — 1 sekund kutish."],
    [2, "delay(500) qancha vaqt kutadi?", "0.5 sekund", ["500 sekund", "5 sekund", "50 sekund"], "delay millisekundlarda: 500 ms = 0.5 s."],
    [2, "Arduino Uno'da analogRead() qanday oraliqda qiymat qaytaradi?", "0 dan 1023 gacha", ["0 dan 255 gacha", "0 dan 100 gacha", "0 dan 5 gacha"], "10 bitli ADC: 2¹⁰ = 1024 qiymat."],
    [2, "Arduino'da analogWrite() (PWM) qanday oraliqda qiymat oladi?", "0 dan 255 gacha", ["0 dan 1023 gacha", "0 dan 100 gacha", "0 dan 1 gacha"], "8 bitli PWM: 2⁸ = 256 qiymat."],
    [2, "LED ni Arduino'ga ulashda rezistor nima uchun kerak?", "Tok kuchini cheklash uchun", ["Kuchlanishni oshirish uchun", "Yorug'likni kuchaytirish uchun", "Rangni o'zgartirish uchun"], "Rezistorsiz LED kuyishi mumkin."],
    [3, "Burchakni aniq (masalan, 0° dan 180° gacha) boshqarish mumkin bo'lgan motor qaysi?", "Servo motor", ["Oddiy DC motor", "Ventilyator", "Generator"], "Servo — burchak bo'yicha boshqariladi."],
    [3, "Har bir impulsda aniq qadamga buriladigan motor qanday ataladi?", "Qadamli (step) motor", ["Servo motor", "DC motor", "Turbina"], "Step motor 3D printer va CNC larda ishlatiladi."],
    [3, "DC motor aylanish yo'nalishini o'zgartirish uchun nima qilinadi?", "Qutblarini almashtiriladi", ["Kuchlanish oshiriladi", "Rezistor qo'shiladi", "Sensor ulanadi"], "Motor drayveri (H-ko'prik) qutblarni almashtiradi."],
    [3, "Arduino'da motorlarni boshqarishda ishlatiladigan maxsus plata qanday ataladi?", "Motor drayveri (masalan, L298N)", ["Sensor moduli", "Wi-Fi moduli", "Displey"], "Arduino pini motorga yetarli tok bera olmaydi."],
    [3, "PWM (ShIM) yordamida LED bilan nima qilish mumkin?", "Yorqinligini o'zgartirish", ["Rangini o'zgartirish (oddiy LED)", "Kuchlanishni oshirish", "Qarshilikni o'lchash"], "To'ldirish koeffitsienti o'zgaradi."],
    [3, "analogWrite(9, 127) taxminan necha foiz to'ldirish koeffitsientini beradi?", "≈ 50%", ["≈ 12.7%", "≈ 100%", "≈ 25%"], "127 / 255 ≈ 0.5."],
    [3, "Ultratovush sensori masofani qanday aniqlaydi?", "Tovush qaytish vaqti bo'yicha", ["Yorug'lik rangi bo'yicha", "Harorat bo'yicha", "Magnit maydon bo'yicha"], "s = v·t/2 (tovush borib-qaytadi)."],
    [3, "Arduino'da tugma holatini o'qish uchun qaysi funksiya ishlatiladi?", "digitalRead()", ["analogWrite()", "digitalWrite()", "Serial.print()"], "HIGH yoki LOW qaytaradi."],
    [3, "Arduino'dan kompyuterga ma'lumot yuborish uchun nima ishlatiladi?", "Serial.print()", ["digitalWrite()", "pinMode()", "delay()"], "Serial port monitorida ko'rinadi."],
    [1, "Robotning atrof-muhit haqida ma'lumot oluvchi qismi nima deyiladi?", "Sensor (datchik)", ["Motor", "Batareya", "G'ildirak"], "Sensorlar yorug'lik, masofa, harorat va boshqalarni sezadi."],
    [1, "Elektr tokini yaxshi o'tkazadigan material qaysi?", "Mis", ["Rezina", "Plastmassa", "Shisha"], "Simlar ichi misdan, usti esa izolyatsiyadan iborat."],
    [1, "Elektr tokini o'tkazmaydigan material (izolyator) qaysi?", "Rezina", ["Mis", "Alyuminiy", "Temir"], "Rezina va plastmassa simlarni izolyatsiyalash uchun ishlatiladi."],
    [1, "Elektr sxemalarida odatda qaysi rangli sim musbat (+) qutb uchun ishlatiladi?", "Qizil", ["Qora", "Ko'k", "Yashil"], "Qora sim odatda manfiy (−, GND) uchun ishlatiladi."],
    [1, "Robot changyutgich to'siqqa urilganini qaysi sensor orqali biladi?", "Tegish (bamper) sensori", ["Harorat sensori", "Mikrofon", "Yorug'lik sensori"], "Bamper bosilganda kontakt ulanadi."],
    [1, "Mikrofon qanday sensor hisoblanadi?", "Tovush sensori", ["Yorug'lik sensori", "Harorat sensori", "Masofa sensori"], "Mikrofon tovush to'lqinlarini elektr signaliga aylantiradi."],
    [1, "Telefon ekrani yorqinligini avtomatik o'zgartirishda qaysi sensor ishlaydi?", "Yorug'lik sensori", ["Harorat sensori", "Tovush sensori", "Namlik sensori"], "Atrof yorug' bo'lsa, ekran yorqinroq bo'ladi."],
    [1, "Rezistorning qarshiligi qanday birlikda o'lchanadi?", "Om", ["Volt", "Amper", "Vatt"], "Qarshilik birligi Georg Om sharafiga nomlangan."],
    [1, "\"Robot\" so'zi qaysi tildan kelib chiqqan?", "Chex tilidan", ["Ingliz tilidan", "Nemis tilidan", "Yapon tilidan"], "Bu so'zni 1920-yilda yozuvchi Karel Chapek qo'llagan."],
    [2, "Svetodiodning (LED) uzun oyog'i qaysi qutb hisoblanadi?", "Musbat (anod)", ["Manfiy (katod)", "Yerga ulanadi (GND)", "Farqi yo'q"], "Qisqa oyog'i — manfiy (katod)."],
    [2, "Arduino Uno platasidagi o'rnatilgan LED odatda qaysi pinga ulangan?", "13-pin", ["0-pin", "5-pin", "A0 pin"], "Shuning uchun Blink misolida 13-pin ishlatiladi."],
    [2, "Arduino Uno qanday kuchlanishda ishlaydi?", "5 V", ["12 V", "220 V", "1.5 V"], "Platada 3.3 V chiqishi ham bor."],
    [2, "Arduino dasturlari (sketchlar) qaysi dasturlash tiliga asoslangan?", "C/C++", ["Python", "HTML", "Scratch"], "Arduino IDE'da C/C++ asosidagi til ishlatiladi."],
    [2, "Arduino kodida har bir buyruq oxiriga qaysi belgi qo'yiladi?", ";", [":", ".", ","], "Masalan: delay(1000);"],
    [2, "Arduino kodida bir qatorli izoh qanday boshlanadi?", "//", ["#", "--", "**"], "// dan keyingi matn bajarilmaydi."],
    [2, "Ketma-ket ulangan rezistorlarning umumiy qarshiligi nimaga teng?", "Qarshiliklar yig'indisiga", ["Eng kichik qarshilikka", "Qarshiliklar ko'paytmasiga", "Nolga"], "R = R₁ + R₂ + ..."],
    [2, "Om qonuni formulasi qaysi?", "I = U / R", ["I = U · R", "U = I / R", "R = U · I"], "Tok kuchi kuchlanishga to'g'ri, qarshilikka teskari proporsional."],
    [2, "Maket plata (breadboard) nima uchun ishlatiladi?", "Kavsharlamasdan sxema yig'ish uchun", ["Dastur yozish uchun", "Batareyani zaryadlash uchun", "Kuchlanishni oshirish uchun"], "Qismlar teshiklarga tiqib ulanadi."],
    [2, "GND belgisi nimani bildiradi?", "Umumiy sim (yer, manfiy)", ["Musbat qutb", "Analog kirish", "Raqamli chiqish"], "Barcha qismlarning GND simlari birlashtiriladi."],
    [3, "Arduino Uno qaysi mikrokontrollerga asoslangan?", "ATmega328P", ["ESP32", "Intel Core i5", "ARM Cortex-A72"], "ATmega328P — 8 bitli AVR mikrokontroller."],
    [3, "Arduino Uno'da nechta raqamli kirish/chiqish pini bor?", "14 ta", ["6 ta", "20 ta", "8 ta"], "D0–D13 pinlari; ulardan 6 tasi PWM."],
    [3, "Arduino Uno'da nechta analog kirish pini bor?", "6 ta", ["14 ta", "4 ta", "8 ta"], "A0–A5 pinlari."],
    [3, "Arduino sketch faylining kengaytmasi qaysi?", ".ino", [".exe", ".py", ".txt"], "Masalan, blink.ino."],
    [3, "Serial.begin(9600) dagi 9600 nimani bildiradi?", "Ma'lumot uzatish tezligini", ["Pin raqamini", "Kutish vaqtini", "Kuchlanishni"], "Tezlik bod (bit/s) da beriladi."],
    [3, "HC-SR04 ultratovush sensorining qaysi pini tovush signalini yuboradi?", "Trig", ["Echo", "VCC", "GND"], "Echo pini qaytgan signalni qabul qiladi."],
    [3, "Servo motorni boshqarish uchun Arduino'da qaysi kutubxona ulanadi?", "Servo.h", ["Wire.h", "SPI.h", "Motor.h"], "#include <Servo.h>"],
    [3, "PIR sensori nimani aniqlaydi?", "Harakatni", ["Masofani", "Namlikni", "Bosimni"], "Odam yoki hayvon tanasining issiqlik nurlanishini sezadi."],
    [3, "Bir xil rezistorlar parallel ulansa, umumiy qarshilik qanday bo'ladi?", "Bitta rezistornikidan kichik", ["Bitta rezistornikidan katta", "Yig'indisiga teng", "Nolga teng"], "Masalan, ikkita 100 Om parallel — 50 Om."],
    [1,"Robotning bajaradigan buyruqlari ketma-ketligi yozilgan qism nima deyiladi?","Dastur",["Batareya","Sensor","Motor"],"Dastur robotga qaysi amalni qanday tartibda bajarishni aytadi."],
    [1,"Robotning harakatlantiruvchi qismlari (motor, servo) umumiy nomi bilan qanday ataladi?","Aktuatorlar",["Sensorlar","Rezistorlar","Kondensatorlar"],"Aktuator kontroller signalini mexanik harakatga aylantiradi."],
    [1,"Tashqi ko'rinishi odamga o'xshash robot qanday ataladi?","Gumanoid robot",["Dron","Manipulyator","Marsoxod"],"Gumanoid robotlarning boshi, tanasi, qo'llari va oyoqlari bo'ladi."],
    [1,"Havoda uchadigan va masofadan boshqariladigan uchuvchisiz apparat nima deyiladi?","Dron",["Rover","Manipulyator","Plotter"],"Dron odatda bir nechta parrak yordamida havoga ko'tariladi."],
    [1,"Zavodlarda payvandlash va detallarni yig'ish ishini bajaradigan mexanik «qo'l» nima deyiladi?","Robot-manipulyator",["Dron","Plotter","Skaner"],"Robot-manipulyator bo'g'inlari yordamida odam qo'liga o'xshab harakatlanadi."],
    [1,"Elektr zanjirini ochib-yopish uchun ishlatiladigan qurilma qaysi?","Kalit",["Rezistor","Diod","Batareya"],"Kalit zanjirni uzsa tok to'xtaydi, ulasa tok oqadi."],
    [1,"Elektr kuchlanishi qanday birlikda o'lchanadi?","Volt",["Amper","Om","Vatt"],"Kuchlanish birligi italiyalik olim Volta sharafiga volt deb ataladi."],
    [1,"Tok kuchi qanday birlikda o'lchanadi?","Amper",["Volt","Om","Joul"],"Tok kuchining birligi amper bo'lib, A harfi bilan belgilanadi."],
    [1,"Arduino platalari dastlab qaysi mamlakatda yaratilgan?","Italiyada",["Yaponiyada","Germaniyada","Braziliyada"],"Arduino loyihasi 2005-yilda Italiyaning Ivrea shahrida boshlangan."],
    [1,"Muayyan masalani yechish uchun aniq ketma-ket bajariladigan buyruqlar to'plami nima deyiladi?","Algoritm",["Sensor","Kontakt","Signal"],"Robot dasturi algoritmga asoslanib tuziladi."],
    [1,"Robotga ko'rish imkonini beradigan qurilma qaysi?","Kamera",["Zummer","Batareya","Reduktor"],"Kamera tasvirni oladi, kontroller esa uni tahlil qiladi."],
    [1,"Arduino'ga ulanib, tovush signali chiqaradigan qurilma qaysi?","Zummer (buzzer)",["Fotorezistor","Servo motor","Potensiometr"],"Zummer kuchlanish berilganda tovush chiqaradi."],
    [1,"Uyni tozalaydigan robot changyutgich qaysi robotlar turiga kiradi?","Maishiy robotlar",["Harbiy robotlar","Kosmik robotlar","Sanoat manipulyatorlari"],"Maishiy robotlar kundalik uy ishlarida odamga yordam beradi."],
    [1,"Elektr toki oqishi uchun zanjir qanday bo'lishi kerak?","Yopiq",["Ochiq","Uzilgan","Bir uchi bo'sh"],"Zanjir uzilsa, zaryadlar harakati to'xtaydi va tok o'tmaydi."],
    [1,"Boshqa sayyoralar yuzasida yurib, uni o'rganadigan robot-mashina qanday ataladi?","Rover (planetoxod)",["Dron","Manipulyator","Gumanoid"],"Marsni o'rganuvchi robotlar rover deb ataladi."],
    [2,"Arduino'da butun sonli o'zgaruvchi e'lon qilish uchun qaysi tur ishlatiladi?","int",["float","String","void"],"int turi butun sonlarni saqlaydi, float esa kasr sonlarni."],
    [2,"Serial.println() funksiyasi Serial.print() dan nimasi bilan farq qiladi?","Oxirida yangi qatorga o'tadi",["Ma'lumotni tezroq yuboradi","Faqat sonlarni yuboradi","Ma'lumotni kompyuterga yubormaydi"],"println() chiqarilgan matndan keyin yangi qatorga o'tadi."],
    [2,"Arduino Uno'da PWM chiqishini qo'llaydigan pinlar yonida qanday belgi bo'ladi?","Tilda (~)",["Yulduzcha (*)","Plyus (+)","Nuqta (.)"],"3, 5, 6, 9, 10 va 11-pinlar yonida ~ belgisi bor."],
    [2,"Arduino Uno'da kompyuter bilan Serial aloqa uchun ishlatiladigan pinlar qaysilar?","0 va 1",["2 va 3","12 va 13","A0 va A1"],"0-pin RX (qabul), 1-pin TX (uzatish) vazifasini bajaradi."],
    [2,"Arduino Uno platasining kvars generatori chastotasi qancha?","16 MHz",["4 MHz","8 MHz","32 MHz"],"Arduino Uno 16 MHz chastotada ishlaydi."],
    [2,"Arduino'da ikki qiymat tengligini tekshirish uchun qaysi operator ishlatiladi?","==",["=","=>","!"],"Bitta = qiymat berish uchun, ikkita == solishtirish uchun ishlatiladi."],
    [2,"pinMode(2, INPUT_PULLUP) buyrug'i nima qiladi?","Ichki tortuvchi rezistorni yoqadi",["Pinni chiqishga aylantiradi","Pinni o'chirib qo'yadi","Pinga PWM signal beradi"],"INPUT_PULLUP rejimida pin ichki rezistor orqali 5 V ga ulanadi."],
    [2,"Fotorezistorga tushayotgan yorug'lik kuchaysa, uning qarshiligi qanday o'zgaradi?","Kamayadi",["Oshadi","O'zgarmaydi","Nolga teng bo'ladi"],"Yorug'lik tushganda fotorezistorning qarshiligi pasayadi."],
    [2,"Diod elektr tokini qanday o'tkazadi?","Faqat bir yo'nalishda",["Ikkala yo'nalishda teng","Faqat o'zgaruvchan tokni","Hech qachon o'tkazmaydi"],"Diod tokni to'g'ri ulanganda o'tkazadi, teskari ulanganda to'sadi."],
    [2,"Elektr zaryadini to'plash va keyin chiqarib berish uchun mo'ljallangan element qaysi?","Kondensator",["Rezistor","Diod","Tranzistor"],"Kondensator ikki o'tkazgich plastinka orasida zaryad saqlaydi."],
    [2,"Tranzistor elektron sxemalarda qanday vazifani bajaradi?","Signalni kuchaytiradi yoki kalit bo'lib ishlaydi",["Faqat tokni o'lchaydi","Faqat yorug'lik chiqaradi","Faqat zaryad saqlaydi"],"Kichik tok katta tokni boshqarishi mumkin, shuning uchun tranzistor kalit sifatida ishlatiladi."],
    [2,"Oddiy mikroservo motorda odatda nechta sim bo'ladi?","3 ta",["2 ta","4 ta","6 ta"],"Uchta sim: signal, +5 V va GND."],
    [2,"5 V kuchlanishga ulangan 100 Ω rezistordan qancha tok o'tadi?","50 mA",["5 mA","20 mA","500 mA"],"I = U / R = 5 / 100 = 0,05 A = 50 mA."],
    [2,"5 V manbaga 2 V kuchlanishli LED ulansa, tok 20 mA bo'lishi uchun qancha qarshilikli rezistor kerak?","150 Ω",["100 Ω","250 Ω","330 Ω"],"R = (5 − 2) / 0,02 = 150 Ω."],
    [2,"Akselerometr sensori nimani o'lchaydi?","Tezlanishni",["Haroratni","Namlikni","Yorug'likni"],"Akselerometr harakat tezligining o'zgarishini, ya'ni tezlanishni o'lchaydi."],
    [3,"Analog-raqamli o'zgartirgich (ADC) qanday vazifani bajaradi?","Analog signalni raqamli kodga aylantiradi",["Raqamli kodni tovushga aylantiradi","Kuchlanishni oshiradi","Tokni o'zgaruvchan tokka aylantiradi"],"Kontroller faqat raqamli qiymat bilan ishlaydi, shuning uchun sensor signali ADC orqali raqamga aylanadi."],
    [3,"I2C interfeysida ma'lumot almashish uchun qaysi ikki signal liniyasi ishlatiladi?","SDA va SCL",["MOSI va MISO","TX va RX","SS va SCK"],"SDA ma'lumot liniyasi, SCL esa sinxronlash (soat) liniyasidir."],
    [3,"UART orqali ikki qurilmani ulashda birinchi qurilmaning TX pini qaysi pinga ulanadi?","Ikkinchisining RX piniga",["Ikkinchisining TX piniga","Ikkinchisining GND piniga","Birinchisining RX piniga"],"Uzatuvchi (TX) pin qabul qiluvchi (RX) pinga ulanadi."],
    [3,"Tovush tezligi taxminan 340 m/s. Ultratovush signali borib-qaytishga 0,01 s sarflasa, to'siqgacha masofa qancha?","1,7 m",["0,85 m","3,4 m","17 m"],"Signal ikki marta yo'l bosadi: s = 340 · 0,01 / 2 = 1,7 m."],
    [3,"PID boshqaruvchidagi «D» harfi qaysi tashkil etuvchini bildiradi?","Hosilaviy (differensial)",["Davomiy","Diskret","Dasturiy"],"PID — proporsional, integral va differensial tashkil etuvchilar."],
    [3,"Enkoder robotda nimani o'lchaydi?","Valning burilish burchagi va aylanish tezligini",["Havo namligini","Atrofdagi yorug'likni","Batareya zaryadini"],"Enkoder g'ildirak yoki val aylanishini impulslarga aylantirib sanaydi."],
    [3,"Giroskop sensori nimani o'lchaydi?","Burchak tezligini",["Havo bosimini","Magnit maydonini","Haroratni"],"Giroskop jismning o'q atrofida aylanish tezligini o'lchaydi."],
    [3,"Manipulyatorning «erkinlik darajasi» nimani bildiradi?","Mustaqil harakat qila oladigan o'qlar soni",["Eng katta ko'tara oladigan yuk massasi","Motorlarning umumiy quvvati","Dasturdagi buyruqlar soni"],"Erkinlik darajasi qancha ko'p bo'lsa, manipulyator shuncha murakkab harakatlana oladi."],
    [3,"Robototexnikaning uchta qonunini badiiy asarlarida kim ta'riflagan?","Isaak Azimov",["Karel Chapek","Nikola Tesla","Alan Tyuring"],"Bu qonunlar fantast yozuvchi Isaak Azimov hikoyalarida bayon qilingan."],
    [3,"Arduino'dagi millis() funksiyasi nimani qaytaradi?","Dastur boshlanganidan beri o'tgan millisekundlarni",["Joriy soat va daqiqani","Kontroller haroratini","delay() qiymatini"],"millis() delay() ishlatmasdan vaqtni o'lchash imkonini beradi."],
    [3,"Kontrollerda uzilish (interrupt) nima?","Asosiy dasturni to'xtatib, hodisaga zudlik bilan ishlov berish",["Dasturni butunlay o'chirish","Xotirani tozalash","Pinlarni o'chirib qo'yish"],"Uzilish ishlov berilgach, dastur to'xtagan joyidan davom etadi."],
    [3,"ATmega328P mikrokontrollerining Flash (dastur) xotirasi taxminan qancha?","32 KB",["2 KB","8 KB","256 KB"],"ATmega328P da 32 KB Flash, 2 KB SRAM va 1 KB EEPROM bor."],
    [3,"Ikki yetaklovchi g'ildirakli robot o'z o'qi atrofida joyida aylanishi uchun g'ildiraklar qanday aylanishi kerak?","Qarama-qarshi yo'nalishda, bir xil tezlikda",["Bir yo'nalishda, bir xil tezlikda","Bittasi aylanadi, ikkinchisi to'xtaydi","Ikkalasi ham to'xtaydi"],"Qarama-qarshi aylanganda robot bir joyda burilib qoladi."],
    [3,"Motor bilan g'ildirak orasiga reduktor o'rnatishdan asosiy maqsad nima?","Tezlikni kamaytirib, kuch momentini oshirish",["Tezlikni va momentni birga oshirish","Batareya kuchlanishini oshirish","Motorni sovitish"],"Reduktor aylanish tezligini pasaytiradi, buning evaziga burovchi moment ortadi."],
    [3,"2000 mAh sig'imli batareya o'rtacha 500 mA tok iste'mol qiladigan robotni ideal holda necha soat ishlatadi?","4 soat",["1 soat","2 soat","10 soat"],"Ish vaqti = sig'im / tok = 2000 / 500 = 4 soat."]
  ]);
  var RCOL = ["Qora", "Jigarrang", "Qizil", "To'q sariq", "Sariq", "Yashil", "Ko'k", "Binafsha", "Kulrang", "Oq"];
  function I5x(k, L) {
    var a, b, n, t, v, d, x;
    if (k === 5) { var sec = pick([0.5, 1, 1.5, 2, 3, 4, 5, 10]);
      return NQ("Arduino: <b>" + f(sec) + " sekund</b> kutish uchun delay() ga qanday qiymat beriladi?", sec * 1000, "", [sec, sec * 100, sec * 60, sec * 10, sec * 10000], ["delay() millisekundda: 1 s = 1000 ms.", f(sec) + " · 1000 = " + f(sec * 1000)]); }
    if (k === 6) { v = pick([5, 10, 15, 20, 25, 30]); t = R(2, 10);
      if (L > 1 && Math.random() < 0.5) return NQ("Robot sekundiga " + v + " sm yuradi. " + v * t + " sm masofani necha sekundda bosib o'tadi?", t, "s", [v * t * v, v, t + 1, t * 2], ["t = s : v = " + v * t + " : " + v + " = " + t + " s"]);
      return NQ("Robot sekundiga " + v + " sm yuradi. " + t + " sekundda necha sm yo'l bosadi?", v * t, "sm", [v + t, v * t * 2, v * (t - 1), v * t + v], ["s = v · t = " + v + " · " + t + " = " + v * t + " sm"]); }
    if (k === 7) { var C = pick([15, 18, 20, 22, 25, 30]); n = R(2, 10);
      return NQ("Robot g'ildiragining aylanasi (bir marta aylanganda bosiladigan yo'l) " + C + " sm. G'ildirak " + n + " marta aylansa, robot necha sm yuradi?", C * n, "sm", [C + n, C * (n + 1), C * n * 2, C * (n - 1)], [C + " · " + n + " = " + C * n + " sm"]); }
    if (k === 8) { a = pick([30, 45, 60, 90, 120, 180]); var full = a > 90 || Math.random() < 0.6, tg = full ? 360 : 180;
      return NQ("Robot har bir buyruqda " + a + "° ga buriladi. " + (full ? "To'liq bir marta aylanishi (360°)" : "Teskari tomonga qarashi (180°)") + " uchun necha marta burilishi kerak?", tg / a, "", [tg / a + 1, tg / a - 1, tg / a * 2, a / 10], [tg + "° : " + a + "° = " + tg / a]); }
    if (k === 10) { d = pick([10, 15, 20, 25, 30]); x = Math.random() < 0.2 ? d : R(3, 60); var stop = x < d;
      return TQ("Robot dasturi: agar masofa <b>< " + d + " sm</b> bo'lsa — to'xtaydi, aks holda — oldinga yuradi. Sensor <b>" + x + " sm</b> ko'rsatdi. Robot nima qiladi?", stop ? "To'xtaydi" : "Oldinga yuradi",
        [stop ? "Oldinga yuradi" : "To'xtaydi", "Orqaga yuradi", "O'ngga buriladi"], [x + " < " + d + " — " + (stop ? "rost ⇒ to'xtaydi." : "yolg'on ⇒ oldinga yuradi.")]); }
    if (k === 11) { n = R(2, 6);
      return NQ("Har biri 1.5 V bo'lgan " + n + " ta batareya ketma-ket ulandi. Umumiy kuchlanish necha volt?", 1.5 * n, "V", [1.5, n, 1.5 * (n + 1), 3 * n], ["Ketma-ket ulanganda kuchlanishlar qo'shiladi: " + n + " · 1.5 = " + f(1.5 * n) + " V"]); }
    if (k === 12) { var RS = [100, 150, 220, 330, 470, 1000];
      if (L === 3 && Math.random() < 0.4) { a = pick([100, 220, 330, 470, 1000]); n = pick([2, 2, 4, 5]); if (a / n !== Math.round(a / n)) n = 2;
        return NQ(n + " ta bir xil " + a + " Om li rezistor parallel ulandi. Umumiy qarshilik necha Om?", a / n, "Om", [a * n, a, a / n + a, a / (n * 2)], ["Bir xil rezistorlar parallel ulansa: R = " + a + " : " + n + " = " + f(a / n) + " Om"]); }
      a = pick(RS); b = pick(RS);
      return NQ(a + " Om va " + b + " Om li rezistorlar ketma-ket ulandi. Umumiy qarshilik necha Om?", a + b, "Om", [Math.abs(a - b) || a / 2, a * b / (a + b) === Math.round(a * b / (a + b)) ? a * b / (a + b) : a + b + 100, a + b + 10, Math.max(a, b)], ["Ketma-ket ulanganda qarshiliklar qo'shiladi: " + a + " + " + b + " = " + (a + b) + " Om"]); }
    if (k === 13) { n = R(0, 9);
      if (Math.random() < 0.5) return TQ("Rezistor rang kodida <b>" + RCOL[n].toLowerCase() + "</b> rang qaysi raqamni bildiradi?", String(n), otherN(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], [String(n)], 3), ["0 qora, 1 jigarrang, 2 qizil, 3 to'q sariq, 4 sariq, 5 yashil, 6 ko'k, 7 binafsha, 8 kulrang, 9 oq."]);
      return TQ("Rezistor rang kodida <b>" + n + "</b> raqami qaysi rang bilan belgilanadi?", RCOL[n], otherN(RCOL, [RCOL[n]], 3), ["0 qora, 1 jigarrang, 2 qizil, 3 to'q sariq, 4 sariq, 5 yashil, 6 ko'k, 7 binafsha, 8 kulrang, 9 oq."]); }
    a = pick([250, 500, 1000]); b = pick([250, 500, 1000]); var p = a + b;
    return NQ("Arduino: LED loop() ichida " + a + " ms yonib, " + b + " ms o'chadi. 1 minut davomida LED necha marta yonadi?", 60000 / p, "", [60000 / a, 60 / (p / 1000) * 2, 60000 / p + 1, p / 10], ["Bir davr: " + a + " + " + b + " = " + p + " ms.", "60 000 : " + p + " = " + 60000 / p]);
  }
  function I5(L) {
    var k = pick(lv(L, [0, 5, 6, 7, 8, 10, 11, 9, 9, 9], [0, 1, 2, 3, 4, 5, 6, 11, 12, 14, 9, 9, 9], [1, 2, 3, 4, 12, 13, 14, 9, 9, 9])), U, Ul, I, Rr, v, d, t;
    if (k >= 5 && k !== 9) return I5x(k, L);
    if (k === 0) { var ms2 = pick([50, 100, 200, 250, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 10000]);
      return NQ("Arduino: <b>delay(" + ms2 + ")</b> necha sekund kutadi?", ms2 / 1000, "s", [ms2, ms2 / 100, ms2 / 10, ms2 * 60 / 1000], ["delay millisekundda: " + ms2 + " ms = " + f(ms2 / 1000) + " s"]); }
    if (k === 1) { var cand = [[5, 2, 0.02], [5, 2, 0.01], [5, 3, 0.02], [5, 1.8, 0.02], [5, 2, 0.015], [3.3, 2, 0.01], [9, 2, 0.02], [12, 2, 0.02], [5, 3, 0.01]]; var c = pick(cand); U = c[0]; Ul = c[1]; I = c[2]; Rr = Math.round((U - Ul) / I);
      return NQ("LED ni " + U + " V manbaga ulash kerak. LED kuchlanishi " + Ul + " V, toki " + f(I * 1000) + " mA. Ketma-ket rezistor necha Om bo'lishi kerak?", Rr, "Om", [Math.round(U / I), Math.round(Ul / I), Math.round((U - Ul) / (I * 1000) * 100) / 100, Rr * 10], ["Rezistordagi kuchlanish: " + U + " − " + Ul + " = " + f(U - Ul) + " V, I = " + f(I * 1000) + " mA = " + I + " A", "R = " + f(U - Ul) + " : " + I + " = " + Rr + " Om"]); }
    if (k === 2) { var av = pick([[0, 0], [256, 1.25], [512, 2.5], [768, 3.75], [1023, 5]]); v = av[0]; var volt = av[1];
      return NQ("Arduino Uno (5 V) da analogRead() " + v + " qiymat qaytardi. Pindagi kuchlanish taxminan necha V?", volt, "V", [v / 100, 5 - volt, volt === 5 ? 3.3 : volt + 1.25, v === 0 ? 1023 : v / 255], ["0 → 0 V, 1023 → 5 V: U ≈ " + v + " / 1023 · 5 ≈ " + f(volt) + " V"]); }
    if (k === 3) { var pct = pick([20, 40, 60, 80, 100]); var pw = Math.round(pct / 100 * 255);
      return NQ("LED yorqinligini " + pct + "% ga qo'yish uchun analogWrite() ga taxminan qanday qiymat beriladi? (0–255)", pw, "", [pct, Math.round(pct / 100 * 1023), 255 - pw === pw ? pw + 10 : 255 - pw, pw + 51], ["255 · " + pct + "% = " + pw]); }
    if (k === 9) return BK_I5(L);
    t = pick([2, 4, 6, 10, 12, 20]); d = 343 * t / 2 / 10;
    return NQ("Ultratovush sensori: signal borib-qaytishi " + t + " ms davom etdi. Tovush tezligi 343 m/s. To'siqgacha masofa necha sm?", d, "sm", [d * 2, d / 10, 343 * t / 10, d + 10], ["s = v · t / 2 = 343 · " + f(t / 1000) + " : 2 = " + f(d / 100) + " m = " + f(d) + " sm"]);
  }
  S.register("i5", I5, "Informatika · Robototexnika asoslari");
})();
