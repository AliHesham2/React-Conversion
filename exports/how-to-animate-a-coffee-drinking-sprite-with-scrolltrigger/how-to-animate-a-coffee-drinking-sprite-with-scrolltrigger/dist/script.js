gsap.registerPlugin(ScrollTrigger);

var frame_count  = 9,
    offset_value = 100;

gsap.to(".viewer", {
  backgroundPosition: (-offset_value * frame_count * 2) + "px 50%",
  ease: "steps(" + frame_count + ")", // use a stepped ease for the sprite sheet
  scrollTrigger: {
    trigger: ".scene",
    start: "top top",
    end: "+=" + (frame_count * offset_value),
    pin: true,
    scrub: true
  }
});


// 💚 This just adds the GSAP link to this pen, don't copy this bit
import { GSAPInfoBar } from "https://codepen.io/GreenSock/pen/vYqpyLg.js"
new GSAPInfoBar({ link: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/", position:'top'});
// 💚 Happy tweening!