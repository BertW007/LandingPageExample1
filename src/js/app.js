import $ from 'jquery';
import '../scss/main.scss';
import GoogleMapsLoader from 'google-maps';
import velocity from 'velocity-animate';
import marker_icon from '../img/loc.svg';
import banner_1 from '../img/banner_1.jpg';
import banner_2 from '../img/banner_2.jpg';
import banner_3 from '../img/banner_3.jpg';
import banner_bg_image_1 from '../img/cloth_bg_1.jpg';
import banner_bg_image_2 from '../img/cloth_bg_3.jpg';



// SMOOTH SCROLLING
Math.easeOutQuad = function (t, b, c, d) { t /= d; return -c * t*(t-2) + b; };

const handleSmoothMouseWheel = () => {
  let upwards = true;
  let end = null;
  let intervalId = null;

  const smoothMouseWheel = (event) => {
    let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    handler(delta);
    event.preventDefault? event.preventDefault():false;
    event.returnValue = false;
  }

  const handler = (delta) => {
  	const animationInterval = 20;
    const scrollSpeed = 15;
    end == null? end = $(window).scrollTop(): false;
    end -= 60 * delta;
    upwards = delta > 0;
    intervalId == null ?
      intervalId = setInterval(() => {
        const scrollTop = $(window).scrollTop();
        const change = end - scrollTop;
        const step = Math.easeOutQuad(0.5,0,change,scrollSpeed);
        scrollTop <= 0 ||
        scrollTop >= document.body.offsetHeight - $(window).height() ||
        upwards && step > -1 ||
        !upwards && step < 1 ?
        (
          clearInterval(intervalId),
          intervalId = null,
          end = null
        ):
        false;
        $(window).scrollTop(scrollTop + step);
      }, animationInterval):
      false;
  }
  window.addEventListener? window.addEventListener('DOMMouseScroll', smoothMouseWheel, false):false;
  window.onmousewheel = document.onmousewheel = smoothMouseWheel;
}

handleSmoothMouseWheel();


//GOOGLE MAPS
function initMap() {
  GoogleMapsLoader.LANGUAGE = 'en';
  GoogleMapsLoader.load(function(google) {
      const icon = {
        url: marker_icon,
        scaledSize: new google.maps.Size(70,70),
      };
      const bounds = new google.maps.LatLngBounds();
      const firstB = new google.maps.LatLng(37.739333, 49.175194);
      const secondB = new google.maps.LatLng(58.730505, -13.269574);
      bounds.extend(firstB);
      bounds.extend(secondB);
      const locations = [
        ['Warsaw', 52.286983, 21.062947, 'Lorem ipsum dolor sit amet'],
        ['London', 51.514636, -0.179911, 'Lorem ipsum dolor sit amet'],
        ['Rome', 41.840964, 12.520881, 'Lorem ipsum dolor sit amet'],
      ];
      const position = new google.maps.LatLng(52.286983, 21.062947);

      const map = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 4,
        scrollwheel: false,
        // zoomControl: true,
        // gestureHandling: 'greedy',
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
      map.fitBounds(bounds);
      for (let i = 0; i < locations.length; i++) {
        const infowindow = new google.maps.InfoWindow({
            content: locations[i][3],
            pixelOffset: new google.maps.Size(0,17)
        });
        const marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
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
    google.maps.event.addDomListener(window, "resize", function() {
      google.maps.event.trigger(map, "resize");
      map.fitBounds(bounds);
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
    { img: banner_1,
      query: $('.banner-content[data-id="0"]')
    },
    { img: banner_2,
      query: $('.banner-content[data-id="1"]')
    },
    { img: banner_3,
      query: $('.banner-content[data-id="2"]')
    },
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
    cr.query.velocity({translateX: t[d][0]},{easing: 'easeOutSine',duration: 1000, complete: () => {
        cr.query.removeClass('current');
      }}),
    nx.query.velocity({translateX: t[d][1]},{easing: 'easeOutSine',duration: 1000, begin: () => {
      nx.query.find('>*').velocity({opacity:0, translateY: '-50px'},{duration:0})}, complete: () => {
        nx.query.addClass('current');
        nx.query.find('h2').velocity('reverse',{duration:500, complete:() => {
          nx.query.find('p').velocity('reverse', {duration: 500, complete: () => {
            nx.query.find('button').velocity('reverse', {duration: 500});
          }});
        }});
      }})
    ): false;
  }
  let dr = 0;
  const handleBannerRotation = (b) => {
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
      clearTimeout(id);
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

const handleLoadImages = () => {
  const content = $('.container');
  const loader = $('#loader');
  const images = [
    banner_1,
    banner_2,
    banner_3,
    banner_bg_image_1,
    banner_bg_image_2,
  ];

  const imgsLoaded = images.map((image)=>{
    return new Promise((resolve,reject)=>{
      const img = new Image();
      img.src = image;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
  });

  Promise.all(imgsLoaded).then((images)=>{
    loader.velocity('fadeOut',{duration:1000});
    content.velocity('fadeIn',{duration:1000});
  });
}

handleLoadImages();

handleEmailAddress();
initMap();
handleScrolling('header-nav-wrapper', 50);
handleButtonsOutline();
handleNavSlideDown();
handleBannerActions();
