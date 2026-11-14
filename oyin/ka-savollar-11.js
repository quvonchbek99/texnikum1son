/*! Kuvonch Academy — 97–98: Fizika uchun matematika (formulalar bilan ishlash, o'lchov birliklari) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, nearW = H.nearW, G = {};
  function uniq(a){var s={},o=[];a.forEach(function(x){x=String(x);if(!s[x]){s[x]=1;o.push(x);}});return o;}
  function numQ(q,a,steps,hint){var ws=nearW(a,4,Math.max(2,Math.round(Math.abs(a)*.25))).filter(function(x){return x!==a&&x>=0;});return{q:q,a:a,hint:hint||"son",w:ws.slice(0,5),steps:steps};}
  function txtQ(q,a,w,steps,hint){return{q:q,a:a,hint:hint||"javob",type:"text",w:uniq(w).filter(function(x){return x!==String(a);}).slice(0,4),steps:steps};}
  function bank(l){var it=pick(l);return txtQ(it[0],it[1],it[2],it[3]);}
  function lv(L,a,b,c){return L===1?a:L===2?b:c;}
  function m2(x){return Math.round(x*100)/100;}

  /* 97 Fizika formulalari bilan ishlash: v=s/t, F=ma, ρ=m/V, I=U/R, A=F·s, P=A/t, p=F/S, Q=cmΔt, Ek=mv²/2, P=mg */
  var T97=[
   ["Tezlik formulasi?","v = s/t",["v = s·t","v = t/s","v = s + t"],["Yo'l / vaqt"]],
   ["Nyutonning II qonuni?","F = m·a",["F = m/a","F = m + a","F = a/m"],["Kuch = massa × tezlanish"]],
   ["Om qonuni?","I = U/R",["I = U·R","I = R/U","U = I/R"],["Tok kuchi = kuchlanish / qarshilik"]],
   ["Zichlik formulasi?","ρ = m/V",["ρ = m·V","ρ = V/m","ρ = m + V"],["Massa / hajm"]],
   ["Mexanik ish formulasi?","A = F·s",["A = F/s","A = s/F","A = F + s"],["Kuch × yo'l"]],
   ["Quvvat formulasi?","P = A/t",["P = A·t","P = t/A","P = A + t"],["Ish / vaqt"]],
   ["Bosim formulasi?","p = F/S",["p = F·S","p = S/F","p = F + S"],["Kuch / yuza"]],
   ["Kinetik energiya formulasi?","E = mv²/2",["E = mv/2","E = m²v/2","E = mv²"],["Massa × tezlik kvadrati / 2"]]
  ];
  G.t97=function(L){
    var k=pick(lv(L,[0,1,2,3,10],[1,2,3,4,5,6,7,10],[5,6,7,8,9,11,12]));
    if(k===0){var t=R(2,8),v=R(5,30),s=v*t;return numQ("Avtomobil "+s+" m yo'lni "+t+" s da bosib o'tdi. Tezligi (m/s)?",v,["v = s/t = "+s+"/"+t+" = "+v+" m/s"]);}
    if(k===1){var m=R(2,20),a=R(1,5);return numQ("Massasi "+m+" kg bo'lgan jismga "+a+" m/s² tezlanish berish uchun kuch (N)?",m*a,["F = m·a = "+m+"·"+a+" = "+(m*a)+" N"]);}
    if(k===2){var I=R(1,6),Rr=pick([2,3,4,5,10,12]);return numQ("Qarshiligi "+Rr+" Ω o'tkazgichdan "+I+" A tok o'tmoqda. Kuchlanish (V)?",I*Rr,["U = I·R = "+I+"·"+Rr+" = "+(I*Rr)+" V"]);}
    if(k===3){var V=R(2,10),rho=pick([1,2,5,7,8,10]);return numQ("Hajmi "+V+" m³, zichligi "+rho+" kg/m³ bo'lgan jism massasi (kg)?",V*rho,["m = ρ·V = "+rho+"·"+V+" = "+(V*rho)+" kg"]);}
    if(k===4){var F=R(5,40),sd=R(2,15);return numQ(F+" N kuch jismni "+sd+" m ga siljitdi. Bajarilgan ish (J)?",F*sd,["A = F·s = "+F+"·"+sd+" = "+(F*sd)+" J"]);}
    if(k===5){var P=R(5,50),t2=R(2,10);return numQ("Quvvati "+P+" W bo'lgan dvigatel "+t2+" s da qancha ish bajaradi (J)?",P*t2,["A = P·t = "+P+"·"+t2+" = "+(P*t2)+" J"]);}
    if(k===6){var S2=pick([2,4,5,10]),p=R(10,60);return numQ("Yuzasi "+S2+" m² bo'lgan yuzaga "+p+" Pa bosim ta'sir qilmoqda. Kuch (N)?",p*S2,["F = p·S = "+p+"·"+S2+" = "+(p*S2)+" N"]);}
    if(k===7){var m3=R(1,10);return numQ("Massasi "+m3+" kg jismning og'irligi (N)? g = 10 m/s²",m3*10,["P = m·g = "+m3+"·10 = "+(m3*10)+" N"]);}
    if(k===8){var m4=R(1,6),v4=pick([2,4,6,10]);return numQ("Massasi "+m4+" kg, tezligi "+v4+" m/s bo'lgan jismning kinetik energiyasi (J)?",m4*v4*v4/2,["E = mv²/2 = "+m4+"·"+v4+"²/2 = "+(m4*v4*v4/2)+" J"]);}
    if(k===9){var c=pick([1,2,4]),m5=R(1,5),dt=R(5,20);return numQ("c = "+c+" kJ/(kg·°C), m = "+m5+" kg, Δt = "+dt+" °C. Issiqlik miqdori (kJ)?",c*m5*dt,["Q = c·m·Δt = "+c+"·"+m5+"·"+dt+" = "+(c*m5*dt)+" kJ"]);}
    if(k===10){var s6=R(2,5)*R(10,30),v6=pick([2,4,5,10]);while(s6%v6)s6=v6*R(5,20);return numQ("Tezligi "+v6+" m/s bo'lgan velosipedchi "+s6+" m ni necha sekundda bosib o'tadi?",s6/v6,["t = s/v = "+s6+"/"+v6+" = "+(s6/v6)+" s"]);}
    if(k===11){var F7=R(10,50),a7=pick([2,5,10]);while(F7%a7)F7=a7*R(2,10);return numQ("F = "+F7+" N kuch jismga "+a7+" m/s² tezlanish berdi. Jism massasi (kg)?",F7/a7,["m = F/a = "+F7+"/"+a7+" = "+(F7/a7)+" kg"]);}
    if(k===12){var U=pick([12,24,36,48,60,120,220]),I2=pick([2,3,4,5,6,10]);while(U%I2)I2=pick([2,3,4,5,6,10]);return numQ("Kuchlanish "+U+" V, tok kuchi "+I2+" A. Qarshilik (Ω)?",U/I2,["R = U/I = "+U+"/"+I2+" = "+(U/I2)+" Ω"]);}
    return bank(T97);
  };

  /* 98 O'lchov birliklari va shkala: km↔m, soat↔s, km/soat↔m/s, g↔kg, sm²↔m², masshtab, foiz-xatolik */
  var T98=[
   ["1 km necha metr?","1000",["100","10000","10"],["kilo = 1000"]],
   ["1 soat necha sekund?","3600",["60","600","360"],["60·60 = 3600"]],
   ["1 m² necha sm²?","10000",["100","1000","10"],["100·100 = 10 000"]],
   ["1 litr necha sm³?","1000",["100","10","10000"],["1 l = 1 dm³ = 1000 sm³"]],
   ["36 km/soat necha m/s?","10",["36","3,6","100"],["36 000 m / 3600 s = 10 m/s"]],
   ["1 tonna necha kg?","1000",["100","10000","10"],["1 t = 1000 kg"]]
  ];
  G.t98=function(L){
    var k=pick(lv(L,[0,1,2,8],[2,3,4,5,8,9],[4,5,6,7,9,10]));
    if(k===0){var km=R(2,30);return numQ(km+" km necha metr?",km*1000,[km+"·1000 = "+(km*1000)+" m"]);}
    if(k===1){var h=R(2,6);return numQ(h+" soat necha sekund?",h*3600,[h+"·3600 = "+(h*3600)+" s"]);}
    if(k===2){var v=pick([18,36,54,72,90,108]);return numQ(v+" km/soat necha m/s?",v/3.6,[v+"·1000/3600 = "+v+"/3,6 = "+(v/3.6)+" m/s"]);}
    if(k===3){var ms=pick([5,10,15,20,25,30]);return numQ(ms+" m/s necha km/soat?",ms*3.6,[ms+"·3,6 = "+(ms*3.6)+" km/soat"]);}
    if(k===4){var a=R(2,9),b=R(2,9);return numQ(a+" m × "+b+" m xonaning yuzi necha sm²?",a*b*10000,[a*b+" m² · 10 000 = "+(a*b*10000)+" sm²"]);}
    if(k===5){var g=pick([250,500,750,1500,2500,3500]);return numQ(g+" g necha kg? (kasr bilan)",m2(g/1000),[g+"/1000 = "+(g/1000)+" kg"],"kasr");}
    if(k===6){var sc=pick([100,1000,5000,10000,25000]),cm=R(2,12);return numQ("Masshtab 1:"+sc+". Xaritada "+cm+" sm — haqiqatda necha metr?",cm*sc/100,[cm+"·"+sc+" sm = "+(cm*sc)+" sm = "+(cm*sc/100)+" m"]);}
    if(k===7){var tr=R(80,200),iz=R(1,10);return numQ("Haqiqiy qiymat "+tr+", o'lchangan "+(tr+iz)+". Nisbiy xatolik (%)? (yaxlitlang)",Math.round(iz/tr*100),[iz+"/"+tr+"·100% ≈ "+Math.round(iz/tr*100)+"%"]);}
    if(k===8){var mm=pick([500,1500,2500,4000]);return numQ(mm+" mm necha metr? (kasr bilan)",m2(mm/1000),[mm+"/1000 = "+(mm/1000)+" m"],"kasr");}
    if(k===9){var d=R(2,9),l=R(2,9);return numQ("Hajmi "+d+" dm × "+l+" dm × 10 dm bo'lgan idishga necha litr suv sig'adi?",d*l*10,["1 dm³ = 1 l → "+d+"·"+l+"·10 = "+(d*l*10)+" l"]);}
    if(k===10){var kWh=R(2,9);return numQ(kWh+" kWh necha kJ?",kWh*3600,[kWh+"·3600 = "+(kWh*3600)+" kJ (1 kWh = 3600 kJ)"]);}
    return bank(T98);
  };

  S.registerAll(G,{t97:"Fizika uchun matematika: formulalar bilan ishlash",t98:"O'lchov birliklari va shkala"});
})();
