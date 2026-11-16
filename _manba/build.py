#!/usr/bin/env python3
"""texnikum1son.uz — statik sayt generatori (2-versiya: faqat fanlar katalogi; 1-versiya /eski/ papkada, _manba/eski/build_v1.py).
Ishlatish: python3 build.py <malumot.json> <rtr_json_dir_or_none> <chiqish_papkasi>
Ma'lumot: kasb-emis.edu.uz (05.11.2026) asosidagi texnikum1-malumot.json."""
import json, os, re, shutil, sys, html as H
from urllib.parse import quote

SRC = os.path.dirname(os.path.abspath(__file__))
MAL = json.load(open(sys.argv[1], encoding="utf-8"))
OUT = sys.argv[3]
DOMEN = "https://texnikum1son.uz"
NOM = "Toshkent tuman 1-son texnikumi"
MANZIL = "111106, Toshkent viloyati, Toshkent tumani, Ko‘ksaroy shaharchasi, Shifobaxsh suvlar ko‘chasi, 169"
MANZIL_Q = "Toshkent viloyati, Toshkent tumani, Ko'ksaroy, Shifobaxsh suvlar ko'chasi 169"
e = lambda s: H.escape(str(s if s is not None else ""), quote=True)

# ---------- Ma'lumotni tayyorlash ----------
Y = MAL["yonalishlar"]
for y in Y:
    y["qisqa"] = re.sub(r"\s*\(o'quv reja \d+\)", "", y["mutaxassislik"])
YID = {y["id"]: y for y in Y}
G = MAL["guruhlar"]
GOF = {}
for g in G:
    GOF.setdefault(g["yonalish_id"], []).append(g)

SOHA = [
    ("it", "Axborot texnologiyalari va dizayn", ["kompyuter-grafikasi-dizayn-operatori", "grafik-dizayn-texnologiyasi", "kompyuter-tarmoqlari-it-servis"]),
    ("avto", "Avtomobil, elektr va metall", ["avto-tamirlash-or0006", "avto-tamirlash-or0005", "avtomobillar-servisi", "elektromontyor", "metallga-qayta-ishlov"]),
    ("moda", "Yengil sanoat, zargarlik va go‘zallik", ["tikuvchilik-mahsulotlari-dizayneri", "moda-tikuv-texnologiyasi", "zargarlik", "sartarosh-modeler"]),
    ("xizmat", "Xizmat ko‘rsatish va xavfsizlik", ["oshpaz", "ot-ochiruvchi"]),
]
ICO = {
    "it": '<path d="M3 5h18v11H3z"/><path d="M8 20h8M12 16v4"/><path d="M7 9l2 2-2 2M12 13h4"/>',
    "avto": '<path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.6h7.2a2 2 0 0 1 1.9 1.4L19 16"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    "moda": '<path d="M9 3l3 2 3-2 4 3-2 4-2-1v12H9V9L7 10 5 6z"/>',
    "xizmat": '<path d="M4 18h16"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M12 9V7M10 7h4"/>',
    "kitob": '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    "joy": '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "odam": '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>',
    "fayl": '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    "ai": '<path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    "soat": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
}
def ico(k, cls="ico"):
    return f'<span class="{cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICO[k]}</svg></span>'

LOGO = ('<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="var(--a)"/>'
        '<g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="24" cy="24" r="15.5" stroke-dasharray="3.2 2.6" opacity=".55"/></g>'
        '<path d="M14.5 33.5c3-1.6 6.2-1.6 9.5 0 3.3-1.6 6.5-1.6 9.5 0v2c-3-1.4-6.2-1.4-9.5 0-3.3-1.4-6.5-1.4-9.5 0z" fill="#fff" opacity=".9"/>'
        '<path d="M25.6 12.5h3.1v18.3h-4.2V17.6l-3.6 2.2-1.6-3.1z" fill="#fff"/></svg>')
HILLS = ('<svg class="hills" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" '
         'd="M0 72c120-28 240-44 360-34s200 40 330 40 230-50 370-52 230 28 380 18v76H0z" opacity=".35"/><path fill="currentColor" '
         'd="M0 96c160-30 300-34 450-18s250 34 400 26 270-46 400-44 140 14 190 20v40H0z"/></svg>')
STAT_SOURCE = "kasb-emis.edu.uz, 05.11.2026"

TOIFA = {"kasbiy": ("Kasbiy (spes) fanlar", "k"), "amaliyot": ("Amaliyot", "a"), "umumtalim": ("Umumta’lim fanlari", "u")}

# Tayyor materiallar (RTR paketlari)
STATIK = {}
if sys.argv[2] != "none":
    STATIK[("moda-tikuv-texnologiyasi", "zamonaviy-tikuv-jihozlari", "1")] = {
        "json": "data/rtr/zamonaviy-tikuv-jihozlari.json", "base": "materiallar/zamonaviy-tikuv-jihozlari/",
        "paket": "materiallar/zamonaviy-tikuv-jihozlari/index.html",
        "manba": "«Zamonaviy tikuv jihozlari» (UKM.4) raqamli ta’lim resursi",
    }
RTR_TIKUV = json.load(open(os.path.join(sys.argv[2], "zamonaviy-tikuv-jihozlari.json"), encoding="utf-8")) if sys.argv[2] != "none" else None

# ---------- Sahifa qolipi ----------
NAV = [("", "Fanlar"), ("lab/", "Virtual laboratoriya"), ("oyinlar/", "Sinf o‘yinlari"), ("eski/", "Eski versiya")]

