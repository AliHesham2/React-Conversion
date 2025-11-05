"use client";

import React, { useState } from 'react';
import styles from './CssOnlyMarquee.module.css';

export default function CssOnlyMarquee({ items = [] }) {
  const [paused, setPaused] = useState(false);

  // Wrap with a global background helper (`marquee-bg`) and the local
  // `.wrapper` so the fixed background and absolute pause button behave as
  // expected without polluting the module with global selectors.
  return (
    // Toggle the small global helper `.u-paused` on the background wrapper so
    // we do not need :global() inside the CSS Module; the module reads the
    // --marquee-play-state custom property to control animation play state.
    <div className={`marquee-bg ${paused ? 'u-paused' : ''}`}>
      <div className={styles.wrapper}>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className={styles.pauseButton}
        >
          {paused ? 'Resume Animation' : 'Pause Animation'}
        </button>

  <div className={styles.marquees}>
          {items.map((it, idx) => (
            <section
              key={idx}
              className={styles.marquee}
              style={{ ['--char-count']: String(it.count || 20) }}
            >
              <div className={styles['marquee--inner']}>
                {Array.from({ length: it.repeat || 6 }).map((_, i) => (
                  <p key={i} aria-hidden={i === 0 ? 'false' : 'true'}>
                    {it.text}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
