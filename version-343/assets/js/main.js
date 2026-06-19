(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var previous = document.querySelector(".hero-prev");
  var next = document.querySelector(".hero-next");
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  function startCarousel() {
    if (slides.length < 2) {
      return;
    }

    stopCarousel();
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function stopCarousel() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-slide")) || 0);
      startCarousel();
    });
  });

  if (previous) {
    previous.addEventListener("click", function () {
      showSlide(current - 1);
      startCarousel();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      startCarousel();
    });
  }

  startCarousel();

  document.querySelectorAll("[data-filter-scope]").forEach(function (panel) {
    var scope = panel.getAttribute("data-filter-scope");
    var grid = document.getElementById(scope);

    if (!grid) {
      return;
    }

    var input = panel.querySelector(".js-filter-input");
    var typeSelect = panel.querySelector(".js-type-filter");
    var yearSelect = panel.querySelector(".js-year-filter");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var noResults = grid.parentElement.querySelector(".no-results");

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function filterCards() {
      var keyword = valueOf(input);
      var type = valueOf(typeSelect);
      var year = valueOf(yearSelect);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-year")
        ].join(" ").toLowerCase();
        var cardType = (card.getAttribute("data-type") || "").toLowerCase();
        var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !type || cardType === type;
        var matchesYear = !year || cardYear === year;
        var show = matchesKeyword && matchesType && matchesYear;

        card.classList.toggle("is-hidden", !show);

        if (show) {
          visible += 1;
        }
      });

      if (noResults) {
        noResults.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, typeSelect, yearSelect].forEach(function (element) {
      if (element) {
        element.addEventListener("input", filterCards);
        element.addEventListener("change", filterCards);
      }
    });

    filterCards();
  });

  var homeForm = document.querySelector(".home-search-form");

  if (homeForm) {
    homeForm.addEventListener("submit", function (event) {
      var query = homeForm.querySelector("input");

      if (!query || !query.value.trim()) {
        event.preventDefault();
        window.location.href = "./categories.html";
      }
    });
  }
})();
