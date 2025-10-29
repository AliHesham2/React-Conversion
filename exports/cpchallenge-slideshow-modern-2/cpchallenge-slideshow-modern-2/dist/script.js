class SlantedCarousel {
	constructor() {
		this.slides = document.querySelectorAll(".slide");
		this.navDots = document.querySelectorAll(".nav-dot");
		this.prevBtn = document.querySelector(".nav-arrow.prev");
		this.nextBtn = document.querySelector(".nav-arrow.next");
		this.progressBar = document.querySelector(".progress-bar");
		this.cursor = document.querySelector(".custom-cursor");

		this.currentSlide = 0;
		this.totalSlides = this.slides.length;
		this.isAnimating = false;
		this.autoPlayInterval = null;

		this.init();
	}

	init() {
		this.bindEvents();
		this.startAutoPlay();
		this.updateProgress();
	}

	bindEvents() {
		// Navigation arrows
		this.prevBtn.addEventListener("click", () => this.prevSlide());
		this.nextBtn.addEventListener("click", () => this.nextSlide());

		// Navigation dots
		this.navDots.forEach((dot, index) => {
			dot.addEventListener("click", () => this.goToSlide(index));
		});

		// Keyboard navigation
		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") this.prevSlide();
			if (e.key === "ArrowRight") this.nextSlide();
		});

		// Mouse events for auto-play
		document.addEventListener("mouseenter", () => this.stopAutoPlay());
		document.addEventListener("mouseleave", () => this.startAutoPlay());

		// Custom cursor
		document.addEventListener("mousemove", (e) => {
			this.cursor.style.left = e.clientX + "px";
			this.cursor.style.top = e.clientY + "px";
		});

		// Touch support
		let startX = 0;
		document.addEventListener("touchstart", (e) => {
			startX = e.touches[0].clientX;
		});

		document.addEventListener("touchend", (e) => {
			const endX = e.changedTouches[0].clientX;
			const diff = startX - endX;

			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					this.nextSlide();
				} else {
					this.prevSlide();
				}
			}
		});
	}

	goToSlide(index) {
		if (this.isAnimating || index === this.currentSlide) return;

		this.isAnimating = true;

		// Update slides
		this.slides.forEach((slide, i) => {
			slide.classList.remove("active", "prev", "next");

			if (i === index) {
				slide.classList.add("active");
			} else if (i < index) {
				slide.classList.add("prev");
			} else {
				slide.classList.add("next");
			}
		});

		// Update navigation dots
		this.navDots.forEach((dot, i) => {
			dot.classList.toggle("active", i === index);
		});

		this.currentSlide = index;
		this.updateProgress();

		setTimeout(() => {
			this.isAnimating = false;
		}, 1500);
	}

	nextSlide() {
		const next = (this.currentSlide + 1) % this.totalSlides;
		this.goToSlide(next);
	}

	prevSlide() {
		const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
		this.goToSlide(prev);
	}

	startAutoPlay() {
		this.stopAutoPlay();
		this.autoPlayInterval = setInterval(() => {
			this.nextSlide();
		}, 2000);

		this.progressBar.style.transform = "scaleX(1)";
	}

	stopAutoPlay() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = null;
		}
		this.progressBar.style.transform = "scaleX(0)";
	}

	updateProgress() {
		this.progressBar.style.transition = "none";
		this.progressBar.style.transform = "scaleX(0)";

		setTimeout(() => {
			this.progressBar.style.transition = "transform 5s linear";
			if (this.autoPlayInterval) {
				this.progressBar.style.transform = "scaleX(1)";
			}
		}, 50);
	}
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new SlantedCarousel();
});

// Add some extra visual flair
document.addEventListener("mousemove", (e) => {
	const mouseX = e.clientX / window.innerWidth;
	const mouseY = e.clientY / window.innerHeight;

	document.querySelectorAll(".slide-background").forEach((bg, i) => {
		const speed = (i + 1) * 0.5;
		const xPos = (mouseX - 0.5) * 1.5 * speed;
		const yPos = (mouseY - 0.5) * speed;

		bg.style.transform += ` translate(${xPos}px, ${yPos}px)`;
	});
});