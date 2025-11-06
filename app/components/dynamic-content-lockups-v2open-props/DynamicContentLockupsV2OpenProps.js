/**
 * Converted from export: dynamic-content-lockups-v2open-props
 * Note: the original export contains HTML + CSS only (no separate JS file).
 * The original animation uses CSS Scroll Timeline / keyframes. Because there
 * was no script to port, this component is the HTML/CSS-only conversion.
 *
 * If you want behavior parity across all browsers (or want the scroll-timeline
 * ported to JS/GSAP), tell me and I'll implement the JS pass.
 */
"use client";
import React, { useEffect, useRef } from 'react';
import styles from './DynamicContentLockupsV2OpenProps.module.css';

export default function DynamicContentLockupsV2OpenProps({ items = [] }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const cardWrapperRef = useRef(null);
  const contentWrapperRef = useRef(null);

  useEffect(() => {
  let ctx;
    let tl;
    let st;
    async function setup() {
      const gsapModule = await import('gsap');
      const ScrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule;
      const ScrollTrigger = ScrollTriggerModule.ScrollTrigger || ScrollTriggerModule.default || ScrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const sectionEl = sectionRef.current;
      const videoEl = videoRef.current?.querySelector('video');
      const cards = cardWrapperRef.current ? Array.from(cardWrapperRef.current.querySelectorAll('[data-card-index]')) : [];

      // Add debug classes (module-scoped) so the debug CSS we injected becomes active.
      try {
        if (sectionRef.current) sectionRef.current.classList.add(styles['debug-highlight']);
        // also add a one-time overlay class to force the component into view
        sectionRef.current.classList.add(styles['debug-overlay']);
        if (videoRef.current) videoRef.current.classList.add(styles['debug-highlight']);
        if (contentWrapperRef.current) contentWrapperRef.current.classList.add(styles['debug-highlight']);
        if (cardWrapperRef.current) cardWrapperRef.current.classList.add(styles['debug-highlight']);
      } catch (e) {
        // ignore
      }

      // ALSO add inline visible outlines and log bounding boxes so we can see
      // immediately in the browser console what's present and where.
      try {
        const logEl = (el, name) => {
          if (!el) return console.warn(name + ' = null');
          try {
            const r = el.getBoundingClientRect();
            console.log(name, { rect: r, display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility, opacity: getComputedStyle(el).opacity });
            el.style.outline = '3px dashed rgba(255,0,0,0.6)';
            el.style.background = 'rgba(255,255,255,0.02)';
          } catch (err) {
            console.warn('logEl failed for', name, err);
          }
        };

        logEl(sectionRef.current, 'sectionEl');
        logEl(videoRef.current, 'videoWrapper');
        logEl(contentWrapperRef.current, 'contentWrapper');
        logEl(cardWrapperRef.current, 'cardWrapper');
        cards.forEach((c, i) => logEl(c, `card[${i}]`));
      } catch (e) {
        console.warn('debug outline failed', e);
      }

      // set sensible initial states
      gsap.set(cards, { y: 0 });

      // compute pixel distances using section height so translations map to keyframe percentages
      const sectionH = sectionEl ? sectionEl.offsetHeight || window.innerHeight : window.innerHeight;
      const up50 = -Math.round(sectionH * 0.5); // approximate -50cqb
      const up100 = -Math.round(sectionH * 1.0); // approximate -100cqi

      // Create a pinned, scrubbed timeline so the animation mirrors the CSS scroll-timeline behavior
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${Math.max(sectionH * 2, 1000)}`,
          scrub: true,
          // Disable pin while tuning — pinning can cause the section to occupy the
          // viewport and hide other content if styles don't match exactly. We can
          // re-enable pin once animation values are tuned.
          pin: false
        }
      });

      // replicate the original CSS keyframe timing roughly (50%, 90%, 100%) by placing tweens
      if (videoEl) {
        tl.to(videoEl, { filter: 'hue-rotate(150deg)', duration: 0.25, ease: 'none' }, 0.25);
        tl.to(videoEl, { filter: 'hue-rotate(300deg)', duration: 0.2, ease: 'none' }, 0.45);
        tl.to(videoEl, { filter: 'hue-rotate(4deg)', duration: 0.15, ease: 'none' }, 0.6);
      }

      // Apply per-card sequences using positions that map to the original keyframes
      cards.forEach((card, i) => {
        const staggerBase = i * 0.12; // small offset between cards

        // visible/enter (up to ~50%)
        tl.to(card, { y: 0, opacity: 1, scale: i === 0 ? 1 : 1, duration: 0.01, ease: 'none' }, staggerBase + 0.0);

        // mid progress (around 90% -> -50cqb in original keyframes)
        tl.to(card, { y: up50, scale: 0.6, opacity: i === 0 ? 1 : 0.5, duration: 0.35, ease: 'power1.out' }, staggerBase + 0.5);

        // exit (100% -> -100cqi)
        tl.to(card, { y: up100, opacity: 0, duration: 0.4, ease: 'power1.in' }, staggerBase + 0.9);
      });

      ctx = gsap.context(() => {}, sectionEl);
    }

    setup();

    return () => {
      try {
        if (tl && tl.scrollTrigger) tl.scrollTrigger.kill();
        if (tl) tl.kill();
        if (st) st.kill && st.kill();
        if (ctx) ctx.revert && ctx.revert();
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  return (
    <div className={styles.root}>
      {/* DEBUG BANNER: visible indicator that component mounted */}
      <div style={{position: 'fixed', top: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 10px', borderRadius: 6, zIndex: 9999}}>COMPONENT MOUNTED</div>
      <nav className={styles.navbar}>
        <a className={styles['nav-cta-btn']} href="#">Get Started</a>
      </nav>

      <div className={styles.section} ref={sectionRef}>
        <div className={styles['video-visual']} ref={videoRef}>
          <video
            className={styles.video}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/bg-gradient-animation.mp4"
              type="video/mp4"
            />
          </video>
        </div>

          <div className={styles['section-wrapper']}>
          <div className={styles['content-wrapper']} ref={contentWrapperRef}>
            {items.map((it, idx) => (
              <div key={idx} className={`${styles.content} ${styles[`content-${idx + 1}`]}`}>
                <div className={styles['mobile-visual']}>
                  <img className={styles['card-img']} src={it.img} alt={it.alt} />
                </div>
                <div className={styles.meta}>
                  <h2 className={styles.headline} dangerouslySetInnerHTML={{ __html: it.headline }} />
                  <p className={styles.desc}>{it.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.visual}>
            <div className={styles['card-wrapper']} ref={cardWrapperRef}>
              {items.map((it, idx) => (
                <div key={idx} data-card-index={idx} className={`${styles.card} ${styles[`card-${idx + 1}`]}`}>
                  <img className={styles['card-img']} src={it.img} alt={it.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
