import velocity from 'velocity-animate';
import configCreate from './app/config';
import logsCreate from './app/logs';
import App from './app/app';
import '../scss/main.scss';

const appCreate = (app, config, logs) => {

  const namespace = {}, // Create namespace
        throwError = (msg) => {
          throw new Error(msg);
        },
        registerEvent = (element, type, fn) => { // register namespace event
          let target = RULES._isString(element)? this.find(element): $(element);
          target.on(type, fn);
          // remove registered event on window unload
          const removeEvent = () => {
            target.off(type, fn);
            window.removeEventListener('unload', removeEvent);
            target = null;
          }
          window.addEventListener('unload', removeEvent);
        },
        onWindowUnload = (fn) => { // register callback executed on window unload
          const remove = () => {
            RULES._isFunction(fn)? fn(): false;
            window.removeEventListener('unload', remove);
          }
          window.addEventListener('unload', remove);
        },
        find = (element) => {
          return $('#' + NAME).find(element);
        };

  let tmp = typeof config === 'function'? config(): config;
  let {NAME, LOG, LANG, MODULES, RULES} = tmp.app;
  const lgs = RULES._isFunction(logs)? logs(LOG): logs;
  tmp = null;

  app.prototype.create = (module) => {
    let {_isFunction, _isObject, _isString, _isNumber, _isArray} = RULES;
    module.prototype.lang = LANG.current? LANG.current: LANG.default;
    module.prototype.find = find;
    module.prototype.registerDomEvent = registerEvent;
    module.prototype.onWindowUnload = onWindowUnload;
    module.prototype.log = lgs.log;
    module.prototype.throwError = throwError;
    module.prototype.isFunction = _isFunction;
    module.prototype.isObject = _isObject;
    module.prototype.isString = _isString;
    module.prototype.isNumber = _isNumber;
    module.prototype.isArray = _isArray;
    return module;
  }

  app.prototype.log = lgs.log;
  app.prototype.throwError = throwError;
  app.prototype.rules = RULES;
  app.prototype.modules = MODULES;

  try {
    !namespace[ NAME ]?
     namespace[ NAME ] = new app(NAME):
    throwError('Namespace name should be unique');
  }
  catch(e) {
    lgs.log(e);
  }

  // Stop app
  const stop = () => {
    delete namespace[ NAME ];
  }

  // Start app (returned by appCreate);
  const start = () => {
    //App init
    const init = () => {
      try {
        RULES._isFunction(namespace[ NAME ].init) &&
        RULES._isObject(namespace[ NAME ])?
        namespace[ NAME ].init():
        throwError('Unable to init app or app is not an object');
      }
      catch(e) {
        lgs.log(e);
      }
    }

    registerEvent(window, 'load', init);
    onWindowUnload(stop);
  }
  return start;
}
// Create App
const start = appCreate(App, configCreate, logsCreate);
start();
