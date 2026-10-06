$(document).ready(function () {
  "use strict";

  $(".about-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 600,
    nav: false,
    dots: false
  });
});
