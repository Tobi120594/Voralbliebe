const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const money=v=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(v);
const cartKey='voralbliebe-cart';
let cart=JSON.parse(localStorage.getItem(cartKey)||'[]');
function saveCart(){localStorage.setItem(cartKey,JSON.stringify(cart));updateCartUI()}
function cartCount(){return cart.reduce((a,b)=>a+b.qty,0)}
function cartTotal(){return cart.reduce((sum,item)=>{const p=window.VORALB_PRODUCTS?.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0)}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();openCart()}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function updateCartUI(){
  $$('.cart-count').forEach(el=>el.textContent=cartCount());
  const wrap=$('#cartItems'); if(!wrap) return;
  if(!cart.length){wrap.innerHTML='<p>Dein Warenkorb ist noch leer.</p>'}
  else wrap.innerHTML=cart.map(item=>{const p=window.VORALB_PRODUCTS.find(x=>x.id===item.id);return `<div class="cart-item"><div class="mini">${p.emoji}</div><div><strong>${p.name}</strong><small>${item.qty} × ${money(p.price)}</small></div><button class="remove" data-remove="${p.id}" aria-label="Entfernen">×</button></div>`}).join('');
  $('#cartTotal') && ($('#cartTotal').textContent=money(cartTotal()));
  $$('[data-remove]').forEach(b=>b.onclick=()=>removeFromCart(b.dataset.remove));
}
function openCart(){ $('#cartDrawer')?.classList.add('open'); document.body.style.overflow='hidden'}
function closeCart(){ $('#cartDrawer')?.classList.remove('open'); document.body.style.overflow=''}
function renderProducts(target='#productGrid',limit=null,filter='all',search=''){
  const el=$(target); if(!el||!window.VORALB_PRODUCTS)return;
  let arr=window.VORALB_PRODUCTS.filter(p=>(filter==='all'||p.category===filter)&&p.name.toLowerCase().includes(search.toLowerCase()));
  if(limit)arr=arr.slice(0,limit);
  el.innerHTML=arr.map(p=>`<article class="product-card"><div class="product-img"><div style="font-size:4rem">${p.emoji}</div><span class="product-badge">${p.badge}</span></div><div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="price"><strong>${money(p.price)}</strong><button class="add-btn" data-add="${p.id}" aria-label="${p.name} in den Warenkorb">+</button></div></div></article>`).join('') || '<p>Keine passenden Artikel gefunden.</p>';
  $$('[data-add]',el).forEach(b=>b.onclick=()=>addToCart(b.dataset.add));
}
function init(){
  const current=(location.pathname.split('/').pop()||'index.html'); $$('.navlinks a').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active')});
  $('#menuBtn')?.addEventListener('click',()=>$('#navLinks')?.classList.toggle('open'));
  $$('.navlinks a').forEach(a=>a.addEventListener('click',()=>$('#navLinks')?.classList.remove('open')));
  $('#cartBtn')?.addEventListener('click',openCart); $('#cartClose')?.addEventListener('click',closeCart); $('.cart-overlay')?.addEventListener('click',closeCart);
  $('#checkoutBtn')?.addEventListener('click',()=>{if(!cart.length)return;closeCart();$('#checkoutModal')?.classList.add('open');document.body.style.overflow='hidden'; const hidden=$('#orderItems'); if(hidden) hidden.value=cart.map(i=>{const p=window.VORALB_PRODUCTS.find(x=>x.id===i.id);return `${i.qty}x ${p.name} (${money(p.price)})`}).join('\n')+`\nGesamt: ${money(cartTotal())}`});
  $('#checkoutClose')?.addEventListener('click',()=>{$('#checkoutModal')?.classList.remove('open');document.body.style.overflow=''});
  renderProducts('#homeProducts',4);
  if($('#productGrid'))renderProducts();
  $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderProducts('#productGrid',null,btn.dataset.filter,$('#shopSearch')?.value||'')}));
  $('#shopSearch')?.addEventListener('input',e=>renderProducts('#productGrid',null,$('.filter-btn.active')?.dataset.filter||'all',e.target.value));
  updateCartUI();
  const year=$('#year'); if(year)year.textContent=new Date().getFullYear();
}
document.addEventListener('DOMContentLoaded',init);
