/*! Kuvonch Academy — 80–84: chizilgan shakllar, jismlar kombinatsiyasi, Dekart koordinatalari, vektorlar */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, nearW = H.nearW, G = {};
  function uniq(a){var s={},o=[];a.forEach(function(x){x=String(x);if(!s[x]){s[x]=1;o.push(x);}});return o;}
  function numQ(q,a,steps){var ws=nearW(a,6,Math.max(2,Math.round(Math.abs(a)*.25))).filter(function(x){return x!==a&&(a<=0||x>0);});return{q:q,a:a,hint:"son",w:ws.slice(0,5),steps:steps};}
  function txtQ(q,a,w,steps,hint){return{q:q,a:a,hint:hint||"javob",type:"text",w:uniq(w).filter(function(x){return x!==String(a);}).slice(0,4),steps:steps};}
  function bank(l){var it=pick(l);return txtQ(it[0],it[1],it[2],it[3]);}
  function lv(L,a,b,c){return L===1?a:L===2?b:c;}
  function rootQ(q,k,r,steps){var f=function(x){return(x===1?"":x)+"√"+r;};var w=[k+1,k-1,2*k,k+2,k*2+1].filter(function(x){return x>0&&x!==k;});return txtQ(q,f(k),w.map(f),steps,"ildizli ifoda");}
  function pt(x,y){return"("+x+"; "+y+")";}
  function pt3(x,y,z){return"("+x+"; "+y+"; "+z+")";}
  function ptQ(q,x,y,steps){var w=[pt(x+1,y),pt(x,y+1),pt(-x,y),pt(x,-y),pt(y,x)];return txtQ(q,pt(x,y),w,steps,"nuqta");}
  function pt3Q(q,x,y,z,steps){var w=[pt3(x+1,y,z),pt3(x,y+1,z),pt3(x,y,z+1),pt3(-x,y,z),pt3(y,x,z)];return txtQ(q,pt3(x,y,z),w,steps,"nuqta");}

  /* ===== 80. Ichki va tashqi chizilgan shakllar ===== */
  var T80=[
   ["Qaysi to'rtburchakka tashqi aylana chizish mumkin?","qarama-qarshi burchaklari yig'indisi 180° bo'lganiga",["diagonallari perpendikulyar bo'lganiga","faqat romb","faqat trapetsiya"],["Aylana ichiga chizilgan to'rtburchakda qarama-qarshi burchaklar yig'indisi 180°"]],
   ["Qaysi to'rtburchakka ichki aylana chizish mumkin?","qarama-qarshi tomonlari yig'indisi teng bo'lganiga",["qarama-qarshi burchaklari yig'indisi 180° bo'lganiga","diagonallari teng bo'lganiga","faqat parallelogramm"],["Tashqi to'rtburchakda a + c = b + d"]],
   ["Parallelogrammga qachon tashqi aylana chizish mumkin?","to'g'ri to'rtburchak bo'lganda",["romb bo'lganda","har doim","hech qachon"],["Qarama-qarshi burchaklar teng va yig'indisi 180° → har biri 90°"]],
   ["Parallelogrammga qachon ichki aylana chizish mumkin?","romb bo'lganda",["to'g'ri to'rtburchak bo'lganda","har doim","hech qachon"],["a + a = b + b → a = b"]],
   ["Uchburchakka tashqi chizilgan aylana markazi qayerda?","o'rta perpendikulyarlar kesishgan nuqtada",["bissektrisalar kesishgan nuqtada","medianalar kesishgan nuqtada","balandliklar kesishgan nuqtada"],["Tomonlarning o'rta perpendikulyarlari"]],
   ["Uchburchakka ichki chizilgan aylana markazi qayerda?","bissektrisalar kesishgan nuqtada",["o'rta perpendikulyarlar kesishgan nuqtada","medianalar kesishgan nuqtada","balandliklar kesishgan nuqtada"],["Tomonlardan teng uzoqlikdagi nuqta"]],
   ["Tomoni a bo'lgan kvadrat ichki va tashqi aylanalarining radiuslari nisbati R : r?","√2 : 1",["2 : 1","1 : 2","√3 : 1"],["R = a√2/2, r = a/2"]],
   ["Muntazam uchburchakda R : r nisbati qanday?","2 : 1",["3 : 1","√2 : 1","1 : 1"],["R = a√3/3, r = a√3/6"]]
  ];
  G.t80=function(L){
    var k=pick(lv(L,[0,1,2,3,10],[0,1,2,3,4,5,6,10],[3,4,5,6,7,8,9,10]));
    if(k===0){var t=pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10]]);return numQ("Katetlari "+t[0]+" va "+t[1]+" bo'lgan to'g'ri burchakli uchburchakka tashqi chizilgan aylana radiusini toping.",t[2]/2,["Gipotenuza = "+t[2]+" — aylana diametri","R = "+t[2]+"/2 = "+t[2]/2]);}
    if(k===1){var t1=pick([[3,4,5,1],[5,12,13,2],[8,15,17,3],[6,8,10,2]]);return numQ("Katetlari "+t1[0]+" va "+t1[1]+" bo'lgan to'g'ri burchakli uchburchakka ichki chizilgan aylana radiusini toping.",t1[3],["r = (a + b − c)/2 = ("+t1[0]+" + "+t1[1]+" − "+t1[2]+")/2 = "+t1[3]]);}
    if(k===2){var a=R(2,10)*2;return numQ("Tomoni "+a+" bo'lgan kvadratga ichki chizilgan aylana radiusini toping.",a/2,["r = a/2 = "+a/2]);}
    if(k===3){var s=R(2,9);return rootQ("Tomoni "+s+" bo'lgan kvadratga tashqi chizilgan aylana radiusi R = a√2/2. Diagonalini toping.",s,2,["d = a√2 = "+s+"√2"]);}
    if(k===4){var A=R(3,9),B=R(4,10),C=R(3,9),D=A+C-B;if(D<=0)return bank(T80);return numQ("To'rtburchakka aylana ichki chizilgan. Ketma-ket tomonlari "+A+", "+B+", "+C+" bo'lsa, to'rtinchi tomonini toping.",D,[A+" + "+C+" = "+B+" + x","x = "+D]);}
    if(k===5){var ang=pick([70,80,95,100,110,65]);return numQ("Aylanaga ichki chizilgan to'rtburchakning bir burchagi "+ang+"°. Qarama-qarshi burchagini toping.",180-ang,["Yig'indi 180°","180° − "+ang+"° = "+(180-ang)+"°"]);}
    if(k===6){var m=R(2,9);return numQ("Teng yonli trapetsiya aylanaga ichki chizilgan va o'rta chizig'i "+m+". Ichki aylana ham mavjud, yon tomoni nechaga teng?",m,["Ichki aylana: asoslar yig'indisi = yon tomonlar yig'indisi","2m = 2c → c = m = "+m]);}
    if(k===7){var a7=pick([6,12,18,24]);return rootQ("Tomoni "+a7+" bo'lgan teng tomonli uchburchakka tashqi chizilgan aylana radiusini toping.",a7/3,3,["R = a√3/3 = "+a7+"√3/3 = "+a7/3+"√3"]);}
    if(k===8){var r8=R(2,9);return numQ("Radiusi "+r8+" bo'lgan aylanaga tashqi chizilgan kvadratning tomonini toping.",2*r8,["a = 2r = "+2*r8]);}
    if(k===9){var R9=R(2,9);return numQ("Radiusi "+R9+" bo'lgan aylanaga ichki chizilgan kvadratning yuzini toping.",2*R9*R9,["d = 2R = "+2*R9,"S = d²/2 = "+4*R9*R9+"/2 = "+2*R9*R9]);}
    if(k===10){var tr=pick([[3,4,5,1],[6,8,10,2],[5,12,13,2],[9,12,15,3],[8,15,17,3],[13,14,15,4],[12,16,20,4],[7,24,25,3]]),p=(tr[0]+tr[1]+tr[2])/2,r=tr[3];return numQ("Uchburchakning tomonlari "+tr[0]+", "+tr[1]+", "+tr[2]+" (perimetri "+2*p+"), unga ichki chizilgan aylana radiusi r = "+r+". Uchburchak yuzini toping (S = p·r).",p*r,["Yarim perimetr p = "+2*p+"/2 = "+p,"S = p·r = "+p+"·"+r+" = "+p*r]);}
    return bank(T80);
  };

  /* ===== 81. Jismlar kombinatsiyasi ===== */
  var T81=[
   ["Kubga ichki chizilgan sharning radiusi qirraga qanday?","r = a/2",["r = a","r = a√3/2","r = a√2/2"],["Shar kubning yoqlariga urinadi"]],
   ["Kubga tashqi chizilgan sharning radiusi qirraga qanday?","R = a√3/2",["R = a/2","R = a√2/2","R = a"],["Shar diametri kubning fazoviy diagonali"]],
   ["Sharga tashqi chizilgan silindrning o'q kesimi qanday shakl?","kvadrat",["to'g'ri to'rtburchak (kvadrat emas)","doira","uchburchak"],["H = 2R"]],
   ["Konusga ichki chizilgan sharning markazi qayerda?","konus balandligida",["asosda","uchda","konus tashqarisida"],["O'q kesimida ichki aylana markazi"]],
   ["Piramidaga tashqi shar chizish uchun asos qanday bo'lishi kerak?","asosiga tashqi aylana chizish mumkin bo'lishi kerak",["asos kvadrat bo'lishi kerak","asos uchburchak emas","shart yo'q"],["Asos atrofida aylana bo'lishi shart"]],
   ["Prizmaga tashqi shar chizish uchun u qanday bo'lishi kerak?","to'g'ri prizma, asosiga aylana chizish mumkin",["istalgan prizma","og'ma prizma","asosi trapetsiya, og'ma"],["To'g'ri prizma va asosi aylanaga chizilgan ko'pburchak"]]
  ];
  G.t81=function(L){
    var k=pick(lv(L,[0,1,2,3,9],[0,1,2,3,4,5,9],[3,4,5,6,7,8,9]));
    if(k===0){var a=R(2,10)*2;return numQ("Qirrasi "+a+" bo'lgan kubga ichki chizilgan sharning radiusini toping.",a/2,["r = a/2 = "+a/2]);}
    if(k===1){var a1=R(2,9)*2;return rootQ("Qirrasi "+a1+" bo'lgan kubga tashqi chizilgan sharning radiusini toping.",a1/2,3,["R = a√3/2 = "+a1/2+"√3"]);}
    if(k===2){var r=R(2,9);return numQ("Radiusi "+r+" bo'lgan sharga tashqi chizilgan silindrning balandligini toping.",2*r,["H = 2R = "+2*r]);}
    if(k===3){var r3=R(2,9);return numQ("Radiusi "+r3+" bo'lgan sharga tashqi chizilgan kubning qirrasini toping.",2*r3,["a = 2r = "+2*r3]);}
    if(k===4){var r4=R(2,9),h=R(2,10);return numQ("Sharga tashqi chizilgan silindr: shar radiusi "+r4+". Silindr asosining radiusi nechaga teng?",r4,["Silindr asosi radiusi = R = "+r4]);}
    if(k===5){var a5=R(2,9);return numQ("Qirrasi "+2*a5+" bo'lgan kubga ichki chizilgan sharning radiusini toping.",a5,["Ichki chizilgan shar kub yoqlariga urinadi → diametri = qirra","R = a/2 = "+2*a5+"/2 = "+a5]);}
    if(k===6){var t=pick([[3,4,5],[5,12,13],[6,8,10]]);return numQ("Konus o'q kesimi uchburchakka ichki aylana: asos radiusi "+t[0]+", balandligi "+t[1]+". Yasovchisini toping.",t[2],["l² = "+t[0]+"² + "+t[1]+"² = "+t[2]*t[2],"l = "+t[2]]);}
    if(k===7){var t7=pick([[3,4,5],[6,8,10],[9,12,15],[12,9,15],[12,16,20],[15,20,25],[8,15,17]]),S7=t7[0]*t7[1],p7=t7[0]+t7[2];return numQ("Konus: asos radiusi "+t7[0]+", balandligi "+t7[1]+", yasovchisi "+t7[2]+". O'q kesimidagi uchburchakka ichki chizilgan aylana radiusi r = S/p ni toping (shu konusga ichki chizilgan shar radiusi).",S7/p7,["O'q kesimi: asosi "+2*t7[0]+", yon tomonlari "+t7[2]+", balandligi "+t7[1],"S = ½·"+2*t7[0]+"·"+t7[1]+" = "+S7,"p = ("+t7[2]+" + "+t7[2]+" + "+2*t7[0]+")/2 = "+p7,"r = S/p = "+S7+"/"+p7+" = "+S7/p7]);}
    if(k===8){var s=R(2,6);return rootQ("Muntazam tetraedr qirrasi "+3*s+". Balandligini toping (H = a√6/3).",s,6,["H = "+3*s+"√6/3 = "+s+"√6"]);}
    if(k===9){var d=R(2,9)*2;return numQ("Sharning diametri "+d+". Unga ichki chizilgan kubning fazoviy diagonali necha?",d,["Kub fazoviy diagonali = shar diametri = "+d]);}
    return bank(T81);
  };

  /* ===== 82. Dekart koordinatalari (tekislik) ===== */
  var T82=[
   ["(x; y) nuqtaning x o'qiga nisbatan simmetrik nuqtasi?","(x; −y)",["(−x; y)","(−x; −y)","(y; x)"],["Absissa saqlanadi, ordinata ishorasi o'zgaradi"]],
   ["(x; y) nuqtaning y o'qiga nisbatan simmetrik nuqtasi?","(−x; y)",["(x; −y)","(−x; −y)","(y; x)"],["Ordinata saqlanadi"]],
   ["(x; y) nuqtaning koordinata boshiga nisbatan simmetrik nuqtasi?","(−x; −y)",["(x; −y)","(−x; y)","(y; x)"],["Ikkala ishora o'zgaradi"]],
   ["Qaysi chorakda absissa manfiy, ordinata musbat?","II chorak",["I chorak","III chorak","IV chorak"],["x < 0, y > 0"]],
   ["Qaysi chorakda ikkala koordinata manfiy?","III chorak",["I chorak","II chorak","IV chorak"],["x < 0, y < 0"]],
   ["Ox o'qida yotuvchi nuqtaning ordinatasi nimaga teng?","0",["1","−1","absissasiga"],["y = 0"]]
  ];
  G.t82=function(L){
    var k=pick(lv(L,[0,1,2,3,10],[0,1,2,3,4,5,10],[3,4,5,6,7,8,9,10]));
    var x1=R(-6,6),y1=R(-6,6),x2=R(-6,6),y2=R(-6,6);
    if(k===0){if(x1===x2&&y1===y2)x2++;var d2=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);var t=pick([[0,3,4,5],[0,5,12,13],[0,6,8,10]]);return numQ("A("+x1+"; "+y1+") va B("+(x1+t[1])+"; "+(y1+t[2])+") nuqtalar orasidagi masofani toping.",t[3],["d² = "+t[1]+"² + "+t[2]+"² = "+t[3]*t[3],"d = "+t[3]]);}
    if(k===1){var a=R(-6,6),b=R(-6,6),c=R(-6,6),d=R(-6,6);return ptQ("A("+(2*a)+"; "+(2*b)+") va B("+(2*c)+"; "+(2*d)+") kesma o'rtasining koordinatalarini toping.",a+c,b+d,["x = ("+2*a+" + "+2*c+")/2 = "+(a+c),"y = ("+2*b+" + "+2*d+")/2 = "+(b+d)]);}
    if(k===2){return ptQ("("+x1+"; "+y1+") nuqtaning Ox o'qiga nisbatan simmetrik nuqtasini toping.",x1,-y1,["Ordinata ishorasi o'zgaradi"]);}
    if(k===3){return ptQ("("+x1+"; "+y1+") nuqtaning koordinata boshiga nisbatan simmetrik nuqtasini toping.",-x1,-y1,["Ikkala koordinata ishorasi o'zgaradi"]);}
    if(k===4){var t4=pick([[3,4,5],[6,8,10],[5,12,13],[8,15,17]]);return numQ("Koordinata boshidan ("+t4[0]+"; "+t4[1]+") nuqtagacha masofani toping.",t4[2],["d = √("+t4[0]+"² + "+t4[1]+"²) = √"+t4[2]*t4[2]+" = "+t4[2]]);}
    if(k===5){var m=R(1,6),n=R(1,6);return numQ("To'g'ri to'rtburchak uchlari (0; 0), ("+m+"; 0), ("+m+"; "+n+"), (0; "+n+"). Yuzini toping.",m*n,["S = "+m+"·"+n+" = "+m*n]);}
    if(k===6){var b=R(2,9),h=R(2,8);return numQ("Uchburchak uchlari (0; 0), ("+b+"; 0), ("+R(0,b)+"; "+h+"). Yuzini toping (asos Ox da).",b*h/2,["S = ½·"+b+"·"+h+" = "+b*h/2]);}
    if(k===7){var kk=R(1,4),bb=R(-5,5),xx=R(1,5);return numQ("y = "+(kk===1?"":kk)+"x "+(bb<0?"− "+(-bb):"+ "+bb)+" to'g'ri chiziqda x = "+xx+" bo'lganda y ni toping.",kk*xx+bb,["y = "+(kk===1?"":kk+"·")+xx+" "+(bb<0?"− "+(-bb):"+ "+bb)+" = "+(kk*xx+bb)]);}
    if(k===8){var r=R(2,8);return numQ("Markazi (0; 0), radiusi "+r+" bo'lgan aylana tenglamasi x² + y² = r². r² ni toping.",r*r,["r² = "+r+"² = "+r*r]);}
    if(k===9){var a9=R(1,5),b9=R(1,5),r9=R(2,6);return numQ("(x − "+a9+")² + (y − "+b9+")² = "+r9*r9+" aylananing radiusini toping.",r9,["r² = "+r9*r9+" → r = "+r9]);}
    if(k===10){var kq=R(1,5),m0=R(-4,4);return numQ("y = "+kq+"x "+(m0<0?"− "+(-m0):"+ "+m0)+" to'g'ri chiziqning Oy o'qi bilan kesishish nuqtasi ordinatasini toping.",m0,["x = 0 da y = "+m0]);}
    return bank(T82);
  };

  /* ===== 83. Vektorlar (tekislik) ===== */
  var T83=[
   ["Vektor nima?","yo'nalishli kesma",["faqat uzunlik","faqat yo'nalish","nuqta"],["Uzunligi va yo'nalishi bor"]],
   ["Ikki vektor kollinear bo'lsa, ular qanday?","bir to'g'ri chiziqda yoki parallel",["perpendikulyar","teng uzunlikli","har doim teng"],["a = k·b"]],
   ["Perpendikulyar vektorlarning skalyar ko'paytmasi nimaga teng?","0",["1","−1","ularning uzunliklari ko'paytmasiga"],["cos 90° = 0"]],
   ["a·b = |a||b|cos φ da φ nima?","vektorlar orasidagi burchak",["a ning burchagi","b ning burchagi","yig'indi burchagi"],["Skalyar ko'paytma ta'rifi"]]
  ];
  G.t83=function(L){
    var k=pick(lv(L,[0,1,2,3,9],[0,1,2,3,4,5,9],[3,4,5,6,7,8,9]));
    var ax=R(-5,5),ay=R(-5,5),bx=R(-5,5),by=R(-5,5);
    if(k===0)return ptQ("a("+ax+"; "+ay+") va b("+bx+"; "+by+") vektorlar yig'indisini toping.",ax+bx,ay+by,["Mos koordinatalar qo'shiladi"]);
    if(k===1)return ptQ("a("+ax+"; "+ay+") va b("+bx+"; "+by+") vektorlar ayirmasi a − b ni toping.",ax-bx,ay-by,["Mos koordinatalar ayriladi"]);
    if(k===2){var c=R(2,5);return ptQ(c+"·a vektor, a("+ax+"; "+ay+"). Koordinatalarini toping.",c*ax,c*ay,["Har koordinata "+c+" ga ko'paytiriladi"]);}
    if(k===3){var A=[R(-5,5),R(-5,5)],B=[R(-5,5),R(-5,5)];return ptQ("A("+A[0]+"; "+A[1]+"), B("+B[0]+"; "+B[1]+"). AB vektor koordinatalarini toping.",B[0]-A[0],B[1]-A[1],["AB = B − A"]);}
    if(k===4){var t=pick([[3,4,5],[6,8,10],[5,12,13],[8,15,17]]);return numQ("a("+t[0]+"; "+t[1]+") vektor uzunligini toping.",t[2],["|a| = √("+t[0]+"² + "+t[1]+"²) = "+t[2]]);}
    if(k===5)return numQ("a("+ax+"; "+ay+") va b("+bx+"; "+by+") vektorlarning skalyar ko'paytmasini toping.",ax*bx+ay*by,["a·b = "+ax+"·"+bx+" + "+ay+"·"+by+" = "+(ax*bx+ay*by)]);
    if(k===6){var p=R(1,6),q=R(1,6);return numQ("a("+p+"; "+q+") va b("+(-q)+"; "+p+") vektorlar orasidagi burchak necha gradus?",90,["a·b = "+(-p*q)+" + "+(p*q)+" = 0","Demak, burchak 90°"]);}
    if(k===7){var c7=R(2,4),y7=R(2,5);return numQ("a(x; "+2*y7+") va b("+3+"; "+3*y7+") kollinear. x ni toping.",2,["x/3 = "+2*y7+"/"+3*y7+" = 2/3","x = 2"]);}
    if(k===8){var u=R(1,7);return numQ("a("+u+"; "+(u+1)+") va b("+(u+1)+"; "+(-u)+") ning skalyar ko'paytmasi nimaga teng?",0,["a·b = "+u*(u+1)+" − "+u*(u+1)+" = 0"]);}
    if(k===9){var A9=[R(-5,5),R(-5,5)],B9=[R(-5,5),R(-5,5)];if(A9[0]===B9[0]&&A9[1]===B9[1])B9[0]+=3;return numQ("A("+A9[0]+"; "+A9[1]+") va B("+B9[0]+"; "+B9[1]+") bo'lsa, |AB|² ni toping.",Math.pow(B9[0]-A9[0],2)+Math.pow(B9[1]-A9[1],2),["AB("+(B9[0]-A9[0])+"; "+(B9[1]-A9[1])+")","|AB|² = "+(Math.pow(B9[0]-A9[0],2)+Math.pow(B9[1]-A9[1],2))]);}
    return bank(T83);
  };

  /* ===== 84. Fazoda koordinatalar va vektorlar ===== */
  var T84=[
   ["Fazoda nuqta nechta koordinatali?","3 ta (x; y; z)",["2 ta","4 ta","1 ta"],["Absissa, ordinata, applikata"]],
   ["Koordinata tekisliklari soni nechta?","3 ta (Oxy, Oxz, Oyz)",["2 ta","4 ta","6 ta"],["Uch juft o'q — uch tekislik"]],
   ["Oxy tekisligida yotuvchi nuqtaning applikatasi?","0",["1","x ga teng","y ga teng"],["z = 0"]],
   ["(x; y; z) nuqtaning Oxy tekisligiga nisbatan simmetrik nuqtasi?","(x; y; −z)",["(−x; y; z)","(x; −y; z)","(−x; −y; −z)"],["Applikata ishorasi o'zgaradi"]]
  ];
  G.t84=function(L){
    var k=pick(lv(L,[0,1,2,3,9],[0,1,2,3,4,5,9],[3,4,5,6,7,8,9]));
    var a=[R(-4,4),R(-4,4),R(-4,4)],b=[R(-4,4),R(-4,4),R(-4,4)];
    if(k===0)return pt3Q("A("+a.join("; ")+") va B("+b.join("; ")+"). AB vektor koordinatalarini toping.",b[0]-a[0],b[1]-a[1],b[2]-a[2],["AB = B − A"]);
    if(k===1)return pt3Q("a("+a.join("; ")+") va b("+b.join("; ")+") vektorlar yig'indisini toping.",a[0]+b[0],a[1]+b[1],a[2]+b[2],["Mos koordinatalar qo'shiladi"]);
    if(k===2){var A=[R(-3,3)*2,R(-3,3)*2,R(-3,3)*2],B=[R(-3,3)*2,R(-3,3)*2,R(-3,3)*2];return pt3Q("A("+A.join("; ")+") va B("+B.join("; ")+") kesma o'rtasini toping.",(A[0]+B[0])/2,(A[1]+B[1])/2,(A[2]+B[2])/2,["Har koordinataning o'rta arifmetigi"]);}
    if(k===3)return pt3Q("("+a.join("; ")+") nuqtaning Oxy tekisligiga nisbatan simmetrik nuqtasini toping.",a[0],a[1],-a[2],["z ishorasi o'zgaradi"]);
    if(k===4){var t=pick([[1,2,2,3],[2,3,6,7],[2,4,4,6],[3,4,12,13],[2,10,11,15],[4,4,7,9]]);return numQ("a("+t[0]+"; "+t[1]+"; "+t[2]+") vektor uzunligini toping.",t[3],["|a| = √("+t[0]*t[0]+" + "+t[1]*t[1]+" + "+t[2]*t[2]+") = "+t[3]]);}
    if(k===5)return numQ("a("+a.join("; ")+") va b("+b.join("; ")+") skalyar ko'paytmasini toping.",a[0]*b[0]+a[1]*b[1]+a[2]*b[2],["a·b = "+a[0]*b[0]+" + "+a[1]*b[1]+" + "+a[2]*b[2]+" = "+(a[0]*b[0]+a[1]*b[1]+a[2]*b[2])]);
    if(k===6){var t6=pick([[1,2,2,3],[2,3,6,7],[2,4,4,6],[3,4,12,13]]);var P=[R(-3,3),R(-3,3),R(-3,3)];return numQ("A("+P.join("; ")+") va B("+(P[0]+t6[0])+"; "+(P[1]+t6[1])+"; "+(P[2]+t6[2])+") nuqtalar orasidagi masofani toping.",t6[3],["AB("+t6[0]+"; "+t6[1]+"; "+t6[2]+")","d = "+t6[3]]);}
    if(k===7){var p=R(1,5),q=R(1,5);return numQ("a("+p+"; "+q+"; 0) va b("+(-q)+"; "+p+"; 7) vektorlar orasidagi burchakni toping (gradusda).",90,["a·b = "+(-p*q)+" + "+(p*q)+" + 0 = 0","Burchak 90°"]);}
    if(k===8){var m=R(2,6);return numQ("a(1; 2; 3) va b(2; 4; m) kollinear. m ni toping.",6,["b = 2a → m = 6"]);}
    if(k===9){var x=R(1,6),y=R(1,6),z=R(1,6);return numQ("Qirralari "+x+", "+y+", "+z+" bo'lgan to'g'ri burchakli parallelepipedning bir uchi koordinata boshida, qirralari o'qlar bo'ylab. Qarama-qarshi uchining koordinatalari yig'indisini toping.",x+y+z,["Uch: ("+x+"; "+y+"; "+z+")","Yig'indi: "+(x+y+z)]);}
    return bank(T84);
  };
  S.registerAll(G,{t80:"Ichki va tashqi chizilgan shakllar",t81:"Jismlar kombinatsiyasi (ichki/tashqi shar, silindr, konus)",t82:"Dekart koordinatalari (tekislikda)",t83:"Vektorlar (tekislikda)",t84:"Fazoda koordinatalar va vektorlar"});
})();
