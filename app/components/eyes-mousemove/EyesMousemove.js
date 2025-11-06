"use client";

import React, { useEffect, useRef } from 'react';
import styles from './EyesMousemove.module.css';

// EyesMousemove: pupils follow the pointer/touch. The implementation uses a
// wrapper ref to find eyes/pupils (CSS Modules names) and updates pupil
// transform via requestAnimationFrame for smoothness.
export default function EyesMousemove() {
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const eyes = Array.from(wrapper.querySelectorAll(`.${styles.eye}`));
    const pupils = Array.from(wrapper.querySelectorAll(`.${styles.pupil}`));

    // Pointer position (initialized to center)
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let scheduled = false;

    function update() {
      scheduled = false;
      pupils.forEach((pupil, i) => {
        const eye = eyes[i];
        if (!eye) return;
        const eyeRect = eye.getBoundingClientRect();
        const pupilRect = pupil.getBoundingClientRect();

        const centerX = eyeRect.left + eyeRect.width / 2;
        const centerY = eyeRect.top + eyeRect.height / 2;

        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;

        // Maximum allowed translation so the pupil stays inside the eye.
        const maxX = Math.max(0, (eyeRect.width - pupilRect.width) / 2);
        const maxY = Math.max(0, (eyeRect.height - pupilRect.height) / 2);
        const angle = Math.atan2(dy, dx);
        const distance = Math.hypot(dx, dy);
        const maxDist = Math.hypot(maxX, maxY);
        const dist = Math.min(distance, maxDist);

        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        pupil.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }

    function schedule() {
      if (!scheduled) {
        scheduled = true;
        rafRef.current = requestAnimationFrame(update);
      }
    }

    function onPointer(e) {
      if (e.touches && e.touches[0]) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
      } else {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      schedule();
    }

    function reset() {
      pupils.forEach(p => (p.style.transform = 'translate(0px, 0px)'));
    }

    window.addEventListener('mousemove', onPointer);
    window.addEventListener('touchmove', onPointer, { passive: true });
    window.addEventListener('mouseleave', reset);
    window.addEventListener('resize', schedule);

    // Run an initial update so pupils are centered correctly.
    schedule();

    return () => {
      window.removeEventListener('mousemove', onPointer);
      window.removeEventListener('touchmove', onPointer);
      window.removeEventListener('mouseleave', reset);
      window.removeEventListener('resize', schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
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
