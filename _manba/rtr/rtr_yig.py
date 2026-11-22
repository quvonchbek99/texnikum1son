#!/usr/bin/env python3
"""Modulli fanlar manbasi (_manba/rtr/<fan>/) -> RTR JSON paketlari (data/rtr/<fan>-<N>sem.json).

Har fan papkasida:
  meta.json            — fan, modullar, paketlar (semestr -> kurs va darslar), annotatsiya, adabiyotlar, TMR ma'lumoti
  tmr-<kurs>kurs.tsv   — o'qituvchi TMR'i (asl yozuv): №, mavzu, tur (N/A/NA), mustaqil ish, baholash
  <kurs>-<NN>.txt      — har bir dars (ixcham matn, quyidagi kalitlar bilan)
  mustaqil.txt         — mustaqil ta'lim topshiriqlari
  biletlar.txt         — nazorat uchun amaliy biletlar

Dars fayli kalitlari (har biri qator boshida, kichik harf bilan):
  nomi: tur: modul: ac: maqsad: natija:* reja:* tayanch: (a; b; c) metod:* (Nomi | qo'llanishi) jihoz: (a; b)
  ## Bo'lim sarlavhasi  — ma'ruza matni (yoki amaliy darsning qisqa nazariyasi); ichida:
      oddiy qator — paragraf, "### " — kichik sarlavha, "- " — ro'yxat, "#. " — raqamli ro'yxat,
      "jadval: Sarlavha" + "| a | b |" qatorlar (birinchisi — ustunlar), ``` ... ``` — kod
  keys: (sarlavha)  vaziyat:  ksavol:*  kjavob:
  savol:*  test:* (Savol? | To'g'ri | Xato | Xato | Xato ## izoh — to'g'ri javob doim birinchi yoziladi)
  amaliy: (ish nomi)  amaqsad:  ajihoz: (a; b)  xavf:*  qadam:*  anatija:  baho5: baho4: baho3: baho2:
  masala: (shart) [```kod```]  yechim: (javob) [```kod```]
  uyga:  gloss:* (Atama | izoh)
Matnda oddiy apostrof yoziladi: o' g' -> oʻ gʻ, qolgani -> ʼ (kod va `...` ichida o'zgarmaydi).
"""
import json
import os
import re
import zlib

DEF_XAVF = [
    "Kompyuter va qurilmalarni faqat o'qituvchi ruxsati bilan yoqing; kabel, vilka va rozetkaga ho'l qo'l bilan tegmang.",
    "Ish joyida ovqatlanmang va suyuqlik qo'ymang; kabellar o'tish joyida yotmasligiga e'tibor bering.",
    "Monitordan 50–70 sm masofada, belni tik tutib o'tiring; har 45–60 daqiqada ko'z va qo'llarga qisqa dam bering.",
    "Nosozlik, uchqun yoki kuygan hid sezilsa, ishni to'xtating va darhol o'qituvchiga xabar bering.",
    "Boshqalarning fayllari, parollari va shaxsiy ma'lumotlariga ruxsatsiz kirmang; notanish fayl va havolalarni ochmang.",
]
DEF_BAHO = {
    "5": "Topshiriqni to'liq, to'g'ri va belgilangan vaqtda mustaqil bajaradi; natijani asoslab tushuntiradi.",
    "4": "Topshiriqni to'liq bajaradi, lekin 1–2 ta kichik xatoga yo'l qo'yadi yoki ayrim bosqichlarda yordam so'raydi.",
    "3": "Topshiriqning asosiy qismini bajaradi; xatolari bor, natijani tushuntirishda qiynaladi.",
    "2": "Topshiriqning yarmidan kamini bajaradi yoki natija talabga javob bermaydi.",
}
DEF_JIHOZ_N = ["Kompyuter va proyektor (yoki interaktiv doska)", "Mavzu bo'yicha taqdimot", "Tarqatma material: tayanch tushunchalar va sxemalar"]
DEF_JIHOZ_A = ["Kompyuter (har bir o'quvchi yoki juftlikka bittadan)", "Proyektor yoki interaktiv doska", "Topshiriq varaqasi"]
TUR = {"N": "Nazariy", "A": "Amaliy", "NA": "Nazariy-amaliy", "L": "Laboratoriya"}

KALIT = ("nomi tur modul ac maqsad natija reja tayanch metod jihoz keys vaziyat ksavol kjavob savol test amaliy amaqsad ajihoz xavf qadam "
         "anatija baho5 baho4 baho3 baho2 masala yechim uyga gloss").split()
