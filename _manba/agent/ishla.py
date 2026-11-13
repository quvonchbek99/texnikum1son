#!/usr/bin/env python3
"""Kuvi agent — o'qituvchilar yuklagan o'quv-uslubiy majmualarni (800+ betgacha) bo'laklaydi va saytga joylaydi.

Ish tartibi (GitHub Actions, har 10 daqiqada yoki qo'lda):
  1. Navbat: Firestore `t1_navbat` (ochiq o'qiladi) — o'qituvchi kabinetda «AI agentga yuborish»ni bosganda yoziladi.
  2. Fayl Google Drive'dan yuklab olinadi (fayllar «havolasi borlar ko'ra oladi» rejimida).
  3. DOCX/PPTX/XLSX/ZIP → PDF (LibreOffice); PDF optimallashtiriladi va «linearize» qilinadi (sahifama-sahifa tez ochilishi uchun).
  4. Tuzilma: PDF mundarijasi + har bet sarlavhalari → Gemini (GEMINI_API_KEY bo'lsa) yoki GitHub Models (GITHUB_TOKEN)
     yoki qoidalar → qismlar: TMR, texnologik xaritalar, ma'ruzalar, amaliy, mustaqil, nazorat, glossariy… (bet oraliqlari bilan).
  5. Natija repoga yoziladi (sayt GitHub Pages orqali beradi, Range so'rovlar va CORS bilan):
       fayl/<id>.pdf        — majmua PDF
       agent/m/<id>.json    — tuzilma (qismlar)
       agent/k/<id>.json    — Kuvi AI uchun matn bo'laklari (bet raqami bilan)
       agent/index.json     — fan bo'yicha ro'yxat
       agent/holat.json     — har navbat elementining holati (tayyor / xato)

Ishga tushirish:
  python3 ishla.py --tekshir            # navbatda yangi ish bormi (GITHUB_OUTPUT ga bor=0/1)
  python3 ishla.py                      # navbatni qayta ishlash
  python3 ishla.py --fayl majmua.docx --yonalish moda-tikuv-texnologiyasi --fan zamonaviy-tikuv-jihozlari --sem 1   # lokal sinov
"""
import argparse, datetime, hashlib, json, os, re, shutil, subprocess, sys, tempfile, time, zipfile
import urllib.request, urllib.error

LOYIHA = "kuvonch-academy"
FS = f"https://firestore.googleapis.com/v1/projects/{LOYIHA}/databases/(default)/documents"
ILDIZ = os.path.abspath(os.environ.get("T1_ILDIZ", os.path.join(os.path.dirname(__file__), "..", "..")))
MAX_YUKLAB = 400 * 1024 * 1024      # Drive'dan yuklab olinadigan eng katta fayl
MAX_BET = 3000
MAX_PDF = 90 * 1024 * 1024          # GitHub fayl chegarasi 100 MB
MAX_JAMI = 850 * 1024 * 1024        # fayl/ papkasining umumiy chegarasi (GitHub Pages sayti 1 GB)
OFFICE = {"docx", "doc", "odt", "rtf", "pptx", "ppt", "odp", "xlsx", "xls", "ods", "txt"}
RASM = {"jpg", "jpeg", "png", "webp", "gif", "bmp", "tif", "tiff"}
TURLAR = ["titul", "annotatsiya", "dastur", "tmr", "xarita", "maruza", "amaliy", "mustaqil", "nazorat", "glossariy", "adabiyot", "boshqa"]


def log(*a):
    print(*a, flush=True)


def hozir():
    return datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=5))).strftime("%Y-%m-%d %H:%M")


def oqi(p, d):
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return d


def yoz(p, o):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(o, f, ensure_ascii=False, separators=(",", ":"))


def norm(s):
    s = str(s or "").lower()
    s = re.sub(r"[ʻʼ‘’`´']", "", s)
    return re.sub(r"\s+", " ", s).strip()


