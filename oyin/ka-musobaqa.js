/*!
 * Kuvonch Academy — "Jamoaviy o'yin" va "Chempionat" umumiy interfeysi
 * Kerak: ka-tarmoq.js. Ulash: KAMusobaqa.mount(document.getElementById('app'), {mode:'jamoa'|'chempionat'})
 */
(function () {
  "use strict";
  var N = window.KANet, esc = N.esc;
  var TEAMS = [
    { name: "Qizillar", color: "#ff5c7a" }, { name: "Ko'klar", color: "#4c9bff" },
    { name: "Yashillar", color: "#3fbf7f" }, { name: "Sariqlar", color: "#f4c430" }
  ];
  var OPT = [{ c: "#e5484d", s: "▲" }, { c: "#3e7bfa", s: "◆" }, { c: "#d9a400", s: "●" }, { c: "#2f9e5b", s: "■" }];
  var HOF = "ka.chempionlar.v1";

  var css = `
  .km{--bg:#0b1220;--card:#141f38;--soft:#111a2e;--line:#243252;--text:#eef2ff;--dim:#9fb0d0;--acc:#5ee6c7;--acc2:#7c9bff;--bad:#ff8585;--gold:#f4c430}
  .km{color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  .km *{box-sizing:border-box}
  .km .card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;margin-bottom:14px}
  .km h2{margin:0 0 10px;font-size:20px}.km h3{margin:0 0 8px;font-size:16px}
  .km .dim{color:var(--dim);font-size:14px;line-height:1.45}
  .km label{display:block;font-size:13px;color:var(--dim);margin:10px 0 4px}
  .km input,.km select{width:100%;font:inherit;font-size:16px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--soft);color:var(--text)}
  .km .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .km button{font:inherit;font-weight:700;font-size:15px;border-radius:12px;border:1px solid var(--line);background:var(--soft);color:var(--text);padding:11px 16px;cursor:pointer}
  .km button.main{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#08131f;border:0}
  .km button:disabled{opacity:.5;cursor:default}
  .km .games{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:4px}
  .km .gchip{display:flex;align-items:center;gap:8px;padding:10px;border-radius:12px;border:2px solid var(--line);background:var(--soft);cursor:pointer;font-weight:600;font-size:14px}
  .km .gchip.on{border-color:var(--acc);background:rgba(94,230,199,.08)}
  .km .gchip span{font-size:22px}
  .km .two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media (max-width:700px){.km .two{grid-template-columns:1fr}}
  .km .code{font:800 48px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:10px;color:var(--gold);text-align:center;padding:8px 0}
  .km .err{color:var(--bad);font-size:14px;min-height:18px;margin-top:8px}
  .km .teams{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
  .km .team{border-radius:14px;padding:10px;background:var(--soft);border:2px solid var(--line)}
  .km .team h4{margin:0 0 6px;font-size:15px}
  .km .pl{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;border-radius:10px;background:rgba(255,255,255,.04);margin:4px 0;font-size:14px}
  .km .pl .x{background:none;border:0;color:var(--dim);padding:2px 6px;font-size:14px}
  .km .pl .mv{background:none;border:1px solid var(--line);padding:2px 8px;font-size:12px;border-radius:8px}
  .km .pl.me{outline:2px solid var(--acc)}
  .km .pl.off{opacity:.45}
  .km .hdr{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:14px;color:var(--dim);margin-bottom:8px}
  .km .tbar{height:8px;border-radius:99px;background:var(--soft);overflow:hidden;margin-bottom:12px}
  .km .tbar i{display:block;height:100%;background:linear-gradient(90deg,var(--acc),var(--gold));width:100%}
  .km .q{font-size:clamp(22px,4.5vw,38px);font-weight:800;text-align:center;padding:18px 10px;line-height:1.25}
  .km .opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .km .opt{display:flex;align-items:center;gap:10px;min-height:70px;font-size:clamp(17px,3vw,24px);color:#fff;border:0;border-radius:14px;text-align:left;padding:12px 14px}
  .km .opt b{font-size:20px;opacity:.85}
  .km .opt.dimmed{opacity:.35}.km .opt.right{outline:4px solid #fff;box-shadow:0 0 0 7px #2f9e5b}.km .opt.pick{outline:4px solid #fff}
  .km .big{font-size:22px;font-weight:800;text-align:center;margin:12px 0}
  .km .rope{position:relative;height:46px;border-radius:99px;margin:12px 0 4px;background:linear-gradient(90deg,var(--t0) 0 50%,var(--t1) 50% 100%);opacity:.95}
  .km .rope .line{position:absolute;left:4%;right:4%;top:50%;height:6px;margin-top:-3px;background:repeating-linear-gradient(90deg,#c9a26b 0 10px,#8a6a3e 10px 14px);border-radius:3px}
  .km .rope .knot{position:absolute;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#fff;color:#111;display:flex;align-items:center;justify-content:center;font-size:18px;transition:left .8s cubic-bezier(.3,1.4,.5,1);box-shadow:0 2px 10px rgba(0,0,0,.4)}
  .km .rope .mid{position:absolute;left:50%;top:-6px;bottom:-6px;width:2px;background:#fff;opacity:.6}
  .km .tscores{display:flex;justify-content:space-between;font-weight:800;font-size:15px}
  .km .bars .b{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:14px}
  .km .bars .b i{display:block;height:16px;border-radius:8px;transition:width .6s}
  .km table{width:100%;border-collapse:collapse;font-size:14px}
  .km td,.km th{padding:7px 6px;border-bottom:1px solid var(--line);text-align:left}
  .km th{color:var(--dim);font-weight:600;font-size:12px}
  .km tr.me td{background:rgba(94,230,199,.08)}
  .km tr.out td{opacity:.45}
  .km .podium{display:flex;align-items:flex-end;justify-content:center;gap:10px;margin:16px 0}
  .km .pod{text-align:center;width:31%;max-width:150px}
  .km .pod .blk{border-radius:12px 12px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:8px;font-size:28px;font-weight:800;color:#08131f}
  .km .pod .nm{font-weight:700;font-size:14px;margin-bottom:6px;word-break:break-word}
  .km .pts{font-size:26px;font-weight:800;text-align:center}
  .km .pts.good{color:#5ee6a0}.km .pts.no{color:var(--bad)}
  .km .tag{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:700;background:var(--soft);border:1px solid var(--line)}
  .km .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
  .km .share{display:flex;gap:8px}.km .share input{font-size:13px}
  `;

  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function teamDot(t) { return t >= 0 && TEAMS[t] ? '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + TEAMS[t].color + '"></span> ' : ""; }
  function addCoins(right, total, title) {
    try {
      var id = localStorage.getItem("ka.joriy.v1"), db = JSON.parse(localStorage.getItem("ka.akkountlar.v1") || "{}");
      if (!id || !db[id] || !right) return 0; var u = db[id], c = right * 2;
      u.coins = (u.coins || 0) + c; u.correct = (u.correct || 0) + right; u.answered = (u.answered || 0) + total;
      u.history = (u.history || []).concat([{ test: title, at: Date.now(), answered: total, correct: right, coins: c }]).slice(-60);
      localStorage.setItem("ka.akkountlar.v1", JSON.stringify(db)); return c;
    } catch (e) { return 0; }
  }
  function getHof() { try { return JSON.parse(localStorage.getItem(HOF) || "[]"); } catch (e) { return []; } }

  function mount(root, opt) {
    var MODE = opt.mode === "chempionat" ? "chempionat" : "jamoa";
    var CH = MODE === "chempionat";
    if (!document.getElementById("km-css")) { var st = document.createElement("style"); st.id = "km-css"; st.textContent = css; document.head.appendChild(st); }
    root.classList.add("km");
    var qs = new URLSearchParams(location.search);
    var me = N.identity();
    var selGame = N.GAMES[qs.get("oyin")] ? qs.get("oyin") : "tub";

    /* ===================== BOSH EKRAN ===================== */
    function home(errMsg) {
      var gameChips = Object.keys(N.GAMES).map(function (k) { var g = N.GAMES[k]; return '<div class="gchip' + (k === selGame ? " on" : "") + '" data-g="' + k + '"><span>' + g.icon + "</span>" + esc(g.name) + "</div>"; }).join("");
      var hof = CH ? getHof() : [];
      root.innerHTML =
        '<div class="card"><div class="row"><div><label>Ism familiya</label><input id="kmName" maxlength="30" value="' + esc(me.name) + '" placeholder="Masalan: Ali Valiyev"></div>' +
        '<div><label>Guruh</label><input id="kmGroup" maxlength="15" value="' + esc(me.group) + '" placeholder="05-25"></div></div></div>' +
        '<div class="two">' +
        '<div class="card"><h2>' + (CH ? "🏆 Turnir ochish" : "➕ Xona ochish") + '</h2>' +
        '<p class="dim">' + (CH ? "Siz tashkilotchisiz (masalan, o'qituvchi proyektorda). O'yinchilar kod bilan qo'shiladi." : "Kod chiqadi — do'stlaringiz shu kod bilan qo'shiladi va jamoalarga bo'linasiz.") + '</p>' +
        '<label>O\'yin</label><div class="games">' + gameChips + "</div>" +
        '<div class="row"><div><label>O\'yinchilar soni (eng ko\'pi)</label><select id="kmMax">' + [2, 4, 6, 8, 10, 12, 16, 20, 25, 30, 40, 50].map(function (n) { return '<option value="' + n + '"' + (n === (CH ? 16 : 8) ? " selected" : "") + ">" + n + " kishi</option>"; }).join("") + "</select></div>" +
        (CH
          ? '<div><label>Turnir tizimi</label><select id="kmFmt"><option value="olimpiya">Olimpiya — har raundda yarmi chiqadi</option><option value="liga">Liga — ballar jamlanadi</option></select></div>'
          : '<div><label>Jamoalar</label><select id="kmTeams"><option value="2" selected>2 jamoa (arqon tortish)</option><option value="3">3 jamoa</option><option value="4">4 jamoa</option><option value="0">Har kim o\'zi uchun</option></select></div>') +
        "</div>" +
        '<div class="row"><div><label>' + (CH ? "Har raundda savollar" : "Savollar soni") + '</label><select id="kmNq">' + (CH ? [5, 8, 10] : [10, 15, 20]).map(function (n, i) { return '<option value="' + n + '"' + (i === 1 ? " selected" : "") + ">" + n + " ta</option>"; }).join("") + "</select></div>" +
        '<div><label>Har savolga vaqt</label><select id="kmDur"><option value="10">10 soniya</option><option value="15" selected>15 soniya</option><option value="20">20 soniya</option><option value="30">30 soniya</option></select></div></div>' +
        (CH ? '<label>Liga raundlari</label><select id="kmRounds"><option value="3" selected>3 raund</option><option value="5">5 raund</option></select>'
          : '<label style="display:flex;align-items:center;gap:8px;margin-top:12px"><input type="checkbox" id="kmPlay" checked style="width:auto"> Men ham o\'ynayman</label>') +
        '<div class="actions"><button class="main" id="kmCreate">' + (CH ? "🏆 Turnirni ochish" : "➕ Xona ochish") + '</button></div></div>' +
        '<div class="card"><h2>🔑 Kod bilan qo\'shilish</h2><p class="dim">Xona egasi bergan 5 belgili kodni yozing.</p>' +
        '<label>Xona kodi</label><input id="kmCode" maxlength="5" autocomplete="off" style="text-transform:uppercase;letter-spacing:6px;font-size:24px;text-align:center" value="' + esc(N.normCode(qs.get("kod") || "")) + '" placeholder="ABCDE">' +
        '<div class="actions"><button class="main" id="kmJoin">🔑 Qo\'shilish</button></div></div>' +
        "</div>" +
        '<div class="err" id="kmErr">' + esc(errMsg || "") + "</div>" +
        (CH ? '<div class="card"><h2>🥇 Chempionlar zali</h2>' + (hof.length ? '<table><thead><tr><th>Sana</th><th>O\'yin</th><th>🥇</th><th>🥈</th><th>🥉</th><th>Ishtirokchi</th></tr></thead><tbody>' +
          hof.slice(0, 30).map(function (h) { var g = N.GAMES[h.game] || {}; return "<tr><td>" + esc(h.date) + "</td><td>" + (g.icon || "") + " " + esc(g.name || h.game) + "</td><td><b>" + esc(h.p[0] || "—") + "</b></td><td>" + esc(h.p[1] || "—") + "</td><td>" + esc(h.p[2] || "—") + "</td><td>" + h.n + "</td></tr>"; }).join("") + "</tbody></table>"
          : '<p class="dim">Bu qurilmada hali turnir o\'tkazilmagan. Turnir tugagach g\'oliblar shu yerda saqlanadi.</p>') + "</div>" : "");
      root.querySelectorAll(".gchip").forEach(function (c) { c.onclick = function () { selGame = c.dataset.g; root.querySelectorAll(".gchip").forEach(function (x) { x.classList.toggle("on", x === c); }); }; });
      root.querySelector("#kmCreate").onclick = createRoom;
      root.querySelector("#kmJoin").onclick = joinRoom;
      root.querySelector("#kmCode").addEventListener("keydown", function (e) { if (e.key === "Enter") joinRoom(); });
    }
    function readMe() {
      var n = root.querySelector("#kmName").value.trim().replace(/\s+/g, " "), g = root.querySelector("#kmGroup").value.trim();
      if (n.length < 2) { root.querySelector("#kmErr").textContent = "Ismingizni yozing."; root.querySelector("#kmName").focus(); return null; }
      me = { name: n, group: g }; N.saveIdentity(n, g); return me;
    }
    function busy(on, txt) { root.querySelectorAll("button").forEach(function (b) { b.disabled = on; }); if (txt != null) root.querySelector("#kmErr").textContent = txt; }

    /* ===================== HOST (xona egasi) ===================== */
    var H = null; // host holati
    function createRoom() {
      var m = readMe(); if (!m) return;
      var cfg = {
        game: selGame, max: +root.querySelector("#kmMax").value, nq: +root.querySelector("#kmNq").value, dur: +root.querySelector("#kmDur").value,
        teams: CH ? 0 : +root.querySelector("#kmTeams").value,
        format: CH ? root.querySelector("#kmFmt").value : "jamoa",
        rounds: CH ? +root.querySelector("#kmRounds").value : 1,
        hostPlays: CH ? false : root.querySelector("#kmPlay").checked
      };
      busy(true, "⏳ Xona ochilmoqda…");
      H = { cfg: cfg, phase: "lobby", round: 0, qi: -1, qs: [], players: {}, order: [], timer: 0, api: null };
      if (cfg.hostPlays) addPlayer("HOST", m.name, m.group);
      N.host({
        onConn: function (id, hello) {
          if (H.phase !== "lobby") return "O'yin allaqachon boshlangan.";
          if (countPlayers() >= cfg.max) return "Xona to'lgan (" + cfg.max + " kishi).";
          var nm = String(hello.name || "").trim().slice(0, 30); if (nm.length < 2) return "Ism yozilmagan.";
          for (var k in H.players) if (H.players[k].name.toLowerCase() === nm.toLowerCase()) return "Bu ism band — boshqa ism yozing.";
          return true;
        },
        onJoin: function (id, hello) { addPlayer(id, String(hello.name).trim().slice(0, 30), String(hello.group || "").slice(0, 15)); hostRender(); syncLobby(); },
        onMsg: function (id, msg) { if (msg.type === "ans") onAns(id, msg.i, msg.c); },
        onLeave: function (id) {
          var p = H.players[id]; if (!p) return;
          if (H.phase === "lobby") { delete H.players[id]; H.order = H.order.filter(function (x) { return x !== id; }); syncLobby(); }
          else { p.online = false; maybeEarlyReveal(); }
          hostRender();
        },
        onError: function () {}
      }).then(function (api) {
        H.api = api; hostRender(); window.addEventListener("beforeunload", warnLeave);
      }).catch(function (e) { H = null; home("Xona ochilmadi: internetni tekshiring. (" + (e && (e.type || e.message) || e) + ")"); });
    }
    function warnLeave(e) { if (H && H.phase !== "end") { e.preventDefault(); e.returnValue = ""; } }
    function countPlayers() { return Object.keys(H.players).length; }
    function addPlayer(id, name, group) {
      var t = -1;
      if (H.cfg.teams > 0) { var cnt = []; for (var i = 0; i < H.cfg.teams; i++) cnt.push(0); for (var k in H.players) cnt[H.players[k].team]++; t = cnt.indexOf(Math.min.apply(null, cnt)); }
      H.players[id] = { id: id, name: name, group: group, team: t, total: 0, rs: 0, hist: [], correct: 0, answered: 0, out: 0, ans: null, ms: 0, pts: 0, online: true };
      H.order.push(id);
    }
    function plist() { return H.order.map(function (id) { return H.players[id]; }).filter(Boolean); }
    function pubPlayers() { return plist().map(function (p) { return { id: p.id, name: p.name, team: p.team, total: p.total, rs: p.rs, out: p.out, online: p.online, pts: p.pts, correct: p.correct }; }); }
    function teamScores() {
      var out = []; for (var t = 0; t < H.cfg.teams; t++) { var ms = plist().filter(function (p) { return p.team === t; }); var s = ms.reduce(function (a, p) { return a + p.total; }, 0); out.push({ t: t, n: ms.length, score: ms.length ? Math.round(s / ms.length) : 0 }); }
      return out;
    }
    function lobbyMsg() { return { type: "lobby", cfg: H.cfg, code: H.api.code, players: pubPlayers() }; }
    function syncLobby() { if (H.api) H.api.broadcast(lobbyMsg()); }
    function active() { return plist().filter(function (p) { return !p.out; }); }

    function startGame() {
      if (countPlayers() < 2) return;
      H.round = 0; plist().forEach(function (p) { p.total = 0; p.correct = 0; p.answered = 0; p.out = 0; p.hist = []; });
      startRound();
    }
    function startRound() {
      H.round++; H.qs = N.makeQuestions(H.cfg.game, H.cfg.nq); H.qi = -1;
      active().forEach(function (p) { p.rs = 0; });
      H.api.broadcast({ type: "round", round: H.round, players: pubPlayers() });
      nextQ();
    }
    function nextQ() {
      clearTimeout(H.timer);
      H.qi++;
      if (H.qi >= H.qs.length) { endRound(); return; }
      H.phase = "q"; H.qStart = Date.now();
      plist().forEach(function (p) { p.ans = null; p.ms = 0; p.pts = 0; });
      var q = H.qs[H.qi];
      var msg = { type: "q", i: H.qi, n: H.qs.length, round: H.round, q: q.q, opts: q.opts, dur: H.cfg.dur };
      H.api.broadcast(msg);
      H.timer = setTimeout(reveal, H.cfg.dur * 1000 + 500);
      if (H.cfg.hostPlays && !H.players.HOST.out) clientShowQ(msg, "HOST");
      else hostRender();
    }
    function onAns(id, i, c) {
      var p = H.players[id];
      if (!p || H.phase !== "q" || i !== H.qi || p.out || p.ans !== null || typeof c !== "number") return;
      p.ans = c; p.ms = Date.now() - H.qStart;
      if (!H.cfg.hostPlays) hostRender();
      maybeEarlyReveal();
    }
    function maybeEarlyReveal() {
      if (H.phase !== "q") return;
      var waiting = active().filter(function (p) { return p.online && p.ans === null; });
      if (!waiting.length) { clearTimeout(H.timer); H.timer = setTimeout(reveal, 700); }
    }
    function reveal() {
      if (H.phase !== "q") return;
      clearTimeout(H.timer);
      H.phase = "reveal";
      var q = H.qs[H.qi], durMs = H.cfg.dur * 1000, pts = {};
      active().forEach(function (p) {
        p.answered++;
        if (p.ans === q.a) { p.pts = Math.max(100, 500 + Math.round(500 * (1 - Math.min(p.ms, durMs) / durMs))); p.correct++; }
        else p.pts = 0;
        p.total += p.pts; p.rs += p.pts; pts[p.id] = { p: p.pts, c: p.ans };
      });
      var msg = { type: "reveal", i: H.qi, a: q.a, pts: pts, players: pubPlayers(), teams: teamScores(), last: H.qi === H.qs.length - 1 };
      H.api.broadcast(msg);
      if (H.cfg.hostPlays) clientReveal(msg, "HOST"); else hostRender(msg);
      H.timer = setTimeout(nextQ, 3800);
    }
    function endRound() {
      var A = active();
      A.forEach(function (p) { p.hist[H.round - 1] = p.rs; });
      if (H.cfg.format === "jamoa") return endGame();
      if (H.cfg.format === "liga") {
        if (H.round >= H.cfg.rounds) return endGame();
        H.phase = "roundEnd";
        var m1 = { type: "roundEnd", round: H.round, of: H.cfg.rounds, players: pubPlayers(), out: [] };
        H.api.broadcast(m1); hostRender(m1); return;
      }
      // olimpiya
      if (A.length <= 2) return endGame();
      var sorted = A.slice().sort(function (a, b) { return b.rs - a.rs || b.correct - a.correct; });
      var keep = Math.max(2, Math.ceil(A.length / 2)), outIds = [];
      sorted.slice(keep).forEach(function (p) { p.out = H.round; outIds.push(p.id); });
      H.phase = "roundEnd";
      var m2 = { type: "roundEnd", round: H.round, players: pubPlayers(), out: outIds, left: keep, final: keep <= 2 };
      H.api.broadcast(m2); hostRender(m2);
    }
    function ranking() {
      var ps = plist().slice();
      if (H.cfg.format === "olimpiya") {
        ps.sort(function (a, b) {
          var ra = a.out || 999, rb = b.out || 999; if (ra !== rb) return rb - ra;
          var la = a.hist[(a.out || H.round) - 1] || 0, lb = b.hist[(b.out || H.round) - 1] || 0;
          return lb - la || b.total - a.total;
        });
      } else ps.sort(function (a, b) { return b.total - a.total || b.correct - a.correct; });
      return ps.map(function (p, i) { return { id: p.id, name: p.name, group: p.group, team: p.team, total: p.total, correct: p.correct, answered: p.answered, place: i + 1, out: p.out }; });
    }
    function endGame() {
      clearTimeout(H.timer); H.phase = "end";
      var rk = ranking(), ts = teamScores(), win = -1;
      if (H.cfg.teams > 0) { var best = ts.slice().sort(function (a, b) { return b.score - a.score; }); win = best.length > 1 && best[0].score === best[1].score ? -2 : best[0].t; }
      var msg = { type: "end", ranking: rk, teams: ts, win: win, cfg: H.cfg };
      H.api.broadcast(msg);
      if (CH) {
        try { var h = getHof(); h.unshift({ game: H.cfg.game, date: new Date().toLocaleDateString("uz-UZ"), p: rk.slice(0, 3).map(function (r) { return r.name; }), n: rk.length, f: H.cfg.format }); localStorage.setItem(HOF, JSON.stringify(h.slice(0, 50))); } catch (e) {}
      }
      if (H.cfg.hostPlays) clientEnd(msg, "HOST"); else hostRender(msg);
    }
    function backToLobby() {
      clearTimeout(H.timer); H.phase = "lobby"; H.round = 0;
      plist().filter(function (p) { return !p.online; }).forEach(function (p) { delete H.players[p.id]; });
      H.order = H.order.filter(function (id) { return H.players[id]; });
      plist().forEach(function (p) { p.total = 0; p.out = 0; p.rs = 0; p.correct = 0; p.answered = 0; });
      syncLobby(); hostRender();
    }

    // Host ekrani (lobby + tashkilotchi ko'rinishi)
    function hostRender(msg) {
      if (!H || !H.api) return;
      if (H.phase === "lobby") return renderLobby(lobbyMsg(), true);
      if (H.cfg.hostPlays && (H.phase === "q" || H.phase === "reveal")) return; // host o'yinchi ekranida
      if (H.phase === "q") {
        var q = H.qs[H.qi], ans = active().filter(function (p) { return p.ans !== null; }).length, tot = active().filter(function (p) { return p.online; }).length;
        root.innerHTML = '<div class="card">' + qHeader(H.round, H.qi, H.qs.length, H.cfg) + '<div class="tbar"><i id="kmT"></i></div><div class="q">' + esc(q.q) + "</div>" + optsHtml(q.opts, null, -1, true) +
          '<div class="big">✋ Javob berdi: ' + ans + " / " + tot + "</div></div>" + standingsCard(pubPlayers(), null);
        runTimer(H.cfg.dur);
        return;
      }
      if (H.phase === "reveal" && msg) {
        var q2 = H.qs[H.qi];
        root.innerHTML = '<div class="card">' + qHeader(H.round, H.qi, H.qs.length, H.cfg) + '<div class="q">' + esc(q2.q) + "</div>" + optsHtml(q2.opts, msg.a, -1, true) + "</div>" + teamsCard(msg.teams) + standingsCard(msg.players, null, msg.pts);
        return;
      }
      if (H.phase === "roundEnd" && msg) {
        root.innerHTML = roundEndHtml(msg, null) + '<div class="actions"><button class="main" id="kmNext">▶ ' + (H.cfg.format === "olimpiya" && msg.final ? "Finalni boshlash" : "Keyingi raund") + '</button><button id="kmStop">■ Turnirni yakunlash</button></div>';
        root.querySelector("#kmNext").onclick = startRound;
        root.querySelector("#kmStop").onclick = endGame;
        return;
      }
      if (H.phase === "end" && msg) { root.innerHTML = endHtml(msg, null); hostEndButtons(); }
    }
    function hostEndButtons() {
      var a = el('<div class="actions"><button class="main" id="kmAgain">🔁 Shu xonada yana o\'ynash</button><button id="kmHome">🏠 Bosh sahifa</button></div>');
      root.appendChild(a);
      root.querySelector("#kmAgain").onclick = backToLobby;
      root.querySelector("#kmHome").onclick = function () { H.api.close(); H = null; window.removeEventListener("beforeunload", warnLeave); home(); };
    }

    /* ===================== MIJOZ (qo'shiluvchi) ===================== */
    var C = null; // {conn, id, lastQ, myAns}
    function joinRoom() {
      var m = readMe(); if (!m) return;
      var code = N.normCode(root.querySelector("#kmCode").value);
      if (code.length !== 5) { root.querySelector("#kmErr").textContent = "Kod 5 ta belgidan iborat."; return; }
      busy(true, "⏳ Ulanmoqda…");
      C = { id: null, conn: null, code: code, lastQ: null, myAns: null, ended: false };
      N.join(code, { name: m.name, group: m.group }, {
        onMsg: onClientMsg,
        onClose: function () { if (C && !C.ended) { C = null; home("❌ Xona yopildi yoki internet uzildi."); } }
      }).then(function (api) { C.conn = api; C.id = api.id; }).catch(function (e) { C = null; home(e.message); });
    }
    function onClientMsg(msg) {
      if (!C) return;
      if (!C.id && C.conn) C.id = C.conn.id;
      var myId = C.conn ? C.conn.id : null;
      if (msg.type === "lobby") { C.cfg = msg.cfg; renderLobby(msg, false, myId); }
      else if (msg.type === "q") clientShowQ(msg, myId);
      else if (msg.type === "reveal") clientReveal(msg, myId);
      else if (msg.type === "roundEnd") { root.innerHTML = roundEndHtml(msg, myId) + '<p class="dim" style="text-align:center">Tashkilotchi keyingi raundni boshlashini kuting…</p>'; }
      else if (msg.type === "round") { /* keyingi savol keladi */ }
      else if (msg.type === "end") { C.ended = true; clientEnd(msg, myId); }
      else if (msg.type === "kick") { C.ended = true; var c = C; C = null; try { c.conn.close(); } catch (e) {} home("Xona egasi sizni xonadan chiqardi."); }
    }
    function sendAns(i, c) {
      if (H && H.cfg.hostPlays) onAns("HOST", i, c);
      else if (C && C.conn) C.conn.send({ type: "ans", i: i, c: c });
    }

    /* ===================== UMUMIY EKRANLAR ===================== */
    var tmr = 0;
    function runTimer(dur) {
      clearInterval(tmr); var t0 = Date.now(), bar = root.querySelector("#kmT"), lbl = root.querySelector("#kmSec");
      tmr = setInterval(function () {
        var left = Math.max(0, dur - (Date.now() - t0) / 1000);
        if (bar) bar.style.width = (left / dur * 100) + "%"; if (lbl) lbl.textContent = Math.ceil(left) + " s";
        if (left <= 0) clearInterval(tmr);
      }, 100);
    }
    function qHeader(round, i, n, cfg) {
      var g = N.GAMES[cfg.game] || {};
      return '<div class="hdr"><span>' + (g.icon || "") + " " + esc(g.name || "") + (cfg.format !== "jamoa" ? " · " + round + "-raund" : "") + "</span><span>Savol " + (i + 1) + "/" + n + ' · <b id="kmSec"></b></span></div>';
    }
    function optsHtml(opts, right, picked, ro) {
      return '<div class="opts">' + opts.map(function (o, k) {
        var cls = "opt"; if (right != null) cls += k === right ? " right" : " dimmed"; else if (picked === k) cls += " pick"; else if (picked >= 0) cls += " dimmed";
        return '<button class="' + cls + '" data-k="' + k + '" style="background:' + OPT[k].c + '"' + (ro ? " disabled" : "") + "><b>" + OPT[k].s + "</b>" + esc(o) + "</button>";
      }).join("") + "</div>";
    }
    function renderLobby(msg, isHost, myId) {
      var cfg = msg.cfg, g = N.GAMES[cfg.game] || {}, pl = msg.players, link = N.joinUrl(CH ? "chempionat.html" : "jamoa.html", msg.code);
      var head = '<div class="card" style="text-align:center"><div class="dim">' + (CH ? "Turnir kodi" : "Xona kodi") + '</div><div class="code">' + esc(msg.code) + "</div>" +
        '<div class="dim">' + (g.icon || "") + " " + esc(g.name || "") + " · " + (cfg.format === "olimpiya" ? "Olimpiya tizimi" : cfg.format === "liga" ? "Liga, " + cfg.rounds + " raund" : (cfg.teams ? cfg.teams + " jamoa" : "har kim o'zi uchun")) + " · " + cfg.nq + " savol · " + cfg.dur + " s</div>" +
        (isHost ? '<div class="share" style="margin-top:10px"><input readonly value="' + esc(link) + '" id="kmLink"><button id="kmCopy">📋</button></div>' : "") + "</div>";
      var body;
      if (cfg.teams > 0) {
        body = '<div class="teams">' + TEAMS.slice(0, cfg.teams).map(function (t, ti) {
          var ms = pl.filter(function (p) { return p.team === ti; });
          return '<div class="team" style="border-color:' + t.color + '"><h4 style="color:' + t.color + '">' + t.name + " (" + ms.length + ")</h4>" + ms.map(function (p) { return plHtml(p, isHost, myId, cfg); }).join("") + "</div>";
        }).join("") + "</div>";
      } else body = '<div class="teams"><div class="team">' + pl.map(function (p) { return plHtml(p, isHost, myId, cfg); }).join("") + "</div></div>";
      root.innerHTML = head + '<div class="card"><h3>👥 O\'yinchilar: ' + pl.length + " / " + cfg.max + "</h3>" + (pl.length ? body : '<p class="dim">Hali hech kim yo\'q. Kodni ayting yoki havolani yuboring.</p>') +
        (isHost ? '<div class="actions"><button class="main" id="kmStart"' + (pl.length < 2 ? " disabled" : "") + ">▶ " + (CH ? "Turnirni boshlash" : "O'yinni boshlash") + '</button><button id="kmClose">✕ Xonani yopish</button></div>' + (pl.length < 2 ? '<p class="dim">Kamida 2 o\'yinchi kerak.</p>' : "") + (cfg.teams > 0 ? '<p class="dim">“⇄” tugmasi o\'yinchini boshqa jamoaga o\'tkazadi.</p>' : "")
          : '<p class="dim">✅ Siz xonadasiz. Xona egasi o\'yinni boshlashini kuting…</p>') + "</div>";
      if (isHost) {
        root.querySelector("#kmStart").onclick = startGame;
        root.querySelector("#kmClose").onclick = function () { H.api.broadcast({ type: "kick", why: "closed" }); setTimeout(function () { H.api.close(); H = null; window.removeEventListener("beforeunload", warnLeave); home(); }, 300); };
        root.querySelector("#kmCopy").onclick = function () { var i = root.querySelector("#kmLink"); i.select(); try { navigator.clipboard.writeText(i.value); } catch (e) { document.execCommand("copy"); } this.textContent = "✅"; };
        root.querySelectorAll("[data-kick]").forEach(function (b) { b.onclick = function () { var id = b.dataset.kick; H.api.kick(id); delete H.players[id]; H.order = H.order.filter(function (x) { return x !== id; }); syncLobby(); hostRender(); }; });
        root.querySelectorAll("[data-mv]").forEach(function (b) { b.onclick = function () { var p = H.players[b.dataset.mv]; p.team = (p.team + 1) % H.cfg.teams; syncLobby(); hostRender(); }; });
      }
    }
    function plHtml(p, isHost, myId, cfg) {
      var isMe = p.id === myId || (isHost && p.id === "HOST");
      return '<div class="pl' + (isMe ? " me" : "") + '"><span>' + esc(p.name) + (p.id === "HOST" ? " 👑" : "") + "</span><span>" +
        (isHost && cfg.teams > 0 ? '<button class="mv" data-mv="' + esc(p.id) + '">⇄</button>' : "") +
        (isHost && p.id !== "HOST" ? '<button class="x" data-kick="' + esc(p.id) + '" title="Chiqarish">✕</button>' : "") + "</span></div>";
    }
    function clientShowQ(msg, myId) {
      var mine = null;
      if (H && myId === "HOST") mine = H.players.HOST;
      var amOut = C && C.out;
      if (H && myId === "HOST" && H.players.HOST.out) amOut = true;
      C && (C.myAns = null);
      var picked = -1;
      root.innerHTML = '<div class="card">' + qHeader(msg.round, msg.i, msg.n, (C && C.cfg) || (H && H.cfg)) + '<div class="tbar"><i id="kmT"></i></div><div class="q">' + esc(msg.q) + "</div>" +
        optsHtml(msg.opts, null, -1, amOut) + '<div class="big" id="kmSt">' + (amOut ? "👀 Siz kuzatuvchisiz" : "") + "</div></div>";
      runTimer(msg.dur);
      if (amOut) return;
      var t0 = Date.now();
      root.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () {
          if (picked >= 0 || Date.now() - t0 > msg.dur * 1000) return;
          picked = +b.dataset.k; sendAns(msg.i, picked);
          root.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("pick", x === b); x.classList.toggle("dimmed", x !== b); x.disabled = true; });
          root.querySelector("#kmSt").textContent = "✅ Javob qabul qilindi — natijani kuting";
          if (navigator.vibrate) navigator.vibrate(30);
        };
      });
    }
    function clientReveal(msg, myId) {
      clearInterval(tmr);
      var cfg = (C && C.cfg) || (H && H.cfg), my = msg.pts[myId];
      var q = root.querySelector(".q") ? root.querySelector(".q").textContent : "";
      var opts = Array.prototype.map.call(root.querySelectorAll(".opt"), function (b) { return b.textContent.slice(1); });
      var res = !my ? '<div class="big">👀 Kuzatuvchi</div>' : my.p > 0 ? '<div class="pts good">✅ +' + my.p + "</div>" : '<div class="pts no">' + (my.c === null ? "⏰ Ulgurmadingiz" : "❌ Noto'g'ri") + "</div>";
      root.innerHTML = '<div class="card"><div class="q">' + esc(q) + "</div>" + optsHtml(opts, msg.a, my ? my.c : -1, true) + res + "</div>" + teamsCard(msg.teams, cfg) + standingsCard(msg.players, myId, msg.pts);
    }
    function clientEnd(msg, myId) {
      clearInterval(tmr);
      root.innerHTML = endHtml(msg, myId);
      var mine = msg.ranking.filter(function (r) { return r.id === myId; })[0];
      if (mine) {
        var g = N.GAMES[msg.cfg.game] || {}, lbl = (CH ? "Chempionat" : "Jamoaviy") + ": " + (g.name || msg.cfg.game);
        var title = lbl + " — " + mine.place + "-o'rin / " + msg.ranking.length + " (ball " + mine.total + (mine.team >= 0 && msg.cfg.teams ? ", " + TEAMS[mine.team].name : "") + ")";
        var coins = addCoins(mine.correct, mine.answered, lbl);
        N.postResult({ name: me.name, group: me.group, topic: title, correct: mine.correct, total: mine.answered, date: new Date().toLocaleString("uz-UZ") });
        root.appendChild(el('<p class="dim" style="text-align:center">📨 Natijangiz o\'qituvchining Google jadvaliga yuborildi' + (coins ? " · 🪙 +" + coins + " tanga" : "") + ".</p>"));
      }
      if (H && myId === "HOST") hostEndButtons();
      else root.appendChild(el('<div class="actions" style="justify-content:center"><span class="dim" style="align-self:center">⏳ Xona egasi yana boshlasa — shu yerda qoling</span><button id="kmLeave">🚪 Chiqish</button></div>')), root.querySelector("#kmLeave").onclick = function () { var c = C; C = null; try { c.conn.close(); } catch (e) {} home(); };
    }
    function teamsCard(ts, cfg) {
      if (!ts || !ts.length) return "";
      if (ts.length === 2) {
        var a = ts[0].score, b = ts[1].score, pos = 50 - Math.max(-42, Math.min(42, (a - b) / Math.max(a + b, 1) * 60));
        return '<div class="card"><div class="tscores"><span style="color:' + TEAMS[0].color + '">' + TEAMS[0].name + ": " + a + '</span><span style="color:' + TEAMS[1].color + '">' + TEAMS[1].name + ": " + b + "</span></div>" +
          '<div class="rope" style="--t0:' + TEAMS[0].color + "33;--t1:" + TEAMS[1].color + '33"><div class="line"></div><div class="mid"></div><div class="knot" style="left:' + pos + '%">🪢</div></div><p class="dim" style="text-align:center;margin:4px 0 0">Jamoa bali = a\'zolar balining o\'rtachasi</p></div>';
      }
      var mx = Math.max.apply(null, ts.map(function (t) { return t.score; }).concat([1]));
      return '<div class="card bars">' + ts.map(function (t) { return '<div class="b"><span style="width:90px;color:' + TEAMS[t.t].color + ';font-weight:700">' + TEAMS[t.t].name + '</span><i style="width:' + (t.score / mx * 60) + "%;background:" + TEAMS[t.t].color + '"></i><b>' + t.score + "</b></div>"; }).join("") + "</div>";
    }
    function standingsCard(players, myId, pts) {
      var ps = players.slice().sort(function (a, b) { return (a.out ? 1 : 0) - (b.out ? 1 : 0) || b.total - a.total; });
      var cfg = (C && C.cfg) || (H && H.cfg) || {};
      var showRound = cfg.format === "olimpiya";
      var top = ps.slice(0, 10); var mi = ps.findIndex(function (p) { return p.id === myId; });
      if (mi >= 10) top.push(ps[mi]);
      return '<div class="card"><h3>📊 Reyting</h3><table><thead><tr><th>#</th><th>Ism</th>' + (showRound ? "<th>Raund</th>" : "") + "<th>Ball</th><th></th></tr></thead><tbody>" + top.map(function (p) {
        var d = pts && pts[p.id] ? pts[p.id].p : null;
        return '<tr class="' + (p.id === myId ? "me" : "") + (p.out ? " out" : "") + '"><td>' + (ps.indexOf(p) + 1) + "</td><td>" + teamDot(p.team) + esc(p.name) + (p.online === false ? " 📴" : "") + (p.out ? ' <span class="tag">chiqdi</span>' : "") + "</td>" + (showRound ? "<td>" + p.rs + "</td>" : "") + "<td><b>" + p.total + "</b></td><td>" + (d ? '<span style="color:#5ee6a0">+' + d + "</span>" : "") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    }
    function roundEndHtml(msg, myId) {
      var ps = msg.players.slice().filter(function (p) { return !p.out || p.out === msg.round; }).sort(function (a, b) { return (msg.out.indexOf(a.id) >= 0) - (msg.out.indexOf(b.id) >= 0) || b.rs - a.rs; });
      var amOut = msg.out.indexOf(myId) >= 0; if (amOut && C) C.out = true;
      var title = msg.out.length ? (msg.final ? "🔥 Finalga " + msg.left + " kishi chiqdi!" : "➡️ Keyingi raundga " + msg.left + " kishi o'tdi") : "📋 " + msg.round + "-raund yakunlandi" + (msg.of ? " (" + msg.round + "/" + msg.of + ")" : "");
      return '<div class="card"><h2>' + title + "</h2>" + (myId ? (amOut ? '<p class="big">😔 Siz bu raundda chiqib ketdingiz — kuzatib turing!</p>' : msg.out.length ? '<p class="big">🎉 Siz keyingi bosqichdasiz!</p>' : "") : "") +
        '<table><thead><tr><th>#</th><th>Ism</th><th>Raund bali</th><th>Jami</th><th></th></tr></thead><tbody>' + ps.map(function (p, i) {
          var o = msg.out.indexOf(p.id) >= 0;
          return '<tr class="' + (p.id === myId ? "me" : "") + (o ? " out" : "") + '"><td>' + (i + 1) + "</td><td>" + esc(p.name) + "</td><td>" + p.rs + "</td><td><b>" + p.total + "</b></td><td>" + (o ? "❌" : msg.out.length ? "✅" : "") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    function endHtml(msg, myId) {
      var rk = msg.ranking, cfg = msg.cfg, g = N.GAMES[cfg.game] || {};
      var banner = "";
      if (cfg.teams > 0) banner = msg.win === -2 ? '<h2 style="text-align:center">🤝 Durang!</h2>' : '<h2 style="text-align:center;color:' + TEAMS[msg.win].color + '">🏆 ' + TEAMS[msg.win].name + " jamoasi g'olib!</h2>";
      else banner = '<h2 style="text-align:center">🏆 ' + (CH ? (g.name || "") + " chempioni" : "G'olib") + ": " + esc(rk[0] ? rk[0].name : "—") + "</h2>";
      var pod = [rk[1], rk[0], rk[2]], hs = [90, 130, 70], cols = ["#c0c7d4", "#f4c430", "#d98c4a"], md = ["🥈", "🥇", "🥉"];
      var podium = '<div class="podium">' + pod.map(function (r, i) { return r ? '<div class="pod"><div class="nm">' + md[i] + " " + esc(r.name) + '<br><span class="dim">' + r.total + ' ball</span></div><div class="blk" style="height:' + hs[i] + "px;background:" + cols[i] + '">' + r.place + "</div></div>" : '<div class="pod"></div>'; }).join("") + "</div>";
      var mine = rk.filter(function (r) { return r.id === myId; })[0];
      return '<div class="card">' + banner + (cfg.teams > 0 ? teamsCard(msg.teams, cfg).replace('<div class="card">', '<div>').replace('<div class="card bars">', '<div class="bars">') : "") + podium +
        (mine ? '<p class="big">Sizning o\'rningiz: ' + mine.place + " / " + rk.length + " · " + mine.total + " ball · " + mine.correct + "/" + mine.answered + " to'g'ri</p>" : "") + "</div>" +
        '<div class="card"><h3>📋 To\'liq natijalar</h3><table><thead><tr><th>O\'rin</th><th>Ism</th><th>Ball</th><th>To\'g\'ri</th></tr></thead><tbody>' + rk.map(function (r) {
          return '<tr class="' + (r.id === myId ? "me" : "") + '"><td>' + r.place + "</td><td>" + teamDot(r.team) + esc(r.name) + (r.group ? ' <span class="dim">' + esc(r.group) + "</span>" : "") + "</td><td><b>" + r.total + "</b></td><td>" + r.correct + "/" + r.answered + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    home();
  }

  window.KAMusobaqa = { mount: mount };
})();
