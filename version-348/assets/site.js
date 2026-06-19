(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        initMobileMenu();
        initHeroCarousel();
        initSearchFilters();
        initShareButtons();
    });

    function initMobileMenu() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');

        if (!toggle || !menu) {
            return;
        }

        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function initHeroCarousel() {
        var root = document.querySelector('[data-hero]');

        if (!root) {
            return;
        }

        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initSearchFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-search-input]');
            var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
            var section = panel.parentElement;
            var cards = Array.prototype.slice.call(section.querySelectorAll('[data-card]'));
            var count = panel.querySelector('[data-result-count]');
            var empty = section.querySelector('[data-empty-state]');
            var activeFilter = 'all';

            function normalize(value) {
                return String(value || '').toLowerCase().trim();
            }

            function apply() {
                var keyword = normalize(input ? input.value : '');
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute('data-search'));
                    var category = card.getAttribute('data-category') || '';
                    var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                    var filterMatch = activeFilter === 'all' || category === activeFilter;
                    var isVisible = keywordMatch && filterMatch;

                    card.classList.toggle('hidden-by-filter', !isVisible);

                    if (isVisible) {
                        visible += 1;
                    }
                });

                if (count) {
                    count.textContent = String(visible);
                }

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }

            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    activeFilter = chip.getAttribute('data-filter') || 'all';
                    chips.forEach(function (item) {
                        item.classList.toggle('active', item === chip);
                    });
                    apply();
                });
            });

            apply();
        });
    }

    function initShareButtons() {
        var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-share]'));

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var url = window.location.href;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(function () {
                        button.textContent = '链接已复制';
                        window.setTimeout(function () {
                            button.textContent = '分享本片';
                        }, 1600);
                    });
                } else {
                    window.prompt('复制链接', url);
                }
            });
        });
    }
}());
