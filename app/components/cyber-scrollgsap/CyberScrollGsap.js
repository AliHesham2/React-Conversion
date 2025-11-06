"use client";

import React, { useEffect, useRef } from 'react';
import styles from './CyberScrollGsap.module.css';

export default function CyberScrollGsap({ slides = [] }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || typeof window === 'undefined') return;

  // We'll dynamically import GSAP and its ScrollTrigger plugin (fixes default/namespace differences)
  let gsap;
  let ScrollTrigger;

    // Helper to load Lenis from CDN if it's not already available.
    const loadLenis = () => {
      if (window.Lenis) return Promise.resolve(window.Lenis);
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.19/bundled/lenis.min.js';
        s.async = true;
        s.onload = () => resolve(window.Lenis);
        s.onerror = reject;
        document.body.appendChild(s);
      });
    };

    let lenisInstance = null;
  let lenisRafId = null;

    const container = rootRef.current;
    const q = (sel) => container.querySelector(sel);
    const qa = (sel) => Array.from(container.querySelectorAll(sel));

    const mainSection = q(`.${styles.mainSection}`) || q('.main-section');
    const hero = q(`.${styles.hero}`) || q('.hero');
    const content = q(`.${styles.contentAfter}`) || q('.content-after');
    const contentBefore = q(`.${styles.contentBefore}`) || q('.content-before');
    const gallerySection = q(`.${styles.gallerySection}`) || q('.gallery-section');
    const images = qa(`.${styles.gallerySection} img`) .length ? qa(`.${styles.gallerySection} img`) : qa('.gallery-section .images img');
    const barcode = q(`.${styles.futuristicBarcode}`) || q('.futuristic-barcode');
    const barcodeBars = qa(`.${styles.futuristicBarcode} rect[style*="--bar-index"]`) || qa('.futuristic-barcode rect[style*="--bar-index"]');
    const dataPoints = qa(`.${styles.futuristicBarcode} circle[style*="--data-index"]`) || qa('.futuristic-barcode circle[style*="--data-index"]');
    const particles = qa(`.${styles.futuristicBarcode} circle[style*="--particle-index"]`) || qa('.futuristic-barcode circle[style*="--particle-index"]');
    const heroBarcode = q(`.${styles.heroBarcode}`) || q('.hero-barcode');
    const heroBarcodeContainer = q(`.${styles.heroBarcodeContainer}`) || q('.hero-barcode-container');
    const heroImage = q(`.${styles.pixelLoader}`) || q('.pixel-loader');
    const pixelOverlay = q(`.${styles.pixelOverlay}`) || q('.pixel-overlay');

    const precargarImagenes = () => {
      images.forEach(img => {
        const newImg = new Image();
        newImg.src = img.src;
      });
    };

    // color extraction utilities (copied & adapted)
    const rgbToHsl = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b); const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: h * 360, s: s * 100, l: l * 100 };
    };

    const hslToRgb = (h, s, l) => {
      h /= 360; s /= 100; l /= 100;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      let r, g, b;
      if (s === 0) r = g = b = l;
      else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    };

    const extraerColoresDominantes = (imagen) => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = 200; canvas.height = 200;
          ctx.drawImage(img, 0, 0, 200, 200);
          const imageData = ctx.getImageData(0, 0, 200, 200).data;
          const colorCounts = {};
          for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i], g = imageData[i+1], b = imageData[i+2], a = imageData[i+3];
            if (a < 100 || (r < 30 && g < 30 && b < 30)) continue;
            if (r > 240 && g > 240 && b > 240) continue;
            const roundedR = Math.round(r / 10) * 10;
            const roundedG = Math.round(g / 10) * 10;
            const roundedB = Math.round(b / 10) * 10;
            const key = `${roundedR},${roundedG},${roundedB}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
          }
          const sorted = Object.entries(colorCounts).sort(([,a],[,b]) => b-a).slice(0,6).map(([k]) => {
            const [r,g,b] = k.split(',').map(Number); return { r,g,b, key: k };
          });
          const filtered = [];
          const used = [];
          for (const c of sorted) {
            let similar = false;
            for (const u of used) {
              const dist = Math.sqrt(Math.pow(c.r-u.r,2)+Math.pow(c.g-u.g,2)+Math.pow(c.b-u.b,2));
              if (dist < 50) { similar = true; break; }
            }
            if (!similar) { filtered.push(c); used.push(c); if (filtered.length>=3) break; }
          }
          const finalColors = filtered.map(color => {
            const hsl = rgbToHsl(color.r, color.g, color.b);
            const enhanced = { h: hsl.h, s: Math.min(100, hsl.s * 1.2), l: Math.max(20, Math.min(80, hsl.l)) };
            const rgb = hslToRgb(enhanced.h, enhanced.s, enhanced.l);
            return `rgb(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)})`;
          });
          while (finalColors.length < 3) {
            const defaults = ['#00ff88', '#00ffff', '#0088ff'];
            finalColors.push(defaults[finalColors.length]);
          }
          resolve(finalColors.slice(0,3));
        };
        img.src = imagen.src;
      });
    };

    const aplicarColoresAlHero = async () => {
      if (!heroImage || !heroBarcode) return;
      try {
        const colores = await extraerColoresDominantes(heroImage);
        const crearVariaciones = (color) => {
          const rgb = color.match(/\d+/g).map(Number);
          const [r,g,b] = rgb;
          return {
            original: color,
            light: `rgb(${Math.min(255,r+30)},${Math.min(255,g+30)},${Math.min(255,b+30)})`,
            dark: `rgb(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)})`,
            vibrant: `rgb(${Math.min(255,Math.round(r*1.2))},${Math.min(255,Math.round(g*1.2))},${Math.min(255,Math.round(b*1.2))})`
          };
        };
        const variaciones = colores.map(crearVariaciones);
        const gradient = heroBarcode.querySelector('#heroBarcodeGradient');
        if (gradient) {
          const stops = gradient.querySelectorAll('stop');
          stops[0].setAttribute('stop-color', variaciones[0]?.original || '#00ff88');
          stops[1].setAttribute('stop-color', variaciones[1]?.vibrant || '#00ffff');
          stops[2].setAttribute('stop-color', variaciones[2]?.original || '#0088ff');
        }
        const scanLines = heroBarcode.querySelectorAll('line[style*="--scan-index"]');
        scanLines.forEach((line, index) => {
          const colorIndex = index % colores.length;
          const variation = index === 0 ? 'vibrant' : index === 1 ? 'light' : 'original';
          line.setAttribute('stroke', variaciones[colorIndex]?.[variation] || colores[colorIndex] || '#00ff88');
        });
      } catch (e) {
        // ignore and continue with defaults
      }
    };

    // wait for an image to be loaded/decoded before using it for canvas color extraction
    const waitForImage = (img) => {
      return new Promise((resolve) => {
        if (!img) return resolve();
        // already complete
        if (img.complete && img.naturalWidth !== 0) return resolve();
        // prefer decode() when available
        if (img.decode) {
          img.decode().then(resolve).catch(() => {
            // fallback to onload if decode fails
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    };

    const observarCambiosEnHero = () => {
      if (!heroImage) return;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            setTimeout(() => aplicarColoresAlHero(), 500);
          }
        });
      });
      observer.observe(heroImage, { attributes: true, attributeFilter: ['src'] });
    };

    const animarCodigoBarras = () => {
      if (!barcode) return;

      // fallback element collections in case CSS-module scoping or attribute selectors fail
      const bars = (barcodeBars && barcodeBars.length) ? barcodeBars : Array.from(barcode.querySelectorAll('rect'));
      const datas = (dataPoints && dataPoints.length) ? dataPoints : Array.from(barcode.querySelectorAll('circle'));
      const parts = (particles && particles.length) ? particles : Array.from(barcode.querySelectorAll('circle'));

      // debug counts (helps when testing in browser console)
      try { console.debug('animarCodigoBarras counts', { bars: bars.length, dataPoints: datas.length, particles: parts.length }); } catch (e) {}

      gsap.fromTo(barcode, { scale: 0, rotation: 180, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'back.out(1.7)', delay: 0.5 });

      if (bars && bars.length) {
        gsap.fromTo(bars, { scaleY: 0, transformOrigin: 'center bottom' }, { scaleY: 1, duration: 0.8, stagger: 0.05, ease: 'power2.out', delay: 1.2 });
        gsap.to(bars, { opacity: 0.3, duration: 0.1, stagger: { amount: 0.5, from: 'random' }, ease: 'power2.inOut', yoyo: true, repeat: -1, delay: 3 });
      }

      if (datas && datas.length) {
        gsap.fromTo(datas, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'elastic.out(1, 0.3)', delay: 1.8 });
      }

      if (parts && parts.length) {
        gsap.fromTo(parts, { scale: 0, opacity: 0, y: 0 }, { scale: 1, opacity: 0.7, y: -20, duration: 1, stagger: 0.2, ease: 'power2.out', delay: 2.2 });
      }

      gsap.to(barcode, { filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.8))', duration: 2, ease: 'power2.inOut', yoyo: true, repeat: -1, delay: 2.5 });
    };

    const animarImagenes = () => {
      if (!images || images.length === 0) return;
      gsap.fromTo(images, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: 'power2.out', delay: 0.2 });
    };

    const mostrarGaleria = () => {
      if (!gallerySection || gallerySection.classList.contains('animated')) return;
      gallerySection.classList.add('animated');
      const imagesLoaded = Array.from(images).every(img => img.complete);
      if (imagesLoaded) animarImagenes();
      else {
        const loadPromises = Array.from(images).map(img => new Promise(resolve => { if (img.complete) resolve(); else { img.onload = resolve; img.onerror = resolve; } }));
        Promise.all(loadPromises).then(animarImagenes);
      }
    };

    const ocultarGaleria = () => {
      if (!gallerySection || !gallerySection.classList.contains('animated')) return;
      gallerySection.classList.remove('animated');
      gsap.to(images, { opacity: 0, x: 100, duration: 0.8, stagger: 0.1, ease: 'power2.in' });
    };

    // initialize Lenis + ScrollTrigger after dynamically importing GSAP
    const run = async () => {
      try {
        const gsapModule = await import('gsap');
        // gsap might be exported as default or as named export
        gsap = gsapModule.gsap || gsapModule.default || gsapModule;
        const stModule = await import('gsap/ScrollTrigger');
        ScrollTrigger = stModule.ScrollTrigger || stModule.default || stModule;
        if (gsap && ScrollTrigger && gsap.registerPlugin) {
          gsap.registerPlugin(ScrollTrigger);
          try { console.info('GSAP + ScrollTrigger registered'); } catch (e) {}
        }

        // Prefer importing Lenis from the local package for deterministic behavior
        try {
          const lenisModule = await import('@studio-freight/lenis');
          const Lenis = lenisModule.default || lenisModule.Lenis || lenisModule;
          try {
            lenisInstance = new Lenis();
            lenisInstance.on('scroll', ScrollTrigger.update);
            // Start a RAF loop to drive Lenis and keep ScrollTrigger in sync.
            const startLenisRaf = () => {
              const loop = (time) => {
                try { lenisInstance.raf(time); } catch (e) { /* ignore */ }
                try { ScrollTrigger.update(); } catch (e) { /* ignore */ }
                lenisRafId = requestAnimationFrame(loop);
              };
              lenisRafId = requestAnimationFrame(loop);
            };
            startLenisRaf();
            try { console.info('Lenis initialized (local)', !!lenisInstance); } catch (e) {}
          } catch (e) {
            console.warn('Lenis imported but failed to initialize', e);
            lenisInstance = null;
          }
        } catch (e) {
          // local import failed; we'll fallback to CDN after setup
          console.warn('Local Lenis import failed, will try CDN fallback', e);
        }

        // expose a function that sets up animations and ScrollTrigger
        const setupAnimations = async () => {
          try {
            precargarImagenes();
            // ensure hero image is fully loaded/decoded before extracting colors or animating SVGs
            await waitForImage(heroImage);
            aplicarColoresAlHero();
            observarCambiosEnHero();
            animarCodigoBarras();


            // hero animations (guard elements to avoid GSAP 'target null not found' warnings)
            if (hero) gsap.to(hero, { '--black': '0%', '--transparent': '0%', '--degrade': '-90deg', duration: 2, ease: 'power2.out' });
            if (heroImage) gsap.to(heroImage, { filter: 'contrast(100%) saturate(100%)', scale: 1, duration: 2, ease: 'power2.out' });
            if (pixelOverlay) gsap.to(pixelOverlay, { opacity: 0, duration: 2, ease: 'power2.out', delay: 1 });

            if (heroBarcodeContainer) gsap.fromTo(heroBarcodeContainer, { opacity: 0, scale: 0, rotation: 45, y: 50 }, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 2, ease: 'back.out(1.7)', delay: 1.5 });

            const heroBars = heroBarcode?.querySelectorAll('rect[style*="--bar-index"]');
            if (heroBars) gsap.fromTo(heroBars, { scaleY: 0, transformOrigin: 'center bottom' }, { scaleY: 1, duration: 1.2, stagger: 0.03, ease: 'power2.out', delay: 3.2 });

            const heroDataPoints = heroBarcode?.querySelectorAll('circle[style*="--data-index"]');
            if (heroDataPoints) gsap.fromTo(heroDataPoints, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'elastic.out(1, 0.3)', delay: 4 });

            const heroParticles = heroBarcode?.querySelectorAll('circle[style*="--particle-index"]');
            if (heroParticles) gsap.fromTo(heroParticles, { scale: 0, opacity: 0, y: 0 }, { scale: 1, opacity: 0.7, y: -30, duration: 1.5, stagger: 0.3, ease: 'power2.out', delay: 4.5 });

            gsap.to(heroBarcode, { filter: 'drop-shadow(0 0 40px rgba(0, 255, 136, 1))', duration: 3, ease: 'power2.inOut', yoyo: true, repeat: -1, delay: 5 });

            // Create ScrollTrigger (works with native scroll or Lenis if initialized)
            ScrollTrigger.create({
              trigger: mainSection || container,
              start: 'top top',
              end: `+=${window.innerHeight * 3}px`,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              onUpdate: (self) => {
                const progress = self.progress;
                if (progress < 0.2) gsap.to(mainSection, { scale: 1 - (progress * 0.8) });
                else gsap.to(mainSection, { scale: 0.8 });

                if (progress > 0.3) gsap.to(content, { '--degrade2': '0deg', '--transparent2': '0%', '--black2': '0%', duration: 1.5, ease: 'power2.out' });
                else gsap.to(content, { '--degrade2': '-150deg', '--transparent2': '100%', '--black2': '100%', duration: 1.5, ease: 'power2.out' });

                if (progress > 0.6) gsap.to(contentBefore, { '--transparent3': '0%', '--black3': '0%', duration: 2, ease: 'power2.out' });
                else gsap.to(contentBefore, { '--transparent3': '100%', '--black3': '100%', duration: 2, ease: 'power2.out' });

                if (progress > 0.85) gsap.to(gallerySection, { '--transparent4': '0%', '--black4': '0%', duration: 2, ease: 'power2.out' });
                else gsap.to(gallerySection, { '--transparent4': '100%', '--black4': '100%', duration: 2, ease: 'power2.out' });

                if (progress > 0.9) mostrarGaleria(); else ocultarGaleria();
              }
            });
          } catch (e) {
            console.error('GSAP animation setup error', e);
          }
        };

        // Run animations (setupAnimations will wait for hero image where needed)
        setupAnimations();

        // If Lenis wasn't initialized from the local package, attempt CDN fallback
        if (!lenisInstance) {
          loadLenis().then(() => {
            try {
              lenisInstance = new window.Lenis();
              lenisInstance.on('scroll', ScrollTrigger.update);
              // start RAF loop for CDN-provided Lenis
              const startLenisRafCdn = () => {
                const loop = (time) => {
                  try { lenisInstance.raf(time); } catch (e) {}
                  try { ScrollTrigger.update(); } catch (e) {}
                  lenisRafId = requestAnimationFrame(loop);
                };
                lenisRafId = requestAnimationFrame(loop);
              };
              startLenisRafCdn();
              try { console.info('Lenis initialized (cdn)', !!lenisInstance); } catch (e) {}
            } catch (e) {
              console.warn('Lenis loaded from CDN but integration failed', e);
            }
          }).catch((err) => {
            console.warn('Could not load Lenis from CDN either, continuing with native scroll', err);
          });
        }
      } catch (e) {
        console.error('GSAP dynamic import failed', e);
      }
    };

    run();

    // cleanup
    return () => {
      try { if (lenisInstance && lenisInstance.destroy) lenisInstance.destroy(); } catch (e) {}
      try { if (lenisRafId) cancelAnimationFrame(lenisRafId); } catch (e) {}
      try { ScrollTrigger.getAll().forEach(st => st.kill()); } catch (e) {}
      try { gsap.clear(); } catch (e) {}
    };
  }, []);

  // inject original SVGs (hero barcode and futuristic barcode) as HTML strings to preserve exact markup/attributes
  const HERO_SVG = `
    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" class="hero-barcode">
      <defs>
        <linearGradient id="heroBarcodeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0088ff;stop-opacity:1" />
        </linearGradient>
        <filter id="heroGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="10" y="20" width="3" height="80" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 1"/>
      <rect x="15" y="30" width="2" height="60" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 2"/>
      <rect x="18" y="10" width="4" height="100" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 3"/>
      <rect x="24" y="40" width="2" height="40" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 4"/>
      <rect x="28" y="15" width="3" height="90" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 5"/>
      <rect x="33" y="50" width="2" height="20" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 6"/>
      <rect x="37" y="25" width="5" height="70" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 7"/>
      <rect x="44" y="35" width="2" height="50" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 8"/>
      <rect x="48" y="5" width="3" height="110" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 9"/>
      <rect x="53" y="45" width="2" height="30" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 10"/>
      <rect x="57" y="20" width="4" height="80" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 11"/>
      <rect x="63" y="55" width="2" height="10" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 12"/>
      <rect x="67" y="12" width="3" height="96" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 13"/>
      <rect x="72" y="40" width="2" height="40" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 14"/>
      <rect x="76" y="18" width="6" height="84" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 15"/>
      <rect x="84" y="50" width="2" height="20" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 16"/>
      <rect x="88" y="10" width="3" height="100" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 17"/>
      <rect x="93" y="35" width="2" height="50" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 18"/>
      <rect x="97" y="22" width="4" height="76" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 19"/>
      <rect x="103" y="60" width="2" height="0" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 20"/>
      <rect x="107" y="15" width="3" height="90" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 21"/>
      <rect x="112" y="45" width="2" height="30" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 22"/>
      <rect x="116" y="25" width="5" height="70" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 23"/>
      <rect x="123" y="55" width="2" height="10" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 24"/>
      <rect x="127" y="8" width="3" height="104" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 25"/>
      <rect x="132" y="40" width="2" height="40" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 26"/>
      <rect x="136" y="20" width="4" height="80" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 27"/>
      <rect x="142" y="50" width="2" height="20" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 28"/>
      <rect x="146" y="12" width="3" height="96" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 29"/>
      <rect x="151" y="35" width="2" height="50" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 30"/>
      <rect x="155" y="18" width="5" height="84" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 31"/>
      <rect x="162" y="60" width="2" height="0" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 32"/>
      <rect x="166" y="10" width="3" height="100" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 33"/>
      <rect x="171" y="45" width="2" height="30" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 34"/>
      <rect x="175" y="25" width="4" height="70" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 35"/>
      <rect x="181" y="55" width="2" height="10" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 36"/>
      <rect x="185" y="15" width="3" height="90" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 37"/>
      <rect x="190" y="40" width="2" height="40" fill="url(#heroBarcodeGradient)" filter="url(#heroGlow)" style="--bar-index: 38"/>
      <line x1="0" y1="60" x2="200" y2="60" stroke="#00ff88" stroke-width="2" opacity="0.8" style="--scan-index: 1"/>
      <line x1="0" y1="55" x2="200" y2="55" stroke="#00ffff" stroke-width="1" opacity="0.6" style="--scan-index: 2"/>
      <line x1="0" y1="65" x2="200" y2="65" stroke="#0088ff" stroke-width="1" opacity="0.6" style="--scan-index: 3"/>
      <circle cx="30" cy="60" r="2" fill="#00ff88" style="--data-index: 1"/>
      <circle cx="60" cy="60" r="2" fill="#00ffff" style="--data-index: 2"/>
      <circle cx="90" cy="60" r="2" fill="#0088ff" style="--data-index: 3"/>
      <circle cx="120" cy="60" r="2" fill="#00ff88" style="--data-index: 4"/>
      <circle cx="150" cy="60" r="2" fill="#00ffff" style="--data-index: 5"/>
      <circle cx="180" cy="60" r="2" fill="#0088ff" style="--data-index: 6"/>
      <circle cx="25" cy="30" r="1" fill="#00ff88" opacity="0.7" style="--particle-index: 1"/>
      <circle cx="55" cy="90" r="1" fill="#00ffff" opacity="0.7" style="--particle-index: 2"/>
      <circle cx="85" cy="25" r="1" fill="#0088ff" opacity="0.7" style="--particle-index: 3"/>
      <circle cx="115" cy="95" r="1" fill="#00ff88" opacity="0.7" style="--particle-index: 4"/>
      <circle cx="145" cy="35" r="1" fill="#00ffff" opacity="0.7" style="--particle-index: 5"/>
      <circle cx="175" cy="85" r="1" fill="#0088ff" opacity="0.7" style="--particle-index: 6"/>
    </svg>
  `;

  const FUTURISTIC_SVG = `
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" class="futuristic-barcode">
      <defs>
        <linearGradient id="barcodeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0088ff;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="5" y="10" width="2" height="60" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 1"/>
      <rect x="8" y="15" width="1" height="50" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 2"/>
      <rect x="10" y="5" width="3" height="70" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 3"/>
      <rect x="14" y="20" width="1" height="40" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 4"/>
      <rect x="16" y="8" width="2" height="64" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 5"/>
      <rect x="19" y="25" width="1" height="30" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 6"/>
      <rect x="21" y="12" width="4" height="56" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 7"/>
      <rect x="26" y="18" width="1" height="44" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 8"/>
      <rect x="28" y="3" width="2" height="74" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 9"/>
      <rect x="31" y="22" width="1" height="36" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 10"/>
      <rect x="33" y="15" width="3" height="50" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 11"/>
      <rect x="37" y="28" width="1" height="24" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 12"/>
      <rect x="39" y="7" width="2" height="66" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 13"/>
      <rect x="42" y="20" width="1" height="40" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 14"/>
      <rect x="44" y="10" width="4" height="60" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 15"/>
      <rect x="49" y="25" width="1" height="30" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 16"/>
      <rect x="51" y="5" width="2" height="70" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 17"/>
      <rect x="54" y="18" width="1" height="44" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 18"/>
      <rect x="56" y="12" width="3" height="56" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 19"/>
      <rect x="60" y="30" width="1" height="20" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 20"/>
      <rect x="62" y="8" width="2" height="64" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 21"/>
      <rect x="65" y="22" width="1" height="36" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 22"/>
      <rect x="67" y="15" width="4" height="50" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 23"/>
      <rect x="72" y="28" width="1" height="24" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 24"/>
      <rect x="74" y="5" width="2" height="70" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 25"/>
      <rect x="77" y="20" width="1" height="40" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 26"/>
      <rect x="79" y="10" width="3" height="60" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 27"/>
      <rect x="83" y="25" width="1" height="30" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 28"/>
      <rect x="85" y="8" width="2" height="64" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 29"/>
      <rect x="88" y="18" width="1" height="44" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 30"/>
      <rect x="90" y="12" width="4" height="56" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 31"/>
      <rect x="95" y="30" width="1" height="20" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 32"/>
      <rect x="97" y="5" width="2" height="70" fill="url(#barcodeGradient)" filter="url(#glow)" style="--bar-index: 33"/>
      <line x1="0" y1="40" x2="120" y2="40" stroke="#00ff88" stroke-width="1" opacity="0.8" style="--scan-index: 1"/>
      <line x1="0" y1="35" x2="120" y2="35" stroke="#00ffff" stroke-width="0.5" opacity="0.6" style="--scan-index: 2"/>
      <line x1="0" y1="45" x2="120" y2="45" stroke="#0088ff" stroke-width="0.5" opacity="0.6" style="--scan-index: 3"/>
      <circle cx="20" cy="40" r="1" fill="#00ff88" style="--data-index: 1"/>
      <circle cx="40" cy="40" r="1" fill="#00ffff" style="--data-index: 2"/>
      <circle cx="60" cy="40" r="1" fill="#0088ff" style="--data-index: 3"/>
      <circle cx="80" cy="40" r="1" fill="#00ff88" style="--data-index: 4"/>
      <circle cx="100" cy="40" r="1" fill="#00ffff" style="--data-index: 5"/>
      <circle cx="15" cy="20" r="0.5" fill="#00ff88" opacity="0.7" style="--particle-index: 1"/>
      <circle cx="35" cy="60" r="0.5" fill="#00ffff" opacity="0.7" style="--particle-index: 2"/>
      <circle cx="55" cy="15" r="0.5" fill="#0088ff" opacity="0.7" style="--particle-index: 3"/>
      <circle cx="75" cy="65" r="0.5" fill="#00ff88" opacity="0.7" style="--particle-index: 4"/>
      <circle cx="95" cy="25" r="0.5" fill="#00ffff" opacity="0.7" style="--particle-index: 5"/>
    </svg>
  `;

  return (
    <section className={`${styles.mainSection} main-section`} ref={rootRef}>
      <div className={`${styles.wrapperAction} wrapper-action`}>
        <div className={`${styles.hero} hero`} style={{ '--degrade': '-150deg', '--transparent': '100%', '--black': '100%' }}>
          <picture>
            <img className={`${styles.pixelLoader} pixel-loader`} src={slides[0]?.src || 'https://images.pexels.com/photos/8107822/pexels-photo-8107822.jpeg'} alt={slides[0]?.alt || 'hero'} />
          </picture>
          <div className={`${styles.pixelOverlay} pixel-overlay`} />

          <div className={`${styles.heroBarcodeContainer} hero-barcode-container`} dangerouslySetInnerHTML={{ __html: HERO_SVG }} />
        </div>

        <div className={styles.content}>
          <div className={`${styles.contentBefore} content-before`} style={{ '--transparent3': '100%', '--black3': '100%' }} />
          <div className={`${styles.contentAfter} content-after`} style={{ '--transparent2': '100%', '--black2': '100%' }}>
            <div className={styles.title}><h1>CYBER SCAN</h1></div>
            <div className={styles.description}>
              <div>
                <h2>Neural interface</h2>
                <p>Enter the cyber realm where reality dissolves into digital fragments. Advanced neural networks process visual data through pixelated matrices.</p>
              </div>
              <div>
                <div dangerouslySetInnerHTML={{ __html: FUTURISTIC_SVG }} />
                initiate connection
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.gallerySection} gallery-section`} style={{ '--transparent4': '100%', '--black4': '100%' }}>
        <div className={styles.images}>
          <picture><img src={slides[1]?.src || 'https://images.pexels.com/photos/8108093/pexels-photo-8108093.jpeg'} alt={slides[1]?.alt || 'img1'} loading="lazy" /></picture>
          <picture><img src={slides[2]?.src || 'https://images.pexels.com/photos/18152964/pexels-photo-18152964.jpeg'} alt={slides[2]?.alt || 'img2'} loading="lazy" /></picture>
        </div>
      </div>
    </section>
  );
}
