import $ from 'jquery';
import velocity from 'velocity-animate';
import Events from './events';
import loaderCreate from './loader';

export default class App {
  constructor(id, modules, lang, config) {
    this.rules = config;
    this.events = new Events();
    this.loadImages = loaderCreate(this.log, this.events);
    this.dom = $('#'+id);
    this.lang = lang.current? lang.current: lang.default;
    this.modules = modules;
    this.errors = {
      moduleCreate: 'Module creation faild. Uninitialized module should be a function',
      moduleInitObject: 'Module creation faild. New module should be an object',
      moduleInitFunction: 'Unable to init module. Module init should be a function',
    }
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

  createModules() {
    this.modules = this.modules.map((module) => {
      try {
        let newModule;
        this.rules._isFunction(module)?
          newModule = new module():
          this.throwError(this.errors.moduleCreate);
        this.rules._isObject(newModule)?
        (
          newModule.lang = this.lang,
          newModule.rules = this.rules,
          newModule.emit = this.events.emit.bind(this.events),
          newModule.sub = this.events.on.bind(this.events),
          newModule.log = this.log,
          newModule.find = this.find,
          newModule.throwError = this.throwError,
          newModule.registerDomEvent = this.registerEvent,
          newModule.onWindowUnload = this.onWindowUnload,
          newModule.anim = this.anim
        ):
        this.throwError(this.errors.moduleInitObject);
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
        this.throwError(this.errors.moduleInitFunction)
      })
    }
    catch(e) {
      this.log(e);
    }
  }

  init() {
    const eventData = {app: this.dom, loader: $('#loader')};
    this.createModules();
    Promise.all(this.loadImages).then(() => {
        this.initModules();
        delete this.loadImages;
        this.events.emit('DCL', eventData);
    })
  };
}
