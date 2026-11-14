/*! Kuvonch Academy — yechim qadamlarini inglizchaga o'girish (SAT bo'limi to'liq inglizcha bo'lishi uchun).
 *  ka-savollar.js til "en" bo'lganda yuklaydi. Avval tartibli qoidalar (so'z tartibi o'zgaradigan iboralar),
 *  keyin iboralar lug'ati (uzunidan qisqasiga). Inglizchaga to'liq o'tmagan qadam ko'rsatilmaydi. */
(function () {
  "use strict";
  var N = "(−?[\\d.,/]+°?|[a-zA-Z]\\w*)";
  var RULES = [
    [new RegExp(N + " ni " + N + " marta o['ʻ’]ziga ko['ʻ’]paytiramiz", "g"), "multiply $1 by itself $2 times"],
    [new RegExp(N + " ni " + N + " marta ko['ʻ’]paytiramiz", "g"), "$1 multiplied $2 times"],
    [new RegExp(N + " yil = " + N + " ta yarim yemirilish davri", "g"), "$1 years = $2 half-lives"],
    [new RegExp("Har bir x uchun " + N + " xil tanlov", "g"), "$1 choices for each x"],
    [new RegExp("daraja " + N + " ga bo['ʻ’]linganda qoldiq " + N, "g"), "the exponent divided by $1 leaves remainder $2"],
    [new RegExp("Asos " + N + " dan katta bo['ʻ’]lsa o['ʻ’]suvchi", "g"), "If the base is greater than $1 it is increasing"],
    [new RegExp(N + " < a < " + N + " bo['ʻ’]lsa kamayuvchi", "g"), "if $1 < a < $2 it is decreasing"],
    [new RegExp("Quti diagrammasi ma['ʻ’]lumotni " + N + " ta " + N + "% lik bo['ʻ’]lakka bo['ʻ’]ladi", "g"), "A box plot splits the data into $1 parts of $2% each"],
    [new RegExp("Q(\\d) dan kichigi", "g"), "below Q$1"], [new RegExp("Q(\\d) dan kattasi", "g"), "above Q$1"],
    [new RegExp("Jami " + N + " ta qiymat, tartiblab o['ʻ’]rtadagisini olamiz", "g"), "$1 values in total; sort them and take the middle one"],
    [new RegExp(N + " ta yon yoq \\+ " + N + " ta asos", "g"), "$1 lateral faces + $2 bases"],
    [new RegExp("x = " + N + " da y = ", "g"), "at x = $1, y = "],
    [new RegExp("Yig['ʻ’]indisi " + N + " bo['ʻ’]ladigan hollar: " + N + " ta", "g"), "Outcomes with sum $1: $2"],
    [new RegExp("Har koordinata " + N + " ga ko['ʻ’]paytiriladi", "g"), "Each coordinate is multiplied by $1"],
    [new RegExp(N + "° qarshisidagi katet", "g"), "the leg opposite $1°"],
    [new RegExp("asosi " + N + ", balandligi " + N + " bo['ʻ’]lgan uchburchak", "g"), "a triangle with base $1 and height $2"],
    [new RegExp("qoldiq P\\(a\\) ga teng", "g"), "the remainder equals P(a)"],
    [new RegExp(N + " ga bo['ʻ’]linuvchilar soni", "g"), "number of multiples of $1"],
    [new RegExp(N + " ga qoldiqsiz bo['ʻ’]linadi", "g"), "is divisible by $1"],
    [new RegExp(N + " ga qoldiqsiz bo['ʻ’]linmaydi", "g"), "is not divisible by $1"],
    [new RegExp(N + " marta cho['ʻ’]ziladi", "g"), "is stretched by a factor of $1"],
    [new RegExp(N + " ta (asos qirrasi|yon qirra|asos uchi|cho['ʻ’]qqi|uch|ko['ʻ’]paytuvchi qoladi)", "g"), function (m, n, w) { return n + " " + ({ "asos qirrasi": "base edges", "yon qirra": "lateral edges", "asos uchi": "base vertices", "uch": "vertices", "ko'paytuvchi qoladi": "factors remain" }[w.replace(/[ʻ’]/g, "'")] || "vertices"); }],
    [new RegExp(N + " so['ʻ’]m", "g"), "$1 so'm"],
    [new RegExp(N + " yil\\b", "g"), "$1 years"]
  ];
  var D = {
    "Javob": "Answer", "km/soat": "km/h", "m/soat": "m/h", "Asoslar teng": "The bases are equal", "Asos": "Base", "asos": "base", "asosi": "base", "Krest ko'paytirish": "Cross-multiply",
    "qoldiq": "remainder", "Nollar": "Zeros", "surat": "numerator", "maxraj, kirmaydi": "denominator, excluded", "Oraliqlarda ishora": "Sign on the intervals",
    "Vyet": "Vieta", "Bezu teoremasi": "Remainder theorem", "Yig'indi": "Sum", "Yig'indisi": "Sum", "Qiymatlar": "Values", "Yechim": "Solution",
    "ishora saqlanadi": "the inequality sign stays the same", "tengsizlik ishorasi almashadi": "the inequality sign flips", "Ildizlar": "Roots", "Uchi": "Vertex", "uchi": "vertex",
    "yoki": "or", "Butun sonlar": "Integers", "Soni": "Count", "Kvadratga ko'taramiz": "Square both sides", "Ikki tomonni kvadratga ko'taramiz": "Square both sides",
    "orasida manfiy": "negative between", "tashqarida musbat": "positive outside", "ildizlar orasida manfiy": "negative between the roots", "ildizlar orasida musbat": "positive between the roots",
    "ildizlardan tashqarida musbat": "positive outside the roots", "ildizlardan tashqarida manfiy": "negative outside the roots",
    "Ikki shart birgalikda bajarilishi kerak": "Both conditions must hold", "Kesishma": "Intersection", "kesishma": "intersection",
    "Qo'shish usuli bilan yoki o'rniga qo'yib yechamiz": "Solve by elimination or substitution", "Barcha hollar": "All outcomes", "Barcha holatlar": "All outcomes",
    "Maxraj nolga teng bo'lmaydi": "The denominator cannot be zero", "Maxraj nolga teng bo'lmasligi kerak": "The denominator must not be zero", "Maxraj": "Denominator", "maxraj": "denominator",
    "Jadval qiymati": "Table value", "Jami": "Total", "Jami ulush": "Total share", "Jami sharlar": "Total balls", "Eng kattasi": "The largest", "Eng kichigi": "The smallest",
    "Chegirma": "Discount", "Qiyalik": "Slope", "Umumiy ko'paytuvchi": "Common factor", "Qulay": "Favorable", "Qulay hollar": "Favorable outcomes", "Qulay hollar m": "Favorable outcomes m",
    "Qulay raqamlar": "Favorable digits", "Tashqi burchak": "Exterior angle", "Tashqi burchak teoremasi": "Exterior angle theorem", "Ko'paytuvchilar": "Factors", "Bashorat": "Prediction",
    "Nuqta": "Point", "Surat va maxrajning EKUBi": "GCD of numerator and denominator", "EKUB": "GCD", "EKUK": "LCM", "O'q kesimi": "Axial section", "O'q kesimi kvadrat": "The axial section is a square",
    "Qo'shni burchaklar yig'indisi": "Sum of adjacent angles", "ga teng": "equals", "y ning x bo'yicha o'zgarish tezligi": "the rate of change of y with respect to x",
    "Yangi narx": "New price", "grafik o'ngga a ga siljiydi": "the graph shifts a units right", "b grafik yuqoriga b ga siljiydi": "b the graph shifts b units up",
    "Keltirish formulasi": "Reduction formula", "Keltirish formulasi va chorak ishorasi orqali": "Using the reduction formula and the quadrant sign", "Haqiqiy qismlar": "Real parts",
    "mavhum": "imaginary", "Oshish": "Increase", "sin va cos davri": "period of sin and cos", "tg va ctg davri": "period of tan and cot", "shart bajariladi": "the condition holds",
    "shar diametri": "sphere diameter", "Determinant usuli": "Determinant method", "Yuz eng katta bo'lishi uchun a": "For the maximum area, a",
    "o'suvchi": "increasing", "kamayuvchi": "decreasing", "Tanlanma qancha katta bo'lsa, xatolik chegarasi shuncha kichik bo'ladi": "The larger the sample, the smaller the margin of error",
    "Gipotenuza": "Hypotenuse", "Chiziqli funksiyada yo'nalish k ning ishorasiga bog'liq": "For a linear function the direction depends on the sign of k",
    "Ikkilangan burchak": "Double angle", "Juft": "Even", "juft": "even", "toq": "odd", "pastga": "down", "yuqoriga": "up", "ko'paytma": "product",
    "Ildiz ostida manfiy bo'lmasligi kerak": "The expression under the root must not be negative", "Ildiz ostida": "Under the root", "gerb yoki raqam": "heads or tails",
    "Orasidagi butun sonlar": "Integers in between", "Ikkala koordinata ishorasi o'zgaradi": "Both coordinates change sign", "Ordinata ishorasi o'zgaradi": "The y-coordinate changes sign",
    "Katta doira radiusi": "Great circle radius", "Diametr": "Diameter", "Teng imkonli hodisalar soni n": "Number of equally likely outcomes n", "chorakda musbat": "quadrant: positive",
    "gipotenuzaning yarmi": "half the hypotenuse", "qarshisidagi katet gipotenuzaning yarmiga teng": "the opposite leg equals half the hypotenuse", "O'rin almashtirishlar soni": "Number of permutations",
    "birgalikda emas": "mutually exclusive", "yechimi yo'q": "no solution", "Kub fazoviy diagonali": "Space diagonal of the cube", "daraja": "degree", "ildiz to'g'ri": "the root checks",
    "O'g'il bolalar": "Boys", "Choraklar bo'yicha ishoralar jadvali": "Sign table by quadrant", "Perimetrlar nisbati": "Ratio of perimeters", "Ox ga nisbatan akslanadi": "reflects over the x-axis",
    "cho'ziladi": "stretches", "Mos koordinatalar qo'shiladi": "Add the corresponding coordinates", "Mos koordinatalar ayriladi": "Subtract the corresponding coordinates",
    "Gorner sxemasi": "Synthetic division", "ko'phadni chiziqli ikkihadga bo'lishning tez usuli": "a fast way to divide a polynomial by a linear binomial", "musbat": "positive", "manfiy": "negative",
    "Tasodifiy tanlanma natijasi butun guruhga ko'chiriladi": "A random sample's result generalizes to the whole group", "Yarim perimetr p": "Semi-perimeter p", "Yuqoridan": "From above",
    "balandligi": "height", "Yarim vatar": "Half-chord", "chapga": "left", "o'ngga": "right", "natija": "result", "Faqat tasodifiy tanlanma": "Only a random sample",
    "hamma o'quvchida teng imkoniyat": "every student has an equal chance", "butun maktab haqida xulosa qilishga asos beradi": "allows a conclusion about the whole school",
    "Qolganlari": "The others", "noxolis": "biased", "tanlanma": "sample", "Nuqtalar sonini qo'shamiz": "Add up the number of points", "to'g'ri to'rtburchak": "rectangle",
    "Hamma qiymatga bir xil son qo'shilsa, o'rtacha shu songa siljiydi, tarqoqlik": "Adding the same number to every value shifts the mean by that number; the spread",
    "standart og'ish": "standard deviation", "Standart og'ish": "Standard deviation", "o'zgarmaydi": "does not change", "O'rtadagi": "The middle one", "qiymat yig'ib borilganda": "values accumulated",
    "oraliqqa tushadi": "falls in the interval", "Qo'shamiz": "Add", "Noldan farqli sonning nolinchi darajasi": "Any nonzero number to the power 0", "Birinchi raqam": "First digit",
    "bo'lmaydi": "is not possible", "haqiqiy": "real", "Faqat toq darajalar bor": "Only odd powers", "Faqat juft darajalar va o'zgarmas bor": "Only even powers and a constant",
    "Logarifm ostidagi ifoda": "The expression inside the logarithm", "Yo'nalish faqat a ning ishorasiga bog'liq": "The direction depends only on the sign of a", "Faqat": "Only",
    "d bilan R ni solishtiramiz": "Compare d with R", "kesishmaydi": "do not intersect", "Kesishmaydi": "Do not intersect", "Qo'shish qoidasi": "Addition rule",
    "maxrajda ham turgani uchun nolga teng bo'lmaydi": "it is also in the denominator, so it cannot be zero", "qiymatlar o'rtachadan qanchalik tarqoqligi": "how spread out the values are from the mean",
    "og'ish katta": "the deviation is larger", "Ko'rsatkichli funksiya hamma vaqt musbat, nolga teng bo'lmaydi": "An exponential function is always positive, never zero",
    "Qo'shma sonlar ko'paytmasi": "Product of conjugates", "Asos markazidan tomonigacha masofa": "Distance from the base center to a side", "qirra": "edge",
    "Klassik tengsizlik": "Classic inequality", "tenglik faqat sonlar teng bo'lganda": "equality only when the numbers are equal", "Tomon": "Side", "Yuzlar nisbati k": "Ratio of areas k",
    "aylana diametri": "diameter of the circle", "Diagonallar kesishish nuqtasida teng ikkiga bo'linadi": "The diagonals bisect each other", "Silindr asosi radiusi": "Radius of the cylinder base",
    "Foiz oralig'i": "Percent interval", "Oraliq": "Interval", "xatolik chegarasi": "margin of error", "Kenglik": "Range", "eng katta": "max", "eng kichik": "min",
    "Ichki chizilgan shar kub yoqlariga urinadi": "The inscribed sphere touches the faces of the cube", "diametri": "diameter", "Oy bo'yicha": "Along the y-axis",
    "Uchburchak burchaklari yig'indisi haqidagi teorema": "Triangle angle-sum theorem", "ko'rinishida uchi": "form, vertex", "ikki ichki burchak yig'indisi": "sum of the two remote interior angles",
    "Apofema l": "Slant height l", "Apofema": "Slant height", "Ichki chizilgan shar radiusi R": "Inscribed sphere radius R", "asoslar yig'indisi": "sum of the bases", "yon tomonlar yig'indisi": "sum of the legs",
    "Markaziy burchak": "Central angle", "Oy o'qida x": "On the y-axis x", "Muntazam oltiburchakda R": "In a regular hexagon R", "Har asosda": "On each base",
    "Urinma radiusga perpendikulyar": "A tangent is perpendicular to the radius", "yuqorida": "above", "pastda": "below", "ustida": "on", "Eng ko'p nuqta": "Most points", "Vatar": "Chord",
    "Ichki aylana": "Inscribed circle", "Tartib muhim": "Order matters", "Tartib muhim emas": "Order does not matter", "O'rtacha": "Mean", "Diskriminant": "Discriminant",
    "Ildiz": "Root", "ildiz": "root", "Ildizi": "Root", "ildizi": "root", "Teorema": "Theorem", "Ta'rif": "Definition", "Xulosa": "Corollary", "Aksioma": "Axiom",
    "Pifagor teoremasi": "Pythagorean theorem", "Yuzi": "Area", "Yuz": "Area", "Hajmi": "Volume", "Hajm": "Volume", "Perimetr": "Perimeter", "Radius": "Radius", "Balandlik": "Height",
    "Mediana": "Median", "mediana": "median", "Moda": "Mode", "Kvadrat": "Square", "kvadrat": "square", "Tekshirish": "Check", "Tekshiramiz": "Check", "demak": "so", "Demak": "So",
    "chorak": "quadrant", "A to'plam": "Set A", "B to'plam": "Set B", "A to'plamda qiymatlar o'rtachadan uzoqroq": "In set A the values are farther from the mean",
    "B to'plamda qiymatlar o'rtachadan uzoqroq": "In set B the values are farther from the mean", "Ikkalasi teng": "Both are equal", "Birinchisi": "The first", "Ikkinchisi": "The second",
    "Birinchi so'rov": "The first survey", "Ikkinchi so'rov": "The second survey", "Chiziq ustida": "On the line", "Chiziqdan yuqorida": "Above the line", "Chiziqdan pastda": "Below the line",
    "chiziqdan yuqorida": "above the line", "chiziqdan pastda": "below the line", "chiziq ustida": "on the line", "Oraliqlar": "Intervals", "Har qiymat o'rtachadan": "Each value differs from the mean by", "ga farq qiladi": "", "og'ishlar kvadrati": "squared deviations", "o'rtachasi": "mean"
  };
  var KEYS = Object.keys(D).sort(function (a, b) { return b.length - a.length; });
  var B = "A-Za-zÀ-ÿʻʼ‘’'";
  var RX = KEYS.map(function (k) {
    var e = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['ʻʼ‘’]");
    return [new RegExp("(^|[^" + B + "])" + e + "(?=[^" + B + "]|$)", "g"), D[k]];
  });
  // Tarjimadan keyin ham o'zbekcha qolganmi?
  var UZ = /[a-z]['ʻʼ‘’](?!s\b|t\b|re\b|ll\b|ve\b|d\b)[a-z]|(^|[^A-Za-z])(va|ni|ning|ga|dan|da|bilan|uchun|teng|bo'l\w*|qil\w*|toping|kerak|ta|marta|lik|yo'q|emas|bu|har|ham|esa|deb|keyin|bo'yicha|orqali|olamiz|qilamiz|chiqadi|qo'yamiz|topamiz|tushadi|bo'linadi)(?=[^A-Za-z]|$)/;
  function step(s) {
    var t = String(s);
    RULES.forEach(function (r) { t = t.replace(r[0], r[1]); });
    RX.forEach(function (r) { t = t.replace(r[0], function (m, pre) { return pre + r[1]; }); });
    return t.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
  }
  function steps(arr) {
    var out = [];
    (arr || []).forEach(function (s) { var t = step(s), plain = t.replace(/<[^>]+>/g, " ").replace(/so['ʻ’]m/g, "som"); if (!UZ.test(plain)) out.push(t); });
    return out;
  }

  /* ---- tarjima shabloni yo'q savollar (SAT statistika, birliklar, kompleks sonlar) uchun qoidalar ---- */
  var U = { "soat": "hours", "sm": "cm", "km": "km", "daraja": "degrees", "ball": "points", "kun": "days", "kg": "kg", "dona": "items", "yil": "years", "so'm (ming)": "thousand so'm", "so‘m (ming)": "thousand so'm" };
  var G = { "o'quvchilardan": "students", "haydovchilardan": "drivers", "o'qituvchilardan": "teachers", "sayyohlardan": "tourists", "talabalardan": "university students", "sportchilardan": "athletes", "ishchilardan": "workers", "mijozlardan": "customers" };
  function u(x) { return U[x.replace(/[ʻ’‘]/g, "'")] || x; }
  var A = "['ʻ’‘]";
  var QR = [
    [/^Nuqtali diagrammada qiymatlar: (.+)\. Ma.lumotlar nechta\?$/, function (m, l) { return "A dot plot shows: " + l.replace(/ ta\b/g, "") + ". How many data values are there?"; }],
    [/^Nuqtali diagrammada qiymatlar: (.+)\. Mediana\?$/, function (m, l) { return "A dot plot shows: " + l.replace(/ ta\b/g, "") + ". What is the median?"; }],
    [/^Nuqtali diagrammada qiymatlar: (.+)\. Moda \(eng ko.p uchraydigan qiymat\)\?$/, function (m, l) { return "A dot plot shows: " + l.replace(/ ta\b/g, "") + ". What is the mode (the most frequent value)?"; }],
    [/^Quti diagrammasi: eng kichik = (.+?), (Q1 = .+?), mediana = (.+?), (Q3 = .+?), eng katta = (.+?)\. (.+)$/, function (m, mn, q1, md, q3, mx, ask) {
      var head = "Box plot: min = " + mn + ", " + q1 + ", median = " + md + ", " + q3 + ", max = " + mx + ". ";
      var a = ask.replace(/^Kvartillararo kenglik \(IQR\)\?$/, "Interquartile range (IQR)?").replace(/^Kenglik \(range\)\?$/, "Range?")
        .replace(/^Ma.lumotlarning necha foizi (Q\d) dan kattasi oraliqda\?$/, "What percent of the data is above $1?")
        .replace(/^Ma.lumotlarning necha foizi (Q\d) dan kichigi oraliqda\?$/, "What percent of the data is below $1?")
        .replace(/^Ma.lumotlarning necha foizi eng kichikdan medianagacha oraliqda\?$/, "What percent of the data is between the minimum and the median?")
        .replace(/^Ma.lumotlarning necha foizi (Q\d) dan (Q\d) gacha oraliqda\?$/, "What percent of the data is between $1 and $2?")
        .replace(/^Ma.lumotlarning necha foizi medianadan kattasi oraliqda\?$/, "What percent of the data is above the median?");
      return head + a; }],
    [/^Gistogramma: (.+)\. Ma.lumotlarning necha foizi (\S+) oraliqda\? \(butun songacha yaxlitlang\)$/, function (m, l, r) { return "Histogram: " + l.replace(/ ta\b/g, "") + ". What percent of the data is in the interval " + r + "? (round to the nearest whole number)"; }],
    [/^Gistogramma oraliqlari va chastotalar: (.+)\. Mediana qaysi oraliqda\?$/, function (m, l) { return "Histogram intervals and frequencies: " + l.replace(/ ta\b/g, "") + ". Which interval contains the median?"; }],
    [/^Sochilma diagrammaga eng yaxshi moslik chizig.i (y = .+?) o.tkazilgan \(x — (.+?), y — (.+?)\)\. x = (\S+) bo.lganda y ning bashorat qiymati\?$/, function (m, e, x, y, v) { return "The line of best fit for a scatter plot is " + e + " (x — " + u(x) + ", y — " + u(y) + "). What is the predicted value of y when x = " + v + "?"; }],
    [/^Moslik chizig.i (y = .+?) \(x — (.+?), y — (.+?)\)\. Qiyalik (\S+) nimani bildiradi\?$/, function (m, e, x, y, k) { return "The line of best fit is " + e + " (x — " + u(x) + ", y — " + u(y) + "). What does the slope " + k + " mean?"; }],
    [/^Moslik chizig.i (y = .+?)\. y-kesishma \(x = 0 bo.lgandagi bashorat\) nechaga teng\?$/, "The line of best fit is $1. What is the y-intercept (the prediction when x = 0)?"],
    [/^Moslik chizig.i (y = .+?)\. Diagrammadagi nuqta (\(.+?\))\. Haqiqiy qiymat bashoratdan qanchaga farq qiladi \(qoldiq = haqiqiy − bashorat\)\?$/, "The line of best fit is $1. A point on the plot is $2. By how much does the actual value differ from the prediction (residual = actual − predicted)?"],
    [/^Eng yaxshi moslik chizig.i (\(.+?\)) va (\(.+?\)) nuqtalardan o.tadi\. Chiziqning y-kesishmasi\?$/, "The line of best fit passes through $1 and $2. What is its y-intercept?"],
    [/^Moslik chizig.i (y = .+?)\. (\(.+?\)) nuqta chiziqqa nisbatan qayerda\?$/, "The line of best fit is $1. Where is the point $2 relative to the line?"],
    [/^i\^(\S+) nechaga teng\? \(i — mavhum birlik\)$/, "What is i^$1? (i is the imaginary unit)"],
    [/^(.+) ni hisoblang\.$/, "Calculate $1."],
    [/^(.+) ko.paytmasining mavhum qismi \(i oldidagi koeffitsiyent\)\?$/, "What is the imaginary part of the product $1 (the coefficient of i)?"],
    [/^(.+) ko.paytmasining haqiqiy qismi\?$/, "What is the real part of the product $1?"],
    [/^\|(.+)\| ni toping\.$/, "Find |$1|."],
    [/^(\S+) km\/soat necha m\/s\?$/, "How many m/s is $1 km/h?"], [/^(\S+) m\/s necha km\/soat\?$/, "How many km/h is $1 m/s?"],
    [/^(\S+) km necha metr\?$/, "How many meters is $1 km?"], [/^(\S+) soat necha sekund\?$/, "How many seconds is $1 hours?"],
    [/^(\S+) mm necha metr\? \(kasr bilan\)$/, "How many meters is $1 mm? (as a decimal)"], [/^(\S+) g necha kg\? \(kasr bilan\)$/, "How many kilograms is $1 g? (as a decimal)"],
    [/^Hajmi (.+?) bo.lgan idishga necha litr suv sig.adi\?$/, "How many liters of water fit in a container measuring $1?"],
    [/^(\S+ m × \S+ m) xonaning yuzi necha sm²\?$/, "What is the area of a $1 room in cm²?"],
    [/^Masshtab (\S+)\. Xaritada (\S+) sm — haqiqatda necha metr\?$/, "The scale is $1. How many meters in reality is $2 cm on the map?"],
    [/^(\S+) kWh necha kJ\?$/, "How many kJ is $1 kWh?"],
    [/^Haqiqiy qiymat (\S+), o.lchangan (\S+)\. Nisbiy xatolik \(%\)\? \(yaxlitlang\)$/, "The actual value is $1 and the measured value is $2. What is the relative error (%)? (round)"],
    [/^Maktab o.quvchilarining o.rtacha uyqu vaqtini aniqlash uchun qaysi tanlanma usuli natijani butun maktabga ko.chirishga imkon beradi\?$/, "To estimate the average sleep time of a school's students, which sampling method lets you generalize the result to the whole school?"],
    [/^(A = \{.+?\}) va (B = \{.+?\}) to.plamlarining o.rta qiymati teng\. Qaysi to.plamning standart og.ishi katta\?$/, "Data sets $1 and $2 have the same mean. Which set has the larger standard deviation?"],
    [/^Shahardagi (\S+) nafar (\S+) tasodifiy (\S+) nafari so.rovda qatnashdi; ularning (\S+)% i "ha" dedi\. Butun guruhda taxminan nechta kishi "ha" deydi\?$/, function (m, n, g, k, p) { return "In a city of " + n + " " + (G[g.replace(/[ʻ’‘]/g, "'")] || "people") + ", " + k + " were randomly surveyed; " + p + "% of them said \"yes\". About how many in the whole group would say \"yes\"?"; }],
    [/^So.rov natijasi: (\S+)% ± (\S+)% \(xatolik chegarasi\)\. Haqiqiy foiz qaysi oraliqda bo.lishi kutiladi\?$/, "A survey result is $1% ± $2% (margin of error). In what interval is the true percentage expected to be?"],
    [/^Ikki so.rov o.tkazildi: birinchisida (\S+) kishi, ikkinchisida (\S+) kishi \(ikkalasi ham tasodifiy\)\. Qaysi so.rovning xatolik chegarasi kichikroq\?$/, "Two random surveys were done: the first with $1 people, the second with $2 people. Which survey has the smaller margin of error?"],
    [/^(\{.+?\}) to.plamning standart og.ishini toping\.$/, "Find the standard deviation of the data set $1."],
    [/^B to.plam A to.plamning har bir qiymatiga (\S+) qo.shib hosil qilingan: (A = \{.+?\}), (B = \{.+?\})\. Qaysi tasdiq to.g.ri\?$/, "Set B is formed by adding $1 to every value of set A: $2, $3. Which statement is true?"],
    [/^(\S+) kishilik shaharda tasodifiy so.rov: (\S+)% ± (\S+)% kishi velosiped haydaydi\. Velosiped haydaydiganlar soni qaysi oraliqda bo.lishi kutiladi\?$/, "In a city of $1 people, a random survey shows $2% ± $3% ride a bicycle. In what range is the number of cyclists expected to be?"]
  ];
  function question(q) {
    var t = String(q).replace(/\s+/g, " ").trim();
    for (var i = 0; i < QR.length; i++) if (QR[i][0].test(t)) return t.replace(QR[i][0], QR[i][1]);
    return null;
  }
  window.KA_SAVOL_EN = { question: question, step: step, steps: steps, hasUz: function (s) { return UZ.test(String(s).replace(/<[^>]+>/g, " ").replace(/so['ʻ’]m/g, "som")); } };
})();
