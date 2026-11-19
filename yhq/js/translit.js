/* O'zbek lotin <-> kirill transliteratsiyasi (oflayn) */
(function (g) {
  var L2C = { a: 'а', b: 'б', d: 'д', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х', y: 'й', z: 'з', c: 'с', w: 'в' };
  var APO = /[ʻ‘’'`]/;
  // lotincha qoladigan qisqartmalar: toifalar, raqamli belgilar, xalqaro yozuvlar
  var KEEP = /^(STOP|TAXI|SOS|LED|GPS|SMS|ID|3D|ECO|EKO|ZONE|ZONA|CUSTOMS|DANGER|RADAR|WC|BMT|YPX|M\d\w*|N\d\w*|O\d|L\d|[ABCDE]|[ABCD]1|[BCD]E|C1E|D1E|E\d+|IP\d*|ABS|ESP)$/;
  function isV(ch) { return !!ch && 'aeiouAEIOU'.indexOf(ch) >= 0; }

  function cyrWord(w) {
    if (KEEP.test(w) || /^\d+$/.test(w)) return w;
    // rus tilidan o'zlashgan so'zlar: ts -> ц, obyekt -> объект
    w = w.replace(/ts(?=ikl|ement|entr|enz|ilindr|istern|ifer|ert)/g, '\uE000').replace(/Ts(?=ikl|ement|entr|enz|ilindr|istern|ifer)/g, '\uE001')
         .replace(/([ouOU])b(ye|Ye|YE)/g, '$1bʼ$2');
    var out = '', i = 0, n = w.length;
    while (i < n) {
      var c = w[i], c1 = w[i + 1] || '', c2 = w[i + 2] || '';
      var lc = c.toLowerCase(), l1 = c1.toLowerCase(), up = c !== lc, r;
      if ((lc === 'o' || lc === 'g') && APO.test(c1)) { r = lc === 'o' ? 'ў' : 'ғ'; i += 2; }
      else if (lc === 's' && l1 === 'h') { r = 'ш'; i += 2; }
      else if (lc === 'c' && l1 === 'h') { r = 'ч'; i += 2; }
      else if (lc === 'y' && l1 === 'o' && !APO.test(c2)) { r = 'ё'; i += 2; }
      else if (lc === 'y' && l1 === 'u') { r = 'ю'; i += 2; }
      else if (lc === 'y' && l1 === 'a') { r = 'я'; i += 2; }
      else if (lc === 'y' && l1 === 'e') { r = 'е'; i += 2; }
      else if (lc === 't' && l1 === 's' && /^(iya|ion)/i.test(w.substr(i + 2, 3))) { r = 'ц'; i += 2; }
      else if (lc === 'e') { r = (i === 0 || isV(w[i - 1])) ? 'э' : 'е'; i++; }
      else if (c === 'ʼ' || c === '’' || c === "'" || c === 'ʻ' || c === '‘' || c === '`') { r = 'ъ'; i++; up = false; }
      else { r = L2C[lc] || c; i++; }
      out += up ? r.toUpperCase() : r;
    }
    return out.replace(/\uE000/g, 'ц').replace(/\uE001/g, 'Ц');
  }
  function toCyr(text) {
    if (!text) return text;
    return String(text).replace(/[A-Za-z0-9ʻʼ‘’'`]+/g, function (w) {
      // so'z boshidagi/oxiridagi tirnoqni qoldiramiz
      var pre = '', post = '';
      while (w.length && /['‘’`]/.test(w[0])) { pre += w[0]; w = w.slice(1); }
      while (w.length && /['‘’`]/.test(w[w.length - 1]) && !/[oOgG]/.test(w[w.length - 2] || '')) { post = w[w.length - 1] + post; w = w.slice(0, -1); }
      return pre + cyrWord(w) + post;
    });
  }
  var C2L = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o', 'қ': 'q', 'ғ': 'g', 'ҳ': 'h' };
  // qidiruv uchun yagona kalit: kichik harf, lotin, tutuq/apostrofsiz
  function norm(s) {
    s = String(s || '').toLowerCase();
    s = s.replace(/[а-яёўқғҳ]/g, function (ch) { return C2L[ch] != null ? C2L[ch] : ch; });
    s = s.replace(/[ʻʼ‘’'`]/g, '').replace(/ye/g, 'e').replace(/[“”«»"]/g, ' ');
    return s.replace(/\s+/g, ' ');
  }
  g.Translit = { toCyr: toCyr, norm: norm };
})(window);
