/* Fan viktorinasi — texnikum1son.uz
 * Har bir fan FAQAT o'z savollari bilan: jonli viktorina (o'quvchilar telefondan), jamoaviy o'yin, arqon tortish,
 * yakka o'yin va chop etiladigan test varaqasi. Savollar: js/fan-bank.js (data/test/<fan>.json + Kuvi agent testlari).
 * Tarmoq: js/net/ka-tarmoq.js (MQTT reley, xona kodi + QR). Asos: yhq/js/viktorina.js. */
(function () {
  'use strict';
  var B = window.FanBank, NET = window.KANet;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = $('#vk');
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('fv_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('fv_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var muted = LS.get('mute', false);
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tx(s) { return esc(s).replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/\^(\d+)/g, '<sup>$1</sup>').replace(/_\{([^}]*)\}/g, '<sub>$1</sub>').replace(/\n/g, '<br>'); }
  var SITE = 'https://texnikum1son.uz/viktorina/';
  var COL = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
  var TCOL = ['#e21b3c', '#1368ce'];
  var SHP = ['<path d="M16 3 L30 28 H2 Z"/>', '<path d="M16 2 L30 16 L16 30 L2 16 Z"/>', '<circle cx="16" cy="16" r="13.5"/>', '<rect x="3.5" y="3.5" width="25" height="25"/>'];
  function shape(k) { return '<svg class="shp" viewBox="0 0 32 32">' + SHP[k] + '</svg>'; }
  function tfIdx(k) { return k === 0 ? 1 : 0; }
  var LET = 'ABCD';

  var Q = new URLSearchParams(location.search);
  var FAN = (Q.get('fan') || '').replace(/[^\w-]/g, '');
  var YID = (Q.get('y') || '').replace(/[^\w-]/g, '');
  var BANK = null, IDX = null;

  /* ---------- ovozlar ---------- */
  var AC = null;
  function tone(f, d, type, vol, when) {
    if (muted) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var t = AC.currentTime + (when || 0), o = AC.createOscillator(), g = AC.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(vol || 0.15, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + 0.02);
    } catch (e) { }
  }
  var SFX = {
    tick: function () { tone(880, 0.07, 'square', 0.05); },
    good: function () { tone(660, 0.12, 'triangle', 0.18); tone(990, 0.22, 'triangle', 0.18, 0.11); },
    bad: function () { tone(180, 0.35, 'sawtooth', 0.12); },
    gong: function () { tone(196, 0.9, 'sine', 0.25); tone(392, 0.6, 'sine', 0.08); },
    start: function () { [523, 659, 784].forEach(function (f, i) { tone(f, 0.16, 'triangle', 0.15, i * 0.12); }); },
    pull: function () { [330, 392, 494].forEach(function (f, i) { tone(f, 0.12, 'square', 0.08, i * 0.07); }); },
    win: function () { [523, 659, 784, 1046, 784, 1046].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.16, i * 0.15); }); }
  };
  function soundBtn() { return '<button class="ib snd" data-act="snd" title="Ovoz">' + (muted ? '🔇' : '🔊') + '</button>'; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act="snd"]');
    if (b) { muted = !muted; LS.set('mute', muted); b.textContent = muted ? '🔇' : '🔊'; return; }
    var h = e.target.closest('[data-act="home"]');
    if (h) { e.preventDefault(); goHome(); }
  });

  /* ---------- umumiy ---------- */
  function fanUrl() {
    if (!BANK) return '../oyinlar/';
    if (YID) return '../yonalish/' + YID + '/fan/' + (BANK.fan || FAN) + '/';
    return '../' + (BANK.url || 'oyinlar/');
  }
  function topbar(title, home) {
    var back = home ? '<button class="ib" data-act="home" title="Orqaga">‹</button>' : '<a class="ib" href="' + esc(BANK ? fanUrl() : '../oyinlar/') + '" title="Orqaga">‹</a>';
    return '<header class="vbar">' + back + '<b>' + tx(title) + '</b>' + soundBtn() + '</header>';
  }
  function stopAll() {
    try { if (H && H.api) H.api.close(); } catch (e) { }
    try { if (P && P.api) P.api.close(); } catch (e) { }
    [H, TM, SG, AR].forEach(function (x) { if (x) { clearInterval(x.timer); clearTimeout(x.nx); } });
    if (AR) document.removeEventListener('keydown', arqonKey);
    H = P = TM = SG = AR = null;
  }
  function goHome() {
    var inGame = /\b(game|play)\b/.test(root.className) && !/\b(join|end)\b/.test(root.className);
    if (inGame && !confirm('Oʻyindan chiqilsinmi?')) return;
    stopAll();
    if (BANK) hub(); else picker();
  }
  function settingsForm(prefix, opt) {
    opt = opt || {};
    var src = LS.get(FAN + '_' + prefix + 'src', 'aralash'), n = LS.get(prefix + 'n', opt.n || 10), t = LS.get(prefix + 't', 30), mix = LS.get(prefix + 'mix', 'aralash');
    var srcs = B.sources(), has = srcs.some(function (s) { return s[0] === src; });
    if (!has) src = 'aralash';
    var so = srcs.map(function (s) { return '<option value="' + esc(s[0]) + '"' + (s[0] === src ? ' selected' : '') + '>' + esc(s[1]) + '</option>'; }).join('');
    function seg(name, vals, cur) { return '<div class="seg" data-k="' + name + '">' + vals.map(function (v) { return '<button type="button" data-v="' + v[0] + '" class="' + (String(v[0]) === String(cur) ? 'on' : '') + '">' + esc(v[1]) + '</button>'; }).join('') + '</div>'; }
    var ns = opt.ns || [[5, '5'], [10, '10'], [15, '15'], [20, '20'], [30, '30'], [50, '50']];
    if (!ns.some(function (v) { return String(v[0]) === String(n); })) n = ns[1][0];
    return '<label class="fl">Mavzu<select id="f-src">' + so + '</select></label>' +
      '<div class="fl">' + (opt.nLabel || 'Savollar soni') + seg('n', ns, n) + '</div>' +
      (opt.noTime ? '' : '<div class="fl">Har bir savolga vaqt' + seg('t', [[10, '10 s'], [20, '20 s'], [30, '30 s'], [45, '45 s'], [60, '60 s']], t) + '</div>') +
      (opt.noMix ? '' : '<div class="fl">Savol turi' + seg('mix', [['aralash', 'Aralash'], ['mc', '4 variantli'], ['tf', 'Toʻgʻri / Notoʻgʻri']], mix) + '</div>') + (opt.extra || '');
  }
  function bindSeg(box) {
    $$('.seg', box).forEach(function (s) {
      s.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        Array.prototype.forEach.call(s.children, function (c) { c.classList.toggle('on', c === b); });
      });
    });
  }
  function segVal(k) { var b = root.querySelector('.seg[data-k="' + k + '"] .on'); return b ? b.getAttribute('data-v') : null; }
  function readSettings(prefix) {
    var c = { src: $('#f-src').value, n: +segVal('n') || 10, t: +segVal('t') || 30, mix: segVal('mix') || 'aralash' };
    LS.set(FAN + '_' + prefix + 'src', c.src); LS.set(prefix + 'n', c.n); LS.set(prefix + 't', c.t); LS.set(prefix + 'mix', c.mix);
    return c;
  }
  function questions(c) { return B.make(c.src, c.n, { mix: c.mix }); }
  function ring(left, total) {
    var p = Math.max(0, left / total), C = 2 * Math.PI * 26;
    return '<div class="ring"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" class="bg"/><circle cx="30" cy="30" r="26" class="fg" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + (C * (1 - p)) + '"/></svg><span>' + Math.ceil(left) + '</span></div>';
  }
  function optTiles(q, opt) {
    opt = opt || {};
    var html = '';
    q.opts.forEach(function (o, k) {
      var ci = q.kind === 'tf' ? tfIdx(k) : k;
      var cls = 'opt' + (opt.reveal ? (k === q.a ? ' right' : ' dim') : '') + (opt.pick === k ? ' picked' : '');
      var tag = opt.btn ? 'button' : 'div';
      html += '<' + tag + ' class="' + cls + '" data-k="' + k + '" style="--c:' + COL[ci] + '">' + shape(ci) + '<span class="ot">' + tx(o) + '</span>' + (opt.reveal && k === q.a ? '<span class="ok">✓</span>' : '') + '</' + tag + '>';
    });
    return '<div class="opts n' + q.opts.length + (q.small ? ' long' : '') + '">' + html + '</div>';
  }
  function qHead(q, left, right) {
    var img = q.img ? '<div class="qimg"><img src="' + esc(q.img) + '" alt=""></div>' : '';
    var tp = q.tid ? '<div class="qtp">' + esc(B.topicName(q.tid)) + '</div>' : '';
    if (!img && !right && left) return tp + '<div class="qtext' + (q.small ? ' small' : '') + '">' + tx(q.text) + '</div><div class="mid one">' + left + '</div>';
    var mid = (left != null || right != null) ? '<div class="mid"><div class="side l">' + (left || '') + '</div>' + (img || '<div class="sp"></div>') + '<div class="side r">' + (right || '') + '</div></div>' : img;
    return tp + '<div class="qtext' + (q.small ? ' small' : '') + '">' + tx(q.text) + '</div>' + mid;
  }
  function confetti() {
    var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    var x = c.getContext('2d'), W = c.width = innerWidth, Hh = c.height = innerHeight, Pp = [];
    for (var i = 0; i < 160; i++) Pp.push({ x: Math.random() * W, y: -Math.random() * Hh, r: 4 + Math.random() * 6, c: COL[i % 4], vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2, a: Math.random() * 6 });
    var t0 = Date.now();
    (function f() {
      x.clearRect(0, 0, W, Hh);
      Pp.forEach(function (p) { p.y += p.vy; p.x += p.vx; p.a += 0.1; x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); x.restore(); });
      if (Date.now() - t0 < 6000) requestAnimationFrame(f); else c.remove();
    })();
  }
  function podium(list) {
    var top = list.slice(0, 3), order = [1, 0, 2];
    return '<div class="podium">' + order.map(function (k) {
      var p = top[k]; if (!p) return '<div class="pcol empty"></div>';
      return '<div class="pcol p' + (k + 1) + '"><div class="pname">' + esc(p.name) + '</div><div class="pscore">' + p.score + '</div><div class="pblock">' + ['🥇', '🥈', '🥉'][k] + '<b>' + (k + 1) + '</b></div></div>';
    }).join('') + '</div>';
  }
  function needQs(qs) {
    if (qs.length) return true;
    alert('Bu mavzuda savol topilmadi. Boshqa mavzuni tanlang.');
    return false;
  }

  /* ================= FAN TANLASH (fan berilmagan bo'lsa) ================= */
  function picker() {
    document.title = 'Fan viktorinasi — Toshkent tuman 1-son texnikumi';
    root.className = 'hub';
    root.innerHTML = topbar('Fan viktorinasi') + '<main class="wrap"><div class="hero"><div class="kick">Toshkent tuman 1-son texnikumi e-bazasi</div><h1>Fan viktorinasi</h1><p>Fanni tanlang — viktorina, arqon tortish va testlar faqat oʻsha fanning savollari bilan oʻtadi.</p></div>' +
      '<div class="cards one"><button class="card" data-go="join"><span class="ic">📱</span><b>Oʻyinga qoʻshilish</b><small>Oʻquvchilar uchun: oʻqituvchi ekranidagi 5 harfli kodni kiriting.</small></button></div>' +
      '<div class="pk"><input type="search" id="pq" placeholder="Fan nomini yozing…" autocomplete="off"><select id="py"><option value="">Barcha mutaxassisliklar</option></select></div><div id="pl"><div class="spin"></div></div></main>';
    $('.cards').onclick = function (e) { if (e.target.closest('[data-go="join"]')) playJoin(''); };
    (IDX ? Promise.resolve(IDX) : B.getJSON(B.BASE + 'data/test/index.json')).then(function (ix) {
      IDX = ix;
      var ys = {}; ix.fanlar.forEach(function (f) { (f.y || []).forEach(function (y) { ys[y[0]] = y[1]; }); });
      $('#py').innerHTML += Object.keys(ys).sort(function (a, b) { return ys[a].localeCompare(ys[b]); }).map(function (k) { return '<option value="' + esc(k) + '">' + esc(ys[k]) + '</option>'; }).join('');
      var TF = [['umumtalim', 'Umumtaʼlim fanlari'], ['kasbiy', 'Kasbiy fanlar'], ['amaliyot', 'Amaliyot']];
      function draw() {
        var q = $('#pq').value.toLowerCase().replace(/[ʻʼ‘’`'"]/g, ''), y = $('#py').value, html = '';
        TF.forEach(function (t) {
          var L = ix.fanlar.filter(function (f) {
            return f.t === t[0] && (!y || (f.y || []).some(function (z) { return z[0] === y; })) && (!q || (f.n + ' ' + (f.y || []).map(function (z) { return z[1]; }).join(' ')).toLowerCase().replace(/[ʻʼ‘’`'"]/g, '').indexOf(q) >= 0);
          });
          if (!L.length) return;
          html += '<h2 class="pg">' + esc(t[1]) + ' <small>' + L.length + '</small></h2><div class="plist">' + L.map(function (f) {
            var yy = (f.y || []).map(function (z) { return z[1]; });
            var sub = t[0] === 'umumtalim' ? 'Barcha mutaxassisliklar' : (yy.slice(0, 2).join(' · ') + (yy.length > 2 ? ' va yana ' + (yy.length - 2) + ' ta' : ''));
            return '<a class="pi" href="?fan=' + encodeURIComponent(f.k) + (f.y && f.y.length === 1 ? '&y=' + encodeURIComponent(f.y[0][0]) : '') + '"><b>' + esc(f.n) + '</b><small>' + esc(sub) + '</small><span class="pc">' + f.c + ' ta savol</span></a>';
          }).join('') + '</div>';
        });
        $('#pl').innerHTML = html || '<p class="note">Hech narsa topilmadi.</p>';
      }
      $('#pq').oninput = draw; $('#py').onchange = draw; draw();
    }).catch(function () { $('#pl').innerHTML = '<p class="err">Fanlar roʻyxati yuklanmadi — internetni tekshiring.</p>'; });
  }

  /* ================= FAN MARKAZI ================= */
  function hub() {
    document.title = BANK.nomi + ' — fan viktorinasi';
    root.className = 'hub';
    var man = B.manbalar().map(function (m) { return m[0] + ': ' + m[1]; }).join(' · ');
    var tops = B.data.topics.map(function (t) { return '<li><span>' + esc(t.nomi) + '</span><b>' + t.q.length + '</b></li>'; }).join('');
    root.innerHTML = topbar(BANK.nomi) + '<main class="wrap"><div class="hero"><div class="kick">Fan viktorinasi · ' + esc(BANK.toifa_nomi || '') + '</div><h1>' + esc(BANK.nomi) + '</h1><p>' +
      B.total() + ' ta savol, ' + B.data.topics.length + ' ta mavzu. Viktorina va testlarda faqat shu fanning savollari chiqadi.</p></div>' +
      '<div class="cards">' +
      card('host', '📺', 'Jonli viktorina', 'Savollar doskada, oʻquvchilar telefondan kod yoki QR bilan qoʻshilib javob beradi. Tezlik uchun ball, reyting va shohsupa.') +
      card('join', '📱', 'Oʻyinga qoʻshilish', 'Oʻquvchilar uchun: oʻqituvchi ekranidagi 5 harfli kodni kiriting.') +
      card('arqon', '🪢', 'Arqon tortish', 'Ikki jamoa bitta ekranda (aqlli doska, proyektor): birinchi toʻgʻri javob arqonni oʻz tomoniga tortadi.') +
      card('team', '👥', 'Jamoaviy oʻyin', 'Bitta ekranda 2–4 jamoa bellashadi. Telefon va internet shart emas.') +
      card('solo', '🎯', 'Yakka oʻyin', 'Oʻzingizni sinang: vaqt, ketma-ket toʻgʻri javoblar uchun bonus, xatolar tahlili.') +
      card('test', '🖨️', 'Test varaqasi', 'Chop etish uchun 1–4 variantli test va javoblar kaliti (oq-qora printerga mos).') +
      '</div><details class="tops"><summary>Mavzular va savollar soni</summary><ul>' + tops + '</ul><p class="note">' + esc(man) + '</p></details>' +
      '<p class="note links"><a href="' + esc(fanUrl()) + '">← Fan sahifasi</a> · <a href="./">Boshqa fanni tanlash</a></p></main>';
    function card(id, ic, t, d) { return '<button class="card" data-go="' + id + '"><span class="ic">' + ic + '</span><b>' + esc(t) + '</b><small>' + esc(d) + '</small></button>'; }
    $('.cards').onclick = function (e) {
      var b = e.target.closest('[data-go]'); if (!b) return;
      openMode(b.getAttribute('data-go'));
    };
  }
  function openMode(g) {
    if (g === 'host') hostSetup(); else if (g === 'join') playJoin(''); else if (g === 'team') teamSetup(); else if (g === 'arqon') arqonSetup(); else if (g === 'test') printSetup(); else soloSetup();
  }

  /* ================= JONLI VIKTORINA — O'QITUVCHI ================= */
  var H = null;
  function hostSetup() {
    root.className = 'setup';
    root.innerHTML = topbar('Jonli viktorina', true) + '<main class="wrap narrow"><div class="panel"><h2>' + esc(BANK.nomi) + '</h2>' + settingsForm('h') +
      '<button class="big" id="go">Xona ochish</button><p class="note">Xona ochilgach, oʻquvchilar telefonda <b>texnikum1son.uz/viktorina</b> sahifasini ochib kodni kiritadi yoki QR kodni skanerlaydi.</p></div></main>';
    bindSeg(root);
    $('#go').onclick = function () { var c = readSettings('h'); hostOpen(c); };
  }
  function hostOpen(c) {
    if (!NET) { alert('Tarmoq moduli yuklanmadi'); return; }
    var qs = questions(c); if (!needQs(qs)) return;
    H = { c: c, qs: qs, players: {}, i: -1, phase: 'lobby', answers: {}, api: null, timer: 0 };
    root.className = 'setup';
    root.innerHTML = topbar('Jonli viktorina', true) + '<main class="wrap narrow"><div class="panel center"><div class="spin"></div><p>Xona ochilmoqda…</p></div></main>';
    NET.host({
      kind: 'fan',
      onConn: function () { return Object.keys(H.players).length >= 80 ? 'Xona toʻlgan' : true; },
      onJoin: function (id, hello) { addPlayer(id, hello.name); },
      onRejoin: function (id, hello) { if (!H.players[id]) addPlayer(id, hello.name); else { H.players[id].on = true; syncTo(id); refreshCount(); } },
      onMsg: hostMsg,
      onLeave: function (id) { if (H && H.players[id]) { H.players[id].on = false; refreshCount(); if (H.phase === 'lobby') hostLobby(); } },
      onError: function () { }
    }).then(function (api) {
      if (!H) { try { api.close(); } catch (e) { } return; }
      H.api = api; H.code = api.code; api.beat('lobby'); hostLobby();
    }).catch(function (e) {
      if (!H) return;
      root.innerHTML = topbar('Jonli viktorina', true) + '<main class="wrap narrow"><div class="panel center"><p class="err">Xona ochib boʻlmadi: ' + esc(e && e.message || '') + '</p><p>Internet aloqasini tekshirib, qayta urinib koʻring. Internetsiz «Arqon tortish» yoki «Jamoaviy oʻyin»ni tanlashingiz mumkin.</p><button class="big" id="re">Qayta urinish</button></div></main>';
      $('#re').onclick = function () { hostOpen(c); };
    });
  }
  function plist() { return Object.keys(H.players).map(function (k) { return H.players[k]; }); }
  function online() { return plist().filter(function (p) { return p.on; }); }
  function addPlayer(id, name) {
    name = String(name || 'Oʻquvchi').trim().slice(0, 20) || 'Oʻquvchi';
    try { if (NET.badName && NET.badName(name)) name = 'Oʻquvchi'; } catch (e) { }
    var base = name, k = 2, names = plist().map(function (p) { return p.name.toLowerCase(); });
    while (names.indexOf(name.toLowerCase()) >= 0) name = base + ' ' + (k++);
    H.players[id] = { id: id, name: name, score: 0, streak: 0, correct: 0, on: true, last: null };
    H.api.send(id, { type: 'w', name: name, n: H.qs.length });
    if (H.phase === 'lobby') { hostLobby(); tone(700, 0.08, 'triangle', 0.1); } else { syncTo(id); refreshCount(); }
  }
  function qMsg() {
    var q = H.qs[H.i], el = Date.now() - H.qStart;
    return { type: 'q', i: H.i, n: H.qs.length, kind: q.kind, text: q.text, img: q.img || '', opts: q.opts, t: H.c.t, el: el, small: q.small ? 1 : 0 };
  }
  function syncTo(id) {
    var p = H.players[id]; if (!p || !H.api) return;
    if (H.phase === 'lobby') H.api.send(id, { type: 'w', name: p.name, n: H.qs.length }, true);
    else if (H.phase === 'q') { var m = qMsg(); if (H.answers[id]) m.done = 1; H.api.send(id, m, true); }
    else if (H.phase === 'r' || H.phase === 'lb') { if (p.last) H.api.send(id, p.last, true); else H.api.send(id, { type: 'r', i: H.i, ok: false, pts: 0, score: p.score, rank: 0, none: 1, a: H.qs[H.i].a }, true); }
    else if (H.phase === 'end') H.api.send(id, endMsg(p), true);
  }
  function hostMsg(id, m) {
    if (!H || m.type !== 'a' || H.phase !== 'q' || m.i !== H.i || !H.players[id] || H.answers[id]) return;
    var T0 = H.c.t * 1000, ms = +m.ms; if (!(ms >= 0)) ms = Date.now() - H.qStart;
    H.answers[id] = { k: +m.k, ms: Math.min(T0, Math.max(0, ms)) };
    refreshCount();
    var on = online(); if (on.length && on.every(function (p) { return H.answers[p.id]; })) { clearInterval(H.timer); setTimeout(hostReveal, 700); }
  }
  function refreshCount() {
    if (!H) return;
    var el = $('#acnt'); if (el) el.textContent = Object.keys(H.answers).length + ' / ' + online().length;
    var e2 = $('#acnt2'); if (e2) e2.textContent = Object.keys(H.answers).length;
    var pc = $('#pcnt'); if (pc) pc.textContent = online().length;
  }
  function joinUrl() { return (location.protocol === 'file:' ? SITE : location.href.split('#')[0].split('?')[0]) + '?kod=' + H.code; }
  function hostLobby() {
    H.phase = 'lobby';
    var url = joinUrl(), qr = '';
    try { var qq = window.qrcode(0, 'M'); qq.addData(url); qq.make(); qr = qq.createSvgTag({ cellSize: 5, margin: 2, scalable: true }); } catch (e) { }
    var ps = plist();
    root.className = 'game lobby';
    root.innerHTML = '<header class="vbar dark"><b>Jonli viktorina · ' + esc(BANK.nomi) + '</b>' + soundBtn() + '<button class="ib" id="x" title="Yopish">✕</button></header>' +
      '<main class="lob"><div class="joinbox"><div class="jl">Telefonda oching:<b>' + esc(url.replace(/^https?:\/\//, '').replace(/\?kod=.*/, '')) + '</b>Xona kodi:</div>' +
      '<div class="code">' + esc(H.code) + '</div><div class="qr">' + qr + '</div></div>' +
      '<div class="lobr"><div class="pcount"><span id="pcnt">' + ps.length + '</span> oʻquvchi</div>' +
      '<div class="chips">' + (ps.length ? ps.map(function (p) { return '<span class="chip' + (p.on ? '' : ' off') + '" data-id="' + esc(p.id) + '" title="Chiqarib yuborish uchun bosing">' + esc(p.name) + '</span>'; }).join('') : '<p class="wait">Oʻquvchilar qoʻshilishini kuting…</p>') + '</div>' +
      '<div class="lobinfo">' + H.qs.length + ' ta savol · har biriga ' + H.c.t + ' soniya · ' + esc(H.c.src === 'aralash' ? 'barcha mavzular' : B.topicName(H.c.src)) + '</div>' +
      '<button class="big" id="st"' + (ps.length ? '' : ' disabled') + '>Boshlash ▶</button></div></main>';
    $('#st').onclick = function () { SFX.start(); hostQuestion(); };
    $('#x').onclick = function () { if (confirm('Oʻyin yopilsinmi?')) { stopAll(); hub(); } };
    root.querySelector('.chips').onclick = function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      var id = c.getAttribute('data-id'), p = H.players[id];
      if (p && confirm(p.name + ' oʻyindan chiqarilsinmi?')) { H.api.kick(id, 'Oʻqituvchi sizni oʻyindan chiqardi'); delete H.players[id]; hostLobby(); }
    };
  }
  function hostQuestion() {
    H.i++; H.phase = 'q'; H.answers = {}; H.qStart = Date.now();
    var q = H.qs[H.i];
    H.api.cast(qMsg()); H.api.beat('q ' + H.i);
    root.className = 'game q';
    root.innerHTML = '<header class="vbar dark"><b>' + (H.i + 1) + ' / ' + H.qs.length + '</b><span class="acnt">Javoblar: <b id="acnt">0 / ' + online().length + '</b></span>' + soundBtn() + '<button class="ib" id="sk" title="Vaqtni toʻxtatish">⏭</button></header>' +
      '<main class="stage"><div class="qtop">' + qHead(q, '<div id="rg">' + ring(H.c.t, H.c.t) + '</div>', '<div class="ansbox"><b id="acnt2">0</b><span>javob</span></div>') + '</div>' + optTiles(q) + '</main>';
    $('#sk').onclick = function () { clearInterval(H.timer); hostReveal(); };
    var lastS = H.c.t;
    H.timer = setInterval(function () {
      if (!H) return;
      var left = H.c.t - (Date.now() - H.qStart) / 1000;
      var rg = $('#rg'); if (rg) rg.innerHTML = ring(left, H.c.t);
      var s = Math.ceil(left); if (s !== lastS) { lastS = s; if (s <= 5 && s > 0) SFX.tick(); }
      if (left <= 0) { clearInterval(H.timer); hostReveal(); }
    }, 200);
  }
  function rankList() { return plist().slice().sort(function (a, b) { return b.score - a.score; }); }
  function hostReveal() {
    if (!H || H.phase !== 'q') return;
    H.phase = 'r';
    var q = H.qs[H.i], T0 = H.c.t * 1000, counts = q.opts.map(function () { return 0; });
    plist().forEach(function (p) {
      var a = H.answers[p.id], ok = !!a && a.k === q.a, pts = 0;
      if (a && counts[a.k] != null) counts[a.k]++;
      if (ok) { p.streak++; p.correct++; pts = Math.round(1000 * (1 - a.ms / T0 / 2)) + Math.min(500, 100 * (p.streak - 1)); }
      else p.streak = 0;
      p.score += pts;
      p.last = { type: 'r', i: H.i, ok: ok, pts: pts, score: p.score, streak: p.streak, a: q.a, pick: a ? a.k : -1, none: a ? 0 : 1, exp: q.exp || '' };
    });
    var rl = rankList();
    rl.forEach(function (p, k) { p.last.rank = k + 1; p.last.of = rl.length; H.api.send(p.id, p.last); });
    H.api.beat('r ' + H.i);
    SFX.gong();
    root.className = 'game r';
    var total = counts.reduce(function (s, x) { return s + x; }, 0) || 1, mx = Math.max.apply(null, counts.concat([1]));
    var bars = '<div class="bars">' + q.opts.map(function (o, k) {
      var ci = q.kind === 'tf' ? tfIdx(k) : k;
      return '<div class="bar' + (k === q.a ? ' right' : '') + '" style="--c:' + COL[ci] + '"><span class="bn">' + counts[k] + '</span><i style="height:' + (8 + counts[k] / mx * 92) + 'px"></i>' + shape(ci) + (k === q.a ? '<b>✓</b>' : '') + '</div>';
    }).join('') + '</div>';
    root.innerHTML = '<header class="vbar dark"><b>' + (H.i + 1) + ' / ' + H.qs.length + '</b><span class="acnt">Toʻgʻri javob berdi: <b>' + counts[q.a] + ' / ' + Math.round(total) + '</b></span>' + soundBtn() + '</header>' +
      '<main class="stage"><div class="qtop">' + qHead(q) + bars + '</div>' + optTiles(q, { reveal: true }) +
      (q.exp ? '<div class="exp">' + tx(q.exp) + '</div>' : '') + '<button class="big next" id="nx">Keyingi ▶</button></main>';
    $('#nx').onclick = hostBoard;
  }
  function hostBoard() {
    H.phase = 'lb';
    var rl = rankList(), last = H.i + 1 >= H.qs.length;
    root.className = 'game lb';
    root.innerHTML = '<header class="vbar dark"><b>Reyting</b>' + soundBtn() + '</header><main class="stage"><h2 class="lbh">' + (last ? 'Yakuniy natijalar tayyor' : 'Eng yaxshi 5 ta') + '</h2><div class="board">' +
      rl.slice(0, 5).map(function (p, k) { return '<div class="brow"><span class="bk">' + (k + 1) + '</span><span class="bnm">' + esc(p.name) + (p.streak > 1 ? ' <small>🔥' + p.streak + '</small>' : '') + '</span><span class="bsc">' + p.score + '</span></div>'; }).join('') +
      (rl.length ? '' : '<p class="wait">Hali ishtirokchi yoʻq</p>') + '</div><button class="big next" id="nx">' + (last ? 'Shohsupa' : 'Keyingi savol') + ' ▶</button></main>';
    $('#nx').onclick = function () { if (last) hostEnd(); else hostQuestion(); };
  }
  function endMsg(p) { var rl = rankList(); return { type: 'end', rank: rl.indexOf(p) + 1, of: rl.length, score: p.score, correct: p.correct, n: H.qs.length }; }
  function hostEnd() {
    H.phase = 'end';
    plist().forEach(function (p) { H.api.send(p.id, endMsg(p)); });
    H.api.beat('end');
    var rl = rankList();
    SFX.win(); confetti();
    root.className = 'game end';
    root.innerHTML = '<header class="vbar dark"><b>Shohsupa · ' + esc(BANK.nomi) + '</b>' + soundBtn() + '</header><main class="stage">' + podium(rl) +
      '<div class="board small">' + rl.map(function (p, k) { return '<div class="brow"><span class="bk">' + (k + 1) + '</span><span class="bnm">' + esc(p.name) + '</span><span class="bsc">' + p.correct + '/' + H.qs.length + ' · ' + p.score + '</span></div>'; }).join('') + '</div>' +
      '<div class="row2"><button class="big alt" id="csv">Natijalar (CSV)</button><button class="big alt" id="again">Shu xonada yana oʻynash</button><button class="big" id="new">Yangi oʻyin</button></div></main>';
    $('#csv').onclick = function () {
      var rows = [['Oʻrin', 'Ism', 'Ball', 'Toʻgʻri javoblar', 'Savollar', 'Foiz']].concat(rl.map(function (p, k) { return [k + 1, p.name, p.score, p.correct, H.qs.length, Math.round(p.correct / H.qs.length * 100) + '%']; }));
      var csv = '﻿' + 'Fan;' + BANK.nomi + '\r\nSana;' + new Date().toLocaleString('uz') + '\r\n\r\n' + rows.map(function (r) { return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'viktorina-' + FAN.slice(0, 40) + '-' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); a.remove();
    };
    $('#again').onclick = function () { H.qs = questions(H.c); H.i = -1; plist().forEach(function (p) { p.score = 0; p.streak = 0; p.correct = 0; p.last = null; }); H.api.beat('lobby'); plist().forEach(function (p) { H.api.send(p.id, { type: 'w', name: p.name, n: H.qs.length }); }); hostLobby(); };
    $('#new').onclick = function () { stopAll(); hostSetup(); };
  }

  /* ================= JONLI VIKTORINA — O'QUVCHI (telefon) ================= */
  var P = null;
  function playJoin(code, err) {
    root.className = 'play join';
    var nm = LS.get('name', '');
    root.innerHTML = topbar('Oʻyinga qoʻshilish', true) + '<main class="wrap narrow"><form class="panel" id="jf"><h2>Oʻyinga qoʻshilish</h2>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<label class="fl">Xona kodi (5 harf)<input id="jc" maxlength="5" autocomplete="off" autocapitalize="characters" value="' + esc(code || '') + '" placeholder="ABCDE" class="codein"></label>' +
      '<label class="fl">Ismingiz<input id="jn" maxlength="20" autocomplete="nickname" value="' + esc(nm) + '" placeholder="Masalan: Aziz"></label>' +
      '<button class="big" id="jb">Qoʻshilish</button></form></main>';
    var jc = $('#jc'); jc.oninput = function () { jc.value = jc.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); };
    (code ? $('#jn') : jc).focus();
    $('#jf').onsubmit = function (e) {
      e.preventDefault();
      var c = jc.value.trim(), n = $('#jn').value.trim();
      if (c.length !== 5) return playJoin(c, 'Kod 5 ta harfdan iborat boʻlishi kerak');
      if (n.length < 2) return playJoin(c, 'Ismingizni yozing');
      LS.set('name', n);
      playConnect(c, n);
    };
  }
  function playConnect(code, name) {
    if (!NET) return playJoin(code, 'Tarmoq moduli yuklanmadi');
    P = { code: code, name: name, state: 'conn', qi: -1, ri: -1, api: null };
    root.className = 'play wait';
    root.innerHTML = '<main class="pmid"><div class="spin"></div><p>Ulanmoqda…</p></main>';
    NET.join(code, { name: name }, {
      onMsg: playMsg,
      onBeat: playBeat,
      onClose: function (why) {
        if (!P) return;
        root.className = 'play wait';
        root.innerHTML = '<main class="pmid"><div class="big-ic">' + (why === 'gone' ? '🏁' : '📶') + '</div><h2>' + (why === 'gone' ? 'Oʻqituvchi oʻyinni yakunladi' : 'Aloqa uzildi') + '</h2><button class="big" id="rj">' + (why === 'gone' ? 'Boshqa oʻyinga qoʻshilish' : 'Qayta ulanish') + '</button></main>';
        $('#rj').onclick = function () { if (why === 'gone') playJoin(''); else playConnect(code, name); };
      }
    }).then(function (api) {
      P.api = api; if (P.state === 'conn') { P.state = 'wait'; playWait(); }
    }).catch(function (e) { P = null; playJoin(code, (e && e.message) || 'Ulanib boʻlmadi'); });
  }
  function playWait() {
    root.className = 'play wait';
    root.innerHTML = '<main class="pmid"><div class="big-ic">✅</div><h2>Siz oʻyindasiz!</h2><div class="me">' + esc(P.name) + '</div><p>Ismingizni ekranda koʻring. Oʻqituvchi oʻyinni boshlashini kuting.</p></main>';
  }
  function playMsg(m) {
    if (!P) return;
    if (m.type === 'w') { if (m.name) P.name = m.name; if (P.state !== 'q' && P.state !== 'answered') { P.state = 'wait'; playWait(); } return; }
    if (m.type === 'q') {
      if (P.qi === m.i && (P.state === 'q' || P.state === 'answered')) return;
      P.qi = m.i; P.q = m; P.t0 = Date.now(); P.el = +m.el || 0;
      P.state = m.done ? 'answered' : 'q';
      if (m.done) return playAnswered(-1);
      return playQuestion();
    }
    if (m.type === 'r') { if (P.ri === m.i && P.state === 'r') return; P.ri = m.i; P.state = 'r'; return playResult(m); }
    if (m.type === 'end') { P.state = 'end'; return playEnd(m); }
    if (m.type === 'kick' || m.type === 'reject') {
      var why = m.why || 'Xona qabul qilmadi'; P = null;
      root.className = 'play wait'; root.innerHTML = '<main class="pmid"><div class="big-ic">⛔</div><h2>' + esc(why) + '</h2><button class="big" id="rj">Orqaga</button></main>';
      $('#rj').onclick = function () { playJoin(''); };
    }
  }
  function playBeat(st) {
    if (!P || !P.api) return;
    var a = String(st || '').split(' '), i = +a[1];
    if (a[0] === 'lobby') { if (P.state === 'r' || P.state === 'end' || P.state === 'q' || P.state === 'answered') { P.state = 'wait'; P.qi = -1; P.ri = -1; playWait(); } }
    else if (a[0] === 'q') { if (P.qi !== i || (P.state !== 'q' && P.state !== 'answered')) P.api.resync(); }
    else if (a[0] === 'r') { if (!(P.state === 'r' && P.ri === i)) P.api.resync(); }
    else if (a[0] === 'end') { if (P.state !== 'end') P.api.resync(); }
  }
  function playQuestion() {
    var q = P.q;
    root.className = 'play q';
    root.innerHTML = '<header class="vbar dark"><b>' + (q.i + 1) + ' / ' + q.n + '</b><span id="pt" class="ptime"></span>' + soundBtn() + '</header>' +
      '<main class="pstage">' + qHead(q) + optTiles(q, { btn: true }) + '</main>';
    var tick = setInterval(function () {
      if (!P || P.state !== 'q' || P.q !== q) { clearInterval(tick); return; }
      var left = Math.max(0, q.t - (P.el + Date.now() - P.t0) / 1000), el = $('#pt'); if (el) el.textContent = Math.ceil(left) + ' s';
      if (left <= 0) { clearInterval(tick); P.state = 'answered'; playAnswered(-2); }
    }, 250);
    root.querySelector('.opts').onclick = function (e) {
      var b = e.target.closest('.opt'); if (!b || P.state !== 'q') return;
      var k = +b.getAttribute('data-k');
      P.state = 'answered';
      P.api.send({ type: 'a', i: q.i, k: k, ms: Math.round(P.el + Date.now() - P.t0) });
      if (navigator.vibrate) try { navigator.vibrate(30); } catch (er) { }
      playAnswered(k);
    };
  }
  function playAnswered(k) {
    var q = P.q, ci = k >= 0 ? (q.kind === 'tf' ? tfIdx(k) : k) : -1;
    root.className = 'play wait';
    root.innerHTML = '<main class="pmid">' + (ci >= 0 ? '<div class="pickbig" style="--c:' + COL[ci] + '">' + shape(ci) + '</div><h2>Javobingiz qabul qilindi</h2>' : '<div class="big-ic">' + (k === -2 ? '⏰' : '⏳') + '</div><h2>' + (k === -2 ? 'Vaqt tugadi' : 'Javob qabul qilingan') + '</h2>') + '<p>Natijani kuting…</p></main>';
  }
  function playResult(r) {
    root.className = 'play res ' + (r.ok ? 'good' : 'bad');
    if (r.ok) SFX.good(); else SFX.bad();
    root.innerHTML = '<main class="pmid"><div class="big-ic">' + (r.ok ? '🎉' : (r.none ? '⏰' : '❌')) + '</div><h2>' + (r.ok ? 'Toʻgʻri!' : (r.none ? 'Javob bermadingiz' : 'Notoʻgʻri')) + '</h2>' +
      (r.ok ? '<div class="pts">+' + r.pts + '</div>' + (r.streak > 1 ? '<p>🔥 ' + r.streak + ' ta ketma-ket toʻgʻri</p>' : '') : '') +
      (r.exp ? '<p class="pexp">' + tx(r.exp) + '</p>' : '') +
      '<div class="rank">Hisobingiz: <b>' + r.score + '</b>' + (r.rank ? ' · ' + r.rank + '-oʻrin' + (r.of ? ' / ' + r.of : '') : '') + '</div></main>';
  }
  function playEnd(e) {
    root.className = 'play end';
    if (e.rank && e.rank <= 3) { SFX.win(); confetti(); }
    root.innerHTML = '<main class="pmid"><div class="big-ic">' + (['🥇', '🥈', '🥉'][e.rank - 1] || '🏁') + '</div><h2>Oʻyin tugadi!</h2><div class="me">' + e.rank + '-oʻrin' + (e.of ? ' / ' + e.of : '') + '</div>' +
      '<div class="rank">Ball: <b>' + e.score + '</b> · Toʻgʻri: ' + e.correct + ' / ' + e.n + '</div><p>Oʻqituvchi yangi oʻyin boshlasa, ekran oʻzi yangilanadi.</p></main>';
  }

  /* ================= JAMOAVIY O'YIN (bitta ekran, 2–4 jamoa) ================= */
  var TM = null;
  function teamSetup() {
    root.className = 'setup';
    var names = LS.get('teams', ['1-jamoa', '2-jamoa', '3-jamoa', '4-jamoa']), cnt = LS.get('teamn', 2);
    var extra = '<div class="fl">Jamoalar soni<div class="seg" data-k="tn">' + [2, 3, 4].map(function (k) { return '<button type="button" data-v="' + k + '" class="' + (k === cnt ? 'on' : '') + '">' + k + '</button>'; }).join('') + '</div></div>' +
      '<div class="fl">Jamoalar nomi<div class="tnames">' + [0, 1, 2, 3].map(function (k) { return '<input data-t="' + k + '" maxlength="18" value="' + esc(names[k]) + '" style="--c:' + COL[k] + '">'; }).join('') + '</div></div>';
    root.innerHTML = topbar('Jamoaviy oʻyin', true) + '<main class="wrap narrow"><div class="panel"><h2>' + esc(BANK.nomi) + '</h2>' + settingsForm('t', { extra: extra }) + '<button class="big" id="go">Boshlash ▶</button></div></main>';
    bindSeg(root);
    $('#go').onclick = function () {
      var c = readSettings('t'), tn = +segVal('tn') || 2;
      var nm = $$('.tnames input').map(function (i, k) { return i.value.trim() || (k + 1) + '-jamoa'; });
      LS.set('teams', nm); LS.set('teamn', tn);
      var qs = questions(c); if (!needQs(qs)) return;
      TM = { c: c, qs: qs, i: -1, teams: nm.slice(0, tn).map(function (n, k) { return { name: n, score: 0, c: COL[k] }; }) };
      SFX.start(); teamQuestion();
    };
  }
  function teamScores(hl) {
    return '<div class="tscore">' + TM.teams.map(function (t, k) { return '<span class="tchip' + (hl && hl[k] ? ' on' : '') + '" style="--c:' + t.c + '"><span>' + esc(t.name) + '</span><b>' + t.score + '</b></span>'; }).join('') + '</div>';
  }
  function teamQuestion() {
    TM.i++; TM.t0 = Date.now(); clearInterval(TM.timer);
    var q = TM.qs[TM.i];
    root.className = 'game q team';
    root.innerHTML = '<header class="vbar dark"><button class="ib" data-act="home" title="Chiqish">‹</button><b>' + (TM.i + 1) + ' / ' + TM.qs.length + '</b>' + teamScores() + soundBtn() + '</header>' +
      '<main class="stage"><div class="qtop">' + qHead(q, '<div id="rg">' + ring(TM.c.t, TM.c.t) + '</div>', '') + '</div>' + optTiles(q) + '<button class="big next" id="sh">Javobni koʻrsatish</button></main>';
    var lastS = TM.c.t;
    TM.timer = setInterval(function () {
      if (!TM) return;
      var left = TM.c.t - (Date.now() - TM.t0) / 1000, rg = $('#rg'); if (rg) rg.innerHTML = ring(left, TM.c.t);
      var s = Math.ceil(left); if (s !== lastS) { lastS = s; if (s <= 5 && s > 0) SFX.tick(); }
      if (left <= 0) { clearInterval(TM.timer); teamReveal(); }
    }, 200);
    $('#sh').onclick = function () { clearInterval(TM.timer); teamReveal(); };
  }
  function teamReveal() {
    var q = TM.qs[TM.i], got = {};
    SFX.gong();
    root.className = 'game r team';
    function draw() {
      root.innerHTML = '<header class="vbar dark"><button class="ib" data-act="home" title="Chiqish">‹</button><b>' + (TM.i + 1) + ' / ' + TM.qs.length + '</b>' + teamScores(got) + soundBtn() + '</header>' +
        '<main class="stage"><div class="qtop">' + qHead(q) + '</div>' + optTiles(q, { reveal: true }) + (q.exp ? '<div class="exp">' + tx(q.exp) + '</div>' : '') +
        '<p class="hint">Toʻgʻri topgan jamoalarni belgilang (+1 ball):</p>' +
        '<div class="tpick">' + TM.teams.map(function (t, k) { return '<button class="tbtn' + (got[k] ? ' on' : '') + '" data-tk="' + k + '" style="--c:' + t.c + '">' + (got[k] ? '✓ ' : '') + esc(t.name) + '</button>'; }).join('') + '</div>' +
        '<button class="big next" id="nx">' + (TM.i + 1 < TM.qs.length ? 'Keyingi savol' : 'Natijalar') + ' ▶</button></main>';
      root.querySelector('.tpick').onclick = function (e) { var b = e.target.closest('[data-tk]'); if (!b) return; var k = +b.getAttribute('data-tk'); got[k] = !got[k]; draw(); };
      $('#nx').onclick = function () {
        TM.teams.forEach(function (t, k) { if (got[k]) t.score++; });
        if (TM.i + 1 < TM.qs.length) teamQuestion(); else teamEnd();
      };
    }
    draw();
  }
  function teamEnd() {
    var rl = TM.teams.slice().sort(function (a, b) { return b.score - a.score; });
    SFX.win(); confetti();
    root.className = 'game end';
    root.innerHTML = '<header class="vbar dark"><b>Natijalar</b>' + soundBtn() + '</header><main class="stage">' + podium(rl) +
      '<div class="row2"><button class="big alt" id="again">Yana oʻynash</button><button class="big" id="menu">Menyu</button></div></main>';
    $('#again').onclick = function () { TM.qs = questions(TM.c); TM.i = -1; TM.teams.forEach(function (t) { t.score = 0; }); teamQuestion(); };
    $('#menu').onclick = function () { stopAll(); hub(); };
  }

  /* ================= ARQON TORTISH (2 jamoa, bitta ekran) ================= */
  var AR = null;
  function arqonSetup() {
    root.className = 'setup';
    var names = LS.get('arqon', ['Qizillar', 'Koʻklar']), L = LS.get('arqonL', 5);
    var extra = '<div class="fl">Jamoalar<div class="tnames">' + [0, 1].map(function (k) { return '<input data-t="' + k + '" maxlength="18" value="' + esc(names[k]) + '" style="--c:' + TCOL[k] + '">'; }).join('') + '</div></div>' +
      '<div class="fl">Gʻalaba uchun necha marta tortish kerak<div class="seg" data-k="L">' + [3, 5, 7].map(function (k) { return '<button type="button" data-v="' + k + '" class="' + (k === L ? 'on' : '') + '">' + k + '</button>'; }).join('') + '</div></div>' +
      '<p class="note">Har jamoa ekranning oʻz yarmidagi javobni bosadi (klaviaturada: chap jamoa <b>1 2 3 4</b>, oʻng jamoa <b>7 8 9 0</b>). Birinchi toʻgʻri javob arqonni tortadi; xato qilgan jamoa shu savolda boshqa javob bera olmaydi.</p>';
    root.innerHTML = topbar('Arqon tortish', true) + '<main class="wrap narrow"><div class="panel"><h2>' + esc(BANK.nomi) + '</h2>' + settingsForm('a', { extra: extra, nLabel: 'Savollar soni (koʻpi bilan)', ns: [[10, '10'], [15, '15'], [20, '20'], [30, '30'], [50, '50']], noMix: true }) + '<button class="big" id="go">Boshlash ▶</button></div></main>';
    bindSeg(root);
    $('#go').onclick = function () {
      var c = readSettings('a'); c.mix = 'mc';
      var nm = $$('.tnames input').map(function (i, k) { return i.value.trim() || ['Qizillar', 'Koʻklar'][k]; }), L2 = +segVal('L') || 5;
      LS.set('arqon', nm); LS.set('arqonL', L2);
      var qs = questions(c); if (!needQs(qs)) return;
      AR = { c: c, qs: qs, i: -1, pos: 0, L: L2, names: nm, score: [0, 0] };
      document.addEventListener('keydown', arqonKey);
      SFX.start(); arqonQuestion();
    };
  }
  function arqonKey(e) {
    if (!AR || e.ctrlKey || e.metaKey || e.altKey) return;
    var A = { '1': [0, 0], '2': [0, 1], '3': [0, 2], '4': [0, 3], '7': [1, 0], '8': [1, 1], '9': [1, 2], '0': [1, 3] }[e.key];
    if (A && !AR.done) { e.preventDefault(); arqonAnswer(A[0], A[1]); }
    else if ((e.key === 'Enter' || e.key === ' ') && AR.done && $('#anx')) { e.preventDefault(); $('#anx').click(); }
  }
  function ropeHtml() {
    var p = Math.max(-1, Math.min(1, AR.pos / AR.L)), x = 50 + p * 42;
    var marks = '';
    for (var i = -AR.L; i <= AR.L; i++) marks += '<i style="left:' + (50 + i / AR.L * 42) + '%"' + (i === 0 ? ' class="m0"' : '') + '></i>';
    return '<div class="rope">' +
      '<div class="rteam l" style="--c:' + TCOL[0] + '"><span class="rman">🧍‍♂️🧍</span><b>' + esc(AR.names[0]) + '</b><small>' + AR.score[0] + ' ta toʻgʻri</small></div>' +
      '<div class="rtrack"><div class="rzone l"></div><div class="rzone r"></div>' + marks + '<div class="rline"></div><div class="rknot" style="left:' + x + '%"><span>🎀</span></div></div>' +
      '<div class="rteam r" style="--c:' + TCOL[1] + '"><span class="rman">🧍🧍‍♂️</span><b>' + esc(AR.names[1]) + '</b><small>' + AR.score[1] + ' ta toʻgʻri</small></div></div>';
  }
  function arqonPanel(q, tm) {
    return '<div class="apanel" data-tm="' + tm + '" style="--c:' + TCOL[tm] + '"><div class="aph">' + esc(AR.names[tm]) + '</div>' + q.opts.map(function (o, k) {
      return '<button class="abtn" data-tm="' + tm + '" data-k="' + k + '"><span class="al">' + LET[k] + '</span><span class="ot">' + tx(o) + '</span><kbd>' + (tm === 0 ? k + 1 : [7, 8, 9, 0][k]) + '</kbd></button>';
    }).join('') + '</div>';
  }
  function arqonQuestion() {
    if (!AR) return;
    AR.i++;
    if (AR.i >= AR.qs.length) return arqonEnd();
    AR.lock = [false, false]; AR.done = false; AR.t0 = Date.now(); clearInterval(AR.timer);
    var q = AR.qs[AR.i];
    root.className = 'game arqon';
    root.innerHTML = '<header class="vbar dark"><button class="ib" data-act="home" title="Chiqish">‹</button><b>Arqon tortish · ' + (AR.i + 1) + ' / ' + AR.qs.length + '</b><span id="rg" class="artime"></span>' + soundBtn() + '</header>' +
      '<main class="stage astage">' + ropeHtml() + '<div class="qtop">' + qHead(q) + '</div><div class="apanels">' + arqonPanel(q, 0) + arqonPanel(q, 1) + '</div><div id="amsg"></div></main>';
    root.querySelector('.apanels').onclick = function (e) {
      var b = e.target.closest('.abtn'); if (!b) return;
      arqonAnswer(+b.getAttribute('data-tm'), +b.getAttribute('data-k'));
    };
    var lastS = AR.c.t;
    AR.timer = setInterval(function () {
      if (!AR) return;
      var left = AR.c.t - (Date.now() - AR.t0) / 1000, rg = $('#rg'); if (rg) rg.textContent = '⏱ ' + Math.max(0, Math.ceil(left));
      var s = Math.ceil(left); if (s !== lastS) { lastS = s; if (s <= 5 && s > 0) SFX.tick(); }
      if (left <= 0) { clearInterval(AR.timer); AR.done = true; arqonReveal(-1); }
    }, 200);
  }
  function arqonAnswer(tm, k) {
    if (!AR || AR.done || AR.lock[tm]) return;
    var q = AR.qs[AR.i];
    if (k === q.a) {
      AR.done = true; AR.pos += tm === 0 ? -1 : 1; AR.score[tm]++;
      SFX.good(); SFX.pull(); arqonReveal(tm, k);
    } else {
      AR.lock[tm] = true; SFX.bad();
      var pn = root.querySelector('.apanel[data-tm="' + tm + '"]');
      if (pn) { pn.classList.add('locked'); var bb = pn.querySelector('.abtn[data-k="' + k + '"]'); if (bb) bb.classList.add('no'); }
      if (AR.lock[0] && AR.lock[1]) { AR.done = true; arqonReveal(-1); }
    }
  }
  function arqonReveal(win, k) {
    clearInterval(AR.timer);
    var q = AR.qs[AR.i];
    $$('.abtn').forEach(function (b) { var kk = +b.getAttribute('data-k'); if (kk === q.a) b.classList.add('ok'); b.disabled = true; });
    if (win >= 0) { var wb = root.querySelector('.abtn[data-tm="' + win + '"][data-k="' + k + '"]'); if (wb) wb.classList.add('win'); }
    var rp = root.querySelector('.rope'); if (rp) rp.outerHTML = ropeHtml();
    var kn = root.querySelector('.rknot'); if (kn && win >= 0) kn.classList.add(win === 0 ? 'pl' : 'pr');
    var over = Math.abs(AR.pos) >= AR.L;
    $('#amsg').innerHTML = '<div class="exp">' + (win >= 0 ? '💪 <b>' + esc(AR.names[win]) + '</b> arqonni tortdi!' : 'Hech kim topa olmadi. Toʻgʻri javob: <b>' + tx(q.opts[q.a]) + '</b>') + (q.exp ? '<br><small>' + tx(q.exp) + '</small>' : '') + '</div>' +
      '<button class="big next" id="anx">' + (over || AR.i + 1 >= AR.qs.length ? 'Natija' : 'Keyingi savol') + ' ▶</button>';
    $('#anx').onclick = function () { if (over) arqonEnd(); else arqonQuestion(); };
  }
  function arqonEnd() {
    if (!AR) return;
    clearInterval(AR.timer);
    var w = AR.pos < 0 ? 0 : AR.pos > 0 ? 1 : (AR.score[0] > AR.score[1] ? 0 : AR.score[1] > AR.score[0] ? 1 : -1);
    if (w >= 0) { SFX.win(); confetti(); }
    root.className = 'game end arqon';
    root.innerHTML = '<header class="vbar dark"><b>Arqon tortish — natija</b>' + soundBtn() + '</header><main class="stage">' + ropeHtml() +
      '<div class="awin">' + (w >= 0 ? '<div class="big-ic">🏆</div><h2 style="color:' + TCOL[w] + '">' + esc(AR.names[w]) + ' gʻolib!</h2>' : '<div class="big-ic">🤝</div><h2>Durang!</h2>') +
      '<p>' + esc(AR.names[0]) + ': ' + AR.score[0] + ' ta toʻgʻri · ' + esc(AR.names[1]) + ': ' + AR.score[1] + ' ta toʻgʻri</p></div>' +
      '<div class="row2"><button class="big alt" id="again">Yana oʻynash</button><button class="big" id="menu">Menyu</button></div></main>';
    $('#again').onclick = function () { var c = AR.c, qs = questions(c); AR = { c: c, qs: qs, i: -1, pos: 0, L: AR.L, names: AR.names, score: [0, 0] }; SFX.start(); arqonQuestion(); };
    $('#menu').onclick = function () { stopAll(); hub(); };
  }

  /* ================= YAKKA O'YIN ================= */
  var SG = null;
  function soloSetup() {
    root.className = 'setup';
    root.innerHTML = topbar('Yakka oʻyin', true) + '<main class="wrap narrow"><div class="panel"><h2>' + esc(BANK.nomi) + '</h2>' + settingsForm('s') + '<button class="big" id="go">Boshlash ▶</button></div></main>';
    bindSeg(root);
    $('#go').onclick = function () { var c = readSettings('s'), qs = questions(c); if (!needQs(qs)) return; SG = { c: c, qs: qs, i: -1, score: 0, streak: 0, ok: 0, wrong: [] }; SFX.start(); soloQuestion(); };
  }
  function soloQuestion() {
    SG.i++; SG.t0 = Date.now(); clearInterval(SG.timer);
    var q = SG.qs[SG.i], done = false;
    root.className = 'game q solo';
    root.innerHTML = '<header class="vbar dark"><button class="ib" data-act="home" title="Chiqish">‹</button><b>' + (SG.i + 1) + ' / ' + SG.qs.length + '</b><span class="acnt">Ball: <b>' + SG.score + '</b>' + (SG.streak > 1 ? ' 🔥' + SG.streak : '') + '</span>' + soundBtn() + '</header>' +
      '<main class="stage"><div class="qtop">' + qHead(q, '<div id="rg">' + ring(SG.c.t, SG.c.t) + '</div>', '') + '</div>' + optTiles(q, { btn: true }) + '<div id="fb"></div></main>';
    var lastS = SG.c.t;
    SG.timer = setInterval(function () {
      if (!SG) return;
      var left = SG.c.t - (Date.now() - SG.t0) / 1000, rg = $('#rg'); if (rg) rg.innerHTML = ring(left, SG.c.t);
      var s = Math.ceil(left); if (s !== lastS) { lastS = s; if (s <= 5 && s > 0) SFX.tick(); }
      if (left <= 0) { clearInterval(SG.timer); answer(-1); }
    }, 200);
    root.querySelector('.opts').onclick = function (e) { var b = e.target.closest('.opt'); if (b) answer(+b.getAttribute('data-k')); };
    function answer(k) {
      if (done || !SG) return; done = true; clearInterval(SG.timer);
      var ms = Date.now() - SG.t0, ok = k === q.a, pts = 0;
      if (ok) { SG.streak++; SG.ok++; pts = Math.round(1000 * (1 - Math.min(1, ms / (SG.c.t * 1000)) / 2)) + Math.min(500, 100 * (SG.streak - 1)); SG.score += pts; SFX.good(); }
      else { SG.streak = 0; SG.wrong.push({ q: q, k: k }); SFX.bad(); }
      var box = root.querySelector('.opts'); box.outerHTML = optTiles(q, { reveal: true, pick: k });
      $('#fb').innerHTML = '<div class="sfb ' + (ok ? 'good' : 'bad') + '"><b>' + (ok ? 'Toʻgʻri! +' + pts : (k < 0 ? 'Vaqt tugadi' : 'Notoʻgʻri')) + '</b>' + (q.exp ? '<span>' + tx(q.exp) + '</span>' : '') + '</div><button class="big next" id="nx">' + (SG.i + 1 < SG.qs.length ? 'Keyingi' : 'Natija') + ' ▶</button>';
      $('#nx').onclick = function () { if (SG.i + 1 < SG.qs.length) soloQuestion(); else soloEnd(); };
    }
  }
  function soloEnd() {
    var key = 'best_' + FAN + '_' + SG.c.src, best = LS.get(key, 0), rec = SG.score > best;
    if (rec) LS.set(key, SG.score);
    var pct = Math.round(SG.ok / SG.qs.length * 100), baho = pct >= 86 ? 5 : pct >= 71 ? 4 : pct >= 56 ? 3 : 2;
    if (pct >= 70) { SFX.win(); confetti(); }
    root.className = 'game end solo';
    root.innerHTML = '<header class="vbar dark"><b>Natija · ' + esc(BANK.nomi) + '</b>' + soundBtn() + '</header><main class="stage"><div class="sres"><div class="spct">' + pct + '%</div>' +
      '<p>' + SG.ok + ' / ' + SG.qs.length + ' toʻgʻri · ' + SG.score + ' ball · baho: <b>' + baho + '</b></p><p class="rec">' + (rec ? '🏆 Yangi rekord!' : 'Rekord: ' + best + ' ball') + '</p></div>' +
      (SG.wrong.length ? '<h3 class="wh">Xatolar ustida ishlash</h3><div class="wlist">' + SG.wrong.map(function (w) {
        var right = w.q.opts[w.q.a];
        if (w.q.kind === 'tf') right = w.q.exp || right;
        return '<div class="witem">' + (w.q.img ? '<img src="' + esc(w.q.img) + '" alt="">' : '') + '<div><div class="wq">' + tx(w.q.text) + '</div><div class="wa">✓ ' + tx(right) + '</div>' + (w.q.exp && w.q.kind !== 'tf' ? '<div class="we">' + tx(w.q.exp) + '</div>' : '') + '</div></div>';
      }).join('') + '</div>' : '') +
      '<div class="row2"><button class="big alt" id="again">Qayta oʻynash</button><button class="big" id="menu">Menyu</button></div></main>';
    $('#again').onclick = function () { var qs = questions(SG.c); SG = { c: SG.c, qs: qs, i: -1, score: 0, streak: 0, ok: 0, wrong: [] }; soloQuestion(); };
    $('#menu').onclick = function () { stopAll(); hub(); };
  }

  /* ================= TEST VARAQASI (chop etish) ================= */
  function printSetup() {
    root.className = 'setup';
    var V = LS.get('pv', 2), K = LS.get('pk', 1);
    var extra = '<div class="fl">Variantlar soni<div class="seg" data-k="v">' + [1, 2, 3, 4].map(function (k) { return '<button type="button" data-v="' + k + '" class="' + (k === V ? 'on' : '') + '">' + k + '</button>'; }).join('') + '</div></div>' +
      '<div class="fl">Javoblar kaliti<div class="seg" data-k="key"><button type="button" data-v="1" class="' + (K ? 'on' : '') + '">Oxirgi betda</button><button type="button" data-v="0" class="' + (K ? '' : 'on') + '">Kerak emas</button></div></div>';
    root.innerHTML = topbar('Test varaqasi', true) + '<main class="wrap narrow"><div class="panel"><h2>' + esc(BANK.nomi) + '</h2>' + settingsForm('p', { extra: extra, noTime: true, noMix: true, ns: [[10, '10'], [15, '15'], [20, '20'], [25, '25'], [30, '30'], [50, '50']] }) + '<button class="big" id="go">Test varaqasini tayyorlash</button><p class="note">Har variantda savollar va javoblar tartibi har xil. Varaqa oq-qora printerga moslangan.</p></div></main>';
    bindSeg(root);
    $('#go').onclick = function () {
      var c = { src: $('#f-src').value, n: +segVal('n') || 20, mix: 'mc' }, nv = +segVal('v') || 1, key = segVal('key') === '1';
      LS.set(FAN + '_psrc', c.src); LS.set('pn', c.n); LS.set('pv', nv); LS.set('pk', key ? 1 : 0);
      printRender(c, nv, key);
    };
  }
  function printRender(c, nv, key) {
    var base = B.make(c.src, c.n, { mix: 'mc' });
    if (!needQs(base)) return;
    var vars = [];
    for (var v = 0; v < nv; v++) {
      var qs = v === 0 ? base : B.shuffle(base).map(function (q) { var right = q.opts[q.a], o = B.shuffle(q.opts); return Object.assign({}, q, { opts: o, a: o.indexOf(right) }); });
      vars.push(qs);
    }
    var tname = c.src === 'aralash' ? '' : B.topicName(c.src), sana = new Date().toLocaleDateString('uz-UZ');
    var html = vars.map(function (qs, v) {
      return '<section class="pv"><div class="ph"><div class="pinst">Toshkent tuman 1-son texnikumi</div><h1>«' + esc(BANK.nomi) + '» fanidan test</h1>' +
        (tname ? '<div class="ptp">Mavzu: ' + esc(tname) + '</div>' : '') +
        '<div class="pmeta"><span>' + (nv > 1 ? '<b>' + (v + 1) + '-variant</b> · ' : '') + qs.length + ' ta savol</span><span>F.I.Sh.: ________________________</span><span>Guruh: ________</span><span>Sana: ____________</span></div></div>' +
        '<ol class="pq">' + qs.map(function (q) {
          var short = q.opts.every(function (o) { return o.length <= 34; });
          return '<li>' + (q.img ? '<img class="pimg" src="' + esc(q.img) + '" alt="">' : '') + '<div class="pqt">' + tx(q.text) + '</div><ol class="po' + (short ? ' two' : '') + '" type="A">' + q.opts.map(function (o) { return '<li>' + tx(o) + '</li>'; }).join('') + '</ol></li>';
        }).join('') + '</ol></section>';
    }).join('');
    if (key) {
      html += '<section class="pv pkey"><div class="ph"><h1>Javoblar kaliti — «' + esc(BANK.nomi) + '»</h1><div class="pmeta"><span>Tuzilgan: ' + esc(sana) + '</span><span>texnikum1son.uz — fan viktorinasi</span></div></div>' +
        vars.map(function (qs, v) {
          return '<h2>' + (nv > 1 ? (v + 1) + '-variant' : 'Javoblar') + '</h2><div class="kgrid">' + qs.map(function (q, i) { return '<span><b>' + (i + 1) + '</b>' + LET[q.a] + '</span>'; }).join('') + '</div>';
        }).join('') + '<p class="pnote">Baholash: 86–100% — «5», 71–85% — «4», 56–70% — «3», 55% dan past — «2».</p></section>';
    }
    root.className = 'printv';
    root.innerHTML = '<header class="vbar noprint"><button class="ib" data-act="home" title="Orqaga">‹</button><b>Test varaqasi · ' + esc(BANK.nomi) + '</b><button class="pbtn" id="pr">🖨 Chop etish</button><button class="pbtn alt" id="re">↻ Boshqa savollar</button></header><main class="paper">' + html + '</main>';
    $('#pr').onclick = function () { window.print(); };
    $('#re').onclick = function () { printRender(c, nv, key); };
  }

  /* ---------- Android «orqaga» (WebView ilova) ---------- */
  window.appBack = function () { if (root.className === 'hub') return false; goHome(); return true; };

  /* ---------- ishga tushirish ---------- */
  function start() {
    var kod = (location.search.match(/[?&]kod=([A-Za-z0-9]{5})/) || [])[1];
    if (kod) return playJoin(kod.toUpperCase());
    if (!FAN) return picker();
    root.className = 'setup';
    root.innerHTML = '<main class="wrap narrow"><div class="panel center"><div class="spin"></div><p>Savollar yuklanmoqda…</p></div></main>';
    B.load(FAN).then(function (bk) {
      BANK = bk.bank;
      if (!B.total()) {
        root.className = 'hub';
        root.innerHTML = topbar(BANK.nomi) + '<main class="wrap narrow"><div class="panel center"><h2>' + esc(BANK.nomi) + '</h2><p>Bu fan uchun savollar hali tayyorlanmoqda. Oʻqituvchi majmuasini kabinet orqali yuklasa, Kuvi agent undan testlarni avtomatik tuzadi.</p><p><a href="./">Boshqa fanni tanlash</a></p></div></main>';
        return;
      }
      var rej = Q.get('rej');
      if (/^(host|team|arqon|solo|test)$/.test(rej || '')) openMode(rej); else hub();
    }).catch(function () {
      FAN = ''; picker();
    });
  }
  start();
})();
