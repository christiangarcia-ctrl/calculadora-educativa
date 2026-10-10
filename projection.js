/* Proyección ilustrativa mensual. Reglas: Folleto OptiMaxx educación 2025,
   páginas 8–11. El orden intramensual y las tarifas de riesgo requieren
   conciliación con una corrida oficial; no reproduce el simulador de Allianz. */
(function(root){
'use strict';
function calcularBono(plazoAnos,aportAnual){
  if(aportAnual<24000) return {pct:0,na:true};
  const row=plazoAnos<15?0:plazoAnos<20?1:2;
  const col=aportAnual<36000?0:aportAnual<60000?1:aportAnual<90000?2:3;
  const pct=[[null,15,25,35],[30,40,50,60],[55,65,75,100]][row][col];
  return {pct:pct===null?0:pct,na:pct===null};
}
function proyectar(p){
  for(const k of ['monthly','years','rate','increase','udi','udiGrowth','admin','management','fixedUdis','opening','insurance']){
    if(!Number.isFinite(p[k])) throw new Error('Falta un parámetro numérico: '+k);
  }
  if(!Number.isInteger(p.years)||p.years<10||p.years>25)throw new Error('El plazo debe ser de 10 a 25 años.');
  if(p.monthly<=0||p.udi<=0||p.rate<=-100||[p.increase,p.udiGrowth,p.admin,p.management,p.fixedUdis,p.opening,p.insurance].some(v=>v<0)||p.admin>1.5||p.management>0.1||p.fixedUdis>25)throw new Error('Revisa los montos, tasas y cargos.');
  const bono=calcularBono(p.years,p.monthly*12),bonusAmount=p.monthly*12*bono.pct/100;
  let initial=0,committed=0,totalContributions=0,totalCharges=0,totalBonus=0;
  const monthlyRate=Math.pow(1+p.rate/100,1/12)-1,rows=[];
  let exhausted=false;
  function deduct(amount,fromInitial){
    const actual=Math.min(initial+committed,amount);
    if(actual+1e-8<amount) exhausted=true;
    if(fromInitial){const x=Math.min(initial,actual);initial-=x;committed-=actual-x;}
    else {const x=Math.min(committed,actual);committed-=x;initial-=actual-x;}
    totalCharges+=actual;return actual;
  }
  for(let y=1;y<=p.years;y++){
    let annual=0,chargesStart=totalCharges;
    const contribution=p.monthly*Math.pow(1+p.increase/100,y-1);
    for(let month=1;month<=12;month++){
      const m=(y-1)*12+month;
      if(m<=18)initial+=contribution;else committed+=contribution;
      annual+=contribution;totalContributions+=contribution;
      // Monthly bonus installments during the first twelve contributions.
      if(m<=12){initial+=bonusAmount/12;totalBonus+=bonusAmount/12;}
      if(m===1)deduct(p.opening,true);
      const management=(initial+committed)*p.management/100;
      const total=initial+committed;
      if(total>0){const ratio=initial/total;initial-=management*ratio;committed-=management*(1-ratio);totalCharges+=management;}
      if(m>=19)deduct(p.fixedUdis*p.udi*Math.pow(1+p.udiGrowth/100,(m-1)/12),false);
      deduct(p.insurance,false);
      initial*=1+monthlyRate;committed*=1+monthlyRate;
      if(m%3===0){const charge=initial*p.admin/100;initial-=charge;totalCharges+=charge;}
    }
    const fund=initial+committed,available=y===p.years?fund:committed;
    rows.push({year:y,annual,accumulated:totalContributions,fund,available,withdrawalNet:y===p.years?available:available*0.99,charges:totalCharges-chargesStart,initial,committed});
  }
  return {rows,bonusPct:bono.pct,bonusNA:bono.na,bonusAmount,totalBonus,totalContributions,totalCharges,fund:initial+committed,exhausted};
}
const api={calcularBono,proyectar};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EducationProjection=api;
})(typeof globalThis==='undefined'?this:globalThis);
