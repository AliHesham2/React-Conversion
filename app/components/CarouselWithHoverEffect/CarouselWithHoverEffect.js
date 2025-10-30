"use client";

import React, { useState } from 'react';
import styles from './CarouselWithHoverEffect.module.css';
import slides from '../../data/carouselWithHoverEffectData';

export default function CarouselWithHoverEffect() {
  const [mainIndex, setMainIndex] = useState(1); // match export where second item is main
  const len = slides.length;

  function handleNext() {
    setMainIndex((i) => (i + 1) % len);
  }

  function handlePrev() {
    setMainIndex((i) => (i - 1 + len) % len);
  }

  return (
    <div className={styles.carousel}>
      {slides.map((s, idx) => {
        const leftIdx = (mainIndex - 1 + len) % len;
        const rightIdx = (mainIndex + 1) % len;
        const base = styles['carousel__item'];
        const classes = [base];
        if (idx === mainIndex) classes.push(styles['carousel__item--main']);
        else if (idx === leftIdx) classes.push(styles['carousel__item--left']);
        else if (idx === rightIdx) classes.push(styles['carousel__item--right']);

        return (
          <div key={idx} className={classes.join(' ')} style={{ left: '50%', top: '50%' }}>
            <img src={s.img} alt={s.title} />
            <div className={styles['carousel__text']}>
              <h3>{s.title}</h3>
              <p>{s.subtitle}</p>
            </div>
          </div>
        );
      })}

      <div className={styles['carousel__btns']} style={{ left: '50%' }}>
        <button className={styles['carousel__btn']} id="leftBtn" onClick={handlePrev} aria-label="previous">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z"/></svg>
        </button>
        <button className={styles['carousel__btn']} id="rightBtn" onClick={handleNext} aria-label="next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z"/></svg>
        </button>
      </div>
    </div>
  );
}
