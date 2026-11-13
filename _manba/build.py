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
NAV = [("", "Fanlar"), ("eski/", "Eski versiya")]

def page(path, title, desc, body, active=None, scripts=(), noindex=False, abs_root=False):
    depth = path.count("/")
    R = "/" if abs_root else "../" * depth
    nav = "".join(f'<a href="{R}{u}"{" aria-current=page" if active == u else ""}>{t}</a>' for u, t in NAV)
    full_title = f"{title} · {NOM} e-bazasi" if title != NOM else f"Fanlar — {NOM} e-bazasi"
    canon = DOMEN + "/" + re.sub(r"index\.html$", "", path)
    sc = "".join(f'<script src="{R}assets/{s}?v=2" defer></script>' for s in ("sayt.js",) + tuple(scripts))
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
<meta name="theme-color" content="#8a3a12">
<link rel="icon" href="{R}assets/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap">
<link rel="stylesheet" href="{R}assets/sayt.css?v=2">
<script>(function(){{var m=new Date(Date.now()+(new Date().getTimezoneOffset()+300)*6e4).getMonth(),q=new URLSearchParams(location.search).get('fasl');document.documentElement.setAttribute('data-fasl',/^(kuz|qish|bahor|yoz)$/.test(q||'')?q:(m==11||m<2?'qish':m<5?'bahor':m<8?'yoz':'kuz'));}})();</script>
</head>
<body data-root="{R}">
<a class="sr" href="#asosiy">Asosiy qismga o‘tish</a>
<header class="top"><div class="wrap">
<a class="brand" href="{R}" aria-label="Fanlar — bosh sahifa">{LOGO}<span><b>{NOM}</b><span>Fanlar e-bazasi</span></span></a>
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

# ---------- Bosh sahifa: fanlar katalogi ----------
def bosh():
    R = ""
    nk = sum(1 for y in Y for f in y["fanlar"] if f["toifa"] != "umumtalim")
    opts = "".join(f'<option value="{y["id"]}">{e(ynom(y))}</option>' for y in YS)
    extra = (f'<p class="lead">Kasbiy fanlar har bir mutaxassislik bo‘yicha alohida, umumta’lim fanlari esa hammasi uchun bitta. Har bir fan: TMR, texnologik xaritalar, ma’ruzalar va o‘quv-uslubiy majmua.</p>'
             f'<div class="fq"><label for="fq" class="sr">Fanni qidirish</label>'
             f'<input type="search" id="fq" class="q-big" placeholder="Fan, mavzu yoki mutaxassislik nomi…" autocomplete="off"></div>')
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
<div id="fan" data-y="{y['id']}" data-f="{f['id']}" data-fan="{e(f['nomi'])}" data-yn="{e(ynom(y) if not um else 'Umumta’lim (barcha mutaxassisliklar)')}" data-toifa="{f['toifa']}" data-def="{cur}" data-plan='{e(json.dumps(plan_of(f)))}' data-rtr='{e(json.dumps(rtr, ensure_ascii=False))}'>
{semtabs}
<p class="note" data-soat style="margin-bottom:18px"></p>
<div data-tabs data-hash><div class="tabs" role="tablist">{tb}</div>{pn}</div>
{soat_jad}
</div></div></section>"""
    page(f"yonalish/{y['id']}/fan/{f['id']}/index.html", f"{f['nomi']}" + ("" if um else f" — {ynom(y)}"),
         f"«{f['nomi']}» fani" + (" (umumta’lim, barcha mutaxassisliklar)" if um else f" ({ynom(y)})") + ": TMR, texnologik xaritalar, ma’ruzalar, amaliy ishlar, nazorat va O‘UM.",
         b, active="", scripts=("rtr.js", "bulut.js", "fan.js", "t1-kuvi.js"))

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
    json.dump(Q, open(os.path.join(OUT, "data", "qidiruv.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    if RTR_TIKUV:
        os.makedirs(os.path.join(OUT, "data", "rtr"), exist_ok=True)
        json.dump(RTR_TIKUV, open(os.path.join(OUT, "data", "rtr", "zamonaviy-tikuv-jihozlari.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

def extras():
    urls = [""] + [f'yonalish/{y["id"]}/fan/{f["id"]}/' for y in Y for f in y["fanlar"] if f["toifa"] != "umumtalim"] + [f'yonalish/umumtalim/fan/{f["id"]}/' for f in UMF]
    open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{DOMEN}/{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nDisallow: /kabinet/\nDisallow: /admin/\nDisallow: /eski/\nSitemap: {DOMEN}/sitemap.xml\n")
    open(os.path.join(OUT, "CNAME"), "w").write("texnikum1son.uz\n")
    open(os.path.join(OUT, ".nojekyll"), "w").write("")
    os.makedirs(os.path.join(OUT, "assets"), exist_ok=True)
    for fn in os.listdir(os.path.join(SRC, "assets")):
        shutil.copy(os.path.join(SRC, "assets", fn), os.path.join(OUT, "assets", fn))
    open(os.path.join(OUT, "assets", "logo.svg"), "w", encoding="utf-8").write(LOGO.replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"').replace("var(--a)", "#b5541b"))

bosh(); yonaltirish(); kabinet(); admin(); xato404()
for y in Y:
    for f in y["fanlar"]:
        if f["toifa"] != "umumtalim":
            fan_page(y, f)
for f in UMF:
    fan_page(UMY, f, cur="1", um=UM[f["id"]]["L"])
data_files(); extras()
print("Sahifalar:", sum(len(fs) for _, _, fs in os.walk(OUT)))
