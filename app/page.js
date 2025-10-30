"use client";

import React from 'react';
import { 
  WelcomeIntro, 
  AnimatedContinuousSections,
  AnimatedImageSlider,
    AnimatedSliderWebpage,
    AnimeJsV3LogoAnimation,
    AutoplaySliderPauseControl,
    CardCarousel,
    CardsWithInvertedBorderRadius,
  CardSlider3D,
  DribbleDesign,
  SimpleFoodCard,
  AddToCartAnimation
} from './components';
import { animatedContinuousSectionsData } from './data/animatedContinuousSectionsData';
import { animatedImageSliderData } from './data/animatedImageSliderData';
import { animatedSliderWebpageData } from './data/animatedSliderWebpageData';
import autoplaySliderPauseControlData from './data/autoplaySliderPauseControlData';

export default function Home() {
  return (
    <main >
      {/* <WelcomeIntro /> */}
      
      {/* <CardSlider3D /> */}

      {/* <DribbleDesign /> */}

      {/* <div style={{padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
        <SimpleFoodCard
          title="Pizza"
          price="5"
          description="Fresh & sweet"
        />
      </div> */}

    {/* <AddToCartAnimation /> */}

    {/* <AnimatedContinuousSections data={animatedContinuousSectionsData} /> */}

  
    {/* <AnimatedImageSlider data={animatedImageSliderData} /> */}

  {/* Anime.js logo animation (converted from exports) */}

  {/* <AnimeJsV3LogoAnimation /> */}

  {/* <AutoplaySliderPauseControl slides={autoplaySliderPauseControlData} /> */}
    

  {/* <div className="page-centered"> */}
    {/* <CardCarousel /> */}
  {/* </div> */}

    <div className="site-container">
      <CardsWithInvertedBorderRadius />
    </div>
    </main>
  );
}
