/* Toshkent tuman 1-son texnikumi e-bazasi — «Kasblar xaritasi».
   Dunyo: Xalqaro mehnat tashkiloti (ILOSTAT) — kasb guruhlari bo'yicha o'rtacha oylik maosh (USD) va band aholining kasblar bo'yicha taqsimoti.
   O'zbekiston: Milliy statistika qo'mitasi — hududlar va sohalar bo'yicha o'rtacha oylik ish haqi.
   Ma'lumot: assets/kasb-xarita.json (yig'ish tartibi README'da). */
(function () {
  "use strict";
  var root = document.getElementById("kx"); if (!root) return;
  var base = (document.currentScript && document.currentScript.src || "").replace(/kasb-xarita\.js.*$/, "");
  var KG = [["0", "Barcha kasblar (o‘rtacha)"], ["1", "Rahbarlar"], ["2", "Oliy malakali mutaxassislar (shifokor, muhandis, o‘qituvchi, dasturchi)"], ["3", "Texniklar va o‘rta malakali mutaxassislar"], ["4", "Idora xodimlari"], ["5", "Xizmat ko‘rsatish va savdo (oshpaz, sartarosh, sotuvchi)"], ["6", "Qishloq xo‘jaligi malakali ishchilari"], ["7", "Hunarmand va malakali ishchilar (payvandchi, elektrik, tikuvchi, avtomexanik)"], ["8", "Uskuna operatorlari va haydovchilar"], ["9", "Malakasiz ishchilar"]];
  var KQ = { "1": "Rahbarlar", "2": "Oliy malakali mutaxassislar", "3": "Texniklar", "4": "Idora xodimlari", "5": "Xizmat va savdo", "6": "Qishloq xo‘jaligi", "7": "Hunarmand va ishchilar", "8": "Operator va haydovchilar", "9": "Malakasiz ishchilar" };
  var K2 = [["72", "Metallga ishlov berish va mashinasozlik: payvandchi, chilangar, avtomexanik"], ["74", "Elektr va elektronika ustalari: elektromontyor"], ["75", "Oziq-ovqat, yog‘och va tikuvchilik: novvoy, duradgor, tikuvchi"], ["73", "Hunarmandlar va bosmachilar: zargar, kulol"], ["71", "Quruvchilar"], ["51", "Shaxsiy xizmatlar: oshpaz, sartarosh, ofitsiant"], ["54", "Himoya xizmatlari: o‘t o‘chiruvchi, qo‘riqchi"], ["35", "AKT texniklari: tizim administratori, tarmoq texnigi"], ["25", "AKT mutaxassislari: dasturchi"], ["21", "Fan va muhandislik mutaxassislari: muhandis, arxitektor, dizayner"], ["22", "Sog‘liqni saqlash mutaxassislari: shifokor, hamshira"], ["23", "Ta’lim mutaxassislari: o‘qituvchi"], ["24", "Biznes va ma’muriyat mutaxassislari: buxgalter, moliyachi"], ["26", "Huquq, ijtimoiy soha va madaniyat: yurist, jurnalist"], ["31", "Fan va muhandislik texniklari"], ["32", "Tibbiyot o‘rta xodimlari: feldsher, laborant"], ["33", "Biznes va ma’muriyat o‘rta mutaxassislari: agent, savdo vakili"], ["34", "Huquq, madaniyat va sport o‘rta xodimlari: bosh oshpaz, murabbiy, fotograf"], ["52", "Sotuvchilar"], ["53", "Parvarish xodimlari: enaga, sanitar"], ["83", "Haydovchilar va ko‘chma texnika operatorlari"], ["81", "Statsionar uskuna operatorlari"], ["82", "Yig‘uvchilar"], ["41", "Umumiy idora xodimlari"], ["42", "Mijozlarga xizmat: kassir, call-markaz operatori"], ["43", "Hisob-kitob va ombor xodimlari"], ["44", "Boshqa idora xodimlari"], ["11", "Oliy rahbarlar"], ["12", "Ma’muriy va tijorat rahbarlari"], ["13", "Ishlab chiqarish va xizmat rahbarlari"], ["14", "Mehmonxona, savdo va xizmat rahbarlari"], ["61", "Dehqon va fermerlar (bozor uchun)"], ["62", "O‘rmonchilik va baliqchilik"], ["63", "O‘zi uchun dehqonchilik qiluvchilar"], ["91", "Farrosh va yordamchilar"], ["92", "Qishloq xo‘jaligi yordamchi ishchilari"], ["93", "Qurilish, sanoat va transport yordamchi ishchilari"], ["94", "Oshxona yordamchilari"], ["95", "Ko‘cha savdosi va xizmati"], ["96", "Boshqa malakasiz ishchilar"]];
  var K2N = {}; K2.forEach(function (k) { K2N[k[0]] = k[1]; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function son(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  var st = document.createElement("style");
  st.textContent = ".kx-b{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:14px 0}.kx-b select{max-width:100%;padding:9px 12px;border-radius:10px;border:1px solid rgba(90,50,20,.25);background:#fff;font:inherit}" +
    ".kx-w{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:14px;align-items:start}.kx-p{max-height:640px;overflow:auto}.kx-m{position:relative;border-radius:16px;overflow:hidden;border:1px solid rgba(90,50,20,.15);background:#dcebf5}.kx-m svg{display:block;width:100%;height:auto;touch-action:none;cursor:grab}" +
    ".kx-m path{stroke:#fff;stroke-width:.4;vector-effect:non-scaling-stroke}.kx-m path.d{cursor:pointer}.kx-m path.d:hover{stroke:#2a160b;stroke-width:1.4}.kx-m path.t{stroke:#2a160b;stroke-width:1.8}.kx-uz path{stroke:#2a160b;stroke-width:.5}" +
    ".kx-z{position:absolute;right:10px;top:10px;display:flex;flex-direction:column;gap:6px}.kx-z button{border:0;border-radius:10px;padding:8px 11px;font:600 13px inherit;background:rgba(40,22,12,.85);color:#fff;cursor:pointer}" +
    ".kx-t{position:absolute;pointer-events:none;background:#2a160b;color:#fff;font-size:12.5px;padding:6px 9px;border-radius:8px;transform:translate(-50%,-120%);white-space:nowrap;display:none;z-index:3}" +
    ".kx-l{position:absolute;left:10px;bottom:10px;background:rgba(255,255,255,.92);border-radius:10px;padding:8px 10px;font-size:12px}.kx-l i{display:inline-block;width:22px;height:10px;vertical-align:middle}.kx-l div{margin-top:3px}" +
    ".kx-p h3{margin:0 0 4px}.kx-p h4{margin:14px 0 6px}.kx-r{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:13.5px;margin-bottom:7px}.kx-r span.b{grid-column:1/3;height:7px;border-radius:4px;background:#f0e3d3;overflow:hidden}.kx-r span.b i{display:block;height:100%;background:#e8742a}.kx-r.on{font-weight:700}" +
    ".kx-n{font-size:13px;opacity:.8;margin-top:10px}@media(max-width:900px){.kx-w{grid-template-columns:1fr}.kx-p{max-height:none}}@media print{.kx-z,.kx-b{display:none}}";
  document.head.appendChild(st);

  root.innerHTML = '<div class="kx-b"><div class="seg" role="group"><button type="button" data-k="e" class="on">💰 Maosh</button><button type="button" data-k="p">👥 Kasb ulushi</button></div><select id="kx-s" aria-label="Kasb guruhi"></select></div>' +
    '<div class="kx-w"><div class="kx-m"><svg viewBox="0 0 960 500" role="img" aria-label="Dunyo xaritasi"></svg><div class="kx-t"></div><div class="kx-l"></div><div class="kx-z"><button type="button" data-z="uz">🇺🇿 O‘zbekiston</button><button type="button" data-z="w">🌍 Dunyo</button><button type="button" data-z="+">+</button><button type="button" data-z="-">−</button></div></div>' +
    '<div class="kx-p card"><p class="muted">Xarita yuklanmoqda…</p></div></div><p class="kx-n" id="kx-n"></p>';
  var sel = root.querySelector("#kx-s"), pan = root.querySelector(".kx-p"), tip = root.querySelector(".kx-t"), leg = root.querySelector(".kx-l"), mbox = root.querySelector(".kx-m");
  var rej = "e", D, d3, tj, svgSel, gW, gU, zoom, path, tanl = null, ranglar;

  function yukla(u) { return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = base + u; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  Promise.all([yukla("d3.min.js"), yukla("topojson-client.min.js"), fetch(base + "kasb-xarita.json?v=3").then(function (r) { return r.json(); })]).then(function (a) {
    D = a[2]; d3 = window.d3; tj = window.topojson; chiz(); toldir(); boya(); uzPanel(null);
  }).catch(function () { pan.innerHTML = '<p class="note bad">Xaritani yuklab bo‘lmadi. Internetni tekshirib, sahifani yangilang.</p>'; });

  function dnom(f) { return (D.nom && D.nom[f.id]) || f.properties.name; }
  function qiymat(id) { var w = D.w[id]; if (!w) return null; var k = sel.value; if (rej === "e") return w.e ? w.e[+k] : null; return w.p && w.p[k] != null ? w.p[k] / 10 : null; }

  function toldir() {
    sel.innerHTML = (rej === "e" ? KG : K2).map(function (k) { return '<option value="' + k[0] + '">' + esc(k[1]) + "</option>"; }).join("");
  }
  function chiz() {
    svgSel = d3.select(root.querySelector("svg")); var g = svgSel.append("g");
    var proj = d3.geoNaturalEarth1().fitSize([960, 500], { type: "Sphere" }); path = d3.geoPath(proj);
    var F = tj.feature(D.topo, D.topo.objects.countries).features.filter(function (f) { return f.id !== "010"; });
    gW = g.append("g").selectAll("path").data(F).join("path").attr("d", path).attr("class", "d")
      .on("mousemove", function (e, f) { var v = qiymat(f.id); tipK(e, "<b>" + esc(dnom(f)) + "</b><br>" + (v == null ? "ma’lumot yo‘q" : rej === "e" ? son(v) + " $/oy" : v.toFixed(1) + "% band aholi")); })
      .on("mouseleave", function () { tip.style.display = "none"; }).on("click", function (e, f) { tanl = f.id; gW.classed("t", function (x) { return x.id === tanl; }); f.id === "860" ? uzPanel(null) : davlat(f); });
    gU = g.append("g").attr("class", "kx-uz").style("opacity", 0).style("pointer-events", "none").selectAll("path").data(D.uz.features).join("path").attr("d", path).attr("class", "d")
      .on("mousemove", function (e, f) { tipK(e, "<b>" + esc(f.properties.n) + "</b><br>" + son(f.properties.m) + " so‘m/oy"); }).on("mouseleave", function () { tip.style.display = "none"; }).on("click", function (e, f) { uzPanel(f.properties); });
    var mm = d3.extent(D.uz.features, function (f) { return f.properties.m; }), us = d3.scaleSequential(d3.interpolateYlGnBu).domain([mm[0] * .8, mm[1]]);
    gU.attr("fill", function (f) { return us(f.properties.m); });
    zoom = d3.zoom().scaleExtent([1, 60]).on("zoom", function (e) { g.attr("transform", e.transform); var yaq = e.transform.k > 5; d3.select(root.querySelector(".kx-uz")).style("opacity", yaq ? 1 : 0).style("pointer-events", yaq ? "auto" : "none"); });
    svgSel.call(zoom);
  }
  function tipK(e, h) { var r = mbox.getBoundingClientRect(); tip.innerHTML = h; tip.style.display = "block"; tip.style.left = (e.clientX - r.left) + "px"; tip.style.top = (e.clientY - r.top) + "px"; }
  function boya() {
    var V = []; for (var id in D.w) { var v = qiymat(id); if (v != null && v > 0) V.push(v); }
    V.sort(function (a, b) { return a - b; });
    var ch = [0.2, 0.4, 0.6, 0.8].map(function (q) { return d3.quantile(V, q); }), rang = rej === "e" ? d3.schemeYlOrRd[5] : d3.schemeBuPu[5];
    var sc = d3.scaleThreshold().domain(ch).range(rang);
    gW.attr("fill", function (f) { var v = qiymat(f.id); return v == null ? "#e3e0db" : sc(v); });
    function f(x) { return rej === "e" ? son(x) + " $" : x.toFixed(1) + "%"; }
    leg.innerHTML = "<b>" + (rej === "e" ? "O‘rtacha oylik maosh" : "Band aholidagi ulushi") + "</b>" + rang.map(function (c, i) { return '<div><i style="background:' + c + '"></i> ' + (i === 0 ? "< " + f(ch[0]) : i === 4 ? "> " + f(ch[3]) : f(ch[i - 1]) + " – " + f(ch[i])) + "</div>"; }).join("") + '<div><i style="background:#e3e0db"></i> ma’lumot yo‘q</div><div style="margin-top:6px;max-width:190px"><i style="background:linear-gradient(90deg,#edf8b1,#2c7fb8)"></i> O‘zbekiston viloyatlari: ish haqi pastdan yuqoriga (yaqinlashtirganda)</div>';
    document.getElementById("kx-n").innerHTML = "Ma’lumot bor davlatlar: " + V.length + " ta. Har bir davlat uchun eng so‘nggi mavjud yil olingan (2018–2025), shuning uchun davlatlar turli yillarga tegishli bo‘lishi mumkin. Maosh AQSH dollarida, soliqdan oldin, yollanma xodimlar bo‘yicha. Xitoy, Qozog‘iston va ayrim davlatlar bo‘yicha manbada ma’lumot yo‘q.";
  }
  function qator(n, v, max, matn, on) { return '<div class="kx-r' + (on ? " on" : "") + '"><span>' + esc(n) + "</span><span>" + matn + '</span><span class="b"><i style="width:' + Math.max(2, Math.round(v / max * 100)) + '%"></i></span></div>'; }
  function davlat(f) {
    var w = D.w[f.id], h = "<h3>" + esc(dnom(f)) + "</h3>";
    if (!w) { pan.innerHTML = h + '<p class="muted">Bu davlat bo‘yicha Xalqaro mehnat tashkiloti bazasida ma’lumot yo‘q.</p>'; return; }
    if (w.e) { var mx = Math.max.apply(null, w.e.slice(1).filter(Boolean)); h += '<span class="meta">O‘rtacha oylik maosh: <b>' + son(w.e[0]) + " $</b> (" + w.ey + "-yil)</span><h4>Qaysi kasbda maosh katta</h4>" + [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (i) { return w.e[i]; }).sort(function (a, b) { return w.e[b] - w.e[a]; }).map(function (i) { return qator(KQ[i], w.e[i], mx, son(w.e[i]) + " $", rej === "e" && +sel.value === i); }).join(""); }
    else h += '<p class="muted">Maosh bo‘yicha ma’lumot yo‘q.</p>';
    if (w.p) { var T = Object.keys(w.p).filter(function (k) { return K2N[k]; }).sort(function (a, b) { return w.p[b] - w.p[a]; }), top = T.slice(0, 8), mp = w.p[top[0]]; if (rej === "p" && top.indexOf(sel.value) < 0 && w.p[sel.value] != null) top.push(sel.value);
      h += "<h4>Eng ko‘p odam ishlaydigan kasblar (" + w.py + "-yil)</h4>" + top.map(function (k) { return qator(K2N[k].split(":")[0], w.p[k], mp, (w.p[k] / 10).toFixed(1) + "%", rej === "p" && sel.value === k); }).join(""); }
    h += '<p class="kx-n">Manba: <a href="https://ilostat.ilo.org/data/" target="_blank" rel="noopener">ILOSTAT</a> (Xalqaro mehnat tashkiloti).</p>'; pan.innerHTML = h;
  }
  function uzPanel(p) {
    var F = D.uz.features.map(function (f) { return f.properties; }).sort(function (a, b) { return b.m - a.m; }), mx = F[0].m, w = D.w["860"];
    var h = "<h3>🇺🇿 O‘zbekiston" + (p ? " · " + esc(p.n) : "") + '</h3><span class="meta">O‘rtacha oylik ish haqi: <b>' + son(p ? p.m : D.uzj.ort) + " so‘m</b>" + (p ? " (o‘sish " + String(p.o).replace(".", ",") + "%)" : "") + " · " + esc(D.uzj.davr) + "</span>" +
      (p ? "" : '<p class="kx-n" style="margin-top:6px">Mediana ish haqi: ' + son(D.uzj.med) + " so‘m (" + esc(D.uzj.meddavr) + "). Xodimlarning yarmi shundan kam oladi.</p>") +
      "<h4>Qaysi hududda ish haqi katta</h4>" + F.map(function (r) { return qator(r.n, r.m, mx, son(r.m / 1000) + " ming", p && p.n === r.n); }).join("") +
      "<h4>Qaysi sohada ish haqi katta</h4>" + D.soha.map(function (s) { return qator(s[0], s[1], D.soha[0][1], son(s[1] / 1000) + " ming"); }).join("");
    if (w && w.e) h += "<h4>Kasb guruhlari bo‘yicha (" + w.ey + "-yil, ILOSTAT)</h4>" + [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (i) { return w.e[i]; }).sort(function (a, b) { return w.e[b] - w.e[a]; }).map(function (i) { return qator(KQ[i], w.e[i], Math.max.apply(null, w.e.slice(1)), son(w.e[i]) + " $"); }).join("");
    h += '<p class="kx-n">Manba: Milliy statistika qo‘mitasi ma’lumotlari (<a href="https://www.spot.uz/oz/2026/10/27/salary/" target="_blank" rel="noopener">spot.uz, 27.10.2026</a>). Qishloq xo‘jaligi va kichik tadbirkorlik hisobga olinmagan; sohalar ro‘yxati to‘liq emas. Hududni tanlash uchun xaritani O‘zbekistonga yaqinlashtiring.</p>'; pan.innerHTML = h;
  }
  root.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null; if (!b || !d3) return;
    if (b.hasAttribute("data-k")) { rej = b.getAttribute("data-k"); [].forEach.call(root.querySelectorAll("[data-k]"), function (x) { x.classList.toggle("on", x === b); }); toldir(); boya(); return; }
    var z = b.getAttribute("data-z"); if (!z) return; var t = svgSel.transition().duration(700);
    if (z === "w") t.call(zoom.transform, d3.zoomIdentity);
    else if (z === "+") t.call(zoom.scaleBy, 2); else if (z === "-") t.call(zoom.scaleBy, .5);
    else { var bb = path.bounds(D.uz), k = Math.min(40, .85 / Math.max((bb[1][0] - bb[0][0]) / 960, (bb[1][1] - bb[0][1]) / 500)); t.call(zoom.transform, d3.zoomIdentity.translate(480, 250).scale(k).translate(-(bb[0][0] + bb[1][0]) / 2, -(bb[0][1] + bb[1][1]) / 2)); uzPanel(null); }
  });
  sel.addEventListener("change", function () { if (d3) boya(); });
})();