def page(path, title, desc, body, active=None, scripts=(), noindex=False, abs_root=False, body_cls=""):
    depth = path.count("/")
    R = "/" if abs_root else "../" * depth
    nav = "".join(f'<a href="{R}{u}"{" aria-current=page" if active == u else ""}>{t}</a>' for u, t in NAV)
    full_title = f"{title} · {NOM} e-bazasi" if title != NOM else f"Fanlar — {NOM} e-bazasi"
    canon = DOMEN + "/" + re.sub(r"index\.html$", "", path)
    def _v(s):  # lab-3d.js tez-tez yangilanadi: versiya fayl mazmunidan olinadi (brauzer keshi eskirib qolmasin)
        if s != "lab-3d.js": return "3"
        import hashlib; return hashlib.md5(open(os.path.join(SRC, "assets", s), "rb").read()).hexdigest()[:8]
    sc = "".join(f'<script src="{R}assets/{s}?v={_v(s)}" defer></script>' for s in ("sayt.js",) + tuple(scripts))
    html = f"""<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full_title)}</title>
<meta name="description" content="{e(desc)}">
{'<meta name="robots" content="noindex">' if noindex else f'<link rel="canonical" href="{e(canon)}">'}
<meta property="og:title" content="{e(full_title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="uz_UZ">
<meta name="theme-color" content="#142450">
<link rel="icon" href="{R}assets/logo-48.png" type="image/png" sizes="48x48">
<link rel="icon" href="{R}assets/logo-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="{R}assets/apple-touch-icon.png">
<meta property="og:image" content="{DOMEN}/assets/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap">
<link rel="stylesheet" href="{R}assets/sayt.css?v=3">
<script>(function(){{var m=new Date(Date.now()+(new Date().getTimezoneOffset()+300)*6e4).getMonth(),q=new URLSearchParams(location.search).get('fasl');document.documentElement.setAttribute('data-fasl',/^(kuz|qish|bahor|yoz)$/.test(q||'')?q:(m==11||m<2?'qish':m<5?'bahor':m<8?'yoz':'kuz'));}})();</script>
</head>
<body data-root="{R}"{f' class="{body_cls}"' if body_cls else ""}>
<a class="sr" href="#asosiy">Asosiy qismga o‘tish</a>
<header class="top"><div class="wrap">
<a class="brand" href="{R}" aria-label="Fanlar — bosh sahifa"><picture><source srcset="{R}assets/logo-96.webp" type="image/webp"><img src="{R}assets/logo-96.png" width="44" height="44" alt=""></picture><span><b>{NOM}</b><span>Fanlar e-bazasi</span></span></a>
<button class="burger" aria-label="Menyu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav class="nav" aria-label="Asosiy menyu">{nav}<a class="btn sm" href="{R}kabinet/">O‘qituvchi kabineti</a></nav>
</div></header>
<main id="asosiy">
{body}
</main>
<footer class="foot ixcham"><div class="wrap"><div class="copy">
<span>© 2026 {NOM} e-bazasi</span>
<span>Fan va soatlar: kasb-emis.edu.uz o‘quv rejalari (05.11.2026)</span>
<span><a href="{R}eski/">Eski versiya</a> · <a href="{R}kabinet/">O‘qituvchi kabineti</a> · <a href="https://kuvonch.uz" rel="noopener">kuvonch.uz</a></span>
</div></div></footer>
{sc}
</body>
</html>"""
    fp = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, "w", encoding="utf-8").write(html)
    return R

def hero(kicker, h1, lead, crumbs=None, extra="", small=True, fasl=False):
    cr = ""
    if crumbs:
        cr = '<nav class="crumbs" aria-label="Yo‘l">' + ' <span aria-hidden="true">/</span> '.join(f'<a href="{u}">{e(t)}</a>' if u else f"<span>{e(t)}</span>" for t, u in crumbs) + "</nav>"
    return (f'<section class="hero{" kichik" if small else ""}"{" data-fasl-hero" if fasl else ""}><canvas aria-hidden="true"></canvas><div class="wrap">{cr}'
            + (f'<span class="kicker" data-fasl-kicker>{kicker}</span>' if kicker else "")
            + f"<h1>{h1}</h1>" + (f'<p class="lead">{lead}</p>' if lead else "") + extra + f"</div>{HILLS}</section>")

def plan_of(f):
    return {s: {"jami": f["jami_soat"][s], "auditoriya": f["auditoriya_soat_taxminiy"].get(s)} for s in f["jami_soat"]}

def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"[ʻʼ‘’`´'\"«»“”]", "", str(s).lower())).strip()

def sem_txt(ss):
    ss = sorted({int(s) for s in ss})
    return (f"{ss[0]}–{ss[-1]}" if len(ss) > 1 and ss[-1] - ss[0] == len(ss) - 1 else ", ".join(map(str, ss))) + "-semestr"

def ynom(y):
    # Guruh raqamlarisiz nom; bir mutaxassislikda 2 ta o'quv reja bo'lsa — reja raqami qoladi
    return y["mutaxassislik"].replace("(o'quv reja ", "(o‘quv reja ") if sum(1 for x in Y if x["qisqa"] == y["qisqa"]) > 1 else y["qisqa"]

# Umumta'lim fanlari — barcha mutaxassisliklar uchun bitta umumiy sahifa (Firestore'da yonalish = "umumtalim")
UM = {}
for y in Y:
    for f in y["fanlar"]:
        if f["toifa"] == "umumtalim":
            UM.setdefault(f["id"], {"f": f, "L": []})["L"].append((y, f))
from collections import Counter
def um_fan(fid):
    L = UM[fid]["L"]; f0 = UM[fid]["f"]
    sems = sorted({s for _, f in L for s in f["jami_soat"]}, key=int)
    js, au = {}, {}
    for s in sems:
        c = Counter((f["jami_soat"][s], f["auditoriya_soat_taxminiy"].get(s)) for _, f in L if s in f["jami_soat"])
        (j, a), _n = c.most_common(1)[0]; js[s] = j; au[s] = a
    return {"id": fid, "nomi": f0["nomi"], "toifa": "umumtalim", "jami_soat": js, "auditoriya_soat_taxminiy": au}
UMF = sorted((um_fan(k) for k in UM), key=lambda f: norm(f["nomi"]))
UMY = {"id": "umumtalim", "qisqa": "Umumta’lim fanlari", "mutaxassislik": "Umumta’lim fanlari (barcha mutaxassisliklar)", "kod": "", "hozirgi_kurs": 0, "talim_shakli": "", "guruhlar": []}
YS = sorted(Y, key=lambda y: norm(ynom(y)))

def fan_url(yid, fid, R):
    return f"{R}yonalish/{yid}/fan/{fid}/"

def fk_card(yid, f, R, meta):
    ok = any(yi == yid and fi == f["id"] for (yi, fi, s) in STATIK)
    t = f["toifa"]; nom, c = TOIFA[t]
    nm = norm(f["nomi"] + " " + (f.get("nomi_kasb_emis") or "") + " " + ("" if yid == "umumtalim" else ynom(YID[yid])))
    return (f'<a class="card fk" href="{fan_url(yid, f["id"], R)}" data-t="{"umumtalim" if t == "umumtalim" else "kasbiy"}" data-k="{yid}|{f["id"]}" data-n="{e(nm)}">'
            f'<span class="fk-t"><span class="tag {c}">{nom.replace(" fanlari", "").replace(" fanlar", "").replace(" (spes)", "")}</span><span class="tag ok" data-mat{"" if ok else " hidden"}>material bor</span></span>'
            f'<h3>{e(f["nomi"])}</h3><span class="meta">{meta}</span></a>')

# ---------- Virtual laboratoriyalar (_manba/lab/*.json) ----------
LAB_DIR = os.path.join(SRC, "lab")
LABS = {}
if os.path.isdir(LAB_DIR):
    for _fn in sorted(os.listdir(LAB_DIR)):
        if _fn.endswith(".json"):
            _d = json.load(open(os.path.join(LAB_DIR, _fn), encoding="utf-8"))
            LABS[_d["id"]] = _d
