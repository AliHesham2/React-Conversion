"use client";
import React, { useEffect, useRef } from 'react';
import '../../globals.css';
import './AnimatedSliderWebpage.module.css';

/**
 * AnimatedSliderWebpage
 * Converted from exports/animated-slider-webpage
 * Behavior mirrors the original: slides are injected into the DOM and
 * next/prev use append/prepend with CSS transitions and a running-time bar.
 *
 * Props:
 * - data: { slides: [{ image, title, name, description }] }
 */
export default function AnimatedSliderWebpage({ data }) {
  const carouselRef = useRef(null);
  const listRef = useRef(null);
  const runningRef = useRef(null);
  const runNextAutoRef = useRef(null);
  const runTimeOutRef = useRef(null);

  const timeRunning = 3000;
  const timeAutoNext = 7000;

  // reset the running-time animation
  const resetTimeAnimation = () => {
    const running = runningRef.current;
    if (!running) return;
    running.style.animation = 'none';
  // force reflow
  running.offsetHeight;
    running.style.animation = null;
    running.style.animation = 'runningTime 7s linear 1 forwards';
  };

  // show slider by moving DOM nodes (next = append first, prev = prepend last)
  const showSlider = (type) => {
    const listEl = listRef.current;
    const carouselEl = carouselRef.current;
    if (!listEl || !carouselEl) return;

    const sliderItemsDom = listEl.querySelectorAll('.item');
    if (type === 'next') {
      listEl.appendChild(sliderItemsDom[0]);
      carouselEl.classList.add('next');
    } else {
      listEl.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
      carouselEl.classList.add('prev');
    }

    clearTimeout(runTimeOutRef.current);
    runTimeOutRef.current = setTimeout(() => {
      carouselEl.classList.remove('next');
      carouselEl.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAutoRef.current);
    runNextAutoRef.current = setTimeout(() => {
      const nextBtn = carouselRef.current && carouselRef.current.querySelector('.next');
      if (nextBtn) nextBtn.click();
    }, timeAutoNext);

    resetTimeAnimation();
  };

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    // populate items via DOM to preserve original CSS transitions
    listEl.innerHTML = '';
    (data?.slides || []).forEach((s) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.style.backgroundImage = `url(${s.image})`;

      const content = document.createElement('div');
      content.className = 'content';

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = s.title || 'SLIDER';

      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = s.name || '';

      const des = document.createElement('div');
      des.className = 'des';
      des.textContent = s.description || '';

      const btnWrap = document.createElement('div');
      btnWrap.className = 'btn';
      const b1 = document.createElement('button');
      b1.textContent = 'See More';
      const b2 = document.createElement('button');
      b2.textContent = 'Subscribe';
      btnWrap.appendChild(b1);
      btnWrap.appendChild(b2);

      content.appendChild(title);
      content.appendChild(name);
      content.appendChild(des);
      content.appendChild(btnWrap);

      item.appendChild(content);
      listEl.appendChild(item);
    });

    // start runningTime animation and autoscroll
    resetTimeAnimation();
    runNextAutoRef.current = setTimeout(() => {
      const nextBtn = carouselRef.current && carouselRef.current.querySelector('.next');
      if (nextBtn) nextBtn.click();
    }, timeAutoNext);

    return () => {
      // cleanup timers
      clearTimeout(runNextAutoRef.current);
      clearTimeout(runTimeOutRef.current);
      if (listEl) listEl.innerHTML = '';
    };
  }, [data]);

  

  return (
    <div className="animated-slider-webpage">
      <div className="carousel" ref={carouselRef}>
        <div className="list" ref={listRef} />

        <div className="arrows">
          <button className="prev" onClick={() => showSlider('prev')} aria-label="Previous">◀</button>
          <button className="next" onClick={() => showSlider('next')} aria-label="Next">▶</button>
        </div>

        <div className="timeRunning" ref={runningRef} />
      </div>
    </div>
  );
}
