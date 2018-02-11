import Module from '../module';

export default class Nav extends Module {
  constructor() {
    super();
    this.slideSpeed = 'slow';
    this.buttonId = '.toggle-nav';
    this.contentId = 'nav';
    this.contentButtonId = '.nav-item';
    this.wrapperId = '.header-nav-wrapper';
    this.buttonStateId = 'aria-pressed';
    this.contentStateId = 'aria-expanded';
    this.buttonStateVariants = [
      'nav-close',
      'nav-open',
    ];
    this.wrapperStateVariants = [
      'scrolling',
    ];
    this.wrapperChangePosition = 50;
  }

  setState(element, stateId, state) {
    element.attr(stateId, state);
  }

  getState(element, stateId) {
    return element.attr(stateId) === 'false'? false: true;
  }

  toggleButtonClass(button) {
    button.hasClass(this.buttonStateVariants[1])?
      (
        button.removeClass(this.buttonStateVariants[1]),
        button.addClass(this.buttonStateVariants[0])
      ):
      (
        button.addClass(this.buttonStateVariants[1]),
        button.removeClass(this.buttonStateVariants[0])
      );
  }

  toggleButton(button) {
    this.getState(button, this.buttonStateId)?
    this.setState(button, this.buttonStateId, false):
    this.setState(button, this.buttonStateId, true);
  }

  toggleContent(bp) {
    this.getState(this.content, this.contentStateId)?
    this.setState(this.content, this.contentStateId, false):
    this.setState(this.content, this.contentStateId, true);
    bp?
    (
      $(window).width() < bp? this.content.slideToggle(this.slideSpeed): false
    ):
    this.content.slideToggle(this.slideSpeed);
  }

  handleButtonClick() {
    this.toggleButton(this.button);
    this.toggleButtonClass(this.button);
    this.toggleContent();
  }

  handleNavButtonsClick(e) {
    const button = $(e.currentTarget),
          target = $('#' + e.currentTarget.innerText.trim().toLowerCase());
    this.setAllNavButtonPressedState(false);
    this.toggleButton(button);
    this.anim(target, 'scroll', {duration: 2000, offset: -60, easing: 'easeInOutCubic'});
    this.toggleContent(768);
    $(window).width() < 768?
    (
      this.toggleButton(this.button),
      this.toggleButtonClass(this.button)
    ): false;
  }

  setAllNavButtonPressedState(state) {
    this.setState(this.navButtons, this.buttonStateId, state);
  }

  getScrollPosition() {
    return (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  }

  toggleWrapper() {
    this.getScrollPosition() > this.wrapperChangePosition?
      this.wrapper.hasClass(this.wrapperStateVariants[0])?
      false: this.wrapper.addClass(this.wrapperStateVariants[0]):
    this.wrapper.removeClass(this.wrapperStateVariants[0]);
  }

  init() {
    this.content = this.find(this.contentId);
    this.button = this.find(this.buttonId);
    this.wrapper = this.find(this.wrapperId);
    this.navButtons = this.find(this.contentButtonId);
    this.registerDomEvent(window, 'scroll', this.toggleWrapper.bind(this));
    this.registerDomEvent(this.buttonId, 'click', this.handleButtonClick.bind(this));
    this.registerDomEvent(this.contentButtonId, 'click', this.handleNavButtonsClick.bind(this));
  };
}
