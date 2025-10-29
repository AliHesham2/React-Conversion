gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
 content: "#content",
 smooth: 3,
 effects: true
});

smoother.effects("img", { speed: "auto" });

// 💚 This just adds the GSAP link to this pen, don't copy this bit
import { GSAPInfoBar } from "https://codepen.io/GreenSock/pen/vYqpyLg.js";
new GSAPInfoBar({ link: "https://gsap.com/docs/v3/Plugins/ScrollSmoother/" });
// 💚 Happy tweening!