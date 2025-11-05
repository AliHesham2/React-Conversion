"use client";

import React from 'react';
import styles from './CssInfiniteAutoplayCarousel.module.css';

export default function CssInfiniteAutoplayCarousel({ slides = [] }) {
  // Duplicate slides to create the continuous track (original had duplicated items)
  const trackItems = [...slides, ...slides];

  return (
    <div className={styles.root}>
      <div className={styles.slider}>
        <div className={styles['slide-track']}>
          {trackItems.map((s, i) => (
            <div key={i} className={styles.slide}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} width={s.width} height={s.height} alt={s.alt || ''} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
