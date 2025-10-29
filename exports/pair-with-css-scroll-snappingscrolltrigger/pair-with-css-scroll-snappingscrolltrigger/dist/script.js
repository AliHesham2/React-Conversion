gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  toggleActions: "restart pause resume pause",
  scroller: ".container"
});

gsap.to(".flair", {
  scrollTrigger: ".purple", 
  duration: 2, 
  rotation: 360
});

gsap.to(".bg", {
  scrollTrigger: {
    trigger: ".bg",
    toggleActions: "restart pause reverse pause"
  }, 
  duration: 1, 
  backgroundColor: "#fffce1", 
  color: "#201f1f", 
});

gsap.to(".yoyo p", {
  scrollTrigger: ".yoyo", 
  scale: 2, 
  repeat: -1, 
  yoyo: true, 
  ease: "power2"
});