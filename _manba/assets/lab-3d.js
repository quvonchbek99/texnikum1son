/* Toshkent tuman 1-son texnikumi e-bazasi — «Zamonaviy texnika · 3D» bo'limi.
   Lab JSON'dagi `zamonaviy[]` (manba: _manba/lab-zamonaviy.json) bo'yicha jihozning 3D modeli, tuzilishi va ish joyidagi ko'rinishi.
   three.js sayt ichidan (assets/three.module.min.js) faqat bo'lim ochilganda yuklanadi. */
(function () {
  "use strict";
  var pj = document.getElementById("lab-json"), p = document.querySelector('#lab [data-p="zamon"]');
  if (!pj || !p) return;
  var Z; try { Z = JSON.parse(pj.textContent).zamonaviy; } catch (e) { return; }
  if (!Z || !Z.length) return;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var src = (document.currentScript && document.currentScript.src) || "", base = src.replace(/lab-3d\.js.*$/, "");

  var css = ".z3{margin-top:22px}.z3-l{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}" +
    ".z3-st{position:relative;border-radius:18px;overflow:hidden;background:radial-gradient(120% 90% at 50% 20%,#fffaf3 0%,#efe2d2 60%,#d9c3aa 100%);border:1px solid rgba(90,50,20,.15);height:min(68vh,560px);min-height:340px}" +
    ".z3-st.ish{background:linear-gradient(#cfe3f2 0%,#eef3f6 55%,#d8d2c8 56%,#c9c1b4 100%)}.z3-st canvas{width:100%;height:100%;display:block;touch-action:none;cursor:grab}" +
    ".z3-bar{position:absolute;left:10px;right:10px;bottom:10px;display:flex;gap:6px;flex-wrap:wrap;pointer-events:none}.z3-bar button{pointer-events:auto;border:0;border-radius:999px;padding:9px 14px;font:600 13px inherit;background:rgba(40,22,12,.82);color:#fff;cursor:pointer}" +
    ".z3-bar button.on{background:#e8742a}.z3-tag{position:absolute;transform:translate(-50%,-135%);background:#2a160b;color:#fff;font:600 11.5px/1 inherit;padding:5px 9px;border-radius:999px;white-space:nowrap;pointer-events:none}" +
    ".z3-tag:after{content:'';position:absolute;left:50%;top:100%;width:2px;height:12px;background:#2a160b;margin-left:-1px}.z3-yuk{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:600;color:#6b4a33;text-align:center;padding:20px}" +
    ".z3-i{margin-top:14px}.z3-i h3{margin:0 0 2px}.z3-i .meta{display:block;margin-bottom:10px}.z3-g{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}.z3-i h4{margin:0 0 6px}.z3-i ul{margin:0;padding-left:18px}.z3-i p{margin:0}.z3-m{margin-top:12px;font-size:13px;opacity:.8}" +
    "@media print{.z3-st,.z3-l{display:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  p.innerHTML = '<div class="z3">' + (Z.length > 1 ? '<div class="z3-l">' + Z.map(function (z, i) { return '<button type="button" class="chip" data-z="' + i + '">' + esc(z.nomi) + "</button>"; }).join("") + "</div>" : "") +
    '<div class="z3-st"><canvas></canvas><div class="z3-tags"></div><div class="z3-yuk">3D model yuklanmoqda…</div>' +
    '<div class="z3-bar"><button type="button" data-a="tuz">Tuzilishi</button><button type="button" data-a="ish">▶ Ish joyida ko‘rsatish</button><button type="button" data-a="ayl" class="on">Aylanish</button><button type="button" data-a="toliq">⛶ To‘liq ekran</button></div></div>' +
    '<div class="z3-i card"></div></div>';
  var stage = p.querySelector(".z3-st"), canvas = p.querySelector("canvas"), tagsBox = p.querySelector(".z3-tags"), yuk = p.querySelector(".z3-yuk"), info = p.querySelector(".z3-i");
  var cur = 0, S = { tuz: false, ish: false, ayl: true }, eng = null;

  function infoHTML(z) {
    info.innerHTML = "<h3>" + esc(z.nomi) + '</h3><span class="meta">' + esc(z.tur) + " · " + esc(z.ishlab) + " · " + esc(z.yil) + '</span><div class="z3-g"><div><h4>Nimasi yangi</h4><ul>' +
      z.nima.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div><div><h4>Qayerda ishlaydi</h4><p>" + esc(z.qayerda) + "</p></div></div>" +
      '<p class="z3-m">Manba (' + esc(z.manba_turi || "manba") + '): <a href="' + esc(z.manba) + '" target="_blank" rel="noopener">' + esc(z.manba.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]) + "</a>. 3D model soddalashtirilgan o‘quv maketi — o‘lchamlari taxminiy, ishlab chiqaruvchining rasmiy chizmasi emas.</p>";
    [].forEach.call(p.querySelectorAll("[data-z]"), function (b) { b.classList.toggle("on", +b.getAttribute("data-z") === cur); });
  }
  infoHTML(Z[0]);
  p.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null; if (!b) return;
    if (b.hasAttribute("data-z")) { cur = +b.getAttribute("data-z"); infoHTML(Z[cur]); if (eng) eng.show(Z[cur]); return; }
    var a = b.getAttribute("data-a"); if (!a) return;
    if (a === "toliq") { try { (document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen()); } catch (x) {} return; }
    S[a] = !S[a]; b.classList.toggle("on", S[a]); if (a === "ish" && eng) eng.burchak();
    if (a === "ish") { stage.classList.toggle("ish", S.ish); b.textContent = S.ish ? "■ Faqat jihoz" : "▶ Ish joyida ko‘rsatish"; }
    if (eng) eng.sync();
  });

  var boshlandi = false;
  function boshla() {
    if (boshlandi) return; boshlandi = true;
    import(base + "three.module.min.js").then(function (T) { eng = dvigatel(T); eng.show(Z[cur]); yuk.remove(); })
      .catch(function () { yuk.textContent = "3D ko‘rinish bu brauzerda ochilmadi. Chrome yoki Edge’ning yangi versiyasida sinab ko‘ring."; });
  }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en, ob) { if (en[0].isIntersecting) { ob.disconnect(); boshla(); } }).observe(stage); else boshla();

  /* ===================================================================== */
  function dvigatel(T) {
    var R = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
    R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = T.SRGBColorSpace;
    var scene = new T.Scene(), cam = new T.PerspectiveCamera(38, 1, 0.02, 200);
    // muhit yoritilishi: yorug' panellari bor studiya (addonlarsiz)
    (function () {
      var es = new T.Scene(), g = new T.BoxGeometry(1, 1, 1);
      var room = new T.Mesh(g, new T.MeshBasicMaterial({ color: 0x777b82, side: T.BackSide })); room.scale.set(20, 12, 20); es.add(room);
      [[0, 5.9, 0, 9, .1, 9, 9], [-9.9, 2, 0, .1, 5, 8, 5], [9.9, 1, 3, .1, 4, 5, 3], [0, 1, 9.9, 8, 5, .1, 2.5], [0, -5.9, 0, 20, .1, 20, .5]].forEach(function (a) {
        var m = new T.Mesh(g, new T.MeshBasicMaterial({ color: new T.Color(1, .97, .92).multiplyScalar(a[6]) })); m.position.set(a[0], a[1], a[2]); m.scale.set(a[3], a[4], a[5]); es.add(m);
      });
      var pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(es, 0.03).texture; pm.dispose();
    })();
    var sun = new T.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.radius = 4; scene.add(sun, sun.target);
    var floor = new T.Mesh(new T.PlaneGeometry(200, 200), new T.ShadowMaterial({ opacity: 0.28 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

    /* --- yordamchilar --- */
    function mat(c, m, r, o) { var x = new T.MeshStandardMaterial({ color: c, metalness: m == null ? 0 : m, roughness: r == null ? 0.6 : r }); if (o) for (var k in o) { if (k === "emissive") x.emissive.setHex(o[k]); else x[k] = o[k]; } return x; }
    var M = {
      qora: mat(0x1c1d20, .2, .55), kul: mat(0x8d9299, .3, .5), oq: mat(0xf2f1ee, 0, .45), polat: mat(0xd5d9de, 1, .22), temir: mat(0x3a3d42, .8, .45),
      qizil: mat(0xc8201c, .3, .35), sariq: mat(0xf0a020, .2, .45), kok: mat(0x2463c9, .2, .45), rezina: mat(0x141414, 0, .9), yogoch: mat(0xb98a5c, 0, .6),
      oltin: mat(0xf2c35a, 1, .25), mis: mat(0xc9783f, 1, .3), beton: mat(0xa9a59d, 0, .9), mato: mat(0x3d6f9a, 0, .95), teri: mat(0xe2b48f, 0, .7),
      shisha: new T.MeshPhysicalMaterial({ color: 0xcfe6f2, roughness: .05, metalness: 0, transparent: true, opacity: .28 }),
      qoraShisha: new T.MeshPhysicalMaterial({ color: 0x0b0d10, roughness: .08, metalness: .4, transparent: true, opacity: .82 })
    };
    function tex(w, h, f, rx, ry) { var cv = document.createElement("canvas"); cv.width = w; cv.height = h; f(cv.getContext("2d"), w, h); var t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); t.anisotropy = 8; return t; }
    function polat(rang) { // silliqlangan (brushed) zanglamas po'lat
      var t = tex(256, 256, function (q, w, h) { q.fillStyle = "#c4c8cc"; q.fillRect(0, 0, w, h); for (var i = 0; i < 2200; i++) { var v = 175 + Math.random() * 60 | 0; q.strokeStyle = "rgba(" + v + "," + v + "," + (v + 3) + ",.16)"; q.lineWidth = .6 + Math.random(); var y = Math.random() * h, x = Math.random() * w, l = 30 + Math.random() * 180; q.beginPath(); q.moveTo(x, y); q.lineTo(x + l, y); q.stroke(); } }, 2, 2);
      var r2 = t.clone(); r2.colorSpace = T.NoColorSpace; r2.needsUpdate = true;
      return new T.MeshStandardMaterial({ color: rang || 0xe4e7ea, map: t, roughnessMap: r2, roughness: .5, metalness: 1 });
    }
    function kafel(asos, chok, n, rx, ry) { return new T.MeshStandardMaterial({ roughness: .35, map: tex(256, 256, function (q, w, h) { q.fillStyle = chok; q.fillRect(0, 0, w, h); var k = w / n; for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) { var v = (Math.random() * 10 | 0) - 5; q.fillStyle = asos; q.fillRect(i * k + 2, j * k + 2, k - 4, k - 4); q.fillStyle = "rgba(" + (v > 0 ? "255,255,255" : "0,0,0") + "," + Math.abs(v) / 100 + ")"; q.fillRect(i * k + 2, j * k + 2, k - 4, k - 4); } }, rx, ry) }); }
    function add(g, m, x, y, z, par) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; (par || scene).add(o); return o; }
    function box(w, h, d, m, x, y, z, par, r) {
      var g;
      if (r) { var s = new T.Shape(), a = w / 2 - r, b = h / 2 - r; s.absarc(a, b, r, 0, Math.PI / 2); s.absarc(-a, b, r, Math.PI / 2, Math.PI); s.absarc(-a, -b, r, Math.PI, Math.PI * 1.5); s.absarc(a, -b, r, Math.PI * 1.5, Math.PI * 2);
        var bv = Math.min(r * .5, d * .2); g = new T.ExtrudeGeometry(s, { depth: d - 2 * bv, bevelEnabled: true, bevelThickness: bv, bevelSize: bv, bevelSegments: 3, curveSegments: 8 }); g.translate(0, 0, -(d - 2 * bv) / 2); }
      else g = new T.BoxGeometry(w, h, d);
      return add(g, m, x, y, z, par);
    }
    function cyl(r, h, m, x, y, z, par, ax, r2) { var o = add(new T.CylinderGeometry(r2 == null ? r : r2, r, h, 36), m, x, y, z, par); if (ax === "x") o.rotation.z = Math.PI / 2; if (ax === "z") o.rotation.x = Math.PI / 2; return o; }
    function sph(r, m, x, y, z, par) { return add(new T.SphereGeometry(r, 40, 28), m, x, y, z, par); }
    function tube(pts, r, m, par) { var c = new T.CatmullRomCurve3(pts.map(function (q) { return new T.Vector3(q[0], q[1], q[2]); })); return add(new T.TubeGeometry(c, 48, r, 10), m, 0, 0, 0, par); }
    function ekran(w, h, chiz, x, y, z, par) {
      var cv = document.createElement("canvas"); cv.width = 512; cv.height = Math.round(512 * h / w); var g = cv.getContext("2d"); g.fillStyle = "#0b1220"; g.fillRect(0, 0, cv.width, cv.height); chiz(g, cv.width, cv.height);
      var t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
      var o = add(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .9, roughness: .3 }), x, y, z, par); o.castShadow = false; o.userData = { cv: cv, g: g, t: t }; return o;
    }
    function matn(g, s, x, y, px, c) { g.fillStyle = c || "#e7f0ff"; g.font = "600 " + px + "px sans-serif"; g.fillText(s, x, y); }
    function zarra(n, color, size, par) {
      var geo = new T.BufferGeometry(), pos = new Float32Array(n * 3); geo.setAttribute("position", new T.BufferAttribute(pos, 3));
      if (!zarra.t) { var zc = document.createElement("canvas"); zc.width = zc.height = 64; var zg = zc.getContext("2d"), zr = zg.createRadialGradient(32, 32, 0, 32, 32, 32); zr.addColorStop(0, "rgba(255,255,255,1)"); zr.addColorStop(.4, "rgba(255,255,255,.45)"); zr.addColorStop(1, "rgba(255,255,255,0)"); zg.fillStyle = zr; zg.fillRect(0, 0, 64, 64); zarra.t = new T.CanvasTexture(zc); }
      var o = new T.Points(geo, new T.PointsMaterial({ color: color, size: size * 2.2, map: zarra.t, transparent: true, opacity: .55, depthWrite: false })); o.frustumCulled = false; (par || scene).add(o);
      o.userData = { pos: pos, ph: Array.from({ length: n }, Math.random) }; return o;
    }
    function zOqim(o, t, f) { var P = o.userData.pos, ph = o.userData.ph; for (var i = 0; i < ph.length; i++) { var q = f((t * .6 + ph[i]) % 1, ph[i], i); P[i * 3] = q[0]; P[i * 3 + 1] = q[1]; P[i * 3 + 2] = q[2]; } o.geometry.attributes.position.needsUpdate = true; }
    function nur(c, i, d, x, y, z, par) { var l = new T.PointLight(c, i, d, 2); l.position.set(x, y, z); (par || scene).add(l); return l; }
    function odam(par, x, z, h) { var g = new T.Group(); g.position.set(x, 0, z); par.add(g); h = h || 1.7; add(new T.CapsuleGeometry(h * .1, h * .32, 6, 14), M.mato, 0, h * .6, 0, g); sph(h * .07, M.teri, 0, h * .93, 0, g); cyl(h * .045, h * .42, M.temir, -h * .05, h * .21, 0, g); cyl(h * .045, h * .42, M.temir, h * .05, h * .21, 0, g); return g; }
    function stol(par, w, d, h, x, z) { box(w, .04, d, M.yogoch, x, h - .02, z, par); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { box(.05, h - .04, .05, M.temir, x + s[0] * (w / 2 - .05), (h - .04) / 2, z + s[1] * (d / 2 - .05), par); }); }

    /* --- modellar: har biri (g — jihoz, c — ish joyi muhiti, L — yorliq) → {r, y, anim(t, ish)} --- */
    var B = {};
    B.skaner = function (g, c, L) {
      var tb = new T.Group(); tb.position.set(0, .93, 0); tb.rotation.x = -.5; g.add(tb); stol(g, .9, .55, .8, 0, 0);
      box(.36, .25, .035, M.qora, 0, .11, 0, tb, .02); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { box(.05, .05, .04, M.qizil, s[0] * .165, .11 + s[1] * .11, 0, tb, .012); });
      var e = ekran(.3, .19, function (q, w, h) { matn(q, "TOPOLOGY 3.0", 18, 34, 22, "#7fd0ff"); var N = [[256, 90], [110, 150], [256, 170], [400, 150], [70, 250], [180, 260], [330, 260], [440, 250]]; q.strokeStyle = "#3c6ea8"; q.lineWidth = 3;
        N.slice(1).forEach(function (n, i) { q.beginPath(); q.moveTo(N[i < 3 ? 0 : i - 2][0], N[i < 3 ? 0 : i - 2][1]); q.lineTo(n[0], n[1]); q.stroke(); });
        N.forEach(function (n, i) { q.fillStyle = i === 5 ? "#ff5a4a" : "#35d07f"; q.fillRect(n[0] - 34, n[1] - 15, 68, 30); matn(q, ["ECM", "ABS", "BCM", "TCM", "SRS", "BMS", "EPS", "HVAC"][i], n[0] - 22, n[1] + 7, 17, "#06101c"); }); }, 0, .11, .019, tb);
      box(.07, .03, .1, M.qora, 0, -.03, -.06, tb); // tayanch
      var vci = box(.09, .03, .06, mat(0xc8201c, .3, .35), .3, .82, .1, g, .008); box(.03, .025, .03, M.qora, .3, .82, .145, g);
      L("Sensorli ekran", 0, 1.06, .02); L("Zarbga chidamli korpus", -.17, .95, .1); L("Simsiz VCI adapter", .3, .86, .1);
      // ish joyi: avtomobil
      var car = new T.Group(); car.position.set(0, 0, -1.9); c.add(car);
      box(3.9, .55, 1.7, M.kok, 0, .62, 0, car, .12); box(2.1, .5, 1.5, M.qoraShisha, -.15, 1.13, 0, car, .16);
      [[-1.25, .82], [1.25, .82], [-1.25, -.82], [1.25, -.82]].forEach(function (s) { cyl(.33, .22, M.rezina, s[0], .33, s[1], car, "z"); cyl(.18, .23, M.polat, s[0], .33, s[1], car, "z"); });
      var far = [sph(.09, mat(0xffffff, 0, .2, { emissive: 0xfff2c0 }), 1.93, .7, .6, car), sph(.09, mat(0xffffff, 0, .2, { emissive: 0xfff2c0 }), 1.93, .7, -.6, car)];
      tube([[.3, .82, .16], [.5, .5, -.3], [.9, .45, -1.0], [1.1, .6, -1.5]], .008, M.rezina, c);
      return { r: 1.0, y: .95, rIsh: 5.2, yIsh: .8, thIsh: 1.0, anim: function (t, ish) { e.material.emissiveIntensity = .8 + .2 * Math.sin(t * 3); far.forEach(function (f) { f.material.emissiveIntensity = ish ? (Math.sin(t * 5) > 0 ? 3 : .2) : 0; }); vci.material.emissive.setHex(ish && Math.sin(t * 8) > 0 ? 0x551100 : 0); } };
    };
    B.payvand = function (g, c, L) {
      box(.32, .52, .68, M.qizil, 0, .42, 0, g, .03); box(.26, .2, .01, M.qora, 0, .52, .345, g);
      ekran(.14, .07, function (q) { matn(q, "WELD WIZARD", 20, 60, 44, "#7fd0ff"); matn(q, "185 A  22.4 V", 20, 150, 62, "#ffd36b"); }, -.04, .55, .352, g);
      cyl(.028, .02, M.polat, .09, .55, .355, g, "z"); cyl(.02, .03, M.mis, -.08, .3, .35, g, "z"); cyl(.02, .03, M.mis, .08, .3, .35, g, "z");
      [[-.13, .3], [.13, .3], [-.13, -.3], [.13, -.3]].forEach(function (s) { cyl(.07, .04, M.rezina, s[0], .07, s[1], g, "x"); });
      box(.3, .26, .5, M.temir, 0, .83, 0, g, .03); cyl(.11, .06, M.polat, 0, .84, .0, g, "x"); // sim uzatgich va g'altak
      cyl(.11, 1.25, M.kul, 0, .78, -.5, g); cyl(.035, .1, M.polat, 0, 1.45, -.5, g); // gaz balloni
      var uch = [.75, .86, .55]; tube([[0, .8, .26], [.2, .55, .5], [.5, .62, .6], [.7, .9, .58], uch], .014, M.rezina, g); cyl(.016, .16, M.polat, .78, .83, .53, g).rotation.set(.3, 0, .5);
      L("Boshqaruv paneli", -.04, .64, .36); L("Sim uzatgich", 0, 1.0, .1); L("Himoya gazi balloni", 0, 1.5, -.5); L("Gorelka", .78, .92, .53);
      stol(c, 1.0, .6, .78, 1.0, .5); box(.3, .012, .2, M.temir, .9, .786, .5, c); box(.3, .012, .2, M.temir, .9, .786, .7, c);
      var yoy = nur(0x9fd0ff, 0, 4, .82, .82, .6, c), uq = zarra(50, 0xffd27a, .018, c); sph(.012, mat(0xffffff, 0, .2, { emissive: 0xbfe0ff, emissiveIntensity: 4 }), .82, .795, .6, c);
      return { r: 1.5, y: .75, rIsh: 2.4, yIsh: .8, anim: function (t, ish) { yoy.intensity = ish ? 25 + 20 * Math.random() : 0; uq.visible = ish; if (ish) zOqim(uq, t * 2.5, function (k, ph, i) { var a = i * 2.4; return [.82 + Math.cos(a) * k * .25, .8 + k * .35 - k * k * .5, .6 + Math.sin(a) * k * .25]; }); } };
    };
    B.termokamera = function (g, c, L) {
      var k = new T.Group(); k.position.set(0, 1.25, 0); g.add(k);
      box(.1, .11, .2, M.sariq, 0, .1, 0, k, .02); box(.07, .2, .08, M.qora, 0, -.05, -.03, k, .02).rotation.x = .25; cyl(.04, .05, M.qora, 0, .1, .12, k, "z"); cyl(.03, .01, M.qoraShisha, 0, .1, .15, k, "z");
      var e = ekran(.085, .065, function (q, w, h) { var gr = q.createRadialGradient(w * .6, h * .45, 5, w * .6, h * .45, w * .5); gr.addColorStop(0, "#fff7b0"); gr.addColorStop(.2, "#ff5a1f"); gr.addColorStop(.55, "#8a1f9a"); gr.addColorStop(1, "#150a4a"); q.fillStyle = gr; q.fillRect(0, 0, w, h); matn(q, "87.4°C", w * .42, h * .2, 60, "#fff"); }, 0, .1, -.101, k); e.rotation.y = Math.PI;
      box(.03, .02, .03, M.qizil, 0, .0, .04, k);
      L("Infraqizil linza", 0, 1.35, .15); L("Rangli ekran", 0, 1.42, -.1); L("Tutqich va tetik", 0, 1.17, 0);
      var sh = new T.Group(); sh.position.set(0, 0, 1.5); c.add(sh); box(.8, 1.1, .2, M.kul, 0, 1.3, 0, sh, .02); box(.7, 1.0, .02, M.oq, 0, 1.3, -.1, sh);
      var hot; for (var i = 0; i < 8; i++) { var b = box(.07, .14, .06, i === 5 ? mat(0x333333, 0, .5, { emissive: 0xff3a10 }) : M.qora, -.26 + (i % 4) * .17, 1.5 - Math.floor(i / 4) * .35, -.13, sh); if (i === 5) hot = b; }
      odam(c, .25, -.45);
      return { r: .55, y: 1.3, rIsh: 3.2, yIsh: 1.2, thIsh: -1.0, anim: function (t, ish) { hot.material.emissiveIntensity = ish ? 1.2 + Math.sin(t * 4) * .6 : 0; e.material.emissiveIntensity = .9 + .1 * Math.sin(t * 6); } };
    };
    B.tikuv = function (g, c, L) {
      stol(g, 1.2, .55, .76, 0, 0); box(.5, .05, .18, M.oq, 0, .785, 0, g, .015); box(.12, .3, .16, M.oq, .19, .95, 0, g, .03); box(.5, .12, .15, M.oq, 0, 1.08, 0, g, .04); box(.1, .2, .14, M.oq, -.2, .98, 0, g, .03);
      cyl(.06, .03, M.polat, .27, 1.02, 0, g, "x"); var igna = cyl(.004, .12, M.polat, -.2, .86, 0, g); cyl(.012, .05, M.polat, -.2, .83, .0, g);
      ekran(.13, .08, function (q) { matn(q, "DX-01", 20, 70, 60, "#7fd0ff"); matn(q, "Ip: 42  Bosim: 3.0", 20, 150, 40, "#e7f0ff"); matn(q, "Surish: 1.15", 20, 220, 40, "#ffd36b"); }, .02, 1.08, .078, g);
      cyl(.03, .1, M.mato, .1, 1.2, -.05, g, null, .012); box(.2, .04, .25, M.temir, 0, .1, .05, g); // ip, pedal
      L("Raqamli boshqaruv paneli", .02, 1.16, .08); L("Igna va tepki", -.2, .9, .05); L("Maxovik", .3, 1.08, 0); L("Pedal", 0, .16, .1);
      var mt = box(.5, .004, .3, mat(0xd8c7ee, 0, .95), -.2, .812, .02, c); var odm = odam(c, 0, .55, 1.3);
      return { r: 1.25, y: .85, rIsh: 2.0, yIsh: .9, anim: function (t, ish) { igna.position.y = .86 + Math.sin(t * (ish ? 40 : 3)) * .018; mt.position.z = ish ? .02 - ((t * .06) % .12) : .02; } };
    };
    B.bichish = function (g, c, L) {
      box(2.6, .1, 1.5, M.kul, 0, .85, 0, g, .02); [[-1.2, -.65], [1.2, -.65], [-1.2, .65], [1.2, .65]].forEach(function (s) { box(.1, .8, .1, M.temir, s[0], .4, s[1], g); });
      box(2.5, .03, 1.4, mat(0xe9e2d0, 0, .95), 0, .915, 0, g); // mato to'shamasi
      var port = new T.Group(); g.add(port); box(.16, .14, 1.7, M.qizil, 0, 1.07, 0, port, .03); box(.12, .25, .1, M.temir, 0, .95, -.82, port); box(.12, .25, .1, M.temir, 0, .95, .82, port);
      var kal = box(.18, .22, .16, M.qora, .0, 1.02, 0, port, .02); cyl(.01, .1, M.polat, 0, -.14, 0, kal);
      box(.5, 1.1, .3, M.kul, 1.7, .55, -.5, g, .03); ekran(.36, .24, function (q, w, h) { q.strokeStyle = "#7fd0ff"; q.lineWidth = 4; [[40, 60, 150, 200], [210, 50, 120, 120], [350, 70, 120, 220], [210, 190, 120, 110]].forEach(function (r) { q.strokeRect(r[0], r[1], r[2], r[3]); }); matn(q, "Samaradorlik 86%", 40, 320, 34, "#ffd36b"); }, 1.7, 1.25, -.34, g).rotation.x = -.3;
      L("Bichish kallagi (pichoq)", 0, 1.2, 0); L("Portal", 0, 1.2, .8); L("Mato to‘shamasi", -.9, .96, .3); L("Boshqaruv pulti", 1.7, 1.45, -.4);
      var ch = []; [[-.8, -.3, .5, .6], [-.2, .2, .4, .4], [.5, -.2, .5, .8]].forEach(function (r) { var e = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(r[2], r[3])), new T.LineBasicMaterial({ color: 0xc8201c })); e.rotation.x = -Math.PI / 2; e.position.set(r[0], .935, r[1]); c.add(e); ch.push(e); });
      odam(c, 1.75, .25);
      return { r: 3.2, y: .9, rIsh: 3.6, yIsh: .9, anim: function (t, ish) { var s = ish ? 1 : .25; port.position.x = Math.sin(t * .7 * s) * 1.0; kal.position.z = Math.sin(t * 1.9 * s) * .6; } };
    };
    B.zargar = function (g, c, L) {
      stol(g, .9, .6, .78, 0, 0); box(.3, .36, .5, M.oq, 0, .97, 0, g, .03); box(.26, .16, .02, M.qoraShisha, 0, .93, .25, g);
      cyl(.045, .02, M.rezina, -.07, .9, .26, g, "z"); cyl(.045, .02, M.rezina, .07, .9, .26, g, "z"); // qo'l teshiklari
      var mk = new T.Group(); mk.position.set(0, 1.2, .12); mk.rotation.x = .6; g.add(mk); box(.12, .06, .1, M.qora, 0, 0, 0, mk, .015); cyl(.018, .09, M.qora, -.03, .06, 0, mk); cyl(.018, .09, M.qora, .03, .06, 0, mk);
      ekran(.12, .08, function (q) { matn(q, "LC-WELD", 20, 80, 62, "#7fd0ff"); matn(q, "2.4 J · 3 ms · 5 Hz", 20, 170, 40, "#ffd36b"); }, .2, 1.05, .2, g).rotation.y = -.4;
      L("Stereo mikroskop", 0, 1.3, .15); L("Ish kamerasi", 0, 1.0, .27); L("Sensorli ekran", .22, 1.12, .22);
      cyl(.03, .05, M.qora, .3, .805, .12, c); var uz = add(new T.TorusGeometry(.03, .006, 14, 40), M.oltin, .3, .865, .12, c); cyl(.008, .012, M.shisha, .3, .9, .12, c);
      var ch = nur(0xa8d8ff, 0, 1.5, .3, .93, .14, c);
      return { r: 1.05, y: 1.0, rIsh: 1.0, yIsh: .95, thIsh: .9, anim: function (t, ish) { ch.intensity = ish && (t * 5 % 1) < .12 ? 6 : 0; uz.rotation.y = t * .6; } };
    };
    B.fen = function (g, c, L) {
      var k = new T.Group(); k.position.set(0, 1.25, 0); g.add(k);
      tube([[0, -.16, 0], [0, -.02, 0], [0, .08, .0], [.02, .12, .0], [.07, .135, 0], [.12, .13, 0]], .021, mat(0xc77b4a, .9, .3), k);
      cyl(.023, .05, mat(0x2a2f6b, .6, .35), 0, -.17, 0, k); cyl(.026, .012, mat(0x2a2f6b, .6, .35), .125, .13, 0, k, "x"); cyl(.004, .3, M.rezina, 0, -.34, 0, k);
      box(.006, .03, .012, M.oq, .023, -.02, 0, k);
      L("Havo chiqish soplosi", .13, 1.42, 0); L("Filtr va motor (tutqichda)", 0, 1.08, 0); L("Boshqaruv tugmalari", .04, 1.25, 0);
      var bosh = new T.Group(); bosh.position.set(.5, 0, 0); c.add(bosh); cyl(.05, .5, M.oq, 0, 1.0, 0, bosh); sph(.11, M.teri, 0, 1.38, 0, bosh); var soch = sph(.118, mat(0x2a1a10, 0, .9), -.0, 1.4, -.02, bosh); soch.scale.set(1, 1.05, 1);
      var hv = zarra(60, 0xffffff, .012, c);
      return { r: .5, y: 1.25, rIsh: 1.3, yIsh: 1.3, anim: function (t, ish) { hv.visible = ish; if (ish) zOqim(hv, t * 2, function (q, ph) { return [.13 + q * .3, 1.38 + (ph - .5) * q * .12, (ph * 7 % 1 - .5) * q * .12]; }); k.rotation.z = ish ? Math.sin(t * 2) * .12 : 0; } };
    };
    B.pech = function (g, c, L) {
      var st = polat(), stQ = polat(0x8f959b), qg = new T.MeshPhysicalMaterial({ color: 0x08090b, roughness: .06, metalness: .2, clearcoat: 1, clearcoatRoughness: .04 }), Y = 1.3, H = 1.04;
      var oyna = new T.MeshPhysicalMaterial({ color: 0x30363c, roughness: .03, metalness: 0, transparent: true, opacity: .32, clearcoat: 1 });
      // taglik: ramka, GN yo'naltirgichlar, rostlanadigan oyoqlar
      [[-.38, -.34], [.38, -.34], [-.38, .34], [.38, .34]].forEach(function (s) { box(.04, .7, .04, st, s[0], .41, s[1], g); cyl(.024, .05, M.qora, s[0], .03, s[1], g); cyl(.03, .012, st, s[0], .006, s[1], g); });
      [-.34, .34].forEach(function (z) { box(.8, .04, .04, st, 0, .74, z, g); box(.8, .03, .03, st, 0, .16, z, g); }); [-.38, .38].forEach(function (x) { box(.04, .04, .72, st, x, .74, 0, g); box(.03, .03, .72, st, x, .16, 0, g); });
      box(.76, .012, .68, st, 0, .18, 0, g); for (var i = 0; i < 6; i++) [-.352, .352].forEach(function (x) { box(.014, .01, .64, st, x, .28 + i * .075, 0, g); });
      box(.53, .02, .6, st, 0, .44, 0, g); box(.53, .02, .6, st, 0, .59, 0, g); // zaxira tovoqlar
      // korpus qobig'i (old tomoni ochiq) va ichki kamera
      box(.85, .03, .78, st, 0, Y + H / 2 - .015, 0, g, .008); box(.85, .03, .78, st, 0, Y - H / 2 + .015, 0, g); box(.03, H, .78, st, -.41, Y, 0, g); box(.03, H, .78, st, .41, Y, 0, g); box(.85, H, .03, st, 0, Y, -.375, g);
      box(.02, H - .06, .74, stQ, .2, Y, 0, g); box(.58, H - .08, .01, stQ, -.1, Y, -.35, g); box(.58, .01, .7, stQ, -.1, Y - H / 2 + .04, 0, g);
      cyl(.17, .012, M.temir, -.1, Y, -.34, g, "z"); for (i = 0; i < 6; i++) { var pr = box(.3, .012, .004, st, -.1, Y, -.332, g); pr.rotation.z = i * Math.PI / 6; } // ventilyator panjarasi
      var non = mat(0xc8873a, 0, .8), pish = [];
      for (i = 0; i < 10; i++) { var yy = Y - H / 2 + .1 + i * .088; [-.385, .185].forEach(function (x) { box(.012, .008, .62, st, x, yy, .02, g); });
        if (i % 2 === 1) { box(.545, .012, .5, stQ, -.1, yy + .01, .02, g); for (var k = 0; k < 6; k++) { var n = add(new T.CapsuleGeometry(.032, .09, 6, 12), non, -.27 + (k % 3) * .17, yy + .048, -.1 + Math.floor(k / 3) * .24, g); n.rotation.z = Math.PI / 2; n.scale.set(1, .8, 1.25); pish.push(n); } } }
      var ich = nur(0xffc27a, 5, 1.6, -.1, Y + .38, .1, g), ich2 = nur(0xffc27a, 3, 1.4, -.1, Y - .2, .15, g);
      box(.6, .03, .02, qg, -.1, Y + H / 2 - .035, .385, g); box(.6, .03, .02, qg, -.1, Y - H / 2 + .035, .385, g); // old ramka
      // eshik: ramka + shisha + tutqich, chap tomonda oshiq-moshiq
      var esh = new T.Group(); esh.position.set(-.41, Y, .395); g.add(esh);
      box(.62, .07, .035, qg, .31, H / 2 - .055, .018, esh, .012); box(.62, .07, .035, qg, .31, -H / 2 + .055, .018, esh, .012); box(.07, H - .04, .035, qg, .035, 0, .018, esh, .012); box(.07, H - .04, .035, qg, .585, 0, .018, esh, .012);
      var sh = box(.49, H - .17, .012, oyna, .31, 0, .02, esh); sh.castShadow = false; box(.5, H - .16, .006, M.rezina, .31, 0, .002, esh).scale.set(1, 1, 1);
      esh.children[esh.children.length - 1].visible = false;
      cyl(.013, .62, st, .585, 0, .085, esh); [.24, -.24].forEach(function (y) { cyl(.009, .05, st, .585, y, .06, esh, "z"); });
      [.4, -.4].forEach(function (y) { cyl(.014, .07, st, -.405, Y + y, .4, g); });
      box(.6, .018, .05, st, -.1, Y - H / 2 - .012, .41, g); // tomchi tarnovi
      // boshqaruv paneli: qora shisha, sensorli ekran, aylanma dasta
      box(.2, H - .03, .03, qg, .31, Y, .395, g, .01);
      var ek = ekran(.16, .27, function (q, w, h) { var gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#101a2c"); gr.addColorStop(1, "#060a12"); q.fillStyle = gr; q.fillRect(0, 0, w, h);
        matn(q, "12:40", 30, 70, 44, "#9fb3cc"); matn(q, "Non · 6 tovoq", 30, 140, 46, "#fff"); q.strokeStyle = "#ff8a3d"; q.lineWidth = 16; q.beginPath(); q.arc(w / 2, 360, 140, -Math.PI / 2, Math.PI * .9); q.stroke(); q.strokeStyle = "#22304a"; q.beginPath(); q.arc(w / 2, 360, 140, Math.PI * .9, Math.PI * 1.5); q.stroke();
        q.textAlign = "center"; matn(q, "180°C", w / 2, 350, 84, "#ffd36b"); matn(q, "08:25 qoldi", w / 2, 410, 38, "#e7f0ff"); q.textAlign = "left";
        [["Bug‘", "40%", "#5ab6ff"], ["Havo", "3/5", "#35d07f"], ["Zond", "92°", "#ff8a3d"]].forEach(function (a, i) { q.fillStyle = "#16233a"; q.fillRect(30 + i * 155, 560, 140, 150); matn(q, a[0], 46 + i * 155, 610, 34, "#9fb3cc"); matn(q, a[1], 46 + i * 155, 680, 50, a[2]); });
        q.fillStyle = "#e8742a"; q.fillRect(30, 750, w - 60, 80); q.textAlign = "center"; matn(q, "TO‘XTATISH", w / 2, 805, 44, "#fff"); q.textAlign = "left"; }, .31, Y + .28, .4115, g);
      cyl(.036, .028, st, .31, Y - .02, .42, g, "z"); add(new T.TorusGeometry(.042, .004, 10, 40), mat(0xff8a3d, 0, .3, { emissive: 0xff8a3d, emissiveIntensity: 2 }), .31, Y - .02, .412, g);
      box(.05, .016, .004, M.temir, .31, Y - .14, .412, g); for (i = 0; i < 7; i++) box(.12, .006, .004, M.temir, .31, Y - .3 - i * .018, .4115, g); // USB va dinamik panjarasi
      for (i = 0; i < 9; i++) box(.004, .012, .3, M.temir, .4265, Y - .2 - i * .03, -.1, g); // yon shamollatish
      cyl(.032, .07, st, -.22, Y + H / 2 + .035, -.25, g); cyl(.022, .05, st, .1, Y + H / 2 + .025, -.28, g); // bug' chiqish quvurlari
      L("Sensorli boshqaruv ekrani", .31, Y + .44, .42); L("Shisha eshik", -.25, Y + .3, .43); L("Eshik tutqichi", .175, Y - .1, .5); L("Aylanma dasta", .31, Y - .02, .45); L("Tovoq yo‘naltirgichlari (10 daraja)", -.1, Y - .3, .4); L("Bug‘ chiqish quvuri", -.22, Y + H / 2 + .1, -.25); L("Taglik va zaxira tovoqlar", 0, .5, .36);
      // ish joyi: oshxona
      var pol = add(new T.PlaneGeometry(9, 7), kafel("#b9b3a8", "#6d675e", 4, 9, 7), 1, .002, 1.2, c); pol.rotation.x = -Math.PI / 2; pol.castShadow = false;
      var dev = add(new T.PlaneGeometry(9, 3.2), kafel("#f3f1ec", "#c9c5bc", 8, 9, 3.2), 1, 1.6, -.62, c); dev.castShadow = false;
      box(3.4, .4, 1.1, st, .9, 2.45, -.05, c, .02); box(3.4, .05, 1.14, stQ, .9, 2.24, -.05, c); // so'rish zonti
      var tx = 1.75; box(1.5, .04, .7, st, tx, .88, -.1, c, .008); box(1.5, .1, .02, st, tx, .93, -.44, c); box(1.4, .02, .6, st, tx, .25, -.1, c); [[-.7, -.3], [.7, -.3], [-.7, .3], [.7, .3]].forEach(function (s) { box(.04, .86, .04, st, tx + s[0], .43, -.1 + s[1], c); });
      box(.45, .025, .3, mat(0xb98a5c, 0, .7), tx - .35, .913, -.05, c, .008); box(.54, .02, .34, stQ, tx + .3, .91, -.08, c);
      for (i = 0; i < 6; i++) { var n2 = add(new T.CapsuleGeometry(.032, .09, 6, 12), non, tx + .14 + (i % 3) * .16, .945, -.16 + Math.floor(i / 3) * .16, c); n2.rotation.z = Math.PI / 2; n2.scale.set(1, .8, 1.25); }
      var osh = new T.Group(); osh.position.set(1.15, 0, .75); osh.rotation.y = -1.9; c.add(osh); var oqM = mat(0xf4f4f2, 0, .8);
      add(new T.CapsuleGeometry(.17, .5, 8, 18), oqM, 0, 1.12, 0, osh); box(.3, .5, .02, mat(0x2b2f36, 0, .9), 0, .95, .165, osh); sph(.105, M.teri, 0, 1.62, 0, osh); cyl(.1, .17, oqM, 0, 1.78, 0, osh, null, .115);
      [-.085, .085].forEach(function (x) { cyl(.07, .78, mat(0x2b2f36, 0, .9), x, .4, 0, osh, null, .08); box(.1, .06, .22, M.qora, x, .03, .04, osh, .02); var q = add(new T.CapsuleGeometry(.05, .46, 6, 12), oqM, x * 2.5, 1.12, .06, osh); q.rotation.x = -.35; });
      var bg = zarra(110, 0xffffff, .09, c);
      return { r: 2.9, y: 1.02, rIsh: 4.3, yIsh: 1.25, thIsh: .55, anim: function (t, ish) { var a = ish ? -1.75 : 0; esh.rotation.y += (a - esh.rotation.y) * .04; var och = -esh.rotation.y / 1.75; bg.visible = och > .15;
        if (bg.visible) { bg.material.opacity = .35 * och; zOqim(bg, t * .35, function (q, ph, i) { var x0 = -.1 + ((ph * 13) % 1 - .5) * .5; return [x0 + Math.sin(i + t * .7) * .06 * q, Y - .2 + ((ph * 7) % 1) * .5 + q * 1.1, .3 + q * (.45 + ph * .3)]; }); }
        ich.intensity = 5 + Math.sin(t * 1.7) * .4; ek.material.emissiveIntensity = .95; } };
    };
    B.mashina = function (g, c, L) {
      box(7.3, 1.9, 2.3, M.qizil, 0, 1.75, 0, g, .18); box(1.5, 1.0, 2.32, M.qoraShisha, 2.75, 2.05, 0, g, .12); box(7.3, .35, 2.32, M.temir, 0, .82, 0, g);
      [[-1.9], [0], [-3.0]].forEach(function (s) { box(.95, 1.25, .02, M.polat, s[0], 1.75, 1.16, g); box(.95, 1.25, .02, M.polat, s[0], 1.75, -1.16, g); });
      [[2.3, 1.05], [2.3, -1.05], [-2.3, 1.05], [-2.3, -1.05]].forEach(function (s) { cyl(.55, .36, M.rezina, s[0], .55, s[1], g, "z"); cyl(.3, .37, M.polat, s[0], .55, s[1], g, "z"); });
      var mk = [box(.9, .14, .3, mat(0x1a4fff, 0, .3, { emissive: 0x1a4fff }), 2.9, 2.78, .6, g, .04), box(.9, .14, .3, mat(0x1a4fff, 0, .3, { emissive: 0x1a4fff }), 2.9, 2.78, -.6, g, .04)];
      box(.1, .25, 2.1, M.sariq, 3.68, .95, 0, g); var st = new T.Group(); st.position.set(-1.2, 2.78, 0); g.add(st); cyl(.12, .2, M.polat, 0, 0, 0, st); var qv = cyl(.06, .9, M.polat, .35, .2, 0, st, "x"); qv.rotation.z = Math.PI / 2 - .35;
      box(.5, .5, .03, mat(0xffffff, 0, .4), 1.2, 1.9, 1.17, g);
      L("Elektr yuritma (ikki motor)", 2.3, 1.2, 1.2); L("Ekipaj kabinasi", 2.75, 2.7, .9); L("Lafet stvoli", -.8, 3.2, 0); L("Jihoz bo‘linmalari", -1.9, 2.5, 1.2); L("Mayoqchalar", 2.9, 3.0, 0);
      var uy = new T.Group(); uy.position.set(-7.5, 0, -6); c.add(uy); box(4, 3.5, 4, M.beton, 0, 1.75, 0, uy); box(1.2, 1.4, .1, mat(0x220800, 0, .8, { emissive: 0xff5a10, emissiveIntensity: 2 }), .5, 2.2, 2.02, uy);
      var ol = nur(0xff6a1a, 0, 14, .5, 2.4, 3, uy), suv = zarra(260, 0xbfe4ff, .2, c), tut = zarra(90, 0x6a6a6a, .28, c);
      return { r: 10.5, y: 1.6, rIsh: 19, yIsh: 2.2, thIsh: -.75, anim: function (t, ish) { var b = Math.sin(t * 9) > 0; mk[0].material.emissiveIntensity = ish && b ? 4 : .3; mk[1].material.emissiveIntensity = ish && !b ? 4 : .3; ol.intensity = ish ? 60 + Math.random() * 50 : 0; suv.visible = tut.visible = ish;
        if (ish) { zOqim(suv, t * 1.4, function (q, ph) { return [-.6 - q * 6.4 + (ph - .5) * .3 * q, 3.0 + q * 3.2 - q * q * 4.0, -q * 3.9 + (ph * 9 % 1 - .5) * .3 * q]; }); zOqim(tut, t * .25, function (q, ph) { return [-7 + (ph - .5) * 1.5 + q * 1.5, 3.2 + q * 5, -4 + (ph * 3 % 1 - .5)]; }); } } };
    };
    B.printer3d = function (g, c, L) {
      stol(g, .9, .7, .76, 0, 0); var y0 = .76; box(.4, .03, .4, M.qora, 0, y0 + .015, 0, g, .01); box(.4, .03, .4, M.qora, 0, y0 + .455, 0, g, .01);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { box(.025, .43, .025, M.qora, s[0] * .1875, y0 + .235, s[1] * .1875, g); });
      box(.37, .42, .004, M.shisha, 0, y0 + .235, .198, g).castShadow = false; box(.004, .42, .37, M.shisha, .198, y0 + .235, 0, g).castShadow = false; box(.004, .42, .37, M.shisha, -.198, y0 + .235, 0, g).castShadow = false; box(.37, .42, .01, M.qora, 0, y0 + .235, -.195, g);
      box(.27, .006, .27, M.oltin, 0, y0 + .08, 0, g); var det = box(.09, .12, .09, mat(0x2fa37a, 0, .5), 0, y0 + .083, 0, g, .01); det.geometry.translate(0, .06, 0);
      var kal = new T.Group(); kal.position.set(0, y0 + .37, 0); g.add(kal); box(.36, .015, .02, M.polat, 0, .02, 0, kal); var gol = box(.06, .06, .05, M.temir, 0, 0, 0, kal, .008); cyl(.004, .02, M.mis, -.012, -.04, 0, gol); cyl(.004, .02, M.mis, .012, -.04, 0, gol);
      box(.38, .2, .3, M.temir, 0, y0 + .58, 0, g, .02); [-.13, -.045, .045, .13].forEach(function (x, i) { cyl(.085, .06, mat([0xe53935, 0xfdd835, 0x1e88e5, 0xf5f5f5][i], 0, .5), x, y0 + .6, 0, g, "x"); });
      ekran(.09, .06, function (q) { matn(q, "X2D", 20, 110, 110, "#7fd0ff"); matn(q, "62%  1s 14d", 20, 260, 70, "#35d07f"); }, .14, y0 + .44, .205, g);
      L("Ikki soploli kallak", 0, y0 + .42, .1); L("Isitiladigan kamera", -.2, y0 + .3, .2); L("Stol (platforma)", 0, y0 + .1, .15); L("Ko‘p rangli ip uzatgich", 0, y0 + .72, .1);
      box(.3, .02, .2, M.temir, -.3, .77, .2, c).rotation.y = .3; odam(c, -.75, .5);
      return { r: 1.6, y: 1.05, rIsh: 2.4, yIsh: 1.05, anim: function (t, ish) { var k = ish ? (t * .08) % 1 : .45; det.scale.y = .08 + k * .92; kal.position.y = y0 + .083 + .12 * det.scale.y + .06; gol.position.x = Math.sin(t * (ish ? 6 : 1)) * .04; kal.position.z = Math.cos(t * (ish ? 4.3 : .7)) * .04; } };
    };
    B.ap = function (g, c, L) {
      var H = 2.6; box(1.2, .03, 1.2, M.oq, 0, H + .015, 0, g); var ap = box(.2, .2, .04, M.oq, 0, H - .022, 0, g, .05); ap.rotation.x = Math.PI / 2;
      var led = cyl(.008, .004, mat(0x35d07f, 0, .3, { emissive: 0x35d07f, emissiveIntensity: 3 }), .06, H - .045, .06, g); box(.03, .015, .05, M.kul, 0, H - .01, -.11, g);
      L("Wi-Fi 7 kirish nuqtasi", 0, H - .06, .1); L("Holat chirog‘i", .06, H - .05, .06); L("PoE tarmoq kabeli", 0, H, -.14);
      stol(c, 1.6, .7, .75, 0, 0); var nb = []; [-.45, .45].forEach(function (x) { box(.32, .015, .22, M.kul, x, .758, 0, c); var e = ekran(.3, .19, function (q) { matn(q, "Wi-Fi 7", 30, 90, 70, "#7fd0ff"); matn(q, "2.4 Gbit/s", 30, 220, 80, "#35d07f"); }, x, .86, -.11, c); e.rotation.x = -.2; nb.push(e); });
      odam(c, -.45, .55, 1.3); odam(c, .45, .55, 1.3);
      var hal = []; for (var i = 0; i < 4; i++) { var h = new T.Mesh(new T.TorusGeometry(1, .006, 8, 64), new T.MeshBasicMaterial({ color: 0x2f8cff, transparent: true })); h.rotation.x = Math.PI / 2; h.position.set(0, H - .05, 0); c.add(h); hal.push(h); }
      return { r: .9, y: H - .1, rIsh: 4.4, yIsh: 1.4, kamY: -.25, anim: function (t, ish) { hal.forEach(function (h, i) { var k = (t * .35 + i / 4) % 1; h.scale.setScalar(.1 + k * 1.9); h.position.y = H - .05 - k * 1.6; h.material.opacity = (1 - k) * .7; }); led.material.emissiveIntensity = 2 + Math.sin(t * 6); } };
    };
    B.sensor = function (g, c, L) {
      stol(g, 1.0, .6, .78, 0, 0); var s = new T.Group(); s.position.set(-.1, .9, .05); g.add(s);
      box(.04, .09, .022, M.oq, 0, .1, 0, s, .01); box(.03, .03, .003, M.qizil, 0, .115, .0125, s); cyl(.002, .2, M.polat, 0, -.04, 0, s);
      var led = sph(.004, mat(0x2f8cff, 0, .3, { emissive: 0x2f8cff, emissiveIntensity: 3 }), 0, .075, .012, s);
      cyl(.045, .1, M.shisha, -.1, .83, .05, g).castShadow = false; var sq = cyl(.042, .06, new T.MeshPhysicalMaterial({ color: 0x5fb6e8, transparent: true, opacity: .55, roughness: .1 }), -.1, .812, .05, g);
      L("Simsiz datchik (Bluetooth)", -.1, 1.06, .07); L("Po‘lat zond", -.1, .9, .07); L("Eritmali stakan", -.14, .84, .1);
      var pl = new T.Group(); pl.position.set(.25, .9, 0); pl.rotation.set(-.35, -.3, 0); c.add(pl); box(.26, .18, .012, M.qora, 0, 0, 0, pl, .012);
      var e = ekran(.24, .16, function () { }, 0, 0, .0075, pl), plita = cyl(.07, .02, mat(0x222222, 0, .6, { emissive: 0xff3a10 }), -.1, .775, .05, c);
      return { r: .75, y: .92, rIsh: 1.1, yIsh: .92, anim: function (t, ish) { led.material.emissiveIntensity = Math.sin(t * 5) > 0 ? 4 : .4; plita.material.emissiveIntensity = ish ? 1.5 : 0;
        if (!ish || (e.userData.n = (e.userData.n || 0) + 1) % 6) return; var q = e.userData.g, w = e.userData.cv.width, h = e.userData.cv.height, k = (t * .12) % 1; q.fillStyle = "#0b1220"; q.fillRect(0, 0, w, h);
        q.strokeStyle = "#24344d"; q.lineWidth = 1; for (var i = 1; i < 6; i++) { q.beginPath(); q.moveTo(0, i * h / 6); q.lineTo(w, i * h / 6); q.stroke(); }
        q.strokeStyle = "#ff8a3d"; q.lineWidth = 5; q.beginPath(); for (var x = 0; x <= k * w; x += 6) { var T2 = 22 + 78 * (1 - Math.exp(-3 * x / w)); q.lineTo(x, h - 20 - (T2 - 20) / 85 * (h - 60)); } q.stroke();
        matn(q, (22 + 78 * (1 - Math.exp(-3 * k))).toFixed(1) + " °C", 20, 50, 40, "#ffd36b"); e.userData.t.needsUpdate = true; } };
    };

    /* --- sahna boshqaruvi --- */
    var ildiz = null, ctx = null, joriy = null, tags = [], orb = { th: .7, ph: 1.15, r: 3, tr: 3, y: 1, ty: 1, tx: 0, tz: 0 }, tegildi = 0;
    function tozala(o) { o.traverse(function (m) { if (m.geometry) m.geometry.dispose(); if (m.material && m.material.map) m.material.map.dispose(); }); scene.remove(o); }
    function show(z) {
      if (ildiz) tozala(ildiz); tagsBox.innerHTML = ""; tags = [];
      ildiz = new T.Group(); ctx = new T.Group(); ildiz.add(ctx); scene.add(ildiz);
      var g = new T.Group(); ildiz.add(g);
      joriy = (B[z.m3] || B.sensor)(g, ctx, function (s, x, y, zz) { var d = document.createElement("div"); d.className = "z3-tag"; d.textContent = s; tagsBox.appendChild(d); tags.push({ d: d, v: new T.Vector3(x, y, zz) }); });
      orb.th = .6; sync(true);
    }
    function sync(tez) {
      if (!joriy) return; ctx.visible = S.ish; orb.tr = S.ish ? joriy.rIsh : joriy.r; orb.ty = S.ish ? joriy.yIsh : joriy.y; if (tez) { orb.r = orb.tr * 1.25; orb.y = orb.ty; }
      var k = Math.max(joriy.rIsh, 3); sun.position.set(k * .6, k * 1.3 + 2, k * .7); sun.target.position.set(0, orb.ty, 0); var sc = sun.shadow.camera; sc.left = sc.bottom = -k * 1.3; sc.right = sc.top = k * 1.3; sc.near = .1; sc.far = k * 5 + 10; sc.updateProjectionMatrix();
      tagsBox.style.display = S.tuz ? "" : "none";
    }
    var pt = {}, pd = 0;
    canvas.addEventListener("pointerdown", function (e) { pt[e.pointerId] = [e.clientX, e.clientY]; canvas.setPointerCapture(e.pointerId); tegildi = 1; canvas.style.cursor = "grabbing"; });
    canvas.addEventListener("pointermove", function (e) { var a = pt[e.pointerId]; if (!a) return; var ids = Object.keys(pt);
      if (ids.length === 2) { var o = pt[ids[0] == e.pointerId ? ids[1] : ids[0]], d = Math.hypot(e.clientX - o[0], e.clientY - o[1]); if (pd) orb.tr = Math.min(60, Math.max(.25, orb.tr * pd / d)); pd = d; }
      else { orb.th -= (e.clientX - a[0]) * .008; orb.ph = Math.min(1.5, Math.max(.25, orb.ph - (e.clientY - a[1]) * .006)); }
      pt[e.pointerId] = [e.clientX, e.clientY]; });
    function qoy(e) { delete pt[e.pointerId]; pd = 0; canvas.style.cursor = "grab"; }
    canvas.addEventListener("pointerup", qoy); canvas.addEventListener("pointercancel", qoy);
    canvas.addEventListener("wheel", function (e) { e.preventDefault(); orb.tr = Math.min(60, Math.max(.25, orb.tr * (e.deltaY > 0 ? 1.1 : .9))); }, { passive: false });
    var soat = new T.Clock(), w0 = 0, h0 = 0, v = new T.Vector3();
    function kadr() {
      requestAnimationFrame(kadr);
      var w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
      if (w !== w0 || h !== h0) { w0 = w; h0 = h; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
      var dt = Math.min(soat.getDelta(), .05), t = soat.elapsedTime;
      if (S.ayl && !Object.keys(pt).length) orb.th += dt * .14;
      orb.r += (orb.tr - orb.r) * .08; orb.y += (orb.ty - orb.y) * .08;
      var ph = joriy && joriy.kamY && !S.ish ? Math.PI / 2 - joriy.kamY * -1 + .15 : orb.ph;
      cam.position.set(Math.sin(orb.th) * Math.sin(ph) * orb.r, orb.y + Math.cos(ph) * orb.r, Math.cos(orb.th) * Math.sin(ph) * orb.r); cam.lookAt(0, orb.y, 0);
      if (joriy) joriy.anim(t, S.ish);
      R.render(scene, cam);
      if (S.tuz) tags.forEach(function (g) { v.copy(g.v).project(cam); g.d.style.left = (v.x * .5 + .5) * w + "px"; g.d.style.top = (-v.y * .5 + .5) * h + "px"; g.d.style.display = v.z < 1 ? "" : "none"; });
    }
    kadr();
    return { show: show, sync: function () { sync(false); }, burchak: function () { orb.th = S.ish && joriy && joriy.thIsh != null ? joriy.thIsh : .6; } };
  }
})();
