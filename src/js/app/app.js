import $ from 'jquery';
import velocity from 'velocity-animate';
import Events from './events';
import loader from './loader';

export default class App {
  constructor(name) {
    try {
      !$ || !velocity || !Events || !loader ?
      this.throwError('App creation faild. Unable to find one or more dependencies'):
      !name? this.throwError('App creation faild. App name not provided'):
      this.name = name;
    } catch(e) {
      this.log(e);
    }
    this.events = new Events();
    this.imagesLoaded = loader();
  }

  add(module) {
    module.prototype.emit = this.events.emit.bind(this.events);
    module.prototype.sub = this.events.on.bind(this.events);
    module.prototype.anim = (e, o, p) => {
        e.velocity('stop').velocity(o, p);
      };
    return module;
  }

  createModules() {
    this.modules = this.modules.map((m) => {
      try {
        let module;
        this.isFunction(m)?
          (
            module = this.add(this.create(m)),
            module.prototype.modulePrefix = '.',
            module.prototype.moduleSuffix = '-'
          ):
          this.throwError('Module creation faild. Uninitialized module should be a function');
        return new module();
      } catch(e) {
        this.log(e);
      }
    });
  }

  initModules() {
    try {
      this.modules.forEach((module) => {
        module.init &&
        this.isFunction(module.init)?
        module.init():
        this.throwError('Unable to init module. Module init should be a function')
      })
    }
    catch(e) {
      this.log(e);
    }
  }

  handleRemove() {
    this.loader.remove();
    delete this.loader;
    delete this.imagesLoaded;
    delete this.content;
  }

  handleIn() {

    const complete = () => {
      this.events.emit('ACL', null);
    }

    const animOut = () => {
      this.loader.velocity('stop').velocity(
        'fadeOut',
        {
          duration: 1000,
          complete: complete
        }
      );
    }
    this.content.velocity('stop').velocity(
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
        this.handleIn();
        this.handleRemove();
    })
  };
}
