#!/usr/bin/env python3
"""Fan viktorinasi — savollar banklarini yig'ish (texnikum1son.uz).

Har bir fan uchun data/test/<kalit>.json yoziladi — viktorina/ sahifasi faqat shu fanning savollarini ishlatadi.
Manbalar:
  1. _manba/savollar/banklar/<fan-id>.txt — qo'lda yozilgan savollar (o'qituvchi/metodist), mavzular bo'yicha.
  2. _manba/lab/*.json — fanning virtual laboratoriyasi: jihozlar, atamalar (moslash), vaziyatlar (tanlash), ish tartibi.
  3. Yo'l harakati qoidalari fani — yhq/ ilovasidagi qoidalar, belgilar va chiziqlar (Qoidalar bandi bilan).
  4. agent/t/<majmua>.json — Kuvi agent majmuadan olgan/tuzgan testlar (sahifada qo'shiladi; bu yerda faqat soni hisoblanadi).
Amaliyot fanlari (kalit <yonalish>--<fan>) — mutaxassislikning kasbiy fanlari savollarini «meros» qilib oladi.

Bank fayli formati (.txt):
  # izoh
  +fan: boshqa-fan-id        — boshqa fanning qo'lda yozilgan savollarini ham qo'shish
  +yhq                       — Yo'l harakati qoidalari ilovasidan savollar
  @ Mavzu nomi
  Savol matni? | To'g'ri javob | Xato javob | Xato javob | Xato javob ## izoh (ixtiyoriy)
  %en                        — ingliz tilidagi bank (apostroflar o'zgartirilmaydi)
  Yozishda oddiy apostrof (o' g' ma'no) ishlatilsa bo'ladi — o‘ g‘ ’ ga avtomatik almashtiriladi.
Ishga tushirish: python3 _manba/savollar/yig.py  (yoki build.py o'zi chaqiradi)
"""
import glob
import json
import os
import random
import re
import subprocess
import sys
import zlib

SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # _manba
ILDIZ = os.path.dirname(SRC)
BANK_DIR = os.path.join(SRC, "savollar", "banklar")
LAB_DIR = os.path.join(SRC, "lab")


def rnd(*k):
    return random.Random(zlib.crc32("|".join(map(str, k)).encode()))


