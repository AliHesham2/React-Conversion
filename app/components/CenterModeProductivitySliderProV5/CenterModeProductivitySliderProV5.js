"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './CenterModeProductivitySliderProV5.module.css';
import slides from '../../data/centerModeProductivitySliderProV5Data';

export default function CenterModeProductivitySliderProV5() {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width:767px)').matches;

  const center = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const wrap = track.parentElement; // derive the wrapper (same as original export)
    if (!wrap) return;
    const card = track.children[i];
    if (!card) return;
    const axis = isMobile() ? 'top' : 'left';
    const size = isMobile() ? 'clientHeight' : 'clientWidth';
    const start = isMobile() ? card.offsetTop : card.offsetLeft;
    wrap.scrollTo({
      [axis]: start - (wrap[size] / 2 - card[size] / 2),
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
  const track = trackRef.current;
  const wrap = track?.parentElement;
    if (!wrap || !track) return;

    function onKey(e) {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    }

    function go(step) {
      setCurrent((cur) => Math.min(Math.max(cur + step, 0), track.children.length - 1));
    }

    const onResize = () => center(current);

    window.addEventListener('keydown', onKey, { passive: true });
    window.addEventListener('resize', onResize);

    // touch handlers
    let sx = 0, sy = 0;
    function touchStart(e) {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }
    function touchEnd(e) {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
        go((isMobile() ? dy : dx) > 0 ? -1 : 1);
    }

  track.addEventListener('touchstart', touchStart, { passive: true });
  track.addEventListener('touchend', touchEnd, { passive: true });

    // cleanup
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      track.removeEventListener('touchstart', touchStart);
      track.removeEventListener('touchend', touchEnd);
    };
  }, [current, center]);

  // ensure centering when current changes
  useEffect(() => center(current), [current, center]);

  return (
    <section className={styles.root}>
      <div className={styles.head}>
        <h2>Boost your professional workflow and productivity</h2>

        <div className={styles.controls}>
          <button
            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
            className={styles.navBtn}
            aria-label="Prev"
            disabled={current === 0}
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(c + 1, slides.length - 1))}
            className={styles.navBtn}
            aria-label="Next"
            disabled={current === slides.length - 1}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.slider}>
        <div className={styles.track} id="track" ref={trackRef} referrerPolicy="no-referrer">
          {slides.map((s, i) => {
            const isActive = i === current;
            return (
              <article
                key={s.title + i}
                className={`${styles.projectCard} ${isActive ? styles.active : ''}`}
                onMouseEnter={() => window.matchMedia('(hover:hover)').matches && setCurrent(i)}
                onClick={() => setCurrent(i)}
              >
                <img className={styles.projectCardBg} src={s.bg} alt="" />
                <div className={styles.projectCardContent}>
                  <img className={styles.projectCardThumb} src={s.thumb} alt="" />
                  <div>
                    <h3 className={styles.projectCardTitle}>{s.title}</h3>
                    <p className={styles.projectCardDesc}>{s.desc}</p>
                    <button className={styles.projectCardBtn}>Details</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.dots} id="dots" aria-hidden={isMobile()}>
        {slides.map((_, i) => (
          <span
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => setCurrent(i)}
            className={i === current ? `${styles.dot} ${styles.dotActive}` : styles.dot}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
