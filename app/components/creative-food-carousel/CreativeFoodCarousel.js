"use client";

import React, { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
// Import modules directly from their paths for Swiper v12+ compatibility
// point to .mjs module files which are present in the installed Swiper package
import { Autoplay, Pagination, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './CreativeFoodCarousel.module.css';

/* eslint-disable @next/next/no-img-element */

export default function CreativeFoodCarousel({ slides = [] }) {
  const containerRef = useRef(null);
  const swiperElRef = useRef(null);
  const paginationRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const progressCircleRef = useRef(null);
  const progressTextRef = useRef(null);
  const swiperRef = useRef(null);

  // track active index for custom React pagination
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for mutable state that doesn't trigger renders
  const isTransitioningRef = useRef(false);
  const rafRef = useRef(null);
  const plateFrontTimerRef = useRef(null);

  // CreativeFoodCarousel
  // - slides: array of slide objects { title, image, bgColor, autoplay }
  // This component initializes a Swiper instance and mirrors the original
  // exported behaviour (autoplay, parallax, custom pagination). We keep
  // a small amount of imperative DOM work inside useEffect because Swiper
  // operates directly on DOM nodes. The pagination is rendered by React
  // (buttons) so we can precisely control markup and styling.
  useEffect(() => {
    if (!swiperElRef.current) return;

    const containerEl = containerRef.current;
    const progressCircle = progressCircleRef.current;
    const progressContent = progressTextRef.current;

    function toggleTransition(enable = true) {
      if (!containerEl) return;
      if (!enable) {
        containerEl.classList.add(styles['food-slider-no-transition']);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          containerEl.classList.remove(styles['food-slider-no-transition']);
          isTransitioningRef.current = false;
        });
      } else {
        containerEl.classList.remove(styles['food-slider-no-transition']);
      }
    }

    function applySlideStyles(slideEl, imgScale = 1, duration = '1000ms') {
      if (!slideEl) return;
      const img = slideEl.querySelector('img');
      const title = slideEl.querySelector('[data-role="title-text"]');
      if (img) {
        img.style.transitionDuration = duration;
        img.style.transform = `scale(${imgScale})`;
      }
      if (title) {
        title.style.transitionDuration = duration;
        title.style.color = slideEl.getAttribute('data-slide-bg-color') || '';
      }
    }

    function onTransitionEnd(targetSlide, callback) {
      const img = targetSlide?.querySelector('img');
      if (!img) {
        if (callback) callback();
        return;
      }
      const handler = (event) => {
        if (event.target === img) {
          img.removeEventListener('transitionend', handler);
          if (callback) callback();
        }
      };
      img.addEventListener('transitionend', handler);
    }

    function updateButtonStates(swiper) {
      if (!prevRef.current || !nextRef.current) return;
      prevRef.current.classList.toggle(
        styles['food-slider-button-disabled'],
        swiper.isBeginning
      );
      nextRef.current.classList.toggle(
        styles['food-slider-button-disabled'],
        swiper.isEnd
      );
    }

    // Initialize Swiper
    swiperRef.current = new Swiper(swiperElRef.current, {
      modules: [Autoplay, Pagination, Parallax],
      speed: 1300,
      allowTouchMove: false,
      parallax: true,
      slidesPerView: 1,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      // pagination handled by React below for exact DOM control
      on: {
        autoplayTimeLeft(s, time, progress) {
          if (progressCircle) {
            progressCircle.style.setProperty('--progress', 1 - progress);
          }
          if (progressContent) {
            progressContent.textContent = `${Math.ceil(time / 1000)}s`;
          }
        },
        loopFix() {
          isTransitioningRef.current = false;
        },
        transitionStart(swiper) {
          if (swiper.params.loop && isTransitioningRef.current) return;
          isTransitioningRef.current = true;
          const prevSlide = swiper.slides[swiper.previousIndex];
          const activeSlide = swiper.slides[swiper.activeIndex];
          if (swiper.el) {
            swiper.el.style.backgroundColor = activeSlide.getAttribute('data-slide-bg-color');
          }
          // remove any plate-front markers while transitioning
          try {
            swiper.slides.forEach((sl) => sl.classList.remove('plate-front'));
          } catch (e) {
            /* ignore */
          }
          applySlideStyles(prevSlide, 1.2, '1000ms');
          const prevScale = prevSlide.querySelector('[data-role="scale"]');
          if (prevScale) prevScale.style.transform = 'scale(0.6)';
          onTransitionEnd(prevSlide, () => {
            applySlideStyles(activeSlide, 1.2, '1300ms');
          });
        },
        transitionEnd(swiper) {
          const activeSlide = swiper.slides[swiper.activeIndex];
          applySlideStyles(activeSlide, 1);
          const activeScale = activeSlide.querySelector('[data-role="scale"]');
          if (activeScale) activeScale.style.transform = 'scale(1)';
          onTransitionEnd(activeSlide, () => {
            isTransitioningRef.current = false;
          });
          updateButtonStates(swiper);
          // after transition finishes, raise the active slide's plate above pagination
          if (plateFrontTimerRef.current) clearTimeout(plateFrontTimerRef.current);
          plateFrontTimerRef.current = setTimeout(() => {
            try {
              // remove from all slides then add to the active one
              swiper.slides.forEach((sl) => sl.classList.remove('plate-front'));
              if (activeSlide) activeSlide.classList.add('plate-front');
            } catch (e) {
              /* ignore */
            }
          }, 260);
        },
        beforeInit(swiper) {
          toggleTransition(false);
        },
        init(swiper) {
          const activeSlide = swiper.slides[swiper.activeIndex];
          if (swiper.el && activeSlide) {
            swiper.el.style.backgroundColor = activeSlide.getAttribute('data-slide-bg-color');
          }
          // set initial states and listeners
          updateButtonStates(swiper);
          // set initial active index into React
          setActiveIndex(swiper.activeIndex);
        },
        resize(swiper) {
          toggleTransition(false);
        },
        destroy(swiper) {
          // nothing extra required here; cleanup below
        },
      },
    });

      // attach a slideChange listener to keep React pagination in sync
      const handleSlideChange = () => {
        if (swiperRef.current) {
          // prefer realIndex when loop mode is enabled so index maps to original slides
          const idx = typeof swiperRef.current.realIndex === 'number'
            ? swiperRef.current.realIndex
            : swiperRef.current.activeIndex;
              setActiveIndex(idx);
        }
      };
    
      swiperRef.current.on?.('slideChange', handleSlideChange);

    // Attach manual navigation listeners
    const handleNext = () => {
      if (!isTransitioningRef.current) swiperRef.current?.slideNext();
    };
    const handlePrev = () => {
      if (!isTransitioningRef.current) swiperRef.current?.slidePrev();
    };
    

    const prevEl = prevRef.current;
    const nextEl = nextRef.current;

    
    prevEl?.addEventListener('click', handlePrev);
    nextEl?.addEventListener('click', handleNext);

    // Cleanup on unmount
    return () => {
      prevEl?.removeEventListener('click', handlePrev);
      nextEl?.removeEventListener('click', handleNext);
  // remove our slide change listener then destroy swiper
      try {
        swiperRef.current?.off?.('slideChange', handleSlideChange);
      } catch (e) {
        // ignore
      }
      if (plateFrontTimerRef.current) {
        clearTimeout(plateFrontTimerRef.current);
      }
      if (swiperRef.current) {
        try {
          swiperRef.current.destroy(true, true);
        } catch (e) {
          /* ignore */
        }
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [slides]);

  return (
    <div ref={containerRef} className={styles['food-slider']}>
      <div ref={swiperElRef} className={`swiper ${styles['swiper']}`}>
            {/* Pagination (custom React buttons) — we render a circular plate for
                each slide. We *do not* rely on Swiper's renderBullet here because
                that made it harder to control styles with CSS Modules. Each button
                calls swiper.slideToLoop (if available) so clicks land on the
                correct slide even when Swiper is looped/duplicating slides. */}
        <div className={`swiper-wrapper ${styles['swiper-wrapper']}`}>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`swiper-slide ${styles['swiper-slide']}`}
              data-slide-bg-color={slide.bgColor}
              data-swiper-autoplay={slide.autoplay}
              data-role="slide"
            >
              <div className={styles['food-slider-scale']} data-role="scale">
                <img src={slide.image} alt={slide.alt || slide.title} data-role="image" />
              </div>
              <div className={styles['food-slider-title']} data-swiper-parallax="-130%">
                <div className={styles['food-slider-title-text']} data-role="title-text">
                  {slide.title}
                </div>
              </div>
            </div>
          ))}
  </div>

  <div ref={prevRef} className={`${styles['food-slider-button-prev']} ${styles['food-slider-button']}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
            <g className={styles['food-slider-svg-wrap']}>
              <g className={styles['food-slider-svg-circle-wrap']}>
                {/* Autoplay progress indicator (circle + seconds). Swiper 
                    emits `autoplayTimeLeft` and we update the SVG/progress text
                    in the handler above. */}
                <circle cx="42" cy="42" r="40"></circle>
              </g>
              <path className={styles['food-slider-svg-arrow']} d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z" />
              <path className={styles['food-slider-svg-line']} d="M80,0H0"></path>
            </g>
          </svg>
        </div>

  <div ref={nextRef} className={`${styles['food-slider-button-next']} ${styles['food-slider-button']}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
            <g className={styles['food-slider-svg-wrap']}>
              <g className={styles['food-slider-svg-circle-wrap']}>
                <circle cx="42" cy="42" r="40"></circle>
              </g>
              <path className={styles['food-slider-svg-arrow']} d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z" />
              <path className={styles['food-slider-svg-line']} d="M80,0H0"></path>
            </g>
          </svg>
        </div>

  <div ref={paginationRef} className={`swiper-pagination ${styles['swiper-pagination']} ${styles['food-slider-pagination']}`}>
          {slides.map((s, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                className={`swiper-pagination-bullet ${isActive ? 'swiper-pagination-bullet-active' : ''}`}
                onClick={() => {
                  if (isTransitioningRef.current) return;
                  // if looped, slideToLoop will pick the closest duplicated slide
                  if (typeof swiperRef.current?.slideToLoop === 'function') {
                    swiperRef.current.slideToLoop(i);
                  } else {
                    swiperRef.current?.slideTo(i);
                  }
                }}
              >
                <div className="bullet-plate">
                  <img src={s.image} alt={s.alt || s.title} />
                </div>
                <span aria-hidden={false}>{s.title}</span>
              </button>
            );
          })}
        </div>
        <div className={styles['autoplay-progress']}>
          <svg ref={progressCircleRef} viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressTextRef}></span>
        </div>
      </div>
    </div>
  );
}
