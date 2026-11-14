/*! Kuvonch Academy — 85–88: sinus/kosinus teoremalari, o'xshashlik, fazoda burchak va masofa, jism kesimlari */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, nearW = H.nearW, G = {};
  function uniq(a){var s={},o=[];a.forEach(function(x){x=String(x);if(!s[x]){s[x]=1;o.push(x);}});return o;}
  function numQ(q,a,steps){var ws=nearW(a,4,Math.max(2,Math.round(Math.abs(a)*.25))).filter(function(x){return x!==a&&x>0;});return{q:q,a:a,hint:"son",w:ws.slice(0,5),steps:steps};}
  function txtQ(q,a,w,steps){return{q:q,a:a,hint:"javob",type:"text",w:uniq(w).filter(function(x){return x!==String(a);}).slice(0,4),steps:steps};}
  function bank(l){var it=pick(l);return txtQ(it[0],it[1],it[2],it[3]);}
  function lv(L,a,b,c){return L===1?a:L===2?b:c;}
  function rootQ(q,k,r,steps){var f=function(x){return(x===1?"":x)+"√"+r;};var w=[k+1,k-1,2*k,k+2].filter(function(x){return x>0&&x!==k;});return txtQ(q,f(k),w.map(f),steps);}

  var T85=[
   ["Sinuslar teoremasi qaysi?","a/sinA = b/sinB = c/sinC = 2R",["a² = b² + c²","a = b·c·sinA","a/sinA = b·sinB"],["Tomon / qarshisidagi burchak sinusi = 2R"]],
   ["Kosinuslar teoremasi qaysi?","a² = b² + c² − 2bc·cosA",["a² = b² + c²","a = b + c − 2bc·cosA","a² = b² − c² + 2bc·cosA"],["Pifagor teoremasining umumlashmasi"]],
   ["A = 90° bo'lsa kosinuslar teoremasi nimaga aylanadi?","Pifagor teoremasiga",["sinuslar teoremasiga","a = b + c","a² = 2bc"],["cos90° = 0"]],
   ["Uchburchak yuzi S = ½·b·c·sinA da A nima?","b va c tomonlar orasidagi burchak",["a tomon qarshisidagi tashqi burchak","b qarshisidagi burchak","c qarshisidagi burchak"],["Ikki tomon va ular orasidagi burchak"]]
  ];
  G.t85=function(L){
    var k=pick(lv(L,[0,1,2,3,8],[0,1,2,3,4,5,8],[3,4,5,6,7,8]));
    if(k===0){var t=pick([[30,2],[150,2]]);var R1=R(2,9);return numQ("Uchburchakda a = "+R1+", A = 30°. Tashqi chizilgan aylana radiusini toping (a/sinA = 2R).",R1,["sin30° = 1/2","2R = "+R1+" : 1/2 = "+2*R1,"R = "+R1]);}
    if(k===1){var b=R(2,9)*2;return numQ("Uchburchakda b = "+b+", B = 30°, A = 90°. a ni toping (sinuslar teoremasi).",2*b,["a/sin90° = b/sin30°","a = "+b+" / (1/2) = "+2*b]);}
    if(k===2){var t2=pick([[3,4],[6,8],[5,12]]);var c2=Math.sqrt(t2[0]*t2[0]+t2[1]*t2[1]);return numQ("Uchburchakda b = "+t2[0]+", c = "+t2[1]+", A = 90°. a ni toping (kosinuslar teoremasi).",c2,["a² = b² + c² − 2bc·cos90° = "+(t2[0]*t2[0]+t2[1]*t2[1]),"a = "+c2]);}
    if(k===3){var b3=R(2,8)*2,c3=R(2,9);return numQ("Uchburchakda b = "+b3+", c = "+c3+", A = 30°. Yuzini toping (S = ½bc·sinA).",b3*c3/4,["S = ½·"+b3+"·"+c3+"·½ = "+b3*c3/4]);}
    if(k===4){var b4=R(2,8),c4=b4+R(1,5);return numQ("Uchburchakda b = "+b4+", c = "+c4+", A = 60°. a² ni toping.",b4*b4+c4*c4-b4*c4,["a² = b² + c² − 2bc·cos60° = "+(b4*b4)+" + "+(c4*c4)+" − "+(b4*c4)]);}
    if(k===5){var b5=R(2,9)*2;return rootQ("Uchburchakda b = c = "+b5+", A = 120°. a ni toping (kosinuslar teoremasi).",b5,3,["a² = 2b² − 2b²·(−½) = 3b²","a = b√3 = "+b5+"√3"]);}
    if(k===6){var a6=R(2,6)*2;return rootQ("Uchburchakda a = "+a6+", A = 45°, B = 60°. b ni toping. (b = a·sinB/sinA)",a6/2*1,6,["b = "+a6+"·(√3/2)/(√2/2) = "+a6+"√3/√2 = "+a6/2+"√6"]);}
    if(k===7){var a7=R(2,8);return numQ("Uchburchakda A = 30°, B = 45°. C burchakni toping (gradusda).",105,["C = 180° − 30° − 45° = 105°"]);}
    if(k===8){var s=R(1,4)*3;return numQ("Uchburchakning burchaklari 30°, 60°, 90°, kichik katet "+s+". Gipotenuzasini toping.",2*s,["30° qarshisidagi katet — gipotenuzaning yarmi","c = 2·"+s+" = "+2*s]);}
    return bank(T85);
  };

  var T86=[
   ["Uchburchaklar o'xshash bo'lsa, tomonlari qanday?","proporsional",["teng","perpendikulyar","parallel"],["Nisbat o'xshashlik koeffitsiyenti k"]],
   ["O'xshash shakllar yuzlari nisbati k bo'lsa, yuzlar nisbati?","k²",["k","k³","2k"],["Yuz chiziqli o'lchamning kvadrati"]],
   ["O'xshash jismlar hajmlari nisbati k bo'lsa?","k³",["k","k²","3k"],["Hajm kub bo'yicha"]],
   ["Uchburchak o'xshashlikning 1-alomati?","ikki burchagi mos teng",["bitta tomoni teng","bitta burchagi teng","perimetri teng"],["Ikki burchak teng bo'lsa uchinchisi ham teng"]]
  ];
  G.t86=function(L){
    var k=pick(lv(L,[0,1,2,3,9],[0,1,2,3,4,5,9],[3,4,5,6,7,8,9]));
    var kk=R(2,5),a=R(2,8);
    if(k===0)return numQ("Uchburchaklar o'xshash, k = "+kk+". Birining tomoni "+a+". Ikkinchisining mos tomoni?",a*kk,["Tomon = "+a+"·"+kk+" = "+a*kk]);
    if(k===1){var S1=R(2,9);return numQ("O'xshash uchburchaklarning o'xshashlik koeffitsiyenti "+kk+". Kichigining yuzi "+S1+". Kattasining yuzi?",S1*kk*kk,["k² = "+kk*kk,S1+"·"+kk*kk+" = "+S1*kk*kk]);}
    if(k===2){var V1=R(1,5);return numQ("O'xshash jismlar koeffitsiyenti "+kk+". Kichigining hajmi "+V1+". Kattasining hajmi?",V1*kk*kk*kk,["k³ = "+kk*kk*kk,V1+"·"+kk*kk*kk+" = "+V1*kk*kk*kk]);}
    if(k===3){var p=R(2,6),q=R(2,6),r=R(3,8),t=R(2,4);return numQ("O'xshash uchburchaklar: birining perimetri "+(p+q+r)+", k = "+t+". Ikkinchisining perimetri?",(p+q+r)*t,["Perimetrlar nisbati = k","P = "+(p+q+r)+"·"+t+" = "+(p+q+r)*t]);}
    if(k===4){var A=R(2,6),B=R(2,6),C=A*R(2,4);return numQ("ABC ~ A₁B₁C₁. AB = "+A+", A₁B₁ = "+C+", BC = "+B+". B₁C₁ ni toping.",B*C/A,["k = "+C+"/"+A+" = "+C/A,"B₁C₁ = "+B+"·"+C/A+" = "+B*C/A]);}
    if(k===5){var s=R(2,6),k2=pick([2,3]);return numQ("Uchburchakning asosiga parallel kesuvchi to'g'ri chiziq o'xshash uchburchak hosil qiladi. Uchdan balandlik "+s+", to'liq balandlik "+s*k2+". Yuzlar nisbati (katta : kichik)?",k2*k2,["k = "+k2,"Yuzlar nisbati k² = "+k2*k2]);}
    if(k===6){var h=R(2,6),m=pick([2,3,4]);return numQ("Soya masalasi: "+h+" m balandlik soyasi "+m+" m. Shu vaqtda ustun soyasi "+m*5+" m bo'lsa, ustun balandligi?",h*5,["k = "+m*5+"/"+m+" = 5","Balandlik = "+h+"·5 = "+h*5]);}
    if(k===7){var kk3=pick([2,3]);var r=R(2,5);return numQ("Ikki shar radiuslari "+r+" va "+r*kk3+". Sirt yuzlari nisbati (katta : kichik)?",kk3*kk3,["k = "+kk3,"S nisbat = k² = "+kk3*kk3]);}
    if(k===8){var m8=pick([2,3,4]);return numQ("Uchburchakning o'xshashlik koeffitsiyenti "+m8+". Kattasining balandligi kichigidan "+m8+" marta katta. Kichigining balandligi 3 bo'lsa, kattasiniki?",3*m8,["h = 3·"+m8+" = "+3*m8]);}
    if(k===9){var kq=R(2,4);return numQ("O'xshash ko'pburchaklar yuzlari nisbati "+kq*kq+". Mos tomonlari nisbatini toping.",kq,["k² = "+kq*kq+" → k = "+kq]);}
    return bank(T86);
  };

  var T87=[
   ["Ikki tekislik orasidagi burchak qanday topiladi?","ularning kesishish chizig'iga perpendikulyar to'g'ri chiziqlar orasidagi burchak",["normal vektorlar yig'indisi","kesishish chizig'i uzunligi","hech qanday"],["Chiziqli burchak"]],
   ["Uch perpendikulyar haqidagi teoremaga ko'ra, og'ma proyeksiyasiga perpendikulyar chiziq?","og'maga ham perpendikulyar",["og'maga parallel","hech narsa","og'maga teng"],["Teorema"]],
   ["Nuqtadan tekislikkacha masofa nima?","nuqtadan tekislikka tushirilgan perpendikulyar uzunligi",["eng uzun og'ma","proyeksiya uzunligi","og'ma uzunligi"],["Perpendikulyar eng qisqa"]],
   ["Chiziq va tekislik orasidagi burchak?","chiziq va uning tekislikdagi proyeksiyasi orasidagi burchak",["chiziq va normal orasidagi","90° ga teng doim","chiziq va izi"],["Proyeksiya bilan burchak"]]
  ];
  G.t87=function(L){
    var k=pick(lv(L,[0,1,2,3,8],[0,1,2,3,4,5,8],[3,4,5,6,7,8]));
    var t=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17]]);
    if(k===0)return numQ("Tekislikka tushirilgan perpendikulyar "+t[0]+", og'maning proyeksiyasi "+t[1]+". Og'maning uzunligini toping.",t[2],["l² = "+t[0]+"² + "+t[1]+"² = "+t[2]*t[2],"l = "+t[2]]);
    if(k===1)return numQ("Nuqtadan tekislikkacha og'ma "+t[2]+", proyeksiyasi "+t[0]+". Nuqtadan tekislikkacha masofa?",t[1],["h² = "+t[2]+"² − "+t[0]+"² = "+t[1]*t[1],"h = "+t[1]]);
    if(k===2){var a=R(2,9);return rootQ("Kub qirrasi "+a+". Yoq diagonalini toping.",a,2,["d = a√2 = "+a+"√2"]);}
    if(k===3){var a3=R(2,9);return rootQ("Kub qirrasi "+a3+". Fazoviy diagonalini toping.",a3,3,["d = a√3 = "+a3+"√3"]);}
    if(k===4){var a4=R(2,6);return numQ("Qirrasi "+a4+" bo'lgan kubda diagonal kesim yuzining √2 oldidagi koeffitsientini toping.",a4*a4,["S = a·a√2 = "+a4*a4+"√2"]);}
    if(k===5){var a5=R(2,8);return numQ("Qirrasi "+a5+" bo'lgan kubda qarama-qarshi ikki yoq orasidagi masofa nechaga teng?",a5,["Parallel yoqlar orasidagi masofa = qirra"]);}
    if(k===6){var h6=R(2,9);return numQ("Burchak 45° li og'ma tekislik bilan, nuqtadan tekislikka masofa "+h6+". Proyeksiya uzunligini toping.",h6,["45° da proyeksiya = masofa = "+h6]);}
    if(k===7){var x=R(2,8);return numQ("Tekislikka tushirilgan og'ma tekislik bilan 30° burchak hosil qiladi, masofa "+x+". Og'ma uzunligini toping.",2*x,["sin30° = h/l → l = h : ½ = "+2*x]);}
    if(k===8)return {q:"Ikki yoqli burchak 90° bo'lsa, tekisliklar qanday joylashgan?",a:"perpendikulyar",hint:"javob",type:"text",w:["parallel","ustma-ust tushadi","kesishmaydi"],steps:["Ikki yoqli burchak 90° → tekisliklar perpendikulyar"]};
    return bank(T87);
  };

  var T88=[
   ["Silindrni o'q orqali kesganda kesim shakli?","to'g'ri to'rtburchak",["doira","ellips","uchburchak"],["2r × H"]],
   ["Konusni o'q orqali kesganda kesim shakli?","teng yonli uchburchak",["to'g'ri to'rtburchak","doira","trapetsiya"],["Asosi 2r, yon tomonlari yasovchi"]],
   ["Sharni istalgan tekislik kesganda kesim shakli?","doira",["ellips","kvadrat","uchburchak"],["Hamma kesimlar doira"]],
   ["Kubni diagonal tekislik kesganda kesim shakli?","to'g'ri to'rtburchak",["kvadrat","uchburchak","doira"],["a va a√2 tomonli"]]
  ];
  G.t88=function(L){
    var k=pick(lv(L,[0,1,2,3,8],[0,1,2,3,4,5,8],[3,4,5,6,7,8]));
    var r=R(2,8),h=R(2,10);
    if(k===0)return numQ("Silindr r = "+r+", H = "+h+". O'q kesimi yuzi?",2*r*h,["S = 2r·H = "+2*r*h]);
    if(k===1){var t=pick([[3,4],[6,8],[5,12]]);return numQ("Konus r = "+t[0]+", H = "+t[1]+". O'q kesimi yuzi?",t[0]*t[1],["S = ½·2r·H = "+t[0]*t[1]]);}
    if(k===2){var t2=pick([[5,3,4],[13,5,12],[10,6,8],[17,8,15]]);return numQ("Shar radiusi "+t2[0]+", markazdan kesimgacha masofa "+t2[1]+". Kesim doirasining radiusi?",t2[2],["r² = R² − d² = "+t2[2]*t2[2],"r = "+t2[2]]);}
    if(k===3){var a=R(2,8);return rootQ("Kub qirrasi "+a+". Diagonal kesimi yuzini toping.",a*a,2,["S = a·a√2 = "+a*a+"√2"]);}
    if(k===4){var rr=R(2,8);return numQ("Shar radiusi "+rr+". Eng katta kesim (katta doira) radiusi?",rr,["Katta doira radiusi = R"]);}
    if(k===5){var a5=R(2,6)*2;return numQ("Kubni yoqqa parallel tekislik kesganda kesim yoqqa teng kvadrat bo'ladi. Qirrasi "+a5+" bo'lsa, kesim yuzi?",a5*a5,["S = "+a5+"² = "+a5*a5]);}
    if(k===6){var hh=pick([4,6,8]),rr6=pick([3,6]);return numQ("Konus balandligining yarmida asosga parallel kesim o'tkazildi. Asos radiusi "+rr6*2+". Kesim radiusi?",rr6,["k = 1/2","r = "+rr6*2+"/2 = "+rr6]);}
    if(k===7){var r7=R(2,6),h7=R(2,6);return numQ("Silindrni asosga parallel kesganda kesim asosga teng doira. r = "+r7+" bo'lsa, kesim doirasining diametri?",2*r7,["d = 2r = "+2*r7]);}
    if(k===8){var a8=R(2,8);return numQ("Piramidani asosiga parallel tekislik kesganda kesim asosga o'xshash. Kesim balandlikning yarmida, asosi kvadrat tomoni "+2*a8+". Kesim kvadrat tomoni?",a8,["k = ½","tomon = "+a8]);}
    return bank(T88);
  };
  S.registerAll(G,{t85:"Sinuslar va kosinuslar teoremalari",t86:"Shakllar o'xshashligi",t87:"Fazoda burchak va masofalar",t88:"Jismlarning kesimlari"});
})();
