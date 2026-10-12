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
  let albums = {};
  try { albums = JSON.parse(document.querySelector('#galleryAlbums')?.textContent || '{}'); } catch (error) { console.warn('Galerie-Alben konnten nicht geladen werden.', error); }
  let activeImages = [];
  let currentIndex = 0;
  let returnFocus = null;
  let touchStart = null;

  function showImage(index) {
    if (!activeImages.length) return;
    currentIndex = (index + activeImages.length) % activeImages.length;
    const photo = activeImages[currentIndex];
    image.src = photo.src;
    image.alt = photo.alt || photo.caption || 'Florale Inspiration';
    caption.textContent = photo.caption || image.alt;
    counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
    previousButton.hidden = nextButton.hidden = activeImages.length < 2;
  }

  function restorePage() {
    const anotherDialogOpen = document.querySelector('#cartDrawer.open, #checkoutModal.open');
    document.body.style.overflow = anotherDialogOpen ? 'hidden' : '';
    if (returnFocus?.isConnected) returnFocus.focus();
  }

  function closeGallery() {
    if (dialog.open) dialog.close();
  }

  links.forEach((link) => link.addEventListener('click', event => {
    event.preventDefault();
    returnFocus = link;
    const configured = albums[link.dataset.gallery];
    activeImages = Array.isArray(configured) ? configured.filter(photo => photo && typeof photo.src === 'string' && photo.src.trim()) : [];
    if (!activeImages.length) activeImages = [{ src: link.href, alt: link.querySelector('img')?.alt, caption: link.dataset.caption }];
    showImage(0);
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
  image.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  image.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) showImage(currentIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initGallery);
