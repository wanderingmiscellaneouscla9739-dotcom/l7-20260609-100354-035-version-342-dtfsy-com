(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-hero-thumb]"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("is-active", thumbIndex === current);
      });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener("click", function () {
        showSlide(index);
      });
    });

    showSlide(0);

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var filterRoot = document.querySelector("[data-filter-root]");

  if (filterRoot) {
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-movie-card]"));
    var keywordInput = document.querySelector("[data-filter-keyword]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var emptyState = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query && keywordInput) {
      keywordInput.value = query;
    }

    function matches(card, keyword, typeValue, yearValue) {
      var haystack = [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.textContent
      ].join(" ").toLowerCase();

      var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
      var typeOk = !typeValue || (card.getAttribute("data-type") || "").indexOf(typeValue) !== -1;
      var yearOk = !yearValue || (card.getAttribute("data-year") || "") === yearValue;

      return keywordOk && typeOk && yearOk;
    }

    function applyFilter() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
      var typeValue = typeSelect ? typeSelect.value : "";
      var yearValue = yearSelect ? yearSelect.value : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var ok = matches(card, keyword, typeValue, yearValue);
        card.style.display = ok ? "" : "none";

        if (ok) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visibleCount === 0);
      }
    }

    [keywordInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  }

  var playerBlocks = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  playerBlocks.forEach(function (block) {
    var video = block.querySelector("video");
    var overlay = block.querySelector(".player-overlay");
    var playButtons = Array.prototype.slice.call(block.querySelectorAll("[data-play-button]"));
    var started = false;
    var hlsInstance = null;

    function play() {
      if (!video) {
        return;
      }

      var src = video.getAttribute("data-src");

      if (!started && src) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = src;
          video.play().catch(function () {});
        }

        started = true;
      } else {
        video.play().catch(function () {});
      }

      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    }

    playButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        play();
      });
    });

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          play();
        }
      });

      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  });
})();
