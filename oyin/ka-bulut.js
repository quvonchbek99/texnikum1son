/*!
 * Kuvonch Academy — bulut moduli (Firebase Auth + Firestore)
 * Akkaunt, tanga va reytingni serverda saqlaydi: boshqa qurilmadan kirish mumkin.
 * Himoya Firestore qoidalarida (firestore.rules). Bu yerdagi kalitlar ochiq bo'lishi mo'ljallangan.
 * Sayt bu modulsiz ham ishlaydi (akkaunt faqat shu qurilmada saqlanadi).
 */
(function () {
  "use strict";
  if (window.kaCloud) return;

  var CFG = {
    apiKey: "AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc",
    authDomain: "kuvonch-academy.firebaseapp.com",
    projectId: "kuvonch-academy",
    storageBucket: "kuvonch-academy.firebasestorage.app",
    messagingSenderId: "135195218981",
    appId: "1:135195218981:web:661a5a028614a9eded5bcc"
  };
  var BASE = "https://www.gstatic.com/firebasejs/13.0.0/";
  var P = null;

  function load() {
    if (!P) {
      P = Promise.all([import(BASE + "firebase-app.js"), import(BASE + "firebase-auth.js"), import(BASE + "firebase-firestore.js")])
        .then(function (m) {
          var app = m[0].initializeApp(CFG);
          return { A: m[1], F: m[2], auth: m[1].getAuth(app), db: m[2].getFirestore(app) };
        });
      P.catch(function () { P = null; });
    }
    return P;
  }

  function tday(ms) { return Math.floor((ms + 5 * 3600000) / 86400000); } // Toshkent kuni (UTC+5)
  function norm(s) { return String(s || "").replace(/[ʻʼ‘’`]/g, "'").replace(/[−–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase(); }

  // Ism+guruhdan maxfiy bo'lmagan "email" (ismni serverga email sifatida yozmaymiz)
  async function emailFor(name, group) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ka|" + norm(name) + "|" + norm(group)));
    var h = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("").slice(0, 28);
    return "u" + h + "@kuvonch.academy";
  }

  function uzError(e) {
    var c = (e && e.code) || "";
    if (c === "auth/email-already-in-use") return "Bu ism va guruh bilan akkount allaqachon bor. «Boshqa qurilmadan kirish» orqali parol bilan kiring.";
    if (c === "auth/invalid-credential" || c === "auth/wrong-password" || c === "auth/user-not-found" || c === "auth/invalid-login-credentials") return "Ism, guruh yoki parol noto'g'ri.";
    if (c === "auth/weak-password") return "Parol kamida 6 ta belgidan iborat bo'lsin.";
    if (c === "auth/too-many-requests") return "Juda ko'p urinish. Bir ozdan keyin qayta urinib ko'ring.";
    if (c === "auth/network-request-failed" || c === "unavailable") return "Internet bilan aloqa yo'q. Keyinroq urinib ko'ring.";
    if (c === "auth/operation-not-allowed") return "Bu kirish usuli hali yoqilmagan (o'qituvchi Firebase'da yoqishi kerak).";
    if (c === "auth/unauthorized-domain") return "Gmail bilan kirish «" + location.hostname + "» manzilida hali yoqilmagan (Firebase → Authentication → Settings → Authorized domains ga qo'shish kerak). Hozircha ism, guruh va parol bilan kiring.";
    if (c === "auth/requires-recent-login") return "Xavfsizlik uchun hozirgi parolni kiriting (yoki chiqib, qayta kiring).";
    if (c === "auth/missing-password") return "Parolni kiriting.";
    if (c === "auth/user-mismatch") return "Bu parol boshqa akkountniki.";
    if (c === "auth/user-token-expired" || c === "auth/user-disabled") return "Kirish muddati tugagan — qayta kiring.";
    if (c === "auth/no-such-provider") return "Bu akkountga Gmail ulanmagan.";
    if (c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") return "Google oynasi yopildi.";
    if (c === "auth/popup-blocked") return "Brauzer Google oynasini blokladi. Popup'ga ruxsat bering.";
    if (c === "auth/credential-already-in-use" || c === "auth/email-already-in-use-google") return "Bu Gmail boshqa akkountga allaqachon ulangan.";
    if (c === "auth/provider-already-linked") return "Gmail allaqachon ulangan.";
    if (c === "no-profile") return "Bu Gmail hali hech bir akkountga ulanmagan. Avval parol bilan kiring va profilda «Gmail ulash» ni bosing.";
    if (c === "permission-denied") return "Ruxsat yo'q.";
    if (c === "oqituvchi-pro") return "Sizda 🎓 O'qituvchi Pro faol — Bilimcoin bilan O'quvchi Pro olish shart emas.";
    if (c === "kam-tanga") return "Bilimcoin yetmaydi" + (e.need ? " — yana " + e.need + " ₿ kerak." : ".");
    return "Xatolik yuz berdi. Qayta urinib ko'ring.";
  }

  function clean(p, F) {
    return {
      name: String(p.name || "").slice(0, 40),
      group: String(p.group || "").slice(0, 20),
      av: Math.max(0, Math.min(11, p.av | 0)),
      coins: Math.max(0, p.coins | 0),
      correct: Math.max(0, p.correct | 0),
      answered: Math.max(0, p.answered | 0),
      tests: Math.max(0, p.tests | 0),
      updated: F.serverTimestamp()
    };
  }

  // Rol: o'quvchi yoki o'qituvchi (o'qituvchilikni admin tasdiqlaydi — teachers/{uid})
  function rolOf(r) { return r === "oqituvchi" ? "oqituvchi" : "oquvchi"; }
  function planOf(p) { return p === "oqituvchi" ? "oqituvchi" : "oquvchi"; }
  // Yangi maydonlar (rol, plan) eski Firestore qoidalarida rad etilsa — o'sha maydonsiz qayta yozamiz (qoidalar yangilanguncha sayt buzilmasin)
  function denied(e) { return !!e && (e.code === "permission-denied" || /permission/i.test(String(e.message || ""))); }
  async function setCompat(F, ref, data, keys) {
    try { return await F.setDoc(ref, data); }
    catch (e) { if (!denied(e)) throw e; var d = Object.assign({}, data); keys.forEach(function (k) { delete d[k]; }); return await F.setDoc(ref, d); }
  }

  // Profilni serverga yozish. Qoida: tanga bir yozuvda ko'pi bilan +200 va yozuvlar orasida 2 soniya,
  // shuning uchun katta o'sish bo'laklarga bo'linadi.
  var cloudState = null;   // serverda hozir turgan qiymatlar
  var pendingG = null;     // profili yo'q Gmail kirishi: { cred, uid } — mavjud akkountga ulash uchun
  function pwEmail(u) { var p = ((u && u.providerData) || []).filter(function (x) { return x.providerId === "password"; })[0]; return p ? p.email : null; }
  function gInfo(u) { var g = ((u && u.providerData) || []).filter(function (x) { return x.providerId === "google.com"; })[0]; return g || null; }
  var pushing = false;
  async function push(p) {
    var c = await load(), u = c.auth.currentUser;
    if (!u) return false;
    if (pushing) return false;
    pushing = true;
    try {
      var ref = c.F.doc(c.db, "users", u.uid);
      var target = clean(p, c.F);
      if (!cloudState) {
        var snap = await c.F.getDoc(ref);
        if (snap.exists()) { var d = snap.data(); cloudState = { coins: d.coins | 0, correct: d.correct | 0, answered: d.answered | 0, tests: d.tests | 0 }; }
      }
      if (!cloudState) {
        var first = clean(p, c.F); first.coins = Math.min(first.coins, 5000);
        await c.F.setDoc(ref, first, { merge: true });
        cloudState = { coins: first.coins, correct: first.correct, answered: first.answered, tests: first.tests };
      }
      for (var guard = 0; guard < 60; guard++) {
        var next = clean(p, c.F);
        next.coins = Math.min(target.coins, cloudState.coins + 200);
        next.correct = Math.max(next.correct, cloudState.correct);
        next.answered = Math.max(next.answered, cloudState.answered);
        next.tests = Math.max(next.tests, cloudState.tests);
        next.coins = Math.max(next.coins, cloudState.coins);
        await c.F.setDoc(ref, next, { merge: true });
        var gain = next.coins !== cloudState.coins;
        cloudState = { coins: next.coins, correct: next.correct, answered: next.answered, tests: next.tests };
        if (next.coins >= target.coins) break;
        if (gain) await new Promise(function (r) { setTimeout(r, 2200); });
      }
      return true;
    } catch (e) {
      cloudState = null;
      return false;
    } finally { pushing = false; }
  }

  window.kaCloud = {
    ready: function () { return load().then(function () { return true; }, function () { return false; }); },
    uzError: uzError,
    uid: function () { return P && window.__kaCloudAuth && window.__kaCloudAuth.currentUser ? window.__kaCloudAuth.currentUser.uid : null; },
    // Sahifa ochilganda oldingi sessiya tiklanishini kutish; kirgan bo'lsa uid qaytaradi
    session: function () {
      return load().then(function (c) {
        window.__kaCloudAuth = c.auth;
        return c.auth.authStateReady().then(function () { return c.auth.currentUser ? c.auth.currentUser.uid : null; });
      }, function () { return null; });
    },
    // Yangi akkount: Firebase foydalanuvchisi + profil hujjati
    register: async function (p, password) {
      var c = await load();
      var email = await emailFor(p.name, p.group);
      var cred = await c.A.createUserWithEmailAndPassword(c.auth, email, password);
      window.__kaCloudAuth = c.auth; cloudState = null;
      var first = clean(p, c.F); first.coins = Math.min(first.coins, 5000); first.rol = rolOf(p.rol);
      await setCompat(c.F, c.F.doc(c.db, "users", cred.user.uid), first, ["rol"]);
      cloudState = { coins: first.coins, correct: first.correct, answered: first.answered, tests: first.tests };
      return cred.user.uid;
    },
    // Kirish (boshqa qurilmadan ham): profilni serverdan oladi
    login: async function (name, group, password) {
      var c = await load();
      var email = await emailFor(name, group);
      var cred = await c.A.signInWithEmailAndPassword(c.auth, email, password);
      window.__kaCloudAuth = c.auth; cloudState = null;
      var snap = await c.F.getDoc(c.F.doc(c.db, "users", cred.user.uid));
      return { uid: cred.user.uid, data: snap.exists() ? snap.data() : null };
    },
    // ---- Gmail (Google) ulash ----
    googleEmail: async function () {
      try { var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser; if (!u) return null;
        var g = (u.providerData || []).filter(function (x) { return x.providerId === "google.com"; })[0]; return g ? (g.email || "ulangan") : null; } catch (e) { return null; }
    },
    linkGoogle: async function () {
      var c = await load(); await c.auth.authStateReady(); if (!c.auth.currentUser) throw { code: "auth/requires-recent-login" };
      var r = await c.A.linkWithPopup(c.auth.currentUser, new c.A.GoogleAuthProvider());
      var g = (r.user.providerData || []).filter(function (x) { return x.providerId === "google.com"; })[0]; return g ? g.email : "ulangan";
    },
    unlinkGoogle: async function () { var c = await load(); await c.A.unlink(c.auth.currentUser, "google.com"); },
    loginGoogle: async function () {
      var c = await load();
      var r = await c.A.signInWithPopup(c.auth, new c.A.GoogleAuthProvider());
      var snap = await c.F.getDoc(c.F.doc(c.db, "users", r.user.uid));
      if (!snap.exists()) { try { await r.user.delete(); } catch (e) { try { await c.A.signOut(c.auth); } catch (e2) {} } throw { code: "no-profile" }; }
      window.__kaCloudAuth = c.auth; cloudState = null;
      return { uid: r.user.uid, data: snap.data() };
    },
    // ---- Gmail: kirish / yangi akkount / mavjud akkountga ulash (profil topilmasa o'chirmaydi) ----
    googleStart: async function () {
      var c = await load();
      var r = await c.A.signInWithPopup(c.auth, new c.A.GoogleAuthProvider());
      window.__kaCloudAuth = c.auth; cloudState = null;
      var snap = await c.F.getDoc(c.F.doc(c.db, "users", r.user.uid)), g = gInfo(r.user) || {};
      var info = { uid: r.user.uid, data: snap.exists() ? snap.data() : null, email: g.email || r.user.email || "", gname: g.displayName || r.user.displayName || "", hasPw: !!pwEmail(r.user) };
      pendingG = info.data ? null : { cred: c.A.GoogleAuthProvider.credentialFromResult(r), uid: r.user.uid };
      return info;
    },
    // Gmail bilan kirgan, profili yo'q foydalanuvchi uchun yangi akkount (+ ixtiyoriy parol: ism+guruh bilan ham kirish)
    googleCreate: async function (p, password) {
      var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser;
      if (!u) throw { code: "auth/requires-recent-login" };
      if (password && !pwEmail(u)) {
        try { await c.A.linkWithCredential(u, c.A.EmailAuthProvider.credential(await emailFor(p.name, p.group), password)); }
        catch (e) { var k = e && e.code; if (k === "auth/email-already-in-use" || k === "auth/credential-already-in-use") throw { code: "auth/email-already-in-use" }; if (k !== "auth/provider-already-linked") throw e; }
      }
      var first = clean(p, c.F); first.coins = Math.min(first.coins, 5000); first.rol = rolOf(p.rol);
      await setCompat(c.F, c.F.doc(c.db, "users", u.uid), first, ["rol"]);
      cloudState = { coins: first.coins, correct: first.correct, answered: first.answered, tests: first.tests }; pendingG = null;
      return u.uid;
    },
    // Gmail'ni ism+guruh+parol bilan ochilgan mavjud akkountga ulash
    googleAttach: async function (name, group, password) {
      var c = await load(); await c.auth.authStateReady();
      var pg = pendingG, u = c.auth.currentUser;
      if (u && pg && u.uid === pg.uid) {
        var s0 = await c.F.getDoc(c.F.doc(c.db, "users", u.uid));
        if (!s0.exists()) { try { await u.delete(); } catch (e) { try { await c.A.signOut(c.auth); } catch (e2) {} } }
      }
      var cr = await c.A.signInWithEmailAndPassword(c.auth, await emailFor(name, group), password);
      window.__kaCloudAuth = c.auth; cloudState = null;
      var email = null, linkErr = null, g0 = gInfo(cr.user);
      if (g0) email = g0.email || "ulangan";
      else if (pg && pg.cred) {
        try { var lr = await c.A.linkWithCredential(cr.user, pg.cred), g = gInfo(lr.user); email = g ? (g.email || "ulangan") : "ulangan"; }
        catch (e) { if (e && e.code === "auth/provider-already-linked") email = "ulangan"; else linkErr = e; }
      } else linkErr = { code: "auth/requires-recent-login" };
      pendingG = null;
      var snap = await c.F.getDoc(c.F.doc(c.db, "users", cr.user.uid));
      return { uid: cr.user.uid, data: snap.exists() ? snap.data() : null, email: email, linkErr: linkErr };
    },
    hasPassword: async function () { try { var c = await load(); await c.auth.authStateReady(); return !!pwEmail(c.auth.currentUser); } catch (e) { return false; } },
    // Parolni tekshirish (kirish orqali) — uid qaytaradi
    verifyPassword: async function (name, group, password) {
      var c = await load();
      var r = await c.A.signInWithEmailAndPassword(c.auth, await emailFor(name, group), password);
      window.__kaCloudAuth = c.auth; cloudState = null; return r.user.uid;
    },
    // Parolni o'zgartirish yoki (Gmail orqali kirgandan keyin) yangi parol qo'yish
    changePassword: async function (name, group, oldPw, newPw) {
      var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser, email = await emailFor(name, group);
      if (!u) {
        if (!oldPw) throw { code: "auth/requires-recent-login" };
        u = (await c.A.signInWithEmailAndPassword(c.auth, email, oldPw)).user; window.__kaCloudAuth = c.auth; cloudState = null; oldPw = null;
      }
      var pe = pwEmail(u);
      if (pe) {
        if (oldPw) await c.A.reauthenticateWithCredential(u, c.A.EmailAuthProvider.credential(pe, oldPw));
        await c.A.updatePassword(u, newPw);
      } else {
        try { await c.A.linkWithCredential(u, c.A.EmailAuthProvider.credential(email, newPw)); }
        catch (e) { var k = e && e.code; if (k === "auth/email-already-in-use" || k === "auth/credential-already-in-use") throw { code: "auth/email-already-in-use" }; throw e; }
      }
      return u.uid;
    },
    // ---- Bilim daraxti va Bilimcoin ₿ (kuniga 1 ta; qoidalar firestore.rules'da) ----
    tday: tday,
    daraxt: async function () {
      var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser; if (!u) return null;
      var s = await c.F.getDoc(c.F.doc(c.db, "users", u.uid)); if (!s.exists()) return null;
      var d = s.data();
      return { uid: u.uid, bc: d.bc | 0, suv: d.suv | 0, streak: d.streak | 0, dailyAt: d.dailyAt && d.dailyAt.toMillis ? d.dailyAt.toMillis() : 0 };
    },
    suvQuy: async function () {
      var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser;
      if (!u) throw { code: "auth/requires-recent-login" };
      var ref = c.F.doc(c.db, "users", u.uid), s = await c.F.getDoc(ref);
      if (!s.exists()) throw { code: "no-profile" };
      var d = s.data(), last = d.dailyAt && d.dailyAt.toMillis ? d.dailyAt.toMillis() : 0, now = Date.now();
      var r = { uid: u.uid, bc: d.bc | 0, suv: d.suv | 0, streak: d.streak | 0, dailyAt: last, already: true };
      if (last && tday(last) >= tday(now)) return r;
      var streak = last && tday(last) === tday(now) - 1 ? (d.streak | 0) + 1 : 1;
      await c.F.updateDoc(ref, { bc: r.bc + 1, suv: r.suv + 1, streak: streak, dailyAt: c.F.serverTimestamp(), updated: c.F.serverTimestamp() });
      return { uid: u.uid, bc: r.bc + 1, suv: r.suv + 1, streak: streak, dailyAt: now, already: false };
    },
    // Pro sotib olish: 7 kun = 15 ₿, 30 kun = 50 ₿ (ikkala yozuv bitta paketda — qoidalar tekshiradi)
    PRO_NARX: { 7: 15, 30: 50 },
    buyPro: async function (days) {
      var cost = { 7: 15, 30: 50 }[days]; if (!cost) throw { code: "bad-days" };
      var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser;
      if (!u) throw { code: "auth/requires-recent-login" };
      var uref = c.F.doc(c.db, "users", u.uid), pref = c.F.doc(c.db, "premium", u.uid);
      var us = await c.F.getDoc(uref); if (!us.exists()) throw { code: "no-profile" };
      var bc = us.data().bc | 0; if (bc < cost) throw { code: "kam-tanga", need: cost - bc };
      var old = 0; try { var ps = await c.F.getDoc(pref); if (ps.exists() && ps.data().until && ps.data().until.toMillis) old = ps.data().until.toMillis(); if (old > Date.now() && planOf(ps.data().plan) === "oqituvchi") throw { code: "oqituvchi-pro" }; } catch (e) { if (e && e.code === "oqituvchi-pro") throw e; }
      var base = old > Date.now() ? old : Date.now() - 600000; // soat farqi uchun 10 daqiqa zaxira
      var until = c.F.Timestamp.fromMillis(base + days * 86400000);
      var pro = { until: until, by: u.uid, at: c.F.serverTimestamp(), days: days, plan: "oquvchi" };
      for (var k = 0; k < 2; k++) {
        try {
          var b = c.F.writeBatch(c.db);
          b.update(uref, { bc: bc - cost, updated: c.F.serverTimestamp() });
          b.set(pref, pro);
          await b.commit(); break;
        } catch (e) { if (k || !denied(e)) throw e; pro = { until: until, by: u.uid, at: c.F.serverTimestamp(), days: days }; }
      }
      return { bc: bc - cost, until: until.toDate() };
    },
    // Profil turi: "oquvchi" | "oqituvchi" (o'qituvchi bo'lsa — admin tasdig'ini kutadi)
    setRol: async function (rol) {
      var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser;
      if (!u) throw { code: "auth/requires-recent-login" };
      await c.F.updateDoc(c.F.doc(c.db, "users", u.uid), { rol: rolOf(rol), updated: c.F.serverTimestamp() });
      return rolOf(rol);
    },
    signOut: async function () { try { var c = await load(); cloudState = null; await c.A.signOut(c.auth); } catch (e) {} },
    push: push,
    // Reyting: eng ko'p tanga to'plaganlar (guruh bo'yicha mijoz tomonda saralanadi)
    top: async function (n) {
      var c = await load();
      var q = c.F.query(c.F.collection(c.db, "users"), c.F.orderBy("coins", "desc"), c.F.limit(n || 50));
      var s = await c.F.getDocs(q), out = [];
      var tch = {}; try { (await c.F.getDocs(c.F.query(c.F.collection(c.db, "teachers"), c.F.limit(300)))).forEach(function (d) { tch[d.id] = 1; }); } catch (e) {}
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, name: x.name, group: x.group, av: x.av, coins: x.coins | 0, t: !!tch[d.id] }); });
      return out;
    },
    // O'qituvchi jadvali uchun: natijani serverga yozish
    sendResult: async function (topic, correct, total, profile) {
      try {
        var c = await load(), u = c.auth.currentUser; if (!u || !total) return false;
        await c.F.addDoc(c.F.collection(c.db, "results"), {
          uid: u.uid, name: String(profile.name || "").slice(0, 40), group: String(profile.group || "").slice(0, 20),
          topic: String(topic || "").slice(0, 120), correct: correct | 0, total: Math.min(200, total | 0), at: c.F.serverTimestamp()
        });
        return true;
      } catch (e) { return false; }
    },
    // Apps Script o'qituvchini tekshirishi uchun qisqa muddatli kirish tokeni
    idToken: async function () {
      try { var c = await load(); await c.auth.authStateReady(); return c.auth.currentUser ? await c.auth.currentUser.getIdToken() : null; } catch (e) { return null; }
    },
    // ---- Premium ----
    // Pro holati. Admin (admins/{uid}) — hamma imkoniyat ochiq. Kirish holati yuklanishini kutamiz (aks holda sahifa ochilganda «kirmagan» chiqib qoladi).
    premiumStatus: async function () {
      try {
        var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser;
        if (!u) return { signed: false, active: false };
        var no = function () { return null; };
        var r = await Promise.all([
          c.F.getDoc(c.F.doc(c.db, "premium", u.uid)),
          c.F.getDoc(c.F.doc(c.db, "admins", u.uid)).then(function (a) { return a.exists(); }, function () { return false; }),
          c.F.getDoc(c.F.doc(c.db, "teachers", u.uid)).then(function (a) { return a.exists() ? a.data() : null; }, no),
          c.F.getDoc(c.F.doc(c.db, "users", u.uid)).then(function (a) { return a.exists() ? a.data() : null; }, no)
        ]);
        var s = r[0], admin = !!r[1], tch = r[2], prof = r[3] || {};
        var until = s.exists() && s.data().until && s.data().until.toDate ? s.data().until.toDate() : null;
        var paid = !!until && until > new Date();
        return { signed: true, uid: u.uid, admin: admin, active: admin || paid, until: until,
          plan: admin ? "oqituvchi" : paid ? planOf(s.data().plan) : "", legacy: paid && !s.data().plan, // eski (tarifsiz) Pro — avvalgi imkoniyatlar saqlanadi
          rol: admin || tch ? "oqituvchi" : rolOf(prof.rol), teacher: admin || !!tch, groups: tch && tch.groups ? tch.groups : [] };
      } catch (e) { return { signed: true, active: false, error: e && e.code }; }
    },
    premiumCatalog: async function () {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "premiumCatalog"), c.F.limit(100)));
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, title: x.title, n: x.n | 0, free: !!x.free, price: x.price || "" }); });
      return out;
    },
    // freeOnly=true: faqat bepul namunalar (obunasizlar uchun), aks holda obunachiga hammasi
    premiumTests: async function (freeOnly) {
      var c = await load(), out = [];
      var cons = [c.F.where("published", "==", true)];
      if (freeOnly) cons.push(c.F.where("free", "==", true));
      cons.push(c.F.limit(60));
      var s = await c.F.getDocs(c.F.query.apply(null, [c.F.collection(c.db, "premiumTests")].concat(cons)));
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, title: x.title, free: !!x.free, questions: x.questions || [] }); });
      return out;
    },
    // ---- Homiylar reytingi (ochiq o'qiladi) ----
    homiylar: async function () {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "homiylar"), c.F.orderBy("summa", "desc"), c.F.limit(200)));
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, ism: x.ism, summa: x.summa | 0, havola: x.havola || "", xabar: x.xabar || "", sana: x.sana || "" }); });
      return out;
    },
    addHomiy: async function (h) {
      var c = await load(), id = "h" + Date.now().toString(36);
      await c.F.setDoc(c.F.doc(c.db, "homiylar", id), { ism: String(h.ism).slice(0, 60), summa: Math.max(0, h.summa | 0), havola: String(h.havola || "").slice(0, 200), xabar: String(h.xabar || "").slice(0, 160), sana: String(h.sana || "").slice(0, 10), at: c.F.serverTimestamp() });
      return id;
    },
    removeHomiy: async function (id) { var c = await load(); await c.F.deleteDoc(c.F.doc(c.db, "homiylar", id)); },
    // ---- Premium: faqat o'qituvchi (qoidalar tekshiradi) ----
    addPremiumTest: async function (t) {
      var c = await load(), id = "t" + Date.now().toString(36);
      var qs = (t.questions || []).slice(0, 300).map(function (q) {
        return { q: String(q.q).slice(0, 400), o: q.o.map(function (x) { return String(x).slice(0, 160); }), c: q.c | 0 };
      });
      var b = c.F.writeBatch(c.db);
      b.set(c.F.doc(c.db, "premiumTests", id), { title: String(t.title).slice(0, 120), free: !!t.free, published: true, questions: qs, n: qs.length, at: c.F.serverTimestamp() });
      b.set(c.F.doc(c.db, "premiumCatalog", id), { title: String(t.title).slice(0, 120), free: !!t.free, n: qs.length, price: String(t.price || "").slice(0, 40), at: c.F.serverTimestamp() });
      await b.commit();
      return id;
    },
    removePremiumTest: async function (id) {
      var c = await load(), b = c.F.writeBatch(c.db);
      b.delete(c.F.doc(c.db, "premiumTests", id)); b.delete(c.F.doc(c.db, "premiumCatalog", id));
      await b.commit();
    },
    grantPremium: async function (uid, days, plan) {
      var c = await load(), ref = c.F.doc(c.db, "premium", uid), base = Date.now();
      var s = await c.F.getDoc(ref);
      if (s.exists() && s.data().until && s.data().until.toMillis() > base) base = s.data().until.toMillis();
      if (!plan) plan = s.exists() ? planOf(s.data().plan) : "oquvchi";
      await c.F.setDoc(ref, { until: c.F.Timestamp.fromMillis(base + days * 86400000), by: c.auth.currentUser.uid, at: c.F.serverTimestamp(), plan: planOf(plan) });
    },
    // ---- To'lov cheklari (sayt ichida tasdiqlash) ----
    submitPayment: async function (img, note, plan) {
      var c = await load(), u = c.auth.currentUser; if (!u) throw { code: "auth/requires-recent-login" };
      var ps = await c.F.getDoc(c.F.doc(c.db, "users", u.uid)); var pr = ps.exists() ? ps.data() : {};
      var id = u.uid + "_" + Date.now().toString(36);
      var pl = planOf(plan), nt = String(note || "").slice(0, 200);
      var doc = { uid: u.uid, name: String(pr.name || "").slice(0, 40), group: String(pr.group || "").slice(0, 20), note: nt, img: String(img), status: "pending", plan: pl, at: c.F.serverTimestamp() };
      try { await c.F.setDoc(c.F.doc(c.db, "payments", id), doc); }
      catch (e) { if (!denied(e)) throw e; delete doc.plan; if (pl === "oqituvchi") doc.note = ("[O'qituvchi Pro] " + nt).slice(0, 200); await c.F.setDoc(c.F.doc(c.db, "payments", id), doc); }
      return id;
    },
    myPayment: async function () {
      try {
        var c = await load(), u = c.auth.currentUser; if (!u) return null;
        var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "payments"), c.F.where("uid", "==", u.uid), c.F.limit(20)));
        var best = null;
        s.forEach(function (d) { var x = d.data(), t = x.at && x.at.toMillis ? x.at.toMillis() : 0; if (!best || t > best.t) best = { id: d.id, status: x.status, reason: x.reason || "", t: t }; });
        return best;
      } catch (e) { return null; }
    },
    listPayments: async function () {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "payments"), c.F.orderBy("at", "desc"), c.F.limit(60)));
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, uid: x.uid, name: x.name, group: x.group, note: x.note || "", img: x.img, status: x.status, plan: planOf(x.plan), reason: x.reason || "", at: x.at && x.at.toDate ? x.at.toDate() : null }); });
      return out;
    },
    approvePayment: async function (id, uid, days, plan) {
      var c = await load(); await window.kaCloud.grantPremium(uid, days || 365, plan || "oquvchi");
      await c.F.updateDoc(c.F.doc(c.db, "payments", id), { status: "approved", reviewed: c.F.serverTimestamp() });
    },
    rejectPayment: async function (id, reason) {
      var c = await load(); await c.F.updateDoc(c.F.doc(c.db, "payments", id), { status: "rejected", reason: String(reason || "").slice(0, 120), reviewed: c.F.serverTimestamp() });
    },
    deletePaymentImage: async function (id) { var c = await load(); await c.F.deleteDoc(c.F.doc(c.db, "payments", id)); },
    revokePremium: async function (uid) { var c = await load(); await c.F.deleteDoc(c.F.doc(c.db, "premium", uid)); },
    listPremium: async function () {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "premium"), c.F.limit(500)));
      s.forEach(function (d) { var x = d.data(); out.push({ uid: d.id, plan: planOf(x.plan), until: x.until && x.until.toDate ? x.until.toDate() : null }); });
      return out;
    },
    listUsers: async function (n) {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "users"), c.F.limit(n || 500)));
      s.forEach(function (d) { var x = d.data(); out.push({ uid: d.id, name: x.name, group: x.group, rol: rolOf(x.rol) }); });
      return out;
    },
    deleteProfile: async function () {
      try { var c = await load(), u = c.auth.currentUser; if (u) await c.F.deleteDoc(c.F.doc(c.db, "users", u.uid)); } catch (e) {}
    },
    // O'qituvchi: admins/{uid} hujjati bormi
    isAdmin: async function () {
      try { var c = await load(), u = c.auth.currentUser; if (!u) return false; var s = await c.F.getDoc(c.F.doc(c.db, "admins", u.uid)); return s.exists(); } catch (e) { return false; }
    },
    // ---- O'qituvchilar (tasdiqlash — faqat admin) ----
    teacherRequests: async function () {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "users"), c.F.where("rol", "==", "oqituvchi"), c.F.limit(300)));
      s.forEach(function (d) { var x = d.data(); out.push({ uid: d.id, name: x.name, group: x.group }); });
      return out;
    },
    listTeachers: async function () {
      var c = await load(), out = [];
      var s = await c.F.getDocs(c.F.query(c.F.collection(c.db, "teachers"), c.F.limit(300)));
      s.forEach(function (d) { var x = d.data(); out.push({ uid: d.id, name: x.name || "", group: x.group || "", groups: x.groups || [], at: x.at && x.at.toDate ? x.at.toDate() : null }); });
      return out;
    },
    approveTeacher: async function (uid, name, group, groups) {
      var c = await load(), gs = (groups || []).map(function (g) { return String(g).trim().slice(0, 20); }).filter(Boolean).slice(0, 30);
      await c.F.setDoc(c.F.doc(c.db, "teachers", uid), { name: String(name || "").slice(0, 40), group: String(group || "").slice(0, 20), groups: gs, by: c.auth.currentUser.uid, at: c.F.serverTimestamp() });
    },
    revokeTeacher: async function (uid) { var c = await load(); await c.F.deleteDoc(c.F.doc(c.db, "teachers", uid)); },
    myTeacher: async function () {
      try { var c = await load(); await c.auth.authStateReady(); var u = c.auth.currentUser; if (!u) return null;
        var s = await c.F.getDoc(c.F.doc(c.db, "teachers", u.uid)); return s.exists() ? Object.assign({ uid: u.uid }, s.data()) : null; } catch (e) { return null; }
    },
    // O'qituvchi Pro: faqat o'z guruhlari natijalari (qoidalar ham shuni talab qiladi)
    listResultsFor: async function (groups) {
      var c = await load(), gs = (groups || []).slice(0, 30), out = [];
      if (!gs.length) return out;
      // har bir guruh alohida so'rov: qoidalar «group == …» ni aniq tekshira oladi
      var snaps = await Promise.all(gs.map(function (g) { return c.F.getDocs(c.F.query(c.F.collection(c.db, "results"), c.F.where("group", "==", g), c.F.limit(500))); }));
      snaps.forEach(function (s) { s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, name: x.name, group: x.group, topic: x.topic, correct: x.correct | 0, total: x.total | 0, at: x.at && x.at.toDate ? x.at.toDate() : null }); }); });
      out.sort(function (a, b) { return (b.at ? b.at.getTime() : 0) - (a.at ? a.at.getTime() : 0); });
      return out;
    },
    listResults: async function (n) {
      var c = await load();
      var q = c.F.query(c.F.collection(c.db, "results"), c.F.orderBy("at", "desc"), c.F.limit(n || 500));
      var s = await c.F.getDocs(q), out = [];
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, name: x.name, group: x.group, topic: x.topic, correct: x.correct | 0, total: x.total | 0, at: x.at && x.at.toDate ? x.at.toDate() : null }); });
      return out;
    }
  };
})();