# «Zamonaviy texnika · 3D»: _manba/lab-zamonaviy.json dagi har bir model o'zining `labs` ro'yxatidagi laboratoriyalarga biriktiriladi
_zf = os.path.join(SRC, "lab-zamonaviy.json")
if os.path.isfile(_zf):
    for _z in json.load(open(_zf, encoding="utf-8")):
        for _l in _z.get("labs", []):
            if _l in LABS:
                LABS[_l].setdefault("zamonaviy", []).append({k: v for k, v in _z.items() if k != "labs"})
    for _d in LABS.values():
        for _a in (_d.get("meros") or []):
            if not _d.get("zamonaviy") and LABS.get(_a, {}).get("zamonaviy"):
                _d["zamonaviy"] = LABS[_a]["zamonaviy"]
def lab_tayyor(L):
    """«meros» — boshqa laboratoriyadan jihoz, mashq va qoidalarni olish (masalan, Fizika va astronomiya ← Fizika)."""
    if L.get("_ok"):
        return L
    L["_ok"] = 1
    J, Sm, X, T = [], [], [], []
    for a in L.get("meros", []):
        A = lab_tayyor(LABS[a]); J += A["jihozlar"]; Sm += A["sim"]; X += A.get("xavfsizlik", []); T += A.get("test", [])
    own = {j["id"] for j in L.get("jihozlar", [])}; owns = {x["id"] for x in L.get("sim", [])}
    L["jihozlar"] = [j for j in J if j["id"] not in own] + L.get("jihozlar", [])
    L["sim"] = [x for x in Sm if x["id"] not in owns] + L.get("sim", [])
    L["xavfsizlik"] = list(dict.fromkeys(L.get("xavfsizlik", []) + X))[:12]
    L["test"] = L.get("test", []) + T
    return L
for _L in list(LABS.values()):
    lab_tayyor(_L)
    _ji = {j["id"] for j in _L["jihozlar"]}; _si = {x["id"] for x in _L["sim"]}
    for _j in _L["jihozlar"]:
        assert not _j.get("sim") or _j["sim"] in _si, f'{_L["id"]}: {_j["id"]} -> {_j.get("sim")} topilmadi'
def lab_aniq(yid, f):
    for L in LABS.values():
        if f["id"] in L.get("fanlar", []) and (not L.get("yonalishlar") or yid in L["yonalishlar"]):
            return L["id"]
    return None
def lab_of(yid, f):
    l = lab_aniq(yid, f)
    if l:
        return l
    if f["toifa"] == "amaliyot":
        return "ustaxona-" + yid if ("ustaxona-" + yid) in LABS else None
    return None
def ustaxonalar():
    """Amaliyot fanlari uchun: yo'nalishning barcha kasbiy laboratoriyalari bitta ustaxonada."""
    for y in Y:
        if not any(f["toifa"] == "amaliyot" and not lab_aniq(y["id"], f) for f in y["fanlar"]):
            continue
        lids = []
        for f in y["fanlar"]:
            if f["toifa"] == "kasbiy":
                l = lab_of(y["id"], f)
                if l and l not in lids and LABS[l].get("amaliyotga", True):
                    lids.append(l)
        if not lids:
            continue
        J, Sm, X, T = [], [], [], []
        for l in lids:
            L = LABS[l]
            for j in L["jihozlar"]:
                j2 = dict(j, id=l + "--" + j["id"], zona=L.get("qisqa") or L["nomi"])
                if j.get("sim"):
                    j2["sim"] = l + "--" + j["sim"]
                J.append(j2)
            Sm += [dict(x, id=l + "--" + x["id"]) for x in L["sim"]]
            X += L.get("xavfsizlik", [])[:3]; T += L.get("test", [])
        hid = "ustaxona-" + y["id"]
        LABS[hid] = {"id": hid, "_ok": 1, "_hub": [l for l in lids], "e": "🏭", "xona": LABS[lids[0]].get("xona", "ustaxona"),
                     "nomi": f"{ynom(y)}: amaliyot ustaxonasi", "qisqa": "Amaliyot ustaxonasi",
                     "tavsif": f"O‘quv va ishlab chiqarish amaliyoti uchun «{ynom(y)}» mutaxassisligining barcha virtual laboratoriyalari bitta ustaxonada: {len(J)} ta jihoz va {len(Sm)} ta virtual mashq.",
                     "fanlar": [], "jihozlar": J, "sim": Sm, "xavfsizlik": list(dict.fromkeys(X))[:12], "test": T}
def lab_fanlari(lid):
    """Laboratoriyadan foydalanadigan fanlar: [(nomi, url, yonalish nomi)]"""
    L, R = [], []
    for f in UMF:
        if lab_of("umumtalim", f) == lid:
            R.append((f["nomi"], f'yonalish/umumtalim/fan/{f["id"]}/', "Umumta’lim"))
    for y in YS:
        for f in y["fanlar"]:
            if f["toifa"] != "umumtalim" and lab_of(y["id"], f) == lid:
                R.append((f["nomi"], f'yonalish/{y["id"]}/fan/{f["id"]}/', ynom(y)))
    return R
def lab_qator(R, yid, f):
    lid = lab_of(yid, f)
    if not lid:
        return ""
    L = LABS[lid]
    return (f'<div class="lab-q"><span class="lab-q-t">{L.get("e", "🔬")} Virtual laboratoriya · <b>{e(L["nomi"])}</b>'
            f'<small>{len(L["jihozlar"])} ta jihoz · {len(L["sim"])} ta virtual mashq · slaydlar · sinov</small></span>'
            f'<a class="btn sm" href="{R}lab/{lid}/">Laboratoriyaga kirish</a></div>')
