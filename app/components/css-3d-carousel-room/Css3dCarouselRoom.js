"use client";

import React, { useEffect, useRef } from 'react';
import styles from './Css3dCarouselRoom.module.css';

// HTML conversion ported from exports/css-3d-carousel-room/dist/index.html
// Ported behavior from exports/css-3d-carousel-room/dist/script.js is
// implemented inside a useEffect below. The logic maps horizontal mouse
// position to translateX values for the three carousel containers.
export default function Css3dCarouselRoom() {
  const wrapperRef = useRef(null);
  const debugRef = useRef(null);

  useEffect(() => {
    // Ported constants from original script
    const padding = 200;
    const slidesCount = 3 - 1;

    function map(x, in_min, in_max, out_min, out_max) {
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    function onMouseMove(e) {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();

      // Mouse position clamped between padding and (width - padding)
      const mouseX = Math.min(Math.max(e.clientX - padding, 0), rect.width - padding * 2);
      const rawPercent = map(mouseX, 0, rect.width - padding * 2, 100 - 100 * slidesCount, 100);
      const percent = Math.round(rawPercent);

      // Scope selectors to wrapper so we don't touch global document
      const left = wrapper.querySelector('#left');
      const center = wrapper.querySelector('#center');
      const right = wrapper.querySelector('#right');

      if (left) left.style.transform = `translateX(${percent}%)`;
      if (center) center.style.transform = `translateX(${percent - 100}%)`;
      if (right) right.style.transform = `translateX(${percent - 200}%)`;

      // debug paragraph
      if (debugRef.current) debugRef.current.innerHTML = String(percent);
    }

    // Attach listener to window so movement still tracked when pointer over other elements
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className={styles.wrapper} id="wrapper" ref={wrapperRef}>
      <div className={styles.wrapper3d}>
        <div className={`${styles.carouselWrapper} ${styles.center3d}`}>
          <div className={styles.carouselContainer} id="center">
            <div className={`${styles.slide} ${styles.first}`} />
            <div className={`${styles.slide} ${styles.second}`} />
            <div className={`${styles.slide} ${styles.third}`} />
          </div>
          <div className={`${styles.first} ${styles.image}`} id="img" />
        </div>

        <div className={`${styles.carouselWrapper} ${styles.left3d} ${styles.center3d}`}>
          <div className={styles.carouselContainer} id="left">
            <div className={`${styles.slide} ${styles.first}`} />
            <div className={`${styles.slide} ${styles.second}`} />
            <div className={`${styles.slide} ${styles.third}`} />
          </div>
        </div>

        <div className={`${styles.carouselWrapper} ${styles.right3d} ${styles.center3d}`}>
          <div className={styles.carouselContainer} id="right">
            <div className={`${styles.slide} ${styles.first}`} />
            <div className={`${styles.slide} ${styles.second}`} />
            <div className={`${styles.slide} ${styles.third}`} />
          </div>
        </div>
      </div>

      <p className={`${styles.debug} ${styles.debugTop}`} id="t" ref={debugRef}>0</p>
      <p className={`${styles.debug} ${styles.debugBot}`}>
        <br />
        Move your mouse horizontally
      </p>
    </div>
  );
}
