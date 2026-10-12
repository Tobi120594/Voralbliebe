'use strict';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const money = value => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
const cartKey = 'voralbliebe-cart';
const products = () => Array.isArray(window.VORALB_PRODUCTS) ? window.VORALB_PRODUCTS : [];
const findProduct = id => products().find(product => product.id === id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const product = findProduct(item.id);
    const qty = Number(item.qty);
    if (!product || !Number.isSafeInteger(qty) || qty < 1) continue;
    if (!Number.isSafeInteger(Math.round(product.price * 100) * qty)) continue;
    const existing = result.find(entry => entry.id === product.id);
    if (existing) {
      const combined = existing.qty + qty;
      if (Number.isSafeInteger(combined) && Number.isSafeInteger(Math.round(product.price * 100) * combined)) existing.qty = combined;
    } else {
      result.push({ id: product.id, qty });
    }
  }
  return result;
}

function loadCart() {
  try {
    return normalizeCart(JSON.parse(localStorage.getItem(cartKey) || '[]'));
  } catch {
    return [];
  }
}

let cart = loadCart();
let cartReturnFocus = null;

function saveCart() {
  cart = normalizeCart(cart);
  try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* Warenkorb bleibt für diese Seite nutzbar. */ }
  updateCartUI();
}

function clearCart() {
  cart = [];
  try { localStorage.removeItem(cartKey); } catch { /* Speicher kann im Browser gesperrt sein. */ }
  updateCartUI();
}

function cartCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function cartTotal() {
  return cart.reduce((total, item) => total + Math.round(findProduct(item.id).price * 100) * item.qty, 0) / 100;
}

