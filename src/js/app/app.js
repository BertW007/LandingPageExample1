import $ from 'jquery'
import velocity from 'velocity-animate'
import Events from './events'
import loader from './loader'
import config from './config'

export default class App {
  constructor (name) {
    try {
      !$ || !velocity || !Events || !loader
        ? this.throwError('App creation faild. Unable to find one or more dependencies')
        : !name
          ? this.throwError('App creation faild. App name not provided')
          : this.query = $('#' + name)
    } catch (e) {
      this.logs.log(e)
    }
    this.createModules()
  }

  find (element) {
    return this.query.find(element)
  };

  createModules () {
    this.events = new Events()
    this.imagesLoaded = loader()
    this.modules = config.app.MODULES.map((Creator) => {
      try {
        let module = null
        config.app.RULES._isFunction(Creator)
          ? module = new Creator()
          : this.throwError('Module creation faild. Uninitialized module should be a function')

        module.modulePrefix = '.'
        module.moduleSuffix = '-'
        module.emit = this.events.emit.bind(this.events)
        module.sub = this.events.on.bind(this.events)
        module.find = this.find.bind(this)
        return module
      } catch (e) {
        this.logs.log(e)
      }
    })
  }

  initModules () {
    try {
      this.modules.forEach((module) => {
        module.init &&
        config.app.RULES._isFunction(module.init)
          ? module.init()
          : this.throwError('Unable to initialize module. Module init should be a function')
      })
    } catch (e) {
      this.logs.log(e)
    }
  }

  handleRemove () {
    this.loader.remove()
    delete this.loader
    delete this.imagesLoaded
  }

  handleIn () {
    const complete = () => {
      this.events.emit('ACL', null)
    }

    const animOut = () => {
      this.loader.velocity('stop').velocity(
        'fadeOut',
        {
          duration: 1000,
          complete: complete
        }
      )
    }
    this.query.velocity('stop').velocity(
      'fadeIn',
      {
        duration: 1000,
        begin: animOut
      }
    )
  }

  init () {
    this.loader = $('#loader')
    this.initModules()
    Promise.all(this.imagesLoaded).then(() => {
      this.handleIn()
      this.handleRemove()
    })
  };
}
