$(document).ready(function () {
  "use strict";

  var $carousel = $(".project-carousel");

  if (!$carousel.length) {
    return;
  }

  var $projects = $carousel.children(".project-carousel-item").detach();

  function showProjects(filter) {
    if ($carousel.hasClass("owl-loaded")) {
      $carousel.trigger("destroy.owl.carousel");
    }

    $projects.detach();
    $carousel.empty();

    var $visibleProjects = filter === ".all"
      ? $projects
      : $projects.filter(filter);

    $visibleProjects.each(function () {
      $carousel.append(this);
    });

    var projectCount = $visibleProjects.length;
    var shouldMove = projectCount >= 3;

    $carousel.toggleClass("project-carousel--single", projectCount === 1);

    $carousel.owlCarousel({
      margin: projectCount === 1 ? 0 : 30,
      loop: shouldMove,
      autoplay: shouldMove,
      autoplayTimeout: 3000,
      autoplayHoverPause: false,
      smartSpeed: 600,
      nav: shouldMove,
      navText: [
        '<span class="lnr lnr-arrow-left" aria-hidden="true"></span>',
        '<span class="lnr lnr-arrow-right" aria-hidden="true"></span>'
      ],
      dots: false,
      responsive: {
        0: {
          items: 1
        },
        576: {
          items: 2
        },
        992: {
          items: 2
        }
      }
    });

    if (shouldMove) {
      $carousel.trigger("refreshed.owl.carousel");
    }
  }

  $(".project-carousel-filters li").on("click", function (event) {
    event.stopImmediatePropagation();

    var $selectedFilter = $(this);

    $selectedFilter
      .addClass("active")
      .siblings()
      .removeClass("active");

    showProjects($selectedFilter.data("filter"));
  });

  showProjects(".all");
});
