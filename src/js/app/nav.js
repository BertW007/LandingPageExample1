export default class Nav {
  constructor() {
    this.slideSpeed = 'slow';
    this.buttonId = '.toggle-nav';
    this.contentId = 'nav';
    this.eventId = 'click';
    this.buttonStateId = 'aria-pressed';
    this.contentStateId = 'aria-expanded';
    this.buttonStateVariants = [
      'nav-close',
      'nav-open',
    ];
  }

  getButtonId() {
    return this.buttonId || false;
  }

  getContentId() {
    return this.contentId || false;
  }

  getEventId() {
    return this.eventId || false;
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

  init() {
    this.content = this.find(this.getContentId());
    this.button = this.find(this.getButtonId());
    this.registerDomEvent(this.getButtonId(), this.getEventId(), this.handleButtonClick.bind(this));
  };
}
