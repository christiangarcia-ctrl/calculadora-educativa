window.AdvisorImages={
  load(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('No se pudo leer la imagen. Usa una foto JPG, PNG o WebP.'));img.src=src})},
  crop(img,zoom=1,x=50,y=50,size=640){
    const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');const side=Math.min(img.width,img.height)/zoom;
    ctx.drawImage(img,(img.width-side)*x/100,(img.height-side)*y/100,side,side,0,0,size,size);return c.toDataURL('image/jpeg',.86);
  },
  async read(file){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Usa una imagen JPG, PNG o WebP.');
    if(file.size>12*1024*1024)throw Error('La imagen debe pesar menos de 12 MB.');
    return this.load(await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('No se pudo abrir el archivo.'));r.readAsDataURL(file)}));
  },
  fit(img){const c=document.createElement('canvas'),scale=Math.min(1,1000/Math.max(img.width,img.height));c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.87)}
};
