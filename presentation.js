(() => {
  const {product,folder,before,total}=document.body.dataset;
  const split=Number(before), count=Number(total), $=id=>document.getElementById(id);
  let page=1, step='slides';
  const source=n=>`assets/slides/${folder}/slide-${String(n).padStart(2,'0')}.jpg`;
  function show(nextStep, nextPage) {
    step=nextStep;
    if(nextPage) page=nextPage;
    $('deck').hidden=step==='calc'; $('calc').hidden=step!=='calc';
    document.querySelectorAll('[data-step]').forEach(button=>{
      const active=button.dataset.step===step;
      button.classList.toggle('on',active);
      button.setAttribute('aria-current',active?'step':'false');
    });
    if(step==='calc') return;
    $('loadError').hidden=true;
    $('slide').src=source(page);
    $('slide').alt=`${product} · diapositiva original ${page} de ${count}`;
    $('counter').textContent=`${page} / ${count}`;
    $('prev').disabled=page===1;
    $('next').textContent=page===split?'Tus números →':page===count?'Finalizar asesoría →':'Siguiente →';
    if(page<count) { const preload=new Image(); preload.src=source(page+1); }
  }
  function finish(){
    const calculation=AscenderSession.getCalculation();
    if(!calculation||calculation.product!==product){
      if(!confirm('No hay un cálculo guardado para este producto. ¿Quieres finalizar la asesoría de todas formas?')) return;
      AscenderSession.clearCalculation();
    }
    location.href='proposal.html';
  }
  $('slide').onerror=()=>{$('loadError').hidden=false};
  $('retry').onclick=()=>show(step,page);
  $('prev').onclick=()=>page===split+1?show('calc'):show(page-1>split?'close':'slides',page-1);
  $('next').onclick=()=>page===split?show('calc'):page===count?finish():show(page+1>split?'close':'slides',page+1);
  $('backToDeck').onclick=()=>show('slides',split);
  $('continueDeck').onclick=()=>show('close',split+1);
  $('finish').onclick=finish;
  document.querySelectorAll('[data-step]').forEach(button=>button.onclick=()=>show(button.dataset.step,button.dataset.step==='close'?split+1:button.dataset.step==='slides'?1:undefined));
  document.addEventListener('keydown',event=>{
    if(step==='calc'||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT|BUTTON|A/.test(event.target.tagName)) return;
    if(event.key==='ArrowRight'){event.preventDefault();$('next').click()}
    if(event.key==='ArrowLeft'){event.preventDefault();$('prev').click()}
  });
  show('slides',1);
})();
