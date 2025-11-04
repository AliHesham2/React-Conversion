"use client";

import React, { useEffect, useRef } from 'react';
import styles from './CodepenChallengeReflection.module.css';
import defaultData from '../../data/codepenChallengeReflectionData';
import gsap from 'gsap';

export default function CodepenChallengeReflection({ data = defaultData }) {
  const rootRef = useRef(null);
  const panels = data?.panels || Array.from({ length: 4 });

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;
    const panelEls = root.querySelectorAll('.panel');
    const fronts = root.querySelectorAll('.front');
    const backs = root.querySelectorAll('.back');
    const replayBtn = root.querySelector('.replay');
    const layerEl = root.querySelector('.layer');
    const headingEl = root.querySelector('.layer h1');
    const ctaEl = root.querySelector('.cta');

  const mirrorTL = gsap.timeline();
  let titleTL = null; // will be created after layout to ensure measurements are correct

    gsap.set(replayBtn, { opacity: 0 });

    const onReplay = (e) => {
      mirrorTL.restart();
      if (titleTL) titleTL.restart();
      gsap.to(e.target, 0.5, { opacity: 0 });
    };

    replayBtn && replayBtn.addEventListener('click', onReplay);

    mirrorTL
      .to(fronts, { duration: 2.5, backgroundPosition: '30px 0px', ease: 'expo.inOut' })
      .to(panelEls, { duration: 2.5, z: -300, rotationY: 180, ease: 'expo.inOut' }, '-=2.3')
      .from(
        backs,
        {
          duration: 2.5,
          backgroundPosition: '-30px 0px',
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.to(replayBtn, { duration: 1, opacity: 1 });
          }
        },
        '-=2.3'
      );

    // start mirror timeline immediately
    mirrorTL.play(0);

    // Create and start the title timeline after layout (next frame) so
    // getBoundingClientRect measurements reflect final font metrics/layout.
    // This avoids the heading sticking off-screen if fonts or layout differ.
    const startTitleAfterLayout = () => {
      // Compute a runtime-corrected target x for the heading so it centers
      // inside the overlay regardless of font metrics. The original export
      // used a static `x: 400` which can look off when fonts/metrics differ.
      let headingTargetX = 400; // fallback to original value
      try {
        if (layerEl && headingEl) {
          const layerRect = layerEl.getBoundingClientRect();
          const headingRect = headingEl.getBoundingClientRect();
          const layerCenter = layerRect.left + layerRect.width / 2;
          const headingCenter = headingRect.left + headingRect.width / 2;
          headingTargetX = layerCenter - headingCenter;
        }
      } catch (e) {
        // swallow measurement errors and keep the fallback value
      }

      titleTL = gsap.timeline();
      titleTL
        .to(root.querySelectorAll('.layer'), { duration: 1, clipPath: 'polygon(3% 0, 100% 0%, 100% 100%, 0% 100%)' })
        .to(headingEl || root.querySelectorAll('.layer h1'), { duration: 2, x: headingTargetX, ease: 'expo.inOut' }, '-=0.5')
        .to(ctaEl || root.querySelectorAll('.cta'), { duration: 2, x: 0, ease: 'expo.inOut' }, '-=2');

      titleTL.play(0);
    };

    // Use requestAnimationFrame to wait until the next frame/layout is settled.
    // If rAF isn't available, fallback to setTimeout.
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(startTitleAfterLayout);
    } else {
      setTimeout(startTitleAfterLayout, 0);
    }

    // Timelines start normally above; no debug forcing/logging here.

    return () => {
      replayBtn && replayBtn.removeEventListener('click', onReplay);
      mirrorTL.kill();
      if (titleTL) titleTL.kill();
      // nothing extra to cleanup
    };
  }, [data]);

  return (
    <div ref={rootRef} className={styles.root}>
      <header>
        <h4>{data.header?.title ?? 'REFLECTV'}</h4>
        {data.header?.links?.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </header>

      <div className="container">
        {panels.map((_, i) => (
          <div className="panel" key={i}>
            <div className="front" />
            <div className="back" />
          </div>
        ))}

        <div className="layer">
          <h1 dangerouslySetInnerHTML={{ __html: data.headingHtml || 'WE<span>ARE</span>REFLECTV' }} />

        </div>
      </div>

      <footer>
        <div className="replay">{data.replayLabel ?? 'REPLAY'}</div>
        <p dangerouslySetInnerHTML={{ __html: data.footerHtml || 'Based on this <a href="https://dribbble.com/shots/3911960-Reflet-Communication" target="blank">Dribble</a>. Not Responsive' }} />
      </footer>
    </div>
  );
}
