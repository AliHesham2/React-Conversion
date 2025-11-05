"use client";

import React from 'react';
import styles from './CssOnlyInkSplashVideoManipulation.module.css';

// Pure HTML → JSX conversion of the original export's markup.
// This component is structural only: it renders iframe elements from the
// provided `items` prop. Styling is provided by the local CSS Module so
// the component can occupy the full viewport when embedded on the page.
export default function CssOnlyInkSplashVideoManipulation({ items = [] }) {
  return (
    <div className={styles.root}>
      {items.map((it, idx) => (
        <iframe
          key={idx}
          className={styles.frame}
          src={it.src}
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
          title={it.title || `video-${idx}`}
        />
      ))}
    </div>
  );
}
