export default class Nav {
  constructor() {
    this.slideSpeed = 'slow';
    this.buttonId = '.toggle-nav';
    this.contentId = 'nav';
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

  getButtonState() {
    return this.button.attr(this.buttonStateId) === 'false'? false: true;
  }

  setButtonState(state) {
    this.button? this.button.attr(this.buttonStateId, state): false;
  }

  getContentState() {
    return this.content.attr(this.contentStateId) === 'false'? false: true;
  }

  setContentState(state) {
    this.content? this.content.attr(this.contentStateId, state): false;
  }

  toggleButtonClass() {
    this.button.hasClass(this.buttonStateVariants[1])?
      (
        this.button.removeClass(this.buttonStateVariants[1]),
        this.button.addClass(this.buttonStateVariants[0])
      ):
      (
        this.button.addClass(this.buttonStateVariants[1]),
        this.button.removeClass(this.buttonStateVariants[0])
      );
  }

  toggleButton() {
    this.getButtonState()? this.setButtonState(false): this.setButtonState(true);
    this.toggleButtonClass();
  }

  toggleContent() {
    this.getContentState()? this.setContentState(false): this.setContentState(true);
    this.content.slideToggle(this.slideSpeed);
  }

  handleButtonClick() {
    this.toggleButton();
    this.toggleContent();
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
    this.registerDomEvent(window, 'scroll', this.toggleWrapper.bind(this));
    this.registerDomEvent(this.buttonId, 'click', this.handleButtonClick.bind(this));
  };
}
