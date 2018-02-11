import Module from '../module';

export default class Outlines extends Module {
  constructor() {
    super();
    this.stateId = 'outline';
  }

  setElements() {
    this.elements = Array.from(arguments).map((arg) => {
      return this.find(arg);
    })
  }

  handleClick() {
    this.hasOutlines()? this.removeOutlines(): false;
  }

  handleKeyPressed(e) {
    e.keyCode === 9 && !this.hasOutlines()? this.addOutlines(): false;
  }

  addOutlines() {
    this.elements.forEach((element) => {
      element.addClass(this.stateId)
    })
  }

  removeOutlines() {
    this.elements.forEach((element) => {
      element.removeClass(this.stateId)
    })
  }

  hasOutlines() {
    let e = this.elements.filter((element) => {
      return element.hasClass(this.stateId)? element: false;
    });
    return e.length > 0? true: false;
  }

  init() {
    this.setElements('button', 'a', 'input', 'textarea');
    this.registerDomEvent(window, 'keydown', this.handleKeyPressed.bind(this));
    this.registerDomEvent(window, 'click', this.handleClick.bind(this));
  }
}
