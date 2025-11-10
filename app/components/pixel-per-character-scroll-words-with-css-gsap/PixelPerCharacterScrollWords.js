"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from './PixelPerCharacterScrollWords.module.css';

export default function PixelPerCharacterScrollWords() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;

  // Scope selectors inside this component
  const toSplit = root.querySelector('[data-split]');
  const reader = root.querySelector(`.${styles.reader}`);
  const header = root.querySelector('header');
  const sigSection = root.querySelector(`.${styles.sig}`) || root.querySelector('section:last-of-type');

    if (!toSplit) return;

    // Store original text so we can restore on cleanup
    const originalText = toSplit.innerText;

    const content = originalText;
    const contentLength = content.length;

    const PPC = 10; // Pixels per character
    const BUFFER = 40;

  // Set CSS variables on the component root so styles are local
  // Also set them on document.documentElement to preserve layout math
  // for code that still reads global variables (helps match original)
  const rootEl = root;
  const docEl = document.documentElement;

  // save previous values from both scopes so we can restore on cleanup
  const prevBuffer = rootEl.style.getPropertyValue('--buffer');
  const prevPpc = rootEl.style.getPropertyValue('--ppc');
  const prevPad = rootEl.style.getPropertyValue('--pad');
  const prevContentLength = rootEl.style.getPropertyValue('--content-length');

  const prevDocBuffer = docEl.style.getPropertyValue('--buffer');
  const prevDocPpc = docEl.style.getPropertyValue('--ppc');
  const prevDocPad = docEl.style.getPropertyValue('--pad');
  const prevDocContentLength = docEl.style.getPropertyValue('--content-length');

  // set on component root
  rootEl.style.setProperty('--buffer', BUFFER);
  rootEl.style.setProperty('--ppc', PPC);
  rootEl.style.setProperty('--pad', 8);
  rootEl.style.setProperty('--content-length', contentLength + 2);

  // also set on document root for any global math that expects these tokens
  docEl.style.setProperty('--buffer', BUFFER);
  docEl.style.setProperty('--ppc', PPC);
  docEl.style.setProperty('--pad', 8);
  docEl.style.setProperty('--content-length', contentLength + 2);

    // Split words into spans
    const words = originalText.split(' ');
    toSplit.innerHTML = '';
    let cumulation = 10;
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.innerHTML = `<span>${word} </span>`;
      span.style.cssText = `--index: ${index}; --start: ${cumulation}; --end: ${cumulation + word.length};`;
      span.dataset.index = String(index);
      span.dataset.start = String(cumulation);
      span.dataset.end = String(cumulation + word.length);
      cumulation += word.length + 1;
      toSplit.appendChild(span);
    });

    let toggled = false;

    // Theme toggle
  const TOGGLE = root.querySelector(`.${styles['theme-toggle']}`);
    const SWITCH = () => {
      const isDark = TOGGLE.matches('[aria-pressed=true]') ? false : true;
      TOGGLE.setAttribute('aria-pressed', isDark);
      // toggle theme on the component root (scoped)
      root.dataset.theme = isDark ? 'light' : 'dark';
    };
    const TOGGLE_THEME = () => {
      if (!document.startViewTransition) SWITCH();
      else document.startViewTransition(SWITCH);
    };

    if (TOGGLE) {
      TOGGLE.addEventListener('click', TOGGLE_THEME);
    }

    // initialize component-scoped theme
    root.dataset.theme = 'dark';

    // GSAP fallback animations if view-timeline isn't supported
    let registered = false;
    if (!CSS.supports('animation-timeline: scroll()')) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;

      // Animate the words
      for (const word of toSplit.children) {
        gsap.fromTo(
          word,
          { '--active': 0 },
          {
            '--active': 1,
            ease: 'steps(1)',
            scrollTrigger: {
              trigger: reader || root,
              start: `top top-=${word.dataset.start * PPC}`,
              end: `top top-=${word.dataset.end * PPC}`,
              scrub: true,
            },
          }
        );
      }

      // Animate the header
      if (header) {
        gsap.to(header, {
          scale: 0.8,
          scrollTrigger: {
            trigger: header,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Animate signature paths
  const sigSign = root.querySelector(`.${styles.sig} .sign`);
  const sigEar = root.querySelectorAll(`.${styles.sig} .ear`);
  const sigEye = root.querySelectorAll(`.${styles.sig} .eye`);
  const sigNose = root.querySelectorAll(`.${styles.sig} .nose`);

      if (sigSign) {
        gsap.fromTo(
          sigSign,
          { '--draw': 1.025 },
          {
            '--draw': 0,
            scrollTrigger: {
              trigger: sigSection || root,
              scrub: 0.2,
              start: 'top 75%',
              end: 'bottom 150%',
            },
          }
        );
      }

      sigEar.forEach((el) => {
        gsap.fromTo(
          el,
          { '--draw': 1.025 },
          {
            '--draw': 0,
            scrollTrigger: {
              trigger: sigSection || root,
              scrub: 0.2,
              start: 'bottom 130%',
              end: 'bottom 100%',
            },
          }
        );
      });

      sigEye.forEach((el) => {
        gsap.fromTo(
          el,
          { '--draw': 1.025, fill: 'transparent' },
          {
            '--draw': 0,
            fill: 'canvasText',
            scrollTrigger: {
              trigger: sigSection || root,
              scrub: 0.2,
              start: 'bottom 130%',
              end: 'bottom 100%',
            },
          }
        );
      });

      sigNose.forEach((el) => {
        gsap.fromTo(
          el,
          { '--draw': 1.025, fill: 'transparent' },
          {
            '--draw': 0,
            fill: 'canvasText',
            scrollTrigger: {
              trigger: sigSection || root,
              scrub: 0.2,
              start: 'bottom 120%',
              end: 'bottom 100%',
            },
          }
        );
      });
    }

    // cleanup on unmount
    return () => {
      // restore original text
      try {
        toSplit.innerText = originalText;
      } catch (e) {
        // ignore
      }

  // restore component-root css vars
  if (prevBuffer) rootEl.style.setProperty('--buffer', prevBuffer);
  else rootEl.style.removeProperty('--buffer');
  if (prevPpc) rootEl.style.setProperty('--ppc', prevPpc);
  else rootEl.style.removeProperty('--ppc');
  if (prevPad) rootEl.style.setProperty('--pad', prevPad);
  else rootEl.style.removeProperty('--pad');
  if (prevContentLength) rootEl.style.setProperty('--content-length', prevContentLength);
  else rootEl.style.removeProperty('--content-length');

  // restore document-root css vars
  if (prevDocBuffer) docEl.style.setProperty('--buffer', prevDocBuffer);
  else docEl.style.removeProperty('--buffer');
  if (prevDocPpc) docEl.style.setProperty('--ppc', prevDocPpc);
  else docEl.style.removeProperty('--ppc');
  if (prevDocPad) docEl.style.setProperty('--pad', prevDocPad);
  else docEl.style.removeProperty('--pad');
  if (prevDocContentLength) docEl.style.setProperty('--content-length', prevDocContentLength);
  else docEl.style.removeProperty('--content-length');

      if (TOGGLE) TOGGLE.removeEventListener('click', TOGGLE_THEME);

      if (registered && ScrollTrigger) {
        try {
          ScrollTrigger.getAll().forEach((t) => t.kill());
          ScrollTrigger.clearMatchMedia && ScrollTrigger.clearMatchMedia();
        } catch (e) {}
      }
      try {
        gsap.killTweensOf(toSplit);
      } catch (e) {}
    };
  }, []);

  return (
    <div className={styles.ppcRoot} ref={rootRef}>
      <a
        className={styles['bear-link']}
        href="https://twitter.com/intent/follow?screen_name=jh3yy"
        target="_blank"
        rel="noreferrer noopener"
      >
        <svg
          className="w-9"
          viewBox="0 0 969 955"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="161.191" cy="320.191" r="133.191" stroke="currentColor" strokeWidth="20"></circle>
          <circle cx="806.809" cy="320.191" r="133.191" stroke="currentColor" strokeWidth="20"></circle>
          <circle cx="695.019" cy="587.733" r="31.4016" fill="currentColor"></circle>
          <circle cx="272.981" cy="587.733" r="31.4016" fill="currentColor"></circle>
          <path
            d="M564.388 712.083C564.388 743.994 526.035 779.911 483.372 779.911C440.709 779.911 402.356 743.994 402.356 712.083C402.356 680.173 440.709 664.353 483.372 664.353C526.035 664.353 564.388 680.173 564.388 712.083Z"
            fill="currentColor"
          ></path>
          <rect x="310.42" y="448.31" width="343.468" height="51.4986" fill="#FF1E1E"></rect>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M745.643 288.24C815.368 344.185 854.539 432.623 854.539 511.741H614.938V454.652C614.938 433.113 597.477 415.652 575.938 415.652H388.37C366.831 415.652 349.37 433.113 349.37 454.652V511.741L110.949 511.741C110.949 432.623 150.12 344.185 219.845 288.24C289.57 232.295 384.138 200.865 482.744 200.865C581.35 200.865 675.918 232.295 745.643 288.24Z"
            fill="currentColor"
          ></path>
        </svg>
      </a>

  <button aria-pressed="false" className={styles['theme-toggle']}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
        <span className={styles['sr-only']}>Toggle Theme</span>
      </button>

      <header>
        <video
          autoPlay
          muted
          loop
          src="https://assets.codepen.io/605876/turntable-opt.mp4"
        ></video>
        <section>
          <h1>
            <span>CSS Pro</span>
            <span>Those Little Details</span>
          </h1>
          <a aria-hidden="true" href="#read">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          </a>
        </section>
      </header>

      <section className={styles.reader} id="read">
        <div className={styles.content}>
          <div className={styles['sr-only']}>
            With CSS, you can do way more than you think. One of the most fun CSS
            animation APIs ever. A magical way to create scroll-driven animations
            without the need to touch JavaScript. Animations run off the main
            thread. And you can choose to use View Timelines or Scroll Timelines.
          </div>
          <div data-split aria-hidden="true">
            The little details that make your sites feel great. Combine sticky
            positioning with some scroll animation. With CSS, you can do way more
            than you think.
          </div>
        </div>
      </section>

      <section>
        <h2>
          <span>You</span> got this.
        </h2>
        <svg
          className={styles.sig}
          viewBox="0 0 271 209"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40.3725 26.8984C58.6558 41.1564 141.659 43.1867 128.248 5.48254C127.911 4.53766 127.085 2.2403 125.938 2.0095C124.714 1.76297 121.929 6.39448 121.627 6.82375C100.965 36.1863 95.2641 73.5992 74.5923 102.644C63.7045 117.942 14.7891 145.678 5.55986 113.481C-17.5939 32.705 78.7483 76.0672 105.741 67.4678C119.757 63.0021 125.297 50.6825 132.831 39.1622C135.218 35.5126 137.628 24.6153 140.043 28.2467C144.771 35.3581 119.642 69.8761 115.559 78.4692C110.959 88.1482 129.228 46.7461 136.796 54.3333C146.229 63.7897 128.236 82.7359 153.367 61.6804C157.634 58.1059 166.582 46.4029 161.033 46.8455C153.977 47.4085 141.565 67.0198 151.685 70.0327C161.531 72.9635 176.039 38.7196 174.012 48.7901C173.009 53.769 168.343 67.3695 175.978 68.9069C186.537 71.0328 191.574 35.8659 197.537 44.8359C240.356 109.24 81.7126 283.324 50.2184 167.261C25.2159 75.1229 240.563 89.2082 268.88 137.08"
            className="sign head"
            stroke="currentColor"
            strokeWidth="4"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{ '--path-speed': 2.1467741935483873 }}
          ></path>
          <path
            className="ear"
            d="M187.183 101.246C182.107 82.5407 155.739 77.9455 151.5 99"
            stroke="currentColor"
            strokeWidth="4"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              '--path-speed': 0.08225806451612903,
              '--path-delay': 2.1467741935483873,
            }}
          ></path>
          <path
            className="ear"
            d="M117.998 100.704C117.998 91.1516 103.912 87.3662 96.5585 89.3717C84.7816 92.5836 80.6315 99.053 80.6315 110.505"
            stroke="currentColor"
            strokeWidth="4"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              '--path-speed': 0.09193548387096774,
              '--path-delay': 2.229032258064516,
            }}
          ></path>
          <path
            className="eye"
            d="M170.025 108.347C168.627 105.551 162.781 110.631 165.494 114.577C168.207 118.523 173.936 114.091 171.643 109.965C171.035 108.871 168.547 107.832 167.355 108.428"
            stroke="currentColor"
            strokeWidth="4"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              '--path-speed': 0.04516129032258064,
              '--path-delay': 2.3209677419354837,
            }}
          ></path>
          <path
            className="eye"
            d="M102.952 112.797C97.2672 112.797 96.7371 120.527 102.224 119.917C108.363 119.235 105.409 110.012 100.363 113.04"
            stroke="currentColor"
            strokeWidth="4"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              '--path-speed': 0.041935483870967745,
              '--path-delay': 2.366129032258064,
            }}
          ></path>
          <path
            className="nose"
            d="M144.745 123.82C146.652 122.562 141.479 121.621 140.561 121.402C136.485 120.429 124.736 118.793 124.42 125.721C123.695 141.628 160.767 131.457 140.492 121.735"
            stroke="currentColor"
            strokeWidth="4"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              '--path-speed': 0.1032258064516129,
              '--path-delay': 2.408064516129032,
            }}
          ></path>
        </svg>
      </section>
      <footer>jhey © 2024 ʕ – ᴥ – ʔ</footer>
    </div>
  );
}
