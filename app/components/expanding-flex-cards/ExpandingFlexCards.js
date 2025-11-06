"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './ExpandingFlexCards.module.css';

// React port of the original export's tiny script:
// - Clicking an option removes .active from others and adds it to the clicked one.
// - We implement that behavior using React state (activeIndex) and keyboard support.
export default function ExpandingFlexCards({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0); // original had first item active
  const optionsRef = useRef([]);

  useEffect(() => {
    // ensure refs array matches slides
    optionsRef.current = optionsRef.current.slice(0, slides.length);
  }, [slides]);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const handleKey = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.options}>
        {slides.map((s, i) => (
          <div
            key={i}
            ref={(el) => (optionsRef.current[i] = el)}
            className={`${styles.option} ${i === activeIndex ? styles.active : ''}`}
            style={{ ['--optionBackground']: `url(${s.img})` }}
            onClick={() => handleClick(i)}
            onKeyDown={(e) => handleKey(e, i)}
            tabIndex={0}
            role="button"
            aria-pressed={i === activeIndex}
          >
            <div className={styles.shadow} />
            <div className={styles.label}>
              <div className={styles.icon}>
                <i className={s.icon} aria-hidden="true" />
              </div>
              <div className={styles.info}>
                <div className={styles.main}>{s.title}</div>
                <div className={styles.sub}>{s.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a className={styles.credit} href="http://victorofvalencia-blog.tumblr.com" target="_blank" rel="noreferrer">
        Photos from Victor of Valencia on tumblr
      </a>
    </div>
  );
}
