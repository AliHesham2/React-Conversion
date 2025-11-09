// The file is being created as a new React component.
"use client";

import React, { useEffect } from 'react';
import styles from './OnscrollAnimationDynamicContentScrollWithScrollmagic.module.css';

/*
	Converted HTML-only (JSX) from the original export.
	Note: CSS and script.js are intentionally NOT converted or imported here per the user's request.
*/
export default function OnscrollAnimationDynamicContentScrollWithScrollmagic() {
	useEffect(() => {
		let lenis = null;
		let rafId = null;
		let controller = null;
		let lenisScrollHandler = null;
		
		let wheelHandler = null;
		let lastRafLog = 0;

		// Initialize Lenis (smooth scroll) and start RAF loop
		const initLenis = async () => {
			try {
				const mod = await import('@studio-freight/lenis');
				const Lenis = mod.default || mod;
				lenis = new Lenis();
				if (typeof window !== 'undefined') {
					console.info('[Onscroll] Lenis initialized');
					// expose for debugging so you can inspect available properties in the console
					try {
						window.lenis = lenis;
						// log candidate numeric properties (not too verbose)
						const keys = Object.keys(lenis || {}).slice(0, 50);
						console.debug('[Onscroll] lenis keys:', keys);
						const candidates = ['scroll', 'scrollY', 'y', 'current', 'position', '_scroll', '__scroll'];
						const found = {};
						for (const k of candidates) {
							if (k in lenis) found[k] = lenis[k];
						}
						console.debug('[Onscroll] lenis numeric candidates:', found);
					} catch (e) {
						/* ignore */
					}
				}
				// attach a placeholder scroll handler; we'll attach the ScrollMagic sync
				// once the controller exists
				lenis.on && lenis.on('scroll', () => {
					// no-op placeholder
				});

				const raf = (time) => {
					try {
						lenis.raf(time);
					} catch (e) {
						/* ignore */
					}
					// Ensure ScrollMagic updates each frame so pinned scenes follow Lenis virtual scroll
					// Throttled debug log to verify RAF is running
					try {
						if (typeof window !== 'undefined' && performance.now() - lastRafLog > 500) {
							lastRafLog = performance.now();
							console.debug('[Onscroll] raf tick, scrollY=', window.scrollY);
						}
					} catch (e) {
						/* ignore */
					}
					try {
						if (controller && typeof controller.update === 'function') controller.update();
					} catch (e) {
						/* ignore */
					}
					rafId = requestAnimationFrame(raf);
				};
				rafId = requestAnimationFrame(raf);
			} catch (e) {
				// Lenis not available or failed to load — skip
				 console.warn('Lenis failed to load', e);
			}
		};

		// Scroll button move toggle
		const scrollToggle = () => {
			const box = document.querySelector('.scrollBtn');
			if (!box) return;
			if (window.scrollY > 0) box.classList.add('move');
			else box.classList.remove('move');
		};

		// Preloader and loader-video behavior
		const handleLoad = () => {
			const preloader = document.getElementById('preloader');
			const firstText = document.getElementById('first-text');
			const secondText = document.getElementById('second-text');
			const loaderVideo = document.getElementById('loaderVideo');

			if (firstText) firstText.style.opacity = '1';

			setTimeout(() => {
				if (firstText) firstText.style.opacity = '0';
				if (secondText) secondText.style.opacity = '1';
			}, 1000);

			setTimeout(() => {
				if (preloader) preloader.style.display = 'none';
			}, 4000);

			// loader video animations
			document.body.classList.add('overflow-hidden');
			document.documentElement.classList.add('overflow-hidden');

			setTimeout(() => {
				if (!loaderVideo) return;
				loaderVideo.style.width = '90%';
				loaderVideo.style.height = '90%';
				loaderVideo.style.transform = 'translate(-50%, -50%)';
				loaderVideo.style.top = '50%';
				loaderVideo.style.left = '50%';
				loaderVideo.style.position = 'fixed';
				loaderVideo.style.borderRadius = '12px';
			}, 2000);

			setTimeout(() => {
				if (!loaderVideo) return;
				try {
					if (window.matchMedia('(max-width: 576px)').matches) {
						loaderVideo.style.width = '220px';
						loaderVideo.style.height = '220px';
						loaderVideo.style.top = '25%';
						loaderVideo.style.left = '24px';
						loaderVideo.style.right = 'auto';
						loaderVideo.style.transform = 'translate(0%, -25%)';
					} else if (window.matchMedia('(max-width: 767px)').matches) {
						loaderVideo.style.width = '220px';
						loaderVideo.style.height = '220px';
						loaderVideo.style.left = 'auto';
						loaderVideo.style.right = '40px';
						loaderVideo.style.transform = 'translate(0%, -50%)';
					} else if (window.matchMedia('(max-width: 991px)').matches) {
						loaderVideo.style.width = '310px';
						loaderVideo.style.height = '310px';
						loaderVideo.style.left = 'auto';
						loaderVideo.style.right = '40px';
						loaderVideo.style.transform = 'translate(0%, -50%)';
					} else if (window.matchMedia('(max-width: 1199px)').matches) {
						loaderVideo.style.width = '400px';
						loaderVideo.style.height = '400px';
						loaderVideo.style.left = 'auto';
						loaderVideo.style.right = '60px';
						loaderVideo.style.transform = 'translate(0%, -50%)';
					} else if (window.matchMedia('(max-width: 1399px)').matches) {
						loaderVideo.style.width = '450px';
						loaderVideo.style.height = '450px';
						loaderVideo.style.left = 'auto';
						loaderVideo.style.right = '80px';
						loaderVideo.style.transform = 'translate(0%, -50%)';
					} else {
						loaderVideo.style.width = '500px';
						loaderVideo.style.height = '500px';
						loaderVideo.style.top = '50%';
						loaderVideo.style.left = 'auto';
						loaderVideo.style.right = '100px';
						loaderVideo.style.transform = 'translate(0%, -50%)';
						loaderVideo.style.position = 'absolute';
					}
				} catch (e) {
					// ignore matchMedia errors
				}

				document.body.classList.remove('overflow-hidden');
				document.documentElement.classList.remove('overflow-hidden');
			}, 3000);
		};

		// Initialize ScrollMagic scenes (dynamically import to avoid SSR issues)
		const initScrollMagic = async () => {
			try {
				const ScrollMagicModule = await import('scrollmagic');
				const ScrollMagic = ScrollMagicModule.default || ScrollMagicModule;
				controller = new ScrollMagic.Controller({ loglevel: 3 });

				// Make ScrollMagic use Lenis when scrolling programmatically
				try {
					// override scrollTo so ScrollMagic's controller.scrollTo uses Lenis if available
					controller.scrollTo(function (target) {
						try {
							if (lenis && typeof lenis.scrollTo === 'function') {
								// Lenis supports element or number targets
								lenis.scrollTo(target);
								return;
							}
						} catch (e) {
							/* ignore */
						}
						// fallback to native
						if (typeof target === 'number') {
							window.scrollTo({ top: target, behavior: 'smooth' });
						} else if (target && target instanceof Element) {
							target.scrollIntoView({ behavior: 'smooth' });
						}
					});

					// override scrollPos to read Lenis' virtual position when available
					controller.scrollPos(function () {
						try {
							// Try a number of possible Lenis properties (depends on version)
							if (lenis) {
								const props = ['scroll', 'scrollY', 'y', 'current', 'position', '_scroll', '__scroll'];
								for (const p of props) {
									if (p in lenis && typeof lenis[p] === 'number') return lenis[p];
								}
								// some versions provide a getter method
								if (typeof lenis.scrollTo === 'function' && typeof lenis.getScroll === 'function') {
									const v = lenis.getScroll();
									if (typeof v === 'number') return v;
								}
							}
						} catch (e) {
							/* ignore */
						}
						return window.scrollY || document.documentElement.scrollTop || 0;
					});
				} catch (e) {
					/* ignore override errors */
				}

				// create scenes to pin each section's .pinWrapper
				try {
					new ScrollMagic.Scene({
						triggerElement: '#section2',
						triggerHook: 'onEnter',
						duration: '100%'
					}).setPin('#section1 .pinWrapper', { pushFollowers: false }).addTo(controller);

					new ScrollMagic.Scene({
						triggerElement: '#section2',
						triggerHook: 'onEnter',
						duration: '200%'
					}).setPin('#section2 .pinWrapper', { pushFollowers: false }).addTo(controller);

					new ScrollMagic.Scene({
						triggerElement: '#section3',
						triggerHook: 'onEnter',
						duration: '200%'
					}).setPin('#section3 .pinWrapper', { pushFollowers: false }).addTo(controller);

					new ScrollMagic.Scene({
						triggerElement: '#section4',
						triggerHook: 'onEnter',
						duration: '100%'
					}).setPin('#section4 .pinWrapper', { pushFollowers: false }).addTo(controller);
				} catch (e) {
					// ignore scene errors
				}
			} catch (e) {
				// ScrollMagic failed to import — skip
				 console.warn('ScrollMagic failed to load', e);
			}
		};

		// After both are initialized, sync Lenis scroll events to ScrollMagic so
		// virtual scrolling updates ScrollMagic's internal state.
		const tryAttachLenisScrollSync = () => {
			if (lenis && controller) {
				lenisScrollHandler = () => {
					try {
						controller.update();
					} catch (e) {
						/* ignore */
					}
				};
				if (lenis.on) lenis.on('scroll', lenisScrollHandler);
			}
		};

		// Wire up listeners
		initLenis();
		initScrollMagic();
		// give async inits a tick then try to attach sync
		setTimeout(tryAttachLenisScrollSync, 50);
		window.addEventListener('scroll', scrollToggle);

		// Wheel handler to debug incoming wheel events
		wheelHandler = (e) => {
			console.debug('[Onscroll] wheel deltaY=', e.deltaY, ' scrollY=', window.scrollY);
		};
		window.addEventListener('wheel', wheelHandler, { passive: true });

		// load handlers — may have already fired
		if (document.readyState === 'complete') {
			handleLoad();
		} else {
			window.addEventListener('load', handleLoad);
		}

		// ensure we run scrollToggle once to set initial state
		scrollToggle();

		// cleanup
		return () => {
			window.removeEventListener('scroll', scrollToggle);
			window.removeEventListener('load', handleLoad);
			if (rafId) cancelAnimationFrame(rafId);
			try {
				if (controller && typeof controller.destroy === 'function') controller.destroy(true);
			} catch (e) {
				/* ignore */
			}
			try {
				if (lenis && lenis.off && lenisScrollHandler) lenis.off('scroll', lenisScrollHandler);
			} catch (e) {
				/* ignore */
			}
			try {
				if (wheelHandler) window.removeEventListener('wheel', wheelHandler);
			} catch (e) {
				/* ignore */
			}

			try {
				if (lenis && typeof lenis.destroy === 'function') lenis.destroy();
			} catch (e) {
                 console.warn('cleanup', e);
				/* ignore */
			}
		};
	}, []);

	return (
		<>
			<section className="events-page">
				<div id="section1" className={`${styles.event} event`}>
					<div className={`${styles.pinWrapper} pinWrapper`}>
						<div className={`${styles.text} text`}>
							<h2>Living</h2>
							<p>Explore our range of stylish and comfortable living room furniture.</p>
						</div>
						<div className={`${styles.image} image`} id="loaderVideo">
							<video autoPlay loop muted playsInline>
								<source src="https://www.yudiz.com/codepen/studio-r/bg-video.mp4" type="video/mp4" />
							</video>
						</div>
						{/* Video */}
					</div>
					<div className={`${styles.scrollBtn} scrollBtn`}>
						<h6>scroll</h6>
						<span></span>
					</div>
				</div>
				{/* Section 01 */}

				<div id="section2" className={`${styles.event} event`}>
					<div className={`${styles.pinWrapper} pinWrapper`}>
						<div className={`${styles.text} text`}>
							<h2>Kitchen</h2>
							<p>Check out our modern and functional kitchen furniture and accessories.</p>
						</div>
						<div className={`${styles.image} image`}></div>
					</div>
				</div>
				{/* Section 02 */}

				<div id="section3" className={`${styles.event} event`}>
					<div className={`${styles.pinWrapper} pinWrapper`}>
						<div className={`${styles.text} text`}>
							<h2>Bedroom</h2>
							<p>Discover our collection of bedroom furniture to create your dream space.</p>
						</div>
						<div className={`${styles.image} image`}></div>
					</div>
				</div>
				{/* Section 03 */}

				<div id="section4" className={`${styles.event} event`}>
					<div className={`${styles.pinWrapper} pinWrapper`}>
						<div className={`${styles.text} text`}>
							<h2>Office</h2>
							<p>Find the perfect office furniture to make your workspace comfortable and productive.</p>
						</div>
						<div className={`${styles.image} image`}></div>
					</div>
				</div>
				{/* Section 04 */}
			</section>

			{/* Loader */}
			<div id="preloader">
				<div className={`${styles['text-wrapper']} text-wrapper`}>
					<h1 id="first-text">Studio R</h1>
					<h3 id="second-text">Creative Agency</h3>
				</div>
			</div>
		</>
	);
}
