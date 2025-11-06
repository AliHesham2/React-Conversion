"use client";

import React, { useEffect, useRef } from 'react';
import styles from './FancySlider.module.css';

// Helper to map CSS module keys to class names safely.
function cls(...keys) {
  return keys
    .filter(Boolean)
    .map(k => (styles[k] ? styles[k] : k))
    .join(' ');
}

// HTML-only conversion of exports/fancy-slider (structure only).
// Expects a `slides` prop shaped like:
// [{ headingLines: ['Line1','Line2'], blend: 'm--blend-green', navLabel: 'Black Widow', bgClass: 'fnc-slide-1' }, ...]
export default function FancySlider({ slides = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

  // The ref is attached to the slider element itself, so use it directly.
  const $slider = container;
  if (!$slider) return;

    // Helper that maps original selector names to module class values
    const q = selectorKey => `.${styles[selectorKey] || selectorKey}`;

    // Scoped element getters
    const $slidesCont = $slider.querySelector(q('fnc-slider__slides'));
    const $slides = Array.from($slider.querySelectorAll(q('fnc-slide')));
    const $controls = Array.from($slider.querySelectorAll(q('fnc-nav__control')));
    const $controlsBgs = Array.from($slider.querySelectorAll(q('fnc-nav__bg')));
    const $progressAS = Array.from($slider.querySelectorAll(q('fnc-nav__control-progress')));

    let numOfSlides = $slides.length;
    let curSlide = 1;
    let sliding = false;
    const slidingAT = +parseFloat(getComputedStyle($slidesCont).transitionDuration) * 1000 || 1000;
    const slidingDelay = +parseFloat(getComputedStyle($slidesCont).transitionDelay) * 1000 || 666;

    let autoSlidingActive = false;
    let autoSlidingTO = null;
    const autoSlidingDelayDefault = 5000;
    let autoSlidingBlocked = false;

    let $activeSlide = null;
    let $activeControlsBg = null;
    let $prevControl = null;

    // Ensure slides/controls have the identifying classes (fnc-slide-1, fnc-nav__control-1, nav bg classes)
    $slides.forEach(function($slide, index) {
      const key = 'fnc-slide-' + (index + 1);
      const className = styles[key];
      if (className) $slide.classList.add(className);
      else $slide.classList.add('fnc-slide-' + (index + 1));
    });

    $controls.forEach(function($control, index) {
      $control.setAttribute('data-slide', index + 1);
      const key = 'fnc-nav__control-' + (index + 1);
      const className = styles[key];
      if (className) $control.classList.add(className);
      else $control.classList.add('fnc-nav__control-' + (index + 1));
    });

    $controlsBgs.forEach(function($bg, index) {
      const key = 'fnc-nav__bg-' + (index + 1);
      const className = styles[key];
      if (className) $bg.classList.add(className);
      else $bg.classList.add('fnc-nav__bg-' + (index + 1));
    });

    function afterSlidingHandler() {
      const prevSlide = $slider.querySelector(q('m--previous-slide'));
      if (prevSlide) prevSlide.classList.remove(styles['m--active-slide'] || 'm--active-slide', styles['m--previous-slide'] || 'm--previous-slide');
      const prevNavBg = $slider.querySelector(q('m--previous-nav-bg'));
      if (prevNavBg) prevNavBg.classList.remove(styles['m--active-nav-bg'] || 'm--active-nav-bg', styles['m--previous-nav-bg'] || 'm--previous-nav-bg');

      if ($activeSlide) $activeSlide.classList.remove(styles['m--before-sliding'] || 'm--before-sliding');
      if ($activeControlsBg) $activeControlsBg.classList.remove(styles['m--nav-bg-before'] || 'm--nav-bg-before');
      if ($prevControl) {
        $prevControl.classList.remove(styles['m--prev-control'] || 'm--prev-control');
        $prevControl.classList.add(styles['m--reset-progress'] || 'm--reset-progress');
        // force layout to reset transition
        void $prevControl.offsetTop;
        $prevControl.classList.remove(styles['m--reset-progress'] || 'm--reset-progress');
      }

      sliding = false;

      if (autoSlidingActive && !autoSlidingBlocked) {
        setAutoslidingTO();
      }
    }

    function performSliding(slideID) {
      if (sliding) return;
      sliding = true;
      window.clearTimeout(autoSlidingTO);
      curSlide = slideID;

      $prevControl = $slider.querySelector(q('m--active-control')) || $prevControl;
      if ($prevControl) $prevControl.classList.remove(styles['m--active-control'] || 'm--active-control');
      if ($prevControl) $prevControl.classList.add(styles['m--prev-control'] || 'm--prev-control');
      const newControl = $slider.querySelector(`.${styles['fnc-nav__control-' + slideID] || ('fnc-nav__control-' + slideID)}`) || $slider.querySelector(`[data-slide="${slideID}"]`);
      if (newControl) newControl.classList.add(styles['m--active-control'] || 'm--active-control');

      $activeSlide = $slider.querySelector(`.${styles['fnc-slide-' + slideID] || ('fnc-slide-' + slideID)}`) || $slider.querySelector(q('fnc-slide-' + slideID));
      $activeControlsBg = $slider.querySelector(`.${styles['fnc-nav__bg-' + slideID] || ('fnc-nav__bg-' + slideID)}`) || null;

      const currentActiveSlide = $slider.querySelector(`.${styles['m--active-slide'] || 'm--active-slide'}`);
      if (currentActiveSlide) currentActiveSlide.classList.add(styles['m--previous-slide'] || 'm--previous-slide');
      const currentActiveNavBg = $slider.querySelector(`.${styles['m--active-nav-bg'] || 'm--active-nav-bg'}`);
      if (currentActiveNavBg) currentActiveNavBg.classList.add(styles['m--previous-nav-bg'] || 'm--previous-nav-bg');

      if ($activeSlide) $activeSlide.classList.add(styles['m--before-sliding'] || 'm--before-sliding');
      if ($activeControlsBg) $activeControlsBg.classList.add(styles['m--nav-bg-before'] || 'm--nav-bg-before');

      // force layout
      void ($activeSlide && $activeSlide.offsetTop);

      if ($activeSlide) $activeSlide.classList.add(styles['m--active-slide'] || 'm--active-slide');
      if ($activeControlsBg) $activeControlsBg.classList.add(styles['m--active-nav-bg'] || 'm--active-nav-bg');

      setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
    }

    function controlClickHandler(e) {
      if (sliding) return;
      const el = e.currentTarget;
      if (el.classList.contains(styles['m--active-control'] || 'm--active-control')) return;
      if (true /* blockASafterClick default behavior */) {
        autoSlidingBlocked = true;
        $slider.classList.add(styles['m--autosliding-blocked'] || 'm--autosliding-blocked');
      }

      const slideID = +el.getAttribute('data-slide');
      performSliding(slideID);
    }

    $controls.forEach(function($control) {
      $control.addEventListener('click', controlClickHandler);
    });

    function setAutoslidingTO() {
      window.clearTimeout(autoSlidingTO);
      let delay = autoSlidingDelayDefault;
      curSlide++;
      if (curSlide > numOfSlides) curSlide = 1;

      autoSlidingTO = setTimeout(function() {
        performSliding(curSlide);
      }, delay);
    }

    // Initialize autosliding if desired; use options similar to original
    autoSlidingActive = true;
    setAutoslidingTO();
    $slider.classList.add(styles['m--with-autosliding'] || 'm--with-autosliding');

    const delay = autoSlidingDelayDefault + slidingDelay + slidingAT;
    $progressAS.forEach(function($progress) {
      $progress.style.transition = `transform ${delay / 1000}s`;
    });

    // Credits panel behavior
    const demoCont = container.querySelector(`.${styles['demo-cont']}`) || container;
    const creditsClose = demoCont.querySelector(`.${styles['demo-cont__credits-close']}`);
    const creditsPanel = demoCont.querySelector(`.${styles['demo-cont__credits']}`);
    const actionBtns = Array.from(container.querySelectorAll(`.${styles['fnc-slide__action-btn']}`));

    function toggleCredits() {
      demoCont.classList.toggle(styles['credits-active'] || 'credits-active');
    }

    actionBtns.forEach(btn => btn.addEventListener('click', toggleCredits));
    if (creditsClose) creditsClose.addEventListener('click', () => demoCont.classList.remove(styles['credits-active'] || 'credits-active'));

    // Global blending switch
    const blendingCheckbox = container.querySelector('.js-activate-global-blending') || container.querySelector(`.${styles['colorful-switch__checkbox']}`);
    const exampleSliderEl = container.querySelector(`.${styles['example-slider']}`) || null;
    function onBlendToggle() {
      if (!exampleSliderEl) return;
      exampleSliderEl.classList.toggle(styles['m--global-blending-active'] || 'm--global-blending-active');
    }
    if (blendingCheckbox) blendingCheckbox.addEventListener('click', onBlendToggle);

    // Cleanup on unmount
    return () => {
      $controls.forEach(function($control) {
        $control.removeEventListener('click', controlClickHandler);
      });
      actionBtns.forEach(btn => btn.removeEventListener('click', toggleCredits));
      if (creditsClose) creditsClose.removeEventListener('click', () => demoCont.classList.remove(styles['credits-active'] || 'credits-active'));
      if (blendingCheckbox) blendingCheckbox.removeEventListener('click', onBlendToggle);
      window.clearTimeout(autoSlidingTO);
    };
  }, [slides]);

  return (
        <div className={cls('demo-cont')}>
      <div ref={containerRef} className={cls('fnc-slider', 'example-slider')}>
            <div className={cls('fnc-slider__slides')}>
          {slides.map((slide, i) => (
            <div
              key={i}
                  className={cls('fnc-slide', slide.blend, i === 0 ? 'm--active-slide' : '', 'fnc-slide-' + (i + 1))}
            >
              <div className={styles['fnc-slide__inner']}>
                <div className={styles['fnc-slide__mask']}>
                  <div className={styles['fnc-slide__mask-inner']}></div>
                </div>
                <div className={styles['fnc-slide__content']}>
                  <h2 className={styles['fnc-slide__heading']}>
                    {slide.headingLines.map((line, idx) => (
                      <div key={idx} className={styles['fnc-slide__heading-line']}>
                        <span>{line}</span>
                      </div>
                    ))}
                  </h2>
                  <button type="button" className={styles['fnc-slide__action-btn']}>
                    Credits
                    <span data-text="Credits">Credits</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

            <nav className={cls('fnc-nav')}>
              <div className={cls('fnc-nav__bgs')}>
                {slides.map((s, i) => (
                  <div key={i} className={cls('fnc-nav__bg', i === 0 ? 'm--active-nav-bg' : '', 'm--navbg-' + (i + 1))}></div>
                ))}
              </div>
              <div className={cls('fnc-nav__controls')}>
                {slides.map((s, i) => (
                  <button key={i} className={cls('fnc-nav__control')}>
                    {s.navLabel}
                    <span className={cls('fnc-nav__control-progress')}></span>
                  </button>
                ))}
              </div>
            </nav>
      </div>

      {/* credits panel + switch (markup only) */}
      <div className={styles['demo-cont__credits']}>
        <div className={styles['demo-cont__credits-close']}></div>
        <h2 className={styles['demo-cont__credits-heading']}>Made by</h2>
        <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/142996/profile/profile-512_5.jpg" alt="" className={styles['demo-cont__credits-img']} />
        <h3 className={styles['demo-cont__credits-name']}>Nikolay Talanov</h3>
        <a href="https://codepen.io/suez/" target="_blank" rel="noreferrer" className={styles['demo-cont__credits-link']}>My codepen</a>
        <a href="https://twitter.com/NikolayTalanov" target="_blank" rel="noreferrer" className={styles['demo-cont__credits-link']}>My twitter</a>
        <h2 className={styles['demo-cont__credits-heading']}>Based on</h2>
        <a href="https://dribbble.com/shots/2375246-Fashion-Butique-slider-animation" target="_blank" rel="noreferrer" className={styles['demo-cont__credits-link']}>Concept by Kreativa Studio</a>
        <h4 className={styles['demo-cont__credits-blend']}>Global Blend Mode</h4>
        <div className={styles['colorful-switch']}>
          <input type="checkbox" className={`${styles['colorful-switch__checkbox']} js-activate-global-blending`} id="colorful-switch-cb" />
          <label className={styles['colorful-switch__label']} htmlFor="colorful-switch-cb">
            <span className={styles['colorful-switch__bg']}></span>
            <span className={styles['colorful-switch__dot']}></span>
            <span className={styles['colorful-switch__on']}> 
              <span className={styles['colorful-switch__on__inner']}></span>
            </span>
            <span className={styles['colorful-switch__off']}></span>
          </label>
        </div>
      </div>
    </div>
  );
}
