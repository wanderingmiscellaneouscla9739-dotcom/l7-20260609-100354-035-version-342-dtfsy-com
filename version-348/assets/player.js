import { H as Hls } from './hls-vendor-dru42stk.js';

function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-hls-player]'));
    players.forEach(initPlayer);
});

function initPlayer(root) {
    var video = root.querySelector('video');
    var toggle = root.querySelector('[data-player-toggle]');
    var status = root.querySelector('[data-player-status]');
    var src = root.getAttribute('data-src');
    var poster = root.getAttribute('data-poster');
    var hls = null;

    if (!video || !src) {
        setStatus('播放源缺失，暂时无法播放。');
        return;
    }

    if (poster) {
        video.setAttribute('poster', poster);
    }

    if (Hls && Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            root.classList.add('is-ready');
            setStatus('');
        });

        hls.on(Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
                setStatus('视频加载失败，请稍后重试。');
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', function () {
            root.classList.add('is-ready');
            setStatus('');
        });
    } else {
        setStatus('您的浏览器不支持 HLS 视频播放。');
    }

    video.addEventListener('play', function () {
        root.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
        root.classList.remove('is-playing');
    });

    video.addEventListener('click', togglePlayback);

    if (toggle) {
        toggle.addEventListener('click', togglePlayback);
    }

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
        }
    });

    function togglePlayback() {
        if (video.paused) {
            video.play().catch(function () {
                setStatus('浏览器阻止了自动播放，请再次点击播放器。');
            });
        } else {
            video.pause();
        }
    }

    function setStatus(message) {
        if (status) {
            status.textContent = message;
            status.style.display = message ? 'block' : 'none';
        }
    }
}
