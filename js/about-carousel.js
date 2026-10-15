$(document).ready(function () {
  "use strict";

  $(".about-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 1700,
    autoplayHoverPause: true,
    smartSpeed: 600,
    nav: false,
    dots: false
  });
});
