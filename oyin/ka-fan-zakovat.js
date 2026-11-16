/*! Kuvonch Academy — viktorina: 🦉 ZAKOVAT (bilimdonlar savollari)
 *  zk1 Fan va texnika · zk2 Tarix, madaniyat va san'at · zk3 Til, adabiyot va topishmoqlar
 *  zk4 Qora quti: qutida nima bor? · zk5 Matematik zakovat
 *  Savollar Zakovat uslubida: bir nechta ishora, o'ylab topiladigan javob va izoh («nima uchun?»).
 *  Bank elementi: [daraja(1-3), savol, javob, [noto'g'ri variantlar], "izoh"]. ES5.
 *  Viktorinada zakovat savollariga ko'proq vaqt beriladi (viktorina.html: qSecOf). */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, pick = H.pick, shuffle = H.shuffle;
  function Q(q, a, w, steps) {
    a = String(a);
    var seenW = {}, ws = []; seenW[a.toLowerCase()] = 1;
    (w || []).forEach(function (x) { x = String(x); var k = x.toLowerCase(); if (!seenW[k] && x !== "") { seenW[k] = 1; ws.push(x); } });
    return { q: q, a: a, w: ws, steps: steps || [], lang: "uz" };
  }
  var REC = {};
  function seen(id, q) { return (REC[id] || []).indexOf(q) > -1; }
  function remember(id, q, n) { var r = REC[id] || (REC[id] = []); r.push(q); if (r.length > n) r.shift(); }
  function lvPool(items, L) {
    for (var d = 0; d < 3; d++) { var o = items.filter(function (it) { return Math.abs(it[0] - L) === d; }); if (o.length) return o; }
    return items;
  }
  function topic(id, title, items) {
    var keep = Math.max(4, Math.floor(items.length * 0.7)); // bitta testda takrorlanmasin
    S.register(id, function (L) {
      L = L === 2 || L === 3 ? L : 1;
      var pool = lvPool(items, L), fr = pool.filter(function (it) { return !seen(id, it[1]); });
      if (!fr.length) fr = items.filter(function (it) { return !seen(id, it[1]); });
      var it = pick(fr.length ? fr : pool);
      remember(id, it[1], keep);
      return Q(it[1], it[2], shuffle(it[3]), it[4] ? ["💡 " + it[4]] : []);
    }, title);
  }

  /* ---------------- zk1: Fan va texnika ---------------- */
  topic("zk1", "Zakovat · Fan va texnika", [
    [1, "Bu metall xona haroratida suyuq bo'ladi. Uning lotincha nomi «suyuq kumush» degan ma'noni beradi, eski termometrlar ichida ham shu edi. Gap qaysi metall haqida?", "Simob", ["Qalay", "Qo'rg'oshin", "Alyuminiy"], "Simob (Hg, lotincha hydrargyrum — «suyuq kumush») — oddiy xona haroratida suyuq bo'ladigan yagona metall."],
    [1, "Uning nomi yunoncha «quyosh» so'zidan olingan, chunki u avval Quyosh nurining spektrida topilgan, keyingina Yerda. Bayram sharlari undan baland uchadi. Bu qaysi gaz?", "Geliy", ["Vodorod", "Neon", "Argon"], "Geliy 1868-yilda Quyosh tutilishida spektrda aniqlangan; «helios» — yunoncha quyosh."],
    [1, "U odam tanasidagi eng katta a'zo: ham himoya qiladi, ham ter chiqaradi, ham issiq-sovuqni sezadi. Bu nima?", "Teri", ["Jigar", "O'pka", "Miya"], "Katta odam terisining yuzasi taxminan 1,5–2 m². Jigar esa eng katta ichki a'zo."],
    [1, "Bu sayyorada bir sutka (o'z o'qi atrofida bir marta aylanishi) uning bir yilidan ham uzunroq. Qaysi sayyora?", "Venera", ["Merkuriy", "Mars", "Yupiter"], "Venera o'z o'qi atrofida ~243 Yer sutkasida, Quyosh atrofida esa ~225 sutkada aylanadi."],
    [1, "Bu qush qanotlarini sekundiga 50–80 marta qoqadi, havoda bir joyda «osilib» turadi va hatto orqaga ham ucha oladi. Qaysi qush?", "Kolibri", ["Qaldirg'och", "Chumchuq", "Burgut"], "Kolibri — orqaga ucha oladigan qush; shuning uchun gul ichidan nektarni muallaq turib so'radi."],
    [1, "1876-yilda Aleksandr Bell uni patentlagan. Bugun u «aqlli» bo'lib, deyarli hammaning cho'ntagida yuradi. Gap nima haqida?", "Telefon", ["Telegraf", "Radio", "Televizor"], "Aleksandr Grem Bell 1876-yilda telefonga patent olgan; smartfon — uning bugungi «aqlli» avlodi."],
    [1, "Agar Oy bo'lmaganida, dengiz va okeanlardagi qaysi hodisa deyarli sezilmas edi? (Quyosh ham uni keltirib chiqaradi, lekin ancha kuchsiz.)", "Suvning ko'tarilishi va qaytishi (qalqish)", ["Zilzila", "Shamol", "Yomg'ir"], "Qalqish (prilyv-otliv) asosan Oyning tortishish kuchi tufayli bo'ladi; Quyoshning ta'siri taxminan ikki baravar kuchsiz."],
    [1, "Uning tezligi sekundiga taxminan 300 000 km. Quyoshdan Yergacha u ~8 daqiqada yetib keladi. Bu nima?", "Yorug'lik", ["Tovush", "Shamol", "Zilzila to'lqini"], "Quyosh nuri ~150 mln km ni ~8 daqiqa 20 soniyada bosib o'tadi. Tovush havoda atigi ~340 m/s."],
    [1, "Bu gaz biz nafas olayotgan havoning taxminan 78 foizini tashkil qiladi, lekin organizmimiz uni nafasdan deyarli ishlatmaydi. Qaysi gaz?", "Azot", ["Kislorod", "Karbonat angidrid", "Argon"], "Havoning ~78% i azot, ~21% i kislorod. Biz kislorodni o'zlashtiramiz, azot esa qaytib chiqadi."],
    [2, "1928-yilda bir olim laboratoriyadagi idishni yuvishni unutib ta'tilga ketdi. Qaytib kelsa, idishda o'sgan mog'or bakteriyalarni o'ldirib qo'yibdi. Shu tasodif qaysi dorining kashf etilishiga sabab bo'ldi?", "Penitsillin", ["Aspirin", "Insulin", "Paratsetamol"], "Aleksandr Fleming penitsillinni 1928-yilda kashf etdi — bu birinchi antibiotik bo'lib, millionlab hayotni saqlab qoldi."],
    [2, "U «Menga tayanch nuqta beringlar — Yerni ko'tarib beraman» degan, vannada o'tirib suzish qonunini topgan va «Evrika!» deb yugurgan, deyiladi. Kim?", "Arximed", ["Pifagor", "Evklid", "Aristotel"], "Arximed (Sirakuza, mil. avv. III asr) — richag va suzish (Arximed kuchi) qonunlari muallifi."],
    [2, "XIX asr o'rtalarida bu metall oltindan ham qimmat bo'lgan: Napoleon III eng aziz mehmonlarini undan yasalgan qoshiqlarda mehmon qilgan. Bugun undan ichimlik bankalari yasaladi. Qaysi metall?", "Alyuminiy", ["Mis", "Titan", "Platina"], "Elektroliz usuli (1886) topilguncha alyuminiyni ajratib olish juda qimmat edi."],
    [2, "Ilonlarning ayrimlari qorong'ida ham o'ljasini «ko'radi», chunki u bizning ko'zimiz ko'rmaydigan nurlanishni sezadi — issiqlik nurlanishini. Bu nurlanish nomi?", "Infraqizil nurlanish", ["Ultrabinafsha nurlanish", "Rentgen nurlari", "Gamma nurlar"], "Iliq jismlar infraqizil nur chiqaradi; ilonlarning maxsus «chuqurchalari» shu nurni sezadi."],
    [2, "Ularni «suv ostidagi o'rmon» deyishadi, lekin ular o'simlik emas — mayda hayvonlar koloniyasi. Eng kattasi Avstraliya qirg'oqlarida, uni hatto koinotdan ham ko'rish mumkin. Bu nima?", "Marjon riflari", ["Suv o'tlari", "Gubkalar", "Meduzalar to'dasi"], "Katta to'siq rifi (Avstraliya) — 2000 km dan uzun, tirik organizmlar yaratgan eng katta tuzilma."],
    [2, "Mendeleyev jadvalida bo'sh qoldirgan kataklardan biri uning hayotligidayoq Fransiyada kashf etilgan element bilan to'ldi va u mamlakatning lotincha nomi bilan ataldi. Qaysi element?", "Galliy", ["Germaniy", "Skandiy", "Poloniy"], "Galliy 1875-yilda kashf etildi (Gallia — Fransiyaning lotincha nomi). Mendeleyev uni «eka-alyuminiy» deb oldindan bashorat qilgan edi."],
    [2, "Bu kasallikka qarshi birinchi emlashni Edvard Jenner sigir chechagi yordamida qilgan. Shu sababli «vaksina» so'zi lotincha «vacca» — «sigir» so'zidan kelib chiqqan. Qaysi kasallik?", "Chin chechak", ["Gripp", "Vabo", "Qizamiq"], "Jenner 1796-yilda chechakka qarshi emladi; 1980-yilda chin chechak butun dunyoda yo'q qilindi."],
    [2, "Muhammad Muso al-Xorazmiyning ismi lotin tilida «Algoritmi» deb yozilgan. Bugun shu so'zdan kelib chiqqan atama nimani anglatadi?", "Masalani yechish uchun aniq amallar ketma-ketligi", ["Hisoblash mashinasi", "Kasr son", "Geometrik shakl"], "«Algoritm» so'zi Xorazmiy nomidan; «algebra» esa uning «al-jabr» kitobi nomidan kelib chiqqan."],
    [2, "Bu hayvon hech qachon uxlamaydi, degan noto'g'ri fikr bor. Aslida u miyasining yarim sharlarini navbat bilan «uxlatadi» va uyqusida ham suzib, nafas olishga suv yuziga chiqib turadi. Qaysi hayvon?", "Delfin", ["Akula", "Kit", "Tyulen"], "Delfinlarda bir yarim shar uxlaganda ikkinchisi hushyor turadi (bir yarim sharli uyqu)."],
    [3, "XVIII asrda bir olim momaqaldiroq paytida havoga varrak uchirib, chaqmoqning elektr ekanini isbotlagan va yashin qaytargichni ixtiro qilgan. Uning surati AQShning 100 dollarligida. Kim?", "Benjamin Franklin", ["Tomas Edison", "Nikola Tesla", "Alessandro Volta"], "Franklin 1752-yilda varrak bilan tajriba o'tkazgan; u AQSh asoschilaridan biri ham."],
    [3, "Uning nomi bilan quvvat birligi atalgan: lampochkadagi «60» yoki «100» raqami shu birlikda. U Shotlandiyada tug'ilgan va bug' mashinasini takomillashtirgan. Kim?", "Jeyms Uatt", ["Alessandro Volta", "Andre Amper", "Georg Om"], "Quvvat birligi — vatt (W), Jeyms Uatt sharafiga. Volt, amper va om — elektr kattaliklari birliklari."],
    [3, "Mirzo Ulug'bekning «Ziji jadidi Ko'ragoniy» asaridagi yulduzlar katalogida nechta yulduz bor?", "1018 ta", ["365 ta", "777 ta", "2500 ta"], "Ulug'bek katalogida 1018 ta yulduzning o'rni qayta o'lchab yozilgan — Ptolemeydan keyingi eng aniq katalog edi."],
    [3, "Abu Rayhon Beruniy XI asrda Yevropa va Osiyoning narigi tomonida, okean ortida noma'lum quruqlik bo'lishi kerak, degan xulosaga kelgan. Yevropaliklar u yerga qaysi yili yetib borgan?", "1492-yilda", ["1453-yilda", "1519-yilda", "1600-yilda"], "Kolumb Amerikaga 1492-yilda yetib bordi — Beruniy taxminidan 450 yil keyin."],
    [3, "Bu matematik 2300 yil oldin tub sonlar (2, 3, 5, 7, 11, …) cheksiz ko'p ekanini isbotlagan va geometriyaga oid «Negizlar» kitobini yozgan. Kim?", "Evklid", ["Pifagor", "Arximed", "Fales"], "Evklidning «Negizlar»i 2000 yildan ortiq vaqt davomida asosiy geometriya darsligi bo'lib keldi."],
    [3, "1424-yilda Samarqandda π sonini 16 ta o'nli xonagacha to'g'ri hisoblagan olim kim? Yevropa bu aniqlikka deyarli 170 yildan keyin yetgan.", "Jamshid al-Koshiy", ["Qozizoda Rumiy", "Ali Qushchi", "Umar Xayyom"], "G'iyosiddin Jamshid al-Koshiy — Ulug'bek rasadxonasi olimi, «Aylana haqida risola» muallifi."]
  ]);

  /* ---------------- zk2: Tarix, madaniyat va san'at ---------------- */
  topic("zk2", "Zakovat · Tarix, madaniyat va san'at", [
    [1, "Bu shahar nomi qadimda «tosh shahar» degan ma'noni bergan, deb taxmin qilinadi. Bugun u O'zbekiston poytaxti. Qaysi shahar?", "Toshkent", ["Samarqand", "Buxoro", "Xiva"], "Qadimgi manbalarda Choch, Binkat, Shosh deb ham atalgan; «Toshkent» nomi XI asrdan uchraydi."],
    [1, "Uni «Sharq gavhari» deyishadi: Registon maydoni, Bibixonim masjidi va Go'ri Amir maqbarasi shu yerda. Qaysi shahar?", "Samarqand", ["Buxoro", "Xiva", "Shahrisabz"], "Samarqand Amir Temur davlatining poytaxti bo'lgan."],
    [1, "Devor bilan o'ralgan «ichki shahar» — Ichan qal'a 1990-yilda O'zbekistondan birinchi bo'lib YUNESKO ro'yxatiga kiritilgan. U qaysi shaharda?", "Xiva", ["Buxoro", "Samarqand", "Termiz"], "Ichan qal'a — ochiq osmon ostidagi muzey-shahar; 1990-yilda Jahon merosi ro'yxatiga kirdi."],
    [1, "Bu shoir «Xamsa»ni yozgan, o'zbek adabiy tilining asoschisi hisoblanadi. Toshkentdagi metro bekati, milliy bog' va katta teatr uning nomida. Kim?", "Alisher Navoiy", ["Zahiriddin Muhammad Bobur", "Ogahiy", "Lutfiy"], "Alisher Navoiy (1441–1501) — turkiy tilda 5 dostondan iborat «Xamsa» yozgan birinchi shoir."],
    [1, "O'zbekistonda 8-dekabr «Konstitutsiya kuni». Asosiy qonun birinchi marta qaysi yili qabul qilingan?", "1992-yilda", ["1991-yilda", "1993-yilda", "1995-yilda"], "O'zbekiston Respublikasi Konstitutsiyasi 1992-yil 8-dekabrda qabul qilingan."],
    [1, "Navro'z qaysi astronomik hodisa kunida nishonlanadi?", "Bahorgi tengkunlik", ["Yozgi Quyosh turishi", "Oy tutilishi", "Kuzgi tengkunlik"], "21-mart atrofida kun va tun deyarli tenglashadi — Navro'z (yangi kun) shu kuni."],
    [1, "Bu taom madaniyati 2016-yilda YUNESKO nomoddiy madaniy merosi ro'yxatiga kiritilgan: to'y, ma'raka va mehmondo'stlik ramzi. Qaysi taom?", "Palov (osh)", ["Somsa", "Lag'mon", "Sumalak"], "«O'zbek palovi madaniyati va an'analari» 2016-yilda YUNESKO ro'yxatiga kirdi."],
    [2, "Afsonaga ko'ra, Chingizxon bu minoraga boshini ko'tarib qaraganda dubulg'asi tushib ketgan, u egilib olgan va minorani buzdirmagan. Buxorodagi bu minora nomi?", "Minorai Kalon", ["Kalta minor", "Islomxo'ja minorasi", "Chor minor"], "Minorai Kalon 1127-yilda qurilgan, balandligi ~46 m. Kalta minor va Islomxo'ja minorasi Xivada."],
    [2, "Amir Temur o'z ona shahrida «Oqsaroy»ni qurdirgan; peshtoqida «Kuchimizga shubha qilsang — qurgan binolarimizga boq» degan mazmunda yozuv bo'lgan, deyiladi. Bu qaysi shahar?", "Shahrisabz", ["Samarqand", "Buxoro", "Termiz"], "Oqsaroy (1380–1404) Shahrisabzda; uning qoldiqlari ham ulkan."],
    [2, "Ulug'bek rasadxonasining qoldiqlarini 1908-yilda bir arxeolog qadimiy vaqfnoma hujjati yordamida topgan. Kim?", "Vasiliy Vyatkin", ["Mixail Masson", "Galina Pugachenkova", "Mixail Gerasimov"], "V. L. Vyatkin rasadxonaning ulkan sekstanti qoldig'ini qazib ochgan; u rasadxona yonida dafn etilgan."],
    [2, "Registondagi uchta madrasadan eng qadimgisi; unda Ulug'bekning o'zi ham dars bergan, deyiladi. Qaysi madrasa?", "Ulug'bek madrasasi", ["Sherdor madrasasi", "Tillakori madrasasi", "Ko'kaldosh madrasasi"], "Ulug'bek madrasasi 1417–1420-yillarda qurilgan; Sherdor (XVII asr) va Tillakori undan keyin."],
    [2, "Samarqanddagi bu madrasa peshtoqida kiyikni quvayotgan yirtqich va uning ustida odam yuzli quyosh tasvirlangan; madrasa nomi ham shu yirtqichdan. Qaysi hayvon?", "Sher", ["Bo'ri", "Burgut", "Ajdar"], "«Sherdor» — «sherli» degani. Islom me'morchiligida tirik mavjudot tasviri juda kam uchraydi."],
    [2, "XV asrda Hirotda yashagan bu miniatyura ustasini «Sharq Rafaeli» deb atashadi. Kim?", "Kamoliddin Behzod", ["Mahmud Muzahhib", "Mirak Naqqosh", "Usto Mo'min"], "Behzod Husayn Boyqaro saroyida ishlagan; Alisher Navoiy uning homiysi bo'lgan."],
    [2, "Yevropada «Avitsenna» nomi bilan mashhur bu alloma «Tib qonunlari»ni yozgan. U qaysi shahar yaqinidagi Afshona qishlog'ida tug'ilgan?", "Buxoro", ["Xiva", "Samarqand", "Termiz"], "Abu Ali ibn Sino (980–1037). «Tib qonunlari» Yevropada 500 yil davomida asosiy tibbiyot kitobi bo'lgan."],
    [2, "Qadimgi dunyoning yetti mo'jizasidan bugungacha saqlanib qolgan yagonasi qaysi?", "Giza piramidalari", ["Bobil osma bog'lari", "Rodos kolossi", "Aleksandriya mayog'i"], "Xeops piramidasi ~4500 yil oldin qurilgan; qolgan olti mo'jiza yo'q bo'lib ketgan."],
    [2, "Luvrdagi bu portret 1911-yilda o'g'irlangan va faqat ikki yildan keyin Italiyada topilgan. O'g'irlik uni yanada mashhur qilib yuborgan. Qaysi asar?", "«Mona Liza»", ["«Sirli kechki ovqat»", "«Venera tug'ilishi»", "«Yulduzli tun»"], "Leonardo da Vinchining «Mona Liza» (Jokonda) asarini Luvr xodimi bo'lgan Vinchenso Perudja o'g'irlagan."],
    [2, "Bu qadimiy savdo yo'liga nomni 1877-yilda nemis geografi Ferdinand fon Rixtgofen bergan. Yo'l Xitoydan O'rta yer dengizigacha cho'zilgan. Qaysi yo'l?", "Buyuk ipak yo'li", ["Ziravorlar yo'li", "Kahrabo yo'li", "Choy yo'li"], "Samarqand, Buxoro, Xiva, Marg'ilon — Buyuk ipak yo'lining eng muhim shaharlari."],
    [3, "Bu shahar 2007-yilda o'zining 2750 yilligini nishonlagan. Qaysi shahar?", "Samarqand", ["Buxoro", "Toshkent", "Termiz"], "Buxoro 1997-yilda 2500, Termiz 2002-yilda 2500, Toshkent 2009-yilda 2200 yilligini nishonlagan."],
    [3, "Afsonaga ko'ra, «qabrimni ochgan kishi urush balosiga duchor bo'ladi». 1941-yil iyun oyida olimlar shu qabrni ochishdi — bir necha kundan keyin urush boshlandi. Kimning qabri?", "Amir Temur", ["Mirzo Ulug'bek", "Bobur", "Alisher Navoiy"], "Go'ri Amir maqbarasidagi qabr 1941-yil 20–21-iyun kunlari ochilgan, 22-iyunda esa Germaniya SSSRga hujum qildi."],
    [3, "Bu antropolog odamning bosh suyagi bo'yicha uning yuzini tiklash usulini yaratgan va Amir Temur hamda Ulug'bekning qiyofasini shu usulda tiklagan. Kim?", "Mixail Gerasimov", ["Vasiliy Vyatkin", "Mixail Masson", "Galina Pugachenkova"], "M. M. Gerasimov plastik rekonstruksiya usuli asoschisi; u Yaroslav Mudriy va Ivan Grozniy qiyofasini ham tiklagan."],
    [3, "Go'ri Amirdagi Amir Temur qabri ustidagi to'q yashil tosh dunyodagi eng katta shu tosh bo'laklaridan biri, deyiladi. Qaysi tosh?", "Nefrit", ["Marmar", "Granit", "Lazurit"], "Nefrit (yashma) tosh Ulug'bek davrida keltirilgan; keyinroq u ikkiga bo'lingan."],
    [3, "Xivadagi bu minora tugatilmay qolgani uchun «Kalta minor» deb ataladi. Uni qaysi xon qurdira boshlagan?", "Muhammad Aminxon", ["Ollohqulixon", "Muhammad Rahimxon", "Asfandiyorxon"], "Muhammad Aminxon 1855-yilda halok bo'lgach, qurilish to'xtab qolgan; minora sirlangan koshinlar bilan qoplangan."],
    [3, "Bu sarkarda mil. avv. 329-yilda Marokandani (Samarqandni) egallagan. Sharq xalqlari uni «Iskandar Zulqarnayn» — «ikki shoxli Iskandar» deb atashgan. Kim?", "Aleksandr Makedonskiy", ["Kir II", "Doro I", "Chingizxon"], "Qadimgi tangalarda Iskandar boshida qo'chqor shoxlari bilan tasvirlangan — «Zulqarnayn» laqabi shundan."]
  ]);

  /* ---------------- zk3: Til, adabiyot va topishmoqlar ---------------- */
  topic("zk3", "Zakovat · Til, adabiyot va topishmoqlar", [
    [1, "Qaysi so'z o'ngdan ham, chapdan ham bir xil o'qiladi?", "Kiyik", ["Kitob", "Daryo", "Olma"], "Bunday so'zlar palindrom deyiladi: kiyik, qiziq, qozoq…"],
    [1, "Topishmoq: «Bir qozonda ikki xil osh». Bu nima?", "Tuxum", ["Tarvuz", "Anor", "Yong'oq"], "Tuxumning ichida oqi va sarig'i bor — «ikki xil osh»."],
    [1, "«Qo'li ochiq» iborasi qanday odamga nisbatan aytiladi?", "Saxiy odamga", ["Qo'lqopsiz odamga", "Dangasa odamga", "Ishsiz odamga"], "«Qo'li ochiq» — saxiy, bor narsasini ayamaydigan odam."],
    [1, "«Tuyaning dumi yerga tekkanda» iborasi nimani anglatadi?", "Hech qachon", ["Tez orada", "Qishda", "Ertaga ertalab"], "Tuyaning dumi kalta — yerga hech qachon tegmaydi."],
    [1, "«O'tkan kunlar» — o'zbek adabiyotidagi birinchi roman. Uning muallifi kim?", "Abdulla Qodiriy", ["Abdulla Qahhor", "Cho'lpon", "Oybek"], "Roman 1920-yillarda yozilgan; bosh qahramonlari — Otabek va Kumush."],
    [1, "«Shum bola» qissasi asosida mashhur film olingan. Qissa muallifi kim?", "G'afur G'ulom", ["Abdulla Qahhor", "Said Ahmad", "Xudoyberdi To'xtaboyev"], "«Shum bola» 1936-yilda yozilgan; film 1977-yilda suratga olingan."],
    [1, "«Sariq devni minib» va «Sehrli qalpoqcha» asarlarining muallifi kim?", "Xudoyberdi To'xtaboyev", ["G'afur G'ulom", "Anvar Obidjon", "Hakim Nazir"], "Hoshimjon — «Sariq devni minib» qahramoni."],
    [2, "Alisher Navoiy fors tilidagi she'rlarini qaysi taxallus bilan yozgan?", "Foniy", ["Navoiy", "Huvaydo", "Nodira"], "Turkiy she'rlarida «Navoiy» (navo — kuy, ohang), forsiy she'rlarida «Foniy» (o'tkinchi) taxallusini qo'llagan."],
    [2, "Navoiyning «Xamsa»si nechta dostondan iborat?", "5 ta", ["3 ta", "4 ta", "7 ta"], "«Xamsa» arabcha «beshlik» degani: Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab'ai sayyor, Saddi Iskandariy."],
    [2, "Navoiy «Muhokamat ul-lug'atayn» asarida qaysi ikki tilni qiyoslab, birining boyligini isbotlagan?", "Turkiy va fors tillarini", ["Arab va fors tillarini", "Turkiy va arab tillarini", "Fors va hind tillarini"], "«Muhokamat ul-lug'atayn» — «Ikki til muhokamasi» (1499)."],
    [2, "«Qo'lni yuvib, qo'ltiqqa urmoq» iborasi nimani anglatadi?", "Umidni butunlay uzib, voz kechmoq", ["Ishga astoydil kirishmoq", "Ozodalikka rioya qilmoq", "Mehmonni kutib olmoq"], "Masalan: «Undan qo'lingni yuvib qo'ltig'ingga ur» — endi undan umid qilma."],
    [2, "O'zbekiston Respublikasi Davlat madhiyasi so'zlarining muallifi kim?", "Abdulla Oripov", ["Erkin Vohidov", "Muhammad Yusuf", "Zulfiya"], "Madhiya musiqasi Mutal Burhonovniki; madhiya 1992-yil 10-dekabrda tasdiqlangan."],
    [2, "Qaysi Shekspir qahramoni «Bo'lmoq yoki bo'lmaslik — mana masala» deydi?", "Gamlet", ["Otello", "Qirol Lir", "Makbet"], "Daniya shahzodasi Gamlet monologi — jahon adabiyotidagi eng mashhur satrlardan."],
    [2, "Lotin yozuvidagi hozirgi o'zbek alifbosida nechta harf bor (tutuq belgisidan tashqari)?", "29 ta", ["26 ta", "33 ta", "35 ta"], "24 ta oddiy lotin harfi (C va W yo'q) + O', G', Sh, Ch, Ng = 29 ta; bulardan tashqari tutuq belgisi (') ham bor."],
    [3, "«Kitob» so'zi o'zbek tiliga qaysi tildan o'zlashgan?", "Arab tilidan", ["Fors tilidan", "Rus tilidan", "Xitoy tilidan"], "Arabcha «kataba» — «yozdi»; maktab, kotib, maktub so'zlari ham shu o'zakdan."],
    [3, "«Daftar» so'zining ildizi yunoncha «diftera» — «oshlangan teri». Qadimda daftar varaqlari nimadan bo'lgan?", "Hayvon terisidan (pergament)", ["Toshdan", "Palma barglaridan", "Loydan"], "So'z yunonchadan fors va arab tillari orqali bizga yetib kelgan."],
    [3, "«Samovar» so'zi qaysi tildan kirgan? So'zma-so'z «o'zi qaynatadigan» degani.", "Rus tilidan", ["Fors tilidan", "Arab tilidan", "Turk tilidan"], "Rus tilida «sam» — o'zi, «varit» — qaynatmoq."],
    [3, "Nodirabegim bilan zamondosh bo'lgan shoira «Uvaysiy» taxallusi bilan ijod qilgan. Uning asl ismi nima?", "Jahon otin", ["Mohlaroyim", "Zebuniso", "Dilshodi Barno"], "Mohlaroyim — Nodiraning asl ismi. Uvaysiy (Jahon otin) Marg'ilonda yashagan."],
    [3, "Bu shoir va hukmdorning «Boburnoma» asari ko'plab tillarga tarjima qilingan. U Hindistonda qaysi sulolaga asos solgan?", "Boburiylar", ["Temuriylar", "Shayboniylar", "Somoniylar"], "Bobur 1526-yilda Panipatda g'alaba qozonib, Hindistonda Boburiylar sulolasini boshlab bergan."]
  ]);

  /* ---------------- zk4: Qora quti ---------------- */
  topic("zk4", "Zakovat · Qora quti: qutida nima bor?", [
    [1, "⬛ Qora qutida nima bor? 1) U bilan yozishadi va chizishadi. 2) Uni charxlashadi. 3) Ichida grafit bor.", "Qalam", ["Ruchka", "O'chirg'ich", "Bo'r"], "Qalam o'zagi — grafit va loy aralashmasi; nomi «qamish» bilan bog'liq."],
    [1, "⬛ Qora qutida nima bor? 1) Uning tishlari bor, lekin tishlamaydi. 2) Har kuni ertalab sochingizga tegadi.", "Taroq", ["Arra", "Qaychi", "Tish cho'tkasi"], "Topishmoqlarda «tish» ko'pincha taroq yoki arraga ishora."],
    [1, "⬛ Qora qutida nima bor? 1) U ochilsa — yomg'ir sizga tegmaydi. 2) Yopilsa — burchakda jim turadi.", "Soyabon", ["Qalpoq", "Plash", "Chodir"], "Soyabon qadimda Xitoyda quyoshdan himoya uchun ishlatilgan."],
    [1, "⬛ Qora qutida nima bor? 1) Unda dengizlar bor, lekin suv yo'q. 2) Tog'lar bor, lekin tosh yo'q. 3) U yumaloq va aylanadi.", "Globus", ["Atlas", "Kompas", "Teleskop"], "Globus — Yerning kichraytirilgan modeli; atlas esa xaritalar kitobi, u aylanmaydi."],
    [1, "⬛ Qora qutida nima bor? 1) Uning yuzi va qo'llari bor, lekin ko'zi yo'q. 2) Doim yuradi, lekin oyog'i yo'q.", "Soat", ["Qo'g'irchoq", "Ko'zgu", "Robot"], "Soat «yuzi» — siferblat, «qo'llari» — millari."],
    [1, "⬛ Qora qutida nima bor? 1) Unda soat mili ham, raqam ham yo'q. 2) Uni ag'darib qo'yasiz. 3) Ichida qum oqadi.", "Qum soat", ["Quyosh soati", "Suv soati", "Sekundomer"], "Qum soat oqib tugagach, qayta ag'darib ishlatiladi."],
    [1, "⬛ Qora qutida nima bor? 1) Uni qulfga solib burasangiz — eshik ochiladi.", "Kalit", ["Qulf", "Tutqich", "Zanjir"], "Kalit va qulf — juft ixtiro."],
    [2, "⬛ Qora qutida nima bor? 1) Ixtirosi 1938-yilga, vengriyalik Laslo Biroga tegishli. 2) Uchida mitti sharcha aylanadi. 3) Bugun dunyoda eng ko'p ishlatiladigan yozuv quroli.", "Sharikli ruchka", ["Qalam", "Flomaster", "Siyohli pero"], "Biro ruchkasi siyohni sharcha orqali bir tekis chiqaradi; ba'zi mamlakatlarda u hali ham «biro» deb ataladi."],
    [2, "⬛ Qora qutida nima bor? 1) Uning vatani Xitoy. 2) Karvonlar sahroda u bilan yo'l topgan. 3) Strelkasi doim shimolni ko'rsatadi.", "Kompas", ["Soat", "Teleskop", "Astrolyabiya"], "Kompas strelkasi — magnit; u Yerning magnit maydoni bo'ylab buriladi."],
    [2, "⬛ Qora qutida nima bor? 1) Uni 1903-yilda amerikalik Meri Anderson patentlagan. 2) U faqat yomg'ir yoki qorda kerak bo'ladi. 3) Har bir mashinada bor.", "Oyna tozalagich («dvornik»)", ["Fara", "Signal", "Spidometr"], "Meri Anderson tramvay haydovchisi qorni artish uchun tez-tez to'xtashini ko'rib, shu ixtiroga keldi."],
    [2, "⬛ Qora qutida nima bor? 1) U Xitoyda ixtiro qilingan, lekin Samarqanddagisi butun Sharqda mashhur bo'lgan. 2) Tut po'stlog'idan ham tayyorlangan. 3) Kitob va daftarlar undan.", "Qog'oz", ["Ipak mato", "Pergament", "Papirus"], "VIII asrdan Samarqand qog'oz ishlab chiqarish markaziga aylangan; «Samarqand qog'ozi» qadrlangan."],
    [2, "⬛ Qora qutida nima bor? 1) Ichida suyuqlik yoki sensor bor, lekin ichib bo'lmaydi. 2) Shifokor uni qo'ltig'ingizga qo'yadi. 3) Me'yori — 36,6.", "Termometr", ["Tonometr", "Stetoskop", "Shprits"], "Tonometr qon bosimini, stetoskop yurak urishini o'lchaydi."],
    [2, "⬛ Qora qutida nima bor? 1) Unda 64 ta katak bor. 2) Qirol bor, lekin saroy yo'q. 3) O'yin Hindistonda paydo bo'lgan, deyiladi.", "Shaxmat taxtasi", ["Shashka taxtasi", "Nard", "Domino"], "Shaxmatning ajdodi — hindlarning «chaturanga» o'yini."],
    [2, "⬛ Qora qutida nima bor? 1) U oq-qora. 2) 52 ta oq va 36 ta qora klavishi bor. 3) U musiqa asbobi.", "Fortepiano (pianino)", ["Akkordeon", "Dutor", "Rubob"], "Fortepianoda jami 88 ta klavish: 52 oq va 36 qora."],
    [2, "⬛ Qora qutida nima bor? 1) Uni Alfred Nobel ixtiro qilgan. 2) Undan topilgan boylik bilan mashhur mukofot ta'sis etilgan. 3) Qutini ehtiyot bilan oching!", "Dinamit", ["Porox", "Benzin", "Gugurt"], "Nobel 1867-yilda dinamitni patentlagan; vasiyatiga ko'ra 1901-yildan Nobel mukofoti beriladi."],
    [3, "⬛ Qora qutida nima bor? 1) Ilk namunalari 1590-yillarda Gollandiyada paydo bo'lgan. 2) Robert Guk u orqali probkani ko'rib, fanga «hujayra» so'zini kiritgan. 3) U kichikni katta qilib ko'rsatadi.", "Mikroskop", ["Teleskop", "Lupa", "Durbin"], "Guk 1665-yilda «Mikrografiya» kitobida «hujayra» (cell) atamasini birinchi bo'lib ishlatgan."],
    [3, "⬛ Qora qutida nima bor? 1) Uni 1974-yilda vengriyalik me'mor-o'qituvchi talabalariga fazoviy tasavvurni o'rgatish uchun yasagan. 2) Uning 43 kvintillionga yaqin holati bor. 3) 6 ta rangli yuzi bor.", "Rubik kubigi", ["Tetris", "Lego", "Domino"], "Erne Rubik kubigini yig'ish bo'yicha rekord — 4 soniyadan ham kam."],
    [3, "⬛ Qora qutida nima bor? 1) Ichida bir nechta ko'zgu va rangli shisha bo'lakchalari bor. 2) Aylantirsangiz, naqsh o'zgaradi. 3) Nomi yunoncha «go'zal ko'rinishni ko'raman» degani.", "Kaleydoskop", ["Periskop", "Prizma", "Teleskop"], "Kaleydoskopni 1816-yilda shotlandiyalik Devid Bryuster ixtiro qilgan."],
    [3, "⬛ Qora qutida bu asbobning juda kichik nusxasi bor. 1) Ulug'bek rasadxonasidagi asl nusxasining radiusi 40 metrga yaqin bo'lgan. 2) U bilan Quyosh va yulduzlarning balandligi o'lchangan.", "Sekstant (Faxriy sekstant)", ["Teleskop", "Astrolyabiya", "Globus"], "Ulug'bekning «Faxriy sekstanti» o'z davrining eng katta astronomik asbobi edi; uning qoldig'i bugun ham bor."]
  ]);

  /* ---------------- zk5: Matematik zakovat ---------------- */
  topic("zk5", "Zakovat · Matematik zakovat", [
    [1, "Ikki ota va ikki o'g'il baliq oviga borishdi. Har biri bittadan baliq tutdi, lekin baliqlar hammasi bo'lib 3 ta bo'ldi. Qanday qilib?", "Ular 3 kishi: bobo, ota va o'g'il", ["Bitta baliq qochib ketgan", "Biri baliq tutmagan", "Bitta baliq ikkiga bo'lingan"], "Ota bir vaqtning o'zida ham ota, ham o'g'il bo'la oladi."],
    [1, "Tomda 7 ta qaldirg'och o'tirgan edi. 3 tasi uchib ketdi. Tomda nechta tuya qoldi?", "Birorta ham (tomda tuya yo'q)", ["4 ta", "3 ta", "10 ta"], "Zakovatda savolni oxirigacha diqqat bilan eshitish kerak! 😉"],
    [1, "Bitta tuxumni 4 daqiqada qaynatish mumkin. 3 ta tuxumni bitta qozonda birga qaynatsak, necha daqiqa kerak?", "4 daqiqa", ["12 daqiqa", "8 daqiqa", "6 daqiqa"], "Tuxumlar bir vaqtda qaynaydi — vaqt qo'shilmaydi."],
    [1, "Agar 5 ta mushuk 5 ta sichqonni 5 daqiqada tutsa, 100 ta mushuk 100 ta sichqonni necha daqiqada tutadi?", "5 daqiqada", ["100 daqiqada", "20 daqiqada", "1 daqiqada"], "Har bir mushuk 5 daqiqada bitta sichqon tutadi — mushuklar soni qancha bo'lsa ham."],
    [1, "Bir g'isht 1 kg va yana yarim g'isht og'irlikda. G'isht necha kilogramm?", "2 kg", ["1,5 kg", "1 kg", "3 kg"], "x = 1 + x/2 ⇒ x/2 = 1 ⇒ x = 2 kg."],
    [1, "Pifagorchilar qaysi sonni «mukammal» deb atashgan, chunki u o'zidan kichik bo'luvchilari yig'indisiga teng (1 + 2 + 3)?", "6", ["10", "12", "9"], "Keyingi mukammal son — 28 = 1 + 2 + 4 + 7 + 14."],
    [2, "Bir oilada 5 o'g'il bor. Har bir o'g'ilning bittadan singlisi bor. Oilada nechta farzand?", "6 ta", ["10 ta", "5 ta", "7 ta"], "Singil bitta — u hamma o'g'illarning singlisi."],
    [2, "Poyezd Toshkentdan Samarqandga 120 km/soat, ikkinchisi Samarqanddan Toshkentga 80 km/soat tezlikda yo'lga chiqdi. Ular uchrashganda qaysi biri Toshkentga yaqinroq bo'ladi?", "Ikkalasi ham bir xil masofada", ["Birinchisi", "Ikkinchisi", "Tezlikka bog'liq"], "Uchrashgan paytda ular bir nuqtada turadi!"],
    [2, "Ali 1-qavatdan 3-qavatga 2 daqiqada chiqadi. Shu tezlikda 1-qavatdan 6-qavatga necha daqiqada chiqadi?", "5 daqiqada", ["4 daqiqada", "6 daqiqada", "3 daqiqada"], "1→3 — bu 2 ta zina oralig'i (1 daqiqadan). 1→6 — 5 ta oraliq, demak 5 daqiqa."],
    [2, "Soat 3:15 da soat mili bilan minut mili orasidagi burchak necha gradus?", "7,5°", ["0°", "15°", "30°"], "Minut mili 90° da. Soat mili 3 dan chorak yo'l o'tgan: 90° + 30°·¼ = 97,5°. Farq 7,5°."],
    [2, "Bir sutkada soat va minut millari necha marta ustma-ust tushadi?", "22 marta", ["24 marta", "12 marta", "11 marta"], "12 soatda 11 marta (har ~65 daqiqada), sutkada 22 marta."],
    [2, "2, 3, 4, 5 va 6 ga bo'lganda har doim 1 qoldiq beradigan eng kichik natural son (1 dan katta) qaysi?", "61", ["31", "121", "721"], "EKUK(2, 3, 4, 5, 6) = 60; 60 + 1 = 61."],
    [2, "Shaxmat taxtasining 1-katagiga 1 ta, 2-siga 2 ta, 3-siga 4 ta… bug'doy doni qo'yildi (har safar 2 baravar). 64-katakda nechta don bo'ladi?", "2⁶³ ta", ["2⁶⁴ ta", "64² ta", "128 ta"], "n-katakda 2ⁿ⁻¹ don; 64-katakda 2⁶³ ≈ 9,2·10¹⁸ — bu butun dunyo hosilidan ham ko'p."],
    [2, "Kim bolaligida 1 dan 100 gacha sonlar yig'indisini bir necha soniyada topgan, deyiladi (javob: 5050)?", "Karl Fridrix Gauss", ["Leonard Eyler", "Isaak Nyuton", "Gotfrid Leybnits"], "Gauss juftlarni qo'shgan: 1 + 100 = 2 + 99 = … = 101, bunday juftlar 50 ta: 50 · 101 = 5050."],
    [3, "100! = 1 · 2 · 3 · … · 100 ko'paytmaning oxirida nechta nol bor?", "24 ta", ["20 ta", "11 ta", "25 ta"], "Har bir nol 2·5 dan. 5 ga karralilar: 100:5 = 20, 25 ga karralilar yana 4 ta beshlik beradi — jami 24."],
    [3, "1 dan 100 gacha sonlar orasida qaysi birini Rim raqamlarida yozish uchun eng ko'p belgi kerak?", "88 (LXXXVIII)", ["99 (XCIX)", "78 (LXXVIII)", "49 (XLIX)"], "LXXXVIII — 8 ta belgi; 78 — 7 ta, 99 va 49 — 4 tadan."],
    [3, "3 ta qutining birida faqat olma, birida faqat nok, birida aralash meva bor. Yorliqlarning hammasi noto'g'ri yopishtirilgan. Barcha yorliqlarni to'g'rilash uchun kamida nechta mevani olib ko'rish kerak?", "1 ta (yorlig'ida «aralash» yozilgan qutidan)", ["2 ta", "3 ta", "Birorta ham kerak emas"], "«Aralash» yorliqli qutida aralash bo'lishi mumkin emas. Undan olma chiqsa — bu «olma» qutisi; qolgan ikkitasi o'z-o'zidan aniqlanadi."],
    [3, "3 ta eshikdan birining ortida avtomobil, qolganlarida echki. Siz 1-eshikni tanladingiz; boshlovchi echkili boshqa eshikni ochdi va tanlovni o'zgartirishni taklif qildi. O'zgartirsangiz, yutish ehtimoli qancha?", "2/3", ["1/2", "1/3", "1"], "Monti Xoll muammosi: birinchi tanlov 1/3 ehtimol bilan to'g'ri, demak qolgan eshik 2/3."],
    [3, "Sinfda kamida nechta o'quvchi bo'lsa, ulardan ikkitasining tug'ilgan kuni bir xil bo'lish ehtimoli 50% dan oshadi?", "23 ta", ["183 ta", "50 ta", "366 ta"], "«Tug'ilgan kunlar paradoksi»: 23 kishida juftliklar soni 253 ta — shuning uchun ehtimol tez o'sadi."]
  ]);
})();
