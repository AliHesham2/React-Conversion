"use client";

import React, { useEffect, useRef } from 'react';
import styles from './AutoplaySliderPauseControl.module.css';
import data from '../../data/autoplaySliderPauseControlData';

// Dynamically load a script into the document (used to load Swiper from CDN).
// Returns a Promise that resolves when the script has loaded.
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

// Dynamically add a stylesheet link to the document head (used to load Swiper CSS).
// Resolves when the stylesheet finishes loading.
function loadCss(href) {
  return new Promise((resolve) => {
    if (document.querySelector(`link[href="${href}"]`)) return resolve();
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = () => resolve();
    document.head.appendChild(l);
  });
}

/*
  AutoplaySliderPauseControl
  --------------------------
  React client component that reproduces the original export's full-screen
  autoplay slider with pause control.

  Props:
  - slides: array of slide objects { type: 'image'|'video', src, title, subtitle }

  Notes:
  - This component loads Swiper (v11) from CDN at runtime and scopes all
    DOM queries to `rootRef` to avoid touching global DOM outside this
    component.
  - The autoplay is implemented with a requestAnimationFrame loop to match
    the original export's timing and visual loaders.
*/
export default function AutoplaySliderPauseControl({ slides = data }) {
  const rootRef = useRef(null);
  // component state kept minimal; no debug state in production

  

  useEffect(() => {
    let mounted = true;
    let cleanupFn = null;

    async function init() {
      // locate slider elements scoped to this component
      try {
        await loadCss('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
        await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
      } catch (err) {
        console.error('Failed to load Swiper assets', err);
        return;
      }

      if (!mounted || !window.Swiper) return;

    const sliderEl = rootRef.current && rootRef.current.querySelector('.main-slider');
    const parent = rootRef.current && rootRef.current.querySelector('.wrapper-slider');
    const paginationEl = parent && parent.querySelector('.swiper-pagination');

      if (!sliderEl) {
        console.error('Slider element not found');
        return;
      }

      let progress = 0;
      let duration = 6000;
      let isPlaying = true;
      let startTime;
      let rafId;
      let swiper;

      const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/></svg>`;

      try {
        swiper = new window.Swiper(sliderEl, {
          effect: 'fade',
          speed: 1000,
          fadeEffect: { crossFade: true },
          loop: true,
          // ensure pagination target exists: pass element when available, otherwise fallback to selector
          pagination: {
            el: paginationEl || '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${className}" data-index="${index}"><span class="number">${index + 1}</span></span>`;
            }
          },
          on: {
            init(swiperInstance) {
              swiper = swiperInstance;
              // give Swiper a tick to render pagination then start autoplay and init loaders
              setTimeout(() => {
                try {
                  if (swiper && typeof swiper.update === 'function') swiper.update();
                  if (swiper && swiper.pagination && typeof swiper.pagination.render === 'function') swiper.pagination.render();
                } catch (e) {}
                startCustomAutoplay();
                resetLoaders();
                try {
                  const bullets = (paginationEl || rootRef.current.querySelector('.swiper-pagination'))?.querySelectorAll('.swiper-pagination-bullet');
                } catch (e) { /* swallow */ }
              }, 50);
            },
            slideChangeTransitionStart() {
              progress = 0;
              startTime = performance.now();
              resetLoaders();
            }
          }
        });

        // --- Custom autoplay implementation (requestAnimationFrame driven) ---
        // Start the autoplay RAF loop. The loop callback receives a high-
        // resolution timestamp (`now`) from the browser which we use to
        // compute elapsed time and update the circular loader.
        function startCustomAutoplay() {
          startTime = performance.now();
          rafId = requestAnimationFrame(loop);
        }

        // RAF callback: calculate elapsed time, update loader and advance
        // the slide when progress reaches 100%.
        function loop(now) {
          if (!isPlaying) return;
          if (typeof now === 'undefined' || now === null) now = performance.now();
          if (!startTime) startTime = now;
          const elapsed = now - startTime;
          progress = Math.min((elapsed / duration) * 100, 100);
          if (swiper) updateLoader(swiper.realIndex, Math.round(progress));
          if (progress >= 100) {
            try { swiper.slideNext(); } catch (e) { /* swallow */ }
            progress = 0;
            startTime = performance.now();
          }
          rafId = requestAnimationFrame(loop);
        }

        // Pause the autoplay loop and cancel the outstanding RAF.
        function pauseAutoplay() {
          isPlaying = false;
          try { cancelAnimationFrame(rafId); } catch (e) {}
        }

        // Resume autoplay from the current progress point.
        function resumeAutoplay() {
          if (isPlaying) return;
          isPlaying = true;
          startTime = performance.now() - (progress / 100) * duration;
          rafId = requestAnimationFrame(loop);
        }

        // Replace the active pagination bullet's contents with the play/pause
        // button and the circular percentage indicator. Non-active bullets
        // show only the slide number. This mirrors the original export's DOM
        // mutations and keeps the visual identical.
        function resetLoaders() {
          if (!paginationEl) return;
          paginationEl.querySelectorAll('.swiper-pagination-bullet').forEach((bullet, i) => {
            const isActive = bullet.classList.contains('swiper-pagination-bullet-active');
            if (isActive) {
              bullet.innerHTML = `
                        <div class="bullet-content">
                            <button class="icon playpause-btn">
                                ${isPlaying ? pauseSVG : playSVG}
                            </button>
                            <div class="percentage" style="--p: ${progress}%"></div>
                        </div>`;

              // Small timeout to allow CSS transitions to apply when the
              // `.percentage` element is created.
              setTimeout(() => {
                const percentage = bullet.querySelector('.percentage');
                if (percentage) percentage.classList.add('show');
              }, 100);

              const btn = bullet.querySelector('.playpause-btn');
              if (btn) {
                btn.addEventListener('click', () => {
                  if (isPlaying) {
                    pauseAutoplay();
                    btn.innerHTML = playSVG;
                  } else {
                    resumeAutoplay();
                    btn.innerHTML = pauseSVG;
                  }
                });
              }
            } else {
              const index = bullet.dataset.index;
              bullet.innerHTML = `<span class="number">${parseInt(index) + 1}</span>`;
            }
          });
        }

        // Update the CSS custom property `--p` used by the circular loader so
        // the conic-gradient reflects the current progress.
        function updateLoader(index, percent) {
          const bullet = paginationEl.querySelectorAll('.swiper-pagination-bullet')[index];
          if (bullet) {
            const percentage = bullet.querySelector('.percentage');
            if (percentage) {
              percentage.style.setProperty('--p', `${percent}%`);
            }
          }
        }

        // cleanup reference
        cleanupFn = () => {
          try { cancelAnimationFrame(rafId); } catch (e) {}
          try { if (swiper && swiper.destroy) swiper.destroy(true, true); } catch (e) { console.error(e); }
        };
      } catch (e) {
        console.error('Failed to initialize Swiper', e);
      }

      // cleanup function to return
      const cleanup = () => {
        mounted = false;
        cancelAnimationFrame(rafId);
        
        try {
          if (swiper && swiper.destroy) swiper.destroy(true, true);
        } catch (e) { console.error(e); }
      };

      return cleanup;
    }

    init().then((c) => { cleanupFn = c; }).catch((e) => console.error(e));

    return () => {
      mounted = false;
      if (cleanupFn) cleanupFn();
    };
  }, []);

  // keep hooks consistent; no raw-mode early return here in production flow



  return (
    <div ref={rootRef} className={styles.root}>
      <div className="wrapper-slider">
        <div className="swiper main-slider">
          <div className="swiper-wrapper">
            {slides.map((s, i) => (
              <div className="swiper-slide" key={i}>
                  <div className="item" style={{position:'relative'}}>
                    {s.type === 'image' && (
                      <picture>
                        <img src={s.src} alt={s.alt || 'slide'} />
                      </picture>
                    )}
                    {s.type === 'video' && (
                      <div className="video">
                        <video autoPlay loop muted playsInline>
                          <source src={s.src} type="video/mp4" />
                        </video>
                      </div>
                    )}

                    <div className="parent-text">
                      <div className="info-text">
                        <h2>{s.title}</h2>
                        <p>{s.subtitle}</p>
                        <a href="#">Aprende más</a>
                      </div>
                    </div>
                    
                  </div>
              </div>
            ))}
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </div>
  );
}
