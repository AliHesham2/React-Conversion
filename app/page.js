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
    CarouselWithHoverEffect,
    CenterModeProductivitySliderProV5,
  CardSlider3D,
  DribbleDesign,
  SimpleFoodCard,
  AddToCartAnimation
} from './components';
// Import the CleanSlider component and its data directly to ensure the
// homepage mounts the recreated export regardless of the barrel index state.
import CleanSliderWithCurvedBackground from './components/CleanSliderWithCurvedBackground/CleanSliderWithCurvedBackground';
import cleanSliderWithCurvedBackgroundData from './data/cleanSliderWithCurvedBackgroundData';
import ClipPathHoverEffect from './components/ClipPathHoverEffect/ClipPathHoverEffect';
import clipPathHoverEffectData from './data/clipPathHoverEffectData';
import ClipPathRevealingSlider from './components/ClipPathRevealingSlider/ClipPathRevealingSlider';
import clipPathRevealingSliderData from './data/clipPathRevealingSliderData';
import CodepenChallengeReflection from './components/CodepenChallengeReflection/CodepenChallengeReflection';
import codepenChallengeReflectionData from './data/codepenChallengeReflectionData';
import { animatedContinuousSectionsData } from './data/animatedContinuousSectionsData';
import { animatedImageSliderData } from './data/animatedImageSliderData';
import { animatedSliderWebpageData } from './data/animatedSliderWebpageData';
import autoplaySliderPauseControlData from './data/autoplaySliderPauseControlData';
import CpchallengeSlideshowModern1 from './components/cpchallenge-slideshow-modern-1/CpchallengeSlideshowModern1';
import cpchallengeData from './data/cpchallengeSlideshowModern1Data';
import CpchallengeSlideshowModern2 from './components/cpchallenge-slideshow-modern-2/CpchallengeSlideshowModern2';
import cpchallenge2Data from './data/cpchallengeSlideshowModern2Data';
import CreativeFoodCarousel from './components/creative-food-carousel/CreativeFoodCarousel';
import creativeFoodCarouselData from './data/creativeFoodCarouselData';
import Css3dCarouselRoom from './components/css-3d-carousel-room/Css3dCarouselRoom';
import css3dCarouselRoomData from './data/css3dCarouselRoomData';
import CssBlockRevealingEffect from './components/css-block-revealing-effect/CssBlockRevealingEffect';
import cssBlockRevealingEffectData from './data/cssBlockRevealingEffectData';
import CssOnlyMarquee from './components/css-only-marquee/CssOnlyMarquee';
import cssOnlyMarqueeData from './data/cssOnlyMarqueeData';
import CssCarouselKeyboard from './components/css-carousel-with-keyboard-controls/CssCarouselKeyboard';



export default function Home() {
  return (
    <main>
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
    

  <div className="page-centered">
    {/* <CardCarousel /> */}
    
    {/* <CreativeFoodCarousel slides={creativeFoodCarouselData} /> */}


  <div style={{height: '60px'}} />
  <CssCarouselKeyboard />

  {/* <Css3dCarouselRoom /* pass test data if needed later */ }

  {/* <div style={{height: '60px'}} />
  <CssBlockRevealingEffect  /> */}
  
    {/* <div style={{height: '60px'}} />
    <CssOnlyMarquee items={cssOnlyMarqueeData} /> */}



     {/* <CardsWithInvertedBorderRadius />
      <CarouselWithHoverEffect /> */}
    {/* <CenterModeProductivitySliderProV5 /> */}


  
    {/* <CleanSliderWithCurvedBackground slides={cleanSliderWithCurvedBackgroundData} /> */}

    {/* <div style={{height: '60px'}} />
    <ClipPathHoverEffect items={clipPathHoverEffectData} /> */}

    {/* <div style={{height: '60px'}} /> */}
    {/* <ClipPathRevealingSlider items={clipPathRevealingSliderData} /> */}

  {/* <div style={{height: '60px'}} />
  <CodepenChallengeReflection data={codepenChallengeReflectionData} /> */}

 


    {/* cpchallenge slideshow (for testing) */}

 {/* <div style={{height: '40px'}} /> */}
 {/* <CpchallengeSlideshowModern2 slides={cpchallenge2Data} /> */}



 </div>


 
    </main>
  );
}
