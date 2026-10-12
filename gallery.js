'use strict';

function initGallery() {
  const links = [...document.querySelectorAll('[data-gallery]')];
  const dialog = document.querySelector('#galleryDialog');
  if (!links.length || !dialog || typeof dialog.showModal !== 'function') return;
  const image = document.querySelector('#galleryDialogImage');
  const caption = document.querySelector('#galleryDialogCaption');
  const counter = document.querySelector('#galleryDialogCounter');
  const closeButton = document.querySelector('#galleryDialogClose');
  const previousButton = document.querySelector('#galleryDialogPrev');
  const nextButton = document.querySelector('#galleryDialogNext');
  let currentIndex = 0;
  let returnFocus = null;
  let touchStart = null;

  function showImage(index) {
    currentIndex = (index + links.length) % links.length;
    const link = links[currentIndex];
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || link.dataset.caption || 'Florale Inspiration';
    caption.textContent = link.dataset.caption || image.alt;
    counter.textContent = `${currentIndex + 1} / ${links.length}`;
  }

  function restorePage() {
    const anotherDialogOpen = document.querySelector('#cartDrawer.open, #checkoutModal.open');
    document.body.style.overflow = anotherDialogOpen ? 'hidden' : '';
    if (returnFocus?.isConnected) returnFocus.focus();
  }

  function closeGallery() {
    if (dialog.open) dialog.close();
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    returnFocus = link;
    showImage(index);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }));
  closeButton.addEventListener('click', closeGallery);
  previousButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));
  dialog.addEventListener('close', restorePage);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeGallery(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentIndex + 1); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeGallery();
  });
  image.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    else touchStart = null;
  }, { passive: true });
  image.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) showImage(currentIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initGallery);
