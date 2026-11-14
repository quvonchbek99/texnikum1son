/*! Kuvonch Academy — 89–96: faktorial, kombinatorika, ehtimollik, to'plamlar, binom */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, nearW = H.nearW, G = {};
  function uniq(a){var s={},o=[];a.forEach(function(x){x=String(x);if(!s[x]){s[x]=1;o.push(x);}});return o;}
  function numQ(q,a,steps){var ws=nearW(a,4,Math.max(2,Math.round(Math.abs(a)*.25))).filter(function(x){return x!==a&&x>=0;});return{q:q,a:a,hint:"son",w:ws.slice(0,5),steps:steps};}
  function txtQ(q,a,w,steps,hint){return{q:q,a:a,hint:hint||"javob",type:"text",w:uniq(w).filter(function(x){return x!==String(a);}).slice(0,4),steps:steps};}
  function bank(l){var it=pick(l);return txtQ(it[0],it[1],it[2],it[3]);}
  function lv(L,a,b,c){return L===1?a:L===2?b:c;}
  function gcd(a,b){return b?gcd(b,a%b):a;}
  function fact(n){var r=1;for(var i=2;i<=n;i++)r*=i;return r;}
  function C(n,k){return fact(n)/(fact(k)*fact(n-k));}
  function A(n,k){return fact(n)/fact(n-k);}
  function fr(p,q){var g=gcd(p,q);p/=g;q/=g;return q===1?String(p):p+"/"+q;}
  function frQ(q,p,d,steps){var a=fr(p,d);var w=[fr(d-p,d),fr(p+1,d),fr(p,d+1),fr(p*2,d*3+1),fr(d,p+d)].filter(function(x){return x!==a;});return txtQ(q,a,w,steps,"kasr");}

  /* 89 Faktorial */
  var T89=[
   ["0! nimaga teng?","1",["0","10","aniqlanmagan"],["Kelishuv: 0! = 1"]],
   ["n! qanday aniqlanadi?","1·2·3·…·n",["n·n","n + (n−1)","2ⁿ"],["n! = 1·2·…·n"]],
   ["(n+1)! = ?","(n+1)·n!",["n!+1","n·(n+1)","2·n!"],["Keyingi son ko'paytiriladi"]]
  ];
  G.t89=function(L){
    var k=pick(lv(L,[0,1,2,7],[0,1,2,3,4,7],[3,4,5,6,7]));
    if(k===0){var n=R(3,7);return numQ(n+"! ni hisoblang.",fact(n),[Array.apply(null,Array(n)).map(function(_,i){return i+1;}).join("·")+" = "+fact(n)]);}
    if(k===1){var n1=R(5,9),m=R(2,4);return numQ(n1+"!/"+(n1-m)+"! ni hisoblang.",A(n1,m),["Yuqoridan "+m+" ta ko'paytuvchi qoladi","= "+A(n1,m)]);}
    if(k===2){var n2=R(5,9);return numQ((n2+1)+"!/"+n2+"! ni hisoblang.",n2+1,["(n+1)!/n! = n+1 = "+(n2+1)]);}
    if(k===3){var a=R(3,6);return numQ("n!/(n−2)! = "+(a*(a-1))+" bo'lsa, n ni toping.",a,["n(n−1) = "+a*(a-1),"n = "+a]);}
    if(k===4){var n4=R(4,8);return numQ(n4+"! − "+(n4-1)+"! ni hisoblang.",fact(n4)-fact(n4-1),[fact(n4)+" − "+fact(n4-1)+" = "+(fact(n4)-fact(n4-1))]);}
    if(k===5){var n5=R(5,9);return numQ(fact(n5)+" = n! bo'lsa, n ni toping.",n5,["1·2·…·"+n5+" = "+fact(n5)]);}
    if(k===6){var n6=R(3,6);return numQ("("+n6+"! + "+(n6+1)+"!)/"+n6+"! ni hisoblang.",1+n6+1,["1 + ("+(n6+1)+") = "+(n6+2)]);}
    if(k===7){var n7=R(4,8);return numQ(n7+" ta turli element uchun o'rin almashtirishlar sonini toping.",fact(n7),["P = n! = "+fact(n7)]);}
    return bank(T89);
  };

  /* 90 Kombinatorika qoidalari */
  var T90=[
   ["Ko'paytirish qoidasi qachon ishlatiladi?","ketma-ket bajariladigan mustaqil tanlovlarda",["faqat bitta tanlovda","hech qachon","faqat o'rin almashtirishda"],["m·n usul"]],
   ["Qo'shish qoidasi qachon ishlatiladi?","bir-birini inkor etuvchi variantlarda (yoki-yoki)",["ketma-ket tanlovlarda","faqat guruhlashda","hech qachon"],["m + n usul"]]
  ];
  G.t90=function(L){
    var k=pick(lv(L,[0,1,2,7],[0,1,2,3,4,7],[3,4,5,6,7]));
    if(k===0){var a=R(2,6),b=R(2,6);return numQ("Kiyim: "+a+" xil ko'ylak va "+b+" xil shim. Nechta turli to'plam tuzish mumkin?",a*b,[a+"·"+b+" = "+a*b]);}
    if(k===1){var a1=R(3,8),b1=R(3,8);return numQ("Do'konda "+a1+" xil qalam yoki "+b1+" xil ruchka bor. Bitta narsani necha usulda tanlash mumkin?",a1+b1,["Qo'shish qoidasi: "+a1+" + "+b1+" = "+(a1+b1)]);}
    if(k===2){var a2=R(2,5),b2=R(2,5),c=R(2,4);return numQ("A dan B ga "+a2+" yo'l, B dan C ga "+b2+" yo'l, C dan D ga "+c+" yo'l. A dan D ga necha usulda borish mumkin?",a2*b2*c,[a2+"·"+b2+"·"+c+" = "+a2*b2*c]);}
    if(k===3)return numQ("Raqamlari takrorlanmaydigan uch xonali sonlar 1, 2, 3, 4, 5 raqamlaridan nechta tuzish mumkin?",60,["5·4·3 = 60"]);
    if(k===4)return numQ("0, 1, 2, 3, 4 raqamlaridan raqamlari takrorlanmaydigan nechta uch xonali son tuzish mumkin?",48,["Birinchi raqam 0 bo'lmaydi: 4·4·3 = 48"]);
    if(k===5){var n=R(3,6);return numQ(n+" xonali sonlar (raqamlar takrorlanishi mumkin, 0 bo'lishi mumkin, birinchisi 0 emas) nechta?",9*Math.pow(10,n-1),["9·10^"+(n-1)+" = "+9*Math.pow(10,n-1)]);}
    if(k===6){var n6=R(3,5);return numQ(n6+" ta savolning har biriga 'ha' yoki 'yo'q' deb javob berish usullari soni?",Math.pow(2,n6),["2^"+n6+" = "+Math.pow(2,n6)]);}
    if(k===7){var a7=R(2,6),b7=R(2,6);return numQ("Menyuda "+a7+" xil birinchi taom, "+b7+" xil ikkinchi taom. Tushlikni necha usulda tanlash mumkin?",a7*b7,[a7+"·"+b7+" = "+a7*b7]);}
    return bank(T90);
  };

  /* 91 O'rin almashtirish, o'rinlashtirish, guruhlash */
  var T91=[
   ["O'rin almashtirishlar soni formulasi?","Pₙ = n!",["Pₙ = nⁿ","Pₙ = n²","Pₙ = n/2"],["n ta element"]],
   ["O'rinlashtirishlar soni formulasi?","Aₙᵏ = n!/(n−k)!",["n!/k!","n!/(k!(n−k)!)","nᵏ/k!"],["Tartib muhim"]],
   ["Guruhlashlar soni formulasi?","Cₙᵏ = n!/(k!(n−k)!)",["n!/(n−k)!","n!/k!","nᵏ"],["Tartib muhim emas"]],
   ["Guruhlashda tartib muhimmi?","yo'q",["ha","faqat k = 2 da","faqat n juft bo'lsa"],["Faqat tarkib muhim"]]
  ];
  G.t91=function(L){
    var k=pick(lv(L,[0,1,2,3,10],[0,1,2,3,4,5,10],[4,5,6,7,8,9,10]));
    if(k===0){var n=R(3,7);return numQ(n+" ta turli kitobni javonga necha usulda joylashtirish mumkin?",fact(n),["Pₙ = "+n+"! = "+fact(n)]);}
    if(k===1){var n1=R(5,9),m=R(2,3);return numQ("A("+n1+","+m+") = ?",A(n1,m),[n1+"!/"+(n1-m)+"! = "+A(n1,m)]);}
    if(k===2){var n2=R(5,10),m2=R(2,3);return numQ("C("+n2+","+m2+") = ?",C(n2,m2),[n2+"!/("+m2+"!·"+(n2-m2)+"!) = "+C(n2,m2)]);}
    if(k===3){var n3=R(6,12);return numQ(n3+" kishidan 2 kishilik komissiyani necha usulda tanlash mumkin?",C(n3,2),["C("+n3+",2) = "+C(n3,2)]);}
    if(k===4){var n4=R(6,10);return numQ(n4+" o'quvchidan sardor, o'rinbosar va kotibni (turli shaxslar) necha usulda tanlash mumkin?",A(n4,3),["Tartib muhim: A("+n4+",3) = "+A(n4,3)]);}
    if(k===5){var n5=R(7,12),m5=R(3,4);return numQ(n5+" ta turli (har xil) olmadan "+m5+" tasini tanlash usullari soni?",C(n5,m5),["C("+n5+","+m5+") = "+C(n5,m5)]);}
    if(k===6){var m6=R(3,6),w6=R(3,6);return numQ(m6+" yigit va "+w6+" qizdan 1 yigit va 1 qizdan iborat juftni necha usulda tanlash mumkin?",m6*w6,[m6+"·"+w6+" = "+m6*w6]);}
    if(k===7){var m7=R(4,7),w7=R(3,5);return numQ(m7+" yigit va "+w7+" qizdan 2 yigit va 1 qizdan iborat guruhni necha usulda tanlash mumkin?",C(m7,2)*w7,["C("+m7+",2)·"+w7+" = "+C(m7,2)+"·"+w7+" = "+C(m7,2)*w7]);}
    if(k===8)return numQ("'KITOB' so'zining (5 ta turli harf) harflarini o'rin almashtirib, nechta turli so'z hosil qilish mumkin?",120,["5! = 120"]);
    if(k===9){var n9=R(4,7);return numQ("Aylana stol atrofida "+n9+" kishini necha usulda o'tqazish mumkin (aylanma siljishlar bir xil sanaladi)?",fact(n9-1),["(n−1)! = "+fact(n9-1)]);}
    if(k===10){var n10=R(5,9);return numQ("C("+n10+",1) + C("+n10+","+(n10-1)+") ni toping.",2*n10,[n10+" + "+n10+" = "+2*n10]);}
    return bank(T91);
  };

  /* 92 Klassik ehtimollik */
  var T92=[
   ["Klassik ehtimollik formulasi?","P = m/n (qulay holatlar / barcha holatlar)",["P = n/m","P = m·n","P = m + n"],["Teng imkoniyatli natijalar"]],
   ["Ehtimollik qanday oraliqda bo'ladi?","0 dan 1 gacha",["−1 dan 1 gacha","1 dan 100 gacha","faqat 1/2"],["0 ≤ P ≤ 1"]],
   ["Muqarrar hodisaning ehtimolligi?","1",["0","1/2","aniqlanmagan"],["Albatta ro'y beradi"]],
   ["Mumkin bo'lmagan hodisaning ehtimolligi?","0",["1","1/2","−1"],["Hech qachon bo'lmaydi"]]
  ];
  G.t92=function(L){
    var k=pick(lv(L,[0,1,2,3,10],[0,1,2,3,4,5,10],[4,5,6,7,8,9,10]));
    if(k===0){var n=pick([6]),m=pick([1,2,3]);return frQ("O'yin kubigi tashlandi. Juft ochko tushish ehtimolligi?",3,6,["Juft: 2, 4, 6 — 3 ta","3/6 = 1/2"]);}
    if(k===1){var t=R(3,9),q=R(3,9);return frQ("Qutida "+t+" ta oq va "+q+" ta qora shar bor. Tasodifiy olingan shar oq bo'lish ehtimolligi?",t,t+q,["P = "+t+"/"+(t+q)]);}
    if(k===2){var d=pick([20,25,30,36,40]);var m=R(1,d-1);return frQ(d+" ta bilet ichida "+m+" tasi yutuqli. Bitta bilet olinganda yutish ehtimolligi?",m,d,["P = "+m+"/"+d]);}
    if(k===3)return frQ("Ikki tanga tashlandi. Ikkalasida ham gerb tushish ehtimolligi?",1,4,["Barcha holatlar: GG, GR, RG, RR — 4 ta","P = 1/4"]);
    if(k===4)return frQ("Ikki o'yin kubigi tashlandi. Ochkolar yig'indisi 7 bo'lish ehtimolligi?",6,36,["Qulay: 6 ta","P = 6/36 = 1/6"]);
    if(k===5)return frQ("Ikki o'yin kubigi tashlandi. Ochkolar yig'indisi 12 bo'lish ehtimolligi?",1,36,["Faqat (6; 6)"]);
    if(k===6){var n6=R(5,9);return frQ("1 dan "+n6*4+" gacha sonlardan tasodifiy biri tanlandi. 4 ga karrali bo'lish ehtimolligi?",n6,n6*4,["Qulay: "+n6+" ta","P = "+n6+"/"+n6*4]);}
    if(k===7)return frQ("36 varaqli kartadan (4 ta tuz bor) tasodifiy karta olindi. Tuz bo'lish ehtimolligi?",4,36,["P = 4/36 = 1/9"]);
    if(k===8)return frQ("Uch tanga tashlandi. Aynan 2 ta gerb tushish ehtimolligi?",3,8,["Qulay: GGR, GRG, RGG","Barcha: 2³ = 8"]);
    if(k===9){var a=R(3,8),b=R(2,6);return frQ("Qutida "+a+" qizil, "+b+" yashil shar. Qizil bo'lmaslik ehtimolligi?",b,a+b,["1 − "+a+"/"+(a+b)+" = "+b+"/"+(a+b)]);}
    if(k===10){var d10=R(5,15);return frQ(d10+" ta o'quvchi ichida bittasi sardor bo'ladi. Aniq bir o'quvchi sardor bo'lish ehtimolligi?",1,d10,["P = 1/"+d10]);}
    return bank(T92);
  };

  /* 93 Ehtimollik qoidalari */
  var T93=[
   ["Qarama-qarshi hodisa ehtimolligi?","P(Ā) = 1 − P(A)",["P(A) − 1","1 + P(A)","P(A)²"],["Yig'indi 1"]],
   ["Bog'liq bo'lmagan hodisalar uchun P(A va B)?","P(A)·P(B)",["P(A) + P(B)","P(A) − P(B)","P(A)/P(B)"],["Ko'paytirish qoidasi"]],
   ["Birgalikda bo'lmagan hodisalar uchun P(A yoki B)?","P(A) + P(B)",["P(A)·P(B)","P(A) − P(B)","1 − P(A)"],["Qo'shish qoidasi"]],
   ["Umumiy holda P(A ∪ B) = ?","P(A) + P(B) − P(A ∩ B)",["P(A) + P(B)","P(A)·P(B)","P(A) − P(B)"],["Kesishma ikki marta sanaladi"]]
  ];
  G.t93=function(L){
    var k=pick(lv(L,[0,1,2,3,8],[0,1,2,3,4,5,8],[4,5,6,7,8,9]));
    if(k===0){var d=pick([10,20,25,50]),m=R(1,d-1);return frQ("Hodisa ehtimolligi "+fr(m,d)+" bo'lsa, unga qarama-qarshi hodisa ehtimolligi?",d-m,d,["1 − "+fr(m,d)]);}
    if(k===1){var a=pick([2,3,4,5]),b=pick([2,3,4,5]);return frQ("Ikkita bog'liq bo'lmagan hodisa ehtimolliklari 1/"+a+" va 1/"+b+". Ikkalasi ham ro'y berish ehtimolligi?",1,a*b,["1/"+a+" · 1/"+b+" = 1/"+a*b]);}
    if(k===2){var d2=pick([10,12,20]);var p=R(1,3),q=R(1,3);return frQ("Birgalikda bo'lmagan hodisalar ehtimolliklari "+p+"/"+d2+" va "+q+"/"+d2+". Ulardan biri ro'y berish ehtimolligi?",p+q,d2,["Qo'shamiz: "+(p+q)+"/"+d2]);}
    if(k===3)return frQ("Tanga ketma-ket 3 marta tashlandi. Hammasida gerb tushish ehtimolligi?",1,8,["(1/2)³ = 1/8"]);
    if(k===4){var a4=R(2,5),b4=R(a4+1,8);return frQ("Birinchi o'q mo'ljalga tegish ehtimolligi "+a4+"/10, ikkinchisiniki "+b4+"/10. Ikkalasi ham tegish ehtimolligi?",a4*b4,100,["("+a4+"/10)·("+b4+"/10) = "+a4*b4+"/100"]);}
    if(k===5)return frQ("Qutida 3 oq, 2 qora shar. Ketma-ket (qaytarmasdan) ikkita oq shar olish ehtimolligi?",3,10,["3/5 · 2/4 = 6/20 = 3/10"]);
    if(k===6)return frQ("Qutida 4 oq, 2 qora shar. Ketma-ket qaytarmasdan ikkita qora shar olish ehtimolligi?",1,15,["2/6 · 1/5 = 2/30 = 1/15"]);
    if(k===7)return frQ("A va B hodisalar: P(A) = 1/2, P(B) = 1/3, P(A∩B) = 1/6. P(A∪B) ni toping.",2,3,["1/2 + 1/3 − 1/6 = 3/6 + 2/6 − 1/6 = 4/6 = 2/3"]);
    if(k===8){var n=R(2,4);return frQ("Tanga "+n+" marta tashlanganda kamida bir marta gerb tushish ehtimolligi? (1 − (1/2)^"+n+")",Math.pow(2,n)-1,Math.pow(2,n),["1 − 1/"+Math.pow(2,n)+" = "+fr(Math.pow(2,n)-1,Math.pow(2,n))]);}
    if(k===9)return frQ("Ikki o'yin kubigida kamida bittasida 6 tushish ehtimolligi?",11,36,["1 − (5/6)² = 1 − 25/36 = 11/36"]);
    return bank(T93);
  };

  /* 94 To'plamlar */
  var T94=[
   ["To'plam elementi belgisi?","∈",["⊂","∪","∅"],["a ∈ A — a element A ga tegishli"]],
   ["A ⊂ B nimani bildiradi?","A ning har bir elementi B ga ham tegishli",["A va B teng emas","A va B kesishmaydi","B ning bitta elementi A da"],["A — B ning qismi"]],
   ["Bo'sh to'plam belgisi?","∅",["0","{0}","∈"],["Elementi yo'q to'plam"]],
   ["A ∩ B nima?","A va B ning umumiy elementlari",["barcha elementlari","A ning B dan farqi","faqat B ning elementlari"],["Kesishma"]],
   ["A ∪ B nima?","A yoki B ga tegishli barcha elementlar",["umumiy elementlar","A ning B dan farqi","B ning to'ldiruvchisi"],["Birlashma"]]
  ];
  function setStr(a){return "{"+a.join(", ")+"}";}
  G.t94=function(L){
    var k=pick(lv(L,[0,1,2,3,4,9],[0,1,2,3,4,5,6,9],[4,5,6,7,8,9]));
    var a=[],b=[];var pool=[1,2,3,4,5,6,7,8,9,10,11,12];
    pool.sort(function(){return Math.random()-.5;});
    a=pool.slice(0,5).sort(function(x,y){return x-y;});
    b=pool.slice(3,8).sort(function(x,y){return x-y;});
    var inter=a.filter(function(x){return b.indexOf(x)>=0;});
    var uni=a.concat(b.filter(function(x){return a.indexOf(x)<0;})).sort(function(x,y){return x-y;});
    var diff=a.filter(function(x){return b.indexOf(x)<0;});
    if(k===0)return numQ("A = "+setStr(a)+" va B = "+setStr(b)+". A ∩ B nechta elementdan iborat?",inter.length,["Umumiy: "+setStr(inter)]);
    if(k===1)return numQ("A = "+setStr(a)+" va B = "+setStr(b)+". A ∪ B nechta elementdan iborat?",uni.length,["Birlashma: "+setStr(uni)]);
    if(k===2)return numQ("A = "+setStr(a)+" va B = "+setStr(b)+". A \\ B nechta elementdan iborat?",diff.length,["A ning B da yo'q elementlari: "+setStr(diff)]);
    if(k===3){var n=R(2,6);return numQ(n+" elementli to'plamning nechta qism to'plami bor?",Math.pow(2,n),["2^"+n+" = "+Math.pow(2,n)]);}
    if(k===4){var n4=R(3,6);return numQ(n4+" elementli to'plamning nechta xos qism to'plami (o'zidan boshqa) bor?",Math.pow(2,n4)-1,["2^"+n4+" − 1 = "+(Math.pow(2,n4)-1)]);}
    if(k===5){var n5=R(4,8),m5=R(2,3);return numQ(n5+" elementli to'plamning "+m5+" elementli qism to'plamlari soni?",C(n5,m5),["C("+n5+","+m5+") = "+C(n5,m5)]);}
    if(k===6){var x=R(2,6),y=R(2,6);return numQ("A to'plamda "+x+" ta, B to'plamda "+y+" ta element bor, ular kesishmaydi. A ∪ B da nechta element?",x+y,[x+" + "+y+" = "+(x+y)]);}
    if(k===7){var n7=R(2,5);return numQ("A × B dekart ko'paytmasi: |A| = "+n7+", |B| = "+(n7+1)+". Nechta juft bor?",n7*(n7+1),[n7+"·"+(n7+1)+" = "+n7*(n7+1)]);}
    if(k===8){var n8=R(10,20);return numQ("1 dan "+n8+" gacha natural sonlar to'plamidan juft sonlar nechta?",Math.floor(n8/2),["["+n8+"/2] = "+Math.floor(n8/2)]);}
    if(k===9)return bank(T94);
    return bank(T94);
  };

  /* 95 Eyler–Venn va inkluziya-eksklyuziya */
  var T95=[
   ["Inkluziya–eksklyuziya formulasi ikki to'plam uchun?","|A ∪ B| = |A| + |B| − |A ∩ B|",["|A| + |B|","|A|·|B|","|A| − |B|"],["Kesishma ikki marta sanaladi"]]
  ];
  G.t95=function(L){
    var k=pick(lv(L,[0,1,2],[0,1,2,3,4],[3,4,5,6]));
    if(k===0){var a=R(10,25),b=R(10,25),c=R(2,8);return numQ("Sinfda "+a+" kishi matematikani, "+b+" kishi fizikani yaxshi ko'radi, "+c+" kishi ikkalasini. Kamida bittasini yaxshi ko'radiganlar soni?",a+b-c,[a+" + "+b+" − "+c+" = "+(a+b-c)]);}
    if(k===1){var n=R(25,40),a1=R(10,20),b1=R(10,20),c1=R(3,8);if(a1+b1-c1>n)return bank(T95);return numQ("Sinfda "+n+" o'quvchi: "+a1+" tasi ingliz, "+b1+" tasi rus tilini o'rganadi, "+c1+" tasi ikkalasini. Hech qaysi tilni o'rganmaydiganlar soni?",n-(a1+b1-c1),["Kamida bittasi: "+(a1+b1-c1),n+" − "+(a1+b1-c1)+" = "+(n-(a1+b1-c1))]);}
    if(k===2){var a2=R(12,30),b2=R(12,30),u=R(a2+b2-10,a2+b2-3);if(u<Math.max(a2,b2))return bank(T95);return numQ("|A| = "+a2+", |B| = "+b2+", |A ∪ B| = "+u+". |A ∩ B| ni toping.",a2+b2-u,[a2+" + "+b2+" − "+u+" = "+(a2+b2-u)]);}
    if(k===3){var n3=pick([60,100,120]);var d=pick([[2,3],[3,5],[2,5]]);var cnt=Math.floor(n3/d[0])+Math.floor(n3/d[1])-Math.floor(n3/(d[0]*d[1]));return numQ("1 dan "+n3+" gacha sonlardan nechtasi "+d[0]+" ga yoki "+d[1]+" ga bo'linadi?",cnt,[Math.floor(n3/d[0])+" + "+Math.floor(n3/d[1])+" − "+Math.floor(n3/(d[0]*d[1]))+" = "+cnt]);}
    if(k===4){var n4=pick([60,100,120]);var d4=pick([[2,3],[3,5],[2,5]]);var cnt4=n4-(Math.floor(n4/d4[0])+Math.floor(n4/d4[1])-Math.floor(n4/(d4[0]*d4[1])));return numQ("1 dan "+n4+" gacha sonlardan nechtasi "+d4[0]+" ga ham, "+d4[1]+" ga ham bo'linmaydi?",cnt4,[n4+" − (yoki-yoki bo'linadiganlar)"]);}
    if(k===5){var abc=R(1,2),ab=abc+R(1,3),bc=abc+R(1,2),ac=abc+R(1,2),a5=ab+ac-abc+R(3,9),b5=ab+bc-abc+R(3,8),c5=bc+ac-abc+R(2,6);return numQ("Uch to'plam: |A| = "+a5+", |B| = "+b5+", |C| = "+c5+", |A∩B| = "+ab+", |B∩C| = "+bc+", |A∩C| = "+ac+", |A∩B∩C| = "+abc+". |A∪B∪C| ni toping.",a5+b5+c5-ab-bc-ac+abc,["Σ − ikkitalik kesishmalar + uchtalik kesishma","= "+(a5+b5+c5-ab-bc-ac+abc)]);}
    if(k===6){var n6=R(20,30),a6=R(10,18);return numQ("Sinfda "+n6+" o'quvchi, "+a6+" tasi futbolni yaxshi ko'radi. Futbolni yoqtirmaydiganlar soni?",n6-a6,[n6+" − "+a6+" = "+(n6-a6)]);}
    return bank(T95);
  };

  /* 96 Nyuton binomi */
  var T96=[
   ["(a + b)ⁿ yoyilmasida nechta had bor?","n + 1",["n","n − 1","2n"],["Darajalar a ⁿ dan bⁿ gacha"]],
   ["Nyuton binomining umumiy hadi?","Cₙᵏ·aⁿ⁻ᵏ·bᵏ",["Cₙᵏ·aᵏ·bᵏ","Aₙᵏ·aᵏ","n!·aᵏ·bᵏ"],["T(k+1)"]],
   ["Binomial koeffitsiyentlar yig'indisi Σ Cₙᵏ = ?","2ⁿ",["n²","n!","2n"],["(1+1)ⁿ = 2ⁿ"]]
  ];
  G.t96=function(L){
    var k=pick(lv(L,[0,1,2,3],[0,1,2,3,4,5],[3,4,5,6,7]));
    if(k===0){var n=R(4,12);return numQ("(a + b)^"+n+" yoyilmasida nechta had bor?",n+1,["n + 1 = "+(n+1)]);}
    if(k===1){var n1=R(3,8);return numQ("(a + b)^"+n1+" yoyilmasi koeffitsiyentlari yig'indisi?",Math.pow(2,n1),["a = b = 1: 2^"+n1+" = "+Math.pow(2,n1)]);}
    if(k===2){var n2=R(4,8),m=R(1,3);return numQ("(a + b)^"+n2+" yoyilmasida a^"+(n2-m)+"·b^"+m+" hadning koeffitsiyenti?",C(n2,m),["C("+n2+","+m+") = "+C(n2,m)]);}
    if(k===3){var n3=R(4,8);return numQ("(x + 1)^"+n3+" yoyilmasida x² oldidagi koeffitsiyent?",C(n3,2),["C("+n3+",2) = "+C(n3,2)]);}
    if(k===4){var n4=R(3,6);return numQ("(2 + x)^"+n4+" yoyilmasida x² oldidagi koeffitsiyent?",C(n4,2)*Math.pow(2,n4-2),["C("+n4+",2)·2^"+(n4-2)+" = "+C(n4,2)*Math.pow(2,n4-2)]);}
    if(k===5){var n5=R(4,9);return numQ("C("+n5+",0) + C("+n5+",1) + … + C("+n5+","+n5+") yig'indisini toping.",Math.pow(2,n5),["2^"+n5+" = "+Math.pow(2,n5)]);}
    if(k===6){var n6=R(5,10);return numQ("(a + b)^"+n6+" yoyilmasidagi eng katta binomial koeffitsiyent nechaga teng?",C(n6,Math.floor(n6/2)),["C("+n6+","+Math.floor(n6/2)+") = "+C(n6,Math.floor(n6/2))]);}
    if(k===7){var n7=R(3,6);return numQ("(x − 1)^"+n7+" yoyilmasida barcha koeffitsiyentlar yig'indisi (x = 1 qo'yiladi) nechaga teng?",0,["(1 − 1)^"+n7+" = 0"]);}
    return bank(T96);
  };

  S.registerAll(G,{t89:"Faktorial",t90:"Kombinatorikaning asosiy qoidalari",t91:"O'rin almashtirish, o'rinlashtirish va guruhlash",t92:"Ehtimollik: klassik ta'rif",t93:"Ehtimollik qoidalari",t94:"To'plamlar nazariyasi asoslari",t95:"Eyler–Venn doiralari va kiritish-chiqarish formulasi",t96:"Nyuton binomi"});
})();
