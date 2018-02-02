export default class Banner {
  constructor() {
    this.direction = 0;
    this.transitions = [[['-100%'],['0%','100%']],[['100%','0%'],['0%']]];
    this.delay = 5000;
  }

  getCurrent() {
    return this.banners.filter((key, banner) => {
      return $(banner).hasClass('current') && !$(banner).hasClass('velocity-animating')? banner: false;
    });
  }

  handleClick(e) {
    let direction,
        next,
        current = this.getCurrent(),
        button = $(e.target);

    button.hasClass('banner-controls-left')?
    (
      direction = 1,
      next = $(this.banners[this.banners.index(current)-1])
    ):
    (
      direction = 0,
      next = $(this.banners[this.banners.index(current)+1])
    );

    next.length > 0 &&
    !next.hasClass('velocity-animating') &&
    !current.hasClass('velocity-animating')?
     (
       clearTimeout(this.id),
       this.handleAnimation(current, next, direction, this.rotateBanner.bind(this))
     ): false;
  }

  handleAnimation(c, n, d, fn) {

    const handleNextIn = () => {

      const handleComplete = () => {
        n.addClass('current');
        fn? fn(): false;
        fn = null;
        n = null;
      }

      n.css('display','flex');
      n.velocity('stop').velocity(
        {translateX: this.transitions[d][1]},
        {
          easing: 'easeOutCubic',
          duration: 1000,
          complete: handleComplete
        }
      );
    }

    const handleRemoveCurrent = () => {
      c.removeClass('current');
      c = null;
    }

    const handleCurrentOut = () => {
      c.velocity('stop').velocity(
        {translateX: this.transitions[d][0]},
        {
          easing: 'easeOutCubic',
          duration: 1000,
          complete: handleRemoveCurrent,
          begin: handleNextIn
        }
      );
    }
    handleCurrentOut();
  }

  rotateBanner() {
    const nextRotation = () => {
      let cr = this.getCurrent(),
          nx = this.banners[this.banners.index(cr)+1],
          pr = this.banners[this.banners.index(cr)-1];
      nx && !pr ? this.direction = 0:false;
      pr && !nx ? this.direction = 1:false;
      this.direction===0? false: nx = pr;
      nx = $(nx);
      this.handleAnimation(cr, nx, this.direction, this.rotateBanner.bind(this));
    }
    clearTimeout(this.id);
    this.id = setTimeout(nextRotation, this.delay);
  }

  initBanner() {
    this.sub('ACL', this.rotateBanner.bind(this));
  }

  init() {
    this.banners = this.find('.banner-content');
    this.initBanner();
    this.registerDomEvent('.banner-controls-left', 'click', this.handleClick.bind(this));
    this.registerDomEvent('.banner-controls-right', 'click', this.handleClick.bind(this));
  };
}
