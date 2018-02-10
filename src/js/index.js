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

  app.prototype.log = lgs.log;
  app.prototype.throwError = throwError;
  app.prototype.registerEvent = registerEvent;
  app.prototype.onWindowUnload = onWindowUnload;
  app.prototype.find = find;

  try {
    !namespace[ NAME ]? namespace[ NAME ] = new app(
      NAME,
      MODULES,
      LANG,
      RULES
    ):
    throwError('Namespace name should be unique');
  }
  catch(e) {
    lgs.log(e);
  }

  // Stop app
  const stop = () => {
    delete namespace.registeredDomEvents;
    delete namespace[ NAME ].modules;
    delete namespace[ NAME ];
  }

  // Start app (returned by appCreate);
  const start = () => {
    //App init
    const init = () => {
      try {
        RULES._isFunction(namespace[ NAME ].init) &&
        RULES._isObject(namespace[ NAME ])?
        (
          namespace[ NAME ].init()
        ):
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
