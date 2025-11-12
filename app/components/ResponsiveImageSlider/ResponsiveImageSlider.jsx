"use client";

import React, { useRef, useEffect } from 'react';
import styles from './ResponsiveImageSlider.module.css';

const SLIDES = [
  'https://picsum.photos/800/400?random=1',
  'https://picsum.photos/800/400?random=2',
  'https://picsum.photos/800/400?random=3',
  'https://picsum.photos/800/400?random=4',
  'https://picsum.photos/800/400?random=5',
  'https://picsum.photos/800/400?random=6'
];

export default function ResponsiveImageSlider() {
  const sliderRef = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

  const display = slider.querySelector(`.${styles['image-display']}`) || displayRef.current;
  const navButtons = Array.from(slider.querySelectorAll(`.${styles['nav-button']}`));
  const prevButton = slider.querySelector(`.${styles['prev-button']}`);
  const nextButton = slider.querySelector(`.${styles['next-button']}`);
  const sliderNavigation = slider.querySelector(`.${styles['slider-navigation']}`);

    let currentSlideIndex = 0;
    const preloadedImages = {};

    function preloadImages() {
      navButtons.forEach((button) => {
        const img = button.querySelector('img');
        if (img) {
          const src = img.src;
          if (!preloadedImages[src]) {
            preloadedImages[src] = new Image();
            preloadedImages[src].src = src;
          }
        }
      });
    }

    function updateNavButtons() {
      navButtons.forEach((button, idx) => {
        const isSelected = idx === currentSlideIndex;
        button.setAttribute('aria-selected', isSelected);
        if (isSelected) button.focus();
      });
    }

    function showSlide(index) {
      currentSlideIndex = index;
      const navImg = navButtons[currentSlideIndex]?.querySelector('img');
      if (navImg && display) {
        // Try to use a higher-resolution source when the thumbnail URL encodes dimensions
        let src = navImg.src || '';
        let highResSrc = src;
        const dimMatch = src.match(/\/(\d+)\/(\d+)(\?.*)?$/);
        if (dimMatch) {
          // double the dimensions for a crisper full-display image
          const w = parseInt(dimMatch[1], 10) * 2;
          const h = parseInt(dimMatch[2], 10) * 2;
          highResSrc = src.replace(/\/(\d+)\/(\d+)(\?.*)?$/, `/${w}/${h}$3`);
        }

        // Create a fresh image element (avoid copying thumbnail classes/styles)
        const imgClone = document.createElement('img');
        imgClone.src = highResSrc;
        // provide a srcset so browsers can pick the best resolution
        if (highResSrc !== src) imgClone.srcset = `${highResSrc} 2x, ${src} 1x`;
        imgClone.alt = navImg.alt || '';
        // size to container (container is explicitly set to viewport dims)
        imgClone.style.width = '100%';
        imgClone.style.height = '100%';
        imgClone.style.objectFit = 'cover';
        imgClone.style.display = 'block';
        imgClone.loading = 'eager';

        display.replaceChildren(imgClone);
      }
      updateNavButtons();
    }

    function handleAction(action) {
      if (action === 'Home') {
        currentSlideIndex = 0;
      } else if (action === 'End') {
        currentSlideIndex = navButtons.length - 1;
      } else if (action === 'ArrowRight' || action === 'next') {
        currentSlideIndex = (currentSlideIndex + 1) % navButtons.length;
      } else if (action === 'ArrowLeft' || action === 'prev') {
        currentSlideIndex = (currentSlideIndex - 1 + navButtons.length) % navButtons.length;
      }
      showSlide(currentSlideIndex);
    }

    function onKeydown(e) {
      handleAction(e.key);
    }

    function onNavClick(e) {
      const target = e.target.closest(`.${styles['nav-button']}`);
      const idx = target ? navButtons.indexOf(target) : -1;
      if (idx !== -1) showSlide(idx);
    }

    function onPrev() {
      handleAction('prev');
    }

    function onNext() {
      handleAction('next');
    }

    // initialize
    preloadImages();
    showSlide(currentSlideIndex);
    document.addEventListener('keydown', onKeydown);
    sliderNavigation?.addEventListener('click', onNavClick);
    prevButton?.addEventListener('click', onPrev);
    nextButton?.addEventListener('click', onNext);

    // cleanup
    return () => {
      document.removeEventListener('keydown', onKeydown);
      sliderNavigation?.removeEventListener('click', onNavClick);
      prevButton?.removeEventListener('click', onPrev);
      nextButton?.removeEventListener('click', onNext);
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles['image-slider']} ref={sliderRef}>
        <section className={styles['slider__content']}>
          <button type="button" className={styles['slider-control--button'] + ' ' + styles['prev-button']}>
          <svg width="16" height="16" fill="currentColor" className={styles.icon} viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
          </svg>
          </button>
          <main
            className={styles['image-display']}
            ref={displayRef}
            // force the display container to occupy the full viewport as a diagnostic/fix
            style={{ width: '100vw', height: '100vh', display: 'block' }}
          ></main>
          <button type="button" className={styles['slider-control--button'] + ' ' + styles['next-button']}>
          <svg width="16" height="16" fill="currentColor" className={styles.icon} viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
          </svg>
        </button>
        </section>
        <nav className={styles['slider-navigation']}>
          {SLIDES.map((src, i) => (
            <button key={src} className={styles['nav-button']} data-index={i}>
              <img className={styles['thumbnail']} src={src} alt={`Thumbnail ${i + 1}`} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
