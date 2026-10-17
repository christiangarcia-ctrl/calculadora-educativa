window.AdvisorSlide={async render(src,advisor={}){
 const load=async value=>{if(!/^data:image\/(jpeg|png|webp);base64,/.test(value||''))return null;try{return await AdvisorImages.load(value)}catch(e){return null}};
 const [base,photo,credential]=await Promise.all([AdvisorImages.load(src),load(advisor.photo),load(advisor.credentialImage)]);
 const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;const ctx=canvas.getContext('2d');ctx.drawImage(base,0,0,1920,1080);
 function rect(x,y,w,h,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
 function text(value,x,y,max,size,color,weight='400',align='left'){
  let font=size;ctx.textAlign=align;ctx.fillStyle=color;
  do{ctx.font=`${weight} ${font}px Arial`;if(ctx.measureText(value).width<=max)break;font--}while(font>18);
  ctx.fillText(value,x,y,max);
 }
 // Replace every original identity pixel; shared branding stays untouched.
 rect(1103,164,729,813,'#063979',34);rect(118,690,925,258,'#fff');
 const cx=1467,cy=421,r=206;
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();rect(cx-r,cy-r,r*2,r*2,'#12558b');
 if(photo)ctx.drawImage(photo,cx-r,cy-r,r*2,r*2);
 else text((advisor.name||'Asesor').split(/\s+/).map(s=>s[0]).slice(0,2).join('').toUpperCase(),cx,cy+42,340,120,'#fff','700','center');
 ctx.restore();ctx.strokeStyle='#1ca4d1';ctx.lineWidth=8;ctx.beginPath();ctx.arc(cx,cy,r+2,0,Math.PI*2);ctx.stroke();
 const name=advisor.name||'Configura tu perfil de asesor';
 text(name,cx,736,650,58,'#fff','700','center');text('Equipo de ventas Ascender',cx,806,650,36,'#1ca4d1','700','center');text('Tu asesor financiero',cx,864,650,36,'#d1dbea','400','center');
 if(credential){const scale=Math.min(145/credential.width,235/credential.height);ctx.drawImage(credential,130+(145-credential.width*scale)/2,700+(235-credential.height*scale)/2,credential.width*scale,credential.height*scale)}
 const x=credential?308:145,max=credential?720:875;
 text(advisor.credentialRole==='propia'?'Cédula del asesor':'Cédula de respaldo',x,765,max,30,'#5b6570');
 text(advisor.credentialHolder||'Titular pendiente de configurar',x,821,max,36,'#063979','700');
 text(advisor.credentialNumber?'Cédula CNSF '+advisor.credentialNumber:'Número pendiente de configurar',x,879,max,30,'#156e9e','700');
 return canvas.toDataURL('image/jpeg',.94);
}};
