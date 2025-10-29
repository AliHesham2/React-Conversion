let cartCount = 0;
const productList = document.querySelector(".product__list");
const cartIcon = document.querySelector(".cart");

const fadeEase = gsap.parseEase("power2.in");
const mapFade = (t) => gsap.utils.clamp(0, 1, (t - 0.5) / 0.5);

function bezier2(t, P0, P1, P2) {
  return {
    x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
    y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y
  };
}

// One listener on the parent
productList.addEventListener("click", (e) => {
  // Check if a .add-to-cart button was clicked (or inside it)
  const button = e.target.closest(".add-to-cart");
  if (!button) return; // click wasn't on a cart button

  const startRect = button.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const P0 = {
    x: startRect.left + startRect.width / 2,
    y: startRect.top + startRect.height / 2
  };
  const P2 = {
    x: endRect.left + endRect.width / 2,
    y: endRect.top + endRect.height / 2
  };

  const curveHeight = 200;
  const P1 = { x: (P0.x + P2.x) / 2, y: Math.min(P0.y, P2.y) - curveHeight };

  // Floating icon
  const floatingIcon = document.createElement("div");
  Object.assign(floatingIcon.style, {
    position: "fixed",
    opacity: "1",
    left: "0",
    top: "0",
    zIndex: "2147483647",
    pointerEvents: "none",
    transform: `translate(${P0.x}px, ${P0.y}px)`,
    willChange: "transform, opacity"
  });

  const imgSrc = button.getAttribute("data-image");
  if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "";
    img.style.width = "40px";
    img.style.height = "50px";
    img.style.objectFit = "contain";
    img.style.display = "block";
    floatingIcon.appendChild(img);
  } else {
    floatingIcon.textContent = "🛒";
  }
  document.body.appendChild(floatingIcon);

  const setX = gsap.quickSetter(floatingIcon, "x", "px");
  const setY = gsap.quickSetter(floatingIcon, "y", "px");
  const setOpacity = gsap.quickSetter(floatingIcon, "opacity");

  const progressObj = { t: 0 };

  gsap.to(progressObj, {
    duration: 0.7,
    t: 1,
    ease: "power1.in",
    onUpdate() {
      const t = progressObj.t;
      const { x, y } = bezier2(t, P0, P1, P2);

      setX(x);
      setY(y);

      const fadeProgress = mapFade(t);
      setOpacity(1 - fadeEase(fadeProgress));
    },
    onComplete() {
      floatingIcon.remove();

      gsap.fromTo(
        cartIcon,
        { x: 0, y: 0, scale: 1 },
        { x: 10, y: 10, scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 }
      );

      cartCount++;
      document.getElementById("cart-count").textContent = cartCount;
    }
  });
});