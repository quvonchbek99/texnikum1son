/*!
 * ka-kirish.js — kod va parol maydonlari uchun umumiy yordamchi (viktorina, sinf o'yinlari, Live, kartalar).
 *  Xona kodi:
 *   - kirillcha klaviaturada yozilsa ham lotinga o'giradi (А→A, Р→P, С→C, Н→H …);
 *   - telefon klaviaturasi so'z tuzayotganda (composition) maydonga tegmaydi — Android'da harflar ikki marta
 *     chiqishi, kursor oxiriga sakrashi va harf «yozilmay qolishi» shundan bo'lardi.
 *  Davomat login/parol:
 *   - telefon birinchi harfni o'zi katta qilmaydi, so'zni «tuzatmaydi»; 👁 parolni ko'rsatish;
 *   - kirill harfi yoki Caps Lock yoqilgan bo'lsa — ogohlantiradi; Enter: login → parol → Kirish;
 *   - login boshqacha registrda yozilgan bo'lsa (masalan, telefon «Quvonch» qilib qo'ygan) — yana urinib ko'radi;
 *   - oxirgi login eslab qolinadi.
 */
(function () {
  "use strict";
  if (window.kaKirish) return;
  // ko'rinishi o'xshash (А, В, Е, К, М, Н, О, Р, С, Т, У, Х) va o'qilishi o'xshash harflar
  var CYR = { "А": "A", "Б": "B", "В": "B", "Г": "G", "Ғ": "G", "Д": "D", "Е": "E", "Ё": "E", "Ж": "J", "З": "Z", "И": "N", "Й": "Y",
    "К": "K", "Қ": "Q", "Л": "L", "М": "M", "Н": "H", "О": "O", "П": "P", "Р": "P", "С": "C", "Т": "T", "У": "Y", "Ў": "Y",
    "Ф": "F", "Х": "X", "Ҳ": "X", "Э": "E" };
  var CYR_RE = /[А-ЯЁЎҚҒҲ]/g;
  function kod(v, o) {
    o = o || {};
    var s = String(v || "").toUpperCase().replace(CYR_RE, function (c) { return CYR[c] || ""; });
    return s.replace(o.harf ? /[^A-Z]/g : /[^A-Z0-9]/g, "").slice(0, o.uzun || 5);
  }
  function attr(el, k, v) { if (el && !el.hasAttribute(k)) el.setAttribute(k, v); }
  // o: {harf: true — faqat harflar, uzun: 5, ozgardi(v)}
  function kodMaydon(inp, o) {
    if (!inp) return null;
    o = o || {};
    attr(inp, "autocomplete", "off"); attr(inp, "autocorrect", "off"); attr(inp, "autocapitalize", "characters"); attr(inp, "spellcheck", "false");
    var comp = false;
    function toz(sabab) {
      var eski = inp.value, v = kod(eski, o);
      if (eski !== v) {
        var p = typeof inp.selectionStart === "number" ? inp.selectionStart : eski.length, k = kod(eski.slice(0, p), o).length;
        inp.value = v;
        try { if (document.activeElement === inp) inp.setSelectionRange(k, k); } catch (e) {}
      }
      if (o.ozgardi) o.ozgardi(v, sabab || "input");
      return v;
    }
    inp.addEventListener("compositionstart", function () { comp = true; });
    inp.addEventListener("compositionend", function () { comp = false; toz("input"); });
    inp.addEventListener("input", function (e) { if (comp || e.isComposing) return; toz("input"); });
    inp.addEventListener("blur", function () { comp = false; toz("blur"); });
    return { toz: toz, qiymat: function () { return kod(inp.value, o); } };
  }

  /* ---------- Davomat login / parol ---------- */
  var LS_LOGIN = "ka.dv.login";
  function stil() {
    if (document.getElementById("kk-stil")) return;
    var s = document.createElement("style"); s.id = "kk-stil";
    s.textContent = ".kk-pw{position:relative;display:block}.kk-pw>input{width:100%;padding-right:46px!important}" +
      ".kk-pw>button{position:absolute;right:4px;top:50%;transform:translateY(-50%);border:0;background:none;font-size:20px;line-height:1;cursor:pointer;padding:8px;color:inherit;opacity:.75}" +
      ".kk-pw>button:hover{opacity:1}.kk-ogoh{font-size:13px;font-weight:700;color:#b45309;margin:6px 2px 0;min-height:1em}";
    document.head.appendChild(s);
  }
  // loginEl, parolEl — input'lar; go — «Kirish» funksiyasi; joy — ogohlantirish qo'yiladigan element (ixtiyoriy)
  function maydonlar(loginEl, parolEl, go, joy) {
    if (!loginEl || !parolEl) return;
    stil();
    [loginEl, parolEl].forEach(function (el) {
      el.setAttribute("autocapitalize", "none"); el.setAttribute("autocorrect", "off"); el.setAttribute("spellcheck", "false");
    });
    loginEl.setAttribute("enterkeyhint", "next"); parolEl.setAttribute("enterkeyhint", "go");
    try { if (!loginEl.value) loginEl.value = localStorage.getItem(LS_LOGIN) || ""; } catch (e) {}
    // 👁 parolni ko'rsatish
    var w = document.createElement("span"); w.className = "kk-pw";
    parolEl.parentNode.insertBefore(w, parolEl); w.appendChild(parolEl);
    var eye = document.createElement("button"); eye.type = "button"; eye.textContent = "👁"; eye.setAttribute("aria-label", "Parolni ko'rsatish");
    eye.addEventListener("click", function () {
      var ochiq = parolEl.type === "password"; parolEl.type = ochiq ? "text" : "password";
      eye.textContent = ochiq ? "🙈" : "👁"; eye.setAttribute("aria-label", ochiq ? "Parolni yashirish" : "Parolni ko'rsatish"); parolEl.focus();
    });
    w.appendChild(eye);
    // ogohlantirish: kirill harflari, Caps Lock
    var og = document.createElement("div"); og.className = "kk-ogoh"; og.setAttribute("aria-live", "polite");
    (joy || w.closest(".row") || w.parentNode).insertAdjacentElement(joy ? "beforebegin" : "afterend", og);
    var caps = false;
    function tekshir() {
      var t = [];
      if (/[А-яЁёЎўҚқҒғҲҳ]/.test(loginEl.value + parolEl.value)) t.push("⚠️ Kirill harflari bor — klaviaturani lotinchaga o'tkazing");
      if (caps) t.push("⚠️ Caps Lock yoqilgan");
      og.textContent = t.join(" · ");
    }
    function klav(e) { if (e.getModifierState) caps = e.getModifierState("CapsLock"); tekshir(); }
    [loginEl, parolEl].forEach(function (el) { el.addEventListener("input", tekshir); el.addEventListener("keyup", klav); });
    loginEl.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); parolEl.focus(); } });
    parolEl.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (go) go(); } });
    tekshir();
  }
  function tushunarli(e) {
    var m = String((e && e.message) || e || "");
    if (/login|parol|noto|topilmadi|mos kel|wrong|invalid|incorrect/i.test(m))
      return new Error("Login yoki parol noto'g'ri. Davomat saytida qanday yozgan bo'lsangiz, aynan shunday kiriting (lotin harflari, katta-kichik harf).");
    return e instanceof Error ? e : new Error(m || "Xatolik");
  }
  // dvFn(action, data) — sahifadagi Davomat so'rovi; avval yozilganicha, xato bo'lsa — boshqa registrdagi variantlar bilan
  function davomat(dvFn, login, parol) {
    login = String(login || "").trim(); parol = String(parol || "");
    try { if (login) localStorage.setItem(LS_LOGIN, login); } catch (e) {}
    var p2 = parol.trim(), kich = login.toLowerCase(), bosh = kich.charAt(0).toUpperCase() + kich.slice(1);
    var nav = [[login, parol]];
    [[kich, p2], [bosh, p2], [login, p2]].forEach(function (x) {
      if (!nav.some(function (y) { return y[0] === x[0] && y[1] === x[1]; })) nav.push(x);
    });
    var birinchi = null;
    function ur(i) {
      return dvFn("login", { login: nav[i][0], parol: nav[i][1] }).then(function (j) {
        try { localStorage.setItem(LS_LOGIN, nav[i][0]); } catch (e) {}
        return j;
      }, function (e) {
        if (!birinchi) birinchi = e;
        if (/internet|ulanib|band|failed to fetch|network/i.test(String(e && e.message)) || i + 1 >= nav.length) throw tushunarli(birinchi);
        return ur(i + 1);
      });
    }
    return ur(0);
  }

  window.kaKirish = { kod: kod, kodMaydon: kodMaydon, maydonlar: maydonlar, davomat: davomat };
})();
