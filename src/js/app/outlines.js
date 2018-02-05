export default class Outlines {
  constructor() {
    this.buttonsId = 'button';
    this.linksId = 'a';
    this.stateId = 'outline';
  }
  handleClick() {
    this.hasOutlines()? this.removeOutlines(): false;
  }

  handleKeyPressed(e) {
    e.keyCode === 9 && !this.hasOutlines()? this.addOutlines(): false;
  }

  addOutlines() {
    this.buttons.addClass(this.stateId);
    this.links.addClass(this.stateId);
  }

  removeOutlines() {
    this.buttons.removeClass(this.stateId);
    this.links.removeClass(this.stateId);
  }

  hasOutlines() {
    return this.buttons.hasClass(this.stateId) && this.links.hasClass(this.stateId);
  }

  init() {
    this.buttons = this.find(this.buttonsId);
    this.links = this.find(this.linksId);
    this.registerDomEvent(window, 'keydown', this.handleKeyPressed.bind(this));
    this.registerDomEvent(window, 'click', this.handleClick.bind(this));
  }
}