KRE = re.compile(r"^(" + "|".join(KALIT) + r"):\s?(.*)$")


def apostrof(s):
    """o' g' -> oʻ gʻ (U+02BB), so'zlar ichidagi boshqa ' -> ʼ (U+02BC); `kod` qismlariga tegmaydi."""
    def bir(t):
        t = re.sub(r"([oOgG])['ʻ‘`]", lambda m: m.group(1) + "ʻ", t)
        return re.sub(r"(?<=\w)['’`](?=\w)", "ʼ", t)
    qism = re.split(r"(`[^`]*`)", s)
    return "".join(q if q.startswith("`") else bir(q) for q in qism)


def ap_deep(x):
    if isinstance(x, str): return apostrof(x)
    if isinstance(x, list): return [ap_deep(v) for v in x]
    if isinstance(x, dict): return {k: ap_deep(v) for k, v in x.items()}
    return x


def toza(s):
    return re.sub(r"\s+", " ", s or "").strip()


def ror(seed, n):
    return zlib.crc32(seed.encode("utf-8")) % n


class Xato(Exception):
    pass


def dars_oqi(fp):
    """Bitta dars fayli -> dict (xom)."""
    L = open(fp, encoding="utf-8").read().replace("\r", "").split("\n")
    d = {"natija": [], "reja": [], "metod": [], "ksavol": [], "savol": [], "test": [], "xavf": [], "qadam": [], "masala": [], "gloss": [], "matn": []}
    sek = None          # joriy ma'ruza bo'limi
    kod = None          # ``` ichidagi qatorlar
    kod_joy = None      # kod qayerga: "matn" | ("masala", "shart"/"yechim")
    jad = None          # joriy jadval
    oxirgi = None       # oxirgi kalit (masala/yechim uchun)

    def blok(b):
        if sek is None:
            raise Xato(f"{fp}: matn bo'limidan tashqarida: {b}")
        sek["bloklar"].append(b)

    def jad_yop():
        nonlocal jad
        if jad is not None:
            if not jad["qatorlar"]:
                raise Xato(f"{fp}: jadvalda qator yo'q: {jad.get('sarlavha')}")
            blok(jad)
            jad = None

    for no, raw in enumerate(L, 1):
        s = raw.rstrip()
        if kod is not None:
            if s.strip() == "```":
                txt = "\n".join(kod)
                if kod_joy == "matn":
                    blok({"kod": txt})
                else:
                    m = d["masala"][-1]
                    m[kod_joy[1]].append({"kod": txt})
                kod = None
            else:
                kod.append(raw)
            continue
        if s.strip() == "```":
            jad_yop()
            kod = []
            kod_joy = ("masala", oxirgi) if oxirgi in ("shart", "yechim") else "matn"
            continue
        if not s.strip():
            jad_yop()
            continue
        m = KRE.match(s)
        if m:
            jad_yop()
            k, v = m.group(1), m.group(2).strip()
            sek = None   # kalit qatori ma'ruza bo'limini yopadi
            oxirgi = None
            if k in ("natija", "reja", "metod", "ksavol", "savol", "test", "xavf", "qadam", "gloss"):
                d[k].append(v)
            elif k == "masala":
                d["masala"].append({"shart": [v] if v else [], "yechim": []})
                oxirgi = "shart"
            elif k == "yechim":
                if not d["masala"]:
                    raise Xato(f"{fp}:{no}: yechim masalasiz")
                d["masala"][-1]["yechim"] = [v] if v else []
                oxirgi = "yechim"
            else:
                if k in d and d[k]:
                    raise Xato(f"{fp}:{no}: '{k}' ikki marta")
                d[k] = v
            continue
        if s.startswith("## "):
            jad_yop()
            sek = {"sarlavha": s[3:].strip(), "bloklar": []}
            d["matn"].append(sek)
            oxirgi = None
            continue
        if oxirgi in ("shart", "yechim"):   # masala/yechimning davomi (oddiy matn)
            d["masala"][-1][oxirgi].append(s.strip())
            continue
        if sek is None:
            raise Xato(f"{fp}:{no}: tanilmagan qator: {s[:80]}")
        if s.startswith("### "):
            jad_yop(); blok({"h": s[4:].strip()})
        elif s.startswith("- "):
            jad_yop()
            if sek["bloklar"] and "ul" in sek["bloklar"][-1]:
                sek["bloklar"][-1]["ul"].append(s[2:].strip())
            else:
                blok({"ul": [s[2:].strip()]})
        elif s.startswith("#. "):
            jad_yop()
            if sek["bloklar"] and "ol" in sek["bloklar"][-1]:
                sek["bloklar"][-1]["ol"].append(s[3:].strip())
            else:
                blok({"ol": [s[3:].strip()]})
        elif s.startswith("jadval:"):
            jad_yop()
            jad = {"tur": "table", "sarlavha": s[7:].strip(), "ustunlar": None, "qatorlar": []}
        elif s.startswith("|"):
            cells = [c.strip() for c in s.strip().strip("|").split("|")]
            if jad is None:
                jad = {"tur": "table", "sarlavha": "", "ustunlar": None, "qatorlar": []}
            if jad["ustunlar"] is None:
                jad["ustunlar"] = cells
            else:
                if len(cells) != len(jad["ustunlar"]):
                    raise Xato(f"{fp}:{no}: jadval ustunlari soni mos emas")
                jad["qatorlar"].append(cells)
        else:
            jad_yop(); blok({"p": s.strip()})
    if kod is not None:
        raise Xato(f"{fp}: ``` yopilmagan")
    jad_yop()
    return d


