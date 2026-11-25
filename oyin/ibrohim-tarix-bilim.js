/* Ibrohim tarix — 6-bo‘lim: Umumiy bilim (bayroq, poytaxt, pul, o‘simlik, ixtiro, bino, avtomobil, texnika, hayvon, meva, poliz) */
window.IT_DATA = window.IT_DATA || [];
(function(){
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.random()*(i+1)|0,t=a[i];a[i]=a[j];a[j]=t}return a}
function uniq(a){var s={},o=[];a.forEach(function(x){if(!s[x]){s[x]=1;o.push(x)}});return o}
/* to‘g‘ri javob + boshqa ro‘yxatdan 3 ta farqli chalg‘ituvchi */
function mc(q,right,pool,extra){var d=sh(uniq(pool).filter(function(x){return x!==right})).slice(0,3);var o={t:"m",q:q,a:[right].concat(d),e:extra||""};return o}
var W=[-14,128,-4,62];

/* [nom, kod, poytaxt, pul, qit’a] */
var C=[["O‘zbekiston","uz","Toshkent","so‘m","Osiyo"],["Qozog‘iston","kz","Astana","tenge","Osiyo"],["Qirg‘iziston","kg","Bishkek","som","Osiyo"],["Tojikiston","tj","Dushanbe","somoniy","Osiyo"],["Turkmaniston","tm","Ashxobod","manat","Osiyo"],["Afg‘oniston","af","Kobul","afg‘oni","Osiyo"],["Rossiya","ru","Moskva","rubl","Yevropa"],["Xitoy","cn","Pekin","yuan","Osiyo"],["Yaponiya","jp","Tokio","iyena","Osiyo"],["Janubiy Koreya","kr","Seul","von","Osiyo"],["Hindiston","in","Nyu-Dehli","rupiya","Osiyo"],["Pokiston","pk","Islomobod","rupiya","Osiyo"],["Turkiya","tr","Anqara","lira","Osiyo"],["Eron","ir","Tehron","rial","Osiyo"],["Saudiya Arabistoni","sa","Ar-Riyod","riyol","Osiyo"],["BAA","ae","Abu-Dabi","dirham","Osiyo"],["Misr","eg","Qohira","Misr funti","Afrika"],["AQSh","us","Vashington","AQSh dollari","Amerika"],["Kanada","ca","Ottava","Kanada dollari","Amerika"],["Braziliya","br","Braziliya","real","Amerika"],["Argentina","ar","Buenos-Ayres","peso","Amerika"],["Meksika","mx","Mexiko","peso","Amerika"],["Buyuk Britaniya","gb","London","funt sterling","Yevropa"],["Fransiya","fr","Parij","yevro","Yevropa"],["Germaniya","de","Berlin","yevro","Yevropa"],["Italiya","it","Rim","yevro","Yevropa"],["Ispaniya","es","Madrid","yevro","Yevropa"],["Ukraina","ua","Kiyev","grivna","Yevropa"],["Avstraliya","au","Kanberra","Avstraliya dollari","Okeaniya"],["Indoneziya","id","Jakarta","rupiya","Osiyo"],["Malayziya","my","Kuala-Lumpur","ringgit","Osiyo"],["Shveytsariya","ch","Bern","frank","Yevropa"],["Gretsiya","gr","Afina","yevro","Yevropa"],["Nigeriya","ng","Abuja","nayra","Afrika"],["Janubiy Afrika","za","Pretoriya","rand","Afrika"],["Ozarbayjon","az","Boku","manat","Osiyo"],["Gruziya","ge","Tbilisi","lari","Osiyo"],["Polsha","pl","Varshava","zlotiy","Yevropa"],["Mo‘g‘uliston","mn","Ulan-Bator","tugrik","Osiyo"],["Vetnam","vn","Hanoy","dong","Osiyo"],["Tailand","th","Bangkok","bat","Osiyo"],["Norvegiya","no","Oslo","krona","Yevropa"],["Kuba","cu","Gavana","peso","Amerika"]];
function same(c){var s=C.filter(function(x){return x[4]===c[4]&&x!==c});return s.length>=3?s:C}
var flagQ=[],capQ=[],curQ=[];
C.forEach(function(c){
 var pool=same(c);
 flagQ.push(mc("Bu qaysi davlatning bayrog‘i?",c[0],pool.map(function(x){return x[0]})));flagQ[flagQ.length-1].img="https://flagcdn.com/w320/"+c[1]+".png";flagQ[flagQ.length-1].e=c[0]+" bayrog‘i. Poytaxti — "+c[2]+".";
 capQ.push(mc(c[0]+"ning poytaxti qaysi shahar?",c[2],pool.map(function(x){return x[2]}),c[0]+" poytaxti — "+c[2]+"."));
 var cur=C.filter(function(x){return x[3]!==c[3]}).map(function(x){return x[3]});
 curQ.push(mc(c[0]+"ning pul birligi?",c[3],cur,c[0]+" — "+c[3]+"."));
});
/* teskari: poytaxt → davlat, bayroqdan davlatni topish (O‘rta Osiyo) */
["Toshkent","Astana","Bishkek","Dushanbe","Ashxobod","Tokio","Ottava","Kanberra","Bern","Abuja"].forEach(function(cap){var c=C.find(function(x){return x[2]===cap});capQ.push(mc("«"+cap+"» qaysi davlatning poytaxti?",c[0],same(c).map(function(x){return x[0]}),cap+" — "+c[0]+" poytaxti."))});
capQ.push({t:"tf",q:"Avstraliyaning poytaxti — Sidney.",a:false,e:"Yo‘q! Eng katta shahar Sidney, lekin poytaxt — Kanberra. Eng katta shahar har doim ham poytaxt bo‘lmaydi."});
capQ.push({t:"tf",q:"Turkiyaning poytaxti — Istanbul.",a:false,e:"Poytaxt — Anqara. Istanbul — eng yirik shahar (qadimgi Vizantiy/Konstantinopol)."});
capQ.push({t:"tf",q:"Kanadaning poytaxti — Toronto.",a:false,e:"Poytaxt — Ottava."});
capQ.push({t:"f",q:"🧠 Nega ba’zi davlatlar poytaxt uchun eng katta shaharni emas, boshqa shaharni tanlagan (Kanberra, Ottava, Astana)?",e:"Mezon: viloyatlar o‘rtasidagi murosa, markaziy joylashuv, yangi qurilish, xavfsizlik."});
curQ.push({t:"m",q:"Qaysi pul birligi bir nechta Yevropa davlatlarida umumiy?",a:["Yevro","Funt sterling","Rubl","Frank"],e:"Yevro — Germaniya, Fransiya, Italiya, Ispaniya, Gretsiya va boshqalarda."});
curQ.push({t:"m",q:"Qadimgi Ahamoniylar oltin tangasi qanday atalgan? (tarix bilan bog‘lang!)",a:["Darik","So‘m","Dirham","Tenge"],e:"Doro I joriy qilgan."});
curQ.push({t:"tf",q:"«Dollar» nomli pul birligi faqat AQShda bor.",a:false,e:"Kanada, Avstraliya va boshqa davlatlarda ham dollar bor — lekin qiymati har xil."});
curQ.push({t:"m",q:"O‘zbekiston so‘mi qachon muomalaga kiritilgan?",a:["1994-yil","1991-yil","2000-yil","1980-yil"],e:"Milliy valyuta — so‘m 1994-yil 1-iyuldan to‘liq muomalada."});

