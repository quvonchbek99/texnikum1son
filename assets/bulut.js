/* texnikum1son.uz — bulut moduli: Firebase Auth (login/parol), Firestore va Gemini (Firebase AI Logic).
   Kuvonch Academy (kuvonch.uz) bilan bitta Firebase loyihasi. Kalitlar ochiq bo'lishi mo'ljallangan — himoya Firestore qoidalarida.
   Sayt bu modulsiz ham ochiladi: faqat kabinet va o'qituvchi yuklagan materiallar bulutga bog'liq. */
(function () {
  "use strict";
  if (window.t1Bulut) return;
  var CFG = {
    apiKey: "AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc",
    authDomain: "kuvonch-academy.firebaseapp.com",
    projectId: "kuvonch-academy",
    storageBucket: "kuvonch-academy.firebasestorage.app",
    messagingSenderId: "135195218981",
    appId: "1:135195218981:web:661a5a028614a9eded5bcc"
  };
  var RECAPTCHA_KEY = "6Ld1sBkuAAAAANmZqRdMg6WXBQuE0sYGmX67i5kj"; // ochiq sayt kaliti; texnikum1son.uz domeni kalitga qo'shilishi kerak
  var BASE = "https://www.gstatic.com/firebasejs/13.0.0/";
  var imp = null; try { imp = new Function("u", "return import(u)"); } catch (e) { imp = null; }
  var P = null, PA = null;

  function app(A) { return A.getApps().length ? A.getApp() : A.initializeApp(CFG); }
  function load() {
    if (!imp) return Promise.reject(new Error("Brauzer juda eski"));
    if (!P) {
      P = Promise.all([imp(BASE + "firebase-app.js"), imp(BASE + "firebase-auth.js"), imp(BASE + "firebase-firestore.js")]).then(function (m) {
        var a = app(m[0]);
        return { A: m[1], F: m[2], auth: m[1].getAuth(a), db: m[2].getFirestore(a) };
      });
      P["catch"](function () { P = null; });
    }
    return P;
  }
  function loadAI() {
    if (!imp) return Promise.reject(new Error("Brauzer juda eski"));
    if (!PA) {
      PA = Promise.all([imp(BASE + "firebase-app.js"), imp(BASE + "firebase-ai.js"), imp(BASE + "firebase-app-check.js")]).then(function (m) {
        var a = app(m[0]);
        if (!window.__t1AppCheck) { try { m[2].initializeAppCheck(a, { provider: new m[2].ReCaptchaEnterpriseProvider(RECAPTCHA_KEY), isTokenAutoRefreshEnabled: true }); window.__t1AppCheck = 1; } catch (e) {} }
        return { M: m[1], ai: m[1].getAI(a, { backend: new m[1].GoogleAIBackend() }) };
      });
      PA["catch"](function () { PA = null; });
    }
    return PA;
  }
  var MODELLAR = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
  /* Gemini'ga so'rov. json=true bo'lsa javob JSON qilib qaytariladi. */
  function ai(prompt, opt, i) {
    opt = opt || {}; i = i || 0;
    return loadAI().then(function (S) {
      var o = { model: MODELLAR[i] };
      if (opt.sys) o.systemInstruction = opt.sys;
      if (opt.json) o.generationConfig = { responseMimeType: "application/json", temperature: 0.2 };
      return S.M.getGenerativeModel(S.ai, o).generateContent(prompt).then(function (r) {
        var t = r.response.text();
        if (!opt.json) return t;
        t = t.replace(/^```(?:json)?\s*|\s*```$/g, "");
        return JSON.parse(t);
      });
    })["catch"](function (e) {
      var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e);
      if (/404|not found|not supported|unavailable|overloaded|503/i.test(m) && i < MODELLAR.length - 1) return ai(prompt, opt, i + 1);
      throw e;
    });
  }
  function uzXato(e) {
    var c = (e && e.code) || "", m = (e && e.message) || String(e);
    var T = {
      "auth/invalid-email": "Email noto‘g‘ri yozilgan.",
      "auth/email-already-in-use": "Bu email bilan akkount allaqachon bor — «Kirish» bo‘limidan kiring.",
      "auth/invalid-credential": "Email yoki parol noto‘g‘ri.", "auth/wrong-password": "Email yoki parol noto‘g‘ri.", "auth/user-not-found": "Email yoki parol noto‘g‘ri.", "auth/invalid-login-credentials": "Email yoki parol noto‘g‘ri.",
      "auth/weak-password": "Parol kamida 6 ta belgidan iborat bo‘lsin.", "auth/missing-password": "Parolni kiriting.",
      "auth/too-many-requests": "Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.",
      "auth/network-request-failed": "Internet bilan aloqa yo‘q.", "unavailable": "Internet bilan aloqa yo‘q.",
      "permission-denied": "Ruxsat yo‘q. Akkauntingiz hali tasdiqlanmagan bo‘lishi yoki Firestore qoidalari yangilanmagan bo‘lishi mumkin.",
      "auth/operation-not-allowed": "Email/parol bilan kirish Firebase’da yoqilmagan."
    };
    if (T[c]) return T[c];
    if (/app.?check|recaptcha|appCheck/i.test(m)) return "AI himoyasi (App Check) bu domenda hali yoqilmagan — fayllar AI’siz, qoidalar bo‘yicha tahlil qilinadi.";
    return m;
  }
  window.t1Bulut = { load: load, loadAI: loadAI, ai: ai, uzXato: uzXato, CFG: CFG };
})();
