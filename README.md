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
5. Qo'lda joylangan majmualar (navbatsiz): xuddi shu formatda `fayl/`, `agent/m/`, `agent/k/` ga yoziladi, lekin `agent/holat.json` ga
   yozilmaydi — agent faqat `holat.json` dagilarni tozalaydi, shuning uchun bularga tegmaydi. O'chirish: uchala faylni olib tashlab,
   `agent/index.json` dan yozuvini o'chirish. Namuna: `multimedia-animatsiya-2026` (Grafik va dizayn texnologiyasi → Multimedia va
   animatsiya texnologiyalari, Mahmudova Sh.R., 192 bet, 83 qism; 19.11.2026).
   Bir PDF bir necha semestrga bo'linishi mumkin: `ingliz-tili-1kurs-1sem` (1–90-darslar) va `ingliz-tili-1kurs-2sem` (91–150-darslar)
   ikkalasi `fayl/ingliz-tili-1kurs.pdf` ga ishora qiladi (Chet tili, umumta'lim; muqova — Toshkent tuman 1-son texnikumi, 5 bet;
   asl bet raqamlari +5 ga almashtirilgan; o'qituvchi nomi ataylab bo'sh — sahifada o'qituvchi qismi chiqmaydi).
6. Bosh sahifa `agent/index.json` dagi fanlarni ham «material bor» deb belgilaydi (`fanlar.js`); `build.py` qayta yig'ishda agent
   majmualarining ma'ruza/amaliy mavzularini qidiruvga (`data/qidiruv.json`, havola `?sem=` bilan) qo'shadi.

Muhim: saytni qayta yig'ishda (`build.py`) `agent/`, `fayl/`, `eski/`, `materiallar/`, `oyin/` papkalariga tegilmaydi; push qilishdan oldin
`git pull --rebase` (agent ham commit qiladi). Qo'lda sinov: Actions → «Kuvi agent» → Run workflow → `sinov_url`.

## Sinf o'yinlari — kuvonch.uz bilan avtomatik sinxron (14.11.2026)

Jonli viktorina, arqon tortish, jamoaviy o'yin va «Sinf o'yinlari» markazi `oyin/` papkasida — shu saytning o'zida, e-baza sarlavhasi
va texnikum logotipi bilan ochiladi. Manba: `quvonchbek99/quvnoqdombogchalar` (kuvonch.uz). `_manba/kuvonch/sinxron.py` kirish
sahifalaridan boshlab kerakli JS/CSS/rasm/ovoz fayllarini o'zi topib ko'chiradi; ko'chirilmagan sahifalarga havolalar kuvonch.uz ga boradi.
`.github/workflows/kuvonch-oyinlar.yml` har ~3 soatda (va qo'lda «Run workflow») ishga tushadi va faqat o'zgarish bo'lsa commit qiladi.
`oyin/` ni qo'lda tahrirlamang — keyingi sinxronda qayta yoziladi; o'zgartirishni kuvonch.uz'da qiling.

## Yo‘l harakati qoidalari 2026 va viktorina (19.11.2026)

`yhq/` — «Yo‘l harakati qoidalari 2026» veb-ilovasi: o‘zbekcha (lotin/kirill), qoidalar, yo‘l belgilari va chiziqlar (vektor rasmlar),
jarimalar (MJtK, BHM), test. Manba: lex.uz — VM 172-son qarori (30.10.2026 tahriri) va MJtK. `yhq/viktorina.html` — Kahoot uslubidagi
viktorina: jonli (xona kodi + QR, o‘quvchilar telefondan; `yhq/js/net/ka-tarmoq.js` — MQTT reley), jamoaviy (bitta ekranda 2–4 jamoa)
va yakka o‘yin; savollar `yhq/js/vq-bank.js` da har safar yangidan tuziladi. `yhq/yuklab/YHQ-2026.apk` — internetsiz Android ilova.
`build.py` bu papkaga tegmaydi (faqat menyu, bosh sahifa, «Sinf o‘yinlari», qidiruv va sitemap’da havolalar bor). Yangilash: ilova
manbasidagi `www/` ni `yhq/` ga ko‘chirish; `index.html` va `viktorina.html` dagi `window.YHQ_WEB=1` va SEO teglari saqlansin.

## Virtual laboratoriyalar (15.11.2026)

Har bir fan uchun virtual xona: `/lab/<id>/`, katalog — `/lab/`. Fan sahifasida «Virtual laboratoriya» tugmasi chiqadi.
- **Xona va jihozlar** — stollardagi jihozni bosish → pasport (vazifasi, tuzilishi, ishlatish tartibi, xavfsizlik, haqiqiy rasmlarga havola). Pastda chop etiladigan «Jihozlar pasporti».
- **Slaydlar** — jihozlar pasportidan avtomatik tuziladi; proyektor/to‘liq ekran, ← → tugmalari, oq-qora chop etish.
- **Virtual ishlatish** — simulyatorlar (`assets/lab-sim*.js`): umumiy turlar — `tartib`, `moslash`, `tanlash`, `qurilma` (qurilmani tugmalar bilan ishlatish), `kalkulyator`, `sxema`;
  maxsus — `zanjir`, `multimetr`, `osiloskop`, `transformator`, `dvigatel`, `payvand`, `chozish`, `mayatnik`, `ph`, `grafik`, `mantiq`, `tarmoq`, `kod`, `parol`, `piksel`,
  `animatsiya`, `proyeksiya`, `rang`, `yurak`, `svetofor`, `til`, `kompas`, `chok`, `retsept`, `qolip`, `mato`, `taymer`.
- **Sinov** — jihozlar pasportidan avtomatik savollar + lab JSON’dagi `test`. **Xavfsizlik** — umumiy va jihozlar bo‘yicha qoidalar (chop etiladi).
- Natijalar (tanishildi / bajarildi / sinov %) foydalanuvchi brauzerida (`localStorage`) saqlanadi.

Manba: `_manba/lab/<id>.json` (bitta fayl — bitta laboratoriya). Asosiy maydonlar: `id`, `nomi`, `e` (emoji), `xona` (fon: sinf, elektr, avto, ustaxona, oshxona, tikuv, salon, it, tibbiy, yongin, kimyo, fizika),
`fanlar` (fan id lari — bir lab bir nechta fanga xizmat qilishi mumkin), `meros` (boshqa labdan jihoz va mashqlarni olish), `jihozlar[]`, `sim[]`, `xavfsizlik[]`, `test[]`.
Amaliyot fanlari uchun alohida lab bo‘lmasa, generator yo‘nalishning barcha kasbiy laboratoriyalaridan «amaliyot ustaxonasi» (`/lab/ustaxona-<yonalish>/`) yasaydi.
Yangi lab qo‘shish: JSON faylni `_manba/lab/` ga qo‘ying va saytni qayta yig‘ing (generator jihoz → mashq havolalarini tekshiradi).

## Tuzilma
| Joy | Nima |
| --- | --- |
| `index.html`, `yonalish/…`, `guruhlar/`, `haqida/`, `joylashuv/`, `qidiruv/` | Generator yasagan sahifalar (qo‘lda tahrirlamang) |
| `kabinet/` | O‘qituvchi kabineti: login/parol, ZIP/Word/PDF/PPTX/XLSX/RTR yuklash, AI tahlil, joylash |
| `admin/` | Admin: o‘qituvchilarni tasdiqlash, Drive manzili, materiallarni yashirish/o‘chirish |
| `materiallar/zamonaviy-tikuv-jihozlari/` | «Zamonaviy tikuv jihozlari» (UKM.4) interaktiv RTR paketi |
| `data/` | `malumot.json` (yo‘nalish/fan/soat), `qidiruv.json`, `rtr/*.json` (tayyor fan materiallari) |
| `lab/` | Virtual laboratoriyalar (generator yasaydi; manba — `_manba/lab/*.json`) |
| `_manba/` | Generator (`build.py`), asl JS/CSS, kasb-emis ma’lumoti, laboratoriyalar (`lab/`), sozlash fayllari, agent uchun buyruq |

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

## Kasblar xaritasi (17.11.2026)

`/kasblar/` — dunyo va O‘zbekiston bo‘yicha interaktiv xarita (`assets/kasb-xarita.js`, ma’lumot `assets/kasb-xarita.json`, d3 + topojson sayt ichida).
- Dunyo: ILOSTAT SDMX — `DF_EAR_EMTA_SEX_OCU_CUR_NB` (kasb guruhlari bo‘yicha o‘rtacha oylik maosh, USD) va `DF_EMP_TEMP_SEX_OC2_NB` (ISCO-08 2-daraja bo‘yicha bandlik);
  manzil: `https://sdmx.ilo.org/rest/data/ILO,DF_<id>,1.0/all?startPeriod=2018` (CSV). Har davlat uchun eng so‘nggi yil olinadi.
- O‘zbekiston: Milliy statistika qo‘mitasining 2026-yil yanvar–sentabr press-relizi (hududlar va sohalar bo‘yicha o‘rtacha ish haqi); chegaralar — geoBoundaries UZB ADM1.
- Yangilash: ikkala CSV ni qayta yuklab, `kasb-xarita.json` ni qayta yig‘ish; hududlar raqamlari faylning `uz` qismida qo‘lda yangilanadi.
