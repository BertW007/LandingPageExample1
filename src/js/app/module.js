import $ from 'jquery';
import velocity from 'velocity-animate';

 export default class Module {


   anim(element, parameters, options) {
     const e = this.find(element);
     const p = parameters;
     const o = options;
     return function exec() {
       e.velocity(p, o);
     }
   }
   registerDomEvent(element, type, fn) {
     const target = this.rules._isString(element)? this.find(element): $(element);
     const eventData = {element: target, type: type, fn: fn};
     eventData.element.on(eventData.type, eventData.fn);
     const removeEvent = () => {
       eventData.element.off(eventData.type, eventData.fn);
     }
     this.emit('RWU', removeEvent);
   }
 }
