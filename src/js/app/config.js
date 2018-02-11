import Banner from './app/banner';
import GoogleMap from './app/map';
import Nav from './app/nav';
import Outlines from './app/outlines';
import Features from './app/features';
import Clients from './app/clients';
import Email from './app/email';

const config = {
  app: {
    NAME: 'ftheme',
    LOG: true,
    LANG: { default: 'en' },
    MODULES: [
      Banner,
      Nav,
      Outlines,
      Features,
      Clients,
      Email,
      GoogleMap,
    ],
    RULES: {
      _isFunction: (functionToCheck) => {
        return functionToCheck && typeof functionToCheck === 'function';
      },
      _isObject: (objectToCheck) => { // is object or array
        return objectToCheck && objectToCheck !== null && typeof objectToCheck === 'object';
      },
      _isString: (dataToCheck) => {
        return dataToCheck && typeof functionToCheck === 'string';
      },
      _isNumber: (dataToCheck) => {
        return dataToCheck && typeof dataToCheck === 'number' && isFinite(dataToCheck);
      },
      _isArray: (dataToCheck) => {
        return dataToCheck && typeof dataToCheck === 'object' &&
        typeof dataToCheck.length === 'number' && !(dataToCheck.propertyIsEnumerable('length'));
      },
    },
  },
}

export default config;
