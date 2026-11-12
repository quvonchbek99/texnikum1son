# Toshkent tuman 1-son texnikumi e-bazasi — texnikum1son.uz

Statik sayt (GitHub Pages) + Firebase (login, Firestore) + Google Drive (asl fayllar) + Gemini (AI tahlil).

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
