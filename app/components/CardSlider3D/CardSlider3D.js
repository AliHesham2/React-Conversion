"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CardSlider3D.module.css';
import { cardSliderData } from '../../data';

const CardSlider3D = ({ cards = cardSliderData }) => {
  const sliderRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to split text into spans for each character
  const splitTextIntoSpans = (element) => {
    if (!element) return;

    const text = element.innerText;
    const splitText = text
      .split("")
      .map(char => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
      .join("");
    element.innerHTML = splitText;
  };

  // Function to initialize the cards
  const initializeCards = () => {
    if (!sliderRef.current) return;

    const cardElements = sliderRef.current.querySelectorAll(`.${styles.card}`);
    gsap.to(cardElements, {
      y: i => -15 + 15 * i + "%",
      z: i => 15 * i,
      duration: 1,
      ease: "cubic",
      stagger: -0.1
    });
  };

  // Handle click event to advance the slider
  const handleClick = () => {
    if (isAnimating || !sliderRef.current) return;

    setIsAnimating(true);
    const slider = sliderRef.current;
    const cardElements = Array.from(slider.querySelectorAll(`.${styles.card}`));
    const lastCard = cardElements.pop(); // Remove the last card
    const nextCard = cardElements[cardElements.length - 1]; // Get the next card

    // Animate the last card to move downwards and fade out
    gsap.to(lastCard.querySelectorAll("h1 span"), {
      y: 200,
      duration: 0.75,
      ease: "cubic"
    });

    gsap.to(lastCard, {
      y: "+=150%",
      duration: 0.75,
      ease: "cubic",
      onComplete: () => {
        // When animation completes, prepend the last card to the slider
        slider.prepend(lastCard);
        // Reinitialize the cards
        initializeCards();
        // Reset the position of span elements within the last card
        gsap.set(lastCard.querySelectorAll("h1 span"), { y: -200 });

        // Set isAnimating to false after a delay
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }
    });

    // Animate the next card to move upwards and fade in
    gsap.to(nextCard.querySelectorAll("h1 span"), {
      y: 0,
      duration: 1,
      ease: "cubic",
      stagger: 0.05
    });
  };

  useEffect(() => {
    // Register the custom cubic easing
    gsap.registerPlugin({
      name: "cubic",
      getRatio: () => 0.5,
      init: function() {
        this.updateRatio = function() {
          this.ratio = gsap.parseEase("0.83, 0, 0.17, 1")(this.ratio);
        };
      }
    });

    if (!sliderRef.current) return;

    // Initialize the cards first
    initializeCards();

    // Split text into spans for h1 elements with class 'copy'
    const titleElements = sliderRef.current.querySelectorAll(`.${styles.title}`);
    titleElements.forEach(element => splitTextIntoSpans(element));

    // Set initial position for span elements within h1
    const allSpans = sliderRef.current.querySelectorAll(`.${styles.title} span`);
    gsap.set(allSpans, { y: -200 });

    // Set the last card's text to visible
    const lastCardSpans = sliderRef.current.querySelectorAll(`.${styles.card}:last-child .${styles.title} span`);
    gsap.set(lastCardSpans, { y: 0 });
  }, []);

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.slider} ref={sliderRef}>
        {cards.map((card, index) => (
          <div className={styles.card} key={index}>
            <img src={card.imageUrl} alt="" />
            <div className={styles.copy}>
              <h1 className={styles.title}>{card.title}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSlider3D;