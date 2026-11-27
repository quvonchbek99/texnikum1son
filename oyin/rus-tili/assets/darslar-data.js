/* ТЕТРАДЬ — darslar ma'lumoti.
 * A0–C1. A0–B1 mavzular tartibi 5 ta mashhur darslik (Дорога в Россию, Поехали!, Жили-были,
 * Русский язык в упражнениях, The New Penguin Russian Course) dasturiga tayanadi.
 * Barcha tushuntirish, misol va mashqlar ТЕТРАДЬ uchun yangidan yozilgan.
 */
window.TETRAD_BOOKS = {
  DR: {short:'Дорога в Россию', color:'#8C2F39'},
  PO: {short:'Поехали!', color:'#1F5F8B'},
  ZB: {short:'Жили-были', color:'#B66A12'},
  RU: {short:'Русский язык в упражнениях', color:'#2F6F52'},
  NP: {short:'New Penguin Russian Course', color:'#3D3A6B'}
};

window.TETRAD_GROUPS = [
  {id:'A0', title:'A0 · Nol daraja', level:'A0', desc:'Alifbo, o\'qish qoidalari, salomlashish.', torfl:'—'},
  {id:'A1', title:'A1 · Boshlang\'ich', level:'A1', desc:'O\'zi, oilasi, uy va shahar haqida oddiy gaplar.', torfl:'ТЭУ (элементарный)'},
  {id:'A2', title:'A2 · Bazaviy', level:'A2', desc:'Kundalik vaziyatlar: do\'kon, yo\'l, uchrashuv, reja.', torfl:'ТБУ (базовый)'},
  {id:'B1', title:'B1 · O\'rta', level:'B1', desc:'Fikrni asoslash, voqea aytib berish, murakkab gaplar.', torfl:'ТРКИ-1'},
  {id:'B2', title:'B2 · O\'rtadan yuqori', level:'B2', desc:'Gazeta, ma\'ruza, kitob tili: sifatdosh, ravishdosh, majhul nisbat.', torfl:'ТРКИ-2'},
  {id:'C1', title:'C1 · Yuqori', level:'C1', desc:'Rasmiy va ilmiy uslub, nozik ma\'no farqlari, frazeologiya.', torfl:'ТРКИ-3'}
];

