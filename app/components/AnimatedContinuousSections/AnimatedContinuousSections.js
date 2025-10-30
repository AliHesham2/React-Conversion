"use client";
import { useEffect, useRef } from 'react';
import styles from './AnimatedContinuousSections.module.css';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

// We try to register Observer if it's available. If not, we'll dynamically load it at runtime.
try {
  gsap.registerPlugin(Observer);
} catch (e) {
  // will attempt to load dynamically later
}


// Note: per-character spans are rendered in JSX below, so we don't load
// SplitText at runtime. This keeps the component dependency-free and fast.

/**
 * AnimatedContinuousSections
 * -------------------------
 * Client component that reproduces the "animated continuous sections" example
 * using GSAP. It supports SplitText (optional) and falls back to per-character
 * spans when SplitText isn't available. Navigation is driven by GSAP Observer
 * when available; otherwise a lightweight wheel/touch fallback is used.
 *
 * Props:
 *  - data: { sections: [{ className, heading, image, backgroundPosition? }] }
 *
 * Behavior contract:
 *  - Renders each section as a fixed full-screen panel with background image
 *  - Animates outer/inner wrappers + background image and the heading chars
 *  - Ensures graceful degradation if GSAP plugins or SplitText fail to load
 */
const AnimatedContinuousSections = ({ data }) => {
  // No SplitText instances or fallback arrays needed because we pre-render
  // per-character spans in JSX. Keep lightweight refs for runtime state only.
  const animatingRef = useRef(false);
  const currentIndexRef = useRef(-1);
  const containerRef = useRef(null);

  useEffect(() => {
  const root = containerRef.current || document;
  // capture stable references for cleanup
  const cleanupContainer = root;
    let sections = root.querySelectorAll('section');
    if (!sections || sections.length === 0) {
      console.warn('AnimatedContinuousSections: no sections found in root');
      return;
    }

    const images = root.querySelectorAll('.bg');
    const headings = gsap.utils.toArray(root.querySelectorAll('.section-heading'));
    const outerWrappers = gsap.utils.toArray(root.querySelectorAll('.outer'));
    const innerWrappers = gsap.utils.toArray(root.querySelectorAll('.inner'));

  // variables for cleanup of fallback handlers
  let removeFallbackHandlersForCleanup = null;

  // initial setup: position the outer/inner wrappers off-screen so we can
  // animate them into view when a section becomes active.
  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  const wrap = gsap.utils.wrap(0, sections.length);

  /**
   * getCharsForIndex
   * Query the DOM for per-character elements (`.split-char`) inside the
   * heading at `index`. We render those spans in JSX, so this is a simple
   * and reliable way to obtain the nodes we need to animate.
   * Returns either an array of nodes or null if none were found.
   */
      function getCharsForIndex(index) {
        try {
          // Query the heading node for any .split-char elements (we render them in JSX)
          const nodeList = headings[index] && headings[index].querySelectorAll ? headings[index].querySelectorAll('.split-char') : null;
          if (nodeList && nodeList.length) return Array.from(nodeList);
        } catch (e) {
          // silence failures here; callers handle null
        }
        return null;
      }

      function gotoSection(index, direction) {
        index = wrap(index);
        animatingRef.current = true;
        const fromTop = direction === -1;
        const dFactor = fromTop ? -1 : 1;
        const tl = gsap.timeline({ defaults: { duration: 1.25, ease: 'power1.inOut' }, onComplete: () => (animatingRef.current = false) });

        const currentIndex = currentIndexRef.current;
        if (currentIndex >= 0) {
          gsap.set(sections[currentIndex], { zIndex: 0 });
          tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(sections[currentIndex], { autoAlpha: 0 });
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
        tl.fromTo([outerWrappers[index], innerWrappers[index]], { yPercent: i => (i ? -100 * dFactor : 100 * dFactor) }, { yPercent: 0 }, 0)
          .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

        // Obtain the per-character elements for the heading (if available)
  const charsForIndex = getCharsForIndex(index);

        // Ensure heading elements start hidden for the animation. Use pixel-based y transforms (y) instead of yPercent
        // because per-char transforms are often clearer with explicit pixel offsets.
        try {
          if (charsForIndex && charsForIndex.length) {
            // make sure split-char elements are displayable for transforms
            try {
              charsForIndex.forEach(c => { if (c && c.style) c.style.willChange = 'transform,opacity'; });
            } catch (e) {}
            gsap.set(charsForIndex, { autoAlpha: 0, yPercent: 150 * dFactor });
            // write inline styles as a defensive measure in case external CSS overrides
            try {
              charsForIndex.forEach(c => { if (c && c.style) { c.style.opacity = '0'; c.style.transform = `translateY(${60 * dFactor}px)`; c.style.willChange = 'transform,opacity'; } });
              const cs = charsForIndex[0] && window.getComputedStyle(charsForIndex[0]);
            } catch (e) {}
          } else {
            gsap.set(headings[index], { autoAlpha: 0, y: 30 * dFactor });
          }
        } catch (e) {
          console.warn('AnimatedContinuousSections: failed to set initial heading state', e);
        }

        if (charsForIndex && charsForIndex.length) {
          // match original: animate with yPercent, slightly faster duration, random stagger for scattered reveal
          tl.fromTo(charsForIndex, { autoAlpha: 0, yPercent: 150 * dFactor }, { autoAlpha: 1, yPercent: 0, duration: 1, ease: 'power2', stagger: { each: 0.02, from: 'random' } }, 0.2);
        } else {
          // fallback: animate the whole heading element
          tl.fromTo(headings[index], { autoAlpha: 0, y: 30 * dFactor }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2' }, 0.2);
        }

        currentIndexRef.current = index;
      }

      // Create Observer — prefer GSAP's Observer plugin; otherwise enable
      // a lightweight wheel/touch fallback that navigates sections.
      if (!gsap.plugins || !gsap.plugins.Observer) {
        console.warn('AnimatedContinuousSections: Observer plugin not registered — enabling wheel/touch fallback');

        let touchStartY = 0;
        let lastWheelTime = 0;
        const wheelHandler = (e) => {
          const now = Date.now();
          if (now - lastWheelTime < 600) return; // throttle
          lastWheelTime = now;
          const delta = e.deltaY || e.wheelDelta;
          if (delta > 0) {
            if (!animatingRef.current) gotoSection(currentIndexRef.current + 1, 1);
          } else if (delta < 0) {
            if (!animatingRef.current) gotoSection(currentIndexRef.current - 1, -1);
          }
        };

        const touchStart = (e) => { touchStartY = e.touches ? e.touches[0].clientY : e.clientY; };
        const touchEnd = (e) => {
          const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
          const diff = touchStartY - y;
          if (Math.abs(diff) < 30) return;
          if (diff > 0) {
            if (!animatingRef.current) gotoSection(currentIndexRef.current + 1, 1);
          } else {
            if (!animatingRef.current) gotoSection(currentIndexRef.current - 1, -1);
          }
        };

        const attachEl = containerRef.current || document;
        attachEl.addEventListener('wheel', wheelHandler, { passive: true });
        attachEl.addEventListener('touchstart', touchStart, { passive: true });
        attachEl.addEventListener('touchend', touchEnd, { passive: true });

        const removeFallbackHandlers = () => {
          attachEl.removeEventListener('wheel', wheelHandler);
          attachEl.removeEventListener('touchstart', touchStart);
          attachEl.removeEventListener('touchend', touchEnd);
        };
        removeFallbackHandlersForCleanup = removeFallbackHandlers;
      } else {
        Observer.create({
          type: 'wheel,touch,pointer',
          wheelSpeed: -1,
          onDown: () => { if (!animatingRef.current) gotoSection(currentIndexRef.current - 1, -1); },
          onUp: () => { if (!animatingRef.current) gotoSection(currentIndexRef.current + 1, 1); },
          tolerance: 10,
          preventDefault: true
        });
      }

      gotoSection(0, 1);

    // cleanup: remove any attached fallback handlers
    return () => {
      try {
        if (typeof removeFallbackHandlersForCleanup === 'function') {
          removeFallbackHandlersForCleanup();
        }
      } catch (e) {
        // ignore
      }
    };
  }, [data]);

  return (
    <div ref={containerRef} className={styles.root}>
      <header>
        <div>Animated Sections</div>
        <div><a href="https://codepen.io/BrianCross/pen/PoWapLP">Original Inspiration</a></div>
      </header>
      {data.sections.map((s, i) => (
        <section key={i} className={s.className}>
          <div className="outer">
            <div className="inner">
              <div className="bg" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url(${s.image})`, backgroundPosition: s.backgroundPosition || 'center' }}>
                <h2 className="section-heading">
                  <span className="clip-text">
                    {Array.from(String(s.heading)).map((ch, ci) => (
                      <span className="split-char" key={ci}>{ch === ' ' ? '\u00A0' : ch}</span>
                    ))}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default AnimatedContinuousSections;
