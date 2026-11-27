/* ТЕТРАДЬ — yuqori darajalar: B1, B2, C1 (14 dars).
 * Barcha tushuntirish, misol va mashqlar ТЕТРАДЬ uchun yangidan yozilgan.
 */
window.TETRAD_LESSONS.push(

/* ================================================================ B1 */
{
  id:'kopkel', g:'B1', level:'B1', books:['DR','RU','NP'],
  title:'Ko\'plikdagi kelishiklar', ru:'Склонение существительных во множественном числе',
  goal:'Otlarni ko\'plikda barcha 6 kelishikda to\'g\'ri ishlatish.',
  blocks:[
    {h:'Umumiy jadval', tag:'6 kelishik',
     table:{head:['Kelishik','Savol','студент (м)','книга (ж)','окно (ср)','музей / тетрадь'], rows:[
      ['Им.','кто? что?','студенты','книги','окна','музеи / тетради'],
      ['Род.','кого? чего?','студент<span class="end">ов</span>','книг','окон','музе<span class="end">ев</span> / тетрад<span class="end">ей</span>'],
      ['Дат.','кому? чему?','студент<span class="end">ам</span>','книг<span class="end">ам</span>','окн<span class="end">ам</span>','музе<span class="end">ям</span> / тетрад<span class="end">ям</span>'],
      ['Вин.','кого? что?','студент<span class="end">ов</span>','книги','окна','музеи / тетради'],
      ['Твор.','кем? чем?','студент<span class="end">ами</span>','книг<span class="end">ами</span>','окн<span class="end">ами</span>','музе<span class="end">ями</span> / тетрад<span class="end">ями</span>'],
      ['Предл.','о ком? о чём?','о студент<span class="end">ах</span>','о книг<span class="end">ах</span>','об окн<span class="end">ах</span>','о музе<span class="end">ях</span> / о тетрад<span class="end">ях</span>']
     ]}},
    {h:'Eng qiyini — roditelniy ko\'plik',
     html:'<div class="rule-box"><ul><li>Erkak, undosh bilan: <b>-ов</b> — <span class="ru">студентов, городов</span>; <b>-й</b> bilan: <b>-ев</b> — <span class="ru">музеев, героев</span>.</li><li><b>-ь, ж, ш, ч, щ</b> bilan: <b>-ей</b> — <span class="ru">словарей, врачей, ножей, тетрадей</span>.</li><li>Ayol va o\'rta jins <b>-а / -о</b> bilan: qo\'shimcha <b>tushadi</b> — <span class="ru">книга → книг, место → мест</span>. Ikki undosh orasida ko\'pincha <b>о/е</b> paydo bo\'ladi: <span class="ru">окно → окон, ручка → ручек, девушка → девушек, письмо → писем</span>.</li><li><b>-ия / -ие</b>: <b>-ий</b> — <span class="ru">лекция → лекций, здание → зданий</span>.</li></ul></div>',
     note:'<b>Vinitelniy ko\'plik:</b> jonsiz narsalar uchun bosh kelishik bilan bir xil (<span class="ru">вижу книги</span>), jonli uchun roditelniy bilan bir xil (<span class="ru">вижу студентов, девушек</span>) — jinsidan qat\'i nazar.'},
    {h:'Yodlanadigan shakllar',
     table:{head:['Им.','Род.','Дат.','Твор.','Предл.'], rows:[
      ['люди','людей','людям','людьми','о людях'], ['дети','детей','детям','детьми','о детях'],
      ['друзья','друзей','друзьям','друзьями','о друзьях'], ['деньги','денег','деньгам','деньгами','о деньгах'], ['братья','братьев','братьям','братьями','о братьях']
     ]}}
  ],
  examples:[['Я часто пишу письма друзьям.','Do\'stlarimga tez-tez xat yozaman.'],['В нашем городе много музеев и театров.','Shahrimizda muzey va teatrlar ko\'p.'],['Учитель доволен своими студентами.','O\'qituvchi talabalaridan mamnun.'],['Мы долго говорили о детях и внуках.','Bolalar va nevaralar haqida uzoq gaplashdik.']],
  words:[['много','ko\'p'],['несколько','bir nechta'],['большинство','ko\'pchilik'],['гордиться','faxrlanmoq'],['доволен','mamnun'],['внуки','nevaralar']],
  tasks:[
    {t:'i', q:'Я пишу письма ___. (друзья)', a:['друзьям']},
    {t:'i', q:'Мы говорили об ___. (экзамены)', a:['экзаменах']},
    {t:'i', q:'В городе много ___. (музей)', a:['музеев']},
    {t:'i', q:'У меня сейчас нет ___. (деньги)', a:['денег']},
    {t:'c', q:'Родители гордятся своими ___.', o:['детьми','детями','детей'], a:0},
    {t:'c', q:'Мама купила пять ___.', o:['яблок','яблоков','яблоки'], a:0},
    {t:'i', q:'Преподаватель доволен ___. (студенты)', a:['студентами']},
    {t:'c', q:'На вокзале я встретил ___.', o:['студентов','студенты','студентам'], a:0, x:'Jonli — vinitelniy roditelniyga teng.'},
    {t:'c', q:'В этой комнате нет ___.', o:['окон','окнов','окна'], a:0},
    {t:'i', q:'Мои родственники живут в разных ___. (города)', a:['городах']}
  ]
},
{
  id:'qiyos', g:'B1', level:'B1', books:['DR','PO','RU','NP'],
  title:'Qiyosiy va orttirma daraja', ru:'Сравнительная и превосходная степень',
  goal:'Narsalarni solishtirish: «tezroq», «eng yaxshi», «… dan kattaroq».',
  blocks:[
    {h:'Qiyosiy daraja: -ее', tag:'сравнительная',
     html:'<p>Sifat yoki ravish asosiga <b>-ее</b> qo\'shiladi va bu shakl o\'zgarmaydi: <span class="ru">быстрый → быстрее, интересный → интереснее, тёплый → теплее</span>.</p><p>Nima bilan solishtirilayotganini ikki yo\'l bilan aytish mumkin: <span class="ru">Брат старше <b>меня</b></span> (roditelniy) = <span class="ru">Брат старше, <b>чем я</b></span>.</p>',
     table:{head:['Sifat','Qiyosiy','Tarjima'], rows:[
      ['хороший','лучше','yaxshiroq'], ['плохой','хуже','yomonroq'], ['большой','больше','kattaroq / ko\'proq'], ['маленький','меньше','kichikroq'],
      ['высокий','выше','balandroq'], ['дорогой','дороже','qimmatroq'], ['дешёвый','дешевле','arzonroq'], ['молодой','моложе (младше)','yoshroq'],
      ['старый','старше','kattaroq (yoshda)'], ['лёгкий','легче','osonroq'], ['простой','проще','soddaroq'], ['близкий','ближе','yaqinroq'], ['далёкий','дальше','uzoqroq'], ['частый','чаще','tez-tezroq']
     ]}},
    {h:'Murakkab shakl va orttirma daraja',
     html:'<div class="rule-box"><ul><li><b>более / менее + sifat</b> — kitobiyroq uslub: <span class="ru">более удобный вариант, менее опасный путь</span>.</li><li><b>самый + sifat</b> — eng: <span class="ru">самый высокий дом, самая интересная книга</span>.</li><li><b>-ейший / -айший</b> — kitob tilida: <span class="ru">важнейший, интереснейший, глубочайший</span>.</li><li><b>лучше всех / всего</b>: <span class="ru">Он поёт лучше всех.</span> (hammadan yaxshi) <span class="ru">Больше всего я люблю весну.</span> (eng ko\'p)</li><li><b>Чем …, тем …</b>: <span class="ru">Чем больше читаешь, тем лучше пишешь.</span></li></ul></div>'}
  ],
  examples:[['Самолёт летит быстрее поезда.','Samolyot poyezddan tezroq uchadi.'],['Сегодня теплее, чем вчера.','Bugun kechagidan iliqroq.'],['Это самый красивый город, который я видел.','Bu men ko\'rgan eng chiroyli shahar.'],['Чем раньше начнёшь, тем быстрее закончишь.','Qancha erta boshlasang, shuncha tez tugatasan.']],
  words:[['чем','… dan, … ga qaraganda'],['самый','eng'],['более','ko\'proq (+sifat)'],['менее','kamroq (+sifat)'],['лучше всех','hammadan yaxshi'],['гораздо / намного','ancha, xiyla']],
  tasks:[
    {t:'i', q:'Самолёт летит ___ поезда. (быстро)', a:['быстрее']},
    {t:'c', q:'Этот телефон ___, чем тот.', o:['дороже','дорогее','более дороже'], a:0},
    {t:'i', q:'Мой брат ___ меня на два года. (старый)', a:['старше']},
    {t:'i', q:'Сегодня погода ___, чем вчера. (хороший)', a:['лучше']},
    {t:'i', q:'Ташкент больше ___. (Самарканд)', a:['Самарканда']},
    {t:'c', q:'Это ___ интересная книга, которую я читал.', o:['самая','самый','самое'], a:0},
    {t:'c', q:'Он говорит по-русски лучше ___.', o:['всех','все','всем'], a:0},
    {t:'c', q:'Чем больше читаешь, ___ лучше понимаешь.', o:['тем','чем','так'], a:0},
    {t:'c', q:'Эта задача ___ трудная, чем первая.', o:['более','самая','больше'], a:0},
    {t:'i', q:'Метро ___ автобуса. (удобный — qiyosiy)', a:['удобнее']}
  ]
},
{
  id:'shart', g:'B1', level:'B1', books:['DR','RU','NP'],
  title:'Shart mayli (бы)', ru:'Сослагательное наклонение: если бы…',
  goal:'Real bo\'lmagan shart, orzu va muloyim iltimosni ifodalash.',
  blocks:[
    {h:'Yasalishi: o\'tgan zamon + бы', tag:'juda oson',
     html:'<p>Shart mayli zamonga bog\'liq emas: <b>o\'tgan zamon shakli + бы</b>. U hozir, o\'tmish va kelajak uchun bir xil.</p><div class="rule-box"><ul><li><span class="ru">Я <b>бы</b> поехал.</span> — Borardim / borgan bo\'lardim.</li><li><span class="ru">Она <b>бы</b> помогла.</span> — U yordam berardi.</li><li><span class="ru">Мы <b>бы</b> купили.</span> — Sotib olardik.</li></ul></div>'},
    {h:'Real va noreal shart',
     table:{head:['','Ruscha','Ma\'nosi'], rows:[
      ['Real','<span class="ru">Если будет время, я приду.</span>','Vaqtim bo\'lsa, kelaman (bo\'lishi mumkin).'],
      ['Noreal','<span class="ru">Если бы было время, я пришёл бы.</span>','Vaqtim bo\'lganda edi, kelardim (lekin yo\'q).'],
      ['O\'tmish','<span class="ru">Если бы ты позвонил, я бы помог.</span>','Qo\'ng\'iroq qilganingda, yordam bergan bo\'lardim.']
     ]},
     note:'<b>Diqqat:</b> noreal shartda ikkala qismda ham <b>бы</b> va <b>o\'tgan zamon</b> bo\'ladi. <span class="ru">Если бы я знаю…</span> deb bo\'lmaydi — to\'g\'risi <span class="ru">Если бы я знал…</span>'},
    {h:'Muloyim iltimos va orzu',
     html:'<div class="rule-box"><ul><li><span class="ru">Я бы хотел заказать столик.</span> — Stol buyurtma qilmoqchi edim.</li><li><span class="ru">Вы не могли бы помочь?</span> — Yordam bera olmaysizmi?</li><li><span class="ru">Хорошо бы отдохнуть!</span> — Dam olsak yaxshi bo\'lardi!</li><li><span class="ru">Мне бы хотелось…</span> — Men … istardim.</li><li><span class="ru">На твоём месте я бы…</span> — Sening o\'rningda bo\'lganimda…</li></ul></div>'}
  ],
  examples:[['Если бы у меня были деньги, я бы купил дом.','Pulim bo\'lganida uy sotib olardim.'],['Я бы с удовольствием пошёл, но я занят.','Bajonidil borardim, lekin bandman.'],['Вы не могли бы говорить медленнее?','Sekinroq gapira olmaysizmi?'],['На твоём месте я бы извинился.','Sening o\'rningda bo\'lsam, kechirim so\'rardim.']],
  words:[['если бы','agar … bo\'lganda'],['бы','-ardi, -gan bo\'lardi'],['с удовольствием','bajonidil'],['на твоём месте','sening o\'rningda'],['хотелось бы','istardim'],['мечтать','orzu qilmoq']],
  tasks:[
    {t:'i', q:'Если бы у меня было время, я ___ бы с тобой. (пойти, erkak)', a:['пошёл','пошел']},
    {t:'i', q:'Я ___ хотел заказать столик на двоих.', a:['бы']},
    {t:'c', q:'Если бы ты позвонил, я ___.', o:['бы помог','помогу бы','помогу'], a:0},
    {t:'c', q:'Если бы я ___ русский лучше, я работал бы в Москве.', o:['знал','знаю','буду знать'], a:0},
    {t:'c', q:'Real shart: «Ertaga yomg\'ir yog\'sa, uyda qolamiz».', o:['Если завтра будет дождь, мы останемся дома.','Если бы завтра был дождь, мы остались бы дома.'], a:0},
    {t:'i', q:'Мне бы ___ отдохнуть на море. (хотеться)', a:['хотелось']},
    {t:'i', q:'Вы не ___ бы мне помочь? (мочь, вы)', a:['могли']},
    {t:'c', q:'На твоём месте я ___ к врачу.', o:['бы пошёл','пойду бы','иду бы'], a:0},
    {t:'c', q:'Хорошо ___ сейчас выпить чаю!', o:['бы','был','будет'], a:0},
    {t:'i', q:'Если бы она знала, она бы ___. (сказать, ayol)', a:['сказала']}
  ]
},
{
  id:'svoy', g:'B1', level:'B1', books:['DR','RU','NP'],
  title:'Свой, себя, сам, весь', ru:'Возвратные и определительные местоимения',
  goal:'«O\'z», «o\'zini», «o\'zi», «hamma» ma\'nolarini to\'g\'ri berish.',
  blocks:[
    {h:'Свой — «o\'zining»', tag:'ko\'p xato qilinadi',
     html:'<p>Agar narsa <b>gapning egasiga</b> tegishli bo\'lsa, <span class="ru">его / её / их</span> emas, <b>свой</b> ishlatiladi. <span class="ru">свой</span> ot bilan moslashadi: <span class="ru">свой, своя, своё, свои</span>.</p><div class="rule-box"><ul><li><span class="ru">Анвар взял <b>свою</b> книгу.</span> — Anvar o\'zining kitobini oldi.</li><li><span class="ru">Анвар взял <b>его</b> книгу.</span> — Anvar uning (boshqa erkakning) kitobini oldi.</li><li><span class="ru">Я люблю <b>свою</b> работу = мою работу.</span> — 1- va 2-shaxsda ikkalasi ham mumkin.</li></ul></div>',
     note:'<b>Ega oldida свой bo\'lmaydi:</b> <span class="ru">Его брат живёт в Бухаре.</span> (<span class="ru">Свой брат…</span> — xato).'},
    {h:'Себя — «o\'zini, o\'ziga»',
     table:{head:['Род. / Вин.','Дат.','Твор.','Предл.'], rows:[[ 'себя','себе','собой','о себе' ]]},
     html:'<p><span class="ru">Он думает только о себе.</span> — U faqat o\'zini o\'ylaydi. <span class="ru">Возьми зонт с собой.</span> — Soyabonni o\'zing bilan ol. <span class="ru">Чувствуйте себя как дома.</span> — O\'zingizni uydagidek his qiling.</p>'},
    {h:'Сам va весь',
     html:'<div class="rule-box"><ul><li><b>сам, сама, сами</b> — o\'zi (boshqasiz): <span class="ru">Я сам сделал. Она сама решила.</span></li><li><b>весь, вся, всё, все</b> — butun, hamma: <span class="ru">весь день, вся семья, всё время, все студенты</span>.</li><li><b>каждый</b> — har bir: <span class="ru">каждый день, каждая неделя</span>.</li><li><b>друг друга</b> — bir-birini: <span class="ru">Они любят друг друга. Мы помогаем друг другу.</span></li></ul></div>'}
  ],
  examples:[['Каждый человек любит свою родину.','Har bir inson o\'z vatanini sevadi.'],['Расскажите немного о себе.','O\'zingiz haqingizda biroz gapirib bering.'],['Дети сами убрали свою комнату.','Bolalar xonalarini o\'zlari yig\'ishtirishdi.'],['Мы знаем друг друга с детства.','Bir-birimizni bolalikdan bilamiz.']],
  words:[['свой','o\'zining'],['себя','o\'zini'],['сам','o\'zi'],['весь','butun'],['каждый','har bir'],['друг друга','bir-birini']],
  tasks:[
    {t:'c', q:'Олег потерял ___ ключи. (o\'zining)', o:['свои','его','их'], a:0},
    {t:'c', q:'Олег взял ___ телефон, потому что свой забыл. (Anvarning)', o:['его','свой','себя'], a:0},
    {t:'c', q:'___ сестра учится в Москве. (Uning — gap boshida)', o:['Его','Своя','Себя'], a:0},
    {t:'i', q:'Он думает только о ___.', a:['себе']},
    {t:'i', q:'Возьми документы с ___.', a:['собой']},
    {t:'c', q:'Чувствуйте ___ как дома!', o:['себя','себе','собой'], a:0},
    {t:'c', q:'Мы ___ приготовили ужин.', o:['сами','самые','свои'], a:0},
    {t:'c', q:'___ семья собралась за столом.', o:['Вся','Весь','Все'], a:0},
    {t:'i', q:'Друзья помогают друг ___.', a:['другу']},
    {t:'c', q:'Каждый студент сдал ___ работу.', o:['свою','его','себя'], a:0}
  ]
},

/* ================================================================ B2 */
{
  id:'sifatdosh', g:'B2', level:'B2', books:['RU','NP'],
  title:'Sifatdoshlar', ru:'Причастия: читающий, прочитанный',
  goal:'To\'rt turdagi sifatdoshni tanish, yasash va «который» bilan almashtirish.',
  blocks:[
    {h:'To\'rt tur', tag:'kitob tili',
     html:'<p>Sifatdosh — fe\'ldan yasalgan va sifat kabi tuslanadigan so\'z (o\'zbekchadagi <i>o\'qiyotgan, o\'qigan, o\'qilgan</i>). Gazeta, ilmiy va rasmiy matnlarda juda ko\'p uchraydi.</p>',
     table:{head:['Tur','Qo\'shimcha','Misol','Tarjima'], rows:[
      ['Aniq, hozirgi','-ущ-/-ющ-, -ащ-/-ящ-','<span class="ru">чита<span class="end">ющ</span>ий, говор<span class="end">ящ</span>ий</span>','o\'qiyotgan, gapirayotgan'],
      ['Aniq, o\'tgan','-вш-, -ш-','<span class="ru">чита<span class="end">вш</span>ий, принёс<span class="end">ш</span>ий</span>','o\'qigan, olib kelgan'],
      ['Majhul, hozirgi','-ем-, -им-','<span class="ru">изуча<span class="end">ем</span>ый, люб<span class="end">им</span>ый</span>','o\'rganilayotgan, sevimli'],
      ['Majhul, o\'tgan','-нн-, -енн-, -т-','<span class="ru">прочита<span class="end">нн</span>ый, реш<span class="end">ённ</span>ый, откры<span class="end">т</span>ый</span>','o\'qilgan, yechilgan, ochilgan']
     ]}},
    {h:'«Который» bilan almashtirish',
     html:'<div class="rule-box"><ul><li><span class="ru">Студент, <b>который читает</b> книгу</span> = <span class="ru"><b>читающий</b> книгу студент</span>.</li><li><span class="ru">Человек, <b>который приехал</b> вчера</span> = <span class="ru"><b>приехавший</b> вчера человек</span>.</li><li><span class="ru">Книга, <b>которую прочитали</b></span> = <span class="ru"><b>прочитанная</b> книга</span>.</li></ul></div><p>Hozirgi zamon sifatdoshi <b>faqat НСВ</b> fe\'llardan yasaladi. Majhul o\'tgan sifatdosh asosan <b>СВ</b> fe\'llardan.</p>'},
    {h:'Qisqa shakl',
     html:'<p>Majhul o\'tgan sifatdoshning qisqa shakli kesim bo\'ladi: <span class="ru">Письмо написано. Дверь закрыта. Задачи решены. Магазин открыт.</span> — bunda bitta <b>н</b> yoziladi.</p>',
     note:'<b>Imlo:</b> to\'liq shaklda <b>-нн-</b> (<span class="ru">прочитанная книга</span>), qisqa shaklda <b>-н-</b> (<span class="ru">книга прочитана</span>).'}
  ],
  examples:[['Студенты, изучающие русский язык, сдают экзамен.','Rus tilini o\'rganayotgan talabalar imtihon topshiryapti.'],['Мы встретили друга, вернувшегося из Москвы.','Moskvadan qaytgan do\'stimizni uchratdik.'],['Решённые задачи лежат на столе.','Yechilgan masalalar stolda yotibdi.'],['Музей закрыт на ремонт.','Muzey ta\'mirga yopilgan.']],
  words:[['изучающий','o\'rganayotgan'],['прочитанный','o\'qilgan'],['написанный','yozilgan'],['любимый','sevimli'],['закрыт','yopiq'],['открыт','ochiq']],
  tasks:[
    {t:'c', q:'Девушка, ___ у окна, — моя сестра. (стоять — hozirgi)', o:['стоящая','стоявшая','стоимая'], a:0},
    {t:'c', q:'Я прочитал книгу, ___ вчера в библиотеке. (взять — majhul o\'tgan)', o:['взятую','взявшую','берущую'], a:0},
    {t:'i', q:'Письмо уже ___. (написать — qisqa shakl)', a:['написано']},
    {t:'i', q:'Дверь ___. (закрыть — qisqa shakl)', a:['закрыта']},
    {t:'c', q:'Студент, который сдал экзамен = ___ экзамен студент', o:['сдавший','сдающий','сданный'], a:0},
    {t:'c', q:'Книга, которую читают = ___ книга', o:['читаемая','читающая','читавшая'], a:0},
    {t:'c', q:'___ задачи лежат на столе. (решить)', o:['Решённые','Решающие','Решавшие'], a:0},
    {t:'c', q:'Qaysi to\'g\'ri yozilgan?', o:['прочитанная статья','прочитаная статья','прочитанная статя'], a:0},
    {t:'i', q:'Это мой ___ фильм. (любить — majhul hozirgi)', a:['любимый']},
    {t:'c', q:'Люди, ___ в этом доме, очень дружные. (жить — hozirgi)', o:['живущие','жившие','живимые'], a:0}
  ]
},
{
  id:'ravishdosh', g:'B2', level:'B2', books:['RU','NP'],
  title:'Ravishdoshlar', ru:'Деепричастия: читая, прочитав',
  goal:'«o\'qib», «o\'qiyotib» ma\'nosidagi ravishdoshni yasash va gapda ishlatish.',
  blocks:[
    {h:'Ikki tur', tag:'o\'zgarmaydi',
     table:{head:['Tur','Qanday yasaladi','Misol','Ma\'nosi'], rows:[
      ['НСВ (bir vaqtda)','«они» asosi + <span class="end">-я / -а</span>','<span class="ru">чита-ют → читая, говор-ят → говоря, занима-ются → занимаясь</span>','o\'qiyotib, gapirib'],
      ['СВ (avval)','o\'tgan zamon asosi + <span class="end">-в / -вшись</span>','<span class="ru">прочита-л → прочитав, верну-лся → вернувшись</span>','o\'qib bo\'lib, qaytib']
     ]}},
    {h:'Asosiy qoida — bitta ega', tag:'muhim',
     html:'<p>Ravishdosh va asosiy fe\'l <b>bir xil egaga</b> tegishli bo\'lishi shart:</p><div class="rule-box"><ul><li>✓ <span class="ru">Читая книгу, <b>я</b> пил чай.</span> — Kitob o\'qiyotib choy ichdim.</li><li>✓ <span class="ru">Вернувшись домой, <b>он</b> позвонил маме.</span> — Uyga qaytib, oyisiga qo\'ng\'iroq qildi.</li><li>✗ <span class="ru">Подъезжая к станции, у меня слетела шляпа.</span> — xato (ega har xil).</li></ul></div><p>Ravishdoshli bo\'lak vergul bilan ajratiladi.</p>',
     note:'<b>Istisnolar:</b> <span class="ru">быть → будучи; идти → идя; прийти → придя; давать → давая; вставать → вставая</span>. Ba\'zi fe\'llarda НСВ ravishdosh yo\'q: <span class="ru">писать, ждать, бежать</span> (kam ishlatiladi).'}
  ],
  examples:[['Слушая музыку, я делаю домашнее задание.','Musiqa tinglab, uy vazifasini qilaman.'],['Закончив работу, мы пошли домой.','Ishni tugatib, uyga ketdik.'],['Улыбаясь, она открыла дверь.','Jilmayib, u eshikni ochdi.'],['Не зная дороги, мы спросили прохожего.','Yo\'lni bilmay, o\'tkinchidan so\'radik.']],
  words:[['читая','o\'qiyotib'],['прочитав','o\'qib bo\'lib'],['вернувшись','qaytib'],['не зная','bilmay'],['улыбаясь','jilmayib'],['будучи','bo\'la turib']],
  tasks:[
    {t:'i', q:'___ музыку, я делаю уроки. (слушать — НСВ)', a:['слушая']},
    {t:'i', q:'___ работу, мы пошли домой. (закончить — СВ)', a:['закончив']},
    {t:'i', q:'___ домой, он позвонил маме. (вернуться — СВ)', a:['вернувшись']},
    {t:'c', q:'___, она открыла дверь. (улыбаться)', o:['Улыбаясь','Улыбав','Улыбнувшая'], a:0},
    {t:'c', q:'Не ___ дороги, мы спросили прохожего.', o:['зная','знав','знающий'], a:0},
    {t:'c', q:'Qaysi gap to\'g\'ri?', o:['Прочитав письмо, я заплакал.','Прочитав письмо, мне стало грустно.'], a:0, x:'Ega bir xil bo\'lishi kerak.'},
    {t:'c', q:'___ студентом, он много работал. (быть)', o:['Будучи','Бывая','Быв'], a:0},
    {t:'c', q:'___ в комнату, он поздоровался. (войти)', o:['Войдя','Входив','Вошедши'], a:0},
    {t:'c', q:'«Kitob o\'qiyotib, choy ichardim» ma\'nosi:', o:['Читая книгу, я пил чай.','Прочитав книгу, я выпил чай.'], a:0},
    {t:'i', q:'___ по-русски, он немного волновался. (говорить — НСВ)', a:['говоря']}
  ]
},
{
  id:'majhul', g:'B2', level:'B2', books:['RU','NP'],
  title:'Majhul nisbat', ru:'Пассивные конструкции: строится, построен',
  goal:'«Qurilmoqda», «qurilgan» kabi majhul gaplarni tuzish va aniq gapga aylantirish.',
  blocks:[
    {h:'Uch usul', tag:'gazeta tili',
     table:{head:['Usul','Ruscha','Tarjima'], rows:[
      ['НСВ + -ся (jarayon)','<span class="ru">Новая школа строится рабочими.</span>','Yangi maktab ishchilar tomonidan qurilmoqda.'],
      ['Qisqa sifatdosh (natija, СВ)','<span class="ru">Школа построена в 2020 году.</span>','Maktab 2020-yilda qurilgan.'],
      ['Noaniq-shaxsli (они, egasiz)','<span class="ru">Здесь строят новую школу.</span>','Bu yerda yangi maktab qurishyapti.']
     ]}},
    {h:'Bajaruvchi — tvoritelniy',
     html:'<p>Ishni kim bajarganini aytish kerak bo\'lsa, u <b>tvoritelniy</b> kelishikda bo\'ladi (o\'zbekchada «… tomonidan»):</p><div class="rule-box"><ul><li>Aniq: <span class="ru">Пушкин написал роман.</span></li><li>Majhul: <span class="ru">Роман написан <b>Пушкиным</b>.</span></li><li>Aniq: <span class="ru">Студенты изучают проблему.</span> → Majhul: <span class="ru">Проблема изучается <b>студентами</b>.</span></li></ul></div>',
     note:'<b>Zamon:</b> qisqa shakl + <span class="ru">был / будет</span>: <span class="ru">Мост был построен в прошлом году. Мост будет построен через год.</span>'}
  ],
  examples:[['Этот дворец был построен в XIX веке.','Bu saroy XIX asrda qurilgan.'],['Вопрос обсуждается на собрании.','Masala yig\'ilishda muhokama qilinmoqda.'],['Решение будет принято завтра.','Qaror ertaga qabul qilinadi.'],['В газете пишут о выставке.','Gazetada ko\'rgazma haqida yozishyapti.']],
  words:[['строиться','qurilmoqda'],['построен','qurilgan'],['обсуждаться','muhokama qilinmoq'],['принят','qabul qilingan'],['основан','asos solingan'],['создан','yaratilgan']],
  tasks:[
    {t:'c', q:'Новая школа ___ рабочими. (jarayon)', o:['строится','построена','строит'], a:0},
    {t:'c', q:'Школа ___ в 2020 году. (natija)', o:['построена','строится','построила'], a:0},
    {t:'i', q:'Роман написан ___. (Толстой)', a:['Толстым']},
    {t:'i', q:'Проблема изучается ___. (учёные)', a:['учёными','учеными']},
    {t:'c', q:'Мост ___ построен в прошлом году.', o:['был','будет','есть'], a:0},
    {t:'c', q:'Решение ___ принято завтра.', o:['будет','было','был'], a:0},
    {t:'c', q:'«Bu yerda uy qurishyapti» (egasiz):', o:['Здесь строят дом.','Здесь строится дом им.','Здесь построен дом.'], a:0},
    {t:'i', q:'Город Ташкент ___ более двух тысяч лет назад. (основать — qisqa, м)', a:['основан']},
    {t:'c', q:'Вопрос ___ на собрании. (muhokama qilinmoqda)', o:['обсуждается','обсуждён','обсуждает'], a:0},
    {t:'i', q:'Магазин ___. (закрыть — qisqa, м)', a:['закрыт']}
  ]
},
{
  id:'ozlashtirma', g:'B2', level:'B2', books:['DR','RU','NP'],
  title:'Ko\'chirma va o\'zlashtirma gap', ru:'Прямая и косвенная речь',
  goal:'Birovning gapini, savolini va iltimosini o\'z so\'zingiz bilan yetkazish.',
  blocks:[
    {h:'Uch holat', tag:'что · ли · чтобы',
     table:{head:['Ko\'chirma gap','O\'zlashtirma gap','Qoida'], rows:[
      ['<span class="ru">«Я приду», — сказал он.</span>','<span class="ru">Он сказал, <b>что</b> придёт.</span>','Darak gap → <b>что</b>'],
      ['<span class="ru">«Ты знаешь Анну?» — спросил он.</span>','<span class="ru">Он спросил, знаю <b>ли</b> я Анну.</span>','So\'roq so\'zsiz savol → <b>ли</b>'],
      ['<span class="ru">«Где ты живёшь?» — спросил он.</span>','<span class="ru">Он спросил, <b>где</b> я живу.</span>','So\'roq so\'zi saqlanadi'],
      ['<span class="ru">«Приходи завтра!» — сказал он.</span>','<span class="ru">Он сказал, <b>чтобы</b> я пришёл завтра.</span>','Buyruq → <b>чтобы</b> + o\'tgan zamon']
     ]}},
    {h:'Nima o\'zgaradi?',
     html:'<div class="rule-box"><ul><li><b>Shaxs</b> o\'zgaradi: <span class="ru">я → он, ты → я</span>.</li><li><b>Zamon</b> o\'zgarmaydi (inglizchadan farqli!): <span class="ru">«Я болею» → Он сказал, что болеет.</span></li><li><b>ли</b> savol beriladigan so\'zdan keyin turadi: <span class="ru">Он спросил, <b>завтра ли</b> экзамен.</span></li></ul></div><p>Yetkazuvchi fe\'llar: <span class="ru">сказать, сообщить, ответить, спросить, попросить, посоветовать, предложить, объяснить</span>.</p>'}
  ],
  examples:[['Мама сказала, что ужин готов.','Oyim kechki ovqat tayyorligini aytdi.'],['Учитель спросил, понимаем ли мы задание.','O\'qituvchi topshiriqni tushunyapmizmi, deb so\'radi.'],['Врач посоветовал, чтобы я больше гулял.','Shifokor ko\'proq sayr qilishimni maslahat berdi.'],['Он спросил, когда начинается урок.','U dars qachon boshlanishini so\'radi.']],
  words:[['сообщить','xabar bermoq'],['ответить','javob bermoq'],['попросить','iltimos qilmoq'],['посоветовать','maslahat bermoq'],['предложить','taklif qilmoq'],['ли','-mi (so\'roq)']],
  tasks:[
    {t:'c', q:'«Я приду», — сказал Олег. → Олег сказал, ___ придёт.', o:['что','чтобы','ли'], a:0},
    {t:'c', q:'«Ты знаешь Анну?» → Он спросил, знаю ___ я Анну.', o:['ли','что','чтобы'], a:0},
    {t:'c', q:'«Закрой окно!» → Мама попросила, ___ я закрыл окно.', o:['чтобы','что','ли'], a:0},
    {t:'c', q:'«Где ты живёшь?» → Он спросил, ___ я живу.', o:['где','что','ли'], a:0},
    {t:'i', q:'«Я болею», — сказала Нигора. → Нигора сказала, что ___.', a:['болеет']},
    {t:'c', q:'«Приходите в 9», — сказал директор. → Директор сказал, чтобы мы ___ в 9.', o:['пришли','придём','приходим'], a:0},
    {t:'c', q:'Он спросил, ___ экзамен. (ertagami — urg\'u «завтра»da)', o:['завтра ли','ли завтра','что завтра'], a:0},
    {t:'i', q:'«Я купил билеты», — сказал брат. → Брат сказал, что ___ билеты.', a:['купил']},
    {t:'c', q:'«Будет ли дождь?» → Я не знаю, будет ___ дождь.', o:['ли','что','чтобы'], a:0},
    {t:'c', q:'Врач посоветовал, чтобы я больше ___.', o:['отдыхал','отдыхаю','отдыхать'], a:0}
  ]
},
{
  id:'boshqaruv', g:'B2', level:'B2', books:['RU'],
  title:'Fe\'l boshqaruvi va murakkab ko\'makchilar', ru:'Управление глаголов и составные предлоги',
  goal:'Qaysi fe\'l qaysi kelishikni talab qilishini bilish va kitobiy ko\'makchilarni ishlatish.',
  blocks:[
    {h:'Fe\'l + kelishik', tag:'yodlang',
     table:{head:['Kelishik','Fe\'llar','Misol'], rows:[
      ['Род.','бояться, избегать, достигать, требовать, ждать (ma\'no: kutish)','<span class="ru">бояться темноты, достичь успеха</span>'],
      ['от + Род.','зависеть, отказаться, отличаться, устать','<span class="ru">зависеть от погоды, отказаться от помощи</span>'],
      ['Дат.','удивляться, радоваться, верить, мешать, завидовать','<span class="ru">удивляться новости, мешать соседям</span>'],
      ['на + Вин.','влиять, жаловаться, надеяться, обижаться, реагировать','<span class="ru">влиять на результат, жаловаться на шум</span>'],
      ['Твор.','гордиться, интересоваться, руководить, увлекаться, владеть','<span class="ru">гордиться сыном, руководить отделом</span>'],
      ['в + Предл.','нуждаться, сомневаться, участвовать, признаваться','<span class="ru">нуждаться в помощи, участвовать в конкурсе</span>']
     ]}},
    {h:'Kitobiy ko\'makchilar',
     table:{head:['Ko\'makchi','Kelishik','Misol','Tarjima'], rows:[
      ['благодаря','Дат.','<span class="ru">благодаря помощи друзей</span>','yordami tufayli (ijobiy)'],
      ['из-за','Род.','<span class="ru">из-за дождя</span>','yomg\'ir sababli (salbiy)'],
      ['несмотря на','Вин.','<span class="ru">несмотря на трудности</span>','qiyinchiliklarga qaramay'],
      ['в течение','Род.','<span class="ru">в течение года</span>','yil davomida'],
      ['в связи с','Твор.','<span class="ru">в связи с ремонтом</span>','ta\'mir munosabati bilan'],
      ['по сравнению с','Твор.','<span class="ru">по сравнению с прошлым годом</span>','o\'tgan yilga nisbatan'],
      ['в результате','Род.','<span class="ru">в результате переговоров</span>','muzokaralar natijasida']
     ]},
     note:'<b>Farqi:</b> <span class="ru">благодаря</span> — yaxshi natija sababi, <span class="ru">из-за</span> — yomon natija sababi: <span class="ru">Благодаря тебе я сдал экзамен. Из-за пробки я опоздал.</span>'}
  ],
  examples:[['Успех зависит от каждого из нас.','Muvaffaqiyat har birimizga bog\'liq.'],['Несмотря на дождь, матч состоялся.','Yomg\'irga qaramay, o\'yin bo\'lib o\'tdi.'],['Мы гордимся нашими учениками.','O\'quvchilarimiz bilan faxrlanamiz.'],['В связи с праздником магазин не работает.','Bayram munosabati bilan do\'kon ishlamaydi.']],
  words:[['зависеть от','bog\'liq bo\'lmoq'],['влиять на','ta\'sir qilmoq'],['нуждаться в','muhtoj bo\'lmoq'],['благодаря','tufayli'],['несмотря на','qaramay'],['в течение','davomida']],
  tasks:[
    {t:'c', q:'Ребёнок боится ___.', o:['темноты','темноту','темнотой'], a:0},
    {t:'c', q:'Всё зависит ___ погоды.', o:['от','на','в'], a:0},
    {t:'i', q:'Мы гордимся нашим ___. (сын)', a:['сыном']},
    {t:'c', q:'Шум мешает ___. (соседи)', o:['соседям','соседей','соседями'], a:0},
    {t:'c', q:'Климат влияет ___ здоровье.', o:['на','в','от'], a:0},
    {t:'c', q:'___ помощи друзей я быстро переехал.', o:['Благодаря','Из-за','Несмотря на'], a:0},
    {t:'c', q:'___ пробки я опоздал на встречу.', o:['Из-за','Благодаря','В течение'], a:0},
    {t:'i', q:'Несмотря на ___, мы закончили проект. (трудности)', a:['трудности']},
    {t:'i', q:'Он нуждается в ___. (помощь)', a:['помощи']},
    {t:'c', q:'В связи ___ ремонтом библиотека закрыта.', o:['с','со','на'], a:0}
  ]
},

/* ================================================================ C1 */
{
  id:'vid-nozik', g:'C1', level:'C1', books:[],
  title:'Fe\'l turining nozikliklari', ru:'Вид глагола: тонкие случаи',
  goal:'Buyruq, inkor, o\'tgan zamon va «нельзя» bilan turni ma\'noga qarab tanlash.',
  blocks:[
    {h:'Buyruq maylida', tag:'nozik',
     html:'<div class="rule-box"><ul><li><b>СВ</b> — aniq iltimos: <span class="ru">Откройте, пожалуйста, окно.</span></li><li><b>НСВ</b> — taklif, ruxsat, «marhamat»: <span class="ru">Проходите! Садитесь! Берите ещё!</span> Ba\'zan shoshirish: <span class="ru">Ну, рассказывай!</span></li><li><b>Inkor + НСВ</b> — taqiq: <span class="ru">Не открывай окно!</span> (ochma)</li><li><b>Inkor + СВ</b> — ogohlantirish, «tag\'in … qilib qo\'yma»: <span class="ru">Не забудь ключи! Не упади!</span></li></ul></div>'},
    {h:'O\'tgan zamonda НСВ — fakt',
     html:'<p>Harakat natijasi emas, <b>faktning o\'zi</b> muhim bo\'lsa — НСВ: <span class="ru">Вы читали «Войну и мир»?</span> (umuman o\'qiganmisiz?) — <span class="ru">Да, читал.</span></p><p>Natija <b>bekor bo\'lgan</b> harakat ham НСВ: <span class="ru">Кто открывал окно?</span> (kimdir ochgan, hozir yopiq) — <span class="ru">Кто открыл окно?</span> (hozir ochiq).</p>'},
    {h:'Нельзя / не надо + infinitiv',
     table:{head:['Ruscha','Ma\'nosi'], rows:[
      ['<span class="ru">Здесь нельзя переходить улицу.</span>','НСВ — taqiqlangan, mumkin emas'],
      ['<span class="ru">Эту дверь нельзя открыть.</span>','СВ — imkonsiz, ochib bo\'lmaydi'],
      ['<span class="ru">Не надо звонить.</span>','НСВ — kerak emas'],
      ['<span class="ru">Надо позвонить.</span>','СВ — bir martalik zarurat']
     ]},
     note:'<b>Qoida:</b> <span class="ru">не надо, не нужно, не стоит, не следует, нельзя (taqiq)</span> dan keyin odatda <b>НСВ</b> ishlatiladi.'}
  ],
  examples:[['Не забудь позвонить бабушке!','Buvingga qo\'ng\'iroq qilishni unutma!'],['Не трогай, это горячо!','Tegma, issiq!'],['Ты когда-нибудь был в Петербурге? — Был.','Hech Peterburgda bo\'lganmisan? — Bo\'lganman.'],['Не стоит об этом беспокоиться.','Bu haqda xavotir olishga arzimaydi.']],
  words:[['проходите','kiring, marhamat'],['не забудь','unutma'],['не стоит','arzimaydi, kerak emas'],['нельзя','mumkin emas'],['когда-нибудь','qachondir'],['следует','lozim']],
  tasks:[
    {t:'c', q:'Mehmonga: «Kiring, o\'tiring!»', o:['Проходите, садитесь!','Пройдите, сядьте!'], a:0, x:'Taklif — НСВ.'},
    {t:'c', q:'Ogohlantirish: «Pasportni unutib qo\'yma!»', o:['Не забудь паспорт!','Не забывай паспорт!'], a:0},
    {t:'c', q:'Taqiq: «Derazani ochma!»', o:['Не открывай окно!','Не открой окно!'], a:0},
    {t:'c', q:'— Вы ___ этот фильм? — Да, в прошлом году. (umuman fakt)', o:['смотрели','посмотрели'], a:0},
    {t:'c', q:'В комнате холодно. Кто ___ окно? (hozir ham ochiq)', o:['открыл','открывал'], a:0},
    {t:'c', q:'Окно закрыто, но холодно. Кто ___ окно? (ochib, yopgan)', o:['открывал','открыл'], a:0},
    {t:'c', q:'Здесь нельзя ___. (taqiq: chekish)', o:['курить','покурить'], a:0},
    {t:'c', q:'Замок сломан, дверь нельзя ___. (imkonsiz)', o:['открыть','открывать'], a:0},
    {t:'c', q:'Не надо ___ мне, я сам всё сделаю.', o:['помогать','помочь'], a:0},
    {t:'c', q:'Ehtiyot bo\'l, yiqilib tushma!', o:['Не упади!','Не падай!'], a:0, x:'Tasodifiy xavf — СВ.'}
  ]
},
{
  id:'rasmiy', g:'C1', level:'C1', books:[],
  title:'Rasmiy-ish uslubi', ru:'Официально-деловой стиль и отглагольные существительные',
  goal:'Ariza, xat va hisobotda rasmiy iboralar va fe\'ldan yasalgan otlarni ishlatish.',
  blocks:[
    {h:'Fe\'l → ot (nominalizatsiya)', tag:'rasmiy matn',
     html:'<p>Rasmiy matnda fe\'l o\'rniga ko\'pincha <b>ot + yordamchi fe\'l</b> ishlatiladi:</p>',
     table:{head:['Oddiy nutq','Rasmiy uslub','Tarjima'], rows:[
      ['помогать','оказывать помощь','yordam ko\'rsatmoq'], ['проверять','проводить проверку','tekshiruv o\'tkazmoq'],
      ['решить','принять решение','qaror qabul qilmoq'], ['контролировать','осуществлять контроль','nazoratni amalga oshirmoq'],
      ['влиять','оказывать влияние','ta\'sir ko\'rsatmoq'], ['обсуждать','вести обсуждение','muhokama olib bormoq'],
      ['участвовать','принимать участие','ishtirok etmoq'], ['анализировать','проводить анализ','tahlil o\'tkazmoq']
     ]}},
    {h:'Rasmiy ko\'makchilar va qoliplar',
     html:'<div class="rule-box"><ul><li><span class="ru">в соответствии с приказом</span> — buyruqqa muvofiq</li><li><span class="ru">на основании заявления</span> — ariza asosida</li><li><span class="ru">в целях улучшения</span> — yaxshilash maqsadida</li><li><span class="ru">по причине болезни</span> — kasallik sababli</li><li><span class="ru">в случае отсутствия</span> — bo\'lmagan taqdirda</li><li><span class="ru">Прошу предоставить…</span> — … berishingizni so\'rayman</li><li><span class="ru">Довожу до вашего сведения, что…</span> — Ma\'lumotingiz uchun xabar beraman…</li></ul></div>'},
    {h:'Ariza namunasi (заявление)',
     html:'<div class="rule-box ru" style="font-size:16px;line-height:1.7">Директору колледжа №5<br>Иванову И. И.<br>от преподавателя математики<br>Каримова А. Б.<br><br><div style="text-align:center"><b>Заявление</b></div>Прошу предоставить мне отпуск без сохранения заработной платы с 10 по 12 ноября 2026 года по семейным обстоятельствам.<br><br>08.10.2026 &nbsp;&nbsp;&nbsp;&nbsp; Подпись</div><p class="muted" style="margin-top:8px">Tartib: kimga (Дат.) → kimdan (от + Род.) → «Заявление» → «Прошу…» → sana va imzo.</p>'}
  ],
  examples:[['Комиссия провела проверку документов.','Komissiya hujjatlarni tekshirdi.'],['В соответствии с приказом занятия переносятся.','Buyruqqa muvofiq mashg\'ulotlar ko\'chiriladi.'],['Прошу разрешить мне участие в конференции.','Konferensiyada ishtirok etishimga ruxsat berishingizni so\'rayman.'],['Студенты приняли активное участие в конкурсе.','Talabalar tanlovda faol ishtirok etishdi.']],
  words:[['заявление','ariza'],['приказ','buyruq'],['предоставить','taqdim etmoq, bermoq'],['осуществлять','amalga oshirmoq'],['в соответствии с','muvofiq'],['на основании','asosida']],
  tasks:[
    {t:'c', q:'помогать → оказывать ___', o:['помощь','помощи','помогание'], a:0},
    {t:'c', q:'решить → принять ___', o:['решение','решенье','решимость'], a:0},
    {t:'c', q:'участвовать → принимать ___', o:['участие','участство','участника'], a:0},
    {t:'c', q:'проверять → проводить ___', o:['проверку','проверение','проверка'], a:0},
    {t:'c', q:'В ___ с приказом директора…', o:['соответствии','соответствие','соответствия'], a:0},
    {t:'c', q:'На основании ___ студента…', o:['заявления','заявление','заявлению'], a:0},
    {t:'i', q:'___ предоставить мне отпуск. (ariza boshlanishi)', a:['прошу']},
    {t:'c', q:'Arizada «kimga» qismi:', o:['Директору техникума','Директор техникума','Директора техникума'], a:0},
    {t:'c', q:'Arizada «kimdan» qismi:', o:['от преподавателя','преподавателю','с преподавателем'], a:0},
    {t:'c', q:'«Yaxshilash maqsadida» rasmiy:', o:['в целях улучшения','для того улучшить','чтобы улучшение'], a:0}
  ]
},
{
  id:'diskurs', g:'C1', level:'C1', books:[],
  title:'Kirish so\'zlari va matn bog\'lovchilari', ru:'Вводные слова и средства связи текста',
  goal:'Fikrni izchil bayon qilish, munosabat bildirish va xulosa chiqarish.',
  blocks:[
    {h:'Vazifasi bo\'yicha', tag:'esse va nutq',
     table:{head:['Vazifa','Ruscha','Tarjima'], rows:[
      ['Tartib','во-первых, во-вторых, наконец','birinchidan, ikkinchidan, nihoyat'],
      ['Qarama-qarshi','однако, тем не менее, зато, напротив','biroq, shunga qaramay, buning evaziga, aksincha'],
      ['Ikki tomon','с одной стороны … с другой стороны','bir tomondan … boshqa tomondan'],
      ['Xulosa','итак, таким образом, следовательно, в итоге','demak, shunday qilib, binobarin, oqibatda'],
      ['Aniqlash','иначе говоря, то есть, а именно','boshqacha aytganda, ya\'ni, aniqrog\'i'],
      ['Ishonch','безусловно, конечно, несомненно','shubhasiz, albatta'],
      ['Taxmin','по-видимому, вероятно, кажется','chamasi, ehtimol, shekilli'],
      ['Qo\'shimcha','кроме того, к тому же, кстати','bundan tashqari, ustiga-ustak, aytgancha'],
      ['Manba','по мнению учёных, по данным, как известно','olimlar fikricha, ma\'lumotlarga ko\'ra, ma\'lumki']
     ]}},
    {h:'Tinish belgilari',
     html:'<p>Kirish so\'zlari gapning boshqa qismlaridan <b>vergul</b> bilan ajratiladi: <span class="ru">Он, <b>по-видимому</b>, опоздает. <b>Во-первых</b>, это дорого.</span></p><div class="rule-box"><b>Kirish so\'zi emas (vergul qo\'yilmaydi):</b><ul><li><span class="ru">однако</span> gap boshida bog\'lovchi bo\'lsa: <span class="ru">Однако он не пришёл.</span></li><li><span class="ru">вдруг, вряд ли, именно, почти, даже, будто</span> — hech qachon kirish so\'zi emas.</li></ul></div>'}
  ],
  examples:[['С одной стороны, жизнь в городе удобна, с другой стороны, там шумно.','Bir tomondan shaharda yashash qulay, boshqa tomondan u yer shovqinli.'],['Билеты дорогие; тем не менее, все места проданы.','Chiptalar qimmat; shunga qaramay, barcha joylar sotilgan.'],['Итак, мы пришли к выводу, что проект нужен.','Demak, loyiha kerak degan xulosaga keldik.'],['Кстати, ты не знаешь, где Олег?','Aytgancha, Oleg qayerdaligini bilmaysanmi?']],
  words:[['однако','biroq'],['тем не менее','shunga qaramay'],['таким образом','shunday qilib'],['кроме того','bundan tashqari'],['по-видимому','chamasi'],['иначе говоря','boshqacha aytganda']],
  tasks:[
    {t:'c', q:'Дождь шёл весь день; ___, мы пошли гулять.', o:['тем не менее','таким образом','во-первых'], a:0},
    {t:'c', q:'___, выводы исследования подтвердились. (xulosa)', o:['Таким образом','Кстати','Во-вторых'], a:0},
    {t:'c', q:'Эта работа интересная, ___ хорошо оплачивается. (qo\'shimcha)', o:['к тому же','однако','напротив'], a:0},
    {t:'c', q:'Он, ___, заболел: его нет уже три дня. (taxmin)', o:['по-видимому','безусловно','итак'], a:0},
    {t:'c', q:'С одной стороны, это быстро, с ___ стороны, дорого.', o:['другой','второй','иной'], a:0},
    {t:'c', q:'Qaysi gapda vergul to\'g\'ri qo\'yilgan?', o:['Он, конечно, прав.','Он конечно прав.','Он, конечно прав.'], a:0},
    {t:'c', q:'Qaysi so\'z kirish so\'zi EMAS?', o:['вряд ли','кажется','наверное'], a:0},
    {t:'c', q:'Я не люблю спорт, ___ люблю шахматы. (buning evaziga)', o:['зато','итак','следовательно'], a:0},
    {t:'c', q:'___ данным статистики, население растёт.', o:['По','По мнению','Как'], a:0},
    {t:'c', q:'Он полиглот, ___, говорит на пяти языках. (ya\'ni)', o:['то есть','однако','зато'], a:0}
  ]
},
{
  id:'frazeologiya', g:'C1', level:'C1', books:[],
  title:'Frazeologizmlar', ru:'Фразеологизмы и устойчивые выражения',
  goal:'Eng ko\'p ishlatiladigan iboralarni tushunish va o\'zbekcha muqobilini bilish.',
  blocks:[
    {h:'Eng mashhur iboralar', tag:'jonli nutq',
     table:{head:['Ruscha','Ma\'nosi','O\'zbekcha muqobil'], rows:[
      ['как две капли воды','juda o\'xshash','ikki tomchi suvdek'],
      ['золотые руки','usta, mohir','qo\'li gul'],
      ['бить баклуши','bekor yurmoq','qo\'l qovushtirib o\'tirmoq'],
      ['сидеть сложа руки','hech narsa qilmaslik','qo\'l qovushtirib o\'tirmoq'],
      ['водить за нос','aldab yurmoq','laqillatmoq'],
      ['вешать нос','tushkunlikka tushmoq','boshini egib qolmoq'],
      ['держать слово','va\'dasida turmoq','so\'zida turmoq'],
      ['на седьмом небе','juda baxtli','do\'ppisini osmonga otmoq'],
      ['яблоку негде упасть','juda gavjum','igna tashlasang yerga tushmaydi'],
      ['когда рак на горе свистнет','hech qachon','tuyaning dumi yerga tekkanda'],
      ['спустя рукава','beparvo ishlamoq','yuzaki, chala-chulpa'],
      ['ни пуха ни пера','omad tilash (imtihondan oldin)','oq yo\'l, omad!'],
      ['с глазу на глаз','yolg\'iz, ikki kishi','yuzma-yuz, xoli'],
      ['душа в душу','ahil','jon-jon bo\'lib']
     ]},
     note:'<b>Odob:</b> <span class="ru">«Ни пуха ни пера!»</span> deb tilashganda <span class="ru">«К чёрту!»</span> deb javob berish an\'anaga aylangan — bu qo\'pollik emas.'},
    {h:'Maqol va matallar',
     html:'<div class="rule-box"><ul><li><span class="ru">Без труда не вытащишь и рыбку из пруда.</span> — Mehnatsiz rohat yo\'q.</li><li><span class="ru">Не имей сто рублей, а имей сто друзей.</span> — Yuz so\'ming bo\'lmasin, yuz do\'sting bo\'lsin.</li><li><span class="ru">Повторенье — мать ученья.</span> — Takror — ilm onasi.</li><li><span class="ru">Тише едешь — дальше будешь.</span> — Sekin yursang, uzoqqa borasan.</li><li><span class="ru">Лучше поздно, чем никогда.</span> — Hech qachondan ko\'ra kech bo\'lsa ham yaxshi.</li></ul></div>'}
  ],
  examples:[['Сын похож на отца как две капли воды.','O\'g\'li otasiga ikki tomchi suvdek o\'xshaydi.'],['У нашего соседа золотые руки.','Qo\'shnimizning qo\'li gul.'],['Хватит бить баклуши, пора работать!','Bekor yurish yetar, ishlash vaqti keldi!'],['На концерте яблоку негде было упасть.','Konsertda igna tashlasang yerga tushmasdi.']],
  words:[['фразеологизм','frazeologizm'],['пословица','maqol'],['поговорка','matal'],['выражение','ibora'],['смысл','ma\'no'],['дословно','so\'zma-so\'z']],
  tasks:[
    {t:'c', q:'«Qo\'li gul» ruscha:', o:['золотые руки','сидеть сложа руки','спустя рукава'], a:0},
    {t:'c', q:'Они похожи как две ___ воды.', o:['капли','ложки','реки'], a:0},
    {t:'c', q:'«водить за нос» ma\'nosi:', o:['aldab yurmoq','burnidan tortmoq','yordam bermoq'], a:0},
    {t:'c', q:'В зале было так много людей, что ___ негде упасть.', o:['яблоку','груше','иголке'], a:0},
    {t:'c', q:'Imtihon oldidan do\'stingizga:', o:['Ни пуха ни пера!','Спустя рукава!','Вешай нос!'], a:0},
    {t:'c', q:'«Hech qachon» ma\'nosidagi ibora:', o:['когда рак на горе свистнет','на седьмом небе','с глазу на глаз'], a:0},
    {t:'c', q:'Он получил работу мечты и был на ___ небе.', o:['седьмом','третьем','высоком'], a:0},
    {t:'c', q:'Без труда не вытащишь и рыбку из ___.', o:['пруда','реки','моря'], a:0},
    {t:'c', q:'«Beparvo, chala ishlamoq»:', o:['работать спустя рукава','держать слово','бить в точку'], a:0},
    {t:'c', q:'Повторенье — мать ___.', o:['ученья','терпенья','спасенья'], a:0}
  ]
},
{
  id:'soz-yasash', g:'C1', level:'C1', books:['RU'],
  title:'So\'z yasalishi', ru:'Словообразование: приставки и суффиксы',
  goal:'Old va oxirgi qo\'shimchalar orqali notanish so\'zning ma\'nosini topish.',
  blocks:[
    {h:'Ot yasovchi qo\'shimchalar', tag:'lug\'atni 3 barobar oshiradi',
     table:{head:['Qo\'shimcha','Ma\'no','Misol'], rows:[
      ['-тель','bajaruvchi','<span class="ru">учить → учитель, писать → писатель, водить → водитель</span>'],
      ['-ник / -щик / -чик','kasb, shaxs','<span class="ru">работник, сменщик, переводчик</span>'],
      ['-ость / -есть','sifat → mavhum ot','<span class="ru">радостный → радость, свежий → свежесть</span>'],
      ['-ние / -ение','harakat nomi','<span class="ru">читать → чтение, решить → решение</span>'],
      ['-ство','holat, jamoa','<span class="ru">детство, руководство, студенчество</span>'],
      ['-ка / -ица','ayol, kichraytirish','<span class="ru">студентка, учительница, ручка</span>']
     ]}},
    {h:'Sifat yasovchilar va prefikslar',
     html:'<div class="rule-box"><ul><li><b>-н-</b>: <span class="ru">книга → книжный, зима → зимний</span>; <b>-ск-</b>: <span class="ru">город → городской, Ташкент → ташкентский</span>; <b>-лив-</b>: <span class="ru">счастье → счастливый</span>.</li><li><b>пере-</b> qayta / haddan ortiq: <span class="ru">переписать, переесть</span>.</li><li><b>недо-</b> yetarli emas: <span class="ru">недосыпать, недооценить</span>.</li><li><b>раз- / рас-</b> tarqatish, bekor qilish: <span class="ru">раздать, разлюбить</span>.</li><li><b>со-</b> birgalikda: <span class="ru">сотрудник, соавтор</span>.</li><li><b>без- / бес-</b> -siz: <span class="ru">бесплатный, безопасный</span>.</li></ul></div>',
     note:'<b>Usul:</b> notanish so\'zni bo\'laklarga ajrating: <span class="ru">без-опас-н-ость</span> = «-siz + xavf + sifat + mavhum ot» → <i>xavfsizlik</i>.'}
  ],
  examples:[['Переводчик перевёл договор на узбекский язык.','Tarjimon shartnomani o\'zbek tiliga tarjima qildi.'],['Безопасность — главное на производстве.','Xavfsizlik — ishlab chiqarishda eng muhimi.'],['Не стоит недооценивать соперника.','Raqibni past baholamaslik kerak.'],['Мой сотрудник — опытный специалист.','Hamkasbim — tajribali mutaxassis.']],
  words:[['писатель','yozuvchi'],['переводчик','tarjimon'],['безопасность','xavfsizlik'],['сотрудник','xodim'],['бесплатный','bepul'],['детство','bolalik']],
  tasks:[
    {t:'i', q:'писать → тот, кто пишет книги: ___', a:['писатель']},
    {t:'i', q:'читать → процесс: ___', a:['чтение']},
    {t:'i', q:'радостный → ___ (mavhum ot)', a:['радость']},
    {t:'c', q:'переводить → человек: ___', o:['переводчик','переводитель','переводник'], a:0},
    {t:'c', q:'Ташкент → ___ (sifat)', o:['ташкентский','ташкентный','ташкентовый'], a:0},
    {t:'c', q:'«Bepul» ruscha:', o:['бесплатный','безплатный','неплатный'], a:0, x:'Jarangsiz undosh oldidan «бес-».'},
    {t:'c', q:'«недосыпать» ma\'nosi:', o:['yetarlicha uxlamaslik','ortiqcha uxlamoq','qayta uxlamoq'], a:0},
    {t:'c', q:'«соавтор» ma\'nosi:', o:['hammuallif','sobiq muallif','muallifsiz'], a:0},
    {t:'i', q:'студент → ayol: ___', a:['студентка']},
    {t:'c', q:'ребёнок (bolalik) → ___', o:['детство','детскость','детнота'], a:0}
  ]
}
);
