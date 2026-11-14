/*!
 * Kuvonch Academy — «Kuvi» personaji: kayfiyatga qarab shakli, rangi va yuzi o'zgaradigan kichik SVG,
 * barmoqli qo'llar va oyoqlar, ko'z yoshi, burun suvi, qizarish, mavzuga mos kiyim hamda vaziyatga mos gaplar.
 * ES5 — eski telefonlarda ham ishlaydi.
 * API: kaYuz.svg(mood, cls, o) -> SVG matni   o: { outfit, sg }
 *      kaYuz.react(kind, {tz, n, sg, outfit}) -> {mood, text, html}   kind: ok | bad | timeout | cGood | cMid | cBad
 *      kaYuz.tease() -> tegajoq hazil yoqilganmi (AI ustoz sozlamasi bilan umumiy)
 *      kaYuz.outfitFor(matn, rejim, fan) -> kiyim kaliti (prof, lab, doppi …) yoki ""
 *      kaYuz.pet(sg) -> erkalash so'zi (poponam, akam, kampirim …)
 *      kaYuz.art — AI ustoz sahifasidagi katta Kuvi uchun umumiy rasm bo'laklari
 */
(function () {
  "use strict";
  if (window.kaYuz) return;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function poly(cx, cy, R, r, n, rot) {
    var d = "", k, cnt = r ? n * 2 : n;
    for (k = 0; k < cnt; k++) {
      var a = (rot == null ? -90 : rot) * Math.PI / 180 + k * Math.PI * 2 / cnt, rr = r && k % 2 ? r : R;
      d += (k ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1) + " ";
    }
    return d + "Z";
  }
  // [shakl, rang, ko'z, og'iz, olov]
  var M = {
    neutral: ["pill", "#3b82f6", "normal", "smile"], happy: ["circle", "#22c55e", "happy", "grin"], love: ["pill", "#ec4899", "love", "smile"],
    think: ["hex", "#8b5cf6", "think", "smirk"], strict: ["star", "#f59e0b", "angry", "flat"], jealous: ["pill", "#f97316", "angry", "flat", 1],
    sad: ["tri", "#64748b", "sad", "frown"], wow: ["star", "#06b6d4", "wow", "o"],
    laugh: ["circle", "#eab308", "laugh", "laugh"], cry: ["tri", "#0284c7", "cry", "cry"], shy: ["rsq", "#fb7185", "shy", "shy"],
    wink: ["pill", "#14b8a6", "wink", "tongue"], sleepy: ["pill", "#6366f1", "sleepy", "yawn"]
  };
  var SHP = {
    pill: '<rect x="42" y="86" width="236" height="132" rx="66"/>', rsq: '<rect x="68" y="58" width="184" height="184" rx="46"/>',
    circle: '<circle cx="160" cy="150" r="100"/>', star: '<path d="' + poly(160, 160, 126, 62, 5) + '"/>',
    hex: '<path d="' + poly(160, 150, 112, 0, 6, 0) + '"/>', tri: '<path d="M160 46 L268 236 L52 236 Z"/>'
  };
  // yuzning pastga siljishi va boshning yuqori nuqtasi (shlyapa shu yerga kiyiladi)
  var DY = { pill: 0, rsq: 0, circle: 0, hex: 2, star: 16, tri: 34 };
  var TOP = { pill: 86, rsq: 58, circle: 50, hex: 53, star: 58, tri: 70 };
  var HEART = 'd="M0 8 C-14 -2 -16 -14 -8 -18 C-3 -20 0 -16 0 -12 C0 -16 3 -20 8 -18 C16 -14 14 -2 0 8 Z"';
  var EYES = {
    normal: '<ellipse cx="126" cy="146" rx="13" ry="18"/><ellipse cx="194" cy="146" rx="13" ry="18"/>',
    happy: '<path class="ln" d="M110 152 Q126 130 142 152"/><path class="ln" d="M178 152 Q194 130 210 152"/>',
    angry: '<path d="M104 132 L148 148 Q147 168 127 168 Q105 168 104 146 Z"/><path d="M216 132 L172 148 Q173 168 193 168 Q215 168 216 146 Z"/>',
    love: '<path transform="translate(126 150) scale(1.7)" ' + HEART + '/><path transform="translate(194 150) scale(1.7)" ' + HEART + '/>',
    think: '<ellipse cx="134" cy="138" rx="11" ry="15"/><ellipse cx="200" cy="138" rx="11" ry="15"/><path class="ln" d="M118 116 L146 110"/>',
    sad: '<ellipse cx="126" cy="152" rx="12" ry="14"/><ellipse cx="194" cy="152" rx="12" ry="14"/><path class="ln" d="M110 132 L142 122"/><path class="ln" d="M178 122 L210 132"/>',
    wow: '<circle cx="126" cy="146" r="17"/><circle cx="194" cy="146" r="17"/><circle class="hl" cx="132" cy="139" r="5"/><circle class="hl" cx="200" cy="139" r="5"/>',
    laugh: '<path class="ln" d="M108 134 L140 146 L108 158"/><path class="ln" d="M212 134 L180 146 L212 158"/>',
    cry: '<path class="ln" d="M108 152 Q126 136 144 152"/><path class="ln" d="M176 152 Q194 136 212 152"/><path class="ln" d="M110 128 L142 116"/><path class="ln" d="M178 116 L210 128"/>',
    wink: '<ellipse cx="126" cy="146" rx="13" ry="18"/><path class="ln" d="M178 152 Q194 132 210 152"/>',
    sleepy: '<path d="M112 146 L140 146 Q140 160 126 160 Q112 160 112 146 Z"/><path d="M180 146 L208 146 Q208 160 194 160 Q180 160 180 146 Z"/><path class="ln" d="M108 145 L144 145"/><path class="ln" d="M176 145 L212 145"/>',
    shy: '<ellipse cx="120" cy="154" rx="10" ry="13"/><ellipse cx="188" cy="154" rx="10" ry="13"/><circle class="hl" cx="123" cy="149" r="3.5"/><circle class="hl" cx="191" cy="149" r="3.5"/>'
  };
  var MOUTH = {
    smile: '<path class="ln" d="M146 184 Q160 191 174 184"/>', grin: '<path class="ln" d="M136 178 Q160 206 184 178"/>',
    smirk: '<path class="ln" d="M148 189 Q164 183 176 190"/>', flat: '<path class="ln" d="M142 186 L178 186"/>',
    frown: '<path class="ln" d="M144 193 Q160 180 176 193"/>', o: '<ellipse cx="160" cy="186" rx="10" ry="11"/>',
    shy: '<path class="ln" d="M148 190 Q154 186 160 190 Q166 194 172 190"/>',
    laugh: '<path d="M132 178 Q160 222 188 178 Z"/><path class="tg" d="M146 198 Q160 212 174 198 Q160 192 146 198 Z"/>',
    cry: '<path d="M138 200 Q148 182 160 192 Q172 182 182 200 Q160 212 138 200 Z"/>',
    tongue: '<path class="ln" d="M146 184 Q160 194 174 184"/><path class="tg" d="M156 189 Q155 204 164 204 Q172 203 170 189 Z"/>',
    yawn: '<ellipse cx="160" cy="190" rx="9" ry="13"/>'
  };
  // Har kayfiyatga mos imo-ishora (qo'l va oyoqlar)
  var ACT = { neutral: "idle", happy: "clap", love: "hug", think: "scratch", strict: "wag", jealous: "fists", sad: "droop", wow: "cheeks", listen: "ear",
    laugh: "belly", cry: "wipe", shy: "cover", wink: "thumb", sleepy: "yawn" };
  function actOf(mood) { if (mood === "happy" && Math.random() < .4) return "thumb"; return ACT[mood] || "idle"; }

  /* ---------- Qo'llar (4 barmoq + bosh barmoq) va oyoqlar ---------- */
  // Qo'l shakllari: o — ochiq kaft, f — musht, t — bosh barmoq yuqoriga, p — ko'rsatkich barmoq
  var FIST = '<rect x="-12" y="-22" width="24" height="25" rx="9"/>';
  var HS = {
    o: '<rect x="-11" y="-15" width="22" height="21" rx="9"/><rect x="-11" y="-31" width="5.4" height="20" rx="2.7"/><rect x="-5.5" y="-34" width="5.4" height="23" rx="2.7"/>' +
      '<rect x="0" y="-33" width="5.4" height="22" rx="2.7"/><rect x="5.5" y="-28" width="5.4" height="17" rx="2.7"/><rect x="-25" y="-11" width="15" height="6.4" rx="3.2" transform="rotate(-38 -11 -8)"/>',
    f: FIST,
    // bosh barmoq yuqoriga: musht yonboshdan, barmoqlar gorizontal bukilgan
    t: '<rect x="-12" y="-20" width="27" height="23" rx="9"/><rect x="-15" y="-42" width="10" height="26" rx="5" transform="rotate(-10 -10 -18)"/>',
    // ko'rsatkich barmoq: chetdagi barmoq tik, bosh barmoq mushtni kesib o'tadi
    p: FIST + '<rect x="-12" y="-47" width="7.4" height="30" rx="3.7"/>'
  };
  var KN = {
    f: '<path class="kn" d="M-6 -21 v7 M0 -21 v7 M6 -21 v7"/>',
    t: '<path class="kn" d="M-2 -12 h15 M-2 -5 h15"/>',
    p: '<path class="kn" d="M-2 -21 v7 M4 -21 v7"/><rect class="tb" x="-12" y="-10" width="17" height="7" rx="3.5"/>'
  };
  function handG(side) {
    var s = '<g class="hand h' + side + '">', k;
    for (k in HS) s += '<g class="v-' + k + '"><g class="ho">' + HS[k] + (k === "p" ? '<rect x="-12" y="-10" width="17" height="7" rx="3.5"/>' : "") + '</g><g class="hf">' + HS[k] + "</g>" + (KN[k] || "") + "</g>";
    return s + "</g>";
  }
  var SHOE = '<path class="sh" d="M-10 66 Q-10 58 -3 58 L5 58 Q18 59 20 69 Q20 75 13 75 L-8 75 Q-11 75 -11 71 Z"/><path class="so" d="M-11 71 L20 71"/><path class="lc" d="M2 61 l4 3 M6 60 l4 3"/>';
  function legG(side) { return '<g class="leg lg' + side + '"><path class="lgl" d="M0 0 L0 62"/>' + SHOE + "</g>"; }
  var LIMBS_BACK = '<g class="kx-legs">' + legG("L") + legG("R") + "</g>";
  var HANDS = '<g class="kx-hands">' + handG("L") + handG("R") + "</g>";

  /* ---------- Yuzdagi qo'shimchalar: burun, burun suvi, ko'z yoshi, qizarish, ter, kipriklar ---------- */
  var FACE = '<ellipse class="kx-nose" cx="160" cy="170" rx="5.5" ry="3.8"/>' +
    '<path class="kx kx-snot" d="M162 172 C160 180 159 188 163 193 C167 188 167 180 166 172 Z"/>' +
    '<circle class="kx kx-bub" cx="171" cy="178" r="9"/>' +
    '<g class="kx kx-tears"><path d="M116 164 Q104 196 100 236"/><path d="M204 164 Q216 196 220 236"/></g>' +
    '<path class="kx kx-tear1" d="M114 166 Q108 176 114 180 Q120 176 114 166 Z"/>' +
    '<g class="kx kx-joy"><circle cx="102" cy="140" r="5"/><circle cx="218" cy="140" r="5"/></g>' +
    '<g class="kx kx-blush"><ellipse cx="98" cy="178" rx="15" ry="8"/><ellipse cx="222" cy="178" rx="15" ry="8"/></g>' +
    '<path class="kx kx-sweat" d="M236 104 Q229 116 236 121 Q243 116 236 104 Z"/>' +
    '<path class="kx kx-lash" d="M115 133 L107 126 M121 129 L116 120 M128 127 L128 118 M205 133 L213 126 M199 129 L204 120 M192 127 L192 118"/>';
  // Boshdagi qo'shimchalar (yuqori nuqta 86 deb chizilgan): qiz bolaga bantik, o'g'il bolaga soch jingalagi
  var HEAD = '<path class="kx kx-hair" d="M150 90 C144 72 158 64 156 80 M160 89 C160 66 180 66 170 86"/>' +
    '<g class="kx kx-bow" transform="translate(104 96) rotate(-22)"><path d="M0 0 L-17 -11 Q-22 0 -17 11 Z M0 0 L17 -11 Q22 0 17 11 Z"/><circle r="5"/></g>';

  /* ---------- Kiyimlar: savol mavzusiga qarab ---------- */
  // top — boshga (yuqori nuqta 86), face — yuzga (ko'z/og'iz bilan birga siljiydi), body — tanaga; hat — sochni yopadimi
  var GLS = '<g fill="none" stroke="#1d2230" stroke-width="4"><circle cx="126" cy="146" r="21"/><circle cx="194" cy="146" r="21"/><path d="M147 144 Q160 136 173 144"/></g>';
  var GOG = function (fl, st) { return '<rect x="100" y="80" width="120" height="9" rx="4" fill="#334155"/><circle cx="139" cy="84" r="15" fill="' + fl + '" stroke="' + st + '" stroke-width="4"/><circle cx="181" cy="84" r="15" fill="' + fl + '" stroke="' + st + '" stroke-width="4"/><path d="M131 79 l6 -3 M173 79 l6 -3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'; };
  var BOWTIE = function (c, d) { return '<g transform="translate(160 210)"><path d="M0 0 L-16 -9 L-16 9 Z M0 0 L16 -9 L16 9 Z" fill="' + c + '" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/><circle r="4" fill="' + d + '"/></g>'; };
  var PHONES = function (c) { return '<path d="M100 150 Q100 78 160 76 Q220 78 220 150" fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round"/><rect x="88" y="128" width="20" height="34" rx="8" fill="' + c + '"/><rect x="212" y="128" width="20" height="34" rx="8" fill="' + c + '"/>'; };
  var OUT = {
    prof: { n: "Professor", hat: 1, top: '<path d="M106 70 L160 50 L214 70 L160 90 Z" fill="#1f2937"/><path d="M130 76 L130 92 Q160 102 190 92 L190 76 L160 88 Z" fill="#111827"/><path d="M160 70 L204 76 L204 100" fill="none" stroke="#facc15" stroke-width="3"/><circle cx="204" cy="104" r="5" fill="#facc15"/>', face: GLS },
    build: { n: "Quruvchi-me'mor", hat: 1, top: '<path d="M112 90 Q112 44 160 42 Q208 44 208 90 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/><path d="M160 44 L160 84" stroke="#ca8a04" stroke-width="5"/><rect x="98" y="84" width="124" height="10" rx="5" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>',
      body: '<g transform="translate(224 200)"><path d="M-14 8 A14 14 0 0 1 14 8 Z" fill="#fef9c3" stroke="#ca8a04" stroke-width="2.5"/><path d="M0 8 L0 -3 M-8 5 L-5 1 M8 5 L5 1" stroke="#ca8a04" stroke-width="1.5"/></g>' },
    lab: { n: "Fizik", hat: 1, top: GOG("#bae6fd", "#1e3a8a"), body: '<g transform="translate(222 198)" fill="none" stroke="#2563eb" stroke-width="2.5"><ellipse rx="13" ry="5"/><ellipse rx="13" ry="5" transform="rotate(60)"/><ellipse rx="13" ry="5" transform="rotate(-60)"/><circle r="2.6" fill="#2563eb"/></g>' },
    chem: { n: "Kimyogar", hat: 1, top: GOG("#bbf7d0", "#166534"), body: '<g transform="translate(222 194)"><path d="M-5 -12 L5 -12 L5 -3 L12 10 Q13 13 10 13 L-10 13 Q-13 13 -12 10 L-5 -3 Z" fill="#fff" stroke="#166534" stroke-width="2.5"/><path d="M-8.5 5 L8.5 5 L11 11 L-11 11 Z" fill="#22c55e"/></g>' },
    explorer: { n: "Tadqiqotchi", hat: 1, top: '<path d="M120 88 Q120 50 160 48 Q200 50 200 88 Z" fill="#d6b37a" stroke="#92733f" stroke-width="3"/><path d="M121 75 L199 75 L199 86 L121 86 Z" fill="#7c5a2a"/><ellipse cx="160" cy="88" rx="66" ry="10" fill="#c9a467" stroke="#92733f" stroke-width="3"/><path d="M186 73 Q199 52 215 61 Q205 74 186 73 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>' },
    doppi: { n: "Do'ppili donishmand", hat: 1, top: '<path d="M116 90 L122 58 Q160 46 198 58 L204 90 Z" fill="#111827"/><path d="M122 58 Q160 48 198 58" fill="none" stroke="#e5e7eb" stroke-width="1.5"/><path d="M116 90 L204 90" stroke="#e5e7eb" stroke-width="3"/>' +
      '<path d="M138 84 C130 76 131 64 139 61 C137 69 141 76 138 84 Z M162 84 C154 76 155 63 163 60 C161 68 165 76 162 84 Z M186 84 C178 76 179 64 187 61 C185 69 189 76 186 84 Z" fill="#f8fafc"/>' },
    brit: { n: "Ingliz janob", hat: 1, top: '<rect x="128" y="30" width="64" height="54" rx="4" fill="#111827"/><rect x="128" y="68" width="64" height="9" fill="#dc2626"/><rect x="104" y="82" width="112" height="9" rx="4.5" fill="#111827"/>', face: BOWTIE("#dc2626", "#7f1d1d") },
    ushanka: { n: "Qishki shapka", hat: 1, top: '<path d="M114 92 Q112 50 160 48 Q208 50 206 92 Z" fill="#7c4a1e"/><rect x="106" y="74" width="108" height="20" rx="10" fill="#efe4d3" stroke="#c8b49a" stroke-width="2"/><rect x="96" y="80" width="20" height="42" rx="9" fill="#efe4d3" stroke="#c8b49a" stroke-width="2"/><rect x="204" y="80" width="20" height="42" rx="9" fill="#efe4d3" stroke="#c8b49a" stroke-width="2"/>' },
    headset: { n: "Spiker", hat: 1, face: PHONES("#111827") + '<path d="M222 160 Q224 190 188 192" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/><circle cx="185" cy="192" r="6" fill="#ef4444"/>' },
    tech: { n: "Dasturchi", hat: 1, top: '<path d="M160 88 L160 56" stroke="#334155" stroke-width="5" stroke-linecap="round"/><circle class="kx-blink" cx="160" cy="51" r="8" fill="#ef4444"/>',
      face: '<path d="M102 134 L218 134 L218 142 L210 142 L210 158 L178 158 L178 146 L142 146 L142 158 L110 158 L110 142 L102 142 Z" fill="#111827"/><rect x="116" y="139" width="8" height="5" fill="#fff"/><rect x="184" y="139" width="8" height="5" fill="#fff"/>' },
    astro: { n: "Kosmonavt", hat: 1, body: '<circle cx="160" cy="150" r="122" fill="#dbeafe" fill-opacity=".16" stroke="#93c5fd" stroke-width="5"/><path d="M82 98 Q102 62 144 50" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="7" stroke-linecap="round"/>' },
    detective: { n: "Detektiv", hat: 1, top: '<path d="M116 90 Q116 50 160 48 Q204 50 204 90 Z" fill="#a16207"/><path d="M130 56 L190 88 M146 50 L204 78 M118 70 L168 96" stroke="#78350f" stroke-width="2" opacity=".7"/><path d="M100 90 Q118 100 136 88 Z M220 90 Q202 100 184 88 Z" fill="#854d0e"/><path d="M160 48 Q148 34 160 30 Q172 34 160 48" fill="#854d0e"/>',
      face: '<circle cx="194" cy="146" r="22" fill="#fff" fill-opacity=".15" stroke="#a16207" stroke-width="4"/><path d="M214 156 Q228 186 214 212" fill="none" stroke="#a16207" stroke-width="2"/>' },
    sport: { n: "Sportchi", hat: 0, top: '<rect x="104" y="92" width="112" height="13" rx="6" fill="#ef4444"/><path d="M106 98.5 L214 98.5" stroke="#fff" stroke-width="2.5"/>' },
    chef: { n: "Oshpaz", hat: 1, top: '<path d="M126 88 L126 64 Q104 60 110 40 Q118 22 140 30 Q150 12 170 22 Q190 12 200 32 Q220 34 212 56 Q206 64 194 64 L194 88 Z" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="124" y="78" width="72" height="12" rx="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>' },
    driver: { n: "Haydovchi", hat: 1, top: '<path d="M114 90 Q114 58 160 56 Q206 58 206 90 Z" fill="#1e3a8a"/><path d="M150 88 Q190 82 226 94 Q210 101 150 97 Z" fill="#1e40af"/><circle cx="160" cy="58" r="4" fill="#3b82f6"/>' },
    doctor: { n: "Xato-shifokor", hat: 0, top: '<rect x="106" y="90" width="108" height="9" rx="4.5" fill="#94a3b8"/><circle cx="160" cy="94" r="15" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/><circle cx="160" cy="94" r="5" fill="#94a3b8"/>' },
    music: { n: "Musiqachi", hat: 1, face: PHONES("#7c3aed") },
    biz: { n: "Biznesmen", hat: 0, face: BOWTIE("#1e3a8a", "#0f172a"), body: '<g transform="translate(222 196)"><circle r="13" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/><text y="5" text-anchor="middle" font-size="15" font-weight="800" fill="#a16207" font-family="sans-serif">%</text></g>' }
  };
  // Matndan fanni aniqlab, mos kiyim tanlash (eng aniq mavzular birinchi)
  var DRESS = [
    ["astro", /(sayyora|planeta|quyosh tizim|galaktika|yulduz(lar|i)?\b|kosmos|koinot|astronom|raketa|teleskop|mars\b|yupiter|saturn|орбит|космос|planet|galaxy)/],
    ["chem", /(kimyo|atom|molekula|kislota|ishqor|element|reaksiya|valentlik|oksid|\bmol\b|vodorod|kislorod|uglerod|davriy jadval|химия|chemistry)/],
    ["lab", /(fizika|\bkuch\b|tezlik|tezlanish|energiya|\btok\b|kuchlanish|qarshilik|massa|zichlik|bosim|nyuton|elektr|magnit|yorug'lik|harorat|issiqlik|to'lqin|joul|vatt|impuls|физик|physics)/],
    ["chef", /(oshpaz|taom|retsept|pishir|\bosh\b|ovqat|qandolat|pazand)/],
    ["driver", /(avtotest|haydovchi|yo'l belgi|svetofor|avtomobil|mashina|dvigatel|yo'l harakat)/],
    ["tech", /(informatika|kompyuter|dastur|python|javascript|algoritm|\bkod\b|robot|arduino|sun'iy intellekt|excel|информат|programm)/],
    ["explorer", /(biolog|hujayra|o'simlik|hayvon|organizm|\bdnk\b|genetik|evolyutsiya|fotosintez|ekolog|geograf|materik|okean|daryo|\btog'|iqlim|xarita|qit'a|vulqon|tabiat|биолог|географ)/],
    ["build", /(geometri|uchburchak|to'rtburchak|burchak|perimetr|\byuz(a|i|ini)?\b|aylana|doira|radius|diametr|parallel|perpendikulyar|\bkub\b|prizma|piramida|silindr|konus|\bshar\b|pifagor|vektor|koordinata|геометр)/],
    ["biz", /(foiz|\bpul\b|so'm\b|narx|\bbank|kredit|iqtisod|daromad|soliq|chegirma|biznes|экономик)/],
    ["doppi", /(tarix|\basr\b|imperiya|temur|sulola|xonlik|urush|qadimgi|ona tili|adabiyot|she'r|g'azal|ruboiy|navoiy|bobur|qodiriy|roman\b|hikoya|gap bo'lag|so'z turkum|konstitutsiya|huquq|qonun)/],
    ["music", /(musiqa|\bnota\b|qo'shiq|cholg'u)/],
    ["sport", /(sport|jismoniy|futbol|yugur|basketbol|voleybol)/],
    ["detective", /(mantiq|topishmoq|jumboq|sherlo|detektiv|sudoku|boshqotirma)/],
    ["ushanka", /(rus tili|ruscha|[а-яё]{4,})/],
    ["brit", /(ingliz|english|present simple|past simple|perfect|\btense|grammar|vocabulary|how do you say)/],
    ["prof", /(tenglama|kasr|ildiz|daraja|funksiya|logarifm|hosila|integral|ko'paytir|qo'sh|ayir|\bson(lar|ni|ning)?\b|misol|algebra|matemat|progressiya|trigonometr|\bsin\b|\bcos\b|tangens|\d+\s*[+\-*\/×÷^=]\s*\d+|математ|math)/]
  ];
  var MODE_OUT = { en: "brit", ielts: "headset", ru: "ushanka", math: "prof", logic: "detective", xato: "doctor", qosh: "sport" };
  var FAN_OUT = { fizika: "lab", kimyo: "chem", biologiya: "explorer", geografiya: "explorer", ekologiya: "explorer", tarix: "doppi", ona: "doppi", adabiyot: "doppi", huquq: "doppi",
    informatika: "tech", iqtisod: "biz", astronomiya: "astro", musiqa: "music" };
  function outfitFor(text, mode, fan) {
    var s = String(text || "").toLowerCase().replace(/[ʻʼ‘’`´]/g, "'"), i;
    if (s) for (i = 0; i < DRESS.length; i++) if (DRESS[i][1].test(s)) return DRESS[i][0];
    if (fan && FAN_OUT[fan]) return FAN_OUT[fan];
    return MODE_OUT[mode] || "";
  }

  /* ---------- Erkalash so'zlari (o'g'il / qiz / noma'lum) ---------- */
  var PET = {
    boy: ["akam", "ukam", "polvonim", "botirim", "chempionim", "yulduzim", "aqllivoy", "poponam", "jonim", "asalim", "qo'zichog'im", "toychog'im", "do'mbog'im", "shunqorim", "kichkina Al-Xorazmiy", "professorim",
      "qo'rqmasim", "qo'zivoy", "bahodirim", "arslonim", "o'g'lonim", "mard o'g'lonim"],
    girl: ["opajon", "singlim", "kampirim", "malikam", "gulim", "yulduzim", "asalim", "jonim", "poponam", "qo'zichog'im", "aqlli qizim", "kichkina olimam", "do'mbog'im", "chempionim", "shakarim",
      "opajonim", "oppoq qizim", "oyimqiz", "lolam", "farishtam", "kampirjonim"],
    x: ["poponam", "jonim", "asalim", "yulduzim", "do'stim", "chempionim", "aqllim", "qo'zichog'im", "ajoyib bolam", "do'mbog'im", "kichkina daho"]
  };
  // Ingliz va rus tili rejimida — o'sha tildagi erkalash so'zlari (qo'shtirnoq ichida — o'z tilidagi ovozda o'qiladi)
  var PET_EN = ["superstar", "champ", "buddy", "sweetie", "smarty", "rockstar", "my little genius"];
  var PET_RU = { boy: ["молодчина", "дружок", "чемпион", "умник", "зайчик", "солнышко", "богатырь"], girl: ["умница", "солнышко", "зайка", "красавица", "звёздочка", "принцесса"], x: ["солнышко", "умница", "дружок", "звёздочка", "чемпион"] };
  var TZ = { en: ["silly goose", "sleepyhead", "pumpkin head", "noodle brain", "little dreamer"], ru: ["тыковка", "соня", "растеряшка", "ворона", "голова садовая"] };
  function gk(sg) { return sg === "boy" || sg === "girl" ? sg : "x"; }
  function pet(sg, lang) {
    if (lang === "en") return '"' + pick(PET_EN) + '"';
    if (lang === "ru") return "«" + pick(PET_RU[gk(sg)]) + "»";
    return pick(PET[gk(sg)]);
  }
  function teaseW(lang) { return lang === "en" ? '"' + pick(TZ.en) + '"' : lang === "ru" ? "«" + pick(TZ.ru) + "»" : ""; }

  var uid = 0;
  function svg(mood, cls, o) {
    o = o || {};
    var mk = M[mood] ? mood : "neutral", m = M[mk], id = "kvg" + (++uid), fire = "", ot = OUT[o.outfit] || null, sh = m[0];
    if (m[4]) {
      fire = '<defs><linearGradient id="' + id + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".55" stop-color="#f97316"/><stop offset="1" stop-color="#facc15"/></linearGradient></defs><g class="kvf">';
      for (var i = 0; i < FL.length; i++) fire += '<path d="' + FL[i] + '" fill="url(#' + id + ')"/>';
      fire += "</g>";
    }
    var g = o.sg === "girl" || o.sg === "boy" ? o.sg : "";
    return '<svg class="kuvi kvart ' + (cls || "") + '" viewBox="0 -14 320 304" aria-hidden="true" style="--kc:' + m[1] + '" data-mo="' + mk + '" data-e="' + m[2] + '" data-a="' + actOf(mk) + '" data-o="' + (ot ? o.outfit : "") + '" data-g="' + g + '" data-hat="' + (ot && ot.hat ? 1 : 0) + '">' +
      '<g class="kvo"><g class="kvb">' + fire + LIMBS_BACK +
      '<g class="kvs">' + SHP[sh] + "</g>" + (ot && ot.body ? '<g class="kvbadge">' + ot.body + "</g>" : "") +
      '<g transform="translate(0 ' + (TOP[sh] - 86) + ')">' + HEAD + (ot && ot.top ? ot.top : "") + "</g>" +
      '<g class="kve" transform="translate(0 ' + DY[sh] + ')">' + EYES[m[2]] + MOUTH[m[3]] + "</g>" +
      '<g class="kvx" transform="translate(0 ' + DY[sh] + ')">' + FACE + (ot && ot.face ? ot.face : "") + "</g>" +
      HANDS + "</g></g></svg>";
  }
  var FL = ["M88 100 C70 88 70 62 84 40 C86 58 96 60 100 50 C108 68 104 90 88 100Z", "M122 96 C102 82 104 50 122 24 C124 46 136 50 140 36 C150 60 142 86 122 96Z",
    "M160 94 C138 78 140 40 160 10 C164 34 176 38 180 24 C190 52 182 82 160 94Z", "M198 96 C178 86 180 56 196 30 C200 50 212 52 216 40 C224 64 216 88 198 96Z",
    "M232 100 C216 92 216 70 228 48 C232 62 240 64 244 56 C250 74 246 94 232 100Z"];

  var L = {
    ok: ["Barakalla!", "Zo'r, aynan shunday!", "Ofarin, miyang charxlangan!", "Qoyil, to'ppa-to'g'ri!", "Ana, ko'rdingmi, uddalading!", "Super! Shunday davom et!",
      "Ajoyib, {p}!", "Barakalla, {p}!", "Qoyil-e, {p}! To'ppa-to'g'ri!", "Ofarin, {p}, aqlingga qoyil!", "Voy, {p}, zo'rsan-ku!"],
    streak: ["Ketma-ket {n} ta! Yonib ketyapsan!", "{n} ta ketma-ket — bugun sen yulduzsan!", "Voy-voy, {n} ta ketma-ket! Hech kim to'xtata olmaydi!", "Ha-ha-ha! {n} ta ketma-ket, {p}! Kulgim to'xtamayapti!"],
    bad: ["Afsus, bu safar xato. Keyingisida albatta topasan!", "Hmm, unchalik emas. Yechimga bir qara-chi.", "Xato, lekin xatodan o'rganamiz!", "Bu safar o'xshamadi. Yechimni o'qib ol!",
      "Xafa bo'lma, {p}, keyingisini topasan!"],
    cry: ["Uhu-uhu... yig'lab yubordim-ku! Burnim ham oqib ketdi. Yechimga qara, {p}!", "Voy-voy, ko'z yoshlarim to'kildi! Mayli, keyingisini birga topamiz, {p}."],
    tease: ["Voy qovoq kalla-ey!", "Ey oshqovoq, shuni ham bilmaysanmi?", "Qovunjon, bir o'ylab ko'r-chi!", "Hay qovoq kallajonim...", "Oshqovoqcha, bunisi oson-ku!",
      "Voy qovun-ey, shunga ham-a?", "Ey xumpar, qayoqqa qarayapsan?", "Voy eshakvoy-ey!", "Voy poponam-ey, shuni ham bilmaysanmi?", "Tarvuz kalla, bunisi oson-ku!", "Xumparvoy, miyangni ishlat-chi!"],
    timeout: ["Vaqt tugadi-ku! Keyingisida tezroq bo'l.", "Soatga qara, do'stim! Ulgurmay qolding."],
    timeoutT: ["Voy uyquchi-ey, vaqt tugadi-ku!", "Poponam, tezroq bo'l-da!", "Xumpar, soatga qara!", "Qovoq kalla, uxlab qoldingmi?"],
    cGood: ["Barakalla, sinf! Deyarli hamma topdi!", "Zo'r sinf! Ofarin hammangizga!", "Qoyil! Bu sinf — chempionlar sinfi!", "Ha-ha! Ajoyib, poponlarim! Deyarli hammangiz topdingiz!"],
    cMid: ["Yomon emas! Lekin yarmingiz yana o'ylab ko'ring.", "Yarmingiz topdi — keyingisida hammangiz topasiz!", "Hmm, o'rtacha. Yechimga diqqat bilan qarang!"],
    cBad: ["Bu savol qiyin bo'ldi. Keling, yechimini birga ko'ramiz.", "Ko'pchilik topa olmadi. Yechimga diqqat qiling!", "Uhu-uhu, ko'pchilik topmadi, yig'lab yuboraman-ku! Yechimni birga ko'ramiz."],
    cBadT: ["Voy, butun sinf qovoq kalla bo'lib qoldimi?! Mayli, yechimni birga ko'ramiz.", "Eshakvoylarim-ey, shunga ham-a? Yechimga qaranglar!", "Oshqovoqlarim-ey, qani, yechimni o'qiylik!", "Xumparlar-ey, uyg'oninglar! Yechimga qarang."]
  };
  /* Qiz va o'g'il bolalarga alohida — mehrli hazil va pand-nasihat bilan (o'quvchi o'zi belgilagan jinsi bo'yicha) */
  var LG = {
    boy: {
      ok: ["Barakalla, qo'rqmasim! Mard o'g'lon shunday bo'ladi!", "Ofarin, qo'zivoy! Aqlingga qoyil!", "Qoyil-e, bahodirim! To'ppa-to'g'ri!", "Zo'r, arslonim! Shu zayilda davom et!", "Ana, o'g'lonim, uddalading-ku!"],
      tease: ["Voy tentakvoy-ey!", "Hoy qo'zivoy, qayoqqa qarayapsan?", "Qo'rqmasim-ey, bu safar shoshib qolding-ku!", "Voy tentakvoyim-ey, shunga ham-a?", "Bahodirim, bir o'ylab ko'r-chi!", "Hoy polvon, kuchni miyaga ber-chi!"],
      timeout: ["Hoy qo'zivoy, uxlab qoldingmi? Vaqt tugadi-ku!", "Tentakvoy, soatga qara-da!", "Qo'rqmasim, mard yigit vaqtni boy bermaydi!"]
    },
    girl: {
      ok: ["Barakalla, opajonim! Aqlli qiz shunday bo'ladi!", "Voy kampirim-ey, aqlingga qoyil!", "Ofarin, oppoq qizim! To'ppa-to'g'ri!", "Qoyil, malikam! Shu zayilda davom et!", "Ana, oyimqiz, uddalading-ku!"],
      tease: ["Voy kampirim-ey!", "Opajonim-ey, bu safar shoshib qolding-ku!", "Voy oyimqiz-ey, shunga ham-a?", "Kampirjonim, bir o'ylab ko'r-chi!", "Malikam-ey, xayoling qayoqda?", "Voy oppoq qizim-ey, bunisi oson-ku!"],
      timeout: ["Voy kampirim-ey, vaqt tugadi-ku!", "Opajonim, soatga qara-da!", "Oyimqiz, chaqqon bo'lish ham bir hunar!"]
    }
  };
  // pand-nasihat: xato yoki vaqt tugaganda — mehr bilan maslahat
  var NAS = ["Sabr tagi — sariq oltin, shoshmasdan o'qi.", "Bilmaganni so'rab o'rgangan — olim, uyalib so'ramagan — o'ziga zolim.", "Yiqilgan kurashga to'ymas — keyingisini albatta topasan!",
    "Xatodan qo'rqma, xatodan o'rgan.", "O'qigan o'zar, o'qimagan to'zar.", "Ilm — aql chirog'i, yechimni diqqat bilan o'qi.", "Shoshgan ish — chala ish, avval savolni oxirigacha o'qi.",
    "Mehnatning tagi — rohat, yana bir urinib ko'r.", "Bilim — bitmas boylik, yechimni daftaringga yozib ol.", "Ming eshitgandan bir ko'rgan yaxshi — yechimga bir qara."];
  function tease() { try { var c = JSON.parse(localStorage.getItem("ka.ustoz.cfg") || "{}"); return c.tease !== false; } catch (e) { return true; } }
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); };
  function react(kind, o) {
    o = o || {}; var tz = o.tz == null ? tease() : !!o.tz, n = o.n | 0, t, mood, G = LG[o.sg] || null;
    if (kind === "ok") {
      if (n >= 5 && Math.random() < .5) { t = L.streak[3]; mood = "laugh"; }
      else if (n >= 3) { t = pick(L.streak.slice(0, 3)); mood = "love"; }
      else { t = G && Math.random() < .55 ? pick(G.ok) : pick(L.ok); mood = Math.random() < .2 ? "wink" : "happy"; }
    }
    else if (kind === "bad") {
      if (G) { // qiz yoki o'g'il — mehrli hazil (sozlama yoqiq bo'lsa) + pand-nasihat
        if (tz && Math.random() < .7) { t = pick(G.tease) + " " + pick(NAS); mood = Math.random() < .5 ? "jealous" : "strict"; }
        else if (Math.random() < .25) { t = pick(L.cry); mood = "cry"; }
        else { t = pick(L.bad) + " " + pick(NAS); mood = "sad"; }
      }
      else if (tz && Math.random() < .6) { t = pick(L.tease) + " " + pick(L.bad); mood = Math.random() < .5 ? "jealous" : "strict"; }
      else if (Math.random() < .3) { t = pick(L.cry); mood = "cry"; }
      else { t = pick(L.bad); mood = "sad"; }
    }
    else if (kind === "timeout") { t = G ? pick(tz ? G.timeout : L.timeout) + " " + pick(NAS) : pick(tz ? L.timeoutT : L.timeout); mood = Math.random() < .3 ? "sleepy" : "wow"; }
    else if (kind === "cGood") { t = pick(L.cGood); mood = Math.random() < .35 ? "laugh" : Math.random() < .5 ? "love" : "happy"; }
    else if (kind === "cMid") { t = pick(L.cMid); mood = "think"; }
    else { t = pick(tz ? L.cBadT : L.cBad); mood = tz ? "jealous" : /Uhu/.test(t) ? "cry" : "strict"; }
    if (kind === "cBad" || kind === "cMid") t += " " + pick(NAS); // butun sinfga ham pand-nasihat
    t = t.replace(/\{n\}/g, n).replace(/\{p\}/g, pet(o.sg));
    return { mood: mood, text: t, html: '<div class="kvr kvr-' + mood + '">' + svg(mood, "", { outfit: o.outfit, sg: o.sg }) + '<div class="kvq">' + esc(t) + "</div></div>" };
  }

  /* ---------- Umumiy CSS: qo'l-oyoq imo-ishoralari, yuz qo'shimchalari, kiyimlar ---------- */
  // [x, y, burchak, qo'l shakli] — R o'ng qo'l, L chap qo'l (chap qo'l ko'zguda aks ettiriladi)
  var POSE = {
    idle: { R: [[288, 198, 16], [286, 194, 8]], L: [[32, 198, -16], [34, 194, -8]], d: 1.6 },
    wave: { R: [[280, 110, -26], [280, 110, 22]], d: .36 },
    clap: { R: [[174, 240, -84], [194, 236, -70]], L: [[146, 240, 84], [126, 236, 70]], d: .22 },
    thumb: { R: [[276, 146, -6, "t"], [276, 138, 4, "t"]], d: .45 },
    hug: { R: [[188, 228, -104], [184, 224, -96]], L: [[132, 228, 104], [136, 224, 96]], d: .9 },
    scratch: { R: [[228, 72, -32], [232, 64, -20]], L: [[150, 226, -6, "f"]], d: .2 },
    wag: { R: [[266, 128, -14, "p"], [266, 128, 14, "p"]], L: [[40, 214, -10, "f"]], d: .24 },
    fists: { R: [[280, 186, 8, "f"], [284, 180, 14, "f"]], L: [[40, 186, -8, "f"], [36, 180, -14, "f"]], d: .12 },
    droop: { R: [[272, 250, 32], [268, 252, 26]], L: [[48, 250, -32], [52, 252, -26]], d: 1.4 },
    cheeks: { R: [[228, 176, -24], [230, 172, -16]], L: [[92, 176, 24], [90, 172, 16]], d: .5 },
    ear: { R: [[294, 134, -58], [292, 132, -50]], d: .8 },
    belly: { R: [[200, 244, -70], [202, 238, -64]], L: [[120, 244, 70], [118, 238, 64]], d: .16 },
    wipe: { R: [[196, 164, -44], [184, 158, -30]], L: [[124, 164, 44], [136, 158, 30]], d: .3 },
    cover: { R: [[176, 200, -32], [174, 196, -26]], L: [[144, 200, 32], [146, 196, 26]], d: .8 },
    yawn: { R: [[170, 200, -60], [172, 196, -54]], L: [[34, 208, -10]], d: 1.2 },
    explain: { R: [[284, 172, -30], [272, 148, 8]], L: [[36, 182, 20], [46, 166, -4]], d: .7 },
    point: { R: [[276, 120, -2, "p"], [276, 112, 4, "p"]], d: .5 },
    sneeze: { R: [[176, 176, -40], [178, 172, -36]], L: [[144, 176, 40], [142, 172, 36]], d: .15 },
    stretch: { R: [[262, 60, -10], [266, 52, 6]], L: [[58, 60, 10], [54, 52, -6]], d: .9 }
  };
  // Oyoqlar: [[chap1, chap2], [o'ng1, o'ng2], soniya] — ikki holat orasida tebranadi (musbat burchak — chap oyoq tashqariga)
  var LEGP = {
    idle: [[0, 0], [0, 0], 2], clap: [[0, 18], [-18, 0], .3], thumb: [[0, 0], [0, -14], .4], hug: [[-6, -6], [6, 6], 1], belly: [[0, 24], [-24, 0], .2],
    wipe: [[-10, 34], [-34, 10], .17], fists: [[-6, 6], [6, -6], .12], wag: [[0, 0], [0, -14], .3], droop: [[-8, -8], [8, 8], 2], cheeks: [[18, 18], [-18, -18], 2],
    ear: [[0, 0], [0, -12], .5], cover: [[-10, -14], [10, 14], 1.2], scratch: [[0, 10], [-10, 0], .8], yawn: [[0, 0], [0, 0], 2], explain: [[0, 6], [-6, 0], .7],
    stretch: [[6, 6], [-6, -6], 1], sneeze: [[-10, 10], [10, -10], .2], wave: [[0, 0], [0, -10], .4], point: [[0, 0], [0, -10], .5]
  };
  function tf(p, mir) { return "translate(" + p[0] + "px," + p[1] + "px) rotate(" + p[2] + "deg)" + (mir ? " scale(-1,1)" : ""); }
  function poseCss() {
    var s = "", k, side, P, sel, j;
    for (k in POSE) for (side in { R: 1, L: 1 }) {
      P = POSE[k][side]; if (!P) continue;
      sel = k === "idle" ? ".kvart .h" + side : ".kvart[data-a=" + k + "] .h" + side;
      var mir = side === "L";
      if (P.length > 1) s += sel + "{transform:" + tf(P[0], mir) + ";animation:kva-" + k + side + " " + POSE[k].d + "s ease-in-out infinite alternate}" +
        "@keyframes kva-" + k + side + "{from{transform:" + tf(P[0], mir) + "}to{transform:" + tf(P[1], mir) + "}}";
      else s += sel + "{transform:" + tf(P[0], mir) + ";animation:none}";
      var v = P[0][3];
      if (v) s += ".kvart[data-a=" + k + "] .h" + side + ">.v-o{display:none}.kvart[data-a=" + k + "] .h" + side + ">.v-" + v + "{display:inline}";
    }
    for (k in LEGP) {
      var a = LEGP[k], kl = k === "idle" ? ".kvart" : ".kvart[data-a=" + k + "]";
      for (j = 0; j < 2; j++) {
        side = j ? "R" : "L";
        var x = j ? 186 : 134, A = a[j], m = !j ? " scale(-1,1)" : "";
        var t0 = "translate(" + x + "px,205px) rotate(" + A[0] + "deg)" + m, t1 = "translate(" + x + "px,205px) rotate(" + A[1] + "deg)" + m;
        s += kl + " .lg" + side + "{transform:" + t0 + (A[0] === A[1] ? ";animation:none}" : ";animation:kvl-" + k + side + " " + a[2] + "s ease-in-out infinite alternate}" +
          "@keyframes kvl-" + k + side + "{from{transform:" + t0 + "}to{transform:" + t1 + "}}");
      }
    }
    return s;
  }
  function outCss() {
    var s = "", k;
    for (k in OUT) s += ".kvart[data-o=" + k + "] .o-" + k + "{display:inline}";
    var E = ["normal", "wide", "sad", "wow", "think", "shy"];
    for (k = 0; k < E.length; k++) s += ".kvart[data-g=girl][data-e=" + E[k] + "] .kx-lash{display:inline}";
    return s;
  }
  var ARTCSS = ".kvart .kx{display:none}" +
    ".kvart .hand,.kvart .leg{transform-box:view-box;transform-origin:0 0}" +
    ".kvart .hand>g{display:none}.kvart .hand>.v-o{display:inline}" +
    ".kvart .ho *{fill:var(--kc);stroke:var(--kc);stroke-width:7;stroke-linejoin:round}.kvart .hf *{fill:var(--kvfill,#fff);stroke:none}" +
    ".kvart .hand .kn{fill:none;stroke:var(--kc);stroke-width:1.6;stroke-linecap:round;opacity:.55}.kvart .hand .tb{fill:var(--kvfill,#fff);stroke:var(--kc);stroke-width:2}" +
    ".kvart .lgl{fill:none;stroke:var(--kc);stroke-width:9;stroke-linecap:round}.kvart .sh{fill:var(--kvshoe,#334155);stroke:var(--kc);stroke-width:2.5}" +
    ".kvart .so{stroke:#fff;stroke-width:2.6}.kvart .lc{stroke:#fff;stroke-width:1.8;stroke-linecap:round}" +
    ".kvart .kx-nose{fill:var(--kveye,#1d2230);opacity:.8}" +
    ".kvart .kx-snot{fill:#bae6fd;stroke:#38bdf8;stroke-width:1.5;transform-box:fill-box;transform-origin:50% 0;animation:kxsnot 2.2s ease-in-out infinite}" +
    ".kvart .kx-bub{fill:rgba(186,230,253,.55);stroke:#7dd3fc;stroke-width:1.6;transform-box:fill-box;transform-origin:20% 30%;animation:kxbub 2.8s ease-in infinite}" +
    ".kvart .kx-tears path{fill:none;stroke:#60a5fa;stroke-width:8;stroke-linecap:round;stroke-dasharray:12 9;animation:kxflow .45s linear infinite;opacity:.9}" +
    ".kvart .kx-tear1{fill:#93c5fd;stroke:#3b82f6;stroke-width:1.5;animation:kxdrop 2.4s ease-in infinite}" +
    ".kvart .kx-joy circle{fill:#93c5fd;animation:kxjoy .55s ease-out infinite alternate}" +
    ".kvart .kx-blush ellipse{fill:#fb7185;opacity:.5}.kvart .kx-blush{animation:kxblush 2.4s ease-in-out infinite}" +
    ".kvart .kx-sweat{fill:#7dd3fc;stroke:#0ea5e9;stroke-width:1.5;animation:kxdrop 2s ease-in infinite}" +
    ".kvart .kx-lash{fill:none;stroke:var(--kveye,#1d2230);stroke-width:3.6;stroke-linecap:round}" +
    ".kvart .kx-hair{fill:none;stroke:var(--kveye,#1d2230);stroke-width:5;stroke-linecap:round}" +
    ".kvart .kx-bow path{fill:#ec4899;stroke:#be185d;stroke-width:2.5;stroke-linejoin:round}.kvart .kx-bow circle{fill:#be185d}" +
    ".kvart .kx-blink{animation:kxbl 1s steps(2) infinite}" +
    ".kvart[data-mo=cry] .kx-tears,.kvart[data-mo=cry] .kx-snot,.kvart[data-mo=sad] .kx-tear1,.kvart[data-mo=sad] .kx-bub,.kvart[data-mo=sleepy] .kx-bub," +
    ".kvart[data-mo=shy] .kx-blush,.kvart[data-mo=love] .kx-blush,.kvart[data-mo=laugh] .kx-blush,.kvart[data-mo=wink] .kx-blush,.kvart[data-mo=happy] .kx-blush," +
    ".kvart[data-mo=laugh] .kx-joy,.kvart[data-mo=think] .kx-sweat,.kvart.deep .kx-sweat,.kvart[data-a=sneeze] .kx-bub,.kvart[data-g=girl] .kx-bow,.kvart[data-g=boy][data-hat=\"0\"] .kx-hair{display:inline}" +
    ".kvart[data-mo=happy] .kx-blush{opacity:.45}.kvart[data-mo=shy] .kx-blush ellipse{opacity:.75}" +
    "@keyframes kxflow{to{stroke-dashoffset:-21}}" +
    "@keyframes kxsnot{0%,100%{transform:scaleY(.35)}55%{transform:scaleY(1.25)}70%{transform:scaleY(1.05)}}" +
    "@keyframes kxbub{0%{transform:scale(.1);opacity:.9}78%{transform:scale(1.25);opacity:.9}84%{transform:scale(1.45);opacity:0}100%{transform:scale(.1);opacity:0}}" +
    "@keyframes kxdrop{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(44px);opacity:0}}" +
    "@keyframes kxjoy{from{transform:translateY(0)}to{transform:translateY(-6px)}}" +
    "@keyframes kxblush{50%{opacity:.6}}@keyframes kxbl{50%{opacity:.25}}" +
    ".kvart .kvtop,.kvart .accg{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}" +
    "@media (prefers-reduced-motion:reduce){.kvart *{animation:none!important}}";

  // AI ustoz sahifasidagi katta Kuvi uchun bo'laklar
  var art = {
    legs: LIMBS_BACK, hands: HANDS, face: FACE, head: HEAD, eyes: EYES, mouth: MOUTH, top: TOP, act: ACT, actOf: actOf, out: OUT, moods: M,
    outTop: function (k) { var o = OUT[k]; return o && o.top ? '<g class="kx o-' + k + '">' + o.top + "</g>" : ""; },
    outFace: function (k) { var o = OUT[k]; return o && o.face ? '<g class="kx o-' + k + '">' + o.face + "</g>" : ""; },
    outBody: function (k) { var o = OUT[k]; return o && o.body ? '<g class="kx o-' + k + '">' + o.body + "</g>" : ""; }
  };

  /* ---------- Ovoz: kayfiyatga mos ohang va jins (odatda muloyim ayol, jahli chiqqanda erkak) ---------- */
  // r — tezlik, p — ohang balandligi, g — f (ayol) / m (erkak)
  var PROS = { neutral: { r: 1.04, p: 1.1, g: "f" }, happy: { r: 1.12, p: 1.22, g: "f" }, love: { r: .98, p: 1.16, g: "f" }, think: { r: .98, p: 1.04, g: "f" },
    strict: { r: 1.04, p: .78, g: "m" }, jealous: { r: 1.1, p: .7, g: "m" }, sad: { r: .92, p: .92, g: "f" }, wow: { r: 1.1, p: 1.32, g: "f" }, listen: { r: 1.04, p: 1.1, g: "f" },
    laugh: { r: 1.14, p: 1.26, g: "f" }, cry: { r: .9, p: 1.02, g: "f" }, shy: { r: .96, p: 1.2, g: "f" }, wink: { r: 1.08, p: 1.18, g: "f" }, sleepy: { r: .84, p: .92, g: "f" } };
  var FEM = /(zira|irina|madina|svetlana|dariya|aria|jenny|michelle|samantha|karen|victoria|anna|elena|ekaterina|milena|yelda|emel|filiz|seda|natasha|hazel|susan|libby|sonia|\bava\b|emma|tatyana|alena|aigul|aylin|google us english|google русский|google türkçe)/i;
  var MAL = /(david|mark|pavel|sardor|dmitry|\bguy\b|ryan|davis|tony|ahmet|yuri|maxim|\balex\b|daniel|fred|thomas|george|james|andrew|brian|christopher|eric|roger|tolga|daulet|google uk english male)/i;
  function gOf(v) { var n = v && v.name || ""; if (/female|woman/i.test(n)) return "f"; if (/\bmale\b|\bman\b/i.test(n)) return "m"; if (FEM.test(n)) return "f"; if (MAL.test(n)) return "m"; return "?"; }
  function voices() { try { return window.speechSynthesis ? speechSynthesis.getVoices() || [] : []; } catch (e) { return []; } }
  // l: "uz" | "en" | "ru" | "tr"; g: "f" | "m" | "" — tabiiyroq (Natural/Online/Google) va kerakli jinsdagi ovozni tanlaydi
  function voice(l, g) {
    var c = voices().filter(function (v) { return String(v.lang || "").toLowerCase().replace("_", "-").indexOf(l) === 0; });
    if (!c.length) return null;
    function sc(v) { var n = v.name || "", s = 0, vg = gOf(v); if (/natural|neural|online/i.test(n)) s += 6; if (/google/i.test(n)) s += 3; if (/premium|enhanced/i.test(n)) s += 3; if (l === "en" && /en-us/i.test(v.lang)) s += 1; if (g) s += vg === g ? 5 : vg === "?" ? 1 : 0; return s; }
    c.sort(function (a, b) { return sc(b) - sc(a); });
    return c[0];
  }
  function pros(mood, pref) { var p = PROS[mood] || PROS.neutral, g = pref === "f" || pref === "m" ? pref : p.g, pt = p.p; if (pref === "f" && pt < .9) pt = .9; if (pref === "m" && pt > 1.05) pt = 1 + (pt - 1) * .4; return { r: p.r, p: pt, g: g }; }
  function toTr(t) { return t.replace(/([Oo])['ʻʼ‘’`]/g, "$1").replace(/([Gg])['ʻʼ‘’`]/g, "$1").replace(/sh/g, "ş").replace(/S[hH]/g, "Ş").replace(/ch/g, "ç").replace(/C[hH]/g, "Ç").replace(/q/g, "k").replace(/Q/g, "K").replace(/x/g, "h").replace(/X/g, "H").replace(/j/g, "c").replace(/J/g, "C").replace(/['ʻʼ‘’`]/g, ""); }
  function toCyr(t) {
    var s = String(t).toLowerCase().replace(/[ʻʼ‘’`]/g, "'"), R = [[/o'/g, "у"], [/g'/g, "г"], [/sh/g, "ш"], [/ch/g, "ч"], [/\bye/g, "е"], [/ya/g, "я"], [/yo/g, "ё"], [/yu/g, "ю"], [/\be/g, "э"]], i;
    for (i = 0; i < R.length; i++) s = s.replace(R[i][0], R[i][1]);
    var A = { a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "х", i: "и", j: "дж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "к", r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", c: "к", w: "в", "'": "" };
    return s.replace(/[a-z']/g, function (c) { return A[c] != null ? A[c] : c; });
  }
  // O'quvchi ismidan jinsini taxmin qilish (sozlamada qo'lda tanlash ham mumkin)
  var GIRL = /^(nilufar|mohinur|gulnoz|sevinch|shahlo|oydin|zuxro|zuhro|nigor|dildor|malak|sabo|mehrangiz|ruxsor|nargiz|shirin|oygul|guli|mohigul|marhabo|muattar|hilola|lobar|dilrabo|go'zal|gozal|munis|ra'no|rano|zilola)$/;
  var BOYA = /^(musa|hamza|isa|mustafa|yahya|ota|zakariya|murtaza|mirza)$/;
  function nameG(full) {
    var w = String(full || "").trim().toLowerCase().replace(/[ʻʼ‘’`]/g, "'").split(/\s+/), n = w.length > 1 && /(ov|ev|ova|eva|yev|yeva|iy)$/.test(w[0]) ? w[1] : w[0];
    n = String(n || "").replace(/jon$/, ""); if (n.length < 2) return "";
    if (GIRL.test(n)) return "girl"; if (BOYA.test(n)) return "boy";
    if (/(a|oy|gul|niso|bonu|bibi|lo|noz|xol)$/.test(n) || /[аяе]$/.test(n)) return "girl";
    return "boy";
  }
  // Qiz bolaga — erkak ovozi, o'g'il bolaga — ayol ovozi (jahli chiqqanda — erkak); noma'lum bo'lsa kayfiyatga qarab
  function voiceFor(mood, sg) {
    var c = {}; try { c = JSON.parse(localStorage.getItem("ka.ustoz.cfg") || "{}") || {}; } catch (e) {}
    if (c.vg === "f" || c.vg === "m") return c.vg;
    if (sg === "girl") return "m";
    if (sg === "boy") return mood === "strict" || mood === "jealous" ? "m" : "f";
    return (PROS[mood] || PROS.neutral).g;
  }
  function vsrc() { try { return (JSON.parse(localStorage.getItem("ka.ustoz.cfg") || "{}") || {}).vsrc || "auto"; } catch (e) { return "auto"; } }
  // O'zbekcha matnni kayfiyatga mos ovozda o'qiydi: qurilmada o'zbek ovozi bo'lmasa — Gemini bulut ovozi (ka-ai.js),
  // u ham bo'lmasa — turkcha yoki ruscha qurilma ovozi bilan
  var lastCancel = 0;
  function say(text, mood, pref, onend) {
    if (!text) { if (onend) onend(); return; }
    var src = vsrc(), sy = window.speechSynthesis, pr0 = pros(mood, pref);
    // gap to'liq Kuvi ovoz kutubxonasida bo'lsa — Azure'siz, saytning o'zidan (limit va internet tezligiga bog'liq emas)
    var clean = String(text).replace(/[«»]/g, ""), libAll = false;
    try { libAll = !!(window.kaAI && kaAI.libReady && kaAI.libReady()) && kaAI.libSplit(clean, pr0.g).every(function (x) { return !!x.url; }); } catch (e) {}
    if (window.kaAI && src !== "device" && (libAll || (kaAI.usable() && (src === "cloud" || !voice("uz", pr0.g))))) {
      try { if (sy) sy.cancel(); } catch (e) {}
      kaAI.speak(clean, mood, pr0.g).then(function () { if (onend) onend(); }, function () { deviceSay(text, mood, pref, onend); });
      return;
    }
    deviceSay(text, mood, pref, onend);
  }
  function deviceSay(text, mood, pref, onend) {
    var sy = window.speechSynthesis; if (!sy || !text) { if (onend) onend(); return; }
    var pr = pros(mood, pref), t = String(text).replace(/[«»“”"]/g, ""), v = voice("uz", pr.g);
    if (!v) { v = voice("tr", pr.g); if (v) t = toTr(t); else { v = voice("ru", pr.g); if (v) t = toCyr(t); } }
    try {
      var u = new SpeechSynthesisUtterance(t);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "uz-UZ";
      u.rate = pr.r; u.pitch = pr.p; u.volume = 1;
      if (onend) { u.onend = onend; u.onerror = onend; }
      sy.cancel(); lastCancel = Date.now();
      setTimeout(function () { try { if (sy.resume) sy.resume(); sy.speak(u); } catch (e) {} }, 90);
    } catch (e) { if (onend) onend(); }
  }

  var css = ".kuvi{display:block;width:120px;height:auto;overflow:visible}" +
    ".kuvi .kvs *{fill:#fff;stroke:var(--kc);stroke-width:15;stroke-linejoin:round}" +
    ".kuvi .kve *{fill:#1d2230}.kuvi .kve .ln{fill:none;stroke:#1d2230;stroke-width:9;stroke-linecap:round}.kuvi .kve .hl{fill:#fff}.kuvi .kve .tg{fill:#f87171}" +
    ".kuvi .kvo{animation:kvbob 3s ease-in-out .5s infinite}" +
    ".kuvi .kvb{transform-origin:160px 150px;animation:kvpop .55s cubic-bezier(.34,1.56,.64,1) both;filter:drop-shadow(0 0 12px var(--kc))}" +
    ".kuvi .kvf path{transform-box:fill-box;transform-origin:50% 100%;animation:kvfl .5s ease-in-out infinite alternate}" +
    ".kuvi .kvf path:nth-child(2n){animation-duration:.42s;animation-delay:-.2s}" +
    "@keyframes kvbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}" +
    "@keyframes kvpop{from{transform:scale(.3) rotate(-25deg);opacity:0}to{transform:none;opacity:1}}" +
    "@keyframes kvfl{from{transform:scaleY(.86) skewX(-4deg)}to{transform:scaleY(1.12) skewX(5deg)}}" +
    ".kvr{display:flex;flex-direction:column;align-items:center;gap:8px;margin:0 auto 4px}" +
    ".kvq{position:relative;background:#fff;color:#1d2230;font-weight:700;font-size:15px;line-height:1.35;padding:9px 14px;border-radius:16px;max-width:300px;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.25)}" +
    ".kvq:before{content:'';position:absolute;left:50%;top:-7px;margin-left:-7px;border:7px solid transparent;border-top:0;border-bottom-color:#fff}" +
    "@media (prefers-reduced-motion:reduce){.kuvi .kvo,.kuvi .kvb,.kuvi .kvf path{animation:none}}" + ARTCSS + poseCss() + outCss();
  try { var st = document.createElement("style"); st.id = "ka-kuvi-css"; st.appendChild(document.createTextNode(css)); (document.head || document.documentElement).appendChild(st); } catch (e) {}

  window.kaYuz = { svg: svg, react: react, tease: tease, lines: L, glines: LG, nasihat: NAS, moods: M, art: art, outfitFor: outfitFor, pet: pet, teaseW: teaseW, actOf: actOf, voice: voice, pros: pros, say: say, gender: gOf, nameG: nameG, voiceFor: voiceFor, stop: function () { try { if (window.kaAI) kaAI.stop(); if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} } };
})();
