import config from './app/config'
import logsCreate from './app/logs'
import App from './app/app'
import '../scss/main.scss'
import $ from 'jquery'

const logs = logsCreate(config.app.LOG)

const throwError = (msg) => {
  throw new Error(msg)
}

const appCreate = (App, config) => {
  const namespace = {}
  const create = () => {
    namespace[ config.app.NAME ] = new App(config.app.NAME)
    namespace[ config.app.NAME ].logs = logs
    namespace[ config.app.NAME ].throwError = throwError
    namespace[ config.app.NAME ].lang = config.app.LANG.current
      ? config.app.LANG.current
      : config.app.LANG.default
  }

  try {
    !namespace[ config.app.NAME ] && config.app.RULES._isFunction(App)
      ? create()
      : throwError('Invalid app name or app is not a function')
  } catch (e) {
    logs.log(e)
  }

  // Stop app
  const stop = () => {
    delete namespace[ config.app.NAME ]
  }

  // Start app
  const start = () => {
    // App init
    const init = () => {
      try {
        config.app.RULES._isFunction(namespace[ config.app.NAME ].init)
          ? namespace[ config.app.NAME ].init()
          : throwError('Unable to init app')
      } catch (e) {
        logs.log(e)
      }
    }

    const remove = () => {
      $(window).off('load', init)
      window.removeEventListener('unload', remove)
      stop()
    }

    window.addEventListener('unload', remove)
    $(window).on('load', init)
  }

  return start
}
// Create App
const start = appCreate(App, config)
start()
