"use client";

import React, { useState, useRef } from "react";
import styles from "./ReactSliderWithHoverEffect.module.css";

// Step 2: port script.js behavior into this React component using hooks.
// This keeps the original markup and class names so step 3 (CSS) can be
// converted and scoped later.

const slideData = [
  {
    index: 0,
    headline: "New Fashion Apparel",
    button: "Shop now",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/fashion.jpg",
  },
  {
    index: 1,
    headline: "In The Wilderness",
    button: "Book travel",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/forest.jpg",
  },
  {
    index: 2,
    headline: "For Your Current Mood",
    button: "Listen",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/guitar.jpg",
  },
  {
    index: 3,
    headline: "Focus On The Writing",
    button: "Get Focused",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/typewriter.jpg",
  },
];

function Slide({ slide, current, handleSlideClick }) {
  const slideRef = useRef(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  function handleMouseMove(event) {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = event.clientX - (r.left + Math.floor(r.width / 2));
    const y = event.clientY - (r.top + Math.floor(r.height / 2));
    el.style.setProperty("--x", x);
    el.style.setProperty("--y", y);
  }

  function handleMouseLeave() {
    if (!slideRef.current) return;
    slideRef.current.style.setProperty("--x", 0);
    slideRef.current.style.setProperty("--y", 0);
  }

  function onImageLoad() {
    // Use React state to trigger rendering instead of mutating DOM styles.
    setImageLoaded(true);
  }

  function onClick() {
    handleSlideClick(slide.index);
  }

  const { index, headline, src, button } = slide;
  const classes = [styles.slide];
  if (current === index) classes.push(styles['slide--current']);
  else if (current - 1 === index) classes.push(styles['slide--previous']);
  else if (current + 1 === index) classes.push(styles['slide--next']);

  return (
    <li
      ref={slideRef}
      className={classes.filter(Boolean).join(' ')}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles['slide__image-wrapper']}>
        <img
          className={styles['slide__image']}
          alt={headline}
          src={src}
          onLoad={onImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </div>
      <article className={styles['slide__content']}>
        <h2 className={styles['slide__headline']}>{headline}</h2>
        <button className={styles.btn}>{button}</button>
      </article>
    </li>
  );
}

const SliderControl = ({ type, title, handleClick }) => {
  return (
    <button className={`${styles.btn} ${styles[`btn--${type}`] || ''}`} title={title} onClick={handleClick}>
      <svg className={styles.icon} viewBox="0 0 24 24">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </svg>
    </button>
  );
};

export default function ReactSliderWithHoverEffect() {
  const [current, setCurrent] = useState(0);

  function handlePreviousClick() {
    const previous = current - 1;
    setCurrent(previous < 0 ? slideData.length - 1 : previous);
  }

  function handleNextClick() {
    const next = current + 1;
    setCurrent(next === slideData.length ? 0 : next);
  }

  function handleSlideClick(index) {
    if (current !== index) setCurrent(index);
  }

  const wrapperTransform = { transform: `translateX(-${current * (100 / slideData.length)}%)` };

  return (
    <div className={styles.reactSliderRoot} aria-labelledby="slider-heading__example">
      <div className={styles.slider}>
        <ul className={styles["slider__wrapper"]} style={wrapperTransform}>
          <h3 id="slider-heading__example" className={styles.visuallyhidden}>
            Example Slider
          </h3>

          {slideData.map((s) => (
            <Slide key={s.index} slide={s} current={current} handleSlideClick={handleSlideClick} />
          ))}
        </ul>

        <div className={styles.slider__controls}>
          <SliderControl type="previous" title="Go to previous slide" handleClick={handlePreviousClick} />
          <SliderControl type="next" title="Go to next slide" handleClick={handleNextClick} />
        </div>
      </div>
    </div>
  );
}
