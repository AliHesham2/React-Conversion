"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Slides.module.css";

export default function Slides() {
  const rootRef = useRef(null);

  useEffect(() => {
    // Port of exports/slides/dist/script.js scoped to this component
    const root = rootRef.current;
    if (!root) return;

    // Query elements inside this component only
    const btn1 = root.querySelector("#btn1");
    const btn2 = root.querySelector("#btn2");
    const btn3 = root.querySelector("#btn3");
    const btn4 = root.querySelector("#btn4");
    const btnsNodeList = root.querySelectorAll(".slideshow-controls button");
    const btns = Array.from(btnsNodeList);

    const leftBtn = root.querySelector(".arrow-left");
    const rightBtn = root.querySelector(".arrow-right");

    const images = Array.from(root.querySelectorAll(".image-box"));
    const backImages = Array.from(root.querySelectorAll(".background-img"));

  // Debugging: log counts so we can see what the DOM contains at runtime
  console.debug("[Slides] images:", images.length, "backImages:", backImages.length, "btns:", btns.length);

    let currentImgIndex = 0;

    // Handlers storage so we can remove them on cleanup
    const btnHandlers = [];

    // changeFoto replicates the original positioning/class toggles
    function changeFoto(id) {
      currentImgIndex = id;
      console.debug("[Slides] changeFoto ->", id);
      for (let i = 0; i < images.length; i++) {
        const pos = i - id;
        const wW = window.innerWidth;
        const oneDistance = wW * 0.4 + wW * 0.2 + 16;
        images[i].style.left = wW * 0.5 + oneDistance * pos + "px";
        if (i < 3) console.debug(`[Slides] image ${i} left ->`, images[i].style.left);
        // remove both the original global 'main' and the module-local main class
        images[i].classList.remove("main");
        images[i].classList.remove(styles.main);
        if (backImages[i]) {
          backImages[i].classList.remove("main");
          backImages[i].classList.remove(styles.main);
        }
        if (btns[i]) {
          btns[i].classList.remove("main");
          btns[i].classList.remove(styles.main);
        }
      }
      if (images[id]) {
        images[id].classList.add("main");
        images[id].classList.add(styles.main);
      }
      console.debug("[Slides] added main to image", id, "exists?", !!images[id]);
      if (backImages[id]) {
        backImages[id].classList.add("main");
        backImages[id].classList.add(styles.main);
      }
      if (btns[id]) {
        btns[id].classList.add("main");
        btns[id].classList.add(styles.main);
      }
    }

    // Attach button handlers (store refs for cleanup)
    btns.forEach((b, i) => {
      const h = () => changeFoto(i);
      b.addEventListener("click", h);
      btnHandlers.push({ el: b, handler: h });
    });

    const leftHandler = () =>
      changeFoto(currentImgIndex - 1 < 0 ? images.length - 1 : currentImgIndex - 1);
    const rightHandler = () => changeFoto((currentImgIndex + 1) % images.length);

    if (leftBtn) leftBtn.addEventListener("click", leftHandler);
    if (rightBtn) rightBtn.addEventListener("click", rightHandler);

    // requestAnimationFrame management per element
    const rafMap = new Map();

    function onElementMove(element, p) {
      let size = 0;
      if (p.x < p.center) {
        const left = p.center - p.range;
        size = (p.x - left) / (p.center - left);
      } else {
        const right = p.center + p.range;
        size = (right - p.x) / (right - p.center);
      }
      size = Math.min(Math.max(size, 0), 1);
      element.style.width = 40 + 40 * size + "%";
    }

    function checkPosition(ele) {
      let lastPosition = null;

      function loop() {
        const rect = ele.getBoundingClientRect();
        const currentPosition = {
          x: rect.left + rect.width / 2,
          center: window.innerWidth / 2,
          range: window.innerWidth * 0.4 + window.innerWidth * 0.2 + 16,
        };

        if (
          !lastPosition ||
          currentPosition.x !== lastPosition.x ||
          currentPosition.y !== lastPosition.y
        ) {
          onElementMove(ele, currentPosition);
          lastPosition = currentPosition;
        }

        const id = requestAnimationFrame(loop);
        rafMap.set(ele, id);
      }

      loop();
    }

    // Start tracking for each image
    for (const img of images) {
      checkPosition(img);
    }

    // Initialize
    changeFoto(0);

    // Cleanup: remove listeners and cancel animation frames
    return () => {
      btnHandlers.forEach(({ el, handler }) => el.removeEventListener("click", handler));
      if (leftBtn) leftBtn.removeEventListener("click", leftHandler);
      if (rightBtn) rightBtn.removeEventListener("click", rightHandler);
      for (const id of rafMap.values()) cancelAnimationFrame(id);
    };
  }, []); // run once on mount

  return (
    <section ref={rootRef} className={`slideshow-outer ${styles.root}`}>
      <div className={`slideshow-container ${styles['slideshow-container']}`}>
        <img
          src="https://images.unsplash.com/photo-1501949997128-2fdb9f6428f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjYzNTZ8&ixlib=rb-4.1.0"
          className={`background-img ${styles['background-img']}`}
        />
        <img
          src="https://images.unsplash.com/photo-1476673160081-cf065607f449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjYzOTJ8&ixlib=rb-4.1.0"
          className={`background-img ${styles['background-img']}`}
        />
        <img
          src="https://images.unsplash.com/photo-1506252374453-ef5237291d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjY0NzR8&ixlib=rb-4.1.0"
          className={`background-img ${styles['background-img']}`}
        />
        <img
          src="https://images.unsplash.com/photo-1506252374453-ef5237291d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjY0NzR8&ixlib=rb-4.1.0"
          className={`background-img ${styles['background-img']}`}
        />

        <div id="img1" className={`image-box pos0 ${styles['image-box']}`}>
          <img
            src="https://images.unsplash.com/photo-1501949997128-2fdb9f6428f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjYzNTZ8&ixlib=rb-4.1.0"
            alt="Closeup of a curling ocean wave. "
            title="photo by Jeremy Bishop for Unsplash"
            className={`slide ${styles['slide']}`}
          />
          <div className={`image-desc ${styles['image-desc']}`}>
            <h3>Closeup of a curling ocean wave</h3>
            <p>Jeremy Bishop</p>
          </div>
        </div>

        <div id="img2" className={`image-box pos1 ${styles['image-box']}`}>
          <img
            src="https://images.unsplash.com/photo-1476673160081-cf065607f449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjYzOTJ8&ixlib=rb-4.1.0"
            alt="Foamy waves gently lapping a sandy beach shore. "
            title="photo by Frank McKenna for Unsplash"
            className={`slide ${styles['slide']}`}
          />
          <div className={`image-desc ${styles['image-desc']}`}>
            <h3>Foamy waves gently lapping a sandy beach shore</h3>
            <p>Frank McKenna</p>
          </div>
        </div>

        <div id="img3" className={`image-box pos2 ${styles['image-box']}`}>
          <img
            src="https://images.unsplash.com/photo-1490365728022-deae76380607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjY0Mjd8&ixlib=rb-4.1.0"
            alt="A starfish at the shallow edge of ocean water, alone on a backdrop of white sand. "
            title=" photo by Amy Humphries for Unsplash"
            className={`slide ${styles['slide']}`}
          />
          <div className={`image-desc ${styles['image-desc']}`}>
            <h3>
              A starfish at the shallow edge of ocean water, alone on a backdrop of
              white sand
            </h3>
            <p>Amy Humphries</p>
          </div>
        </div>

        <div id="img4" className={`image-box pos2 ${styles['image-box']}`}>
          <img
            src="https://images.unsplash.com/photo-1506252374453-ef5237291d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTIyNjY0NzR8&ixlib=rb-4.1.0"
            alt="An aerial view of waves rolling onto a sandy beach. "
            title="photo by Samuel Scrimshaw for Unsplash"
            className={`slide ${styles['slide']}`}
          />
          <div className={`image-desc ${styles['image-desc']}`}>
            <h3>An aerial view of waves rolling onto a sandy beach</h3>
            <p>Samuel Scrimshaw</p>
          </div>
        </div>
      </div>

      <div className={`slideshow-controls ${styles['slideshow-controls']}`}>
        <button id="btn1" className={styles['control-dot']}></button>
        <button id="btn2" className={styles['control-dot']}></button>
        <button id="btn3" className={styles['control-dot']}></button>
        <button id="btn4" className={styles['control-dot']}></button>
      </div>
      <button className={`control-arrow arrow-left ${styles['control-arrow']} ${styles['arrow-left']}`}>
        <svg
          width="50%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button className={`control-arrow arrow-right ${styles['control-arrow']} ${styles['arrow-right']}`}>
        <svg
          width="50%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
