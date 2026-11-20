"""Kuvi agent — majmuadan fan viktorinasi uchun testlar (texnikum1son.uz).

1. Majmuaning o'zidagi testlar ajratib olinadi (qoidalar bilan, AI shart emas):
     «1. Savol? A) … B) … C) … D) …» + «To'g'ri javoblar kaliti: 1–B, 2–C …»   yoki   to'g'ri variant oldida «*» belgisi.
2. AI bor bo'lsa (GEMINI_API_KEY yoki GitHub Models — GITHUB_TOKEN), har bir ma'ruza/amaliy dars matnidan
   qo'shimcha savollar tuziladi (faqat matndagi ma'lumot asosida).
Natija: agent/t/<majmua-id>.json — viktorina/ sahifasi shu fanning savollariga qo'shadi.
Savol formati: [savol, to'g'ri javob, [xato javoblar], izoh]
"""
import json
import re

HARF = {"A": 0, "B": 1, "C": 2, "D": 3, "S": 2, "А": 0, "В": 1, "С": 2, "Д": 3, "Б": 1, "Г": 3}
SAVOL_RX = re.compile(r"^\s*(\d{1,3})\s*[.)]+[\s.]*(?=\S)(.*)$")
VARIANT_RX = re.compile(r"^\s*(\*?)\s*([A-DАВСДБГS])\s*(?:[.)]+|\s|(?=[’'\"‘“«]))\s*(\*?)\s*(.*)$")
KALIT_RX = re.compile(r"(?:to.?g.?ri\s+javoblar?\s*(?:kaliti)?|javoblar\s+kaliti|kalit)\s*[:\-–]?\s*((?:\d{1,3}\s*[-–—]\s*[A-DАВСДS]\s*[,;.]?\s*)+)", re.I)
TIZIM = ("Sen kasbiy ta'lim (texnikum) o'qituvchisisan. Berilgan dars matni asosida o'quvchilar bilimini tekshiradigan test savollari tuz. "
         "Qoidalar: faqat matndagi ma'lumotga tayan, hech narsani to'qima; har savolda 1 ta to'g'ri va 3 ta ishonarli, lekin aniq noto'g'ri javob bo'lsin; "
         "javoblar qisqa (12 so'zdan oshmasin) va bir-biridan aniq farq qilsin; «hammasi to'g'ri», «barchasi», «hech biri» kabi javoblar ishlatma; "
         "savollar dars matni tilida bo'lsin (o'zbekcha bo'lsa — lotin yozuvida), fan atamalarini saqlab qol; har savolga matndan bir gaplik izoh yoz. "
         'Javob faqat JSON: {"savollar":[{"s":"savol","a":"to\'g\'ri javob","w":["xato 1","xato 2","xato 3"],"i":"izoh"}]}')


def toza(s):
    s = re.sub(r"[ \t]+", " ", str(s or "")).strip()
    s = re.sub(r"\s+([,.;:?!])", r"\1", s)
    return s


def kalit(s):
    return re.sub(r"[ʻʼ‘’`´'\"«»“”.,;:!?()\-–—\s*]+", " ", str(s).lower()).strip()


def _tozala_matn(t):
    out = []
    for ln in t.replace("\r", "").split("\n"):
        s = ln.strip()
        if not s or re.fullmatch(r"\d{1,3}", s) or s in ("℃", "°C", "°"):
            continue
        out.append(s)
    return out


def imlo(t):
    """O'zbekcha matn: o’ g’ -> o‘ g‘, ’’…’’ -> «…»"""
    t = re.sub(r"[’‘'`ʻʼ]{2}\s*(.+?)\s*[’‘'`ʻʼ]{2}", r"«\1»", t)
    t = re.sub(r"([oOgG])[’'`ʻʼ]", lambda m: m.group(1) + "‘", t)
    return re.sub(r"(?<=\w)['`ʼ](?=\w)", "’", t)


