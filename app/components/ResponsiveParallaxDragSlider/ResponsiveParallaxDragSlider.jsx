"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import styles from './ResponsiveParallaxDragSlider.module.css';

// Step 2: Port of the original script.js into this React component.
// Behaviour mirrors the jQuery implementation: generating slides, handling
// drag/slide interactions, keyboard/wheel navigation and side-nav clicks.
// Styling (original CSS) is not imported here per the conversion checklist.

export default function ResponsiveParallaxDragSlider() {
  const contRef = useRef(null);
  const sliderRef = useRef(null);
  const navRef = useRef(null);

  // Slide data (kept local to mimic original): change these to modify slides
  const arrCities = useMemo(() => ['Amsterdam', 'Rome', 'New—York', 'Singapore', 'Prague'], []);

  // Prepare split text sections (arrCitiesDivided) exactly like the original script
  const arrCitiesDivided = useMemo(() => {
    const out = [];
    arrCities.forEach((city) => {
      const length = city.length;
      const letters = Math.floor(length / 4) || 1;
      const exp = new RegExp(`.{1,${letters}}`, 'g');
      out.push(city.match(exp));
    });
    return out;
  }, [arrCities]);

  useEffect(() => {
    const cont = contRef.current;
    const slider = sliderRef.current;
    const nav = navRef.current;
    if (!cont || !slider || !nav) return;

  const winW = window.innerWidth;
    const animSpd = 750; // keep parity with original CSS timing
    const distOfLetGo = winW * 0.2;
    let curSlide = 1;
    let animation = false;
    let autoScrollVar = true;
    let diff = 0;

    // Helper: update nav active state using nav children order (more robust with CSS Modules)
    function bullets(dir) {
      const idx = dir - 1;
      const items = Array.from(nav.children || []);
      // remove existing active
      items.forEach((it) => it.classList.remove(styles['nav-active']));
      if (items[idx]) items[idx].classList.add(styles['nav-active']);
    }

    function timeout() {
      animation = false;
    }

    function pagination(direction) {
      animation = true;
      diff = 0;
  slider.classList.add(styles.animation || 'animation');

      // translate slider
      slider.style.transform = `translate3d(-${(curSlide - direction) * 100}%, 0, 0)`;

      // darkbg movement
  const darks = slider.querySelectorAll('.' + styles['slide__darkbg']);
      darks.forEach((d) => {
        d.style.transform = `translate3d(${(curSlide - direction) * 50}%, 0, 0)`;
      });

      // reset letters/text transform
  const letters = slider.querySelectorAll('.' + styles['slide__letter']);
  letters.forEach((l) => (l.style.transform = 'translate3d(0, 0, 0)'));
  const texts = slider.querySelectorAll('.' + styles['slide__text']);
  texts.forEach((t) => (t.style.transform = 'translate3d(0, 0, 0)'));
    }

    function navigateRight() {
      if (!autoScrollVar) return;
      if (curSlide >= arrCities.length) return;
      pagination(0);
      setTimeout(timeout, animSpd);
      bullets(curSlide + 1);
      curSlide++;
    }

    function navigateLeft() {
      if (curSlide <= 1) return;
      pagination(2);
      setTimeout(timeout, animSpd);
      bullets(curSlide - 1);
      curSlide--;
    }

    function toDefault() {
      pagination(1);
      setTimeout(timeout, animSpd);
    }

    // Pointer/drag handling (pointer events for unified touch/mouse)
    let startX = 0;
  function onPointerDown(e) {
      if (animation) return;
      const targetSlide = e.currentTarget.getAttribute('data-target');
      startX = e.clientX;
      slider.classList.remove('animation');

      function onPointerMove(ev) {
        const x = ev.clientX;
        diff = startX - x;
        const target = Number(targetSlide);
        if ((target === 1 && diff < 0) || (target === arrCities.length && diff > 0)) return;
        slider.style.transform = `translate3d(-${(curSlide - 1) * 100 + diff / 30}%, 0, 0)`;

        const darks = slider.querySelectorAll('.' + styles['slide__darkbg']);
        darks.forEach((d) => {
          d.style.transform = `translate3d(${(curSlide - 1) * 50 + diff / 60}%, 0, 0)`;
        });

        const letters = slider.querySelectorAll('.' + styles['slide__letter']);
        letters.forEach((l) => (l.style.transform = `translate3d(${diff / 60}vw, 0, 0)`));

        const texts = slider.querySelectorAll('.' + styles['slide__text']);
        texts.forEach((t) => (t.style.transform = `translate3d(${diff / 15}px, 0, 0)`));
      }

      function onPointerUp() {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);

        if (animation) return;
        if (diff >= distOfLetGo) {
          navigateRight();
        } else if (diff <= -distOfLetGo) {
          navigateLeft();
        } else {
          toDefault();
        }
      }

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    // Click handlers for nav
    function onNavClick(e) {
      const target = e.target.closest('li[data-target]');
      if (!target) return;
      const t = Number(target.getAttribute('data-target'));
      bullets(t);
      curSlide = t;
      pagination(1);
    }

    // Side nav
    function onSideNavClick(e) {
      const target = e.currentTarget.getAttribute('data-target');
      if (target === 'right') navigateRight();
      if (target === 'left') navigateLeft();
    }

    // Keydown
    function onKeydown(e) {
      if (e.key === 'ArrowRight') navigateRight();
      if (e.key === 'ArrowLeft') navigateLeft();
    }

    // Wheel
    function onWheel(e) {
      if (animation) return;
      const delta = e.deltaY || e.wheelDelta;
      if (delta < 0) navigateLeft();
      if (delta > 0) navigateRight();
    }

    // Attach events
    // pointerdown on each slide
  const slides = Array.from(slider.querySelectorAll('.' + styles.slide));
  slides.forEach((s) => s.addEventListener('pointerdown', onPointerDown));
  nav.addEventListener('click', onNavClick);
  const sideNavs = Array.from(cont.querySelectorAll('.' + styles['side-nav']));
  sideNavs.forEach((sn) => sn.addEventListener('click', onSideNavClick));
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('wheel', onWheel);

    // initialize nav active (use children for robustness)
    const itemsInit = Array.from(nav.children || []);
    if (itemsInit[0]) itemsInit[0].classList.add(styles['nav-active']);

    // Cleanup on unmount
    return () => {
      slides.forEach((s) => s.removeEventListener('pointerdown', onPointerDown));
      nav.removeEventListener('click', onNavClick);
      sideNavs.forEach((sn) => sn.removeEventListener('click', onSideNavClick));
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('wheel', onWheel);
    };
  }, [arrCities.length, arrCitiesDivided]);

  // Render slides and nav based on arrCities data
  return (
    <div className={styles.root}>
      <div className={styles.cont} ref={contRef}>
      <div className={styles.slider} ref={sliderRef}>
        {arrCities.map((city, i) => {
          const num = i + 1;
          const firstLetter = (arrCitiesDivided[i] && arrCitiesDivided[i][0]) ? arrCitiesDivided[i][0].charAt(0) : '';
          return (
            <div key={city} data-target={num} className={`${styles.slide} ${styles[`slide--${num}`]}`}>
              <div className={`${styles['slide__darkbg']} ${styles[`slide--${num}__darkbg`]}`} />
              <div className={`${styles['slide__text-wrapper']} ${styles[`slide--${num}__text-wrapper`]}`}>
                <div className={`${styles['slide__letter']} ${styles[`slide--${num}__letter`]}`}>{firstLetter}</div>
                {(arrCitiesDivided[i] || []).map((txt, idx) => (
                  <div key={idx} className={`${styles['slide__text']} ${styles[`slide__text--${idx + 1}`]}`}>
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ul className={styles.nav} ref={navRef}>
        {arrCities.map((_, i) => (
          <li key={i} data-target={i + 1} className={`${styles['nav__slide']} ${styles[`nav__slide--${i + 1}`]}`} />
        ))}
      </ul>

      <div data-target="right" className={`${styles['side-nav']} ${styles['side-nav--right']}`} />
      <div data-target="left" className={`${styles['side-nav']} ${styles['side-nav--left']}`} />
      </div>
    </div>
  );
}
