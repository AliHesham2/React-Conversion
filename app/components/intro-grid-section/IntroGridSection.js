"use client";

import React, { useEffect, useRef } from 'react';
import styles from './IntroGridSection.module.css';

// IntroGridSection: HTML+behavior port. Scopes DOM queries to containerRef.
export default function IntroGridSection({ data = { rows: [], content: {} } }) {
  const { rows = [], content = {} } = data;
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // local mutable state used by the animation loop
    const state = {
      winsize: { width: window.innerWidth, height: window.innerHeight },
      mousepos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      renderedStyles: [],
      requestId: undefined,
      _cleanup: null
    };

    const setup = async () => {
      // dynamic imports so bundler picks up packages but we don't require globals
      const gsapModule = await import('gsap');
      const FlipModule = await import('gsap/Flip');
      const { default: Lenis } = await import('@studio-freight/lenis');
      const gsap = gsapModule.default || gsapModule;
      const Flip = FlipModule.default || FlipModule;

      gsap.registerPlugin(Flip);

      if (!mounted) return;
      const root = containerRef.current;
      if (!root) return;

      const body = document.body;
  const contentEl = root.querySelector(`.${styles.content}`);
  const enterButton = root.querySelector(`.${styles.enter}`);
  const fullview = root.querySelector(`.${styles.fullview}`);
  const grid = root.querySelector(`.${styles.grid}`);
  const gridRows = grid ? grid.querySelectorAll(`.${styles.row}`) : [];

      const onResize = () => {
        state.winsize = { width: window.innerWidth, height: window.innerHeight };
      };
      window.addEventListener('resize', onResize);

      const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
          posx = ev.pageX;
          posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
          posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posx, y: posy };
      };

      const updateMousePosition = (ev) => {
        const pos = getMousePos(ev);
        state.mousepos.x = pos.x;
        state.mousepos.y = pos.y;
      };

      const config = {
        translateX: true,
        skewX: false,
        contrast: true,
        scale: false,
        brightness: true
      };

      const numRows = gridRows.length;
      const middleRowIndex = Math.floor(numRows / 2);
      const middleRow = gridRows[middleRowIndex];
  const middleRowItems = middleRow ? middleRow.querySelectorAll(`.${styles['row__item']}`) : [];
      const numRowItems = middleRowItems.length;
      const middleRowItemIndex = Math.floor(numRowItems / 2);
  const middleRowItemInner = middleRowItems.length ? middleRowItems[middleRowItemIndex].querySelector(`.${styles['row__item-inner']}`) : null;
  const middleRowItemInnerImage = middleRowItemInner ? middleRowItemInner.querySelector(`.${styles['row__item-img']}`) : null;
  if (middleRowItemInnerImage) middleRowItemInnerImage.classList.add(styles['row__item-img--large']);

      const baseAmt = 0.1;
      const minAmt = 0.05;
      const maxAmt = 0.1;

      state.renderedStyles = Array.from({ length: numRows }, (v, index) => {
        const distanceFromMiddle = Math.abs(index - middleRowIndex);
        const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, minAmt);
        const scaleAmt = Math.min(baseAmt + distanceFromMiddle * 0.03, maxAmt);
        let style = { amt, scaleAmt };

        if (config.translateX) style.translateX = { previous: 0, current: 0 };
        if (config.skewX) style.skewX = { previous: 0, current: 0 };
        if (config.contrast) style.contrast = { previous: 100, current: 100 };
        if (config.scale) style.scale = { previous: 1, current: 1 };
        if (config.brightness) style.brightness = { previous: 100, current: 100 };

        return style;
      });

      const lerp = (a, b, n) => (1 - n) * a + n * b;

      const calculateMappedX = () => (((state.mousepos.x / state.winsize.width) * 2 - 1) * 40 * state.winsize.width) / 100;
      const calculateMappedSkew = () => ((state.mousepos.x / state.winsize.width) * 2 - 1) * 3;
      const calculateMappedContrast = () => {
        const centerContrast = 100;
        const edgeContrast = 330;
        const t = Math.abs((state.mousepos.x / state.winsize.width) * 2 - 1);
        const factor = Math.pow(t, 2);
        return centerContrast - factor * (centerContrast - edgeContrast);
      };
      const calculateMappedScale = () => {
        const centerScale = 1;
        const edgeScale = 0.95;
        return centerScale - Math.abs((state.mousepos.x / state.winsize.width) * 2 - 1) * (centerScale - edgeScale);
      };
      const calculateMappedBrightness = () => {
        const centerBrightness = 100;
        const edgeBrightness = 15;
        const t = Math.abs((state.mousepos.x / state.winsize.width) * 2 - 1);
        const factor = Math.pow(t, 2);
        return centerBrightness - factor * (centerBrightness - edgeBrightness);
      };

      const getCSSVariableValue = (element, variableName) => getComputedStyle(element).getPropertyValue(variableName).trim();

      const render = () => {
        const mappedValues = {
          translateX: calculateMappedX(),
          skewX: calculateMappedSkew(),
          contrast: calculateMappedContrast(),
          scale: calculateMappedScale(),
          brightness: calculateMappedBrightness()
        };

        gridRows.forEach((row, index) => {
          const style = state.renderedStyles[index];

          for (let prop in config) {
            if (config[prop]) {
              style[prop].current = mappedValues[prop];
              const amt = prop === 'scale' ? style.scaleAmt : style.amt;
              style[prop].previous = lerp(style[prop].previous, style[prop].current, amt);
            }
          }

          let gsapSettings = {};
          if (config.translateX) gsapSettings.x = style.translateX.previous;
          if (config.skewX) gsapSettings.skewX = style.skewX.previous;
          if (config.scale) gsapSettings.scale = style.scale.previous;
          if (config.contrast) gsapSettings.filter = `contrast(${style.contrast.previous}%)`;
          if (config.brightness) gsapSettings.filter = `${gsapSettings.filter ? gsapSettings.filter + ' ' : ''}brightness(${style.brightness.previous}%)`;

          gsap.set(row, gsapSettings);
        });

        state.requestId = requestAnimationFrame(render);
      };

      const startRendering = () => { if (!state.requestId) render(); };
      const stopRendering = () => { if (state.requestId) { cancelAnimationFrame(state.requestId); state.requestId = undefined; } };

      const enterFullview = () => {
        const flipstate = Flip.getState(middleRowItemInner);
        fullview.appendChild(middleRowItemInner);

        const transContent = getCSSVariableValue(contentEl, '--trans-content');

        const tl = gsap.timeline();

        tl.add(
          Flip.from(flipstate, {
            duration: 0.9,
            ease: 'power4',
            absolute: true,
            onComplete: stopRendering
          })
        )
          .to(grid, { duration: 0.9, ease: 'power4', opacity: 0.01 }, 0)
          .to(middleRowItemInnerImage, { scale: 1.2, duration: 3, ease: 'sine' }, '<-=0.45')
          .to(contentEl, { y: transContent, duration: 0.9, ease: 'power4' });

        enterButton.classList.add('hidden');
        // remove the class that locked scrolling and also clear any inline overflow
        body.classList.remove('noscroll');
        try {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        } catch (e) {
          // ignore
        }
      };

      const init = () => {
        startRendering();
        if (enterButton) {
          enterButton.addEventListener('click', enterFullview);
          enterButton.addEventListener('touchstart', enterFullview);
        }
      };

      // mouse & touch listeners
      window.addEventListener('mousemove', updateMousePosition);
      const touchMoveHandler = (ev) => {
        const touch = ev.touches[0];
        updateMousePosition(touch);
      };
      window.addEventListener('touchmove', touchMoveHandler);

      // init smooth scrolling (Lenis)
      const initSmoothScrolling = () => {
        const lenis = new Lenis({ lerp: 0.15 });
        // keep a reference so other code can call resize/destroy if needed
        state.lenis = lenis;
        gsap.ticker.add((time) => {
          if (state.lenis) state.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      };

      initSmoothScrolling();
      init();

      // cleanup on unmount
      const cleanup = () => {
        stopRendering();
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', updateMousePosition);
        window.removeEventListener('touchmove', touchMoveHandler);
        if (enterButton) {
          enterButton.removeEventListener('click', enterFullview);
          enterButton.removeEventListener('touchstart', enterFullview);
        }
      };

      state._cleanup = cleanup;
    };

    setup().catch((err) => {
      console.error('IntroGridSection init error:', err);
    });

    return () => {
      mounted = false;
      if (state && state._cleanup) state._cleanup();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <section className={styles.intro}>
        <div className={styles.grid}>
          {rows.map((row, rowIndex) => (
            <div className={styles.row} key={rowIndex}>
              {row.items.map((item, i) => (
                <div className={styles['row__item']} key={i}>
                  <div className={styles['row__item-inner']}>
                    <div
                      className={`${styles['row__item-img']} ${item.large ? styles['row__item-img--large'] : ''}`}
                      style={{ backgroundImage: `url(${item.img})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.fullview} />
        <div className={styles.enter}>
          <span>{content.enterText || 'Explore'}</span>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles['content__header']}>
          <h2>{content.header || 'Projects'}</h2>
        </div>
        <div className={styles['content__text']}>
          {(content.paragraphs || []).map((p, idx) => (
            <p key={idx} className={idx === 1 ? styles.highlight : (idx === 0 ? styles.right : '')}>
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

