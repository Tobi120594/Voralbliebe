async function submitAjax(form,alertEl){
  const box=document.querySelector(alertEl); box.className='alert'; box.textContent='';
  try{const r=await fetch(form.action,{method:'POST',body:new FormData(form)}); const data=await r.json(); box.textContent=data.message||'Vielen Dank!'; box.classList.add('show',data.ok?'success':'error'); if(data.ok){form.reset(); if(form.id==='checkoutForm'){localStorage.removeItem('voralbliebe-cart'); setTimeout(()=>location.reload(),1300)}}}
  catch(e){box.textContent='Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal.';box.classList.add('show','error')}
}
document.addEventListener('DOMContentLoaded',()=>{
  const cf=document.querySelector('#contactForm'); if(cf)cf.addEventListener('submit',e=>{e.preventDefault();submitAjax(cf,'#contactAlert')});
  const of=document.querySelector('#checkoutForm'); if(of)of.addEventListener('submit',e=>{e.preventDefault();submitAjax(of,'#orderAlert')});
});
