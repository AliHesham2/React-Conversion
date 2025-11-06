"use client";

import React, { useEffect, useRef } from 'react';
import styles from './DynamicCarouselSliderWithInfiniteScoll.module.css';

// This component ports the original export's DOM structure and runtime
// behaviour into a React-friendly form. The animation logic (originally
// in script.js) is ported into a useEffect below and operates on refs
// instead of document-level selectors.
export default function DynamicCarouselSliderWithInfiniteScoll({ slides = [] }) {
  const total = slides.length || 1;
  const sliderRef = useRef(null);
  const mainImgRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const counterRef = useRef(null);
  const bgCurrentRef = useRef(null);
  const bgNextRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // ported variables from original script
    const slideTitles = slides.map((s) => s.title || '');
    const slideDescriptions = slides.map((s) => s.description || '');
    const imageUrls = slides.map((s) => s.bg || s.main || '');
    const totalSlides = imageUrls.length || 1;

  let currentSlide = 1;
    let isAnimating = false;
    let scrollAllowed = true;
    let lastScrollTime = 0;

  // which background layer is currently visible: 0 => bgCurrentRef, 1 => bgNextRef
  let bgActive = 0;

    let gsap;
    let CustomEase;

    const getEl = (root, sel) => root?.querySelector(sel);

    const createSlide = (slideNumber, direction) => {
      const slide = document.createElement('div');
      slide.className = `${styles.slide} slide`;

      const slideBgImg = document.createElement('div');
      slideBgImg.className = `${styles['slide-bg-img']} slide-bg-img`;

      const img = document.createElement('img');
      img.src = imageUrls[slideNumber - 1];
      img.alt = slideDescriptions[slideNumber - 1] || '';

      slideBgImg.appendChild(img);
      slide.appendChild(slideBgImg);

      if (direction === 'down') {
        slideBgImg.style.clipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
      } else {
        slideBgImg.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
      }
      return slide;
    };

    const createMainImageWrapper = (slideNumber, direction) => {
      const wrapper = document.createElement('div');
      wrapper.className = `${styles['slide-main-img-wrapper']} slide-main-img-wrapper`;

      const img = document.createElement('img');
      img.src = imageUrls[slideNumber - 1];
      img.alt = slideDescriptions[slideNumber - 1] || '';

      wrapper.appendChild(img);

      if (direction === 'down') {
        wrapper.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
      } else {
        wrapper.style.clipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
      }
      return wrapper;
    };

    const createTextElements = (slideNumber, direction) => {
      const newTitle = document.createElement('h1');
      newTitle.textContent = slideTitles[slideNumber - 1] || '';
      // will be animated with gsap set later

      const newDesc = document.createElement('p');
      newDesc.textContent = slideDescriptions[slideNumber - 1] || '';

      const newCounter = document.createElement('p');
      newCounter.textContent = String(slideNumber);

      return { newTitle, newDesc, newCounter };
    };

    const preloadImage = (src) => new Promise((resolve) => {
      if (!src) return resolve();
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });

    const animateSlide = async (direction) => {
      if (isAnimating || !scrollAllowed || !gsap) return;

      isAnimating = true;
      scrollAllowed = false;

      const slider = sliderRef.current;
      const currentSlideElement = getEl(slider, '.slide');
      const mainImageContainer = mainImgRef.current;
      const currentMainWrapper = getEl(mainImageContainer, '.slide-main-img-wrapper');

      const titleContainer = titleRef.current;
      const descContainer = descRef.current;
      const counterContainer = counterRef.current;

      const currentTitle = getEl(titleContainer, 'h1');
      const currentDesc = getEl(descContainer, 'p');
      const currentCounter = getEl(counterContainer, 'p');

      if (direction === 'down') {
        currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
      } else {
        currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
      }


      const newSlide = createSlide(currentSlide, direction);
      const newMainWrapper = createMainImageWrapper(currentSlide, direction);
      const { newTitle, newDesc, newCounter } = createTextElements(currentSlide, direction);

      // Set inline initial transforms BEFORE appending to avoid a paint flash
      try {
        const newImg = newMainWrapper.querySelector('img');
        if (newImg) newImg.style.transform = `translateY(${direction === 'down' ? '-50%' : '50%'})`;

        // position text offscreen matching original starting positions
        if (newTitle) newTitle.style.transform = `translateY(${direction === 'down' ? '50px' : '-50px'})`;
        if (newDesc) newDesc.style.transform = `translateY(${direction === 'down' ? '20px' : '-20px'})`;
        if (newCounter) newCounter.style.transform = `translateY(${direction === 'down' ? '18px' : '-18px'})`;
      } catch (e) {}


      // prepare the next background layer (double-buffer) to avoid flicker
      const currentBg = bgActive === 0 ? bgCurrentRef.current : bgNextRef.current;
      const nextBg = bgActive === 0 ? bgNextRef.current : bgCurrentRef.current;
      try {
        if (nextBg) {
          nextBg.style.transition = 'none';
          nextBg.style.opacity = '0';
          nextBg.style.backgroundImage = `url(${imageUrls[currentSlide - 1]})`;
          // set clipPath initial matching createSlide direction so reveal matches
          nextBg.style.clipPath = direction === 'down'
            ? 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
            : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
          nextBg.style.transform = 'scale(1.03)';
        }
      } catch (e) {}

      // preload next background image to avoid showing unloaded image during animation
      await preloadImage(imageUrls[currentSlide - 1]);

      // append after preload and initial styles are set
      slider.appendChild(newSlide);
      mainImageContainer.appendChild(newMainWrapper);
      titleContainer.appendChild(newTitle);
      descContainer.appendChild(newDesc);
      counterContainer.appendChild(newCounter);

      // use gsap.set to initialize states (more consistent than inline styles)
      try {
        gsap.set(newMainWrapper.querySelector('img'), { y: direction === 'down' ? '-50%' : '50%' });
        gsap.set(newTitle, { y: direction === 'down' ? 50 : -50 });
        gsap.set(newDesc, { y: direction === 'down' ? 20 : -20 });
        gsap.set(newCounter, { y: direction === 'down' ? 18 : -18 });
        if (nextBg) gsap.set(nextBg, { opacity: 0, scale: 1.03, clipPath: nextBg.style.clipPath });
      } catch (e) {}

      const tl = gsap.timeline({
        onComplete: () => {
          [
            currentSlideElement,
            currentMainWrapper,
            currentTitle,
            currentDesc,
            currentCounter
          ].forEach((el) => el?.remove());

          isAnimating = false;

          setTimeout(() => {
            scrollAllowed = true;
            lastScrollTime = Date.now();
          }, 100);
        }
      });

      const ease = (CustomEase && CustomEase.create) ? CustomEase.create('', '.87, 0, .13, 1') : 'power2.out';

      // also animate the next bg layer's clipPath + opacity to mirror original reveal
      tl
        .to(nextBg, { opacity: 1, scale: 1, clipPath: direction === 'down' ? 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.25, ease }, 0)
        .to(currentBg, { opacity: 0, scale: 1.03, duration: 1.25, ease }, 0)
        .to(newSlide.querySelector('.slide-bg-img'), {
          clipPath: direction === 'down' ? 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.25,
          ease
        }, 0)
        .to(currentSlideElement.querySelector('img'), { scale: 1.5, duration: 1.25, ease }, 0)
        .to(newMainWrapper, {
          clipPath: direction === 'down' ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          duration: 1.25,
          ease
        }, 0)
        .to(currentMainWrapper.querySelector('img'), { y: direction === 'down' ? '50%' : '-50%', duration: 1.25, ease }, 0)
        .to(newMainWrapper.querySelector('img'), { y: 0, duration: 1.25, ease }, 0)
        .to(currentTitle, { y: direction === 'down' ? -50 : 50, duration: 1.25, ease }, 0)
        .to(newTitle, { y: 0, duration: 1.25, ease }, 0)
        .to(currentDesc, { y: direction === 'down' ? -20 : 20, duration: 1.25, ease }, 0)
        .to(newDesc, { y: 0, duration: 1.25, ease }, 0)
        .to(currentCounter, { y: direction === 'down' ? -18 : 18, duration: 1.25, ease }, 0)
        .to(newCounter, { y: 0, duration: 1.25, ease }, 0);

      // after animation completes, swap which bg layer is active
      tl.add(() => {
        try {
          bgActive = 1 - bgActive;
          // ensure the inactive layer is reset for the next cycle
          const inactive = bgActive === 0 ? bgNextRef.current : bgCurrentRef.current;
          if (inactive) {
            inactive.style.transition = 'none';
            inactive.style.opacity = '0';
            inactive.style.transform = 'scale(1.03)';
          }
        } catch (e) {}
      }, '+=0');
    };

    const handleScroll = (direction) => {
      const now = Date.now();
      if (isAnimating || !scrollAllowed) return;
      if (now - lastScrollTime < 1000) return;
      lastScrollTime = now;
      animateSlide(direction);
    };

    let touchStartY = 0;
    let isTouchActive = false;

    const onWheel = (e) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleScroll(direction);
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      isTouchActive = true;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      if (!isTouchActive || isAnimating || !scrollAllowed) return;
      const touchCurrentY = e.touches[0].clientY;
      const difference = touchStartY - touchCurrentY;
      if (Math.abs(difference) > 10) {
        isTouchActive = false;
        const direction = difference > 0 ? 'down' : 'up';
        handleScroll(direction);
      }
    };

    const onTouchEnd = () => { isTouchActive = false; };

    // load gsap and plugins dynamically
    (async () => {
      try {
        const gsapModule = await import('gsap');
        gsap = gsapModule.gsap || gsapModule.default || gsapModule;
        try {
          const ce = await import('gsap/CustomEase');
          CustomEase = ce.CustomEase || ce.default || ce;
          if (gsap && CustomEase && gsap.registerPlugin) gsap.registerPlugin(CustomEase);
        } catch (e) {
          // plugin optional fallback
          CustomEase = null;
        }

        // attach listeners
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: false });
      } catch (err) {
        // if gsap fails, we won't enable animations but component still renders
        // console.error('GSAP load failed', err);
      }
    })();

    return () => {
      try { window.removeEventListener('wheel', onWheel); } catch (e) {}
      try { window.removeEventListener('touchstart', onTouchStart); } catch (e) {}
      try { window.removeEventListener('touchmove', onTouchMove); } catch (e) {}
      try { window.removeEventListener('touchend', onTouchEnd); } catch (e) {}
    };
  }, [slides]);

  // Initial markup: render only the first slide and the containers the script
  // expects. The runtime will append/remove items as the user scrolls.
  const first = slides[0] || {};

  return (
    <section className={styles.slider} ref={sliderRef}>
      {/* double-buffered background layers - current (visible) and next (hidden) */}
      <div ref={bgCurrentRef} className={styles.bgLayer} style={{ backgroundImage: `url(${first.bg || ''})`, opacity: 1, transform: 'scale(1)' }} />
      <div ref={bgNextRef} className={styles.bgLayer} style={{ backgroundImage: `url(${first.bg || ''})`, opacity: 0, transform: 'scale(1.03)' }} />
      <nav className={styles.nav}>
        <div className={styles.logo}><p>haptichash</p></div>
        <div className={styles.navItems}>
          <p>Work</p>
          <p>Studio</p>
          <p>News</p>
          <p>Contact</p>
        </div>
      </nav>

      <footer className={styles.footer}>
        <p>All Projects</p>
        <div className={styles.sliderCounter}>
          <div className={styles.count} ref={counterRef}><p>1</p></div>
          <p>/</p>
          <p>{total}</p>
        </div>
      </footer>

      <div className={`${styles.slide} slide`}>
        <div className={`${styles['slide-bg-img']} slide-bg-img`}>
          <img className={styles.img} src={first.bg || ''} alt={first.alt || ''} />
        </div>
      </div>

      <div className={`${styles['slide-main-img']} slide-main-img`} ref={mainImgRef}>
        <div className={`${styles['slide-main-img-wrapper']} slide-main-img-wrapper`}>
          <img className={styles.img} src={first.main || first.bg || ''} alt={first.alt || ''} />
        </div>
      </div>

      <div className={styles['slide-copy']}>
        <div className={styles['slide-title']} ref={titleRef}>
          <h1>{first.title || ''}</h1>
        </div>
        <div className={styles['slide-description']} ref={descRef}>
          <p>{first.description || ''}</p>
        </div>
      </div>
    </section>
  );
}
