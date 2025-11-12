"use client";

import React, { useEffect, useRef } from 'react';
import styles from './SvgTextMaskWithVideo.module.css';

// HTML conversion of exports/svg-text-mask-w-video-fill/dist/index.html
// Script behavior from the original `script.js` is converted here to React
// (we intentionally do not convert the stylesheet in this step).
export default function SvgTextMaskWithVideo() {
  // keep a ref to the <video> so we can control playback based on user preferences
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Match original export behavior: if the user prefers reduced motion,
    // remove autoplay and pause the video.
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion)').matches) {
        video.removeAttribute('autoplay');
        if (typeof video.pause === 'function') video.pause();
      }
    } catch (err) {
      console.error('Failed to apply reduced-motion preference to video', err);
    }
  }, []);

  return (
    <header className={styles.header}>
      <video
        className={styles.video}
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        poster="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/oceanshot.jpg"
      >
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/ocean-small.webm" />
        <source src="https://thenewcode.com/assets/videos/ocean-small.mp4" />
      </video>

      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 80" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/*
            Use userSpaceOnUse so the mask coordinates match the SVG viewBox
            (prevents percentage/objectBoundingBox unit conversion issues when
            the SVG scales). This makes the mask cover the full 285x80 viewBox
            and avoids unexpected clipping when the SVG is resized.
          */}
          <mask id="mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            {/* make the mask rect match the viewBox coordinates exactly */}
            <rect x="0" y="0" width="285" height="80" />
            <text x="72" y="50">OCEAN</text>
          </mask>
        </defs>

        <rect x="0" y="0" width="100%" height="100%" />
      </svg>
    </header>
  );
}
