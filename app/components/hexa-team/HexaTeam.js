import React from 'react';
import PropTypes from 'prop-types';
import styles from './HexaTeam.module.css';

// HexaTeam component — HTML-only conversion without JSX (React.createElement)
// Accepts `members` prop (array) and mirrors the original DOM structure.
export default function HexaTeam(props) {
  const members = React.useMemo(function () {
    return props.members || [];
  }, [props.members]);
  const m1 = members[0] || {};
  const m2 = members[1] || {};
  const m3 = members[2] || {};
  const m4 = members[3] || {};

  const e = React.createElement;
  const wrapperRef = React.useRef(null);

  // Fit-to-viewport effect: if the rendered hex grid is taller than the
  // viewport, scale it down so it fits. We avoid changing globals — we
  // operate on the wrapper element only. This runs on mount and resize.
  React.useEffect(function () {
    var node = wrapperRef.current;
    if (!node) return;

  var fitDebounce = null;
    // set a sensible responsive --wrp baseline used by the CSS math
    node.style.setProperty('--wrp', 'clamp(480px, 90vw, 1200px)');
    // Ensure no leftover transform (we don't use CSS transforms in the final approach)
    node.style.removeProperty('transform');

    // compute a numeric baseline for --wrp using the component's parent width
    // Prefer the parent container so the grid fits the page layout. Use a
    // narrower factor (0.7) to better match the original export proportions.
    function resolveBaseWrp() {
      try {
        var parent = node.parentElement;
        var parentWidth = 0;
        if (parent && parent.getBoundingClientRect) {
          parentWidth = Math.floor(parent.getBoundingClientRect().width || 0);
        }
        if (!parentWidth) {
          parentWidth = Math.floor(window.innerWidth || document.documentElement.clientWidth);
        }
        // Use 70% of the container as a starting point; clamp to reasonable bounds
        var w = Math.floor(parentWidth * 0.7);
        w = Math.max(360, Math.min(1200, w));
        return w;
      } catch (e) {
        return 640;
      }
    }

    function fit() {
      if (fitDebounce) {
        clearTimeout(fitDebounce);
      }
      fitDebounce = setTimeout(function () {
        // Start with a numeric --wrp so CSS math is deterministic
        var base = resolveBaseWrp();
        node.style.setProperty('--wrp', base + 'px');

        // Measure the natural height after layout
        // Use requestAnimationFrame to ensure layout is updated
        requestAnimationFrame(function () {
          var rect = node.getBoundingClientRect();
          var h = rect.height || 0;
          var winH = window.innerHeight || document.documentElement.clientHeight;
          if (h > 0 && h > winH) {
            // reduce --wrp proportionally so the CSS-driven layout fits vertically
            var newWrp = Math.floor(base * (winH / h));
            // clamp to minimum to avoid collapsing
            newWrp = Math.max(newWrp, 240);
            node.style.setProperty('--wrp', newWrp + 'px');
          }
        });
      }, 80);
    }

    // Initial fit and on resize
    fit();
    window.addEventListener('resize', fit);
    // Background images are applied via inline styles on anchors (not <img> tags)
    // so their network loading won't trigger DOM image load events. To ensure
    // layout fits after those images load, create temporary Image objects to
    // preload the URLs used by this component and call `fit` on load.
    var bgUrls = [];
    try {
      // collect image URLs from the members prop (we depend on `members`)
      if (members && members.length) {
        members.forEach(function (m) {
          if (m && m.image) bgUrls.push(m.image);
          if (m && m.teamImage) bgUrls.push(m.teamImage);
        });
      }
    } catch (e) {
      // ignore
    }

    var loaders = [];
    var loadPromises = [];
    bgUrls.forEach(function (url) {
      if (!url) return;
      try {
        var imgObj = new Image();
        var p = new Promise(function (res) {
          imgObj.onload = function () { res(true); };
          imgObj.onerror = function () { res(false); };
        });
        imgObj.src = url;
        loaders.push(imgObj);
        loadPromises.push(p);
      } catch (err) {
        // ignore
      }
    });

    // When all background images finish (success or error), run a final fit
    if (loadPromises.length) {
      Promise.all(loadPromises).then(function () {
        // give the browser a tick to apply background-image styles
        setTimeout(fit, 120);
      });
    }

    return function () {
      window.removeEventListener('resize', fit);
      // clear any pending debounce
      if (fitDebounce) clearTimeout(fitDebounce);
      // drop image handlers
      loaders.forEach(function (i) {
        try { i.onload = null; i.onerror = null; } catch (e) {}
      });
    };
  }, [members]);

  // helper to join module class names easily
  function klass() {
    return Array.prototype.slice.call(arguments).map(function (n) {
      return styles[n] || n;
    }).join(' ');
  }

  return e(
    'div',
    { className: styles.hexWrap, ref: wrapperRef },
    // top-left accent hex
    e('div', { className: klass('hex', 'tar', 'negr'), 'data-h2': m1.name || '' }),
    // heading pieces
    e('div', { className: klass('hex', 'a1'), 'data-h1': 'Our' }),
    e('div', { className: klass('hex', 'a2'), 'data-h1': 'Team' }),
    // single hex with person name
    e('div', { className: styles.hex, 'data-h2': m2.name || '' }),
    e('div', { className: klass('hex', 'a2') }),
    // card/layer 1
    e(
      'div',
      { className: klass('hex', 'hexLayer'), id: 'm1' },
      e('div', { className: klass('hex', 'slideReveal'), 'data-h3': m1.title || '' }),
      e('a', {
        className: styles.hex,
        href: '#m1',
        style: { backgroundImage: 'url(' + (m1.image || '') + ')' },
      })
    ),
    // card/layer 2
    e(
      'div',
      { className: klass('hex', 'hexLayer'), id: 'm2' },
      e('div', { className: klass('hex', 'slideReveal'), 'data-h3': m2.title || '' }),
      e('a', {
        className: klass('hex', 'tot'),
        href: '#m2',
        style: { backgroundImage: 'url(' + (m2.image || '') + ')' },
      })
    ),
    e('div', { className: klass('hex', 'a2') }),
    e('div', { className: klass('hex', 'tar'), 'data-h2': m3.name || '' }),
    // card/layer 3
    e(
      'div',
      { className: klass('hex', 'hexLayer'), id: 'm3' },
      e('div', { className: klass('hex', 'slideReveal'), 'data-h3': m3.title || '' }),
      e('a', {
        className: styles.hex,
        href: '#m3',
        style: { backgroundImage: 'url(' + (m3.image || '') + ')' },
      })
    ),
    // card/layer 4
    e(
      'div',
      { className: klass('hex', 'hexLayer'), id: 'm4' },
      e('div', { className: klass('hex', 'slideReveal'), 'data-h3': m4.title || '' }),
      e('a', {
        className: klass('hex', 'tob'),
        href: '#m4',
        style: { backgroundImage: 'url(' + (m4.image || '') + ')' },
      })
    ),
    e('div', { className: klass('hex', 'negr'), 'data-h2': m4.name || '' }),
    // lower-left team accent hex
    e('div', { className: klass('hex', 'a1'), style: { backgroundImage: 'url(' + (m1.teamImage || '') + ')' } }),
    e('div', { className: klass('hex', 'a1') }),
    e('div', { className: klass('hex', 'a1') }),
    e('a', { href: '#', className: styles.overlay })
  );
}

HexaTeam.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      image: PropTypes.string,
      teamImage: PropTypes.string,
    })
  ),
};

HexaTeam.defaultProps = { members: [] };
