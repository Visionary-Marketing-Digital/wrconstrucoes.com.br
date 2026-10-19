$(document).ready(function () {
  "use strict";

  var $carousel = $(".project-carousel");

  if (!$carousel.length) {
    return;
  }

  var $projects = $carousel.children(".project-carousel-item").detach();

  function getInterleavedProjects() {
    var categoryFilters = [
      ".residencial",
      ".comercial",
      ".reforma",
      ".manutencao"
    ];
    var projectGroups = [];
    var orderedProjects = [];
    var largestGroupSize = 0;

    $.each(categoryFilters, function (_, categoryFilter) {
      var categoryProjects = $projects.filter(categoryFilter).toArray();

      projectGroups.push(categoryProjects);
      largestGroupSize = Math.max(largestGroupSize, categoryProjects.length);
    });

    for (var projectIndex = 0; projectIndex < largestGroupSize; projectIndex += 1) {
      $.each(projectGroups, function (_, categoryProjects) {
        if (categoryProjects[projectIndex]) {
          orderedProjects.push(categoryProjects[projectIndex]);
        }
      });
    }

    return $(orderedProjects);
  }

  function showProjects(filter) {
    if ($carousel.hasClass("owl-loaded")) {
      $carousel.trigger("destroy.owl.carousel");
    }

    $projects.detach();
    $carousel.empty();

    var $visibleProjects = filter === ".all"
      ? getInterleavedProjects()
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

  $carousel.on("click", ".overlay", function (event) {
    var imageSource = $(this)
      .closest(".project-carousel-item")
      .find(".thumb img")
      .attr("src");

    event.preventDefault();

    if (!imageSource) {
      return;
    }

    $.magnificPopup.open({
      items: {
        src: imageSource,
        type: "image"
      },
      mainClass: "mfp-fade",
      removalDelay: 160
    });
  });

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