def _yakunla(q):
    """q: {'s': [...], 'v': [[matn, yulduz]], 'kalit': k} -> [savol, to'g'ri, [xatolar]] yoki None"""
    s = toza(" ".join(q["s"]))
    s = re.sub(r"\s*\.\s*$", "", s) if s.endswith("..") else s
    s = re.sub(r"\bnecha\s+da\s+temperatura", "necha °C da temperatura", s)
    vs = []
    for v in q["v"]:
        t = toza(" ".join(v[0]))
        t = re.sub(r"(\d)\s*\*", r"\1°", t)                # 280* -> 280° (yulduzcha gradus o'rnida)
        t = re.sub(r"^(\d+\s*[-–]\s*\d+)\s+(da|dan)\b", r"\1 °C \2", t)
        vs.append([t.strip(" ;"), v[1]])
    if len(vs) < 3 or len(s) < 5 or len(vs) > 5:
        return None
    to = [i for i, v in enumerate(vs) if v[1]]
    if q.get("kalit") is not None:
        to = [q["kalit"]] if q["kalit"] < len(vs) else []
    if len(to) != 1:
        return None
    k = to[0]
    texts = [v[0] for v in vs]
    if any(not t for t in texts) or len({kalit(t) for t in texts}) != len(texts):
        return None
    return [s, texts[k], [t for i, t in enumerate(texts) if i != k]]


def ajrat(matn):
    """Matndagi test savollarini ajratib oladi -> [[savol, to'g'ri, [xatolar]], ...]"""
    lines = _tozala_matn(matn)
    kalitlar = {}
    for m in KALIT_RX.finditer(" ".join(lines)):
        for n, h in re.findall(r"(\d{1,3})\s*[-–—]\s*([A-DАВСДS])", m.group(1)):
            kalitlar.setdefault(int(n), []).append(HARF[h.upper()])
    qs, cur, oxirgi = [], None, None
    for s in lines:
        if KALIT_RX.search(s) or re.match(r"^(og.?zaki savollar|baholash|\d+-ilova)", s, re.I):
            if cur:
                qs.append(cur)
            cur, oxirgi = None, None
            continue
        mv = VARIANT_RX.match(s)
        if cur is not None and mv and (cur["v"] or cur["s"]) and len(cur["v"]) < 4:
            h = HARF[mv.group(2).upper()]
            # odatda harflar ketma-ket (A, B, C, D); harfsiz «*» variantdan keyin harflar bittaga orqada qoladi
            if h == len(cur["v"]) % 4 or (cur.get("siljish") and h == (len(cur["v"]) - 1) % 4):
                cur["v"].append([[mv.group(4)], bool(mv.group(1) or mv.group(3))])
                oxirgi = "v"
                continue
        if cur is not None and s.startswith("*") and cur["v"] and len(cur["v"]) < 4:   # harfsiz, lekin «*» bilan belgilangan variant
            cur["v"].append([[s.lstrip("* ")], True])
            cur["siljish"] = True
            oxirgi = "v"
            continue
        ms = SAVOL_RX.match(s)
        if ms and (cur is None or len(cur["v"]) >= 2 or not cur["v"]):
            if cur and (cur["v"] or not ms.group(2)):
                qs.append(cur)
            elif cur and not cur["v"]:
                pass  # savol matni hali variantlarsiz edi — yangi savol bilan almashtiriladi
            cur = {"n": int(ms.group(1)), "s": [ms.group(2)], "v": []}
            oxirgi = "s"
            continue
        if cur is None:
            continue
        if oxirgi == "v" and cur["v"]:
            cur["v"][-1][0].append(s)
        elif oxirgi == "s":
            cur["s"].append(s)
    if cur:
        qs.append(cur)
    out, seen = [], set()
    # kalit raqamlari bloklar bo'yicha takrorlanadi (har dars 1–5) — tartib bilan moslanadi
    ishlatildi = {}
    for q in qs:
        k = kalitlar.get(q["n"])
        if k:
            j = ishlatildi.get(q["n"], 0)
            q["kalit"] = k[j] if j < len(k) else None
            ishlatildi[q["n"]] = j + 1
        r = _yakunla(q)
        if r:
            kk = kalit(r[0]) + "|" + kalit(r[1])
            if kk not in seen:
                seen.add(kk)
                out.append(r)
    return out


def qism_matnlari(meta, bolaklar):
    """agent/m qismlari -> [(qism, matn)] (agent/k bo'laklaridan, bet oralig'i bo'yicha)"""
    betlar = {}
    for b in bolaklar:
        betlar.setdefault(b["b"], []).append(b["t"])
    out = []
    for q in meta.get("qismlar", []):
        t = "\n".join("\n".join(betlar.get(p, [])) for p in range(q["bet_bosh"], q["bet_oxir"] + 1))
        out.append((q, t))
    return out


