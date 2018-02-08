export default class Banner {
  constructor() {
    this.modulePrefix = '.';
    this.moduleSuffix = '-';
    this.direction = 0;
    this.delay = 5000;
    this.currentId = 'current';
  }

  setModuleId(id) {
    this.moduleId = this.modulePrefix + id + this.moduleSuffix;
    this.bannersId = this.moduleId + 'content';
    this.leftButtonId = this.moduleId + 'controls-left';
    this.rightButtonId = this.moduleId + 'controls-right';
  }

  getDirection() {
    return this.direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  getNext() {
    return this.banners[this.banners.index(this.getCurrent())+1];
  }

  getPrev() {
    return this.banners[this.banners.index(this.getCurrent())-1];
  }

  getCurrent() {
    return this.banners.filter((key, banner) => {
      return $(banner).hasClass(this.currentId) && !this.isAnimating(banner)? banner: false;
    });
  }

  isAnimating(item) {
    return $(item).hasClass('velocity-animating');
  }

  getAbsNext() {
    let n = this.getNext();
    const p = this.getPrev(),
          dr = this.getDirection();
    dr === 0? n = $(n): n = $(p);
    return n;
  }

  getParameters() {
    return {
      anx: this.getAbsNext(),
      nx: this.getNext(),
      pr: this.getPrev(),
      cr: this.getCurrent(),
      dr: this.getDirection(),
      es: 'easeOutCubic',
      at: 1000,
      tr: [
        [['-100%'],['0%','100%']],
        [['100%','0%'],['0%']],
        ['0px', '-50px']
      ]
    }
  }

  getAnimParameters(tr, es, dr, bg, cp, tt) {
    const trs = tt? {translateY: tr}: {translateX: tr};
    return [
      trs,
      {
        easing: es,
        duration: dr,
        begin: bg,
        complete: cp,
      }
    ];
  }

  handleClick(e) {

    let d = {
      bt: $(e.target),
      nx: this.getNext(),
      cr: this.getCurrent(),
    }

    d.bt.hasClass(this.leftButtonId.split('.').join("")) ?
    this.setDirection(1):
    this.setDirection(0);
    this.isAnimating(d.cr) ||
    this.isAnimating(d.nx) ||
    d.cr.length !== 1?
    false:
    this.handleCurrentOut();
    d = {};
  }

  handleNextContentIn() {
    let d = this.getParameters(),
        i = this.anx.find('>*'),
        a = this.getAnimParameters(
          d.tr[2],
          d.es,
          d.at,
          null,
          null,
          1
        );
    this.anim(i, a[0],a[1]);

    d = {};
    i = {};
    d = [];
  }

  handleComplete() {
    this.cr = this.getCurrent();
    this.anx = this.getAbsNext();
    const remove = () => {
      this.cr.removeClass(this.currentId);
      this.anx.addClass(this.currentId);
      this.handleNextContentIn();
      delete this.cr;
      delete this.anx;
    }
    return remove;
  }

  handleNextIn() {
      let d = this.getParameters(),
          a = this.getAnimParameters(
            d.tr[d.dr][1],
            d.es,
            d.at,
            null,
            this.handleComplete(),
            null
          );
      this.anim(d.anx, a[0],a[1]);
      d = {};
      a = [];
  }

  handleCurrentOut() {
    let d = this.getParameters(),
        a = this.getAnimParameters(
          d.tr[d.dr][0],
          d.es,
          d.at,
          this.handleNextIn.apply(this),
          this.rotateBanner.apply(this),
          null
        );

    d.anx.length > 0?
    this.anim(d.cr, a[0],a[1]): false;
    d = {};
    a = [];
  }

  rotateBanner() {
    const nextRotation = () => {
      let d = this.getParameters();
      d.nx && !d.pr ? this.setDirection(0):false;
      d.pr && !d.nx ? this.setDirection(1):false;
      this.handleCurrentOut();
      d = {};
    }
    clearTimeout(this.id);
    this.id = setTimeout(nextRotation, this.delay);
  }


  init() {
    this.setModuleId('banner');
    this.banners = this.find(this.bannersId);
    this.registerDomEvent(this.leftButtonId, 'click', this.handleClick.bind(this));
    this.registerDomEvent(this.rightButtonId, 'click', this.handleClick.bind(this));
    this.rotateBanner();
  };
}
