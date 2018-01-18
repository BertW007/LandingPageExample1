import $ from 'jquery';
import '../scss/main.scss';
import GoogleMapsLoader from 'google-maps';
import velocity from 'velocity-animate';
import Events from './events';

//Images //
import marker_icon from '../img/loc.svg';
import banner_1 from '../img/banner_1.jpg';
import banner_2 from '../img/banner_2.jpg';
import banner_3 from '../img/banner_3.jpg';
import banner_bg_image_1 from '../img/cloth_bg_1.jpg';
import banner_bg_image_2 from '../img/cloth_bg_3.jpg';
import gallery_item_1 from '../img/female.jpg';
import gallery_item_2 from '../img/male.jpg';
import gallery_item_3 from '../img/sport.jpg';
import gallery_item_4 from '../img/casual.jpg';
import news_item_1 from '../img/news_1.jpg';
import news_item_2 from '../img/news_2.jpg';
import news_item_3 from '../img/news_3.jpg';
import news_item_4 from '../img/news_4.jpg';
// Images END //

//GOOGLE MAPS
function initMap() {
  GoogleMapsLoader.LANGUAGE = 'en';
  GoogleMapsLoader.load(function(google) {
      const geocoder = new google.maps.Geocoder;
      const icon = {
        url: marker_icon,
        scaledSize: new google.maps.Size(70,70),
      };
      const bounds = new google.maps.LatLngBounds();
      const b1 = new google.maps.LatLng(37.739333, 49.175194);
      const b2 = new google.maps.LatLng(58.730505, -13.269574);
      const center = new google.maps.LatLng(52.286983, 21.062947);
      bounds.extend(b1);
      bounds.extend(b2);
      const locations = [
        [ 52.286983,
          21.062947,
          '<h5>FashionTheme</h5>'+
          '<h6>phone: +48 999 330 333</h6>'+
          '<h6>email: contact@fasion.com</h6>'
        ],
        [ 51.514636,
          -0.179911,
          '<h5>FashionTheme</h5>'+
          '<h6>phone: +48 999 330 333</h6>'+
          '<h6>email: contact@fasion.com</h6>'
        ],
        [ 41.840964,
          12.520881,
          '<h5>FashionTheme</h5>'+
          '<h6>phone: +48 999 330 333</h6>'+
          '<h6>email: contact@fasion.com</h6>'
        ],
      ];
      const addresses = locations.map((location)=>{
        return new Promise((resolve,reject)=>{
          const loc =  new google.maps.LatLng(location[0], location[1]);
            geocoder.geocode({location: loc}, (results, status)=>{
              if (status === 'OK') {
                resolve(results[0].formatted_address);
              }else if (status === 'ZERO_RESULTS') {
                reject('load address faild@!');
              }
            })
        })
      });

      Promise.all(addresses).then((items)=>{
        map.fitBounds(bounds);
        for (let i = 0; i < locations.length; i++) {
          const infowindow = new google.maps.InfoWindow({
            content: locations[i][2]+'<p>'+items[i]+'</p>',
            pixelOffset: new google.maps.Size(0,17)
          });
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][0], locations[i][1]),
            animation: google.maps.Animation.DROP,
            map: map,
            icon: icon
          });
          google.maps.InfoWindow.prototype.opened = false;
          marker.addListener('click',() => {
            google.maps.InfoWindow.prototype.opened === false?
            (infowindow.open(map, marker),
              google.maps.InfoWindow.prototype.opened = true
            ):
            (google.maps.InfoWindow.prototype.opened = false, infowindow.close(map, marker))
          })
        };
      })

      const map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 4,
        scrollwheel: false,
        disableDefaultUI: true,
        styles: [
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
        ]
      });

    const resize = () => {
      google.maps.event.trigger(map, "resize");
      map.fitBounds(bounds);
      map.setCenter(center);
    }
    google.maps.event.addDomListener(window, "resize", resize);
    google.maps.event.addDomListener(window, "load", ()=>{
      map.setCenter(center);
    });
  });
}



//WINDOW SCROLLING
function handleScrolling(id,position) {
  const doc = document.documentElement;
  const element = $('.' + id);
  $(window).on('scroll',() => {
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    top > position?
    element.hasClass('scrolling')?
      false: element.addClass('scrolling'):
    element.removeClass('scrolling');
  })
}

//BUTTONS OUTLINE
function handleButtonsOutline() {
  const buttons = $('button');
  const links = $('a');

  $(window).on('keydown', (event) => {
    const key = event.keyCode;
    key === 9?
    (buttons.addClass('outline'), links.addClass('outline')):
    false;
  });
  $(window).on('click', (event) => {
    buttons.hasClass('outline')?
    (buttons.removeClass('outline'), links.removeClass('outline')):
    false;
  });
}

