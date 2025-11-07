"use client";

import React, { useEffect, useRef } from 'react';
import styles from './DynamicContentLockupsV2OpenProps.module.css';

// HTML-only conversion of exports/dynamic-content-lockups-v2open-props
// Accepts `items` prop (array of { img, alt, headline, desc }) and renders
// the static structure. Behavior (scroll/animation) will be ported later.
export default function DynamicContentLockupsV2OpenProps({ items = [] }) {
	const containerRef = useRef(null);

	// Provide a lightweight JS fallback for browsers that don't support
	// CSS `animation-timeline: scroll()` used by the original demo.
	// If native timeline is supported we do nothing and let CSS drive the visuals.
	useEffect(() => {
		if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: scroll()')) {
			return; // native timeline available
		}

		const root = containerRef.current;
		if (!root) return;

		const contentNodes = Array.from(root.querySelectorAll(`.${styles.content}`));
		const cardNodes = Array.from(root.querySelectorAll(`.${styles.card}`));

		// IntersectionObserver adds/removes an "active" class on the matching
		// card when its content panel is mostly visible. This approximates the
		// original CSS timeline animations on browsers without native support.
		const io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const idx = contentNodes.indexOf(entry.target);
				if (idx === -1) return;
				const card = cardNodes[idx];
				if (!card) return;
				if (entry.isIntersecting) {
					card.classList.add(styles.cardActive ?? 'cardActive');
				} else {
					card.classList.remove(styles.cardActive ?? 'cardActive');
				}
			});
		}, { threshold: 0.55 });

		contentNodes.forEach((n) => io.observe(n));
		return () => io.disconnect();
	}, []);

	return (
		<div ref={containerRef} className={styles.section || 'section'}>
			<nav className={styles.navbar || 'navbar'}>
				<a href="#" className={styles['nav-cta-btn'] || 'nav-cta-btn'}>Get Started</a>
			</nav>

			<div className={styles['video-visual'] || 'video-visual'}>
				<video
					className={styles.video || 'video'}
					autoPlay
					loop
					muted
					poster=""
					role="none"
					aria-label="background gradient animation"
				>
					<source
						src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/bg-gradient-animation.mp4"
						type="video/mp4"
					/>
				</video>
			</div>

			<div className={styles['section-wrapper'] || 'section-wrapper'}>
				<div className={styles['content-wrapper'] || 'content-wrapper'}>
					{items.map((item, idx) => (
						<div key={idx} className={`${styles.content || 'content'} ${styles['content-' + (idx + 1)] || 'content-' + (idx + 1)}`}>
							<div className={styles['mobile-visual'] || 'mobile-visual'}>
								<img className={styles['card-img'] || 'card-img'} src={item.img} alt={item.alt} />
							</div>
							<div className={styles.meta || 'meta'}>
								<h2 className={styles.headline || 'headline'} dangerouslySetInnerHTML={{ __html: item.headline }} />
								<p className={styles.desc || 'desc'}>{item.desc}</p>
							</div>
						</div>
					))}
				</div>

				<div className={styles.visual || 'visual'}>
					<div className={styles['card-wrapper'] || 'card-wrapper'}>
						{items.map((item, idx) => (
							<div key={idx} className={`${styles.card || 'card'} ${styles['card-' + (idx + 1)] || 'card-' + (idx + 1)}`}>
								<img className={styles['card-img'] || 'card-img'} src={item.img} alt={item.alt} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
