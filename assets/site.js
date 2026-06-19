(function () {
    function selectAll(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var links = document.querySelector("[data-nav-links]");
        if (!button || !links) {
            return;
        }
        button.addEventListener("click", function () {
            links.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = selectAll("[data-hero-slide]", slider);
        var dots = selectAll("[data-hero-dot]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("is-active", itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("is-active", itemIndex === current);
            });
        }

        function schedule() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                schedule();
            });
        });

        show(0);
        schedule();
    }

    function initFilters() {
        selectAll(".filter-shell").forEach(function (shell) {
            var input = shell.querySelector("[data-filter-input]");
            var type = shell.querySelector("[data-filter-type]");
            var region = shell.querySelector("[data-filter-region]");
            var year = shell.querySelector("[data-filter-year]");
            var empty = shell.querySelector("[data-filter-empty]");
            var cards = selectAll(".movie-card", shell);
            var controls = [input, type, region, year].filter(Boolean);
            if (!cards.length || !controls.length) {
                return;
            }

            function valueOf(control) {
                return control ? String(control.value || "").trim().toLowerCase() : "";
            }

            function applyFilter() {
                var keyword = valueOf(input);
                var selectedType = valueOf(type);
                var selectedRegion = valueOf(region);
                var selectedYear = valueOf(year);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.textContent
                    ].join(" ").toLowerCase();
                    var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchesType = !selectedType || String(card.getAttribute("data-type") || "").toLowerCase().indexOf(selectedType) !== -1;
                    var matchesRegion = !selectedRegion || String(card.getAttribute("data-region") || "").toLowerCase().indexOf(selectedRegion) !== -1;
                    var matchesYear = !selectedYear || String(card.getAttribute("data-year") || "") === selectedYear;
                    var isVisible = matchesKeyword && matchesType && matchesRegion && matchesYear;
                    card.hidden = !isVisible;
                    if (isVisible) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            controls.forEach(function (control) {
                control.addEventListener("input", applyFilter);
                control.addEventListener("change", applyFilter);
            });
        });
    }

    window.startMoviePlayer = function (videoId, overlayId, playId, streamUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var play = document.getElementById(playId);
        if (!video || !overlay || !streamUrl) {
            return;
        }
        var started = false;
        var hlsInstance = null;

        function begin() {
            if (started) {
                video.play().catch(function () {});
                return;
            }
            started = true;
            overlay.classList.add("is-hidden");
            video.controls = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = streamUrl;
            video.play().catch(function () {});
        }

        overlay.addEventListener("click", begin);
        if (play) {
            play.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                begin();
            });
        }
        video.addEventListener("click", function () {
            if (!started) {
                begin();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
