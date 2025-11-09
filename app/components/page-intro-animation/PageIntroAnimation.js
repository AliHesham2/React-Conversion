"use client";

import React, { useEffect, useRef } from 'react';
import styles from './PageIntroAnimation.module.css';

export default function PageIntroAnimation() {
  const introRef = useRef(null);
  const titleRef = useRef(null);
  const leftBgRef = useRef(null);
  const rightBgRef = useRef(null);
  const headerLogoRef = useRef(null);
  const headerNavRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    let master = null;
    const run = async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule;
        const animationOptions = { ease: 'expo.inOut' };

        const introAnimation = () => {
          const tl = gsap.timeline({ defaults: { ease: animationOptions.ease, duration: 1 } });

          // use refs (elements may be null if not mounted yet)
          const titleEl = titleRef.current;
          const leftEl = leftBgRef.current;
          const rightEl = rightBgRef.current;
          const introEl = introRef.current;

          tl.to(titleEl, { duration: 1.5, y: 0, autoAlpha: 1, delay: 0.5 })
            .to([leftEl, rightEl], { scaleX: 1 })
            .to([leftEl, rightEl], { scaleY: 0, transformOrigin: 'top center' })
            .to(titleEl, { duration: 1.5, y: -60, autoAlpha: 0 }, '-=0.6')
            .to(introEl, { y: '-100%' }, '-=0.5');

          return tl;
        };

        const skewInElements = (elements) => {
          const tl = gsap.timeline();
          tl.from(elements, { duration: 1, ease: animationOptions.ease, skewY: -5, autoAlpha: 0, y: 40 });
          return tl;
        };

        const fadeInElements = (elements) => {
          const tl = gsap.timeline();
          tl.from(elements, { duration: 1, ease: animationOptions.ease, y: '20px', autoAlpha: 0, stagger: 0.1 });
          return tl;
        };

        master = gsap.timeline({ paused: false, delay: 0.2 });
        // prepare elements arrays for fadeIn and skewIn
        const headerLogoEl = headerLogoRef.current;
        const headerNavAnchors = headerNavRef.current ? Array.from(headerNavRef.current.querySelectorAll('a')) : [];
        const fadeEls = [headerLogoEl, ...headerNavAnchors].filter(Boolean);
        const skewEls = [heroH1Ref.current, heroImgRef.current].filter(Boolean);

        master.add(introAnimation()).add(fadeInElements(fadeEls)).add(skewInElements(skewEls), '-=1');
      } catch (e) {
        console.warn('GSAP failed to load', e);
      }
    };

    run();

    return () => {
      try {
        if (master && typeof master.kill === 'function') master.kill();
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return (
    <>
      <section ref={introRef} className={styles.intro}>
        <h2 ref={titleRef} className={`${styles['intro__title']} ${styles.hidden}`}>Not everything is black and white</h2>
        <div ref={leftBgRef} className={`${styles['intro__background']} ${styles['intro__background--left']}`}></div>
        <div ref={rightBgRef} className={`${styles['intro__background']} ${styles['intro__background--right']}`}></div>
      </section>

      <header className={styles.header}>
        <div ref={headerLogoRef} className={styles['header__logo']}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <nav ref={headerNavRef} className={styles['header__nav']}>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <div className={styles.heroWrap}>
        <section className={styles.hero}>
          <div className={`${styles.hero__col} ${styles['hero__col--1']}`}>
            <h1 ref={heroH1Ref}>Bon</h1>
          </div>
          <div className={`${styles.hero__col} ${styles['hero__col--2']}`}>
            <img ref={heroImgRef} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/2479807/hero-13.jpg" alt="" />
          </div>
          <div className={`${styles.hero__col} ${styles['hero__col--3']}`}></div>
        </section>
      </div>
    </>
  );
}
