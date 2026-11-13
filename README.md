# Toshkent tuman 1-son texnikumi e-bazasi — texnikum1son.uz

Statik sayt (GitHub Pages) + Firebase (login, Firestore) + Google Drive (asl fayllar) + Gemini (AI tahlil).


## Versiyalar (13.11.2026)

- **2-versiya (hozirgi, ildizda):** faqat fanlar. Kasbiy fanlar — har mutaxassislik bo‘yicha alohida; umumta’lim fanlari — hammasi uchun bitta sahifa (`yonalish/umumtalim/fan/<fan>/`, Firestore'da `yonalish = "umumtalim"`). Guruh raqamlari ko‘rsatilmaydi.
  Kuvi AI (`assets/t1-kuvi.js`): «Maslahatchi» (o‘qituvchilar) va «Javob beruvchi» (o‘quvchilar) rejimlari, Gemini orqali.
  O‘UM yig‘uvchi (`assets/rtr.js`, `assets/fan.js`): bo‘limlar va modul/mavzular tanlanadi → bitta Word hujjat, chop etish/PDF yoki ZIP (bo‘limlar yoki mavzular bo‘yicha alohida fayllar).
  Kabinet: avtomatik ro‘yxat (holat darhol «tasdiqlangan», admin bloklashi mumkin), Google bilan kirish, parolni emailga tiklash.
- **1-versiya (eski):** `/eski/` papkasida muzlatilgan nusxa (noindex); manbasi `_manba/eski/build_v1.py`, git tegi `v1-eski`, `eski-versiya` tarmog‘i.
  Eski manzillar (`/yonalish/<id>/`, `/guruh/<g>/`, `/haqida/`, `/joylashuv/`…) yangi katalogga yoki `/eski/` ga yo‘naltiriladi.

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
