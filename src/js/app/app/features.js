import ScrollReveal from 'scrollreveal';

export default class Features {
  constructor() {
    this.sr = ScrollReveal({reset: true, scale: 0.1, duration: 1000});
    this.featuresImgsId = '.fetures-list-item';
    this.featuresInfoId = '.fetures-list-info'
  }

  handleReveal(item) {
    this.sr.reveal(item);
  }

  init() {
    this.handleReveal(this.featuresImgsId);
    this.handleReveal(this.featuresInfoId);
  }
}
