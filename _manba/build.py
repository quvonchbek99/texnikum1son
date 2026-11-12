#!/usr/bin/env python3
"""texnikum1son.uz — statik sayt generatori.
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
NAV = [("", "Bosh sahifa"), ("yonalishlar/", "Yo‘nalishlar"), ("guruhlar/", "Guruhlar"), ("haqida/", "Texnikum haqida"), ("joylashuv/", "Joylashuv"), ("qidiruv/", "Qidiruv")]

def page(path, title, desc, body, active=None, scripts=(), noindex=False, abs_root=False):
    depth = path.count("/")
    R = "/" if abs_root else "../" * depth
    nav = "".join(f'<a href="{R}{u}"{" aria-current=page" if active == u else ""}>{t}</a>' for u, t in NAV)
    full_title = f"{title} · {NOM} e-bazasi" if title != NOM else f"{NOM} — elektron o‘quv-uslubiy baza"
    canon = DOMEN + "/" + re.sub(r"index\.html$", "", path)
    sc = "".join(f'<script src="{R}assets/{s}?v=1" defer></script>' for s in ("sayt.js",) + tuple(scripts))
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
<link rel="stylesheet" href="{R}assets/sayt.css?v=1">
<script>(function(){{var m=new Date(Date.now()+(new Date().getTimezoneOffset()+300)*6e4).getMonth(),q=new URLSearchParams(location.search).get('fasl');document.documentElement.setAttribute('data-fasl',/^(kuz|qish|bahor|yoz)$/.test(q||'')?q:(m==11||m<2?'qish':m<5?'bahor':m<8?'yoz':'kuz'));}})();</script>
</head>
<body data-root="{R}">
<a class="sr" href="#asosiy">Asosiy qismga o‘tish</a>
<header class="top"><div class="wrap">
<a class="brand" href="{R}" aria-label="{NOM} — bosh sahifa">{LOGO}<span><b>{NOM}</b><span>Elektron o‘quv-uslubiy baza</span></span></a>
<button class="burger" aria-label="Menyu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav class="nav" aria-label="Asosiy menyu">{nav}<a class="btn sm" href="{R}kabinet/">O‘qituvchi kabineti</a></nav>
</div></header>
<main id="asosiy">
{body}
</main>
<footer class="foot"><div class="wrap">
<div class="cols">
<div><h4>{NOM}</h4><p>{e(MANZIL)}</p><p>Ish vaqti: dushanba–shanba, 08:00–17:00</p></div>
<div><h4>Bo‘limlar</h4><ul><li><a href="{R}yonalishlar/">Yo‘nalishlar va fanlar</a></li><li><a href="{R}guruhlar/">Guruhlar</a></li><li><a href="{R}haqida/">Texnikum faoliyati</a></li><li><a href="{R}joylashuv/">Joylashuv</a></li></ul></div>
<div><h4>O‘qituvchilar uchun</h4><ul><li><a href="{R}kabinet/">Kabinetga kirish</a></li><li><a href="{R}kabinet/">Material joylash (AI yordamida)</a></li></ul></div>
<div><h4>Hamkor loyiha</h4><ul><li><a href="https://kuvonch.uz" rel="noopener">Kuvonch Academy · kuvonch.uz</a></li></ul></div>
</div>
<div class="copy"><span>© 2026 {NOM} e-bazasi</span><span>Fan va soatlar: kasb-emis.edu.uz o‘quv rejalari (05.11.2026)</span></div>
</div></footer>
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
            + f"<h1>{h1}</h1>" + (f'<p class="lead" data-fasl-matn>{lead}</p>' if lead else "") + extra + f"</div>{HILLS}</section>")

def soat_sum(y, s):
    return sum(f["jami_soat"].get(s, 0) for f in y["fanlar"])

def plan_of(f):
    return {s: {"jami": f["jami_soat"][s], "auditoriya": f["auditoriya_soat_taxminiy"].get(s)} for s in f["jami_soat"]}

def guruh_chips(gs, R, cls="chip"):
    return "".join(f'<a class="{cls}" href="{R}guruh/{g["guruh"]}/">{g["guruh"]}</a>' for g in gs)

# ---------- Bosh sahifa ----------
def bosh():
    R = ""
    gr25 = [g for g in G if g["guruh"].endswith("-25")]; gr26 = [g for g in G if g["guruh"].endswith("-26")]
    oquvchi = sum(g["oquvchilar_soni_05_11_2026"] for g in G)
    mut = len({y["kod"] for y in Y}); fan_n = len(MAL["fanlar_umumiy_royxat"])
    extra = (f'<div class="bugun" data-bugun></div><div class="cta"><a class="btn" href="#guruh">Guruhingizni tanlang</a><a class="btn light" href="yonalishlar/">Yo‘nalishlar va fanlar</a></div>'
             f'<div id="guruh" style="margin-top:26px"><p class="small" style="opacity:.85;margin-bottom:8px">2-kurs (2025-yil qabuli)</p><div class="chips">{guruh_chips(gr25, R)}</div>'
             f'<p class="small" style="opacity:.85;margin:14px 0 8px">1-kurs (2026-yil qabuli)</p><div class="chips">{guruh_chips(gr26, R)}</div></div>')
    b = hero('<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z"/></svg> ',
             f"{NOM}", "Barcha yo‘nalishlar, fanlar va o‘quv-uslubiy materiallar bir joyda.", extra=extra, small=False, fasl=True)
    b += f"""<section class="blk"><div class="wrap">
