const anchor = document.querySelector('.anchor');
const hero = document.querySelector('.p-hero');
const initBlue = Math.floor(getComputedStyle(hero).getPropertyValue('--hero-blue'));
const initRed = Math.floor(getComputedStyle(hero).getPropertyValue('--hero-red'));

const instance = basicScroll.create({
  elem: anchor,
  from: 'top-bottom',
  to: 'bottom-bottom',
  direct: hero,
  inside: (instance, percentage, props) => {
    console.log('props', props);
  },
  props: {
    '--hero-red': {
       from: initRed,
       to: '250',
    },
    '--hero-blue': {
       from: initBlue,
       to: '360',
    },
    '--hero-vivid-x': {
       from: '-50%',
       to: '95%',
    },
    '--hero-sydney-x': {
       from: '50%',
       to: '-40%',
    },
  },
});

instance.start();