/* o‘simliklar vatani */
var PL=[["Kartoshka","🥔","Janubiy Amerika"],["Pomidor","🍅","Janubiy Amerika"],["Makkajo‘xori","🌽","Markaziy Amerika"],["Kakao","🍫","Markaziy Amerika"],["Kofe","☕","Afrika (Efiopiya)"],["Choy","🍵","Xitoy"],["Sholi","🍚","Janubi-Sharqiy Osiyo"],["Bug‘doy","🌾","Old Osiyo (Mesopotamiya)"],["Banan","🍌","Janubi-Sharqiy Osiyo"],["Apelsin","🍊","Xitoy"],["Olma","🍎","O‘rta Osiyo"],["Tarvuz","🍉","Afrika"],["Ananas","🍍","Janubiy Amerika"],["Kungaboqar","🌻","Shimoliy Amerika"],["Achchiq qalampir","🌶️","Markaziy Amerika"],["Sabzi","🥕","O‘rta Osiyo"],["Piyoz","🧅","O‘rta Osiyo"],["Shaftoli","🍑","Xitoy"],["Limon","🍋","Hindiston"],["Mango","🥭","Hindiston"],["Zaytun","🫒","O‘rta Yer dengizi"],["Qovoq","🎃","Markaziy Amerika"],["Bodring","🥒","Hindiston"],["Avokado","🥑","Markaziy Amerika"],["Yeryong‘oq","🥜","Janubiy Amerika"],["Kivi","🥝","Xitoy"],["Baqlajon","🍆","Hindiston"],["Paxta","☁️","Hindiston"],["Tut (ipak qurti uchun)","🌳","Xitoy"]];
var HOME=uniq(PL.map(function(p){return p[2]}));
var plQ=PL.map(function(p){return mc(p[1]+" "+p[0]+"ning vatani qayer?",p[2],HOME,p[0]+" — "+p[2]+"dan tarqalgan.")});
plQ.push({t:"tf",q:"Kartoshka va pomidor Yevropaga Amerika kashf etilgandan keyin keltirilgan.",a:true,e:"1492-yildan keyin — Amerika o‘simliklari butun dunyoga tarqaldi."});
plQ.push({t:"tf",q:"Kivining vatani — Yangi Zelandiya.",a:false,e:"Kivining vatani — Xitoy. Yangi Zelandiya uni mashhur qilgan va nomini bergan."});
plQ.push({t:"m",q:"Olmaning yovvoyi ajdodi o‘sadigan, nomi ham olma bilan bog‘liq shahar?",a:["Olmaota","Olmaliq","Toshkent","Samarqand"],e:"Olmaning vatani — O‘rta Osiyo tog‘lari (Tyanshan)."});
plQ.push({t:"m",q:"Xitoyga beda va uzum qayerdan keltirilgan? (tarix!)",a:["Davan (Farg‘ona)","Misr","Rim","Hindiston"],e:"Elchi Chjan Szyan urug‘ olib borgan."});

