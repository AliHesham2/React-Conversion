/* Get index of element
http://stackoverflow.com/questions/27854824/vanilla-js-replacements-for-jquerys-index-and-eq*/
function index(element){
  var sib = element.parentNode.childNodes;
  var n = 0;
  for (var i=0; i<sib.length; i++) {
       if (sib[i]==element) return n;
       if (sib[i].nodeType==1) n++;
  }
  return -1; 
};

function getSiblings(elem) {
  var siblings = [];
  var sibling = elem.parentNode.firstChild;
  for ( ; sibling; sibling = sibling.nextSibling ) {
    if ( sibling.nodeType === 1 && sibling !== elem ) {
      siblings.push( sibling );
    }
  }
  return siblings;
};

var Slider = function() {
  var
    slider,
    activeSlide,
    slides,
    slideWidth,
    slideNavPrev,
    slideNavNext,
    slideNavThumbs;

  var _init = function() {
    slider          = document.getElementById('slider');
    slideContainer  = document.getElementsByClassName('slider__container')[0];
    activeSlide     = document.getElementsByClassName('is-active')[0];
    slides          = document.getElementsByClassName('slider__item');
    slides          = Array.prototype.slice.call(slides, 0);
    slideNavPrev    = document.getElementsByClassName('slider__prev')[0];
    slideNavNext    = document.getElementsByClassName('slider__next')[0];   
    slideNavThumbs  = document.getElementsByClassName('navThumbs__item');
    slideNavThumbs  = Array.prototype.slice.call(slideNavThumbs, 0);
    slideWidth      = parseInt(getComputedStyle(slideContainer).width);

    _prepare();
    _addEventHandlers();
    _animateFirst();
  }
  
  var _addEventHandlers = function() {
    slideNavNext.addEventListener('click', _goToNext, false);
    slideNavPrev.addEventListener('click', _goToPrev, false);
    // document.addEventListener("keydown", handleKeyboardNav, false);
    slideNavThumbs.forEach(function(element, index) {
      element.classList.remove('is-active');
      element.addEventListener('click', _goToClicked, false);
    });
  }
  
  var _prepare = function() {
    slides.forEach(function(element,index) {
      if(!element.classList.contains('is-active')) {
        TweenLite.set(element, {autoAlpha: 0});
      }
    });
    TweenLite.set(slideNavPrev, {autoAlpha: 0.2});
  }
  
  var _animateFirst = function() {
    
    var slideInTitle      = activeSlide.children[1].children[0];
    slideInTitle = new SplitText(slideInTitle);
    var _resetTitle       = function() {
      splitSlideInTitle.revert();
    }
    
    var tl = new TimelineLite({onComplete:_resetTitle});
    tl
      .staggerFromTo(slideInTitle.chars, 0.6, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50", ease:Back.easeOut }, { opacity:1, scale:1, y:0, rotationX:0 }, 0.03, '-=0.3');      
  }
  
  var _animateNext = function(slideOut, slideIn) {    
    var slideOutTitle       = slideOut.children[1].children[0];
    var slideOutSubtitle    = slideOut.children[1].children[1];    
    var size                = slides.length;   
    
    if(slideIn) {      
      var slideInTitle      = slideIn.children[1].children[0];
      var splitSlideInTitle = new SplitText(slideInTitle);
      var slideInSubtitle   = slideIn.children[1].children[1];
      var _resetTitle       = function() {
        splitSlideInTitle.revert();
      }
      
      var tl = new TimelineLite({onComplete:_resetTitle});      
      tl        
        .set(slideIn, {x:'100%', autoAlpha:1, className:'+=is-active'})
        .set(slideOut, {className: '-=is-active'})     
        .to(slideOutTitle, 0.3, {autoAlpha: 0, y:-50, ease:Power2.easeOut}, 0)
        .to(slideOut, 0.9, {x: '-100%', ease:Power2.easeOut}, 0)
        .to(slideIn, 0.9, {x: '-=100%', ease:Power2.easeOut}, 0)
        .staggerFromTo(splitSlideInTitle.chars, 0.6, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50", ease:Back.easeOut }, { opacity:1, scale:1, y:0, rotationX:0 }, 0.03, '-=0.3');      
      if(index(slideIn) === size-1) {
        TweenLite.to(slideNavNext, 0.3, {autoAlpha: 0.2, ease:Linear.easeNone, className:'-=is-active'});
      }     
    }    
    TweenLite.set(slideNavPrev, {autoAlpha: 1, className:'+=is-active'});    
  }
  
  var _goToNext = function() {
    var slideOut = document.getElementsByClassName('is-active')[0];
    var slideIn  = slideOut.nextElementSibling;
    _animateNext(slideOut, slideIn)
  }
  
  var _animatePrev = function(slideOut, slideIn) {
    var slideOutTitle       = slideOut.children[1].children[0];
    var tl      = new TimelineLite();
    
    if(slideIn) {
      var slideInTitle      = slideIn.children[1].children[0];
      var _resetTitle = function() {
        splitSlideInTitle.revert();
      }
      var splitSlideInTitle = new SplitText(slideInTitle);
      var tl      = new TimelineLite({onComplete: _resetTitle});
      tl
        .set(slideIn, {x:'-100%', autoAlpha:1, className:'+=is-active'})
        .set(slideOut, {className: '-=is-active'})
        .set(slideInTitle, {y:0, autoAlpha:1})
        .to(slideOut, 0.9, {x: '100%', ease:Power2.easeOut}, 0)
        .to(slideIn, 0.9, {x: '+=100%', ease:Power2.easeOut}, 0)
        .staggerFromTo(splitSlideInTitle.chars, 0.8, {
            opacity:0, 
            scale:0, 
            y:80, 
            rotationX:180, 
            transformOrigin:"0% 50% -50",  
            ease:Back.easeOut
          },
          {
            opacity:1,
            scale:1,
            y:0,
            rotationX:0
          }, 0.03, '-=0.3')
      if(index(slideIn) === 0){
	      TweenLite.to(slideNavPrev, 0.3, {autoAlpha: 0.2, ease:Linear.easeNone, className:'-=is-active'});
	    }
    }
    TweenLite.set(slideNavNext, {autoAlpha: 1, className:'+=is-active'});
  }
  
  var _goToPrev = function() {    
    var slideOut = document.getElementsByClassName('is-active')[0];
    var slideIn = slideOut.previousElementSibling;
    _animatePrev(slideOut, slideIn);
  }
  
  var _goToClicked = function() {
    var clickedSlide  = index(this);
    var slideOut      = document.getElementsByClassName('is-active')[0];
    var slideIn       = document.getElementsByClassName('slider__item')[clickedSlide]; 
     var siblings = getSiblings(this);
      siblings.forEach(function(element, index) {
        element.classList.remove('is-active')
      })
    if(clickedSlide > index(slideOut)) {     
      this.classList.add('is-active')
      _animateNext(slideOut, slideIn)
    } else if(index(slideOut) > clickedSlide) {
      this.classList.add('is-active')
      _animatePrev(slideOut, slideIn)
    }   
  }
 
  
  var handleKeyboardNav = function(e) {
    if (!e) e = window.event;
    var kc = e.keyCode;
    if (kc == 37) _goToPrev();
    if (kc == 39) _goToNext();
  }
  
  return {
    init: _init
  }
}();

Slider.init();