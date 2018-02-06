import marker_icon from '../../img/loc.svg';
import style from './mapstyle';
import GoogleMapsLoader from 'google-maps';

export default class GoogleMap {
  constructor() {
    this.mapId = '#map';
    this.style = style;
    this.center = ['52.286983', '21.062947'];
    this.bounds = [
      ['37.739333', '49.175194'],
      ['58.730505', '-13.269574'],
    ];
    this.errors = {
      mapLoad: 'Unable to load google maps',
      addressLoad: 'Unable to load one or more addresses',
    }
    this.geocodeStatusVariants = [
      'OK',
      'ZERO_RESULTS',
    ]
    this.locations = [
      {
        lat: '52.286983',
        lng: '21.062947',
        header: 'FashionTheme',
        phone: '+48 999 330 333',
        email: 'contact1@fasion.com'
      },
      {
        lat: '51.514636',
        lng: '-0.179911',
        header: 'FashionTheme',
        phone: '+48 799 330 333',
        email: 'contact2@fasion.com'
      },
      {
        lat: '41.840964',
        lng: '12.520881',
        header: 'FashionTheme',
        phone: '+48 899 330 433',
        email: 'contact3@fasion.com'
      },
    ];
    this.view = {
      zoom: 4,
      scrollwheel: false,
      disableDefaultUI: true,
      styles: this.style,
    }
  }

  addressesLoad() {
    this.addresses = this.locations.map((location) => {
    return new Promise((resolve,reject) => {
        this.geocoder.geocode( {location: new this.maps.LatLng(location.lat, location.lng)}, (results, status) => {
          if (status === this.geocodeStatusVariants[0]) {
            resolve(results[0].formatted_address);
          } else if (status === this.geocodeStatusVariants[1]) {
            this.throwError(this.error.addressLoad),
            reject('Address load faild');
          }
        });
      });
    });
  }

  createBounds() {
    const b = new this.maps.LatLngBounds();
    b.extend(new this.maps.LatLng(this.bounds[0][0],this.bounds[0][1]));
    b.extend(new this.maps.LatLng(this.bounds[1][0],this.bounds[1][1]));
    this.bounds = b;
  }

  createMarkers() {
    const img = new Image();
    img.src = marker_icon;
    $(this.mapId).append(img);

    this.markers = this.locations.map((location,key) => {
      const marker =  new this.maps.Marker({
        position: new this.maps.LatLng(location.lat, location.lng),
        animation: this.maps.Animation.DROP,
        map: this.map,
        icon: img.src,
        optimized: false,
        infowindow: this.infowindows[key],
        infowindowsClose: () => {
          this.infowindows.forEach((infowindow) => {
            infowindow.close(this.map, this.markers[infowindow.markerId]);
            infowindow.opened = false;
          });
        },
      });
      const removeMarkerEvent = () => {
        this.maps.event.clearInstanceListeners(this.map, marker);
      }
      this.maps.event.addListener(marker, 'click', this.handleMarkerClick);
      this.emit('RWU', removeMarkerEvent);
      return marker;
    });
  }

  createInfowindows() {
    this.infowindows = this.locations.map((location,key) => {
      const header = $('<h5>').text(location.header),
            phone = $('<h6>').text(location.phone),
            email = $('<h6>').text(location.email),
            content = $('<div>'),
            address = $('<p>').text(this.addresses[key]);

      content.append(header).append(phone).append(email).append(address);
      $(this.mapId).append(content);

      return new this.maps.InfoWindow({
        content: content[0],
        pixelOffset: new this.maps.Size(0,17),
        opened: false,
        markerId: key
      });
    });
  }

  handleMarkerClick() {
    this.infowindow.opened?
    this.infowindow.close(this.map, this):
    (
      this.infowindowsClose(),
      this.infowindow.open(this.map, this),
      this.infowindow.opened = true
    )
  }

  createMap() {
    this.createBounds();
    this.center = new this.maps.LatLng(this.center[0], this.center[1]);
    this.map = new this.maps.Map($(this.mapId)[0], this.view);
    this.map.setCenter(this.center);
    this.map.fitBounds(this.bounds);
    this.createInfowindows();
    this.createMarkers();
    delete this.view;
    delete this.style;
    delete this.locations;
    delete this.addresses;
  }

  handleMapResize() {
    this.map && this.maps?
    (
      this.map.fitBounds(this.bounds),
      this.map.setCenter(this.center),
      this.maps.event.trigger(this.map, 'resize')
    ): false;
  }

  mapLoad() {
    try {
      this.maps = new Promise((resolve,reject) => {
        GoogleMapsLoader.LANGUAGE = this.lang;
        GoogleMapsLoader.load((google) => {
          google?
          resolve(google.maps):
          (
            this.throwError(this.error.mapLoad)
          )
        });
      });
    } catch(e) {
      this.log(e);
    }
    this.mapInit();
  }

  mapInit() {
    this.maps.then((maps) => {
      this.maps = maps;
      maps = {};
      this.geocoder = new this.maps.Geocoder;
      this.addressesLoad();
      Promise.all(this.addresses).then((addresses) => {
        this.addresses = addresses;
        delete this.geocoder;
        this.sub('ACL', this.createMap.bind(this));
      });
    });
  }

  init() {
    this.mapLoad();
    this.registerDomEvent(window, 'resize', this.handleMapResize.bind(this));
  }

}
