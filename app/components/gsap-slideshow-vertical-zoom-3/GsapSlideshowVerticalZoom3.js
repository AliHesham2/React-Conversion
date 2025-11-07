"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import styles from './GsapSlideshowVerticalZoom3.module.css';

// Top-level Slideshow class moved outside React component to satisfy
// tooling that disallows class declarations inside components/hooks.
class Slideshow {
  constructor(DOM_el, state, helpers) {
    this.state = state;
    this.helpers = helpers;
    this.DOM = { el: DOM_el };
    // Use helpers.qa which maps CSS module class names to actual selectors
    this.DOM.slides = this.helpers.qa('.slide') || [];
    this.DOM.slidesInner = this.helpers.qa('.slide__img') || [];
    this.current = 0;
    const slideCurrentClass = this.helpers.getClass('slide--current') || 'slide--current';
    if (this.DOM.slides[this.current]) this.DOM.slides[this.current].classList.add(slideCurrentClass);
    this.slidesTotal = this.DOM.slides.length;
  }

  next() {
    this.navigate(1);
  }

  prev() {
    this.navigate(-1);
  }

  goTo(index) {
    if (this.state.isAnimating) {
      this.state.pendingNavigation = { type: 'goto', index };
      return false;
    }
    if (index === this.current) return false;
    this.state.isAnimating = true;
    this.helpers.updateNavigationUI(true);
    const previous = this.current;
    this.current = index;

  const thumbs = this.helpers.qa('.slide-thumb');
  const activeClass = this.helpers.getClass('active') || 'active';
  thumbs.forEach((thumb, i) => thumb.classList.toggle(activeClass, i === index));

    this.helpers.updateSlideCounter(index);
    this.helpers.updateSlideTitle(index);
    this.helpers.updateDragLines(index, true);

    const direction = index > previous ? 1 : -1;
    const currentSlide = this.DOM.slides[previous];
    const currentInner = this.DOM.slidesInner[previous];
    const upcomingSlide = this.DOM.slides[index];
    const upcomingInner = this.DOM.slidesInner[index];

    gsap
      .timeline({
            onStart: () => {
          this.DOM.slides[index].classList.add(this.helpers.getClass('slide--current') || 'slide--current');
          gsap.set(upcomingSlide, { zIndex: 99 });
        },
        onComplete: () => {
          this.DOM.slides[previous].classList.remove(this.helpers.getClass('slide--current') || 'slide--current');
          gsap.set(upcomingSlide, { zIndex: 1 });
          this.state.isAnimating = false;
          this.helpers.updateNavigationUI(false);
          if (this.state.pendingNavigation) {
            const { type, index, direction } = this.state.pendingNavigation;
            this.state.pendingNavigation = null;
            setTimeout(() => {
              if (type === 'goto') this.goTo(index);
              else if (type === 'navigate') this.navigate(direction);
            }, 50);
          }
          if (this.state.mouseOverThumbnails && this.state.lastHoveredThumbIndex !== null) {
            this.state.currentHoveredThumb = this.state.lastHoveredThumbIndex;
            this.helpers.updateDragLines(this.state.lastHoveredThumbIndex, true);
          }
        },
      })
      .addLabel('start', 0)
      .fromTo(
        upcomingSlide,
        { autoAlpha: 1, scale: 0.1, yPercent: direction === 1 ? 100 : -100 },
        { duration: 0.7, ease: 'expo', scale: 0.4, yPercent: 0 },
        'start'
      )
      .fromTo(
        upcomingInner,
        { filter: 'contrast(100%) saturate(100%)', transformOrigin: '100% 50%', scaleY: 4 },
        { duration: 0.7, ease: 'expo', scaleY: 1 },
        'start'
      )
      .fromTo(
        currentInner,
        { filter: 'contrast(100%) saturate(100%)' },
        { duration: 0.7, ease: 'expo', filter: 'contrast(120%) saturate(140%)' },
        'start'
      )
      .addLabel('middle', 'start+=0.6')
      .to(upcomingSlide, { duration: 1, ease: 'power4.inOut', scale: 1 }, 'middle')
      .to(currentSlide, { duration: 1, ease: 'power4.inOut', scale: 0.98, autoAlpha: 0 }, 'middle');
  }

