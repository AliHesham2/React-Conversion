"use client";

import React, { useEffect, useRef } from 'react';
import styles from './SliderWithComplexAnimation.module.css';

// Step 1: HTML-only conversion of export #116
// Note: CSS and JS are intentionally NOT imported/ported in this step.
// The root element uses a plain `className="root"` so the later CSS
// module (step 3) can be scoped under `.root` without changing markup.
export default function SliderWithComplexAnimation() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Convert jQuery-driven behavior into imperative DOM logic scoped to this component.
    const slidesCount = root.querySelectorAll('.con__slide').length;
    const topAnimSpd = 650;
    const textAnimSpd = 1000;
    const nextSlideSpd = topAnimSpd + textAnimSpd;
    const animTime = 4000;

    const timeouts = [];
    const setT = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const state = {
      animating: true,
      curSlide: 1,
      scrolledUp: false,
    };

    // initial delay matches original script
    setT(() => {
      state.animating = false;
    }, 2300);

    const addActiveTo = (n) => {
      root.querySelector('.con__slide--' + n)?.classList.add('active');
    };

    const removeActiveFrom = (n) => {
      root.querySelector('.con__slide--' + n)?.classList.remove('active');
    };

    const pagination = (slide, target) => {
      state.animating = true;
      let nextSlide;
      if (target === undefined) {
        nextSlide = state.scrolledUp ? slide - 1 : slide + 1;
      } else {
        nextSlide = target;
      }

      // Slides
      removeActiveFrom(slide);
      setT(() => {
        addActiveTo(nextSlide);
      }, nextSlideSpd);

      // Nav
      root.querySelector('.con__nav-item--' + slide)?.classList.remove('nav-active');
      root.querySelector('.con__nav-item--' + nextSlide)?.classList.add('nav-active');

      setT(() => {
        state.animating = false;
      }, animTime);
    };

    const navigateUp = () => {
      if (state.curSlide > 1) {
        state.scrolledUp = true;
        pagination(state.curSlide);
        state.curSlide -= 1;
      }
    };

    const navigateDown = () => {
      if (state.curSlide < slidesCount) {
        state.scrolledUp = false;
        pagination(state.curSlide);
        state.curSlide += 1;
      }
    };

    // Set initial active slide (on load)
    addActiveTo(1);

    // Event handlers (scoped to this component root)
    // Normalize wheel events to match original jQuery logic (wheelDelta / detail)
    const wheelHandler = (e) => {
      if (state.animating) return;
      let wheelDelta = 0;
      if (typeof e.deltaY !== 'undefined') {
        // deltaY positive means scroll down; invert to match wheelDelta sign
        wheelDelta = -e.deltaY;
      }
      if (typeof e.wheelDelta !== 'undefined') {
        wheelDelta = e.wheelDelta;
      }
      if (typeof e.detail !== 'undefined' && wheelDelta === 0) {
        wheelDelta = -e.detail;
      }

      if (wheelDelta > 0 || (e.detail && e.detail < 0)) {
        navigateUp();
      } else {
        navigateDown();
      }
    };

    const clickHandler = (e) => {
      const navItem = e.target.closest && e.target.closest('.con__nav-item');
      if (navItem && !navItem.classList.contains('nav-active')) {
        if (state.animating) return;
        const target = Number(navItem.getAttribute('data-target'));
        pagination(state.curSlide, target);
        state.curSlide = target;
      }

      const navScroll = e.target.closest && e.target.closest('.con__nav-scroll');
      if (navScroll) {
        if (state.animating) return;
        const target = navScroll.getAttribute('data-target');
        if (target === 'up') navigateUp(); else navigateDown();
      }
    };

    const keyHandler = (e) => {
      if (state.animating) return;
      // support modern and older key events
      const key = e.key || e.keyIdentifier || e.which || e.keyCode;
      if (key === 'ArrowUp' || key === 38 || key === 'Up') navigateUp();
      else if (key === 'ArrowDown' || key === 40 || key === 'Down') navigateDown();
    };

    // Link hover underline behavior
    const topLink = root.querySelector('.con__slide--4-top-h-link');
    const botLink = root.querySelector('.con__slide--4-bot-h-link');
    const linkMouseEnter = () => {
      if (topLink) topLink.style.textDecoration = 'underline';
      if (botLink) botLink.style.textDecoration = 'underline';
    };
    const linkMouseLeave = () => {
      if (topLink) topLink.style.textDecoration = 'none';
      if (botLink) botLink.style.textDecoration = 'none';
    };

  // Attach listeners (match original: mousewheel / DOMMouseScroll / wheel)
  document.addEventListener('wheel', wheelHandler, { passive: true });
  document.addEventListener('mousewheel', wheelHandler, { passive: true });
  document.addEventListener('DOMMouseScroll', wheelHandler, { passive: true });
  root.addEventListener('click', clickHandler);
  window.addEventListener('keydown', keyHandler);
  if (topLink) topLink.addEventListener('mouseenter', linkMouseEnter);
  if (topLink) topLink.addEventListener('mouseleave', linkMouseLeave);
  if (botLink) botLink.addEventListener('mouseenter', linkMouseEnter);
  if (botLink) botLink.addEventListener('mouseleave', linkMouseLeave);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('wheel', wheelHandler);
      document.removeEventListener('mousewheel', wheelHandler);
      document.removeEventListener('DOMMouseScroll', wheelHandler);
      root.removeEventListener('click', clickHandler);
      window.removeEventListener('keydown', keyHandler);
      if (topLink) {
        topLink.removeEventListener('mouseenter', linkMouseEnter);
        topLink.removeEventListener('mouseleave', linkMouseLeave);
      }
      if (botLink) {
        botLink.removeEventListener('mouseenter', linkMouseEnter);
        botLink.removeEventListener('mouseleave', linkMouseLeave);
      }
      // clear timeouts
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div className={"root " + styles.root} ref={rootRef}>
      <div className={"con " + styles.con}>
        <div className="con__slide  con__slide--1">
          <div className={"con__slide-top con__slide--1-top active-slide-left-top " + styles['con__slide-top']}>
            <div className="con__slide-top-inner con__slide--1-top-inner">
              <div className={"con__slide-top-inner-text con__slide--1-top-inner-text active-slide1-top-text " + styles['con__slide-top-inner-text']}>
                <h1 className={"con__slide-h con__slide--1-top-h " + styles['con__slide-h']}>some nice slider<br/> here wow</h1>
              </div>
            </div>
          </div>
          {/* slide--1 top end */}
          <div className={"con__slide-bot  con__slide--1-bot active-slide-left-bot " + styles['con__slide-bot']}>
            <div className={"con__slide-bot-text con__slide--1-bot-text active-slide1-bot-text " + styles['con__slide-bot-text']}>
              <h1 className={"con__slide-h con__slide--1-bot-h " + styles['con__slide-h']}>some nice slider<br/> here wow</h1>
            </div>
          </div>
          {/* slide--1 bot end */}
          <div className={"con__slide-content con__slide--1-content active-slide-left-content " + styles['con__slide-content']}>
            <svg className={"con__slide--1-content-logo " + styles['con__slide--1-content-logo']} version="1" xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 600.000000 600.000000">
              <path d="M280.5 13.6c-19 1.9-25.9 2.9-38.5 5.4-73.3 14.6-139.2 59.2-181.4 122.8-24.5 36.8-40.2 79.8-45.8 125.2-1.6 13.5-1.6 51.5 0 65 5.6 45.4 21.3 88.4 45.8 125.2 47.1 70.9 121.3 116.5 206.4 127 5.8.7 20.4 1.3 32.5 1.3 12.1 0 26.7-.6 32.5-1.3 115.7-14.2 209.7-93.7 242.6-205.1 3.8-12.9 7.7-31.8 9.6-47.1 1.6-13.5 1.6-51.4 0-65-5.6-45.4-21.3-88.4-45.8-125.2-46.2-69.6-118.6-115-201.5-126.3-10.9-1.5-48.1-2.7-56.4-1.9zm39 47.4c63.6 5.9 120.7 35.1 161.2 82.4 33.4 39.1 52.5 84.4 57.3 136.1 4.2 45.6-6.5 95.6-29 135.7-29.5 52.4-75.8 91.3-131.5 110.5-72.2 24.8-149.5 14.4-213.1-28.8-30.3-20.6-55.7-48.5-74.4-81.7-22.5-40.1-33.2-90.1-29-135.7 6.2-67.1 37.6-125.6 90-167.5 46.5-37.4 109.5-56.4 168.5-51z"/>
              <path d="M295 123.3c-1.9.7-40.7 26.1-86.2 56.5-64.5 43-83.1 55.9-84.5 58.4-1.7 3.1-1.8 7.5-1.8 61.3 0 53.9.1 58.2 1.8 61.3 1.4 2.5 20.1 15.5 85.5 59.1 49.2 32.8 85.1 56 87 56.4 1.9.4 4.9.1 7-.6 2-.7 40.9-26.1 86.4-56.5 64.5-43 83.1-55.9 84.5-58.4 1.7-3.1 1.8-7.5 1.8-61.3 0-53.9-.1-58.2-1.8-61.3-1.4-2.5-20.1-15.5-85.8-59.2-46.1-30.8-84.5-56-85.2-56-.6 0-2.1-.2-3.2-.5s-3.6.1-5.5.8zm-11 78.9l-.1 35.3-32.8 21.8-32.9 21.9-26.6-17.8-26.6-17.7 58.7-39.3c32.4-21.6 59.1-39.3 59.6-39.3.4-.1.7 15.8.7 35.1zm91 4.1l59 39.4-26.6 17.7-26.6 17.8-32.9-21.9-32.8-21.8-.1-35.3c0-19.3.2-35.2.5-35.2s27.1 17.7 59.5 39.3zm-49.2 74.8c14.1 9.4 26 17.5 26.5 17.8 1 1-52.1 36.4-53.6 35.8-3.2-1.4-52.1-34.8-51.8-35.5.5-.9 51.3-35 52.4-35.1.4-.1 12.3 7.6 26.5 17zm-135.2 18.5s-8.5 5.8-18.8 12.8L153 325.1V274l18.9 12.7c10.4 7.1 18.8 12.8 18.7 12.9zm255.4-.1V325l-18.8-12.7-18.8-12.8 18.5-12.7c10.3-6.9 18.7-12.7 18.9-12.7.1-.1.2 11.4.2 25.4zm-194.8 40.2l32.7 21.8.1 35.2c0 19.4-.2 35.3-.5 35.3s-27.1-17.7-59.5-39.3l-59-39.4 26.2-17.6c14.5-9.6 26.5-17.6 26.8-17.6.3-.1 15.2 9.7 33.2 21.6zm156.3-4l26.5 17.6-59 39.4c-32.4 21.6-59.2 39.3-59.5 39.3-.3 0-.5-15.9-.5-35.3l.1-35.2 32.7-21.7c18-12 32.8-21.8 33-21.8.1 0 12.1 7.9 26.7 17.7z"/>
            </svg>
          </div>
          {/* slide--1 content end */}
        </div>

        {/* slide--1 end */}

        {/* slide 2 */}
        <div className={"con__slide con__slide--right con__slide--2 " + styles['con__slide']}>
          <div className={"con__slide-top con__slide--right-top con__slide--2-top active-slide-right-top " + styles['con__slide-top']}>
            <div className={"con__slide-top-inner con__slide--right-top-inner con__slide--2-top-inner " + styles['con__slide-top-inner']}>
              <div className={"con__slide-top-inner-text con__slide--right-top-inner-text con__slide--2-top-inner-text active-slide2-top-text " + styles['con__slide-top-inner-text']}>
                <h1 className={"con__slide-h con__slide--right-top-h con__slide--2-top-h " + styles['con__slide-h']}>another slide<br/> such wow</h1>
              </div>
            </div>
          </div>
          {/* slide--2 top end */}
          <div className="con__slide-bot con__slide--right-bot con__slide--2-bot active-slide-right-bot">
            <div className="con__slide-bot-text con__slide--right-bot-text con__slide--2-bot-text active-slide2-bot-text">
              <h1 className="con__slide-h con__slide--right-bot-h con__slide--2-bot-h">another slide<br/> such wow</h1>
            </div>
          </div>
          {/* slide--2 bot end */}
          <div className={"con__slide-content con__slide--right-content con__slide--2-content active-slide-right-content " + styles['con__slide-content']}>
            <img className={"con__slide--right-content-image con__slide--2-content-image " + styles['con__slide--right-content-image']} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/537051/doge_snow.png" alt="" />
          </div>
          {/* slide--2 content end */}
        </div>
        {/* slide--2 end */}

        <div className={"con__slide con__slide--3 " + styles['con__slide']}>
          <div className={"con__slide-top  con__slide--3-top active-slide-left-top " + styles['con__slide-top']}>
            <div className={"con__slide-top-inner con__slide--3-top-inner " + styles['con__slide-top-inner']}>
              <div className={"con__slide-top-inner-text con__slide--3-top-inner-text active-slide3-top-text " + styles['con__slide-top-inner-text']}>
                <h1 className={"con__slide-h con__slide--3-top-h " + styles['con__slide-h']}>half collored<br/> text so nice</h1>
              </div>
            </div>
          </div>
          {/* slide--3 top end */}
          <div className="con__slide-bot  con__slide--3-bot active-slide-left-bot">
            <div className="con__slide-bot-text con__slide--3-bot-text active-slide3-bot-text">
              <h1 className="con__slide-h  con__slide--3-bot-h">half collored<br/> text so nice</h1>
            </div>
          </div>
          {/* slide--3 bot end */}
          <div className={"con__slide-content con__slide--3-content active-slide-left-content " + styles['con__slide-content']}>
            <img className={"con__slide--right-content-image con__slide--3-content-image " + styles['con__slide--3-content-image']} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/537051/butterfly_(1).png" alt="" />
          </div>
          {/* slide--3 content end */}
        </div>
        {/* slide--3 end */}

        <div className={"con__slide con__slide--right con__slide--4 " + styles['con__slide']}>
          <div className={"con__slide-top con__slide--right-top con__slide--4-top active-slide-right-top " + styles['con__slide-top']}>
            <div className={"con__slide-top-inner con__slide--right-top-inner con__slide--4-top-inner " + styles['con__slide-top-inner']}>
              <div className={"con__slide-top-inner-text con__slide--right-top-inner-text con__slide--4-top-inner-text active-slide4-top-text " + styles['con__slide-top-inner-text']}>
                <h1 className={"con__slide-h con__slide--right-top-h con__slide--4-top-h " + styles['con__slide-h']}><a className={"con__slide--4-top-h-link " + styles['con__slide--4-top-h-link']} href="https://codepen.io/mrspok407/" target="_blank" rel="noreferrer">checkout my<br/> other pens</a></h1>
              </div>
            </div>
          </div>
          {/* slide--4 top end */}
          <div className={"con__slide-bot con__slide--right-bot con__slide--4-bot active-slide-right-bot " + styles['con__slide-bot']}>
            <div className={"con__slide-bot-text con__slide--right-bot-text con__slide--4-bot-text active-slide4-bot-text " + styles['con__slide-bot-text']}>
              <h1 className={"con__slide-h con__slide--right-bot-h con__slide--4-bot-h " + styles['con__slide-h']}><a className={"con__slide--4-bot-h-link " + styles['con__slide--4-bot-h-link']} href="https://codepen.io/mrspok407/" target="_blank" rel="noreferrer">checkout my<br/> other pens</a></h1>
            </div>
          </div>
          {/* slide--4 bot end */}
          <div className={"con__slide-content con__slide--right-content con__slide--4-content active-slide-right-content " + styles['con__slide-content']}>
            <a href="https://twitter.com/mrspok407" target="_blank" rel="noreferrer"><img className={"con__slide--right-content-image con__slide--4-content-image " + styles['con__slide--4-content-image']} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/537051/twi_(1).png" alt="" /></a>
          </div>
          {/* slide--4 content end */}
        </div>
        {/* slide--4 end */}

        <div className={"con__nav " + styles['con__nav']}>
    <div data-target="up" className={"con__nav-scroll con__nav-scroll--goup " + styles['con__nav-scroll']}></div>
    <div data-target="down" className={"con__nav-scroll con__nav-scroll--godown " + styles['con__nav-scroll']}></div>
    <ul className={"con__nav-list " + styles['con__nav-list']}>
      <li data-target="1" className={"con__nav-item con__nav-item--1 nav-active " + styles['con__nav-item']}></li>
      <li data-target="2" className={"con__nav-item con__nav-item--2 " + styles['con__nav-item']}></li>
      <li data-target="3" className={"con__nav-item con__nav-item--3 " + styles['con__nav-item']}></li>
      <li data-target="4" className={"con__nav-item con__nav-item--4 " + styles['con__nav-item']}></li>
    </ul>
  </div>
        {/* nav end */}
      </div>
    </div>
  );
}
