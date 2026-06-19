(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-hero-dot'));
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  var searchInput = document.querySelector('[data-page-search]');
  var typeFilter = document.querySelector('[data-page-filter]');
  var categoryFilter = document.querySelector('[data-category-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var typeValue = typeFilter ? typeFilter.value : 'all';
    var categoryValue = categoryFilter ? categoryFilter.value : 'all';

    cards.forEach(function (card) {
      var text = card.getAttribute('data-search') || '';
      var category = card.getAttribute('data-category') || '';
      var typeMatches = typeValue === 'all' || text.indexOf(typeValue.toLowerCase()) !== -1;
      var categoryMatches = categoryValue === 'all' || category === categoryValue;
      var queryMatches = !query || text.indexOf(query) !== -1;
      card.classList.toggle('hidden', !(typeMatches && categoryMatches && queryMatches));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);

    var params = new URLSearchParams(window.location.search);
    var queryParam = params.get('q');
    if (queryParam) {
      searchInput.value = queryParam;
      applyFilters();
    }
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
})();