LTABS = [("xona", "Xona va jihozlar"), ("slayd", "Slaydlar"), ("ishlat", "Virtual ishlatish"), ("sinov", "Sinov"), ("xavf", "Xavfsizlik")]
def lab_page(lid):
    L = LABS[lid]; R = "../../"
    if L.get("_hub") and not L.get("zamonaviy"):
        zz = {z["id"]: z for l in L["_hub"] for z in LABS[l].get("zamonaviy", [])}
        if zz: L["zamonaviy"] = list(zz.values())
    fl = lab_fanlari(lid)
    chips = "".join(f'<a class="chip" href="{R}{u}">{e(n)}<span style="opacity:.7;font-weight:500">· {e(yn)}</span></a>' for n, u, yn in fl[:10])
    extra = f'<div class="chips" style="margin-top:14px">{chips}</div>' if chips else ""
    b = hero("", f'{L.get("e", "🔬")} {e(L["nomi"])}', e(L.get("tavsif", "")), crumbs=[("Fanlar", R), ("Virtual laboratoriyalar", R + "lab/"), (L.get("qisqa") or L["nomi"], None)], extra=extra)
    tb = "".join(f'<button data-t="{k}">{t}' + (f'<span class="cnt">{len(L["sim"])}</span>' if k == "ishlat" and L["sim"] else '<span class="cnt"></span>') + "</button>" for k, t in LTABS + ([("zamon", "Zamonaviy texnika · 3D")] if L.get("zamonaviy") else []))
    def li(xs): return "".join(f"<li>{e(x)}</li>" for x in xs)
    roy = ""
    for i, j in enumerate(L["jihozlar"]):
        roy += (f'<details class="mv" id="j-{e(j["id"])}"><summary><span class="no">{i + 1:02d}</span>{e(j.get("e", ""))} {e(j["nomi"])}</summary><div class="ic doc">'
                + (f'<p>{e(j["vazifa"])}</p>' if j.get("vazifa") else "")
                + (f'<h4>Tuzilishi</h4><ol>{li(j["tuzilish"])}</ol>' if j.get("tuzilish") else "")
                + (f'<h4>Ishlatish tartibi</h4><ol>{li(j["ishlatish"])}</ol>' if j.get("ishlatish") else "")
                + (f'<h4>Xavfsizlik</h4><ul>{li(j["xavfsizlik"])}</ul>' if j.get("xavfsizlik") else "") + "</div></details>")
    nomlar = ", ".join(j["nomi"] for j in L["jihozlar"])[:600]
    fan0 = fl[0][0] if fl else L["nomi"]
    data = {k: v for k, v in L.items() if not k.startswith("_")}
    data["fanlar_nomi"] = list(dict.fromkeys(n for n, _, _ in fl))[:6]
    data["texnikum"] = NOM
    js = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    b += f"""<section class="blk"><div class="wrap">
<div id="fan" hidden data-fan="{e(fan0)}" data-yn="{e('Virtual laboratoriya «' + L['nomi'] + '», jihozlar: ' + nomlar)}" data-toifa="{'umumtalim' if any(yn == 'Umumta’lim' for _, _, yn in fl) else 'kasbiy'}" data-plan="{{}}"></div>
<div id="lab" data-id="{e(lid)}">
<div class="lab-top"><div class="lab-hol"></div></div>
<div data-tabs data-hash><div class="tabs" role="tablist">{tb}</div>
<div data-p="xona"><div class="lab-royxat"><div class="toolbar" style="margin-top:22px"><h3 style="margin:0">Jihozlar pasporti</h3><span class="sp"></span><button type="button" class="btn ghost sm" data-pasport-chop>🖨 Chop etish</button></div>{roy}</div></div>
<div data-p="slayd"><noscript><p class="note">Slaydlarni ko‘rish uchun brauzerda JavaScript yoqilgan bo‘lishi kerak.</p></noscript></div>
<div data-p="ishlat"></div><div data-p="sinov"></div><div data-p="xavf"></div>{'<div data-p="zamon"></div>' if L.get("zamonaviy") else ""}
</div></div>
<script type="application/json" id="lab-json">{js}</script>
</div></section>"""
    page(f"lab/{lid}/index.html", f'{L["nomi"]} — virtual laboratoriya',
         f'«{L["nomi"]}» virtual laboratoriyasi: {len(L["jihozlar"])} ta jihoz bilan tanishish, slaydlar, ekranda virtual ishlatish va sinov. {NOM}.',
         b, active="lab/", scripts=("lab-sim.js", "lab-sim-texnik.js", "lab-sim-it.js", "lab-sim-xizmat.js", "lab.js") + (("lab-3d.js",) if L.get("zamonaviy") else ()) + ("t1-kuvi.js",))
def lab_card(lid, R, izoh=""):
    L = LABS[lid]
    em = " ".join(j.get("e", "") for j in L["jihozlar"][:7])
    return (f'<a class="card lab-k" href="{R}lab/{lid}/" data-n="{e(norm(L["nomi"] + " " + izoh + " " + " ".join(j["nomi"] for j in L["jihozlar"])))}"><span class="lab-ke">{L.get("e", "🔬")}</span><span><h3>{e(L["nomi"])}</h3>'
            f'<span class="meta">{len(L["jihozlar"])} ta jihoz · {len(L["sim"])} ta virtual mashq{(" · " + e(izoh)) if izoh else ""}</span><span class="lab-kj" aria-hidden="true">{em}</span></span></a>')
def lab_katalog():
    R = "../"
    nj = sum(len(L["jihozlar"]) for k, L in LABS.items() if not L.get("_hub")); ns = sum(len(L["sim"]) for k, L in LABS.items() if not L.get("_hub"))
    b = hero("", "Virtual laboratoriyalar", f"Har bir fan uchun virtual xona: jihozlar bilan tanishish (vazifasi, tuzilishi, ishlatish tartibi, xavfsizlik), darsda ko‘rsatish uchun slaydlar, jihozlarni ekranda virtual ishlatish va sinov. Jami {len([1 for L in LABS.values() if not L.get('_hub')])} ta fan laboratoriyasi va {len([1 for L in LABS.values() if L.get('_hub')])} ta amaliyot ustaxonasi: {nj} ta jihoz, {ns} ta virtual mashq.",
             crumbs=[("Fanlar", R), ("Virtual laboratoriyalar", None)],
             extra='<div class="fq"><label for="lq" class="sr">Laboratoriya yoki jihoz qidirish</label><input type="search" id="lq" class="q-big" placeholder="Jihoz yoki fan: multimetr, tikuv mashinasi, kompas…" autocomplete="off"></div>')
    um = ""; seen = set()
    for f in UMF:
        l = lab_of("umumtalim", f)
        if l and l not in seen:
            seen.add(l); um += lab_card(l, R, f["nomi"] if f["nomi"] != LABS[l]["nomi"] else "")
    ks = ""
    for sid, snom, yids in SOHA:
        h = ""
        for yid in yids:
            y = YID.get(yid)
            if not y:
                continue
            cs, sn = "", set()
            L2 = sorted([f for f in y["fanlar"] if f["toifa"] != "umumtalim"], key=lambda f: (f["toifa"] != "kasbiy", norm(f["nomi"])))
            for f in L2:
                l = lab_of(yid, f)
                if l and l not in sn:
                    sn.add(l); cs += lab_card(l, R)
            if cs:
                h += f'<div class="ys"><div class="ys-h"><h3>{e(ynom(y))}</h3><span class="meta">{len(sn)} ta laboratoriya</span></div><div class="grid g3">{cs}</div></div>'
        if h:
            ks += f'<section class="fsek" data-lsek><h2>{e(snom)}</h2>{h}</section>'
    b += f"""<section class="blk katalog"><div class="wrap">
<div class="note" style="margin-bottom:8px"><b>Qanday foydalaniladi?</b> Laboratoriyaga kiring → stollardagi jihozni bosib pasportini o‘qing → «Slaydlar» bo‘limini proyektorda ko‘rsating → «Virtual ishlatish»da jihozni ekranda ishlatib ko‘ring → «Sinov» bilan bilimni tekshiring. Natijalar shu qurilmada saqlanadi.</div>
<p class="muted small" id="lsoni" aria-live="polite"></p>
<section class="fsek" data-lsek><h2>Umumta’lim fanlari <span class="muted">barcha mutaxassisliklar uchun</span></h2><div class="grid g3">{um}</div></section>
{ks}
<div class="empty" id="lbosh" hidden><p><b>Hech narsa topilmadi.</b></p><p class="muted small">Boshqa so‘z bilan qidiring.</p></div>
</div></section>
<script>(function(){{var q=document.getElementById('lq'),c=[].slice.call(document.querySelectorAll('.lab-k')),n=document.getElementById('lsoni');
function nm(s){{return s.toLowerCase().replace(/[ʻʼ‘’`´'"«»“”]/g,'').replace(/\\s+/g,' ').trim();}}
function go(){{var w=nm(q.value).split(' ').filter(Boolean),k=0,seen={{}};c.forEach(function(a){{var ok=w.every(function(x){{return a.getAttribute('data-n').indexOf(x)>=0;}});a.hidden=!ok;if(ok&&!seen[a.getAttribute('href')]){{seen[a.getAttribute('href')]=1;k++;}}}});
[].forEach.call(document.querySelectorAll('.ys'),function(y){{y.hidden=!y.querySelector('.lab-k:not([hidden])');}});[].forEach.call(document.querySelectorAll('[data-lsek]'),function(s){{s.hidden=!s.querySelector('.lab-k:not([hidden])');}});
n.textContent=k+' ta laboratoriya';document.getElementById('lbosh').hidden=k>0;}}
q.addEventListener('input',go);go();}})();</script>"""
    page("lab/index.html", "Virtual laboratoriyalar", "Har bir fan uchun virtual laboratoriya: jihozlar bilan tanishish, slaydlar, virtual ishlatish va sinov — Toshkent tuman 1-son texnikumi.", b, active="lab/", scripts=("t1-kuvi.js",))

