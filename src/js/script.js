import isMobile from 'ismobilejs'
import Smooth from 'smooth-scrolling'
import ParallaxSmooth from './custom/custom-smooth-parallax'
import { TweenLite, CSSRulePlugin, TweenMax, TimelineLite, Power1, TimelineMax } from 'gsap'
import Swiper from 'swiper'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'

const html = document.documentElement
const viewport = document.querySelector('#viewport')
const navTriggerBtn = document.querySelector('.topbar__navtrigger')
const navScreen = document.querySelector('.mainNav')
const navCloseBtn = document.querySelector('.mainNav__header__closeBtn')
const floatingKebab = document.querySelectorAll('.hero__kebab')
let request

const parallax = new ParallaxSmooth({
  native: false,
  direction: 'vertical',
  noscrollbar: isMobile.tablet && isMobile.phone ? true : false,
  listener: document.querySelector('.vs-viewport'),
  section: document.querySelector('.vs-section'),
  divs: document.querySelectorAll('*[data-speed]'),
  ease: isMobile.phone ? 0.06 : 0.075
})

const scroller = new Smooth({
  native: isMobile.tablet && isMobile.phone ? true : false,
  noscrollbar: isMobile.tablet && isMobile.phone ? true : false,
  direction: 'vertical',
  listener: document.querySelector('.vs-viewport'),
  section: document.querySelector('.vs-section')
})

var swiper = new Swiper(".swiper-container", {
  spaceBetween: 50,
  slidesPerView: 1,
  navigation: {
    nextEl: ".menuSlideNext",
    prevEl: ".menuSlidePrev"
  },
  pagination: {
    el: ".swiper-pagination"
  },
  hashNavigation: {
    replaceState: true,
    watchState: true
  },
  loop: true,
  effect: "fade"
});

initEventListeners()

function initEventListeners() {
  if (html.classList.contains('html-index')) {
    TweenLite.set(floatingKebab[0], { transform: 'translate3d(0, 6px, 0)' });
    TweenLite.set(floatingKebab[1], { transform: 'translate3d(0, -6px, 0)' });
    document.addEventListener('DOMContentLoad', indexPreloader)
    window.onload = indexOnLoad
  } else if (!html.classList.contains('html-index') && !html.classList.contains('html-menu') && !html.classList.contains('html-menu-slider')) {
    scroller.init();
    const repeatResize = new ResizeSensor(scroller.dom.section, function () {
      scroller.resize();
    })
    requestAnimationFrame(changeTriggerColor);
  } else if (html.classList.contains('html-menu')) {
    scroller.init()
    const repeatResize = new ResizeSensor(scroller.dom.section, function () {
      scroller.resize();
    })
  }


  navTriggerBtn.addEventListener('click', revealNav)
  navCloseBtn.addEventListener('click', hideNav)
}

function indexPreloader(e) {

}

function indexOnLoad(e) {
  const indexResize = new ResizeSensor(parallax.dom.section, function () {
    parallax.resize();
  })

  parallax.init();

  TweenMax.to(floatingKebab[0], 1, { transform: ('translate3d(0, -6px, 0)'), ease: Power1.easeInOut, yoyo: true, repeat: -1 });
  TweenMax.to(floatingKebab[1], 1, { transform: ('translate3d(0, 6px, 0)'), ease: Power1.easeInOut, yoyo: true, repeat: -1 });
}

function revealNav(e) {
  const circle = document.querySelector('.navtrigger__circle')
  const bars = 'navbar__trigger__rowbar'

  e.target === navTriggerBtn || e.target === circle || e.target.classList.contains(bars) ? startTween() : null

  function startTween() {
    TweenLite.set(navScreen, { display: 'flex' });
    TweenMax.to(navScreen, 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power1.easeOut });
  }
}

function hideNav(e) {
  const icon = e.target === document.querySelector('.mainNav__header__closeBtn img')
  const parent = e.target === navCloseBtn

  icon || parent ? startTween() : null

  function startTween() {
    TweenMax.to(navScreen, 0.4, { transform: 'translate3d(0, 100vh, 0)', ease: Power1.easeOut });
    TweenMax.to(navScreen, 0, { display: 'none', delay: 0.4 });
  }
}

function changeTriggerColor() {
  const pageHeader = document.querySelector('section.section--header').getBoundingClientRect().height

  request = requestAnimationFrame(changeTriggerColor)

  scroller.vars.current > pageHeader ? navTriggerBtn.classList.add('topbar__navtrigger--black') : navTriggerBtn.classList.remove('topbar__navtrigger--black');
}

