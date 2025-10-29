gsap.to(".parallax-bg", {
  scrollTrigger: {
    scrub: 1
  }, 
  y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
  ease: "none"
});