<div class="grid g4">
<div class="card stat"><b>{mut}</b>mutaxassislik bo‘yicha kadrlar tayyorlanadi</div>
<div class="card stat"><b>{len(G)}</b>guruh — 1 va 2-kurslar</div>
<div class="card stat"><b>{oquvchi}</b>o‘quvchi ushbu guruhlarda tahsil oladi</div>
<div class="card stat"><b>{fan_n}</b>fan va modul e-bazada</div>
</div><p class="small muted" style="margin-top:10px">Manba: {STAT_SOURCE}.</p></div></section>"""
    cards = ""
    for k, t, ids in SOHA:
        lst = "".join(f'<li><a href="yonalish/{i}/">{e(YID[i]["qisqa"])}</a> <span class="muted small">{", ".join(x["guruh"] for x in GOF[i])}</span></li>' for i in ids)
        cards += f'<div class="card">{ico(k)}<h3>{t}</h3><ul style="padding-left:1.1em;margin:0">{lst}</ul></div>'
    b += f"""<section class="blk" style="padding-top:0"><div class="wrap"><div class="blk-h"><div><h2>Yo‘nalishlar</h2><p class="muted">Har bir yo‘nalishning kasbiy fanlari, amaliyoti va umumta’lim fanlari alohida ko‘rsatilgan.</p></div><a class="btn ghost" href="yonalishlar/">Barchasi →</a></div>
<div class="grid g2">{cards}</div></div></section>"""
    if RTR_TIKUV:
        T = RTR_TIKUV["topics"]; tests = sum(len(t["test"]) for t in T) + len(RTR_TIKUV["yakuniy"]["test"])
        b += f"""<section class="blk" style="padding-top:0"><div class="wrap"><div class="blk-h"><div><h2>Yangi materiallar</h2><p class="muted">O‘qituvchilar tayyorlagan to‘liq fan resurslari.</p></div></div>
<a class="card" href="yonalish/moda-tikuv-texnologiyasi/fan/zamonaviy-tikuv-jihozlari/" style="display:grid;grid-template-columns:minmax(0,1fr);gap:6px">
<span class="tag k" style="justify-self:start">Kasbiy fan · 08-26</span><h3 style="font-size:22px">Zamonaviy tikuv jihozlari</h3>
<p class="muted" style="margin:0">Moda va tikuv ishlab chiqarish texnologiyasi · tuzuvchi: {e(RTR_TIKUV["meta"]["muallif"])}</p>
<p style="margin:6px 0 0"><b>{len(T)}</b> mavzu · <b>{len(T)}</b> video dars · <b>{tests}</b> test savoli · <b>{len(RTR_TIKUV["glossariy"])}</b> atama · TMR, texnologik xaritalar va O‘UM</p></a></div></section>"""
    b += f"""<section class="blk" style="padding-top:0"><div class="wrap"><div class="card" style="padding:28px">