def sozlar(bloklar):
    n = 0
    for b in bloklar:
        if "p" in b: n += len(b["p"].split())
        elif "h" in b: n += len(b["h"].split())
        elif "ul" in b or "ol" in b: n += sum(len(x.split()) for x in b.get("ul") or b.get("ol"))
        elif b.get("tur") == "table": n += sum(len(c.split()) for r in b["qatorlar"] for c in r)
    return n


def test_qur(raw, seed):
    q, _, izoh = raw.partition("##")
    parts = [toza(x) for x in q.split("|")]
    if len(parts) != 5 or not all(parts):
        raise Xato(f"test 4 variantli bo'lsin: {raw[:90]}")
    savol, togri, xato = parts[0], parts[1], parts[2:]
    k = ror(seed + savol, 4)
    v = xato[:]
    v.insert(k, togri)
    t = {"savol": apostrof(savol), "variantlar": [apostrof(x) for x in v], "togri": k}
    if toza(izoh):
        t["izoh"] = apostrof(toza(izoh))
    return t


def ap_bloklar(bs):
    out = []
    for b in bs:
        if "kod" in b: out.append(b)
        elif "p" in b: out.append({"p": apostrof(b["p"])})
        elif "h" in b: out.append({"h": apostrof(b["h"])})
        elif "ul" in b: out.append({"ul": [apostrof(x) for x in b["ul"]]})
        elif "ol" in b: out.append({"ol": [apostrof(x) for x in b["ol"]]})
        elif b.get("tur") == "table":
            out.append({"tur": "table", "sarlavha": apostrof(b["sarlavha"]), "ustunlar": [apostrof(x) for x in b["ustunlar"]], "qatorlar": [[apostrof(c) for c in r] for r in b["qatorlar"]]})
    return out


def mq(qism):
    """masala shart/yechim: faqat matn bo'lsa — satr, kod bo'lsa — bloklar."""
    if all(isinstance(x, str) for x in qism):
        return apostrof(" ".join(qism))
    return ap_bloklar([x if isinstance(x, dict) else {"p": x} for x in qism])


