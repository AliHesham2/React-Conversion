"use client";

import React from 'react';
import styles from './EyesMousemove.module.css';

// HTML-only conversion of exports/eyes-mousemove (visual structure only).
// Behavior (mousemove) will be ported later into useEffect.
export default function EyesMousemove() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.eyes}>
        <div className={styles.eye}>
          <i className={styles.pupil} />
        </div>
        <div className={styles.eye}>
          <i className={styles.pupil} />
        </div>
      </div>
    </div>
  );
}
