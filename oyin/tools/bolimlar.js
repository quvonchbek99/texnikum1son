#!/usr/bin/env node
/* Bo'limlar → viktorina: ka-bolimlar.js MANIFEST idagi har bo'lim data fayllarini o'qib, INDEX ni yangilaydi.
 * Ishga tushirish: node tools/bolimlar.js   (GitHub Actions «Bo'limlar → viktorina» ham har push'da o'zi bajaradi)
 * Tekshiradi: mavzu ID lar takrorlanmasin va boshqa fanlar (ka-mavzular.js) ID lari bilan to'qnashmasin. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), FILE = path.join(ROOT, "ka-bolimlar.js");
let src = fs.readFileSync(FILE, "utf8");

// ka-bolimlar.js ning o'zini ishga tushirib, MANIFEST va conv/count ni olamiz
function run(code, ctx) { vm.runInContext(code, ctx, { timeout: 20000 }); }
const kb = { document: { currentScript: null, createElement() { return {}; }, head: { appendChild() {} } }, Promise, setTimeout };
kb.window = kb; vm.createContext(kb); run(src, kb);
const API = kb.KA_BOLIM;

// boshqa fanlarning ID lari (to'qnashuv bo'lmasin)
const taken = new Set();
try {
  const mz = fs.readFileSync(path.join(ROOT, "ka-mavzular.js"), "utf8").match(/var DATA = (\{[\s\S]*?\});\n/);
  if (mz) JSON.parse(mz[1]).t.forEach(t => taken.add(t[0]));
} catch (e) { console.warn("ka-mavzular.js o'qilmadi:", e.message); }

const index = {}, seen = new Map(); let bad = 0;
for (const m of API.MANIFEST) {
  if (!/^[a-z]+$/.test(m.k)) { console.error(`✖ ${m.k}: fan kaliti faqat kichik lotin harflaridan bo'lsin`); bad++; continue; }
  const ctx = { Math, JSON, Date, console: { log() {}, warn() {} } }; ctx.window = ctx; vm.createContext(ctx);
  for (const f of m.f) {
    const fp = path.join(ROOT, f);
    if (!fs.existsSync(fp)) { console.error(`✖ ${m.k}: ${f} topilmadi`); bad++; continue; }
    run(fs.readFileSync(fp, "utf8"), ctx);
  }
  const list = [];
  for (const it of ctx[m.g] || []) {
    const id = m.p + it.id, n = API.count(m, it);
    if (!/^[a-z0-9]+$/i.test(id)) { console.error(`✖ ${m.k}: «${id}» — ID da faqat harf va raqam bo'lsin`); bad++; continue; }
    if (!n) continue;
    if (taken.has(id)) { console.error(`✖ ${m.k}: «${id}» boshqa fanda bor — prefiksni (p) o'zgartiring`); bad++; continue; }
    if (seen.has(id)) { console.error(`✖ ${m.k}: «${id}» ${seen.get(id)} bilan takrorlanadi`); bad++; continue; }
    seen.set(id, m.k);
    const short = m.nom.replace(/^\S+\s/, "");
    list.push([id, `${short} · ${it.n ? it.n + " " : ""}${it.t}`.replace(/\s+/g, " ").trim(), n]);
  }
  index[m.k] = list;
  console.log(`✔ ${m.nom}: ${list.length} mavzu, ${list.reduce((s, t) => s + t[2], 0)} savol`);
}
if (bad) { console.error(`${bad} ta xato — INDEX yozilmadi`); process.exit(1); }

const body = "{\n" + Object.keys(index).map(k => `    ${JSON.stringify(k)}: [\n` + index[k].map(t => "      " + JSON.stringify(t)).join(",\n") + "\n    ]").join(",\n") + "\n  }";
const next = src.replace(/\/\*INDEX\*\/[\s\S]*?\/\*INDEX-END\*\//, "/*INDEX*/" + body + "/*INDEX-END*/");
if (next !== src) { fs.writeFileSync(FILE, next); console.log("INDEX yangilandi"); } else console.log("INDEX o'zgarmadi");
