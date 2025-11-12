"use client";

import React, { useState, useRef } from 'react';
import styles from './SkewedFlexboxPanels.module.css';

// Step 2: Port original script.js into React.
// Original behavior: clicking the button toggled `.hide-images` on <body> via jQuery.
// For React we toggle a `.hide-images` class on the component root (scoped) so
// CSS conversion (step 3) can be updated to use the local class instead of body.

export default function SkewedFlexboxPanels() {
  const [hideImages, setHideImages] = useState(false);
  const rootRef = useRef(null);

  const handleToggle = () => {
    setHideImages(prev => !prev);
    // Also set the class on the root element for parity with original behavior
    try {
      if (rootRef.current) {
        if (!hideImages) rootRef.current.classList.add('hide-images');
        else rootRef.current.classList.remove('hide-images');
      }
    } catch (e) {
      // non-fatal
    }
  };

  return (
    <div className={`${styles.root} ${hideImages ? styles.hideImages : ''}`} ref={rootRef}>
      {/* converted sections (originally inside <main>) */}
      <div className={styles.main}>
        <section className={styles.section}>
          <article className={styles.article}>
            <h2 className={styles.h2}>Panel Title</h2>
            <p>This is some description text for this panel.</p>
          </article>
        </section>
        <section className={styles.section}>
          <article className={styles.article}>
            <h2 className={styles.h2}>Panel Title</h2>
            <p>This is some description text for this panel.</p>
          </article>
        </section>
        <section className={styles.section}>
          <article className={styles.article}>
            <h2 className={styles.h2}>Panel Title</h2>
            <p>This is some description text for this panel.</p>
          </article>
        </section>
        <section className={styles.section}>
          <article className={styles.article}>
            <h2 className={styles.h2}>Panel Title</h2>
            <p>This is some description text for this panel.</p>
          </article>
        </section>
        <section className={styles.section}>
          <article className={styles.article}>
            <h2 className={styles.h2}>Panel Title</h2>
            <p>This is some description text for this panel.</p>
          </article>
        </section>
      </div>

      {/* Toggle button wired to React instead of jQuery */}
      <button className={styles.btn} onClick={handleToggle} aria-pressed={hideImages}>Toggle images</button>
    </div>
  );
}
