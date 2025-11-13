"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './ReactSliderWithButtonWaveEffect.module.css';

const H1_TEXTS = ['Pear', 'Apple', 'Exotic'];
const LOGO_COLORS = ['var(--pear-logo)', 'var(--apple-logo)', 'var(--exotic-logo)'];
const KEYFRAMES = ['wave-pear-effect', 'wave-apple-effect', 'wave-exotic-effect'];

export default function ReactSliderWithButtonWaveEffect() {
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const caneLabelsRef = useRef(null);
  const caneImageRef = useRef(null);
  const sectionContainerRef = useRef(null);
  const h1Ref = useRef(null);
  const logoRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      const fruitImages = sectionContainerRef.current?.querySelectorAll('.fruit-image') || [];
      const fruitImgs = sectionContainerRef.current?.querySelectorAll('.fruit-image img') || [];
      if (fruitImages.length) gsap.from(fruitImages, { y: '-100vh', delay: 0.5 });
      if (fruitImgs.length) {
        gsap.to(fruitImgs, {
          x: 'random(-20, 20)',
          y: 'random(-20, 20)',
          zIndex: 22,
          duration: 2,
          ease: 'none',
          yoyo: true,
          repeat: -1,
        });
      }
    } catch (e) {
      console.warn('GSAP init failed', e);
    }
    // initialize UI state
    if (prevButtonRef.current) prevButtonRef.current.style.display = 'none';
    if (nextButtonRef.current) {
      nextButtonRef.current.style.color = LOGO_COLORS[1] || LOGO_COLORS[0];
      // toggle the scoped animation class instead of raw animationName
      nextButtonRef.current.classList.add(styles.wave, styles.waveApple);
    }
    if (h1Ref.current) h1Ref.current.textContent = H1_TEXTS[0];
    if (logoRef.current) logoRef.current.style.color = LOGO_COLORS[0];
    // center the labels strip so the first label (section 1) shows by default
    if (caneLabelsRef.current && caneImageRef.current) {
      // match the original export behaviour: control the labels using `left` in percent (0, -100, -200)
      caneLabelsRef.current.style.left = '0%';
      caneLabelsRef.current.style.transition = 'left 0.5s ease-in-out';
      console.log('[fruity] caneLabels initialized (left-percent mode):', caneLabelsRef.current, 'wrapperWidth:', caneImageRef.current.clientWidth);
    } else {
      console.warn('[fruity] caneLabelsRef or caneImageRef not found on mount');
    }
  }, []);
  

  const handleNext = () => {
    if (currentIndex >= H1_TEXTS.length - 1) return;
    const newIndex = currentIndex + 1;
    const newPosition = -100 * newIndex;
    if (caneLabelsRef.current) {
      caneLabelsRef.current.style.left = `${newPosition}%`;
      console.log(`[fruity] handleNext -> index=${newIndex} pos=${newPosition}%`);
    } else {
      console.warn('[fruity] caneLabelsRef missing in handleNext');
    }
    if (sectionContainerRef.current) sectionContainerRef.current.style.left = `${newPosition}%`;
    if (h1Ref.current) h1Ref.current.textContent = H1_TEXTS[newIndex];
    try {
      gsap.to(logoRef.current, { opacity: 1, duration: 1, color: LOGO_COLORS[newIndex] });
      gsap.from(h1Ref.current, { y: '20%', opacity: 0, duration: 0.5 });
      const fruitImages = sectionContainerRef.current?.querySelectorAll('.fruit-image') || [];
      if (fruitImages.length) gsap.from(fruitImages, { y: '-100vh', delay: 0.4, duration: 0.4 });
    } catch (e) {
      console.warn('GSAP animation error', e);
    }
    // show/hide buttons
    if (newIndex === H1_TEXTS.length - 1 && nextButtonRef.current) nextButtonRef.current.style.display = 'none';
    if (newIndex > 0 && prevButtonRef.current) prevButtonRef.current.style.display = 'block';

    // update colors
    if (nextButtonRef.current)
      nextButtonRef.current.style.color = LOGO_COLORS[newIndex + 1] || LOGO_COLORS[H1_TEXTS.length - 1];
    if (prevButtonRef.current) prevButtonRef.current.style.color = LOGO_COLORS[newIndex - 1] || LOGO_COLORS[0];

    // update scoped animation classes (remove previous, add new)
    if (nextButtonRef.current) {
      nextButtonRef.current.classList.remove(styles.wavePear, styles.waveApple, styles.waveExotic);
      const cls = newIndex + 1 >= KEYFRAMES.length ? styles.waveExotic : (newIndex + 1 === 1 ? styles.waveApple : styles.wavePear);
      nextButtonRef.current.classList.add(cls);
    }
    if (prevButtonRef.current) {
      prevButtonRef.current.classList.remove(styles.wavePear, styles.waveApple, styles.waveExotic);
      const cls = newIndex - 1 < 0 ? styles.wavePear : (newIndex - 1 === 1 ? styles.waveApple : styles.wavePear);
      prevButtonRef.current.classList.add(cls);
    }
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    const newPosition = -100 * newIndex;
    if (caneLabelsRef.current) {
      caneLabelsRef.current.style.left = `${newPosition}%`;
      console.log(`[fruity] handlePrev -> index=${newIndex} pos=${newPosition}%`);
    } else {
      console.warn('[fruity] caneLabelsRef missing in handlePrev');
    }
    if (sectionContainerRef.current) {
      sectionContainerRef.current.style.left = `${newPosition}%`;
      sectionContainerRef.current.style.transition = 'all 0.5s ease-in-out';
    }
    if (h1Ref.current) h1Ref.current.textContent = H1_TEXTS[newIndex];
    try {
      gsap.to(logoRef.current, { color: LOGO_COLORS[newIndex], duration: 1 });
      gsap.from(h1Ref.current, { y: '20%', opacity: 0, duration: 0.5 });
      const fruitImages = sectionContainerRef.current?.querySelectorAll('.fruit-image') || [];
      if (fruitImages.length) gsap.from(fruitImages, { y: '100vh', delay: 0.5 });
    } catch (e) {
      console.warn('GSAP animation error', e);
    }
    if (nextButtonRef.current) nextButtonRef.current.style.display = 'block';
    if (newIndex === 0 && prevButtonRef.current) prevButtonRef.current.style.display = 'none';
    if (nextButtonRef.current)
      nextButtonRef.current.style.color = LOGO_COLORS[newIndex + 1] || LOGO_COLORS[H1_TEXTS.length - 1];
    if (prevButtonRef.current) prevButtonRef.current.style.color = LOGO_COLORS[newIndex - 1] || LOGO_COLORS[0];

    // update animation classes on buttons
    if (nextButtonRef.current) {
      nextButtonRef.current.classList.remove(styles.wavePear, styles.waveApple, styles.waveExotic);
      const cls = newIndex + 1 >= KEYFRAMES.length ? styles.waveExotic : (newIndex + 1 === 1 ? styles.waveApple : styles.wavePear);
      nextButtonRef.current.classList.add(cls);
    }
    if (prevButtonRef.current) {
      prevButtonRef.current.classList.remove(styles.wavePear, styles.waveApple, styles.waveExotic);
      const cls = newIndex - 1 < 0 ? styles.wavePear : (newIndex - 1 === 1 ? styles.waveApple : styles.wavePear);
      prevButtonRef.current.classList.add(cls);
    }
    setCurrentIndex(newIndex);
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2 className={`logo ${styles.logo}`} ref={logoRef}>
          Fruity
        </h2>
      </header>

      <div>
        <button id="prevButton" className={`wave ${styles.wave} ${styles.prevButton} ${styles.buttonBase}`} ref={prevButtonRef} onClick={handlePrev}>
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button id="nextButton" className={`wave ${styles.wave} ${styles.buttonBase}`} ref={nextButtonRef} onClick={handleNext}>
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>

        <div className={`text ${styles.text}`}>
        <h1 className={`h1 ${styles.h1}`} ref={h1Ref}>
          Pear
        </h1>
        <div className={`cane-image ${styles.caneImage}`} ref={caneImageRef}>
          <img src="/fruity/cane.svg" alt="cane" />
          <div className={`cane-labels-wrap ${styles.caneLabelsWrap}`} ref={caneLabelsRef} style={{ left: '0%' }}>
            <img src="/fruity/Labels.jpg" alt="labels" className={`cane-labels-img ${styles.caneLabelsImg}`} />
          </div>
        </div>
      </div>

      <div className={`section-container-main ${styles.sectionContainerMain}`}>
        <div className={`section-container ${styles.sectionContainer}`} ref={sectionContainerRef}>

          <section className={`section ${styles.section}`} id="section1">
            <div className={`fruit-images ${styles.fruitImages}`}>
              <div className={`image-one fruit-image ${styles.fruitImage} ${styles.imageOne}`}>
                <img src="https://www.yudiz.com/codepen/fruity/pear-one.png" alt="pear-image" />
              </div>
              <div className={`image-two fruit-image ${styles.fruitImage} ${styles.imageTwo}`}>
                <img src="https://www.yudiz.com/codepen/fruity/pear-two.png" alt="pear-image" />
              </div>
              <div className={`image-three fruit-image ${styles.fruitImage} ${styles.imageThree}`}>
                <img src="https://www.yudiz.com/codepen/fruity/pear-three.png" alt="pear-image" />
              </div>
              <div className={`image-four fruit-image ${styles.fruitImage} ${styles.imageFour}`}>
                <img src="https://www.yudiz.com/codepen/fruity/pear-four.png" alt="pear-image" />
              </div>
            </div>
          </section>

          <section className={`section ${styles.section}`} id="section2">
            <div className={`fruit-images ${styles.fruitImages}`}>
              <div className={`image-one fruit-image ${styles.fruitImage} ${styles.imageOne}`}>
                <img src="https://www.yudiz.com/codepen/fruity/apple-one.png" alt="apple-image" />
              </div>
              <div className={`image-two fruit-image ${styles.fruitImage} ${styles.imageTwo}`}>
                <img src="https://www.yudiz.com/codepen/fruity/apple-two.png" alt="apple-image" />
              </div>
              <div className={`image-three fruit-image ${styles.fruitImage} ${styles.imageThree}`}>
                <img src="https://www.yudiz.com/codepen/fruity/apple-three.png" alt="apple-image" />
              </div>
              <div className={`image-four fruit-image ${styles.fruitImage} ${styles.imageFour}`}>
                <img src="https://www.yudiz.com/codepen/fruity/apple-four.png" alt="apple-image" />
              </div>
            </div>
          </section>

          <section className={`section ${styles.section}`} id="section3">
            <div className={`fruit-images ${styles.fruitImages}`}>
              <div className={`image-one fruit-image ${styles.fruitImage} ${styles.imageOne}`}>
                <img src="https://www.yudiz.com/codepen/fruity/exotic-one.png" alt="exotic-image" />
              </div>
              <div className={`image-two fruit-image ${styles.fruitImage} ${styles.imageTwo}`}>
                <img src="https://www.yudiz.com/codepen/fruity/exotic-two.png" alt="exotic-image" />
              </div>
              <div className={`image-three fruit-image ${styles.fruitImage} ${styles.imageThree}`}>
                <img src="https://www.yudiz.com/codepen/fruity/exotic-three.png" alt="exotic-image" />
              </div>
              <div className={`image-four fruit-image ${styles.fruitImage} ${styles.imageFour}`}>
                <img src="https://www.yudiz.com/codepen/fruity/exotic-four.png" alt="exotic-image" />
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
