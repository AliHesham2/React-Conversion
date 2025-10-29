gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
  normalizeScroll: true
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".zoom-container",
      start: "top top",
      end: "+=150%",
      pin: true,
      // markers: true,
      scrub: 1
    }
  })
  .to(
    ".zoom-item[data-layer='3']",
    {
      opacity: 1,
      z: 800,
      ease: "power1.inOut"
    },
    0
  )
  .to(
    ".zoom-item[data-layer='2']",
    {
      opacity: 1,
      z: 600,
      ease: "power1.inOut"
    },
    0
  )
  .to(
    ".zoom-item[data-layer='1']",
    {
      opacity: 1,
      z: 400,
      ease: "power1.inOut"
    },
    0
  )
  .to(
    ".heading",
    {
      opacity: 1,
      z: 50,
      ease: "power1.inOut"
    },
    0
  );

const splitLetters = SplitText.create(
  document.querySelector(".opacity-reveal")
);
gsap.set(splitLetters.chars, { opacity: "0.2" });

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-stick",
      pin: true,
      start: "center center",
      end: "+=1500",
      // markers: true,
      scrub: 1
    }
  })
  .to(splitLetters.chars, {
    opacity: "1",
    duration: 1,
    ease: "none",
    stagger: 1
  })
  .to({}, { duration: 10 })
  .to(".opacity-reveal", {
    opacity: "0",
    scale: 1.2,
    duration: 50
  });