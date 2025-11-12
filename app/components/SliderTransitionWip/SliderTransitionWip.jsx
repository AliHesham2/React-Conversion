"use client";

import React, { useEffect, useRef } from 'react';
import styles from './SliderTransitionWip.module.css';

// Step 2: Ported script.js into React (useEffect + refs)
// This mirrors the original export's runtime: it creates slide nodes,
// manages autoplay, advances slides on the down button click and
// performs proper cleanup on unmount.
export default function SliderTransitionWip() {
  const containerRef = useRef(null);
  const leftSliderRef = useRef(null);
  const downButtonRef = useRef(null);

  useEffect(() => {
    // Slide data copied from the original dist/script.js
    const slide_data = [
      {
        src: 'https://images.unsplash.com/photo-1506765336936-bb05e7e06295?ixlib=rb-0.3.5&s=d40582dbbbb66c7e0812854374194c2e&auto=format&fit=crop&w=1050&q=80',
        title: 'Slide 1',
        copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.'
      },
      {
        src: 'https://images.unsplash.com/photo-1496309732348-3627f3f040ee?ixlib=rb-0.3.5&s=4d04f3d5a488db4031d90f5a1fbba42d&auto=format&fit=crop&w=1050&q=80',
        title: 'Slide 2',
        copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.'
      },
      {
        src: 'https://images.unsplash.com/photo-1504271863819-d279190bf871?ixlib=rb-0.3.5&s=7a2b986d405a04b3f9be2e56b2be40dc&auto=format&fit=crop&w=334&q=80',
        title: 'Slide 3',
        copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.'
      },
      {
        src: 'https://images.unsplash.com/photo-1478728073286-db190d3d8ce6?ixlib=rb-0.3.5&s=87131a6b538ed72b25d9e0fc4bf8df5b&auto=format&fit=crop&w=1050&q=80',
        title: 'Slide 4',
        copy: 'DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.'
      }
    ];

    // Local arrays to mirror the original script's slides/captions lists
    const slides = [];
    const captions = [];

    const container = containerRef.current;
    const leftSlider = leftSliderRef.current;
    const down_button = downButtonRef.current;

    if (!container || !leftSlider) return undefined;

    // Create slide and caption DOM nodes (mirrors original logic)
    for (let i = 0; i < slide_data.length; i++) {
      const slide = document.createElement('div');
      const caption = document.createElement('div');
      const slide_title = document.createElement('div');

      slide.classList.add(styles.slide);
      // Use inline background style as in the original script
      slide.style.background = `url(${slide_data[i].src})`;

      caption.classList.add(styles.caption);
      slide_title.classList.add(styles.captionHeading);
      slide_title.innerHTML = `<h1>${slide_data[i].title}</h1>`;

      // Assign initial classes based on index (current/next/previous)
      switch (i) {
        case 0:
          slide.classList.add(styles.current);
          caption.classList.add(styles.currentCaption);
          break;
        case 1:
          slide.classList.add(styles.next);
          caption.classList.add(styles.nextCaption);
          break;
        case slide_data.length - 1:
          slide.classList.add(styles.previous);
          caption.classList.add(styles.previousCaption);
          break;
        default:
          break;
      }

  caption.appendChild(slide_title);
  const captionSub = document.createElement('div');
  captionSub.classList.add(styles.captionSubhead);
  captionSub.innerHTML = '<span>dolor sit amet, consectetur adipiscing elit. </span>';
  caption.appendChild(captionSub);

      slides.push(slide);
      captions.push(caption);
      // Append to the DOM placeholders inside the component
      leftSlider.appendChild(slide);
      container.appendChild(caption);
    }

    // nextSlide implementation follows the original function behavior
    function nextSlide() {
      if (slides.length < 3) return; // guard for smaller arrays

  slides[0].classList.remove(styles.current);
  slides[0].classList.add(styles.previous, styles.change);
  slides[1].classList.remove(styles.next);
  slides[1].classList.add(styles.current);
  slides[2].classList.add(styles.next);
  const last = slides.length - 1;
  slides[last].classList.remove(styles.previous);

  captions[0].classList.remove(styles.currentCaption);
  captions[0].classList.add(styles.previousCaption, styles.change);
  captions[1].classList.remove(styles.nextCaption);
  captions[1].classList.add(styles.currentCaption);
  captions[2].classList.add(styles.nextCaption);
  const last_caption = captions.length - 1;
  captions[last_caption].classList.remove(styles.previousCaption);

      // Rotate arrays to reflect the slide change order
      const placeholder = slides.shift();
      const captions_placeholder = captions.shift();
      slides.push(placeholder);
      captions.push(captions_placeholder);
    }

    // Autoplay — same interval as original (5s)
    const autoplayId = setInterval(() => {
      nextSlide();
    }, 5000);

    // Wire up the down button to advance slides and stop autoplay
    function onDownClick(e) {
      e.preventDefault();
      clearInterval(autoplayId);
      nextSlide();
    }

    if (down_button) {
      down_button.addEventListener('click', onDownClick);
    }

    // Transition end handling: attach to the first caption (if present)
    function whichTransitionEvent() {
      let t;
      const el = document.createElement('fakeelement');
      const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
      return 'transitionend';
    }

    const transitionEvent = whichTransitionEvent();
    let firstCaptionListener = null;
    if (captions[0]) {
      firstCaptionListener = function (event) {
        // Remove listener after first fire (mirrors original behavior)
        captions[0].removeEventListener(transitionEvent, firstCaptionListener);
        // Keep the console log for parity/debugging
        console.log('animation ended');
      };
      captions[0].addEventListener(transitionEvent, firstCaptionListener);
    }

    // Cleanup on unmount
    return () => {
      clearInterval(autoplayId);
      if (down_button) {
        down_button.removeEventListener('click', onDownClick);
      }
      if (firstCaptionListener && captions[0]) {
        captions[0].removeEventListener(transitionEvent, firstCaptionListener);
      }
      // Remove any nodes we appended to avoid leaking DOM between mounts
      try {
        if (leftSlider) leftSlider.innerHTML = '';
        if (container) {
          // remove only .caption nodes we added (preserve original markup if desired)
          const addedCaptions = container.querySelectorAll('.' + styles.caption);
          addedCaptions.forEach((node) => node.remove());
        }
      } catch (err) {
        console.warn('cleanup error in SliderTransitionWip:', err);
      }
    };
  }, []);
  return (
    <div className={styles.root}>
      <div className={styles.container} id="container" ref={containerRef}>
        {/* Original placeholder caption (kept for parity with the original HTML) */}
        <div className={styles.caption} id="slider-caption">
          <div className={styles.captionHeading}>
            <h1>Lorem Ipsum</h1>
          </div>
          <div className={styles.captionSubhead}><span>dolor sit amet, consectetur adipiscing elit. </span></div>
          <a className={styles.btn} href="#">Sit Amet</a>
        </div>
        <div className={styles.leftCol} id="left-col" ref={leftSliderRef}>
          <div id="left-slider" />
        </div>
        <ul className={styles.nav}>
          <li className={styles.slideUp}><a href="#">&lt;</a></li>
          <li className={styles.slideDown}><a id="down_button" href="#" ref={downButtonRef}>&gt;</a></li>
        </ul>
      </div>
    </div>
  );
}