# ---------- kuvonch.uz sinf o'yinlari (Jonli viktorina, Arqon tortish…) — jonli ulanadi, u yerda yangilansa bu yerda ham yangilanadi ----------
KUV = "https://kuvonch.uz/"
KFAN = json.load(open(os.path.join(SRC, "kuvonch-oyinlar.json"), encoding="utf-8"))   # kuvonch.uz viktorina fanlari va arqon mavzu ID lari
FANMOS = [("chqbt", r"chaqiruv|chqbt|harbiy|favqulodda|fuqaro muhofaza|birinchi tibbiy"), ("sport", r"jismoniy tarbiya"), ("tarbiya", r"^tarbiya"), ("mat", r"matematika|algebra|geometriya"),
          ("fizika", r"fizika|elektrotexnika|elektr "), ("kimyo", r"kimyo"), ("biologiya", r"biolog|sanitariya|gigiyena"), ("geografiya", r"geografiya"),
          ("tarix", r"tarix"), ("informatika", r"informatika|kompyuter|axborot|dasturlash|tarmoq|veb|it-servis|raqamli"), ("ona", r"ona tili"),
          ("adabiyot", r"adabiyot"), ("rus", r"rus tili"), ("ingliz", r"ingliz|chet tili"), ("huquq", r"huquq|qonunchilik"),
          ("iqtisod", r"biznes|iqtisod|tadbirkor|marketing|menejment"), ("chizma", r"chizma"), ("ekologiya", r"ekolog"),
          ("avto", r"yo.?l harakati|haydovchi|avtotransport|toifadagi"), ("astronomiya", r"astronom")]
def kfan(nomi):
    n = norm(nomi)
    for k, rx in FANMOS:
        if k in KFAN and re.search(rx, n):
            return k
    return None
OYINLAR = [("viktorina", "Jonli viktorina", "Kahoot uslubida: savollar doskada, o‘quvchilar telefondan javob beradi. Shohsupa, reyting va natijalarni yuklab olish."),
           ("arqon", "Arqon tortish", "1–10 jamoa bellashadi: to‘g‘ri javob arqonni o‘z tomoniga tortadi. Doska, telefon yoki aqlli doskada."),
           ("jamoa", "Jamoaviy o‘yin", "Har bir o‘yin uchun xona kodi bilan 2–4 jamoa: o‘quvchilar o‘z telefonlaridan qo‘shiladi."),
           ("sinf", "Sinf o‘yinlari markazi", "Arqon tortish va jonli viktorina haqida qo‘llanma va sozlamalar."),
           ("barcha", "Barcha o‘yinlar", "Kuvonch Academy’dagi barcha ta’limiy o‘yinlar: mantiq, xotira, milliy o‘yinlar va boshqalar.")]
OYIN_FAYL = {"viktorina": "viktorina.html", "arqon": "arqon.html", "jamoa": "jamoa.html", "sinf": "sinf-oyinlari.html", "barcha": "oyinlar.html"}
OYIN_DIR = "oyin/"   # kuvonch.uz o'yinlarining shu saytdagi nusxasi (_manba/kuvonch/sinxron.py, avtomatik yangilanadi)
def kuv_url(o, fan=None, R=""):
    """Sinf o'yinlari shu saytning o'zida (oyin/) ochiladi; «Barcha o'yinlar» — kuvonch.uz'da. Fan/mavzu oldindan tanlanadi."""
    u = (KUV if o == "barcha" else R + OYIN_DIR) + OYIN_FAYL[o]
    if fan and o == "viktorina":
        u += "?fan=" + fan
    elif fan and o == "arqon" and 0 < len(KFAN[fan]["a"]) <= 30:
        u += "?mavzu=" + ",".join(KFAN[fan]["a"])
    return u
def oyin_qator(R, nomi):
    k = kfan(nomi)
    if k:
        return (f'<div class="oyin-q"><span class="oyin-q-t">Sinf o‘yini · <b>{e(KFAN[k]["nom"])}</b></span>'
                f'<a class="btn sm" href="{e(kuv_url("viktorina", k, R))}">Jonli viktorina</a>'
                f'<a class="btn ghost sm" href="{e(kuv_url("arqon", k, R))}">Arqon tortish</a>'
                f'<a class="kv-l" href="{R}oyinlar/">Boshqa o‘yinlar</a></div>')
    return f'<div class="oyin-q"><span class="oyin-q-t">Sinf o‘yinlari — jonli viktorina, arqon tortish</span><a class="btn ghost sm" href="{R}oyinlar/">O‘yinni tanlash</a></div>'

