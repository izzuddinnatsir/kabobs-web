import Smooth from 'smooth-scrolling'
const isMobile = require('ismobilejs')

class Parallax extends Smooth {

  constructor(opt) {
    super(opt)
    this.createExtraBound()
    this.resizing = false
    this.cache = null
    this.dom.divs = Array.prototype.slice.call(opt.divs, 0)
  }

  createExtraBound() {
    ['getCache', 'inViewport']
      .forEach((fn) => this[fn] = this[fn].bind(this))
  }

  resize() {
    this.resizing = true
    this.getCache()
    super.resize()
    this.resizing = false
  }

  getCache() {
    this.cache = []
    this.dom.divs.forEach((el, index) => {
      el.style.display = 'block'
      el.style.transform = 'none'
      const scrollY = this.vars.target
      const bounding = el.getBoundingClientRect()
      const bounds = {
        el: el,
        state: true,
        top: bounding.top + scrollY,
        left: bounding.left,
        center: bounding.height / 2,
        bottom: bounding.bottom + scrollY,
        speed: isMobile.tablet ? el.getAttribute('data-speed-tablet') || '-1' : isMobile.phone ? el.getAttribute('data-speed-phone') || '-1' : el.getAttribute('data-speed') || '-1',
        direction: el.getAttribute('data-direction') || null
      }
      if (index === 4) {
        console.log(bounding.top, scrollY, bounds.top)
      }
      // this.vars.bounding = bounding.bottom > this.vars.bounding ? bounding.bottom - window.innerHeight : this.vars.bounding;
      this.cache.push(bounds)
    })
    // get bounding value based on the container (.vs-section) height
    this.vars.bounding = this.dom.section.getBoundingClientRect().height - (this.vars.native ? 0 : this.vars.height)
  }

  run() {
    this.dom.divs.forEach(this.inViewport)
    this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1)
    super.run()
  }

  inViewport(el, index) {
    if (!this.cache || this.resizing) return
    const cache = this.cache[index]
    const current = this.vars.current
    const transformAsTrigger = (cache.top - current) * cache.speed
    const transform = cache.direction === 'top' ? -((cache.top - (current + this.vars.height)) * cache.speed) : (cache.top - (current + this.vars.height)) * cache.speed
    const top = Math.round((cache.top - this.vars.height + transformAsTrigger) - current)
    const bottom = Math.round((cache.bottom + transform) - current)
    const inview = bottom > 0 && top < 0
    if (inview) {
      // el.style.border = '2px solid green'
      // el.style.display = 'block'
      el.style[this.prefix] = this.getTransform(transform)
    } else {
      // add red border if out of viewport
      // el.style.border = '2px solid red'
    }
  }
}

export default Parallax