# ---------------------------------------------------------------- Navbat (Firestore REST, ochiq o'qish)
def fs_qiymat(v):
    if "stringValue" in v: return v["stringValue"]
    if "integerValue" in v: return int(v["integerValue"])
    if "doubleValue" in v: return v["doubleValue"]
    if "booleanValue" in v: return v["booleanValue"]
    if "timestampValue" in v: return v["timestampValue"]
    if "nullValue" in v: return None
    if "mapValue" in v: return {k: fs_qiymat(x) for k, x in v["mapValue"].get("fields", {}).items()}
    if "arrayValue" in v: return [fs_qiymat(x) for x in v["arrayValue"].get("values", [])]
    return None


def navbat():
    out, tok = [], ""
    while True:
        url = f"{FS}/t1_navbat?pageSize=300" + (f"&pageToken={tok}" if tok else "")
        with urllib.request.urlopen(url, timeout=60) as r:
            j = json.loads(r.read().decode("utf-8"))
        for d in j.get("documents", []):
            x = {k: fs_qiymat(v) for k, v in d.get("fields", {}).items()}
            x["id"] = d["name"].rsplit("/", 1)[-1]
            out.append(x)
        tok = j.get("nextPageToken")
        if not tok:
            return out


# ---------------------------------------------------------------- Yuklab olish
def yuklab_ol(url, yol):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Kuvi agent)"})
    jami = 0
    with urllib.request.urlopen(req, timeout=300) as r, open(yol, "wb") as f:
        tur = r.headers.get("Content-Type", "")
        while True:
            b = r.read(1 << 20)
            if not b:
                break
            jami += len(b)
            if jami > MAX_YUKLAB:
                raise RuntimeError("Fayl juda katta (400 MB dan ortiq)")
            f.write(b)
    if "text/html" in tur and jami < 400000:
        raise RuntimeError("Drive faylni bermadi — fayl «havolasi borlar ko‘ra oladi» rejimida emas yoki o‘chirilgan")
    return jami


def drive_url(fid):
    return f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"


