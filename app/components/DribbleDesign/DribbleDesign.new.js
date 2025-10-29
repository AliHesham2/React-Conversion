import React, { useState, useEffect, useRef } from 'react';
import styles from './DribbleDesign.module.css';

const DribbleDesign = () => {
  const [sliderIndex, setSliderIndex] = useState(1);
  const timeoutRef = useRef(null);
  
  // Use refs to directly access DOM elements
  const mainRef = useRef(null);
  const coversRef = useRef([]);
  const layersRef = useRef([]);
  
  // Initialize refs after component mounts
  useEffect(() => {
    // Get all elements with the original class names (not CSS module names)
    // This is necessary because the original JavaScript uses these exact class names
    coversRef.current = Array.from(document.querySelectorAll('.photo-frame'));
    layersRef.current = Array.from(document.querySelectorAll('.layer'));
    
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  
  // Function to change the cover animation state
  const changeCoverAnimState = (state = 0) => {
    coversRef.current.forEach(cover => {
      // Find the cover element within each photo frame
      const coverElement = cover.querySelector('.cover');
      if (coverElement) {
        // Set the width directly
        coverElement.style.width = `${state * 100}%`;
      }
    });
  };
  
  // Function to switch between layers
  const switchLayer = (step = 1) => {
    // Calculate the next slide index
    const nextSlide = (sliderIndex + step) % 3 === 0 ? 3 : (sliderIndex + step) % 3;
    
    // Start the cover animation
    changeCoverAnimState(1);
    
    // Clear any existing timeout
    clearTimeout(timeoutRef.current);
    
    // Set a timeout to end the cover animation after 500ms
    timeoutRef.current = setTimeout(() => {
      changeCoverAnimState(0);
    }, 500);
    
    // Update layer classes
    layersRef.current.forEach(layer => {
      // Remove existing classes
      layer.classList.remove('layer-displayed');
      layer.classList.remove('layer-displayed-exit');
      
      // Add appropriate classes based on the scene
      if (layer.dataset.scene == nextSlide) {
        layer.classList.add('layer-displayed');
      }
      if (layer.dataset.scene == sliderIndex) {
        layer.classList.add('layer-displayed-exit');
      }
    });
    
    // Update the slider index
    setSliderIndex(nextSlide);
  };

  return (
    <main className={styles.main} ref={mainRef}>
      <div className={styles.heroLeft}>
        <h1>NITRO</h1>
        <div className={styles.layers}>
          <div className="layer layer-displayed" data-scene="1">
            <span>THE CANNON</span>
            <div className="layer__image" style={{backgroundImage: "url('http://pngimg.com/uploads/snowboard/snowboard_PNG8008.png')"}}></div>
            <div className="layer__info">
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
          <div className="layer" data-scene="2">
            <span>THE POW</span>
            <div className="layer__image" style={{backgroundImage: "url('http://pngimg.com/uploads/snowboard/snowboard_PNG8006.png')"}}></div>
            <div className="layer__info">
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
          <div className="layer" data-scene="3">
            <span>THE SPLASH</span>
            <div className="layer__image" style={{backgroundImage: "url('http://pngimg.com/uploads/snowboard/snowboard_PNG7998.png')"}}></div>
            <div className="layer__info">
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
        <div className="layer layer-displayed" data-scene="1"></div>
        <div className="layer" data-scene="2"></div>
        <div className="layer" data-scene="3"></div>
        <div className="photo-frame">
          <div className="layer layer-displayed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1495468286609-71018e87abc5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=987c55a292efaa0adb9acfc26c06e22a&auto=format&fit=crop&w=670&q=80')"}} data-scene="1"></div>
          <div className="layer" style={{backgroundImage: "url('https://images.unsplash.com/photo-1536099876051-79f4cbffeed1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=451b9215ee8acc20d5d7ea354aab570e&auto=format&fit=crop&w=1350&q=80')"}} data-scene="2"></div>
          <div className="layer" style={{backgroundImage: "url('https://images.unsplash.com/photo-1512821062947-6eda5253c3e2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=305dedf0e09581de0ee68ab2c9523955&auto=format&fit=crop&w=1351&q=80')"}} data-scene="3"></div>
          <div className="cover"></div>
        </div>
        <div className="photo-name">
          <div className="photo-name__wrapper">
            <div className="layer layer-displayed" data-scene="1">
              <span className="photo-name__title">BRION FOX</span>
              <span>RIDING THE CANNON</span>
            </div>
            <div className="layer" data-scene="2">
              <span className="photo-name__title">AUSTIN SMITH</span>
              <span>RIDING THE POW</span>
            </div>
            <div className="layer" data-scene="3">
              <span className="photo-name__title">SALLY BLUE</span>
              <span>RIDING THE SPLASH</span>
            </div>
          </div>
        </div>
        <div className="photo-frame">
          <div className="layer layer-displayed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1486335223442-a034129506f6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=564f090b8a99c189845f2ef71d4f620a&auto=format&fit=crop&w=1350&q=80')"}} data-scene="1"></div>
          <div className="layer" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522056615691-da7b8106c665?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4f51ed1121800f23da98176659ba7506&auto=format&fit=crop&w=1352&q=80')"}} data-scene="2"></div>
          <div className="layer" style={{backgroundImage: "url('https://images.unsplash.com/photo-1478700485868-972b69dc3fc4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=918195bdc5a37a2f412cf49234183427&auto=format&fit=crop&w=1350&q=80')"}} data-scene="3"></div>
          <div className="cover"></div>
        </div>
      </div>
    </main>
  );
};

export default DribbleDesign;