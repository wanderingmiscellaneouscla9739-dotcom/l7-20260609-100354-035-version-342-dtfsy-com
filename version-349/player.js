(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('.player-cover');
    var streamUrl = shell.getAttribute('data-stream-url');
    var hlsInstance = null;
    var requested = false;

    if (!video || !cover || !streamUrl) {
      return;
    }

    function play() {
      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    function attachStream() {
      if (video.getAttribute('data-ready') === '1') {
        return;
      }

      video.setAttribute('data-ready', '1');

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (requested) {
            play();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', function () {
          if (requested) {
            play();
          }
        }, { once: true });
      } else {
        video.src = streamUrl;
      }
    }

    function start() {
      requested = true;
      shell.classList.add('is-playing');
      video.controls = true;
      attachStream();
      play();
    }

    cover.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(setupPlayer);
  });
})();