/* ixtirolar vatani */
var IX=[["Qog‘oz","Xitoy"],["Kompas","Xitoy"],["Porox","Xitoy"],["Seysmograf","Xitoy"],["Shaxmat","Hindiston"],["Nol raqami (o‘nlik sanoq)","Hindiston"],["Algebra fani (al-Xorazmiy)","O‘rta Osiyo"],["Elektron televizor (Grabovskiy, 1928)","O‘zbekiston (Toshkent)"],["Telefon (A. Bell)","AQSh"],["Elektr lampochka (Edison)","AQSh"],["Samolyot (aka-uka Raytlar)","AQSh"],["Benzinli avtomobil (K. Bens)","Germaniya"],["Kitob bosish dastgohi (Gutenberg)","Germaniya"],["Dinamit (A. Nobel)","Shvetsiya"],["Penitsillin (Fleming)","Buyuk Britaniya"],["Bug‘ mashinasi (J. Uatt)","Buyuk Britaniya"],["Mixxat yozuvi","Shumer (Mesopotamiya)"],["22 harfli alifbo","Finikiya"],["Beton","Qadimgi Rim"],["Olimpiya o‘yinlari","Qadimgi Yunoniston"],["365 kunlik taqvim","Qadimgi Misr"],["Iyerogliflar va papirus","Qadimgi Misr"]];
var IXP=uniq(IX.map(function(x){return x[1]}));
var ixQ=IX.map(function(x){return mc("💡 "+x[0]+" qayerda ixtiro qilingan?",x[1],IXP,x[0]+" — "+x[1]+".")});
ixQ.push({t:"m",q:"Dunyoda birinchi elektron televizor tasvirini 1928-yilda qaysi shaharda ko‘rsatishgan?",a:["Toshkent","Moskva","London","Nyu-York"],e:"Boris Grabovskiy Toshkentda «Telefot» qurilmasini sinagan. Yurtimiz bilan faxrlanamiz!"});
ixQ.push({t:"m",q:"«Algoritm» so‘zi qaysi olim nomidan kelib chiqqan?",a:["Al-Xorazmiy","Arximed","Demokrit","Edison"],e:"Al-Xorazmiy nomi lotincha «Algoritmi» deb yozilgan."});
ixQ.push({t:"o",q:"Ixtirolarni paydo bo‘lish tartibida joylang:",a:["Mixxat yozuvi","Qog‘oz","Kitob bosish dastgohi","Telefon"],e:"Shumer → Xitoy (mil. avv. I asr) → Gutenberg (XV asr) → Bell (1876)."});

