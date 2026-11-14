/*!
 * Kuvonch Academy — jamoaviy o'yin va chempionat uchun umumiy dvigatel
 *  - Xona kodi orqali ulanish (MQTT relay: ochiq brokerlar, shifrlangan xabarlar, jonli rejim)
 *  - Taqiqlangan ismlar filtri (KANet.badName)
 *  - Har bir o'yin mavzusida savollar generatori (har safar yangi sonlar)
 *  - Natijani o'qituvchining Google jadvaliga yuborish
 * Ulash: <script src="ka-tarmoq.js"></script>
 */
(function () {
  "use strict";
  if (window.KANet) return;

  var SCRIPT_BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var RESULTS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxeBUPBTqpJ8rw9PH4mW8dlonvIJCjeP9ijTfq84R6MrFqCeIjf04uoQsEgVqne2xYBTA/exec";
  var ALPH = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  /* ---------------- yordamchilar ---------------- */
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sane(m, max) { try { return JSON.stringify(m).length <= max; } catch (e) { return false; } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function isP(n) { if (n < 2) return false; for (var p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; }
  function factor(n) { var f = [], m = n; for (var p = 2; p * p <= m; p++) while (m % p === 0) { f.push(p); m /= p; } if (m > 1) f.push(m); return f; }
  function divCount(n) { var c = 0; for (var i = 1; i <= n; i++) if (n % i === 0) c++; return c; }

  // To'g'ri javob + chalg'ituvchilar -> {q, opts, a}
  function mcq(q, right, wrongs) {
    right = String(right);
    var seen = {}; seen[right] = 1; var w = [];
    for (var i = 0; i < wrongs.length && w.length < 3; i++) { var s = String(wrongs[i]); if (!seen[s]) { seen[s] = 1; w.push(s); } }
    var guard = 0;
    while (w.length < 3 && guard++ < 50) { var n = parseFloat(right); var s2 = isNaN(n) ? right + "?" : String(n + R(-9, 9) || n + 11); if (!seen[s2]) { seen[s2] = 1; w.push(s2); } }
    var opts = shuffle([right].concat(w));
    return { q: q, opts: opts, a: opts.indexOf(right) };
  }
  function near(n, k) { var out = []; k = k || 3; var d = [1, -1, 2, -2, 10, -10, 3, 5]; for (var i = 0; out.length < 6 && i < d.length; i++) out.push(n + d[i]); return shuffle(out); }

  /* ---------------- savol generatorlari ---------------- */
  var GAMES = {
    tub: {
      name: "Tub Sonlar Poygasi", icon: "🏁", color: "#ff7a59",
      gen: function () {
        var t = R(1, 4);
        if (t === 1) {
          var p; do { p = R(11, 199); } while (!isP(p));
          var comp = []; while (comp.length < 3) { var c = R(9, 199); if (!isP(c) && c % 2 === 1 && c % 5 !== 0 && comp.indexOf(c) < 0) comp.push(c); }
          return mcq("Qaysi son tub?", p, comp);
        }
        if (t === 2) {
          var cp; do { cp = R(21, 221); } while (isP(cp) || cp % 2 === 0 || cp % 5 === 0);
          var pr = []; while (pr.length < 3) { var x = R(11, 211); if (isP(x) && pr.indexOf(x) < 0) pr.push(x); }
          return mcq("Qaysi son tub EMAS?", cp, pr);
        }
        if (t === 3) {
          var n = R(20, 180), nx = n + 1; while (!isP(nx)) nx++;
          var nx2 = nx + 1; while (!isP(nx2)) nx2++;
          var pv = n; while (!isP(pv)) pv--;
          return mcq(n + " dan katta eng kichik tub son?", nx, [nx2, pv, nx + 2, nx - 1]);
        }
        var m; do { m = R(12, 300); } while (isP(m) || factor(m).length < 2);
        var f = factor(m), right = f.join("·");
        var fake1 = f.slice(0, -1).concat([f[f.length - 1] + 2]).join("·");
        var fake2 = [2].concat(f.slice(1)).join("·") === right ? f.concat([2]).join("·") : [2].concat(f.slice(1)).join("·");
        var fake3 = (f.length > 2 ? [f[0] * f[1]].concat(f.slice(2)) : [1, m]).join("·");
        return mcq(m + " ni tub ko'paytuvchilarga ajrating", right, [fake1, fake2, fake3]);
      }
    },
    snayper: {
      name: "Matematik Snayper", icon: "🎯", color: "#f4c430",
      gen: function () {
        var op = R(1, 4), a, b, r, q;
        if (op === 1) { a = R(12, 99); b = R(12, 99); r = a + b; q = a + " + " + b; }
        else if (op === 2) { a = R(30, 150); b = R(10, a - 1); r = a - b; q = a + " − " + b; }
        else if (op === 3) { a = R(3, 15); b = R(3, 12); r = a * b; q = a + " × " + b; }
        else { b = R(2, 12); r = R(2, 15); a = b * r; q = a + " ÷ " + b; }
        return mcq(q + " = ?", r, near(r));
      }
    },
    shakl: {
      name: "Shakl Ovchisi", icon: "📐", color: "#4cc9f0",
      gen: function () {
        var t = R(1, 7), a, b;
        if (t === 1) { a = R(3, 15); b = R(2, 12); return mcq("To'g'ri to'rtburchak: " + a + " sm va " + b + " sm. Perimetri?", 2 * (a + b), [a * b, a + b, 2 * a + b, 2 * (a + b) + 2]); }
        if (t === 2) { a = R(3, 15); b = R(2, 12); return mcq("To'g'ri to'rtburchak: " + a + " sm va " + b + " sm. Yuzi (sm²)?", a * b, [2 * (a + b), a * b + a, a * b - b, (a + 1) * b]); }
        if (t === 3) { a = R(30, 90); b = R(20, 150 - a); return mcq("Uchburchakning ikki burchagi " + a + "° va " + b + "°. Uchinchisi?", 180 - a - b, [180 - a, 90 - a + b, 360 - a - b, 180 - a - b + 10]); }
        if (t === 4) { a = R(2, 9); return mcq("Qirrasi " + a + " sm bo'lgan kubning hajmi (sm³)?", a * a * a, [a * a, 6 * a * a, 3 * a, a * a * a + a]); }
        if (t === 5) { a = R(4, 10); return mcq("Qavariq " + a + "-burchak ichki burchaklari yig'indisi?", (a - 2) * 180 + "°", [a * 180 + "°", (a - 1) * 180 + "°", (a - 3) * 180 + "°", a * 90 + "°"]); }
        if (t === 6) { a = R(2, 12); return mcq("Kvadratning perimetri " + 4 * a + " sm. Yuzi (sm²)?", a * a, [4 * a, 2 * a, a * a * 2, (a + 1) * (a + 1)]); }
        var facts = [
          ["Kubning nechta qirrasi bor?", 12, [6, 8, 10]], ["Kubning nechta uchi bor?", 8, [6, 12, 4]],
          ["To'rtburchakli piramidaning nechta yog'i bor?", 5, [4, 6, 8]], ["Uchburchakli prizmaning nechta yog'i bor?", 5, [6, 3, 9]],
          ["Muntazam oltiburchakning ichki burchagi?", "120°", ["108°", "135°", "90°"]], ["Silindrning nechta asosi bor?", 2, [1, 3, 0]],
          ["Konusning nechta uchi bor?", 1, [0, 2, 3]], ["To'g'ri burchak necha gradus?", "90°", ["180°", "45°", "60°"]]
        ];
        var f = pick(facts); return mcq(f[0], f[1], f[2]);
      }
    },
    savat: {
      name: "Sonlar Savati", icon: "🧺", color: "#3fbf7f",
      gen: function () {
        var t = R(1, 5), k, x, w;
        if (t === 1) { k = R(3, 9); x = k * R(4, 20); w = []; while (w.length < 3) { var y = R(10, 180); if (y % k && w.indexOf(y) < 0) w.push(y); } return mcq("Qaysi son " + k + " ga karrali?", x, w); }
        if (t === 2) { var s = R(4, 15); x = s * s; return mcq("Qaysi son to'liq kvadrat?", x, [x + 1, x - 2, (s * s + (s + 1) * (s + 1)) >> 1 | 1]); }
        if (t === 3) { var a = R(1, 5), q = R(2, 4); return mcq("Geometrik progressiya: " + a + ", " + a * q + ", " + a * q * q + ", ?", a * q * q * q, [a * q * q + a * q, a * q * q * 2 + 1, a * q * q * q + q]); }
        if (t === 4) { x = pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 60, 72]); var d = divCount(x); return mcq(x + " sonining nechta natural bo'luvchisi bor?", d, [d - 1, d + 1, d + 2, d - 2]); }
        x = 6 * R(3, 30); w = []; while (w.length < 3) { var z = R(10, 180); if (z % 6 && w.indexOf(z) < 0 && (z % 2 === 0 || z % 3 === 0)) w.push(z); }
        return mcq("Qaysi son ham juft, ham 3 ga karrali?", x, w);
      }
    },
    funksiya: {
      name: "Funksiya Ovchisi", icon: "📈", color: "#a78bfa",
      gen: function () {
        var t = R(1, 6), k, b, m;
        if (t === 1) { k = R(-5, 5) || 2; b = R(-9, 9); m = R(-4, 6); var y = k * m + b; return mcq("y = " + (k === 1 ? "" : k === -1 ? "−" : k < 0 ? "−" + (-k) : k) + "x " + (b < 0 ? "− " + (-b) : "+ " + b) + ", x = " + m + " bo'lsa, y = ?", y, near(y)); }
        if (t === 2) { var c = R(2, 9); return mcq("y = x² − " + c * c + " funksiyaning nollari?", "±" + c, ["±" + c * c, c + " va 0", "±" + (c + 1)]); }
        if (t === 3) { return mcq("Qaysi funksiya kamayuvchi?", pick(["y = −3x + 1", "y = (1/2)ˣ", "y = −x + 5"]), ["y = 2x − 3", "y = 3ˣ", "y = log₂x", "y = √x"]); }
        if (t === 4) { return mcq("Qaysi funksiya juft?", pick(["y = x²", "y = cos x", "y = |x|"]), ["y = x³", "y = sin x", "y = x + 1", "y = tg x"]); }
        if (t === 5) { var p = R(-5, 5), q = R(-5, 5); return mcq("y = (x " + (p < 0 ? "+ " + (-p) : "− " + p) + ")² " + (q < 0 ? "− " + (-q) : "+ " + q) + " parabolaning uchi?", "(" + p + "; " + q + ")", ["(" + (-p) + "; " + q + ")", "(" + q + "; " + p + ")", "(" + p + "; " + (-q) + ")"]); }
        var tr = pick([["sin 30°", "1/2", ["√3/2", "1", "0"]], ["cos 60°", "1/2", ["√3/2", "0", "1"]], ["tg 45°", "1", ["0", "√3", "1/2"]], ["cos 0°", "1", ["0", "−1", "1/2"]], ["log₂ 8", "3", ["4", "2", "8"]], ["log₃ 81", "4", ["3", "27", "9"]], ["√144", "12", ["14", "72", "11"]]]);
        return mcq(tr[0] + " = ?", tr[1], tr[2]);
      }
    },
    arqon: {
      name: "Arqon tortish", icon: "🪢", color: "#ff5c7a",
      gen: function () {
        var t = R(1, 4), a, b;
        if (t === 1) { a = R(2, 9) * 10; b = R(1, 9) * 10; return mcq(b + " ning " + a + "% i = ?", a * b / 100, [a * b / 10, a + b, a * b / 100 + 1]); }
        if (t === 2) { a = R(2, 5); b = R(2, 4); var p = Math.pow(a, b); return mcq(a + (b === 2 ? "²" : b === 3 ? "³" : "⁴") + " = ?", p, [a * b, p + a, Math.pow(a, b - 1)]); }
        if (t === 3) { a = R(3, 12); b = R(3, 12); var c = R(2, 20); return mcq(a + " × " + b + " + " + c + " = ?", a * b + c, [a * (b + c), a * b - c, a * b + c + 10]); }
        return GAMES.snayper.gen();
      }
    }
  };

  function makeQuestions(gameId, n) {
    var g = GAMES[gameId] || GAMES.snayper, out = [], keys = {};
    var guard = 0;
    while (out.length < n && guard++ < n * 20) { var q = g.gen(); if (!keys[q.q]) { keys[q.q] = 1; out.push(q); } }
    return out;
  }

  /* ---------------- tarmoq (MQTT relay) — JONLI REJIM ----------------
   * Avval PeerJS (WebRTC) ishlatilgan edi: uning bepul serveri ishlamay qolsa yoki mobil internet
   * to'g'ridan-to'g'ri ulanishga yo'l bermasa, o'quvchilar ulana olmasdi. Endi xabarlar ochiq MQTT brokerlari orqali o'tadi.
   * Mavzu nomi xona kodidan SHA-256 bilan olinadi, xabarlar AES-GCM bilan shifrlanadi.
   *
   * Jonli rejim (2026-11): o'qituvchi ham, o'quvchi ham BIR VAQTDA barcha ishlayotgan brokerlarga ulanadi va har bir xabar
   * hammasi orqali yuboriladi (ikkinchi nusxalari tashlab yuboriladi). Bitta broker yoki port yopilsa ham aloqa uzilmaydi:
   *  - o'quvchi har 15 soniyada «tirikman» signalini yuboradi, o'qituvchi darhol javob qaytaradi (o'qituvchi varag'i fonda bo'lsa ham);
   *  - aloqa butunlay uzilib qaytsa, o'quvchi o'zi qayta salom beradi; o'qituvchi uni tanimasa «~who» deb so'raydi va o'quvchi qayta kiradi;
   *  - o'qituvchi aloqasi uzilgan paytda yuborilgan xabarlar navbatda turadi va qayta ulanganda yetkaziladi;
   *  - o'qituvchi to'satdan uzilsa, broker xona ma'lumotini o'zi o'chiradi (eski xonaga ulanib qolinmaydi).
   * Tashqi API: host(opts) -> {code, send, broadcast, kick, close, status}, join(code, hello, opts) -> {id, send, close, status}.
   *  host opts.onRejoin(id, hello) — o'quvchi aloqasi tiklangach holatini qayta yuborish uchun (ixtiyoriy);
   *  join opts.onStatus(up, all) — nechta broker orqali ulangani (ixtiyoriy); opts.onClose(why) — why: "gone" = o'qituvchi xonani yopdi;
 *  opts.onBeat(holat) — o'qituvchi yurak urishidagi o'yin holati; ulanish.resync() — holatni qayta so'rash.
 *  host api.cast(msg) — hammaga bitta umumiy xabar; api.beat(holat) — o'yin holatini e'lon qilish. */
  var MQTT_SRC = SCRIPT_BASE + "mqtt.min.js?v=5.16.1";
  // Eski telefonlar (iOS 12–14, eski Android brauzerlari) MQTT 5-versiyasining yangi JS sintaksisini tushunmaydi —
  // ularga eski, mos keluvchi 4-versiya beriladi (API bir xil)
  var MQTT_OLD = SCRIPT_BASE + "vendor/mqtt-4.3.7.min.js";
  // 2 tasi maxsus portda (8084/8884), 2 tasi 443-portda — maktab Wi-Fi yoki mobil operator boshqa portlarni yopsa ham ulanadi.
  // max — broker qabul qiladigan eng katta xabar (undan kattasi shu brokerga yuborilmaydi)
  var BROKERS = (window.KA_BROKERS && window.KA_BROKERS.length ? window.KA_BROKERS : [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt",
    "wss://mqtt.eclipseprojects.io:443/mqtt",
    { url: "wss://public.cloud.shiftr.io", u: "public", p: "public", max: 60000 }
  ]).map(function (b) { return typeof b === "string" ? { url: b } : b; });
  var NS = "kuvonch-ka-v2/";
  var mqttLoading = null;
  // Eski iPhone/Android brauzerlari uchun (iOS 15.3 va undan eski): MQTT kutubxonasi ishlatadigan funksiyalar
  try {
    if (!Array.prototype.at) Object.defineProperty(Array.prototype, "at", { value: function (i) { i = Math.trunc(i) || 0; if (i < 0) i += this.length; return this[i]; }, writable: true, configurable: true });
    if (!Object.hasOwn) Object.hasOwn = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  } catch (e) {}
  function modernJs() { try { new Function("var o={};o?.a;o.b??1;class A{static x=1}"); return true; } catch (e) { return false; } }
  function addScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = src;
      s.onload = function () { if (window.mqtt && window.mqtt.connect) res(); else rej(new Error("Tarmoq kutubxonasi yuklanmadi")); };
      s.onerror = function () { rej(new Error("Internet yo'q yoki kutubxona yuklanmadi")); };
      document.head.appendChild(s);
    });
  }
  function loadMqtt() {
    if (window.mqtt && window.mqtt.connect) return Promise.resolve();
    if (mqttLoading) return mqttLoading;
    var first = modernJs() ? MQTT_SRC : MQTT_OLD;
    mqttLoading = addScript(first).catch(function () {
      // birinchisi ishlamasa — ikkinchi variant (eski yoki yangi)
      return addScript(first === MQTT_SRC ? MQTT_OLD : MQTT_SRC);
    }).catch(function (e) { mqttLoading = null; throw e; });
    return mqttLoading;
  }
  function genCode() { var s = ""; for (var i = 0; i < 5; i++) s += ALPH[Math.floor(Math.random() * ALPH.length)]; return s; }
  function normCode(c) { return String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5); }
  function rid(n) { var a = "abcdefghijkmnpqrstuvwxyz23456789", s = "", r = new Uint8Array(n); crypto.getRandomValues(r); for (var i = 0; i < n; i++) s += a[r[i] % a.length]; return s; }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function b64(u8) { var s = ""; for (var i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }

  // Xona kodi -> {t: mavzu prefiksi, key: AES kaliti}
  function room(code) {
    if (!(window.crypto && crypto.subtle)) return Promise.reject(new Error("Brauzer eski — yangilang yoki boshqa brauzerda oching"));
    var enc = new TextEncoder();
    return Promise.all([
      crypto.subtle.digest("SHA-256", enc.encode("kuvonch-ka|t|" + code)),
      crypto.subtle.digest("SHA-256", enc.encode("kuvonch-ka|k|" + code))
    ]).then(function (h) {
      return crypto.subtle.importKey("raw", h[1], { name: "AES-GCM" }, false, ["encrypt", "decrypt"]).then(function (key) {
        return { t: NS + hex(h[0]).slice(0, 24), key: key };
      });
    });
  }
  function seal(R, obj) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, R.key, new TextEncoder().encode(JSON.stringify(obj))).then(function (ct) {
      var u = new Uint8Array(12 + ct.byteLength); u.set(iv, 0); u.set(new Uint8Array(ct), 12);
      return "e" + b64(u);
    });
  }
  function unseal(R, str) {
    if (str.charAt(0) !== "e") return Promise.reject(new Error("bad"));
    var u = unb64(str.slice(1));
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.subarray(0, 12) }, R.key, u.subarray(12)).then(function (pt) {
      return JSON.parse(new TextDecoder().decode(pt));
    });
  }
  // Xabarlar tartibi buzilmasin: shifrlash/ochish navbat bilan
  function queue() { var q = Promise.resolve(); return function (fn) { q = q.then(fn).catch(function () {}); }; }
  // Yaqinda kelgan xabarlar ro'yxati (boshqa broker orqali kelgan nusxani tanib olish uchun). Kalit — shifrning boshi (tasodifiy IV)
  function lru(max) {
    var m = new Map();
    return { get: function (k) { return m.get(k); }, set: function (k, v) { m.delete(k); m.set(k, v); if (m.size > max) m.delete(m.keys().next().value); } };
  }
  function mconnect(b, will) {
    var o = { clientId: "ka" + rid(14), clean: true, keepalive: 20, reconnectPeriod: 2000, connectTimeout: 10000, resubscribe: true, protocolVersion: 4 };
    if (b.u) { o.username = b.u; o.password = b.p || ""; }
    if (will) o.will = will;
    return window.mqtt.connect(b.url, o);
  }
  function pub(c, b, t, s, retain) {
    if (!c || !c.connected || (b.max && s.length > b.max)) return false;
    try { c.publish(t, s, { qos: 0, retain: !!retain }); return true; } catch (e) { return false; }
  }

  // Xona ochish. opts: {onConn(id, hello) -> true/xato matni, onJoin(id, hello), onRejoin(id, hello), onMsg(id,msg), onLeave(id), onError(e)}
  function host(opts) {
    // opts.code — tok o'chib qolgandan keyin o'sha xonani qayta ochish uchun (telefonlar o'zi qaytadi)
    var code = opts && opts.code && normCode(opts.code).length === 5 ? normCode(opts.code) : genCode();
    return loadMqtt().then(function () { return room(code); }).then(function (R) {
      return new Promise(function (res, rej) {
        var clients = [], conns = {}, peers = {}, seqs = {}, whoT = {}, settled = false, closed = false, timers = [], bseq = Date.now(), pubB = bseq, state = "";
        // tartib raqamlari vaqtdan boshlanadi: xona qayta ochilganda ham telefon yangi xabarlarni «eski» deb tashlab yubormaydi
        var seq0 = Date.now();
        var outQ = queue(), inQ = queue(), seen = lru(4000), backlog = [];
        var TH = R.t + "/h", TA = R.t + "/a", TI = R.t + "/i";
        function pubAll(t, s, retain) { var ok = false; clients.forEach(function (c, bi) { if (pub(c, BROKERS[bi], t, s, retain)) ok = true; }); return ok; }
        function upCount() { return clients.filter(function (c) { return c && c.connected; }).length; }
        // Shaxsiy xabar: o'quvchi so'nggi paytda qaysi brokerlar orqali sado bergan bo'lsa, o'shalarning eng tezkor 3 tasiga
        // (hammasiga emas — 27+ o'quvchida ochiq serverlar xabar oqimini cheklab qo'ymasligi uchun). Bilinmasa — hammasiga.
        function pubTo(id, t, s) {
          var p = peers[id], now = Date.now(), bs = [];
          if (p && p.lb) for (var b in p.lb) if (now - p.lb[b] < 50000 && clients[b] && clients[b].connected && !(BROKERS[b].max && s.length > BROKERS[b].max)) bs.push(+b);
          bs.sort(function (x, y) { return p.lb[y] - p.lb[x]; });
          var ok = false;
          bs.slice(0, 3).forEach(function (bi) { if (pub(clients[bi], BROKERS[bi], t, s)) ok = true; });
          return ok || pubAll(t, s);
        }
        var api = {
          code: code, conns: conns,
          send: function (id, msg, all) { // all: barcha brokerlar orqali (holatni qayta yuborishda — albatta yetib borsin)
            if (!peers[id] || closed) return;
            // _s — tartib raqami: o'quvchi kechikib kelgan eski xabarni tashlab yuboradi (eski versiyalar bu maydonga qaramaydi)
            var m = Object.assign({}, msg); m._s = seqs[id] = (seqs[id] || seq0) + 1;
            outQ(function () {
              return seal(R, m).then(function (s) {
                if (closed) return;
                var t = R.t + "/p/" + id;
                if (!(all ? pubAll(t, s) : pubTo(id, t, s))) { backlog.push([t, s, Date.now()]); if (backlog.length > 800) backlog.shift(); }
              });
            });
          },
          broadcast: function (msg, except) { for (var id in conns) if (id !== except) api.send(id, msg); },
          // Hammaga bir xil xabar (masalan, savol): BITTA shifrlangan xabar umumiy mavzuga — 27 ta alohida xabar o'rniga.
          // _b — umumiy xabarlar tartib raqami; o'quvchi o'tkazib yuborganini yurak urishidagi raqamdan biladi
          cast: function (msg) {
            if (closed) return;
            var m = Object.assign({}, msg); m._b = ++bseq;
            outQ(function () {
              return seal(R, m).then(function (s) {
                if (closed) return;
                if (!pubAll(TA, s)) { backlog.push([TA, s, Date.now()]); if (backlog.length > 800) backlog.shift(); }
                pubB = m._b; // yurak urishi faqat yuborib bo'lingan raqamni aytadi
              });
            });
          },
          // O'yin holati (masalan "3 q", "3 reveal", "end") — yurak urishi bilan hammaga boradi; holat o'zgarsa darhol yuboriladi.
          // Telefon o'z holati bilan solishtiradi: biror xabarni olmagan bo'lsa, o'zi holatni qayta so'raydi (qotib qolmaydi)
          beat: function (st) { state = String(st || ""); outQ(function () { if (!closed) pubAll(TA, hb()); }); }, // navbat bilan — savoldan keyin
          kick: function (id, why) {
            if (!peers[id]) return;
            api.send(id, { type: "kick", why: why || "" });
            delete conns[id];
            setTimeout(function () { if (!conns[id]) delete peers[id]; }, 1500);
          },
          status: function () { return { up: upCount(), all: BROKERS.length }; },
          // o'quvchidan oxirgi marta qachon xabar kelgan (ms); -1 — bunday o'quvchi tarmoqda yo'q
          seen: function (id) { var p = peers[id], m = 0; if (!p || !p.lb) return -1; for (var b in p.lb) if (p.lb[b] > m) m = p.lb[b]; return m; },
          close: function () {
            if (closed) return;
            outQ(function () {
              closed = true; timers.forEach(clearInterval);
              clients.forEach(function (c, bi) {
                if (!c) return;
                pub(c, BROKERS[bi], TA, "~gone"); pub(c, BROKERS[bi], TI, "", true);
                setTimeout(function () { try { c.end(true); } catch (e) {} }, 600);
              });
            });
          }
        };
        function leave(id) {
          if (!peers[id]) return;
          delete peers[id];
          if (conns[id]) { delete conns[id]; if (opts.onLeave) opts.onLeave(id); }
        }
        function info(c, bi) { pub(c, BROKERS[bi], TI, "~on " + Date.now(), true); }
        function hb() { return "~hb " + pubB + (state ? " " + state : ""); }
        function flush() { // aloqa uzilgan paytda yuborilmay qolgan xabarlar (1 daqiqadan eskilari emas)
          if (!backlog.length || !upCount()) return;
          var t = Date.now(), b = backlog; backlog = [];
          b.forEach(function (x) { if (t - x[2] < 60000) pubAll(x[0], x[1]); });
        }
        function who(id, bi) { // tanimagan o'quvchidan xabar keldi — qayta salom berishini so'raymiz
          var t = Date.now(); if (t - (whoT[id] || 0) < 4000) return; whoT[id] = t;
          pub(clients[bi], BROKERS[bi], R.t + "/p/" + id, "~who");
        }
        function handle(bi, str) {
          if (closed) return;
          if (str.slice(0, 5) === "~bye ") { // "~bye id n [broker]": o'quvchi chiqdi yoki bitta broker bilan aloqasi uzildi
            var a = str.split(" ");
            inQ(function () {
              var p0 = peers[a[1]]; if (!p0 || p0.n !== a[2]) return;
              if (a.length < 4) return leave(a[1]);
              delete p0.lb[a[3]];
              if (!Object.keys(p0.lb).length) leave(a[1]); // boshqa hech qaysi broker orqali ulanmagan
            });
            return;
          }
          if (str.length > 8000 || str.charAt(0) !== "e") return;
          var key = str.slice(0, 40), was = seen.get(key);
          if (was !== undefined) { if (was && peers[was]) peers[was].lb[bi] = Date.now(); return; } // boshqa broker orqali kelgan nusxa
          seen.set(key, "");
          inQ(function () {
            return unseal(R, str).then(function (env) {
              if (closed || !env || typeof env !== "object" || typeof env.f !== "string" || env.f.length > 40) return;
              var id = env.f, msg = env.m, p = peers[id];
              seen.set(key, id);
              if (!msg || typeof msg !== "object" || !sane(msg, 4000)) return;
              var nowT = Date.now();
              if (p && p.n !== env.n) { // shu o'quvchi sahifani yangilab qayta kirdi
                if (msg.type !== "hello") return;
                leave(id); p = null;
              }
              if (!p) {
                if (msg.type !== "hello") { who(id, bi); return; }
                p = peers[id] = { n: env.n, ok: false, win: nowT, cnt: 0, lb: {}, live: false };
              }
              p.lb[bi] = nowT;
              if (nowT - p.win > 1000) { p.win = nowT; p.cnt = 0; }
              if (++p.cnt > 30) return; // juda tez-tez xabar — e'tiborsiz
              if (msg.type === "~p") { p.live = true; if (p.ok) pub(clients[bi], BROKERS[bi], R.t + "/p/" + id, hb()); return; }
              if (!p.ok) {
                if (msg.type !== "hello") return;
                var ok = (msg.name != null && badName(msg.name)) || (opts.onConn ? opts.onConn(id, msg) : true);
                p.ok = true;
                if (ok !== true) {
                  api.send(id, { type: "reject", why: ok });
                  setTimeout(function () { if (peers[id] === p) delete peers[id]; }, 1500);
                  return;
                }
                conns[id] = { peer: id, open: true };
                if (opts.onJoin) opts.onJoin(id, msg);
                return;
              }
              if (msg.type === "hello") { if (conns[id] && opts.onRejoin) opts.onRejoin(id, msg); return; } // aloqa tiklandi
              if (opts.onMsg) opts.onMsg(id, msg);
            });
          });
        }
        var to = setTimeout(function () {
          if (settled) return; settled = true; api.close();
          var e = new Error("Tarmoqqa ulanib bo'lmadi"); e.type = "network";
          if (opts.onError) opts.onError(e);
          rej(e);
        }, 20000);
        BROKERS.forEach(function (b, bi) {
          var c;
          // o'qituvchi to'satdan uzilsa — broker xona ma'lumotini o'chiradi (qayta ulanganda yana yoziladi)
          try { c = mconnect(b, { topic: TI, payload: "", qos: 0, retain: true }); } catch (e) { return; }
          clients[bi] = c;
          c.on("connect", function () {
            if (closed) return;
            c.subscribe(TH, { qos: 0 });
            info(c, bi); flush();
            if (!settled) { settled = true; clearTimeout(to); res(api); }
          });
          c.on("message", function (topic, payload) { handle(bi, payload.toString()); });
          c.on("error", function () {});
        });
        // o'quvchilarga "o'qituvchi ekrani ochiq" signali va xona ma'lumotini yangilab turish
        timers.push(setInterval(function () { pubAll(TA, hb()); }, 5000));
        timers.push(setInterval(function () { clients.forEach(function (c, bi) { info(c, bi); }); }, 60000));
        // jonli o'quvchi 50 soniya hech qaysi broker orqali sado bermasa — chiqib ketgan (telefon o'chgan/uxlagan)
        timers.push(setInterval(function () {
          var t = Date.now();
          Object.keys(peers).forEach(function (id) {
            var p = peers[id]; if (!p.ok || !p.live) return;
            for (var b in p.lb) if (t - p.lb[b] > 50000) delete p.lb[b];
            if (!Object.keys(p.lb).length) inQ(function () { if (peers[id] === p) leave(id); });
          });
        }, 5000));
        window.addEventListener("pagehide", function () { api.close(); });
      });
    });
  }

  // Xonaga qo'shilish. hello: {name, ...}; opts: {onMsg(msg), onClose(why), onStatus(up, all)}
  var SELF_KEY = "ka.tarmoq.self.v2";
  function selfId(code) {
    var m = {};
    try { m = JSON.parse(sessionStorage.getItem(SELF_KEY) || "{}") || {}; } catch (e) {}
    if (!m[code]) { m[code] = rid(10); try { sessionStorage.setItem(SELF_KEY, JSON.stringify(m)); } catch (e) {} }
    return m[code];
  }
  function join(code, hello, opts) {
    code = normCode(code); opts = opts || {};
    var bn = hello && hello.name != null ? badName(hello.name) : "";
    if (bn) return Promise.reject(new Error(bn));
    return loadMqtt().then(function () { return room(code); }).then(function (R) {
      return new Promise(function (res, rej) {
        var id = selfId(code), n = rid(8), settled = false, dead = false, found = false;
        var cl = [], st = []; // st: 0 ulanmoqda, 1 ulangan (xona qidirilmoqda), 2 xona shu brokerda — ishlatiladi, 3 ulanib bo'lmadi
        var lastHost = Date.now(), downSince = 0, watch = 0, probe = 0, ping = 0, hiT = 0, outQ = queue(), inQ = queue();
        var seen = lru(600), lastS = 0, lastB = -1, helloStr = "", whoAt = 0, syncAt = 0, outbox = [], needSync = false; // needSync: holatni qayta olguncha salom berib turamiz
        var hi = Object.assign({ type: "hello" }, hello);
        var TP = R.t + "/p/" + id, TA = R.t + "/a", TI = R.t + "/i", TH = R.t + "/h";
        function live() { var a = []; cl.forEach(function (c, bi) { if (c && st[bi] === 2 && c.connected) a.push(bi); }); return a; }
        function status() { if (opts.onStatus && !dead) try { opts.onStatus(live().length, BROKERS.length); } catch (e) {} }
        function pubLive(s, only) { var ok = false; (only != null ? [only] : live()).forEach(function (bi) { if (pub(cl[bi], BROKERS[bi], TH, s)) ok = true; }); return ok; }
        function send(m, only) {
          if (dead) return;
          outQ(function () {
            return seal(R, { f: id, n: n, m: m }).then(function (s) {
              if (dead) return;
              // hech qaysi broker ulanmagan bo'lsa — navbatda turadi (javob yo'qolmasin)
              if (!pubLive(s, only) && only == null && m.type !== "~p") { outbox.push(s); if (outbox.length > 30) outbox.shift(); }
            });
          });
        }
        function flushOut() { if (!outbox.length || !live().length) return; var o = outbox; outbox = []; o.forEach(function (s) { pubLive(s); }); }
        function resync() { // holatni qayta so'rash (ko'pi bilan 4 soniyada bir marta)
          var t = Date.now(); if (dead || !settled || t - syncAt < 4000) return;
          syncAt = t; needSync = true; sayHello(true);
        }
        function sayHello(fresh, only) { // fresh: yangi shifr — o'qituvchi uni takror deb tashlab yubormasin
          if (dead) return;
          outQ(function () {
            if (!fresh && helloStr) { pubLive(helloStr, only); return; }
            return seal(R, { f: id, n: n, m: hi }).then(function (s) { if (!fresh) helloStr = s; if (!dead) pubLive(s, only); });
          });
        }
        // Telefon ekrani o'chib-yonsa yoki boshqa ilovaga o'tib qaytilsa: taymerlar to'xtab qolgan bo'ladi —
        // "o'qituvchi javob bermayapti" deb darhol uzib qo'ymaslik uchun hisobni yangidan boshlaymiz va darhol "tirikman" deymiz
        function onVis() {
          if (dead || document.visibilityState !== "visible") return;
          lastHost = Date.now(); downSince = 0;
          if (settled) send({ type: "~p" });
        }
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("pageshow", onVis);
        function kill() {
          dead = true; clearInterval(watch); clearInterval(ping); clearInterval(hiT); clearTimeout(probe); clearTimeout(to);
          document.removeEventListener("visibilitychange", onVis); window.removeEventListener("pageshow", onVis);
          cl.forEach(function (c) { try { if (c) c.end(true); } catch (e) {} });
        }
        function fail(msg) { if (settled) return; settled = true; kill(); rej(new Error(msg)); }
        function bye() { pubLive("~bye " + id + " " + n); }
        function lost(why) { // aloqa butunlay yo'qoldi
          if (dead) return;
          if (!settled) return fail("Ulanib bo'lmadi: aloqa uzildi");
          bye(); kill(); if (opts.onClose) opts.onClose(why || "");
        }
        function onPeerMsg(s) {
          if (dead) return;
          if (s === "~hb" || s.slice(0, 4) === "~hb ") { // yurak urishi: "~hb <umumiy xabarlar soni> <o'yin holati>"
            lastHost = Date.now();
            if (s.length > 4 && settled) {
              var sp = s.slice(4).split(" "), nb = +sp[0];
              if (lastB < 0) lastB = nb;            // birinchi marta — boshlang'ich nuqta
              else if (nb > lastB) setTimeout(function () { if (!dead && lastB < nb) { lastB = nb; resync(); } }, 2000); // umumiy xabar (savol) 2 s ichida kelmadi — holatni qayta so'raymiz
              if (opts.onBeat) try { opts.onBeat(sp.slice(1).join(" ")); } catch (e) {}
            }
            return;
          }
          if (s === "~gone") { if (settled) lost("gone"); else fail("O'qituvchi xonani yopgan"); return; }
          if (s === "~who") { // o'qituvchi bizni tanimadi (masalan, telefon uzoq uxlagan) — qayta salom beramiz
            var tw = Date.now(); lastHost = tw;
            if (tw - whoAt > 3000) { whoAt = tw; needSync = settled; sayHello(true); }
            return;
          }
          if (s.charAt(0) !== "e") return;
          var k = s.slice(0, 40); if (seen.get(k)) return; seen.set(k, 1); // boshqa broker orqali kelgan nusxa
          inQ(function () {
            return unseal(R, s).then(function (msg) {
              if (dead || !msg || typeof msg !== "object" || !sane(msg, 300000)) return;
              lastHost = Date.now(); needSync = false;
              if (typeof msg._s === "number") { if (msg._s <= lastS) return; lastS = msg._s; } // kechikib kelgan eski xabar
              if (typeof msg._b === "number") { if (msg._b <= lastB) return; lastB = msg._b; } // umumiy xabar: takror yoki eski
              if (!settled) {
                if (msg.type === "reject") return fail(msg.why || "Xona qabul qilmadi");
                settled = true; clearTimeout(to); clearTimeout(probe); clearInterval(hiT);
                res({
                  id: id, send: function (m) { send(m); },
                  status: function () { return { up: live().length, all: BROKERS.length }; },
                  resync: resync,
                  close: function () { bye(); dead = true; setTimeout(kill, 300); }
                });
                watch = setInterval(function () {
                  if (dead) return;
                  var t = Date.now();
                  if (!live().length) { if (!downSince) downSince = t; if (t - downSince > 40000) lost(); }
                  else { downSince = 0; if (t - lastHost > 45000) lost(); } // o'qituvchi ekrani javob bermayapti
                  status();
                }, 3000);
                ping = setInterval(function () { if (needSync) sayHello(true); else send({ type: "~p" }); }, 15000);
                send({ type: "~p" }); status();
              }
              if (opts.onMsg) opts.onMsg(msg);
              if (msg.type === "kick") kill();
            });
          });
        }
        function activate(bi) { // shu brokerda xona bor — undan ham foydalanamiz (bittasi uzilsa, boshqasi ishlaydi)
          var c = cl[bi]; if (!c || st[bi] === 2 || dead) return;
          st[bi] = 2;
          if (!found) {
            found = true; clearTimeout(probe);
            // salom yo'qolib qolsa — 6 soniyada yana yuboramiz
            hiT = setInterval(function () { if (dead || settled) { clearInterval(hiT); return; } sayHello(true); }, 6000);
          }
          try { c.unsubscribe(TI); } catch (e) {}
          c.subscribe([TP, TA], { qos: 0 }, function () {
            if (dead) return;
            if (settled) { send({ type: "~p" }, bi); flushOut(); } else sayHello(false, bi);
            status();
          });
        }
        function armProbe() { // ulangan brokerlarda xona yo'q — hali ulanayotganlarini kutamiz
          clearTimeout(probe);
          probe = setTimeout(function () {
            if (found || dead) return;
            if (st.some(function (x) { return x === 0; })) return armProbe(); // umumiy 25 soniyalik chegara bor
            fail("Bunday kodli xona topilmadi. Kodni tekshiring yoki o'qituvchi ekrani ochiqligiga ishonch hosil qiling.");
          }, 8000);
        }
        var to = setTimeout(function () {
          var any = st.some(function (x) { return x === 1 || x === 2; });
          fail(found ? "Xona javob bermadi. O'qituvchi ekrani ochiqligini va kodni tekshiring." :
            any ? "Bunday kodli xona topilmadi. Kodni tekshiring yoki o'qituvchi ekrani ochiqligiga ishonch hosil qiling." :
            "Internetga ulanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.");
        }, 25000);
        BROKERS.forEach(function (b, bi) {
          var c;
          // kutilmaganda uzilsak — broker o'qituvchiga "shu broker orqali aloqa uzildi" deb xabar beradi
          try { c = mconnect(b, { topic: TH, payload: "~bye " + id + " " + n + " " + bi, qos: 0, retain: false }); } catch (e) { st[bi] = 3; return; }
          cl[bi] = c; st[bi] = 0;
          c.on("connect", function () {
            if (dead) return;
            if (st[bi] === 2) { // shu broker qayta ulandi
              var wasDown = !live().some(function (x) { return x !== bi; });
              c.subscribe([TP, TA], { qos: 0 }, function () {
                if (dead) return;
                if (settled) { if (wasDown) { needSync = true; sayHello(true); } else send({ type: "~p" }, bi); } // hammasi uzilgan bo'lsa — holatni qayta so'raymiz
                flushOut(); status();
              });
              return;
            }
            st[bi] = 1;
            c.subscribe(TI, { qos: 0 });
            if (!found) armProbe();
          });
          c.on("close", function () { if (st[bi] === 0) st[bi] = 3; status(); });
          c.on("message", function (topic, payload) {
            if (dead) return;
            var s = payload.toString();
            if (topic === TI) { if (s.slice(0, 4) === "~on ") activate(bi); return; }
            if (st[bi] === 2) onPeerMsg(s);
          });
          c.on("error", function () {});
        });
      });
    });
  }

  /* ---------------- taqiqlangan ismlar (o'zbek, ingliz va rus so'kinishlari, haqoratlar) ----------------
   * Kirill yoki lotin, raqam bilan yashirilgan (f4ck, 5uka), harfi cho'zilgan (fuuuck), bo'lib yozilgan (f u c k, s.u.k.a)
   * yoki kirill harfi aralashtirilgan (fuсk) bo'lsa ham topiladi. Haqiqiy ismlar (Sikandar, Nigora, Shebanov…) bloklanmasligi uchun
   * qisqa o'zaklar faqat so'z boshida yoki butun so'z sifatida tekshiriladi. */
  var BAD_MSG = "Bu ismni ishlatib bo'lmaydi — o'z ismingizni yozing";
  // so'z ichida uchrasa
  var BAD_SUB = "fuck motherf bitch biatch asshole dickhead pussy whore slut cunt porn penis vagin blowjob handjob jerkoff wanker bastard retard faggot nigger rapist bullshit dumbass " +
    "jalab jalap djalab qanjiq dalbayob dalbayop dolbayob dolboyob dolbaeb dalbaeb dolboeb dalboyob itvachcha haromzoda haramzoda haromi fohisha fahisha fohsha gandon qo'toq kutak " +
    "onangni onangga ko'tingni ko'tinga ko'tingga sikay sikaman sikdim sikib sikish sikvor sikaver siktir sikil " +
    "blyat blyad bliat bliad pizd zaebal nahuy nahui pohuy pidaras pidoras pidaraz pederast suchka shlyuh shluh";
  // so'z shu bilan boshlansa
  var BAD_PRE = "shit dick cock sex nude horny hitler ahmoq ahmaq tentak eshak cho'chqa to'ng'iz la'nat debil " +
    "pidar pidor pider mudak mudil huyl huyo huev huet eban ebat yeban yebat yoban govn";
  // butun so'z bo'lsa
  var BAD_EXACT = "fk fck fuk wtf stfu kys nazi rape tits idiot stupid loser moron nigga niga seks seksi dildo dildos boobs boobies titties " +
    "jinni maymun sik sikkan skay skey skaman harom suka suki blya huy hui huj chmo jopa dermo yob";
  var CYR = { "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sh", "ъ": "", "ы": "i", "ь": "", "э": "e", "ю": "yu", "я": "ya", "ў": "o", "қ": "q", "ғ": "g", "ҳ": "h", "і": "i", "ә": "a", "ө": "o", "ү": "u", "ң": "n", "ұ": "u", "һ": "h" };
  // lotin harfiga o'xshash kirill harflari (fuсk — "с" kirillcha)
  var HOMO = { "а": "a", "в": "b", "е": "e", "ё": "e", "к": "k", "м": "m", "н": "h", "о": "o", "р": "p", "с": "c", "т": "t", "у": "y", "х": "x", "і": "i", "ј": "j", "ѕ": "s" };
  var LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "!": "i", "|": "i", "€": "e" };
  function nmTokens(s, map) {
    s = String(s || "").toLowerCase().replace(/[Ѐ-ӿ]/g, function (c) { var r = map[c]; return r != null ? r : c; });
    try { s = s.normalize("NFKD").replace(/[̀-ͯ]/g, ""); } catch (e) {}
    s = s.replace(/[0134578@$!|€]/g, function (c) { return LEET[c]; }).replace(/['`´ʻʼ‘’]/g, "")
      .replace(/ı/g, "i").replace(/q/g, "k").replace(/x/g, "h").replace(/w/g, "v");
    function sq(x) { return x.replace(/(.)\1+/g, "$1"); }
    var w = s.split(/[^a-z]+/).filter(Boolean), out = w.map(sq), run = "";
    // bo'lib yozilgan so'z (f u c k, fu-ck): ketma-ket qisqa bo'laklarni birlashtiramiz
    w.forEach(function (x) { if (x.length <= 2) run += x; else { if (run.length > 2) out.push(sq(run)); run = ""; } });
    if (run.length > 2) out.push(sq(run));
    return out;
  }
  var BADS = null, BADP, BADE;
  function badName(s) {
    if (!s) return "";
    if (!BADS) {
      var nl = function (str) { return str.split(" ").map(function (x) { return nmTokens(x, CYR)[0]; }).filter(Boolean); };
      BADS = nl(BAD_SUB); BADP = nl(BAD_PRE); BADE = {}; nl(BAD_EXACT).forEach(function (x) { BADE[x] = 1; });
    }
    s = String(s);
    var toks = nmTokens(s, CYR);
    if (/[Ѐ-ӿ]/.test(s)) toks = toks.concat(nmTokens(s, HOMO));
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i], j;
      if (BADE[t]) return BAD_MSG;
      for (j = 0; j < BADP.length; j++) if (t.indexOf(BADP[j]) === 0) return BAD_MSG;
      for (j = 0; j < BADS.length; j++) if (t.indexOf(BADS[j]) > -1) return BAD_MSG;
    }
    return "";
  }

  /* ---------------- shaxs va natija ---------------- */
  function identity() {
    var n = "", g = "";
    try { var idn = JSON.parse(localStorage.getItem("mq_identity") || "null"); if (idn) { n = idn.name || ""; g = idn.group || ""; } } catch (e) {}
    try { var id = localStorage.getItem("ka.joriy.v1"); var db = JSON.parse(localStorage.getItem("ka.akkountlar.v1") || "{}"); if (id && db[id]) { n = db[id].name || n; g = db[id].group || g; } } catch (e) {}
    return { name: n, group: g };
  }
  function saveIdentity(name, group) { try { localStorage.setItem("mq_identity", JSON.stringify({ name: name, group: group })); } catch (e) {} }
  function postResult(p) {
    return fetch(RESULTS_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p) }).catch(function () {});
  }
  function joinUrl(page, code) { var u = location.href.split("#")[0].split("?")[0]; u = u.replace(/[^/]*$/, page); return u + "?kod=" + code; }

  window.KANet = {
    GAMES: GAMES, makeQuestions: makeQuestions, host: host, join: join, normCode: normCode, badName: badName,
    identity: identity, saveIdentity: saveIdentity, postResult: postResult, esc: esc, shuffle: shuffle, joinUrl: joinUrl
  };
})();
