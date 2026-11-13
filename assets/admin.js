/* Admin panel: o'qituvchilarni ko'rish va bloklash (ro'yxat avtomatik), Drive manzilini sozlash, materiallarni boshqarish. */
(function () {
  "use strict";
  var ROOT = (window.t1 && t1.ROOT) || "", APP = document.getElementById("admin"); if (!APP) return;
  var B = null, USER = null;
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var $ = function (s) { return APP.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(APP.querySelectorAll(s)); };
  var xato = function (e) { return t1Bulut.uzXato(e); };
  function vaqt(t) { if (!t || !t.toDate) return ""; var d = t.toDate(); return d.toLocaleDateString("uz-UZ") + " " + d.toTimeString().slice(0, 5); }

  APP.innerHTML = '<p class="muted">Yuklanmoqda…</p>';
  t1Bulut.load().then(function (b) {
    B = b;
    B.A.onAuthStateChanged(B.auth, function (u) {
      USER = u;
      if (!u) { APP.innerHTML = '<div class="card"><p>Admin panelga kirish uchun avval <a href="' + ROOT + 'kabinet/">o‘qituvchi kabinetidan</a> admin akkaunt bilan kiring.</p></div>'; return; }
      B.F.getDoc(B.F.doc(B.db, "admins", u.uid)).then(function (d) {
        if (!d.exists()) { APP.innerHTML = '<div class="note bad">Bu akkaunt admin emas.</div>'; return; }
        sahifa();
      })["catch"](function (e) { APP.innerHTML = '<div class="note bad">' + esc(xato(e)) + "</div>"; });
    });
  })["catch"](function (e) { APP.innerHTML = '<div class="note bad">Bulutga ulanib bo‘lmadi: ' + esc(xato(e)) + "</div>"; });

  function sahifa() {
    APP.innerHTML =
      '<div class="toolbar"><b>' + esc(USER.email) + '</b> <span class="tag ok">admin</span><span class=sp></span><a class="btn ghost sm" href="' + ROOT + 'kabinet/">Kabinet</a></div>' +
      '<section class="card"><h2>O‘qituvchilar</h2><div id="oq"><p class="muted">Yuklanmoqda…</p></div></section>' +
      '<section class="card" style="margin-top:16px"><h2>Fayllar ombori (Google Drive)</h2><p class="small muted">Apps Script veb-ilovasining manzili (…/exec). O‘qituvchilar yuklagan asl fayllar shu orqali Drive’ingizdagi «texnikum1son — e-baza fayllari» papkasiga tushadi.</p>' +
      '<div class="toolbar"><input type="text" id="durl" placeholder="https://script.google.com/macros/s/…/exec" style="flex:1;min-width:240px"><button class="btn sm" id="dtek">Tekshirish</button><button class="btn sm" id="dsaq">Saqlash</button></div><div id="dmsg"></div></section>' +
      '<section class="card" style="margin-top:16px"><h2>Joylangan materiallar</h2><div id="mat"><p class="muted">Yuklanmoqda…</p></div></section>';
    oqituvchilar(); materiallar(); drive();
  }
  function drive() {
    var F = B.F, inp = $("#durl"), m = $("#dmsg");
    F.getDoc(F.doc(B.db, "t1_sozlama", "umumiy")).then(function (d) { if (d.exists()) inp.value = d.data().drive_url || ""; });
    $("#dtek").addEventListener("click", function () {
      m.innerHTML = '<p class="small">Tekshirilmoqda…</p>';
      fetch(inp.value.trim()).then(function (r) { return r.json(); }).then(function (j) { m.innerHTML = j.ok ? '<p class="note ok">✓ Ishlayapti: ' + esc(j.papka || j.xizmat) + "</p>" : '<p class="note bad">Javob noto‘g‘ri.</p>'; })
        ["catch"](function (e) { m.innerHTML = '<p class="note bad">Ulanib bo‘lmadi: ' + esc(e.message) + ". Veb-ilova «Har kim (Anyone)» uchun ochilganini tekshiring.</p>"; });
    });
    $("#dsaq").addEventListener("click", function () {
      var u = inp.value.trim();
      if (u && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(u)) { m.innerHTML = '<p class="note bad">Manzil «https://script.google.com/macros/s/…/exec» ko‘rinishida bo‘lishi kerak.</p>'; return; }
      F.setDoc(F.doc(B.db, "t1_sozlama", "umumiy"), { drive_url: u, yangilandi: F.serverTimestamp() }, { merge: true }).then(function () { m.innerHTML = '<p class="note ok">✓ Saqlandi.</p>'; })["catch"](function (e) { m.innerHTML = '<p class="note bad">' + esc(xato(e)) + "</p>"; });
    });
  }
  function oqituvchilar() {
    var F = B.F, box = $("#oq");
    F.getDocs(F.collection(B.db, "t1_oqituvchilar")).then(function (qs) {
      var a = []; qs.forEach(function (d) { var x = d.data(); x.id = d.id; a.push(x); });
      var tar = { kutilmoqda: 0, tasdiqlangan: 1, rad: 2 };
      a.sort(function (p, q) { return (tar[p.holat] || 0) - (tar[q.holat] || 0); });
      if (!a.length) { box.innerHTML = '<p class="muted">Hali o‘qituvchi ro‘yxatdan o‘tmagan.</p>'; return; }
      box.innerHTML = '<div class="tbl-w"><table><thead><tr><th>F.I.O.</th><th>Aloqa</th><th>Fanlari</th><th>Sana</th><th>Holat</th><th></th></tr></thead><tbody>' + a.map(function (x) {
        var t = x.holat === "tasdiqlangan" ? '<span class="tag ok">tasdiqlangan</span>' : x.holat === "rad" ? '<span class="tag">rad etilgan</span>' : '<span class="tag w">kutilmoqda</span>';
        return "<tr><td><b>" + esc(x.fio) + "</b></td><td>" + esc(x.email) + (x.telefon ? "<br>" + esc(x.telefon) : "") + "</td><td>" + esc(x.fanlar_izoh || "") + "</td><td>" + vaqt(x.yaratildi) + "</td><td>" + t + '</td><td style="white-space:nowrap">' +
          (x.holat !== "tasdiqlangan" ? '<button class="btn sm" data-h="tasdiqlangan" data-id="' + x.id + '">Tasdiqlash</button> ' : "") +
          (x.holat !== "rad" ? '<button class="btn ghost sm" data-h="rad" data-id="' + x.id + '">' + (x.holat === "tasdiqlangan" ? "Bloklash" : "Rad etish") + "</button>" : "") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
      $$("[data-h]").forEach(function (b) {
        b.addEventListener("click", function () {
          b.disabled = true;
          F.updateDoc(F.doc(B.db, "t1_oqituvchilar", b.getAttribute("data-id")), { holat: b.getAttribute("data-h"), tekshirdi: USER.uid, tekshirildi: F.serverTimestamp() }).then(oqituvchilar)["catch"](function (e) { alert(xato(e)); b.disabled = false; });
        });
      });
    })["catch"](function (e) { box.innerHTML = '<p class="note bad">' + esc(xato(e)) + " — Firestore qoidalari yangilanganini tekshiring.</p>"; });
  }
  function materiallar() {
    var F = B.F, box = $("#mat");
    F.getDocs(F.collection(B.db, "t1_materiallar")).then(function (qs) {
      var a = []; qs.forEach(function (d) { var x = d.data(); x.id = d.id; a.push(x); });
      a.sort(function (p, q) { return ((q.yangilandi && q.yangilandi.seconds) || 0) - ((p.yangilandi && p.yangilandi.seconds) || 0); });
      if (!a.length) { box.innerHTML = '<p class="muted">Hali material joylanmagan.</p>'; return; }
      box.innerHTML = '<div class="tbl-w"><table><thead><tr><th>Fan</th><th>Yo‘nalish</th><th>Sem.</th><th>O‘qituvchi</th><th>Yangilangan</th><th>Holat</th><th></th></tr></thead><tbody>' + a.map(function (x) {
        return '<tr><td><a target="_blank" href="' + ROOT + "yonalish/" + x.yonalish + "/fan/" + x.fan + "/?sem=" + x.sem + '">' + esc(x.fan_nomi) + "</a>" + (x.rtr ? ' <span class="tag">RTR</span>' : "") + "</td><td>" + esc(x.yonalish_nomi) + "</td><td>" + esc(x.sem) + "</td><td>" + esc(x.oqituvchi) + "</td><td>" + vaqt(x.yangilandi) +
          "</td><td>" + (x.holat === "joylangan" ? '<span class="tag ok">saytda</span>' : '<span class="tag w">yashirin</span>') + '</td><td style="white-space:nowrap"><button class="btn ghost sm" data-k="' + x.id + '" data-v="' + (x.holat === "joylangan" ? "yashirin" : "joylangan") + '">' + (x.holat === "joylangan" ? "Yashirish" : "Ko‘rsatish") +
          '</button> <button class="btn ghost sm" data-o="' + x.id + '">O‘chirish</button></td></tr>';
      }).join("") + "</tbody></table></div>";
      $$("[data-k]").forEach(function (b) { b.addEventListener("click", function () { F.updateDoc(F.doc(B.db, "t1_materiallar", b.getAttribute("data-k")), { holat: b.getAttribute("data-v") }).then(materiallar)["catch"](function (e) { alert(xato(e)); }); }); });
      $$("[data-o]").forEach(function (b) {
        b.addEventListener("click", function () {
          if (!confirm("Material saytdan butunlay o‘chirilsinmi? (Drive’dagi asl fayllar qoladi)")) return;
          var k = b.getAttribute("data-o");
          Promise.all(["hujjatlar", "matnlar"].map(function (c) { return F.getDocs(F.collection(B.db, "t1_materiallar", k, c)).then(function (qs) { var p = []; qs.forEach(function (d) { p.push(F.deleteDoc(d.ref)); }); return Promise.all(p); }); }))
            .then(function () { return F.deleteDoc(F.doc(B.db, "t1_materiallar", k)); }).then(materiallar)["catch"](function (e) { alert(xato(e)); });
        });
      });
    })["catch"](function (e) { box.innerHTML = '<p class="note bad">' + esc(xato(e)) + "</p>"; });
  }
})();
