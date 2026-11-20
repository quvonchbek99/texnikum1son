/* YHQ Test 2026 — AI xulosa (faqat sayt varianti: texnikum1son.uz/avtotest/).
 * Miya: texnikum1son.uz ning umumiy bulut moduli — ../assets/bulut.js → t1Bulut.ai (Gemini, Firebase AI Logic + App Check),
 * Kuvi AI bilan bir xil. Modul faqat tugma bosilganda yuklanadi.
 *  1) Natija sahifasi — shu test natijasi va xatolar boʻyicha shaxsiy xulosa;
 *  2) Statistika sahifasi — umumiy tayyorgarlik tahlili va 7 kunlik reja.
 * AI ishlamasa (internet yoʻq, domen ruxsati yoʻq, kunlik chegara) — sababi va qurilmaning oʻzida tuzilgan qisqa xulosa chiqadi.
 * AI ga shaxsiy maʼlumot yuborilmaydi: faqat savollar, tanlangan javoblar va natija raqamlari.
 * ai.js app.js dan OLDIN ulanadi (index.html); YHQApp ga faqat mount() chaqirilganda murojaat qilinadi. */
(function () {
  'use strict';
  if (window.YHQAI) return;
  var SRC = window.YHQ_AI_SRC || '../assets/bulut.js';
  var DAY_LIMIT = 30, TIMEOUT = 60000, LS = 'yhqt1.ai', MAXQ = 12;
  var memo = {}, loading = null, seq = 0;

  var SYS = 'Sen — Oʻzbekistonda haydovchilik guvohnomasi imtihoniga tayyorlaydigan tajribali va mehribon avtomaktab oʻqituvchisisan. ' +
    'Oʻzbekiston Respublikasi Yoʻl harakati qoidalari (Vazirlar Mahkamasining 2022-yil 12-apreldagi 172-son qarori) boʻyicha gapirasan. ' +
    'Faqat oʻzbek tilida, lotin yozuvida yoz (oʻ, gʻ harflari bilan). Qisqa, aniq va ragʻbatlantiruvchi boʻl, oddiy soʻzlar bilan tushuntir, oʻquvchiga «siz» deb murojaat qil. ' +
    'Faqat berilgan maʼlumotlarga tayan: «toʻgʻri javob» va «ilovadagi izoh» har doim toʻgʻri — ularga zid gapirma. ' +
    'YHQ band raqamlarini faqat berilganlardan ol va «104-band» koʻrinishida yoz; band, jarima summasi, foiz yoki boshqa raqamni oʻzingdan toʻqima. ' +
    'Formatlash: oddiy matn; roʻyxat uchun satr boshida «- »; muhim soʻzlarni **...** bilan ajratish mumkin; # sarlavhalar, jadval va emoji ishlatma.';

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>';
  var CSS = '.ai-card{border:1px solid var(--sel);background:linear-gradient(180deg,var(--chip),var(--card) 80px)}' +
    '.ai-hd{display:flex;align-items:center;gap:8px;margin-bottom:6px}.ai-hd svg{width:22px;height:22px;fill:var(--pri);flex:0 0 auto}.ai-hd b{font-size:16.5px}.ai-hd .pill{margin-left:auto}' +
    '.ai-out{margin-top:12px;line-height:1.55}.ai-out p{margin:.45em 0}.ai-out ul{margin:.35em 0;padding-left:1.25em}.ai-out li{margin:.25em 0}' +
    '.ai-card a.bnd{color:var(--pri);font-weight:600;text-decoration:underline dotted;cursor:pointer}' +
    '.ai-load{display:flex;align-items:center;gap:10px;color:var(--mut);margin-top:12px}' +
    '.ai-load i{width:18px;height:18px;border:3px solid var(--sel);border-top-color:var(--pri);border-radius:50%;animation:aispin .8s linear infinite;flex:0 0 auto}' +
    '@keyframes aispin{to{transform:rotate(360deg)}}' +
    '.ai-err{margin-top:12px;padding:10px 12px;border-radius:10px;background:var(--badbg);color:var(--bad);font-size:14px}' +
    '.ai-loc{margin-top:12px}.ai-loc>b{display:block;margin-bottom:4px}.ai-loc p{margin:.3em 0}' +
    '.ai-note{margin-top:10px;font-size:12.5px;color:var(--mut)}' +
    '.ai-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.ai-acts .btn{font-size:14px;padding:8px 12px;min-height:0}';

  function A() { return window.YHQApp; }
  function B() { return window.BANK; }
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function T(s) { return A() ? A().T(s) : s; }
  function H(s) { return A() ? A().H(s) : esc(s); }
  function today() { return new Date(Date.now() + 5 * 3600000).toISOString().slice(0, 10); } // Toshkent kuni
  function used() { try { var o = JSON.parse(localStorage.getItem(LS) || 'null'); return o && o.d === today() ? o.n | 0 : 0; } catch (e) { return 0; } }
  function inc() { try { localStorage.setItem(LS, JSON.stringify({ d: today(), n: used() + 1 })); } catch (e) { } }
  function css() {
    if (document.getElementById('ai-css')) return;
    var s = document.createElement('style'); s.id = 'ai-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  var SUPS = '¹²³⁴⁵⁶⁷⁸⁹';
  function bandTxt(k) { return String(k).replace(/\^\{?(\d)\}?/, function (_, d) { return SUPS.charAt(+d - 1); }); }
  function bandKey(n, sup) { var i = sup ? SUPS.indexOf(sup) : -1; return n + (i >= 0 ? '^{' + (i + 1) + '}' : ''); }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function topicName(id) { var t = A().topic(id); return t ? t.n : id; }
  function topicStat(id) {
    var S = A().state(), n = 0, a = 0, ok = 0;
    B().q.forEach(function (q) { if (q.t !== id) return; n++; var r = S.ans[q.id]; if (r) { a++; if (r[0]) ok++; } });
    return { n: n, a: a, ok: ok };
  }

  /* ---------- bulut modulini yuklash va soʻrov ---------- */
  function loadBulut() {
    if (window.t1Bulut && window.t1Bulut.ai) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = SRC; s.async = true;
      s.onload = function () { if (window.t1Bulut && window.t1Bulut.ai) res(); else rej(new Error('AI moduli topilmadi')); };
      s.onerror = function () { rej(new Error('AI moduli yuklanmadi — internet aloqasini tekshiring')); };
      document.head.appendChild(s);
    });
    loading['catch'](function () { loading = null; });
    return loading;
  }
  function withTimeout(p, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error('AI javob bermadi — vaqt tugadi')); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }
  function ask(prompt) {
    return loadBulut().then(function () { return withTimeout(window.t1Bulut.ai(prompt, { sys: SYS }), TIMEOUT); }).then(function (t) {
      t = String(t || '').replace(/```[a-z]*\n?|```/g, '').trim();
      if (!t) throw new Error('AI boʻsh javob qaytardi');
      return t;
    });
  }
  function errText(e) {
    var raw = String((e && ((e.code || '') + ' ' + (e.message || ''))) || e), m;
    // Firebase SDK yuklanmasa, xabarda «firebase-app-check.js» manzili boʻladi — buni App Check xatosi deb oʻylamaslik uchun avval tarmoqni tekshiramiz
    if (/dynamically imported|failed to fetch|networkerror|load failed|network-request-failed|internet|err_/i.test(raw)) m = 'Internet bilan aloqa yoʻq yoki AI serveri javob bermadi.';
    else if (/quota|exhausted|429|rate.?limit|overloaded|503|unavailable/i.test(raw)) m = 'AI hozir band (soʻrovlar koʻp). Birozdan keyin qayta urinib koʻring.';
    else if (/app.?check|recaptcha/i.test(raw)) m = 'AI himoyasi (App Check) bu sayt manzilida hali yoqilmagan.';
    else if (/vaqt tugadi|AI moduli|boʻsh javob/i.test(raw)) m = String(e && e.message || raw);
    else m = window.t1Bulut && window.t1Bulut.uzXato ? window.t1Bulut.uzXato(e) : raw;
    return 'AI xulosa olinmadi: ' + m;
  }

  /* ---------- AI matnini xavfsiz HTML ga aylantirish ---------- */
  function inline(s) {
    s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|\s)\*([^*\s][^*]*?)\*(?=\s|[.,;:!?]|$)/g, '$1$2');
    return s.replace(/(\d{1,3})([¹²³⁴⁵⁶⁷⁸⁹]?)(\s*-\s*(?:band|банд))/gi, function (all, n, sup, rest) {
      var k = bandKey(n, sup);
      return B().bands[k] ? '<a class="bnd" data-b="' + k + '">' + n + sup + rest + '</a>' : all;
    });
  }
  function fmt(text) {
    var out = [], list = null;
    function flush() { if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; } }
    T(String(text).replace(/\r/g, '')).split('\n').forEach(function (line) {
      var s = line.replace(/^\s*#+\s*/, '').trim();
      if (!s) return flush();
      var m = /^[-*•–]\s+(.*)$/.exec(s);
      if (m) { (list = list || []).push('<li>' + inline(m[1]) + '</li>'); return; }
      flush(); out.push('<p>' + inline(s) + '</p>');
    });
    flush();
    return out.join('');
  }

  /* ---------- 1) Natija: test natijasi va xatolar ---------- */
  function optText(q, k) {
    var o = q.o[k]; if (o == null) return '—';
    if (q.k === 'img4') {
      var m = /signs\/([\w.]+)\.svg/.exec(o); if (m) return m[1] + '-belgi (rasm)';
      m = /markings\/([\w.]+)\.svg/.exec(o); if (m) return m[1] + ' chizigʻi (rasm)';
      return 'rasm';
    }
    return o;
  }
  function qText(q) {
    return q.q + (q.k !== 'img4' && q.sn ? ' [rasmda: ' + q.sn + '-belgi]' : q.mn ? ' [rasmda: ' + q.mn + ' chizigʻi]' : q.sc ? ' [savolda vaziyat sxemasi bor]' : q.img ? ' [savolda rasm bor]' : '');
  }
  function runInfo(r) {
    var ids = r.ids, n = ids.length, ans = 0, wrong = [], skip = 0;
    ids.forEach(function (id, i) {
      var c = r.ch[i]; if (c == null) { skip++; return; }
      ans++; var q = A().q(id); if (q && c !== q.a) wrong.push({ q: q, c: c });
    });
    if (!ans) return null;
    var ok = ans - wrong.length, scored = r.exam || r.mode === 'bilet';
    var turi = r.exam ? 'Imtihon simulyatsiyasi (20 savol, 25 daqiqa, koʻpi bilan 2 ta xato mumkin)'
      : r.mode === 'bilet' ? r.n + '-bilet (20 savol, koʻpi bilan 2 ta xato mumkin)'
        : r.mode === 'mavzu' ? 'Mavzu boʻyicha mashq: ' + r.title
          : r.mode === 'marafon' ? 'Marafon (barcha savollar ketma-ket)'
            : r.mode === 'xato' ? 'Xatolar ustida ishlash' : r.title;
    var byT = {}, bands = [];
    wrong.forEach(function (w) { byT[w.q.t] = (byT[w.q.t] || 0) + 1; (w.q.r || []).forEach(function (b) { if (bands.indexOf(b) < 0) bands.push(b); }); });
    var tops = Object.keys(byT).sort(function (a, b) { return byT[b] - byT[a]; });
    var L = [];
    L.push('TEST: ' + turi + '.');
    L.push('NATIJA: ' + ok + ' ta toʻgʻri, ' + wrong.length + ' ta xato, ' + skip + ' ta javobsiz (jami ' + n + ' ta savol). Vaqt: ' + A().mmss(r.time || 0) +
      (r.limit ? ' (ruxsat: ' + Math.round(r.limit / 60) + ' daqiqa)' : '') + '.' + (scored ? ' Holat: ' + (r.pass ? 'TOPSHIRDI' : 'TOPSHIRMADI') + '.' : ''));
    if (wrong.length) {
      L.push('XATOLAR:');
      wrong.slice(0, MAXQ).forEach(function (w, i) {
        var q = w.q;
        L.push((i + 1) + ') Mavzu: ' + topicName(q.t) + '. Savol: ' + qText(q));
        L.push('   Tanlangan javob: ' + optText(q, w.c));
        L.push('   Toʻgʻri javob: ' + optText(q, q.a));
        if (q.e) L.push('   Ilovadagi izoh: ' + String(q.e).replace(/\s+/g, ' ').slice(0, 600));
        if (q.r && q.r.length) L.push('   YHQ bandlari: ' + q.r.map(bandTxt).join(', '));
      });
      if (wrong.length > MAXQ) {
        var rest = {}; wrong.slice(MAXQ).forEach(function (w) { rest[w.q.t] = (rest[w.q.t] || 0) + 1; });
        L.push('(Yana ' + (wrong.length - MAXQ) + ' ta xato bor: ' + Object.keys(rest).map(function (t) { return topicName(t) + ' — ' + rest[t]; }).join(', ') + '.)');
      }
      L.push('SHU MAVZULAR BOʻYICHA UMUMIY NATIJA (shu qurilmada, barcha vaqt): ' + tops.slice(0, 5).map(function (t) {
        var s = topicStat(t); return topicName(t) + ' — ' + pct(s.ok, s.a) + '% (' + s.a + ' ta savol yechilgan)';
      }).join('; ') + '.');
      L.push('');
      L.push('VAZIFA — shu tartibda yoz:');
      L.push('1. Umumiy baho — 1–2 gap (natija va vaqtni hisobga ol).');
      L.push('2. Har bir xato boʻyicha 1–2 gap: nega toʻgʻri javob aynan shunday va qayerda adashgan boʻlishi mumkin; band raqamini koʻrsat.' + (wrong.length > MAXQ ? ' Roʻyxatdagi xatolarni yoz, qolganlarini mavzu boʻyicha umumlashtir.' : ''));
      L.push('3. Takrorlash kerak boʻlgan qoidalar — 2–4 ta punkt.');
      L.push('4. Keyingi qadam — 1–2 ta aniq tavsiya (qaysi mavzuni mashq qilish, qachon imtihon rejimida qayta urinish).');
      L.push('Jami 2000 belgidan oshmasin.');
    } else {
      L.push('XATOLAR: yoʻq.');
      L.push('');
      L.push('VAZIFA: qisqa tabrik va keyingi qadam boʻyicha 2–3 gapli maslahat ber (masalan, imtihon rejimi yoki hali yechilmagan biletlar). 600 belgidan oshmasin.');
    }
    var res = scored ? ok + '/' + n + ' — ' + (r.pass ? 'topshirdingiz' : 'topshirilmadi (koʻpi bilan 2 ta xato mumkin)') : ok + ' ta toʻgʻri, ' + wrong.length + ' ta xato' + (skip ? ', ' + skip + ' ta javobsiz' : '');
    var loc = '<p>' + H('Natija: ' + res + '.') + '</p>';
    if (wrong.length) {
      loc += '<p>' + H('Xatolar mavzular boʻyicha: ' + tops.map(function (t) { return topicName(t) + ' — ' + byT[t]; }).join(', ') + '.') + '</p>';
      if (bands.length) loc += '<p>' + H('Takrorlang: ') + bands.slice(0, 10).map(function (b) { return '<a class="bnd" data-b="' + esc(b) + '">' + H(bandTxt(b) + '-band') + '</a>'; }).join(', ') + '.</p>';
    } else loc += '<p>' + H('Barcha javoblar toʻgʻri — imtihon rejimida ham sinab koʻring.') + '</p>';
    if (!r.__ai) r.__ai = 'r' + (++seq);
    return {
      key: r.__ai, title: 'AI xulosa', go: 'AI xulosa olish',
      lead: 'Sunʼiy intellekt natijangizni tahlil qiladi: xatolar sababi, qaysi qoidalarni takrorlash kerakligi va keyingi qadam.',
      prompt: L.join('\n'), local: loc, topics: tops.slice(0, 3)
    };
  }

  /* ---------- 2) Statistika: umumiy tayyorgarlik ---------- */
  function statInfo(d) {
    var base = { title: 'AI tahlil', go: 'Tayyorgarligimni tahlil qil', lead: 'Sunʼiy intellekt barcha natijalaringizni koʻrib, imtihonga tayyorlik darajasi, zaif mavzular va 7 kunlik mashq rejasini tuzib beradi.' };
    if (d.a < 10) { base.short = 'Tahlil uchun avval kamida 10 ta savol yeching.'; base.key = 'stat-0'; return base; }
    var started = d.tops.filter(function (t) { return t.a > 0; }).sort(function (a, b) { return a.ok / a.a - b.ok / b.a; });
    var fresh = d.tops.filter(function (t) { return !t.a; });
    var L = [];
    L.push('UMUMIY NATIJALAR (shu qurilmada):');
    L.push('- Yechilgan savollar: ' + d.a + ' ta (jami ' + d.n + ' tadan), toʻgʻri javoblar: ' + pct(d.ok, d.a) + '%.');
    L.push('- Biletlar: ' + d.tkTried + ' tasi yechilgan, ' + d.tkPassed + ' tasida 18/20 yoki undan yuqori natija (jami ' + d.tickets + ' ta bilet).');
    L.push('- Imtihon simulyatsiyasi: ' + (d.exams.length ? d.exams.length + ' marta (oxirgilari), ' + d.exams.filter(function (e) { return e.pass; }).length + ' tasi topshirilgan; natijalar: ' +
      d.exams.map(function (e) { return e.ok + '/20' + (e.pass ? ' (topshirdi)' : ' (topshirmadi)'); }).join(', ') : 'hali topshirilmagan') + '.');
    L.push('- Soʻnggi 14 kunda ' + d.days + ' kun mashq qilingan.');
    L.push('- Mavzular (yechilgan/jami, toʻgʻri %), eng zaifidan: ' + started.map(function (t) { return t.n + ' ' + t.a + '/' + t.all + ' — ' + pct(t.ok, t.a) + '%'; }).join('; ') + '.');
    if (fresh.length) L.push('- Hali boshlanmagan mavzular: ' + fresh.map(function (t) { return t.n; }).join(', ') + '.');
    L.push('');
    L.push('VAZIFA — shu tartibda yoz:');
    L.push('1. Imtihonga tayyorlik haqida 2–3 gapli xulosa — faqat yuqoridagi raqamlarga tayan, yangi raqam yoki foiz oʻylab topma.');
    L.push('2. Eng zaif 2–3 mavzu: nega muhim va nimaga eʼtibor berish kerak (har biriga 1 gap).');
    L.push('3. 7 kunlik mashq rejasi — har kun uchun bitta qisqa qator («1-kun: …»), ilovadagi imkoniyatlardan foydalan: biletlar, mavzular, xatolar ustida ishlash, imtihon rejimi, avtodrom simulyatori.');
    L.push('4. Oxirida bitta ragʻbatlantiruvchi gap. Jami 1800 belgidan oshmasin.');
    var weak = started.filter(function (t) { return t.a >= 3; }).slice(0, 3);
    var loc = '<p>' + H('Yechilgan: ' + d.a + ' ta savol, ' + pct(d.ok, d.a) + '% toʻgʻri. Biletlar: ' + d.tkPassed + '/' + d.tickets + ' topshirilgan.') + '</p>' +
      (weak.length ? '<p>' + H('Eng zaif mavzular: ' + weak.map(function (t) { return t.n + ' — ' + pct(t.ok, t.a) + '%'; }).join(', ') + '.') + '</p>' : '') +
      (fresh.length ? '<p>' + H('Hali boshlanmagan mavzular: ' + fresh.length + ' ta.') + '</p>' : '');
    base.key = 'stat-' + d.a + '-' + d.ok + '-' + d.exams.length;
    base.prompt = L.join('\n'); base.local = loc; base.topics = weak.map(function (t) { return t.id; });
    return base;
  }

  /* ---------- karta ---------- */
  function practice(info) {
    return (info.topics || []).map(function (t) { return '<button class="btn sec" data-tp="' + esc(t) + '">' + H('Mashq: ' + topicName(t)) + '</button>'; }).join('');
  }
  function bind(el) {
    $$('a.bnd', el).forEach(function (a) { a.onclick = function () { A().band(a.getAttribute('data-b')); }; });
    $$('[data-tp]', el).forEach(function (b) { b.onclick = function () { A().startTopic(b.getAttribute('data-tp')); }; });
  }
  function showAI(el, info, text) {
    var go = $('[data-ai="go"]', el); if (go) go.style.display = 'none';
    $('.ai-body', el).innerHTML = '<div class="ai-out">' + fmt(text) + '</div>' +
      '<div class="ai-acts">' + practice(info) + '<button class="btn sec" data-ai="copy">' + H('Nusxa olish') + '</button><button class="btn sec" data-ai="re">' + H('Qayta soʻrash') + '</button></div>' +
      '<div class="ai-note">' + H('AI xato qilishi mumkin — shubhali joyni YHQ bandidan tekshiring.') + '</div>';
    bind(el);
    $('[data-ai="re"]', el).onclick = function () { delete memo[info.key]; run(el, info); };
    $('[data-ai="copy"]', el).onclick = function () {
      var t = T(text);
      try { navigator.clipboard.writeText(t).then(function () { A().toast('Nusxa olindi'); }, function () { A().toast('Nusxa olib boʻlmadi'); }); } catch (e) { A().toast('Nusxa olib boʻlmadi'); }
    };
  }
  function showErr(el, info, msg) {
    $('.ai-body', el).innerHTML = '<div class="ai-err">' + H(msg) + '</div>' +
      '<div class="ai-loc"><b>' + H('Qurilmaning oʻzida tuzilgan qisqa xulosa') + '</b>' + info.local + '</div>' +
      '<div class="ai-acts">' + practice(info) + '</div>';
    bind(el);
  }
  function run(el, info) {
    var body = $('.ai-body', el), go = $('[data-ai="go"]', el);
    if (used() >= DAY_LIMIT) return showErr(el, info, 'Bugungi AI soʻrovlar chegarasi (' + DAY_LIMIT + ' ta) tugadi. Ertaga yana urinib koʻring.');
    if (navigator.onLine === false) return showErr(el, info, 'Internet aloqasi yoʻq — AI xulosa uchun internet kerak.');
    if (go) go.disabled = true;
    body.innerHTML = '<div class="ai-load"><i></i><span>' + H('AI tahlil qilmoqda… odatda 10–30 soniya') + '</span></div>';
    inc();
    ask(info.prompt).then(function (t) {
      memo[info.key] = t;
      if (el.isConnected !== false) showAI(el, info, t);
    }, function (e) {
      if (go) go.disabled = false;
      if (el.isConnected !== false) showErr(el, info, errText(e));
    });
  }
  function mount(kind, el, data) {
    if (!el || !A() || !B()) return;
    var info = kind === 'natija' ? runInfo(data) : kind === 'stat' ? statInfo(data) : null;
    if (!info) return;
    css();
    el.innerHTML = '<div class="card ai-card"><div class="ai-hd">' + ICON + '<b>' + H(info.title) + '</b><span class="pill">' + H('sunʼiy intellekt') + '</span></div>' +
      '<p class="muted small" style="margin:0">' + H(info.short || info.lead) + '</p>' +
      (info.short ? '' : '<div class="ai-acts"><button class="btn" data-ai="go">' + ICON.replace('<svg', '<svg style="fill:currentColor"') + H(info.go) + '</button></div>') +
      '<div class="ai-body"></div></div>';
    if (info.short) return;
    $('[data-ai="go"]', el).onclick = function () { run(el, info); };
    if (memo[info.key]) showAI(el, info, memo[info.key]);
  }

  window.YHQAI = { mount: mount, _t: { runInfo: runInfo, statInfo: statInfo, fmt: fmt, SYS: SYS } };
})();
