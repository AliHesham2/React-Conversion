# 🤖 AI Conversion Guide

## 🧠 Master Rules

* 🚫 Never edit or touch any code inside the **`exports`** folder.
* 🚫 Do NOT add new colors, styles, libraries, or extra logic.
* ✅ Conversion is **HTML/CSS/JS → React (JavaScript only)**.
* ✅ Each component must be **fully responsive** (same responsive behavior as the original, or improved only if needed to fix layout issues).
* Your goal is to **replicate the original design and behavior exactly** — no changes or simplifications.
* Always convert or replace any jQuery code with pure JavaScript or React-based solutions; jQuery is not allowed in React   
  projects.

---

## ⚙️ Conversion Steps

1. Open the file **`AiLog.md`**.

2. Go to the section **“📋 Conversion Checklist”**.

3. Find the **last item marked “✅ Done”**.

4. Start working on the **next item marked “Pending”**.

5. Go to the **`exports`** folder and find a subfolder with the same name.

6. Inside that folder, you’ll find three files:

   * `.html`
   * `.css`
   * `.js`

7. Read and understand all three files carefully:

   * How the **HTML** structure is built.
   * How the **CSS** connects to it (classes / IDs).
   * How the **JavaScript** affects it (animations, logic, events).

8. Once you fully understand it:

   * Create a new folder with the same name inside **`app/components/`**.
   * Convert everything into a **React component (JavaScript only)**.
   * Save it as **`ComponentName.js`** (not `.jsx`).
   * Keep the **CSS in a separate file** with the same name.
   * The final result must be **100% identical** to the original:

     * Same colors
     * Same fonts
     * Same animations
     * Same structure and layout
     * Same or improved **responsiveness**

9. After completing the conversion:

   * Go to the **Home** page and `import` the new component for testing.
   * Make sure the component looks and behaves the same across different screen sizes (mobile, tablet, desktop).
   * Once confirmed, open **`AiLog.md`** again and change the status from `Pending` → `Done`.

---

## 🎞️ Animation & UI Rules

* Follow the **exact same animation method** used in the original files.
* If animations are done with **CSS**, keep them as CSS keyframes or transitions.
* If animations are done with **JavaScript**, move that logic into a `useEffect` in React with the same timing and easing.
* If the original uses libraries like **GSAP**, **Anime.js**, or **Three.js**, use the **same ones** in React.



## 📦 Data & Props Rules

* 🧱 All data must be **dynamic via props**, not hardcoded.
* 🚫 Never include static text, arrays, or images directly inside the component (unless they are part of the layout itself).
* ✅ Test data should be stored inside **`/app/data/`** folder.
* ✅ Everything displayed on the UI should be controlled via props or state.
* ✅ No fetch calls, APIs, or local storage logic allowed.


---

## �📊 Progress Tracker

### Total Folders: 132
### Completed: 17
### In Progress: 0
### Pending: 115

---

## 📋 Conversion Checklist

