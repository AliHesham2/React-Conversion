"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./TimedCardsOpening.module.css";

// static data moved to module scope so useEffect doesn't need it as a dependency
const TIMED_CARDS_DATA = [
  {
    place: "Switzerland Alps",
    title: "SAINT",
    title2: "ANTONIEN",
    description:
      "Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.",
    image: "https://assets.codepen.io/3685267/timed-cards-1.jpg",
  },
  {
    place: "Japan Alps",
    title: "NANGANO",
    title2: "PREFECTURE",
    description:
      "Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country's best powder.",
    image: "https://assets.codepen.io/3685267/timed-cards-2.jpg",
  },
  {
    place: "Sahara Desert - Morocco",
    title: "MARRAKECH",
    title2: "MEROUGA",
    description:
      "The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.",
    image: "https://assets.codepen.io/3685267/timed-cards-3.jpg",
  },
  {
    place: "Sierra Nevada - USA",
    title: "YOSEMITE",
    title2: "NATIONAL PARAK",
    description:
      "Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.",
    image: "https://assets.codepen.io/3685267/timed-cards-4.jpg",
  },
  {
    place: "Tarifa - Spain",
    title: "LOS LANCES",
    title2: "BEACH",
    description:
      "Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach's long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.",
    image: "https://assets.codepen.io/3685267/timed-cards-5.jpg",
  },
  {
    place: "Cappadocia - Turkey",
    title: "Göreme",
    title2: "Valley",
    description:
      "Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.",
    image: "https://assets.codepen.io/3685267/timed-cards-6.jpg",
  },
];

