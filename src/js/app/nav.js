import Module from './module';

export default class Nav extends Module {

  handleButtonClick() {
    this.button.attr('aria-pressed') === 'false'?
    this.button.attr('aria-pressed','true'):
    this.button.attr('aria-pressed','false');
    this.button.hasClass('nav-open')?
    (
      this.button.removeClass('nav-open'),
      this.button.addClass('nav-close')
    ):
    (
      this.button.addClass('nav-open'),
      this.button.removeClass('nav-close')
    )
    this.nav.slideToggle('slow');
    this.nav.attr('aria-expanded') === 'false'?
    this.nav.attr('aria-expanded', 'true'):
    this.nav.attr('aria-expanded', 'false');

  }
  init() {
    this.nav = this.find('nav');
    this.button = this.find('.toggle-nav');
    this.registerDomEvent('.toggle-nav', 'click', this.handleButtonClick.bind(this));
  };
}
