import configCreate from './app/config';
import logsCreate from './app/logs';
import App from './app/app';
import '../scss/main.scss';

const appCreate = (app, config, logs) => {
  const namespace = {};
  namespace.registeredDomEvents = [];
  namespace.config = typeof config === 'function'? config(): config;
  namespace.throwError = (msg) => {throw new Error(msg)};
  try {
    namespace.logs = logs &&
    namespace.config.app.RULES._isFunction(logs) &&
    namespace.config.app.LOG? logs(namespace.config.app.LOG):
    namespace.throwError('Unable to set logs');
    !namespace[ namespace.config.app.NAME ]? namespace[ namespace.config.app.NAME ] = new App(
      namespace.config.app.NAME,
      namespace.logs.log,
      namespace.throwError,
      namespace.config.app.MODULES,
      namespace.config.app.LANG,
      namespace.config.app.RULES
    ): namespace.throwError('Namespace name should be unique');
  }
  catch(e) {
    namespace.logs.log(e);
  }

  namespace[ namespace.config.app.NAME ].stop = () => {
    namespace.registeredDomEvents.forEach((removeEvent)=>{
      removeEvent();
    });
    delete namespace.registeredDomEvents;
    delete namespace[ namespace.config.app.NAME ].modules;
    delete namespace[ namespace.config.app.NAME ];
    delete namespace.logs;
    delete namespace.config;
  }
  namespace[ namespace.config.app.NAME ].start = () => {
    const init = () => {
      try {
        namespace.config.app.RULES._isFunction(namespace[ namespace.config.app.NAME ].init) &&
        namespace.config.app.RULES._isObject(namespace[ namespace.config.app.NAME ])?
        (
          namespace[ namespace.config.app.NAME ].init()
        ):namespace.throwError('Unable to init app or app is not an object');
      }
      catch(e) {
        namespace.logs.log(e);
      }
      namespace[ namespace.config.app.NAME ].events.on('RWU',(e) => {
        namespace.registeredDomEvents.push(e);
      })
    }
    const remove = () => {
      document.removeEventListener('DOMContentLoaded', init);
      namespace[ namespace.config.app.NAME ].stop();
      window.removeEventListener('unload', remove);
    }
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('unload', remove);
  }
  return namespace[ namespace.config.app.NAME ];
}

const app = appCreate(App, configCreate, logsCreate);
app.start();