function addToCart(id) {
  if (!findProduct(id)) return;
  const item = cart.find(entry => entry.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function updateCartUI() {
  $$('.cart-count').forEach(element => { element.textContent = cartCount(); });
  const wrap = $('#cartItems');
  if (wrap) {
    wrap.innerHTML = cart.length ? cart.map(item => {
      const product = findProduct(item.id);
      return `<div class="cart-item"><div class="mini">${escapeHtml(product.emoji)}</div><div><strong>${escapeHtml(product.name)}</strong><small>${item.qty} × ${money(product.price)}</small></div><button class="remove" type="button" data-remove="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)} entfernen">×</button></div>`;
    }).join('') : '<p>Dein Warenkorb ist noch leer.</p>';
    $$('[data-remove]', wrap).forEach(button => { button.onclick = () => removeFromCart(button.dataset.remove); });
  }
  const total = $('#cartTotal');
  if (total) total.textContent = money(cartTotal());
  const checkout = $('#checkoutBtn');
  if (checkout) checkout.disabled = cart.length === 0;
}

function syncScrollLock() {
  const open = $('#cartDrawer')?.classList.contains('open') || $('#checkoutModal')?.classList.contains('open');
  document.body.style.overflow = open ? 'hidden' : '';
}

function openCart() {
  const drawer = $('#cartDrawer');
  if (!drawer) return;
  if (!drawer.classList.contains('open')) cartReturnFocus = document.activeElement;
  drawer.inert = false;
  drawer.setAttribute('aria-hidden', 'false');
  drawer.classList.add('open');
  syncScrollLock();
  $('#cartClose')?.focus();
}

function closeCart(restoreFocus = true) {
  const drawer = $('#cartDrawer');
  drawer?.classList.remove('open');
  if (drawer) {
    drawer.inert = true;
    drawer.setAttribute('aria-hidden', 'true');
  }
  syncScrollLock();
  if (restoreFocus && cartReturnFocus?.isConnected) cartReturnFocus.focus();
}

function openCheckout() {
  if (!cart.length) return;
  const modal = $('#checkoutModal');
  if (!modal) return;
  closeCart(false);
  const hidden = $('#orderItems');
  if (hidden) hidden.value = cart.map(item => {
    const product = findProduct(item.id);
    return `${item.qty}x ${product.name} (${money(product.price)})`;
  }).join('\n') + `\nGesamt: ${money(cartTotal())}`;
  const alert = $('#orderAlert');
  if (alert) { alert.className = 'alert'; alert.textContent = ''; }
  modal.inert = false;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  syncScrollLock();
  $('#orderName')?.focus();
}

function closeCheckout() {
  const modal = $('#checkoutModal');
  modal?.classList.remove('open');
  if (modal) {
    modal.inert = true;
    modal.setAttribute('aria-hidden', 'true');
  }
  syncScrollLock();
  $('#cartBtn')?.focus();
}

function renderProducts(target = '#productGrid', limit = null, filter = 'all', search = '') {
  const element = $(target);
  if (!element) return;
  let selection = products().filter(product => (filter === 'all' || product.category === filter) && product.name.toLowerCase().includes(search.toLowerCase()));
  if (limit) selection = selection.slice(0, limit);
  element.innerHTML = selection.map(product => `<article class="product-card"><div class="product-img"><div style="font-size:4rem">${escapeHtml(product.emoji)}</div><span class="product-badge">${escapeHtml(product.badge)}</span></div><div class="product-body"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.desc)}</p><div class="price"><strong>${money(product.price)}</strong><button class="add-btn" type="button" data-add="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)} in den Warenkorb">+</button></div></div></article>`).join('') || '<p>Keine passenden Artikel gefunden.</p>';
  $$('[data-add]', element).forEach(button => { button.onclick = () => addToCart(button.dataset.add); });
}

function updateActiveNavigation() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const aboutActive = current === 'index.html' && location.hash === '#ueber-mich';
  $$('.navlinks a').forEach(link => {
    const [page, anchor] = (link.getAttribute('href') || '').split('#');
    const active = page === current && (anchor ? location.hash === `#${anchor}` : !aboutActive);
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', anchor ? 'location' : 'page');
    else link.removeAttribute('aria-current');
  });
}

function closeMenu() {
  $('#navLinks')?.classList.remove('open');
  const button = $('#menuBtn');
  button?.setAttribute('aria-expanded', 'false');
  button?.setAttribute('aria-label', 'Menü öffnen');
}

function handleKeyboard(event) {
  const modalOpen = $('#checkoutModal')?.classList.contains('open');
  const cartOpen = $('#cartDrawer')?.classList.contains('open');
  if (event.key === 'Escape') {
    if (modalOpen) closeCheckout();
    else if (cartOpen) closeCart();
    else if ($('#navLinks')?.classList.contains('open')) { closeMenu(); $('#menuBtn')?.focus(); }
    else return;
    event.preventDefault();
  }
  if (event.key !== 'Tab' || (!modalOpen && !cartOpen)) return;
  const panel = modalOpen ? $('.checkout-box') : $('.cart-panel');
  if (!panel) return;
  const focusable = $$('button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', panel).filter(element => element.getClientRects().length);
  if (!focusable.length) { event.preventDefault(); panel.focus(); return; }
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
}

function init() {
  updateActiveNavigation();
  window.addEventListener('hashchange', updateActiveNavigation);
  $('#menuBtn')?.addEventListener('click', () => {
    const nav = $('#navLinks');
    if (!nav) return;
    const open = nav.classList.toggle('open');
    $('#menuBtn').setAttribute('aria-expanded', String(open));
    $('#menuBtn').setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  $$('.navlinks a').forEach(link => link.addEventListener('click', closeMenu));
  $('#cartBtn')?.addEventListener('click', openCart);
  $('#cartClose')?.addEventListener('click', () => closeCart());
  $('.cart-overlay')?.addEventListener('click', () => closeCart());
  $('#checkoutBtn')?.addEventListener('click', openCheckout);
  $('#checkoutClose')?.addEventListener('click', closeCheckout);
  $('#checkoutModal')?.addEventListener('click', event => { if (event.target === $('#checkoutModal')) closeCheckout(); });
  document.addEventListener('keydown', handleKeyboard);
  renderProducts('#homeProducts', 4);
  if ($('#productGrid')) renderProducts();
  $$('.filter-btn').forEach(button => button.addEventListener('click', () => {
    $$('.filter-btn').forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');
    renderProducts('#productGrid', null, button.dataset.filter, $('#shopSearch')?.value || '');
  }));
  $('#shopSearch')?.addEventListener('input', event => renderProducts('#productGrid', null, $('.filter-btn.active')?.dataset.filter || 'all', event.target.value));
  updateCartUI();
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);
