import Module from '../module'

export default class Outlines extends Module {
  constructor () {
    super()
    this.stateId = 'outline'
  }

  setElements () {
    this.elements = Array.from(arguments).map((arg) => {
      return this.find(arg)
    })
  }

  handleClick () {
    if (this.hasOutlines()) {
      this.removeOutlines()
    }
  }

  handleKeyPressed (e) {
    if (e.keyCode === 9 && !this.hasOutlines()) {
      this.addOutlines()
    }
  }

  addOutlines () {
    this.elements.forEach((element) => {
      element.addClass(this.stateId)
    })
  }

  removeOutlines () {
    this.elements.forEach((element) => {
      element.removeClass(this.stateId)
    })
  }

  hasOutlines () {
    let e = this.elements.filter((element) => {
      if (element.hasClass(this.stateId)) {
        return element
      } else {
        return false
      }
    })
    if (e.length > 0) {
      return true
    } else {
      return false
    }
  }

  init () {
    this.setElements('button', 'a', 'input', 'textarea')
    this.registerDomEvent(window, 'keydown', this.handleKeyPressed.bind(this))
    this.registerDomEvent(window, 'click', this.handleClick.bind(this))
  }
}
