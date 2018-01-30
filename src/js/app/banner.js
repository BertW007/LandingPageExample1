import Module from './module';

export default class Banner extends Module {
  animBanner() {
    console.log('Anim Banner!');
  }
  init() {
    this.registerDomEvent('.banner-controls-left', 'click', this.animBanner);
    this.registerDomEvent('.banner-controls-right', 'click', this.animBanner);
  };
}