/* eng baland binolar */
var BL=[["Burj Xalifa","Dubay (BAA)",828],["Merdeka 118","Kuala-Lumpur (Malayziya)",679],["Shanxay minorasi","Shanxay (Xitoy)",632],["Abroj al-Bayt (Soat minorasi)","Makka (Saudiya Arabistoni)",601],["Lotte World Tower","Seul (Janubiy Koreya)",555],["One World Trade Center","Nyu-York (AQSh)",541],["Taypey 101","Taypey (Tayvan)",508],["Toshkent teleminorasi","Toshkent (O‘zbekiston)",375],["Eyfel minorasi","Parij (Fransiya)",330]];
var BP=BL.map(function(b){return b[1]});
var blQ=BL.map(function(b){return mc("🏙️ «"+b[0]+"» qayerda joylashgan?",b[1],BP,b[0]+" — "+b[1]+", balandligi taxminan "+b[2]+" m.")});
blQ.push({t:"m",q:"Dunyodagi eng baland bino?",a:["Burj Xalifa (828 m)","Shanxay minorasi","Taypey 101","Eyfel minorasi"],e:"Dubayda, 2010-yilda qurib bitkazilgan."});
blQ.push({t:"o",q:"Balandligi bo‘yicha pastdan balandga tartiblang:",a:["Eyfel minorasi","Toshkent teleminorasi","Taypey 101","Burj Xalifa"],e:"330 → 375 → 508 → 828 m."});
blQ.push({t:"m",q:"Burj Xalifa Xufu piramidasidan (147 m) taxminan necha marta baland?",a:["5–6 marta","2 marta","10 marta","20 marta"],e:"828 : 147 ≈ 5,6. Tarix + matematika!"});
blQ.push({t:"tf",q:"Toshkent teleminorasi Markaziy Osiyodagi eng baland inshootdir.",a:true,e:"375 m, 1985-yilda qurilgan."});
blQ.push({t:"f",q:"🧠 Nega osmono‘par binolar ko‘pincha yer qimmat bo‘lgan katta shaharlarda quriladi?",e:"Mezon: yer kam va qimmat → yuqoriga qurish arzonroq; obro‘ va turizm."});

/* avtomobillar */
var AV=[["Toyota","Yaponiya"],["Honda","Yaponiya"],["Nissan","Yaponiya"],["Hyundai","Janubiy Koreya"],["Kia","Janubiy Koreya"],["Chevrolet","AQSh"],["Ford","AQSh"],["Tesla","AQSh"],["BMW","Germaniya"],["Mercedes-Benz","Germaniya"],["Audi","Germaniya"],["Volkswagen","Germaniya"],["Porsche","Germaniya"],["Ferrari","Italiya"],["Lamborghini","Italiya"],["Fiat","Italiya"],["Renault","Fransiya"],["Peugeot","Fransiya"],["Volvo","Shvetsiya"],["Lada","Rossiya"],["BYD","Xitoy"],["Chery","Xitoy"],["Geely","Xitoy"],["Skoda","Chexiya"],["Rolls-Royce","Buyuk Britaniya"]];
var AP=uniq(AV.map(function(a){return a[1]}));
var avQ=AV.map(function(a){return mc("🚗 «"+a[0]+"» avtomobil brendining vatani?",a[1],AP,a[0]+" — "+a[1]+" brendi.")});
avQ.push({t:"m",q:"O‘zbekistonda Chevrolet avtomobillari qaysi shaharda ishlab chiqariladi?",a:["Asaka","Nukus","Termiz","Navoiy"],e:"UzAuto Motors zavodi — Andijon viloyati, Asaka shahri."});
avQ.push({t:"m",q:"Jizzaxda qaysi brendning elektromobil zavodi ochilgan?",a:["BYD","Tesla","Toyota","BMW"],e:"BYD Uzbekistan zavodi — Jizzax."});
avQ.push({t:"m",q:"Birinchi benzinli avtomobilni kim yaratgan?",a:["Karl Bens (Germaniya, 1886)","Genri Ford","Ilon Mask","Tomas Edison"],e:"Ford esa avtomobilni konveyerda ommaviy ishlab chiqarishni yo‘lga qo‘ygan."});
avQ.push({t:"tf",q:"Tesla avtomobillari benzin bilan yuradi.",a:false,e:"Tesla — elektromobil, akkumulyator bilan yuradi."});
avQ.push({t:"m",q:"Ortiqchasini toping (Germaniya brendlari):",a:["Toyota","BMW","Audi","Porsche"],e:"Toyota — Yaponiya."});

