"use client";

import React, { useRef, useEffect } from 'react';
import styles from './ResponsiveImageCarouselAnimation.module.css';

const initialSlides = [
  {
    id: 1,
    title: 'Lossless Youths',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
    image: 'https://cdn.mos.cms.futurecdn.net/dP3N4qnEZ4tCTCLq59iysd.jpg'
  },
  {
    id: 2,
    title: 'Estrange Bond',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
    image: 'https://i.redd.it/tc0aqpv92pn21.jpg'
  },
  {
    id: 3,
    title: 'The Gate Keeper',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
    image: 'https://wharferj.files.wordpress.com/2015/11/bio_north.jpg'
  },
  {
    id: 4,
    title: 'Last Trace Of Us',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
    image: 'https://images7.alphacoders.com/878/878663.jpg'
  },
  {
    id: 5,
    title: 'Urban Decay',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
    image: 'https://theawesomer.com/photos/2017/07/simon_stalenhag_the_electric_state_6.jpg'
  },
  {
    id: 6,
    title: 'The Migration',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
    image: 'https://da.se/app/uploads/2015/09/simon-december1994.jpg'
  }
];

export default function ResponsiveImageCarouselAnimation() {
  const sliderRef = useRef(null);

  // rotate left: move first item to end using DOM operations (mimic original script)
  function handleNext() {
    const slider = sliderRef.current;
    if (!slider) return;
    const first = slider.children[0];
    if (first) slider.appendChild(first);
  }

  // rotate right: move last item to start using DOM operations (mimic original script)
  function handlePrev() {
    const slider = sliderRef.current;
    if (!slider) return;
    const last = slider.children[slider.children.length - 1];
    if (last) slider.prepend(last);
  }


  return (
    <div className={styles.root}>
      <ul className={styles.slider} ref={sliderRef}>
        {initialSlides.map((slide) => (
          <li
            key={slide.id}
            className={styles.item}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className={styles.content}>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.description}>{slide.description}</p>
              <button>Read More</button>
            </div>
          </li>
        ))}
      </ul>

      <nav className={styles.nav}>
        <button
          type="button"
          className={`${styles.btn} prev`}
          aria-label="Previous"
          onClick={handlePrev}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.btn} next`}
          aria-label="Next"
          onClick={handleNext}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
