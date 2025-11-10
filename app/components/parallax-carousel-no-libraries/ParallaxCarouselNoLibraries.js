"use client";

import React, { useEffect, useRef } from 'react';
import styles from './ParallaxCarouselNoLibraries.module.css';

export default function ParallaxCarouselNoLibraries() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Lightweight carousel port: basic positioning, prev/next, drag and autoplay.
  const viewport = root.querySelector(`.${styles['mzaCarousel-viewport']}`);
  const track = root.querySelector(`.${styles['mzaCarousel-track']}`);
  const slides = Array.from(root.querySelectorAll(`.${styles['mzaCarousel-slide']}`));
  const prevBtn = root.querySelector(`.${styles['mzaCarousel-prev']}`);
  const nextBtn = root.querySelector(`.${styles['mzaCarousel-next']}`);
  const pagination = root.querySelector(`.${styles['mzaCarousel-pagination']}`);
  const progressBar = root.querySelector(`.${styles['mzaCarousel-progressBar']}`);

  let n = slides.length;
    let width = 0;
    let gap = 28;
    let peek = 0.15;
    let slideW = 0;
    let pos = 0; // floating position
    let index = 0;
    let rafId = 0;
  let startTime = performance.now();
    const interval = 4500;

    // advanced options (matching original export)
    const opts = {
      rotateY: 34,
      zDepth: 150,
      scaleDrop: 0.09,
      blurMax: 2.0,
      activeLeftBias: 0.12
    };
    let tiltX = 0, tiltY = 0;

    function measure() {
      const rect = viewport.getBoundingClientRect();
      width = rect.width;
      slideW = Math.min(880, width * (1 - peek * 2));
      root.style.setProperty('--mzaCardH', `${Math.max(320, Math.min(640, Math.round(rect.height - 100)))}px`);
    }

    // preload images (same behavior as original export)
    function preloadImages() {
      slides.forEach((sl) => {
        const card = sl.querySelector(`.${styles.mzaCard}`);
        if (!card) return;
        const bg = getComputedStyle(card).getPropertyValue('--mzaCard-bg');
        const m = /url\((?:'|")?([^'\")]+)(?:'|")?\)/.exec(bg);
        if (m && m[1]) {
          const img = new Image(); img.src = m[1];
        }
      });
    }

    function mod(i) { return ((i % n) + n) % n; }

    function render(markActive = false) {
      const span = slideW + gap;
      for (let i = 0; i < n; i++) {
        let d = i - pos;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        const weight = Math.max(0, 1 - Math.abs(d) * 2);
        const biasActive = -slideW * opts.activeLeftBias * weight;
        const tx = d * span + biasActive;
        const depth = -Math.abs(d) * opts.zDepth;
        const rot = -d * opts.rotateY;
        const scale = 1 - Math.min(Math.abs(d) * opts.scaleDrop, 0.42);
        const blur = Math.min(Math.abs(d) * opts.blurMax, opts.blurMax);
        const z = Math.round(1000 - Math.abs(d) * 10);

        const s = slides[i];
        // transform with z-depth
        s.style.transform = `translate3d(${tx}px, -50%, ${depth}px) rotateY(${rot}deg) scale(${scale})`;
        s.style.filter = `blur(${blur}px)`;
        s.style.zIndex = `${z}`;

        if (markActive) s.dataset.state = Math.round(index) === i ? 'active' : 'rest';

  // parallax variables for card backgrounds and elements
  const card = s.querySelector(`.${styles.mzaCard}`);
        const parBase = Math.max(-1, Math.min(1, -d));
        const parX = parBase * 48 + tiltY * 2.0;
        const parY = tiltX * -1.5;
        const bgX = parBase * -64 + tiltY * -2.4;
        if (card) {
          card.style.setProperty('--mzaParX', `${parX.toFixed(2)}px`);
          card.style.setProperty('--mzaParY', `${parY.toFixed(2)}px`);
          card.style.setProperty('--mzaParBgX', `${bgX.toFixed(2)}px`);
          card.style.setProperty('--mzaParBgY', `${(parY * 0.35).toFixed(2)}px`);
        }
      }

  // update dots
  const active = mod(Math.round(pos));
  pagination.querySelectorAll(`.${styles['mzaCarousel-dot']}`).forEach((b, i) => b.setAttribute('aria-selected', i === active ? 'true' : 'false'));
    }

    function _renderProgress(p) { if (progressBar) progressBar.style.transform = `scaleX(${p})`; }

    function loop(t) {
      const elapsed = t - startTime;
      const p = Math.min(1, elapsed / interval);
      _renderProgress(p);
      if (elapsed >= interval) { goTo(mod(index + 1)); }
      rafId = requestAnimationFrame(loop);
    }

    function goTo(i, animate = true) {
      const start = pos;
      const end = (() => { let d = i - Math.round(start); if (d > n/2) d -= n; if (d < -n/2) d += n; return Math.round(start) + d; })();
      const dur = animate ? 600 : 0;
      const t0 = performance.now();
      const ease = x => 1 - Math.pow(1 - x, 4);
      function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        const p = dur ? ease(t) : 1;
        pos = start + (end - start) * p;
        render();
          if (t < 1) requestAnimationFrame(step);
          else { index = mod(i); pos = index; startTime = performance.now(); render(true); }
      }
      requestAnimationFrame(step);
    }

    // setup pagination
    pagination.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = styles['mzaCarousel-dot'];
      b.type = 'button';
      b.setAttribute('role','tab');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', () => { goTo(i); });
      pagination.appendChild(b);
    });

    // initial setup
    preloadImages();
    measure(); render(true);
    rafId = requestAnimationFrame(loop);

    // responsive breakpoints (apply options similar to original)
    const breakpoints = [
      { mq: '(max-width: 1200px)', gap: 24, peek: 0.12, rotateY: 28, zDepth: 120, scaleDrop: 0.08, activeLeftBias: 0.1 },
      { mq: '(max-width: 1000px)', gap: 18, peek: 0.09, rotateY: 22, zDepth: 90, scaleDrop: 0.07, activeLeftBias: 0.09 },
      { mq: '(max-width: 768px)', gap: 14, peek: 0.06, rotateY: 16, zDepth: 70, scaleDrop: 0.06, activeLeftBias: 0.08 },
      { mq: '(max-width: 560px)', gap: 12, peek: 0.05, rotateY: 12, zDepth: 60, scaleDrop: 0.05, activeLeftBias: 0.07 }
    ];
    const mqls = breakpoints.map(bp => {
      const m = window.matchMedia(bp.mq);
      const apply = () => {
        if (m.matches) {
          gap = bp.gap; peek = bp.peek; opts.rotateY = bp.rotateY; opts.zDepth = bp.zDepth; opts.scaleDrop = bp.scaleDrop; opts.activeLeftBias = bp.activeLeftBias;
          measure(); render();
        }
      };
      if (m.addEventListener) m.addEventListener('change', apply); else m.addListener(apply);
      apply();
      return { m, apply };
    });

    // Pause on hover handling
    let pausedAt = 0;
    function onMouseEnter() { startTime = startTime; pausedAt = performance.now(); }
    root.addEventListener('mouseenter', onMouseEnter);
    root.addEventListener('mouseleave', onMouseLeave);

    // keyboard navigation
    function onKey(e) { if (e.key === 'ArrowLeft') goTo(mod(index-1)); if (e.key === 'ArrowRight') goTo(mod(index+1)); }
    root.addEventListener('keydown', onKey);

    // Resize observer & orientation change
    const ro = new ResizeObserver(() => { measure(); render(); });
    ro.observe(viewport);
    window.addEventListener('orientationchange', () => setTimeout(() => { measure(); render(); }, 250));

    // interactions
    let dragging = false; let pointerId = null; let x0 = 0; let v = 0; let t0 = 0;
    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; pointerId = e.pointerId; x0 = e.clientX; t0 = performance.now(); v = 0; viewport.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e) {
      // pointer move also used for tilt calculation
      const r = viewport.getBoundingClientRect();
      tiltY = (e.clientX - r.left) / r.width - 0.5;
      tiltX = (e.clientY - r.top) / r.height - 0.5;
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - x0; const dt = Math.max(16, performance.now() - t0); v = dx / dt; const slideSpan = slideW + gap; pos = mod(index - dx/slideSpan); render();
    }
    function onPointerUp(e) {
      if (!dragging) return; dragging = false; try { viewport.releasePointerCapture(pointerId); } catch{}; pointerId = null;
      const threshold = 0.18; let target = Math.round(pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0)); goTo(mod(target));
    }
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);

    function onTilt(e) {
      const r = viewport.getBoundingClientRect();
      tiltY = (e.clientX - r.left) / r.width - 0.5;
      tiltX = (e.clientY - r.top) / r.height - 0.5;
    }
    viewport.addEventListener('pointermove', onTilt);

    function onPrev() { goTo(mod(index-1)); }
    function onNext() { goTo(mod(index+1)); }
    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('pointercancel', onPointerUp);
      viewport.removeEventListener('pointermove', onTilt);
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
      root.removeEventListener('mouseenter', onMouseEnter);
      root.removeEventListener('mouseleave', onMouseLeave);
      root.removeEventListener('keydown', onKey);
      ro.disconnect();
      mqls.forEach(item => { try { if (item.m.removeEventListener) item.m.removeEventListener('change', item.apply); else item.m.removeListener(item.apply); } catch {} });
    };
  }, []);

  return (
    <div className={styles.mzaCarousel} id="mzaCarousel" ref={rootRef} aria-roledescription="carousel" aria-label="Featured cards">
      <div className={styles['mzaCarousel-viewport']} tabIndex={0}>
        <div className={styles['mzaCarousel-track']}>
          <article className={styles['mzaCarousel-slide']} role="group" aria-roledescription="slide" aria-label="1 of 5">
            <div className={styles.mzaCard} style={{ ['--mzaCard-bg']: "url('https://picsum.photos/id/1015/1600/1000')" }}>
              <header className={`${styles['mzaCard-head']} ${styles['mzaPar-1']}`}>
                <h2 className={styles['mzaCard-title']}>Edge Visuals</h2>
                <p className={styles['mzaCard-kicker']}>Design systems that breathe</p>
              </header>
              <p className={`${styles['mzaCard-text']} ${styles['mzaPar-2']}`}>Build adaptive UI foundations with tokens, motion, and accessible color ramps. Ship faster without sameness.</p>
              <footer className={`${styles['mzaCard-actions']} ${styles['mzaPar-3']}`}><button className={styles.mzaBtn}>See case study</button></footer>
            </div>
          </article>

          <article className={styles['mzaCarousel-slide']} role="group" aria-roledescription="slide" aria-label="2 of 5">
            <div className={styles.mzaCard} style={{ ['--mzaCard-bg']: "url('https://picsum.photos/id/1011/1600/1000')" }}>
              <header className={`${styles['mzaCard-head']} ${styles['mzaPar-1']}`}>
                <h2 className={styles['mzaCard-title']}>Realtime Dashboards</h2>
                <p className={styles['mzaCard-kicker']}>Signal over noise</p>
              </header>
              <p className={`${styles['mzaCard-text']} ${styles['mzaPar-2']}`}>Stream metrics, smooth spikes, and highlight deltas. Clarity first, chrome last.</p>
              <footer className={`${styles['mzaCard-actions']} ${styles['mzaPar-3']}`}><button className={styles.mzaBtn}>View live demo</button></footer>
            </div>
          </article>

          <article className={styles['mzaCarousel-slide']} role="group" aria-roledescription="slide" aria-label="3 of 5">
            <div className={styles.mzaCard} style={{ ['--mzaCard-bg']: "url('https://picsum.photos/id/1018/1600/1000')" }}>
              <header className={`${styles['mzaCard-head']} ${styles['mzaPar-1']}`}>
                <h2 className={styles['mzaCard-title']}>Brand Motion</h2>
                <p className={styles['mzaCard-kicker']}>Identity in motion</p>
              </header>
              <p className={`${styles['mzaCard-text']} ${styles['mzaPar-2']}`}>Translate marks into kinetic systems. Timing, easing, and restraint create memory.</p>
              <footer className={`${styles['mzaCard-actions']} ${styles['mzaPar-3']}`}><button className={styles.mzaBtn}>Explore reels</button></footer>
            </div>
          </article>

          <article className={styles['mzaCarousel-slide']} role="group" aria-roledescription="slide" aria-label="4 of 5">
            <div className={styles.mzaCard} style={{ ['--mzaCard-bg']: "url('https://picsum.photos/id/1021/1600/1000')" }}>
              <header className={`${styles['mzaCard-head']} ${styles['mzaPar-1']}`}>
                <h2 className={styles['mzaCard-title']}>E-commerce UX</h2>
                <p className={styles['mzaCard-kicker']}>Frictionless paths</p>
              </header>
              <p className={`${styles['mzaCard-text']} ${styles['mzaPar-2']}`}>Model intent, compress choice, and keep the dopamine loop honest. Checkout in one breath.</p>
              <footer className={`${styles['mzaCard-actions']} ${styles['mzaPar-3']}`}><button className={styles.mzaBtn}>See patterns</button></footer>
            </div>
          </article>

          <article className={styles['mzaCarousel-slide']} role="group" aria-roledescription="slide" aria-label="5 of 5">
            <div className={styles.mzaCard} style={{ ['--mzaCard-bg']: "url('https://picsum.photos/id/1005/1600/1000')" }}>
              <header className={`${styles['mzaCard-head']} ${styles['mzaPar-1']}`}>
                <h2 className={styles['mzaCard-title']}>Content Engines</h2>
                <p className={styles['mzaCard-kicker']}>Scale without sludge</p>
              </header>
              <p className={`${styles['mzaCard-text']} ${styles['mzaPar-2']}`}>Structured content, image policy, and smart defaults. Publish daily, stay sharp.</p>
              <footer className={`${styles['mzaCard-actions']} ${styles['mzaPar-3']}`}><button className={styles.mzaBtn}>Read playbook</button></footer>
            </div>
          </article>
        </div>
      </div>

      <div className={styles['mzaCarousel-controls']} aria-label="Controls">
        <button className={styles['mzaCarousel-prev']} aria-label="Previous slide" type="button">‹</button>
        <button className={styles['mzaCarousel-next']} aria-label="Next slide" type="button">›</button>
      </div>

      <div className={styles['mzaCarousel-pagination']} role="tablist" aria-label="Slide navigation"></div>
      <div className={styles['mzaCarousel-progress']} aria-hidden="true"><span className={styles['mzaCarousel-progressBar']}></span></div>
    </div>
  );
}