def oyinlar():
    R = "../"
    opts = '<option value="">Fan tanlanmagan (o‘yin ichida tanlanadi)</option>' + "".join(f'<option value="{k}">{e(v["nom"])}</option>' for k, v in sorted(KFAN.items(), key=lambda kv: norm(kv[1]["nom"])))
    def tugma(o):
        if o == "barcha":
            return f'<a class="btn ghost sm" data-o="{o}" target="_blank" rel="noopener" href="{e(kuv_url(o))}">kuvonch.uz’da ochish ↗</a>'
        return f'<a class="btn sm" data-o="{o}" href="{e(kuv_url(o, None, R))}">Boshlash</a>'
    cards = "".join(f'<div class="card oyin-k"><span class="oyin-i">{i + 1:02d}</span><h3>{t}</h3><p class="muted small">{d}</p>{tugma(o)}</div>' for i, (o, t, d) in enumerate(OYINLAR))
    cfg = {"loc": R + OYIN_DIR, "f": OYIN_FAYL, "a": {k: v["a"] for k, v in KFAN.items() if 0 < len(v["a"]) <= 30}}
    b = hero("", "Sinf o‘yinlari", "Jonli viktorina, arqon tortish va jamoaviy o‘yin — butun sinf bilan, proyektor, aqlli doska va o‘quvchilar telefonlarida. O‘yinlar shu saytning o‘zida ochiladi; kuvonch.uz’da kuchaytirilsa yoki yangi savollar qo‘shilsa, bu yerga ham avtomatik o‘tadi.", crumbs=[("Fanlar", R), ("Sinf o‘yinlari", None)])
    b += f"""<section class="blk"><div class="wrap">
<div class="fbar"><label class="fsel"><span class="sr">Fan</span><select id="oyin-fan">{opts}</select></label><span class="muted small">Fanni tanlasangiz, viktorina va arqon tortish shu fan savollari bilan ochiladi.</span></div>
<div class="grid g3" style="margin-top:14px">{cards}</div>
<p class="small muted" style="margin-top:18px">Har bir fan sahifasida ham shu fanga mos «Jonli viktorina» va «Arqon tortish» tugmalari bor. O‘yinlar: Kuvonch Academy (kuvonch.uz).</p>
</div></section>
<script>(function(){{var C={json.dumps(cfg, ensure_ascii=False)},s=document.getElementById('oyin-fan');
function u(o,f){{var x=C.loc+C.f[o];if(f&&o==='viktorina')x+='?fan='+f;else if(f&&o==='arqon'&&C.a[f])x+='?mavzu='+C.a[f].join(',');return x;}}
s.addEventListener('change',function(){{Array.prototype.forEach.call(document.querySelectorAll('[data-o]'),function(a){{var o=a.getAttribute('data-o');if(o!=='barcha')a.href=u(o,s.value);}});}});}})();</script>"""
    page("oyinlar/index.html", "Sinf o‘yinlari", "Jonli viktorina, arqon tortish va boshqa sinf o‘yinlari — fanlar bo‘yicha, butun sinf bilan.", b, active="oyinlar/")

# ---------- Bosh sahifa: fanlar katalogi ----------
def bosh():
    R = ""
    nk = sum(1 for y in Y for f in y["fanlar"] if f["toifa"] != "umumtalim")
    opts = "".join(f'<option value="{y["id"]}">{e(ynom(y))}</option>' for y in YS)
    extra = (f'<p class="lead">Kasbiy fanlar har bir mutaxassislik bo‘yicha alohida, umumta’lim fanlari esa hammasi uchun bitta. Har bir fan: TMR, texnologik xaritalar, ma’ruzalar va o‘quv-uslubiy majmua.</p>'
             f'<div class="fq"><label for="fq" class="sr">Fanni qidirish</label>'
             f'<input type="search" id="fq" class="q-big" placeholder="Fan, mavzu yoki mutaxassislik nomi…" autocomplete="off"></div>'
             + (f'<div class="chips" style="margin-top:14px"><a class="chip" href="lab/">🔬 Virtual laboratoriyalar — {len([1 for L in LABS.values() if not L.get("_hub")])} ta</a><a class="chip" href="oyinlar/">🎮 Sinf o‘yinlari</a></div>' if LABS else ""))
    b = hero("", "Fanlar", "", extra=extra, small=False, fasl=True)
    seg = (f'<button type="button" data-tf="" aria-pressed="true">Hammasi</button>'
           f'<button type="button" data-tf="kasbiy" aria-pressed="false">Kasbiy fanlar <span>{nk}</span></button>'
           f'<button type="button" data-tf="umumtalim" aria-pressed="false">Umumta’lim fanlari <span>{len(UMF)}</span></button>')
    ks = ""
    for y in YS:
        L = [f for f in y["fanlar"] if f["toifa"] != "umumtalim"]
        L.sort(key=lambda f: (f["toifa"] != "kasbiy", norm(f["nomi"])))
        cards = "".join(fk_card(y["id"], f, R, f'{sem_txt(f["jami_soat"])} · {sum(f["jami_soat"].values())} soat') for f in L)
        ks += (f'<div class="ys" data-y="{y["id"]}"><div class="ys-h"><h3>{e(ynom(y))}</h3><span class="meta">{e(y["kod"])} · {e(y["talim_shakli"].lower())} ta’lim · {y["hozirgi_kurs"]}-kurs · {len(L)} ta fan</span></div>'
               f'<div class="grid g3">{cards}</div></div>')
    us = "".join(fk_card("umumtalim", f, R, f'{sem_txt(f["jami_soat"])} · barcha mutaxassisliklar') for f in UMF)
    b += f"""<section class="blk katalog"><div class="wrap">
<div class="fbar">
<div class="seg" role="group" aria-label="Fan turi">{seg}</div>
<label class="fsel"><span class="sr">Mutaxassislik</span><select id="fy"><option value="">Barcha mutaxassisliklar</option>{opts}</select></label>
<label class="chk"><input type="checkbox" id="fm"> Faqat materiali borlar</label>
</div>
<p class="muted small" id="fsoni" aria-live="polite"></p>
<div id="fmav" hidden><h2>Mavzular</h2><div class="q-res"></div></div>
<section class="fsek" data-sec="kasbiy"><h2>Kasbiy fanlar <span class="muted">mutaxassisliklar bo‘yicha</span></h2>{ks}</section>
<section class="fsek" data-sec="umumtalim"><h2>Umumta’lim fanlari <span class="muted">barcha mutaxassisliklar uchun bitta</span></h2><div class="grid g3">{us}</div></section>
<div class="empty" id="fbosh" hidden><p><b>Hech narsa topilmadi.</b></p><p class="muted small">Qidiruv so‘zini qisqartiring yoki filtrni olib tashlang.</p><button type="button" class="btn sm" id="ftoz">Filtrlarni tozalash</button></div>
<p class="small muted" style="margin-top:22px">Fan va soatlar: kasb-emis.edu.uz o‘quv rejalari, 05.11.2026. Savollar bo‘lsa — pastdagi Kuvi AI’ga yozing.</p>
</div></section>"""
    page("index.html", NOM, f"{NOM} fanlar e-bazasi: kasbiy fanlar va umumta’lim fanlari bo‘yicha TMR, texnologik xaritalar, ma’ruzalar va o‘quv-uslubiy majmualar.",
         b, active="", scripts=("bulut.js", "fanlar.js", "t1-kuvi.js"))

