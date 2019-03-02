import '../css/style.scss'
import isMobile from 'ismobilejs'
import ParallaxSmooth from './custom/custom-smooth-scrolling'
import GSAP from 'gsap'

const scroller = new ParallaxSmooth({
  native: false,
  direction: 'vertical',
  listener: document.querySelector('.vs-viewport'),
  section: document.querySelector('.vs-section'),
  divs: document.querySelectorAll('*[data-speed]'),
  speed: isMobile.phone ? 0.15 : 0.075
})

scroller.init();