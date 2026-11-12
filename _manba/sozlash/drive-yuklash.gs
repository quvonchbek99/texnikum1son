/**
 * texnikum1son.uz — o'qituvchilar fayllarini Google Drive'ga saqlash xizmati (Google Apps Script)
 *
 * O'RNATISH (bir marta, Drive egasi akkauntidan):
 *  1. https://script.google.com → «Yangi loyiha» (New project). Nomi: texnikum1son-drive
 *  2. Code.gs ichidagi hamma narsani o'chirib, shu faylni to'liq joylang va saqlang (Ctrl+S).
 *  3. «Deploy» → «New deployment» → turi: «Web app».
 *       Execute as: Me (o'zingiz)      Who has access: Anyone (Har kim)
 *  4. «Deploy» → Google ruxsat so'raydi (Drive va tashqi so'rovlar) → ruxsat bering.
 *  5. Chiqqan «Web app URL» (…/exec) ni nusxalang va saytdagi Admin panel → «Fayllar ombori» ga qo'ying.
 *
 * Xavfsizlik: har bir yuklash o'qituvchining Firebase kirish tokeni bilan tekshiriladi —
 * faqat admin tasdiqlagan o'qituvchilar (t1_oqituvchilar/{uid}.holat == "tasdiqlangan") yoki adminlar fayl yuklay oladi.
 * Fayllar «havolasi borlar ko'ra oladi» rejimida saqlanadi (saytda ko'rsatish uchun).
 */
var API_KEY = 'AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc';   // Firebase veb kaliti (ochiq kalit)
var LOYIHA = 'kuvonch-academy';                            // Firebase loyiha ID
var ILDIZ_NOMI = 'texnikum1son — e-baza fayllari';         // Drive'dagi asosiy papka
var MAX_BAYT = 26 * 1024 * 1024;

function doGet() {
  return javob({ ok: true, xizmat: 'texnikum1son drive', papka: ildiz().getName(), vaqt: new Date().toISOString() });
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var u = tekshir(d.token);
    if (d.amal === 'yukla') return javob(yukla(d, u));
    if (d.amal === 'ochir') return javob(ochir(d, u));
    return javob({ ok: false, xato: "Noma'lum amal" });
  } catch (err) {
    return javob({ ok: false, xato: String((err && err.message) || err) });
  }
}

/** Firebase ID tokenini tekshiradi va foydalanuvchi o'qituvchi/admin ekanini aniqlaydi */
function tekshir(token) {
  if (!token) throw new Error('Kirish talab qilinadi');
  var kesh = CacheService.getScriptCache();
  var kalit = 't_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token)).slice(0, 40);
  var bor = kesh.get(kalit);
  if (bor) return JSON.parse(bor);
  var r = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + API_KEY, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken: token }), muteHttpExceptions: true
  });
  var j = JSON.parse(r.getContentText());
  if (!j.users || !j.users[0]) throw new Error('Kirish muddati tugagan — saytdan chiqib, qayta kiring');
  var uid = j.users[0].localId;
  var H = { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true };
  var baza = 'https://firestore.googleapis.com/v1/projects/' + LOYIHA + '/databases/(default)/documents/';
  var natija;
  if (UrlFetchApp.fetch(baza + 'admins/' + uid, H).getResponseCode() === 200) {
    natija = { uid: uid, admin: true };
  } else {
    var t = UrlFetchApp.fetch(baza + 't1_oqituvchilar/' + uid, H);
    if (t.getResponseCode() !== 200) throw new Error("O'qituvchi profili topilmadi");
    var f = JSON.parse(t.getContentText()).fields || {};
    if (!f.holat || f.holat.stringValue !== 'tasdiqlangan') throw new Error('Akkaunt hali tasdiqlanmagan');
    natija = { uid: uid, admin: false };
  }
  kesh.put(kalit, JSON.stringify(natija), 600);
  return natija;
}

function yukla(d, u) {
  if (!d.b64) throw new Error("Fayl bo'sh");
  var bayt = Utilities.base64Decode(d.b64);
  if (bayt.length > MAX_BAYT) throw new Error('Fayl 25 MB dan katta');
  var papka = ichkari(ichkari(ichkari(ildiz(), toza(d.yonalish || 'Yonalish')), toza(d.fan || 'Fan')), (d.sem || '1') + '-semestr');
  var blob = Utilities.newBlob(bayt, d.mime || 'application/octet-stream', toza(d.nom || 'fayl'));
  var fayl = papka.createFile(blob);
  fayl.setDescription('uid:' + u.uid + ' | ' + (d.oqituvchi || '') + ' | ' + (d.yol || d.nom || ''));
  fayl.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, id: fayl.getId(), url: fayl.getUrl(), nom: fayl.getName(), hajm: bayt.length };
}

function ochir(d, u) {
  var fayl = DriveApp.getFileById(d.id);
  if (!u.admin && fayl.getDescription().indexOf('uid:' + u.uid + ' ') !== 0) throw new Error("Bu fayl sizniki emas");
  fayl.setTrashed(true);
  return { ok: true };
}

function ildiz() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty('ILDIZ_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { } }
  var it = DriveApp.getFoldersByName(ILDIZ_NOMI), f = it.hasNext() ? it.next() : DriveApp.createFolder(ILDIZ_NOMI);
  p.setProperty('ILDIZ_ID', f.getId());
  return f;
}
function ichkari(ota, nom) { var it = ota.getFoldersByName(nom); return it.hasNext() ? it.next() : ota.createFolder(nom); }
function toza(s) { return String(s).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) || 'nomsiz'; }
function javob(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
