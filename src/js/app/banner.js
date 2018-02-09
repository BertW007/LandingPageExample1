export default class Banner {
  constructor() {
    this.modulePrefix = '.';
    this.moduleSuffix = '-';
    this.direction = 0;
    this.delay = 5000;
    this.currentId = 'current';
    this.animPatternVariants = [
      [
        {translateX: '-100%'},
        {translateX: ['0%','100%']}
      ],
      [
        {translateX: ['100%','0%']},
        {translateX: '0%'}
      ],
      [
        {opacity: [1,0], translateY: ['0px', '-50px']}
      ]
    ]
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


  getAnimParameters(bg, cp, dl) {
    return {
      easing: 'easeOutCubic',
      duration: 1000,
      begin: bg,
      complete: cp,
      delay: dl || null,
    }
  }

  handleClick(e) {
    $(e.target).hasClass(this.leftButtonId.split('.').join("")) ?
    this.setDirection(1):
    this.setDirection(0);
    this.isAnimating(this.getCurrent()) ||
    this.isAnimating(this.getNext()) ||
    this.getCurrent().length !== 1?
    false:
    this.handleCurrentOut();
    d = {};
  }

  handleComplete() {
      this.anim(
        this.anx.find('>*'),
        this.animPatternVariants[2][0],
        this.getAnimParameters(null, null, 500)
      );
      this.anx.addClass(this.currentId);
      this.cr.removeClass(this.currentId);
      this.cr.find('>*').css('opacity',0);
      delete this.cr;
      delete this.anx;
  }

  handleNextIn() {
      this.anim(
        this.anx,
        this.animPatternVariants[this.getDirection()][1],
        this.getAnimParameters(null, this.handleComplete.apply(this))
      );
  }

  handleCurrentOut() {
    this.anx = this.getAbsNext();
    this.cr = this.getCurrent();

    this.anx.length > 0?
    this.anim(
      this.cr,
      this.animPatternVariants[this.getDirection()][0], this.getAnimParameters(
        this.handleNextIn.apply(this), this.rotateBanner.apply(this)
      )
    ):false;
  }

  toggleDirection() {
    this.getNext() && !this.getPrev() ? this.setDirection(0):false;
    this.getPrev() && !this.getNext() ? this.setDirection(1):false;
  }

  rotateBanner() {
    const nextRotation = () => {
      this.toggleDirection()
      this.handleCurrentOut();
    }
    clearTimeout(this.id);
    this.id = setTimeout(nextRotation, this.delay);
  }

  initCurrent() {
    this.getCurrent().find('>*').css('opacity',1);
  }

  init() {
    this.setModuleId('banner');
    this.banners = this.find(this.bannersId);
    this.initCurrent();
    this.registerDomEvent(this.leftButtonId, 'click', this.handleClick.bind(this));
    this.registerDomEvent(this.rightButtonId, 'click', this.handleClick.bind(this));
    this.rotateBanner();
  };
}