<div class="blk-h"><div>{ico("ai")}<h2>O‘qituvchilar uchun: hujjatlarni yuklang — AI tayyorlaydi</h2><p class="muted">Login va parol bilan kiring, ZIP arxiv yoki Word, PDF, PowerPoint fayllarini tashlang. Sun’iy intellekt har bir faylning turini va dars raqamini aniqlaydi, TMRni tuzadi, soatlarni o‘quv reja bilan solishtiradi va yetishmayotgan texnologik xaritalarning qoralamasini tayyorlaydi.</p></div><a class="btn" href="kabinet/">Kabinetga kirish</a></div>
<div class="steps"><div><b>Kiring</b><p class="small muted">Admin tasdiqlagan o‘qituvchi akkaunti.</p></div><div><b>Yuklang</b><p class="small muted">ZIP, .docx, .pdf, .pptx, .xlsx yoki RTR paketi.</p></div><div><b>AI tayyorlaydi</b><p class="small muted">Tasniflash, TMR, xarita qoralamalari.</p></div><div><b>Saytda</b><p class="small muted">Fan sahifasida o‘quvchi va hamkasblar uchun ochiq.</p></div></div>
</div></div></section>"""
    b += f"""<section class="blk" style="padding-top:0"><div class="wrap"><div class="grid g2">
<div class="card">{ico("joy")}<h3>Joylashuv</h3><p>{e(MANZIL)}</p><a class="btn ghost sm" href="joylashuv/">Xaritada ko‘rish</a></div>
<div class="card">{ico("odam")}<h3>Texnikum faoliyati</h3><p>Kunduzgi va dual ta’lim, o‘quv va ishlab chiqarish amaliyoti, kasbiy kvalifikatsiya — batafsil «Texnikum haqida» bo‘limida.</p><a class="btn ghost sm" href="haqida/">Batafsil</a></div>
</div></div></section>"""
    page("index.html", NOM, f"{NOM} elektron o‘quv-uslubiy bazasi: yo‘nalishlar, fanlar, TMR, texnologik xaritalar, ma’ruzalar va o‘quv-uslubiy majmualar.", b, active="")

# ---------- Yo'nalishlar ----------
def yonalish_card(y, R):
    cnt = {t: sum(1 for f in y["fanlar"] if f["toifa"] == t) for t in TOIFA}
    return (f'<a class="card" href="{R}yonalish/{y["id"]}/"><h3>{e(y["qisqa"])}</h3><p class="meta">{e(y["kod"])} · {e(y["talim_shakli"])} · {", ".join(y["guruhlar"])}</p>'
            f'<p class="small" style="margin:8px 0 0"><span class="tag k">{cnt["kasbiy"]} kasbiy</span> <span class="tag a">{cnt["amaliyot"]} amaliyot</span> <span class="tag u">{cnt["umumtalim"]} umumta’lim</span></p></a>')

def yonalishlar():
    R = "../"
    b = hero("", "Yo‘nalishlar", "", crumbs=[("Bosh sahifa", R), ("Yo‘nalishlar", None)])
    for kurs, nom in ((2, "2-kurs · 2025-yil qabuli"), (1, "1-kurs · 2026-yil qabuli")):
        cards = "".join(yonalish_card(y, R) for y in Y if y["hozirgi_kurs"] == kurs)
        b += f'<section class="blk"><div class="wrap"><h2>{nom}</h2><div class="grid g3">{cards}</div></div></section>'
    page("yonalishlar/index.html", "Yo‘nalishlar", f"{NOM}dagi barcha yo‘nalishlar va mutaxassisliklar.", b, active="yonalishlar/")

def fan_table(y, s, R):
    out = ""
    for t, (nom, c) in TOIFA.items():
        L = [f for f in y["fanlar"] if f["toifa"] == t and s in f["jami_soat"]]
        if not L:
            continue
        rows = ""
        for f in L:
            a = f["auditoriya_soat_taxminiy"].get(s)
            mat = '<span class="tag ok">material bor</span>' if (y["id"], f["id"], s) in STATIK else '<span class="muted small" data-mat="' + f["id"] + '">—</span>'
            rows += (f'<tr><td><a href="{R}yonalish/{y["id"]}/fan/{f["id"]}/?sem={s}">{e(f["nomi"])}</a></td><td class=n>{f["jami_soat"][s]}</td>'
                     f'<td class=n>{a if a else "—"}</td><td class=n>{a // 2 if a else "—"}</td><td>{mat}</td></tr>')
        tot = sum(f["jami_soat"][s] for f in L)
        out += (f'<h3 style="margin-top:22px"><span class="tag {c}">{nom}</span> <span class="muted small">{len(L)} ta · {tot} soat</span></h3>'
                f'<div class="tbl-w"><table class="ft"><thead><tr><th>Fan / modul</th><th class=n>Jami soat</th><th class=n>Auditoriya</th><th class=n>Darslar</th><th>Materiallar</th></tr></thead><tbody>{rows}</tbody></table></div>')
    return out

def yonalish(y):
    R = "../../"
    gs = GOF[y["id"]]
    meta = (f'<p class="lead">{e(y["kod"])} · {e(y["talim_yonalishi"] or "ta’lim yo‘nalishi aniqlanmoqda")}<br>{e(y["talim_shakli"])} ta’lim · {e(y["oquv_yili"])} · hozir {y["hozirgi_kurs"]}-kurs</p>'
            f'<div class="chips" style="margin-top:14px">{guruh_chips(gs, R)}</div>')
    b = hero("", e(y["qisqa"]), "", crumbs=[("Bosh sahifa", R), ("Yo‘nalishlar", R + "yonalishlar/"), (y["qisqa"], None)], extra=meta)
    sems = [str(s) for s in y["kiritilgan_semestrlar"]]
    allsem = sorted(set(sems + [str(s) for s in y["kiritilmagan_semestrlar"]]), key=int)
    cur = "3" if y["hozirgi_kurs"] == 2 else "1"
    btns = "".join(f'<button data-sem="{s}"{"" if s in sems else " disabled title=" + chr(34) + "O‘quv rejada hali kiritilmagan" + chr(34)}>{s}-semestr</button>' for s in allsem)
    pans = "".join(f'<div data-sem-p="{s}"><p class="muted small">{s}-semestr: {soat_sum(y, s)} soat · {sum(1 for f in y["fanlar"] if s in f["jami_soat"])} ta fan/modul{" · " + y["semestr_sanalari"][s] if s in y["semestr_sanalari"] else ""}</p>{fan_table(y, s, R)}</div>' for s in sems)
    note = ""
    if y["kiritilmagan_semestrlar"]:
        note = f'<p class="note" style="margin-top:20px">{", ".join(str(s) for s in y["kiritilmagan_semestrlar"])}-semestr fanlari kasb-emis o‘quv rejasida hali kiritilmagan — kiritilgach shu yerga qo‘shiladi.</p>'
    kval = ""
    if y.get("kvalifikatsiyalar"):
        kval = '<div class="card" style="margin-top:20px"><h3>Beriladigan kvalifikatsiyalar</h3><ul>' + "".join(f"<li>{e(k)}</li>" for k in y["kvalifikatsiyalar"]) + "</ul></div>"
    b += f"""<section class="blk"><div class="wrap">
