/*!
 * Kuvonch Academy — Bilim daraxti va Bilimcoin ₿
 * Har bir sahifada daraxt belgisi. Har kuni saytga kirilganda daraxtga suv quyiladi va 1 ₿ beriladi.
 * ₿ bulutdagi akkauntda saqlanadi (Firebase qoidalari kuniga faqat 1 ta qo'shishga ruxsat beradi)
 * va Pro obunaga almashtiriladi: 7 kun = 15 ₿, 30 kun = 50 ₿.
 * Bilimcoin — saytning o'z tangasi, haqiqiy pul yoki kriptovalyuta emas.
 * akkount.js o'zi ulaydi; alohida qo'shish shart emas.
 */
(function () {
  "use strict";
  if (window.kaDaraxt) return;
  var LS = "ka.daraxt.v1";
  var NARX = [{ d: 7, c: 15 }, { d: 30, c: 50 }];
  var RM = false; try { RM = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  function tday(ms) { return Math.floor((ms + 5 * 3600000) / 86400000); }
  function today() { return tday(Date.now()); }
  function lsGet() { try { var d = JSON.parse(localStorage.getItem(LS) || "{}"); return d && typeof d === "object" ? d : {}; } catch (e) { return {}; } }
  function lsSet(d) { try { localStorage.setItem(LS, JSON.stringify(d)); } catch (e) {} }
  function el(t, a, h) { var e = document.createElement(t); if (a) for (var k in a) { if (k === "class") e.className = a[k]; else e.setAttribute(k, a[k]); } if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function acc() { return window.kaAccount && window.kaAccount.me ? window.kaAccount.me() : null; }
  function cloud() { return window.kaAccount && window.kaAccount.cloud ? window.kaAccount.cloud() : Promise.resolve(window.kaCloud || null); }

  // ---------- holat ----------
  // S.guest: { suv, streak, last } — mehmon (kirmagan) daraxti; S.u[uid]: bulutdan olingan oxirgi qiymatlar
  var S = lsGet(); S.guest = S.guest || { suv: 0, streak: 0, last: 0 }; S.u = S.u || {};
  var st = { mode: "guest", uid: null, suv: 0, streak: 0, bc: 0, last: 0, busy: false, err: "" };
  function fromGuest() { st.mode = "guest"; st.uid = null; st.suv = S.guest.suv | 0; st.streak = S.guest.streak | 0; st.last = S.guest.last | 0; st.bc = 0; }
  function fromCloud(uid, r) { st.mode = "cloud"; st.uid = uid; st.suv = r.suv | 0; st.streak = r.streak | 0; st.bc = r.bc | 0; st.last = r.dailyAt ? tday(r.dailyAt) : (r.last | 0); S.u[uid] = { suv: st.suv, streak: st.streak, bc: st.bc, last: st.last }; lsSet(S); }
  fromGuest();

  // ---------- CSS ----------
  var css = `
  .kd-pill{view-transition-name:ka-daraxt;position:fixed;right:10px;top:8px;z-index:960;display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px 0 6px;border-radius:999px;border:1px solid #2b5a3c;background:rgba(10,24,18,.86);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#eafff1;font:800 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);transition:transform .2s,border-color .2s,padding .25s,opacity .25s}
  .kd-pill:hover{border-color:#5ee6a0;transform:translateY(-1px)}
  .kd-pill .kd-ic{width:26px;height:26px;display:block}
  .kd-pill .kd-bc{color:#ffd479;font-variant-numeric:tabular-nums;white-space:nowrap}
  .kd-pill.mini{padding:0 5px}.kd-pill.mini .kd-bc{display:none}
  .kd-pill.new::after{content:"";position:absolute;right:4px;top:4px;width:9px;height:9px;border-radius:50%;background:#5ee6a0;box-shadow:0 0 0 0 rgba(94,230,160,.7);animation:kdp 1.6s infinite}
  @keyframes kdp{70%{box-shadow:0 0 0 9px rgba(94,230,160,0)}100%{box-shadow:0 0 0 0 rgba(94,230,160,0)}}
  .kd-toast{position:fixed;right:12px;top:52px;z-index:3500;max-width:min(330px,calc(100vw - 24px));background:linear-gradient(135deg,#0f2a1d,#123524);border:1px solid #2f7a50;color:#eafff1;border-radius:14px;padding:10px 12px;font:600 13.5px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.45);transform:translateY(-12px);opacity:0;transition:all .3s;pointer-events:none}
  .kd-toast.on{transform:none;opacity:1;pointer-events:auto}
  .kd-toast b{color:#ffd479}
  .kd-coin{position:fixed;z-index:3600;font:900 22px/1 sans-serif;color:#ffd479;text-shadow:0 2px 8px rgba(0,0,0,.6);pointer-events:none;transition:transform .9s cubic-bezier(.3,.7,.3,1),opacity .9s}
  .kd-bg{position:fixed;top:0;right:0;bottom:0;left:0;z-index:3000;background:rgba(3,10,7,.78);display:none;align-items:flex-start;justify-content:center;overflow-y:auto;padding:24px 12px}
  .kd-bg.on{display:flex}
  .kd-card{width:min(560px,100%);margin:auto 0;background:#0f1d18;color:#eafff1;border:1px solid #24493a;border-radius:22px;overflow:hidden;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.6)}
  .kd-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px 0}
  .kd-head h3{margin:0;font-size:20px}
  .kd-head small{display:block;color:#8fc9a8;font-size:12.5px;font-weight:600}
  .kd-x{background:rgba(255,255,255,.08);border:0;color:#fff;font-size:18px;border-radius:50%;width:38px;height:38px;cursor:pointer;flex:0 0 auto}
  .kd-cv{display:block;width:100%;height:260px}
  .kd-body{padding:4px 16px 18px;display:flex;flex-direction:column;gap:12px}
  .kd-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .kd-stat{background:#0b1612;border:1px solid #24493a;border-radius:14px;padding:9px 6px;text-align:center}
  .kd-stat b{display:block;font:800 22px/1.1 ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .kd-stat span{font-size:11px;color:#8fc9a8;text-transform:uppercase;letter-spacing:.05em}
  .kd-stat.bc b{color:#ffd479}
  .kd-week{display:flex;gap:6px;justify-content:center}
  .kd-week i{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:13px;background:#0b1612;border:1px solid #24493a;color:#5c8a72}
  .kd-week i.on{background:#1f6b43;border-color:#5ee6a0;color:#eafff1}
  .kd-msg{background:#132a20;border:1px solid #2f7a50;border-radius:12px;padding:10px 12px;font-size:13.5px}
  .kd-msg.warn{background:#2a2412;border-color:#7a6a2f;color:#ffe9a6}
  .kd-shop{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .kd-item{background:linear-gradient(160deg,#16261f,#0e1915);border:1px solid #2b5a3c;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:6px}
  .kd-item h4{margin:0;font-size:16px}
  .kd-item .p{font:800 20px/1 ui-monospace,monospace;color:#ffd479}
  .kd-btn{min-height:44px;border-radius:12px;border:1px solid #2b5a3c;background:#16261f;color:#eafff1;font:700 14px/1 inherit;cursor:pointer;padding:10px 12px}
  .kd-btn.pri{background:linear-gradient(135deg,#2fbf71,#5ee6a0);color:#05140c;border-color:transparent}
  .kd-btn:disabled{opacity:.45;cursor:not-allowed}
  .kd-note{font-size:12px;color:#8fc9a8}
  @media (max-width:420px){.kd-shop{grid-template-columns:1fr}.kd-cv{height:220px}}
  @media (prefers-reduced-motion:reduce){.kd-pill,.kd-toast,.kd-coin{transition:none}.kd-pill.new::after{animation:none}}
  `;
  document.head.appendChild(el("style", null, css));

  // ---------- belgicha (har bir sahifada) ----------
  var ICON = '<svg class="kd-ic" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="29" rx="10" ry="2.2" fill="#0a3d22"/><path d="M15 29V19h2v10z" fill="#8a5a2b"/><circle cx="16" cy="13" r="9" fill="#2fbf71"/><circle cx="11" cy="15" r="5.5" fill="#25a55f"/><circle cx="21" cy="15" r="5.5" fill="#3fd486"/><circle cx="16" cy="9" r="5" fill="#5ee6a0"/><circle cx="19.5" cy="10" r="1.4" fill="#ffd479"/><circle cx="12" cy="13" r="1.2" fill="#ffd479"/></svg>';
  var pill = el("button", { class: "kd-pill", type: "button", title: "Bilim daraxti — har kuni kiring, suv quying va ₿ oling", "aria-label": "Bilim daraxti va Bilimcoin" });
  function renderPill() {
    pill.innerHTML = ICON + '<span class="kd-bc">' + (st.mode === "cloud" ? "₿ " + st.bc : "💧 " + st.suv) + "</span>";
    pill.classList.toggle("new", st.last !== today());
  }
  pill.onclick = function () { openPanel(); };
  function mount() { if (!document.body.contains(pill)) document.body.appendChild(pill); renderPill(); }
  var lastY = 0;
  window.addEventListener("scroll", function () { var y = window.scrollY || 0; pill.classList.toggle("mini", y > 240 && y > lastY); lastY = y; }, { passive: true });

  var toastEl = el("div", { class: "kd-toast", role: "status" }), toastT = 0;
  function toast(h, ms) { if (!document.body.contains(toastEl)) document.body.appendChild(toastEl); toastEl.innerHTML = h; toastEl.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("on"); }, ms || 4200); }
  function flyCoin(from) {
    if (RM) return;
    var r = (from || pill).getBoundingClientRect(), p = pill.getBoundingClientRect(), c = el("div", { class: "kd-coin" }, "₿");
    c.style.left = (r.left + r.width / 2 - 8) + "px"; c.style.top = (r.top + r.height / 2 - 10) + "px"; document.body.appendChild(c);
    requestAnimationFrame(function () { c.style.transform = "translate(" + (p.left + 20 - r.left - r.width / 2) + "px," + (p.top + 6 - r.top - r.height / 2) + "px) scale(.6)"; c.style.opacity = "0.2"; });
    setTimeout(function () { c.remove(); }, 1000);
  }

  // ---------- kunlik suv quyish ----------
  function guestWater() {
    var g = S.guest, t = today();
    if (g.last === t) return false;
    g.streak = g.last === t - 1 ? (g.streak | 0) + 1 : 1; g.suv = (g.suv | 0) + 1; g.last = t; lsSet(S); fromGuest(); return true;
  }
  function sync(auto) {
    if (st.busy) return Promise.resolve();
    var u = acc();
    if (!u || !u.cloud) {
      fromGuest();
      if (auto && guestWater()) {
        renderPill();
        toast("🌳 Daraxtingizga bugun suv quyildi! (" + st.suv + "-marta)<br><small>" + (u ? "₿ olish uchun profilda parol qo'yib bulutga ulang." : "<b>₿ Bilimcoin</b> olish uchun akkountga kiring.") + "</small>");
      }
      renderPill(); if (panelOpen) renderPanel(); return Promise.resolve();
    }
    // keshdan darhol ko'rsatamiz
    var c0 = S.u[u.cloud]; if (c0) { st.mode = "cloud"; st.uid = u.cloud; st.suv = c0.suv | 0; st.streak = c0.streak | 0; st.bc = c0.bc | 0; st.last = c0.last | 0; renderPill(); }
    if (auto && c0 && c0.last === today() && !panelOpen) return Promise.resolve();
    st.busy = true; st.err = "";
    return cloud().then(function (K) {
      if (!K || !K.suvQuy) throw { code: "net" };
      return K.session().then(function (uid) {
        if (!uid || uid !== u.cloud) throw { code: "nosession" };
        return K.suvQuy();
      }).then(function (r) {
        fromCloud(u.cloud, r); renderPill();
        if (!r.already) { flyCoin(); toast("🌳 Daraxtga suv quyildi! <b>+1 ₿</b> · balans: <b>" + r.bc + " ₿</b>" + (r.streak > 1 ? "<br><small>🔥 " + r.streak + " kun ketma-ket!</small>" : "")); }
      });
    }).catch(function (e) {
      var c = e && e.code;
      st.err = c === "nosession" ? "Bulut sessiyasi tugagan — ₿ olish uchun akkountga qayta kiring." : c === "permission-denied" ? "Server hali yangi tangalarni qabul qilmayapti. Birozdan keyin urinib ko'ring." : c === "net" || c === "unavailable" ? "Internet bilan aloqa yo'q." : "Suv quyib bo'lmadi. Keyinroq urinib ko'ring.";
      if (!c0) fromGuest();
    }).then(function () { st.busy = false; renderPill(); if (panelOpen) renderPanel(); });
  }

  // ---------- daraxt chizish (fraktal, urug'dan oltin daraxtgacha) ----------
  var STAGES = [[0, "Urug'"], [1, "Nihol"], [3, "Ko'chat"], [7, "Yosh daraxt"], [14, "Daraxt"], [30, "Katta daraxt"], [60, "Mevali daraxt"], [100, "Oltin daraxt"]];
  function stageOf(n) { var s = STAGES[0], i; for (i = 0; i < STAGES.length; i++) if (n >= STAGES[i][0]) s = STAGES[i]; return s[1]; }
  function nextStage(n) { for (var i = 0; i < STAGES.length; i++) if (STAGES[i][0] > n) return STAGES[i]; return null; }
  function rng(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 10000) / 10000; }; }
  function drawTree(cv, t, waterK) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = cv.clientWidth || 500, H = cv.clientHeight || 260;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    var x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
    var n = st.suv, g = Math.min(1, Math.log(1 + n) / Math.log(101)), wilt = st.last && today() - st.last > 2;
    var sky = x.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#0d2a3a"); sky.addColorStop(1, "#173b2b"); x.fillStyle = sky; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 26; i++) { var sx = (i * 97 % 100) / 100 * W, sy = (i * 53 % 100) / 100 * H * .45; x.fillStyle = "rgba(255,255,255," + (.15 + .25 * Math.abs(Math.sin(t / 900 + i))) + ")"; x.fillRect(sx, sy, 1.5, 1.5); }
    var gy = H - 34;
    x.fillStyle = "#14402a"; x.beginPath(); x.ellipse(W / 2, gy + 40, W * .7, 52, 0, Math.PI, 0); x.fill();
    x.fillStyle = "#1d5a38"; x.beginPath(); x.ellipse(W / 2, gy + 30, W * .45, 30, 0, Math.PI, 0); x.fill();
    x.fillStyle = "#5a3a1c"; x.beginPath(); x.ellipse(W / 2, gy + 4, 34, 7, 0, 0, 7); x.fill();
    var R = rng((st.uid || "mehmon").split("").reduce(function (a, c) { return a * 31 + c.charCodeAt(0) | 0; }, 7));
    var sway = RM ? 0 : Math.sin(t / 1300) * .035, leaves = [], depth = n <= 0 ? 0 : Math.min(9, 2 + Math.round(g * 7)), len = 20 + g * (H * .3);
    if (n <= 0) { // urug'
      x.fillStyle = "#c79a5a"; x.beginPath(); x.ellipse(W / 2, gy - 2, 7, 5, .3, 0, 7); x.fill();
      x.fillStyle = "#8fc9a8"; x.font = "600 12px sans-serif"; x.textAlign = "center"; x.fillText("Birinchi suvni kuting…", W / 2, gy - 22);
    } else {
      (function br(px, py, ang, l, w, d) {
        var ex = px + Math.cos(ang) * l, ey = py + Math.sin(ang) * l, bend = (R() - .5) * l * .16;
        x.strokeStyle = d > depth - 2 ? "#7a4f26" : "#6a4320"; x.lineWidth = Math.max(1, w); x.lineCap = "round";
        x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo((px + ex) / 2 + bend, (py + ey) / 2, ex, ey); x.stroke();
        if (d >= depth) { leaves.push([ex, ey, d]); return; }
        var sw = sway * (d + 1), a1 = .3 + R() * .28, a2 = .3 + R() * .28, k = .7 + R() * .1;
        br(ex, ey, ang - a1 + sw, l * k, w * .7, d + 1);
        br(ex, ey, ang + a2 + sw, l * (1.5 - k), w * .7, d + 1);
        if (d >= 2 && R() < .3) br(ex, ey, ang + (R() - .5) * .2 + sw, l * .62, w * .55, d + 1);
        if (d > 1) leaves.push([ex, ey, d]);
      })(W / 2, gy, -Math.PI / 2, len * .62, 3 + g * 10, 1);
      leaves.forEach(function (p, i) {
        var r = (3 + g * 7) * (p[2] >= depth ? 1 : .6), hue = wilt ? 38 : 120 + (i * 17 % 40);
        x.fillStyle = "hsla(" + hue + "," + (wilt ? 50 : 60) + "%," + (34 + (i * 13 % 22)) + "%,.9)"; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill();
      });
      var tips = leaves.filter(function (p) { return p[2] >= depth; }), maxF = Math.min(14, Math.floor(n / 5)), maxB = Math.min(18, st.streak * 2);
      function spread(cnt, off, fn) { if (!tips.length) return; for (var k = 0; k < cnt; k++) { var p = tips[Math.floor(((k + off) / cnt) * tips.length) % tips.length]; fn(p); } }
      if (st.streak >= 7 && !wilt) spread(maxB, .3, function (p) { x.fillStyle = "#ffb3d1"; x.beginPath(); x.arc(p[0] + 3, p[1] - 2, 2.6, 0, 7); x.fill(); });
      if (n >= 30) spread(maxF, .7, function (p) { x.fillStyle = n >= 100 ? "#ffe066" : "#ffb347"; x.beginPath(); x.arc(p[0], p[1] + 4, 4.2, 0, 7); x.fill(); x.fillStyle = "#7a5200"; x.font = "800 6px sans-serif"; x.textAlign = "center"; x.fillText("₿", p[0], p[1] + 6); });
      if (n >= 100 && !RM) { x.fillStyle = "rgba(255,224,102,.12)"; x.beginPath(); x.arc(W / 2, gy - len * .9, len * 1.1, 0, 7); x.fill(); }
    }
    if (waterK > 0) { // suv quyish animatsiyasi
      var cx = W / 2 + 70, cy = gy - 80 + Math.sin(waterK * 3) * 3;
      x.save(); x.translate(cx, cy); x.rotate(-.5); x.fillStyle = "#3b7bd8"; x.fillRect(-18, -12, 34, 24); x.fillRect(-36, -4, 22, 5); x.restore();
      for (var q = 0; q < 14; q++) { var tt = (waterK * 2 + q / 14) % 1; x.fillStyle = "rgba(120,190,255," + (1 - tt) + ")"; x.beginPath(); x.arc(cx - 34 - tt * 18 + (q % 3) * 3, cy + 6 + tt * 70, 2.2, 0, 7); x.fill(); }
    }
  }

  // ---------- panel ----------
  var bg = el("div", { class: "kd-bg", role: "dialog", "aria-label": "Bilim daraxti" }), card = el("div", { class: "kd-card" }), panelOpen = false, raf = 0, waterT = 0, proInfo = null;
  bg.appendChild(card);
  bg.addEventListener("click", function (e) { if (e.target === bg) closePanel(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panelOpen) closePanel(); });
  function closePanel() { panelOpen = false; bg.classList.remove("on"); cancelAnimationFrame(raf); }
  function openPanel() {
    if (!document.body.contains(bg)) document.body.appendChild(bg);
    panelOpen = true; bg.classList.add("on"); toastEl.classList.remove("on"); renderPanel(); sync(false);
    if (st.mode === "cloud") cloud().then(function (K) { return K && K.premiumStatus ? K.premiumStatus() : null; }).then(function (p) { proInfo = p; if (panelOpen) renderPanel(); });
  }
  function weekHTML() {
    var t = today(), h = "", days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
    for (var i = 6; i >= 0; i--) {
      var d = t - i, on = st.last && d <= st.last && d > st.last - st.streak, wd = new Date(d * 86400000 - 5 * 3600000 + 12 * 3600000).getUTCDay();
      h += '<i class="' + (on ? "on" : "") + '" title="' + (on ? "suv quyilgan" : "") + '">' + (on ? "💧" : days[(wd + 6) % 7]) + "</i>";
    }
    return '<div class="kd-week" aria-label="Oxirgi 7 kun">' + h + "</div>";
  }
  function renderPanel() {
    var u = acc(), nx = nextStage(st.suv), done = st.last === today(), cl = st.mode === "cloud";
    card.innerHTML = '<div class="kd-head"><div><h3>🌳 Bilim daraxtingiz</h3><small>' + stageOf(st.suv) + (nx ? " · keyingi bosqich «" + nx[1] + "»gacha " + (nx[0] - st.suv) + " kun" : " · eng yuqori bosqich!") + '</small></div><button class="kd-x" type="button" aria-label="Yopish">✕</button></div>' +
      '<canvas class="kd-cv" aria-label="Daraxt rasmi"></canvas>' +
      '<div class="kd-body"><div class="kd-stats"><div class="kd-stat"><b>' + st.suv + '</b><span>💧 Suv</span></div><div class="kd-stat"><b>' + st.streak + '</b><span>🔥 Ketma-ket</span></div><div class="kd-stat bc"><b>' + (cl ? st.bc : "—") + '</b><span>₿ Bilimcoin</span></div></div>' +
      weekHTML() +
      (st.busy ? '<div class="kd-msg">Yuklanmoqda…</div>' : st.err ? '<div class="kd-msg warn">' + esc(st.err) + "</div>" :
        done ? '<div class="kd-msg">✅ Bugun daraxtga suv quyildi' + (cl ? " va <b>+1 ₿</b> berildi" : "") + ". Ertaga yana keling — har kuni +1 ₿!</div>" :
          '<div class="kd-msg">💧 Bugun hali suv quyilmagan. <button class="kd-btn pri" type="button" data-a="water" style="margin-left:6px">Suv quyish</button></div>') +
      (cl ? '<div><b>🛒 Bilimcoin do\'koni</b>' + (proInfo && proInfo.active && proInfo.until ? ' <span class="kd-note">· Pro faol: ' + proInfo.until.toLocaleDateString("uz-UZ") + " gacha</span>" : "") + '</div><div class="kd-shop">' +
        NARX.map(function (p) { var ok = st.bc >= p.c; return '<div class="kd-item"><h4>⭐ ' + p.d + " kun Pro</h4><div class=\"p\">" + p.c + ' ₿</div><button class="kd-btn' + (ok ? " pri" : "") + '" type="button" data-buy="' + p.d + '"' + (ok ? "" : " disabled") + ">" + (ok ? "Almashtirish" : "Yana " + (p.c - st.bc) + " ₿ kerak") + "</button></div>"; }).join("") +
        '</div><div class="kd-msg buy-msg" hidden></div>'
        : '<div class="kd-msg warn">₿ Bilimcoin faqat bulutdagi akkauntda yig\'iladi (boshqa qurilmada ham saqlanadi) va Pro obunaga almashtiriladi: <b>15 ₿ = 7 kun</b>, <b>50 ₿ = 30 kun</b>.<br><button class="kd-btn pri" type="button" data-a="login" style="margin-top:8px">' + (u ? "☁️ Bulutga ulash" : "👤 Akkountga kirish") + "</button></div>") +
      '<div class="kd-note">Har kuni saytga kiring — daraxtga suv quyiladi va <b>1 ₿</b> beriladi. 7 kun ketma-ket — gullaydi, 30 kun — meva beradi, 100 kun — oltin daraxt. Bilimcoin — saytning o\'z tangasi, haqiqiy pul yoki kriptovalyuta emas.</div></div>';
    card.querySelector(".kd-x").onclick = closePanel;
    var w = card.querySelector('[data-a="water"]'); if (w) w.onclick = function () { waterT = performance.now(); sync(true).then(function () { startAnim(); }); startAnim(); };
    var lg = card.querySelector('[data-a="login"]'); if (lg) lg.onclick = function () { closePanel(); if (window.kaAccount) window.kaAccount.open(); };
    Array.prototype.forEach.call(card.querySelectorAll("[data-buy]"), function (b) {
      b.onclick = function () {
        var days = +b.getAttribute("data-buy"), m = card.querySelector(".buy-msg");
        if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Tasdiqlang: " + NARX.filter(function (p) { return p.d === days; })[0].c + " ₿ yechiladi"; return; }
        b.disabled = true; b.textContent = "Bajarilmoqda…";
        cloud().then(function (K) { return K.buyPro(days); }).then(function (r) {
          st.bc = r.bc; if (st.uid) { S.u[st.uid].bc = r.bc; lsSet(S); } renderPill();
          proInfo = { active: true, until: r.until }; renderPanel();
          var mm = card.querySelector(".buy-msg"); mm.hidden = false; mm.innerHTML = "🎉 Pro ochildi: <b>" + r.until.toLocaleDateString("uz-UZ") + "</b> gacha. Rahmat!";
        }).catch(function (e) {
          renderPanel(); var mm = card.querySelector(".buy-msg"); mm.hidden = false; mm.className = "kd-msg warn buy-msg";
          mm.textContent = window.kaCloud && window.kaCloud.uzError ? window.kaCloud.uzError(e) : "Bajarib bo'lmadi.";
        });
      };
    });
    startAnim();
  }
  function startAnim() {
    cancelAnimationFrame(raf);
    var cv = card.querySelector(".kd-cv"); if (!cv) return;
    var t0 = performance.now();
    (function loop(t) {
      if (!panelOpen || document.hidden) return;
      var wk = waterT && t - waterT < 2600 ? (t - waterT) / 1000 : 0;
      drawTree(cv, t, wk);
      if (!RM && (t - t0 < 6000 || wk)) raf = requestAnimationFrame(loop);
    })(t0);
  }

  // ---------- ishga tushirish ----------
  window.addEventListener("ka-acc", function () { sync(true); });
  function boot() { mount(); var go = function () { sync(true); }; if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1200); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.kaDaraxt = { open: openPanel, sync: sync, state: function () { return st; }, hide: function (h) { pill.style.display = h ? "none" : ""; } };
})();
