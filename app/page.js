"use client";

import React from 'react';
import ResponsiveImageSlider from './components/ResponsiveImageSlider/ResponsiveImageSlider';
import ResponsiveImageCarouselAnimation from './components/ResponsiveImageCarouselAnimation/ResponsiveImageCarouselAnimation';
import ResponsiveParallaxDragSlider from './components/ResponsiveParallaxDragSlider/ResponsiveParallaxDragSlider';
import Rotating3dGalleryImageFilters from './components/Rotating3dGalleryImageFilters/Rotating3dGalleryImageFilters';
import ScrolltriggerImageZoom from './components/ScrolltriggerImageZoom/ScrolltriggerImageZoom';
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
import CssFiltersAdabtiveCards from './components/css-filtersadabtive-cards/CssFiltersAdabtiveCards';
import cssFiltersAdaptiveCardsData from './data/cssFiltersAdaptiveCardsData';
import CssInfiniteAutoplayCarousel from './components/css-infinite-autoplay-carousel/CssInfiniteAutoplayCarousel';
import cssInfiniteAutoplayCarouselData from './data/cssInfiniteAutoplayCarouselData';
import CssOnlyInkSplashVideoManipulation from './components/css-only-ink-splash-video-manipulation-css-effect/CssOnlyInkSplashVideoManipulation';
import cssOnlyInkSplashData from './data/cssOnlyInkSplashData';
import CssSliderPureCss10 from './components/css-sliderpure-css10/CssSliderPureCss10';
import cssSliderPureCss10Data from './data/cssSliderPureCss10Data';
import CyberScrollGsap from './components/cyber-scrollgsap/CyberScrollGsap';
import cyberScrollGsapData from './data/cyberScrollGsapData';
import DraggableMasthead from './components/draggable-masthead/DraggableMasthead';
import draggableMastheadData from './data/draggableMastheadData';
import DynamicCarouselSliderWithInfiniteScoll from './components/dynamic-carousel-slider-with-infinite-scoll/DynamicCarouselSliderWithInfiniteScoll';
import dynamicCarouselSliderData from './data/dynamicCarouselSliderData';
import DynamicContentLockupsV2OpenProps from './components/dynamic-content-lockups-v2open-props/DynamicContentLockupsV2OpenProps';
import dynamicContentLockupsV2Data from './data/dynamicContentLockupsV2Data';
import ExpandingFlexCards from './components/expanding-flex-cards/ExpandingFlexCards';
import expandingFlexCardsData from './data/expandingFlexCardsData';
import EyesMousemove from './components/eyes-mousemove/EyesMousemove';
import FancySlider from './components/fancy-slider/FancySlider';
import fancySliderData from './data/fancySliderData';
import FullSliderPrototype from './components/full-slider-prototype/FullSliderPrototype';
import fullSliderPrototypeData from './data/fullSliderPrototypeData';
import Gallery3dCssInfiniteHover from './components/gallery-3dcssinfinitehover/Gallery3dCssInfiniteHover';
import gallery3dCssInfiniteHoverData from './data/gallery3dCssInfiniteHoverData';
import GettingFamiliarWithAnimeJsLineDrawing from './components/getting-familiar-with-anime-js-line-drawing/GettingFamiliarWithAnimeJsLineDrawing';
import gettingFamiliarWithAnimeJsLineDrawingData from './data/gettingFamiliarWithAnimeJsLineDrawingData';
import GsapLandingPage from './components/gsap-landing-page/GsapLandingPage';
import gsapLandingPageData from './data/gsapLandingPageData';
import GsapSlideshowVerticalWarp from './components/gsap-slideshow-vertical-warp/GsapSlideshowVerticalWarp';
import gsapSlideshowVerticalWarpData from './data/gsapSlideshowVerticalWarpData';
import GsapSlideshowVerticalZoom2 from './components/gsap-slideshow-vertical-zoom-2/GsapSlideshowVerticalZoom2';
import gsapSlideshowVerticalZoom2Data from './data/gsapSlideshowVerticalZoom2Data';
import GsapSlideshowVerticalZoom3 from './components/gsap-slideshow-vertical-zoom-3/GsapSlideshowVerticalZoom3';
import gsapSlideshowVerticalZoom3Data from './data/gsapSlideshowVerticalZoom3Data';
import ImageOverlaySlider from './components/image-overlay-slider/ImageOverlaySlider';
import imageOverlaySliderData from './data/imageOverlaySliderData';
import HexaTeam from './components/hexa-team/HexaTeam';
import hexaTeamData from './data/hexaTeamData';
import HorizontalParallaxSlidingSliderWithSwiperJs from './components/horizontal-parallax-sliding-slider-with-swiper-js/HorizontalParallaxSlidingSliderWithSwiperJs';
import horizontalParallaxSlidingSliderData from './data/horizontalParallaxSlidingSliderData';
import IntroGridSection from './components/intro-grid-section/IntroGridSection';
import introGridSectionData from './data/introGridSectionData';
import MarqueeLikeContentScrolling from './components/marquee-like-content-scrolling/MarqueeLikeContentScrolling';
import marqueeLikeContentScrollingData from './data/marqueeLikeContentScrollingData';
import MothersDaySvgAnimationResponsive from './components/mother-s-day-svg-animation-responsive/MothersDaySvgAnimationResponsive';
import mothersDaySvgAnimationResponsiveData from './data/mothersDaySvgAnimationResponsiveData';
import OnscrollAnimationDynamicContentScrollWithScrollmagic from './components/onscroll-animation-dynamic-content-scroll-with-scrollmagic/OnscrollAnimationDynamicContentScrollWithScrollmagic';
import PageIntroAnimation from './components/page-intro-animation/PageIntroAnimation';
import ParallaxCarouselNoLibraries from './components/parallax-carousel-no-libraries/ParallaxCarouselNoLibraries';
import PixelPerCharacterScrollWords from './components/pixel-per-character-scroll-words-with-css-gsap/PixelPerCharacterScrollWords';
import PricingPureCss16 from './components/pricingpure-css16/PricingPureCss16';
import ProductSwiper from './components/product-swiper/ProductSwiper';
import ProjectsCarousel from './components/ProjectsCarousel/ProjectsCarousel';
import PureCssCarousel from './components/PureCssCarousel/PureCssCarousel';
import PureCssSliderWithCustomEffects from './components/PureCssSliderWithCustomEffects/PureCssSliderWithCustomEffects';
import ReactSliderWithHoverEffect from './components/ReactSliderWithHoverEffect/ReactSliderWithHoverEffect';
import ScrolltriggerDownhillSki from './components/ScrolltriggerDownhillSki/ScrolltriggerDownhillSki';
import ShaderImageTransition from './components/ShaderImageTransition/ShaderImageTransition';
import SkewedFlexboxPanels from './components/SkewedFlexboxPanels/SkewedFlexboxPanels';
import SliderTransitionWip from './components/SliderTransitionWip/SliderTransitionWip';
import SliderTransitions from './components/SliderTransitions/SliderTransitions';
import SliderWithComplexAnimation from './components/SliderWithComplexAnimation/SliderWithComplexAnimation';
import SliderWithProgressBar from './components/SliderWithProgressBar/SliderWithProgressBar';
import Slides from './components/Slides/Slides';
import SplittextWordsDancingIn3d from './components/splittext-words-dancing-in-3d/SplittextWordsDancingIn3d';
import SvgFilterTextMarquees from './components/svg-filter-text-marquees/SvgFilterTextMarquees';
import TimedCardsOpening from './components/TimedCardsOpening/TimedCardsOpening';
import VueResponsiveShuffleGallery from './components/vue-responsive-shuffle/Gallery';
import SvgTextMaskWithVideo from './components/svg-text-mask-w-video-fill/SvgTextMaskWithVideo';



