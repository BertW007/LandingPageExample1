import Banner from './banner';
import GoogleMap from './map';
import Nav from './nav';

const configCreate = () => {
  const config = {
    app: {
      NAME: 'ftheme',
      LOG: true,
      LANG: { default: 'en' },
      MODULES: [
        Banner,
        GoogleMap,
        Nav,
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
