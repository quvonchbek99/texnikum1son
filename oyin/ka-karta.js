/*!
 * Kuvonch Academy — kartalarni kamera bilan o'qish (Plickers uslubi), barcha sinf o'yinlari uchun (ka-karta.js)
 * Kartalar: kuvonch.uz/kartalar.html dan chop etiladi (1–40). Karta qaysi tomoni tepada bo'lsa — o'sha javob (A, B, C, D).
 *
 *  KKarta.open(o)   — o'yin ekranida suzuvchi skaner oynasi: 💻 shu kompyuter kamerasi yoki 📱 o'qituvchi telefoni
 *                     o: {title, onCard(card, L), onClose(), letters (2..4)}
 *                     -> {reset(), close(), count(), setNote(html), cards()}
 *  KKarta.cam(video, overlay, onCard) — faqat kamera + aniqlash (skaner.html shu bilan ishlaydi)
 *  KKarta.rosters() / roster(key) / studentOf(rkey, n, card) — Davomat guruh ro'yxatlari va zaxira kartalar (kartalar.html bilan umumiy)
 * Kerak: vendor/js-aruco2 (o'zi yuklanadi), telefon rejimi uchun ka-tarmoq.js. ES5.
 */
(function () {
  "use strict";
  if (window.KKarta) return;
  var MAXK = 40, L4 = ["A", "B", "C", "D"];
  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var AR_SRCS = ["vendor/js-aruco2/cv.js", "vendor/js-aruco2/aruco.js", "vendor/js-aruco2/aruco_4x4_1000.js"];
  var QR_SRCS = ["vendor/qrcode-1.4.4.min.js", "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"];
  var LS_R = "ka.viktorina.rosters.v1", LS_Z = "ka.kartalar.zaxira.v1", LS_K = "ka.kartalar.v1";

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  var loaded = {};
  function addJs(src) {
    var url = /^https?:/.test(src) ? src : BASE + src;
    if (!loaded[url]) loaded[url] = new Promise(function (ok, no) { var s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = function () { delete loaded[url]; no(new Error("Fayl yuklanmadi")); }; document.head.appendChild(s); });
    return loaded[url];
  }
  function loadSeq(l) { return l.reduce(function (p, f) { return p.then(function () { return addJs(f); }); }, Promise.resolve()); }
  function loadFirst(l) { var i = 0; function nx() { return i >= l.length ? Promise.reject(new Error("yuklanmadi")) : addJs(l[i++]).catch(nx); } return nx(); }

  /* ---------------- guruh ro'yxatlari (Davomat) va zaxira kartalar ---------------- */
  function rosters() { var a = lsGet(LS_R, {}), out = []; for (var k in a) if (a[k] && a[k].list && a[k].list.length) out.push({ key: k, name: a[k].name || k, list: a[k].list.slice(0, MAXK), at: a[k].at || 0 }); return out.sort(function (x, y) { return y.at - x.at; }); }
  function roster(key) { var r = rosters().filter(function (x) { return x.key === key; })[0]; return r || null; }
  function lastKey() { var c = lsGet(LS_K, {}); return c.rkey || ""; }
  function shortName(f) { return String(f || "").trim().split(/\s+/).slice(0, 2).join(" "); }
  // karta -> o'quvchi tartib raqami (0 dan) yoki -1. Zaxira kartalar kartalar.html da beriladi
  function studentOf(rkey, n, card) {
    var z = (lsGet(LS_Z, {})[rkey]) || {}, zax = z.zax || {}, lost = z.lost || {};
    if (zax[card] != null) { var o = +zax[card]; return o < n ? o : -1; }
    return card <= n && !lost[card - 1] ? card - 1 : -1;
  }

  /* ---------------- kamera + aniqlash ---------------- */
  function topLetter(c) {
    var cx = (c[0].x + c[1].x + c[2].x + c[3].x) / 4, cy = (c[0].y + c[1].y + c[2].y + c[3].y) / 4;
    var mx = (c[0].x + c[1].x) / 2 - cx, my = (c[0].y + c[1].y) / 2 - cy;
    var ang = Math.atan2(-my, mx) * 180 / Math.PI;
    return L4[Math.round(((((ang - 90) % 360) + 360) % 360) / 90) % 4];
  }
  // video, overlay canvas, onCard(card, L) -> Promise<{stop, reset, acc, info()}>
  function cam(v, o, onCard, onInfo) {
    var S = { on: false, acc: {}, seen: {}, det: null, work: null, dt: 0, stream: null, track: null };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("Bu brauzer kamerani bermaydi — Chrome yoki Safari'da https orqali oching"));
    return loadSeq(AR_SRCS).then(function () {
      var AR = window.AR;
      if (!AR.DICTIONARIES.KA_KARTA) AR.DICTIONARIES.KA_KARTA = { nBits: 16, tau: 2, codeList: AR.DICTIONARIES.ARUCO_4X4_1000.codeList.slice(0, MAXK + 1) };
      S.det = new AR.Detector({ dictionaryName: "KA_KARTA" });
      return navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
    }).then(function (st) {
      S.stream = st; v.srcObject = st; v.muted = true; v.setAttribute("playsinline", ""); return v.play();
    }).then(function () {
      S.track = S.stream.getVideoTracks()[0]; S.on = true; loop();
      return {
        acc: S.acc, track: S.track,
        stop: function () { S.on = false; if (S.stream) S.stream.getTracks().forEach(function (t) { t.stop(); }); S.stream = null; },
        reset: function () { for (var k in S.acc) delete S.acc[k]; S.seen = {}; },
        zoom: function (z) { try { return S.track.applyConstraints({ advanced: [{ zoom: z }] }); } catch (e) { return Promise.reject(e); } },
        zoomCaps: function () { try { var c = S.track.getCapabilities ? S.track.getCapabilities() : {}; return c.zoom && c.zoom.max > 1 ? c.zoom : null; } catch (e) { return null; } }
      };
    }).catch(function (e) {
      if (S.stream) S.stream.getTracks().forEach(function (t) { t.stop(); });
      var n = e && e.name;
      throw new Error(n === "NotAllowedError" ? "Kameraga ruxsat berilmadi — brauzer sozlamalaridan kamerani yoqing" : n === "NotFoundError" || n === "OverconstrainedError" ? "Kamera topilmadi" : (e && e.message) || "Kamera ochilmadi");
    });
    function loop() {
      if (!S.on) return;
      var ms = [];
      if (v.readyState >= 2 && v.videoWidth) {
        var w = v.videoWidth, h = v.videoHeight, k = Math.min(1, 1600 / Math.max(w, h)), cw = Math.round(w * k), ch = Math.round(h * k);
        var c = S.work || (S.work = document.createElement("canvas"));
        if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
        var x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(v, 0, 0, cw, ch);
        var t = performance.now();
        try { ms = S.det.detect(x.getImageData(0, 0, cw, ch)); } catch (e) { ms = []; }
        S.dt = performance.now() - t;
        handle(ms); if (o) draw(ms, cw, ch);
      }
      setTimeout(loop, S.dt > 120 ? 15 : 45);
    }
    function handle(ms) {
      var now = Date.now();
      ms.forEach(function (m) {
        var id = m.id; if (!(id >= 1 && id <= MAXK)) return;
        var L = topLetter(m.corners), s = S.seen[id];
        if (s && s.L === L && now - s.t < 1500) { s.n++; s.t = now; } else s = S.seen[id] = { L: L, n: 1, t: now };
        m.L = L; m.ok = s.n >= 2;
        if (m.ok && S.acc[id] !== L) { S.acc[id] = L; vib(15); onCard(id, L); }
      });
      if (onInfo) onInfo(Object.keys(S.acc).length, S.dt);
    }
    function draw(ms, cw, ch) {
      var W = v.clientWidth, H = v.clientHeight; if (!W || !H) return;
      if (o.width !== W || o.height !== H) { o.width = W; o.height = H; }
      var g = o.getContext("2d"); g.clearRect(0, 0, W, H);
      var k = Math.min(W / cw, H / ch), ox = (W - cw * k) / 2, oy = (H - ch * k) / 2;
      ms.forEach(function (m) {
        if (!(m.id >= 1 && m.id <= MAXK)) return;
        var col = m.ok ? "#2fd36b" : "#ffd479";
        g.beginPath(); m.corners.forEach(function (p, i) { var X = ox + p.x * k, Y = oy + p.y * k; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.closePath();
        g.lineWidth = 3; g.strokeStyle = col; g.stroke();
        var cx = 0, cy = 0; m.corners.forEach(function (p) { cx += p.x; cy += p.y; }); cx = ox + cx / 4 * k; cy = oy + cy / 4 * k;
        var t = m.id + " " + (m.L || ""); g.font = "bold 16px sans-serif"; var tw = g.measureText(t).width;
        g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(cx - tw / 2 - 5, cy - 12, tw + 10, 22); g.fillStyle = col; g.fillText(t, cx - tw / 2, cy + 5);
      });
    }
  }

  /* ---------------- o'yin ekranidagi skaner oynasi ---------------- */
  var CSS = ".kk{position:fixed;right:10px;bottom:10px;z-index:9500;width:min(300px,92vw);background:#0e172b;border:2px solid #5ee6c7;border-radius:16px;box-shadow:0 14px 40px -10px #000;color:#eef2ff;font:14px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;overflow:hidden}" +
    ".kk.big{width:min(760px,96vw)}.kk.min .kk-body{display:none}" +
    ".kk-h{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#13213f;font-weight:800}.kk-h b{color:#ffd479;font-size:18px;font-family:ui-monospace,monospace}.kk-h .sp{flex:1}" +
    ".kk-h button,.kk-src button{border:1px solid #243252;background:#14203a;color:#eef2ff;border-radius:9px;padding:4px 8px;font-weight:800;cursor:pointer;font-size:13px}" +
    ".kk-src{display:flex;gap:6px;padding:6px 8px;flex-wrap:wrap}.kk-src button.on{background:#5ee6c7;color:#081019;border-color:transparent}" +
    ".kk-v{position:relative;background:#000;aspect-ratio:16/9}.kk-v video,.kk-v canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}" +
    ".kk-msg{padding:6px 10px;color:#9fb0d0;font-size:12.5px}.kk-msg b{color:#ffd479}.kk-code{font:900 30px/1.1 ui-monospace,monospace;letter-spacing:.12em;color:#ffd479}.kk-qr{background:#fff;border-radius:10px;padding:6px;width:150px;margin:6px auto}.kk-qr svg{display:block;width:100%;height:auto}" +
    ".kk-note{padding:4px 10px 8px;color:#9fb0d0;font-size:13px}.kk-note:empty{display:none}";
  function css() { if ($("#kkCss")) return; var s = document.createElement("style"); s.id = "kkCss"; s.textContent = CSS; document.head.appendChild(s); }
  var cur = null;
  function open(o) {
    o = o || {}; css();
    if (cur) cur.close();
    var el = document.createElement("div"); el.className = "kk"; el.setAttribute("role", "region"); el.setAttribute("aria-label", "Karta skaneri");
    el.innerHTML = '<div class="kk-h">📷 <span>' + esc(o.title || "Kartalar") + '</span>: <b class="kk-n">0</b><span class="sp"></span><button type="button" data-a="big" title="Kattalashtirish">⤢</button><button type="button" data-a="min" title="Yig\'ish">▁</button><button type="button" data-a="x" title="Yopish">✕</button></div>' +
      '<div class="kk-body"><div class="kk-src"><button type="button" data-s="pc">💻 Shu kamera</button><button type="button" data-s="tel">📱 Telefon bilan</button><a href="' + BASE + 'kartalar.html" target="_blank" rel="noopener" style="margin-left:auto;color:#7c9bff;align-self:center;font-size:12px">🖨 Kartalarni chop etish</a></div>' +
      '<div class="kk-v" hidden><video playsinline muted></video><canvas></canvas></div><div class="kk-msg">Kamerani tanlang: noutbuk kamerasi yoki o\'z telefoningiz (sinfni yaxshiroq ko\'radi).</div><div class="kk-note"></div></div>';
    document.body.appendChild(el);
    var S = { cam: null, room: null, acc: {}, phones: {}, closed: false };
    var nEl = $(".kk-n", el), msg = $(".kk-msg", el), vbox = $(".kk-v", el);
    function count() { return Object.keys(S.acc).length; }
    function got(card, L) {
      if (S.closed || !(card >= 1 && card <= MAXK) || L4.indexOf(L) < 0) return;
      if (o.letters && L4.indexOf(L) >= o.letters) return; // 2 variantli savolda C, D hisoblanmaydi
      if (S.acc[card] === L) return;
      S.acc[card] = L; nEl.textContent = count();
      if (o.onCard) try { o.onCard(card, L); } catch (e) {}
    }
    function stopAll() { if (S.cam) { S.cam.stop(); S.cam = null; } if (S.room) { try { S.room.close(); } catch (e) {} S.room = null; } vbox.hidden = true; }
    function src(kind) {
      Array.prototype.forEach.call(el.querySelectorAll("[data-s]"), function (b) { b.classList.toggle("on", b.dataset.s === kind); });
      stopAll();
      if (kind === "pc") {
        msg.innerHTML = "⏳ Kamera yoqilmoqda… (brauzer ruxsat so'rasa — «Ruxsat berish»)"; vbox.hidden = false;
        cam($("video", el), $("canvas", el), got).then(function (c) { if (S.closed) { c.stop(); return; } S.cam = c; msg.innerHTML = "Kartalarni kameraga qarating — <b>yashil</b> ramka = javob yozildi."; if (o.onReady) o.onReady("pc"); })
          .catch(function (e) { vbox.hidden = true; msg.innerHTML = "⚠️ " + esc(e.message); });
      } else {
        var N = window.KANet;
        if (!N || !N.host) { msg.innerHTML = "⚠️ Tarmoq moduli yo'q — sahifani yangilang"; return; }
        msg.innerHTML = "⏳ Telefon uchun xona ochilmoqda…";
        Promise.all([N.host({
          kind: "skaner",
          onConn: function () { return Object.keys(S.phones).length < 4 ? true : "Skanerlar soni to'lgan (4 ta)"; },
          onJoin: function (id) { S.phones[id] = 1; phoneMsg(); if (S.room) S.room.send(id, { type: "rst", t: o.title || "" }, true); if (o.onReady) o.onReady("tel"); },
          onRejoin: function (id) { S.phones[id] = 1; phoneMsg(); },
          onLeave: function (id) { delete S.phones[id]; phoneMsg(); },
          onMsg: function (id, m) { if (m && m.type === "scan" && m.d) for (var k in m.d) got(+k, String(m.d[k])); }
        }), loadFirst(QR_SRCS).catch(function () {})]).then(function (r) {
          if (S.closed) { r[0].close(); return; }
          S.room = r[0]; S.code = r[0].code; phoneMsg();
        }).catch(function (e) { msg.innerHTML = "⚠️ Xona ochilmadi: " + esc((e && e.message) || "internetni tekshiring"); });
      }
    }
    function phoneMsg() {
      if (!S.room) return;
      var k = Object.keys(S.phones).length, url = location.origin + "/live/?kod=" + S.code, qr = "";
      try { var q = window.qrcode(0, "M"); q.addData(url); q.make(); qr = q.createSvgTag({ cellSize: 4, margin: 1, scalable: true }); } catch (e) {}
      msg.innerHTML = k ? "✅ Telefon skaner ulangan" + (k > 1 ? ": " + k + " ta" : "") + ". Telefonni sinfga qarating." :
        '<div style="text-align:center">Telefoningizda <b>kuvonch.uz/live</b> oching va kodni yozing:<div class="kk-code">' + esc(S.code) + '</div><div class="kk-qr">' + qr + "</div></div>";
    }
    el.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b) return;
      if (b.dataset.s) src(b.dataset.s);
      else if (b.dataset.a === "big") el.classList.toggle("big");
      else if (b.dataset.a === "min") el.classList.toggle("min");
      else if (b.dataset.a === "x") ctl.close();
    });
    var ctl = {
      el: el,
      reset: function (letters) {
        if (letters != null) o.letters = letters;
        S.acc = {}; nEl.textContent = "0"; if (S.cam) S.cam.reset();
        if (S.room) for (var id in S.phones) S.room.send(id, { type: "rst", t: o.title || "" });
      },
      count: count, cards: function () { var c = {}; for (var k in S.acc) c[k] = S.acc[k]; return c; },
      setNote: function (h) { $(".kk-note", el).innerHTML = h || ""; },
      close: function () { if (S.closed) return; S.closed = true; stopAll(); el.remove(); if (cur === ctl) cur = null; if (o.onClose) o.onClose(); },
      min: function (on) { el.classList.toggle("min", !!on); },
      active: function () { return !!(S.cam || (S.room && Object.keys(S.phones).length)); }
    };
    cur = ctl;
    if (o.src) src(o.src);
    return ctl;
  }

  window.KKarta = { MAX: MAXK, L4: L4, open: open, cam: cam, rosters: rosters, roster: roster, lastKey: lastKey, studentOf: studentOf, shortName: shortName };
})();
