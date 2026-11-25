/*!
 * Kuvonch Academy — umumiy savollar bazasi (ka-mavzular.js)
 * Barcha sinf o'yinlari (viktorina, arqon, kartalar, kataklar, shoh savol, oltin sandiq, mol ur, moslashtir, g'ildirak)
 * bir xil mavzular katalogidan foydalanadi + o'qituvchining o'z savollari:
 *   «📚 Mening savollarim» va «📂 Saqlangan testlar» (viktorinada yozilgan — shu brauzerda saqlanadi)
 * API: KA_MAVZU.TOPICS [[id, nom, guruh]], GROUPS, FANS, TITLE, files(ids), prep(ids) -> Promise<ids>, img(r), refreshOwn()
 * O'z savollari kaSavol'ga "oz" (hammasi) va "oz<testId>" (bitta test) mavzulari sifatida ulanadi. ES5.
 */
(function () {
  "use strict";
  if (window.KA_MAVZU) return;
  var DATA = {"t": [["a1", "A1. Qo'shish amali", 0], ["a2", "A2. Ayirish amali", 0], ["a3", "A3. Ko'paytirish amali", 0], ["a4", "A4. Bo'lish amali", 0], ["a5", "A5. Foizlar bilan amallar", 0], ["a6", "A6. Darajaga ko'tarish amali", 0], ["a7", "A7. Ko'paytirish (karra) jadvali", 0], ["a8", "A8. Sonlar", 0], ["t1", "1. Kvadrat funksiya va uning grafigi", 1], ["t2", "2. Kvadrat tengsizlik va uning yechimi", 1], ["t3", "3. Trigonometrik ayniyatlar", 1], ["t4", "4. Arifmetik va geometrik progressiya", 1], ["t5", "5. Funksiya tushunchasi", 1], ["t6", "6. Funksiya xossalari", 1], ["t7", "7. Funksiya grafiklarini sodda almashtirish", 1], ["t8", "8. Chiziqli va kvadratik modellashtirish", 1], ["t9", "9. Loyiha ishi. Munosabatlar va funksiyalar", 1], ["t10", "10. Sodda ratsional tenglamalar", 1], ["t11", "11. Sodda ratsional tenglamalar sistemasi", 1], ["t12", "12. Sodda ratsional tengsizliklar", 1], ["t13", "13. Sodda ratsional tengsizliklar sistemasi", 1], ["t14", "14. Ratsional tenglamalarga doir misollar yechish", 1], ["t15", "15. Sodda irratsional tenglamalar", 1], ["t16", "16. Irratsional tenglamalarga doir misollar yechish", 1], ["t17", "17. Sodda irratsional tenglamalar sistemasi", 1], ["t18", "18. Ratsional va irratsional ifodalarga doir misollar", 1], ["t19", "19. Ko'rsatkichli funksiya", 1], ["t20", "20. Logarifmik funksiya", 1], ["t21", "21. Ko'rsatkichli va logarifmik ifodalarni soddalashtirish", 1], ["t22", "22. Sodda ko'rsatkichli tenglamalar", 1], ["t23", "23. Sodda logarifmik tenglamalar", 1], ["t24", "24. Ko'rsatkichli va logarifmik tenglamalar sistemasi", 1], ["t25", "25. Sodda ko'rsatkichli tengsizliklar", 1], ["t26", "26. Sodda logarifmik tengsizliklar", 1], ["t27", "27. Ko'rsatkichli modellashtirish", 1], ["t28", "28. Ko'rsatkichli va logarifmik ifodalarga doir misollar", 1], ["t29", "29. Trigonometrik funksiyalar", 1], ["t30", "30. Teskari trigonometrik funksiyalar", 1], ["t31", "31. Trigonometrik funksiyalarga doir misollar", 1], ["t32", "32. STEM topshiriq", 1], ["t33", "33. sin x = a, cos x = a trigonometrik tenglamalar", 1], ["t34", "34. tg x = a, ctg x = a trigonometrik tenglamalar", 1], ["t35", "35. Trigonometrik tenglamalarni yechish", 1], ["t36", "36. Eng sodda trigonometrik tengsizliklar", 1], ["t37", "37. Tasodifiy hodisalar", 1], ["t38", "38. Ehtimollikni hisoblashda kombinatorika formulalaridan foydalanish", 1], ["t39", "39. Teng ehtimolli hodisalar", 1], ["t40", "40. Planimetriyaning mantiqiy tuzilishi", 1], ["t41", "41. Geometrik masalalar va ularni yechish usullari", 1], ["t42", "42. Stereometriyaning asosiy tushunchalari", 1], ["t43", "43. Fazoda to'g'ri chiziqlar va tekisliklar", 1], ["t44", "44. Fazoviy geometrik shakllar. Ko'pyoqlar", 1], ["t45", "45. Ko'pyoqlarni tasvirlash va modelini yasash", 1], ["t46", "46. Fazoda to'g'ri chiziqlarning o'zaro joylashuvi", 1], ["t47", "47. Ayqash to'g'ri chiziqlar", 1], ["t48", "48. Fazoda to'g'ri chiziqlar va tekisliklarning o'zaro joylashuvi", 1], ["t49", "49. Fazoda tekisliklarning o'zaro joylashuvi", 1], ["t50", "50. Fazoda parallel proyeksiyalash", 1], ["t51", "51. Qisqa ko'paytirish formulalari", 2], ["t52", "52. Ko'phadni ko'paytuvchilarga ajratish", 2], ["t53", "53. Modulli tenglamalar va tengsizliklar", 2], ["t54", "54. Arifmetik progressiya", 2], ["t55", "55. Geometrik progressiya", 2], ["t56", "56. Nisbat, proporsiya va foizli masalalar", 2], ["t57", "57. O'rta qiymatlar (arifmetik, geometrik, garmonik)", 2], ["t58", "58. Determinantlar va Kramer usuli", 2], ["t59", "59. Funksiyaning limiti asoslari", 2], ["t60", "60. Hosila va uning tatbiqlari (asosiy formulalar)", 2], ["t61", "61. Bo'linish belgilari, EKUB va EKUK", 2], ["t62", "62. Kvadrat ildiz va ratsional ko'rsatkichli daraja", 2], ["t63", "63. Vyet teoremasi", 2], ["t64", "64. Irratsional tenglamalar", 2], ["t65", "65. Funksiyaning aniqlanish sohasi", 2], ["t66", "66. Gorner sxemasi va Bezu teoremasi", 2], ["t67", "67. Logarifm xossalari va sodda logarifmik tenglamalar", 2], ["t68", "68. Asosiy trigonometrik ayniyatlar va keltirish formulalari", 2], ["t69", "69. Sodda trigonometrik tenglamalar (sin x = a, cos x = a)", 2], ["t70", "70. Aniqmas integral asoslari", 2], ["t71", "71. Uchburchak va uning xossalari", 3], ["t72", "72. To'rtburchaklar va ularning xossalari", 3], ["t73", "73. Aylana va doira", 3], ["t74", "74. Muntazam ko'pburchaklar", 3], ["t75", "75. Prizma va parallelepiped", 3], ["t76", "76. Piramida", 3], ["t77", "77. Silindr", 3], ["t78", "78. Konus", 3], ["t79", "79. Shar va sfera", 3], ["t80", "80. Ichki va tashqi chizilgan shakllar", 3], ["t81", "81. Jismlar kombinatsiyasi (shar, silindr, konus, prizma)", 3], ["t82", "82. Dekart koordinatalari (tekislikda)", 3], ["t83", "83. Vektorlar (tekislikda)", 3], ["t84", "84. Fazoda koordinatalar va vektorlar", 3], ["t85", "85. Sinuslar va kosinuslar teoremalari", 3], ["t86", "86. Shakllar o'xshashligi", 3], ["t87", "87. Fazoda burchak va masofalar", 3], ["t88", "88. Jismlarning kesimlari", 3], ["t89", "89. Faktorial", 4], ["t90", "90. Kombinatorikaning asosiy qoidalari", 4], ["t91", "91. O'rin almashtirish, o'rinlashtirish va guruhlash", 4], ["t92", "92. Ehtimollik: klassik ta'rif", 4], ["t93", "93. Ehtimollik qoidalari", 4], ["t94", "94. To'plamlar nazariyasi asoslari", 4], ["t95", "95. Eyler–Venn doiralari va kiritish-chiqarish formulasi", 4], ["t96", "96. Nyuton binomi", 4], ["t97", "97. Fizika uchun matematika: formulalar bilan ishlash", 5], ["t98", "98. O'lchov birliklari va shkala", 5], ["t99", "99. O'rtacha kvadratik chetlanish, tanlanma va xatolik chegarasi", 6], ["t100", "100. Diagrammalar: nuqtali, quti diagrammasi, gistogramma", 6], ["t101", "101. Sochilma diagramma va eng yaxshi moslik chizig'i", 6], ["t102", "102. Kompleks sonlar", 6], ["s1", "1-sinf savollari (daraja testi)", 7], ["s2", "2-sinf savollari (daraja testi)", 7], ["s3", "3-sinf savollari (daraja testi)", 7], ["s4", "4-sinf savollari (daraja testi)", 7], ["s5", "5-sinf savollari (daraja testi)", 7], ["s6", "6-sinf savollari (daraja testi)", 7], ["s7", "7-sinf savollari (daraja testi)", 7], ["s8", "8-sinf savollari (daraja testi)", 7], ["s9", "9-sinf savollari (daraja testi)", 7], ["s10", "10-sinf savollari (daraja testi)", 7], ["s11", "11-sinf savollari (daraja testi)", 7], ["s1m1", "1-sinf · 1 dan 20 gacha sonlar", 8], ["s1m2", "1-sinf · 10 ichida qo'shish va ayirish", 8], ["s1m3", "1-sinf · 20 ichida o'nlikdan o'tib qo'shish va ayirish", 8], ["s1m4", "1-sinf · Shakllar va sodda masalalar", 8], ["s2m1", "2-sinf · 100 ichida qo'shish va ayirish", 8], ["s2m2", "2-sinf · Ko'paytirish va bo'lish jadvali (2–5)", 8], ["s2m3", "2-sinf · Uzunlik, vaqt, massa birliklari", 8], ["s2m4", "2-sinf · Matnli masalalar: narx, «marta ko'p»", 8], ["s3m1", "3-sinf · Ko'paytirish va bo'lish jadvali (to'liq)", 8], ["s3m2", "3-sinf · 1000 ichida qo'shish va ayirish", 8], ["s3m3", "3-sinf · Jadvaldan tashqari ko'paytirish va bo'lish", 8], ["s3m4", "3-sinf · Perimetr va ikki amalli masalalar", 8], ["s4m1", "4-sinf · Ko'p xonali sonlar", 8], ["s4m2", "4-sinf · Ustun ko'paytirish va burchakli bo'lish", 8], ["s4m3", "4-sinf · Tezlik, vaqt, masofa", 8], ["s4m4", "4-sinf · Yuza va ulushlar (kasr tushunchasi)", 8], ["s5m1", "5-sinf · Natural sonlar va bo'linish", 8], ["s5m2", "5-sinf · Oddiy kasrlar", 8], ["s5m3", "5-sinf · O'nli kasrlar", 8], ["s5m4", "5-sinf · Foizlar", 8], ["s5m5", "5-sinf · Burchaklar va uchburchak", 8], ["s6m1", "6-sinf · Nisbat va proporsiya", 8], ["s6m2", "6-sinf · Butun sonlar", 8], ["s6m3", "6-sinf · Ratsional sonlar ustida amallar", 8], ["s6m4", "6-sinf · Chiziqli tenglamalar", 8], ["s6m5", "6-sinf · Koordinata tekisligi", 8], ["s7m1", "7-sinf · Natural ko'rsatkichli daraja", 8], ["s7m2", "7-sinf · Ko'phadlar va qisqa ko'paytirish formulalari", 8], ["s7m3", "7-sinf · Chiziqli tenglamalar sistemasi", 8], ["s7m4", "7-sinf · Uchburchaklar va parallel to'g'ri chiziqlar", 8], ["s8m1", "8-sinf · Kvadrat ildizlar", 8], ["s8m2", "8-sinf · Kvadrat tenglamalar", 8], ["s8m3", "8-sinf · To'rtburchaklar va Pifagor teoremasi", 8], ["s8m4", "8-sinf · Algebraik kasrlar", 8], ["s9m1", "9-sinf · Kvadrat funksiya va kvadrat tengsizliklar", 8], ["s9m2", "9-sinf · Arifmetik va geometrik progressiya", 8], ["s9m3", "9-sinf · Trigonometriya asoslari", 8], ["s9m4", "9-sinf · Aylana, doira va o'xshashlik", 8], ["s9m5", "9-sinf · Ehtimollik elementlari", 8], ["m1", "Mantiq · Sonli ketma-ketliklar", 9], ["m2", "Mantiq · Ortiqchasini toping", 9], ["m3", "Mantiq · Harflar, kunlar, oylar va soat", 9], ["m4", "Mantiq · Mantiqiy xulosa (sillogizmlar)", 9], ["m5", "Mantiq · Tartiblash va taqqoslash", 9], ["m6", "Mantiq · Mantiqiy masalalar", 9], ["m7", "Mantiq · Rostgo'y va yolg'onchi", 9], ["m8", "Mantiq · Kim qaysi kasbda? (mantiqiy jadval)", 9], ["m9", "Mantiq · Sehrli kvadrat va sonli jumboqlar", 9], ["m10", "Mantiq · Ezop masallari", 9], ["m11", "Mantiq · Sherlock tergov ishlari", 9], ["e1", "Ingliz tili · Lug'at A1 (4000 Essential Words 1)", 10], ["e2", "Ingliz tili · Lug'at A2 (4000 Essential Words 2)", 10], ["e3", "Ingliz tili · Lug'at B1 (4000 Essential Words 3)", 10], ["e4", "Ingliz tili · Lug'at B1+ (4000 Essential Words 4)", 10], ["e5", "Ingliz tili · Lug'at B2 (4000 Essential Words 5)", 10], ["e6", "Ingliz tili · Lug'at C1 (4000 Essential Words 6)", 10], ["e7", "Ingliz tili · To be va Present Simple", 10], ["e8", "Ingliz tili · Noto'g'ri fe'llar (V2, V3)", 10], ["e9", "Ingliz tili · Artikllar, ko'plik, predloglar", 10], ["e10", "Ingliz tili · Sifat darajalari va zamonlar", 10], ["r1", "Rus tili · Lug'at: ruscha → o'zbekcha", 11], ["r2", "Rus tili · Lug'at: o'zbekcha → ruscha", 11], ["r3", "Rus tili · Olmoshlar kelishiklarda", 11], ["r4", "Rus tili · Otlarning jinsi (м, ж, ср)", 11], ["r5", "Rus tili · Sonlar, hafta kunlari va oylar", 11], ["r6", "Rus tili · Kundalik iboralar", 11], ["f1", "Fizika · Mexanika: tezlik, kuch, bosim", 12], ["f2", "Fizika · Ish, quvvat va energiya", 12], ["f3", "Fizika · Elektr: Om qonuni, quvvat", 12], ["f4", "Fizika · Issiqlik, zichlik, Arximed kuchi", 12], ["f5", "Fizika · Kattaliklar, birliklar va olimlar", 12], ["k1", "Kimyo · Kimyoviy elementlar va belgilar", 13], ["k2", "Kimyo · Molyar massa va modda miqdori", 13], ["k3", "Kimyo · Asosiy tushunchalar va reaksiyalar", 13], ["b1", "Biologiya · Hujayra va tirik organizmlar", 14], ["b2", "Biologiya · Odam anatomiyasi va salomatlik", 14], ["b3", "Biologiya · O'simliklar va hayvonlar dunyosi", 14], ["g1", "Geografiya · Davlatlar va poytaxtlar", 15], ["g2", "Geografiya · O'zbekiston geografiyasi", 15], ["g3", "Geografiya · Materiklar, okeanlar va tabiat", 15], ["h1", "Tarix · O'zbekiston tarixi: muhim sanalar", 16], ["h2", "Tarix · Buyuk allomalar va ularning asarlari", 16], ["h3", "Tarix · Jahon tarixi", 16], ["i1", "Informatika · Sanoq sistemalari", 17], ["i2", "Informatika · Axborot birliklari", 17], ["i3", "Informatika · Kompyuter, internet va dasturlash", 17], ["i4", "Informatika · Mantiqiy amallar va algoritmlar", 17], ["i5", "Informatika · Robototexnika asoslari", 17], ["o1", "Ona tili · Kelishiklar va qo'shimchalar", 18], ["o2", "Ona tili · So'z turkumlari", 18], ["o3", "Ona tili · Fonetika va imlo", 18], ["at0", "Avtotest · Barcha mavzular (aralash)", 20], ["at1", "Avtotest · Umumiy qoidalar va atamalar", 20], ["at2", "Avtotest · Yo'l belgilari", 20], ["at3", "Avtotest · Yo'l chiziqlari", 20], ["at4", "Avtotest · Svetofor va tartibga soluvchi ishoralari", 20], ["at5", "Avtotest · Harakatni boshlash va manevr", 20], ["at6", "Avtotest · Tezlik, quvib o'tish, oraliq", 20], ["at7", "Avtotest · To'xtash va to'xtab turish", 20], ["at8", "Avtotest · Chorrahalar", 20], ["at9", "Avtotest · Piyodalar, bekatlar, temir yo'l, avtomagistral", 20], ["at10", "Avtotest · Yoritish asboblari va signallar", 20], ["at11", "Avtotest · Shatakka olish, odam va yuk tashish", 20], ["at12", "Avtotest · Texnik holat va jihozlar", 20], ["at13", "Avtotest · Birinchi tibbiy yordam", 20], ["zk1", "Zakovat · Fan va texnika", 30], ["zk2", "Zakovat · Tarix, madaniyat va san'at", 30], ["zk3", "Zakovat · Til, adabiyot va topishmoqlar", 30], ["zk4", "Zakovat · Qora quti: qutida nima bor?", 30], ["zk5", "Zakovat · Matematik zakovat", 30], ["ad1", "Adabiyot · O'zbek adiblari va ularning asarlari", 21], ["ad2", "Adabiyot · Adabiyot nazariyasi: tur, janr va tasvir vositalari", 21], ["ad3", "Adabiyot · Jahon adabiyoti", 21], ["hq1", "Huquq · Konstitutsiya va davlat tuzilishi", 22], ["hq2", "Huquq · Inson huquqlari, erkinliklari va burchlari", 22], ["hq3", "Huquq · Huquq sohalari: mehnat, oila, ma'muriy va jinoyat huquqi asoslari", 22], ["iq1", "Iqtisodiyot · Asosiy tushunchalar: ehtiyoj, talab, taklif, bozor", 23], ["iq2", "Iqtisodiyot · Pul, bank va soliqlar", 23], ["iq3", "Iqtisodiyot · Moliyaviy savodxonlik: byudjet, jamg'arma, kredit va foiz", 23], ["as1", "Astronomiya · Quyosh sistemasi", 24], ["as2", "Astronomiya · Yulduzlar, galaktikalar va koinot", 24], ["as3", "Astronomiya · Astronomiya tarixi va kosmonavtika", 24], ["cz1", "Chizmachilik · Chizma asboblari, formatlar va chiziq turlari", 25], ["cz2", "Chizmachilik · Proyeksiyalar va ko'rinishlar", 25], ["cz3", "Chizmachilik · Masshtab, o'lchamlar va kesimlar", 25], ["ek1", "Ekologiya · Ekotizimlar va oziq zanjiri", 26], ["ek2", "Ekologiya · Ekologik muammolar: Orol, iqlim, ifloslanish", 26], ["ek3", "Ekologiya · Tabiatni muhofaza qilish", 26], ["tb1", "Tarbiya · Odob-axloq va muomala madaniyati", 27], ["tb2", "Tarbiya · Vatan, davlat ramzlari va milliy bayramlar", 27], ["tb3", "Tarbiya · Sog'lom turmush, xavfsiz internet va kasb tanlash", 27], ["cq1", "ChQBT · Birinchi tibbiy yordam", 28], ["cq2", "ChQBT · Fuqaro muhofazasi va favqulodda vaziyatlar", 28], ["cq3", "ChQBT · Qurolli Kuchlar va harbiy xizmat asoslari", 28], ["jt1", "Jismoniy tarbiya · Sport turlari va o'yin qoidalari", 29], ["jt2", "Jismoniy tarbiya · Olimpiya o'yinlari va o'zbek sportchilari", 29], ["jt3", "Jismoniy tarbiya · Sog'liq, gigiyena va mashqlar", 29]], "g": ["🧮 Asosiy amallar", "📘 Mavzular (1–50)", "🎓 Algebra · Milliy sertifikat (51–70)", "📐 Geometriya (71–88)", "🎲 Kombinatorika va ehtimollik (89–96)", "⚛️ Fizika uchun matematika (97–98)", "📊 SAT statistika (99–102)", "🎯 Sinflar bo'yicha — daraja testi (1–11-sinf)", "🏫 1–9-sinf modullari", "🧠 Mantiq", "🇬🇧 Ingliz tili", "🇷🇺 Rus tili", "⚛️ Fizika", "🧪 Kimyo", "🧬 Biologiya", "🌍 Geografiya", "📜 Tarix", "💻 Informatika va robototexnika", "📝 Ona tili", "📈 Grafiklar (chizmali savollar)", "🚗 Avtotest (prava imtihoni)", "📖 Adabiyot", "⚖️ Huquq", "💰 Iqtisodiyot", "🔭 Astronomiya", "✏️ Chizmachilik", "🌱 Ekologiya", "🤝 Tarbiya", "🎖️ ChQBT (chaqiruvgacha tayyorgarlik)", "🏃 Jismoniy tarbiya", "🦉 Zakovat (bilimdonlar savollari)"], "f": [["all", "🌐 Hammasi", null], ["mat", "📐 Matematika", [19, 0, 1, 2, 3, 4, 5, 6, 7, 8]], ["mantiq", "🧠 Mantiq", [9]], ["zakovat", "🦉 Zakovat", [30]], ["ingliz", "🇬🇧 Ingliz tili", [10]], ["rus", "🇷🇺 Rus tili", [11]], ["fizika", "⚛️ Fizika", [12, 5]], ["kimyo", "🧪 Kimyo", [13]], ["biologiya", "🧬 Biologiya", [14]], ["geografiya", "🌍 Geografiya", [15]], ["tarix", "📜 Tarix", [16]], ["informatika", "💻 Informatika", [17]], ["ona", "📝 Ona tili", [18]], ["adabiyot", "📖 Adabiyot", [21]], ["huquq", "⚖️ Huquq", [22]], ["iqtisod", "💰 Iqtisodiyot", [23]], ["astronomiya", "🔭 Astronomiya", [24]], ["chizma", "✏️ Chizmachilik", [25]], ["ekologiya", "🌱 Ekologiya", [26]], ["tarbiya", "🤝 Tarbiya", [27]], ["chqbt", "🎖️ ChQBT", [28]], ["sport", "🏃 Jismoniy tarbiya", [29]], ["avto", "🚗 Avtotest", [20]]]};
  var TOPICS = DATA.t, GROUPS = DATA.g, FANS = DATA.f;
  // 🔌 saytdagi alohida fan bo'limlari (ka-bolimlar.js MANIFEST) — o'zi qo'shiladi
  if (window.KA_BOLIM) window.KA_BOLIM.apply(TOPICS, GROUPS, FANS);
  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var V = "?v=20261117b";
  var LS_OWN = "ka.viktorina.own.v1", LS_TESTS = "ka.viktorina.tests.v1";

  /* ---------------- o'qituvchi savollari ---------------- */
  var OZ_G = GROUPS.length; GROUPS.push("📚 O'qituvchi savollari (viktorinada yozilgan)");
  FANS.splice(1, 0, ["oz", "📚 Mening savollarim", [OZ_G]]);
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function escH(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function txt(t) { return escH(t).replace(/\r?\n/g, "<br>"); }
  function isImg(r) { return typeof r === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(r); }
  function num(s) { var x = parseFloat(String(s).replace(",", ".").replace(/\s/g, "")); return isFinite(x) && /^-?\d+([.,]\d+)?$/.test(String(s).trim()) ? x : NaN; }
  function nearNum(a) {
    var out = [], d = Math.max(1, Math.round(Math.abs(a) * .15)), dec = String(a).indexOf(".") > -1;
    [a + d, a - d, a + 2 * d, a * 2, a - 2 * d, a + 1, a - 1].forEach(function (x) { x = dec ? Math.round(x * 100) / 100 : Math.round(x); if (x !== a && out.indexOf(String(x)) < 0 && out.length < 3) out.push(String(x)); });
    return out;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function stepsOf(t) { return String(t || "").split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8).map(escH); }
  // «Mening savollarim» elementi -> {q, a, w, steps, r} (A–D variantli; grafikli va matnli javobli savollar — sonli bo'lsa variant yasaladi)
  function fromOwn(s) {
    if (!s || s.fx) return null;
    var k = s.kind || "mc", r = isImg(s.img) ? s.img : null, st = stepsOf(s.st);
    if (k === "mc") { if (!s.o || s.o.length < 2 || !(s.c >= 0)) return null; return { q: txt(s.q), a: escH(s.o[s.c]), w: s.o.filter(function (_, i) { return i !== s.c; }).map(escH), steps: st, r: r }; }
    if (k === "tf") { var o = ["✅ To'g'ri", "❌ Noto'g'ri"]; return { q: txt(s.q), a: o[s.c ? 1 : 0], w: [o[s.c ? 0 : 1]], steps: st, r: r }; }
    if (k === "in") {
      var acc = String(s.acc || "").split(/[;|]/).map(function (x) { return x.trim(); }).filter(Boolean), n = acc.length ? num(acc[0]) : NaN;
      if (isNaN(n)) return null;
      return { q: txt(s.q), a: acc[0], w: nearNum(n), steps: st, r: r };
    }
    if (k === "mos" && s.L && s.R && s.L.length >= 2) {
      var i = Math.floor(Math.random() * s.L.length);
      return { q: (s.q ? txt(s.q) + "<br>" : "") + "<b>" + escH(s.L[i]) + "</b> — ?", a: escH(s.R[i]), w: shuffle(s.R.filter(function (_, j) { return j !== i; })).slice(0, 3).map(escH), steps: st, r: r };
    }
    return null;
  }
  // saqlangan test savoli (viktorina formatida) -> {q, a, w, steps, r}
  function fromTest(q) {
    if (!q || q.g) return null;
    if (q.t === "in") { var acc = q.acc || [], n = acc.length ? num(acc[0]) : NaN; if (isNaN(n)) return null; return { q: q.q, a: String(acc[0]), w: nearNum(n), steps: q.steps || [], r: q.r || null }; }
    if (!q.opts || q.opts.length < 2 || !(q.ci >= 0)) return null;
    return { q: q.q, a: q.opts[q.ci], w: q.opts.filter(function (_, i) { return i !== q.ci; }), steps: q.steps || [], r: q.r || null };
  }
  var OWN = { list: [], tests: [] };
  function refreshOwn() {
    var own = lsGet(LS_OWN, []), tests = lsGet(LS_TESTS, []);
    OWN.list = (Array.isArray(own) ? own : []).filter(function (s) { return !!fromOwn(s); });
    OWN.tests = (Array.isArray(tests) ? tests : []).map(function (t) { return { id: String(t.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 16), name: String(t.name || "Test"), qs: (t.qs || []).filter(function (q) { return !!fromTest(q); }) }; })
      .filter(function (t) { return t.id && t.qs.length; });
    // katalogdagi eski yozuvlar o'chiriladi va yangidan qo'shiladi
    for (var i = TOPICS.length - 1; i >= 0; i--) if (TOPICS[i][2] === OZ_G) TOPICS.splice(i, 1);
    if (OWN.list.length) TOPICS.push(["oz", "📚 Mening savollarim (" + OWN.list.length + " ta)", OZ_G]);
    OWN.tests.forEach(function (t) { TOPICS.push(["oz" + t.id, "📂 " + t.name + " (" + t.qs.length + " ta)", OZ_G]); });
    TOPICS.forEach(function (t) { TITLE[t[0]] = t[1]; });
    register();
  }
  var TITLE = {};
  function register() {
    var S = window.kaSavol; if (!S || !S.register) return;
    if (OWN.list.length) S.register("oz", function () { var s, p, g = 0; do { s = OWN.list[Math.floor(Math.random() * OWN.list.length)]; p = fromOwn(s); } while (!p && g++ < 20); return p; }, TITLE.oz);
    OWN.tests.forEach(function (t) { S.register("oz" + t.id, function () { return fromTest(t.qs[Math.floor(Math.random() * t.qs.length)]); }, TITLE["oz" + t.id]); });
  }

  /* ---------------- 📗 Tayyor test bazasi (baza/*.json): ochiq savollar — javob kaliti yo'q, o'qituvchi tekshiradi ---------------- */
  // Har mavzu: 60 variant × 40 savol (I–IV daraja, har biri 10 tadan). Javob varianti yo'q — faqat o'qituvchi
  // to'g'ri/noto'g'ri deb belgilaydigan o'yinlarda chiqadi (Sirli kataklar, Shoh savol, Oltin sandiq — proyektor, Omad g'ildiragi).
  var BZ = [["t1", "1. Kvadrat funksiya va uning grafigi"], ["t2", "2. Kvadrat tengsizlik va uning yechimi"], ["t3", "3. Trigonometrik ayniyatlar"], ["t4", "4. Arifmetik va geometrik progressiya"], ["t5", "5. Funksiya tushunchasi"], ["t6", "6. Funksiya xossalari"], ["t7", "7. Funksiya grafiklarini sodda almashtirish"], ["t8", "8. Chiziqli va kvadratik modellashtirish"], ["t9", "9. Loyiha ishi. Munosabatlar va funksiyalar"], ["t10", "10. Sodda ratsional tenglamalar"], ["t11", "11. Sodda ratsional tenglamalar sistemasi"], ["t12", "12. Sodda ratsional tengsizliklar"], ["t13", "13. Sodda ratsional tengsizliklar sistemasi"], ["t14", "14. Ratsional tenglamalarga doir misollar yechish"], ["t15", "15. Sodda irratsional tenglamalar"], ["t16", "16. Irratsional tenglamalarga doir misollar yechish"], ["t17", "17. Sodda irratsional tenglamalar sistemasi"], ["t18", "18. Ratsional va irratsional ifodalarga doir misollar"], ["t19", "19. Ko'rsatkichli funksiya"], ["t20", "20. Logarifmik funksiya"], ["t21", "21. Ko'rsatkichli va logarifmik ifodalarni soddalashtirish"], ["t22", "22. Sodda ko'rsatkichli tenglamalar"], ["t23", "23. Sodda logarifmik tenglamalar"], ["t24", "24. Ko'rsatkichli va logarifmik tenglamalar sistemasi"], ["t25", "25. Sodda ko'rsatkichli tengsizliklar"], ["t26", "26. Sodda logarifmik tengsizliklar"], ["t27", "27. Ko'rsatkichli modellashtirish"], ["t28", "28. Ko'rsatkichli va logarifmik ifodalarga doir misollar"], ["t29", "29. Trigonometrik funksiyalar"], ["t30", "30. Teskari trigonometrik funksiyalar"], ["t31", "31. Trigonometrik funksiyalarga doir misollar"], ["t32", "32. STEM topshiriq"], ["t33", "33. sin x = a, cos x = a trigonometrik tenglamalar"], ["t34", "34. tg x = a, ctg x = a trigonometrik tenglamalar"], ["t35", "35. Trigonometrik tenglamalarni yechish"], ["t36", "36. Eng sodda trigonometrik tengsizliklar"], ["t37", "37. Tasodifiy hodisalar"], ["t38", "38. Ehtimollikni hisoblashda kombinatorika formulalaridan foydalanish"], ["t39", "39. Teng ehtimolli hodisalar"], ["t40", "40. Planimetriyaning mantiqiy tuzilishi"], ["t41", "41. Geometrik masalalar va ularni yechish usullari"], ["t42", "42. Stereometriyaning asosiy tushunchalari"], ["t43", "43. Fazoda to'g'ri chiziqlar va tekisliklar"], ["t44", "44. Fazoviy geometrik shakllar. Ko'pyoqlar"], ["t45", "45. Ko'pyoqlarni tasvirlash va modelini yasash"], ["t46", "46. Fazoda to'g'ri chiziqlarning o'zaro joylashuvi"], ["t47", "47. Ayqash to'g'ri chiziqlar"], ["t48", "48. Fazoda to'g'ri chiziqlar va tekisliklarning o'zaro joylashuvi"], ["t49", "49. Fazoda tekisliklarning o'zaro joylashuvi"], ["t50", "50. Fazoda parallel proyeksiyalash"], ["a1", "A1. Qo'shish amali"], ["a2", "A2. Ayirish amali"], ["a3", "A3. Ko'paytirish amali"], ["a4", "A4. Bo'lish amali"], ["a5", "A5. Foizlar bilan amallar"], ["a6", "A6. Darajaga ko'tarish amali"], ["a7", "A7. Ko'paytirish (karra) jadvali"], ["a8", "A8. Sonlar"], ["t51", "51. Qisqa ko'paytirish formulalari"], ["t52", "52. Ko'phadni ko'paytuvchilarga ajratish"], ["t53", "53. Modulli tenglamalar va tengsizliklar"], ["t54", "54. Arifmetik progressiya"], ["t55", "55. Geometrik progressiya"], ["t56", "56. Nisbat, proporsiya va foizli masalalar"], ["t57", "57. O'rta qiymatlar (arifmetik, geometrik, garmonik)"], ["t58", "58. Determinantlar va Kramer usuli"], ["t59", "59. Funksiyaning limiti asoslari"], ["t60", "60. Hosila va uning tatbiqlari (asosiy formulalar)"], ["t61", "61. Bo'linish belgilari, EKUB va EKUK"], ["t62", "62. Kvadrat ildiz va ratsional ko'rsatkichli daraja"], ["t63", "63. Vyet teoremasi"], ["t64", "64. Irratsional tenglamalar"], ["t65", "65. Funksiyaning aniqlanish sohasi"], ["t66", "66. Gorner sxemasi va Bezu teoremasi"], ["t67", "67. Logarifm xossalari va sodda logarifmik tenglamalar"], ["t68", "68. Asosiy trigonometrik ayniyatlar va keltirish formulalari"], ["t69", "69. Sodda trigonometrik tenglamalar (sin x = a, cos x = a)"], ["t70", "70. Aniqmas integral asoslari"], ["t71", "71. Uchburchak va uning xossalari"], ["t72", "72. To'rtburchaklar va ularning xossalari"], ["t73", "73. Aylana va doira"], ["t74", "74. Muntazam ko'pburchaklar"], ["t75", "75. Prizma va parallelepiped"], ["t76", "76. Piramida"], ["t77", "77. Silindr"], ["t78", "78. Konus"], ["t79", "79. Shar va sfera"], ["t80", "80. Ichki va tashqi chizilgan shakllar"], ["t81", "81. Jismlar kombinatsiyasi (shar, silindr, konus, prizma)"], ["t82", "82. Dekart koordinatalari (tekislikda)"], ["t83", "83. Vektorlar (tekislikda)"], ["t84", "84. Fazoda koordinatalar va vektorlar"], ["t85", "85. Sinuslar va kosinuslar teoremalari"], ["t86", "86. Shakllar o'xshashligi"], ["t87", "87. Fazoda burchak va masofalar"], ["t88", "88. Jismlarning kesimlari"], ["t89", "89. Faktorial"], ["t90", "90. Kombinatorikaning asosiy qoidalari"], ["t91", "91. O'rin almashtirish, o'rinlashtirish va guruhlash"], ["t92", "92. Ehtimollik: klassik ta'rif"], ["t93", "93. Ehtimollik qoidalari"], ["t94", "94. To'plamlar nazariyasi asoslari"], ["t95", "95. Eyler–Venn doiralari va kiritish-chiqarish formulasi"], ["t96", "96. Nyuton binomi"], ["t97", "97. Fizika uchun matematika: formulalar bilan ishlash"], ["t98", "98. O'lchov birliklari va shkala"], ["t99", "99. O'rtacha kvadratik chetlanish, tanlanma va xatolik chegarasi"], ["t100", "100. Diagrammalar: nuqtali, quti diagrammasi, gistogramma"], ["t101", "101. Sochilma diagramma va eng yaxshi moslik chizig'i"], ["t102", "102. Kompleks sonlar"]];
  var BZ_G = GROUPS.length; GROUPS.push("📗 Tayyor test bazasi — ochiq savollar (o'qituvchi tekshiradi)");
  FANS.splice(2, 0, ["bz", "📗 Test bazasi", [BZ_G]]);
  BZ.forEach(function (b) { TOPICS.push(["bz" + b[0], "📗 " + b[1], BZ_G]); });
  var bank = {}, bankP = {};
  function isOpen(id) { return /^bz/.test(id); }
  function bankLoad(id) {
    var k = id.slice(2);
    if (bankP[k]) return bankP[k];
    return (bankP[k] = fetch(BASE + "baza/" + k + ".json" + V).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { if (d && d.v && d.v.length) bank[k] = d; }).catch(function () { delete bankP[k]; }));
  }
  // L: 1 — I daraja, 2 — II, 3 — III–IV, "mix"/0 — istalgani
  function bankQ(id, L) {
    var d = bank[id.slice(2)]; if (!d) return null;
    var v = d.v[Math.floor(Math.random() * d.v.length)], qs = v[1], lo = 0, hi = qs.length - 1;
    if (L == 1) { lo = 0; hi = 9; } else if (L == 2) { lo = 10; hi = 19; } else if (L == 3) { lo = 20; hi = 39; }
    hi = Math.min(hi, qs.length - 1); if (lo > hi) lo = 0;
    var i = lo + Math.floor(Math.random() * (hi - lo + 1)), tx = qs[i];
    return tx ? { tx: String(tx), L: i < 10 ? 1 : i < 20 ? 2 : 3, lvl: ["I", "II", "III", "IV"][Math.floor(i / 10)] || "" } : null;
  }
  // formulalar: KaTeX ($...$) — faqat kerak bo'lganda yuklanadi
  var KX = null, MAC = { "\\tg": "\\operatorname{tg}", "\\ctg": "\\operatorname{ctg}", "\\arctg": "\\operatorname{arctg}", "\\arcctg": "\\operatorname{arcctg}" };
  function loadKatex() {
    if (window.renderMathInElement) return Promise.resolve();
    if (KX) return KX;
    var CDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";
    return (KX = new Promise(function (ok) {
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = CDN + "katex.min.css"; document.head.appendChild(l);
      var s1 = document.createElement("script"); s1.src = CDN + "katex.min.js";
      s1.onload = function () { var s2 = document.createElement("script"); s2.src = CDN + "contrib/auto-render.min.js"; s2.onload = ok; s2.onerror = ok; document.head.appendChild(s2); };
      s1.onerror = function () { KX = null; ok(); };
      document.head.appendChild(s1);
    }));
  }
  function math(el) {
    if (!el || String(el.textContent).indexOf("$") < 0) return Promise.resolve();
    return loadKatex().then(function () {
      if (!window.renderMathInElement) return;
      try { window.renderMathInElement(el, { delimiters: [{ left: "$", right: "$", display: false }], macros: MAC, throwOnError: false, strict: false }); } catch (e) {}
    });
  }

  /* ---------------- generator fayllari ---------------- */
  var MATH = ["ka-savollar-2.js", "ka-savollar-3.js", "ka-savollar-4.js", "ka-savollar-5.js", "ka-savollar-6.js", "ka-savollar-7.js", "ka-savollar-8.js", "ka-savollar-9.js", "ka-savollar-10.js", "ka-savollar-11.js", "ka-savollar-12.js", "ka-savol-qoshimcha.js"];
  var GEN = [
    [/^(a\d+|t\d+)$/, MATH],
    [/^s\d+(m\d+)?$/, MATH.concat(["ka-sinf-modullar.js"])],
    [/^(m|e|r)\d+$/, ["ka-savollar-fanlar.js"]],
    [/^(f|k|i)\d+$/, ["ka-fan-tabiiy.js"]],
    [/^(b|g|h|o)\d+$/, ["ka-fan-ijtimoiy.js"]],
    [/^at\d+$/, ["ka-fan-avtotest.js"]],
    [/^(ad|hq|iq|as|cz|ek|tb|cq|jt)\d+$/, ["ka-fan-maktab.js"]],
    [/^zk\d+$/, ["ka-fan-zakovat.js"]]
  ];
  var loaded = {};
  function addJs(src) {
    if (loaded[src]) return loaded[src];
    // sahifa o'zi <script> bilan ulagan bo'lsa — qayta yuklanmaydi
    var have = Array.prototype.some.call(document.scripts, function (s) { return s.src && s.src.split("?")[0].slice(-src.length - 1) === "/" + src; });
    if (have) return (loaded[src] = Promise.resolve());
    return (loaded[src] = new Promise(function (ok) {
      var s = document.createElement("script"); s.src = BASE + src + V;
      s.onload = ok; s.onerror = function () { delete loaded[src]; ok(); };
      document.head.appendChild(s);
    }));
  }
  function files(ids) {
    var out = [];
    GEN.forEach(function (g) { if (ids.some(function (id) { return g[0].test(id); })) g[1].forEach(function (f) { if (out.indexOf(f) < 0) out.push(f); }); });
    return out;
  }
  // tanlangan mavzular generatorlari (ketma-ket) + lug'at/savol banklari. Natija: ishlaydigan mavzular ro'yxati
  function prep(ids) {
    var p = window.kaSavol ? Promise.resolve() : addJs("ka-savollar.js");
    var open = ids.filter(isOpen);
    return Promise.all(open.map(bankLoad)).then(function () { return p; }).then(function () {
      register();
      return files(ids).reduce(function (q, f) { return q.then(function () { return addJs(f); }); }, Promise.resolve());
    }).then(function () {
      var ps = [];
      if (window.kaFan && window.kaFan.prep) ps.push(window.kaFan.prep(ids));
      if (window.kaAvto && ids.some(window.kaAvto.isAt)) ps.push(window.kaAvto.load());
      if (window.KA_BOLIM && ids.some(window.KA_BOLIM.has)) ps.push(window.KA_BOLIM.prep(ids));
      return Promise.race([Promise.all(ps), new Promise(function (ok) { setTimeout(ok, 20000); })]);
    }).catch(function () {}).then(function () {
      return ids.filter(function (id) { return isOpen(id) ? !!bank[id.slice(2)] : window.kaSavol && window.kaSavol.has(id); });
    });
  }
  // savol rasmi: avtotest belgisi/chorraha yoki o'qituvchi yuklagan rasm
  function img(r) {
    if (!r) return "";
    if (isImg(r)) return '<img class="ka-qimg" src="' + r + '" alt="Savol rasmi">';
    if (window.KA_BOLIM && window.KA_BOLIM.okImg(r)) return window.KA_BOLIM.img(r, "ka-qimg");
    return window.kaAvto ? window.kaAvto.img(r) : "";
  }

  window.KA_MAVZU = { TOPICS: TOPICS, GROUPS: GROUPS, FANS: FANS, TITLE: TITLE, OZ_G: OZ_G, BZ_G: BZ_G, files: files, prep: prep, img: img, refreshOwn: refreshOwn, register: register,
    isOpen: isOpen, bankQ: bankQ, math: math };
  refreshOwn();
  // boshqa varaqda (viktorinada) savol qo'shilsa — darhol shu yerda ham
  window.addEventListener("storage", function (e) { if (e.key === LS_OWN || e.key === LS_TESTS) refreshOwn(); });
})();
