"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./SplittextWordsDancingIn3d.module.css";

// Converted script.js (step 2): the original animation logic has been
// adapted into a client-side React effect. This keeps the same behaviour
// but runs when the component mounts. The SplitText plugin is loaded
// dynamically from the same CDN the original used.

export default function SplittextWordsDancingIn3d() {
  const quoteRef = useRef(null);

  useEffect(() => {
    let tl;
    let mySplitText;
    let cancelled = false;

    function randomNumber(min, max) {
      return Math.floor(Math.random() * (1 + max - min) + min);
    }

    function rangeToPercent(number, min, max) {
      return (number - min) / (max - min);
    }

    const loadSplitText = () =>
      new Promise((resolve, reject) => {
        if (window.SplitText) return resolve(window.SplitText);
        const s = document.createElement("script");
        s.src = "https://assets.codepen.io/16327/SplitText3-beta.min.js?b=26";
        s.async = true;
        s.onload = () => resolve(window.SplitText || window.gsap?.SplitText);
        s.onerror = reject;
        document.body.appendChild(s);
      });

    (async () => {
      try {
        const SplitText = await loadSplitText();
        if (cancelled) return;

        // Register plugin with gsap
        try {
          gsap.registerPlugin(SplitText);
        } catch (e) {
          // plugin may already be registered; ignore
        }

        // Wait for fonts to be ready just like the original code
        if (document.fonts && document.fonts.ready) await document.fonts.ready;

        const quote = quoteRef.current || document.getElementById("quote");
        if (!quote) return;

        mySplitText = SplitText.create(quote, { type: "words" });
        tl = gsap.timeline({ delay: 0.5, repeat: 10, repeatDelay: 1 });
        const numWords = mySplitText.words.length;

        // prep the quote div for 3D goodness
        gsap.set(quote, {
          transformPerspective: 600,
          perspective: 300,
          transformStyle: "preserve-3d",
          autoAlpha: 1,
        });

        // intro sequence
        for (let i = 0; i < numWords; i++) {
          tl.from(
            mySplitText.words[i],
            { duration: 1.5, z: randomNumber(-500, 300), opacity: 0, rotationY: randomNumber(-40, 40) },
            Math.random() * 1.5
          );
        }

        tl.from(quote, { duration: tl.duration(), rotationY: 180, transformOrigin: "50% 75% 200", ease: "power2.out" }, 0);

        // randomly change z of each word, map opacity to z depth and rotate quote on y axis
        for (let i = 0; i < numWords; i++) {
          const z = randomNumber(-50, 50);
          tl.to(mySplitText.words[i], { duration: 0.5, z: z, opacity: rangeToPercent(z, -50, 50) }, "pulse");
        }
        tl.to(quote, { duration: 0.5, rotationY: 20 }, "pulse");

        // randomly change z of each word, map opacity to z depth and rotate quote on xy axis
        for (let i = 0; i < numWords; i++) {
          const z = randomNumber(-100, 100);
          tl.to(mySplitText.words[i], { duration: 0.5, z: z, opacity: rangeToPercent(z, -100, 100) }, "pulse2");
        }
        tl.to(quote, { duration: 0.5, rotationX: -35, rotationY: 0 }, "pulse2");

        // reset the quote to normal position
        tl.to(mySplitText.words, { duration: 0.5, z: 0, opacity: 1 }, "reset");
        tl.to(quote, { duration: 0.5, rotationY: 0, rotationX: 0 }, "reset");

        // add explode label 2 seconds after reset animation is done
        tl.add("explode", "+=2");
        // add explode effect
        for (let i = 0; i < numWords; i++) {
          tl.to(
            mySplitText.words[i],
            {
              duration: 0.6,
              z: randomNumber(100, 500),
              opacity: 0,
              rotation: randomNumber(360, 720),
              rotationX: randomNumber(-360, 360),
              rotationY: randomNumber(-360, 360),
            },
            "explode+=" + Math.random() * 0.2
          );
        }
      } catch (err) {
        // Don't crash the app if animation fails — log for debugging.
        // The visual will still render as plain text without animation.
        console.error("SplitText animation error:", err);
      }
    })();

    return () => {
      cancelled = true;
      try {
        if (tl) tl.kill();
      } catch (e) {}
      try {
        if (mySplitText && typeof mySplitText.revert === "function") mySplitText.revert();
      } catch (e) {}
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div id="quote" ref={quoteRef} className={styles.quote}>
        Deadlines are looming. You&apos;ve got to deliver something that looks amazing, packed with lots of whiz-bang effects that run smoothly on various machines. No time to reinvent the wheel. You need a reliable tool set that helps you live up to your reputation as a coding Rock Star.
      </div>
    </div>
  );
}