/* texnikalar */
var TX=[["Ekskavator","cho‘mich bilan yer qazish"],["Buldozer","tuproqni surish va yerni tekislash"],["Avtokran","og‘ir yuklarni yuqoriga ko‘tarish"],["Traktor","dalani haydash va tirkama tortish"],["Kombayn","g‘allani o‘rish va yanchish"],["Katok","asfaltni zichlab tekislash"],["Samosval","qum-tuproqni tashib, o‘zi to‘kish"],["Betonqorgich (mikser)","betonni aralashtirib tashish"],["Pogruzchik (forklift)","omborda yukni ko‘tarib joylash"],["Greyder","yo‘l yuzasini profillab tekislash"]];
var TP=TX.map(function(t){return t[1]});var TN=TX.map(function(t){return t[0]});
var txQ=[];TX.forEach(function(t){txQ.push(mc("🚜 «"+t[0]+"» nima ish qiladi?",t[1],TP,t[0]+" — "+t[1]+"."));txQ.push(mc("Qaysi texnika "+t[1]+" uchun ishlatiladi?",t[0],TN,""))});
txQ.push({t:"m",q:"Ekskavator yerni qazadigan ishchi qismi nima deyiladi?",a:["Cho‘mich (kovsh)","G‘ildirak","Kabina","Fara"],e:"Cho‘mich strela (uzun qo‘l) uchiga o‘rnatilgan."});
txQ.push({t:"m",q:"Nega ko‘p ekskavator va buldozerlar g‘ildirak o‘rniga gusenitsa (zanjir) bilan yuradi?",a:["Og‘irlik katta yuzaga taqsimlanib, yumshoq yerga botmaydi","Tezroq yurish uchun","Chiroyli bo‘lgani uchun","Benzin tejash uchun"],e:"Bosim = kuch : yuza. Yuza katta → bosim kam → botmaydi. Fizika!"});
txQ.push({t:"o",q:"Bino qurilishida texnikalar ishlash tartibini joylang:",a:["Buldozer — joyni tekislaydi","Ekskavator — poydevor chuqurini qazadi","Betonqorgich — beton keltiradi","Avtokran — panellarni ko‘taradi"],e:"Avval yer tayyorlanadi, keyin poydevor, keyin devor ko‘tariladi."});
txQ.push({t:"tf",q:"Kombayn — qurilish texnikasi.",a:false,e:"Kombayn — qishloq xo‘jaligi texnikasi (g‘alla o‘radi)."});

