# Toshkent tuman 1-son texnikumi e-bazasi — texnikum1son.uz

Statik sayt (GitHub Pages) + Firebase (login, Firestore) + Google Drive (asl fayllar) + Gemini (AI tahlil).


## Versiyalar (13.11.2026)

- **2-versiya (hozirgi, ildizda):** faqat fanlar. Kasbiy fanlar — har mutaxassislik bo‘yicha alohida; umumta’lim fanlari — hammasi uchun bitta sahifa (`yonalish/umumtalim/fan/<fan>/`, Firestore'da `yonalish = "umumtalim"`). Guruh raqamlari ko‘rsatilmaydi.
  Kuvi AI (`assets/t1-kuvi.js`): «Maslahatchi» (o‘qituvchilar) va «Javob beruvchi» (o‘quvchilar) rejimlari, Gemini orqali.
  O‘UM yig‘uvchi (`assets/rtr.js`, `assets/fan.js`): bo‘limlar va modul/mavzular tanlanadi → bitta Word hujjat, chop etish/PDF yoki ZIP (bo‘limlar yoki mavzular bo‘yicha alohida fayllar).
  Kabinet: avtomatik ro‘yxat (holat darhol «tasdiqlangan», admin bloklashi mumkin), Google bilan kirish, parolni emailga tiklash.
- **1-versiya (eski):** `/eski/` papkasida muzlatilgan nusxa (noindex); manbasi `_manba/eski/build_v1.py`, git tegi `v1-eski`, `eski-versiya` tarmog‘i.
  Eski manzillar (`/yonalish/<id>/`, `/guruh/<g>/`, `/haqida/`, `/joylashuv/`…) yangi katalogga yoki `/eski/` ga yo‘naltiriladi.


## Kuvi agent — katta majmualarni avtomatik bo'laklash (13.11.2026)

1. O'qituvchi kabinetda **«Katta majmua — Kuvi AI agent»** bo'limiga fayl tashlaydi (Word, PDF, PowerPoint, ZIP; 400 MB gacha).
   Fayl 8 MB lik bo'laklarda Apps Script orqali Google Drive'ga yuklanadi (`boshla` / `bolak`), so'ng Firestore `t1_navbat` ga yoziladi.
2. GitHub Actions (`.github/workflows/kuvi-agent.yml`, har 10 daqiqada) `_manba/agent/ishla.py` ni ishga tushiradi:
   Drive'dan yuklab oladi → LibreOffice bilan PDF → `qpdf --linearize` → mundarija va bet sarlavhalari bo'yicha qismlar
   (Gemini — `GEMINI_API_KEY` Secrets'da bo'lsa; bo'lmasa GitHub Models; bo'lmasa qoidalar) → natijani commit qiladi:
   `fayl/<id>.pdf`, `agent/m/<id>.json` (qismlar), `agent/k/<id>.json` (Kuvi uchun matn), `agent/index.json`, `agent/holat.json`.
3. Fan sahifasi (`assets/fan.js` + `assets/korinish.js`): qismlar o'z bo'limlarida; PDF.js betlarni faqat kerak bo'lganda (HTTP Range) yuklaydi.
   O'UM bo'limida to'liq majmua va qismlardan bitta PDF yoki ZIP (pdf-lib). Kuvi AI (`assets/t1-kuvi.js`) majmua matnidan
   mos parchalarni topib javob beradi, «N-bet» havolasi ko'ruvchida o'sha betni ochadi.
4. Navbatdan o'chirilgan majmuani agent fayl/ va agent/ dan ham o'chiradi. `fayl/` umumiy chegarasi ~850 MB (GitHub Pages 1 GB).

Muhim: saytni qayta yig'ishda (`build.py`) `agent/`, `fayl/`, `eski/`, `materiallar/`, `oyin/` papkalariga tegilmaydi; push qilishdan oldin
`git pull --rebase` (agent ham commit qiladi). Qo'lda sinov: Actions → «Kuvi agent» → Run workflow → `sinov_url`.

## Sinf o'yinlari — kuvonch.uz bilan avtomatik sinxron (14.11.2026)

Jonli viktorina, arqon tortish, jamoaviy o'yin va «Sinf o'yinlari» markazi `oyin/` papkasida — shu saytning o'zida, e-baza sarlavhasi
va texnikum logotipi bilan ochiladi. Manba: `quvonchbek99/quvnoqdombogchalar` (kuvonch.uz). `_manba/kuvonch/sinxron.py` kirish
sahifalaridan boshlab kerakli JS/CSS/rasm/ovoz fayllarini o'zi topib ko'chiradi; ko'chirilmagan sahifalarga havolalar kuvonch.uz ga boradi.
`.github/workflows/kuvonch-oyinlar.yml` har ~3 soatda (va qo'lda «Run workflow») ishga tushadi va faqat o'zgarish bo'lsa commit qiladi.
`oyin/` ni qo'lda tahrirlamang — keyingi sinxronda qayta yoziladi; o'zgartirishni kuvonch.uz'da qiling.

## Tuzilma
| Joy | Nima |
| --- | --- |
| `index.html`, `yonalish/…`, `guruhlar/`, `haqida/`, `joylashuv/`, `qidiruv/` | Generator yasagan sahifalar (qo‘lda tahrirlamang) |
| `kabinet/` | O‘qituvchi kabineti: login/parol, ZIP/Word/PDF/PPTX/XLSX/RTR yuklash, AI tahlil, joylash |
| `admin/` | Admin: o‘qituvchilarni tasdiqlash, Drive manzili, materiallarni yashirish/o‘chirish |
| `materiallar/zamonaviy-tikuv-jihozlari/` | «Zamonaviy tikuv jihozlari» (UKM.4) interaktiv RTR paketi |
| `data/` | `malumot.json` (yo‘nalish/fan/soat), `qidiruv.json`, `rtr/*.json` (tayyor fan materiallari) |
| `_manba/` | Generator (`build.py`), asl JS/CSS, kasb-emis ma’lumoti, sozlash fayllari, agent uchun buyruq |

## Qayta yig‘ish
```
python3 _manba/build.py _manba/texnikum1-malumot.json data/rtr .
```
Yangi tayyor fan materiali (RTR JSON) qo‘shish: faylni `data/rtr/<fan-id>.json` ga qo‘ying va `_manba/build.py` dagi `STATIK` ro‘yxatiga yozing.

## Bir martalik sozlash
1. **Domen DNS** (texnikum1son.uz): `@` uchun A yozuvlar — 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; `www` uchun CNAME — `quvonchbek99.github.io`.
2. **Firestore qoidalari**: `_manba/sozlash/firestore-qoidalar-qoshimcha.rules` blokini Firebase konsoli → Firestore → Rules ga qo‘shing va «Publish».
3. **Google Drive**: `_manba/sozlash/drive-yuklash.gs` ni Apps Script’da veb-ilova qilib joylang, URL’ni Admin panel → «Fayllar ombori» ga kiriting.
4. **Firebase**: Authentication → Settings → Authorized domains ga `texnikum1son.uz`; AI uchun reCAPTCHA kalitining domenlariga `texnikum1son.uz` qo‘shing.
