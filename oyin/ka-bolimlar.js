/*!
 * Kuvonch Academy — 🔌 Bo'limlar → viktorina avtomatik ulagichi (ka-bolimlar.js)
 *
 * Saytdagi alohida fan bo'limlari («Ibrohim tarix», «10-sinf tarbiya», «Umida huquq» …) savollarini
 * viktorina va barcha sinf o'yinlariga (Arqon, Kartalar, Sirli kataklar, Shoh savol, Oltin sandiq, Mol ur,
 * Moslashtir, Omad g'ildiragi) o'zi ulaydi: har bo'lim — alohida fan tugmasi, har mavzu (§) — alohida mavzu.
 *
 * ➕ YANGI FAN QO'SHISH — faqat MANIFEST ga bitta qator:
 *   k     — fan kaliti (faqat kichik lotin harflari): viktorina.html?fan=<k>
 *   nom   — fan tugmasi nomi (emoji bilan)
 *   guruh — mavzular ro'yxatidagi sarlavha
 *   p     — mavzu ID prefiksi (2 harf, boshqa fanlarnikiga o'xshamasin): mavzu ID = p + bo'lim ichidagi id
 *   g     — data fayllari to'ldiradigan global massiv nomi (IT_DATA, T10 …)
 *   f     — data fayllari (tartib bilan)
 *   img   — qisqa rasm nomi uchun papka ("t10-img/" → img:"p9a" = t10-img/p9a.jpg); to'liq yo'l bo'lsa o'zi ishlatiladi
 *   sahifa — bo'lim sahifasi
 * Keyin `node tools/bolimlar.js` (yoki GitHub Actions «Bo'limlar → viktorina» o'zi) INDEX ni yangilaydi.
 *
 * Data formati (har bo'lim): {id, n:"1-§", t:"Mavzu nomi", q:[ savollar ]}
 *   {t:"m",  q, a:[to'g'ri, xato, xato, xato], e:"izoh", img?}   — variantli
 *   {t:"tf", q, a:true|false, e}                                   — to'g'ri/noto'g'ri
 *   {t:"o",  q, a:[to'g'ri tartibda…], e}                          — tartiblash → variantli savolga aylanadi
 *   {t:"f",  q, e}                                                 — ochiq (og'zaki) savol: viktorinaga qo'shilmaydi
 * Savollar ma'lumoti faqat kerak bo'lganda (mavzu tanlanib, savollar tayyorlanayotganda) yuklanadi. ES5.
 */
