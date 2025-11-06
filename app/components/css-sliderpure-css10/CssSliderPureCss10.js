"use client";

import React, { useId } from 'react';
import styles from './CssSliderPureCss10.module.css';

/**
 * CssSliderPureCss10
 * Props:
 *  - slides: array of { title?: string, image?: string }
 *
 * This component is a faithful, scoped conversion of the original "CSS
 * Slider - pure css - #10" export. It renders radio inputs (visually
 * hidden) whose :checked state is used by the CSS to show the matching
 * slide. A `.thumbs` container is rendered after the <ul> with thumbnail
 * elements so their position is predictable and easily controlled from
 * React.
 */
export default function CssSliderPureCss10({ slides = [] }) {
  const id = useId();

  const radioClasses = ['frst', 'scnd', 'thrd', 'foth'];

  const items = slides && slides.length >= 4 ? slides : [
    { title: 'MALE GOOFY FACE', image: 'https://assets.codepen.io/1462889/sl1.jpg' },
    { title: 'TOY PIG', image: 'https://assets.codepen.io/1462889/sl2.jpg' },
    { title: 'SHY PORTRAIT', image: 'https://assets.codepen.io/1462889/sl3.jpg' },
    { title: 'SKATEBOARD FACE', image: 'https://assets.codepen.io/1462889/sl4.jpg' }
  ];

  const name = `slider-css10-${id}`;

  return (
    <div className={styles.cont}>
      {/* logo kept for parity with original export */}
      <a className={styles.logo} href="https://front.codes/" target="_blank" rel="noreferrer">
        <img src="https://assets.codepen.io/1462889/fcb.png" alt="logo" />
      </a>

      <div className={`${styles.section} ${styles['full-height']} ${styles['over-hide']} ${styles['padding-tb']}`}>
        <div className={styles.container || ''}>
          <div className={styles.row || ''}>
            <div className={styles.col || ''}>
              <div className={styles['slider-height-padding']}>
                {items.slice(0,4).map((it, idx) => (
                  <input
                    key={idx}
                    className={`${styles.checkbox} ${styles[radioClasses[idx]]}`}
                    type="radio"
                    id={`slide-${idx+1}-${name}`}
                    name={name}
                    defaultChecked={idx === 0}
                  />
                ))}

                <ul>
                  {items.slice(0,4).map((it, idx) => (
                    <li key={idx} style={it.image ? { backgroundImage: `url(${it.image})` } : undefined}>
                      <span>{it.title}</span>
                    </li>
                  ))}
                </ul>

                {/* Thumbs container: simple thumbnail elements we can control from React */}
                <div className={styles.thumbs}>
                  {items.slice(0,4).map((it, idx) => (
                    <label
                      key={idx}
                      htmlFor={`slide-${idx+1}-${name}`}
                      className={`${styles.thumb} ${styles[radioClasses[idx]]}`}
                      style={it.image ? { backgroundImage: `url(${it.image})` } : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
