/*!
 * Kuvonch Academy — umumiy AI moduli (butun sayt uchun)
 *  - Gemini: Firebase AI Logic + App Check (reCAPTCHA, faqat kuvonch.uz uchun)
 *  - Bulut ovozi: Gemini TTS — telefonda o'zbekcha ovoz bo'lmasa ham tabiiy ayol (Kore) va erkak (Charon) ovozi
 * Eski brauzerlarda xato bermaydi (import() faqat ichkarida chaqiriladi), shunchaki ishlamaydi.
 * API: kaAI.load() -> Promise; kaAI.speak(text, mood, g) -> Promise (ovoz tugaganda); kaAI.stop(); kaAI.usable()
 */
(function () {
  "use strict";
  if (window.kaAI) return;
  var BASE = "https://www.gstatic.com/firebasejs/13.0.0/";
  var CFG = { apiKey: "AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc", authDomain: "kuvonch-academy.firebaseapp.com", projectId: "kuvonch-academy", storageBucket: "kuvonch-academy.firebasestorage.app", messagingSenderId: "135195218981", appId: "1:135195218981:web:661a5a028614a9eded5bcc" };
  var RECAPTCHA_KEY = "6Ld1sBkuAAAAANmZqRdMg6WXBQuE0sYGmX67i5kj"; // ochiq sayt kaliti (maxfiy emas)
  var imp = null; try { imp = new Function("u", "return import(u)"); } catch (e) { imp = null; }
  var S = { M: null, ai: null, off: 0, err: "" }, P = null;
  try { S.off = +JSON.parse(localStorage.getItem("ka.tts.off") || "0") || 0; } catch (e) {}
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function load() {
    if (!imp || !window.Promise) return Promise.reject(new Error("brauzer eski"));
    if (!P) {
      P = Promise.all([imp(BASE + "firebase-app.js"), imp(BASE + "firebase-ai.js"), imp(BASE + "firebase-app-check.js")]).then(function (m) {
        var A = m[0], app = A.getApps().length ? A.getApp() : A.initializeApp(CFG);
        if (!window.__kaAppCheck) { try { m[2].initializeAppCheck(app, { provider: new m[2].ReCaptchaEnterpriseProvider(RECAPTCHA_KEY), isTokenAutoRefreshEnabled: true }); window.__kaAppCheck = 1; } catch (e) {} }
        S.M = m[1]; S.ai = m[1].getAI(app, { backend: new m[1].GoogleAIBackend() }); return S;
      });
      P["catch"](function () { P = null; });
    }
    return P;
  }

  /* ---------- Bulut ovozi (Gemini TTS) ---------- */
  var MODELS = ["gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
  var VOICE = { f: "Kore", m: "Charon" };
  var STYLE = { neutral: "warm, friendly and gentle", happy: "cheerful and excited", love: "very warm and affectionate", think: "calm and thoughtful", strict: "firm, stern and a little angry", jealous: "dramatic and playfully jealous", sad: "soft and a little sad", wow: "surprised and amazed" };
  var mi = Math.min(+lsGet("ka.tts.m", 0) || 0, MODELS.length - 1), cache = {};
  function today() { return new Date(Date.now() + 5 * 3600000).toISOString().slice(0, 10); }
  function cnt(k) { var d = lsGet(k, {}) || {}; return d.d === today() ? d.n | 0 : 0; }
  function inc(k) { lsSet(k, { d: today(), n: cnt(k) + 1 }); }
  function dayN() { return cnt("ka.tts.day"); }
  function dayInc() { inc("ka.tts.day"); }
  /* ---------- Kunlik limitlar (bir qurilma uchun, Toshkent kuni) ----------
     tts — tabiiy ovozdagi gap bo'laklari (bitta javob ≈ 2–3 bo'lak), txt — AI xabarlari va ovozni tanish.
     Sinov davrida tabiiy ovoz hammaga; keyin bepul foydalanuvchiga ozgina, Pro'ga ko'p. */
  // Pro obunachi va admin — cheklovsiz (umumiy himoya: ovoz serverida bitta IP uchun 10 daqiqada 150 so'rov)
  // open: true — Kuvi HAMMAGA to'liq ochiq (kunlik limit yo'q). Limitlarni qaytarish uchun false qiling.
  var LIM = { open: true, trialUntil: "2026-12-31", trial: { tts: 30, txt: 50 }, free: { tts: 6, txt: 30 }, pro: { tts: Infinity, txt: Infinity } };
  var PRO_K = "ka.pro.v2", proP = null;
  function proRec() { return lsGet(PRO_K, null); }
  function isAdmin() { var p = proRec(); return !!(p && p.admin); }
  function isPro() { var p = proRec(); return !!(p && (p.admin || (p.active && (!p.until || p.until > Date.now())))); }
  function proEvt() { try { window.dispatchEvent(new CustomEvent("ka-pro", { detail: { pro: isPro(), admin: isAdmin() } })); } catch (e) {} }
  // force=true — keshga qaramay serverdan qayta tekshiradi (limit tugaganda, obuna olingach)
  function refreshPro(force) {
    var p = proRec();
    if (!force && p && Date.now() - (p.ts || 0) < (isPro() ? 3 * 3600000 : 10 * 60000)) return Promise.resolve(isPro());
    if (!window.kaAccount || !kaAccount.cloud) return Promise.resolve(isPro());
    if (!(kaAccount.me && kaAccount.me())) { if (p && isPro()) { lsSet(PRO_K, { active: false, admin: false, until: 0, ts: Date.now() }); proEvt(); } return Promise.resolve(false); }
    if (proP) return proP;
    proP = kaAccount.cloud().then(function (K) { return K && K.premiumStatus ? K.premiumStatus() : null; }).then(function (s) {
      proP = null;
      if (s && !s.error) { lsSet(PRO_K, { active: !!s.active, admin: !!s.admin, until: s.until ? +new Date(s.until) : 0, ts: Date.now() }); proEvt(); }
      return isPro();
    }, function () { proP = null; return isPro(); });
    return proP;
  }
  function trial() { return today() <= LIM.trialUntil; }
  function isOpen() { return !!LIM.open; }
  function limits() { return isOpen() || isPro() ? LIM.pro : trial() ? LIM.trial : LIM.free; }
  function left(kind) { var L = limits(); return kind === "tts" ? L.tts - dayN() : L.txt - cnt("ka.ai.day"); }
  function usable() { return !!window.Promise && (azOn() || (!!imp && S.off <= Date.now())) && left("tts") > 0 && !!(window.AudioContext || window.webkitAudioContext); }

  /* ---------- Azure: o'zbekcha tabiiy ovoz (Madina — ayol, Sardor — erkak) «Kuvi ovoz serveri» orqali ----------
     Server: tools/kuvi-ovoz-worker.js (Cloudflare Worker). Azure kaliti o'sha yerda yashirin turadi.
     Bir xil gap ikkinchi marta aytilsa — telefon xotirasidan (pulsiz, darhol). */
  var AZ_URL = "https://kuvi-ovoz.quvonchmash12.workers.dev";
  function azUrl() { var u = ""; try { u = localStorage.getItem("ka.az.url") || ""; } catch (e) {} u = u || AZ_URL; return u ? String(u).replace(/^"|"$/g, "").replace(/\/+$/, "") : ""; }
  function azOn() { return !!azUrl() && !!window.fetch && (S.azOff || 0) <= Date.now(); }
  /* Azure bepul (F0) tarif cheklovlari: ovozga aylantirish — BUTUN SAYT uchun daqiqasiga 20 ta so'rov,
     ovozni tanish — bir vaqtda 1 ta. Limitga urilsa (429), Azure'ni 10 daqiqaga o'chirmaymiz:
     bir oz kutib qayta urinamiz, bo'lmasa 20 soniyagina zaxira ovozga o'tamiz. */
  function azFail(e) { S.azErr = String((e && e.message) || e); S.azErrAt = Date.now(); S.azOff = Date.now() + (/429/.test(S.azErr) ? 20000 : 90000); try { console.warn("[Kuvi] Azure:", S.azErr); } catch (x) {} }
  function later(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  // shu qurilmadan oxirgi daqiqadagi Azure so'rovlari (xotiradagi gaplar hisobga kirmaydi)
  var azLog = [];
  function azNote() { var t = Date.now(); azLog.push(t); while (azLog.length && t - azLog[0] > 60000) azLog.shift(); S.azMin = azLog.length; }
  function hashS(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h.toString(36) + s.length.toString(36); }
  function azFetch(body, retry) {
    azNote();
    return fetch(azUrl() + "/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: body }).then(function (r) {
      if (r.status === 429 && !retry) return later(1600 + Math.random() * 900).then(function () { return azFetch(body, 1); });
      if (!r.ok) throw new Error("azure " + r.status); return r;
    });
  }
  function azTTS(text, mood, g, lang) {
    lang = lang || (/[а-яё]/i.test(text) ? "ru" : "uz");
    if (lang === "uz") text = uzOrth(text);
    var body = JSON.stringify({ text: text, mood: mood || "neutral", g: g === "m" ? "m" : "f", lang: lang || (/[а-яё]/i.test(text) ? "ru" : "uz") });
    var key = "https://kuvi-ovoz.local/v1/" + hashS(body);
    var open = window.caches && caches.open ? caches.open("kuvi-ovoz-v1")["catch"](function () { return null; }) : Promise.resolve(null);
    return open.then(function (c) {
      return (c ? c.match(key) : Promise.resolve(null)).then(function (hit) {
        if (hit) return hit.arrayBuffer();
        return azFetch(body).then(function (r) { if (c) { try { c.put(key, r.clone())["catch"](function () {}); } catch (e) {} } return r.arrayBuffer(); });
      });
    }).then(function (ab) { var ac = actx(); return new Promise(function (res, rej) { ac.decodeAudioData(ab, res, rej); }); });
  }
  /* ---------- Kuvi ovoz kutubxonasi (ovoz/k/): tez-tez aytiladigan gaplar oldindan mp3 qilib saqlangan ----------
     Maqtovlar, erkalash so'zlari, viktorina reaksiyalari, «Hmm…» — bularni Azure'dan so'ramaymiz: saytning o'zidan
     yuklanadi, limitga kirmaydi, Azure band bo'lsa ham Kuvi o'z ovozida gapiradi. Istalgan faylni o'zingizning
     ovozingiz bilan almashtirsangiz (xuddi shu nomda), Kuvi o'sha ovozda gapiradi. */
  var LIB = { map: null, p: null, base: (function () { try { var sc = document.currentScript && document.currentScript.src; if (sc) return sc.replace(/[^\/]*$/, "") + "ovoz/k/"; } catch (e) {} return "/ovoz/k/"; })(), mem: {} };
  function libNorm(t) { return String(t || "").toLowerCase().replace(/[ʻʼ‘’`´]/g, "'").replace(/\.\.\./g, "…").replace(/\s+/g, " ").trim(); }
  function libLoad() {
    if (LIB.p) return LIB.p;
    LIB.p = fetch(LIB.base + "lib.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { LIB.map = j && j.k ? j.k : null; LIB.v = j && j.v || 0; return LIB.map; }, function () { return null; });
    return LIB.p;
  }
  try { if (window.fetch) setTimeout(libLoad, 0); } catch (e) {}
  function libUrl(t, g) { var h = LIB.map && LIB.map[libNorm(t)]; return h ? LIB.base + (g === "m" ? "m/" : "f/") + h + ".mp3?v=" + LIB.v : null; }
  // Matnni kutubxonadagi gaplar va qolgan qismga ajratadi: [{t, url}] — kutubxonadan, [{t}] — Azure / telefon ovozi uchun
  function libSplit(text, g) {
    text = String(text || "");
    if (!LIB.map || /[а-яё]/i.test(text)) return [{ t: text }];
    var parts = text.match(/[^.!?…]+[.!?…]*["»”]?\s*/g) || [text], out = [], acc = "";
    function flush() { if (acc.trim()) out.push({ t: acc.trim() }); acc = ""; }
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], s = p.trim(); if (!s) { acc += p; continue; }
      var u = libUrl(s, g);
      if (u) { flush(); out.push({ t: s, url: u }); continue; }
      // «To'g'ri, poponam!» -> «To'g'ri,» + «poponam!» (ikkalasi ham kutubxonada bo'lsa)
      var mm = s.match(/^(.+?),\s*([^,]+?)([!.?])$/);
      if (mm) { var u1 = libUrl(mm[1] + ",", g), u2 = libUrl(mm[2] + "!", g); if (u1 && u2) { flush(); out.push({ t: mm[1] + ",", url: u1 }); out.push({ t: mm[2] + "!", url: u2 }); continue; } }
      acc += p;
    }
    flush(); return out.length ? out : [{ t: text }];
  }
  function libBuf(url) {
    if (LIB.mem[url]) return LIB.mem[url];
    var open = window.caches && caches.open ? caches.open("kuvi-lib-v1")["catch"](function () { return null; }) : Promise.resolve(null);
    var pr = open.then(function (c) {
      return (c ? c.match(url) : Promise.resolve(null)).then(function (hit) {
        if (hit) return hit.arrayBuffer();
        return fetch(url).then(function (r) { if (!r.ok) throw new Error("lib " + r.status); if (c) { try { c.put(url, r.clone())["catch"](function () {}); } catch (e) {} } return r.arrayBuffer(); });
      });
    }).then(function (ab) { var ac = actx(); return new Promise(function (res, rej) { ac.decodeAudioData(ab, res, rej); }); });
    pr["catch"](function () { delete LIB.mem[url]; });
    return (LIB.mem[url] = pr);
  }
  // bir vaqtda faqat 1 ta tanish mumkin — band bo'lsa (429) ikki marta qisqa kutib qayta urinamiz
  function azSTT(wavBytes, lang, n) {
    n = n | 0;
    return fetch(azUrl() + "/stt?lang=" + encodeURIComponent(lang || "uz-UZ"), { method: "POST", headers: { "Content-Type": "audio/wav" }, body: wavBytes })
      .then(function (r) {
        if (r.status === 429 && n < 2) return later(700 + n * 900 + Math.random() * 500).then(function () { return azSTT(wavBytes, lang, n + 1); });
        if (!r.ok) throw new Error("azure stt " + r.status); return r.json();
      }).then(function (j) { return typeof j === "string" ? j : j.text || ""; });
  }
  /* ---------- iPhone / iPad: ovoz jim rejim tugmasi yoqiq bo'lsa ham eshitilsin ----------
     iOS Web Audio'ni «jim rejim»da o'chirib qo'yadi. Yangi iOS'da audioSession.type = "playback" yetadi,
     eskisida sahifada ovozsiz <audio> aylanib tursa, ovoz «media» sifatida chiqadi. */
  var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var silentEl = null, silentOn = false;
  function session(type) { try { if (navigator.audioSession && navigator.audioSession.type !== type) navigator.audioSession.type = type; } catch (e) {} }
  function silentUrl() {
    var n = 2000, b = new ArrayBuffer(44 + n), v = new DataView(b), i;
    function w(o, t) { for (var k = 0; k < t.length; k++) v.setUint8(o + k, t.charCodeAt(k)); }
    w(0, "RIFF"); v.setUint32(4, 36 + n, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, "data"); v.setUint32(40, n, true);
    for (i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: "audio/wav" }));
  }
  // foydalanuvchi ekranga tekkan paytda chaqiriladi (actx ichidan)
  function unmute() {
    if (!IOS) return;
    if (!rec) session("playback");
    if (silentOn || document.hidden) return;
    try {
      if (!silentEl) { silentEl = document.createElement("audio"); silentEl.setAttribute("x-webkit-airplay", "deny"); silentEl.setAttribute("playsinline", ""); silentEl.loop = true; silentEl.preload = "auto"; silentEl.src = silentUrl(); }
      var pr = silentEl.play(); silentOn = true;
      if (pr && pr["catch"]) pr["catch"](function () { silentOn = false; });
    } catch (e) { silentOn = false; }
  }
  // mikrofon yoqilganda iOS «yozish va ijro» rejimiga o'tadi, o'chganda yana «ijro»ga qaytamiz
  var rec = false;
  function recording(on) { rec = !!on; if (IOS) session(on ? "play-and-record" : "playback"); }
  try { document.addEventListener("visibilitychange", function () { if (document.hidden && silentEl && silentOn) { try { silentEl.pause(); } catch (e) {} silentOn = false; } }); } catch (e) {}
  var AC = null;
  function actx() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
    if (AC && AC.state !== "running" && AC.state !== "closed") { try { var r = AC.resume(); if (r && r["catch"]) r["catch"](function () {}); } catch (e) {} }
    unmute();
    return AC;
  }
  // O'zbekcha imlo: o' / g' -> oʻ / gʻ. Azure oddiy apostrofli so'zlarni buzib o'qiydi («qo'zichog'im» -> «qoz jo kim»), ʻ bilan esa to'g'ri aytadi
  function uzOrth(t) { return String(t).replace(/([oOgG])['‘’`ʼ]/g, "$1ʻ"); }
  function bytes(b) { var s = atob(b), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function pcm(by, rate) { var ac = actx(), n = by.length >> 1, buf = ac.createBuffer(1, n, rate), d = buf.getChannelData(0), dv = new DataView(by.buffer, by.byteOffset, by.byteLength); for (var i = 0; i < n; i++) d[i] = dv.getInt16(i * 2, true) / 32768; return buf; }
  function waitMs(m) {
    var r = /retryDelay"\s*:\s*"(\d+)s/.exec(m) || /retry in (?:(\d+)h)?(?:(\d+)m)?/i.exec(m);
    if (!r) return 0; if (r.length === 2) return +r[1] * 1000; return ((+r[1] || 0) * 3600 + (+r[2] || 0) * 60) * 1000;
  }
  function fail(e) {
    var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e); S.err = m;
    var w = waitMs(m); S.off = Date.now() + Math.min(24 * 3600000, w || (/429|quota|RESOURCE_EXHAUSTED|rate/i.test(m) ? 10 : 30) * 60000);
    lsSet("ka.tts.off", S.off);
    try { console.warn("[Kuvi] TTS:", m); } catch (x) {}
  }
  function tryModel(text, mood, g, i) {
    var model = S.M.getGenerativeModel(S.ai, { model: MODELS[i], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE[g] || VOICE.f } } } } });
    var prompt = "Read the following text aloud in its own language (it is Uzbek unless it is clearly English or Russian). Speak in a " + (STYLE[mood] || STYLE.neutral) + " tone, at a natural, lively human pace, like a kind teacher talking to a student:\n" + text;
    return model.generateContent(prompt).then(function (r) {
      var resp = r.response, c = resp && resp.candidates && resp.candidates[0], parts = (c && c.content && c.content.parts) || [], p = null;
      for (var k = 0; k < parts.length; k++) if (parts[k].inlineData && parts[k].inlineData.data) { p = parts[k]; break; }
      if (!p) throw new Error("audio yo'q");
      if (i !== mi) { mi = i; lsSet("ka.tts.m", i); }
      var mt = p.inlineData.mimeType || "", by = bytes(p.inlineData.data), ac = actx();
      if (/wav|mpeg|mp3|ogg|webm/i.test(mt) || (by[0] === 0x52 && by[1] === 0x49 && by[2] === 0x46)) {
        return new Promise(function (res, rej) { ac.decodeAudioData(by.buffer.slice(by.byteOffset, by.byteOffset + by.byteLength), res, rej); });
      }
      return pcm(by, +((/rate=(\d+)/.exec(mt) || [])[1] || 24000));
    }, function (e) {
      var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e);
      if (/404|not found|not supported|unknown model|does not support/i.test(m) && i < MODELS.length - 1) return tryModel(text, mood, g, i + 1);
      throw e;
    });
  }
  // matn -> AudioBuffer (bir xil gap qayta so'ralsa — xotiradan)
  function tts(text, mood, g, lang) {
    var k = (g || "f") + "|" + (mood || "") + "|" + (lang || "") + "|" + text;
    if (cache[k]) return cache[k];
    if (!usable()) return Promise.reject(new Error("bulut ovozi hozir yo'q"));
    dayInc();
    var gem = function () { if (S.off > Date.now() || !imp) throw new Error("Gemini ovozi hozir yo'q"); return load().then(function () { if (!actx()) throw new Error("AudioContext yo'q"); return tryModel(text, mood, g, mi); }); };
    cache[k] = azOn() ? azTTS(text, mood, g, lang)["catch"](function (e) { azFail(e); return gem(); }) : Promise.resolve().then(gem);
    cache[k]["catch"](function (e) { delete cache[k]; fail(e); });
    return cache[k];
  }
  var cur = null;
  function play(buf) {
    return new Promise(function (res) {
      var ac = actx(); if (!ac) { res(); return; }
      stop();
      var src = ac.createBufferSource(), done = false; src.buffer = buf; src.connect(ac.destination); cur = src;
      function end() { if (done) return; done = true; if (cur === src) cur = null; res(); }
      src.onended = end; setTimeout(end, buf.duration * 1000 + 1500);
      try { src.start(0); } catch (e) { end(); }
    });
  }
  function stop() { if (cur) { var c = cur; cur = null; try { c.stop(); } catch (e) {} } }
  var gen = 0;
  // Gapni bulut ovozida aytadi; uzun matnni gaplarga bo'lib, hammasini birdaniga tayyorlaydi (uzilishsiz)
  function speak(text, mood, g) {
    var my = ++gen; stop();
    var parts = String(text || "").match(/[^.!?…]+[.!?…]*["»”]?\s*/g) || [String(text || "")], chunks = [], acc = "";
    // Azure limiti tejamli: birinchi gap alohida (tez eshitiladi), qolganlari 240 belgigacha bitta so'rovga birlashtiriladi
    for (var i = 0; i < parts.length; i++) {
      var lim = chunks.length ? 240 : 28, nx = parts[i + 1];
      acc += parts[i];
      if (i === parts.length - 1 || (acc.trim().length >= lim) || (chunks.length && nx && (acc + nx).length > 240)) { if (acc.trim()) chunks.push(acc.trim()); acc = ""; }
    }
    // kutubxonadagi gaplar saytning o'zidan, qolganlari Azure orqali
    var items = [];
    chunks.forEach(function (c) { libSplit(c, g).forEach(function (x) { items.push(x); }); });
    var bufs = items.map(function (x) { return x.url ? libBuf(x.url)["catch"](function () { return tts(x.t, mood, g); }) : tts(x.t, mood, g); });
    var chain = Promise.resolve();
    bufs.forEach(function (bp) { chain = chain.then(function () { if (my !== gen) return; return bp.then(function (b) { if (my !== gen) return; return play(b); }); }); });
    return chain;
  }
  function cancel() { gen++; stop(); }

  /* ---------- Matn: qisqa izoh va tahlil (Gemini) ---------- */
  var TXT = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-2.5-flash-lite"];
  function text(prompt, sys, i) {
    i = i || 0;
    if (!i && left("txt") <= 0) {
      // limit tugadi — balki Pro/admin endi tasdiqlanar (obuna yangi olingan bo'lishi mumkin)
      return refreshPro(true).then(function () { if (left("txt") <= 0) throw new Error("kunlik AI limiti tugadi"); return text(prompt, sys, 0); });
    }
    if (!i) inc("ka.ai.day");
    return load().then(function () {
      var o = { model: TXT[i] }; if (sys) o.systemInstruction = sys;
      return S.M.getGenerativeModel(S.ai, o).generateContent(prompt).then(function (r) { return r.response.text(); });
    })["catch"](function (e) {
      var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e);
      if (/404|not found|not supported/i.test(m) && i < TXT.length - 1) return text(prompt, sys, i + 1);
      throw e;
    });
  }
  setTimeout(function () { refreshPro(); }, 1200);
  // sahifaga qaytganda (masalan, Pro olingach) holatni yangilaymiz
  try { document.addEventListener("visibilitychange", function () { if (!document.hidden) refreshPro(); }); } catch (e) {}
  window.kaAI = { libSplit: libSplit, libBuf: libBuf, libUrl: libUrl, libLoad: libLoad, libReady: function () { return !!LIB.map; }, unmute: unmute, recording: recording, ios: IOS, uzOrth: uzOrth, azOn: azOn, azTTS: azTTS, azSTT: azSTT, azFail: azFail, azUrl: azUrl, limits: limits, left: left, isPro: isPro, isAdmin: isAdmin, isOpen: isOpen, refreshPro: refreshPro, trial: trial, LIM: LIM, txtInc: function () { inc("ka.ai.day"); }, waitMs: waitMs, text: text, load: load, tts: tts, speak: speak, stop: cancel, play: play, actx: actx, usable: usable, state: S };
})();
