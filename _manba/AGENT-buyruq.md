# AGENT UCHUN BUYRUQ: «Toshkent tuman 1-son texnikumi e-bazasi» sayti — texnikum1son.uz

> Bu faylni boshidan oxirigacha o'qi, keyin 9-bo'limdagi bosqichlar bo'yicha ishla.
> Ma'lumot manbasi: shu fayldagi 12-bo'lim jadvallari va yonidagi `texnikum1-malumot.json` fayli. Ikkalasida bir xil ma'lumot bor; kod yozganda JSON'dan foydalan.
> Tuzilgan sana: 10.11.2026. Fan va soatlar kasb-emis.edu.uz'dan 05.11.2026 holatida olingan.

> **YANGILANISH (12.11.2026) — avval shuni o'qi.** Sayt skeleti TAYYOR va ishlayapti: repo `quvonchbek99/texnikum1son`, domen **texnikum1son.uz**.
> - Barcha 14 yo'nalish, 20 guruh va 232 fan sahifasi, fasllarga moslashuvchi bosh sahifa, «Texnikum haqida», «Joylashuv» va qidiruv tayyor.
> - O'qituvchi kabineti (login/parol + AI bilan hujjat yuklash) va admin panel bor; asl fayllar Google Drive'ga, matn Firestore'ga yoziladi.
> - «Zamonaviy tikuv jihozlari» (08-26) to'liq material sifatida qo'shilgan — format namunasi: `data/rtr/zamonaviy-tikuv-jihozlari.json` (RTR formati).
> - Generator: `_manba/build.py` (README.md ga qara). Sahifalarni qo'lda tahrirlama — generatorni o'zgartirib, qayta yig'.
>
> Shuning uchun 2-bo'lim (joylashuv) va 9-bo'limdagi 1-bosqich (skelet) BAJARILGAN. Sening asosiy vazifang — **mazmun**: har bir fan uchun RTR formatidagi JSON (mavzular, ma'ruza matni, maqsad/metodlar/keys, testlar, glossariy, mustaqil ishlar) tayyorlab `data/rtr/<fan-id>.json` ga qo'yish va `_manba/build.py` dagi `STATIK` ro'yxatiga qo'shish. Renderer (`assets/rtr.js`) TMR, texnologik xarita, ma'ruza, nazorat va O'UMni shu JSON'dan avtomatik chiqaradi.

---

## 0. Vazifa qisqacha

Toshkent tuman 1-son texnikumining barcha yo'nalishlari va barcha fanlari uchun alohida o'quv-uslubiy elektron baza sayti yarat. Sayt nomi «Toshkent tuman 1-son texnikumi e-bazasi», domeni **texnikum1son.uz**. Sayt Kuvonch Academy (**kuvonch.uz**) loyihasining bir qismi bo'ladi.

Saytda nima bo'lishi kerak:

1. Har bir yo'nalishning alohida sahifasi bo'ladi (14 ta yo'nalish, 20 ta guruh).
2. Har bir yo'nalish ichida fanlar uch blokka **alohida** ajratiladi: **kasbiy (spes) fanlar**, **amaliyot** va **umumta'lim fanlari**.
3. Har bir fanga quyidagi to'rt material tayyorlanadi:
   - **TMR** (taqvim-mavzu reja);
   - har bir dars uchun **texnologik xarita**;
   - har bir nazariy dars uchun **ma'ruza matni** (amaliy darslar uchun amaliy mashg'ulot ishlanmasi);
   - fanning umumiy **o'quv-uslubiy majmuasi (O'UM)**.

Butun ishni sen bajarasan: sayt kodi, mazmun, joylashtirish va tekshiruv.

---

## 1. Kontekst

- **Buyurtmachi:** Mashrapov Q. U shu texnikumda matematika va ingliz tili o'qituvchisi. Muloqot o'zbek tilida (lotin yozuvida) olib boriladi.
- **Rasmiy nom:** hujjatlarda doim «Toshkent tuman 1-son texnikumi» deb yoziladi. «Kasb-hunar maktabi» deb yozilmaydi.
- **GitHub akkaunti:** `quvonchbek99`.
  - kuvonch.uz sayti `quvonchbek99/quvnoqdombogchalar` reposida, GitHub Pages'da turadi.
  - kuvonch.uz domeni sotib olingan, DNS'i Uzcloud'da.
- **Ma'lumot manbasi:** kasb-emis.edu.uz (Kasbiy ta'lim axborot tizimi). U yerdan uzoq muddatli guruhlar, o'quv rejalar va tarifikatsiya (O'quv reja, 15.10.2026) olingan.
- **Chop etish:** buyurtmachi materiallarni oq-qora printerda chop etadi. Chop etiladigan hamma narsa faqat qora matn va chiziqdan iborat bo'lsin, rangli fon bo'lmasin.
- **Limit:** buyurtmachining token/limiti kam. Shuning uchun:
  - ishni kichik bo'laklarda qil;
  - har bo'lakdan keyin saqla (commit qil);
  - holatni `progress.json` fayliga yoz, keyingi safar shu yerdan davom ettir.

---

## 2. Joylashuv (hosting) — standart yechim

Standart yechim — alohida repo `quvonchbek99/texnikum1son` va GitHub Pages.

- **Domen ulanguncha:** sayt vaqtincha `https://quvonchbek99.github.io/texnikum1son/` manzilida ishlaydi.
- **Domen ulangach:**
  - repo ildiziga `CNAME` faylini qo'y, ichiga `texnikum1son.uz` deb yoz;
  - GitHub Pages sozlamasida «Enforce HTTPS»ni yoq.
- **kuvonch.uz bilan bog'lash:**
  - kuvonch.uz bosh menyusiga «Texnikum» havolasini qo'sh, u texnikum1son.uz'ga olib borsin;
  - texnikum1son.uz sarlavhasida yoki futerida «Kuvonch Academy · kuvonch.uz» havolasi tursin.
