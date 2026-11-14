/*! Kuvonch Academy — viktorina: Biologiya, Geografiya, Tarix, Ona tili savollari
 *  b1–b3 Biologiya · g1–g3 Geografiya · h1–h3 Tarix · o1–o3 Ona tili
 *  Har bir mavzu: daraja bo'yicha savollar banki + protsedura (ro'yxatdan) generatorlar.
 *  Banki elementi: [daraja(1-3), savol, javob, [noto'g'ri variantlar], "qisqa izoh"] */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle;

  /* ---------- yordamchilar ---------- */
  function Q(q, a, w, steps) {
    a = String(a);
    var seenW = {}, ws = [];
    seenW[a.toLowerCase()] = 1;
    (w || []).forEach(function (x) { x = String(x); var k = x.toLowerCase(); if (!seenW[k] && x !== "") { seenW[k] = 1; ws.push(x); } });
    return { q: q, a: a, w: ws, steps: steps || [], lang: S.lang() };
  }
  var REC = {};
  function seen(id, q) { return (REC[id] || []).indexOf(q) > -1; }
  function remember(id, q) { var r = REC[id] || (REC[id] = []); r.push(q); if (r.length > 24) r.shift(); }
  // L darajadagi elementlar (bo'lmasa — eng yaqin daraja)
  function lvPool(items, L) {
    for (var d = 0; d < 3; d++) {
      var o = items.filter(function (it) { return Math.abs(it[0] - L) === d; });
      if (o.length) return o;
    }
    return items;
  }
  function fromBank(id, items, L) {
    var pool = lvPool(items, L), fr = pool.filter(function (it) { return !seen(id, it[1]); });
    var it = pick(fr.length ? fr : pool);
    return Q(it[1], it[2], shuffle(it[3]), it[4] ? [it[4]] : []);
  }
  // ro'yxatdan n ta tasodifiy element (a dan farqli)
  function others(list, a, n) {
    return shuffle(list.filter(function (x) { return x !== a; })).slice(0, n);
  }
  // gens: [{p: ehtimol, fn: function(L){ return Q(...) | null }}, ...]
  function topic(id, title, items, gens) {
    S.register(id, function (L) {
      L = L === 2 || L === 3 ? L : 1;
      var p = null, t = 0;
      do {
        p = null;
        var r = Math.random(), acc = 0;
        for (var i = 0; gens && i < gens.length; i++) {
          acc += gens[i].p;
          if (r < acc) { p = gens[i].fn(L); break; }
        }
        if (!p) p = fromBank(id, items, L);
      } while (seen(id, p.q) && ++t < 15);
      remember(id, p.q);
      return p;
    }, title);
  }
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }
  // ro'yxatdan n ta tasodifiy element (ex dagilardan va o'zaro farqli)
  function otherN(list, ex, n) {
    var out = [];
    shuffle(list).forEach(function (x) { if (out.length < n && ex.indexOf(x) < 0 && out.indexOf(x) < 0) out.push(x); });
    return out;
  }
  // daraja bo'yicha hovuz: L1 — faqat 1-daraja, L2 — 1–2, L3 — 2–3 (idx — daraja ustuni)
  function lvList(list, L, idx) {
    var p = list.filter(function (x) { var d = x[idx]; return L === 1 ? d === 1 : L === 2 ? d <= 2 : d >= 2; });
    return p.length ? p : list;
  }

  /* ================= b1 Biologiya · Hujayra va tirik organizmlar ================= */
  var B1 = [
    [1, "Hujayraning \"energiya stansiyasi\" deb qaysi organoid ataladi?", "Mitoxondriya", ["Ribosoma", "Vakuola", "Yadro", "Xloroplast"], "Mitoxondriyada oziq moddalar parchalanib, energiya hosil bo'ladi."],
    [1, "O'simlik hujayrasida fotosintez qaysi organoidda boradi?", "Xloroplast", ["Mitoxondriya", "Ribosoma", "Yadro", "Vakuola"], "Xloroplastda yashil pigment — xlorofill bor."],
    [1, "Hujayrada irsiy axborot asosan qayerda saqlanadi?", "Yadroda", ["Vakuolada", "Hujayra po'stida", "Xloroplastda"], "Yadroda xromosomalar (DNK) joylashgan."],
    [1, "Hujayrani birinchi bo'lib mikroskopda kuzatib, \"hujayra\" deb atagan olim kim?", "Robert Guk", ["Charlz Darvin", "Gregor Mendel", "Lui Paster"], "Robert Guk 1665-yilda po'kak kesmasini mikroskopda kuzatgan."],
    [1, "Fotosintez jarayonida o'simlik havoga qaysi gazni chiqaradi?", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"], "Fotosintezda karbonat angidrid va suvdan glyukoza hosil bo'lib, kislorod ajraladi."],
    [1, "Fotosintez uchun o'simlik havodan qaysi gazni yutadi?", "Karbonat angidrid", ["Kislorod", "Azot", "Geliy"], "O'simlik CO₂ ni yutib, undan organik modda hosil qiladi."],
    [1, "Penitsillinni kim kashf etgan?", "Aleksandr Fleming", ["Lui Paster", "Robert Guk", "Charlz Darvin"], "Aleksandr Fleming penitsillinni 1928-yilda kashf etgan."],
    [1, "Tirik organizmlarning eng kichik tuzilish va hayot birligi nima?", "Hujayra", ["To'qima", "Organ", "Molekula"], "Barcha tirik organizmlar hujayralardan tuzilgan."],
    [1, "Qaysi organoid faqat o'simlik hujayrasida bo'ladi?", "Xloroplast", ["Yadro", "Mitoxondriya", "Ribosoma"], "Yadro, mitoxondriya va ribosoma hayvon hujayrasida ham bor."],
    [1, "Fotosintez uchun qaysi energiya manbai zarur?", "Quyosh nuri", ["Shamol", "Tuproq issiqligi", "Oy nuri"], "Fotosintez faqat yorug'likda boradi."],
    [1, "Hujayrani o'rab turuvchi va moddalar o'tishini boshqaruvchi qism nima?", "Hujayra membranasi", ["Yadro", "Vakuola", "Xloroplast"], "Membrana hujayraga kerakli moddalarni o'tkazadi."],
    [1, "Evolyutsiya nazariyasi asoschisi, \"Turlarning kelib chiqishi\" asari muallifi kim?", "Charlz Darvin", ["Gregor Mendel", "Robert Guk", "Aleksandr Fleming"], "Darvin bu asarni 1859-yilda nashr ettirgan."],
    [1, "O'simliklarga yashil rang beruvchi pigment qaysi?", "Xlorofill", ["Gemoglobin", "Melanin", "Karotin"], "Xlorofill xloroplastlarda joylashgan."],
    [1, "Hujayrani kattalashtirib ko'rish uchun qaysi asbobdan foydalaniladi?", "Mikroskop", ["Teleskop", "Barometr", "Termometr"], "Mikroskop mayda obyektlarni ko'p marta kattalashtiradi."],
    [2, "Hujayrada oqsil sintezi qaysi organoidda boradi?", "Ribosoma", ["Lizosoma", "Vakuola", "Xloroplast"], "Ribosomalarda aminokislotalardan oqsil yig'iladi."],
    [2, "Odamning tana (somatik) hujayralarida nechta xromosoma bor?", "46", ["23", "44", "48"], "Odamda 23 juft — 46 ta xromosoma bor."],
    [2, "Odamning jinsiy hujayralarida nechta xromosoma bor?", "23", ["46", "22", "92"], "Jinsiy hujayralarda xromosomalar soni ikki marta kam — 23 ta."],
    [2, "Shakllangan yadrosi bo'lmagan organizmlar qanday ataladi?", "Prokariotlar", ["Eukariotlar", "Viruslar", "Zamburug'lar"], "Bakteriyalar — prokariotlar: ularda shakllangan yadro yo'q."],
    [2, "Quyidagilardan qaysi biri prokariot organizm?", "Bakteriya", ["Achitqi zamburug'i", "Amyoba", "Xlorella"], "Bakteriya hujayrasida shakllangan yadro bo'lmaydi."],
    [2, "Hujayraviy tuzilishga ega bo'lmagan hayot shakli qaysi?", "Virus", ["Bakteriya", "Zamburug'", "Suvo'ti"], "Viruslar faqat tirik hujayra ichida ko'payadi."],
    [2, "Irsiyat qonunlarini no'xat ustida tajriba o'tkazib kashf etgan olim kim?", "Gregor Mendel", ["Charlz Darvin", "Lui Paster", "Robert Guk"], "Mendel — genetika fanining asoschisi."],
    [2, "Quturishga qarshi vaksina yaratgan fransuz olimi kim?", "Lui Paster", ["Aleksandr Fleming", "Gregor Mendel", "Robert Guk"], "Lui Paster — mikrobiologiya asoschilaridan biri."],
    [2, "O'simlik hujayrasida hujayra shirasi to'plangan bo'shliq nima deb ataladi?", "Vakuola", ["Yadro", "Ribosoma", "Mitoxondriya"], "Vakuolada suv va unda erigan moddalar to'planadi."],
    [2, "Nafas olish jarayonida hujayradan qaysi gaz ajralib chiqadi?", "Karbonat angidrid", ["Kislorod", "Azot", "Vodorod"], "Glyukoza kislorod ishtirokida parchalanib, CO₂, suv va energiya hosil bo'ladi."],
    [2, "Fotosintez natijasida qaysi organik modda hosil bo'ladi?", "Glyukoza", ["Oqsil", "Mochevina", "Gemoglobin"], "6CO₂ + 6H₂O → glyukoza + 6O₂ (yorug'likda)."],
    [2, "Irsiy axborotni saqlovchi molekula qisqacha qanday ataladi?", "DNK", ["ATF", "Glyukoza", "Gemoglobin"], "DNK — dezoksiribonuklein kislota."],
    [2, "Qo'ziqorinlar qaysi dunyoga kiradi?", "Zamburug'lar", ["O'simliklar", "Hayvonlar", "Bakteriyalar"], "Zamburug'lar alohida dunyo hisoblanadi."],
    [2, "Faqat bitta hujayradan iborat organizm qaysi?", "Amyoba", ["Qurbaqa", "Qayin", "Chumoli"], "Amyoba — bir hujayrali organizm."],
    [2, "Mendel tajribalarida qaysi o'simlikdan foydalangan?", "No'xat", ["Bug'doy", "Makkajo'xori", "Kartoshka"], "Mendel no'xatning belgilari irsiylanishini o'rgangan."],
    [2, "Antibiotiklar asosan qaysi kasallik qo'zg'atuvchilariga qarshi ishlatiladi?", "Bakteriyalarga", ["Viruslarga", "Allergiyaga", "Vitamin yetishmasligiga"], "Antibiotiklar viruslarga ta'sir qilmaydi."],
    [3, "DNK molekulasi qanday tuzilishga ega?", "Qo'sh spiral", ["Bir zanjirli halqa", "Uch zanjirli spiral", "Tekis qatlam"], "Uotson va Krik 1953-yilda DNKning qo'sh spiral tuzilishini aniqlagan."],
    [3, "Qaysi azotli asos DNK tarkibida bo'lmaydi?", "Uratsil", ["Adenin", "Timin", "Guanin", "Sitozin"], "Uratsil RNKda bo'ladi, DNKda uning o'rnida timin."],
    [3, "Komplementarlik qoidasiga ko'ra DNKda adenin qaysi asos bilan juftlashadi?", "Timin", ["Guanin", "Sitozin", "Uratsil"], "DNKda A — T, G — S juftlashadi."],
    [3, "DNKda guanin qaysi asos bilan juftlashadi?", "Sitozin", ["Adenin", "Timin", "Uratsil"], "DNKda A — T, G — S juftlashadi."],
    [3, "Tana hujayralari qaysi usulda bo'linadi (xromosomalar soni saqlanadi)?", "Mitoz", ["Meyoz", "Kurtaklanish", "Konyugatsiya"], "Mitozda yangi hujayralar ona hujayradagi kabi xromosomaga ega bo'ladi."],
    [3, "Jinsiy hujayralar qaysi bo'linish natijasida hosil bo'ladi?", "Meyoz", ["Mitoz", "Amitoz", "Kurtaklanish"], "Meyozda xromosomalar soni ikki marta kamayadi."],
    [3, "Fotosintezda ajraladigan kislorod qaysi moddaning parchalanishidan hosil bo'ladi?", "Suv", ["Karbonat angidrid", "Glyukoza", "Xlorofill"], "Yorug'lik bosqichida suv parchalanadi (fotoliz) va O₂ ajraladi."],
    [3, "Hujayrada moddalarni parchalovchi fermentlarga boy organoid qaysi?", "Lizosoma", ["Ribosoma", "Xloroplast", "Hujayra markazi"], "Lizosoma — hujayraning \"hazm qilish\" organoidi."],
    [3, "Oqsillarning monomerlari nima?", "Aminokislotalar", ["Nukleotidlar", "Glyukoza", "Yog' kislotalari"], "Oqsil molekulasi aminokislotalardan tuzilgan."],
    [3, "DNK va RNKning monomerlari nima?", "Nukleotidlar", ["Aminokislotalar", "Glyukoza", "Glitserin"], "Nuklein kislotalar nukleotidlardan tuzilgan."],
    [3, "Odamda erkak jinsini belgilovchi jinsiy xromosomalar qaysi?", "XY", ["XX", "YY", "XO"], "Ayollarda XX, erkaklarda XY jinsiy xromosomalar."],
    [3, "Hujayraning tuzilishi va faoliyatini o'rganuvchi fan qaysi?", "Sitologiya", ["Genetika", "Ekologiya", "Anatomiya"], "Sitologiya — hujayra haqidagi fan."],
    [3, "Irsiyat va o'zgaruvchanlikni o'rganuvchi fan qaysi?", "Genetika", ["Sitologiya", "Botanika", "Ekologiya"], "Genetika asoslarini Gregor Mendel yaratgan."],
    [3, "Glyukozaning kislorodsiz parchalanish bosqichi nima deb ataladi?", "Glikoliz", ["Fotoliz", "Fotosintez", "Transkripsiya"], "Glikoliz sitoplazmada kislorodsiz boradi."],
    [3, "DNKdagi axborotning RNKga ko'chirilishi nima deb ataladi?", "Transkripsiya", ["Translyatsiya", "Replikatsiya", "Mutatsiya"], "Transkripsiya — DNK asosida RNK sintezi."],
    [1, "Hujayra ichini to'ldirib turuvchi yarim suyuq modda nima deb ataladi?", "Sitoplazma", ["Vakuola", "Membrana", "Yadro"], "Organoidlar sitoplazmada joylashgan."],
    [1, "Hayvon hujayrasida qaysi organoid bo'lmaydi?", "Xloroplast", ["Mitoxondriya", "Ribosoma", "Yadro"], "Xloroplast faqat o'simlik hujayrasida bo'ladi."],
    [1, "Mikroskopning ko'z bilan qaraladigan qismi qanday ataladi?", "Okulyar", ["Obyektiv", "Tubus", "Buyum stolchasi"], "Obyektiv — preparatga qaragan linza."],
    [1, "Mikroskopda preparat qayerga qo'yiladi?", "Buyum stolchasiga", ["Okulyarga", "Tubusga", "Shtativ asosiga"], "Preparat buyum stolchasiga qo'yilib, qisqichlar bilan mahkamlanadi."],
    [1, "Quyidagilardan qaysi biri tirik organizmlarga xos xususiyat?", "Ko'payish", ["Erish", "Kristallanish", "Bug'lanish"], "Oziqlanish, nafas olish, o'sish, ko'payish — tiriklik belgilari."],
    [1, "Xamirni ko'pchitish uchun qaysi zamburug'dan foydalaniladi?", "Achitqi zamburug'i", ["Mog'or zamburug'i", "Oq qo'ziqorin", "Qorakuya"], "Achitqi zamburug'i karbonat angidrid ajratib, xamirni ko'pchitadi."],
    [1, "Qatiq va pishloq tayyorlashda qaysi mikroorganizmlardan foydalaniladi?", "Sut achituvchi bakteriyalar", ["Sil tayoqchasi", "Mog'or zamburug'i", "Viruslar"], "Sut achituvchi bakteriyalar sutni achitadi."],
    [1, "Kraxmalga yod eritmasi tomizilsa, qanday rang paydo bo'ladi?", "Ko'k", ["Qizil", "Sariq", "Yashil"], "Yod kraxmal bilan ko'k rang hosil qiladi."],
    [1, "Tirik organizmlarni o'rganuvchi fan qaysi?", "Biologiya", ["Geografiya", "Fizika", "Astronomiya"], "\"Bios\" — hayot, \"logos\" — ta'limot."],
    [1, "Tuzilishi va vazifasi bir xil bo'lgan hujayralar guruhi nima deyiladi?", "To'qima", ["Organ", "Organizm", "Organoid"], "Masalan, muskul to'qimasi, nerv to'qimasi."],
    [2, "Tayyor organik moddalar bilan oziqlanuvchi organizmlar qanday ataladi?", "Geterotroflar", ["Avtotroflar", "Prokariotlar", "Produtsentlar"], "Hayvonlar va zamburug'lar — geterotroflar."],
    [2, "Anorganik moddalardan organik modda hosil qiluvchi organizmlar qanday ataladi?", "Avtotroflar", ["Geterotroflar", "Saprofitlar", "Parazitlar"], "Yashil o'simliklar — avtotroflar."],
    [2, "Bakteriyalar asosan qanday ko'payadi?", "Ikkiga bo'linib", ["Kurtaklanib", "Urug' bilan", "Tuxum qo'yib"], "Qulay sharoitda bakteriya har 20–30 daqiqada bo'linishi mumkin."],
    [2, "Penitsillin qaysi organizmdan olinadi?", "Mog'or zamburug'idan", ["Achitqi zamburug'idan", "Sut achituvchi bakteriyadan", "Qo'ziqorindan"], "Fleming penitsill mog'or zamburug'idan antibiotik ajratgan."],
    [2, "Qaysi kasallikni virus qo'zg'atadi?", "Gripp", ["Sil", "Vabo", "Raxit"], "Sil va vabo — bakterial kasallik, raxit — D vitamini yetishmasligi."],
    [2, "Qaysi kasallikni bakteriya qo'zg'atadi?", "Sil", ["Gripp", "Qizamiq", "Suvchechak"], "Gripp, qizamiq, suvchechak — virusli kasalliklar."],
    [2, "Kraxmal qaysi organik moddalar guruhiga kiradi?", "Uglevodlar", ["Oqsillar", "Yog'lar", "Nuklein kislotalar"], "Kraxmal — glyukozadan tuzilgan polisaxarid."],
    [2, "Tirik hujayra tarkibida eng ko'p bo'ladigan modda qaysi?", "Suv", ["Oqsil", "Yog'", "Mineral tuzlar"], "Hujayra massasining katta qismini suv tashkil etadi."],
    [2, "Bir nechta to'qimadan tuzilgan, muayyan vazifani bajaruvchi tana qismi nima deyiladi?", "Organ", ["To'qima", "Organoid", "Hujayra"], "Masalan, yurak, barg, ildiz — organlar."],
    [2, "Hujayrada energiyani to'plovchi va tashuvchi universal modda qaysi?", "ATF", ["DNK", "RNK", "Xlorofill"], "ATF asosan mitoxondriyalarda hosil bo'ladi."],
    [3, "Achitqi zamburug'i qanday usulda ko'payadi?", "Kurtaklanish", ["Urug' bilan", "Ildizpoya bilan", "Changlanish orqali"], "Ona hujayrada kurtak paydo bo'lib, yangi hujayraga aylanadi."],
    [3, "Viruslar qanday tarkibiy qismlardan iborat?", "Nuklein kislota va oqsil qobiq", ["Yadro va sitoplazma", "Hujayra devori va vakuola", "Mitoxondriya va ribosoma"], "Viruslarda hujayraviy tuzilish yo'q."],
    [3, "Bakteriyalarni zararlovchi viruslar qanday ataladi?", "Bakteriofaglar", ["Fagotsitlar", "Antibiotiklar", "Prokariotlar"], "Bakteriofag — \"bakteriya yeyuvchi\" degani."],
    [3, "Mitoxondriya ichki membranasining burmalari nima deb ataladi?", "Kristalar", ["Granalar", "Tilakoidlar", "Sisternalar"], "Kristalarda ATF sintezlanadi."],
    [3, "Fotosintezning yorug'lik bosqichi xloroplastning qaysi tuzilmalarida boradi?", "Tilakoidlarda", ["Kristalarda", "Ribosomalarda", "Lizosomalarda"], "Tilakoidlar to'planib granalarni hosil qiladi."],
    [3, "RNK tarkibidagi uglevod qaysi?", "Riboza", ["Dezoksiriboza", "Glyukoza", "Saxaroza"], "DNKda esa dezoksiriboza bo'ladi."],
    [3, "DNK tarkibidagi uglevod qaysi?", "Dezoksiriboza", ["Riboza", "Glyukoza", "Fruktoza"], "Dezoksiribonuklein kislota nomi shundan."],
    [3, "Ribosomada iRNK asosida oqsil sintezlanishi nima deb ataladi?", "Translyatsiya", ["Transkripsiya", "Replikatsiya", "Glikoliz"], "Transkripsiya — DNK asosida RNK sintezi."],
    [3, "DNK molekulasining o'z nusxasini hosil qilishi nima deyiladi?", "Replikatsiya", ["Transkripsiya", "Translyatsiya", "Mutatsiya"], "Hujayra bo'linishidan oldin DNK ikki hissa ortadi."],
    [3, "Genlar yoki xromosomalarning to'satdan, irsiy o'zgarishi nima deyiladi?", "Mutatsiya", ["Modifikatsiya", "Replikatsiya", "Duragaylash"], "Mutatsiyalar avlodga beriladi."],
    [3, "Aa genotipli organizm qanday ataladi?", "Geterozigota", ["Gomozigota", "Gaploid", "Mutant"], "Allellari har xil — geterozigota, bir xil (AA, aa) — gomozigota."],
    [3, "aa genotipli organizm qanday ataladi?", "Retsessiv gomozigota", ["Dominant gomozigota", "Geterozigota", "Duragay"], "Ikkala allel ham retsessiv."],
    [3, "To'liq dominantlikda Aa × Aa chatishtirilsa, avlodda fenotip bo'yicha nisbat qanday?", "3 : 1", ["1 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1"], "Mendelning ikkinchi (ajralish) qonuni."],
    [3, "Aa × Aa chatishtirilsa, avlodda genotip bo'yicha nisbat qanday?", "1 : 2 : 1", ["3 : 1", "1 : 1", "2 : 1"], "AA : 2Aa : aa."],
    [3, "To'liq dominantlikda Aa × aa chatishtirilsa, avlodda fenotip bo'yicha nisbat qanday?", "1 : 1", ["3 : 1", "1 : 2 : 1", "Hammasi bir xil"], "Aa va aa avlodlar teng miqdorda hosil bo'ladi."],
    [3, "Fermentlar kimyoviy tabiatiga ko'ra asosan qanday moddalar?", "Oqsillar", ["Uglevodlar", "Yog'lar", "Mineral tuzlar"], "Fermentlar — biologik katalizatorlar."],
    [3, "Hujayradagi xromosomalar to'plamining soni, shakli va o'lchami majmui nima deyiladi?", "Kariotip", ["Fenotip", "Genotip", "Genofond"], "Odam kariotipi 46 ta xromosomadan iborat."],
    [1,"O'simlik hujayrasining qobig'i asosan qaysi moddadan tuzilgan?","Tsellyulozadan",["Kraxmaldan","Oqsildan","Xitindan"],"Tsellyuloza o'simlik qobig'iga mustahkamlik beruvchi uglevod."],
    [1,"Hujayra qobig'i qanday asosiy vazifani bajaradi?","Shaklni saqlaydi va himoya qiladi",["Irsiy axborotni saqlaydi","Oqsil sintezlaydi","Energiya ishlab chiqaradi"],"Qobiq hujayrani tashqi ta'sirlardan himoya qilib, shaklini saqlaydi."],
    [1,"Hujayra yadrosi ichidagi ipga o'xshash tuzilmalar nima deb ataladi?","Xromosomalar",["Ribosomalar","Vakuolalar","Kristalar"],"Irsiy axborot xromosomalarda saqlanadi."],
    [1,"Mikroskopning preparatga qaragan linzalari qanday ataladi?","Obyektiv",["Okulyar","Tubus","Shtativ"],"Obyektiv preparatga eng yaqin linza bo'lib, tasvirni kattalashtiradi."],
    [1,"Hujayrada moddalarni to'plab, qadoqlab va tashqariga chiqarishda qaysi organoid qatnashadi?","Golji apparati",["Yadrocha","Mitoxondriya","Xloroplast"],"Golji apparati sekretsiya moddalarini qadoqlab, hujayradan chiqaradi."],
    [1,"Hujayra ichida moddalar tashiladigan kanallar hosil qiluvchi organoid qaysi?","Endoplazmatik to'r",["Lizosoma","Hujayra markazi","Vakuola"],"Endoplazmatik to'r yadrodan sitoplazmaga tarqalgan kanallar sistemasidir."],
    [1,"Yadroni tashqi tomondan o'rab turuvchi qavat nima deb ataladi?","Yadro qobig'i",["Hujayra qobig'i","Sitoplazma","Yadrocha"],"Yadro qobig'ida moddalar almashinuvini ta'minlovchi teshiklar bor."],
    [1,"Hujayra bo'linishida xromosomalarning ajralishida qatnashadigan organoid qaysi?","Hujayra markazi",["Ribosoma","Lizosoma","Xloroplast"],"Hujayra markazi bo'linishda duksimon iplarni hosil qiladi."],
    [1,"O'simlik bargidagi og'izchalar qanday vazifani bajaradi?","Gaz almashinuvini ta'minlaydi",["Suvni ildizdan tortadi","Organik modda hosil qiladi","Irsiy axborotni saqlaydi"],"Og'izchalar orqali karbonat angidrid kiradi, kislorod va suv bug'i chiqadi."],
    [1,"Zamburug'lar hujayra qobig'i asosan qaysi moddadan iborat?","Xitindan",["Tsellyulozadan","Kraxmaldan","Oqsildan"],"Zamburug' qobig'ining asosiy moddasi xitindir."],
    [1,"Kraxmal to'plovchi rangsiz plastidalar nima deb ataladi?","Leykoplastlar",["Xloroplastlar","Xromoplastlar","Mitoxondriyalar"],"Leykoplastlar rangsiz bo'lib, kraxmal zaxirasini saqlaydi."],
    [1,"Meva va gullarga sariq-qizil rang beruvchi plastidalar qaysilar?","Xromoplastlar",["Leykoplastlar","Xloroplastlar","Ribosomalar"],"Xromoplastlardagi pigmentlar meva va gullarga rang beradi."],
    [1,"Qaysi organizmlarning hujayralarida qobiq (devor) bo'lmaydi?","Hayvonlarda",["O'simliklarda","Zamburug'larda","Bakteriyalarda"],"Hayvon hujayrasida faqat tashqi membrana bo'ladi, qattiq qobiq yo'q."],
    [2,"Tayoqchasimon shakldagi bakteriyalar nima deb ataladi?","Batsillalar",["Kokklar","Vibrionlar","Spirillalar"],"Kokklar sharsimon, vibrionlar vergulsimon, spirillalar burama shaklda bo'ladi."],
    [2,"Bakteriyalar noqulay sharoitda nima hosil qiladi?","Sporalar",["Xivchinlar","Kiprikchalar","Mitseliylar"],"Spora qalin qobiq bilan qoplanib, noqulay sharoitda uzoq saqlanadi."],
    [2,"Lishaynik qanday organizmlarning birgalikda yashashidan hosil bo'ladi?","Zamburug' va suv o'ti",["Ikki xil zamburug'","O'simlik va bakteriya","Virus va zamburug'"],"Lishaynik — zamburug' bilan suv o'tining simbiozidir."],
    [2,"Saprofitlar qanday oziqlanadi?","O'lik organik qoldiqlar bilan",["Tirik organizm hisobidan","Faqat quyosh nuri hisobidan","Faqat mineral tuzlar hisobidan"],"Saprotroflar o'lik qoldiqlarni parchalab, undagi moddalarni o'zlashtiradi."],
    [2,"Viruslar qayerda ko'payish xususiyatiga ega?","Faqat tirik hujayra ichida",["Ochiq havoda","Tuproqda","Suvda"],"Viruslarda o'z metabolizmi bo'lmagani uchun ular faqat xo'jayin hujayrada ko'payadi."],
    [2,"Odamda ayol jinsini belgilovchi jinsiy xromosomalar qaysilar?","XX",["XY","YY","XXY"],"Ayol jinsida ikkita X xromosoma bo'ladi."],
    [2,"Organizmning tashqi belgilari majmui nima deb ataladi?","Fenotip",["Genotip","Kariotip","Genom"],"Fenotip genotip va muhit ta'sirida shakllanadigan belgilar majmuidir."],
    [2,"Chatishtirishda o'z belgisini ustun ko'rsatadigan gen qanday ataladi?","Dominant",["Retsessiv","Gomozigota","Geterozigota"],"Dominant gen geterozigota holatda ham o'z belgisini namoyon qiladi."],
    [2,"Spirtli achishda qanday moddalar hosil bo'ladi?","Etanol va karbonat angidrid",["Sut kislotasi va suv","Kislorod va suv","Glyukoza va kraxmal"],"Achitqi zamburug'lari glyukozani etanol va karbonat angidridga aylantiradi."],
    [2,"Osmos deb nimaga aytiladi?","Suvning yarim o'tkazgich membranadan o'tishi",["Gazlarning erkin tarqalishi","Qattiq zarrachalarning yutilishi","Moddalarning ferment yordamida parchalanishi"],"Osmosda suv kamroq konsentratsiyali eritmadan ko'proq konsentratsiyali tomonga o'tadi."],
    [2,"Amyoba qanday harakatlanadi?","Soxta oyoqchalar bilan",["Xivchin bilan","Kiprikchalar bilan","Qanotchalari bilan"],"Amyoba sitoplazmasining cho'zilishidan soxta oyoqchalar hosil bo'ladi."],
    [2,"Meyoz natijasida bitta ona hujayradan nechta hujayra hosil bo'ladi?","To'rtta",["Ikkita","Sakkizta","Bitta"],"Meyoz ikki marta bo'linib, to'rtta gaploid hujayra beradi."],
    [2,"Tirik hujayralarni birinchi bo'lib mikroskopda kuzatgan olim kim?","Anton van Levenguk",["Robert Guk","Gregor Mendel","Lui Paster"],"Levenguk birinchi bo'lib bakteriyalar va infuzoriyalarni ko'rgan."],
    [2,"Fotosintez natijasida hosil bo'lgan glyukoza o'simlikda qanday zaxira moddaga aylanadi?","Kraxmalga",["Xitinga","Glikogenga","Tsellyulozaga"],"O'simliklarda glyukozaning zaxira shakli kraxmaldir."],
    [3,"Yadrocha (yadrochik) nima hosil qilishda qatnashadi?","Ribosomalar",["Xromosomalar","Vakuolalar","Mitoxondriyalar"],"Yadrochada ribosoma subbirliklari sintezlanadi."],
    [3,"Bakteriya hujayrasida yadro o'rnida halqasimon DNK joylashgan soha nima deb ataladi?","Nukleoid",["Kariotip","Nukleotid","Sentromera"],"Bakteriyalarda yadro qobig'i yo'q, DNK nukleoid sohasida joylashadi."],
    [3,"Sianobakteriyalar qanday organizmlar hisoblanadi?","Fotosintez qiluvchi prokariotlar",["Geterotrof eukariotlar","Parazit viruslar","Ko'p hujayrali zamburug'lar"],"Sianobakteriyalarda yadro bo'lmaydi, lekin xlorofil bor."],
    [3,"Xemosintez qiluvchi bakteriyalar qaysi energiya hisobiga organik modda sintezlaydi?","Kimyoviy reaksiyalar energiyasi",["Quyosh nuri energiyasi","ATF zaxirasi hisobiga","Tayyor organik moddalar hisobiga"],"Xemosintezda anorganik moddalarning oksidlanish energiyasi ishlatiladi."],
    [3,"Fotosintezning qorong'ulik bosqichi xloroplastning qaysi qismida boradi?","Stromada",["Tilakoidlarda","Granalarda","Qobiqda"],"Qorong'ulik bosqichida karbonat angidrid stromada glyukozaga aylanadi."],
    [3,"DNKning ikki zanjirini bir-biriga bog'lab turuvchi bog'lar qanday nomlanadi?","Vodorod bog'lari",["Ion bog'lari","Kovalent bog'lar","Metall bog'lari"],"Azotli asoslar orasida vodorod bog'lari hosil bo'ladi."],
    [3,"DNK qo'sh spiral modelini taklif qilgan olimlar kimlar?","Uotson va Krik",["Shleyden va Shvann","Mendel va Morgan","Paster va Kox"],"Uotson va Krik 1953-yilda DNKning qo'sh spiral modelini taklif qilgan."],
    [3,"Hujayra nazariyasini ishlab chiqqan olimlar kimlar?","Shleyden va Shvann",["Uotson va Krik","Mendel va Morgan","Paster va Kox"],"Shleyden va Shvann barcha organizmlar hujayralardan tuzilganligini asoslagan."],
    [3,"Krossingover qaysi bo'linish jarayonida sodir bo'ladi?","Meyozda",["Mitozda","Amitozda","Kurtaklanishda"],"Meyozning birinchi bo'linishida gomologik xromosomalar o'rtasida krossingover boradi."],
    [3,"Xromosomaning ikkita xromatidasi qaysi qismda tutashib turadi?","Sentromerada",["Telomerada","Nukleoidda","Yadrochada"],"Sentromera ikki xromatidani bir-biriga bog'lab turadi."],
    [3,"tRNK hujayrada qanday vazifani bajaradi?","Aminokislotalarni ribosomaga tashiydi",["Irsiy axborotni yadroda saqlaydi","Xromosomalarni hosil qiladi","Kislorodni tashiydi"],"tRNK kodon bilan mos aminokislotani oqsil sintezi joyiga olib keladi."],
    [3,"iRNKdagi uchta nukleotiddan iborat birlik nima deb ataladi?","Kodon",["Antikodon","Kariotip","Nukleoid"],"Har bir kodon bitta aminokislotani kodlaydi."],
    [3,"Tuzli eritmaga solingan o'simlik hujayrasi suv yo'qotib, protoplastning qobiqdan ajralishi nima deb ataladi?","Plazmoliz",["Turgor","Osmos","Diffuziya"],"Plazmolizda hujayra suv yo'qotadi va protoplast qobiqdan uzoqlashadi."]
  ];
  // [qism, asosiy vazifasi (javob), "Hujayraning qaysi qismi ...?" uchun, daraja]
  var ORGANOID = [
    ["Mitoxondriya", "Energiya (ATF) hosil qilish", "oziq moddalarni parchalab, energiya (ATF) hosil qiladi", 1],
    ["Xloroplast", "Fotosintez", "yorug'likda organik modda hosil qiladi (fotosintez)", 1],
    ["Yadro", "Irsiy axborotni saqlash", "irsiy axborotni saqlaydi va hujayra faoliyatini boshqaradi", 1],
    ["Hujayra membranasi", "Moddalar o'tishini boshqarish", "hujayraga moddalar kirib-chiqishini boshqaradi", 1],
    ["Vakuola", "Hujayra shirasini to'plash", "hujayra shirasini to'playdi", 1],
    ["Sitoplazma", "Organoidlarni birlashtirish", "organoidlarni o'zaro birlashtiruvchi ichki muhit hisoblanadi", 1],
    ["Ribosoma", "Oqsil sintezi", "aminokislotalardan oqsil sintezlaydi", 2],
    ["Lizosoma", "Moddalarni parchalash", "fermentlar yordamida moddalarni parchalaydi (hujayra ichi hazmi)", 2],
    ["Golji apparati", "Moddalarni to'plash va chiqarish", "sintezlangan moddalarni to'playdi va hujayradan chiqaradi", 2],
    ["Endoplazmatik to'r", "Moddalarni hujayra ichida tashish", "moddalarni hujayra ichida tashiydi", 2],
    ["Hujayra devori", "Hujayraga mustahkamlik berish", "o'simlik hujayrasiga shakl va mustahkamlik beradi", 2],
    ["Hujayra markazi", "Bo'linishda ishtirok etish", "hayvon hujayrasining bo'linishida ishtirok etadi", 3],
    ["Xromoplast", "Gul va mevalarga rang berish", "gul va mevalarga sariq, qizil rang beradi", 3],
    ["Leykoplast", "Kraxmal to'plash", "zaxira oziq modda — kraxmalni to'playdi", 3],
    ["Yadrocha", "Ribosomalar hosil qilish", "yadro ichida ribosomalarni hosil qiladi", 3]
  ];
  // vazifasi qisman o'xshash qismlar bir-biriga chalg'ituvchi bo'lmaydi
  var ORG_X = {
    "Yadro": ["Mitoxondriya", "Xloroplast", "Yadrocha"], "Yadrocha": ["Yadro", "Ribosoma"], "Ribosoma": ["Yadrocha", "Endoplazmatik to'r"],
    "Endoplazmatik to'r": ["Golji apparati", "Ribosoma"], "Golji apparati": ["Endoplazmatik to'r", "Lizosoma"], "Lizosoma": ["Vakuola", "Golji apparati"],
    "Vakuola": ["Lizosoma", "Leykoplast", "Xromoplast"], "Leykoplast": ["Xloroplast", "Vakuola"], "Xromoplast": ["Vakuola", "Xloroplast"],
    "Hujayra devori": ["Hujayra membranasi"], "Hujayra membranasi": ["Hujayra devori"], "Sitoplazma": ["Hujayra membranasi"]
  };
  function genOrg(L) {
    var o = pick(lvList(ORGANOID, L, 3)), ex = [o[0]].concat(ORG_X[o[0]] || []);
    var rest = ORGANOID.filter(function (x) { return ex.indexOf(x[0]) < 0 && (L > 1 || x[3] <= 2); });
    var st = [o[0] + ": " + o[2] + "."];
    if (Math.random() < 0.5) return Q("Hujayraning qaysi qismi <b>" + o[2] + "</b>?", o[0], otherN(rest.map(function (x) { return x[0]; }), [], 4), st);
    return Q("<b>" + o[0] + "</b>ning asosiy vazifasi qaysi?", o[1], otherN(rest.map(function (x) { return x[1]; }), [], 4), st);
  }
  // [olim, hissasi (javob), "kim?" savoli, daraja]
  var OLIM_B = [
    ["Robert Guk", "Hujayrani kashf etgan", "Po'kak kesmasini mikroskopda kuzatib, \"hujayra\" atamasini fanga kiritgan olim kim?", 1],
    ["Charlz Darvin", "Evolyutsiya nazariyasini yaratgan", "Tabiiy tanlanish orqali evolyutsiya nazariyasini yaratgan olim kim?", 1],
    ["Gregor Mendel", "Irsiyat qonunlarini kashf etgan", "Genetika fanining asoschisi deb qaysi olim tan olingan?", 1],
    ["Lui Paster", "Quturishga qarshi vaksina yaratgan", "Oziq-ovqatni qizdirib zararsizlantirish (pasterizatsiya) usuli qaysi olim nomi bilan ataladi?", 1],
    ["Aleksandr Fleming", "Penitsillinni kashf etgan", "Birinchi antibiotik — penitsillinni 1928-yilda kashf etgan olim kim?", 1],
    ["Antoni van Levenguk", "Mikroblarni birinchi kuzatgan", "O'zi yasagan mikroskopda bakteriyalarni birinchi bo'lib kuzatgan olim kim?", 2],
    ["Shleyden va Shvann", "Hujayra nazariyasini yaratgan", "\"Barcha organizmlar hujayralardan tuzilgan\" degan hujayra nazariyasini kimlar yaratgan?", 2],
    ["Robert Kox", "Sil qo'zg'atuvchisini kashf etgan", "Sil kasalligi qo'zg'atuvchisi — sil tayoqchasini kim kashf etgan?", 2],
    ["Karl Linney", "Qo'sh nomlashni joriy etgan", "Har bir turni ikki so'zli lotincha nom bilan atashni joriy etgan olim kim?", 2],
    ["Uotson va Krik", "DNK qo'sh spiralini aniqlagan", "1953-yilda DNKning qo'sh spiral tuzilishini aniqlagan olimlar kimlar?", 3],
    ["Robert Broun", "Hujayra yadrosini kashf etgan", "1831-yilda o'simlik hujayrasida yadroni kashf etgan olim kim?", 3],
    ["Dmitriy Ivanovskiy", "Viruslarni kashf etgan", "1892-yilda tamaki mozaikasi kasalligini o'rganib, viruslarni kashf etgan olim kim?", 3],
    ["Ilya Mechnikov", "Fagotsitozni kashf etgan", "Leykotsitlarning mikroblarni yutishi — fagotsitozni kashf etgan olim kim?", 3],
    ["Tomas Morgan", "Xromosoma nazariyasini yaratgan", "Irsiyatning xromosoma nazariyasini yaratgan olim kim?", 3]
  ];
  function genOlimB(L) {
    var o = pick(lvList(OLIM_B, L, 3)), st = [o[0] + " — " + (/^[A-Z][a-z']/.test(o[1]) ? o[1].charAt(0).toLowerCase() + o[1].slice(1) : o[1]) + "."];
    if (Math.random() < 0.5) return Q(o[2], o[0], otherN(OLIM_B.map(function (x) { return x[0]; }), [o[0]], 4), st);
    return Q("<b>" + o[0] + "</b> biologiyaga qanday hissa qo'shgan?", o[1], otherN(OLIM_B.map(function (x) { return x[1]; }), [o[1]], 4), st);
  }
  var DUNYO = ["Bakteriyalar", "Zamburug'lar", "O'simliklar", "Hayvonlar"];
  // [organizm, dunyo indeksi, daraja]
  var ORGANIZM = [["Ichak tayoqchasi", 0, 2], ["Sil tayoqchasi", 0, 2], ["Sut achituvchi bakteriya", 0, 1], ["Tugunak bakteriyasi", 0, 3],
    ["Achitqi", 1, 1], ["Mog'or zamburug'i", 1, 1], ["Shampinyon", 1, 2], ["Oq qo'ziqorin", 1, 1], ["Qorakuya", 1, 3],
    ["Qayin", 2, 1], ["Bug'doy", 2, 1], ["Yo'sin", 2, 2], ["Qirqquloq", 2, 2], ["Archa", 2, 1],
    ["Chumoli", 3, 1], ["Qurbaqa", 3, 1], ["Yomg'ir chuvalchangi", 3, 2], ["Marjon polipi", 3, 3], ["Gubka", 3, 3]];
  function genDunyo(L) {
    var pool = lvList(ORGANIZM, L, 2), o = pick(pool), a = DUNYO[o[1]];
    if (Math.random() < 0.6) return Q("<b>" + o[0] + "</b> tirik organizmlarning qaysi dunyosiga kiradi?", a, others(DUNYO, a, 3).concat(["Viruslar"]), [o[0] + " — " + a.toLowerCase() + " dunyosiga kiradi."]);
    var w = [];
    [0, 1, 2, 3].forEach(function (k) { if (k !== o[1]) { var c = pool.filter(function (x) { return x[1] === k; }); if (!c.length) c = ORGANIZM.filter(function (x) { return x[1] === k; }); w.push(pick(c)[0]); } });
    return Q("Qaysi organizm <b>" + a.toLowerCase() + "</b> dunyosiga kiradi?", o[0], w, [o[0] + " — " + a.toLowerCase() + " dunyosiga kiradi."]);
  }
  function genMikro(L) {
    var ok = pick([5, 7, 10, 15, 20]), ob = pick([4, 8, 10, 20, 40, 90]), k = ok * ob;
    if (L >= 2 && Math.random() < 0.4) return Q("Mikroskop jami " + k + " marta kattalashtiradi, okulyari esa " + ok + " marta. Obyektivi necha marta kattalashtiradi?", ob + " marta",
      [ob * 2, k - ok, ob + 10, ob / 2, ok].map(function (x) { return x + " marta"; }), ["Kattalashtirish = okulyar × obyektiv.", k + " : " + ok + " = " + ob]);
    return Q("Mikroskop okulyari " + ok + " marta, obyektivi " + ob + " marta kattalashtiradi. Mikroskop jami necha marta kattalashtiradi?", k + " marta",
      [ok + ob, k * 2, k * 10, k / 2, k + ok].map(function (x) { return x + " marta"; }), ["Kattalashtirish = okulyar × obyektiv.", ok + " × " + ob + " = " + k]);
  }
  topic("b1", "Biologiya · Hujayra va tirik organizmlar", B1, [{ p: 0.2, fn: genOrg }, { p: 0.14, fn: genOlimB }, { p: 0.1, fn: genDunyo }, { p: 0.07, fn: genMikro }]);

  /* ================= b2 Biologiya · Odam anatomiyasi va salomatlik ================= */
  var B2 = [
    [1, "Katta yoshli odam skeletida nechta suyak bor?", "206", ["106", "300", "186", "256"], "Chaqaloqda suyaklar ko'proq, o'sgan sari ba'zilari qo'shilib ketadi."],
    [1, "Odam tanasidagi eng uzun suyak qaysi?", "Son suyagi", ["Yelka suyagi", "Katta boldir suyagi", "Umurtqa pog'onasi"], "Son suyagi — odam skeletidagi eng uzun va mustahkam suyak."],
    [1, "Odam yuragi necha kamerali?", "4", ["2", "3", "5"], "Yurak 2 ta bo'lmacha va 2 ta qorinchadan iborat."],
    [1, "Qonda kislorodni qaysi hujayralar tashiydi?", "Eritrotsitlar", ["Leykotsitlar", "Trombotsitlar", "Neyronlar"], "Eritrotsitlardagi gemoglobin kislorodni biriktiradi."],
    [1, "Organizmni mikroblardan himoya qiluvchi qon hujayralari qaysi?", "Leykotsitlar", ["Eritrotsitlar", "Trombotsitlar", "Neyronlar"], "Leykotsitlar — oq qon tanachalari."],
    [1, "Qonning ivishida qaysi qon hujayralari qatnashadi?", "Trombotsitlar", ["Eritrotsitlar", "Leykotsitlar", "Neyronlar"], "Trombotsitlar jarohatdan qon oqishini to'xtatadi."],
    [1, "C vitamini yetishmasa qaysi kasallik kelib chiqadi?", "Singa (tsinga)", ["Raxit", "Shabko'rlik", "Beri-beri"], "C vitamini limon, na'matak, sabzavotlarda ko'p."],
    [1, "Bolalarda D vitamini yetishmasa qaysi kasallik rivojlanadi?", "Raxit", ["Singa (tsinga)", "Shabko'rlik", "Kamqonlik"], "D vitamini suyaklarning to'g'ri o'sishi uchun zarur."],
    [1, "Odam qaysi organ yordamida nafas oladi?", "O'pka", ["Jigar", "Buyrak", "Oshqozon"], "O'pkada qon kislorod bilan to'yinadi."],
    [1, "Qonni butun tana bo'ylab haydovchi organ qaysi?", "Yurak", ["O'pka", "Jigar", "Buyrak"], "Yurak to'xtovsiz qisqarib, qonni tomirlarga haydaydi."],
    [1, "Qonni tozalab, siydik hosil qiluvchi organ qaysi?", "Buyrak", ["Jigar", "O'pka", "Taloq"], "Buyraklar qondan ortiqcha suv va zararli moddalarni chiqaradi."],
    [1, "Odam tanasidagi eng katta organ qaysi?", "Teri", ["Jigar", "O'pka", "Bosh miya"], "Teri butun tanani qoplab, uni himoya qiladi."],
    [1, "Ta'mni qaysi sezgi organi orqali bilamiz?", "Til", ["Burun", "Quloq", "Teri"], "Tilda ta'm bilish so'rg'ichlari bor."],
    [1, "Sog'lom odam tanasining me'yoriy harorati taxminan qancha?", "36,6 °C", ["34,5 °C", "38,5 °C", "40 °C"], "37 °C dan yuqori harorat ko'pincha kasallik belgisi."],
    [1, "Katta yoshli odamda nechta doimiy tish bo'ladi?", "32", ["20", "28", "36"], "Bolalarda 20 ta sut tishi bo'ladi."],
    [1, "Tez tibbiy yordamni chaqirish uchun O'zbekistonda qaysi raqam teriladi?", "103", ["101", "102", "104"], "101 — yong'in xizmati, 103 — tez tibbiy yordam."],
    [1, "Odamda nechta qon guruhi ajratiladi (AB0 tizimi)?", "4", ["2", "3", "6"], "I (0), II (A), III (B), IV (AB) guruhlar."],
    [2, "Ovqat hazm qilish qaysi bo'limda boshlanadi?", "Og'iz bo'shlig'ida", ["Oshqozonda", "Ingichka ichakda", "Yo'g'on ichakda"], "Og'izda ovqat chaynaladi va so'lak bilan namlanadi."],
    [2, "Oziq moddalar qonga asosan qayerda so'riladi?", "Ingichka ichakda", ["Oshqozonda", "Qizilo'ngachda", "Og'iz bo'shlig'ida"], "Ingichka ichak devoridagi so'rg'ichlar moddalarni so'radi."],
    [2, "O't suyuqligi (safro) qaysi organda ishlab chiqariladi?", "Jigarda", ["Oshqozonda", "Buyrakda", "Taloqda"], "O't suyuqligi o't pufagida to'planadi va yog'larni hazm qilishga yordam beradi."],
    [2, "Insulin gormoni qaysi bezda ishlab chiqariladi?", "Oshqozon osti bezida", ["Qalqonsimon bezda", "Jigarda", "Buyrak usti bezida"], "Insulin qondagi glyukoza miqdorini kamaytiradi."],
    [2, "Insulin yetishmasligidan qaysi kasallik kelib chiqadi?", "Qandli diabet", ["Raxit", "Buqoq", "Singa (tsinga)"], "Qandli diabetda qondagi glyukoza miqdori oshib ketadi."],
    [2, "Ovqatda yod yetishmasa qaysi bez kattalashadi (buqoq)?", "Qalqonsimon bez", ["Oshqozon osti bezi", "So'lak bezi", "Ter bezi"], "Qalqonsimon bez gormonlari tarkibida yod bor."],
    [2, "Eritrotsitlarga qizil rang beruvchi modda qaysi?", "Gemoglobin", ["Xlorofill", "Melanin", "Insulin"], "Gemoglobin tarkibida temir bor."],
    [2, "Gemoglobin tarkibiga qaysi kimyoviy element kiradi?", "Temir", ["Kalsiy", "Yod", "Natriy"], "Temir yetishmasa, kamqonlik (anemiya) rivojlanadi."],
    [2, "Qonni yurakdan organlarga olib boruvchi tomirlar qanday ataladi?", "Arteriyalar", ["Venalar", "Kapillyarlar", "Limfa tomirlari"], "Venalar qonni yurakka qaytaradi."],
    [2, "Odam tanasidagi eng katta arteriya qaysi?", "Aorta", ["O'pka venasi", "Kovak vena", "Uyqu arteriyasi"], "Aorta yurakning chap qorinchasidan chiqadi."],
    [2, "Nerv sistemasining asosiy hujayrasi qanday ataladi?", "Neyron", ["Eritrotsit", "Nefron", "Alveola"], "Neyronlar nerv impulslarini o'tkazadi."],
    [2, "Harakatlar muvozanati va uyg'unligini boshqaruvchi miya qismi qaysi?", "Miyacha", ["Uzunchoq miya", "Orqa miya", "Oraliq miya"], "Miyacha shikastlansa, harakat muvozanati buziladi."],
    [2, "Muvozanat sezgisi organi qaysi sezgi organi tarkibida joylashgan?", "Quloq", ["Ko'z", "Burun", "Til"], "Ichki quloqda muvozanat a'zosi joylashgan."],
    [2, "O'rta quloqda nechta eshitish suyakchasi bor?", "3", ["2", "4", "6"], "Bolg'acha, sandon va uzangi."],
    [2, "Odam tanasidagi eng kichik suyak qaysi?", "Uzangi", ["Bolg'acha", "To'sh suyagi", "Bilak suyagi"], "Uzangi — o'rta quloqdagi eshitish suyakchasi."],
    [2, "Ko'krak va qorin bo'shlig'ini ajratib turuvchi nafas muskuli qaysi?", "Diafragma", ["Yurak muskuli", "Ikki boshli muskul", "Qovurg'alar"], "Diafragma qisqarganda o'pkaga havo kiradi."],
    [2, "Odamda necha juft qovurg'a bor?", "12", ["10", "14", "8"], "12 juft qovurg'a ko'krak qafasini hosil qiladi."],
    [2, "Qo'l-oyoqdan arteriyadan qon ketganda jgut qayerga qo'yiladi?", "Jarohatdan yuqoriga", ["Jarohatdan pastga", "Jarohatning ustiga", "Bo'yinga"], "Arteriya qoni yurakdan keladi, shuning uchun jgut yaradan yuqoriga qo'yiladi."],
    [2, "Terining ozroq kuygan joyiga birinchi yordam sifatida nima qilinadi?", "Sovuq suvda sovutiladi", ["Moy surtiladi", "Issiq suv quyiladi", "Qattiq ishqalanadi"], "Kuygan joy toza sovuq suv bilan bir necha daqiqa sovutiladi."],
    [3, "Qon guruhlarini kashf etgan olim kim?", "Karl Landshteyner", ["Lui Paster", "Uilyam Garvey", "Ivan Pavlov"], "Landshteyner qon guruhlarini XX asr boshida aniqlagan."],
    [3, "Qon aylanishini birinchi bo'lib ilmiy asoslab bergan ingliz olimi kim?", "Uilyam Garvey", ["Karl Landshteyner", "Edvard Jenner", "Robert Guk"], "Garvey qonning berk doira bo'ylab aylanishini isbotlagan."],
    [3, "Chechakka qarshi birinchi emlashni kim o'tkazgan?", "Edvard Jenner", ["Lui Paster", "Aleksandr Fleming", "Uilyam Garvey"], "Jenner 1796-yilda chechakka qarshi emlash usulini qo'llagan."],
    [3, "Shartli reflekslar haqidagi ta'limot muallifi kim?", "Ivan Pavlov", ["Charlz Darvin", "Edvard Jenner", "Karl Landshteyner"], "Pavlov itlar ustida tajribalar o'tkazgan."],
    [3, "Buyrakning tuzilish va faoliyat birligi nima deb ataladi?", "Nefron", ["Neyron", "Alveola", "Akson"], "Har bir buyrakda juda ko'p nefronlar bor."],
    [3, "O'pkada gaz almashinuvi qaysi tuzilmalarda boradi?", "Alveolalarda", ["Bronxlarda", "Traxeyada", "Hiqildoqda"], "Alveolalar kapillyarlar bilan o'ralgan pufakchalar."],
    [3, "Kichik qon aylanish doirasi yurakning qaysi bo'limidan boshlanadi?", "O'ng qorinchadan", ["Chap qorinchadan", "O'ng bo'lmachadan", "Chap bo'lmachadan"], "Kichik doira: o'ng qorincha → o'pka → chap bo'lmacha."],
    [3, "Katta qon aylanish doirasi yurakning qaysi bo'limidan boshlanadi?", "Chap qorinchadan", ["O'ng qorinchadan", "O'ng bo'lmachadan", "Chap bo'lmachadan"], "Chap qorinchadan aorta orqali qon butun tanaga boradi."],
    [3, "So'lak tarkibidagi ferment qaysi moddani parchalay boshlaydi?", "Kraxmalni", ["Oqsilni", "Yog'ni", "Suvni"], "So'lakdagi amilaza kraxmalni parchalaydi."],
    [3, "Oshqozon shirasi tarkibida qaysi kislota bor?", "Xlorid kislota", ["Sulfat kislota", "Nitrat kislota", "Sirka kislota"], "Xlorid kislota mikroblarni o'ldiradi va fermentlarni faollashtiradi."],
    [3, "Eritrotsitlar qayerda hosil bo'ladi?", "Qizil suyak ko'migida", ["Jigarda", "Yurakda", "Buyrakda"], "Qizil suyak ko'migi — qon hosil qiluvchi organ."],
    [3, "Ko'zning nurni sezuvchi hujayralari qaysi qavatda joylashgan?", "To'r pardada", ["Shox pardada", "Rangdor pardada", "Ko'z gavharida"], "To'r pardada tayoqcha va kolbacha hujayralar bor."],
    [3, "Qon ivishida ishtirok etuvchi vitamin qaysi?", "K vitamini", ["C vitamini", "D vitamini", "A vitamini"], "K vitamini yetishmasa, qon yomon iviydi."],
    [3, "A vitamini yetishmasa qaysi holat kuzatiladi?", "Shabko'rlik", ["Raxit", "Singa (tsinga)", "Buqoq"], "Shabko'rlikda odam qorong'ida yomon ko'radi."],
    [3, "B₁ vitamini yetishmasligidan qaysi kasallik kelib chiqadi?", "Beri-beri", ["Raxit", "Singa (tsinga)", "Shabko'rlik"], "Beri-berida nerv sistemasi zararlanadi."],
    [3, "Qaysi qon guruhi \"universal donor\" hisoblanadi?", "I (0) guruh", ["II (A) guruh", "III (B) guruh", "IV (AB) guruh"], "IV (AB) guruh egasi esa universal retsipiyent hisoblanadi."],
    [3, "Ichki sekretsiya bezlari ishlab chiqaradigan biologik faol moddalar nima deyiladi?", "Gormonlar", ["Fermentlar", "Vitaminlar", "Antitanalar"], "Gormonlar to'g'ridan-to'g'ri qonga chiqariladi."],
    [1, "Bolalarda nechta sut tishi bo'ladi?", "20", ["32", "24", "16"], "Sut tishlari keyinchalik doimiy tishlar bilan almashinadi."],
    [1, "Tana haroratini o'lchaydigan asbob qaysi?", "Termometr", ["Tonometr", "Barometr", "Dinamometr"], "Sog'lom odam harorati taxminan 36,6 °C."],
    [1, "Teri orqali tanadan qanday suyuqlik ajraladi?", "Ter", ["So'lak", "O't suyuqligi", "Oshqozon shirasi"], "Ter bezlari tana haroratini boshqarishga yordam beradi."],
    [1, "Quyosh nuri ta'sirida terida qaysi vitamin hosil bo'ladi?", "D vitamini", ["C vitamini", "A vitamini", "K vitamini"], "D vitamini suyaklar uchun zarur."],
    [1, "Limon, na'matak va qora smorodinada qaysi vitamin ko'p bo'ladi?", "C vitamini", ["D vitamini", "K vitamini", "B₁ vitamini"], "C vitamini organizmni kasalliklarga chidamli qiladi."],
    [1, "Tishlarni kuniga kamida necha marta tozalash tavsiya etiladi?", "2 marta", ["1 hafta 1 marta", "Har oyda 1 marta", "Umuman shart emas"], "Ertalab va kechqurun tish yuvish tavsiya etiladi."],
    [1, "Odamda nechta asosiy sezgi organi bor?", "5", ["3", "4", "7"], "Ko'z, quloq, burun, til va teri."],
    [2, "Katta yoshli odam tanasida taxminan necha litr qon bo'ladi?", "5 litr", ["1 litr", "10 litr", "15 litr"], "Qon tana massasining taxminan 7–8% ini tashkil etadi."],
    [2, "Sog'lom katta yoshli odam yuragi tinch holatda daqiqasiga taxminan necha marta uradi?", "60–80 marta", ["20–30 marta", "120–140 marta", "150–200 marta"], "Jismoniy mashqda yurak urishi tezlashadi."],
    [2, "Sog'lom odam tinch holatda bir daqiqada taxminan necha marta nafas oladi?", "16–18 marta", ["4–6 marta", "40–50 marta", "60–80 marta"], "Nafas olish markazi uzunchoq miyada joylashgan."],
    [2, "Ko'zning rangini belgilovchi parda qaysi?", "Rangdor parda", ["Shox parda", "To'r parda", "Oqsil parda"], "Rangdor parda o'rtasida qorachiq joylashgan."],
    [2, "Qorong'ida ko'z qorachig'i qanday o'zgaradi?", "Kengayadi", ["Torayadi", "O'zgarmaydi", "Yopilib qoladi"], "Ko'proq yorug'lik tushishi uchun qorachiq kengayadi."],
    [2, "Organizm uchun asosiy qurilish materiali bo'lgan oziq moddalar qaysi?", "Oqsillar", ["Uglevodlar", "Vitaminlar", "Mineral tuzlar"], "Oqsillar go'sht, sut, tuxum, dukkaklilarda ko'p."],
    [2, "Organizm uchun asosiy energiya manbai bo'lgan oziq moddalar qaysi?", "Uglevodlar", ["Vitaminlar", "Mineral tuzlar", "Suv"], "Non, guruch, kartoshka uglevodlarga boy."],
    [2, "Odam tanasidagi eng qattiq to'qima qaysi?", "Tish emali", ["Son suyagi", "Tirnoq", "Tog'ay"], "Emal tishni yemirilishdan himoya qiladi."],
    [2, "Hazm qilish tizimidagi eng katta bez qaysi?", "Jigar", ["Oshqozon osti bezi", "So'lak bezi", "Qalqonsimon bez"], "Jigar o't suyuqligi ishlab chiqaradi."],
    [2, "Qonning suyuq qismi nima deb ataladi?", "Plazma", ["Limfa", "Gemoglobin", "Zardob"], "Plazmada qon hujayralari suzib yuradi."],
    [2, "Qondagi gemoglobin kamayib ketishi qanday holat deyiladi?", "Kamqonlik (anemiya)", ["Qandli diabet", "Raxit", "Buqoq"], "Kamqonlikda organizmga kislorod kam yetib boradi."],
    [2, "Qonni organlardan yurakka olib keluvchi tomirlar qanday ataladi?", "Venalar", ["Arteriyalar", "Kapillyarlar", "Aorta"], "Arteriyalar esa qonni yurakdan olib ketadi."],
    [2, "Eng ingichka qon tomirlari qanday ataladi?", "Kapillyarlar", ["Arteriyalar", "Venalar", "Aorta"], "Kapillyarlar devori orqali gaz va moddalar almashinadi."],
    [2, "Qon bosimini o'lchaydigan asbob qaysi?", "Tonometr", ["Termometr", "Barometr", "Manometr"], "Tonometr qon bosimini mm simob ustunida ko'rsatadi."],
    [2, "Qo'lni issiq narsadan beixtiyor tortib olish qanday reaksiya?", "Shartsiz refleks", ["Shartli refleks", "Instinkt emas, odat", "Ixtiyoriy harakat"], "Shartsiz reflekslar tug'ma bo'ladi."],
    [2, "Pavlov tajribasida qo'ng'iroq chalinganda itda so'lak ajralishi qanday refleks?", "Shartli refleks", ["Shartsiz refleks", "Tug'ma refleks", "Ixtiyorsiz harakat"], "Shartli refleks hayot davomida hosil bo'ladi."],
    [2, "Sabzidagi karotin organizmda qaysi vitaminga aylanadi?", "A vitamini", ["C vitamini", "D vitamini", "K vitamini"], "A vitamini ko'rish uchun muhim."],
    [3, "Odam bosh skeletidagi yagona harakatchan suyak qaysi?", "Pastki jag'", ["Yuqori jag'", "Peshona suyagi", "Ensa suyagi"], "Pastki jag' chaynash va gapirishda harakatlanadi."],
    [3, "Bo'g'imda suyaklarni bir-biriga biriktiruvchi tuzilmalar nima deyiladi?", "Boylamlar", ["Paylar", "Tog'aylar", "Muskullar"], "Paylar esa muskulni suyakka biriktiradi."],
    [3, "Muskullarni suyakka biriktiruvchi tuzilma nima deyiladi?", "Pay", ["Boylam", "Tog'ay", "Bo'g'im"], "Pay (tendon) zich biriktiruvchi to'qimadan tuzilgan."],
    [3, "Qo'lni tirsakdan bukuvchi muskul qaysi?", "Ikki boshli muskul", ["Uch boshli muskul", "Deltasimon muskul", "Diafragma"], "Uch boshli muskul esa qo'lni tirsakdan yozadi."],
    [3, "Qo'lni tirsakdan yozuvchi muskul qaysi?", "Uch boshli muskul", ["Ikki boshli muskul", "Deltasimon muskul", "Diafragma"], "Bu ikki muskul bir-biriga qarama-qarshi ishlaydi."],
    [3, "Ichki quloqning eshitish retseptorlari joylashgan qismi qanday ataladi?", "Chig'anoq", ["Nog'ora parda", "Eshitish nayi", "Quloq suprasi"], "Chig'anoqdagi suyuqlik tebranishi retseptorlarni qo'zg'atadi."],
    [3, "Nerv impulsini neyron tanasidan uzoqqa o'tkazuvchi uzun o'simta nima deyiladi?", "Akson", ["Dendrit", "Sinaps", "Retseptor"], "Dendritlar — qisqa, shoxlangan o'simtalar."],
    [3, "Ichki sekretsiya bezlari gormonlarni qayerga chiqaradi?", "To'g'ridan-to'g'ri qonga", ["Ichakka", "Teri yuzasiga", "Og'iz bo'shlig'iga"], "Tashqi sekretsiya bezlari (so'lak, ter) esa yo'llar orqali chiqaradi."],
    [3, "Bosh miya yarimsharlarining po'stlog'i qanday moddadan iborat?", "Kulrang moddadan", ["Oq moddadan", "Tog'aydan", "Suyak to'qimasidan"], "Po'stloqda neyronlar tanalari joylashgan."],
    [3, "Uzoqni yaxshi, yaqinni yomon ko'radigan odamga qanday ko'zoynak kerak?", "Qavariq (yig'uvchi) linzali", ["Botiq (sochuvchi) linzali", "Yassi oynali", "Qora oynali"], "Yig'uvchi linza tasvirni to'r pardaga keltiradi."],
    [3, "Yaqinni yaxshi, uzoqni yomon ko'radigan odamga qanday ko'zoynak kerak?", "Botiq (sochuvchi) linzali", ["Qavariq (yig'uvchi) linzali", "Yassi oynali", "Qora oynali"], "Sochuvchi linza tasvirni to'r pardaga keltiradi."],
    [1,"Yurak odam tanasining qaysi bo'shlig'ida joylashgan?","Ko'krak bo'shlig'ida",["Qorin bo'shlig'ida","Chanoq bo'shlig'ida","Bosh suyagi ichida"],"Yurak ko'krak qafasi ichida, o'pkalar orasida joylashgan."],
    [1,"Ovqat og'izdan oshqozonga qaysi nay orqali o'tadi?","Qizilo'ngach",["Hiqildoq","Kekirdak","Yo'g'on ichak"],"Qizilo'ngach halqumni oshqozon bilan bog'laydigan muskulli naydir."],
    [1,"Ovoz paychalari qaysi a'zoda joylashgan?","Hiqildoqda",["Qizilo'ngachda","O'pkada","Oshqozonda"],"Havo ovoz paychalari orasidan o'tganda ovoz hosil bo'ladi."],
    [1,"Buyrakda hosil bo'lgan siydik qaysi organda to'planadi?","Siydik pufagida",["Jigarda","Oshqozonda","Yurakda"],"Siydik buyrakdan siydik yo'li orqali siydik pufagiga tushadi."],
    [1,"Bosh miya qaysi suyak qutisi ichida joylashgan?","Bosh suyagida",["Ko'krak qafasida","Chanoq suyagida","Umurtqa pog'onasida"],"Bosh miya kalla suyagi bilan himoyalangan."],
    [1,"Orqa miya qaysi tuzilma ichida joylashgan?","Umurtqa pog'onasida",["Bosh suyagida","Ko'krak qafasida","Chanoq suyagida"],"Orqa miya umurtqalardan hosil bo'lgan kanal ichida joylashadi."],
    [1,"Ko'rish sezgi organi qaysi?","Ko'z",["Quloq","Burun","Teri"],"Ko'z yorug'likni qabul qilib, ko'rish imkonini beradi."],
    [1,"Nafas olganda havodagi qaysi gaz qonga o'tadi?","Kislorod",["Azot","Vodorod","Argon"],"Kislorod o'pkadagi alveolalardan qonga o'tib, to'qimalarga tashiladi."],
    [1,"Suyak va tishlarning mustahkamligi uchun qaysi mineral ayniqsa zarur?","Kalsiy",["Natriy","Yod","Mis"],"Suyak va tishlar tarkibida kalsiy tuzlari ko'p bo'ladi."],
    [1,"Qo'lning tirsakdan yuqori qismidagi suyak qaysi?","Yelka suyagi",["Boldir suyagi","Son suyagi","O'mrov suyagi"],"Yelka suyagi yelkadan tirsakkacha bo'lgan qismni tashkil qiladi."],
    [1,"Odamda nechta o'pka bor?","2 ta",["1 ta","3 ta","4 ta"],"Odamda chap va o'ng o'pka bor."],
    [1,"Qo'llarni ovqatdan oldin sovunlab yuvish qaysi kasalliklarning oldini oladi?","Ichak infeksiyalarining",["Raxitning","Qandli diabetning","Kamqonlikning"],"Qo'l orqali mikroblar og'izga tushib, ichak infeksiyalarini keltirib chiqaradi."],
    [1,"Tomir urishini (pulsni) odatda qaysi joydan sanash mumkin?","Bilakning ichki tomonidan",["Tizza ustidan","Pastki jagdan","Qovurg'adan"],"Bilakning ichki tomonida (bosh barmoq tomonda) arteriya teriga yaqin joylashgani uchun puls yaxshi seziladi."],
    [2,"Umurtqa pog'onasining bo'yin qismida nechta umurtqa bor?","7 ta",["5 ta","9 ta","12 ta"],"Bo'yin bo'limi 7 ta umurtqadan tashkil topgan."],
    [2,"Yo'g'on ichakda asosan nima so'riladi?","Suv",["Oqsillar","Yog'lar","Vitaminlar"],"Yo'g'on ichakda ovqat qoldig'idan suvning asosiy qismi qonga so'riladi."],
    [2,"Ingichka ichakning birinchi qismi qanday ataladi?","O'n ikki barmoqli ichak",["Ko'r ichak","To'g'ri ichak","Chambar ichak"],"Oshqozondan keyingi birinchi qism o'n ikki barmoqli ichak deyiladi."],
    [2,"Qalqonsimon bez qaysi gormonni ishlab chiqaradi?","Tiroksin",["Insulin","Adrenalin","Glyukagon"],"Tiroksin moddalar almashinuvini boshqaradi va tarkibida yod bor."],
    [2,"Adrenalin gormoni qaysi bezda ishlab chiqariladi?","Buyrak usti bezida",["Qalqonsimon bezda","Oshqozon osti bezida","Epifizda"],"Adrenalin xavf paytida yurak urishini tezlashtiradi."],
    [2,"O'sish gormoni qaysi bezda ishlab chiqariladi?","Gipofizda",["Buyrak usti bezida","Qalqonsimon bezda","Jigarda"],"Gipofiz bosh miya asosida joylashgan bo'lib, o'sishni boshqaradi."],
    [2,"Ko'zning old tomonidagi shaffof parda qanday ataladi?","Shox parda",["To'r parda","Rangdor parda","Oqsil parda"],"Shox parda nurni ko'z ichiga o'tkazadi va sindiradi."],
    [2,"Ko'zda nurni to'r pardaga yig'uvchi ikki tomoni qavariq tuzilma qaysi?","Gavhar",["Shishasimon tana","Qorachiq","Ko'ruv nervi"],"Gavhar egriligini o'zgartirib, tasvirni to'r pardada aniqlaydi."],
    [2,"Quloqda tovush to'lqinlarini birinchi bo'lib qabul qiladigan parda qaysi?","Nog'ora parda",["To'r parda","Shox parda","Shilliq parda"],"Nog'ora parda tovushdan tebranib, tebranishni eshitish suyakchalariga uzatadi."],
    [2,"Yurak muskulining qisqarishi qanday ataladi?","Sistola",["Diastola","Peristaltika","Inspiratsiya"],"Sistola paytida yurak qonni tomirlarga haydaydi."],
    [2,"Immunitet nima?","Organizmning kasallik qo'zg'atuvchilarga chidamliligi",["Qonning ivish xususiyati","Ovqatni hazm qilish qobiliyati","Tana haroratining doimiyligi"],"Immunitet organizmni mikroblar va zararli moddalardan himoya qiladi."],
    [2,"Sog'lom katta yoshli odamda arterial qon bosimining me'yori taxminan qancha?","120/80 mm sim. ust.",["60/40 mm sim. ust.","180/120 mm sim. ust.","200/160 mm sim. ust."],"Yuqori ko'rsatkich sistolik, pastki ko'rsatkich diastolik bosimdir."],
    [2,"Qon guruhlari ichida IV (AB) guruhga ega odam qanday ataladi?","Universal retsipient",["Universal donor","Faqat donor","Faqat retsipient"],"IV guruh egasiga barcha guruhdagi qonni quyish mumkin."],
    [2,"Bosh miyaning yurak va nafas faoliyatini boshqaruvchi qismi qaysi?","Uzunchoq miya",["Miyacha","Katta yarimsharlar","Oraliq miya"],"Uzunchoq miyada nafas va qon aylanish markazlari joylashgan."],
    [3,"Insulinni ajratib olishda ishtirok etgan kanadalik olim kim?","Frederik Banting",["Aleksandr Fleming","Lui Paster","Robert Kox"],"Banting va Best insulinni 1921-yilda ajratib olgan."],
    [3,"Penitsillinni kashf etgan olim kim?","Aleksandr Fleming",["Edvard Jenner","Ilya Mechnikov","Karl Landshteyner"],"Fleming 1928-yilda mog'or zamburug'idan antibiotik topdi."],
    [3,"Ibn Sinoning mashhur tibbiyot asari qaysi?","Tib qonunlari",["Devonu lug'otit turk","Hind tibbiyoti","Saydana"],"«Tib qonunlari» asrlar davomida tibbiyot darsligi bo'lgan."],
    [3,"Rentgen nurlarini kashf etgan olim kim?","Vilgelm Rentgen",["Mari Kyuri","Nikola Tesla","Isaak Nyuton"],"Rentgen nurlari suyak sinishini aniqlashda qo'llaniladi."],
    [3,"Quturishga qarshi vaksinani yaratgan olim kim?","Lui Paster",["Edvard Jenner","Aleksandr Fleming","Vilgelm Rentgen"],"Paster 1885-yilda quturishga qarshi emlashni qo'lladi."],
    [3,"Fagotsitoz hodisasini kashf etgan olim kim?","Ilya Mechnikov",["Ivan Pavlov","Lui Paster","Uilyam Garvey"],"Fagotsitozda leykotsitlar mikroblarni yutib hazm qiladi."],
    [3,"Yurakning chap bo'lmachasi va chap qorinchasi orasidagi qopqoq nechta tabaqali?","Ikki tabaqali",["Uch tabaqali","To'rt tabaqali","Bir tabaqali"],"Chap tomondagi qopqoq ikki tabaqali bo'lib, qon teskari oqishiga yo'l qo'ymaydi."],
    [3,"Siydikning birlamchi filtrlanishi nefronning qaysi qismida sodir bo'ladi?","Buyrak koptokchasida",["Siydik pufagida","Siydik yo'lida","Buyrak jomida"],"Koptokchada qon plazmasi filtrlanib, birlamchi siydik hosil bo'ladi."],
    [3,"Jigarda ortiqcha glyukoza qanday moddaga aylanib to'planadi?","Glikogenga",["Gemoglobinga","Insulinga","Pepsinga"],"Glikogen zaxira uglevod bo'lib, kerak bo'lganda glyukozaga aylanadi."],
    [3,"Oshqozon shirasidagi pepsin fermenti qaysi moddalarni parchalaydi?","Oqsillarni",["Kraxmalni","Yog'larni","Kletchatkani"],"Pepsin kislotali muhitda oqsillarni parchalaydi."],
    [3,"Ikki neyron o'rtasidagi aloqa joyi nima deyiladi?","Sinaps",["Akson","Dendrit","Nerv tuguni"],"Sinapsda impuls kimyoviy modda yordamida keyingi hujayraga uzatiladi."],
    [3,"Ko'zning to'r pardasida qorong'ida ko'rishni ta'minlovchi hujayralar qaysi?","Tayoqchalar",["Kolbachalar","Eritrotsitlar","Neyroglialar"],"Tayoqchalar kuchsiz yorug'likni sezadi, ranglarni ajratmaydi."],
    [3,"Ranglarni ajratishni ta'minlovchi to'r parda hujayralari qaysi?","Kolbachalar",["Tayoqchalar","Trombotsitlar","Leykotsitlar"],"Kolbachalar yorqin yorug'likda rangni sezadi."],
    [3,"Ranglarni ajrata olmaslik kasalligi qanday ataladi?","Daltonizm",["Shabko'rlik","Yaqindan ko'rmaslik","Glaukoma"],"Daltonizm ko'pincha irsiy bo'lib, nomi olim Daltondan olingan."]
  ];
  // [organ, vazifasi (javob), "Qaysi organ ...?" uchun, daraja]
  var ORGAN = [
    ["Yurak", "Qonni tomirlarga haydash", "qonni tomirlar bo'ylab haydaydi", 1],
    ["O'pka", "Gaz almashinuvi", "qonni kislorod bilan to'yintiradi", 1],
    ["Buyrak", "Siydik hosil qilish", "qonni tozalab, siydik hosil qiladi", 1],
    ["Oshqozon", "Ovqatni hazm qilish", "ovqatni kislotali shira bilan hazm qiladi", 1],
    ["Bosh miya", "Organizm faoliyatini boshqarish", "butun organizm faoliyatini boshqaradi", 1],
    ["Ko'z", "Ko'rish", "yorug'likni sezib, ko'rishni ta'minlaydi", 1],
    ["Quloq", "Eshitish", "tovushlarni sezib, eshitishni ta'minlaydi", 1],
    ["Burun", "Hid bilish", "hidlarni sezadi", 1],
    ["Teri", "Tanani himoya qilish", "tanani tashqi ta'sirlardan himoya qiladi", 1],
    ["Jigar", "O't suyuqligi ishlab chiqarish", "o't suyuqligi (safro) ishlab chiqaradi", 2],
    ["Ingichka ichak", "Oziq moddalarni qonga so'rish", "oziq moddalarni qonga so'radi", 2],
    ["Qizilo'ngach", "Ovqatni oshqozonga o'tkazish", "chaynalgan ovqatni oshqozonga o'tkazadi", 2],
    ["Siydik pufagi", "Siydikni to'plash", "siydikni vaqtincha to'playdi", 2],
    ["Traxeya", "Havoni bronxlarga o'tkazish", "havoni hiqildoqdan bronxlarga o'tkazadi", 2],
    ["Miyacha", "Harakat muvozanatini boshqarish", "harakatlar muvozanati va uyg'unligini boshqaradi", 3],
    ["Yo'g'on ichak", "Suvni so'rish", "hazm bo'lmagan qoldiqlardan suvni so'radi", 3],
    ["Qizil suyak ko'migi", "Qon hujayralarini hosil qilish", "qon hujayralarini hosil qiladi", 3],
    ["Orqa miya", "Oddiy reflekslarni amalga oshirish", "oddiy reflekslarni amalga oshiradi va impulslarni bosh miyaga o'tkazadi", 3]
  ];
  var ORGAN_X = { "Bosh miya": ["Orqa miya", "Miyacha"], "Miyacha": ["Bosh miya"], "Orqa miya": ["Bosh miya", "Miyacha"], "Oshqozon": ["Ingichka ichak"],
    "Ingichka ichak": ["Oshqozon", "Yo'g'on ichak"], "Yo'g'on ichak": ["Ingichka ichak"], "Buyrak": ["Jigar", "Siydik pufagi"], "Siydik pufagi": ["Buyrak"],
    "O'pka": ["Traxeya"], "Traxeya": ["O'pka"], "Teri": [] };
  function genOrgan(L) {
    var o = pick(lvList(ORGAN, L, 3)), ex = [o[0]].concat(ORGAN_X[o[0]] || []);
    var rest = ORGAN.filter(function (x) { return ex.indexOf(x[0]) < 0; }), st = [o[0] + " " + o[2] + "."];
    if (Math.random() < 0.5) return Q("Qaysi organ <b>" + o[2] + "</b>?", o[0], otherN(rest.map(function (x) { return x[0]; }), [], 4), st);
    return Q("<b>" + o[0] + "</b>ning asosiy vazifasi qaysi?", o[1], otherN(rest.map(function (x) { return x[1]; }), [], 4), st);
  }
  // [vitamin, yetishmasa kelib chiqadigan holat, daraja]
  var VIT = [["C vitamini", "Singa (tsinga)", 1], ["D vitamini", "Raxit", 1], ["A vitamini", "Shabko'rlik", 2], ["B₁ vitamini", "Beri-beri", 2], ["K vitamini", "Qon yomon ivishi", 3], ["PP vitamini", "Pellagra", 3]];
  function genVit(L) {
    var v = pick(lvList(VIT, L, 2)), st = [v[0] + " yetishmasa — " + v[1].toLowerCase() + "."];
    if (Math.random() < 0.5) return Q("<b>" + v[0] + "</b> yetishmasa qanday holat kuzatiladi?", v[1], otherN(VIT.map(function (x) { return x[1]; }), [v[1]], 4), st);
    return Q("<b>" + v[1] + "</b> qaysi vitamin yetishmasligidan kelib chiqadi?", v[0], otherN(VIT.map(function (x) { return x[0]; }), [v[0]], 4), st);
  }
  var SIST = ["Qon aylanish sistemasi", "Nafas olish sistemasi", "Hazm qilish sistemasi", "Ayirish sistemasi", "Nerv sistemasi", "Tayanch-harakat sistemasi"];
  // [organ yoki tuzilma, sistema indeksi, daraja]
  var ORG_S = [["Yurak", 0, 1], ["Aorta", 0, 2], ["Kapillyarlar", 0, 2], ["Venalar", 0, 2],
    ["O'pka", 1, 1], ["Traxeya", 1, 2], ["Bronxlar", 1, 2], ["Hiqildoq", 1, 3], ["Alveolalar", 1, 3],
    ["Oshqozon", 2, 1], ["Qizilo'ngach", 2, 1], ["Ingichka ichak", 2, 1], ["Jigar", 2, 2], ["So'lak bezlari", 2, 2], ["O'n ikki barmoq ichak", 2, 3],
    ["Buyrak", 3, 1], ["Siydik pufagi", 3, 1], ["Siydik yo'li", 3, 2], ["Nefron", 3, 3],
    ["Bosh miya", 4, 1], ["Orqa miya", 4, 1], ["Neyron", 4, 2], ["Miyacha", 4, 2], ["Uzunchoq miya", 4, 3],
    ["Son suyagi", 5, 1], ["Umurtqa pog'onasi", 5, 1], ["Ikki boshli muskul", 5, 2], ["Bo'g'imlar", 5, 2], ["Pay", 5, 3]];
  function genSist(L) {
    var pool = lvList(ORG_S, L, 2), o = pick(pool), a = SIST[o[1]], st = [o[0] + " — " + a.toLowerCase() + "ga kiradi."];
    if (Math.random() < 0.55) return Q("<b>" + o[0] + "</b> qaysi organlar sistemasiga kiradi?", a, others(SIST, a, 4), st);
    var w = [];
    shuffle([0, 1, 2, 3, 4, 5]).forEach(function (k) { if (k !== o[1] && w.length < 4) { var c = pool.filter(function (x) { return x[1] === k; }); if (!c.length) c = ORG_S.filter(function (x) { return x[1] === k; }); w.push(pick(c)[0]); } });
    return Q("Quyidagilardan qaysi biri <b>" + a.toLowerCase() + "</b>ga kiradi?", o[0], w, st);
  }
  // [qism, vazifa] juftlari — har ikki yo'nalishda so'raladi
  var B2_PAIR = [
    ["Eritrotsitlar", "Kislorod tashish", "qon hujayralari", 1], ["Leykotsitlar", "Mikroblardan himoya qilish", "qon hujayralari", 1], ["Trombotsitlar", "Qon ivishida qatnashish", "qon hujayralari", 1],
    ["Kalla suyagi", "Bosh miyani himoya qilish", "skelet qismi", 1], ["Ko'krak qafasi", "Yurak va o'pkani himoya qilish", "skelet qismi", 1], ["Umurtqa pog'onasi", "Orqa miyani himoya qilish", "skelet qismi", 1],
    ["Oshqozon osti bezi", "Insulin ishlab chiqarish", "bez", 2], ["Qalqonsimon bez", "Tiroksin ishlab chiqarish", "bez", 2], ["Buyrak usti bezi", "Adrenalin ishlab chiqarish", "bez", 2], ["Gipofiz", "O'sish gormoni ishlab chiqarish", "bez", 3]
  ];
  function genB2Pair(L) {
    var o = pick(lvList(B2_PAIR, L, 3)), same = B2_PAIR.filter(function (x) { return x[2] === o[2] && x[0] !== o[0]; }), oth = B2_PAIR.filter(function (x) { return x[2] !== o[2]; });
    var st = [o[0] + " — " + o[1].toLowerCase() + "."];
    if (Math.random() < 0.5) return Q("<b>" + o[0] + "</b>ning asosiy vazifasi qaysi?", o[1], same.map(function (x) { return x[1]; }).concat(otherN(oth.map(function (x) { return x[1]; }), [], 2)).slice(0, 4), st);
    return Q("Qaysi " + o[2] + " <b>" + o[1].toLowerCase() + "</b> vazifasini bajaradi?", o[0], same.map(function (x) { return x[0]; }).concat(otherN(oth.map(function (x) { return x[0]; }), [], 2)).slice(0, 4), st);
  }
  topic("b2", "Biologiya · Odam anatomiyasi va salomatlik", B2, [{ p: 0.18, fn: genOrgan }, { p: 0.1, fn: genVit }, { p: 0.15, fn: genSist }, { p: 0.1, fn: genB2Pair }]);

  /* ================= b3 Biologiya · O'simliklar va hayvonlar dunyosi ================= */
  var SINF = ["Sutemizuvchilar", "Qushlar", "Sudralib yuruvchilar", "Suvda hamda quruqlikda yashovchilar", "Baliqlar", "Hasharotlar", "O'rgimchaksimonlar"];
  var SINF_Q = ["Sutemizuvchilar", "Qushlar", "Sudralib yuruvchilar", "Amfibiyalar", "Baliqlar", "Hasharotlar", "O'rgimchaksimonlar"];
  // [hayvon, sinf indeksi, daraja] — 1: oddiy, 2–3: ko'pincha adashtiriladigan
  var HAYVON = [
    ["Sigir", 0, 1], ["Ot", 0, 1], ["Tuya", 0, 1], ["Fil", 0, 1], ["Sher", 0, 1], ["Bo'ri", 0, 1], ["Quyon", 0, 1],
    ["Delfin", 0, 2], ["Kit", 0, 2], ["Ko'rshapalak", 0, 2], ["Tyulen", 0, 3], ["Ornitorinx", 0, 3], ["Kenguru", 0, 2],
    ["Burgut", 1, 1], ["Kaptar", 1, 1], ["Chumchuq", 1, 1], ["Tovuq", 1, 1], ["Laylak", 1, 1], ["Pingvin", 1, 2], ["Tuyaqush", 1, 2], ["Kivi", 1, 3],
    ["Toshbaqa", 2, 1], ["Timsoh", 2, 1], ["Kaltakesak", 2, 1], ["Ilon", 2, 1], ["Echkemar", 2, 2], ["Xameleon", 2, 2], ["Bo'g'ma ilon", 2, 2],
    ["Qurbaqa", 3, 1], ["Baqa", 3, 1], ["Salamandra", 3, 3],
    ["Laqqa baliq", 4, 1], ["Zog'ora baliq", 4, 1], ["Akula", 4, 2], ["Dengiz oti", 4, 3], ["Osyotr", 4, 3],
    ["Chumoli", 5, 1], ["Asalari", 5, 1], ["Kapalak", 5, 1], ["Ninachi", 5, 1], ["Chigirtka", 5, 2], ["Pashsha", 5, 1], ["Xonqizi", 5, 2],
    ["O'rgimchak", 6, 1], ["Chayon", 6, 2], ["Kana", 6, 3],
    ["Ayiq", 0, 1], ["Tulki", 0, 1], ["Yo'lbars", 0, 1], ["Tipratikan", 0, 1], ["Zebra", 0, 1], ["Jirafa", 0, 1], ["Koala", 0, 2], ["Kashalot", 0, 2], ["Morj", 0, 3], ["Exidna", 0, 3],
    ["Boyqush", 1, 1], ["Qaldirg'och", 1, 1], ["O'rdak", 1, 1], ["Kolibri", 1, 2], ["Pelikan", 1, 2], ["Flamingo", 1, 2],
    ["Gekkon", 2, 2], ["Kobra", 2, 2], ["Alligator", 2, 2], ["Gyurza", 2, 2], ["Suv iloni", 2, 3],
    ["Triton", 3, 2],
    ["Oq amur", 4, 2], ["Cho'rtan baliq", 4, 2], ["Kambala", 4, 2], ["Kit akula", 4, 3], ["Ilonbaliq", 4, 3], ["Skat", 4, 3], ["Piranya", 4, 3],
    ["Suvarak", 5, 1], ["Chivin", 5, 1], ["Termit", 5, 2],
    ["Qoraqurt", 6, 2], ["Tarantul", 6, 2], ["Falanga", 6, 3]
  ];
  function genSinf(L) {
    var pool = HAYVON.filter(function (h) { return h[2] === L; });
    if (!pool.length) pool = HAYVON;
    var h = pick(pool), a = SINF_Q[h[1]];
    return Q("<b>" + h[0] + "</b> hayvonlarning qaysi sinfiga kiradi?", a, others(SINF_Q, a, 4),
      [h[0] + " — " + SINF[h[1]].toLowerCase() + " sinfiga kiradi."]);
  }
  function genSinfTop(L) {
    var ci = R(0, 6), cls = SINF_Q[ci];
    var own = HAYVON.filter(function (h) { return h[1] === ci && (L > 1 || h[2] === 1); });
    var oth = HAYVON.filter(function (h) { return h[1] !== ci && (L > 1 || h[2] === 1); });
    if (!own.length) return null;
    var h = pick(own), w = shuffle(oth).slice(0, 4).map(function (x) { return x[0]; });
    return Q("Qaysi hayvon <b>" + cls.toLowerCase() + "</b> sinfiga kiradi?", h[0], w,
      [h[0] + " — " + SINF[ci].toLowerCase() + " sinfiga kiradi."]);
  }
  var B3 = [
    [1, "Hasharotlarning nechta oyog'i bor?", "6", ["4", "8", "10"], "Hasharotlarda 3 juft — 6 ta oyoq bo'ladi."],
    [1, "O'rgimchakning nechta oyog'i bor?", "8", ["6", "10", "4"], "O'rgimchaksimonlarda 4 juft — 8 ta oyoq bo'ladi."],
    [1, "O'simlik tuproqdan suv va mineral moddalarni qaysi organi orqali so'radi?", "Ildiz", ["Barg", "Gul", "Meva"], "Ildiz o'simlikni tuproqqa mahkamlaydi va suv so'radi."],
    [1, "O'simlikning qaysi organida fotosintez asosan boradi?", "Barg", ["Ildiz", "Gul", "Urug'"], "Barg hujayralarida xloroplastlar ko'p."],
    [1, "Gulli o'simliklarda urug' qayerda yetiladi?", "Meva ichida", ["Ildizda", "Bargda", "Poyada"], "Urug' tugunchadan hosil bo'lgan meva ichida joylashadi."],
    [1, "Changni guldan gulga ko'p tashiydigan hasharot qaysi?", "Asalari", ["Chivin", "Chumoli", "Suvarak"], "Asalarilar gul shirasini yig'ib, changlatishga yordam beradi."],
    [1, "Gulning changchisida nima hosil bo'ladi?", "Chang", ["Urug'", "Meva", "Shira"], "Chang urug'chiga tushsa, changlanish sodir bo'ladi."],
    [1, "Qaysi hayvon yirtqich hisoblanadi?", "Bo'ri", ["Qo'y", "Quyon", "Sigir"], "Yirtqichlar boshqa hayvonlar bilan oziqlanadi."],
    [1, "Qaysi hayvon o'txo'r hisoblanadi?", "Qo'y", ["Bo'ri", "Sher", "Tulki"], "O'txo'rlar o'simliklar bilan oziqlanadi."],
    [1, "Baliqlar suvda qaysi organi yordamida nafas oladi?", "Jabra", ["O'pka", "Teri", "Traxeya"], "Jabralar suvda erigan kislorodni o'zlashtiradi."],
    [1, "Qaysi hayvon bolasini sut bilan boqadi?", "Delfin", ["Akula", "Pingvin", "Toshbaqa"], "Delfin — sutemizuvchi."],
    [1, "Itbaliq qaysi hayvonning lichinkasi?", "Qurbaqa", ["Baliq", "Ilon", "Kapalak"], "Qurbaqa suvga uvildiriq qo'yadi, undan itbaliq chiqadi."],
    [1, "Oziq zanjiri odatda nimadan boshlanadi?", "Yashil o'simlikdan", ["Yirtqichdan", "Zamburug'dan", "O'txo'r hayvondan"], "Yashil o'simliklar quyosh energiyasidan organik modda hosil qiladi."],
    [2, "Oziq zanjiridagi bo'sh joyni toping: o't → chigirtka → ? → ilon", "Qurbaqa", ["Sigir", "Bug'doy", "Quyon"], "Qurbaqa chigirtka bilan oziqlanadi, ilon qurbaqani yeydi."],
    [2, "Oziq zanjiridagi bo'sh joyni toping: o't → ? → bo'ri", "Quyon", ["Tulki", "Burgut", "Ilon"], "Quyon o'txo'r, bo'ri esa uni ovlaydi."],
    [2, "Organik qoldiqlarni parchalab, tuproqqa qaytaruvchi organizmlar qaysi?", "Bakteriya va zamburug'lar", ["Yirtqich hayvonlar", "Qushlar", "Baliqlar"], "Ular oziq zanjirida redutsentlar vazifasini bajaradi."],
    [2, "Kapalakning rivojlanish bosqichlarining to'g'ri tartibi qaysi?", "Tuxum → qurt → g'umbak → kapalak", ["Tuxum → g'umbak → qurt → kapalak", "Qurt → tuxum → g'umbak → kapalak", "G'umbak → tuxum → qurt → kapalak"], "Kapalak to'liq o'zgarish bilan rivojlanadi."],
    [2, "Bug'doy qanday ildiz tizimiga ega?", "Popuk ildiz", ["O'q ildiz", "Ildizmeva", "Ildiz tugunagi"], "Bir pallali o'simliklarda popuk ildiz bo'ladi."],
    [2, "Bir pallali o'simlik qaysi?", "Bug'doy", ["Loviya", "No'xat", "O'rik"], "Bug'doy, makkajo'xori, piyoz — bir pallali o'simliklar."],
    [2, "Ikki pallali o'simlik qaysi?", "Loviya", ["Bug'doy", "Makkajo'xori", "Sholi"], "Loviya urug'ida ikkita urug' pallasi bor."],
    [2, "Kartoshkaning yeyiladigan tuganagi o'simlikning qaysi organi?", "Shakli o'zgargan poya", ["Ildiz", "Meva", "Barg"], "Tuganak — yer ostidagi shakli o'zgargan poya."],
    [2, "Sabzining yeyiladigan qismi qaysi organ?", "Ildizmeva", ["Poya", "Meva", "Tuganak"], "Sabzi, lavlagi, sholg'om — ildizmevali o'simliklar."],
    [2, "Qaysi o'simlikda gul va urug' bo'lmaydi, u spora bilan ko'payadi?", "Qirqquloq", ["Olma", "Bug'doy", "Qarag'ay"], "Qirqquloqlar, yo'sinlar va qirqbo'g'imlar spora bilan ko'payadi."],
    [2, "Qarag'ay va archa o'simliklarning qaysi bo'limiga kiradi?", "Ochiq urug'lilar", ["Yopiq urug'lilar", "Yo'sinlar", "Suvo'tlari"], "Ochiq urug'lilarning urug'i qubba qipiqlarida ochiq joylashadi."],
    [2, "Suvda hamda quruqlikda yashovchilarning boshqa nomi nima?", "Amfibiyalar", ["Reptiliyalar", "Sutemizuvchilar", "Bo'g'imoyoqlilar"], "Amfibiyalar: qurbaqa, baqa, salamandra."],
    [2, "Sudralib yuruvchilarning ilmiy nomi qaysi?", "Reptiliyalar", ["Amfibiyalar", "Sutemizuvchilar", "Bo'g'imoyoqlilar"], "Reptiliyalar: ilon, kaltakesak, toshbaqa, timsoh."],
    [2, "Qaysi qush ucha olmaydi?", "Tuyaqush", ["Laylak", "Burgut", "Qaldirg'och"], "Tuyaqush — eng yirik qush, u ucha olmaydi, lekin juda tez yuguradi."],
    [2, "Yer yuzidagi eng yirik hayvon qaysi?", "Ko'k kit", ["Afrika fili", "Jirafa", "Oq akula"], "Ko'k kit — sutemizuvchi."],
    [2, "Ko'rshapalak qaysi sinfga mansub va qanday harakatlanadi?", "Sutemizuvchi, uchadi", ["Qush, uchadi", "Hasharot, uchadi", "Sutemizuvchi, ucha olmaydi"], "Ko'rshapalak — ucha oladigan yagona sutemizuvchilar guruhi."],
    [3, "Gul changining urug'chi tumshuqchasiga tushishi nima deb ataladi?", "Changlanish", ["Urug'lanish", "Unib chiqish", "Bo'linish"], "Changlanishdan keyin urug'lanish sodir bo'ladi."],
    [3, "Gulli o'simliklardagi qo'sh urug'lanishni kim kashf etgan?", "S. G. Navashin", ["Gregor Mendel", "Charlz Darvin", "Robert Guk"], "Navashin 1898-yilda qo'sh urug'lanishni aniqlagan."],
    [3, "Gulning qaysi qismidan meva rivojlanadi?", "Tugunchadan", ["Changdondan", "Gultojibargdan", "Kosachabargdan"], "Urug'langan tugunchadan meva, urug'kurtakdan urug' hosil bo'ladi."],
    [3, "Barg og'izchalari asosan qanday vazifani bajaradi?", "Gaz almashinuvi va suv bug'latish", ["Changlanish", "Suv so'rish", "Urug' hosil qilish"], "Og'izchalar orqali CO₂, O₂ va suv bug'i o'tadi."],
    [3, "O'simliklarning suvni bug'latishi nima deyiladi?", "Transpiratsiya", ["Fotosintez", "Changlanish", "Fermentatsiya"], "Transpiratsiya asosan barg og'izchalari orqali boradi."],
    [3, "Turli tirik organizmlarning o'zaro va muhit bilan munosabatini o'rganuvchi fan qaysi?", "Ekologiya", ["Sitologiya", "Anatomiya", "Genetika"], "Ekologiya atamasini E. Gekkel kiritgan."],
    [3, "Hayvonlarni o'rganuvchi fan qanday ataladi?", "Zoologiya", ["Botanika", "Mikologiya", "Sitologiya"], "Botanika — o'simliklarni, mikologiya — zamburug'larni o'rganadi."],
    [3, "Zamburug'larni o'rganuvchi fan qanday ataladi?", "Mikologiya", ["Zoologiya", "Botanika", "Virusologiya"], "Mikologiya — zamburug'lar haqidagi fan."],
    [3, "Kamyob va yo'qolib ketish xavfi ostidagi turlar qaysi kitobga kiritiladi?", "Qizil kitob", ["Yashil kitob", "Oq kitob", "Ko'k kitob"], "O'zbekistonda ham Qizil kitob mavjud."],
    [3, "Orolning qurishi bilan bog'liq muammo qaysi turdagi muammo hisoblanadi?", "Ekologik muammo", ["Genetik muammo", "Sitologik muammo", "Anatomik muammo"], "Orol fojiasi — mintaqaning eng yirik ekologik muammosi."],
    [3, "Ornitorinx qaysi xususiyati bilan boshqa sutemizuvchilardan ajralib turadi?", "Tuxum qo'yadi", ["Jabra bilan nafas oladi", "Bolasini sut bilan boqmaydi", "Tanasi tangacha bilan qoplangan"], "Ornitorinx — tuxum qo'yuvchi sutemizuvchi, Avstraliyada yashaydi."],
    [3, "Hasharotlar tanasi qaysi uch bo'limdan iborat?", "Bosh, ko'krak, qorin", ["Bosh, bo'yin, dum", "Boshko'krak va qorin", "Bosh, tana, dum"], "O'rgimchaksimonlarda esa boshko'krak va qorin bo'ladi."],
    [3, "O'rgimchaksimonlarning tanasi qaysi bo'limlardan iborat?", "Boshko'krak va qorin", ["Bosh, ko'krak, qorin", "Bosh va dum", "Bosh, bo'yin, tana"], "O'rgimchaksimonlarda mo'ylov bo'lmaydi."],
    [1, "Tuyaning o'rkachida nima to'planadi?", "Yog'", ["Suv", "Havo", "Qon"], "Yog' parchalanganda energiya va suv hosil bo'ladi."],
    [1, "Qushlarning tanasi nima bilan qoplangan?", "Patlar", ["Tangachalar", "Jun", "Shox plastinkalar"], "Patlar qushni sovuqdan saqlaydi va uchishga yordam beradi."],
    [1, "Baliqlarning tanasi nima bilan qoplangan?", "Tangachalar", ["Patlar", "Jun", "Yalang'och teri"], "Tangachalar baliq tanasini himoya qiladi."],
    [1, "Sutemizuvchilarning tanasi odatda nima bilan qoplangan?", "Jun", ["Patlar", "Tangachalar", "Shilimshiq teri"], "Jun tanani sovuqdan saqlaydi."],
    [1, "Kenguru bolasini qayerda olib yuradi?", "Qorin xaltasida", ["Orqasida", "Og'zida", "Uyada qoldiradi"], "Kenguru — xaltali sutemizuvchi."],
    [1, "Lichinkasi tut bargi bilan oziqlanib, pilla o'raydigan hasharot qaysi?", "Tut ipak qurti", ["Asalari", "Chumoli", "Ninachi"], "Pilladan tabiiy ipak olinadi."],
    [1, "Qaysi hayvon umurtqasiz?", "Chumoli", ["Qurbaqa", "Kaptar", "Ilon"], "Hasharotlar umurtqasiz hayvonlar."],
    [1, "Qaysi hayvon umurtqali?", "Qurbaqa", ["Chumoli", "O'rgimchak", "Yomg'ir chuvalchangi"], "Baliqlar, amfibiyalar, reptiliyalar, qushlar va sutemizuvchilar — umurtqalilar."],
    [1, "Qaysi o'simlik urug'ini shamol uzoqqa tarqatadi?", "Qoqio't", ["Olcha", "Tarvuz", "Yong'oq"], "Qoqio't urug'larida mayin tukli \"parashyut\" bor."],
    [1, "Qaysi hayvon qishda qishki uyquga ketadi?", "Ayiq", ["Bo'ri", "Tulki", "Quyon"], "Qishki uyqu paytida ayiq to'plagan yog'i hisobiga yashaydi."],
    [2, "Qaysi hayvonlar issiqqonli?", "Qushlar va sutemizuvchilar", ["Baliqlar va qushlar", "Reptiliyalar va qushlar", "Amfibiyalar va sutemizuvchilar"], "Ularning tana harorati doimiy saqlanadi."],
    [2, "Quyidagilardan qaysi biri sovuqqonli hayvon?", "Kaltakesak", ["Kaptar", "It", "Delfin"], "Sovuqqonlilarning tana harorati muhitga bog'liq."],
    [2, "Kitlar qanday organ yordamida nafas oladi?", "O'pka", ["Jabra", "Teri", "Traxeya"], "Kit havodan nafas olish uchun suv yuzasiga chiqadi."],
    [2, "Sudralib yuruvchilarning tanasi nima bilan qoplangan?", "Shox tangachalar", ["Patlar", "Jun", "Shilimshiq teri"], "Shox tangachalar tanani qurib qolishdan saqlaydi."],
    [2, "Qurbaqaning terisi qanday?", "Yalang'och va shilimshiq", ["Tangachali", "Junli", "Patli"], "Qurbaqa teri orqali ham nafas oladi."],
    [2, "Daraxtning yoshini qanday aniqlash mumkin?", "Yillik halqalar soni bo'yicha", ["Barglar soni bo'yicha", "Balandligi bo'yicha", "Ildiz uzunligi bo'yicha"], "Har yili poyada bitta yillik halqa hosil bo'ladi."],
    [2, "Urug' unib chiqishi uchun nimalar zarur?", "Suv, havo va issiqlik", ["Faqat yorug'lik", "Faqat tuproq", "Faqat o'g'it"], "Urug' quruq va sovuq joyda unmaydi."],
    [2, "Qaysi o'simlik shamol yordamida changlanadi?", "Makkajo'xori", ["Olma", "Atirgul", "O'rik"], "Shamolda changlanadigan gullar mayda va xushbo'y emas."],
    [2, "Hasharotlar yordamida changlanadigan gullar odatda qanday bo'ladi?", "Yorqin, xushbo'y, nektarli", ["Mayda, rangsiz, hidsiz", "Gulsiz", "Faqat yashil"], "Hasharotlar gul rangi va hididan jalb qilinadi."],
    [2, "Kaktusning barglari nimaga aylangan?", "Tikanlarga", ["Gajaklarga", "Tuganaklarga", "Ildizlarga"], "Tikanlar suv bug'lanishini kamaytiradi."],
    [3, "Hasharotlar qanday organ orqali nafas oladi?", "Traxeyalar", ["Jabralar", "O'pkalar", "Faqat teri"], "Traxeyalar tana bo'ylab havoni tarqatadi."],
    [3, "Yomg'ir chuvalchangi qanday nafas oladi?", "Teri orqali", ["O'pka orqali", "Jabra orqali", "Traxeya orqali"], "Chuvalchang terisi doim nam bo'ladi."],
    [3, "Yomg'ir chuvalchangi qaysi tipga kiradi?", "Halqali chuvalchanglar", ["Yassi chuvalchanglar", "Bo'g'imoyoqlilar", "Molluskalar"], "Tanasi halqasimon bo'g'imlardan iborat."],
    [3, "Qaysi hayvon bo'g'imoyoqlilar tipiga kirmaydi?", "Yomg'ir chuvalchangi", ["O'rgimchak", "Kapalak", "Qisqichbaqa"], "Bo'g'imoyoqlilar: hasharotlar, o'rgimchaksimonlar, qisqichbaqasimonlar."],
    [3, "Baliqlarning yuragi necha kamerali?", "2", ["3", "4", "1"], "Bitta bo'lmacha va bitta qorincha."],
    [3, "Amfibiyalarning yuragi necha kamerali?", "3", ["2", "4", "1"], "Ikkita bo'lmacha va bitta qorincha."],
    [3, "Qushlarning yuragi necha kamerali?", "4", ["2", "3", "1"], "Qushlar va sutemizuvchilarda arterial va venoz qon aralashmaydi."],
    [3, "O'simlik poyasida suv va mineral tuzlar ildizdan bargga qaysi qism orqali ko'tariladi?", "Yog'ochlik (naylar)", ["Lub (elaksimon naylar)", "Po'stloq", "O'zak"], "Organik moddalar esa lub orqali harakatlanadi."],
    [3, "Bargda hosil bo'lgan organik moddalar poyaning qaysi qismi orqali tarqaladi?", "Lub (elaksimon naylar)", ["Yog'ochlik (naylar)", "O'zak", "Kambiy"], "Suv va mineral tuzlar esa yog'ochlik orqali ko'tariladi."],
    [3, "Ildizida tuganak hosil qilib, tuproqni azot bilan boyituvchi o'simliklar qaysi?", "Dukkakli o'simliklar", ["Bug'doydoshlar", "Ignabarglilar", "Yo'sinlar"], "Tuganak bakteriyalari havodagi azotni o'zlashtiradi."],
    [3, "Poyaning yo'g'onlashishini ta'minlovchi hosil qiluvchi to'qima qaysi?", "Kambiy", ["Lub", "O'zak", "Po'kak"], "Kambiy hujayralari bo'linib, yillik halqalarni hosil qiladi."],
    [1,"O'simlikni tuproqqa mahkamlab turadigan organi qaysi?","Ildiz",["Barg","Poya","Gul"],"Ildiz o'simlikni tuproqqa mahkamlaydi va suvni so'rib oladi."],
    [1,"Gulning rangdor qismi nima deb ataladi?","Gultoj barg",["Kosa barg","Changchi","Urug'chi"],"Gultoj barglar hasharotlarni o'ziga jalb qiladi."],
    [1,"Baliqlar suvda qanday harakatlanadi?","Suzgichlari yordamida",["Oyoqlari yordamida","Qanotlari yordamida","Patlari yordamida"],"Suzgichlar baliqqa suvda suzishga yordam beradi."],
    [1,"Qurbaqa qayerda tuxum qo'yadi?","Suvda",["Tuproqda","Daraxtda","Toshlar orasida"],"Qurbaqa tuxumlari suvda rivojlanadi."],
    [1,"Ilon qanday harakatlanadi?","Tanasini bukib sirpanib",["Oyoqlari bilan yurib","Sakrab","Uchib"],"Ilonning oyoqlari yo'q, u tanasini bukib harakatlanadi."],
    [1,"Tovuq nima bilan ko'payadi?","Tuxum qo'yish bilan",["Bola tug'ish bilan","Bo'linish bilan","Kurtaklanish bilan"],"Tovuq qush bo'lgani uchun tuxum qo'yib ko'payadi."],
    [1,"Mushuk qanday hayvon turiga kiradi?","Sutemizuvchi",["Qush","Sudralib yuruvchi","Amfibiya"],"Mushuk bolasini sut bilan boqadi, shu sababli sutemizuvchi."],
    [1,"Daraxtning yerdan suv va oziq moddalarni so'ruvchi qismi qaysi?","Ildiz",["Shox","Barg","Po'stloq"],"Ildiz tuproqdan suv va mineral moddalarni so'rib oladi."],
    [1,"Qovoq qaysi o'simliklar guruhiga kiradi?","Poliz ekinlariga",["Don ekinlariga","Mevali daraxtlarga","Ignabargli o'simliklarga"],"Qovoq, tarvuz, qovun poliz ekinlari hisoblanadi."],
    [1,"Asalarilar nima to'playdi?","Asal",["Sut","Jun","Tuxum"],"Asalarilar gul nektaridan asal ishlab chiqaradi."],
    [1,"Quyonning tanasi nima bilan qoplangan?","Jun",["Pat","Tangacha","Teri qatlami"],"Quyon sutemizuvchi bo'lgani uchun tanasi jun bilan qoplangan."],
    [1,"Daraxt bargining asosiy rangi nimaga bog'liq?","Xlorofillga",["Suvga","Tuproqqa","Haroratga"],"Xlorofill pigmenti bargga yashil rang beradi."],
    [1,"Tuyaqush qanday hayvon?","Uchmaydigan yirik qush",["Sudralib yuruvchi","Sutemizuvchi","Amfibiya"],"Tuyaqush qush bo'lsa ham qanotlari uchishga yaramaydi."],
    [2,"Fotosintez jarayonida o'simlik havodan qaysi gazni yutadi?","Karbonat angidrid",["Kislorod","Azot","Vodorod"],"O'simlik fotosintezda karbonat angidridni yutib, kislorod chiqaradi."],
    [2,"Gulning erkak jinsiy organi qaysi?","Changchi",["Urug'chi","Gultoj barg","Kosa barg"],"Changchida chang hosil bo'ladi, bu erkak jinsiy hujayra tashuvchi qism."],
    [2,"Gulning urg'ochi jinsiy organi qaysi?","Urug'chi",["Changchi","Gultoj barg","Bandi"],"Urug'chining tugunchasida tuxum hujayra joylashadi."],
    [2,"Sut emizuvchilar boshqa hayvonlardan qaysi belgisi bilan ajralib turadi?","Bolasini sut bilan boqishi",["Tuxum qo'yishi","Jabra bilan nafas olishi","Sovuqqonligi"],"Sutemizuvchilarning asosiy belgisi — bolasini ona suti bilan boqishi."],
    [2,"Qushlarning uchishiga moslashgan tana qismi qaysi?","Qanotlari",["Patlari rangi","Tumshug'i","Oyog'i"],"Qanotlar havoda uchish uchun asosiy harakat organidir."],
    [2,"Yirtqich hayvonlarning tishlari qanday xususiyatga ega?","O'tkir va uzun",["Yassi va keng","Juda mayda","Umuman yo'q"],"Yirtqichlarning tishlari go'shtni tishlab, bo'laklashga moslashgan."],
    [2,"O'txo'r hayvonlarning oshqozon-ichak tizimi qanday xususiyatga ega?","Uzun ichaklari bor",["Ichaklari juda qisqa","Oshqozoni yo'q","Faqat suyuqlik ichadi"],"Uzun ichak o'simlik tolalarini yaxshi hazm qilishga yordam beradi."],
    [2,"Changlanishdan keyin o'simlikda nima rivojlanadi?","Urug' va meva",["Ildiz","Poya","Barg"],"Changlanish va urug'lanishdan so'ng tugunchadan meva, ichida urug' yetiladi."],
    [2,"Qaysi o'simlik guruhi urug'ini ochiq holda, qubba ichida tutadi?","Ochiq urug'lilar",["Yopiq urug'lilar","Sporali o'simliklar","Suvo'tlar"],"Qarag'aysimonlar urug'ini qubba ichida ochiq holda saqlaydi."],
    [2,"Ignabargli o'simliklarning bargi nima uchun ingichka va mum qoplamali?","Suv bug'lanishini kamaytirish uchun",["Fotosintezni to'xtatish uchun","Changlanishni osonlashtirish uchun","Rangini o'zgartirish uchun"],"Ingichka, mumli barg qish va qurg'oqchilikda suv yo'qotishni kamaytiradi."],
    [2,"Qaysi hayvonlar guruhi tanasi segmentlardan (bo'g'imlardan) tuzilgan va tashqi skeletga ega?","Bo'g'imoyoqlilar",["Sutemizuvchilar","Amfibiyalar","Qushlar"],"Bo'g'imoyoqlilarning tanasi xitin qobiq bilan qoplangan bo'g'imlardan iborat."],
    [2,"Mollyuskalar (qorinoyoqlilar) tanasini qanday qobiq himoya qiladi?","Ohakli chig'anoq",["Xitin qobiq","Suyak skelet","Pat qoplami"],"Ko'pchilik mollyuskalarning tanasi ohakli chig'anoq bilan himoyalangan."],
    [2,"Quruqlikda yashovchi umurtqali hayvonlar qaysi organ bilan nafas oladi?","O'pka",["Jabra","Suzgich","Yon chiziq"],"O'pkali hayvonlar havodagi kislorodni to'g'ridan-to'g'ri yutadi."],
    [2,"O'simlik urug'ida zahira oziq moddalar qaysi qismda saqlanadi?","Urug' pallasida yoki endospermda",["Ildizchada","Po'stida","Gulbandida"],"Urug' unib chiqguncha kerakli oziqni urug' bargidan oladi."],
    [2,"Yirik shox-shabbali daraxtlar o'rmonda qaysi ekologik rolni bajaradi?","Kislorod ishlab chiqarish va havoni tozalash",["Faqat soya berish","Suvni ifloslantirish","Haroratni oshirish"],"Daraxtlar fotosintez orqali kislorod ajratib, havoni tozalaydi."],
    [2,"Qaysi hayvon turi parazitlik qilib yashaydi?","Gijja",["Sher","Tipratikan","Lochin"],"Gijja boshqa organizm ichida yashab, undan oziqlanadi."],
    [2,"Simbioz munosabatda ikki organizm qanday yashaydi?","Bir-biriga foyda keltirib",["Bir-birini yo'q qilib","Mutlaqo aloqasiz","Faqat raqobatlashib"],"Simbiozda ikki tur birgalikda yashab, ikkisi ham foyda ko'radi."],
    [3,"Fotosintez natijasida hosil bo'lgan organik modda nima?","Glyukoza (uglevod)",["Oqsil","Yog'","Vitamin"],"Fotosintezda karbonat angidrid va suvdan glyukoza hosil bo'ladi."],
    [3,"O'simliklarda suv va mineral moddalarning ildizdan yuqoriga ko'tarilishini ta'minlovchi kuch nima bilan bog'liq?","Barglardan suv bug'lanishi (transpiratsiya)",["Poyaning rangi","Gulning hajmi","Urug'ning og'irligi"],"Barglardan suv bug'langanda naylarda pastdan yuqoriga tortilish kuchi hosil bo'ladi."],
    [3,"Hasharotlarning tanasidagi tashqi qobiq qaysi moddadan iborat?","Xitin",["Keratin","Kollagen","Selluloza"],"Xitin hasharot tanasini himoya qiluvchi qattiq tashqi qobiq hosil qiladi."],
    [3,"Sudralib yuruvchilar tuxumining qushlar tuxumidan asosiy farqi nimada?","Po'sti yumshoqroq va charm-qobiqli",["Rangi boshqacha","Hajmi doim kichik","Ichida suv yo'q"],"Ko'pchilik sudralib yuruvchi tuxumi charm-qobiqli yumshoq po'stga ega."],
    [3,"Qaysi hayvonlar guruhi tana haroratini tashqi muhitga qarab o'zgartiradi?","Sovuqqon hayvonlar (sudralib yuruvchilar, amfibiyalar)",["Qushlar","Sutemizuvchilar","Barcha hayvonlar"],"Sovuqqon hayvonlarda tana harorati doimiy emas, muhit haroratiga bog'liq."],
    [3,"Lishayniklar qanday ikki organizmning birgalikdagi hosilasi hisoblanadi?","Zamburug' va suvo't (yoki siyanobakteriya)",["Bakteriya va viruslar","Mox va paporotnik","Ildiz va barg"],"Lishaynikda zamburug' va suvo't simbiotik birga yashaydi."],
    [3,"O'simlik to'qimalarida hosil bo'luvchi to'qima (meristema) qaysi vazifani bajaradi?","Yangi hujayralar hosil qilib o'simlikning o'sishini ta'minlaydi",["Oziq moddalarni saqlaydi","Faqat suv o'tkazadi","Himoya vazifasini bajaradi"],"Meristema hujayralari bo'linib, o'simlikning uzunlik va yo'g'onlik bo'yicha o'sishini ta'minlaydi."],
    [3,"Baliqlarning suv bosimini his qilishiga yordam beruvchi maxsus a'zosi qaysi?","Yon chiziq a'zosi",["Suzgich pufagi","Jabra qopqog'i","Dum suzgichi"],"Yon chiziq a'zosi baliqqa suvdagi oqim va bosim o'zgarishini sezishga yordam beradi."],
    [3,"Qushlarning tanasini yengillashtirib, uchishga yordam beradigan, o'pkaga ulangan tuzilmalar nima?","Havo xaltachalari",["Jabra","Yelka suyagi","Qanot pati"],"Qushlarda suyak ichidagi havo xaltachalari tanani yengillashtirib, uchishga yordam beradi."],
    [3,"Lishaynik va moxlar qaysi muhitda ham o'sa oladigan chidamli organizmlar hisoblanadi?","Qoyalar va qutb mintaqalari kabi og'ir sharoitlarda",["Faqat issiq cho'llarda","Faqat chuchuk suv havzalarida","Faqat o'rmon ichida"],"Lishaynik va moxlar qattiq sharoitlarga chidamli bo'lib, qoyalarda ham o'sa oladi."],
    [3,"Dukkakli o'simliklar ildizidagi tuganak bakteriyalari havodagi qaysi gazni to'playdi?","Azot",["Kislorod","Karbonat angidrid","Vodorod"],"Tuganak bakteriyalari havo azotini biriktirib, tuproqni azotga boyitadi."]
  ];
  var OGUR = ["Bir pallalilar", "Ikki pallalilar", "Ochiq urug'lilar", "Qirqquloqsimonlar", "Yo'sinlar"];
  // [o'simlik, guruh indeksi, daraja]
  var OSIM = [["Bug'doy", 0, 1], ["Makkajo'xori", 0, 1], ["Sholi", 0, 2], ["Piyoz", 0, 2], ["Arpa", 0, 2], ["Lola", 0, 2], ["Palma", 0, 3],
    ["Loviya", 1, 1], ["No'xat", 1, 1], ["O'rik", 1, 1], ["Olma", 1, 1], ["Kungaboqar", 1, 2], ["G'o'za", 1, 2], ["Kartoshka", 1, 2], ["Pomidor", 1, 2], ["Qovun", 1, 2], ["Atirgul", 1, 3],
    ["Qarag'ay", 2, 1], ["Archa", 2, 2], ["Sarv", 2, 3], ["Qoraqarag'ay", 2, 3], ["Qirqquloq", 3, 2], ["Funariya", 4, 3], ["Sfagnum", 4, 3]];
  function genOgur(L) {
    var o = pick(lvList(OSIM, L, 2)), a = OGUR[o[1]];
    return Q("<b>" + o[0] + "</b> o'simliklarning qaysi guruhiga kiradi?", a, others(OGUR, a, 4), [o[0] + " — " + a.toLowerCase() + " guruhiga kiradi."]);
  }
  var OILA = ["Ra'noguldoshlar", "Ituzumdoshlar", "Dukkakdoshlar", "Bug'doydoshlar", "Karamdoshlar"];
  var OILA_O = [["Olma", 0], ["Nok", 0], ["O'rik", 0], ["Olcha", 0], ["Atirgul", 0], ["Shaftoli", 0],
    ["Kartoshka", 1], ["Pomidor", 1], ["Baqlajon", 1], ["Bulg'or qalampiri", 1],
    ["Loviya", 2], ["No'xat", 2], ["Beda", 2], ["Soya", 2], ["Mosh", 2],
    ["Bug'doy", 3], ["Arpa", 3], ["Sholi", 3], ["Makkajo'xori", 3], ["Javdar", 3],
    ["Karam", 4], ["Turp", 4], ["Sholg'om", 4], ["Rediska", 4]];
  function genOila(L) {
    var o = pick(OILA_O), a = OILA[o[1]];
    if (Math.random() < 0.6) return Q("<b>" + o[0] + "</b> qaysi oilaga mansub?", a, others(OILA, a, 4), [o[0] + " — " + a.toLowerCase() + " oilasiga mansub."]);
    var w = []; [0, 1, 2, 3, 4].forEach(function (k) { if (k !== o[1]) w.push(pick(OILA_O.filter(function (x) { return x[1] === k; }))[0]); });
    return Q("Qaysi o'simlik <b>" + a.toLowerCase() + "</b> oilasiga mansub?", o[0], w, [o[0] + " — " + a.toLowerCase() + " oilasiga mansub."]);
  }
  topic("b3", "Biologiya · O'simliklar va hayvonlar dunyosi", B3, [{ p: 0.25, fn: genSinf }, { p: 0.14, fn: genSinfTop }, { p: 0.12, fn: genOgur },
    { p: 0.1, fn: function (L) { return L === 3 ? genOila(L) : null; } }]);

  /* ================= g1 Geografiya · Davlatlar va poytaxtlar ================= */
  // [davlat, poytaxt, mintaqa, daraja, dunyo qismi (aniq bo'lsa)]
  // mintaqa: mo — Markaziy Osiyo va qo'shnilar, ev — Yevropa, os — Osiyo, ys — Yaqin Sharq, af — Afrika, am — Amerika, ok — Okeaniya
  var DAV = [
    ["O'zbekiston", "Toshkent", "mo", 1, "Osiyo"], ["Qozog'iston", "Astana", "mo", 1, ""], ["Qirg'iziston", "Bishkek", "mo", 1, "Osiyo"],
    ["Tojikiston", "Dushanbe", "mo", 1, "Osiyo"], ["Turkmaniston", "Ashxobod", "mo", 1, "Osiyo"], ["Afg'oniston", "Kobul", "mo", 1, "Osiyo"],
    ["Rossiya", "Moskva", "ev", 1, ""], ["Turkiya", "Anqara", "ys", 2, ""], ["Xitoy", "Pekin", "os", 1, "Osiyo"], ["Yaponiya", "Tokio", "os", 1, "Osiyo"],
    ["Hindiston", "Nyu-Dehli", "os", 1, "Osiyo"], ["AQSH", "Vashington", "am", 1, "Amerika"], ["Kanada", "Ottava", "am", 2, "Amerika"],
    ["Braziliya", "Braziliya", "am", 3, "Amerika"], ["Avstraliya", "Kanberra", "ok", 3, "Avstraliya va Okeaniya"], ["Misr", "Qohira", "af", 1, ""],
    ["Germaniya", "Berlin", "ev", 1, "Yevropa"], ["Fransiya", "Parij", "ev", 1, "Yevropa"], ["Buyuk Britaniya", "London", "ev", 1, "Yevropa"],
    ["Italiya", "Rim", "ev", 1, "Yevropa"], ["Ispaniya", "Madrid", "ev", 1, "Yevropa"], ["Janubiy Koreya", "Seul", "os", 2, "Osiyo"],
    ["Eron", "Tehron", "ys", 2, "Osiyo"], ["Pokiston", "Islomobod", "os", 2, "Osiyo"], ["Saudiya Arabistoni", "Ar-Riyod", "ys", 2, "Osiyo"],
    ["BAA", "Abu-Dabi", "ys", 2, "Osiyo"], ["Malayziya", "Kuala-Lumpur", "os", 3, "Osiyo"], ["Argentina", "Buenos-Ayres", "am", 2, "Amerika"],
    ["Meksika", "Mexiko", "am", 2, "Amerika"], ["Polsha", "Varshava", "ev", 2, "Yevropa"], ["Ukraina", "Kiyev", "ev", 1, "Yevropa"],
    ["Ozarbayjon", "Boku", "mo", 1, ""], ["Gruziya", "Tbilisi", "mo", 2, ""], ["Armaniston", "Yerevan", "mo", 2, ""],
    ["Belarus", "Minsk", "ev", 2, "Yevropa"], ["Mo'g'uliston", "Ulan-Bator", "os", 2, "Osiyo"], ["Norvegiya", "Oslo", "ev", 2, "Yevropa"],
    ["Shvetsiya", "Stokgolm", "ev", 2, "Yevropa"], ["Finlandiya", "Xelsinki", "ev", 3, "Yevropa"], ["Niderlandiya", "Amsterdam", "ev", 3, "Yevropa"],
    ["Belgiya", "Bryussel", "ev", 2, "Yevropa"], ["Shveytsariya", "Bern", "ev", 3, "Yevropa"], ["Avstriya", "Vena", "ev", 2, "Yevropa"],
    ["Gretsiya", "Afina", "ev", 2, "Yevropa"], ["Portugaliya", "Lissabon", "ev", 2, "Yevropa"], ["Chexiya", "Praga", "ev", 2, "Yevropa"],
    ["Vengriya", "Budapesht", "ev", 2, "Yevropa"], ["Nigeriya", "Abuja", "af", 3, "Afrika"], ["Keniya", "Nayrobi", "af", 3, "Afrika"],
    ["Tailand", "Bangkok", "os", 2, "Osiyo"], ["Vyetnam", "Xanoy", "os", 3, "Osiyo"], ["Filippin", "Manila", "os", 3, "Osiyo"],
    ["Bangladesh", "Dakka", "os", 3, "Osiyo"], ["Kuba", "Gavana", "am", 2, "Amerika"], ["Chili", "Santyago", "am", 3, "Amerika"],
    ["Peru", "Lima", "am", 3, "Amerika"], ["Kolumbiya", "Bogota", "am", 3, "Amerika"], ["Yangi Zelandiya", "Vellington", "ok", 3, "Avstraliya va Okeaniya"],
    ["Irlandiya", "Dublin", "ev", 3, "Yevropa"], ["Daniya", "Kopengagen", "ev", 2, "Yevropa"], ["Qatar", "Doha", "ys", 3, "Osiyo"],
    ["Kuvayt", "Kuvayt", "ys", 3, "Osiyo"], ["Iroq", "Bag'dod", "ys", 2, "Osiyo"], ["Suriya", "Damashq", "ys", 2, "Osiyo"],
    ["Iordaniya", "Ammon", "ys", 3, "Osiyo"], ["Marokash", "Rabat", "af", 3, "Afrika"], ["Jazoir", "Jazoir", "af", 3, "Afrika"],
    ["Tunis", "Tunis", "af", 3, "Afrika"], ["Efiopiya", "Addis-Abeba", "af", 3, "Afrika"]
  ];
  var QITA = ["Osiyo", "Yevropa", "Afrika", "Amerika", "Avstraliya va Okeaniya", "Antarktida"];
  function davPool(L) {
    var p = DAV.filter(function (d) { return L === 1 ? d[3] === 1 : L === 2 ? d[3] === 2 || (d[3] === 1 && Math.random() < 0.3) : d[3] >= 2; });
    return p.length ? p : DAV;
  }
  // bir mintaqadan, keyin boshqalardan
  function capW(d, idx, n) {
    var near = shuffle(DAV.filter(function (x) { return x[2] === d[2] && x[idx] !== d[idx]; })).map(function (x) { return x[idx]; });
    var far = shuffle(DAV.filter(function (x) { return x[2] !== d[2] && x[idx] !== d[idx]; })).map(function (x) { return x[idx]; });
    var out = [];
    near.concat(far).forEach(function (v) { if (out.length < n && out.indexOf(v) < 0) out.push(v); });
    return out;
  }
  function genPoyt(L) {
    var d = pick(davPool(L));
    return Q("<b>" + d[0] + "</b> davlatining poytaxti qaysi shahar?", d[1], capW(d, 1, 4), [d[0] + " poytaxti — " + d[1] + "."]);
  }
  function genDav(L) {
    var d = pick(davPool(L));
    if (d[0] === d[1]) return null;
    return Q("<b>" + d[1] + "</b> shahri qaysi davlatning poytaxti?", d[0], capW(d, 0, 4), [d[1] + " — " + d[0] + " poytaxti."]);
  }
  function genQita(L) {
    var p = DAV.filter(function (d) { return d[4] && (L === 1 ? d[3] <= 2 : true); }), d = pick(p);
    return Q("<b>" + d[0] + "</b> dunyoning qaysi qismida joylashgan?", d[4], others(QITA, d[4], 4), [d[0] + " — " + d[4] + "da joylashgan."]);
  }
  var G1 = [
    [1, "Dunyodagi maydoni eng katta davlat qaysi?", "Rossiya", ["Kanada", "Xitoy", "AQSH"], "Rossiya maydoni 17 mln km² dan ortiq."],
    [1, "Qaysi davlat O'zbekiston bilan chegaradosh emas?", "Eron", ["Qozog'iston", "Tojikiston", "Afg'oniston"], "O'zbekiston 5 davlat bilan chegaradosh: Qozog'iston, Qirg'iziston, Tojikiston, Turkmaniston, Afg'oniston."],
    [2, "Qaysi davlat bir vaqtning o'zida ham davlat, ham materik hisoblanadi?", "Avstraliya", ["Grenlandiya", "Braziliya", "Kanada"], "Avstraliya — butun bir materikni egallagan davlat."],
    [2, "Qaysi davlatning poytaxti davlat nomi bilan bir xil?", "Kuvayt", ["Iroq", "Eron", "Turkiya"], "Kuvaytning poytaxti — Kuvayt shahri."],
    [3, "Dunyodagi maydoni eng kichik davlat qaysi?", "Vatikan", ["Monako", "San-Marino", "Lixtenshteyn"], "Vatikan Rim shahri ichida joylashgan."],
    [1,"Yaponiyaning poytaxti qaysi shahar?","Tokio",["Osaka","Kioto","Nagoya"],"Tokio Yaponiyaning poytaxti va eng yirik shahridir."],
    [1,"Fransiyaning poytaxti qaysi shahar?","Parij",["Lion","Marsel","Nitssa"],"Parij Sena daryosi bo'yida joylashgan Fransiya poytaxtidir."],
    [1,"Italiyaning poytaxti qaysi shahar?","Rim",["Milan","Neapol","Turin"],"Rim Italiyaning poytaxti bo'lib, Tibr daryosi bo'yida joylashgan."],
    [1,"Germaniyaning poytaxti qaysi shahar?","Berlin",["Myunxen","Gamburg","Frankfurt"],"Berlin birlashgan Germaniyaning poytaxtidir."],
    [1,"Misr Arab Respublikasining poytaxti qaysi shahar?","Qohira",["Iskandariya","Luksor","Asvon"],"Qohira Nil daryosi bo'yida joylashgan Misr poytaxtidir."],
    [1,"Qozog'istonning hozirgi poytaxti qaysi shahar?","Astana",["Olmaota","Qaraganda","Shimkent"],"Olmaota 1997-yilgacha poytaxt bo'lgan, hozir poytaxt Astanadir."],
    [1,"Qirg'iziston poytaxti qaysi shahar?","Bishkek",["Osh","Jalolobod","Talas"],"Bishkek Qirg'izistonning poytaxti va eng yirik shahridir."],
    [1,"Turkmaniston poytaxti qaysi shahar?","Ashxobod",["Mari","Turkmanboshi","Dashog'uz"],"Ashxobod Qoraqum cho'li yaqinida joylashgan Turkmaniston poytaxtidir."],
    [1,"Tojikiston poytaxti qaysi shahar?","Dushanbe",["Xo'jand","Kulob","Panjakent"],"Dushanbe Tojikistonning poytaxti va eng yirik shahridir."],
    [1,"Xitoyning poytaxti qaysi shahar?","Pekin",["Shanxay","Guanchjou","Chengdu"],"Pekin Xitoy Xalq Respublikasining poytaxtidir."],
    [1,"Hindistonning poytaxti qaysi shahar?","Nyu-Dehli",["Mumbay","Kolkata","Chennai"],"Nyu-Dehli Hindistonning poytaxti, Mumbay esa eng yirik shaharlaridan biri."],
    [1,"Buyuk Britaniyaning poytaxti qaysi shahar?","London",["Manchester","Edinburg","Liverpul"],"London Temza daryosi bo'yida joylashgan Buyuk Britaniya poytaxtidir."],
    [1,"AQShning poytaxti qaysi shahar?","Vashington",["Nyu-York","Los-Anjeles","Chikago"],"Vashington (Kolumbiya okrugi) AQShning poytaxtidir, Nyu-York esa poytaxt emas."],
    [1,"Turkiyaning poytaxti qaysi shahar?","Anqara",["Istanbul","Izmir","Bursa"],"Turkiya poytaxti Anqara, eng yirik shahri esa Istanbuldir."],
    [1,"Kanadaning poytaxti qaysi shahar?","Ottava",["Toronto","Vankuver","Monreal"],"Ottava Kanadaning poytaxti, Toronto esa eng yirik shahri."],
    [1,"Braziliyaning poytaxti qaysi shahar?","Braziliya",["Rio-de-Janeyro","San-Paulu","Salvador"],"Braziliya poytaxti 1960-yildan boshlab Braziliya shahridir."],
    [1,"Ispaniyaning poytaxti qaysi shahar?","Madrid",["Barselona","Valensiya","Sevilya"],"Madrid Ispaniyaning markazida joylashgan poytaxtdir."],
    [1,"Afg'onistonning poytaxti qaysi shahar?","Kobul",["Qandahor","Hirot","Mozori Sharif"],"Kobul Afg'oniston poytaxti va eng yirik shahridir."],
    [1,"Argentinaning poytaxti qaysi shahar?","Buenos-Ayres",["Kordova","Rosario","Mendosa"],"Buenos-Ayres Argentinaning poytaxti va eng yirik shahridir."],
    [1,"Janubiy Amerikadagi maydoni eng katta davlat qaysi?","Braziliya",["Argentina","Peru","Kolumbiya"],"Braziliya Janubiy Amerika maydonining qariyb yarmini egallaydi."],
    [2,"Avstraliyaning poytaxti qaysi shahar?","Kanberra",["Sidney","Melburn","Pert"],"Sidney eng yirik shahar, ammo poytaxt Kanberradir."],
    [2,"Marokashning poytaxti qaysi shahar?","Rabat",["Kasablanka","Marrakesh","Fes"],"Kasablanka eng yirik shahar, poytaxt esa Rabatdir."],
    [2,"Janubiy Koreyaning poytaxti qaysi shahar?","Seul",["Pusan","Inchxon","Tegu"],"Seul Xan daryosi bo'yida joylashgan Janubiy Koreya poytaxtidir."],
    [2,"Nigeriyaning poytaxti qaysi shahar?","Abuja",["Lagos","Kano","Ibadan"],"Lagos eng yirik shahar, poytaxt esa 1991-yildan Abujadir."],
    [2,"Keniyaning poytaxti qaysi shahar?","Nayrobi",["Mombasa","Kisumu","Nakuru"],"Nayrobi Keniyaning poytaxti va eng yirik shahridir."],
    [2,"Pokistonning poytaxti qaysi shahar?","Islomobod",["Karachi","Lahor","Peshovar"],"Karachi eng yirik shahar, poytaxt esa Islomobod."],
    [2,"Kubaning poytaxti qaysi shahar?","Gavana",["Santyago-de-Kuba","Kamaguey","Holguin"],"Gavana Kuba orolining shimolida joylashgan poytaxtdir."],
    [2,"Peruning poytaxti qaysi shahar?","Lima",["Kusko","Arekipa","Truxiljo"],"Lima Tinch okeani sohilida joylashgan Peru poytaxtidir."],
    [2,"Shvetsiyaning poytaxti qaysi shahar?","Stokgolm",["Gyoteborg","Malme","Upsala"],"Stokgolm Skandinaviya yarimorolining sharqiy sohilida joylashgan."],
    [2,"Norvegiyaning poytaxti qaysi shahar?","Oslo",["Bergen","Trondxeym","Stavanger"],"Oslo Norvegiyaning poytaxti va eng yirik shahridir."],
    [2,"Polshaning poytaxti qaysi shahar?","Varshava",["Krakov","Gdansk","Vrotslav"],"Varshava Visla daryosi bo'yida joylashgan Polsha poytaxtidir."],
    [2,"Ukrainaning poytaxti qaysi shahar?","Kiyev",["Xarkov","Odessa","Lvov"],"Kiyev Dnepr daryosi bo'yida joylashgan Ukraina poytaxtidir."],
    [2,"Gruziyaning poytaxti qaysi shahar?","Tbilisi",["Batumi","Kutaisi","Poti"],"Tbilisi Kura daryosi bo'yida joylashgan Gruziya poytaxtidir."],
    [2,"Ozarbayjonning poytaxti qaysi shahar?","Boku",["Ganja","Sumqayit","Lankaran"],"Boku Kaspiy dengizi sohilida joylashgan Ozarbayjon poytaxtidir."],
    [2,"Mo'g'ulistonning poytaxti qaysi shahar?","Ulan-Bator",["Darxon","Erdenet","Xovd"],"Ulan-Bator Mo'g'ulistonning poytaxti va eng yirik shahridir."],
    [2,"Vyetnamning poytaxti qaysi shahar?","Xanoy",["Xoshimin","Xayfon","Da Nang"],"Xoshimin eng yirik shahar, poytaxt esa Xanoydir."],
    [2,"Tailandning poytaxti qaysi shahar?","Bangkok",["Chiangmay","Pattaya","Phuket"],"Bangkok Tailandning poytaxti va eng yirik shahridir."],
    [2,"Maydoni bo'yicha dunyoda ikkinchi o'rindagi davlat qaysi?","Kanada",["Xitoy","AQSh","Braziliya"],"Maydoni bo'yicha Rossiyadan keyin Kanada ikkinchi o'rinda turadi."],
    [2,"Avstriyaning poytaxti qaysi shahar?","Vena",["Zalsburg","Grats","Lints"],"Vena Dunay daryosi bo'yida joylashgan Avstriya poytaxtidir."],
    [2,"Shveytsariyaning poytaxti (federal shahri) qaysi?","Bern",["Syurix","Jeneva","Bazel"],"Syurix eng yirik shahar, hukumat joylashgan shahar esa Bern."],
    [3,"Myanmaning (Birmaning) hozirgi poytaxti qaysi shahar?","Naypyido",["Yangon","Mandalay","Bago"],"Poytaxt 2006-yilda Yangondan Naypyidoga ko'chirilgan."],
    [3,"Butan davlatining poytaxti qaysi shahar?","Timpu",["Paro","Punakxa","Gelefu"],"Timpu Himolay tog'laridagi Butanning poytaxtidir."],
    [3,"Nepalning poytaxti qaysi shahar?","Katmandu",["Pokxara","Lalitpur","Biratnagar"],"Katmandu Nepalning poytaxti va eng yirik shahridir."],
    [3,"Yangi Zelandiyaning poytaxti qaysi shahar?","Vellington",["Oklend","Kristchirch","Gamilton"],"Oklend eng yirik shahar, poytaxt esa Vellingtondir."],
    [3,"Kolumbiyaning poytaxti qaysi shahar?","Bogota",["Medelin","Kali","Kartaxena"],"Bogota And tog'laridagi Kolumbiya poytaxtidir."],
    [3,"Chilining poytaxti qaysi shahar?","Santyago",["Valparaiso","Kontsepsion","Antofagasta"],"Valparaiso port shahar, poytaxt esa Santyagodir."],
    [3,"Efiopiyaning poytaxti qaysi shahar?","Addis-Abeba",["Dire-Dava","Gondar","Mekele"],"Addis-Abeba Efiopiyaning poytaxti va eng yirik shahridir."],
    [3,"Tanzaniyaning rasmiy poytaxti qaysi shahar?","Dodoma",["Dar-es-Salom","Arusha","Zanzibar"],"Dar-es-Salom eng yirik shahar, rasmiy poytaxt esa Dodomadir."],
    [3,"Venesuelaning poytaxti qaysi shahar?","Karakas",["Maracaybo","Valensiya","Barkisimeto"],"Karakas Venesuelaning poytaxti va eng yirik shahridir."],
    [3,"Islandiyaning poytaxti qaysi shahar?","Reykyavik",["Akureyri","Keflavik","Hafnarfyordyur"],"Reykyavik dunyoning eng shimoliy joylashgan mustaqil davlat poytaxtidir."],
    [3,"Finlyandiyaning poytaxti qaysi shahar?","Xelsinki",["Tampere","Turku","Espoo"],"Xelsinki Boltiq dengizining Finlyandiya ko'rfazi bo'yida joylashgan."],
    [3,"Ruminiyaning poytaxti qaysi shahar?","Buxarest",["Kluj-Napoka","Timishoara","Konstansa"],"Buxarest Ruminiyaning poytaxti va eng yirik shahridir."],
    [3,"Livanning poytaxti qaysi shahar?","Bayrut",["Tripoli","Sidon","Tir"],"Bayrut O'rta dengiz sohilida joylashgan Livan poytaxtidir."],
    [3,"Saudiya Arabistonining poytaxti qaysi shahar?","Ar-Riyod",["Jidda","Dammom","Tabuk"],"Ar-Riyod mamlakat markazida joylashgan Saudiya Arabistoni poytaxtidir."],
    [3,"Dunyodagi dengizga chiqish imkoni yo'q eng katta davlat qaysi?","Qozog'iston",["Mo'g'uliston","Chad","Niger"],"Qozog'iston maydoni bo'yicha dunyoda 9-o'rinda turuvchi, okeanga chiqmaydigan eng katta davlat."],
    [3,"O'zbekistondan tashqari qaysi davlat dengizga chiqish uchun kamida ikki davlat hududini kesib o'tishi kerak?","Lixtenshteyn",["Shveytsariya","Avstriya","Slovakiya"],"Dunyoda faqat ikki davlat «ikki karra quruqlik bilan o'ralgan»: O'zbekiston va Lixtenshteyn."],
    [3,"Afrikadagi maydoni eng katta davlat qaysi?","Jazoir",["Kongo Demokratik Respublikasi","Sudan","Liviya"],"2011-yildan, Sudan ikkiga bo'linganidan so'ng, Jazoir Afrikaning eng katta davlatiga aylandi."],
    [3,"Janubiy Amerikadagi qaysi davlat dengizga chiqish imkoniga ega emas?","Paragvay",["Peru","Chili","Urugvay"],"Janubiy Amerikada faqat Boliviya va Paragvay dengizga chiqmaydi."],
    [3,"Gananing poytaxti qaysi shahar?","Akkra",["Kumasi","Takoradi","Tamale"],"Akkra Gvineya ko'rfazi sohilida joylashgan Gana poytaxtidir."],
    [3,"Kamerunning poytaxti qaysi shahar?","Yaunde",["Duala","Garua","Bafussam"],"Duala eng yirik shahar, poytaxt esa Yaundedir."]
  ];
  topic("g1", "Geografiya · Davlatlar va poytaxtlar", G1, [{ p: 0.55, fn: genPoyt }, { p: 0.3, fn: genDav }, { p: 0.12, fn: genQita }]);

  /* ================= g2 Geografiya · O'zbekiston geografiyasi ================= */
  var VIL = [
    ["Andijon viloyati", "Andijon"], ["Buxoro viloyati", "Buxoro"], ["Farg'ona viloyati", "Farg'ona"], ["Jizzax viloyati", "Jizzax"],
    ["Xorazm viloyati", "Urganch"], ["Namangan viloyati", "Namangan"], ["Navoiy viloyati", "Navoiy"], ["Qashqadaryo viloyati", "Qarshi"],
    ["Samarqand viloyati", "Samarqand"], ["Sirdaryo viloyati", "Guliston"], ["Surxondaryo viloyati", "Termiz"], ["Toshkent viloyati", "Nurafshon"],
    ["Qoraqalpog'iston Respublikasi", "Nukus"]
  ];
  var VIL_HARD = { "Xorazm viloyati": 1, "Qashqadaryo viloyati": 1, "Sirdaryo viloyati": 1, "Surxondaryo viloyati": 1, "Toshkent viloyati": 1, "Qoraqalpog'iston Respublikasi": 1 };
  function genVil(L) {
    var pool = VIL.filter(function (v) { return L === 1 ? v[0].indexOf(v[1]) === 0 || v[0] === "Qoraqalpog'iston Respublikasi" : VIL_HARD[v[0]]; });
    if (L === 3) pool = VIL;
    var v = pick(pool), cs = VIL.map(function (x) { return x[1]; });
    if (Math.random() < 0.6 || L === 1) {
      var w = others(cs, v[1], 4);
      if (v[0] === "Toshkent viloyati") w[0] = "Toshkent";
      var rs = /Respublikasi$/.test(v[0]) ? "poytaxti" : "markazi";
      return Q("<b>" + v[0] + "</b>ning " + rs + " qaysi shahar?", v[1], w, [v[0] + " " + rs + " — " + v[1] + "."]);
    }
    return Q("<b>" + v[1] + "</b> shahri qaysi hududning markazi?", v[0], others(VIL.map(function (x) { return x[0]; }), v[0], 4), [v[1] + " — " + v[0] + " markazi."]);
  }
  var G2 = [
    [1, "O'zbekiston nechta davlat bilan chegaradosh?", "5", ["4", "6", "3", "7"], "Qozog'iston, Qirg'iziston, Tojikiston, Turkmaniston va Afg'oniston."],
    [1, "O'zbekiston poytaxti qaysi shahar?", "Toshkent", ["Samarqand", "Buxoro", "Namangan"], "Toshkent — O'zbekistonning poytaxti va eng katta shahri."],
    [1, "O'zbekistonda nechta viloyat bor?", "12", ["13", "14", "11", "10"], "12 viloyat, Qoraqalpog'iston Respublikasi va Toshkent shahri."],
    [1, "O'zbekiston tarkibidagi respublika qaysi?", "Qoraqalpog'iston", ["Xorazm", "Navoiy", "Surxondaryo"], "Qoraqalpog'iston Respublikasining poytaxti — Nukus."],
    [1, "O'rta Osiyodagi eng sersuv daryo qaysi?", "Amudaryo", ["Zarafshon", "Chirchiq", "Qashqadaryo"], "Amudaryo Orol dengizi havzasiga oqadi."],
    [1, "O'zbekiston hududining katta qismini egallagan cho'l qaysi?", "Qizilqum", ["Qoraqum", "Sahroi Kabir", "Gobi"], "Qizilqum Amudaryo va Sirdaryo oralig'ida joylashgan."],
    [1, "Samarqand va Buxoro shaharlari qaysi daryo vodiysida joylashgan?", "Zarafshon", ["Chirchiq", "Sirdaryo", "Surxondaryo"], "Zarafshon daryosi Samarqand va Buxoro vohalarini sug'oradi."],
    [1, "Toshkent vohasini sug'oruvchi asosiy daryo qaysi?", "Chirchiq", ["Zarafshon", "Amudaryo", "Qashqadaryo"], "Chirchiq daryosi Sirdaryoning irmog'i."],
    [1, "Andijon, Namangan va Farg'ona viloyatlari qaysi vodiyda joylashgan?", "Farg'ona vodiysi", ["Zarafshon vodiysi", "Chirchiq vodiysi", "Surxon vodiysi"], "Farg'ona vodiysi tog'lar bilan o'ralgan."],
    [1, "O'zbekistonning eng janubiy viloyati qaysi?", "Surxondaryo", ["Qashqadaryo", "Xorazm", "Navoiy"], "Surxondaryo viloyati Afg'oniston bilan chegaradosh."],
    [1, "Afg'oniston bilan chegaradosh O'zbekiston viloyati qaysi?", "Surxondaryo", ["Qashqadaryo", "Samarqand", "Jizzax"], "Termiz shahri Amudaryo bo'yida joylashgan."],
    [2, "O'zbekistonning eng baland nuqtasi qaysi?", "Hazrat Sulton cho'qqisi", ["Katta Chimyon", "Adelung cho'qqisi", "Bobotog'"], "Hazrat Sulton cho'qqisi Hisor tizmasida joylashgan."],
    [2, "Hazrat Sulton cho'qqisining balandligi qancha?", "4643 m", ["3643 m", "5643 m", "4134 m", "4846 m"], "Hazrat Sulton — O'zbekistonning eng baland nuqtasi."],
    [2, "O'zbekiston maydoni taxminan qancha?", "448,9 ming km²", ["248,9 ming km²", "648,9 ming km²", "1 mln km²"], "O'zbekiston maydoni taxminan 448,9 ming km²."],
    [2, "O'zbekiston qaysi vaqt mintaqasida joylashgan?", "UTC+5", ["UTC+3", "UTC+4", "UTC+6"], "Toshkent vaqti Grinvich vaqtidan 5 soat oldinda."],
    [2, "Amudaryo va Sirdaryo qaysi suv havzasiga quyiladi?", "Orol dengizi", ["Kaspiy dengizi", "Qora dengiz", "Balxash ko'li"], "Daryolar suvi sug'orishga ko'p sarflanishi Orolning qurishiga olib keldi."],
    [2, "Sirdaryo qaysi ikki daryoning qo'shilishidan hosil bo'ladi?", "Norin va Qoradaryo", ["Vaxsh va Panj", "Chirchiq va Ohangaron", "Zarafshon va Qashqadaryo"], "Norin va Qoradaryo Farg'ona vodiysida qo'shiladi."],
    [2, "Amudaryo qaysi ikki daryoning qo'shilishidan hosil bo'ladi?", "Vaxsh va Panj", ["Norin va Qoradaryo", "Chirchiq va Ohangaron", "Surxon va Sherobod"], "Amudaryo Vaxsh va Panj daryolari qo'shilishidan boshlanadi."],
    [2, "O'zbekistonning qaysi hududi Orol dengizi bo'yida joylashgan?", "Qoraqalpog'iston", ["Xorazm", "Navoiy", "Buxoro"], "Orolning janubiy qismi Qoraqalpog'iston hududida."],
    [2, "Orol dengizining qurigan tubida hosil bo'lgan yangi cho'l qanday ataladi?", "Orolqum", ["Qizilqum", "Qoraqum", "Mirzacho'l"], "Orolqum tuz va qum bo'ronlari manbaiga aylangan."],
    [2, "Sirdaryo va Jizzax viloyatlarida o'zlashtirilgan cho'l qanday ataladi?", "Mirzacho'l", ["Qizilqum", "Orolqum", "Ustyurt"], "Mirzacho'l (Mirzacho'l dashti) sug'orilib, paxtazorga aylantirilgan."],
    [2, "Qoraqalpog'iston g'arbida joylashgan keng plato qaysi?", "Ustyurt", ["Pomir", "Tyanshan", "Hisor"], "Ustyurt platosi Qozog'iston va Turkmaniston bilan tutashadi."],
    [3, "O'zbekiston kabi \"ikki karra dengizga chiqa olmaydigan\" davlat yana qaysi?", "Lixtenshteyn", ["Shveytsariya", "Avstriya", "Mo'g'uliston"], "Dunyoda faqat ikkita shunday davlat bor: O'zbekiston va Lixtenshteyn."],
    [3, "Okeanga chiqish uchun O'zbekistondan kamida nechta davlat chegarasini kesib o'tish kerak?", "2", ["1", "3", "4"], "O'zbekiston ham, uning barcha qo'shnilari ham okeanga chiqa olmaydi."],
    [3, "Chorvoq suv ombori qaysi viloyatda joylashgan?", "Toshkent viloyati", ["Namangan viloyati", "Jizzax viloyati", "Samarqand viloyati"], "Chorvoq suv ombori Chirchiq daryosida qurilgan."],
    [3, "Chimyon va Beldersoy dam olish maskanlari qaysi tog'larda joylashgan?", "G'arbiy Tyanshan", ["Pomir", "Hisor", "Zarafshon tizmasi"], "Chotqol va Ugom tizmalari G'arbiy Tyanshan tarkibiga kiradi."],
    [3, "Hazrat Sulton cho'qqisi qaysi tog' tizmasida joylashgan?", "Hisor tizmasi", ["Chotqol tizmasi", "Turkiston tizmasi", "Nurota tog'lari"], "Hisor tizmasi O'zbekiston va Tojikiston chegarasida."],
    [3, "O'zbekistonning maydoni bo'yicha eng katta hududiy birligi qaysi?", "Qoraqalpog'iston", ["Navoiy viloyati", "Buxoro viloyati", "Qashqadaryo viloyati"], "Qoraqalpog'iston Respublikasi mamlakat hududining uchdan biridan ko'prog'ini egallaydi."],
    [3, "Muruntov oltin koni qaysi viloyatda joylashgan?", "Navoiy viloyati", ["Samarqand viloyati", "Buxoro viloyati", "Jizzax viloyati"], "Muruntov — Qizilqumdagi yirik oltin koni."],
    [3, "Sirdaryo qaysi davlat hududida Orol dengiziga quyiladi?", "Qozog'iston", ["O'zbekiston", "Turkmaniston", "Tojikiston"], "Sirdaryo O'zbekiston va Tojikistondan o'tib, Qozog'istonda Orolga quyiladi."],
    [3, "O'zbekistonda iqlim qanday?", "Keskin kontinental", ["Mussonli", "Ekvatorial", "Dengiz iqlimi"], "Yozi issiq va quruq, qishi nisbatan sovuq."],
    [1, "O'zbekiston qaysi materikda joylashgan?", "Yevrosiyo", ["Afrika", "Shimoliy Amerika", "Avstraliya"], "O'zbekiston Yevrosiyo materigining markazida joylashgan."],
    [1, "O'zbekiston dunyoning qaysi qismida joylashgan?", "Osiyo", ["Yevropa", "Afrika", "Amerika"], "O'zbekiston Markaziy Osiyoda joylashgan."],
    [1, "O'zbekistonning eng g'arbiy hududi qaysi?", "Qoraqalpog'iston", ["Xorazm", "Buxoro", "Navoiy"], "Qoraqalpog'iston Qozog'iston va Turkmaniston bilan chegaradosh."],
    [1, "Toshkent shahri qaysi viloyat bilan o'ralgan?", "Toshkent viloyati", ["Sirdaryo viloyati", "Jizzax viloyati", "Namangan viloyati"], "Toshkent viloyatining markazi — Nurafshon."],
    [1, "O'zbekistonning eng issiq viloyati qaysi?", "Surxondaryo", ["Toshkent", "Namangan", "Jizzax"], "Termizda yozda harorat +45 °C dan oshishi mumkin."],
    [1, "Qizilqum cho'li qaysi ikki daryo oralig'ida joylashgan?", "Amudaryo va Sirdaryo", ["Zarafshon va Chirchiq", "Norin va Qoradaryo", "Vaxsh va Panj"], "Qizilqum — O'rta Osiyodagi eng yirik cho'llardan biri."],
    [2, "O'zbekistonning eng sharqiy viloyati qaysi?", "Andijon", ["Namangan", "Farg'ona", "Toshkent"], "Andijon viloyati Qirg'iziston bilan chegaradosh."],
    [2, "Farg'ona vodiysini qaysi daryo kesib o'tadi?", "Sirdaryo", ["Amudaryo", "Zarafshon", "Chirchiq"], "Sirdaryo Farg'ona vodiysida Norin va Qoradaryoning qo'shilishidan hosil bo'ladi."],
    [2, "Orol dengizi qaysi ikki davlat hududida joylashgan?", "O'zbekiston va Qozog'iston", ["O'zbekiston va Turkmaniston", "Qozog'iston va Rossiya", "Turkmaniston va Eron"], "Orolning janubiy qismi Qoraqalpog'istonda."],
    [2, "Amudaryo qaysi davlat bilan O'zbekiston chegarasi bo'ylab oqadi?", "Afg'oniston", ["Qirg'iziston", "Qozog'iston", "Eron"], "Termiz shahri yaqinida Amudaryo chegara bo'ylab oqadi."],
    [2, "Zarafshon daryosi qaysi davlat hududidan boshlanadi?", "Tojikiston", ["Qirg'iziston", "Afg'oniston", "Qozog'iston"], "Zarafshon Tojikistondagi Zarafshon muzligidan boshlanadi."],
    [3, "O'zbekistonning eng past nuqtasi qaysi?", "Mingbuloq botig'i", ["Orolqum", "Mirzacho'l", "Sariqamish ko'li"], "Mingbuloq botig'i dengiz sathidan taxminan 12 m past."],
    [3, "Maydoni bo'yicha O'zbekistonning eng kichik viloyati qaysi?", "Andijon", ["Sirdaryo", "Namangan", "Xorazm"], "Andijon viloyati maydoni taxminan 4,3 ming km²."],
    [3, "Maydoni bo'yicha O'zbekistonning eng katta viloyati qaysi?", "Navoiy", ["Buxoro", "Qashqadaryo", "Samarqand"], "Qoraqalpog'iston Respublikasi bundan ham katta, lekin u viloyat emas."],
    [3, "O'zbekiston bilan eng uzun chegaraga ega davlat qaysi?", "Qozog'iston", ["Tojikiston", "Turkmaniston", "Qirg'iziston"], "O'zbekiston–Qozog'iston chegarasi 2 ming km dan uzun."],
    [3, "O'zbekiston bilan eng qisqa chegaraga ega davlat qaysi?", "Afg'oniston", ["Qirg'iziston", "Tojikiston", "Turkmaniston"], "Afg'oniston bilan chegara Amudaryo bo'ylab o'tadi."],
    [3, "Chirchiq daryosi qaysi ikki daryoning qo'shilishidan hosil bo'ladi?", "Chotqol va Piskom", ["Norin va Qoradaryo", "Vaxsh va Panj", "Ohangaron va Angren"], "Ular Chorvoq suv omborida qo'shiladi."],
    [1,"O'zbekistonning davlat tili qaysi til hisoblanadi?","O'zbek tili",["Rus tili","Tojik tili","Qoraqalpoq tili"],"Davlat tili to'g'risidagi qonunga ko'ra o'zbek tili davlat tili hisoblanadi."],
    [1,"O'zbekistonda eng ko'p aholi istiqomat qiladigan shahar qaysi?","Toshkent",["Samarqand","Andijon","Namangan"],"Toshkent mamlakatning poytaxti va eng yirik shahri."],
    [1,"Farg'ona vodiysida joylashmagan viloyat qaysi?","Samarqand viloyati",["Farg'ona viloyati","Andijon viloyati","Namangan viloyati"],"Samarqand viloyati Zarafshon vodiysida joylashgan."],
    [1,"O'zbekistonning Qozog'iston bilan chegaradosh viloyati qaysi?","Toshkent viloyati",["Surxondaryo viloyati","Qashqadaryo viloyati","Xorazm viloyati"],"Toshkent viloyati shimoldan Qozog'iston bilan chegaradosh."],
    [1,"Buxoro viloyati qaysi mintaqada joylashgan?","O'zbekistonning markaziy-g'arbiy qismida",["Shimoliy qismida","Janubiy-sharqiy qismida","Shimoliy-sharqiy qismida"],"Buxoro viloyati Qizilqum cho'li yaqinida, markaziy-g'arbiy hududda joylashgan."],
    [1,"O'zbekistonda qishloq xo'jaligida eng ko'p yetishtiriladigan texnik ekin qaysi?","Paxta",["Kungaboqar","Qand lavlagi","Tamaki"],"Paxta O'zbekistonning asosiy qishloq xo'jalik ekinlaridan hisoblanadi."],
    [1,"Xorazm viloyatining markazi qaysi shahar?","Urganch",["Xiva","Nukus","Qunqirot"],"Urganch — Xorazm viloyatining ma'muriy markazi."],
    [1,"Qashqadaryo viloyatining markazi qaysi shahar?","Qarshi",["Shahrisabz","Kitob","G'uzor"],"Qarshi — Qashqadaryo viloyatining ma'muriy markazi."],
    [1,"O'zbekistonning shimoliy-g'arbiy qismida joylashgan qaysi suv havzasi deyarli qurib qolgan?","Orol dengizi",["Aydarko'l","Tuzkon ko'li","Sariqamish ko'li"],"Orol dengizi sug'orish uchun suv olinishi natijasida sezilarli darajada qisqardi."],
    [1,"Samarqand viloyatining ma'muriy markazi qaysi shahar?","Samarqand",["Kattaqo'rg'on","Urgut","Bulung'ur"],"Samarqand shahri shu nomdagi viloyatning markazi hisoblanadi."],
    [1,"Navoiy viloyatining ma'muriy markazi qaysi shahar?","Navoiy",["Zarafshon","Uchquduq","Karmana"],"Navoiy shahri viloyatning ma'muriy markazi."],
    [1,"O'zbekistonda tabiiy gaz qazib olinadigan asosiy hudud qaysi?","Buxoro va Qashqadaryo viloyatlari",["Farg'ona vodiysi","Toshkent viloyati","Xorazm viloyati"],"Buxoro va Qashqadaryo hududlarida yirik gaz konlari joylashgan."],
    [1,"O'zbekistonning aholi zichligi eng yuqori hududi qaysi?","Farg'ona vodiysi",["Qoraqalpog'iston","Navoiy viloyati","Buxoro viloyati"],"Farg'ona vodiysida aholi sonining ko'pligi va maydonning kichikligi zichlikni oshiradi."],
    [1,"O'zbekistonning Turkmaniston bilan chegaradosh viloyati qaysi?","Xorazm viloyati",["Namangan viloyati","Andijon viloyati","Jizzax viloyati"],"Xorazm viloyati janubi-g'arbdan Turkmaniston bilan chegaradosh."],
    [2,"O'zbekiston aholi soni bo'yicha O'rta Osiyoda nechanchi o'rinda turadi?","1-o'rinda",["2-o'rinda","3-o'rinda","4-o'rinda"],"O'zbekiston O'rta Osiyo davlatlari orasida eng ko'p aholiga ega."],
    [2,"O'zbekistonda eng ko'p paxta tolasi qayta ishlanadigan sanoat turi qanday ataladi?","To'qimachilik sanoati",["Metallurgiya sanoati","Kimyo sanoati","Energetika sanoati"],"To'qimachilik sanoati paxta tolasini ip va matoga aylantiradi."],
    [2,"Qoraqalpog'istonning ma'muriy markazi qaysi shahar?","Nukus",["Mo'ynoq","Xo'jayli","Taxiatosh"],"Nukus — Qoraqalpog'iston Respublikasining poytaxti."],
    [2,"O'zbekistonda eng yirik elektr energiyasi ishlab chiqaruvchi gidroelektrostansiya suv ombori qaysi?","Chorvoq suv ombori",["Tuyabo'g'iz suv ombori","Andijon suv ombori","Tolimarjon suv ombori"],"Chorvoq GESi Chirchiq daryosida joylashgan yirik gidroenergetika majmuasi."],
    [2,"O'zbekistonning Qirg'iziston bilan chegaradosh viloyatlari asosan qaysi hududda joylashgan?","Farg'ona vodiysida",["Ustyurt platosida","Qizilqum cho'lida","Zarafshon vodiysida"],"Andijon, Namangan va Farg'ona viloyatlari Qirg'iziston bilan chegaradosh."],
    [2,"O'zbekistonda eng yirik sement ishlab chiqarish korxonalaridan biri joylashgan viloyat qaysi?","Qizilqum (Navoiy viloyati)",["Xorazm viloyati","Andijon viloyati","Sirdaryo viloyati"],"Navoiy viloyatida yirik sement zavodlari faoliyat yuritadi."],
    [2,"Mirzacho'l dashti qaysi ikki viloyat hududida joylashgan?","Sirdaryo va Jizzax viloyatlari",["Buxoro va Navoiy viloyatlari","Qashqadaryo va Surxondaryo viloyatlari","Andijon va Namangan viloyatlari"],"Mirzacho'l sug'orish natijasida o'zlashtirilgan keng dasht hisoblanadi."],
    [2,"O'zbekistonda uran qazib olish sanoati qaysi viloyatda rivojlangan?","Navoiy viloyati",["Surxondaryo viloyati","Jizzax viloyati","Sirdaryo viloyati"],"Navoiy viloyatida uran konlari va qayta ishlash korxonalari joylashgan."],
    [2,"O'zbekistonning eng shimoliy hududi qaysi?","Qoraqalpog'iston",["Toshkent viloyati","Namangan viloyati","Sirdaryo viloyati"],"Qoraqalpog'iston mamlakatning shimoliy-g'arbiy chekkasida joylashgan."],
    [2,"Chotqol va Piskom daryolari qo'shilib qaysi daryoni hosil qiladi?","Chirchiq daryosini",["Zarafshon daryosini","Qashqadaryo daryosini","Surxondaryo daryosini"],"Chirchiq daryosi Toshkent vohasini sug'orishda muhim ahamiyatga ega."],
    [2,"O'zbekistonda ipakchilik qadimdan rivojlangan hudud sifatida tanilgan qaysi vodiy?","Farg'ona vodiysi",["Ustyurt platosi","Mirzacho'l dashti","Qizilqum cho'li"],"Farg'ona vodiysida tutchilik va ipak qurti boqish keng tarqalgan."],
    [2,"Sirdaryo viloyatining ma'muriy markazi qaysi shahar?","Guliston",["Shirin","Sirdaryo","Yangiyer"],"Guliston — Sirdaryo viloyatining markaziy shahri."],
    [2,"Namangan viloyatining ma'muriy markazi qaysi shahar?","Namangan",["Chust","Kosonsoy","Uchqo'rg'on"],"Namangan shahri viloyatning ma'muriy markazi hisoblanadi."],
    [2,"O'zbekistonda eng ko'p sholi yetishtiriladigan hududlardan biri qaysi?","Xorazm viloyati",["Jizzax viloyati","Navoiy viloyati","Sirdaryo viloyati"],"Xorazm vohasida sug'orma yerlar sholi yetishtirishga qulay."],
    [2,"Andijon viloyatining ma'muriy markazi qaysi shahar?","Andijon",["Asaka","Xonobod","Shahrixon"],"Andijon shahri viloyatning ma'muriy markazi hisoblanadi."],
    [3,"Mustaqil O'zbekistonning birinchi Konstitutsiyasi qaysi yili qabul qilingan?","1992-yilda",["1991-yilda","1993-yilda","1995-yilda"],"O'zbekiston Konstitutsiyasi 1992-yil 8-dekabrda qabul qilingan."],
    [3,"Zarafshon daryosi bugungi kunda qayerda tugaydi?","Qizilqum qumlarida, sug'orishga sarflanib",["Orol dengizida","Kaspiy dengizida","Sirdaryoga quyilib"],"Zarafshon daryosi suvi sug'orishga sarflanib, Qizilqum qumlarida tugaydi."],
    [3,"O'zbekistonda eng uzun temir yo'l tunneli qaysi tog' tizmasidan o'tadi?","Qurama tizmasidan (Qamchiq dovoni)",["Hisor tizmasidan","Nurota tog'laridan","Zarafshon tizmasidan"],"Qamchiq tunneli Qurama tizmasi orqali o'tib, Angren–Pop temir yo'lini Farg'ona vodiysi bilan bog'laydi."],
    [3,"O'zbekistonda geografik jihatdan eng quruq va yillik yog'ingarchiligi eng kam hudud qaysi?","Ustyurt platosi",["Farg'ona vodiysi","Chirchiq vodiysi","Zarafshon vodiysi"],"Ustyurt platosida cho'l iqlimi hukmron va yog'ingarchilik juda kam."],
    [3,"Tuzkon ko'li qaysi viloyat hududida joylashgan?","Jizzax viloyati",["Navoiy viloyati","Sirdaryo viloyati","Samarqand viloyati"],"Tuzkon ko'li Mirzacho'l hududidagi sho'r suvli ko'llardan biri."],
    [3,"O'zbekiston hududida joylashgan Qizilqum cho'li maydon jihatidan qaysi davlatlar hududiga ham tarqalgan?","Qozog'iston va Turkmaniston",["Tojikiston va Qirg'iziston","Afg'oniston va Turkmaniston","Qozog'iston va Qirg'iziston"],"Qizilqum cho'li uch davlat hududida joylashgan katta cho'l hisoblanadi."],
    [3,"O'zbekistonda eng qadimiy sug'orish inshootlaridan biri hisoblangan kanal qaysi vohada qurilgan?","Xorazm vohasida",["Farg'ona vodiysida","Zarafshon vodiysida","Surxon vodiysida"],"Xorazm vohasida qadimdan murakkab sug'orish tizimlari qurilgan."],
    [3,"O'zbekistonning relyefida tog'li hudud umumiy maydonning taxminan necha foizini tashkil qiladi?","Taxminan 20%",["Taxminan 50%","Taxminan 5%","Taxminan 80%"],"Mamlakat hududining katta qismini tekislik va cho'llar egallaydi, tog'lar esa kamroq ulushni tashkil qiladi."],
    [3,"Qadimgi Sug'diyona hozirgi qaysi hududlarga to'g'ri kelgan?","Zarafshon vodiysi (Samarqand va Buxoro atrofi)",["Farg'ona vodiysi","Xorazm vohasi","Surxon vodiysi"],"Qadimgi Sug'd o'lkasi Zarafshon vodiysidagi hududlarni o'z ichiga olgan."],
    [3,"O'zbekiston hududidan o'tadigan Buyuk Ipak yo'lining asosiy tarmog'i qaysi shaharlarni bog'lagan?","Samarqand va Buxoro",["Nukus va Urganch","Termiz va Denov","Guliston va Jizzax"],"Samarqand va Buxoro Buyuk Ipak yo'lining muhim savdo markazlari bo'lgan."],
    [3,"O'zbekistonda tog' muzliklari asosan qaysi tog' tizimida joylashgan?","Tyanshan va Pomir-Oloy tizimlarining chekka qismlarida",["Ustyurt platosida","Nurota tog'larida","Mo'g'ultog'da"],"Yuqori balandlikdagi tog' tizmalarida kichik muzliklar saqlanib qolgan."],
    [3,"O'zbekistonning Angren shahri qaysi foydali qazilma qazib olinishi bilan mashhur?","Ko'mir",["Mis","Uran","Gaz"],"Angrenda yirik ko'mir koni mavjud va u energetika uchun ishlatiladi."],
    [3,"O'zbekistonda eng yirik mis-molibden koni qaysi hududda joylashgan?","Olmaliq (Toshkent viloyati)",["Zarafshon (Navoiy viloyati)","Uchquduq (Navoiy viloyati)","Shargun (Surxondaryo viloyati)"],"Olmaliqda yirik kon-metallurgiya kombinati faoliyat yuritadi."],
    [3,"O'zbekistonda tabiiy landshaft jihatidan \"Qizilqum\" nomi qaysi ma'noni bildiradi?","Qizil qumliklar",["Oq cho'l","Qora tog'","Yashil vodiy"],"Qizilqum nomi hududdagi qumliklarning rangiga ishora qiladi."]
  ];
  // [shahar, VIL indeksi, daraja] — viloyat markazlaridan tashqari shaharlar
  var SHAHAR = [["Xiva", 4, 1], ["Shahrisabz", 7, 1], ["Qo'qon", 2, 1], ["Marg'ilon", 2, 1], ["Chirchiq", 11, 1], ["Olmaliq", 11, 1], ["Angren", 11, 1], ["Bekobod", 11, 2],
    ["Ohangaron", 11, 3], ["Yangiyo'l", 11, 2], ["Zarafshon", 6, 2], ["Uchquduq", 6, 3], ["Nurota", 6, 3], ["G'ijduvon", 1, 1], ["Kogon", 1, 2], ["Qorako'l", 1, 3],
    ["Denov", 10, 1], ["Boysun", 10, 3], ["Sherobod", 10, 3], ["Asaka", 0, 1], ["Shahrixon", 0, 3], ["Xonobod", 0, 3], ["Chust", 5, 1], ["Kosonsoy", 5, 3], ["Pop", 5, 3],
    ["Kattaqo'rg'on", 8, 1], ["Urgut", 8, 1], ["Kitob", 7, 3], ["Muborak", 7, 3], ["Yangiyer", 9, 2], ["Shirin", 9, 3], ["G'allaorol", 3, 3],
    ["Mo'ynoq", 12, 1], ["Xo'jayli", 12, 3], ["To'rtko'l", 12, 3], ["Beruniy", 12, 3], ["Taxiatosh", 12, 3], ["Xonqa", 4, 3], ["Hazorasp", 4, 3], ["Quvasoy", 2, 3]];
  var VIL_NEAR = [[0, 2, 5], [1, 6, 8], [2, 0, 5], [3, 9, 8], [4, 12, 1], [5, 0, 2], [6, 1, 8], [7, 10, 8], [8, 6, 3], [9, 3, 11], [10, 7, 1], [11, 9, 5], [12, 4, 6]];
  function vilW(i, n) { // avval qo'shni, keyin boshqa viloyatlar
    var near = shuffle(VIL_NEAR[i].slice(1)), far = shuffle(VIL.map(function (v, k) { return k; }).filter(function (k) { return k !== i && near.indexOf(k) < 0; }));
    return near.slice(0, 2).concat(far).slice(0, n).map(function (k) { return VIL[k][0]; });
  }
  function genShahar(L) {
    var s = pick(lvList(SHAHAR, L, 2)), v = VIL[s[1]], st = [s[0] + " shahri — " + v[0] + "da."];
    if (Math.random() < 0.6) return Q("<b>" + s[0] + " shahri</b> qaysi hududda joylashgan?", v[0], vilW(s[1], 4), st);
    var w = [];
    shuffle(SHAHAR.filter(function (x) { return x[1] !== s[1]; }).map(function (x) { return x[0]; }).concat(VIL.filter(function (x, k) { return k !== s[1]; }).map(function (x) { return x[1]; })))
      .forEach(function (c) { if (w.length < 4 && w.indexOf(c) < 0 && c !== "Toshkent") w.push(c); });
    return Q("Qaysi shahar <b>" + v[0] + "</b>da joylashgan?", s[0], w, st);
  }
  // [daryo, oqib o'tadigan viloyatlar (javob), chalg'ituvchi bo'lmaydiganlar, daraja]
  var DARYO_V = [["Zarafshon", [8, 6, 1], [8, 6, 1], 1], ["Chirchiq", [11], [11], 1], ["Amudaryo", [10, 4, 12], [10, 4, 12, 1, 7], 1], ["Sirdaryo", [11, 5], [11, 5, 9, 2, 0], 2],
    ["Ohangaron", [11], [11], 2], ["Qoradaryo", [0], [0, 5], 2], ["Norin", [5], [5, 0], 3], ["Sangzor", [3], [3, 8], 3], ["Sherobod", [10], [10], 3],
    ["Qashqadaryo", [7], [7], 9], ["Surxondaryo", [10], [10], 9]];   // 9 — o'z nomli viloyat: faqat chalg'ituvchi sifatida
  function genDaryoV(L) {
    var d = pick(lvList(DARYO_V.filter(function (x) { return x[3] < 9; }), L, 3)), vi = pick(d[1]), v = VIL[vi][0];
    var no = VIL.map(function (x, k) { return k; }).filter(function (k) { return d[2].indexOf(k) < 0; });
    if (Math.random() < 0.5)
      return Q("<b>" + d[0] + "</b> daryosi qaysi viloyat hududidan oqib o'tadi?", v, otherN(no.map(function (k) { return VIL[k][0]; }), [], 4), [d[0] + " " + d[1].map(function (k) { return VIL[k][0]; }).join(", ") + " hududidan oqadi."]);
    var w = DARYO_V.filter(function (x) { return x[2].indexOf(vi) < 0; }).map(function (x) { return x[0]; });
    return Q("Qaysi daryo <b>" + v + "</b> hududidan oqib o'tadi?", d[0], otherN(w, [], 4), [d[0] + " daryosi " + v + " hududidan oqadi."]);
  }
  // [obyekt, VIL indeksi, daraja]
  var OBYEKT = [["Zomin qo'riqxonasi", 3, 3], ["Hisor qo'riqxonasi", 7, 3], ["Surxon qo'riqxonasi", 10, 3], ["Chotqol qo'riqxonasi", 11, 3], ["Zarafshon qo'riqxonasi", 8, 3],
    ["Baday-to'qay qo'riqxonasi", 12, 3], ["Kitob geologik qo'riqxonasi", 7, 3], ["Sho'rtan gaz koni", 7, 2], ["Gazli gaz koni", 1, 2], ["Angren ko'mir koni", 11, 2],
    ["Olmaliq kon-metallurgiya kombinati", 11, 2], ["Asaka avtomobil zavodi", 0, 2], ["Tolimarjon suv ombori", 7, 3], ["Kattaqo'rg'on suv ombori", 8, 2], ["Chorvoq suv ombori", 11, 2]];
  function genObyekt(L) {
    var o = pick(lvList(OBYEKT, L, 2));
    return Q("<b>" + o[0] + "</b> qaysi hududda joylashgan?", VIL[o[1]][0], vilW(o[1], 4), [o[0] + " — " + VIL[o[1]][0] + "da."]);
  }
  topic("g2", "Geografiya · O'zbekiston geografiyasi", G2, [{ p: 0.25, fn: genVil }, { p: 0.22, fn: genShahar }, { p: 0.12, fn: genDaryoV }, { p: 0.1, fn: function (L) { return L === 1 ? null : genObyekt(L); } }]);

  /* ================= g3 Geografiya · Materiklar, okeanlar va tabiat ================= */
  function kmW(a) {
    var c = [a * 10, a / 10, a * 2, a + Math.max(1, Math.round(a / 2)), a / 2, a * 100], out = [];
    c.forEach(function (x) { x = Math.round(x * 100) / 100; if (x > 0 && x !== a && out.indexOf(x) < 0) out.push(x); });
    return out.slice(0, 4).map(function (x) { return String(x).replace(".", ",") + " km"; });
  }
  function genMasshtab(L) {
    var M = pick(lv(L, [100000, 200000, 500000], [100000, 200000, 250000, 500000, 1000000], [25000, 50000, 200000, 250000, 2500000])), sm = 1 + R(0, lv(L, 0, 6, 9));
    var kmPerSm = M / 100000, km = Math.round(sm * kmPerSm * 100) / 100, fmt = String(M).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    var ks = String(kmPerSm).replace(".", ",");
    if (L === 1 || sm === 1) return Q("Xarita masshtabi 1 : " + fmt + ". Xaritadagi 1 sm joyda necha km ga teng?", ks + " km", kmW(kmPerSm), ["1 sm = " + fmt + " sm = " + ks + " km."]);
    return Q("Masshtabi 1 : " + fmt + " bo'lgan xaritada ikki nuqta orasi " + sm + " sm. Joydagi masofa necha km?", String(km).replace(".", ",") + " km", kmW(km),
      ["1 sm = " + ks + " km.", sm + " × " + ks + " = " + String(km).replace(".", ",") + " km."]);
  }
  // [shahar, UTC farqi] — doimiy (yozgi vaqtga o'tmaydigan) shaharlar
  var VAQT = [["Toshkent", 5], ["Moskva", 3], ["Tokio", 9], ["Pekin", 8], ["Dubay", 4], ["Bishkek", 6], ["Ashxobod", 5], ["Dushanbe", 5], ["Seul", 9], ["Bangkok", 7]];
  function genVaqt(L) {
    var a = VAQT[0], b = pick(VAQT.filter(function (x) { return x[1] !== 5; }));
    var h = R(6, 18), d = b[1] - a[1], t = h + d;
    if (L === 2 || Math.random() < 0.4) {
      var dd = Math.abs(d), ans = dd + " soat", w = [1, 2, 3, 4, 5, 6].filter(function (x) { return x !== dd; }).map(function (x) { return x + " soat"; });
      return Q("Toshkent vaqti UTC+5, " + b[0] + " vaqti UTC" + (b[1] >= 0 ? "+" : "") + b[1] + ". Ular orasidagi vaqt farqi necha soat?", ans, shuffle(w).slice(0, 4), ["|" + b[1] + " − 5| = " + dd + " soat."]);
    }
    var hh = function (x) { x = ((x % 24) + 24) % 24; return (x < 10 ? "0" : "") + x + ":00"; };
    var ws = [t + 1, t - 1, h - d, t + 2, t - 2].map(hh).filter(function (x) { return x !== hh(t); });
    return Q("Toshkentda (UTC+5) soat " + hh(h) + ". " + b[0] + "da (UTC" + (b[1] >= 0 ? "+" : "") + b[1] + ") soat necha bo'ladi?", hh(t), ws,
      [b[0] + " Toshkentdan " + Math.abs(d) + " soat " + (d > 0 ? "oldinda" : "orqada") + ": " + hh(h) + (d > 0 ? " + " : " − ") + Math.abs(d) + " = " + hh(t) + "."]);
  }
  var G3 = [
    [1, "Yer yuzida nechta materik bor?", "6", ["5", "7", "4"], "Yevrosiyo, Afrika, Shimoliy Amerika, Janubiy Amerika, Avstraliya, Antarktida."],
    [1, "Eng katta materik qaysi?", "Yevrosiyo", ["Afrika", "Shimoliy Amerika", "Antarktida"], "Yevrosiyo Yer quruqligining qariyb uchdan bir qismini egallaydi."],
    [1, "Eng kichik materik qaysi?", "Avstraliya", ["Antarktida", "Janubiy Amerika", "Afrika"], "Avstraliya — eng kichik materik."],
    [1, "Eng katta va eng chuqur okean qaysi?", "Tinch okeani", ["Atlantika okeani", "Hind okeani", "Shimoliy Muz okeani"], "Tinch okeanida eng chuqur joy — Mariana botig'i."],
    [1, "Eng kichik okean qaysi?", "Shimoliy Muz okeani", ["Hind okeani", "Atlantika okeani", "Tinch okeani"], "Shimoliy Muz okeani yilning ko'p qismida muz bilan qoplangan."],
    [1, "Dunyodagi eng baland cho'qqi qaysi?", "Everest (Jomolungma)", ["Kilimanjaro", "Elbrus", "Monblan"], "Everest Himolay tog'larida joylashgan."],
    [1, "Everest (Jomolungma) cho'qqisi qaysi tog'larda joylashgan?", "Himolay", ["Alp", "And", "Pomir"], "Himolay — dunyodagi eng baland tog' tizimi."],
    [1, "Afrikaning eng uzun daryosi qaysi?", "Nil", ["Kongo", "Niger", "Zambezi"], "Nil O'rta yer dengiziga quyiladi."],
    [1, "Dunyodagi eng chuqur ko'l qaysi?", "Baykal", ["Kaspiy", "Viktoriya", "Issiqko'l"], "Baykal Rossiyada, Sibirda joylashgan."],
    [1, "Dunyodagi maydoni eng katta ko'l qaysi?", "Kaspiy", ["Baykal", "Viktoriya", "Orol"], "Kaspiy ko'li sho'r suvli bo'lgani uchun dengiz deb ham ataladi."],
    [1, "Yer o'z o'qi atrofida taxminan qancha vaqtda bir marta aylanadi?", "24 soatda", ["12 soatda", "365 kunda", "30 kunda"], "Yerning o'z o'qi atrofida aylanishi kecha va kunduz almashinuviga sabab bo'ladi."],
    [1, "Yer Quyosh atrofini taxminan qancha vaqtda bir marta aylanib chiqadi?", "365 kunda", ["24 soatda", "30 kunda", "100 kunda"], "Yerning Quyosh atrofida aylanishi fasllar almashinuviga sabab bo'ladi."],
    [1, "Geografik xaritada yuqori tomon odatda qaysi tomonni bildiradi?", "Shimolni", ["Janubni", "Sharqni", "G'arbni"], "Xaritada yuqori — shimol, pastki — janub, o'ng — sharq, chap — g'arb."],
    [1, "Quyosh qaysi tomondan chiqadi?", "Sharqdan", ["G'arbdan", "Shimoldan", "Janubdan"], "Yer g'arbdan sharqqa aylangani uchun Quyosh sharqdan chiqadi."],
    [1, "Yer sharini Shimoliy va Janubiy yarimsharlarga ajratuvchi chiziq qaysi?", "Ekvator", ["Bosh meridian", "Tropik", "Qutb doirasi"], "Ekvatorning kengligi 0°."],
    [1, "Eng sovuq materik qaysi?", "Antarktida", ["Yevrosiyo", "Shimoliy Amerika", "Avstraliya"], "Antarktida deyarli butunlay muz bilan qoplangan."],
    [2, "Everest cho'qqisining balandligi taxminan qancha?", "8848 m", ["7848 m", "6962 m", "9848 m"], "Everest — dunyodagi eng baland cho'qqi."],
    [2, "Dunyodagi eng katta issiq cho'l qaysi?", "Sahroi Kabir", ["Gobi", "Qizilqum", "Atakama"], "Sahroi Kabir Shimoliy Afrikada joylashgan."],
    [2, "Qutbdan qutbga o'tkazilgan chiziqlar nima deyiladi?", "Meridianlar", ["Parallellar", "Ekvator", "Gorizontallar"], "Meridianlar Shimoliy va Janubiy qutblarni tutashtiradi."],
    [2, "Ekvatorga parallel o'tkazilgan chiziqlar nima deyiladi?", "Parallellar", ["Meridianlar", "Gorizontallar", "Izobaralar"], "Parallellar bo'yicha geografik kenglik aniqlanadi."],
    [2, "Ekvatorning geografik kengligi necha gradus?", "0°", ["90°", "180°", "45°"], "Kenglik ekvatordan qutblarga qarab 0° dan 90° gacha o'zgaradi."],
    [2, "Shimoliy qutbning geografik kengligi qancha?", "90° sh.k.", ["0°", "180° sh.k.", "45° sh.k."], "Qutblar kengligi — 90°."],
    [2, "Geografik uzunlik qaysi chiziqdan boshlab hisoblanadi?", "Bosh (Grinvich) meridiani", ["Ekvator", "Shimoliy tropik", "Qutb doirasi"], "Bosh meridian London yaqinidagi Grinvichdan o'tadi."],
    [2, "Atmosferaning Yer yuzasiga eng yaqin quyi qatlami qaysi?", "Troposfera", ["Stratosfera", "Mezosfera", "Termosfera"], "Bulutlar va ob-havo hodisalari asosan troposferada kuzatiladi."],
    [2, "Ozon qatlami atmosferaning qaysi qatlamida joylashgan?", "Stratosfera", ["Troposfera", "Mezosfera", "Ekzosfera"], "Ozon qatlami Quyoshning ultrabinafsha nurlaridan himoya qiladi."],
    [2, "Havo tarkibida qaysi gaz eng ko'p?", "Azot", ["Kislorod", "Karbonat angidrid", "Argon"], "Havoning taxminan 78% i azot, 21% i kislorod."],
    [2, "Ekvator qaysi okeanni kesib o'tmaydi?", "Shimoliy Muz okeani", ["Tinch okeani", "Atlantika okeani", "Hind okeani"], "Shimoliy Muz okeani shimoliy qutb atrofida joylashgan."],
    [2, "Faqat janubiy yarimsharda joylashgan materik qaysi?", "Avstraliya", ["Afrika", "Janubiy Amerika", "Yevrosiyo"], "Avstraliya va Antarktida butunlay janubiy yarimsharda."],
    [2, "Shimol va sharq oralig'idagi tomon qanday ataladi?", "Shimoli-sharq", ["Janubi-sharq", "Shimoli-g'arb", "Janubi-g'arb"], "Oraliq tomonlar: shimoli-sharq, janubi-sharq, janubi-g'arb, shimoli-g'arb."],
    [2, "Janub va g'arb oralig'idagi tomon qanday ataladi?", "Janubi-g'arb", ["Shimoli-g'arb", "Janubi-sharq", "Shimoli-sharq"], "Oraliq tomonlar: shimoli-sharq, janubi-sharq, janubi-g'arb, shimoli-g'arb."],
    [3, "Dunyo okeanidagi eng chuqur joy qaysi?", "Mariana botig'i", ["Puerto-Riko botig'i", "Yava botig'i", "Baykal ko'li"], "Mariana botig'i Tinch okeanida, chuqurligi 11 km ga yaqin."],
    [3, "Yer sharida nechta asosiy iqlim mintaqasi ajratiladi?", "7", ["4", "5", "9"], "Asosiy iqlim mintaqalari 7 ta, ular orasida yana 6 ta oraliq mintaqa bor."],
    [3, "Quruqlikdagi eng uzun tog' tizimi qaysi?", "And", ["Himolay", "Alp", "Ural"], "And tog'lari Janubiy Amerikaning g'arbiy qirg'og'i bo'ylab cho'zilgan."],
    [3, "Yevropa va Osiyo orasidagi an'anaviy chegara qaysi tog'lardan o'tadi?", "Ural tog'lari", ["Alp tog'lari", "Karpat tog'lari", "Pomir"], "Chegara Ural tog'lari va Ural daryosi bo'ylab o'tkaziladi."],
    [3, "Afrikadagi eng baland cho'qqi qaysi?", "Kilimanjaro", ["Everest", "Elbrus", "Akonkagua"], "Kilimanjaro Tanzaniyada joylashgan."],
    [3, "Janubiy Amerikadagi eng baland cho'qqi qaysi?", "Akonkagua", ["Kilimanjaro", "Everest", "Monblan"], "Akonkagua And tog'larida, Argentinada joylashgan."],
    [3, "Kenglik va uzunlik birgalikda nima deb ataladi?", "Geografik koordinatalar", ["Masshtab", "Azimut", "Izogipsa"], "Koordinatalar orqali Yer yuzasidagi istalgan nuqtaning o'rni aniqlanadi."],
    [3, "Amazonka va Kongo havzalarida qanday o'rmonlar keng tarqalgan?", "Nam ekvatorial o'rmonlar", ["Tayga", "Tundra", "Dasht"], "Bu o'rmonlarda yil bo'yi issiq va ko'p yog'in yog'adi."],
    [3, "Ignabargli o'rmonlar zonasi qanday ataladi?", "Tayga", ["Tundra", "Savanna", "Dasht"], "Tayga Rossiya va Kanadada keng tarqalgan."],
    [3, "Afrikaning baland o'tlar va siyrak daraxtlar o'sadigan tabiat zonasi qanday ataladi?", "Savanna", ["Tayga", "Tundra", "Cho'l"], "Savannada sher, zebra, jirafa kabi hayvonlar yashaydi."],
    [3, "Yerning qattiq tosh qobig'i qanday ataladi?", "Litosfera", ["Gidrosfera", "Atmosfera", "Biosfera"], "Gidrosfera — suv qobig'i, atmosfera — havo qobig'i."],
    [3, "Yerning suv qobig'i qanday ataladi?", "Gidrosfera", ["Litosfera", "Atmosfera", "Biosfera"], "Gidrosferaga okean, dengiz, daryo, ko'l va muzliklar kiradi."],
    [1, "Eng issiq materik qaysi?", "Afrika", ["Antarktida", "Yevrosiyo", "Shimoliy Amerika"], "Afrikaning katta qismi tropik kengliklarda joylashgan."],
    [1, "Dunyodagi eng sersuv daryo qaysi?", "Amazonka", ["Nil", "Volga", "Amudaryo"], "Amazonka Janubiy Amerikada, Atlantika okeaniga quyiladi."],
    [1, "Yer yuzasining taxminan qancha qismini suv egallaydi?", "≈ 71%", ["≈ 29%", "≈ 50%", "≈ 90%"], "Quruqlik Yer yuzasining taxminan 29% ini egallaydi."],
    [1, "Yer Quyoshdan hisoblaganda nechanchi sayyora?", "3-sayyora", ["1-sayyora", "2-sayyora", "4-sayyora"], "Merkuriy, Venera, Yer, Mars, ..."],
    [1, "Yerning tabiiy yo'ldoshi qaysi?", "Oy", ["Mars", "Quyosh", "Venera"], "Oy Yer atrofini taxminan bir oyda aylanib chiqadi."],
    [1, "Quyosh sistemasidagi eng katta sayyora qaysi?", "Yupiter", ["Saturn", "Yer", "Mars"], "Yupiter — gaz gigant sayyora."],
    [1, "Quyoshga eng yaqin sayyora qaysi?", "Merkuriy", ["Venera", "Mars", "Yer"], "Merkuriy — eng kichik sayyora ham."],
    [1, "\"Qizil sayyora\" deb qaysi sayyora ataladi?", "Mars", ["Venera", "Yupiter", "Merkuriy"], "Mars tuprog'idagi temir oksidi unga qizg'ish rang beradi."],
    [1, "Quyosh sistemasida nechta sayyora bor?", "8", ["7", "9", "10"], "Merkuriy, Venera, Yer, Mars, Yupiter, Saturn, Uran, Neptun."],
    [1, "Yerning kichraytirilgan hajmli modeli nima deb ataladi?", "Globus", ["Xarita", "Kompas", "Atlas"], "Globus Yerning shaklini to'g'ri aks ettiradi."],
    [1, "Tomonlarni aniqlash uchun qaysi asbobdan foydalaniladi?", "Kompas", ["Barometr", "Termometr", "Globus"], "Kompas mili doim shimolni ko'rsatadi."],
    [1, "Havo bosimini o'lchaydigan asbob qaysi?", "Barometr", ["Termometr", "Flyuger", "Gigrometr"], "Normal atmosfera bosimi — 760 mm simob ustuni."],
    [1, "Shamol yo'nalishini aniqlaydigan asbob qaysi?", "Flyuger", ["Barometr", "Termometr", "Kompas"], "Shamol qaysi tomondan essa, o'sha tomon nomi bilan ataladi."],
    [1, "Vulqondan yer yuzasiga otilib chiqqan suyuq tog' jinsi nima deyiladi?", "Lava", ["Magma", "Granit", "Qum"], "Yer ichidagi erigan massa — magma, yuzaga chiqqani — lava."],
    [1, "Yer po'stining keskin silkinishi nima deyiladi?", "Zilzila", ["Vulqon", "Ko'chki", "Sel"], "Zilzila kuchi ballarda o'lchanadi."],
    [1, "Har tomondan suv bilan o'ralgan quruqlik qismi nima deyiladi?", "Orol", ["Yarimorol", "Bo'g'oz", "Qo'ltiq"], "Masalan, Grenlandiya — eng katta orol."],
    [1, "Uch tomondan suv bilan o'ralgan quruqlik qismi nima deyiladi?", "Yarimorol", ["Orol", "Bo'g'oz", "Materik"], "Masalan, Arabiston yarimoroli."],
    [1, "Ikki dengiz yoki okeanni tutashtiruvchi tor suv yo'li nima deyiladi?", "Bo'g'oz", ["Qo'ltiq", "Orol", "Ko'rfaz"], "Masalan, Gibraltar bo'g'ozi."],
    [1, "Bosh daryoga quyiladigan kichik daryo nima deyiladi?", "Irmoq", ["Delta", "Manba", "Qo'ltiq"], "Masalan, Chirchiq — Sirdaryoning irmog'i."],
    [1, "Dunyodagi eng katta orol qaysi?", "Grenlandiya", ["Madagaskar", "Britaniya", "Islandiya"], "Grenlandiya Shimoliy Amerika yaqinida joylashgan."],
    [1, "Yevropa va Shimoliy Amerika oralig'ida qaysi okean joylashgan?", "Atlantika okeani", ["Tinch okeani", "Hind okeani", "Shimoliy Muz okeani"], "Atlantika — ikkinchi eng katta okean."],
    [2, "Eng iliq okean qaysi?", "Hind okeani", ["Tinch okeani", "Atlantika okeani", "Shimoliy Muz okeani"], "Hind okeanining katta qismi tropik kengliklarda joylashgan."],
    [2, "Maydoni bo'yicha ikkinchi eng katta okean qaysi?", "Atlantika okeani", ["Hind okeani", "Tinch okeani", "Shimoliy Muz okeani"], "Eng kattasi — Tinch okeani."],
    [2, "Afrika va Avstraliya oralig'ida qaysi okean joylashgan?", "Hind okeani", ["Atlantika okeani", "Tinch okeani", "Shimoliy Muz okeani"], "Hind okeani Osiyoning janubida joylashgan."],
    [2, "Dunyodagi eng katta yarimorol qaysi?", "Arabiston yarimoroli", ["Hindiston yarimoroli", "Kamchatka", "Skandinaviya"], "Arabiston yarimoroli Osiyoning janubi-g'arbida."],
    [2, "O'rta yer dengizini Qizil dengiz bilan tutashtiruvchi kanal qaysi?", "Suvaysh kanali", ["Panama kanali", "Kil kanali", "Gibraltar bo'g'ozi"], "Suvaysh kanali Afrika va Osiyo oralig'ida."],
    [2, "Atlantika va Tinch okeanlarini tutashtiruvchi kanal qaysi?", "Panama kanali", ["Suvaysh kanali", "Kil kanali", "Bosfor"], "Panama kanali Shimoliy va Janubiy Amerika oralig'ida."],
    [2, "Normal atmosfera bosimi qancha?", "760 mm sim. ust.", ["700 mm sim. ust.", "1000 mm sim. ust.", "560 mm sim. ust."], "Dengiz sathida, 0 °C da o'lchangan bosim."],
    [2, "Shamol nima sababli paydo bo'ladi?", "Havo bosimining farqi tufayli", ["Daryo oqimi tufayli", "Oy tortishi tufayli", "Zilzila tufayli"], "Havo yuqori bosimli joydan past bosimli joyga oqadi."],
    [2, "Shimoliy yarimsharda eng uzun kun qaysi sanaga to'g'ri keladi?", "22-iyun", ["22-dekabr", "21-mart", "23-sentabr"], "22-iyunda Quyosh Shimoliy tropik ustida tik turadi."],
    [2, "Shimoliy yarimsharda eng qisqa kun qaysi sanaga to'g'ri keladi?", "22-dekabr", ["22-iyun", "21-mart", "23-sentabr"], "22-dekabrda Quyosh Janubiy tropik ustida tik turadi."],
    [2, "Kecha va kunduz teng bo'ladigan kunlar qaysilar?", "21-mart va 23-sentabr", ["22-iyun va 22-dekabr", "1-yanvar va 1-iyul", "21-mart va 22-iyun"], "Bu kunlarda Quyosh ekvator ustida tik turadi."],
    [2, "Yer o'z o'qi atrofida 1 soatda necha gradusga buriladi?", "15°", ["10°", "24°", "30°"], "360° : 24 soat = 15°."],
    [2, "O'zbekistonda peshin vaqtida jismlarning soyasi qaysi tomonga tushadi?", "Shimolga", ["Janubga", "Sharqqa", "G'arbga"], "Peshinda Quyosh janub tomonda bo'ladi."],
    [2, "Zilzilani qayd qiluvchi asbob qaysi?", "Seysmograf", ["Barometr", "Gigrometr", "Flyuger"], "Seysmograf yer po'sti tebranishlarini yozib oladi."],
    [2, "Havo namligini o'lchaydigan asbob qaysi?", "Gigrometr", ["Barometr", "Termometr", "Seysmograf"], "Namlik foizlarda ifodalanadi."],
    [2, "Niagara sharsharasi qaysi materikda joylashgan?", "Shimoliy Amerika", ["Janubiy Amerika", "Afrika", "Yevrosiyo"], "Niagara AQSH va Kanada chegarasida."],
    [3, "Dunyo okeanidagi eng sho'r dengiz qaysi?", "Qizil dengiz", ["Qora dengiz", "Boltiq dengizi", "O'rta yer dengizi"], "Qizil dengizga daryolar deyarli quyilmaydi, bug'lanish kuchli."],
    [3, "Dunyodagi eng baland sharshara qaysi?", "Anxel", ["Niagara", "Viktoriya", "Iguasu"], "Anxel sharsharasi Venesuelada, balandligi 979 m."],
    [3, "Viktoriya sharsharasi qaysi daryoda joylashgan?", "Zambezi", ["Nil", "Kongo", "Niger"], "Viktoriya sharsharasi Afrikada."],
    [3, "Shimoliy tropikning geografik kengligi taxminan qancha?", "23,5° sh.k.", ["66,5° sh.k.", "45° sh.k.", "90° sh.k."], "Qutb doirasi kengligi esa 66,5°."],
    [3, "Shimoliy qutb doirasining geografik kengligi taxminan qancha?", "66,5° sh.k.", ["23,5° sh.k.", "45° sh.k.", "90° sh.k."], "Qutb doirasidan shimolda qutb kunlari va tunlari kuzatiladi."],
    [3, "Yer po'stining eng yupqa qismi qayerda joylashgan?", "Okeanlar ostida", ["Tog'lar ostida", "Tekisliklar ostida", "Cho'llar ostida"], "Okean po'sti materik po'stidan yupqa."],
    [3, "Okean suvida erigan tuzlar miqdori nima deb ataladi?", "Sho'rlik", ["Zichlik", "Namlik", "Tiniqlik"], "Okean suvining o'rtacha sho'rligi 35 ‰ atrofida."],
    [1,"Kenguru tabiiy holda qaysi materikda yashaydi?","Avstraliyada",["Afrikada","Janubiy Amerikada","Shimoliy Amerikada"],"Kenguru Avstraliyaga xos hayvon bo'lib, u yerning ramzlaridan biri hisoblanadi."],
    [1,"Sahroi Kabir cho'li qaysi materikda joylashgan?","Afrikada",["Osiyoda","Avstraliyada","Janubiy Amerikada"],"Sahroi Kabir Afrikaning shimolini egallagan."],
    [1,"Amazonka daryosi qaysi materikda oqadi?","Janubiy Amerikada",["Afrikada","Osiyoda","Shimoliy Amerikada"],"Amazonka Janubiy Amerikaning markaziy qismidan oqib, Atlantika okeaniga quyiladi."],
    [1,"Baykal ko'li qaysi davlat hududida joylashgan?","Rossiyada",["Qozog'istonda","Xitoyda","Mo'g'ulistonda"],"Baykal ko'li Rossiyaning Sibir hududida joylashgan."],
    [1,"Yorqin, ko'zga tashlanadigan halqalari bilan mashhur sayyora qaysi?","Saturn",["Mars","Venera","Merkuriy"],"Saturnning halqalari muz va tosh zarralaridan iborat bo'lib, kichik teleskopda ham ko'rinadi."],
    [1,"Yerni o'rab turgan havo qobig'i nima deyiladi?","Atmosfera",["Biosfera","Gidrosfera","Litosfera"],"Atmosfera Yerni qurshab turuvchi gazlar qobig'idir."],
    [1,"Yerning eng markaziy, eng qaynoq qismi nima deyiladi?","Yadro",["Mantiya","Yer po'sti","Atmosfera"],"Yer uch qismdan iborat: po'st, mantiya va yadro; yadro markazda joylashgan."],
    [1,"Alp tog'lari qaysi materikda joylashgan?","Yevropada",["Afrikada","Avstraliyada","Shimoliy Amerikada"],"Alp tog'lari Yevropaning janubiy-markaziy qismida joylashgan."],
    [1,"Oq (qutb) ayiqlar qaysi hududda yashaydi?","Arktikada",["Antarktidada","Savannada","Tropik o'rmonlarda"],"Oq ayiqlar Shimoliy Muz okeani sohillari va Arktika muzliklarida yashaydi."],
    [1,"Havodagi suv bug'i sovishidan hosil bo'lib, osmonda suzib yuradigan narsa nima deyiladi?","Bulut",["Shabnam","Qirov","Shamol"],"Bulut mayda suv tomchilari yoki muz kristallaridan iborat."],
    [1,"Shimoliy yarimsharda qaysi oylar yoz oylari hisoblanadi?","Iyun, iyul, avgust",["Dekabr, yanvar, fevral","Mart, aprel, may","Sentabr, oktabr, noyabr"],"Shimoliy yarimsharda yoz iyun, iyul va avgust oylariga to'g'ri keladi."],
    [1,"Yerga eng yaqin yulduz qaysi?","Quyosh",["Sirius","Qutb yulduzi","Alfa Kentavr"],"Quyosh ham yulduz bo'lib, Yerdan taxminan 150 million km uzoqlikda joylashgan."],
    [1,"Yerda kecha va kunduz almashinuvi nima sababdan sodir bo'ladi?","Yerning o'z o'qi atrofida aylanishi",["Yerning Quyosh atrofida aylanishi","Oyning Yer atrofida aylanishi","Quyoshning Yer atrofida aylanishi"],"Yer o'z o'qi atrofida aylangani uchun uning turli tomonlari galma-gal Quyoshga qaraydi."],
    [1,"Tog'ning eng baland nuqtasi nima deyiladi?","Cho'qqi",["Yonbag'ir","Etak","Vodiy"],"Tog'ning eng yuqori qismi cho'qqi deb ataladi."],
    [2,"Fasllar almashinuvining asosiy sababi nima?","Yer o'qining og'ishi va Quyosh atrofida aylanishi",["Yerning Quyoshdan uzoqlashishi va yaqinlashishi","Oyning Yer atrofida aylanishi","Yerning o'z o'qi atrofida aylanishi"],"Yer o'qi og'ib turgani uchun yil davomida yarimsharlar Quyosh nurini turlicha oladi."],
    [2,"Tog'ga ko'tarilganda har 1000 m balandlikda havo harorati o'rtacha necha gradusga pasayadi?","6 °C ga",["2 °C ga","10 °C ga","12 °C ga"],"Troposferada har 1 km balandlikda harorat o'rtacha 6 °C ga pasayadi."],
    [2,"Nil daryosi qaysi dengizga quyiladi?","O'rta yer dengiziga",["Qizil dengizga","Qora dengizga","Arabiston dengiziga"],"Nil Afrikaning shimoli-sharqidan oqib, O'rta yer dengiziga delta hosil qilib quyiladi."],
    [2,"Volga daryosi qaysi dengizga quyiladi?","Kaspiy dengiziga",["Qora dengizga","Boltiq dengiziga","Orol dengiziga"],"Volga Yevropadagi eng uzun daryo bo'lib, Kaspiy dengiziga quyiladi."],
    [2,"Gobi cho'li qaysi materikda joylashgan?","Osiyoda",["Afrikada","Avstraliyada","Shimoliy Amerikada"],"Gobi cho'li Markaziy Osiyoda, Mo'g'uliston va Xitoy hududida joylashgan."],
    [2,"Atakama cho'li qaysi materikda joylashgan?","Janubiy Amerikada",["Afrikada","Osiyoda","Avstraliyada"],"Atakama Janubiy Amerikaning g'arbiy sohilida, asosan Chili hududida joylashgan."],
    [2,"Gavayi orollari qaysi okeanda joylashgan?","Tinch okeanida",["Atlantika okeanida","Hind okeanida","Shimoliy Muz okeanida"],"Gavayi orollari Tinch okeanining markaziy qismida vulqon orollari guruhidir."],
    [2,"Madagaskar oroli qaysi okeanda joylashgan?","Hind okeanida",["Atlantika okeanida","Tinch okeanida","Shimoliy Muz okeanida"],"Madagaskar Afrikaning janubi-sharqida, Hind okeanida joylashgan."],
    [2,"Bering bo'g'ozi Osiyoni qaysi materikdan ajratib turadi?","Shimoliy Amerikadan",["Janubiy Amerikadan","Afrikadan","Avstraliyadan"],"Bering bo'g'ozi Osiyoning shimoli-sharqi bilan Shimoliy Amerikaning shimoli-g'arbi o'rtasida joylashgan."],
    [2,"Gibraltar bo'g'ozi Atlantika okeanini qaysi dengiz bilan tutashtiradi?","O'rta yer dengizi bilan",["Qora dengiz bilan","Qizil dengiz bilan","Boltiq dengizi bilan"],"Gibraltar bo'g'ozi Yevropa va Afrika orasida bo'lib, O'rta yer dengiziga kirish yo'lidir."],
    [2,"Yer po'sti bilan yadro oralig'ida joylashgan qatlam qanday ataladi?","Mantiya",["Stratosfera","Biosfera","Gidrosfera"],"Mantiya Yer hajmining eng katta qismini egallaydi."],
    [2,"Doimiy muzloq tuproq, moxlar va lishayniklar bilan mashhur shimoliy tabiat zonasi qaysi?","Tundra",["Savanna","Dasht","Subtropik o'rmonlar"],"Tundrada qish uzoq va sovuq bo'lgani uchun daraxtlar o'smaydi."],
    [2,"Suvning bug'lanib, bulut hosil qilishi va yog'in bo'lib yerga qaytishi qanday jarayon deyiladi?","Tabiatda suv aylanishi",["Suvning muzlashi","Suvning sho'rlanishi","Suvning qurishi"],"Suv doimiy ravishda okean, havo va quruqlik orasida aylanib yuradi."],
    [3,"Janubiy Amerika va Antarktida orasidagi bo'g'oz qaysi?","Dreyk bo'g'ozi",["Magellan bo'g'ozi","Bering bo'g'ozi","Gibraltar bo'g'ozi"],"Dreyk bo'g'ozi Janubiy Amerikaning janubidagi Gorn burni bilan Antarktida yarimoroli orasida joylashgan."],
    [3,"Shimoliy Amerikadagi eng baland cho'qqi qaysi?","Denali (Makkinli)",["Akonkagua","Kilimanjaro","Elbrus"],"Denali Alyaskada joylashgan bo'lib, balandligi taxminan 6190 m."],
    [3,"Tinch okeanini o'rab turuvchi vulqonlar va zilzilalar kamari nima deb ataladi?","Tinch okean olov halqasi",["Ekvatorial kamar","Atlantika tizmasi","Buyuk tog' kamari"],"Dunyodagi vulqonlar va kuchli zilzilalarning aksariyati Tinch okean olov halqasida yuz beradi."],
    [3,"Zilzila kuchi qaysi shkala bilan baholanadi?","Rixter shkalasi",["Bofort shkalasi","Mohs shkalasi","Selsiy shkalasi"],"Rixter shkalasi zilzila magnitudasini, Bofort shkalasi esa shamol kuchini ifodalaydi."],
    [3,"Zilzila o'chog'i ustidagi yer yuzasidagi nuqta nima deyiladi?","Epitsentr",["Gipotsentr","Krater","Vulqon og'zi"],"Zilzila o'chog'i yer ostida bo'ladi, uning to'g'ri tepasidagi yer yuzasi nuqtasi esa epitsentrdir."],
    [3,"Tropik kengliklarda doimiy esib turadigan shamollar qanday ataladi?","Passatlar",["Mussonlar","Brizlar","Buranlar"],"Passatlar tropik kengliklarda bir yo'nalishda doimiy esadi."],
    [3,"Yozda dengizdan quruqlikka, qishda quruqlikdan dengizga esadigan mavsumiy shamollar qanday ataladi?","Mussonlar",["Passatlar","Brizlar","Fyonlar"],"Mussonlar yo'nalishini yil fasliga qarab o'zgartiradi, Janubiy Osiyoda yaxshi ifodalangan."],
    [3,"Gulfstrim iliq oqimi qaysi okeanda joylashgan?","Atlantika okeanida",["Tinch okeanida","Hind okeanida","Shimoliy Muz okeanida"],"Gulfstrim Meksika qo'ltig'idan boshlanib, Atlantika okeanida Yevropa tomon yo'naladi."],
    [3,"Dunyodagi maydoni eng katta chuchuk suvli ko'l qaysi?","Yuqori ko'l (Superior)",["Baykal","Viktoriya","Tanganyika"],"Yuqori ko'l maydoni bo'yicha eng katta; Baykal esa eng chuqur va hajmi eng katta chuchuk ko'ldir."],
    [3,"Okeanlarda qalqish va qaytish (suvning ko'tarilib-pasayishi) asosan nima sababli yuz beradi?","Oy va Quyoshning tortish kuchi tufayli",["Shamol kuchi tufayli","Okean oqimlari tufayli","Suv haroratining o'zgarishi tufayli"],"Oyning tortish kuchi Quyoshnikidan kuchliroq ta'sir qilib, suv sathini ko'taradi."],
    [3,"Dunyodagi eng katta marjon rifi tizimi qaysi?","Buyuk To'siq rifi",["Belize to'siq rifi","Qizil dengiz rifi","Maldiv rifi"],"Buyuk To'siq rifi Avstraliyaning shimoli-sharqiy qirg'og'i yaqinida joylashgan."],
    [3,"Afrikadagi maydoni eng katta ko'l qaysi?","Viktoriya ko'li",["Tanganyika","Chad","Nyasa"],"Viktoriya ko'li Afrikaning eng katta ko'li bo'lib, Nil daryosi boshlanadigan hududda joylashgan."],
    [3,"Himolay tog'lari qaysi ikki litosfera plitasining to'qnashuvidan hosil bo'lgan?","Yevrosiyo va Hind-Avstraliya plitalari",["Afrika va Janubiy Amerika plitalari","Tinch okean va Shimoliy Amerika plitalari","Antarktida va Afrika plitalari"],"Hind-Avstraliya plitasi shimolga siljib, Yevrosiyo plitasi bilan to'qnashgani uchun Himolay ko'tarilgan."]
  ];
  // [materik, eng baland cho'qqi, eng uzun daryo, cho'qqi darajasi, daryo darajasi]
  var MATERIK = [["Yevrosiyo", "Everest (Jomolungma)", "Yanszi", 1, 2], ["Afrika", "Kilimanjaro", "Nil", 1, 1], ["Shimoliy Amerika", "Denali (Makkinli)", "Missisipi", 2, 2],
    ["Janubiy Amerika", "Akonkagua", "Amazonka", 2, 1], ["Avstraliya", "Kostyushko", "", 3, 9], ["Antarktida", "Vinson massivi", "", 3, 9]];
  var MAT_N = ["Yevrosiyo", "Afrika", "Shimoliy Amerika", "Janubiy Amerika", "Avstraliya", "Antarktida"];
  function genMaterik(L) {
    var c = Math.random() < 0.5 ? 1 : 2, ok = function (d) { return L === 1 ? d === 1 : L === 2 ? d <= 2 : d <= 3; };
    var pool = MATERIK.filter(function (m) { return m[c] && ok(m[c + 2]); }), m = pick(pool), nm = c === 1 ? "eng baland cho'qqisi" : "eng uzun daryosi";
    if (Math.random() < 0.5) return Q("<b>" + m[c] + "</b> qaysi materikda joylashgan?", m[0], others(MAT_N, m[0], 4), [m[0] + "ning " + nm + " — " + m[c] + "."]);
    return Q("<b>" + m[0] + "</b>ning " + nm + " qaysi?", m[c], otherN(MATERIK.map(function (x) { return x[c]; }).filter(Boolean), [m[c]], 4), [m[0] + "ning " + nm + " — " + m[c] + "."]);
  }
  var YON = ["Shimol", "Sharq", "Janub", "G'arb"], YON_GA = ["shimolga", "sharqqa", "janubga", "g'arbga"];
  function genYon() {
    var f = R(0, 3), t = R(0, 2), a = YON[(f + [1, 3, 2][t]) % 4], nm = ["o'ng", "chap", "orqa"][t];
    return Q(YON_GA[f].charAt(0).toUpperCase() + YON_GA[f].slice(1) + " qarab turgan odamning <b>" + nm + "</b> tomonida qaysi tomon bo'ladi?", a, others(YON, a, 3),
      ["Soat mili bo'yicha: shimol → sharq → janub → g'arb."]);
  }
  var AZ = [["Shimol", 0], ["Shimoli-sharq", 45], ["Sharq", 90], ["Janubi-sharq", 135], ["Janub", 180], ["Janubi-g'arb", 225], ["G'arb", 270], ["Shimoli-g'arb", 315]];
  function genAzimut() {
    var i = R(0, 7), d = AZ[i], st = ["Azimut shimoldan soat mili yo'nalishida o'lchanadi: " + d[0].toLowerCase() + " — " + d[1] + "°."];
    if (Math.random() < 0.5) return Q("<b>" + d[0] + "</b> yo'nalishining azimuti necha gradus?", d[1] + "°", otherN(AZ.map(function (x) { return x[1] + "°"; }), [d[1] + "°"], 4), st);
    return Q("Azimuti <b>" + d[1] + "°</b> bo'lgan yo'nalish qaysi?", d[0], otherN(AZ.map(function (x) { return x[0]; }), [d[0]], 4), st);
  }
  function sgn(t) { return (t > 0 ? "+" : t < 0 ? "−" : "") + Math.abs(t) + " °C"; }
  function genIqlim(L) {
    var k = R(0, L === 1 ? 2 : 3), a, b, t0, h, t, v;
    if (k === 0) { t0 = R(lv(L, 15, 10, 5), 30); h = R(1, lv(L, 3, 5, 6)); t = t0 - 6 * h;
      return Q("Har 1 km balandlikka ko'tarilganda havo harorati taxminan 6 °C ga pasayadi. Tog' etagida " + sgn(t0) + " bo'lsa, " + h + " km balandlikda harorat qancha?", sgn(t),
        [sgn(t0 + 6 * h), sgn(t0 - h), sgn(t - 6), sgn(t + 6), sgn(t0 - 10 * h)], ["6 × " + h + " = " + 6 * h + " °C ga pasayadi.", t0 + " − " + 6 * h + " = " + sgn(t)]); }
    if (k === 1) { a = R(lv(L, 10, 5, 2), 30); b = R(1, lv(L, 10, 15, 20)); v = Math.random() < 0.5;
      if (v) return Q("Kunduzi eng yuqori harorat " + sgn(a) + ", kechasi eng past harorat " + sgn(-b) + " bo'ldi. Sutkalik harorat amplitudasi qancha?", (a + b) + " °C",
        [(a - b === a + b ? a + b + 2 : Math.abs(a - b)) + " °C", (a + b + 2) + " °C", (a + b) * 2 + " °C", a + " °C"], ["Amplituda = eng yuqori − eng past: " + a + " − (−" + b + ") = " + (a + b) + " °C."]);
      b = R(1, a - 1);
      return Q("Kunduzi eng yuqori harorat " + sgn(a) + ", kechasi eng past harorat " + sgn(b) + " bo'ldi. Sutkalik harorat amplitudasi qancha?", (a - b) + " °C",
        [(a + b) + " °C", (a - b + 2) + " °C", a + " °C", (a - b - 1 > 0 ? a - b - 1 : a - b + 3) + " °C"], ["Amplituda = " + a + " − " + b + " = " + (a - b) + " °C."]); }
    if (k === 2) { var xs = [], s = 0, mean = R(lv(L, 2, -4, -8), lv(L, 20, 15, 12)), i;
      for (i = 0; i < 3; i++) { xs.push(mean + R(-6, 6)); s += xs[i]; } xs.push(4 * mean - s);
      return Q("Kun davomida havo harorati 4 marta o'lchandi: " + xs.map(sgn).join("; ") + ". O'rtacha sutkalik harorat qancha?", sgn(mean),
        [sgn(mean + 1), sgn(mean - 1), sgn(mean + 2), sgn(Math.max.apply(null, xs))], ["Yig'indi: " + 4 * mean + " °C.", 4 * mean + " : 4 = " + sgn(mean)]); }
    var dp = R(1, 10) * 10, h2 = dp * 10.5, hs = String(h2).replace(".", ",");
    if (Math.random() < 0.5) return Q("Har 10,5 m ko'tarilganda bosim taxminan 1 mm sim. ust. ga kamayadi. Tog' etagida bosim 760, cho'qqisida " + (760 - dp) + " mm sim. ust. Tog' balandligi necha metr?", hs + " m",
      [String(dp * 10) + " m", String(dp) + " m", String(h2 * 2).replace(".", ",") + " m", String(h2 + 105).replace(".", ",") + " m"], ["Bosim farqi: 760 − " + (760 - dp) + " = " + dp + " mm.", dp + " × 10,5 = " + hs + " m"]);
    return Q("Har 10,5 m ko'tarilganda bosim taxminan 1 mm sim. ust. ga kamayadi. Etakda bosim 760 mm sim. ust. bo'lsa, " + hs + " m balandlikdagi cho'qqida bosim qancha?", (760 - dp) + " mm",
      [(760 + dp) + " mm", (760 - dp * 2) + " mm", (760 - dp + 10) + " mm", (760 - Math.round(h2 / 10)) === 760 - dp ? (750 - dp) + " mm" : (760 - Math.round(h2 / 10)) + " mm"], [hs + " : 10,5 = " + dp + " mm.", "760 − " + dp + " = " + (760 - dp) + " mm"]);
  }
  function genUzVaqt(L) {
    var k = R(1, 8), dg = 15 * k;
    if (L === 3 && Math.random() < 0.5) { var e = Math.random() < 0.5, hh = 12 + (e ? k : -k), fm = function (x) { return (x < 10 ? "0" : "") + x + ":00"; };
      return Q("Grinvichda (0° uzunlik) mahalliy vaqt 12:00. <b>" + dg + "° " + (e ? "sharqiy" : "g'arbiy") + "</b> uzunlikdagi joyda mahalliy vaqt qancha?", fm(hh),
        [fm(12 + (e ? -k : k)), fm(hh + (e ? 1 : -1)), fm(hh + (e ? -1 : 1)), fm(12)], ["Har 15° — 1 soat: " + dg + " : 15 = " + k + " soat.", (e ? "Sharqda vaqt oldinda: 12 + " : "G'arbda vaqt orqada: 12 − ") + k + " = " + fm(hh)]); }
    if (Math.random() < 0.5) return Q("Ikki joy orasidagi geografik uzunliklar farqi <b>" + dg + "°</b>. Ular orasidagi mahalliy vaqt farqi necha soat?", k + " soat",
      otherN([k + 1, k - 1, k * 2, dg / 10, k + 2].filter(function (x) { return x > 0 && x !== k; }).map(function (x) { return x + " soat"; }), [], 4), ["Yer 1 soatda 15° buriladi: " + dg + " : 15 = " + k + " soat."]);
    return Q("Ikki joy orasidagi mahalliy vaqt farqi <b>" + k + " soat</b>. Ular orasidagi uzunliklar farqi necha gradus?", dg + "°",
      otherN([dg + 15, dg - 15, k * 10, dg * 2, k * 24].filter(function (x) { return x > 0 && x !== dg; }).map(function (x) { return x + "°"; }), [], 4), ["1 soat — 15°: " + k + " × 15 = " + dg + "°."]);
  }
  // 1-daraja uchun ham masshtab: bir necha sm va teskari masala
  function genMasshtab2(L) {
    var M = pick([100000, 200000, 500000, 1000000]), kps = M / 100000, sm = R(2, 9), km = sm * kps, fmt = String(M).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (L === 1 || Math.random() < 0.5) return Q("Xarita masshtabi 1 : " + fmt + ". Xaritada ikki shahar orasi " + sm + " sm. Joyda ular orasidagi masofa necha km?", km + " km",
      [km * 10, sm, km + kps, km / 10, km * 2].map(function (x) { return String(x).replace(".", ",") + " km"; }), ["1 sm = " + kps + " km.", sm + " × " + kps + " = " + km + " km"]);
    return Q("Xarita masshtabi 1 : " + fmt + ". Joyda " + km + " km bo'lgan masofa xaritada necha sm bo'ladi?", sm + " sm",
      otherN([sm + 1, sm - 1, km, sm * 10, sm * 2].filter(function (x) { return x > 0 && x !== sm; }).map(function (x) { return x + " sm"; }), [], 4), ["1 sm = " + kps + " km.", km + " : " + kps + " = " + sm + " sm"]);
  }
  topic("g3", "Geografiya · Materiklar, okeanlar va tabiat", G3, [{ p: 0.11, fn: function (L) { return L === 1 ? null : genMasshtab(L); } }, { p: 0.09, fn: function (L) { return L === 1 ? null : genVaqt(L); } },
    { p: 0.06, fn: function (L) { return L === 1 ? genMasshtab(1) : genUzVaqt(L); } }, { p: 0.07, fn: genMasshtab2 }, { p: 0.1, fn: genMaterik }, { p: 0.06, fn: function (L) { return L === 3 ? null : genYon(); } },
    { p: 0.05, fn: function (L) { return L === 1 ? null : genAzimut(); } }, { p: 0.1, fn: genIqlim }]);

  /* ================= h1 Tarix · O'zbekiston tarixi: muhim sanalar ================= */
  var H1 = [
    [1, "O'zbekistonda Mustaqillik kuni qachon nishonlanadi?", "1-sentabr", ["31-avgust", "8-dekabr", "21-mart", "9-may"], "1991-yil 31-avgustda mustaqillik e'lon qilingan, 1-sentabr Mustaqillik kuni deb belgilangan."],
    [1, "O'zbekiston Konstitutsiyasi kuni qachon nishonlanadi?", "8-dekabr", ["1-sentabr", "10-dekabr", "2-iyul", "18-noyabr"], "Konstitutsiya 1992-yil 8-dekabrda qabul qilingan."],
    [1, "O'zbekiston mustaqilligi qaysi yili e'lon qilingan?", "1991", ["1990", "1992", "1989", "1994"], "1991-yil 31-avgustda davlat mustaqilligi e'lon qilingan."],
    [1, "Amir Temur qaysi yili tug'ilgan?", "1336", ["1326", "1346", "1370", "1405"], "Amir Temur 1336-yil 9-aprelda tug'ilgan."],
    [1, "Amir Temur davlatining poytaxti qaysi shahar bo'lgan?", "Samarqand", ["Buxoro", "Shahrisabz", "Xiva", "Toshkent"], "Amir Temur Samarqandni poytaxt qilib, uni obod qilgan."],
    [1, "Amir Temur qayerda tug'ilgan?", "Shahrisabz yaqinida", ["Buxoro yaqinida", "Xiva yaqinida", "Andijon yaqinida"], "Amir Temur Kesh (Shahrisabz) yaqinidagi Xo'ja Ilg'or qishlog'ida tug'ilgan."],
    [1, "Zahiriddin Muhammad Bobur qaysi shaharda tug'ilgan?", "Andijon", ["Samarqand", "Buxoro", "Hirot", "Qo'qon"], "Bobur 1483-yilda Andijonda tug'ilgan."],
    [1, "Mirzo Ulug'bek rasadxonasi qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent", "Termiz"], "Rasadxona XV asrda Samarqand yaqinidagi Ko'hak tepaligida qurilgan."],
    [1, "Ichan qal'a qaysi shaharda joylashgan?", "Xiva", ["Buxoro", "Samarqand", "Qo'qon", "Nukus"], "Ichan qal'a — Xivaning ichki shahri."],
    [1, "Registon maydoni qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"], "Registonda Ulug'bek, Sherdor va Tillakori madrasalari bor."],
    [1, "Oqsaroy saroyi qaysi shaharda qurilgan?", "Shahrisabz", ["Samarqand", "Buxoro", "Xiva"], "Oqsaroy Amir Temur davrida qurilgan."],
    [1, "Minorai Kalon qaysi shaharda joylashgan?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"], "Minorai Kalon — Buxoroning ramzlaridan biri."],
    [1, "Go'ri Amir maqbarasi qaysi shaharda joylashgan?", "Samarqand", ["Shahrisabz", "Buxoro", "Hirot"], "Go'ri Amirda Amir Temur va temuriylar dafn etilgan."],
    [1, "Kalta minor qaysi shaharda joylashgan?", "Xiva", ["Buxoro", "Samarqand", "Qo'qon"], "Kalta minor Ichan qal'a hududida joylashgan."],
    [1, "Navro'z bayrami qachon nishonlanadi?", "21-mart", ["1-sentabr", "8-mart", "9-may", "1-yanvar"], "Navro'z — bahor va yangi yil bayrami."],
    [1, "Xotira va qadrlash kuni qachon nishonlanadi?", "9-may", ["1-may", "21-mart", "1-oktabr", "8-dekabr"], "9-may — Xotira va qadrlash kuni."],
    [1, "O'qituvchi va murabbiylar kuni qachon nishonlanadi?", "1-oktabr", ["1-sentabr", "21-oktabr", "8-dekabr", "9-may"], "1-oktabr — O'qituvchi va murabbiylar kuni."],
    [1, "Buyuk Ipak yo'li qaysi mintaqalarni bog'lagan?", "Xitoy va Yevropani", ["Hindiston va Afrikani", "Rossiya va Eronni", "Amerika va Yevropani"], "Ipak yo'li O'rta Osiyo orqali Sharq va G'arbni bog'lagan."],
    [1, "Somoniylar davlatining poytaxti qaysi shahar bo'lgan?", "Buxoro", ["Samarqand", "Xiva", "Termiz"], "Somoniylar davrida Buxoro yirik ilm-fan markaziga aylangan."],
    [2, "O'zbekiston mustaqilligi qachon e'lon qilingan?", "1991-yil 31-avgust", ["1991-yil 1-sentabr", "1990-yil 31-avgust", "1992-yil 31-avgust", "1991-yil 18-noyabr"], "Oliy Kengash sessiyasida mustaqillik e'lon qilingan; 1-sentabr — Mustaqillik kuni."],
    [2, "Mustaqil O'zbekistonning ilk Konstitutsiyasi qachon qabul qilingan?", "1992-yil 8-dekabr", ["1991-yil 8-dekabr", "1992-yil 10-dekabr", "1993-yil 8-dekabr", "1992-yil 2-iyul"], "8-dekabr — Konstitutsiya kuni."],
    [2, "O'zbekiston BMTga qachon a'zo bo'lgan?", "1992-yil 2-mart", ["1991-yil 2-mart", "1992-yil 1-sentabr", "1993-yil 2-mart", "1992-yil 8-dekabr"], "O'zbekiston 1992-yil 2-martda BMTga a'zo bo'lgan."],
    [2, "O'zbekiston Davlat bayrog'i qachon qabul qilingan?", "1991-yil 18-noyabr", ["1992-yil 18-noyabr", "1991-yil 31-avgust", "1992-yil 2-iyul", "1991-yil 8-dekabr"], "Davlat bayrog'i 1991-yil 18-noyabrda qabul qilingan."],
    [2, "O'zbekiston Davlat gerbi qachon qabul qilingan?", "1992-yil 2-iyul", ["1991-yil 2-iyul", "1992-yil 10-dekabr", "1991-yil 18-noyabr", "1993-yil 2-iyul"], "Davlat gerbi 1992-yil 2-iyulda qabul qilingan."],
    [2, "O'zbekiston Davlat madhiyasi qachon qabul qilingan?", "1992-yil 10-dekabr", ["1992-yil 8-dekabr", "1991-yil 10-dekabr", "1992-yil 2-iyul", "1993-yil 10-dekabr"], "Madhiya so'zlari — Abdulla Oripov, musiqasi — Mutal Burhonov."],
    [2, "Milliy valyuta — so'm qachon muomalaga kiritilgan?", "1994-yil 1-iyul", ["1993-yil 1-iyul", "1994-yil 1-yanvar", "1992-yil 1-iyul", "1995-yil 1-iyul"], "1994-yil 1-iyuldan so'm to'liq muomalaga kiritilgan."],
    [2, "Amir Temur qaysi yili vafot etgan?", "1405", ["1404", "1395", "1415", "1370"], "Amir Temur 1405-yilda O'trorda vafot etgan."],
    [2, "Mirzo Ulug'bek yashagan yillar qaysi?", "1394–1449", ["1336–1405", "1441–1501", "1483–1530", "1404–1459"], "Ulug'bek — Amir Temurning nevarasi, olim va hukmdor."],
    [2, "Zahiriddin Muhammad Bobur yashagan yillar qaysi?", "1483–1530", ["1394–1449", "1441–1501", "1336–1405", "1473–1520"], "Bobur — shoir, tarixchi va Boburiylar davlati asoschisi."],
    [2, "Bobur Hindistonda qaysi yili o'z davlatiga asos solgan?", "1526", ["1504", "1530", "1483", "1556"], "1526-yilgi Panipat jangidan so'ng Boburiylar davlati tashkil topgan."],
    [2, "Bobur 1526-yilda qaysi jangda g'alaba qozongan?", "Panipat jangi", ["Anqara jangi", "Talas jangi", "Kosovo jangi"], "Panipat jangidan keyin Bobur Dehlini egallagan."],
    [2, "Amir Temur 1402-yilda Usmonli sultoni Boyazidni qaysi jangda yenggan?", "Anqara jangi", ["Panipat jangi", "Talas jangi", "Kulikovo jangi"], "Anqara jangi 1402-yilda bo'lib o'tgan."],
    [2, "Amir Temur qaysi yili hokimiyatni qo'lga olgan?", "1370", ["1336", "1360", "1380", "1405"], "1370-yilda Balxdagi qurultoyda Amir Temur hukmdor deb e'lon qilingan."],
    [2, "\"Temur tuzuklari\" kimga nisbat beriladi?", "Amir Temur", ["Mirzo Ulug'bek", "Bobur", "Shohrux Mirzo"], "Asarda davlatni boshqarish qoidalari bayon etilgan."],
    [2, "O'zbek tiliga davlat tili maqomi qachon berilgan?", "1989-yil 21-oktabr", ["1991-yil 21-oktabr", "1989-yil 1-sentabr", "1992-yil 21-oktabr", "1990-yil 21-oktabr"], "21-oktabr — O'zbek tili bayrami kuni."],
    [2, "Ismoil Somoniy maqbarasi qaysi shaharda joylashgan?", "Buxoro", ["Samarqand", "Termiz", "Xiva"], "Maqbara Somoniylar davrida qurilgan."],
    [2, "Shohizinda ansambli qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Shahrisabz"], "Shohizinda — maqbaralar majmuasi."],
    [2, "Bibixonim masjidi qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"], "Masjid Amir Temur davrida qurilgan."],
    [3, "O'zbekistondagi qaysi obyekt birinchi bo'lib YuNESKO Butunjahon merosi ro'yxatiga kiritilgan?", "Xivadagi Ichan qal'a", ["Buxoro tarixiy markazi", "Samarqand", "Shahrisabz tarixiy markazi"], "Ichan qal'a 1990-yilda ro'yxatga kiritilgan."],
    [3, "Ichan qal'a YuNESKO ro'yxatiga qaysi yili kiritilgan?", "1990", ["1993", "2000", "2001", "1997"], "Buxoro — 1993, Shahrisabz — 2000, Samarqand — 2001-yilda kiritilgan."],
    [3, "Buxoro tarixiy markazi YuNESKO ro'yxatiga qaysi yili kiritilgan?", "1993", ["1990", "2000", "2001", "1991"], "Ichan qal'a — 1990, Buxoro — 1993-yilda kiritilgan."],
    [3, "Samarqand shahri YuNESKO ro'yxatiga qaysi yili kiritilgan?", "2001", ["1990", "1993", "2000", "2007"], "Samarqand \"Madaniyatlar chorrahasi\" sifatida 2001-yilda kiritilgan."],
    [3, "Mustaqillik Deklaratsiyasi qachon qabul qilingan?", "1990-yil 20-iyun", ["1991-yil 20-iyun", "1990-yil 31-avgust", "1991-yil 31-avgust", "1989-yil 20-iyun"], "Deklaratsiya mustaqillik sari muhim qadam bo'lgan."],
    [3, "Lotin yozuviga asoslangan o'zbek alifbosi qaysi yili qabul qilingan?", "1993", ["1991", "1995", "1989", "2000"], "Alifbo 1993-yil 2-sentabrda qonun bilan qabul qilingan."],
    [3, "Amir Temur qayerda vafot etgan?", "O'trorda", ["Samarqandda", "Shahrisabzda", "Hirotda"], "Amir Temur Xitoyga yurish paytida, 1405-yilda O'trorda vafot etgan."],
    [3, "Mirzo Ulug'bek kimning o'g'li bo'lgan?", "Shohrux Mirzo", ["Amir Temur", "Umarshayx Mirzo", "Bobur"], "Ulug'bek — Shohrux Mirzoning o'g'li, Amir Temurning nevarasi."],
    [3, "Shohrux Mirzo davrida Temuriylar davlatining poytaxti qaysi shahar bo'lgan?", "Hirot", ["Samarqand", "Buxoro", "Balx"], "Shohrux Mirzo poytaxtni Hirotga ko'chirgan."],
    [3, "Ulug'bek rasadxonasi qoldiqlarini 1908-yilda kim topgan?", "V. L. Vyatkin", ["A. Navoiy", "Ali Qushchi", "M. Behbudiy"], "Arxeolog Vyatkin rasadxona sekstantining qoldiqlarini topgan."],
    [3, "Qaysi madrasa Samarqanddagi Registon ansambliga kirmaydi?", "Ko'kaldosh madrasasi", ["Ulug'bek madrasasi", "Sherdor madrasasi", "Tillakori madrasasi"], "Registon ansambli: Ulug'bek, Sherdor va Tillakori madrasalari."],
    [3, "XIX asrda O'zbekiston hududidagi uch davlat: Buxoro amirligi, Xiva xonligi va …?", "Qo'qon xonligi", ["Toshkent xonligi", "Samarqand amirligi", "Termiz xonligi"], "Bu davlatlar tarixda \"uch xonlik\" deb ham ataladi."],
    [3, "Afrosiyob nima?", "Qadimgi Samarqand xarobalari", ["Buxorodagi madrasa", "Xivadagi minora", "Toshkentdagi bozor"], "Afrosiyobda qadimgi devoriy suratlar topilgan."],
    [3, "Samarqand shahrining 2750 yillik yubileyi qaysi yili nishonlangan?", "2007", ["2001", "1997", "2009", "1991"], "Samarqand — dunyodagi eng qadimgi shaharlardan biri."],
    [3, "Xorazmshohlar davlatining poytaxti qaysi shahar bo'lgan?", "Gurganj (Urganch)", ["Buxoro", "Samarqand", "Termiz"], "Gurganj — hozirgi Ko'hna Urganch."],
    [1,"O'zbekistonda Vatan himoyachilari kuni qachon nishonlanadi?","14-yanvar",["9-may","1-oktabr","8-mart"],"14-yanvar Vatan himoyachilari kuni sifatida nishonlanadi."],
    [1,"Xalqaro xotin-qizlar kuni qachon nishonlanadi?","8-mart",["21-mart","1-iyun","1-oktabr"],"8-mart butun dunyoda xotin-qizlar bayrami sifatida nishonlanadi."],
    [1,"Xalqaro bolalarni himoya qilish kuni qachon nishonlanadi?","1-iyun",["8-mart","1-sentabr","21-mart"],"1-iyun bolalar huquqlarini himoya qilishga bag'ishlangan xalqaro kun."],
    [1,"Toshkentda kuchli zilzila qaysi yili sodir bo'lgan?","1966-yilda",["1946-yilda","1976-yilda","1986-yilda"],"1966-yil 26-apreldagi zilziladan so'ng shahar qayta qurilgan."],
    [1,"O'zbekiston SSR qaysi yili tashkil topgan?","1924-yilda",["1917-yilda","1936-yilda","1945-yilda"],"O'zbekiston SSR 1924-yil 27-oktabrda tuzilgan."],
    [1,"Toshkent metropoliteni qaysi yili ishga tushgan?","1977-yilda",["1967-yilda","1987-yilda","1991-yilda"],"Birinchi liniya 1977-yil 6-noyabrda ochilgan."],
    [1,"Mo'g'ullar O'zbekiston hududini qaysi asrda bosib olgan?","XIII asrda",["XI asrda","XII asrda","XV asrda"],"Mo'g'ul bosqini 1219–1221-yillarda bo'lib o'tgan."],
    [1,"Somoniylar davlati qaysi asrlarda mavjud bo'lgan?","IX–X asrlarda",["VII–VIII asrlarda","XI–XII asrlarda","XIII–XIV asrlarda"],"Somoniylar davlati 819–999-yillarda hukmronlik qilgan."],
    [1,"Temuriylar sulolasi qaysi asrlarda hukmronlik qilgan?","XIV–XV asrlarda",["XII–XIII asrlarda","XV–XVI asrlarda","XVI–XVII asrlarda"],"Amir Temur 1370-yilda hokimiyatni qo'lga olib, sulolaga asos solgan."],
    [1,"O'zbekiston hududi Rossiya imperiyasi tarkibiga qaysi asrda kirgan?","XIX asrda",["XVII asrda","XVIII asrda","XX asrda"],"XIX asrning ikkinchi yarmida uch xonlik Rossiyaga qaram bo'lgan."],
    [1,"Toshkent shahri necha yillik yubileyini 2009-yilda nishonlagan?","2200 yillik",["2500 yillik","2700 yillik","3000 yillik"],"Toshkentning 2200 yilligi 2009-yilda keng nishonlangan."],
    [1,"Buxoro shahri 2500 yilligi qaysi yili nishonlangan?","1997-yilda",["1991-yilda","2002-yilda","2009-yilda"],"Buxoro 1997-yilda 2500 yillik yubileyini nishonlagan."],
    [1,"Registon ansamblidagi eng qadimgi madrasa qaysi asrda qurilgan?","XV asrda",["XIV asrda","XVI asrda","XVII asrda"],"Ulug'bek madrasasi 1417–1420-yillarda qurilgan."],
    [1,"Minorai Kalon qaysi asrda qurilgan?","XII asrda",["X asrda","XI asrda","XIV asrda"],"Minora 1127-yilda qurilgan."],
    [1,"Qoraxoniylar davlati Movarounnahrda qaysi asrlarda hukmronlik qilgan?","X–XII asrlarda",["VIII–IX asrlarda","XIII–XIV asrlarda","XV–XVI asrlarda"],"Qoraxoniylar 999-yilda Somoniylar davlatini egallagan."],
    [1,"1916-yilda O'zbekiston hududida qanday voqea sodir bo'lgan?","Milliy ozodlik qo'zg'oloni",["Xonliklar tugatilishi","Konstitutsiya qabul qilinishi","Metropoliten ochilishi"],"Qo'zg'olon aholini mardikorlik ishlariga jalb qilishga qarshi boshlangan."],
    [2,"Toshkent shahri Rossiya imperiyasi qo'shinlari tomonidan qaysi yili bosib olingan?","1865-yilda",["1864-yilda","1867-yilda","1876-yilda"],"Toshkent 1865-yilda general Chernyayev qo'shinlari tomonidan egallangan."],
    [2,"Buxoro shahri mo'g'ullar tomonidan qaysi yili egallangan?","1220-yilda",["1219-yilda","1221-yilda","1227-yilda"],"Buxoro 1220-yilda Chingizxon qo'shinlari tomonidan bosib olingan."],
    [2,"O'zbekiston YuNESKOga qaysi yili a'zo bo'lgan?","1993-yilda",["1991-yilda","1992-yilda","1995-yilda"],"O'zbekiston 1993-yilda YuNESKOga a'zo bo'lgan."],
    [2,"Bobur qaysi yili Andijon taxtiga o'tirgan?","1494-yilda",["1483-yilda","1504-yilda","1526-yilda"],"Otasi Umarshayx vafot etgach, Bobur 1494-yilda taxtga o'tirgan."],
    [2,"O'zbekiston Fanlar akademiyasi qaysi yili tashkil etilgan?","1943-yilda",["1924-yilda","1936-yilda","1956-yilda"],"Akademiya 1943-yilda O'zbekiston SSR Fanlar akademiyasi sifatida tuzilgan."],
    [2,"Xiva shahri 2500 yilligi qaysi yili nishonlangan?","1997-yilda",["1990-yilda","2002-yilda","2009-yilda"],"Xiva 1997-yilda 2500 yillik yubileyini nishonlagan."],
    [2,"Xorazmshohlar davlati qaysi asrlarda mavjud bo'lgan?","XI–XIII asrlarda",["IX–X asrlarda","XIII–XIV asrlarda","XV–XVI asrlarda"],"Davlat 1231-yilda mo'g'ullar bosqini natijasida qulagan."],
    [2,"Shayboniylar sulolasi Buxoroda qaysi asrda hukmronlik qilgan?","XVI asrda",["XV asrda","XVII asrda","XVIII asrda"],"Sulola XVI asr davomida Buxoroda hukmronlik qilgan."],
    [2,"Sherdor madrasasi qaysi asrda qurilgan?","XVII asrda",["XV asrda","XVI asrda","XVIII asrda"],"Sherdor madrasasi 1636-yilda qurib bitkazilgan."],
    [2,"O'zbekiston Mustaqil Davlatlar Hamdo'stligiga qaysi sanada qo'shilgan?","1991-yil 21-dekabr",["1991-yil 8-dekabr","1992-yil 2-mart","1992-yil 15-may"],"Olmaota shahrida imzolangan hujjat bilan Hamdo'stlik tuzilgan."],
    [2,"Shanxay hamkorlik tashkiloti qaysi yili tashkil etilgan?","2001-yilda",["1996-yilda","1999-yilda","2005-yilda"],"Tashkilot 2001-yil 15-iyunda Shanxay shahrida tuzilgan."],
    [2,"Tojikiston ASSR O'zbekiston SSR tarkibidan qaysi yili chiqqan?","1929-yilda",["1924-yilda","1927-yilda","1936-yilda"],"1929-yilda Tojikiston ittifoqdosh respublika maqomini olgan."],
    [2,"Qoraqalpog'iston ASSR O'zbekiston SSR tarkibiga qaysi yili kirgan?","1936-yilda",["1924-yilda","1929-yilda","1945-yilda"],"1936-yilda Qoraqalpog'iston O'zbekiston SSR tarkibiga o'tkazilgan."],
    [2,"O'zbekiston SSR Ikkinchi jahon urushida qaysi yillarda qatnashgan?","1941–1945-yillarda",["1939–1945-yillarda","1941–1944-yillarda","1945–1949-yillarda"],"Urush 1941-yil 22-iyunda boshlanib, 1945-yil 9-mayda tugagan."],
    [2,"Turkiston general-gubernatorligi qaysi yili tuzilgan?","1867-yilda",["1865-yilda","1868-yilda","1876-yilda"],"General-gubernatorlikning markazi Toshkent bo'lgan."],
    [2,"Somoniylar davlati qaysi yili tugagan?","999-yilda",["892-yilda","1040-yilda","1127-yilda"],"999-yilda Qoraxoniylar Buxoroni egallab, Somoniylar hukmronligiga barham bergan."],
    [3,"O'zbekiston mustaqilligi bo'yicha umumxalq referendumi qaysi sanada o'tkazilgan?","1991-yil 29-dekabr",["1991-yil 31-avgust","1991-yil 18-noyabr","1992-yil 8-dekabr"],"Referendum natijasida mustaqillik tasdiqlangan."],
    [3,"Amir Temur qaysi yili Hindistonga yurish qilgan?","1398-yilda",["1391-yilda","1402-yilda","1405-yilda"],"Yurish chog'ida Dehli shahri egallangan."],
    [3,"Bobur qaysi yili Kobulni egallagan?","1504-yilda",["1494-yilda","1519-yilda","1526-yilda"],"Kobul Boburning keyingi yurishlari uchun tayanchga aylangan."],
    [3,"O'zbekiston SSR poytaxti qaysi yili Toshkentga ko'chirilgan?","1930-yilda",["1924-yilda","1925-yilda","1936-yilda"],"Bungacha respublika poytaxti Samarqand bo'lgan."],
    [3,"Buxoro amirligi qaysi yili tugatilgan?","1920-yilda",["1918-yilda","1924-yilda","1929-yilda"],"1920-yil 2-sentabrda amirlik ag'darildi, o'sha yili Buxoro Xalq Sovet Respublikasi tuzildi."],
    [3,"Shahrisabz shahri 2700 yilligi qaysi yili nishonlangan?","2002-yilda",["1997-yilda","2007-yilda","2009-yilda"],"Shahrisabz 2002-yilda 2700 yillik yubileyini nishonlagan."],
    [3,"Qo'qon xonligi qaysi yili tugatilgan?","1876-yilda",["1868-yilda","1873-yilda","1885-yilda"],"Xonlik bosib olinib, uning hududida Farg'ona viloyati tashkil etilgan."],
    [3,"Buxoro amirligi ustidan Rossiya protektorati qaysi yili o'rnatilgan?","1868-yilda",["1865-yilda","1873-yilda","1876-yilda"],"1868-yildagi shartnoma bilan amirlik Rossiya qaramligiga o'tgan."],
    [3,"Xiva xonligi ustidan Rossiya protektorati qaysi yili o'rnatilgan?","1873-yilda",["1868-yilda","1876-yilda","1885-yilda"],"Gandimiyon shartnomasi bilan xonlik Rossiya qaramligiga o'tgan."],
    [3,"Qo'qon xonligiga qaysi yili asos solingan?","1709-yilda",["1740-yilda","1785-yilda","1809-yilda"],"Shohruxbiy Farg'ona vodiysida xonlikka asos solgan."],
    [3,"Nodirshoh Buxoroni qaysi yili egallagan?","1740-yilda",["1709-yilda","1756-yilda","1785-yilda"],"Buxoro xonligi Nodirshoh yurishi natijasida og'ir tovon to'lashga majbur bo'lgan."],
    [3,"Muhammad Shayboniyxon qaysi yili halok bo'lgan?","1510-yilda",["1500-yilda","1526-yilda","1533-yilda"],"U Marv yaqinidagi jangda halok bo'lgan."],
    [3,"Talas jangi qaysi yili bo'lib o'tgan?","751-yilda",["651-yilda","851-yilda","951-yilda"],"Jangda Abbosiylar qo'shini Tang imperiyasi qo'shinini yenggan."],
    [3,"Turkiston Muxtor Sovet Sotsialistik Respublikasi qaysi yili tuzilgan?","1918-yilda",["1917-yilda","1920-yilda","1924-yilda"],"Turkiston ASSR 1918-yil 30-aprelda e'lon qilingan."],
    [3,"Buxoroda mang'itlar sulolasi qaysi asrdan hukmronlik qilgan?","XVIII asrdan",["XVI asrdan","XVII asrdan","XIX asrdan"],"Mang'itlar sulolasi Buxoro amirligini 1920-yilgacha boshqargan."]
  ];
  // [voqea ("... yil" deb o'qiladigan shaklda), yil, daraja]
  var VOQEA = [
    ["O'zbekiston mustaqilligi e'lon qilingan", 1991, 1], ["O'zbekiston Konstitutsiyasi qabul qilingan", 1992, 1], ["Milliy valyuta so'm joriy etilgan", 1994, 1],
    ["Amir Temur tug'ilgan", 1336, 1], ["Amir Temur vafot etgan", 1405, 1], ["Mirzo Ulug'bek tug'ilgan", 1394, 1], ["Alisher Navoiy tug'ilgan", 1441, 1],
    ["Zahiriddin Muhammad Bobur tug'ilgan", 1483, 1], ["Toshkentda kuchli zilzila bo'lgan", 1966, 1], ["Toshkentning 2200 yilligi nishonlangan", 2009, 1],
    ["O'zbekiston BMTga a'zo bo'lgan", 1992, 1], ["Davlat bayrog'i qabul qilingan", 1991, 1], ["O'zbek tiliga davlat tili maqomi berilgan", 1989, 2],
    ["Lotin yozuvidagi alifbo qabul qilingan", 1993, 2], ["Amir Temur hokimiyatni qo'lga olgan", 1370, 1], ["Anqara jangi bo'lgan", 1402, 2],
    ["Mirzo Ulug'bek vafot etgan", 1449, 2], ["Alisher Navoiy vafot etgan", 1501, 1], ["Panipat jangi bo'lgan", 1526, 2], ["Bobur vafot etgan", 1530, 2],
    ["Abu Rayhon Beruniy tug'ilgan", 973, 2], ["Abu Ali ibn Sino tug'ilgan", 980, 2], ["Samarqandning 2750 yilligi nishonlangan", 2007, 2],
    ["Mustaqillik Deklaratsiyasi qabul qilingan", 1990, 3], ["Bobur Kobulni egallagan", 1504, 3], ["Imom al-Buxoriy tug'ilgan", 810, 3], ["Talas jangi bo'lgan", 751, 3],
    ["Mo'g'ullar Buxoroni egallagan", 1220, 3], ["Jaloliddin Manguberdi vafot etgan", 1231, 3], ["Chor Rossiyasi Toshkentni egallagan", 1865, 3],
    ["Turkiston general-gubernatorligi tuzilgan", 1867, 3], ["Qo'qon xonligi tugatilgan", 1876, 3], ["Xiva xonligi tugatilgan", 1920, 3], ["Buxoro amirligi tugatilgan", 1920, 3],
    ["O'zbekiston SSR tuzilgan", 1924, 3], ["Toshkent metrosi ochilgan", 1977, 3], ["Ichan qal'a YuNESKO ro'yxatiga kirgan", 1990, 3],
    ["Buxoro va Xivaning 2500 yilligi nishonlangan", 1997, 3], ["Ulug'bek rasadxonasi qoldiqlari topilgan", 1908, 3]
  ];
  function yilW(y, n) {
    var c = [y + 1, y - 1, y + 10, y - 10, y + 2, y - 3];
    VOQEA.forEach(function (v) { if (Math.abs(v[1] - y) <= 120 && v[1] !== y) c.push(v[1]); });
    return otherN(c.filter(function (x) { return x !== y && x > 0 && x <= 2025; }).map(String), [], n);
  }
  function genVoqea(L) {
    var e = pick(lvList(VOQEA, L, 2)), y = e[1], k = R(0, 2), st = [e[0] + " — " + y + "-yil."];
    if (k === 0) return Q("Qaysi yili <b>" + e[0] + "</b>?", String(y), yilW(y, 4), st);
    if (k === 1) {
      var w = otherN(VOQEA.filter(function (v) { return v[1] !== y && Math.abs(v[1] - y) <= (y < 1800 ? 300 : 60); }).map(function (v) { return v[0]; }), [], 4);
      if (w.length < 3) w = otherN(VOQEA.filter(function (v) { return v[1] !== y; }).map(function (v) { return v[0]; }), w, 4 - w.length).concat(w);
      return Q("Qaysi voqea <b>" + y + "</b>-yilda bo'lgan?", e[0], w, st);
    }
    var c = Math.ceil(y / 100);
    return Q("<b>" + e[0] + "</b> yil qaysi asrga to'g'ri keladi?", rim(c) + " asr", [c - 1, c + 1, c - 2, c - 3, c + 2].filter(function (x) { return x > 0 && x <= Math.max(21, c + 1); }).map(function (x) { return rim(x) + " asr"; }),
      [e[0] + " — " + y + "-yil → " + rim(c) + " asr."]);
  }
  topic("h1", "Tarix · O'zbekiston tarixi: muhim sanalar", H1, [{ p: 0.5, fn: genVoqea }]);

  /* ================= h2 Tarix · Buyuk allomalar va ularning asarlari ================= */
  // [muallif, asar, daraja]
  var ASAR = [
    ["Al-Xorazmiy", "Al-jabr va-l-muqobala", 2], ["Abu Rayhon Beruniy", "Qadimgi xalqlardan qolgan yodgorliklar", 2], ["Abu Rayhon Beruniy", "Hindiston", 3],
    ["Abu Ali ibn Sino", "Tib qonunlari", 1], ["Abu Ali ibn Sino", "Kitob ash-shifo", 3], ["Mirzo Ulug'bek", "Ziji jadidi Ko'ragoniy", 2],
    ["Alisher Navoiy", "Xamsa", 1], ["Alisher Navoiy", "Xazoyin ul-maoniy", 2], ["Alisher Navoiy", "Muhokamat ul-lug'atayn", 2],
    ["Alisher Navoiy", "Mahbub ul-qulub", 3], ["Alisher Navoiy", "Lison ut-tayr", 3], ["Zahiriddin Muhammad Bobur", "Boburnoma", 1],
    ["Mahmud Koshg'ariy", "Devonu lug'otit turk", 2], ["Yusuf Xos Hojib", "Qutadg'u bilig", 2], ["Ahmad Yugnakiy", "Hibat ul-haqoyiq", 3],
    ["Imom al-Buxoriy", "Al-Jome' as-sahih", 2], ["Abu Nasr Forobiy", "Fozil odamlar shahri", 3], ["Abdulla Qodiriy", "O'tkan kunlar", 1],
    ["Abdulla Qodiriy", "Mehrobdan chayon", 2], ["Cho'lpon", "Kecha va kunduz", 2], ["Oybek", "Qutlug' qon", 3],
    ["G'afur G'ulom", "Shum bola", 1], ["Abdulla Qahhor", "O'tmishdan ertaklar", 2], ["Abdulla Qahhor", "Sarob", 3],
    ["Mahmudxo'ja Behbudiy", "Padarkush", 3], ["Abdulla Avloniy", "Turkiy guliston yoxud axloq", 3], ["Hamza Hakimzoda Niyoziy", "Boy ila xizmatchi", 3],
    ["Erkin Vohidov", "Ruhlar isyoni", 3], ["Said Ahmad", "Kelinlar qo'zg'oloni", 2], ["Xudoyberdi To'xtaboyev", "Sariq devni minib", 1],
    ["O'tkir Hoshimov", "Dunyoning ishlari", 2], ["Pirimqul Qodirov", "Yulduzli tunlar", 2], ["Hamid Olimjon", "Oygul bilan Baxtiyor", 3],
    ["Alisher Navoiy", "Farhod va Shirin", 1], ["Alisher Navoiy", "Layli va Majnun", 1], ["Alisher Navoiy", "Saddi Iskandariy", 2], ["Alisher Navoiy", "Sab'ai sayyor", 2],
    ["Alisher Navoiy", "Hayrat ul-abror", 2], ["Alisher Navoiy", "Mezon ul-avzon", 3], ["Alisher Navoiy", "Majolis un-nafois", 3],
    ["Xudoyberdi To'xtaboyev", "Sehrli qalpoqcha", 1], ["Xudoyberdi To'xtaboyev", "Besh bolali yigitcha", 2], ["Oybek", "Bolalik", 1],
    ["G'afur G'ulom", "Sen yetim emassan", 2], ["Abdulla Qahhor", "O'g'ri", 2], ["Abdulla Qahhor", "Bemor", 2], ["Abdulla Qahhor", "Sinchalak", 3],
    ["O'tkir Hoshimov", "Ikki eshik orasi", 2], ["O'tkir Hoshimov", "Bahor qaytmaydi", 3], ["O'tkir Hoshimov", "Nur borki, soya bor", 3],
    ["Said Ahmad", "Ufq", 3], ["Said Ahmad", "Jimjitlik", 3], ["Pirimqul Qodirov", "Avlodlar dovoni", 3], ["Abdulla Qodiriy", "Obid ketmon", 3],
    ["Cho'lpon", "Uyg'onish", 3], ["Hamza Hakimzoda Niyoziy", "Maysaraning ishi", 3], ["Hamid Olimjon", "Zaynab va Omon", 3], ["Erkin Vohidov", "O'zbegim", 2],
    ["Abu Rayhon Beruniy", "Mas'ud qonuni", 3], ["Abu Rayhon Beruniy", "Saydana", 3], ["Abu Ali ibn Sino", "Donishnoma", 3], ["Abu Nasr Forobiy", "Musiqa haqida katta kitob", 3],
    ["Ahmad al-Farg'oniy", "Astronomiya asoslari", 3], ["Zahiriddin Muhammad Bobur", "Mubayyin", 3], ["Ahmad Yassaviy", "Devoni hikmat", 2], ["Lutfiy", "Gul va Navro'z", 3],
    ["Abulg'ozi Bahodirxon", "Shajarai turk", 3], ["Nosiriddin Rabg'uziy", "Qisasi Rabg'uziy", 3], ["Gulxaniy", "Zarbulmasal", 3], ["Muqimiy", "Sayohatnoma", 3], ["Tohir Malik", "Shaytanat", 3]
  ];
  function genAsar(L) {
    var pool = ASAR.filter(function (x) { return x[2] === L; });
    if (L === 3) pool = pool.concat(ASAR.filter(function (x) { return x[2] === 2; }));
    var it = pick(pool);
    var authors = []; ASAR.forEach(function (x) { if (x[0] !== it[0] && authors.indexOf(x[0]) < 0) authors.push(x[0]); });
    if (Math.random() < 0.6) {
      return Q("\"<b>" + it[1] + "</b>\" asarining muallifi kim?", it[0], shuffle(authors).slice(0, 4), ["\"" + it[1] + "\" — " + it[0] + " asari."]);
    }
    var works = ASAR.filter(function (x) { return x[0] !== it[0]; }).map(function (x) { return x[1]; });
    return Q("Quyidagilardan qaysi biri <b>" + it[0] + "</b> asari?", it[1], shuffle(works).slice(0, 4), ["\"" + it[1] + "\" — " + it[0] + " asari."]);
  }
  var H2 = [
    [1, "Algebra fanining asoschisi deb qaysi olim tan olingan?", "Al-Xorazmiy", ["Ibn Sino", "Beruniy", "Ulug'bek"], "Uning \"Al-jabr va-l-muqobala\" asaridan \"algebra\" so'zi kelib chiqqan."],
    [1, "\"Algoritm\" so'zi qaysi olim nomidan kelib chiqqan?", "Al-Xorazmiy", ["Al-Farg'oniy", "Ibn Sino", "Forobiy"], "Al-Xorazmiy nomi lotinchada \"Algoritmi\" deb yozilgan."],
    [1, "Abu Ali ibn Sino asosan qaysi soha bilan mashhur?", "Tibbiyot", ["Astronomiya", "Tilshunoslik", "Me'morchilik"], "\"Tib qonunlari\" asrlar davomida tibbiyot darsligi bo'lgan."],
    [1, "Mirzo Ulug'bek qaysi fan bilan mashhur?", "Astronomiya", ["Tibbiyot", "Tilshunoslik", "Kimyo"], "Ulug'bek Samarqandda rasadxona qurdirgan."],
    [1, "Alisher Navoiy qaysi shaharda tug'ilgan?", "Hirot", ["Samarqand", "Buxoro", "Andijon"], "Navoiy 1441-yilda Hirotda tug'ilgan."],
    [1, "Alisher Navoiy yashagan yillar qaysi?", "1441–1501", ["1394–1449", "1483–1530", "1336–1405"], "Navoiy — o'zbek mumtoz adabiyotining asoschisi."],
    [1, "Navoiyning \"Xamsa\" asari nechta dostondan iborat?", "5", ["3", "4", "7"], "\"Xamsa\" so'zi \"beshlik\" degan ma'noni bildiradi."],
    [1, "O'zbekiston Davlat madhiyasi so'zlari muallifi kim?", "Abdulla Oripov", ["Erkin Vohidov", "G'afur G'ulom", "Hamid Olimjon"], "Madhiya musiqasi muallifi — Mutal Burhonov."],
    [1, "O'zbekiston Davlat madhiyasi musiqasi muallifi kim?", "Mutal Burhonov", ["Abdulla Oripov", "Yunus Rajabiy", "Muxtor Ashrafiy"], "Madhiya so'zlari muallifi — Abdulla Oripov."],
    [1, "Birinchi o'zbek romani qaysi?", "O'tkan kunlar", ["Kecha va kunduz", "Shum bola", "Boburnoma"], "\"O'tkan kunlar\" muallifi — Abdulla Qodiriy."],
    [1, "Abu Ali ibn Sino Yevropada qanday nom bilan mashhur?", "Avitsenna", ["Alfraganus", "Algoritmi", "Alfarabius"], "Uning asarlari lotin tiliga tarjima qilingan."],
    [2, "Ahmad al-Farg'oniy Yevropada qanday nom bilan mashhur?", "Alfraganus", ["Avitsenna", "Algoritmi", "Averroes"], "Al-Farg'oniyning astronomiyaga oid asari Yevropada keng o'qilgan."],
    [2, "Ahmad al-Farg'oniy qaysi fan bilan mashhur?", "Astronomiya", ["Tibbiyot", "Tarix", "Tilshunoslik"], "U Nil daryosi suvini o'lchaydigan inshootni ham loyihalagan."],
    [2, "Mahmud Koshg'ariyning \"Devonu lug'otit turk\" asari qaysi sohaga oid?", "Tilshunoslik", ["Tibbiyot", "Astronomiya", "Matematika"], "Bu — turkiy so'zlar lug'ati."],
    [2, "Navoiy \"Muhokamat ul-lug'atayn\" asarida qaysi ikki tilni qiyoslagan?", "Turkiy va forsiy", ["Arab va forsiy", "Turkiy va arab", "Turkiy va xitoy"], "Navoiy turkiy tilning boyligini isbotlagan."],
    [2, "Navoiy forsiy tildagi she'rlarida qaysi taxallusni qo'llagan?", "Foniy", ["Navoiy", "Zahiriddin", "Mashrab"], "Turkiy she'rlarida \"Navoiy\", forsiylarida \"Foniy\" taxallusini qo'llagan."],
    [2, "\"Xazoyin ul-maoniy\" nechta devondan iborat?", "4", ["2", "3", "5"], "To'rt devon inson umrining to'rt fasliga mos keladi."],
    [2, "Qaysi doston Navoiyning \"Xamsa\"siga kirmaydi?", "Lison ut-tayr", ["Farhod va Shirin", "Layli va Majnun", "Sab'ai sayyor", "Saddi Iskandariy"], "\"Lison ut-tayr\" — Navoiyning alohida dostoni."],
    [2, "Qaysi doston \"Xamsa\"ning birinchi dostoni hisoblanadi?", "Hayrat ul-abror", ["Farhod va Shirin", "Layli va Majnun", "Saddi Iskandariy"], "\"Xamsa\": Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab'ai sayyor, Saddi Iskandariy."],
    [2, "Abdulla Qodiriy qaysi taxallus bilan ham hajviy asarlar yozgan?", "Julqunboy", ["Cho'lpon", "Foniy", "Hamza"], "Qodiriy \"Julqunboy\" taxallusi bilan hajviyalar yozgan."],
    [2, "Imom al-Buxoriy qaysi shaharda tug'ilgan?", "Buxoro", ["Samarqand", "Termiz", "Xiva"], "Uning nisbasi \"al-Buxoriy\" tug'ilgan shahridan olingan."],
    [2, "Ogahiy qaysi shaharda yashab ijod qilgan?", "Xiva", ["Qo'qon", "Buxoro", "Toshkent"], "Ogahiy — Xorazmlik shoir, tarixchi va tarjimon."],
    [2, "Muqimiy qaysi shaharda yashab ijod qilgan?", "Qo'qon", ["Xiva", "Samarqand", "Buxoro"], "Muqimiy — Qo'qonlik shoir, hajviy she'rlari bilan mashhur."],
    [2, "Furqat qaysi shaharda tug'ilgan?", "Qo'qon", ["Xiva", "Samarqand", "Buxoro"], "Zokirjon Furqat — Qo'qonda tug'ilgan shoir."],
    [2, "Bobur ota tomonidan kimning avlodi bo'lgan?", "Amir Temur", ["Chingizxon", "Shayboniyxon", "Ismoil Somoniy"], "Bobur ota tomonidan temuriylar sulolasiga mansub."],
    [2, "Kamoliddin Behzod qaysi san'at turi bilan mashhur?", "Miniatyura (rassomlik)", ["Musiqa", "Me'morchilik", "Xattotlik"], "Behzod Hirotda ijod qilgan."],
    [3, "Abu Nasr Forobiy qanday faxriy nom bilan ulug'langan?", "Ikkinchi muallim", ["Shayx ur-rais", "Sohibqiron", "Birinchi muallim"], "\"Birinchi muallim\" deb Arastu (Aristotel) atalgan."],
    [3, "Ibn Sino qanday faxriy nom bilan ulug'langan?", "Shayx ur-rais", ["Ikkinchi muallim", "Sohibqiron", "Birinchi muallim"], "\"Shayx ur-rais\" — \"olimlar boshlig'i\" degani."],
    [3, "Amir Temur qanday faxriy unvon bilan atalgan?", "Sohibqiron", ["Birinchi muallim", "Shayx ur-rais", "Ikkinchi muallim"], "\"Sohibqiron\" — baxtli yulduzlar ostida tug'ilgan degani."],
    [3, "Ibn Sino qaysi qishloqda tug'ilgan?", "Afshona", ["Kat", "Xartang", "Vobkent"], "Afshona Buxoro yaqinida joylashgan."],
    [3, "Beruniy qayerda tug'ilgan?", "Kat (Xorazm)", ["Afshona (Buxoro)", "Hirot", "Termiz"], "Beruniy 973-yilda Xorazmning Kat shahrida tug'ilgan."],
    [3, "Al-Xorazmiy qaysi ilmiy markazda faoliyat yuritgan?", "Bag'doddagi \"Bayt ul-hikma\"", ["Samarqand rasadxonasi", "Ulug'bek madrasasi", "Qohira universiteti"], "\"Bayt ul-hikma\" — \"Donishmandlik uyi\"."],
    [3, "Ali Qushchi kimning shogirdi va safdoshi bo'lgan?", "Mirzo Ulug'bek", ["Alisher Navoiy", "Ibn Sino", "Bobur"], "Ali Qushchi Ulug'bek rasadxonasida ishlagan astronom."],
    [3, "Cho'lponning asl ismi nima?", "Abdulhamid", ["Abdulla", "Muso", "Zokirjon"], "Abdulhamid Sulaymon o'g'li Cho'lpon."],
    [3, "Oybekning asl ismi nima?", "Muso Toshmuhammad o'g'li", ["Abdulhamid Sulaymon o'g'li", "Zokirjon Xolmuhammad o'g'li", "Abdulla Qodiriy"], "Oybek — \"Navoiy\" va \"Qutlug' qon\" romanlari muallifi."],
    [3, "Birinchi o'zbek dramasi \"Padarkush\" muallifi kim?", "Mahmudxo'ja Behbudiy", ["Abdulla Avloniy", "Hamza", "Fitrat"], "\"Padarkush\" XX asr boshida yozilgan."],
    [3, "Navoiyning \"Muhokamat ul-lug'atayn\" asari qaysi yili yozilgan?", "1499", ["1469", "1483", "1501"], "Navoiy bu asarni umrining oxirlarida yozgan."],
    [3, "Yusuf Xos Hojib \"Qutadg'u bilig\" asarini qaysi asrda yozgan?", "XI asr", ["IX asr", "XIII asr", "XV asr"], "Asar 1069–1070-yillarda yozilgan."],
    [1, "Navoiy \"Xamsa\" asarini qaysi tilda yozgan?", "Turkiy tilda", ["Fors tilida", "Arab tilida", "Lotin tilida"], "Navoiy turkiy tilda ham buyuk asarlar yaratish mumkinligini isbotlagan."],
    [1, "\"O'tkan kunlar\" romanining bosh qahramonlari kimlar?", "Otabek va Kumush", ["Anvar va Ra'no", "Yo'lchi va Gulnor", "Farhod va Shirin"], "Roman muallifi — Abdulla Qodiriy."],
    [1, "Alisher Navoiy qaysi asrda yashagan?", "XV asr", ["XIII asr", "XVII asr", "XI asr"], "Navoiy 1441–1501-yillarda yashagan."],
    [1, "Imom al-Buxoriyning \"Al-Jome' as-sahih\" asari nima haqida?", "Hadislar to'plami", ["Tibbiyot darsligi", "Yulduzlar jadvali", "She'rlar devoni"], "Asar hadislarning eng ishonchli to'plamlaridan biri hisoblanadi."],
    [1, "Ibn Sinoning \"Tib qonunlari\" asari qaysi sohaga oid?", "Tibbiyot", ["Astronomiya", "Tilshunoslik", "Tarix"], "Asar besh kitobdan iborat."],
    [1, "Mirzo Ulug'bek kimning nevarasi bo'lgan?", "Amir Temurning", ["Boburning", "Alisher Navoiyning", "Ismoil Somoniyning"], "Ulug'bek — Shohrux Mirzoning o'g'li, Amir Temurning nevarasi."],
    [1, "Alisher Navoiy turkiy tilda yozgan she'rlarida qaysi taxallusni qo'llagan?", "Navoiy", ["Foniy", "Furqat", "Mashrab"], "Forsiy she'rlarida esa \"Foniy\" taxallusini qo'llagan."],
    [1, "Zahiriddin Muhammad Bobur Hindistonda qaysi davlatga asos solgan?", "Boburiylar davlatiga", ["Temuriylar davlatiga", "Somoniylar davlatiga", "Qo'qon xonligiga"], "Boburiylar davlati 1526-yilda tashkil topgan."],
    [1, "Mirzo Ulug'bekning \"Ziji jadidi Ko'ragoniy\" asari nima?", "Yulduzlar jadvali", ["She'rlar to'plami", "Tarixiy roman", "Tibbiy qomus"], "Ziji 1018 ta yulduzning o'rnini o'z ichiga oladi."],
    [2, "\"Mehrobdan chayon\" romanining bosh qahramonlari kimlar?", "Anvar va Ra'no", ["Otabek va Kumush", "Yo'lchi va Gulnor", "Layli va Majnun"], "Roman muallifi — Abdulla Qodiriy."],
    [2, "Ibn Sino asarlarini asosan qaysi tilda yozgan?", "Arab tilida", ["Turkiy tilda", "Lotin tilida", "Yunon tilida"], "O'sha davrda ilmiy asarlar asosan arab tilida yozilgan."],
    [2, "\"Boburnoma\" qanday asar?", "Esdalik (memuar) asar", ["She'riy doston", "Tibbiy kitob", "Lug'at"], "Bobur unda o'z hayoti va davri voqealarini yozgan."],
    [2, "\"Shum bola\" asari qanday janrda yozilgan?", "Qissa", ["Doston", "Roman-epopeya", "G'azal"], "Muallifi — G'afur G'ulom."],
    [2, "Al-Xorazmiy qaysi asrda yashagan?", "IX asr", ["XI asr", "VII asr", "XIII asr"], "Al-Xorazmiy taxminan 783–850-yillarda yashagan."],
    [2, "Abu Ali ibn Sino yashagan yillar qaysi?", "980–1037", ["973–1048", "1441–1501", "783–850"], "Ibn Sino Buxoro yaqinidagi Afshonada tug'ilgan."],
    [2, "Abu Rayhon Beruniy yashagan yillar qaysi?", "973–1048", ["980–1037", "1394–1449", "783–850"], "Beruniy Xorazmning Kat shahrida tug'ilgan."],
    [2, "Ibn Sinoning \"Tib qonunlari\" necha kitobdan iborat?", "5", ["3", "7", "10"], "Asar asrlar davomida Yevropada tibbiyot darsligi bo'lgan."],
    [2, "Alisher Navoiy qayerda dafn etilgan?", "Hirotda", ["Samarqandda", "Buxoroda", "Toshkentda"], "Navoiy 1501-yilda Hirotda vafot etgan."],
    [2, "Imom al-Buxoriy maqbarasi qayerda joylashgan?", "Samarqand viloyatida", ["Buxoro shahrida", "Toshkentda", "Termizda"], "Maqbara Samarqand yaqinidagi Xartang qishlog'ida."],
    [2, "Al-Xorazmiy asarlari orqali Yevropaga qaysi raqamlar tarqalgan?", "Hind-arab raqamlari", ["Rim raqamlari", "Yunon harfli raqamlar", "Xitoy ieroglif raqamlari"], "Bugun biz ishlatadigan 0–9 raqamlari shulardir."],
    [3, "Mirzo Ulug'bek yulduzlar jadvalida nechta yulduz o'rni ko'rsatilgan?", "1018", ["1000", "1440", "2018"], "\"Ziji jadidi Ko'ragoniy\" Yevropada ham mashhur bo'lgan."],
    [3, "Mirzo Ulug'bek madrasalari qaysi shaharlarda qurilgan?", "Samarqand, Buxoro, G'ijduvon", ["Samarqand, Xiva, Toshkent", "Hirot, Buxoro, Termiz", "Toshkent, Qo'qon, Andijon"], "Buxorodagi madrasa peshtoqida \"Ilm olish har bir musulmon uchun farzdir\" deb yozilgan."],
    [3, "Bobur qayerda dafn etilgan?", "Kobulda", ["Agrada", "Andijonda", "Samarqandda"], "Boburning vasiyatiga ko'ra xoki Kobulga keltirilgan."],
    [3, "Ibn Sino qaysi shaharda vafot etgan?", "Hamadonda", ["Buxoroda", "Xorazmda", "Bag'dodda"], "Ibn Sino 1037-yilda Hamadonda vafot etgan."],
    [3, "Beruniy umrining oxirida qaysi shaharda yashagan va vafot etgan?", "G'aznada", ["Kotda", "Buxoroda", "Hamadonda"], "Beruniy 1048-yilda G'aznada vafot etgan."],
    [3, "\"Qutlug' qon\" romanining bosh qahramoni kim?", "Yo'lchi", ["Otabek", "Anvar", "Zebi"], "Roman muallifi — Oybek."],
    [3, "\"Kecha va kunduz\" romanining bosh qahramoni kim?", "Zebi", ["Kumush", "Ra'no", "Gulnor"], "Roman muallifi — Cho'lpon."],
    [1,"Beruniyning «Hindiston» asari qaysi mamlakat haqida yozilgan?","Hindiston",["Xitoy","Eron","Misr"],"Beruniy Hindistonning tabiati, ilmi va urf-odatlarini bu asarda batafsil tasvirlagan."],
    [1,"«Oygul bilan Baxtiyor» dostoni muallifi kim?","Hamid Olimjon",["Oybek","G'afur G'ulom","Cho'lpon"],"Hamid Olimjon bu dostonni xalq ertagi asosida yozgan."],
    [1,"«Navoiy» romanining muallifi kim?","Oybek",["Abdulla Qodiriy","Abdulla Qahhor","Hamid Olimjon"],"Oybek alloma shoir Alisher Navoiy hayotiga bag'ishlab roman yozgan."],
    [1,"«Shum bola» qissasining muallifi kim?","G'afur G'ulom",["Abdulla Qahhor","Oybek","Said Ahmad"],"Qissa G'afur G'ulomning mashhur nasriy asaridir."],
    [1,"Zahiriddin Muhammad Bobur qaysi shaharda tug'ilgan?","Andijonda",["Samarqandda","Buxoroda","Hirotda"],"Bobur 1483-yilda Andijonda tug'ilgan."],
    [1,"Mirzo Ulug'bek rasadxonasi qaysi shaharda qurilgan?","Samarqandda",["Buxoroda","Xivada","Toshkentda"],"Rasadxona XV asrning 20-yillarida Samarqandda barpo etilgan."],
    [1,"«Alpomish» qanday asar hisoblanadi?","Xalq dostoni",["Tarixiy roman","Hajviy qissa","Ilmiy risola"],"«Alpomish» o'zbek xalqining qahramonlik dostonidir."],
    [1,"«Turkiy Guliston yohud axloq» kitobining muallifi kim?","Abdulla Avloniy",["Abdulla Qodiriy","Hamza Hakimzoda Niyoziy","Furqat"],"Avloniy bu kitobni maktab o'quvchilari uchun axloq darsligi sifatida yozgan."],
    [1,"«Boy ila xizmatchi» dramasining muallifi kim?","Hamza Hakimzoda Niyoziy",["Mahmudxo'ja Behbudiy","Cho'lpon","Abdulla Qahhor"],"Hamza bu pyesani 1918-yilda yozgan."],
    [1,"«Sinchalak» qissasining muallifi kim?","Abdulla Qahhor",["G'afur G'ulom","Oybek","Hamid Olimjon"],"«Sinchalak» Abdulla Qahhorning mashhur asarlaridan biridir."],
    [1,"Navoiyning «Saddi Iskandariy» dostoni kim haqida?","Iskandar haqida",["Farhod haqida","Majnun haqida","Bahrom haqida"],"Doston Iskandar (Aleksandr Makedonskiy)ning hayoti va sarguzashtlariga bag'ishlangan."],
    [1,"«Devoni hikmat» asarining muallifi kim?","Ahmad Yassaviy",["Yusuf Xos Hojib","Mahmud Koshg'ariy","Alisher Navoiy"],"Ahmad Yassaviy hikmatlari turkiy tilda yozilgan."],
    [1,"«Sen yetim emassan» she'rining muallifi kim?","G'afur G'ulom",["Hamid Olimjon","Zulfiya","Abdulla Oripov"],"She'r urush yillarida yaratilgan va G'afur G'ulom qalamiga mansub."],
    [2,"«Algebra» atamasi qaysi so'zdan kelib chiqqan?","Al-jabr",["Al-muqobala","Al-hisob","Al-zij"],"Atama al-Xorazmiyning «Al-jabr val-muqobala» asari nomidan olingan."],
    [2,"Navoiyning «Majolis un-nafois» asari qanday asar?","Shoirlar haqidagi tazkira",["Tarixiy doston","Lug'at","Axloqiy roman"],"Asarda Navoiy zamondosh shoirlari haqida ma'lumot bergan."],
    [2,"«Lison ut-tayr» so'zma-so'z nimani anglatadi?","Qushlar tili",["Yetti sayyora","Abrorlar hayrati","Ikki til muhokamasi"],"Arabcha «lison» — til, «tayr» — qush ma'nosini bildiradi."],
    [2,"«Boburnoma» qaysi tilda yozilgan?","Turkiy tilda",["Arab tilida","Fors tilida","Hind tilida"],"Bobur xotiralarini o'z ona tilida, ya'ni turkiy tilda yozgan."],
    [2,"Alisher Navoiy qaysi hukmdor saroyida xizmat qilgan?","Husayn Boyqaro",["Shohrux","Abulxayrxon","Mirzo Ulug'bek"],"Navoiy Husayn Boyqaro davrida Hirotda yuqori lavozimlarda ishlagan."],
    [2,"«Fozil odamlar shahri» asarining muallifi kim?","Abu Nasr Forobiy",["Abu Ali ibn Sino","Abu Rayhon Beruniy","Al-Xorazmiy"],"Forobiy bu asarda ideal jamiyat haqidagi qarashlarini bayon etgan."],
    [2,"Ahmad Yassaviy maqbarasi qaysi shaharda joylashgan?","Turkistonda",["Samarqandda","Xivada","Buxoroda"],"Maqbara Turkiston shahrida Amir Temur davrida qurilgan."],
    [2,"Mirzo Ulug'bek Samarqandda qurdirgan madrasa qaysi mashhur maydonda joylashgan?","Registon maydonida",["Chorsu maydonida","Mustaqillik maydonida","Ko'kaldosh maydonida"],"Ulug'bek madrasasi Registon ansamblining eng qadimgi binosidir."],
    [2,"Beruniyning «Qonuni Mas'udiy» asari qaysi fanga oid?","Astronomiyaga",["Tibbiyotga","Tilshunoslikka","Adabiyotga"],"Asarda yulduzlar va osmon jismlari haqida ma'lumotlar jamlangan."],
    [2,"Hamza Hakimzoda Niyoziy qaysi shaharda tug'ilgan?","Qo'qonda",["Toshkentda","Samarqandda","Xivada"],"Hamza 1889-yilda Qo'qonda tug'ilgan."],
    [2,"Shoira Nodira qaysi Qo'qon xonining rafiqasi bo'lgan?","Umarxonning",["Alimxonning","Sheralixonning","Norbo'tabiyning"],"Nodira Umarxonning rafiqasi va o'sha davrning taniqli shoirasi bo'lgan."],
    [2,"«Obid ketmon» asarining muallifi kim?","Abdulla Qodiriy",["Abdulla Qahhor","Cho'lpon","Oybek"],"«Obid ketmon» Abdulla Qodiriyning qissasidir."],
    [2,"Beruniyning «Osor ul-boqiya» asari asosan nima haqida?","Qadimgi xalqlar taqvimi va bayramlari",["Dorivor o'simliklar","Hind falsafasi","Yulduzlar jadvali"],"Asarda turli xalqlarning yil hisobi va bayramlari tavsiflangan."],
    [3,"Ulug'bek rasadxonasi qoldiqlarini 1908-yilda kim topgan?","Vasiliy Vyatkin",["Mixail Gerasimov","Aleksandr Vamberi","Nikolay Xanikov"],"Arxeolog V. Vyatkin rasadxona poydevorini Obi-Rahmat tepaligida topgan."],
    [3,"Mirzo Ulug'bek qaysi yilda vafot etgan?","1449-yilda",["1405-yilda","1437-yilda","1500-yilda"],"Ulug'bek 1449-yilda Samarqand yaqinida halok bo'lgan."],
    [3,"Hamza Hakimzoda Niyoziy qaysi joyda halok bo'lgan?","Shohimardonda",["Qo'qonda","Marg'ilonda","Toshkentda"],"Hamza 1929-yilda Shohimardon qishlog'ida vafot etgan."],
    [3,"«Hind sayyohi» asarining muallifi kim?","Abdurauf Fitrat",["Mahmudxo'ja Behbudiy","Abdulla Avloniy","Munavvar qori"],"Fitrat bu asarni 1912-yilda yozgan."],
    [3,"Mahmudxo'ja Behbudiy nashr etgan jurnal qaysi?","Oyna",["Sharq yulduzi","Guliston","Yoshlik"],"«Oyna» jurnali 1913–1915-yillarda Samarqandda chiqqan."],
    [3,"Beruniyning «Saydana» asari nima haqida?","Dorivor o'simliklar va dorilar",["Yulduzlar jadvali","Qadimgi taqvimlar","Geometriya qoidalari"],"«Saydana» dorishunoslikka oid yirik asardir."],
    [3,"Ibn Sinoning «Donishnoma» asari qaysi tilda yozilgan?","Fors-tojik tilida",["Arab tilida","Turkiy tilda","Lotin tilida"],"Ibn Sino asarlarining aksariyatini arabcha yozgan, «Donishnoma» esa forsiy tildadir."],
    [3,"Forobiy tug'ilgan Farob shahri keyinchalik qanday nom bilan mashhur bo'lgan?","Otrar",["Sabzavor","Termiz","Tarroz"],"Farob shahri keyingi asrlarda Otrar nomi bilan atalgan."],
    [3,"Al-Xorazmiyning «Surat al-arz» asari qaysi fanga oid?","Geografiyaga",["Tibbiyotga","Adabiyotga","Mantiqqa"],"Asarda shaharlar, daryolar va tog'larning koordinatalari keltirilgan."],
    [3,"Bobur aruz vaznidan qo'llanma sifatida qaysi asarini yozgan?","Aruz risolasi",["Mubayyin","Boburnoma","Xatti Boburiy"],"«Aruz risolasi» she'riy vaznlar haqidagi ilmiy asardir."],
    [3,"Navoiy «Xamsat ul-mutahayyirin» asarini qaysi ustozi haqida yozgan?","Abdurahmon Jomiy",["Sayyid Hasan Ardasher","Lutfiy","Kamoliddin Behzod"],"Asar Navoiyning ustozi Abdurahmon Jomiyning hayoti va ijodiga bag'ishlangan."],
    [3,"Navoiy «Sab'ai sayyor» dostonining nomi o'zbekchada nimani anglatadi?","Yetti sayyora",["Yetti go'zal","Yetti qo'shiq","Yetti saroy"],"Arabcha «sab'a» — yetti, «sayyor» — sayyora."],
    [3,"Mahmud Koshg'ariy «Devonu lug'otit turk» asarini qaysi shaharda yozgan?","Bag'dodda",["Samarqandda","Buxoroda","Qohirada"],"Asar Bag'dodda yozilib, Abbosiylar xalifasiga taqdim etilgan."],
    [3,"Alisher Navoiy «Xamsa»ni taxminan qaysi yillarda yaratgan?","1483–1485-yillarda",["1441–1445-yillarda","1490–1495-yillarda","1499–1501-yillarda"],"«Xamsa»ning besh dostoni 1483–1485-yillar oralig'ida yozilgan."]
  ];
  // [alloma, tug'ilgan joyi, daraja]
  var TUG = [["Al-Xorazmiy", "Xorazm", 1], ["Abu Rayhon Beruniy", "Xorazm", 1], ["Abu Ali ibn Sino", "Buxoro", 1], ["Imom al-Buxoriy", "Buxoro", 1], ["Alisher Navoiy", "Hirot", 1],
    ["Zahiriddin Muhammad Bobur", "Andijon", 1], ["Abdulla Qodiriy", "Toshkent", 1], ["Ahmad al-Farg'oniy", "Farg'ona", 2], ["Imom at-Termiziy", "Termiz", 2], ["Kamoliddin Behzod", "Hirot", 2],
    ["Ogahiy", "Xorazm", 2], ["Muqimiy", "Qo'qon", 2], ["Furqat", "Qo'qon", 2], ["Cho'lpon", "Andijon", 2], ["G'afur G'ulom", "Toshkent", 2], ["Hamid Olimjon", "Jizzax", 2],
    ["Ali Qushchi", "Samarqand", 3], ["Mahmudxo'ja Behbudiy", "Samarqand", 3], ["Hamza Hakimzoda Niyoziy", "Qo'qon", 3], ["Oybek", "Toshkent", 3], ["Abdulla Qahhor", "Qo'qon", 3],
    ["Boborahim Mashrab", "Namangan", 3], ["Abdulla Avloniy", "Toshkent", 3], ["Abdulla Oripov", "Qashqadaryo", 3], ["Erkin Vohidov", "Farg'ona", 3]];
  var TUG_X = { "Farg'ona": ["Qo'qon"], "Qo'qon": ["Farg'ona"] };
  function genTug(L) {
    var t = pick(lvList(TUG, L, 2)), ex = [t[1]].concat(TUG_X[t[1]] || []), st = [t[0] + " " + t[1] + "da tug'ilgan."];
    var places = []; TUG.forEach(function (x) { if (places.indexOf(x[1]) < 0) places.push(x[1]); });
    if (Math.random() < 0.6) return Q("<b>" + t[0] + "</b> qayerda tug'ilgan?", t[1], otherN(places, ex, 4), st);
    return Q("Quyidagilardan kim <b>" + t[1] + "</b>da tug'ilgan?", t[0], otherN(TUG.filter(function (x) { return ex.indexOf(x[1]) < 0; }).map(function (x) { return x[0]; }), [], 4), st);
  }
  // [alloma, asosiy sohasi, aniq tegishli bo'lmagan sohalar, daraja]
  var SOHA = [
    ["Al-Xorazmiy", "Matematika", ["Tibbiyot", "Hadisshunoslik", "Miniatyura", "She'riyat", "Tilshunoslik"], 1],
    ["Abu Ali ibn Sino", "Tibbiyot", ["Hadisshunoslik", "Miniatyura", "Me'morchilik"], 1],
    ["Mirzo Ulug'bek", "Astronomiya", ["Tibbiyot", "Hadisshunoslik", "Miniatyura", "Me'morchilik", "Tilshunoslik"], 1],
    ["Imom al-Buxoriy", "Hadisshunoslik", ["Tibbiyot", "Astronomiya", "Matematika", "Miniatyura", "She'riyat", "Falsafa"], 1],
    ["Alisher Navoiy", "She'riyat", ["Tibbiyot", "Astronomiya", "Matematika", "Miniatyura"], 1],
    ["Ahmad al-Farg'oniy", "Astronomiya", ["Tibbiyot", "Hadisshunoslik", "Miniatyura", "She'riyat", "Tilshunoslik"], 2],
    ["Mahmud Koshg'ariy", "Tilshunoslik", ["Tibbiyot", "Astronomiya", "Matematika", "Miniatyura", "Falsafa"], 2],
    ["Imom at-Termiziy", "Hadisshunoslik", ["Tibbiyot", "Astronomiya", "Matematika", "Miniatyura", "She'riyat", "Falsafa"], 2],
    ["Kamoliddin Behzod", "Miniatyura", ["Tibbiyot", "Astronomiya", "Matematika", "Hadisshunoslik", "She'riyat", "Falsafa", "Tilshunoslik"], 2],
    ["Ali Qushchi", "Astronomiya", ["Tibbiyot", "Hadisshunoslik", "Miniatyura", "Me'morchilik"], 3],
    ["Abu Nasr Forobiy", "Falsafa", ["Hadisshunoslik", "Miniatyura", "Me'morchilik"], 3]];
  function genSoha(L) {
    var s = pick(lvList(SOHA, L, 3)), st = [s[0] + " — " + s[1].toLowerCase() + " sohasida mashhur."];
    if (Math.random() < 0.55) return Q("<b>" + s[0] + "</b> qaysi soha bilan mashhur?", s[1], otherN(s[2], [], 4), st);
    return Q("Qaysi alloma <b>" + s[1].toLowerCase() + "</b> sohasida mashhur bo'lgan?", s[0], otherN(SOHA.filter(function (x) { return x[2].indexOf(s[1]) > -1; }).map(function (x) { return x[0]; }), [], 4), st);
  }
  // [taxallus, asl ismi]
  var TAX = [["Cho'lpon", "Abdulhamid Sulaymon o'g'li"], ["Oybek", "Muso Toshmuhammad o'g'li"], ["Furqat", "Zokirjon Xolmuhammad o'g'li"], ["Muqimiy", "Muhammad Aminxo'ja"],
    ["Ogahiy", "Muhammad Rizo Erniyozbek o'g'li"], ["Mashrab", "Boborahim"], ["Uvaysiy", "Jahon otin"], ["Nodira", "Mohlaroyim"], ["Fitrat", "Abdurauf"], ["Navoiy", "Nizomiddin Mir Alisher"]];
  function genTax() {
    var t = pick(TAX), st = [t[1] + " — " + t[0] + " taxallusi bilan ijod qilgan."];
    if (Math.random() < 0.5) return Q("<b>" + t[0] + "</b> taxallusi bilan ijod qilgan adibning asl ismi nima?", t[1], otherN(TAX.map(function (x) { return x[1]; }), [t[1]], 4), st);
    return Q("<b>" + t[1] + "</b> qaysi taxallus bilan ijod qilgan?", t[0], otherN(TAX.map(function (x) { return x[0]; }), [t[0]], 4), st);
  }
  topic("h2", "Tarix · Buyuk allomalar va ularning asarlari", H2, [{ p: 0.3, fn: genAsar }, { p: 0.14, fn: genTug }, { p: 0.12, fn: genSoha }, { p: 0.08, fn: function (L) { return L === 1 ? null : genTax(); } }]);

  /* ================= h3 Tarix · Jahon tarixi ================= */
  function rim(n) {
    var v = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], out = "";
    for (var i = 0; i < v.length; i++) while (n >= v[i][0]) { out += v[i][1]; n -= v[i][0]; }
    return out;
  }
  function genAsr(L) {
    var y = L === 1 ? R(2, 20) * 100 - R(1, 98) : R(101, 2025), c = Math.ceil(y / 100);
    if (L === 3 && Math.random() < 0.5) { c = R(5, 20); y = c * 100; }
    if (L >= 2 && Math.random() < 0.35) {
      var c2 = R(3, 20), lo = (c2 - 1) * 100 + 1, hi = c2 * 100;
      return Q("<b>" + rim(c2) + " asr</b> qaysi yillarni o'z ichiga oladi?", lo + "–" + hi, [(lo - 1) + "–" + (hi - 1), (lo + 100) + "–" + (hi + 100), (lo - 100) + "–" + (hi - 100), (lo - 1) + "–" + hi],
        [rim(c2) + " asr: " + lo + "-yildan " + hi + "-yilgacha."]);
    }
    var w = [c - 1, c + 1, c - 2, c - 3, c + 2].filter(function (x) { return x > 0 && x <= Math.max(21, c + 1); }).map(function (x) { return rim(x) + " asr"; });
    return Q("<b>" + y + "</b>-yil qaysi asrga to'g'ri keladi?", rim(c) + " asr", w,
      [y % 100 === 0 ? y + "-yil — " + rim(c) + " asrning oxirgi yili." : "Yuzliklar soni + 1: " + Math.floor(y / 100) + " + 1 = " + c + " → " + rim(c) + " asr."]);
  }
  var H3 = [
    [1, "Xristofor Kolumb Amerikaga qaysi yili yetib borgan?", "1492", ["1498", "1519", "1453", "1501"], "Kolumb Ispaniya qiroli xizmatida g'arbga suzgan."],
    [1, "Insoniyat tarixidagi birinchi kosmonavt kim?", "Yuriy Gagarin", ["Nil Armstrong", "German Titov", "Aleksey Leonov"], "Gagarin 1961-yil 12-aprelda koinotga uchgan."],
    [1, "Inson birinchi marta koinotga qaysi yili uchgan?", "1961", ["1957", "1969", "1965", "1959"], "1961-yil 12-aprel — Yuriy Gagarin parvozi."],
    [1, "Oyga birinchi bo'lib qadam qo'ygan inson kim?", "Nil Armstrong", ["Yuriy Gagarin", "Bazz Oldrin", "Aleksey Leonov"], "Armstrong 1969-yilda \"Apollon-11\" ekspeditsiyasida Oyga tushgan."],
    [1, "Inson birinchi marta Oyga qaysi yili qadam qo'ygan?", "1969", ["1961", "1972", "1965", "1957"], "1969-yil iyulda \"Apollon-11\" Oyga qo'ngan."],
    [1, "Ikkinchi jahon urushi qaysi yillarda bo'lgan?", "1939–1945", ["1914–1918", "1941–1944", "1937–1943", "1945–1950"], "Urush 1939-yil 1-sentabrda boshlangan."],
    [1, "Birinchi jahon urushi qaysi yillarda bo'lgan?", "1914–1918", ["1939–1945", "1905–1910", "1912–1916", "1918–1922"], "Urush 1918-yil noyabrda tugagan."],
    [1, "Misr piramidalarini qadimda qaysi xalq qurgan?", "Qadimgi misrliklar", ["Qadimgi rimliklar", "Qadimgi yunonlar", "Mayyalar"], "Eng mashhurlari — Gizadagi piramidalar."],
    [1, "Telefonni kim ixtiro qilgan?", "Aleksandr Bell", ["Tomas Edison", "Aka-uka Raytlar", "Isaak Nyuton"], "Bell telefonga 1876-yilda patent olgan."],
    [1, "Birinchi boshqariladigan motorli samolyotni kimlar uchirgan?", "Aka-uka Raytlar", ["Aka-uka Lyumerlar", "Aleksandr Bell", "Tomas Edison"], "Raytlar 1903-yilda birinchi parvozni amalga oshirgan."],
    [1, "Cho'g'lanma lampani takomillashtirib, keng tarqatgan ixtirochi kim?", "Tomas Edison", ["Aleksandr Bell", "Isaak Nyuton", "Aka-uka Raytlar"], "Edison 1879-yilda uzoq yonadigan lampa yaratgan."],
    [1, "Butunjahon tortishish qonunini kim kashf etgan?", "Isaak Nyuton", ["Galileo Galiley", "Albert Eynshteyn", "Tomas Edison"], "Nyuton qonuni XVII asrda e'lon qilingan."],
    [1, "BMT (Birlashgan Millatlar Tashkiloti) qaysi yili tashkil topgan?", "1945", ["1939", "1948", "1919", "1991"], "BMT Ikkinchi jahon urushidan keyin tashkil topgan."],
    [1, "Qadimgi Misr hukmdorlari qanday atalgan?", "Fir'avn", ["Imperator", "Xon", "Sulton"], "Fir'avnlar uchun piramidalar qurilgan."],
    [2, "Aka-uka Raytlar birinchi samolyotni qaysi yili uchirgan?", "1903", ["1899", "1910", "1908", "1913"], "Parvoz 1903-yil dekabrda AQShda bo'lgan."],
    [2, "Fransuz inqilobi qaysi yili boshlangan?", "1789", ["1776", "1812", "1848", "1799"], "1789-yil 14-iyulda Bastiliya qamoqxonasi egallangan."],
    [2, "Sovet Ittifoqi qaysi yili parchalangan?", "1991", ["1989", "1990", "1992", "1993"], "1991-yil oxirida SSSR rasman tarqatib yuborilgan."],
    [2, "Magellan ekspeditsiyasi dunyo bo'ylab birinchi sayohatni qaysi yillarda amalga oshirgan?", "1519–1522", ["1492–1495", "1498–1502", "1577–1580", "1519–1525"], "Magellanning o'zi safar davomida halok bo'lgan."],
    [2, "Vasko da Gama Yevropadan Hindistonga dengiz yo'lini qaysi yili ochgan?", "1498", ["1492", "1519", "1488", "1453"], "U Afrikani aylanib o'tib, Hindistonga yetib borgan."],
    [2, "Kitob bosish dastgohini Yevropada kim ixtiro qilgan?", "Iogann Gutenberg", ["Tomas Edison", "Leonardo da Vinchi", "Isaak Nyuton"], "Gutenberg dastgohi XV asr o'rtalarida yaratilgan."],
    [2, "Gutenbergning bosma dastgohi qaysi asrda yaratilgan?", "XV asr", ["XIII asr", "XVII asr", "XIX asr"], "Taxminan 1440–1450-yillarda."],
    [2, "Birinchi sun'iy yo'ldosh qaysi yili uchirilgan?", "1957", ["1961", "1969", "1949", "1965"], "1957-yil 4-oktabrda SSSR birinchi sun'iy yo'ldoshni uchirgan."],
    [2, "Ochiq koinotga birinchi chiqqan inson kim?", "Aleksey Leonov", ["Yuriy Gagarin", "Nil Armstrong", "German Titov"], "Leonov 1965-yilda ochiq koinotga chiqqan."],
    [2, "Radioaktivlik sohasidagi tadqiqotlari uchun ikki marta Nobel mukofoti olgan olima kim?", "Mariya Kyuri", ["Ada Lavleys", "Valentina Tereshkova", "Florens Naytingeyl"], "Mariya Kyuri fizika (1903) va kimyo (1911) bo'yicha Nobel mukofoti olgan."],
    [2, "Koinotga uchgan birinchi ayol kim?", "Valentina Tereshkova", ["Mariya Kyuri", "Svetlana Savitskaya", "Salli Rayd"], "Tereshkova 1963-yilda koinotga uchgan."],
    [2, "Nisbiylik nazariyasini kim yaratgan?", "Albert Eynshteyn", ["Isaak Nyuton", "Nikola Tesla", "Mariya Kyuri"], "Eynshteyn XX asr boshida bu nazariyani ishlab chiqqan."],
    [2, "Elementlar davriy jadvalini kim yaratgan?", "Dmitriy Mendeleyev", ["Mariya Kyuri", "Isaak Nyuton", "Lui Paster"], "Mendeleyev davriy qonunni 1869-yilda kashf etgan."],
    [2, "Konstantinopolni Usmonlilar qaysi yili egallagan?", "1453", ["1492", "1402", "1517", "1389"], "Shundan so'ng shahar Istanbul nomi bilan Usmonli poytaxtiga aylangan."],
    [2, "Olimpiya o'yinlari qadimda qaysi mamlakatda boshlangan?", "Qadimgi Yunoniston", ["Qadimgi Rim", "Qadimgi Misr", "Qadimgi Xitoy"], "Zamonaviy Olimpiada o'yinlari 1896-yilda Afinada qayta tiklangan."],
    [2, "Zamonaviy Olimpiya o'yinlari qaysi yili qayta tiklangan?", "1896", ["1900", "1886", "1912", "1924"], "Birinchi zamonaviy Olimpiada Afinada o'tkazilgan."],
    [3, "G'arbiy Rim imperiyasi qaysi yili qulagan?", "476", ["395", "1453", "410", "527"], "476-yil an'anaviy ravishda Antik davrning oxiri hisoblanadi."],
    [3, "Rim imperiyasi qaysi yili G'arbiy va Sharqiy qismlarga bo'lingan?", "395", ["476", "330", "1054", "1453"], "Sharqiy Rim imperiyasi Vizantiya nomi bilan 1453-yilgacha yashagan."],
    [3, "Gizadagi Xeops (Xufu) piramidasi qaysi qadimgi davlatda qurilgan?", "Qadimgi Misr", ["Qadimgi Bobil", "Qadimgi Yunoniston", "Qadimgi Rim"], "Gizadagi piramidalar miloddan avvalgi III ming yillikda qurilgan."],
    [3, "\"Dunyoning yetti ajoyiboti\"dan bugungacha saqlanib qolgani qaysi?", "Xeops piramidasi", ["Rodos Kolossi", "Bobil osma bog'lari", "Iskandariya mayog'i"], "Qolgan ajoyibotlar vayron bo'lgan."],
    [3, "Amerika Qo'shma Shtatlari mustaqilligi qaysi yili e'lon qilingan?", "1776", ["1789", "1812", "1607", "1865"], "Mustaqillik Deklaratsiyasi 1776-yil 4-iyulda qabul qilingan."],
    [3, "Bug' mashinasini takomillashtirib, sanoat inqilobiga hissa qo'shgan ixtirochi kim?", "Jeyms Uatt", ["Tomas Edison", "Aleksandr Bell", "Nikola Tesla"], "Quvvat birligi \"vatt\" uning nomi bilan atalgan."],
    [3, "Sanoat inqilobi birinchi bo'lib qaysi mamlakatda boshlangan?", "Angliya", ["Fransiya", "Germaniya", "AQSH"], "Sanoat inqilobi XVIII asrning ikkinchi yarmida Angliyada boshlangan."],
    [3, "Berlin devori qaysi yili qulagan?", "1989", ["1991", "1985", "1961", "1990"], "1989-yil noyabrda devor buzilgan, 1990-yilda Germaniya birlashgan."],
    [3, "Germaniya qaysi yili birlashgan?", "1990", ["1989", "1991", "1945", "1971"], "Berlin devori 1989-yilda qulagan, birlashuv 1990-yilda bo'lgan."],
    [3, "Yevropa Ittifoqi qaysi shartnoma asosida tashkil topgan?", "Maastrixt shartnomasi", ["Versal shartnomasi", "Vestfaliya shartnomasi", "Tordesilyas shartnomasi"], "Maastrixt shartnomasi 1992-yilda imzolangan."],
    [3, "Birinchi jahon urushidan keyin 1919-yilda imzolangan tinchlik shartnomasi qaysi?", "Versal shartnomasi", ["Maastrixt shartnomasi", "Vestfaliya shartnomasi", "Parij shartnomasi (1856)"], "Versal shartnomasi Germaniya bilan tuzilgan."],
    [3, "Penitsillin qaysi yili kashf etilgan?", "1928", ["1918", "1945", "1938", "1908"], "Penitsillinni Aleksandr Fleming kashf etgan."],
    [3, "Qaysi ixtirochi o'zgaruvchan tok tizimlari bilan mashhur?", "Nikola Tesla", ["Tomas Edison", "Jeyms Uatt", "Aleksandr Bell"], "Magnit induksiya birligi \"tesla\" uning nomi bilan atalgan."],
    [3, "Pyotr I qaysi shaharga asos solgan?", "Sankt-Peterburg", ["Moskva", "Novgorod", "Kiyev"], "Sankt-Peterburg 1703-yilda asos solingan."],
    [1,"Qadimgi Yunonistonda demokratiya qaysi shahar-davlatda paydo bo'lgan?","Afinada",["Spartada","Korinfda","Fivada"],"Afinada fuqarolar xalq majlisida qarorlar qabul qilishda ishtirok etgan."],
    [1,"Iskandar Makedonskiy qaysi qadimgi davlatning shohi bo'lgan?","Makedoniya",["Sparta","Karfagen","Misr"],"Iskandar otasi Filipp vafotidan keyin Makedoniya taxtiga chiqqan."],
    [1,"Qog'oz qaysi qadimgi mamlakatda ixtiro qilingan?","Xitoyda",["Misrda","Yunonistonda","Hindistonda"],"Qog'oz ixtirosi qadimgi Xitoyda amalga oshgan."],
    [1,"Kolizey amfiteatri qaysi shaharda joylashgan?","Rimda",["Afinada","Parijda","Istanbulda"],"Kolizey qadimgi Rimda gladiator janglari uchun qurilgan."],
    [1,"Qadimgi misrliklar qo'llagan rasmli yozuv nima deb ataladi?","Ierogliflar",["Mixxat yozuvi","Lotin alifbosi","Runa yozuvi"],"Ierogliflar belgilar va rasmlardan iborat qadimgi Misr yozuvidir."],
    [1,"Qadimgi Rimliklar qaysi tilda so'zlashgan?","Lotin tilida",["Yunon tilida","Fors tilida","Qadimgi misr tilida"],"Rimliklarning asosiy tili lotin tili bo'lgan."],
    [1,"Vikinglar dastlab qaysi hududdan chiqqan dengizchi jangchilar edi?","Skandinaviyadan",["Arabistondan","Markaziy Osiyodan","Hindistondan"],"Vikinglar hozirgi Daniya, Norvegiya va Shvetsiya hududlaridan chiqqan."],
    [1,"Mayya tsivilizatsiyasi asosan qaysi hududda rivojlangan?","Markaziy Amerikada",["Shimoliy Afrikada","Markaziy Yevropada","Janubiy Osiyoda"],"Mayya shaharlari hozirgi Meksika, Gvatemala va Gonduras hududida bo'lgan."],
    [1,"Inklar davlati qaysi qit'ada joylashgan edi?","Janubiy Amerikada",["Afrikada","Avstraliyada","Yevropada"],"Inklar davlati And tog'larida, hozirgi Peru atrofida bo'lgan."],
    [1,"O'rta asrlarda Yevropada zirh kiyib, ot minib jang qilgan qurolli jangchilar qanday atalgan?","Ritsarlar",["Vikinglar","Gladiatorlar","Legionerlar"],"Ritsarlar o'rta asr Yevropasining zirhli otliq jangchilari bo'lgan."],
    [1,"Napoleon Bonapart qaysi mamlakatning imperatori bo'lgan?","Fransiyaning",["Angliyaning","Germaniyaning","Ispaniyaning"],"Napoleon 1804-yilda o'zini Fransiya imperatori deb e'lon qilgan."],
    [1,"AQShning birinchi prezidenti kim bo'lgan?","Jorj Vashington",["Avraam Linkoln","Tomas Jefferson","Benjamin Franklin"],"Vashington 1789-yilda AQShning birinchi prezidenti etib saylangan."],
    [1,"«Mona Liza» rasmining muallifi kim?","Leonardo da Vinchi",["Mikelanjelo","Rafael","Rembrandt"],"«Mona Liza»ni Uyg'onish davri rassomi Leonardo da Vinchi chizgan."],
    [1,"Mo'g'ul imperiyasining asoschisi kim?","Chingizxon",["Botuxon","Xubilayxon","Attila"],"Chingizxon mo'g'ul qabilalarini birlashtirib, buyuk imperiyaga asos solgan."],
    [1,"Ikkinchi jahon urushi 1939-yil 1-sentabrda qaysi davlatning Polshaga hujumi bilan boshlangan?","Germaniyaning",["Italiyaning","Yaponiyaning","Fransiyaning"],"Germaniya qo'shinlari 1939-yil 1-sentabrda Polshaga bostirib kirgan."],
    [1,"«Titanik» kemasi qaysi okeanda halokatga uchragan?","Atlantika okeanida",["Tinch okeanida","Hind okeanida","Shimoliy Muz okeanida"],"«Titanik» 1912-yilda Shimoliy Atlantikada muz tog'iga urilib cho'kkan."],
    [1,"Buyuk devor qaysi mamlakatda qurilgan?","Xitoyda",["Hindistonda","Yaponiyada","Mo'g'ulistonda"],"Buyuk Xitoy devori shimoldan hujumlardan himoyalanish uchun qurilgan."],
    [1,"Qadimgi Yunonistonning Afina bilan raqobatlashgan jangovar shahar-davlati qaysi?","Sparta",["Rim","Troya","Karfagen"],"Sparta harbiy tarbiyasi bilan mashhur bo'lgan va Afinaning asosiy raqibi edi."],
    [1,"Pompey shahri qaysi vulqonning otilishi natijasida kul ostida qolgan?","Vezuviy",["Etna","Fuji","Krakatau"],"Vezuviy otilishi qadimgi Pompey shahrini kul va tosh ostida ko'mib tashlagan."],
    [2,"Chechakka qarshi birinchi emni yaratgan ingliz shifokori kim?","Edvard Jenner",["Lui Paster","Robert Kox","Aleksandr Fleming"],"Jenner 1796-yilda chechakka qarshi emlash usulini sinab ko'rgan."],
    [2,"Charlz Darvinning «Turlarning kelib chiqishi» asari qaysi yili nashr etilgan?","1859",["1809","1879","1905"],"Darvinning bu asari 1859-yilda chop etilgan."],
    [2,"Birinchi jahon urushi qaysi shaharda Avstriya-Vengriya valiahdi o'ldirilishi bilan boshlangan?","Sarayevoda",["Berlinda","Venada","Parijda"],"Frans Ferdinand 1914-yil iyun oyida Sarayevoda o'ldirilgan."],
    [2,"Xirosima shahriga atom bombasi qaysi yili tashlangan?","1945",["1939","1942","1950"],"Xirosima 1945-yil 6-avgustda bombardimon qilingan."],
    [2,"Rimga qarshi Puni urushlarida jang qilgan Karfagen sarkardasi kim?","Gannibal",["Spartak","Leonid","Pirr"],"Gannibal Alp tog'laridan fillar bilan o'tib, Italiyaga hujum qilgan."],
    [2,"Buyuk Ipak yo'li Sharqiy Osiyoni qaysi dengiz bo'yi mintaqasi bilan bog'lagan?","O'rta yer dengizi bo'yi",["Boltiq bo'yi","Karib dengizi bo'yi","Qora dengiz bo'yi"],"Ipak yo'li Xitoydan O'rta yer dengizi sohillariga yetib borgan."],
    [2,"Uyg'onish davri (Renessans) qaysi mamlakatda boshlangan?","Italiyada",["Angliyada","Rossiyada","Ispaniyada"],"Renessans XIV asrda Italiya shaharlarida paydo bo'lgan."],
    [2,"Yuz yillik urushda Fransiya qo'shiniga qaysi qahramon qiz boshchilik qilgan?","Janna d'Ark",["Mariya Antuanetta","Yekaterina Medichi","Jozefina"],"Janna d'Ark Orlean shahrini ozod qilishda mashhur bo'lgan."],
    [2,"Quyosh sistemasining geliotsentrik tizimini asoslagan polshalik olim kim?","Nikolay Kopernik",["Galileo Galiley","Iogann Kepler","Tixo Brage"],"Kopernik Yer Quyosh atrofida aylanishini ilmiy asoslagan."],
    [2,"Teleskop orqali Yupiterning to'rtta yo'ldoshini kashf etgan italiyalik olim kim?","Galileo Galiley",["Nikolay Kopernik","Isaak Nyuton","Jordano Bruno"],"Galiley bu kashfiyotni 1610-yilda qilgan."],
    [2,"AQShda fuqarolar urushi (1861–1865) davrida prezident bo'lgan kim?","Avraam Linkoln",["Jorj Vashington","Tomas Jefferson","Endryu Jekson"],"Linkoln fuqarolar urushi davrida shimoliy shtatlarni boshqargan."],
    [2,"Hindistonning ingliz hukmronligiga qarshi zo'ravonliksiz kurash rahbari kim?","Mahatma Gandi",["Javoharlal Neru","Subxas Chandra Bose","Rabindranat Tagor"],"Gandi tinch yo'l bilan norozilik harakatiga boshchilik qilgan."],
    [2,"Xitoyga sayohat qilgan va sayohatnomasi bilan mashhur venetsiyalik savdogar kim?","Marko Polo",["Ibn Battuta","Vasko da Gama","Xristofor Kolumb"],"Marko Polo XIII asrda Xitoyga borib, o'z sayohatlari haqida yozgan."],
    [2,"Everest cho'qqisini 1953-yilda birinchi bo'lib zabt etganlar kimlar?","Edmund Xillari va Tenzing Norgay",["Rual Amundsen va Robert Skott","Reynxold Messner va Piter Xabeler","Jorj Mellori va Endryu Irvin"],"Xillari va Norgay 1953-yil 29-mayda cho'qqiga chiqqan."],
    [2,"Rimda mil. av. 73–71-yillarda bo'lgan qullar qo'zg'olonini kim boshqargan?","Spartak",["Gannibal","Sezar","Brut"],"Spartak sobiq gladiator bo'lib, qullar qo'zg'olonining yo'lboshchisi edi."],
    [2,"Qonunlar to'plami bilan mashhur Hammurapi qaysi qadimgi davlatning podshosi bo'lgan?","Bobilning",["Misrning","Ossuriyaning","Finikiyaning"],"Hammurapi qonunlari Bobil podshosi davrida toshga o'yib yozilgan."],
    [2,"Mixxat yozuvini qaysi qadimgi xalq yaratgan?","Shumerlar",["Misrliklar","Rimliklar","Yunonlar"],"Mixxat yozuvi Mesopotamiyada shumerlar tomonidan yaratilgan."],
    [2,"Iskandar Makedonskiyning ustozi bo'lgan yunon faylasufi kim?","Aristotel",["Sokrat","Aflotun","Gerodot"],"Aristotel yosh Iskandarga Filipp taklifi bilan dars bergan."],
    [2,"Telegraf uchun nuqta va tire alifbosini ishlab chiqqan amerikalik ixtirochi kim?","Samuel Morze",["Aleksandr Bell","Tomas Edison","Maykl Faradey"],"Morze alifbosi nuqta va tirelar birikmasiga asoslangan."],
    [3,"Yuliy Sezar qaysi yili o'ldirilgan?","Mil. av. 44-yil",["Mil. av. 100-yil","Mil. av. 27-yil","Milodiy 14-yil"],"Sezar mil. av. 44-yil 15-martda Rim senatida fitnachilar tomonidan o'ldirilgan."],
    [3,"Yunon-fors urushlaridagi Marafon jangi qaysi yilda bo'lgan?","Mil. av. 490-yil",["Mil. av. 330-yil","Mil. av. 431-yil","Mil. av. 146-yil"],"Marafon jangida afinaliklar fors qo'shiniga qarshi g'alaba qozongan."],
    [3,"Angliyada qirol hokimiyatini cheklagan «Buyuk erkinlik xartiyasi» (Magna Karta) qaysi yili imzolangan?","1215",["1066","1348","1485"],"Magna Karta 1215-yilda qirol Jon tomonidan imzolangan."],
    [3,"Amerika qit'asi nomi qaysi sayyoh ismidan olingan?","Amerigo Vespuchchi",["Xristofor Kolumb","Fernan Magellan","Jeyms Kuk"],"Qit'a nomi italiyalik sayyoh Amerigo Vespuchchi ismidan kelib chiqqan."],
    [3,"Napoleon qo'shini Vaterloo jangida qaysi yili mag'lubiyatga uchragan?","1815",["1805","1812","1821"],"Vaterloo jangi 1815-yil 18-iyunda bo'lgan."],
    [3,"Napoleon Rossiyaga qarshi qaysi yili yurish boshlagan?","1812",["1799","1805","1815"],"Napoleonning Rossiyaga yurishi 1812-yilda boshlangan."],
    [3,"Italiyani birlashtirish harakatida «Qizil ko'ylaklar» otryadiga boshchilik qilgan sarkarda kim?","Juzeppe Garibaldi",["Otto fon Bismark","Kamillo Kavur","Napoleon III"],"Garibaldi Italiyaning janubini birlashtirishda hal qiluvchi rol o'ynagan."],
    [3,"1871-yilda Germaniya imperiyasining tashkil topishida asosiy rol o'ynagan kansler kim?","Otto fon Bismark",["Vilgelm II","Fridrix Katta","Klemens Metternix"],"Bismark Germaniya davlatlarini Prussiya atrofida birlashtirgan."],
    [3,"Millatlar Ligasi (Millatlar Jamiyati) qaysi yili tashkil topgan?","1920",["1914","1933","1945"],"Millatlar Ligasi Birinchi jahon urushidan keyin 1920-yilda tuzilgan."],
    [3,"Stalingrad jangi qaysi yillarda bo'lib o'tgan?","1942–1943",["1939–1940","1941–1942","1944–1945"],"Stalingrad jangi 1942-yil yozida boshlanib, 1943-yil fevralida tugagan."],
    [3,"Ittifoqchi qo'shinlarning Normandiyaga desanti qaysi yili amalga oshirilgan?","1944",["1940","1942","1945"],"Normandiyaga desant 1944-yil 6-iyunda boshlangan."],
    [3,"Janubiy qutbga birinchi bo'lib yetib borgan sayyoh kim?","Rual Amundsen",["Robert Skott","Ernest Sheklton","Fridtyof Nansen"],"Amundsen boshchiligidagi guruh Janubiy qutbga 1911-yil dekabrida yetgan."],
    [3,"Suvaysh kanali qaysi yili ochilgan?","1869",["1814","1889","1914"],"Suvaysh kanali 1869-yilda ochilgan va O'rta yer hamda Qizil dengizlarni bog'lagan."],
    [3,"Versal saroyini qirol qarorgohiga aylantirgan Fransiya qiroli kim?","Lyudovik XIV",["Lyudovik XVI","Genrix IV","Frantsisk I"],"Lyudovik XIV hukmronligi davrida Versal Fransiya qirollarining asosiy qarorgohiga aylangan."],
    [3,"Normanlar Angliyani bosib olgan Gastings jangi qaysi yili bo'lgan?","1066",["1215","1337","911"],"Gastings jangida Normandiya gertsogi Vilgelm g'alaba qozongan."],
    [3,"Rentgen nurlarini qaysi yili Vilgelm Rentgen kashf etgan?","1895",["1859","1905","1920"],"Rentgen nurlarni 1895-yilda kashf etgan va 1901-yilda birinchi Nobel mukofotini olgan."],
    [3,"Yaponiyada 1868-yildan boshlangan va tezkor zamonaviylashuvga olib kelgan o'zgarishlar nima deb ataladi?","Meydzi tiklanishi",["Edo davri","Taysyo davri","Sengoku davri"],"Meydzi davrida imperator hokimiyati tiklanib, Yaponiya sanoat yo'lidan ketgan."],
    [3,"Qadimgi yunon tarixchisi Gerodot qanday laqab bilan mashhur?","Tarixning otasi",["Falsafaning otasi","Tibbiyotning otasi","Geometriyaning otasi"],"Gerodot «Tarix» asari tufayli «tarixning otasi» deb ataladi."]
  ];
  topic("h3", "Tarix · Jahon tarixi", H3, [{ p: 0.25, fn: function (L) { return L === 3 && Math.random() < 0.5 ? null : genAsr(L); } }]);

  /* ================= o1 Ona tili · Kelishiklar va qo'shimchalar ================= */
  var KEL = ["Bosh kelishik", "Qaratqich kelishigi", "Tushum kelishigi", "Jo'nalish kelishigi", "O'rin-payt kelishigi", "Chiqish kelishigi"];
  var KEL_SUF = ["qo'shimchasiz", "-ning", "-ni", "-ga", "-da", "-dan"];
  var KEL_SOR = ["kim? nima?", "kimning? nimaning?", "kimni? nimani?", "kimga? nimaga?", "kimda? nimada?", "kimdan? nimadan?"];
  var KEL_QAY = ["qayer?", "qayerning?", "qayerni?", "qayerga?", "qayerda?", "qayerdan?"];
  // undosh bilan tugaydigan (k, q, g, g' dan boshqa) so'zlar; egalik uchun ham xavfsizlari belgilangan
  var W_CONS = ["maktab", "kitob", "daftar", "stol", "gul", "qalam", "bozor", "non", "maydon", "dars", "devor", "do'st", "uy", "osmon", "bahor", "zavod", "avtobus", "shahar", "bekat"];
  var W_EG = ["maktab", "kitob", "daftar", "stol", "gul", "qalam", "non", "dars", "do'st", "uy", "devor", "bekat"];
  var W_VOW = ["olma", "ota", "ona", "bola", "xona", "ko'cha", "dala", "oila", "uka", "opa", "bobo", "buvi"];
  var W_K = ["eshik", "terak", "tilak", "yurak", "ko'ylak", "kurak", "o'rdak", "ertak", "kapalak", "bilak"];
  var W_Q = ["qishloq", "o'rtoq", "quloq", "tayoq", "qayiq", "buloq", "bayroq", "tuproq", "pichoq", "qoshiq", "chiroq"];
  function lastCh(w) { return w.charAt(w.length - 1); }
  function joForm(w) { var c = lastCh(w); return w + (c === "k" ? "ka" : c === "q" ? "qa" : "ga"); }
  function kelForm(w, i) { return i === 0 ? w : i === 1 ? w + "ning" : i === 2 ? w + "ni" : i === 3 ? joForm(w) : i === 4 ? w + "da" : w + "dan"; }
  function kelWord(L) {
    if (L === 1) return pick(Math.random() < 0.7 ? W_CONS : W_VOW);
    if (L === 2) return pick(Math.random() < 0.5 ? W_K.concat(W_Q) : W_CONS.concat(W_VOW));
    return pick(W_K.concat(W_Q, W_CONS));
  }
  function genKelForm(L) {
    var w = kelWord(L), c = lastCh(w), i = (c === "k" || c === "q") && Math.random() < 0.75 ? 3 : R(1, 5), a = kelForm(w, i);
    var wr = [1, 2, 3, 4, 5].filter(function (k) { return k !== i; }).map(function (k) { return kelForm(w, k); });
    if (i === 3) {
      if (c === "k") wr = [w + "ga", w + "qa"].concat(shuffle(wr).slice(0, 2));
      else if (c === "q") wr = [w + "ga", w + "ka"].concat(shuffle(wr).slice(0, 2));
      else wr = [w + "ka"].concat(shuffle(wr).slice(0, 3));
    }
    var note = i === 3 && c === "k" ? "k bilan tugagan so'zga -ka qo'shiladi." : i === 3 && c === "q" ? "q bilan tugagan so'zga -qa qo'shiladi." : KEL[i] + " qo'shimchasi: " + KEL_SUF[i] + ".";
    return Q("<b>" + w + "</b> so'zining <b>" + KEL[i].toLowerCase() + "</b>dagi shakli qaysi?", a, shuffle(wr).slice(0, 4), [w + " + " + a.slice(w.length) + " → " + a + ". " + note]);
  }
  function genKelName(L) {
    var w = pick(W_CONS.concat(W_VOW, L > 1 ? W_K.concat(W_Q) : [])), i = R(L === 3 ? 0 : 1, 5), f = kelForm(w, i);
    return Q("<b>" + f + "</b> so'zi qaysi kelishikda turibdi?", KEL[i], others(KEL, KEL[i], 4), [f + " — " + KEL_SOR[i] + " so'rog'iga javob beradi → " + KEL[i].toLowerCase() + "."]);
  }
  function genSoroq(L) {
    var i = R(L === 1 ? 1 : 0, 5), t = R(0, 2);
    if (t === 0) return Q("Qaysi kelishik <b>" + KEL_SOR[i] + "</b> so'rog'iga javob beradi?", KEL[i], others(KEL, KEL[i], 4), [KEL[i] + ": " + KEL_SOR[i] + " " + KEL_QAY[i]]);
    if (t === 1) return Q("Qaysi kelishik <b>" + KEL_QAY[i] + "</b> so'rog'iga javob beradi?", KEL[i], others(KEL, KEL[i], 4), [KEL[i] + ": " + KEL_SOR[i] + " " + KEL_QAY[i]]);
    if (i === 0) i = R(1, 5);
    if (Math.random() < 0.5) return Q("<b>" + KEL[i] + "</b>ning qo'shimchasi qaysi?", KEL_SUF[i], others(KEL_SUF.slice(1), KEL_SUF[i], 4), [KEL[i] + " " + KEL_SOR[i] + " so'rog'iga javob beradi."]);
    return Q("<b>" + KEL[i] + "</b> qaysi so'roqlarga javob beradi?", KEL_SOR[i], others(KEL_SOR, KEL_SOR[i], 4), [KEL[i] + " qo'shimchasi: " + KEL_SUF[i] + "."]);
  }
  var SHAXS = ["I shaxs birlik", "II shaxs birlik", "III shaxs birlik", "I shaxs ko'plik", "II shaxs ko'plik"];
  function egForm(w, s) {
    var v = /[aeiou]$/.test(w) && !/o'$/.test(w);
    return w + (v ? ["m", "ng", "si", "miz", "ngiz"][s] : ["im", "ing", "i", "imiz", "ingiz"][s]);
  }
  function genEgalik(L) {
    var w = pick(Math.random() < 0.5 ? W_EG : W_VOW), s = R(0, L === 1 ? 2 : 4), a = egForm(w, s);
    var v = /[aeiou]$/.test(w);
    var wr = [0, 1, 2, 3, 4].filter(function (k) { return k !== s; }).map(function (k) { return egForm(w, k); });
    var bad = v ? [w + ["im", "ing", "i", "imiz", "ingiz"][s]] : [w + ["m", "ng", "si", "miz", "ngiz"][s]];
    return Q("<b>" + w + "</b> so'ziga <b>" + SHAXS[s] + "</b> egalik qo'shimchasini qo'shing.", a, bad.concat(shuffle(wr).slice(0, 3)),
      [(v ? "Unli bilan tugagan so'zga: -m, -ng, -si, -miz, -ngiz." : "Undosh bilan tugagan so'zga: -im, -ing, -i, -imiz, -ingiz."), w + " → " + a + "."]);
  }
  var YAS = [
    ["-chi", ["ishchi", "sportchi", "ovchi", "baliqchi", "temirchi", "gulchi", "paxtachi"], "kasb yoki shug'ullanuvchi shaxsni bildiradi"],
    ["-dosh", ["sinfdosh", "vatandosh", "yo'ldosh", "sirdosh", "fikrdosh", "tengdosh"], "birgalikni, umumiylikni bildiradi"],
    ["-zor", ["olmazor", "gulzor", "paxtazor", "uzumzor", "bug'doyzor", "qamishzor"], "o'simlik ko'p o'sadigan joyni bildiradi"],
    ["-li", ["kuchli", "aqlli", "tuzli", "suvli", "odobli", "bilimli", "mazali"], "belgining borligini bildiradi"],
    ["-siz", ["kuchsiz", "aqlsiz", "tuzsiz", "suvsiz", "odobsiz", "bilimsiz", "mazasiz"], "belgining yo'qligini bildiradi"],
    ["-xona", ["kitobxona", "oshxona", "choyxona", "ishxona", "darsxona"], "joy, xona ma'nosini bildiradi"]
  ];
  function genYasash(L) {
    var gi = R(0, YAS.length - 1), g = YAS[gi], w = pick(g[1]);
    var oth = []; YAS.forEach(function (x, k) { if (k !== gi) oth.push(pick(x[1])); });
    if (Math.random() < 0.5) {
      return Q("<b>" + w + "</b> so'zidagi so'z yasovchi qo'shimchani toping.", g[0], others(YAS.map(function (x) { return x[0]; }), g[0], 4).concat(["-lar"]).slice(0, 4),
        [w + " = " + w.slice(0, w.length - g[0].length + 1) + " + " + g[0].slice(1) + " (" + g[2] + ")."]);
    }
    return Q("Qaysi so'z <b>" + g[0] + "</b> qo'shimchasi yordamida yasalgan?", w, shuffle(oth).slice(0, 4), [g[0] + " qo'shimchasi " + g[2] + ": " + g[1].slice(0, 3).join(", ") + "."]);
  }
  var O1 = [
    [1, "O'zbek tilida nechta kelishik bor?", "6", ["4", "5", "7", "8"], "Bosh, qaratqich, tushum, jo'nalish, o'rin-payt, chiqish."],
    [1, "Otlarning ko'plik qo'shimchasi qaysi?", "-lar", ["-ning", "-li", "-chi", "-dan"], "kitob + lar = kitoblar."],
    [1, "Qaysi kelishik maxsus qo'shimchaga ega emas?", "Bosh kelishik", ["Qaratqich kelishigi", "Tushum kelishigi", "Chiqish kelishigi"], "Bosh kelishikdagi so'z qo'shimchasiz bo'ladi: kitob, maktab."],
    [2, "Qaysi gapda so'z jo'nalish kelishigida kelgan?", "Biz maktabga bordik.", ["Biz maktabda o'qiymiz.", "Biz maktabdan qaytdik.", "Biz maktabni sevamiz."], "maktabga — qayerga? so'rog'iga javob beradi."],
    [2, "Qaysi gapda so'z chiqish kelishigida kelgan?", "Otam daladan qaytdi.", ["Otam dalada ishladi.", "Otam dalaga bordi.", "Otam dalani sug'ordi."], "daladan — qayerdan? so'rog'iga javob beradi."],
    [2, "Qaysi gapda so'z qaratqich kelishigida kelgan?", "Ukamning kitobi yangi.", ["Ukamga kitob berdim.", "Ukamdan kitob oldim.", "Ukamni maqtadim."], "ukamning — kimning? so'rog'iga javob beradi."],
    [3, "Qaysi so'z to'g'ri yozilgan?", "qishloqqa", ["qishloqga", "qishloqka", "qishlogga"], "q bilan tugagan so'zga jo'nalish kelishigida -qa qo'shiladi."],
    [3, "Qaysi so'z to'g'ri yozilgan?", "eshikka", ["eshikga", "eshikqa", "eshigga"], "k bilan tugagan so'zga jo'nalish kelishigida -ka qo'shiladi."],
    [3, "\"Kitobim\" so'zidagi -im qanday qo'shimcha?", "Egalik qo'shimchasi", ["Kelishik qo'shimchasi", "Ko'plik qo'shimchasi", "So'z yasovchi qo'shimcha"], "-im — I shaxs birlik egalik qo'shimchasi."],
    [1,"Jo'nalish kelishigining asosiy qo'shimchasi qaysi?","-ga",["-da","-dan","-ning"],"Jo'nalish kelishigi -ga qo'shimchasi orqali yasalib, yo'nalishni bildiradi."],
    [1,"Qaratqich kelishigining qo'shimchasi qaysi?","-ning",["-ni","-da","-dan"],"Qaratqich kelishigi -ning qo'shimchasi orqali yasalib, tegishlilikni bildiradi."],
    [1,"Tushum kelishigining qo'shimchasi qaysi?","-ni",["-ning","-ga","-dan"],"Tushum kelishigi -ni qo'shimchasi orqali yasalib, to'g'ri to'ldiruvchini ifodalaydi."],
    [1,"Chiqish kelishigining asosiy qo'shimchasi qaysi?","-dan",["-da","-ga","-ning"],"Chiqish kelishigi -dan qo'shimchasi orqali harakatning qayerdan boshlanganini bildiradi."],
    [1,"O'rin-payt kelishigining asosiy qo'shimchasi qaysi?","-da",["-dan","-ga","-ni"],"O'rin-payt kelishigi -da qo'shimchasi orqali yasalib, o'rin yoki paytni bildiradi."],
    [1,"«Kitob» so'zining ko'pligi qanday yoziladi?","kitoblar",["kitobning","kitobda","kitobni"],"Ko'plik -lar qo'shimchasi qo'shilishi bilan yasaladi: kitob + lar = kitoblar."],
    [1,"«Maktab» so'zini tushum kelishigiga qo'ying.","maktabni",["maktabga","maktabda","maktabdan"],"Tushum kelishigi -ni qo'shimchasi qo'shiladi: maktab + ni = maktabni."],
    [1,"«Bog'» so'zini jo'nalish kelishigiga qo'ying.","bog'ga",["bog'ni","bog'da","bog'dan"],"Jo'nalish kelishigi -ga qo'shimchasi qo'shiladi: bog' + ga = bog'ga."],
    [1,"«Uy» so'zini o'rin-payt kelishigiga qo'ying.","uyda",["uyni","uyga","uydan"],"O'rin-payt kelishigi -da qo'shimchasi qo'shiladi: uy + da = uyda."],
    [1,"«Shahar» so'zini chiqish kelishigiga qo'ying.","shahardan",["shaharda","shaharga","shaharni"],"Chiqish kelishigi -dan qo'shimchasi qo'shiladi: shahar + dan = shahardan."],
    [1,"«Daftar» so'zini qaratqich kelishigiga qo'ying.","daftarning",["daftarni","daftarda","daftardan"],"Qaratqich kelishigi -ning qo'shimchasi qo'shiladi: daftar + ning = daftarning."],
    [1,"Egalik qo'shimchasi qanday vazifani bajaradi?","Tegishlilikni bildiradi",["Ko'plikni bildiradi","Kelishikni bildiradi","Yangi so'z yasaydi"],"Egalik qo'shimchasi narsaning kimga tegishli ekanini bildiradi: kitobim — menga tegishli."],
    [1,"«Kitob» so'ziga birinchi shaxs birlik egalik qo'shimchasini qo'ying.","kitobim",["kitobning","kitoblar","kitobga"],"Birinchi shaxs birlik egalik qo'shimchasi -im: kitob + im = kitobim."],
    [1,"«O'quvchi» so'zini ko'plikka qo'ying.","o'quvchilar",["o'quvchining","o'quvchida","o'quvchiga"],"Ko'plik -lar qo'shimchasi qo'shiladi: o'quvchi + lar = o'quvchilar."],
    [1,"Kelishik qo'shimchalari asosan qaysi so'z turkumiga qo'shiladi?","Otga",["Fe'lga","Sifatga","Ravishga"],"Kelishik qo'shimchalari asosan otlarga va olmoshlarga qo'shiladi."],
    [1,"«Dars» so'zini jo'nalish kelishigiga qo'ying.","darsga",["darsni","darslari","darsda"],"Jo'nalish kelishigi -ga qo'shimchasi qo'shiladi: dars + ga = darsga."],
    [1,"«Tog'» so'zini ko'plikka qo'ying.","tog'lar",["tog'ning","tog'da","tog'ga"],"Ko'plik -lar qo'shimchasi qo'shiladi: tog' + lar = tog'lar."],
    [1,"Egalik qo'shimchalari necha shaxs uchun qo'llanadi?","3 ta",["2 ta","4 ta","6 ta"],"Egalik qo'shimchalari uch shaxs (men, sen, u) uchun birlik va ko'plikda bo'ladi."],
    [1,"Harakatning kimga yoki nimaga yo'naltirilganini bildiruvchi kelishik qaysi?","Jo'nalish kelishigi",["Bosh kelishik","Tushum kelishigi","Chiqish kelishigi"],"Jo'nalish kelishigi harakat yo'nalishini bildiradi: maktabga bordim."],
    [1,"Bosh kelishik qanday savolga javob beradi?","Kim? Nima?",["Kimga? Nimaga?","Kimdan? Nimadan?","Kimda? Nimada?"],"Bosh kelishik qo'shimchasiz shaklda bo'lib, Kim? Nima? savollariga javob beradi."],
    [2,"«Qishloqdan keldi» gapidagi «qishloqdan» so'zi qaysi kelishikda?","Chiqish kelishigi",["Jo'nalish kelishigi","O'rin-payt kelishigi","Qaratqich kelishigi"],"Chiqish kelishigi -dan qo'shimchasi orqali harakatning qayerdan boshlanganini bildiradi."],
    [2,"«Kitobni o'qidim» gapidagi «kitobni» so'zi qaysi kelishikda?","Tushum kelishigi",["Bosh kelishik","Jo'nalish kelishigi","Chiqish kelishigi"],"Tushum kelishigi -ni qo'shimchasi orqali yasalib, to'g'ri to'ldiruvchi vazifasini bajaradi."],
    [2,"«Maktabda o'qiydi» gapidagi «maktabda» qaysi kelishikda?","O'rin-payt kelishigi",["Jo'nalish kelishigi","Chiqish kelishigi","Tushum kelishigi"],"O'rin-payt kelishigi -da qo'shimchasi orqali harakatning o'rnini bildiradi."],
    [2,"«Do'stning kitobi yangi» gapidagi «do'stning» qaysi kelishikda?","Qaratqich kelishigi",["Tushum kelishigi","O'rin-payt kelishigi","Bosh kelishik"],"Qaratqich kelishigi -ning qo'shimchasi qo'yilgan so'z tegishlilikni bildiradi."],
    [2,"Ikkinchi shaxs birlik egalik qo'shimchasi qaysi?","-ing",["-im","-i","-imiz"],"Ikkinchi shaxs birlik egalik qo'shimchasi -ing: kitobing — sening kitobing."],
    [2,"«Daraxti» so'zidagi egalik qo'shimchasi qaysi shaxsni bildiradi?","Uchinchi shaxsni",["Birinchi shaxsni","Ikkinchi shaxsni","Shaxsni bildirmaydi"],"Uchinchi shaxs birlik egalik qo'shimchasi -i: daraxt + i = daraxti."],
    [2,"«Bolalarga» so'zidagi qo'shimchalar qanday tartibda qo'shilgan?","-lar + -ga",["-ga + -lar","-ning + -ga","-lar + -ning"],"Avval ko'plik -lar, keyin jo'nalish kelishigi -ga qo'shiladi: bola + lar + ga."],
    [2,"Tushum kelishigi qanday savolga javob beradi?","Kimni? Nimani?",["Kim? Nima?","Kimga? Nimaga?","Kimda? Nimada?"],"Tushum kelishigi -ni qo'shimchasi orqali Kimni? Nimani? savollariga javob beradi."],
    [2,"Jo'nalish kelishigi qanday savolga javob beradi?","Kimga? Nimaga? Qayerga?",["Kimda? Nimada? Qayerda?","Kimdan? Nimadan? Qayerdan?","Kimning? Nimaning?"],"Jo'nalish kelishigi yo'nalishni bildiradi va Kimga? Nimaga? Qayerga? savollariga javob beradi."],
    [2,"O'rin-payt kelishigi qanday savolga javob beradi?","Kimda? Nimada? Qayerda?",["Kimga? Nimaga? Qayerga?","Kimdan? Nimadan? Qayerdan?","Kimni? Nimani?"],"O'rin-payt kelishigi o'rin yoki paytni bildiradi va Kimda? Nimada? Qayerda? savollariga javob beradi."],
    [2,"Chiqish kelishigi qanday savolga javob beradi?","Kimdan? Nimadan? Qayerdan?",["Kimda? Nimada? Qayerda?","Kimga? Nimaga? Qayerga?","Kimning? Nimaning?"],"Chiqish kelishigi harakatning qayerdan yoki kimdan chiqishini bildiradi."],
    [2,"Qaratqich kelishigi qanday savolga javob beradi?","Kimning? Nimaning?",["Kim? Nima?","Kimga? Nimaga?","Kimda? Nimada?"],"Qaratqich kelishigi -ning qo'shimchasi orqali tegishlilikni bildiradi."],
    [2,"«Shaharlarda» so'zidagi qo'shimchalar ketma-ketligi qaysi?","-lar + -da",["-da + -lar","-lar + -dan","-dan + -lar"],"Avval ko'plik -lar, keyin o'rin-payt -da qo'shiladi: shahar + lar + da = shaharlarda."],
    [2,"Qaysi gapda jo'nalish kelishigi qo'llanilgan?","Biz teatrga ketdik.",["Ular uyda o'tirishdi.","Men kitobni o'qidim.","Akam shahardan keldi."],"«Teatrga» so'zida -ga jo'nalish kelishigi qo'shimchasi bor."],
    [2,"Egalik qo'shimchalari shaxs va son bo'yicha nechtaga bo'linadi?","6 ta",["3 ta","4 ta","9 ta"],"Egalik qo'shimchalari 3 shaxs va 2 son (birlik va ko'plik) bo'yicha jami 6 ta."],
    [2,"«Mening» so'zi qaysi olmoshning qaratqich shakli?","Men",["Sen","U","Biz"],"Men olmoshi qaratqich kelishigida mening shaklini oladi: men + ning = mening."],
    [2,"«O'quvchining» so'ziga qanday qo'shimcha qo'shilgan?","-ning (qaratqich kelishigi)",["-da (o'rin-payt)","-dan (chiqish)","-ga (jo'nalish)"],"O'quvchi + ning = o'quvchining — bu qaratqich kelishigi shakli."],
    [2,"Qaysi so'zda o'rin-payt kelishigi qo'llanilgan?","darsda",["darsga","darsdan","darsni"],"«Darsda» so'zida -da o'rin-payt kelishigi qo'shimchasi bor."],
    [2,"Egalik va kelishik qo'shimchalari qanday tartibda qo'shiladi?","Egalik avval, kelishik keyin",["Kelishik avval, egalik keyin","Ikkalasi bir vaqtda","Tartib muhim emas"],"To'g'ri tartib: ot + egalik + kelishik, masalan: kitob + im + ni = kitobimni."],
    [2,"Qaysi gapda chiqish kelishigi qo'llanilgan?","Bola bog'dan yugurdi.",["Bola bog'da o'ynadi.","Bola bog'ga kirdi.","Bolaning bog'i katta."],"«Bog'dan» so'zida -dan chiqish kelishigi qo'shimchasi bor."],
    [3,"«Qo'limni» so'zidagi qo'shimchalar to'g'ri tahlili qaysi?","-im (egalik) + -ni (tushum)",["-ni (tushum) + -im (egalik)","-im (ko'plik) + -ni (tushum)","-li (sifat) + -ni (tushum)"],"To'g'ri tartib: qo'l + im (egalik) + ni (tushum) = qo'limni."],
    [3,"«Daftarlarimni» so'zidagi qo'shimchalar to'g'ri ketma-ketligi qaysi?","-lar + -im + -ni",["-im + -lar + -ni","-ni + -lar + -im","-lar + -ni + -im"],"Ketma-ketlik: ot + ko'plik + egalik + kelishik: daftar + lar + im + ni = daftarlarimni."],
    [3,"Qaysi so'zda shakl yasovchi qo'shimcha qo'llangan?","kitobda",["kitobchi","kitobxon","kitobiy"],"«-da» kelishik qo'shimchasi grammatik shakl yasaydi; «-chi», «-xon», «-iy» esa yangi so'z hosil qiladi."],
    [3,"«Kutubxonada» so'zi qaysi kelishikda va qanday qo'shimcha bilan yasalgan?","O'rin-payt kelishigi, -da",["Jo'nalish kelishigi, -ga","Chiqish kelishigi, -dan","Qaratqich kelishigi, -ning"],"Kutubxona + da = kutubxonada — o'rin-payt kelishigi qo'shimchasi qo'shilgan."],
    [3,"Ko'plik va egalik qo'shimchalari qanday tartibda qo'shiladi?","Avval ko'plik, so'ng egalik",["Avval egalik, so'ng ko'plik","Tartib muhim emas","Egalik faqat birlikda qo'shiladi"],"To'g'ri tartib: ot + ko'plik + egalik: o'quvchi + lar + imiz = o'quvchilarimiz."],
    [3,"Qaysi so'zda ikkita qo'shimcha mavjud?","kitobimni",["kitoblar","maktabda","bog'ga"],"«Kitobimni»: kitob + im (egalik) + ni (tushum) — ikkita qo'shimcha; boshqalarida bittadan qo'shimcha bor."],
    [3,"Qaysi so'zda qo'shimchalar to'g'ri tartibda qo'llanilgan?","o'quvchilarimizga",["o'quvchigalarimiz","o'quvchiimizlarga","o'quvchiimizgalar"],"To'g'ri tartib: o'quvchi + lar + imiz + ga = o'quvchilarimizga."],
    [3,"Qaysi gapda to'ldiruvchi kelishik qo'shimchasisiz ifodalangan?","Men non yedim.",["Men uyga ketdim.","Bola bog'da o'ynadi.","U kitobni o'qidi."],"«Non» so'zi -ni qo'shimchasisiz kelgan bo'lsa-da, «yedim» fe'liga bog'lanib to'ldiruvchi bo'lib kelgan."],
    [3,"«O'quvchilarimizdan» so'zidagi qo'shimchalar tahlili qaysi?","-lar + -imiz + -dan",["-imiz + -lar + -dan","-dan + -lar + -imiz","-lar + -dan + -imiz"],"To'g'ri tartib: o'quvchi + lar (ko'plik) + imiz (egalik) + dan (chiqish kelishigi)."],
    [3,"«Bolamning» so'zidagi qo'shimchalar to'g'ri ketma-ketligi qaysi?","-m + -ning",["-ning + -m","-m + -dan","-lar + -m"],"Bola + m (birinchi shaxs egalik) + ning (qaratqich kelishigi) = bolamning."],
    [3,"Qaysi gapda ikkita xil kelishik qo'llanilgan?","Akamning kitobini o'qidim.",["Akam kitob o'qiydi.","Men uyga ketdim.","Bola bog'da o'ynaydi."],"«Akamning» — qaratqich, «kitobini» — tushum kelishigida: gapda ikki xil kelishik bor."],
    [3,"Qaysi so'zda ham egalik, ham kelishik qo'shimchasi bor?","kitobimga",["kitoblar","kitobga","kitobim"],"«Kitobimga»: kitob + im (egalik) + ga (jo'nalish kelishigi) — ikki qo'shimcha birga kelgan."],
    [3,"«Kitobni» va «kitobning» so'zlari orasidagi farq nima?","Birinchisi tushum, ikkinchisi qaratqichda",["Ikkalasi ham tushum kelishigida","Birinchisi jo'nalish, ikkinchisi chiqishda","Ikkalasi ham bosh kelishikda"],"«-ni» tushum kelishigini, «-ning» esa qaratqich kelishigini yasaydi."],
    [3,"Qaysi gapda so'z chiqish kelishigida ishlatilib, harakat manbaini bildirmoqda?","Suv quduqdan olinadi.",["Suv quduqqa quyiladi.","Suv quduqda bor.","Suv quduq yonida."],"«Quduqdan» so'zidagi -dan qo'shimchasi harakatning qayerdan olinishini bildiradi."],
    [3,"«Tog'larimizdan» so'zini to'g'ri morfologik tahlil qiling.","tog' + lar + imiz + dan",["tog' + dan + lar + imiz","tog' + imiz + lar + dan","tog' + lar + dan + imiz"],"To'g'ri tartib: ot + ko'plik + egalik + kelishik: tog' + lar + imiz + dan."],
    [3,"«Kitobingizdan» so'zidagi qo'shimchalar to'g'ri tahlili qaysi?","-ingiz + -dan",["-ing + -dan","-ingiz + -ning","-lar + -dan"],"-ingiz ikkinchi shaxs ko'plik egalik qo'shimchasi: kitob + ingiz + dan = kitobingizdan."],
    [3,"Qaysi gapda o'rin-payt kelishigidagi so'z payt ma'nosini bildiradi?","Dars kuzda boshlanadi.",["Kitob stolda yotibdi.","Bola bog'da o'ynaydi.","U shaharda yashaydi."],"«Kuzda» so'zi -da qo'shimchasi bilan «qachon?» savoliga javob berib, paytni bildirmoqda."]
  ];
  topic("o1", "Ona tili · Kelishiklar va qo'shimchalar", O1, [
    { p: 0.3, fn: genKelForm }, { p: 0.15, fn: genKelName }, { p: 0.15, fn: genSoroq },
    { p: 0.13, fn: function (L) { return L === 1 ? null : genEgalik(L); } }, { p: 0.12, fn: function (L) { return L === 1 ? null : genYasash(L); } }
  ]);

  /* ================= o2 Ona tili · So'z turkumlari ================= */
  var TURK = ["Ot", "Sifat", "Son", "Olmosh", "Fe'l", "Ravish", "Ko'makchi", "Bog'lovchi", "Yuklama", "Undov"];
  var TURK_SOR = ["kim? nima?", "qanday? qanaqa?", "nechta? qancha? nechanchi?", "", "nima qildi? nima qilyapti?", "qanday? qachon? qayerda?", "", "", "", ""];
  // [so'z, turkum indeksi, daraja] — faqat bir ma'noli, aniq misollar
  var SOZ = [
    ["daraxt", 0, 1], ["kitob", 0, 1], ["maktab", 0, 1], ["Toshkent", 0, 1], ["daftar", 0, 1], ["shamol", 0, 1], ["bilim", 0, 2], ["vatan", 0, 2], ["o'quvchi", 0, 2], ["do'stlik", 0, 3], ["paxtazor", 0, 3],
    ["chiroyli", 1, 1], ["qizil", 1, 1], ["shirin", 1, 1], ["baland", 1, 1], ["aqlli", 1, 2], ["mehnatkash", 1, 2], ["sho'x", 1, 2], ["qizg'ish", 1, 3], ["kuchsiz", 1, 3], ["ko'm-ko'k", 1, 3],
    ["besh", 2, 1], ["o'n", 2, 1], ["yuz", 2, 2], ["beshinchi", 2, 1], ["uchta", 2, 1], ["ikkinchi", 2, 2], ["o'ntacha", 2, 3], ["beshala", 2, 3], ["ming", 2, 2],
    ["men", 3, 1], ["biz", 3, 1], ["ular", 3, 1], ["sen", 3, 1], ["kim", 3, 2], ["hamma", 3, 2], ["bu", 3, 2], ["o'zim", 3, 3], ["hech kim", 3, 3], ["allakim", 3, 3],
    ["yugurmoq", 4, 1], ["o'qidi", 4, 1], ["yozmoq", 4, 1], ["kel", 4, 1], ["o'ynayapti", 4, 2], ["bormoqda", 4, 2], ["kuldi", 4, 2], ["o'qiyotgan", 4, 3], ["yozib", 4, 3],
    ["tez-tez", 5, 1], ["kecha", 5, 2], ["asta-sekin", 5, 2], ["ertalab", 5, 2], ["piyoda", 5, 3], ["hozir", 5, 2], ["ataylab", 5, 3], ["birdan", 5, 3], ["yaqinda", 5, 3],
    ["bilan", 6, 1], ["uchun", 6, 1], ["kabi", 6, 2], ["sari", 6, 2], ["orqali", 6, 2], ["qadar", 6, 3], ["haqida", 6, 2], ["tomon", 6, 3],
    ["va", 7, 1], ["lekin", 7, 1], ["ammo", 7, 2], ["yoki", 7, 1], ["chunki", 7, 2], ["biroq", 7, 2], ["goh", 7, 3], ["agar", 7, 3],
    ["faqat", 8, 1], ["ham", 8, 2], ["-mi", 8, 2], ["axir", 8, 2], ["hatto", 8, 2], ["-chi", 8, 3], ["xuddi", 8, 3], ["naqadar", 8, 3],
    ["voy", 9, 1], ["obbo", 9, 2], ["ura", 9, 1], ["eh", 9, 2], ["oh", 9, 1], ["barakalla", 9, 3], ["rahmat", 9, 3], ["salom", 9, 3],
    ["qalam", 0, 1], ["stol", 0, 1], ["tog'", 0, 1], ["daryo", 0, 1], ["mushuk", 0, 1], ["Samarqand", 0, 1], ["quyosh", 0, 1], ["baxt", 0, 2], ["go'zallik", 0, 3], ["ishchi", 0, 3], ["sinfdosh", 0, 3], ["kitobxon", 0, 3],
    ["yashil", 1, 1], ["mazali", 1, 1], ["yumshoq", 1, 1], ["uzun", 1, 1], ["semiz", 1, 2], ["oriq", 1, 2], ["xushbo'y", 1, 2], ["odobli", 1, 2], ["ko'kimtir", 1, 3], ["bilimli", 1, 3], ["kattaroq", 1, 3],
    ["ikki", 2, 1], ["to'rt", 2, 1], ["olti", 2, 1], ["yetti", 2, 1], ["sakkiz", 2, 1], ["yigirma", 2, 1], ["uchinchi", 2, 1], ["beshta", 2, 1], ["ellik", 2, 2], ["million", 2, 2], ["o'ninchi", 2, 2], ["yettinchi", 2, 2], ["ikkitadan", 2, 3], ["o'nlab", 2, 3], ["uchovlon", 2, 3],
    ["u", 3, 1], ["siz", 3, 1], ["shu", 3, 1], ["o'sha", 3, 2], ["nima", 3, 2], ["barcha", 3, 2], ["hech nima", 3, 3], ["har kim", 3, 3], ["kimdir", 3, 3], ["allanima", 3, 3],
    ["uxladi", 4, 1], ["gapirmoq", 4, 1], ["ishlamoq", 4, 1], ["sakradi", 4, 1], ["chizdi", 4, 1], ["kuylamoq", 4, 1], ["tinglayapti", 4, 2], ["yozyapti", 4, 2], ["boraman", 4, 2], ["ko'rdik", 4, 2], ["o'ylamoq", 4, 2], ["kuldirmoq", 4, 3], ["yozilmoq", 4, 3], ["tozalamoq", 4, 3],
    ["bugun", 5, 1], ["ertaga", 5, 1], ["doim", 5, 1], ["kechqurun", 5, 2], ["kunduzi", 5, 2], ["hamisha", 5, 2], ["darhol", 5, 2], ["juda", 5, 2], ["yayov", 5, 3], ["qasddan", 5, 3], ["zo'rg'a", 5, 3], ["allaqachon", 5, 3],
    ["singari", 6, 2], ["tufayli", 6, 2], ["sayin", 6, 3], ["uzra", 6, 3],
    ["hamda", 7, 2], ["yoxud", 7, 3], ["toki", 7, 3], ["holbuki", 7, 3], ["garchi", 7, 3],
    ["xolos", 8, 2], ["nahotki", 8, 3], ["hattoki", 8, 3],
    ["hoy", 9, 1], ["uh", 9, 2], ["ey", 9, 2], ["attang", 9, 2], ["pisht", 9, 3], ["kisht", 9, 3], ["chu", 9, 3]
  ];
  // ikki ma'noli yoki munozarali so'zlar chiqarib tashlanadi
  SOZ = SOZ.filter(function (s) { return ["kecha", "-chi", "-mi", "ham", "rahmat", "salom", "sari", "xuddi", "goh", "naqadar", "barakalla", "yuz", "o'qiyotgan", "yozib", "piyoda", "yaqinda", "tomon"].indexOf(s[0]) < 0; });
  // shu so'zlar uchun chalg'ituvchi variantga qo'yilmaydigan turkumlar (munozara bo'lmasligi uchun)
  var BAN = { bilan: [7], faqat: [7], uchun: [7] };
  var MUST = [0, 1, 2, 3, 4, 5];
  function genTurkum(L) {
    var pool = SOZ.filter(function (s) { return s[2] === L; });
    var s = pick(pool.length ? pool : SOZ), i = s[1], a = TURK[i];
    var ban = (BAN[s[0]] || []).concat(i === 1 ? [5] : []), T = TURK.filter(function (t, k) { return ban.indexOf(k) < 0; });
    var w = MUST.indexOf(i) > -1 ? others(T.slice(0, 6 - (i === 1 ? 1 : 0)), a, 3).concat(others(TURK.slice(6), a, 1)) : others(T.filter(function (t) { return TURK.indexOf(t) >= 6; }), a, 2).concat(others(TURK.slice(0, 6), a, 2));
    return Q("<b>" + s[0] + "</b> so'zi qaysi so'z turkumiga kiradi?", a, w, [s[0] + " — " + a.toLowerCase() + (TURK_SOR[i] ? " (" + TURK_SOR[i] + ")" : "") + "."]);
  }
  function genQaysiSoz(L) {
    var i = R(0, 9), own = SOZ.filter(function (s) { return s[1] === i && s[2] <= Math.max(L, 2); });
    if (!own.length) return null;
    var s = pick(own), oth = shuffle(SOZ.filter(function (x) { return x[1] !== i && x[2] <= Math.max(L, 2); }));
    var w = [], used = {};
    oth.forEach(function (x) {
      if (i === 5 && x[1] === 1) return;                                   // sifat ravish vazifasida ham kelishi mumkin
      if (i === 7 && (x[0] === "bilan" || x[0] === "faqat" || x[0] === "uchun")) return;       // bog'lovchi vazifasida ham keladi
      if (w.length < 4 && !used[x[1]]) { used[x[1]] = 1; w.push(x[0]); }
    });
    return Q("Qaysi so'z <b>" + TURK[i].toLowerCase() + "</b> turkumiga kiradi?", s[0], w, [s[0] + " — " + TURK[i].toLowerCase() + "."]);
  }
  // gap bo'laklari: [gap (bo'lak <b>), javob]
  var BOLAK = ["Ega", "Kesim", "To'ldiruvchi", "Aniqlovchi", "Hol"];
  var GAP = [
    ["<b>Anvar</b> kitob o'qidi.", 0], ["Bolalar <b>o'ynashdi</b>.", 1], ["Men <b>kitobni</b> o'qidim.", 2], ["<b>Qizil</b> olma pishdi.", 3], ["Biz <b>ertalab</b> yugurdik.", 4],
    ["<b>Qushlar</b> uchib ketdi.", 0], ["Onam ovqat <b>pishirdi</b>.", 1], ["Ukam <b>do'stiga</b> xat yozdi.", 2], ["<b>Baland</b> tog'lar ko'rindi.", 3], ["Ular <b>maktabda</b> o'qiydi.", 4],
    ["<b>Quyosh</b> chiqdi.", 0], ["Talabalar imtihon <b>topshirdi</b>.", 1], ["Dilnoza <b>gullarni</b> sug'ordi.", 2], ["<b>Aqlli</b> bola savolga javob berdi.", 3], ["Poyezd <b>tez</b> yurdi.", 4],
    ["<b>Shamol</b> esdi.", 0], ["Bu kitob juda <b>qiziqarli</b>.", 1], ["Akam <b>mashinani</b> yuvdi.", 2], ["<b>Mening</b> ukam maktabga bordi.", 3], ["Biz <b>bog'da</b> dam oldik.", 4],
    ["<b>Bahor</b> keldi.", 0], ["<b>Men</b> maktabga boraman.", 0], ["<b>Daraxtlar</b> gulladi.", 0], ["<b>Bolalar</b> hovlida o'ynashyapti.", 0],
    ["Ukam rasm <b>chizdi</b>.", 1], ["Havo <b>ochiq</b>.", 1], ["Mening akam <b>shifokor</b>.", 1], ["Biz darsga <b>tayyorlandik</b>.", 1],
    ["Opam <b>xat</b> yozdi.", 2], ["U <b>qalam bilan</b> yozdi.", 2], ["Biz <b>ustozimizdan</b> dars oldik.", 2], ["Men <b>onamga</b> yordam berdim.", 2],
    ["<b>Yashil</b> barglar shitirladi.", 3], ["<b>Bizning</b> sinfimiz katta.", 3], ["<b>Uchta</b> qush uchib keldi.", 3], ["<b>Do'stimning</b> kitobi qiziqarli.", 3],
    ["Mehmonlar <b>kecha</b> kelishdi.", 4], ["Qushlar <b>janubga</b> uchib ketdi.", 4], ["Bola <b>sekin</b> gapirdi.", 4], ["Dars <b>soat sakkizda</b> boshlanadi.", 4]
  ];
  function genBolak(L) {
    var g = pick(GAP), a = BOLAK[g[1]];
    return Q("Gapdagi ajratilgan so'z qaysi gap bo'lagi?<br>" + g[0], a, others(BOLAK, a, 4), [a + " — " + ["kim? nima? so'rog'iga javob beradi.", "ega haqida nima deyilganini bildiradi.", "kimni? nimani? kimga? kabi so'roqlarga javob beradi.", "qanday? qaysi? kimning? so'rog'iga javob beradi.", "qayerda? qachon? qanday? so'rog'iga javob beradi."][g[1]]]);
  }
  var O2 = [
    [1, "Narsa yoki shaxs nomini bildirib, kim? nima? so'rog'iga javob beradigan turkum qaysi?", "Ot", ["Sifat", "Fe'l", "Ravish"], "Ot: kitob, ona, Toshkent."],
    [1, "Belgini bildirib, qanday? qanaqa? so'rog'iga javob beradigan turkum qaysi?", "Sifat", ["Ot", "Son", "Fe'l"], "Sifat: chiroyli, qizil, aqlli."],
    [1, "Harakatni bildirib, nima qildi? so'rog'iga javob beradigan turkum qaysi?", "Fe'l", ["Ot", "Sifat", "Ravish"], "Fe'l: o'qidi, yozdi, keldi."],
    [1, "Miqdor yoki tartibni bildiradigan turkum qaysi?", "Son", ["Sifat", "Ot", "Olmosh"], "Son: besh, uchta, beshinchi."],
    [1, "Ot, sifat, son o'rnida qo'llanadigan turkum qaysi?", "Olmosh", ["Ravish", "Ko'makchi", "Yuklama"], "Olmosh: men, sen, u, bu, kim."],
    [1, "His-hayajonni bildiradigan so'zlar qaysi turkumga kiradi?", "Undov", ["Yuklama", "Bog'lovchi", "Ravish"], "Undov: voy, oh, ura, obbo."],
    [2, "Qaysi turkum yordamchi so'z turkumiga kiradi?", "Bog'lovchi", ["Ot", "Fe'l", "Sifat"], "Yordamchi so'zlar: ko'makchi, bog'lovchi, yuklama."],
    [2, "Qaysi turkum mustaqil so'z turkumiga kiradi?", "Ravish", ["Ko'makchi", "Bog'lovchi", "Yuklama"], "Mustaqil turkumlar: ot, sifat, son, olmosh, fe'l, ravish."],
    [2, "Harakatning belgisini bildiruvchi turkum qaysi?", "Ravish", ["Sifat", "Fe'l", "Son"], "Ravish: tez yurdi, sekin gapirdi."],
    [2, "Lug'atlarda fe'llar qaysi qo'shimcha bilan beriladi?", "-moq", ["-lar", "-li", "-chi"], "o'qimoq, yozmoq, yugurmoq."],
    [2, "\"Beshinchi\" sonidagi -inchi qanday son hosil qiladi?", "Tartib son", ["Dona son", "Jamlovchi son", "Taqsim son"], "Tartib son nechanchi? so'rog'iga javob beradi."],
    [2, "\"Uchta\" sonidagi -ta qanday son hosil qiladi?", "Dona son", ["Tartib son", "Chama son", "Taqsim son"], "Dona son nechta? so'rog'iga javob beradi."],
    [3, "Gapning bosh bo'laklari qaysilar?", "Ega va kesim", ["To'ldiruvchi va hol", "Aniqlovchi va hol", "Ega va to'ldiruvchi"], "Ikkinchi darajali bo'laklar: to'ldiruvchi, aniqlovchi, hol."],
    [3, "Qaysi gap bo'lagi ikkinchi darajali bo'lak emas?", "Ega", ["To'ldiruvchi", "Aniqlovchi", "Hol"], "Ega va kesim — bosh bo'laklar."],
    [3, "Qaysi qatorda faqat yordamchi so'zlar berilgan?", "bilan, va, hatto", ["kitob, va, hatto", "biz, uchun, lekin", "tez, lekin, kabi"], "Yordamchi so'zlar: ko'makchi (bilan), bog'lovchi (va), yuklama (hatto)."],
    [1, "Atoqli otlar qanday yoziladi?", "Bosh harf bilan", ["Kichik harf bilan", "Qo'shtirnoq ichida", "Faqat bosh harflar bilan"], "Masalan: Toshkent, Amudaryo, Anvar."],
    [1, "Qaysi so'z atoqli ot?", "Samarqand", ["shahar", "daryo", "kitob"], "Atoqli ot — yakka narsa yoki shaxsning maxsus nomi."],
    [1, "Qaysi so'z turdosh ot?", "daryo", ["Amudaryo", "Toshkent", "Anvar"], "Turdosh ot — bir turdagi narsalarning umumiy nomi."],
    [1, "Qaysi so'z ko'plik shaklida?", "daftarlar", ["daftar", "daftarim", "daftarga"], "Ko'plik qo'shimchasi: -lar."],
    [1, "\"Kitob\" so'zi qaysi so'roqqa javob beradi?", "nima?", ["kim?", "qanday?", "nima qildi?"], "Narsa nomini bildiruvchi otlar nima? so'rog'iga javob beradi."],
    [1, "\"O'quvchi\" so'zi qaysi so'roqqa javob beradi?", "kim?", ["nima?", "qanday?", "qachon?"], "Shaxs nomini bildiruvchi otlar kim? so'rog'iga javob beradi."],
    [1, "\"Yugurdi\" so'zi qaysi so'roqqa javob beradi?", "nima qildi?", ["kim?", "qanday?", "nechta?"], "Fe'llar harakatni bildiradi."],
    [1, "\"Qizil\" so'zi qaysi so'roqqa javob beradi?", "qanday?", ["kim?", "nima qildi?", "nechta?"], "Sifatlar belgini bildiradi."],
    [2, "Fe'lning bo'lishsiz shakli qaysi qo'shimcha bilan yasaladi?", "-ma", ["-lar", "-li", "-chi"], "bor + ma + di = bormadi."],
    [2, "Qaysi so'z fe'lning bo'lishsiz shaklida?", "bormadi", ["bordi", "boradi", "bormoqda"], "-ma qo'shimchasi inkorni bildiradi."],
    [2, "Sifatning qiyosiy darajasi qaysi qo'shimcha bilan yasaladi?", "-roq", ["-lar", "-chi", "-gi"], "baland + roq = balandroq."],
    [2, "Qaysi so'z qiyosiy darajadagi sifat?", "balandroq", ["baland", "eng baland", "juda baland"], "-roq qo'shimchasi qiyosiy darajani bildiradi."],
    [2, "Qaysi birikma sifatning orttirma darajasida?", "eng katta", ["kattaroq", "katta", "kattalar"], "Orttirma daraja: eng, juda, g'oyat so'zlari bilan."],
    [2, "Kishilik olmoshlari qatori qaysi?", "men, sen, u", ["bu, shu, o'sha", "kim, nima, qayer", "hamma, barcha, har kim"], "Kishilik olmoshlari: men, sen, u, biz, siz, ular."],
    [2, "Ko'rsatish olmoshlari qatori qaysi?", "bu, shu, o'sha", ["men, sen, u", "kim, nima, qayer", "hamma, barcha, har kim"], "Ko'rsatish olmoshlari narsani ko'rsatib keladi."],
    [2, "So'roq olmoshlari qatori qaysi?", "kim, nima, qayer", ["bu, shu, o'sha", "men, sen, u", "hamma, barcha, har kim"], "So'roq olmoshlari so'roq gap tuzadi."],
    [2, "Qaysi qatorda faqat fe'llar berilgan?", "yozdi, o'qidi, keldi", ["kitob, yozdi, tez", "qizil, keldi, men", "va, o'qidi, bilan"], "Fe'llar ish-harakatni bildiradi."],
    [2, "Qaysi qatorda faqat sifatlar berilgan?", "qizil, baland, shirin", ["qizil, yugurdi, kitob", "besh, baland, men", "va, baland, shirin"], "Sifatlar belgini bildiradi."],
    [2, "Qaysi qatorda faqat otlar berilgan?", "kitob, daraxt, shamol", ["kitob, chiroyli, yozdi", "men, daraxt, besh", "shamol, va, yugurdi"], "Otlar narsa va shaxs nomini bildiradi."],
    [2, "Qaysi qatorda faqat sonlar berilgan?", "besh, o'n, ming", ["besh, baland, men", "o'n, kitob, va", "ming, yozdi, qizil"], "Sonlar miqdor va tartibni bildiradi."],
    [2, "\"Beshinchi\" so'zi qaysi so'roqqa javob beradi?", "nechanchi?", ["nechta?", "qancha?", "qanday?"], "Tartib sonlar nechanchi? so'rog'iga javob beradi."],
    [2, "Ravish odatda qaysi so'z turkumiga bog'lanib keladi?", "Fe'lga", ["Otga", "Olmoshga", "Bog'lovchiga"], "Masalan: tez yugurdi, sekin gapirdi."],
    [2, "Sifat odatda qaysi so'z turkumiga bog'lanib keladi?", "Otga", ["Fe'lga", "Bog'lovchiga", "Undovga"], "Masalan: qizil olma, baland tog'."],
    [3, "Qaysi so'z taqsim son?", "uchtadan", ["uchta", "uchinchi", "uchovlon"], "Taqsim son -tadan qo'shimchasi bilan yasaladi."],
    [3, "Qaysi so'z jamlovchi son?", "uchovlon", ["uchta", "uchinchi", "uchtadan"], "Jamlovchi son -ov, -ovlon, -ala qo'shimchalari bilan yasaladi."],
    [3, "Qaysi so'z chama son?", "o'ntacha", ["o'nta", "o'ninchi", "o'ntadan"], "Chama son -tacha, -lab qo'shimchalari bilan yasaladi."],
    [3, "Qaysi so'z qo'shma so'z?", "toshbaqa", ["toshlar", "toshli", "toshcha"], "Qo'shma so'z ikki asosdan tuziladi: tosh + baqa."],
    [3, "Qaysi so'z juft so'z?", "ota-ona", ["otaxon", "otalar", "otamiz"], "Juft so'z ikki so'zning juftlashuvidan hosil bo'ladi."],
    [3, "Qaysi so'z takroriy so'z?", "katta-katta", ["katta-kichik", "kattaroq", "kattalashmoq"], "Takroriy so'z bir so'zning takrorlanishidan hosil bo'ladi."],
    [3, "Qaysi so'z modal so'z?", "albatta", ["va", "bilan", "voy"], "Modal so'zlar so'zlovchining munosabatini bildiradi: albatta, ehtimol, shubhasiz."],
    [3, "Qaysi so'z taqlid so'z?", "taq-tuq", ["voy", "va", "bilan"], "Taqlid so'zlar tovush yoki holatga taqlidni bildiradi."],
    [3, "Ish-harakat bajaruvchisi noma'lum bo'lgan fe'l nisbati qaysi?", "Majhul nisbat", ["Aniq nisbat", "O'zlik nisbat", "Birgalik nisbat"], "Majhul nisbat -il, -in qo'shimchalari bilan yasaladi."],
    [1,"«U tez yugurdi» gapidagi «tez» so'zi qaysi turkumga kiradi?","Ravish",["Sifat","Fe'l","Ot"],"«Tez» bu gapda harakatning belgisini (qanday yugurdi?) bildirgani uchun ravish."],
    [1,"«Bahor» so'zi qaysi so'z turkumiga kiradi?","Ot",["Sifat","Ravish","Fe'l"],"«Bahor» nima? so'rog'iga javob beradi — ot."],
    [1,"«Shirin» so'zi qaysi so'z turkumiga kiradi?","Sifat",["Ot","Fe'l","Son"],"«Shirin» qanday? so'rog'iga javob berib, belgini bildiradi — sifat."],
    [1,"«O'qimoq» so'zi qaysi so'z turkumiga kiradi?","Fe'l",["Ot","Sifat","Ravish"],"-moq qo'shimchasi bilan berilgan, harakatni bildiradigan so'z — fe'l."],
    [1,"«Yetti» so'zi qaysi so'z turkumiga kiradi?","Son",["Sifat","Ot","Olmosh"],"«Yetti» miqdorni bildiradi va nechta? so'rog'iga javob beradi — son."],
    [1,"«Biz» so'zi qaysi so'z turkumiga kiradi?","Olmosh",["Ot","Son","Ravish"],"«Biz» kishilik olmoshi: shaxs nomi o'rnida qo'llanadi."],
    [1,"«Voy!» so'zi qaysi so'z turkumiga kiradi?","Undov",["Yuklama","Bog'lovchi","Ko'makchi"],"His-hayajonni bildiruvchi so'zlar undov deyiladi."],
    [1,"«Va» so'zi qaysi so'z turkumiga kiradi?","Bog'lovchi",["Ko'makchi","Yuklama","Undov"],"«Va» so'z va gaplarni bog'laydi — bog'lovchi."],
    [1,"«Uchun» so'zi qaysi so'z turkumiga kiradi?","Ko'makchi",["Bog'lovchi","Yuklama","Ravish"],"«Uchun» o'zidan oldingi so'zni boshqa so'zga bog'laydi: «sen uchun» — ko'makchi."],
    [1,"«Keldingmi?» so'zidagi «-mi» qanday vosita?","So'roq yuklamasi",["Ko'makchi","Bog'lovchi","Kelishik qo'shimchasi"],"«-mi» gapga so'roq ma'nosini qo'shuvchi yuklama."],
    [1,"«Ertaga» so'zi qaysi so'z turkumiga kiradi?","Ravish",["Ot","Sifat","Son"],"«Ertaga» qachon? so'rog'iga javob beradi — payt ravishi."],
    [1,"Qaysi so'z sifat?","aqlli",["aql","o'qidi","biz"],"«Aqlli» qanday? so'rog'iga javob beradi; «aql» — ot, «o'qidi» — fe'l, «biz» — olmosh."],
    [1,"Qaysi so'z son?","o'ttiz",["o'tin","o'tdi","o'tkir"],"«O'ttiz» miqdorni bildiradi; qolganlari ot, fe'l va sifat."],
    [1,"Qaysi so'z olmosh?","ular",["ulkan","ulov","uloq"],"«Ular» — kishilik olmoshi; «ulkan» sifat, «ulov» va «uloq» ot."],
    [1,"«Kitobxon» so'zi qaysi so'z turkumiga kiradi?","Ot",["Sifat","Fe'l","Ravish"],"«Kitobxon» kim? so'rog'iga javob beradi — ot."],
    [1,"O'zbek tilida mustaqil so'z turkumlari nechta?","6 ta",["4 ta","8 ta","10 ta"],"Mustaqil turkumlar: ot, sifat, son, olmosh, fe'l, ravish."],
    [1,"O'zbek tilida yordamchi so'z turkumlari nechta?","3 ta",["2 ta","4 ta","6 ta"],"Yordamchi turkumlar: ko'makchi, bog'lovchi, yuklama."],
    [2,"Qaysi so'z mavhum ot?","quvonch",["stol","daraxt","qalam"],"Mavhum otlar ko'z bilan ko'rib bo'lmaydigan tushunchalarni bildiradi: quvonch, baxt, do'stlik."],
    [2,"Qaysi so'z aniq ot?","olma",["baxt","do'stlik","orzu"],"Aniq otlar ko'rish, ushlash mumkin bo'lgan narsalarni bildiradi."],
    [2,"Qaysi so'z jamlovchi ot?","xalq",["odam","bola","qiz"],"Jamlovchi ot birlik shaklda bo'lsa ham to'da ma'nosini beradi: xalq, olomon."],
    [2,"Qaysi so'z sifatning oddiy darajasida?","shirin",["shirinroq","eng shirin","juda shirin"],"Oddiy daraja belgini qiyoslamasdan bildiradi; -roq qiyosiy, eng/juda orttirma daraja."],
    [2,"«Qip-qizil» so'zi sifatning qaysi darajasida?","Orttirma daraja",["Qiyosiy daraja","Oddiy daraja","Ozaytirma daraja"],"Takror qo'shilgan bo'g'in (qip-) belgining ortiqligini bildiradi — orttirma daraja."],
    [2,"Qaysi so'z kasr son?","uchdan bir",["uchinchi","uchta","uchovlon"],"Kasr son butunning qismini bildiradi: uchdan bir, yarim."],
    [2,"«Ikkovi», «uchala» kabi sonlar qanday son turiga kiradi?","Jamlovchi son",["Tartib son","Taqsim son","Chama son"],"-ov, -ala qo'shimchalari jamlovchi son yasaydi."],
    [2,"Qaysi so'z o'zlik olmoshi?","o'z",["u","bu","kim"],"«O'z» — o'zlik olmoshi: o'zim, o'zing, o'zi."],
    [2,"Belgilash olmoshlari qatori qaysi?","hamma, barcha, har kim",["men, sen, u","bu, shu, o'sha","kim, nima, qayer"],"Belgilash olmoshlari to'da yoki har birini belgilaydi."],
    [2,"Qaysi so'z bo'lishsizlik olmoshi?","hech kim",["har kim","kimdir","o'z"],"«Hech» bilan keladigan olmoshlar bo'lishsizlik olmoshi: hech kim, hech narsa."],
    [2,"Qaysi so'z gumon olmoshi?","allakim",["hech kim","har kim","o'zim"],"Gumon olmoshlari noaniq shaxs yoki narsani bildiradi: allakim, kimdir, nimadir."],
    [2,"«Keldi» fe'li qaysi zamonda?","O'tgan zamon",["Hozirgi zamon","Kelasi zamon","Zamonsiz"],"-di qo'shimchasi o'tgan zamonni bildiradi."],
    [2,"«Boryapti» fe'li qaysi zamonda?","Hozirgi zamon",["O'tgan zamon","Kelasi zamon","Zamonsiz"],"-yap(ti) qo'shimchasi harakat hozir davom etayotganini bildiradi."],
    [2,"«Kelsa» fe'li qaysi maylda?","Shart mayli",["Buyruq-istak mayli","Xabar mayli","Hech qaysi maylda emas"],"-sa qo'shimchasi shart maylini yasaydi."],
    [2,"«O'qi!» fe'li qaysi maylda?","Buyruq-istak mayli",["Shart mayli","Xabar mayli","Hech qaysi maylda emas"],"Buyruq ifodalovchi fe'l buyruq-istak maylida bo'ladi."],
    [2,"«Yuvindi» fe'li qaysi nisbatda?","O'zlik nisbati",["Majhul nisbat","Birgalik nisbati","Orttirma nisbat"],"Harakat bajaruvchining o'ziga qaytsa — o'zlik nisbati: yuvindi, kiyindi."],
    [2,"«Kulishdi» fe'li qaysi nisbatda?","Birgalik nisbati",["O'zlik nisbati","Majhul nisbat","Orttirma nisbat"],"-sh qo'shimchasi harakat birgalikda bajarilganini bildiradi."],
    [2,"«Yozdirdi» fe'li qaysi nisbatda?","Orttirma nisbat",["O'zlik nisbati","Majhul nisbat","Birgalik nisbati"],"Harakatni boshqaga bajartirishni bildiradi: yoz-dir-di — orttirma nisbat."],
    [2,"«Yozildi» fe'li qaysi nisbatda?","Majhul nisbat",["O'zlik nisbati","Birgalik nisbati","Orttirma nisbat"],"Bajaruvchisi noma'lum harakat — majhul nisbat: yozildi, qurildi."],
    [2,"«Ertalab» so'zi qanday ravish?","Payt ravishi",["O'rin ravishi","Holat ravishi","Miqdor-daraja ravishi"],"«Ertalab» qachon? so'rog'iga javob beradi — payt ravishi."],
    [2,"«U ko'p o'qidi» gapidagi «ko'p» qanday ravish?","Miqdor-daraja ravishi",["Payt ravishi","O'rin ravishi","Holat ravishi"],"«Ko'p» harakatning miqdorini (qancha?) bildiradi."],
    [2,"«Olg'a» so'zi qanday ravish?","O'rin ravishi",["Payt ravishi","Holat ravishi","Miqdor-daraja ravishi"],"«Olg'a» qayerga? so'rog'iga javob beradi — o'rin ravishi."],
    [2,"«Piyoda bordi» birikmasidagi «piyoda» qanday ravish?","Holat ravishi",["Payt ravishi","O'rin ravishi","Miqdor-daraja ravishi"],"«Piyoda» harakat qanday bajarilganini bildiradi — holat ravishi."],
    [2,"Qaysi so'z ko'makchi?","bilan",["va","lekin","ham"],"«Bilan» ko'makchi: «do'stim bilan»; «va», «lekin» — bog'lovchi."],
    [2,"Qaysi so'z zidlov bog'lovchisi?","lekin",["va","bilan","uchun"],"Zidlov bog'lovchilari: lekin, ammo, biroq."],
    [2,"Qaysi so'z ayiruv bog'lovchisi?","yoki",["va","lekin","chunki"],"Ayiruv bog'lovchilari: yoki, yo, goh...goh."],
    [2,"Qaysi so'z kuchaytiruv yuklamasi?","hatto",["va","uchun","voy"],"«Hatto» fikrni kuchaytirib, ta'kidlaydi — yuklama."],
    [2,"«Miyov» so'zi qaysi turkumga kiradi?","Taqlid so'z",["Undov","Ot","Fe'l"],"Tovushga taqlid qiluvchi so'zlar taqlid so'zlar deyiladi."],
    [2,"«Ehtimol» so'zi qaysi turkumga kiradi?","Modal so'z",["Ravish","Undov","Yuklama"],"Modal so'zlar so'zlovchining fikrga munosabatini bildiradi: ehtimol, albatta, shekilli."],
    [3,"«Kattalarni hurmat qil» gapidagi «kattalar» so'zi qaysi turkumga ko'chgan?","Otga",["Fe'lga","Ravishga","Songa"],"Sifat ot o'rnida kelib, ko'plik qo'shimchasini olgan — otlashgan sifat."],
    [3,"Fe'lning vazifadosh shakllari qaysilar?","Sifatdosh, ravishdosh, harakat nomi",["Ot, sifat, son","Ko'makchi, bog'lovchi, yuklama","Buyruq, shart, xabar mayllari"],"Vazifadosh shakllar fe'lni boshqa turkum vazifasida qo'llaydi."],
    [3,"«O'qigan bola» birikmasidagi «o'qigan» fe'lning qaysi shakli?","Sifatdosh",["Ravishdosh","Harakat nomi","Buyruq mayli"],"-gan qo'shimchali fe'l shakli otga bog'lanib, belgi bildiradi — sifatdosh."],
    [3,"«O'qib chiqdi» birikmasidagi «o'qib» fe'lning qaysi shakli?","Ravishdosh",["Sifatdosh","Harakat nomi","Shart mayli"],"-ib qo'shimchali shakl ravishdosh hisoblanadi."],
    [3,"«O'qish foydali» gapidagi «o'qish» fe'lning qaysi shakli?","Harakat nomi",["Sifatdosh","Ravishdosh","Buyruq mayli"],"-sh (-ish) qo'shimchali shakl harakatni nomlaydi — harakat nomi."],
    [3,"Qaysi qo'shimcha sifatdosh yasaydi?","-gan",["-ib","-sa","-roq"],"-gan, -yotgan, -digan qo'shimchalari sifatdosh yasaydi."],
    [3,"Qaysi qo'shimcha ravishdosh yasaydi?","-ib",["-gan","-ish","-lar"],"-ib, -a, -guncha kabi qo'shimchalar ravishdosh yasaydi."],
    [3,"Qaysi qatorda faqat mustaqil so'zlar berilgan?","kitob, yashil, besh",["kitob, va, besh","bilan, lekin, hatto","yashil, uchun, voy"],"Ot, sifat va son — mustaqil turkumlar; va, uchun, voy esa yordamchi yoki undov."],
    [3,"Qaysi qatorda faqat ravishlar berilgan?","ertaga, piyoda, olg'a",["ertaga, kitob, besh","piyoda, va, men","olg'a, qizil, bilan"],"Ertaga — payt, piyoda — holat, olg'a — o'rin ravishi."],
    [3,"Qaysi so'z yasama ot?","bilim",["kitob","daraxt","tosh"],"«Bilim» bil(moq) fe'liga -im qo'shimchasi qo'shilib yasalgan."],
    [3,"Qaysi qo'shimcha ot yasovchi?","-chi",["-roq","-ib","-gan"],"-chi ot yasaydi: ish — ishchi, sport — sportchi."],
    [3,"Qaysi qo'shimcha sifat yasovchi?","-li",["-chi","-lar","-ib"],"-li sifat yasaydi: kuch — kuchli, aql — aqlli."],
    [3,"Qaysi so'z yasama fe'l?","ishlamoq",["yozmoq","o'qimoq","kelmoq"],"«Ishlamoq» ish otiga -la qo'shimchasi qo'shilib yasalgan."]
  ];
  var NISBAT = ["Aniq nisbat", "O'zlik nisbat", "Majhul nisbat", "Birgalik nisbat", "Orttirma nisbat"];
  var NIS_F = [["yozdi", 0], ["o'qidi", 0], ["yuvindi", 1], ["kiyindi", 1], ["tarandi", 1], ["yozildi", 2], ["qurildi", 2], ["aytildi", 2],
    ["kulishdi", 3], ["yozishdi", 3], ["ishlashdi", 3], ["kuldirdi", 4], ["yozdirdi", 4], ["o'qitdi", 4]];
  function genNisbat() {
    var f = pick(NIS_F), a = NISBAT[f[1]];
    return Q("<b>" + f[0] + "</b> fe'li qaysi nisbatda?", a, others(NISBAT, a, 4), [f[0] + " — " + a.toLowerCase() + "."]);
  }
  topic("o2", "Ona tili · So'z turkumlari", O2, [
    { p: 0.45, fn: genTurkum }, { p: 0.2, fn: genQaysiSoz }, { p: 0.17, fn: function (L) { return L === 1 ? null : genBolak(L); } }, { p: 0.08, fn: function (L) { return L === 3 ? genNisbat() : null; } }
  ]);

  /* ================= o3 Ona tili · Fonetika va imlo ================= */
  // unli harflar: a, e, i, o, u, o' — o' bitta unli; g', sh, ch, ng bitta undosh tovush
  var FON_W = ["kitob", "maktab", "daftar", "olma", "bola", "ona", "qalam", "o'quvchi", "o'qituvchi", "shahar", "bayroq", "chiroq", "tog'", "bog'bon",
    "Vatan", "mustaqillik", "kutubxona", "universitet", "matematika", "geografiya", "do'stlik", "sinfdosh", "yulduz", "quyosh", "osmon", "kompyuter", "telefon", "televizor", "ko'cha", "o'rdak"];
  FON_W = FON_W.map(function (w) { return w.toLowerCase(); });
  function letters(w) {
    var out = [], i = 0;
    while (i < w.length) {
      var two = w.substr(i, 2);
      if (two === "o'" || two === "g'") { out.push(two); i += 2; continue; }
      if (two === "sh" || two === "ch") { out.push(two); i += 2; continue; }
      out.push(w.charAt(i)); i++;
    }
    return out;
  }
  function unliN(w) { return letters(w).filter(function (c) { return /^(a|e|i|o|u|o')$/.test(c); }).length; }
  function genUnli(L) {
    var pool = FON_W.filter(function (w) { var n = unliN(w); return L === 1 ? n <= 3 : L === 2 ? n >= 2 && n <= 4 : n >= 3; });
    var w = pick(pool), n = unliN(w), t = L >= 2 && Math.random() < 0.5;
    var vs = letters(w).filter(function (c) { return /^(a|e|i|o|u|o')$/.test(c); });
    if (t) return Q("<b>" + w + "</b> so'zi nechta bo'g'indan iborat?", n, [n - 1, n + 1, n + 2, n - 2, n + 3].filter(function (x) { return x > 0; }).slice(0, 4),
      ["O'zbek tilida bo'g'inlar soni unlilar soniga teng: " + vs.join(", ") + " → " + n + " ta bo'g'in."]);
    return Q("<b>" + w + "</b> so'zida nechta unli tovush bor?", n, [n - 1, n + 1, n + 2, n - 2, n + 3].filter(function (x) { return x > 0; }).slice(0, 4),
      ["Unlilar: " + vs.join(", ") + " → " + n + " ta."]);
  }
  // imlo: [to'g'ri, [xato variantlar], daraja]
  var IMLO = [
    ["shahar", ["shaxar", "shahr", "shaar"], 1], ["kitob", ["kitop", "kitab", "ketob"], 1], ["maktab", ["mahtab", "maktap", "mahktab"], 1],
    ["ma'lumot", ["malumot", "ma'lumod", "maluomot"], 1], ["tug'ilgan", ["tugilgan", "tug'ulgan", "tukilgan"], 1], ["daftar", ["taftar", "daptar", "daftr"], 1],
    ["o'qituvchi", ["o'qtuvchi", "uqituvchi", "o'qituvchy"], 1], ["Vatan", ["Vaten", "Votan", "Vatin"], 1], ["mehmon", ["mexmon", "memon", "mehmun"], 2],
    ["san'at", ["sanat", "sana't", "san'ot"], 2], ["jamiyat", ["jamiyyat", "jamyat", "jamiat"], 2],
    ["iqtisodiyot", ["iqtisodiyat", "iqtisodyot", "iqtisodiyod"], 2], ["mas'uliyat", ["masuliyat", "mas'uliyot", "mas'ulyat"], 2],
    ["qal'a", ["qala", "qal'o", "qa'la"], 2], ["she'r", ["sheer", "she'ir", "sh'er"], 2], ["ta'lim", ["talim", "ta'lym", "taa'lim"], 2],
    ["e'tibor", ["etibor", "e'tiboor", "e'tibar"], 2], ["xabar", ["habar", "xabbar", "xaber"], 3],
    ["hamma", ["xamma", "hama", "hammo"], 2], ["hayot", ["xayot", "hayat", "hayyot"], 2], ["xalq", ["xallq", "xaliq", "xalk"], 2],
    ["tarix", ["tarih", "tarixx", "torix"], 2], ["paxta", ["pahta", "paxto", "pagta"], 2], ["muhim", ["muxim", "muhum", "mihim"], 2],
    ["bog'cha", ["bogcha", "boqcha", "bog'icha"], 1], ["g'alaba", ["galaba", "g'alabo", "qalaba"], 1], ["ishxona", ["ishhona", "ishxono", "isxona"], 3],
    ["kitobxon", ["kitobhon", "kitopxon", "kitobxo'n"], 3], ["xursand", ["hursand", "xursant", "xurisand"], 3], ["inson", ["insun", "inso'n", "insoun"], 1]
  ];
  function genImlo(L) {
    var pool = IMLO.filter(function (x) { return x[2] === L; }); if (!pool.length) pool = IMLO;
    var x = pick(pool);
    return Q("Qaysi so'z to'g'ri yozilgan?", x[0], x[1], ["To'g'ri yozilishi: " + x[0] + "."]);
  }
  var ANT = [["katta", "kichik"], ["issiq", "sovuq"], ["oq", "qora"], ["baland", "past"], ["uzun", "qisqa"], ["keng", "tor"], ["yaxshi", "yomon"], ["tez", "sekin"],
    ["kun", "tun"], ["og'ir", "yengil"], ["do'st", "dushman"], ["boy", "kambag'al"], ["shirin", "achchiq"], ["eski", "yangi"], ["kirmoq", "chiqmoq"]];
  var SIN = [["chiroyli", "go'zal"], ["botir", "jasur"], ["do'st", "o'rtoq"], ["aqlli", "dono"], ["xursand", "shod"], ["katta", "ulkan"], ["yurt", "vatan"],
    ["baxt", "saodat"], ["ozod", "erkin"], ["sovg'a", "tuhfa"], ["chehra", "yuz"], ["ozoda", "toza"], ["mehnatkash", "tirishqoq"]];
  function genSinAnt(L) {
    var isA = Math.random() < 0.55, P = isA ? ANT : SIN, p = pick(P), dir = R(0, 1), w = p[dir], a = p[1 - dir];
    // o'lcham va tezlik so'zlari bir-biriga chalg'ituvchi bo'lmaydi (munozara chiqmasligi uchun)
    var CL = { katta: 1, kichik: 1, baland: 1, past: 1, uzun: 1, qisqa: 1, keng: 1, tor: 1, ulkan: 1, tez: 2, sekin: 2 };
    var bad = {}; bad[w] = 1; bad[a] = 1;
    SIN.forEach(function (x) { if (x[0] === w || x[1] === w || x[0] === a || x[1] === a) { bad[x[0]] = 1; bad[x[1]] = 1; } });
    var pool = [];
    ANT.concat(SIN).forEach(function (x) {
      x.forEach(function (o) { if (!bad[o] && pool.indexOf(o) < 0 && !(CL[o] && (CL[o] === CL[w] || CL[o] === CL[a]))) pool.push(o); });
    });
    var wr = shuffle(pool).slice(0, 4);
    if (!isA) ANT.forEach(function (x) { if (x[0] === w || x[1] === w) wr[0] = x[0] === w ? x[1] : x[0]; });   // antonim — yaxshi chalg'ituvchi
    return Q("<b>" + w + "</b> so'zining " + (isA ? "antonimi (zid ma'nolisi)" : "sinonimi (ma'nodoshi)") + " qaysi?", a, wr,
      [w + " — " + a + (isA ? ": ma'nosi qarama-qarshi so'zlar." : ": ma'nosi yaqin so'zlar.")]);
  }
  var O3 = [
    [1, "O'zbek tilida nechta unli tovush bor?", "6", ["5", "7", "8", "10"], "Unlilar: a, e, i, o, u, o'."],
    [1, "Qaysi harf unli tovushni bildiradi?", "o'", ["g'", "sh", "ng"], "Unlilar: a, e, i, o, u, o'."],
    [1, "Qaysi harf undosh tovushni bildiradi?", "g'", ["o'", "u", "e"], "g', sh, ch, ng — undosh tovushlar."],
    [1, "So'zda bo'g'inlar soni nimaga teng?", "Unlilar soniga", ["Undoshlar soniga", "Harflar soniga", "Doim ikkiga"], "Har bir bo'g'inda bitta unli bo'ladi."],
    [1, "Antonimlar qanday so'zlar?", "Ma'nosi qarama-qarshi so'zlar", ["Ma'nosi yaqin so'zlar", "Talaffuzi bir xil so'zlar", "Eskirgan so'zlar"], "Masalan: katta — kichik."],
    [1, "Sinonimlar qanday so'zlar?", "Ma'nosi yaqin so'zlar", ["Ma'nosi qarama-qarshi so'zlar", "Shakli bir xil so'zlar", "Yangi so'zlar"], "Masalan: chiroyli — go'zal."],
    [2, "Shakli bir xil, ma'nosi har xil so'zlar nima deyiladi?", "Omonimlar", ["Sinonimlar", "Antonimlar", "Paronimlar"], "Masalan: \"yoz\" (fasl) — \"yoz\" (yozmoq fe'li)."],
    [2, "Tutuq belgisi (') qaysi so'zda to'g'ri ishlatilgan?", "ma'no", ["ma'ktab", "ki'tob", "da'ftar"], "Tutuq belgisi: ma'no, she'r, ta'lim, san'at."],
    [2, "\"Sh\" va \"ch\" harf birikmalari nechta tovushni bildiradi?", "Har biri bitta tovushni", ["Har biri ikkita tovushni", "Uchta tovushni", "Hech qanday tovushni"], "sh, ch, ng — bitta undosh tovushni ifodalaydi."],
    [2, "Qaysi so'z ikki bo'g'inli?", "kitob", ["kutubxona", "o'qituvchi", "matematika"], "ki-tob — 2 ta bo'g'in."],
    [3, "Qaysi undosh jarangsiz?", "p", ["b", "d", "z", "g"], "Jarangsiz undoshlar: p, t, k, s, f, sh, ch, x, h, q."],
    [3, "Qaysi undosh jarangli?", "b", ["p", "t", "s", "k"], "Jarangli undoshlar: b, d, g, z, v, j, g' va boshqalar."],
    [3, "Jarangli <b>d</b> undoshining jarangsiz jufti qaysi?", "t", ["p", "k", "s"], "Juftlar: b — p, d — t, g — k, z — s, v — f."],
    [3, "Jarangli <b>z</b> undoshining jarangsiz jufti qaysi?", "s", ["t", "p", "k"], "Juftlar: b — p, d — t, g — k, z — s, v — f."],
    [3, "Tovushlarni o'rganuvchi tilshunoslik bo'limi qaysi?", "Fonetika", ["Leksikologiya", "Morfologiya", "Sintaksis"], "Leksikologiya — so'z, morfologiya — so'z turkumlari, sintaksis — gap."],
    [3, "So'zning lug'aviy ma'nosini o'rganuvchi bo'lim qaysi?", "Leksikologiya", ["Fonetika", "Sintaksis", "Orfografiya"], "Leksikologiya — so'z va uning ma'nolari haqidagi bo'lim."],
    [3, "To'g'ri yozish qoidalarini o'rganuvchi bo'lim qaysi?", "Orfografiya", ["Orfoepiya", "Fonetika", "Sintaksis"], "Orfoepiya — to'g'ri talaffuz qoidalari."],
    [3, "Gap va so'z birikmalarini o'rganuvchi bo'lim qaysi?", "Sintaksis", ["Morfologiya", "Fonetika", "Leksikologiya"], "Morfologiya so'z turkumlarini o'rganadi."],
    [1,"Nutq tovushlarini yozuvda ifodalovchi belgi nima deyiladi?","Harf",["Tovush","Bo'g'in","Urg'u"],"Tovushni eshitamiz va aytamiz, harfni esa ko'ramiz va yozamiz."],
    [1,"Talaffuzida havo og'iz bo'shlig'ida to'siqqa uchramaydigan tovushlar qaysilar?","Unlilar",["Undoshlar","Jarangsiz undoshlar","Sonor undoshlar"],"Unlilar faqat ovozdan iborat, havo erkin chiqadi."],
    [1,"Undosh tovushlar hosil bo'lishida nima sodir bo'ladi?","Havo oqimi to'siqqa uchraydi",["Havo erkin chiqadi","Faqat ovoz paychalari ishlaydi","Tovush cho'ziladi"],"Undoshlar talaffuzida havo tishlar, lablar yoki tilda to'siqqa uchraydi."],
    [1,"«Maktab» so'zi necha bo'g'indan iborat?","2 ta",["1 ta","3 ta","4 ta"],"mak-tab: ikkita unli — ikkita bo'g'in."],
    [1,"«O'qituvchi» so'zi necha bo'g'indan iborat?","4 ta",["3 ta","5 ta","2 ta"],"o'-qi-tuv-chi: to'rtta unli — to'rtta bo'g'in."],
    [1,"«Gul» so'zi necha bo'g'indan iborat?","1 ta",["2 ta","3 ta","0 ta"],"So'zda bitta unli bor, demak bitta bo'g'in."],
    [1,"«Kutubxona» so'zi necha bo'g'indan iborat?","4 ta",["3 ta","5 ta","2 ta"],"ku-tub-xo-na: to'rtta bo'g'in."],
    [1,"So'roq gapning oxiriga qaysi tinish belgisi qo'yiladi?","So'roq belgisi (?)",["Nuqta (.)","Vergul (,)","Ikki nuqta (:)"],"So'roq gaplar so'roq belgisi bilan tugaydi."],
    [1,"Darak gapning oxiriga odatda qaysi tinish belgisi qo'yiladi?","Nuqta (.)",["So'roq belgisi (?)","Vergul (,)","Tire (—)"],"Xabar bildiruvchi darak gap nuqta bilan tugaydi."],
    [1,"Kuchli his-hayajon bilan aytilgan gap oxiriga qaysi belgi qo'yiladi?","Undov belgisi (!)",["Nuqta (.)","Vergul (,)","Ikki nuqta (:)"],"His-hayajonli gaplar undov belgisi bilan tugaydi."],
    [1,"«Farzand (erkak)» ma'nosidagi so'zning to'g'ri yozilishini toping.","o'g'il",["og'il","o'gil","ogil"],"O' va g' harflari tutuq belgili yoziladi: o'g'il."],
    [1,"«Yutuq, zafar» ma'nosidagi so'zning to'g'ri yozilishini toping.","g'alaba",["galaba","g'aloba","galoba"],"To'g'ri yozilishi: g'alaba."],
    [1,"«Turmush, umr» ma'nosidagi so'zning to'g'ri yozilishini toping.","hayot",["xayot","hayod","xayod"],"«Hayot» so'zi h harfi bilan yoziladi."],
    [1,"«Millat, el» ma'nosidagi so'zning to'g'ri yozilishini toping.","xalq",["halq","xalk","halk"],"«Xalq» so'zi x va q harflari bilan yoziladi."],
    [1,"Qo'shma ot to'g'ri yozilgan variantni toping.","toshbaqa",["tosh-baqa","toshbaqqa","toshbaka"],"Qo'shma otlar qo'shib yoziladi: toshbaqa."],
    [1,"Juft so'zlar qanday yoziladi?","Chiziqcha bilan: aka-uka",["Qo'shib: akauka","Vergul bilan: aka, uka","Qo'shtirnoq ichida: «aka» «uka»"],"Juft so'zlar chiziqcha bilan yoziladi: aka-uka, ota-ona."],
    [1,"«-mi» so'roq yuklamasi qanday yoziladi?","So'zga qo'shib: Keldingmi?",["Ajratib: Kelding mi?","Chiziqcha bilan: Kelding-mi?","Qavs ichida: Kelding(mi)?"],"-mi so'roq yuklamasi so'zga qo'shib yoziladi."],
    [1,"Ko'chirma gap qaysi belgilar ichiga olinadi?","Qo'shtirnoq",["Qavs","Vergul","Tire"],"Ko'chirma gap qo'shtirnoq ichida yoziladi."],
    [1,"Uyushiq bo'laklar orasiga qaysi tinish belgisi qo'yiladi?","Vergul",["Nuqta","Ikki nuqta","Qo'shtirnoq"],"Bog'lovchisiz uyushiq bo'laklar vergul bilan ajratiladi: olma, nok, uzum."],
    [1,"Imlo lug'ati nima uchun kerak?","So'zlarning to'g'ri yozilishini bilish uchun",["So'zlarning tarixini bilish uchun","Tarjima qilish uchun","Sinonim topish uchun"],"Imlo lug'atida so'zlarning to'g'ri yozilishi berilgan."],
    [2,"Qaysi qatorda faqat lablangan unlilar berilgan?","o, u, o'",["i, e, a","a, u, i","e, o', i"],"Lablangan unlilar talaffuzida lablar cho'chchayadi: o, u, o'."],
    [2,"Qaysi qatorda faqat lablanmagan unlilar berilgan?","i, e, a",["o, u, o'","u, e, a","i, o', a"],"i, e, a unlilari talaffuzida lablar ishtirok etmaydi."],
    [2,"Qaysi unlilar tor unlilar hisoblanadi?","i, u",["a, o","e, o'","a, e"],"i va u talaffuzida og'iz eng kam ochiladi — tor unlilar."],
    [2,"Qaysi unlilar keng unlilar hisoblanadi?","a, o",["i, u","e, i","u, o'"],"a va o talaffuzida og'iz keng ochiladi."],
    [2,"Jarangli undoshlar qanday hosil bo'ladi?","Ovoz va shovqin ishtirokida",["Faqat shovqindan","Faqat ovozdan","Havo to'siqsiz chiqqanda"],"Jarangli undoshda ovoz paychalari titraydi va shovqin ham bo'ladi."],
    [2,"Jarangsiz undoshlar qanday hosil bo'ladi?","Faqat shovqindan",["Ovoz va shovqindan","Faqat ovozdan","Havo to'siqsiz chiqqanda"],"Jarangsiz undoshlarda ovoz paychalari titramaydi."],
    [2,"Jarangli g undoshining jarangsiz jufti qaysi?","k",["q","x","h"],"g — k jufti: jarangli va jarangsiz."],
    [2,"Jarangli v undoshining jarangsiz jufti qaysi?","f",["p","b","s"],"v — f jufti lab-tish undoshlaridir."],
    [2,"Jarangsiz p undoshining jarangli jufti qaysi?","b",["d","m","v"],"b — p jufti lab undoshlaridir."],
    [2,"Qaysi undosh sonor undosh hisoblanadi?","m",["p","s","k"],"Sonor undoshlarda ovoz shovqindan ustun turadi: m, n, l, r."],
    [2,"Qaysi undosh lab undoshi?","b",["k","q","g"],"b, p, m undoshlari ikki lab ishtirokida hosil bo'ladi."],
    [2,"So'zda urg'u nima?","Bir bo'g'inning kuchliroq aytilishi",["So'zning oxirgi harfi","Unlining cho'zilishi","Ikki so'zning qo'shilishi"],"Urg'uli bo'g'in boshqalaridan kuchliroq va balandroq aytiladi."],
    [2,"O'zbek tilida urg'u odatda qaysi bo'g'inga tushadi?","Oxirgi bo'g'inga",["Birinchi bo'g'inga","Ikkinchi bo'g'inga","Har doim o'rtadagi bo'g'inga"],"O'zbek tilida urg'u ko'pincha so'zning oxirgi bo'g'iniga tushadi: kitob, maktab."],
    [2,"Qaysi so'zni qatordan qatorga bo'g'inlab ko'chirib bo'lmaydi?","ona",["kitob","daftar","maktab"],"Bir harfli bo'g'in qatorda qoldirilmaydi va ko'chirilmaydi: o-na bo'linmaydi."],
    [2,"Qaysi so'z qatordan qatorga to'g'ri ko'chirilgan?","mak-tab",["ma-ktab","makt-ab","m-aktab"],"So'z bo'g'in chegarasidan ko'chiriladi: mak-tab."],
    [2,"Ko'chirishda sh, ch, ng harf birikmalari qanday ko'chiriladi?","Ajratilmaydi, bir harf kabi ko'chiriladi",["Ikki qatorga ajratiladi","Faqat sh ajratiladi","Faqat ng ajratiladi"],"sh, ch, ng bitta tovushni bildirgani uchun bo'linmaydi: ki-shi, de-ngiz."],
    [2,"Qaysi so'zda n va g harflari alohida ikki tovushni bildiradi?","senga",["dengiz","singil","tong"],"sen+ga: n va g alohida tovushlar; dengiz, singil, tong so'zlarida ng bitta tovush."],
    [2,"Qaysi harf jo'ja va jurnal so'zlarida ikki xil tovushni ifodalaydi?","j",["g","x","h"],"j harfi jo'ja so'zida [dj], jurnal so'zida [j] tovushini bildiradi."],
    [2,"Tutuq belgisi to'g'ri qo'yilgan so'zni toping.","ta'lim",["tal'im","t'alim","talim"],"Tutuq belgisi unlidan keyin qo'yiladi: ta'lim, ma'no, san'at."],
    [2,"«Gullab-yashnagan (yurt)» ma'nosidagi so'zning to'g'ri yozilishini toping.","obod",["obot","abod","abot"],"So'z oxiridagi d jarangsiz aytilsa ham d bilan yoziladi: obod."],
    [2,"«Niyat, murod» ma'nosidagi so'zning to'g'ri yozilishini toping.","maqsad",["maqsat","maksad","maxsad"],"To'g'ri yozilishi: maqsad."],
    [2,"«Do'st» so'ziga -lik qo'shilgan to'g'ri shaklni toping.","do'stlik",["dostlik","do'slik","do'sdlik"],"Asos «do'st» saqlanadi: do'st + lik = do'stlik."],
    [2,"«Et» ma'nosidagi so'zning to'g'ri yozilishini toping.","go'sht",["go'sh","gosht","go'shd"],"«Go'sht» so'zi oxiridagi t bilan yoziladi."],
    [2,"«Shirin» so'zining antonimi to'g'ri yozilgan variantni toping.","achchiq",["achiq","achchik","acchiq"],"«Achchiq» so'zida ch qo'sh yoziladi."],
    [2,"«Qishloq» so'ziga jo'nalish kelishigi qo'shimchasi qo'shilsa, qanday yoziladi?","qishloqqa",["qishloqga","qishloqa","qishlokka"],"q bilan tugagan so'zga -ga emas, -qa qo'shiladi: qishloqqa."],
    [2,"«Eshik» so'ziga jo'nalish kelishigi qo'shimchasi qo'shilsa, qanday yoziladi?","eshikka",["eshikga","eshika","eshiqqa"],"k bilan tugagan so'zga -ka qo'shiladi: eshikka."],
    [2,"«Ona» so'ziga «-im» egalik qo'shimchasi qo'shilsa, qanday yoziladi?","onam",["onaim","onayim","onaam"],"Unli bilan tugagan so'zga -im emas, -m qo'shiladi: onam."],
    [2,"«Daryo» so'ziga uchinchi shaxs egalik qo'shimchasi qo'shilsa, qanday yoziladi?","daryosi",["daryoi","daryoyi","daryos"],"Unli bilan tugagan so'zga -si qo'shiladi: daryosi."],
    [3,"«O'rtoq» so'ziga «-im» qo'shilsa, qanday yoziladi?","o'rtog'im",["o'rtoqim","o'rtogim","o'rtokim"],"q bilan tugagan ko'p bo'g'inli so'zga unli bilan boshlanuvchi qo'shimcha qo'shilsa, q g' ga aylanadi."],
    [3,"«Yurak» so'ziga «-i» qo'shilsa, qanday yoziladi?","yuragi",["yuraki","yurag'i","yurakki"],"k bilan tugagan ko'p bo'g'inli so'zda k g ga aylanadi: yurak — yuragi."],
    [3,"«Ko'ylak» so'ziga «-im» qo'shilsa, qanday yoziladi?","ko'ylagim",["ko'ylakim","ko'ylag'im","ko'ylakkim"],"k unli oldidan g ga aylanadi: ko'ylak — ko'ylagim."],
    [3,"«Tilak» so'ziga «-im» qo'shilsa, qanday yoziladi?","tilagim",["tilakim","tilag'im","tilakkim"],"k unli oldidan g ga aylanadi: tilak — tilagim."],
    [3,"«Og'iz» so'ziga «-im» qo'shilsa, qanday yoziladi?","og'zim",["og'izim","ogzim","og'iizm"],"Ikkinchi bo'g'indagi i unlisi tushib qoladi: og'iz — og'zim."],
    [3,"«Burun» so'ziga «-i» qo'shilsa, qanday yoziladi?","burni",["buruni","burnu","burunni"],"Ikkinchi bo'g'indagi u unlisi tushib qoladi: burun — burni."],
    [3,"«Ko'ngil» so'ziga «-im» qo'shilsa, qanday yoziladi?","ko'nglim",["ko'ngilim","ko'ngillim","ko'nglum"],"i unlisi tushib qoladi: ko'ngil — ko'nglim."],
    [3,"«O'g'il» so'ziga «-i» qo'shilsa, qanday yoziladi?","o'g'li",["o'g'ili","o'gli","o'g'lli"],"i unlisi tushib qoladi: o'g'il — o'g'li."],
    [3,"«Shahar» so'ziga «-im» qo'shilsa, qanday yoziladi?","shahrim",["shaharim","shahirim","shaharm"],"a unlisi tushib qoladi: shahar — shahrim."],
    [3,"«Sariq» so'ziga «-ish» qo'shilsa, qanday yoziladi?","sarg'ish",["sariqish","sarig'ish","sarqish"],"i unlisi tushadi va q g' ga aylanadi: sariq — sarg'ish."],
    [3,"«Ikki» so'ziga «-ov» qo'shilsa, qanday yoziladi?","ikkov",["ikkiov","ikkiyov","ikov"],"Oxirgi i unlisi tushib qoladi: ikki — ikkov."],
    [3,"Tutuq belgisi qanday vazifani bajaradi?","Talaffuzdagi to'xtam yoki cho'ziqlikni bildiradi",["Bosh harfni bildiradi","So'z oxirini bildiradi","Qo'shma so'zlarni ajratadi"],"Tutuq belgisi: ma'no, sur'at, ta'lim, san'at."],
    [3,"To'g'ri talaffuz me'yorlarini o'rganuvchi bo'lim qaysi?","Orfoepiya",["Orfografiya","Leksikologiya","Morfologiya"],"Orfoepiya — to'g'ri talaffuz, orfografiya — to'g'ri yozish qoidalari."],
    [3,"Harflar va yozuv belgilarini o'rganuvchi bo'lim qaysi?","Grafika",["Fonetika","Sintaksis","Leksikologiya"],"Grafika alifbo, harflar va yozuv belgilarini o'rganadi."],
    [3,"Lotin yozuviga asoslangan o'zbek alifbosini joriy etish to'g'risidagi qonun qaysi yili qabul qilingan?","1993-yilda",["1989-yilda","1991-yilda","2000-yilda"],"Qonun 1993-yil 2-sentabrda qabul qilingan, 1995-yilda unga o'zgartirishlar kiritilgan."],
    [3,"Undalma gapda qaysi tinish belgisi bilan ajratiladi?","Vergul",["Nuqta","Qo'shtirnoq","Qavs"],"Undalma vergul bilan ajratiladi: Do'stim, bu yoqqa kel."],
    [3,"Qaysi gapda tinish belgisi to'g'ri qo'yilgan?","Anvar, darsga kech qolma!",["Anvar darsga, kech qolma!","Anvar darsga kech, qolma!","Anvar, darsga kech, qolma!"],"Undalma (Anvar) vergul bilan ajratiladi, gap oxirida undov belgisi."]
  ];
  topic("o3", "Ona tili · Fonetika va imlo", O3, [
    { p: 0.3, fn: genUnli }, { p: 0.25, fn: genImlo }, { p: 0.25, fn: genSinAnt }
  ]);
})();
