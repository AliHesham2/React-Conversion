"use client";

import React, { useEffect, useRef } from 'react';
import styles from './ScrolltriggerImageZoom.module.css';

export default function ScrolltriggerImageZoom() {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const sectionRef = useRef(null);

  // click-to-play handler for when native scroll is unavailable
  const handlePlay = async () => {
    try {
      const gsapModule = await import('gsap');
      const gsap = gsapModule && (gsapModule.default || gsapModule);
      if (!gsap) throw new Error('gsap not available');

      const imgEl = imgRef.current;
      const secEl = sectionRef.current;
      if (!imgEl && !secEl) return;

      // kill any existing tweens on these targets
      try { gsap.killTweensOf([imgEl, secEl]); } catch (e) {}

      const playTl = gsap.timeline();
      playTl.to(imgEl, {
        scale: 2,
        z: 350,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
        duration: 1.2
      }).to(
        secEl,
        {
          scale: 1.1,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
          duration: 1.2
        },
        '<'
      );
    } catch (err) {
      console.error('Play animation failed', err);
    }
  };

  useEffect(() => {
    let tl;
    async function init() {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule && (gsapModule.default || gsapModule);
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const ScrollTrigger = ScrollTriggerModule && (ScrollTriggerModule.ScrollTrigger || ScrollTriggerModule.default || ScrollTriggerModule);

        if (!gsap || !ScrollTrigger) throw new Error('gsap or ScrollTrigger not found after import');

        gsap.registerPlugin(ScrollTrigger);

        // Wait for the image to load to ensure correct measurements for pin/end
        const imgEl = imgRef.current;
        if (imgEl && !imgEl.complete) {
          await new Promise((resolve) => {
            imgEl.addEventListener('load', resolve, { once: true });
            imgEl.addEventListener('error', resolve, { once: true });
          });
        }

        // build timeline after image is ready
        tl = gsap.timeline({
          scrollTrigger: {
            scroller: window,
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            markers: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              // helpful debug info
              // console.log('ScrollTrigger refreshed', self);
            }
          }
        });

        tl.to(imgRef.current, {
          scale: 2,
          z: 350,
          transformOrigin: 'center center',
          ease: 'power1.inOut'
        }).to(
          sectionRef.current,
          {
            scale: 1.1,
            transformOrigin: 'center center',
            ease: 'power1.inOut'
          },
          '<'
        );

        // refresh ScrollTrigger after timeline is set up
        ScrollTrigger.refresh();

        // Defensive fix: ensure the document can scroll. Some converted demos
        // set a parent viewport to position:fixed and overflow:hidden which can
        // prevent mouse-wheel scrolling. Revert obvious full-viewport inline
        // fixed elements and ensure body/html allow vertical scrolling.
        try {
          document.documentElement.style.overflowY = document.documentElement.style.overflowY || 'auto';
          document.body.style.overflowY = document.body.style.overflowY || 'auto';

          const candidates = Array.from(document.body.children).filter(el => {
            const s = el.style;
            if (!s) return false;
            return (s.position === 'fixed' || s.position === 'sticky') &&
              (el.getBoundingClientRect().height >= window.innerHeight - 2) &&
              (el.getBoundingClientRect().width >= window.innerWidth - 2);
          });

          if (candidates.length) {
            console.info('ScrolltriggerImageZoom: reverting inline fixed-position candidates', candidates.length);
            candidates.forEach(el => {
              el.style.position = '';
              el.style.top = '';
              el.style.left = '';
              el.style.right = '';
              el.style.bottom = '';
              el.style.overflow = '';
            });
          }
        } catch (e) {
          // non-fatal
        }

 
      } catch (err) {
        console.error('Failed to initialize ScrolltriggerImageZoom', err);
      }
    }

    init();

    return () => {
      try {
        if (tl) tl.kill();
        if (window.ScrollTrigger && window.ScrollTrigger.getAll) {
          window.ScrollTrigger.getAll().forEach(t => t.kill());
        }
        if (window.gsap) {
          window.gsap.killTweensOf('*');
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.wrapper} ref={wrapperRef}>
        <div className={styles.content}>
          <section className={`${styles.section} ${styles.hero}`} ref={sectionRef} />
        </div>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            ref={imgRef}
            src="https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp"
            alt="image"
          />
        </div>
      </div>
      <button className={styles.playButton} onClick={handlePlay} aria-label="Play demo">Play animation</button>
    </div>
  );
}
