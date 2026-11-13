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
 *
 * Katta fayllar (800 betlik majmualar, 400 MB gacha): «boshla» → Drive'da davom ettiriladigan (resumable) yuklash
 * sessiyasi ochiladi; «bolak» → fayl 8 MB lik bo'laklarda yuboriladi. Sessiya manzili faqat shu skriptda saqlanadi.
 */
var API_KEY = 'AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc';   // Firebase veb kaliti (ochiq kalit)
var LOYIHA = 'kuvonch-academy';                            // Firebase loyiha ID
var ILDIZ_NOMI = 'texnikum1son — e-baza fayllari';         // Drive'dagi asosiy papka
var MAX_BAYT = 26 * 1024 * 1024;
var MAX_KATTA = 400 * 1024 * 1024;   // bo'laklab yuklanadigan eng katta fayl

function doGet() {
  return javob({ ok: true, xizmat: 'texnikum1son drive', papka: ildiz().getName(), vaqt: new Date().toISOString() });
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var u = tekshir(d.token);
    if (d.amal === 'yukla') return javob(yukla(d, u));
    if (d.amal === 'ochir') return javob(ochir(d, u));
    if (d.amal === 'boshla') return javob(boshla(d, u));
    if (d.amal === 'bolak') return javob(bolak(d, u));
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

/** Katta fayl: Drive API resumable yuklash sessiyasini ochadi */
function boshla(d, u) {
  var hajm = Number(d.hajm) || 0;
  if (hajm <= 0 || hajm > MAX_KATTA) throw new Error('Fayl hajmi 400 MB gacha bo‘lishi kerak');
  var papka = ichkari(ichkari(ichkari(ildiz(), toza(d.yonalish || 'Yonalish')), toza(d.fan || 'Fan')), (d.sem || '1') + '-semestr');
  var meta = { name: toza(d.nom || 'fayl'), parents: [papka.getId()], description: 'uid:' + u.uid + ' | ' + (d.oqituvchi || '') + ' | ' + (d.nom || '') };
  var r = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id', {
    method: 'post', contentType: 'application/json; charset=UTF-8', payload: JSON.stringify(meta), muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': d.mime || 'application/octet-stream', 'X-Upload-Content-Length': String(hajm) }
  });
  if (r.getResponseCode() !== 200) throw new Error('Drive sessiyasi ochilmadi (' + r.getResponseCode() + ')');
  var h = r.getAllHeaders(), loc = h.Location || h.location;
  if (!loc) throw new Error('Drive sessiya manzilini bermadi');
  var kalit = Utilities.getUuid();
  CacheService.getScriptCache().put('s_' + kalit, JSON.stringify({ loc: loc, uid: u.uid, hajm: hajm }), 21600);
  return { ok: true, sessiya: kalit, bolak: 8 * 1024 * 1024 };
}

/** Katta fayl: navbatdagi bo'lak (base64). Oxirgi bo'lakdan keyin fayl ID qaytadi */
function bolak(d, u) {
  var s = JSON.parse(CacheService.getScriptCache().get('s_' + d.sessiya) || 'null');
  if (!s || s.uid !== u.uid) throw new Error('Yuklash sessiyasi topilmadi yoki muddati tugagan — qaytadan boshlang');
  var bayt = Utilities.base64Decode(d.b64 || ''), bosh = Number(d.bosh) || 0;
  if (!bayt.length) throw new Error("Bo'lak bo'sh");
  var oxir = bosh + bayt.length - 1;
  var r = UrlFetchApp.fetch(s.loc, {
    method: 'put', payload: bayt, contentType: 'application/octet-stream', muteHttpExceptions: true, followRedirects: false,
    headers: { 'Content-Range': 'bytes ' + bosh + '-' + oxir + '/' + s.hajm }
  });
  var c = r.getResponseCode();
  if (c === 308) return { ok: true, tugadi: false, keyingi: oxir + 1 };
  if (c === 200 || c === 201) {
    var id = JSON.parse(r.getContentText()).id, fayl = DriveApp.getFileById(id);
    fayl.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    CacheService.getScriptCache().remove('s_' + d.sessiya);
    return { ok: true, tugadi: true, id: id, url: fayl.getUrl(), nom: fayl.getName(), hajm: s.hajm };
  }
  throw new Error("Bo'lak yuklanmadi (" + c + '): ' + r.getContentText().slice(0, 200));
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
