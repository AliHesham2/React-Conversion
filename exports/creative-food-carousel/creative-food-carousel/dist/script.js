// Swiper slider initialization function using jQuery
function initializeFashionSlider($sliderContainer) {
	const $swiperElement = $sliderContainer.find(".swiper");
	let isTransitioning = false;
	let requestID;

	// Utility to manage transitions
	function toggleTransition($element, enable = true) {
		$element.toggleClass("food-slider-no-transition", !enable);
		cancelAnimationFrame(requestID);
		if (!enable) {
			requestID = requestAnimationFrame(() => {
				$element.removeClass("food-slider-no-transition");
				isTransitioning = false;
			});
		}
	}

	let swiperInstance;

	// Handle next and previous slide actions
	function handleSlide(action) {
		if (!isTransitioning) {
			swiperInstance[action]();
		}
	}

	// Manage navigation button listeners
	function toggleNavigationListeners(swiper, enable = true) {
		const method = enable ? "on" : "off";
		$(swiper.el)
			.find(".food-slider-button-next")
			[method]("click", () => handleSlide("slideNext"));
		$(swiper.el)
			.find(".food-slider-button-prev")
			[method]("click", () => handleSlide("slidePrev"));
	}

	// Manage button disabled states
	function updateButtonStates(swiper) {
		const $prevButton = $(swiper.el).find(".food-slider-button-prev");
		const $nextButton = $(swiper.el).find(".food-slider-button-next");

		if (swiper.isBeginning) {
			$prevButton.addClass("food-slider-button-disabled");
		} else {
			$prevButton.removeClass("food-slider-button-disabled");
		}

		if (swiper.isEnd) {
			$nextButton.addClass("food-slider-button-disabled");
		} else {
			$nextButton.removeClass("food-slider-button-disabled");
		}
	}

	// Manage transition effects
	function applySlideStyles(
		$slide,
		imgScale = 1,
		titleOpacity = 1,
		duration = "1000ms"
	) {
		const $image = $slide.find("img");
		const $titleText = $slide.find(".food-slider-title-text");

		$image.css({
			transitionDuration: duration,
			transform: `scale(${imgScale})`,
		});

		$titleText.css({
			transitionDuration: duration,
			color: `${$slide.attr("data-slide-bg-color")}`,
		});
	}

	// Handle transition end event
	function onTransitionEnd(swiper, $targetSlide, callback) {
		const $targetImage = $targetSlide.find("img");
		$targetImage.on("transitionend", function handler(event) {
			if (event.target === $targetImage[0]) {
				$targetImage.off("transitionend", handler);
				if (callback) callback();
			}
		});
	}

	// Initialize swiper with parameters and event handlers
	const progressCircle = document.querySelector(".autoplay-progress svg");
	const progressContent = document.querySelector(".autoplay-progress span");
	swiperInstance = new Swiper($swiperElement[0], {
		speed: 1300,
		allowTouchMove: false,
		parallax: true,
		slidesPerView: 1,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
			renderBullet: function (index, className) {
				return `<div class="${className}"><img src="${$(this.slides[index])
					.find("img")
					.attr("src")}" /><span>${$(this.slides[index])
					.find(".food-slider-title-text")
					.text()}</span></div>`;
			},
		},
		on: {
			autoplayTimeLeft(s, time, progress) {
				progressCircle.style.setProperty("--progress", 1 - progress);
				progressContent.textContent = `${Math.ceil(time / 1000)}s`;
			},
			loopFix() {
				isTransitioning = false;
			},
			transitionStart(swiper) {
				if (swiper.params.loop && isTransitioning) return;

				isTransitioning = true;
				const $prevSlide = $(swiper.slides[swiper.previousIndex]);
				const $activeSlide = $(swiper.slides[swiper.activeIndex]);
				const $swiperEl = $(swiper.el);

				$swiperEl.css(
					"backgroundColor",
					$activeSlide.attr("data-slide-bg-color")
				);
				applySlideStyles($prevSlide, 1.2, 0, "1000ms");
				$prevSlide.find(".food-slider-scale").css("transform", "scale(0.6)");

				onTransitionEnd(swiper, $prevSlide, () => {
					applySlideStyles($activeSlide, 1.2, 1, "1300ms");
				});
			},
			transitionEnd(swiper) {
				const $activeSlide = $(swiper.slides[swiper.activeIndex]);
				applySlideStyles($activeSlide, 1);
				$activeSlide.find(".food-slider-scale").css("transform", "scale(1)");

				onTransitionEnd(swiper, $activeSlide, () => {
					isTransitioning = false;
				});
				updateButtonStates(swiper); // Update button states after transition
			},
			beforeInit(swiper) {
				toggleTransition($(swiper.el), false);
			},
			init(swiper) {
				const $activeSlide = $(swiper.slides[swiper.activeIndex]);
				$(swiper.el).css(
					"backgroundColor",
					$activeSlide.attr("data-slide-bg-color")
				);
				swiper.emit("transitionEnd");
				toggleNavigationListeners(swiper, true);
				updateButtonStates(swiper); // Set initial button states
			},
			resize(swiper) {
				toggleTransition($(swiper.el), false);
			},
			destroy(swiper) {
				toggleNavigationListeners(swiper, false);
			},
		},
	});

	return swiperInstance;
}

// Initialize the slider for the element with class "food-slider"
const $fashionSliderElement = $(".food-slider");
initializeFashionSlider($fashionSliderElement);