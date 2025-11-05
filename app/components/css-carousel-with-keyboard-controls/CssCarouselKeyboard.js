"use client";

import React, { useEffect, useRef } from 'react';
import styles from './CssCarouselKeyboard.module.css';

// Pure HTML -> JSX conversion of the original export (CSS-only interaction).
// This component is data-driven: options are provided via the `items` prop.
export default function CssCarouselKeyboard({ items = [] }) {
  // If no items passed, render a few defaults from data file in development.
  const slides = items.length ? items : [
    { id: 'clubs', label: '♣ Clubs' },
    { id: 'hearts', label: '♥ Hearts' },
    { id: 'spades', label: '♠ Spades' },
    { id: 'diamonds', label: '◆ Diamonds' }
  ];

  const formRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Helper to select a radio by index (wraps around)
  const selectIndex = React.useCallback((index) => {
    const el = formRef.current;
    if (!el) return;
    const r = Array.from(el.querySelectorAll('input[name="fancy"]'));
    if (!r.length) return;
    const idx = ((index % r.length) + r.length) % r.length;
    r[idx].click();
    r[idx].focus();
    // keep track of current index to avoid relying on input.checked which
    // can be unreliable during some hydration states
    currentIndexRef.current = idx;
  }, []);

  const move = React.useCallback((dir) => {
    const el = formRef.current;
    if (!el) return;
    const r = Array.from(el.querySelectorAll('input[name="fancy"]'));
    if (!r.length) return;
    // prefer the tracked current index; fallback to checked input if available
    let idx = currentIndexRef.current;
    if (typeof idx !== 'number' || idx < 0 || idx >= r.length) {
      const found = r.findIndex(i => i.checked);
      idx = found === -1 ? 0 : found;
    }
    const next = ((idx + dir + r.length) % r.length + r.length) % r.length;
    selectIndex(next);
  }, [selectIndex]);

  useEffect(() => {
    // keyboard handler to support left/right arrow navigation
    // and debug logging so the user can inspect DevTools console.
    const el = formRef.current;
    if (!el) return;

    // move() helper is defined above and will be used by key handlers.

    function onKey(e) {
      const key = e.key || '';
      // support multiple key name variants and legacy keyCode
      const right = key === 'ArrowRight' || key === 'Right' || e.keyCode === 39 || e.code === 'ArrowRight';
      const left = key === 'ArrowLeft' || key === 'Left' || e.keyCode === 37 || e.code === 'ArrowLeft';
      // Ensure keyboard arrows match on-screen buttons: Right -> next, Left -> prev.
      // If the visual index mapping is inverted for this component, swap the
      // directions here so user expectation is preserved.
      if (right) {
        move(-1);
        e.preventDefault();
      } else if (left) {
        move(1);
        e.preventDefault();
      }
    }

    // bind on the form so it works when any control inside has focus
    el.addEventListener('keydown', onKey);
    // also bind to window/document in capture phase so navigation works
    // even if other handlers call stopPropagation on keydown.
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('keydown', onKey, true);

    // Click-capture for edge arrows: some browsers or layout quirks make
    // the visible pseudo-element arrows not receive clicks reliably.
    // Listen for clicks inside the form and if they're near the left/right
    // edges (but not on interactive elements) treat them as prev/next.
    function onEdgeClick(ev) {
      try {
        if (ev.defaultPrevented) return; // label handler already handled
        const t = ev.target;
        if (!t) return;
  // ignore clicks on native inputs or links (but allow buttons and
  // other elements so visible arrow areas that resolve to buttons
  // still trigger navigation)
  const tag = (t.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'a') return;
        const rect = el.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const w = rect.width || window.innerWidth;
        const edge = Math.min(80, Math.round(w * 0.06)); // 6% or 80px
        if (x <= edge) {
          ev.preventDefault();
          move(-1);
        } else if (x >= w - edge) {
          ev.preventDefault();
          move(1);
        }
      } catch (err) {
        // swallow — don't break app when edge detector throws
      }
    }

    el.addEventListener('click', onEdgeClick);
    // Create transparent overlays positioned over the visible arrow pills so
    // clicks directly on the arrow glyphs are captured reliably without
    // changing CSS files. We insert elements with inline styles and remove
    // them on cleanup.
    const leftOverlay = document.createElement('div');
    const rightOverlay = document.createElement('div');
    const overlayCommon = {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '76px',
      height: Math.min(window.innerHeight * 0.6, 160) + 'px',
      background: 'transparent',
      border: '0',
      padding: '0',
      margin: '0',
      zIndex: '2147483647',
      cursor: 'pointer'
    };
    Object.assign(leftOverlay.style, overlayCommon);
    Object.assign(rightOverlay.style, overlayCommon);
    leftOverlay.style.left = '6px';
    rightOverlay.style.right = '6px';

    leftOverlay.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); move(-1); });
    rightOverlay.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); move(1); });

    document.body.appendChild(leftOverlay);
    document.body.appendChild(rightOverlay);

  // listeners attached

    return () => {
      el.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('keydown', onKey, true);
      el.removeEventListener('click', onEdgeClick);
      try {
        leftOverlay.removeEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); move(-1); });
        rightOverlay.removeEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); move(1); });
      } catch (e) { /* ignore */ }
      if (leftOverlay.parentNode) leftOverlay.parentNode.removeChild(leftOverlay);
      if (rightOverlay.parentNode) rightOverlay.parentNode.removeChild(rightOverlay);
    };
    }, [move]);

  return (
    <div className={styles.root}>
      <form className={styles.form} ref={formRef} tabIndex={-1}>

        {slides.map((s, i) => (
          <input
            key={s.id}
            type="radio"
            name="fancy"
            id={s.id}
            value={s.id}
            defaultChecked={i === 0}
            autoFocus={i === 0}
          />
        ))}

        {slides.map((s, i) => (
          <label
            key={s.id}
            htmlFor={s.id}
            onClick={(e) => {
              // Use the clicked label's index to determine target slide so
              // clicks always move one step relative to the clicked slide.
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = x / rect.width;
              if (pct < 0.18) {
                e.preventDefault();
                // go to previous of this label
                selectIndex(i - 1);
              } else if (pct > 0.82) {
                e.preventDefault();
                // go to next of this label
                selectIndex(i + 1);
              } else {
                // default label behavior: select this slide by index
                selectIndex(i);
              }
            }}
          >{s.label}</label>
        ))}

        <div className={styles.keys}>Use left and right keys to navigate</div>

        {/* Invisible click-capture areas on left/right edges to ensure
            mouse clicks navigate even if other layers overlap visually. */}
        <button
          type="button"
          aria-label="Previous slide"
          className={styles.navLeft}
          onClick={() => move(-1)}
        />
        <button
          type="button"
          aria-label="Next slide"
          className={styles.navRight}
          onClick={() => move(1)}
        />

        {/* Debug controls removed */}
      </form>
    </div>
  );
}
