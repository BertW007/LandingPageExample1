import $ from 'jquery';
import Events from './events';
import loaderCreate from './loader';

export default class App {
  constructor(id, log, error, modules, lang, config) {
    this.log = log;
    this.rules = config;
    this.events = new Events();
    this.loadImages = loaderCreate($, this.log, this.events);
    this.dom = $('#'+id);
    this.lang = lang.current? lang.current: lang.default;
    this.modules = modules;
    this.throwError = error;
  }
  find(element) {
    return this.dom.find(element);
  }
  createModules() {
    this.modules = this.modules.map((module) => {
      try {
        let newModule;
        this.rules._isFunction(module)?
          newModule = new module():
          this.throwError('Module creation faild. Uninitialized module should be a function');
        this.rules._isObject(newModule)?
        (
          newModule.lang = this.lang,
          newModule.rules = this.rules,
          newModule.emit = this.events.emit.bind(this.events),
          newModule.sub = this.events.on.bind(this.events),
          newModule.log = this.log,
          newModule.find = this.find.bind(this),
          newModule.throwError = this.throwError
        ):
        this.throwError('Module creation faild. New module should be an object');
        return newModule;
      } catch(e) {
        this.log(e);
      }
    });
  }
  initModules() {
    try {
      this.modules.forEach((module)=>{
        module.init &&
        this.rules._isFunction(module.init)?
        module.init():
        this.throwError('Unable to init module. Module init should be a function')
      })
    }
    catch(e) {
      this.log(e);
    }
  }
  handleChangeOnScrolling(elm,position) {
    const doc = document.documentElement;
    const element = elm;
    const toggleClass = () => {
      let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
      top > position?
      element.hasClass('scrolling')?
        false: element.addClass('scrolling'):
      element.removeClass('scrolling');
    }
    const eventData = {element: $(window), type: 'scroll', fn: toggleClass};
    eventData.element.on(eventData.type, eventData.fn);
    const removeEvent = () => {
      eventData.element.off(eventData.type, eventData.fn);
    }
    this.events.emit('RWU', removeEvent);
  }
  init() {
    const eventData = {app: this.dom, loader: $('#loader')};
    Promise.all(this.loadImages).then(() => {
        this.createModules();
        this.initModules();
        delete this.loadImages;
        this.events.emit('DCL', eventData);
        this.handleChangeOnScrolling(this.dom.find('.header-nav-wrapper'), 50);
    })
  };
}
