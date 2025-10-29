"use client";
import React, { useEffect, useRef } from 'react';
import '../../globals.css';
import './AnimatedImageSlider.module.css';

/**
 * Converted from the original example in exports/.../animated-image-slider-html-css-javascript
 * Behavior: simple carousel that rotates slides when next/prev are clicked. Styling and
 * structure follow the original so the animation/positions remain identical.
 *
 * Props:
 *  - data: { slides: [{ image, name, description, link }] }
 */
export default function AnimatedImageSlider({ data }) {
  const containerRef = useRef(null);

  // Render slides into the slide container using plain DOM nodes so we can
  // replicate the original behaviour where appendChild/prepend are used.
  useEffect(() => {
    const slideEl = containerRef.current;
    if (!slideEl) return;

    // clear existing children
    slideEl.innerHTML = '';

    (data?.slides || []).forEach((s) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.style.backgroundImage = `url(${s.image})`;

      const content = document.createElement('div');
      content.className = 'content';

      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = s.name;

      const des = document.createElement('div');
      des.className = 'des';
      des.textContent = s.description;

      const a = document.createElement('a');
      a.className = 'seeMore';
      a.href = s.link;
      a.target = '_blank';
      a.rel = 'noreferrer';

      const btn = document.createElement('button');
      btn.textContent = 'See More';

      a.appendChild(btn);
      content.appendChild(name);
      content.appendChild(des);
      content.appendChild(a);
      item.appendChild(content);

      slideEl.appendChild(item);
    });

    return () => {
      if (slideEl) slideEl.innerHTML = '';
    };
  }, [data]);

  const handleNext = () => {
    const slideEl = containerRef.current;
    if (!slideEl) return;
    const items = slideEl.querySelectorAll('.item');
    if (items.length === 0) return;
    // Move first item to the end (original example behavior)
    slideEl.appendChild(items[0]);
  };

  const handlePrev = () => {
    const slideEl = containerRef.current;
    if (!slideEl) return;
    const items = slideEl.querySelectorAll('.item');
    if (items.length === 0) return;
    // Move last item to the front
    slideEl.prepend(items[items.length - 1]);
  };

  return (
    <div className="animated-image-slider">
      <div className="container">
        <div className="slide" ref={containerRef}>
          {/* slides are injected into this container via DOM to preserve original transitions */}
        </div>
        <div className="button">
          <button className="prev" onClick={handlePrev} aria-label="Previous">◁</button>
          <button className="next" onClick={handleNext} aria-label="Next">▷</button>
        </div>
      </div>
      <div className="MDJAminDiv">
        <a className="MDJAmin" href="https://github.com/MDJAmin" target="_blank" rel="noreferrer">MDJAmin</a>
      </div>
    </div>
  );
}
