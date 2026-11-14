/*!
 * Kuvonch Academy — o'quvchi akkounti va coinlar
 * - Akkount ochish (ism, guruh, rasm yoki avatar, ixtiyoriy 4 xonali PIN)
 * - Test oynasi ochilganda akkount tanlanmagan bo'lsa, avval kirish so'raladi
 * - Testdagi har bir to'g'ri javob uchun +10 coin (har savolga bir marta, birinchi tanlov hisoblanadi)
 * - Tarix, daraja, shu qurilmadagi reyting
 * Ma'lumotlar shu brauzerda (localStorage) saqlanadi; parol bilan ochilgan akkaunt bulutga (Firebase, ka-bulut.js) ham yoziladi.
 * Parollar: ko'rsatish 👁, nusxalash 📋, o'ylab berish 🎲, qurilmada/brauzerda saqlash, Gmail orqali tiklash va o'zgartirish.
 * Ulash: <script src="akkount.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaAcc) return;
  window.__kaAcc = true;

  var COIN_PER_CORRECT = 10;

  // ---------- Bulut (Firebase) — ixtiyoriy; yuklanmasa sayt avvalgidek ishlaydi ----------
  var CLOUD_SRC = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*(\?.*)?$/, "ka-bulut.js") : "ka-bulut.js"; })();
  var cloudP = null;
  function cloud() {
    if (cloudP) return cloudP;
    cloudP = new Promise(function (ok) {
      if (window.kaCloud) return ok(window.kaCloud);
      var s = document.createElement("script"); s.src = CLOUD_SRC; s.async = true;
      s.onload = function () { ok(window.kaCloud || null); };
      s.onerror = function () { cloudP = null; ok(null); };
      document.head.appendChild(s);
    });
    return cloudP;
  }
  var pushT = null;
  function cloudSched() {
    var u = me(); if (!u || !u.cloud) return;
    clearTimeout(pushT);
    pushT = setTimeout(function () {
      cloud().then(function (K) {
        var cu = me(); if (!K || !cu || !cu.cloud) return;
        K.session().then(function (uid) { if (uid && uid === cu.cloud) K.push(cu); });
      });
    }, 2500);
  }
  // Bulutdan kelgan profilni shu qurilmadagi yozuv bilan birlashtirish (hisoblagichlar kamaymaydi)
  function adoptCloud(uid, name, group, data) {
    var rec = DB[uid] || { coins: 0, correct: 0, answered: 0, tests: 0, history: [], created: Date.now(), done: {} };
    Object.keys(DB).forEach(function (id) {
      var o = DB[id];
      if (id !== uid && !o.cloud && norm(o.name) === norm(name) && norm(o.group) === norm(group)) {
        rec.coins = Math.max(rec.coins || 0, o.coins || 0); rec.correct = Math.max(rec.correct || 0, o.correct || 0);
        rec.answered = Math.max(rec.answered || 0, o.answered || 0); rec.tests = Math.max(rec.tests || 0, o.tests || 0);
        rec.history = (o.history || []).concat(rec.history || []).slice(-60);
        rec.done = Object.assign({}, o.done || {}, rec.done || {}); if (o.photo && !rec.photo) rec.photo = o.photo;
        if (curId() === id) setCur(uid);
        delete DB[id];
      }
    });
    rec.cloud = uid; rec.name = (data && data.name) || name; rec.group = (data && data.group != null) ? data.group : group;
    if (data) {
      rec.av = data.av | 0; if (data.rol) rec.rol = data.rol === "oqituvchi" ? "oqituvchi" : "oquvchi";
      rec.coins = Math.max(rec.coins || 0, data.coins | 0); rec.correct = Math.max(rec.correct || 0, data.correct | 0);
      rec.answered = Math.max(rec.answered || 0, data.answered | 0); rec.tests = Math.max(rec.tests || 0, data.tests | 0);
    } else if (rec.av == null) rec.av = 0;
    DB[uid] = rec; save();
    return uid;
  }
  var LS = "ka.akkountlar.v1", LS_CUR = "ka.joriy.v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").replace(/[ʻʼ‘’`]/g, "'").replace(/[−–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase(); }

  // ---------- Saqlash ----------
  function load() { try { var d = JSON.parse(localStorage.getItem(LS) || "{}"); return d && typeof d === "object" ? d : {}; } catch (e) { return {}; } }
  var DB = load();
  var memOnly = false;
  function save() { try { localStorage.setItem(LS, JSON.stringify(DB)); } catch (e) { memOnly = true; } cloudSched(); }
  function curId() { try { return localStorage.getItem(LS_CUR) || ""; } catch (e) { return window.__kaCur || ""; } }
  function setCur(id) { window.__kaCur = id; try { if (id) localStorage.setItem(LS_CUR, id); else localStorage.removeItem(LS_CUR); } catch (e) {} }
  function me() { var id = curId(); return id && DB[id] ? DB[id] : null; }

  async function hashPin(pin) {
    var s = "ka-salt:" + pin;
    try {
      var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    } catch (e) { var h = 0; for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0; return "h" + h; }
  }

  // ---------- Avatarlar ----------
  var AVATARS = [["🦊", "#ff9f43"], ["🐼", "#8395a7"], ["🦁", "#feca57"], ["🐯", "#ff6b6b"], ["🐸", "#1dd1a1"], ["🐧", "#54a0ff"],
    ["🦉", "#a55eea"], ["🐬", "#48dbfb"], ["🚀", "#5f27cd"], ["⭐", "#f6b93b"], ["🧠", "#ff7f9f"], ["📐", "#10ac84"]];
  function avatarHTML(u, size) {
    size = size || 40;
    var st = "width:" + size + "px;height:" + size + "px;font-size:" + Math.round(size * 0.55) + "px";
    if (u && u.photo && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(u.photo)) return '<span class="acc-av" style="' + st + '"><img src="' + u.photo + '" alt=""></span>';
    var a = AVATARS[(u && u.av) || 0] || AVATARS[0];
    return '<span class="acc-av" style="' + st + ";background:" + a[1] + '">' + a[0] + "</span>";
  }
  // ---------- Rol (o'quvchi / o'qituvchi) va Pro holati ----------
  function rolHTML(r) {
    r = r === "oqituvchi" ? "oqituvchi" : "oquvchi";
    return '<div class="acc-rolw"><div class="acc-rolh">Men kimman?</div><div class="acc-rol">' +
      '<label><input type="radio" name="rol" value="oquvchi"' + (r === "oquvchi" ? " checked" : "") + '> 🎒 O\'quvchiman</label>' +
      '<label><input type="radio" name="rol" value="oqituvchi"' + (r === "oqituvchi" ? " checked" : "") + '> 🎓 O\'qituvchiman</label></div>' +
      '<div class="acc-rolnote">O\'qituvchi profili admin tasdiqlagach faollashadi (🎓 belgisi chiqadi).</div></div>';
  }
  function rolVal(f) { var x = f.querySelector('input[name="rol"]:checked'); return x && x.value === "oqituvchi" ? "oqituvchi" : "oquvchi"; }
  function stOf(u) { return (u && u.st) || {}; }
  function isT(u) { var s = stOf(u); return !!(s.teacher || s.admin); }
  function saveLocal() { try { localStorage.setItem(LS, JSON.stringify(DB)); } catch (e) {} }
  // Bulutdan rol, o'qituvchi tasdig'i va Pro tarifini olib keladi (sahifa yuklanishini sekinlashtirmaslik uchun keshlanadi)
  var stP = null;
  function stRefresh(maxAge) {
    var u = me(); if (!u || !u.cloud) return Promise.resolve(null);
    if (u.st && Date.now() - (u.st.ts || 0) < (maxAge == null ? 6 * 3600000 : maxAge)) return Promise.resolve(u.st);
    if (stP) return stP;
    stP = cloud().then(function (K) {
      if (!K || !K.premiumStatus) return null;
      return K.session().then(function (uid) { return uid && uid === u.cloud ? K.premiumStatus() : null; });
    }).then(function (s) {
      stP = null;
      if (!s || s.error || s.signed === false) return null;
      var cu = me(); if (!cu || cu.cloud !== s.uid) return null;
      cu.st = { teacher: !!s.teacher, admin: !!s.admin, rol: s.rol || "oquvchi", plan: s.plan || "", active: !!s.active, until: s.until ? +new Date(s.until) : 0, ts: Date.now() };
      cu.rol = cu.st.rol; saveLocal(); renderChip();
      // Kuvi (ka-ai.js) ham Pro holatini darhol bilsin
      try { localStorage.setItem("ka.pro.v2", JSON.stringify({ active: cu.st.active, admin: cu.st.admin, until: cu.st.until, ts: Date.now() })); window.dispatchEvent(new CustomEvent("ka-pro", { detail: { pro: cu.st.active, admin: cu.st.admin } })); } catch (e) {}
      return cu.st;
    }, function () { stP = null; return null; });
    return stP;
  }
  function badgesHTML(u) {
    var s = stOf(u), r = s.rol || u.rol || "oquvchi", out = [];
    if (s.admin) out.push('<span class="acc-bd t">👑 Admin · O\'qituvchi</span>');
    else if (s.teacher) out.push('<span class="acc-bd t">🎓 O\'qituvchi ✓</span>');
    else if (r === "oqituvchi") out.push('<span class="acc-bd w">🎓 O\'qituvchi · ⏳ tasdiq kutilmoqda</span>');
    else out.push('<span class="acc-bd s">🎒 O\'quvchi</span>');
    if (s.active && !s.admin) out.push('<span class="acc-bd p">💎 ' + (s.plan === "oqituvchi" ? "O\'qituvchi Pro" : "O\'quvchi Pro") + (s.until ? " · " + new Date(s.until).toLocaleDateString("uz-UZ") + " gacha" : "") + "</span>");
    return out.join("");
  }
  function level(c) { return Math.floor((c || 0) / 100) + 1; }
  function subTxt(u) { var c = u.coins || 0; return (u.group ? u.group + " guruh · " : "") + level(c) + "-daraja · " + (isT(u) ? "Ustoz" : title(c)); }
  var TITLES = ["Yangi o'quvchi", "Izlanuvchi", "Hisobchi", "Bilimdon", "Matematik", "Ustoz", "Akademik", "Grossmeyster"];
  function title(c) { return TITLES[Math.min(TITLES.length - 1, level(c) - 1)]; }

  // Rasmni 256×256 ga kichraytirib saqlash
  function readPhoto(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var S = 256, c = document.createElement("canvas"); c.width = c.height = S;
        var x = c.getContext("2d"), m = Math.min(img.width, img.height);
        x.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { cb(null); };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  // ---------- CSS ----------
  var css = `
  .acc-av{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;flex:0 0 auto;line-height:1;box-shadow:0 0 0 2px rgba(255,255,255,.15)}
  .acc-av img{width:100%;height:100%;object-fit:cover}
  .acc-chip{display:inline-flex;align-items:center;gap:8px;background:#141f38;border:1px solid #243252;border-radius:999px;padding:4px 12px 4px 4px;color:#eef2ff;cursor:pointer;font:700 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;white-space:nowrap}
  .acc-chip:hover{border-color:#7c9bff}
  .acc-chip .coin{color:#ffd479}
  .acc-bg{position:fixed;top:0;right:0;bottom:0;left:0;z-index:3000;background:rgba(3,7,16,.78);display:none;align-items:flex-start;justify-content:center;overflow-y:auto;padding:24px 12px}
  .acc-bg.on{display:flex}
  .acc-card{width:min(640px,100%);background:#141f38;color:#eef2ff;border:1px solid #243252;border-radius:22px;overflow:hidden;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.6);margin:auto 0}
  .acc-cover{position:relative;height:110px;background:linear-gradient(120deg,#6a5af9,#8b5cf6 45%,#10a37f)}
  .acc-cover .acc-x{position:absolute;right:10px;top:10px;background:rgba(0,0,0,.25);border:0;color:#fff;font-size:20px;border-radius:50%;width:36px;height:36px;cursor:pointer}
  .acc-top{display:flex;align-items:flex-end;gap:16px;padding:0 20px;margin-top:-56px;position:relative}
  .acc-top .acc-av{box-shadow:0 0 0 5px #141f38}
  .acc-name{padding-bottom:6px;min-width:0}
  .acc-name h3{margin:0;font-size:22px;line-height:1.2;word-break:break-word}
  .acc-name .sub{color:#9fb0d0;font-size:13px}
  .acc-body{padding:16px 20px 20px;display:flex;flex-direction:column;gap:14px}
  .acc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  @media (max-width:520px){.acc-stats{grid-template-columns:repeat(2,1fr)}}
  .acc-stat{background:#0e1628;border:1px solid #243252;border-radius:14px;padding:10px;text-align:center}
  .acc-stat b{display:block;font:800 22px/1.1 ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .acc-stat span{font-size:11px;color:#9fb0d0;text-transform:uppercase;letter-spacing:.06em}
  .acc-stat.coin b{color:#ffd479}
  .acc-bar{height:10px;border-radius:99px;background:#0b1220;border:1px solid #243252;overflow:hidden}
  .acc-bar i{display:block;height:100%;background:linear-gradient(90deg,#ffd479,#ff9f43)}
  .acc-tabs{display:flex;gap:6px;flex-wrap:wrap}
  .acc-tab{background:#111a2e;border:1px solid #243252;color:#9fb0d0;border-radius:999px;padding:7px 12px;font:600 13px/1 inherit;cursor:pointer}
  .acc-tab[aria-selected=true]{background:#7c9bff;color:#0b1220;border-color:transparent}
  .acc-list{display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto}
  .acc-row{display:flex;align-items:center;gap:10px;background:#0e1628;border:1px solid #243252;border-radius:12px;padding:8px 10px}
  .acc-row .grow{flex:1;min-width:0}
  .acc-row .t{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .acc-row .d{font-size:12px;color:#9fb0d0}
  .acc-row .c{font:700 14px/1 ui-monospace,monospace;color:#ffd479;white-space:nowrap}
  .acc-row.me{border-color:#7c9bff}
  .acc-empty{color:#9fb0d0;padding:8px 2px}
  .acc-btns{display:flex;gap:8px;flex-wrap:wrap}
  .acc-btn{background:#111a2e;border:1px solid #243252;color:#eef2ff;border-radius:12px;padding:10px 14px;font:600 14px/1 inherit;cursor:pointer}
  .acc-btn.primary{background:linear-gradient(135deg,#6a5af9,#8b5cf6);border-color:transparent;color:#fff}
  .acc-btn.danger{color:#ff8585}
  .acc-form{display:flex;flex-direction:column;gap:10px}
  .acc-form label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#9fb0d0;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
  .acc-form input{background:#0b1220;border:1px solid #243252;color:#eef2ff;border-radius:10px;padding:10px 12px;font:500 15px/1.2 inherit;text-transform:none;letter-spacing:0;outline:none}
  .acc-form input:focus{border-color:#7c9bff}
  .acc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .acc-rolh{font-size:12px;color:#9fb0d0;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
  .acc-rol{display:flex;gap:8px;flex-wrap:wrap}
  .acc-form .acc-rol label{flex:1 1 140px;flex-direction:row;align-items:center;gap:8px;border:1px solid #243252;border-radius:12px;padding:10px 12px;cursor:pointer;background:#0f1830;text-transform:none;letter-spacing:0;font-size:14px;color:#eef2ff}
  .acc-form .acc-rol input{accent-color:#a78bfa;width:18px;height:18px;margin:0}
  .acc-form .acc-rol label:has(input:checked){border-color:#a78bfa;background:#1d1640}
  .acc-rolnote{font-size:12px;color:#9fb0d0;margin-top:4px}
  .acc-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
  .acc-rolact:not(:empty){margin-top:-4px}
  .acc-bd{font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px;border:1px solid #243252;background:#0f1830;color:#cfe0ff;white-space:nowrap}
  .acc-bd.t{border-color:#a78bfa;color:#e3d9ff;background:#1d1640}
  .acc-bd.s{border-color:#5ee6c7;color:#bff6e8;background:#0f2a26}
  .acc-bd.w{border-color:#ffd479;color:#ffe7ad;background:#2b2210}
  .acc-bd.p{border-color:#ffd479;color:#1b1300;background:linear-gradient(135deg,#ffd479,#ffb547)}
  .acc-chip.t{border-color:#a78bfa}
  .acc-chip.pro{box-shadow:0 0 0 2px rgba(255,212,121,.6),0 4px 14px rgba(0,0,0,.35)}
  .acc-chip .rb{font-size:13px;line-height:1}
  @media (max-width:520px){.acc-grid2{grid-template-columns:1fr}}
  .acc-avpick{display:flex;flex-wrap:wrap;gap:8px}
  .acc-avpick button{border:2px solid transparent;background:none;padding:2px;border-radius:50%;cursor:pointer}
  .acc-avpick button[aria-pressed=true]{border-color:#ffd479}
  .acc-photo{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .acc-msg{min-height:1.2em;font-size:13px;color:#ff8585}
  .acc-msg.ok{color:#5ee6c7}
  .acc-users{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}
  .acc-user{display:flex;flex-direction:column;align-items:center;gap:6px;background:#0e1628;border:1px solid #243252;border-radius:14px;padding:12px 6px;cursor:pointer;color:#eef2ff;font:600 13px/1.2 inherit;text-align:center}
  .acc-user:hover{border-color:#7c9bff}
  .acc-user small{color:#ffd479;font-weight:700}
  .acc-banner{background:rgba(255,212,121,.12);border:1px solid rgba(255,212,121,.4);color:#ffe4a3;border-radius:12px;padding:10px 12px;font-size:13.5px}
  .acc-toast{position:fixed;left:50%;top:18px;transform:translate(-50%,-30px);z-index:4000;background:#ffd479;color:#2b1d00;font:800 16px/1 -apple-system,BlinkMacSystemFont,sans-serif;padding:10px 16px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;transition:all .25s;pointer-events:none}
  .acc-toast.on{opacity:1;transform:translate(-50%,0)}
  .acc-links{background:#0e1730;border:1px solid #243252;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;font-size:13px}.acc-lrow{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}.acc-links .ig-in{background:#111a2e;border:1px solid #243252;color:#eef2ff;border-radius:8px;padding:6px 8px;width:130px;font-size:13px}
  .acc-fixed{position:fixed;left:10px;top:8px;z-index:960;box-shadow:0 4px 14px rgba(0,0,0,.35);view-transition-name:ka-akkount}
  .acc-pw{display:flex;align-items:stretch;gap:6px;min-width:0}
  .acc-pw input{flex:1 1 auto;min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;letter-spacing:.02em!important}
  .acc-pw input[readonly]{background:#0b1220;border:1px dashed #3a4a78;color:#eef2ff;border-radius:10px;padding:9px 10px;font-size:15px}
  .acc-ic{flex:0 0 auto;min-width:42px;min-height:40px;background:#111a2e;border:1px solid #243252;color:#eef2ff;border-radius:10px;font-size:16px;line-height:1;cursor:pointer;padding:0 8px}
  .acc-ic:hover{border-color:#7c9bff;background:#16223d}
  .acc-btn.sm{padding:8px 11px;font-size:13px}
  a.acc-btn{text-decoration:none;display:inline-flex;align-items:center;gap:6px}
  .acc-form .acc-chk{flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-weight:600;color:#cfd8f0;font-size:13px;cursor:pointer}
  .acc-form .acc-chk input{width:18px;height:18px;padding:0;accent-color:#8b5cf6;flex:0 0 auto}
  .acc-chk small{display:block;color:#8090b0;font-weight:500;font-size:11.5px;margin-top:1px}
  .acc-sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;border:0!important;opacity:0;pointer-events:none;overflow:hidden}
  .acc-keys{background:linear-gradient(180deg,#141d3d,#0e1730);border:1px solid #3d4a8a;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}
  .acc-kh{font-weight:800;font-size:15px}.acc-kh small{color:#9fb0d0;font-weight:500}
  .acc-kr{display:grid;grid-template-columns:62px minmax(0,1fr) auto;align-items:center;gap:8px;min-height:40px}
  .acc-kr>span:first-child{color:#9fb0d0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
  .acc-kr>b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .acc-kr .acc-pw{grid-column:2/4}
  .acc-kr i.dim{font-style:normal}
  .acc-link{background:none;border:0;color:#9fb6ff;text-decoration:underline;cursor:pointer;font:600 13px/1.4 inherit;padding:4px 0;text-align:left}
  .acc-link:hover{color:#c7d4ff}
  .acc-opt{background:#0e1628;border:1px solid #243252;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
  .acc-saved{display:flex;flex-direction:column;gap:6px;border-top:1px solid #1d2a48;padding-top:8px}
  .acc-saved-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:13px}
  .dim{color:#9fb0d0;font-size:12.5px}
  .acc-banner.ok{background:rgba(94,230,199,.1);border-color:rgba(94,230,199,.4);color:#c9fff1}
  `;
  document.head.appendChild(el("style", null, css));

  // ---------- Oynalar ----------
  var bg = el("div", { class: "acc-bg", role: "dialog", "aria-label": "Akkount" });
  var card = el("div", { class: "acc-card" });
  bg.appendChild(card);
  document.body.appendChild(bg);
  var gate = null; // test oldidan kirish talab qilinganda
  bg.addEventListener("click", function (e) { if (e.target === bg && !gate) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && bg.classList.contains("on") && !gate) close(); });
  function open() { bg.classList.add("on"); }
  function close() { bg.classList.remove("on"); }

  var toastEl = el("div", { class: "acc-toast" });
  document.body.appendChild(toastEl);
  var toastT;
  function toast(t) { toastEl.textContent = t; toastEl.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("on"); }, 1400); }

  // ---------- Parollar: qurilmada saqlash, ko'rsatish, nusxalash, brauzerga saqlash ----------
  var LS_KEYS = "ka.kirish.v1";
  function keysAll() { try { var d = JSON.parse(localStorage.getItem(LS_KEYS) || "{}"); return d && typeof d === "object" ? d : {}; } catch (e) { return {}; } }
  function keysPut(k) { try { localStorage.setItem(LS_KEYS, JSON.stringify(k)); } catch (e) {} }
  function keySave(uid, name, group, pw) { if (!uid || !pw) return; var k = keysAll(); k[uid] = { name: name, group: group || "", pw: pw, at: Date.now() }; keysPut(k); }
  function keyGet(uid) { var k = keysAll(); return uid && k[uid] ? k[uid] : null; }
  function keyDel(uid) { var k = keysAll(); if (k[uid]) { delete k[uid]; keysPut(k); } }
  function credId(name, group) { return name + (group ? " | " + group : ""); }
  function hasBrowserKeys() { return !!(window.PasswordCredential && navigator.credentials && navigator.credentials.get); }
  function browserStore(name, group, pw) {
    try { if (window.PasswordCredential && navigator.credentials && navigator.credentials.store) navigator.credentials.store(new window.PasswordCredential({ id: credId(name, group), password: pw, name: name })).catch(function () {}); } catch (e) {}
  }
  function browserGet() {
    try {
      if (!hasBrowserKeys()) return Promise.resolve(null);
      return navigator.credentials.get({ password: true, mediation: "required" }).then(function (c) {
        if (!c || !c.password) return null; var p = String(c.id).split(" | "); return { name: p[0], group: p.slice(1).join(" | "), pw: c.password };
      }, function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }
  var WORDS = ["Tulki", "Burgut", "Lochin", "Kamalak", "Yulduz", "Daryo", "Bulut", "Anor", "Shamol", "Quyosh", "Arslon", "Kitob", "Qalam", "Sayyora", "Olmos", "Zumrad", "Chinor", "Bahor"];
  function rnd(n) { try { var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; } catch (e) { return Math.floor(Math.random() * n); } }
  function genPw() { var d = ""; for (var i = 0; i < 4; i++) d += rnd(10); return WORDS[rnd(WORDS.length)] + "-" + d; }
  function copyText(t) {
    function fb() { var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0"; document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} ta.remove(); return ok; }
    try { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(function () { return true; }, fb); } catch (e) {}
    return Promise.resolve(fb());
  }
  function pwHTML(name, o) {
    o = o || {};
    return '<span class="acc-pw"><input name="' + name + '" type="password" maxlength="64" autocomplete="' + (o.ac || "current-password") + '"' + (o.req ? " required" : "") + (o.ro ? " readonly" : "") +
      (o.min ? ' minlength="' + o.min + '"' : "") + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + (o.val ? ' value="' + esc(o.val) + '"' : "") + ' spellcheck="false" autocapitalize="off" autocorrect="off">' +
      '<button type="button" class="acc-ic" data-pw="eye" title="Ko\'rsatish" aria-label="Parolni ko\'rsatish">👁</button>' +
      '<button type="button" class="acc-ic" data-pw="copy" title="Nusxalash" aria-label="Parolni nusxalash">📋</button>' +
      (o.gen ? '<button type="button" class="acc-ic" data-pw="gen" title="Parol o\'ylab berish" aria-label="Parol o\'ylab berish">🎲</button>' : "") + "</span>";
  }
  function userHidden(v) { return '<input class="acc-sr" type="text" name="username" autocomplete="username" tabindex="-1" aria-hidden="true" value="' + esc(v || "") + '">'; }
  function saveChk(on) { return '<label class="acc-chk"><input type="checkbox" name="keep"' + (on === false ? "" : " checked") + '><span>💾 Parolni shu qurilmada saqlash<small>Umumiy (maktab) kompyuterida belgini olib tashlang</small></span></label>'; }
  function credText(name, group, pw) { return "Kuvonch Academy — kirish ma'lumotlari\nSayt: https://kuvonch.uz\nIsm va familiya: " + name + "\nGuruh: " + (group || "(bo'sh)") + "\nParol: " + pw + "\n\nBoshqa qurilmada: «Kirish» → «Boshqa qurilmadan kirish».\nGmail ulangan bo'lsa: «Gmail bilan kirish»."; }
  function download(fn, text) { try { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); return true; } catch (e) { return false; } }
  function fileName(n) { return "kuvonch-kirish-" + (String(n || "akkount").toLowerCase().replace(/[^a-z0-9а-яёўқғҳ]+/gi, "-").replace(/^-+|-+$/g, "") || "akkount") + ".txt"; }
  // 👁 / 📋 / 🎲 tugmalari — barcha oynalar uchun bitta tinglovchi
  card.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-pw],[data-copy]") : null; if (!b || !card.contains(b)) return;
    e.preventDefault();
    if (b.hasAttribute("data-copy")) { copyText(b.getAttribute("data-copy")).then(function (ok) { toast(ok ? "Nusxalandi 📋" : "Nusxalab bo'lmadi"); }); return; }
    var box = b.closest(".acc-pw"), inp = box && box.querySelector("input"); if (!inp) return;
    var a = b.getAttribute("data-pw"), eye = box.querySelector('[data-pw="eye"]');
    function show(on) { inp.type = on ? "text" : "password"; if (eye) { eye.textContent = on ? "🙈" : "👁"; eye.setAttribute("aria-label", on ? "Parolni yashirish" : "Parolni ko'rsatish"); eye.title = on ? "Yashirish" : "Ko'rsatish"; } }
    if (a === "eye") show(inp.type === "password");
    else if (a === "copy") { if (!inp.value) { toast("Parol hali yozilmagan"); return; } copyText(inp.value).then(function (ok) { toast(ok ? "Parol nusxalandi 📋" : "Nusxalab bo'lmadi"); }); }
    else if (a === "gen") { inp.value = genPw(); show(true); inp.dispatchEvent(new Event("input", { bubbles: true })); toast("Parol tayyor — saqlab qo'ying 💾"); }
  });
  var COVER = '<div class="acc-cover"><button class="acc-x" type="button" aria-label="Yopish">✕</button></div>';
  function bindX() { var x = $(".acc-x", card); if (x) x.onclick = function () { gate ? skipGate() : close(); }; }
  function keysHTML(name, group, pw, o) {
    o = o || {};
    return '<div class="acc-keys"><div class="acc-kh">🔐 Kirish ma\'lumotlari' + (o.sub ? ' <small>' + o.sub + "</small>" : "") + "</div>" +
      '<div class="acc-kr"><span>Ism</span><b>' + esc(name) + '</b><button type="button" class="acc-ic" data-copy="' + esc(name) + '" title="Nusxalash" aria-label="Ismni nusxalash">📋</button></div>' +
      '<div class="acc-kr"><span>Guruh</span><b>' + (group ? esc(group) : '<i class="dim">bo\'sh</i>') + "</b>" + (group ? '<button type="button" class="acc-ic" data-copy="' + esc(group) + '" title="Nusxalash" aria-label="Guruhni nusxalash">📋</button>' : "<span></span>") + "</div>" +
      '<div class="acc-kr"><span>Parol</span>' + (pw ? pwHTML("kpw", { ro: 1, val: pw }) : '<i class="dim">shu qurilmada saqlanmagan</i><button type="button" class="acc-btn sm" data-a="savepw">💾 Saqlash</button>') + "</div>" +
      (pw ? '<div class="acc-btns"><button type="button" class="acc-btn sm" data-a="copyall">📋 Hammasini nusxalash</button><button type="button" class="acc-btn sm" data-a="dl">⬇️ Faylga saqlash</button>' +
        (o.forget ? '<button type="button" class="acc-btn sm danger" data-a="forget">Qurilmadan o\'chirish</button>' : "") + "</div>" : "") + "</div>";
  }
  function wireKeys(name, group, pw) {
    var ca = $('[data-a="copyall"]', card); if (ca) ca.onclick = function () { copyText(credText(name, group, pw)).then(function (ok) { toast(ok ? "Hammasi nusxalandi 📋" : "Nusxalab bo'lmadi"); }); };
    var dl = $('[data-a="dl"]', card); if (dl) dl.onclick = function () { if (download(fileName(name), credText(name, group, pw))) toast("Fayl yuklab olindi ⬇️"); };
  }
  function errHTML(er, extra) { return esc(window.kaCloud ? window.kaCloud.uzError(er) : "Xatolik.") + (extra || ""); }

  // Header'dagi chip
  var chip = el("button", { class: "acc-chip", type: "button", title: "Akkount" });
  chip.onclick = function () { me() ? showProfile() : showLogin(); };
  chip.classList.add("acc-fixed"); document.body.appendChild(chip);
  // chip logotip/menyuni yopmasligi uchun tepada joy qoldiramiz (o'yin canvas sahifalaridan tashqari)
  try { if (!document.querySelector("canvas")) { var pt = parseFloat(getComputedStyle(document.body).paddingTop) || 0; document.body.style.paddingTop = (pt + 44) + "px"; } } catch (e) {}
  function renderChip() {
    try { window.dispatchEvent(new Event("ka-acc")); } catch (e) {}
    var u = me();
    var s = stOf(u);
    chip.classList.toggle("t", !!(u && isT(u))); chip.classList.toggle("pro", !!(u && s.active));
    chip.title = u ? (isT(u) ? "O'qituvchi" : "O'quvchi") + (s.active ? " · Pro" : "") + " — akkount" : "Akkount";
    chip.innerHTML = u ? avatarHTML(u, 28) + '<span>' + esc(u.name.split(" ")[0]) + '</span>' + (isT(u) ? '<span class="rb" aria-label="O\'qituvchi">🎓</span>' : "") + '<span class="coin">🪙 ' + (u.coins || 0) + "</span>" + (s.active ? '<span class="rb" aria-label="Pro">💎</span>' : "")
      : '<span class="acc-av" style="width:28px;height:28px;font-size:15px;background:#243252">👤</span><span>Kirish</span>';
  }

  // Kirish / tanlash oynasi
  function showLogin(msg) {
    var ids = Object.keys(DB).sort(function (a, b) { return (DB[b].last || 0) - (DB[a].last || 0); });
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button" aria-label="Yopish">✕</button></div>' +
      '<div class="acc-body" style="padding-top:18px"><h3 style="margin:0;font-size:22px">👤 Akkountga kirish</h3>' +
      (gate ? '<div class="acc-banner">Test boshlashdan oldin akkountingizni tanlang yoki yangisini oching — to\'g\'ri javoblar uchun coinlar shu akkountga yoziladi (har bir to\'g\'ri javob +' + COIN_PER_CORRECT + ' 🪙).</div>' : "") +
      (msg ? '<div class="acc-msg">' + esc(msg) + "</div>" : "") +
      (ids.length ? '<div class="acc-users">' + ids.map(function (id) { var u = DB[id]; return '<button class="acc-user" type="button" data-id="' + id + '">' + avatarHTML(u, 56) + "<span>" + esc(u.name) + "</span><small>🪙 " + (u.coins || 0) + "</small></button>"; }).join("") + "</div>"
        : '<div class="acc-empty">Bu qurilmada hali akkount yo\'q.</div>') +
      '<div class="acc-btns"><button class="acc-btn primary" type="button" data-a="new">➕ Yangi akkount ochish</button>' +
      '<button class="acc-btn" type="button" data-a="cloud">☁️ Boshqa qurilmadan kirish</button>' +
      '<button class="acc-btn" type="button" data-a="google">🔵 Gmail bilan kirish</button>' +
      (gate ? '<button class="acc-btn" type="button" data-a="skip">Akkountsiz davom etish</button>' : "") + "</div>" +
      '<div class="acc-btns"><button type="button" class="acc-link" data-a="forgot">🔑 Parolni unutdingizmi? Tiklash</button></div>' +
      (memOnly ? '<div class="acc-banner">Brauzer ma\'lumot saqlashga ruxsat bermayapti (maxfiy oyna?). Akkount sahifa yopilguncha ishlaydi.</div>' : "") +
      "</div>";
    $(".acc-x", card).onclick = function () { gate ? skipGate() : close(); };
    $('[data-a="new"]', card).onclick = function () { showForm(); };
    $('[data-a="cloud"]', card).onclick = function () { showCloudLogin(); };
    var sk = $('[data-a="skip"]', card); if (sk) sk.onclick = skipGate;
    $('[data-a="google"]', card).onclick = function () { googleFlow(this, "login", function (t) { var m = $(".acc-msg", card); if (!m) { m = el("div", { class: "acc-msg" }); $(".acc-btns", card).before(m); } m.innerHTML = t; }); };
    $('[data-a="forgot"]', card).onclick = function () { showRecover(); };
    $$(".acc-user", card).forEach(function (b) { b.onclick = function () { askPin(b.getAttribute("data-id")); }; });
    open();
  }

  function askPin(id) {
    var u = DB[id];
    if (u.cloud) return askCloudPass(id);
    if (!u.pin) return login(id);
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button">✕</button></div>' +
      '<div class="acc-top">' + avatarHTML(u, 96) + '<div class="acc-name"><h3>' + esc(u.name) + '</h3><div class="sub">' + esc(u.group || "") + "</div></div></div>" +
      '<div class="acc-body"><form class="acc-form"><label>PIN kod<input type="password" inputmode="numeric" maxlength="4" autocomplete="off" required></label>' +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Kirish</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div></form></div>';
    var f = $("form", card), inp = $("input", f);
    $(".acc-x", card).onclick = function () { gate ? skipGate() : close(); };
    $('[data-a="back"]', card).onclick = function () { showLogin(); };
    f.onsubmit = async function (e) {
      e.preventDefault();
      if ((await hashPin(inp.value)) === u.pin) login(id);
      else { $(".acc-msg", f).textContent = "PIN noto'g'ri."; inp.value = ""; inp.focus(); }
    };
    setTimeout(function () { inp.focus(); }, 50);
  }

  // Bulutdagi akkaunt: sessiya bo'lsa parolsiz; saqlangan parol bo'lsa — o'zi kiradi; aks holda parol so'raladi
  function askCloudPass(id, why) {
    var u = DB[id], saved = keyGet(u.cloud);
    cloud().then(function (K) { return K ? K.session() : null; }).then(function (uid) {
      if (uid && uid === u.cloud) return login(id);
      if (saved && !why) {
        return cloud().then(function (K) { return K ? K.login(u.name, u.group, saved.pw) : Promise.reject({ code: "auth/network-request-failed" }); })
          .then(function (r) { adoptCloud(r.uid, u.name, u.group, r.data); login(r.uid); }, function (er) { askCloudPass(id, er && er.code === "auth/network-request-failed" ? "net" : "old"); });
      }
      card.innerHTML = COVER +
        '<div class="acc-top">' + avatarHTML(u, 96) + '<div class="acc-name"><h3>' + esc(u.name) + '</h3><div class="sub">' + esc(u.group || "") + "</div></div></div>" +
        '<div class="acc-body">' + (why === "old" ? '<div class="acc-banner">Saqlangan parol ishlamadi — ehtimol boshqa qurilmada o\'zgartirilgan. Yangi parolni kiriting.</div>' : "") +
        '<form class="acc-form">' + userHidden(credId(u.name, u.group)) + '<label>Parol' + pwHTML("pw", { req: 1, val: saved && saved.pw }) + "</label>" + saveChk(true) +
        '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Kirish</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div>' +
        '<div class="acc-btns"><button type="button" class="acc-link" data-a="forgot">🔑 Parolni unutdingizmi? Tiklash</button></div></form></div>';
      var f = $("form", card), inp = f.pw, msg = $(".acc-msg", f);
      bindX();
      $('[data-a="back"]', card).onclick = function () { showLogin(); };
      $('[data-a="forgot"]', card).onclick = function () { showRecover({ name: u.name, group: u.group }); };
      f.onsubmit = async function (e) {
        e.preventDefault(); msg.className = "acc-msg ok"; msg.textContent = "Tekshirilmoqda…";
        try {
          var K = await cloud(); if (!K) { msg.className = "acc-msg"; msg.textContent = "Internet bilan aloqa yo'q."; return; }
          var r = await K.login(u.name, u.group, inp.value);
          if (f.keep.checked) keySave(r.uid, u.name, u.group, inp.value); else keyDel(r.uid);
          browserStore(u.name, u.group, inp.value);
          adoptCloud(r.uid, u.name, u.group, r.data); login(r.uid);
        } catch (er) { msg.className = "acc-msg"; msg.innerHTML = errHTML(er, ' <button type="button" class="acc-link" data-a="forgot2">Tiklash</button>'); var b2 = $('[data-a="forgot2"]', card); if (b2) b2.onclick = function () { showRecover({ name: u.name, group: u.group }); }; inp.focus(); inp.select(); }
      };
      setTimeout(function () { inp.focus(); }, 50);
      open();
    });
  }

  // Boshqa qurilmadan kirish: ism + guruh + parol
  function showCloudLogin(pre) {
    pre = pre || {};
    var k = keysAll(), kids = Object.keys(k);
    card.innerHTML = COVER +
      '<div class="acc-body" style="padding-top:18px"><h3 style="margin:0;font-size:22px">☁️ Boshqa qurilmadan kirish</h3>' +
      '<div class="acc-banner">Akkauntni ochgan paytdagi <b>ism</b>, <b>guruh</b> va <b>parolni</b> kiriting — tangalaringiz va natijalaringiz shu qurilmaga keladi. Katta-kichik harf farq qilmaydi.</div>' +
      (kids.length ? '<div class="acc-saved-row"><span class="dim">💾 Saqlangan:</span>' + kids.map(function (id) { return '<button type="button" class="acc-btn sm" data-fill="' + esc(id) + '">' + esc(k[id].name) + (k[id].group ? " · " + esc(k[id].group) : "") + "</button>"; }).join("") + "</div>" : "") +
      '<form class="acc-form">' + userHidden("") + '<div class="acc-grid2"><label>Ism va familiya<input name="name" maxlength="40" required autocomplete="off"></label>' +
      '<label>Guruh<input name="group" maxlength="20" placeholder="Masalan: 05-25" autocomplete="off"></label></div>' +
      '<label>Parol' + pwHTML("pw", { req: 1 }) + "</label>" + saveChk(true) +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Kirish</button>' +
      (hasBrowserKeys() ? '<button class="acc-btn" type="button" data-a="bro">🌐 Brauzer saqlaganidan olish</button>' : "") +
      '<button class="acc-btn" type="button" data-a="back">← Orqaga</button></div>' +
      '<div class="acc-btns"><button type="button" class="acc-link" data-a="forgot">🔑 Parolni unutdingizmi? Tiklash</button><button type="button" class="acc-link" data-a="google">🔵 Gmail bilan kirish</button></div></form></div>';
    var f = $("form", card), msg = $(".acc-msg", f);
    function syncUser() { f.username.value = credId(f.name.value.trim(), f.group.value.trim()); }
    f.name.value = pre.name || ""; f.group.value = pre.group || ""; if (pre.pw) f.pw.value = pre.pw; syncUser();
    f.name.oninput = f.group.oninput = syncUser;
    bindX();
    $('[data-a="back"]', card).onclick = function () { showLogin(); };
    $('[data-a="forgot"]', card).onclick = function () { showRecover({ name: f.name.value.trim(), group: f.group.value.trim() }); };
    $('[data-a="google"]', card).onclick = function () { googleFlow(this, "login", function (t) { msg.className = "acc-msg"; msg.innerHTML = t; }); };
    $$("[data-fill]", card).forEach(function (b) { b.onclick = function () { var x = k[b.getAttribute("data-fill")]; f.name.value = x.name; f.group.value = x.group; f.pw.value = x.pw; syncUser(); f.requestSubmit ? f.requestSubmit() : f.onsubmit(new Event("submit")); }; });
    var bro = $('[data-a="bro"]', card);
    if (bro) bro.onclick = function () { browserGet().then(function (c) { if (!c) { msg.className = "acc-msg"; msg.textContent = "Brauzerda bu sayt uchun saqlangan parol topilmadi."; return; } f.name.value = c.name; f.group.value = c.group; f.pw.value = c.pw; syncUser(); msg.className = "acc-msg ok"; msg.textContent = "Brauzerdan olindi — «Kirish»ni bosing."; }); };
    f.onsubmit = async function (e) {
      if (e && e.preventDefault) e.preventDefault();
      var name = f.name.value.trim().replace(/\s+/g, " "), group = f.group.value.trim(), pw = f.pw.value;
      if (!name || !pw) { msg.className = "acc-msg"; msg.textContent = "Ism va parolni kiriting."; return; }
      msg.className = "acc-msg ok"; msg.textContent = "Tekshirilmoqda…";
      try {
        var K = await cloud(); if (!K) { msg.className = "acc-msg"; msg.textContent = "Internet bilan aloqa yo'q."; return; }
        var r;
        try { r = await K.login(name, group, pw); }
        catch (er) {
          // guruh yozilgan, lekin akkaunt guruhsiz ochilgan bo'lishi mumkin
          if (group && er && /invalid|wrong|not-found/.test(er.code || "")) { r = await K.login(name, "", pw); group = ""; } else throw er;
        }
        var g2 = r.data && r.data.group != null ? r.data.group : group, n2 = (r.data && r.data.name) || name;
        if (f.keep.checked) keySave(r.uid, n2, g2, pw); else keyDel(r.uid);
        browserStore(n2, g2, pw);
        var id = adoptCloud(r.uid, n2, g2, r.data); login(id);
      } catch (er) {
        msg.className = "acc-msg";
        msg.innerHTML = errHTML(er) + (er && /invalid|wrong|not-found/.test(er.code || "") ? '<br><span class="dim">Ism va guruh akkount ochilgandagi bilan bir xil bo\'lishi kerak (masalan, guruh bo\'sh qoldirilgan bo\'lsa — bo\'sh qoldiring). </span><button type="button" class="acc-link" data-a="forgot3">Parolni tiklash →</button>' : "");
        var b3 = $('[data-a="forgot3"]', card); if (b3) b3.onclick = function () { showRecover({ name: name, group: f.group.value.trim() }); };
      }
    };
    setTimeout(function () { (pre.name ? f.pw : f.name).focus(); }, 50);
    open();
  }

  // Gmail oqimi: kirish yoki parolni tiklash
  async function googleFlow(btn, mode, onErr, pre) {
    var t0 = btn && btn.textContent;
    if (btn) { btn.disabled = true; btn.textContent = "Google oynasi…"; }
    try {
      var K = await cloud(); if (!K) throw { code: "auth/network-request-failed" };
      var info = await K.googleStart();
      if (info.data) {
        if (mode === "reset") return showNewPw(info);
        var id = adoptCloud(info.uid, info.data.name, info.data.group, info.data); return login(id);
      }
      if (mode === "new") return showGoogleNew(info, pre);
      showGoogleChoice(info, mode === "reset" ? "Bu Gmail hali hech bir akkountga ulanmagan — shuning uchun u orqali parolni tiklab bo'lmaydi. Quyidagilardan birini tanlang:" : null);
    } catch (er) {
      if (btn) { btn.disabled = false; btn.textContent = t0; }
      if (onErr) onErr(errHTML(er));
    }
  }

  // Parolni tiklash: qurilmadagi, brauzerdagi yoki Gmail orqali yangi parol
  function showRecover(pre) {
    pre = pre || {};
    var k = keysAll(), ids = Object.keys(k).sort(function (a, b) { var m = function (x) { return norm(k[x].name) === norm(pre.name) ? 0 : 1; }; return m(a) - m(b); }), n = 1;
    card.innerHTML = COVER +
      '<div class="acc-body" style="padding-top:18px"><h3 style="margin:0;font-size:22px">🔑 Parolni tiklash</h3>' +
      '<div class="acc-opt"><b>' + (n++) + '. 💾 Shu qurilmada saqlangan parollar</b>' +
      (ids.length ? ids.map(function (id) { var x = k[id]; return '<div class="acc-saved"><div><b>' + esc(x.name) + '</b> <span class="dim">' + esc(x.group || "guruhsiz") + "</span></div>" + pwHTML("s" + id.slice(0, 8), { ro: 1, val: x.pw }) + '<div class="acc-btns"><button type="button" class="acc-btn sm primary" data-use="' + esc(id) + '">Shu bilan kirish</button></div></div>'; }).join("") : '<span class="dim">Bu qurilmada saqlangan parol yo\'q.</span>') + "</div>" +
      (hasBrowserKeys() ? '<div class="acc-opt"><b>' + (n++) + '. 🌐 Brauzer xotirasidan</b><span class="dim">Chrome yoki Yandex bu sayt uchun parolni eslab qolgan bo\'lsa — ko\'rsatadi.</span><div class="acc-btns"><button type="button" class="acc-btn" data-a="bro">Brauzerdan olish</button></div><div class="bro-out"></div></div>' : "") +
      '<div class="acc-opt"><b>' + (n++) + '. 🔵 Gmail orqali yangi parol qo\'yish</b><span class="dim">Akkountga Gmail ulangan bo\'lsa: Google orqali kirasiz va yangi parol qo\'yasiz. Tangalar saqlanadi.</span><div class="acc-btns"><button type="button" class="acc-btn primary" data-a="gre">🔵 Gmail bilan tiklash</button></div></div>' +
      '<div class="acc-msg"></div>' +
      '<div class="acc-banner">Hech biri bo\'lmasa, eski parolni tiklab bo\'lmaydi: parollar shifrlangan holda saqlanadi, ularni hatto o\'qituvchi ham ko\'ra olmaydi. Yangi akkount oching va albatta Gmail ulang.</div>' +
      '<div class="acc-btns"><button class="acc-btn" type="button" data-a="back">← Orqaga</button><button class="acc-btn" type="button" data-a="new">➕ Yangi akkount</button></div></div>';
    var msg = $(".acc-msg", card);
    bindX();
    $('[data-a="back"]', card).onclick = function () { showCloudLogin(pre); };
    $('[data-a="new"]', card).onclick = function () { showForm(); };
    $$("[data-use]", card).forEach(function (b) {
      b.onclick = async function () {
        var x = k[b.getAttribute("data-use")]; msg.className = "acc-msg ok"; msg.textContent = "Tekshirilmoqda…";
        try { var K = await cloud(); if (!K) throw { code: "auth/network-request-failed" }; var r = await K.login(x.name, x.group, x.pw); keySave(r.uid, x.name, x.group, x.pw); login(adoptCloud(r.uid, x.name, x.group, r.data)); }
        catch (er) { msg.className = "acc-msg"; msg.innerHTML = /invalid|wrong/.test((er && er.code) || "") ? "Bu saqlangan parol eskirgan (boshqa joyda o'zgartirilgan). Gmail orqali tiklang." : errHTML(er); }
      };
    });
    var bro = $('[data-a="bro"]', card);
    if (bro) bro.onclick = function () {
      browserGet().then(function (c) {
        var out = $(".bro-out", card);
        if (!c) { out.innerHTML = '<span class="dim">Brauzerda bu sayt uchun saqlangan parol topilmadi.</span>'; return; }
        out.innerHTML = '<div class="acc-saved"><div><b>' + esc(c.name) + '</b> <span class="dim">' + esc(c.group || "guruhsiz") + "</span></div>" + pwHTML("bpw", { ro: 1, val: c.pw }) + '<div class="acc-btns"><button type="button" class="acc-btn sm primary" data-a="bgo">Shu bilan kirish</button></div></div>';
        $('[data-a="bgo"]', card).onclick = function () { showCloudLogin({ name: c.name, group: c.group, pw: c.pw }); };
      });
    };
    $('[data-a="gre"]', card).onclick = function () { googleFlow(this, "reset", function (t) { msg.className = "acc-msg"; msg.innerHTML = t; }); };
    open();
  }

  // Gmail tasdiqlangandan keyin yangi parol
  function showNewPw(info) {
    var d = info.data;
    card.innerHTML = COVER +
      '<div class="acc-top">' + avatarHTML({ av: d.av }, 96) + '<div class="acc-name"><h3>🔑 Yangi parol</h3><div class="sub">' + esc(d.name) + (d.group ? " · " + esc(d.group) : "") + "</div></div></div>" +
      '<div class="acc-body"><div class="acc-banner ok">✔ Gmail orqali tasdiqlandi: <b>' + esc(info.email || "") + "</b></div>" +
      '<form class="acc-form">' + userHidden(credId(d.name, d.group)) + '<label>Yangi parol (kamida 6 ta belgi)' + pwHTML("pw", { ac: "new-password", req: 1, min: 6, gen: 1, ph: "🎲 bosing — parol o'ylab beradi" }) + "</label>" + saveChk(true) +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Saqlash</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div></form></div>';
    var f = $("form", card), msg = $(".acc-msg", f);
    bindX();
    $('[data-a="back"]', card).onclick = function () { cloud().then(function (K) { if (K) K.signOut(); }); showLogin(); };
    f.onsubmit = async function (e) {
      e.preventDefault(); var pw = f.pw.value;
      if (pw.length < 6) { msg.textContent = "Parol kamida 6 ta belgidan iborat bo'lsin."; return; }
      msg.className = "acc-msg ok"; msg.textContent = "Saqlanmoqda…";
      try {
        var K = await cloud(); await K.changePassword(d.name, d.group || "", null, pw);
        var id = adoptCloud(info.uid, d.name, d.group, d);
        if (f.keep.checked) keySave(id, d.name, d.group, pw); else keyDel(id);
        browserStore(d.name, d.group, pw);
        setCur(id); syncIdentity(); renderChip();
        showKeys(id, pw, "✅ Parol yangilandi!");
      } catch (er) { msg.className = "acc-msg"; msg.innerHTML = errHTML(er); }
    };
    setTimeout(function () { f.pw.focus(); }, 50);
    open();
  }

  // Gmail hech bir akkountga ulanmagan: yangi akkount yoki mavjudiga ulash
  function showGoogleChoice(info, note) {
    card.innerHTML = COVER +
      '<div class="acc-body" style="padding-top:18px"><h3 style="margin:0;font-size:20px">🔵 ' + esc(info.email || "Gmail") + "</h3>" +
      '<div class="acc-banner">' + esc(note || "Bu Gmail hali hech bir akkountga ulanmagan. Nima qilamiz?") + "</div>" +
      '<div class="acc-opt"><b>🔗 Mavjud akkountimga ulash</b><span class="dim">Akkauntingiz bor bo\'lsa — ism, guruh va parolni bir marta kiriting. Gmail unga ulanadi, tangalar saqlanadi, keyin parolsiz kirasiz.</span><div class="acc-btns"><button type="button" class="acc-btn primary" data-a="gatt">Ulash</button></div></div>' +
      '<div class="acc-opt"><b>➕ Shu Gmail bilan yangi akkount ochish</b><span class="dim">Keyin «Gmail bilan kirish» tugmasi bilan parolsiz kirasiz.</span><div class="acc-btns"><button type="button" class="acc-btn" data-a="gnew">Yangi akkount</button></div></div>' +
      '<div class="acc-btns"><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div></div>';
    bindX();
    $('[data-a="gatt"]', card).onclick = function () { showGoogleAttach(info); };
    $('[data-a="gnew"]', card).onclick = function () { showGoogleNew(info); };
    $('[data-a="back"]', card).onclick = function () { cloud().then(function (K) { if (K) K.signOut(); }); showLogin(); };
    open();
  }

  function showGoogleAttach(info) {
    var k = keysAll(), kids = Object.keys(k);
    card.innerHTML = COVER +
      '<div class="acc-body" style="padding-top:18px"><h3 style="margin:0;font-size:20px">🔗 Gmail\'ni akkountga ulash</h3>' +
      '<div class="acc-banner">Gmail: <b>' + esc(info.email || "") + '</b>. Akkountingizning ism, guruh va parolini kiriting.</div>' +
      (kids.length ? '<div class="acc-saved-row"><span class="dim">💾 Saqlangan:</span>' + kids.map(function (id) { return '<button type="button" class="acc-btn sm" data-fill="' + esc(id) + '">' + esc(k[id].name) + (k[id].group ? " · " + esc(k[id].group) : "") + "</button>"; }).join("") + "</div>" : "") +
      '<form class="acc-form">' + userHidden("") + '<div class="acc-grid2"><label>Ism va familiya<input name="name" maxlength="40" required autocomplete="off"></label><label>Guruh<input name="group" maxlength="20" placeholder="Masalan: 05-25" autocomplete="off"></label></div>' +
      '<label>Parol' + pwHTML("pw", { req: 1 }) + "</label>" + saveChk(true) +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Ulash va kirish</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div></form></div>';
    var f = $("form", card), msg = $(".acc-msg", f);
    function syncUser() { f.username.value = credId(f.name.value.trim(), f.group.value.trim()); }
    f.name.oninput = f.group.oninput = syncUser;
    $$("[data-fill]", card).forEach(function (b) { b.onclick = function () { var x = k[b.getAttribute("data-fill")]; f.name.value = x.name; f.group.value = x.group; f.pw.value = x.pw; syncUser(); }; });
    bindX();
    $('[data-a="back"]', card).onclick = function () { showGoogleChoice(info); };
    f.onsubmit = async function (e) {
      e.preventDefault();
      var name = f.name.value.trim().replace(/\s+/g, " "), group = f.group.value.trim(), pw = f.pw.value;
      msg.className = "acc-msg ok"; msg.textContent = "Ulanmoqda…";
      try {
        var K = await cloud(); var r = await K.googleAttach(name, group, pw);
        var n2 = (r.data && r.data.name) || name, g2 = r.data && r.data.group != null ? r.data.group : group;
        if (f.keep.checked) keySave(r.uid, n2, g2, pw); else keyDel(r.uid);
        browserStore(n2, g2, pw);
        var id = adoptCloud(r.uid, n2, g2, r.data); login(id);
        setTimeout(function () { toast(r.email ? "🔵 Gmail ulandi: " + r.email : "Kirdingiz. Gmail'ni profilda «Gmail ulash» orqali ulang."); }, 1500);
      } catch (er) { msg.className = "acc-msg"; msg.innerHTML = errHTML(er); }
    };
    setTimeout(function () { f.name.focus(); }, 50);
    open();
  }

  function showGoogleNew(info, pre) {
    pre = pre || {};
    var av = Math.floor(Math.random() * AVATARS.length);
    card.innerHTML = COVER +
      '<div class="acc-top">' + avatarHTML({ av: av }, 96) + '<div class="acc-name"><h3>➕ Gmail bilan yangi akkount</h3><div class="sub">' + esc(info.email || "") + "</div></div></div>" +
      '<div class="acc-body"><form class="acc-form">' + userHidden("") +
      '<div class="acc-grid2"><label>Ism va familiya<input name="name" maxlength="40" required placeholder="Masalan: Aziza Karimova"></label><label>Guruh<input name="group" maxlength="20" placeholder="Masalan: 05-25"></label></div>' +
      rolHTML(pre.rol) +
      '<label>Parol (ixtiyoriy — Gmail\'siz qurilmada ism va guruh bilan kirish uchun)' + pwHTML("pw", { ac: "new-password", min: 6, gen: 1, ph: "bo'sh qoldirsangiz — faqat Gmail bilan kirasiz" }) + "</label>" + saveChk(true) +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Akkount ochish</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div></form></div>';
    var f = $("form", card), msg = $(".acc-msg", f);
    function syncUser() { f.username.value = credId(f.name.value.trim(), f.group.value.trim()); }
    f.name.value = pre.name || info.gname || ""; f.group.value = pre.group || ""; syncUser();
    f.name.oninput = f.group.oninput = syncUser;
    bindX();
    $('[data-a="back"]', card).onclick = function () { showGoogleChoice(info); };
    f.onsubmit = async function (e) {
      e.preventDefault();
      var name = f.name.value.trim().replace(/\s+/g, " "), group = f.group.value.trim(), pw = f.pw.value;
      if (name.length < 2) { msg.textContent = "Ismni yozing."; return; }
      if (pw && pw.length < 6) { msg.textContent = "Parol kamida 6 ta belgidan iborat bo'lsin (yoki bo'sh qoldiring)."; return; }
      msg.className = "acc-msg ok"; msg.textContent = "Akkount ochilmoqda…";
      try {
        var K = await cloud();
        var loc = null; Object.keys(DB).forEach(function (id) { var o = DB[id]; if (!o.cloud && norm(o.name) === norm(name) && norm(o.group) === norm(group)) loc = o; });
        var p = { name: name, group: group, av: loc ? (loc.av | 0) : av, coins: loc ? loc.coins | 0 : 0, correct: loc ? loc.correct | 0 : 0, answered: loc ? loc.answered | 0 : 0, tests: loc ? loc.tests | 0 : 0, rol: rolVal(f) };
        var uid = await K.googleCreate(p, pw || null);
        var id = adoptCloud(uid, name, group, p);
        if (pw) { if (f.keep.checked) keySave(id, name, group, pw); browserStore(name, group, pw); setCur(id); syncIdentity(); renderChip(); showKeys(id, pw, "✅ Akkount ochildi!"); }
        else login(id);
      } catch (er) {
        msg.className = "acc-msg";
        msg.innerHTML = er && er.code === "auth/email-already-in-use" ? "Bu ism va guruh bilan akkount allaqachon bor. <button type=\"button\" class=\"acc-link\" data-a=\"toatt\">Gmail'ni o'sha akkountga ulash →</button>" : errHTML(er);
        var ta = $('[data-a="toatt"]', card); if (ta) ta.onclick = function () { showGoogleAttach(info); };
      }
    };
    setTimeout(function () { f.name.focus(); }, 50);
    open();
  }

  // Akkount ochilgach / parol o'zgargach: kirish ma'lumotlarini saqlab qo'yish oynasi
  function showKeys(id, pw, head, already) {
    var u = DB[id]; if (!u) return showLogin();
    card.innerHTML = COVER +
      '<div class="acc-top">' + avatarHTML(u, 96) + '<div class="acc-name"><h3>' + esc(head || "✅ Akkount ochildi!") + '</h3><div class="sub">Kirish ma\'lumotlarini hozir saqlab qo\'ying</div></div></div>' +
      '<div class="acc-body">' + keysHTML(u.name, u.group, pw, { sub: "— boshqa qurilmadan kirish uchun" }) +
      '<div class="acc-banner">💡 Parolni unutsangiz, uni <b>Gmail</b> orqali tiklaysiz. Hoziroq ulab qo\'ying (bir marta):</div>' +
      '<div class="acc-btns g-row"><button class="acc-btn" type="button" data-a="glink">🔵 Gmail ulash</button><span class="g-msg dim"></span></div>' +
      '<div class="acc-btns"><button class="acc-btn primary" type="button" data-a="go">Davom etish →</button></div></div>';
    wireKeys(u.name, u.group, pw);
    var gl = $('[data-a="glink"]', card), gm = $(".g-msg", card);
    function done(em) { gl.hidden = true; gm.innerHTML = '<b style="color:#5ee6c7">✔ Gmail ulangan: ' + esc(em) + "</b>"; }
    cloud().then(function (K) { return K ? K.googleEmail() : null; }).then(function (em) { if (em) done(em); });
    gl.onclick = async function () {
      gm.textContent = "Google oynasi ochilmoqda…";
      try { var K = await cloud(); var em = await K.linkGoogle(); done(em); toast("Gmail ulandi ✅"); }
      catch (er) { gm.innerHTML = '<span style="color:#ff8585">' + errHTML(er) + "</span>"; }
    };
    function go() { already ? showProfile() : login(id); }
    $('[data-a="go"]', card).onclick = go;
    $(".acc-x", card).onclick = function () { if (already) close(); else go(); };
    open();
  }

  // Profil: parolni o'zgartirish (Gmail bilan ochilgan akkountga parol qo'yish)
  function showChangePw() {
    var u = me(); if (!u || !u.cloud) return showProfile();
    var saved = keyGet(u.cloud);
    card.innerHTML = COVER +
      '<div class="acc-top">' + avatarHTML(u, 96) + '<div class="acc-name"><h3 class="cp-h">🔑 Parolni o\'zgartirish</h3><div class="sub">' + esc(u.name) + (u.group ? " · " + esc(u.group) : "") + "</div></div></div>" +
      '<div class="acc-body"><form class="acc-form">' + userHidden(credId(u.name, u.group)) +
      '<label class="old-l">Hozirgi parol' + pwHTML("old", { val: saved && saved.pw }) + "</label>" +
      '<label>Yangi parol (kamida 6 ta belgi)' + pwHTML("pw", { ac: "new-password", req: 1, min: 6, gen: 1, ph: "🎲 bosing — parol o'ylab beradi" }) + "</label>" + saveChk(true) +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Saqlash</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div>' +
      '<div class="acc-btns"><button type="button" class="acc-link" data-a="forgot">Hozirgi parolni unutdim — Gmail orqali tiklash</button></div></form></div>';
    var f = $("form", card), msg = $(".acc-msg", f), noPw = false;
    bindX();
    $('[data-a="back"]', card).onclick = function () { showProfile(); };
    $('[data-a="forgot"]', card).onclick = function () { googleFlow(this, "reset", function (t) { msg.className = "acc-msg"; msg.innerHTML = t; }); };
    cloud().then(function (K) { return K ? K.session().then(function (uid) { return uid === u.cloud ? K.hasPassword() : true; }) : true; }).then(function (has) {
      if (has) return; noPw = true; $(".old-l", card).hidden = true; $(".cp-h", card).textContent = "🔑 Parol qo'yish";
      msg.className = "acc-msg ok"; msg.textContent = "Akkount Gmail bilan ochilgan. Parol qo'ysangiz, Gmail'siz qurilmada ism va guruh bilan ham kirasiz.";
    });
    f.onsubmit = async function (e) {
      e.preventDefault(); var pw = f.pw.value, old = noPw ? null : f.old.value;
      if (pw.length < 6) { msg.className = "acc-msg"; msg.textContent = "Yangi parol kamida 6 ta belgidan iborat bo'lsin."; return; }
      if (!noPw && !old) { msg.className = "acc-msg"; msg.textContent = "Hozirgi parolni kiriting."; return; }
      msg.className = "acc-msg ok"; msg.textContent = "Saqlanmoqda…";
      try {
        var K = await cloud(); if (!K) throw { code: "auth/network-request-failed" };
        await K.changePassword(u.name, u.group || "", old, pw);
        if (f.keep.checked) keySave(u.cloud, u.name, u.group, pw); else keyDel(u.cloud);
        browserStore(u.name, u.group, pw);
        showKeys(curId(), pw, noPw ? "✅ Parol qo'yildi!" : "✅ Parol o'zgartirildi!", true);
      } catch (er) { msg.className = "acc-msg"; msg.innerHTML = /invalid|wrong/.test((er && er.code) || "") ? "Hozirgi parol noto'g'ri." : errHTML(er); }
    };
    setTimeout(function () { (saved ? f.pw : f.old).focus(); }, 50);
    open();
  }

  // Profil: parolni shu qurilmada saqlash (avval tekshiriladi)
  function showSavePw() {
    var u = me(); if (!u || !u.cloud) return showProfile();
    card.innerHTML = COVER +
      '<div class="acc-top">' + avatarHTML(u, 96) + '<div class="acc-name"><h3>💾 Parolni saqlash</h3><div class="sub">' + esc(u.name) + (u.group ? " · " + esc(u.group) : "") + "</div></div></div>" +
      '<div class="acc-body"><div class="acc-banner">Parolingizni kiriting — to\'g\'riligini tekshirib, shu qurilmada saqlaymiz. Keyin uni 👁 bilan ko\'rib, 📋 bilan nusxalaysiz.</div>' +
      '<form class="acc-form">' + userHidden(credId(u.name, u.group)) + '<label>Parol' + pwHTML("pw", { req: 1 }) + "</label>" +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Tekshirib saqlash</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div>' +
      '<div class="acc-btns"><button type="button" class="acc-link" data-a="forgot">Parolni unutdim — Gmail orqali yangisini qo\'yish</button></div></form></div>';
    var f = $("form", card), msg = $(".acc-msg", f);
    bindX();
    $('[data-a="back"]', card).onclick = function () { showProfile(); };
    $('[data-a="forgot"]', card).onclick = function () { googleFlow(this, "reset", function (t) { msg.className = "acc-msg"; msg.innerHTML = t; }); };
    f.onsubmit = async function (e) {
      e.preventDefault(); msg.className = "acc-msg ok"; msg.textContent = "Tekshirilmoqda…";
      try {
        var K = await cloud(); if (!K) throw { code: "auth/network-request-failed" };
        var uid = await K.verifyPassword(u.name, u.group || "", f.pw.value);
        if (uid !== u.cloud) throw { code: "auth/user-mismatch" };
        keySave(u.cloud, u.name, u.group, f.pw.value); browserStore(u.name, u.group, f.pw.value);
        toast("Parol saqlandi 💾"); showProfile();
      } catch (er) { msg.className = "acc-msg"; msg.innerHTML = /invalid|wrong/.test((er && er.code) || "") ? "Parol noto'g'ri." : errHTML(er); }
    };
    setTimeout(function () { f.pw.focus(); }, 50);
    open();
  }

  // Saytdagi test tizimi ismni "mq_identity" da saqlaydi — akkount bilan sinxronlaymiz
  function syncIdentity() {
    var u = me();
    try {
      if (u) localStorage.setItem("mq_identity", JSON.stringify({ name: u.name, group: u.group || "—" }));
      else localStorage.removeItem("mq_identity");
    } catch (e) {}
  }
  function siteIdentity() { try { return JSON.parse(localStorage.getItem("mq_identity") || "null"); } catch (e) { return null; } }

  function login(id) {
    setCur(id); DB[id].last = Date.now(); save(); syncIdentity(); renderChip();
    toast("Xush kelibsiz, " + DB[id].name.split(" ")[0] + "! 👋");
    if (gate) { var g = gate; gate = null; close(); g(); } else showProfile();
  }
  function logout() { cloud().then(function (K) { if (K) K.signOut(); }); setCur(""); syncIdentity(); renderChip(); showLogin(); }

  // Yangi akkount / tahrirlash
  function showForm(editId) {
    var si = !editId && siteIdentity();
    var u = editId ? DB[editId] : { name: (si && si.name) || "", group: (si && si.group && si.group !== "—") ? si.group : "", av: Math.floor(Math.random() * AVATARS.length), photo: null };
    var draft = { av: u.av || 0, photo: u.photo || null };
    var cloudAcc = !!(editId && u.cloud);
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button">✕</button></div>' +
      '<div class="acc-top"><span class="pv"></span><div class="acc-name"><h3>' + (editId ? "Akkountni tahrirlash" : "Yangi akkount") + '</h3><div class="sub">Rasm yuklang yoki avatar tanlang</div></div></div>' +
      '<div class="acc-body"><form class="acc-form">' +
      '<div class="acc-photo"><label class="acc-btn" style="text-transform:none;letter-spacing:0;font-size:14px;color:#eef2ff;flex-direction:row;cursor:pointer">📷 Rasm yuklash<input type="file" accept="image/*" hidden></label>' +
      '<button class="acc-btn" type="button" data-a="nophoto">Rasmni olib tashlash</button></div>' +
      '<div class="acc-avpick">' + AVATARS.map(function (a, i) { return '<button type="button" data-av="' + i + '" aria-label="Avatar">' + avatarHTML({ av: i }, 40) + "</button>"; }).join("") + "</div>" +
      userHidden("") +
      '<div class="acc-grid2"><label>Ism va familiya<input name="name" maxlength="40" required placeholder="Masalan: Aziza Karimova"></label>' +
      '<label>Guruh<input name="group" maxlength="20" placeholder="Masalan: 05-25"></label></div>' +
      rolHTML(u.rol || (stOf(u).teacher ? "oqituvchi" : "")) +
      (cloudAcc ? '<div class="acc-banner">☁️ Akkaunt bulutda. Ism va guruhni o\'zgartirib bo\'lmaydi (kirish shularga bog\'langan). Parolni profildagi «🔑 Parolni o\'zgartirish» orqali almashtiring.</div>' :
        '<label>' + (editId ? "Bulutga ulash uchun parol (kamida 6 ta belgi)" : "Parol (kamida 6 ta belgi)") + pwHTML("pw", { ac: "new-password", min: 6, req: !editId, gen: 1, ph: editId ? "bo'sh qoldirsangiz akkaunt faqat shu qurilmada qoladi" : "🎲 bosing — parol o'ylab beradi" }) + "</label>" + saveChk(true)) +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">' + (editId ? "Saqlash" : "Akkount ochish") + '</button>' +
      (editId ? "" : '<button class="acc-btn" type="button" data-a="gnew">🔵 Gmail bilan ochish</button>') + '<button class="acc-btn" type="button" data-a="back">← Orqaga</button></div>' +
      "</form></div>";
    var f = $("form", card), pv = $(".pv", card), msg = $(".acc-msg", f);
    f.name.value = u.name || ""; f.group.value = u.group || "";
    if (cloudAcc) { f.name.readOnly = true; f.group.readOnly = true; }
    function syncUser() { f.username.value = credId(f.name.value.trim(), f.group.value.trim()); }
    syncUser(); f.name.addEventListener("input", syncUser); f.group.addEventListener("input", syncUser);
    var gn = $('[data-a="gnew"]', f);
    if (gn) gn.onclick = function () { googleFlow(this, "new", function (t) { msg.className = "acc-msg"; msg.innerHTML = t; }, { name: f.name.value.trim(), group: f.group.value.trim() }); };
    function redraw() {
      pv.innerHTML = avatarHTML({ av: draft.av, photo: draft.photo }, 110);
      $$(".acc-avpick button", f).forEach(function (b) { b.setAttribute("aria-pressed", !draft.photo && +b.getAttribute("data-av") === draft.av ? "true" : "false"); });
    }
    redraw();
    $$(".acc-avpick button", f).forEach(function (b) { b.onclick = function () { draft.av = +b.getAttribute("data-av"); draft.photo = null; redraw(); }; });
    $('input[type=file]', f).onchange = function () {
      var file = this.files && this.files[0]; if (!file) return;
      msg.textContent = "";
      readPhoto(file, function (d) { if (d) { draft.photo = d; redraw(); } else msg.textContent = "Rasmni o'qib bo'lmadi."; });
    };
    $('[data-a="nophoto"]', f).onclick = function () { draft.photo = null; redraw(); };
    $(".acc-x", card).onclick = function () { gate ? skipGate() : close(); };
    $('[data-a="back"]', card).onclick = function () { editId ? showProfile() : showLogin(); };
    f.onsubmit = async function (e) {
      e.preventDefault();
      var name = f.name.value.trim().replace(/\s+/g, " "), pw = f.pw ? f.pw.value : "";
      if (name.length < 2) { msg.textContent = "Ismni yozing."; return; }
      if (f.pw && (pw || !editId) && pw.length < 6) { msg.textContent = "Parol kamida 6 ta belgidan iborat bo'lsin."; return; }
      var dup = Object.keys(DB).some(function (id) { return id !== editId && norm(DB[id].name) === norm(name) && norm(DB[id].group) === norm(f.group.value); });
      if (dup) { msg.textContent = "Bu ism va guruh bilan akkount allaqachon bor — ro'yxatdan tanlang."; return; }
      var id = editId || ("u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
      var rec = DB[id] || { coins: 0, correct: 0, answered: 0, tests: 0, history: [], created: Date.now(), done: {} };
      var oldRol = rec.rol || "oquvchi";
      rec.name = name; rec.group = f.group.value.trim(); rec.av = draft.av; rec.photo = draft.photo; rec.rol = rolVal(f);
      if (f.pw && pw) {
        msg.className = "acc-msg ok"; msg.textContent = "Bulutga ulanmoqda…";
        var K = await cloud();
        if (!K) { msg.className = "acc-msg"; msg.textContent = "Internet bilan aloqa yo'q — keyinroq urinib ko'ring."; return; }
        try {
          var uid = await K.register({ name: rec.name, group: rec.group, av: rec.av, coins: rec.coins, correct: rec.correct, answered: rec.answered, tests: rec.tests, rol: rec.rol }, pw);
          if (uid !== id) { if (DB[id]) delete DB[id]; if (curId() === id) setCur(uid); id = uid; }
          rec.cloud = uid;
        } catch (er) { msg.className = "acc-msg"; msg.textContent = K.uzError(er); return; }
      }
      // bulutdagi akkauntda rol o'zgarsa — serverga yozamiz (o'qituvchi so'rovi adminga ko'rinadi)
      if (cloudAcc && rec.rol !== oldRol) {
        try { var K2 = await cloud(); if (K2) { await K2.session(); await K2.setRol(rec.rol); rec.st = null; } }
        catch (er) { rec.rol = oldRol; msg.className = "acc-msg"; msg.textContent = "Rolni saqlab bo'lmadi: " + (window.kaCloud ? window.kaCloud.uzError(er) : "xato"); return; }
      }
      DB[id] = rec; save();
      if (pw && rec.cloud) { if (f.keep && f.keep.checked) keySave(id, rec.name, rec.group, pw); browserStore(rec.name, rec.group, pw); }
      if (editId) { syncIdentity(); renderChip(); if (pw && rec.cloud) showKeys(id, pw, "☁️ Bulutga ulandi!", true); else { showProfile(); toast("Saqlandi ✅"); } }
      else if (pw && rec.cloud) { setCur(id); DB[id].last = Date.now(); save(); syncIdentity(); renderChip(); showKeys(id, pw); }
      else login(id);
    };
    setTimeout(function () { f.name.focus(); }, 50);
    open();
  }

  // Profil (kengaytirilgan akkount sahifasi)
  function showProfile(tab) {
    var u = me(); if (!u) return showLogin();
    tab = tab || "tarix";
    var c = u.coins || 0, lv = level(c), pct = c % 100;
    var acc = u.answered ? Math.round((u.correct || 0) / u.answered * 100) : 0;
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button" aria-label="Yopish">✕</button></div>' +
      '<div class="acc-top">' + avatarHTML(u, 110) + '<div class="acc-name"><h3>' + esc(u.name) + '</h3><div class="sub">' + esc(subTxt(u)) + '</div><div class="acc-badges">' + badgesHTML(u) + "</div></div></div>" +
      '<div class="acc-rolact"></div>' +
      '<div class="acc-body">' +
      '<div class="acc-stats"><div class="acc-stat coin"><b>' + c + '</b><span>🪙 Coin</span></div><div class="acc-stat"><b>' + (u.tests || 0) + '</b><span>Testlar</span></div>' +
      '<div class="acc-stat"><b>' + (u.correct || 0) + '</b><span>To\'g\'ri javob</span></div><div class="acc-stat"><b>' + acc + '%</b><span>Aniqlik</span></div></div>' +
      '<div><div style="display:flex;justify-content:space-between;font-size:12px;color:#9fb0d0;margin-bottom:4px"><span>' + lv + "-daraja</span><span>" + pct + " / 100 🪙 → " + (lv + 1) + "-daraja</span></div>" +
      '<div class="acc-bar"><i style="width:' + pct + '%"></i></div></div>' +
      (u.cloud ? keysHTML(u.name, u.group, (keyGet(u.cloud) || {}).pw, { forget: 1 }) + '<div class="acc-btns"><button class="acc-btn sm" type="button" data-a="chpw">🔑 Parolni o\'zgartirish</button></div>' : "") +
      (u.cloud ? "" : '<div class="acc-banner">☁️ Akkaunt faqat shu qurilmada. <a href="#" data-a="tocloud" style="color:#ffd479;font-weight:700">Parol qo\'yib bulutga ulang</a> — tangalar yo\'qolmaydi, boshqa qurilmadan ham kirasiz.</div>') +
      '<div class="acc-links"><div class="acc-lrow"><span>📧 Gmail <small class="dim">— parolni unutsangiz, shu orqali tiklaysiz</small></span><span class="g-st">…</span></div>' +
      '<div class="acc-lrow"><span>📸 Instagram</span><span><input class="ig-in" maxlength="30" placeholder="@foydalanuvchi" value="' + esc(u.instagram ? "@" + u.instagram : "") + '"> <button class="acc-btn ig-save" type="button" style="padding:6px 10px;font-size:12px">Saqlash</button></span></div>' +
      '<div class="acc-lmsg" style="font-size:12px;color:#9fb0d0"></div></div>' +
      '<div class="acc-tabs"><button class="acc-tab" data-t="tarix" type="button">📜 Tarix</button><button class="acc-tab" data-t="reyting" type="button">🏆 Reyting</button></div>' +
      '<div class="acc-list"></div>' +
      '<div class="acc-btns"><button class="acc-btn" type="button" data-a="edit">✏️ Tahrirlash / rasm</button><button class="acc-btn" type="button" data-a="switch">🔄 Boshqa akkount</button>' +
      '<button class="acc-btn" type="button" data-a="logout">🚪 Chiqish</button><button class="acc-btn danger" type="button" data-a="del">🗑 O\'chirish</button></div>' +
      '<div style="font-size:12px;color:#9fb0d0">Har bir testdagi to\'g\'ri javob uchun +' + COIN_PER_CORRECT + (u.cloud ? " 🪙. Akkount bulutda saqlanadi — istalgan qurilmadan kirish mumkin." : " 🪙. Akkount shu qurilmadagi brauzerda saqlanadi.") + "</div></div>";
    $$(".acc-tab", card).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-t") === tab ? "true" : "false"); b.onclick = function () { showProfile(b.getAttribute("data-t")); }; });
    var list = $(".acc-list", card);
    if (tab === "tarix") {
      var h = (u.history || []).slice().reverse();
      list.innerHTML = h.length ? h.map(function (r) {
        return '<div class="acc-row"><div class="grow"><div class="t">' + esc(r.test) + '</div><div class="d">' + new Date(r.at).toLocaleString("uz-UZ") + " · " + r.correct + "/" + r.answered + ' to\'g\'ri</div></div><div class="c">+' + r.coins + " 🪙</div></div>";
      }).join("") : '<div class="acc-empty">Hali test yechilmagan. Mavzudagi testni oching — har bir to\'g\'ri javob +' + COIN_PER_CORRECT + " 🪙.</div>";
    } else if (u.cloud) {
      list.innerHTML = '<div class="acc-empty">Reyting yuklanmoqda…</div>';
      cloud().then(function (K) { return K ? K.session().then(function () { return K.top(50); }) : null; }).then(function (rows) {
        if (!rows) throw 0;
        if (!$('.acc-tab[data-t="reyting"][aria-selected="true"]', card)) return;
        var medal = ["🥇", "🥈", "🥉"];
        list.innerHTML = rows.length ? rows.map(function (x, i) {
          return '<div class="acc-row' + (x.id === u.cloud ? " me" : "") + '"><b style="width:26px;text-align:center">' + (medal[i] || i + 1) + "</b>" + avatarHTML({ av: x.av }, 34) +
            '<div class="grow"><div class="t">' + esc(x.name) + (x.t ? ' <span title="O\'qituvchi">🎓</span>' : "") + '</div><div class="d">' + esc(x.group || "") + " · " + (x.t ? "o'qituvchi · " : "") + level(x.coins) + '-daraja</div></div><div class="c">' + x.coins + " 🪙</div></div>";
        }).join("") : '<div class="acc-empty">Hali hech kim yo\'q.</div>';
      }).catch(function () { list.innerHTML = '<div class="acc-empty">Reytingni yuklab bo\'lmadi (internet yoki kirish muddati tugagan). «Chiqish» va qayta kiring.</div>'; });
    } else {
      var ids = Object.keys(DB).sort(function (a, b) { return (DB[b].coins || 0) - (DB[a].coins || 0); });
      var medal = ["🥇", "🥈", "🥉"], cid = curId();
      list.innerHTML = ids.map(function (id, i) {
        var x = DB[id];
        return '<div class="acc-row' + (id === cid ? " me" : "") + '"><b style="width:26px;text-align:center">' + (medal[i] || i + 1) + "</b>" + avatarHTML(x, 34) +
          '<div class="grow"><div class="t">' + esc(x.name) + '</div><div class="d">' + esc(x.group || "") + " · " + level(x.coins) + '-daraja</div></div><div class="c">' + (x.coins || 0) + " 🪙</div></div>";
      }).join("");
    }
    $(".acc-x", card).onclick = close;
    $('[data-a="edit"]', card).onclick = function () { showForm(curId()); };
    // Rol va Pro: tugmalar + serverdan yangilash
    (function () {
      var box = $(".acc-rolact", card); if (!box) return;
      function paint() {
        var cu = me(); if (!cu || cu !== u) return;
        var s = stOf(cu), r = s.rol || cu.rol || "oquvchi", h = "";
        var bd = $(".acc-badges", card); if (bd) bd.innerHTML = badgesHTML(cu);
        var sb = $(".acc-name .sub", card); if (sb) sb.textContent = subTxt(cu);
        if (s.teacher || s.admin) h = '<div class="acc-btns"><a class="acc-btn sm" href="ustoz.html">📊 O\'qituvchi paneli</a>' + (s.active && s.plan === "oqituvchi" ? "" : '<a class="acc-btn sm" href="premium.html#oqituvchi">💎 O\'qituvchi Pro</a>') + "</div>";
        else if (r === "oqituvchi") h = '<div class="acc-banner">🎓 O\'qituvchi profili so\'raldi — admin tasdiqlagach belgingiz yashil bo\'ladi va o\'qituvchi paneli ochiladi.</div>';
        else if (!s.active) h = '<div class="acc-btns"><a class="acc-btn sm" href="premium.html">💎 O\'quvchi Pro</a></div>';
        box.innerHTML = h;
      }
      paint();
      if (u.cloud) stRefresh(2 * 60000).then(paint);
    })();
    (function () {
      var st = $(".g-st", card), lm = $(".acc-lmsg", card), ig = $(".ig-in", card);
      function say(t) { lm.textContent = t || ""; }
      function paintG(email) {
        if (!u.cloud) { st.innerHTML = '<small style="color:#9fb0d0">avval bulutga ulang (parol)</small>'; return; }
        if (email) { st.innerHTML = '<b style="color:#10a37f">✔ ' + esc(email) + '</b> <button class="acc-btn g-un" type="button" style="padding:6px 10px;font-size:12px">Uzish</button>';
          $(".g-un", card).onclick = async function () { try { var K = await cloud(); await K.unlinkGoogle(); paintG(null); say("Gmail uzildi."); } catch (er) { say(window.kaCloud ? window.kaCloud.uzError(er) : "Xatolik"); } }; }
        else { st.innerHTML = '<button class="acc-btn primary g-ln" type="button" style="padding:6px 10px;font-size:12px">🔵 Gmail ulash</button>';
          $(".g-ln", card).onclick = async function () { say("Google oynasi ochilmoqda…"); try { var K = await cloud(); var em = await K.linkGoogle(); paintG(em); say("Gmail ulandi ✅ — endi «Gmail bilan kirish» ishlaydi."); } catch (er) { say(window.kaCloud ? window.kaCloud.uzError(er) : "Xatolik"); } }; }
      }
      paintG(null);
      if (u.cloud) cloud().then(function (K) { return K ? K.googleEmail() : null; }).then(paintG);
      $(".ig-save", card).onclick = function () {
        var v = ig.value.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
        if (v && !/^[A-Za-z0-9._]{1,30}$/.test(v)) { say("Instagram nomi noto'g'ri (faqat harf, raqam, nuqta, _)."); return; }
        u.instagram = v; save(); say(v ? "Instagram saqlandi: @" + v + " (shu qurilmada saqlanadi; ulanish tasdiqlanmaydi)." : "Instagram olib tashlandi.");
      };
    })();
    var tc = $('[data-a="tocloud"]', card); if (tc) tc.onclick = function (e) { e.preventDefault(); showForm(curId()); };
    if (u.cloud) {
      var kk = keyGet(u.cloud); if (kk) wireKeys(u.name, u.group, kk.pw);
      var sp = $('[data-a="savepw"]', card); if (sp) sp.onclick = showSavePw;
      var fg = $('[data-a="forget"]', card); if (fg) fg.onclick = function () { keyDel(u.cloud); toast("Parol bu qurilmadan o'chirildi"); showProfile(tab); };
      $('[data-a="chpw"]', card).onclick = showChangePw;
    }
    $('[data-a="switch"]', card).onclick = function () { showLogin(); };
    $('[data-a="logout"]', card).onclick = logout;
    $('[data-a="del"]', card).onclick = function () {
      var b = this;
      if (b.dataset.sure) {
        var cu = me();
        if (cu && cu.cloud) cloud().then(function (K) { if (K) K.session().then(function () { return K.deleteProfile(); }).then(function () { K.signOut(); }); });
        if (cu && cu.cloud) keyDel(cu.cloud);
        delete DB[curId()]; save(); setCur(""); renderChip(); showLogin(); return;
      }
      b.dataset.sure = "1"; b.textContent = "Rostdan o'chirilsinmi? Yana bosing";
    };
    open();
  }

  // ---------- Saytdagi test oynasi bilan integratsiya ----------
  // Test oynasi (#testModal) ochilganda akkount so'raladi; har bir savolga "Keyingisi/Yakunlash"
  // bosilganda tanlangan javob tekshiriladi va to'g'ri bo'lsa +10 coin beriladi.
  var modal = document.getElementById("testModal");
  var session = null; // { topicId, title, n, correct, coins, user }
  function modalVisible() { if (!modal) return false; var cs = getComputedStyle(modal); return !modal.hidden && cs.display !== "none" && cs.visibility !== "hidden" && modal.offsetHeight > 0; }
  function testsObj() { try { return typeof TESTS !== "undefined" ? TESTS : null; } catch (e) { return null; } }
  function cur() { try { return typeof currentTest !== "undefined" ? currentTest : null; } catch (e) { return null; } }
  function siteCall(fn) { try { if (typeof window[fn] === "function") window[fn](); } catch (e) {} }
  function startSession() {
    var ct = cur();
    session = { topicId: ct && ct.topicId, title: (ct && ct.topicTitle) || "Test", n: 0, correct: 0, coins: 0, user: curId() };
  }
  function endSession() {
    if (!session) return;
    var s = session; session = null;
    var u = s.user && DB[s.user];
    if (!u || !s.n) return;
    u.tests = (u.tests || 0) + 1;
    u.history = (u.history || []).concat([{ test: s.title, at: Date.now(), answered: s.n, correct: s.correct, coins: s.coins }]).slice(-60);
    save();
  }
  function identityStepVisible() { var el = document.getElementById("tm-identity"); return !!(el && !el.hidden); }
  function afterLogin() {
    startSession();
    // Akkount tanlangani uchun saytning "F.I.Sh kiriting" qadamini o'tkazib yuboramiz
    if (identityStepVisible()) siteCall("showQuestionStep");
  }
  function skipGate() { var g = gate; gate = null; close(); if (g) g(); }

  function onModalChange() {
    var vis = modalVisible();
    if (vis && !session && !gate) {
      if (!me()) { gate = function () { if (me()) afterLogin(); else startSession(); }; showLogin(); }
      else { syncIdentity(); if (identityStepVisible()) siteCall("showQuestionStep"); startSession(); }
    } else if (!vis) {
      if (session) endSession();
      if (gate) { gate = null; close(); }
    }
  }
  if (modal) {
    new MutationObserver(onModalChange).observe(modal, { attributes: true, attributeFilter: ["class", "style", "hidden", "open"] });
    setInterval(onModalChange, 800);
  }

  // "Keyingisi / Yakunlash" — javobni hisoblash
  function wrapNext() {
    var orig = window.nextQuestion;
    if (typeof orig !== "function" || orig.__kaWrapped) return;
    var w = function () {
      try {
        var sel = document.querySelector('input[name="tm-opt"]:checked'), ct = cur(), T = testsObj();
        if (sel && ct && T && session) {
          var q = (T[ct.topicId] || [])[ct.qIndex];
          if (q) {
            var ok = parseInt(sel.value, 10) === q.correct, u = session.user && DB[session.user];
            session.n++;
            if (ok) session.correct++;
            if (u) {
              u.answered = (u.answered || 0) + 1;
              if (ok) {
                u.correct = (u.correct || 0) + 1;
                // Bir xil savol uchun coin faqat bir marta (sonlari o'zgargan savol — yangi savol)
                u.done = u.done || {};
                var key = String(ct.topicId) + "|" + norm(q.q);
                if (!u.done[key]) { u.done[key] = 1; u.coins = (u.coins || 0) + COIN_PER_CORRECT; session.coins += COIN_PER_CORRECT; toast("+" + COIN_PER_CORRECT + " 🪙"); }
                else toast("✔ To'g'ri (bu savol uchun coin avval olingan)");
              }
              save(); renderChip();
            }
          }
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
    w.__kaWrapped = true;
    window.nextQuestion = w;
  }
  wrapNext();
  // Qayta topshirish — yangi sessiya; "Bu men emasman" — akkountni almashtirish
  if (typeof window.retakeTest === "function") {
    var origRetake = window.retakeTest;
    window.retakeTest = function () { endSession(); var r = origRetake.apply(this, arguments); startSession(); return r; };
  }
  if (typeof window.changeIdentity === "function") {
    var origChange = window.changeIdentity;
    window.changeIdentity = function () {
      var r = origChange.apply(this, arguments);
      endSession();
      setCur(""); syncIdentity(); renderChip();
      gate = function () { if (me()) afterLogin(); else startSession(); };
      showLogin();
      return r;
    };
  }
  if (me()) syncIdentity();
  if (me() && me().cloud) { cloudSched(); setTimeout(function () { stRefresh(); }, 4000); }

  // Boshqa modullar uchun
  window.kaAccount = {
    me: me, open: function () { me() ? showProfile() : showLogin(); }, cloud: cloud,
    status: function (maxAge) { return stRefresh(maxAge); }, isTeacher: function () { return isT(me()); },
    addCoins: function (n, why) { var u = me(); if (!u) return false; n = Math.max(0, Math.min(200, Math.floor(+n || 0))); if (!n) return false; u.coins = (u.coins || 0) + n; save(); renderChip(); toast("+" + n + " 🪙"); return true; },
    // O'qituvchi jadvaliga natija yuborish (faqat akkauntga kirgan o'quvchi uchun)
    sendResult: function (topic, correct, total) {
      var u = me(); if (!u || !total) return false;
      try {
        fetch("https://script.google.com/macros/s/AKfycbxeBUPBTqpJ8rw9PH4mW8dlonvIJCjeP9ijTfq84R6MrFqCeIjf04uoQsEgVqne2xYBTA/exec", {
          method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name: u.name, group: u.group || "—", topic: String(topic || "").slice(0, 120), correct: correct | 0, total: total | 0, date: new Date().toLocaleString("uz-UZ") })
        }).catch(function () {});
      } catch (e) {}
      try { if (u.cloud) cloud().then(function (K) { if (K) K.session().then(function () { return K.sendResult(topic, correct, total, u); }); }); } catch (e) {}
      return true;
    }
  };
  renderChip();
  // Silliq va tez o'tish: havola ustiga borganda (yoki bosilganda) keyingi sahifa oldindan yuklanadi
  try {
    if (window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules") && !document.querySelector('script[type="speculationrules"]')) {
      var spr = document.createElement("script"); spr.type = "speculationrules";
      spr.textContent = JSON.stringify({ prefetch: [{ source: "document", eagerness: "moderate", where: { and: [{ href_matches: "/*" }, { not: { href_matches: ["/*.apk", "/*.pdf", "/*.zip", "/*.mp3", "/*.mp4", "/*.json"] } }, { not: { selector_matches: "[download], [target=_blank], [data-noprefetch]" } }] } }] });
      document.head.appendChild(spr);
    }
  } catch (e) {}
  // Menyuning fasl va oyga mos bezagi — har bir sahifada (sahifa o'zi ulamagan bo'lsa)
  try { if (!window.kaFasl) { var fs = document.createElement("script"); fs.src = CLOUD_SRC.replace(/ka-bulut\.js$/, "ka-fasl.js"); fs.async = true; document.head.appendChild(fs); } } catch (e) {}
  // Bilim daraxti va Bilimcoin ₿ — har bir sahifada
  try { if (!window.kaDaraxt && !/[?&]daraxt=0/.test(location.search)) { var ds = document.createElement("script"); ds.src = CLOUD_SRC.replace(/ka-bulut\.js$/, "ka-daraxt.js"); ds.async = true; document.head.appendChild(ds); } } catch (e) {}
  if (location.hash === "#akkount") setTimeout(function () { window.kaAccount.open(); }, 300);
})();

/* Tepadagi chiplar (👤 akkount, 🌐 til, 🌳 daraxt) o'yin maydoni yoki o'yin tugmasi ustiga tushib qolsa —
   vaqtincha yashirinadi (bosilgan barmoq o'yinga yetib borsin), joy bo'shashi bilan qaytadi. */