/* hayvonlar */
var HV=[["🐪","Tuya","«Cho‘l kemasi» — suvsizlikka chidamli"],["🐘","Fil","eng katta quruqlik hayvoni"],["🦒","Jirafa","eng baland hayvon"],["🐆","Gepard","eng tez yuguradigan hayvon (~110 km/soat)"],["🐋","Kit","eng katta hayvon (ko‘k kit)"],["🦘","Kenguru","bolasini xaltasida olib yuradi, Avstraliyada"],["🐼","Panda","bambuk yeydi, Xitoyda yashaydi"],["🐧","Pingvin","uchmaydigan qush, Antarktidada"],["🦉","Boyo‘g‘li","tunda ov qiladi"],["🐝","Asalari","asal va mum beradi, gullarni changlatadi"],["🐬","Delfin","sutemizuvchi, o‘pka bilan nafas oladi"],["🦇","Ko‘rshapalak","uchadigan sutemizuvchi, tovush bilan «ko‘radi»"],["🐢","Toshbaqa","uzoq yashaydi, kosasi bor"],["🦅","Burgut","o‘tkir ko‘zli yirtqich qush"],["🐻","Ayiq","qishda uyquga ketadi"],["🦓","Zebra","yo‘l-yo‘l terisi bor, Afrikada"]];
var HN=HV.map(function(h){return h[1]}),HF=HV.map(function(h){return h[2]});
var hvQ=[];HV.forEach(function(h){hvQ.push(mc("Rasmdagi hayvon: "+h[0]+" — bu kim?",h[1],HN,h[1]+" — "+h[2]+"."));hvQ.push(mc("Qaysi hayvon: «"+h[2]+"»?",h[1],HN,""))});
hvQ.push({t:"tf",q:"Delfin — baliq.",a:false,e:"Delfin — sutemizuvchi: bolasini sut bilan boqadi, havodan nafas oladi."});
hvQ.push({t:"m",q:"Ortiqchasini toping (sutemizuvchilar):",a:["Pingvin","Kit","Ko‘rshapalak","Delfin"],e:"Pingvin — qush. Kit, delfin, ko‘rshapalak — sutemizuvchi."});
hvQ.push({t:"m",q:"Qadimgi odam birinchi xonakilashtirgan hayvon? (tarix!)",a:["It","Mushuk","Ot","Tuya"],e:"Mezolit davrida."});
hvQ.push({t:"m",q:"O‘zbekiston gerbidagi afsonaviy qush?",a:["Xumo","Burgut","Lochin","Qaldirg‘och"],e:"Xumo qushi — baxt va erkinlik ramzi."});

/* mevalar */
var MV=[["🍎","Olma"],["🍐","Nok"],["🍑","Shaftoli"],["🍒","Olcha"],["🍇","Uzum"],["🍓","Qulupnay"],["🍋","Limon"],["🍊","Apelsin"],["🍌","Banan"],["🍍","Ananas"],["🥭","Mango"],["🥝","Kivi"],["🥥","Kokos"]];
var MN=MV.map(function(m){return m[1]});
var mvQ=MV.map(function(m){return mc("Bu qanday meva: "+m[0]+" ?",m[1],MN,"")});
mvQ.push({t:"m",q:"Qaysi meva C vitaminiga juda boy va nordon?",a:["Limon","Banan","Nok","Uzum"],e:"Shu sababli shamollaganda limonli choy ichiladi."});
mvQ.push({t:"m",q:"Ortiqchasini toping (bu meva emas):",a:["Kartoshka","Olma","O‘rik","Anor"],e:"Kartoshka — sabzavot (ildizmeva)."});
mvQ.push({t:"m",q:"Mayiz qaysi mevadan tayyorlanadi?",a:["Uzum","O‘rik","Olcha","Olma"],e:"O‘rik quritilsa — turshak, qoqi; olcha — qoqi."});
mvQ.push({t:"m",q:"Turshak qaysi mevadan tayyorlanadi?",a:["O‘rik","Uzum","Nok","Shaftoli"],e:"Danagi bilan quritilgan o‘rik."});
mvQ.push({t:"m",q:"Qaysi biri uzum navi?",a:["Husayni","Bo‘rikalla","Gulobi","Mirzacho‘l"],e:"Husayni, Rizamat, Kishmish — uzum navlari; qolganlari qovun navlari."});
mvQ.push({t:"tf",q:"Banan daraxtda emas, ulkan o‘tsimon o‘simlikda o‘sadi.",a:true,e:"Banan «daraxti» aslida yirik o‘t — poyasi yog‘ochlashmaydi."});

