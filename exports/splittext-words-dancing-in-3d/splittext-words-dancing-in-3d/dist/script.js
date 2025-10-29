gsap.registerPlugin(SplitText);

document.fonts.ready.then(() => {
  var quote = document.getElementById("quote"),
    mySplitText = SplitText.create(quote, { type: "words" }),
    tl = gsap.timeline({ delay: 0.5, repeat: 10, repeatDelay: 1 }),
    numWords = mySplitText.words.length;

  //prep the quote div for 3D goodness
  gsap.set(quote, {
    transformPerspective: 600,
    perspective: 300,
    transformStyle: "preserve-3d",
    autoAlpha: 1
  });

  //intro sequence
  for (var i = 0; i < numWords; i++) {
    tl.from(
      mySplitText.words[i],
      1.5,
      {
        z: randomNumber(-500, 300),
        opacity: 0,
        rotationY: randomNumber(-40, 40)
      },
      Math.random() * 1.5
    );
  }
  tl.from(
    quote,
    tl.duration(),
    { rotationY: 180, transformOrigin: "50% 75% 200", ease: Power2.easeOut },
    0
  );

  //randomly change z of each word, map opacity to z depth and rotate quote on y axis
  for (var i = 0; i < numWords; i++) {
    var z = randomNumber(-50, 50);
    tl.to(
      mySplitText.words[i],
      0.5,
      { z: z, opacity: rangeToPercent(z, -50, 50) },
      "pulse"
    );
  }
  tl.to(quote, 0.5, { rotationY: 20 }, "pulse");

  //randomly change z of each word, map opacity to z depth and rotate quote on xy axis
  for (var i = 0; i < numWords; i++) {
    var z = randomNumber(-100, 100);
    tl.to(
      mySplitText.words[i],
      0.5,
      { z: z, opacity: rangeToPercent(z, -100, 100) },
      "pulse2"
    );
  }
  tl.to(quote, 0.5, { rotationX: -35, rotationY: 0 }, "pulse2");

  //reset the quote to normal position
  tl.to(mySplitText.words, 0.5, { z: 0, opacity: 1 }, "reset");
  tl.to(quote, 0.5, { rotationY: 0, rotationX: 0 }, "reset");

  //add explode label 2 seconds after reset animation is done
  tl.add("explode", "+=2");
  //add explode effect
  for (var i = 0; i < numWords; i++) {
    tl.to(
      mySplitText.words[i],
      0.6,
      {
        z: randomNumber(100, 500),
        opacity: 0,
        rotation: randomNumber(360, 720),
        rotationX: randomNumber(-360, 360),
        rotationY: randomNumber(-360, 360)
      },
      "explode+=" + Math.random() * 0.2
    );
  }

  //TRY THIS FOR SUPER-SLOW-MO
  //tl.timeScale(0.2);

  //some helper functions
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
  }

  function rangeToPercent(number, min, max) {
    return (number - min) / (max - min);
  }
});