def toza(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def kalit(s):
    return re.sub(r"[ʻʼ‘’`´'\"«»“”.,;:!?()\-–—\s]+", " ", str(s).lower()).strip()


def apostrof(s):
    """O'zbekcha matnda: o' g' -> o‘ g‘, qolgan ' -> ’ (saytdagi imlo bilan bir xil)."""
    s = re.sub(r"([oOgG])['ʻ`]", lambda m: m.group(1) + "‘", s)
    return re.sub(r"(?<=\w)['ʼ`](?=\w)", "’", s)


def oxshash(javob, matn):
    """Javob savol matnini takrorlasa (masalan «Invertorni yoqing» -> «Invertorni yoqish») — savol juda oson."""
    w = {x[:4] for x in kalit(javob).split() if len(x) >= 4}
    m = {x[:4] for x in kalit(matn).split() if len(x) >= 4}
    return bool(w) and len(w & m) / len(w) >= 0.6


# ---------------------------------------------------------------- 1. Qo'lda yozilgan banklar
def bank_oqi(fid, _seen=None):
    """-> (mavzular [{nomi, q:[...]}], belgilar {'yhq': bool})"""
    _seen = _seen or set()
    if fid in _seen:
        return [], {}
    _seen.add(fid)
    p = os.path.join(BANK_DIR, fid + ".txt")
    if not os.path.isfile(p):
        return [], {}
    M, flags, cur = [], {}, None
    for n, line in enumerate(open(p, encoding="utf-8"), 1):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("+fan:"):
            oth = s[5:].strip()
            mm, ff = bank_oqi(oth, _seen)
            M += mm
            fl = flags.get("fanlar", []) + [oth] + ff.get("fanlar", [])
            flags.update(ff)
            flags["fanlar"] = fl
            continue
        if s == "+yhq":
            flags["yhq"] = True
            continue
        if s == "%en":
            flags["en"] = True
            continue
        if not flags.get("en"):
            s = apostrof(s)
        if s.startswith("@"):
            cur = {"nomi": toza(s[1:]), "q": []}
            M.append(cur)
            continue
        izoh = ""
        if " ## " in s:
            s, izoh = s.split(" ## ", 1)
        parts = [toza(x) for x in s.split("|")]
        if len(parts) < 3 or not all(parts):
            raise SystemExit(f"{fid}.txt:{n}: savol formati noto'g'ri: {line.strip()[:90]}")
        if len({x.lower() for x in parts[1:]}) != len(parts) - 1:
            raise SystemExit(f"{fid}.txt:{n}: variantlar takrorlangan: {line.strip()[:90]}")
        if cur is None:
            cur = {"nomi": "Asosiy tushunchalar", "q": []}
            M.append(cur)
        q = [parts[0], parts[1], parts[2:]]
        if izoh:
            q.append(toza(izoh))
        cur["q"].append(q)
    return [m for m in M if m["q"]], flags


# ---------------------------------------------------------------- 2. Virtual laboratoriyalar
LABS = {}
for _p in sorted(glob.glob(os.path.join(LAB_DIR, "*.json"))):
    _d = json.load(open(_p, encoding="utf-8"))
    LABS[_d["id"]] = _d


def lab_tayyor(lid, _seen=None):
    """meros (boshqa labdan jihoz va mashqlar) bilan to'liq laboratoriya (build.py dagi kabi)."""
    L = LABS[lid]
    if L.get("_ok"):
        return L
    J, Sm, T = [], [], []
    for a in L.get("meros", []) or []:
        A = lab_tayyor(a)
        J += A["jihozlar"]; Sm += A["sim"]; T += A.get("test", [])
    own = {j["id"] for j in L.get("jihozlar", [])}
    owns = {x["id"] for x in L.get("sim", [])}
    L["jihozlar"] = [j for j in J if j["id"] not in own] + L.get("jihozlar", [])
    L["sim"] = [x for x in Sm if x["id"] not in owns] + L.get("sim", [])
    L["test"] = L.get("test", []) + T
    L["_ok"] = 1
    return L


def boshqalar(r, togri, hammasi, n=3):
    seen = {kalit(togri)}
    out = []
    for x in r.sample(hammasi, len(hammasi)):
        k = kalit(x)
        if k and k not in seen:
            seen.add(k)
            out.append(x)
        if len(out) >= n:
            break
    return out


def niqobla(matn, nom):
    """Ta'rifdan jihoz nomini olib tashlaydi (javobni oshkor qilmasin)."""
    t = matn
    for w in sorted({nom} | {x for x in re.split(r"[\s(),/]+", nom) if len(x) >= 6}, key=len, reverse=True):
        t = re.sub(re.escape(w), "…", t, flags=re.I)
    return t


def lab_savollar(lid):
    L = lab_tayyor(lid)
    T = {"jihoz": [], "atama": [], "vaziyat": [], "tartib": []}
    J = [j for j in L.get("jihozlar", []) if j.get("nomi")]
    nomlar = [toza(j["nomi"]) for j in J]
    # 1) jihozning vazifasi -> qaysi jihoz?
    if len(set(nomlar)) >= 4:
        for j in J:
            if j.get("vazifa"):
                r = rnd(lid, "v", j["id"])
                w = boshqalar(r, j["nomi"], nomlar)
                if len(w) >= 3:
                    T["jihoz"].append([f"Qaysi jihoz (vosita) haqida gap ketmoqda?\n«{toza(niqobla(j['vazifa'], j['nomi']))}»", toza(j["nomi"]), w])
        # 2) tuzilish qismi -> qaysi jihozniki? (boshqa jihozlarda o'xshash qism bo'lmasa)
        for j in J:
            for k, qism in enumerate(j.get("tuzilish") or []):
                if k > 1:
                    break
                bosh = kalit(qism).split(" ")[0]
                if len(bosh) < 4:
                    continue
                alt = [toza(x["nomi"]) for x in J if x is not j and not any(bosh in kalit(t) for t in (x.get("tuzilish") or []))]
                r = rnd(lid, "t", j["id"], k)
                w = boshqalar(r, j["nomi"], alt)
                if len(w) >= 3:
                    T["jihoz"].append([f"«{toza(qism)}» qaysi jihozning tarkibiy qismi?", toza(j["nomi"]), w])
    # 3) virtual mashqlar
    moslar = [s for s in L.get("sim", []) if s.get("tur") == "moslash"]
    for s in L.get("sim", []):
        t, p, nomi = s.get("tur"), s.get("p") or {}, toza(s.get("nomi"))
        if t == "moslash":
            juft = [(toza(a), toza(b)) for a, b in p.get("juft", []) if a and b]
            sag = [b for _, b in juft]
            chap = [a for a, _ in juft]
            if len(juft) < 4:  # boshqa moslash mashqlaridan chalg'ituvchi
                sag += [toza(b) for x in moslar if x is not s for _, b in x["p"].get("juft", [])]
                chap += [toza(a) for x in moslar if x is not s for a, _ in x["p"].get("juft", [])]
            for i, (a, b) in enumerate(juft):
                r = rnd(lid, s["id"], i)
                if r.random() < 0.6:
                    w = boshqalar(r, b, sag)
                    if len(w) >= 2:
                        T["atama"].append([f"{nomi}: «{a}» — qaysi javob mos keladi?", b, w])
                else:
                    w = boshqalar(r, a, chap)
                    if len(w) >= 2:
                        T["atama"].append([f"{nomi}: «{b}» — bu qaysi biri?", a, w])
        elif t == "tanlash":
            for it in p.get("savollar", []):
                v = [toza(x) for x in it.get("v", [])]
                if len(v) >= 2 and 0 <= it.get("t", -1) < len(v):
                    q = [toza(it["s"]), v[it["t"]], [x for k, x in enumerate(v) if k != it["t"]]]
                    if it.get("i"):
                        q.append(toza(it["i"]))
                    T["vaziyat"].append(q)
        elif t == "tartib":
            st = [toza(x) for x in p.get("qadamlar", []) if x]
            if len(st) >= 4:
                r = rnd(lid, s["id"], "b")
                T["tartib"].append([f"«{nomi}»: qaysi bosqich birinchi bajariladi?", st[0], boshqalar(r, st[0], st[1:])])
                for k in range(1, len(st)):
                    r = rnd(lid, s["id"], k)
                    alt = [x for i, x in enumerate(st) if i not in (k, k - 1)]
                    w = boshqalar(r, st[k], alt)
                    if len(w) >= 2:
                        T["tartib"].append([f"«{nomi}»: «{st[k - 1]}» bosqichidan keyin nima bajariladi?", st[k], w])
        elif t == "qurilma":
            bsh = {b["id"]: toza(b["n"]) for b in p.get("boshqaruv", []) if b.get("id")}
            if len(bsh) >= 4:
                for k, q in enumerate(p.get("qadamlar", [])):
                    if q.get("t") in bsh and q.get("v") and not oxshash(bsh[q["t"]], q["v"]):
                        r = rnd(lid, s["id"], "q", k)
                        w = boshqalar(r, bsh[q["t"]], list(bsh.values()))
                        qq = [f"«{toza(p.get('nomi') or nomi)}» bilan ishlash. «{toza(q['v'])}» — buning uchun nima qilinadi?", bsh[q["t"]], w]
                        if q.get("j"):
                            qq.append(toza(q["j"]))
                        T["tartib"].append(qq)
        elif t == "sxema":
            sh = [(toza(x.get("n")), toza(x.get("i"))) for x in p.get("sh", []) if x.get("n") and x.get("i")]
            nl = list(dict.fromkeys(n for n, _ in sh))
            if len(nl) >= 4:
                for k, (n, i) in enumerate(sh):
                    r = rnd(lid, s["id"], "s", k)
                    w = boshqalar(r, n, nl)
                    if len(w) >= 3:
                        T["jihoz"].append([f"{nomi}: «{niqobla(i, n)}» — bu qaysi qism?", n, w])
    for k, t in enumerate(L.get("test", [])):
        v = [toza(x) for x in t.get("v", [])]
        if len(v) >= 2 and 0 <= t.get("t", -1) < len(v):
            q = [toza(t["s"]), v[t["t"]], [x for i, x in enumerate(v) if i != t["t"]]]
            if t.get("i"):
                q.append(toza(t["i"]))
            T["vaziyat"].append(q)
    NOM = {"jihoz": "Jihozlar, asboblar va qurilmalar", "atama": "Atamalar va tushunchalar", "vaziyat": "Amaliy vaziyatlar", "tartib": "Ish tartibi va bosqichlar"}
    out, seen = [], set()
    for k in ("jihoz", "atama", "vaziyat", "tartib"):
        qs = []
        for q in T[k]:
            kk = kalit(q[0]) + "|" + kalit(q[1])
            if kk in seen:
                continue
            seen.add(kk)
            qs.append(q)
        if qs:
            out.append({"nomi": NOM[k] + " (virtual laboratoriya)", "manba": "lab", "q": qs})
    return out


# ---------------------------------------------------------------- 2b. Tayyor RTR paketlari (data/rtr/<fan>.json) — mavzu testlari va yakuniy test
def rtr_savollar(fid):
    # <fan>.json (bitta paket) yoki semestrlar bo'yicha <fan>-1sem.json, <fan>-2sem.json, ... (modulli umumta'lim fanlari)
    rd = os.path.join(ILDIZ, "data", "rtr")
    fl = ([fid + ".json"] if os.path.isfile(os.path.join(rd, fid + ".json")) else []) + \
        sorted((f for f in (os.listdir(rd) if os.path.isdir(rd) else []) if re.fullmatch(re.escape(fid) + r"-\d+sem\.json", f)), key=lambda f: int(re.findall(r"(\d+)sem", f)[-1]))
    out = []
    for f in fl:
        out += rtr_savollar_fayl(os.path.join(rd, f), sem=(re.findall(r"-(\d+)sem\.json$", f) or [None])[0])
    return out


def rtr_savollar_fayl(p, sem=None):
    d = json.load(open(p, encoding="utf-8"))

    def q_of(t):
        v = [toza(x) for x in t.get("variantlar", [])]
        if len(v) < 2 or not 0 <= t.get("togri", -1) < len(v):
            return None
        q = [toza(t["savol"]), v[t["togri"]], [x for i, x in enumerate(v) if i != t["togri"]]]
        if t.get("izoh"):
            q.append(toza(t["izoh"]))
        return q
    out = []
    bosh = int((d.get("meta") or {}).get("dars_boshi") or 1)
    for k, tp in enumerate(d.get("topics", [])):
        qs = [q for q in map(q_of, tp.get("test") or []) if q]
        if qs:
            nom = re.split(r"[:;]", toza(tp["nomi"]))[0]
            nom = nom if len(nom) <= 80 else nom[:77].rsplit(" ", 1)[0] + "…"
            out.append({"nomi": (f"{sem}-sem, {k + bosh}-dars. {nom}" if sem else f"{tp['id']}. {nom}"), "manba": "t", "q": qs})
    Y = d.get("yakuniy") or {}
    yq = [] if Y.get("yigma") else [q for q in map(q_of, Y.get("test") or []) if q]  # yigma — mavzu testlaridan yig'ilgan: takrorlanmasin
    if yq:
        out.append({"nomi": "Yakuniy nazorat testi", "manba": "t", "q": yq})
    return out


# ---------------------------------------------------------------- 3. Yo'l harakati qoidalari (yhq/)
def yhq_savollar():
    js = r"""
const fs=require('fs'),vm=require('vm');const c={window:{}};c.window.window=c.window;vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),c);vm.runInContext(fs.readFileSync(process.argv[2],'utf8').replace("g.YHQBank = {","g.YHQRAW={RULES:RULES,SIGNS:SIGNS,MARKS:MARKS,GROUPS:GROUPS};g.YHQBank = {"),c);
process.stdout.write(JSON.stringify(c.window.YHQRAW));"""
    try:
        raw = json.loads(subprocess.run(["node", "-e", js, os.path.join(ILDIZ, "yhq", "data", "data.js"), os.path.join(ILDIZ, "yhq", "js", "vq-bank.js")],
                                        capture_output=True, text=True, check=True, timeout=60).stdout)
    except Exception as e:
        print("  YHQ savollari olinmadi:", str(e)[:200], file=sys.stderr)
        return []
    band = lambda b: re.sub(r"\^\{(\d+)\}", r"^\1", b)
    Q = [[r[0], r[1], r[2], f"Yo‘l harakati qoidalari, {band(r[3])}-band"] for r in raw["RULES"]]
    S = []
    for s in raw["SIGNS"]:
        r = rnd("yhq", s["n"])
        same = [x["name"] for x in raw["SIGNS"] if x["g"] == s["g"] and x["name"] != s["name"]]
        w = boshqalar(r, s["name"], same) if len(same) >= 3 else boshqalar(r, s["name"], [x["name"] for x in raw["SIGNS"]])
        S.append([f"Bu qaysi yo‘l belgisi? ({raw['GROUPS'].get(s['g'], '')})".replace(" ()", ""), s["name"], w, f"{s['n']} — «{s['name']}»", "../yhq/" + s["img"]])
    M = []
    ids = list(raw["MARKS"].keys())
    for i in ids:
        r = rnd("yhqm", i)
        w = boshqalar(r, raw["MARKS"][i], [raw["MARKS"][x] for x in ids])
        M.append(["Bu qaysi yo‘l chizig‘i?", raw["MARKS"][i], w, f"{i} — {raw['MARKS'][i]}", f"../yhq/img/markings/{i}.svg"])
    return [{"nomi": "Qoidalar: tezlik, to‘xtash, chorrahalar (YHQ)", "manba": "t", "q": Q},
            {"nomi": "Yo‘l belgilari", "manba": "t", "q": S},
            {"nomi": "Yo‘l chiziqlari", "manba": "t", "q": M}]


# ---------------------------------------------------------------- 4. Yig'ish
def agent_testlar_soni():
    """agent/index.json: {"y|f": [{id,...,t}]} -> ({(y,f): savollar soni}, {f: savollar soni — har majmua bir marta})
    (bitta majmua «yonalishlar» orqali bir necha mutaxassislik sahifasida turishi mumkin)."""
    ix_p = os.path.join(ILDIZ, "agent", "index.json")
    out, fan, bor = {}, {}, set()
    if not os.path.isfile(ix_p):
        return out, fan
    ix = json.load(open(ix_p, encoding="utf-8"))
    for yk, L in ix.items():
        y, f = yk.split("|", 1)
        for m in L:
            tp = os.path.join(ILDIZ, "agent", "t", m["id"] + ".json")
            if os.path.isfile(tp):
                try:
                    t = json.load(open(tp, encoding="utf-8"))
                    n = sum(len(x.get("q", [])) for x in t.get("mavzular", []))
                except Exception:
                    continue
                out[(y, f)] = out.get((y, f), 0) + n
                if (f, m["id"]) not in bor:
                    bor.add((f, m["id"]))
                    fan[f] = fan.get(f, 0) + n
    return out, fan


def yig(mal, out_dir, ynom=None, log=print):
    """mal — _manba/texnikum1-malumot.json; out_dir — sayt ildizi. Qaytaradi: {kalit: savollar soni}"""
    ynom = ynom or (lambda y: y.get("qisqa") or y["mutaxassislik"])
    Y = mal["yonalishlar"]
    td = os.path.join(out_dir, "data", "test")
    os.makedirs(td, exist_ok=True)
    for f in glob.glob(os.path.join(td, "*.json")):
        os.remove(f)
    lab_by_fan = {}
    for lid, L in LABS.items():
        for f in L.get("fanlar", []):
            lab_by_fan.setdefault(f, []).append(lid)
    AG, AGF = agent_testlar_soni()
    fanlar = {}   # fid -> {nomi, toifa, y:[(yid, nom)]}
    for y in Y:
        for f in y["fanlar"]:
            d = fanlar.setdefault(f["id"], {"nomi": f["nomi"], "toifa": f["toifa"], "y": []})
            d["y"].append((y["id"], ynom(y)))
    TOIFA_NOMI = {"kasbiy": "Kasbiy fan", "umumtalim": "Umumtaʼlim fani", "amaliyot": "Amaliyot"}
    banklar, soni, yhq_cache = {}, {}, None

    def yoz(k, b):
        b["soni"] = sum(len(m["q"]) for m in b.get("mavzular", []))
        for i, m in enumerate(b.get("mavzular", [])):
            m["id"] = m.get("id") or f"m{i + 1}"
        json.dump(b, open(os.path.join(td, k + ".json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        banklar[k] = b

    # kasbiy va umumta'lim fanlari — bitta bank (fan id bo'yicha), barcha mutaxassisliklarga umumiy
    for fid, d in fanlar.items():
        if d["toifa"] == "amaliyot":
            continue
        M, flags = bank_oqi(fid)
        for m in M:
            m["manba"] = "t"
        for rf in [fid] + flags.get("fanlar", []):
            M += rtr_savollar(rf)
        if flags.get("yhq"):
            if yhq_cache is None:
                yhq_cache = yhq_savollar()
            M += yhq_cache
        for lid in lab_by_fan.get(fid, []):
            M += lab_savollar(lid)
        url = f"yonalish/umumtalim/fan/{fid}/" if d["toifa"] == "umumtalim" else f"yonalish/{d['y'][0][0]}/fan/{fid}/"
        yoz(fid, {"v": 1, "id": fid, "fan": fid, "nomi": d["nomi"], "toifa": d["toifa"], "toifa_nomi": TOIFA_NOMI[d["toifa"]], "url": url,
                  "yonalishlar": [list(x) for x in d["y"]] if d["toifa"] != "umumtalim" else [], "mavzular": M})
    # amaliyot — har mutaxassislik uchun alohida (kalit y--f): o'z savollari + kasbiy fanlar merosi
    for y in Y:
        kas = [f["id"] for f in y["fanlar"] if f["toifa"] == "kasbiy" and banklar.get(f["id"], {}).get("soni")]
        for f in y["fanlar"]:
            if f["toifa"] != "amaliyot":
                continue
            M, flags = bank_oqi(f"{y['id']}--{f['id']}")
            if not M:
                M, flags = bank_oqi(f["id"])
            for m in M:
                m["manba"] = "t"
            for lid in lab_by_fan.get(f["id"], []):
                M += lab_savollar(lid)
            yoz(f"{y['id']}--{f['id']}", {"v": 1, "id": f"{y['id']}--{f['id']}", "fan": f["id"], "yonalish": y["id"], "nomi": f["nomi"], "toifa": "amaliyot",
                                         "toifa_nomi": "Amaliyot · " + ynom(y), "url": f"yonalish/{y['id']}/fan/{f['id']}/",
                                         "yonalishlar": [[y["id"], ynom(y)]], "mavzular": M, "meros": kas})
    # index.json — fan tanlash ro'yxati va fan sahifalaridagi tugmalar uchun
    idx = []
    for k, b in sorted(banklar.items(), key=lambda kv: kalit(kv[1]["nomi"])):
        c = b["soni"] + sum(banklar[m]["soni"] for m in b.get("meros", []))
        if b["toifa"] == "amaliyot":
            c += AG.get((b["yonalish"], b["fan"]), 0)
        else:
            c += AGF.get(b["fan"], 0)
        soni[k] = c
        idx.append({"k": k, "n": b["nomi"], "t": b["toifa"], "y": b.get("yonalishlar", []), "c": c})
    json.dump({"v": 1, "fanlar": idx}, open(os.path.join(td, "index.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    jami = sum(b["soni"] for b in banklar.values())
    qolda = sum(len(m["q"]) for b in banklar.values() for m in b["mavzular"] if m.get("manba") == "t")
    log(f"Savollar banki: {len(banklar)} ta fan, {jami} ta savol (qo‘lda yozilgan/YHQ: {qolda}, laboratoriyadan: {jami - qolda})")
    return soni


if __name__ == "__main__":
    mal = json.load(open(os.path.join(SRC, "texnikum1-malumot.json"), encoding="utf-8"))
    out = sys.argv[1] if len(sys.argv) > 1 else ILDIZ
    s = yig(mal, out)
    if "-v" in sys.argv:
        for k, v in sorted(s.items(), key=lambda kv: kv[1]):
            print(f"{v:5d}  {k}")