/* poliz */
var PZ=[{t:"m",q:"Qaysi biri poliz ekini?",a:["Qovun","Olma","Bug‘doy","Paxta"],e:"Poliz ekinlari: qovun, tarvuz, qovoq."},
{t:"m",q:"Ortiqchasini toping (poliz ekinlari):",a:["Kartoshka","Qovun","Tarvuz","Qovoq"],e:"Kartoshka — sabzavot ekini."},
{t:"m",q:"Rasmdagi: 🍉 — bu nima?",a:["Tarvuz","Qovun","Qovoq","Bodring"],e:"Tarvuzning vatani — Afrika."},
{t:"m",q:"Rasmdagi: 🍈 — bu nima?",a:["Qovun","Tarvuz","Limon","Nok"],e:"O‘zbek qovuni dunyoga mashhur."},
{t:"m",q:"Rasmdagi: 🎃 — bu nima?",a:["Qovoq","Apelsin","Tarvuz","Pomidor"],e:"Qovoqning vatani — Amerika."},
{t:"m",q:"Qaysi biri o‘zbek qovun navi?",a:["Bo‘rikalla","Husayni","Rizamat","Kishmish"],e:"Bo‘rikalla, Gulobi, Ich-qizil, Amiri, Shakarpalak — qovun navlari."},
{t:"m",q:"Qaysi viloyat qovuni bilan ayniqsa mashhur?",a:["Sirdaryo (Mirzacho‘l)","Andijon","Navoiy","Toshkent"],e:"Mirzacho‘l qovuni — shirinligi bilan mashhur."},
{t:"m",q:"Tarvuzning taxminan necha foizi suv?",a:["90% dan ortig‘i","50%","20%","10%"],e:"Shuning uchun yozda chanqoqni yaxshi qondiradi."},
{t:"m",q:"Qishga saqlanadigan, kech pishadigan qovunlar nega kuzda uzilib osib qo‘yiladi?",a:["Havoda turib, chirimay uzoq saqlanadi va shirasi yetiladi","Chiroyli bo‘lishi uchun","Qushlardan qo‘rqib","Qurib qolishi uchun"],e:"Qadimdan xalq ixtirosi — Buxoroda qovun qishgacha saqlangan."},
{t:"tf",q:"Qovoq poliz ekinlariga kiradi.",a:true,e:"Qovun, tarvuz, qovoq — poliz ekinlari."},
{t:"tf",q:"Bodring poliz ekini emas, u faqat meva.",a:false,e:"Bodring — qovoqdoshlar oilasidan, sabzavot. Meva emas."},
{t:"f",q:"🧠 Nega O‘zbekiston qovunlari juda shirin? Iqlim bilan bog‘lab tushuntiring.",e:"Mezon: quyoshli kunlar ko‘p, issiq yoz, kunduz-kecha harorat farqi katta, sug‘orish — qand ko‘p to‘planadi."}];

