"use client";

import React, { useEffect, useRef } from 'react';
import styles from './ProductSwiper.module.css';

export default function ProductSwiper() {
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const paginationRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    function initSwiper() {
      try {
        if (!mounted || !window.Swiper || !containerRef.current) return;
        // Initialize Swiper with the same options as the original script.js
        // Prefer passing the DOM element directly (avoids selector issues with CSS modules)
        swiperRef.current = new window.Swiper(containerRef.current, {
          direction: 'horizontal',
          loop: true,
          effect: 'cube',
          cubeEffect: {
            slideShadows: false,
          },

          autoplay: {
            delay: 4000,
          },

          // Use pagination element reference
          pagination: {
            el: paginationRef.current,
          },

          // Use navigation element references
          navigation: {
            nextEl: nextRef.current,
            prevEl: prevRef.current,
          },
          // tell Swiper what wrapper/slide class names we use (module-scoped)
          wrapperClass: styles.swiperWrapper,
          slideClass: styles.swiperSlide,
        });
      } catch (e) {
        // swallow initialization errors (e.g. in SSR preview environments)
        // The original script is preserved behaviorally and options remain identical.
        console.error('Swiper init error', e);
      }
    }

    // If Swiper is already available on window, init immediately
    if (typeof window !== 'undefined' && window.Swiper) {
      initSwiper();
      return () => {
        mounted = false;
        if (swiperRef.current && swiperRef.current.destroy) swiperRef.current.destroy(true, true);
      };
    }

    // Otherwise, dynamically load the Swiper bundle and initialize on load
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swiper/swiper-bundle.min.js';
    script.async = true;
    script.onload = () => initSwiper();
    document.body.appendChild(script);

    return () => {
      mounted = false;
      if (swiperRef.current && swiperRef.current.destroy) swiperRef.current.destroy(true, true);
      // Do not remove the script tag to avoid reloading for other components, keep it simple.
    };
  }, []);

  return (
    <div className={styles.productRoot}>
      <header>
        <nav>
          <div className={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
              <path d="M144-264v-72h240v72H144Zm0-180v-72h432v72H144Zm0-180v-72h672v72H144Z" />
            </svg>
            <h1>store</h1>
          </div>
          <div className={styles.icons}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000" aria-label="search">
              <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000" aria-label="avatar">
              <path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" />
            </svg>
          </div>
        </nav>
      </header>

  <div ref={containerRef} className={styles.swiper}>
    <div className={styles.swiperWrapper}>
          <div className={styles.swiperSlide}>
            <div className={styles.details}>
              <h3>Black T-Shirt</h3>
              <p>$20.00 USD</p>
            </div>
            <div className="card-img">
              <img className={styles.slideImg} src="https://images.unsplash.com/photo-1618354691229-88d47f285158?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" alt="Black T-Shirt Photo by Ryan Hoffmann from Unsplash" loading="lazy" />
            </div>
          </div>
          <div className={styles.swiperSlide}>
            <div className={styles.details}>
              <h3>Black T-Shirt</h3>
              <p>$20.00 USD</p>
            </div>
            <div className="card-img">
              <img className={styles.slideImg} src="https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHQlMjBzaGlydHxlbnwwfHwwfHx8Mg%3D%3D" alt="Black T-Shirt Photo by Ryan Hoffmann from Unsplash" loading="lazy" />
            </div>
          </div>
          <div className={styles.swiperSlide}>
            <div className={styles.details}>
              <h3>Black T-Shirt</h3>
              <p>$20.00 USD</p>
            </div>
            <div className="card-img">
              <img className={styles.slideImg} src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D" alt="Black T-Shirt Photo by Ryan Hoffmann from Unsplash" loading="lazy" />
            </div>
          </div>
        </div>
        <div ref={paginationRef} className={styles.pagination} />

        <div ref={prevRef} className={styles.prevButton} />
        <div ref={nextRef} className={styles.nextButton} />
      </div>
    </div>
  );
}
