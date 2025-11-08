"use client";

import React, { useEffect, useRef } from 'react';
import styles from './ImageOverlaySlider.module.css';

// HTML-only conversion of the original `image-overlay-slider` export.
// This component is data-driven: it accepts a `slides` prop (array of strings/objects)
// and renders the same DOM structure and class names as the original HTML so
// that the original `style.css` and `script.js` can be applied later.
export default function ImageOverlaySlider({ slides = [] }) {
  const rootRef = useRef(null);

  // Ported behavior from exports/image-overlay-slider/dist/script.js
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const container = rootRef.current;
    if (!container) return undefined;

    // mutable refs for stateful flags used by the original script
    const curpage = { value: 1 };
    const sliding = { value: false };
    const click = { value: true };
    const svg = { value: true };

    const timeouts = [];

    const pagePrefix = 'slide';
    const transitionPrefix = 'circle';

    const query = (selector) => container.querySelector(selector);
    const queryById = (id) => container.querySelector(`#${id}`);

    function addTranToAllPages() {
      for (let k = 1; k <= 4; k++) {
        const a1 = queryById(pagePrefix + k);
        if (a1) a1.classList.add(styles.tran);
      }
    }

    function removeTranFromAllPages() {
      for (let k = 1; k <= 4; k++) {
        const a1 = queryById(pagePrefix + k);
        if (a1) a1.classList.remove(styles.tran);
      }
    }

    function leftSlide() {
      if (click.value) {
        if (curpage.value === 1) curpage.value = 5;
        sliding.value = true;
        curpage.value--;
        svg.value = true;
        click.value = false;
        addTranToAllPages();
        timeouts.push(setTimeout(() => move(), 200));
        timeouts.push(setTimeout(() => removeTranFromAllPages(), 1400));
      }
    }

    function rightSlide() {
      if (click.value) {
        if (curpage.value === 4) curpage.value = 0;
        sliding.value = true;
        curpage.value++;
        svg.value = false;
        click.value = false;
        addTranToAllPages();
        timeouts.push(setTimeout(() => move(), 200));
        timeouts.push(setTimeout(() => removeTranFromAllPages(), 1400));
      }
    }

    function move() {
      if (sliding.value) {
        sliding.value = false;
        // helper to animate circle reveal using stroke-dashoffset (more reliable)
        function startCircleReveal(c) {
          try {
            const r = parseFloat(c.getAttribute('r')) || 0;
            const circumference = 2 * Math.PI * r;
            console.log('startCircleReveal ->', c.id, 'r=', r, 'circ=', circumference);
            c.style.strokeDasharray = `${circumference}`;
            c.style.strokeDashoffset = `${circumference}`;
            // ensure visibility and thickness explicitly (inline styles to avoid module mapping issues)
            c.style.stroke = '#ffffff';
            c.style.strokeWidth = '82';
            if (c.ownerSVGElement) {
              try { c.ownerSVGElement.style.zIndex = '60'; } catch (e) {}
            }
            // ensure the class is applied (thickness styling) then trigger the dashoffset animation
            c.classList.remove(styles.steap);
            c.classList.add(styles.streak);
            // slight delay to allow styles to flush
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                c.style.transition = 'stroke-dashoffset 0.55s linear';
                c.style.strokeDashoffset = '0';
                // log a quick readback after animation starts
                setTimeout(() => {
                  try {
                    console.log(c.id, 'computed stroke-width:', window.getComputedStyle(c).getPropertyValue('stroke-width'), 'dashoffset:', window.getComputedStyle(c).getPropertyValue('stroke-dashoffset'));
                  } catch (e) {}
                }, 50);
              });
            });
          } catch (e) {}
        }

        if (svg.value) {
          // when sliding left, animate the circles in reverse order so the reveal
          // starts from the outer rings first (mirrors the original behaviour)
          for (let j = 9; j >= 1; j--) {
            const c = queryById(transitionPrefix + j);
            if (c) startCircleReveal(c);
          }
        } else {
          // when sliding right, animate small-to-large as original
          for (let j = 10; j <= 18; j++) {
            const c = queryById(transitionPrefix + j);
            if (c) startCircleReveal(c);
          }
        }

        timeouts.push(
          setTimeout(() => {
            for (let i = 1; i <= 4; i++) {
              if (i === curpage.value) {
                const a = queryById(pagePrefix + i);
                if (a) a.classList.add(styles.up1);
              } else {
                const b = queryById(pagePrefix + i);
                if (b) b.classList.remove(styles.up1);
              }
            }
            sliding.value = true;
          }, 600)
        );

        timeouts.push(
          setTimeout(() => {
            click.value = true;
          }, 1700)
        );

        timeouts.push(
          setTimeout(() => {
            if (svg.value) {
              for (let j = 1; j <= 9; j++) {
                const c = queryById(transitionPrefix + j);
                if (c) {
                  // reverse the dash animation and reset class
                  try {
                    const r = parseFloat(c.getAttribute('r')) || 0;
                    const circumference = 2 * Math.PI * r;
                    console.log('reverseCircleReveal ->', c.id, 'r=', r, 'circ=', circumference);
                    c.style.transition = 'stroke-dashoffset 0.45s linear';
                    c.style.strokeDashoffset = `${circumference}`;
                    // after animation, clear inline transition to allow next reveal
                    setTimeout(() => {
                      c.classList.remove(styles.streak);
                      c.classList.add(styles.steap);
                      // clear inline animation styles so next reveal starts fresh
                      c.style.transition = '';
                      c.style.strokeDasharray = '';
                      c.style.strokeDashoffset = '';
                      c.style.stroke = '';
                      c.style.strokeWidth = '';
                      if (c.ownerSVGElement) {
                        try { c.ownerSVGElement.style.zIndex = ''; } catch (e) {}
                      }
                      console.log('reverse complete ->', c.id);
                      // ensure flags reset so a subsequent slide can run
                      sliding.value = false;
                      click.value = true;
                    }, 450);
                  } catch (e) {}
                }
              }
            } else {
              for (let j = 10; j <= 18; j++) {
                const c = queryById(transitionPrefix + j);
                if (c) {
                  try {
                    const r = parseFloat(c.getAttribute('r')) || 0;
                    const circumference = 2 * Math.PI * r;
                    c.style.transition = 'stroke-dashoffset 0.45s linear';
                    c.style.strokeDashoffset = `${circumference}`;
                    setTimeout(() => {
                      c.classList.remove(styles.streak);
                      c.classList.add(styles.steap);
                      c.style.transition = '';
                      c.style.strokeDasharray = '';
                      c.style.strokeDashoffset = '';
                      c.style.stroke = '';
                      c.style.strokeWidth = '';
                      if (c.ownerSVGElement) {
                        try { c.ownerSVGElement.style.zIndex = ''; } catch (e) {}
                      }
                      sliding.value = false;
                      click.value = true;
                    }, 450);
                  } catch (e) {}
                }
              }
              sliding.value = true;
            }
          }, 850)
        );

        // safety: ensure click restored (mirrors original duplicate timeout)
        timeouts.push(
          setTimeout(() => {
            click.value = true;
          }, 1700)
        );
      }
    }

  // attach handlers to buttons (scoped)
  const leftBtn = queryById('left');
  const rightBtn = queryById('right');
  if (leftBtn) leftBtn.addEventListener('mousedown', leftSlide);
  if (rightBtn) rightBtn.addEventListener('mousedown', rightSlide);

    // keyboard support (document-level like original)
    const onKeydown = (e) => {
      if (e.keyCode === 37) leftSlide();
      else if (e.keyCode === 39) rightSlide();
    };
    document.addEventListener('keydown', onKeydown);

    // cleanup on unmount
    return () => {
      if (leftBtn) leftBtn.removeEventListener('mousedown', leftSlide);
      if (rightBtn) rightBtn.removeEventListener('mousedown', rightSlide);
      document.removeEventListener('keydown', onKeydown);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);
  // slides is expected to be an array of objects: { id, title }
  // We keep the original ids/class names used in the export to make it
  // straightforward to later wire the CSS and JS without changing selectors.
  const getSlideId = (index) => `slide${index + 1}`;

  return (
  <div className={`${styles.parent} ${styles.root}`} ref={rootRef}>
      <div className={styles.slider}>
        <button type="button" id="right" className={styles.right} name="button">
          {/* SVG arrow (same markup as original) */}
          <svg version="1.1" id="Capa_1" className={styles.Capa_1} width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 477.175 477.175" style={{ enableBackground: 'new 0 0 477.175 477.175' }} xmlSpace="preserve">
            <g>
        <path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5
      c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"
        />
            </g>
          </svg>
        </button>

        <button type="button" id="left" className={styles.left} name="button">
          <svg version="1.1" id="Capa_2" className={styles.Capa_2} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 477.175 477.175" style={{ enableBackground: 'new 0 0 477.175 477.175' }} xmlSpace="preserve">
            <g>
        <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
      c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z" />
            </g>
          </svg>
        </button>

        {/* Left circles SVG (keeps original IDs/classes) */}
        <svg id="svg2" className={styles.up2} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <circle id="circle1" className={`${styles.circle1} ${styles.steap}`} cx="34px" cy="49%" r="20" />
          <circle id="circle2" className={`${styles.circle2} ${styles.steap}`} cx="34px" cy="49%" r="100" />
          <circle id="circle3" className={`${styles.circle3} ${styles.steap}`} cx="34px" cy="49%" r="180" />
          <circle id="circle4" className={`${styles.circle4} ${styles.steap}`} cx="34px" cy="49%" r="260" />
          <circle id="circle5" className={`${styles.circle5} ${styles.steap}`} cx="34px" cy="49%" r="340" />
          <circle id="circle6" className={`${styles.circle6} ${styles.steap}`} cx="34px" cy="49%" r="420" />
          <circle id="circle7" className={`${styles.circle7} ${styles.steap}`} cx="34px" cy="49%" r="500" />
          <circle id="circle8" className={`${styles.circle8} ${styles.steap}`} cx="34px" cy="49%" r="580" />
          <circle id="circle9" className={`${styles.circle9} ${styles.steap}`} cx="34px" cy="49%" r="660" />
        </svg>

        {/* Right circles SVG */}
        <svg id="svg1" className={styles.up2} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <circle id="circle10" className={`${styles.circle10} ${styles.steap}`} cx="648px" cy="49%" r="20" />
          <circle id="circle11" className={`${styles.circle11} ${styles.steap}`} cx="648px" cy="49%" r="100" />
          <circle id="circle12" className={`${styles.circle12} ${styles.steap}`} cx="648px" cy="49%" r="180" />
          <circle id="circle13" className={`${styles.circle13} ${styles.steap}`} cx="648px" cy="49%" r="260" />
          <circle id="circle14" className={`${styles.circle14} ${styles.steap}`} cx="648px" cy="49%" r="340" />
          <circle id="circle15" className={`${styles.circle15} ${styles.steap}`} cx="648px" cy="49%" r="420" />
          <circle id="circle16" className={`${styles.circle16} ${styles.steap}`} cx="648px" cy="49%" r="500" />
          <circle id="circle17" className={`${styles.circle17} ${styles.steap}`} cx="648px" cy="49%" r="580" />
          <circle id="circle18" className={`${styles.circle18} ${styles.steap}`} cx="648px" cy="49%" r="660" />
        </svg>

        {/* Slides: preserve original ids and classes */}
        {slides.length > 0 ? (
          slides.map((s, i) => (
            <div id={getSlideId(i)} className={[styles[`slide${i + 1}`], i === 0 && styles.up1].filter(Boolean).join(' ')} key={i}>
              {s.title || s}
            </div>
          ))
        ) : (
          // Fallback to the original static labels if no slides provided
          <>
            <div id="slide1" className={`${styles.slide1} ${styles.up1}`}>MOUNTAIN</div>
            <div id="slide2" className={styles.slide2}>BEACH</div>
            <div id="slide3" className={styles.slide3}>FOREST</div>
            <div id="slide4" className={styles.slide4}>DESERT</div>
          </>
        )}
      </div>
    </div>
  );
}