# ---------------------------------------------------------------- PDF ga aylantirish
def lo_pdf(kirish, chiqish_papka):
    prof = tempfile.mkdtemp(prefix="lo_")
    cmd = ["soffice", f"-env:UserInstallation=file://{prof}", "--headless", "--norestore",
           "--convert-to", 'pdf:writer_pdf_Export:{"ExportBookmarks":{"type":"boolean","value":"true"}}', "--outdir", chiqish_papka, kirish]
    try:
        subprocess.run(cmd, check=True, timeout=1800, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError:
        subprocess.run(["soffice", f"-env:UserInstallation=file://{prof}", "--headless", "--norestore", "--convert-to", "pdf", "--outdir", chiqish_papka, kirish],
                       check=True, timeout=1800, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    finally:
        shutil.rmtree(prof, ignore_errors=True)
    p = os.path.join(chiqish_papka, os.path.splitext(os.path.basename(kirish))[0] + ".pdf")
    if not os.path.exists(p):
        raise RuntimeError("PDF ga aylantirib bo‘lmadi: " + os.path.basename(kirish))
    return p


def pdf_ga(kirish, ish):
    """Har qanday kirish faylidan bitta PDF. ZIP bo'lsa — ichidagi hujjatlar nomi bo'yicha tartibda birlashtiriladi,
    har fayl nomi mundarijaga (bookmark) qo'shiladi."""
    import pymupdf
    ext = kirish.rsplit(".", 1)[-1].lower() if "." in kirish else ""
    if ext == "pdf":
        return kirish
    if ext in OFFICE:
        return lo_pdf(kirish, ish)
    if ext in RASM:
        doc = pymupdf.open()
        img = pymupdf.open(kirish)
        doc.insert_pdf(pymupdf.open("pdf", img.convert_to_pdf()))
        out = os.path.join(ish, "rasm.pdf"); doc.save(out); return out
    if ext == "zip":
        papka = os.path.join(ish, "zip"); os.makedirs(papka, exist_ok=True)
        with zipfile.ZipFile(kirish) as z:
            jami = 0
            for i in z.infolist():
                jami += i.file_size
                if jami > MAX_YUKLAB * 2:
                    raise RuntimeError("ZIP ichidagi fayllar juda katta")
                nom = i.filename
                if i.is_dir() or "__MACOSX" in nom or os.path.basename(nom).startswith("."):
                    continue
                try:
                    nom_t = nom.encode("cp437").decode("utf-8") if i.flag_bits & 0x800 == 0 else nom
                except Exception:
                    nom_t = nom
                maqsad = os.path.join(papka, nom_t.replace("..", "_"))
                os.makedirs(os.path.dirname(maqsad), exist_ok=True)
                with z.open(i) as s, open(maqsad, "wb") as d:
                    shutil.copyfileobj(s, d)
        fayllar = []
        for dp, _, fs in os.walk(papka):
            for f in fs:
                e = f.rsplit(".", 1)[-1].lower() if "." in f else ""
                if e in OFFICE or e == "pdf" or e in RASM:
                    fayllar.append(os.path.join(dp, f))
        fayllar.sort(key=lambda p: [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", os.path.relpath(p, papka))])
        if not fayllar:
            raise RuntimeError("ZIP ichida hujjat topilmadi")
        jam = pymupdf.open(); toc = []
        for k, f in enumerate(fayllar):
            try:
                sub = os.path.join(ish, f"z{k}"); os.makedirs(sub, exist_ok=True)
                p = pdf_ga(f, sub)
                d = pymupdf.open(p)
            except Exception as e:
                log("  ! o'tkazib yuborildi:", f, e); continue
            bosh = jam.page_count
            jam.insert_pdf(d)
            toc.append([1, os.path.splitext(os.path.basename(f))[0], bosh + 1])
            for lvl, t, pg in d.get_toc(simple=True):
                if pg >= 1:
                    toc.append([min(lvl + 1, 4), t, bosh + pg])
        if not jam.page_count:
            raise RuntimeError("ZIP ichidagi hujjatlarni ochib bo‘lmadi")
        try:
            jam.set_toc(toc)
        except Exception:
            pass
        out = os.path.join(ish, "zip.pdf"); jam.save(out); return out
    raise RuntimeError(f"«.{ext}» turidagi faylni qayta ishlab bo‘lmaydi")


def optimallashtir(p, out):
    import pymupdf
    doc = pymupdf.open(p)
    if doc.page_count > MAX_BET:
        raise RuntimeError(f"Juda ko‘p bet ({doc.page_count}); {MAX_BET} betgacha qabul qilinadi")
    vaqt = out + ".tmp.pdf"
    doc.save(vaqt, garbage=3, deflate=True)
    if os.path.getsize(vaqt) > 40 * 1024 * 1024 and hasattr(doc, "rewrite_images"):
        try:
            doc = pymupdf.open(vaqt)
            doc.rewrite_images(dpi_threshold=160, dpi_target=130, quality=70)
            doc.save(vaqt + "2", garbage=3, deflate=True); os.replace(vaqt + "2", vaqt)
        except Exception as e:
            log("  rasmlarni siqib bo'lmadi:", e)
    if shutil.which("qpdf"):
        r = subprocess.run(["qpdf", "--linearize", "--object-streams=generate", vaqt, out], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if r.returncode not in (0, 3) or not os.path.exists(out):
            shutil.move(vaqt, out)
        else:
            os.remove(vaqt)
    else:
        shutil.move(vaqt, out)
    if os.path.getsize(out) > MAX_PDF:
        raise RuntimeError(f"PDF juda katta ({os.path.getsize(out) // 1048576} MB). Rasmlarni kichraytirib yoki 2 qismga bo‘lib yuklang.")


# ---------------------------------------------------------------- Tuzilmani aniqlash
QOIDALAR = [
    ("tmr", r"taqvim[\s-]*mavzu(iy)?\s+reja|kalendar[\s-]*tematik|календарно|\btmr\b|\bktp\b"),
    ("xarita", r"texnologik\s+xarita|dars(ning)?\s+texnologik|технологическая\s+карта"),
    ("amaliy", r"amaliy\s+(mashg|ish|dars)|laboratoriya\s+(ishi|mashg)|практическ|лаборатор"),
    ("mustaqil", r"mustaqil\s+(ta.?lim|ish)|самостоят"),
    ("nazorat", r"\btest(lar)?\b|nazorat\s+(savol|ish|topshiriq)|oraliq\s+nazorat|yakuniy\s+nazorat|bilet|тест"),
    ("glossariy", r"glossariy|atamalar\s+lug|глоссар"),
    ("adabiyot", r"adabiyotlar|foydalanilgan\s+adabiyot|литератур"),
    ("dastur", r"(ishchi|o.?quv)\s+dastur|fan\s+dasturi|рабочая\s+программа"),
    ("annotatsiya", r"annotatsiya|so.?z\s*boshi|kirish\b|аннотац|введение"),
    ("maruza", r"ma.?ruza|лекци|\d+\s*[-–.]?\s*mavzu|mavzu\s*[:№]"),
]
DARS = re.compile(r"(\d{1,3})\s*[-–.]?\s*(?:mavzu|dars|ma.?ruza|amaliy|laboratoriya|тема|лекция)|(?:mavzu|dars|тема|лекция)\s*[№#]?\s*(\d{1,3})", re.I)


def bet_boshlari(doc):
    """Har bet uchun: dastlabki satrlar (sarlavha nomzodlari) va to'liq matn."""
    import statistics
    sahifalar = []
    olchamlar = []
    for pg in doc:
        d = pg.get_text("dict")
        satrlar = []
        for b in d.get("blocks", []):
            for l in b.get("lines", []):
                t = "".join(s["text"] for s in l["spans"]).strip()
                if not t:
                    continue
                o = max((s["size"] for s in l["spans"]), default=0)
                qalin = any((s["flags"] & 16) or "Bold" in s.get("font", "") for s in l["spans"])
                satrlar.append((l["bbox"][1], t, o, qalin))
                olchamlar.append(o)
        satrlar.sort(key=lambda x: x[0])
        sahifalar.append({"satrlar": satrlar, "matn": pg.get_text("text")})
    asos = statistics.median(olchamlar) if olchamlar else 12
    for s in sahifalar:
        bosh = []
        for _, t, o, q in s["satrlar"][:8]:
            if len(t) > 160:
                continue
            katta = o >= asos + 1.5
            if katta or q or t.isupper() or re.search(r"\d+\s*[-–.]?\s*mavzu|mavzu\s*:|taqvim|texnologik|ma.?ruza|amaliy|test|glossariy|mustaqil", t, re.I):
                bosh.append((t, katta or (q and len(t) < 110)))
        s["boshlar"] = bosh[:4]
    return sahifalar


def qoida_turi(t):
    n = norm(t)
    for tur, rx in QOIDALAR:
        if re.search(rx, n, re.I):
            return tur
    return None


def dars_raqami(t):
    m = DARS.search(t or "")
    if not m:
        return None
    try:
        v = int(m.group(1) or m.group(2))
        return v if 0 < v < 400 else None
    except Exception:
        return None


MAVZU_SAR = re.compile(r"^\s*(\d{1,3})\s*[-–.]?\s*(mavzu|dars|тема)\b|^\s*(mavzu|тема)\s*[№#]?\s*(\d{1,3})", re.I)
SUB_TURLAR = ("xarita", "maruza", "amaliy", "nazorat", "mustaqil")


def qoida_turi_aniq(t):
    """Umumiy «N-mavzu» qoidasisiz — faqat aniq bo'lim nomlari."""
    n = norm(t)
    for tur, rx in QOIDALAR:
        if tur == "maruza":
            rx = r"ma.?ruza|лекци"
        if re.search(rx, n, re.I):
            return tur
    return None


def qoidalar_bilan(toc, sahifalar):
    """AI bo'lmaganda: mundarija (hujjat tartibida) yoki kuchli bet sarlavhalari bo'yicha bo'laklash.
    «N-mavzu» sarlavhasi mavzu kontekstini ochadi: undan keyingi xarita/ma'ruza/amaliy/savollar shu mavzu raqamini oladi."""
    nomzod = [(pg, t.strip(), lvl) for lvl, t, pg in toc if pg >= 1 and lvl <= 3 and t.strip()]
    if len(nomzod) < 3:
        nomzod = []
        for i, s in enumerate(sahifalar):
            for t, kuchli in s["boshlar"][:3]:
                if kuchli and (qoida_turi_aniq(t) or MAVZU_SAR.search(t)):
                    nomzod.append((i + 1, t, 1 if MAVZU_SAR.search(t) or (qoida_turi_aniq(t) not in SUB_TURLAR) else 2))
    qism, cur = [], None
    def qosh(q):
        if qism and qism[-1]["bet_bosh"] == q["bet_bosh"]:
            if qism[-1].get("_mavzu") or qism[-1]["turi"] in ("boshqa", "titul"):
                qism[-1] = q
            return
        qism.append(q)
    for pg, t, lvl in nomzod:
        m = MAVZU_SAR.search(t)
        tur = qoida_turi_aniq(t)
        if m and tur in (None, "maruza"):
            d = int(m.group(1) or m.group(4))
            cur = (d, t)
            qosh({"turi": "maruza", "sarlavha": t[:200], "dars": d, "bet_bosh": pg, "_mavzu": True})
            continue
        if tur is None:
            if lvl > 1:
                continue
            cur = None
            qosh({"turi": "boshqa", "sarlavha": t[:200], "dars": None, "bet_bosh": pg})
            continue
        if cur and tur in SUB_TURLAR and lvl > 1:
            qosh({"turi": tur, "sarlavha": (cur[1] + " — " + t)[:200], "dars": cur[0], "bet_bosh": pg})
        else:
            if lvl == 1:
                cur = None
            qosh({"turi": tur, "sarlavha": t[:200], "dars": dars_raqami(t), "bet_bosh": pg})
    for q in qism:
        q.pop("_mavzu", None)
    return qism


def ai_sorov(matn, tizim):
    """Gemini (GEMINI_API_KEY) → GitHub Models (GITHUB_TOKEN). JSON qaytaradi yoki None."""
    gk = os.environ.get("GEMINI_API_KEY", "").strip()
    if gk:
        for model in ("gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"):
            try:
                body = {"systemInstruction": {"parts": [{"text": tizim}]}, "contents": [{"role": "user", "parts": [{"text": matn}]}],
                        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1}}
                req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gk}",
                                             data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=240) as r:
                    j = json.loads(r.read().decode())
                t = j["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(re.sub(r"^```(?:json)?|```$", "", t.strip()))
            except Exception as e:
                log("  Gemini", model, "xato:", str(e)[:200])
    gt = os.environ.get("GITHUB_TOKEN", "").strip()
    if gt:
        for model in ("openai/gpt-4.1-mini", "openai/gpt-4o-mini"):
            try:
                body = {"model": model, "temperature": 0.1, "response_format": {"type": "json_object"},
                        "messages": [{"role": "system", "content": tizim}, {"role": "user", "content": matn[:24000]}]}
                req = urllib.request.Request("https://models.github.ai/inference/chat/completions", data=json.dumps(body).encode(),
                                             headers={"Content-Type": "application/json", "Authorization": "Bearer " + gt, "Accept": "application/json"})
                with urllib.request.urlopen(req, timeout=240) as r:
                    j = json.loads(r.read().decode())
                return json.loads(j["choices"][0]["message"]["content"])
            except Exception as e:
                log("  GitHub Models", model, "xato:", str(e)[:200])
    return None


TIZIM = ("Sen kasbiy ta'lim (texnikum) metodistisan. O'qituvchining o'quv-uslubiy majmuasi PDF'ining mundarijasi va har bet sarlavhalari beriladi. "
         "Majmuani mantiqiy qismlarga ajrat. Har qism uchun: turi (faqat: " + ", ".join(TURLAR) + "), dars (dars/mavzu raqami yoki null), "
         "sarlavha (qisqa, o'zbekcha, asl nomga yaqin), bet_bosh (qism boshlanadigan bet raqami). "
         "Qoidalar: tmr — taqvim-mavzu reja; xarita — darsning texnologik xaritasi; maruza — nazariy dars matni; amaliy — amaliy/laboratoriya ishi; "
         "mustaqil — mustaqil ta'lim topshiriqlari; nazorat — test, savollar, biletlar; glossariy — atamalar; adabiyot — adabiyotlar ro'yxati; "
         "dastur — ishchi/o'quv dastur; titul — muqova; annotatsiya — kirish/annotatsiya. "
         "Har mavzu uchun xarita va ma'ruza alohida bo'lsa, alohida qism qil. Bet raqamlarini faqat berilgan ma'lumotdan ol, to'qima. "
         'Javob: {"qismlar":[{"turi":"…","dars":1,"sarlavha":"…","bet_bosh":5}]} — bet_bosh bo\'yicha o\'sish tartibida.')


def ai_bilan(toc, sahifalar, nom):
    satrlar = [f"Fayl: {nom}", f"Jami bet: {len(sahifalar)}"]
    if toc:
        satrlar.append("MUNDARIJA (daraja | sarlavha | bet):")
        satrlar += [f"{l} | {t.strip()[:120]} | {p}" for l, t, p in toc[:600]]
    satrlar.append("BETLAR BOSHI (bet: sarlavha nomzodlari):")
    for i, s in enumerate(sahifalar):
        if s["boshlar"]:
            satrlar.append(f"{i + 1}: " + " ¦ ".join(t[:90] for t, _ in s["boshlar"][:3]))
    matn = "\n".join(satrlar)
    if len(matn) > 180000:
        matn = matn[:180000]
    r = ai_sorov(matn, TIZIM)
    if not r:
        return None
    L = r.get("qismlar") if isinstance(r, dict) else r
    out = []
    for q in L or []:
        try:
            b = int(q.get("bet_bosh"))
        except Exception:
            continue
        if not 1 <= b <= len(sahifalar):
            continue
        tur = q.get("turi") if q.get("turi") in TURLAR else (qoida_turi(q.get("sarlavha", "")) or "boshqa")
        d = q.get("dars")
        try:
            d = int(d) if d not in (None, "", "null") else None
        except Exception:
            d = dars_raqami(str(d))
        out.append({"turi": tur, "sarlavha": str(q.get("sarlavha") or "")[:200], "dars": d, "bet_bosh": b})
    return out if len(out) >= 2 else None


def yakunla(qism, n_bet):
    qism = sorted([q for q in qism if 1 <= q["bet_bosh"] <= n_bet], key=lambda q: q["bet_bosh"])
    toza = []
    for q in qism:
        if toza and toza[-1]["bet_bosh"] == q["bet_bosh"]:
            if toza[-1]["turi"] in ("boshqa", "titul") and q["turi"] not in ("boshqa", "titul"):
                toza[-1] = q
            continue
        toza.append(q)
    if not toza or toza[0]["bet_bosh"] > 1:
        toza.insert(0, {"turi": "titul" if (toza and toza[0]["bet_bosh"] <= 3) else "boshqa", "sarlavha": "Kirish qismi", "dars": None, "bet_bosh": 1})
    for i, q in enumerate(toza):
        q["bet_oxir"] = (toza[i + 1]["bet_bosh"] - 1) if i + 1 < len(toza) else n_bet
        if not q.get("dars"):
            q["dars"] = dars_raqami(q["sarlavha"])
        q["id"] = f"q{i + 1}"
    return toza


def kuvi_bolaklar(sahifalar):
    out = []
    for i, s in enumerate(sahifalar):
        t = re.sub(r"[ \t]+", " ", s["matn"]).strip()
        t = re.sub(r"\n{2,}", "\n", t)
        while t:
            bo = t[:1400]
            if len(t) > 1400:
                k = bo.rfind("\n", 700)
                if k < 0: k = bo.rfind(". ", 700)
                if k > 0: bo = t[:k + 1]
            out.append({"b": i + 1, "t": bo.strip()})
            t = t[len(bo):].strip()
    return out


def tuzilma(pdf, nom):
    import pymupdf
    doc = pymupdf.open(pdf)
    toc = doc.get_toc(simple=True)
    sahifalar = bet_boshlari(doc)
    qism, usul = None, "qoidalar"
    try:
        qism = ai_bilan(toc, sahifalar, nom)
        if qism:
            usul = "ai"
    except Exception as e:
        log("  AI tuzilma xatosi:", e)
    if not qism:
        qism = qoidalar_bilan(toc, sahifalar)
    return yakunla(qism, doc.page_count), sahifalar, doc.page_count, usul


# ---------------------------------------------------------------- Bitta elementni qayta ishlash
def ishlov(x, manba_fayl=None):
    t0 = time.time()
    ish = tempfile.mkdtemp(prefix="agent_")
    try:
        nom = x.get("nom") or "majmua"
        ext = (x.get("ext") or (nom.rsplit(".", 1)[-1] if "." in nom else "")).lower()
        kir = os.path.join(ish, "kirish." + (ext or "bin"))
        if manba_fayl:
            shutil.copy(manba_fayl, kir)
        else:
            if not x.get("drive_id"):
                raise RuntimeError("Drive fayl ID yo‘q")
            hajm = yuklab_ol(drive_url(x["drive_id"]), kir)
            log(f"  yuklab olindi: {hajm // 1024} KB")
        pdf = pdf_ga(kir, ish)
        log(f"  PDF tayyor ({time.time() - t0:.0f} s)")
        chiq = os.path.join(ILDIZ, "fayl", x["id"] + ".pdf")
        os.makedirs(os.path.dirname(chiq), exist_ok=True)
        optimallashtir(pdf, chiq)
        qism, sahifalar, n, usul = tuzilma(chiq, nom)
        log(f"  {n} bet, {len(qism)} qism ({usul}), {time.time() - t0:.0f} s")
        meta = {
            "id": x["id"], "yonalish": x.get("yonalish", ""), "fan": x.get("fan", ""), "sem": str(x.get("sem") or ""),
            "nom": nom, "oqituvchi": x.get("oqituvchi", ""), "fan_nomi": x.get("fan_nomi", ""), "yonalish_nomi": x.get("yonalish_nomi", ""),
            "betlar": n, "pdf": f"fayl/{x['id']}.pdf", "hajm": os.path.getsize(chiq), "drive_id": x.get("drive_id", ""),
            "usul": usul, "sana": hozir(), "qismlar": qism,
        }
        yoz(os.path.join(ILDIZ, "agent", "m", x["id"] + ".json"), meta)
        yoz(os.path.join(ILDIZ, "agent", "k", x["id"] + ".json"), {"id": x["id"], "betlar": n, "b": kuvi_bolaklar(sahifalar)})
        return meta
    finally:
        shutil.rmtree(ish, ignore_errors=True)


def indeks_yangila():
    out = {}
    papka = os.path.join(ILDIZ, "agent", "m")
    if os.path.isdir(papka):
        for f in sorted(os.listdir(papka)):
            m = oqi(os.path.join(papka, f), None)
            if not m:
                continue
            out.setdefault(f"{m['yonalish']}|{m['fan']}", []).append({k: m[k] for k in ("id", "sem", "nom", "oqituvchi", "betlar", "sana")})
    yoz(os.path.join(ILDIZ, "agent", "index.json"), out)


def ochir(i):
    for p in (f"fayl/{i}.pdf", f"agent/m/{i}.json", f"agent/k/{i}.json"):
        try:
            os.remove(os.path.join(ILDIZ, p))
        except FileNotFoundError:
            pass


def papka_hajmi(p):
    return sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(p) for f in fs) if os.path.isdir(p) else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tekshir", action="store_true")
    ap.add_argument("--fayl"); ap.add_argument("--url", help="sinov: ochiq havoladagi faylni qayta ishlash"); ap.add_argument("--yonalish", default="sinov"); ap.add_argument("--fan", default="sinov"); ap.add_argument("--sem", default="1")
    ap.add_argument("--id"); ap.add_argument("--max", type=int, default=6, help="bir ishga tushishda nechta element")
    a = ap.parse_args()
    holat_yol = os.path.join(ILDIZ, "agent", "holat.json")
    holat = oqi(holat_yol, {})

    if a.url and not a.fayl:
        tmp = tempfile.mkdtemp(prefix="url_")
        a.fayl = os.path.join(tmp, re.sub(r"[^\w.\-]+", "_", a.url.split("?")[0].rsplit("/", 1)[-1]) or "fayl.bin")
        log("yuklanmoqda:", a.url, yuklab_ol(a.url, a.fayl), "bayt")
    if a.fayl:
        x = {"id": a.id or ("sinov-" + hashlib.sha1(os.path.abspath(a.fayl).encode()).hexdigest()[:8]), "nom": os.path.basename(a.fayl),
             "yonalish": a.yonalish, "fan": a.fan, "sem": a.sem, "oqituvchi": "Sinov"}
        m = ishlov(x, a.fayl)
        holat[x["id"]] = {"holat": "tayyor", "sana": hozir(), "betlar": m["betlar"], "qismlar": len(m["qismlar"])}
        yoz(holat_yol, holat); indeks_yangila()
        print(json.dumps({k: m[k] for k in ("id", "betlar", "usul")}, ensure_ascii=False))
        return

    try:
        N = navbat()
    except Exception as e:
        log("Navbatni o'qib bo'lmadi:", e)
        if a.tekshir:
            print("bor=0", file=open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a"))
        return
    idlar = {x["id"] for x in N}
    yangi = [x for x in N if x["id"] not in holat]
    eskirgan = [i for i in holat if i not in idlar and not i.startswith("sinov-")]
    if a.tekshir:
        bor = 1 if (yangi or eskirgan) else 0
        log(f"navbat: {len(N)}, yangi: {len(yangi)}, o'chirilgan: {len(eskirgan)}")
        with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a") as f:
            f.write(f"bor={bor}\n")
        return
    # O'qituvchi yoki admin navbatdan o'chirgan elementlar — natijalari ham o'chiriladi
    for i in eskirgan:
        log("o'chirildi:", i); ochir(i); holat.pop(i, None)
    yangi.sort(key=lambda x: str(x.get("yaratildi") or ""))
    for x in yangi[: a.max]:
        log(f"→ {x['id']}: {x.get('nom')} ({x.get('yonalish')} / {x.get('fan')})")
        if papka_hajmi(os.path.join(ILDIZ, "fayl")) > MAX_JAMI:
            holat[x["id"]] = {"holat": "xato", "sana": hozir(), "xabar": "Saytdagi joy tugadi — admin eski majmualarni o‘chirishi kerak."}
            continue
        try:
            m = ishlov(x)
            holat[x["id"]] = {"holat": "tayyor", "sana": hozir(), "betlar": m["betlar"], "qismlar": len(m["qismlar"])}
        except Exception as e:
            log("  XATO:", e); ochir(x["id"])
            holat[x["id"]] = {"holat": "xato", "sana": hozir(), "xabar": str(e)[:300]}
        yoz(holat_yol, holat)
    yoz(holat_yol, holat)
    indeks_yangila()


if __name__ == "__main__":
    main()
