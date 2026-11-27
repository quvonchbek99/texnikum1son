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
function load(code) {
  const kb = { document: { currentScript: null, createElement() { return {}; }, head: { appendChild() {} } }, Promise, setTimeout };
  kb.window = kb; vm.createContext(kb); run(code, kb); return kb.KA_BOLIM;
}
let API = load(src);
function sandbox() { const c = { Math, JSON, Date, console: { log() {}, warn() {}, error() {} } }; c.window = c; vm.createContext(c); return c; }

// 🤖 yangi bo'limlarni o'zi topish: bosh papkadagi sahifa ulagan data faylda {id, t, q:[…]} massivi bo'lsa — MANIFEST ga qo'shiladi
function discover() {
  const used = new Set(API.MANIFEST.flatMap(m => m.f)), keys = new Set(API.MANIFEST.map(m => m.k)), found = [];
  for (const page of fs.readdirSync(ROOT).filter(f => f.endsWith(".html")).sort()) {
    const html = fs.readFileSync(path.join(ROOT, page), "utf8");
    if (/<!--\s*ka-bolim:\s*yoq\s*-->/i.test(html)) continue;
    const files = [...html.matchAll(/<script[^>]*\ssrc="([\w.-]+\.js)(?:\?[^"]*)?"/g)].map(m => m[1])
      .filter(f => !f.startsWith("ka-") && fs.existsSync(path.join(ROOT, f)));
    if (!files.length || files.some(f => used.has(f))) continue;
    const ctx = sandbox(), own = new Set(Object.keys(ctx)), touched = {};
    for (const f of files) {
      const size = {}; for (const g of Object.keys(ctx)) if (Array.isArray(ctx[g])) size[g] = ctx[g].length;
      try { run(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx); } catch (e) { continue; } // sahifa kodi (DOM kerak) — data emas
      for (const g of Object.keys(ctx)) if (!own.has(g) && Array.isArray(ctx[g]) && ctx[g].length !== (size[g] || 0)) (touched[g] = touched[g] || []).push(f);
    }
    for (const g of Object.keys(touched)) {
      const secs = Array.from(ctx[g]).filter(x => x && typeof x.id === "string" && typeof x.t === "string" && Array.isArray(x.q));
      if (secs.length < 3 || secs.reduce((s, it) => s + API.count({}, it), 0) < 10) continue;
      const base = page.slice(0, -5).toLowerCase().replace(/\d/g, d => "jabcdefghi"[+d]).replace(/[^a-z]/g, "") || "bolim";
      let k = base; while (keys.has(k)) k += "x";
      const title = ((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || page.slice(0, -5)).split(/\s[—|–]\s|\|/)[0].replace(/&[#\w]+;|[<>"&]/g, "").trim().slice(0, 40);
      const m = { k, nom: "🧩 " + title, guruh: "🧩 " + title, p: "z" + k, g, f: touched[g] };
      const img = html.match(/["'\x60]([a-z0-9-]+-img\/)["'\x60]/); if (img) m.img = img[1];
      m.sahifa = page; keys.add(k); touched[g].forEach(f => used.add(f)); found.push(m);
      break;
    }
  }
  return found;
}
const found = discover();
if (found.length) {
  src = src.replace(/\s*\]\/\*MANIFEST-END\*\//, () => found.map(m => ",\n    " + JSON.stringify(m)).join("") + "\n  ]/*MANIFEST-END*/");
  API = load(src);
  found.forEach(m => console.log("➕ yangi bo'lim topildi: " + m.nom + " (" + m.sahifa + ")"));
}

// boshqa fanlarning ID lari (to'qnashuv bo'lmasin)
const taken = new Set();
try {
  const mz = fs.readFileSync(path.join(ROOT, "ka-mavzular.js"), "utf8").match(/var DATA = (\{[\s\S]*?\});\n/);
  if (mz) JSON.parse(mz[1]).t.forEach(t => taken.add(t[0]));
} catch (e) { console.warn("ka-mavzular.js o'qilmadi:", e.message); }

const index = {}, seen = new Map(); let bad = 0;
for (const m of API.MANIFEST) {
  if (!/^[a-z]+$/.test(m.k)) { console.error(`✖ ${m.k}: fan kaliti faqat kichik lotin harflaridan bo'lsin`); bad++; continue; }
  const ctx = sandbox(); let broken = false;
  for (const f of m.f) {
    const fp = path.join(ROOT, f);
    if (!fs.existsSync(fp)) { console.error(`✖ ${m.k}: ${f} topilmadi`); bad++; broken = true; continue; }
    try { run(fs.readFileSync(fp, "utf8"), ctx); } catch (e) { console.error(`✖ ${m.k}: ${f} — ${e.message}`); bad++; broken = true; }
  }
  // bitta buzilgan fan boshqalarini to'xtatmaydi: uning eski ro'yxati saqlanadi
  if (broken) { index[m.k] = API.INDEX[m.k] || []; continue; }
  const list = [];
  for (const it of API.norm ? API.norm(m, ctx[m.g], ctx) : ctx[m.g] || []) {
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
if (bad) { console.error(`${bad} ta xato — qolgan fanlar yangilandi`); process.exitCode = 1; }

const body = "{\n" + Object.keys(index).map(k => `    ${JSON.stringify(k)}: [\n` + index[k].map(t => "      " + JSON.stringify(t)).join(",\n") + "\n    ]").join(",\n") + "\n  }";
const next = src.replace(/\/\*INDEX\*\/[\s\S]*?\/\*INDEX-END\*\//, "/*INDEX*/" + body + "/*INDEX-END*/");
if (next !== fs.readFileSync(FILE, "utf8")) { fs.writeFileSync(FILE, next); console.log("INDEX yangilandi"); } else console.log("INDEX o'zgarmadi");