(function () {
  "use strict";
  if (window.KA_BOLIM) return;

  var MANIFEST = /*MANIFEST*/[
    {"k": "ibrohim", "nom": "📜 Ibrohim tarix", "guruh": "📜 Ibrohim tarix — 6-sinf «Qadimgi dunyo tarixi» + umumiy bilim", "p": "it", "g": "IT_DATA", "f": ["ibrohim-tarix-1.js", "ibrohim-tarix-2.js", "ibrohim-tarix-3.js", "ibrohim-tarix-4.js", "ibrohim-tarix-bilim.js"], "img": "it-img/", "sahifa": "ibrohim-tarix.html"},
    {"k": "sinftarbiya", "nom": "🤝 10-sinf tarbiya", "guruh": "🤝 10-sinf Tarbiya — «Baxt va muvaffaqiyat sirlari»", "p": "tv", "g": "T10", "f": ["tarbiya-10-1.js", "tarbiya-10-2.js"], "img": "t10-img/", "sahifa": "tarbiya-10.html"},
    {"k": "tarbiyaa", "nom": "🤝 1-sinf tarbiya", "guruh": "🤝 1-sinf Tarbiya", "p": "tra", "g": "T1", "f": ["tarbiya-1-1.js"], "sahifa": "tarbiya-1.html"},
    {"k": "tarbiyac", "nom": "🤝 3-sinf tarbiya", "guruh": "🤝 3-sinf Tarbiya", "p": "trc", "g": "T3", "f": ["tarbiya-3-1.js"], "sahifa": "tarbiya-3.html"},
    {"k": "tarbiyae", "nom": "🤝 5-sinf tarbiya", "guruh": "🤝 5-sinf Tarbiya", "p": "tre", "g": "T5", "f": ["tarbiya-5-1.js"], "sahifa": "tarbiya-5.html"},
    {"k": "tarbiyaf", "nom": "🤝 6-sinf tarbiya", "guruh": "🤝 6-sinf Tarbiya", "p": "trf", "g": "T6", "f": ["tarbiya-6-1.js"], "sahifa": "tarbiya-6.html"},
    {"k": "tarbiyag", "nom": "🤝 7-sinf tarbiya", "guruh": "🤝 7-sinf Tarbiya", "p": "trg", "g": "T7", "f": ["tarbiya-7-1.js"], "sahifa": "tarbiya-7.html"},
    {"k": "tarbiyah", "nom": "🤝 8-sinf tarbiya", "guruh": "🤝 8-sinf Tarbiya", "p": "trh", "g": "T8", "f": ["tarbiya-8-1.js"], "sahifa": "tarbiya-8.html"},
    {"k": "tarbiyak", "nom": "🤝 11-sinf tarbiya", "guruh": "🤝 11-sinf Tarbiya", "p": "trk", "g": "T11", "f": ["tarbiya-11-1.js"], "sahifa": "tarbiya-11.html"},
    {"k": "umidahuquq", "nom": "⚖️ Umida huquq", "guruh": "⚖️ Umida huquq — 8-sinf «Davlat va huquq asoslari»", "p": "uh", "g": "T10", "f": ["umida-huquq-1.js", "umida-huquq-2.js"], "img": "uh-img/", "sahifa": "umida-huquq.html"}
  ]/*MANIFEST-END*/;

  // AVTOMATIK — tools/bolimlar.js yozadi (qo'lda tahrirlamang): {k: [[mavzuId, nom, savollarSoni], …]}
  var INDEX = /*INDEX*/{
    "ibrohim": [
      ["itp1","Ibrohim tarix · 1-§ Qadimgi tarix ildizlari",8],
      ["itp2","Ibrohim tarix · 2-§ Eng qadimgi odamlarning rivojlanish bosqichlari",9],
      ["itp3","Ibrohim tarix · 3-§ Urug‘chilik jamiyati",9],
      ["itp4","Ibrohim tarix · 4-§ Eneolit va bronza davri",9],
      ["itp5","Ibrohim tarix · 5-§ O‘rta Osiyo temir asriga o‘tish davrida",8],
      ["itp6","Ibrohim tarix · 6-§ Nil vodiysi va uning aholisi",8],
      ["itp7","Ibrohim tarix · 7-§ Qadimgi Misr va qo‘shni davlatlar",7],
      ["itp8","Ibrohim tarix · 8-§ Qadimgi Misrda din",7],
      ["itp9","Ibrohim tarix · 9-§ Piramidalar va daxmalar",9],
      ["itp10","Ibrohim tarix · 10-§ Qadimgi Misr madaniyati",9],
      ["itp11","Ibrohim tarix · 11-§ Mesopotamiya sivilizatsiyalari",9],
      ["itp12","Ibrohim tarix · 12-§ Bobil podsholigi",8],
      ["itp13","Ibrohim tarix · 13-§ Old Osiyo davlatlari",8],
      ["itp14","Ibrohim tarix · 14-§ Ahamoniylar davlati",8],
      ["itp15","Ibrohim tarix · 15-§ Qadimgi Hindistondagi ilk sivilizatsiya",8],
      ["itp16","Ibrohim tarix · 16-§ Qadimgi Hindiston madaniyati",8],
      ["itp17","Ibrohim tarix · 17-§ Qadimgi Xitoy sivilizatsiyalari",8],
      ["itp18","Ibrohim tarix · 18-§ Miloddan avvalgi III asrda Xitoy",7],
      ["itp19","Ibrohim tarix · 19–20-§ O‘zbekiston hududidagi qadimiy davlatlar",9],
      ["itp21","Ibrohim tarix · 21-§ Zardushtiylik va «Avesto»",8],
      ["itp22","Ibrohim tarix · 22-§ Antik tarixning boshlanishi",7],
      ["itp23","Ibrohim tarix · 23–24-§ Qadimgi Yunonistonning yuksalishi",9],
      ["itp25","Ibrohim tarix · 25-§ Yunon koloniyalari",6],
      ["itp26","Ibrohim tarix · 26-§ Afinada demokratiya",9],
      ["itp27","Ibrohim tarix · 27–28-§ Yunon-fors urushlari. Makedoniyaning Yunonistonni bosib olishi",10],
      ["itp29","Ibrohim tarix · 29-§ Yunon fuqarolari tarbiyasi",8],
      ["itp30","Ibrohim tarix · 30-§ Qadimgi Yunoniston madaniyati",9],
      ["itp31","Ibrohim tarix · 31-§ Qadimgi Yunoniston olimlari va mutafakkirlari",7],
      ["itp32","Ibrohim tarix · 32-§ Qadimgi Yunoniston afsonalari",7],
      ["itp33","Ibrohim tarix · 33–34-§ Ahamoniylarning O‘rta Osiyoga bosqinchilik yurishlari",10],
      ["itp35","Ibrohim tarix · 35–36-§ O‘rta Osiyo aholisining yunon-makedon istilochilariga qarshi kurashi",10],
      ["itp37","Ibrohim tarix · 37-§ Salavkiylar davlati va Yunon-Baqtriya podsholigi",9],
      ["itp38","Ibrohim tarix · 38–39-§ Qadimgi Xorazm",10],
      ["itp40","Ibrohim tarix · 40-§ Qadimgi Qang‘ va Davan davlatlari",10],
      ["itp41","Ibrohim tarix · 41-§ Kushon davlati",9],
      ["itp42","Ibrohim tarix · 42-§ Buyuk ipak yo‘li",8],
      ["itp43","Ibrohim tarix · 43-§ Qadimgi Italiya va uning aholisi",7],
      ["itp44","Ibrohim tarix · 44-§ Rim respublikasi",9],
      ["itp45","Ibrohim tarix · 45-§ Rim respublikasida hayot",9],
      ["itp46","Ibrohim tarix · 46-§ Qullar va gladiatorlar",8],
      ["itp47","Ibrohim tarix · 47-§ Rim respublikasining qulashi",8],
      ["itp48","Ibrohim tarix · 48-§ G‘arbiy Rim imperiyasining tanazzuli va halokati",8],
      ["itp49","Ibrohim tarix · 49–50-§ Qadimgi Rim madaniyati",9],
      ["itb1","Ibrohim tarix · ★ Davlat bayroqlari",43],
      ["itb2","Ibrohim tarix · ★ Poytaxtlar",56],
      ["itb3","Ibrohim tarix · ★ Pul birliklari",47],
      ["itb4","Ibrohim tarix · ★ O‘simliklar vatani",33],
      ["itb5","Ibrohim tarix · ★ Ixtirolar vatani",25],
      ["itb6","Ibrohim tarix · ★ Eng baland binolar",13],
      ["itb7","Ibrohim tarix · ★ Avtomobillar",30],
      ["itb8","Ibrohim tarix · ★ Ekskavator va texnikalar",24],
      ["itb9","Ibrohim tarix · ★ Hayvonlar",36],
      ["itb10","Ibrohim tarix · ★ Mevalar",19],
      ["itb11","Ibrohim tarix · ★ Poliz ekinlari",11]
    ],
    "sinftarbiya": [
      ["tvm1","10-sinf tarbiya · 1-mavzu Vatan yagona",10],
      ["tvm2","10-sinf tarbiya · 2–3-mavzu Oila – Vatan ichra Vatan",11],
      ["tvm3","10-sinf tarbiya · 4–5-mavzu Oila – baxt qo‘rg‘oni",10],
      ["tvm4","10-sinf tarbiya · 6–7-mavzu Oiladagi burch va mas’uliyat",10],
      ["tvm5","10-sinf tarbiya · 8-mavzu Baxt manzillari",10],
      ["tvm6","10-sinf tarbiya · 9-mavzu Mahalla – qadriyatlar beshigi",10],
      ["tvm7","10-sinf tarbiya · 10-mavzu Jamiyatning ma’naviy asoslari",10],
      ["tvm8","10-sinf tarbiya · 11–12-mavzu Din va madaniyat",11],
      ["tvm9","10-sinf tarbiya · 13–14-mavzu Dunyo dinlarida insonparvarlik g‘oyalari",11],
      ["tvm10","10-sinf tarbiya · 15-mavzu Eng katta meros",10],
      ["tvm11","10-sinf tarbiya · 16–17-mavzu Buzg‘unchi g‘oyalar",10],
      ["tvm12","10-sinf tarbiya · 18–19-mavzu Jaholatga qarshi ma’rifat",10],
      ["tvm13","10-sinf tarbiya · 20-mavzu Xavfsiz media ummoni",10],
      ["tvm14","10-sinf tarbiya · 21-mavzu Soxta xabarlar ortida nima bor?",10],
      ["tvm15","10-sinf tarbiya · 22-mavzu Baxtli hayot poydevori",10],
      ["tvm16","10-sinf tarbiya · 23–24-mavzu Iste’mol va tadbirkorlik madaniyati",10],
      ["tvm17","10-sinf tarbiya · 25–26-mavzu Kasb tanlash sirlari",11],
      ["tvm18","10-sinf tarbiya · 27–28-mavzu O‘rganishdan to‘xtamang",10],
      ["tvm19","10-sinf tarbiya · 29–30-mavzu Iroda",11]
    ],
    "tarbiyaa": [
      ["tram1","1-sinf tarbiya · 1-mavzu Men yashaydigan O‘zbekiston",8],
      ["tram2","1-sinf tarbiya · 2-mavzu Men kimman?",8],
      ["tram3","1-sinf tarbiya · 3–4-mavzu Maktabga sayohat",8],
      ["tram4","1-sinf tarbiya · 5–6-mavzu Maktabim — ikkinchi uyim",8],
      ["tram5","1-sinf tarbiya · 7-mavzu Uydan maktabgacha yo‘l",8],
      ["tram6","1-sinf tarbiya · 8-mavzu Biz ahil jamoamiz",8],
      ["tram7","1-sinf tarbiya · 9-mavzu Mustahkamlash: Maktabim va men",8],
      ["tram8","1-sinf tarbiya · 10–11-mavzu So‘zlashish odobi",8],
      ["tram9","1-sinf tarbiya · 12–13-mavzu O‘zaro yordam",8],
      ["tram10","1-sinf tarbiya · 14–15-mavzu Minnatdorlik",8],
      ["tram11","1-sinf tarbiya · 16-mavzu Mustahkamlash: Men va do‘stlarim",8],
      ["tram12","1-sinf tarbiya · 17–18-mavzu Ishonch nima?",8],
      ["tram13","1-sinf tarbiya · 19–20-mavzu Men mustaqil bo‘laman",8],
      ["tram14","1-sinf tarbiya · 21–22-mavzu Halollik",8],
      ["tram15","1-sinf tarbiya · 23–24-mavzu Asrab-avaylaymiz",8],
      ["tram16","1-sinf tarbiya · 25-mavzu Mustahkamlash: Men va fazilatlarim",8],
      ["tram17","1-sinf tarbiya · 26–27-mavzu Mening xatti-harakatlarim",8],
      ["tram18","1-sinf tarbiya · 28–29-mavzu Mehmondorchilik odobi",8],
      ["tram19","1-sinf tarbiya · 30–31-mavzu Bag‘rikeng yurtim",8],
      ["tram20","1-sinf tarbiya · 32-mavzu Mustahkamlash: Bizning madaniyatimiz",8],
      ["tram21","1-sinf tarbiya · 33-mavzu Yakuniy dars",8]
    ],
    "tarbiyac": [
      ["trcm1","3-sinf tarbiya · 1-mavzu Vatanim haqida nimalarni bilaman?",9],
      ["trcm2","3-sinf tarbiya · 2-mavzu O‘zbekiston xalqi — Vatanimiz faxri",9],
      ["trcm3","3-sinf tarbiya · 3-mavzu Men yashayotgan olam",9],
      ["trcm4","3-sinf tarbiya · 4-mavzu Sayyoramizga nimalar xavf solmoqda?",9],
      ["trcm5","3-sinf tarbiya · 5-mavzu Biz qanday dunyoda yashashni istaymiz?",9],
      ["trcm6","3-sinf tarbiya · 6-mavzu Tenglik nima?",9],
      ["trcm7","3-sinf tarbiya · 7-mavzu Kamsitish nima?",9],
      ["trcm8","3-sinf tarbiya · 8-mavzu Sinfdagi muhit",9],
      ["trcm9","3-sinf tarbiya · 9-mavzu Volontyorlik",9],
      ["trcm10","3-sinf tarbiya · 10-mavzu Men hayotni sevaman!",9],
      ["trcm11","3-sinf tarbiya · 11-mavzu His-tuyg‘ularimiz",9],
      ["trcm12","3-sinf tarbiya · 12-mavzu Mening odatlarim",9],
      ["trcm13","3-sinf tarbiya · 13-mavzu Mening sog‘lig‘im",9],
      ["trcm14","3-sinf tarbiya · 14-mavzu O‘zimni boshqaraman",9],
      ["trcm15","3-sinf tarbiya · 15-mavzu An’analar — xalq xotirasidir",9],
      ["trcm16","3-sinf tarbiya · 16-mavzu O‘zbekiston xalqlari madaniyati",9],
      ["trcm17","3-sinf tarbiya · 17-mavzu O‘zbekiston shaharlari",9],
      ["trcm18","3-sinf tarbiya · 18-mavzu Muzeylar — moziy ko‘zgusi",9],
      ["trcm19","3-sinf tarbiya · 19-mavzu O‘zbekiston bo‘ylab sayohat",9]
    ],
    "tarbiyae": [
      ["trem1","5-sinf tarbiya · 1–2-mavzu Vatanga muhabbat",11],
      ["trem2","5-sinf tarbiya · 3–4-mavzu Biz o‘z xatti-harakatlarimiz uchun javobgarmiz",11],
      ["trem3","5-sinf tarbiya · 5–6-mavzu Insonning huquq va majburiyatlari",11],
      ["trem4","5-sinf tarbiya · 7–8-mavzu Ona tabiatni asrash – bizning burchimiz",11],
      ["trem5","5-sinf tarbiya · 9-mavzu Bir-birimizni tushunishni o‘rganamiz",11],
      ["trem6","5-sinf tarbiya · 10-mavzu Mehr qadri",11],
      ["trem7","5-sinf tarbiya · 11-mavzu Ezgu orzular ro‘yobi",11],
      ["trem8","5-sinf tarbiya · 12-mavzu Maqsadim – mening ishtiyoqim",11],
      ["trem9","5-sinf tarbiya · 13–14-mavzu Har bir inson hurmatga loyiq",11],
      ["trem10","5-sinf tarbiya · 15-mavzu O‘zgalarga yordam berib, o‘zingda insoniylikni kashf et",11],
      ["trem11","5-sinf tarbiya · 16-mavzu Hamkorlik – muvaffaqiyat garovi",11],
      ["trem12","5-sinf tarbiya · 17–18-mavzu Jonivorlarga g‘amxo‘rlik qilish",11],
      ["trem13","5-sinf tarbiya · 19–20-mavzu Xulq-atvor qoidalari – hayot tarzi",11],
      ["trem14","5-sinf tarbiya · 21–22-mavzu Sog‘lig‘imiz – boyligimiz",11],
      ["trem15","5-sinf tarbiya · 23–24-mavzu Xotira – abadiy, qadr – muqaddas",11],
      ["trem16","5-sinf tarbiya · 25–26-mavzu Merosimiz – faxrimiz",11],
      ["trem17","5-sinf tarbiya · 27–28-mavzu Milliy an’ana va qadriyatlarimiz",11],
      ["trem18","5-sinf tarbiya · 29-mavzu Kitoblarda olam sirlari",11]
    ],
    "tarbiyaf": [
      ["trfm1","6-sinf tarbiya · 1–2-mavzu Men «oltin qoida» bo‘yicha yashayman",11],
      ["trfm2","6-sinf tarbiya · 3–4-mavzu Rostgo‘ylik va burchni his etib yashash",11],
      ["trfm3","6-sinf tarbiya · 5-mavzu Adolat – hayot haqiqati",11],
      ["trfm4","6-sinf tarbiya · 6–7-mavzu Minnatdorlik yuragimda yashaydi",11],
      ["trfm5","6-sinf tarbiya · 8-mavzu Kechirimlilik kuchlilar xislatidir",11],
      ["trfm6","6-sinf tarbiya · 9-mavzu Sabr-toqatlilik",11],
      ["trfm7","6-sinf tarbiya · 10-mavzu Ona yurtim – oltin beshigim",11],
      ["trfm8","6-sinf tarbiya · 11–12-mavzu Mening mahallam – mening faxrim",11],
      ["trfm9","6-sinf tarbiya · 13–14-mavzu Xatti-harakat qanday bo‘lsa, oqibat ham shunday bo‘ladi",11],
      ["trfm10","6-sinf tarbiya · 15–16-mavzu Bilim ol, kasb-hunar tanla!",11],
      ["trfm11","6-sinf tarbiya · 17–18-mavzu Zamonaviy texnologiyalar ezgulik xizmatida",11],
      ["trfm12","6-sinf tarbiya · 19–20-mavzu Salomatlik – ulkan boylik",11],
      ["trfm13","6-sinf tarbiya · 21–22-mavzu Do‘stlik va mehr-oqibat",11],
      ["trfm14","6-sinf tarbiya · 23–24-mavzu Rostgo‘ylik va halollik",11],
      ["trfm15","6-sinf tarbiya · 25-mavzu Ishonchli va ishonchsiz axborotlar",11],
      ["trfm16","6-sinf tarbiya · 26–27-mavzu Oila – qadriyatlar beshigi",11],
      ["trfm17","6-sinf tarbiya · 28–29-mavzu Oilaviy kitobxonlik",11],
      ["trfm18","6-sinf tarbiya · 30-mavzu To‘g‘ri ovqatlanish qoidalari",11],
      ["trfm19","6-sinf tarbiya · 31–32-mavzu Ekologik xavflar",11]
    ],
    "tarbiyag": [
      ["trgm1","7-sinf tarbiya · 1-mavzu Inson – ezgulik ijodkori",11],
      ["trgm2","7-sinf tarbiya · 2-mavzu Oliy maqsadlar bilan yashash",11],
      ["trgm3","7-sinf tarbiya · 3-mavzu Muvaffaqiyat – qunt va qat’iyat natijasi",11],
      ["trgm4","7-sinf tarbiya · 4–5-mavzu Umr-umid-sinov-imkoniyat",11],
      ["trgm5","7-sinf tarbiya · 6-mavzu Tabiatni asrash – hayotni asrash",11],
      ["trgm6","7-sinf tarbiya · 7-mavzu Inson axloqi bilan go‘zal",11],
      ["trgm7","7-sinf tarbiya · 8-mavzu Inson odobida aks etuvchi fe’l-atvor",11],
      ["trgm8","7-sinf tarbiya · 9-mavzu Insonlarni birlashtiruvchi umuminsoniy xislatlar",11],
      ["trgm9","7-sinf tarbiya · 10–11-mavzu Baxtiyor hayotning ustunlari",11],
      ["trgm10","7-sinf tarbiya · 12-mavzu Hammasi o‘z qo‘limizda",11],
      ["trgm11","7-sinf tarbiya · 13-mavzu Inson umri ...",11],
      ["trgm12","7-sinf tarbiya · 14-mavzu Ogohlik",11],
      ["trgm13","7-sinf tarbiya · 15–16-mavzu Ko‘zga ko‘rinmas xatarlar",11],
      ["trgm14","7-sinf tarbiya · 17–18-mavzu «Men qanday insonman?»",11],
      ["trgm15","7-sinf tarbiya · 19-mavzu Muomala uchun zarur odoblar",11],
      ["trgm16","7-sinf tarbiya · 20-mavzu Kommunikativlik – muvaffaqiyat kaliti",11],
      ["trgm17","7-sinf tarbiya · 21–22-mavzu Samarali muloqot sirlari",11],
      ["trgm18","7-sinf tarbiya · 23–24-mavzu Farzand – oila ko‘zgusi",11],
      ["trgm19","7-sinf tarbiya · 25-mavzu Avval tinglashni o‘rganing",11],
      ["trgm20","7-sinf tarbiya · 26-mavzu Harakat qilmagan baxtga yetolmas",11],
      ["trgm21","7-sinf tarbiya · 27–28-mavzu Yaxshilik yo‘lida hamkorlik",11],
      ["trgm22","7-sinf tarbiya · 29-mavzu Do‘stlik",11],
      ["trgm23","7-sinf tarbiya · 30-mavzu Insoniylik – xalqimizning eng buyuk fazilati",11],
      ["trgm24","7-sinf tarbiya · 31-mavzu Bag‘rikenglik – tinchlik va totuvlik sari muhim qadam",11],
      ["trgm25","7-sinf tarbiya · 32-mavzu Daxldorlik",11],
      ["trgm26","7-sinf tarbiya · 33-mavzu Mahallamiz farovonligi – bizning farovonligimiz",11]
    ],
    "tarbiyah": [
      ["trhm1","8-sinf tarbiya · 1-mavzu Iftixorimsan – jannatmakon O‘zbekiston!",11],
      ["trhm2","8-sinf tarbiya · 2-mavzu Millatlararo hamjihatlik",11],
      ["trhm3","8-sinf tarbiya · 3-mavzu Har bir farzand – Vatan himoyachisi",11],
      ["trhm4","8-sinf tarbiya · 4-mavzu Hayotda o‘z istaklarimizni anglash",11],
      ["trhm5","8-sinf tarbiya · 5-mavzu Qat’iy fe’l-atvorning muhimligi",11],
      ["trhm6","8-sinf tarbiya · 6-mavzu Qiyin vaziyatda hissiyotlarni boshqarish",11],
      ["trhm7","8-sinf tarbiya · 7-mavzu Hayot – ulug‘ ne’mat",11],
      ["trhm8","8-sinf tarbiya · 8-mavzu Tushkunlik va besaranjomlikni boshqarish",11],
      ["trhm9","8-sinf tarbiya · 9-mavzu Mashaqqatlarni yengib o‘tish",11],
      ["trhm10","8-sinf tarbiya · 10-mavzu Tanqid va tanqidiy fikrlashning muhimligi",11],
      ["trhm11","8-sinf tarbiya · 11-mavzu Fan-texnika taraqqiyoti va inson ma’naviyati",11],
      ["trhm12","8-sinf tarbiya · 12-mavzu Ilm va zakovat",11],
      ["trhm13","8-sinf tarbiya · 13-mavzu Til bilishning ahamiyati",11],
      ["trhm14","8-sinf tarbiya · 14-mavzu Vaqt – oliy ne’mat",11],
      ["trhm15","8-sinf tarbiya · 15-mavzu Go‘zal tarbiya tamoyillari",11],
      ["trhm16","8-sinf tarbiya · 16-mavzu Tabiat va inson",11],
      ["trhm17","8-sinf tarbiya · 17-mavzu Tejamkorlik – farovonlik garovi",11],
      ["trhm18","8-sinf tarbiya · 18-mavzu Xotira va qadriyat",11]
    ],
    "tarbiyak": [
      ["trkm1","11-sinf tarbiya · 1-mavzu Vatan taraqqiyotiga men ham mas’ulman",11],
      ["trkm2","11-sinf tarbiya · 2-mavzu Erkin va farovon hayot mazmuni",11],
      ["trkm3","11-sinf tarbiya · 3–4-mavzu Dadil qadamlar bilan katta hayot sari",11],
      ["trkm4","11-sinf tarbiya · 5-mavzu Oila mas’uliyati, sha’ni va qadri",11],
      ["trkm5","11-sinf tarbiya · 6-mavzu Ibrat maskani",11],
      ["trkm6","11-sinf tarbiya · 7-mavzu Bag‘rikenglik",11],
      ["trkm7","11-sinf tarbiya · 8–9-mavzu Ksenofobiya",11],
      ["trkm8","11-sinf tarbiya · 10–11-mavzu Missionerlik – yoshlar kelajagiga tahdid",11],
      ["trkm9","11-sinf tarbiya · 12–13-mavzu Kibermakonda axborot iste’moli madaniyati",11],
      ["trkm10","11-sinf tarbiya · 14–15-mavzu Dunyo dinlarida tinchlik g‘oyasi",11],
      ["trkm11","11-sinf tarbiya · 16–17-mavzu Tuyg‘ularning xilmaxilligi",11],
      ["trkm12","11-sinf tarbiya · 18-mavzu Nafosat va ma’naviyat",11],
      ["trkm13","11-sinf tarbiya · 19–20-mavzu Surat va siyrat",11],
      ["trkm14","11-sinf tarbiya · 21–22-mavzu Etiket",11],
      ["trkm15","11-sinf tarbiya · 23–24-mavzu Renessans poydevori",11],
      ["trkm16","11-sinf tarbiya · 25–26-mavzu Halollik vaksinasi",11],
      ["trkm17","11-sinf tarbiya · 27–28-mavzu Havas qil va oldinga intil",11],
      ["trkm18","11-sinf tarbiya · 29-mavzu Mehnatidan qadr topganlar",11],
      ["trkm19","11-sinf tarbiya · 30-mavzu Men tanlagan yo‘l",11]
    ],
    "umidahuquq": [
      ["uhd1","Umida huquq · 1–2-dars Shaxs",10],
      ["uhd2","Umida huquq · 3-dars Jamiyat",10],
      ["uhd3","Umida huquq · 4–5-dars Davlat",10],
      ["uhd4","Umida huquq · 6-dars Davlat funksiyasi",9],
      ["uhd5","Umida huquq · 7–8-dars Davlat shakllari",11],
      ["uhd6","Umida huquq · 10-dars Axloq va huquq",10],
      ["uhd7","Umida huquq · 11–12-dars Huquq manbalari",10],
      ["uhd8","Umida huquq · 13-dars Huquq normasi",10],
      ["uhd9","Umida huquq · 14-dars Huquq tarmoqlari",10],
      ["uhd10","Umida huquq · 15-dars Huquqiy munosabatlar",10],
      ["uhd11","Umida huquq · 17–18-dars Huquqiy xulq-atvor",10],
      ["uhd12","Umida huquq · 19–20-dars Huquqbuzarlik",11],
      ["uhd13","Umida huquq · 21–22-dars Yuridik javobgarlik",10],
      ["uhd14","Umida huquq · 23–24-dars Javobgarlik oqibatlari",10],
      ["uhd15","Umida huquq · 27-dars Fuqarolik qonunchiligida voyaga yetmaganlar",10],
      ["uhd16","Umida huquq · 28-dars Jinoyat qonunchiligida voyaga yetmaganlar",10],
      ["uhd17","Umida huquq · 29–30-dars Voyaga yetmaganlarning javobgarligi",10],
      ["uhd18","Umida huquq · 31–32-dars Oila qonunchiligida voyaga yetmaganlar",10],
      ["uhd19","Umida huquq · 33-dars Mehnat qonunchiligida voyaga yetmaganlar",11]
    ]
  }/*INDEX-END*/;

  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var V = "?v=20261125a";
  var BY_ID = {}, SEC = {};
  MANIFEST.forEach(function (m) { SEC[m.k] = m; (INDEX[m.k] || []).forEach(function (t) { BY_ID[t[0]] = m.k; }); });

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---- katalogga qo'shish: TOPICS [[id, nom, guruh]], GROUPS [nom], FANS [[kalit, nom, [guruhlar]]] ---- */
  function apply(TOPICS, GROUPS, FANS) {
    if (!TOPICS || TOPICS.__kaBolim) return;
    TOPICS.__kaBolim = 1;
    MANIFEST.forEach(function (m) {
      var list = INDEX[m.k]; if (!list || !list.length) return;
      var gi = GROUPS.length; GROUPS.push(m.guruh || m.nom);
      FANS.push([m.k, m.nom, [gi]]);
      list.forEach(function (t) { TOPICS.push([t[0], t[1], gi]); });
    });
  }

  /* ---- savolni viktorina formatiga: {q, a, w, steps, r} ---- */
  function imgOf(m, s) {
    if (!s) return null; s = String(s);
    if (/^https:\/\//.test(s) || s.indexOf("/") > -1) return s;
    return (m.img || "") + s + (/\.(png|jpe?g|webp|svg)$/i.test(s) ? "" : ".jpg");
  }
  function perms(a) { // to'g'ri tartibdan farqli 3 ta tartib
    var key = a.join("¦"), out = [], seen = {}; seen[key] = 1;
    function add(b) { var k = b.join("¦"); if (!seen[k]) { seen[k] = 1; out.push(b); } }
    for (var i = 0; i + 1 < a.length && out.length < 2; i++) { var b = a.slice(); b[i] = a[i + 1]; b[i + 1] = a[i]; add(b); }
    add(a.slice().reverse());
    for (var t = 0; t < 30 && out.length < 3; t++) add(shuffle(a));
    return out.slice(0, 3);
  }
  function conv(m, x) {
    if (!x || !x.q) return null;
    var r = imgOf(m, x.img), st = x.e ? [esc(x.e)] : [];
    if (x.t === "m" && x.a && x.a.length >= 2) return { q: esc(x.q), a: esc(x.a[0]), w: x.a.slice(1).map(esc), steps: st, r: r };
    if (x.t === "tf" && typeof x.a === "boolean") { var o = ["✅ To'g'ri", "❌ Noto'g'ri"]; return { q: esc(x.q), a: x.a ? o[0] : o[1], w: [x.a ? o[1] : o[0]], steps: st, r: r }; }
    if (x.t === "o" && x.a && x.a.length >= 3) return { q: esc(x.q) + "<br><small>To'g'ri tartibni tanlang</small>", a: x.a.map(esc).join(" → "), w: perms(x.a).map(function (b) { return b.map(esc).join(" → "); }), steps: st, r: r };
    return null; // "f" — ochiq savol
  }
  // savollar soni (tools/bolimlar.js ham shuni ishlatadi)
  function count(m, it) { return (it.q || []).filter(function (x) { return !!conv(m, x); }).length; }

  /* ---- yuklash va kaSavol ga ro'yxatdan o'tkazish ---- */
  var DATA = {}, loading = {}, regd = {}, chain = Promise.resolve();
  function addJs(src) {
    return new Promise(function (ok) {
      var s = document.createElement("script"); s.src = BASE + src + V;
      s.onload = ok; s.onerror = ok; setTimeout(ok, 15000); document.head.appendChild(s);
    });
  }
  // bo'limlar ketma-ket yuklanadi: ikki bo'lim bitta global (T10) ishlatsa ham aralashmaydi
  function loadSec(k) {
    if (DATA[k]) return Promise.resolve();
    if (loading[k]) return loading[k];
    var m = SEC[k];
    return (loading[k] = chain = chain.then(function () {
      var prev = window[m.g]; window[m.g] = [];
      return m.f.reduce(function (p, f) { return p.then(function () { return addJs(f); }); }, Promise.resolve()).then(function () {
        DATA[k] = window[m.g] || [];
        if (prev === undefined) { try { delete window[m.g]; } catch (e) { window[m.g] = undefined; } } else window[m.g] = prev;
      });
    }));
  }
  function regSec(k) {
    var S = window.kaSavol, m = SEC[k]; if (regd[k] || !S || !S.register || !DATA[k]) return;
    regd[k] = 1;
    var want = {}; (INDEX[k] || []).forEach(function (t) { want[t[0]] = t[1]; });
    DATA[k].forEach(function (it) {
      var id = m.p + it.id; if (!want[id]) return;
      var qs = (it.q || []).filter(function (x) { return !!conv(m, x); }), n = qs.length; if (!n) return;
      // daraja: mavzu ichidagi o'rniga qarab (boshi — oson, oxiri — qiyin); ha/yo'q — oson, tartiblash — qiyin
      var pool = qs.map(function (x, i) { return { x: x, L: x.t === "tf" ? 1 : x.t === "o" ? 3 : 1 + Math.min(2, Math.floor(i * 3 / n)) }; });
      var rec = [];
      S.register(id, function (L) {
        L = L === 2 || L === 3 ? L : 1;
        var cand = [];
        for (var d = 0; d < 3 && !cand.length; d++) cand = pool.filter(function (o) { return Math.abs(o.L - L) === d && rec.indexOf(o) < 0; });
        if (!cand.length) cand = pool.filter(function (o) { return rec.indexOf(o) < 0; });
        if (!cand.length) { rec = []; cand = pool; }
        var o = cand[Math.floor(Math.random() * cand.length)];
        rec.push(o); if (rec.length > Math.min(24, n - 1)) rec.shift();
        return conv(m, o.x);
      }, want[id]);
    });
  }
  // ids berilsa — faqat o'shalar tegishli bo'limlar, berilmasa — hammasi
  function prep(ids) {
    var ks = [];
    if (ids) ids.forEach(function (id) { var k = BY_ID[id]; if (k && ks.indexOf(k) < 0) ks.push(k); });
    else ks = MANIFEST.map(function (m) { return m.k; }).filter(function (k) { return (INDEX[k] || []).length; });
    return Promise.all(ks.map(function (k) { return loadSec(k).then(function () { regSec(k); }); })).catch(function () {});
  }
  function done() { return MANIFEST.every(function (m) { return !(INDEX[m.k] || []).length || regd[m.k]; }); }
  function has(id) { return !!BY_ID[id]; }
  // savol rasmi: faqat saytdagi rasm papkalari va bayroqlar (flagcdn)
  function okImg(r) { return typeof r === "string" && /^(https:\/\/flagcdn\.com\/|[a-z0-9-]+-img\/)[\w\/.-]+\.(png|jpe?g|webp|svg)$/i.test(r); }
  function img(r, cls) { return okImg(r) ? '<img class="' + (cls || "qimg") + '" src="' + (/^https:/.test(r) ? r : BASE + r) + '" alt="Savol rasmi" loading="lazy">' : ""; }

  window.KA_BOLIM = { MANIFEST: MANIFEST, INDEX: INDEX, apply: apply, prep: prep, done: done, has: has, img: img, okImg: okImg, conv: conv, count: count };
})();
