"use client";

import React, { useEffect, useRef } from "react";
import styles from "./SvgTextMaskWithVideo.module.css";

// HTML-only conversion of exports/svg-text-mask-w-video-fill/dist/index.html
// NOTE: per instructions, do NOT convert or move the CSS or script.js yet —
// this component only contains the markup (converted to JSX) and will be
// mounted on the home page. Styling and JS behavior remain in the original
// export files for a later step.

export default function SvgTextMaskWithVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Converted behavior from the original script.js:
    // If the user prefers reduced motion, stop autoplay and pause the video.
    try {
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion)').matches) {
        const v = videoRef.current;
        if (v) {
          v.removeAttribute('autoplay');
          v.pause();
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <header className={styles.header}>
      <video ref={videoRef} className={styles.video} autoPlay playsInline muted loop preload="auto" poster="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/oceanshot.jpg">
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/ocean-small.webm" />
        <source src="http://thenewcode.com/assets/videos/ocean-small.mp4" />
      </video>

      {/* Inline SVG mask (kept visually hidden) — the mask is referenced by CSS
          and applied to the <video> element so the video only shows through
          the text glyphs. Text is centered using x/y 50% and anchor settings. */}
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <mask id="mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white">OCEAN</text>
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" />
      </svg>
    </header>
  );
}