<div class="blk-h"><div><h2>Fanlar</h2><p class="muted">Kasbiy (spes) fanlar, amaliyot va umumta’lim fanlari alohida. «Darslar» — 1 juftlik (80 daqiqa) hisobida.</p></div><a class="btn ghost sm" target="_blank" rel="noopener" href="{e(y["oquv_reja"]["url"])}">O‘quv reja: {e(y["oquv_reja"]["raqam"])}</a></div>
<div data-sems data-def="{cur}"><div class="sem-tabs" role="tablist">{btns}</div>{pans}</div>{note}{kval}
</div></section>"""
    b += f'<span id="yon" data-y="{y["id"]}" hidden></span>'
    page(f"yonalish/{y['id']}/index.html", y["qisqa"] + " (" + ", ".join(y["guruhlar"]) + ")",
         f"{y['qisqa']} ({y['kod']}) — {', '.join(y['guruhlar'])} guruhlari: kasbiy fanlar, amaliyot va umumta’lim fanlari, soatlar va o‘quv-uslubiy materiallar.", b, active="yonalishlar/", scripts=("bulut.js", "yon.js"))

EMPTY = {
    "tmr": "Taqvim-mavzu reja hali joylanmagan.", "xarita": "Texnologik xaritalar hali joylanmagan.", "maruza": "Ma’ruza matnlari hali joylanmagan.",
    "amaliy": "Amaliy mashg‘ulot ishlanmalari hali joylanmagan.", "mustaqil": "Mustaqil ta’lim topshiriqlari hali joylanmagan.", "nazorat": "Nazorat materiallari (test, bilet) hali joylanmagan.",
    "glossariy": "Glossariy hali joylanmagan.", "oum": "O‘quv-uslubiy majmua hali joylanmagan.", "fayllar": "Qo‘shimcha fayllar (taqdimot, video, rasm) hali joylanmagan.",
}
TABS = [("tmr", "TMR"), ("xarita", "Texnologik xaritalar"), ("maruza", "Ma’ruzalar"), ("amaliy", "Amaliy"), ("mustaqil", "Mustaqil ish"), ("nazorat", "Nazorat"), ("glossariy", "Glossariy"), ("oum", "O‘UM"), ("fayllar", "Fayllar")]

def fan_page(y, f):
    R = "../../../../"
    sems = list(f["jami_soat"].keys())
    cur = "3" if (y["hozirgi_kurs"] == 2 and "3" in sems) else sems[-1] if y["hozirgi_kurs"] == 2 else sems[0]
    nom, c = TOIFA[f["toifa"]]
    rtr = {s: {"json": R + v["json"], "base": R + v["base"], "paket": R + v["paket"], "manba": v["manba"]} for (yi, fi, s), v in STATIK.items() if yi == y["id"] and fi == f["id"]}
    kab = f'{R}kabinet/?y={y["id"]}&amp;f={f["id"]}'
    extra = (f'<p class="lead"><span class="tag {c}" style="background:#fff">{nom}</span> &nbsp;{e(y["qisqa"])} · {", ".join(y["guruhlar"])}</p>'
             + (f'<p class="small" style="opacity:.8">kasb-emis’dagi nomi: {e(f["nomi_kasb_emis"])}</p>' if f.get("nomi_kasb_emis") else ""))
    b = hero("", e(f["nomi"]), "", crumbs=[("Bosh sahifa", R), ("Yo‘nalishlar", R + "yonalishlar/"), (y["qisqa"], R + f"yonalish/{y['id']}/"), (f["nomi"], None)], extra=extra)
    semtabs = ""
    if len(sems) > 1:
        semtabs = '<div data-sems data-def="' + cur + '"><div class="sem-tabs" role="tablist">' + "".join(f'<button data-sem="{s}">{s}-semestr · {f["jami_soat"][s]} soat</button>' for s in sems) + "</div></div>"
    tb = "".join(f'<button data-t="{k}">{t}<span class="cnt"></span></button>' for k, t in TABS)
    pn = "".join(f'<div data-p="{k}"><div class="empty">{ico("fayl", "x")}<p><b>{EMPTY[k]}</b></p><p class="muted small">Bu fandan dars beradigan o‘qituvchi materiallarni kabinet orqali yuklashi mumkin — AI ularni avtomatik tayyorlaydi.</p><a class="btn sm" href="{kab}">Material joylash</a></div></div>' for k, _ in TABS)
    b += f"""<section class="blk"><div class="wrap">
