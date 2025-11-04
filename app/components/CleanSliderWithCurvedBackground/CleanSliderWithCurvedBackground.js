"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CleanSliderWithCurvedBackground.module.css';

export default function CleanSliderWithCurvedBackground({ slides = [], autoAnimate = false }) {
  const appRef = useRef(null);
  const animationRef = useRef(!!autoAnimate);
  const wheelRef = useRef(false);
  const [animation, setAnimation] = useState(!!autoAnimate);
  const [curSlide, setCurSlide] = useState(1); // 1-based
  const [scrolledUp, setScrolledUp] = useState(false);
  const [initial, setInitial] = useState(!autoAnimate);
  const [active, setActive] = useState(false);
  // displayIdx controls which slide's text/images are currently shown in the
  // outgoing slot (.app__text--1). incomingIdx is what will come in (.app__text--2).
  // We keep these separate from `curSlide` (the bullet selection) so we can
  // update bullets immediately while preserving the outgoing content until the
  // transition finishes (matches original export behavior).
  const [displayIdx, setDisplayIdx] = useState(1);
  const [incomingIdx, setIncomingIdx] = useState(2);
  // which bullet is visually active (mirrors pages__item classes). We update
  // this immediately when pagination starts, but `curSlide` (the logical
  // current slide) is updated only after the transition to match the export.
  const [bulletSlide, setBulletSlide] = useState(curSlide);

  // (removed debug logging) keep component state private — logging removed for parity

  useEffect(() => {
    if (!autoAnimate) return;

    // add .initial after 1500ms (matches original)
    const t1 = setTimeout(() => {
      setInitial(true);
    }, 1500);

    // unlock animation after 4500ms (matches original)
    const t2 = setTimeout(() => {
      setAnimation(false);
      // also clear the synchronous lock so wheel events are accepted
      try { animationRef.current = false; } catch (err) {}
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [autoAnimate]);

  // ensure initial bullet visual matches the starting logical slide
  useEffect(() => {
    // don't call setState here to avoid cascading renders; just ensure the DOM
    // bullet has the active class so visuals match initial state
    try {
      const el = document.querySelector('.pages__item--' + curSlide);
      if (el && !el.classList.contains('page__item-active')) el.classList.add('page__item-active');
    } catch (err) {}
  }, [curSlide]);

  // pagination now accepts an explicit nextSlide so we don't rely on stale
  // `scrolledUp` state when computing the destination. This lets us update
  // the bullets (`curSlide`) immediately, then toggle `.active` to mirror
  // the original export's ordering (bullets update first).
  const pagination = useCallback((slide, target) => {
    if (animationRef.current) return;
    // mark both animation and wheel locks immediately to avoid racey
    // double-invocation when multiple wheel events arrive quickly.
    setAnimation(true);
    animationRef.current = true;
    wheelRef.current = true;

    // prefer an explicit target when provided (avoid relying on scrolledUp
    // state which is async in React). If target is undefined default to
    // next slide (slide + 1).
    let nextSlide = (typeof target !== 'undefined') ? target : (slide + 1);

    // debug: log invocation so we can see when pagination runs in the browser
    try {
      console.debug && console.debug('pagination start', { slide, target, scrolledUp });
    } catch (err) {}

    // update visual bullet immediately
    // manipulate DOM for immediate parity with the original jQuery export
    try {
      const prev = document.querySelector('.pages__item.page__item-active');
      if (prev) prev.classList.remove('page__item-active');
      const el = document.querySelector('.pages__item--' + nextSlide);
      if (el) el.classList.add('page__item-active');
    } catch (err) {
      // ignore DOM errors in non-browser environments
    }
    setBulletSlide(nextSlide);

  // incoming content should reflect the target
  setIncomingIdx(nextSlide);
  // toggle the DOM class immediately to match the original jQuery toggleClass
  if (appRef.current) appRef.current.classList.add('active');
  setActive(true);

    // after transition finishes, swap display to the new slide and clear active
    setTimeout(() => {
      // First, update the displayed and logical slide so that when we end
      // the active transition the DOM already reflects the new slide. This
      // avoids a visible snap/back-scroll to the previous content while the
      // bullet remains selected.
      setDisplayIdx(nextSlide);
      setCurSlide(nextSlide);
      const totalSlides = slides.length;
      const nextIncoming = (nextSlide % totalSlides) + 1;
      setIncomingIdx(nextIncoming);

      // Now clear animation state and remove the active class which ends the
      // transition. Clearing the wheel lock afterwards allows new input.
      setAnimation(false);
      animationRef.current = false;
      if (appRef.current) appRef.current.classList.remove('active');
      setActive(false);
      // clear wheel lock so new wheel events can be processed after the
      // transition completes
      wheelRef.current = false;
    }, 3000);
  }, [slides.length, scrolledUp]);

  const navigateDown = useCallback(() => {
    const totalSlides = slides.length;
    if (curSlide === totalSlides) return; // already at last
    setScrolledUp(false);
    const next = curSlide + 1;
    pagination(curSlide, next);
  }, [curSlide, slides.length, pagination]);

  const navigateUp = useCallback(() => {
    if (curSlide === 1) return; // already at first
    setScrolledUp(true);
    const next = curSlide - 1;
    pagination(curSlide, next);
  }, [curSlide, pagination]);

  useEffect(() => {
    const onWheel = (e) => {
      // normalize for different wheel event types
      // prevent default to avoid the page itself scrolling which can produce
      // extra wheel events and confuse the slider logic
      try { e.preventDefault(); } catch (err) {}
      const delta = e.deltaY ?? -e.wheelDelta ?? e.detail ?? 0;
      try { console.debug && console.debug('wheel event', { delta, animationRef: animationRef.current, wheelRef: wheelRef.current }); } catch (err) {}

      // ignore very small deltas (touchpads can produce tiny jitter)
      if (Math.abs(delta) < 2) return;

      // prevent double handling: but also bail out if an animation is already
      // running. Use both locks to be robust across fast successive events.
      if (animationRef.current || wheelRef.current) return;

      // claim the wheel lock immediately to avoid a race where multiple wheel
      // events arrive before pagination sets animationRef.
      wheelRef.current = true;

      if (delta < 0) {
        try { console.debug && console.debug('navigateUp invoked'); } catch (err) {}
        navigateUp();
      } else {
        try { console.debug && console.debug('navigateDown invoked'); } catch (err) {}
        navigateDown();
      }
    };

    // support multiple wheel event names for broader browser/OS compatibility
    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('mousewheel', onWheel, { passive: false });
    document.addEventListener('DOMMouseScroll', onWheel, { passive: false });

    // delegate clicks on bullets to ensure behavior matches original export
    const onDocClick = (e) => {
      const el = e.target.closest && e.target.closest('.pages__item');
      if (!el) return;
      // also check the synchronous animation lock to avoid races
      if (animation || animationRef.current) return;
      const target = Number(el.getAttribute('data-target'));
      // ignore if already active
      if (el.classList.contains('page__item-active')) return;
      pagination(curSlide, target);
    };
    document.addEventListener('click', onDocClick);

    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('mousewheel', onWheel);
      document.removeEventListener('DOMMouseScroll', onWheel);
      document.removeEventListener('click', onDocClick);
    };
  }, [animation, navigateDown, navigateUp, pagination, curSlide]);

  const onBulletClick = (target) => {
    if (animation || animationRef.current) return;
    pagination(curSlide, target);
  };

  if (!slides || slides.length === 0) return null;

  const total = slides.length;
  // displayed (outgoing) and incoming (entering) slides for text blocks
  const idxDisplay = (displayIdx - 1 + total) % total;
  const idxIncoming = (incomingIdx - 1 + total) % total;
  const cur = slides[idxDisplay];
  const next = slides[idxIncoming];

  // Inline style fallbacks to ensure transforms and opacity match original
  // even if CSS cascade has subtle differences in loading/order.
  const appImgStyle = {
    transform: active ? 'translate3d(0, -1410px, 0)' : (initial ? 'translate3d(0, 0, 0)' : 'translate3d(0, -750px, 0)'),
    transition: 'transform 3s cubic-bezier(0.6, 0.13, 0.31, 1.02)'
  };

  const appBgStyle = {
    transform: active ? 'translate3d(10px, 0, 0) scale(1.05)' : 'none',
    transition: active ? 'transform 5s 850ms ease-in-out' : 'transform 3.5s 770ms'
  };

  const bgImage2Style = {
    opacity: active ? 1 : 0,
    transition: active ? 'opacity 0ms 1500ms' : 'opacity 0ms 0ms'
  };

  return (
    <>
      <div className="cont">
        <div className="mouse" />
        <div ref={appRef} className={`app ${initial ? 'initial' : ''} ${active ? 'active' : ''}`}>
          <div className="app__bgimg" style={appBgStyle}>
            <div className="app__bgimg-image app__bgimg-image--1"></div>
            <div className="app__bgimg-image app__bgimg-image--2" style={bgImage2Style}></div>
          </div>

          <div className="app__img" style={appImgStyle}>
            <img onMouseDown={(e) => e.preventDefault()} src={cur.image} alt="slide" />
          </div>

          <div className="app__text app__text--1">
            <div className="app__text-line app__text-line--4">{cur.lines?.[0]}</div>
            <div className="app__text-line app__text-line--3">{cur.lines?.[1]}</div>
            <div className="app__text-line app__text-line--2">{cur.lines?.[2]}</div>
            <div className="app__text-line app__text-line--1"><img src={cur.thumb} alt="" /></div>
          </div>

          <div className="app__text app__text--2">
            <div className="app__text-line app__text-line--4">{next.lines?.[0]}</div>
            <div className="app__text-line app__text-line--3">{next.lines?.[1]}</div>
            <div className="app__text-line app__text-line--2">{next.lines?.[2]}</div>
            <div className="app__text-line app__text-line--1"><img src={next.thumb} alt="" /></div>
          </div>
        </div>

        <div className="pages">
          <ul className="pages__list">
            {slides.map((s, idx) => (
              <li
                key={idx}
                data-target={idx + 1}
                className={`pages__item pages__item--${idx + 1} ${bulletSlide === idx + 1 ? 'page__item-active' : ''}`}
              ></li>
            ))}
          </ul>
        </div>

      </div>

      {/* Icon links (match original export) */}
      <a href="https://dribbble.com/shots/2936160-Opus-Animation" target="_blank" rel="noreferrer" className="icon-link">
        <img src="http://icons.iconarchive.com/icons/uiconstock/socialmedia/256/Dribbble-icon.png" alt="dribbble" />
      </a>
      <a href="https://twitter.com/mrspok407" target="_blank" rel="noreferrer" className="icon-link icon-link--twitter">
        <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/twitter-128.png" alt="twitter" />
      </a>
    </>
  );
}