function T(id,t,q,x,map,g){return{id:id,n:"★",t:t,b:6,q:q,x:x,map:map||{v:W,r:[],m:[]},g:g}}
IT_DATA.push(
T("b1","Davlat bayroqlari",flagQ,{w:"Butun dunyo davlatlari.",q:"Bayroq — davlatning rasmiy ramzi.",k:"Har bir davlat o‘z bayrog‘ini qonun bilan belgilaydi.",n:"Bayroq rangi va belgisi tarix, din va tabiatni bildiradi (masalan, O‘zbekiston: ko‘k — osmon, oq — tinchlik, yashil — tabiat, 12 yulduz).",r:"Bayroqni bilish — dunyo xaritasini bilish."},{v:W,r:[],m:[["Toshkent",69.24,41.3],["Pekin",116.4,39.9],["Parij",2.35,48.85],["Qohira",31.24,30.04]]}),
T("b2","Poytaxtlar",capQ,{w:"Har davlatning bosh shahri.",q:"Poytaxt ba’zan o‘zgaradi (Qozog‘iston: Olmaota → Astana).",k:"Hukumat, parlament joylashgan shahar.",n:"Poytaxt — siyosiy markaz, har doim ham eng katta shahar emas.",r:"Xaritada poytaxtlarni topib o‘rganing."},{v:W,r:[],m:[["Toshkent",69.24,41.3],["Astana",71.45,51.17],["Bishkek",74.6,42.87],["Dushanbe",68.78,38.56],["Ashxobod",58.38,37.95],["Moskva",37.62,55.75],["Anqara",32.86,39.93]]}),
T("b3","Pul birliklari",curQ,{w:"Har davlatda o‘z puli.",q:"Ilk tangalar O‘rta Osiyoda mil. avv. V–IV asrlarda tarqalgan.",k:"Markaziy bank pulni chiqaradi.",n:"Yagona pul savdoni osonlashtiradi (Doro I «darik»i).",r:"So‘m, tenge, som, somoniy, manat — qo‘shnilar puli."}),
T("b4","O‘simliklar vatani",plQ,{w:"Har o‘simlik bir joyda paydo bo‘lib, savdo yo‘llari orqali tarqalgan.",q:"Amerika o‘simliklari — 1492-yildan keyin dunyoga tarqaldi.",k:"Savdogarlar, elchilar (Chjan Szyan), dehqonlar.",n:"Odamlar foydali o‘simliklarni o‘zi bilan olib yurgan.",r:"Bugun dasturxonimizdagi kartoshka, pomidor Amerikadan kelgan!"},{v:W,r:[],m:[["O‘rta Osiyo (olma, sabzi, piyoz)",68,41],["Xitoy (choy, shaftoli)",110,33],["Hindiston (mango, bodring)",78,22],["Efiopiya (kofe)",39,9]]}),
T("b5","Ixtirolar vatani",ixQ,{w:"Xitoy, Hindiston, O‘rta Osiyo, Yevropa, Amerika.",q:"Qadimgi davrdan bugungacha.",k:"Al-Xorazmiy, Gutenberg, Edison, Grabovskiy va boshqalar.",n:"Har ixtiro ehtiyojdan tug‘iladi.",r:"Ixtirolar butun insoniyatga xizmat qiladi."},{v:W,r:[],m:[["Toshkent (televizor, 1928)",69.24,41.3],["Xorazm (al-Xorazmiy)",60.6,41.5],["Xitoy (qog‘oz, kompas)",110,33]]}),
T("b6","Eng baland binolar",blQ,{w:"Dubay, Kuala-Lumpur, Shanxay, Makka, Seul, Nyu-York, Taypey, Toshkent, Parij.",q:"XX–XXI asrlar.",k:"Muhandis va me’morlar.",n:"Yer kam va qimmat — yuqoriga qurish foydali; obro‘ ramzi.",r:"Burj Xalifa — 828 m."},{v:[-10,128,-4,58],r:[],m:[["Burj Xalifa (Dubay)",55.27,25.2],["Shanxay minorasi",121.5,31.23],["Merdeka 118",101.7,3.14],["Toshkent teleminorasi",69.29,41.35],["Eyfel minorasi",2.29,48.86]]}),
T("b7","Avtomobillar",avQ,{w:"Yaponiya, Koreya, Germaniya, AQSh, Italiya, Xitoy, O‘zbekiston (Asaka, Jizzax).",q:"1886 — birinchi benzinli avtomobil.",k:"Karl Bens, Genri Ford.",n:"Tez va qulay harakat ehtiyoji.",r:"Bugun elektromobillar davri boshlandi."},{v:W,r:[],m:[["Asaka (UzAuto)",72.24,40.64],["Jizzax (BYD)",67.84,40.12],["Shtutgart (Mercedes)",9.18,48.78]]}),
T("b8","Ekskavator va texnikalar",txQ,{w:"Qurilish maydoni, dala, yo‘l, ombor.",q:"XIX–XX asrlardan.",k:"Muhandislar, mexanizatorlar.",n:"Og‘ir ishni mashina tez va xavfsiz bajaradi.",r:"Har texnika o‘z ishiga moslashtirilgan."}),
T("b9","Hayvonlar",hvQ,{w:"Butun dunyo: cho‘l, okean, Antarktida, Avstraliya.",q:"—",k:"Zoologlar hayvonlarni o‘rganadi.",n:"Har hayvon yashash joyiga moslashgan (tuya — cho‘lga, pingvin — sovuqqa).",r:"Tabiatni asrash — hayvonlarni asrash."}),
T("b10","Mevalar",mvQ,{w:"O‘zbekiston — meva diyori.",q:"—",k:"Bog‘bonlar.",n:"Mevalar — vitamin manbai.",r:"Uzum, o‘rik, anor — yurtimiz faxri."}),
T("b11","Poliz ekinlari",PZ,{w:"Mirzacho‘l, Xorazm, Buxoro.",q:"Yoz — kuz.",k:"Polizchilar.",n:"Issiq quyoshli iqlim qovunni shirin qiladi.",r:"O‘zbek qovuni dunyoga mashhur."})
);
})();