  navigate(direction) {
    if (this.state.isAnimating) {
      this.state.pendingNavigation = { type: 'navigate', direction };
      return false;
    }
    this.state.isAnimating = true;
    this.helpers.updateNavigationUI(true);
    const previous = this.current;
    this.current =
      direction === 1
        ? this.current < this.slidesTotal - 1
          ? ++this.current
          : 0
        : this.current > 0
        ? --this.current
        : this.slidesTotal - 1;

  const thumbs = this.helpers.qa('.slide-thumb');
  const activeClassNav = this.helpers.getClass('active') || 'active';
  thumbs.forEach((thumb, index) => thumb.classList.toggle(activeClassNav, index === this.current));
    this.helpers.updateSlideCounter(this.current);
    this.helpers.updateSlideTitle(this.current);
    this.helpers.updateDragLines(this.current, true);

    const currentSlide = this.DOM.slides[previous];
    const currentInner = this.DOM.slidesInner[previous];
    const upcomingSlide = this.DOM.slides[this.current];
    const upcomingInner = this.DOM.slidesInner[this.current];

    gsap
      .timeline({
            onStart: () => {
          this.DOM.slides[this.current].classList.add(this.helpers.getClass('slide--current') || 'slide--current');
          gsap.set(upcomingSlide, { zIndex: 99 });
        },
        onComplete: () => {
          this.DOM.slides[previous].classList.remove(this.helpers.getClass('slide--current') || 'slide--current');
          gsap.set(upcomingSlide, { zIndex: 1 });
          this.state.isAnimating = false;
          this.helpers.updateNavigationUI(false);
          if (this.state.pendingNavigation) {
            const { type, index, direction } = this.state.pendingNavigation;
            this.state.pendingNavigation = null;
            setTimeout(() => {
              if (type === 'goto') this.goTo(index);
              else if (type === 'navigate') this.navigate(direction);
            }, 50);
          }
          if (this.state.mouseOverThumbnails && this.state.lastHoveredThumbIndex !== null) {
            this.state.currentHoveredThumb = this.state.lastHoveredThumbIndex;
            this.helpers.updateDragLines(this.state.lastHoveredThumbIndex, true);
          }
        },
      })
      .addLabel('start', 0)
      .fromTo(
        upcomingSlide,
        { autoAlpha: 1, scale: 0.1, yPercent: direction === 1 ? 100 : -100 },
        { duration: 0.7, ease: 'expo', scale: 0.4, yPercent: 0 },
        'start'
      )
      .fromTo(
        upcomingInner,
        { filter: 'contrast(100%) saturate(100%)', transformOrigin: '100% 50%', scaleY: 4 },
        { duration: 0.7, ease: 'expo', scaleY: 1 },
        'start'
      )
      .fromTo(
        currentInner,
        { filter: 'contrast(100%) saturate(100%)' },
        { duration: 0.7, ease: 'expo', filter: 'contrast(120%) saturate(140%)' },
        'start'
      )
      .addLabel('middle', 'start+=0.6')
      .to(upcomingSlide, { duration: 1, ease: 'power4.inOut', scale: 1 }, 'middle')
      .to(currentSlide, { duration: 1, ease: 'power4.inOut', scale: 0.98, autoAlpha: 0 }, 'middle');
  }
}

