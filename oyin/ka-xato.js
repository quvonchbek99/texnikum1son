/*! Kuvonch Academy — «Xatolar daftari» (butun sayt uchun umumiy)
 *  Viktorinada va Kuvi bilan mashqda xato qilingan savollar shu yerda (shu brauzerda) saqlanadi.
 *  Kuvi «📒 Xatolar» rejimida aynan shularni qayta so'raydi; savol 2 marta to'g'ri topilgach daftardan o'chadi. ES5. */
(function () {
  "use strict";
  if (window.kaXato) return;
  var K = "ka.xato.v1", MAX = 200;
  function all() { try { return JSON.parse(localStorage.getItem(K) || "[]") || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(K, JSON.stringify(a.slice(-MAX))); } catch (e) {} }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h.toString(36); }
  function add(it) {
    if (!it || !it.q || it.a == null || it.a === "") return;
    var a = all(), id = hash(String(it.q) + "|" + it.a), ex = null, i;
    for (i = 0; i < a.length; i++) if (a[i].id === id) { ex = a[i]; break; }
    if (ex) { ex.n = (ex.n || 1) + 1; ex.ok = 0; ex.ts = Date.now(); if (it.ch != null) ex.ch = String(it.ch).slice(0, 120); }
    else a.push({ id: id, q: String(it.q).slice(0, 320), a: String(it.a).slice(0, 140), o: it.o && it.o.length ? it.o.slice(0, 4).map(function (x) { return String(x).slice(0, 140); }) : null,
      s: String(it.s || "").slice(0, 320), t: String(it.t || "").slice(0, 70), src: it.src || "", ch: it.ch != null ? String(it.ch).slice(0, 120) : "", ts: Date.now(), n: 1, ok: 0 });
    save(a);
  }
  function hit(id, ok) {
    var a = all();
    for (var i = 0; i < a.length; i++) if (a[i].id === id) { if (ok) { a[i].ok = (a[i].ok || 0) + 1; if (a[i].ok >= 2) a.splice(i, 1); } else { a[i].ok = 0; a[i].n = (a[i].n || 1) + 1; } break; }
    save(a);
  }
  window.kaXato = { add: add, list: all, hit: hit, count: function () { return all().length; }, clear: function () { save([]); } };
})();
