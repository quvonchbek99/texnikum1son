/* YHQ viktorina — savollar banki (Yoʻl harakati qoidalari 2026 asosida)
 * Belgilar, chiziqlar va jarimalar savollari APPDATA dan avtomatik tuziladi; qoidalar savollari qoʻlda,
 * har biri Qoidalarning bandiga tayangan (ref). */
(function (g) {
  'use strict';
  var D = g.APPDATA;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---- Qoidalar boʻyicha savollar: [savol, toʻgʻri javob, [notoʻgʻri javoblar], band] ---- */
  var RULES = [
    ['Aholi punktlarida (umumiy qoida boʻyicha) transport vositalarining eng yuqori tezligi qancha?', 'Soatiga 70 km', ['Soatiga 60 km', 'Soatiga 80 km', 'Soatiga 90 km'], '78'],
    ['Toshkent va Nukus shaharlarida, viloyat va tuman markazlarida ruxsat etilgan eng yuqori tezlik qancha?', 'Soatiga 60 km', ['Soatiga 70 km', 'Soatiga 50 km', 'Soatiga 80 km'], '78'],
    ['Turar joy dahalari va yondosh hududlarda eng yuqori tezlik qancha?', 'Soatiga 20 km', ['Soatiga 10 km', 'Soatiga 30 km', 'Soatiga 40 km'], '78'],
    ['Belgilar oʻrnatilgan maktabga yetmasdan va oʻtib ketib 300 metrdan kam masofada tezlik qanchadan oshmasligi kerak?', 'Soatiga 30 km', ['Soatiga 20 km', 'Soatiga 40 km', 'Soatiga 50 km'], '78'],
    ['Aholi punktidan tashqarida yengil avtomobil uchun eng yuqori tezlik qancha?', 'Soatiga 100 km', ['Soatiga 90 km', 'Soatiga 110 km', 'Soatiga 120 km'], '79'],
    ['Aholi punktidan tashqarida shaharlararo avtobus va mikroavtobuslar uchun eng yuqori tezlik qancha?', 'Soatiga 90 km', ['Soatiga 80 km', 'Soatiga 100 km', 'Soatiga 70 km'], '79'],
    ['Aholi punktidan tashqarida mototsikllar uchun eng yuqori tezlik qancha?', 'Soatiga 80 km', ['Soatiga 90 km', 'Soatiga 100 km', 'Soatiga 70 km'], '79'],
    ['Aholi punktidan tashqarida tirkamali yuk avtomobillari uchun eng yuqori tezlik qancha?', 'Soatiga 70 km', ['Soatiga 60 km', 'Soatiga 80 km', 'Soatiga 90 km'], '79'],
    ['Yukxonasida odam tashiyotgan yuk avtomobili har qanday yoʻlda qanchadan tez yurmasligi kerak?', 'Soatiga 60 km', ['Soatiga 50 km', 'Soatiga 70 km', 'Soatiga 40 km'], '80'],
    ['Bolalar guruhini tashkiliy tashiyotgan transport vositasining eng yuqori tezligi qancha?', 'Soatiga 60 km', ['Soatiga 50 km', 'Soatiga 70 km', 'Soatiga 80 km'], '80'],
    ['Mexanik transport vositasini shatakka olgan transport vositasining eng yuqori tezligi qancha?', 'Soatiga 50 km', ['Soatiga 40 km', 'Soatiga 60 km', 'Soatiga 70 km'], '80'],
    ['Avariya sababli toʻxtash belgisi aholi punktida transport vositasidan kamida qancha masofada qoʻyiladi?', '15 metr', ['10 metr', '20 metr', '30 metr'], '51'],
    ['Avariya sababli toʻxtash belgisi aholi punktidan tashqarida transport vositasidan kamida qancha masofada qoʻyiladi?', '30 metr', ['15 metr', '20 metr', '50 metr'], '51'],
    ['Yoʻlning koʻrinish masofasi qanchadan kam boʻlsa, bu “yetarlicha koʻrinmaslik” deyiladi?', '300 metrdan', ['100 metrdan', '150 metrdan', '500 metrdan'], '6'],
    ['Kesishmadan oʻtish taqiqlanganda, shlagbaum boʻlsa, haydovchi unga kamida necha metr qolganda toʻxtashi kerak?', '5 metr', ['3 metr', '10 metr', '15 metr'], '119'],
    ['Kesishmada shlagbaum boʻlmasa, haydovchi birinchi temir yoʻl iziga kamida necha metr qolganda toʻxtashi kerak?', '10 metr', ['5 metr', '15 metr', '20 metr'], '119'],
    ['Temir yoʻl kesishmasiga qancha masofa qolganda quvib oʻtish taqiqlanadi?', '100 metrdan kam', ['50 metrdan kam', '150 metrdan kam', '200 metrdan kam'], '86'],
    ['Piyodalar oʻtish joyiga qancha masofa qolganda toʻxtash taqiqlanadi?', '10 metrdan kam', ['5 metrdan kam', '15 metrdan kam', '20 metrdan kam'], '91'],
    ['Qatnov qismlari kesishmasida va kesishayotgan qatnov qismi chetiga qancha masofada toʻxtash taqiqlanadi?', '30 metrdan kam', ['10 metrdan kam', '15 metrdan kam', '50 metrdan kam'], '91'],
    ['Yoʻnalishli transport bekati belgisidan (yetmasdan va oʻtib ketib) qancha masofada toʻxtash taqiqlanadi?', '15 metrdan kam', ['5 metrdan kam', '10 metrdan kam', '30 metrdan kam'], '91'],
    ['Toʻxtagan transport vositasi bilan sidirgʻa chiziq orasidagi masofa qanchadan kam boʻlsa, toʻxtash taqiqlanadi?', '3 metrdan', ['1 metrdan', '5 metrdan', '10 metrdan'], '91'],
    ['Temir yoʻl kesishmasining har ikkala tomonida qancha masofada toʻxtab turish taqiqlanadi?', '50 metr yaqinida', ['20 metr yaqinida', '30 metr yaqinida', '100 metr yaqinida'], '92'],
    ['Egiluvchan ulagich bilan shatakka olishda transport vositalari orasidagi masofa qancha boʻlishi kerak?', '4 — 6 metr', ['2 — 4 metr', '6 — 8 metr', '1 — 3 metr'], '144'],
    ['Qattiq ulagich bilan shatakka olishda transport vositalari orasidagi masofa koʻpi bilan qancha?', '4 metr', ['6 metr', '3 metr', '8 metr'], '144'],
    ['Qarama-qarshi kelayotgan transport vositasiga kamida qancha masofa qolganda uzoqni yorituvchi chiroqlar yaqinni yorituvchiga almashtiriladi?', '150 metr', ['100 metr', '200 metr', '300 metr'], '135'],
    ['“B” toifali transport vositasini boshqarish huquqini olish uchun oʻquvchi oʻqish yakunida necha yoshga toʻlgan boʻlishi kerak?', '18 yosh', ['16 yosh', '17 yosh', '19 yosh'], '149'],
    ['“A” toifasi uchun boshqarish huquqini olishda talab qilinadigan yosh?', '16 yosh', ['18 yosh', '14 yosh', '17 yosh'], '149'],
    ['“D” toifasi, tramvay va trolleybus uchun boshqarish huquqini olishda talab qilinadigan yosh?', '21 yosh', ['18 yosh', '19 yosh', '20 yosh'], '149'],
    ['“BE” va “CE” toifalari uchun talab qilinadigan yosh?', '19 yosh', ['18 yosh', '20 yosh', '21 yosh'], '149'],
    ['Yoʻlda velosiped boshqarish uchun eng kam yosh?', '14 yosh', ['12 yosh', '16 yosh', '10 yosh'], '165'],
    ['Moped va skuterni boshqarish uchun eng kam yosh?', '16 yosh', ['14 yosh', '18 yosh', '15 yosh'], '165'],
    ['Necha yoshdan kichik shaxslarga individual harakatlanish vositalarini (elektrosamokat va h.k.) yoʻlda boshqarish taqiqlanadi?', '14 yoshdan', ['12 yoshdan', '16 yoshdan', '18 yoshdan'], '12^{1}'],
    ['Individual harakatlanish vositasi trotuar va piyodalar yoʻlkasida qanchadan tez harakatlanmasligi kerak?', 'Soatiga 10 km', ['Soatiga 15 km', 'Soatiga 20 km', 'Soatiga 25 km'], '12^{2}'],
    ['12 yoshga toʻlmagan bolalarni qayerda tashish taqiqlanadi?', 'Maxsus ushlab turuvchi qurilmasiz old oʻrindiqda', ['Orqa oʻrindiqda kamar bilan', 'Bolalar oʻrindigʻida orqada', 'Avtobusda kattalar bilan'], '159'],
    ['Teng ahamiyatli yoʻllar kesishgan tartibga solinmagan chorrahada relssiz transport haydovchisi kimga yoʻl beradi?', 'Oʻngdan yaqinlashayotganlarga', ['Chapdan yaqinlashayotganlarga', 'Qarama-qarshi kelayotganlarga', 'Kattaroq transport vositasiga'], '105'],
    ['Teng ahamiyatli yoʻllar chorrahasida tramvay relssiz transport vositalariga nisbatan qanday huquqqa ega?', 'Harakat yoʻnalishidan qatʼi nazar imtiyozga ega', ['Ularga yoʻl beradi', 'Faqat oʻngdan kelsa imtiyozli', 'Teng huquqli'], '104'],
    ['Teng ahamiyatli chorrahada chapga burilayotgan haydovchi kimga yoʻl berishi shart?', 'Qarama-qarshidan toʻgʻriga yoki oʻngga ketayotganlarga', ['Orqadan kelayotganlarga', 'Hech kimga', 'Faqat velosipedchilarga'], '107'],
    ['Haydovchi yoʻl qoplamasini aniqlay olmasa va imtiyoz belgilari boʻlmasa, oʻzini qaysi yoʻlda deb hisoblaydi?', 'Ikkinchi darajali yoʻlda', ['Asosiy yoʻlda', 'Teng ahamiyatli yoʻlda', 'Avtomagistralda'], '108'],
    ['Bir yoʻnalishda harakatlanayotganlar bir vaqtda qayta tizilsa, kim yoʻl beradi?', 'Oʻng tomondagi transport vositasiga yoʻl beriladi', ['Chap tomondagiga yoʻl beriladi', 'Tezroq harakatlanayotganiga', 'Kattaroq transport vositasiga'], '55'],
    ['Orqaga harakatlanish qayerda taqiqlanadi?', 'Chorrahalarda', ['Hovli ichida', 'Yoʻl yoqasida', 'Toʻxtab turish joyida'], '63'],
    ['Quyidagi joylarning qaysi birida qayrilib olish taqiqlanadi?', 'Piyodalar oʻtish joylarida', ['5.11.1 “Qayrilib olish joyi” belgisi oldida', 'Keng koʻchada koʻrinish yaxshi joyda', 'Svetofor ruxsat bergan chorrahada'], '62'],
    ['Svetoforning sariq ishorasi nimani bildiradi?', 'Harakatni taqiqlaydi va ishoralar almashuvidan ogohlantiradi', ['Harakatga ruxsat beradi', 'Faqat oʻngga burilishga ruxsat', 'Tezlikni oshirishni talab qiladi'], '31'],
    ['Tartibga solinmagan piyodalar oʻtish joyida piyoda kesib oʻtayotgan boʻlsa, haydovchi nima qilishi shart?', 'Tezligini kamaytirishi yoki toʻxtashi', ['Ovozli ishora berib oʻtishi', 'Piyodani chetlab oʻtishi', 'Tezlikni oshirib oʻtib ketishi'], '109'],
    ['Oq hassa bilan ishora berayotgan koʻzi ojiz piyodani haydovchi qachon oʻtkazib yuborishi kerak?', 'Barcha hollarda', ['Faqat piyodalar oʻtish joyida', 'Faqat svetofor boʻlsa', 'Oʻtkazib yuborishi shart emas'], '113'],
    ['Avtomagistralda qayerda toʻxtash mumkin?', 'Faqat 5.15 yoki 6.11 belgilari bilan belgilangan maydonchalarda', ['Yoʻl yoqasining istalgan joyida', 'Ajratuvchi mintaqada', 'Chap tasmada avariya chirogʻi bilan'], '121'],
    ['Tezligi soatiga qanchadan kam boʻlgan transport vositalariga avtomagistralda harakatlanish taqiqlanadi?', 'Soatiga 40 km', ['Soatiga 30 km', 'Soatiga 50 km', 'Soatiga 60 km'], '121'],
    ['Haydovchi boshqarish paytida telefondan qanday foydalanishi mumkin?', 'Faqat quloqchin yoki qoʻllarni ishlatmaydigan uskuna orqali', ['Istalgan paytda', 'Faqat svetoforda turganda qoʻlda', 'Faqat shahardan tashqarida'], '12'],
    ['Quyidagilardan kimga xavfsizlik kamarini taqmaslikka ruxsat beriladi?', 'Homilador ayollarga', ['Shahar ichidagi barcha yoʻlovchilarga', '18 yoshgacha boʻlgan haydovchilarga', 'Orqa oʻrindiqdagi kattalarga'], '9'],
    ['Velosipedda 7 yoshgacha boʻlgan bolani qanday tashish mumkin?', 'Ishonchli oyoq qoʻygichli qoʻshimcha oʻrindiqda', ['Mutlaqo mumkin emas', 'Rul ustidagi savatda', 'Yuk bagajida'], '168'],
    ['Odam tashiydigan yuk avtomobili yukxonasining borti kamida qancha balandlikda boʻlishi kerak?', '1,3 metr', ['1,0 metr', '0,8 metr', '1,5 metr'], '153'],
    ['Temir yoʻl kesishmasida transport vositasi majburan toʻxtab qolsa, poyezdni toʻxtatish uchun odamlar har tomonga qancha masofaga yuboriladi?', '1000 metr', ['500 metr', '300 metr', '100 metr'], '120'],
    ['Avtopoyezd taniqlik belgisi qanday koʻrinishda boʻladi?', 'Kabina tomida uchta zargʻaldoq chiroq', ['Sariq kvadrat ichida “!”', 'Qizil uchburchak', 'Koʻk kvadratda qizil xoch'], '176'],
    ['“Haydovchilikni endi boshlagan” taniqlik belgisi haydovchilik staji necha yildan kam boʻlganlarga oʻrnatiladi?', '2 yildan', ['1 yildan', '3 yildan', '5 yildan'], '176']
  ];

  /* ---- Yoʻl chiziqlari: qisqa nomlar ---- */
  var MARKS = {
    '1.1': 'Yaxlit chiziq — qarama-qarshi oqimlarni ajratadi', '1.2': 'Enli yaxlit chiziq — avtomagistralda qatnov qismi cheti',
    '1.3': 'Qoʻsh yaxlit chiziq — 4 va undan koʻp tasmali yoʻlda oqimlarni ajratadi', '1.4': 'Sariq yaxlit chiziq — toʻxtash taqiqlangan joy',
    '1.5': 'Uzuq-uzuq chiziq — 2–3 tasmali yoʻlda oqimlarni ajratadi', '1.6': 'Yaqinlashish chizigʻi — oldinda yaxlit chiziq borligini bildiradi',
    '1.7': 'Qisqa uzuq-uzuq chiziq — chorrahadagi tasmalar', '1.8': 'Enli uzuq-uzuq chiziq — tezlashish yoki sekinlashish boʻlagi chegarasi',
    '1.9': 'Qoʻsh uzuq-uzuq chiziq — reversiv harakat boʻlaklari', '1.10': 'Sariq uzuq-uzuq chiziq — toʻxtab turish taqiqlangan joy',
    '1.11': 'Yaxlit va uzuq-uzuq qoʻsh chiziq — faqat bir tomondan qayta tizilish mumkin', '1.12': 'Toʻxtash chizigʻi',
    '1.13': 'Uchburchaklar qatori — yoʻl berish uchun toʻxtash joyi', '1.14.1': 'Oq «zebra» — piyodalar oʻtish joyi',
    '1.14.2': 'Oq-sariq «zebra» — piyodalar oʻtish joyi', '1.14.4': 'Oq-qizil «zebra» — maktab oldidagi piyodalar oʻtish joyi',
    '1.15': 'Velosiped yoʻlkasi kesib oʻtgan joy', '1.16.1': 'Yoʻnaltiruvchi orolcha', '1.17': 'Sariq zigzag — bekat va taksi toʻxtash joyi',
    '1.18': 'Tasmalar boʻyicha harakat yoʻnalishi strelkalari', '1.19': 'Strelka — tasma torayishiga yaqinlashish',
    '1.20': 'Uchburchak — 1.13 chizigʻiga yaqinlashish', '1.21': '«STOP» yozuvi — toʻxtash chizigʻiga yaqinlashish',
    '1.22': 'Yoʻl raqami', '1.23': '«A» harfi — yoʻnalishli transport tasmasi', '1.24': 'Nogironligi boʻlgan shaxslar avtomobili toʻxtab turish joyi',
    '1.25': 'Piyodalar yoʻlkasi', '1.26': 'Velosiped yoʻlkasi', '1.27': 'Ogohlantiruvchi belgini takrorlovchi chiziq',
    '1.28': 'Taqiqlovchi belgini takrorlovchi chiziq', '1.29': 'Sunʼiy yoʻl notekisligi', '1.30': '«MAKTAB» yozuvi',
    '1.31': 'Shovqin chiziqlari', '1.32': 'Sariq toʻr — chorraha maydoni (tirbandlikda kirilmaydi)'
  };

  /* ---- Belgilar havzasi ---- */
  var SIGNS = [], GROUPS = {};
  D.signs.groups.forEach(function (gr) {
    GROUPS[gr.n] = gr.title;
    gr.items.forEach(function (e) {
      e.nums.forEach(function (n, k) {
        var name = e.name;
        if (e.nums.length > 1) {
          var m = e.d.join(' ').match(new RegExp(n.replace(/\./g, '\\.') + '\\.?\\s*—\\s*([^,;.]+)'));
          if (m) { var sub = m[1].split(/\s+yoʻl belgi/)[0].split(' ').slice(0, 5).join(' '); if (sub && !/^\d/.test(sub)) name += ' (' + sub.trim() + ')'; }
        }
        var f = e.img.filter(function (x) { return x.replace(/\.(svg|png)$/, '') === n; })[0] || e.img[Math.min(k, e.img.length - 1)];
        SIGNS.push({ n: n, name: name, img: 'img/signs/' + f, g: gr.n, d: (e.d[0] || '').slice(0, 160) });
      });
    });
  });
  var FINES = [];
  D.fines.forEach(function (f) {
    f.parts.forEach(function (p) {
      if (p.bhm && p.bhm.length === 1 && p.bhm[0].length === 1 && p.off && p.off.length <= 230) FINES.push({ art: f.n, off: p.off, v: p.bhm[0][0] });
    });
  });

  function signOpts(p, pool) {
    var same = shuffle(pool.filter(function (o) { return o.g === p.g && o.name !== p.name && o.img !== p.img; }));
    var other = shuffle(SIGNS.filter(function (o) { return o.g !== p.g; }));
    var seen = {}; seen[p.name] = 1; var w = [];
    same.concat(other).forEach(function (o) { if (w.length < 3 && !seen[o.name]) { seen[o.name] = 1; w.push(o); } });
    return w;
  }
  function mc(text, right, wrongs, extra) {
    var opts = shuffle([right].concat(wrongs.slice(0, 3)));
    return Object.assign({ kind: 'mc', text: text, opts: opts, a: opts.indexOf(right) }, extra || {});
  }
  function som(v, bhm) { return Math.round(v * bhm).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' soʻm'; }

  function signQ(p, pool, type) {
    var w = signOpts(p, pool);
    var exp = p.n + ' — “' + p.name + '”';
    if (type === 'tf') {
      var truth = Math.random() < 0.5, shown = truth ? p.name : w[0].name;
      return { kind: 'tf', text: 'Bu belgi “' + shown + '” deb ataladimi?', img: p.img, opts: ['Toʻgʻri', 'Notoʻgʻri'], a: truth ? 0 : 1, exp: exp, src: 'belgi' };
    }
    if (type === 'img4') {
      var all = shuffle([p].concat(w));
      return { kind: 'img4', text: '“' + p.name + '” belgisini toping', opts: all.map(function (o) { return o.img; }), a: all.indexOf(p), exp: exp, src: 'belgi' };
    }
    return mc('Bu qaysi belgi?', p.name, w.map(function (o) { return o.name; }), { img: p.img, exp: exp, src: 'belgi' });
  }
  function markQ() {
    var ids = Object.keys(MARKS), id = pick(ids), right = MARKS[id];
    var wr = shuffle(ids.filter(function (x) { return x !== id; })).slice(0, 3).map(function (x) { return MARKS[x]; });
    return mc('Bu qaysi yoʻl chizigʻi?', right, wr, { img: 'img/markings/' + id + '.svg', wide: 1, exp: id + ' — ' + right, src: 'chiziq', key: 'm' + id });
  }
  function fineQ(bhm) {
    var f = pick(FINES), vals = [];
    FINES.forEach(function (x) { if (x.v !== f.v && vals.indexOf(x.v) < 0) vals.push(x.v); });
    [0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50].forEach(function (v) { if (v !== f.v && vals.indexOf(v) < 0) vals.push(v); });
    vals.sort(function (a, b) { return Math.abs(Math.log(a / f.v)) - Math.abs(Math.log(b / f.v)); });
    var wr = shuffle(vals.slice(0, 5)).slice(0, 3);
    return mc(f.off.replace(/[,;:\s—-]+$/, '') + ' — jarima miqdori qancha?', som(f.v, bhm), wr.map(function (v) { return som(v, bhm); }),
      { exp: 'MJtK ' + f.art.replace(/\^\{(\d+)\}/, '^$1') + '-modda: ' + f.v + ' BHM', src: 'jarima', key: 'f' + f.art + f.off.slice(0, 20), small: 1 });
  }
  function ruleQ(r, tf) {
    if (tf) {
      var truth = Math.random() < 0.5, ans = truth ? r[1] : pick(r[2]);
      return { kind: 'tf', text: r[0] + ' — Javob: “' + ans + '”. Toʻgʻrimi?', opts: ['Toʻgʻri', 'Notoʻgʻri'], a: truth ? 0 : 1, exp: 'Toʻgʻri javob: ' + r[1] + ' (YHQ ' + r[3].replace(/\^\{(\d+)\}/, '^$1') + '-band)', src: 'qoida', key: 'r' + r[0] };
    }
    return mc(r[0], r[1], r[2], { exp: 'YHQ ' + r[3].replace(/\^\{(\d+)\}/, '^$1') + '-band', src: 'qoida', key: 'r' + r[0] });
  }

  /* src: 'aralash' | 'belgi' | 'belgi:<guruh>' | 'chiziq' | 'jarima' | 'qoida'; mix: 'mc' | 'tf' | 'aralash' */
  function make(src, n, opts) {
    opts = opts || {};
    var bhm = opts.bhm || D.meta.bhm, mix = opts.mix || 'aralash', out = [], used = {};
    var grp = src.indexOf('belgi:') === 0 ? src.split(':')[1] : null;
    var pool = grp ? SIGNS.filter(function (s) { return s.g === grp; }) : SIGNS;
    var signDeck = shuffle(pool), ruleDeck = shuffle(RULES);
    function nextKind() {
      if (src === 'aralash') { var r = Math.random(); return r < 0.4 ? 'belgi' : r < 0.7 ? 'qoida' : r < 0.85 ? 'chiziq' : 'jarima'; }
      return grp ? 'belgi' : src;
    }
    var guard = 0;
    while (out.length < n && guard++ < n * 30) {
      var k = nextKind(), q = null, tf = mix === 'tf' || (mix === 'aralash' && Math.random() < 0.2);
      if (k === 'belgi') {
        var p = signDeck.length ? signDeck.pop() : pick(pool);
        var t = tf ? 'tf' : (mix === 'mc' ? 'mc' : (Math.random() < 0.25 ? 'img4' : 'mc'));
        q = signQ(p, pool, t); q.key = 's' + p.n;
      } else if (k === 'qoida') {
        var r = ruleDeck.length ? ruleDeck.pop() : pick(RULES); q = ruleQ(r, tf);
      } else if (k === 'chiziq') q = markQ();
      else if (k === 'jarima') q = fineQ(bhm);
      if (q && !used[q.key]) { used[q.key] = 1; out.push(q); }
    }
    return out;
  }
  function sources() {
    var a = [['aralash', 'Aralash (hammasidan)'], ['belgi', 'Yoʻl belgilari — hammasi']];
    Object.keys(GROUPS).forEach(function (k) { a.push(['belgi:' + k, k + '. ' + GROUPS[k]]); });
    return a.concat([['qoida', 'Qoidalar (tezlik, toʻxtash, chorraha…)'], ['chiziq', 'Yoʻl chiziqlari'], ['jarima', 'Jarimalar (MJtK)']]);
  }
  g.YHQBank = { make: make, sources: sources, shuffle: shuffle, counts: { signs: SIGNS.length, rules: RULES.length, marks: Object.keys(MARKS).length, fines: FINES.length } };
})(window);
