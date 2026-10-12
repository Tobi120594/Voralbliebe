'use strict';

async function submitAjax(form, alertSelector) {
  const box = document.querySelector(alertSelector);
  if (!box || form.dataset.submitting === 'true') return;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const button = form.querySelector('button[type="submit"]');
  form.dataset.submitting = 'true';
  if (button) button.disabled = true;
  box.className = 'alert';
  box.textContent = '';
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form) });
    const data = await response.json();
    const success = response.ok && data.ok === true;
    box.textContent = data.message || (success ? 'Vielen Dank! Deine Anfrage wurde gesendet.' : 'Die Anfrage konnte nicht gesendet werden.');
    box.classList.add('show', success ? 'success' : 'error');
    if (success) {
      form.reset();
      if (form.id === 'checkoutForm' && typeof clearCart === 'function') clearCart();
    }
  } catch {
    box.textContent = 'Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal oder kontaktiere uns direkt.';
    box.classList.add('show', 'error');
  } finally {
    delete form.dataset.submitting;
    if (button) button.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const contact = document.querySelector('#contactForm');
  if (contact) contact.addEventListener('submit', event => { event.preventDefault(); submitAjax(contact, '#contactAlert'); });
  const order = document.querySelector('#checkoutForm');
  if (order) order.addEventListener('submit', event => { event.preventDefault(); submitAjax(order, '#orderAlert'); });
});