def dars_qur(d, tmr_q, kurs, n, fp):
    tur = (d.get("tur") or tmr_q["tur"] or "").upper()
    if tur not in TUR:
        raise Xato(f"{fp}: dars turi noma'lum ({tur!r}) — TMR'da bo'sh bo'lsa, faylda 'tur:' yozing")
    t = {"id": f"T{n:02d}", "nomi": apostrof(d.get("nomi") or re.sub(r"\.\s*$", "", tmr_q["nomi"])), "nomi_tmr": tmr_q["nomi"],
         "turi": TUR[tur], "soat": 2, "lo": d.get("modul") or "", "ac": apostrof(d.get("ac", ""))}
    if not t["lo"]:
        raise Xato(f"{fp}: modul: yozilmagan")
    if tmr_q.get("mustaqil"): t["mustaqil_ish"] = tmr_q["mustaqil"]
    if tmr_q.get("baholash"): t["baholash_shakli"] = tmr_q["baholash"]
    if not tmr_q["tur"]:
        t["tur_izoh"] = apostrof("O'qituvchi TMR'ida dars turi yozilmagan — e-bazada " + TUR[tur].lower() + " deb olindi (tekshirilsin).")
    for k in ("maqsad",):
        if not d.get(k): raise Xato(f"{fp}: {k} yo'q")
        t[k] = apostrof(d[k])
    t["natijalar"] = [apostrof(x) for x in d["natija"]]
    t["reja"] = [apostrof(x) for x in d["reja"]]
    t["tayanch_tushunchalar"] = [apostrof(toza(x)) for x in (d.get("tayanch") or "").split(";") if toza(x)]
    t["metodlar"] = []
    for x in d["metod"]:
        a, _, b = x.partition("|")
        t["metodlar"].append({"nomi": apostrof(toza(a)), "qollanishi": apostrof(toza(b))})
    jih = [apostrof(toza(x)) for x in (d.get("jihoz") or "").split(";") if toza(x)]
    nazariy = tur in ("N", "NA")
    if nazariy:
        t["jihozlar"] = jih or [apostrof(x) for x in DEF_JIHOZ_N]
    t["matn"] = [{"sarlavha": apostrof(s["sarlavha"]), "bloklar": ap_bloklar(s["bloklar"])} for s in d["matn"]]
    if d.get("keys"):
        t["keys"] = {"sarlavha": apostrof(d["keys"]), "vaziyat": apostrof(d.get("vaziyat", "")), "savollar": [apostrof(x) for x in d["ksavol"]], "javob": apostrof(d.get("kjavob", ""))}
    t["savollar"] = [apostrof(x) for x in d["savol"]]
    t["test"] = [test_qur(x, f"{kurs}-{n}-{i}") for i, x in enumerate(d["test"])]
    if tur in ("A", "NA", "L"):
        if not d.get("amaliy"):
            raise Xato(f"{fp}: amaliy darsda 'amaliy:' yo'q")
        at = {"nomi": apostrof(d["amaliy"]), "maqsad": apostrof(d.get("amaqsad", "")),
              "jihozlar": [apostrof(toza(x)) for x in (d.get("ajihoz") or "").split(";") if toza(x)] or [apostrof(x) for x in DEF_JIHOZ_A],
              "xavfsizlik": [apostrof(x) for x in (d["xavf"] or DEF_XAVF)],
              "bosqichlar": [apostrof(x) for x in d["qadam"]], "natija": apostrof(d.get("anatija", "")),
              "baholash": [{"baho": int(b), "mezon": apostrof(d.get("baho" + b) or DEF_BAHO[b])} for b in ("5", "4", "3", "2")]}
        if not at["bosqichlar"]:
            raise Xato(f"{fp}: qadam: yo'q")
        t["amaliy_topshiriq"] = at
        if tur in ("A", "L") and not jih:
            pass
    t["masalalar"] = [{"shart": mq(m["shart"]), "yechim": mq(m["yechim"])} for m in d["masala"]]
    if any(not m["shart"] or not m["yechim"] for m in t["masalalar"]):
        raise Xato(f"{fp}: masala yoki yechim bo'sh")
    t["uyga_vazifa"] = apostrof(d.get("uyga", ""))
    t["glossariy"] = []
    for g in d["gloss"]:
        a, _, b = g.partition("|")
        t["glossariy"].append({"atama": apostrof(toza(a)), "izoh": apostrof(toza(b))})
    # Tekshiruvlar
    if len(t["test"]) < 4: raise Xato(f"{fp}: test kamida 4 ta bo'lsin")
    if not t["natijalar"] or not t["reja"]: raise Xato(f"{fp}: natija/reja yo'q")
    if nazariy and not t["matn"]: raise Xato(f"{fp}: ma'ruza matni yo'q")
    t["_sozlar"] = sum(sozlar(s["bloklar"]) for s in t["matn"])
    return t


def bloklar_oqi(fp, sarlavha_kalit):
    """mustaqil.txt / biletlar.txt: '@@ ...' bilan boshlanuvchi yozuvlar."""
    if not os.path.isfile(fp):
        return []
    out, cur, jad = [], None, None
    for no, raw in enumerate(open(fp, encoding="utf-8").read().replace("\r", "").split("\n"), 1):
        s = raw.strip()
        if s.startswith("#") and not s.startswith("#."):
            continue
        if s.startswith("@@"):
            cur = {"bosh": [toza(x) for x in s[2:].split("|")], "p": [], "qadam": [], "manba": [], "jadval": None}
            out.append(cur); jad = None
            continue
        if not s or cur is None:
            jad = None
            continue
        if s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if cur["jadval"] is None:
                raise Xato(f"{fp}:{no}: 'namuna:' qatorisiz jadval")
            if cur["jadval"]["ustunlar"] is None: cur["jadval"]["ustunlar"] = cells
            else: cur["jadval"]["qatorlar"].append(cells)
            continue
        k, _, v = s.partition(":")
        k, v = k.strip(), v.strip()
        if k in ("p", "qadam", "manba"):
            cur[k].append(v)
        elif k == "namuna":
            cur["jadval"] = {"sarlavha": v, "ustunlar": None, "qatorlar": []}
        elif k in ("nomi", "maqsad", "shakl", "baho5", "baho4", "baho3", "baho2", "topshiriq"):
            cur[k] = v
        else:
            raise Xato(f"{fp}:{no}: tanilmagan qator: {s[:80]}")
    return out


