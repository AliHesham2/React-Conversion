import React, { useState, useEffect, useRef } from 'react';
import styles from './DribbleDesign.module.css';

const DribbleDesign = () => {
  const [sliderIndex, setSliderIndex] = useState(1);
  const timeoutRef = useRef(null);
  const coversRef = useRef([]);
  const layersRef = useRef([]);

  const changeCoverAnimState = (state = 0) => {
    const st = state === 1 ? 'running' : 'paused';
    coversRef.current.forEach(cover => {
      // Set animation play state
      cover.style.animationPlayState = st;
      // Also manually adjust width for compatibility
      if (cover.querySelector('.cover')) {
        cover.querySelector('.cover').style.width = `${state * 100}%`;
      }
    });
  };

  const switchLayer = (step = 1) => {
    const nextSlide = (sliderIndex + step) % 3 === 0 ? 3 : (sliderIndex + step) % 3;

    changeCoverAnimState(1);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      changeCoverAnimState(0);
    }, 500);

    layersRef.current.forEach(layer => {
      layer.classList.remove(styles.layerDisplayed);
      layer.classList.remove(styles.layerDisplayedExit);
      if (layer.dataset.scene == nextSlide) {
        layer.classList.add(styles.layerDisplayed);
      }
      if (layer.dataset.scene == sliderIndex) {
        layer.classList.add(styles.layerDisplayedExit);
      }
    });
    setSliderIndex(nextSlide);
  };

  useEffect(() => {
    // Initialize refs after component mounts
    coversRef.current = document.querySelectorAll(`.${styles.photoFrame}`);
    layersRef.current = document.querySelectorAll(`.${styles.layer}`);
    
    // Initialize animation state
    coversRef.current.forEach(cover => {
      cover.style.animationPlayState = 'paused';
    });
    
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.heroLeft}>
        <h1>NITRO</h1>
        <div className={styles.layers}>
          <div className={`${styles.layer} ${styles.layerDisplayed}`} data-scene="1">
            <span>THE CANNON</span>
            <div className={styles.layerImage} style={{backgroundImage: "url('http://pngimg.com/uploads/snowboard/snowboard_PNG8008.png')"}}></div>
            <div className={styles.layerInfo}>
              <div>
                <strong>Size</strong>
                <strong>Shape</strong>
                <strong>Camber</strong>
                <strong>Width</strong>
                <strong>Flex</strong>
                <strong>Sidecut</strong>
              </div>
              <div>
                <span>123m</span>
                <span>TAPPERED SWALLONTAIL</span>
                <span>TRUE</span>
                <span>MID-WIDE</span>
                <span>ALL TERRAIN</span>
                <span>PROGRESSIVE</span>
              </div>
            </div>
          </div>
          <div className={styles.layer} data-scene="2">
            <span>THE POW</span>
            <div className={styles.layerImage} style={{backgroundImage: "url('http://pngimg.com/uploads/snowboard/snowboard_PNG8006.png')"}}></div>
            <div className={styles.layerInfo}>
              <div>
                <strong>Size</strong>
                <strong>Shape</strong>
                <strong>Camber</strong>
                <strong>Width</strong>
                <strong>Flex</strong>
                <strong>Sidecut</strong>
              </div>
              <div>
                <span>110m</span>
                <span>TWIN</span>
                <span>FALSE</span>
                <span>WIDE</span>
                <span>ALL TERRAIN</span>
                <span>PROGRESSIVE</span>
              </div>
            </div>
          </div>
          <div className={styles.layer} data-scene="3">
            <span>THE SPLASH</span>
            <div className={styles.layerImage} style={{backgroundImage: "url('http://pngimg.com/uploads/snowboard/snowboard_PNG7998.png')"}}></div>
            <div className={styles.layerInfo}>
              <div>
                <strong>Size</strong>
                <strong>Shape</strong>
                <strong>Camber</strong>
                <strong>Width</strong>
                <strong>Flex</strong>
                <strong>Sidecut</strong>
              </div>
              <div>
                <span>126m</span>
                <span>REVERSE CAMBER</span>
                <span>TRUE</span>
                <span>MID-WIDE</span>
                <span>ALL TERRAIN</span>
                <span>PROGRESSIVE</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => switchLayer(2)} className={styles.buttonLeft}>{'<'}</button>
        <button onClick={() => switchLayer()} className={styles.buttonRight}>{'>'}</button>
      </div>
      <div className={styles.heroRight}>
        <div className={`${styles.layer} ${styles.layerDisplayed}`} data-scene="1"></div>
        <div className={styles.layer} data-scene="2"></div>
        <div className={styles.layer} data-scene="3"></div>
        <div className={styles.photoFrame}>
          <div className={`${styles.layer} ${styles.layerDisplayed}`} style={{backgroundImage: "url('https://images.unsplash.com/photo-1495468286609-71018e87abc5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=987c55a292efaa0adb9acfc26c06e22a&auto=format&fit=crop&w=670&q=80')"}} data-scene="1"></div>
          <div className={styles.layer} style={{backgroundImage: "url('https://images.unsplash.com/photo-1536099876051-79f4cbffeed1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=451b9215ee8acc20d5d7ea354aab570e&auto=format&fit=crop&w=1350&q=80')"}} data-scene="2"></div>
          <div className={styles.layer} style={{backgroundImage: "url('https://images.unsplash.com/photo-1512821062947-6eda5253c3e2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=305dedf0e09581de0ee68ab2c9523955&auto=format&fit=crop&w=1351&q=80')"}} data-scene="3"></div>
          <div className={styles.cover}></div>
        </div>
        <div className={styles.photoName}>
          <div className={styles.photoNameWrapper}>
            <div className={`${styles.layer} ${styles.layerDisplayed}`} data-scene="1">
              <span className={styles.photoNameTitle}>BRION FOX</span>
              <span>RIDING THE CANNON</span>
            </div>
            <div className={styles.layer} data-scene="2">
              <span className={styles.photoNameTitle}>AUSTIN SMITH</span>
              <span>RIDING THE POW</span>
            </div>
            <div className={styles.layer} data-scene="3">
              <span className={styles.photoNameTitle}>SALLY BLUE</span>
              <span>RIDING THE SPLASH</span>
            </div>
          </div>
        </div>
        <div className={styles.photoFrame}>
          <div className={`${styles.layer} ${styles.layerDisplayed}`} style={{backgroundImage: "url('https://images.unsplash.com/photo-1486335223442-a034129506f6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=564f090b8a99c189845f2ef71d4f620a&auto=format&fit=crop&w=1350&q=80')"}} data-scene="1"></div>
          <div className={styles.layer} style={{backgroundImage: "url('https://images.unsplash.com/photo-1522056615691-da7b8106c665?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4f51ed1121800f23da98176659ba7506&auto=format&fit=crop&w=1352&q=80')"}} data-scene="2"></div>
          <div className={styles.layer} style={{backgroundImage: "url('https://images.unsplash.com/photo-1478700485868-972b69dc3fc4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=918195bdc5a37a2f412cf49234183427&auto=format&fit=crop&w=1350&q=80')"}} data-scene="3"></div>
          <div className={styles.cover}></div>
        </div>
      </div>
    </main>
  );
};

export default DribbleDesign;