- **Nega alohida repo kerak:**
  - kuvonch.uz reposi allaqachon katta (buyurtmachi videolarni joy bo'shatish uchun Google Drive'ga ko'chirgan);
  - alohida domen uchun alohida Pages repo kerak.
- **Agar buyurtmachi «kuvonch.uz ichida bo'lsin» desa:** xuddi shu tuzilmani kuvonch.uz reposidagi `texnikum1/` papkasiga qo'y (manzil `kuvonch.uz/texnikum1/` bo'ladi). Boshqa talablar o'zgarmaydi.
- **Domen sotib olish:** sen domen sotib olmaysan. Buyurtmachiga quyidagilarni yozib ber:
  1. texnikum1son.uz bo'shligini tekshirib, .uz registratoridan sotib olsin (kuvonch.uz domeni Uzcloud'da).
  2. DNS'da ildiz (@) uchun to'rtta A yozuv qo'shsin: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
  3. `www` uchun CNAME yozuv qo'shsin: `quvonchbek99.github.io`.

---

## 3. Sayt tuzilishi

| Sahifa | Manzil | Nimalar bo'ladi |
| --- | --- | --- |
| Bosh sahifa | `/` | Texnikum nomi va qidiruv. Yo'nalish kartochkalari: «2-kurs (2025-yil qabuli)» va «1-kurs (2026-yil qabuli)» bo'yicha guruhlangan. «Guruhingizni tanlang» tugmalari (01-25 … 10-26): har biri o'z yo'nalishiga olib boradi. |
| Yo'nalish | `/yonalish/<yonalish_id>/` | Mutaxassislik nomi, kodi, ta'lim yo'nalishi, o'quv reja raqami, ta'lim shakli, guruhlar. Semestr tablari. Har semestr ichida uchta **alohida** blok: **Kasbiy (spes) fanlar** → **Amaliyot** → **Umumta'lim fanlari**. Har fan qatorida: nomi, jami soat, darslar soni, tayyorlik holati (TMR / xarita / ma'ruza / O'UM belgilari). Kiritilmagan semestrlar uchun: «O'quv rejada hali kiritilmagan». |
| Fan | `/yonalish/<yonalish_id>/fan/<fan_id>/?sem=N` | Tablar: **TMR** · **Texnologik xaritalar** · **Ma'ruzalar** · **Amaliy mashg'ulotlar** · **Mustaqil ish** · **Nazorat** · **O'UM (majmua)**. |
| Dars | `/yonalish/<yonalish_id>/fan/<fan_id>/dars/<n>/?sem=N` | Shu darsning texnologik xaritasi, ma'ruza matni (yoki amaliy ishlanma), nazorat savollari. Oldingi va keyingi darsga o'tish tugmalari. |
| Guruh | `/guruh/<guruh>/` | Tegishli yo'nalish sahifasiga yo'naltiradi. |
| Qidiruv | `/qidiruv/` | Fan, mavzu, yo'nalish va guruh bo'yicha qidiradi. |
| Haqida | `/haqida/` | Loyiha haqida ma'lumot, ma'lumot manbasi va sanasi, kuvonch.uz havolasi. |

**Hamma material sahifalarida (TMR, xarita, ma'ruza, O'UM):**

- «Chop etish» tugmasi bo'ladi.
- «Word (.docx) yuklab olish» tugmasi bo'ladi.

---

## 4. Materiallar shakli

### 4.1 TMR — taqvim-mavzu reja

TMR har bir **(yo'nalish, fan, semestr)** uchun alohida tuziladi.

**Sarlavha qismi:**

- O'ng yuqorida: «TASDIQLAYMAN. O'quv ishlari bo'yicha direktor o'rinbosari ________ «___» ________ 2026-y.»
- Pastroqda: «Metodik birlashma majlisida ko'rib chiqildi. Bayonnoma № ___, «___» ________ 2026-y.»
- Keyin quyidagi ma'lumotlar:
  - Toshkent tuman 1-son texnikumi;
  - fan nomi;
  - mutaxassislik va kodi;
  - guruh(lar);
  - kurs va semestr;
  - o'quv yili 2026–2027;
  - soatlar: jami / auditoriya (nazariy, amaliy, laboratoriya) / mustaqil ish;
  - «O'qituvchi: ________».

**Jadval ustunlari:**

№ | Mavzu (dars) nomi | Dars turi | Soat | Reja sanasi | O'tilgan sana | Jihoz va ko'rgazmali qurollar | Mustaqil ish topshirig'i | Adabiyot | Izoh

**Dars turi belgilari:**

- N — nazariy;
- A — amaliy;
- L — laboratoriya;
- ON — oraliq nazorat;
- YN — yakuniy nazorat.

**Qoidalar:**

1. 1 dars = 1 juftlik = 2 akademik soat (80 daqiqa). Darslar soni = auditoriya soati ÷ 2.
2. Har 10-dars oraliq nazorat (ON), semestrning oxirgi darsi yakuniy nazorat (YN). Buyurtmachi amalda shunday ishlaydi.
3. TMR'dagi soatlar yig'indisi o'quv rejadagi auditoriya soatiga **aniq teng** bo'lishi shart. Buni avtomatik tekshiruv bilan nazorat qil. Mos kelmasa, sahifani chiqarma.
4. Mavzular oddiydan murakkabga qarab joylashtiriladi. Har mavzu nomi qisqa (bir qator) bo'lsin, shunda uni kasb-emis'dagi taqvim-mavzu rejaga ko'chirish mumkin bo'ladi.
5. TMR sahifasida «kasb-emis uchun nusxa» tugmasi bo'lsin. U `№ ; mavzu ; soat ; tur` shaklidagi oddiy ro'yxatni beradi va CSV yuklab olish imkonini beradi.
6. Sana ustunlari bo'sh qoladi. Qo'shimcha funksiya: guruhning haftalik dars kunlari va dam olish kunlari kiritilsa, reja sanalari avtomatik to'ladi (dam olish kunlari ro'yxatini sozlash mumkin bo'lsin).

### 4.2 Texnologik xarita (har bir dars uchun)

**Xarita bo'limlari:**

- **Umumiy ma'lumot:** mavzu, fan, mutaxassislik, guruh, dars raqami, vaqti (80 daqiqa).
- **Darsning maqsadi:** ta'limiy, tarbiyaviy va rivojlantiruvchi maqsad.
- **Kutilayotgan o'quv natijalari:** 3–5 band, masalan «o'quvchi … ni biladi / … ni bajara oladi».
- **Dars turi, shakli, metodlari:** masalan, aqliy hujum, klaster, «Insert», kichik guruhlarda ishlash, keys-stadi.
- **Jihozlar va didaktik materiallar.**
- **Fanlararo bog'liqlik** va **kasbga yo'naltirish:** fan shu mutaxassislik ishiga qanday bog'lanishi.

**Dars bosqichlari jadvali:**

Ustunlar: Bosqich | Vaqt (daqiqa) | O'qituvchi faoliyati | O'quvchi faoliyati | Natija / baholash

Standart taqsimot (jami 80 daqiqa — avtomatik tekshir):

| Bosqich | Vaqt |
| --- | --- |
| Tashkiliy qism | 5 daqiqa |
| O'tilgan mavzuni takrorlash | 10 daqiqa |
| Yangi mavzu bayoni (yoki amaliy ish yo'riqnomasi) | 30 daqiqa |
| Mustahkamlash | 20 daqiqa |
| Baholash va xulosa | 10 daqiqa |
| Uyga vazifa | 5 daqiqa |

**Oxirida:** baholash mezonlari (5 ballik tizim) va uyga vazifa.

**ON va YN darslari uchun alohida shablon:** nazorat shakli, 2 ta variant, baholash mezoni.

### 4.3 Ma'ruza matni (har bir nazariy dars uchun)

**Ma'ruza bo'limlari:**

- Mavzu; reja (3–5 band); tayanch so'z va iboralar.
- **Asosiy matn:** 1200–2500 so'z, sodda va aniq tilda. Formula, jadval va sxemalar bo'lsin (sxemalar SVG ko'rinishida). Hayotiy va kasbiy misollar keltirilsin.
- Xulosa.
- Nazorat savollari (5–8 ta).
- Test: 5 ta savol. Javob kaliti alohida, yashiriladigan blokda tursin.
- Adabiyotlar va elektron resurslar. Faqat haqiqatan mavjud manbalarni yoz. Ishonching komil bo'lmasa, «manba tekshirilsin» deb belgila.

**Amaliy va laboratoriya darslari uchun** ma'ruza o'rniga «Amaliy mashg'ulot ishlanmasi» tuziladi:

- maqsad;
- jihozlar;
- xavfsizlik texnikasi;
- ishni bajarish tartibi (bosqichma-bosqich);
- topshiriqlar (kamida 2 variant);
- hisobot shakli;
- baholash.

### 4.4 O'UM — o'quv-uslubiy majmua

O'UM har bir **(yo'nalish, fan)** uchun bitta yaxlit hujjat bo'ladi. Bo'limlari ketma-ket:

1. **Titul varag'i:** texnikum, fan, mutaxassislik va kodi, «Tuzuvchi: ________», «Ko'rib chiqildi» va «Tasdiqlandi» joylari, 2026-yil.
2. **Annotatsiya:** fanning maqsadi va vazifalari, o'quv natijalari.
3. **Ishchi o'quv dasturi:** bo'limlar va soat taqsimoti.
4. **TMR** (4.1-bo'lim).
5. **Ma'ruza matnlari** to'plami (4.3-bo'lim).
6. **Amaliy va laboratoriya ishlanmalari.**
7. **Mustaqil ish topshiriqlari:** mavzular, topshirish shakli, baholash.
8. **Glossariy:** o'zbekcha — ruscha — inglizcha atamalar.
9. **Nazorat materiallari:**
   - har bir ON uchun 2 variant;
   - yakuniy nazorat uchun savollar va 30 ta test (javob kaliti alohida).
10. **Baholash mezonlari** (5 ballik tizim).
11. **Adabiyotlar va elektron resurslar.**
12. **Ilovalar** (tarqatma materiallar).

Butun majmuani bitta tugma bilan chop etish va .docx qilib yuklab olish mumkin bo'lsin.

**Amaliyot fanlari uchun** (Ishlab chiqarish amaliyoti, Kvalifikatsion amaliyot) ma'ruza bo'lmaydi. O'rniga quyidagilar tuziladi:

- amaliyot dasturi;
- amaliyot kundaligi shakli;
- hisobot shakli;
- baholash varaqasi;
- xavfsizlik texnikasi yo'riqnomasi;
- korxona rahbari tavsifnomasi shakli.

O'quv amaliyoti fanlari (nomida «(o'quv amaliyoti)» bor, yoki «Kompyuter grafikasi va dizayn», «Manikyur va pedikyur ishlari») amaliy mashg'ulot ishlanmalari asosida tuziladi.

---

## 5. Mazmun qoidalari

- **Til va imlo:**
  - o'zbek adabiy tili, lotin yozuvi, 15–18 yoshli o'quvchilarga mos;
  - ekranda `oʻ` va `gʻ` (ʻ — U+02BB), tutuq belgisi `ʼ` (U+02BC) ishlatiladi;
  - qidiruv barcha apostrof turlarini (`' ‘ ’ ʻ ʼ` va orqa tirnoq) bir xil deb hisoblasin.
- **Fan nomlari:**
  - JSON'da `nomi` maydoni saytda ko'rsatiladigan to'g'rilangan nom;
  - `nomi_kasb_emis` maydoni kasb-emis'dagi asl yozuv (imlo xatolari bilan, masalan «Avtomobil tuzulishi», «texnalogiyasi»). Kasb-emis'ga ko'chiriladigan narsalarda asl yozuvni ishlat.
- **Rasmiy dasturga moslik:**
  - mavzular davlat ta'lim standarti va namunaviy fan dasturiga mos bo'lsin;
  - buyurtmachida namunaviy dastur bo'lsa, faqat undan foydalan;
  - internetdan rasmiy manba topsang (vazirlik, Kasbiy ta'limni rivojlantirish instituti, lex.uz), havolasini fanning `manbalar` ro'yxatiga yoz;
  - topa olmasang, mavzularni kasbiy bilim asosida tuz va fan sahifasiga «Namunaviy dastur bilan solishtirilmagan» belgisini qo'y.
- **Original matn va aniqlik:**
  - matnlar o'zing yozgan original matn bo'lsin; darsliklardan so'zma-so'z ko'chirma, rasm va skanerlarni qo'yma;
  - fakt, formula, GOST yoki standart raqami, me'yor va o'lchamlarni o'ylab topma; ishonching komil bo'lmasa, «tekshirilsin» deb belgila.
- **Umumta'lim fanlari** (matematika, fizika, ona tili, tarix, chet tili, informatika va boshqalar):
  - asosiy mazmun hamma yo'nalishlar uchun bir xil bo'ladi;
  - lekin har yo'nalishda kasbga yo'naltirilgan misollar bo'lsin (masalan, oshpazlar uchun matematikada retsept nisbatlari, avtoservis uchun fizikada dvigatel quvvati va bosim, tikuvchilar uchun geometriyada bichim o'lchamlari);
  - soatlar yo'nalishga qarab farq qiladi, shuning uchun TMR har yo'nalish uchun alohida tuziladi.
- **Bir nechta yo'nalishda bor fanlar** (masalan, «Mehnat muhofazasi va xavfsizlik texnikasi», «Elektrotexnika va elektronika asoslari», «Axborot texnologiyalari asoslari», «Biznes asoslari»):
  - mazmunni bir marta yoz va qayta ishlat;
  - faqat soatlar, TMR va kasbiy misollarni har yo'nalishga moslashtir.
- **Matematika sahifalari:** kuvonch.uz'dagi mos test va mashqlarga havola qo'y (agar mavjud bo'lsa).

---

## 6. Soatlar

- Jadvallardagi soat kasb-emis'dagi **«Jami soat»** bo'ladi, ya'ni auditoriya soati + mustaqil ish soati.
- **Soat 27 ga karrali bo'lsa** (amaliyotdan tashqari), quyidagicha hisobla:
  - auditoriya = jami × 20/27;
  - mustaqil ish = jami × 7/27;
  - misollar: 27 → 20+7, 54 → 40+14, 81 → 60+21, 108 → 80+28, 135 → 100+35, 162 → 120+42, 189 → 140+49, 216 → 160+56, 243 → 180+63;
  - bu qoida 01-26 (Zargarlik) o'quv rejasidagi nazariy, amaliy va mustaqil ish raqamlari bilan tekshirilgan;
  - JSON'da bu natija `auditoriya_soat_taxminiy` maydonida turadi.
- **Boshqa qiymatlar va amaliyot soatlari** (JSON'da `null`). Bular: 2, 4, 6, 11, 30, 41, 68, 94, 95, 122, 130, 151, 203, 230, 283 hamda Ishlab chiqarish va Kvalifikatsion amaliyot soatlari.
  - Ularning nazariy / amaliy / laboratoriya / mustaqil ish taqsimotini kasb-emis'dagi o'quv reja sahifasidan ol. Manzil: `https://kasb-emis.edu.uz/admin/long-term/study-plans/<kasb_emis_id>`. Bu buyurtmachi brauzerida tizimga kirgan bo'lsa ishlaydi.
  - Imkon bo'lmasa, buyurtmachidan so'ra. O'zing taqsimlama.
- **kasb-emis'da HECH NARSANI o'zgartirma:** saqlama, yuborma, o'chirma. Faqat o'qish mumkin.

---

## 7. Texnik talablar

- **Sayt turi:** statik sayt (HTML, CSS, JS), serversiz, GitHub Pages'da. Generator oddiy bo'lsin (masalan, bitta Node skripti): `data/` va `content/` papkalaridan tayyor statik sahifalar yasasin. Login va server kerak emas.
- **Repo tuzilmasi (tavsiya):**
  ```
  data/texnikum1-malumot.json          ← shu buyruq bilan berilgan fayl (o'zgartirmasdan)
  content/fanlar/<fan_id>/umumiy.md    ← annotatsiya, glossariy, adabiyot (fan uchun umumiy)
  content/fanlar/<fan_id>/darslar/<n>.md          ← ma'ruza / amaliy ishlanma (umumiy mazmun)
  content/tmr/<yonalish_id>/<fan_id>-sem<N>.json  ← har dars: mavzu, tur, soat, dars_fayli, kasbiy_misol
  content/xarita/<yonalish_id>/<fan_id>-sem<N>/<n>.json
  progress.json                         ← har (yonalish, fan, semestr): tmr/xarita/maruza/oum = yo'q|qisman|tayyor|tekshirilsin
  scripts/build.js, scripts/check.js
  ```
- **Avtomatik tekshiruv (`check.js`):** har build'dan oldin ishga tushadi va quyidagilarni tekshiradi:
  - TMR soatlari yig'indisi auditoriya soatiga tengmi;
  - texnologik xarita vaqti 80 daqiqaga tengmi;
  - har guruh to'g'ri yo'nalishga bog'langanmi;
  - buzilgan ichki havolalar bormi;
  - bo'sh sahifalar bormi.
- **Tezlik va qurilmalar:**
  - bitta sahifa 300 KB dan oshmasin;
  - rasmlar SVG yoki WebP formatida, lazy load bilan;
  - sayt 360 px telefondan katta ekrangacha to'g'ri ko'rinsin;
  - iOS, Android va Windows'dagi barcha asosiy brauzerlarda ishlasin.
- **Chop etish (`@media print`):**
  - A4 format;
  - faqat qora matn va qora chiziqlar, rangli fon yo'q;
  - menyu va tugmalar yashiriladi;
  - jadvallar sahifaga sig'adi;
  - sarlavha sahifa oxirida yolg'iz qolmaydi.
- **.docx yuklab olish:** brauzerning o'zida yasalsin (masalan, `docx` JS kutubxonasi orqali, CDN'dan aniq versiya bilan ulanadi). Bu TMR, xarita, ma'ruza va butun O'UM uchun kerak.
- **Qidiruv:** build paytida JSON indeks yasaladi, qidiruv brauzerda shu indeks bo'yicha ishlaydi.
- **SEO:** har sahifada `title` va `description` bo'lsin, `sitemap.xml` yasalsin. Analitika va reklamani buyurtmachi so'ramaguncha qo'yma.
- **Brend:**
  - sarlavhada «Toshkent tuman 1-son texnikumi — e-baza»;
  - futerda «Kuvonch Academy · kuvonch.uz» va «Ma'lumot manbasi: kasb-emis.edu.uz, 05.11.2026»;
  - texnikum logotipini buyurtmachidan so'ra; o'zing chizma va internetdan nusxa olma.

---

## 8. Ishni boshlashdan oldin buyurtmachidan so'raladigan savollar

Quyidagilarni **bitta xabarda** so'ra:

1. Joylashuv: alohida repo va texnikum1son.uz (standart variant) bo'lsinmi yoki kuvonch.uz/texnikum1/ bo'limi?
2. texnikum1son.uz domeni sotib olinganmi?
3. Texnikum logotipi va namunaviy fan dasturlari bormi? Bo'lsa, fayllarini yuborsin.
4. 03-26 guruhi qaysi yo'nalish? Buyurtmachining ba'zi hujjatlarida 03-26 «Grafik va dizayn texnologiyasi» deb yozilgan, kasb-emis'da esa «Kompyuter tarmoqlari va IT-servis».
5. 07-26 (Elektromontyor) va 08-26 (Moda va tikuv) ta'lim yo'nalishi qanday nomlanadi? Ular tarifikatsiyada ko'rsatilmagan.

Javob kelmasa, standart variant bilan boshla. Kasb-emis'dagi ma'lumotni to'g'ri deb ol va savollarni hisobotda qayta eslat.

---

## 9. Bosqichlar

Har bosqich oxirida quyidagilarni bajar:

- commit va push qil;
- `progress.json` faylini yangila;
- buyurtmachiga qisqa hisobot ber (10-bo'lim).

**1-bosqich. Skelet.**

- Bajariladigan ish: repo, generator, tekshiruv skripti; barcha 14 yo'nalish va 20 guruh sahifalari; fanlar ro'yxati uch blokda; bo'sh fan sahifalari «Tayyorlanmoqda» yozuvi bilan.
- Qabul sharti:
  - barcha soatlar JSON bilan mos;
  - har guruh tugmasi to'g'ri yo'nalishni ochadi;
  - sayt vaqtinchalik manzilda ochiladi.

**2-bosqich. Joriy semestr TMR'lari.**

- Joriy semestr: 2026-yil guruhlari uchun 1-semestr, 2025-yil guruhlari uchun 3-semestr.
- Tartib: avval **kasbiy (spes) fanlar**, keyin amaliyot, keyin umumta'lim fanlari.
- Qabul sharti: har TMR'da soatlar yig'indisi auditoriya soatiga teng; ON va YN joyida.

**3-bosqich. Namuna fan.**

- Bitta kasbiy fanni to'liq tayyorla: TMR, barcha texnologik xaritalar, ma'ruzalar, amaliy ishlanmalar va O'UM.
- Uni buyurtmachiga ko'rsat va tasdiqlashini kut.

**4-bosqich. Joriy semestrning qolgan fanlari.**

- Tasdiqlangan namuna asosida texnologik xaritalar va ma'ruza/amaliy ishlanmalarni tayyorla.
- Bir vaqtda bitta fan ustida ishla, avval kasbiy fanlar.

**5-bosqich. O'UM yig'ish.**

- Joriy semestr fanlari uchun O'UM'larni yig'.
- Chop etish va .docx yuklab olishni tekshir.

**6-bosqich. 2025-yil guruhlarining 1–2-semestr fanlari.**

- Xuddi shu tartibda tayyorla (arxiv va takrorlash uchun).

**7-bosqich. Kiritilmagan semestrlar.**

- Bular: 2025-yil guruhlarining 4-semestri, 2026-yil guruhlarining 2–4-semestrlari.
- Buyurtmachi o'quv rejani bergach yoki kasb-emis'da paydo bo'lgach qo'shasan.
- Fan va soatlarni o'ylab topma.

Limit tugasa, ishni to'xtat va `progress.json`'da qayerda qolganingni yoz. Keyingi safar shu yerdan davom et.

---

## 10. Hisobot shakli (har bosqichdan keyin, qisqa)

- **Nima qilindi** (raqamlar bilan): nechta sahifa, nechta TMR, nechta xarita va ma'ruza tayyor.
- Sayt havolasi.
- Nima qoldi.
- Buyurtmachi tekshirishi kerak bo'lgan joylar ro'yxati: «tekshirilsin» belgilari, namunaviy dastur bilan solishtirilmagan fanlar, javob kutilayotgan savollar.

---

## 11. Ma'lumot haqida eslatmalar

- 14 ta o'quv reja (yo'nalish), 20 ta guruh, 87 ta noyob fan, 232 ta «yo'nalish–fan» juftligi.
- Toifalash kasb-emis tarifikatsiyasidagi fan bloklari bo'yicha qilingan:
  - **Kasbiy (spes)** — umumkasbiy, maxsus, mutaxassislik fanlari, maxsus kurs, professional va tanlov modullari;
  - **Amaliyot** — o'quv, ishlab chiqarish va kvalifikatsion amaliyot;
  - **Umumta'lim** — umumiy ta'lim va tabiiy-gumanitar fanlar. Chet tili, rus tili, tarbiya va ChQBT (Chaqiruvga qadar boshlang'ich tayyorgarlik) ham shu toifada.
- 07-26 va 08-26 tarifikatsiyada yo'q, ular fanlarining nomiga qarab toifalandi.
- Soatlar kasb-emis'dagi **o'quv reja sahifalaridan** olingan va tarifikatsiya bilan solishtirilgan. Barcha soat va toifalar mos keldi, faqat ikki joyda farq bor. Ikkalasida ham o'quv reja ma'lumoti qoldirildi:
  - 05-25 va 06-25, 3-semestr: «Biznes asoslari» (81 soat) o'quv rejada bor, tarifikatsiyada yo'q;
  - 08-25 va 09-25, 3-semestr: «Kvalifikatsion amaliyot» (612 soat) o'quv rejada bor, tarifikatsiyada yo'q.
- Kasb-emis'dagi 25-01 «Transport logistikasi» guruhi bu loyihaga kirmaydi.
- **Kiritilgan semestrlar:**
  - 2025-yil guruhlari (01-25 – 10-25) uchun kasb-emis'da faqat 1–3-semestrlar bor;
  - 2026-yil guruhlari (01-26 – 10-26) uchun faqat 1-semestr bor.
- **Semestr sanalari:**
  - 2025-yil guruhlari: 1-semestr 03.09.2025–31.01.2026, 3-semestr 02.09.2026–30.01.2027;
  - 2026-yil guruhlari: 1-semestr 02.09.2026–30.01.2027.

---

## 12. Ma'lumotlar

### 12.1 Guruhlar

| Guruh | Yo'nalish (mutaxassislik) | yonalish_id | Kurs (2026–2027) | kasb-emis guruh ID |
| --- | --- | --- | --- | --- |
| 01-25 | Kompyuter grafikasi va dizayn operatori | `kompyuter-grafikasi-dizayn-operatori` | 2 | 35184 |
| 02-25 | Kompyuter grafikasi va dizayn operatori | `kompyuter-grafikasi-dizayn-operatori` | 2 | 35185 |
| 03-25 | Avtomobillarni ta'mirlash va ularga xizmat ko'rsatish (o'quv reja 0006) | `avto-tamirlash-or0006` | 2 | 35186 |
| 04-25 | Avtomobillarni ta'mirlash va ularga xizmat ko'rsatish (o'quv reja 0006) | `avto-tamirlash-or0006` | 2 | 35187 |
| 05-25 | Avtomobillarni ta'mirlash va ularga xizmat ko'rsatish (o'quv reja 0005) | `avto-tamirlash-or0005` | 2 | 35188 |
| 06-25 | Avtomobillarni ta'mirlash va ularga xizmat ko'rsatish (o'quv reja 0005) | `avto-tamirlash-or0005` | 2 | 35189 |
| 07-25 | Tikuvchilik mahsulotlari dizayneri | `tikuvchilik-mahsulotlari-dizayneri` | 2 | 35190 |
| 08-25 | Oshpaz | `oshpaz` | 2 | 35191 |
| 09-25 | Oshpaz | `oshpaz` | 2 | 35192 |
| 10-25 | O't o'chiruvchi | `ot-ochiruvchi` | 2 | 35193 |
| 01-26 | Zargarlik | `zargarlik` | 1 | 46497 |
| 02-26 | Grafik va dizayn texnologiyasi | `grafik-dizayn-texnologiyasi` | 1 | 46583 |
| 03-26 | Kompyuter tarmoqlari va IT-servis | `kompyuter-tarmoqlari-it-servis` | 1 | 46584 |
| 04-26 | Kompyuter tarmoqlari va IT-servis | `kompyuter-tarmoqlari-it-servis` | 1 | 46585 |
| 05-26 | Avtomobillar servisi | `avtomobillar-servisi` | 1 | 46586 |
| 06-26 | Avtomobillar servisi | `avtomobillar-servisi` | 1 | 46587 |
| 07-26 | Elektromontyor | `elektromontyor` | 1 | 50210 |
| 08-26 | Moda va tikuv ishlab chiqarish texnologiyasi | `moda-tikuv-texnologiyasi` | 1 | 50208 |
| 09-26 | Sartarosh (modeler) | `sartarosh-modeler` | 1 | 49918 |
| 10-26 | Metallga qayta ishlov berish | `metallga-qayta-ishlov` | 1 | 49734 |

### 12.2 Yo'nalishlar va fanlar (soat = kasb-emis «Jami soat»)

#### 01-25, 02-25 — Kompyuter grafikasi va dizayn operatori  (`kompyuter-grafikasi-dizayn-operatori`)

- Kod: 30610104 · Ta'lim yo'nalishi: Axborot tizimlari va texnologiyalari
- O'quv reja: OR-2025-154-0007 (kasb-emis ID 24946) · Kunduzgi · 2025-2027 · hozir 2-kurs
- Kiritilgan semestrlar: 1, 2, 3; kiritilmagan: 4

| Toifa | Fan | 1-sem | 2-sem | 3-sem | Jami |
| --- | --- | --- | --- | --- | --- |
| Kasbiy (spes) fan | Elektrotexnika va elektronika asoslari | 54 |  |  | 54 |
| Kasbiy (spes) fan | Media va axborot savodxonligi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Axborot texnologiyalari asoslari | 54 |  |  | 54 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Uch o‘lchovli modellashtirish va multiplikatsiyalash asoslari |  | 27 | 108 | 135 |
| Kasbiy (spes) fan | Rastr va vektor grafikasi asoslari |  | 27 | 135 | 162 |
| Kasbiy (spes) fan | Axborot xavfsizligi |  |  | 81 | 81 |
| Amaliyot | Kompyuter grafikasi va dizayn (o‘quv amaliyoti) | 162 |  | 81 | 243 |
| Amaliyot | Ishlab chiqarish amaliyoti |  | 486 |  | 486 |
| Amaliyot | Kompyuter grafikasi va dizayn |  | 27 | 135 | 162 |
| Umumta'lim fani | Jismoniy tarbiya | 27 | 27 | 27 | 81 |
| Umumta'lim fani | Fizika va astronomiya | 54 | 27 |  | 81 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 54 | 27 | 54 | 135 |
| Umumta'lim fani | Matematika | 108 | 27 | 54 | 189 |
| Umumta'lim fani | Tarbiya | 54 | 27 |  | 81 |
| Umumta'lim fani | Tarix | 54 | 27 | 54 | 135 |
| Umumta'lim fani | Chet tili (ingliz tili) | 243 | 162 | 243 | 648 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 54 | 27 |  | 81 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 | 54 | 54 | 162 |
| Umumta'lim fani | Chaqiruvga qadar boshlang‘ich tayyorgarlik |  | 27 | 27 | 54 |
| | **Jami** | **1080** | **999** | **1053** | **3132** |

#### 03-25, 04-25 — Avtomobillarni ta'mirlash va ularga xizmat ko'rsatish (o'quv reja 0006)  (`avto-tamirlash-or0006`)

- Kod: 30711601 · Ta'lim yo'nalishi: Mexanika muhandisligi
- O'quv reja: OR-2025-154-0006 (kasb-emis ID 24938) · Dual · 2025-2027 · hozir 2-kurs
- Kiritilgan semestrlar: 1, 2, 3; kiritilmagan: 4

| Toifa | Fan | 1-sem | 2-sem | 3-sem | Jami |
| --- | --- | --- | --- | --- | --- |
| Kasbiy (spes) fan | Diagnostika apparatlarini tuzilishi va ishlash prinsiplari | 81 |  |  | 81 |
| Kasbiy (spes) fan | Avtomobil elektr va elektron jihozlari tuzilishi, ularga texnik xizmat ko'rsatish va ta'mirlash | 94 |  |  | 94 |
| Kasbiy (spes) fan | Avtomobil tuzilishi | 108 |  |  | 108 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Karyerani rivojlantirish |  | 11 |  | 11 |
| Kasbiy (spes) fan | Tashishlarni tashkil etish |  |  | 30 | 30 |
| Kasbiy (spes) fan | "B" va "C" toifadagi avtotransport vositalarining tuzilishi va ularga servis xizmat ko‘rsatish |  |  | 108 | 108 |
| Kasbiy (spes) fan | Yo'l harakati qoidalari va harakat xavfsizligi |  |  | 283 | 283 |
| Amaliyot | Avtomobil elektr va elektron jihozlari tuzilishi, ularga texnik xizmat ko'rsatish va ta'mirlash (o‘quv amaliyoti) |  | 2 |  | 2 |
| Amaliyot | Kvalifikatsion amaliyot |  | 972 |  | 972 |
| Umumta'lim fani | Jismoniy tarbiya | 54 |  | 54 | 108 |
| Umumta'lim fani | Fizika va astronomiya | 81 |  | 54 | 135 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 81 |  | 81 | 162 |
| Umumta'lim fani | Matematika | 108 |  | 135 | 243 |
| Umumta'lim fani | Tarbiya | 81 |  |  | 81 |
| Umumta'lim fani | Tarix | 54 |  | 54 | 108 |
| Umumta'lim fani | Chet tili (ingliz tili) | 108 |  | 108 | 216 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 81 |  | 54 | 135 |
| Umumta'lim fani | Ona tili va adabiyoti | 81 |  | 54 | 135 |
| Umumta'lim fani | Chaqiruvga qadar boshlang‘ich tayyorgarlik |  |  | 54 | 54 |
| | **Jami** | **1066** | **985** | **1069** | **3120** |

#### 05-25, 06-25 — Avtomobillarni ta'mirlash va ularga xizmat ko'rsatish (o'quv reja 0005)  (`avto-tamirlash-or0005`)

- Kod: 30711601 · Ta'lim yo'nalishi: Mexanika muhandisligi
- O'quv reja: OR-2025-154-0005 (kasb-emis ID 24937) · Dual · 2025-2027 · hozir 2-kurs
- Kiritilgan semestrlar: 1, 2, 3; kiritilmagan: 4
- Izoh: 06-25 buyurtmachi hujjatlarida «Avtomobil dvigatellarini tashxislash va ta'mirlash» deb yuritiladi

| Toifa | Fan | 1-sem | 2-sem | 3-sem | Jami |
| --- | --- | --- | --- | --- | --- |
| Kasbiy (spes) fan | Yonilg'i ta'minlash tizimiga servis xizmat ko'rsatish va ta'mirlash | 54 |  |  | 54 |
| Kasbiy (spes) fan | Avtomobil elektr va elektron jihozlari tuzilishi, ularga texnik xizmat ko'rsatish va ta'mirlash | 54 |  |  | 54 |
| Kasbiy (spes) fan | Avtomobil dvigatellariga servis xizmat ko‘rsatish va ta’mirlash | 68 |  |  | 68 |
| Kasbiy (spes) fan | Avtomobil tuzilishi | 108 |  |  | 108 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Karyerani rivojlantirish |  | 4 |  | 4 |
| Kasbiy (spes) fan | Avtotransportda qonunchilik asoslari |  | 6 |  | 6 |
| Kasbiy (spes) fan | Biznes asoslari |  |  | 81 | 81 |
| Kasbiy (spes) fan | Tashishlarni tashkil etish |  |  | 30 | 30 |
| Kasbiy (spes) fan | "B" va "C" toifadagi avtotransport vositalarining tuzilishi va ularga servis xizmat ko‘rsatish |  |  | 108 | 108 |
| Kasbiy (spes) fan | Yo'l harakati qoidalari va harakat xavfsizligi |  |  | 283 | 283 |
| Amaliyot | Kvalifikatsion amaliyot |  | 972 |  | 972 |
| Umumta'lim fani | Jismoniy tarbiya | 54 |  | 54 | 108 |
| Umumta'lim fani | Fizika va astronomiya | 81 |  | 54 | 135 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 81 |  | 81 | 162 |
| Umumta'lim fani | Tarbiya | 81 |  |  | 81 |
| Umumta'lim fani | Matematika | 108 |  | 135 | 243 |
| Umumta'lim fani | Tarix | 54 |  | 54 | 108 |
| Umumta'lim fani | Chet tili (ingliz tili) | 108 |  | 108 | 216 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 81 |  | 54 | 135 |
| Umumta'lim fani | Ona tili va adabiyoti | 81 |  | 54 | 135 |
| Umumta'lim fani | Chaqiruvga qadar boshlang‘ich tayyorgarlik |  |  | 54 | 54 |
| | **Jami** | **1067** | **982** | **1150** | **3199** |

#### 07-25 — Tikuvchilik mahsulotlari dizayneri  (`tikuvchilik-mahsulotlari-dizayneri`)

- Kod: 30720423 · Ta'lim yo'nalishi: Dizayn (turlari bo'yicha)
- O'quv reja: OR-2025-154-0002 (kasb-emis ID 24930) · Kunduzgi · 2025-2027 · hozir 2-kurs
- Kiritilgan semestrlar: 1, 2, 3; kiritilmagan: 4

| Toifa | Fan | 1-sem | 2-sem | 3-sem | Jami |
| --- | --- | --- | --- | --- | --- |
| Kasbiy (spes) fan | Tikuv buyumlarini tikish texnologiyasi | 54 | 27 |  | 81 |
| Kasbiy (spes) fan | Tikuvchilik mahsulotlarini konstruksiyalash va modellashtirish | 54 |  | 54 | 108 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Tikuvchilik jihozlari | 54 |  |  | 54 |
| Kasbiy (spes) fan | Rasm va badiiy grafika | 54 | 27 | 54 | 135 |
| Kasbiy (spes) fan | Tikuvchilik materialshunosligi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Loyihalash |  | 54 | 108 | 162 |
| Kasbiy (spes) fan | Tikuv buyumlarini badiiy bezash |  |  | 108 | 108 |
| Kasbiy (spes) fan | Biznes asoslari |  |  | 81 | 81 |
| Amaliyot | Ishlab chiqarish amaliyoti |  | 389 |  | 389 |
| Amaliyot | Tikuvchilik mahsulotlarini tikish va badiiy bezash ishlari (o'quv amaliyoti) |  | 81 | 81 | 162 |
| Amaliyot | Eskiz asosida tikuvchilik mahsulotlarini tayyorlash (o'quv amaliyoti) |  |  | 81 | 81 |
| Umumta'lim fani | Jismoniy tarbiya | 27 | 27 | 27 | 81 |
| Umumta'lim fani | Kimyo | 54 |  |  | 54 |
| Umumta'lim fani | Fizika va astronomiya | 54 | 27 | 27 | 108 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 54 | 27 |  | 81 |
| Umumta'lim fani | Matematika | 81 | 27 | 54 | 162 |
| Umumta'lim fani | Tarbiya | 54 | 27 |  | 81 |
| Umumta'lim fani | Tarix | 54 | 27 | 54 | 135 |
| Umumta'lim fani | Chet tili (ingliz tili) | 243 | 162 | 243 | 648 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 54 | 27 |  | 81 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 | 54 | 54 | 162 |
| Umumta'lim fani | Chaqiruvga qadar boshlang‘ich tayyorgarlik |  | 27 | 54 | 81 |
| | **Jami** | **1053** | **1010** | **1080** | **3143** |

#### 08-25, 09-25 — Oshpaz  (`oshpaz`)

- Kod: 31010303 · Ta'lim yo'nalishi: Turizm sohasida xizmatlar texnologiyasi va ularni tashkil etish
- O'quv reja: OR-2025-154-0004 (kasb-emis ID 24935) · Dual · 2025-2027 · hozir 2-kurs
- Kiritilgan semestrlar: 1, 2, 3; kiritilmagan: 4

| Toifa | Fan | 1-sem | 2-sem | 3-sem | Jami |
| --- | --- | --- | --- | --- | --- |
| Kasbiy (spes) fan | O'zbek milliy pazandachilik texnologiyasi | 54 | 27 |  | 81 |
| Kasbiy (spes) fan | Oziq-ovqat mahsulotlari tovarshunosligi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Umumiy ovqatlanish korxonalarida texnologik jihozlar | 81 |  |  | 81 |
| Kasbiy (spes) fan | Umumiy ovqatlanish korxonalarida sanitariya, gigiyena va ovqatlanish fiziologiyasi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |  |  | 54 |
| Kasbiy (spes) fan | Oshpazlik taomlarini tayyorlash texnologiyasi |  | 130 |  | 130 |
| Kasbiy (spes) fan | Qandolatchilik mahsulotlarini tayyorlash texnologiyasi |  |  | 81 | 81 |
| Kasbiy (spes) fan | Milliy va sharq shirinliklari qandolatchiligi |  |  | 54 | 54 |
| Kasbiy (spes) fan | Biznes asoslari |  |  | 81 | 81 |
| Amaliyot | Kvalifikatsion amaliyot |  | 810 | 612 | 1422 |
| Umumta'lim fani | Jismoniy tarbiya | 54 |  | 54 | 108 |
| Umumta'lim fani | Fizika va astronomiya | 81 |  | 54 | 135 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 81 |  | 81 | 162 |
| Umumta'lim fani | Matematika | 108 |  | 162 | 270 |
| Umumta'lim fani | Tarbiya | 81 |  |  | 81 |
| Umumta'lim fani | Tarix | 54 |  | 54 | 108 |
| Umumta'lim fani | Chet tili (ingliz tili) | 108 |  | 108 | 216 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 81 |  | 81 | 162 |
| Umumta'lim fani | Ona tili va adabiyoti | 81 |  | 81 | 162 |
| Umumta'lim fani | Chaqiruvga qadar boshlang‘ich tayyorgarlik |  |  | 81 | 81 |
| | **Jami** | **1026** | **967** | **1584** | **3577** |

#### 10-25 — O't o'chiruvchi  (`ot-ochiruvchi`)

- Kod: 31030101 · Ta'lim yo'nalishi: Ijtimoiy ish (faoliyatning turli sohalari bo'yicha)
- O'quv reja: OR-2025-154-0003 (kasb-emis ID 24934) · Kunduzgi · 2025-2027 · hozir 2-kurs
- Kiritilgan semestrlar: 1, 2, 3; kiritilmagan: 4

| Toifa | Fan | 1-sem | 2-sem | 3-sem | Jami |
| --- | --- | --- | --- | --- | --- |
| Kasbiy (spes) fan | Yong‘in avariya-qutqaruv taktikasi | 108 | 81 |  | 189 |
| Kasbiy (spes) fan | Favqulodda vaziyatlardan jabrlanganlarga birinchi tibbiy yordam ko'rsatish | 54 |  | 27 | 81 |
| Kasbiy (spes) fan | Jangovor va maxsus taktik tayyorgarlik |  |  | 162 | 162 |
| Kasbiy (spes) fan | Biznes asoslari |  |  | 81 | 81 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi |  |  | 54 | 54 |
| Kasbiy (spes) fan | Aholi va hududlarni favqulodda vaziyatlardan muhofaza qilishning huquqiy asoslari |  |  | 54 | 54 |
| Amaliyot | O't o'chiruvchi ishi (o‘quv amaliyoti) | 162 | 81 |  | 243 |
| Amaliyot | Ishlab chiqarish amaliyoti |  | 470 |  | 470 |
| Amaliyot | Qutqaruvchi ishlari (o‘quv amaliyoti) |  |  | 162 | 162 |
| Umumta'lim fani | Jismoniy tarbiya | 27 | 27 |  | 54 |
| Umumta'lim fani | Kimyo | 54 |  |  | 54 |
| Umumta'lim fani | Fizika va astronomiya | 54 | 27 | 27 | 108 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 54 |  | 27 | 81 |
| Umumta'lim fani | Matematika | 81 | 27 | 27 | 135 |
| Umumta'lim fani | Tarbiya | 54 | 27 |  | 81 |
| Umumta'lim fani | Tarix | 54 | 27 | 54 | 135 |
| Umumta'lim fani | Chet tili (ingliz tili) | 243 | 162 | 243 | 648 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 54 | 27 |  | 81 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 | 27 | 81 | 162 |
| Umumta'lim fani | Chaqiruvga qadar boshlang‘ich tayyorgarlik |  | 27 | 27 | 54 |
| | **Jami** | **1053** | **1010** | **1026** | **3089** |

#### 01-26 — Zargarlik  (`zargarlik`)

- Kod: 31010803 · Ta'lim yo'nalishi: Zargarlik ishi
- O'quv reja: OR-2026-154-0001 (kasb-emis ID 48964) · Dual · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4
- Kvalifikatsiyalar: Zargar-blaguzukchi (o'rnatuvchi, zanjir yasovchi); Zargar (modelyer); Zargarlik mahsulotlari sotuvchisi

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Rangtasvir | 54 |
| Kasbiy (spes) fan | Chizmageometriya, soyalar nazariyasi, nuqtai nazar | 54 |
| Kasbiy (spes) fan | Kompozitsiya va dizayn asoslari | 54 |
| Kasbiy (spes) fan | Materialshunoslik | 54 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 54 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 81 |
| Umumta'lim fani | Fizika | 54 |
| Umumta'lim fani | Matematika | 135 |
| Umumta'lim fani | Tarix | 108 |
| Umumta'lim fani | Chet tili (ingliz tili) | 108 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 108 |
| Umumta'lim fani | Ona tili va adabiyoti | 108 |
| | **Jami** | **1026** |

#### 02-26 — Grafik va dizayn texnologiyasi  (`grafik-dizayn-texnologiyasi`)

- Kod: 30610105 · Ta'lim yo'nalishi: Axborot tizimlari va texnologiyalari
- O'quv reja: OR-2026-154-0002 (kasb-emis ID 49030) · Kunduzgi · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Veb dizayn va UI/UX | 81 |
| Kasbiy (spes) fan | Multimedia va animatsiya texnologiyalari | 54 |
| Kasbiy (spes) fan | Elektrotexnika va elektronika asoslari | 54 |
| Kasbiy (spes) fan | Media va axborot savodxonligi | 54 |
| Kasbiy (spes) fan | Axborot texnologiyalari asoslari | 81 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Amaliyot | Kompyuter grafikasi va dizayn | 189 |
| Umumta'lim fani | Jismoniy tarbiya | 27 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 54 |
| Umumta'lim fani | Matematika | 54 |
| Umumta'lim fani | Tarix | 27 |
| Umumta'lim fani | Chet tili (ingliz tili) | 243 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 54 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 |
| | **Jami** | **1080** |

#### 03-26, 04-26 — Kompyuter tarmoqlari va IT-servis  (`kompyuter-tarmoqlari-it-servis`)

- Kod: 30610403 · Ta'lim yo'nalishi: Kompyuter injiniringi («Kompyuter injiniringi», «AT-Servis», «Axborot xavfsizligi», «Multimedia texnologiyalari»)
- O'quv reja: OR-2026-154-0003 (kasb-emis ID 49031) · Kunduzgi · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Axborot xavfsizligi | 135 |
| Kasbiy (spes) fan | Elementar dasturlash | 81 |
| Kasbiy (spes) fan | Elektrotexnika va elektronika asoslari | 54 |
| Kasbiy (spes) fan | Media va axborot savodxonligi | 54 |
| Kasbiy (spes) fan | Kompyuter tizimlari | 95 |
| Kasbiy (spes) fan | Axborot texnologiyalari asoslari | 81 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 27 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 54 |
| Umumta'lim fani | Matematika | 54 |
| Umumta'lim fani | Tarix | 27 |
| Umumta'lim fani | Chet tili (ingliz tili) | 243 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 54 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 |
| | **Jami** | **1067** |

#### 05-26, 06-26 — Avtomobillar servisi  (`avtomobillar-servisi`)

- Kod: 30711605 · Ta'lim yo'nalishi: Mexanika muhandisligi
- O'quv reja: OR-2026-154-0004 (kasb-emis ID 49033) · Dual · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4
- Izoh: buyurtmachi hujjatlarida 05-26 «Avtomobillar servisi (avtodvigatel) (dual)»

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Avtomobil dvigatellarini tashxislash | 151 |
| Kasbiy (spes) fan | Avtomobil tuzilishi | 230 |
| Kasbiy (spes) fan | Texnikaviy chizmachilik va CAD/CAM/CAE | 54 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 27 |
| Umumta'lim fani | Fizika va astronomiya | 41 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 41 |
| Umumta'lim fani | Matematika | 81 |
| Umumta'lim fani | Tarix | 41 |
| Umumta'lim fani | Chet tili (ingliz tili) | 41 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 41 |
| Umumta'lim fani | Ona tili va adabiyoti | 41 |
| | **Jami** | **843** |

#### 07-26 — Elektromontyor  (`elektromontyor`)

- Kod: 30710303 · Ta'lim yo'nalishi: — (tarifikatsiyada yo‘q, foydalanuvchidan so‘ra)
- O'quv reja: OR-2026-154-0005 (kasb-emis ID 49036) · Dual · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Elektr mashinalari va transformatorlar | 54 |
| Kasbiy (spes) fan | Elektr stansiya elektr jihozlari | 108 |
| Kasbiy (spes) fan | Elektr o'lchash asboblari va elektr o'lchashlar | 54 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Kasbiy (spes) fan | Texnikaviy chizmachilik | 54 |
| Kasbiy (spes) fan | Elektrotexnika va elektronika asoslari | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 54 |
| Umumta'lim fani | Fizika va astronomiya | 81 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 81 |
| Umumta'lim fani | Matematika | 135 |
| Umumta'lim fani | Tarix | 54 |
| Umumta'lim fani | Chet tili (ingliz tili) | 108 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 81 |
| Umumta'lim fani | Ona tili va adabiyoti | 81 |
| | **Jami** | **1053** |

#### 08-26 — Moda va tikuv ishlab chiqarish texnologiyasi  (`moda-tikuv-texnologiyasi`)

- Kod: 30720436 · Ta'lim yo'nalishi: — (tarifikatsiyada yo‘q, foydalanuvchidan so‘ra)
- O'quv reja: OR-2026-154-0006 (kasb-emis ID 49037) · Dual · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Zamonaviy tikuv jihozlari | 54 |
| Kasbiy (spes) fan | Kiyim dizaynini yaratish | 54 |
| Kasbiy (spes) fan | Tikuv mahsulotlari uchun tekstil materiallarini tanlash | 54 |
| Kasbiy (spes) fan | Keng assortimentdagi kiyimlarni konstruksiyalash va modellashtirish | 108 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 27 |
| Umumta'lim fani | Fizika va astronomiya | 27 |
| Umumta'lim fani | Informatika va axborot texnologiyalari | 27 |
| Umumta'lim fani | Matematika | 54 |
| Umumta'lim fani | Tarix | 27 |
| Umumta'lim fani | Chet tili (ingliz tili) | 27 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 27 |
| Umumta'lim fani | Ona tili va adabiyoti | 27 |
| | **Jami** | **567** |

#### 09-26 — Sartarosh (modeler)  (`sartarosh-modeler`)

- Kod: 31010202 · Ta'lim yo'nalishi: Sartaroshlik va kosmetologiya xizmatlari
- O'quv reja: OR-2026-154-0007 (kasb-emis ID 49038) · Kunduzgi · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Koloristika | 54 |
| Kasbiy (spes) fan | Erkaklar va ayollar sartaroshi | 54 |
| Kasbiy (spes) fan | Sartaroshlik ishlari materiallari va asbob-uskunalari | 54 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Kasbiy (spes) fan | Rang tasvir | 54 |
| Kasbiy (spes) fan | Sartaroshlik asoslari | 54 |
| Kasbiy (spes) fan | Kasb etikasi va psixologiyasi | 54 |
| Kasbiy (spes) fan | Kasbiy faoliyatda xorijiy til (rus tili) | 81 |
| Kasbiy (spes) fan | Plastik anatomiya va fiziologiya | 54 |
| Amaliyot | Manikyur va pedikyur ishlari | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 27 |
| Umumta'lim fani | Matematika | 54 |
| Umumta'lim fani | Tarix | 54 |
| Umumta'lim fani | Chet tili (ingliz tili) | 243 |
| Umumta'lim fani | Rus tili (o‘zb sinf) | 54 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 |
| | **Jami** | **1053** |

#### 10-26 — Metallga qayta ishlov berish  (`metallga-qayta-ishlov`)

- Kod: 30711307 · Ta'lim yo'nalishi: Metallar texnologiyalari
- O'quv reja: OR-2026-154-0008 (kasb-emis ID 49039) · Dual · 2026-2028 · hozir 1-kurs
- Kiritilgan semestrlar: 1; kiritilmagan: 2, 3, 4

| Toifa | Fan | 1-sem
| --- | --- | ---
| Kasbiy (spes) fan | Konstruksion materiallar | 216 |
| Kasbiy (spes) fan | Chilangarlik ishi | 230 |
| Kasbiy (spes) fan | Qo'lda yoyli payvandlash ishlari | 122 |
| Kasbiy (spes) fan | Texnikaviy chizmachilik | 203 |
| Kasbiy (spes) fan | Mehnat muhofazasi va xavfsizlik texnikasi | 54 |
| Umumta'lim fani | Matematika | 54 |
| Umumta'lim fani | Jismoniy tarbiya | 27 |
| Umumta'lim fani | Fizika va astronomiya | 54 |
| Umumta'lim fani | Tarix | 54 |
| Umumta'lim fani | Chet tili (ingliz tili) | 54 |
| Umumta'lim fani | Ona tili va adabiyoti | 54 |
| | **Jami** | **1122** |

---

Tayyorlagan: Claude, Mashrapov Q. so‘rovi bo‘yicha, 10.11.2026. Ma’lumotlar kasb-emis.edu.uz’dan 05.11.2026 holatida olindi.
