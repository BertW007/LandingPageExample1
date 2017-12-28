import $ from "jquery";
import '../scss/main.scss';

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

handleScrolling('header-nav-wrapper', 100);

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

handleButtonsOutline();

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

handleNavSlideDown();
