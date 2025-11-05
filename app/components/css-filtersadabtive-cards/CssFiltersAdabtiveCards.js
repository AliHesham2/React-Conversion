"use client";

import React from 'react';
import styles from './CssFiltersAdabtiveCards.module.css';

export default function CssFiltersAdabtiveCards({ slides = [] }) {
  return (
    <div className={styles.root}>
      <nav className={styles.navbar}>
        <a href="#" className={`${styles.logo} ${styles['nav-link']}`}>ArStore</a>

        <div className={styles['nav-actions']}>
          <div className={styles['search-wrap']}>
            <button className={styles['search-btn']} aria-label="search-btn">
              <svg
                className={styles['nav-icon-svg']}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,1)"
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />
              </svg>
            </button>
            <input className={styles['search-input']} type="search" placeholder="Search" />
          </div>

          <a href="#" className={`${styles['nav-link']} ${styles.cart}`}>
            CART(0)
            <span className={styles['cart-icon-wrapper']}>
              <svg
                className={styles['nav-icon-svg']}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.00488 7.99966V5.99966C7.00488 3.23824 9.24346 0.999664 12.0049 0.999664C14.7663 0.999664 17.0049 3.23824 17.0049 5.99966V7.99966H20.0049C20.5572 7.99966 21.0049 8.44738 21.0049 8.99966V20.9997C21.0049 21.5519 20.5572 21.9997 20.0049 21.9997H4.00488C3.4526 21.9997 3.00488 21.5519 3.00488 20.9997V8.99966C3.00488 8.44738 3.4526 7.99966 4.00488 7.99966H7.00488ZM7.00488 9.99966H5.00488V19.9997H19.0049V9.99966H17.0049V11.9997H15.0049V9.99966H9.00488V11.9997H7.00488V9.99966ZM9.00488 7.99966H15.0049V5.99966C15.0049 4.34281 13.6617 2.99966 12.0049 2.99966C10.348 2.99966 9.00488 4.34281 9.00488 5.99966V7.99966Z" />
              </svg>
            </span>
          </a>
        </div>
      </nav>

      <section className={styles.section}>
        <div className={styles.cards}>
          {slides.map((s, i) => (
            <a key={i} href="#" className={`${styles.card} ${styles[`card-${i + 1}`]}`}>
              <figure className={styles.visual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles['card-img']} src={s.img} alt={s.alt} />
                <figcaption className={styles.figcaption}>{s.caption}</figcaption>
              </figure>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
