"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import styles from "./CardCarousel.module.css";
import data from "../../data/cardCarouselData";

export default function CardCarousel() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const itemsRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // helper to get local class names
    const C = (name) => styles[name];

    const items = Array.from(root.querySelectorAll(`.${C('card')}`));
    itemsRef.current = items;

    const positionClasses = [
      C('center'),
      C('left-1'),
      C('left-2'),
      C('right-1'),
      C('right-2'),
      C('hidden'),
    ];

    function clearItemClasses(it) {
      // remove all position classes but keep base card class
      positionClasses.forEach((pc) => it.classList.remove(pc));
      // ensure card class exists
      if (!it.classList.contains(C('card'))) it.classList.add(C('card'));
    }

    function applyClasses(idx) {
      const total = items.length;
      if (!total) return;

      // reset
      items.forEach((it) => clearItemClasses(it));

      const center = ((idx % total) + total) % total;
      const left1 = (center - 1 + total) % total;
      const left2 = (center - 2 + total) % total;
      const right1 = (center + 1) % total;
      const right2 = (center + 2) % total;

      items[center].classList.add(C('center'));
      items[left1].classList.add(C('left-1'));
      items[left2].classList.add(C('left-2'));
      items[right1].classList.add(C('right-1'));
      items[right2].classList.add(C('right-2'));

      // hide others
      items.forEach((it, i) => {
        if (![center, left1, left2, right1, right2].includes(i)) {
          it.classList.add(C('hidden'));
        }
      });

      setActive(center);
    }

    applyClasses(active);

    const leftBtn = root.querySelector(`.${C('nav-arrow')}.${C('left')}`);
    const rightBtn = root.querySelector(`.${C('nav-arrow')}.${C('right')}`);
    const dots = Array.from(root.querySelectorAll(`.${C('dot')}`));

    function prev() {
      const newIdx = (active - 1 + items.length) % items.length;
      applyClasses(newIdx);
    }
    function next() {
      const newIdx = (active + 1) % items.length;
      applyClasses(newIdx);
    }

    function onKey(e) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }

    leftBtn && leftBtn.addEventListener('click', prev);
    rightBtn && rightBtn.addEventListener('click', next);
    document.addEventListener('keydown', onKey);

    dots.forEach((d, i) => {
      d.addEventListener('click', () => applyClasses(i));
    });

    // touch support
    let startX = 0;
    let endX = 0;
    function onTouchStart(e) {
      startX = e.touches[0].clientX;
    }
    function onTouchMove(e) {
      endX = e.touches[0].clientX;
    }
    function onTouchEnd() {
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    }

    root.addEventListener('touchstart', onTouchStart);
    root.addEventListener('touchmove', onTouchMove);
    root.addEventListener('touchend', onTouchEnd);

    // Wheel / mouse scroll handling
    // Use a lock to prevent rapid-fire wheel events from skipping multiple slides
    const wheelLock = { locked: false };
    const WHEEL_THRESHOLD = 10; // minimum delta to consider

    function onWheel(e) {
      // only handle vertical wheel
      const dy = e.deltaY;
      if (Math.abs(dy) < WHEEL_THRESHOLD) return;

      // prevent the page from scrolling while interacting with the carousel
      try { e.preventDefault(); } catch (err) {}

      if (wheelLock.locked) return;
      wheelLock.locked = true;

      if (dy > 0) {
        next();
      } else {
        prev();
      }

      // release lock after a short timeout
      setTimeout(() => { wheelLock.locked = false; }, 250);
    }

    // Use non-passive, capture listener so we can preventDefault()
    root.addEventListener('wheel', onWheel, { passive: false, capture: true });

    // cleanup
    return () => {
      leftBtn && leftBtn.removeEventListener('click', prev);
      rightBtn && rightBtn.removeEventListener('click', next);
      document.removeEventListener('keydown', onKey);
      dots.forEach((d) => d.replaceWith(d.cloneNode(true)));
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('touchend', onTouchEnd);
      root.removeEventListener('wheel', onWheel, { passive: false, capture: true });
    };
  }, [active]);

  return (
    <>
      <h1 className={styles['about-title']}>OUR TEAM</h1>

      <div ref={rootRef} className={styles['carousel-container']}>
        <button className={`${styles['nav-arrow']} ${styles.left}`}>‹</button>

        <div className={styles['carousel-track']}>
          {data.map((m, i) => (
            <div
              key={i}
              data-index={i}
              className={`${styles['card']} ${i === 0 ? styles['center'] : styles['hidden']}`}>
              <Image
                src={m.img}
                alt={m.name}
                width={280}
                height={380}
                className={styles.cardImage}
                unoptimized
              />
            </div>
          ))}
        </div>

        <button className={`${styles['nav-arrow']} ${styles.right}`}>›</button>
      </div>

      <div className={styles['member-info']}>
        <div className={styles['member-name']}>{data[active].name}</div>
        <div className={styles['member-role']}>{data[active].role}</div>
      </div>

      <div className={styles['dots']}>
        {data.map((_, i) => (
          <div key={i} data-index={i} className={`${styles['dot']} ${i === active ? styles['active'] : ''}`} />
        ))}
      </div>
    </>
  );
}
