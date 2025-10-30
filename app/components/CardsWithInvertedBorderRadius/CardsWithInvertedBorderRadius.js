"use client";

import React from 'react';
import styles from './CardsWithInvertedBorderRadius.module.css';
import data from '../../data/cardsWithInvertedBorderRadiusData';
// Use native <img> to avoid Next/Image SSR/hydration complexity during conversion

export default function CardsWithInvertedBorderRadius() {
  return (
    <section className={styles.wrapper}>
      <h2>leading companies<br/>have trusted us</h2>

      <div className={styles.container}>
        {data.map((item, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles['card-inner']} style={{ ['--clr']: '#fff' }}>
              <div className={styles.box}>
                <div className={styles.imgBox}>
                  <img src={item.img} alt={item.title} className={styles.img} />
                </div>
                <div className={styles.icon}>
                  <a href="#" className={styles.iconBox}><span className="material-symbols-outlined">arrow_outward</span></a>
                </div>
              </div>
            </div>

            <div className={styles.content}>
              <h3>{item.title}</h3>
              <p>Fill out the form and the algorithm will offer the right team of experts</p>
              <ul>
                {item.tags.map((t, i) => (
                  <li key={i} className={t.label} style={{ ['--clr-tag']: t.color }}>{t.label}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