window.TETRAD_LESSONS = [

/* ================================================================ 1 */
{
  id:'alifbo', g:'A0', level:'A0', books:['DR','PO','ZB','NP'],
  title:'Alifbo va talaffuz', ru:'Алфавит и произношение',
  goal:'33 harfni tanish, urg\'u va so\'zlarni to\'g\'ri o\'qish qoidalarini bilish.',
  blocks:[
    {h:'Rus alifbosi', tag:'33 harf',
     html:'<p>Rus alifbosida <b>33 harf</b> bor: 10 unli, 21 undosh va 2 belgi (<span class="ru">ъ, ь</span>). O\'zbek kirill yozuvini bilsangiz, ko\'p harflar sizga tanish. Faqat <span class="ru">Щ</span> va <span class="ru">Ы</span> o\'zbek kirill alifbosida yo\'q.</p>',
     table:{head:['Harf','O\'qilishi','Misol','Tarjima'], rows:[
      ['А а','a','мама','oyi'], ['Б б','b','брат','aka/uka'], ['В в','v','вода','suv'], ['Г г','g','город','shahar'],
      ['Д д','d','дом','uy'], ['Е е','ye / e','еда','ovqat'], ['Ё ё','yo','ёлка','archa'], ['Ж ж','j (jurnal)','журнал','jurnal'],
      ['З з','z','зима','qish'], ['И и','i','игра','o\'yin'], ['Й й','y','май','may'], ['К к','k','книга','kitob'],
      ['Л л','l','лук','piyoz'], ['М м','m','мир','dunyo'], ['Н н','n','нос','burun'], ['О о','o','окно','deraza'],
      ['П п','p','папа','dada'], ['Р р','r','рыба','baliq'], ['С с','s','сок','sharbat'], ['Т т','t','торт','tort'],
      ['У у','u','утро','tong'], ['Ф ф','f','фото','surat'], ['Х х','x','хлеб','non'], ['Ц ц','ts','цирк','sirk'],
      ['Ч ч','ch','чай','choy'], ['Ш ш','sh','школа','maktab'], ['Щ щ','sh\' (yumshoq, cho\'ziq)','борщ','borsh'], ['Ъ ъ','ajratish belgisi','подъезд','podyezd'],
      ['Ы ы','ı (qiz so\'zidagi «i»)','мы','biz'], ['Ь ь','yumshatish belgisi','день','kun'], ['Э э','e','это','bu'], ['Ю ю','yu','юг','janub'],
      ['Я я','ya','я','men']
     ]}},
    {h:'Urg\'u (ударение)', tag:'muhim',
     html:'<p>Rus tilida urg\'u erkin: so\'zning istalgan bo\'g\'inida bo\'lishi mumkin va uni yodlash kerak. Lug\'atlarda urg\'u belgi bilan ko\'rsatiladi: <span class="ru">мáма, окнó, гóрод</span>.</p><div class="rule-box"><b>Akanye — urg\'usiz «o» → «a»</b><ul><li><span class="ru">молоко́</span> → [малако́] — sut</li><li><span class="ru">хорошо́</span> → [харашо́] — yaxshi</li><li><span class="ru">Москва́</span> → [Масква́]</li></ul></div>'},
    {h:'Jarangsizlanish (оглушение)',
     html:'<p>So\'z oxiridagi jarangli undosh jarangsiz o\'qiladi: <b>б→п, в→ф, г→к, д→т, ж→ш, з→с</b>.</p><div class="rule-box"><ul><li><span class="ru">хлеб</span> → [хлеп] — non</li><li><span class="ru">друг</span> → [друк] — do\'st</li><li><span class="ru">город</span> → [горат] — shahar</li><li><span class="ru">нож</span> → [нош] — pichoq</li></ul></div>',
     note:'<b>Maslahat:</b> Avval so\'zni o\'zingiz o\'qing, keyin 🔊 tugmasini bosib eshiting va solishtiring.'},
    {h:'Yumshoq va qattiq undoshlar',
     html:'<p><span class="ru">е, ё, и, ю, я</span> va <span class="ru">ь</span> oldidagi undosh yumshoq o\'qiladi: <span class="ru">мат</span> (mot) — <span class="ru">мать</span> (ona), <span class="ru">брат</span> — <span class="ru">брать</span> (olmoq). Ma\'no o\'zgaradi, shuning uchun <span class="ru">ь</span>ni tashlab ketmang.</p>'}
  ],
  examples:[
    ['Это мама.','Bu oyim.'], ['Это дом.','Bu uy.'], ['Это чай и хлеб.','Bu choy va non.'], ['Москва — город.','Moskva — shahar.']
  ],
  words:[['мама','oyi'],['папа','dada'],['дом','uy'],['вода','suv'],['хлеб','non'],['чай','choy'],['школа','maktab'],['книга','kitob']],
  tasks:[
    {t:'c', q:'Qaysi harf «sh» tovushini beradi?', o:['Ш','Щ','Ж','Ч'], a:0},
    {t:'c', q:'Qaysi harf o\'zbek kirill alifbosida yo\'q?', o:['Ы','Ш','Я','Ю'], a:0},
    {t:'c', q:'«хлеб» so\'zi oxirida qanday o\'qiladi?', o:['[хлеп]','[хлеб]','[хлев]'], a:0},
    {t:'c', q:'«молоко» qanday o\'qiladi?', o:['[малако]','[молоко]','[мулуко]'], a:0},
    {t:'c', q:'Qaysi harf «ts» tovushini beradi?', o:['Ц','С','Ч','З'], a:0},
    {t:'c', q:'«мать» so\'zidagi ь nima qiladi?', o:['т ni yumshatadi','so\'zni ko\'plik qiladi','hech narsa'], a:0},
    {t:'c', q:'«город» so\'zi oxiri qanday o\'qiladi?', o:['[горат]','[город]','[гарод]'], a:0},
    {t:'i', q:'«Biz» so\'zini ruscha yozing (2 harf).', a:['мы']},
    {t:'i', q:'«Choy» so\'zini ruscha yozing.', a:['чай']},
    {t:'i', q:'«Uy» so\'zini ruscha yozing.', a:['дом']}
  ]
},

/* ================================================================ 2 */
{
  id:'tanishuv', g:'A0', level:'A0', books:['DR','PO','ZB','NP'],
  title:'Salomlashish va tanishuv', ru:'Знакомство: Кто это? Что это?',
  goal:'Salomlashish, o\'zini tanishtirish, «Кто это?» va «Что это?» savollarini berish.',
  blocks:[
    {h:'Кто это? — Что это?',
     html:'<p>Rus tilida <b>jonli</b> narsalar (odamlar, hayvonlar) uchun <span class="ru">кто?</span> (kim?), <b>jonsiz</b> narsalar uchun <span class="ru">что?</span> (nima?) so\'raladi. O\'zbek tilidan farqli ravishda hayvonlar ham <span class="ru">кто?</span> bilan so\'raladi.</p><div class="rule-box"><ul><li><span class="ru">— Кто это? — Это брат.</span> (Bu kim? — Bu akam.)</li><li><span class="ru">— Кто это? — Это кошка.</span> (Bu kim? — Bu mushuk.)</li><li><span class="ru">— Что это? — Это книга.</span> (Bu nima? — Bu kitob.)</li></ul></div>',
     note:'<b>Diqqat:</b> rus tilida hozirgi zamonda «bo\'lmoq» fe\'li tushib qoladi: <span class="ru">Я студент.</span> = Men talabaman. «Есть» qo\'shilmaydi.'},
    {h:'Salomlashish va xayrlashish',
     table:{head:['Ruscha','Qachon','Tarjima'], rows:[
      ['Здравствуйте!','rasmiy, kattalarga','Assalomu alaykum!'], ['Привет!','do\'stlarga','Salom!'],
      ['Доброе утро!','ertalab','Xayrli tong!'], ['Добрый день!','kunduzi','Xayrli kun!'], ['Добрый вечер!','kechqurun','Xayrli kech!'],
      ['До свидания!','rasmiy','Xayr!'], ['Пока!','do\'stlarga','Hozircha!'], ['Как дела?','hol so\'rash','Ishlar qalay?']
     ]}},
    {h:'Tanishuv iboralari',
     html:'<div class="rule-box"><ul><li><span class="ru">Как вас зовут?</span> — Ismingiz nima? (rasmiy)</li><li><span class="ru">Как тебя зовут?</span> — Isming nima? (norasmiy)</li><li><span class="ru">Меня зовут Алишер.</span> — Mening ismim Alisher.</li><li><span class="ru">Очень приятно!</span> — Tanishganimdan xursandman!</li><li><span class="ru">Откуда вы?</span> — Qayerdansiz? — <span class="ru">Я из Узбекистана.</span></li></ul></div><p>Rus tilida <span class="ru">вы</span> — «siz» (hurmat yoki ko\'plik), <span class="ru">ты</span> — «sen».</p>'}
  ],
  dialog:[
    ['A','Здравствуйте! Как вас зовут?','Assalomu alaykum! Ismingiz nima?'],
    ['B','Меня зовут Дильноза. А вас?','Mening ismim Dilnoza. Sizniki-chi?'],
    ['A','Меня зовут Олег. Очень приятно.','Mening ismim Oleg. Tanishganimdan xursandman.'],
    ['B','Мне тоже. Вы студент?','Men ham. Siz talabamisiz?'],
    ['A','Нет, я врач. А вы?','Yo\'q, men shifokorman. Siz-chi?'],
    ['B','Я учительница. Я из Ташкента.','Men o\'qituvchiman. Men Toshkentdanman.']
  ],
  words:[['здравствуйте','assalomu alaykum'],['привет','salom'],['спасибо','rahmat'],['пожалуйста','iltimos; marhamat'],['да','ha'],['нет','yo\'q'],['кто','kim'],['что','nima'],['это','bu'],['очень приятно','tanishganimdan xursandman']],
  tasks:[
    {t:'c', q:'— ___ это? — Это Анвар.', o:['Кто','Что'], a:0},
    {t:'c', q:'— ___ это? — Это словарь.', o:['Что','Кто'], a:0},
    {t:'c', q:'— ___ это? — Это собака.', o:['Кто','Что'], a:0, x:'Hayvonlar ham «кто?» bilan so\'raladi.'},
    {t:'c', q:'Ustozga qanday salom berasiz?', o:['Здравствуйте!','Привет!','Пока!'], a:0},
    {t:'c', q:'Kechqurun uchrashganda:', o:['Добрый вечер!','Доброе утро!','Спокойной ночи!'], a:0},
    {t:'i', q:'Меня ___ Алишер.', a:['зовут']},
    {t:'i', q:'Как ___ зовут? (siz — rasmiy)', a:['вас']},
    {t:'i', q:'Очень ___!', a:['приятно']},
    {t:'c', q:'«Men talabaman» ruscha:', o:['Я студент.','Я есть студент.','Я студента.'], a:0},
    {t:'i', q:'Я ___ Узбекистана. (dan)', a:['из']}
  ]
},

/* ================================================================ 3 */
{
  id:'jins', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Otning jinsi', ru:'Род существительных: он, она, оно',
  goal:'Otning jinsini oxiridan aniqlash va o\'rniga он / она / оно qo\'yish.',
  blocks:[
    {h:'Uch jins', tag:'asosiy qoida',
     html:'<p>O\'zbek tilida jins yo\'q, rus tilida esa har bir ot <b>erkak</b>, <b>ayol</b> yoki <b>o\'rta</b> jinsda bo\'ladi. Jinsni ko\'pincha so\'z oxiri ko\'rsatadi.</p>',
     table:{head:['Jins','Olmosh','Oxiri','Misollar'], rows:[
      ['Erkak (м.р.)','он','undosh, -й, -ь','<span class="ru">дом, музей, словарь</span>'],
      ['Ayol (ж.р.)','она','-а, -я, -ь','<span class="ru">мама, неделя, тетрадь</span>'],
      ['O\'rta (ср.р.)','оно','-о, -е, -мя','<span class="ru">окно, море, имя</span>']
     ]}},
    {h:'-ь bilan tugaydigan so\'zlar',
     html:'<p><span class="ru">-ь</span> bilan tugagan so\'z erkak ham, ayol ham bo\'lishi mumkin. Ularni lug\'at bilan yodlang:</p><div class="rule-box"><ul><li>erkak: <span class="ru">день, словарь, учитель, портфель</span></li><li>ayol: <span class="ru">тетрадь, дверь, ночь, площадь</span></li></ul></div>',
     note:'<b>Istisno:</b> <span class="ru">папа, дедушка, мужчина, дядя</span> -а/-я bilan tugasa ham erkak jinsida, chunki ma\'nosi erkakni bildiradi: <span class="ru">папа — он</span>.'},
    {h:'Чей? Где? — olmosh bilan javob',
     html:'<p>Narsaning qayerdaligini so\'raganda jinsga mos olmosh ishlatiladi: <span class="ru">— Где словарь? — Вот он.</span> <span class="ru">— Где книга? — Вот она.</span> <span class="ru">— Где окно? — Вот оно.</span></p>'}
  ],
  examples:[['Где журнал? — Вот он.','Jurnal qayerda? — Mana u.'],['Где ручка? — Вот она.','Ruchka qayerda? — Mana u.'],['Где письмо? — Вот оно.','Xat qayerda? — Mana u.'],['Папа дома. Он отдыхает.','Dadam uyda. U dam olyapti.']],
  words:[['стол','stol (он)'],['книга','kitob (она)'],['окно','deraza (оно)'],['словарь','lug\'at (он)'],['тетрадь','daftar (она)'],['море','dengiz (оно)'],['время','vaqt (оно)'],['папа','dada (он)']],
  tasks:[
    {t:'c', q:'стол — ___', o:['он','она','оно'], a:0, ns:true},
    {t:'c', q:'машина — ___', o:['он','она','оно'], a:1, ns:true},
    {t:'c', q:'окно — ___', o:['он','она','оно'], a:2, ns:true},
    {t:'c', q:'музей — ___', o:['он','она','оно'], a:0, ns:true},
    {t:'c', q:'тетрадь — ___', o:['он','она','оно'], a:1, ns:true},
    {t:'c', q:'имя — ___', o:['он','она','оно'], a:2, ns:true},
    {t:'c', q:'дедушка — ___', o:['он','она','оно'], a:0, ns:true, x:'Ma\'nosi erkak.'},
    {t:'c', q:'словарь — ___', o:['он','она','оно'], a:0, ns:true},
    {t:'i', q:'— Где море? — Вот ___.', a:['оно']},
    {t:'i', q:'— Где неделя? Где семья? — Вот ___.', a:['она']}
  ]
},

/* ================================================================ 4 */
{
  id:'koplik', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Otlarning ko\'pligi', ru:'Множественное число',
  goal:'Otlarni -ы, -и, -а, -я qo\'shimchalari bilan ko\'plikka qo\'yish.',
  blocks:[
    {h:'Asosiy qo\'shimchalar',
     table:{head:['Birlik','Qoida','Ko\'plik'], rows:[
      ['<span class="ru">стол, журнал</span>','undosh + <span class="end">ы</span>','<span class="ru">стол<span class="end">ы</span>, журнал<span class="end">ы</span></span>'],
      ['<span class="ru">мама, лампа</span>','-а → <span class="end">ы</span>','<span class="ru">мам<span class="end">ы</span>, ламп<span class="end">ы</span></span>'],
      ['<span class="ru">музей, неделя, словарь</span>','-й, -я, -ь → <span class="end">и</span>','<span class="ru">музе<span class="end">и</span>, недел<span class="end">и</span>, словар<span class="end">и</span></span>'],
      ['<span class="ru">окно, письмо</span>','-о → <span class="end">а</span>','<span class="ru">окн<span class="end">а</span>, письм<span class="end">а</span></span>'],
      ['<span class="ru">море, поле</span>','-е → <span class="end">я</span>','<span class="ru">мор<span class="end">я</span>, пол<span class="end">я</span></span>']
     ]}},
    {h:'7 harf qoidasi', tag:'imlo',
     html:'<p><b>г, к, х, ж, ш, щ, ч</b> harflaridan keyin hech qachon <span class="ru">ы</span> yozilmaydi — faqat <span class="ru">и</span>:</p><div class="rule-box"><ul><li><span class="ru">книга → книги, урок → уроки</span></li><li><span class="ru">нож → ножи, карандаш → карандаши</span></li><li><span class="ru">врач → врачи, муха → мухи</span></li></ul></div>'},
    {h:'Yodlash kerak bo\'lgan shakllar',
     table:{head:['Birlik','Ko\'plik','Tarjima'], rows:[
      ['человек','люди','odam — odamlar'], ['ребёнок','дети','bola — bolalar'], ['друг','друзья','do\'st — do\'stlar'],
      ['брат','братья','aka-uka'], ['город','города','shaharlar'], ['дом','дома','uylar'], ['глаз','глаза','ko\'zlar'], ['имя','имена','ismlar']
     ]}}
  ],
  examples:[['Это мои друзья.','Bular mening do\'stlarim.'],['На столе книги и тетради.','Stolda kitoblar va daftarlar bor.'],['В городе новые дома.','Shaharda yangi uylar bor.']],
  words:[['студенты','talabalar'],['книги','kitoblar'],['окна','derazalar'],['люди','odamlar'],['дети','bolalar'],['друзья','do\'stlar']],
  tasks:[
    {t:'i', q:'журнал → ___', a:['журналы']},
    {t:'i', q:'книга → ___', a:['книги'], h:'7 harf qoidasini eslang.'},
    {t:'i', q:'окно → ___', a:['окна']},
    {t:'i', q:'музей → ___', a:['музеи']},
    {t:'i', q:'тетрадь → ___', a:['тетради']},
    {t:'i', q:'море → ___', a:['моря']},
    {t:'c', q:'человек → ___', o:['люди','человеки','человека'], a:0},
    {t:'c', q:'ребёнок → ___', o:['дети','ребёнки','ребёнка'], a:0},
    {t:'c', q:'врач → ___', o:['врачи','врачы','врача'], a:0},
    {t:'c', q:'город → ___', o:['города','городы','городи'], a:0}
  ]
},

/* ================================================================ 5 */
{
  id:'egalik', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Egalik olmoshlari', ru:'Чей? Чья? Чьё? Чьи? — мой, твой, наш…',
  goal:'«Kimniki?» degan savolga jinsga mos olmosh bilan javob berish.',
  blocks:[
    {h:'Olmosh ot bilan moslashadi',
     html:'<p>O\'zbek tilida «mening» doim bir xil, rus tilida esa olmosh ot jinsi va soniga moslashadi.</p>',
     table:{head:['','он (м.р.)','она (ж.р.)','оно (ср.р.)','они (мн.ч.)'], rows:[
      ['savol','чей?','чья?','чьё?','чьи?'],
      ['mening','мой','моя','моё','мои'],
      ['sening','твой','твоя','твоё','твои'],
      ['bizning','наш','наша','наше','наши'],
      ['sizning','ваш','ваша','ваше','ваши'],
      ['uning (erkak)','его','его','его','его'],
      ['uning (ayol)','её','её','её','её'],
      ['ularning','их','их','их','их']
     ]}},
    {h:'Его, её, их — o\'zgarmaydi',
     html:'<p><span class="ru">его, её, их</span> egasini ko\'rsatadi, narsaning jinsiga qaramaydi: <span class="ru">его мама, его папа, его окно</span>. Nimani tanlashingiz egasiga bog\'liq: Anvarning kitobi — <span class="ru">его книга</span>, Laylonin kitobi — <span class="ru">её книга</span>.</p>',
     note:'<b>Diqqat:</b> <span class="ru">его</span> [yevo] deb o\'qiladi — «г» bu yerda «v» kabi talaffuz qilinadi.'}
  ],
  examples:[['— Чей это телефон? — Это мой телефон.','Bu kimning telefoni? — Bu mening telefonim.'],['— Чья это сумка? — Это её сумка.','Bu kimning sumkasi? — Bu uning (ayol) sumkasi.'],['— Чьи это дети? — Это наши дети.','Bular kimning bolalari? — Bular bizning bolalarimiz.']],
  words:[['мой','mening (м)'],['моя','mening (ж)'],['моё','mening (ср)'],['мои','mening (ko\'plik)'],['наш','bizning'],['ваш','sizning'],['его','uning (erkak)'],['её','uning (ayol)']],
  tasks:[
    {t:'c', q:'Это ___ брат.', o:['мой','моя','моё'], a:0},
    {t:'c', q:'Это ___ сестра.', o:['моя','мой','мои'], a:0},
    {t:'c', q:'Это ___ окно.', o:['моё','моя','мой'], a:0},
    {t:'c', q:'Это ___ друзья.', o:['мои','мой','моя'], a:0},
    {t:'c', q:'— ___ это книга? — Моя.', o:['Чья','Чей','Чьё'], a:0},
    {t:'c', q:'— ___ это словарь?', o:['Чей','Чья','Чьи'], a:0},
    {t:'c', q:'Это Анна. Это ___ дом.', o:['её','его','их'], a:0},
    {t:'i', q:'Это мы. Это ___ класс. (bizning)', a:['наш']},
    {t:'i', q:'Это вы? Это ___ машина? (sizning)', a:['ваша']},
    {t:'i', q:'Это Олег и Ира. Это ___ квартира. (ularning)', a:['их']}
  ]
},

/* ================================================================ 6 */
{
  id:'sifat', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Sifatlar', ru:'Какой? Какая? Какое? Какие? — прилагательные',
  goal:'Sifatni ot bilan jins va son bo\'yicha moslashtirish.',
  blocks:[
    {h:'Sifat qo\'shimchalari',
     table:{head:['Savol','Qattiq','Yumshoq','7 harfdan keyin','Urg\'uli -ой'], rows:[
      ['какой? (м)','нов<span class="end">ый</span>','син<span class="end">ий</span>','русск<span class="end">ий</span>','молод<span class="end">ой</span>'],
      ['какая? (ж)','нов<span class="end">ая</span>','син<span class="end">яя</span>','русск<span class="end">ая</span>','молод<span class="end">ая</span>'],
      ['какое? (ср)','нов<span class="end">ое</span>','син<span class="end">ее</span>','русск<span class="end">ое</span>','молод<span class="end">ое</span>'],
      ['какие? (мн)','нов<span class="end">ые</span>','син<span class="end">ие</span>','русск<span class="end">ие</span>','молод<span class="end">ые</span>']
     ]}},
    {h:'Moslashuv',
     html:'<p>Sifat doim otga «ergashadi»: <span class="ru">новый дом, новая школа, новое окно, новые дома</span>. Avval otning jinsini aniqlang, keyin qo\'shimchani tanlang.</p><div class="rule-box"><ul><li><span class="ru">Какой это город? — Это большой город.</span></li><li><span class="ru">Какая сегодня погода? — Сегодня хорошая погода.</span></li><li><span class="ru">Какие у вас глаза? — Карие.</span></li></ul></div>'},
    {h:'Zid ma\'noli juftliklar',
     table:{head:['Ruscha','Tarjima'], rows:[
      ['большой — маленький','katta — kichik'], ['новый — старый','yangi — eski'], ['хороший — плохой','yaxshi — yomon'],
      ['красивый — некрасивый','chiroyli — xunuk'], ['дорогой — дешёвый','qimmat — arzon'], ['лёгкий — трудный','oson — qiyin']
     ]}}
  ],
  examples:[['Ташкент — большой и красивый город.','Toshkent — katta va chiroyli shahar.'],['У меня новая машина.','Mening yangi mashinam bor.'],['Это интересное задание.','Bu qiziqarli topshiriq.'],['Здесь живут добрые люди.','Bu yerda mehribon odamlar yashaydi.']],
  words:[['новый','yangi'],['старый','eski'],['большой','katta'],['маленький','kichik'],['хороший','yaxshi'],['плохой','yomon'],['красивый','chiroyli'],['интересный','qiziqarli']],
  tasks:[
    {t:'c', q:'Это ___ дом.', o:['новый','новая','новое'], a:0},
    {t:'c', q:'Это ___ книга.', o:['интересная','интересный','интересное'], a:0},
    {t:'c', q:'Это ___ море.', o:['синее','синий','синяя'], a:0},
    {t:'c', q:'Это ___ студенты.', o:['хорошие','хороший','хорошая'], a:0},
    {t:'c', q:'___ это город? — Большой.', o:['Какой','Какая','Какое'], a:0},
    {t:'i', q:'Это русск___ язык.', a:['ий','русский'], h:'7 harf qoidasi: к dan keyin ы yozilmaydi.'},
    {t:'i', q:'Сегодня хорош___ погода.', a:['ая','хорошая']},
    {t:'i', q:'У меня нов___ телефон.', a:['ый','новый']},
    {t:'i', q:'Это молод___ учитель. (urg\'uli oxir)', a:['ой','молодой']},
    {t:'c', q:'«qimmat» so\'ziga zid:', o:['дешёвый','дорогой','большой'], a:0}
  ]
},

/* ================================================================ 7 */
{
  id:'fel', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Fe\'l: hozirgi zamon', ru:'Глагол: настоящее время, I и II спряжение',
  goal:'Fe\'llarni shaxs bo\'yicha tuslash (я, ты, он…) va ikki tuslanishni farqlash.',
  blocks:[
    {h:'Ikki tuslanish', tag:'asosiy jadval',
     html:'<p>Rus fe\'llari hozirgi zamonda ikki xil tuslanadi. I tuslanishda unli <b>е</b>, II tuslanishda <b>и</b> bo\'ladi.</p>',
     table:{head:['Shaxs','I: читать (o\'qimoq)','II: говорить (gapirmoq)'], rows:[
      ['я','чита<span class="end">ю</span>','говор<span class="end">ю</span>'],
      ['ты','чита<span class="end">ешь</span>','говор<span class="end">ишь</span>'],
      ['он / она','чита<span class="end">ет</span>','говор<span class="end">ит</span>'],
      ['мы','чита<span class="end">ем</span>','говор<span class="end">им</span>'],
      ['вы','чита<span class="end">ете</span>','говор<span class="end">ите</span>'],
      ['они','чита<span class="end">ют</span>','говор<span class="end">ят</span>']
     ]}},
    {h:'Qaysi tuslanish ekanini qanday bilaman?',
     html:'<div class="rule-box"><ul><li>Ko\'pchilik <b>-ать, -ять</b> fe\'llari — I tuslanish: <span class="ru">делать, знать, гулять, понимать</span>.</li><li>Ko\'pchilik <b>-ить</b> fe\'llari — II tuslanish: <span class="ru">говорить, любить, звонить, учить</span>.</li><li>II tuslanishda <b>я</b> shaklida undosh almashishi mumkin: <span class="ru">любить → люблю, ходить → хожу, видеть → вижу</span>.</li></ul></div>',
     note:'<b>Eng muhim noto\'g\'ri fe\'llar:</b> <span class="ru">жить → живу, живёшь; писать → пишу, пишешь; хотеть → хочу, хочешь, хочет, хотим, хотите, хотят; мочь → могу, можешь, могут.</span>'},
    {h:'-ся fe\'llari',
     html:'<p><span class="ru">-ся</span> qo\'shimchasi unlidan keyin <span class="ru">-сь</span> bo\'ladi: <span class="ru">я занимаюсь, ты занимаешься, он занимается, мы занимаемся, вы занимаетесь, они занимаются</span> (shug\'ullanmoq).</p>'}
  ],
  examples:[['Я читаю книгу, а брат слушает музыку.','Men kitob o\'qiyapman, akam esa musiqa tinglayapti.'],['Вы говорите по-русски?','Siz ruscha gapirasizmi?'],['Мы живём в Ташкенте.','Biz Toshkentda yashaymiz.'],['Что ты делаешь вечером?','Kechqurun nima qilasan?']],
  words:[['читать','o\'qimoq'],['писать','yozmoq'],['говорить','gapirmoq'],['знать','bilmoq'],['понимать','tushunmoq'],['жить','yashamoq'],['любить','sevmoq'],['хотеть','xohlamoq']],
  tasks:[
    {t:'i', q:'Я ___ по-русски. (говорить)', a:['говорю']},
    {t:'i', q:'Ты ___ газету? (читать)', a:['читаешь']},
    {t:'i', q:'Они ___ в Самарканде. (жить)', a:['живут']},
    {t:'i', q:'Мы ___ урок. (понимать)', a:['понимаем']},
    {t:'i', q:'Вы ___ письмо? (писать)', a:['пишете']},
    {t:'c', q:'Я ___ чай. (любить)', o:['люблю','любю','любит'], a:0},
    {t:'c', q:'Он ___ спать. (хотеть)', o:['хочет','хотит','хочит'], a:0},
    {t:'c', q:'Они ___ по-английски. (говорить)', o:['говорят','говорют','говорит'], a:0},
    {t:'c', q:'Я ___ спортом. (заниматься)', o:['занимаюсь','занимаюся','занимается'], a:0},
    {t:'i', q:'Я не ___ прийти. (мочь)', a:['могу']}
  ]
},

/* ================================================================ 8 */
{
  id:'predlojniy', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Joy kelishigi (Predlojniy)', ru:'Предложный падеж: где? о ком? о чём?',
  goal:'«Qayerda?» savoliga в / на bilan javob berish va «kim haqida?» deb gapirish.',
  blocks:[
    {h:'Qo\'shimcha: -е', tag:'6-kelishik',
     html:'<p>Predlojniy kelishik doim old ko\'makchi bilan keladi: <b>в, на, о</b>. Ko\'pchilik so\'zlarga <span class="end">-е</span> qo\'shiladi; <span class="ru">-ия, -ие</span> va <span class="ru">-ь</span> (ayol jinsi) bilan tugaganlarga <span class="end">-и</span>.</p>',
     table:{head:['Nima?','Где? (qayerda?)','Qoida'], rows:[
      ['город','в город<span class="end">е</span>','undosh + е'], ['школа','в школ<span class="end">е</span>','а → е'], ['море','на мор<span class="end">е</span>','е → е'],
      ['музей','в музе<span class="end">е</span>','й → е'], ['тетрадь','в тетрад<span class="end">и</span>','ь (ж) → и'], ['Россия','в Росси<span class="end">и</span>','ия → ии'], ['общежитие','в общежити<span class="end">и</span>','ие → ии']
     ]}},
    {h:'В yoki НА?',
     html:'<div class="rule-box"><ul><li><b>в</b> — ichida: <span class="ru">в доме, в школе, в магазине, в Ташкенте, в Узбекистане</span>.</li><li><b>на</b> — ustida, ochiq joyda, tadbirda: <span class="ru">на столе, на улице, на работе, на уроке, на концерте, на рынке, на вокзале</span>.</li></ul></div><p>Ba\'zi so\'zlar <b>на</b> bilan yodlanadi: <span class="ru">на почте, на заводе, на факультете, на стадионе</span>.</p>',
     note:'<b>Maxsus shakl:</b> ba\'zi so\'zlar urg\'uli <span class="ru">-у</span> oladi: <span class="ru">в саду, в лесу, на полу, в аэропорту, на мосту, в шкафу</span>.'},
    {h:'О ком? О чём? — kim/nima haqida',
     html:'<p><span class="ru">думать, говорить, рассказывать, мечтать</span> fe\'llari <b>о</b> bilan keladi: <span class="ru">Я думаю о маме. Мы говорим о фильме.</span> Unli bilan boshlangan so\'zdan oldin <b>об</b>: <span class="ru">об Ольге, об уроке</span>. Olmoshlar: <span class="ru">обо мне, о тебе, о нём, о ней, о нас, о вас, о них</span>.</p>'}
  ],
  examples:[['Мой брат работает на заводе.','Akam zavodda ishlaydi.'],['Книга лежит на столе.','Kitob stolda yotibdi.'],['Летом мы отдыхаем на море.','Yozda dengizda dam olamiz.'],['Бабушка часто рассказывает о детстве.','Buvim bolaligi haqida tez-tez gapirib beradi.']],
  words:[['где','qayerda'],['в','ichida'],['на','ustida; -da'],['о / об','haqida'],['работа','ish'],['улица','ko\'cha'],['магазин','do\'kon'],['университет','universitet']],
  tasks:[
    {t:'i', q:'Я живу в ___. (Ташкент)', a:['Ташкенте']},
    {t:'i', q:'Мама работает в ___. (школа)', a:['школе']},
    {t:'i', q:'Студенты в ___. (музей)', a:['музее']},
    {t:'i', q:'Мы были в ___. (Россия)', a:['России']},
    {t:'c', q:'Ручка лежит ___ столе.', o:['на','в','о'], a:0},
    {t:'c', q:'Папа сейчас ___ работе.', o:['на','в'], a:0},
    {t:'c', q:'Дети гуляют в ___.', o:['саду','саде','сад'], a:0, x:'Maxsus -у shakli.'},
    {t:'c', q:'Я думаю ___ экзамене.', o:['об','о','на'], a:0, x:'Unli oldidan «об».'},
    {t:'c', q:'Он часто говорит о ___. (она)', o:['ней','неё','ей'], a:0},
    {t:'i', q:'Запиши слово в ___. (тетрадь)', a:['тетради']}
  ]
},

/* ================================================================ 9 */
{
  id:'vinitelniy', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'Tushum kelishigi (Vinitelniy)', ru:'Винительный падеж: кого? что? куда?',
  goal:'Fe\'l ta\'sir qiladigan narsani (nimani? kimni?) va yo\'nalishni (qayerga?) to\'g\'ri aytish.',
  blocks:[
    {h:'Nima o\'zgaradi?', tag:'4-kelishik',
     table:{head:['Jins','Jonsiz (что?)','Jonli (кого?)'], rows:[
      ['Erkak','o\'zgarmaydi: <span class="ru">я вижу дом</span>','+а/я: <span class="ru">я вижу брат<span class="end">а</span>, учител<span class="end">я</span></span>'],
      ['Ayol -а/-я','<span class="ru">я читаю книг<span class="end">у</span></span>','<span class="ru">я люблю мам<span class="end">у</span>, Тан<span class="end">ю</span></span>'],
      ['Ayol -ь','o\'zgarmaydi: <span class="ru">тетрадь, дверь</span>','<span class="ru">я вижу мать, дочь</span>'],
      ['O\'rta','o\'zgarmaydi: <span class="ru">окно, письмо</span>','—']
     ]}},
    {h:'Куда? — yo\'nalish',
     html:'<p>Harakatni bildiruvchi fe\'llar (<span class="ru">идти, ехать, ходить, приходить</span>) bilan <b>в / на + vinitelniy</b> keladi:</p><div class="rule-box"><ul><li><span class="ru">Где? — в школе</span> → <span class="ru">Куда? — в школу</span></li><li><span class="ru">Где? — на работе</span> → <span class="ru">Куда? — на работу</span></li><li><span class="ru">Где? — в парке</span> → <span class="ru">Куда? — в парк</span></li></ul></div>'},
    {h:'Olmoshlar',
     table:{head:['я','ты','он','она','мы','вы','они'], rows:[[ 'меня','тебя','его','её','нас','вас','их' ]]},
     note:'<b>Eslatma:</b> old ko\'makchidan keyin <span class="ru">его, её, их</span> «н» oladi: <span class="ru">на него, про неё, за них</span>.'}
  ],
  examples:[['Я жду брата.','Men akamni kutyapman.'],['Ты знаешь эту девушку?','Sen bu qizni taniysanmi?'],['Утром я иду в университет.','Ertalab universitetga boraman.'],['Вечером мы смотрим новый фильм.','Kechqurun yangi film ko\'ramiz.']],
  words:[['куда','qayerga'],['видеть','ko\'rmoq'],['ждать','kutmoq'],['смотреть','ko\'rmoq, tomosha qilmoq'],['слушать','tinglamoq'],['покупать','sotib olmoq'],['идти','bormoq'],['ехать','(transportda) bormoq']],
  tasks:[
    {t:'i', q:'Я читаю ___. (книга)', a:['книгу']},
    {t:'i', q:'Мы слушаем ___. (музыка)', a:['музыку']},
    {t:'i', q:'Я жду ___. (друг)', a:['друга']},
    {t:'i', q:'Ты любишь ___? (Анна)', a:['Анну']},
    {t:'c', q:'Я вижу ___. (дом)', o:['дом','дома','дому'], a:0, x:'Erkak jinsi jonsiz — o\'zgarmaydi.'},
    {t:'c', q:'Завтра мы идём ___ театр.', o:['в','на'], a:0},
    {t:'c', q:'Папа едет на ___.', o:['работу','работе','работа'], a:0},
    {t:'c', q:'— Где ты? — Я иду ___. ', o:['в магазин','в магазине'], a:0},
    {t:'c', q:'Я хорошо знаю ___. (он)', o:['его','ему','него'], a:0},
    {t:'i', q:'Мама зовёт ___. (мы)', a:['нас']}
  ]
},

/* ================================================================ 10 */
{
  id:'otgan', g:'A1', level:'A1', books:['DR','PO','ZB','RU','NP'],
  title:'O\'tgan zamon', ru:'Прошедшее время: что делал? что сделал?',
  goal:'O\'tgan zamonni jins va son bo\'yicha yasash.',
  blocks:[
    {h:'Yasalishi juda oson', tag:'-л, -ла, -ло, -ли',
     html:'<p>Noaniq shakldan <span class="ru">-ть</span> tushiriladi va shaxs emas, <b>jins</b>ga qarab qo\'shimcha qo\'shiladi:</p>',
     table:{head:['','читать','говорить','быть'], rows:[
      ['он / я (erkak)','чита<span class="end">л</span>','говори<span class="end">л</span>','бы<span class="end">л</span>'],
      ['она / я (ayol)','чита<span class="end">ла</span>','говори<span class="end">ла</span>','бы<span class="end">ла</span>'],
      ['оно','чита<span class="end">ло</span>','говори<span class="end">ло</span>','бы<span class="end">ло</span>'],
      ['мы, вы, они','чита<span class="end">ли</span>','говори<span class="end">ли</span>','бы<span class="end">ли</span>']
     ]}},
    {h:'Muhim istisnolar',
     html:'<div class="rule-box"><ul><li><span class="ru">идти → шёл, шла, шли</span> (bordi)</li><li><span class="ru">мочь → мог, могла, могли</span></li><li><span class="ru">есть → ел, ела, ели</span> (yedi)</li><li><span class="ru">нести → нёс, несла, несли</span></li></ul></div><p>Ayol kishi o\'zi haqida gapirganda: <span class="ru">Я была дома.</span> Erkak: <span class="ru">Я был дома.</span> <span class="ru">Вы</span> (hurmat bilan bitta odamga) doim ko\'plikda: <span class="ru">Вы были в Москве?</span></p>'},
    {h:'«Bor edi» — Был, была, было',
     html:'<p>Hozirgi zamonda tushib qoladigan «bo\'lmoq» o\'tgan zamonda albatta aytiladi: <span class="ru">Сегодня я дома. → Вчера я был дома.</span> <span class="ru">Вчера было холодно.</span> (Kecha sovuq edi.)</p>'}
  ],
  examples:[['Вчера я смотрел футбол.','Kecha futbol ko\'rdim. (erkak)'],['Мама приготовила плов.','Oyim osh pishirdi.'],['Летом мы были в Самарканде.','Yozda Samarqandda bo\'ldik.'],['Раньше здесь было кафе.','Ilgari bu yerda kafe bor edi.']],
  words:[['вчера','kecha'],['раньше','ilgari'],['давно','anchadan beri'],['недавно','yaqinda'],['в прошлом году','o\'tgan yili'],['на прошлой неделе','o\'tgan hafta']],
  tasks:[
    {t:'i', q:'Вчера Анвар ___ книгу. (читать)', a:['читал']},
    {t:'i', q:'Мама ___ по телефону. (говорить)', a:['говорила']},
    {t:'i', q:'Мы ___ в кино. (быть)', a:['были']},
    {t:'i', q:'Солнце ___ ярко. (светить)', a:['светило']},
    {t:'c', q:'Нигора: «Я ___ дома».', o:['была','был','были'], a:0},
    {t:'c', q:'Он ___ домой пешком. (идти)', o:['шёл','идтил','идил'], a:0},
    {t:'c', q:'Вчера ___ холодно.', o:['было','был','была'], a:0},
    {t:'c', q:'Вы ___ в Москве, профессор?', o:['были','был','была'], a:0},
    {t:'i', q:'Мы долго ___ автобус. (ждать)', a:['ждали']},
    {t:'c', q:'Она не ___ прийти. (мочь)', o:['могла','мочла','могал'], a:0}
  ]
},

/* ================================================================ 11 */
{
  id:'sonlar', g:'A1', level:'A1', books:['DR','PO','ZB','NP'],
  title:'Sonlar, vaqt va narx', ru:'Числа, время, цена, возраст',
  goal:'Sanash, soatni aytish, narx va yoshni so\'rash.',
  blocks:[
    {h:'Sonlar 1–1000',
     table:{head:['','','',''], rows:[
      ['1 один','11 одиннадцать','10 десять','100 сто'],
      ['2 два','12 двенадцать','20 двадцать','200 двести'],
      ['3 три','13 тринадцать','30 тридцать','300 триста'],
      ['4 четыре','14 четырнадцать','40 сорок','400 четыреста'],
      ['5 пять','15 пятнадцать','50 пятьдесят','500 пятьсот'],
      ['6 шесть','16 шестнадцать','60 шестьдесят','600 шестьсот'],
      ['7 семь','17 семнадцать','70 семьдесят','700 семьсот'],
      ['8 восемь','18 восемнадцать','80 восемьдесят','800 восемьсот'],
      ['9 девять','19 девятнадцать','90 девяносто','900 девятьсот'],
      ['','','','1000 тысяча']
     ]}},
    {h:'1, 2–4, 5+ qoidasi', tag:'juda muhim',
     html:'<p>Sondan keyingi ot shakli oxirgi raqamga bog\'liq:</p>',
     table:{head:['Oxirgi raqam','Shakl','Misol'], rows:[
      ['1 (11 dan tashqari)','birlik','<span class="ru">один год, один рубль, двадцать один час</span>'],
      ['2, 3, 4 (12–14 dan tashqari)','birlik, roditelniy','<span class="ru">два года, три рубля, четыре часа</span>'],
      ['5–20, 0','ko\'plik, roditelniy','<span class="ru">пять лет, десять рублей, двенадцать часов</span>']
     ]}},
    {h:'Soat, narx, yosh',
     html:'<div class="rule-box"><ul><li><span class="ru">Который час? / Сколько времени?</span> — Soat necha? — <span class="ru">Сейчас три часа двадцать минут.</span></li><li><span class="ru">Во сколько?</span> — Soat nechada? — <span class="ru">В восемь часов.</span></li><li><span class="ru">Сколько стоит?</span> — Qancha turadi? — <span class="ru">Пять тысяч сумов.</span></li><li><span class="ru">Сколько тебе лет?</span> — Necha yoshdasan? — <span class="ru">Мне двадцать два года.</span></li></ul></div>',
     note:'<b>Yosh</b> datelniy kelishikda aytiladi: <span class="ru">мне, тебе, ему, ей, брату, маме</span> + <span class="ru">год / года / лет</span>.'}
  ],
  examples:[['Урок начинается в девять часов.','Dars soat to\'qqizda boshlanadi.'],['Сколько стоит этот хлеб? — Четыре тысячи.','Bu non qancha turadi? — To\'rt ming.'],['Моему брату двадцать пять лет.','Akam yigirma besh yoshda.']],
  words:[['сколько','qancha'],['час','soat'],['минута','daqiqa'],['рубль / сум','rubl / so\'m'],['стоить','turmoq (narx)'],['год / лет','yil / yosh']],
  tasks:[
    {t:'c', q:'Мне 21 ___.', o:['год','года','лет'], a:0},
    {t:'c', q:'Ему 23 ___.', o:['года','год','лет'], a:0},
    {t:'c', q:'Бабушке 75 ___.', o:['лет','года','год'], a:0},
    {t:'c', q:'Сейчас 3 ___.', o:['часа','час','часов'], a:0},
    {t:'c', q:'Урок идёт 2 ___ .', o:['часа','часов','час'], a:0},
    {t:'c', q:'Это стоит 12 ___.', o:['рублей','рубля','рубль'], a:0, x:'12–14 — har doim 5+ kabi.'},
    {t:'i', q:'40 — ruscha so\'z bilan:', a:['сорок']},
    {t:'i', q:'90 — ruscha so\'z bilan:', a:['девяносто']},
    {t:'i', q:'— ___ стоит этот словарь?', a:['сколько']},
    {t:'c', q:'— Во сколько начинается фильм? — ___', o:['В семь часов.','Семь часов.','На семь часах.'], a:0}
  ]
},

/* ================================================================ 12 */
{
  id:'roditelniy', g:'A2', level:'A2', books:['DR','PO','ZB','RU','NP'],
  title:'Qaratqich kelishigi (Roditelniy)', ru:'Родительный падеж: кого? чего? у кого? откуда?',
  goal:'«Bor / yo\'q», egalik («ning»), miqdor va «qayerdan?» ma\'nolarini ifodalash.',
  blocks:[
    {h:'Qo\'shimchalar', tag:'2-kelishik',
     table:{head:['Jins','Qo\'shimcha','Misol'], rows:[
      ['Erkak / o\'rta (qattiq)','-а','<span class="ru">брат → брат<span class="end">а</span>, окно → окн<span class="end">а</span></span>'],
      ['Erkak / o\'rta (yumshoq)','-я','<span class="ru">музей → музе<span class="end">я</span>, море → мор<span class="end">я</span></span>'],
      ['Ayol -а','-ы (-и)','<span class="ru">мама → мам<span class="end">ы</span>, книга → книг<span class="end">и</span></span>'],
      ['Ayol -я, -ь','-и','<span class="ru">неделя → недел<span class="end">и</span>, тетрадь → тетрад<span class="end">и</span></span>']
     ]}},
    {h:'Qachon ishlatiladi?',
     html:'<div class="rule-box"><ul><li><b>Yo\'qlik:</b> <span class="ru">нет, не было, не будет</span> + R.p.: <span class="ru">У меня нет брата. Сегодня нет урока.</span></li><li><b>Egalik:</b> <span class="ru">У меня есть машина.</span> (Mening mashinam bor.) — <span class="ru">у + R.p.: у брата, у сестры, у него, у неё</span>.</li><li><b>«-ning»:</b> <span class="ru">книга брата</span> (akamning kitobi), <span class="ru">центр города</span> (shahar markazi).</li><li><b>Qayerdan?</b> <span class="ru">из + R.p.: из Ташкента, из школы; с + R.p.: с работы, с урока</span>.</li><li><b>Miqdor:</b> <span class="ru">много, мало, сколько, нет + R.p.: много работы, мало времени</span>.</li></ul></div>'},
    {h:'Ko\'plikdagi roditelniy (eng ko\'p kerak bo\'ladiganlari)',
     table:{head:['Birlik','R.p. ko\'plik','Misol'], rows:[
      ['студент','студентов','много студентов'], ['рубль','рублей','десять рублей'], ['книга','книг','пять книг'],
      ['человек','человек / людей','пять человек, много людей'], ['год','лет','десять лет'], ['друг','друзей','много друзей']
     ]}}
  ],
  examples:[['У меня есть старший брат.','Mening akam bor.'],['У нас нет времени.','Bizda vaqt yo\'q.'],['Это дом моего друга.','Bu mening do\'stimning uyi.'],['Отец вернулся с работы.','Dadam ishdan qaytdi.']],
  words:[['у меня есть','menda bor'],['нет','yo\'q'],['из','-dan (ichidan)'],['с','-dan (ustidan)'],['много','ko\'p'],['мало','kam'],['без','-siz'],['после','keyin']],
  tasks:[
    {t:'i', q:'У меня нет ___. (брат)', a:['брата']},
    {t:'i', q:'У ___ есть машина. (сестра)', a:['сестры']},
    {t:'i', q:'Он приехал из ___. (Москва)', a:['Москвы']},
    {t:'i', q:'Сегодня нет ___. (урок)', a:['урока']},
    {t:'c', q:'Чай без ___.', o:['сахара','сахар','сахаре'], a:0},
    {t:'c', q:'В классе много ___.', o:['студентов','студенты','студента'], a:0},
    {t:'c', q:'У ___ есть собака. (он)', o:['него','его','ему'], a:0},
    {t:'c', q:'Это книга ___. (учитель)', o:['учителя','учитель','учителю'], a:0},
    {t:'c', q:'Мама пришла ___ работы.', o:['с','из','в'], a:0},
    {t:'i', q:'У меня мало ___. (время)', a:['времени']}
  ]
},

/* ================================================================ 13 */
{
  id:'datelniy', g:'A2', level:'A2', books:['DR','PO','ZB','RU','NP'],
  title:'Jo\'nalish kelishigi (Datelniy)', ru:'Дательный падеж: кому? чему? к кому?',
  goal:'«Kimga?» deb so\'rash, «yoqadi», «kerak», «mumkin» iboralarini ishlatish.',
  blocks:[
    {h:'Qo\'shimchalar', tag:'3-kelishik',
     table:{head:['Jins','Qo\'shimcha','Misol'], rows:[
      ['Erkak / o\'rta','-у / -ю','<span class="ru">брат → брат<span class="end">у</span>, учитель → учител<span class="end">ю</span></span>'],
      ['Ayol -а, -я','-е','<span class="ru">мама → мам<span class="end">е</span>, Таня → Тан<span class="end">е</span></span>'],
      ['Ayol -ь, -ия','-и','<span class="ru">мать → матер<span class="end">и</span>, Мария → Мари<span class="end">и</span></span>']
     ]}},
    {h:'Shaxssiz gaplar — o\'zbekchaga yaqin!',
     html:'<p>O\'zbek tilidagi «menga yoqadi», «menga kerak» konstruksiyalari rus tilida ham xuddi shunday — <b>datelniy</b> bilan:</p><div class="rule-box"><ul><li><span class="ru">Мне нравится Ташкент.</span> — Menga Toshkent yoqadi. (<span class="ru">нравятся</span> — ko\'plik uchun)</li><li><span class="ru">Мне нужно работать.</span> — Men ishlashim kerak.</li><li><span class="ru">Тебе можно отдыхать.</span> — Senga dam olish mumkin.</li><li><span class="ru">Ему холодно.</span> — Unga sovuq.</li><li><span class="ru">Маме 50 лет.</span> — Oyim 50 yoshda.</li></ul></div>'},
    {h:'Fe\'llar va old ko\'makchilar',
     html:'<p><span class="ru">давать, дарить, звонить, писать, помогать, говорить, показывать</span> + кому?: <span class="ru">Я звоню маме. Помоги брату!</span></p><p><span class="ru">к + D.p.</span> — kimningdir oldiga: <span class="ru">идти к врачу, к другу</span>. <span class="ru">по + D.p.</span> — bo\'ylab / orqali: <span class="ru">гулять по городу, говорить по телефону</span>.</p>',
     table:{head:['я','ты','он','она','мы','вы','они'], rows:[[ 'мне','тебе','ему','ей','нам','вам','им' ]]}}
  ],
  examples:[['Я подарил сестре цветы.','Singlimga gul sovg\'a qildim.'],['Нам очень нравится этот город.','Bizga bu shahar juda yoqadi.'],['Завтра я иду к врачу.','Ertaga shifokorga boraman.'],['Позвони мне вечером.','Kechqurun menga qo\'ng\'iroq qil.']],
  words:[['кому','kimga'],['нравиться','yoqmoq'],['нужно / надо','kerak'],['можно','mumkin'],['нельзя','mumkin emas'],['помогать','yordam bermoq'],['звонить','qo\'ng\'iroq qilmoq'],['дарить','sovg\'a qilmoq']],
  tasks:[
    {t:'i', q:'Я звоню ___. (мама)', a:['маме']},
    {t:'i', q:'Помоги ___. (брат)', a:['брату']},
    {t:'i', q:'___ нравится музыка. (я)', a:['мне']},
    {t:'c', q:'Мне ___ эти цветы.', o:['нравятся','нравится','нравлюсь'], a:0, x:'«Цветы» — ko\'plik.'},
    {t:'c', q:'___ нужно учить слова. (ты)', o:['Тебе','Тебя','Ты'], a:0},
    {t:'c', q:'Я иду ___ другу.', o:['к','в','на'], a:0},
    {t:'c', q:'Мы гуляем ___ парку.', o:['по','в','к'], a:0},
    {t:'c', q:'Сколько лет ___? (она)', o:['ей','её','ней'], a:0},
    {t:'i', q:'Учитель объясняет ___ правило. (студенты)', a:['студентам']},
    {t:'c', q:'Здесь ___ курить.', o:['нельзя','можно не','нельзю'], a:0}
  ]
},

/* ================================================================ 14 */
{
  id:'tvoritelniy', g:'A2', level:'A2', books:['DR','PO','ZB','RU','NP'],
  title:'Vosita kelishigi (Tvoritelniy)', ru:'Творительный падеж: с кем? чем? кем?',
  goal:'«Kim bilan?», «nima bilan?», «kim bo\'lib?» degan ma\'nolarni ifodalash.',
  blocks:[
    {h:'Qo\'shimchalar', tag:'5-kelishik',
     table:{head:['Jins','Qo\'shimcha','Misol'], rows:[
      ['Erkak / o\'rta','-ом / -ем','<span class="ru">брат → брат<span class="end">ом</span>, учитель → учител<span class="end">ем</span>, окно → окн<span class="end">ом</span></span>'],
      ['Ayol -а, -я','-ой / -ей','<span class="ru">мама → мам<span class="end">ой</span>, Таня → Тан<span class="end">ей</span></span>'],
      ['Ayol -ь','-ью','<span class="ru">тетрадь → тетрад<span class="end">ью</span></span>'],
      ['Ko\'plik','-ами / -ями','<span class="ru">друзья → друзь<span class="end">ями</span>, книги → книг<span class="end">ами</span></span>']
     ]}},
    {h:'Qachon ishlatiladi?',
     html:'<div class="rule-box"><ul><li><b>с + T.p.</b> — bilan, birga: <span class="ru">чай с лимоном, гулять с другом, кофе с молоком</span>.</li><li><b>Kasb:</b> <span class="ru">работать, быть (o\'tgan/kelasi), стать</span> + кем?: <span class="ru">Он работает врачом. Я хочу стать инженером.</span></li><li><b>Vosita:</b> <span class="ru">писать ручкой, есть ложкой</span>.</li><li><b>Qiziqish:</b> <span class="ru">заниматься, интересоваться</span> + чем?: <span class="ru">заниматься спортом, интересоваться историей</span>.</li><li><b>Joy:</b> <span class="ru">над, под, перед, за, между, рядом с</span>: <span class="ru">под столом, перед домом, между школой и парком</span>.</li></ul></div>',
     table:{head:['я','ты','он','она','мы','вы','они'], rows:[[ 'мной','тобой','им (с ним)','ей (с ней)','нами','вами','ими (с ними)' ]]}}
  ],
  examples:[['Я пью чай с сахаром.','Men choyni shakar bilan ichaman.'],['Мой отец работает водителем.','Dadam haydovchi bo\'lib ishlaydi.'],['Сестра занимается музыкой.','Singlim musiqa bilan shug\'ullanadi.'],['Машина стоит перед домом.','Mashina uyning oldida turibdi.']],
  words:[['с','bilan'],['работать кем','… bo\'lib ishlamoq'],['стать','bo\'lmoq'],['заниматься','shug\'ullanmoq'],['перед','oldida'],['за','orqasida'],['под','ostida'],['между','orasida']],
  tasks:[
    {t:'i', q:'Я гуляю с ___. (друг)', a:['другом']},
    {t:'i', q:'Кофе с ___, пожалуйста. (молоко)', a:['молоком']},
    {t:'i', q:'Мама работает ___. (учительница)', a:['учительницей']},
    {t:'i', q:'Он занимается ___. (спорт)', a:['спортом']},
    {t:'c', q:'Я хочу стать ___.', o:['врачом','врач','врача'], a:0},
    {t:'c', q:'Пойдём со ___ в кино! (я)', o:['мной','меня','мне'], a:0},
    {t:'c', q:'Кошка спит под ___.', o:['столом','стол','столе'], a:0},
    {t:'c', q:'Я пишу ___. (ручка)', o:['ручкой','ручку','ручке'], a:0},
    {t:'c', q:'Мы говорили с ___. (она)', o:['ней','её','ей'], a:0},
    {t:'i', q:'Он интересуется ___. (история)', a:['историей']}
  ]
},

/* ================================================================ 15 */
{
  id:'kelasi', g:'A2', level:'A2', books:['DR','PO','ZB','RU','NP'],
  title:'Fe\'l turi va kelasi zamon', ru:'Вид глагола и будущее время',
  goal:'Tugallangan (СВ) va tugallanmagan (НСВ) fe\'llarni farqlash, kelasi zamonni yasash.',
  blocks:[
    {h:'Ikki tur — bir ma\'no', tag:'eng muhim mavzu',
     html:'<p>Ko\'pchilik rus fe\'llari juft bo\'ladi: <b>НСВ</b> (jarayon, takror) va <b>СВ</b> (natija, bir marta).</p>',
     table:{head:['НСВ — jarayon','СВ — natija','Tarjima'], rows:[
      ['делать','сделать','qilmoq'], ['писать','написать','yozmoq'], ['читать','прочитать','o\'qimoq'], ['учить','выучить','yodlamoq'],
      ['покупать','купить','sotib olmoq'], ['решать','решить','yechmoq'], ['говорить','сказать','aytmoq'], ['брать','взять','olmoq']
     ]}},
    {h:'Qachon qaysi?',
     html:'<div class="rule-box"><ul><li><b>НСВ:</b> davomli jarayon — <span class="ru">Я долго писал письмо.</span>; takror — <span class="ru">Я каждый день читаю газету.</span></li><li><b>СВ:</b> natija, tugallangan — <span class="ru">Я написал письмо.</span> (yozib bo\'ldim); bir martalik — <span class="ru">Он вдруг сказал…</span></li></ul></div><p>Signal so\'zlar: <span class="ru">каждый день, часто, всегда, долго</span> → НСВ; <span class="ru">уже, наконец, вдруг, сразу</span> → ko\'pincha СВ.</p>'},
    {h:'Kelasi zamon',
     table:{head:['','НСВ: буду + infinitiv','СВ: tuslangan shakl'], rows:[
      ['я','буду читать','прочитаю'], ['ты','будешь читать','прочитаешь'], ['он/она','будет читать','прочитает'],
      ['мы','будем читать','прочитаем'], ['вы','будете читать','прочитаете'], ['они','будут читать','прочитают']
     ]},
     note:'<b>Diqqat:</b> СВ fe\'lning «hozirgi» shakli kelasi zamonni bildiradi: <span class="ru">Я сделаю</span> = qilib qo\'yaman. <span class="ru">Буду сделать</span> deb bo\'lmaydi!'}
  ],
  examples:[['Завтра я буду работать весь день.','Ertaga kun bo\'yi ishlayman.'],['Я обязательно позвоню тебе вечером.','Kechqurun albatta senga qo\'ng\'iroq qilaman.'],['Ты уже купил билеты?','Chiptalarni sotib olib bo\'ldingmi?'],['Каждое утро я делаю зарядку.','Har kuni ertalab badantarbiya qilaman.']],
  words:[['завтра','ertaga'],['скоро','tez orada'],['уже','allaqachon'],['ещё не','hali … emas'],['каждый день','har kuni'],['обязательно','albatta']],
  tasks:[
    {t:'c', q:'Каждый день я ___ газету.', o:['читаю','прочитаю'], a:0},
    {t:'c', q:'Я уже ___ эту книгу.', o:['прочитал','читал долго'], a:0},
    {t:'c', q:'Завтра мы ___ дома.', o:['будем отдыхать','будем отдохнуть'], a:0},
    {t:'c', q:'Я ___ тебе завтра.', o:['позвоню','буду позвонить'], a:0},
    {t:'c', q:'Он долго ___ задачу и наконец ___ её.', o:['решал … решил','решил … решал'], a:0},
    {t:'i', q:'Что ты ___ делать летом? (будущее, ты)', a:['будешь']},
    {t:'i', q:'писать — СВ: ___', a:['написать']},
    {t:'i', q:'покупать — СВ: ___', a:['купить']},
    {t:'i', q:'говорить — СВ: ___', a:['сказать']},
    {t:'c', q:'Вечером они ___ фильм. (kelasi, jarayon)', o:['будут смотреть','посмотрят смотреть','будут посмотреть'], a:0}
  ]
},

/* ================================================================ 16 */
{
  id:'harakat', g:'A2', level:'A2', books:['DR','PO','ZB','RU','NP'],
  title:'Harakat fe\'llari', ru:'Глаголы движения: идти — ходить, ехать — ездить',
  goal:'Bir yo\'nalishli va ko\'p yo\'nalishli harakatni, prefiksli fe\'llarni farqlash.',
  blocks:[
    {h:'Piyoda va transportda', tag:'juftliklar',
     table:{head:['','Bir yo\'nalish (hozir, aniq)','Ko\'p yo\'nalish (umuman, takror)'], rows:[
      ['piyoda','<span class="ru">идти: иду, идёшь, идут</span>','<span class="ru">ходить: хожу, ходишь, ходят</span>'],
      ['transportda','<span class="ru">ехать: еду, едешь, едут</span>','<span class="ru">ездить: езжу, ездишь, ездят</span>'],
      ['uchib','<span class="ru">лететь: лечу, летишь</span>','<span class="ru">летать: летаю, летаешь</span>'],
      ['ko\'tarib','<span class="ru">нести: несу, несёшь</span>','<span class="ru">носить: ношу, носишь</span>']
     ]}},
    {h:'Farqi',
     html:'<div class="rule-box"><ul><li><span class="ru">Сейчас я иду в школу.</span> — Hozir maktabga ketyapman (bir yo\'nalish, shu payt).</li><li><span class="ru">Я каждый день хожу в школу.</span> — Har kuni maktabga boraman (takror).</li><li><span class="ru">Вчера я ходил в театр.</span> — Kecha teatrga borib keldim (borib-qaytish).</li><li><span class="ru">Я люблю ездить на машине.</span> — Mashinada yurishni yaxshi ko\'raman (umuman).</li></ul></div>'},
    {h:'Prefikslar',
     table:{head:['Prefiks','Ma\'no','Misol'], rows:[
      ['при-','kelmoq','<span class="ru">прийти, приехать</span> — kelmoq'], ['у-','ketmoq','<span class="ru">уйти, уехать</span> — ketmoq'],
      ['в-','kirmoq','<span class="ru">войти</span> — kirmoq'], ['вы-','chiqmoq','<span class="ru">выйти</span> — chiqmoq'],
      ['по-','yo\'lga chiqmoq','<span class="ru">пойти, поехать</span> — borish (boshlamoq)'], ['пере-','o\'tmoq','<span class="ru">перейти улицу</span> — ko\'chadan o\'tmoq'],
      ['за-','kirib o\'tmoq','<span class="ru">зайти в магазин</span> — do\'konga kirib o\'tmoq']
     ]},
     note:'<b>Transport:</b> <span class="ru">ехать на + P.p.: на автобусе, на метро, на такси, на поезде</span>. Piyoda: <span class="ru">идти пешком</span>.'}
  ],
  examples:[['Куда ты идёшь? — В библиотеку.','Qayerga ketyapsan? — Kutubxonaga.'],['Летом мы ездили в Бухару.','Yozda Buxoroga borib keldik.'],['Брат приехал из Москвы вчера.','Akam kecha Moskvadan keldi.'],['Давай зайдём в кафе.','Kel, kafega kirib o\'tamiz.']],
  words:[['идти','(piyoda) bormoq'],['ходить','yurmoq, borib turmoq'],['ехать','(transportda) bormoq'],['ездить','qatnamoq'],['прийти','kelmoq'],['уйти','ketmoq'],['пешком','piyoda'],['на автобусе','avtobusda']],
  tasks:[
    {t:'c', q:'Сейчас я ___ домой.', o:['иду','хожу'], a:0},
    {t:'c', q:'Каждую субботу мы ___ в бассейн.', o:['ходим','идём'], a:0},
    {t:'c', q:'Смотри, самолёт ___ на юг!', o:['летит','летает'], a:0},
    {t:'c', q:'Вчера я ___ в театр.', o:['ходил','шёл'], a:0, x:'Borib-qaytgan — ko\'p yo\'nalishli.'},
    {t:'c', q:'Он ___ на работу на автобусе.', o:['ездит','ходит'], a:0},
    {t:'c', q:'Осторожно ___ улицу!', o:['переходи','приходи','уходи'], a:0},
    {t:'c', q:'Гости ___ в 7 часов.', o:['пришли','ушли','вышли'], a:0, x:'Mehmonlar soat 7 da keldi.'},
    {t:'i', q:'Я еду на ___. (метро)', a:['метро'], x:'«метро» o\'zgarmaydi.'},
    {t:'i', q:'Мы ___ в Самарканд на поезде. (ехать, мы)', a:['едем']},
    {t:'i', q:'Я обычно ___ в школу пешком. (ходить, я)', a:['хожу']}
  ]
},

/* ================================================================ 17 */
{
  id:'buyruq', g:'A2', level:'A2', books:['DR','PO','ZB','RU'],
  title:'Buyruq mayli va odob', ru:'Повелительное наклонение и речевой этикет',
  goal:'Iltimos qilish, maslahat berish, taklif etish va xushmuomala iboralar.',
  blocks:[
    {h:'Yasalishi',
     html:'<p>«Они» shaklidan qo\'shimcha olib tashlanadi:</p>',
     table:{head:['они','Asos','ты','вы'], rows:[
      ['чита-ют','unli bilan tugaydi → <span class="end">-й</span>','читай','читайте'],
      ['говор-ят','undosh, urg\'u oxirda → <span class="end">-и</span>','говори','говорите'],
      ['пиш-ут','undosh → <span class="end">-и</span>','пиши','пишите'],
      ['встан-ут','urg\'u asosda → <span class="end">-ь</span>','встань','встаньте'],
      ['занима-ются','-ся saqlanadi','занимайся','занимайтесь']
     ]},
     note:'<b>Yodlang:</b> <span class="ru">дать → дай(те); есть → ешь(те); пить → пей(те); ехать → поезжай(те); давай(те)…</span> — kel, …qilaylik.'},
    {h:'Xushmuomala iboralar',
     table:{head:['Ruscha','Tarjima'], rows:[
      ['Скажите, пожалуйста, …','Ayting-chi, iltimos, …'], ['Будьте добры, …','Marhamat qilib, …'], ['Извините, можно вопрос?','Kechirasiz, savol bersam bo\'ladimi?'],
      ['Давайте познакомимся!','Keling, tanishamiz!'], ['Повторите, пожалуйста.','Iltimos, takrorlang.'], ['Говорите медленнее, пожалуйста.','Sekinroq gapiring, iltimos.'],
      ['Не за что.','Arzimaydi.'], ['Ничего страшного.','Hechqisi yo\'q.']
     ]}}
  ],
  dialog:[
    ['A','Извините, скажите, пожалуйста, где метро?','Kechirasiz, ayting-chi, metro qayerda?'],
    ['B','Идите прямо, потом поверните направо.','To\'g\'ri boring, keyin o\'ngga buriling.'],
    ['A','Повторите, пожалуйста, медленнее.','Iltimos, sekinroq takrorlang.'],
    ['B','Прямо, потом направо. Метро рядом с банком.','To\'g\'ri, keyin o\'ngga. Metro bankning yonida.'],
    ['A','Большое спасибо!','Katta rahmat!'],
    ['B','Не за что.','Arzimaydi.']
  ],
  words:[['пожалуйста','iltimos'],['извините','kechirasiz'],['давайте','keling'],['прямо','to\'g\'riga'],['направо','o\'ngga'],['налево','chapga'],['повторите','takrorlang'],['подождите','kuting']],
  tasks:[
    {t:'i', q:'(читать, ты) ___ текст!', a:['читай']},
    {t:'i', q:'(писать, вы) ___ диктант.', a:['пишите']},
    {t:'i', q:'(говорить, ты) ___ громче!', a:['говори']},
    {t:'c', q:'(заниматься, вы) ___ каждый день!', o:['Занимайтесь','Занимайся','Занимаетесь'], a:0},
    {t:'c', q:'(дать, ты) ___ мне ручку.', o:['Дай','Дави','Дать'], a:0},
    {t:'c', q:'(пить, вы) ___ чай!', o:['Пейте','Пите','Пьёте'], a:0},
    {t:'c', q:'«Arzimaydi» ruscha:', o:['Не за что.','Ничего.','Пожалуйста, спасибо.'], a:0},
    {t:'c', q:'— ___ пойдём в парк! — Давай!', o:['Давай','Дай','Давать'], a:0},
    {t:'i', q:'___, пожалуйста, где вокзал? (сказать, вы)', a:['скажите']},
    {t:'c', q:'Sekinroq gapirishni so\'rang:', o:['Говорите медленнее, пожалуйста.','Говорите быстро!','Не говорите.'], a:0}
  ]
},

/* ================================================================ 18 */
{
  id:'murakkab', g:'B1', level:'B1', books:['DR','PO','RU','NP'],
  title:'Qo\'shma gaplar', ru:'Сложное предложение: который, потому что, если, чтобы',
  goal:'Sabab, shart, maqsad va aniqlovchi ergash gaplarni tuzish.',
  blocks:[
    {h:'Bog\'lovchilar', tag:'B1',
     table:{head:['Bog\'lovchi','Ma\'no','Misol'], rows:[
      ['потому что','chunki (sabab)','<span class="ru">Я не пришёл, потому что болел.</span>'],
      ['поэтому','shuning uchun (natija)','<span class="ru">Шёл дождь, поэтому мы остались дома.</span>'],
      ['если','agar (shart)','<span class="ru">Если будет время, я позвоню.</span>'],
      ['когда','qachonki, -ganda','<span class="ru">Когда я был маленьким, я жил в деревне.</span>'],
      ['чтобы','… uchun (maqsad)','<span class="ru">Я учу русский, чтобы работать в Москве.</span>'],
      ['что','… deb, -ganini','<span class="ru">Он сказал, что придёт.</span>'],
      ['хотя','garchi','<span class="ru">Хотя было поздно, мы гуляли.</span>']
     ]}},
    {h:'Который — qaysi ki…',
     html:'<p><span class="ru">который</span> ot bilan jins va sonda moslashadi, kelishigi esa ergash gapdagi vazifasiga qarab o\'zgaradi:</p><div class="rule-box"><ul><li><span class="ru">Это друг, <b>который</b> живёт в Москве.</span> — Bu Moskvada yashaydigan do\'stim.</li><li><span class="ru">Это девушка, <b>которая</b> поёт.</span> — Bu qo\'shiq aytayotgan qiz.</li><li><span class="ru">Это книга, <b>которую</b> я читаю.</span> — Bu men o\'qiyotgan kitob.</li><li><span class="ru">Это город, <b>в котором</b> я родился.</span> — Bu men tug\'ilgan shahar.</li></ul></div>',
     note:'<b>Chтобы + o\'tgan zamon:</b> boshqa odamdan biror narsa xohlaganda: <span class="ru">Мама хочет, чтобы я <b>учился</b> хорошо.</span>'}
  ],
  examples:[['Я опоздал, потому что не было автобуса.','Avtobus bo\'lmagani uchun kechikdim.'],['Если хочешь говорить свободно, говори каждый день.','Erkin gapirishni istasang, har kuni gapir.'],['Это учитель, который помог мне.','Bu menga yordam bergan ustoz.'],['Я пришёл, чтобы поговорить с вами.','Siz bilan gaplashish uchun keldim.']],
  words:[['потому что','chunki'],['поэтому','shuning uchun'],['если','agar'],['чтобы','… uchun'],['хотя','garchi'],['который','qaysiki']],
  tasks:[
    {t:'c', q:'Я не спал, ___ было шумно.', o:['потому что','поэтому','чтобы'], a:0},
    {t:'c', q:'Было шумно, ___ я не спал.', o:['поэтому','потому что','если'], a:0},
    {t:'c', q:'___ будет хорошая погода, мы пойдём в горы.', o:['Если','Чтобы','Хотя'], a:0},
    {t:'c', q:'Я пришёл, ___ помочь тебе.', o:['чтобы','что','потому что'], a:0},
    {t:'c', q:'Он сказал, ___ завтра будет экзамен.', o:['что','чтобы','если'], a:0},
    {t:'c', q:'Это девушка, ___ учится в нашей группе.', o:['которая','который','которую'], a:0},
    {t:'c', q:'Вот письмо, ___ я получил вчера.', o:['которое','который','которую'], a:0},
    {t:'c', q:'Это дом, в ___ живёт мой друг.', o:['котором','который','которая'], a:0},
    {t:'c', q:'Мама хочет, чтобы я ___ врачом.', o:['стал','стану','стать'], a:0},
    {t:'c', q:'___ было холодно, мы долго гуляли.', o:['Хотя','Если','Чтобы'], a:0}
  ]
}
];
