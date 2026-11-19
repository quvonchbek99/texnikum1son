/* YHQ viktorina — Kahoot uslubidagi o'yinlar: jonli (telefonlar bilan), jamoaviy (bitta ekran) va yakka */
(function () {
  'use strict';
  var D = window.APPDATA, TR = window.Translit, B = window.YHQBank, NET = window.KANet;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var root = $('#vk');
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('yhq_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('yhq_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var script = LS.get('script', 'lat'), muted = LS.get('vmute', false);
  function T(s) { return script === 'cyr' ? TR.toCyr(s) : s; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tx(s) { return esc(T(s)).replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/\^(\d+)/g, '<sup>$1</sup>'); }
  var SITE = 'https://texnikum1son.uz/yhq/viktorina.html';
  var COL = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
  var SHP = ['<path d="M16 3 L30 28 H2 Z"/>', '<path d="M16 2 L30 16 L16 30 L2 16 Z"/>', '<circle cx="16" cy="16" r="13.5"/>', '<rect x="3.5" y="3.5" width="25" height="25"/>'];
  function shape(k) { return '<svg class="shp" viewBox="0 0 32 32">' + SHP[k] + '</svg>'; }
  function tfIdx(k) { return k === 0 ? 1 : 0; } // to'g'ri — ko'k romb, noto'g'ri — qizil uchburchak

  /* ---------- ovozlar (WebAudio) ---------- */
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
    win: function () { [523, 659, 784, 1046, 784, 1046].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.16, i * 0.15); }); }
  };
  function soundBtn() { return '<button class="ib snd" data-act="snd" title="' + esc(T('Ovoz')) + '">' + (muted ? '🔇' : '🔊') + '</button>'; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act="snd"]'); if (!b) return;
    muted = !muted; LS.set('vmute', muted); b.textContent = muted ? '🔇' : '🔊';
  });

  /* ---------- umumiy elementlar ---------- */
  function topbar(title, back) {
    return '<header class="vbar"><a class="ib" href="' + (back || 'index.html') + '" title="' + esc(T('Orqaga')) + '">‹</a><b>' + tx(title) + '</b>' + soundBtn() + '</header>';
  }
  function settingsForm(prefix, opt) {
    opt = opt || {};
    var src = LS.get(prefix + 'src', 'aralash'), n = LS.get(prefix + 'n', 10), t = LS.get(prefix + 't', 20), mix = LS.get(prefix + 'mix', 'aralash');
    var srcs = B.sources().map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === src ? ' selected' : '') + '>' + esc(T(s[1])) + '</option>'; }).join('');
    function seg(name, vals, cur) { return '<div class="seg" data-k="' + name + '">' + vals.map(function (v) { return '<button type="button" data-v="' + v[0] + '" class="' + (String(v[0]) === String(cur) ? 'on' : '') + '">' + esc(T(v[1])) + '</button>'; }).join('') + '</div>'; }
    return '<label class="fl">' + tx('Mavzu') + '<select id="f-src">' + srcs + '</select></label>' +
      '<div class="fl">' + tx('Savollar soni') + seg('n', [[5, '5'], [10, '10'], [15, '15'], [20, '20'], [30, '30']], n) + '</div>' +
      '<div class="fl">' + tx('Har bir savolga vaqt') + seg('t', [[10, '10 s'], [20, '20 s'], [30, '30 s'], [60, '60 s']], t) + '</div>' +
      '<div class="fl">' + tx('Savol turi') + seg('mix', [['aralash', 'Aralash'], ['mc', '4 variantli'], ['tf', 'Toʻgʻri / Notoʻgʻri']], mix) + '</div>' + (opt.extra || '');
  }
  function bindSeg(box) {
    Array.prototype.forEach.call(box.querySelectorAll('.seg'), function (s) {
      s.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        Array.prototype.forEach.call(s.children, function (c) { c.classList.toggle('on', c === b); });
      });
    });
  }
  function readSettings(prefix) {
    function seg(k) { var b = root.querySelector('.seg[data-k="' + k + '"] .on'); return b ? b.getAttribute('data-v') : null; }
    var c = { src: $('#f-src').value, n: +seg('n') || 10, t: +seg('t') || 20, mix: seg('mix') || 'aralash' };
    LS.set(prefix + 'src', c.src); LS.set(prefix + 'n', c.n); LS.set(prefix + 't', c.t); LS.set(prefix + 'mix', c.mix);
    return c;
  }
  function questions(c) { return B.make(c.src, c.n, { mix: c.mix, bhm: LS.get('bhm', D.meta.bhm) }); }
  function ring(left, total) {
    var p = Math.max(0, left / total), C = 2 * Math.PI * 26;
    return '<div class="ring"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" class="bg"/><circle cx="30" cy="30" r="26" class="fg" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + (C * (1 - p)) + '"/></svg><span>' + Math.ceil(left) + '</span></div>';
  }
  function optTiles(q, opt) {
    // opt: {reveal: true, counts: [..], pick: k, btn: true}
    opt = opt || {};
    var html = '';
    q.opts.forEach(function (o, k) {
      var ci = q.kind === 'tf' ? tfIdx(k) : k;
      var cls = 'opt' + (opt.reveal ? (k === q.a ? ' right' : ' dim') : '') + (opt.pick === k ? ' picked' : '');
      var inner = q.kind === 'img4' ? '<span class="oimg"><img src="' + esc(o) + '" alt=""></span>' : '<span class="ot">' + tx(o) + '</span>';
      var cnt = opt.counts ? '<span class="cnt">' + (opt.counts[k] || 0) + '</span>' : '';
      var tag = opt.btn ? 'button' : 'div';
      html += '<' + tag + ' class="' + cls + '" data-k="' + k + '" style="--c:' + COL[ci] + '">' + shape(ci) + inner + (opt.reveal && k === q.a ? '<span class="ok">✓</span>' : '') + cnt + '</' + tag + '>';
    });
    return '<div class="opts n' + q.opts.length + (q.kind === 'img4' ? ' img' : '') + '">' + html + '</div>';
  }
  function qHead(q, left, right) {
    var img = q.img ? '<div class="qimg' + (q.wide ? ' wide' : '') + '"><img src="' + esc(q.img) + '" alt=""></div>' : '';
    if (!img && !right && left) return '<div class="qtext' + (q.small ? ' small' : '') + '">' + tx(q.text) + '</div><div class="mid one">' + left + '</div>';
    var mid = (left != null || right != null) ? '<div class="mid"><div class="side l">' + (left || '') + '</div>' + (img || '<div class="sp"></div>') + '<div class="side r">' + (right || '') + '</div></div>' : img;
    return '<div class="qtext' + (q.small ? ' small' : '') + '">' + tx(q.text) + '</div>' + mid;
  }
  function confetti() {
    var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    var x = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight, P = [];
    for (var i = 0; i < 160; i++) P.push({ x: Math.random() * W, y: -Math.random() * H, r: 4 + Math.random() * 6, c: COL[i % 4], vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2, a: Math.random() * 6 });
    var t0 = Date.now();
    (function f() {
      x.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.y += p.vy; p.x += p.vx; p.a += 0.1; x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); x.restore(); });
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

  /* ================= MARKAZ ================= */
  function hub() {
    document.title = T('YHQ viktorina — Yoʻl harakati qoidalari 2026');
    root.className = 'hub';
    root.innerHTML = topbar('YHQ viktorina') + '<main class="wrap">' +
      '<div class="hero"><h1>' + tx('Yoʻl harakati qoidalari boʻyicha viktorina') + '</h1><p>' + tx('Belgilar, chiziqlar, qoidalar va jarimalar boʻyicha Kahoot uslubidagi oʻyinlar. Savollar har safar yangidan tuziladi.') + '</p></div>' +
      '<div class="cards">' +
      card('host', '📺', 'Jonli viktorina', 'Oʻqituvchi ekrani: savollar doskada, oʻquvchilar telefondan kod bilan qoʻshilib javob beradi. Tezlik uchun ball, reyting va shohsupa.') +
      card('join', '📱', 'Oʻyinga qoʻshilish', 'Oʻquvchilar uchun: oʻqituvchi ekranidagi 5 harfli kodni kiriting.') +
      card('team', '👥', 'Jamoaviy oʻyin', 'Bitta ekranda 2–4 jamoa bellashadi. Telefon va internet shart emas.') +
      card('solo', '🎯', 'Yakka oʻyin', 'Oʻzingizni sinang: vaqt, ketma-ket toʻgʻri javoblar uchun bonus, xatolar tahlili.') +
      '</div><p class="note">' + tx('Savollar banki: ' + B.counts.signs + ' ta belgi, ' + B.counts.rules + ' ta qoida savoli, ' + B.counts.marks + ' ta chiziq, ' + B.counts.fines + ' ta jarima. Manba: Yoʻl harakati qoidalari (VM 172-son qarori) va MJtK.') + '</p></main>';
    function card(id, ic, t, d) { return '<button class="card" data-go="' + id + '"><span class="ic">' + ic + '</span><b>' + tx(t) + '</b><small>' + tx(d) + '</small></button>'; }
    root.querySelector('.cards').onclick = function (e) {
      var b = e.target.closest('[data-go]'); if (!b) return;
      var g = b.getAttribute('data-go');
      if (g === 'host') hostSetup(); else if (g === 'join') playJoin(''); else if (g === 'team') teamSetup(); else soloSetup();
    };
  }

  /* ================= JONLI VIKTORINA — O'QITUVCHI ================= */
  var H = null;
  function hostSetup() {
    root.className = 'setup';
    root.innerHTML = topbar('Jonli viktorina', 'viktorina.html') + '<main class="wrap narrow"><div class="panel"><h2>' + tx('Oʻyin sozlamalari') + '</h2>' + settingsForm('h') +
      '<button class="big" id="go">' + tx('Xona ochish') + '</button><p class="note">' + tx('Xona ochilgach, oʻquvchilar telefonda shu sahifani ochib kodni kiritadi yoki QR kodni skanerlaydi.') + '</p></div></main>';
    bindSeg(root);
    $('#go').onclick = function () { var c = readSettings('h'); hostOpen(c); };
  }
  function hostOpen(c) {
    if (!NET) { alert(T('Tarmoq moduli yuklanmadi')); return; }
    H = { c: c, qs: questions(c), players: {}, i: -1, phase: 'lobby', answers: {}, api: null, timer: 0 };
    root.className = 'setup';
    root.innerHTML = topbar('Jonli viktorina', 'viktorina.html') + '<main class="wrap narrow"><div class="panel center"><div class="spin"></div><p>' + tx('Xona ochilmoqda…') + '</p></div></main>';
    NET.host({
      kind: 'yhq',
      onConn: function () { return Object.keys(H.players).length >= 80 ? T('Xona toʻlgan') : true; },
      onJoin: function (id, hello) { addPlayer(id, hello.name); },
      onRejoin: function (id, hello) { if (!H.players[id]) addPlayer(id, hello.name); else { H.players[id].on = true; syncTo(id); refreshCount(); } },
      onMsg: hostMsg,
      onLeave: function (id) { if (H.players[id]) { H.players[id].on = false; refreshCount(); if (H.phase === 'lobby') hostLobby(); } },
      onError: function () { }
    }).then(function (api) {
      H.api = api; H.code = api.code; api.beat('lobby'); hostLobby();
    }).catch(function (e) {
      root.innerHTML = topbar('Jonli viktorina', 'viktorina.html') + '<main class="wrap narrow"><div class="panel center"><p class="err">' + tx('Xona ochib boʻlmadi: ') + esc(e && e.message || '') + '</p><p>' + tx('Internet aloqasini tekshirib, qayta urinib koʻring. Internetsiz «Jamoaviy oʻyin»ni tanlashingiz mumkin.') + '</p><button class="big" id="re">' + tx('Qayta urinish') + '</button></div></main>';
      $('#re').onclick = function () { hostOpen(c); };
    });
  }
  function plist() { return Object.keys(H.players).map(function (k) { return H.players[k]; }); }
  function online() { return plist().filter(function (p) { return p.on; }); }
  function addPlayer(id, name) {
    name = String(name || 'Oʻquvchi').trim().slice(0, 20) || 'Oʻquvchi';
    var base = name, k = 2, names = plist().map(function (p) { return p.name.toLowerCase(); });
    while (names.indexOf(name.toLowerCase()) >= 0) name = base + ' ' + (k++);
    H.players[id] = { id: id, name: name, score: 0, streak: 0, correct: 0, on: true, last: null };
    H.api.send(id, { type: 'w', name: name, n: H.qs.length });
    if (H.phase === 'lobby') { hostLobby(); tone(700, 0.08, 'triangle', 0.1); } else { syncTo(id); refreshCount(); }
  }
  function qMsg() {
    var q = H.qs[H.i], el = Date.now() - H.qStart;
    return { type: 'q', i: H.i, n: H.qs.length, kind: q.kind, text: q.text, img: q.img || '', opts: q.opts, t: H.c.t, el: el, small: q.small ? 1 : 0, wide: q.wide ? 1 : 0 };
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
    var el = $('#acnt'); if (el) el.textContent = Object.keys(H.answers).length + ' / ' + online().length;
    var e2 = $('#acnt2'); if (e2) e2.textContent = Object.keys(H.answers).length;
    var pc = $('#pcnt'); if (pc) pc.textContent = online().length;
  }
  function hostLobby() {
    H.phase = 'lobby';
    var url = (location.protocol === 'file:' ? SITE : location.href.split('#')[0].split('?')[0]) + '?kod=' + H.code;
    var qr = '';
    try { var qq = window.qrcode(0, 'M'); qq.addData(url); qq.make(); qr = qq.createSvgTag({ cellSize: 5, margin: 2, scalable: true }); } catch (e) { }
    var ps = plist();
    root.className = 'game lobby';
    root.innerHTML = '<header class="vbar dark"><b>' + tx('Jonli viktorina') + '</b>' + soundBtn() + '<button class="ib" id="x" title="' + esc(T('Yopish')) + '">✕</button></header>' +
      '<main class="lob"><div class="joinbox"><div class="jl">' + tx('Telefonda oching:') + '<b>' + esc(url.replace(/^https?:\/\//, '').replace(/\?kod=.*/, '')) + '</b>' + tx('Xona kodi:') + '</div>' +
      '<div class="code">' + esc(H.code) + '</div><div class="qr">' + qr + '</div></div>' +
      '<div class="lobr"><div class="pcount"><span id="pcnt">' + ps.length + '</span> ' + tx('oʻquvchi') + '</div>' +
      '<div class="chips">' + (ps.length ? ps.map(function (p) { return '<span class="chip' + (p.on ? '' : ' off') + '" data-id="' + esc(p.id) + '" title="' + esc(T('Chiqarib yuborish uchun bosing')) + '">' + esc(p.name) + '</span>'; }).join('') : '<p class="wait">' + tx('Oʻquvchilar qoʻshilishini kuting…') + '</p>') + '</div>' +
      '<div class="lobinfo">' + tx(H.qs.length + ' ta savol · har biriga ' + H.c.t + ' soniya') + '</div>' +
      '<button class="big" id="st"' + (ps.length ? '' : ' disabled') + '>' + tx('Boshlash') + ' ▶</button></div></main>';
    $('#st').onclick = function () { SFX.start(); hostQuestion(); };
    $('#x').onclick = function () { if (confirm(T('Oʻyin yopilsinmi?'))) { try { H.api.close(); } catch (e) { } H = null; hub(); } };
    root.querySelector('.chips').onclick = function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      var id = c.getAttribute('data-id'), p = H.players[id];
      if (p && confirm(T(p.name + ' oʻyindan chiqarilsinmi?'))) { H.api.kick(id, T('Oʻqituvchi sizni oʻyindan chiqardi')); delete H.players[id]; hostLobby(); }
    };
  }
  function hostQuestion() {
    H.i++; H.phase = 'q'; H.answers = {}; H.qStart = Date.now();
    var q = H.qs[H.i];
    H.api.cast(qMsg()); H.api.beat('q ' + H.i);
    root.className = 'game q';
    root.innerHTML = '<header class="vbar dark"><b>' + (H.i + 1) + ' / ' + H.qs.length + '</b><span class="acnt">' + tx('Javoblar') + ': <b id="acnt">0 / ' + online().length + '</b></span>' + soundBtn() + '<button class="ib" id="sk" title="' + esc(T('Vaqtni toʻxtatish')) + '">⏭</button></header>' +
      '<main class="stage"><div class="qtop">' + qHead(q, '<div id="rg">' + ring(H.c.t, H.c.t) + '</div>', '<div class="ansbox"><b id="acnt2">0</b><span>' + tx('javob') + '</span></div>') + '</div>' + optTiles(q) + '</main>';
    $('#sk').onclick = function () { clearInterval(H.timer); hostReveal(); };
    var lastS = H.c.t;
    H.timer = setInterval(function () {
      var left = H.c.t - (Date.now() - H.qStart) / 1000;
      var rg = $('#rg'); if (rg) rg.innerHTML = ring(left, H.c.t);
      var s = Math.ceil(left); if (s !== lastS) { lastS = s; if (s <= 5 && s > 0) SFX.tick(); }
      if (left <= 0) { clearInterval(H.timer); hostReveal(); }
    }, 200);
  }
  function rankList() { return plist().slice().sort(function (a, b) { return b.score - a.score; }); }
  function hostReveal() {
    if (H.phase !== 'q') return;
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
    root.innerHTML = '<header class="vbar dark"><b>' + (H.i + 1) + ' / ' + H.qs.length + '</b><span class="acnt">' + tx('Toʻgʻri javob berdi') + ': <b>' + counts[q.a] + ' / ' + Math.round(total) + '</b></span>' + soundBtn() + '</header>' +
      '<main class="stage"><div class="qtop">' + qHead(q) + bars + '</div>' + optTiles(q, { reveal: true }) +
      (q.exp ? '<div class="exp">' + tx(q.exp) + '</div>' : '') + '<button class="big next" id="nx">' + tx('Keyingi') + ' ▶</button></main>';
    $('#nx').onclick = hostBoard;
  }
  function hostBoard() {
    H.phase = 'lb';
    var rl = rankList(), last = H.i + 1 >= H.qs.length;
    root.className = 'game lb';
    root.innerHTML = '<header class="vbar dark"><b>' + tx('Reyting') + '</b>' + soundBtn() + '</header><main class="stage"><h2 class="lbh">' + tx(last ? 'Yakuniy natijalar tayyor' : 'Eng yaxshi 5 ta') + '</h2><div class="board">' +
      rl.slice(0, 5).map(function (p, k) { return '<div class="brow"><span class="bk">' + (k + 1) + '</span><span class="bnm">' + esc(p.name) + (p.streak > 1 ? ' <small>🔥' + p.streak + '</small>' : '') + '</span><span class="bsc">' + p.score + '</span></div>'; }).join('') +
      (rl.length ? '' : '<p class="wait">' + tx('Hali ishtirokchi yoʻq') + '</p>') + '</div><button class="big next" id="nx">' + tx(last ? 'Shohsupa' : 'Keyingi savol') + ' ▶</button></main>';
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
    root.innerHTML = '<header class="vbar dark"><b>' + tx('Shohsupa') + '</b>' + soundBtn() + '</header><main class="stage">' + podium(rl) +
      '<div class="board small">' + rl.map(function (p, k) { return '<div class="brow"><span class="bk">' + (k + 1) + '</span><span class="bnm">' + esc(p.name) + '</span><span class="bsc">' + p.correct + '/' + H.qs.length + ' · ' + p.score + '</span></div>'; }).join('') + '</div>' +
      '<div class="row2">' + (window.AndroidBridge ? '' : '<button class="big alt" id="csv">' + tx('Natijalar (CSV)') + '</button>') + '<button class="big alt" id="again">' + tx('Shu xonada yana oʻynash') + '</button><button class="big" id="new">' + tx('Yangi oʻyin') + '</button></div></main>';
    if ($('#csv')) $('#csv').onclick = function () {
      var rows = [['Oʻrin', 'Ism', 'Ball', 'Toʻgʻri javoblar', 'Savollar']].concat(rl.map(function (p, k) { return [k + 1, p.name, p.score, p.correct, H.qs.length]; }));
      var csv = '﻿' + rows.map(function (r) { return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'yhq-viktorina-' + new Date().toISOString().slice(0, 10) + '.csv'; a.click();
    };
    $('#again').onclick = function () { H.qs = questions(H.c); H.i = -1; plist().forEach(function (p) { p.score = 0; p.streak = 0; p.correct = 0; p.last = null; }); H.api.beat('lobby'); plist().forEach(function (p) { H.api.send(p.id, { type: 'w', name: p.name, n: H.qs.length }); }); hostLobby(); };
    $('#new').onclick = function () { try { H.api.close(); } catch (e) { } H = null; hostSetup(); };
  }

  /* ================= JONLI VIKTORINA — O'QUVCHI ================= */
  var P = null;
  function playJoin(code, err) {
    root.className = 'play join';
    var nm = LS.get('vname', '');
    root.innerHTML = topbar('Oʻyinga qoʻshilish', 'viktorina.html') + '<main class="wrap narrow"><form class="panel" id="jf"><h2>' + tx('Oʻyinga qoʻshilish') + '</h2>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<label class="fl">' + tx('Xona kodi (5 harf)') + '<input id="jc" maxlength="5" autocomplete="off" autocapitalize="characters" value="' + esc(code || '') + '" placeholder="ABCDE" class="codein"></label>' +
      '<label class="fl">' + tx('Ismingiz') + '<input id="jn" maxlength="20" autocomplete="nickname" value="' + esc(nm) + '" placeholder="' + esc(T('Masalan: Aziz')) + '"></label>' +
      '<button class="big" id="jb">' + tx('Qoʻshilish') + '</button></form></main>';
    var jc = $('#jc'); jc.oninput = function () { jc.value = jc.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); };
    (code ? $('#jn') : jc).focus();
    $('#jf').onsubmit = function (e) {
      e.preventDefault();
      var c = jc.value.trim(), n = $('#jn').value.trim();
      if (c.length !== 5) return playJoin(c, T('Kod 5 ta harfdan iborat boʻlishi kerak'));
      if (n.length < 2) return playJoin(c, T('Ismingizni yozing'));
      LS.set('vname', n);
      playConnect(c, n);
    };
  }
  function playConnect(code, name) {
    if (!NET) return playJoin(code, T('Tarmoq moduli yuklanmadi'));
    P = { code: code, name: name, state: 'conn', qi: -1, ri: -1, api: null };
    root.className = 'play wait';
    root.innerHTML = '<main class="pmid"><div class="spin"></div><p>' + tx('Ulanmoqda…') + '</p></main>';
    NET.join(code, { name: name }, {
      onMsg: playMsg,
      onBeat: playBeat,
      onClose: function (why) {
        if (!P) return;
        root.className = 'play wait';
        root.innerHTML = '<main class="pmid"><div class="big-ic">' + (why === 'gone' ? '🏁' : '📶') + '</div><h2>' + tx(why === 'gone' ? 'Oʻqituvchi oʻyinni yakunladi' : 'Aloqa uzildi') + '</h2><button class="big" id="rj">' + tx(why === 'gone' ? 'Boshqa oʻyinga qoʻshilish' : 'Qayta ulanish') + '</button></main>';
        $('#rj').onclick = function () { if (why === 'gone') playJoin(''); else playConnect(code, name); };
      }
    }).then(function (api) {
      P.api = api; if (P.state === 'conn') { P.state = 'wait'; playWait(); }
    }).catch(function (e) { P = null; playJoin(code, (e && e.message) || T('Ulanib boʻlmadi')); });
  }
  function playWait() {
    root.className = 'play wait';
    root.innerHTML = '<main class="pmid"><div class="big-ic">✅</div><h2>' + tx('Siz oʻyindasiz!') + '</h2><div class="me">' + esc(P.name) + '</div><p>' + tx('Ismingizni ekranda koʻring. Oʻqituvchi oʻyinni boshlashini kuting.') + '</p></main>';
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
      var why = m.why || T('Xona qabul qilmadi'); P = null;
      root.className = 'play wait'; root.innerHTML = '<main class="pmid"><div class="big-ic">⛔</div><h2>' + esc(why) + '</h2><button class="big" id="rj">' + tx('Orqaga') + '</button></main>';
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
    root.innerHTML = '<main class="pmid">' + (ci >= 0 ? '<div class="pickbig" style="--c:' + COL[ci] + '">' + shape(ci) + '</div><h2>' + tx('Javobingiz qabul qilindi') + '</h2>' : '<div class="big-ic">' + (k === -2 ? '⏰' : '⏳') + '</div><h2>' + tx(k === -2 ? 'Vaqt tugadi' : 'Javob qabul qilingan') + '</h2>') + '<p>' + tx('Natijani kuting…') + '</p></main>';
  }
  function playResult(r) {
    root.className = 'play res ' + (r.ok ? 'good' : 'bad');
    if (r.ok) SFX.good(); else SFX.bad();
    root.innerHTML = '<main class="pmid"><div class="big-ic">' + (r.ok ? '🎉' : (r.none ? '⏰' : '❌')) + '</div><h2>' + tx(r.ok ? 'Toʻgʻri!' : (r.none ? 'Javob bermadingiz' : 'Notoʻgʻri')) + '</h2>' +
      (r.ok ? '<div class="pts">+' + r.pts + '</div>' + (r.streak > 1 ? '<p>🔥 ' + tx(r.streak + ' ta ketma-ket toʻgʻri') + '</p>' : '') : '') +
      (r.exp ? '<p class="pexp">' + tx(r.exp) + '</p>' : '') +
      '<div class="rank">' + tx('Hisobingiz: ') + '<b>' + r.score + '</b>' + (r.rank ? ' · ' + tx(r.rank + '-oʻrin') + (r.of ? ' / ' + r.of : '') : '') + '</div></main>';
  }
  function playEnd(e) {
    root.className = 'play end';
    if (e.rank && e.rank <= 3) { SFX.win(); confetti(); }
    root.innerHTML = '<main class="pmid"><div class="big-ic">' + (['🥇', '🥈', '🥉'][e.rank - 1] || '🏁') + '</div><h2>' + tx('Oʻyin tugadi!') + '</h2><div class="me">' + tx(e.rank + '-oʻrin') + (e.of ? ' / ' + e.of : '') + '</div>' +
      '<div class="rank">' + tx('Ball: ') + '<b>' + e.score + '</b> · ' + tx('Toʻgʻri: ') + e.correct + ' / ' + e.n + '</div><p>' + tx('Oʻqituvchi yangi oʻyin boshlasa, ekran oʻzi yangilanadi.') + '</p></main>';
  }

  /* ================= JAMOAVIY O'YIN (BITTA EKRAN) ================= */
  var TM = null;
  function teamSetup() {
    root.className = 'setup';
    var names = LS.get('vteams', ['1-jamoa', '2-jamoa', '3-jamoa', '4-jamoa']), cnt = LS.get('vteamn', 2);
    var extra = '<div class="fl">' + tx('Jamoalar soni') + '<div class="seg" data-k="tn">' + [2, 3, 4].map(function (k) { return '<button type="button" data-v="' + k + '" class="' + (k === cnt ? 'on' : '') + '">' + k + '</button>'; }).join('') + '</div></div>' +
      '<div class="fl">' + tx('Jamoalar nomi') + '<div class="tnames">' + [0, 1, 2, 3].map(function (k) { return '<input data-t="' + k + '" maxlength="18" value="' + esc(names[k]) + '" style="--c:' + COL[k] + '">'; }).join('') + '</div></div>';
    root.innerHTML = topbar('Jamoaviy oʻyin', 'viktorina.html') + '<main class="wrap narrow"><div class="panel"><h2>' + tx('Jamoaviy oʻyin') + '</h2>' + settingsForm('t', { extra: extra }) + '<button class="big" id="go">' + tx('Boshlash') + ' ▶</button></div></main>';
    bindSeg(root);
    $('#go').onclick = function () {
      var c = readSettings('t'), tn = +root.querySelector('.seg[data-k="tn"] .on').getAttribute('data-v');
      var nm = Array.prototype.map.call(root.querySelectorAll('.tnames input'), function (i, k) { return i.value.trim() || (k + 1) + '-jamoa'; });
      LS.set('vteams', nm); LS.set('vteamn', tn);
      TM = { c: c, qs: questions(c), i: -1, teams: nm.slice(0, tn).map(function (n, k) { return { name: n, score: 0, c: COL[k] }; }) };
      SFX.start(); teamQuestion();
    };
  }
  function teamScores(hl) {
    return '<div class="tscore">' + TM.teams.map(function (t, k) { return '<button class="tchip' + (hl && hl[k] ? ' on' : '') + '" data-tk="' + k + '" style="--c:' + t.c + '"><span>' + esc(t.name) + '</span><b>' + t.score + '</b></button>'; }).join('') + '</div>';
  }
  function teamQuestion() {
    TM.i++; TM.t0 = Date.now(); clearInterval(TM.timer);
    var q = TM.qs[TM.i];
    root.className = 'game q team';
    root.innerHTML = '<header class="vbar dark"><b>' + (TM.i + 1) + ' / ' + TM.qs.length + '</b>' + teamScores() + soundBtn() + '</header>' +
      '<main class="stage"><div class="qtop">' + qHead(q, '<div id="rg">' + ring(TM.c.t, TM.c.t) + '</div>', '') + '</div>' + optTiles(q) + '<button class="big next" id="sh">' + tx('Javobni koʻrsatish') + '</button></main>';
    var lastS = TM.c.t;
    TM.timer = setInterval(function () {
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
      root.innerHTML = '<header class="vbar dark"><b>' + (TM.i + 1) + ' / ' + TM.qs.length + '</b>' + teamScores(got) + soundBtn() + '</header>' +
        '<main class="stage"><div class="qtop">' + qHead(q) + '</div>' + optTiles(q, { reveal: true }) + (q.exp ? '<div class="exp">' + tx(q.exp) + '</div>' : '') +
        '<p class="hint">' + tx('Toʻgʻri topgan jamoalarni belgilang (+1 ball):') + '</p>' +
        '<div class="tpick">' + TM.teams.map(function (t, k) { return '<button class="tbtn' + (got[k] ? ' on' : '') + '" data-tk="' + k + '" style="--c:' + t.c + '">' + (got[k] ? '✓ ' : '') + esc(t.name) + '</button>'; }).join('') + '</div>' +
        '<button class="big next" id="nx">' + tx(TM.i + 1 < TM.qs.length ? 'Keyingi savol' : 'Natijalar') + ' ▶</button></main>';
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
    root.innerHTML = '<header class="vbar dark"><b>' + tx('Natijalar') + '</b>' + soundBtn() + '</header><main class="stage">' + podium(rl) +
      '<div class="row2"><button class="big alt" id="again">' + tx('Yana oʻynash') + '</button><button class="big" id="menu">' + tx('Menyu') + '</button></div></main>';
    $('#again').onclick = function () { TM.qs = questions(TM.c); TM.i = -1; TM.teams.forEach(function (t) { t.score = 0; }); teamQuestion(); };
    $('#menu').onclick = hub;
  }

  /* ================= YAKKA O'YIN ================= */
  var SG = null;
  function soloSetup() {
    root.className = 'setup';
    root.innerHTML = topbar('Yakka oʻyin', 'viktorina.html') + '<main class="wrap narrow"><div class="panel"><h2>' + tx('Yakka oʻyin') + '</h2>' + settingsForm('s') + '<button class="big" id="go">' + tx('Boshlash') + ' ▶</button></div></main>';
    bindSeg(root);
    $('#go').onclick = function () { var c = readSettings('s'); SG = { c: c, qs: questions(c), i: -1, score: 0, streak: 0, best: 0, ok: 0, wrong: [] }; SFX.start(); soloQuestion(); };
  }
  function soloQuestion() {
    SG.i++; SG.t0 = Date.now(); clearInterval(SG.timer);
    var q = SG.qs[SG.i], done = false;
    root.className = 'game q solo';
    root.innerHTML = '<header class="vbar dark"><b>' + (SG.i + 1) + ' / ' + SG.qs.length + '</b><span class="acnt">' + tx('Ball') + ': <b>' + SG.score + '</b>' + (SG.streak > 1 ? ' 🔥' + SG.streak : '') + '</span>' + soundBtn() + '</header>' +
      '<main class="stage"><div class="qtop">' + qHead(q, '<div id="rg">' + ring(SG.c.t, SG.c.t) + '</div>', '') + '</div>' + optTiles(q, { btn: true }) + '<div id="fb"></div></main>';
    var lastS = SG.c.t;
    SG.timer = setInterval(function () {
      var left = SG.c.t - (Date.now() - SG.t0) / 1000, rg = $('#rg'); if (rg) rg.innerHTML = ring(left, SG.c.t);
      var s = Math.ceil(left); if (s !== lastS) { lastS = s; if (s <= 5 && s > 0) SFX.tick(); }
      if (left <= 0) { clearInterval(SG.timer); answer(-1); }
    }, 200);
    root.querySelector('.opts').onclick = function (e) { var b = e.target.closest('.opt'); if (b) answer(+b.getAttribute('data-k')); };
    function answer(k) {
      if (done) return; done = true; clearInterval(SG.timer);
      var ms = Date.now() - SG.t0, ok = k === q.a, pts = 0;
      if (ok) { SG.streak++; SG.ok++; pts = Math.round(1000 * (1 - Math.min(1, ms / (SG.c.t * 1000)) / 2)) + Math.min(500, 100 * (SG.streak - 1)); SG.score += pts; SFX.good(); }
      else { SG.streak = 0; SG.wrong.push({ q: q, k: k }); SFX.bad(); }
      var box = root.querySelector('.opts'); box.outerHTML = optTiles(q, { reveal: true, pick: k });
      $('#fb').innerHTML = '<div class="sfb ' + (ok ? 'good' : 'bad') + '"><b>' + tx(ok ? 'Toʻgʻri! +' + pts : (k < 0 ? 'Vaqt tugadi' : 'Notoʻgʻri')) + '</b>' + (q.exp ? '<span>' + tx(q.exp) + '</span>' : '') + '</div><button class="big next" id="nx">' + tx(SG.i + 1 < SG.qs.length ? 'Keyingi' : 'Natija') + ' ▶</button>';
      $('#nx').onclick = function () { if (SG.i + 1 < SG.qs.length) soloQuestion(); else soloEnd(); };
    }
  }
  function soloEnd() {
    var key = 'vbest_' + SG.c.src, best = LS.get(key, 0), rec = SG.score > best;
    if (rec) LS.set(key, SG.score);
    var pct = Math.round(SG.ok / SG.qs.length * 100);
    if (pct >= 70) { SFX.win(); confetti(); }
    root.className = 'game end solo';
    root.innerHTML = '<header class="vbar dark"><b>' + tx('Natija') + '</b>' + soundBtn() + '</header><main class="stage"><div class="sres"><div class="spct">' + pct + '%</div>' +
      '<p>' + tx(SG.ok + ' / ' + SG.qs.length + ' toʻgʻri · ' + SG.score + ' ball') + '</p><p class="rec">' + tx(rec ? '🏆 Yangi rekord!' : 'Rekord: ' + best + ' ball') + '</p></div>' +
      (SG.wrong.length ? '<h3 class="wh">' + tx('Xatolar ustida ishlash') + '</h3><div class="wlist">' + SG.wrong.map(function (w) {
        var right = w.q.kind === 'img4' ? '<img src="' + esc(w.q.opts[w.q.a]) + '" alt="">' : tx(w.q.opts[w.q.a]);
        return '<div class="witem">' + (w.q.img ? '<img src="' + esc(w.q.img) + '" alt="">' : '') + '<div><div class="wq">' + tx(w.q.text) + '</div><div class="wa">✓ ' + right + '</div>' + (w.q.exp ? '<div class="we">' + tx(w.q.exp) + '</div>' : '') + '</div></div>';
      }).join('') + '</div>' : '') +
      '<div class="row2"><button class="big alt" id="again">' + tx('Qayta oʻynash') + '</button><button class="big" id="menu">' + tx('Menyu') + '</button></div></main>';
    $('#again').onclick = function () { SG = { c: SG.c, qs: questions(SG.c), i: -1, score: 0, streak: 0, ok: 0, wrong: [] }; soloQuestion(); };
    $('#menu').onclick = hub;
  }

  /* ---------- Android «orqaga» tugmasi ---------- */
  window.appBack = function () {
    var inGame = /\b(game|play)\b/.test(root.className) && !/\bjoin\b/.test(root.className);
    if (inGame && !confirm(T('Oʻyindan chiqilsinmi?'))) return true;
    if (root.className === 'hub') { location.href = 'index.html'; return true; }
    try { if (H && H.api) H.api.close(); } catch (e) { }
    try { if (P && P.api) P.api.close(); } catch (e) { }
    clearInterval(TM && TM.timer); clearInterval(SG && SG.timer); clearInterval(H && H.timer);
    H = P = null; hub(); return true;
  };

  /* ---------- ishga tushirish ---------- */
  var kod = (location.search.match(/[?&]kod=([A-Za-z0-9]{5})/) || [])[1];
  if (kod) playJoin(kod.toUpperCase()); else hub();
})();
