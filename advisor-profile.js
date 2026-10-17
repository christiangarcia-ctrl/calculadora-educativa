(()=>{
 const $=id=>document.getElementById(id), a=AscenderSession.getAdvisor()||{};
 let photo=a.photo||'',credentialImage=a.credentialImage||'',source=null,pending=0;
 for(const [id,key]of Object.entries({advisorName:'name',advisorPhone:'phone',credentialHolder:'credentialHolder',credentialNumber:'credentialNumber',credentialRole:'credentialRole'}))if(a[key])$(id).value=a[key];
 function status(text){$('profileStatus').textContent=text}
 function preview(){
  $('photoPreview').hidden=!photo;if(photo)$('photoPreview').src=photo;
  $('credentialPreview').hidden=!credentialImage;if(credentialImage)$('credentialPreview').src=credentialImage;
 }
 function crop(){if(!source)return;photo=AdvisorImages.crop(source,Number($('photoZoom').value),Number($('photoX').value),Number($('photoY').value));preview()}
 for(const id of ['photoZoom','photoX','photoY'])$(id).addEventListener('input',crop);
 async function upload(kind,file){if(!file)return;pending++;status('Preparando imagen…');try{
  const img=await AdvisorImages.read(file);
  if(kind==='photo'){source=img;for(const id of ['photoX','photoY'])$(id).value=50;$('photoZoom').value=1;$('cropControls').hidden=false;crop()}
  else credentialImage=AdvisorImages.fit(img);
  preview();status('Imagen preparada. Guarda el perfil para conservarla.');
 }catch(e){status(e.message)}finally{pending--}}
 $('photoFile').onchange=e=>upload('photo',e.target.files[0]);$('credentialFile').onchange=e=>upload('credential',e.target.files[0]);
 $('removePhoto').onclick=()=>{photo='';source=null;$('photoFile').value='';$('cropControls').hidden=true;preview();status('Foto retirada. Guarda el perfil para confirmar.')};
 $('removeCredential').onclick=()=>{credentialImage='';$('credentialFile').value='';preview();status('Imagen de cédula retirada. Guarda el perfil para confirmar.')};
 function save(){
  if(pending){status('Espera a que termine de prepararse la imagen.');return null}
  const name=$('advisorName').value.trim(),phone=$('advisorPhone').value.trim(),credentialHolder=$('credentialHolder').value.trim(),credentialNumber=$('credentialNumber').value.trim();
  if(!name||phone.replace(/\D/g,'').length<10){status('Captura tu nombre y un teléfono de al menos 10 dígitos.');return null}
  if((credentialImage||credentialNumber)&&(!credentialHolder||!credentialNumber)){status('Indica el titular y número de la cédula que quieres mostrar.');return null}
  try{const result=AscenderSession.saveAdvisor({name,phone,photo,credentialImage,credentialHolder,credentialNumber,credentialRole:$('credentialRole').value});status('Perfil guardado en este navegador y dispositivo.');return result}catch(e){status('No se pudo guardar el perfil. El almacenamiento del navegador puede estar lleno o bloqueado. Retira una imagen o prueba una más pequeña.');return null}
 }
 $('saveProfile').onclick=save;$('start').onclick=()=>{if(save())location.href='home.html'};$('proposal').onclick=()=>{if(save())location.href='proposal.html'};
 const calc=AscenderSession.getCalculation();if(calc){$('existing').classList.add('show');$('existingText').textContent='Hay un cálculo guardado de '+(calc.clientName||'la última asesoría')+'. Puedes continuar a la propuesta.'}
 preview();
})();