(function () {
  if (window.__kaChipJoy) return; window.__kaChipJoy = 1;
  var SEL = ".acc-fixed,#ka-til-box,.kd-pill";
  var CTRL = "canvas,button,a[href],input,select,textarea,label,summary,[role=button],[onclick],[data-act]";
  try { var st = document.createElement("style"); st.textContent = ".ka-joy{opacity:0!important;pointer-events:none!important;transition:opacity .18s!important}"; document.head.appendChild(st); } catch (e) { return; }
  function fixedUp(n) { for (; n && n.nodeType === 1 && n !== document.body; n = n.parentElement) { var p = getComputedStyle(n).position; if (p === "fixed" || p === "sticky") return true; } return false; }
  function blocks(c) {
    var r = c.getBoundingClientRect(); if (!r.width || !r.height) return false;
    var pe = c.style.pointerEvents; c.style.pointerEvents = "none";
    var y = r.top + r.height / 2, xs = [r.left + 6, r.left + r.width / 2, r.right - 6], hit = false;
    var tinch = window.scrollY < 80 || document.documentElement.scrollHeight <= innerHeight + 4;
    for (var i = 0; i < 3 && !hit; i++) {
      var h = document.elementFromPoint(xs[i], y);
      if (!h || h === document.body || h === document.documentElement || h.closest(SEL)) continue;
      var t = h.closest(CTRL);
      if (!t) { for (var p = h, k = 0; p && p !== document.body && k < 4; p = p.parentElement, k++) { if (getComputedStyle(p).cursor === "pointer" && getComputedStyle(p.parentElement).cursor !== "pointer") { t = p; break; } } }
      if (!t) continue;
      if (t.tagName === "CANVAS") { var q = t.getBoundingClientRect(); hit = q.width >= innerWidth * 0.45 && q.height >= 160; }
      else hit = tinch || fixedUp(t);
    }
    c.style.pointerEvents = pe; return hit;
  }
  // pastga aylantirilganda chiplar yashirinadi, tepaga qaytilganda chiqadi (o'yin maydonini to'smasin)
  var raf = 0, lastY = window.scrollY || 0, down = false;
  function onScroll() {
    var y = window.scrollY || 0;
    if (y < 120) down = false; else if (y > lastY + 6) down = true; else if (y < lastY - 6) down = false;
    if (Math.abs(y - lastY) > 6 || y < 120) lastY = y;
    soon();
  }
  function check() {
    raf = 0; if (document.hidden) return;
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) { try { cs[i].classList.toggle("ka-joy", down || blocks(cs[i])); } catch (e) {} }
  }
  function soon() { if (!raf) raf = requestAnimationFrame(check); }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", soon);
  addEventListener("pointerup", function () { setTimeout(soon, 250); }, true);
  addEventListener("keyup", function () { setTimeout(soon, 250); }, true);
  setInterval(soon, 900);
  setTimeout(soon, 600);
})();

/* iPhone/iPad (Safari) uchun: tugmalar tez-tez bosilganda sahifa kattalashib ketmasin,
   va div/span ko'rinishidagi tugmalarga bosish ishlasin (iOS'da ular ba'zan "bosilmaydi"). */
(function () {
  if (window.__kaIosFix) return; window.__kaIosFix = 1;
  try {
    var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var css = ":where(button,a,[role=button],input,select,textarea,label,summary,[onclick],[data-act]){touch-action:manipulation}";
    if (ios) css += "@media (hover:none){body{cursor:pointer}}";
    var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  } catch (e) {}
})();
