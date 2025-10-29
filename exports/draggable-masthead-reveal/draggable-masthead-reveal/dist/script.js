// Set various variables on page load
let windowWidth = $(window).width(),
  reveal_width = windowWidth / 2; // Animate to 50% of screen
if (windowWidth < 768) {
  // If small screens only animate to 5%
  reveal_width = windowWidth / 20;
}
$("#masthead .view-dark .inner").width(windowWidth);
$(window).resize(function () {
  let windowWidth = $(window).width();
  $("#masthead .view-dark .inner").css("width", windowWidth + "px");
});

/*
        Dependencies : TweenMax and GSAP Draggable
        Test on touch device @ http://cloud.bassta.bg/before-after.html
        */
let $dragMe = $("#drag-me"),
  $dragMeArrow = $("#drag-me .icon-drag-diamond"),
  $masthead = $("#masthead"),
  $viewDark = $(".view-dark");

// Intro animation
animateTo(reveal_width, false, 0.75);

// Create Draggable
let mastheadDraggable = Draggable.create($dragMe, {
  type: "left",
  bounds: $masthead,
  throwProps: true,
  cursor: "grab",
  activeCursor: "grabbing",
  zIndexBoost: false,
  onDrag: widthDark
})[0];

$(window).resize(function () {
  // Resize check to activate Draggable and set reveal width
  let windowWidth = $(window).width(),
    reveal_width = windowWidth / 2; // Animate to 50% of screen

  if (windowWidth < 768) {
    // If small screens only animate to 5%
    reveal_width = windowWidth / 20;
  }
  $dragMeArrow.removeClass("reverseDirection"); // Remove directional change of arrow
  animateTo(reveal_width, false, 0);
});
// Click
$($masthead, $dragMe).on("click", function (event) {
  let eventLeft = event.clientX - $masthead.offset().left;
  console.log(eventLeft);
  animateTo(eventLeft, true, 0);
});
// Animation
function animateTo(_left, mouseClick, $delay) {
  let windowWidth = $(window).width(),
    frac5 = windowWidth / 20, // 5%
    frac50 = windowWidth / 2, // 50%
    frac95 = (windowWidth / 20) * 19, // 95%
    $dragMeLeft = $dragMe.offset().left;

  if (!!mouseClick && windowWidth < 768) {
    if ($dragMeLeft < frac50) {
      // If Light is visible
      _left = frac95;
      $dragMeArrow.addClass("reverseDirection");
    } else {
      // Dark is visible
      _left = frac5;
      $dragMeArrow.removeClass("reverseDirection");
    }
  }

  TweenLite.to($dragMe, 1, { left: _left + 35, onUpdate: widthDark }).delay(
    $delay
  );
}
// Change Dark section size
function widthDark() {
  TweenLite.set($viewDark, { width: $dragMe.css("left") });
}

// Detect finger swipe for mobile
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let xDown = null,
  yDown = null,
  frac50 = windowWidth / 2, // 50%
  $dragMeLeft = "";
function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}
function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}
function handleTouchMove(evt) {
  $dragMeLeft = $dragMe.offset().left;
  if (!xDown || !yDown) {
    return;
  }
  let xUp = evt.touches[0].clientX,
    yUp = evt.touches[0].clientY,
    xDiff = xDown - xUp,
    yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0 && $dragMeLeft > frac50) {
      /* left swipe */
      animateTo(1, true, 0);
    } else if (xDiff <= 0 && $dragMeLeft < frac50) {
      /* right swipe */
      animateTo(1, true, 0);
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}