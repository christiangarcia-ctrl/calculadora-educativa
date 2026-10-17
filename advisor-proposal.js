(()=>{
 const a=AscenderSession.getAdvisor();if(!a)return;
 function image(src,alt){if(!/^data:image\/(jpeg|png|webp);base64,/.test(src||''))return null;const img=document.createElement('img');img.src=src;img.alt=alt;return img}
 const card=document.getElementById('proposalAdvisor'),photo=image(a.photo,'Foto del asesor');if(photo)card.append(photo);
 const info=document.createElement('div'),name=document.createElement('strong'),phone=document.createElement('p');name.textContent=a.name||'';phone.textContent=a.phone||'';info.append(name,phone);card.append(info);
 if(a.credentialHolder&&a.credentialNumber){const box=document.getElementById('proposalCredential'),img=image(a.credentialImage,'Cédula del titular indicado');if(img)box.append(img);const detail=document.createElement('div');for(const line of [a.credentialRole==='propia'?'Cédula del asesor':'Cédula de respaldo',a.credentialHolder,'CNSF '+a.credentialNumber]){const p=document.createElement('p');p.textContent=line;detail.append(p)}box.append(detail)}
})();
