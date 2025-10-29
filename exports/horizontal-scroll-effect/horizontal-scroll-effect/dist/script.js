gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
  normalizeScroll: true
});

const splitLetters = SplitText.create(
  document.querySelector(".opacity-reveal")
);
gsap.set(splitLetters.chars, { opacity: "0.2", y: 0 });

// const horizontalDistance =
//   document.querySelector(".horizontal-section").scrollWidth -
//   window.innerWidth;
const horizontalDistance = document.querySelector(".horizontal-section")
  .scrollWidth;
const pauseDuration = 100;
const opacityDuration = 1200;
const imageStickDuration = 3000;
const splitLettersDuration = 1000;

const totalDuration =
  horizontalDistance +
  pauseDuration +
  opacityDuration +
  imageStickDuration +
  splitLettersDuration;

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-stick",
      pin: ".horizontal-wrapper",
      start: "top top",
      end: `+=${totalDuration}`,
      // markers: true,
      scrub: 1
    }
  })
  .to(splitLetters.chars, {
    opacity: "1",
    ease: "none",
    stagger: { amount: splitLettersDuration },
    duration: 1
  })
  .to(".opacity-reveal", {
    opacity: "0",
    scale: 1.2,
    duration: opacityDuration
  })
  .to(
    ".image-stick",
    {
      opacity: "1",
      rotate: 0,
      scale: 1,
      duration: imageStickDuration
    },
    "<"
  )
  .to({}, { duration: pauseDuration })
  .to(".horizontal-wrapper", {
    x: -horizontalDistance,
    ease: "none",
    duration: horizontalDistance
  })
  .to({}, { duration: pauseDuration });