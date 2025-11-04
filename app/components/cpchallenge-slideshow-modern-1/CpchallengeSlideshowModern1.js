"use client";

import React, { useEffect, useRef, useState } from "react";
import "./CpchallengeSlideshowModern1.css";

export default function CpchallengeSlideshowModern1({ data = [] }) {
  const totalSlides = data.length;
  const [slideIndex, setSlideIndex] = useState(0); // controls background slide
  const [contentIndex, setContentIndex] = useState(0); // controls central content
  const [isScrolling, setIsScrolling] = useState(false);

  const numberRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);

  const touchStartY = useRef(0);
  const autoRef = useRef(null);

  // Update central content with exit + enter animations (matches original timing)
  function updateContent(index) {
    // trigger exit animation
    [numberRef, titleRef, descRef, buttonRef].forEach((r) => {
      if (r.current) r.current.style.animation = "fadeOutDown 0.4s ease-in forwards";
    });

    // after exit, update content and trigger enter animations
    setTimeout(() => {
      setContentIndex(index);

      if (numberRef.current)
        numberRef.current.style.animation = "slideInFromTop 0.8s ease-out 0.2s forwards";
      if (titleRef.current)
        titleRef.current.style.animation = "bounceIn 1s ease-out 0.4s forwards";
      if (descRef.current)
        descRef.current.style.animation = "fadeInUp 0.8s ease-out 0.6s forwards";
      if (buttonRef.current)
        buttonRef.current.style.animation = "floatIn 0.8s ease-out 0.8s forwards";
    }, 400);
  }

  function showSlide(index) {
    const normalized = ((index % totalSlides) + totalSlides) % totalSlides;
    setSlideIndex(normalized); // immediate background change
    updateContent(normalized); // content changes after animation
  }

  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  function prevSlide() {
    showSlide(slideIndex - 1);
  }

  useEffect(() => {
    function onWheel(e) {
      if (isScrolling) return;
      setIsScrolling(true);
      if (e.deltaY > 0) nextSlide();
      else prevSlide();

      setTimeout(() => setIsScrolling(false), 800);
    }

    function onTouchStart(e) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (isScrolling) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;
      if (Math.abs(diff) > 50) {
        setIsScrolling(true);
        if (diff > 0) nextSlide();
        else prevSlide();
        setTimeout(() => setIsScrolling(false), 800);
      }
    }

    function onKey(e) {
      if (isScrolling) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") nextSlide();
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") prevSlide();
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    // auto-advance
    autoRef.current = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      if (autoRef.current) clearInterval(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex, isScrolling, totalSlides]);

  // no-op debug removed

  // handle dot clicks
  function onDotClick(idx) {
    if (isScrolling) return;
    showSlide(idx);
  }

  const content = data[contentIndex] || {};

  return (
    <div className="cpch-wrapper">
      {/* fixed background that follows active slide to avoid z-index/stacking issues */}
      {data[slideIndex] && (
        <>
          <div className="cpch-fixedBg" style={{ backgroundImage: `url("${data[slideIndex].image}")` }} />
          <div className="cpch-fixedOverlay" />
        </>
      )}

      <div className="cpch-slideshow-container">
        {data.map((d, i) => (
          <div key={i} className={`cpch-slide ${i === slideIndex ? "active" : ""}`}>
            <div className="cpch-bgLayer" style={{ backgroundImage: `url("${d.image}")` }} />
            <div className="cpch-blur-element" />
            <div className="cpch-blur-element" />
            <div className="cpch-blur-element" />
          </div>
        ))}
      </div>

      <div className="cpch-central-content">
        <div className="cpch-portfolio-item">
          <div className="cpch-portfolio-number" id="portfolioNumber" ref={numberRef}>
            {content.number}
          </div>
          <h2 className="cpch-portfolio-title" id="portfolioTitle" ref={titleRef}>
            {content.title}
          </h2>
          <p className="cpch-portfolio-description" id="portfolioDescription" ref={descRef}>
            {content.description}
          </p>
          <a className="cpch-portfolio-button" ref={buttonRef} href="#">
            View Project
          </a>
        </div>
      </div>

      <div className="cpch-nav-dots">
        {data.map((_, i) => (
          <div key={i} className={`cpch-dot ${i === slideIndex ? "active" : ""}`} onClick={() => onDotClick(i)} />
        ))}
      </div>

      <div className="cpch-scroll-indicator">Scroll to explore ↓</div>
    </div>
  );
    }

