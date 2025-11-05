"use client";

import React, { useState } from 'react';
import styles from './CssOnlyMarquee.module.css';

export default function CssOnlyMarquee({ items = [] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className={styles.pauseButton}
      >
        {paused ? 'Resume Animation' : 'Pause Animation'}
      </button>

      <div className={paused ? `${styles.marquees} ${styles.paused}` : styles.marquees}>
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
  );
}
