"use client";

import React, { useEffect, useRef } from 'react';
import styles from './FullSliderPrototype.module.css';
import { gsap } from 'gsap';

/**
 * FullSliderPrototype (clean React port)
 * - Declarative DOM (no ids, no :global)
 * - Uses CSS Modules for styling (full viewport)
 * - Ports the original animation using GSAP in a useEffect hook
 *
 * Props:
 * - slides: Array<{ src, alt, dataUrl }>
 */
export default function FullSliderPrototype({ slides = [] }) {
	const wrapperRef = useRef(null);
	const mainRefs = useRef([]);
	const bgRefs = useRef([]);
	const navRefs = useRef([]);
	const currentRef = useRef(0);
	const runningRef = useRef(true);

	// ref callbacks
	const setMainRef = (el, i) => { mainRefs.current[i] = el; };
	const setBgRef = (el, i) => { bgRefs.current[i] = el; };
	const setNavRef = (el, i) => { navRefs.current[i] = el; };

	useEffect(() => {
		if (!slides || slides.length === 0) return;
		runningRef.current = true;

		const total = slides.length;
		const sldInterval = 6000;
		const minScale = 0.7;

		// initial layout
		mainRefs.current.forEach((el, i) => {
			if (!el) return;
			el.dataset.index = i;
			el.style.zIndex = total - (i + 1);
			if (i === 0) gsap.set(el, { scale: 1.3, opacity: 0 });
			else gsap.set(el, { scale: minScale, y: -window.innerHeight });
		});

		bgRefs.current.forEach((el, i) => {
			if (!el) return;
			const img = el.querySelector('[data-bg]');
			if (img) gsap.set(img, { scale: 1.35, y: 80 });
			el.style.zIndex = 0;
			if (i === 0) {
				if (img) gsap.set(img, { scale: 1.5, y: 0 });
				el.style.zIndex = 2;
			}
		});

		// small enter animation then start slider
		const enter = gsap.timeline({ onComplete: startSlider });
		if (mainRefs.current[0]) enter.to(mainRefs.current[0], { duration: 2.5, scale: 1, opacity: 1 });
		const navEl = wrapperRef.current ? wrapperRef.current.querySelector(`.${styles.navigation}`) : null;
		if (navEl) enter.to(navEl, { duration: 1.2, opacity: 1, y: 0 }, 0.8);

		function animateNavItem(idx, onComplete) {
			const li = navRefs.current[idx];
			if (!li) { onComplete && onComplete(); return; }
			li.classList.add('active');
			const info = li.querySelector(`.${styles.liInfo}`) || li.querySelector('.li__info');
			const mask = li.querySelector(`.${styles.liInfoMask}`) || li.querySelector('.li__info-mask');
			if (info) info.style.opacity = 0.3;
			if (mask) mask.style.opacity = 1;
			const w = li.getBoundingClientRect().width;
			if (mask) mask.style.width = `${w}px`;
			gsap.to(mask, { duration: sldInterval / 1000, width: '100%', ease: 'none', onComplete });
		}

		function startSlider() {
			if (!runningRef.current) return;
			const idx = currentRef.current;
			animateNavItem(idx, slidesTransitions);
			const slide = mainRefs.current[idx];
			if (slide) slide.classList.add('active-slide');
		}

		function slidesTransitions() {
			const curr = currentRef.current;
			const next = curr < total - 1 ? curr + 1 : 0;

			const currSlide = mainRefs.current[curr];
			const nextSlide = mainRefs.current[next];
			const currBg = bgRefs.current[curr];
			const nextBg = bgRefs.current[next];
			const currNav = navRefs.current[curr];

			if (currNav) currNav.classList.remove('active');
			if (currSlide) currSlide.classList.remove('active-slide');

			const tl = gsap.timeline({
				onComplete() {
					if (currSlide) {
						gsap.killTweensOf(currSlide);
						gsap.set(currSlide, { scale: minScale, y: -window.innerHeight });
					}
					if (currBg) {
						const img = currBg.querySelector('[data-bg]');
						if (img) gsap.set(img, { scale: 1.35, y: 80 });
						currBg.style.zIndex = 0;
					}
					if (nextBg) nextBg.style.zIndex = 2;
					if ((next + 1) >= total) { if (bgRefs.current[0]) bgRefs.current[0].style.zIndex = 1; }
					else { if (bgRefs.current[next + 1]) bgRefs.current[next + 1].style.zIndex = 1; }

					currentRef.current = next;
					startSlider();
				}
			});

			if (currSlide) tl.to(currSlide, { duration: 1.5, scale: 0.8 });
			if (currBg) {
				const img = currBg.querySelector('[data-bg]');
				if (img) tl.to(img, { duration: 1.2, scale: 1.35 }, 0.15);
				tl.to(currBg, { duration: 1.2, height: '0%' }, 0.8);
			}
			if (currSlide) tl.to(currSlide, { duration: 1.2, y: window.innerHeight }, 0.8);

			if (nextSlide) tl.to(nextSlide, { duration: 1.2, y: 0 }, 0.8);
			if (nextSlide) tl.to(nextSlide, { duration: 1.5, scale: 1 }, 1.8);
			if (nextBg) {
				const img = nextBg.querySelector('[data-bg]');
				if (img) tl.to(img, { duration: 1.5, y: 0 }, 1);
				if (img) tl.to(img, { duration: 1.5, scale: 1.5 }, 1.8);
			}
		}

		return () => {
			runningRef.current = false;
			gsap.killTweensOf('*');
		};
	}, [slides]);

	return (
		<div className={styles.content} ref={wrapperRef}>
			<div className={styles.slider}>

				<div className={styles.mainImages}>
					{slides.map((s, i) => (
						<div
							key={i}
							ref={(el) => setMainRef(el, i)}
							className={styles.miImg}
							style={{ backgroundImage: `url(${s.src})` }}
						/>
					))}
				</div>

				<div className={styles.backgroundImages}>
					{slides.map((s, i) => {
						const blur = s.src.includes('.jpg') ? s.src.split('.jpg')[0] + '-blur.jpg' : s.src;
						return (
							<div key={i} ref={(el) => setBgRef(el, i)} className={styles.biImgCont}>
								<div data-bg style={{ backgroundImage: `url(${blur})` }} className={styles.biImgContImg} />
							</div>
						);
					})}
				</div>

				<div className={styles.navigation}>
					<ul>
						{slides.map((s, i) => {
							const number = String(i + 1).padStart(2, '0');
							return (
								<li key={i} ref={(el) => setNavRef(el, i)} className={styles.navItem}>
									<a href={s.dataUrl || `#${i + 1}`} aria-label={`Go to slide ${i + 1}`} />
									<div className={styles.liInfo}>
										<h5>{number}</h5>
										<h4>{s.alt}</h4>
									</div>
									<div className={styles.liInfoMask}>
										<div className={styles.maskInfoContainer}>
											<h5>{number}</h5>
											<h4>{s.alt}</h4>
										</div>
									</div>
									<div className={styles.liHoverLine}><div className={styles.l} /></div>
								</li>
							);
						})}
					</ul>
				</div>

			</div>

			<p className={styles.c}>
				Fork on <a href="https://github.com/glauber-sampaio/codepen/tree/master/fullSliderPrototype">Github</a> | Images by <a href="http://unsplash.com">Unsplash</a> | Original concept by <a href="http://www.jcsuzanne.com/">Jean-Christophe Suzanne</a> for <a href="http://hellothierry.com">Hello Thierry</a>
			</p>
		</div>
	);
}