<div id="fan" data-y="{y['id']}" data-f="{f['id']}" data-fan="{e(f['nomi'])}" data-yn="{e(y['qisqa'])}" data-def="{cur}" data-plan='{e(json.dumps(plan_of(f)))}' data-rtr='{e(json.dumps(rtr, ensure_ascii=False))}'>
{semtabs}
<p class="note" data-soat style="margin-bottom:18px"></p>
<div data-tabs data-hash><div class="tabs" role="tablist">{tb}</div>{pn}</div>
</div></div></section>"""
    page(f"yonalish/{y['id']}/fan/{f['id']}/index.html", f"{f['nomi']} — {y['qisqa']}",
         f"«{f['nomi']}» fani ({y['qisqa']}, {', '.join(y['guruhlar'])}): TMR, texnologik xaritalar, ma’ruzalar, amaliy ishlar, nazorat va O‘UM.",
         b, active="yonalishlar/", scripts=("rtr.js", "bulut.js", "fan.js"))

# ---------- Guruhlar ----------
def guruhlar():
    R = "../"
    rows = "".join(f'<tr><td><a href="{R}yonalish/{g["yonalish_id"]}/"><b>{g["guruh"]}</b></a></td><td>{e(YID[g["yonalish_id"]]["qisqa"])}</td><td class=n>{YID[g["yonalish_id"]]["hozirgi_kurs"]}</td><td>{e(YID[g["yonalish_id"]]["talim_shakli"])}</td><td class=n>{g["oquvchilar_soni_05_11_2026"]}</td></tr>' for g in G)
    b = hero("", "Guruhlar", "", crumbs=[("Bosh sahifa", R), ("Guruhlar", None)])
    b += f'<section class="blk"><div class="wrap"><div class="tbl-w"><table><thead><tr><th>Guruh</th><th>Mutaxassislik</th><th class=n>Kurs</th><th>Ta’lim shakli</th><th class=n>O‘quvchilar</th></tr></thead><tbody>{rows}</tbody></table></div><p class="small muted" style="margin-top:10px">O‘quvchilar soni: {STAT_SOURCE}.</p></div></section>'
    page("guruhlar/index.html", "Guruhlar", f"{NOM} guruhlari va ularning yo‘nalishlari.", b, active="guruhlar/")
    for g in G:
        y = YID[g["yonalish_id"]]
        fp = os.path.join(OUT, "guruh", g["guruh"], "index.html"); os.makedirs(os.path.dirname(fp), exist_ok=True)
        url = f"../../yonalish/{y['id']}/"
        open(fp, "w", encoding="utf-8").write(f'<!doctype html><html lang="uz"><head><meta charset="utf-8"><title>{g["guruh"]} — {e(y["qisqa"])}</title><meta http-equiv="refresh" content="0; url={url}"><link rel="canonical" href="{DOMEN}/yonalish/{y["id"]}/"></head><body><p><a href="{url}">{g["guruh"]} — {e(y["qisqa"])}</a></p></body></html>')

# ---------- Texnikum haqida (faoliyat) ----------
def haqida():
    R = "../"
    kun = sum(1 for y in Y if y["talim_shakli"] == "Kunduzgi"); dual = sum(1 for y in Y if y["talim_shakli"] == "Dual")
    soha = ""
    for k, t, ids in SOHA:
        lst = "".join(f'<li><a href="{R}yonalish/{i}/">{e(YID[i]["qisqa"])}</a> <span class="muted small">({e(YID[i]["kod"])}, {e(YID[i]["talim_shakli"].lower())})</span></li>' for i in ids)
        soha += f'<div class="card">{ico(k)}<h3>{t}</h3><ul style="padding-left:1.1em;margin:0">{lst}</ul></div>'
    b = hero("", "Texnikum haqida", f"{NOM} — Toshkent viloyati Toshkent tumanidagi kasbiy ta’lim muassasasi. Texnikum yoshlarni zamonaviy kasblarga nazariy va amaliy jihatdan tayyorlaydi.",
             crumbs=[("Bosh sahifa", R), ("Texnikum haqida", None)])
    b += f"""<section class="blk"><div class="wrap">
