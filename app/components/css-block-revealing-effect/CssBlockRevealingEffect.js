"use client";

import React from 'react';
import styles from './CssBlockRevealingEffect.module.css';

// HTML-only JSX conversion of the original export's DOM structure.
// This component is structure-only for now; interactive behavior (if any)
// will be ported later in a separate step.
export default function CssBlockRevealingEffect() {
  return (
    <div className={styles.container}>
      <h1 className={styles.blockEffect} style={{ '--td': '1.2s' }}>
        <div className={styles.blockReveal} style={{ '--bc': '#4040bf', '--d': '.1s' }}>Block</div>
        <div className={styles.blockReveal} style={{ '--bc': '#bf4060', '--d': '.5s' }}>Revealing Effect</div>
      </h1>

      <div className={styles.info}>
        <p>Change --td (total duration) to increase/decrease the time of the effect in HTML panel.</p>
      </div>

      <a className={styles.absSiteLink} href="https://abubakersaeed.netlify.app/designs/d12-block-revealing-effect" rel="nofollow noreferrer" target="_blank">abs/designs/d12-block-revealing-effect</a>
    </div>
  );
}