DEF_MBAHO = {
    "5": "Topshiriq to'liq va mustaqil bajarilgan, ma'lumotlar aniq va manbalari ko'rsatilgan, xulosa asosli; belgilangan muddatda topshirilgan.",
    "4": "Topshiriq to'liq bajarilgan, lekin ayrim ma'lumotlar yoki xulosada kichik kamchiliklar bor.",
    "3": "Topshiriqning asosiy qismi bajarilgan; tahlil yuzaki, manbalar to'liq ko'rsatilmagan.",
    "2": "Topshiriq bajarilmagan yoki boshqa ishdan ko'chirilgan.",
}


def yig(rtr_dir, chiqish, log=print):
    """Barcha fan papkalarini yig'ib, chiqish (data/rtr) ga JSON yozadi; STATIK uchun paketlar ro'yxatini qaytaradi."""
    paketlar = []
    if not os.path.isdir(rtr_dir):
        return paketlar
    for fan in sorted(os.listdir(rtr_dir)):
        fd = os.path.join(rtr_dir, fan)
        mp = os.path.join(fd, "meta.json")
        if not os.path.isfile(mp):
            continue
        M = json.load(open(mp, encoding="utf-8"))
        # TMR
        tmr = {}
        for kurs in M["kurslar"]:
            rows = {}
            for line in open(os.path.join(fd, f"tmr-{kurs}kurs.tsv"), encoding="utf-8"):
                if line.startswith("#") or not line.strip():
                    continue
                c = line.rstrip("\n").split("\t")
                rows[int(c[0])] = {"nomi": toza(c[1]), "tur": toza(c[2]).upper(), "mustaqil": toza(c[3]) if len(c) > 3 else "", "baholash": toza(c[4]) if len(c) > 4 else ""}
            tmr[kurs] = rows
        # Darslar
        D = {}
        for fn in sorted(os.listdir(fd)):
            m = re.fullmatch(r"(\d)-(\d\d)\.txt", fn)
            if not m:
                continue
            kurs, n = m.group(1), int(m.group(2))
            fp = os.path.join(fd, fn)
            D[(kurs, n)] = dars_qur(dars_oqi(fp), tmr[kurs][n], kurs, n, fp)
        mus = bloklar_oqi(os.path.join(fd, "mustaqil.txt"), "M")
        bil = bloklar_oqi(os.path.join(fd, "biletlar.txt"), "B")
        for P in M["paketlar"]:
            kurs, a, b = P["kurs"], P["darslar"][0], P["darslar"][1]
            T = [D[(kurs, n)] for n in range(a, b + 1) if (kurs, n) in D]
            yoq = [n for n in range(a, b + 1) if (kurs, n) not in D]
            if yoq:
                log(f"  [rtr] {fan} {P['sem']}-sem: hali yozilmagan darslar: {yoq} — paket chiqarilmadi")
                continue
            nz = sum(1 if t["turi"] == "Nazariy-amaliy" else (2 if t["turi"] == "Nazariy" else 0) for t in T)
            au = sum(t["soat"] for t in T)
            if au != P["auditoriya"]:
                raise Xato(f"{fan} {P['sem']}-sem: TMR soatlari {au}, rejada {P['auditoriya']}")
            mods = []
            for t in T:
                if t["lo"] not in mods: mods.append(t["lo"])
            # Mustaqil ta'lim
            ML = []
            for x in mus:
                mid, sem, lo, soat = x["bosh"][:4]
                if sem != P["sem"]:
                    continue
                ML.append({"id": mid, "nomi": apostrof(x["nomi"]), "lo": lo, "soat": soat, "maqsad": apostrof(x.get("maqsad", "")),
                           "yoriqnoma": [{"p": apostrof(p)} for p in x["p"]], "bosqichlar": [apostrof(q) for q in x["qadam"]],
                           "namuna": ({"sarlavha": apostrof(x["jadval"]["sarlavha"]), "ustunlar": [apostrof(c) for c in x["jadval"]["ustunlar"]],
                                       "qatorlar": [[apostrof(c) for c in r] for r in x["jadval"]["qatorlar"]]} if x["jadval"] else None),
                           "topshirish_shakli": apostrof(x.get("shakl", "")),
                           "baholash": [{"baho": int(k), "mezon": apostrof(x.get("baho" + k) or DEF_MBAHO[k])} for k in ("5", "4", "3", "2")],
                           "tavsiya_manbalar": [apostrof(q) for q in x["manba"]]})
            ms = sum(int(m["soat"]) for m in ML)
            # Yakuniy (yoki oraliq) nazorat: mavzu testlaridan yig'iladi
            Y = P["nazorat"]
            yt, yn = [], 0
            for n in range(Y["darslar"][0], Y["darslar"][1] + 1):
                tt = D[(kurs, n)]["test"]
                for j in range(Y.get("har_darsdan", 1)):
                    q = dict(tt[(n + 2 * j) % len(tt)])
                    yt.append(q)
            BL = []
            for x in bil:
                sem, lo, vaqt = x["bosh"][1:4]
                if sem != P["sem"]:
                    continue
                BL.append({"lo": lo, "topshiriq": apostrof(x["topshiriq"]), "vaqt": vaqt,
                           "baholash": [{"baho": int(k), "mezon": apostrof(x.get("baho" + k) or DEF_BAHO[k])} for k in ("5", "4", "3", "2")]})
            # Glossariy
            G, bor = [], {}
            for t in T:
                for g in t["glossariy"]:
                    k = g["atama"].lower()
                    if k in bor:
                        if t["id"] not in bor[k]["mavzular"]: bor[k]["mavzular"].append(t["id"])
                        continue
                    bor[k] = dict(g, mavzular=[t["id"]]); G.append(bor[k])
            meta = {k: ap_deep(v) for k, v in M["meta"].items()}
            meta.update({
                "fan": M["fan_nomi"], "modul": M["fan_nomi"], "modul_kod": "",
                "kasb": apostrof(P["kasb"]), "kirish_talablari": apostrof(P["kirish_talablari"]),
                "soat": {"jami": str(au + ms), "nazariy": str(nz), "amaliy": str(au - nz), "mustaqil": str(ms)},
                "natijalar": [{"kod": k, "matn": apostrof(M["modullar"][k])} for k in mods],
                "dars_boshi": a, "kurs": kurs, "maruza_keys": True, "amaliy_matn": True,
                "tmr": ap_deep(M["tmr"][kurs]),
            })
            sozlar_ = [t["_sozlar"] for t in T if t["turi"] in ("Nazariy", "Nazariy-amaliy")]
            out = {"meta": meta,
                   "topics": [{k: v for k, v in t.items() if not k.startswith("_")} for t in T],
                   "mustaqil": ML,
                   "yakuniy": {"nomi": apostrof(Y["nomi"]), "test": yt, "amaliy_biletlar": BL, "yigma": True},
                   "glossariy": G,
                   "adabiyotlar": [{"guruh": apostrof(g["guruh"]), "bandlar": [apostrof(x) for x in g["bandlar"]]} for g in M["adabiyotlar"]]}
            fayl = f"{fan}-{P['sem']}sem.json"
            if chiqish != "none":
                os.makedirs(chiqish, exist_ok=True)
                json.dump(out, open(os.path.join(chiqish, fayl), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
            log(f"  [rtr] {fan} {P['sem']}-sem: {len(T)} dars ({au} soat: nazariy {nz}, amaliy {au - nz}), mustaqil {len(ML)} ta / {ms} soat, "
                f"nazorat {len(yt)} test + {len(BL)} bilet, glossariy {len(G)}; ma'ruza so'zlari: {min(sozlar_) if sozlar_ else 0}–{max(sozlar_) if sozlar_ else 0}")
            paketlar.append({"yonalish": M["yonalish"], "fan": fan, "sem": P["sem"], "fayl": fayl, "manba": apostrof(P["manba"])})
    return paketlar


if __name__ == "__main__":
    import sys
    here = os.path.dirname(os.path.abspath(__file__))
    out = sys.argv[1] if len(sys.argv) > 1 else "none"
    for p in yig(here, out):
        print(p["sem"], p["fayl"])
