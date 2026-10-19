$(document).ready(function () {
  "use strict";

  // Cabeçalho fixo
  $(".default-header").sticky({
    topSpacing: 0
  });

  // Vídeo institucional
  $("#play-home-video").magnificPopup({
    type: "inline",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
    callbacks: {
      open: function () {
        var video = document.getElementById("home-institutional-video");

        if (video) {
          video.currentTime = 0;
          video.play();
        }
      },
      close: function () {
        var video = document.getElementById("home-institutional-video");

        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    }
  });

  // Depoimentos
  $(".active-testimonial").owlCarousel({
    items: 3,
    margin: 30,
    loop: true,
    dots: true,
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 1
      },
      991: {
        items: 2
      },
      1200: {
        items: 3
      }
    }
  });

  // Clientes e parceiros
  $(".active-brand-carusel").owlCarousel({
    items: 5,
    loop: true,
    margin: 30,
    autoplayHoverPause: true,
    smartSpeed: 650,
    autoplay: true,
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 2
      },
      768: {
        items: 5
      }
    }
  });

  // Navegação suave entre as seções da página
  $('.navbar-nav a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .on("click", function (event) {
      if (
        location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
        location.hostname === this.hostname
      ) {
        var target = $(this.hash);

        target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");

        if (target.length) {
          event.preventDefault();
          $("html, body").animate({
            scrollTop: target.offset().top - 50
          }, 1000, function () {
            var $target = $(target);

            $target.focus();

            if (!$target.is(":focus")) {
              $target.attr("tabindex", "-1");
              $target.focus();
            }
          });
        }
      }
    });
});
