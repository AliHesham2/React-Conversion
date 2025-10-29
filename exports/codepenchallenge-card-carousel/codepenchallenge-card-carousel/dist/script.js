document.addEventListener("DOMContentLoaded", function () {
	const carousel = document.querySelector(".carousel");
	const cards = document.querySelectorAll(".card");
	const prevBtn = document.querySelector(".prev");
	const nextBtn = document.querySelector(".next");
	const dots = document.querySelectorAll(".dot");
	const progress = document.querySelector(".progress");

	let cardIndex = 0;
	const totalCards = cards.length;
	const cardWidth = cards[0].offsetWidth;
	const cardMargin = 32; // This matches the gap in CSS
	const moveAmount = cardWidth + cardMargin;

	// Duplicate cards for infinite scrolling effect
	const carouselContent = carousel.innerHTML;
	carousel.innerHTML = carouselContent + carouselContent;

	// Initialize Intersection Observer for lazy loading
	const options = {
		root: null,
		rootMargin: "0px",
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const card = entry.target;
				card.style.opacity = 1;
				card.style.transform = "translateY(0)";
				observer.unobserve(card);

				// Preload image
				const img = card.querySelector("img");
				if (img && img.dataset.src) {
					img.src = img.dataset.src;
					delete img.dataset.src;
				}
			}
		});
	}, options);

	// Observe all cards
	document.querySelectorAll(".card").forEach((card) => {
		card.style.opacity = 0;
		card.style.transform = "translateY(30px)";
		observer.observe(card);
	});

	// Set initial progress
	updateProgress();

	nextBtn.addEventListener("click", () => {
		slideCarousel("next");
	});

	prevBtn.addEventListener("click", () => {
		slideCarousel("prev");
	});

	// Add click events to dots
	dots.forEach((dot, index) => {
		dot.addEventListener("click", () => {
			cardIndex = index;
			updateCarousel();
		});
	});

	// Auto-slide timer
	let autoSlideTimer = setInterval(() => {
		slideCarousel("next");
	}, 5000);

	// Reset timer on manual navigation
	function resetTimer() {
		clearInterval(autoSlideTimer);
		autoSlideTimer = setInterval(() => {
			slideCarousel("next");
		}, 5000);
	}

	// Handle carousel sliding
	function slideCarousel(direction) {
		if (direction === "next") {
			cardIndex = (cardIndex + 1) % totalCards;
		} else {
			cardIndex = (cardIndex - 1 + totalCards) % totalCards;
		}

		updateCarousel();
		resetTimer();
	}

	// Update carousel position and active indicators
	function updateCarousel() {
		// Move carousel
		carousel.style.transform = `translateX(-${cardIndex * moveAmount}px)`;

		// Update active dot
		dots.forEach((dot, index) => {
			dot.classList.toggle("active", index === cardIndex);
		});

		// Update progress bar
		updateProgress();

		cards.forEach((card, index) => {
			const diff = index - cardIndex;
			const cardImg = card.querySelector(".card-img img");
			if (Math.abs(diff) <= 2) {
				const translateX = diff * 10;
				cardImg.style.transform = `scale(1.05) translateX(${translateX}px)`;
			}
		});
	}

	// Update progress bar
	function updateProgress() {
		const progressWidth = ((cardIndex + 1) / totalCards) * 100;
		progress.style.width = `${progressWidth}%`;
	}

	// Touch support for mobile devices
	let touchStartX = 0;
	let touchEndX = 0;

	carousel.addEventListener("touchstart", (e) => {
		touchStartX = e.changedTouches[0].screenX;
	});

	carousel.addEventListener("touchend", (e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	});

	function handleSwipe() {
		if (touchStartX - touchEndX > 50) {
			slideCarousel("next");
		} else if (touchEndX - touchStartX > 50) {
			slideCarousel("prev");
		}
	}

	// Add hover effect to cards
	cards.forEach((card) => {
		card.addEventListener("mouseenter", () => {
			cards.forEach((c) => (c.style.opacity = 0.7));
			card.style.opacity = 1;
		});

		card.addEventListener("mouseleave", () => {
			cards.forEach((c) => (c.style.opacity = 1));
		});
	});

	// Mouse wheel support
	carousel.addEventListener("wheel", (e) => {
		e.preventDefault();
		if (e.deltaY > 0) {
			slideCarousel("next");
		} else {
			slideCarousel("prev");
		}
	});

	// Add keyboard navigation support
	document.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight") {
			slideCarousel("next");
		} else if (e.key === "ArrowLeft") {
			slideCarousel("prev");
		}
	});

	// Add animation to cards on load
	setTimeout(() => {
		cards.forEach((card, index) => {
			setTimeout(() => {
				card.style.opacity = 1;
				card.style.transform = "translateY(0)";
			}, index * 100);
		});
	}, 300);
});