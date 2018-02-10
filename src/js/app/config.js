import Banner from './app/banner';
import GoogleMap from './app/map';
import Nav from './app/nav';
import Outlines from './app/outlines';
import Features from './app/features';
import Clients from './app/clients';
import Email from './app/email';

const configCreate = () => {
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
                   return functionToCheck && typeof functionToCheck === 'function'},
        _isObject: (objectToCheck) => {
                   return objectToCheck &&
                          objectToCheck !== null &&
                          typeof objectToCheck === 'object'
                        },
        _isString: (dataToCheck) => {
            return dataToCheck && typeof functionToCheck === 'string'},
      },
    },
  }
  return config;
}

export default configCreate;
