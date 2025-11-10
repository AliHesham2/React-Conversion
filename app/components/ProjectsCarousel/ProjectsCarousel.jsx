"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ProjectsCarousel.module.css";

export default function ProjectsCarousel() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // Ported behavior from exports/projects-carousel/projects-carousel/dist/script.js
    // Keep DOM-based updates here and clean up listeners on unmount.
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const cards = Array.from(track.children);
    const nextButton = container.querySelector(`.${styles.next}`);
    const prevButton = container.querySelector(`.${styles.prev}`);
    const indicators = container.querySelectorAll(`.${styles.indicator}`);

    // Local mapping for modifier classes (module-scoped)
    const cls = {
      isActive: styles.isActive,
      isPrev: styles.isPrev,
      isNext: styles.isNext,
      isFarPrev: styles.isFarPrev,
      isFarNext: styles.isFarNext,
      activeIndicator: styles.active,
    };

    let currentIndex = 0;
    let cardWidth = cards[0]?.offsetWidth || 0;
    let cardMargin = cards[0]
      ? parseInt(window.getComputedStyle(cards[0]).marginRight) * 2
      : 0;

    // Debounce helper
    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    function initializeCarousel() {
      cardWidth = cards[0].offsetWidth;
      cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight) * 2;

      const initialOffset = container.offsetWidth / 2 - cardWidth / 2;
      track.style.transform = `translateX(${initialOffset}px)`;
      updateCarousel();
    }

    function updateCarousel() {
      cards.forEach((card, index) => {
          card.classList.remove(
            cls.isActive,
            cls.isPrev,
            cls.isNext,
            cls.isFarPrev,
            cls.isFarNext
          );

          if (index === currentIndex) {
            card.classList.add(cls.isActive);
          } else if (index === currentIndex - 1) {
            card.classList.add(cls.isPrev);
          } else if (index === currentIndex + 1) {
            card.classList.add(cls.isNext);
          } else if (index < currentIndex - 1) {
            card.classList.add(cls.isFarPrev);
          } else if (index > currentIndex + 1) {
            card.classList.add(cls.isFarNext);
          }
      });

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle(cls.activeIndicator, index === currentIndex);
      });
    }

    function moveToSlide(targetIndex) {
      if (targetIndex < 0 || targetIndex >= cards.length) return;

      const amountToMove = targetIndex * (cardWidth + cardMargin);
      const containerCenter = container.offsetWidth / 2;
      const cardCenter = cardWidth / 2;
      const targetTranslateX = containerCenter - cardCenter - amountToMove;

      track.style.transform = `translateX(${targetTranslateX - 25}px)`;
      currentIndex = targetIndex;
      updateCarousel();

      // subtle flash
      const flashEffect = document.createElement("div");
      flashEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(56, 189, 248, 0.1);
                z-index: 30;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;
      container.appendChild(flashEffect);

      setTimeout(() => {
        flashEffect.style.opacity = "0.3";
        setTimeout(() => {
          flashEffect.style.opacity = "0";
          setTimeout(() => {
            if (flashEffect.parentElement) container.removeChild(flashEffect);
          }, 200);
        }, 100);
      }, 10);
    }

    // Event listeners
    const onNext = () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < cards.length) moveToSlide(nextIndex);
    };
    const onPrev = () => {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) moveToSlide(prevIndex);
    };

    if (nextButton) nextButton.addEventListener("click", onNext);
    if (prevButton) prevButton.addEventListener("click", onPrev);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
      const handler = () => moveToSlide(index);
      indicator.addEventListener("click", handler);
      // store handler for cleanup
      indicator._handler = handler;
    });

    // Drag / swipe
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    function getPositionX(event) {
      return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
      if (!isDragging) return;
      track.style.transform = `translateX(${currentTranslate}px)`;
      animationID = requestAnimationFrame(animation);
    }

    function dragStart(event) {
      isDragging = true;
      startPos = getPositionX(event);

      const transformMatrix = window
        .getComputedStyle(track)
        .getPropertyValue("transform");
      if (transformMatrix !== "none") {
        currentTranslate = parseInt(transformMatrix.split(",")[4]);
      } else {
        currentTranslate = 0;
      }
      prevTranslate = currentTranslate;
      track.style.transition = "none";
      animationID = requestAnimationFrame(animation);
      track.style.cursor = "grabbing";
    }

    function drag(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        const moveX = currentPosition - startPos;
        currentTranslate = prevTranslate + moveX;
      }
    }

    function dragEnd() {
      if (!isDragging) return;

      cancelAnimationFrame(animationID);
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      track.style.transition = "transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1)";
      track.style.cursor = "grab";

      const threshold = cardWidth / 3.5;

      if (movedBy < -threshold && currentIndex < cards.length - 1) {
        moveToSlide(currentIndex + 1);
      } else if (movedBy > threshold && currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      } else {
        moveToSlide(currentIndex);
      }
    }

    track.addEventListener("mousedown", dragStart);
    track.addEventListener("touchstart", dragStart, { passive: true });
    track.addEventListener("mousemove", drag);
    track.addEventListener("touchmove", drag, { passive: true });
    track.addEventListener("mouseup", dragEnd);
    track.addEventListener("mouseleave", dragEnd);
    track.addEventListener("touchend", dragEnd);

    // Keyboard navigation
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (currentIndex < cards.length - 1) moveToSlide(currentIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (currentIndex > 0) moveToSlide(currentIndex - 1);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Resize handler
    const onResize = debounce(() => {
      initializeCarousel();
      moveToSlide(currentIndex);
    }, 250);
    window.addEventListener("resize", onResize);

    // Hover glitch effects and other per-card listeners
    const cardHoverHandlers = [];
    cards.forEach((card) => {
      const mouseEnter = function () {
        if (!card.classList.contains(cls.isActive)) return;

        const glitchEffect = () => {
          if (!card.matches(":hover") || !card.classList.contains(cls.isActive)) return;

          const xOffset = Math.random() * 4 - 2;
          const yOffset = Math.random() * 4 - 2;

          card.style.transform = `scale(1) translate(${xOffset}px, ${yOffset}px)`;

          const r = Math.random() * 10 - 5;
          const g = Math.random() * 10 - 5;
          const b = Math.random() * 10 - 5;

          card.style.boxShadow = `
                        ${r}px 0 0 rgba(255, 0, 0, 0.2),
                        ${g}px 0 0 rgba(0, 255, 0, 0.2),
                        ${b}px 0 0 rgba(0, 0, 255, 0.2),
                        0 15px 25px rgba(0, 0, 0, 0.5),
                        0 0 40px var(--glow-primary)
                    `;

          setTimeout(() => {
            if (!card.matches(":hover") || !card.classList.contains(cls.isActive)) return;
            card.style.boxShadow = "0 15px 25px rgba(0, 0, 0, 0.5), 0 0 40px var(--glow-primary)";
          }, 50);

          if (Math.random() > 0.7) {
            setTimeout(glitchEffect, Math.random() * 1000 + 500);
          }
        };

        setTimeout(glitchEffect, 500);
      };

      const mouseLeave = function () {
        if (card.classList.contains(cls.isActive)) {
          card.style.boxShadow = "0 15px 25px rgba(0, 0, 0, 0.5), 0 0 40px var(--glow-primary)";
        }
      };

      card.addEventListener("mouseenter", mouseEnter);
      card.addEventListener("mouseleave", mouseLeave);
      cardHoverHandlers.push({ card, mouseEnter, mouseLeave });
    });

    // Active card animations
    function animateActiveCard() {
      const activeCard = container.querySelector(`.${styles.carouselCard}.${styles.isActive}`);
      if (!activeCard) return;

      const scanLine = document.createElement("div");
      scanLine.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                height: 2px;
                width: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(56, 189, 248, 0.8), 
                    rgba(56, 189, 248, 0.8), 
                    transparent
                );
                opacity: 0.7;
                z-index: 10;
                pointer-events: none;
                animation: scanAnimation 2s ease-in-out;
            `;

      const style = document.createElement("style");
      style.textContent = `
                @keyframes scanAnimation {
                    0% { top: 0; }
                    75% { top: calc(100% - 2px); }
                    100% { top: calc(100% - 2px); opacity: 0; }
                }
            `;
      document.head.appendChild(style);

  const imageContainer = activeCard.querySelector(`.${styles.cardImageContainer}`);
      imageContainer.appendChild(scanLine);

      setTimeout(() => {
        imageContainer.removeChild(scanLine);
        if (style.parentElement) document.head.removeChild(style);
      }, 2000);
    }

    function animateDataCounter() {
      const activeCard = container.querySelector(`.${styles.carouselCard}.${styles.isActive}`);
      if (!activeCard) return;

      const statsElement = activeCard.querySelector(`.${styles.cardStats}`);
      const completionText = statsElement.lastElementChild.textContent;
      const percentageMatch = completionText.match(/(\d+)%/);

      if (percentageMatch) {
        const targetPercentage = parseInt(percentageMatch[1]);
        let currentPercentage = 0;

        statsElement.lastElementChild.textContent = "0% COMPLETE";

        const interval = setInterval(() => {
          currentPercentage += Math.ceil(targetPercentage / 15);

          if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(interval);
          }

          statsElement.lastElementChild.textContent = `${currentPercentage}% COMPLETE`;
        }, 50);

  const progressBar = activeCard.querySelector(`.${styles.progressValue}`);
        progressBar.style.width = "0%";

        setTimeout(() => {
          progressBar.style.transition =
            "width 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)";
          progressBar.style.width = `${targetPercentage}%`;
        }, 100);
      }
    }

    function handleCardActivation() {
      animateActiveCard();
      animateDataCounter();

      setTimeout(() => {
        const progressBars = container.querySelectorAll(`.${styles.progressValue}`);
        progressBars.forEach((bar) => {
          bar.style.transition = "none";
        });
      }, 1000);
    }

    // Floating animation helper
    function addFloatingEffect() {
      cards.forEach((card, index) => {
        const delay = index * 0.2;
        card.style.animation = `floating 4s ease-in-out ${delay}s infinite`;
      });

      const floatingKeyframes = `
                @keyframes floating {
                    0% { transform: translateY(0px) rotate3d(0, 1, 0, 0deg); }
                    50% { transform: translateY(-10px) rotate3d(0, 1, 0, 1deg); }
                    100% { transform: translateY(0px) rotate3d(0, 1, 0, 0deg); }
                }
            `;

      const style = document.createElement("style");
      style.textContent = floatingKeyframes;
      document.head.appendChild(style);
    }

    // MutationObserver to detect active card changes
    let previousActive = null;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const target = mutation.target;
          if (target.classList.contains(cls.isActive) && target !== previousActive) {
            previousActive = target;
            handleCardActivation();
          }
        }
      });
    });

    cards.forEach((card) => {
      observer.observe(card, { attributes: true });
    });

    // Keyboard animation feedback and indicator pulse handlers
    const keyFeedback = (e) => {
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        const button = e.key === "ArrowRight" || e.key === "ArrowDown" ? nextButton : prevButton;
        if (!button) return;
        button.style.transform = "translateY(-50%) scale(1.2)";
        button.style.boxShadow = "0 0 30px var(--glow-primary)";

        setTimeout(() => {
          button.style.transform = "translateY(-50%) scale(1)";
          button.style.boxShadow = "";
        }, 200);
      }
    };
    document.addEventListener("keydown", keyFeedback);

    indicators.forEach((indicator) => {
      const clickHandler = () => {
        indicator.style.transform = "scale(1.3)";
        indicator.style.boxShadow = "0 0 15px #38bdf8";

        setTimeout(() => {
          indicator.style.transform = "";
          indicator.style.boxShadow = "";
        }, 300);
      };
      indicator.addEventListener("click", clickHandler);
      indicator._pulseHandler = clickHandler;
    });

    // Initialize
    initializeCarousel();
    moveToSlide(2);

    const activationTimeout = setTimeout(() => {
      handleCardActivation();

      const ambient = setInterval(() => {
        if (Math.random() > 0.5) animateActiveCard();
      }, 8000);
      // store ambient interval for cleanup
      container._ambientInterval = ambient;
    }, 500);

    // Cleanup on unmount
    return () => {
      if (nextButton) nextButton.removeEventListener("click", onNext);
      if (prevButton) prevButton.removeEventListener("click", onPrev);
      indicators.forEach((indicator) => {
        if (indicator._handler) indicator.removeEventListener("click", indicator._handler);
        if (indicator._pulseHandler) indicator.removeEventListener("click", indicator._pulseHandler);
        delete indicator._handler;
        delete indicator._pulseHandler;
      });
      track.removeEventListener("mousedown", dragStart);
      track.removeEventListener("touchstart", dragStart);
      track.removeEventListener("mousemove", drag);
      track.removeEventListener("touchmove", drag);
      track.removeEventListener("mouseup", dragEnd);
      track.removeEventListener("mouseleave", dragEnd);
      track.removeEventListener("touchend", dragEnd);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keydown", keyFeedback);
      window.removeEventListener("resize", onResize);

      cardHoverHandlers.forEach(({ card, mouseEnter, mouseLeave }) => {
        card.removeEventListener("mouseenter", mouseEnter);
        card.removeEventListener("mouseleave", mouseLeave);
      });

      observer.disconnect();
      clearTimeout(activationTimeout);
      if (container._ambientInterval) clearInterval(container._ambientInterval);
    };
  }, []);

  return (
    <div className={styles.carouselWrapper}>
      <div ref={containerRef} className={styles.carouselContainer}>
        <div ref={trackRef} className={styles.carouselTrack}>
        <div className={styles.carouselCard}>
          <div className={styles.cardImageContainer}>
            <Image
              src="https://picsum.photos/320/200?t=1"
              alt="Synthwave City"
              width={320}
              height={200}
              className={styles.cardImage}
            />
          </div>
          <div className={styles.cardContent}>
            <h3
              className={`${styles.cardTitle} text-xl font-bold text-cyan-400`}
              data-text="Project Alpha"
            >
              Project Alpha
            </h3>
            <p className={styles.cardDescription}>
              Exploring the neon-drenched landscapes of a digital frontier. AI-driven
              procedural generation creates infinite cityscapes.
            </p>
            <div className={styles.cardProgress}>
              <div className={styles.progressValue} style={{ width: "65%" }}></div>
            </div>
            <div className={styles.cardStats}>
              <span>PHASE II</span>
              <span>65% COMPLETE</span>
            </div>
          </div>
          <div className={styles.techDetails}>
            <div className={styles.techTag}>Neural Networks</div>
            <div className={styles.techTag}>Voxel Systems</div>
            <div className={styles.techTag}>Quantum Rendering</div>
          </div>
        </div>

        <div className={styles.carouselCard}>
          <div>
            <div className={styles.cardImageContainer}>
              <Image
                src="https://picsum.photos/320/200?t=2"
                alt="Neuro Interface"
                width={320}
                height={200}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <h3
                className={`${styles.cardTitle} text-xl font-bold text-blue-400`}
                data-text="Neuro-Link UI"
              >
                Neuro-Link UI
              </h3>
              <p className={styles.cardDescription}>
                Designing intuitive interfaces for brain-computer interaction.
                Holographic elements respond to neural patterns.
              </p>
              <div className={styles.cardProgress}>
                <div className={styles.progressValue} style={{ width: "42%" }}></div>
              </div>
              <div className={styles.cardStats}>
                <span>PHASE I</span>
                <span>42% COMPLETE</span>
              </div>
            </div>
            <div className={styles.techDetails}>
              <div className={styles.techTag}>BCI Framework</div>
              <div className={styles.techTag}>Gesture Recognition</div>
              <div className={styles.techTag}>Thought Mapping</div>
            </div>
          </div>
        </div>

        <div className={styles.carouselCard}>
          <div className={styles.cardImageContainer}>
            <Image
              src="https://picsum.photos/320/200?t=3"
              alt="Quantum Core"
              width={320}
              height={200}
              className={styles.cardImage}
            />
          </div>
          <div className={styles.cardContent}>
            <h3
              className={`${styles.cardTitle} text-xl font-bold text-purple-400`}
              data-text="Quantum Entanglement"
            >
              Quantum Entanglement
            </h3>
            <p className={styles.cardDescription}>
              Visualizing complex quantum states through advanced rendering
              techniques. Real-time simulation of parallel realities.
            </p>
            <div className={styles.cardProgress}>
              <div className={styles.progressValue} style={{ width: "89%" }}></div>
            </div>
            <div className={styles.cardStats}>
              <span>PHASE III</span>
              <span>89% COMPLETE</span>
            </div>
          </div>
          <div className={styles.techDetails}>
            <div className={styles.techTag}>Q-Bit Architecture</div>
            <div className={styles.techTag}>Multiverse Modeling</div>
            <div className={styles.techTag}>Probability Fields</div>
          </div>
        </div>

        <div className={styles.carouselCard}>
          <div className={styles.cardImageContainer}>
            <Image
              src="https://picsum.photos/320/200?t=4"
              alt="Orbital Station"
              width={320}
              height={200}
              className={styles.cardImage}
            />
          </div>
          <div className={styles.cardContent}>
            <h3
              className={`${styles.cardTitle} text-xl font-bold text-amber-400`}
              data-text="Project Chimera"
            >
              Project Chimera
            </h3>
            <p className={styles.cardDescription}>
              Developing next-gen propulsion systems for deep space exploration.
              Fusion drive concepts push beyond known physics.
            </p>
            <div className={styles.cardProgress}>
              <div className={styles.progressValue} style={{ width: "51%" }}></div>
            </div>
            <div className={styles.cardStats}>
              <span>PHASE II</span>
              <span>51% COMPLETE</span>
            </div>
          </div>
          <div className={styles.techDetails}>
            <div className={styles.techTag}>Dark Energy Capture</div>
            <div className={styles.techTag}>Plasma Containment</div>
            <div className={styles.techTag}>Gravitational Lensing</div>
          </div>
        </div>

        <div className={styles.carouselCard}>
          <div className={styles.cardImageContainer}>
            <Image
              src="https://picsum.photos/320/200?t=5"
              alt="Data Stream"
              width={320}
              height={200}
              className={styles.cardImage}
            />
          </div>
          <div className={styles.cardContent}>
            <h3
              className={`${styles.cardTitle} text-xl font-bold text-emerald-400`}
              data-text="Aether Network"
            >
              Aether Network
            </h3>
            <p className={styles.cardDescription}>
              Building a decentralized data network leveraging quantum blockchain
              and next-gen P2P technology.
            </p>
            <div className={styles.cardProgress}>
              <div className={styles.progressValue} style={{ width: "78%" }}></div>
            </div>
            <div className={styles.cardStats}>
              <span>PHASE III</span>
              <span>78% COMPLETE</span>
            </div>
          </div>
          <div className={styles.techDetails}>
            <div className={styles.techTag}>Quantum Encryption</div>
            <div className={styles.techTag}>Self-Healing Nodes</div>
            <div className={styles.techTag}>Data Holograms</div>
          </div>
        </div>
      </div>

      <button className={`${styles.carouselButton} ${styles.prev}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>

      </button>
      <button className={`${styles.carouselButton} ${styles.next}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <div className={styles.carouselIndicators}>
        <div className={`${styles.indicator} ${styles.active}`}></div>
        <div className={styles.indicator}></div>
        <div className={styles.indicator}></div>
        <div className={styles.indicator}></div>
        <div className={styles.indicator}></div>
      </div>
      </div>
    </div>
  );
}
