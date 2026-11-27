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
 *   fmt   — boshqa formatli data: "quiz" (ingliz grammatikasi), "tasks" (rus tili darslari): {q, o:[variantlar], a:to'g'ri indeks, e}
 *           "sat", "sherlok", "ezop" — matnli savollar (avval matn, keyin savol)
 *   uzun  — 1 bo'lsa uzun matnli fan: faqat jonli viktorinada chiqadi (o'yin kataklariga matn sig'maydi)
 *
 * 🤖 AVTOMATIK: saytning bosh papkasidagi yangi sahifa yuqoridagi formatdagi data faylni ulasa, tools/bolimlar.js uni
 *    MANIFEST ga o'zi qo'shadi (qo'lda yozish shart emas). Qo'shilmasin desangiz sahifaga <!-- ka-bolim: yoq --> yozing.
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
    {"k": "onatilia", "nom": "📖 1-sinf ona tili", "guruh": "📖 1-sinf Ona tili", "p": "ona", "g": "OT1", "f": ["ona-tili-1-1.js", "ona-tili-1-2.js"], "sahifa": "ona-tili-1.html"},
    {"k": "oqisha", "nom": "📚 1-sinf o‘qish", "guruh": "📚 1-sinf O‘qish savodxonligi", "p": "oqi", "g": "OQ1", "f": ["oqish-1-1.js", "oqish-1-2.js"], "sahifa": "oqish-1.html"},
    {"k": "matematikaa", "nom": "🔢 1-sinf matematika", "guruh": "🔢 1-sinf Matematika", "p": "mta", "g": "M1", "f": ["matematika-1-1.js", "matematika-1-2.js"], "sahifa": "matematika-1.html"},
    {"k": "tabiiya", "nom": "🌿 1-sinf tabiiy fanlar", "guruh": "🌿 1-sinf Tabiiy fanlar", "p": "tfa", "g": "TF1", "f": ["tabiiy-fanlar-1-1.js", "tabiiy-fanlar-1-2.js"], "sahifa": "tabiiy-fanlar-1.html"},
    {"k": "inglizb", "nom": "🇬🇧 1-sinf ingliz tili", "guruh": "🇬🇧 1-sinf Ingliz tili", "p": "eng", "g": "EN1", "f": ["ingliz-tili-1-1.js", "ingliz-tili-1-2.js"], "sahifa": "ingliz-tili-1.html"},
    {"k": "informatikaa", "nom": "💻 1-sinf informatika", "guruh": "💻 1-sinf Informatika", "p": "ita", "g": "IT1", "f": ["informatika-1-1.js", "informatika-1-2.js"], "sahifa": "informatika-1.html"},
    {"k": "tarbiyaa", "nom": "🤝 1-sinf tarbiya", "guruh": "🤝 1-sinf Tarbiya", "p": "tra", "g": "T1", "f": ["tarbiya-1-1.js"], "sahifa": "tarbiya-1.html"},
    {"k": "tarbiyac", "nom": "🤝 3-sinf tarbiya", "guruh": "🤝 3-sinf Tarbiya", "p": "trc", "g": "T3", "f": ["tarbiya-3-1.js"], "sahifa": "tarbiya-3.html"},
    {"k": "tarbiyae", "nom": "🤝 5-sinf tarbiya", "guruh": "🤝 5-sinf Tarbiya", "p": "tre", "g": "T5", "f": ["tarbiya-5-1.js"], "sahifa": "tarbiya-5.html"},
    {"k": "tarbiyaf", "nom": "🤝 6-sinf tarbiya", "guruh": "🤝 6-sinf Tarbiya", "p": "trf", "g": "T6", "f": ["tarbiya-6-1.js"], "sahifa": "tarbiya-6.html"},
    {"k": "tarbiyag", "nom": "🤝 7-sinf tarbiya", "guruh": "🤝 7-sinf Tarbiya", "p": "trg", "g": "T7", "f": ["tarbiya-7-1.js"], "sahifa": "tarbiya-7.html"},
    {"k": "tarbiyah", "nom": "🤝 8-sinf tarbiya", "guruh": "🤝 8-sinf Tarbiya", "p": "trh", "g": "T8", "f": ["tarbiya-8-1.js"], "sahifa": "tarbiya-8.html"},
    {"k": "tarbiyai", "nom": "🤝 9-sinf tarbiya", "guruh": "🤝 9-sinf Tarbiya — «Baxt va muvaffaqiyat sirlari»", "p": "tri", "g": "T9", "f": ["tarbiya-9-1.js", "tarbiya-9-2.js", "tarbiya-9-3.js"], "img": "t9-img/", "sahifa": "tarbiya-9.html"},
    {"k": "tarbiyak", "nom": "🤝 11-sinf tarbiya", "guruh": "🤝 11-sinf Tarbiya", "p": "trk", "g": "T11", "f": ["tarbiya-11-1.js"], "sahifa": "tarbiya-11.html"},
    {"k": "umidahuquq", "nom": "⚖️ Umida huquq", "guruh": "⚖️ Umida huquq — 8-sinf «Davlat va huquq asoslari»", "p": "uh", "g": "T10", "f": ["umida-huquq-1.js", "umida-huquq-2.js"], "img": "uh-img/", "sahifa": "umida-huquq.html"},
    {"k": "grammatika", "nom": "📘 Ingliz grammatikasi", "guruh": "📘 Ingliz grammatikasi — 100 ta modul", "p": "eg", "g": "EN_GRAMMAR", "f": ["english/assets/grammar-data.js"], "sahifa": "english/grammatika.html", "fmt": "quiz"},
    {"k": "rusdars", "nom": "📗 Rus tili darslari", "guruh": "📗 Rus tili darslari (A0–C1)", "p": "rd", "g": "TETRAD_LESSONS", "f": ["rus-tili/assets/darslar-data.js", "rus-tili/assets/darslar-yuqori.js"], "sahifa": "rus-tili/darslar.html", "fmt": "tasks"},
    {"k": "satrw", "nom": "📖 SAT Reading & Writing", "guruh": "📖 SAT Reading & Writing — matnli savollar", "p": "satrw", "g": "SAT_RW", "f": ["sat-rw-data.js"], "sahifa": "sat-english.html", "fmt": "sat", "uzun": 1},
    {"k": "sherlok", "nom": "🔍 Sherlok ishlari", "guruh": "🔍 Sherlok ishlari — detektiv mantiq", "p": "shlk", "g": "SHERLOCK_ISHLAR", "f": ["sherlock-ishlar.js"], "sahifa": "sherlock.html", "fmt": "sherlok", "uzun": 1},
    {"k": "ezop", "nom": "🦊 Ezop masallari", "guruh": "🦊 Ezop masallari — mantiqiy savollar", "p": "ezp", "g": "EZOP_MASALLAR", "f": ["ezop-masallar.js"], "sahifa": "ezop-oyin.html", "fmt": "ezop", "uzun": 1}
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
    "onatilia": [
      ["onam1","1-sinf ona tili · 1-mavzu Ona tili nima?",8],
      ["onam2","1-sinf ona tili · 2-mavzu Matn va gap",8],
      ["onam3","1-sinf ona tili · 3-mavzu Til va nutq",8],
      ["onam4","1-sinf ona tili · 4-mavzu Tovush",8],
      ["onam5","1-sinf ona tili · 5-mavzu Harf",8],
      ["onam6","1-sinf ona tili · 6-mavzu O‘zbek alifbosi",8],
      ["onam7","1-sinf ona tili · 8-mavzu Unli tovushlar",8],
      ["onam8","1-sinf ona tili · 9-mavzu A va O unlilari",8],
      ["onam9","1-sinf ona tili · 10-mavzu I va U unlilari",8],
      ["onam10","1-sinf ona tili · 11-mavzu O‘ va E unlilari",8],
      ["onam11","1-sinf ona tili · 13-mavzu Undosh tovushlar",8],
      ["onam12","1-sinf ona tili · 14-mavzu X va H tovushlari",8],
      ["onam13","1-sinf ona tili · 15-mavzu J harfi va tovushi",8],
      ["onam14","1-sinf ona tili · 16-mavzu Q va G‘ tovushlari",8],
      ["onam15","1-sinf ona tili · 17-mavzu ng, sh, ch birikmalari",8],
      ["onam16","1-sinf ona tili · 18-mavzu Tutuq belgisi",8],
      ["onam17","1-sinf ona tili · 19–20-mavzu Aytilishi va yozilishi farqli undoshlar",8],
      ["onam18","1-sinf ona tili · 22-mavzu Bo‘g‘in nima?",8],
      ["onam19","1-sinf ona tili · 23-mavzu So‘zni bo‘g‘inga ajratish",8],
      ["onam20","1-sinf ona tili · 24–25-mavzu Bo‘g‘in ko‘chirish",8],
      ["onam21","1-sinf ona tili · 27-mavzu So‘z va uning ma’nosi",8],
      ["onam22","1-sinf ona tili · 28–29-mavzu Gap va uning tuzilishi",8],
      ["onam23","1-sinf ona tili · 30–31-mavzu Tinish belgilari",8],
      ["onam24","1-sinf ona tili · 32-mavzu Matn tuzish",8],
      ["onam25","1-sinf ona tili · 33-mavzu Shaxs va narsa nomlari",8],
      ["onam26","1-sinf ona tili · 34-mavzu Nima? Nimalar?",8],
      ["onam27","1-sinf ona tili · 35-mavzu Kim? Kimlar?",8],
      ["onam28","1-sinf ona tili · 36–37-mavzu Shaxs va narsa nomlarini aniqlash",8],
      ["onam29","1-sinf ona tili · 38-mavzu Xushmuomalalik so‘zlari",8],
      ["onam30","1-sinf ona tili · 39–40-mavzu Ism, familiya va sharif",8],
      ["onam31","1-sinf ona tili · 41-mavzu Joy nomlarining yozilishi",8],
      ["onam32","1-sinf ona tili · 42-mavzu Yurtimizdagi joy nomlari",8],
      ["onam33","1-sinf ona tili · 43–44-mavzu Hayvonlarga qo‘yilgan nomlar",8],
      ["onam34","1-sinf ona tili · 45-mavzu Bosh harfni takrorlaymiz",8],
      ["onam35","1-sinf ona tili · 46-mavzu Harakat bildiruvchi so‘zlar",8],
      ["onam36","1-sinf ona tili · 47-mavzu Harakat so‘zlarini aniqlash",8],
      ["onam37","1-sinf ona tili · 48-mavzu Nima qildi? Nima qiladi? Nima qilyapti?",8],
      ["onam38","1-sinf ona tili · 49-mavzu Belgi bildiruvchi so‘zlar",8],
      ["onam39","1-sinf ona tili · 50–52-mavzu Rang, ta’m, hajm va xususiyat",8],
      ["onam40","1-sinf ona tili · 53-mavzu Sanoq, miqdor va tartib",8],
      ["onam41","1-sinf ona tili · 54-mavzu -ta qo‘shimchasi va «nafar»",8],
      ["onam42","1-sinf ona tili · 55–56-mavzu Tartib bildiruvchi so‘zlar",8]
    ],
    "oqisha": [
      ["oqim1","1-sinf o‘qish · Kirish O‘qishni bilsang o‘zing",8],
      ["oqim2","1-sinf o‘qish · 2-dars Siz sevgan odamlar makoni",8],
      ["oqim3","1-sinf o‘qish · 3-dars O‘zbekiston — ozod diyor",8],
      ["oqim4","1-sinf o‘qish · 4-dars Vatan himoyachilari",8],
      ["oqim5","1-sinf o‘qish · 5-dars Yurt qalqonlari",8],
      ["oqim6","1-sinf o‘qish · 6-dars O‘zbekiston — jonajon yurtim",8],
      ["oqim7","1-sinf o‘qish · 7-dars Men — shu yurtning bo‘lagi",8],
      ["oqim8","1-sinf o‘qish · 1-dars O‘lkamda qish",8],
      ["oqim9","1-sinf o‘qish · 2-dars Kumush qish",8],
      ["oqim10","1-sinf o‘qish · 3-dars Rahmdil qizcha",8],
      ["oqim11","1-sinf o‘qish · 4-dars Qish faslining erkasi",8],
      ["oqim12","1-sinf o‘qish · 5–6-dars Qishda bo‘lgan voqealar",8],
      ["oqim13","1-sinf o‘qish · 1-dars Kitob — hammabop",8],
      ["oqim14","1-sinf o‘qish · 2-dars Qiziqarli mashg‘ulot",8],
      ["oqim15","1-sinf o‘qish · 3-dars Boshing to‘lsin aqlga",8],
      ["oqim16","1-sinf o‘qish · 4-dars Eng yaxshi sovg‘a",8],
      ["oqim17","1-sinf o‘qish · 5-dars Kitobsevar bobom",8],
      ["oqim18","1-sinf o‘qish · 6-dars Kitob — buyuk donishmand",8],
      ["oqim19","1-sinf o‘qish · 7-dars Kutubxona — nurxona",8],
      ["oqim20","1-sinf o‘qish · 8-dars Kitobni toza saqlang",8],
      ["oqim21","1-sinf o‘qish · 1-dars Salom senga, gulbahor",8],
      ["oqim22","1-sinf o‘qish · 2-dars Bahor ta’rifi",8],
      ["oqim23","1-sinf o‘qish · 3-dars Onajonim qo‘llari",8],
      ["oqim24","1-sinf o‘qish · 4-dars Uchib keladi qushlar",8],
      ["oqim25","1-sinf o‘qish · 5-dars Ko‘klamni boshlab kelding",8],
      ["oqim26","1-sinf o‘qish · 6–7-dars Bahorning taomi — sumalak",8],
      ["oqim27","1-sinf o‘qish · 8-dars Butun borliq seni der",8],
      ["oqim28","1-sinf o‘qish · 9-dars Xush kelibsan, Navro‘z",8],
      ["oqim29","1-sinf o‘qish · 1-dars Ajdodlar — bizning faxrimiz",8],
      ["oqim30","1-sinf o‘qish · 2-dars Sohibqiron Amir Temur",8],
      ["oqim31","1-sinf o‘qish · 3-dars Xabarni qanday jo‘natamiz?",8],
      ["oqim32","1-sinf o‘qish · 4-dars Yulduzlar siri",8],
      ["oqim33","1-sinf o‘qish · 5-dars Mirzo Ulug‘bek",8],
      ["oqim34","1-sinf o‘qish · 6-dars Koinotga parvoz",8],
      ["oqim35","1-sinf o‘qish · 7-dars Bobur va ona sabog‘i",8],
      ["oqim36","1-sinf o‘qish · 8-dars Suv tomchisining sayohati",8],
      ["oqim37","1-sinf o‘qish · 9-dars Ajoyib so‘zlar: qo‘llar",8],
      ["oqim38","1-sinf o‘qish · 1-dars Mehnat noni shirin",8],
      ["oqim39","1-sinf o‘qish · 2-dars Aql va boylik",8],
      ["oqim40","1-sinf o‘qish · 3-dars Zukko bo‘lgin, bolajon",8],
      ["oqim41","1-sinf o‘qish · 4-dars Harakatda barakat",8],
      ["oqim42","1-sinf o‘qish · 5-dars Boychechak qo‘shig‘i",8],
      ["oqim43","1-sinf o‘qish · 1-dars Odobning boshi — til",8],
      ["oqim44","1-sinf o‘qish · 2-dars Kiyinish odobi",8],
      ["oqim45","1-sinf o‘qish · 3-dars Odobli bola",8],
      ["oqim46","1-sinf o‘qish · 4-dars Rostgo‘ylik — inson ko‘rki",8],
      ["oqim47","1-sinf o‘qish · 5-dars Orastalik qanday soz",8],
      ["oqim48","1-sinf o‘qish · 6-dars Yomon odatlardan saqlaning",8],
      ["oqim49","1-sinf o‘qish · 7-dars Maqtanchoq bo‘lmang",8],
      ["oqim50","1-sinf o‘qish · 8-dars Vaqtdan unumli foydalaning",8],
      ["oqim51","1-sinf o‘qish · 9–10-dars Yaxshilik va axloq",8],
      ["oqim52","1-sinf o‘qish · 1-dars Yoz — naqadar soz",8],
      ["oqim53","1-sinf o‘qish · 2-dars Qo‘lni toza yuv!",8],
      ["oqim54","1-sinf o‘qish · 3-dars Quvnoq ta’til",8]
    ],
    "matematikaa": [
      ["mtam1","1-sinf matematika · 1–2-mavzu Narsalarning xossalari",8],
      ["mtam2","1-sinf matematika · 3, 5-mavzu Joylashuv va shakllar",8],
      ["mtam3","1-sinf matematika · 6–8-mavzu Vaqt, guruhlar va taqqoslash",8],
      ["mtam4","1-sinf matematika · 9–10, 14–19-mavzu 1 dan 5 gacha sonlar",8],
      ["mtam5","1-sinf matematika · 20–26-mavzu 0 va 6 dan 10 gacha sonlar",8],
      ["mtam6","1-sinf matematika · 11–12, 32–33-mavzu Qo‘shish va ayirish",8],
      ["mtam7","1-sinf matematika · 13, 27–29-mavzu Taqqoslash, juft va toq sonlar",8],
      ["mtam8","1-sinf matematika · 30–31-mavzu Nuqta va chiziqlar",8],
      ["mtam9","1-sinf matematika · 34–37-mavzu Noma’lumni topish",8],
      ["mtam10","1-sinf matematika · 38–41-mavzu Xossalar va ifodalar",8],
      ["mtam11","1-sinf matematika · 42–43-mavzu 11–20 sonlari va o‘nlik",8],
      ["mtam12","1-sinf matematika · 44–49-mavzu 11–20 sonlarini taqqoslash",8],
      ["mtam13","1-sinf matematika · 50–51-mavzu Qavslar",8],
      ["mtam14","1-sinf matematika · 52–54-mavzu O‘nlikdan o‘tib qo‘shish",8],
      ["mtam15","1-sinf matematika · 55–57-mavzu O‘nlikdan o‘tib ayirish",8],
      ["mtam16","1-sinf matematika · 58–62-mavzu Yaxlit va 100 gacha sonlar",8],
      ["mtam17","1-sinf matematika · 63–65-mavzu Ikki xonali sonlarni qo‘shish",8],
      ["mtam18","1-sinf matematika · 66–69-mavzu Ikki xonali sonlarni ayirish",8],
      ["mtam19","1-sinf matematika · 70–74-mavzu Guruhlash va tarkibli ifodalar",8],
      ["mtam20","1-sinf matematika · 1–5-dars Masala va uning tarkibi",8],
      ["mtam21","1-sinf matematika · 6–11-dars Butun va qismlar",8],
      ["mtam22","1-sinf matematika · 14–17-dars Orttirish va kamaytirish masalalari",8],
      ["mtam23","1-sinf matematika · 18–21-dars Taqqoslash masalalari",8],
      ["mtam24","1-sinf matematika · 22–26-dars Ikki amalli va murakkab masalalar",8],
      ["mtam25","1-sinf matematika · 30–34-dars Uzunlik: santimetr va detsimetr",8],
      ["mtam26","1-sinf matematika · 35–38-dars Massa va hajm",8],
      ["mtam27","1-sinf matematika · 39–42-dars Kattaliklar",8],
      ["mtam28","1-sinf matematika · 112–115-mavzu Kesma va siniq chiziq uzunligi",8],
      ["mtam29","1-sinf matematika · 116–118-mavzu Ko‘pburchak va perimetr",8],
      ["mtam30","1-sinf matematika · 119–122-mavzu To‘rtburchak, kvadrat va burchak",8],
      ["mtam31","1-sinf matematika · 123–128-mavzu Shakllar va simmetriya",8],
      ["mtam32","1-sinf matematika · 129–133-mavzu Tengliklar va ifodalar",8],
      ["mtam33","1-sinf matematika · 134–135-mavzu Amallar xossalari va tengsizliklar",8],
      ["mtam34","1-sinf matematika · 136-mavzu Rim raqamlari",8],
      ["mtam35","1-sinf matematika · 137–144-mavzu Tenglamalar",8]
    ],
    "tabiiya": [
      ["tfam1","1-sinf tabiiy fanlar · 1-mavzu O‘zim haqimda",8],
      ["tfam2","1-sinf tabiiy fanlar · 2-mavzu Maktabga yo‘l",8],
      ["tfam3","1-sinf tabiiy fanlar · 3-mavzu Sinfda nimalar bor?",8],
      ["tfam4","1-sinf tabiiy fanlar · 4-mavzu O‘simliklar olami",8],
      ["tfam5","1-sinf tabiiy fanlar · 5-mavzu Hayvonot olami",8],
      ["tfam6","1-sinf tabiiy fanlar · 6-mavzu O‘rmon va o‘tloq",8],
      ["tfam7","1-sinf tabiiy fanlar · 7-mavzu Hayvonot bog‘i",8],
      ["tfam8","1-sinf tabiiy fanlar · 8-mavzu Kuzda nimalar bo‘ladi?",8],
      ["tfam9","1-sinf tabiiy fanlar · 9-mavzu Vaqt va hafta",8],
      ["tfam10","1-sinf tabiiy fanlar · 10-mavzu Yil fasllari",8],
      ["tfam11","1-sinf tabiiy fanlar · 11-mavzu Tabiat qishga tayyorlanadi",8],
      ["tfam12","1-sinf tabiiy fanlar · 12-mavzu Qish hodisalari",8],
      ["tfam13","1-sinf tabiiy fanlar · 13-mavzu Suvning holatlari",8],
      ["tfam14","1-sinf tabiiy fanlar · 14-mavzu Tabiat hodisalari",8],
      ["tfam15","1-sinf tabiiy fanlar · 1-dars Qog‘oz qanday tayyorlanadi?",8],
      ["tfam16","1-sinf tabiiy fanlar · 2-dars Idishlar",8],
      ["tfam17","1-sinf tabiiy fanlar · 3-dars Non dasturxonga qanday keladi?",8],
      ["tfam18","1-sinf tabiiy fanlar · 4-dars Uyda nimalar bor?",8],
      ["tfam19","1-sinf tabiiy fanlar · 5-dars Mening xavfsiz uyim",8],
      ["tfam20","1-sinf tabiiy fanlar · 6-dars Transport turlari",8],
      ["tfam21","1-sinf tabiiy fanlar · 7-dars Ko‘chada xavfsizlik",8],
      ["tfam22","1-sinf tabiiy fanlar · 8-dars Transportda xavfsizlik",8],
      ["tfam23","1-sinf tabiiy fanlar · 10-dars Telefon va xavfsizlik",8],
      ["tfam24","1-sinf tabiiy fanlar · 11-dars Gigiyena",8],
      ["tfam25","1-sinf tabiiy fanlar · 12-dars Foydali taomlar",8],
      ["tfam26","1-sinf tabiiy fanlar · 13-dars Uyqu",8],
      ["tfam27","1-sinf tabiiy fanlar · 14-dars Sport nima uchun kerak?",8],
      ["tfam28","1-sinf tabiiy fanlar · 15–17-dars Sog‘liq va tabiatni asrash",8]
    ],
    "inglizb": [
      ["engm1","1-sinf ingliz tili · Hello! Colors",8],
      ["engm2","1-sinf ingliz tili · Hello! Numbers 0–10",8],
      ["engm3","1-sinf ingliz tili · Hello! Greetings",8],
      ["engm4","1-sinf ingliz tili · 1-bo‘lim School things",8],
      ["engm5","1-sinf ingliz tili · 1-bo‘lim How many? Classroom language",8],
      ["engm6","1-sinf ingliz tili · 1-bo‘lim Materials",8],
      ["engm7","1-sinf ingliz tili · 2-bo‘lim Toys",8],
      ["engm8","1-sinf ingliz tili · 2-bo‘lim What’s this? Is it a ball?",8],
      ["engm9","1-sinf ingliz tili · 2-bo‘lim Is it electric?",8],
      ["engm10","1-sinf ingliz tili · 3-bo‘lim Family",8],
      ["engm11","1-sinf ingliz tili · 3-bo‘lim Who’s this? Who’s that?",8],
      ["engm12","1-sinf ingliz tili · 3-bo‘lim Continents",8],
      ["engm13","1-sinf ingliz tili · 4-bo‘lim At home: rooms",8],
      ["engm14","1-sinf ingliz tili · 4-bo‘lim Where is it?",8],
      ["engm15","1-sinf ingliz tili · 4-bo‘lim Shapes",8],
      ["engm16","1-sinf ingliz tili · 5-bo‘lim My body",8],
      ["engm17","1-sinf ingliz tili · 5-bo‘lim I have… Do you have…?",8],
      ["engm18","1-sinf ingliz tili · 5-bo‘lim The five senses",8],
      ["engm19","1-sinf ingliz tili · 6-bo‘lim Food",8],
      ["engm20","1-sinf ingliz tili · 6-bo‘lim I like… Do you like…?",8],
      ["engm21","1-sinf ingliz tili · 6-bo‘lim Where is food from?",8],
      ["engm22","1-sinf ingliz tili · 7-bo‘lim Actions",8],
      ["engm23","1-sinf ingliz tili · 7-bo‘lim I can… Can you…?",8],
      ["engm24","1-sinf ingliz tili · 7-bo‘lim Plus and minus",8],
      ["engm25","1-sinf ingliz tili · 8-bo‘lim Animals",8],
      ["engm26","1-sinf ingliz tili · 8-bo‘lim Big and small, long and short",8],
      ["engm27","1-sinf ingliz tili · 8-bo‘lim How do animals move?",8]
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
    "tarbiyai": [
      ["trim1","9-sinf tarbiya · 1-mavzu Ulug‘imsan, Vatanim!",11],
      ["trim2","9-sinf tarbiya · 2-mavzu Yashamoq – o‘zidan yaxshi nom qoldirmoq",11],
      ["trim3","9-sinf tarbiya · 3–4-mavzu Yuksalish – o‘zingni anglashdan boshlanadi",11],
      ["trim5","9-sinf tarbiya · 5-mavzu Faol o‘quvchidan faol fuqarolikkacha",11],
      ["trim6","9-sinf tarbiya · 6–7-mavzu Kelajakka sarmoya – vaqtni mazmunli o‘tkazish",11],
      ["trim8","9-sinf tarbiya · 8-mavzu Baxt – oilada",11],
      ["trim9","9-sinf tarbiya · 9-mavzu Baxtiyorlik – umrning bosh maqsadi",11],
      ["trim10","9-sinf tarbiya · 10-mavzu Buyuklarni aziz qilgan – bilim",11],
      ["trim11","9-sinf tarbiya · 11–12-mavzu Tafakkur – kelajakka yetaklovchi vosita",11],
      ["trim13","9-sinf tarbiya · 13-mavzu Bilimga asoslangan jamiyatda muvaffaqiyat qozonish",11],
      ["trim14","9-sinf tarbiya · 14-mavzu Innovatsiya va ilg‘or fikrlash – taraqqiyot g‘ildiragi",11],
      ["trim15","9-sinf tarbiya · 15–16-mavzu Tanqidiy fikrlash",11],
      ["trim17","9-sinf tarbiya · 17–18-mavzu Liderlikka xos xususiyatlar",11],
      ["trim19","9-sinf tarbiya · 19-mavzu Bizning kuchli va kuchsiz tomonlarimiz",11],
      ["trim20","9-sinf tarbiya · 20-mavzu Maqsadga qanday erishiladi?",11],
      ["trim21","9-sinf tarbiya · 21-mavzu Muvaffaqiyat – qimmatli tajriba mevasi",11],
      ["trim22","9-sinf tarbiya · 22–23-mavzu O‘ziga ishonch – mo‘jizakor kuch",11],
      ["trim24","9-sinf tarbiya · 24-mavzu Muloqot va ijtimoiy ko‘nikmalar",11],
      ["trim25","9-sinf tarbiya · 25-mavzu Kelajak kasblari",11],
      ["trim26","9-sinf tarbiya · 26-mavzu Tadbirkorlik mezonlari",11],
      ["trim27","9-sinf tarbiya · 27–28-mavzu Biznesni boshlash uchun zamonaviy g‘oyalar",11],
      ["trim29","9-sinf tarbiya · 29-mavzu Frilanserlik – qo‘shimcha daromad manbai",11],
      ["trim30","9-sinf tarbiya · 30–31-mavzu Insonni boy va qashshoq qiluvchi omillar",11],
      ["trim32","9-sinf tarbiya · 32-mavzu Boylikdan foydalanish mezonlari",11]
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
    ],
    "grammatika": [
      ["egp101","Ingliz grammatikasi · Sodda gap tuzilishi",10],
      ["egp102","Ingliz grammatikasi · Ot turlari va jins",10],
      ["egp103","Ingliz grammatikasi · Otlarning ko'plik shakli: asosiy qoidalar",10],
      ["egp104","Ingliz grammatikasi · Otlarning ko'plik shakli: noqonuniy va maxsus shakllar",10],
      ["egp105","Ingliz grammatikasi · Sanaladigan va sanalmaydigan otlar",10],
      ["egp106","Ingliz grammatikasi · Egalik shakli",10],
      ["egp107","Ingliz grammatikasi · Jamlovchi otlar",8],
      ["egp108","Ingliz grammatikasi · Qo'shma otlar va sifat vazifasidagi otlar",10],
      ["egp109","Ingliz grammatikasi · Noaniq artikl: a / an",10],
      ["egp110","Ingliz grammatikasi · Aniq artikl: the",10],
      ["egp201","Ingliz grammatikasi · Sanoq (miqdor) sonlar",10],
      ["egp202","Ingliz grammatikasi · Tartib sonlar va kasr sonlar",10],
      ["egp203","Ingliz grammatikasi · Kishilik olmoshlari: ega va to'ldiruvchi shakli",10],
      ["egp204","Ingliz grammatikasi · O'zlik va o'zaro (birgalik) olmoshlari",10],
      ["egp205","Ingliz grammatikasi · Noaniq olmosh: one / ones",9],
      ["egp206","Ingliz grammatikasi · Sifatlar: o'rni va tartibi",10],
      ["egp207","Ingliz grammatikasi · Sifat darajalari",10],
      ["egp208","Ingliz grammatikasi · Noto'g'ri sifatlar; little/few; many/much/a lot of",10],
      ["egp209","Ingliz grammatikasi · Egalik sifatlari va egalik olmoshlari",10],
      ["egp210","Ingliz grammatikasi · Ravishlar va ularning yasalishi",10],
      ["egp211","Ingliz grammatikasi · Sifat bilan bir xil shakldagi ravishlar va -ly li ma'nodoshlari",10],
      ["egp212","Ingliz grammatikasi · Ravish darajalari",9],
      ["egp301","Ingliz grammatikasi · Fe'l: asosiy va yordamchi fe'llar",8],
      ["egp302","Ingliz grammatikasi · To be fe'li",9],
      ["egp303","Ingliz grammatikasi · There is / There are qurilmasi",8],
      ["egp304","Ingliz grammatikasi · It olmoshi; It va There farqi",9],
      ["egp305","Ingliz grammatikasi · Shaxsli va shaxssiz fe'llar; infinitiv, gerund va o'tgan zamon sifatdoshi",10],
      ["egp306","Ingliz grammatikasi · Hozirgi davomiy zamon",10],
      ["egp307","Ingliz grammatikasi · Hozirgi oddiy zamon",10],
      ["egp308","Ingliz grammatikasi · O'tgan oddiy zamon; to'g'ri va noto'g'ri fe'llar",10],
      ["egp309","Ingliz grammatikasi · O'tgan davomiy zamon",8],
      ["egp310","Ingliz grammatikasi · Have/has got va have",8],
      ["egp311","Ingliz grammatikasi · Kelasi oddiy zamon",9],
      ["egp312","Ingliz grammatikasi · Kelasi davomiy zamon",8],
      ["egp313","Ingliz grammatikasi · Davomiy zamonda ishlatilmaydigan fe'llar",9],
      ["egp314","Ingliz grammatikasi · Ikki xil ishlatiladigan fe'llar: feel, look, smell, taste, see, hear, think, expect",10],
      ["egp401","Ingliz grammatikasi · Imlo qoidalari: oxirgi undoshning ikkilanishi",10],
      ["egp402","Ingliz grammatikasi · Imlo qoidalari: oxirgi \"e\" va \"y\" harflari",10],
      ["egp403","Ingliz grammatikasi · Hozirgi tugallangan zamon: tuzilishi va asosiy qo'llanishi",10],
      ["egp404","Ingliz grammatikasi · Present Perfect: for, since va Past Simple bilan farqi",10],
      ["egp405","Ingliz grammatikasi · Hozirgi tugallangan davomli zamon",9],
      ["egp406","Ingliz grammatikasi · O'tgan tugallangan zamon va vaqt ergash gaplari",10],
      ["egp407","Ingliz grammatikasi · O'tgan tugallangan davomli zamon",9],
      ["egp408","Ingliz grammatikasi · To be going to tuzilmasi",8],
      ["egp409","Ingliz grammatikasi · Kelasi tugallangan va kelasi tugallangan davomli zamon",9],
      ["egp410","Ingliz grammatikasi · Majhul nisbat (Passive Voice)",10],
      ["egp501","Ingliz grammatikasi · Modal fe'llar: can, could, may, might",10],
      ["egp502","Ingliz grammatikasi · Modal fe'llar: must, have to, should, ought to, had better",10],
      ["egp503","Ingliz grammatikasi · Buyruq, maslahat va iltimos gaplar",9],
      ["egp504","Ingliz grammatikasi · Fikrga qo'shimcha: so, neither, too, either",10],
      ["egp505","Ingliz grammatikasi · So'roq gaplar: umumiy, maxsus va egaga beriladigan savollar",10],
      ["egp506","Ingliz grammatikasi · Tag (dumli) savollar va qisqa javob-savollar",10],
      ["egp507","Ingliz grammatikasi · Gap ichidagi so'roq gap (embedded question)",9],
      ["egp508","Ingliz grammatikasi · Noaniq artikl a / an va one",10],
      ["egp509","Ingliz grammatikasi · Other / another va little / few",10],
      ["egp510","Ingliz grammatikasi · Aniq artikl the: umumiy qoidalar va geografik nomlar",10],
      ["egp511","Ingliz grammatikasi · Aniq artikl the: muassasalar, joylar va maxsus holatlar",10],
      ["egp601","Ingliz grammatikasi · Vaqt predloglari: at, on, in, by, before",10],
      ["egp602","Ingliz grammatikasi · Vaqt predloglari: boshi/oxiri, from…to, since, during, for, after, while",10],
      ["egp603","Ingliz grammatikasi · O'rin predloglari: at, in, into, on, onto",10],
      ["egp604","Ingliz grammatikasi · Above, over, below, under, between, among va boshqa o'rin predloglari",10],
      ["egp605","Ingliz grammatikasi · But/except, by, arrive, home, transport, corner, front/back",10],
      ["egp606","Ingliz grammatikasi · Predlog va ravish; like, as, as if",10],
      ["egp607","Ingliz grammatikasi · Some, any, no va none",10],
      ["egp608","Ingliz grammatikasi · Someone, anyone, no one, something... va else",10],
      ["egp609","Ingliz grammatikasi · Every, each, all va whole",10],
      ["egp610","Ingliz grammatikasi · Each of, both, neither va either",10],
      ["egp611","Ingliz grammatikasi · Sifatlar: -ing / -ed, bog'lovchi fe'llar va and qo'yilishi",10],
      ["egp612","Ingliz grammatikasi · Sifatlarni qiyoslash: as…as, than, the…the",10],
      ["egp701","Ingliz grammatikasi · Ravishlarning o'rni: holat, xarakter va o'rin ravishlari",9],
      ["egp702","Ingliz grammatikasi · Payt va takror ravishlari; ravishlar tartibi",10],
      ["egp703","Ingliz grammatikasi · Butun gapga oid ravishlar (Sentence adverbs)",9],
      ["egp704","Ingliz grammatikasi · Daraja ravishlari; quite va rather",9],
      ["egp705","Ingliz grammatikasi · Inversiya (ta'kid uchun so'z tartibining o'zgarishi)",8],
      ["egp706","Ingliz grammatikasi · Gap, sodda gap (clause), bog'lovchilar va linkerlar",9],
      ["egp707","Ingliz grammatikasi · O'zlashtirma gap: darak gaplar va zamonlar moslashuvi",10],
      ["egp708","Ingliz grammatikasi · Say va tell; o'zlashtirma gap fe'llari",8],
      ["egp709","Ingliz grammatikasi · O'zlashtirma gapda so'roq gaplar",9],
      ["egp710","Ingliz grammatikasi · O'zlashtirma gapda buyruq, iltimos, maslahat va taklif",10],
      ["egp711","Ingliz grammatikasi · Vositasiz va vositali to'ldiruvchilar",9],
      ["egp712","Ingliz grammatikasi · O'timli va o'timsiz fe'llar: rise/raise, lie/lay, sit/set",10],
      ["egp713","Ingliz grammatikasi · Majhul nisbat: alohida holatlar",10],
      ["egp801","Ingliz grammatikasi · See somebody do va see somebody doing",9],
      ["egp802","Ingliz grammatikasi · Infinitiv: shakllari va fe'l + infinitiv",10],
      ["egp803","Ingliz grammatikasi · Fe'l + obyekt + infinitiv va «to»siz infinitiv",10],
      ["egp804","Ingliz grammatikasi · Otdan keyingi infinitiv, too / enough va perfect infinitiv",9],
      ["egp805","Ingliz grammatikasi · Gerund (-ing shakl)",10],
      ["egp806","Ingliz grammatikasi · Gerund yoki infinitiv oladigan fe'llar",10],
      ["egp807","Ingliz grammatikasi · Sababiy fe'llar va afzal ko'rish fe'llari",9],
      ["egp808","Ingliz grammatikasi · Modal fe'llar: ruxsat va ehtimollik",10],
      ["egp809","Ingliz grammatikasi · Modal fe'llar: qobiliyat va majburiyat",10],
      ["egp810","Ingliz grammatikasi · Modal fe'llar: xulosa va taxmin",9],
      ["egp811","Ingliz grammatikasi · Ot ergash gaplar (noun clauses)",9],
      ["egp812","Ingliz grammatikasi · Sifat (nisbiy) ergash gaplar",10],
      ["egp813","Ingliz grammatikasi · Hol ergash gaplar va izohlovchi (appositive)",8],
      ["egp814","Ingliz grammatikasi · Shart gaplar: 1-, 2- va 3-tur",9],
      ["egp815","Ingliz grammatikasi · Shart gaplar: variantlar, inversiya va maxsus qo'llanishlar",10],
      ["egp816","Ingliz grammatikasi · Subjunktiv (istak) mayli",9],
      ["egp817","Ingliz grammatikasi · So va such",9],
      ["egp818","Ingliz grammatikasi · Parallel tuzilma, olmosh antetsedenti va ortiqchalik",10]
    ],
    "rusdars": [
      ["rdalifbo","Rus tili darslari · Alifbo va talaffuz",7],
      ["rdtanishuv","Rus tili darslari · Salomlashish va tanishuv",6],
      ["rdjins","Rus tili darslari · Otning jinsi",8],
      ["rdkoplik","Rus tili darslari · Otlarning ko'pligi",4],
      ["rdegalik","Rus tili darslari · Egalik olmoshlari",7],
      ["rdsifat","Rus tili darslari · Sifatlar",6],
      ["rdfel","Rus tili darslari · Fe'l: hozirgi zamon",4],
      ["rdpredlojniy","Rus tili darslari · Joy kelishigi (Predlojniy)",5],
      ["rdvinitelniy","Rus tili darslari · Tushum kelishigi (Vinitelniy)",5],
      ["rdotgan","Rus tili darslari · O'tgan zamon",5],
      ["rdsonlar","Rus tili darslari · Sonlar, vaqt va narx",7],
      ["rdroditelniy","Rus tili darslari · Qaratqich kelishigi (Roditelniy)",5],
      ["rddatelniy","Rus tili darslari · Jo'nalish kelishigi (Datelniy)",6],
      ["rdtvoritelniy","Rus tili darslari · Vosita kelishigi (Tvoritelniy)",5],
      ["rdkelasi","Rus tili darslari · Fe'l turi va kelasi zamon",6],
      ["rdharakat","Rus tili darslari · Harakat fe'llari",7],
      ["rdbuyruq","Rus tili darslari · Buyruq mayli va odob",6],
      ["rdmurakkab","Rus tili darslari · Qo'shma gaplar",10],
      ["rdkopkel","Rus tili darslari · Ko'plikdagi kelishiklar",4],
      ["rdqiyos","Rus tili darslari · Qiyosiy va orttirma daraja",5],
      ["rdshart","Rus tili darslari · Shart mayli (бы)",5],
      ["rdsvoy","Rus tili darslari · Свой, себя, сам, весь",7],
      ["rdsifatdosh","Rus tili darslari · Sifatdoshlar",7],
      ["rdravishdosh","Rus tili darslari · Ravishdoshlar",6],
      ["rdmajhul","Rus tili darslari · Majhul nisbat",6],
      ["rdozlashtirma","Rus tili darslari · Ko'chirma va o'zlashtirma gap",8],
      ["rdboshqaruv","Rus tili darslari · Fe'l boshqaruvi va murakkab ko'makchilar",7],
      ["rdvidnozik","Rus tili darslari · Fe'l turining nozikliklari",10],
      ["rdrasmiy","Rus tili darslari · Rasmiy-ish uslubi",9],
      ["rddiskurs","Rus tili darslari · Kirish so'zlari va matn bog'lovchilari",10],
      ["rdfrazeologiya","Rus tili darslari · Frazeologizmlar",10],
      ["rdsozyasash","Rus tili darslari · So'z yasalishi",6]
    ],
    "satrw": [
      ["satrwwic","SAT Reading & Writing · Words in Context — Kontekstdagi so'z",31],
      ["satrwtsp","SAT Reading & Writing · Text Structure and Purpose — Matn tuzilishi va maqsadi",20],
      ["satrwctc","SAT Reading & Writing · Cross-Text Connections — Ikki matnni bog'lash",13],
      ["satrwcid","SAT Reading & Writing · Central Ideas and Details — Asosiy g'oya va tafsilotlar",17],
      ["satrwcoe","SAT Reading & Writing · Command of Evidence (Textual & Quantitative) — Dalil bilan ishlash (matn va jadval)",28],
      ["satrwinf","SAT Reading & Writing · Inferences — Xulosa chiqarish",15],
      ["satrwbnd","SAT Reading & Writing · Boundaries — Gap chegaralari va tinish belgilari",29],
      ["satrwfss","SAT Reading & Writing · Form, Structure, and Sense — Shakl, tuzilish va mantiq (grammatika)",33],
      ["satrwtr","SAT Reading & Writing · Transitions — Bog'lovchi so'zlar (o'tishlar)",23],
      ["satrwrs","SAT Reading & Writing · Rhetorical Synthesis — Qaydlardan gap tuzish",21]
    ],
    "sherlok": [
      ["shlkroman","Sherlok ishlari · Romanlar",4],
      ["shlksarguzasht","Sherlok ishlari · Sherlok Xolmsning sarguzashtlari",12],
      ["shlkxotira","Sherlok ishlari · Sherlok Xolms haqida xotiralar",11],
      ["shlkqaytish","Sherlok ishlari · Sherlok Xolmsning qaytishi",13],
      ["shlktazim","Sherlok ishlari · Uning so‘nggi ta’zimi",8],
      ["shlkarxiv","Sherlok ishlari · Sherlok Xolms arxivi",12],
      ["shlkpuaro","Sherlok ishlari · Herkul Puaro ishlari",27],
      ["shlkmarpl","Sherlok ishlari · Miss Marpl ishlari",10],
      ["shlkdyupen","Sherlok ishlari · Edgar Po hikoyalari",3],
      ["shlkbraun","Sherlok ishlari · Ota Braun hikoyalari",7],
      ["shlkklassika","Sherlok ishlari · Boshqa klassik detektivlar",2],
      ["shlkmantiq","Sherlok ishlari · Holmes uslubidagi mantiq ishlari",9]
    ],
    "ezop": [
      ["ezpb1","Ezop masallari · 1–20-masallar",20],
      ["ezpb2","Ezop masallari · 21–40-masallar",20],
      ["ezpb3","Ezop masallari · 41–60-masallar",20],
      ["ezpb4","Ezop masallari · 61–80-masallar",20],
      ["ezpb5","Ezop masallari · 81–100-masallar",20],
      ["ezpb6","Ezop masallari · 101–120-masallar",20],
      ["ezpb7","Ezop masallari · 121–140-masallar",20],
      ["ezpb8","Ezop masallari · 141–160-masallar",20],
      ["ezpb9","Ezop masallari · 161–180-masallar",20],
      ["ezpb10","Ezop masallari · 181–200-masallar",20],
      ["ezpb11","Ezop masallari · 201–220-masallar",14]
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
      if (m.uzun && !/viktorina/.test(location.pathname)) return; // uzun matn faqat jonli viktorinada
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
    var r = imgOf(m, x.img), st = x.e ? [x.h ? x.e : esc(x.e)] : [];
    if (x.h) return { q: x.q, a: x.a[0], w: x.a.slice(1), steps: st, r: r };
    if (x.t === "m" && x.a && x.a.length >= 2) return { q: esc(x.q), a: esc(x.a[0]), w: x.a.slice(1).map(esc), steps: st, r: r };
    if (x.t === "tf" && typeof x.a === "boolean") { var o = ["✅ To'g'ri", "❌ Noto'g'ri"]; return { q: esc(x.q), a: x.a ? o[0] : o[1], w: [x.a ? o[1] : o[0]], steps: st, r: r }; }
    if (x.t === "o" && x.a && x.a.length >= 3) return { q: esc(x.q) + "<br><small>To'g'ri tartibni tanlang</small>", a: x.a.map(esc).join(" → "), w: perms(x.a).map(function (b) { return b.map(esc).join(" → "); }), steps: st, r: r };
    return null; // "f" — ochiq savol
  }
  // savollar soni (tools/bolimlar.js ham shuni ishlatadi)
  function count(m, it) { return (it.q || []).filter(function (x) { return !!conv(m, x); }).length; }

  // boshqa formatli data -> umumiy bo'lim formati {id, t, q:[{t:"m", q, a:[to'g'ri, xato…], e}]}
  // matnli savol: avval matn, keyin qalin harflarda savol (h:1 — saytning o'z HTML matni, qayta kodlanmaydi)
  function html(s) {
    return String(s == null ? "" : s)
      .replace(/<caption[^>]*>([\s\S]*?)<\/caption>/g, "<b>$1</b><br>")
      .replace(/<\/t[hd]>\s*(?=<t[hd])/g, " | ").replace(/<\/tr>/g, "<br>")
      .replace(/<\/?(table|thead|tbody|tr|th|td)\b[^>]*>/g, "")
      .replace(/\n/g, "<br>");
  }
  function story(text, ask, opts, right, why) {
    if (!text || !ask || !opts || opts[right] === undefined) return null;
    return { t: "m", h: 1, q: html(text) + "<br><br><b>" + html(ask) + "</b>", e: why ? html(why) : "",
      a: [opts[right]].concat(opts.filter(function (_, i) { return i !== right; })).map(html) };
  }
  function group(items, keyOf, idOf, titleOf, qOf) {
    var by = {}, out = [];
    items.forEach(function (x, i) {
      var k = keyOf(x, i), q = qOf(x); if (!q) return;
      if (!by[k]) out.push(by[k] = { id: String(idOf(k)).replace(/[^a-z0-9]/gi, ""), t: titleOf(k), q: [] });
      by[k].q.push(q);
    });
    return out;
  }
  function norm(m, list, ctx) {
    var key = m.fmt; ctx = ctx || {};
    function named(arr, k, f) { var r = (arr || []).filter(function (x) { return x.id === k; })[0]; return r ? r[f] : k; }
    if (key === "sat") return group((list && list.questions) || [], function (x) { return x.skill; }, function (k) { return k; },
      function (k) { return named(list.skills, k, "en") + " — " + named(list.skills, k, "uz"); },
      function (x) { return story(x.passage, x.question, x.options, x.answer, x.explain_uz); });
    if (key === "sherlok") return group(list || [], function (x) { return x.kitob; }, function (k) { return k; },
      function (k) { return named(ctx.SHERLOCK_KITOBLAR, k, "nom"); },
      function (x) { return story(x.hikoya, x.savol, x.variantlar, x.javob, x.izoh); });
    if (key === "ezop") return group(list || [], function (x, i) { return Math.floor(i / 20); }, function (k) { return "b" + (+k + 1); },
      function (k) { return (k * 20 + 1) + "–" + (k * 20 + 20) + "-masallar"; },
      function (x) { return story(x.sarlavha && x.matn ? "<b>" + x.sarlavha + "</b><br>" + x.matn : x.matn, x.savol, x.variantlar, x.javob, x.izoh); });
    if (key !== "quiz" && key !== "tasks") return list || [];
    return (list || []).map(function (it) {
      var qs = (it[key] || []).filter(function (x) { return x && x.o && x.o.length > 1 && x.o[x.a] !== undefined; }).map(function (x) {
        return { t: "m", q: x.q, a: [x.o[x.a]].concat(x.o.filter(function (_, i) { return i !== x.a; })), e: x.e };
      });
      return { id: String(it.id).replace(/[^a-z0-9]/gi, ""), t: it.uz || it.title || it.t, q: qs };
    });
  }

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
        DATA[k] = norm(m, window[m.g], window);
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

  // <div data-bolim-fanlar> ichiga hali tugmasi yo'q bo'lim fanlari o'zi qo'shiladi
  function tugmalar() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-bolim-fanlar]"), function (box) {
      MANIFEST.forEach(function (m) {
        var href = "viktorina.html?fan=" + m.k;
        if (!(INDEX[m.k] || []).length || box.querySelector('a[href="' + href + '"]')) return;
        var a = document.createElement("a"); a.className = "btn vk"; a.href = href; a.textContent = m.nom; box.appendChild(a);
      });
    });
  }
  if (document.querySelectorAll) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tugmalar); else tugmalar();
  }

  window.KA_BOLIM = { norm: norm, MANIFEST: MANIFEST, INDEX: INDEX, apply: apply, prep: prep, done: done, has: has, img: img, okImg: okImg, conv: conv, count: count };
})();
