"use client";

import React, { useEffect, useRef } from 'react';
import './ClipPathRevealingSlider.module.css';

export default function ClipPathRevealingSlider({ items = [], height = '100vh' }) {
  const sliderRef = useRef(null);
  const slidingBlockedRef = useRef(false);
  const slidingAT = 1300; // keep sync with original CSS timing

  useEffect(() => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const $slides = slider.querySelectorAll('.slide');
    const $controls = slider.querySelectorAll('.slider__control');

    const numOfSlides = $slides.length;

    [].slice.call($slides).forEach(function($el, index) {
      var i = index + 1;
      $el.classList.add('slide-' + i);
      $el.dataset.slide = i;
    });

    function controlClickHandler() {
      if (slidingBlockedRef.current) return;
      slidingBlockedRef.current = true;

      var $control = this;
      var isRight = $control.classList.contains('m--right');
      var $curActive = slider.querySelector('.slide.s--active');
      var index = +$curActive.dataset.slide;
      (isRight) ? index++ : index--;
      if (index < 1) index = numOfSlides;
      if (index > numOfSlides) index = 1;
      var $newActive = slider.querySelector('.slide-' + index);

      $control.classList.add('a--rotation');
      $curActive.classList.remove('s--active', 's--active-prev');
      const prevSlideEl = slider.querySelector('.slide.s--prev');
      if (prevSlideEl) prevSlideEl.classList.remove('s--prev');

      $newActive.classList.add('s--active');
      if (!isRight) $newActive.classList.add('s--active-prev');

      var prevIndex = index - 1;
      if (prevIndex < 1) prevIndex = numOfSlides;

      const prev = slider.querySelector('.slide-' + prevIndex);
      if (prev) prev.classList.add('s--prev');

      setTimeout(function() {
        $control.classList.remove('a--rotation');
        slidingBlockedRef.current = false;
      }, slidingAT * 0.75);
    }

    [].slice.call($controls).forEach(function($el) {
      $el.addEventListener('click', controlClickHandler);
    });

    return () => {
      [].slice.call($controls).forEach(function($el) {
        $el.removeEventListener('click', controlClickHandler);
      });
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="slider" ref={sliderRef} style={{ ['--slider-height']: heightValue }}>
      <div className="slider__slides">
        {items.map((it, idx) => (
          <div key={it.id} className={`slide ${idx === 0 ? 's--active' : idx === items.length - 1 ? 's--prev' : ''}`}>
            <div className="slide__inner" style={{ backgroundImage: `url(${it.image})` }}>
              <div className="slide__content">
                <h2 className="slide__heading" dangerouslySetInnerHTML={{ __html: it.heading }} />
                <p className="slide__text" dangerouslySetInnerHTML={{ __html: it.text }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider__control">
        <div className="slider__control-line" />
        <div className="slider__control-line" />
      </div>
      <div className="slider__control slider__control--right m--right">
        <div className="slider__control-line" />
        <div className="slider__control-line" />
      </div>
    </div>
  );
}