def mavzu_nomi(q):
    s = re.split(r"\s+[—–-]\s+(?:mustahkamlash|amaliy topshiriq|dars ssenariysi|asosiy tushunchalar|mustaqil)", q.get("sarlavha") or "", maxsplit=1, flags=re.I)[0]
    s = re.sub(r"\s*\((?:\d+[–-]\d+-ilova|nazariy|amaliy)[^)]*\)\s*$", "", s).strip()
    if q.get("dars"):
        s = f"{q['dars']}-mavzu. {s}"
    return s[:110] or "Majmuadagi test"


def _ai_tekshir(x):
    try:
        s, a, w = toza(x["s"]), toza(x["a"]), [toza(v) for v in x["w"]]
    except Exception:
        return None
    w = [v for v in w if v and kalit(v) != kalit(a)][:3]
    if not (8 <= len(s) <= 320) or not a or len(a) > 160 or len(w) < 2 or any(len(v) > 160 for v in w):
        return None
    if len({kalit(v) for v in [a] + w}) != len(w) + 1 or re.search(r"hammasi|barchasi|hech biri|all of the above", " ".join([a] + w), re.I):
        return None
    q = [s, a, w]
    if toza(x.get("i")):
        q.append(toza(x["i"])[:300])
    return q


def ai_savollar(qm, ai_sorov, log=print, har_dars=4, max_dars=30):
    """qm: [(qism, matn)] — ma'ruza/amaliy darslar matnidan AI savollar -> mavzular ro'yxati"""
    out, n = [], 0
    for q, t in qm:
        if q.get("turi") not in ("maruza", "amaliy") or len(t) < 600:
            continue
        if n >= max_dars:
            break
        n += 1
        r = ai_sorov(f"Fan darsi: {q.get('sarlavha')}\nKerakli savollar soni: {har_dars}\n\nDARS MATNI:\n{t[:7000]}", TIZIM)
        if not r:
            log("  AI savollar: javob yo'q —", (q.get("sarlavha") or "")[:60])
            if n >= 2 and not out:
                break       # AI ishlamayapti — vaqtni behuda sarflamaymiz
            continue
        qs = [x for x in (_ai_tekshir(x) for x in (r.get("savollar") if isinstance(r, dict) else r) or []) if x][:har_dars + 1]
        if qs:
            out.append({"nomi": mavzu_nomi(q), "manba": "ai", "q": qs})
    return out


def yig(meta, bolaklar, ai_sorov=None, log=print, eski=None):
    """-> agent/t/<id>.json mazmuni (yoki savol topilmasa None)"""
    qm = qism_matnlari(meta, bolaklar)
    uz = not re.search(r"ingliz|english|chet-tili", (meta.get("fan") or "") + " " + (meta.get("fan_nomi") or ""), re.I)
    mav, jami = [], 0
    for q, t in qm:
        if not re.search(r"(?m)^\s*\*?\s*[A-DАВСД]\s*[.)]", t):
            continue
        qs = ajrat(t)
        if uz:
            qs = [[imlo(x[0]), imlo(x[1]), [imlo(w) for w in x[2]]] + x[3:] for x in qs]
        if len(qs) >= 2:
            nom = "Oraliq va yakuniy nazorat testi" if not q.get("dars") and q.get("turi") == "nazorat" else mavzu_nomi(q)
            mav.append({"nomi": nom, "manba": "majmua", "q": qs})
            jami += len(qs)
    log(f"  majmuadagi testlar: {jami} ta savol, {len(mav)} ta bo'lim")
    ai = []
    if eski and eski.get("ai_sana"):
        ai = [m for m in eski.get("mavzular", []) if m.get("manba") == "ai"]
    elif ai_sorov:
        ai = ai_savollar(qm, ai_sorov, log)
        log(f"  AI savollar: {sum(len(m['q']) for m in ai)} ta")
    if not mav and not ai:
        return None
    d = {"id": meta["id"], "yonalish": meta.get("yonalish", ""), "fan": meta.get("fan", ""), "nom": meta.get("nom", ""),
         "oqituvchi": meta.get("oqituvchi", ""), "mavzular": mav + ai}
    if ai:
        d["ai_sana"] = (eski or {}).get("ai_sana") or meta.get("_sana") or ""
    return d
