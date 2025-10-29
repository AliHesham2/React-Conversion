"use client";

import React from 'react';
import styles from './WelcomeIntro.module.css';
import { welcomeIntroText } from '../../data';

const WelcomeIntro = ({ text = welcomeIntroText }) => {
  // Split text into array of characters for animation
  const chars = text.split("");
  
  return (
    <section className={styles.container}>
      {/* Background panels */}
      <div className={`${styles.background} ${styles.background0}`}></div>
      <div className={`${styles.background} ${styles.background1}`}></div>
      <div className={`${styles.background} ${styles.background2}`}></div>
      <div className={`${styles.background} ${styles.background3}`}></div>
      <div className={`${styles.background} ${styles.background4}`}></div>
      <div className={`${styles.background} ${styles.background5}`}></div>
      <div className={`${styles.background} ${styles.background6}`}></div>
      <div className={`${styles.background} ${styles.background7}`}></div>
      
      {/* Main content */}
      <div className={styles.criterion}>
        {/* Text content passed as prop */}
        {chars.map((char, index) => (
          <div key={index} className={`${styles.text} ${styles[`text${index}`]}`}>
            {char}
          </div>
        ))}
        
        {/* Frames */}
        <div className={`${styles.frame} ${styles.frame0}`}></div>
        <div className={`${styles.frame} ${styles.frame1}`}></div>
        <div className={`${styles.frame} ${styles.frame2}`}></div>
        <div className={`${styles.frame} ${styles.frame3}`}></div>
        <div className={`${styles.frame} ${styles.frame4}`}></div>
        <div className={`${styles.frame} ${styles.frame5}`}></div>
        <div className={`${styles.frame} ${styles.frame6}`}></div>
        <div className={`${styles.frame} ${styles.frame7}`}></div>
        
        {/* Particles */}
        {[...Array(12)].map((_, i) => (
          <div key={`p0${i}`} className={`${styles.particle} ${styles[`particle0${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p1${i}`} className={`${styles.particle} ${styles[`particle1${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p2${i}`} className={`${styles.particle} ${styles[`particle2${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p3${i}`} className={`${styles.particle} ${styles[`particle3${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p4${i}`} className={`${styles.particle} ${styles[`particle4${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p5${i}`} className={`${styles.particle} ${styles[`particle5${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p6${i}`} className={`${styles.particle} ${styles[`particle6${i}`]}`}></div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`p7${i}`} className={`${styles.particle} ${styles[`particle7${i}`]}`}></div>
        ))}
      </div>
    </section>
  );
};

export default WelcomeIntro;