//NAVIGATION
function handleNavSlideDown() {
  const nav = $('nav');
  const button = $('.toggle-nav');

  button.on('click', () => {

    button.attr('aria-pressed') === 'false'?
    button.attr('aria-pressed','true'):
    button.attr('aria-pressed','false');

    if(button.hasClass('nav-open')) {
      button.removeClass('nav-open');
      button.addClass('nav-close');
    } else {
      button.addClass('nav-open');
      button.removeClass('nav-close');
    }

    nav.attr('aria-expanded') === 'false'?
    nav.attr('aria-expanded', 'true'):
    nav.attr('aria-expanded', 'false');

    nav.slideToggle('slow');
  });
}

//BANNER
const handleBannerActions = () => {
  const banners = [
    { query: $('.banner-content[data-id="0"]')},
    { query: $('.banner-content[data-id="1"]')},
    { query: $('.banner-content[data-id="2"]')},
  ];

  const controls = {
    left: $('.banner-controls-left'),
    right: $('.banner-controls-right')
  }
// d - direction, b - banners
  const animBanner = (d,b) => {
    const current = $.map(b, (obj, index) => {
        if(obj.query.hasClass('current')) {
        return index;
      }
    })[0];
    let cr = b[current],nx;
    d===0?
      nx = b[current+1]:
      nx = b[current-1];
    const t = [[['-100%'],['0%','100%']],[['100%','0%'],['0%']]];
    nx
    && !nx.query.hasClass('velocity-animating')
    && !cr.query.hasClass('velocity-animating')? (
    cr.query.velocity({translateX: t[d][0]},{easing: 'easeOutSine',duration: 1000,
     complete: () => {
        cr.query.removeClass('current');
      }, begin: () => {
        nx.query.velocity({translateX: t[d][1]},{easing: 'easeOutSine',duration: 1000, begin: () => {
          nx.query.find('>*').velocity({opacity:0, translateY: '-50px'},{duration:0})}, complete: () => {
            nx.query.addClass('current');
            nx.query.find('h2').velocity('reverse',{duration:500, complete:() => {
              nx.query.find('p').velocity('reverse', {duration: 500, complete: () => {
                nx.query.find('button').velocity('reverse', {duration: 500});
              }});
            }});
          }})
      }})

    ): false;
  }
  let dr = 0;
  const handleBannerRotation = (b) => {
    clearTimeout(id);
    const id = setTimeout(()=>{
      const cr = $.map(b, (obj, index) => {
          if(obj.query.hasClass('current')) {
          return index;
        }
      })[0];
      const nx = b[cr+1];
      const pr = b[cr-1];
      nx && !pr ? dr = 0:false;
      pr && !nx ? dr = 1:false;
      animBanner(dr,b);
      handleBannerRotation(b);
    }, 5000);
  }

  const handleControls = (c,b) => {
    c.left.on('click',() => {
      animBanner(1,b);
    });
    c.right.on('click',() => {
      animBanner(0,b);
    });
  }

  handleControls(controls,banners);
  handleBannerRotation(banners);
}

const handleEmailAddress = () => {
  const mail = $('.contact-email');
  const adr = mail.text().trim().toLowerCase().replace('(at)', '@').replace(/\(dot\)/g, '.');
  mail.text(adr);
}


const handleInjectImages = (images) => {
  const imgs = Array.from($('img'));
  const withId = imgs.filter((img)=>{
    return img.dataset.id!==undefined;
  });

  const withSrc = withId.map((image,id)=>{
    const img = image;
    img.src = images[img.dataset.id].src;
    return img;
  });
  return withSrc;
}

const handleLoadImages = () => {
  const images = [
    banner_1,
    banner_2,
    banner_3,
    gallery_item_1,
    gallery_item_2,
    gallery_item_3,
    gallery_item_4,
    banner_bg_image_1,
    banner_bg_image_2,
    news_item_1,
    news_item_2,
    news_item_3,
    news_item_4,
  ];

  const imgsLoaded = images.map((image,id)=>{
    return new Promise((resolve,reject)=>{
      const img = new Image();
      img.src = image;
      img.dataset.id = id;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
  });
  return imgsLoaded;
}

const mainLoader = () => {
  const container = $('.container');
  const loader = $('#loader');
  const content = handleLoadImages();
  Promise.all(content).then((items)=>{
    handleInjectImages(items);
    loader.velocity('fadeOut',{duration:1000});
    container.velocity('fadeIn',{duration:1000});
    handleBannerActions();
    handleEmailAddress();
    handleScrolling('header-nav-wrapper', 50);
    handleButtonsOutline();
    handleNavSlideDown();
    initMap();
  });
}

mainLoader();