// Script-enabled conversion for export #58.
// NOTE: per your request this component contains the HTML structure and
// the full behavior ported from the original `script.js`. CSS is intentionally
// omitted in this step — the component uses raw class names so the original
// selectors inside the script logic work as-is.
export default function GsapSlideshowVerticalZoom3({ slides = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Scope query helpers to the component root and map CSS module class names
    const mapSelector = (sel) => {
      // If selector starts with a class (.) and maps to a CSS module, replace it
      if (typeof sel === 'string' && sel.startsWith('.')) {
        const className = sel.slice(1);
        const mapped = styles[className];
        return mapped ? `.${mapped}` : sel;
      }
      return sel;
    };

    const q = (sel) => root.querySelector(mapSelector(sel));
    const qa = (sel) => Array.from(root.querySelectorAll(mapSelector(sel)));

    // Register GSAP Observer plugin
    try {
      gsap.registerPlugin(Observer);
    } catch (e) {
      // ignore if plugin is already registered or unavailable
    }

    // Direction constants
    const NEXT = 1;
    const PREV = -1;

    // Slide titles
    const slideTitles = [
      'Cosmic Harmony',
      'Astral Journey',
      'Ethereal Vision',
      'Quantum Field',
      'Celestial Path',
      'Cosmic Whisper',
    ];

    // Mutable state object passed to the Slideshow class and used by handlers
    const state = {
      currentHoveredThumb: null,
      mouseOverThumbnails: false,
      lastHoveredThumbIndex: null,
      isAnimating: false,
      pendingNavigation: null,
    };

    function updateNavigationUI(disabled) {
      const navButtons = qa('.counter-nav');
      navButtons.forEach((btn) => {
        btn.style.opacity = disabled ? '0.3' : '';
        btn.style.pointerEvents = disabled ? 'none' : '';
      });

      const thumbs = qa('.slide-thumb');
      thumbs.forEach((thumb) => {
        thumb.style.pointerEvents = disabled ? 'none' : '';
      });
    }

    function updateSlideCounter(index) {
      const currentSlideEl = q('.current-slide');
      if (currentSlideEl) currentSlideEl.textContent = String(index + 1).padStart(2, '0');
    }

    function updateSlideTitle(index) {
      const titleContainer = q('.slide-title-container');
      const currentTitle = q('.slide-title');
      if (!titleContainer || !currentTitle) return;

      const newTitle = document.createElement('div');
      // Use CSS module mapped class names when creating dynamic elements
      const titleClass = styles['slide-title'] || 'slide-title';
      const enterClass = styles['enter-up'] || 'enter-up';
      const exitClass = styles['exit-up'] || 'exit-up';
      newTitle.className = `${titleClass} ${enterClass}`;
      newTitle.textContent = slideTitles[index] || '';
      titleContainer.appendChild(newTitle);
      // add exit class to current title (mapped)
      currentTitle.classList.add(exitClass);
      void newTitle.offsetWidth;
      setTimeout(() => newTitle.classList.remove(enterClass), 10);
      setTimeout(() => currentTitle.remove(), 500);
    }

    function updateDragLines(activeIndex, forceUpdate = false) {
      const lines = qa('.drag-line');
      if (!lines.length) return;

      lines.forEach((line) => {
        line.style.height = 'var(--line-base-height)';
        line.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      });

      if (activeIndex === null) return;

      const slideCount = qa('.slide').length;
      const lineCount = lines.length;
      const thumbWidth = 720 / slideCount;
      const centerPosition = (activeIndex + 0.5) * thumbWidth;
      const lineWidth = 720 / lineCount;

      for (let i = 0; i < lineCount; i++) {
        const linePosition = (i + 0.5) * lineWidth;
        const distFromCenter = Math.abs(linePosition - centerPosition);
        const maxDistance = thumbWidth * 0.7;
        if (distFromCenter <= maxDistance) {
          const normalizedDist = distFromCenter / maxDistance;
          const waveHeight = Math.cos((normalizedDist * Math.PI) / 2);
          const height =
            parseInt(getComputedStyle(document.documentElement).getPropertyValue('--line-base-height') || '2') +
            waveHeight * 35;
          const opacity = 0.3 + waveHeight * 0.4;
          const delay = normalizedDist * 100;
          if (forceUpdate) {
            lines[i].style.height = `${height}px`;
            lines[i].style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
          } else {
              setTimeout(() => {
                if (
                  state.currentHoveredThumb === activeIndex ||
                  (state.mouseOverThumbnails && state.lastHoveredThumbIndex === activeIndex)
                ) {
                  lines[i].style.height = `${height}px`;
                  lines[i].style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
                }
              }, delay);
          }
        }
      }
    }

    // (Moved Slideshow class to top-level to satisfy linting/build rules.)

    // INIT
  const slidesEl = q('.slides');
  if (!slidesEl) return;
    const helpers = {
      qa,
      updateNavigationUI,
      updateSlideCounter,
      updateSlideTitle,
      updateDragLines,
      // return mapped class name for CSS Modules or fallback to raw
      getClass: (name) => (styles && styles[name] ? styles[name] : name),
    };
  const slideshow = new Slideshow(slidesEl, state, helpers);

    // Create thumbnails
    const thumbsContainer = q('.slide-thumbs');
    const slideImgs = qa('.slide__img');
    const slideCount = slideImgs.length;
    const thumbHandlers = [];
    if (thumbsContainer) {
      thumbsContainer.innerHTML = '';
      slideImgs.forEach((img, index) => {
        const bgImg = img.style.backgroundImage;
        const thumb = document.createElement('div');
        thumb.className = helpers.getClass('slide-thumb') || 'slide-thumb';
        thumb.style.backgroundImage = bgImg;
        if (index === 0) thumb.classList.add(helpers.getClass('active') || 'active');

        const clickHandler = () => {
          state.lastHoveredThumbIndex = index;
          slideshow.goTo(index);
        };
        const enterHandler = () => {
          state.currentHoveredThumb = index;
          state.lastHoveredThumbIndex = index;
          state.mouseOverThumbnails = true;
          if (!state.isAnimating) updateDragLines(index, true);
        };
        const leaveHandler = () => {
          if (state.currentHoveredThumb === index) state.currentHoveredThumb = null;
        };

  thumb.addEventListener('click', clickHandler);
        thumb.addEventListener('mouseenter', enterHandler);
        thumb.addEventListener('mouseleave', leaveHandler);

        thumbHandlers.push({ thumb, clickHandler, enterHandler, leaveHandler });
        thumbsContainer.appendChild(thumb);
      });
    }

    // Create drag lines
    const dragIndicator = q('.drag-indicator');
    if (dragIndicator) {
      dragIndicator.innerHTML = '';
      const linesContainer = document.createElement('div');
      linesContainer.className = helpers.getClass('lines-container') || 'lines-container';
      dragIndicator.appendChild(linesContainer);
      const totalLines = 60;
      for (let i = 0; i < totalLines; i++) {
        const line = document.createElement('div');
        line.className = helpers.getClass('drag-line') || 'drag-line';
        linesContainer.appendChild(line);
      }
    }

    // set total slides
    const totalSlidesEl = q('.total-slides');
    if (totalSlidesEl) totalSlidesEl.textContent = String(slideCount).padStart(2, '0');

    // Add navigation handlers
    const prevButton = q('.prev-slide');
    const nextButton = q('.next-slide');
    const prevHandler = () => slideshow.prev();
    const nextHandler = () => slideshow.next();
    if (prevButton) prevButton.addEventListener('click', prevHandler);
    if (nextButton) nextButton.addEventListener('click', nextHandler);

    // initialize UI
    updateSlideCounter(0);
    updateDragLines(0, true);

    const thumbsArea = q('.thumbs-container');
    if (thumbsArea) {
      thumbsArea.addEventListener('mouseenter', () => (state.mouseOverThumbnails = true));
      thumbsArea.addEventListener('mouseleave', () => {
        state.mouseOverThumbnails = false;
        state.currentHoveredThumb = null;
        updateDragLines(null);
      });
    }

    // Observer / fallback
    let wheelHandler;
    let touchStartY = 0;
    try {
      if (typeof Observer !== 'undefined') {
        Observer.create({
          type: 'wheel,touch,pointer',
          onDown: () => {
            if (!state.isAnimating) slideshow.prev();
          },
          onUp: () => {
            if (!state.isAnimating) slideshow.next();
          },
          wheelSpeed: -1,
          tolerance: 10,
        });
      } else if (gsap && gsap.Observer) {
        gsap.Observer.create({
          type: 'wheel,touch,pointer',
          onDown: () => {
            if (!state.isAnimating) slideshow.prev();
          },
          onUp: () => {
            if (!state.isAnimating) slideshow.next();
          },
          wheelSpeed: -1,
          tolerance: 10,
        });
      } else {
        // fallback
        wheelHandler = (e) => {
          if (state.isAnimating) return;
          if (e.deltaY > 0) slideshow.next();
          else slideshow.prev();
        };
        document.addEventListener('wheel', wheelHandler);
        document.addEventListener('touchstart', (e) => {
          touchStartY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', (e) => {
          if (state.isAnimating) return;
          const touchEndY = e.changedTouches[0].clientY;
          const diff = touchEndY - touchStartY;
          if (Math.abs(diff) > 50) {
            if (diff > 0) slideshow.prev();
            else slideshow.next();
          }
        });
      }
    } catch (error) {
      console.error('Error initializing Observer:', error);
    }

    const keyHandler = (e) => {
      if (state.isAnimating) return;
      if (e.key === 'ArrowRight') slideshow.next();
      else if (e.key === 'ArrowLeft') slideshow.prev();
    };
    document.addEventListener('keydown', keyHandler);

    // cleanup
    return () => {
      try {
        if (prevButton) prevButton.removeEventListener('click', prevHandler);
        if (nextButton) nextButton.removeEventListener('click', nextHandler);
        if (wheelHandler) document.removeEventListener('wheel', wheelHandler);
        document.removeEventListener('keydown', keyHandler);
        // remove thumbnail handlers
        thumbHandlers.forEach(({ thumb, clickHandler, enterHandler, leaveHandler }) => {
          try {
            thumb.removeEventListener('click', clickHandler);
            thumb.removeEventListener('mouseenter', enterHandler);
            thumb.removeEventListener('mouseleave', leaveHandler);
          } catch (e) {}
        });
        gsap.killTweensOf('*');
      } catch (e) {}
    };
  }, [slides]);

  const total = String(slides.length).padStart(2, '0');

  // Render the original HTML structure; use CSS Modules for classNames
  return (
    <div className={styles.slideshow} ref={containerRef}>
      <div className={styles['scroll-hint']}>scroll or drag</div>

      <div className={styles['bottom-ui-container']}>
        <div className={styles['slide-section']}>COSMIC SERIES</div>
        <div className={styles['slide-counter']}>
          <div className={`${styles['counter-nav']} ${styles['prev-slide']}`}>⟪</div>
          <div className={styles['counter-display']}>
            <span className={styles['current-slide']}>01</span>
            <span className={styles['counter-divider']}>{'//'}</span>
            <span className={styles['total-slides']}>{total}</span>
          </div>
          <div className={`${styles['counter-nav']} ${styles['next-slide']}`}>⟫</div>
        </div>
        <div className={styles['slide-title-container']}>
          <div className={styles['slide-title']}>Cosmic Harmony</div>
        </div>
        <div className={styles['drag-indicator']} />
        <div className={styles['thumbs-container']}>
          <div className={styles['frost-bg']} />
          <div className={styles['slide-thumbs']} />
        </div>
      </div>

      <div className={styles.slides}>
        {slides.map((s, i) => (
          <div key={i} className={styles.slide}>
            <div className={styles['slide__img']} style={{ backgroundImage: `url(${s.image})` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
