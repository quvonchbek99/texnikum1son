/* Silliq PDF ko'ruvchi (PDF.js): 800+ betlik majmualar ham faqat ko'rinayotgan betlar bilan yuklanadi
   (HTTP Range — GitHub Pages qo'llaydi), betlar ekranga yaqinlashganda chiziladi, uzoqlashganda xotiradan bo'shatiladi.
   API: t1PDF.och(url, {sarlavha, bosh, oxir, bet, nom})  — to'liq ekranda
        t1PDF.ichki(el, url, {bosh, oxir, sarlavha, nom}) — sahifa ichida (qism uchun)
        t1PDF.kes(url, [[bosh, oxir], …]) → Promise<Uint8Array>  — tanlangan betlardan yangi PDF (pdf-lib)
        t1PDF.saqla(bytes, nom) */
(function () {
  "use strict";
  if (window.t1PDF) return;
  var CDN = "https://cdnjs.cloudflare.com/ajax/libs/";
  var JS = { pdf: CDN + "pdf.js/3.11.174/pdf.min.js", worker: CDN + "pdf.js/3.11.174/pdf.worker.min.js", lib: CDN + "pdf-lib/1.17.1/pdf-lib.min.js", zip: CDN + "jszip/3.10.1/jszip.min.js" };
  var LS = {}, DOCS = {}, BYTES = {};
  function lib(k) {
    if (!LS[k]) LS[k] = new Promise(function (ok, no) { var s = document.createElement("script"); s.src = JS[k]; s.onload = ok; s.onerror = function () { LS[k] = null; no(new Error("Kutubxona yuklanmadi")); }; document.head.appendChild(s); });
    return LS[k];
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hujjat(url) {
    if (!DOCS[url]) DOCS[url] = lib("pdf").then(function () {
      var P = window.pdfjsLib; P.GlobalWorkerOptions.workerSrc = JS.worker;
      return P.getDocument({ url: url, rangeChunkSize: 262144, disableAutoFetch: true, disableStream: true, isEvalSupported: false }).promise;
    });
    DOCS[url]["catch"](function () { delete DOCS[url]; });
    return DOCS[url];
  }

  /* ---------- Ko'ruvchi: sahifa (yoki dialog) ichidagi betlar tasmasi ---------- */
  function Tasma(box, url, o) {
    var self = this; o = o || {};
    this.url = url; this.box = box; this.zoom = 1; this.chizilgan = []; this.navbat = {};
    box.classList.add("pv"); box.innerHTML = '<div class="pv-s"><div class="pv-i"><p class="pv-yuk">PDF ochilmoqda…</p></div></div>';
    this.s = box.querySelector(".pv-s"); this.i = box.querySelector(".pv-i");
    this.tayyor = hujjat(url).then(function (doc) {
      self.doc = doc;
      self.bosh = Math.max(1, o.bosh || 1); self.oxir = Math.min(doc.numPages, o.oxir || doc.numPages);
      return doc.getPage(self.bosh);
    }).then(function (p) {
      var v = p.getViewport({ scale: 1 }); self.nisbat = v.height / v.width;
      self.qur(); if (o.bet) self.bor(o.bet, true);
      return self;
    })["catch"](function (e) { self.i.innerHTML = '<p class="note bad">PDF ochilmadi: ' + esc(e && e.message || e) + "</p>"; throw e; });
  }
  Tasma.prototype.kenglik = function () { return Math.max(240, Math.min(this.s.clientWidth - 24, 1100) * this.zoom); };
  Tasma.prototype.qur = function () {
    var self = this, w = this.kenglik(), h = Math.round(w * this.nisbat), html = "";
    for (var n = this.bosh; n <= this.oxir; n++) html += '<div class="pv-p" data-n="' + n + '" style="width:' + w + "px;height:" + h + 'px"><span class="pv-n">' + n + "</span></div>";
    this.i.innerHTML = html;
    if (this.io) this.io.disconnect();
    this.io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var n = +e.target.getAttribute("data-n"); if (e.isIntersecting) self.chiz(n); });
    }, { root: this.s, rootMargin: "1400px 0px" });
    Array.prototype.forEach.call(this.i.children, function (el) { self.io.observe(el); });
    var t = 0;
    this.s.addEventListener("scroll", function () { if (t) return; t = requestAnimationFrame(function () { t = 0; self.joriy(); }); }, { passive: true });
    if ("ResizeObserver" in window) {
      var oldW = this.s.clientWidth;
      new ResizeObserver(function () { if (Math.abs(self.s.clientWidth - oldW) > 40) { oldW = self.s.clientWidth; self.qaytaOlcham(); } }).observe(this.s);
    }
    this.joriy();
  };
  Tasma.prototype.qaytaOlcham = function () {
    var w = this.kenglik(), h = Math.round(w * this.nisbat), self = this, n0 = this.hozir || this.bosh;
    Array.prototype.forEach.call(this.i.children, function (el) {
      var ch = el.getAttribute("data-h"); el.style.width = w + "px"; el.style.height = (ch ? Math.round(w * ch) : h) + "px";
      var c = el.querySelector("canvas"); if (c) { c.remove(); el.removeAttribute("data-ok"); }
    });
    this.chizilgan = []; this.bor(n0, true);
    setTimeout(function () { Array.prototype.forEach.call(self.i.children, function (el) { var r = el.getBoundingClientRect(), s = self.s.getBoundingClientRect(); if (r.bottom > s.top - 1400 && r.top < s.bottom + 1400) self.chiz(+el.getAttribute("data-n")); }); }, 30);
  };
  Tasma.prototype.chiz = function (n) {
    var self = this, el = this.i.querySelector('.pv-p[data-n="' + n + '"]');
    if (!el || el.getAttribute("data-ok") || this.navbat[n]) return;
    this.navbat[n] = 1;
    this.doc.getPage(n).then(function (p) {
      var w = self.kenglik(), v1 = p.getViewport({ scale: 1 }), sc = w / v1.width, dpr = Math.min(window.devicePixelRatio || 1, 2);
      var v = p.getViewport({ scale: sc * dpr }), c = document.createElement("canvas");
      c.width = Math.floor(v.width); c.height = Math.floor(v.height);
      c.style.width = Math.floor(v1.width * sc) + "px"; c.style.height = Math.floor(v1.height * sc) + "px";
      el.style.height = Math.floor(v1.height * sc) + "px"; el.setAttribute("data-h", (v1.height / v1.width).toFixed(4));
      return p.render({ canvasContext: c.getContext("2d", { alpha: false }), viewport: v }).promise.then(function () {
        el.appendChild(c); el.setAttribute("data-ok", "1"); self.chizilgan.push(n); self.bosha(n);
        if (p.cleanup) p.cleanup();
      });
    })["catch"](function (e) { console.warn("[pdf]", n, e); }).then(function () { delete self.navbat[n]; });
  };
  // Xotira: 30 dan ortiq chizilgan bet bo'lsa, eng uzoqdagilari bo'shatiladi
  Tasma.prototype.bosha = function (yangi) {
    if (this.chizilgan.length <= 30) return;
    var self = this, h = this.hozir || yangi;
    this.chizilgan.sort(function (a, b) { return Math.abs(b - h) - Math.abs(a - h); });
    while (this.chizilgan.length > 24) {
      var n = this.chizilgan.shift(), el = this.i.querySelector('.pv-p[data-n="' + n + '"]');
      if (el) { var c = el.querySelector("canvas"); if (c) { c.width = c.height = 0; c.remove(); } el.removeAttribute("data-ok"); }
    }
  };
  Tasma.prototype.joriy = function () {
    var st = this.s.scrollTop + this.s.clientHeight * 0.3, kids = this.i.children, lo = 0, hi = kids.length - 1;
    while (lo < hi) { var m = (lo + hi + 1) >> 1; if (kids[m].offsetTop <= st) lo = m; else hi = m - 1; }
    var n = kids[lo] ? +kids[lo].getAttribute("data-n") : this.bosh;
    if (n !== this.hozir) { this.hozir = n; if (this.onBet) this.onBet(n); }
  };
  Tasma.prototype.bor = function (n, darhol) {
    n = Math.max(this.bosh, Math.min(this.oxir, n | 0));
    var el = this.i.querySelector('.pv-p[data-n="' + n + '"]'); if (!el) return;
    this.s.scrollTo({ top: el.offsetTop - 8, behavior: darhol ? "auto" : "smooth" });
  };
  Tasma.prototype.kattalik = function (z) { this.zoom = Math.max(0.5, Math.min(3, z)); this.qaytaOlcham(); };

  /* ---------- To'liq ekranli dialog ---------- */
  var DLG = null;
  function och(url, o) {
    o = o || {};
    if (!DLG) {
      DLG = document.createElement("dialog"); DLG.className = "pv-dlg";
      DLG.innerHTML = '<div class="pv-bar"><b class="pv-t"></b><span class="pv-sp"></span>' +
        '<button type="button" class="pv-b" data-a="old" aria-label="Oldingi bet">‹</button><label class="pv-bet"><input type="number" min="1" inputmode="numeric" aria-label="Bet raqami"> / <span></span></label><button type="button" class="pv-b" data-a="key" aria-label="Keyingi bet">›</button>' +
        '<button type="button" class="pv-b" data-a="kich" aria-label="Kichraytirish">−</button><button type="button" class="pv-b" data-a="kat" aria-label="Kattalashtirish">+</button>' +
        '<button type="button" class="pv-b pv-w" data-a="tol"></button><button type="button" class="pv-b pv-w" data-a="yuk">PDF yuklab olish</button><button type="button" class="pv-b" data-a="yop" aria-label="Yopish">✕</button></div><div class="pv-joy"></div>';
      document.body.appendChild(DLG);
      DLG.addEventListener("close", function () { DLG.querySelector(".pv-joy").innerHTML = ""; document.documentElement.classList.remove("pv-ochiq"); });
      DLG.addEventListener("keydown", function (e) {
        var T = DLG._t; if (!T || e.target.tagName === "INPUT") return;
        if (e.key === "ArrowRight" || e.key === "PageDown") { T.bor((T.hozir || T.bosh) + 1); e.preventDefault(); }
        if (e.key === "ArrowLeft" || e.key === "PageUp") { T.bor((T.hozir || T.bosh) - 1); e.preventDefault(); }
      });
    }
    var joy = DLG.querySelector(".pv-joy"), inp = DLG.querySelector(".pv-bet input"), jami = DLG.querySelector(".pv-bet span");
    DLG.querySelector(".pv-t").textContent = o.sarlavha || "PDF";
    var tol = DLG.querySelector('[data-a="tol"]'), qism = !!(o.bosh || o.oxir);
    function ishga(bosh, oxir, bet) {
      var T = new Tasma(joy, url, { bosh: bosh, oxir: oxir, bet: bet }); DLG._t = T;
      T.onBet = function (n) { inp.value = n; };
      T.tayyor.then(function () { inp.min = T.bosh; inp.max = T.oxir; jami.textContent = T.oxir + (T.bosh > 1 ? " (" + T.bosh + "–" + T.oxir + ")" : ""); });
      return T;
    }
    ishga(o.bosh, o.oxir, o.bet);
    tol.hidden = !qism; tol.textContent = "Butun majmua"; tol._butun = false;
    DLG.querySelectorAll(".pv-b").forEach(function (b) {
      b.onclick = function () {
        var T = DLG._t, a = b.getAttribute("data-a");
        if (a === "yop") DLG.close();
        if (!T || !T.doc) return;
        if (a === "old") T.bor((T.hozir || T.bosh) - 1);
        if (a === "key") T.bor((T.hozir || T.bosh) + 1);
        if (a === "kich") T.kattalik(T.zoom / 1.2);
        if (a === "kat") T.kattalik(T.zoom * 1.2);
        if (a === "tol") { tol._butun = !tol._butun; var hz = T.hozir; ishga(tol._butun ? 1 : o.bosh, tol._butun ? null : o.oxir, hz); tol.textContent = tol._butun ? "Faqat shu qism" : "Butun majmua"; }
        if (a === "yuk") {
          var bosh = tol._butun || !qism ? 1 : T.bosh, oxir = tol._butun || !qism ? T.doc.numPages : T.oxir;
          if (bosh === 1 && oxir === T.doc.numPages) { var l = document.createElement("a"); l.href = url; l.download = fnom(o.nom || o.sarlavha || "majmua") + ".pdf"; document.body.appendChild(l); l.click(); l.remove(); return; }
          b.disabled = true; var eski = b.textContent; b.textContent = "Tayyorlanmoqda…";
          kes(url, [[bosh, oxir]], function (p) { b.textContent = "Yuklanmoqda " + Math.round(p * 100) + "%"; }).then(function (bytes) { saqla(bytes, (o.nom || o.sarlavha || "qism") + " (" + bosh + "-" + oxir + "-bet)"); })
            ["catch"](function (e) { alert("PDF tayyorlanmadi: " + (e && e.message || e)); }).then(function () { b.disabled = false; b.textContent = eski; });
        }
      };
    });
    inp.onchange = function () { if (DLG._t) DLG._t.bor(+inp.value, true); };
    document.documentElement.classList.add("pv-ochiq");
    if (DLG.showModal) DLG.showModal(); else DLG.setAttribute("open", "");
    return DLG._t;
  }

  /* ---------- Sahifa ichidagi ko'ruvchi (qism) ---------- */
  function ichki(el, url, o) {
    o = o || {};
    el.innerHTML = '<div class="pv-mini"><span class="pv-holat">Bet: <b>—</b></span><span class="pv-sp"></span>' +
      '<button type="button" class="btn ghost sm" data-a="ekran">To‘liq ekranda</button><button type="button" class="btn ghost sm" data-a="yuk">PDF yuklab olish</button></div><div class="pv-kut"></div>';
    var T = new Tasma(el.querySelector(".pv-kut"), url, o), h = el.querySelector(".pv-holat b");
    T.onBet = function (n) { h.textContent = n + " (" + T.bosh + "–" + T.oxir + ")"; };
    el.querySelector('[data-a="ekran"]').onclick = function () { och(url, { sarlavha: o.sarlavha, bosh: o.bosh, oxir: o.oxir, bet: T.hozir, nom: o.nom }); };
    el.querySelector('[data-a="yuk"]').onclick = function () {
      var b = this, eski = b.textContent; b.disabled = true; b.textContent = "Tayyorlanmoqda…";
      T.tayyor.then(function () { return kes(url, [[T.bosh, T.oxir]], function (p) { b.textContent = "Yuklanmoqda " + Math.round(p * 100) + "%"; }); })
        .then(function (bytes) { saqla(bytes, (o.nom || o.sarlavha || "qism") + " (" + T.bosh + "-" + T.oxir + "-bet)"); })
        ["catch"](function (e) { alert("PDF tayyorlanmadi: " + (e && e.message || e)); }).then(function () { b.disabled = false; b.textContent = eski; });
    };
    return T;
  }

  /* ---------- Tanlangan betlardan yangi PDF (pdf-lib) ---------- */
  function butun(url, onP) {
    if (BYTES[url]) return BYTES[url];
    BYTES[url] = fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      var jami = +r.headers.get("Content-Length") || 0;
      if (!r.body || !r.body.getReader || !jami) return r.arrayBuffer();
      var rd = r.body.getReader(), qism = [], ol = 0;
      return (function o() { return rd.read().then(function (x) { if (x.done) { var u = new Uint8Array(ol), k = 0; qism.forEach(function (c) { u.set(c, k); k += c.length; }); return u.buffer; } qism.push(x.value); ol += x.value.length; if (onP) onP(ol / jami); return o(); }); })();
    });
    BYTES[url]["catch"](function () { delete BYTES[url]; });
    return BYTES[url];
  }
  function kes(url, oraliqlar, onP) {
    return Promise.all([lib("lib"), butun(url, onP)]).then(function (r) {
      var L = window.PDFLib;
      return L.PDFDocument.load(r[1], { ignoreEncryption: true }).then(function (src) {
        return L.PDFDocument.create().then(function (out) {
          var idx = [];
          oraliqlar.forEach(function (o) { for (var n = o[0]; n <= o[1]; n++) if (n >= 1 && n <= src.getPageCount()) idx.push(n - 1); });
          return out.copyPages(src, idx).then(function (pp) { pp.forEach(function (p) { out.addPage(p); }); return out.save({ useObjectStreams: true }); });
        });
      });
    });
  }
  function fnom(n) { return String(n || "fayl").replace(/[‘’ʻʼ`´]/g, "'").replace(/[—–]/g, "-").replace(/[«»“”]/g, "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120); }
  function saqla(bytes, nom) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    a.download = fnom(nom) + (/\.(pdf|zip)$/i.test(nom) ? "" : ".pdf"); document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  }
  function zip(fayllar, nom) {
    return lib("zip").then(function () {
      var z = new window.JSZip(), p = z.folder(fnom(nom)), bor = {};
      fayllar.forEach(function (f) { var k = fnom(f.nom), j = 2; while (bor[k]) k = fnom(f.nom) + " (" + (j++) + ")"; bor[k] = 1; p.file(k + ".pdf", f.bytes); });
      return z.generateAsync({ type: "blob" });
    }).then(function (b) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = fnom(nom) + ".zip"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000); });
  }

  window.t1PDF = { och: och, ichki: ichki, kes: kes, saqla: saqla, zip: zip, hujjat: hujjat, fnom: fnom };
})();
