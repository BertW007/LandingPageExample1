export default class Banner {
  constructor() {
    this.direction = 0;
    this.transitions = [
      [['-100%'],['0%','100%']],
      [['100%','0%'],['0%']]];
    this.delay = 5000;
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
      return $(banner).hasClass('current') && !$(banner).hasClass('velocity-animating')? banner: false;
    });
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
    }
  }

  handleClick(e) {

    let d = {
      bt: $(e.target),
      nx: $(this.getNext()),
    }

    d.bt.hasClass('banner-controls-left')?
    this.setDirection(1):
    this.setDirection(0);

    !d.nx.hasClass('velocity-animating') &&
    !d.nx.hasClass('velocity-animating')?
    this.handleCurrentOut():
    false;

    d = {};
  }

  handleComplete(n,c) {
    let d = {
        cr: c,
        nx: n,
    }
    return function remove() {
      d.cr.removeClass('current');
      d.nx.addClass('current');
      d = {};
    }
  }

  handleNextIn() {
      let d = this.getParameters();
      const remove = this.handleComplete(d.anx,d.cr);

      d.anx.css('display','flex');
      d.anx.velocity('stop').velocity(
        {translateX: this.transitions[d.dr][1]},
        {
          easing: 'easeOutCubic',
          duration: 1000,
          complete: remove,
        }
      );
      d = {};
  }

  handleCurrentOut() {
    let d = this.getParameters();
    d.anx.length > 0?
    d.cr.velocity('stop').velocity(
      {translateX: this.transitions[d.dr][0]},
      {
        easing: 'easeOutCubic',
        duration: 1000,
        begin: this.handleNextIn.apply(this),
        complete: this.rotateBanner.apply(this),
      }
    ):false;
    d = {};
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
    this.banners = this.find('.banner-content');
    this.registerDomEvent('.banner-controls-left', 'click', this.handleClick.bind(this));
    this.registerDomEvent('.banner-controls-right', 'click', this.handleClick.bind(this));
    this.rotateBanner();
  };
}
