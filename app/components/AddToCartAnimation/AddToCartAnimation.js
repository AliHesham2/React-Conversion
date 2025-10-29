import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './AddToCartAnimation.css';

/**
 * AddToCartAnimation Component
 * 
 * This component displays a grid of products with images, titles, and prices.
 * Each product has an 'Add to Cart' button that triggers an animation when clicked.
 * The animation shows the product image flying from the button to the cart icon.
 * The cart icon displays a count of items added.
 * 
 * @param {Array} products - Array of product objects containing id, title, price, and image
 */

const AddToCartAnimation = ({ products = [
  {
    id: 1,
    title: 'Polariod',
    price: '$300',
    image: 'https://assets.codepen.io/204808/yoann-siloine-beYOfeTV5Zo-unsplash.jpg'
  },
  {
    id: 2,
    title: 'NIKE',
    price: '$300',
    image: 'https://assets.codepen.io/204808/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg'
  },
  {
    id: 3,
    title: 'Game Boy',
    price: '$300',
    image: 'https://assets.codepen.io/204808/mike-meyers-v8XaVfyo41Q-unsplash.jpg'
  },
  {
    id: 4,
    title: 'Camera',
    price: '$300',
    image: 'https://assets.codepen.io/204808/lokesh-paduchuri-CsvF30-9bX8-unsplash.jpg'
  },
  {
    id: 5,
    title: 'Shoes',
    price: '$300',
    image: 'https://assets.codepen.io/204808/irene-kredenets-dwKiHoqqxk8-unsplash.jpg'
  },
  {
    id: 6,
    title: 'Marshall Earbuds',
    price: '$300',
    image: 'https://assets.codepen.io/204808/gaurav-kumar-HRjOdB1bf_Y-unsplash.jpg'
  },
  {
    id: 7,
    title: 'Chanel N°5',
    price: '$300',
    image: 'https://assets.codepen.io/204808/fernando-andrade-potCPE_Cw8A-unsplash.jpg'
  },
  {
    id: 8,
    title: 'Apple Watch',
    price: '$300',
    image: 'https://assets.codepen.io/204808/david-svihovec-v8BDEj9bfcs-unsplash.jpg'
  }
] }) => {
  // State to track the number of items in cart
  const [cartCount, setCartCount] = useState(0);
  // Refs to DOM elements for event handling
  const productListRef = useRef(null);
  const cartIconRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP ease function for the fade effect
    const fadeEase = gsap.parseEase("power2.in");
    // Function to map progress to fade value
    const mapFade = (t) => gsap.utils.clamp(0, 1, (t - 0.5) / 0.5);

    // Bezier curve function to calculate the path of the flying item
    // P0: start point, P1: control point, P2: end point
    const bezier2 = (t, P0, P1, P2) => {
      return {
        x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
        y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y
      };
    };

    // Event delegation for add to cart buttons
    // Using a single listener on the parent for better performance
    const handleProductListClick = (e) => {
      // Check if a .add-to-cart button was clicked (or inside it)
      const button = e.target.closest(".add-to-cart");
      if (!button) return; // Exit if click wasn't on a cart button

      // Get the position of the button and cart icon for the animation
      const startRect = button.getBoundingClientRect();
      const endRect = cartIconRef.current.getBoundingClientRect();

      // Start point (center of the button)
      const P0 = {
        x: startRect.left + startRect.width / 2,
        y: startRect.top + startRect.height / 2
      };
      // End point (center of the cart icon)
      const P2 = {
        x: endRect.left + endRect.width / 2,
        y: endRect.top + endRect.height / 2
      };

      // Control point for the bezier curve (creates the arc)
      const curveHeight = 200;
      const P1 = { x: (P0.x + P2.x) / 2, y: Math.min(P0.y, P2.y) - curveHeight };

      // Create a floating icon that will animate from button to cart
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

      // Get the image source from the button's data-image attribute
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

      // Create GSAP setters for efficient animation updates
      const setX = gsap.quickSetter(floatingIcon, "x", "px");
      const setY = gsap.quickSetter(floatingIcon, "y", "px");
      const setOpacity = gsap.quickSetter(floatingIcon, "opacity");

      // Object to track animation progress
      const progressObj = { t: 0 };

      // Animate the progress object from 0 to 1
      gsap.to(progressObj, {
        duration: 0.7,
        t: 1,
        ease: "power1.in",
        // Update function called on each frame
        onUpdate() {
          const t = progressObj.t;
          // Calculate position on the bezier curve
          const { x, y } = bezier2(t, P0, P1, P2);

          setX(x);
          setY(y);

          // Calculate and apply opacity for fade effect
          const fadeProgress = mapFade(t);
          setOpacity(1 - fadeEase(fadeProgress));
        },
        // Function called when animation completes
        onComplete() {
          // Remove the floating icon from the DOM
          floatingIcon.remove();

          // Animate the cart icon to give visual feedback
          gsap.fromTo(
            cartIconRef.current,
            { x: 0, y: 0, scale: 1 },
            { x: 10, y: 10, scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 }
          );

          // Increment the cart count
          setCartCount(prevCount => prevCount + 1);
        }
      });
    };

    // Add event listener to the product list
    const productList = productListRef.current;
    if (productList) {
      productList.addEventListener("click", handleProductListClick);
    }

    // Cleanup function to remove event listener when component unmounts
    return () => {
      if (productList) {
        productList.removeEventListener("click", handleProductListClick);
      }
    };
  }, []);

  return (
    // Main container with full viewport width and no padding/margins
    <main style={{ width: '100vw', boxSizing: 'border-box', margin: 0, padding: 0 }}>
      {/* Component title */}
      <h1 className="heading">Add to Cart Animation</h1>

      {/* Product grid container */}
      <div className="product">
        {/* Product list with ref for event handling */}
        <ul className="product__list" ref={productListRef}>
          {/* Map through products array to create product cards */}
          {products.map((product) => (
            <li className="product__item" key={product.id}>
              <div>
                {/* Product image container */}
                <div>
                  <img 
                    className="product__img" 
                    src={product.image} 
                    alt={product.title} 
                  />
                </div>
                {/* Product details container */}
                <div className="product__content">
                  {/* Product title */}
                  <h2 className="product__title">{product.title}</h2>
                  {/* Product price */}
                  <div className="product__price">{product.price}</div>
                  {/* Add to cart button with data-image attribute for animation */}
                  <button 
                    className="product__button add-to-cart" 
                    data-image={product.image}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Fixed position cart icon with ref for animation target */}
      <button className="cart" ref={cartIconRef}>
        {/* Cart count badge */}
        <div className="cart__count">
          {/* Display current cart count */}
          <span id="cart-count" style={{ color: 'var(--color-black)' }}>{cartCount}</span>
        </div>
        {/* Cart SVG icon */}
        <svg className="cart__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="m10.62 14-1 2H19a1 1 0 0 1 0 2H9.62a2 2 0 0 1-1.79-2.89L8.9 13 5.32 4H3a1 1 0 0 1 0-2h2.32a2 2 0 0 1 1.86 1.26L7.88 5h13.01a1 1 0 0 1 .48.05 1 1 0 0 1 .56 1.3l-2.8 7a1 1 0 0 1-.93.63Zm-.12 5a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5Zm6 0a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5Z" />
        </svg>
      </button>
    </main>
  );
};

export default AddToCartAnimation;