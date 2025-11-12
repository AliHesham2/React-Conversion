"use client";

import React, { useEffect, useRef } from 'react';
import styles from './SliderTransitions.module.css';
// Import Swiper core CSS from the installed package so layout matches the
// version of Swiper we're using (avoids mismatches with the old 3.x CSS).
import 'swiper/css';
import 'swiper/css/pagination';

// Step 2 (converted script): initialize Swiper inside a client useEffect
// This file keeps the Step 1 JSX structure but now wires the original
// `dist/script.js` behavior into React. CSS is NOT imported here.
export default function SliderTransitions() {
  const rootRef = useRef(null);

  useEffect(() => {
    let swiperInstance = null;

    // Dynamically import swiper to avoid loading it on the server.
    // Map original options to the modern swiper API where necessary.
    (async () => {
      try {
        const mod = await import('swiper');
        const Swiper = mod.default || mod.Swiper || mod;

        const containerEl = rootRef.current && rootRef.current.querySelector('.swiper-container');
        const paginationEl = rootRef.current && rootRef.current.querySelector('.swiper-pagination');
        if (!containerEl) return;

        swiperInstance = new Swiper(containerEl, {
          direction: 'vertical',
          loop: true,
          pagination: {
            el: paginationEl || '.swiper-pagination',
            clickable: true
          },
          grabCursor: true,
          speed: 1000,
          parallax: true,
          autoplay: false,
          effect: 'slide',
          // modern API uses `mousewheel` instead of mousewheelControl
          mousewheel: true
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Swiper failed to initialize in SliderTransitions:', err);
      }
    })();

    return () => {
      if (swiperInstance && typeof swiperInstance.destroy === 'function') {
        swiperInstance.destroy(true, true);
      }
    };
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>

      <div id="home-slider">
        <div className={`${styles.swiperContainer} swiper-container`}>
          <div className={`${styles.swiperWrapper} swiper-wrapper`}>
            <div className={`${styles.swiperSlide} swiper-slide swiper-slide-one`}>
              <div className={`${styles.swiperImage} swiper-image`} data-swiper-parallax-y="-20%">
                <div className={`${styles.swiperImageInner} swiper-image-inner swiper-image-left swiper-image-one`}>
                  <h1>A <span className="emphasis">Breath</span>. <br /><span>Of Fresh Air.</span></h1>
                  <p>Chapter I, page XV</p>
                </div>
              </div>
              <div className={`${styles.swiperImage} swiper-image`} data-swiper-parallax-y="35%">
                <div className={`${styles.swiperImageInner} swiper-image-inner swiper-image-right swiper-image-two`}>
                  <p className="paragraph">
                    A Prophet sat in the market-place and told the fortunes of all who cared to engage his services. Suddenly there came running up one who told him that his house had been broken into by thieves, and that they had made off with everything they could lay
                    hands on.
                  </p>
                </div>
              </div>
            </div>
            <div className={`${styles.swiperSlide} swiper-slide swiper-slide-two`}>
              <div className={`${styles.swiperImage} swiper-image`} data-swiper-parallax-y="-20%">
                <div className={`${styles.swiperImageInner} swiper-image-inner swiper-image-left swiper-image-three`}>
                  <h1>The <span className="emphasis">Drop</span>. <br /><span>Of Eternal life.</span></h1>
                  <p>Chapter II, page VII</p>
                </div>
              </div>
              <div className={`${styles.swiperImage} swiper-image`} data-swiper-parallax-y="35%">
                <div className={`${styles.swiperImageInner} swiper-image-inner swiper-image-right swiper-image-four`}>
                  <p className="paragraph">
                    A thirsty Crow found a Pitcher with some water in it, but so little was there that, try as she might, she could not reach it with her beak, and it seemed as though she would die of thirst within sight of the remedy.
                  </p>
                </div>
              </div>
            </div>
            <div className={`${styles.swiperSlide} swiper-slide swiper-slide-three`}>
              <div className={`${styles.swiperImage} swiper-image`} data-swiper-parallax-y="-20%">
                <div className={`${styles.swiperImageInner} swiper-image-inner swiper-image-left swiper-image-five`}>
                  <h1>A <span className="emphasis">Sense</span>. <br /><span>Of Things to Come.</span></h1>
                  <p>Chapter III, page XI</p>
                </div>
              </div>
              <div className={`${styles.swiperImage} swiper-image`} data-swiper-parallax-y="35%">
                <div className={`${styles.swiperImageInner} swiper-image-inner swiper-image-right swiper-image-six`}>
                  <p className="paragraph">
                    Every man carries Two Bags about with him, one in front and one behind, and both are packed full of faults. The Bag in front contains his neighbours’ faults, the one behind his own. Hence it is that men do not see their own faults, but never fail to see
                    those of others.
                  </p>
                </div>
              </div>
            </div>

          </div>
          <div className={`${styles.swiperPagination} swiper-pagination`} />
        </div>
      </div>

    </div>
  );
}
