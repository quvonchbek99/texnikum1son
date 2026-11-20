/* Fan viktorinasi — savollar banki (texnikum1son.uz)
 * Har bir fan faqat o'z savollari bilan ishlaydi:
 *   data/test/<kalit>.json   — fanning savollar banki (build.py yig'adi: o'qituvchi/metodist savollari + fanning virtual laboratoriyasi)
 *   agent/t/<majmua>.json    — Kuvi agent (GitHub) shu fanning majmuasidan olgan va tuzgan testlar (sahifa ochilganda qo'shiladi)
 *   meros                    — amaliyot fanlari: mutaxassislikning kasbiy fanlari savollari (har biri alohida mavzu)
 * Savol: [savol, to'g'ri javob, [xato javoblar], izoh?, rasm?] */
(function (g) {
  'use strict';
  var BASE = '../';
  function noop() { }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function getJSON(u) {
    return fetch(u, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[ʻʼ‘’`´'"«»“”.,;:!?()\-–—\s]+/g, ' ').trim(); }
  function valid(q) {
    return Array.isArray(q) && q[0] && q[1] != null && Array.isArray(q[2]) && q[2].length >= 1;
  }

  var B = { bank: null, topics: [], key: '' };
  var MANBA = { t: 'Savollar banki', lab: 'Virtual laboratoriya', majmua: 'Majmuadagi test', ai: 'Kuvi agent (majmuadan)', fan: 'Kasbiy fan' };

  function load(key) {
    B.key = key; B.topics = [];
    return getJSON(BASE + 'data/test/' + encodeURIComponent(key) + '.json').then(function (b) {
      B.bank = b;
      (b.mavzular || []).forEach(function (t) {
        var q = (t.q || []).filter(valid);
        if (q.length) B.topics.push({ id: t.id, nomi: t.nomi, manba: t.manba || 't', q: q });
      });
      var jobs = [];
      // amaliyot: mutaxassislik kasbiy fanlari — har biri bitta mavzu
      (b.meros || []).forEach(function (k) {
        jobs.push(getJSON(BASE + 'data/test/' + encodeURIComponent(k) + '.json').then(function (x) {
          var all = [];
          (x.mavzular || []).forEach(function (t) { all = all.concat((t.q || []).filter(valid)); });
          if (all.length) B.topics.push({ id: 'f:' + k, nomi: x.nomi, manba: 'fan', q: all });
        }).catch(noop));
      });
      // Kuvi agent: shu fanning majmualaridan olingan testlar
      jobs.push(getJSON(BASE + 'agent/index.json').then(function (ix) {
        var js = [];
        Object.keys(ix || {}).forEach(function (yk) {
          var p = yk.split('|');
          var ok = b.yonalish ? (p[0] === b.yonalish && p[1] === b.fan) : p[1] === b.fan;
          if (!ok) return;
          (ix[yk] || []).forEach(function (m) {
            if (!m.t) return;
            js.push(getJSON(BASE + 'agent/t/' + encodeURIComponent(m.id) + '.json').then(function (t) {
              (t.mavzular || []).forEach(function (mv, i) {
                var q = (mv.q || []).filter(valid);
                if (q.length) B.topics.push({ id: 'm:' + m.id + ':' + i, nomi: mv.nomi, manba: mv.manba || 'majmua', q: q, oqituvchi: t.oqituvchi || m.oqituvchi || '' });
              });
            }).catch(noop));
          });
        });
        return Promise.all(js);
      }).catch(noop));
      return Promise.all(jobs).then(function () {
        // tartib: majmua testlari va savollar banki oldinda, laboratoriya oxirida
        var w = { majmua: 0, ai: 1, t: 2, fan: 3, lab: 4 };
        B.topics.sort(function (a, b2) { return (w[a.manba] == null ? 2 : w[a.manba]) - (w[b2.manba] == null ? 2 : w[b2.manba]); });
        return B;
      });
    });
  }
  function total() { return B.topics.reduce(function (s, t) { return s + t.q.length; }, 0); }
  function sources() {
    var a = [['aralash', 'Aralash — barcha mavzulardan (' + total() + ' ta savol)']];
    B.topics.forEach(function (t) { a.push([t.id, t.nomi + ' (' + t.q.length + ')']); });
    return a;
  }
  function manbalar() {
    var s = {}, out = [];
    B.topics.forEach(function (t) { var k = MANBA[t.manba] || t.manba; s[k] = (s[k] || 0) + t.q.length; });
    Object.keys(s).forEach(function (k) { out.push([k, s[k]]); });
    return out;
  }

  function toQ(r, tf, topic) {
    var s = String(r[0]), right = String(r[1]), wr = r[2].map(String).filter(function (x) { return x !== right; });
    var exp = r[3] ? String(r[3]) : '', img = r[4] ? String(r[4]) : '';
    var key = norm(s) + '|' + norm(right);
    if (tf && wr.length) {
      var truth = Math.random() < 0.5, shown = truth ? right : pick(wr);
      return { kind: 'tf', text: s.replace(/[\s?:]+$/, '') + ' — Javob: «' + shown + '». Toʻgʻrimi?', opts: ['Toʻgʻri', 'Notoʻgʻri'], a: truth ? 0 : 1,
        exp: exp || ('Toʻgʻri javob: ' + right), img: img, key: key, tid: topic.id, small: s.length > 140 ? 1 : 0 };
    }
    var opts = shuffle([right].concat(shuffle(wr).slice(0, 3)));
    var long = s.length > 140 || opts.some(function (o) { return o.length > 70; });
    return { kind: 'mc', text: s, opts: opts, a: opts.indexOf(right), exp: exp, img: img, key: key, tid: topic.id, small: long ? 1 : 0, right: right };
  }

  /* src: 'aralash' | mavzu id; n: savollar soni (0 — hammasi); mix: 'aralash' | 'mc' | 'tf' */
  function make(src, n, opts) {
    opts = opts || {};
    var mix = opts.mix || 'aralash';
    var tops = src === 'aralash' ? B.topics.slice() : B.topics.filter(function (t) { return t.id === src; });
    if (!tops.length) tops = B.topics.slice();
    var max = tops.reduce(function (s, t) { return s + t.q.length; }, 0);
    if (!n || n > max) n = max;
    var decks = shuffle(tops).map(function (t) { return { t: t, d: shuffle(t.q) }; });
    var out = [], used = {}, guard = 0;
    while (out.length < n && guard++ < n * 40) {
      var live = decks.filter(function (x) { return x.d.length; });
      if (!live.length) break;
      // aralash: mavzular navbatma-navbat (har mavzudan teng ulush), katta mavzular biroz ko'proq
      var dk = live[out.length % live.length];
      if (src === 'aralash' && Math.random() < 0.3) dk = pick(live);
      var r = dk.d.pop(), tf = mix === 'tf' || (mix === 'aralash' && Math.random() < 0.18);
      var q = toQ(r, tf, dk.t);
      if (used[q.key]) continue;
      used[q.key] = 1; out.push(q);
    }
    return out;
  }
  function topicName(id) { var t = B.topics.filter(function (x) { return x.id === id; })[0]; return t ? t.nomi : ''; }

  g.FanBank = { load: load, sources: sources, make: make, shuffle: shuffle, total: total, manbalar: manbalar, topicName: topicName, data: B, getJSON: getJSON, BASE: BASE };
})(window);
