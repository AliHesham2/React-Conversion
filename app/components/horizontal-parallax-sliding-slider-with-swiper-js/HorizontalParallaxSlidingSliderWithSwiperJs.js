import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './HorizontalParallaxSlidingSliderWithSwiperJs.module.css';

// Use Swiper core and needed modules and instantiate imperatively to match the original export
import Swiper from 'swiper/bundle';

export default function HorizontalParallaxSlidingSliderWithSwiperJs(props) {
	var slides = useMemo(function () {
		return props.slides || [];
	}, [props.slides]);

	useEffect(function () {
		// replicate original script.js behavior
		var mainSliderSelector = '.main-slider',
			navSliderSelector = '.nav-slider',
			interleaveOffset = 0.5;


		var mainSliderOptions = {
			loop: true,
			speed: 1000,
			autoplay: {
				delay: 3000,
			},
			loopAdditionalSlides: 10,
			grabCursor: true,
			watchSlidesProgress: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				init: function () {
					this.autoplay && this.autoplay.stop && this.autoplay.stop();
				},
				imagesReady: function () {
					this.el && this.el.classList && this.el.classList.remove('loading');
					this.autoplay && this.autoplay.start && this.autoplay.start();
				},
				slideChangeTransitionEnd: function () {
					var swiper = this,
						captions = swiper.el.querySelectorAll('.caption');
					for (var i = 0; i < captions.length; ++i) {
						captions[i].classList.remove('show');
					}
					var idx = swiper.activeIndex;
					if (swiper.slides[idx]) {
						var c = swiper.slides[idx].querySelector('.caption');
						c && c.classList.add('show');
					}
				},
				progress: function () {
					var swiper = this;
					for (var i = 0; i < swiper.slides.length; i++) {
						var slideProgress = swiper.slides[i].progress,
							innerOffset = swiper.width * interleaveOffset,
							innerTranslate = slideProgress * innerOffset;

						var el = swiper.slides[i].querySelector('.slide-bgimg');
						if (el) el.style.transform = 'translateX(' + innerTranslate + 'px)';
					}
				},
				touchStart: function () {
					var swiper = this;
					for (var i = 0; i < swiper.slides.length; i++) {
						swiper.slides[i].style.transition = '';
					}
				},
				setTransition: function (speed) {
					var swiper = this;
					for (var i = 0; i < swiper.slides.length; i++) {
						swiper.slides[i].style.transition = speed + 'ms';
						var bg = swiper.slides[i].querySelector('.slide-bgimg');
						if (bg) bg.style.transition = speed + 'ms';
					}
				},
			},
		};

		var mainSlider = new Swiper(mainSliderSelector, mainSliderOptions);

		var navSliderOptions = {
			loop: true,
			loopAdditionalSlides: 10,
			speed: 1000,
			spaceBetween: 5,
			slidesPerView: 5,
			centeredSlides: true,
			touchRatio: 0.2,
			slideToClickedSlide: true,
			direction: 'vertical',
			on: {
				imagesReady: function () {
					this.el && this.el.classList && this.el.classList.remove('loading');
				},
				click: function () {
					mainSlider && mainSlider.autoplay && mainSlider.autoplay.stop && mainSlider.autoplay.stop();
				},
			},
		};

		var navSlider = new Swiper(navSliderSelector, navSliderOptions);

		// Matching sliders
		try {
			mainSlider.controller && (mainSlider.controller.control = navSlider);
			navSlider.controller && (navSlider.controller.control = mainSlider);
		} catch (e) {
			// ignore
		}

		return function () {
			try {
				mainSlider && mainSlider.destroy && mainSlider.destroy(true, true);
			} catch (e) {}
			try {
				navSlider && navSlider.destroy && navSlider.destroy(true, true);
			} catch (e) {}
		};
	}, [props.slides]);

	return (
		<>
			<div className={'swiper-container main-slider loading'}>
				<div className="swiper-wrapper">
					{slides.map(function (s, i) {
						return (
							<div className="swiper-slide" key={i}>
								<figure className="slide-bgimg" style={{ backgroundImage: 'url(' + (s.image || '') + ')' }}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={s.image || ''} className="entity-img" alt={s.title || 'slide'} />
								</figure>
								<div className="content">
									<p className="title">{s.title || ''}</p>
									<span className={"caption" + (i === 0 ? ' show' : '')}>{s.caption || ''}</span>
								</div>
							</div>
						);
					})}
				</div>
				<div className="swiper-button-prev swiper-button-white" />
				<div className="swiper-button-next swiper-button-white" />
			</div>

			<div className={'swiper-container nav-slider loading'}>
				<div className="swiper-wrapper" role="navigation">
					{slides.map(function (s, i) {
						return (
							<div className="swiper-slide" key={'nav-' + i}>
								<figure className="slide-bgimg" style={{ backgroundImage: 'url(' + (s.image || '') + ')' }}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={s.image || ''} className="entity-img" alt={s.title || 'thumb'} />
								</figure>
								<div className="content">
									<p className="title">{s.title || ''}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

HorizontalParallaxSlidingSliderWithSwiperJs.propTypes = {
	slides: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			caption: PropTypes.string,
			image: PropTypes.string,
		})
	),
};

HorizontalParallaxSlidingSliderWithSwiperJs.defaultProps = { slides: [] };

