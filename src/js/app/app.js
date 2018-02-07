import $ from 'jquery';
import velocity from 'velocity-animate';
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
          newModule.throwError = this.throwError,
          newModule.registerDomEvent = this.registerDomEvent,
          newModule.anim = this.anim
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
      this.modules.forEach((module) => {
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

  registerDomEvent(element, type, fn) {
    const target = this.rules._isString(element)? this.find(element): $(element);
    target.on(type, fn);
    const removeEvent = () => {
      target.off(type, fn);
    }
    this.emit('RWU', removeEvent);
  }

  handleEmailAddress() {
    const mail = this.find('.contact-email');
    const adr = mail.text().trim().toLowerCase().replace('(at)', '@').replace(/\(dot\)/g, '.');
    mail.text(adr);
  }

  anim(element, options, parameters) {
    element.velocity('stop').velocity(
      options,
      parameters
    )
    element = {};
    options = {};
    parameters = {};
  }
  init() {
    const eventData = {app: this.dom, loader: $('#loader')};
    //this.handleEmailAddress();
    Promise.all(this.loadImages).then(() => {
        this.createModules();
        this.initModules();
        delete this.loadImages;
        this.events.emit('DCL', eventData);
    })
  };
}
