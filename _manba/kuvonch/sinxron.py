#!/usr/bin/env python3
"""
kuvonch.uz sinf o'yinlarini texnikum1son.uz/oyin/ ga ko'chiradi (avtomatik sinxron).

- Manba: github.com/quvonchbek99/quvnoqdombogchalar (kuvonch.uz) — main tarmog'i.
- Kirish sahifalari: sinf-oyinlari, viktorina, arqon tortish, jamoaviy o'yin.
- Sahifalar ishlatadigan JS/CSS/rasm/ovoz fayllari avtomatik topiladi (havolalar bo'yicha, rekursiv).
- Sahifalarga e-baza sarlavhasi va texnikum logotipi qo'yiladi; ko'chirilmagan sahifalarga havolalar kuvonch.uz ga boradi.
- kuvonch.uz o'zgarsa, keyingi sinxronda shu yerga ham o'tadi (.github/workflows/kuvonch-oyinlar.yml).

Ishlatish:  python3 sinxron.py <chiqish_papkasi>   (masalan: oyin)
"""
import hashlib, json, os, re, shutil, sys, time, urllib.request

EGA, REPO, TARMOQ = "quvonchbek99", "quvnoqdombogchalar", "main"
KUV = "https://kuvonch.uz/"
KIRISH = ["sinf-oyinlari.html", "viktorina.html", "arqon.html", "jamoa.html"]
# Saytga kerak emas yoki texnikum saytiga zarar qilishi mumkin bo'lgan fayllar
CHIQAR = {"sw.js", "reklama.js", "manifest.json", "ads.txt", "CNAME", "404.html"}
# Kod ichida papka sifatida yuklanadigan kutubxonalar (masalan, Kuvi'ning tayyor ovozlari: ka-ai.js → ovoz/k/lib.json + mp3)
PAPKALAR = ["ovoz/k/"]
MAX_FAYL = 6 * 1024 * 1024
MAX_JAMI = 90 * 1024 * 1024
MATN = (".html", ".js", ".css", ".json", ".mjs", ".svg")
KENG = r"js|mjs|css|json|png|jpe?g|webp|gif|svg|ico|mp3|wav|ogg|m4a|woff2?|ttf|otf|wasm|task|tflite|bin|txt|csv"
REF = re.compile(r"""(?:["'`(=]\s*)((?:\./|/)?[A-Za-z0-9_][A-Za-z0-9_./-]*\.(?:""" + KENG + r"""))(?:[?#][^"'`)\s]*)?(?=["'`)\s])""")
HTML_REF = re.compile(r"""\b(href|src|action)=(["'])([^"'#?:]+\.html)([?#][^"']*)?\2""")

TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or ""


def ol(url, json_kerak=False, urinish=4):
    for i in range(urinish):
        try:
            q = urllib.request.Request(url, headers={"User-Agent": "texnikum1son-sinxron", **({"Authorization": "Bearer " + TOKEN} if TOKEN and "api.github.com" in url else {})})
            with urllib.request.urlopen(q, timeout=60) as r:
                d = r.read()
            return json.loads(d) if json_kerak else d
        except Exception as e:
            if i == urinish - 1:
                raise
            time.sleep(2 + 3 * i)


def daraxt():
    t = ol(f"https://api.github.com/repos/{EGA}/{REPO}/git/trees/{TARMOQ}?recursive=1", json_kerak=True)
    if t.get("truncated"):
        print("Ogohlantirish: daraxt to'liq emas (truncated)")
    return t["sha"], {x["path"]: x.get("size", 0) for x in t["tree"] if x["type"] == "blob"}


def norm(yol, ota=""):
    yol = yol.split("?")[0].split("#")[0]
    if yol.startswith("/"):
        yol = yol[1:]
    elif ota:
        yol = os.path.normpath(os.path.join(os.path.dirname(ota), yol)).replace("\\", "/")
    if yol.startswith("./"):
        yol = yol[2:]
    return None if yol.startswith("..") else yol


def yigish(sha, FAYLLAR):
    from concurrent.futures import ThreadPoolExecutor
    olingan, jami = {}, 0
    navbat = list(KIRISH) + sorted(p for p in FAYLLAR if any(p.startswith(d) for d in PAPKALAR) and not p.endswith(".gitignore"))
    with ThreadPoolExecutor(8) as ex:
        while navbat:
            tur = []
            for p in dict.fromkeys(navbat):
                if p in olingan or p not in FAYLLAR or os.path.basename(p) in CHIQAR:
                    continue
                if FAYLLAR[p] > MAX_FAYL or jami + FAYLLAR[p] > MAX_JAMI:
                    print("  o'tkazildi (katta):", p, FAYLLAR[p])
                    continue
                jami += FAYLLAR[p]
                tur.append(p)
            navbat = []
            for p, d in zip(tur, ex.map(lambda p: ol(f"https://raw.githubusercontent.com/{EGA}/{REPO}/{sha}/{p}"), tur)):
                olingan[p] = d
                if p.endswith(MATN):
                    for m in REF.finditer(d.decode("utf-8", "replace")):
                        q = norm(m.group(1), p)
                        if q and q not in olingan and q in FAYLLAR:
                            navbat.append(q)
    return olingan, sum(len(d) for d in olingan.values())


