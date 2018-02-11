import $ from 'jquery';
import velocity from 'velocity-animate';
import Events from './events';
import loader from './loader';

export default class App {
  constructor(name) {
    try {
      !$ || !velocity || !Events || !loader ?
      this.throwError('App creation faild. Unable to find one or more dependencies'):
      false;
    } catch(e) {
      this.log(e);
    }
    this.name = name;
    this.events = new Events();
    this.imagesLoaded = loader();
  }

  anim(element, options, parameters) {
    const e = element,
          o = options,
          p = parameters;
    e.velocity('stop').velocity(o, p);
    const reverse = () => {
      e.velocity('reverse').velocity('stop');
    }
    return reverse;
  }

  add(module) {
    module.prototype.emit = this.events.emit.bind(this.events);
    module.prototype.sub = this.events.on.bind(this.events);
    module.prototype.anim = this.anim;
    return module;
  }

  createModules() {
    this.modules = this.modules.map((module) => {
      try {
        let newModule;
        this.rules._isFunction(module)?
          (
            newModule = this.add(this.create(module)),
            newModule = new module()
          ):
          this.throwError('Module creation faild. Uninitialized module should be a function');
        this.rules._isObject(newModule) && !this.rules._isArray(newModule)?
        (
          newModule.modulePrefix = '.',
          newModule.moduleSuffix = '-'
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

  loaderRemove() {
    this.loader.remove();
    delete this.loader;
  }

  animIn() {
    const complete = () => {
      this.events.emit('ACL', null);
    }

    const animOut = () => {
      this.anim(this.loader,
        'fadeOut',
        {
          duration: 1000,
          complete: complete
        }
      );
    }

    this.anim(
      this.content,
      'fadeIn',
      {
        duration: 1000,
        begin: animOut
      }
    );
  }

  init() {
    this.createModules();
    this.initModules();
    this.content = $('#'+ this.name);
    this.loader = $('#loader');
    Promise.all(this.imagesLoaded).then(() => {
        this.animIn();
        this.loaderRemove();
        delete this.imagesLoaded;
        delete this.content;
    })
  };
}