<div class="grid g4" style="margin-bottom:26px">
<div class="card stat"><b>{len({y["kod"] for y in Y})}</b>mutaxassislik</div><div class="card stat"><b>{len(G)}</b>guruh</div>
<div class="card stat"><b>{kun} / {dual}</b>o‘quv reja: kunduzgi / dual</div><div class="card stat"><b>4</b>semestr — 2 yillik ta’lim</div></div>
<h2>Faoliyat yo‘nalishlari</h2><p class="muted">Texnikumda quyidagi sohalar bo‘yicha mutaxassislar tayyorlanadi.</p>
<div class="grid g2">{soha}</div></div></section>
<section class="blk" style="padding-top:0"><div class="wrap"><div class="grid g2">
<div class="card">{ico("kitob")}<h3>Ta’lim jarayoni</h3><p>Ta’lim 2 yil (4 semestr) davom etadi. O‘quv reja uch qismdan iborat:</p><ul>
<li><b>Kasbiy (spes) fanlar</b> — mutaxassislikning nazariy asoslari va kasbiy modullar;</li><li><b>Amaliyot</b> — o‘quv, ishlab chiqarish va kvalifikatsion amaliyot;</li>
<li><b>Umumta’lim fanlari</b> — ona tili, matematika, fizika, tarix, chet tillari, informatika va boshqalar.</li></ul>
<p>Dars — 1 juftlik (80 daqiqa). Har bir fan bo‘yicha oraliq va yakuniy nazorat o‘tkaziladi.</p></div>
<div class="card">{ico("avto")}<h3>Dual ta’lim va amaliyot</h3><p>{dual} ta o‘quv reja dual shaklda: o‘quvchilar nazariy bilimni texnikumda olib, amaliy ko‘nikmani korxonalarda mustahkamlaydi. Kunduzgi yo‘nalishlarda ham ishlab chiqarish amaliyoti o‘quv rejaning muhim qismi.</p></div>
<div class="card">{ico("odam")}<h3>Rahbariyat</h3><p>Texnikum direktori: <b>D. Shermuhammedov</b></p><p class="small muted">Texnikumda Yoshlar ittifoqi yetakchisi yoshlar bilan ma’naviy-ma’rifiy, sport va ijodiy tadbirlarni tashkil etadi.</p></div>
<div class="card">{ico("fayl")}<h3>Elektron baza</h3><p>Ushbu sayt — texnikum o‘qituvchilari va o‘quvchilari uchun yagona o‘quv-uslubiy baza: TMR, texnologik xaritalar, ma’ruzalar va majmualar fanlar kesimida. Materiallarni tasdiqlangan o‘qituvchilar kabinet orqali joylaydi.</p><a class="btn ghost sm" href="{R}kabinet/">O‘qituvchi kabineti</a></div>
</div>
<p class="small muted" style="margin-top:18px">Manbalar: yo‘nalishlar, guruhlar va o‘quv rejalar — <a href="https://kasb-emis.edu.uz" rel="noopener">kasb-emis.edu.uz</a> (05.11.2026); manzil va ish vaqti — <a href="https://www.goldenpages.uz/uz/company/?Id=107990" rel="noopener">goldenpages.uz</a>.</p>
</div></section>"""
    page("haqida/index.html", "Texnikum haqida", f"{NOM} faoliyati: yo‘nalishlar, ta’lim jarayoni, dual ta’lim va amaliyot.", b, active="haqida/")

def joylashuv():
    R = "../"
    q = quote(MANZIL_Q)
    gmap = f"https://maps.google.com/maps?q={q}&z=15&output=embed"
    b = hero("", "Joylashuv", "Texnikum Toshkent viloyati Toshkent tumanidagi Ko‘ksaroy shaharchasida joylashgan.", crumbs=[("Bosh sahifa", R), ("Joylashuv", None)])
    b += f"""<section class="blk"><div class="wrap"><div class="grid g2" style="align-items:start">
