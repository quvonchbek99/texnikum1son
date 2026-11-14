/* Detektiv ishlari (Sherlock bo‘limi): Konan Doylning 60 ta asari, Agata Kristi (Puaro, Marpl), Edgar Po, Chesterton, Kollinz, Chexov asarlari asosida mantiqiy tergov ishlari + mantiq ishlari.
   Har bir ishda 3 ta savol: asosiy (savol/variantlar/javob/izoh) + qoshimcha[] (2 ta).
   sherlock.html va Sinf viktorinasi (m11) shu fayldan oladi. det — detektiv, kitob — to‘plam, asar — asl asar, javob — to‘g‘ri variant indeksi. */
window.SHERLOCK_DETEKTIVLAR = [
 {
  "id": "xolms",
  "nom": "Sherlok Xolms",
  "muallif": "Artur Konan Doyl",
  "belgi": "🔍"
 },
 {
  "id": "puaro",
  "nom": "Herkul Puaro",
  "muallif": "Agata Kristi",
  "belgi": "🎩"
 },
 {
  "id": "marpl",
  "nom": "Miss Marpl",
  "muallif": "Agata Kristi",
  "belgi": "🧶"
 },
 {
  "id": "dyupen",
  "nom": "Ogyust Dyupen",
  "muallif": "Edgar Allan Po",
  "belgi": "🕯️"
 },
 {
  "id": "braun",
  "nom": "Ota Braun",
  "muallif": "G. K. Chesterton",
  "belgi": "🌂"
 },
 {
  "id": "klassika",
  "nom": "Boshqa klassika",
  "muallif": "Kollinz, Chexov",
  "belgi": "📚"
 },
 {
  "id": "mantiq",
  "nom": "Mantiq ishlari",
  "muallif": "Kuvonch Academy",
  "belgi": "🧩"
 }
];
window.SHERLOCK_KITOBLAR = [
 {
  "id": "roman",
  "nom": "Romanlar",
  "yil": "1887–1915",
  "det": "xolms"
 },
 {
  "id": "sarguzasht",
  "nom": "Sherlok Xolmsning sarguzashtlari",
  "yil": "1892",
  "det": "xolms"
 },
 {
  "id": "xotira",
  "nom": "Sherlok Xolms haqida xotiralar",
  "yil": "1894",
  "det": "xolms"
 },
 {
  "id": "qaytish",
  "nom": "Sherlok Xolmsning qaytishi",
  "yil": "1905",
  "det": "xolms"
 },
 {
  "id": "tazim",
  "nom": "Uning so‘nggi ta’zimi",
  "yil": "1917",
  "det": "xolms"
 },
 {
  "id": "arxiv",
  "nom": "Sherlok Xolms arxivi",
  "yil": "1927",
  "det": "xolms"
 },
 {
  "id": "puaro",
  "nom": "Herkul Puaro ishlari",
  "yil": "1920–1975",
  "det": "puaro"
 },
 {
  "id": "marpl",
  "nom": "Miss Marpl ishlari",
  "yil": "1927–1976",
  "det": "marpl"
 },
 {
  "id": "dyupen",
  "nom": "Edgar Po hikoyalari",
  "yil": "1841–1844",
  "det": "dyupen"
 },
 {
  "id": "braun",
  "nom": "Ota Braun hikoyalari",
  "yil": "1910–1911",
  "det": "braun"
 },
 {
  "id": "klassika",
  "nom": "Boshqa klassik detektivlar",
  "yil": "1868–1884",
  "det": "klassika"
 },
 {
  "id": "mantiq",
  "nom": "Holmes uslubidagi mantiq ishlari",
  "yil": "Kuvonch Academy",
  "det": "mantiq"
 }
];
window.SHERLOCK_ISHLAR = [
 {
  "det": "xolms",
  "kitob": "roman",
  "asar": "Qizil tusdagi etyud",
  "yil": 1887,
  "sarlavha": "Afg‘onistondan kelgan doktor",
  "hikoya": "Holmes yangi tanishi doktor <em>Uotson</em> bilan qo‘l berib ko‘rishdi-yu, darhol: «Siz Afg‘onistonda bo‘lgansiz, shekilli», dedi. Uotson hayron qoldi. Holmes ko‘rgan dalillar: Uotsonning yuzi qorayib ketgan, lekin bilaklari oppoq; yuzi so‘lg‘in va horg‘in; chap qo‘lini qimirlatmay, ehtiyot qilib tutadi; qaddi-qomati harbiylarnikidek tik; o‘zi esa shifokor. Vaqt — 1880-yil, ingliz armiyasi o‘sha paytda Afg‘onistonda urushayotgan edi.",
  "savol": "Holmesning xulosasi qaysi dalillar zanjiriga tayanadi?",
  "variantlar": [
   "Uotsonning kiyimi va poyabzalidagi chang Sharq yo‘llarining changiga o‘xshardi — Holmes changning rangidan yurtni aniqladi",
   "Uotson Londonga kelgani haqidagi gazeta e’lonini Holmes ertalab o‘qigan va unda Afg‘oniston tilga olingan edi",
   "Yuz qora, bilak oq — tropik quyosh; horg‘in yuz — kasallik; ehtiyot qilingan qo‘l — yara; harbiy qomat va shifokorlik — harbiy shifokor. O‘sha yili bunday holga tushish mumkin bo‘lgan joy — Afg‘oniston",
   "Holmes shunchaki eng ko‘p uchraydigan javobni taxmin qildi: o‘sha paytda ko‘p shifokorlar Afg‘onistondan qaytayotgan edi"
  ],
  "javob": 2,
  "izoh": "Holmes dalillarni zanjir qilib bog‘laydi. Yuz qora, bilak oq — demak qoralik tug‘ma emas, issiq iqlimda kuygan. Yuz horg‘in — og‘ir kunlar va kasallikni boshidan kechirgan. Qo‘lini ehtiyot qiladi — yaralangan. Harbiy qomat va shifokorlik — harbiy shifokor. 1880-yilda ingliz harbiy shifokori tropik quyoshda yaralanib, kasallanib qaytishi mumkin bo‘lgan joy — Afg‘oniston. Bu taxmin emas, dalillardan chiqqan yagona xulosa.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Uotsonning yuzi qora, bilaklari esa oq ekanligi nimani ko‘rsatadi?",
    "variantlar": [
     "U tug‘ilganidan qora tanli",
     "U ko‘p vaqtini kitob o‘qib o‘tkazadi",
     "Qoralik tug‘ma emas — u yaqinda issiq iqlimda quyoshda kuygan",
     "U yaqinda kasal bo‘lib, terisi o‘zgargan"
    ],
    "javob": 2,
    "izoh": "Agar qoralik tug‘ma bo‘lsa, bilaklar ham qora bo‘lardi. Kiyim yopib turgan joy oq qolgan — demak, bu quyosh izi."
   },
   {
    "savol": "Holmes Uotsonning yaradorligini qaysi belgidan bildi?",
    "variantlar": [
     "U chap qo‘lini qimirlatmay, ehtiyot qilib tutardi",
     "Yuzi horg‘in edi",
     "Qaddi harbiylarnikidek tik edi",
     "U shifokor ekanini aytgan"
    ],
    "javob": 0,
    "izoh": "Horg‘in yuz — kasallik belgisi, tik qad — harbiylik belgisi. Yarani esa qo‘lni ayab, g‘ayritabiiy tutish ko‘rsatadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "roman",
  "asar": "To‘rtlik belgisi",
  "yil": 1890,
  "sarlavha": "Akamning soati",
  "hikoya": "Uotson Holmesni sinamoqchi bo‘ldi va unga yaqinda qo‘liga tushgan eski cho‘ntak soatini uzatdi: «Bu soat egasi haqida nima deya olasiz?» Holmes soatni ko‘zdan kechirdi: qopqog‘ida <em>H. W.</em> bosh harflari bor; soat qimmatbaho, ellik yilcha oldin yasalgan; kalit teshigi atrofi mayda tirnalishlarga to‘la — kalitni qaltiroq qo‘l bilan tiqishga uringan; ichki qopqoqda garovxona ustalari qoldiradigan to‘rtta raqam tirnab yozilgan. Uotsonning familiyasi ham W harfi bilan boshlanadi.",
  "savol": "Holmes soat egasi haqida qanday xulosaga keldi?",
  "variantlar": [
   "Soat otasidan to‘ng‘ich o‘g‘ilga — Uotsonning akasiga o‘tgan; u ichkilikka berilgan, qo‘li qaltiragan va pulga qiynalib, soatni bir necha bor garovga qo‘ygan",
   "Soat egasi soatsoz usta bo‘lgan: ichki qopqoqdagi raqamlar uning ta’mir belgilari, tirnalishlar esa ish asboblaridan qolgan",
   "Soat Uotsonning o‘ziga tegishli: H. W. — uning ismi, tirnalishlar esa urushdagi yarador qo‘lidan qolgan",
   "Soat egasi tartibli va boy odam: qimmat soatni ehtiyot qilib, uni muntazam ustaga ko‘rsatib turgan"
  ],
  "javob": 0,
  "izoh": "Ellik yillik soat va W harfi — oilaviy meros. Odatda meros to‘ng‘ich o‘g‘ilga o‘tadi va unda otaning ismi bo‘ladi (H. W.). Kalit teshigi atrofidagi tirnalishlar — har kecha qaltiroq qo‘l bilan soat burab qo‘yilgan; hushyor odam bunchalik adashmaydi. Ichki qopqoqdagi raqamlar — garovxona belgisi: soat bir necha marta garovga qo‘yilgan, demak egasi tez-tez pulga muhtoj bo‘lgan, ba’zan esa uni qaytarib olishga qurbi yetgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Soat qopqog‘idagi H. W. harflari va uning yoshi nimani bildiradi?",
    "variantlar": [
     "Soatni do‘kondan yangi sotib olishgan",
     "H. W. — soatsozning belgisi",
     "Soat begona odamdan sovg‘a",
     "Soat oilaviy meros — otadan qolgan va odatda to‘ng‘ich o‘g‘ilga o‘tgan"
    ],
    "javob": 3,
    "izoh": "Ellik yillik soat va familiya bosh harfi — oilaviy buyum. Meros an’anaga ko‘ra katta o‘g‘ilga o‘tadi."
   },
   {
    "savol": "Ichki qopqoqdagi to‘rtta tirnab yozilgan raqam nima haqida dalolat beradi?",
    "variantlar": [
     "Soat to‘rt marta ta’mirlangan",
     "Soat bir necha marta garovxonaga qo‘yilgan — egasi tez-tez pulga muhtoj bo‘lgan",
     "Bu soatning seriya raqami",
     "Bu egasining tug‘ilgan sanasi"
    ],
    "javob": 1,
    "izoh": "Garovxonalar qabul qilgan buyumga raqam tirnab yozadi. To‘rtta raqam — to‘rt marta garov: egasining ahvoli goh yomonlashgan, goh tuzalgan."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "roman",
  "asar": "Baskervillar iti",
  "yil": 1902,
  "sarlavha": "Olovli ko‘zlar",
  "hikoya": "Baskervillar qasri yonidagi botqoqlikda ser <em>Charlz Baskervil</em> to‘satdan vafot etdi — shifokorlar yurak xurujini aytishdi. Uning yuzida dahshatli qo‘rquv qotib qolgan, jasad yaqinida esa ulkan it panjasining izlari bor edi. Atrofda qadimiy afsona yuradi: Baskervillar oilasini dahshatli arvoh-it ta’qib qiladi. Kechalari botqoqda og‘zi va ko‘zlaridan olov sachratib yuguradigan bahaybat itni ko‘rganlar ham bor. Holmes oxiri o‘sha itni otib to‘xtatdi va yaqindan qaradi: tumshug‘i va boshiga qorong‘ida yaltiraydigan qandaydir moy surtilgan, undan o‘tkir kimyoviy hid kelardi. Qo‘shni tabiatshunos <em>Stapleton</em> botqoqdagi yashirin so‘qmoqlarni hammadan yaxshi bilardi.",
  "savol": "Itning qorong‘ida «olovday» yonib turishining siri nimada edi?",
  "variantlar": [
   "It haqiqatan ham arvoh edi — shuning uchun yonardi",
   "Unga fosforli bo‘yoq surtilgan — fosfor qorong‘ida yaltiraydi; buni itning egasi ataylab qilgan",
   "It yorug‘likni qaytaruvchi suvda cho‘milgan — bu tasodif",
   "Guvohlar qo‘rqib, olovni o‘zlari o‘ylab topishgan"
  ],
  "javob": 1,
  "izoh": "Arvoh moy va kimyoviy hid qoldirmaydi — bular odam qo‘li bilan surtilgan modda belgisi. Fosfor qorong‘ida yaltirab turadi, shuning uchun oddiy, lekin juda katta it «olovli arvoh»ga aylangan. Itni botqoqdagi yashirin joyda boqib, unga fosfor surtgan odam — Stapleton edi: u o‘zini yashirib yurgan, Baskervillar merosiga ko‘z tikkan qarindosh bo‘lib chiqdi. Qoida: g‘ayritabiiy ko‘ringan narsaning ortidan avval tabiiy sababni qidir.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Itning boshidagi yaltiroq moy va o‘tkir kimyoviy hid nimaga ishora qildi?",
    "variantlar": [
     "It botqoqda yashovchi yovvoyi hayvon",
     "Itga ataylab nimadir surtilgan — bu «mo‘jiza» emas, odamning hiylasi",
     "Itni kimdir yaqinda yuvgan",
     "It kasal bo‘lib qolgan"
    ],
    "javob": 1,
    "izoh": "G‘ayritabiiy narsa iz qoldirmaydi; moy va kimyoviy hid esa inson qo‘li bilan surtilgan modda borligini ko‘rsatadi."
   },
   {
    "savol": "Botqoqning yashirin so‘qmoqlarini yaxshi bilishi nega Stapletonni shubhali qiladi?",
    "variantlar": [
     "Botqoqni yaxshi biladigan odam hech qachon jinoyat qilmaydi",
     "U botqoqda adashib qolishdan qo‘rqardi",
     "U itdan qo‘rqqani uchun botqoqqa borardi",
     "Bahaybat itni odamlar ko‘zidan yashirib boqish uchun aynan shunday joy va bilim kerak edi"
    ],
    "javob": 3,
    "izoh": "Katta itni hech kimga ko‘rsatmay boqish uchun yashirin joy kerak. Botqoq ichidagi xavfsiz so‘qmoqni bilgan odam itni o‘sha yerda yashira olardi — Stapleton aynan shunday qilgan."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "roman",
  "asar": "Qo‘rquv vodiysi",
  "yil": 1915,
  "sarlavha": "Yolg‘iz gantel",
  "hikoya": "Birlston qasrida xo‘jayin <em>Duglas</em>ning jasadi topildi: yuzi o‘q zarbidan tanib bo‘lmas holga kelgan. Qasr suv to‘ldirilgan xandaq bilan o‘ralgan, ko‘tarma ko‘prik kechasi ko‘tarib qo‘yilgan edi. Deraza tokchasida qonli poyabzal izi bor. Holmes bitta g‘alati narsaga e’tibor qaratdi: xo‘jayinning sport anjomlari orasida doim ikkita gantel turardi, endi esa bittasi yo‘q. Uyda uni hech kim olmagan.",
  "savol": "Yo‘qolgan gantel nimadan dalolat beradi?",
  "variantlar": [
   "Qotil gantel bilan qurollangan: avval u bilan urib, keyin otgan va dalil qolmasligi uchun gantelni o‘zi bilan olib ketgan",
   "Gantel ancha oldin yo‘qolgan va bu ishga aloqasi yo‘q: Holmes chalg‘ituvchi tafsilotga e’tibor bermasligi kerak edi",
   "Deraza tokchasidagi iz egasi gantelni zinapoya sifatida ishlatib, xandaqdan chiqib olgan",
   "Undan og‘irlik sifatida foydalanilgan: kimdir bir tugun narsani (kiyimni) gantelga bog‘lab, xandaq suviga cho‘ktirgan"
  ],
  "javob": 3,
  "izoh": "Bitta gantel faqat bitta maqsadga yaraydi — og‘ir yuk sifatida. Qasr suv bilan o‘ralgan; yashirilishi kerak bo‘lgan narsani eng oson joy — xandaqqa cho‘ktirishgan. Holmes xandaqdan gantelga bog‘langan kiyim tugunini chiqartirdi. Kiyimning yashirilgani jasad xo‘jayinniki emasligiga ishora bo‘ldi: Duglas tirik edi va hujum qilgan odamni o‘zi o‘ldirib, o‘z o‘limini sahnalashtirgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Qasr xandaq bilan o‘ralgani va ko‘prik ko‘tarilgani nima uchun muhim?",
    "variantlar": [
     "Tashqariga yo‘l yo‘q edi — demak, yashiriladigan narsani qasr ichida yoki xandaqqa yashirish kerak edi",
     "Qotil ko‘prik orqali qochgan",
     "Bu shunchaki qasrning bezagi",
     "Qotil suzib qochgan bo‘lishi aniq"
    ],
    "javob": 0,
    "izoh": "Chiqish yo‘li yopiq bo‘lsa, dalillar ham ichkarida qoladi. Eng qulay «chiqindi joyi» — xandaq suvi."
   },
   {
    "savol": "Deraza tokchasidagi qonli poyabzal izi nima maqsadda qoldirilgan bo‘lishi mumkin?",
    "variantlar": [
     "U haqiqiy qochish yo‘li edi",
     "Bu tasodifiy dog‘",
     "Qotil deraza orqali xandaqdan qochgandek ko‘rinish yaratish uchun",
     "Bu xizmatkorning izi"
    ],
    "javob": 2,
    "izoh": "Bitta yaqqol iz ko‘pincha chalg‘itish uchun qoldiriladi: tergovchilar tashqaridan kelgan qotilni qidirishi kerak edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Bogemiyadagi janjal",
  "yil": 1891,
  "sarlavha": "Yolg‘on yong‘in",
  "hikoya": "Bogemiya qiroli <em>Irena Adler</em>ning qo‘lidagi suratni qaytarishni so‘radi. Surat uning uyida, ammo qayerga yashirilgani noma’lum: uy ikki marta tintuv qilingan, hech narsa topilmagan. Holmes ruhoniy qiyofasida uyga kirdi. Kelishilgan paytda Uotson derazadan xonaga tutun raketasini otdi, ko‘chadagilar «Yong‘in!» deb qichqirishdi. Irena sakrab turib, xonadagi bir joyga yugurdi, keyin to‘xtadi.",
  "savol": "Holmes nima uchun aynan «yong‘in» sahnasini uyushtirdi?",
  "variantlar": [
   "Uydagilarni tashqariga chiqarib, bo‘sh qolgan xonani tinchgina tintuv qilish uchun",
   "Yong‘in xabarini eshitgan odam beixtiyor eng qadrli narsasiga yuguradi — Irena suratning yashirin joyini o‘zi ko‘rsatib qo‘ydi",
   "Tutun bilan suratni yaroqsiz qilib, u boshqa hech kimga kerak bo‘lmasligi uchun",
   "Qo‘shnilarning e’tiborini tortib, politsiyani uyga chaqirish uchun bahona kerak edi"
  ],
  "javob": 1,
  "izoh": "Holmes tintuv bilan topib bo‘lmaydigan joyni egasining o‘ziga ko‘rsattirdi. Xavf paytida odam o‘ylab o‘tirmaydi: bolali ona bolasiga, yolg‘iz ayol zargarlik qutisiga, Irena esa surat yashiringan maxfiy devor panjarasiga intildi. Bu — kuzatishga asoslangan psixologik tajriba: dalilni izlash o‘rniga, dalil egasini uni ko‘rsatishga majburlash.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nima uchun uy ikki marta tintuv qilinsa ham surat topilmadi?",
    "variantlar": [
     "Surat uyda yo‘q edi",
     "Tintuvchilar dangasa edi",
     "Surat har kuni boshqa joyga ko‘chirilardi",
     "Surat maxsus yashirin joyda edi — uni faqat egasi biladigan joyda"
    ],
    "javob": 3,
    "izoh": "Yaxshi yashirilgan narsani tashqaridan qidirib topish qiyin. Shuning uchun Holmes qidirish o‘rniga egasining o‘zini ko‘rsatishga majbur qildi."
   },
   {
    "savol": "Uotsonning vazifasi rejada qanday edi?",
    "variantlar": [
     "Irenani ko‘chaga chaqirib chiqish",
     "Kelishilgan paytda tutun raketasini otib, «Yong‘in!» vahimasini boshlash",
     "Politsiyani olib kelish",
     "Suratni o‘g‘irlab ketish"
    ],
    "javob": 1,
    "izoh": "Reja ikki qismdan iborat edi: Holmes ichkarida kuzatadi, Uotson esa xavf illyuziyasini yaratadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Qizil sochlar ligasi",
  "yil": 1891,
  "sarlavha": "Qizil sochlar ligasi",
  "hikoya": "Lombard (garov do‘koni) egasi <em>Jabez Uilson</em> g‘alati taklif oldi: «Qizil sochlilar ligasi» unga kuniga to‘rt soat ensiklopediyani qo‘lda ko‘chirib yozish evaziga yaxshi pul to‘laydi. Bu ishni unga yordamchisi topib bergan — u arzon maoshga ishlashga rozi bo‘lgan, bo‘sh vaqtini esa yerto‘lada «suratlarni ochish» bilan o‘tkazardi. Sakkiz hafta davomida Uilson har kuni do‘konni yordamchisiga qoldirib, shaharning boshqa qismidagi idoraga borib ishladi. Ko‘chirilgan matnni hech kim bir marta ham tekshirmadi. Keyin liga to‘satdan «yopildi». Holmes do‘kon oldidagi yo‘lakni hassasi bilan taqillatib ko‘rdi va yordamchining shimi tizzalarda yedirilib, kir bo‘lganiga e’tibor berdi. Do‘konning orqa tomonida esa yirik bank joylashgan edi.",
  "savol": "Liga aslida nima maqsadda tuzilgan edi?",
  "variantlar": [
   "Qizil sochli odamlarga yordam berish uchun — xolis xayriya",
   "Ensiklopediyadan qizil sochli odamlar ro‘yxatini tuzish uchun",
   "Uilsonni har kuni do‘kondan uzoqlashtirish uchun — shu vaqtda yerto‘ladan bank omboriga yer osti yo‘li qazilgan",
   "Do‘kon binosini arzon narxda ijaraga olish uchun"
  ],
  "javob": 2,
  "izoh": "Ishning o‘zi ma’nosiz edi: matnni hech kim tekshirmadi, pul esa bemalol to‘landi. Demak liga matndan emas, vaqtdan foydalanardi — Uilson har kuni bir necha soat do‘kondan uzoqda bo‘lishi kerak edi. Yerto‘lada ko‘p vaqt o‘tkazadigan yordamchi, uning tizzalari yedirilgan shimi va orqadagi bank birlashganda javob chiqadi: yordamchi (aslida mashhur jinoyatchi Jon Kley) yerto‘ladan bank omboriga lahm qazigan. Qoida: «Nega bunday bema’ni ishga pul to‘lanyapti?» degan savol ko‘pincha chalg‘itishni ochib beradi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Ko‘chirilgan matnni hech kim tekshirmagani nimani ko‘rsatadi?",
    "variantlar": [
     "Liga a’zolari juda ishonuvchan edi",
     "Matn juda oson edi",
     "Ishning o‘zi ahamiyatsiz edi — muhimi Uilsonning do‘kondan uzoqda bo‘lishi edi",
     "Ligada xodimlar yetishmasdi"
    ],
    "javob": 2,
    "izoh": "Natijasi tekshirilmaydigan ish — bahona. Haqiqiy maqsad ishning o‘zida emas, uning oqibatida: Uilson do‘kondan uzoqda edi."
   },
   {
    "savol": "Liga «yopildi» deb e’lon qilingani nimaga ishora qiladi?",
    "variantlar": [
     "Yer osti yo‘li tayyor bo‘ldi — jinoyat juda yaqin",
     "Liga pulsiz qoldi",
     "Zargar ishni yomon bajardi",
     "Liga boshqa shaharga ko‘chdi"
    ],
    "javob": 0,
    "izoh": "Bahona endi kerak emas — demak, tayyorgarlik tugagan. Holmes o‘sha kechasi bank omborida pistirma qo‘ydi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Shaxsiyat masalasi",
  "yil": 1891,
  "sarlavha": "Kunduzi ko‘rinmagan kuyov",
  "hikoya": "Miss <em>Meri Sazerlend</em>ning kuyovi <em>Xosmer Enjel</em> to‘y kuni izsiz g‘oyib bo‘ldi. Qiz u haqda shuni bilardi: u faqat kechasi uchrashardi; qora ko‘zoynak taqardi, qalin mo‘ylov va soqoli bor edi; shivirlab gapirardi; xatlarini, hatto imzosini ham yozuv mashinkasida terardi. Qizning yosh o‘gay otasi <em>Uindibenk</em> esa aynan shu paytlarda doim «xizmat safarida» bo‘lardi. Holmes Uindibenkdan xat oldi va Enjelning xatlari bilan solishtirdi: ikkala mashinkada «e» harfi xira, «r» harfining dumi singan.",
  "savol": "Xosmer Enjel aslida kim edi?",
  "variantlar": [
   "Qizni chin dildan sevgan, lekin qarzdorlardan yashiringan yigit — shuning uchun faqat kechasi chiqardi",
   "O‘gay ota Uindibenkning o‘zi — niqoblanib, qizning daromadi oilada qolishi uchun uni soxta kuyovga «bog‘lab» qo‘ygan",
   "Qizning onasi yollagan aktyor: ona qizni turmushga berishga shoshayotgan edi",
   "Uindibenkning idorasidagi xizmatchi: u xo‘jayinining mashinkasidan yashirincha foydalanardi"
  ],
  "javob": 1,
  "izoh": "Har bir g‘alatilik bitta maqsadga xizmat qiladi — tanib qolinmaslik: kechasi uchrashuv, qora ko‘zoynak, soxta soqol, shivirlash, qo‘lyozma o‘rniga mashinka. Enjel va Uindibenk hech qachon birga ko‘rinmagan. Hal qiluvchi dalil — mashinkaning o‘ziga xos nuqsonlari: xatlar bitta mashinkada yozilgan. O‘gay ota qizning daromadini yo‘qotmaslik uchun uni yillab «g‘oyib bo‘lgan kuyov»ni kutishga majburlamoqchi bo‘lgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Kuyovning xatlarni, hatto imzosini ham mashinkada yozishi nimaga xizmat qilardi?",
    "variantlar": [
     "U yozishni bilmasdi",
     "U zamonaviy texnikani yaxshi ko‘rardi",
     "Qo‘lyozmasi tanilib qolmasligi uchun",
     "Qiz uning xatini o‘qiy olmasdi"
    ],
    "javob": 2,
    "izoh": "Imzoni ham mashinkada yozish g‘ayritabiiy. Bunday ehtiyotkorlik odam qo‘lyozmasi tanish bo‘lgan joyda tanilib qolishdan qo‘rqqanini ko‘rsatadi."
   },
   {
    "savol": "Hal qiluvchi dalil qaysi?",
    "variantlar": [
     "Ikki xatdagi mashinka nuqsonlari bir xil: «e» xira, «r» dumi singan",
     "Kuyovning qora ko‘zoynagi",
     "Uchrashuvlar faqat kechasi bo‘lgani",
     "O‘gay otaning yoshligi"
    ],
    "javob": 0,
    "izoh": "Boshqa belgilar faqat shubha uyg‘otadi, mashinkaning noyob nuqsonlari esa ikkala xat bitta mashinkada yozilganini isbotlaydi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Boskom vodiysi siri",
  "yil": 1891,
  "sarlavha": "So‘nggi so‘z: «...a rat»",
  "hikoya": "Keksa <em>Makkarti</em> ko‘l bo‘yida o‘ldirildi. O‘g‘li otasining o‘layotganda «...a rat» degan so‘zlarini eshitganini aytdi. Politsiya buni alahlash deb hisobladi. Holmes ma’lum qildi: Makkarti yoshligida Avstraliyada, oltin konlari hududida yashagan; u o‘g‘lini chaqirganda avstraliyaliklarga xos «Kuu-i!» hayqirig‘ini ishlatardi. Viktoriya shtatidagi mashhur kon shaharlaridan birining nomi — <em>Ballarat</em>.",
  "savol": "«...a rat» so‘zlari nimani anglatadi?",
  "variantlar": [
   "Ota qotilni inglizcha «kalamush» (rat) deb so‘kkan — bu uning qotilga nafratini bildiradi",
   "Bu o‘layotgan odamning alahlashi, unda hech qanday ma’no qidirmaslik kerak",
   "Qotilning laqabi «Rat» bo‘lgan va ota uni laqabi bilan chaqirgan",
   "Ota qotilni tanigan va uni «Ballarat»dagi o‘tmishidan kelgan odam deb aytmoqchi bo‘lgan — o‘g‘li so‘zning faqat oxirini eshitgan"
  ],
  "javob": 3,
  "izoh": "O‘layotgan odam tasodifiy so‘z aytmaydi — u qotilni ko‘rsatishga harakat qiladi. «Kuu-i» chaqirig‘i va Avstraliya o‘tmishi bitta yo‘nalishni beradi. «Ballarat» so‘zining oxiri «...a rat» bo‘lib eshitiladi. Demak, qotil — Makkartini Avstraliyadagi o‘tmishidan taniydigan odam. Bu Holmesni haqiqiy qotil — Ballaratdan kelgan Jon Tyornerga olib bordi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "«Kuu-i!» hayqirig‘ining tergov uchun ahamiyati nimada?",
    "variantlar": [
     "U o‘g‘lini chaqirgan oddiy so‘z",
     "U yordam so‘rash belgisi",
     "U qotilning ismi",
     "U Makkartining Avstraliya o‘tmishini va qotil bilan o‘sha yerdan tanishligini ko‘rsatadi"
    ],
    "javob": 3,
    "izoh": "Avstraliyaliklarga xos chaqiriq — o‘tmishdan qolgan odat. Bu tergovni Avstraliyadagi tanishlarga yo‘naltirdi."
   },
   {
    "savol": "Nega o‘g‘il so‘zning faqat oxirini eshitgan bo‘lishi mumkin?",
    "variantlar": [
     "O‘g‘il yolg‘on gapirgan",
     "O‘layotgan odam zaif gapirgan va o‘g‘il uzoqroqdan, endigina yetib kelayotgan edi",
     "Ota faqat «rat» degan",
     "Ota boshqa tilda gapirgan"
    ],
    "javob": 1,
    "izoh": "O‘lim oldidan aytilgan so‘z zaif va qisqa bo‘ladi; tinglovchi esa ko‘pincha urg‘uli oxirgi bo‘g‘inlarni eshitadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Besh apelsin urug‘i",
  "yil": 1891,
  "sarlavha": "Xatlar va kemalar",
  "hikoya": "Openshou oilasi a’zolari ichiga beshta quritilgan apelsin urug‘i solingan xat olishdi va har gal tez orada halok bo‘lishdi. Holmes pochta muhrlarini o‘rgandi: birinchi xat Hindistonning <em>Pondicherri</em> portidan — o‘lim undan 7 hafta keyin; ikkinchisi Shotlandiyaning <em>Dandi</em> portidan — 3–4 kun keyin; uchinchisi Londondan — ikki kun ichida. Uchala shahar ham dengiz porti. Pochta o‘sha davrda tezyurar paroxodlarda tashilardi.",
  "savol": "Xat bilan halokat orasidagi vaqtning har xilligi nimani ko‘rsatadi?",
  "variantlar": [
   "Jinoyatchilar sekin yuradigan yelkanli kemada sayohat qilishadi: xatni portdan yuborishadi, xat paroxodda oldin yetib boradi, ular esa keyinroq kelib, jinoyat qilishadi",
   "Jinoyatchilar qurbonni qo‘rqitish uchun har gal ataylab turlicha uzoq kutishadi",
   "Xatlarni turli shaharlardagi turli to‘dalar yuborgan, ularning bir-biriga aloqasi yo‘q",
   "Pochta ba’zi xatlarni tasodifan kechiktirgan — vaqtlarda hech qanday qonuniyat yo‘q"
  ],
  "javob": 0,
  "izoh": "Kechikish masofaga mos: Hindistondan — haftalar, Shotlandiyadan — kunlar, Londondan — darhol. Demak, jinoyatchilar xat yuborilgan joydan o‘zlari yo‘lga chiqishadi. Xat tez paroxodda keladi, ular esa sekinroq — demak, ular yelkanli kemada. Barcha manzillar port ekani ham shuni tasdiqlaydi. Holmes kema ro‘yxatlaridan «Yolg‘iz yulduz» yelkanli kemasini topdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Barcha xatlar dengiz portlaridan yuborilgani nimani tasdiqlaydi?",
    "variantlar": [
     "Ular pochtachi bo‘lib ishlashini",
     "Yuboruvchilar kemada sayohat qilishini",
     "Ular faqat katta shaharlarni yoqtirishini",
     "Bu tasodif"
    ],
    "javob": 1,
    "izoh": "Uch xil uzoq shahar — uchalasi ham port. Bu qonuniyat yuboruvchilarning dengiz bilan bog‘liq harakat qilishini ko‘rsatadi."
   },
   {
    "savol": "Agar jinoyatchilar paroxodda suzganida, kechikish qanday bo‘lardi?",
    "variantlar": [
     "Kechikish yanada ko‘payardi",
     "Xat umuman kelmasdi",
     "Har doim 7 hafta kechikardi",
     "Ular xat bilan deyarli bir vaqtda yetib kelardi, kechikish masofaga bog‘liq bo‘lmasdi"
    ],
    "javob": 3,
    "izoh": "Pochta ham paroxodda tashilardi. Jinoyatchi ham paroxodda bo‘lsa, ular birga kelardi; uzoq kechikish esa sekinroq transport — yelkanli kemani ko‘rsatadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Buzilgan lab",
  "yil": 1891,
  "sarlavha": "Tilanchining xonasi",
  "hikoya": "Hurmatli janob <em>Nevill Sent-Kler</em> har kuni shaharga «ishga» borib, kechqurun qaytardi; oilasi farovon yashardi. Bir kuni xotini shaharning xilvat ko‘chasida tasodifan erini bir uyning yuqori qavat derazasida ko‘rib qoldi — eri uni ko‘rib qo‘rqib ketdi-yu, darhol g‘oyib bo‘ldi. Politsiya o‘sha xonada faqat yuzida xunuk chandig‘i bor tilanchi <em>Xyu Bun</em>ni topdi. Deraza tokchasida qon izi, xonada esa Nevillning kiyimlari bor edi; daryodan topilgan paltosining cho‘ntaklari mayda tangalarga to‘la edi. Jasad topilmadi. Tilanchi hibsga olindi, ammo hech narsani tan olmadi.",
  "savol": "Nevill Sent-Kler aslida qayerda edi?",
  "variantlar": [
   "Daryoga tushib halok bo‘lgan",
   "Uni tilanchi o‘ldirib, jasadini yashirgan",
   "U tilanchi Xyu Bunning o‘zi edi — grim bilan qiyofasini o‘zgartirib, tilanchilik qilib pul topardi",
   "Boshqa shaharga qochib ketgan"
  ],
  "javob": 2,
  "izoh": "Qon izi va daryo qotillikka o‘xshaydi, lekin jasad yo‘q. Nevill xonada ko‘ringan, lekin u yerdan chiqib ketganini hech kim ko‘rmagan; xonada esa faqat tilanchi va Nevillning kiyimlari bor. Demak ular — bitta odam. Nevill bir paytlar jurnalist bo‘lgan: tilanchilar haqida maqola yozish uchun grim qilib ko‘chada o‘tirgan va tilanchilikdan maoshidan ham ko‘p pul tushishini bilib qolgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Paltoning cho‘ntaklaridagi ko‘p mayda tangalar nimani ko‘rsatadi?",
    "variantlar": [
     "Tilanchilikdan juda ko‘p pul tushgan — bu «kasb» daromadli edi",
     "Tilanchi bankdan pul o‘g‘irlagan",
     "Tangalarni politsiya qoldirgan",
     "Nevill tanga yig‘ishni yaxshi ko‘rardi"
    ],
    "javob": 0,
    "izoh": "Mayda tangalar — tilanchilik daromadi. Ularning ko‘pligi Nevill nega ikki xil hayot kechirganini tushuntiradi: ko‘chada tilanchilik qilish unga maoshdan ko‘ra ko‘proq pul keltirardi."
   },
   {
    "savol": "Holmes sirni qanday isbotladi?",
    "variantlar": [
     "Tilanchini uzoq so‘roq qildi",
     "Daryodan jasadni topdi",
     "Kamerada tilanchining yuzini ho‘l gubka bilan yuvdi — grim ostidan Nevill chiqdi",
     "Xonani qaytadan tintuv qildi"
    ],
    "javob": 2,
    "izoh": "Eng oddiy sinov — eng ishonchli: soxta chandiq va grim suvga chidamaydi. Holmes taxminini bitta harakat bilan isbotladi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Moviy yoqut",
  "yil": 1892,
  "sarlavha": "G‘ozning ichida",
  "hikoya": "Grafinya Morkarning mashhur moviy yoquti mehmonxonadagi xonasidan o‘g‘irlandi; politsiya xonada ta’mir ishlarini qilgan chilangarni qamab qo‘ydi. Bir necha kundan keyin eshik og‘asi <em>Peterson</em> ko‘chadagi janjalda tushib qolgan eski shlyapa va semiz g‘ozni Holmesga olib keldi. G‘ozni pishirish uchun so‘yishganda, uning bo‘g‘zidan... moviy yoqut chiqdi! Holmes g‘ozning yo‘lini teskari kuzatdi: shlyapa egasi → u g‘ozni olgan qovoqxona → qovoqxonaga g‘oz sotgan bozor savdogari → savdogarga g‘ozlarni yetkazgan shahar chetidagi ayol. Ma’lum bo‘lishicha, bu ayol <em>Rayder</em> ismli yigitning opasi ekan, Rayder esa aynan o‘sha mehmonxonada xizmatchi bo‘lib ishlardi.",
  "savol": "Yoqutni kim o‘g‘irlagan va qanday yashirgan?",
  "variantlar": [
   "Qamalgan chilangar — u toshni ko‘chada tashlab yuborgan",
   "Mehmonxona xizmatchisi Rayder — u toshni opasining hovlisidagi tirik g‘ozning bo‘g‘ziga tiqib yuborgan",
   "Shlyapa egasi — u g‘ozni ataylab yo‘qotgan",
   "Bozor savdogari — u toshni sotmoqchi bo‘lgan"
  ],
  "javob": 1,
  "izoh": "Zanjirning ikki uchi uchrashadi: tosh mehmonxonadan g‘oyib bo‘lgan va g‘ozlar boqiladigan hovlida g‘oz bo‘g‘ziga tushgan. Ikkala joyni bog‘laydigan yagona odam — mehmonxonada ishlaydigan va opasinikiga boradigan Rayder. U chilangarni ayblatib, toshni ehtiyot uchun tirik g‘ozga yutqizgan, ammo keyin g‘ozlarni adashtirib, boshqasini olib ketgan. Holmes qo‘rqib ketgan Rayderni qo‘yib yubordi, begunoh chilangar esa oqlandi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega Rayder yoqutni o‘zi bilan olib yurmadi?",
    "variantlar": [
     "U yoqutni sotishni xohlamagan",
     "U yoqutni yo‘qotib qo‘ygan",
     "Yoqut juda katta va og‘ir edi",
     "Politsiya tintuvidan qo‘rqqan — tirik g‘ozning ichi eng kutilmagan yashirin joy edi"
    ],
    "javob": 3,
    "izoh": "Qimmatbaho narsani yashirish uchun eng yaxshi joy — hech kim tekshirmaydigan narsa: tirik g‘ozning bo‘g‘zi."
   },
   {
    "savol": "Holmes yoqut iziga qanday tushdi?",
    "variantlar": [
     "Chilangarni qayta so‘roq qildi",
     "G‘ozning kimdan kimga sotilganini birin-ketin teskari kuzatdi",
     "Grafinyadan so‘radi",
     "Mehmonxonani qayta tintuv qildi"
    ],
    "javob": 1,
    "izoh": "Narsalar zanjirini teskari kuzatish — klassik usul: g‘oz qayerdan kelgan bo‘lsa, yoqut ham o‘sha yo‘ldan o‘tgan."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Ola bog‘ich",
  "yil": 1892,
  "sarlavha": "Jiringlamaydigan qo‘ng‘iroq",
  "hikoya": "Qizning singlisi to‘ydan oldin, ichkaridan qulflangan xonada, hech qanday ko‘rinadigan iz qoldirmasdan vafot etdi. Qiz kechasi past, hushtakka o‘xshash ovoz eshitganini aytdi. Holmes xonani tekshirdi: karavot polga mahkamlangan; karavot yonida qo‘ng‘iroq shnuri osilib turadi, lekin uni tortganda hech qayerda jiringlamaydi — shnur hech qanday qo‘ng‘iroqqa ulanmagan; shiftdagi shamollatish tuynugi qo‘shni xonaga chiqadi, u yerda o‘gay otasi yashaydi.",
  "savol": "Qo‘ng‘iroq shnurining asl vazifasi nima edi?",
  "variantlar": [
   "Bu oddiy qo‘ng‘iroq edi, shunchaki buzilgan",
   "U qo‘ng‘iroqqa ulanmagan soxta arqon — zaharli ilon shamollatish tuynugidan tushib, shu arqon bo‘ylab karavotga tushishi uchun",
   "Bu derazadan qochish uchun qoldirilgan arqon",
   "Uni xizmatkorlar bezak sifatida osib qo‘ygan"
  ],
  "javob": 1,
  "izoh": "Uch dalil bitta tizimga birlashadi: shnur hech narsaga ulanmagan — demak u qo‘ng‘iroq emas; uning yuqori uchi shamollatish tuynugi ro‘parasida; karavot polga mahkamlangan, ya’ni yotgan odam tuynuk ostidan uzoqlasha olmaydi. Kechasi eshitilgan hushtak — ilonni qaytarib chaqirish signali. Shnur — ilon uchun ko‘prik. Mantiqda «foydasiz narsa» bo‘lmaydi: vazifasi noma’lum buyum aynan jinoyat sxemasining kaliti bo‘ladi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Karavotning polga mahkamlangani nimani ko‘rsatadi?",
    "variantlar": [
     "Bu eski uy odati",
     "Karavot juda og‘ir edi",
     "Karavot aynan shnur va tuynuk ostida turishi kerak edi — uni siljitib bo‘lmasin",
     "Qiz uyquda yurardi"
    ],
    "javob": 2,
    "izoh": "Mahkamlangan karavot, ishlamaydigan shnur va tuynuk — bitta mexanizmning qismlari: nimadir tuynukdan shnur bo‘ylab aynan karavotga tushishi kerak."
   },
   {
    "savol": "Shamollatish tuynugi qayerga ochilishi nima uchun muhim?",
    "variantlar": [
     "U o‘gay otaning xonasiga chiqadi — demak, «nimadir» o‘sha xonadan yuborilgan",
     "U ko‘chaga chiqadi",
     "U hech qayerga chiqmaydi",
     "U oshxonaga chiqadi"
    ],
    "javob": 0,
    "izoh": "Odatda shamollatish tuynugi tashqariga ochiladi. Ichki xonaga ochilishi g‘ayritabiiy va o‘gay otani bevosita bog‘laydi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Muhandis barmog‘i",
  "yil": 1892,
  "sarlavha": "Tunda ishlagan press",
  "hikoya": "Yosh gidravlika muhandisi <em>Xeterli</em>ga notanish polkovnik katta pul taklif qildi: kechasi shahar chetidagi yolg‘iz uyga borib, buzilgan gidravlik pressni ko‘rib berish kerak. «Biz u bilan oqartiruvchi tuproqni g‘isht qilib bosamiz. Bu ish sir qolsin», dedi polkovnik. Bekatdan uyga muhandisni derazalari bekitilgan yopiq aravada, bir soatcha yo‘l yurib olib borishdi. Press ichiga kirgan muhandis polda tuproq emas, qotib qolgan metall qatlamini ko‘rdi. U bu haqda so‘ragan zahoti uni press ichida qamab, pressni ishga tushirishdi. Muhandis zo‘rg‘a qochib qoldi, ammo bosh barmog‘idan ayrildi.",
  "savol": "U yerda aslida nima ishlab chiqarilayotgan edi?",
  "variantlar": [
   "Oqartiruvchi tuproq g‘ishtlari",
   "Qalbaki tangalar — press metallni soxta tanga uchun bosardi",
   "Chinni idishlar",
   "Zavod uchun ehtiyot qismlar"
  ],
  "javob": 1,
  "izoh": "Polkovnikning «tuproq» haqidagi gapi poldagi metall qatlami bilan zid. Katta to‘lov, tungi ish, yopiq arava, qattiq sir va muhandis haqiqatni ko‘rishi bilan uni o‘ldirmoqchi bo‘lishgani — bularning hammasi qonunsiz ishni ko‘rsatadi. Bu uyda qalbakichilar to‘dasi soxta kumush tangalar yasar edi. Holmes uyni topdi, lekin u o‘sha kecha yonib ketdi, to‘da esa qochib qoldi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Poldagi metall qatlami nimani ko‘rsatdi?",
    "variantlar": [
     "Press eskirib zanglab qolgan",
     "Polning o‘zi metalldan qilingan",
     "Pressda tuproq emas, metall bosilgan — polkovnikning gapi yolg‘on",
     "Bu tasodifan to‘kilgan bo‘yoq"
    ],
    "javob": 2,
    "izoh": "So‘z va dalil zid kelsa, dalilga ishon. Tuproq bosiladigan pressda metall qatlami paydo bo‘lmaydi."
   },
   {
    "savol": "Nega muhandisni yopiq aravada, uzoq yo‘l bilan olib borishdi?",
    "variantlar": [
     "U uyning qayerdaligini bilmasligi uchun — ish qonunsiz edi",
     "Yo‘l juda yomon edi",
     "Muhandis sovqotmasligi uchun",
     "Bu oddiy mehmondo‘stlik edi"
    ],
    "javob": 0,
    "izoh": "Halol ish yashirilmaydi. Holmes esa yana bir dalilga e’tibor berdi: bekatda arava oti tetik va terlamagan edi — demak uy bekatdan uzoq emas, arava shunchaki aylanib yurgan. Uy haqiqatan ham bekat yaqinidan topildi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Zodagon bo‘ydoq",
  "yil": 1892,
  "sarlavha": "To‘ydan keyin g‘oyib bo‘lgan kelin",
  "hikoya": "Lord <em>Sent-Saymon</em>ning amerikalik kelini <em>Xetti Doran</em> nikoh marosimidan bir soat o‘tib izsiz yo‘qoldi. Guvohlar aytishicha: cherkovda kelin gul dastasini tushirib yubordi, birinchi qatordagi notanish erkak uni olib, qaytarib berdi. Shundan keyin kelin bezovta bo‘lib qoldi va xizmatkoriga Amerika oltin konlari iborasi bilan «birovning da’vosini egallab olish» haqida nimadir dedi. Kelin yoshligida Amerikada yashirincha turmush qurgani, eri esa halok bo‘lgan deb hisoblangani ma’lum edi.",
  "savol": "Kelinning g‘oyib bo‘lishiga eng mantiqiy izoh qaysi?",
  "variantlar": [
   "Uni lordning boyligiga ko‘z olaytirgan dushmanlari o‘g‘irlab, garov evaziga pul talab qilmoqchi",
   "U lordni sevmay qolgan va oddiygina Amerikaga qaytib ketgan, bunda hech qanday sir yo‘q",
   "Cherkovda u o‘lgan deb hisoblangan birinchi erini tirik ko‘rdi — gul dastasi bilan unga xat berildi va u o‘sha odam bilan ketdi",
   "Lordning o‘zi uni yashirgan: nikohdan keyin sepi bo‘yicha kelishmovchilik chiqqan"
  ],
  "javob": 2,
  "izoh": "O‘zgarish aniq bir lahzada yuz bergan: dasta tushib, notanish odam uni qaytarib berganda. Demak, aynan shu paytda kelin kimnidir ko‘rgan va qo‘liga xat berilgan. «Da’voni egallash» iborasi — kimningdir unga nisbatan oldingi huquqi borligiga ishora. Bunday odam — o‘lgan deb hisoblangan birinchi eri. Holmes uni qimmat mehmonxona hisobi orqali topdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Kelinning kayfiyati qaysi aniq lahzada o‘zgardi?",
    "variantlar": [
     "Nikoh o‘qilganda",
     "Mehmonlar kelganda",
     "Lord gapirganda",
     "Gul dastasi tushib, notanish erkak uni qaytarib berganda"
    ],
    "javob": 3,
    "izoh": "O‘zgarishning aniq lahzasini topish — sababni topishning birinchi qadami. Aynan o‘sha lahzada u xat olgan."
   },
   {
    "savol": "«Birovning da’vosini egallash» iborasi nimaga ishora qiladi?",
    "variantlar": [
     "U oltin koniga egalik qiladi",
     "Kimdir unga nisbatan oldingi huquqqa ega — ya’ni avvalgi turmush o‘rtog‘i",
     "U lordning merosini xohlamaydi",
     "Bu shunchaki hazil"
    ],
    "javob": 1,
    "izoh": "Oltin konlarida «da’vo» — birinchi bo‘lib egallangan huquq. Kelin o‘zining birinchi nikohini nazarda tutgan."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Berill toj",
  "yil": 1892,
  "sarlavha": "Singan toj",
  "hikoya": "Bankir <em>Xolder</em>ga juda qimmatbaho berill toj garovga qoldirildi; u tojni uyidagi javonga qulflab qo‘ydi. Uyda uning o‘g‘li <em>Artur</em> va jiyani <em>Meri</em> ham yashardi. Yarim tunda shovqindan uyg‘ongan bankir Arturni qo‘lida toj bilan ko‘rdi — tojning bir burchagi uchta toshi bilan sindirib olingan edi. Artur o‘zini oqlamadi, faqat «men o‘g‘ri emasman» dedi. Holmes deraza tagidagi qorni tekshirdi: u yerda etik kiygan notanish erkak kimnidir kutib turgan, keyin ko‘cha tomon yugurgan. Uning ortidan uydan yalangoyoq odam quvib chiqqan. Ikki iz uchrashgan joyda qor titilib ketgan, qon tomchilari bor. So‘ng etikli iz uzoqlashib ketgan, yalangoyoq iz esa uyga qaytgan.",
  "savol": "Qordagi izlar nimani ko‘rsatadi?",
  "variantlar": [
   "Artur tojni sindirib, toshlarni sherigiga uzatgan",
   "Artur o‘g‘ri emas: u tojni olib qochgan begonani quvib, olishuvda tojning katta qismini qaytarib olgan",
   "Tojni bankirning o‘zi sindirgan",
   "Izlar eski — ular voqeaga aloqasiz"
  ],
  "javob": 1,
  "izoh": "Izlarni ketma-ket o‘qiymiz: etikli odam deraza tagida kutgan — demak tojni unga derazadan kimdir uzatgan. Yalangoyoq odam uning ortidan quvgan, olishuv bo‘lgan; tojning katta qismi uyga qaytgan, uchta toshli parcha esa etikli odam bilan ketgan. Agar Artur o‘g‘ri bo‘lganida, u begonani quvmasdi. Holmes uchun harakat yo‘nalishi — niyatning eng halol yozuvi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Arturning yalangoyoq bo‘lgani nimani anglatadi?",
    "variantlar": [
     "U iz qoldirmaslik uchun poyabzalini yechgan",
     "U shoshilib, kimnidir quvib chiqqan — oldindan rejalashtirilgan o‘g‘irlik emas",
     "U uyquda yurgan",
     "U poyabzalini yo‘qotib qo‘ygan"
    ],
    "javob": 1,
    "izoh": "Rejalashtirgan o‘g‘ri poyabzal kiyadi. Yalangoyoq chiqish — kutilmagan holat, kimnidir to‘xtatishga urinish."
   },
   {
    "savol": "Artur nega o‘zini oqlamadi?",
    "variantlar": [
     "U haqiqatan aybdor edi",
     "U otasidan qo‘rqqan",
     "U hech narsani eslay olmagan",
     "U tojni derazadan begonaga uzatgan odamni — o‘zi yaxshi ko‘rgan Merini himoya qilmoqchi edi"
    ],
    "javob": 3,
    "izoh": "Ba’zan jim turish aybni emas, kimnidir himoya qilishni bildiradi. Tojni derazadan uzatgan Meri edi — u ayyor janob Jorj Bernuellga aldanib qolgan edi. Artur Merini yaxshi ko‘rgani uchun uni sotmadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "sarguzasht",
  "asar": "Mis buklar",
  "yil": 1892,
  "sarlavha": "Ko‘k ko‘ylakli enaga",
  "hikoya": "Miss <em>Violetta Xanter</em> enagalikka yollandi, ammo xo‘jayin janob <em>Rukasl</em> g‘alati shartlar qo‘ydi: sochini kalta qirqtirishi, ma’lum bir ko‘k ko‘ylakni kiyishi va derazaga orqasini o‘girib o‘tirishi kerak edi; bu paytda xo‘jayin uni kulgili hikoyalar bilan kuldirardi. Violetta qo‘l oynasi yordamida ko‘chada bir yigit uyga tikilib turganini ko‘rdi. Uyda esa qulflangan, hech kim kirmaydigan qanot bor edi. Xo‘jayinning qizi <em>Elis</em> «Amerikaga ketgan» deyilardi; qulflangan tortmada esa Violettanikiga juda o‘xshash kesilgan soch o‘rami topildi.",
  "savol": "Violettani nega shunday kiyintirib, derazaga orqa o‘girtirib o‘tirg‘izishardi?",
  "variantlar": [
   "Xo‘jayin uni ko‘chadan o‘tuvchilarga uyning boy va baxtli oila ekanini ko‘rsatish uchun ishlatardi",
   "Bu oilaning g‘alati odati edi: har bir enaga oilaning sevimli rangidagi ko‘ylakni kiyishi shart",
   "U qamab qo‘yilgan Elisning o‘rnini bosayotgan edi: ko‘chadagi yigit (Elisning unashtirilgani) Elisni xursand deb o‘ylab, ketib qolishi kerak edi",
   "Violettaning yuzini quyoshdan asrash uchun — xo‘jayin uning sog‘lig‘iga g‘amxo‘rlik qilardi"
  ],
  "javob": 2,
  "izoh": "Barcha shartlar bitta maqsadga — kimgadir o‘xshashga xizmat qiladi: kalta soch (sandiqdagi kesilgan soch — Elisniki), uning ko‘ylagi, yuz ko‘rinmasligi uchun derazaga orqa o‘girish, xursandlik ko‘rinishi uchun kulish. Kuzatuvchi — ko‘chadagi yigit. Qulflangan qanot esa «Amerikaga ketgan» qizning aslida uyda qamab qo‘yilganini ko‘rsatadi: otasi uning merosini qo‘ldan chiqarmaslik uchun turmushga chiqishiga yo‘l qo‘ymagan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Violettaga kulgili hikoyalar aytib kuldirish nima uchun kerak edi?",
    "variantlar": [
     "Ko‘chadagi kuzatuvchi «Elis» xursand va baxtli deb o‘ylashi uchun",
     "Xo‘jayin uni yaxshi ko‘rardi",
     "Bu ish shartnomasining bir qismi edi",
     "Uning kayfiyatini ko‘tarish uchun"
    ],
    "javob": 0,
    "izoh": "Kuzatuvchi faqat orqa tomon va harakatlarni ko‘radi. Kulgi — «baxtli hayot» sahnasining bir qismi."
   },
   {
    "savol": "Qulflangan qanot nima haqida dalolat beradi?",
    "variantlar": [
     "U yerda eski mebellar saqlanadi",
     "U yerda xo‘jayinning ustaxonasi bor",
     "Uyda kimdir yashiringan — «Amerikaga ketgan» qiz aslida o‘sha yerda qamalgan",
     "Qanot buzilgan"
    ],
    "javob": 2,
    "izoh": "Hech kim kirmaydigan xona va «yo‘q» deb aytilgan qiz — ikki fakt bir-birini to‘ldiradi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Kumush yulduz",
  "yil": 1892,
  "sarlavha": "Itning jimligi",
  "hikoya": "Mashhur poyga oti <em>Kumush yulduz</em> kechasi otxonadan g‘oyib bo‘ldi, uning murabbiyi esa ertalab dashtda o‘lik holda topildi. O‘sha kecha otxonani qo‘riqlagan yigit qattiq uxlab qolgan — kechki ovqatiga uyqu dori qo‘shilgan ekan. Otxona hovlisida qo‘riqchi it bor: u notanish odamni ko‘rsa, darhol hura boshlaydi. Ertalab it sog‘-salomat edi. Inspektor: «Otni begona o‘g‘ri olib ketgan», deb hisobladi. Holmes esa «tundagi itning g‘alati xatti-harakatiga» e’tibor qaratdi. «Ammo it tunda hech narsa qilmagan-ku», dedi inspektor. «Ana o‘sha g‘alati», dedi Holmes.",
  "savol": "Holmes itning jimligidan qanday xulosa chiqardi?",
  "variantlar": [
   "It qari bo‘lgani uchun hura olmagan",
   "Tunda otni olib chiqqan odam itga tanish edi — u begona emas, otxonaning o‘z odami",
   "Ot o‘z oyog‘i bilan qochib ketgan",
   "O‘g‘ri itni oldindan zaharlab qo‘ygan"
  ],
  "javob": 1,
  "izoh": "It begonaga huradi, tanish odamga esa jim qoladi. O‘sha kecha otxonaga kimdir kirib, otni olib chiqqan — it esa churq etmagan. Demak bu odam itga yaxshi tanish edi. Haqiqatda otni murabbiyning o‘zi olib chiqqan: u poygadan oldin otni oqsatib qo‘ymoqchi bo‘lgan, ammo dashtda ot uni tepib o‘ldirgan. Ba’zan eng kuchli dalil — sodir bo‘lmagan voqea.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holmesning mashhur kuzatuvi nimaga asoslangan?",
    "variantlar": [
     "Itning izlariga",
     "Otning izlariga",
     "Inspektorning so‘zlariga",
     "Sodir bo‘lmagan narsaga — itning hurmaganiga"
    ],
    "javob": 3,
    "izoh": "Ba’zan eng muhim dalil — kutilgan narsaning bo‘lmagani. It hurmagan, demak, kelgan odam unga tanish."
   },
   {
    "savol": "Qo‘riqchi yigitning ovqatiga uyqu dori qo‘shilgani nimani ko‘rsatadi?",
    "variantlar": [
     "Yigit dorini o‘zi bilib ichgan",
     "Jinoyat oldindan rejalashtirilgan — uni yigitning kechki ovqatini biladigan, uyga yaqin odam uyushtirgan",
     "Ovqat tasodifan buzilib qolgan",
     "Otni o‘sha yigit o‘g‘irlagan"
    ],
    "javob": 1,
    "izoh": "Dorini qaysi ovqatga solishni oldindan bilish uchun uydagi tartibni yaxshi bilish kerak. Bu dalil ham itning jimligi bilan bir yo‘nalishga ishora qiladi: jinoyatchi begona emas, ichkaridagi odam."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Sariq yuz",
  "yil": 1893,
  "sarlavha": "Sariq yuz",
  "hikoya": "<em>Grant Manro</em> xotini <em>Effi</em>ning yaqindagi kichik kottejga yashirincha qatnayotganini sezib qoldi. Bir kuni u kottej derazasida g‘alati, qimirlamaydigan, o‘likdek sariq yuzni ko‘rdi — yuz deraza tokchasidan zo‘rg‘a ko‘tarilib turardi. Effi ilgari Amerikada beva qolgan: birinchi eri va kichkina qizi isitmadan vafot etgan, degan edi. Endi u «Menga ishon, bir kun hammasini aytaman» deyishdan nariga o‘tmasdi. Kottejga esa bolalar kiyimlari va o‘yinchoqlar olib kirilayotgani ko‘rilgan.",
  "savol": "Derazadagi «sariq yuz» aslida nima edi?",
  "variantlar": [
   "Effining birinchi eri — u tirik bo‘lib chiqqan",
   "Qochib kelgan mahbus",
   "Sariq niqob taqqan kichkina qizcha — Effining tirik qizi",
   "Derazaga osilgan oynadagi aks"
  ],
  "javob": 2,
  "izoh": "Dalillar bir yo‘nalishga ishora qiladi: yuz qimirlamaydi va g‘ayritabiiy rangda — bu niqob; u tokchadan zo‘rg‘a ko‘rinadi — bo‘yi past; kottejga bolalar kiyimi va o‘yinchoqlar tashilgan. Effining qizi tirik edi. Qizig‘i: bu ishda Holmesning o‘zi ham xato qilgan — u «birinchi eri tirik va Effini qo‘rqitmoqda» deb o‘ylagan edi. Shundan keyin u Uotsonga: «Agar yana o‘zimga haddan tashqari ishonsam, qulog‘imga „Norberi“ deb shivirla», degan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Yuzning deraza tokchasidan zo‘rg‘a ko‘rinishi nimani ko‘rsatadi?",
    "variantlar": [
     "Derazada juda baland bo‘yli odam turgan",
     "Derazani xizmatkor tozalayotgan bo‘lgan",
     "Derazada bo‘yi past odam — bola turgan",
     "Bu qo‘shni uydagi odamning aksi"
    ],
    "javob": 2,
    "izoh": "Bo‘y — muhim dalil. Past bo‘y, bolalar kiyimi va o‘yinchoqlar birgalikda bola ekanini ko‘rsatadi."
   },
   {
    "savol": "Effi nega bu sirni eridan yashirdi?",
    "variantlar": [
     "Qizi tirikligini aytsa, eri uni tashlab ketishidan qo‘rqqan",
     "U erini aldab, pulini olmoqchi edi",
     "Qizcha o‘g‘irlab kelingan edi",
     "U eriga kutilmagan sovg‘a tayyorlayotgan edi"
    ],
    "javob": 0,
    "izoh": "Yashirish har doim ham jinoyat emas. Effi yaqinlarini yo‘qotishdan qo‘rqib sir saqlagan. Haqiqat ochilganda Grant Manro qizchani quchoqlab, ikkalasini ham oilasiga qabul qildi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Birja klerki",
  "yil": 1893,
  "sarlavha": "Ikki «aka-uka»dagi bitta tish",
  "hikoya": "Klerk <em>Xoll Paykroft</em> yirik birja firmasiga ishga qabul qilindi. Shu kuni unga <em>Artur Pinner</em> ismli odam ancha yuqori maosh taklif qildi, firmaga xat yozib rad etmaslikni so‘radi va undan qo‘lyozma namunasini oldi. Keyin Paykroftni Birmingemga, ukasi <em>Garri Pinner</em>ning idorasiga yubordi. U yerda Paykroft «uka»ning tishlaridan birida xuddi akasinikiga o‘xshash, aynan bir joyda oltin plomba borligini ko‘rdi. Idora deyarli bo‘m-bo‘sh, ish esa ma’nosiz — katalogdan manzillar ko‘chirish edi.",
  "savol": "Bu g‘alati ish nimaga kerak edi?",
  "variantlar": [
   "«Aka-uka» — bitta odam: Paykroftni Londondan uzoqlashtirib, uning nomi va qo‘lyozmasi bilan firmaga boshqa odamni ishga kiritishdi — firmani o‘marish uchun",
   "Pinnerlar Paykroftning iste’dodini ko‘rib, uni raqobatchi firmadan o‘z kompaniyasiga og‘dirib olishmoqchi edi",
   "Bu birja firmasining yangi xodimni sadoqat va sabr-toqatga sinovi edi",
   "Aka-uka Pinnerlar katalog sotish bilan shug‘ullanadi va arzon ishchi kuchi qidirayotgan edi"
  ],
  "javob": 0,
  "izoh": "Oltin plomba aynan bir joyda tasodifan takrorlanmaydi: «aka-uka» bitta odam, faqat qiyofasini o‘zgartirgan. Paykroftdan nima olindi? Qo‘lyozma namunasi va firmaga xat yozmaslik va’dasi. Natija: firmada uni hech kim tanimaydi, demak uning nomi bilan boshqa odam ishga chiqishi mumkin. Ma’nosiz ish esa Paykroftni band qilib, uzoqda ushlab turish uchun edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Paykroftdan qo‘lyozma namunasini olish nimaga kerak edi?",
    "variantlar": [
     "Uni tekshirish uchun",
     "Uni sertifikatlash uchun",
     "Uning nomidan ishga chiqadigan odam uning yozuvini taqlid qila olishi uchun",
     "Uni xotira uchun saqlash uchun"
    ],
    "javob": 2,
    "izoh": "Begona joyda odamni yozuvi bilan tanishadi. Yozuvni o‘rganib, firibgar uning o‘rnini bosa oladi."
   },
   {
    "savol": "Nega Paykroftga avvalgi firmaga xat yozmaslikni aytishdi?",
    "variantlar": [
     "Firma uni kutayotganini bilishi va uni tanimaydigan odam kelishiga e’tibor bermasligi uchun",
     "Bu odob qoidasi edi",
     "Firma yopilgan edi",
     "Pinnerlar firmani yomon ko‘rardi"
    ],
    "javob": 0,
    "izoh": "Agar Paykroft ishdan voz kechganini yozsa, firma uning o‘rniga kelgan odamni shubha bilan kutib olardi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "«Gloriya Skott»",
  "yil": 1893,
  "sarlavha": "Har uchinchi so‘z",
  "hikoya": "Keksa <em>Trevor</em> bir xatni o‘qib, hushidan ketdi va ko‘p o‘tmay vafot etdi. Xat bir qarashda ov haqidagi oddiy, lekin g‘alati va ma’nosiz gaplardan iborat edi. Holmes kalitni izladi: matnni oxiridan o‘qib ko‘rdi, har ikkinchi so‘zni olib ko‘rdi — ma’no chiqmadi. Keyin u birinchi so‘zdan boshlab har uchinchi so‘zni oldi va aniq ogohlantirish paydo bo‘ldi: «O‘yin tugadi. Xadson hammasini aytdi. Joningni qutqarib qoch».",
  "savol": "Bu yashirin xabar qanday tuzilgan va nega u xavfsiz ko‘rinadi?",
  "variantlar": [
   "Har bir harf alifboda uchta harf oldinga surilgan — buni Sezar shifri deyishadi",
   "Xabar ko‘rinmas siyoh bilan yozilgan, ko‘rinadigan matn esa shunchaki niqob",
   "So‘zlar teskari tartibda yozilgan, uni oxiridan o‘qish kifoya",
   "Kerakli so‘zlar oralig‘iga ma’nosiz so‘zlar qo‘shilgan: begona odam oddiy xat ko‘radi, kalitni (har uchinchi so‘z) bilgan odam esa xabarni o‘qiydi"
  ],
  "javob": 3,
  "izoh": "Bu — yashirish usuli: xabar shifrlanmaydi, balki ko‘p «shovqin» so‘zlar orasiga ko‘miladi. Ma’nosizlikning o‘zi dalil edi: oddiy xatda bunchalik g‘alati gaplar bo‘lmaydi. Holmes oddiy qoidalarni ketma-ket sinab ko‘rdi; «har uchinchi so‘z» qoidasi butun matndan ma’noli gap berdi. Agar bitta qoida butun matndan izchil gap chiqarsa, bu tasodif emas.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holmes nima uchun xat ichida yashirin xabar bor deb o‘yladi?",
    "variantlar": [
     "Xat qizil siyohda yozilgan",
     "Xat chet tilida edi",
     "Xat juda uzun edi",
     "Xat oddiy ko‘rinsa-da, g‘alati va ma’nosiz edi, uni o‘qigan odam esa hushidan ketdi"
    ],
    "javob": 3,
    "izoh": "Oddiy so‘zlarga qilingan kuchli ta’sir — xatda boshqa ma’no borligi belgisi."
   },
   {
    "savol": "Agar «har uchinchi so‘z» qoidasi faqat bir-ikki so‘zda ma’no bersa, nima deyish kerak edi?",
    "variantlar": [
     "Kalit to‘g‘ri topilgan",
     "Bu tasodif bo‘lishi mumkin — to‘g‘ri kalit butun matndan izchil gap chiqaradi",
     "Xat ma’nosiz",
     "Qolgan so‘zlar xato yozilgan"
    ],
    "javob": 1,
    "izoh": "Shifrni tekshirish mezoni — butun matnda izchillik. Bir-ikki tasodifiy moslik isbot emas."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Masgreyvlar marosimi",
  "yil": 1893,
  "sarlavha": "Qayrag‘och soyasi",
  "hikoya": "Masgreyvlar oilasining qadimiy marosim she’rida yashirin joy ko‘rsatilgan: «Quyosh qayerda edi? Eman ustida. Soya qayerda edi? Qayrag‘och ostida...» Qayrag‘och kesib tashlangan, lekin uning balandligi 64 fut bo‘lgani ma’lum. Holmes quyosh aynan eman tepasida turgan paytni kutib, yerga 6 fut uzunlikdagi tayoqni tik qadadi va uning soyasini o‘lchadi: soya 9 fut chiqdi.",
  "savol": "Qayrag‘ochning soyasi qancha uzunlikda bo‘lgan?",
  "variantlar": [
   "64 fut",
   "96 fut",
   "72 fut",
   "106 fut"
  ],
  "javob": 1,
  "izoh": "Bir vaqtning o‘zida barcha narsalarning soyasi ularning balandligiga proporsional: 6 : 9 = 64 : x. Demak, x = 64 · 9 / 6 = 96 fut. Holmes soyaning uchini topib, marosimdagi keyingi qadamlarni (shimolga, sharqqa qadamlar) bajardi va yerto‘ladagi yashirin joyni topdi. Bu — o‘xshash uchburchaklar geometriyasining tergovdagi qo‘llanishi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Agar tayoq 4 fut va uning soyasi 6 fut bo‘lsa, 64 futlik daraxtning soyasi qancha bo‘ladi?",
    "variantlar": [
     "64 fut",
     "96 fut",
     "106 fut",
     "48 fut"
    ],
    "javob": 1,
    "izoh": "4 : 6 = 6 : 9 — nisbat o‘sha-o‘sha (1 : 1,5). Demak, 64 · 1,5 = 96 fut."
   },
   {
    "savol": "Nega Holmes o‘lchovni aynan quyosh eman tepasida bo‘lgan paytda qildi?",
    "variantlar": [
     "U ertalab ishlashni yoqtirardi",
     "O‘sha paytda havo ochiq edi",
     "Bu tasodif",
     "Marosim aynan o‘sha paytdagi soyani nazarda tutgan — boshqa paytda soya uzunligi boshqacha"
    ],
    "javob": 3,
    "izoh": "Soya uzunligi quyoshning holatiga bog‘liq. Marosim shartini aniq takrorlash kerak edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Reygeyt mulkdorlari",
  "yil": 1893,
  "sarlavha": "Ikki qo‘lda yozilgan parcha",
  "hikoya": "Aravakash <em>Uilyam</em> o‘ldirildi; uning qo‘lida yirtilgan xat parchasi qoldi. Holmes parchani o‘rgandi: so‘zlar birin-ketin ikki xil qo‘lda yozilgan — biri kuchli, tik, «t» harfini aniq kesadi; ikkinchisi zaifroq, qaltiroq, lekin aniq yozadi. Kuchli qo‘l so‘zlar orasida bo‘sh joy qoldirgan, ikkinchi qo‘l esa o‘sha joylarga sig‘dirib yozgan. Qo‘lyozmalarda oilaviy o‘xshashlik bor edi. Gumon ostida keksa <em>Kanningem</em> va uning o‘g‘li <em>Alek</em> bor edi.",
  "savol": "Parchadagi yozuv haqida qaysi xulosa to‘g‘ri?",
  "variantlar": [
   "Xatni bitta odam o‘zini oqlash uchun ataylab ikki xil yozuvda yozgan",
   "Xatni ota va o‘g‘il navbatma-navbat so‘z yozib tuzishgan, shunda hech biri boshqasidan tona olmaydi; kuchli qo‘l — o‘g‘il, zaifroq qo‘l — ota",
   "Xatni Uilyamning o‘zi yozgan: chap va o‘ng qo‘li bilan navbatma-navbat",
   "Xat ikki qismdan iborat: biri ko‘p yillar oldin, ikkinchisi yaqinda yozib to‘ldirilgan"
  ],
  "javob": 1,
  "izoh": "Ikki xil yozuv so‘zma-so‘z almashadi — demak, ikki kishi bitta varaqda birga yozgan. Sababi — o‘zaro ishonchsizlik: birgalikda yozilgan xat ikkalasini ham bir xil bog‘laydi. Kuchli qo‘l bo‘sh joy qoldirgan — u birinchi yozgan va yetakchilik qilgan. Keksalik belgilari bor qo‘l — ota. Oilaviy o‘xshashlik ularni bir oiladan deb ko‘rsatadi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega ikki kishi bitta xatni birga yozgan?",
    "variantlar": [
     "Hech biri boshqasiga to‘liq ishonmagan — umumiy xat ikkalasini ham bir xil bog‘laydi",
     "Biri yozishni bilmasdi",
     "Ular shoshilgan",
     "Bu oilaviy an’ana edi"
    ],
    "javob": 0,
    "izoh": "Fitnada sheriklar bir-birini «bog‘lab qo‘yishga» intiladi: umumiy dalil hech birining sotib ketishiga yo‘l qo‘ymaydi."
   },
   {
    "savol": "Kuchli qo‘l bo‘sh joy qoldirgani nimani ko‘rsatadi?",
    "variantlar": [
     "U yozishga qiynalgan",
     "U imlo xatosi qilgan",
     "U birinchi yozgan va yetakchilik qilgan, ikkinchisi esa bo‘sh joylarni to‘ldirgan",
     "Ikkinchi qo‘l birinchi yozgan"
    ],
    "javob": 2,
    "izoh": "Joylarni oldindan qoldirish — rejani boshqarish belgisi. Bu yetakchini aniqlashga yordam beradi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Bukri odam",
  "yil": 1893,
  "sarlavha": "Yo‘qolgan kalit",
  "hikoya": "Polkovnik <em>Barkli</em> mehmonxonada, boshi yorilgan holda o‘lik topildi; xotini esa hushsiz yotardi. Xizmatkorlar ichkaridan ikkovining janjallashayotganini eshitishgan, lekin eshik qulflangan edi — ular xonaga bog‘ tomondagi deraza orqali kirishdi. Eshik kaliti hech qayerdan topilmadi: na polkovnikda, na xotinida, na xonada. Gilamda va bog‘ yo‘lakchasida esa noma’lum odamning izlari va qandaydir mayda hayvonning panja izlari bor edi.",
  "savol": "Kalitning yo‘qligi nimani isbotlaydi?",
  "variantlar": [
   "Xotin kalitni yashirgan — demak, eshikni u qulflagan va aybdor ham u",
   "Kalit janjal paytida tasodifan kamin olovi ichiga tushib, yo‘qolgan",
   "Eshik umuman qulflanmagan — xizmatkorlar sarosimada uni ochishni bilmagan",
   "Xonada uchinchi odam bo‘lgan va u deraza orqali ketayotib kalitni olib ketgan"
  ],
  "javob": 3,
  "izoh": "Eshik qulflangan, kalit esa xonada ham, ikkala odamda ham yo‘q. Kalit o‘z-o‘zidan yo‘qolmaydi — uni kimdir olib chiqib ketgan. Ichkaridagilardan biri o‘lgan, biri hushsiz — ular buni qila olmaydi. Demak, uchinchi odam bo‘lgan; izlar ham buni tasdiqladi. U Barkli yillar oldin xiyonat qilgan sobiq askar bo‘lib chiqdi: polkovnik uni ko‘rib, qattiq qo‘rqqan, yiqilib, boshini kamin panjarasiga urgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Gilam va bog‘ yo‘lagidagi noma’lum izlar nimani tasdiqlaydi?",
    "variantlar": [
     "Xizmatkorlar deraza orqali kirganini",
     "Polkovnikning o‘zi bog‘da yurganini",
     "Izlar eski bo‘lganini",
     "Xonaga tashqaridan uchinchi odam kirib-chiqqanini"
    ],
    "javob": 3,
    "izoh": "Kalitning yo‘qligi va begona izlar ikki mustaqil dalil bo‘lib, bitta xulosani — uchinchi odamni tasdiqlaydi."
   },
   {
    "savol": "Polkovnik qanday halok bo‘lgan?",
    "variantlar": [
     "Uni sobiq askar urgan",
     "Sobiq askarni ko‘rib qattiq qo‘rqqan, yiqilib, boshini kamin panjarasiga urgan",
     "Xotini urgan",
     "Uni hayvon talagan"
    ],
    "javob": 1,
    "izoh": "Bu ishda qotillik bo‘lmagan: uchinchi odam faqat o‘tmish sirini olib kelgan, o‘lim esa baxtsiz hodisa edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Doimiy bemor",
  "yil": 1893,
  "sarlavha": "To‘rtta sigara qoldig‘i",
  "hikoya": "Janob <em>Blessington</em> yotoqxonasida osilgan holda topildi. Politsiya buni o‘z joniga qasd qilish deb hisobladi. Holmes kaminda to‘rtta sigara qoldig‘ini topdi: ular Blessington chekadigan navdan emas edi; ikkitasi mundshtuk bilan, ikkitasi mundshtuksiz chekilgan; ikkitasining uchi o‘tmas pichoq bilan kesilgan, ikkitasiniki tish bilan uzib olingan. Xonada otvyortka va bir nechta vint qolgan, zinapoyada esa begona odamlarning izlari bor edi.",
  "savol": "Sigara qoldiqlari nimani ko‘rsatadi?",
  "variantlar": [
   "Xonada bir necha begona odam ancha vaqt o‘tirgan: sigaralar Blessingtonniki emas va turli usulda chekilgan — bu o‘z joniga qasd emas, sahnalashtirilgan qotillik",
   "Blessington qayg‘u ichida birin-ketin to‘rtta sigara chekkan, keyin o‘zini osgan",
   "Sigaralarni oldingi kunlarda xonani yig‘ishtirgan xizmatkor qoldirgan",
   "Bu tasodifiy qoldiqlar: kaminni bir necha kundan beri hech kim tozalamagan"
  ],
  "javob": 0,
  "izoh": "Sigaralar Blessington chekadigan navdan emas — demak, ular unga tegishli emas. Chekish usullari har xil: mundshtuk bilan va mundshtuksiz, pichoq bilan kesib va tish bilan uzib — bir nechta odam. To‘rtta sigara — ular xonada uzoq kutishgan. Zinapoyadagi begona izlar, otvyortka va vintlar (ilgak o‘rnatish uchun) bilan birga, bu rejalashtirilgan qotillik ekanini ko‘rsatadi: Blessingtonni o‘zining sobiq sheriklari osib o‘ldirishgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Otvyortka va vintlar nimani ko‘rsatadi?",
    "variantlar": [
     "Mebel ta’mirlangan",
     "Ular Blessingtonniki",
     "Kimdir osish uchun ilgak o‘rnatgan — bu oldindan tayyorlangan",
     "Bu tasodifiy asboblar"
    ],
    "javob": 2,
    "izoh": "O‘z joniga qasd qiluvchi odatda maxsus moslama o‘rnatmaydi. Asboblar tashqaridan kelgan va rejalashtirilgan harakatni ko‘rsatadi."
   },
   {
    "savol": "Nega to‘rtta sigara muhim?",
    "variantlar": [
     "Ular xonada uzoq vaqt kutishgan — bu tez sodir bo‘lgan hodisa emas",
     "Blessington ko‘p chekardi",
     "Sigaralar arzon edi",
     "Bu chekuvchining sevimli navi"
    ],
    "javob": 0,
    "izoh": "Bir sigara ~15–20 daqiqa chekiladi. To‘rt sigara — mehmonlar ancha vaqt o‘tirib, kutganini ko‘rsatadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Yunon tarjimon",
  "yil": 1893,
  "sarlavha": "Derazadan ko‘ringan odam",
  "hikoya": "Sherlok akasi <em>Mikroft</em> bilan klub derazasidan ko‘chadagi bir odamni kuzatishdi. Uning yuzi qorayib ketgan, qaddi tik, shlyapasini bir yonga qiyshaytirib kiygan; qo‘lida yangi sotib olingan bolalar shaqildog‘i va rasmli kitob bor, yengida qora motam bog‘ichi bor edi. Aka-uka navbatma-navbat xulosa qilishdi: «yaqinda armiyadan bo‘shagan», «Hindistonda xizmat qilgan», «artilleriyachi», «beva qolgan», «bolalari bor».",
  "savol": "«Beva qolgan va kichkina bolasi bor» degan xulosa qaysi dalillarga tayanadi?",
  "variantlar": [
   "Yuzining qorayib ketgani — u ko‘p vaqtini oilasi bilan ochiq havoda o‘tkazadi",
   "Shlyapasini qiyshiq kiygani — uyda unga qaraydigan ayol yo‘qligini ko‘rsatadi, boshqa dalil kerak emas",
   "Motam bog‘ichi — yaqinini yo‘qotgan; bolalar narsalarini otaning o‘zi xarid qilyapti — xotini endi yo‘q; shaqildoq — juda kichik go‘dak, rasmli kitob — yana bir kattaroq bola",
   "Qaddining tikligi — u qattiqqo‘l ota, demak bolalari bor va xotini bilan ajrashgan"
  ],
  "javob": 2,
  "izoh": "Har bir xulosa o‘z dalilidan chiqadi: motam bog‘ichi — yaqin odam vafoti; bolalar narsalarini otaning o‘zi olishi — xotini endi yo‘q. Shaqildoq — go‘dak, rasmli kitob — kattaroq bola. Mikroft hatto xotin tug‘ruqda vafot etgan bo‘lishi mumkin deb taxmin qildi. Qoraygan yuz (Hindiston), tik qad va shlyapani qiyshiq kiyish (harbiy odat) esa boshqa xulosalar uchun dalil.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Shaqildoq va rasmli kitob birga nimani ko‘rsatadi?",
    "variantlar": [
     "Uning bitta bolasi bor",
     "U o‘yinchoq sotuvchi",
     "Uning kamida ikki bolasi bor: biri go‘dak, biri kattaroq",
     "U bolalar shifokori"
    ],
    "javob": 2,
    "izoh": "Shaqildoq — go‘dak uchun, rasmli kitob — o‘qishni boshlagan bola uchun. Ikki xil yosh — ikki bola."
   },
   {
    "savol": "«Harbiy» degan xulosaga qaysi belgilar asos bo‘ldi?",
    "variantlar": [
     "Tik qad va shlyapani bir yonga qiyshaytirib kiyish odati",
     "Qora motam bog‘ichi",
     "Bolalar narsalari",
     "Yuzidagi qayg‘u"
    ],
    "javob": 0,
    "izoh": "Harbiylar uzoq yillik saf mashqidan keyin tik yuradi va kepkani qiyshiq kiyish odatini saqlab qoladi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "Dengiz shartnomasi",
  "yil": 1893,
  "sarlavha": "Sotilmagan sir",
  "hikoya": "Diplomat <em>Persi Felps</em>ning stolidan maxfiy dengiz shartnomasi o‘g‘irlandi. U og‘ir kasal bo‘lib, qaylig‘ining uyida yotib qoldi: unga birinchi qavatdagi, qayliq akasi <em>Jozef</em> yashab turgan yotoqxonani bo‘shatib berishdi. Ikki oydan ko‘proq vaqt o‘tdi, lekin shartnoma hech qayerda paydo bo‘lmadi — xorijiy elchixonalar uni katta pulga sotib olishga tayyor bo‘lsa ham. Felps tuzala boshlaganda, bir kecha kimdir uning derazasini tashqaridan ochishga urindi.",
  "savol": "Shartnoma nega shuncha vaqt davomida sotilmadi?",
  "variantlar": [
   "O‘g‘ri hujjatni qochayotganda yo‘qotib qo‘ygan va o‘zi ham uni topa olmayapti",
   "Elchixonalar shartnoma soxta bo‘lishi mumkin deb, uni sotib olishdan qo‘rqqan",
   "O‘g‘ri uni o‘zi yashagan yotoqxonaga yashirgan; xona doim kasal Felps bilan band bo‘lgani uchun uni olib chiqolmagan. O‘g‘ri — Jozef",
   "O‘g‘ri hujjatni yoqib yuborgan: maqsadi pul emas, Felpsning martabasini buzish edi"
  ],
  "javob": 2,
  "izoh": "Qimmatli sir tezda sotiladi — sotilmagan bo‘lsa, demak, o‘g‘ri unga yeta olmayapti. Nima to‘sqinlik qiladi? Felps yotgan xona doim odam bilan band, o‘sha xona esa ilgari Jozefniki edi. Felps tuzala boshlashi bilan derazani ochishga urinish bo‘ldi — kimdir aynan shu xonaga kirishi kerak edi. Holmes xonani kuzatuvga oldi va Jozefni pol taxtasi ostidan shartnomani olayotganda qo‘lga tushirdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Felps tuzala boshlaganda derazani ochishga urinish nimani ko‘rsatadi?",
    "variantlar": [
     "O‘g‘rilar uyni talamoqchi",
     "Felpsni o‘ldirmoqchi bo‘lishgan",
     "Bu shamol edi",
     "Kimdir aynan shu xonaga kirishga juda muhtoj — sir o‘sha xonada"
    ],
    "javob": 3,
    "izoh": "Vaqt mos keladi: xona bo‘shashi bilan urinish boshlandi. Demak, xonaning o‘zi muhim."
   },
   {
    "savol": "Holmes Felpsni Londonga olib ketishini nega Jozefdan yashirdi?",
    "variantlar": [
     "Jozef ham Londonga ketmoqchi edi",
     "Jozef xona bo‘shaganiga ishonib, yashiringan joyga kelishi va qo‘lga tushishi uchun",
     "Felps buni so‘ragan",
     "Holmes Jozefni yoqtirmasdi"
    ],
    "javob": 1,
    "izoh": "Pistirma faqat o‘g‘ri xavfsiz deb o‘ylagan paytda ishlaydi. Xona bo‘sh qolgan, Holmes esa yashirinib kuzatardi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "xotira",
  "asar": "So‘nggi ish",
  "yil": 1893,
  "sarlavha": "Shoshilinch chaqiruv",
  "hikoya": "Holmes va Uotson Shveysariyada edi; ular <em>Moriarti</em> ularni ta’qib qilayotganini bilishardi. Reyxenbax sharsharasi yonida ularga mehmonxonadan bola xat olib keldi: mehmonxonada sil kasalligi bilan og‘rigan ingliz xonim o‘layapti va u albatta ingliz shifokorini so‘rayapti. Uotson darhol qaytdi, Holmes esa sharshara yonida yolg‘iz qoldi. Mehmonxonaga yetgach, Uotson egasidan bunday xat yozilmaganini, hech qanday kasal xonim yo‘qligini bildi.",
  "savol": "Bu xat kim tomonidan va nima maqsadda yuborilgan?",
  "variantlar": [
   "Moriarti tomonidan: Holmesni yolg‘iz qoldirish uchun Uotsonni undan ajratish kerak edi",
   "Mehmonxona egasining xizmatchisi xatoni boshqa mehmon uchun yozib, adashib yuborgan",
   "Holmesning o‘zi Uotsonni xavfdan uzoqlashtirish uchun bu xatni oldindan uyushtirgan",
   "Bu mahalliy bolalarning sayyohlar bilan qiladigan odatiy hazili edi"
  ],
  "javob": 0,
  "izoh": "Xat eng qulay lahzada keldi: ikkalasi shahar tashqarisidagi xilvat joyda. U Uotsonning shifokorlik burchiga murojaat qildi — rad etib bo‘lmaydigan sabab. Natija — Holmes yolg‘iz qoldi. Mehmonxonada hech kim xat yozmagan. Bundan foyda ko‘radigan yagona odam — Holmes bilan yakkama-yakka uchrashmoqchi bo‘lgan Moriarti. Holmes buni sezgan, lekin do‘stini xavfdan uzoqlashtirish uchun indamagan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Xat kelgan joy va vaqt nimani ko‘rsatadi?",
    "variantlar": [
     "Mehmonxona shoshilib qolgan",
     "Ikki do‘st shahar tashqarisidagi xilvat joyda edi — ularni ajratish uchun eng qulay payt",
     "Bu tasodifiy vaqt",
     "Xat ertaroq yozilgan, kech kelgan"
    ],
    "javob": 1,
    "izoh": "Tuzoq eng zaif lahzada qo‘yiladi: guvohsiz, xilvat joyda."
   },
   {
    "savol": "Nega Uotson bu chaqiruvni rad eta olmadi?",
    "variantlar": [
     "U Holmesdan charchagan",
     "U mehmonxonada pul qoldirgan",
     "U sharshara manzarasini yoqtirmagan",
     "Xat uning shifokorlik burchiga murojaat qilgan — o‘layotgan bemor yordam so‘ragan"
    ],
    "javob": 3,
    "izoh": "Eng yaxshi tuzoq odamning ezgu tuyg‘ulariga tayanadi: shifokor kasalga yordamni rad etmaydi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Bo‘sh uy",
  "yil": 1903,
  "sarlavha": "Derazadagi soya",
  "hikoya": "Holmes uch yildan so‘ng Londonga qaytdi. U Moriartining eng xavfli odami — mergan polkovnik <em>Moran</em> uni o‘ldirish payida ekanini bilardi. Holmes Beyker-stritdagi xonasining derazasiga o‘ziga o‘xshatib yasalgan mum byust qo‘ydi; uy bekasi uni har chorak soatda biroz burib qo‘yardi va derazada jonli odamning soyasi ko‘rinardi. Holmes va Uotson esa ro‘paradagi bo‘sh uyning qorong‘i xonasiga yashirinishdi.",
  "savol": "Holmesning rejasi qanday ishlaydi?",
  "variantlar": [
   "Byust do‘stlariga Holmes uyda ekanini bildirish, dushmanlarga esa uning qaytmaganini ko‘rsatish uchun",
   "Byust o‘g‘rilarni qo‘rqitib, Holmes yo‘qligida uyni qo‘riqlash uchun qo‘yilgan",
   "Holmes mergan uni allaqachon o‘ldirdim deb o‘ylab, Londondan ketib qolishini xohlagan",
   "Mergan derazadagi soyani Holmes deb o‘ylab, otish uchun eng qulay joy — ro‘paradagi bo‘sh uyga keladi va pistirmaga tushadi"
  ],
  "javob": 3,
  "izoh": "Holmes ovchining o‘zini ovladi: merganga nishon kerak — derazadagi «jonli» soya; otish uchun qulay joy kerak — ro‘paradagi bo‘sh uy. Demak, mergan aynan o‘sha uyga keladi va Holmes undan oldin u yerga yashirinib oldi. Moran byustga havo miltig‘idan o‘q uzdi va shu zahoti qo‘lga olindi. Byustni burib turish esa soya haqiqiy odamnikidek ko‘rinishi uchun edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Byustni har chorak soatda burib qo‘yish nima uchun kerak edi?",
    "variantlar": [
     "Soya qimirlab, derazada jonli odam o‘tirgandek ko‘rinishi uchun",
     "Byust sinmasligi uchun",
     "Quyosh tushmasligi uchun",
     "Bu uy bekasining odati"
    ],
    "javob": 0,
    "izoh": "Qotib turgan soya shubha uyg‘otadi. Kichik harakatlar uni «tirik» qiladi va merganni ishontiradi."
   },
   {
    "savol": "Holmes nega aynan ro‘paradagi bo‘sh uyga yashirindi?",
    "variantlar": [
     "U yerdan manzara chiroyli edi",
     "U yerda uning eski kvartirasi bor edi",
     "U merganning o‘q uzish uchun eng qulay joyni oldindan bilib, uni o‘sha yerda kutdi",
     "U yerda politsiya kutardi"
    ],
    "javob": 2,
    "izoh": "Raqib qanday fikrlashini oldindan bilib, uning harakat joyini egallash — strategik fikrlash namunasi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Norvud quruvchisi",
  "yil": 1903,
  "sarlavha": "Yangi barmoq izi",
  "hikoya": "Keksa quruvchi <em>Jonas Oldeykr</em> g‘oyib bo‘ldi, hovlisidagi yog‘och uyumidan esa kuygan qoldiqlar topildi. Bir kun oldin u butun boyligini yosh advokat <em>Makfarleyn</em>ga meros qoldirib vasiyatnoma yozgan edi — Makfarleyn o‘sha oqshom uning uyida bo‘lgan. Makfarleyn hibsga olindi. Ertasi kuni inspektor Lestreyd dahliz devorida Makfarleynning qonli bosh barmoq izini topdi. Ammo Holmes o‘sha devorni bir kun avval sinchiklab ko‘rgan edi — u yerda hech qanday iz yo‘q edi. Bundan tashqari, Holmes yuqori qavatdagi yo‘lakni o‘lchab chiqdi: u pastdagi xuddi shunday yo‘lakdan bir necha qadam qisqa chiqdi.",
  "savol": "Holmes qanday xulosaga keldi?",
  "variantlar": [
   "Makfarleyn aybdor — barmoq izi buni isbotlaydi",
   "Iz Makfarleyn hibsga olingandan keyin soxta qilib bosilgan — Oldeykr tirik va uyda yashirinib yotibdi",
   "Holmes kecha izni ko‘rmay qolgan",
   "Oldeykrni begona o‘g‘ri o‘ldirgan"
  ],
  "javob": 1,
  "izoh": "Kecha devorda iz yo‘q edi, bugun bor — demak u keyin bosilgan. Makfarleyn esa bu paytda qamoqda edi, ya’ni izni u bosa olmasdi: kimdir uni ataylab ayblamoqchi. Kuygan «qoldiqlar» shunchaki hayvon suyaklari bo‘lib chiqdi. Oldeykr o‘zini o‘lgan qilib ko‘rsatib, Makfarleynni qamatmoqchi edi. Izni u Makfarleyn hujjatga bosgan mum muhrdan nusxa olib, o‘z qoni bilan devorga bosgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Kecha yo‘q bo‘lgan izning bugun paydo bo‘lishi nimani anglatadi?",
    "variantlar": [
     "Iz eski, kecha shunchaki ko‘rinmagan",
     "Izni Holmesning o‘zi qoldirgan",
     "Iz devordagi namlikdan o‘z-o‘zidan bo‘rtib chiqqan",
     "Izni keyin kimdir ataylab bosgan — u soxta dalil"
    ],
    "javob": 3,
    "izoh": "Agar iz qotillik paytida qolgan bo‘lsa, u avval ham ko‘rinardi. Keyin paydo bo‘lgan iz — qo‘yilgan dalil."
   },
   {
    "savol": "Yuqori yo‘lakning pastdagidan qisqa chiqishi nimani ko‘rsatadi?",
    "variantlar": [
     "Uy qiyshiq qurilgan",
     "Devor ortida yashirin xona bor — «o‘lgan» quruvchi o‘sha yerda yashiringan",
     "Holmes noto‘g‘ri o‘lchagan",
     "Yuqori qavatga yangi gilam to‘shalgan"
    ],
    "javob": 1,
    "izoh": "Bir uyning ikki qavatidagi bir xil yo‘laklar teng bo‘lishi kerak. Farq — yashirin bo‘shliq. Holmes «Yong‘in!» deb baqirtirgach, Oldeykr o‘sha yashirin xonadan o‘zi otilib chiqdi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Raqsga tushayotgan odamchalar",
  "yil": 1903,
  "sarlavha": "Eng ko‘p uchraydigan belgi",
  "hikoya": "Janob <em>Kubitt</em>ning uyi devorlari va eshiklarida bolalar chizgandek raqsga tushayotgan odamchalar paydo bo‘la boshladi. Xotini ularni ko‘rib, qattiq qo‘rqardi. Holmes bir nechta xabarni to‘pladi. U har bir odamcha bitta harfni bildirishini taxmin qildi va ba’zi odamchalar qo‘lida bayroqcha ushlab turganini ko‘rdi. Xabarlar ingliz tilida edi; ingliz tilida eng ko‘p ishlatiladigan harf — <em>E</em>.",
  "savol": "Holmes shifrni yechishni qayerdan boshladi?",
  "variantlar": [
   "Birinchi chizilgan odamchani A harfi, ikkinchisini B harfi deb, alifbo tartibida ketma-ket oldi",
   "Eng ko‘p takrorlangan odamchani E harfi deb oldi, bayroqchali odamchalarni esa so‘z oxiri deb hisobladi",
   "Odamchalarning qo‘l-oyoq holatini sanab, ularni sanalar va soatlar deb o‘qidi",
   "Shifr kalitini Kubittning xotinidan so‘rab bildi, chunki u xabarlarni taniydi"
  ],
  "javob": 1,
  "izoh": "Bu — chastota tahlili: har bir tilda harflar turlicha tez-tez uchraydi. Agar har bir belgi bitta harfni bildirsa, eng ko‘p uchraydigan belgi eng ko‘p ishlatiladigan harf — E bo‘lishi ehtimoli yuqori. Bayroqchalar so‘zlarni ajratadi va so‘z uzunligi ma’lum bo‘ladi. Keyin ismlar (Elsi) va tez-tez ishlatiladigan so‘zlar orqali qolgan harflar topildi. Holmes shu shifrda o‘zi xabar yozib, jinoyatchini tuzoqqa tushirdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Bayroqchali odamchalar nimani bildiradi?",
    "variantlar": [
     "E harfini",
     "Sanani",
     "So‘zning oxirini — ular so‘zlarni bir-biridan ajratadi",
     "Imzoni"
    ],
    "javob": 2,
    "izoh": "Shifrda bo‘shliq yo‘q bo‘lsa, so‘z chegarasini bilish juda muhim. Bayroqcha shu vazifani bajaradi."
   },
   {
    "savol": "Holmes topgan shifr bilan yana nima qildi?",
    "variantlar": [
     "O‘sha belgilar bilan o‘zi xabar yozib, jinoyatchini tuzoqqa chaqirdi",
     "Uni gazetada e’lon qildi",
     "Uni o‘chirib tashladi",
     "Uni politsiyaga sotdi"
    ],
    "javob": 0,
    "izoh": "Raqibning tilini o‘rganish — unga o‘z tilida «gapirish» imkonini beradi. Jinoyatchi xabarni o‘zinikidan deb o‘ylab keldi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Yolg‘iz velosipedchi",
  "yil": 1903,
  "sarlavha": "Masofa saqlaydigan ta’qibchi",
  "hikoya": "Musiqa o‘qituvchisi <em>Violet Smit</em> har shanba velosipedda stansiyaga borardi. Har gal kimsasiz yo‘lda uning orqasidan qora soqolli velosipedchi paydo bo‘lardi: u doim bir xil masofa saqlar, qiz to‘xtasa — u ham to‘xtar, qiz unga qarab yursa — burilib, g‘oyib bo‘lardi. U hech qachon yaqinlashmas, yuzini ko‘rsatmasdi. Qiz ishlaydigan uy xo‘jayini janob <em>Karruters</em> unga juda yaxshi munosabatda edi va ilgari unga turmush qurishni ham taklif qilgandi.",
  "savol": "Velosipedchi haqida eng ishonchli xulosa qaysi?",
  "variantlar": [
   "Bu shunchaki o‘sha yo‘ldan har shanba stansiyaga boradigan tasodifiy yo‘lovchi",
   "Bu qizni taniydigan va unga g‘amxo‘rlik qiladigan, lekin tanilib qolishni istamaydigan odam — u qizni kuzatib, qo‘riqlab yuradi",
   "Bu qizni o‘g‘irlash uchun qulay payt poylab yurgan notanish jinoyatchi",
   "Bu poygaga tayyorlanayotgan sportchi: u qizning tezligiga moslashib, mashq qilardi"
  ],
  "javob": 1,
  "izoh": "Xatti-harakat maqsadni ochadi: u yaqinlashmaydi va hujum qilmaydi — zarar yetkazmoqchi emas. Masofa saqlaydi, yuzini yashiradi, qochadi — tanilib qolishdan qo‘rqadi, ya’ni qiz uni taniydi. Har shanba aniq vaqtda chiqadi — qizning jadvalini biladi. Haqiqatan, bu soxta soqol taqqan Karruters edi: u qizni boshqa xavfli odamlardan yashirincha qo‘riqlab yurgan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Velosipedchi har shanba aniq vaqtda paydo bo‘lishi nimani ko‘rsatadi?",
    "variantlar": [
     "U shu yo‘lda ishlaydi",
     "U qizni birinchi marta ko‘rgan",
     "U qizning jadvalini biladi — ya’ni qizning yaqin muhitidan",
     "Bu tasodif"
    ],
    "javob": 2,
    "izoh": "Takroriy aniq vaqt — tasodif emas. Jadvalni bilish yaqin tanishlikni ko‘rsatadi."
   },
   {
    "savol": "Soxta soqol nima uchun kerak edi?",
    "variantlar": [
     "Qiz uni tanib qolmasligi uchun",
     "Sovuqdan himoyalanish uchun",
     "Moda uchun",
     "Boshqa velosipedchilarga o‘xshash uchun"
    ],
    "javob": 0,
    "izoh": "Niqob odatda tanish odamdan yashiriladi. Notanish odamga niqob kerak emas."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Monastir maktabi",
  "yil": 1904,
  "sarlavha": "Sigirlar qayerda?",
  "hikoya": "Gersogning o‘g‘li maktabdan g‘oyib bo‘ldi. Holmes va Uotson botqoqlik bo‘ylab izlarni o‘rganishdi. Velosiped izlaridan tashqari yo‘lda faqat sigir tuyog‘i izlari bor edi, lekin atrofda birorta ham sigir ko‘rinmasdi. Holmes izlarni sinchiklab tekshirdi: ular goh yurish, goh yo‘rtish, goh chopish tartibida joylashgan edi — sigirlar esa deyarli hech qachon bunday chopmaydi. Yaqindagi mehmonxona egasining otxonasida esa yaqinda taqalangan otlar turardi.",
  "savol": "Sigir izlari aslida kimniki edi?",
  "variantlar": [
   "Botqoqlikda erkin yuradigan yovvoyi sigirlarniki — ular kunduzi qamishzorda yashirinadi",
   "Bular ancha eski izlar, botqoq loyi ularni haftalab saqlaydi — voqeaga aloqasi yo‘q",
   "Bolani olib qochganlar sigirni yetaklab ketishgan, shunda izlar oddiy ko‘rinadi",
   "Otlarniki: izlarni chalkashtirish uchun ularga sigir tuyog‘i shaklidagi maxsus taqalar qoqilgan"
  ],
  "javob": 3,
  "izoh": "Ikki zid fakt: sigir izlari ko‘p, sigirlar esa yo‘q. Izlarning tartibi (yo‘rtish, chopish) sigirga emas, otga xos. Demak, iz qoldirgan hayvon — ot, faqat tuyog‘i «sigirniki». Bu ataylab qilingan niqob: kuzatuvchilarni chalg‘itish uchun otlarga sigir tuyog‘i shaklidagi taqalar qoqilgan. Holmes mehmonxona temirchixonasidan aynan shunday eski taqalarni topdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Sigir izlarining «yurish, yo‘rtish, chopish» tartibida bo‘lishi nimani ko‘rsatadi?",
    "variantlar": [
     "Sigirlar qo‘rqib qochgan",
     "Izlar eski",
     "Bu bir nechta sigir",
     "Bu ot yurishi — iz qoldirgan hayvon ot"
    ],
    "javob": 3,
    "izoh": "Har bir hayvonning o‘ziga xos yurishi bor. Tuyoq shakli aldashi mumkin, harakat tartibi esa yo‘q."
   },
   {
    "savol": "Holmes qayerdan maxsus taqalarni topdi?",
    "variantlar": [
     "Gersogning otxonasidan",
     "Yaqindagi mehmonxonaning temirchixonasidan",
     "Maktab omboridan",
     "Botqoqdan"
    ],
    "javob": 1,
    "izoh": "Iz qoldirgan narsani yasagan joy — dalil zanjirining oxiri. Temirchixona otlar va taqalarni bog‘ladi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Qora Piter",
  "yil": 1904,
  "sarlavha": "Bir zarbadagi garpun",
  "hikoya": "Sobiq kit ovchisi kapitan <em>Piter Keri</em> o‘z kulbasida garpun bilan devorga mixlangan holda topildi: garpun uning ko‘kragidan teshib o‘tib, taxta devorga qadalgan edi. Gumon yosh, ozg‘in va kasalmand <em>Neligan</em>ga tushdi: u kulbada kapitanning eski qayd daftarini qidirgan. Holmes ertalab qassobxonaga borib, osib qo‘yilgan cho‘chqa tanasiga garpun bilan zarba berdi — bor kuchiga qaramay, garpunni bir zarbada teshib o‘tkaza olmadi.",
  "savol": "Holmesning tajribasi nimani isbotladi?",
  "variantlar": [
   "Bunday zarbani faqat juda kuchli va garpun otishga tajribali odam — kit ovchisi bera oladi; zaif Neligan qotil emas",
   "Garpun eski va o‘tmas bo‘lgan — demak, qotil uni oldindan charxlab olib kelgan",
   "Kapitan o‘zini o‘zi garpun bilan o‘ldirgan, chunki bunday zarbani boshqa odam bera olmaydi",
   "Neligan qotil: u kulbada bo‘lgan, daftarni qidirgan, tajriba esa hech narsani o‘zgartirmaydi"
  ],
  "javob": 0,
  "izoh": "Tajriba gumonni tekshirish usuli: agar sog‘lom Holmes cho‘chqa tanasini bir zarbada teshib o‘tkaza olmasa, ozg‘in Neligan tirik odamni devorga mixlay olmaydi. Demak, qotil — garpundan foydalanishni yaxshi biladigan baquvvat dengizchi. Holmes «garpunchi kerak» degan e’lon berdi va kapitanning sobiq hamkasbi Patrik Kerns keldi — u qotil bo‘lib chiqdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Kulbadagi qayd daftarini qidirgan Neligan haqida qaysi fikr to‘g‘ri?",
    "variantlar": [
     "U albatta qotil",
     "U daftar uchun kelgan bo‘lishi mumkin, lekin bu uni qotil qilmaydi",
     "U kapitanning qarindoshi",
     "U garpunchi"
    ],
    "javob": 1,
    "izoh": "Sahna joyida bo‘lish va qotillik — har xil narsalar. Qotillik qurolini ishlatish qobiliyati ham isbotlanishi kerak."
   },
   {
    "savol": "Holmes haqiqiy qotilni qanday chaqirib oldi?",
    "variantlar": [
     "Politsiya bilan reyd qilib",
     "Kemalar ro‘yxatini o‘qib",
     "Daftarni gazetada chop etib",
     "«Garpunchi kerak» degan e’lon berib"
    ],
    "javob": 3,
    "izoh": "Qotilning o‘ziga xos mahoratiga «ish taklifi» — uni o‘zi kelishga majbur qiladi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Charlz Ogastes Milverton",
  "yil": 1904,
  "sarlavha": "Lestreydning tasviri",
  "hikoya": "Shantajchi <em>Milverton</em> kechasi o‘z kabinetida otib o‘ldirildi. Ertasi kuni inspektor <em>Lestreyd</em> Holmesdan yordam so‘rab keldi: guvohlar ikki niqobli odamning bog‘ devoridan oshib qochganini ko‘rishgan. Lestreyd ikkinchisini shunday tasvirladi: «O‘rta bo‘yli, baquvvat, jag‘i to‘rtburchak, bo‘yni yo‘g‘on, mo‘ylovli». Holmes kulib: «Bu juda noaniq-ku. Bu Uotsonning tasviri bo‘lishi ham mumkin», dedi. Uotson esa o‘sha kecha Holmes bilan birga bog‘ devoridan oshib qochganini yaxshi eslardi.",
  "savol": "Guvohlar ko‘rgan ikki «niqobli» kim edi?",
  "variantlar": [
   "Milvertonning seyfini ochmoqchi bo‘lgan ikki professional o‘g‘ri",
   "Milvertonni kuzatib yurgan Lestreydning maxfiy agentlari",
   "Holmes va Uotsonning o‘zlari: ular shantaj xatlarini yo‘q qilish uchun uyga kirishgan va qotillikka guvoh bo‘lishgan",
   "Milvertonning o‘zi yollagan, keyin unga xiyonat qilgan ikki qo‘riqchi"
  ],
  "javob": 2,
  "izoh": "Tasvir Uotsonga juda mos keladi, Holmesning hazili esa ochiq ishora. Uotsonning o‘zi o‘sha kecha devordan oshib qochganini eslaydi. Demak, «ikki niqobli» — ular. Holmes va Uotson shantaj qurbonlarini qutqarish uchun xatlarni yoqish niyatida kirishgan va ko‘z oldilarida bir xonim Milvertonni otganini ko‘rishgan. Holmes ishni olishdan bosh tortdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holmes nega Lestreydga yordam berishdan bosh tortdi?",
    "variantlar": [
     "Uning fikricha, shantajchi o‘z qurbonlaridan biridan jazosini olgan edi",
     "U band edi",
     "U Lestreydni yoqtirmasdi",
     "U qotilni bilmasdi"
    ],
    "javob": 0,
    "izoh": "Holmes ba’zan qonundan ko‘ra adolatni ustun qo‘yardi. Bu ishda u qurbonlarning sirini himoya qildi."
   },
   {
    "savol": "Lestreydning tasviri nega «noaniq»?",
    "variantlar": [
     "U juda batafsil edi",
     "U ayolni tasvirlagan",
     "Unda millionlab odamlarga mos keladigan umumiy belgilar bor — o‘ziga xos belgi yo‘q",
     "U hech kimga mos kelmaydi"
    ],
    "javob": 2,
    "izoh": "Yaxshi tasvir noyob belgilarni o‘z ichiga oladi. «O‘rta bo‘y, baquvvat, mo‘ylovli» — juda ko‘p odamga mos."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Olti Napoleon",
  "yil": 1904,
  "sarlavha": "Olti byust",
  "hikoya": "Londonda g‘alati jinoyatlar boshlandi: kimdir do‘kon va uylarga kirib, Napoleonning gips byustlarini o‘g‘irlar va darhol sindirib tashlardi. Boshqa hech narsa olinmasdi — na pul, na kumush. Inspektor Lestreyd: «Bu Napoleonni yomon ko‘radigan telbaning ishi», dedi. Holmes esa aniqladi: barcha byustlar bitta ustaxonada, bir paytda quyilgan oltita byustdan edi. Bir yil oldin o‘sha ustaxonada ishlagan italyan <em>Beppo</em> mashhur qora marvarid o‘g‘irlangan kunlarda politsiyadan yashirinib yurgan, so‘ng boshqa ish uchun qamalib ketgan edi. Byustlarni u doim yorug‘ joyda — chiroq yoki ko‘cha fonari tagida sindirardi.",
  "savol": "Nega jinoyatchi faqat Napoleon byustlarini sindirardi?",
  "variantlar": [
   "Napoleonga bo‘lgan nafrat tufayli",
   "Gips qimmatbaho material bo‘lgani uchun",
   "U marvaridni hali qotmagan byustlardan birining ichiga yashirgan; qaysi biriga ekanini bilmagani uchun hammasini sindirardi",
   "U ruhiy kasal edi, shuning uchun hamma byustni sindirardi"
  ],
  "javob": 2,
  "izoh": "Jinoyatning foydasi yo‘q: pul olinmagan, qimmatbaho narsalarga tegilmagan. Faqat bir xil, bir partiyadan chiqqan buyumlar. Demak jinoyatchi byustning o‘zini emas, ichidagi narsani qidirardi. Beppo politsiyadan qochib ustaxonaga kirganda, marvaridni qurib turgan byustlardan birining ichiga yashirgan. Qamoqdan chiqqach, oltita byust qayerga sotilganini birma-bir topib, sindirib chiqqan. Harakat ma’nosiz ko‘rinsa, «nima uchun» emas, «nima uchun aynan shu narsa» deb so‘rang.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega Beppo byustlarni aynan yorug‘ joyda sindirardi?",
    "variantlar": [
     "Qo‘lga tushishni xohlagan",
     "Qorong‘idan qo‘rqardi",
     "Gips yorug‘da osonroq sinadi",
     "Parchalar orasidan kichik narsani — marvaridni qidirish uchun"
    ],
    "javob": 3,
    "izoh": "Yorug‘lik — qidiruv belgisi. Shunchaki sindirmoqchi bo‘lgan odamga chiroq kerak emas; ichidan nimanidir topmoqchi bo‘lgan odamga esa kerak."
   },
   {
    "savol": "Holmes qanday qilib jinoyatchidan oldin marvaridni topdi?",
    "variantlar": [
     "Byustlarni suvga solib ko‘rdi",
     "Oxirgi byustni egasidan sotib olib, uni o‘zi sindirdi",
     "Jinoyatchini so‘roq qildi",
     "Ustaxonani tintuv qildi"
    ],
    "javob": 1,
    "izoh": "Beshta byustning taqdiri ma’lum bo‘lgach, marvarid faqat oltinchisida qolishi mumkin edi. Holmes uni egasidan sotib olib, o‘sha yerda sindirdi — ichidan Borjia oilasining qora marvaridi chiqdi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Uch talaba",
  "yil": 1904,
  "sarlavha": "Derazadan ko‘rinadigan qog‘ozlar",
  "hikoya": "Imtihondan bir kun oldin o‘qituvchi xonasidagi stolda imtihon savollari qoldirilgan edi. Kimdir ularni ko‘chirib olgan: stolda qalam qirindilari, stol ustida yangi tirnalish va kichik qora loy bo‘lagi topildi. Shu zinapoyada uch talaba yashaydi: baland bo‘yli sportchi — uzunlikka sakrovchi <em>Gilkrist</em>; tirishqoq, past bo‘yli <em>Daulat Ras</em>; qiziqqon, lekin iste’dodli <em>Makleren</em>. Xona derazasi yo‘lakka qaraydi va ancha baland joylashgan. Sakrovchilar tagida mixi bor poyabzal kiyadi, sakrash chuquri esa qora loy va qipiq bilan to‘ldiriladi.",
  "savol": "Qog‘ozlarni kim ko‘chirgan?",
  "variantlar": [
   "Daulat Ras: u eng tirishqoq, imtihondan ko‘proq qo‘rqqan va qalam qirindilari unikiga o‘xshaydi",
   "Makleren: u qiziqqon, qoidalarni yoqtirmaydi va ilgari ham intizomni buzgan",
   "Gilkrist: faqat uning bo‘yi baland derazadan qog‘ozlarni ko‘rishga yetadi; loy — sakrash chuqurinikidan, tirnalish — mixli poyabzaldan",
   "O‘qituvchining xizmatkori: u xonaga kalit bilan erkin kira oladi"
  ],
  "javob": 2,
  "izoh": "Uch dalil bitta odamga olib boradi. Kimdir derazadan stoldagi qog‘ozlarni ko‘rib, kirishga qaror qilgan — buning uchun juda baland bo‘y kerak. Qora loy — sakrash chuquri loyi. Stoldagi tirnalish — mixli sport poyabzali izi. Uchalasi — baland bo‘yli sakrovchi Gilkrist. U aybini bo‘yniga oldi va o‘qishni tashlab ketishga qaror qildi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Qaysi dalil faqat bitta talabaga mos keladi va nega?",
    "variantlar": [
     "Qalam qirindilari — hamma talaba qalam ishlatadi",
     "Stoldagi qog‘ozlar",
     "Qora loy — u faqat sakrash chuquridan keladi, sakrovchi esa bitta: Gilkrist",
     "Imtihon sanasi"
    ],
    "javob": 2,
    "izoh": "Umumiy dalillar (qalam) hech kimni ajratmaydi. Noyob dalil (sakrash chuquri loyi) gumondorlar doirasini bitta odamga toraytiradi."
   },
   {
    "savol": "Daulat Ras nega gumondan chiqadi?",
    "variantlar": [
     "Uning bo‘yi past — derazadan stoldagi qog‘ozlarni ko‘ra olmaydi",
     "U tirishqoq",
     "U chet ellik",
     "U kechqurun uyda edi"
    ],
    "javob": 0,
    "izoh": "Jinoyatning birinchi qadami — derazadan qog‘ozni ko‘rish. Bunga jismonan qodir bo‘lmagan odam chiqib ketadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Oltin pensne",
  "yil": 1904,
  "sarlavha": "Ko‘zoynaksiz qochqin",
  "hikoya": "Professorning kotibi o‘ldirildi; uning qo‘lida oltin pensne (burunga qisib taqiladigan ko‘zoynak) qoldi. Holmes ko‘zoynakni o‘rganib xulosa qildi: egasi — ayol, juda kuchli yaqindan ko‘ruvchi, ko‘zoynaksiz deyarli hech narsani ko‘rmaydi. Bog‘ yo‘lagi o‘t bilan o‘ralgan, ko‘rmaydigan odam unda albatta iz qoldirardi — izlar esa yo‘q. Uydagi ikki yo‘lak bir-biriga juda o‘xshash, ikkalasiga bir xil kokos gilam to‘shalgan: biri bog‘ga, ikkinchisi professor xonasiga olib boradi. Holmes professor xonasida sigaret kulini atayin polga to‘kib yurdi.",
  "savol": "Holmes qanday xulosaga keldi?",
  "variantlar": [
   "Ko‘zoynaksiz ayol bir xil yo‘laklarni adashtirib, bog‘ga emas, professor xonasiga kirgan va hali ham o‘sha yerda yashirinib turibdi",
   "Ayol bog‘ orqali qochgan, izlarni esa ertalab bog‘bon bexabar o‘chirib yuborgan",
   "Ko‘zoynak kotibning o‘ziniki, xonaga hech qanday ayol kirmagan",
   "Ayol yo‘lakdagi derazadan sakrab, ko‘chaga qochib ketgan"
  ],
  "javob": 0,
  "izoh": "Kuchli yaqindan ko‘ruvchi odam ko‘zoynaksiz o‘tli yo‘lakda izsiz yura olmaydi — izlar yo‘q, demak bog‘ga chiqmagan. Ikkala yo‘lak bir xil — ko‘rmaydigan odam osongina adashadi. Demak, u professor xonasiga kirgan va o‘sha yerda. Holmes kulni polga to‘kdi: keyin kuldagi yangi izlar xonada yashiringan kimdir chiqib yurganini ko‘rsatdi. Ayol kitob javoni ortidagi yashirin bo‘shliqdan chiqdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nima uchun ayol ko‘zoynagini yo‘qotgani muhim?",
    "variantlar": [
     "Ko‘zoynak qimmat edi",
     "U boshqa ko‘zoynak taqardi",
     "U deyarli ko‘rmasdan qochishga majbur bo‘ldi — bu uning yo‘lini oldindan aytishga imkon berdi",
     "Bu ishga aloqasi yo‘q"
    ],
    "javob": 2,
    "izoh": "Odamning cheklovini bilish uning harakatini bashorat qiladi: ko‘rmaydigan odam osonlik bilan adashadi."
   },
   {
    "savol": "Holmes kulni polga to‘kishdan nimani maqsad qildi?",
    "variantlar": [
     "Xonada yashiringan odam chiqib yursa, kuldagi izlardan bilib olish",
     "Xonani iflos qilish",
     "Professorni g‘azablantirish",
     "Sigaret chekishni yoqtirgani uchun"
    ],
    "javob": 0,
    "izoh": "Bu — tuzoq-dalil: Holmes «iz qolsin» deb maxsus sharoit yaratdi va keyin kuldagi yangi izlarni ko‘rdi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Yo‘qolgan himoyachi",
  "yil": 1904,
  "sarlavha": "Anis hidi",
  "hikoya": "Regbi jamoasining eng yaxshi o‘yinchisi <em>Godfri Staunton</em> muhim o‘yin oldidan g‘oyib bo‘ldi. Iz Kembrijdagi doktor <em>Armstrong</em>ga olib bordi: u har kuni aravasida shahar tashqarisiga noma’lum joyga borar, kuzatuvchilardan esa doim qochib qutulardi. Holmes kechasi doktor aravasining orqa g‘ildiragiga anis moyi sepib qo‘ydi va ertalab hidni yaxshi oladigan izquvar itni ergashtirib chiqdi.",
  "savol": "Holmesning usuli nimaga asoslangan?",
  "variantlar": [
   "Anis moyi g‘ildirakni sirpantirib, aravani sekinlashtiradi va uni quvib yetish oson bo‘ladi",
   "Doktor anis hidini sezib, kimdir kuzatayotganini tushunadi va qo‘rqib, sirini aytib beradi",
   "It aravani to‘xtatish uchun o‘rgatilgan, anis esa unga qaysi aravani to‘xtatishni ko‘rsatadi",
   "It anis hidi qoldirgan g‘ildirak izini kuzatadi: doktorga ko‘rinmasdan uning manzilini topish mumkin"
  ],
  "javob": 3,
  "izoh": "Doktor ko‘zga ko‘rinadigan kuzatuvdan qochardi — demak, ko‘rinmaydigan iz qoldirish kerak edi. G‘ildirak har aylanganda yerda hid qoldiradi, izquvar it esa bunday hidni kilometrlab kuzatadi. Holmes aravadan uzoqda qolib, uni bemalol kuzatdi va qishloqdagi kulbani topdi: u yerda Stauntonning yashirincha uylangan, og‘ir kasal xotini yotgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega Holmes aravani ochiqdan-ochiq kuzatmadi?",
    "variantlar": [
     "Unda vaqt yo‘q edi",
     "U doktor bilan do‘st edi",
     "Arava juda tez edi",
     "Doktor kuzatuvchilardan doim qochib qutulardi"
    ],
    "javob": 3,
    "izoh": "Agar ko‘rinadigan kuzatuv ishlamasa, ko‘rinmaydigan iz qoldirish kerak — anis hidi shunday iz."
   },
   {
    "savol": "Doktorning sirli safarlari oxir-oqibat nima bilan izohlandi?",
    "variantlar": [
     "U jinoyatchilarga yordam berardi",
     "U Stauntonning yashirincha uylangan, og‘ir kasal xotinini davolayotgan edi",
     "U o‘yinni sotgan edi",
     "U Stauntonni o‘g‘irlagan edi"
    ],
    "javob": 1,
    "izoh": "Sir har doim ham jinoyat emas. Bu yerda u xususiy fojiani yashirgan edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Ebbi-Grenj",
  "yil": 1904,
  "sarlavha": "Uch qadah",
  "hikoya": "Ser <em>Yustas Brekenstoll</em> o‘ldirildi. Xonimning aytishicha, uch o‘g‘ri kirib, erini o‘ldirgan, keyin uchovi vino ichib ketgan. Stolda uchta qadah turardi, uchalasida ham vino izi bor. Holmes diqqat bilan qaradi: eski vinoda doim cho‘kma — quyqa bo‘ladi. Bitta qadahda quyqa juda ko‘p edi, qolgan ikkitasi esa tip-tiniq.",
  "savol": "Bu nimani bildiradi?",
  "variantlar": [
   "Uchala o‘g‘ri ham ichgan, faqat biri shishaning tagidagi oxirgi qismini olgan",
   "Aslida ikki qadahdan ichilgan, ularning qoldig‘i uchinchisiga to‘kilib, «uch kishi ichgan» ko‘rinishi yaratilgan — xonimning hikoyasi yolg‘on",
   "Quyqa qadahga tasodifan tushgan, bunday tafsilot hech narsani isbotlamaydi",
   "Ikki o‘g‘ri vino ichmagan, faqat ularning boshlig‘i ichgan — bu uning qo‘pol odatini ko‘rsatadi"
  ],
  "javob": 1,
  "izoh": "Bitta shishadan ketma-ket quyilsa, quyqa odatda faqat oxirgi qadahda emas, boshqalarida ham ozroq bo‘ladi; ikkita qadahning mutlaqo tiniqligi va bittasida juda ko‘p quyqa — qoldiqlar bir joyga to‘kilganining belgisi. Demak, sahna sun’iy: kimdir «uch kishi ichgan» ko‘rinishini yaratgan. Holmes xonim kimnidir yashirayotganini tushundi — u zolim eridan uni himoya qilgan dengizchi kapitan Kroker edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Bitta qadahda juda ko‘p quyqa, ikkitasi esa butunlay tiniq bo‘lishi nimani ko‘rsatadi?",
    "variantlar": [
     "Uchala o‘g‘ri ham ichgan",
     "Qadahlarning qoldiqlari bitta qadahga to‘kilgan — sahna sun’iy",
     "Vino yangi edi",
     "Quyqa tasodifan tushgan"
    ],
    "javob": 1,
    "izoh": "Tabiiy holatda quyqa qadahlar o‘rtasida asta-sekin taqsimlanadi. Bunday keskin farq qo‘l bilan qilingan o‘zgarishni ko‘rsatadi."
   },
   {
    "savol": "Bu dalil xonimning qaysi gapini shubha ostiga qo‘ydi?",
    "variantlar": [
     "Erining zolimligi haqidagi gapini",
     "Uning ismini",
     "Uning qayerdaligini",
     "Uch o‘g‘ri kirib, vino ichib ketgani haqidagi hikoyasini"
    ],
    "javob": 3,
    "izoh": "Dalil hikoyaning bitta bo‘lagini rad etsa, butun hikoyani qayta tekshirish kerak."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "qaytish",
  "asar": "Ikkinchi dog‘",
  "yil": 1904,
  "sarlavha": "Mos kelmaydigan dog‘lar",
  "hikoya": "Xalqaro josus <em>Lukas</em> o‘z uyida o‘ldirildi; xonadagi gilamda katta qon dog‘i qoldi. Bir necha kundan keyin politsiyachi gilamni ko‘targanda hayron qoldi: gilam ostidagi taxta polda ham dog‘ bor, lekin u gilamdagi dog‘ ostida emas, boshqa burchakda edi. Holmes gilamni burib qo‘ydi — dog‘lar ustma-ust tushdi. Politsiyachi kechasi bir yosh xonimni xonani ko‘rish uchun ichkariga kiritgani va o‘zi bir necha daqiqaga chiqib ketganini tan oldi.",
  "savol": "Dog‘larning mos kelmasligi nimani anglatadi?",
  "variantlar": [
   "Qon ikki xil vaqtda to‘kilgan: biri qotillik paytida, biri keyinroq",
   "Kimdir gilamni ko‘tarib, ostidagi yashirin joydan nimanidir olgan va gilamni shoshib, boshqa tomoni bilan qayta yotqizgan",
   "Gilam doim qiyshiq yotgan, josus uni hech qachon to‘g‘rilamagan",
   "Politsiya tergov paytida gilamni tozalash uchun olib, noto‘g‘ri qaytargan"
  ],
  "javob": 1,
  "izoh": "Qon gilamdan o‘tib, polga tushadi — qotillik paytida dog‘lar ustma-ust bo‘lgan. Hozir mos emas — gilam keyin siljitilgan. Nega? Gilam ostida yashirin joy bor va undan kimdir nimanidir olgan, so‘ng shoshib gilamni qayta yotqizgan. Politsiyachi xonani qisqa vaqtga tashlab ketganini tan oldi — aynan o‘sha paytda kirgan xonim yashirin joydan o‘g‘irlangan maxfiy xatni olgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Qon dog‘i gilam ostidagi polga qanday tushadi?",
    "variantlar": [
     "Qon gilam orqali o‘tib, aynan uning ostiga tushadi",
     "Faqat gilam chetidan oqib",
     "Hech qachon tushmaydi",
     "Qon polga sachrab tushadi"
    ],
    "javob": 0,
    "izoh": "Suyuqlik matodan to‘g‘ridan-to‘g‘ri pastga singadi. Shuning uchun dastlab dog‘lar ustma-ust bo‘lishi kerak edi."
   },
   {
    "savol": "Politsiyachining tan olishi nima uchun hal qiluvchi?",
    "variantlar": [
     "U qotilni ko‘rgan",
     "U o‘zi gilamni ko‘chirgan",
     "U kimdir xonaga kirib, yolg‘iz qolganini — gilamni siljitish imkoniyati bo‘lganini ko‘rsatdi",
     "U hech narsani ko‘rmagan"
    ],
    "javob": 2,
    "izoh": "Dalil «nima bo‘lgan»ni ko‘rsatadi, guvohlik esa «qachon va kim»ni. Ikkalasi birlashganda ish ochiladi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Visteriya uyi",
  "yil": 1908,
  "sarlavha": "Yettinchi eshik",
  "hikoya": "Qotillik qurboni <em>Garsiya</em>ning narsalari orasidan bir varaq xat topildi: «Bizning ranglarimiz — yashil va oq. Yashil — ochiq, oq — yopiq. Asosiy zinapoya, birinchi yo‘lak, o‘ngdan yettinchi eshik, yashil movut. Omad. D.» Garsiya kechasi uyidan piyoda chiqib, yaqin atrofdagi qayergadir borayotgan edi va bir necha chaqirim ichida o‘ldirilgan.",
  "savol": "Xatdan izlanayotgan uy haqida qanday xulosa chiqarish mumkin?",
  "variantlar": [
   "Bu kichik qishloq kulbasi: «yettinchi eshik» — ko‘chadagi yettinchi uy degani",
   "Uy shaharning boshqa chekkasida, Garsiya u yerga poyezdda borishi kerak edi",
   "Xat ma’nosiz: uni tergovchilarni chalg‘itish uchun Garsiyaning o‘zi yozgan",
   "Bu juda katta uy: asosiy zinapoyasi va birinchi yo‘lakning o‘zida o‘ngda kamida yetti eshigi bor; u Garsiyaning uyidan piyoda boriladigan masofada"
  ],
  "javob": 3,
  "izoh": "«Birinchi yo‘lak, o‘ngdan yettinchi eshik» — bitta yo‘lakda o‘ngda yetti eshik kichik uyda bo‘lmaydi; asosiy zinapoyaning tilga olinishi ham katta qasrga ishora. «Yashil — ochiq, oq — yopiq» — signal: yo‘l ochiq yoki xavfli. Garsiya kechasi piyoda chiqqan — demak, uy yaqin. Holmes atrofdagi katta uylarni ko‘rib chiqib, Xay-Geybl qasrini topdi; u yerda yashirinib yurgan sobiq zolim hukmdor yashardi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "«Yashil — ochiq, oq — yopiq» iborasi nimani anglatadi?",
    "variantlar": [
     "Uyning ranglari",
     "Bayroq ranglari",
     "Kiyimning rangi",
     "Signal: yashil chiroq — yo‘l ochiq, kirish mumkin; oq — xavfli, kirma"
    ],
    "javob": 3,
    "izoh": "Ranglar bilan kelishilgan signal — maxfiy aloqaning keng tarqalgan usuli."
   },
   {
    "savol": "Garsiyaning piyoda chiqqani nimani ko‘rsatadi?",
    "variantlar": [
     "U pulsiz edi",
     "Izlanayotgan uy uning uyiga yaqin, piyoda boriladigan joyda",
     "U sport bilan shug‘ullanardi",
     "Uy boshqa shaharda"
    ],
    "javob": 1,
    "izoh": "Harakat usuli masofani cheklaydi: piyoda kechasi uzoqqa bormaydi, demak qidiruv doirasi torayadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Karton quti",
  "yil": 1893,
  "sarlavha": "Qulog‘ning shakli",
  "hikoya": "Keksa miss <em>Kushing</em>ga tuz to‘ldirilgan karton qutida dahshatli «sovg‘a» yuborildi: ikkita kesilgan quloq — biri erkaknikidek, ikkinchisi ayolniki, sirg‘a uchun teshilgan. Politsiya buni tibbiyot talabalarining qo‘pol hazili deb hisobladi. Holmes suhbat paytida miss Kushingning qulog‘iga uzoq tikilib qoldi: qulog‘ining shakli, yuqori qismining egilishi va solinchagi qutidagi ayol qulog‘i bilan deyarli bir xil edi. Miss Kushingning ikki singlisi bor edi. Qutini bog‘lagan ip esa dengizchilar tuguni bilan bog‘langan edi.",
  "savol": "Holmes qanday xulosaga keldi?",
  "variantlar": [
   "Ayol qulog‘i miss Kushingning qon qarindoshiga — singlisiga tegishli; demak, bu hazil emas, jinoyat, jinoyatchi esa dengizchi",
   "Quloqlar talabalarning anatomiya mashg‘ulotidan qolgan, o‘xshashlik esa tasodif",
   "Quloqlar mumdan yasalgan, kimdir miss Kushingni qo‘rqitib, uydan ko‘chirmoqchi",
   "Qutini miss Kushingning o‘zi yuborgan, u e’tibor tortishni xohlagan"
  ],
  "javob": 0,
  "izoh": "Quloq shakli yuzdan ham o‘ziga xos va ko‘pincha oilada meros bo‘lib o‘tadi. Ayol qulog‘i miss Kushingnikiga juda o‘xshash — demak, uning yaqin qarindoshiniki. Talabalar tasodifan aynan uning singlisining qulog‘ini yubora olmaydi — bu hazil emas. Dengizchilar tuguni jinoyatchining kasbini ko‘rsatdi. Qutini singlisining eri — rashk tufayli jinoyat qilgan dengizchi Jim Braun yuborgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega «talabalarning hazili» degan izoh to‘g‘ri kelmaydi?",
    "variantlar": [
     "Talabalar hazil qilmaydi",
     "Quti juda qimmat edi",
     "Ular tasodifan aynan miss Kushingning qarindoshining qulog‘ini yubora olmaydi",
     "Talabalar ta’tilda edi"
    ],
    "javob": 2,
    "izoh": "Tasodif bunchalik aniq moslik bermaydi. Qulog‘ning oilaviy o‘xshashligi qurbonning qarindosh ekanini ko‘rsatadi."
   },
   {
    "savol": "Ipdagi dengizchilar tuguni nimani ko‘rsatadi?",
    "variantlar": [
     "Qutini yuborgan odam dengizchi",
     "Qutini pochta xodimi bog‘lagan",
     "Ip dengizdan topilgan",
     "Bu oddiy tugun"
    ],
    "javob": 0,
    "izoh": "Kasbiy odatlar iz qoldiradi: maxsus tugun dengizchilikka xos ko‘nikma."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Qizil doira",
  "yil": 1911,
  "sarlavha": "Ko‘rinmas ijarachi",
  "hikoya": "Missis <em>Uorren</em>ning uyida soqol-mo‘ylovli bir erkak xona ijaraga oldi va ikki baravar pul to‘ladi. Shundan keyin ijarachini hech kim ko‘rmadi: u ovqat va narsalarni eshik oldidan oladi, kerakli narsalarni esa varaqqa bosma harflar bilan yozib qoldiradi: «SOVUN», «GUGURT». Holmes eshik oldidan sigaret qoldig‘ini topdi: u oxirigacha, deyarli tamakisi qolmaguncha chekilgan edi.",
  "savol": "Sigaret qoldig‘i va bosma harflar nimani ko‘rsatadi?",
  "variantlar": [
   "Ijarachi juda tejamkor: sigaretni oxirigacha chekadi va xat yozishga ham siyoh ishlatmaydi",
   "Ijarachi xorijlik, ingliz harflarini faqat bosma shaklda yoza oladi",
   "Xonada yashovchi — xonani ijaraga olgan soqolli erkak emas, boshqa odam: soqol-mo‘ylovli odam sigaretni bunchalik oxirigacha cheka olmaydi, bosma harflar esa qo‘lyozmani yashiradi",
   "Ijarachi og‘ir kasal, gapira olmaydi va odamlardan yuqtirib qo‘yishdan qo‘rqadi"
  ],
  "javob": 2,
  "izoh": "Mo‘ylovli odam sigaretni oxirigacha cheka olmaydi — mo‘ylovini kuydiradi. Demak, chekayotgan odam mo‘ylovsiz — u xonani olgan soqolli erkak emas. Bosma harflar esa yozuvi tanilib qolishidan qo‘rqishni ko‘rsatadi. Xulosa: ijarachi almashtirilgan va yashirinib yotibdi. Haqiqatan, xonada xavfli to‘dadan yashiringan italyan ayol yashardi, eri esa uni ro‘paradagi derazadan chiroq signallari bilan ogohlantirib turardi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Ijarachi nega kerakli narsalarni bosma harflar bilan yozardi?",
    "variantlar": [
     "U xorijlik edi",
     "Uning qalami yo‘q edi",
     "Qo‘lyozmasi bilan tanilib qolmaslik uchun",
     "Bu odob belgisi"
    ],
    "javob": 2,
    "izoh": "Bosma harflar yozuvning o‘ziga xosligini yo‘qotadi — tanilishdan qo‘rqqan odamning usuli."
   },
   {
    "savol": "Ijarachining ikki baravar pul to‘lagani nimani ko‘rsatadi?",
    "variantlar": [
     "Uning uchun maxfiylik juda muhim — u savol berilmasligi uchun ortiqcha to‘lagan",
     "U boy edi",
     "U narxni bilmagan",
     "U uzoq yashamoqchi edi"
    ],
    "javob": 0,
    "izoh": "Maxfiylik evaziga ortiqcha to‘lash — yashirinish zarurligining belgisi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Bryus-Partington chizmalari",
  "yil": 1908,
  "sarlavha": "Temir yo‘l ayirmasi",
  "hikoya": "Yosh xizmatchi <em>Kadogan Uest</em>ning jasadi London metrosining relslari yonida, Oldgeyt bekati yaqinida topildi. Boshi yorilgan, lekin atrofda deyarli qon yo‘q edi. Cho‘ntagida chipta yo‘q. Holmes aniqladi: jasad aynan relslar ayirmasi oldida yotgan — u yerda poyezdlar keskin silkinib, vagonlar chayqaladi. Bu yo‘nalishning ba’zi joylarida metro yer ustidan o‘tadi va poyezdlar ba’zan uylarning orqa derazalari ostida to‘xtab turadi.",
  "savol": "Jasad u yerga qanday kelib qolgan?",
  "variantlar": [
   "U chiptasiz poyezdga chiqib, nazoratchidan qochayotganda vagon eshigidan yiqilgan",
   "Uni bekat platformasida urib, relslarga tashlashgan, qonni esa yomg‘ir yuvib ketgan",
   "Uestni boshqa joyda o‘ldirib, temir yo‘lga qaragan derazadan to‘xtab turgan vagonning tomiga qo‘yishgan; ayirmada poyezd silkinganda jasad tomdan tushib ketgan",
   "U chizmalarni yo‘qotib qo‘yib, uyatdan o‘zini poyezd ostiga tashlagan"
  ],
  "javob": 2,
  "izoh": "Qonning yo‘qligi — o‘lim boshqa joyda bo‘lgan. Chiptaning yo‘qligi — u yo‘lovchi sifatida poyezdga chiqmagan. Jasad aynan silkinish bo‘ladigan ayirmada — u hech narsaga mahkam turmagan, ya’ni vagon ichida emas, tomida bo‘lgan. Vagon tomiga jasadni faqat poyezd to‘xtaydigan joyda, relslar ustiga qaragan derazadan qo‘yish mumkin. Holmes shunday derazasi bor uyni — josus Oberstayn uyini topdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Jasad yonida qonning deyarli yo‘qligi nimani ko‘rsatadi?",
    "variantlar": [
     "U qon yo‘qotmagan",
     "Qonni yomg‘ir yuvgan",
     "Uni politsiya tozalagan",
     "Odam boshqa joyda o‘ldirilgan, bu yerga jasad keltirilgan"
    ],
    "javob": 3,
    "izoh": "Bosh jarohati ko‘p qon ketishiga sabab bo‘ladi. Qonning yo‘qligi — o‘lim joyi boshqa ekanini ko‘rsatadi."
   },
   {
    "savol": "Holmes qanday uyni qidirdi?",
    "variantlar": [
     "Bekat yaqinidagi uyni",
     "Orqa derazasi temir yo‘lga qaraydigan va poyezd to‘xtaydigan joydagi uyni",
     "Eng katta uyni",
     "Uestning uyini"
    ],
    "javob": 1,
    "izoh": "Jasadni vagon tomiga faqat poyezd to‘xtagan joyda derazadan qo‘yish mumkin. Shu shart qidiruvni toraytiradi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "O‘layotgan detektiv",
  "yil": 1913,
  "sarlavha": "Yaqinlashma, Uotson!",
  "hikoya": "Holmes uch kundan beri hech narsa yemay-ichmay, Sharq kasalligidan o‘layotgandek yotardi: yuzi so‘lg‘in, lablarida qobiq, alahsirab, ustritsalar haqida g‘alati gaplar gapirardi. Uotson uni tekshirmoqchi bo‘ldi, lekin Holmes qat’iyan ruxsat bermadi va faqat bitta odamni — bu kasallikni yaxshi biladigan plantator <em>Kalverton Smit</em>ni chaqirishni talab qildi. Smit kelgach, Holmes «so‘nggi nafasida» undan kasallik qanday yuqtirilganini so‘radi; Uotson esa karavot ortida yashirinib turardi.",
  "savol": "Holmes nima uchun Uotsonga o‘zini tekshirishga yo‘l qo‘ymadi?",
  "variantlar": [
   "U aslida kasal emasdi: yaqindan qaragan shifokor grimni sezardi; Uotson esa Smitni ishontirib olib kelishi uchun Holmes o‘layotganiga chin dildan ishonishi kerak edi",
   "Kasallik juda yuqumli edi va Holmes do‘stining hayotini xavf ostiga qo‘ymoqchi emasdi",
   "Holmes Uotsonning tropik kasalliklar bo‘yicha bilimiga ishonmasdi",
   "Holmes Smit olib keladigan maxsus dorini kutayotgan va vaqtni behuda o‘tkazishni istamagan"
  ],
  "javob": 0,
  "izoh": "Rejaning o‘zagi — Smitni Holmes rostdan o‘layapti deb ishontirish va jinoyatini tan oldirish. Buning uchun eng muhim guvoh — Uotson ham ishonishi kerak edi, aks holda u Smitni ishontira olmasdi. Uch kunlik ochlik, vazelin, belladonna va bo‘yoq «kasallik»ni yaratdi; yaqindan tekshirgan shifokor buni darhol sezardi. Smit Holmesni zaharlamoqchi bo‘lganini o‘zi aytib berdi, Uotson esa buni eshitdi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holmes kasallikni qanday soxtalashtirdi?",
    "variantlar": [
     "Haqiqiy kasallikni yuqtirib",
     "Uch kun och qolib, vazelin, belladonna va bo‘yoq bilan",
     "Dori ichib",
     "Shifokorni aldab"
    ],
    "javob": 1,
    "izoh": "Ochlik — so‘lg‘inlik, belladonna — ko‘z qorachig‘ining kengayishi, bo‘yoq — rang. Har bir alomat sun’iy yaratilgan."
   },
   {
    "savol": "Uotsonning karavot ortida yashiringani nimaga kerak edi?",
    "variantlar": [
     "Holmesni himoya qilish uchun",
     "Uxlash uchun",
     "Holmesni davolash uchun",
     "Smitning tan olishini guvoh sifatida eshitishi uchun"
    ],
    "javob": 3,
    "izoh": "Iqrorning qiymati guvoh borligi bilan. Holmes ishonchli guvohni oldindan joylashtirdi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Ledi Frensis Karfaksning g‘oyib bo‘lishi",
  "yil": 1911,
  "sarlavha": "Juda katta tobut",
  "hikoya": "Boy va yolg‘iz <em>Ledi Frensis</em> o‘zini «missioner» deb tanishtirgan <em>Shlessinger</em> va uning «xotini» bilan tanishgach, izsiz yo‘qoldi. Holmes ularning Londondagi uyini topdi va u yerga tobut buyurtma qilinganini bildi. Uy egalari tobut keksa, juda ozg‘in va kichkina kampir uchun ekanini aytishdi — u haqiqatan ham uyda vafot etgan edi. Lekin tobutsoz ustaxonasida Holmes eshitdi: buyurtma qilingan tobut odatdagidan ancha katta va chuqur.",
  "savol": "Tobutning o‘lchami nimani ko‘rsatadi?",
  "variantlar": [
   "Tobutsoz buyurtmani adashtirgan, bu tasodifiy xato",
   "Kampir aslida katta gavdali bo‘lgan, uy egalari uni yaxshi bilishmagan",
   "Tobutga Ledi Frensisning o‘g‘irlangan qimmatbaho buyumlari yashirilmoqchi edi",
   "Unda ikki kishi bo‘lishi kerak: kampirning jasadi va uning ostida tiriklayin, behush holda yashirilgan Ledi Frensis"
  ],
  "javob": 3,
  "izoh": "Kichkina kampir uchun katta tobut — bo‘sh joy qoladi, demak, yana kimdir solinishi kerak. Ledi Frensis yo‘qolgan, uni yashirish kerak. Rasmiy dafn — eng xavfsiz niqob: hech kim marhumning tobutini ochmaydi. Holmes dafn oldidan tobutni ochtirdi: ichida xloroform bilan uxlatilgan Ledi Frensis bor edi va u o‘z vaqtida qutqarildi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega rasmiy dafn — jinoyatchilar uchun eng xavfsiz niqob?",
    "variantlar": [
     "Marhumning tobutini hech kim ochmaydi va hech kim tekshirmaydi",
     "Dafnda politsiya bo‘lmaydi",
     "Tobut og‘ir bo‘ladi",
     "Dafn kechasi bo‘ladi"
    ],
    "javob": 0,
    "izoh": "Odamlar hurmat tufayli tobutni tekshirmaydi — bu uni yashirish uchun ideal joyga aylantiradi."
   },
   {
    "savol": "Holmes qaysi faktlarni taqqoslab, tuzoqni sezdi?",
    "variantlar": [
     "Dafn vaqtini",
     "Ruhoniyning ismini",
     "Marhumaning juda kichik gavdasi va buyurtma qilingan tobutning juda katta o‘lchamini",
     "Uy manzilini"
    ],
    "javob": 2,
    "izoh": "Ikki fakt bir-biriga zid: kichik tana — katta tobut. Zidlik — yashirin narsaning belgisi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Shayton oyog‘i",
  "yil": 1910,
  "sarlavha": "Kunduzi yongan chiroq",
  "hikoya": "Kornuolldagi uyda opa-ukalar karta o‘ynab o‘tirgan holda topildi: aka-ukalar aqldan ozgan, opalari esa vafot etgan; yuzlarida dahshat ifodasi qotib qolgan. Xona tor va dim, kaminda olov yonib turgan edi. Bir necha kundan so‘ng boshqa uyda ham shunday o‘lim yuz berdi: tong otgan bo‘lsa ham xonada neft chirog‘i hali yonib turar, havo og‘ir va bo‘g‘iq edi. Holmes chiroq qalpoqchasidan kuygan kukun qoldig‘ini qirib oldi.",
  "savol": "Ikkala holatni nima bog‘laydi?",
  "variantlar": [
   "Ikkala oila bir xil zaharlangan ovqat yoki suv iste’mol qilgan",
   "Ikkalasida ham yopiq xonada nimadir yonib turgan: olovga yoki chiroqqa zaharli kukun tashlangan, uning tutuni odamlarni aqldan ozdirgan va o‘ldirgan",
   "Ikkalasi ham mahalliy irsiy ruhiy kasallikdan aziyat chekkan",
   "Ikkala holatda ham odamlarni tunda kimdir dahshatli qiyofada qo‘rqitib ketgan"
  ],
  "javob": 1,
  "izoh": "Umumiy omillar: tor, dim xona va nimaningdir yonishi (kamin, kunduzi yonayotgan chiroq). Kunduzi chiroq yoqishning odatiy sababi yo‘q — demak, u boshqa maqsadda yoqilgan. Holmes chiroqdan kukun qoldig‘ini olib, Uotson bilan xavfli tajriba qildi: kukunni yoqqanda ikkalasi ham dahshatli qo‘rquvga tushib, zo‘rg‘a qutulishdi. Bu Afrikadan olib kelingan «shayton oyog‘i» ildizining kukuni edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holmes zahar qanday ta’sir qilishini qanday tekshirdi?",
    "variantlar": [
     "Hayvonda sinab",
     "Kitobdan o‘qib",
     "Kimyogardan so‘rab",
     "Kukunni o‘zi yoqib, Uotson bilan xavfli tajriba qildi"
    ],
    "javob": 3,
    "izoh": "Tajriba — gipotezani tekshirishning eng ishonchli yo‘li, garchi bu safar juda xavfli bo‘lsa ham."
   },
   {
    "savol": "Nega ikkala holatda xona tor va dim bo‘lgani muhim?",
    "variantlar": [
     "Xonalar qadimiy edi",
     "Zaharli tutun yopiq, havosi kam xonada kuchli to‘planadi",
     "Odamlar sovqotgan",
     "Bu tasodif"
    ],
    "javob": 1,
    "izoh": "Tutun bilan zaharlanish shamollatilmagan xonada xavfli bo‘ladi. Umumiy sharoit umumiy sababni ko‘rsatadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "tazim",
  "asar": "Uning so‘nggi ta’zimi",
  "yil": 1917,
  "sarlavha": "«Dengiz kodlari» paketi",
  "hikoya": "1914-yil avgust, urush arafasi. Nemis josusi <em>fon Bork</em> Angliyada to‘rt yil davomida maxfiy ma’lumot yig‘di. Uning eng ishonchli manbai — irlandiyalik amerikalik <em>Altamont</em> — so‘nggi va eng muhim hujjat: yangi dengiz signallari kitobini olib keldi. Fon Bork paketni ochdi va muqovada chiroyli harflar bilan yozilgan nomni ko‘rdi: «Asalarichilik bo‘yicha amaliy qo‘llanma». Shu lahza Altamont uni xloroformli ro‘molcha bilan behush qildi.",
  "savol": "Paketda nima bor edi va Altamont kim edi?",
  "variantlar": [
   "Haqiqiy dengiz kodlari: muqova shunchaki chegarada tekshiruvdan o‘tish uchun niqob edi",
   "Holmesning asalarichilik haqidagi kitobi: Altamont — niqoblangan Holmesning o‘zi, u ikki yildan beri josusga soxta ma’lumot berib kelgan",
   "Bo‘sh qog‘ozlar: Altamont pulni olib qochmoqchi bo‘lgan oddiy firibgar edi",
   "Shifrlangan kodlar: Altamont nemislar uchun ham, inglizlar uchun ham ishlaydigan ikki tomonlama josus edi"
  ],
  "javob": 1,
  "izoh": "Holmes nafaqaga chiqib, Sasseksda asalari boqar va bu haqda kitob yozgan edi — muqovadagi nom Holmesga ishora. Altamontning josusga eng ishonchli manba bo‘lgani ham tasodif emas: Holmes ikki yil davomida fon Borkka ataylab noto‘g‘ri ma’lumot yetkazib, nemis razvedkasini chalg‘itib kelgan. So‘nggi «hujjat» uning hazili va qopqoni edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Altamontning josusga «eng ishonchli manba» bo‘lgani nimani ko‘rsatadi?",
    "variantlar": [
     "Altamont haqiqiy josus edi",
     "Fon Bork aldanmagan",
     "Holmes ataylab josusning ishonchini qozongan va unga soxta ma’lumot yetkazgan",
     "Bu tasodif"
    ],
    "javob": 2,
    "izoh": "Eng xavfli dushman — ishonchli do‘st qiyofasidagi. Holmes ikki yil davomida shu rolni o‘ynadi."
   },
   {
    "savol": "Muqovadagi «Asalarichilik bo‘yicha qo‘llanma» nomi nimaga ishora?",
    "variantlar": [
     "Holmesning nafaqadagi mashg‘ulotiga — u asalari boqib, shu haqda kitob yozgan",
     "Nemis kodlariga",
     "Dengiz flotiga",
     "Fon Borkning sevimli kitobiga"
    ],
    "javob": 0,
    "izoh": "Holmesning hazili: josus kutgan «sir» o‘rniga uning o‘z kitobi. Bu Holmesning imzosi edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Mashhur mijoz",
  "yil": 1924,
  "sarlavha": "Baronning daftari",
  "hikoya": "Yosh va olijanob miss <em>Violetta de Merville</em> xavfli baron <em>Gruner</em>ga turmushga chiqmoqchi. Baron ilgari ko‘p ayollarning hayotini barbod qilgan, ammo Violetta unga ko‘r-ko‘rona ishonadi: baronning o‘tmishi haqidagi har qanday gapni «tuhmat» deb rad etadi va baronning sobiq qurboni <em>Kitti Uinter</em>ning so‘zlariga ham quloq solmadi. Kitti esa Holmesga baronning shaxsiy daftari borligini aytdi: baron unga qurbonlari haqida o‘z qo‘li bilan yozib, suratlarini yopishtirib qo‘ygan.",
  "savol": "Violettani ishontirish uchun eng kuchli dalil qaysi?",
  "variantlar": [
   "Holmesning shaxsiy guvohligi: mashhur detektivning so‘ziga hamma ishonadi",
   "Kitti Uinterni Violetta bilan yana bir bor uchrashtirish va uni ko‘proq gapirtirish",
   "Baron haqida gazetada katta fosh qiluvchi maqola chiqarish",
   "Baronning o‘z qo‘li bilan yozilgan shaxsiy daftari: uni «tuhmat» yoki «dushmanning gapi» deb rad etib bo‘lmaydi"
  ],
  "javob": 3,
  "izoh": "Violetta boshqalarning so‘zlariga ishonmaydi — u har qanday guvohni baronning dushmani deb hisoblaydi. Bunday ishonchni faqat baronning o‘zidan chiqqan, uning qo‘lyozmasidagi dalil buzishi mumkin. Shuning uchun Holmes daftarni qo‘lga kiritishga qaror qildi. Dalilning kuchi uni qabul qiluvchi odam nimaga ishonishiga ham bog‘liq.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega Violetta guvohlarga ishonmadi?",
    "variantlar": [
     "Guvohlar yolg‘on gapirgan",
     "U guvohlarni tanimasdi",
     "U har qanday guvohni baronning dushmani deb hisoblardi",
     "Guvohlar kam edi"
    ],
    "javob": 2,
    "izoh": "Ko‘r-ko‘rona ishongan odam qarshi dalillarni «dushman gapi» deb rad etadi. Shuning uchun boshqacha dalil kerak edi."
   },
   {
    "savol": "Dalilni tanlashda Holmes qaysi qoidaga amal qildi?",
    "variantlar": [
     "Dalil uni qabul qiladigan odam ishonadigan manbadan — baronning o‘zidan chiqishi kerak",
     "Dalil iloji boricha ko‘p bo‘lishi kerak",
     "Dalil gazetada chiqishi kerak",
     "Dalil sudda tasdiqlanishi kerak"
    ],
    "javob": 0,
    "izoh": "Ishontirishda dalilning kuchi faqat haqiqatda emas, tinglovchi uchun manbaning ishonchliligida ham."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Oqargan askar",
  "yil": 1926,
  "sarlavha": "Uch ehtimol",
  "hikoya": "Urushdan qaytgan askar <em>Godfri Emsvort</em> haqida do‘stiga «dunyo bo‘ylab sayohatga ketgan» deyildi. Ammo do‘sti bir kecha uni ota-onasi uyi yonidagi kulbaning derazasida ko‘rdi: yuzi g‘ayritabiiy oppoq edi. Godfri ozod yurmasdi, lekin qamalmagan ham edi — u bilan bitta xizmatkor yashar, kulbaga esa notanish shifokor kelib-ketardi. Holmes uch ehtimolni ko‘rib chiqdi: 1) Godfri jinoyat qilgan va yashirinmoqda; 2) u aqldan ozgan; 3) u odamlardan ajratilishi kerak bo‘lgan kasallikka chalingan.",
  "savol": "Dalillar qaysi ehtimolni qoldiradi?",
  "variantlar": [
   "Uchinchisini: jinoyatchini uy yonida emas, chet elda yashirishardi; aqldan ozgan odamni qo‘riqchisiz qoldirishmasdi; oppoq yuz va maxsus shifokor kasallikka ishora qiladi",
   "Birinchisini: oila o‘g‘lining jinoyatini oshkor qilmaslik uchun uni uyda yashirmoqda",
   "Ikkinchisini: urush uni aqldan ozdirgan, shuning uchun uni odamlardan yashirishmoqda",
   "Hech qaysi birini: do‘sti tunda adashgan, Godfri haqiqatan ham sayohatda"
  ],
  "javob": 0,
  "izoh": "Bu — chiqarib tashlash usuli: mumkin bo‘lmaganini olib tashlasang, qolgani, qanchalik g‘alati bo‘lmasin, haqiqatdir. Jinoyatchini ota-onasi o‘z uyi yonida yashirmaydi — uni chet elga jo‘natishardi. Aqldan ozgan odam qattiq nazorat ostida bo‘lardi. Qoladi — kasallik. Oppoq yuz va teri kasalliklari mutaxassisi buni tasdiqladi. Godfri og‘ir yuqumli kasallikka chalinganidan qo‘rqardi, aslida esa bu xavfsiz teri kasalligi ekani ma’lum bo‘ldi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega Godfrining ota-onasi uyi yonida yashirilgani «jinoyat» ehtimolini rad etadi?",
    "variantlar": [
     "Jinoyatchilar uyga qaytmaydi",
     "Ota-ona jinoyatni bilmasdi",
     "U jinoyat qila olmasdi",
     "Jinoyatchini politsiyadan yashirish uchun uni chet elga jo‘natishardi, uy yonida saqlamasdi"
    ],
    "javob": 3,
    "izoh": "Har bir ehtimol o‘ziga xos xatti-harakat kutadi. Kuzatilgan xatti-harakat bu kutishga mos kelmasa, ehtimol chiqib ketadi."
   },
   {
    "savol": "Holmes qo‘llagan usulning nomi qanday?",
    "variantlar": [
     "Tajriba usuli",
     "Chiqarib tashlash usuli: mumkin bo‘lmaganlarni olib tashlab, qolganini haqiqat deb olish",
     "Chastota tahlili",
     "Iz kuzatish"
    ],
    "javob": 1,
    "izoh": "«Mumkin bo‘lmaganini olib tashlasang, qolgani, qanchalik g‘alati bo‘lmasin, haqiqatdir» — Holmesning mashhur qoidasi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Mazarin olmosi",
  "yil": 1921,
  "sarlavha": "Qo‘shni xonadagi skripka",
  "hikoya": "Graf <em>Silvius</em> va uning sherigi Holmesning xonasida yolg‘iz qoldi; Holmes esa yotoqxonaga kirib, skripka chalishni boshladi. Yotoqxonadan «Barkarola» kuyi jaranglardi. Jinoyatchilar Holmes kuy chalayotganiga ishonib, ochiqchasiga gaplashishdi va o‘g‘irlangan Mazarin olmosi grafning cho‘ntagida ekanini aytib qo‘yishdi. Xonada deraza oldidagi kresloda Holmesning mum byusti turardi. Bir zum o‘tib, o‘sha kresloda o‘tirgan «byust» o‘rnidan turdi va olmosni oldi.",
  "savol": "Skripka sadosi va «byust» qanday ishladi?",
  "variantlar": [
   "Skripkani yotoqxonada Uotson chalgan, Holmes esa derazadan tashqarida turib eshitgan",
   "Byust ichiga eshitish trubkasi o‘rnatilgan, Holmes yotoqxonadan turib hamma gapni eshitgan",
   "Skripkani grammofon plastinkasi chalayotgan edi; Holmes boshqa eshik orqali xonaga qaytib, byust o‘rniga o‘tirib olgan va hamma gapni eshitgan",
   "Jinoyatchilar baland gapirishgan, ovoz devor orqali yotoqxonaga yetib borgan"
  ],
  "javob": 2,
  "izoh": "Biz ovoz odamning qayerdaligini ko‘rsatadi, deb o‘ylaymiz — Holmes shundan foydalandi: skripka sadosi uni yotoqxonada «ushlab turdi», aslida esa grammofon chalardi. Jinoyatchilar xonada yolg‘izmiz deb ochiq gapirishdi. Mum byust esa diqqatni chalg‘itadigan va Holmesga ko‘rinmay o‘tirish uchun joy beradigan niqob edi. Kutilgan dalilga — ovozga ko‘r-ko‘rona ishonmaslik kerak.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nima uchun jinoyatchilar ochiq gaplashishdi?",
    "variantlar": [
     "Ular Holmesdan qo‘rqmasdi",
     "Ular skripka sadosidan Holmes boshqa xonada deb ishonishdi",
     "Ular kar edi",
     "Ular xonani tekshirishgan"
    ],
    "javob": 1,
    "izoh": "Ovoz joylashuvni bildiradi degan odatiy ishonchdan foydalanildi — bu ishonch aldandi."
   },
   {
    "savol": "Mum byust bu ishda qanday vazifani bajardi?",
    "variantlar": [
     "U yorug‘lik berdi",
     "U eshikni to‘sdi",
     "U bezak edi",
     "Diqqatni chalg‘itdi va Holmesga ko‘rinmay o‘tirishga imkon berdi"
    ],
    "javob": 3,
    "izoh": "Jinoyatchilar kresloda byust bor deb o‘ylashdi; aslida u yerda Holmesning o‘zi o‘tirgan edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Uch peshtoqli uy",
  "yil": 1926,
  "sarlavha": "Uy hamma narsasi bilan",
  "hikoya": "Bevaxon <em>Meberli</em>ga uyini juda yuqori narxda sotib olish taklif qilindi, lekin bitta sharti bor edi: u uydan hech narsa — hatto shaxsiy kiyimlari va buyumlarini ham olib chiqmasligi kerak. Bu orada uyga bostirib kirishdi, ammo hech qanday qimmatbaho narsa olinmadi — faqat yaqinda Rimda vafot etgan o‘g‘li <em>Duglas</em>ning chamadonlari titkilangan edi. O‘g‘il o‘limidan oldin yuqori jamiyatdagi bir boy xonim bilan qattiq janjallashgan edi.",
  "savol": "Xaridorlar aslida nimani xohlashardi?",
  "variantlar": [
   "Uyning yerini: u yerda yangi temir yo‘l o‘tishi rejalashtirilgan edi",
   "Uy ostida yashirilgan qadimiy xazinani: uy egalari undan bexabar edi",
   "Marhum o‘g‘ilning yuklari ichidagi bir narsani — o‘sha xonimni sharmanda qiladigan qo‘lyozmasini",
   "Bevaxonning qimmatbaho zargarlik buyumlarini, ularni arzon olib qolish uchun"
  ],
  "javob": 2,
  "izoh": "Uyni haddan tashqari qimmatga, lekin «hamma narsasi bilan» olishmoqchi — demak, ularga uy emas, ichidagi narsa kerak. Bostirib kirganlar boshqa hech narsaga tegmay, faqat Duglasning yuklarini titkilashgan — izlanayotgan narsa o‘sha yerda. Duglasning boy xonim bilan janjali sababni ko‘rsatdi: u o‘sha xonim haqida fosh qiluvchi roman yozgan, xonim esa uni yo‘q qilmoqchi edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Bostirib kirganlar nima uchun boshqa narsalarga tegmadi?",
    "variantlar": [
     "Ularga faqat bitta narsa — Duglasning yukidagi qo‘lyozma kerak edi",
     "Ular shoshilgan",
     "Boshqa narsalar arzon edi",
     "Ular qo‘rqib ketgan"
    ],
    "javob": 0,
    "izoh": "Nimaga tegilgani va nimaga tegilmagani — niyatni ochib beradi. Tanlab titkilash aniq maqsadni ko‘rsatadi."
   },
   {
    "savol": "Shartdagi «hatto shaxsiy buyumlarni ham olib chiqmaslik» talabi nimani ko‘rsatadi?",
    "variantlar": [
     "Xaridorlar mebel yig‘uvchi edi",
     "Bu oddiy savdo sharti",
     "Izlanayotgan narsa aynan shaxsiy buyumlar orasida bo‘lishi mumkin",
     "Xaridorlar bevaxonga g‘amxo‘rlik qilgan"
    ],
    "javob": 2,
    "izoh": "Odatda uy sotilganda shaxsiy narsalar egasida qoladi. Bunday g‘ayritabiiy shart maqsadni fosh qiladi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Sasseks vampiri",
  "yil": 1924,
  "sarlavha": "Go‘dakning bo‘ynidagi yara",
  "hikoya": "Janob <em>Ferguson</em> perulik xotinini chaqalog‘ining bo‘ynidagi yaradan qon so‘rayotgan holda ko‘rib qoldi va dahshatga tushdi. Xotin hech narsani tushuntirmay, xonasiga qamalib oldi. Uy devorida Janubiy Amerika qurollari — kamon va o‘qlar osilgan, o‘qdon yonida bo‘sh joy bor edi. Fergusonning birinchi nikohidan bo‘lgan o‘n besh yashar, nogiron o‘g‘li <em>Jeki</em> otasini juda yaxshi ko‘rar, kichik ukasini esa yoqtirmasdi; Holmes deraza oynasida uning ukasiga nafrat bilan qarab turgan aksini ko‘rdi.",
  "savol": "Ona aslida nima qilayotgan edi?",
  "variantlar": [
   "U chaqaloqni qutqarayotgan edi: Jeki ukasiga zaharli o‘q sanchgan, ona esa yaradan zaharni so‘rib olayotgan edi",
   "U Peru xalq tabobatidagi qon olish usuli bilan chaqaloqni isitmadan davolayotgan edi",
   "U eriga qasd qilish uchun chaqaloqni qo‘rqitib, uni o‘zidan uzoqlashtirmoqchi edi",
   "Ona qandaydir g‘ayritabiiy kuch ta’sirida edi — buni tushuntirib bo‘lmaydi"
  ],
  "javob": 0,
  "izoh": "Holmes g‘ayritabiiy izohni darhol rad etdi: «Arvohlarga bizning ishimizda joy yo‘q». Qolgan dalillar: devordagi o‘qlar va o‘qdondagi bo‘sh joy — zaharli o‘q; bo‘yindagi kichik yara — sanchiq izi; zaharni so‘rib olish — ma’lum qutqarish usuli. Kimda sabab bor? Ukasidan rashk qiladigan Jeki. Ona erining qalbini og‘ritmaslik uchun o‘g‘il haqida indamagan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "O‘qdon yonidagi bo‘sh joy nimani ko‘rsatadi?",
    "variantlar": [
     "O‘qlar sotilgan",
     "Bu bezak",
     "O‘qdon har doim shunday edi",
     "Bitta o‘q olingan — ehtimol, zaharli o‘q ishlatilgan"
    ],
    "javob": 3,
    "izoh": "Yo‘qolgan narsa — ishlatilgan narsa. Zaharli o‘qlar va bo‘yindagi sanchiq izi birlashadi."
   },
   {
    "savol": "Ona nega haqiqatni eridan yashirdi?",
    "variantlar": [
     "U o‘zi aybdor edi",
     "Eri o‘z o‘g‘lining aybini bilib, qayg‘uga botmasligi uchun",
     "U erini yomon ko‘rardi",
     "U ingliz tilini bilmasdi"
    ],
    "javob": 1,
    "izoh": "Ba’zan sukut kimnidir himoya qilish uchun bo‘ladi. Ona o‘zi ayblanishini afzal ko‘rdi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Uch Garrideb",
  "yil": 1924,
  "sarlavha": "Uchinchi familiyador",
  "hikoya": "Yolg‘iz, xonasidan deyarli chiqmaydigan kolleksioner <em>Neytan Garrideb</em>ga amerikalik <em>Jon Garrideb</em> keldi va g‘alati xabar aytdi: amerikalik boy odam merosini faqat «Garrideb» familiyali uchta erkak topilsa, ularga bo‘lib berishni vasiyat qilgan. Ikkalasi bor, uchinchisini topish kerak. Holmes amerikalikning kiyimi ingliz tikuvchisiniki ekanini va u Angliyada anchadan beri yashashini sezdi. Tez orada «uchinchi Garrideb» Birmingemda topildi va Neytan bir kunga u yerga jo‘nab ketishi kerak bo‘ldi.",
  "savol": "Bu «vasiyat» nimaga o‘ylab topilgan?",
  "variantlar": [
   "Neytanning qimmatbaho kolleksiyasini arzonga sotib olish uchun ishonchini qozonish",
   "Neytanni Birmingemdagi kimsasiz joyga olib borib, u yerda yo‘q qilish",
   "Haqiqiy merosni bo‘lib olish: Jon Garrideb chindan ham merosxo‘r edi",
   "Neytanni bir kunga uyidan chiqarish uchun: uning xonasi ostida jinoyatchi kerak bo‘lgan narsa — qalbaki pul bosmaxonasi bor edi"
  ],
  "javob": 3,
  "izoh": "Vasiyatning yagona amaliy natijasi — hech qayerga chiqmaydigan Neytanning uydan uzoqlashishi. Demak, maqsad uning xonasida. «Amerikalik»ning yolg‘oni (ingliz kiyimi, Angliyada uzoq yashagan) uning da’volariga ishonch yo‘qligini ko‘rsatdi. Holmes va Uotson xonada pistirma qo‘yishdi: «Jon Garrideb» — aslida jinoyatchi Evans — pol ostidagi qalbaki pul bosmaxonasiga tushmoqchi bo‘lganda qo‘lga olindi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holmes «amerikalik»ning yolg‘onini qanday sezdi?",
    "variantlar": [
     "U amerikacha gapirmadi",
     "U pasport ko‘rsatmadi",
     "Kiyimi ingliz tikuvchisiniki edi va u Angliyada anchadan beri yashagani ma’lum bo‘ldi",
     "U Neytanni tanimadi"
    ],
    "javob": 2,
    "izoh": "Kichik detallar katta yolg‘onni fosh qiladi: «yaqinda kelgan» odam ingliz tikuvchisi kiyimida yurmaydi."
   },
   {
    "savol": "Nega vasiyat aynan «uchta Garrideb» shartini qo‘ygan?",
    "variantlar": [
     "Noyob familiyali uchinchi odamni qidirish — Neytanni uydan chiqarishning ishonchli bahonasi edi",
     "Bu haqiqiy vasiyat edi",
     "Uch — omadli raqam",
     "Meros katta edi"
    ],
    "javob": 0,
    "izoh": "Noyob familiya qidiruvni qiyin va uzoq qiladi — bu «sayohat» bahonasini tabiiy ko‘rsatadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Tor ko‘prigi muammosi",
  "yil": 1922,
  "sarlavha": "Ko‘prik to‘sig‘idagi o‘yiq",
  "hikoya": "Boy <em>Gibson</em>ning xotini Tor ko‘prigida boshidan otilgan holda topildi. Uning qo‘lida enaga miss <em>Danbar</em>ning ko‘prikka uchrashuvga chaqirgan xati bor edi. Ertasi kuni xuddi shunday kalibrli to‘pponcha enaganing kiyim javonidan topildi va u qamoqqa olindi. Holmes ko‘prikni ko‘zdan kechirdi: tosh to‘siqning pastki chetida yangi, chuqur o‘yiq bor edi — nimadir unga qattiq urilgan. Marhumning yonida qurol topilmagan.",
  "savol": "Holmes qanday xulosaga keldi?",
  "variantlar": [
   "Enaga xonimni otgan va qurolni o‘z javoniga yashirib qo‘ygan",
   "Xonim o‘zini otib, enagani ayblash uchun sahnalashtirgan: to‘pponcha ip bilan og‘ir toshga bog‘langan, otgandan so‘ng tosh uni to‘siq osha suvga tortib ketgan va qurol to‘siqqa urilib, o‘yiq qoldirgan",
   "Qotil to‘siqqa tosh bilan urib, tergovni chalg‘itish uchun ataylab iz qoldirgan",
   "O‘yiq ancha oldin paydo bo‘lgan, ishga aloqasi yo‘q — qotilni javondagi qurol ko‘rsatib turibdi"
  ],
  "javob": 1,
  "izoh": "Jinoyatchi qurolni o‘z javoniga yashirib, o‘zini o‘zi fosh qilmaydi — demak, javondagi to‘pponcha birovning tuzog‘i. Qurolning jasad yonida yo‘qligi va to‘siqdagi o‘yiq bitta mexanizmni ko‘rsatadi: haqiqiy qurol ipga, ip esa toshga bog‘langan; xonim otgach, tosh qurolni to‘siq osha suvga tortgan. Holmes buni Uotsonning to‘pponchasi bilan takrorlab ko‘rsatdi va suvdan qurolni topdi. Rashkchi xonim enagani yo‘q qilmoqchi bo‘lgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Nega javondan topilgan to‘pponcha enagani aksincha oqlaydi?",
    "variantlar": [
     "Unda enaganing izlari yo‘q edi",
     "Javon qulflangan edi",
     "Haqiqiy qotil qurolni o‘z javoniga yashirib, o‘zini fosh qilmaydi",
     "Enaga qurolni sevmasdi"
    ],
    "javob": 2,
    "izoh": "Aqlli jinoyatchi dalilni o‘zidan uzoqlashtiradi. Juda qulay topilgan dalil ko‘pincha qo‘yilgan dalil."
   },
   {
    "savol": "Holmes o‘z taxminini qanday isbotladi?",
    "variantlar": [
     "Uotsonning to‘pponchasini ipga va toshga bog‘lab, voqeani takrorladi va suvdan haqiqiy qurolni topdi",
     "Enagani so‘roq qildi",
     "Barmoq izlarini oldi",
     "Gibsonni ayblab"
    ],
    "javob": 0,
    "izoh": "Taxminni tajriba bilan takrorlash — eng kuchli isbot: o‘yiq xuddi shu joyda qayta paydo bo‘ldi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Emaklovchi odam",
  "yil": 1923,
  "sarlavha": "Egasini tishlagan it",
  "hikoya": "Keksa professor <em>Presberi</em> yosh qizga unashtirilgandan so‘ng g‘alati bo‘lib qoldi. Qizi va yordamchisi kuzatishdi: taxminan har to‘qqiz kunda u tunda to‘rt oyoqlab yurar, devorlarga osonlik bilan tirmashib chiqardi. Uning sodiq iti esa egasiga ikki marta tashlanib, tishladi. Professorning qo‘l bo‘g‘imlari qalinlashib, dag‘allashib qolgan; u Pragadan kelgan maxfiy jo‘natmalarni kutardi va ular kelgach, yana o‘zgarardi.",
  "savol": "Dalillar nimani ko‘rsatadi?",
  "variantlar": [
   "Professor kechalari uyquda yuradi, it esa uning g‘alati harakatlaridan qo‘rqadi",
   "Professor yasharish uchun maymundan olingan zardobni qabul qilyapti: dori ta’sirida u maymunga o‘xshab qoladi, iti esa egasidan begona hayvon hidini sezib, unga tashlanadi",
   "It quturgan va unga qarab qolgan professor ham shu kasallikni yuqtirgan",
   "Professor qizining to‘yga roziligini buzish uchun o‘zini ataylab g‘alati tutyapti"
  ],
  "javob": 1,
  "izoh": "It — eng sezgir guvoh: u egasiga faqat egasi «boshqa mavjudot»ga aylanganda tashlanadi. To‘rt oyoqlab yurish, tirmashish va dag‘al qo‘l bo‘g‘imlari — maymunga xos belgilar. Takrorlanish va Pragadan kelgan jo‘natmalar — muntazam qabul qilinadigan dori. Yosh qizga uylanish niyati esa sabab: professor yasharishni xohlagan. Bu langur maymunidan olingan zardob edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Holatlar «har to‘qqiz kunda» takrorlanishi nimaga ishora?",
    "variantlar": [
     "Oy fazalariga",
     "Ish jadvaliga",
     "Tasodifga",
     "Muntazam qabul qilinadigan dori yoki ukolga"
    ],
    "javob": 3,
    "izoh": "Aniq oraliqda takrorlanadigan o‘zgarish — muntazam ta’sir: dori qabul qilish jadvali."
   },
   {
    "savol": "Professorning maqsadi nima edi?",
    "variantlar": [
     "Ilmiy kashfiyot qilish",
     "Yosh qizga uylanish uchun yasharish",
     "Itini o‘rgatish",
     "Qizini qo‘rqitish"
    ],
    "javob": 1,
    "izoh": "Sabab har doim muhim: keksa professor yosh qizga unashtirilgani uning yasharishga intilishini tushuntiradi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Arslon yolasi",
  "yil": 1926,
  "sarlavha": "Qamchi izlari",
  "hikoya": "Dengiz sohilida o‘qituvchi <em>Makferson</em> chayqalib chiqib keldi, «arslon yolasi» deb pichirladi-yu, yiqilib vafot etdi. Belida qamchi bilan urilgandek qizil chiziqlar bor edi. Sohilda faqat uning o‘z izlari bor, boshqa hech kimniki yo‘q. Sochig‘i quruq edi — suvdan chiqib, artinishga ham ulgurmagan. Ko‘p o‘tmay itining ham xuddi o‘sha suv bo‘yida o‘lik topilgani ma’lum bo‘ldi. Holmes suv havzasidagi toshlar orasida sarg‘ish, yaltiroq, sochga o‘xshash tolalar bilan qoplangan narsani ko‘rdi.",
  "savol": "Makfersonni nima o‘ldirgan?",
  "variantlar": [
   "Uni yashirincha kuzatib yurgan raqibi qamchi bilan urib o‘ldirgan",
   "Uni sohil yaqinida yashovchi yovvoyi hayvon talagan",
   "U sovuq suvda yurak xurujidan vafot etgan, izlar esa toshlarga urilishdan qolgan",
   "«Arslon yolasi» deb ataladigan zaharli meduza: uning uzun tolalari teriga qamchi izidek iz qoldiradi"
  ],
  "javob": 3,
  "izoh": "Sohilda boshqa iz yo‘q — qotil odam emas. Sochiq quruq — u suvda bo‘lgan va ofat suvda ro‘y bergan. Iti ham shu suvda halok bo‘lgan — xavf o‘sha joyda doimiy. «Arslon yolasi» — alahlash emas, u ko‘rgan narsaning ta’rifi: sarg‘ish sochga o‘xshash tolali meduza. Holmes uni o‘qigan kitobidan tanidi va suvda topdi. Bu safar «aybdor» — tabiat.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Sochiqning quruq bo‘lishi nimani ko‘rsatadi?",
    "variantlar": [
     "U umuman suvga tushmagan",
     "U suvga tushgan va suvdan chiqib, artinishga ulgurmagan — ofat suvda ro‘y bergan",
     "U boshqa sochiq ishlatgan",
     "Sochiq yangi edi"
    ],
    "javob": 1,
    "izoh": "Agar u suvga tushmaganida, jarohat qirg‘oqda bo‘lardi. Quruq sochiq va ho‘l tana ofat joyini suvga ko‘rsatadi."
   },
   {
    "savol": "Nega it ham shu joyda halok bo‘lgani muhim?",
    "variantlar": [
     "It egasini qidirgan",
     "Itni kimdir zaharlagan",
     "It qarigan edi",
     "Xavf o‘sha suv havzasida doimiy — u odamga emas, joyga bog‘liq"
    ],
    "javob": 3,
    "izoh": "Bir joyda takrorlangan halokat — joyning o‘zidagi xavf. Bu qotil-odam emas, tabiat sababini ko‘rsatadi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Yuzi yopiq ijarachi",
  "yil": 1927,
  "sarlavha": "Besh parallel jarohat",
  "hikoya": "Yillar oldin sayyor sirkda sher qafasidan chiqib, artist <em>Ronder</em>ni o‘ldirgan va xotinining yuzini mayib qilgan edi. Tergov buni baxtsiz hodisa deb topdi. Lekin o‘shanda ham ba’zilarni ikki narsa ajablantirgan: Ronderning boshidagi jarohatlar beshta bir xil chuqurlikdagi, to‘g‘ri va teng masofali chiziqlar edi; sher esa qafasdan chiqqach, eng yaqin turgan Ronderga emas, xotiniga tashlangan. Yaqin atrofda esa sirkning kuchli odami <em>Leonardo</em> yurgan edi.",
  "savol": "Ronderning jarohatlari nimadan dalolat beradi?",
  "variantlar": [
   "Ular sher tirnog‘idan emas, beshta mix qoqilgan to‘qmoq zarbasidan: qotillik sher hujumiga o‘xshatib sahnalashtirilgan",
   "Sher uni orqasidan tirnagan, tirnoqlar esa doim bir xil iz qoldiradi",
   "Ronder qochayotganda yiqilib, boshini qafas panjarasiga urgan",
   "Jarohatlar sherni qafasga qaytarishga uringan boshqa artistlardan qolgan"
  ],
  "javob": 0,
  "izoh": "Hayvon tirnog‘i bir xil chuqurlikdagi, aniq parallel va teng masofali chiziqlar qoldirmaydi — bunday iz bir xil yasalgan asbobniki. Sherning xatti-harakati ham g‘alati: u eng yaqin odamga emas, boshqasiga tashlangan. Ko‘p yillardan keyin missis Ronder Holmesga haqiqatni aytdi: ular Leonardo bilan birga mixli to‘qmoq bilan erini o‘ldirib, sherni qo‘yib yuborishgan, ammo sher ayolning o‘ziga tashlangan.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Sherning g‘alati xatti-harakati nima edi?",
    "variantlar": [
     "U eng yaqin turgan Ronderga emas, uning xotiniga tashlangan",
     "U qafasdan chiqmagan",
     "U hech kimga tegmagan",
     "U birinchi Ronderga tashlangan"
    ],
    "javob": 0,
    "izoh": "Hayvon odatda eng yaqin nishonga tashlanadi. Kutilmagan xatti-harakat sahnaning sun’iy ekanini ko‘rsatadi."
   },
   {
    "savol": "Haqiqiy qotillik quroli nima edi?",
    "variantlar": [
     "Sherning panjasi",
     "Pichoq",
     "Ichidan beshta mix chiqarilgan to‘qmoq",
     "Qafas panjarasi"
    ],
    "javob": 2,
    "izoh": "Bir xil masofali, teng chuqurlikdagi parallel yaralar — bir xil yasalgan asbobning izi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Shoskom-Old-Pleys",
  "yil": 1927,
  "sarlavha": "Itning g‘azabi",
  "hikoya": "Ser <em>Robert Norberton</em> katta qarzga botgan, barcha umidi yaqinlashib kelayotgan ot poygasida g‘alaba qozonishda edi. Mulk esa uning kasal singlisi <em>Ledi Beatris</em>ga tegishli edi. So‘nggi paytda Ledi Beatris o‘zgacha bo‘lib qoldi: hech kim bilan gaplashmay, faqat yopiq aravada sayrga chiqardi. Holmes uning sevimli itini olib, arava o‘tadigan yo‘lga chiqdi. It quvonib aravaga yugurdi, lekin eshik oldida to‘satdan to‘xtadi, keyin ichkaridagi «xonim»ga qarab vahshiyona vovullab, etagiga tashlandi.",
  "savol": "Itning xatti-harakati nimani ko‘rsatadi?",
  "variantlar": [
   "It qarib, ko‘zi yaxshi ko‘rmay qolgan va bekasini tanimagan",
   "Ledi Beatris kasalligi tufayli itini yoqtirmay qolgan va it buni sezgan",
   "Aravadagi odam Ledi Beatris emas — niqoblangan begona; haqiqiy Ledi Beatris, ehtimol, vafot etgan va bu yashirilmoqda",
   "It aravaga qo‘shilgan notanish otdan qo‘rqib ketgan"
  ],
  "javob": 2,
  "izoh": "It avval quvonib yugurdi — aravani taniydi; lekin yaqinlashib, begona hidni sezgach, g‘azablandi. It aldanmaydi: ichkaridagi odam uning bekasi emas. Nega yashirishadi? Ledi Beatris vafot etsa, mulk boshqa merosxo‘rga o‘tadi va Ser Robert poygagacha kreditorlardan qutula olmaydi. Haqiqatan, xonim tabiiy o‘lim bilan vafot etgan, aka esa poyga o‘tguncha buni yashirib, uning o‘rniga ayol kiyimidagi odamni aravaga o‘tqazgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "It avval quvonib yugurib, keyin g‘azablangani nimani ko‘rsatadi?",
    "variantlar": [
     "It kasal edi",
     "It aravadan qo‘rqqan",
     "It o‘ynamoqchi edi",
     "Arava unga tanish, lekin ichidagi odam begona"
    ],
    "javob": 3,
    "izoh": "Ikki bosqichli reaksiya: tanish narsa (arava) va begona hid (odam). It aldanmaydi."
   },
   {
    "savol": "Nega Ser Robert singlisining o‘limini yashirdi?",
    "variantlar": [
     "U singlisini o‘ldirgan",
     "Mulk boshqa merosxo‘rga o‘tib, u poygagacha kreditorlardan qutula olmay qolardi",
     "U qayg‘uga botgan",
     "U merosni sotmoqchi edi"
    ],
    "javob": 1,
    "izoh": "Sabab va vaqt: poyga yaqin, qarz katta — o‘limni ma’lum vaqtgacha yashirish unga moliyaviy najot edi."
   }
  ]
 },
 {
  "det": "xolms",
  "kitob": "arxiv",
  "asar": "Iste’fodagi bo‘yoqchi",
  "yil": 1926,
  "sarlavha": "To‘satdan bo‘yalgan uy",
  "hikoya": "Keksa va xasis <em>Jozaya Amberli</em> xotini yosh shifokor bilan qochib ketgani va jamg‘armasini olib ketganini aytib, Holmesdan yordam so‘radi. Holmes yuborgan Uotson g‘alati narsani ko‘rdi: o‘ta xasis Amberli aynan xotini «qochgan» kunlardan keyin uyining ichini o‘tkir hidli yangi bo‘yoq bilan bo‘yashga kirishgan edi. Uydagi kichkina pul saqlanadigan xona eshigi mahkam yopiladigan, havo kirmaydigan xona edi; unga gaz quvuri kirgan, lekin uning jo‘mragi tashqarida — koridorda edi.",
  "savol": "Nega Amberli to‘satdan uyini bo‘yashga kirishdi?",
  "variantlar": [
   "U uyni tezroq sotib, bu yerdan ko‘chib ketishga tayyorlanayotgan edi",
   "Xotinining ketishi uni tushkunlikka solgan va u ish bilan chalg‘imoqchi edi",
   "Bo‘yoqning o‘tkir hidi bilan boshqa hidni — xonada ishlatilgan gaz hidini bosib ketish uchun: u xotini va shifokorni o‘sha xonada gaz bilan o‘ldirgan",
   "Uy egasi sifatida u har yili shu faslda ta’mir qilishni odat qilgan edi"
  ],
  "javob": 2,
  "izoh": "Xasis odam sababsiz pul sarflamaydi — bo‘yashning jiddiy sababi bor. O‘tkir hidli bo‘yoq boshqa hidni yashirishning eng oson yo‘li. Havo kirmaydigan xona va jo‘mragi tashqaridagi gaz quvuri — ichkaridagilarni tashqaridan gaz bilan o‘ldirish imkonini beradi. Holmes buni isbotladi. Amberlining teatrdagi alibisi ham yolg‘on chiqdi: chiptadagi o‘rindiq o‘sha kecha bo‘sh qolgan edi.",
  "muallif": "Artur Konan Doyl",
  "qoshimcha": [
   {
    "savol": "Gaz quvuri jo‘mragining tashqarida — koridorda bo‘lishi nimani ko‘rsatadi?",
    "variantlar": [
     "Bu xavfsizlik qoidasi",
     "Jo‘mrak buzilgan",
     "Ichkaridagilarni tashqaridan, ular sezmay turib gaz bilan zaharlash mumkin",
     "Bu tasodifiy qurilish"
    ],
    "javob": 2,
    "izoh": "Jo‘mrakni kim boshqarsa, gazni u boshqaradi. Tashqaridagi jo‘mrak ichkaridagilarni himoyasiz qiladi."
   },
   {
    "savol": "Teatr chiptasi alibisi qanday fosh bo‘ldi?",
    "variantlar": [
     "Chiptadagi o‘rindiq o‘sha kecha bo‘sh qolgani aniqlandi",
     "Chipta soxta edi",
     "Teatr yopiq edi",
     "Guvohlar uni ko‘rmagan"
    ],
    "javob": 0,
    "izoh": "Alibi tafsilotlari tekshirilganda bo‘sh qolgan o‘rindiq uning teatrda bo‘lmaganini ko‘rsatdi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Stayls qasridagi sirli voqea",
  "yil": 1920,
  "muallif": "Agata Kristi",
  "sarlavha": "Oxirgi qoshiq dori",
  "hikoya": "Stayls qasrining bekasi missis <em>Ingltorp</em> kechasi strixnin zaharidan vafot etdi. U har kuni kechqurun bir shishadan quvvat beruvchi dori ichardi; dorining tarkibida juda oz miqdorda strixnin bor edi — bu odatiy, xavfsiz doza. Gumon ostidagi eri <em>Alfred</em> o‘sha kecha uyda yo‘q edi. Herkul Puaro xonadan bo‘shab qolgan uyqu dori — bromid kukuni qutichasini topdi. Kimyogarlar biladi: bromid strixninli eritmaga qo‘shilsa, strixnin cho‘kib, shisha tagiga yig‘iladi.",
  "savol": "Qotil uyda bo‘lmasa ham qanday qilib zaharlay olgan?",
  "variantlar": [
   "Zahar o‘sha kechasi kakaoga qo‘shilgan, uni qotil uyga qaytib kelib, yashirincha ichirgan",
   "U oldindan dori shishasiga bromid qo‘shib qo‘ygan: butun strixnin shisha tagiga cho‘kib, oxirgi qoshiqqa to‘plangan — o‘sha dozani ichgan bemor vafot etgan",
   "Bemor o‘zi adashib, bir kunda bir necha qoshiq ichib yuborgan",
   "Strixnin xonaga kechasi deraza orqali tutun bilan kiritilgan"
  ],
  "javob": 1,
  "izoh": "Har kungi doza xavfsiz edi — demak, zahar miqdori qandaydir yo‘l bilan to‘plangan. Bromid strixninni cho‘ktiradi: shishaning ustki qismi deyarli toza, tagida esa butun strixnin qoladi. Kim oxirgi qoshiqni ichsa, o‘limli dozani oladi. Shu tufayli qotil o‘lim kechasi uydan uzoqda bo‘lib, o‘ziga «alibi» yaratishi mumkin edi. Bo‘sh bromid qutichasi bu mexanizmni ochib berdi.",
  "qoshimcha": [
   {
    "savol": "Nima uchun har kungi dozalar zararsiz edi?",
    "variantlar": [
     "Bemor zaharga o‘rganib qolgan",
     "Dorini boshqa odam ichardi",
     "Dorida strixnin juda oz miqdorda edi — bu odatiy, xavfsiz doza",
     "Strixnin zararsiz modda"
    ],
    "javob": 2,
    "izoh": "Xavf miqdorda: oz doza davo, ko‘p doza zahar. Bromid strixninni bir joyga to‘plab, xavfsiz dorini o‘limli qildi."
   },
   {
    "savol": "Bo‘sh bromid qutichasi nima uchun muhim dalil?",
    "variantlar": [
     "U zahar mexanizmini — strixninni cho‘ktirish usulini ochib beradi",
     "U qotilning ismini ko‘rsatadi",
     "U qutichani kim sotib olganini bildiradi",
     "U ahamiyatsiz"
    ],
    "javob": 0,
    "izoh": "Bo‘sh quti — ishlatilgan modda. Kimyoviy bilim bilan birga u «uzoqdan zaharlash» usulini tushuntirdi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Shokolad qutisi",
  "yil": 1923,
  "muallif": "Agata Kristi",
  "sarlavha": "Almashgan qopqoqlar",
  "hikoya": "Yosh Puaro Belgiyada ishlagan paytida deputat <em>Pol Derular</em> kechki ovqatdan keyin to‘satdan vafot etdi. Shifokorlar yurak xastaligi dedi. Puaro uning xonasida ikkita shokolad qutisini topdi: biri pushti rangda — qopqog‘i ko‘k, ikkinchisi ko‘k — qopqog‘i pushti. Qutilardan biridagi shokoladlar ichiga yurak dorisi — trinitrin tabletkalari yashirilgan bo‘lishi mumkin edi. Uyda yashovchilar orasida ko‘zi juda xira ko‘radigan, kataraktadan aziyat chekadigan keksa onasi ham bor edi.",
  "savol": "Almashib qolgan qopqoqlar kimni ko‘rsatadi?",
  "variantlar": [
   "Xizmatkorni: u shoshilib ishlagan",
   "Shokolad sotgan do‘konchini: u qopqoqlarni adashtirib yuborgan",
   "Qutilarni qayta yopgan odam ranglarni ajrata olmagan — ya’ni ko‘zi juda xira keksa ona: u o‘g‘lini zaharlagan",
   "Deputatning siyosiy raqibini: u qutilarni ataylab almashtirgan"
  ],
  "javob": 2,
  "izoh": "Pushti va ko‘k rang — oddiy ko‘zga juda farqli; ularni almashtirib yuborish uchun ranglarni ajrata olmaslik kerak. Uydagilar orasida shunday odam — kataraktali keksa ona. U o‘g‘lining dindorlikka qarshi siyosati uchun uni o‘zi jazolashga qaror qilgan. Puaro bu ishda o‘zini kech qolgan deb hisobladi va keyinchalik o‘ziga ortiqcha ishonganda Gastingsga: «Menga «shokolad qutisi» deb eslatib qo‘ying», derdi.",
  "qoshimcha": [
   {
    "savol": "Zahar qanday yo‘l bilan berilgan?",
    "variantlar": [
     "Choyga qo‘shilgan",
     "Ovqatga sepilgan",
     "Shokoladlar ichiga yurak dorisi — trinitrin tabletkalari yashirilgan",
     "Ukol orqali"
    ],
    "javob": 2,
    "izoh": "Oddiy, odatiy narsa — shokolad — zaharni yetkazish uchun eng kam shubhali vosita."
   },
   {
    "savol": "Puaro bu ishni nima uchun «xato»im deb eslardi?",
    "variantlar": [
     "U uzoq vaqt boshqa odamlarni gumon qilib, aybdorni kech topgan",
     "U aybdorni topa olmagan",
     "U yolg‘on dalil qo‘ygan",
     "U ishni rad etgan"
    ],
    "javob": 0,
    "izoh": "Hatto buyuk detektiv ham xato qiladi. Puaro kamtarlik uchun bu ishni eslab turardi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Arzon kvartira",
  "yil": 1923,
  "muallif": "Agata Kristi",
  "sarlavha": "Faqat Robinsonlarga",
  "hikoya": "Yosh er-xotin <em>Robinsonlar</em> Londonning qimmat mavzesidan katta, chiroyli kvartirani juda arzon ijaraga olishdi — narxi odatdagidan bir necha baravar past edi. Agentlikda ular bilan birga bu kvartiraga ko‘p odam da’vogar bo‘lgan, lekin uni aynan ularga berishgan. Hastings buni omad deb hisobladi. Puaro esa bir savolga qadalib qoldi. Keyin ma’lum bo‘ldiki, bu kvartirada avval ham «Robinson» ismi bilan bir er-xotin yashagan va ularni allaqanday xavfli odamlar qidirib yurgan.",
  "savol": "Kvartira nega arzon va nega aynan shu er-xotinga berildi?",
  "variantlar": [
   "Kvartirada arvoh borligi sababli",
   "Uy egasi Robinsonlarning qarindoshi edi",
   "Kvartira tez orada buzilishi kerak edi",
   "Avvalgi «Robinsonlar» ta’qibdan qochib, o‘z o‘rniga xuddi shu ismli boshqa er-xotinni joylashtirmoqchi bo‘lgan — yangi ijarachilar bilmagan holda «nishon» qilib qo‘yilgan"
  ],
  "javob": 3,
  "izoh": "«Juda arzon» — savol tug‘diradi. «Ko‘p da’vogar ichidan aynan ular» — ularda boshqalarda yo‘q narsa bor: ismi. Ismi muhim bo‘lsa, kimdir shu ism bilan qidirilmoqda. Puaro yangi ijarachilarni xavfdan qutqarib, haqiqiy qochoqlarni topdi.",
  "qoshimcha": [
   {
    "savol": "Puaroni qaysi fakt eng ko‘p o‘ylantirdi?",
    "variantlar": [
     "Ko‘p da’vogar bo‘la turib, kvartira aynan Robinsonlarga berilgani",
     "Kvartiraning chiroyliligi",
     "Hastingsning quvonchi",
     "Mavzening qimmatligi"
    ],
    "javob": 0,
    "izoh": "«Omad» deb tushuntirilgan narsada ko‘pincha yashirin sabab bo‘ladi."
   },
   {
    "savol": "Nega ism almashinuvi qochoqlar uchun qulay edi?",
    "variantlar": [
     "Ism chiroyli edi",
     "Pochta adashmasin deb",
     "Ta’qibchilar «Robinsonlar» shu manzilda yashashini bilardi — u yerda yangi Robinsonlar bo‘lsa, ular adashib, haqiqiylarni qidirmay qo‘yardi",
     "Ijara shartnomasi uchun"
    ],
    "javob": 2,
    "izoh": "Aldov uchun eng yaxshi narsa — kutilganini berish: ta’qibchilar Robinsonlarni qidirdi va «topdi»."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Janob Davenxaymning g‘oyib bo‘lishi",
  "yil": 1923,
  "muallif": "Agata Kristi",
  "sarlavha": "Eng xavfsiz yashirinish joyi",
  "hikoya": "Bankir <em>Davenxaym</em> shanba kuni pochtaga xat tashlash uchun uydan chiqib, qaytib kelmadi; uning seyfi bo‘shatilgan edi. Keyin ma’lum bo‘ldi: bank og‘ir ahvolda bo‘lgan, Davenxaym esa oxirgi oylarda mablag‘larni sekin-asta naqd pulga aylantirib borgan. Bir necha kundan keyin mayda o‘g‘ri <em>Billi Kellett</em> Davenxaymning uzugini garovga qo‘ymoqchi bo‘lib qo‘lga tushdi va qisqa muddatga qamoqqa tashlandi. Kellett shaharchada bir necha oydan beri paydo bo‘lib yurgan, ammo uni hech kim yaqindan tanimasdi. Puaro uydan chiqmasdan, gazetadagi ma’lumotlarning o‘zi bilan bu ishni yechishga Jepp bilan garov o‘ynadi.",
  "savol": "Puaroning xulosasi qanday?",
  "variantlar": [
   "Kellett Davenxaymni o‘ldirib, uzugini olgan",
   "Davenxaym chet elga qochib ketgan, uzukni yo‘qotgan",
   "Davenxaymni sherigi o‘g‘irlab ketgan",
   "Billi Kellett — Davenxaymning o‘zi: u bir necha oy oldin bu soxta shaxsni yaratgan va qamoqxonani hech kim izlamaydigan «yashirinish joyi» qilib tanlagan"
  ],
  "javob": 3,
  "izoh": "Bankrot bo‘layotgan, pulini naqdga aylantirayotgan odam — qochishga tayyorlanmoqda. Uning uzugi esa aynan uni hamma izlayotgan paytda paydo bo‘lgan mayda o‘g‘rida. Agar Kellett va Davenxaym bir odam bo‘lsa, hamma fakt joyiga tushadi: hech kim qidirilayotgan bankirni qamoqdagi o‘g‘rilar orasidan qidirmaydi.",
  "qoshimcha": [
   {
    "savol": "Nega Puaro uydan chiqmasdan ishni yechishga ishondi?",
    "variantlar": [
     "U kasal edi",
     "Uning fikricha, to‘g‘ri tartibga solingan faktlar va mantiq yetarli — joyma-joy yugurish shart emas",
     "Jepp unga ruxsat bermagan",
     "U gazetachilarni yollagan"
    ],
    "javob": 1,
    "izoh": "Puaroning «kulrang hujayralar» falsafasi: dalillarni yig‘ish emas, ularni to‘g‘ri tartiblash muhim."
   },
   {
    "savol": "Kellettning shaharchada bir necha oydan beri paydo bo‘lib yurgani nimani ko‘rsatadi?",
    "variantlar": [
     "Kellett mahalliy aholi edi",
     "U ish qidirgan",
     "Soxta shaxs oldindan, rejali tayyorlangan — demak, g‘oyib bo‘lish ham rejali",
     "Bu tasodif"
    ],
    "javob": 2,
    "izoh": "Uzoq tayyorgarlik — qochish to‘satdan emas, puxta rejalashtirilganini ko‘rsatadi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Rojer Ekroydning o‘ldirilishi",
  "yil": 1926,
  "muallif": "Agata Kristi",
  "sarlavha": "Soat 9:30 dagi ovoz",
  "hikoya": "Boy <em>Rojer Ekroyd</em> o‘z kabinetida pichoq bilan o‘ldirildi. Kotibi soat 9:30 da kabinet eshigi oldidan o‘tib, Ekroydning ichkarida kim bilandir pul haqida gaplashayotganini eshitgan — shuning uchun hamma uni 9:30 da hali tirik deb hisobladi. Lekin Puaro bir tafsilotga e’tibor qaratdi: kabinetdagi katta kreslo odatdagi joyidan devordan surib chiqarilgan, keyin esa kimdir uni joyiga qaytargan. Ekroyd yaqinda diktofon — ovoz yozib oladigan qurilma sotib olgan edi, u esa hech qayerdan topilmadi.",
  "savol": "Kotib 9:30 da nimani eshitgan?",
  "variantlar": [
   "Ekroydning tirik ovozini: u 9:30 da hali tirik bo‘lgan, qotil keyin kirgan",
   "Radioeshittirishni: kotib uni adashib Ekroyd deb o‘ylagan",
   "Ekroydning o‘zi kimgadir telefonda gapirayotganini",
   "Diktofondagi yozuvni: Ekroyd allaqachon o‘lgan edi, qotil diktofonni surilgan kreslo ortiga yashirib, vaqtni soxtalashtirgan"
  ],
  "javob": 3,
  "izoh": "«Kim bilandir gaplashayotgan» ovozga javob bergan ikkinchi ovoz yo‘q edi — bu yozuv bo‘lishi mumkin. Yo‘qolgan diktofon va g‘alati surilgan kreslo bir-birini to‘ldiradi: kreslo qurilmani eshikdan ko‘rinmas qilib yashirgan. Demak, o‘lim vaqti aslida ancha oldin, «9:30 dagi ovoz» esa qotilning alibisi edi. Diktofonni keyin olib ketish va kreslo joyini qaytarish imkoniga ega odam qotil bo‘lib chiqdi — bu hikoyachi doktorning o‘zi edi.",
  "qoshimcha": [
   {
    "savol": "Kotib eshitgan gapning qaysi xususiyati shubhali edi?",
    "variantlar": [
     "U juda baland gapirgan",
     "U boshqa tilda gapirgan",
     "U kuylagan",
     "Ekroyd gapirgan, lekin unga javob bergan ikkinchi ovoz eshitilmagan"
    ],
    "javob": 3,
    "izoh": "Suhbatda ikki ovoz bo‘ladi. Bitta ovozning «suhbati» — yozuv yoki diktovka bo‘lishi mumkin."
   },
   {
    "savol": "Surilgan kreslo nima vazifani bajargan?",
    "variantlar": [
     "Qotil unda o‘tirgan",
     "U eshikdan kirgan odam diktofonni ko‘rmasligi uchun uni yashirib turgan",
     "Ekroyd uni o‘zi surgan",
     "U oynani to‘sgan"
    ],
    "javob": 1,
    "izoh": "Odatiy joyidan surilgan va keyin qaytarilgan mebel — vaqtincha yashirish uchun ishlatilgan."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Ari uyasi",
  "yil": 1928,
  "muallif": "Agata Kristi",
  "sarlavha": "Soat to‘qqizdagi zahar",
  "hikoya": "Puaro do‘sti <em>Jon Xarrison</em>ning bog‘iga keldi. Xarrison aytdi: kechqurun soat to‘qqizda <em>Klod Lengton</em> uning bog‘idagi ari uyasini yo‘q qilish uchun keladi va buning uchun dorixonadan sianid sotib olgan. Puaro bilib oldi: Lengton bir paytlar Xarrisonning qaylig‘i <em>Molli</em>ga unashtirilgan edi, Xarrisonning o‘zi esa og‘ir kasal — shifokorlar unga bir necha oy umr qolganini aytgan. Puaro soat to‘qqizdan oldin yashirincha keldi va Xarrisonning cho‘ntagidagi sianidni kir yuvish sodasiga almashtirib qo‘ydi.",
  "savol": "Xarrison nimani rejalashtirgan edi?",
  "variantlar": [
   "U o‘zini Lengton sotib olgan sianid bilan zaharlab, o‘limini Lengton qilgan qotillikka o‘xshatmoqchi edi",
   "U Lengtonni zaharlamoqchi edi",
   "U haqiqatan ham faqat arilarni yo‘q qilmoqchi edi",
   "U Puaroni sinab ko‘rmoqchi edi"
  ],
  "javob": 0,
  "izoh": "Sabablar zanjiri: Xarrison o‘lim to‘shagida, rashk qiladi va raqibini jazolamoqchi. Zaharni aynan Lengton sotib olgan — dalil uning ustiga tushadi. Puaro buni sezib, zaharni zararsiz sodaga almashtirdi va Xarrisonni gunohdan saqlab qoldi.",
  "qoshimcha": [
   {
    "savol": "Nega zaharni aynan Lengton sotib olishi muhim edi?",
    "variantlar": [
     "U arzonroq olardi",
     "U dorixonachini tanirdi",
     "Dorixona daftaridagi uning imzosi qotillikni unga bog‘laydigan dalil bo‘lardi",
     "Xarrison yura olmasdi"
    ],
    "javob": 2,
    "izoh": "Rejalashtirilgan tuhmatda dalil oldindan tayyorlanadi — sotib olish yozuvi shunday dalil."
   },
   {
    "savol": "Puaroning harakati qaysi maqsadga xizmat qildi?",
    "variantlar": [
     "Ham Xarrisonning o‘limini, ham begunoh Lengtonning ayblanishini oldini olish",
     "Xarrisonni qamatish",
     "Lengtonni fosh qilish",
     "Arilarni yo‘q qilish"
    ],
    "javob": 0,
    "izoh": "Detektivning vazifasi faqat jinoyatni ochish emas — imkon bo‘lsa, uni oldini olish ham."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Chekka uydagi xavf",
  "yil": 1932,
  "muallif": "Agata Kristi",
  "sarlavha": "Faqat o‘zi ko‘rgan suiqasdlar",
  "hikoya": "Yosh <em>Nik Bakli</em> Puaroga so‘nggi kunlarda uch marta o‘limdan qutulib qolganini aytdi: karavoti ustiga og‘ir surat tushdi, qoyadan tosh qulab, ozgina tegmay o‘tdi, mashinasining tormozi buzildi. Shlyapasida esa o‘q teshigi bor edi. Puaro uni himoya qilish uchun qarindoshi <em>Meggi</em>ni uyga chaqirtirdi. Bayram kechasi Meggi Nikning qizil ro‘molini yopinib bog‘ga chiqdi va otib o‘ldirildi. Keyin ma’lum bo‘ldi: yaqinda halok bo‘lgan mashhur uchuvchi Seton yashirincha Meggiga unashtirilgan va katta merosini «Magdala Bakli» nomiga qoldirgan edi. Oilaviy an’anaga ko‘ra ikkala amakivachchaning ham to‘liq ismi Magdala edi.",
  "savol": "Qaysi xulosa to‘g‘ri?",
  "variantlar": [
   "Suiqasdlarni Nikning o‘zi uyushtirgan: haqiqiy maqsad Meggini «adashib o‘ldirilgan» qilib ko‘rsatish edi — Nik o‘zi ro‘molni berib, Meggini otgan va «Magdala Bakli» sifatida merosni o‘zi egallamoqchi bo‘lgan",
   "Qotil Nikni o‘ldirmoqchi bo‘lgan, ammo ro‘mol tufayli adashib Meggini otgan",
   "Meggini Nikning sevgilisi rashk tufayli o‘ldirgan",
   "Barcha hodisalar tasodif, Meggi esa adashgan o‘q qurboni"
  ],
  "javob": 0,
  "izoh": "Barcha «suiqasdlar» faqat Nikning so‘zidan ma’lum — guvoh yo‘q. Shunday odam o‘zi uchun xavf «yaratishi» mumkin. Ro‘molni kim berdi va Meggi qayerga borishini kim bildi? Nik. Meros «Magdala Bakli» nomiga — Seton aslida Meggiga unashtirilgan, lekin ism ikkalasiga ham mos. Demak, Nikka Meggining o‘limi kerak edi va «adashib o‘ldirilgan» ko‘rinishi uni gumondan qutqarardi. Puaro sahnani teskari o‘qib, haqiqatni topdi.",
  "qoshimcha": [
   {
    "savol": "Suiqasdlar haqida qaysi muhim fakt shubha uyg‘otadi?",
    "variantlar": [
     "Ular juda xavfli edi",
     "Ular kechasi bo‘lgan",
     "Ularning barchasi faqat Nikning so‘zidan ma’lum, boshqa guvoh yo‘q",
     "Ular bir haftada bo‘lgan"
    ],
    "javob": 2,
    "izoh": "Guvohsiz hodisalarni hikoya qiluvchining o‘zi yaratishi mumkin. Manba yagona bo‘lsa, uni tekshirish kerak."
   },
   {
    "savol": "Meggini «adashib o‘ldirilgan» qilib ko‘rsatish Nikka nima berardi?",
    "variantlar": [
     "U gumondan chetda qolardi, chunki uni ham qurbon deb hisoblashardi",
     "U politsiyadan yashirinardi",
     "U uydan ko‘chardi",
     "U merosdan voz kechardi"
    ],
    "javob": 0,
    "izoh": "Qurbon qiyofasidagi qotil — eng kam shubha uyg‘otadi. «Asl nishon» Nik bo‘lsa, uni hech kim ayblamaydi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Lord Edjver vafot etadi",
  "yil": 1933,
  "muallif": "Agata Kristi",
  "sarlavha": "Parij hukmi",
  "hikoya": "Aktrisa <em>Jeyn Uilkinson</em>ning eri lord <em>Edjver</em> o‘ldirildi. Xizmatkorlar o‘sha kechasi Jeynni uyga kirganini ko‘rishgan, ammo xuddi shu soatda Jeyn boshqa joydagi kechki ziyofatda, ko‘plab guvohlarning ko‘z o‘ngida edi. Ziyofatda «Jeyn» qadimgi yunon afsonasi — Parij hukmi haqida bilimdonlik bilan gaplashgan edi. Keyinroq boshqa bir suhbatda haqiqiy Jeyn «Parij» so‘zini eshitib, faqat Fransiya poytaxti va moda haqida gapirdi — afsonadan bexabar edi. O‘sha davrda Jeynga taqlid qilib, uni mohirona o‘ynaydigan aktrisa <em>Karlotta Adams</em> ham bor edi.",
  "savol": "Ziyofatda o‘tirgan «Jeyn» kim edi?",
  "variantlar": [
   "Haqiqiy Jeyn: demak, uyga kirgan ayol Karlotta va qotil o‘sha",
   "Jeynning egizak singlisi",
   "Ziyofatdagi va uydagi ayol bitta odam — guvohlar soatni adashtirgan",
   "Uni o‘ynayotgan Karlotta Adams: haqiqiy Jeyn esa shu paytda uyga borib, erini o‘ldirgan — alibi soxta"
  ],
  "javob": 3,
  "izoh": "Bir odamning bilimi to‘satdan yo‘qolmaydi. Ziyofatdagi «Jeyn» afsonani yaxshi bilgan, haqiqiy Jeyn esa bilmaydi — demak, ular har xil odamlar. Ziyofatdagi ayol ma’lumotli aktrisa Karlotta bo‘lgan. Shunda xizmatkorlar ko‘rgan ayol — haqiqiy Jeyn. U Karlottani o‘zining o‘rniga ziyofatga yuborib, mustahkam alibi yaratgan va erini o‘ldirgan, keyin sirni biladigan Karlottani ham yo‘q qilgan.",
  "qoshimcha": [
   {
    "savol": "Haqiqiy Jeyn «Parij» so‘zini qanday tushundi?",
    "variantlar": [
     "Afsona sifatida",
     "Shoir sifatida",
     "Fransiya poytaxti va moda haqida — afsonadan bexabar",
     "Hech qanday javob bermadi"
    ],
    "javob": 2,
    "izoh": "Odamning bilimi o‘zgarmaydi. Bilmagan narsasini avvalroq bilgandek ko‘rinishi — ikki xil odam ekanini ko‘rsatadi."
   },
   {
    "savol": "Karlotta Adamsning kasbi ishda qanday rol o‘ynadi?",
    "variantlar": [
     "U Jeynga mohirona taqlid qiluvchi aktrisa edi — uning o‘rniga ziyofatga bora oldi",
     "U Jeynning kotibasi edi",
     "U politsiyachi edi",
     "U shifokor edi"
    ],
    "javob": 0,
    "izoh": "Taqlid qilish mahorati alibini soxtalashtirishga imkon berdi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Sharq ekspressidagi qotillik",
  "yil": 1934,
  "muallif": "Agata Kristi",
  "sarlavha": "O‘n ikki jarohat",
  "hikoya": "Qor bo‘roni sabab to‘xtab qolgan «Sharq ekspressi» poyezdida yo‘lovchi <em>Ratchett</em> o‘z kupesida o‘ldirildi. Uning tanasida 12 ta pichoq jarohati bor edi: ba’zilari chuqur, ba’zilari yuzaki, kimdir o‘ng qo‘l bilan, kimdir chap qo‘l bilan urgan. Vagondagi yo‘lovchilar turli millat va tabaqadan bo‘lib, bir-birini tanimasligini aytishardi. Puaro aniqladi: Ratchett yillar oldin kichkina qiz Deyzi Armstrongni o‘g‘irlab, o‘ldirgan jinoyatchi edi, yo‘lovchilarning har biri esa qandaydir yo‘l bilan Armstronglar oilasiga bog‘liq.",
  "savol": "O‘n ikki xil jarohat nimani ko‘rsatadi?",
  "variantlar": [
   "Qotil bitta emas: o‘n ikki kishi — Armstronglar oilasiga yaqin yo‘lovchilar — navbatma-navbat bittadan zarba bergan",
   "Bitta qotil qo‘llarini almashtirib, ataylab har xil kuch bilan urgan",
   "Qotil tashqaridan kelgan, poyezd to‘xtaganda qochib ketgan",
   "Jarohatlarning bir qismi o‘limdan keyin tergovchilarni chalg‘itish uchun qilingan"
  ],
  "javob": 0,
  "izoh": "Chuqur va yuzaki, o‘ng va chap qo‘l zarbalari — turli kuch va odatdagi odamlar. Bir xil sababga ega o‘n ikki odam — Armstronglar fojiasiga bog‘langan yo‘lovchilar. Bir-birini «tanimaslik» esa kelishilgan yolg‘on edi. O‘n ikki kishi — xuddi sud hay’ati kabi — o‘zlaricha hukm chiqargan. Puaro ikki izohni taklif qildi va haqiqatni bilsa ham, politsiyaga oddiy izohni berishga qaror qildi.",
  "qoshimcha": [
   {
    "savol": "Chap va o‘ng qo‘l bilan qilingan zarbalar nimani ko‘rsatadi?",
    "variantlar": [
     "Qotil ikki qo‘l bilan urgan",
     "Qotillikda turli odamlar qatnashgan",
     "Qotil chapaqay",
     "Pichoq ikkita bo‘lgan"
    ],
    "javob": 1,
    "izoh": "Bitta odamning zarbalari odatda bir xil yo‘nalish va kuchda bo‘ladi. Turli xillik — turli qo‘llar."
   },
   {
    "savol": "Yo‘lovchilarning bir-birini «tanimasligi» haqidagi gap qanday chiqdi?",
    "variantlar": [
     "Haqiqat edi",
     "Faqat ikkitasi tanish edi",
     "Ular poyezdda tanishgan",
     "Kelishilgan yolg‘on: ularning barchasi Armstronglar oilasiga bog‘liq edi"
    ],
    "javob": 3,
    "izoh": "Tasodifan bitta vagonda bir oilaga bog‘liq o‘n ikki kishi bo‘lishi — juda kam ehtimol. Tasodif o‘rniga kelishuvni ko‘rish kerak."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Uch pardali fojia",
  "yil": 1934,
  "muallif": "Agata Kristi",
  "sarlavha": "Sababsiz qotillik",
  "hikoya": "Mashhur aktyor ser <em>Charlz Kartrayt</em>ning uyidagi ziyofatda hammaning sevimlisi, yuvosh keksa ruhoniy <em>Babbington</em> kokteyl ichib, to‘satdan vafot etdi. Uning hech qanday dushmani, merosi yoki siri yo‘q edi — o‘ldirishga sabab topilmadi. Bir necha oydan keyin xuddi shunday ziyofatda shifokor <em>Bartolomyu Streynj</em> nikotin zaharidan o‘ldi; shu kecha uning butleri <em>Ellis</em> izsiz g‘oyib bo‘ldi. Doktor Streynj ser Charlzning eski do‘sti bo‘lib, uning ko‘p sirlarini bilardi.",
  "savol": "Nega hech qanday sababsiz ruhoniy o‘ldirildi?",
  "variantlar": [
   "Ruhoniy tasodifan boshqa odamga mo‘ljallangan qadahni ichib yuborgan",
   "Ruhoniy yashirin boylikka ega edi",
   "Ruhoniy tabiiy sabab bilan vafot etgan",
   "Bu «bosh repetitsiya» edi: qotil usulni sinab ko‘rgan va keyingi haqiqiy qotillikni sababsiz «seriya»ga o‘xshatmoqchi bo‘lgan"
  ],
  "javob": 3,
  "izoh": "Agar qurbonda hech qanday sabab topilmasa, sabab qurbonda emas, qotilning rejasida bo‘lishi mumkin. Birinchi o‘lim usulni tekshirish va tergovchilarni «sababsiz qotil» g‘oyasiga yo‘naltirish uchun kerak edi. Haqiqiy nishon — sirlarni biladigan doktor Streynj edi.",
  "qoshimcha": [
   {
    "savol": "G‘oyib bo‘lgan butler Ellis aslida kim edi?",
    "variantlar": [
     "Haqiqiy butler — u qo‘rqib qochgan",
     "Grim va niqob bilan butler rolini o‘ynagan aktyor — ser Charlzning o‘zi",
     "Doktorning qarindoshi",
     "Politsiya agenti"
    ],
    "javob": 1,
    "izoh": "Aktyor uchun boshqa odam qiyofasiga kirish oson. Butler zahar quyish imkoniyatiga ega edi va u g‘oyib bo‘ldi — demak, bu rol vaqtinchalik edi."
   },
   {
    "savol": "Doktor Streynj nima uchun xavfli edi?",
    "variantlar": [
     "U ser Charlzga qarzdor edi",
     "U ser Charlzning raqibi edi",
     "U ser Charlzning sirini — aqldan ozgan xotini borligini va shuning uchun qayta uylana olmasligini bilardi",
     "U merosga da’vo qilardi"
    ],
    "javob": 2,
    "izoh": "Sirni biladigan odam — qotil uchun xavf. Charlz yosh qizga uylanmoqchi edi, sir esa bunga to‘sqinlik qilardi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Bulutlardagi o‘lim",
  "yil": 1935,
  "muallif": "Agata Kristi",
  "sarlavha": "Samolyotdagi ari",
  "hikoya": "Parijdan Londonga uchayotgan samolyotda sudxo‘r ayol madam <em>Jizel</em> o‘z o‘rindig‘ida o‘lik topildi; bo‘ynida kichik sanchiq izi bor edi. Parvoz paytida salonda ari uchib yurgan, bir yo‘lovchi uni o‘ldirgan. Keyin Puaroning o‘rindig‘i ortidan Janubiy Amerika hindularining zaharli o‘q otadigan puflama nayi topildi. Ammo hech bir yo‘lovchi kimdir nay bilan o‘q otganini ko‘rmagan. Salonda xizmat qiladigan styuardlar esa oq kitel kiyib, o‘rindiqlar orasida bemalol yurishardi.",
  "savol": "Puaroning xulosasi qanday?",
  "variantlar": [
   "Puflama nay — chalg‘itish uchun qo‘yilgan; qotil Jizelga yaqin kelib, zaharli tikanni qo‘l bilan sanchgan — buning uchun u styuard kiteli kiyib, ko‘zga tashlanmay o‘tgan",
   "Qotil nay bilan uzoqdan otgan, yo‘lovchilar esa uxlab qolgan",
   "Jizelni ari chaqqan va u allergiyadan vafot etgan",
   "Qotil samolyot ekipaji a’zosi — uchuvchi"
  ],
  "javob": 0,
  "izoh": "Yopiq salonda nayni lablarga qo‘yib otish albatta e’tiborni tortardi — demak, nay ishlatilmagan. Xizmat xodimi esa hech kimning e’tiborini tortmaydi. Ari — sanchiq izini «ari chaqishi» deb tushuntirish uchun qo‘yib yuborilgan. Qotil — styuard kitelini kiyib olgan yo‘lovchi tish shifokori Norman Geyl edi.",
  "qoshimcha": [
   {
    "savol": "Salonda ari uchib yurishi nima uchun kerak edi?",
    "variantlar": [
     "Yo‘lovchilarni qo‘rqitish uchun",
     "Ari tasodifan kirgan",
     "Bo‘yindagi sanchiq izini ari chaqishi deb tushuntirish uchun",
     "Ari zahar tashuvchi edi"
    ],
    "javob": 2,
    "izoh": "Kutilgan izohni oldindan tayyorlash — tergovni chalg‘itish. O‘lim tabiiy ko‘rinsa, hech kim tekshirmaydi."
   },
   {
    "savol": "Nega styuard kiteli eng yaxshi niqob edi?",
    "variantlar": [
     "Odamlar xizmat xodimlariga e’tibor bermaydi — ular salonda yurishi tabiiy",
     "U qimmat edi",
     "Kitelda qurol yashirish oson",
     "Styuardlar hammani taniydi"
    ],
    "javob": 0,
    "izoh": "Ota Braunning «ko‘rinmas odam»iga o‘xshab: odatiy, kundalik odamlar «ko‘zga ko‘rinmaydi»."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "ABC qotilliklari",
  "yil": 1936,
  "muallif": "Agata Kristi",
  "sarlavha": "Alifbo bo‘yicha qotil",
  "hikoya": "Puaroga «ABC» imzosi bilan xatlar kela boshladi: har gal qotillik qayerda bo‘lishi oldindan aytilardi. Andoverda — Elis Asher (A), Bexhillda — Betti Barnard (B), Cherstonda — boy ser Karmaykl Klark (C) o‘ldirildi; har jasad yonida «ABC» temir yo‘l qo‘llanmasi qoldirilgan. Hamma buni aqldan ozgan maniakning ishi deb hisobladi. Puaro esa bitta narsaga e’tibor berdi: barcha qurbonlar ichida faqat bitta odamning o‘limidan kimdir katta foyda ko‘radi — ser Karmaykl boy edi va merosi ukasiga o‘tishi kerak edi.",
  "savol": "Puaroning xulosasi qanday?",
  "variantlar": [
   "Qotil haqiqatan ham alifboga berilib ketgan ruhiy kasal odam",
   "Har bir qotillikni turli odamlar qilgan, ular «ABC» nomini ko‘chirib olishgan",
   "Seriya niqob: qotilga faqat bitta o‘lim — ser Karmaykl Klarkniki kerak edi; qolganlari uni «maniak qurboni» qilib ko‘rsatish uchun o‘ylab topilgan",
   "Qurbonlar bir-birini tanigan va ular birgalikda sir yashirgan"
  ],
  "javob": 2,
  "izoh": "Seriya qotilliklarda odatda shaxsiy sabab bo‘lmaydi — shuning uchun hamma maniakni qidiradi. Puaro aksincha so‘radi: kimning o‘limidan kim foyda ko‘radi? Faqat ser Karmaykl o‘limi aniq foyda berardi. Demak, A va B — haqiqiy maqsadni yashiradigan «o‘rmon», C esa — yashirilgan «barg». Qotil aybni bechora, ruhan zaif savdogar Kastga ag‘darmoqchi bo‘lgan. Haqiqiy qotil — merosxo‘r Franklin Klark edi.",
  "qoshimcha": [
   {
    "savol": "Puaro seriya qotilliklarga qanday savol bilan yondashdi?",
    "variantlar": [
     "Kimning o‘limidan kim foyda ko‘radi?",
     "Qotil qaysi harfni yoqtiradi?",
     "Qaysi shaharda keyingi qotillik bo‘ladi?",
     "Qurbonlar qaysi kasbda?"
    ],
    "javob": 0,
    "izoh": "Maniak versiyasida sabab yo‘q. Puaro sababni har bir qurbon bo‘yicha alohida izlab, yagona foyda ko‘ruvchini topdi."
   },
   {
    "savol": "Nega aybni Kastga ag‘darish qulay edi?",
    "variantlar": [
     "U boy edi",
     "U Puaroni tanirdi",
     "U har bir shaharda bo‘lgan, ruhan zaif edi va o‘zini o‘zi ham shubha ostiga qo‘yardi",
     "U politsiyachi edi"
    ],
    "javob": 2,
    "izoh": "Qotil «ayb echkisi»ni oldindan tanlagan: aybdordek ko‘rinadigan, o‘zini himoya qila olmaydigan odam."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Myus ko‘chasidagi qotillik",
  "yil": 1936,
  "muallif": "Agata Kristi",
  "sarlavha": "O‘ng qo‘ldagi to‘pponcha",
  "hikoya": "Gay Foks bayrami kechasi — atrofda mushaklar portlab turgan paytda — yosh beva missis <em>Allen</em> o‘z xonasida o‘q bilan halok bo‘ldi. Eshik qulflangan edi. To‘pponcha uning o‘ng qo‘lida, o‘q jarohati esa chap qulog‘ining orqasida edi. Kuldonda turli sigaret qoldiqlari bor edi. U bilan birga yashovchi dugonasi miss <em>Plenderleyt</em> o‘sha kecha uyda bo‘lmagan, ertalab qaytgan. Missis Allenni sobiq harbiy bir janob shantaj qilib yurgani ma’lum bo‘ldi.",
  "savol": "To‘pponcha va jarohatning joylashuvi nimani ko‘rsatadi?",
  "variantlar": [
   "Sahna tabiiy emas: o‘ng qo‘l bilan chap quloq ortini otish deyarli mumkin emas — kimdir o‘limdan keyin xonaga kirib, to‘pponchani qo‘liga qo‘ygan va holatni o‘zgartirgan",
   "Missis Allen chapaqay bo‘lgan, to‘pponchani o‘ng qo‘liga olgan",
   "Qotil uni otib, to‘pponchani o‘ng qo‘liga ataylab, xatosiz joylashtirgan",
   "Bu tasodifiy o‘q — mushak portlashi paytida to‘pponcha o‘zi otilgan"
  ],
  "javob": 0,
  "izoh": "Jarohat va qurolning joylashuvi bir-biriga mos kelmasa, bu sahnaga keyin aralashilganini ko‘rsatadi. Puaro tafsilotlarni (sigaret qoldiqlari, xonadan yo‘qolgan narsalar) yig‘ib, tushundi: missis Allen o‘z joniga qasd qilgan, dugonasi esa uni shantaj qilgan odamni jazolash uchun buni qotillikka o‘xshatib, sahnani o‘zgartirgan. Uning maqsadi — shantajchini qotillikda ayblash edi.",
  "qoshimcha": [
   {
    "savol": "Nega o‘ng qo‘ldagi to‘pponcha va chap quloq ortidagi jarohat mos kelmaydi?",
    "variantlar": [
     "To‘pponcha og‘ir edi",
     "Jarohat juda kichik edi",
     "U chapaqay emasdi",
     "O‘ng qo‘l bilan chap quloq ortini otish juda noqulay va g‘ayritabiiy"
    ],
    "javob": 3,
    "izoh": "Jismoniy imkoniyatni tekshirish — sahna haqiqiymi yoki sun’iymi ekanini aniqlashning oddiy yo‘li."
   },
   {
    "savol": "Dugonaning maqsadi nima edi?",
    "variantlar": [
     "Do‘stining o‘limini yashirish",
     "O‘z joniga qasdni qotillikka o‘xshatib, shantajchini ayblash",
     "Merosni olish",
     "Politsiyani chalg‘itib, qochish"
    ],
    "javob": 1,
    "izoh": "Sahnani o‘zgartirgan odam har doim ham qotil emas. Bu yerda u shantajchini jazolamoqchi edi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Ochiq kartalar",
  "yil": 1936,
  "muallif": "Agata Kristi",
  "sarlavha": "Bo‘sh qolgan o‘yinchi",
  "hikoya": "G‘alati boy janob <em>Shaytana</em> kechki ziyofatga sakkiz kishini chaqirdi: to‘rt nafar detektivni (Puaro ham ular orasida) va o‘zining aytishicha, «qotillik qilib, jazodan qutulib qolgan» to‘rt kishini. Mehmonlar ikki xonada bridj o‘ynashdi. O‘yin paytida Shaytana kamin oldidagi kresloda pichoq bilan o‘ldirildi. Bridjda har o‘yinda bir o‘yinchi «dummy» — kartalarini stolga ochib qo‘yadi va o‘sha o‘yinda ishtirok etmay, stoldan turib yurishi mumkin.",
  "savol": "Qotillik uchun eng qulay imkoniyat kimda bo‘lgan?",
  "variantlar": [
   "Detektivlardan birida, chunki ular boshqa xonada edi",
   "Xizmatkorda, chunki u ichimlik tashirdi",
   "Hech kimda — Shaytana o‘zini o‘zi o‘ldirgan",
   "«Dummy» bo‘lib qolgan o‘yinchida: u stoldan turib, boshqalar kartaga qarab turganda Shaytanaga yaqinlasha olgan"
  ],
  "javob": 3,
  "izoh": "Imkoniyatni o‘yin qoidalaridan topish mumkin: o‘ynayotganlar kartadan ko‘z uzmaydi, «dummy» esa erkin. Puaro qaysi o‘yinda kim «dummy» bo‘lganini aniqlab, gumondorlarni toraytirdi. Qotil doktor Roberts edi.",
  "qoshimcha": [
   {
    "savol": "Puaro har bir o‘yinchining xarakterini qanday o‘rgandi?",
    "variantlar": [
     "Ularning qo‘lyozmasini tekshirib",
     "Bridj hisob varaqalarini tahlil qilib: kim tavakkal qiladi, kim ehtiyotkor — bu ularning qotillik uslubiga mos kelardi",
     "Ularning kiyimidan",
     "Ularni qo‘rqitib"
    ],
    "javob": 1,
    "izoh": "O‘yin uslubi — xarakter ko‘zgusi. Tavakkalchi o‘yinchi tavakkalchi qotillikka qodir bo‘ladi."
   },
   {
    "savol": "Shaytana nega bu sakkiz kishini birga chaqirdi?",
    "variantlar": [
     "U bridj turniri o‘tkazmoqchi edi",
     "U «jazosiz qolgan qotillar kolleksiyasi»ni ko‘z-ko‘z qilmoqchi bo‘lgan — bu xavfli o‘yin uning o‘limiga olib keldi",
     "U detektivlardan yordam so‘ragan",
     "U meros haqida e’lon qilmoqchi edi"
    ],
    "javob": 1,
    "izoh": "Qotillar oldida ularning sirini bilishini ko‘rsatish — ulardan birini qayta qotillikka undash edi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Mesopotamiyadagi qotillik",
  "yil": 1936,
  "muallif": "Agata Kristi",
  "sarlavha": "Hech kim kirmagan eshik",
  "hikoya": "Arxeologik qazishma lagerida rahbar <em>doktor Leydner</em>ning xotini <em>Luiza</em> o‘z xonasida boshiga og‘ir narsa urilib halok bo‘ldi. Uning eshigi ichki hovliga ochilardi va o‘sha paytda hovlida bir necha kishi ishlab o‘tirgan — hech kim eshikdan kirib-chiqmagan. Xonaning derazasi esa tashqariga — lager devori ortiga ochilardi. Luiza oylar davomida tahdid xatlari olib, derazada qo‘rqinchli yuzlarni ko‘rganidan shikoyat qilardi. Qotillik paytida doktor Leydner tomda ishlayotgan edi. Keyinroq tomdan qonli tegirmon toshi topildi.",
  "savol": "Zarba qayerdan kelgan?",
  "variantlar": [
   "Kimdir hovlidagilar sezmasdan eshikdan kirgan",
   "Luiza yiqilib, boshini mebelga urgan",
   "Qotil xonada oldindan yashiringan",
   "Yuqoridan, derazadan: Luiza derazadan boshini chiqarganida, tomdan arqonga bog‘langan tegirmon toshi uning boshiga tushirilgan"
  ],
  "javob": 3,
  "izoh": "Eshik kuzatuvda bo‘lsa, yagona boshqa yo‘l — deraza. Lekin derazadan kirish izi yo‘q, demak qotil xonaga kirmagan. Tomda topilgan qonli tosh va tomda bo‘lgan odam — yuqoridan zarba. Doktor Leydner Luizani derazaga «qo‘rqinchli yuz» bilan chorlab, toshni tushirgan.",
  "qoshimcha": [
   {
    "savol": "Doktor Leydnerning «tomda ishlayotgan edi» degan alibisi aslida nimani anglatardi?",
    "variantlar": [
     "U butunlay aybsizligini isbotladi",
     "Hamma uni tomda ko‘rgani uchun xonaga kira olmagan deb o‘yladi — lekin zarba aynan tomdan berilgan, demak alibi usulga moslashtirilgan edi",
     "U boshqa xonada bo‘lganini ko‘rsatdi",
     "U lagerdan tashqarida bo‘lganini ko‘rsatdi"
    ],
    "javob": 1,
    "izoh": "Alibi «xonaga kirmagan» deydi — lekin qotil xonaga kirmagan ham edi. Alibini tekshirganda, u aynan qaysi imkoniyatni yopishini so‘rash kerak."
   },
   {
    "savol": "Hovlidagi odamlarning guvohligi tergovga qanday yordam berdi?",
    "variantlar": [
     "U qotilni aniqladi",
     "U vaqtni noto‘g‘ri ko‘rsatdi",
     "U eshikni chiqarib tashladi va qidiruvni deraza va tomga yo‘naltirdi",
     "U hech narsa bermadi"
    ],
    "javob": 2,
    "izoh": "«Nima bo‘lmagan» degan guvohlik ham dalil: u imkoniyatlar sonini kamaytiradi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Nildagi o‘lim",
  "yil": 1937,
  "muallif": "Agata Kristi",
  "sarlavha": "Yarador, lekin qotil",
  "hikoya": "Nil daryosidagi kemada boy kelin <em>Linnet</em> uyqusida otib o‘ldirildi. Gumon uning sobiq dugonasi <em>Jakelin</em>ga tushdi, lekin o‘sha paytda Jakelin salonda hammaning ko‘z o‘ngida Linnetning eri <em>Saymon</em>ni oyog‘idan otgan Jakelinni darhol kayutasiga olib ketib, nazorat ostida ushlashdi; Saymon esa yarador oyog‘i bilan yura olmasdi va shifokor kelguncha salonda qisqa vaqt yolg‘iz qoldi. Keyinroq Puaro qizil tirnoq laki shishasini topdi — ichida lak emas, qizil siyoh bor edi; daryodan esa baxmal ro‘molga o‘ralgan to‘pponcha chiqdi.",
  "savol": "Yarador Saymon qanday qilib qotil bo‘lishi mumkin?",
  "variantlar": [
   "Saymon yarador emasdi, lekin Linnetni Jakelin otgan",
   "Linnetni kemaning boshqa yo‘lovchisi otgan, Saymon esa aybsiz",
   "Salondagi otish soxta edi: Jakelin ataylab yonidan otgan, Saymon «qon»ni qizil siyoh bilan ko‘rsatgan; u yolg‘iz qolgan daqiqalarda yugurib borib Linnetni o‘ldirgan, so‘ng qaytib, haqiqatan oyog‘ini otib, to‘pponchani suvga tashlagan",
   "Saymon kayutadan chiqmagan, Linnetni kemaga yashirincha chiqqan begona odam o‘ldirgan"
  ],
  "javob": 2,
  "izoh": "Ikki «mustahkam» alibi — Jakelin hammaning ko‘z oldida, Saymon yarador — bir-birini tasdiqlaydi; bu o‘zaro kelishilgan sahna bo‘lishi mumkin. Qizil siyoh solingan lak shishasi — soxta qon. Baxmal ro‘mol — otish ovozini bo‘g‘ish uchun. Demak, avval yara yo‘q edi; Saymon bo‘sh qolgan daqiqalarda Linnetni o‘ldirib, keyin o‘zini haqiqatan yaralagan. Jakelin va Saymon birga boy kelinning merosini maqsad qilgan edi.",
  "qoshimcha": [
   {
    "savol": "Qizil tirnoq laki shishasida qizil siyoh bo‘lishi nimani ko‘rsatadi?",
    "variantlar": [
     "Linnet bo‘yanishni yoqtirgan",
     "Shishani adashtirib qo‘yishgan",
     "Siyoh xat uchun edi",
     "Saymonning salondagi «qoni» soxta bo‘lgan"
    ],
    "javob": 3,
    "izoh": "Lak shishasida siyoh — g‘ayritabiiy. Bu soxta qon tayyorlanganini ko‘rsatadi."
   },
   {
    "savol": "Baxmal ro‘mol nima uchun ishlatilgan?",
    "variantlar": [
     "Yarani bog‘lash uchun",
     "Otish ovozini bo‘g‘ish va qurolni o‘rab suvga tashlash uchun",
     "Sovuqdan himoya uchun",
     "U tasodifiy buyum"
    ],
    "javob": 1,
    "izoh": "Ovozni yumshatish — boshqa yo‘lovchilar ikkinchi o‘qni eshitmasligi uchun zarur edi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Soqov guvoh",
  "yil": 1937,
  "muallif": "Agata Kristi",
  "sarlavha": "Kecha bo‘yi tashqarida qolgan it",
  "hikoya": "Keksa miss <em>Arundel</em> kechasi zinapoyadan yiqilib tushdi. Zinada uning iti <em>Bob</em>ning to‘pi topildi va hamma: «It to‘pini zinada qoldirgan, bechora xonim unga qoqilgan», dedi. Ammo xizmatkor eslab qoldi: o‘sha kecha Bob uyga qaytmagan, ertalabgacha tashqarida qolgan edi. Puaro esa zinapoyaning yuqori pog‘onasi yonida, devor taxtasiga qoqilgan va lak surtilgan kichkina mixni topdi.",
  "savol": "Bu dalillardan qanday xulosa chiqadi?",
  "variantlar": [
   "To‘pni zinaga it emas, kimdir qo‘ygan; mix esa ip tortib, qoqilish tuzog‘i yasash uchun qoqilgan — bu baxtsiz hodisa emas, suiqasd edi",
   "Bob kechqurun to‘pni zinada qoldirib, keyin tashqariga chiqqan",
   "Xonim zinadan bosh aylanib yiqilgan, to‘p tasodifan u yerda bo‘lgan",
   "Mix eski ta’mirdan qolgan, xizmatkor to‘pni adashib zinada qoldirgan"
  ],
  "javob": 0,
  "izoh": "It kecha bo‘yi tashqarida bo‘lgan — u to‘pni zinaga qo‘ya olmaydi. Demak, to‘pni odam qo‘ygan va «it aybdor» ko‘rinishini yaratgan. Zinaning yuqorisidagi yangi lakli mix — tortilgan ip uchun tayanch: ip va to‘p birga yiqilishni «tabiiy» ko‘rsatadi. Bu suiqasd muvaffaqiyatsiz bo‘lgan, ammo qotil keyinroq xonimni zaharlab o‘ldirgan. «Soqov guvoh» — it bo‘lib chiqdi.",
  "qoshimcha": [
   {
    "savol": "Zinadagi lakli mix nima uchun kerak edi?",
    "variantlar": [
     "Rasm ilish uchun",
     "Gilamni mahkamlash uchun",
     "U eski ta’mirdan qolgan",
     "Ip tortib, qoqilish tuzog‘i yasash uchun"
    ],
    "javob": 3,
    "izoh": "Zinaning eng xavfli joyidagi yangi mix va lak (uni yashirish uchun) — rejalashtirilgan tuzoq."
   },
   {
    "savol": "Agar it o‘sha kecha uyda bo‘lganida, to‘p haqidagi izoh qanday baholanardi?",
    "variantlar": [
     "Baribir imkonsiz bo‘lardi",
     "Ishonchliroq ko‘rinardi — it uni qoldirishi mumkin edi",
     "It aybdor bo‘lardi",
     "Xonim yiqilmasdi"
    ],
    "javob": 1,
    "izoh": "Muhim dalil — imkoniyatni yo‘qqa chiqarish. It tashqarida bo‘lgani uchun «it qoldirgan» degan izoh butunlay yiqildi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Puaroning Rojdestvo bayrami",
  "yil": 1938,
  "muallif": "Agata Kristi",
  "sarlavha": "O‘likning chinqirig‘i",
  "hikoya": "Rojdestvo kechasi boy chol <em>Simeon Li</em>ning xonasidan mebellarning ag‘darilish shovqini va qulog‘ni teshadigan chinqiriq eshitildi. Hamma yugurib keldi: eshik ichkaridan qulflangan, Simeon o‘lik, xona ostin-ustun. O‘sha paytda oila a’zolari va mahalliy politsiya boshlig‘i <em>Sagden</em> pastki qavatda birga edi. Keyinroq Simeonning nabirasi xona polidan pushti rezina bo‘lagi va kichik yog‘och tiqinni topdi — xuddi bolalar o‘ynaydigan, havosi chiqqanda chinqirib ovoz chiqaradigan rezina cho‘chqacha-sharnikiga o‘xshash.",
  "savol": "Chinqiriq va shovqin haqida qaysi xulosa to‘g‘ri?",
  "variantlar": [
   "Simeon aynan chinqirgan paytda o‘ldirilgan, qotil derazadan qochgan",
   "Chinqiriqni Simeonning o‘zi qo‘rqib chiqargan, u yurak xurujidan vafot etgan",
   "Rezina bo‘lagi bolalardan qolgan va voqeaga aloqasi yo‘q",
   "Simeon ancha oldin o‘ldirilgan; chinqiriqni havosi chiqayotgan rezina o‘yinchoq, shovqinni esa arqon bilan ag‘dariladigan qilib qo‘yilgan mebel chiqargan — qotil shu paytda boshqalar bilan birga bo‘lib, alibi yaratgan"
  ],
  "javob": 3,
  "izoh": "Agar chinqiriq paytida hamma pastda bo‘lsa, eng kuchli alibiga ega odamlarni ham tekshirish kerak. Pushti rezina va tiqin — chinqiradigan o‘yinchoq shar qoldiqlari: u havosi chiqib bo‘lgach, mexanizm o‘zi ovoz chiqaradi. Demak, «o‘lim vaqti» soxta, haqiqiy qotillik avvalroq bo‘lgan. Bunday tuzoq qo‘yish uchun xonaga erkin kira oladigan va hech kim shubha qilmaydigan odam kerak — bu Simeonning noqonuniy o‘g‘li bo‘lgan politsiya boshlig‘i Sagden edi.",
  "qoshimcha": [
   {
    "savol": "Topilgan pushti rezina va yog‘och tiqin nima edi?",
    "variantlar": [
     "Havosi chiqqanda chinqiradigan rezina o‘yinchoq-sharning qoldiqlari",
     "Bolaning sharining bo‘lagi, ahamiyatsiz",
     "Shishaning tiqini",
     "Kiyim tugmasi"
    ],
    "javob": 0,
    "izoh": "Kichik, «arzimas» narsa ko‘pincha mexanizmning qismi. U chinqiriqni o‘lgan odamdan emas, o‘yinchoqdan chiqqanini ko‘rsatdi."
   },
   {
    "savol": "Soxta chinqiriq qotilga nima berdi?",
    "variantlar": [
     "U qochishga vaqt topdi",
     "U jasadni yashirdi",
     "U o‘lim vaqtini soxtalashtirib, o‘sha paytda boshqalar bilan birga bo‘lib alibi yaratdi",
     "U eshikni qulfladi"
    ],
    "javob": 2,
    "izoh": "«O‘lim vaqti» alibining asosi. Uni surish — eng mustahkam alibini yaratish usuli."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Qayg‘uli sarv",
  "yil": 1940,
  "muallif": "Agata Kristi",
  "sarlavha": "Tikansiz atirgul",
  "hikoya": "Yosh <em>Meri Jerard</em> morfin zaharidan vafot etdi. Uchala ayol — <em>Elinor</em>, Meri va hamshira <em>Xopkins</em> — Elinor tayyorlagan sendvichlardan birga yeyishgan; choyni esa Xopkins damlagan, uni faqat Meri va Xopkins ichishgan. Elinor qotillikda ayblandi. Puaro hamshira Xopkinsning bilagida kichik sanchiq izini ko‘rdi; Xopkins bu izni bog‘dagi atirgul tikani tirnadi, deb tushuntirdi. Ammo Puaro aniqladi: o‘sha atirgul navi butunlay tikansiz.",
  "savol": "Tikansiz atirgul nimani isbotlaydi?",
  "variantlar": [
   "Xopkins boshqa atirgulga tegib ketgan, bu muhim emas",
   "Iz Merini davolash paytida qolgan",
   "Xopkins morfinga qaram edi",
   "Xopkinsning izohi yolg‘on: bilakdagi iz igna izi — u o‘ziga qustiruvchi dori ukol qilib, ichgan zaharli choyni chiqarib tashlagan"
  ],
  "javob": 3,
  "izoh": "Izohni tekshirish mumkin bo‘lsa — tekshiring. Tikansiz atirgul tikan izini qoldirmaydi, demak, iz boshqa narsadan. Hamshira dori va ukol bilan ishlaydi. U zaharni choyga solgan, o‘zi ham ichib, gumondan chetda qolish uchun keyin qustiruvchi dori bilan uni chiqarib tashlagan.",
  "qoshimcha": [
   {
    "savol": "Sendvichlarni uchala ayol yegan, lekin faqat Meri o‘ldi. Bu nimani ko‘rsatadi?",
    "variantlar": [
     "Zahar sendvichda emas, faqat Meri va Xopkins ichgan choyda bo‘lgan",
     "Meri zaharga sezgir edi",
     "Elinor zaharni faqat bitta sendvichga solgan",
     "Zahar keyinroq berilgan"
    ],
    "javob": 0,
    "izoh": "Umumiy taom hammaga ta’sir qilardi. Faqat qurbon iste’mol qilgan narsa — zahar manbai."
   },
   {
    "savol": "Nega Elinor birinchi gumondor bo‘ldi?",
    "variantlar": [
     "U hamshira edi",
     "U choy damlagan",
     "U sendvichlarni tayyorlagan va Meridan rashk qilishga sababi bor edi",
     "U guvohlik bergan"
    ],
    "javob": 2,
    "izoh": "Imkoniyat va sabab birinchi gumonni uyg‘otadi. Ammo dalillar zahar boshqa narsada ekanini ko‘rsatdi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Quyosh ostidagi yovuzlik",
  "yil": 1941,
  "muallif": "Agata Kristi",
  "sarlavha": "Qoraygan «jasad»",
  "hikoya": "Orolchada go‘zal aktrisa <em>Arlena</em> o‘lik topildi. Soat 11:45 da <em>Patrik Redfern</em> va missis <em>Bryuster</em> qayiqda Pixy ko‘rfaziga borishdi va qumda yuzini yerga qaratib yotgan, qorayib ketgan, oq cho‘milish kostyumi va katta yashil shlyapa kiygan ayolni ko‘rishdi. Patrik unga yaqinlashib, «u o‘lgan» dedi; Bryuster esa jasadga tegmay, yordam chaqirishga ketdi. Patrikning xotini <em>Kristina</em> o‘sha paytda boshqa joyda bo‘lganini aytdi; lekin uning terisi oppoq, quyoshda deyarli qoraymasdi. Puaro esa o‘sha kuni mehmonxona derazasidan kimdir terini qoraytiruvchi bo‘yoq shishasini tashlab yuborganini bilib oldi.",
  "savol": "11:45 da qumda yotgan kim edi?",
  "variantlar": [
   "Arlenaning o‘zi, u allaqachon o‘lgan edi",
   "Qoraytiruvchi bo‘yoq surtib, Arlenaning kiyimini kiygan Kristina: Arlena hali tirik edi va keyinroq, Patrik yolg‘iz qolganda o‘ldirildi",
   "Ko‘rfazga tasodifan kelgan boshqa sayyoh ayol",
   "Mehmonxonadagi xizmatkor ayol, u Arlenaga yordam berayotgan edi"
  ],
  "javob": 1,
  "izoh": "Jasadni faqat Patrik yaqindan «tekshirgan», Bryuster esa uzoqdan ko‘rgan — guvohlik juda zaif. Yuz ko‘rinmagan, faqat kiyim va qoraygan teri tanilgan. Qoraytiruvchi bo‘yoq — «qoraygan» teri soxta bo‘lishi mumkin. Shunday qilib, Kristina o‘lik bo‘lib yotgan, so‘ng tezda qaytib ketib, alibisini mustahkamlagan; Patrik esa yolg‘iz qolib, g‘orda yashiringan Arlenani o‘ldirgan. Ikki kishi o‘lim vaqtini soxtalashtirgan.",
  "qoshimcha": [
   {
    "savol": "Bryusterning guvohligi nima uchun zaif edi?",
    "variantlar": [
     "U ko‘zoynak taqmagan",
     "U yolg‘on gapirgan",
     "U uxlab qolgan",
     "U jasadga yaqinlashmagan va yuzini ko‘rmagan — faqat kiyim va qoraygan teri ko‘rgan"
    ],
    "javob": 3,
    "izoh": "Guvohlik qanchalik yaqin va to‘liq bo‘lsa, shuncha ishonchli. Uzoqdan ko‘rilgan, yuzsiz tana — oson soxtalashtiriladi."
   },
   {
    "savol": "Kristinaning oppoq terisi nega muhim?",
    "variantlar": [
     "U kasal edi",
     "U quyoshda qoraymasdi — «qoraygan jasad» uchun bo‘yoq kerak edi",
     "U shlyapa kiyardi",
     "U kech uyg‘ongan"
    ],
    "javob": 1,
    "izoh": "Agar u tabiiy qoraymasa, qoraygan teri bo‘yoq bilan qilingan. Bo‘yoq shishasi shu ehtimolni tasdiqladi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Beshta cho‘chqacha",
  "yil": 1942,
  "muallif": "Agata Kristi",
  "sarlavha": "Shishadagi barmoq izlari",
  "hikoya": "O‘n olti yil oldin rassom <em>Emyas Kreyl</em> pivoga qo‘shilgan zahardan vafot etgan, xotini <em>Kerolayn</em> esa qotillikda ayblanib, qamoqda vafot etgan edi. Qizi Puarodan haqiqatni topishni so‘radi. Puaro eski ish hujjatlarini o‘qidi: pivo shishasida Emyasning barmoq izlari bor edi, ammo ular tirik odam shishani ushlay olmaydigan g‘alati holatda joylashgan edi. Guvohlar Kerolaynni jasad yonida shishani ro‘mol bilan artayotganini ko‘rishgan. Kerolayn sudda deyarli o‘zini himoya qilmagan.",
  "savol": "Barmoq izlarining g‘alati holati nimani ko‘rsatadi?",
  "variantlar": [
   "Emyas o‘lim oldidan og‘riqdan shishani g‘alati ushlagan",
   "Izlarni Kerolayn o‘lgan erining barmoqlarini shishaga bosib, ataylab qoldirgan: u kimnidir — o‘zi aybdor deb o‘ylagan yaqinini — himoya qilib, o‘z joniga qasddek ko‘rsatmoqchi bo‘lgan; demak, uning o‘zi qotil emas",
   "Kerolayn izlarni o‘chirmoqchi bo‘lgan, chunki u qotil",
   "Shishani politsiya noto‘g‘ri tekshirgan, izlarda ma’no yo‘q"
  ],
  "javob": 1,
  "izoh": "Shishani artib, keyin marhumning barmoqlarini bosish — kimningdir izini yo‘q qilib, o‘z joniga qasd sahnasini yaratish. Qotil odatda o‘zini himoya qiladi, Kerolayn esa sudda indamagan — u kimnidir qutqarishga harakat qilgan. U singlisi Anjela aybdor deb o‘ylagan edi. Demak, Kerolayn aybsiz edi. Haqiqiy qotil — Emyasning muhabbatini yo‘qotishdan qo‘rqqan yosh Elza Grir bo‘lib chiqdi.",
  "qoshimcha": [
   {
    "savol": "Guvohlar Kerolaynni nima qilayotgan holda ko‘rishgan?",
    "variantlar": [
     "Shishaga zahar quyayotgan holda",
     "Shishani ro‘mol bilan artayotgan holda",
     "Shishani sindirayotgan holda",
     "Shishani yashirayotgan holda"
    ],
    "javob": 1,
    "izoh": "Artish — kimningdir izlarini yo‘qotish. Keyin marhumning barmoqlarini bosish — o‘z joniga qasd sahnasini yaratish."
   },
   {
    "savol": "Kerolaynning sudda o‘zini himoya qilmagani nimani ko‘rsatadi?",
    "variantlar": [
     "U aybdor edi",
     "U sud tilini bilmasdi",
     "U kasal edi",
     "U kimnidir himoya qilib, aybni o‘z bo‘yniga olgan"
    ],
    "javob": 3,
    "izoh": "Begunoh odam odatda o‘zini himoya qiladi. Sukut — boshqani himoya qilish istagining belgisi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Missis Makgintining o‘limi",
  "yil": 1952,
  "muallif": "Agata Kristi",
  "sarlavha": "Bir shisha siyoh",
  "hikoya": "Qishloqda uylarni tozalab yurgan keksa ayol <em>missis Makginti</em> o‘z uyida boshiga urilib o‘ldirildi, pol taxtasi ostidagi oz-moz jamg‘armasi yo‘qoldi. Ijarachisi — kambag‘al, odamovi <em>Jeyms Bentli</em> ayblanib, o‘limga hukm qilindi. Puaro bilib oldi: o‘limidan sal oldin Makginti qishloq pochta do‘konidan bir shisha siyoh sotib olgan — vaholanki u deyarli hech qachon xat yozmasdi. Uning narsalari orasida «Sandi Komet» gazetasining bir soni bor edi: unda yillar oldingi mashhur jinoyatlarga aloqador to‘rt ayolning surati va «Ular hozir qayerda?» degan maqola chiqqan edi.",
  "savol": "Siyoh va gazeta birgalikda nimani ko‘rsatadi?",
  "variantlar": [
   "U Bentliga qarshi shikoyat yozmoqchi bo‘lgan",
   "Siyoh pol taxtalarini bo‘yash uchun olingan",
   "Gazeta tasodifan uyda qolgan, siyoh esa ahamiyatsiz",
   "Makginti tozalab yurgan uylaridan birida suratdagi ayollardan birini (yoki uning buyumini) tanib qolgan va bu haqda xat yozmoqchi bo‘lgan — shuning uchun o‘ldirilgan"
  ],
  "javob": 3,
  "izoh": "Odatdan tashqari harakat — dalil: xat yozmaydigan odam siyoh sotib olsa, demak, uning muhim xabari bor. Gazetadagi suratlar shu xabarning mazmunini ko‘rsatadi. Pul olib ketilgani esa qotillikni oddiy o‘g‘rilikka o‘xshatish uchun edi.",
  "qoshimcha": [
   {
    "savol": "Nega yo‘qolgan pul tergovni chalg‘itdi?",
    "variantlar": [
     "Pul juda ko‘p edi",
     "Qotillik oddiy o‘g‘rilikdek ko‘rindi va pulga muhtoj ijarachi gumon ostida qoldi — haqiqiy sabab esa sirni saqlash edi",
     "Pul topildi",
     "Pulni politsiya olgan"
    ],
    "javob": 1,
    "izoh": "Ko‘zga tashlanadigan sabab (pul) haqiqiy sababni (sir) yashirishi mumkin."
   },
   {
    "savol": "Puaro bu ishda qanday usulni qo‘lladi?",
    "variantlar": [
     "Faqat ayblanuvchini so‘roq qildi",
     "Qurbonning so‘nggi kunlaridagi odatdan tashqari har bir kichik harakatini — xaridlarini ham — tekshirdi",
     "Barmoq izlarini qidirdi",
     "Gazeta muharririni tergov qildi"
    ],
    "javob": 1,
    "izoh": "Qurbon o‘ldirilishidan oldin nima qilganini bilish — nima uchun o‘ldirilganini ochadi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Dafn marosimidan keyin",
  "yil": 1953,
  "muallif": "Agata Kristi",
  "sarlavha": "Oynadagi aks",
  "hikoya": "Boy <em>Richard Aberneti</em>ning dafn marosimidan keyin uning singlisi <em>Kora</em> qarindoshlar oldida: «U o‘ldirilgan edi-ku, shunday emasmi?» deb so‘radi. Ertasi kuni Koraning o‘zi o‘ldirildi. Qarindoshlar Korani yigirma yildan beri ko‘rmagan edi. Kelin <em>Xelen</em> esa nimadir g‘alati bo‘lganini his qildi: Kora haqiqatan ham boshini bir yonga qiyshaytirib gapirardi, lekin marosimda boshini «noto‘g‘ri» tomonga — teskari tomonga qiyshaytirgan edi. Koraning yonida yashovchi xizmatchi ayol miss <em>Gilkrist</em> uning odatlarini yaxshi bilardi.",
  "savol": "Boshning teskari tomonga qiyshayishi nimani anglatadi?",
  "variantlar": [
   "Kora qarib, odatini o‘zgartirgan",
   "Xelen adashgan, bu muhim tafsilot emas",
   "Marosimdagi «Kora» aslida uning odatlarini oynaga qarab mashq qilgan boshqa ayol — miss Gilkrist edi: oynadagi aks o‘ng va chapni almashtiradi",
   "Kora o‘sha kuni bo‘ynini shikastlagan edi"
  ],
  "javob": 2,
  "izoh": "Odamni oynaga qarab o‘rgansangiz, uning harakatlarini teskari takrorlaysiz: o‘ngga qiyshayish chapga aylanadi. Qarindoshlar Korani yillar davomida ko‘rmagani niqobni osonlashtirgan. Demak, «U o‘ldirilgan edi-ku» degan gapni Kora emas, uning qiyofasidagi Gilkrist aytgan — tergovni noto‘g‘ri yo‘lga solish uchun. Haqiqiy maqsad esa Korani o‘ldirib, uning qimmatbaho kartinasini olish edi.",
  "qoshimcha": [
   {
    "savol": "Nega qarindoshlar soxta Korani tanimadi?",
    "variantlar": [
     "U niqob kiygan",
     "U boshqa tilda gapirgan",
     "Ular Korani yigirma yildan beri ko‘rmagan edi",
     "Xona qorong‘i edi"
    ],
    "javob": 2,
    "izoh": "Uzoq vaqt ko‘rilmagan odamning tashqi ko‘rinishi o‘zgaradi — taqlidchi buni o‘z foydasiga ishlatdi."
   },
   {
    "savol": "Gilkrist nima uchun «U o‘ldirilgan edi-ku» deb aytdi?",
    "variantlar": [
     "Tergovni noto‘g‘ri yo‘lga — Richardning o‘limi atrofiga burish uchun",
     "U haqiqatni bilardi",
     "U hazillashdi",
     "U Richardni sevardi"
    ],
    "javob": 0,
    "izoh": "Chalg‘ituvchi gap e’tiborni haqiqiy maqsad — Korani o‘ldirish va kartinani olishdan uzoqlashtirdi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Kaptarlar orasidagi mushuk",
  "yil": 1959,
  "muallif": "Agata Kristi",
  "sarlavha": "Tennis raketkasi",
  "hikoya": "Qizlar maktabida kechasi sport zalida jismoniy tarbiya o‘qituvchisi o‘ldirildi. Ilgari Sharqdagi kichik davlatda inqilob bo‘lgan, shahzodaning qimmatbaho toshlari esa izsiz yo‘qolgan edi; shahzodaning do‘sti uchuvchi halok bo‘lishidan oldin o‘z jiyani — shu maktab o‘quvchisi <em>Jenifer</em>ning uyida bo‘lgan. Bir kuni maktabga notanish «xola» kelib, Jeniferga yangi tennis raketkasini berdi va eskisini olib ketmoqchi bo‘ldi. Jeniferning dugonasi <em>Juliya</em> raketka dastasini ochib ko‘rdi.",
  "savol": "Nega kimdir oddiy o‘quvchining tennis raketkasiga shunchalik qiziqdi?",
  "variantlar": [
   "Raketka mashhur sportchiniki bo‘lgan",
   "Raketkada shifrlangan xat bor edi",
   "«Xola» Jeniferni o‘g‘irlamoqchi edi",
   "Uchuvchi yo‘qolgan qimmatbaho toshlarni raketka dastasiga yashirib, jiyani bilan maktabga yuborgan edi"
  ],
  "javob": 3,
  "izoh": "Qimmatli narsani olib o‘tishning eng kam shubhali yo‘li — bolaning oddiy buyumida. Notanish odamning «yangi raketka» evaziga eskisini so‘rashi — eskisi qimmatli ekanini ko‘rsatadi. Juliya dasta ichidan toshlarni topdi va Puaroga olib keldi.",
  "qoshimcha": [
   {
    "savol": "O‘qituvchi nega kechasi sport zalida o‘ldirilgan bo‘lishi mumkin?",
    "variantlar": [
     "U u yerda yashardi",
     "U zalda raketka yoki shkaflarni titkilayotgan odamni ustidan chiqqan",
     "U kimnidir kutayotgan edi",
     "U adashib kirgan"
    ],
    "javob": 1,
    "izoh": "Kechasi zalda bo‘lish — qidiruvning belgisi. Qotilni ko‘rib qolgan guvoh xavfli edi."
   },
   {
    "savol": "«Xola»ning harakati qanday fikrlash xatosiga yo‘l qo‘ydi?",
    "variantlar": [
     "U juda kech keldi",
     "U raketkani sotib olmadi",
     "Eskisini juda qattiq so‘rab, raketkaning qimmatli ekanini fosh qildi",
     "U Juliyaga berdi"
    ],
    "javob": 2,
    "izoh": "Haddan tashqari qiziqish — eng yaxshi dalil. Oddiy narsa uchun bunchalik harakat qilinmaydi."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Xellouin bazmi",
  "yil": 1969,
  "muallif": "Agata Kristi",
  "sarlavha": "Maqtanchoq guvoh",
  "hikoya": "Bolalar bazmida o‘n uch yoshli <em>Joys</em> hammaning oldida: «Men bir marta qotillikni ko‘rganman!» deb maqtandi. Bir necha soatdan keyin u o‘yin uchun suv to‘ldirilgan olma chelagida cho‘ktirib o‘ldirilgan holda topildi. Hamma Joysni tanirdi: u doim qiziqarli bo‘lish uchun yolg‘on hikoyalar to‘qib, maqtanib yurardi. Uning yaqin dugonasi — jim, kuzatuvchan <em>Miranda</em> esa ko‘p narsani ko‘rar, lekin kam gapirardi va Joysga sirlarini aytib yurardi.",
  "savol": "Puaroning eng muhim xulosasi qanday?",
  "variantlar": [
   "Joys qotillikni o‘zi ko‘rmagan, u Mirandaning hikoyasini o‘ziniki qilib aytgan — demak, haqiqiy guvoh Miranda va endi u xavf ostida",
   "Joys yolg‘on gapirgan, demak qotillik umuman bo‘lmagan",
   "Joysni bazmdagi tasodifiy mehmon o‘ldirgan",
   "Joys o‘yin paytida baxtsiz hodisa bilan cho‘kkan"
  ],
  "javob": 0,
  "izoh": "Joysning o‘ldirilishi uning gapiga kimdir ishonganini ko‘rsatadi — demak, qotillik haqiqatan bo‘lgan. Lekin Joys yolg‘onchi edi; haqiqiy guvoh u hikoyani eshitgan odam. Miranda kuzatuvchan va Joysga sir aytardi. Puaro Mirandani qutqarishga shoshildi.",
  "qoshimcha": [
   {
    "savol": "Nega Joys yolg‘onchi bo‘lsa ham o‘ldirildi?",
    "variantlar": [
     "U qotilni tanib qolgan",
     "U bazmda janjal qilgan",
     "Qotil uning gapi rost yoki yolg‘onligini bilmagan va xavf tug‘dirmaslik uchun uni yo‘q qilgan",
     "U boy oiladan edi"
    ],
    "javob": 2,
    "izoh": "Qotil uchun «ehtimol guvoh» ham xavfli. U tekshirib o‘tirmay, guvohni yo‘q qildi."
   },
   {
    "savol": "Bazmdagi qaysi holat qotillikka imkon berdi?",
    "variantlar": [
     "Chiroqlar o‘chirilgan o‘yin paytida hamma e’tibori boshqa tomonda edi",
     "Bazm kechasi tashqarida bo‘ldi",
     "Kattalar yo‘q edi",
     "Joys yolg‘iz uyda qoldi"
    ],
    "javob": 0,
    "izoh": "Ko‘pchilik bir narsaga qarab turgan qorong‘i lahza — e’tibordan chetdagi harakat uchun qulay."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Fillar unutmaydi",
  "yil": 1972,
  "muallif": "Agata Kristi",
  "sarlavha": "To‘rtta parik",
  "hikoya": "Yillar oldin general <em>Reyvenskroft</em> va uning xotini <em>Molli</em> qoya ustida otilgan holda topilgan edi. Puaro eski guvohlardan — «fillar»dan xotiralar yig‘di. Uy bekasi eslardi: Molli to‘rtta parik saqlagan, bir ayol uchun bu juda ko‘p. Shundan keyingi haftalarda Mollining doimiy erkalaydigan iti to‘satdan bekasiga tashlanib, uni tishlagan. Mollining egizak opa-singlisi <em>Doroteya</em> o‘sha paytlarda ular bilan yashagan; o‘limdan bir necha hafta oldin «Doroteya kechasi uyquda yurib, qoyadan yiqilib halok bo‘ldi», deb e’lon qilingan edi.",
  "savol": "Parik va itning tishlashi nimani ko‘rsatadi?",
  "variantlar": [
   "Molli kasal bo‘lib, sochi to‘kilgan va it uni tanimay qolgan",
   "Pariklar sahnaga chiqish uchun kerak edi",
   "It qarib, hammaga tashlana boshlagan",
   "Qoyadan yiqilgan ayol aslida Molli edi; so‘nggi haftalarda «Molli» bo‘lib yurgan esa Doroteya edi — u pariklarni kiyib, egizagining o‘rnini egallagan, it esa bekasi emasligini sezgan"
  ],
  "javob": 3,
  "izoh": "Egizaklarni odamlar adashtiradi, it esa hidni adashtirmaydi. Bir ayolga to‘rt parik — ikki ayol bitta qiyofani saqlashi uchun. Haqiqatda Doroteya Mollini o‘ldirgan, general esa xotinining xotirasini himoya qilib, «Molli» qiyofasidagi Doroteyani va o‘zini otgan edi.",
  "qoshimcha": [
   {
    "savol": "Puaro nega eski guvohlarni «fillar» deb atadi?",
    "variantlar": [
     "Ular katta va kuchli edi",
     "Xalq maqoliga ko‘ra fillar hech narsani unutmaydi — keksa odamlar yillar oldingi tafsilotlarni eslaydi",
     "Ular hayvonot bog‘ida ishlagan",
     "Bu ularning laqabi edi"
    ],
    "javob": 1,
    "izoh": "Eski ishni tiklashda xotira — yagona manba. Puaro har bir guvohdan kichik bo‘laklarni yig‘di."
   },
   {
    "savol": "Bu ishning Sherlok Xolmsning «Itning g‘azabi» ishiga o‘xshashligi nimada?",
    "variantlar": [
     "Ikkalasida ham qotil it",
     "Ikkalasida ham it bekasining o‘rniga boshqa odam kelganini sezgan",
     "Ikkalasida ham poyga bor",
     "Hech qanday o‘xshashlik yo‘q"
    ],
    "javob": 1,
    "izoh": "Hayvonlar niqobni tanimaydi — ular hid bo‘yicha taniydi. Bu ikki xil muallifda ham ishlatilgan klassik dalil."
   }
  ]
 },
 {
  "det": "puaro",
  "kitob": "puaro",
  "asar": "Parda",
  "yil": 1975,
  "muallif": "Agata Kristi",
  "sarlavha": "Hech qachon o‘ldirmagan qotil",
  "hikoya": "Puaroning so‘nggi ishi. U Gastingsga besh xil qotillik haqida aytdi: har birida qotil aniq topilgan, ayblangan yoki o‘zini o‘zi o‘ldirgan, va har gal qotillar turli odamlar edi. Ammo har bir voqea yaqinida bitta odam — Puaro uni «X» deb atadi — bo‘lgan. X hech qachon o‘zi hech kimni o‘ldirmagan. U odamlar bilan suhbatlashib, ularning g‘azabi va rashkiga ohista «moy sepib» turardi. Endi X Gastings bilan bir mehmonxonada yashamoqda.",
  "savol": "X qanday qilib besh qotillik bilan bog‘liq, lekin aybsiz ko‘rinadi?",
  "variantlar": [
   "U har gal boshqa qiyofada o‘zi o‘ldiradi",
   "U qotillarga pul to‘laydi",
   "U shunchaki baxtsiz tasodif bilan har joyda bo‘lgan",
   "U boshqalarni so‘z bilan qotillikka undaydi: odamlarning ichidagi g‘azabni kuchaytirib, ularni o‘zi bilmagan holda qotillikka yetaklaydi"
  ],
  "javob": 3,
  "izoh": "Besh xil qotil, lekin bitta umumiy shaxs — tasodif emas. X qotillikni boshqalar qo‘li bilan qiladi: u psixologik ta’sir ustasi. Hatto Gastings ham uning ta’sirida kimnidir zaharlashga oz qoldi. Qonun bunday odamni jazolay olmasligi Puaroni og‘ir qarorga undadi.",
  "qoshimcha": [
   {
    "savol": "Nega X ni sudga berib bo‘lmasdi?",
    "variantlar": [
     "Uning qilmishi — faqat so‘zlar va ta’sir; buning uchun dalil va qonuniy jazo yo‘q edi",
     "U chet ellik edi",
     "U qochib ketdi",
     "U o‘zini aqldan ozgan deb ko‘rsatdi"
    ],
    "javob": 0,
    "izoh": "Qonun harakatni jazolaydi, so‘z bilan ohista undashni isbotlash deyarli imkonsiz."
   },
   {
    "savol": "Puaro X ni qanday aniqladi?",
    "variantlar": [
     "Uning barmoq izlarini topdi",
     "Uning iqrorini oldi",
     "Besh ishni solishtirib, ularning hammasi atrofida bo‘lgan yagona umumiy odamni topdi",
     "Uni kuzatib, qotillik ustida tutdi"
    ],
    "javob": 2,
    "izoh": "Ko‘p hodisalarni umumiy elementga ko‘ra solishtirish — qonuniyatni topish usuli."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Seshanba oqshomi klubi",
  "yil": 1927,
  "muallif": "Agata Kristi",
  "sarlavha": "Yuzlab va minglab",
  "hikoya": "Seshanba oqshomlari Miss <em>Marpl</em>ning uyida yig‘ilgan do‘stlar navbatma-navbat yechilmagan jinoyatlarni aytib berishardi. Skotland-Yardning sobiq boshlig‘i ser <em>Genri</em> shunday ishni aytdi: savdo vakili <em>Jons</em>, uning xotini va xotinining hamrohi kechki ovqatda konserva qisqichbaqa, non, pishloq va shirinlik (trifl) yeyishdi. Kechasi ularning ahvoli yomonlashdi, missis Jons esa vafot etdi; tekshiruv mishyak topdi. Jonsning siyoh shimdiruvchi qog‘ozida teskari bosilib qolgan xat parchasi o‘qildi: «...xotinimga butunlay qaramman... u o‘lgach, men... yuzlab va minglab...». Hamma buni pul haqida deb tushundi, lekin isbot topilmadi.",
  "savol": "Miss Marpl «yuzlab va minglab» so‘zlarini qanday tushundi?",
  "variantlar": [
   "Bu pul emas — shirinlik ustiga sepiladigan mayda rangli shakar donachalari (inglizcha «hundreds and thousands»); mishyak aynan ularga aralashtirilgan",
   "Merosdagi yuz minglab funt",
   "Xatdagi kunlar hisobi",
   "Jonsning qarzlari"
  ],
  "javob": 0,
  "izoh": "Marpl so‘zning kundalik, oshxonadagi ma’nosini bildi: Angliyada trifl ustiga sepiladigan shakar sepkilar shunday ataladi. Zaharni o‘sha sepkilar bilan faqat kerakli odamga yetkazish mumkin edi. Jons shirinlikni tayyorlagan xizmatkor qizni aldab, uning qo‘li bilan zahar solgan.",
  "qoshimcha": [
   {
    "savol": "Siyoh shimdiruvchi qog‘oz nima uchun dalil bo‘la oldi?",
    "variantlar": [
     "U xatning nusxasi edi",
     "U suvda yuvilmaydi",
     "Ho‘l siyoh unga teskari bosilib qoladi — oynaga tutib, yozilgan xatni o‘qish mumkin",
     "Unga sana yozilgan edi"
    ],
    "javob": 2,
    "izoh": "Xat yuborilgan bo‘lsa ham, uning izi qolishi mumkin — ehtiyotsiz qotil o‘z izini shu tarzda qoldirdi."
   },
   {
    "savol": "Hamma xatni noto‘g‘ri tushunishining sababi nimada edi?",
    "variantlar": [
     "Ular «qotillik sababi — pul» degan tayyor fikr bilan o‘qishdi va so‘zning boshqa ma’nosini ko‘rishmadi",
     "Xat chet tilida edi",
     "Xat yirtilgan edi",
     "Xatni Jons yozmagan"
    ],
    "javob": 0,
    "izoh": "Oldindan tayyor xulosa — eng xavfli tuzoq. Marpl esa so‘zlarni oddiy hayotiy ma’nosida o‘qidi."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Ko‘k pelargoniya",
  "yil": 1929,
  "muallif": "Agata Kristi",
  "sarlavha": "Ko‘karib ketgan gul",
  "hikoya": "Doimiy betob, injiq <em>missis Pritchard</em>ga folbin ayol shunday dedi: «Ko‘k navro‘zgul — ogohlantirish, ko‘k gulxayri — xavf, ko‘k pelargoniya — o‘lim». Bir oy o‘tib, uning yotoqxonasidagi devor qog‘ozida pushti gullardan biri kechasi ko‘karib qoldi; keyingi safar boshqa gul ham ko‘kardi. Oxiri bir kuni ertalab missis Pritchard o‘lik topildi — devordagi pelargoniya ko‘k rangda edi, yonida esa doim hidlab yuradigan hidlash tuzi (ammiak) shishachasi bor edi. Uni boqib yurgan hamshira <em>Kopling</em> hamma narsani birinchi bo‘lib ko‘rardi.",
  "savol": "Gullar nega ko‘karib ketdi?",
  "variantlar": [
   "Bu haqiqatan ham g‘ayritabiiy hodisa edi",
   "Quyosh nuri bo‘yoqni o‘zgartirgan",
   "Devor qog‘ozi namdan rangini o‘zgartirgan",
   "Devordagi gul o‘rniga pushti lakmus qog‘ozidan qirqilgan gul yopishtirilgan — ammiak (ishqor) bug‘i lakmusni ko‘k qilgan; «bashorat» sun’iy amalga oshirilgan"
  ],
  "javob": 3,
  "izoh": "G‘ayritabiiy izohdan oldin kimyoviy izohni sinab ko‘rish kerak. Lakmus kislotada qizaradi, ishqorda ko‘karadi; ammiak — ishqor. Hidlash tuzi bilan doim yonida yurgan odam — hamshira — buni osongina qila olardi. «Bashorat» esa qotillikni taqdir yoki la’nat ishiga o‘xshatish uchun kerak edi.",
  "qoshimcha": [
   {
    "savol": "Lakmus qog‘ozi ishqoriy muhitda qanday rangga kiradi?",
    "variantlar": [
     "Qizil",
     "Ko‘k",
     "Sariq",
     "Rangsiz bo‘ladi"
    ],
    "javob": 1,
    "izoh": "Kimyo darsidan: lakmus kislotada qizil, ishqorda ko‘k. Ammiak eritmasi — ishqor."
   },
   {
    "savol": "Folbinning «bashorati» qotilga nima uchun kerak edi?",
    "variantlar": [
     "Missis Pritchardni davolash uchun",
     "O‘limni g‘ayritabiiy kuchga yuklab, haqiqiy sabab va qotildan e’tiborni chalg‘itish uchun",
     "Pul topish uchun",
     "Bu tasodifiy ogohlantirish edi"
    ],
    "javob": 1,
    "izoh": "Odamlar sirli belgilarga ishonsa, mantiqiy tekshiruvni unutadi — qotil shunga tayangan."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Ruhoniy uyidagi qotillik",
  "yil": 1930,
  "muallif": "Agata Kristi",
  "sarlavha": "Juda qulay soat",
  "hikoya": "Polkovnik <em>Proteroy</em> ruhoniy uyining kabinetida otib o‘ldirildi. Stolda ag‘darilgan soat 6:22 ni ko‘rsatib to‘xtab qolgan, yonida esa polkovnikning qo‘li bilan yozilgan, tepasiga «6:20» deb qo‘yilgan tugallanmagan xat bor edi. Ruhoniy esa bu soat doim 15 daqiqa oldinda yurishini bilardi. Miss <em>Marpl</em>: «Bunchalik aniq dalillar menga yoqmaydi», dedi.",
  "savol": "Miss Marpl nimadan shubhalandi?",
  "variantlar": [
   "Polkovnik 6:20 da xat yozib, 6:22 da otilgan — hammasi aniq",
   "Soat va xatdagi vaqt ataylab qoldirilgan: ular qotilga kerakli o‘lim vaqtini «isbotlash» — alibi yaratish uchun sahnalashtirilgan",
   "Soat tasodifan ag‘darilgan, unda hech qanday ma’no yo‘q",
   "Xatni ruhoniy yozgan, chunki u soatning noto‘g‘riligini bilardi"
  ],
  "javob": 1,
  "izoh": "Haqiqiy jinoyatda vaqtni ikki tomondan bunchalik aniq «tasdiqlaydigan» dalillar kam uchraydi. Ag‘darilgan soat — klassik tuzoq; xat tepasidagi vaqt — g‘alati, odatdagi xatda soat yozilmaydi. Bunday dalillar kimgadir aynan o‘sha vaqtda boshqa joyda bo‘lganini ko‘rsatish uchun kerak. Haqiqiy o‘lim vaqti boshqacha edi va qotillar shu soxta vaqt atrofida alibilarini qurgan.",
  "qoshimcha": [
   {
    "savol": "Xat tepasiga «6:20» yozilgani nega g‘alati?",
    "variantlar": [
     "Oddiy xatlarda soat yozilmaydi — bu vaqtni ataylab «isbotlash» uchun qo‘shilgan",
     "Polkovnik doim soat yozardi",
     "Bu sana edi",
     "Xat rasmiy edi"
    ],
    "javob": 0,
    "izoh": "Odatdan tashqari tafsilot — kimdir uni muhim deb bilgan. Vaqtni haddan tashqari aniq ko‘rsatish shubha uyg‘otadi."
   },
   {
    "savol": "Soat doim 15 daqiqa oldinda yurishi nimani o‘zgartiradi?",
    "variantlar": [
     "Hech narsani",
     "Qotil kech qolgan",
     "Soat ko‘rsatgan 6:22 haqiqiy vaqt emas — dalil bir-biriga zid",
     "Soat to‘xtamagan"
    ],
    "javob": 2,
    "izoh": "Agar soat oldinda yursa, u ko‘rsatgan vaqt va xatdagi vaqt mos kelmaydi — ikkalasi ham ishonchsiz."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Kutubxonadagi jasad",
  "yil": 1942,
  "muallif": "Agata Kristi",
  "sarlavha": "Tishlangan tirnoqlar",
  "hikoya": "Polkovnik <em>Bentri</em>ning kutubxonasida notanish yosh qizning jasadi topildi. Uni yaqin atrofdagi mehmonxonada raqqosa bo‘lib ishlagan <em>Rubi Kin</em> deb tanishdi. Ammo miss <em>Marpl</em> ikki tafsilotga e’tibor qaratdi: jasadning tirnoqlari tishlab tashlangan, Rubi esa uzun, chiroyli bo‘yalgan tirnoqlari bilan mashhur edi; jasaddagi ko‘ylak eski bo‘lib, sevgilisi bilan uchrashuvga borayotgan qiz kiyadigan ko‘ylak emas edi. Bu orada yaqin qishloqdan <em>Pamela Rivz</em> ismli qiz bedarak yo‘qolgani xabar qilindi.",
  "savol": "Miss Marpl qanday xulosaga keldi?",
  "variantlar": [
   "Jasad Rubi, u o‘lim oldidan tirnoqlarini tishlagan",
   "Jasad Rubi, kiyimni qotil almashtirgan",
   "Jasadni Bentrining o‘zi kutubxonaga olib kelgan",
   "Jasad Rubi emas: tirnoqlari va ko‘ylagi mos kelmaydi — bu Pamela Rivz; jasadlar almashtirilgan va o‘lim vaqti hamda joyi soxtalashtirilgan"
  ],
  "javob": 3,
  "izoh": "Uzun bo‘yalgan tirnoqlar bir kechada tishlangan holga kelmaydi; tirnoq tishlash — yillik odat. Uchrashuvga boradigan qiz eng yaxshi ko‘ylagini kiyadi. Demak, jasadni Rubi deb aniqlash xato yoki ataylab qilingan. Bu almashtirish qotillarga Rubi o‘lgan vaqtni soxtalashtirib, alibi yaratish imkonini bergan. Tanib berganlarning o‘zi rejaning ishtirokchisi edi.",
  "qoshimcha": [
   {
    "savol": "Nima uchun eski ko‘ylak muhim?",
    "variantlar": [
     "Rubi eski kiyimni yoqtirardi",
     "Uchrashuvga borayotgan qiz eng yaxshi ko‘ylagini kiyadi — eski ko‘ylak Rubiga mos emas",
     "Ko‘ylak qimmat edi",
     "U kutubxonaga tegishli"
    ],
    "javob": 1,
    "izoh": "Insonning xatti-harakati haqidagi oddiy bilim dalilga aylanadi: bayram uchrashuviga eski kiyimda borilmaydi."
   },
   {
    "savol": "Jasadlarni almashtirish qotillarga nima berdi?",
    "variantlar": [
     "Jasadni yashirish imkonini",
     "Merosni olish imkonini",
     "Politsiyani qo‘rqitish imkonini",
     "O‘lim vaqtini soxtalashtirib, o‘zlariga alibi yaratish imkonini"
    ],
    "javob": 3,
    "izoh": "Kim, qachon va qayerda o‘lgani almashtirilsa, alibilar ham o‘zgaradi."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Harakatlanuvchi barmoq",
  "yil": 1943,
  "muallif": "Agata Kristi",
  "sarlavha": "Pochtasiz kelgan xat",
  "hikoya": "Kichik shaharchada odamlar imzosiz, haqoratli xatlar ola boshladi: manzil eski yozuv mashinkasida terilgan, matn esa kitob sahifalaridan qirqib olingan so‘zlardan yopishtirilgan. Bunday xat olgan missis <em>Simington</em> sianid ichib, o‘z joniga qasd qildi. Uning xizmatkori <em>Agnes</em> o‘sha kuni tushdan keyin pochtachi umuman kelmaganini sezib qoldi, lekin buni kimgadir aytishga ulgurmay o‘ldirildi. Miss <em>Marpl</em>: «Bu xatlarning hammasi bitta maqsad uchun yozilgan», dedi.",
  "savol": "Agnes sezib qolgan narsa nimani bildiradi?",
  "variantlar": [
   "Pochtachi xatni boshqa kuni olib kelgan",
   "Xatni qo‘shni qiz yozgan",
   "Agnes adashgan, bu ahamiyatsiz",
   "Xat missis Simingtonga pochta orqali emas, uydagi odam tomonidan qo‘yilgan — xatlar seriyasi uning «o‘z joniga qasdini» tushuntirish uchun niqob bo‘lgan"
  ],
  "javob": 3,
  "izoh": "Pochtachi kelmagan bo‘lsa, xat boshqa yo‘l bilan — uydagi odam qo‘li bilan qo‘yilgan. Imzosiz xatlar butun shaharda «xat sabab o‘z joniga qasd» degan muhit yaratdi. Aslida maqsad bitta qotillik edi: eri — janob Simington — xotinidan qutulib, boshqa ayolga uylanmoqchi edi.",
  "qoshimcha": [
   {
    "savol": "Matnni kitobdan qirqilgan so‘zlar bilan tuzish nimaga kerak edi?",
    "variantlar": [
     "Qo‘lyozmani yashirish uchun — muallifni yozuvdan tanib bo‘lmasin",
     "Bu arzonroq edi",
     "Muallif yozishni bilmasdi",
     "Bu chiroyliroq edi"
    ],
    "javob": 0,
    "izoh": "Qirqilgan so‘zlar shaxsiy belgisiz — bosma harflar kabi tanilishdan himoya qiladi."
   },
   {
    "savol": "Bu ish ABC qotilliklariga qaysi jihatdan o‘xshaydi?",
    "variantlar": [
     "Ikkalasida ham poyezd bor",
     "Ikkalasida ham qotil — shifokor",
     "Ikkalasida ham ko‘p hodisalar seriyasi bitta haqiqiy maqsadni yashirish uchun yaratilgan",
     "O‘xshashlik yo‘q"
    ],
    "javob": 2,
    "izoh": "«Bargni o‘rmonga yashirish» — ko‘p o‘xshash hodisalar ichida bitta muhimini yashirish."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Qotillik e’lon qilindi",
  "yil": 1950,
  "muallif": "Agata Kristi",
  "sarlavha": "Moylangan eshik",
  "hikoya": "Qishloq gazetasida g‘alati e’lon chiqdi: «Juma kuni soat 18:30 da Kichik Peddoks uyida qotillik bo‘ladi». Qo‘shnilar qiziqib, o‘sha vaqtda uyga yig‘ilishdi. Soat 18:30 da chiroqlar o‘chdi, eshikdan fonar bilan niqobli odam kirdi, o‘q ovozlari yangradi — keyin u o‘zi o‘lik topildi, uy bekasi <em>Letisiya Blekkok</em>ning qulog‘i esa o‘q tegib, yaralangan edi. Miss <em>Marpl</em> xonaning ikkinchi eshigiga e’tibor berdi: hamma bu eshik hech qachon ishlatilmaydi, deb aytardi, lekin uning ilgaklari yangi moylangan edi.",
  "savol": "Moylangan eshik nimani ko‘rsatadi?",
  "variantlar": [
   "Eshikni xizmatkor shunchaki moylagan",
   "Niqobli odam shu eshikdan kirgan",
   "Eshik orqali faqat yorug‘lik kirgan",
   "Qorong‘ida kimdir bu eshikdan ovozsiz chiqib, niqobli odamning orqasiga o‘tgan — otishmani xonadagilardan biri qilgan"
  ],
  "javob": 3,
  "izoh": "«Hech qachon ishlatilmaydigan» eshik moylangan bo‘lsa, demak, uni yaqinda ishlatishga tayyorlashgan va ovozsiz ochilishi kerak edi. Chiroqlar o‘chgan qorong‘i lahzada xonadagi odam shu yo‘l bilan niqobli odamning orqasiga o‘tib, uni otgan. Xonadagilar esa niqobli odamni o‘zi o‘z joniga qasd qilgan yoki qurolini xato otgan deb o‘ylashgan.",
  "qoshimcha": [
   {
    "savol": "E’lonni gazetada berish qotilga nima berdi?",
    "variantlar": [
     "U shuhrat qozondi",
     "Ko‘plab guvohlar «niqobli bosqinchi»ni ko‘rib, voqeani shunday tasvirlashdi — haqiqiy qotil esa ular orasida qoldi",
     "Politsiya oldindan keldi",
     "U pul ishladi"
    ],
    "javob": 1,
    "izoh": "Guvohlar qanchalik ko‘p bo‘lsa, «rasmiy» versiya shuncha ishonchli ko‘rinadi — ayniqsa ular sahnani ko‘rgan deb o‘ylashsa."
   },
   {
    "savol": "Qulog‘i yaralangan uy bekasi nega gumondan chetda qoldi?",
    "variantlar": [
     "U uyda yo‘q edi",
     "Hamma uni bosqinchining nishoni deb hisobladi",
     "U qurolni bilmasdi",
     "U politsiyani chaqirgan"
    ],
    "javob": 1,
    "izoh": "«Qurbon» qiyofasi — eng kuchli niqob. Puaroning «Chekka uydagi xavf» ishida ham xuddi shu usul bor."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Cho‘ntak to‘la javdar",
  "yil": 1953,
  "muallif": "Agata Kristi",
  "sarlavha": "Nonushtadagi murabbo",
  "hikoya": "Boy savdogar <em>Reks Fortesk‘yu</em> idorasida choy ichayotib, to‘satdan og‘ir ahvolga tushdi va vafot etdi. Tekshiruv uning zaharlanganini ko‘rsatdi: zahar — qorag‘ay (tis) daraxtidan olinadigan taksin, u bir necha soatdan keyin ta’sir qiladi. Uning cho‘ntagidan javdar donlari topildi. Keyin uyda xizmatkor qiz <em>Gledis</em> bog‘da, burniga kir qisqich qisilgan holda o‘lik topildi. Miss <em>Marpl</em> bolalar qo‘shig‘ini esladi: «Cho‘ntak to‘la javdar... xizmatkor qiz bog‘da kir yoyar, qora qush kelib, burnini cho‘qib ketdi».",
  "savol": "Zahar qachon va qanday berilgan?",
  "variantlar": [
   "Ertalab uyda nonushtada — yangi ochilgan murabbo bankasiga qo‘shilgan: taksin sekin ta’sir qilgani uchun u idorada o‘ldi",
   "Idorada choyga solingan",
   "Cho‘ntakdagi javdar donlari zaharli edi",
   "Kechki ovqatda berilgan"
  ],
  "javob": 0,
  "izoh": "Zaharning ta’sir qilish vaqti uning qachon berilganini ko‘rsatadi: taksin bir necha soat kechikib ta’sir qiladi — demak, choy emas, ertalabki taom. Murabbo bankasi faqat Reks uchun ochilgan edi. Javdar va kir qisqich esa qo‘shiqni takrorlab, tergovni «aqldan ozgan qotil» izidan yuborish uchun qo‘yilgan.",
  "qoshimcha": [
   {
    "savol": "Javdar va kir qisqich nima maqsadda qoldirilgan?",
    "variantlar": [
     "Ular tasodifiy narsalar",
     "Ular qotilning imzosi",
     "Bolalar qo‘shig‘ini eslatib, qotilliklarni «aqldan ozgan qotil» ishi qilib ko‘rsatish uchun",
     "Ular xizmatkorning buyumlari"
    ],
    "javob": 2,
    "izoh": "Qo‘shiq bo‘yicha «sahna» yaratish — haqiqiy, hisob-kitobli sababni yashirish usuli."
   },
   {
    "savol": "Nega xizmatkor Gledis o‘ldirildi?",
    "variantlar": [
     "U qotilga bilmasdan yordam bergan va uni fosh qilishi mumkin edi",
     "U pul o‘g‘irlagan",
     "U qo‘shiqni bilardi",
     "U uydan ketmoqchi edi"
    ],
    "javob": 0,
    "izoh": "Bilmagan holda ishtirok etgan sherik — qotil uchun xavfli guvoh. U yo‘q qilindi."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Paddingtondan 16:50 poyezdi",
  "yil": 1957,
  "muallif": "Agata Kristi",
  "sarlavha": "Yonma-yon poyezd",
  "hikoya": "Missis <em>Makgilikaddi</em> poyezdda ketayotib, yonma-yon ketayotgan boshqa poyezd derazasidan bir erkakning ayolni bo‘g‘ib o‘ldirayotganini ko‘rdi; erkak unga orqasi bilan turgan edi. Politsiya poyezdni tekshirdi — hech qanday jasad topilmadi va hech kim ishonmadi. Miss <em>Marpl</em> xaritani o‘rgandi: yo‘l bir joyda keskin burilib, baland ko‘tarma ustidan o‘tadi; burilishda poyezd sekinlashib, qiyshayadi; ko‘tarma ostida esa katta Rezerford-Xoll mulki joylashgan.",
  "savol": "Miss Marplning xulosasi qanday?",
  "variantlar": [
   "Guvoh tush ko‘rgan",
   "Jasad keyingi bekatda olib tushilgan",
   "Ayol tirik qolib, poyezddan tushib ketgan",
   "Qotil jasadni burilishda — poyezd sekinlashgan joyda — ko‘tarmadan Rezerford-Xoll yeriga tashlagan va keyin uni o‘sha mulkda yashirgan"
  ],
  "javob": 3,
  "izoh": "Jasad poyezdda yo‘q — demak, u yo‘lda tashlangan. Qayerda? Tashlash uchun qulay joy — poyezd sekinlashib qiyshayadigan burilish, ostida esa xilvat mulk. Marpl yosh uy bekasi Lyusini Rezerford-Xollga xizmatkor qilib joylashtirdi; Lyusi jasadni omborxonadagi qadimiy tobutdan topdi.",
  "qoshimcha": [
   {
    "savol": "Nega guvoh qotilni tanib berolmadi?",
    "variantlar": [
     "U ko‘zoynaksiz edi",
     "U qotilni faqat orqadan ko‘rgan — yuzini ko‘rmagan",
     "Qotil niqob kiygan",
     "Guvoh uxlab qolgan"
    ],
    "javob": 1,
    "izoh": "Guvohlikning cheklovini bilish muhim: orqadan ko‘rilgan odam haqida faqat umumiy belgilar aytish mumkin."
   },
   {
    "savol": "Miss Marpl nima uchun Lyusini mulkka xizmatkor qilib yubordi?",
    "variantlar": [
     "Lyusiga ish kerak edi",
     "Oilani himoya qilish uchun",
     "Mulkni shubha uyg‘otmasdan bemalol qidirish uchun",
     "Politsiyaga yordam bermaslik uchun"
    ],
    "javob": 2,
    "izoh": "Uy xizmatchisi hamma joyga kira oladi va hech kim unga e’tibor bermaydi — ideal qidiruvchi."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Yorilgan oyna",
  "yil": 1962,
  "muallif": "Agata Kristi",
  "sarlavha": "Muzlab qolgan nigoh",
  "hikoya": "Kino yulduzi <em>Marina Gregg</em>ning uyidagi bayramda ishtiyoqli muxlis <em>Xezer Badkok</em> Marinaga yillar oldingi uchrashuvini zavq bilan aytib berdi: o‘shanda u qizilcha bilan kasal edi, lekin sevimli aktrisasidan dastxat olish uchun yotgan joyidan turib, uning oldiga borgan ekan. Atrofdagilar shu payt Marinaning yuzida g‘alati, muzlab qolgan nigohni ko‘rishdi. Bir necha daqiqadan keyin Xezer kokteyl ichib, zaharlanib vafot etdi: Xezer o‘z stakanini to‘kib yuborganida, Marina unga o‘z kokteylini bergan edi. Marinaning yagona farzandi homiladorlik paytida onasi yuqtirgan qizilcha sabab og‘ir kasal bo‘lib tug‘ilgan.",
  "savol": "Marinaning muzlab qolgan nigohi nimani anglatardi?",
  "variantlar": [
   "U o‘ziga suiqasd qilinishidan qo‘rqqan",
   "U Xezerni eski dushmani deb tanigan",
   "U bir ko‘rinishni eslab, shunchaki charchagan",
   "U aynan shu ayol yillar oldin unga qizilcha yuqtirib, farzandining baxtsizligiga sabab bo‘lganini anglagan — keyin Xezerni o‘zi zaharlagan"
  ],
  "javob": 3,
  "izoh": "Hamma Marinani nishon, Xezerni tasodifiy qurbon deb o‘yladi, chunki zaharli kokteyl Marinaniki edi. Marpl teskari qaradi: Xezerning hikoyasi va Marinaning nigohi bir lahzaga to‘g‘ri keladi. Homiladorlikdagi qizilcha bolaga jiddiy zarar yetkazadi — Marina o‘z fojiasining sababchisini ko‘rdi.",
  "qoshimcha": [
   {
    "savol": "Nega hamma Marinani qotillik nishoni deb o‘yladi?",
    "variantlar": [
     "Marinaning dushmanlari ko‘p edi",
     "Zaharli kokteyl dastlab Marinaniki edi",
     "Xezer Marinaga o‘xshardi",
     "Marina shunday dedi"
    ],
    "javob": 1,
    "izoh": "Kim qaysi qadahni ichgani — muhim. Lekin qadah «tasodifan» almashgan bo‘lsa, kim almashtirganini so‘rash kerak."
   },
   {
    "savol": "Xezerning hikoyasi qaysi tibbiy faktga tayanadi?",
    "variantlar": [
     "Qizilcha kattalarda xavfsiz",
     "Homiladorlik paytida qizilcha yuqsa, bola og‘ir kasal tug‘ilishi mumkin",
     "Qizilcha faqat bolalarda bo‘ladi",
     "Qizilcha yuqmaydi"
    ],
    "javob": 1,
    "izoh": "Xezer o‘zi bilmasdan katta fojiaga sabab bo‘lgan. Uning beg‘ubor hikoyasi qotillikka turtki bo‘ldi."
   }
  ]
 },
 {
  "det": "marpl",
  "kitob": "marpl",
  "asar": "Uxlab yotgan qotillik",
  "yil": 1976,
  "muallif": "Agata Kristi",
  "sarlavha": "Devor qog‘ozi xotirasi",
  "hikoya": "Yosh kelinchak <em>Gvenda</em> dengiz bo‘yidagi shaharchadan eski uy sotib oldi va g‘alati narsalarni sezdi: u hech qachon ko‘rmagan bolalar xonasining devor qog‘ozini aniq «eslardi», shkafni ochganda esa bo‘yoq ostidan aynan o‘sha naqshli qog‘oz chiqdi. Teatrda bir pyesadagi «Yuzini yoping; ko‘zlarim qamashadi; u yosh o‘ldi» degan so‘zlarni eshitganda, Gvenda dahshat ichida qichqirib yubordi: u zinapoya oldida o‘lik ayolni va bu so‘zlarni aytayotgan odamni ko‘rganini esladi. U Yangi Zelandiyada qarindoshlari qo‘lida o‘sgan va Angliyaga birinchi marta kelgan deb o‘ylardi.",
  "savol": "Miss Marplning tushuntirishi qanday?",
  "variantlar": [
   "Gvenda folbinlik qobiliyatiga ega",
   "Uyda arvoh bor",
   "Gvenda bu uyni avval suratda ko‘rgan",
   "Gvenda juda kichkinaligida aynan shu uyda yashagan va qotillikni ko‘rgan — xotira yillar davomida «uxlab yotgan» va uy uni uyg‘otgan"
  ],
  "javob": 3,
  "izoh": "G‘ayritabiiy izohlarni chetga surib, oddiy izoh qidiriladi: bolalikdagi xotira. Faqat ichkarida yashagan odam bo‘yoq ostidagi qog‘ozni bila oladi. Pyesadagi so‘zlar xotirani uyg‘otgan, chunki qotil ularni jasad ustida aytgan edi. Marpl ehtiyot bo‘lishni maslahat berdi: uxlab yotgan qotillik qotilni ham uyg‘otadi.",
  "qoshimcha": [
   {
    "savol": "Bo‘yoq ostidan chiqqan devor qog‘ozi nimani isbotladi?",
    "variantlar": [
     "Gvendaning «tasavvuri» haqiqiy xotira — u bu xonani ko‘rgan",
     "Uy juda eski",
     "Devor qog‘ozi zamonaviy",
     "Bu tasodifiy moslik"
    ],
    "javob": 0,
    "izoh": "Tekshirib bo‘ladigan xotira — eng kuchli dalil. Bo‘yoq ostidagi naqsh uning bolaligini tasdiqladi."
   },
   {
    "savol": "Nega pyesadagi so‘zlar Gvendaga shunchalik kuchli ta’sir qildi?",
    "variantlar": [
     "U pyesani yoqtirmagan",
     "U teatrda qo‘rqib ketgan",
     "Qotil o‘shanda jasad ustida aynan shu so‘zlarni aytgan — ular xotirani uyg‘otgan",
     "U aktrisani tanigan"
    ],
    "javob": 2,
    "izoh": "Kuchli his-hayajon bilan bog‘liq so‘zlar xotirani to‘satdan qaytaradi."
   }
  ]
 },
 {
  "det": "dyupen",
  "kitob": "dyupen",
  "asar": "Morg ko‘chasidagi qotillik",
  "yil": 1841,
  "muallif": "Edgar Allan Po",
  "sarlavha": "Hech kim tushunmagan ovoz",
  "hikoya": "Parijdagi uyda ona va qiz dahshatli tarzda o‘ldirildi: xona ichkaridan yopilgan, kuch ishlatilishi g‘ayritabiiy darajada. Qo‘shnilar ichkaridan ikki ovoz eshitishgan: biri — fransuzcha gapirgan erkak, ikkinchisi — g‘alati, qichqiriqli ovoz. Guvohlar ikkinchi ovoz haqida har xil gapirdi: fransuz uni ispancha, gollandiyalik — fransuzcha, ingliz — nemischa, ispan — inglizcha, italyan — ruscha deb o‘yladi; hech biri o‘sha tilni bilmasdi va hech kim bitta ham so‘zni ajrata olmadi. Ogyust <em>Dyupen</em> jasad qo‘lidan odamnikiga o‘xshamaydigan jun topdi.",
  "savol": "Ikkinchi ovoz haqida Dyupenning xulosasi qanday?",
  "variantlar": [
   "Bu ko‘p tilni biladigan xorijlik jinoyatchi",
   "Bu inson ovozi emas: har bir guvoh uni o‘zi bilmaydigan tilga nisbat bergan va hech kim so‘z ajrata olmagan — bu kuchli hayvon, katta maymun (orangutan) edi",
   "Bu bir nechta odam, har biri o‘z tilida gapirgan",
   "Guvohlar qo‘rqib, aqldan ozgan odamni eshitishgan"
  ],
  "javob": 1,
  "izoh": "Har bir guvoh ovozni o‘zi bilmaydigan tilga nisbat bergani — ovozda tanish nutq yo‘qligini ko‘rsatadi. Bitta ham so‘z ajratilmagan. G‘ayritabiiy kuch, chaqqonlik (derazadan kirish-chiqish) va odamnikiga o‘xshamaydigan jun bilan birga, bu hayvonga ishora qiladi. Dyupen dengizchining qochgan orangutanini topdi. Bu — tarixdagi birinchi detektiv hikoyalardan biri.",
  "qoshimcha": [
   {
    "savol": "Guvohlarning hech biri ovozni o‘z tili deb aytmagani nimani bildiradi?",
    "variantlar": [
     "Hamma guvohlar yolg‘on gapirgan",
     "Qotil ko‘p tilni bilgan",
     "Guvohlar kar edi",
     "Ovozda tanish nutq yo‘q edi — u inson tiliga o‘xshamagan"
    ],
    "javob": 3,
    "izoh": "Har kim tushunmagan narsani «chet til» deb o‘ylaydi. Hech kim o‘z tilida eshitmagani — nutq yo‘qligining belgisi."
   },
   {
    "savol": "Qaysi dalil ovoz egasi hayvon ekanini tasdiqladi?",
    "variantlar": [
     "Ochiq eshik",
     "Jasad qo‘lidan topilgan, odamnikiga o‘xshamaydigan jun",
     "Pul solingan sumka",
     "Qo‘shnilarning gapi"
    ],
    "javob": 1,
    "izoh": "Moddiy dalil (jun) taxminni (ovoz) tasdiqladi. Ikki mustaqil dalil bir xulosaga olib keldi."
   }
  ]
 },
 {
  "det": "dyupen",
  "kitob": "dyupen",
  "asar": "Oltin qo‘ng‘iz",
  "yil": 1843,
  "muallif": "Edgar Allan Po",
  "sarlavha": "Qaroqchi shifri",
  "hikoya": "<em>Uilyam Legran</em> pergament parchasida qaroqchi kapitan Kiddning yashirin xazinasi haqidagi shifrlangan yozuvni topdi. Yozuv raqamlar va belgilardan iborat edi, so‘zlar orasida bo‘sh joy yo‘q. Legran mulohaza qildi: kapitan ingliz edi, demak, matn ingliz tilida. Belgilarni sanab chiqqanda, eng ko‘p uchragan belgi «8» bo‘ldi. Ingliz tilida eng ko‘p ishlatiladigan harf — <em>E</em>, eng ko‘p ishlatiladigan so‘z esa «the».",
  "savol": "Legran shifrni yechishni qanday davom ettirdi?",
  "variantlar": [
   "«8» ni E deb oldi, so‘ng matndan oxiri «8» bilan tugaydigan, tez-tez takrorlanadigan uch belgili birikmani qidirib, uni «the» deb topdi va harflarni birin-ketin ochdi",
   "Har bir belgini alifboda bitta oldinga surib o‘qidi",
   "Belgilarni teskari tartibda o‘qib chiqdi",
   "Shifr kalitini pergamentni olovga tutib topdi va qolganini taxmin qildi"
  ],
  "javob": 0,
  "izoh": "Bu — chastota tahlili, Holmesning «Raqsga tushayotgan odamchalar»idan ancha oldin yozilgan. Eng ko‘p uchraydigan belgi — eng ko‘p uchraydigan harf. Keyingi qadam — eng ko‘p uchraydigan so‘z: «the» uch harfli va E bilan tugaydi. Har bir yangi topilgan harf boshqa so‘zlarni ochadi. Pergamentdagi yashirin yozuv esa, darhaqiqat, olov issig‘ida paydo bo‘lgan edi — lekin shifrni yechish faqat mantiq bilan amalga oshdi.",
  "qoshimcha": [
   {
    "savol": "Nega Legran matn ingliz tilida deb hisobladi?",
    "variantlar": [
     "Matnda inglizcha so‘zlar ochiq yozilgan",
     "Pergament Angliyadan topilgan",
     "Shifrni yozgan kapitan Kidd ingliz edi",
     "Bu taxminiy tanlov edi"
    ],
    "javob": 2,
    "izoh": "Chastota tahlili uchun til ma’lum bo‘lishi kerak. Muallifning tili eng ishonchli taxmin."
   },
   {
    "savol": "Shifrda so‘zlar orasida bo‘sh joy yo‘qligi nimani qiyinlashtirdi?",
    "variantlar": [
     "So‘z chegaralarini topish qiyin — shuning uchun «the» kabi ko‘p uchraydigan birikmalarni qidirish kerak bo‘ldi",
     "Hech narsani",
     "Harflarni sanashni",
     "Raqamlarni o‘qishni"
    ],
    "javob": 0,
    "izoh": "Bo‘shliq yo‘q bo‘lsa, takrorlanadigan uch belgili birikma so‘zni aniqlashning eng yaxshi yo‘li."
   }
  ]
 },
 {
  "det": "dyupen",
  "kitob": "dyupen",
  "asar": "O‘g‘irlangan xat",
  "yil": 1844,
  "muallif": "Edgar Allan Po",
  "sarlavha": "Ko‘z oldidagi yashirin joy",
  "hikoya": "Vazir <em>D.</em> juda muhim xatni o‘g‘irlab, uni o‘z uyida saqlayotgani ma’lum edi. Politsiya uch oy davomida uyni sinchiklab tintuv qildi: mebel oyoqlarini burg‘uladi, har bir g‘ishtni mikroskopda tekshirdi, kitoblarning har bir varag‘ini ko‘rdi — xat topilmadi. Ogyust <em>Dyupen</em> vazirning uyiga mehmon bo‘lib bordi va kamin ustidagi oddiy tashrif kartochkalari tokchasida eski, g‘ijimlangan, boshqa muhr bilan yopilgan xatni ko‘rdi.",
  "savol": "Nega politsiya xatni topa olmadi?",
  "variantlar": [
   "Xat uyda umuman bo‘lmagan, vazir uni o‘zi bilan olib yurgan",
   "Politsiya yaxshi qidirmagan, ular dangasa edi",
   "Xat ko‘rinmas siyoh bilan yozilgan edi",
   "Ular uni maxfiy joylardan qidirishgan, vazir esa uni ochiq joyda — hamma ko‘radigan tokchada, ko‘rinishini o‘zgartirib qo‘ygan edi"
  ],
  "javob": 3,
  "izoh": "Politsiya «aqlli odam narsani albatta yashirin joyga yashiradi» degan qoliplar bilan ishlagan. Vazir esa aqlli va buni bilardi — shuning uchun xatni eng ko‘zga tashlanadigan, lekin hech kim e’tibor bermaydigan joyga qo‘ydi va uni eski, keraksiz qog‘oz qiyofasiga keltirdi. Dyupen raqibning fikrlash tarzini tahlil qilib, uni topdi va o‘rniga nusxa qoldirdi.",
  "qoshimcha": [
   {
    "savol": "Politsiya qanday xato qildi?",
    "variantlar": [
     "U uyni yomon qidirdi",
     "U kalitni yo‘qotdi",
     "U vazirni oddiy jinoyatchidek o‘ylab, faqat yashirin joylarni qidirdi",
     "U vazirni ogohlantirdi"
    ],
    "javob": 2,
    "izoh": "Raqibning aql darajasini noto‘g‘ri baholash — qidiruvni noto‘g‘ri yo‘nalishga buradi."
   },
   {
    "savol": "Vazir xatning ko‘rinishini qanday o‘zgartirgan?",
    "variantlar": [
     "Uni g‘ijimlab, boshqa muhr bilan yopib, keraksiz eski qog‘ozga o‘xshatgan",
     "Uni yoqib yuborgan",
     "Uni kitobga tikkan",
     "Uni shifrlagan"
    ],
    "javob": 0,
    "izoh": "Ko‘zga ko‘rinadigan, lekin ahamiyatsiz ko‘rinadigan narsa e’tibordan chetda qoladi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "Moviy xoch",
  "yil": 1910,
  "muallif": "G. K. Chesterton",
  "sarlavha": "G‘alati izlar zanjiri",
  "hikoya": "Mashhur o‘g‘ri <em>Flambo</em>ni ta’qib qilayotgan politsiya boshlig‘i <em>Valantin</em> Londonda g‘alati hodisalarga duch keldi: kafeda shakardonga tuz solingan; restoranda kimdir sho‘rvani devorga sachratib, uzr so‘rab, pul to‘lab ketgan; do‘kondagi olma va apelsinlarning narx yozuvlari almashtirilgan; boshqa bir joyda deraza oynasi ataylab sindirilib, zarar oldindan to‘langan. Har gal bu ishlarni ikki ruhoniydan biri — past bo‘yli, oddiygina ota <em>Braun</em> qilgani aytildi. Valantin bu g‘alati izlar bo‘ylab yurdi.",
  "savol": "Ota Braun nega bunday g‘alati ishlarni qildi?",
  "variantlar": [
   "U shunchaki parishonxotir odam edi",
   "U Flamboning sherigi bo‘lib, politsiyani chalg‘itayotgan edi",
   "U yonidagi «ruhoniy» Flambo ekanini sezgan va politsiya kuzatib kelishi uchun ataylab ko‘zga tashlanadigan izlar qoldirgan",
   "U o‘ziga e’tibor tortib, gazetalarga chiqmoqchi edi"
  ],
  "javob": 2,
  "izoh": "Har bir g‘alati harakat shovqin chiqarardi va odamlarning esida qolardi — ya’ni iz qoldirardi. Zararlarni oldindan to‘lash — u buni ataylab qilganini ko‘rsatadi. Ota Braun Flambo o‘zini ruhoniy qilib ko‘rsatayotganini sezgan: soxta «ruhoniy» aqlga qarshi gapirgan, haqiqiy ruhoniy esa bunday qilmaydi. Valantin bu izlar orqali ularni topdi va Flambo qo‘lga tushdi.",
  "qoshimcha": [
   {
    "savol": "Zararni oldindan to‘lash nimani ko‘rsatadi?",
    "variantlar": [
     "U boy edi",
     "U kechirim so‘rashni yoqtirardi",
     "Uni majburlashgan",
     "Ota Braun bu ishlarni ataylab, hech kimga zarar yetkazmaslikni o‘ylab qilgan"
    ],
    "javob": 3,
    "izoh": "Bezori zarar uchun to‘lamaydi. To‘lov — qasddan, lekin zararsiz «iz qoldirish» niyatini ko‘rsatadi."
   },
   {
    "savol": "Ota Braun soxta ruhoniyni qanday tanidi?",
    "variantlar": [
     "Uning kiyimi eski edi",
     "U aqlga qarshi gapirdi — haqiqiy ruhoniy bunday qilmaydi",
     "U chet ellik edi",
     "U juda baland edi"
    ],
    "javob": 1,
    "izoh": "Kasbiy bilim — eng yaxshi niqob tekshiruvchisi. Soxta mutaxassis o‘z sohasidagi asosiy qoidalarni buzadi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "Qo‘ng‘iroqxona bolg‘asi",
  "yil": 1910,
  "muallif": "G. K. Chesterton",
  "sarlavha": "Kichik bolg‘aning ulkan zarbasi",
  "hikoya": "Qishloqda polkovnik <em>Boxun</em> boshiga urilgan zarbadan halok bo‘ldi: bosh suyagi ezilib ketgan, yonida esa juda kichik, yengil bolg‘a yotardi. Hamma gumonni qishloqning eng kuchli odami — temirchiga qaratdi: bunday zarbani faqat u bera oladi. Ammo temirchining ishonchli alibisi bor edi. Voqea baland qo‘ng‘iroqxona minorasi tagida, ochiq maydonda yuz bergan. Ota <em>Braun</em> marhumning ukasi — ruhoniy bilan minoraning yuqori ayvoniga chiqqanda pastga qarab: «Bu yerdan odamlar hasharotdek kichik ko‘rinadi», dedi.",
  "savol": "Ota Braun qanday xulosaga keldi?",
  "variantlar": [
   "Bolg‘ani kuchli qo‘l urmagan — u baland minoradan tashlangan: yengil bolg‘a balanddan tushib, ulkan kuch bilan urilgan; qotil — minoradan pastga qaragan odam",
   "Temirchi yolg‘on alibi o‘ylab topgan va o‘zi urgan",
   "Polkovnik otdan yiqilib, boshini bolg‘aga urgan",
   "Bolg‘ani bir nechta odam birga ko‘tarib urgan"
  ],
  "javob": 0,
  "izoh": "Kichik bolg‘a va ulkan zarba — ziddiyat: kuch qo‘ldan emas, boshqa manbadan kelgan. Balanddan tushgan jism tezlik oladi — kichik massaga katta tezlik qo‘shilsa, zarba juda kuchli bo‘ladi. Voqea joyi minora tagida — demak, manba yuqorida. Minorada bo‘lgan odam — marhumning ukasi; u o‘z akasini balanddan qarab «gunohkor» deb hukm qilgan va bolg‘ani tashlagan.",
  "qoshimcha": [
   {
    "savol": "Nima uchun temirchining kuchi uni oqlamaydi, lekin alibisi oqlaydi?",
    "variantlar": [
     "Kuch faqat imkoniyatni ko‘rsatadi, alibi esa uning u yerda bo‘lmaganini isbotlaydi",
     "Kuch uni aybdor qiladi",
     "Alibi soxta edi",
     "Temirchi kuchsiz edi"
    ],
    "javob": 0,
    "izoh": "Imkoniyat — ayb emas. Alibi esa jismonan ishtirok etish imkoniyatini yo‘qqa chiqaradi."
   },
   {
    "savol": "Yengil buyum balanddan tushganda nega kuchli uradi?",
    "variantlar": [
     "U og‘irlashadi",
     "Havo uni itaradi",
     "Tushish davomida u katta tezlik oladi va tezlik zarba kuchini oshiradi",
     "U aylanadi"
    ],
    "javob": 2,
    "izoh": "Zarba kuchi massa va tezlikka bog‘liq. Kichik massaga katta tezlik qo‘shilsa, zarba juda kuchli bo‘ladi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "G‘alati qadamlar",
  "yil": 1910,
  "muallif": "G. K. Chesterton",
  "sarlavha": "Ikki xil yurish",
  "hikoya": "Nufuzli klubning yillik ziyofatida baliq yeyish uchun kumush pichoq va vilkalar izsiz o‘g‘irlandi. Ziyofat paytida Ota <em>Braun</em> yo‘lak yonidagi kichik xonada o‘tirgan edi va yo‘lakdan g‘alati qadam tovushlarini eshitdi: goh tez, mayda, shoshilinch qadamlar — xuddi patnis ko‘tarib yugurayotgan ofitsiantnikidek; goh sekin, og‘ir, viqorli qadamlar — xuddi beparvo yurgan janobnikidek. Tovushlar bir odamdan kelardi. Ziyofatda janoblar ham, ofitsiantlar ham bir xil qora kechki libosda edi.",
  "savol": "Qadamlar nega bunday almashinib turdi?",
  "variantlar": [
   "Yo‘lakda ikki xil odam navbatma-navbat yurgan",
   "Ofitsiant oyog‘i og‘rib qolgan",
   "Bu musiqa ritmi edi",
   "O‘g‘ri Flambo bir vaqtning o‘zida ikki rol o‘ynagan: janoblar oldida ofitsiant bo‘lib yugurgan, ofitsiantlar oldida esa janob bo‘lib sekin yurgan"
  ],
  "javob": 3,
  "izoh": "Bir odamning ikki xil yurishi — u ikki xil kishini o‘ynamoqda. Qora libos ham janobga, ham ofitsiantga mos: janoblar uni ofitsiant deb, ofitsiantlar esa mehmon deb o‘ylagan. Shu tarzda u kumushlarni bemalol yig‘ib olgan. Ota Braun tovushlarga quloq solib, uni to‘xtatdi.",
  "qoshimcha": [
   {
    "savol": "Nega bir xil qora libos o‘g‘ri uchun qulay edi?",
    "variantlar": [
     "U qorong‘ida ko‘rinmasdi",
     "U ham janob, ham ofitsiant libosiga o‘xshardi — kim qaysi rolda ekanini kiyimdan bilib bo‘lmasdi",
     "U qimmat edi",
     "Uni hamma kiyishi shart edi"
    ],
    "javob": 1,
    "izoh": "Niqob ba’zan kiyimda emas, vaziyatda: bir xil kiyim ikki rolni o‘ynashga imkon beradi."
   },
   {
    "savol": "Ota Braun o‘g‘rini qanday payqadi?",
    "variantlar": [
     "Uning yuzini tanib",
     "Kumushlarni ko‘rib",
     "Uni ko‘rmasdan, faqat qadam tovushlarining almashinuvidan",
     "Ofitsiantlardan so‘rab"
    ],
    "javob": 2,
    "izoh": "Kuzatish faqat ko‘z bilan emas. Tovushlar ham dalil bo‘la oladi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "Ko‘rinmas odam",
  "yil": 1911,
  "muallif": "G. K. Chesterton",
  "sarlavha": "Hech kim kirmagan uy",
  "hikoya": "Ixtirochi <em>Smayt</em> o‘z kvartirasida o‘ldirildi. Uy kirish eshigini to‘rt kishi — darvozabon, politsiyachi, kashtan sotuvchi va yana bir kuzatuvchi — butun vaqt kuzatib turdi; ularning har biri: «Hech kim kirmadi», deb qasam ichdi. Ammo qorda uyga kirib-chiqqan iz bor edi, jasad esa yo‘qolib qolgan. Ota <em>Braun</em> so‘radi: «Hech kim kirmadi» deganda, ular kimni hisobga olmagan bo‘lishi mumkin?",
  "savol": "Qotil kim edi?",
  "variantlar": [
   "Kuzatuvchilardan biri, u yolg‘on gapirgan",
   "Smaytning o‘zi ixtiro qilgan robot",
   "Pochtachi: u har kuni keladi, odamlar uni «hech kim» deb hisoblab, e’tibor bermaydi — u jasadni xat solinadigan katta sumkasida olib chiqib ketgan",
   "Uyga tom orqali tushgan noma’lum odam"
  ],
  "javob": 2,
  "izoh": "«Hech kim kirmadi» degan gap — kuzatilgan narsa emas, xulosa. Odamlar kundalik, odatiy kishilarni (pochtachi, xizmatchi) «kimdir» deb hisoblamaydi — ular «ruhan ko‘rinmas». Qordagi iz kimdir kirganini isbotlaydi. Pochtachining katta sumkasi esa jasadni olib chiqishga yetadi. Bu hikoya bizni kuzatuvchining e’tiboriga ham shubha bilan qarashga o‘rgatadi.",
  "qoshimcha": [
   {
    "savol": "Qordagi kirib-chiqqan iz nimani isbotlaydi?",
    "variantlar": [
     "Qor eski edi",
     "Kuzatuvchilarning gapiga qaramay, kimdir uyga kirgan va chiqqan",
     "Izlar kuzatuvchilarniki",
     "Hech narsani"
    ],
    "javob": 1,
    "izoh": "Moddiy dalil guvohlarning xulosasiga zid bo‘lsa, xulosani qayta ko‘rib chiqish kerak."
   },
   {
    "savol": "Ota Braunning savoli qaysi xatoni ochdi?",
    "variantlar": [
     "Ular uxlab qolgan",
     "Ular pora olgan",
     "Ular qotilni tanigan",
     "Kuzatuvchilar odatiy odamlarni «kimdir» deb hisoblamagan — ular haqida aytishni ham o‘ylamagan"
    ],
    "javob": 3,
    "izoh": "«Hech kim kirmadi» — kuzatuv emas, xulosa. Har kungi, odatiy odamlar ko‘zga ko‘rinmaydi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "Singan qilich belgisi",
  "yil": 1911,
  "muallif": "G. K. Chesterton",
  "sarlavha": "Barg qayerga yashiriladi?",
  "hikoya": "Mashhur general <em>Sent-Kler</em> urushda kutilmaganda, aqlga sig‘maydigan hujum uyushtirib, ko‘p askarini halok qilgan va o‘zi ham o‘lgan edi. Hamma uni qahramon deb hisoblardi. Ota <em>Braun</em> do‘sti Flamboga savol berdi: «Aqlli odam bargni qayerga yashiradi?» — «O‘rmonga». — «O‘rmon bo‘lmasa-chi?» — «O‘rmon o‘stiradi». Keyin Braun generalning qilichi uchi singanini, u esa jangdan oldin kimnidir o‘ldirgani haqidagi guvohlikni eslatdi.",
  "savol": "Ota Braunning «barg va o‘rmon» haqidagi mulohazasi nimani bildiradi?",
  "variantlar": [
   "General jangda chindan qahramonlarcha halok bo‘lgan",
   "Qilich jangda tasodifan singan",
   "General dushman bilan til biriktirgan, xolos",
   "General bitta jasadni — o‘zi o‘ldirgan odamni — yashirish uchun ataylab ma’nosiz hujum uyushtirib, jasadlar «o‘rmon»ini yaratgan"
  ],
  "javob": 3,
  "izoh": "Bir jasad tinch kunda shubha uyg‘otadi; jang maydonidagi ko‘plab jasadlar orasida u ko‘zga tashlanmaydi. Shuning uchun «o‘rmon» — ya’ni ko‘plab qurbonlar — sun’iy yaratilgan. Singan qilich uchi qotillik qurolini ko‘rsatgan. Bu — yashirish mantig‘ining dahshatli misoli: kerakli narsani o‘xshash narsalar orasiga ko‘mish.",
  "qoshimcha": [
   {
    "savol": "Singan qilich uchi nimaga ishora qildi?",
    "variantlar": [
     "Jangning shiddatiga",
     "Qilichning eskiligiga",
     "Generalning sharafiga",
     "Qotillik quroliga — general jangdan oldin kimnidir o‘ldirgan"
    ],
    "javob": 3,
    "izoh": "Qurol izi — jinoyat izi. Singan uch boshqa jangda emas, oldingi qotillikda ishlatilganini ko‘rsatdi."
   },
   {
    "savol": "Ota Braun mantiqining asosiy fikri qanday?",
    "variantlar": [
     "Narsalarni yer ostiga yashirish kerak",
     "Bitta narsani yashirish uchun uni ko‘plab o‘xshash narsalar orasiga qo‘yish mumkin",
     "Yashirin narsa doim topiladi",
     "Bargni olovda yoqish kerak"
    ],
    "javob": 1,
    "izoh": "«Bargni o‘rmonga, jasadni jang maydoniga» — o‘xshashlar orasida yashirish qoidasi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "Noto‘g‘ri shakl",
  "yil": 1911,
  "muallif": "G. K. Chesterton",
  "sarlavha": "Qirqilgan burchak",
  "hikoya": "Shoir <em>Kvinton</em> o‘z xonasida pichoq bilan halok bo‘ldi; yonida «O‘z qo‘lim bilan o‘laman, lekin o‘ldirilgan bo‘lib o‘laman!» degan yozuvli qog‘oz bor edi. Ota <em>Braun</em> qog‘ozga qarab, uning «noto‘g‘ri shakli»ga e’tibor berdi: varaqning bir burchagi qaychi bilan qirqib tashlangan edi. Kvinton bu qog‘ozlarga o‘z hikoyalarini yozib yurardi, hikoyalarida esa qahramonlar gapini qo‘shtirnoq ichida yozardi. Uyda Kvintonning shifokori doktor <em>Xarris</em> bo‘lgan.",
  "savol": "Ota Braun qirqilgan burchakdan qanday xulosa chiqardi?",
  "variantlar": [
   "Yozuv o‘z joniga qasd xati emas — u Kvinton hikoyasidagi qahramonning gapi: kimdir burchakni qirqib, qo‘shtirnoq va boshqa so‘zlarni olib tashlab, «iqror» yasagan",
   "Kvinton qog‘ozni o‘zi qirqgan, bu odat",
   "Burchak tasodifan yirtilgan",
   "Qog‘oz boshqa xonadan kelgan"
  ],
  "javob": 0,
  "izoh": "Qog‘ozning shakli o‘zgargani — matnning bir qismi olib tashlanganini ko‘rsatadi. Agar yozuv hikoyadan bo‘lsa, uning atrofida qo‘shtirnoq va «— dedi u» kabi so‘zlar bo‘lardi. Qotil ularni qirqib, badiiy jumlani «so‘nggi xat»ga aylantirgan. Bu ish Kvintonga yaqin, uning qog‘ozlarini biladigan odamni ko‘rsatdi.",
  "qoshimcha": [
   {
    "savol": "Nega Kvintonning hikoyachi bo‘lgani muhim?",
    "variantlar": [
     "U ko‘p yozardi",
     "U mashhur edi",
     "Uning qog‘ozlarida qahramonlarning dramatik gaplari ko‘p edi — ulardan biri «xat» qilib ishlatilgan",
     "U pul topardi"
    ],
    "javob": 2,
    "izoh": "Odamning kasbi va odatlari dalillarni to‘g‘ri o‘qishga yordam beradi."
   },
   {
    "savol": "Bu ishdagi asosiy fikrlash usuli qanday?",
    "variantlar": [
     "Narsaning shakli o‘zgargan bo‘lsa — nimani olib tashlashganini va nega olib tashlashganini so‘rash",
     "Barmoq izlarini qidirish",
     "Qurolni tekshirish",
     "Guvohlarni so‘roq qilish"
    ],
    "javob": 0,
    "izoh": "Yo‘q qilingan qism ko‘pincha mavjud qismdan ko‘ra ko‘proq narsa aytadi."
   }
  ]
 },
 {
  "det": "braun",
  "kitob": "braun",
  "asar": "Isroil Gouning halolligi",
  "yil": 1911,
  "muallif": "G. K. Chesterton",
  "sarlavha": "Barcha oltin qayerda?",
  "hikoya": "Shotlandiyadagi Glengayl qasrining kamgap grafi vafot etdi va qasrda faqat uning eski xizmatkori <em>Isroil Gou</em> qoldi. Tergovchilar qasrda g‘alati narsalarni topishdi: qutisiz sochilgan nos; shamdonsiz shamlar; gardishi yo‘q, sochilib yotgan qimmatbaho toshlar; diniy kitob esa har bir zarhal bilan bezatilgan muqaddas so‘z joyidan qirqib olingan edi. Ota <em>Braun</em> bu ro‘yxatni diqqat bilan o‘rgandi.",
  "savol": "Bu g‘alati narsalarni qanday umumiy qoida birlashtiradi?",
  "variantlar": [
   "Graf aqldan ozib, narsalarni o‘zi buzgan",
   "Qasrga yashirin diniy marosim o‘tkazilgan",
   "O‘g‘ri eng qimmat narsalarni tanlab olgan",
   "Ulardan faqat oltin olib ketilgan: oltin nosqutilar, oltin shamdonlar, toshlarning oltin gardishlari va kitobdagi zarhal harflar"
  ],
  "javob": 3,
  "izoh": "Bir-biriga o‘xshamagan narsalarni solishtirib, ularning har biridan nima yetishmayotganini so‘rash kerak. Javob bitta — oltin. Qimmatbaho toshlar qoldirilgan, demak, bu oddiy o‘g‘ri emas: kimdir faqat oltinni — aynan oltinni olgan. Isroil Gou o‘ziga meros qilingan oltinni harfma-harf olib ketgan edi.",
  "qoshimcha": [
   {
    "savol": "Qimmatbaho toshlarning qoldirilgani nimani ko‘rsatadi?",
    "variantlar": [
     "Olib ketuvchi oddiy o‘g‘ri emas — u faqat oltinni, va’da qilingan narsanigina olgan",
     "Toshlar soxta edi",
     "O‘g‘ri shoshilib qolgan",
     "Toshlarni sotish qiyin edi"
    ],
    "javob": 0,
    "izoh": "Oddiy o‘g‘ri eng qimmatini oladi. Toshlarga tegmagan odam o‘g‘rilik emas, boshqa qoida bilan harakat qilgan."
   },
   {
    "savol": "Ota Braunning bu ishdagi fikrlash usuli qanday?",
    "variantlar": [
     "Graf hayotini o‘rganish",
     "Gouni qo‘rqitib iqror qildirish",
     "Har xil narsalarda umumiy «yetishmayotgan» belgini topish",
     "Qasrni xaritaga tushirish"
    ],
    "javob": 2,
    "izoh": "Umumiy yo‘qlik — qonuniyat. Har bir narsadan nima olib ketilganini so‘rasangiz, javob o‘zi chiqadi."
   }
  ]
 },
 {
  "det": "klassika",
  "kitob": "klassika",
  "asar": "Oy toshi",
  "yil": 1868,
  "muallif": "Uilki Kollinz",
  "sarlavha": "Tungi xalatdagi bo‘yoq",
  "hikoya": "Tug‘ilgan kun kechasi yosh <em>Reychel</em>ga sovg‘a qilingan mashhur hind olmosi — Oy toshi uning xonasidan g‘oyib bo‘ldi. Xona eshigi kechqurun yangi bo‘yalgan, bo‘yoq hali qurimagan edi va eshikdagi bo‘yoq ertalab bir joyida surtilib ketgani ko‘rindi. Bir yil o‘tib, <em>Franklin Bleyk</em> o‘zining tungi xalatida o‘sha bo‘yoq dog‘ini topdi — lekin u olmosni olganini umuman eslamaydi. Ma’lum bo‘lishicha, o‘sha kechasi shifokor yashirincha uning ichimligiga afyunli dori (laudanum) qo‘shgan, Franklin esa o‘sha kunlarda olmosning xavfsizligidan qattiq xavotirda edi.",
  "savol": "Franklin olmosni olganini nega eslamaydi?",
  "variantlar": [
   "U yolg‘on gapiryapti — olmosni sotib yuborgan",
   "Afyunli dori ta’sirida, uyqusiz va xavotirda yurgan holda, u uyqu-hushyorlik orasida olmosni «xavfsiz joyga» olib qo‘ygan va buni bilmagan",
   "Xalatni boshqa odam kiyib, olmosni olgan",
   "Bo‘yoq dog‘i tasodifiy, olmosni xizmatchi qiz olgan"
  ],
  "javob": 1,
  "izoh": "Bo‘yoq dog‘i olmos olingan vaqtda eshikka tekkan odamni ko‘rsatadi — bu Franklinning xalati. Lekin u buni eslamaydi. Afyun dori va xavotir — tushida yurish va ongsiz harakatlarga sabab bo‘lishi mumkin. Shifokor tajribani takrorladi: Franklin yana dori ichib, xuddi shunday harakatlar qildi. Bu ingliz adabiyotidagi ilk uzun detektiv romanlardan biri.",
  "qoshimcha": [
   {
    "savol": "Eshikdagi yangi bo‘yoq nimaga yordam berdi?",
    "variantlar": [
     "Eshikni chiroyli qilishga",
     "Olmosni yashirishga",
     "Kechasi kim eshikka tekkanini aniqlashga — bo‘yoq kiyimda iz qoldirdi",
     "Xonani isitishga"
    ],
    "javob": 2,
    "izoh": "Ho‘l bo‘yoq «tasodifiy tuzoq» bo‘lib chiqdi: kim tegsa, iz qoladi."
   },
   {
    "savol": "Franklin ishtirokini tekshirish uchun qanday tajriba qilindi?",
    "variantlar": [
     "Unga yana o‘sha dori berilib, xatti-harakati kuzatildi",
     "U so‘roq qilindi",
     "Uning uyi tintuv qilindi",
     "U qamaldi"
    ],
    "javob": 0,
    "izoh": "Shart-sharoitni takrorlash — tajribaning asosiy qoidasi. Franklin yana xuddi shunday harakat qildi."
   }
  ]
 },
 {
  "det": "klassika",
  "kitob": "klassika",
  "asar": "Shved gugurti",
  "yil": 1884,
  "muallif": "Anton Chexov",
  "sarlavha": "Kam uchraydigan gugurt",
  "hikoya": "Qishloqda iste’fodagi kornet <em>Klyauzov</em> g‘oyib bo‘ldi; xonasi ostin-ustun, karavot yonida esa bitta yoqilgan <em>shved gugurti</em> topildi. Tergovchining yosh, g‘ayratli yordamchisi o‘yladi: «Bu atrofda hamma oddiy gugurt ishlatadi, shved gugurti esa juda kam — uni faqat bir-ikki xonadonda topish mumkin». Gugurt izidan borib, ular politsiya boshlig‘ining yosh xotini aynan shunday gugurt ishlatishini aniqlashdi.",
  "savol": "Gugurt izi oxir-oqibat nimaga olib keldi?",
  "variantlar": [
   "Politsiya boshlig‘ining xotini Klyauzovni o‘ldirgani isbotlandi",
   "Klyauzovni topishga: u o‘ldirilmagan ekan — politsiya boshlig‘ining xotini uni o‘z hammomida yashirib saqlayotgan edi",
   "Gugurt tasodifan tushib qolgan, ish yopildi",
   "Klyauzovni o‘g‘irlab ketgan qaroqchilar to‘dasi topildi"
  ],
  "javob": 1,
  "izoh": "Dalil to‘g‘ri tanlangan: kam uchraydigan narsa — kuchli iz, chunki u gumondorlar doirasini toraytiradi. Lekin tergovchilar «qotillik» degan xulosaga shoshilgan edi. Chexovning kulgili hikoyasi shuni o‘rgatadi: dalil to‘g‘ri yo‘lni ko‘rsatishi mumkin, ammo boshidanoq tanlangan «jinoyat» haqidagi taxmin noto‘g‘ri bo‘lishi mumkin. Tirik va sog‘ Klyauzov hammomda topildi.",
  "qoshimcha": [
   {
    "savol": "Shved gugurti nega kuchli dalil hisoblandi?",
    "variantlar": [
     "U qimmat",
     "U yaxshi yonadi",
     "U atrofda kam uchraydi — gumondorlar doirasini bir-ikki xonadonga toraytiradi",
     "U yangi edi"
    ],
    "javob": 2,
    "izoh": "Noyob dalil umumiy dalildan kuchliroq: u mumkin bo‘lgan odamlar sonini keskin kamaytiradi."
   },
   {
    "savol": "Tergovchilarning asosiy xatosi nima edi?",
    "variantlar": [
     "Ular boshidanoq qotillik bo‘lgan deb, boshqa ehtimollarni ko‘rmay qo‘yishdi",
     "Ular gugurtni yo‘qotishdi",
     "Ular kech kelishdi",
     "Ular guvohlarni so‘roq qilmadi"
    ],
    "javob": 0,
    "izoh": "Erta tanlangan taxmin dalillarni noto‘g‘ri tushuntirishga olib keladi. Avval nima bo‘lganini aniqlash kerak."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Sof mantiq · yolg‘onchini topish",
  "sarlavha": "Uch gumondor va bitta yolg‘on",
  "hikoya": "Grafinyaning xonasidan moviy yoqut g‘oyib bo‘ldi. Kechqurun xonaga faqat uch kishi kirgan: xizmatkor <em>Aziza</em>, darvozabon <em>Bekzod</em> va mehmon <em>Sanjar</em>. Yoqutni ulardan faqat bittasi olgani aniq. Holmes ularni birma-bir so‘roq qildi. Aziza: «Yoqutni Bekzod o‘g‘irladi». Bekzod: «Yoqutni Sanjar o‘g‘irladi». Sanjar: «Men begunohman». Holmes tergovchilarga qat’iy aytdi: «Uch kishidan faqat bittasi yolg‘on gapiryapti».",
  "savol": "Yoqutni kim o‘g‘irlagan?",
  "variantlar": [
   "Aziza",
   "Bekzod",
   "Sanjar",
   "Ma’lumot yetarli emas"
  ],
  "javob": 1,
  "izoh": "Har bir variantni tekshiramiz. Aziza aybdor bo‘lsa: Azizaning gapi yolg‘on, Bekzodning gapi ham yolg‘on, Sanjarning gapi rost — ikkita yolg‘on, shart buziladi. Sanjar aybdor bo‘lsa: xuddi shunday ikkita yolg‘on. Bekzod aybdor bo‘lsa: Aziza rost, Bekzod yolg‘on, Sanjar rost — aynan bitta yolg‘on. Demak, aybdor — Bekzod.",
  "qoshimcha": [
   {
    "savol": "Agar Aziza yolg‘on gapirgan bo‘lsa, nima bo‘lardi?",
    "variantlar": [
     "Hammasi to‘g‘ri bo‘lardi",
     "Aziza o‘g‘ri bo‘lardi",
     "Bekzod yolg‘onchi bo‘lardi",
     "Bekzod aybsiz, demak Sanjar o‘g‘ri — lekin unda Sanjarning gapi ham yolg‘on bo‘lib, ikki yolg‘onchi chiqadi"
    ],
    "javob": 3,
    "izoh": "Har bir taxminni oxirigacha tekshirish kerak: shart (faqat bitta yolg‘on) buzilsa, taxmin noto‘g‘ri."
   },
   {
    "savol": "Bu masalani yechishning eng tez yo‘li qaysi?",
    "variantlar": [
     "Eng shubhali odamni tanlash",
     "Har bir odamni navbat bilan yolg‘onchi deb olib, qolgan gaplarning to‘g‘riligini tekshirish",
     "Ovoz berish",
     "Taxmin qilish"
    ],
    "javob": 1,
    "izoh": "Yolg‘onchi masalalarida holatlarni ketma-ket tekshirish usuli ishonchli va tez natija beradi."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Qulflangan xona klassikasi",
  "sarlavha": "Muzlatilgan zahar",
  "hikoya": "Professor <em>Brinston</em> ish xonasida o‘lik holda topildi. Xona ichkaridan qulflangan, deraza mahkam yopiq. Stoldagi viski qadahida zahar bor, lekin javondagi muhrlangan viski shishasida zahar yo‘q. Qadahni kechqurun xizmatkor yuvib, javonga qo‘ygan; viskini professor o‘zi quygan. Professor viskini doim muz bilan ichardi. Kechqurun ikki mehmon xonaga muz to‘la chelak olib kirib, bir soatcha o‘tirib, chiqib ketishgan.",
  "savol": "Holmes qanday xulosaga keldi?",
  "variantlar": [
   "Professor o‘zini o‘zi zaharlagan — zahar choyga solingan",
   "Zahar muz bo‘lagi ichiga solingan: muz erigach, zahar qadahdagi viskiga o‘tgan",
   "Zahar viski shishasining ichida bo‘lgan",
   "Professor viski ichishdan oldin zaharli dori qabul qilgan"
  ],
  "javob": 1,
  "izoh": "Zaharning yo‘lini bosqichma-bosqich tekshiramiz. Shishadagi viski toza, qadah oldindan yuvilgan — demak zahar qadahga na viski bilan, na qadahning o‘zi bilan kelgan. Qadahga tushgan yana bitta narsa bor — muz. Uni olib kirgan mehmonlar zaharni muz ichiga muzlatib qo‘yishgan: muz asta erigan, zahar viskiga o‘tgan, bu paytda esa mehmonlar allaqachon ketib bo‘lgan. Shuning uchun xona ichkaridan qulflangan bo‘lsa ham, qotil xonada bo‘lishi shart emas edi.",
  "qoshimcha": [
   {
    "savol": "Nega muhrlangan shishaning toza chiqqani muhim?",
    "variantlar": [
     "Shisha soxta edi",
     "Zahar viskida emas, qadahga keyin qo‘shilgan narsada bo‘lgan",
     "Viski juda qimmat edi",
     "Professor umuman viski ichmagan"
    ],
    "javob": 1,
    "izoh": "Manbalarni birma-bir chiqarib tashlaymiz: viski toza, qadah yuvilgan. Demak zahar qadahga keyin qo‘shilgan narsa bilan tushgan."
   },
   {
    "savol": "Nega zaharni aynan muzga solish qotil uchun qulay edi?",
    "variantlar": [
     "Muz zaharni kuchliroq qiladi",
     "Muz zaharning rangini o‘zgartiradi",
     "Muz zaharni zararsiz qilib qo‘yadi",
     "Muz asta eriydi — zahar qotil xonadan chiqib ketgandan keyin ta’sir qiladi"
    ],
    "javob": 3,
    "izoh": "Muz — zaharning «kechikkan yetkazuvchisi». U erigunicha qotil uzoqqa ketib, o‘ziga alibi tayyorlab ulguradi."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Guvohning alibisi",
  "sarlavha": "Bekat soati",
  "hikoya": "Guvoh aytdi: «Men janob Klerkni bekat soati roppa-rosa 7:00 ni ko‘rsatganda poyezdga chiqayotganini ko‘rdim. Poyezd 7:05 da jo‘nab ketdi». Holmes bekat boshlig‘idan aniqladi: bu bekat soati doim haqiqiy vaqtdan 20 daqiqa orqada qoladi. Poyezd esa haqiqiy vaqt bilan 7:05 da jo‘nab ketgan.",
  "savol": "Nega guvohning so‘zlari yolg‘on?",
  "variantlar": [
   "Soat orqada qolgani uchun: u 7:00 ni ko‘rsatganda haqiqiy vaqt 7:20 bo‘lgan, poyezd esa allaqachon ketgan",
   "Chunki poyezdlar hech qachon 7:05 da jo‘namaydi",
   "Chunki guvoh soatni noto‘g‘ri o‘qigan, aslida 6:00 bo‘lgan",
   "Guvohning so‘zlarida yolg‘on yo‘q — u haqiqatni aytgan"
  ],
  "javob": 0,
  "izoh": "Soat 20 daqiqa orqada. Demak, soat 7:00 ni ko‘rsatganda haqiqiy vaqt 7:20. Poyezd esa 7:05 da ketgan — ya’ni guvoh «7:00» deb aytgan paytda poyezd 15 daqiqa oldin jo‘nab bo‘lgan. Guvoh Klerkni poyezdga chiqayotganini ko‘ra olmasdi. Alibi soatga tayansa, avval soatning o‘zini tekshirish kerak.",
  "qoshimcha": [
   {
    "savol": "Agar soat 10 daqiqa orqada qolsa va 7:00 ni ko‘rsatsa, haqiqiy vaqt qancha?",
    "variantlar": [
     "7:10",
     "6:50",
     "7:00",
     "7:20"
    ],
    "javob": 0,
    "izoh": "Orqada qolgan soat haqiqiy vaqtdan kam ko‘rsatadi. Haqiqiy vaqt = ko‘rsatilgan + orqada qolgan daqiqa."
   },
   {
    "savol": "Agar soat 20 daqiqa oldinda yurganida, guvohning gapi haqida nima deyish mumkin edi?",
    "variantlar": [
     "U baribir yolg‘on gapirgan",
     "Poyezd ketib bo‘lgan",
     "Haqiqiy vaqt 6:40 bo‘lardi — Klerk poyezdga chiqqani mumkin bo‘lardi",
     "Soatga qarab hech narsa aytib bo‘lmaydi"
    ],
    "javob": 2,
    "izoh": "Soat oldinda bo‘lsa, haqiqiy vaqt kamroq: 7:00 − 20 = 6:40. Poyezd 7:05 da ketadi — vaqt yetardi."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Qulflangan xona · deduksiya zanjiri",
  "sarlavha": "Qor ostidagi xona",
  "hikoya": "Qishloq uyida lord o‘z xonasida o‘ldirilgan. Eshik ichkaridan qulflangan, kalit xonadagi stolda yotibdi — ammo xizmatkorda barcha xonalarning zaxira kaliti bor. Xonaning yagona derazasi ikkinchi qavatda. Qor kechqurun to‘xtagan, lord esa yarim tunda o‘ldirilgan. Ertalab deraza tokchasidagi qor tekis — birorta iz yo‘q, deraza tagida ham qadam izlari ko‘rinmaydi. Kechasi uyda faqat lord va xizmatkor bo‘lgan. Xizmatkor aytadi: «Yarim tunda derazadan notanish kishi kirib, xo‘jayinni o‘ldirdi-da, yana derazadan chiqib ketdi».",
  "savol": "Holmes nega xizmatkordan shubhalandi?",
  "variantlar": [
   "Chunki xizmatkor eng ko‘p qo‘rqqan odam edi",
   "Tokchadagi tekis qor va deraza tagidagi izsizlik: derazadan hech kim kirib-chiqmagan, demak qotil uy ichida edi",
   "Chunki lordning kaliti cho‘ntagida edi",
   "Chunki ikkinchi qavatga hech kim chiqa olmaydi"
  ],
  "javob": 1,
  "izoh": "Deduksiya ikki dalilga tayanadi. Birinchisi: qor qotillikdan oldin to‘xtagan, demak derazadan kirib-chiqqan odam tokchada ham, deraza tagida ham albatta iz qoldirardi — iz yo‘q. Demak tashqaridan hech kim kelmagan. Ikkinchisi: eshik qulflangan, lekin zaxira kalit xizmatkorda — u xonaga kirib, chiqib, eshikni yana qulflab qo‘yishi mumkin edi. Uyda esa lord va xizmatkordan boshqa hech kim yo‘q. Xizmatkorning «notanish odam» haqidagi hikoyasi — o‘zi to‘qigan izoh.",
  "qoshimcha": [
   {
    "savol": "Deraza tokchasidagi tekis qor qaysi gapni rad etadi?",
    "variantlar": [
     "Lordning o‘lganini",
     "Kechqurun qor yog‘ganini",
     "Uyda xizmatkor bo‘lganini",
     "Notanish odam derazadan kirib-chiqqani haqidagi gapni"
    ],
    "javob": 3,
    "izoh": "Derazadan o‘tgan odam qorda albatta iz qoldiradi. Iz yo‘qligi bu yo‘l ishlatilmaganini isbotlaydi."
   },
   {
    "savol": "Qotil uyda bo‘lgan bo‘lsa, gumondorlar kimlar?",
    "variantlar": [
     "Barcha qo‘shnilar",
     "Faqat uyda qolganlar — ya’ni xizmatkor",
     "Qishloq aholisi",
     "Notanish yo‘lovchi"
    ],
    "javob": 1,
    "izoh": "Tashqi yo‘l yopilgach, gumondorlar doirasi uydagilar bilan cheklanadi."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Uch quti klassikasi",
  "sarlavha": "Noto‘g‘ri yozuvlar",
  "hikoya": "Skotlend-Yard omborida uchta quti bor: birida faqat olma, birida faqat nok, uchinchisida olma bilan nok aralash. Qutilarga «Olma», «Nok», «Aralash» deb yozilgan, ammo Holmes aytadi: «Uchala yozuv ham noto‘g‘ri yopishtirilgan».",
  "savol": "Qaysi qutidan bitta meva olsangiz, uchala qutining ichidagini ham aniqlay olasiz?",
  "variantlar": [
   "«Olma» yozuvi bor qutidan",
   "«Nok» yozuvi bor qutidan",
   "«Aralash» yozuvi bor qutidan",
   "Istalgan qutidan — farqi yo‘q"
  ],
  "javob": 2,
  "izoh": "«Aralash» yozuvi noto‘g‘ri, demak u yerda aralash yo‘q — ichida faqat olma yoki faqat nok. Bitta meva olish yetarli. Qolganini mantiq hal qiladi. Masalan, «Aralash»dan olma chiqdi: bu quti — olma. Unda olma qolmagan, «Olma» yozuvli qutida esa olma bo‘lishi mumkin emas (yozuv noto‘g‘ri) — u yerda nok. Qolgan «Nok» yozuvlisida aralash bo‘ladi. «Olma» yoki «Nok» yozuvli qutidan olsangiz, noaniqlik qoladi, chunki u yerda ikki xil variant bo‘lishi mumkin.",
  "qoshimcha": [
   {
    "savol": "«Aralash» yozuvli qutidan olma chiqsa, bu qutida aslida nima bor?",
    "variantlar": [
     "Aralash",
     "Faqat nok",
     "Faqat olma — yozuv noto‘g‘ri bo‘lgani uchun u aralash bo‘lishi mumkin emas",
     "Bo‘sh"
    ],
    "javob": 2,
    "izoh": "Yozuvlar noto‘g‘ri: «Aralash» quti aralash emas. Bitta olma chiqdimi — demak, hammasi olma."
   },
   {
    "savol": "Shundan keyin «Nok» yozuvli qutida nima bor?",
    "variantlar": [
     "Aralash — u nok bo‘la olmaydi, olma esa allaqachon boshqa qutida",
     "Olma",
     "Nok",
     "Bo‘sh"
    ],
    "javob": 0,
    "izoh": "«Nok» quti nok emas va olma qutisi topilgan — qoladi aralash. Oxirgi «Olma» qutida esa nok."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Deduksiya + kod",
  "sarlavha": "Shifrlangan xat",
  "hikoya": "Gumondorning cho‘ntagidan qog‘oz topildi. Unda shunday yozuv bor:<br><br>«<b>TPBU CJSEB LFM</b>»<br><br>Holmes qog‘ozga qarab jilmaydi: «Bu juda oddiy shifr. Har bir harfni alifboda bir qadam orqaga surish kifoya». (Shifrda oddiy lotin alifbosi ishlatilgan: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z.)",
  "savol": "Xatda nima deyilgan va uchrashuv qachon bo‘lishi kerak edi?",
  "variantlar": [
   "«SOAT BIRDA KEL» — uchrashuv soat birda",
   "«SOAT IKKIDA KEL» — uchrashuv soat ikkida",
   "«SOAT BIRDA KET» — soat birda ketish kerak",
   "«SOAT BESHDA KEL» — uchrashuv soat beshda"
  ],
  "javob": 0,
  "izoh": "Har bir harfni bir pog‘ona orqaga suramiz: T→S, P→O, B→A, U→T — SOAT. C→B, J→I, S→R, E→D, B→A — BIRDA. L→K, F→E, M→L — KEL. Natija: «SOAT BIRDA KEL». Holmes nafaqat matnni, balki uchrashuv vaqtini ham aniqladi. Bunday shifr Sezar shifri deyiladi: har bir harf alifbo bo‘ylab bir xil qadamga suriladi.",
  "qoshimcha": [
   {
    "savol": "«TPBU» so‘zidagi har bir harfni bir qadam orqaga sursak, qanday so‘z chiqadi?",
    "variantlar": [
     "UQCV",
     "SOAR",
     "SOAT",
     "ROAT"
    ],
    "javob": 2,
    "izoh": "T→S, P→O, B→A, U→T. Har bir harfni alifboda bittadan orqaga surish — Sezar shifrining eng oddiy turi. Oldinga sursak (UQCV), ma’nosiz so‘z chiqadi."
   },
   {
    "savol": "Bunday shifrni yechishda eng muhim belgi nima edi?",
    "variantlar": [
     "Barcha harflar bir xil qadamga surilgani — bitta harfni topsang, qolgani ham ochiladi",
     "Har bir harf boshqacha surilgan",
     "Shifrda raqamlar bor edi",
     "Matn teskari yozilgan"
    ],
    "javob": 0,
    "izoh": "Doimiy siljish — bitta kalit. Bitta to‘g‘ri juftlik butun matnni ochadi."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Holmesning sevimli usuli — kuzatish",
  "sarlavha": "Qadam izlari",
  "hikoya": "Kechqurun qishloqda o‘g‘irlik bo‘ldi. Qor kechqurun yog‘ib, o‘g‘irlikdan sal oldin to‘xtagan. Uch kishi gumondor: ikki sog‘lom yigit va chap oyog‘i jarohatlangan temirchi; temirchi «butun kechqurun uyda yotdim» deydi. O‘g‘irlangan uydan 200 metr narida qordagi qadam izlari topildi: bir oyoq izi ikkinchisidan sezilarli chuqurroq, qadamlar esa notekis — goh qisqa, goh uzun.",
  "savol": "Qaysi dalil temirchiga ishora qiladi?",
  "variantlar": [
   "Izlarning o‘lchami katta botinka bo‘lgani",
   "Ikki izning chuqurligi har xil va qadamlar notekis — bu cho‘loq odamning yurishi",
   "Qor kechqurun yog‘gani",
   "Izlar uy tomon yo‘nalgani"
  ],
  "javob": 1,
  "izoh": "Cho‘loq odam oqsaydi: jarohatlangan oyog‘iga kamroq tayanadi yoki sog‘lom oyog‘iga ko‘proq bosim beradi. Natijada ikki oyoq izining chuqurligi har xil bo‘ladi, qadamlar esa notekis — kalta va uzun qadamlar almashinadi. Holmes uchun botinkaning o‘lchami emas, yurish sur’ati — eng ishonchli «imzo». Diqqat: izlar yo‘nalishi ham, qor vaqti ham bu yerda ikkinchi darajali.",
  "qoshimcha": [
   {
    "savol": "Yangi yog‘gan qor nima uchun muhim?",
    "variantlar": [
     "Qor izlarni o‘chirib yuboradi",
     "Qor sovuq edi",
     "Qor eski izlarni ko‘rsatadi",
     "Izlar yangi — ular aynan o‘g‘irlik kechasiga tegishli"
    ],
    "javob": 3,
    "izoh": "Yangi qor eski izlarni yopadi; uning ustidagi izlar faqat qor yoqqanidan keyin qolgan — vaqtni aniq belgilaydi."
   },
   {
    "savol": "Temirchining «butun kechqurun uyda yotdim» degan gapi qanday baholanadi?",
    "variantlar": [
     "U albatta rost gapirgan",
     "Izlar uning cho‘loq yurishiga mos — gapi dalilga zid, uni tekshirish kerak",
     "U alibi bilan himoyalangan",
     "Izlar unga mos emas"
    ],
    "javob": 1,
    "izoh": "Guvohlik va moddiy dalil zid kelsa, moddiy dalil ustunlik qiladi va gap shubha ostiga tushadi."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Sof mantiq",
  "sarlavha": "Yolg‘onchilar halqasi",
  "hikoya": "Uch aka-uka meros haqida bahslashdi. Holmes har biridan guvohlik oldi. Ali: «Vali — yolg‘onchi». Vali: «Soli — yolg‘onchi». Soli: «Ali ham, Vali ham yolg‘onchi». Holmes tergovchilarga dedi: «Uchovidan faqat bittasi rost gapirmoqda».",
  "savol": "Kim haqiqatni aytdi?",
  "variantlar": [
   "Ali",
   "Vali",
   "Soli",
   "Uchalasi ham yolg‘onchi"
  ],
  "javob": 1,
  "izoh": "Bir-bir tekshiramiz. Ali rost deb olaylik: u «Vali yolg‘onchi» degani to‘g‘ri, demak Vali yolg‘onchi. U holda Valining «Soli yolg‘onchi» degan gapi yolg‘on — Soli rostgo‘y. Ammo rostgo‘y faqat bitta bo‘lishi shart, ziddiyat. Soli rost deb olaylik: «Ali ham, Vali ham yolg‘onchi» degani to‘g‘ri; Ali yolg‘onchi bo‘lsa, uning «Vali yolg‘onchi» degan gapi yolg‘on — Vali rostgo‘y, yana ziddiyat. Vali rost deb olaylik: Alining gapi yolg‘on — Ali yolg‘onchi, to‘g‘ri. Solining gapi yolg‘on, chunki Vali rost — Soli yolg‘onchi. Hammasi mos: haqiqatni Vali aytdi. Ziddiyatli variant yiqiladi, bitta mos variant qoladi.",
  "qoshimcha": [
   {
    "savol": "Agar Ali rost gapirsa, nima bo‘ladi?",
    "variantlar": [
     "Hammasi to‘g‘ri",
     "Vali yolg‘onchi, unda Soli rost gapiradi — ikki rostgo‘y chiqadi, bu shartga zid",
     "Faqat Ali rost",
     "Soli yolg‘onchi"
    ],
    "javob": 1,
    "izoh": "Taxmindan kelib chiqib, zanjirni oxirigacha yurish: shart buzilsa, taxmin rad etiladi."
   },
   {
    "savol": "Solining «Ali ham, Vali ham yolg‘onchi» degan gapi nega yolg‘on?",
    "variantlar": [
     "Ali rost gapirgani uchun",
     "Soli o‘zi haqida gapirgani uchun",
     "Gap rost",
     "Chunki Vali rost gapiryapti — gapning bir qismi noto‘g‘ri bo‘lsa, butun gap yolg‘on"
    ],
    "javob": 3,
    "izoh": "«Va» bilan bog‘langan gap ikkala qismi ham to‘g‘ri bo‘lsagina rost bo‘ladi. Bir qismi yolg‘on — butun gap yolg‘on."
   }
  ]
 },
 {
  "det": "mantiq",
  "kitob": "mantiq",
  "manba": "Mantiqiy jadval",
  "sarlavha": "Uch qavatli uy",
  "hikoya": "Uch qavatli uyda uch kishi yashaydi: shifokor, nonvoy va tikuvchi. Har birining bitta uy hayvoni bor: it, mushuk va to‘tiqu. Holmes qo‘shnilardan eshitdi: (1) shifokor ikkinchi qavatda yashaydi; (2) it shifokordan yuqori qavatda; (3) nonvoy birinchi qavatda; (4) to‘tiqu itdan pastroq qavatda.",
  "savol": "Uchinchi qavatda kim yashaydi va uning uy hayvoni qaysi?",
  "variantlar": [
   "Shifokor, to‘tiqu bilan",
   "Tikuvchi, it bilan",
   "Nonvoy, mushuk bilan",
   "Tikuvchi, to‘tiqu bilan"
  ],
  "javob": 1,
  "izoh": "Qadam-baqadam: shifokor — 2-qavat, nonvoy — 1-qavat, demak 3-qavatga tikuvchi qoladi. It shifokordan yuqorida, ya’ni 3-qavatda (2-qavatdan yuqori boshqa qavat yo‘q). To‘tiqu itdan pastda — 1 yoki 2-qavatda. Natija: 3-qavat — tikuvchi va uning iti. Diqqat: 1- va 2-qavatlarning hayvonlarini bu ma’lumot bilan aniq aytib bo‘lmaydi, lekin berilgan savolga javob aniq — shuning uchun «ma’lumot yetarli emas» varianti bu yerda xato.",
  "qoshimcha": [
   {
    "savol": "Tikuvchi qaysi qavatda yashaydi va nega?",
    "variantlar": [
     "3-qavatda: 1-qavat nonvoyniki, 2-qavat shifokorniki, qolgani tikuvchiga",
     "1-qavatda",
     "2-qavatda",
     "Aniqlab bo‘lmaydi"
    ],
    "javob": 0,
    "izoh": "Uch qavat, uch kishi: ikkitasining joyi ma’lum bo‘lsa, uchinchisi qolgan qavatni egallaydi."
   },
   {
    "savol": "Shartlardan qaysi narsani aniq aniqlab bo‘lmaydi?",
    "variantlar": [
     "Itning egasini",
     "Tikuvchining qavatini",
     "To‘tiqu shifokordami yoki nonvoydami — ikkala holat ham shartlarga mos",
     "Nonvoyning qavatini"
    ],
    "javob": 2,
    "izoh": "To‘tiqu itdan pastda: 1 yoki 2-qavat. Ikkala variant ham shartlarni buzmaydi. Yaxshi mantiqchi «aniqlab bo‘lmaydi» degan javobni ham tan oladi."
   }
  ]
 }
];
