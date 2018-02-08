import Banner from './banner';

export default class Clients extends Banner {
  constructor() {
    super();
    this.animPatternVariants = [
      {'opacity': [1,0]},
      {'opacity': [0,1]}
    ]
  }

  getAnimParameters() {
    return {
      easing: 'linear',
      duration: 1000,
      begin: this.bg,
      complete: this.cp,
    }
  }

  handleNextIn() {
    this.anx.addClass(this.currentId);
    this.cr.removeClass(this.currentId);
    delete this.cp;
    this.anim(this.anx, this.animPatternVariants[0], this.getAnimParameters());
    delete this.anx;
    delete this.cr;
  }

  handleCurrentOut() {
    this.cr = this.getCurrent();
    this.anx = this.getAbsNext();
    this.cp = this.handleNextIn.bind(this);
    this.anx.length > 0?
    this.anim(this.cr, this.animPatternVariants[1], this.getAnimParameters()): false;
  }

  initCurrent() {
    this.getCurrent().css('opacity',1);
  }

  init() {
    this.setModuleId('clients');
    this.banners = this.find(this.bannersId);
    this.initCurrent();
    this.registerDomEvent(this.leftButtonId, 'click', this.handleClick.bind(this));
    this.registerDomEvent(this.rightButtonId, 'click', this.handleClick.bind(this));
  }
}
