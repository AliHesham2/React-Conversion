"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import draggableMastheadData from '../../data/draggableMastheadData';
import styles from './DraggableMasthead.module.css';

export default function DraggableMasthead({ slides = draggableMastheadData }) {
  const imgDark = slides[0] || {};
  const imgLight = slides[1] || {};

  const mastheadRef = useRef(null);
  const dragMeRef = useRef(null);
  const viewDarkRef = useRef(null);
  const draggableInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

  let gsap;
  let DraggablePlugin;
  let resizeHandler;
  let clickHandler;
  let touchStartX = null;
  let touchStartY = null;
  let mastEl = null;
  let dmEl = null;
  let vdEl = null;
  let handleTouchStart;
  let handleTouchMove;

    const getRevealWidth = (w) => {
      if (w < 768) return w / 20;
      return w / 2;
    };

    const widthDark = () => {
      const dm = dragMeRef.current;
      const vd = viewDarkRef.current;
      if (!dm || !vd) return;
      // set dark view width to the center line of the drag handle
      // (offsetLeft + half the handle width) so the yellow divider
      // (which sits centered inside the handle) aligns exactly
      const handleWidth = dm.offsetWidth || 70;
      const handleCenter = dm.offsetLeft + (handleWidth / 2);
      vd.style.width = `${handleCenter}px`;
    };

    const animateTo = (leftX, mouseClick = false, delay = 0) => {
      const mast = mastheadRef.current;
      const dm = dragMeRef.current;
      if (!mast || !dm || !gsap) return;
      // Ensure left is within bounds and convert target to left position
      // so the handle center ends up at leftX.
      const handleWidth = dm.offsetWidth || 70;
      const minLeft = 0;
      const maxLeft = Math.max(0, mast.clientWidth - handleWidth);
      // target is the left position of the handle (so center = left + handleWidth/2)
      let targetLeft = leftX - (handleWidth / 2);
      targetLeft = Math.max(minLeft, Math.min(targetLeft, maxLeft));
      gsap.to(dm, { left: targetLeft, duration: 1, onUpdate: widthDark, delay });
    };

    const setup = async () => {
      try {
        const gsapModule = await import('gsap');
        gsap = gsapModule.gsap || gsapModule.default || gsapModule;
        // load Draggable plugin
        const drModule = await import('gsap/Draggable');
        DraggablePlugin = drModule.Draggable || drModule.default || drModule;
        if (gsap && DraggablePlugin && gsap.registerPlugin) gsap.registerPlugin(DraggablePlugin);

        // compute initial sizes and set dark view width
  const mast = mastheadRef.current;
  const dm = dragMeRef.current;
  const vd = viewDarkRef.current;
  if (!mast || !dm || !vd) return;
  mastEl = mast; dmEl = dm; vdEl = vd;

  // place drag element initial left centered in the masthead so the
  // yellow divider (which is centered inside the handle) starts centered
  const initialHandleWidth = dm.offsetWidth || 70;
  const initialLeft = Math.max(0, (mast.clientWidth / 2) - (initialHandleWidth / 2));
  dm.style.left = `${initialLeft}px`;
        widthDark();

        // Create Draggable
        try {
          const instance = DraggablePlugin.create(dm, {
            type: 'left',
            bounds: mast,
            cursor: 'grab',
            activeCursor: 'grabbing',
            zIndexBoost: false,
            onDrag: widthDark,
            onThrowUpdate: widthDark
          })[0];
          draggableInstanceRef.current = instance;
        } catch (e) {
          // fall back: try using gsap.utils.toArray-based create
          try {
            draggableInstanceRef.current = DraggablePlugin.create(dm, { type: 'left', bounds: mast, onDrag: widthDark })[0];
          } catch (err) {
            console.warn('Draggable create failed', err);
          }
        }

        // intro animation
        const reveal = getRevealWidth(window.innerWidth);
        animateTo(reveal, false, 0.75);

        // resize handling
        resizeHandler = () => {
          const w = window.innerWidth;
          const revealW = getRevealWidth(w);
          animateTo(revealW, false, 0);
        };
        window.addEventListener('resize', resizeHandler);

        // Initialization complete. No debug logging in production.

        // click to animate
        clickHandler = (ev) => {
          const rect = mast.getBoundingClientRect();
          const eventLeft = ev.clientX - rect.left;
          animateTo(eventLeft, true, 0);
        };
        mast.addEventListener('click', clickHandler);

        // touch swipe handling (basic)
        handleTouchStart = (evt) => {
          const t = evt.touches && evt.touches[0];
          if (!t) return; touchStartX = t.clientX; touchStartY = t.clientY;
        };
        handleTouchMove = (evt) => {
          if (!touchStartX || !touchStartY) return;
          const t = evt.touches && evt.touches[0];
          if (!t) return;
          const xUp = t.clientX; const yUp = t.clientY;
          const xDiff = touchStartX - xUp; const yDiff = touchStartY - yUp;
          const dmLeft = dmEl?.offsetLeft || 0;
          const frac50 = window.innerWidth / 2;
          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0 && dmLeft > frac50) animateTo(1, true, 0);
            else if (xDiff <= 0 && dmLeft < frac50) animateTo(1, true, 0);
          }
          touchStartX = null; touchStartY = null;
        };
        mast.addEventListener('touchstart', handleTouchStart, { passive: true });
        mast.addEventListener('touchmove', handleTouchMove, { passive: true });

      } catch (e) {
        console.error('Failed to initialize draggable masthead', e);
      }
    };

    setup();

    // no global debug badge appended

    return () => {
      try { window.removeEventListener('resize', resizeHandler); } catch (e) {}
      try { if (mastEl && clickHandler) mastEl.removeEventListener('click', clickHandler); } catch (e) {}
      try { if (mastEl && handleTouchStart) mastEl.removeEventListener('touchstart', handleTouchStart); } catch (e) {}
      try { if (mastEl && handleTouchMove) mastEl.removeEventListener('touchmove', handleTouchMove); } catch (e) {}
      try { if (draggableInstanceRef.current && draggableInstanceRef.current.kill) draggableInstanceRef.current.kill(); } catch (e) {}
      try { if (gsap && dmEl) gsap.killTweensOf(dmEl); } catch (e) {}
    };
  }, []);

  return (
    <section className={styles.masthead} ref={mastheadRef}>
      <div className={`${styles.view} ${styles.viewDark}`} ref={viewDarkRef}>
        <div className={styles.imgWrap}>
            <Image src={imgDark.src} alt={imgDark.alt || 'Dark Image'} fill className={styles.img} unoptimized />
          </div>
      </div>
      <div className={`${styles.view} ${styles.viewLight}`}>
        <div className={styles.imgWrap}>
          <Image src={imgLight.src} alt={imgLight.alt || 'Light Image'} fill className={styles.img} unoptimized />
        </div>
      </div>
      <div className={styles.dragMe} ref={dragMeRef}>
        <span className={`${styles.iconDragDiamond}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 11v-4l-6 5 6 5v-4h12v4l6-5-6-5v4z" />
          </svg>
        </span>
      </div>
  {/* masthead */}
    </section>
  );
}
