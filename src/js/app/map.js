import marker_icon from '../../img/loc.svg';
import GoogleMapsLoader from 'google-maps';

export default class Map {

  viewCreate(center, zoom, styles) {
    return {
      center: center,
      zoom: zoom,
      scrollwheel: false,
      disableDefaultUI: true,
      styles: styles,
    }
  }

  handleWindowResize() {
    this.mapsLoaded.event.trigger(this.map, "resize");
    this.map.fitBounds(this.bounds);
    this.map.setCenter(this.center);
  }
  mapCreate() {
    return new Promise((resolve,reject)=>{
      this.view? resolve(true):
      reject(false);
    });
  }
  init() {
    try {
      this.maps = new Promise((resolve,reject) => {
        GoogleMapsLoader.LANGUAGE = this.lang;
        GoogleMapsLoader.load(function(google) {
          google?
          resolve(google.maps):
          (
            reject(false),
            this.throwError('Unable to load google maps')
          )
        })
      });
    } catch(e) {
      this.log(e);
    }

    try {
      this.maps.then((maps) => {
        this.mapsLoaded = maps;
        this.geocoder = new this.mapsLoaded.Geocoder;
        this.bounds = new this.mapsLoaded.LatLngBounds();
        this.bounds.extend(new this.mapsLoaded.LatLng(bounds[0][0],bounds[0][1]));
        this.bounds.extend(new this.mapsLoaded.LatLng(bounds[1][0],bounds[1][1]));
        this.center = new this.mapsLoaded.LatLng(center[0], center[1]);
        this.view = this.viewCreate(this.center, 4, style);
        this.addresses = locations.map((location) => {
          return new Promise((resolve,reject) => {
            const loc =  new this.mapsLoaded.LatLng(location[0], location[1]);
              this.geocoder.geocode({location: loc}, (results, status)=>{
                if (status === 'OK') {
                  resolve(results[0].formatted_address);
                } else if (status === 'ZERO_RESULTS') {
                  this.throwError('Unable to load one or more addresses'),
                  reject('address load faild');
                }
              });
            });
          });
        Promise.all(this.addresses).then((addresses) => {
          this.infowindowsCreate = () => {
            this.infowindows = locations.map((location,key) => {
              const marker = new this.mapsLoaded.Marker({
                position: new this.mapsLoaded.LatLng(location[0], location[1]),
                animation: this.mapsLoaded.Animation.DROP,
                map: this.map,
                icon: marker_icon
              });
              const infowindow = new this.mapsLoaded.InfoWindow({
                content: location[2]+'<p>'+addresses[key]+'</p>',
                pixelOffset: new this.mapsLoaded.Size(0,17)
              });
              infowindow.opened = false;
              marker.set('optimized', false); // prevent memory leaks
              const handleMarkerClick = (e) => {
                let prev = [];
                infowindow.opened === false?
                (
                  prev = this.infowindows.filter((item) => {
                    return item.infowindow.opened === true;
                  }),
                  prev.length>0? prev.forEach((p)=>{p.infowindow.close(this.map, p.marker)}): false,
                  infowindow.open(this.map, marker),
                  infowindow.opened = true
                ):
                (
                  infowindow.opened = false,
                  infowindow.close(map, marker)
                )
              }
              const remove = () => {
                this.mapsLoaded.event.clearInstanceListeners(marker);
                window.removeEventListener('unload', remove);
              }
              marker.addListener('click', handleMarkerClick);
              window.addEventListener('unload', remove);
              return {
                marker,
                infowindow,
              };
            });
          }
        });
      });
    } catch(e) {
      this.log(e);
    }
    try {
      this.sub('ACL',(event) => {
        const m = this.mapCreate();
        m.then((e) => {
          e?
          this.map = new this.mapsLoaded.Map(document.getElementById(event.load),this.view):
          this.throwError('Error: Map load faild');
          this.mapsLoaded.event.clearInstanceListeners(this.map);
          this.map.fitBounds(this.bounds);
          this.infowindowsCreate();
          const remove = () => {
            window.removeEventListener('resize', this.handleWindowResize.bind(this));
            this.mapsLoaded.event.clearInstanceListeners(this.map);
            window.removeEventListener('unload', remove);
          }
          window.addEventListener('resize', this.handleWindowResize.bind(this));
          window.addEventListener('unload', remove);
        });
      });
    } catch (e) {
      this.log(e);
    }
  };
}

const locations = [
  [ '52.286983',
    '21.062947',
    '<h5>FashionTheme</h5>'+
    '<h6>phone: +48 999 330 333</h6>'+
    '<h6>email: contact@fasion.com</h6>'
  ],
  [ '51.514636',
    '-0.179911',
    '<h5>FashionTheme</h5>'+
    '<h6>phone: +48 999 330 333</h6>'+
    '<h6>email: contact@fasion.com</h6>'
  ],
  [ '41.840964',
    '12.520881',
    '<h5>FashionTheme</h5>'+
    '<h6>phone: +48 999 330 333</h6>'+
    '<h6>email: contact@fasion.com</h6>'
  ],
];
const style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        visibility: "off"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];
const bounds = [
  ['37.739333', '49.175194'],
  ['58.730505', '-13.269574'],
];
const center = ['52.286983', '21.062947'];