<div><div class="card">{ico("joy")}<h3>Manzil</h3><p style="font-size:18px">{e(MANZIL)}</p>
<div class="toolbar"><a class="btn sm" target="_blank" rel="noopener" href="https://yandex.uz/maps/?text={q}">Yandex xaritada</a><a class="btn ghost sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&amp;query={q}">Google Maps’da</a></div></div>
<div class="card" style="margin-top:16px">{ico("soat")}<h3>Ish vaqti</h3><div class="kv" style="margin:0"><div>Dushanba–shanba</div><div>08:00–17:00</div><div>Yakshanba</div><div>Dam olish kuni</div></div></div>
<div class="card" style="margin-top:16px"><h3>Mo‘ljal</h3><p>Jamoat xavfsizligi universitetidan taxminan 2,9 km.</p><p class="small muted" style="margin:0">Manba: <a href="https://www.goldenpages.uz/uz/company/?Id=107990" rel="noopener">goldenpages.uz</a>.</p></div></div>
<div><button class="map" data-map="{e(gmap)}" style="display:grid;place-items:center;cursor:pointer;border:1px dashed var(--a);font:600 16px var(--body);color:var(--a)">Xaritani ochish</button>
<p class="small muted" style="margin-top:8px">Xaritadagi belgi manzil bo‘yicha topilgan taxminiy joy.</p></div>
</div></div></section>"""
    page("joylashuv/index.html", "Joylashuv", f"{NOM} manzili, xaritasi va ish vaqti.", b, active="joylashuv/")

def qidiruv():
    R = "../"
    b = hero("", "Qidiruv", "", crumbs=[("Bosh sahifa", R), ("Qidiruv", None)])
    b += '<section class="blk"><div class="wrap"><label for="q-input" class="sr">Qidiruv</label><input type="search" id="q-input" class="q-big" placeholder="Fan, mavzu, yo‘nalish yoki guruh…" autofocus><div id="q-res" class="q-res" style="margin-top:18px"></div></div></section>'
    page("qidiruv/index.html", "Qidiruv", f"{NOM} e-bazasidan qidirish.", b, active="qidiruv/")

def kabinet():
    R = "../"
    b = hero("", "O‘qituvchi kabineti", "Login va parol bilan kiring, fan hujjatlarini yuklang — AI ularni tasniflaydi, TMR tuzadi va e-bazaga tayyorlaydi.", crumbs=[("Bosh sahifa", R), ("O‘qituvchi kabineti", None)])
    b += '<section class="blk"><div class="wrap"><div id="kabinet"></div></div></section>'
    page("kabinet/index.html", "O‘qituvchi kabineti", "O‘qituvchilar uchun kirish va materiallarni joylash.", b, scripts=("bulut.js", "kabinet.js"), noindex=True)

def admin():
    R = "../"
    b = hero("", "Admin panel", "", crumbs=[("Bosh sahifa", R), ("Admin panel", None)])
    b += '<section class="blk"><div class="wrap"><div id="admin"></div></div></section>'
    page("admin/index.html", "Admin panel", "Boshqaruv.", b, scripts=("bulut.js", "admin.js"), noindex=True)

def xato404():
    b = hero("", "Sahifa topilmadi", "Bunday sahifa yo‘q yoki ko‘chirilgan.", extra='<div class="cta" style="margin-top:20px"><a class="btn light" href="/">Bosh sahifa</a><a class="btn light" href="/qidiruv/">Qidiruv</a></div>')
    page("404.html", "Sahifa topilmadi", "Sahifa topilmadi.", b, noindex=True, abs_root=True)

# ---------- Ma'lumot fayllari ----------
def data_files():
    os.makedirs(os.path.join(OUT, "data"), exist_ok=True)
    site = {"yonalishlar": [{k: y[k] for k in ("id", "qisqa", "mutaxassislik", "kod", "guruhlar", "hozirgi_kurs", "talim_shakli")} | {"fanlar": [{k: f[k] for k in ("id", "nomi", "toifa", "jami_soat", "auditoriya_soat_taxminiy")} for f in y["fanlar"]]} for y in Y],
            "guruhlar": G}
    json.dump(site, open(os.path.join(OUT, "data", "malumot.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    Q = []
    for p, t in (("haqida/", "Texnikum haqida — faoliyat"), ("joylashuv/", "Joylashuv — manzil va xarita"), ("kabinet/", "O‘qituvchi kabineti"), ("guruhlar/", "Guruhlar ro‘yxati")):
        Q.append({"k": "s", "t": t, "u": p})
    for y in Y:
        Q.append({"k": "y", "t": y["qisqa"], "s": f'{y["kod"]} · {", ".join(y["guruhlar"])} · {y["talim_shakli"]}', "u": f'yonalish/{y["id"]}/'})
        for f in y["fanlar"]:
            Q.append({"k": "f", "t": f["nomi"], "s": f'{y["qisqa"]} · {", ".join(y["guruhlar"])} · {TOIFA[f["toifa"]][0]} · {", ".join(s + "-sem " + str(h) + " soat" for s, h in f["jami_soat"].items())}', "u": f'yonalish/{y["id"]}/fan/{f["id"]}/'})
    for g in G:
        Q.append({"k": "g", "t": g["guruh"], "s": YID[g["yonalish_id"]]["qisqa"], "u": f'yonalish/{g["yonalish_id"]}/'})
    if RTR_TIKUV:
        for t in RTR_TIKUV["topics"]:
            Q.append({"k": "m", "t": t["nomi"], "s": f'Zamonaviy tikuv jihozlari · {t["id"]} · {t["turi"]}', "u": "yonalish/moda-tikuv-texnologiyasi/fan/zamonaviy-tikuv-jihozlari/#" + ("amaliy" if t["turi"] == "Amaliy" else "maruza")})
    json.dump(Q, open(os.path.join(OUT, "data", "qidiruv.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    if RTR_TIKUV:
        os.makedirs(os.path.join(OUT, "data", "rtr"), exist_ok=True)
        json.dump(RTR_TIKUV, open(os.path.join(OUT, "data", "rtr", "zamonaviy-tikuv-jihozlari.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

def extras():
    urls = ["", "yonalishlar/", "guruhlar/", "haqida/", "joylashuv/", "qidiruv/"] + [f'yonalish/{y["id"]}/' for y in Y] + [f'yonalish/{y["id"]}/fan/{f["id"]}/' for y in Y for f in y["fanlar"]]
    open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{DOMEN}/{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nDisallow: /kabinet/\nDisallow: /admin/\nSitemap: {DOMEN}/sitemap.xml\n")
    open(os.path.join(OUT, "CNAME"), "w").write("texnikum1son.uz\n")
    open(os.path.join(OUT, ".nojekyll"), "w").write("")
    os.makedirs(os.path.join(OUT, "assets"), exist_ok=True)
    for fn in os.listdir(os.path.join(SRC, "assets")):
        shutil.copy(os.path.join(SRC, "assets", fn), os.path.join(OUT, "assets", fn))
    open(os.path.join(OUT, "assets", "logo.svg"), "w", encoding="utf-8").write(LOGO.replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"').replace("var(--a)", "#b5541b"))

bosh(); yonalishlar(); guruhlar(); haqida(); joylashuv(); qidiruv(); kabinet(); admin(); xato404()
for y in Y:
    yonalish(y)
    for f in y["fanlar"]:
        fan_page(y, f)
data_files(); extras()
print("Sahifalar:", sum(len(fs) for _, _, fs in os.walk(OUT)))
