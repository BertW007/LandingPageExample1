export default class Banner {
  constructor() {
    this.direction = 0;
    this.delay = 5000;
    this.currentId = 'current';
    this.bannersId = '.banner-content';
    this.leftButtonId = '.banner-controls-left';
    this.rightButtonId = '.banner-controls-right';
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
        [['100%','0%'],['0%']]
      ]
    }
  }

  getAnimParameters(tr, es, dr, bg, cp) {
    return [
      {translateX: tr},
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

    d.bt.hasClass('banner-controls-left') ?
    this.setDirection(1):
    this.setDirection(0);
    this.isAnimating(d.cr) ||
    this.isAnimating(d.nx) ||
    d.cr.length !== 1?
    false:
    this.handleCurrentOut();
    d = {};
  }

  handleComplete() {
    this.cr = this.getCurrent();
    this.nx = this.getAbsNext();
    const remove = () => {
      this.cr.removeClass(this.currentId);
      this.nx.addClass(this.currentId);
      delete this.cr;
      delete this.nx;
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
            this.handleComplete()
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
          this.rotateBanner.apply(this)
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
    this.banners = this.find(this.bannersId);
    this.registerDomEvent(this.leftButtonId, 'click', this.handleClick.bind(this));
    this.registerDomEvent(this.rightButtonId, 'click', this.handleClick.bind(this));
    this.rotateBanner();
  };
}
