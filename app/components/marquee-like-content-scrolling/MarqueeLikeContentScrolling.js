"use client";

import React, { useEffect, useRef } from 'react';
import styles from './MarqueeLikeContentScrolling.module.css';

// HTML-only conversion of exports/marquee-like-content-scrolling
// This component ports the original script.js behavior into a scoped useEffect.
// It still does NOT convert the CSS (we keep original class names so styles can be added later).
export default function MarqueeLikeContentScrolling({ items = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
  const root = document.documentElement;
  const marqueeContent = containerRef.current && containerRef.current.querySelector(`ul.${styles.marqueeContent}`);
    if (!marqueeContent) return;

    // read how many elements the CSS expects to display
    const displayedRaw = getComputedStyle(root).getPropertyValue('--marquee-elements-displayed') || '0';
    const marqueeElementsDisplayed = parseInt(displayedRaw.toString().trim(), 10) || 0;

    // store previous inline value so we can restore it on cleanup
    const prevElems = root.style.getPropertyValue('--marquee-elements');
    try {
      root.style.setProperty('--marquee-elements', marqueeContent.children.length);
    } catch (e) {
      // ignore
    }

    // append clones so the marquee appears continuous (same behavior as original script)
    const clones = [];
    for (let i = 0; i < marqueeElementsDisplayed; i++) {
      const node = marqueeContent.children[i];
      if (!node) break;
      const clone = node.cloneNode(true);
      // mark clone so we can remove it on cleanup
      clone.setAttribute('data-cloned', 'true');
      marqueeContent.appendChild(clone);
      clones.push(clone);
    }

    return () => {
      // remove clones we appended
      clones.forEach((c) => c.remove());
      // restore previous inline property if any
      if (prevElems) {
        root.style.setProperty('--marquee-elements', prevElems);
      } else {
        root.style.removeProperty('--marquee-elements');
      }
    };
  }, []);

    return (
    <div className={styles.marquee} ref={containerRef}>
      <ul className={styles.marqueeContent}>
        {items.map((iconClass, i) => (
          <li key={i}>
            <i className={`fab ${iconClass}`} aria-hidden="true"></i>
          </li>
        ))}
      </ul>
    </div>
  );
}
