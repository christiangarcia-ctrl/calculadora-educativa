const assert=require('node:assert/strict');const {proyectar,calcularBono}=require('../projection.js');
const base={monthly:3000,years:10,rate:0,increase:0,udi:8,udiGrowth:0,admin:0,management:0,fixedUdis:0,opening:0,insurance:0};
let r=proyectar(base);assert.equal(r.totalContributions,360000);assert.equal(r.bonusAmount,5400);assert.equal(r.fund,365400);assert.equal(r.rows[0].available,0);assert.equal(r.rows[1].available,18000);assert.equal(r.rows[9].available,r.fund);
assert.equal(calcularBono(10,24000).na,true);assert.equal(calcularBono(14,36000).pct,15);assert.equal(calcularBono(15,24000).pct,30);assert.equal(calcularBono(20,90000).pct,100);assert.equal(calcularBono(19,60000).pct,50);
r=proyectar({...base,increase:5});assert(Math.abs(r.rows[1].annual-37800)<1e-6);
r=proyectar({...base,opening:500,insurance:100,fixedUdis:25});assert.equal(r.totalCharges,500+12000+102*200);
for(let years=10;years<=25;years++){r=proyectar({...base,years,rate:8,admin:1.5,management:0.1,fixedUdis:25,opening:500,insurance:100});assert.equal(r.rows.length,years);assert(r.rows.every(x=>x.available<=x.fund+1e-6&&x.available>=0));}
console.log('Proyección: bonos, 16 plazos, cargos, incrementos y liquidez correctos en las pruebas.');