| # | Folder Name | Status | Notes |
|---|-------------|--------|-------|
| 1 | 2-in-2021-welcome-css-stylus-pug | ✅ | Done |
| 2 | 3d-card-slidergsap | ✅ | Done |
| 3 | a-dribble-design-implementation | ✅ | Done |
| 4 | a-simple-food-card | ✅ | Done |
| 5 | add-to-cart-animation | ✅ | Done |
| 6 | anchor-navigation-to-scrolltriggered-section | ✅ | Done |
| 7 | animated-continuous-sections-with-gsap-observer | ✅ | Done |
| 8 | animated-image-slider-html-css-javascript | ✅ | Done |
| 9 | animated-slider-webpage | ✅ | Done |
| 10 | anime-js-v3-logo-animation | ✅ | Done |
| 11 | asian-food-website | ✅ | Done |
| 12 | autoplay-slider-pause-control-swiper-js | ✅ | Done | issue !!
| 13 | blob-carousel-for-the-planet | ✅ | Done | ms7tha !!
| 14 | card-carousel | ✅ | Done |
| 15 | cards-with-inverted-border-radius-scss | ✅ | Done - converted and scoped; responsive fixes applied |
| 16 | carousel-with-hover-effect | ✅ | Done - converted and mounted to homepage; scoped CSS and theme fixes; Material Symbols import fixed |
| 17 | center-mode-productivity-slider-pro-v5 | ❌ | Pending |
| 18 | circle-square-triangle-dolphin | ❌ | Pending |
| 19 | clean-slider-with-curved-background | ❌ | Pending |
| 20 | clip-path-hover-effect | ❌ | Pending |
| 21 | clip-path-revealing-slider | ❌ | Pending |
| 22 | codepen-challenge-reflection | ❌ | Pending |
| 23 | codepen-home-logo-to-header-galleryscrollsmoother-by-louis-hoebregts | ❌ | Pending |
| 24 | codepenchallenge-card-carousel | ❌ | Pending |
| 25 | contrast-text-color-on-image | ❌ | Pending |
| 26 | cpchallenge-slideshow-modern-1 | ❌ | Pending |
| 27 | cpchallenge-slideshow-modern-2 | ❌ | Pending |
| 28 | creative-food-carousel | ❌ | Pending |
| 29 | css-3d-carousel-room | ❌ | Pending |
| 30 | css-block-revealing-effect | ❌ | Pending |
| 31 | css-carousel | ❌ | Pending |
| 32 | css-carousel-with-keyboard-controls | ❌ | Pending |
| 33 | css-filtersadabtive-cards | ❌ | Pending |
| 34 | css-infinite-autoplay-carousel | ❌ | Pending |
| 35 | css-infinite-scroll-gallery | ❌ | Pending |
| 36 | css-only-image-carousel-no-really | ❌ | Pending |
| 37 | css-only-ink-splash-video-manipulation-css-effect | ❌ | Pending |
| 38 | css-only-marquee-with-slow-on-hover | ❌ | Pending |
| 39 | css-sliderpure-css10 | ❌ | Pending |
| 40 | cyber-scrollgsap | ❌ | Pending |
| 41 | draggable-masthead-reveal | ❌ | Pending |
| 42 | dynamic-carousel-slider-with-infinite-scoll | ❌ | Pending |
| 43 | dynamic-content-lockups-v2open-props | ❌ | Pending |
| 44 | expandable-animated-card-slider | ❌ | Pending |
| 45 | expanding-flex-cards | ❌ | Pending |
| 46 | eyes-mousemove | ❌ | Pending |
| 47 | fancy-slider | ❌ | Pending |
| 48 | food-card-grid-layout | ❌ | Pending |
| 49 | full-screen-slider-gsap-timeline-1 | ❌ | Pending |
| 50 | full-slider-prototype | ❌ | Pending |
| 51 | gallery-3dcssinfinitehover | ❌ | Pending |
| 52 | getting-familiar-with-anime-js-line-drawing | ❌ | Pending |
| 53 | greensock-animated-slideshow-wip | ❌ | Pending |
| 54 | gsap-infinite-draggable-image-gallery | ❌ | Pending |
| 55 | gsap-landing-page | ❌ | Pending |
| 56 | gsap-slideshow-vertical-warp-slideshow-n-1 | ❌ | Pending |
| 57 | gsap-slideshow-vertical-zoom-slideshow-n-2 | ❌ | Pending |
| 58 | gsap-slideshow-vertical-zoom-slideshow-n-3 | ❌ | Pending |
| 59 | gsap-starter-template | ❌ | Pending |
| 60 | hexa-team | ❌ | Pending |
| 61 | horizontal-parallax-sliding-slider-with-swiper-js | ❌ | Pending |
| 62 | horizontal-scroll-effect | ❌ | Pending |
| 63 | how-to-animate-a-coffee-drinking-sprite-with-scrolltrigger | ❌ | Pending |
| 64 | image-overlay-slider | ❌ | Pending |
| 65 | image-parallax | ❌ | Pending |
| 66 | image-slider-ripple-effect | ❌ | Pending |
| 67 | image-zoom-in-with-scrolltrigger | ❌ | Pending |
| 68 | interactive-project-showcase-slider-with-vertical-navigation-rtl-ltr-support | ❌ | Pending |
| 69 | interior-design | ❌ | Pending |
| 70 | intro-grid-section | ❌ | Pending |
| 71 | jumping-between-sectionsscrolltrigger | ❌ | Pending |
| 72 | linear-slider-with-splittext-effect-greensock | ❌ | Pending |
| 73 | liquid-gallerylightbox | ❌ | Pending |
| 74 | marketing-hero-sectionopen-props-v2 | ❌ | Pending |
| 75 | marquee-like-content-scrolling | ❌ | Pending |
| 76 | mother-s-day-svg-animation-responsive | ❌ | Pending |
| 77 | motion-blur-effect-using-svg-filters | ❌ | Pending |
| 78 | neuro-noise-glsl-shader | ❌ | Pending |
| 79 | no-script-accordion-animation | ❌ | Pending |
| 80 | only-css-animation-01 | ❌ | Pending |
| 81 | onscroll-animation-dynamic-content-scroll-with-scrollmagic | ❌ | Pending |
| 82 | orbital-photo-gallery | ❌ | Pending |
| 83 | page-intro-animation | ❌ | Pending |
| 84 | pair-with-css-scroll-snappingscrolltrigger | ❌ | Pending |
| 85 | parallax-bake-shop-card | ❌ | Pending |
| 86 | parallax-carousel-no-libraries | ❌ | Pending |
| 87 | parallax-headerscrolltrigger | ❌ | Pending |
| 88 | parallax-photo-carousel | ❌ | Pending |
| 89 | parallax-scene-on-scrollscrolltrigger | ❌ | Pending |
| 90 | parallax-scroll-animation | ❌ | Pending |
| 91 | perspective-zoom-effect-on-scroll | ❌ | Pending |
| 92 | pixel-per-character-scroll-words-with-css-gsap | ❌ | Pending |
| 93 | pixel-scan-effect-with-vfx-js | ❌ | Pending |
| 94 | premium-portfolio-archivepro-v2-0 | ❌ | Pending |
| 95 | pricingpure-css16 | ❌ | Pending |
| 96 | product-swiper | ❌ | Pending |
| 97 | projects-carousel | ❌ | Pending |
| 98 | pure-css-carousel | ❌ | Pending |
| 99 | pure-css-slider-with-custom-effects | ❌ | Pending |
| 100 | react-slider-w-hover-effect | ❌ | Pending |
| 101 | responsive-gsap-slider-with-button-wave-effect | ❌ | Pending |
| 102 | responsive-image-carousel-animation | ❌ | Pending |
| 103 | responsive-image-slider | ❌ | Pending |
| 104 | responsive-parallax-drag-slider-with-transparent-letters | ❌ | Pending |
| 105 | rotating-3d-gallery-image-filters | ❌ | Pending |
| 106 | scroll-to-view-galleryscrolltrigger | ❌ | Pending |
| 107 | scrollsmoother-explorationcassie-evans | ❌ | Pending |
| 108 | scrollsmoother-scrolltriggerclamp | ❌ | Pending |
| 109 | scrolltrigger-downhill-ski | ❌ | Pending |
| 110 | scrolltrigger-image-zoom | ❌ | Pending |
| 111 | shader-image-transition | ❌ | Pending |
| 112 | skewed-flexbox-panels | ❌ | Pending |
| 113 | slider-gsap-virsion-02 | ❌ | Pending |
| 114 | slider-transition-wip | ❌ | Pending |
| 115 | slider-transitions | ❌ | Pending |
| 116 | slider-with-complex-animation-and-half-collored-angled-text | ❌ | Pending |
| 117 | slider-with-progress-bar-using-setinterval | ❌ | Pending |
| 118 | slides | ❌ | Pending |
| 119 | smooth-3d-perspective-slider | ❌ | Pending |
| 120 | split-headercassie-evans | ❌ | Pending |
| 121 | splittext-words-dancing-in-3d | ❌ | Pending |
| 122 | svg-filter-text-marquees | ❌ | Pending |
| 123 | svg-text-mask-w-video-fill | ❌ | Pending |
| 124 | three-js-3d-model-animation-with-gsap-scrolltriggeruntitled | ❌ | Pending |
| 125 | timed-cards-opening | ❌ | Pending |
| 126 | velo-sliderwith-borders | ❌ | Pending |
| 127 | vertical-image-loop-with-scroll-acceleration-with-gsap | ❌ | Pending |
| 128 | voyage-slider | ❌ | Pending |
| 129 | vue-js-responsive-shuffle-image-gallery | ❌ | Pending |
| 130 | wave-rgb-image-distortion-with-shader | ❌ | Pending |
| 131 | weekly-coding-challenge-1double-slider-sign-in-up-formdesktop-only | ❌ | Pending |
| 132 | yarden-design-by-olya-marchak | ❌ | Pending |

