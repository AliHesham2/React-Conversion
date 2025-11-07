"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import styles from './GsapSlideshowVerticalWarp.module.css';

// Ported script.js logic (DOM-scoped, runs inside useEffect). This mirrors
// the original demo behaviour but scopes selectors to this component via
// `containerRef` and uses refs for mutable handles.
export default function GsapSlideshowVerticalWarp({ slides = [] }) {
  const containerRef = useRef(null);
  const counterStripRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(CustomEase);

    // Custom eases copied from original
    try {
      CustomEase.create && CustomEase.create('slideInOut', '0.25, 1, 0.5, 1');
      CustomEase.create && CustomEase.create('textReveal', '0.77, 0, 0.175, 1');
      CustomEase.create && CustomEase.create('counterSlide', '0.25, 1, 0.5, 1');
      CustomEase.create && CustomEase.create('imageWarp', '0.22, 1, 0.36, 1');
    } catch (e) {
      // ignore if CustomEase can't be created in this environment
    }

    // scoped DOM nodes
  const root = containerRef.current;
  const slidesEls = Array.from(root.querySelectorAll('.' + styles.slide));
  const slideImages = Array.from(root.querySelectorAll('.' + styles['slide__img']));
  const counterStrip = counterStripRef.current;
  const cursor = cursorRef.current;

    if (!slidesEls.length) return;

    let currentIndex = 0;
    let isAnimating = false;
    let mouseX = 0;

    const NEXT = 1;
    const PREV = -1;
    const SLIDE_DURATION = 1.5;

    // format number with leading zero
    const formatNumber = (num) => (num < 10 ? `0${num}` : `${num}`);

    // init counter strip with numbers
    // counter numbers are rendered by React; just ensure initial position
    if (counterStrip) gsap.set(counterStrip, { y: 0 });

    // animate in first slide text
    try {
  const firstTextLines = slidesEls[0].querySelectorAll('.' + styles['slide__text-line']);
      gsap.to(firstTextLines, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        delay: 0.5,
        ease: 'textReveal',
      });
    } catch (e) {}

    // animate counter helper
    const animateCounter = (targetIndex, _direction, timeline) => {
      if (!counterStrip) return;
      const targetY = -targetIndex * 1.2; // matches original rem-based layout
      timeline.to(counterStrip, { y: `${targetY}rem`, duration: SLIDE_DURATION, ease: 'slideInOut' }, 0.2);
    };

    // Navigation
    const performNavigation = (prevIndex, nextIndex, direction) => {
      isAnimating = true;

      const currentSlide = slidesEls[prevIndex];
      const currentImage = slideImages[prevIndex];
  const currentTextLines = currentSlide.querySelectorAll('.' + styles['slide__text-line']);

      const nextSlide = slidesEls[nextIndex];
      const nextImage = slideImages[nextIndex];
  const nextTextLines = nextSlide.querySelectorAll('.' + styles['slide__text-line']);

      gsap.set(nextSlide, { visibility: 'visible', y: `${direction * 100}%` });

      gsap.set(nextImage, {
        y: `${-direction * 40}%`,
        scale: 1.4,
        scaleY: 1.8,
        rotation: -direction * 8,
        transformOrigin: direction === NEXT ? '0% 0%' : '100% 100%',
      });

      gsap.set(nextTextLines, { y: '100%', opacity: 0 });

      const tl = gsap.timeline({
        defaults: { duration: SLIDE_DURATION, ease: 'slideInOut' },
        onComplete: () => {
          gsap.set(currentSlide, { visibility: 'hidden' });
          currentSlide.classList.remove(styles.active);
          nextSlide.classList.add(styles.active);
          isAnimating = false;
        },
      });

      animateCounter(nextIndex, direction, tl);

      tl.to(currentTextLines, { y: '-80%', opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power2.in' }, 0);
      tl.to(currentSlide, { y: `${-direction * 100}%` }, 0.2);
      tl.to(currentImage, { y: `${direction * 40}%`, scale: 1.4, scaleY: 1.8, rotation: direction * 8, ease: 'imageWarp', transformOrigin: direction === NEXT ? '0% 100%' : '100% 0%' }, 0.2);
      tl.to(nextSlide, { y: '0%' }, 0.2);
      tl.to(nextImage, { y: '0%', scale: 1, scaleY: 1, rotation: 0, ease: 'imageWarp' }, 0.2);
      tl.to(nextTextLines, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'textReveal', delay: 0.6 }, 0.9);
    };

    const navigate = (direction) => {
      if (isAnimating) return;
      const prevIndex = currentIndex;
      currentIndex = direction === NEXT ? (currentIndex < slidesEls.length - 1 ? currentIndex + 1 : 0) : (currentIndex > 0 ? currentIndex - 1 : slidesEls.length - 1);
      performNavigation(prevIndex, currentIndex, direction);
    };

    // Cursor handling
    const handleMouseMove = (e) => {
      gsap.to(cursor, { left: e.clientX, top: e.clientY, duration: 0.1 });
      mouseX = e.clientX;
  cursor.classList.add(styles.cursorActive);
      const windowWidth = window.innerWidth;
      if (e.clientX < windowWidth / 2) {
        cursor.classList.remove(styles.cursorNext);
        cursor.classList.add(styles.cursorPrev);
      } else {
        cursor.classList.remove(styles.cursorPrev);
        cursor.classList.add(styles.cursorNext);
      }
      clearTimeout(window.cursorTimeout);
  window.cursorTimeout = setTimeout(() => cursor.classList.remove(styles.cursorActive), 2000);
    };

  const handleMouseLeave = () => cursor.classList.remove(styles.cursorActive);
    const handleWheel = (e) => { if (e.deltaY > 0) navigate(NEXT); else navigate(PREV); };

    let touchStartY = 0;
    const handleTouchStart = (e) => { touchStartY = e.changedTouches[0].screenY; };
    const handleTouchEnd = (e) => { const touchEndY = e.changedTouches[0].screenY; if (touchStartY > touchEndY + 5) navigate(NEXT); else if (touchStartY < touchEndY - 5) navigate(PREV); };

    const handleClick = () => { if (mouseX < window.innerWidth / 2) navigate(PREV); else navigate(NEXT); };
    const handleKey = (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(NEXT); else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') navigate(PREV); };

    // Attach listeners (document/window) and ensure cleanup
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('wheel', handleWheel, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);

    // cleanup
    return () => {
      try {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKey);
        if (window.cursorTimeout) clearTimeout(window.cursorTimeout);
        gsap.killTweensOf('*');
      } catch (e) {}
    };
  }, [slides]);

  return (
    <div className={styles.slideshow} ref={containerRef}>
      {slides.map((s, i) => (
        <div key={i} className={`${styles.slide} ${i === 0 ? styles.active : ''}`}>
          <div className={styles['slide__img']} style={{ backgroundImage: `url(${s.image})` }} />
          <div className={styles['slide__text']}>
            <span className={styles['slide__text-line']}>{s.line1}</span>
            <span className={styles['slide__text-line']}>{s.line2}</span>
          </div>
        </div>
      ))}

      <div className={styles.controls}>
        <div className={styles['controls-text']}>scroll / drag</div>
      </div>

      <div className={styles['slide-counter']}>
        <div className={styles['counter-container']}>
          <div className={styles['counter-strip']} ref={counterStripRef}>
            {slides.map((_, i) => (
              <div key={i} className={styles['counter-number']}>
                {String(i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
        <div className={styles['counter-separator']} />
        <div className={styles['counter-total']}>{String(slides.length).padStart(2, '0')}</div>
      </div>

      <div className={styles['slide-info']}>
        <div className={styles['slide-info-title']}>Contemplative Series</div>
        <div className={styles['slide-info-desc']}>Navigate through a visual journey exploring the boundaries between form and emptiness.</div>
      </div>

      <div className={`${styles.cursor}`} ref={cursorRef}>
        <div className={`${styles.cursorArrow} ${styles.cursorArrowPrev}`}>←</div>
        <div className={`${styles.cursorArrow} ${styles.cursorArrowNext}`}>→</div>
      </div>
    </div>
  );
}