def sarlavha(joriy):
    L = [("/", "📚 Fanlar"), ("sinf-oyinlari.html", "🎯 Sinf o‘yinlari"), ("viktorina.html", "⚡ Jonli viktorina"),
         ("arqon.html", "🪢 Arqon tortish"), ("jamoa.html", "👥 Jamoaviy o‘yin")]
    nav = "".join(f'<a href="{u}"{" aria-current=page" if u == joriy else ""}>{t}</a>' for u, t in L)
    nav += f'<a href="{KUV}oyinlar.html" target="_blank" rel="noopener">🎮 Boshqa o‘yinlar ↗</a>'
    return ('<header class="knav-head eb-head"><a class="brand eb-brand" href="/" title="Fanlar e-bazasi">'
            '<img src="/assets/logo-96.png" width="40" height="40" alt="">'
            '<span class="eb-nom"><b>Toshkent tuman 1-son texnikumi</b><small>Fanlar e-bazasi · Sinf o‘yinlari</small></span></a>'
            f'<nav class="knav" aria-label="Bo‘limlar">{nav}</nav></header>')


def ozgartir(nom, html, borlar):
    # ko'chirilmagan sahifalarga havolalar → kuvonch.uz (o'yinlar orasidagi havolalar shu yerda qoladi)
    def hav(m):
        a, q, u, qol = m.group(1), m.group(2), m.group(3), m.group(4) or ""
        y = norm(u, nom)
        if y in borlar:
            return m.group(0)
        return f"{a}={q}{KUV}{y}{qol}{q}"
    html = HTML_REF.sub(hav, html)
    # JS ichidagi sahifa havolalari ('mashqlar.html#…' kabi) — faqat oddiy matn bo'lsa
    html = re.sub(r"""(?<=["'])(index|mashqlar|matematika|oyinlar|reels|donat|aloqa|maxfiylik|shartlar|ai-ustoz|premium)\.html""",
                  lambda m: KUV + m.group(0), html)
    html = re.sub(r'<link rel="manifest"[^>]*>\s*', "", html)
    # kuvonch sarlavhasi → e-baza sarlavhasi
    yangi, n = re.subn(r'<header class="knav-head">.*?</header>', lambda m: sarlavha(nom), html, count=1, flags=re.S)
    if n == 0:
        yangi = re.sub(r"(<body[^>]*>)", lambda m: m.group(1) + '<div class="eb-top">' + sarlavha(nom) + "</div>", html, count=1)
    html = yangi
    bosh = ('<meta name="robots" content="noindex">\n'
            '<link rel="icon" href="/assets/logo-48.png" type="image/png">\n'
            '<link rel="stylesheet" href="ebaza.css">\n')
    html = re.sub(r'<link rel="icon"[^>]*>\s*', "", html)
    html = html.replace("</head>", bosh + "</head>", 1)
    html = re.sub(r"<title>(.*?)</title>", lambda m: "<title>" + re.sub(r"\s*[—|·-]\s*Kuvonch Academy.*$", "", m.group(1)) + " · Texnikum e-bazasi</title>", html, count=1, flags=re.S)
    return html


EBAZA_CSS = """/* texnikum1son.uz e-baza sarlavhasi (sinxron skript qo'shadi) */
.eb-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}
.eb-brand{display:flex;align-items:center;gap:10px;text-decoration:none;min-width:0}
.eb-brand img{width:40px;height:40px;border-radius:50%;flex:none;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.eb-nom{display:flex;flex-direction:column;line-height:1.15}
.eb-nom b{font-size:14px}
.eb-nom small{font-size:11.5px;opacity:.75;font-weight:500}
.eb-top{max-width:1180px;margin:0 auto;padding:10px 16px}
@media (max-width:560px){.eb-nom b{font-size:12.5px}.eb-nom small{display:none}}
"""


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    chiq = sys.argv[1]
    sha, FAYLLAR = daraxt()
    print("kuvonch.uz commit:", sha[:7], "| fayllar:", len(FAYLLAR))
    olingan, jami = yigish(sha, FAYLLAR)
    borlar = set(p for p in olingan if p.endswith(".html"))
    vaqt = chiq + ".yangi"
    shutil.rmtree(vaqt, ignore_errors=True)
    for p, d in olingan.items():
        f = os.path.join(vaqt, p)
        os.makedirs(os.path.dirname(f), exist_ok=True)
        if p in borlar:
            d = ozgartir(p, d.decode("utf-8"), borlar).encode("utf-8")
        open(f, "wb").write(d)
    open(os.path.join(vaqt, "ebaza.css"), "w", encoding="utf-8").write(EBAZA_CSS)
    imzo = hashlib.sha1(b"".join(hashlib.sha1(open(os.path.join(dp, f), "rb").read()).digest() for dp, _, fs in sorted(os.walk(vaqt)) for f in sorted(fs))).hexdigest()
    json.dump({"manba": f"{EGA}/{REPO}", "commit": sha, "fayllar": len(olingan) + 1, "hajm": jami, "imzo": imzo,
               "kirish": KIRISH}, open(os.path.join(vaqt, "sinxron.json"), "w"), ensure_ascii=False, indent=1)
    eski = os.path.join(chiq, "sinxron.json")
    if os.path.exists(eski):
        try:
            if json.load(open(eski)).get("imzo") == imzo:
                shutil.rmtree(vaqt)
                print("O'zgarish yo'q.")
                return
        except Exception:
            pass
    shutil.rmtree(chiq, ignore_errors=True)
    os.rename(vaqt, chiq)
    print(f"Tayyor: {len(olingan)} fayl, {jami / 1e6:.1f} MB → {chiq}/")


if __name__ == "__main__":
    main()
