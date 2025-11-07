"use client";

import React from 'react';
import styles from './Gallery3dCssInfiniteHover.module.css';

/**
 * HTML-only conversion of `gallery-3dcssinfinitehover` export.
 * - Structural-only component: renders markup from slides prop.
 * - Styling is provided by the CSS module in the same folder.
 * - No behavior ported here (the original had a tiny script to set CSS vars).
 */
export default function Gallery3dCssInfiniteHover({ slides = [] }) {
  const count = slides.length || 10;
  const duration = '16s';

  return (
    <section className={styles.galleryRoot}>
      <h1 className={styles.title}>GALLERY 3D</h1>
      <div
        className={styles.track}
        style={{ ['--count']: count, ['--duration']: duration }}
      >
        {slides.map((s, idx) => (
          <img
            key={idx}
            src={s.src}
            alt={s.alt || ''}
            style={{ ['--i']: idx + 1 }}
          />
        ))}
      </div>
    </section>
  );
}
