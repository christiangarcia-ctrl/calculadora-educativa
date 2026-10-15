/* PDF para lectura en teléfono: texto vectorial, páginas estrechas y enlace WhatsApp. */
(function(root){
'use strict';
function whatsapp(phone){const digits=String(phone).replace(/\D/g,'');if(!String(phone).trim().startsWith('+')||!/^[1-9]\d{9,14}$/.test(digits))throw Error('Captura el WhatsApp con código de país: por ejemplo, +52 y los 10 dígitos de México.');return 'https://wa.me/'+digits+'?text='+encodeURIComponent('Hola, ya revisé el escenario educativo y quiero avanzar. ¿Qué necesitamos para iniciar?');}
async function imageData(path){const image=new Image();image.src=path;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);return path.includes('logo')?canvas.toDataURL('image/png'):canvas.toDataURL('image/jpeg',0.86);}
function familyPhoto(){const f=root.familyProfile||{};const parent=(f.parentRole||'').toLowerCase();const child=(f.childGender||'').toLowerCase();if(parent==='mama'&&child==='hija')return 'familia-mama-hija.jpg';if(parent==='mama'&&child==='hijo')return 'familia-mama-hijo.jpg';if(parent==='papa'&&child==='hija')return 'familia-papa-hija.jpg';if(parent==='papa'&&child==='hijo')return 'familia-papa-hijo.jpg';return 'educacion-familia.jpg';}
async function generate(p,r,money){
 if(!root.jspdf)throw Error('No se cargó el generador de PDF. Intenta nuevamente.');
 const link=whatsapp(p.advisorPhone),[logo,photo,graduation,savings,goal,protection]=await Promise.all([imageData('logo-allianz-distribuidor.png'),imageData(familyPhoto()),imageData('educacion-graduacion.jpg'),imageData('educacion-ahorro.jpg'),imageData('educacion-meta.jpg'),imageData('educacion-proteccion.jpg')]);
 const doc=new root.jspdf.jsPDF({unit:'pt',format:[360,640],orientation:'portrait',compress:true});
 for(const [file,style]of [['OpenSans-Regular.ttf','normal'],['OpenSans-Bold.ttf','bold']]){const response=await fetch('fonts/'+file);if(!response.ok)throw Error('No se cargó la tipografía del reporte.');const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));doc.addFileToVFS(file,btoa(binary));doc.addFont(file,'Education',style);}const navy=[0,55,129],ink=[25,47,73],muted=[74,90,110],pale=[240,245,251];const margin=24,width=312;let y=0,first=true;
 doc.setProperties({title:'Plan educativo - '+p.hijo,subject:'Escenario ilustrativo de ahorro educativo',author:p.advisorName});
 function text(value,size=14,color=ink,bold=false){doc.setFont('Education',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);const lines=doc.splitTextToSize(String(value),width);const height=lines.length*size*1.25;if(y+height>587){page('Continuación');doc.setFont('Education',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);}doc.text(lines,margin,y+size,{lineHeightFactor:1.25});y+=height+9;}
 function page(title,illustration=null,ratio=1.6){if(!first)doc.addPage([360,640],'portrait');first=false;doc.setFillColor(255,255,255);doc.rect(0,0,360,640,'F');doc.addImage(logo,'PNG',margin,18,145,48);if(illustration)doc.addImage(illustration,'JPEG',280,20,56,56/ratio);doc.setDrawColor(217,228,240);doc.line(margin,78,336,78);y=91;text(title,22,navy,true);}
 function note(value){text(value,12,muted);}
 function metric(label,value){doc.setFont('Education','normal');doc.setFontSize(13);let lines=doc.splitTextToSize(label,width-28);doc.setFont('Education','bold');doc.setFontSize(23);const values=doc.splitTextToSize(String(value),width-28);const h=22+lines.length*16+values.length*28;if(y+h>587)page('Tu escenario');doc.setFillColor(...pale);doc.roundedRect(margin,y,width,h,10,10,'F');doc.setFont('Education','normal');doc.setFontSize(13);doc.setTextColor(...muted);doc.text(lines,margin+14,y+22);doc.setFont('Education','bold');doc.setFontSize(23);doc.setTextColor(...navy);doc.text(values,margin+14,y+26+lines.length*16);y+=h+12;}
 function pair(label,value){text(label,12,muted);text(value,15,ink,true);}
 page('Su futuro comienza hoy');
 doc.addImage(photo,'JPEG',49,y,262,208);y+=223;
 text('Un plan para acompañar sus posibilidades.',20,navy,true);
 text(p.hijo+' · '+p.childAge+' años hoy · '+(p.childAge+p.years)+' años al finalizar el plan.',14);
 note('Titular: '+p.titular+' · '+p.age+' años\nRFC: '+p.rfc);
 note('Preparado por '+p.advisorName+'\nWhatsApp: '+p.advisorPhone);
 note('Escenario ilustrativo. Rendimientos no garantizados.');
 page('El plan que elegiste',savings,940/576);
 metric('Aportación mensual inicial',money(p.monthly));metric('Fondo proyectado al finalizar',money(r.fund));
 text('Plazo: '+p.years+' años · incremento anual: '+p.increase+'%.',15,navy,true);
 note('Aportaciones acumuladas: '+money(r.totalContributions)+'. Tasa bruta supuesta: '+p.rate+'% anual efectiva, antes de cargos. El fondo mostrado ya descuenta los cargos modelados.');
 note('Bono nominal: '+r.bonusPct+'% · '+money(r.bonusAmount)+'. '+(r.bonusNA?'No aplica para este monto y plazo.':'Sobre la aportación del primer año; se acredita en doce partes mensuales y participa en rendimientos y cargos.'));
 note('Cómo se conserva: cumple las aportaciones iniciales y mantén vigente el plan. Después del plazo inicial puedes solicitar un descanso de hasta 12 meses sin perder el derecho al bono, avisando por escrito al menos 5 días hábiles antes del siguiente pago.');
 note('Portafolios: '+p.portfolios.map(x=>x.name+' '+x.percent+'%').join(' · '));
 if(r.exhausted)text('El saldo no cubrió todos los cargos. Ajusta este escenario antes de avanzar.',13,[150,30,30],true);
 page('Protección y condiciones',protection,942/889);
 const selected=coverageLines(p).filter((value,i)=>i===0||(i===1&&p.double)||(i===2&&p.life));text(selected.join(' '),14);
 note('Coberturas: '+money(p.insurance)+' al mes · '+(p.costConfirmed?'capturado de cotización':'estimado, pendiente de cotización')+'. Prima constante en este escenario. Sujeto a aceptación y condiciones de póliza.');
 text('Cargos del escenario',15,navy,true);
 note('Apertura: '+money(p.opening)+'. Administración: '+p.admin+'% trimestral sobre saldo inicial. Gestión: '+p.management+'% mensual sobre saldo del plan. Cargo fijo: '+p.fixedUdis+' UDIS al mes desde el mes 19.');
 note('Cargos totales modelados: '+money(r.totalCharges)+'. UDI inicial: '+p.udi.toFixed(6)+' MXN ('+(p.udiOfficial?'DOF '+p.udiDate:'manual')+'); crecimiento supuesto: '+p.udiGrowth+'% anual.');
 note('Las aportaciones de los primeros 18 meses y el bono permanecen restringidos durante el plazo. Desde el mes 19, los retiros parciales tienen cargo de 1% y requieren destino educativo. La cancelación total tiene cargos distintos, no calculados aquí.');
 note('Se supone continuidad, sin retiros ni pausas; no se calculan impuestos. El rendimiento no está garantizado. Confirma este escenario con una cotización y corrida oficial antes de contratar.');
 doc.setFontSize(12);doc.setTextColor(...navy);doc.textWithLink('Consultar folleto y condiciones de Allianz',margin,y+12,{url:'https://www.allianz.com.mx/content/dam/onemarketing/iberolatam/allianz-mx/ahorro---educaci%C3%B3n/educaci%C3%B3n-documentos/Folleto%20OptiMaxx%20educaci%C3%B3n%202025.pdf'});y+=26;
 page('Hagamos realidad su plan educativo');doc.addImage(graduation,'JPEG',90,y,180,171);y+=186;
 text('Ya imaginaste su futuro. Demos juntos el siguiente paso para empezar a construirlo.',18,navy,true);
 const buttonY=y+4;doc.setFillColor(...navy);doc.roundedRect(margin,buttonY,width,48,9,9,'F');doc.setFont('Education','bold');doc.setFontSize(16);doc.setTextColor(255,255,255);doc.text('Quiero avanzar con el plan',180,buttonY+30,{align:'center'});doc.link(margin,buttonY,width,48,{url:link});y=buttonY+65;
 note('Escribe a '+p.advisorName+'\nWhatsApp: '+p.advisorPhone);note('El botón abre un mensaje preparado. Tú decides cuándo enviarlo.');
 const count=doc.getNumberOfPages();for(let i=1;i<=count;i++){doc.setPage(i);doc.setFont('Education','normal');doc.setFontSize(10);doc.setTextColor(...muted);doc.text('Calculadora educativa · Escenario ilustrativo',margin,617);doc.text(i+' / '+count,336,617,{align:'right'});}
 return doc;
}
function coverageLines(p){return [p.basic?'Continuidad de aportaciones por fallecimiento e invalidez.':'Beneficio básico no incluido.',p.double?'Doble aportación seleccionada.':'Doble aportación no seleccionada.',p.life?'Vida complementaria: '+new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(p.sumInsured)+'.':'Vida complementaria no seleccionada.'];}
root.EducationReport={generate,whatsapp};
})(window);
