import config from './config';

export default class Module {

  throwError (msg) {
    throw new Error(msg);
  };

  registerDomEvent (element, type, fn) {
    let target = config.app.RULES._isString(element)? this.find(element): $(element);
    target.on(type, fn);

    const removeEvent = () => {
      target.off(type, fn);
      window.removeEventListener('unload', removeEvent);
      target = null;
    }
    window.addEventListener('unload', removeEvent);
  };

  onWindowUnload(fn) {
    const remove = () => {
      config.app.RULES._isFunction(fn)? fn(): false;
      window.removeEventListener('unload', remove);
    }
    window.addEventListener('unload', remove);
  };

  anim(e, o, p) {
      e.velocity('stop').velocity(o, p);
      e = {};
      o = {};
      p = {};
  };

}
