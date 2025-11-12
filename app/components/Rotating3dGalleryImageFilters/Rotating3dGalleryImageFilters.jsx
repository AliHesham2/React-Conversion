"use client";

import React, { useEffect, useRef } from 'react';
import styles from './Rotating3dGalleryImageFilters.module.css';

// Step 2: Port the original script.js behavior into this React component.
// The original rotates the `.image-container` by 90deg steps and auto-rotates every 3s.
// CSS and any external libraries remain untouched in this step.

export default function Rotating3dGalleryImageFilters() {
  const containerRef = useRef(null);
  const rootRef = useRef(null);
    const btnContainerRef = useRef(null);
  const timerRef = useRef(null);
  const xRef = useRef(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const prevEl = prevRef.current;
    const nextEl = nextRef.current;
    if (!container) return;

    const rootEl = rootRef.current;

      // const btnContainerRef = { current: null };

      // positionButtons now places the whole btn-container centered under the image container
      function positionButtons() {
        if (!rootEl || !container) return;
        const rootRect = rootEl.getBoundingClientRect();
        const imgRect = container.getBoundingClientRect();
          const btnContainer = btnContainerRef.current || document.querySelector(`.${styles['btn-container']}`);
        if (!btnContainer) return;

        // center the container under the image container
        const centerX = imgRect.left + imgRect.width / 2 - rootRect.left;
        const topY = imgRect.bottom - rootRect.top + 12; // small gap below image
        btnContainer.style.left = `${centerX}px`;
        btnContainer.style.top = `${topY}px`;
        btnContainer.style.transform = 'translateX(-50%)';
      }

    // Reposition on resize and after transitions
    const onResize = () => positionButtons();
    window.addEventListener('resize', onResize);

    function updateGallery() {
      container.style.transform = `perspective(1000px) rotateY(${xRef.current}deg)`;
      // restart auto-rotate
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        xRef.current -= 90;
        updateGallery();
      }, 3000);
      // reposition the buttons after transform (small timeout to allow layout)
      setTimeout(positionButtons, 50);
    }

    function onPrev() {
      xRef.current += 90;
      clearTimeout(timerRef.current);
      updateGallery();
    }

    function onNext() {
      xRef.current -= 90;
      clearTimeout(timerRef.current);
      updateGallery();
    }

  prevEl?.addEventListener('click', onPrev);
  nextEl?.addEventListener('click', onNext);

  // initial position
  setTimeout(positionButtons, 50);

    // start
    updateGallery();

    return () => {
      clearTimeout(timerRef.current);
      prevEl?.removeEventListener('click', onPrev);
      nextEl?.removeEventListener('click', onNext);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles['image-container']} ref={containerRef}>
        <span style={{ ['--i']: 1 }}>
          <img alt="landscape 1" src="https://images.unsplash.com/photo-1556316384-12c35d30afa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ5NTU0ODN8&ixlib=rb-4.0.3&q=85" />
        </span>
        <span style={{ ['--i']: 2 }}>
          <img alt="landscape 2" src="https://images.unsplash.com/photo-1552168324-d612d77725e3?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ5NTU1ODB8&ixlib=rb-4.0.3&q=85" />
        </span>
        <span style={{ ['--i']: 3 }}>
          <img alt="landscape 3" src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ5NTU3MTJ8&ixlib=rb-4.0.3&q=85" />
        </span>
        <span style={{ ['--i']: 4 }}>
          <img alt="landscape 4" src="https://images.unsplash.com/photo-1571450669798-fcb4c543f6a4?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ5NTU4Njl8&ixlib=rb-4.0.3&q=85" />
        </span>
      </div>

      {/* buttons kept in the component so the ported script can attach directly */}
      <div className={styles['btn-container']} ref={btnContainerRef}>
        <button className={styles.btn} id="prev" ref={prevRef} aria-label="previous">
          <i className="fa-solid fa-rotate-left" />
        </button>
        <button className={styles.btn} id="next" ref={nextRef} aria-label="next">
          <i className="fa-solid fa-rotate-right" />
        </button>
      </div>
    </div>
  );
}
