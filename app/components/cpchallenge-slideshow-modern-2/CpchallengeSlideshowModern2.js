// Converted import: React hooks used to replace the original script's lifecycle and DOM refs
import React, { useEffect, useRef, useState } from 'react';
// Converted import: CSS Module scoped from the original stylesheet (kept local to component)
import styles from './CpchallengeSlideshowModern2.module.css';


export default function CpchallengeSlideshowModern2({ slides }) {
  // Converted: containerRef replaces document-level queries from original script
  const containerRef = useRef(null);
  // Converted: slidesRef stores DOM nodes for each slide (was document.querySelectorAll)
  const slidesRef = useRef([]);
  // Converted: dotsRef stores DOM nodes for nav dots
  const dotsRef = useRef([]);
  // Converted: prev/next arrow refs (original had element listeners)
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  // Converted: progress bar element ref (original manipulated inline styles)
  const progressRef = useRef(null);
  // Converted: custom cursor ref (original updated cursor position on mousemove)
  const cursorRef = useRef(null);
  // Converted: refs for timers/intervals used in original script
  const autoRef = useRef(null);
  const progressTimeout = useRef(null);

  // Converted: currentIndex mirrors the original script's active slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure refs arrays length
  // Converted: initialize refs arrays to match slides length (similar to building NodeList)
  useEffect(() => {
    slidesRef.current = Array(slides.length).fill(null);
    dotsRef.current = Array(slides.length).fill(null);
  }, [slides.length]);

  // main lifecycle: event listeners, autoplay, parallax, cursor
  // Converted: main lifecycle block translated to useEffect (replaces the original IIFE/constructor)
  useEffect(() => {
    // Converted: updateProgress replicates original progress bar reset/start behavior
    const updateProgress = () => {
      if (!progressRef.current) return; // guard like original
      progressRef.current.style.transition = 'none';
      progressRef.current.style.transform = 'scaleX(0)';
      if (progressTimeout.current) clearTimeout(progressTimeout.current);
      progressTimeout.current = setTimeout(() => {
        if (!progressRef.current) return;
        progressRef.current.style.transition = 'transform 5s linear';
        if (autoRef.current) progressRef.current.style.transform = 'scaleX(1)';
      }, 50);
    };

    // Converted: prev/next functions map to the original slide navigation methods
    const prev = () => setCurrentIndex(i => (i - 1 + slides.length) % slides.length);
    const next = () => setCurrentIndex(i => (i + 1) % slides.length);

    // Converted: startAuto / stopAuto follow the original autoplay logic using setInterval
    const startAuto = () => {
      if (autoRef.current) clearInterval(autoRef.current);
      // Use 5000ms to match the progress-bar 5s transition so thumbnails stay visible
      autoRef.current = setInterval(() => {
        setCurrentIndex(i => (i + 1) % slides.length);
      }, 5000);
      if (progressRef.current) progressRef.current.style.transform = 'scaleX(1)';
    };

    const stopAuto = () => {
      if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
      if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)';
    };

    // Converted: attach click listeners to prev/next arrow elements (original used element.addEventListener)
    const _prev = prevRef.current;
    const _next = nextRef.current;
    if (_prev) _prev.addEventListener('click', prev);
    if (_next) _next.addEventListener('click', next);

    // Converted: keyboard navigation
    const keyHandler = (e) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    // Converted: pause on mouse enter, resume on leave (original behavior)
    const mouseEnter = () => stopAuto();
    const mouseLeave = () => startAuto();

    // Converted: update custom cursor position on mousemove
    const mouseMoveCursor = (e) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.left = e.clientX + 'px';
      cursorRef.current.style.top = e.clientY + 'px';
    };

    // Converted: basic touch swipe handling from the original
    let startX = 0;
    const touchStart = (e) => { startX = e.touches[0].clientX; };
    const touchEnd = (e) => { const endX = e.changedTouches[0].clientX; const d = startX - endX; if (Math.abs(d) > 50) { if (d > 0) next(); else prev(); } };

    // Converted: parallax background movement on mouse move
    const parallax = (e) => {
      const base = containerRef.current || document;
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      try {
        base.querySelectorAll(`.${styles['slide-background']}`).forEach((bg, i) => {
          const speed = (i + 1) * 0.5;
          const xPos = (mouseX - 0.5) * 1.5 * speed;
          const yPos = (mouseY - 0.5) * speed;
          // Converted: set CSS variables so we don't overwrite the CSS transform (skew/scale)
          bg.style.setProperty('--px', `${xPos}px`);
          bg.style.setProperty('--py', `${yPos}px`);
        });
      } catch (err) {}
    };

    // Converted: register document-level listeners as original script did
    document.addEventListener('keydown', keyHandler);
    document.addEventListener('mouseenter', mouseEnter);
    document.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('mousemove', mouseMoveCursor);
    document.addEventListener('touchstart', touchStart);
    document.addEventListener('touchend', touchEnd);
    document.addEventListener('mousemove', parallax);

    // init: reset/start progress and autoplay
    updateProgress();
    startAuto();

    // Converted: cleanup mirrors original teardown
    return () => {
      if (_prev) _prev.removeEventListener('click', prev);
      if (_next) _next.removeEventListener('click', next);
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('mouseenter', mouseEnter);
      document.removeEventListener('mouseleave', mouseLeave);
      document.removeEventListener('mousemove', mouseMoveCursor);
      document.removeEventListener('touchstart', touchStart);
      document.removeEventListener('touchend', touchEnd);
      document.removeEventListener('mousemove', parallax);
      stopAuto();
      if (progressTimeout.current) clearTimeout(progressTimeout.current);
    };
  }, [slides.length]);

  // keep progress in sync when currentIndex changes
  // Converted: restart or sync progress bar animation whenever active slide changes
  useEffect(() => {
    if (!progressRef.current) return;
    // restart progress animation on slide change
    progressRef.current.style.transition = 'none';
    progressRef.current.style.transform = 'scaleX(0)';
    if (progressTimeout.current) clearTimeout(progressTimeout.current);
    progressTimeout.current = setTimeout(() => {
      if (!progressRef.current) return;
      progressRef.current.style.transition = 'transform 5s linear';
      if (autoRef.current) progressRef.current.style.transform = 'scaleX(1)';
    }, 50);
  }, [currentIndex]);
  

  // helper to go to a specific slide (converted from original navigation method)
  const goTo = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setCurrentIndex(index);
  };

  // Converted: prepare render arrays so we can comment converted lines safely (avoids JSX // comment issues)
  const renderSlides = slides.map((s, i) => {
    // map one slide (converted from each .slide element in original HTML)
    // set ref for imperative access (converted from document.querySelectorAll usage)
    // className toggles active state based on currentIndex (converted from classList toggles)
    return (
      <div key={i} ref={el => slidesRef.current[i] = el} className={`${styles.slide} ${i === currentIndex ? styles.active : ''}`}>
        {/* background image element (converted from original inline/background element) */}
        <div className={styles['slide-background']} style={{ backgroundImage: `url(${s.bg})` }} />
        {/* overlay layer (converted from original markup) */}
        <div className={styles['slide-overlay']} />
        {/* content block: number/title/description (converted from original .slide-content) */}
        <div className={styles['slide-content']}>
          {/* slide number (converted from original element) */}
          <div className={styles['slide-number']}>{s.number}</div>
          {/* slide title (converted from original element) */}
          <h2 className={styles['slide-title']}>{s.title}</h2>
          {/* slide description (converted from original element) */}
          <p className={styles['slide-description']}>{s.description}</p>
        </div>
        {/* thumbnail/image element (converted from original img element) */}
  
      </div>
    );
  });

  const renderDots = slides.map((_, i) => {
    // render a nav dot (converted from original dot elements and their click handlers)
    return (
      <div key={i} ref={el => dotsRef.current[i] = el} onClick={() => goTo(i)} className={`${styles['nav-dot']} ${i === currentIndex ? styles.active : ''}`} data-slide={i} />
    );
  });

  return (
    <div ref={containerRef} className={styles['slideshow-container']}>
      {renderSlides}

      <div className={styles.navigation}>
        {renderDots}
      </div>

      {/* prev/next arrows (converted from original elements) */}
      <div ref={prevRef} className={`${styles['nav-arrow']} ${styles.prev}`} />
      <div ref={nextRef} className={`${styles['nav-arrow']} ${styles.next}`} />

      {/* progress bar and custom cursor elements (converted from original DOM elements) */}
      <div ref={progressRef} className={styles['progress-bar']} />
      <div ref={cursorRef} className={styles['custom-cursor']} />
    </div>
  );
}