// HTML-only conversion of exports/timed-cards-opening/dist/index.html
// NOTE: per instructions, CSS and script.js are NOT converted here.
// This component reproduces the original HTML structure as JSX so you can
// iterate on behavior and styling in separate steps.
export default function TimedCardsOpening() {
  const mounted = useRef(true);

  const data = TIMED_CARDS_DATA;

  useEffect(() => {
      mounted.current = true;

      // helper to reference gsap-set
      const set = gsap.set;

    function getCard(index) {
      return `#card${index}`;
    }
    function getCardContent(index) {
      return `#card-content-${index}`;
    }
    function getSliderItem(index) {
      return `#slide-item-${index}`;
    }

    const ease = "sine.inOut";

    let order = [0, 1, 2, 3, 4, 5];
    let detailsEven = true;

    let offsetTop = 200;
    let offsetLeft = 700;
    let cardWidth = 200;
    let cardHeight = 300;
    let gap = 40;
    let numberSize = 50;

    function animate(target, duration, properties) {
      return new Promise((resolve) => {
        gsap.to(target, {
          ...properties,
          duration: duration,
          onComplete: resolve,
        });
      });
    }

    function init() {
      const [active, ...rest] = order;
      const detailsActive = detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
      const { innerHeight: height, innerWidth: width } = window;
      offsetTop = height - 430;
      offsetLeft = width - 830;
      // position pagination using ID (IDs remain unchanged)
      gsap.set("#pagination", {
        top: offsetTop + 330,
        left: offsetLeft,
        y: 200,
        opacity: 0,
        zIndex: 60,
      });

      // nav -> scoped class
      gsap.set(`.${styles.nav}`, { y: -200, opacity: 0 });

      gsap.set(getCard(active), {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
      gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
      gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
      gsap.set(`${detailsInactive} .${styles.text}`, { y: 100 });
      gsap.set(`${detailsInactive} .${styles['title-1']}`, { y: 100 });
      gsap.set(`${detailsInactive} .${styles['title-2']}`, { y: 100 });
      gsap.set(`${detailsInactive} .${styles.desc}`, { y: 50 });
      gsap.set(`${detailsInactive} .${styles.cta}`, { y: 60 });

      gsap.set(`.${styles['progress-sub-foreground']}`, {
        width: 500 * (1 / order.length) * (active + 1),
      });

      rest.forEach((i, index) => {
        gsap.set(getCard(i), {
          x: offsetLeft + 400 + index * (cardWidth + gap),
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
        });
        gsap.set(getCardContent(i), {
          x: offsetLeft + 400 + index * (cardWidth + gap),
          zIndex: 40,
          y: offsetTop + cardHeight - 100,
        });
        gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
      });

      gsap.set(`.${styles.indicator}`, { x: -window.innerWidth });

      const startDelay = 0.6;

      gsap.to(`.${styles.cover}`, {
        x: width + 400,
        delay: 0.5,
        ease,
        onComplete: () => {
          setTimeout(() => {
            loop();
          }, 500);
        },
      });
      rest.forEach((i, index) => {
        gsap.to(getCard(i), {
          x: offsetLeft + index * (cardWidth + gap),
          zIndex: 30,
          delay: 0.05 * index,
          ease,
          delay: startDelay,
        });
        gsap.to(getCardContent(i), {
          x: offsetLeft + index * (cardWidth + gap),
          zIndex: 40,
          delay: 0.05 * index,
          ease,
          delay: startDelay,
        });
      });
      gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
      gsap.to(`.${styles.nav}`, { y: 0, opacity: 1, ease, delay: startDelay });
      gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
    }

    let clicks = 0;

    function step() {
      return new Promise((resolve) => {
        order.push(order.shift());
        detailsEven = !detailsEven;

        const detailsActive = detailsEven ? "#details-even" : "#details-odd";
        const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

        const detailsActiveEl = document.querySelector(detailsActive);
        if (detailsActiveEl) {
          const placeEl = detailsActiveEl.querySelector(`.${styles.text}`);
          if (placeEl) placeEl.textContent = data[order[0]].place;
          const title1El = detailsActiveEl.querySelector(`.${styles['title-1']}`);
          if (title1El) title1El.textContent = data[order[0]].title;
          const title2El = detailsActiveEl.querySelector(`.${styles['title-2']}`);
          if (title2El) title2El.textContent = data[order[0]].title2;
          const descEl = detailsActiveEl.querySelector(`.${styles.desc}`);
          if (descEl) descEl.textContent = data[order[0]].description;
        }

        gsap.set(detailsActive, { zIndex: 22 });
        gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
        gsap.to(`${detailsActive} .${styles.text}`, {
          y: 0,
          delay: 0.1,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .${styles['title-1']}`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .${styles['title-2']}`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .${styles.desc}`, {
          y: 0,
          delay: 0.3,
          duration: 0.4,
          ease,
        });
        gsap.to(`${detailsActive} .${styles.cta}`, {
          y: 0,
          delay: 0.35,
          duration: 0.4,
          onComplete: resolve,
          ease,
        });
        gsap.set(detailsInactive, { zIndex: 12 });

        const [active, ...rest] = order;
        const prv = rest[rest.length - 1];

        gsap.set(getCard(prv), { zIndex: 10 });
        gsap.set(getCard(active), { zIndex: 20 });
        gsap.to(getCard(prv), { scale: 1.5, ease });

        gsap.to(getCardContent(active), {
          y: offsetTop + cardHeight - 10,
          opacity: 0,
          duration: 0.3,
          ease,
        });
        gsap.to(getSliderItem(active), { x: 0, ease });
        gsap.to(getSliderItem(prv), { x: -numberSize, ease });
        gsap.to(`.${styles['progress-sub-foreground']}`, {
          width: 500 * (1 / order.length) * (active + 1),
          ease,
        });

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          ease,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          onComplete: () => {
            const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
            gsap.set(getCard(prv), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              zIndex: 30,
              borderRadius: 10,
              scale: 1,
            });

            gsap.set(getCardContent(prv), {
              x: xNew,
              y: offsetTop + cardHeight - 100,
              opacity: 1,
              zIndex: 40,
            });
            gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

            gsap.set(detailsInactive, { opacity: 0 });
            gsap.set(`${detailsInactive} .text`, { y: 100 });
            gsap.set(`${detailsInactive} .title-1`, { y: 100 });
            gsap.set(`${detailsInactive} .title-2`, { y: 100 });
            gsap.set(`${detailsInactive} .desc`, { y: 50 });
            gsap.set(`${detailsInactive} .cta`, { y: 60 });
            clicks -= 1;
            if (clicks > 0) {
              step();
            }
          },
        });

        rest.forEach((i, index) => {
          if (i !== prv) {
            const xNew = offsetLeft + index * (cardWidth + gap);
            gsap.set(getCard(i), { zIndex: 30 });
            gsap.to(getCard(i), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              ease,
              delay: 0.1 * (index + 1),
            });

            gsap.to(getCardContent(i), {
              x: xNew,
              y: offsetTop + cardHeight - 100,
              opacity: 1,
              zIndex: 40,
              ease,
              delay: 0.1 * (index + 1),
            });
            gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
          }
        });
      });
    }

    async function loop() {
      if (!mounted.current) return;
      await animate(`.${styles.indicator}`, 2, { x: 0 });
      await animate(`.${styles.indicator}`, 0.8, { x: window.innerWidth, delay: 0.3 });
      set(`.${styles.indicator}`, { x: -window.innerWidth });
      await step();
      if (mounted.current) loop();
    }

    async function loadImage(src) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    async function loadImages() {
      const promises = data.map(({ image }) => loadImage(image));
      return Promise.all(promises);
    }

    async function start() {
      try {
        await loadImages();
        init();
      } catch (error) {
        console.error("One or more images failed to load", error);
      }
    }

    start();

    // cleanup on unmount
    return () => {
      mounted.current = false;
      try {
        gsap.killTweensOf("*");
      } catch (e) {}
    };
    // --- end converted script logic ---
  }, [data]);

  return (
    <div className={styles.root}>
      <div className={styles.indicator}></div>

      <nav className={styles.nav}>
        <div>
          <div className={styles['svg-container']}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </div>
          <div>Globe Express</div>
        </div>
        <div>
          <div className={styles.active}>Home</div>
          <div>Holidays</div>
          <div>Destinations</div>
          <div>Flights</div>
          <div>Offers</div>
          <div>Contact</div>
          <div className={styles['svg-container']}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <div className={styles['svg-container']}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </nav>

  <div id="demo">
        {data.map((item, index) => (
          <div
            key={`card-${index}`}
            id={`card${index}`}
            className={styles.card}
            style={{ backgroundImage: `url(${item.image})` }}
          />
        ))}

        {data.map((item, index) => (
          <div key={`card-content-${index}`} id={`card-content-${index}`} className={styles['card-content']}>
            <div className={styles['content-start']}></div>
            <div className={styles['content-place']}>{item.place}</div>
            <div className={styles['content-title-1']}>{item.title}</div>
            <div className={styles['content-title-2']}>{item.title2}</div>
          </div>
        ))}
      </div>

      <div className={styles.details} id="details-even">
        <div className={styles['place-box']}>
          <div className={styles.text}>Switzerland Alps</div>
        </div>
        <div className={styles['title-box-1']}>
          <div className={styles['title-1']}>SAINT</div>
        </div>
        <div className={styles['title-box-2']}>
          <div className={styles['title-2']}>ANTONIEN</div>
        </div>
        <div className={styles.desc}>
          Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It&apos;s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.
        </div>
        <div className={styles.cta}>
          <button className={styles.bookmark}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className={styles.discover}>Discover Location</button>
        </div>
      </div>

      <div className={styles.details} id="details-odd">
        <div className={styles['place-box']}>
          <div className={styles.text}>Switzerland Alps</div>
        </div>
        <div className={styles['title-box-1']}>
          <div className={styles['title-1']}>SAINT </div>
        </div>
        <div className={styles['title-box-2']}>
          <div className={styles['title-2']}>ANTONIEN</div>
        </div>
        <div className={styles.desc}>
          Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It&apos;s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.
        </div>
        <div className={styles.cta}>
          <button className={styles.bookmark}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className={styles.discover}>Discover Location</button>
        </div>
      </div>

      <div className={styles.pagination} id="pagination">
        <div className={styles.arrow}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </div>
        <div className={styles.arrow}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
        <div className={styles['progress-sub-container']}>
          <div className={styles['progress-sub-background']}>
            <div className={styles['progress-sub-foreground']}></div>
          </div>
        </div>
        <div className={styles['slide-numbers']} id="slide-numbers">
          {data.map((_, i) => (
            <div key={i} id={`slide-item-${i}`} className={styles.item}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cover}></div>
    </div>
  );
}