EMPTY = {
    "tmr": "Taqvim-mavzu reja hali joylanmagan.", "xarita": "Texnologik xaritalar hali joylanmagan.", "maruza": "Ma’ruza matnlari hali joylanmagan.",
    "amaliy": "Amaliy mashg‘ulot ishlanmalari hali joylanmagan.", "mustaqil": "Mustaqil ta’lim topshiriqlari hali joylanmagan.", "nazorat": "Nazorat materiallari (test, bilet) hali joylanmagan.",
    "glossariy": "Glossariy hali joylanmagan.", "oum": "O‘quv-uslubiy majmua hali joylanmagan.", "fayllar": "Qo‘shimcha fayllar (taqdimot, video, rasm) hali joylanmagan.",
}
TABS = [("tmr", "TMR"), ("xarita", "Texnologik xaritalar"), ("maruza", "Ma’ruzalar"), ("amaliy", "Amaliy"), ("mustaqil", "Mustaqil ish"), ("nazorat", "Nazorat"), ("glossariy", "Glossariy"), ("oum", "O‘UM"), ("fayllar", "Fayllar")]

def fan_page(y, f, cur=None, um=None):
    R = "../../../../"
    sems = sorted(f["jami_soat"].keys(), key=int)
    if cur is None:
        cur = "3" if (y["hozirgi_kurs"] == 2 and "3" in sems) else sems[-1] if y["hozirgi_kurs"] == 2 else sems[0]
    nom, c = TOIFA[f["toifa"]]
    rtr = {s: {"json": R + v["json"], "base": R + v["base"], "paket": R + v["paket"], "manba": v["manba"]} for (yi, fi, s), v in STATIK.items() if yi == y["id"] and fi == f["id"]}
    kab = f'{R}kabinet/?y={y["id"]}&amp;f={f["id"]}'
    if um:
        extra = f'<p class="lead"><span class="tag {c}" style="background:#fff">{nom}</span> &nbsp;Barcha mutaxassisliklar uchun umumiy fan</p>'
        crumbs = [("Fanlar", R), ("Umumta’lim fanlari", R + "?t=umumtalim"), (f["nomi"], None)]
    else:
        extra = (f'<p class="lead"><span class="tag {c}" style="background:#fff">{nom}</span> &nbsp;{e(ynom(y))} · {y["hozirgi_kurs"]}-kurs</p>'
                 + (f'<p class="small" style="opacity:.8">kasb-emis’dagi nomi: {e(f["nomi_kasb_emis"])}</p>' if f.get("nomi_kasb_emis") else ""))
        crumbs = [("Fanlar", R), (ynom(y), R + "?y=" + y["id"]), (f["nomi"], None)]
    b = hero("", e(f["nomi"]), "", crumbs=crumbs, extra=extra)
    semtabs = ""
    if len(sems) > 1:
        semtabs = '<div data-sems data-def="' + cur + '"><div class="sem-tabs" role="tablist">' + "".join(f'<button data-sem="{s}">{s}-semestr · {f["jami_soat"][s]} soat</button>' for s in sems) + "</div></div>"
    tb = "".join(f'<button data-t="{k}">{t}<span class="cnt"></span></button>' for k, t in TABS)
    pn = "".join(f'<div data-p="{k}"><div class="empty">{ico("fayl", "x")}<p><b>{EMPTY[k]}</b></p><p class="muted small">Bu fandan dars beradigan o‘qituvchi materiallarni kabinet orqali yuklashi mumkin — AI ularni avtomatik tayyorlaydi.</p><a class="btn sm" href="{kab}">Material joylash</a></div></div>' for k, _ in TABS)
    soat_jad = ""
    if um:
        rows = "".join(f'<tr><td>{e(ynom(yy))}</td>' + "".join(f'<td class=n>{ff["jami_soat"].get(s, "—")}</td>' for s in sems) + "</tr>" for yy, ff in sorted(um, key=lambda t: norm(ynom(t[0]))))
        soat_jad = (f'<details class="mv" style="margin-top:22px"><summary>Soatlar mutaxassisliklar bo‘yicha</summary><div class="ic"><p class="small muted">Yuqoridagi soatlar — ko‘pchilik mutaxassisliklardagi qiymat. Ayrim o‘quv rejalarda farq qiladi:</p>'
                    f'<div class="tbl-w"><table><thead><tr><th>Mutaxassislik</th>' + "".join(f"<th class=n>{s}-sem</th>" for s in sems) + f"</tr></thead><tbody>{rows}</tbody></table></div></div></details>")
    b += f"""<section class="blk"><div class="wrap">
{lab_qator(R, y["id"], f)}{oyin_qator(R, f["nomi"])}
<div id="fan" data-y="{y['id']}" data-f="{f['id']}" data-fan="{e(f['nomi'])}" data-yn="{e(ynom(y) if not um else 'Umumta’lim (barcha mutaxassisliklar)')}" data-toifa="{f['toifa']}" data-def="{cur}" data-plan='{e(json.dumps(plan_of(f)))}' data-rtr='{e(json.dumps(rtr, ensure_ascii=False))}'>
{semtabs}
<p class="note" data-soat style="margin-bottom:18px"></p>
<div data-tabs data-hash><div class="tabs" role="tablist">{tb}</div>{pn}</div>
{soat_jad}
</div></div></section>"""
    page(f"yonalish/{y['id']}/fan/{f['id']}/index.html", f"{f['nomi']}" + ("" if um else f" — {ynom(y)}"),
         f"«{f['nomi']}» fani" + (" (umumta’lim, barcha mutaxassisliklar)" if um else f" ({ynom(y)})") + ": TMR, texnologik xaritalar, ma’ruzalar, amaliy ishlar, nazorat va O‘UM.",
         b, active="", scripts=("rtr.js", "bulut.js", "korinish.js", "fan.js", "t1-kuvi.js"))

# ---------- Eski manzillar: yangi katalogga yoki /eski/ ga yo'naltirish ----------
def redir(path, target, title):
    fp = os.path.join(OUT, path); os.makedirs(os.path.dirname(fp), exist_ok=True)
    js = json.dumps(target)
    open(fp, "w", encoding="utf-8").write(
        f'<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>{e(title)}</title>'
        f'<script>var t={js};location.replace(t+(t.indexOf("?")<0?location.search:"")+location.hash);</script>'
        f'<meta http-equiv="refresh" content="0; url={e(target)}"></head><body><p><a href="{e(target)}">{e(title)}</a></p></body></html>')