export default function Home() {
  return (
    <main>

      {/* <div style={{height: '40px'}} />
      <Slides /> */}

  {/* <div style={{height: '40px'}} />
  <SliderWithProgressBar /> */}


  {/* <ImageOverlaySlider slides={imageOverlaySliderData.slides} /> */}

  {/* <div className="hexa-bg">
    <HexaTeam members={hexaTeamData.members} />
  </div> */}

  {/* <GsapSlideshowVerticalZoom2 slides={gsapSlideshowVerticalZoom2Data.slides} /> */}

  {/* <GsapSlideshowVerticalWarp slides={gsapSlideshowVerticalWarpData.slides} /> */}

  {/* <GsapLandingPage slides={gsapLandingPageData} /> */}

      {/* <Gallery3dCssInfiniteHover slides={gallery3dCssInfiniteHoverData} /> */}
      {/* <FullSliderPrototype slides={fullSliderPrototypeData} /> */}

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

  {/* <div style={{height: '40px'}} />
  <SliderWithComplexAnimation /> */}

  {/* <SliderTransitions /> */}
  
  {/* <PageIntroAnimation /> */}
  {/* <PixelPerCharacterScrollWords /> */}

  {/* <PricingPureCss16 /> */}
  {/* <ProductSwiper /> */}

  {/* <AnimatedImageSlider data={animatedImageSliderData} /> */}

  {/* Anime.js logo animation (converted from exports) */}

  {/* <AnimeJsV3LogoAnimation /> */}

  {/* <AutoplaySliderPauseControl slides={autoplaySliderPauseControlData} /> */}
    

  {/* <DraggableMasthead slides={draggableMastheadData} /> */}

  {/* <CardCarousel /> */}
    
  {/* <CreativeFoodCarousel slides={creativeFoodCarouselData} /> */}

  {/* <div style={{height: '40px'}} />
  <ReactSliderWithButtonWaveEffect /> */}


  {/* <CssInfiniteAutoplayCarousel slides={cssInfiniteAutoplayCarouselData} /> */}
  {/* <div style={{height: '60px'}} />
  <div style={{height: '40px'}} />
  <ReactSliderWithButtonWaveEffect />
  <CssInfiniteAutoplayCarousel slides={cssInfiniteAutoplayCarouselData} /> */}

  {/* <CssCarouselKeyboard /> */}

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



    {/* <div style={{ height: '40px' }} />
    <ProjectsCarousel /> */}

  {/* <div style={{ height: '40px' }} />
  <PureCssCarousel /> */}

  {/* <div style={{height: '60px'}} /> */}
  {/* <ClipPathRevealingSlider items={clipPathRevealingSliderData} /> */}

  {/* <ScrolltriggerImageZoom /> */}

  {/* <div style={{height: '40px'}} />
  <PureCssSliderWithCustomEffects /> */}

  {/* <div style={{height: '40px'}} />
  <ReactSliderWithHoverEffect /> */}

  {/* <ExpandingFlexCards slides={expandingFlexCardsData} /> */}
  
    {/* <div style={{height: '40px'}} /> */}

  {/* <div style={{height: '40px'}} />
  <FancySlider slides={fancySliderData} /> */}

  {/* <CodepenChallengeReflection data={codepenChallengeReflectionData} />  */}

  {/* cpchallenge slideshow (for testing) */}

  {/* <div style={{height: '40px'}} /> */}
 
  {/* <div style={{height: '60px'}} />
  <CssSliderPureCss10 slides={cssSliderPureCss10Data} /> */}

  {/* <div style={{height: '60px'}} />
  <CssOnlyInkSplashVideoManipulation items={cssOnlyInkSplashData} /> */}

  {/* <div style={{height: '60px'}} /> */}
  {/* testing: cyber-scrollgsap (converted item #40) */}

  {/* <div style={{height: '40px'}} /> */}
  {/* <CyberScrollGsap slides={cyberScrollGsapData} /> */}

  {/* <div style={{height: '40px'}} />
  <ExpandingFlexCards slides={expandingFlexCardsData} /> */}

  {/* <div style={{height: '40px'}} />
  <DynamicCarouselSliderWithInfiniteScoll slides={dynamicCarouselSliderData} /> */}

   {/* <DynamicContentLockupsV2OpenProps items={dynamicContentLockupsV2Data} />  */}

  {/* Intro grid section (converted HTML-only) */}

  {/* <div style={{height: '40px'}} />
  <IntroGridSection data={introGridSectionData} /> */}

  {/* Marquee-like content scrolling (HTML-only conversion for testing) */}

  {/* <div style={{height: '40px'}} />
  <MarqueeLikeContentScrolling items={marqueeLikeContentScrollingData.items} /> */}

  {/* <div style={{height: '40px'}} />
  <MothersDaySvgAnimationResponsive data={mothersDaySvgAnimationResponsiveData} /> */}

  {/* <div style={{height: '60px'}} />
  <HorizontalParallaxSlidingSliderWithSwiperJs slides={horizontalParallaxSlidingSliderData.slides} /> */}
  
  {/* <div style={{height: '60px'}} />
  <OnscrollAnimationDynamicContentScrollWithScrollmagic  /> */}

      {/* <div style={{height: '40px'}} />
      <ResponsiveImageCarouselAnimation /> */}

  {/* <div style={{height: '40px'}} />
  <ResponsiveParallaxDragSlider /> */}


  {/* <div style={{height: '40px'}} />
  <Rotating3dGalleryImageFilters /> */}

    {/* <div style={{height: '40px'}} />
    <ScrolltriggerDownhillSki /> */}

  {/* <div style={{height: '40px'}} />
  <ShaderImageTransition /> */}

  {/* <div style={{height: '40px'}} />
  <SkewedFlexboxPanels /> */}

    {/* <div style={{height: '40px'}} />
    <ShaderImageTransition />

    <div style={{height: '40px'}} />
    <SkewedFlexboxPanels /> */}

{/*  <div style={{height: '40px'}} />
    <SliderTransitionWip /> */}

  {/* <div style={{height: '40px'}} />
  <SliderTransitions /> */}

{/* <SvgFilterTextMarquees /> */}

  {/* <SplittextWordsDancingIn3d /> */}

{/* <TimedCardsOpening /> */}

  {/* <div style={{height: '40px'}} />
  <SvgTextMaskWithVideo /> */}






  </main>
  );
}
