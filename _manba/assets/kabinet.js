/* O'qituvchi kabineti: login/parol, hujjatlarni (ZIP, Word, PDF, PowerPoint, Excel, RTR) yuklash,
   AI bilan avtomatik tahlil (turi, dars raqami, TMR), yetishmayotgan texnologik xaritalarni AI bilan tuzish
   va e-bazaga joylash. Asl fayllar admin Google Drive'iga (Apps Script orqali), matn Firestore'ga yoziladi. */
(function () {
  "use strict";
  var ROOT = (window.t1 && t1.ROOT) || "", APP = document.getElementById("kabinet"); if (!APP) return;
  var B = null, USER = null, PROF = null, ADMIN = false, MAL = null, SOZ = {}, ISH = null;
  var MAX_DRIVE = 25 * 1024 * 1024, MAX_HTML = 600000;
  var TURLAR = [["tmr", "TMR (taqvim-mavzu reja)"], ["xarita", "Texnologik xarita"], ["maruza", "Ma’ruza matni"], ["amaliy", "Amaliy / laboratoriya ishi"], ["mustaqil", "Mustaqil ish"], ["nazorat", "Nazorat (test, bilet)"], ["glossariy", "Glossariy"], ["oum", "O‘UM (majmua)"], ["dastur", "Ishchi dastur"], ["taqdimot", "Taqdimot"], ["media", "Rasm / video"], ["boshqa", "Boshqa"]];
  var CDN = {
    jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    mammoth: "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js",
    pdf: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    pdfw: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
    xlsx: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
    purify: "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"
  };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var $ = function (s, r) { return (r || APP).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || APP).querySelectorAll(s)); };
  var LS = {};
  function lib(k) {
    if (!LS[k]) LS[k] = new Promise(function (ok, no) { var s = document.createElement("script"); s.src = CDN[k]; s.onload = ok; s.onerror = function () { LS[k] = null; no(new Error(k + " kutubxonasi yuklanmadi")); }; document.head.appendChild(s); });
    return LS[k];
  }
  function kb(n) { n = +n || 0; return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; }
  function xato(e) { return window.t1Bulut ? t1Bulut.uzXato(e) : String(e && e.message || e); }
  function ext(n) { var m = /\.([a-z0-9]+)$/i.exec(n || ""); return m ? m[1].toLowerCase() : ""; }
  function msg(el, t, cls) { el.innerHTML = t ? '<p class="note ' + (cls || "") + '">' + t + "</p>" : ""; }

  /* ================= Boshlanish ================= */
  APP.innerHTML = '<p class="muted">Yuklanmoqda…</p>';
  fetch(ROOT + "data/malumot.json").then(function (r) { return r.json(); }).then(function (d) { MAL = d; return t1Bulut.load(); }).then(function (b) {
    B = b;
    B.F.getDoc(B.F.doc(B.db, "t1_sozlama", "umumiy")).then(function (d) { if (d.exists()) SOZ = d.data(); })["catch"](function () {});
    B.A.onAuthStateChanged(B.auth, function (u) { USER = u; u ? profil() : kirish(); });
  })["catch"](function (e) { APP.innerHTML = '<div class="note bad">Bulut xizmatiga ulanib bo‘lmadi: ' + esc(xato(e)) + ". Internetni tekshirib, sahifani yangilang.</div>"; });

  /* Avtomatik ro'yxat: kirgan har bir foydalanuvchiga (kuvonch.uz akkaunti, Google yoki yangi email) o'qituvchi profili
     darhol "tasdiqlangan" holatda ochiladi. Admin kerak bo'lsa admin paneldan bloklaydi (holat: "rad"). */
  var REG = null;
  function profil() {
    var F = B.F;
    APP.innerHTML = '<p class="muted">Profil tekshirilmoqda…</p>';
    Promise.all([
      F.getDoc(F.doc(B.db, "admins", USER.uid))["catch"](function () { return null; }),
      F.getDoc(F.doc(B.db, "t1_oqituvchilar", USER.uid))["catch"](function () { return null; })
    ]).then(function (r) {
      ADMIN = !!(r[0] && r[0].exists()); PROF = r[1] && r[1].exists() ? r[1].data() : null;
      if (ADMIN || (PROF && PROF.holat === "tasdiqlangan")) return panel();
      if (PROF && PROF.holat === "rad") return blok();
      var ref = F.doc(B.db, "t1_oqituvchilar", USER.uid), fio = ((REG && REG.fio) || USER.displayName || (USER.email || "O‘qituvchi").split("@")[0]).slice(0, 80);
      var w = PROF ? F.updateDoc(ref, { holat: "tasdiqlangan" })
        : F.setDoc(ref, { fio: fio, email: USER.email || "", telefon: ((REG && REG.tel) || "").slice(0, 20), fanlar_izoh: ((REG && REG.fanlar) || "").slice(0, 300), holat: "tasdiqlangan", yaratildi: F.serverTimestamp() });
      return w.then(function () { REG = null; return F.getDoc(ref); }).then(function (d) { PROF = d.data(); panel(true); });
    })["catch"](function (e) {
      APP.innerHTML = '<div class="card"><p class="note bad">Profilni ochib bo‘lmadi: ' + esc(xato(e)) + '</p><div class="toolbar"><button class="btn" id="qayta">Qayta urinish</button><button class="btn ghost" id="chiq">Chiqish</button></div></div>';
      $("#qayta").addEventListener("click", profil); $("#chiq").addEventListener("click", chiqish);
    });
  }

  /* ================= Kirish / ro'yxatdan o'tish ================= */
  var GICO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>';
  function kirish() {
    APP.innerHTML =
      '<div class="grid g2">' +
      '<form class="card" id="f-kir"><h2>Kirish</h2><p class="muted small">kuvonch.uz’dagi akkauntingiz bo‘lsa — o‘sha email va parol bilan kiring. Kabinet avtomatik ochiladi, alohida ariza shart emas.</p>' +
      '<button type="button" class="btn gbtn" id="gkir">' + GICO + ' Google (Gmail) bilan kirish</button>' +
      '<p class="yoki"><span>yoki email bilan</span></p>' +
      '<label class="f"><span>Email</span><input type="email" name="email" required autocomplete="username"></label>' +
      '<label class="f"><span>Parol</span><input type="password" name="parol" required autocomplete="current-password" minlength="6"></label>' +
      '<div class="toolbar"><button class="btn">Kirish</button><button type="button" class="btn ghost sm" id="unut">Parolni unutdim</button></div><div data-m></div></form>' +
      '<form class="card" id="f-roy"><h2>Ro‘yxatdan o‘tish</h2><p class="muted small">Akkaunt darhol ochiladi — kutish yo‘q. Gmail bo‘lsa, chapdagi «Google bilan kirish» eng oson yo‘l.</p>' +
      '<label class="f"><span>F.I.O.</span><input type="text" name="fio" required maxlength="80" placeholder="Familiya Ism Otasining ismi"></label>' +
      '<label class="f"><span>Email</span><input type="email" name="email" required autocomplete="email"></label>' +
      '<label class="f"><span>Telefon (ixtiyoriy)</span><input type="tel" name="tel" maxlength="20" placeholder="+998 __ ___ __ __"></label>' +
      '<label class="f"><span>Qaysi fan(lar)dan dars berasiz? (ixtiyoriy)</span><textarea name="fanlar" rows="2" maxlength="300" placeholder="Masalan: Zamonaviy tikuv jihozlari"></textarea></label>' +
      '<label class="f"><span>Parol (kamida 6 belgi)</span><input type="password" name="parol" required minlength="6" autocomplete="new-password"></label>' +
      '<label class="f"><span>Parolni takrorlang</span><input type="password" name="parol2" required minlength="6" autocomplete="new-password"></label>' +
      '<button class="btn">Ro‘yxatdan o‘tish</button><div data-m></div></form></div>';
    var fk = $("#f-kir"), fr = $("#f-roy"), mk = $("[data-m]", fk), mr = $("[data-m]", fr);
    fk.addEventListener("submit", function (e) {
      e.preventDefault(); msg(mk, "Tekshirilmoqda…");
      B.A.signInWithEmailAndPassword(B.auth, fk.email.value.trim(), fk.parol.value)["catch"](function (er) {
        msg(mk, esc(xato(er)) + (/credential|password|user-not-found/.test(er && er.code || "") ? " Parolni eslay olmasangiz — «Parolni unutdim» tugmasini bosing, tiklash havolasi emailingizga boradi." : ""), "bad");
      });
    });
    $("#gkir").addEventListener("click", function () { google(mk); });
    $("#unut").addEventListener("click", function () { tikla(fk.email.value.trim(), mk, fk.email); });
    fr.addEventListener("submit", function (e) {
      e.preventDefault();
      if (fr.parol.value !== fr.parol2.value) { msg(mr, "Parollar bir xil emas.", "bad"); return; }
      var em = fr.email.value.trim(), pw = fr.parol.value, fio = fr.fio.value.trim();
      REG = { fio: fio, tel: fr.tel.value.trim(), fanlar: fr.fanlar.value.trim() };
      msg(mr, "Akkaunt ochilmoqda…");
      B.A.createUserWithEmailAndPassword(B.auth, em, pw).then(function (c) {
        return B.A.updateProfile(c.user, { displayName: fio })["catch"](function () {});
      })["catch"](function (er) {
        if (!er || er.code !== "auth/email-already-in-use") { REG = null; msg(mr, esc(xato(er)), "bad"); return; }
        // Bu email allaqachon ro'yxatdan o'tgan (masalan, kuvonch.uz'da) — shu parol bilan avtomatik kiramiz
        msg(mr, "Bu email bilan akkaunt bor — kirilmoqda…");
        return B.A.signInWithEmailAndPassword(B.auth, em, pw)["catch"](function () {
          REG = null;
          mr.innerHTML = '<p class="note bad">Bu email bilan akkaunt allaqachon bor, lekin parol mos kelmadi. Parolni eslay olmasangiz, tiklash havolasini emailingizga yuboramiz.</p><button type="button" class="btn sm" id="unut2">Parolni tiklash havolasini yuborish</button>';
          $("#unut2").addEventListener("click", function () { tikla(em, mr); });
        });
      });
    });
  }
  function google(m) {
    var A = B.A, p = new A.GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
    msg(m, "Google oynasi ochilmoqda…");
    A.signInWithPopup(B.auth, p)["catch"](function (er) {
      var c = (er && er.code) || "";
      if (/popup-blocked|operation-not-supported-in-this-environment/.test(c)) return A.signInWithRedirect(B.auth, p);
      if (/popup-closed-by-user|cancelled-popup-request/.test(c)) { msg(m, ""); return; }
      msg(m, esc(xato(er)), "bad");
    });
  }
  function tikla(em, m, inp) {
    if (!em) { msg(m, "Avval email manzilingizni yozing — tiklash havolasi o‘sha manzilga yuboriladi.", "bad"); if (inp) inp.focus(); return; }
    msg(m, "Yuborilmoqda…");
    try { B.auth.languageCode = "uz"; } catch (e) {}
    B.A.sendPasswordResetEmail(B.auth, em, { url: location.origin + location.pathname }).then(function () {
      msg(m, "Parolni tiklash havolasi <b>" + esc(em) + "</b> manziliga yuborildi. Pochtangizni oching (Gmail’da «Spam» va «Promotions» papkalarini ham tekshiring), havolani bosib yangi parol qo‘ying va shu yerdan qayta kiring.", "ok");
    })["catch"](function (er) { msg(m, esc(xato(er)), "bad"); });
  }
  function chiqish() { B.A.signOut(B.auth); }
  function blok() {
    APP.innerHTML = '<div class="card"><h2>Assalomu alaykum' + (PROF ? ", " + esc(PROF.fio) : "") + '!</h2><p>Bu akkaunt orqali material joylash admin tomonidan to‘xtatilgan. Savollar bo‘lsa, texnikum ma’muriyatiga murojaat qiling.</p><div class="toolbar"><button class="btn ghost" id="chiq">Chiqish</button></div></div>';
    $("#chiq").addEventListener("click", chiqish);
  }

  /* ================= Panel ================= */
  function panel(yangi) {
    var fio = (PROF && PROF.fio) || USER.displayName || USER.email;
    APP.innerHTML =
      '<div class="toolbar"><div><b>' + esc(fio) + '</b> <span class="tag ok">' + (ADMIN ? "admin" : "o‘qituvchi") + "</span>" + (yangi ? ' <span class="small muted">— kabinetingiz ochildi, xush kelibsiz!</span>' : "") + "</div><span class=sp></span>" +
      (ADMIN ? '<a class="btn ghost sm" href="' + ROOT + 'admin/">Admin panel</a>' : "") + '<button class="btn ghost sm" id="chiq">Chiqish</button></div>' +
      '<div class="steps" style="margin-bottom:22px"><div><b>Fanni tanlang</b><p class="small muted">Yo‘nalish, fan va semestr.</p></div><div><b>Hujjatlarni tashlang</b><p class="small muted">ZIP, Word, PDF, PowerPoint, Excel yoki RTR paketi.</p></div><div><b>AI tayyorlaydi</b><p class="small muted">Turini aniqlaydi, TMR tuzadi, yetishmayotgan xaritalarni qoralama qiladi.</p></div><div><b>Tekshirib, joylang</b><p class="small muted">Hammasi fan sahifasida chiqadi.</p></div></div>' +
      '<section class="card" id="s1"><h2>1. Fan</h2><div class="grid g3">' +
      '<label class="f"><span>Mutaxassislik (yoki umumta’lim)</span><select id="y"></select></label><label class="f"><span>Fan</span><select id="f"></select></label><label class="f"><span>Semestr</span><select id="s"></select></label></div><p class="small" id="plan"></p></section>' +
      '<section class="card" id="s2" style="margin-top:16px"><h2>2. Hujjatlar</h2>' +
      '<label class="drop" id="drop"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>' +
      '<p><b>Fayllarni shu yerga tashlang</b> yoki bosib tanlang</p><p class="small muted">ZIP arxiv, .docx, .pdf, .pptx, .xlsx, .html (RTR), rasm va video. Bitta fayl Drive’ga 25 MB gacha.</p>' +
      '<input type="file" id="fi" multiple hidden accept=".zip,.docx,.doc,.pdf,.pptx,.ppt,.xlsx,.xls,.txt,.md,.csv,.html,.htm,.jpg,.jpeg,.png,.svg,.webp,.gif,.mp4,.webm,.mp3"></label>' +
      '<div id="jar" style="margin-top:14px" hidden><div class="prog"><i></i></div><div class="log" style="margin-top:10px"></div></div></section>' +
      '<section class="card" id="s3" style="margin-top:16px" hidden></section>' +
      '<section class="card" id="s4" style="margin-top:16px"><h2>Mening materiallarim</h2><div id="mening"><p class="muted">Yuklanmoqda…</p></div></section>';
    $("#chiq").addEventListener("click", chiqish);
    tanlov(); dropzona(); mening();
  }

  function tanlov() {
    var ys = $("#y"), fs = $("#f"), ss = $("#s");
    ys.innerHTML = MAL.yonalishlar.map(function (y) { return '<option value="' + y.id + '">' + esc(y.qisqa || y.mutaxassislik) + "</option>"; }).join("");
    function fanlar() {
      var y = yon(); fs.innerHTML = ["kasbiy", "amaliyot", "umumtalim"].map(function (t) {
        var L = y.fanlar.filter(function (f) { return f.toifa === t; }); if (!L.length) return "";
        return '<optgroup label="' + { kasbiy: "Kasbiy (spes) fanlar", amaliyot: "Amaliyot", umumtalim: "Umumta’lim fanlari" }[t] + '">' + L.map(function (f) { return '<option value="' + f.id + '">' + esc(f.nomi) + "</option>"; }).join("") + "</optgroup>";
      }).join(""); semlar();
    }
    function semlar() { var f = fan(); ss.innerHTML = Object.keys(f.jami_soat).map(function (s) { return '<option value="' + s + '">' + s + "-semestr (" + f.jami_soat[s] + " soat)</option>"; }).join(""); plan(); }
    function plan() {
      var p = rejaSoat();
      $("#plan").innerHTML = "O‘quv reja: jami <b>" + p.jami + "</b> soat" + (p.auditoriya ? ", auditoriya <b>" + p.auditoriya + "</b> soat (" + p.auditoriya / 2 + " ta dars)" : " (auditoriya soati kasb-emis’dan aniqlanadi)") +
        ' · <a href="' + ROOT + "yonalish/" + yon().id + "/fan/" + fan().id + '/?sem=' + ss.value + '" target="_blank">fan sahifasi</a>';
    }
    ys.addEventListener("change", fanlar); fs.addEventListener("change", semlar); ss.addEventListener("change", plan);
    // 08-26 / Zamonaviy tikuv jihozlari kabi URL orqali oldindan tanlash: ?y=...&f=...
    var u = new URLSearchParams(location.search);
    if (u.get("y")) ys.value = u.get("y"); fanlar(); if (u.get("f")) { fs.value = u.get("f"); semlar(); }
  }
  function yon() { var id = $("#y").value; return MAL.yonalishlar.filter(function (y) { return y.id === id; })[0]; }
  function fan() { var id = $("#f").value, y = yon(); return y.fanlar.filter(function (f) { return f.id === id; })[0] || y.fanlar[0]; }
  function rejaSoat() { var f = fan(), s = $("#s").value || Object.keys(f.jami_soat)[0]; return { jami: f.jami_soat[s], auditoriya: f.auditoriya_soat_taxminiy[s] }; }

  /* ================= Fayllarni qabul qilish ================= */
  function dropzona() {
    var d = $("#drop"), fi = $("#fi");
    ["dragenter", "dragover"].forEach(function (ev) { d.addEventListener(ev, function (e) { e.preventDefault(); d.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { d.addEventListener(ev, function (e) { e.preventDefault(); d.classList.remove("over"); }); });
    d.addEventListener("drop", function (e) { if (e.dataTransfer.files.length) qabul(e.dataTransfer.files); });
    fi.addEventListener("change", function () { if (fi.files.length) qabul(fi.files); fi.value = ""; });
  }
  function jar(p, t) {
    var j = $("#jar"); j.hidden = false;
    if (p != null) $(".prog i", j).style.width = Math.round(p * 100) + "%";
    if (t) { var l = $(".log", j); l.textContent += t + "\n"; l.scrollTop = 1e9; }
  }
  function qabul(list) {
    ISH = { fayllar: [], rtr: null, tmr: [], ai: false };
    $(".log", $("#jar")).textContent = ""; $("#s3").hidden = true;
    var arr = Array.prototype.slice.call(list);
    jar(0, arr.length + " ta fayl qabul qilindi. Ochilmoqda…");
    var zips = arr.filter(function (f) { return ext(f.name) === "zip"; });
    (zips.length ? lib("jszip") : Promise.resolve()).then(function () {
      return arr.reduce(function (p, f) { return p.then(function () { return ext(f.name) === "zip" ? ochZip(f) : qosh(f.name, f, f.name); }); }, Promise.resolve());
    }).then(function () {
      jar(0.15, "Jami " + ISH.fayllar.length + " ta fayl. Matn ajratilmoqda…");
      return ISH.fayllar.reduce(function (p, x, i) { return p.then(function () { return matnAjrat(x).then(function () { jar(0.15 + 0.45 * (i + 1) / ISH.fayllar.length); }); }); }, Promise.resolve());
    }).then(function () {
      ISH.fayllar.forEach(function (x) { if (!x.turi) { var t = taxmin(x); x.turi = t.turi; x.dars = x.dars || t.dars; x.sarlavha = x.sarlavha || t.sarlavha; } });
      if (ISH.rtr) ISH.fayllar.forEach(function (x) { if (x.turi === "media") x.joyla = false; });
      if (ISH.rtr) { jar(0.62, "RTR paketi topildi: " + (ISH.rtr.topics || []).length + " ta mavzu, test va glossariy — to‘liq import qilinadi (AI shart emas)."); return; }
      return aiTasnif();
    }).then(function () { return tmrTuz(); }).then(function () { jar(1, "Tayyor. Natijani tekshiring va «E-bazaga joylash» tugmasini bosing."); natija(); })
      ["catch"](function (e) { jar(null, "XATO: " + xato(e)); console.error(e); });
  }
  function ochZip(f) {
    jar(null, "Arxiv ochilmoqda: " + f.name);
    return JSZip.loadAsync(f).then(function (z) {
      var ps = [];
      z.forEach(function (path, e) {
        if (e.dir || /(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db)/.test(path)) return;
        ps.push(e.async("blob").then(function (b) { return ext(path) === "zip" ? ochZip(new File([b], path.split("/").pop())) : qosh(path.split("/").pop(), b, path); }));
      });
      return Promise.all(ps);
    });
  }
  function qosh(nom, blob, yol) { ISH.fayllar.push({ nom: nom, yol: yol || nom, ext: ext(nom), hajm: blob.size, blob: blob, matn: "", html: "", turi: "", dars: 0, sarlavha: "", joyla: true }); return Promise.resolve(); }

  /* ---------- Matn ajratish ---------- */
  function txt2html(t) { return t.split(/\n{2,}/).map(function (p) { return "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>"; }).join(""); }
  function strip(h) { var d = document.createElement("div"); d.innerHTML = h; return (d.textContent || "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(); }
  function matnAjrat(x) {
    var e = x.ext;
    var p;
    if (e === "docx") p = lib("mammoth").then(function () { return x.blob.arrayBuffer(); }).then(function (ab) {
      return mammoth.convertToHtml({ arrayBuffer: ab }, { convertImage: mammoth.images.imgElement(function () { return Promise.resolve({ src: "" }); }) });
    }).then(function (r) { x.html = r.value.replace(/<img[^>]*src=""[^>]*>/g, ""); x.matn = strip(x.html); });
    else if (e === "pdf") p = lib("pdf").then(function () {
      pdfjsLib.GlobalWorkerOptions.workerSrc = CDN.pdfw; return x.blob.arrayBuffer();
    }).then(function (ab) { return pdfjsLib.getDocument({ data: ab }).promise; }).then(function (pdf) {
      var n = Math.min(pdf.numPages, 80), ps = [];
      for (var i = 1; i <= n; i++) ps.push(pdf.getPage(i).then(function (pg) { return pg.getTextContent(); }).then(function (c) { return c.items.map(function (it) { return it.str + (it.hasEOL ? "\n" : " "); }).join(""); }));
      return Promise.all(ps);
    }).then(function (pages) { x.matn = pages.join("\n\n").trim(); x.html = pages.map(function (t, i) { return '<h4 class="small muted">' + (i + 1) + "-sahifa</h4>" + txt2html(t); }).join(""); });
    else if (e === "pptx") p = lib("jszip").then(function () { return JSZip.loadAsync(x.blob); }).then(function (z) {
      var sl = Object.keys(z.files).filter(function (k) { return /^ppt\/slides\/slide\d+\.xml$/.test(k); }).sort(function (a, b) { return (+a.match(/\d+/)[0]) - (+b.match(/\d+/)[0]); });
      return Promise.all(sl.map(function (k) { return z.file(k).async("string"); }));
    }).then(function (xs) {
      var sl = xs.map(function (s) { return (s.match(/<a:t>([^<]*)<\/a:t>/g) || []).map(function (t) { return t.replace(/<\/?a:t>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'"); }); });
      x.matn = sl.map(function (a, i) { return "Slayd " + (i + 1) + ": " + a.join(" "); }).join("\n");
      x.html = sl.map(function (a, i) { return "<h4>" + (i + 1) + "-slayd</h4>" + (a.length ? "<p>" + a.map(esc).join("<br>") + "</p>" : ""); }).join("");
      x.sarlavha = x.sarlavha || (sl[0] && sl[0][0]) || "";
    });
    else if (e === "xlsx" || e === "xls") p = lib("xlsx").then(function () { return x.blob.arrayBuffer(); }).then(function (ab) {
      var wb = XLSX.read(ab, { type: "array" });
      x.html = wb.SheetNames.slice(0, 6).map(function (n) { var h = XLSX.utils.sheet_to_html(wb.Sheets[n]); var m = /<table[\s\S]*<\/table>/i.exec(h); return "<h4>" + esc(n) + '</h4><div class="tbl-w">' + (m ? m[0] : "") + "</div>"; }).join("");
      x.matn = wb.SheetNames.slice(0, 6).map(function (n) { return n + "\n" + XLSX.utils.sheet_to_csv(wb.Sheets[n]); }).join("\n\n");
    });
    else if (e === "txt" || e === "md" || e === "csv") p = x.blob.text().then(function (t) { x.matn = t; x.html = e === "csv" ? "<pre>" + esc(t) + "</pre>" : txt2html(t); });
    else if (e === "html" || e === "htm") p = x.blob.text().then(function (t) {
      var m = /window\.RTR\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/.exec(t);
      if (m) { try { ISH.rtr = JSON.parse(m[1]); ISH.rtrDir = x.yol.replace(/[^/]*$/, ""); x.turi = "rtr"; x.sarlavha = "Interaktiv RTR: " + ((ISH.rtr.meta && ISH.rtr.meta.modul) || x.nom); x.joyla = false; return; } catch (er) { /* oddiy html */ } }
      x.html = t.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, ""); var b = /<body[^>]*>([\s\S]*)<\/body>/i.exec(x.html); if (b) x.html = b[1]; x.matn = strip(x.html);
    });
    else { if (/^(jpg|jpeg|png|svg|webp|gif|mp4|webm|mp3)$/.test(e)) x.turi = "media"; p = Promise.resolve(); }
    return p.then(function () { if (x.matn) jar(null, "✓ " + x.yol + " — " + x.matn.length + " belgi"); })["catch"](function (er) { jar(null, "! " + x.yol + ": matn ajratilmadi (" + xato(er) + ")"); });
  }

  /* ---------- Qoidalar bo'yicha taxmin (AI ishlamasa ham ishlaydi) ---------- */
  function taxmin(x) {
    var n = (x.yol + " " + (x.matn || "").slice(0, 400)).toLowerCase().replace(/[ʻʼ‘’`']/g, "");
    var R = [["tmr", /\btmr\b|taqvim|mavzu.?reja|kalendar|календар/], ["xarita", /texnologik.?xarita|texnik.?xarita|tex\.?.?xarita|ishlanma|технологическ/], ["oum", /majmua|\boum\b|uslubiy majm|умк/],
      ["maruza", /maruza|lekts|лекци|matni/], ["amaliy", /amaliy|laborator|практич|лаборатор/], ["mustaqil", /mustaqil|самостоят/], ["nazorat", /\btest|nazorat|bilet|savol|контрол/],
      ["glossariy", /glossar|atamalar|глоссар/], ["dastur", /dastur|programma|программ/], ["taqdimot", /taqdimot|slayd|презентац/]];
    var t = "boshqa";
    for (var i = 0; i < R.length; i++) if (R[i][1].test(n)) { t = R[i][0]; break; }
    if (t === "boshqa" && /^(pptx|ppt)$/.test(x.ext)) t = "taqdimot";
    if (/^(jpg|jpeg|png|svg|webp|gif|mp4|webm|mp3)$/.test(x.ext)) t = "media";
    var m = /(?:^|[^0-9])(\d{1,2})\s*[-_. ]?\s*(?:mavzu|dars|maruza|amaliy|xarita)/i.exec(x.nom) || /(?:mavzu|dars|maruza|amaliy|xarita|^t)\s*[-_№#. ]?\s*(\d{1,2})(?!\d)/i.exec(x.nom) || /^(\d{1,2})(?!\d)/.exec(x.nom);
    return { turi: t, dars: m ? +m[1] : 0, sarlavha: x.nom.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ") };
  }

  /* ---------- AI: turi, dars raqami va sarlavha ---------- */
  function aiTasnif() {
    var L = ISH.fayllar.filter(function (x) { return x.matn && x.turi !== "rtr"; });
    if (!L.length) return Promise.resolve();
    jar(0.65, "AI hujjatlarni tahlil qilmoqda (" + L.length + " ta)…");
    var f = fan(), batches = [];
    for (var i = 0; i < L.length; i += 25) batches.push(L.slice(i, i + 25));
    return batches.reduce(function (p, b) {
      return p.then(function () {
        var items = b.map(function (x) { return { i: ISH.fayllar.indexOf(x), fayl: x.yol, boshi: x.matn.slice(0, 1200) }; });
        var prompt = "Fan: «" + f.nomi + "» (" + yon().mutaxassislik + ", texnikum). Quyidagi o‘qituvchi fayllarini tasnifla. Har biri uchun: turi (faqat: " + TURLAR.map(function (t) { return t[0]; }).join(", ") +
          "), dars (dars/mavzu raqami, bo‘lmasa 0), sarlavha (mavzu nomi, o‘zbek lotin, 120 belgigacha). Faqat JSON massiv qaytar: [{\"i\":..,\"turi\":\"..\",\"dars\":..,\"sarlavha\":\"..\"}].\n\n" + JSON.stringify(items);
        return t1Bulut.ai(prompt, { json: true, sys: "Sen kasbiy ta’lim metodistisan. Faqat so‘ralgan JSONni qaytar, hech narsa to‘qima." }).then(function (r) {
          (Array.isArray(r) ? r : r.natija || []).forEach(function (o) {
            var x = ISH.fayllar[o.i]; if (!x) return;
            if (TURLAR.some(function (t) { return t[0] === o.turi; })) x.turi = o.turi;
            if (+o.dars >= 0) x.dars = +o.dars || x.dars; if (o.sarlavha) x.sarlavha = String(o.sarlavha).slice(0, 160); x.ai_tasnif = true;
          });
          ISH.ai = true;
        });
      });
    }, Promise.resolve()).then(function () { jar(0.8, "✓ AI tahlili tugadi."); })["catch"](function (e) { jar(0.8, "AI ishlamadi (" + xato(e) + "). Fayllar nomi va matni bo‘yicha qoidalar asosida tasniflandi — kerak bo‘lsa qo‘lda tuzating."); });
  }

  /* ---------- TMR tuzish ---------- */
  function tmrTuz() {
    if (ISH.rtr) { ISH.tmr = (ISH.rtr.topics || []).map(function (t) { return { mavzu: t.nomi, tur: /amaliy/i.test(t.turi) ? "A" : "N", soat: +t.soat || 2 }; }); return Promise.resolve(); }
    var tf = ISH.fayllar.filter(function (x) { return x.turi === "tmr" && x.matn; })[0];
    if (tf) {
      var rows = jadvaldan(tf.html);
      if (rows.length >= 3) { ISH.tmr = rows; jar(0.85, "✓ TMR jadvali «" + tf.nom + "» faylidan o‘qildi: " + rows.length + " ta dars."); return Promise.resolve(); }
      jar(0.85, "AI TMRni «" + tf.nom + "» matnidan ajratmoqda…");
      return t1Bulut.ai("Quyidagi taqvim-mavzu reja matnidan darslar ro‘yxatini ajrat. Har qator: mavzu (qisqa), tur (N — nazariy, A — amaliy, L — laboratoriya, ON — oraliq nazorat, YN — yakuniy nazorat), soat (butun son). Faqat JSON: {\"qatorlar\":[{\"mavzu\":\"..\",\"tur\":\"N\",\"soat\":2}]}.\n\n" + tf.matn.slice(0, 40000), { json: true })
        .then(function (r) { ISH.tmr = ((r && r.qatorlar) || []).map(function (q) { return { mavzu: String(q.mavzu || "").slice(0, 200), tur: q.tur || "N", soat: +q.soat || 2 }; }); jar(0.9, "✓ AI " + ISH.tmr.length + " ta dars ajratdi."); })
        ["catch"](function (e) { jar(0.9, "TMRni avtomatik ajratib bo‘lmadi (" + xato(e) + ") — quyida qo‘lda kiriting."); });
    }
    var dl = ISH.fayllar.filter(function (x) { return (x.turi === "maruza" || x.turi === "amaliy" || x.turi === "xarita") && x.dars; });
    var by = {}; dl.forEach(function (x) { if (!by[x.dars] || x.turi !== "xarita") by[x.dars] = x; });
    ISH.tmr = Object.keys(by).map(Number).sort(function (a, b) { return a - b; }).map(function (n) { return { mavzu: by[n].sarlavha, tur: by[n].turi === "amaliy" ? "A" : "N", soat: 2 }; });
    if (ISH.tmr.length) jar(0.9, "TMR fayli yo‘q — " + ISH.tmr.length + " ta dars ma’ruza/amaliy fayllardan tuzildi (har biri 2 soat). Tekshiring.");
    return Promise.resolve();
  }
  function jadvaldan(html) {
    if (!html) return [];
    var d = new DOMParser().parseFromString(html, "text/html"), out = [];
    Array.prototype.forEach.call(d.querySelectorAll("table"), function (tb) {
      var rows = Array.prototype.map.call(tb.querySelectorAll("tr"), function (tr) { return Array.prototype.map.call(tr.querySelectorAll("td,th"), function (c) { return c.textContent.replace(/\s+/g, " ").trim(); }); });
      var hi = -1, cm = -1, cs = -1, ct = -1;
      rows.some(function (r, i) {
        r.forEach(function (c, j) { var l = c.toLowerCase(); if (cm < 0 && /mavzu|тема|nomi/.test(l)) cm = j; if (cs < 0 && /soat|час/.test(l)) cs = j; if (ct < 0 && /turi|shakli|вид/.test(l)) ct = j; });
        if (cm >= 0 && cs >= 0) { hi = i; return true; } cm = cs = ct = -1; return false;
      });
      if (hi < 0) return;
      rows.slice(hi + 1).forEach(function (r) {
        var m = r[cm], s = parseFloat((r[cs] || "").replace(",", "."));
        if (m && m.length > 2 && s > 0 && s <= 20 && !/^jami|^итого/i.test(m)) {
          var t = (r[ct] || "").toLowerCase(), ml = m.toLowerCase(), tur = /oraliq|\bon\b/.test(t + " " + ml) ? "ON" : /yakuniy|\byn\b/.test(t + " " + ml) ? "YN" : /amal|практ/.test(t) ? "A" : /lab/.test(t) ? "L" : "N";
          out.push({ mavzu: m.slice(0, 200), tur: tur, soat: s });
        }
      });
    });
    return out;
  }

  /* ================= Natija: tekshirish va tahrirlash ================= */
  function natija() {
    var s3 = $("#s3"); s3.hidden = false;
    var p = rejaSoat(), R = ISH.rtr;
    var rows = ISH.fayllar.map(function (x, i) {
      if (x.turi === "rtr") return "";
      return "<tr><td><input type=checkbox data-j=" + i + (x.joyla ? " checked" : "") + "></td><td>" + esc(x.yol) + '<br><span class="small muted">' + kb(x.hajm) + (x.matn ? " · " + x.matn.length + " belgi" : "") + (x.hajm > MAX_DRIVE ? ' · <b style="color:var(--bad)">Drive uchun katta</b>' : "") +
        "</span></td><td><select data-t=" + i + ">" + TURLAR.map(function (t) { return '<option value="' + t[0] + '"' + (t[0] === x.turi ? " selected" : "") + ">" + t[1] + "</option>"; }).join("") +
        '</select></td><td><input type=text inputmode=numeric data-d=' + i + ' value="' + (x.dars || "") + '" style="width:64px"></td><td><input type=text data-s=' + i + ' value="' + esc(x.sarlavha) + '"></td></tr>';
    }).join("");
    s3.innerHTML = "<h2>3. Natija — tekshiring</h2>" +
      (R ? '<div class="note ok"><b>Raqamli ta’lim resursi (RTR) aniqlandi:</b> «' + esc((R.meta && R.meta.modul) || "") + "» — " + (R.topics || []).length + " ta mavzu, " + (R.mustaqil || []).length + " ta mustaqil ish, " +
        (R.glossariy || []).length + " ta atama, yakuniy test " + ((R.yakuniy && R.yakuniy.test) || []).length + " ta. TMR, texnologik xaritalar, ma’ruzalar va O‘UM avtomatik tayyorlanadi; rasm va videolar Drive’ga yuklanadi.</div>" : "") +
      (ISH.ai ? '<p class="small muted">✓ Fayllar AI yordamida tasniflandi. Noto‘g‘ri joyini tuzating.</p>' : "") +
      '<h3>Fayllar</h3><div class="tbl-w"><table><thead><tr><th>Joylash</th><th>Fayl</th><th>Turi</th><th>Dars №</th><th>Sarlavha</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      '<h3 style="margin-top:20px">TMR</h3><div id="tmr-ed"></div>' +
      '<div class="toolbar" style="margin-top:12px"><button class="btn ghost sm" id="tmr-qator">+ Qator qo‘shish</button>' + (R ? "" : '<button class="btn ghost sm" id="ai-xarita">AI: yetishmayotgan texnologik xaritalarni tuzish</button>') + "</div>" +
      '<div id="ai-holat"></div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0">' +
      '<div class="toolbar"><button class="btn" id="joyla">E-bazaga joylash</button><span class="small muted">' + (SOZ.drive_url ? "Asl fayllar Google Drive’ga saqlanadi." : "Drive manzili hali sozlanmagan — asl fayllar saqlanmaydi, faqat matn joylanadi.") + '</span></div><div id="joy-holat"></div>';
    $$("[data-j]", s3).forEach(function (c) { c.addEventListener("change", function () { ISH.fayllar[+c.getAttribute("data-j")].joyla = c.checked; }); });
    $$("[data-t]", s3).forEach(function (c) { c.addEventListener("change", function () { ISH.fayllar[+c.getAttribute("data-t")].turi = c.value; }); });
    $$("[data-d]", s3).forEach(function (c) { c.addEventListener("input", function () { ISH.fayllar[+c.getAttribute("data-d")].dars = parseInt(c.value, 10) || 0; }); });
    $$("[data-s]", s3).forEach(function (c) { c.addEventListener("input", function () { ISH.fayllar[+c.getAttribute("data-s")].sarlavha = c.value; }); });
    tmrEd(); $("#tmr-qator").addEventListener("click", function () { ISH.tmr.push({ mavzu: "", tur: "N", soat: 2 }); tmrEd(); });
    var ax = $("#ai-xarita"); if (ax) ax.addEventListener("click", aiXarita);
    $("#joyla").addEventListener("click", joyla);
    s3.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function tmrEd() {
    var p = rejaSoat(), sum = ISH.tmr.reduce(function (a, r) { return a + (+r.soat || 0); }, 0), box = $("#tmr-ed");
    box.innerHTML = (p.auditoriya ? '<p class="note ' + (sum === p.auditoriya ? "ok" : "bad") + '">' + (sum === p.auditoriya ? "✓ " : "✗ ") + "TMR jami <b>" + sum + "</b> soat, o‘quv rejada auditoriya <b>" + p.auditoriya + "</b> soat." + (sum === p.auditoriya ? "" : " Farq: " + (p.auditoriya - sum) + " soat.") + "</p>" : "") +
      (ISH.tmr.length ? '<div class="tbl-w"><table><thead><tr><th class=n>№</th><th>Mavzu</th><th>Turi</th><th class=n>Soat</th><th></th></tr></thead><tbody>' + ISH.tmr.map(function (r, i) {
        return "<tr><td class=n>" + (i + 1) + '</td><td><input type=text data-tm=' + i + ' value="' + esc(r.mavzu) + '"></td><td><select data-tt=' + i + ">" + ["N", "A", "L", "ON", "YN"].map(function (t) { return "<option" + (t === r.tur ? " selected" : "") + ">" + t + "</option>"; }).join("") +
          "</select></td><td><input type=text inputmode=numeric data-ts=" + i + ' value="' + r.soat + '" style="width:60px"></td><td><button class="btn ghost sm" data-tx=' + i + ' aria-label="O‘chirish">✕</button></td></tr>';
      }).join("") + "</tbody></table></div>" : '<p class="muted">TMR topilmadi. «Qator qo‘shish» bilan kiriting yoki TMR faylini ham yuklang.</p>');
    $$("[data-tm]", box).forEach(function (c) { c.addEventListener("input", function () { ISH.tmr[+c.getAttribute("data-tm")].mavzu = c.value; }); });
    $$("[data-tt]", box).forEach(function (c) { c.addEventListener("change", function () { ISH.tmr[+c.getAttribute("data-tt")].tur = c.value; }); });
    $$("[data-ts]", box).forEach(function (c) { c.addEventListener("change", function () { ISH.tmr[+c.getAttribute("data-ts")].soat = parseFloat(c.value) || 0; tmrEd(); }); });
    $$("[data-tx]", box).forEach(function (c) { c.addEventListener("click", function () { ISH.tmr.splice(+c.getAttribute("data-tx"), 1); tmrEd(); }); });
  }

  /* ---------- AI: yetishmayotgan texnologik xaritalar (qoralama) ---------- */
  function aiXarita() {
    var bor = {}; ISH.fayllar.forEach(function (x) { if (x.turi === "xarita" && x.dars) bor[x.dars] = 1; });
    var kerak = ISH.tmr.map(function (r, i) { return { n: i + 1, r: r }; }).filter(function (o) { return !bor[o.n] && o.r.mavzu; });
    var h = $("#ai-holat");
    if (!kerak.length) { msg(h, "Barcha darslar uchun texnologik xarita bor.", "ok"); return; }
    if (!confirm(kerak.length + " ta dars uchun texnologik xarita qoralamasi AI bilan tuziladi. Davom etilsinmi?")) return;
    var f = fan(), y = yon(), n = 0, btn = $("#ai-xarita"); btn.disabled = true;
    return kerak.reduce(function (p, o) {
      return p.then(function () {
        msg(h, "AI xarita tuzmoqda: " + (++n) + " / " + kerak.length + " — " + esc(o.r.mavzu));
        var lec = ISH.fayllar.filter(function (x) { return x.dars === o.n && x.matn && x.turi !== "xarita"; })[0];
        var pr = "Texnikum, mutaxassislik: «" + y.mutaxassislik + "», fan: «" + f.nomi + "». " + o.n + "-dars: «" + o.r.mavzu + "» (" + ({ N: "nazariy", A: "amaliy", L: "laboratoriya", ON: "oraliq nazorat", YN: "yakuniy nazorat" }[o.r.tur] || "nazariy") +
          ", 80 daqiqa). Shu dars uchun texnologik xarita tuz. Bosqichlar vaqti yig‘indisi aniq 80 bo‘lsin. Faqat JSON: {\"maqsad\":{\"talimiy\":\"\",\"tarbiyaviy\":\"\",\"rivojlantiruvchi\":\"\"},\"natijalar\":[\"\"],\"metodlar\":[\"\"],\"jihozlar\":[\"\"],\"bosqichlar\":[{\"nomi\":\"\",\"daqiqa\":5,\"oqituvchi\":\"\",\"oquvchi\":\"\"}],\"baholash\":\"\",\"uyga_vazifa\":\"\"}" +
          (lec ? "\n\nDars materiali (asos qilib ol, faktlarni to‘qima):\n" + lec.matn.slice(0, 9000) : "");
        return t1Bulut.ai(pr, { json: true, sys: "Sen O‘zbekiston kasbiy ta’lim tizimidagi tajribali metodistsan. O‘zbek tilida (lotin) yoz." }).then(function (j) {
          ISH.fayllar.push({ nom: o.n + "-dars texnologik xarita (AI).html", yol: o.n + "-dars texnologik xarita (AI qoralama)", ext: "html", hajm: 0, blob: null, matn: "", html: xaritaHtml(j, o, f), turi: "xarita", dars: o.n, sarlavha: o.r.mavzu, joyla: true, ai: true });
        })["catch"](function (e) { msg(h, "AI xatosi: " + esc(xato(e)), "bad"); throw e; });
      });
    }, Promise.resolve()).then(function () { natija(); msg($("#ai-holat"), "✓ " + kerak.length + " ta xarita qoralamasi qo‘shildi («AI qoralama» belgisi bilan). Joylashdan oldin ko‘rib chiqing.", "ok"); })["catch"](function () { btn.disabled = false; });
  }
  function xaritaHtml(j, o, f) {
    j = j || {}; var m = j.maqsad || {}, b = j.bosqichlar || [], sum = b.reduce(function (a, x) { return a + (+x.daqiqa || 0); }, 0);
    var li = function (a) { return "<ul>" + (a || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; };
    return '<div class="kv"><div>Mavzu</div><div>' + esc(o.r.mavzu) + "</div><div>Fan</div><div>" + esc(f.nomi) + "</div><div>Dars</div><div>" + o.n + "-dars, 80 daqiqa</div>" +
      "<div>Ta’limiy maqsad</div><div>" + esc(m.talimiy) + "</div><div>Tarbiyaviy maqsad</div><div>" + esc(m.tarbiyaviy) + "</div><div>Rivojlantiruvchi maqsad</div><div>" + esc(m.rivojlantiruvchi) + "</div>" +
      "<div>Kutilayotgan natijalar</div><div>" + li(j.natijalar) + "</div><div>Metodlar</div><div>" + li(j.metodlar) + "</div><div>Jihozlar</div><div>" + li(j.jihozlar) + "</div></div>" +
      '<div class="tbl-w"><table><thead><tr><th>Bosqich</th><th class=n>Daq.</th><th>O‘qituvchi faoliyati</th><th>O‘quvchi faoliyati</th></tr></thead><tbody>' +
      b.map(function (x) { return "<tr><td>" + esc(x.nomi) + "</td><td class=n>" + esc(x.daqiqa) + "</td><td>" + esc(x.oqituvchi) + "</td><td>" + esc(x.oquvchi) + "</td></tr>"; }).join("") +
      '<tr class="jami"><td>Jami</td><td class=n>' + sum + "</td><td></td><td></td></tr></tbody></table></div><p><b>Baholash:</b> " + esc(j.baholash) + "</p><p><b>Uyga vazifa:</b> " + esc(j.uyga_vazifa) + "</p>";
  }

  /* ================= E-bazaga joylash ================= */
  function b64(blob) { return new Promise(function (ok, no) { var r = new FileReader(); r.onload = function () { ok(String(r.result).split(",")[1] || ""); }; r.onerror = no; r.readAsDataURL(blob); }); }
  function driveYukla(x, token, meta) {
    return b64(x.blob).then(function (d) {
      return fetch(SOZ.drive_url, { method: "POST", body: JSON.stringify({ amal: "yukla", token: token, yonalish: meta.yn, fan: meta.fn, sem: meta.sem, oqituvchi: meta.fio, nom: x.nom, yol: x.yol, mime: x.blob.type || "", b64: d }) });
    }).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.xato || "Drive xatosi"); return j.id; });
  }
  function joyla() {
    var btn = $("#joyla"), h = $("#joy-holat"), F = B.F, y = yon(), f = fan(), sem = $("#s").value, fio = (PROF && PROF.fio) || USER.displayName || USER.email;
    var L = ISH.fayllar.filter(function (x) { return x.joyla && x.turi !== "rtr"; });
    if (!L.length && !ISH.rtr && !ISH.tmr.length) { msg(h, "Joylash uchun hech narsa tanlanmagan.", "bad"); return; }
    btn.disabled = true;
    var key = y.id + "__" + f.id + "__s" + sem + "__" + USER.uid, mref = F.doc(B.db, "t1_materiallar", key), media = {}, done = 0;
    var meta = { yn: y.qisqa || y.mutaxassislik, fn: f.nomi, sem: sem, fio: fio };
    var drive = !!SOZ.drive_url, rtrMedia = ISH.rtr ? ISH.fayllar.filter(function (x) { return x.turi === "media" || /^(svg|jpg|jpeg|png|webp|mp4|webm)$/.test(x.ext); }) : [];
    var yuk = drive ? L.concat(rtrMedia.filter(function (x) { return L.indexOf(x) < 0; })).filter(function (x) { return x.blob && x.hajm <= MAX_DRIVE; }) : [];
    var jami = yuk.length + L.length + 2;
    function step(t) { done++; msg(h, '<div class="prog"><i style="width:' + Math.round(done / jami * 100) + '%"></i></div><p class="small">' + esc(t) + "</p>"); }
    purifyLoad().then(function () { return drive ? USER.getIdToken() : null; }).then(function (token) {
      // 1) Asl fayllar → Google Drive (bir vaqtda 2 tadan)
      var q = yuk.slice(), ish = [];
      function keyingi() {
        var x = q.shift(); if (!x) return Promise.resolve();
        return driveYukla(x, token, meta).then(function (id) { x.drive_id = id; if (rtrMedia.indexOf(x) >= 0) media[x.yol.indexOf(ISH.rtrDir || "") === 0 ? x.yol.slice((ISH.rtrDir || "").length) : x.yol] = id; step("Drive: " + x.yol); })
          ["catch"](function (e) { step("! Drive’ga yuklanmadi: " + x.yol + " (" + xato(e) + ")"); }).then(keyingi);
      }
      ish.push(keyingi(), keyingi());
      return Promise.all(ish);
    }).then(function () {
      // 2) Asosiy hujjat (fan + TMR)
      return F.getDoc(mref)["catch"](function () { return null; }).then(function (old) {
        var o = old && old.exists() ? old.data() : {};
        var d = { yonalish: y.id, fan: f.id, sem: String(sem), uid: USER.uid, oqituvchi: fio, yonalish_nomi: y.qisqa || y.mutaxassislik, fan_nomi: f.nomi, holat: o.holat || "joylangan",
          tmr: ISH.tmr.length ? ISH.tmr.filter(function (r) { return r.mavzu; }).slice(0, 300) : (o.tmr || []), rtr: !!ISH.rtr || !!o.rtr,
          media: Object.assign({}, o.media || {}, media), hujjatlar_soni: (o.hujjatlar_soni || 0) + L.length, yangilandi: F.serverTimestamp() };
        return F.setDoc(mref, d).then(function () { step("Fan ma’lumoti saqlandi."); });
      });
    }).then(function () {
      // 3) RTR bo'lsa — mazmunini bo'laklab saqlash (eski RTR almashtiriladi)
      if (!ISH.rtr) return;
      var hc = F.collection(B.db, "t1_materiallar", key, "hujjatlar");
      return F.getDocs(F.query(hc, F.where("turi", "==", "rtr"))).then(function (qs) {
        var del = []; qs.forEach(function (d) { del.push(F.deleteDoc(d.ref)); }); return Promise.all(del);
      }).then(function () {
        var D = ISH.rtr, rest = {}; Object.keys(D).forEach(function (k) { if (k !== "topics") rest[k] = D[k]; });
        var w = [F.setDoc(F.doc(hc, "rtr_meta"), { turi: "rtr", qism: "meta", tartib: 0, json: JSON.stringify(rest) })];
        (D.topics || []).forEach(function (t, i) { w.push(F.setDoc(F.doc(hc, "rtr_" + (t.id || i)), { turi: "rtr", qism: t.id || String(i), tartib: i + 1, json: JSON.stringify(t) })); });
        return Promise.all(w).then(function () { step("RTR mazmuni saqlandi (" + (D.topics || []).length + " mavzu)."); });
      });
    }).then(function () {
      // 4) Har bir hujjat: ro'yxat + matn (xavfsizlantirilgan HTML)
      return L.reduce(function (p, x, i) {
        return p.then(function () {
          var hid = "h" + Date.now().toString(36) + i, html = x.html ? DOMPurify.sanitize(x.html) : "", qisqa = html.length > MAX_HTML;
          if (qisqa) html = html.slice(0, MAX_HTML);
          var meta2 = { turi: x.turi, dars: x.dars || 0, sarlavha: (x.sarlavha || x.nom).slice(0, 200), nom: x.nom, ext: x.ext, hajm: x.hajm || 0, drive_id: x.drive_id || "", html: !!html, qisqartirilgan: qisqa, ai: !!x.ai, tartib: (x.dars || 99) * 100 + i };
          return F.setDoc(F.doc(B.db, "t1_materiallar", key, "hujjatlar", hid), meta2).then(function () {
            return html ? F.setDoc(F.doc(B.db, "t1_materiallar", key, "matnlar", hid), { html: html }) : null;
          }).then(function () { step("Joylandi: " + x.yol); });
        });
      }, Promise.resolve());
    }).then(function () {
      var url = ROOT + "yonalish/" + y.id + "/fan/" + f.id + "/?sem=" + sem;
      msg(h, "✓ Hammasi joylandi! <a href=\"" + url + "\" target=\"_blank\">Fan sahifasini ochish →</a>", "ok");
      btn.disabled = false; mening();
    })["catch"](function (e) { msg(h, "Xato: " + esc(xato(e)), "bad"); btn.disabled = false; console.error(e); });
  }
  function purifyLoad() { return lib("purify"); }

  /* ================= Mening materiallarim ================= */
  function mening() {
    var F = B.F, box = $("#mening"); if (!box) return;
    F.getDocs(F.query(F.collection(B.db, "t1_materiallar"), F.where("uid", "==", USER.uid))).then(function (qs) {
      var a = []; qs.forEach(function (d) { var x = d.data(); x.id = d.id; a.push(x); });
      if (!a.length) { box.innerHTML = '<p class="muted">Hali material joylanmagan.</p>'; return; }
      box.innerHTML = '<div class="tbl-w"><table><thead><tr><th>Fan</th><th>Yo‘nalish</th><th>Sem.</th><th class=n>Hujjat</th><th>Holat</th><th></th></tr></thead><tbody>' + a.map(function (x) {
        return '<tr><td><a href="' + ROOT + "yonalish/" + x.yonalish + "/fan/" + x.fan + "/?sem=" + x.sem + '" target="_blank">' + esc(x.fan_nomi) + "</a></td><td>" + esc(x.yonalish_nomi) + "</td><td>" + esc(x.sem) + "</td><td class=n>" + (x.hujjatlar_soni || 0) + (x.rtr ? " + RTR" : "") +
          "</td><td>" + (x.holat === "joylangan" ? '<span class="tag ok">saytda</span>' : '<span class="tag w">yashirin</span>') + '</td><td><button class="btn ghost sm" data-del="' + x.id + '">O‘chirish</button></td></tr>';
      }).join("") + "</tbody></table></div>";
      $$("[data-del]", box).forEach(function (b) { b.addEventListener("click", function () { if (confirm("Bu fan bo‘yicha joylagan barcha materiallaringiz saytdan o‘chirilsinmi? (Drive’dagi fayllar qoladi)")) ochir(b.getAttribute("data-del")).then(mening); }); });
    })["catch"](function (e) { box.innerHTML = '<p class="note bad">' + esc(xato(e)) + "</p>"; });
  }
  function ochir(key) {
    var F = B.F;
    return Promise.all(["hujjatlar", "matnlar"].map(function (c) {
      return F.getDocs(F.collection(B.db, "t1_materiallar", key, c)).then(function (qs) { var p = []; qs.forEach(function (d) { p.push(F.deleteDoc(d.ref)); }); return Promise.all(p); });
    })).then(function () { return F.deleteDoc(F.doc(B.db, "t1_materiallar", key)); })["catch"](function (e) { alert(xato(e)); });
  }
  window.t1Kabinet = { ochir: ochir };
})();