def yonaltirish():
    for y in Y:
        redir(f"yonalish/{y['id']}/index.html", f"../../?y={y['id']}", f"{y['qisqa']} — fanlar")
    for g in G:
        redir(f"guruh/{g['guruh']}/index.html", f"../../?y={g['yonalish_id']}", f"{g['guruh']} — fanlar")
    for y in Y:
        for f in y["fanlar"]:
            if f["toifa"] == "umumtalim":
                redir(f"yonalish/{y['id']}/fan/{f['id']}/index.html", f"../../../umumtalim/fan/{f['id']}/", f["nomi"])
    redir("yonalish/umumtalim/index.html", "../../?t=umumtalim", "Umumta’lim fanlari")
    redir("yonalishlar/index.html", "../", "Fanlar")
    redir("guruhlar/index.html", "../", "Fanlar")
    redir("qidiruv/index.html", "../", "Fanlar")
    redir("haqida/index.html", "../eski/haqida/", "Texnikum haqida (eski versiya)")
    redir("joylashuv/index.html", "../eski/joylashuv/", "Joylashuv (eski versiya)")

def kabinet():
    R = "../"
    b = hero("", "O‘qituvchi kabineti", "Email yoki Google akkaunt bilan kiring — akkaunt darhol faollashadi. Fan hujjatlarini yuklang: AI ularni tasniflaydi, TMR tuzadi va e-bazaga tayyorlaydi.", crumbs=[("Fanlar", R), ("O‘qituvchi kabineti", None)])
    b += '<section class="blk"><div class="wrap"><div id="kabinet"></div></div></section>'
    page("kabinet/index.html", "O‘qituvchi kabineti", "O‘qituvchilar uchun kirish va materiallarni joylash.", b, scripts=("bulut.js", "kabinet.js", "t1-kuvi.js"), noindex=True)

def admin():
    R = "../"
    b = hero("", "Admin panel", "", crumbs=[("Fanlar", R), ("Admin panel", None)])
    b += '<section class="blk"><div class="wrap"><div id="admin"></div></div></section>'
    page("admin/index.html", "Admin panel", "Boshqaruv.", b, scripts=("bulut.js", "admin.js"), noindex=True)

def xato404():
    b = hero("", "Sahifa topilmadi", "Bunday sahifa yo‘q yoki ko‘chirilgan.", extra='<div class="cta" style="margin-top:20px"><a class="btn light" href="/">Fanlar</a><a class="btn light" href="/eski/">Eski versiya</a></div>')
    page("404.html", "Sahifa topilmadi", "Sahifa topilmadi.", b, noindex=True, abs_root=True)

# ---------- Ma'lumot fayllari ----------
def data_files():
    os.makedirs(os.path.join(OUT, "data"), exist_ok=True)
    FK = ("id", "nomi", "toifa", "jami_soat", "auditoriya_soat_taxminiy")
    site = {"yonalishlar": [dict({k: UMY[k] for k in ("id", "qisqa", "mutaxassislik", "kod", "hozirgi_kurs", "talim_shakli")}, fanlar=[{k: f[k] for k in FK} for f in UMF])]
            + [dict({k: y[k] for k in ("id", "mutaxassislik", "kod", "hozirgi_kurs", "talim_shakli")}, qisqa=ynom(y), fanlar=[{k: f[k] for k in FK} for f in y["fanlar"] if f["toifa"] != "umumtalim"]) for y in YS]}
    json.dump(site, open(os.path.join(OUT, "data", "malumot.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    Q = []
    for y in YS:
        for f in y["fanlar"]:
            if f["toifa"] != "umumtalim":
                Q.append({"k": "f", "t": f["nomi"], "s": f'{ynom(y)} · {TOIFA[f["toifa"]][0]}', "u": f'yonalish/{y["id"]}/fan/{f["id"]}/'})
    for f in UMF:
        Q.append({"k": "f", "t": f["nomi"], "s": "Umumta’lim fani · barcha mutaxassisliklar", "u": f'yonalish/umumtalim/fan/{f["id"]}/'})
    if RTR_TIKUV:
        for t in RTR_TIKUV["topics"]:
            Q.append({"k": "m", "t": t["nomi"], "s": f'Zamonaviy tikuv jihozlari · {t["id"]} · {t["turi"]}', "u": "yonalish/moda-tikuv-texnologiyasi/fan/zamonaviy-tikuv-jihozlari/#" + ("amaliy" if t["turi"] == "Amaliy" else "maruza")})
    for lid, L in LABS.items():
        if L.get("_hub"):
            continue
        Q.append({"k": "m", "t": "Virtual laboratoriya: " + L["nomi"], "s": f'{len(L["jihozlar"])} ta jihoz · {len(L["sim"])} ta virtual mashq', "u": f"lab/{lid}/"})
        for j in L["jihozlar"]:
            Q.append({"k": "m", "t": f'{j.get("e", "")} {j["nomi"]}'.strip(), "s": "Virtual laboratoriya · " + L["nomi"], "u": f'lab/{lid}/#j-{j["id"]}'})
    json.dump(Q, open(os.path.join(OUT, "data", "qidiruv.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    if RTR_TIKUV:
        os.makedirs(os.path.join(OUT, "data", "rtr"), exist_ok=True)
        json.dump(RTR_TIKUV, open(os.path.join(OUT, "data", "rtr", "zamonaviy-tikuv-jihozlari.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

def extras():
    urls = ["", "lab/", "oyinlar/"] + [f"lab/{k}/" for k in LABS] + [f'yonalish/{y["id"]}/fan/{f["id"]}/' for y in Y for f in y["fanlar"] if f["toifa"] != "umumtalim"] + [f'yonalish/umumtalim/fan/{f["id"]}/' for f in UMF]
    open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{DOMEN}/{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nDisallow: /kabinet/\nDisallow: /admin/\nDisallow: /eski/\nDisallow: /oyin/\nSitemap: {DOMEN}/sitemap.xml\n")
    open(os.path.join(OUT, "CNAME"), "w").write("texnikum1son.uz\n")
    open(os.path.join(OUT, ".nojekyll"), "w").write("")
    shutil.copy(os.path.join(SRC, "assets", "favicon.ico"), os.path.join(OUT, "favicon.ico"))
    os.makedirs(os.path.join(OUT, "assets"), exist_ok=True)
    for fn in os.listdir(os.path.join(SRC, "assets")):
        shutil.copy(os.path.join(SRC, "assets", fn), os.path.join(OUT, "assets", fn))
    open(os.path.join(OUT, "assets", "logo.svg"), "w", encoding="utf-8").write(LOGO.replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"').replace("var(--a)", "#b5541b"))

ustaxonalar()
bosh(); oyinlar(); yonaltirish(); kabinet(); admin(); xato404()
if LABS:
    lab_katalog()
    for _lid in LABS:
        lab_page(_lid)
for y in Y:
    for f in y["fanlar"]:
        if f["toifa"] != "umumtalim":
            fan_page(y, f)
for f in UMF:
    fan_page(UMY, f, cur="1", um=UM[f["id"]]["L"])
data_files(); extras()
print("Sahifalar:", sum(len(fs) for _, _, fs in os.walk(OUT)))
